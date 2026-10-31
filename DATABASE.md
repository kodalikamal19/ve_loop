# 🗄️ VELoop Rewards — Database Schema & Data Architecture

This document describes the MongoDB database schemas, relationships, data integrity rules, and indexing strategy for the VELoop Rewards system.

---

## 1. Entity-Relationship Overview

```
 [User] 1 ────── 1 [Wallet]
   │
   ├────── N [WalletTransaction] (Ledger audit trail)
   ├────── N [Withdrawal] (Payout requests with status history)
   ├────── N [Referral] (Referrer 1 -> N Referred relationships)
   ├────── N [UserAchievement] (Achievement unlock status)
   └────── N [ActivityLog] (User activity feed)

 [LevelConfiguration] (Platform tier definitions & XP thresholds)
 [Achievement] (Badge definitions, target metrics & unlock criteria)
 [AdminAuditLog] (Immutable security audit log for admin operations)
```

---

## 2. Models & Field Specifications

### 2.1 User (`User.js`)
Stores identity, credentials, referral linkages, and account state.
- `userId` (String, unique, indexed): Unique platform ID (e.g., `VLRUSR202600123`).
- `name` (String, required): Legal/account name.
- `displayName` (String): Publicly visible display name.
- `email` (String, unique, indexed, lowercase): Account email.
- `password` (String, select: false): Bcrypt salted hash (salt rounds: 10).
- `role` (String, enum: `['user', 'admin', 'superadmin']`, indexed).
- `profileImage` (String): URL reference to avatar picture.
- `bio` (String): User self-description or motto.
- `referralCode` (String, unique, indexed): Shareable code (e.g. `VELOOP123`).
- `accountStatus` (String, enum: `['ACTIVE', 'SUSPENDED', 'UNDER_REVIEW']`, indexed).
- `statusReason` (String): Administrative note explaining restriction.
- `isEmailVerified` (Boolean, default: true).
- `createdAt` / `updatedAt` (Date).

### 2.2 Wallet (`Wallet.js`)
Manages multi-asset balances and withdrawal reserve locks.
- `userId` (ObjectId, ref: `User`, unique, indexed).
- `balances`:
  - `ves` (Number, default: 0, min: 0): Spendable points.
  - `sves` (Number, default: 0, min: 0): Silver conversion points.
  - `gems` (Number, default: 0, min: 0): Crystal currency.
  - `tokens` (Number, default: 0, min: 0): Engagement tokens.
  - `xp` (Number, default: 0, min: 0): Progression experience.
- `reservedBalances`:
  - `ves` (Number, default: 0): Locked VEs currently pending payout.
- `createdAt` / `updatedAt` (Date).

### 2.3 WalletTransaction (`WalletTransaction.js`)
Auditable financial ledger tracking all balance movements.
- `userId` (ObjectId, ref: `User`, indexed).
- `transactionId` (String, unique, indexed): Formatted ID (e.g. `TXN-17934...`).
- `type` (String, enum: `credit`, `debit`, `reward`, `conversion`, `redemption`, `admin_adjustment`, `refund`).
- `asset` (String, enum: `ves`, `sves`, `gems`, `tokens`, `xp`).
- `amount` (Number, required).
- `previousBalance` (Number, required).
- `newBalance` (Number, required).
- `reason` (String, required).
- `referenceId` (String): Related withdrawalId or activityId.
- `status` (String, enum: `completed`, `pending`, `reversed`, `failed`).
- `performedBy` (ObjectId, ref: `User`): Administrator ID if manual adjustment.

### 2.4 LevelConfiguration (`LevelConfiguration.js`)
Admin-configurable progression tiers.
- `level` (Number, unique, indexed): 1, 2, 3, 4, 5.
- `name` (String): E.g. "Reward Explorer", "Diamond Master".
- `xpThreshold` (Number): Minimum XP required for tier.
- `badgeIcon` (String): Lucide icon identifier.
- `badgeColor` (String): Hex color code.
- `benefits` ([String]): Perk descriptions.
- `bonusMultiplier` (Number).
- `isActive` (Boolean).

### 2.5 Withdrawal (`Withdrawal.js`)
Manages payout lifecycle with full status transition history.
- `userId` (ObjectId, ref: `User`, indexed).
- `withdrawalId` (String, unique, indexed): E.g. `WDR-2026-901`.
- `amount` (Number): VEs requested (min 200).
- `fiatEquivalent` (Number): INR cash amount (2 VEs = ₹1).
- `payoutMethod` (String, enum: `UPI`, `Bank Transfer`, `Amazon Gift Card`).
- `payoutDetails` (Object: `upiId`, `accountNumber`, `ifscCode`, `accountHolderName`, `giftCardEmail`).
- `status` (String, enum: `pending`, `approved`, `rejected`, `completed`, indexed).
- `rejectionReason` (String): Populated if rejected; refunds balance.
- `statusHistory`: Array of `{ status, note, changedBy, timestamp }`.

### 2.6 AdminAuditLog (`AdminAuditLog.js`)
Immutable audit record for regulatory and security compliance.
- `adminId` (ObjectId, ref: `User`, indexed).
- `adminEmail` (String).
- `action` (String, enum: `ADMIN_LOGIN`, `WALLET_ADJUSTMENT`, `ACCOUNT_RESTRICTION`, `WITHDRAWAL_STATUS_CHANGE`, etc., indexed).
- `targetModel` (String).
- `targetIdentifier` (String).
- `summary` (String).
- `changes` (Object: `{ before, after }`).
- `reason` (String).
- `ipAddress` (String).

---

## 3. Database Indexes

| Collection | Indexed Fields | Purpose |
| :--- | :--- | :--- |
| `users` | `userId` (unique), `email` (unique), `referralCode` (unique), `accountStatus`, `role` | Fast lookups and uniqueness constraints |
| `wallets` | `userId` (unique) | 1-to-1 link to user |
| `wallettransactions` | `userId`, `transactionId` (unique), `asset`, `type`, `createdAt` | Ledger queries and fast balance auditing |
| `withdrawals` | `userId`, `withdrawalId` (unique), `status`, `createdAt` | Fast aggregation and admin filtering |
| `userachievements` | `{ userId: 1, achievementId: 1 }` (compound unique) | Prevent duplicate achievement unlocks |
| `adminauditlogs` | `adminId`, `action`, `createdAt` | High-performance audit trail filtering |
