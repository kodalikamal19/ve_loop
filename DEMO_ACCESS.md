# 🔑 VELoop Rewards — Demo Access & Credentials Guide

This document contains evaluation credentials and environment instructions for reviewers and evaluators of the **VELoop Rewards — Task 14 Full-Stack User Profile & Admin Management System**.

---

## 1. Demo Administrator Credentials

The admin authentication portal includes a pre-configured **Demo Credentials Panel** with 1-click autofill and copy controls.

| Field | Value |
| :--- | :--- |
| **Admin Portal URL** | `http://localhost:5173/admin/login` (or `<Live-Frontend-URL>/admin/login`) |
| **Demo Admin Email** | `demo-admin@veloop.io` |
| **Demo Admin Password** | `AdminDemo@2026` |
| **Assigned Role** | `superadmin` |
| **Privileges** | Full operational control, ledger balance adjustments, account status restrictions, withdrawal approvals, level configuration, and immutable security audit logs. |

---

## 2. Demo User Credentials

The user application provides a ready-to-test seeded member account representing the primary profile command center.

| Field | Value |
| :--- | :--- |
| **User Sign-In URL** | `http://localhost:5173/login` (or `<Live-Frontend-URL>/login`) |
| **Demo User Email** | `demo-user@veloop.io` |
| **Demo User Password** | `UserDemo@2026` |
| **User Identifier** | `VLRUSR202600123` |
| **Display Name** | Alex Mercer |
| **Referral Code** | `VELOOP123` |
| **Account Health** | `ACTIVE` (Verified) |
| **Initial Balances** | 3,850 VEs, 1,240 SVEs, 240 Gems, 5,000 Tokens, 6,420 XP (Level 04 — Reward Explorer) |

---

## 3. How to Reset the Demo Environment

If demo data has been altered during testing and you want to restore the clean initial state:

### Option A: Using the CLI Seeder
Run this command from the repository root:
```bash
npm run seed
```
Or inside the `backend` directory:
```bash
cd backend
npm run seed
```

This will clear existing collections and re-populate:
- 5 Level tier configurations
- 6 Gamified achievements with badges
- Super Administrator (`demo-admin@veloop.io`)
- Demo User (`demo-user@veloop.io`)
- Secondary referral network members
- Complete ledger history, withdrawal records, and audit logs.

---

## 4. Live Deployment URLs (Fill After Deploying)

- **Live Frontend URL:** `https://veloop-rewards.vercel.app`
- **Live Backend API URL:** `https://veloop-backend.onrender.com`
- **GitHub Repository URL:** `https://github.com/<your-username>/veloop-rewards`
