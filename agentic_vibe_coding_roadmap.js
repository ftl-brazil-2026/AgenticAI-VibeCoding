/**
 * UNDP IICPSD — Agentic Software Development & Vibe Coding Training Series
 * Learning roadmap (data is plain JSON; helpers at the bottom validate it).
 *
 * Sources: UNV Terms of Reference + volunteer kick-off meeting
 * (Emanuel, Alan, Akshi, Ruiya, Seth, Serra).
 *
 * NOTE: free tiers, quotas and tool pricing change often.
 * Every item flagged "verify_before_launch": true should be re-checked
 * the week before the session that uses it.
 */

const roadmap = {
  "programme": {
    "name": "Agentic Software Development & Vibe Coding Training Series",
    "organizer": "UNDP Istanbul International Center for Private Sector in Development (IICPSD)",
    "format": "Online, live sessions + recordings + async exercises",
    "audience": "Students, researchers and early-career professionals from LDCs and developing economies",
    "expected_participants": { "applicants": 363, "expected_active": 200 },
    "entry_policy_proposal": "Inclusive: no hard STEM filter. Mixed backgrounds handled by Session 0 pre-work and learner tracks (to be confirmed with organizers).",
    "timeline": {
      "launch": "Wednesday (date TBD by organizers)",
      "hard_end": "Before the 25th",
      "approx_duration_weeks": 2,
      "pace_note": "10 live sessions in ~2 weeks means ~5 per week. If organizers allow, a 3-week spread would greatly improve completion for working learners."
    },
    "language": "English (plain-language style, captions on recordings)"
  },

  "destination": {
    "point_a": "Learner may have never used a terminal, Git or an AI coding agent, and may have no GPU and no paid AI subscription.",
    "point_b": "Learner can confidently use AI agents in at least ONE track (Builder, Automator or Engineer), knows which tool path fits their cost/privacy constraints, and has shipped a small working, tested, deployed micro-product.",
    "guiding_rule": "Every graduate must be efficient in at least one area, rather than superficially aware of all of them."
  },

  "design_principles": [
    {
      "id": "P1_roadmap_not_lecture_list",
      "principle": "One shared roadmap from point A to point B; every session is a learning component placed on it.",
      "source": "Alan"
    },
    {
      "id": "P2_shared_vocabulary_first",
      "principle": "Settle core terms (LLM, augmented LLM, workflow, agent, tool, context) in Session 1 so every trainer uses them the same way.",
      "source": "Alan"
    },
    {
      "id": "P3_ladder_no_repetition",
      "principle": "Each concept is taught once by its owning session; later sessions link back with a 3–5 minute recap instead of re-teaching.",
      "source": "Serra (question), Emanuel and Alan (answer)"
    },
    {
      "id": "P4_drop_in_friendly",
      "principle": "Every session opens with an 'entry recap' slide, a prerequisite list and links to recordings and the glossary, so someone joining late can catch up.",
      "source": "Serra"
    },
    {
      "id": "P5_go_deep_not_wide",
      "principle": "Cover a few tools deeply (top 3–4 per category) instead of surveying the whole ecosystem at surface level.",
      "source": "Akshi, Emanuel"
    },
    {
      "id": "P6_real_workflows",
      "principle": "Teach in the environments professionals actually use for agentic coding (terminal, IDE, Git). Notebooks are used only as a zero-install fallback, not as the main medium.",
      "source": "Emanuel"
    },
    {
      "id": "P7_cost_safety_effort_paths",
      "principle": "Present explicit tool paths (zero-cost, balanced, premium, private/local) with their cost, safety and effort trade-offs.",
      "source": "Alan, Akshi"
    },
    {
      "id": "P8_privacy_by_default",
      "principle": "Never paste private, personal or organizational data into external AI tools; use synthetic data or local models when data is sensitive.",
      "source": "Ruiya"
    },
    {
      "id": "P9_horizontal_expertise",
      "principle": "Volunteers bring different niches (geospatial, workflow automation, UN IT, solution architecture). Sessions may include short expert spotlights; session length is flexible (~60 min target).",
      "source": "Emanuel"
    },
    {
      "id": "P10_zero_cost_guarantee",
      "principle": "Every hands-on exercise and the capstone must be completable on the zero-cost path with an ordinary laptop or a browser. Premium tools may be demoed, never required.",
      "source": "Accessibility requirement"
    }
  ],

  "learner_tracks": [
    {
      "id": "builder",
      "name": "Builder (Vibe Coder)",
      "for_whom": "Non-programmers and beginners who want to build small web apps and tools for their work or community.",
      "point_b": "Builds and deploys a small web app with an agent, writes a clear spec, and can tell when AI output is wrong.",
      "emphasis_sessions": ["S0", "S1", "S2", "S3", "S7", "S9", "S10"]
    },
    {
      "id": "automator",
      "name": "Automator (Workflows & Agents)",
      "for_whom": "Professionals who want to automate business processes (reports, data pipelines, notifications, chat assistants).",
      "point_b": "Designs and runs an agentic workflow (e.g., self-hosted n8n or a small Python agent) with tools, guardrails and logging.",
      "emphasis_sessions": ["S0", "S1", "S2", "S4", "S5", "S6", "S10"]
    },
    {
      "id": "engineer",
      "name": "Engineer (Agentic Software Engineering)",
      "for_whom": "CS students and developers who want to supervise coding agents on real codebases.",
      "point_b": "Drives coding agents with spec-driven development, tests and CI, works in an existing codebase, and audits AI-generated code.",
      "emphasis_sessions": ["S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10"]
    }
  ],

  "tool_paths": [
    {
      "id": "zero_cost",
      "name": "Zero-cost path (default for exercises)",
      "description": "Free tiers of hosted models + open-source agents + browser-based dev environments.",
      "examples": [
        "Agents: Aider, Cline or Continue (VS Code), Gemini CLI, GitHub Copilot Free",
        "Models: free API tiers (e.g., Google AI Studio, OpenRouter free models, Groq) or local small models via Ollama",
        "Environment: GitHub Codespaces (free monthly hours) or local VS Code",
        "Automation: n8n self-hosted with Docker"
      ],
      "cost": "USD 0",
      "safety": "Medium: free tiers may use prompts for training. Read terms; never send private data.",
      "effort": "Medium: more setup, lower rate limits, smaller models need tighter prompts and context.",
      "verify_before_launch": true
    },
    {
      "id": "balanced",
      "name": "Balanced path",
      "description": "One low-cost subscription or pay-as-you-go API key with a spending cap.",
      "examples": [
        "Pay-as-you-go API via an open-source agent (Aider, Cline) with a monthly cap",
        "Entry-level plan of one IDE agent (Cursor, Windsurf, Copilot)",
        "Self-hosted n8n on a cheap VPS instead of the cloud plan (point raised by Seth)"
      ],
      "cost": "Roughly USD 5–20 per month, capped",
      "safety": "Medium–high: paid API terms usually exclude training on your data (check each provider).",
      "effort": "Low–medium",
      "verify_before_launch": true
    },
    {
      "id": "premium",
      "name": "Premium path (demo only)",
      "description": "Frontier models with full agentic CLIs/IDEs.",
      "examples": ["Claude Code", "OpenAI Codex", "Cursor / Windsurf paid tiers"],
      "cost": "USD 20+ per month or usage-based",
      "safety": "High for enterprise plans; check data-retention settings.",
      "effort": "Low: best tooling, fastest results.",
      "classroom_rule": "Trainers may demo these; every demo must show the zero-cost equivalent of the same concept."
    },
    {
      "id": "private_local",
      "name": "Private / local path",
      "description": "Models run on the learner's own machine or organization's infrastructure; nothing leaves the network.",
      "examples": [
        "Ollama, LM Studio or llama.cpp with small quantized coding models (roughly 1.5B–8B parameters)",
        "Aider / Continue / Cline pointed at a local model endpoint",
        "Organization-hosted open-weight model (as done in some UN IT teams, per Ruiya)"
      ],
      "cost": "USD 0 software; hardware-bound",
      "safety": "Highest: suitable for sensitive data.",
      "effort": "High: weaker models, slower on CPU, more context engineering required."
    }
  ],

  "core_toolset": {
    "rule": "Top 3–4 per category, taught deeply. Volunteers may show others in spotlights.",
    "coding_agents": ["Aider (open source, any model)", "Cline or Continue (VS Code)", "Gemini CLI (free tier)", "Claude Code / Codex (demo, premium)"],
    "local_models": ["Ollama", "LM Studio"],
    "workflow_automation": ["n8n (self-hosted)"],
    "version_control_and_ci": ["Git", "GitHub", "GitHub Actions"],
    "dev_environment": ["VS Code", "GitHub Codespaces (no-install fallback)"],
    "deployment": ["GitHub Pages", "a free static/app hosting tier (e.g., Netlify, Vercel, Cloudflare Pages, Hugging Face Spaces)"]
  },

  "concept_ownership": {
    "rule": "The owning session teaches it; other sessions only recap and link.",
    "terminal_git_basics": "S0",
    "llm_vs_augmented_llm_vs_workflow_vs_agent": "S1",
    "hallucination_and_limits": "S1",
    "data_privacy_basics": "S1",
    "tool_paths_cost_safety_effort": "S2",
    "secrets_and_api_keys": "S2",
    "rules_files_agents_md": "S2",
    "spec_driven_development": "S3",
    "agent_loop_and_tool_calling": "S4",
    "mcp_model_context_protocol": "S4",
    "orchestrator_worker_and_subagents": "S5",
    "tests_ci_evals": "S6",
    "code_auditing_and_tech_debt": "S7",
    "context_windows_and_retrieval": "S8",
    "deployment_monitoring_cost_control": "S9"
  },

  "sessions": [
    {
      "id": "S0",
      "order": 0,
      "phase": "Foundation",
      "title": "Before Day One: Onboarding & Command-Line Survival Kit",
      "tor_topic": "Supports all topics (addresses the CLI gap raised in the meeting)",
      "mode": "Async pre-work (short videos + checklist) with one optional live help clinic",
      "level": "Beginner",
      "prerequisites": [],
      "duration_min": 45,
      "objectives": [
        "Open a terminal on Windows (PowerShell/WSL), macOS or Linux and use basic commands (ls/dir, cd, mkdir, running a program)",
        "Create a GitHub account, clone a repo, commit and push",
        "Set up VS Code locally OR open a browser-based Codespace",
        "Obtain one free model API key and store it safely"
      ],
      "hands_on": "Run the provided environment-check script; push a 'hello-agent' repo to GitHub.",
      "zero_cost_path": "Everything here is free; Codespaces avoids any installation on weak or locked-down machines.",
      "deliverable": "Green environment-check output + link to hello-agent repo",
      "suggested_contributors": ["Emanuel (raised the CLI gap)"]
    },
    {
      "id": "S1",
      "order": 1,
      "phase": "Foundation",
      "title": "Introduction to the Vibe Paradigm",
      "tor_topic": "Introduction to the Vibe Paradigm",
      "level": "Beginner",
      "prerequisites": ["S0"],
      "duration_min": 60,
      "entry_recap": "None (first live session). Walk through the roadmap, tracks and how to catch up on missed sessions.",
      "objectives": [
        "Explain the spectrum from chat-assisted coding to vibe coding to agentic engineering",
        "Distinguish an LLM, an augmented LLM, a workflow and an agent (shared vocabulary for the whole series)",
        "Recognize typical failure modes: hallucination, insecure code, vibe-induced technical debt",
        "Apply basic data-privacy rules when using AI tools"
      ],
      "demo": "Build the same tiny app three ways: copy-paste from chat, IDE assistant, CLI agent. Compare speed, control and quality.",
      "hands_on": "Build a one-page tool with a free assistant, then list three things you would not trust without checking.",
      "zero_cost_path": "Free chat assistant + free-tier agent from S0.",
      "deliverable": "Small working artifact + 5-line critique",
      "suggested_contributors": ["Alan (taxonomy: augmented LLM / workflow / agent)", "Ruiya (data privacy in a UN IT context)", "Serra (introduction to agentic AI)"]
    },
    {
      "id": "S2",
      "order": 2,
      "phase": "Foundation",
      "title": "Architecting & Configuring the AI Workspace",
      "tor_topic": "Architecting and configuring the AI Workspace",
      "level": "Beginner–Intermediate",
      "prerequisites": ["S1"],
      "duration_min": 60,
      "entry_recap": "Vocabulary from S1 (agent vs workflow) and privacy rules.",
      "objectives": [
        "Choose a tool path (zero-cost, balanced, premium, private/local) using a cost/safety/effort decision matrix",
        "Configure one coding agent with a free model, and optionally a local model with Ollama",
        "Manage secrets: .env files, .gitignore, spending caps",
        "Write a project rules file (AGENTS.md or equivalent) to steer the agent",
        "Automator track: run n8n self-hosted with Docker and compare with its cloud plan"
      ],
      "demo": "Same task executed on the hosted free tier vs a local CPU model: show quality, speed and privacy trade-offs.",
      "hands_on": "Set up a complete zero-cost workspace and make the agent edit a file under your rules file.",
      "zero_cost_path": "Aider/Cline + free API tier, or Ollama with a small quantized model on CPU; Codespaces if the laptop is weak.",
      "deliverable": "Working workspace + AGENTS.md committed to the repo",
      "suggested_contributors": ["Akshi (top 3–4 tool selection)", "Alan (cheap / balanced / premium solution paths)", "Seth (self-hosted n8n)"]
    },
    {
      "id": "S3",
      "order": 3,
      "phase": "Core Mechanics",
      "title": "Development Paradigms: Vibe Iteration, Spec-Driven, Agentic Orchestration",
      "tor_topic": "Development paradigms",
      "level": "Intermediate",
      "prerequisites": ["S2"],
      "duration_min": 60,
      "entry_recap": "Workspace + rules file from S2.",
      "objectives": [
        "Know when to use intent-based vibe iteration vs spec-driven development vs orchestration",
        "Decompose a business requirement into a spec: goal, users, constraints, acceptance criteria, task list",
        "Drive an agent task-by-task from the spec"
      ],
      "demo": "Same feature built by pure vibing vs from a spec; compare the resulting code structure.",
      "hands_on": "Write spec.md for a small development-relevant tool (e.g., a market-price tracker or a clinic queue page) and have the agent implement it.",
      "zero_cost_path": "Free-tier agent; spec-driven work helps small models even more.",
      "deliverable": "spec.md + implementation (this project is reused in S6, S7 and S9)"
    },
    {
      "id": "S4",
      "order": 4,
      "phase": "Core Mechanics",
      "title": "Agentic Mechanics: Planning & Tool Use",
      "tor_topic": "Agentic Mechanics: Planning & Tool Use",
      "level": "Intermediate",
      "prerequisites": ["S3"],
      "order_flexibility": "Must precede S5.",
      "duration_min": 60,
      "entry_recap": "Agent definition from S1.",
      "objectives": [
        "Explain the agent loop: plan, act (tool call), observe, repeat",
        "Implement function/tool calling with a free API",
        "Understand MCP and how agents connect to external tools",
        "Set permissions, sandboxing and human-in-the-loop approvals"
      ],
      "demo": "Read the log of a coding agent step by step to see its planning and tool calls.",
      "hands_on": "Engineer/Builder: a minimal agent loop (~100 lines) with one custom tool. Automator: an n8n AI-agent workflow with two tools.",
      "zero_cost_path": "Free-tier API with tool-calling support, or a local model that supports tool calling.",
      "deliverable": "Working mini-agent or n8n workflow with a logged run"
    },
    {
      "id": "S5",
      "order": 5,
      "phase": "Core Mechanics",
      "title": "Managing Multi-Agent Teams",
      "tor_topic": "Managing Multi-Agent Teams",
      "level": "Intermediate–Advanced",
      "prerequisites": ["S4"],
      "order_flexibility": "Can swap with S8 if trainer availability requires.",
      "duration_min": 60,
      "entry_recap": "Agent loop and tool calling from S4.",
      "objectives": [
        "Use orchestrator-worker and planner/coder/reviewer patterns",
        "Run parallel agents safely (separate branches or git worktrees)",
        "Judge when multi-agent setups are not worth their cost and complexity"
      ],
      "demo": "Planner agent splits a feature; two workers implement; reviewer agent comments on the diff.",
      "hands_on": "Build a planner, implementer, reviewer pipeline on the S3 project.",
      "zero_cost_path": "Run the roles sequentially with one free model to stay within rate limits.",
      "deliverable": "Pipeline script/workflow + reviewer output on a real diff"
    },
    {
      "id": "S6",
      "order": 6,
      "phase": "Quality & Scale",
      "title": "The Safety Net: Automated Validation & Evals",
      "tor_topic": "The \"Safety Net\": Automated Validation & Evals",
      "level": "Intermediate",
      "prerequisites": ["S3"],
      "order_flexibility": "Should come before S7 and S9.",
      "duration_min": 60,
      "entry_recap": "Spec acceptance criteria from S3.",
      "objectives": [
        "Turn acceptance criteria into automated tests the agent must pass",
        "Add linters, type checks and basic security scanning",
        "Set up CI with GitHub Actions",
        "Write simple evals for features that call an LLM"
      ],
      "demo": "Agent introduces a regression; CI catches it.",
      "hands_on": "Add tests + CI to the S3 project; let the agent make a failing test pass without editing the test.",
      "zero_cost_path": "GitHub Actions free minutes on public repos.",
      "deliverable": "Passing CI pipeline + at least 5 meaningful tests",
      "verify_before_launch": true
    },
    {
      "id": "S7",
      "order": 7,
      "phase": "Quality & Scale",
      "title": "Debugging in the Agentic Age",
      "tor_topic": "Debugging in the Agentic Age",
      "level": "Intermediate",
      "prerequisites": ["S6"],
      "order_flexibility": "Never before S1–S3 (introductions first).",
      "duration_min": 60,
      "entry_recap": "Tests and CI from S6.",
      "objectives": [
        "Read and audit AI-generated code for security, performance and hidden debt",
        "Use a reproduce, isolate, fix loop and give agents good error context",
        "Escape the 'agent fix loop' and use Git to roll back",
        "Refactor vibe-induced technical debt"
      ],
      "demo": "Live bug hunt in an AI-generated repo with deliberately planted bugs.",
      "hands_on": "Find and fix 3 planted bugs; write one regression test per bug.",
      "zero_cost_path": "Same free stack; local debugging tools in VS Code.",
      "deliverable": "Bug report + fix pull request"
    },
    {
      "id": "S8",
      "order": 8,
      "phase": "Quality & Scale",
      "title": "Context Engineering & Large Codebases",
      "tor_topic": "Context Engineering & Large Codebases",
      "level": "Intermediate–Advanced",
      "prerequisites": ["S4"],
      "order_flexibility": "Can move anywhere after S4 (e.g., swap with S5).",
      "duration_min": 60,
      "entry_recap": "Rules files from S2 and the agent loop from S4.",
      "objectives": [
        "Manage the context window: what to include, summarize or exclude",
        "Build a 'context pack': rules file, architecture notes, conventions",
        "Use codebase search/indexing and documentation as context to reduce hallucination",
        "Adapt techniques for small local models with short context windows"
      ],
      "demo": "Same request on an unfamiliar repo with and without a context pack.",
      "hands_on": "Onboard an agent to an existing open-source project and make one scoped, tested change.",
      "zero_cost_path": "Free tier or local model; tight context engineering compensates for weaker models.",
      "deliverable": "Context pack + pull request to the practice repo"
    },
    {
      "id": "S9",
      "order": 9,
      "phase": "Ship",
      "title": "AI-First SDLC: Deployment & Operations",
      "tor_topic": "AI-First SDLC: Deployment & Operations",
      "level": "Intermediate",
      "prerequisites": ["S6"],
      "duration_min": 60,
      "entry_recap": "CI pipeline from S6.",
      "objectives": [
        "Deploy automatically from CI to a free host",
        "Handle production secrets, logging and basic monitoring",
        "Control LLM API costs (caps, caching, smaller models)",
        "Use agents for ops tasks with human approval and rollback plans"
      ],
      "demo": "Merge to main triggers tests and deployment; then a rollback.",
      "hands_on": "Deploy the S3/S6 project and add a health check.",
      "zero_cost_path": "GitHub Pages or a free hosting tier; no credit card required where possible.",
      "deliverable": "Public URL + deployment workflow file",
      "verify_before_launch": true
    },
    {
      "id": "S10",
      "order": 10,
      "phase": "Ship",
      "title": "Capstone: Building an Autonomous Micro-Product",
      "tor_topic": "Capstone: Building an Autonomous Micro-Product",
      "level": "All tracks",
      "prerequisites": ["S3", "S6", "S9"],
      "duration_min": 90,
      "entry_recap": "Full roadmap recap: spec, agent, tests, deploy.",
      "objectives": [
        "Apply the full cycle in a team: problem, spec, agentic build, tests, deployment, demo",
        "Choose a tool path that matches the team's cost and privacy constraints and justify it"
      ],
      "format": "Teams of 3–5 with mixed backgrounds; one track per team; briefs drawn from local/SDG problems or the learners' own work.",
      "hands_on": "Build during the final days; demo day at the last session; asynchronous peer review.",
      "zero_cost_path": "Mandatory: the capstone must be buildable on the zero-cost path.",
      "deliverable": "Repo with spec.md, tests, CI and README + live URL or recorded 3-minute demo",
      "completion_criteria_proposal": "Attend or watch at least 7 sessions + submit S0 check + capstone (to confirm with organizers for certificates)"
    }
  ],

  "accessibility": {
    "barriers": [
      {
        "id": "no_gpu",
        "barrier": "No GPU / low-spec laptop",
        "impact": "Cannot run large local models; slow builds.",
        "workarounds": [
          "Default to hosted free-tier models: the GPU is the provider's, not the learner's",
          "Run small quantized models on CPU (Ollama/llama.cpp, ~1.5B–8B, 4-bit) on machines with 8–16 GB RAM",
          "Use free cloud GPUs only where really needed (Google Colab, Kaggle notebooks), within their session limits",
          "Use GitHub Codespaces so compilation and tooling run in the cloud",
          "Design all exercises so no GPU is ever required"
        ],
        "verify_before_launch": true
      },
      {
        "id": "no_paid_tools",
        "barrier": "No paid AI subscriptions",
        "impact": "No access to Cursor Pro, Claude Code or Codex paid plans.",
        "workarounds": [
          "Open-source agents (Aider, Cline, Continue) work with any model, including free or local ones",
          "Free-tier options: Gemini CLI, GitHub Copilot Free, free API tiers (Google AI Studio, OpenRouter free models, Groq)",
          "GitHub Student Developer Pack for eligible students (includes Copilot and other credits)",
          "Rotate free providers when rate limits hit; keep tasks small and spec-driven to save tokens",
          "Trainers demo premium tools but always show the free equivalent of the same concept",
          "Ask organizers to explore sponsored credits from AI companies for the capstone phase"
        ],
        "verify_before_launch": true
      },
      {
        "id": "no_payment_card",
        "barrier": "No international credit card",
        "impact": "Many 'free' tiers and cloud trials require card verification.",
        "workarounds": [
          "Prefer services that need only a Google/GitHub login",
          "Publish a vetted list of no-card options before launch",
          "Local models and self-hosted tools need no account at all"
        ],
        "verify_before_launch": true
      },
      {
        "id": "regional_availability",
        "barrier": "Some AI services are not available in every country",
        "impact": "Learners may be blocked from a provider the class relies on.",
        "workarounds": [
          "Never depend on a single provider; every exercise lists at least two model options",
          "Open-weight local models as the universal fallback",
          "Check providers' supported-country lists against the participant country list"
        ]
      },
      {
        "id": "bandwidth_power",
        "barrier": "Low, expensive or unstable internet; power cuts",
        "impact": "Missed live sessions; failed large downloads (local models are several GB).",
        "workarounds": [
          "Record every session; provide downloadable low-resolution versions, slides as PDF and transcripts",
          "Keep exercises text-based and lightweight",
          "Offer the smallest viable local model and note download sizes in advance",
          "Accept asynchronous submissions with flexible deadlines"
        ]
      },
      {
        "id": "background_gap",
        "barrier": "No CLI/programming background (inclusive, non-STEM intake)",
        "impact": "Learners stall on setup before learning anything about AI.",
        "workarounds": [
          "Session 0 survival kit + live help clinic",
          "Builder track designed for non-programmers",
          "Shared glossary and a 'common errors' FAQ",
          "Peer mentors: pair experienced learners with beginners in capstone teams"
        ]
      },
      {
        "id": "locked_down_devices",
        "barrier": "Shared or work computers without admin rights",
        "impact": "Cannot install Docker, Python or VS Code.",
        "workarounds": [
          "Browser-only path: Codespaces + web-based assistants",
          "Portable VS Code where allowed"
        ]
      },
      {
        "id": "sensitive_data",
        "barrier": "Private or regulated data cannot go to external AI tools",
        "impact": "Learners from public sector, NGOs or health cannot use hosted tools on real work.",
        "workarounds": [
          "Synthetic or public datasets for all exercises",
          "Private/local path for sensitive work",
          "Checklist: what never goes into a prompt (personal data, credentials, confidential documents)"
        ]
      },
      {
        "id": "time_zones",
        "barrier": "Time zones, jobs and missing sessions",
        "impact": "Learners lose the thread of a ladder-style series.",
        "workarounds": [
          "Entry recap + prerequisite links at the start of every session",
          "Concept ownership map so learners know exactly which recording to watch",
          "Async Q&A forum and rotating office hours across time zones"
        ]
      },
      {
        "id": "language_and_disability",
        "barrier": "Non-native English; hearing or visual impairments",
        "impact": "Reduced comprehension in fast live sessions.",
        "workarounds": [
          "Plain-language slides, captions and transcripts",
          "High-contrast templates, readable font sizes, describe what is on screen during demos",
          "Glossary of key terms"
        ]
      }
    ]
  },

  "delivery_logistics": {
    "session_length": "Target ~60 minutes; expert spotlights can be as short as 5 minutes.",
    "scheduling": "Volunteers choose their own day in the shared calendar, respecting the prerequisite order.",
    "slides": "Optional standard PowerPoint template with logos; consistency encouraged, not mandatory.",
    "shared_folder": "Coordinator collects every trainer's outline so everyone can see what others cover and avoid repetition.",
    "session_template": [
      "Entry recap (3–5 min) with links to owning sessions",
      "Objectives",
      "Concept",
      "Live demo (premium + zero-cost equivalent)",
      "Hands-on exercise",
      "Deliverable and next steps"
    ],
    "support_model": "For ~200 learners: async forum, office hours, peer mentors; trainers give feedback on deliverables by sampling plus capstone review.",
    "next_coordination": "Monday follow-up meeting to fix launch dates."
  },

  "open_questions_for_organizers": [
    "Will applicants be filtered by STEM background, or is intake fully inclusive?",
    "Can the programme be spread over 3 weeks instead of 2?",
    "Certificate criteria and attendance tracking",
    "Can sponsored AI credits be obtained for participants?",
    "Which meeting platform and which time zone is the anchor for live sessions?"
  ]
};

