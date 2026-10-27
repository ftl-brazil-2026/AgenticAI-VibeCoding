# Agentic Software Development & Vibe Coding Training Series — Roadmap Synthesis

*UNDP Istanbul International Center for Private Sector in Development (IICPSD) · UN Volunteer trainers*

## 1. Purpose

This roadmap focused for researchers and early-career professionals, from Least Developed Countries and developing economies from no prior experience with AI coding agents to shipping a small, tested and deployed product. It is built around the real constraints of this audience, especially no GPU, no paid AI subscriptions and unreliable connectivity.


## 2. Learning Goals

**Starting point:** the learner may never have used a terminal, Git or an AI coding agent, and may have no GPU and no paid AI subscription.

By the end of the series, every learner should be able to:

- Use a terminal, Git and GitHub to create, version and share a project.
- Tell apart chat, vibe coding and agentic engineering, and explain what an LLM, an augmented LLM, a workflow and an agent are.
- Recognise hallucination, insecure code and technical debt in AI output, and apply basic data-privacy rules.
- Choose a tool path (zero-cost, balanced, premium or private/local) using its cost, safety and effort.
- Configure a coding agent, keep secrets out of code and write a project rules file.
- Turn a real business need into a specification and drive an agent from it.
- Explain the plan-act-observe loop, implement tool calling and set permissions with human approval.
- Judge when a multi-agent setup is worth using, and run one safely.
- Turn acceptance criteria into automated tests, CI checks and simple evals.
- Audit, debug and roll back AI-generated code.
- Manage context for large codebases and for small local models.
- Deploy a project from CI to a live URL, with secrets, logging and cost control.
- Deliver a capstone micro-product with a spec, tests, CI, a README and a demo.

The guiding rule from the meeting still applies: every graduate should be efficient in at least one area, not superficially aware of all of them. All learners follow the same roadmap.

## 3. Design principles

The following design decision were taken from the alignment meeting of UNV.

**One roadmap, not a list of lectures.** Every session is a learning component on a shared path from point A to point B (Alan).

**Shared vocabulary first.** Session 1 defines LLM, augmented LLM, workflow and agent once, and every trainer uses those terms the same way (Alan).

**A ladder with less repetition, but friendly to drop-ins.** Each concept has one owning session. Later sessions open with a three-to-five-minute recap and a link to the owning recording rather than re-teaching it.

**Depth over breadth.** The series teaches the top three or four tools in each category in depth, instead of skimming the whole ecosystem.

**Real workflows, with notebooks as companions.** Practice happens in the terminal, the IDE and Git, because that is how agentic coding is done in practice. Notebooks, which the ToR lists among supporting materials, accompany the sessions where they genuinely help, such as building an agent loop or running evals.

**Explicit cost, safety and effort paths.** Learners choose between zero-cost, balanced, premium and private/local paths with their trade-offs spelled out (Alan, Akshi).

**Privacy by default.** Private, personal or organizational data never goes into external AI tools. Exercises use synthetic or public data, and sensitive work uses local models (Ruiya).

**Horizontal expertise.** Volunteers bring different niches, such as geospatial data science, workflow automation with self-hosted n8n (Seth), UN IT practice and solution architecture. Sessions can include short expert spotlights, and session length is flexible around a 60-minute target (Emanuel).

**The zero-cost guarantee.** Every exercise and the capstone must be completable with an ordinary laptop or a browser and no paid tools. Premium tools can be demonstrated, but every demo also shows the free equivalent.

## 4. Tool paths

| Path | Examples | Cost | Safety | Effort |
|---|---|---|---|---|
| **Zero-cost** (default for exercises) | Aider, Cline or Continue with free API tiers; Gemini CLI; GitHub Copilot Free; GitHub Codespaces; self-hosted n8n | USD 0 | Medium: free tiers may use prompts for training | Medium |
| **Balanced** | Pay-as-you-go API key with a spending cap; one entry-level IDE agent plan; n8n on a cheap server | About USD 5–20 per month | Medium to high | Low to medium |
| **Premium** (demo only) | Claude Code, OpenAI Codex, paid Cursor or Windsurf | USD 20+ per month | High on enterprise plans | Low |
| **Private / local** | Ollama or LM Studio with small quantized coding models | USD 0 software, hardware-bound | Highest | High |

Free tiers and prices change often, so every free-tier option must be re-checked the week before the session that uses it.

## 5. The learning path

The path has four phases: Foundation, Core Mechanics, Quality & Scale, and Ship. Every live session follows the same template: entry recap, objectives, concept, live demo (premium tool plus its free equivalent), real-world use case, hands-on exercise, and deliverable.

