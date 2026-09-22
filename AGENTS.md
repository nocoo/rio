# Rio

Research-stage web voice interface for local Hermes agents. The tracked project
contains design documents, not an implemented application or verified deployment.
[README.md](README.md) describes the current stage; do not report proposed
architecture, ports or providers as deployed facts.

## Scope and sources

This is the only maintained project handbook. Do not create CLAUDE.md, a
compatibility import, symlink or duplicate. Preserve meaningful future nested
instructions within their own scope.

- [Architecture proposal](docs/architecture.md): protocol research, ownership,
  security, routing and evidence boundaries.
- [POC plan](docs/poc-plan.md): phased acceptance, setup and rollback proposals.
- [Experience design](docs/experience.md): browser/mobile interaction proposals.
- [Retrospective.md](Retrospective.md): incidents, separate from design decisions.

The documents include dated observations of the local machine and upstream
versions. Recheck those facts before authorized implementation; do not infer
current service state from a recorded PID or historical repository visibility.

## Project boundaries

- Build a working text round trip before adding voice. Hermes owns reasoning,
  tools, memory and approvals; the proposed voice layer handles voice interaction
  and delegation. Do not introduce another agent backend implicitly.
- Reuse the selected Gateway's supported API and capability discovery. Each
  profile remains an independent binding with explicit identity and credentials.
  Rio sessions must not silently take over existing messaging conversations.
- Preserve explicit user/conversation/gateway/session/run ownership on every
  status, stop, steer and approval request. Browser IDs never authorize arbitrary
  upstream URLs, paths or profiles.
- Preserve fail-closed browser Access, separate Gateway Service Auth and Hermes
  API credentials, Origin checks, idempotency, bounded retries and stream cleanup.
  Keep all credentials out of Git, URLs, browser persistence and logs.
- Keep ignored `reference/` research checkouts separate from the running Hermes
  installation. Do not upgrade, restart or rewrite live Gateway/profile settings
  as a side effect of documentation work.
- Proposed Tunnel, DNS, Access, Worker and voice-provider operations require
  authorization for those operations. Paid/live tests are not routine checks.
  Rollback and cleanup target only resources owned by the authorized experiment.
- Distinguish proposed decisions, verified capabilities and actual acceptance
  results. Synthetic events do not prove real voice or tool execution.

## Commands and verification

From the repository root, Git is sufficient for document review. There is no
tracked package manifest, build, test runner, application setup or hook installer.
Do not invent such commands or execute the POC runbook just to validate an edit.

```sh
git diff --check
git diff -- README.md AGENTS.md docs/ Retrospective.md
```

Verify relative links and review source references against their recorded dates.
The POC plan contains operational examples, not automatic development checks.
Keep secrets and local machine configuration outside the repository.

## Quality contract and current evidence

6DQ retains its name; former G1 belongs to unified L1 since 2026-09-21. Use
`enforced`, `planned`, `manual`, or justified `N/A`; no tracked CI or project
commit/push gates currently enforce these requirements.

| Dimension | Current applicability and required follow-up |
| --- | --- |
| L1 | N/A for current runtime UT/types: no executable application. Manual document review applies now. Once code exists, require four coverage metrics each >=95%, strict check-only types/lint with zero errors/warnings, no skipped/focused tests, index-snapshot pre-commit and proven failure rejection. |
| L2 | N/A for current executable endpoints: none implemented. Planned POC acceptance must distinguish controlled local integration from explicitly authorized live Gateway/Tunnel trials. |
| L3 | Manual design review now; real text/voice user acceptance is planned and cannot be claimed from protocol research. |
| G2 dependencies | N/A: no tracked executable dependency manifests or lockfiles. Ignored reference repositories retain their own dependencies. |
| G2 secrets | Planned: a required secret scan must fail if its scanner is absent. No automatic scanner currently protects public research documents. |
| D1 isolation | N/A for current automated fixtures: none exist. Future tests require owned per-run local state separate from production/daily use, guards before fixture writes/cleanup and SQLite test markers where applicable. No remote test-resource deployments. |

Future targets: unified L1 on the index snapshot in pre-commit (<30s), applicable
L2/G2 against stdin push refs in pre-push (<3min), and controlled L3 entrypoints.
Never present these targets as implemented or bypass checks to publish.

## Completion

Keep the README stage and design evidence consistent. Report actual document
checks, unverified claims and remaining work. Publish only within the authorized
scope, using explicit staged paths and an atomic commit. Record incidents in the
retrospective without inventing dates or events; recurring constraints stay here.
