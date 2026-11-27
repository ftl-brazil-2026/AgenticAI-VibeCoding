# Context Engineering & Large Codebases - Making AI Agents Work in Real Projects

**📅 Date & Time:** November 25, 2026 at 15:39 (3:39 PM UTC)  
**👨‍🏫 Presenter:** Ekoko Clesh (Based in Mozambique)  
**🎯 Session Type:** Practical Hands-On Lab  
**⏱️ Duration:** 1 hour 30 minutes

---

## Overview

This practical session teaches how to work effectively with AI coding agents on large, existing codebases. Rather than generating code from scratch, participants learn to guide AI agents to understand project structure, respect constraints, and make targeted changes. By the end, participants can create repository maps, write effective agent instructions, and review AI-generated code safely.

---

## Three Key Outcomes

By the end of this session, you will have:

1. **A repository map** - Visual understanding of how components connect
2. **A clear task brief** - Instructions that guide AI agents effectively
3. **Code review skills** - Ability to validate AI-generated changes

---

## AI Coding Agent vs. Chat Assistant

### **Chat Assistant (Limited)**
- Answers questions
- Suggests code snippets
- Reactive and passive
- Example: "How do I create auth in Python?"

### **AI Coding Agent (Powerful)**
- Inspects entire project
- Makes multi-step plans
- Edits code across multiple files
- Runs tools (tests, linters, etc.)
- Generates reports
- **Understands context** of existing code

**Example Difference:**
- **Chat:** "Here's a Python auth pattern"
- **Agent:** Finds existing auth system → understands patterns → implements consistent changes

---

## Why Large Codebases Are Hard (Four Reasons)

### **1. Structure Complexity**
- Many folders, modules, entry points
- Shared services and data flows
- Changing one file may break other parts
- Requires understanding interconnections

**Example:** Modifying a login function without knowing if auth is in that controller or another service can break everything.

### **2. Historical Context**
- Legacy code with undocumented decisions
- Reasons for implementations lost to time
- Must be preserved to avoid regression
- Not obvious from code alone

### **3. Boundaries & Constraints**
- Authentication requirements
- Data protection rules
- Security restrictions
- Team-owned areas that shouldn't be touched
- API contracts that must remain stable

### **4. Evidence Requirements**
- Tests show expected behavior
- Documentation reveals intent
- Logs indicate error patterns
- Must be understood before changes

---

## Bad Prompt vs. Good Prompt

### **❌ Bad Prompt: Vague & Unclear**
```
"Add authentication"
```
- No location specified
- No existing pattern identified
- No boundaries defined
- No success criteria
- Result: Agent guesses, may break things

### **✅ Good Prompt: Clear & Scoped**
```
Backend uses existing JWT middleware in auth.py
Keep the user schema unchanged
Run the auth tests to verify
```
- Specifies location
- Identifies pattern to follow
- Defines constraints
- Provides verification method
- Result: Agent understands exactly what to do

---

## Four Essential Parts of an Agentic Task

### **1. Goal - What should change?**
Example: "Add a filter to dashboard allowing users to view records by date"
- Clear action
- Specific outcome
- Measurable result

### **2. Context - Which files/docs matter?**
Example: "Dashboard component in frontend/, API in backend/api.py, tests in tests/dashboard"
- Relevant files
- Related components
- Existing patterns
- Documentation locations

### **3. Constraint - What must stay unchanged?**
Example: "Don't modify database schema, keep API response format, no new dependencies"
- Database structure
- API contracts
- Existing dependencies
- File organization
- Naming patterns

### **4. Done When - What evidence shows completion?**
Example: "Date filter works on dashboard, existing features unchanged, all tests pass"
- Specific behaviors
- Test coverage
- Verification steps
- Success criteria

---

## Real Example: Task Manager Application

### **Goal**
Build a simple web task manager with:
- Display task list
- Add new tasks
- Delete tasks
- Mark tasks completed
- Show completion counts
- Persist tasks in browser storage

