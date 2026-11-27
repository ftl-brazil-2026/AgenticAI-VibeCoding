# Practical Multi-Agents Orchestration - Building AI-Driven Development Workflows

**📅 Date & Time:** November 17, 2026 at 15:35 (3:35 PM UTC)  
**👨‍🏫 Presenter:** Lwin Ravendo (Frontier Tech Leader, UN Volunteer, Agentic AI Trainer)  
**🎯 Session Type:** Hands-On Lab - Multi-Agent System Development  
**⏱️ Duration:** 1 hour 37 minutes

---

## Overview

This practical session demonstrates real-world multi-agent orchestration using **Quro**, a modern AI-powered development environment. Participants see how to coordinate multiple AI agents to build complete software projects from specification to deployment, managing parallel workflows, handling errors, and maintaining code quality throughout the development lifecycle.

---

## Key Learning Outcomes

1. **Understand Agentic AI Under the Hood** - Master the anatomy of agents and how loops enable intelligence
2. **Master Quro Environment** - Learn web-based, CLI, and IDE development with multi-agent workflows
3. **Manage Multi-Agent Sessions** - Coordinate multiple agents working on different tasks in parallel
4. **Handle Errors & Rollbacks** - Use git checkpoints and recovery techniques effectively
5. **Deploy Production Code** - Build complete projects with proper testing and validation

---

## Main Topics Covered

### 1. **Agentic AI Anatomy: Under the Hood**

#### **The Core Loop Structure**

```
Model → System Prompt → Tool Calls → Scales → MCP Instructions
  ↓
Messages Block (storage for context, memory, messages)
  ↓
Loops continuously until goal is achieved
```

**Key Components:**
- **Model:** The LLM (Claude, GPT, etc.)
- **System Prompt:** Triggers tool calls and agent behavior
- **Tool Calls:** Actions the agent can request (run code, modify files, etc.)
- **Scales:** Reusable instructions and skills
- **MCP Instructions:** Model Context Protocol for external integrations
- **Messages Block:** Persistent storage for context and history

**Definition:** A strong AI engineer is a person who can run this loop reliably and at scale.

#### **Three Types of Agent Architectures**

**1. Independent/Isolated Agents**
```
Agent A ─┐
Agent B ─├─ Isolated execution (no direct communication)
Agent C ─┘
```
- Each works independently in sandboxed environment
- No coordination between agents
- Best for simple, non-dependent tasks

**2. Decentralized (P2P) Agents**
```
Agent 1 ←→ Agent 2
  ↕        ↕
Agent 3 ←→ Agent 4
```
- Peer-to-peer direct connections
- Agents communicate directly
- More complex coordination
- Example: blockchain-inspired architectures

**3. Centralized Agents**
```
Central Controller/Broker
        ↓
   ┌────┼────┐
   ↓    ↓    ↓
  Sub  Sub  Sub
  Ag-A Ag-B Ag-C
```
- Central orchestrator controls all sub-agents
- Clear command flow
- Easier to manage but single point of failure

**4. Hybrid Architecture**
```
Global Coordinator
    ↓
 ┌──┴──┐
 ↓     ↓
Cluster A  Cluster B
(Decentr.) (Centralized)
```
- Combines multiple patterns
- Used by cloud-augmented research systems
- Most flexible approach

### 2. **Generative AI vs. Agentic AI**

#### **Traditional Generative AI**
- **Type:** Reactive systems
- **Process:** Prompt → Generate → Return
- **Context Window:** Previously ~8K tokens
- **Control:** Limited to generation
- **Example:** ChatGPT interface usage

#### **Agentic AI**
- **Type:** Proactive systems
- **Process:** Prompt → Action → Tool Call → Perception → Decide → Execute
- **Context Window:** 1M - 10M tokens (massive expansion)
- **Control:** Agent decides next steps
- **Models with Large Context Windows:**
  - Llama 2: 10M tokens (recent)
  - GPT-6 Extra: 1M tokens
  - Claude Opus 5: 1M tokens
  - Gemini 4 Aragon: 1M tokens
  - Qwen Qwanta: 1-10M tokens (late 2026)

**Leading Inference Engineering Platforms:**
- HexDash
- Prime Perform
- Together.ai
- Firewalls AI

**New Failure Modes (2026):**
- Semantic failures (meaning breaks down at scale)
- Logic failures (inference reasoning fails)

### 3. **Evolution of Vibe Coding: 2025 → 2026**

#### **Traditional Vibe Coding (2025)**
```
User Prompt
    ↓
LLM + Few-shot examples
    ↓
Generate output
    ↓
Edit prompt → Loop until satisfied
    ↓
Result
```
- Primarily prompt-driven
- Limited by context window
- Trial and error approach

#### **Specification-Driven Development (Modern)**
```
User Prompt (Specification)
    ↓
LLM Creates Endpoints/Features
    ↓
Add Validation & Error Handling
    ↓
Test & Verify
    ↓
Return 200 status (success)
```
- Clear specifications from start
- Structured error handling
- Proper acceptance validation

