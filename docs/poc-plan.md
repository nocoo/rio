# Rio POC：分层验证与接入说明

状态：计划，待架构 review 后执行。**本文步骤尚未执行，示例 hostname/密钥均为占位。**

目标：从真正部署的 Cloudflare Worker，经受保护的命名 Tunnel 调用本机 default Hermes Gateway，产生可核验的工具结果、流式返回和多轮会话。语音层随后独立验证。

## 1. POC 范围与通过条件

第一轮只接 default；保留现有 LaunchAgent 管理关系。cherry 的绑定和隔离测试在 default 跑通后进行。

必需证据：

- 真实 Cloudflare 部署的 URL、Worker 版本和唯一测试 request ID。
- 本机监听该端口的 PID，能够对应 default 的 `gateway run`。
- 上游 Hermes session/run ID、实际工具事件、完成状态和输出。
- Worker 收到上游首事件的时间、浏览器首事件时间，以及端到端耗时。
- 未授权请求被拒绝、重复提交不重复执行、断线后能找回任务结果。

健康检查通过、模型自己声称“我访问了本机”、mock 工具响应或仅 `wrangler dev` 跑通，都不足以通过。

## 2. 本机准备

1. 确认 default 的当前 PID、活动任务、版本、配置与 `.env` 路径；备份要修改的文件，备份中有凭据时保持私有权限。记录默认与 cherry 的原始状态。
2. 确认 `127.0.0.1:8642` 空闲。合并以下配置到 default 的现有 YAML，不覆盖整个 `gateway` 段：

   ```yaml
   gateway:
     api_server:
       enabled: true
       host: 127.0.0.1
       port: 8642
   ```

3. 在 default 自己的 `.env` 中保存新生成的高熵 `API_SERVER_KEY`，权限设为 `0600`。不复用示例字符串、不放 URL/query string、不提交 Git；检查已有 `API_SERVER_*` 环境变量是否覆盖 YAML。
4. 通过既有 supervisor 重新加载/重启 default，避免启动第二个争抢同一 profile 的 Gateway；先等待活动任务进入可中断边界。实施时核对本机 CLI 支持的具体命令。
5. 用受保护的凭据文件执行 loopback GET：`/health/detailed`、`/v1/capabilities`。记录是否支持 runs、events、stop、steer、approval、session history、idempotency。
6. 确认端口所有者为 default Gateway，并核对 `api_server` 工具集合。为 Rio 创建新会话，不继续现有 Telegram/Discord 对话。

当前本机代码为 0.21.1，已经包含相关接口。若实际能力不足，记录差异，先评估升级与 supervisor 兼容性，不在这一轮默默替换运行环境。

## 3. 命名 Tunnel 与 Access

设置 UI 展示此流程和连接诊断；不要求网页持有创建 Cloudflare 基础设施的权限。

1. 选择已托管在 Cloudflare 的域名。以下用 `rio.example.com`（网页）和 `rio-gw-mac-default.example.com`（Gateway）举例。
2. 只读检查当前 Tunnel、Access application/policy、DNS，确认不会占用已有 hostname。
3. 为 Gateway hostname 创建专用 Access application，策略为 **Service Auth**，只允许 Rio 专用 service token；未匹配请求拒绝。不要使用公开 Bypass policy。
4. 在 Cloudflare **Networking → Tunnels** 新建命名 Tunnel，例如 `rio-mac`，选择远程管理。把 connector token 保存到权限为 `0600` 的本机文件。
5. 本机启动 connector 时使用文件传入，避免把 token 展示在命令行参数或日志中：

   ```sh
   cloudflared tunnel run --token-file /Users/nocoo/.config/rio/tunnel.token
   ```

   该路径是拟定位置，文件须由实际创建流程写入。长期运行使用单独的 LaunchAgent，后续检查退出与自动恢复；不更换已有其他项目的 connector。

6. Tunnel 添加 **Published application** route：Gateway hostname → `http://127.0.0.1:8642`。先有 Access 策略再发布 route。
7. 对该 hostname 验证：无 service token 被 Access 拦截；正确 service token、错误 Hermes key 被 Hermes 拒绝；两层都正确才可调用 API。
8. 文本流使用命名 Tunnel。`cloudflared tunnel --url ...` 所创建的 Quick Tunnel 不支持 SSE，不能用于本项目的流式验收。

同机器增加 cherry 时：独立的 8643 端口、profile key、受保护 hostname 和 Rio 绑定；可以复用这个 named tunnel。跨机器使用相应机器的 connector 和独立绑定。

不要让一个“同名 Tunnel 的 HA connector”随机把同一个 Gateway hostname 路由到身份不同的机器。HA replica 只适用于实际提供同一 origin 的情况；本项目的机器/Agent 路由必须确定。

## 4. Worker 最小实现边界

| Rio 接口（拟定） | 行为 |
| --- | --- |
| `GET /api/agents` | 返回所有者可用的绑定名称和最近状态，不返回密钥 |
| `POST /api/conversations` | 固定 gateway 归属，创建独立 Hermes session |
| `POST /api/conversations/{id}/runs` | 验证输入与归属，生成/复用 request ID，提交到固定 Gateway |
| `GET /api/runs/{id}/events` | 唯一上游 SSE 订阅，流式返回，禁缓存 |
| `GET /api/runs/{id}` | 补偿查询真实状态 |
| `POST /api/runs/{id}/stop`、`.../steer`、`.../approval` | 只允许操作当前用户拥有的 run；审批限精确待审批项 |

