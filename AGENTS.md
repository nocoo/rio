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

Follows `system1-quality`; CI slots and pinned `nocoo/base-ci@3703a073693d598159e87f77f99587e586c14cfe` (`v2026.24`) live in [.github/workflows/quality-slots.yml](.github/workflows/quality-slots.yml), invoked by [.github/workflows/pipeline.yml](.github/workflows/pipeline.yml) (`quality / Z1: Gate` required on `main`). Enforced CI slots: `S1`, `S2`, `S3`, `G1`, `G2`, `B1`, `L1`, `P1`, `Z1`; `L2`, `L3`, `L4` are `N/A`. CD runs `D1`–`D5` Worker deployment via `deploy-worker.yml` on `main` push (or `workflow_dispatch` with `deploy=true`), reusing `B1` (`rio-dist`) and verifying `https://rio.hexly.ai/api/live`. Status vocabulary: `enforced`, `planned`, `manual`, `N/A`.

## Completion

Keep the README stage and design evidence consistent. Report actual document
checks, unverified claims and remaining work. Publish only within the authorized
scope, using explicit staged paths and an atomic commit. Record incidents in the
retrospective without inventing dates or events; recurring constraints stay here.