#### **AI-First SDLC (Complete Lifecycle)**
```
Requirements (Context Isolation)
    ↓
Design (BRDs, mission control files)
    ↓
Build (Agent workflow MD files)
    ↓
Test (Stack traces, error handling)
    ↓
Release (Deployment environment)
    ↓
Operate (Grafana dashboards, monitoring)
    ↓
Maintain (Production environment)
```

**Key Principle (2026):** "Evals are the new PRD of digital workspace" — Luin CEO insight that evaluation frameworks now define product requirements.

### 4. **Quro: AI-Powered Development Environment**

#### **What is Quro?**

Quro is an AI-powered IDE that helps build software from prototype to production with:
- Web-based IDE (no local storage needed)
- Local IDE (VS Code integration)
- CLI interface
- Mobile app (newly released)

#### **Multi-Model Deployment Options**

| Model | Credits | Context Window | Use Case |
|-------|---------|---|----------|
| Claude Opus 5.5 | 1 credit | 1M tokens | Power/precision |
| Claude Sonnet 5 | 1.38 credits | 1M tokens | Balanced |
| Claude Haiku 4.4 | 2.7 credits | Lower | Budget |
| GPT-5.6 | 4.4 credits | 1M tokens | Alternative |
| DeepSeek M1 | Lower cost | Variable | Budget coding |
| Kimi K3 | Variable | - | Data flow/code analysis |

#### **Quro Web Environment Features**

**1. Cloud Configuration (Agent Config)**
- Share configurations across web and local environments
- Synchronize workspaces between IDE and browser
- Persistent session state

**2. DRM System (Development Requirements)**
- Document development standards in IDE and CLI
- Include: coding standards, architectural decisions, profile libraries, dependencies
- Portable across all environments

**3. Skills**
- Reusable instructions for agents
- Specialized for specific tasks
- Stored as folders with `.skill.md` and `.rules`
- Applied contextually per session

**4. Custom Agents**
- Create tailored agents for specific tasks
- Defined via JSON or Markdown+YAML
- Synchronized across environments
- Task-specific configurations

**5. Hooks**
- Trigger agent prompts or shell commands automatically
- Events: file saving, tool calls, prompting, etc.
- Each hook maps to JSON file in project
- Integration: Telegram, Discourse, etc.

**6. Workflows**
- Multi-step recipes reusable by agents
- Workflow format: `.workflow.json` or `.workflow.yaml`
- Enable parallel task execution
- Save and reuse across projects

**7. Powers (MCP Integration)**
- Connect agents to external tools and services
- One standard way to access external resources
- Upload custom MCPs as folders
- Typically `.power.md` at root

**8. Memory Management**
- Session recap: summarize conversations
- Automatic memory persistence
- Reopen summaries or pick up where left off
- Model fallback: switch models if one unavailable

**9. Approval Modes**
- **Default:** Every action needs human approval
- **LLM-based:** Intelligent approval suggestions
- **Modes:** Allow once, block once, ask if unsure

#### **Project Creation Workflow**

**Step 1: Create New Chat Session**
- Define working space
- Choose coding model (consider credits/power)
- Set effort level (auto vs. manual)
- Attach relevant files
- Limit/enable internet access
- Select repository access level

**Step 2: Configure Workspace**
- Set up digital workspace environment
- Define repository location
- Create GitHub integration

**Step 3: Start Development**
- Use multi-agent workflows
- Run parallel sessions
- Monitor token usage and costs

### 5. **Multi-Agent Session Management in Practice**

#### **Exploration Session Example**

**Scenario:** Understanding an existing project

**Agent Actions:**
1. Looks for steering files (project specifications)
2. Searches for learning memories
3. Attempts repository operations
4. Uses investigation tools iteratively
5. Provides comprehensive analysis

**Chain of Thought Process:**
- Agent thinks step-by-step (may take 20-40 seconds)
- Multiple tool investigations
- Iterative refinement
- Final consolidated response

**Token Usage:** 11,292 credits for detailed exploration

#### **Coding Session Management**

**Multi-Session Parallel Workflow:**
```
Session 1: Backend Development
Session 2: Frontend Implementation  
Session 3: Testing & Validation
Session 4: Documentation

All running with shared workspace context
```

**Workflow Challenges Encountered:**
- Workflow launch failures (invalid input)
- Schema mismatches
- Iteration limits
- Branch management

**Recovery Techniques:**
- Step-by-step workflow iteration
- Explicit parameter specification
- Format validation
- Fallback strategies

#### **Real Project Example: Cloud-Native Architecture**

**Project Structure Created:**
```
backend/
  main/
  deployment/

frontend/
  components/
  
docs/
  architecture/
```

**Technology Stack:**
- Frontend: React, Vite
- Backend: FastAPI 2.0
- Caching: Redis
- MCP Studio integration

**Runtime Architecture:**
```
Browser (SSY) → HTTPS
      ↓
Frontend (TS)
      ↓
API (FastAPI)
      ↓
Redis Cache
      ↓
MCP Studio Services
```

