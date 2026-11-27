# Debugging in the Agentic Cage - Maintaining Control Over AI-Generated Code

**📅 Date & Time:** November 23, 2026 at 15:42 (3:42 PM UTC)  
**👩‍🏫 Presenter:** Shakila Alam Aishy (CS Student, Elite Research Lab Intern)  
**🎯 Session Type:** Theory & Debugging Principles  
**⏱️ Duration:** 43 minutes 35 seconds

---

## Overview

This session teaches systematic debugging of AI-generated code. The key insight: **AI can write code quickly, but speed doesn't equal quality**. Just as a mechanic can replace a car part quickly, we must still verify safety before driving. This session teaches frameworks for inspecting, testing, and verifying AI output.

---

## Key Learning Outcomes

1. **Understand Code Failure Modes** - Recognize four common reasons AI code breaks
2. **Audit Generated Code Effectively** - Develop verification checklists
3. **Provide High-Signal Context** - Write prompts that prevent misunderstanding
4. **Avoid Endless Loop Failures** - Know when to stop and reconsider
5. **Implement Safety Nets** - Use git checkpoints and regression tests
6. **Write Effective Bug Reports** - Communicate issues precisely to agents

---

## Three Critical Characteristics

### **1. Autonomous Loop**
- AI follows continuous cycle: read → change → run → test → retry
- Enables multi-step task handling
- Must be monitored for infinite loops

### **2. Generation vs. Quality**
- **Speed ≠ Quality**
- Code may look correct but contain subtle errors
- Proper testing is non-negotiable

### **3. Confidence Bias**
- AI sounds confident when incorrect
- May misunderstand requirements
- Introduces hidden security issues
- Never blindly accept solutions

---

## Four Reasons AI-Generated Code Breaks

### **1. Float Context** (Missing Domain Knowledge)
**What:** Agent lacks exact database schema, API contracts, or business rules

**Example:** Agent creates `amount` field but code uses `amount_cents`

**Result:** Code looks reasonable but fails at runtime

**Prevention:** Provide exact field names, API contracts, and schema documentation

### **2. Dependency Problems**
**What:** Agent imports package not installed, uses old function, or picks incompatible version

**Examples:**
- Missing npm package
- Deprecated function call
- Version mismatch

**Result:** Build error or runtime failure

**Prevention:** Lock dependencies, specify versions clearly

### **3. Shallow Validation**
**What:** Agent handles normal case but forgets edge cases

**Examples:**
- What if value is missing?
- What if user enters negative number?
- What if text entered where number expected?

**Result:** Crashes on unusual inputs

**Prevention:** Specify edge cases explicitly

### **4. Regression**
**What:** Fixing one problem accidentally breaks another feature

**Example:** Changing shared payment logic fixes donations but breaks receipts

**Result:** Hidden logic errors; program runs but produces wrong results

**Prevention:** Test related features after changes

---

## Audit Framework: Code Review Checklist

### **Step 1: Scope Verification**
```bash
git status      # What files changed?
git diff        # Exactly what changed in each file?
```
✓ Did agent change only requested files?  
✓ Why were unrelated files modified?

### **Step 2: Credential Exposure**
❌ Look for:
- API keys
- Tokens
- Passwords
- Private values

**Critical:** Secrets exposed in repos require rotating credentials, not just deleting lines

### **Step 3: Network & Error Paths**
- What happens on timeout?
- What if server returns error?
- Does app show helpful message or freeze?

### **Step 4: Avoid Blind Merging**
- Don't accept just because AI sounds confident
- Ask for explanation
- Inspect actual code
- Test before merging

---

## Understanding Error Types

### **Syntax Error**
- Code violates language rules
- Missing bracket, invalid import
- **Detected:** Build tools catch before execution
- **Example:** `import { func from "module"` (missing closing brace)

