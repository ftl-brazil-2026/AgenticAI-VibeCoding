---
title: "Standard setup"
subtitle: "One zero-cost environment for every learner, with private and premium options"
---

Follow this guide before the first session. It gives every learner the same tools, folder layout and config habits, so a command or a file that works for one person works for everyone in the series.

Written for: learners and volunteers setting up a laptop for the first time, including people who have never used a terminal.

**Default path: zero-cost.** Everything below is free. You do not need a GPU, a paid AI subscription or an international payment card. Paid and local options are listed in section 6 and explained in [Session 2](roadmap.html).

## 1. Choose your operating system

| System | What to do |
|:--|:--|
| **Windows** | Install **WSL 2** (Ubuntu) and do every exercise inside it. |
| **macOS** | Use the built-in Terminal app. Install Homebrew if you do not have it. |
| **Linux** | Use your normal terminal. |
| **Locked-down work laptop** | You cannot install tools. Use the browser-only path in section 8. |

### Windows: install WSL 2

WSL (Windows Subsystem for Linux) gives you a Linux terminal inside Windows. The course commands are written for Linux, so this is the one path that works the same for everyone.

Open **PowerShell as administrator** and run:

```bash
wsl --install -d Ubuntu
```

Restart when asked, open **Ubuntu** from the Start menu, and create a username and password.

::: {.callout-important appearance="simple"}
## Keep projects inside WSL

Work in your Linux home folder (`~`), not in `/mnt/c/...` (the Windows drive). Files there are much slower and cause line-ending and permission errors with Git and coding agents. To open a folder in Windows Explorer from the WSL terminal, run `explorer.exe .`.
:::

## 2. Learn the five terminal commands

Almost every tool in the series runs from the terminal. You only need five commands to start. Open your terminal and try each one:

| Command | What it does | Example |
|:--|:--|:--|
| `pwd` | Shows the folder you are in | `pwd` |
| `ls` | Lists the files in a folder (`dir` in Windows PowerShell) | `ls` |
| `cd` | Changes folder | `cd ~/unv-agentic-ai` |
| `mkdir` | Creates a folder | `mkdir notes` |
| `cat` | Shows the text of a file | `cat README.md` |

`~` means your home folder. `..` means the folder one level up, so `cd ..` goes back one step. Press the **Tab** key to finish a name you have started typing.

If any of these is new to you, complete the onboarding exercise in Session 0 before the live class.

## 3. Install the tools

Install these once. Each is free for the zero-cost path.

| Tool | Why we use it | Check it works |
|:--|:--|:--|
| **Git** | Versions your work and shares it on GitHub | `git --version` |
| **GitHub account** | Hosts your repositories and the course examples | Log in at github.com |
| **VS Code** | The shared editor, with the agent extensions | `code --version` |
| **uv** | Installs Python and Python command-line tools | `uv --version` |
| **Node.js** | Needed only for Gemini CLI | `node --version` |

**Ubuntu / WSL**