文本 POC 没有 OpenAI key 也必须完整可运行。普通 Fetch 请求只处理本次 HTTP 生命周期；不把长期任务藏进 Worker 全局变量或返回后的后台 promise。真正的任务由 Hermes 运行，持久化归属使用 D1。

所有上游 URL 来自已验证绑定；不提供任意 URL/path 的透明代理。加入固定 Access 认证和 Hermes Bearer header；上游错误按层区分：登录失效、Access 拒绝、Tunnel 离线、Gateway 拒绝、模型失败、任务取消。

网页 Access 覆盖静态资源与 API；关闭未保护的备用入口。设置保存与 WebSocket/POST 控制请求验证 Origin。浏览器通过同源 SSE 消费，解析流时支持分片、多行、UTF-8 和心跳注释。

## 5. 文本验收矩阵

| 验证 | 实际操作 | 必须留下的证据 |
| --- | --- | --- |
| 真实本机工具 | 在本机测试目录创建一次性随机 nonce 文件；从远端页面要求 Agent 用工具读取该路径。请求中不包含 nonce 内容 | 实际工具事件、准确 nonce、default 的 run/session ID；nonce 不是凭据 |
| 多轮连续 | 同一 session 第二轮引用第一轮结果，保持 `session_id`；新会话不继承对话内容 | 历史查询与两轮输出；不把同 profile 的长期记忆误当成会话隔离失败 |
| 流式双向 | 输出过程中从另一 HTTP 请求发送 steer/stop | 浏览器持续收到事件；控制到达 Hermes，stop 最终进入终态 |
| 工具确认 | 在明确需要审批的安全测试动作上拒绝，再对另一次动作单次允许 | `approval.request`、精确 request ID、deny/once 结果；不改全局永久策略 |
| 幂等 | 相同 request ID、相同 payload 重复创建，再用同 ID 改 payload | 同一 run ID、replayed；不同 payload 409；工具不重复执行 |
| 浏览器断线 | 断开事件消费，再经 Worker 查询 run 与 session history | 找回最终结果，不重新提交原任务；不要求已消费 SSE 自动补发 |
| Tunnel 离线 | 暂停 Rio 专用 connector，调用相同入口后恢复 | 明确的可恢复错误、恢复后的成功；无无限重试或重复任务 |
| 两层认证 | 缺 Access token、错误 Hermes key、未登录访问 Rio | 分别拒绝；无密钥出现在网页响应、URL 或日志 |
| 归属校验 | 对不属于当前 conversation/gateway 的 run 执行 status/stop | 拒绝，不能靠更换 ID 越过路由边界 |
| Profile 隔离 | default 验收后再给 cherry 独立绑定，读两个不同 nonce 文件并交叉使用 key | 响应对应正确 profile，错误 key 被拒绝；未绑定 agent 不可被选中 |

首次轮次记录实际耗时分解，不提前把某个毫秒数字写成性能承诺。通过后输出一次完整 trace 和已知限制，再进入语音层。

## 6. 语音层独立验证

先使用合成转写/委派事件验证应用协调逻辑，再进行真实的短时语音测试。模拟只验证 Rio 的逻辑，不能替代全双工模型和 WebRTC 实测。

第一批真实测试：

1. 手机 Safari / Android Chrome 与桌面 Chrome 的用户手势启动、麦克风权限、听说、扬声器回声和结束。
2. 明确需要工具的语音请求，观察一次 Live delegation 到同一已验证 Hermes 通道的执行，再听到与实际结果相符的语音。
3. “是的”“改成星期四”和中文姓名/数字，确保 recent context 有效；委派到达但转写未齐时不执行空任务。
4. 用户在播报中插话，同时核对语音停止、Hermes 的继续/steer/stop 状态和迟到结果隔离。
5. 断网、刷新、切换 Agent、provider 错误、预算用尽时，正确关闭或重建 Live session；任务已执行的事实不丢失。
6. `session.closed` 与最终 `usage.seconds` 对账；静音不被误报成已停止计费。

建议首批累计目标为 20 分钟语音活跃时间，约 $1 的 Live 时长费用，Hermes/Cloudflare 另计。创建失败的初始化费用和关闭未确认的会话另记，不把这个估算当作供应商侧硬封顶。服务端必须限制单次时长、并发和重试。

provider 设置支持：名称、base URL（默认 `https://api.openai.com/v1`）、API key、`gpt-live-1`、voice。保存只校验配置结构；真实语音验证通过显式“测试语音”启动，会产生语音费用。标准 Chat Completions proxy 不得显示为已验证 Live provider。

## 7. 回滚

- 停止 Rio 测试 run，并确认实际终态；关闭所有由 Rio 创建的 Live session。
- 关闭 Rio 的 Worker 路由与专用 connector，撤销对应 service token；仅移除 Rio 创建的 DNS/Access/Tunnel 资源。
- 恢复 default 的配置备份并通过原 LaunchAgent 重载，确认原有消息平台恢复。
- 测试用 session/nonce 文件按记录清理；不删除用户原有会话、记忆、profile 或其他项目的 Cloudflare 资源。

执行依据和官方链接见 [架构提案的资料索引](architecture.md#10-资料索引)。
