# 💼 VELoop Rewards — Administrator Operations Guide

This operational manual describes how administrators and evaluators can manage users, oversee the reward assets reserve pool, authorize withdrawals, and perform auditable wallet adjustments.

---

## 1. Accessing the Admin Console

1. Navigate to: `http://localhost:5173/admin/login` (or `/admin/login` on the live deployment).
2. The login screen features a **Demo Admin Access** panel.
3. Click **"Autofill Demo Admin Credentials"** to automatically populate:
   - Email: `demo-admin@veloop.io`
   - Password: `AdminDemo@2026`
4. Click **"Authenticate as Admin"** to access the dashboard.

---

## 2. Dashboard Monitoring (`/admin/dashboard`)

The dashboard displays live real-time platform metrics aggregated directly from the MongoDB collections:
- **Total Users**: Counts registered users, breaking down active vs suspended accounts.
- **Total VEs Circulating**: Total outstanding liability in VEs with calculated INR equivalent.
- **Pending Payouts**: Number of redemption requests waiting for administrative review.
- **Total Paid Out**: Total INR disbursed to users for completed withdrawals.
- **Asset Reserve Pool**: Live balances of VEs, SVEs, Gems, Tokens, and Total XP across all users.
- **Recent Administrative Operations**: Chronological activity feed showing recent admin actions and audit summaries.

---

## 3. User Management (`/admin/users`)

### 3.1 Searching & Filtering Users
- Enter any query into the search bar: name, email, referral code, or User ID (e.g., `VLRUSR...`).
- Filter by status: `ACTIVE`, `SUSPENDED`, or `UNDER_REVIEW`.

### 3.2 Inspecting a User Profile
1. Click the **"View"** button next to any user.
2. The modal displays:
   - Complete contact and identity records
   - Verified account health status
   - Live wallet balances (VEs, SVEs, Gems, Tokens, XP)
   - Recent ledger transactions for this specific user.

### 3.3 Adjusting Wallet Balances (Auditable Ledger Operation)
1. Click the **"Adjust"** button next to a user.
2. Select the asset type (`VEs`, `SVEs`, `Gems`, `Tokens`, or `XP`).
3. Choose Action: `Credit (+ Add)` or `Debit (- Deduct)`.
4. Enter the numeric amount.
5. Enter a **Mandatory Audit Reason** (minimum 4 characters) explaining the adjustment.
6. Click **"Execute Ledger Adjustment"**.
7. The system:
   - Updates the user's wallet
   - Creates a new `WalletTransaction` with previous and new balances
   - Writes an immutable record to `AdminAuditLog`.

### 3.4 Restricting or Restoring an Account
1. Click the **"Suspend"** or **"Restore"** button.
2. Select the target status (`ACTIVE`, `SUSPENDED`, or `UNDER_REVIEW`).
3. Enter the mandatory administrative reason.
4. Click **"Confirm Status Change"**.
5. If suspended, the user is immediately barred from invoking profile or rewards APIs.

---

## 4. Withdrawal Request Management (`/admin/withdrawals`)

1. Navigate to **"Withdrawal Requests"** from the sub-menu.
2. Filter requests by status: `pending`, `approved`, `completed`, or `rejected`.
3. To **Approve**: Click **"Approve"** to mark the payout ready for dispatch.
4. To **Complete**: Click **"Complete"** to permanently finalize the payout and deduct the reserved VEs from the user's ledger.
5. To **Reject & Refund**:
   - Click **"Reject"**.
   - Enter a mandatory rejection reason (e.g., `Invalid UPI ID provided`).
   - Click **"Confirm Rejection & Refund"**.
   - The system automatically refunds the reserved VEs back to the user's available wallet balance.

---

## 5. Security & Audit Logs (`/admin/audit-logs`)

1. Click **"Security Audit Logs"** in the top navigation.
2. Filter events by action type:
   - `ADMIN_LOGIN`
   - `WALLET_ADJUSTMENT`
   - `ACCOUNT_RESTRICTION`
   - `WITHDRAWAL_STATUS_CHANGE`
   - `LEVEL_CONFIG_UPDATE`
3. Inspect the acting admin email, timestamp, affected record identifier, change summary, and documented reason.
