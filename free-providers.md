---
title: "Free providers and agents"
subtitle: "Which free tool and model to use, and why the choice can differ from person to person"
---

This page lists the free ways to run the course exercises: the agents you type commands into, and the providers that supply the model behind them. Read [Standard setup](setup.html) first for the base installation.

Written for: learners choosing their first agent, and volunteers who need to explain the options.

::: {.callout-important appearance="simple"}
## There is no single correct choice

Developers differ in their operating system, their comfort with the terminal, their privacy rules, their internet speed and their patience with rate limits. A tool that suits one person may frustrate another. The series accepts any of the options below, as long as the exercise can be completed on the zero-cost path and your choice is written down in your project's `AGENTS.md`.
:::

## 1. Choose by your situation

Answer these questions first. The rows point to the options that usually fit.

| Your situation | Good starting point |
|:--|:--|
| You are new to the terminal and want a visual window | **Cline** or **Continue** in VS Code |
| You are comfortable in the terminal and want to see every step | **Gemini CLI** or **Aider** |
| You want one account that unlocks many free models | **OpenRouter** as the model source |
| You have no card and only a Google login | **Gemini CLI** with your Google account |
| Your data is sensitive and must stay on your machine | A local model through **Ollama**, with Aider, Cline or OpenCode pointed at it |
| You want an open-source agent you can read and change | **OpenCode** or **Aider** |
| Your work laptop blocks installs | The browser-only path in [Standard setup](setup.html#8-browser-only-path-no-installation) |

You can change your choice later. Your project files and `AGENTS.md` do not depend on the agent you used to write them.

## 2. The two layers: agent and model

Every option has two parts, and it helps to keep them separate in your head:

- The **agent** is the program you run. It reads your files, proposes edits and runs commands. Examples: Gemini CLI, Aider, Cline, OpenCode.
- The **model** is the AI that does the thinking. It is supplied by a **provider**, such as Google, OpenRouter or a model running on your own computer.

Some agents only work with one provider (Gemini CLI works with Google). Others accept many providers (Aider, Cline and OpenCode accept OpenRouter and most others). Using an agent that accepts many providers gives you the most options if one provider runs out of free quota.

## 3. The agents

### Gemini CLI (Google)

A terminal agent from Google. It is the **default** for the course exercises.

| | |
|:--|:--|
| **Runs in** | Terminal |
| **Install** | `npm install -g @google/gemini-cli` (needs Node.js, see [Standard setup](setup.html)) |
| **Sign-in** | Your Google account, the first time you run `gemini` |
| **Free limit (Google login, reported)** | About 1,000 model requests per day and 60 per minute |
| **Free limit (unpaid API key, reported)** | About 250 requests per day and 10 per minute, Flash models only |
| **Best for** | Learners who want the fewest steps and no API key |
| **Watch out for** | The free tier and product name may change. Some reports say Gemini CLI is moving to Antigravity CLI. Check the official site before you rely on it. |

Start it from your project folder with `gemini`. The first run asks you to sign in.

### Aider (open source)

A terminal agent that works with almost any model. It edits your files directly and can commit each change to Git.

| | |
|:--|:--|
| **Runs in** | Terminal |
| **Install (official route)** | `python -m pip install aider-install`, then run `aider-install` |
| **Install (uv route)** | `uv tool install aider-chat` |
| **Key** | An OpenRouter key, or a Google key, set as an environment variable |
| **Best for** | Learners who want to see every change and control the model directly |
| **Watch out for** | You choose the model yourself. Model names must be written exactly, for example `openrouter/<provider>/<model>`. |

To use a free OpenRouter model, put the key in `.env`, then run:

```bash
aider --model openrouter/qwen/qwen3-coder:free
```

To see what is available, run `aider --list-models openrouter/`.

### Cline (VS Code)

A free extension for VS Code with a visual panel. You bring your own key and pay the model provider, which can be zero on a free tier.

| | |
|:--|:--|
| **Runs in** | VS Code |
| **Install** | VS Code Extensions panel, then search "Cline" |
| **Key** | OpenRouter key entered in Cline's settings |
| **Best for** | Learners who are not yet comfortable in the terminal (Builder track) |
| **Watch out for** | The extension is free, but the model is not. Check the price of each model. Set a spending limit on your key. |

In Cline's settings, pick **OpenRouter** as the provider and paste your key. For free models, search the dropdown for "free", or choose `openrouter/free`, which picks a free model for each request.

### Continue (VS Code)

An open-source VS Code extension that works like Cline and accepts many providers. It is useful if you want a second option that runs inside the editor. Setup is similar to Cline: pick a provider and paste the key.

### OpenCode (open source)

An open-source terminal agent that connects to many providers, including local models through Ollama. Sources report that it includes free models that work without an account, though the list rotates.

| | |
|:--|:--|
| **Runs in** | Terminal |
| **Install** | `brew install opencode` (macOS or Linux with Homebrew), or `npm install -g opencode-ai` |
| **Windows** | Use WSL, as in [Standard setup](setup.html) |
| **Start** | Go to your project folder and run `opencode` |
| **Key** | Optional for built-in free models; needed for OpenRouter or Google |
| **Best for** | Learners who want an open-source agent and may later use local models |
| **Watch out for** | Free models change without notice. Check the official docs (opencode.ai) for the current list. |

## 4. The providers

### Google Gemini

Two ways to get free Gemini access:

1. **Google login through Gemini CLI.** No key needed. This is the simplest route and what the course default uses.
2. **An API key from Google AI Studio.** Free, no card required for the basic tier. Use it with Aider, Cline, OpenCode or any agent that accepts a Google key. Store it in `.env` as shown in [Standard setup](setup.html#5-store-your-keys-safely).

Free limits are per day and per minute, and they change. The unpaid API key allows far fewer requests than the Google login route.

### OpenRouter

OpenRouter gives one account and one key for many models. Free models have IDs ending in `:free`.

| | |
|:--|:--|
| **Sign-up** | <https://openrouter.ai>, create a key at the Keys page |
| **Card** | Not needed for free models |
| **Limits (reported)** | 20 requests per minute. Daily limit is reported as 50 requests on the unfunded tier, and some sources say 200. Buying about USD 10 in credits raises the daily limit to 1,000. Check the current figure on openrouter.ai. |
| **Model list** | Changes often. Free models can be busy at peak hours and disappear without notice. |
| **Data** | Whether prompts are kept or used for training depends on the provider serving each model. Check the model's page before sending anything sensitive. |

Good first models to try are the ones marked `:free` on the model page. Some agents let you list fallback models, so that if one is busy another answers.

### Local models (Ollama)

For private work, run a small model on your own computer. Nothing leaves your machine, but results are weaker and slower than hosted models. Use it for sensitive exercises only after a short test. Install Ollama from <https://ollama.com>, pull a small coding model, and point Aider, Cline or OpenCode at the local endpoint. Most learners with 8–16 GB RAM can run a model of about 1.5–8 billion parameters.

## 5. Compare at a glance

| Option | Cost | Needs a key | Terminal or IDE | Privacy | Setup effort |
|:--|:--|:--|:--|:--|:--|
| Gemini CLI (Google login) | Free | No | Terminal | Medium | Low |
| Aider + OpenRouter free | Free | Yes | Terminal | Medium | Medium |
| Cline + OpenRouter free | Free | Yes | VS Code | Medium | Low |
| Continue | Free | Yes | VS Code | Medium | Low |
| OpenCode | Free (built-in models) | Optional | Terminal | Medium | Medium |
| Local model via Ollama | Free | No | Either | Highest | High |

Privacy depends on the provider and the model you choose, so the table is a guide, not a guarantee. Follow the checklist in [Standard setup](setup.html#9-pick-a-tool-path-and-check-what-you-may-share) before you send any data.

## 6. Record your choice

Write your choice in your project's `AGENTS.md`, so the agent and your teammates know which tools you use:

```markdown
# Tool choice

- Agent: Gemini CLI (Google login)
- Fallback agent: Aider with OpenRouter model `openrouter/qwen/qwen3-coder:free`
- Private work: none; do not use hosted tools for private data
```

Re-check the limits and model names before each session. The sources used for this page were gathered in October 2026, and free tiers change often.

## Sources checked

These public pages were used to check the details above. Re-read them before each session.

- OpenCode: [computingforgeeks guide](https://computingforgeeks.com/setup-opencode-ai-coding-agent/), [tecmint guide](https://www.tecmint.com/opencode-ai-coding-agent-linux/)
- OpenRouter free models: [pinggy guide](https://pinggy.io/blog/free_ai_model_apis_unlimited_tokens_openrouter/), [pricepertoken free tier](https://www.pricepertoken.com/endpoints/openrouter/free)
- Gemini CLI quotas: [official quota page](https://geminicli.com/docs/resources/quota-and-pricing/), [Google AI developer forum](https://discuss.ai.google.dev/t/why-do-i-only-get-50-free-requests-per-day-for-gemini-2-5-pro-instead-of-100/101693)
- Aider install and OpenRouter: [aider install docs](https://aider.chat/docs/install.html), [aider OpenRouter docs](https://aider.chat/docs/llms/openrouter.html)
- Cline with OpenRouter: [tech-insider setup guide](https://tech-insider.org/ca/how-to-set-up-cline-2026/)
