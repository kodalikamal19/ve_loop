# 📡 VELoop Rewards — API Documentation

This specification details all REST endpoints for the VELoop Rewards Profile & Admin Management backend. All responses return formatted JSON.

---

## 1. Authentication & Security Headers

All protected endpoints require a JWT Bearer token in the `Authorization` header:
```http
Authorization: Bearer <jwt-token>
```
Tokens are issued upon successful authentication at `/api/auth/login` or `/api/admin/login` and expire after:
- User token: 7 days
- Admin token: 24 hours

---

## 2. User Profile APIs (Section 23 & 24)

### `GET /api/profile/me`
Fetches complete user profile aggregate including live verified wallet balances, gamified tier level, withdrawal overview, referral snapshot, and achievement count.

**Response `200 OK`**:
```json
{
  "success": true,
  "profile": {
    "userId": "VLRUSR202600123",
    "displayName": "Alex Mercer",
    "name": "Alex Mercer",
    "email": "demo-user@veloop.io",
    "referralCode": "VELOOP123",
    "accountStatus": "ACTIVE",
    "isEmailVerified": true,
    "bio": "Earning daily rewards and climbing the VELoop ranks!",
    "memberSince": "2026-10-15T00:00:00.000Z"
  },
  "rewards": {
    "ves": 3850,
    "sves": 1240,
    "gems": 240,
    "tokens": 5000,
    "xp": 6420,
    "reservedVes": 400
  },
  "levelProgress": {
    "currentLevel": 4,
    "currentLevelName": "Reward Explorer",
    "nextLevel": 5,
    "nextLevelName": "Diamond Master",
    "currentXp": 6420,
    "nextLevelXp": 10000,
    "xpRemaining": 3580,
    "progressPercent": 11,
    "badgeIcon": "Crown",
    "badgeColor": "#8b5cf6"
  },
  "withdrawalsSummary": {
    "totalRequests": 3,
    "pending": 1,
    "approved": 0,
    "rejected": 0,
    "totalWithdrawn": 2450
  },
  "referralsSummary": {
    "referralCode": "VELOOP123",
    "total": 2,
    "successful": 2,
    "pending": 0,
    "rewardsEarned": 500,
    "referralXp": 1000
  }
}
```

---

### `PATCH /api/profile/me`
Updates permitted profile attributes. Only `displayName`, `bio`, and `profileImage` can be modified. Balances, level, XP, and status cannot be modified here.

**Request Body**:
```json
{
  "displayName": "Alex Mercer",
  "bio": "Aiming for Diamond Master tier!"
}
```

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Profile updated successfully.",
  "profile": { ... }
}
```

---

### `GET /api/profile/rewards`
Returns live wallet balances and reserved assets directly from the database ledger.

---

### `GET /api/profile/level-progress`
Calculates dynamic level standing based on stored XP against database-configured level thresholds.

---

### `GET /api/profile/achievements`
Returns the complete list of platform achievements with user unlock status, target metrics, progress, and unlocked timestamps.

---

### `GET /api/profile/withdrawal-summary`
Returns user-specific withdrawal totals: `totalRequests`, `pending`, `approved`, `rejected`, and `totalWithdrawn` (INR), along with the 10 most recent withdrawal requests.

---

### `GET /api/profile/referrals`
Returns referral statistics and list of referred accounts.

---

### `GET /api/profile/activity`
Returns persisted transaction history and activity logs.

---

## 3. User Quick Action APIs

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/actions/daily-bonus` | `POST` | Claim daily check-in bonus (+75 VEs, +15 Gems, +150 XP). Enforces 1 claim per day. |
| `/api/actions/watch-ad` | `POST` | Dispatches partner video rewards (+30 VEs, +5 Gems, +60 XP). |
| `/api/actions/convert-sves` | `POST` | Converts SVEs into VEs with a 1.2x boost and awards bonus XP. |
| `/api/actions/withdraw` | `POST` | Submits payout request (min 200 VEs). Instantly reserves balance in ledger. |

---

## 4. Admin Management APIs

All administrative endpoints require authentication with role `admin` or `superadmin`.

### `POST /api/admin/login`
Authenticates administrator credentials and logs `ADMIN_LOGIN` in audit log.

### `GET /api/admin/dashboard`
Returns live platform totals:
- Registered, active, and suspended users
- Total circulating balances by asset (VEs, SVEs, Gems, Tokens, XP)
- Withdrawal statistics (pending, approved, completed, rejected, total paid out)
- Referral counts
- Recent security audit logs

### `GET /api/admin/users`
Paginated user search with status filters (`ALL`, `ACTIVE`, `SUSPENDED`, `UNDER_REVIEW`).

### `GET /api/admin/users/:id`
Returns complete user profile, live wallet balances, transaction history, withdrawals, and user-specific admin audit records.

### `POST /api/admin/users/:id/adjust-balance`
Performs an auditable balance adjustment. Creates a `WalletTransaction` and records an immutable `AdminAuditLog`.

**Request Body**:
```json
{
  "asset": "ves",
  "type": "credit",
  "amount": 100,
  "reason": "Evaluation performance reward"
}
```

### `PATCH /api/admin/users/:id/status`
Suspends or restores user account access with a mandatory administrative reason.

### `GET /api/admin/withdrawals`
Lists withdrawal requests filterable by status (`pending`, `approved`, `completed`, `rejected`).

### `PATCH /api/admin/withdrawals/:id/status`
Transitions a withdrawal status:
- If `rejected`: automatically refunds the reserved balance back to available balance with rejection reason.
- If `completed`: permanently deducts the reserved balance.
- Records `WITHDRAWAL_STATUS_CHANGE` audit log.

### `GET /api/admin/audit-logs`
Returns the immutable system audit trail with filtering by action type.

---

## 5. HTTP Status Codes & Error Handling

| Code | Meaning | Behavior |
| :--- | :--- | :--- |
| `200 OK` | Success | Request fulfilled successfully. |
| `201 Created` | Created | Resource successfully created. |
| `400 Bad Request` | Validation Error | Missing parameters, invalid types, or rule failure. |
| `401 Unauthorized` | Invalid Session | Missing, invalid, or expired JWT token. |
| `403 Forbidden` | Access Denied | Suspended account or insufficient administrative role. |
| `404 Not Found` | Not Found | Requested resource does not exist. |
| `409 Conflict` | Duplicate Record | Email or user already exists. |
| `429 Too Many Requests` | Rate Limited | Exceeded rate limit (login rate limiter active). |
| `500 Server Error` | Server Failure | Centralized error handler captures and logs securely. |
