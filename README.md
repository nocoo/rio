# Rio

A lightweight web voice interface for local Hermes agents, with Cloudflare Access, Workers, and Tunnel.

Rio separates the GPT-Live voice layer from Hermes reasoning and tool execution. Each local Gateway profile is an independently selectable agent.

Current stage: architecture research and review. The first planned proof of concept is a real text round trip from a deployed Worker to the local default Gateway; voice follows after that path is verified.

## 方案评审

- [可行性调研与架构](docs/architecture.md)：GPT-Live、Hermes、Cloudflare 的证据、职责和安全边界。
- [分层 POC 与接入说明](docs/poc-plan.md)：default Gateway、命名 Tunnel、真实工具验证及回滚。
- [网页与移动端体验](docs/experience.md)：语音主界面、沉浸式设置和动画方向。

Research checked on September 20, 2026. No POC deployment or paid voice API test has been performed. Local upstream research checkout: `reference/hermes-agent` (ignored by Git).