### **Runtime Error**
- Appears while program runs
- Attempts invalid operation
- **Example:** Reading property from undefined: `amount.cents` when `amount = undefined`
- **Symptom:** Program crashes

### **Logical Error**
- Program runs, answer is wrong
- **Most Dangerous:** No crash, silent failure
- **Example:** $25 treated as 25 cents (not 2,500 cents)
- **Detection:** Only through testing

---

## Providing High-Signal Context

### **❌ Vague Prompt:**
"Donation pays checkout failed. Fix it."
- No reproduction steps
- No error message
- No context
- Result: AI guesses, makes unnecessary changes

### **✅ Structured Prompt:**
```
When I enter amount: -50
Click: Donate button
Expected: Error message below button
Actual: Browser stays silent, but server returns 400 error
Error message: "Invalid amount"
File to fix: donations.js
Root issue: Error not displayed to user
```
- Specific reproduction steps
- File locations
- Expected vs. actual
- Server response details
- Result: AI understands exactly what's wrong

---

## The Endless Loop Problem

### **Phase 1: Speculative Patching**
- Agent tries fix without understanding root cause
- Makes assumptions
- Applies quick workaround

### **Phase 2: Error Compounding**
- First fix creates new error
- Agent tries fixing that
- Adds more code
- Project becomes messier

### **Phase 3: Total Drift**
- Original problem still unsolved
- Codebase is now worse
- Hundreds of lines of unnecessary code

### **The Stop Rule:**
> **If agent repeatedly fails on same issue, don't ask again. STOP. Investigate and reconsider approach.**

**Better Prompt:**
```
"Last change modified these two files and caused these tests to fail.
Inspect these functions, explain the cause, propose smallest change.
Don't edit unrelated files."
```

---

## Safety Nets: Three Essential Habits

### **Habit 1: Atomic Checkpoints**
```bash
git commit          # Save known good state before risky change
git status          # Verify working tree is clean
# Then: Try AI-generated change
git diff            # Review before committing again
```
- Provides recovery point
- Doesn't prove code is perfect
- Gives clear place to return to

### **Habit 2: Inspect the Diff**
```bash
git diff            # Line-by-line review
```
Key Questions:
- Related to task?
- Changed validation?
- Modified function signature?
- Added new dependency?
- **More reliable than summary**

### **Habit 3: Use Branches for Experiments**
```bash
git checkout -b feature/experiment
# Try AI changes
git diff main..feature/experiment
# If good: merge
# If bad: abandon without affecting main
```

---

## Git Recovery Commands (Use With Care!)

### **git restore**
- Discards uncommitted changes in tracked files
- **Warning:** May permanently remove work
- **Before using:** `git status` to verify

### **git reset --hard**
- Reverts working tree to chosen commit
- **Very destructive:** Removes all uncommitted changes
- **Must know exact commit** to return to

### **git clean**
- Removes untracked files and directories
- **Danger:** May delete work you care about
- **Process:** Always `git status` first

**Golden Rule:** `git status` → Review → Understand what will be removed → Execute

---

## Regression Testing Framework

**Definition:** Change fixes one problem but breaks something else

**Example:**
- Fix: Donation form now submits
- Regression: Same change breaks receipt generation

**Three-Stage Test Process:**

### **Stage 1: Reproduce Bug Fix**
- Confirm specific original failure is gone
- Use exact reproduction steps from bug report

### **Stage 2: Test Related Features**
- Payment processing
- Billing receipts
- Error handling
- Other downstream systems

### **Stage 3: Add Regression Test**
- Write test that fails if problem returns
- Prevents same bug in future

---

## Technical Debt Management

**Definition:** Code works now but becomes hard to change/maintain later

### **Strategy 1: Eliminate Duplication**
❌ Repeated logic in multiple places  
✓ Extract to shared utility function

### **Strategy 2: Clear Naming**
❌ `temp`, `data`, `rest`  
✓ `userProfile`, `paymentAmount`, `receiptStatus`

