# Deployment, artifact and rollback operations

## Deployment path

1. A pull request runs the Pages `build` job with read-only repository access.
2. Quarto renders source into `docs/` and validation gates run.
3. The build uploads a `github-pages` artifact.
4. Pull requests skip `deploy`.
5. A merge to `main` rebuilds the site. Only the `deploy` job receives `pages: write` and `id-token: write` and may publish to the `github-pages` environment.

The deployment job publishes the artifact produced by the build. Action pinning and review protect that artifact boundary; the permission split alone does not validate its content.

## Pre-merge checklist

- [ ] The pull request targets `main` and has the required approval.
- [ ] `build` passes on the latest commit.
- [ ] Source files and their intended generated `docs/` outputs are both present.
- [ ] `git diff docs/` contains no unrelated stylesheet hash or timestamp churn.
- [ ] Security-sensitive workflow references use reviewed full commit SHAs.
- [ ] No credentials, private data or local audit logs appear in the diff.

## Verify a deployment

After merging a workflow or content change:

1. Open **Actions → Build and deploy site**.
2. Confirm the run uses the expected merge commit.
3. Confirm `build` and `deploy` succeed.
4. Open the environment URL from the `deploy` job and verify the affected pages.
5. Record the run URL, commit SHA and verification result in the pull request or roadmap issue.

A failed deployment does not erase the previously published Pages site. Do not force-push or bypass review to repair it.

## Preferred rollback

Use a reviewed revert so source, Git history and the deployed site remain consistent.

1. Identify the merge commit that introduced the problem and its successful or failed Actions run.
2. Create a rollback branch from the current `main`.
3. Revert according to the commit shape:
   - for the repository's usual two-parent merge commit, run `git revert -m 1 <merge-commit-sha>`;
   - for a squash or other single-parent commit, run `git revert <commit-sha>`.
   Do not rewrite history.
4. Open a pull request titled `revert: <original PR title>` and link the incident and original PR.
5. Require the normal `build` check and review.
6. Merge the revert. The workflow rebuilds the previous source state and deploys it.
7. Verify the live site and record the rollback run URL.

If the broken change altered more than one dependent PR, revert in reverse merge order. Prefer a new corrective PR when a revert would remove unrelated valid work.

## Artifact retention and traceability

- Pages build artifacts are retained for seven days after #7.
- Synthetic guardrail audit artifacts are retained for seven days after ARCH-03.
- Artifacts support investigation and comparison; they are not the primary rollback mechanism.
- Never upload environment files, credentials, private reports or personal data as artifacts.
- Audit artifacts contain only synthetic request IDs, tools, hashes, statuses and reason codes.

Downloading and manually republishing an old artifact bypasses the normal source build and review trail. Use a revert unless the maintainer has declared an incident and independently verified the artifact and commit.

## Generated documentation discipline

`docs/` is generated, while the Markdown and QMD files outside `docs/` are source. Edit the source first, run the pinned Quarto version, then inspect the generated diff. A future consistency gate should fail when rendering produces uncommitted `docs/` changes, after the current stylesheet baseline and queued PRs are synchronized.

## Incident notes

For a deployment incident, record:

- detection time and reporter;
- affected URL and user impact;
- merge commit and workflow run;
- whether the previous site remained available;
- rollback or corrective PR;
- verification time;
- follow-up control or test.

Do not put vulnerability details, credentials or personal data in a public incident note. Use the private vulnerability-reporting channel when disclosure would increase risk.
