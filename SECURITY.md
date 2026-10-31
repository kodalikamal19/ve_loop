# 🛡️ VELoop Rewards — Security Architecture & Data Integrity

This document outlines the security architecture, safeguards against unauthorized modifications, and compliance with Part F of the assignment.

---

## 1. Zero Trust in Frontend State (Section 27 & 51)

The backend is the sole authoritative source of truth for:
- Wallet balances (`ves`, `sves`, `gems`, `tokens`, `xp`)
- Account status (`ACTIVE`, `SUSPENDED`, `UNDER_REVIEW`)
- User tier rank and level progression
- Achievement unlock status
- Referral statistics and rewards
- Withdrawal records and approvals

### Evaluator Attack Scenarios Tested:
1. **Modifying Balance in React DevTools**:
   - If an attacker opens browser DevTools and changes the React state or DOM text from `3,850 VEs` to `999,999 VEs`, the display might change locally in their browser, but **any transaction, withdrawal, or API call ignores client-sent balance values**.
   - When redeeming a withdrawal, the server checks the real database balance in `Wallet.findOne({ userId })`. If the database balance is insufficient, the request is rejected with `400 Bad Request`.
2. **Submitting Fake XP or Level directly**:
   - There is no endpoint accepting client-submitted XP or levels. XP is exclusively credited through authorized server actions (`daily-bonus`, `watch-ad`, `convert-sves`, `adjust-balance`). Level thresholds are calculated server-side.
3. **Impersonating Another User via `userId` Parameter**:
   - The server derives user identity strictly from the verified JWT payload (`req.user = decoded.id`). A client cannot send `{ "userId": "another-user" }` to access or modify other users' records.
4. **Calling Admin APIs Without Super Admin Privileges**:
   - The `requireAdmin` middleware checks `req.user.role === 'admin' || req.user.role === 'superadmin'`. If an ordinary user attempts to call `/api/admin/*`, the server immediately returns `403 Forbidden`.

---

## 2. Authentication & Session Management

- **Password Hashing**: Passwords are never stored in plaintext. They are hashed using `bcryptjs` with 10 salt rounds.
- **JWT Protection**: Sessions use JSON Web Tokens signed with a secret environment key (`JWT_SECRET`).
- **Sanitized Responses**: Password hashes are defined with `select: false` on the Mongoose schema and are never exposed in user responses.

---

## 3. Account Restrictions & Enforcement

- When an administrator sets an account status to `SUSPENDED`, the `authenticateUser` middleware immediately blocks all further API requests with `403 Forbidden: Account is suspended: <reason>`.
- The frontend logs the user out and displays the exact administrative restriction reason.

---

## 4. Auditable Wallet Operations (Section 34)

- The backend forbids any administrative operation that overwrites wallet balances without a trace.
- When an administrator modifies a user's balance:
  1. A `WalletTransaction` is created capturing `userId`, `asset`, `amount`, `previousBalance`, `newBalance`, `reason`, `performedBy`, and `status`.
  2. An `AdminAuditLog` is created recording the `adminId`, `adminEmail`, `action: 'WALLET_ADJUSTMENT'`, `summary`, `changes` (before/after snapshot), and mandatory administrative `reason`.

---

## 5. Network & Rate Limiting Safeguards

- **Helmet**: Secures HTTP response headers against clickjacking, MIME sniffing, and cross-site scripting.
- **CORS Restriction**: Only allows explicitly whitelisted client origins or development environments.
- **Rate Limiting**: Protects authentication endpoints (`/api/auth/login`, `/api/admin/login`) with `authRateLimiter` allowing maximum 30 attempts per 15 minutes, neutralizing brute-force dictionary attacks.
