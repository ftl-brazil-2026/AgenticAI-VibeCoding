# Practical Debugging Lab - Fixing AI-Generated Code in Action

**📅 Date & Time:** November 24, 2026 at 15:44 (3:44 PM UTC)  
**👩‍🏫 Presenter:** Shakila Alam Aishy  
**🎯 Session Type:** Hands-On Lab - Live Debugging Exercise  
**⏱️ Duration:** 56 minutes 10 seconds

---

## Overview

Live debugging session where participants follow step-by-step as a donation page built by AI is debugged. The page "looks fine" but is broken. Working through realistic debugging workflow: reproduce → audit → understand → fix → test → commit.

---

## Setup Requirements

✓ Node.js v18+  
✓ VS Code  
✓ Git  
✓ AI assistant (ChatGPT, Claude, etc. — free tier acceptable)  
✓ No GPU or paid subscription required

---

## The Problem Scenario

**What:** Donation page built by AI  
**Issue:** Broken functionality  
**Task:** Find root cause, fix properly, write regression test

---

## Step 1: Initial Assessment

### **Clone Repository**
```bash
git clone [repo-url]
cd lab-folder
```

### **Check Existing Tests**
```bash
npm test
```

**Result:**
- 3 tests PASSING
- 4 tests MARKED AS TODO (incomplete/not implemented)

**Insight:** Failing tests indicate missing implementation

---

## Step 2: Reproduce the Bug

### **Start Development Server**
```bash
npm start
```

### **Test User Flow**
1. Open browser to localhost
2. Enter donation amount: **-50** (negative value)
3. Click "Donate" button

### **Observe:**
- **Browser:** No error message, button appears inactive
- **Server logs:** Error detected and rejected

### **Finding:** Server works correctly but frontend doesn't communicate the error to user

---

## Step 3: Code Audit

### **Files to Review:**
- `app.js` - Main application file
- `donations.js` - Donation handler

### **Four Audit Questions:**

**Q1: What does code do? Which services interact?**
- Handles donation submission
- Interacts with payment processor (Stripe)
- Communicates with server

**Q2: Sensitive data exposed?**
- API keys hardcoded in frontend ✓ (SECURITY ISSUE)
- API key printed to console ✓ (EXPOSES SECRET)
- Key sent in request headers ✓ (ACCESSIBLE VIA NETWORK)

**Q3: User feedback on errors?**
- Error checking exists (if conditions)
- **No else block for failures**
- Console-only error logging
- **User never sees message**

**Q4: Unnecessary duplication?**
- Fetch logic repeated in lines 22-37 AND 39-52
- Same logic copy-pasted
- **Should be reusable function**

---

## Security Findings

### **Issue 1: Hardcoded API Key** (Lines 2-line)
```javascript
// ❌ WRONG
const apiKey = "stripe_test_key_12345";
```
- Exposed in browser
- Visible in page source
- Accessible to anyone

### **Issue 2: API Key in Console** (Line 20)
```javascript
// ❌ WRONG
console.log(apiKey);
```
- Logs sensitive data
- Browser DevTools visible
- May appear in cloud logs

### **Issue 3: Key in Request Headers** (Lines 28, 43)
```javascript
// ❌ WRONG
headers: { "X-API-Key": apiKey }
```
- Network tab shows header values
- Observable by any user
- No special hacking skills needed

**Demonstration:**
```
1. Right-click → Inspect → Network tab
2. Enter amount
3. Click Donate
4. View POST request details
5. API key visible in request headers
```

### **Solution:**
Move API key to backend environment variables

```bash
# .env file (never committed)
API_KEY=stripe_test_key_12345
```

```javascript
// server.js (backend)
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY missing from .env");
}
```

---

## Step 4: Analyze Network Traffic

### **Using Browser DevTools**

```bash
1. Open browser DevTools (F12)
2. Go to Network tab
3. Enter donation amount: -15
4. Click "Donate"
5. Watch the POST request
```

### **What We See:**
- Request endpoint: `/api/charge`
- Response status: **400** (bad request)
- Response body: `{ "error": "Invalid amount" }`

### **Key Insight:**
Server is working correctly and rejecting invalid amounts. Frontend is ignoring the error message.

---

## Step 5: Weak vs. Strong Prompts

### **Weak Prompt to AI:**
```
"My donation page doesn't work. Fix it."
```
- Insufficient information
- AI must guess
- Likely makes unnecessary changes

### **Strong Prompt to AI:**
```
When I enter amount: -50
Click: Donate
Expected: Error message appears below button
Actual: Nothing happens (silent failure)

Error in Network tab:
POST /api/charge returns 400: "Invalid amount"

File: donations.js
Issue: Error response not displayed to user
```

