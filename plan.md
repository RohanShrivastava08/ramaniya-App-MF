# 🛡️ Ramaniya Platform Security & Hardening Plan

This document outlines the systematic security audit and implementation roadmap for the Ramaniya application to ensure robust, enterprise-grade safety across the frontend layer.

## Phase 1: Route Protection & Workflow Enforcement
**Vulnerability:** Currently, the `ProtectedRoute` in `App.jsx` only verifies if `ramaniya_user` exists. A user could manually type `/invest/live1` into the URL bar and completely bypass the PAN Verification and Video KYC processes.
**Resolution:**
- Implement a rigid `KycProtectedRoute` wrapper.
- Intercept any navigation to `/funds`, `/dashboard`, or `/invest/:id` and strictly check the `ramaniya_kyc` local memory state.
- Force redirect violators back to `/onboarding`.

## Phase 2: Local Storage Obfuscation & Integrity
**Vulnerability:** All session data (`ramaniya_user`, `ramaniya_investments`) is stored in plaintext JSON within the browser's `localStorage`. Malicious actors or users can open DevTools and alter their investment values artificially.
**Resolution:**
- Build a secure storage wrapper utility (`frontend/src/lib/secureStore.js`).
- Base64 encode (`btoa`/`atob`) or apply lightweight XOR obfuscation to all payloads before committing them to the storage engine.
- Inject integrity timestamps to prevent replay modifications.

## Phase 3: Financial Input Sanitization
**Vulnerability:** The Investment Flow (`InvestFlow.jsx`) relies on simple `Number(amount)` casting. This could accept negative numbers or infinite boundaries if aggressively attacked via UI inspection.
**Resolution:**
- Implement strict regex layers on the Razorpay mock terminal (forcing exactly 3 digit CVVs, 16 digit cards).
- Mathematically block any investment amount `< 100` or `> 10000000` via strict exception throwing.
- Validate `NaN` injections.

## Phase 4: API Failure & Sandbox Safety
**Vulnerability:** If Marketaux or MFAPI go down, the unhandled promise chains could expose application crash logs to the client.
**Resolution:**
- Wrap all external network fetches in robust `try/catch` enclosures.
- Purge any stray `console.log` statements exposing raw API mappings in production builds.

---
*Implementation of this plan guarantees a highly secure, logically fortified financial demo environment.*
