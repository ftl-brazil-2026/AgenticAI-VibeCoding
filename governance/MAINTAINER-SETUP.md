# Maintainer setup checklist

These settings require administrator or owner access to `ftl-brazil-2026/AgenticAI-VibeCoding`. Source files cannot enforce them.

## 1. Merge governance

Create an active branch ruleset for `main` under **Settings → Rules → Rulesets**.

- [ ] Target the default branch, `main`.
- [ ] Require changes through a pull request.
- [ ] Require at least one approval when another maintainer is available.
- [ ] Require the `build` status check.
- [ ] Require the branch to be current before merging if the team accepts the extra update burden.
- [ ] Block force pushes and branch deletion.
- [ ] Disable bypass for contributors; keep only the minimum emergency administrator bypass.

Do not require a path-filtered check globally. The `guardrails` check runs only when the lab, its fixtures or its workflow changes.

## 2. Current merge sequence

- [ ] Merge #2 and #6 to restore student-facing links.
- [ ] Merge #3 to apply job-scoped permissions and direct action pins.
- [ ] Merge #7 after #3 to pin the nested artifact action and retain Pages artifacts for seven days.
- [ ] Merge #4 after its 38 URL-validation tests pass.
- [ ] Merge #5 after confirming its documentation-versus-enforcement scope.
- [ ] Open and merge the internal/external link-monitoring PR after #2 and #6.
- [ ] Open and review the ARCH-03 runtime PR after #5.
- [ ] Merge this governance documentation after private vulnerability reporting is enabled.

Watch the first `main` deployment after #3 and #7. Pull-request runs skip deployment, so a push to `main` is the first real test of the changed deployment path. A failed deployment leaves the previous Pages version live.

## 3. Private vulnerability reporting

Under **Settings → Code security and analysis**, enable **Private vulnerability reporting**. Verify that a user without repository write access can see **Security → Advisories → Report a vulnerability**. The root `SECURITY.md` relies on that channel.

## 4. Secret scanning and push protection (ARCH-04)

- [ ] Enable secret scanning.
- [ ] Enable push protection.
- [ ] Enable validity checks and generic-secret detection when available for this public repository.
- [ ] Review existing alerts before closing them.
- [ ] Treat every confirmed credential as compromised: revoke and rotate it at the provider before removing it from code.
- [ ] Complete a one-time scan of all branches, tags and Git history with an approved scanner such as gitleaks or TruffleHog. Store the report privately and never upload discovered secrets as a CI artifact.

GitHub secret scanning and a local historical scan complement each other. `.gitignore` does not remove data from prior commits.

## 5. Code and workflow scanning (ARCH-02)

- [ ] Enable CodeQL **Default setup** for every supported language GitHub detects.
- [ ] Confirm code-scanning results appear under **Security → Code scanning**.
- [ ] Enable Dependabot alerts and Dependabot security updates.
- [ ] After #3 merges, confirm weekly GitHub Actions version-update PRs are created from `.github/dependabot.yml`.
- [ ] Review workflow changes as executable code, especially changes to permissions, triggers, action references and shell interpolation.

The Dependabot file in #3 schedules version updates for action references. It does not itself enable Dependabot alerts or security updates; those are repository settings. Do not assume CodeQL's language selection covers every workflow policy error. Keep `actionlint` and review action permissions separately.

## 6. Pages and artifacts

- [x] The `github-pages` environment only accepts deployments from `main` (verified 2026-11-17).
- [ ] Confirm the Pages source remains **GitHub Actions**.
- [ ] Confirm Pages artifacts expire after seven days once #7 merges.
- [ ] Confirm guardrail audit artifacts expire after seven days once ARCH-03 merges.
- [ ] Restrict environment administrators to the minimum maintainer set.

## 7. External services and forks

- [ ] Verify Microsoft Forms response permissions and data collection settings.
- [ ] Verify Teams event access.
- [ ] Verify Google Drive folder sharing for course materials.
- [ ] Disable Pages or Actions on contributor forks before syncing a workflow that deploys from fork `main`.

## Evidence to record

For each setting, record the date, maintainer and a screenshot or settings URL in the roadmap issue. Never include tokens, secret values or personal learner data.