**Key Elements:**
- Exact reproduction steps
- Input values
- Expected vs. actual
- Network evidence
- Specific file location
- Root cause identified

---

## Step 6: Code Issues Found

### **Issue 1: Missing Validation** (Line 14)
```javascript
// ❌ Checks only if empty, not if negative/zero
if (!amount)
```
**Fix:** Validate range
```javascript
// ✓ Proper validation
if (!amount || amount <= 0 || !currency) {
  showError("Invalid amount");
}
```

### **Issue 2: No Error Display** (Lines 31-37, 46-52)
```javascript
// ❌ Error only logged to console
if (!response.ok) {
  console.log(error);  // User never sees this
}
```
**Fix:** Show user message
```javascript
// ✓ Display to user
if (!response.ok) {
  document.getElementById("error-message").innerHTML = error.message;
}
```

### **Issue 3: Code Duplication** (Lines 22-37 vs 39-52)
- Same fetch logic repeated
- Should be single reusable function

---

## Step 7: Git Recovery & Rollback

### **If Accidentally Accepting Wrong Changes**

```bash
# Check current state
git status

# If changes not committed yet:
git restore <filename>  # Discard uncommitted changes

# If completely lost:
git reset --hard HEAD   # Return to last commit
```

---

## Step 8: Secure API Key Management

### **Create .env File** (Never committed)
```bash
API_KEY=stripe_test_key_12345
```

### **Add to .gitignore**
```bash
echo ".env" >> .gitignore
```

### **Update server.js**
```javascript
// Load from environment
const apiKey = process.env.API_KEY;

if (!apiKey) {
  throw new Error("API_KEY missing from .env file");
}

// Use it safely on server side only
```

**Result:** API key never exposed in frontend or git history

---

## Step 9: Git Workflow for Changes

### **Stage Changes**
```bash
git add <filename>
```

### **Commit with Meaningful Message**
```bash
git commit -m "Fix: Handle donation form errors properly

- Add input validation for negative/zero amounts
- Display error messages to user
- Remove hardcoded API key from frontend
- Move API key to backend environment
- Fix duplicate fetch logic"
```

### **Push to Repository** (if desired)
```bash
git push origin main
```

---

## Step 10: Testing & Validation

### **Rerun Tests**
```bash
npm test
```
- Verify previously passing tests still pass
- Check if new test cases pass

### **Manual Testing**
1. Test with valid amount
2. Test with negative amount
3. Test with zero amount
4. Test with missing amount
5. Verify error messages display correctly

---

## Complete Debugging Checklist

✓ **Reproduce:** Enter -50, click button, observe silent failure  
✓ **Collect:** Check Network tab, see 400 error response  
✓ **Audit:** Read app.js and donations.js carefully  
✓ **Identify Issues:**
  - Hardcoded API key (security)
  - Missing input validation
  - No error display
  - Duplicate code
✓ **Prompt AI:** Provide full context with network evidence  
✓ **Review:** Check diff, verify changes make sense  
✓ **Test:** Manual testing + regression tests  
✓ **Commit:** Push clean, well-documented changes  

---

## Key Lessons from Lab

### **1. Silent Failures Are Dangerous**
- Server error ≠ User feedback
- Must explicitly show messages
- Test edge cases (negative, zero, missing)

### **2. Security Issues Hide in Plain Sight**
- Hardcoded keys look "normal"
- Takes only seconds to expose
- .env files are essential

### **3. Code Quality Matters**
- Duplicate logic causes maintenance burden
- Clear validation prevents crashes
- Proper error handling improves UX

### **4. Debugging Process is Systematic**
- Reproduce first
- Collect evidence
- Understand root cause
- Fix properly (not patches)
- Test thoroughly

### **5. Version Control is Safety Net**
- Always have checkpoints
- Review changes before committing
- Clear history shows what changed and why

---

## Three Essential Commands

```bash
git status      # Always check first
git diff        # Review before committing
git log         # Understand history
```

---

## Summary

This lab demonstrated:
1. How to find bugs systematically
2. Why security matters during development
3. How to communicate problems to AI effectively
4. Proper workflow from reproduction to fix to test
5. Git as a safety mechanism

**Most Important:** Debugging isn't about making errors disappear—it's about understanding why they happened and preventing them in the future.

---

**Next Steps:** Apply these debugging techniques to your own projects. Start with systematic reproduction, provide full context to AI, test thoroughly, and always review before committing.