| # | Session | Phase | What learners will be able to do | Real-world use case | Deliverable |
|---|---|---|---|---|---|
| 0 | Onboarding & command-line survival kit (async) | Foundation | Use a terminal, Git and GitHub; set up VS Code or a browser Codespace; store an API key safely | Setting up a reproducible workspace for a team project | Passing environment check and a pushed "hello-agent" repo |
| 1 | Introduction to the vibe paradigm | Foundation | Place chat, vibe coding and agentic engineering on a spectrum; tell an LLM, augmented LLM, workflow and agent apart; spot hallucination, insecure code and technical debt; apply privacy rules | A one-page tool for a local cooperative, built three ways and compared | Small working artifact and a short critique |
| 2 | Architecting & configuring the AI workspace | Foundation | Choose a tool path with a cost, safety and effort matrix; configure an agent with a free or local model; manage secrets; write a project rules file | Choosing a setup for an NGO that cannot send data to external services | Working workspace and a committed AGENTS.md |
| 3 | Development paradigms | Core Mechanics | Choose between vibe iteration, spec-driven development and orchestration; turn a business requirement into a spec; drive an agent from it | A market-price tracker or a clinic queue page specified from a real need | spec.md and its implementation (reused in later sessions) |
| 4 | Agentic mechanics: planning & tool use | Core Mechanics | Explain the plan-act-observe loop; implement tool calling; understand MCP; set permissions and human approvals | An assistant that looks up data and drafts a weekly report | Mini agent or n8n workflow with a logged run; companion notebook |
| 5 | Managing multi-agent teams | Core Mechanics | Use orchestrator-worker and planner-coder-reviewer patterns; run agents in parallel safely; judge when multi-agent setups are not worth it | Splitting a feature for a small business website across agents | Pipeline with reviewer output on a real change |
| 6 | The safety net: automated validation & evals | Quality & Scale | Turn acceptance criteria into tests; add linting and security checks; set up CI; write simple evals for LLM features | Making sure a public-service form never accepts invalid data | Passing CI and at least five meaningful tests; companion eval notebook |
| 7 | Debugging in the agentic age | Quality & Scale | Audit AI-generated code; give agents good error context; escape the "fix loop"; roll back with Git; refactor technical debt | Fixing a broken AI-built donation page | Bug report and fix with regression tests |
| 8 | Context engineering & large codebases | Quality & Scale | Manage the context window; build a context pack; use docs and code search to cut hallucinations; adapt to small local models | Contributing to an existing open-source civic-tech project | Context pack and a scoped pull request |
| 9 | AI-first SDLC: deployment & operations | Ship | Deploy from CI to a free host; handle production secrets, logging and monitoring; control API costs; plan rollbacks | Putting the session 3 project online for real users | Public URL and deployment workflow |
| 10 | Capstone: an autonomous micro-product | Ship | Run the full cycle in a team, from problem and spec through build, tests and deployment to a demo, and justify the chosen tool path | Team briefs drawn from SDG problems or learners' own work | Repo with spec, tests, CI and README, plus a live URL or a three-minute demo |

The ordering rules are that introductions (sessions 0 to 3) always come first, session 4 must precede session 5, and session 6 must precede sessions 7 and 9. Session 8 can move anywhere after session 4 if trainer availability requires it.

## 6. Limitations and workarounds

| Limitation | Effect on learners | Workarounds |
|---|---|---|
| **No GPU or a low-spec laptop** | Cannot run large local models; slow builds | Use hosted free-tier models, so the GPU is the provider's. Run small quantized models on CPU with 8–16 GB of RAM. Use Codespaces, Colab or Kaggle for heavier work. No exercise requires a GPU. |
| **No paid AI tools** | No access to paid agent plans | Open-source agents work with any model. Use free tiers such as Gemini CLI and Copilot Free, and the GitHub Student Developer Pack where eligible. Rotate providers when rate limits hit and keep tasks small. Organizers can explore sponsored credits for the capstone. |
| **No international payment card** | Many "free" tiers require card verification | Prefer services that need only a Google or GitHub login, publish a vetted no-card list before launch, and fall back to local and self-hosted tools. |
| **Services unavailable in some countries** | Learners blocked from a provider the class depends on | Every exercise lists at least two model options, with open-weight local models as the universal fallback. Check provider country lists against participant countries. |
| **Low bandwidth or power cuts** | Missed sessions; large model downloads fail | Record every session, offer low-resolution downloads, PDF slides and transcripts, keep exercises lightweight, state download sizes in advance and accept asynchronous submissions. |
| **No command-line or programming background** | Learners stall on setup | Session 0 with a live help clinic, a shared glossary, a common-errors FAQ and peer mentors in capstone teams. |
| **Locked-down work computers** | Cannot install tools | A browser-only path through Codespaces and web assistants. |
| **Sensitive or regulated data** | Cannot use hosted tools on real work | Synthetic or public data in exercises, the private/local path for sensitive work, and a checklist of what never goes into a prompt. |
| **Time zones and missed sessions** | Learners lose the thread of the ladder | Entry recaps, the concept-ownership map, an asynchronous forum and office hours that rotate across time zones. |
| **Non-native English or disabilities** | Reduced comprehension in fast live sessions | Plain-language slides, captions and transcripts, high-contrast templates, narrated demos and a glossary. |