### **Strategy 3: Preserve External APIs**
- Don't change function signatures unexpectedly
- Maintain data contracts
- Refactor internal implementation, not interface

---

## Real-World Case Study: Donation Page Bug

### **The Problem**
User clicks "Donate" with $25  
Button stuck in loading  
Payment never completes  

### **The Errors Found**
1. **Missing Currency Payload**
   - Frontend sends only amount
   - Stripe requires currency field
   - Result: HTTP 500 error

2. **Hardcoded Secret**
   - Stripe API key in client-side HTML
   - Security risk: exposed in browser
   - Should be server-side only

3. **Uncaught Rejections**
   - Payment gateway declines transaction
   - Application doesn't handle error
   - User sees no feedback

### **Root Cause Analysis**
Single failure involved:
- Functional error (missing field)
- Security vulnerability (exposed key)
- Poor error handling (silent failure)

**Lesson:** Debug fully, don't just make error disappear

---

## Writing Effective Bug Reports

### **1. Clear Title & Severity**
```
"Donation form hangs on submit when checkout returns 500 error"
```
- States user experience
- Avoids unverified cause in title

### **2. Exact Reproduction Steps**
- Which page?
- What amount to enter?
- Which button to click?
- Any special conditions?

### **3. Expected vs. Actual**
**Expected:** Donation processed OR clear failure message  
**Actual:** Button keeps loading indefinitely

### **4. Evidence**
- Test name that passed after fix
- Commit reference with change
- **Don't include:** API keys, tokens, private data

---

## Seven-Step Debugging Pipeline

**Order matters:**

### **Step 1: REPRODUCE**
Make failure happen in controlled way  
If can't reproduce → need more info

### **Step 2: COLLECT**
Save error message, stack trace, test output  
Remove secrets before sharing

### **Step 3: AUDIT**
Read source code, understand surrounding logic  
Error is clue, but need full context

### **Step 4: PROMPT**
Give agent narrow task with evidence  
Expected behavior, don't-change list

### **Step 5: REVIEW**
Inspect diff line by line  
Confirm intended changes, no unrelated edits

### **Step 6: TEST**
Rerun test that exposed bug  
Run regression tests for related features

### **Step 7: COMMIT**
Once reviewed and tested  
Create known good checkpoint

---

## Three Key Lessons

### **1. Audit Every Line**
- Code looks convincing but check: scope, security, logic
- Never accept just because AI sounds confident

### **2. Provide Evidence**
- Logs, reproduction steps, file locations
- Exact behavior descriptions
- Prevents guessing

### **3. Test & Recover**
- Use git checkpoints
- Inspect diffs
- Run regression tests
- If repeated fixes fail: **STOP and reconsider**

---

## The Big Picture

> AI can accelerate coding, but discipline in debugging makes results reliable.

**Goal:** Not to avoid AI tools, but to use them thoughtfully while keeping responsibility and control in human hands.

---

## Quiz Answers

**Q1:** If exposed secret, what to do?  
**A:** Remove, store securely on server, rotate compromised credential  
*(Deletion alone is insufficient; key may be cached or accessed)*

**Q2:** Agent keeps failing on same bug. What to do?  
**A:** Stop and investigate. Don't ask agent to try again.  
*(Use Stop Rule)*

**Q3:** Before asking AI to fix regression, first step?  
**A:** Reproduce bug deterministically and collect clean specific logs.  
*(Replaces guessing with evidence)*

**Q4:** Testing after bug fix, what to confirm?  
**A:** Fix original bug + related features don't break  
*(Regression testing matters)*

---

## References & Further Reading

- Git documentation: safe recovery practices
- Testing frameworks for your language
- Security best practices (OWASP)
- Code review guidelines

---

**Session Ending:** "Debugging isn't just making the error disappear. It's understanding why it happened, finding root cause, and ensuring the same problem doesn't happen again." — Shakila

