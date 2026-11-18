# Security Policy

## Supported version

The project maintains the current `main` branch. Security fixes are applied there and flow into active course sessions through the normal pull-request and Pages deployment process. Historical course snapshots and forks are not maintained by the upstream project.

## Report a vulnerability privately

Do not disclose an unpatched vulnerability, credential, private record or exploit detail in a public issue, discussion or pull request.

1. Open the repository's **Security** tab.
2. Select **Advisories** and then **Report a vulnerability**.
3. Describe the affected file or workflow, impact, reproduction steps and any suggested mitigation. Remove real credentials and personal data from evidence.

If **Report a vulnerability** is unavailable, private vulnerability reporting has not been enabled. Contact the repository owner through their GitHub profile with only a request to establish a private reporting channel; do not include vulnerability details in that public message.

Maintainers aim to acknowledge a report within 48 hours and provide an initial remediation plan within five business days. Timelines may change for volunteer availability or coordinated disclosure with an affected provider.

## Data policy for agent labs

The agent labs are educational and must use synthetic data.

1. **No real secrets.** Do not commit or paste API keys, passwords, tokens, cookies, certificates or production credentials. Empty examples belong in `.env.example`.
2. **No personal data.** Do not process or log names, identifiers, contact details, health records, case records or other personally identifiable information.
3. **No production systems.** Lab tools must operate only on copied `SYN-*` fixtures. Do not connect them to production APIs, databases, MCP servers or cloud accounts.
4. **Minimized audit data.** Guardrail audit events contain request IDs, tool names, hashes, statuses and reason codes. They must not contain prompts, tool parameters, fixture contents or credentials.
5. **Short retention.** Local JSONL audit files are ignored by Git and should be deleted after the exercise. CI retains synthetic audit artifacts for seven days.
6. **Layered isolation.** Local Python enforces request, tool, approval and path policy. Only the CI container enforces operating-system network and read-only-filesystem boundaries. Environment variables such as `LAB_OFFLINE` are advisory unless the launcher or named software enforces them.

For prompting practices that keep lab work inside these rules, see [Secure vibe coding for learners](governance/SECURE-VIBE-CODING.md).

## Repository security controls

When present on `main`, source-controlled controls include job-scoped GitHub Actions permissions, immutable direct action references, calendar URL validation, deterministic guardrail tests and short artifact retention. Check the default branch and passing workflows before relying on a control. Repository settings such as branch rulesets, private vulnerability reporting, CodeQL, Dependabot alerts, secret scanning and push protection require maintainer configuration and cannot be inferred from source files.

See [`governance/MAINTAINER-SETUP.md`](governance/MAINTAINER-SETUP.md) for required settings and [`governance/OPERATIONS.md`](governance/OPERATIONS.md) for deployment and rollback procedures.