### **Constraints**
- Use only HTML, CSS, JavaScript
- No external libraries
- Beginner-friendly code
- Separate into 3 files (index.html, style.css, script.js)
- Use meaningful variable names
- Responsive design

### **Done When**
- Tasks appear when added
- Appearance changes when marked complete
- Tasks disappear when deleted
- Tasks persist after refresh
- Task count updates automatically

### **Result**
Agent successfully created working task manager. Live demo in browser showed:
- Adding tasks (e.g., "Coding", "Running")
- Marking complete (stroke-through)
- Deleting tasks
- Local storage persistence
- Responsive UI

---

## Mapping a Large Repository

### **Step 1: Identify Entry Point**
Find the main file that starts the application
- May be test file, main.py, index.js, etc.
- Shows how components interact

### **Step 2: Map Components**
Identify major parts:
- Models (data structures)
- Services (business logic)
- Validators (input checking)
- Tests (expected behavior)

### **Step 3: Understand Data Flow**
How does information move?
- Request → Validation → Processing → Response
- File → Parser → Logic → Output

### **Step 4: Document Everything**
Create `repository_map.md` including:
- Main entry point
- Key components
- Data flow
- Important constraints
- Testing approach

---

## Example Repository Map

**Task Manager Demo Structure:**

```
├── models.py (Task data: id, title, email, dueDate, completed)
├── services.py (Business logic: create_task, list_tasks, complete_task)
├── validator.py (Input validation: validate_email, validate_title)
└── test_services.py (Tests: verify functions work correctly)
```

**Entry Point:** test_services.py imports and tests all services

**Data Flow:**
1. Input (title, email) → Validator
2. Validator checks format
3. Services create task with auto-incrementing ID
4. Task added to list in memory
5. Test verifies behavior

---

## Why Project Rules Matter: agents.md

### **Problem**
Repeating same instructions daily wastes tokens:
- "Use Python 3 -m pytest to run tests"
- "Keep validation in validator.py"
- "Never hardcode secrets"
- "Report changed files after each task"

### **Solution: Create agents.md**
Single file containing stable project rules:

```markdown
# Project Instructions for AI Agents

## Commands
- Run tests: `python -m pytest`
- Start server: `python -m http.server`

## Architecture
- Keep validation logic in validator.py
- Services handle business logic
- Tests verify all changes

## Constraints
- Never hardcode API secrets
- Don't modify database schema
- Reuse existing validation patterns

## Reporting
- Report all files changed
- Show test results
- Note any new dependencies
```

### **Benefits**
- One-time specification
- Saves tokens on repeated tasks
- Ensures consistency
- Easy to maintain
- Shared across team

---

## Six-Step AI-Assisted Workflow

### **Step 1: Explore**
- Understand repository structure
- Identify files related to task
- Find existing patterns
- Note constraints

### **Step 2: Plan**
- Ask agent to explain what it will change
- Get proposed implementation plan
- Review scope and approach

### **Step 3: Approve**
- Review the plan
- Check it respects architecture
- Verify constraints understood
- Approve before coding

### **Step 4: Edit**
- Allow agent to implement approved changes
- May happen across multiple files
- Should be scoped and focused

### **Step 5: Test**
- Run relevant tests
- Verify expected behavior
- Check for regressions
- Look for new errors

### **Step 6: Review**
- Inspect actual changes made
- Verify limited to relevant files
- Check test coverage
- Look for security issues
- **Human decides: Accept or reject**

---

## Critical: Passing Tests ≠ Ready to Merge

**Important Reminder:**
Tests passing does NOT automatically mean code is good.

**Agent might still:**
- Introduce unnecessary dependencies
- Modify unrelated files
- Change API contracts
- Create technical debt
- Miss edge cases

**Human review is required for:**
- Architecture consistency
- Code quality
- Security implications
- Performance impact
- Maintainability

---

## Four Questions to Evaluate AI Changes

Before accepting any AI-generated code, ask:

### **1. Task Correctness**
Does the implementation actually match the request?
- Behavior matches requirement?
- Expected workflows work?
- Edge cases handled?