**Orchestration Pattern:**
```
Validation Step → Authorization → Execution
  ↓               ↓                ↓
Schemas       User Checks      Task Logic
(Type safety) (Permission)    (Business logic)
```

### 6. **Error Handling & Recovery**

#### **Common Challenges**

1. **Clone Repository Errors**
   - Attempting to clone during development
   - Caused by vague initial prompts
   - Solution: Provide clear workspace context

2. **Workflow Launch Failures**
   - Invalid input messages
   - Missing schema definitions
   - Solution: Explicit parameter types and validation

3. **Session Management Issues**
   - Multiple agents conflicting
   - Sandbox sleep/wake cycles
   - Solution: Clear session boundaries

#### **Recovery Strategies**

**Git Rollback:**
```bash
git status           # Check current state
git restore <file>   # Discard uncommitted changes
git reset --hard     # Return to last commit
```

**Session Cleanup:**
- Close problematic session
- Create new focused session
- Provide full context from start

**Branching Strategy:**
- Create separate branches for features
- Avoid main branch conflicts
- Clean merge requests with proper CI

### 7. **Practical Session Flow**

#### **Phase 1: Initial Exploration** (4-20 seconds)
- Agent reviews project structure
- Identifies existing code
- Notes potential issues

#### **Phase 2: Implementation** (10-30 minutes)
- Agent writes code based on specifications
- Creates multiple files
- Tests implementation
- Fixes errors iteratively

#### **Phase 3: Validation** (5-10 minutes)
- Push branches to GitHub
- Create pull requests
- Verify CI/CD checks
- Document limitations

#### **Phase 4: Documentation** (5-15 minutes)
- Update README
- Create architecture diagrams
- Document deployment notes
- Plan future enhancements

**Total Time per Feature:** 20-60 minutes

### 8. **Cost Management**

**Example Costs:**
- Exploration session: ~11K credits (20-40 minutes)
- Implementation session: ~20-30K credits
- Validation & testing: ~10-15K credits
- Documentation: ~5-10K credits

**Cost Optimization:**
1. Use cheaper models for simple tasks
2. Batch related changes
3. Provide clear specifications upfront
4. Reuse existing sessions when possible
5. Monitor token usage per session

### 9. **Best Practices for Multi-Agent Orchestration**

✅ **DO:**
- Create separate sessions for distinct tasks
- Provide full context in each session
- Use workspace-level storage
- Document limitations and risks
- Test before merging
- Create meaningful commit messages

❌ **DON'T:**
- Merge unreviewed code blindly
- Ignore test failures
- Expose secrets in code
- Create too many parallel sessions at once
- Skip CI/CD validation
- Assume first attempt is production-ready

---

## Key Takeaways

### **The Agentic Loop is the Foundation**
Understanding how agents think, act, and iterate is essential for effective orchestration.

### **Workspace Context Matters**
Agents perform better when they understand the full project context, not just individual tasks.

### **Multi-Agent Coordination Requires Planning**
Clear task boundaries, proper branching, and clean handoffs prevent errors.

### **Cost and Speed Are Tradeoffs**
Faster models cost more; cheaper models take longer. Choose based on task complexity.

### **Human Oversight Remains Critical**
Even with advanced agents, review, test, and validation are non-negotiable.

### **Tools and Environment Shape Quality**
Good development environments (like Quro) with proper memory, hooks, and workflows significantly improve outcomes.

---

## Technical Lessons Learned

### **On Token Economy**
- 1M tokens ≈ 550K lines of code
- Track usage per session
- Model selection impacts cost significantly

### **On Error Patterns**
- Vague prompts lead to unnecessary work
- Clear specifications reduce iteration
- Architecture understanding prevents regressions

### **On Workflow Design**
- Parallel execution requires careful coordination
- Branching strategy prevents conflicts
- CI/CD validation catches early problems

---

## Action Items for Participants

✅ Set up Quro account (free tier available)  
✅ Explore multi-agent workflows in practice  
✅ Experiment with different models and costs  
✅ Create workspace-specific configurations  
✅ Practice session management techniques  
✅ Document your team's reusable skills  

---

## Resources & Tools Mentioned

**Development Environments:**
- Quro (Primary demo)
- Cursor
- VS Code + extensions
- Replit

**Agents & Orchestration:**
- Quro Crew (Local IDE)
- LangChain
- CrewAI

**Deployment & Monitoring:**
- GitHub/GitLab
- Grafana dashboards
- CI/CD pipelines (GitHub Actions, etc.)

---

## Session Closing

**Lwin's Message:**
"I want to show you how I've used these agents in my projects, managing multi-agent teams in this environment. Everyone has their own way of defining and creating projects. This is my way of doing the work. If you have projects you want to create together, we can work on this environment and learn it together."

**Key Success Formula:**
> Vibe Coding + Discipline + Multi-Agent Orchestration = Production-Ready Software

---

**Next Steps:** Session X focuses on debugging in agentic systems — how to handle failures and maintain code quality when things go wrong.

**Further Learning:** Explore Quro documentation, LangChain, and CrewAI for deeper multi-agent orchestration patterns.