/* ---------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------- */

/** Checks that every prerequisite is scheduled before the session that needs it. */
function validateOrder(r = roadmap) {
  const orderById = Object.fromEntries(r.sessions.map(s => [s.id, s.order]));
  const errors = [];
  for (const s of r.sessions) {
    for (const p of s.prerequisites) {
      if (!(p in orderById)) errors.push(`${s.id}: unknown prerequisite ${p}`);
      else if (orderById[p] >= s.order) errors.push(`${s.id} is scheduled before its prerequisite ${p}`);
    }
  }
  return { valid: errors.length === 0, errors };
}

/** Sessions emphasized for a given track id ("builder" | "automator" | "engineer"). */
function sessionsForTrack(trackId, r = roadmap) {
  const track = r.learner_tracks.find(t => t.id === trackId);
  if (!track) throw new Error(`Unknown track: ${trackId}`);
  return r.sessions.filter(s => track.emphasis_sessions.includes(s.id));
}

/** Everything that must be re-checked before launch (free tiers, quotas, prices). */
function itemsToVerify(r = roadmap) {
  const all = [...r.tool_paths, ...r.sessions, ...r.accessibility.barriers];
  return all.filter(x => x.verify_before_launch).map(x => x.id);
}

/** Where a learner who missed something should go back to. */
function whereIsConceptTaught(conceptKey, r = roadmap) {
  const id = r.concept_ownership[conceptKey];
  return id ? r.sessions.find(s => s.id === id) : null;
}

// Works in Node (CommonJS) and in the browser.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { roadmap, validateOrder, sessionsForTrack, itemsToVerify, whereIsConceptTaught };
}

// Quick self-check when run directly: `node agentic_vibe_coding_roadmap.js`
if (typeof require !== "undefined" && typeof module !== "undefined" && require.main === module) {
  console.log("Order check:", validateOrder());
  console.log("Verify before launch:", itemsToVerify());
  console.log("Builder track:", sessionsForTrack("builder").map(s => s.title));
}