### **2. Scope Adherence**
Are changes limited to relevant files?
- No unrelated modifications?
- Existing code untouched where appropriate?
- Dependencies unchanged?

### **3. Test Coverage**
Do tests cover behavior and failures?
- Happy path tested?
- Error cases handled?
- Edge cases included?
- Appropriate assertions?

### **4. Quality & Safety**
Is implementation safe and consistent?
- Architecture respected?
- Security vulnerabilities absent?
- Code quality maintained?
- Performance acceptable?
- Existing patterns followed?

---

## Real-World Example: Email Validation Change

### **Task Brief (Bad)**
"Improve email validation"

### **Task Brief (Good)**
```
Goal: Enhance email validation in validator.py
Context: Current regex pattern at line 42, used in services.py create_task()
Constraint: Keep function signature same, don't modify models
Done When: Valid emails pass, invalid rejected, existing tests pass
```

### **What Agent Should Do**
1. Inspect existing pattern
2. Understand why pattern exists
3. Propose specific improvement
4. Verify backward compatibility
5. Run all validation tests
6. Report changes made

### **What to Review**
- Did it change function signature? (bad)
- Did it break existing tests? (bad)
- Is performance worse? (bad)
- Does it handle more cases correctly? (good)
- Did it touch unrelated files? (bad)
- Did it explain the change? (good)

---

## Context Engineering Best Practices

### **Keep in agents.md (Stable)**
- Project structure guidelines
- Architecture patterns
- Testing commands
- Constraint rules
- Never-modify files

### **Put in Task Brief (Specific)**
- Exact goal for this task
- Specific files involved
- Particular constraints
- Definition of done
- Verification steps

### **Don't Include (Causes Confusion)**
- Vague general statements
- Contradictory instructions
- Historical context not relevant
- Excessive examples
- Unrelated project history

---

## SWE Bench: AI Benchmark

**What:** Standard benchmark to evaluate AI systems on real programming tasks

**How:** Uses real issues from actual repositories
- Real requirements
- Real codebases
- Real test suites
- Real constraints

**Key Insight:** Generating code that "looks right" is not enough
- Must solve the actual issue
- Must pass existing tests
- Must work in real context
- Must be maintainable

**Reminder:** Even when automated tests pass, humans must review

---

## Session Summary Workflow

**Remember this order:**

```
Context
   ↓
Scoped Task
   ↓
Small Change
   ↓
Supported by Evidence (Tests)
   ↓
Human Decision (Accept/Reject)
```

---

## Key Takeaways

### **For Large Codebases:**
1. Never ignore existing structure and patterns
2. Understand why decisions were made
3. Respect boundaries and constraints
4. Use repository maps for guidance
5. Create reusable agent instructions

### **For AI Agents:**
1. Provide context, not just requirements
2. Specify constraints clearly
3. Define success criteria explicitly
4. Use agents.md for project rules
5. Task briefs for specific work

### **For Code Review:**
1. Test pass ≠ Code is good
2. Check scope (only necessary files)
3. Verify architecture consistency
4. Look for hidden problems
5. Human decides final approval

---

## Final Checklist Before Task

Before giving task to AI agent:

✓ Created repository_map.md?  
✓ Wrote agents.md with project rules?  
✓ Identified specific files involved?  
✓ Defined clear constraints?  
✓ Specified success criteria?  
✓ Prepared test commands?  
✓ Reviewed similar existing code?  
✓ Ready to review changes?

---

## Recommended Next Steps

1. **For Your Project:**
   - Create repository_map.md
   - Write agents.md
   - Define first task brief

2. **For Your Team:**
   - Share repository_map.md
   - Establish project rules
   - Create review checklist

3. **For Continuous Improvement:**
   - Log what agents do well
   - Document what goes wrong
   - Refine instructions over time

---

**Session Closing:**

> Context leads to scoped task. Scoped task leads to small change. Small change must be supported by evidence. Final decision belongs to human developer.

Remember: The goal is not to remove humans from decision-making, but to make AI tools more effective while keeping humans in control.