```bash
sudo apt update && sudo apt install -y git curl nodejs npm
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**macOS**

```bash
brew install git node uv
```

**VS Code**: install it on Windows or macOS from <https://code.visualstudio.com>. On Windows, also install the **WSL** extension by Microsoft. Then, inside your WSL terminal, run `code .` in a project folder to open it in VS Code.

Restart the terminal after installing `uv` or `node` so the new commands are found.

Then tell Git who you are, using the same name and email as your GitHub account:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## 4. Install the coding agents

**Gemini CLI is the default agent** for the zero-cost exercises. Install it now. You do not need a key for it: sign in with your Google account the first time you run it.

| Agent | Role | Install | Account needed |
|:--|:--|:--|:--|
| **Gemini CLI** (terminal) | **Default** for the exercises | `npm install -g @google/gemini-cli` | Google login |
| **Aider** (open source, terminal) | Optional; works with any model | `uv tool install aider-chat` | OpenRouter key, section 5 |
| **Cline** or **Continue** (VS Code) | Optional; the visual alternative | Search for the name in the VS Code Extensions panel | OpenRouter key, section 5 |
| **GitHub Copilot Free** (VS Code) | Optional | Search for "GitHub Copilot" in the Extensions panel | GitHub login |

Check the default agent:

```bash
gemini --version
```

Gemini CLI is the course default, but it is not the only option. Developers often choose differently, and the alternatives and their trade-offs are in [Free providers and agents](free-providers.html).

Installing a tool is not the same as using it. The live demo in each session shows which one to start with, and the cost and privacy notes are in [Session 2](roadmap.html).

## 5. Store your keys safely

Keys are passwords: anyone who has one can use your quota, and a leaked key can be billed to you.

The default agent, Gemini CLI, uses your Google login and needs no key. The other agents use a free **OpenRouter** key, which gives access to free models through one account.

1. Sign up at <https://openrouter.ai> and create a key. Choose a model marked as free.
2. Create a file named `.env` in your project folder and put the key in it:

   ```text
   OPENROUTER_API_KEY=your-key-here
   ```

3. Never paste the key into code, notebooks, `AGENTS.md`, screenshots, chat messages or prompts.
4. Keep `.env` out of Git (see section 6 for the `.gitignore` file).

::: {.callout-warning appearance="simple"}
## Free tiers can use your prompts

On many free plans the provider may use what you send to improve its models. Do not send private, personal or organisational data to any hosted tool. Use synthetic or public data in exercises. Section 9 gives the full checklist.
:::

## 6. Folder structure and where files go

Create one workspace folder and keep everything for the series in it:

```text
~/unv-agentic-ai/
├── projects/          # one folder per Git repository you clone or create
│   ├── hello-agent/   # Session 0 deliverable
│   └── ...
├── exercises/         # notes and small experiments
├── data/              # local data files; never committed
└── scratch/           # throwaway tests you can delete at any time
```

Create it in one step:

```bash
mkdir -p ~/unv-agentic-ai/{projects,exercises,data,scratch}
```

**Naming rules**: lower-case words joined by hyphens, such as `my-first-agent`. Avoid spaces and accents. Do not keep projects in a folder synced by OneDrive, Google Drive or Dropbox, because sync tools corrupt the `.venv` folder and Git history.

### Where each kind of file lives

| File | Location | Committed to Git? |
|:--|:--|:--|
| Code and specs | Inside the project folder | **Yes** |
| `AGENTS.md` (project rules for the agent) | Root of the project folder | **Yes** |
| `spec.md` (what you want built) | Root of the project folder | **Yes** |
| API keys | `.env` in the project root | **Never** |
| Template showing which keys are needed | `.env.example`, with empty values | Yes |
| Python environment | `.venv/`, rebuilt from the project files | **Never** |
| Private or large data | `data/` in your workspace | **Never** |
| Agent logs and run output | `runs/` or `logs/` in the project | Only if they contain no secrets |

### Every project starts with a `.gitignore` file

Create `.gitignore` in the project root so Git never tracks secrets or generated files:

```text
.env
.venv/
__pycache__/
data/
logs/
```

Then create the repository:

```bash
cd ~/unv-agentic-ai/projects
mkdir hello-agent && cd hello-agent
git init -b main
```

### AGENTS.md: tell the agent how to work

`AGENTS.md` is a plain-text file the agent reads before it changes your code. Put your project rules in it: the language, the test command, the folders it may edit, and what it must never do. This is the **project rules file** from Session 2. A starter template:

```markdown
# Project rules

- Language: Python 3.12. Dependencies are managed with uv.
- Run tests with: uv run pytest
- Only edit files inside src/ and tests/.
- Never read or print the contents of .env.
- Ask before deleting any file.
```

## 7. Branch and update your work

Keep `main` clean and do each week's work on its own branch:

```bash
git checkout -b week-1
```

When you need the latest course material, switch back and update:

```bash
git checkout main
git pull
git checkout week-1
git merge main
```

Commit small, named changes as you go, for example `git commit -m "Add first tool"`.

## 8. Browser-only path (no installation)

Use this path if you cannot install software, your computer is weak, or your work laptop is locked down.

1. Sign in to GitHub and open a **GitHub Codespace** from the repository page (**Code → Codespaces → Create codespace**). It gives you VS Code in the browser with a terminal, and the free monthly hours are enough for the series.
2. Everything in sections 2, 6 and 7 works the same inside the Codespace terminal.
3. Use a free web assistant or the agent extensions inside the Codespace for the exercises.

## 9. Pick a tool path and check what you may share

The series has four tool paths. Each session explains the trade-offs. Start with the zero-cost path unless your coordinator says otherwise.

| Path | Examples | Cost | Privacy | Effort |
|:--|:--|:--|:--|:--|
| **Zero-cost** (default) | Aider, Cline or Continue; Gemini CLI; Copilot Free; Codespaces | USD 0 | Medium: free tiers may use prompts | Medium |
| **Balanced** | Pay-as-you-go API with a spending cap; one IDE agent plan | About USD 5–20 per month | Medium to high | Low to medium |
| **Premium** (demo only) | Claude Code, OpenAI Codex, paid Cursor or Windsurf | USD 20+ per month | High on enterprise plans | Low |
| **Private / local** | Ollama or LM Studio with a small coding model | USD 0 software; needs about 8–16 GB RAM | Highest | High |

**Never paste this into any hosted AI tool:**

- Names, IDs, phone numbers, addresses and health or personal records of real people
- Passwords, API keys, tokens and private certificates
- Unpublished financial, contract or procurement data from an organisation
- Internal documents, emails or source code that your employer has not cleared for external use

When in doubt, use synthetic data, or switch to the private/local path for that task.

## 10. Check your setup

Run each command. Each should print a version number:

```bash
git --version
uv --version
node --version
code --version
gemini --version
aider --version
```

If a command says "not found", close the terminal and open a new one. If it still fails, note the exact message and ask in the course channel.

Optional, for the private/local path only:

```bash
ollama --version
```

::: {.callout-note appearance="simple"}
## Free tiers change

Limits, model names and free plans change often. Before each session, the coordinators re-check the tools listed here, so a step that no longer matches the provider's screen should be reported in the course channel.
:::
