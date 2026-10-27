/**
 * Roadmap board — Agentic Software Development & Vibe Coding
 * UNDP IICPSD training series.
 *
 * A board-game style path: each session is a numbered station, and each
 * learning goal is a dot on the path after its session. Click a station or a
 * dot (or use the arrow keys) to move the token and read the explanation.
 *
 * Vanilla JavaScript, no libraries, no network needed.
 * Usage: put <div id="roadmap"></div> in a page and load this file.
 * The companion roadmap_cards.html does exactly that: just double-click it.
 */
(function () {
  "use strict";

  const NS = "http://www.w3.org/2000/svg";
  const STORE_KEY = "rm-learned-v2";

  /* ------------------------------------------------------------------ */
  /* Data                                                                */
  /* ------------------------------------------------------------------ */

  const phases = {
    foundation: { name: "Foundation", hint: "Set up and speak the same language" },
    core: { name: "Core mechanics", hint: "How agents plan, act and collaborate" },
    quality: { name: "Quality & scale", hint: "Trust, debug and grow the code" },
    ship: { name: "Ship", hint: "Put it in front of real users" }
  };

  const constraints = {
    gpu: "No GPU",
    paid: "No paid AI tools",
    bandwidth: "Low bandwidth"
  };

  const sessions = [
    {
      n: 0, phase: "foundation", async: true,
      title: "Onboarding & command-line survival kit",
      learn: [
        {
          goal: "Use a terminal: list files, change folders, run a program",
          explain: "The terminal is a text window where you type commands instead of clicking. Almost every AI agent in this series runs there, so you start with a handful of commands: ls to list files, cd to change folder, pwd to show where you are, and running a program by typing its name."
        },
        {
          goal: "Create a GitHub account, commit and push",
          explain: "Git records snapshots of your files, called commits. GitHub keeps those snapshots online, so your work is backed up and others can see it. Push sends your new commits from your computer to GitHub."
        },
        {
          goal: "Set up VS Code, or open a browser Codespace",
          explain: "VS Code is the code editor used throughout the series. If your laptop cannot install software, a GitHub Codespace gives you the same editor and terminal in your browser."
        },
        {
          goal: "Store an API key safely",
          explain: "An API key is a password that lets a program use an AI service on your account. Keep it in a .env file, never in code or in a chat, so it cannot leak into a shared repository."
        }
      ],
      useCase: "Setting up a reproducible workspace for a team project",
      deliverable: "Passing environment check and a pushed hello-agent repo",
      how: {
        gpu: "Nothing here needs a GPU.",
        paid: "All tools are free.",
        bandwidth: "Short videos with transcripts; Codespaces avoids large installs."
      }
    },
    {
      n: 1, phase: "foundation",
      title: "Introduction to the vibe paradigm",
      learn: [
        {
          goal: "Place chat, vibe coding and agentic engineering on one spectrum",
          explain: "Chat answers questions. Vibe coding means describing what you want and accepting AI-written code quickly. Agentic engineering adds planning, tests and review, so the AI works toward a goal that you can check."
        },
        {
          goal: "Tell an LLM, augmented LLM, workflow and agent apart",
          explain: "An LLM only generates text. An augmented LLM can also look things up or call tools. A workflow follows steps that a person wrote. An agent chooses its own next step, within the limits you set."
        },
        {
          goal: "Spot hallucination, insecure code and technical debt",
          explain: "Hallucination is a confident answer that is wrong. AI-written code can also hide security holes, or be structured in a way that is costly to maintain later. Learning to spot these problems is the core skill of this series."
        },
        {
          goal: "Apply basic data-privacy rules",
          explain: "Anything you paste into a hosted AI tool may be stored, or used by its provider. Use synthetic or public data in exercises, and keep private or organisational data out of prompts."
        }
      ],
      useCase: "A one-page tool for a local cooperative, built three ways and compared",
      deliverable: "Small working artifact and a short critique",
      how: {
        gpu: "Uses hosted free-tier models.",
        paid: "A free chat assistant and a free-tier agent are enough.",
        bandwidth: "Recording, PDF slides and a text-only exercise."
      }
    },
    {
      n: 2, phase: "foundation",
      title: "Architecting & configuring the AI workspace",
      learn: [
        {
          goal: "Choose a tool path by cost, safety and effort",
          explain: "Each tool path trades money, privacy and effort differently: zero-cost, balanced, premium, or private/local. Choose by asking how much you can spend, what data you handle and how much setup you can manage."
        },
        {
          goal: "Configure an agent with a free or local model",
          explain: "An agent is a program that uses a model. You connect it either to a free hosted model with a key, or to a model running on your own computer through a tool such as Ollama."
        },
        {
          goal: "Keep secrets out of code with .env and .gitignore",
          explain: "The .env file stores your keys on your computer. The .gitignore file lists the files Git must never track, so the .env file is never uploaded with your code."
        },
        {
          goal: "Steer the agent with a project rules file",
          explain: "An AGENTS.md file tells the agent your language, your test command, the folders it may edit and what it must never do. The agent reads it before changing your code, so you do not repeat the same instructions every time."
        }
      ],
      useCase: "Choosing a setup for an NGO that cannot send data to external services",
      deliverable: "Working workspace and a committed AGENTS.md",
      how: {
        gpu: "Small quantized models run on CPU with 8–16 GB RAM.",
        paid: "Aider, Cline or Continue with a free API tier.",
        bandwidth: "Pick the smallest local model; download sizes listed in advance."
      }
    },
    {
      n: 3, phase: "core",
      title: "Development paradigms",
      learn: [
        {
          goal: "Choose between vibe iteration, spec-driven development and orchestration",
          explain: "Vibe iteration refines the result by trying and adjusting. Spec-driven development writes the requirements first and builds from them. Orchestration coordinates several agents. Each suits a different size and level of risk."
        },
        {
          goal: "Turn a business need into a spec with acceptance criteria",
          explain: "A spec describes what the software must do, in plain language. Acceptance criteria are yes-or-no checks that prove it works, so you and the agent agree on what done means."
        },
        {
          goal: "Drive an agent task by task from the spec",
          explain: "Instead of one giant request, you give the agent small tasks taken from the spec, check each result and then move on. Small steps are easier to review and easier to fix when something goes wrong."
        }
      ],
      useCase: "A market-price tracker or clinic queue page, specified from a real need",
      deliverable: "spec.md and its implementation, reused in later sessions",
      feedback: true,
      how: {
        gpu: "Hosted free-tier model.",
        paid: "Specs help small free models perform better.",
        bandwidth: "Work is plain text and code; submit asynchronously."
      }
    },
    {
      n: 4, phase: "core",
      title: "Agentic mechanics: planning & tool use",
      learn: [
        {
          goal: "Explain the plan, act, observe loop",
          explain: "An agent plans its next step, acts with a tool, observes the result and repeats. Understanding this loop lets you read an agent's log and see exactly where it went wrong."
        },
        {
          goal: "Implement tool calling with a free API",
          explain: "A tool is a function the model may ask to run, such as reading a file or fetching data. The model returns a structured request, your program runs it, and the result is sent back to the model."
        },
        {
          goal: "Understand MCP and how agents reach external tools",
          explain: "The Model Context Protocol (MCP) is a standard way to connect tools and data sources to an agent. A tool written once for MCP can then be used by many different agents."
        },
        {
          goal: "Set permissions and human approval steps",
          explain: "Agents should not act without limits. Permissions restrict which files and commands are allowed, and approval steps pause the agent before risky actions such as deleting data or sending a message."
        }
      ],
      useCase: "An assistant that looks up data and drafts a weekly report",
      deliverable: "Mini agent or n8n workflow with a logged run",
      notebook: true,
      how: {
        gpu: "Free API with tool calling, or a local model that supports it.",
        paid: "Companion notebook runs on free Colab.",
        bandwidth: "Notebook can be downloaded and run later."
      }
    },
    {
      n: 5, phase: "core",
      title: "Managing multi-agent teams",
      learn: [
        {
          goal: "Use orchestrator-worker and planner-coder-reviewer patterns",
          explain: "In orchestrator-worker, one agent splits the job and other agents do the parts. In planner-coder-reviewer, one agent plans, one writes the code and one checks it, much like a small human team."
        },
        {
          goal: "Run agents in parallel safely on separate branches",
          explain: "Agents working at the same time can conflict if they edit the same files. Giving each agent its own Git branch keeps the work separate until a person reviews and merges it."
        },
        {
          goal: "Judge when multi-agent setups are not worth the cost",
          explain: "More agents mean more model calls, more cost and more places for errors. For small jobs, a single agent with clear instructions is often faster and cheaper."
        }
      ],
      useCase: "Splitting a feature for a small business website across agents",
      deliverable: "Pipeline with reviewer output on a real change",
      how: {
        gpu: "Hosted models only.",
        paid: "Run the roles one after another with a single free model to stay within limits.",
        bandwidth: "Pipeline output is text; watch the recorded demo later."
      }
    },
    {
      n: 6, phase: "quality",
      title: "The safety net: automated validation & evals",
      learn: [
        {
          goal: "Turn acceptance criteria into tests the agent must pass",
          explain: "A test is code that checks behaviour automatically. Writing tests from the acceptance criteria gives the agent a clear target, and gives you proof that the result works."
        },
        {
          goal: "Add linting, type checks and security scanning",
          explain: "Linters catch style problems and common bug patterns, type checkers catch data used in the wrong way, and security scanners flag risks such as leaked secrets. Each can run automatically on every change."
        },
        {
          goal: "Set up CI with GitHub Actions",
          explain: "Continuous integration (CI) runs your tests and checks on GitHub's servers after every push. If something fails, you know at once, and the agent's changes cannot quietly break the project."
        },
        {
          goal: "Write simple evals for LLM features",
          explain: "An eval is a repeatable test for AI output: a set of inputs and the checks their answers must pass. It lets you measure whether a change to a prompt or a model made the feature better or worse."
        }
      ],
      useCase: "Making sure a public-service form never accepts invalid data",
      deliverable: "Passing CI and at least five meaningful tests",
      notebook: true,
      feedback: true,
      how: {
        gpu: "CI runs on GitHub's machines.",
        paid: "GitHub Actions free minutes on public repos.",
        bandwidth: "Push small commits; CI does the heavy work remotely."
      }
    },
    {
      n: 7, phase: "quality",
      title: "Debugging in the agentic age",
      learn: [
        {
          goal: "Read and audit AI-generated code",
          explain: "Reading code you did not write is a skill. Check what it does, which files it touches, and whether it handles errors and secrets safely, before you trust it."
        },
        {
          goal: "Give agents useful error context",
          explain: "Writing only 'it does not work' wastes time. Include the exact error message, the command you ran and the relevant file, so the agent can find the real cause."
        },
        {
          goal: "Escape the endless fix loop and roll back with Git",
          explain: "When an agent keeps trying fixes that fail, stop. Use Git to return to the last working commit, then restart with a smaller and clearer request."
        },
        {
          goal: "Refactor vibe-induced technical debt",
          explain: "Refactoring changes how code is organised without changing what it does. Tidying up quickly generated code makes it easier to change and safer to maintain."
        }
      ],
      useCase: "Fixing a broken AI-built donation page",
      deliverable: "Bug report and fix with regression tests",
      how: {
        gpu: "Debugging tools run on any laptop.",
        paid: "Free agent plus the VS Code debugger.",
        bandwidth: "Practice repo is small and downloadable."
      }
    },
    {
      n: 8, phase: "quality",
      title: "Context engineering & large codebases",
      learn: [
        {
          goal: "Manage the context window: include, summarize, exclude",
          explain: "A model reads only a limited amount of text at once. Decide which files and notes to include, summarise long material, and leave out what is irrelevant, so the important parts fit."
        },
        {
          goal: "Build a context pack: rules, architecture notes, conventions",
          explain: "A context pack is a short set of documents describing the project: its rules, its structure and its naming conventions. Giving it to the agent first makes its suggestions fit your codebase."
        },
        {
          goal: "Use docs and code search to cut hallucinations",
          explain: "Pointing the agent at real documentation and searching the actual code grounds its answers in facts. This reduces invented function names and made-up library features."
        },
        {
          goal: "Adapt to small local models with short context",
          explain: "Small local models read less at once and reason less reliably. Shorter, focused requests and carefully chosen context help them give useful results."
        }
      ],
      useCase: "Contributing to an existing open-source civic-tech project",
      deliverable: "Context pack and a scoped pull request",
      how: {
        gpu: "Good context makes small CPU models usable.",
        paid: "Free tier or local model.",
        bandwidth: "Shallow clone of the practice repo."
      }
    },
    {
      n: 9, phase: "ship",
      title: "AI-first SDLC: deployment & operations",
      learn: [
        {
          goal: "Deploy from CI to a free host",
          explain: "Deploying means putting your app where users can reach it. CI can publish the app automatically after each approved change, using a free host such as GitHub Pages."
        },
        {
          goal: "Handle production secrets, logs and monitoring",
          explain: "Secrets in production are stored in the host's secret settings, never in the code. Logs record what the app does, and monitoring alerts you when it fails."
        },
        {
          goal: "Control API costs with caps and smaller models",
          explain: "Model calls cost money on paid plans. Set spending caps, and use smaller models for simple tasks, so an agent loop cannot run up an unexpected bill."
        },
        {
          goal: "Plan rollbacks before letting agents touch ops",
          explain: "A rollback returns the app to its previous working version. Plan how to do it before an agent deploys anything, so a bad change is quick to undo."
        }
      ],
      useCase: "Putting the session 3 project online for real users",
      deliverable: "Public URL and deployment workflow",
      feedback: true,
      how: {
        gpu: "Static and small apps need no GPU.",
        paid: "GitHub Pages or a free hosting tier, preferably with no card required.",
        bandwidth: "Deployment happens in CI, not from your connection."
      }
    },
    {
      n: 10, phase: "ship",
      title: "Capstone: an autonomous micro-product",
      learn: [
        {
          goal: "Run the full cycle in a team: problem, spec, build, tests, deploy, demo",
          explain: "Your team takes one problem from a short spec through building, testing and deployment, and then shows it working. This is the whole agentic workflow, from start to finish."
        },
        {
          goal: "Justify the tool path your team chose",
          explain: "Explain why your team picked its agents, models and privacy setup, based on cost, data sensitivity and effort. Being able to justify the choice is part of the learning goal."
        }
      ],
      useCase: "Team briefs drawn from SDG problems or learners' own work",
      deliverable: "Repo with spec, tests, CI and README, plus a live URL or 3-minute demo",
      feedback: true,
      how: {
        gpu: "Must be buildable without a GPU.",
        paid: "Must be buildable on the zero-cost path.",
        bandwidth: "Recorded demo accepted instead of a live one."
      }
    }
  ];

  const limitations = [
    { title: "No GPU or low-spec laptop", fix: "Hosted free-tier models, small CPU models via Ollama, Codespaces, Colab or Kaggle for heavier work." },
    { title: "No paid AI tools", fix: "Open-source agents (Aider, Cline, Continue), Gemini CLI, Copilot Free, GitHub Student Pack, rotating providers." },
    { title: "No international payment card", fix: "Services that need only a Google or GitHub login, a vetted no-card list, local tools." },
    { title: "Services blocked in some countries", fix: "Two model options per exercise, with open-weight local models as fallback." },
    { title: "Low bandwidth or power cuts", fix: "Recordings, low-resolution downloads, PDF slides, transcripts, async submissions." },
    { title: "No command-line background", fix: "Session 0 with a help clinic, a shared glossary and peer mentors." },
    { title: "Locked-down work computers", fix: "Browser-only path with Codespaces and web assistants." },
    { title: "Sensitive data", fix: "Synthetic data in exercises, private/local path, a never-in-a-prompt checklist." },
    { title: "Time zones and missed sessions", fix: "Entry recaps, concept owners per session, async forum, rotating office hours." },
    { title: "Non-native English or disabilities", fix: "Plain language, captions, transcripts, high contrast, narrated demos." }
  ];

  /* Silhouettes are drawn in a 100 x 100 box and scattered between the lanes. */
  const silhouettes = {
    city: "M4 100V52h16V30h18V12h18v26h14V34h20v66z",
    mountain: "M0 100L34 38l16 24 16-30L100 100z",
    tree: "M50 4L80 50H64L92 92H8L36 50H20zM44 92h12v8H44z",
    cloud: "M22 78a18 18 0 0 1 4-36 24 24 0 0 1 46-6 18 18 0 0 1 14 42z",
    robot: "M48 2h4v14h-4zM28 16h44v34H28zM24 54h52v36H24zM14 58h8v22h-8zM78 58h8v22h-8z",
    rocket: "M50 2C64 16 70 40 66 70H34C30 40 36 16 50 2zM34 52L16 72v12l18-8zM66 52l18 20v12l-18-8zM42 70h16v12H42z",
    laptop: "M16 18h68v52H16zM8 76h84v8H8z"
  };
  const silhouetteOrder = ["city", "tree", "robot", "mountain", "cloud", "rocket", "laptop"];

  /* Flat list of every stop on the board: each session, followed by its goals. */
  const stops = [];
  sessions.forEach(s => {
    const sessionIndex = stops.length;
    stops.push({ kind: "session", id: "s" + s.n, session: s, index: sessionIndex });
    s.learn.forEach((item, k) => stops.push({
      kind: "goal", id: `g${s.n}-${k}`, session: s, item, k,
      index: sessionIndex + 1 + k, sessionIndex
    }));
  });
  const goalCount = stops.filter(st => st.kind === "goal").length;

  /* ------------------------------------------------------------------ */
  /* Styles                                                              */
  /* ------------------------------------------------------------------ */

  const css = `
  .rm { --bg:#F3F6F9; --surface:#FFFFFF; --ink:#18222E; --muted:#556272; --line:#D5DDE6;
        --foundation:#0E7C7B; --core:#2F5FD0; --quality:#A86A12; --ship:#9B3468;
        --focus:#2F5FD0; --soft:#E9EEF4; --board:#E6EDF5; --road:#FFFFFF; --road-edge:#B8C6D6;
        --dash:#B8C6D6; --sil:#5B6B80;
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", Ubuntu, sans-serif;
        color:var(--ink); background:var(--bg); line-height:1.5; padding:clamp(16px,4vw,40px);
        max-width:1040px; margin:0 auto; box-sizing:border-box; }
  @media (prefers-color-scheme: dark) {
    .rm { --bg:#111821; --surface:#1A2330; --ink:#E6ECF2; --muted:#9AA8B8; --line:#2C3746;
          --foundation:#3FB8B6; --core:#7D9DF0; --quality:#E0A44B; --ship:#E07AAE;
          --focus:#7D9DF0; --soft:#222D3B; --board:#0E151E; --road:#1E2936; --road-edge:#2B3746;
          --dash:#3A475A; --sil:#8FA0B5; color-scheme: dark; }
  }
  .rm *, .rm *::before, .rm *::after { box-sizing:border-box; }
  .rm h1 { font-size:clamp(1.6rem,4vw,2.3rem); line-height:1.15; margin:0 0 .4rem; letter-spacing:-.01em; }
  .rm h2 { font-size:1.35rem; margin:.1rem 0 .5rem; }
  .rm h3 { font-size:.95rem; margin:1rem 0 .3rem; }
  .rm p { margin:0 0 .5rem; }
  .rm .lede { color:var(--muted); max-width:66ch; margin:0 0 1rem; }

  .rm .progress { margin:0 0 1rem; }
  .rm .progress-text { font-size:.9rem; color:var(--muted); margin:0 0 .35rem; }
  .rm .bar { height:10px; background:var(--soft); border-radius:999px; overflow:hidden; }
  .rm .bar-fill { display:block; height:100%; width:0; background:var(--focus); border-radius:999px; transition:width .4s ease; }

  .rm .board-wrap { width:100%; }
  .rm .board { display:block; width:100%; height:auto; border-radius:14px; background:var(--board); }
  .rm .road-edge { fill:none; stroke:var(--road-edge); stroke-width:46; stroke-linecap:round; stroke-linejoin:round; }
  .rm .road { fill:none; stroke:var(--road); stroke-width:36; stroke-linecap:round; stroke-linejoin:round; }
  .rm .road-dash { fill:none; stroke:var(--dash); stroke-width:3; stroke-dasharray:14 14; }
  .rm .road-done { fill:none; stroke:var(--focus); stroke-width:8; stroke-linecap:round; stroke-linejoin:round; transition:stroke-dashoffset .8s ease; }
  .rm .sil { fill:var(--sil); fill-opacity:.35; }
  .rm .flag { fill:var(--ink); font-size:20px; font-weight:700; text-anchor:middle; }
  .rm .stop { cursor:pointer; }
  .rm .stop:focus { outline:none; }
  .rm .stop circle { fill:var(--surface); stroke:var(--pc); stroke-width:5; }
  .rm .stop.goal circle { stroke-width:4; }
  .rm .stop.learned circle { fill:var(--pc); }
  .rm .stop.current circle { stroke-width:9; }
  .rm .stop text { fill:var(--pc); font-weight:800; text-anchor:middle; }
  .rm .stop.learned text { fill:var(--surface); }
  .rm .stop:focus-visible circle { stroke:var(--focus); stroke-width:7; }
  .rm .token-dot { fill:var(--ink); stroke:var(--surface); stroke-width:4; }
  .rm .token-core { fill:var(--surface); }

  .rm .legend { display:flex; flex-wrap:wrap; gap:6px 16px; font-size:.85rem; margin:.8rem 0 0; }
  .rm .legend span::before { content:""; display:inline-block; width:12px; height:12px; border-radius:50%;
                             background:var(--pc); margin-right:6px; vertical-align:-1px; }

  .rm .toolbar { display:flex; flex-wrap:wrap; gap:10px 16px; align-items:center; justify-content:space-between; margin:1rem 0; }
  .rm .chips { display:flex; flex-wrap:wrap; gap:6px; align-items:center; }
  .rm .chips span { font-size:.85rem; font-weight:600; margin-right:4px; }
  .rm .chip { font:inherit; font-size:.85rem; border:1px solid var(--line); background:var(--surface); color:var(--ink);
              padding:5px 12px; border-radius:999px; cursor:pointer; }
  .rm .chip[aria-pressed="true"] { background:var(--ink); color:var(--bg); border-color:var(--ink); }
  .rm .btn { font:inherit; font-weight:600; font-size:.92rem; padding:8px 14px; border-radius:8px; cursor:pointer;
             border:1px solid var(--ink); background:var(--ink); color:var(--bg); }
  .rm .btn.ghost { background:var(--surface); color:var(--ink); border-color:var(--line); }
  .rm .btn:disabled { opacity:.4; cursor:default; }
  .rm .link-btn { font:inherit; font-size:.92rem; background:none; border:0; color:var(--focus); cursor:pointer; padding:0; text-decoration:underline; }
  .rm .btn:focus-visible, .rm .chip:focus-visible, .rm .link-btn:focus-visible, .rm .goal-btn:focus-visible {
    outline:3px solid var(--focus); outline-offset:2px; }

  .rm .panel { background:var(--surface); border:1px solid var(--line); border-left:6px solid var(--pc);
               border-radius:10px; padding:18px 20px; min-height:200px; }
  .rm .eyebrow { color:var(--pc); font-size:.78rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; margin:0 0 .2rem; }
  .rm .explain { font-size:1.08rem; line-height:1.6; }
  .rm .tag { display:inline-block; font-size:.75rem; padding:1px 8px; border-radius:4px; background:var(--soft); margin:0 6px 6px 0; }
  .rm .goal-list { list-style:none; padding:0; margin:0; display:grid; gap:6px; }
  .rm .goal-btn { font:inherit; width:100%; text-align:left; background:var(--soft); color:var(--ink);
                  border:1px solid var(--line); border-radius:8px; padding:9px 12px; cursor:pointer; }
  .rm .goal-btn:hover { border-color:var(--pc); }
  .rm .how-box { margin-top:1rem; padding:12px 14px; border:1px dashed var(--line); border-radius:8px; font-size:.9rem; }
  .rm .how-box p { margin:0 0 .3rem; }
  .rm .nav-row { display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; margin-top:1.2rem; }
  .rm .done-row { display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin-top:.9rem; }

  .rm .limits { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:10px; margin-top:1rem; }
  .rm .limit { background:var(--surface); border:1px solid var(--line); border-radius:6px; padding:12px 14px; }
  .rm .limit h4 { margin:0 0 .25rem; font-size:.95rem; }
  .rm .limit p { margin:0; font-size:.86rem; color:var(--muted); }
  .rm .rule { margin-top:1rem; padding:12px 14px; border:1px dashed var(--line); border-radius:6px; font-size:.9rem; }
  .rm .meta-text { font-size:.9rem; color:var(--muted); }
  @media (prefers-reduced-motion: reduce) {
    .rm .road-done, .rm .bar-fill { transition:none; }
  }
  `;

  /* ------------------------------------------------------------------ */
  /* State and helpers                                                    */
  /* ------------------------------------------------------------------ */

  const state = {
    index: -1,          // token position: -1 = start, stops.length = finish
    reach: -1,          // furthest stop reached so far
    tokenPos: 0,        // token distance along the path (in path units)
    raf: 0,
    limits: new Set(),
    learned: loadLearned()
  };

  const board = { el: null, track: null, token: null, progress: null, length: 0, stops: [], portrait: null };
  let root, panel, progressText, progressFill, boardWrap;

  function reduceMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function loadLearned() {
    try { return new Set(JSON.parse(localStorage.getItem(STORE_KEY) || "[]")); }
    catch (e) { return new Set(); }
  }

  function saveLearned() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify([...state.learned])); }
    catch (e) { /* storage blocked: progress lasts for this visit only */ }
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === null || v === undefined || v === false) continue;
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    }
    (children || []).forEach(c => c && node.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
    return node;
  }

  function svgEl(tag, attrs, children) {
    const node = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === null || v === undefined || v === false) continue;
      if (k === "text") node.textContent = v;
      else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    }
    (children || []).forEach(c => c && node.appendChild(c));
    return node;
  }

  /* ------------------------------------------------------------------ */
  /* Board geometry                                                       */
  /* ------------------------------------------------------------------ */

  function unit(a, b) {
    const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
    return { x: dx / len, y: dy / len };
  }

  function roundedPath(points, r) {
    let d = `M${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length - 1; i++) {
      const a = points[i - 1], p = points[i], b = points[i + 1];
      const ua = unit(a, p), ub = unit(p, b);
      const cut = Math.min(r, Math.hypot(p.x - a.x, p.y - a.y) / 2, Math.hypot(b.x - p.x, b.y - p.y) / 2);
      const p1 = { x: p.x - ua.x * cut, y: p.y - ua.y * cut };
      const p2 = { x: p.x + ub.x * cut, y: p.y + ub.y * cut };
      d += ` L${p1.x} ${p1.y} Q${p.x} ${p.y} ${p2.x} ${p2.y}`;
    }
    const last = points[points.length - 1];
    return `${d} L${last.x} ${last.y}`;
  }

  /* Four serpentine lanes. Portrait screens transpose the same lanes into columns. */
  function layout(portrait) {
    const frame = portrait ? { w: 1400, h: 500 } : { w: 1000, h: 1000 };
    const lanes = 4, m = 90;
    const laneY = i => m + i * (frame.h - 2 * m) / (lanes - 1);
    const pts = [];
    for (let i = 0; i < lanes; i++) {
      const y = laneY(i), ltr = i % 2 === 0;
      pts.push({ x: ltr ? m : frame.w - m, y }, { x: ltr ? frame.w - m : m, y });
    }
    const toBoard = p => (portrait ? { x: p.y, y: p.x } : p);
    const deco = [];
    for (let g = 0; g < lanes - 1; g++) {
      const gapY = (laneY(g) + laneY(g + 1)) / 2;
      const size = Math.min((laneY(g + 1) - laneY(g)) * 0.42, 110);
      [0.25, 0.5, 0.75].forEach((f, j) => {
        const p = toBoard({ x: m + (frame.w - 2 * m) * f, y: gapY });
        deco.push({ kind: silhouetteOrder[(g * 3 + j) % silhouetteOrder.length], x: p.x, y: p.y, size });
      });
    }
    return {
      path: pts.map(toBoard),
      deco,
      view: portrait ? { w: 500, h: 1400 } : { w: 1000, h: 1000 },
      scale: portrait ? 1.35 : 1
    };
  }

  function posFor(index) {
    const N = stops.length;
    if (index < 0) return 0;
    if (index >= N) return board.length;
    return board.length * (index + 1) / (N + 1);
  }

  /* ------------------------------------------------------------------ */
  /* Board drawing                                                        */
  /* ------------------------------------------------------------------ */

  function buildBoard(portrait) {
    const svg = board.el;
    const { path, deco, view, scale } = layout(portrait);
    const d = roundedPath(path, portrait ? 60 : 80);
    svg.replaceChildren();
    svg.setAttribute("viewBox", `0 0 ${view.w} ${view.h}`);

    deco.forEach(s => {
      const k = s.size / 100;
      svg.appendChild(svgEl("g", { transform: `translate(${s.x - s.size / 2} ${s.y - s.size / 2}) scale(${k})`, "aria-hidden": "true" }, [
        svgEl("path", { class: "sil", d: silhouettes[s.kind] })
      ]));
    });

    svg.appendChild(svgEl("path", { class: "road-edge", d }));
    const track = svgEl("path", { class: "road", d });
    svg.appendChild(track);
    svg.appendChild(svgEl("path", { class: "road-dash", d }));
    const length = track.getTotalLength();
    board.track = track;
    board.length = length;

    const progress = svgEl("path", { class: "road-done", d, "stroke-dasharray": `${length} ${length}` });
    svg.appendChild(progress);
    board.progress = progress;

    const start = track.getPointAtLength(0);
    const end = track.getPointAtLength(length);
    svg.appendChild(svgEl("text", { class: "flag", x: start.x, y: start.y - 42 * scale, text: "Start" }));
    svg.appendChild(svgEl("text", { class: "flag", x: end.x, y: end.y - 42 * scale, text: "Finish" }));

    board.stops = stops.map((st, j) => {
      const p = track.getPointAtLength(posFor(j));
      const isSession = st.kind === "session";
      const r = (isSession ? 26 : 13) * scale;
      const label = isSession
        ? `Session ${st.session.n}: ${st.session.title}`
        : `Learning goal: ${st.item.goal}`;
      const node = svgEl("g", {
        class: `stop ${st.kind}`,
        transform: `translate(${p.x} ${p.y})`,
        tabindex: "0",
        role: "button",
        "aria-label": label,
        style: `--pc:var(--${st.session.phase})`,
        onclick: () => go(j),
        onkeydown: e => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(j); }
        }
      }, [
        svgEl("title", { text: label }),
        svgEl("circle", { r: String(r) }),
        isSession ? svgEl("text", { "font-size": String(24 * scale), dy: "0.35em", text: String(st.session.n) }) : null
      ]);
      svg.appendChild(node);
      return node;
    });

    board.token = svgEl("g", { class: "token", "aria-hidden": "true" }, [
      svgEl("circle", { class: "token-dot", r: String(14 * scale) }),
      svgEl("circle", { class: "token-core", r: String(5 * scale) })
    ]);
    svg.appendChild(board.token);
    board.portrait = portrait;
  }

  function setToken(s) {
    state.tokenPos = s;
    const p = board.track.getPointAtLength(s);
    board.token.setAttribute("transform", `translate(${p.x} ${p.y})`);
  }

  function animateToken(to) {
    cancelAnimationFrame(state.raf);
    const from = state.tokenPos;
    if (reduceMotion() || from === to) { setToken(to); return; }
    const dur = Math.min(1000, 300 + Math.abs(to - from) / board.length * 900);
    const t0 = performance.now();
    const frame = now => {
      const t = Math.min(1, (now - t0) / dur);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setToken(from + (to - from) * eased);
      if (t < 1) state.raf = requestAnimationFrame(frame);
    };
    state.raf = requestAnimationFrame(frame);
  }

  function paintStops() {
    board.stops.forEach((node, j) => {
      const st = stops[j];
      const cls = ["stop", st.kind];
      if (j === state.index) cls.push("current");
      if (st.kind === "goal" && state.learned.has(st.id)) cls.push("learned");
      node.setAttribute("class", cls.join(" "));
    });
  }

  function paintProgress() {
    board.progress.setAttribute("stroke-dashoffset", String(board.length - Math.max(0, posFor(state.reach))));
    const pct = Math.round(state.learned.size / goalCount * 100);
    progressText.textContent = `${state.learned.size} of ${goalCount} learning goals marked as learned`;
    progressFill.style.width = pct + "%";
  }

  function fitBoard() {
    const portrait = boardWrap.clientWidth < 620;
    if (portrait === board.portrait) return;
    cancelAnimationFrame(state.raf);
    buildBoard(portrait);
    setToken(posFor(state.index));
    paintStops();
    paintProgress();
  }

  /* ------------------------------------------------------------------ */
  /* Navigation                                                           */
  /* ------------------------------------------------------------------ */

  function go(index) {
    const next = Math.max(-1, Math.min(stops.length, index));
    state.index = next;
    state.reach = Math.max(state.reach, next);
    animateToken(posFor(next));
    paintStops();
    paintProgress();
    renderPanel();
  }

  function toggleLearned(id) {
    state.learned.has(id) ? state.learned.delete(id) : state.learned.add(id);
    saveLearned();
    paintStops();
    paintProgress();
    renderPanel();
  }

  function onBoardKey(e) {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = Math.max(-1, Math.min(stops.length, state.index + step));
    go(next);
    const node = board.stops[next];
    if (node) node.focus();
  }

  /* ------------------------------------------------------------------ */
  /* Panel                                                                */
  /* ------------------------------------------------------------------ */

  function tagRow(s) {
    const tags = [];
    if (s.async) tags.push("Async pre-work");
    if (s.notebook) tags.push("Companion notebook");
    if (s.feedback) tags.push("Trainer feedback checkpoint");
    tags.push("Works without GPU or paid tools");
    return el("div", {}, tags.map(t => el("span", { class: "tag", text: t })));
  }

  function limitBox(s) {
    if (state.limits.size === 0) return null;
    return el("div", { class: "how-box" }, [
      el("h3", { text: "With the limits you chose" }),
      ...[...state.limits].map(id => el("p", {}, [el("b", { text: constraints[id] + ": " }), s.how[id]]))
    ]);
  }

  function navRow() {
    const i = state.index, N = stops.length;
    return el("div", { class: "nav-row" }, [
      el("button", { class: "btn ghost", type: "button", "data-key": "prev", disabled: i <= -1 ? "" : null,
        onclick: () => go(i - 1), text: "← Previous stop" }),
      el("button", { class: "btn", type: "button", "data-key": "next", disabled: i >= N ? "" : null,
        onclick: () => go(i + 1), text: i + 1 >= N ? "Finish" : "Next stop →" })
    ]);
  }

  function introPanel() {
    return el("section", { class: "panel", style: "--pc:var(--focus)" }, [
      el("p", { class: "eyebrow", text: "Start here" }),
      el("h2", { text: "Start your journey" }),
      el("p", { class: "explain", text: "Each numbered station is a session. The dots after a station are its learning goals. Click any station or dot, or use Next, to move your token along the path and read the explanation." }),
      el("div", { class: "nav-row" }, [
        el("span", { class: "meta-text", text: "Keyboard: arrow keys move along the path, Enter opens a stop." }),
        el("button", { class: "btn", type: "button", "data-key": "next", onclick: () => go(0), text: "Start the path →" })
      ])
    ]);
  }

  function finishPanel() {
    return el("section", { class: "panel", style: "--pc:var(--ship)" }, [
      el("p", { class: "eyebrow", text: "Finish" }),
      el("h2", { text: "You reached the end of the path" }),
      el("p", { class: "explain", text: `You have marked ${state.learned.size} of ${goalCount} learning goals. Revisit any station to review, or start again from the beginning.` }),
      navRow(),
      el("div", { class: "done-row" }, [
        el("button", { class: "link-btn", type: "button", "data-key": "restart", onclick: () => go(-1), text: "Back to the start" })
      ])
    ]);
  }

  function sessionPanel(st) {
    const s = st.session;
    return el("section", { class: "panel", style: `--pc:var(--${s.phase})` }, [
      el("p", { class: "eyebrow", text: `${phases[s.phase].name} · Session ${s.n}` }),
      el("h2", { text: s.title }),
      tagRow(s),
      el("h3", { text: "Learning goals on this station" }),
      el("ul", { class: "goal-list" }, s.learn.map((item, k) => {
        const id = `g${s.n}-${k}`;
        return el("li", {}, [el("button", {
          class: "goal-btn", type: "button", "data-key": `goal-${id}`,
          onclick: () => go(stops.findIndex(x => x.id === id)),
          text: (state.learned.has(id) ? "✓ " : "") + item.goal
        })]);
      })),
      el("h3", { text: "Real-world use case" }),
      el("p", { text: s.useCase }),
      el("h3", { text: "You'll produce" }),
      el("p", { text: s.deliverable }),
      limitBox(s),
      navRow()
    ]);
  }

  function goalPanel(st) {
    const s = st.session;
    const learned = state.learned.has(st.id);
    return el("section", { class: "panel", style: `--pc:var(--${s.phase})` }, [
      el("p", { class: "eyebrow", text: `Learning goal · Session ${s.n}: ${s.title}` }),
      el("h2", { text: st.item.goal }),
      el("p", { class: "explain", text: st.item.explain }),
      el("div", { class: "done-row" }, [
        el("button", { class: "btn", type: "button", "data-key": "learned", "aria-pressed": String(learned),
          onclick: () => toggleLearned(st.id), text: learned ? "Marked as learned ✓ (undo)" : "Mark as learned" }),
        el("button", { class: "link-btn", type: "button", "data-key": "back", onclick: () => go(st.sessionIndex),
          text: `← Back to Session ${s.n}` })
      ]),
      el("h3", { text: "Real-world use case of this session" }),
      el("p", { text: s.useCase }),
      el("h3", { text: "You'll produce" }),
      el("p", { text: s.deliverable }),
      limitBox(s),
      navRow()
    ]);
  }

  function renderPanel() {
    const active = document.activeElement;
    const focusKey = active && panel.contains(active) ? active.getAttribute("data-key") : null;
    const st = stops[state.index];
    let content;
    if (state.index < 0) content = introPanel();
    else if (state.index >= stops.length) content = finishPanel();
    else content = st.kind === "session" ? sessionPanel(st) : goalPanel(st);
    panel.replaceChildren(content);
    if (focusKey) {
      const match = panel.querySelector(`[data-key="${focusKey}"]`);
      if (match && !match.disabled) match.focus();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Page                                                                 */
  /* ------------------------------------------------------------------ */

  function renderLimits() {
    return el("section", {}, [
      el("h2", { text: "Limitations we design around" }),
      el("p", { class: "lede", text: "Every exercise and the capstone can be completed on an ordinary laptop or in a browser, with no paid tools." }),
      el("div", { class: "limits" }, limitations.map(l =>
        el("div", { class: "limit" }, [el("h4", { text: l.title }), el("p", { text: l.fix })]))),
      el("p", { class: "rule", text: "Premium tools such as Claude Code, Codex or paid Cursor may be demonstrated, but every demo also shows the free way to do the same thing." })
    ]);
  }

  function renderLimitChips() {
    return el("div", { class: "chips" }, [
      el("span", { text: "My limits:" }),
      ...Object.entries(constraints).map(([id, label]) => el("button", {
        class: "chip", type: "button", "aria-pressed": String(state.limits.has(id)),
        onclick: () => {
          state.limits.has(id) ? state.limits.delete(id) : state.limits.add(id);
          renderPanel();
          root.querySelectorAll('[data-limit]').forEach(b => b.setAttribute("aria-pressed", String(state.limits.has(b.dataset.limit))));
        },
        "data-limit": id, text: label
      }))
    ]);
  }

  function init() {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    root = document.getElementById("roadmap") || document.body.appendChild(el("div", { id: "roadmap" }));
    root.classList.add("rm");

    board.el = svgEl("svg", {
      class: "board", role: "group",
      "aria-label": "Learning path board. Use the arrow keys to move along the stations.",
      onkeydown: onBoardKey
    });
    boardWrap = el("div", { class: "board-wrap" }, [board.el]);

    progressText = el("p", { class: "progress-text" });
    progressFill = el("span", { class: "bar-fill" });
    panel = el("section", { "aria-live": "polite" });

    const legend = el("div", { class: "legend" }, Object.entries(phases).map(([key, p]) =>
      el("span", { style: `--pc:var(--${key})`, text: `${p.name}: ${p.hint}` })));

    root.replaceChildren(
      el("h1", { text: "Agentic software development & vibe coding: your learning path" }),
      el("p", { class: "lede", text: "Eleven stations, four phases, one goal: by the end, you can build with AI agents confidently in at least one area. Walk the path, click a station for the session, or a dot for a learning goal and its explanation." }),
      el("div", { class: "progress" }, [progressText, el("div", { class: "bar" }, [progressFill])]),
      boardWrap,
      legend,
      el("div", { class: "toolbar" }, [
        el("div", { class: "chips" }, [
          el("button", { class: "btn ghost", type: "button", onclick: () => go(state.index - 1), text: "← Back" }),
          el("button", { class: "btn", type: "button", onclick: () => go(state.index + 1), text: "Forward →" })
        ]),
        renderLimitChips()
      ]),
      panel,
      renderLimits()
    );

    if (window.ResizeObserver) new ResizeObserver(fitBoard).observe(boardWrap);
    else window.addEventListener("resize", fitBoard);

    fitBoard();
    setToken(posFor(state.index));
    paintStops();
    paintProgress();
    renderPanel();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
