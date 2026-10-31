# 💎 VELoop Rewards — Full-Stack User Profile & Admin Management System

![Project Type](https://img.shields.io/badge/Project-Full--Stack%20MERN-blue?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite%20%2B%20Bootstrap-61DAFB?style=for-the-badge&logo=react)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=nodedotjs)
![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas%20%2F%20Mongoose-47A248?style=for-the-badge&logo=mongodb)
![Security](https://img.shields.io/badge/Security-JWT%20%2B%20Bcrypt%20%2B%20RateLimit-critical?style=for-the-badge)

A complete, production-grade **User Profile Command Center & Protected Admin Management System** for the **VELoop Rewards** platform, built to fulfill all specifications of **Task 14**.

---

## 🌟 Key Highlights & Features

### 👤 User Rewards Command Center (`/user-profile`)
- **Profile Hero Section**: Personalized header displaying user avatar / fallback initials, verified badge, member ID, email, account health status, and live tier progression widget.
- **Reward Assets (5 Distinct Cards)**:
  - **VEs (VELoop Points)**: Primary spendable rewards linked to payout redemption.
  - **SVEs (Silver Points)**: Pre-conversion bonus points exchangeable into VEs with a 1.2x boost.
  - **Gems**: Rare prestige crystals earned through milestone quests and check-in streaks.
  - **Tokens**: Activity tokens unlocked through sponsored ad views and challenges.
  - **XP (Experience Points)**: Non-spendable progression gauge determining tier status and benefits.
  - **Interactive Tooltips**: Concise explanations for every asset type.
- **Gamified Level System**: Level progress (Level 04 — Reward Explorer), dynamic progress percentage, XP remaining to next tier, and next-tier preview.
- **Achievements & Badges**: Interactive badge cards with category filters (All, Unlocked, Locked), target progression bars, unlock timestamps, and asset rewards.
- **Withdrawal Overview**: Summary metrics (Total Requests, Pending, Approved, Rejected, Total Withdrawn in ₹), along with a live transaction history table.
- **Interactive Quick Actions**:
  - Claim Daily Bonus (instant reward with confetti animation)
  - Watch Sponsored Video Ads (5-second player with verified rewards)
  - Convert SVEs to VEs (1.2x boost real-time calculator)
  - Redeem Payout (modal supporting UPI, Bank Transfer, and Amazon Gift Cards)
- **Referral Snapshot**: Shareable referral code with copy interaction, confirmation toasts, milestone progress bar, and invite statistics.
- **Persisted Recent Activity**: Real-time event feed with relative timestamps and status badges.
- **Theme Switcher**: Smooth toggle between **Light Theme** (clean, crisp, user-friendly fintech design) and **Dark Theme** (VELoop signature navy `#161827`).
- **Resilient States**: Complete branded skeleton loaders, empty states, and error retry handlers.

### 🛡️ Complete Protected Admin Management Panel (`/admin/*`)
- **Secure Authentication**: Role-based access control (`admin` / `superadmin`), bcrypt password hashing, and login rate limiting.
- **Demo Credentials Panel**: 1-click autofill for immediate evaluation per Section 30.
- **Live Real-Time Dashboard**: Platform-wide metrics calculated directly from database records (registered users, active vs suspended, total circulating VEs, liability, reserve pool).
- **User Management**: Search users by name/email/ID, inspect complete user profiles and ledger records, suspend/restore accounts with mandatory reason.
- **Auditable Balance Adjustments (Section 34)**: Admin balance credits/debits that write to both `WalletTransaction` and immutable `AdminAuditLog` with before/after snapshots.
- **Withdrawal Payout Authorizations**: Approve, reject (with automated refund of reserved balance to user), or complete payouts.
- **Immutable Security Audit Trail**: Complete log viewer tracking admin logins, balance changes, account restrictions, and status transitions.

---

## 🏗️ Technology Stack

| Component | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Bootstrap 5, CSS Modules (`.module.css`), Lucide React, React Icons, Axios, Canvas Confetti |
| **Backend** | Node.js, Express.js, Mongoose, JWT, Bcrypt.js, Helmet, Morgan, Express Rate Limit |
| **Database** | MongoDB (supports MongoDB Atlas and zero-config in-memory fallback for immediate local testing) |
| **Architecture** | Monorepo structure with decoupled `/frontend` and `/backend` APIs |

---

## 📂 Project Structure

```
ve_LOOP/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   ├── UserProfile/
│   │   │   │   ├── ProfileHero.jsx
│   │   │   │   ├── RewardAssets.jsx
│   │   │   │   ├── LevelProgress.jsx
│   │   │   │   ├── AchievementCard.jsx
│   │   │   │   ├── WithdrawalOverview.jsx
│   │   │   │   ├── QuickActions.jsx
│   │   │   │   ├── ReferralSnapshot.jsx
│   │   │   │   ├── RecentActivity.jsx
│   │   │   │   ├── AccountInformation.jsx
│   │   │   │   ├── EditProfileModal.jsx
│   │   │   │   ├── WithdrawalModal.jsx
│   │   │   │   ├── ConvertSvesModal.jsx
│   │   │   │   ├── WatchAdModal.jsx
│   │   │   │   ├── ProfileSkeleton.jsx
│   │   │   │   └── ProfileErrorState.jsx
│   │   │   └── Routes/
│   │   │       ├── ProtectedRoute.jsx
│   │   │       └── AdminRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── pages/
│   │   │   ├── UserProfile/
│   │   │   ├── Login/
│   │   │   └── Admin/
│   │   │       ├── AdminLogin.jsx
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminUsers.jsx
│   │   │       ├── AdminWithdrawals.jsx
│   │   │       └── AdminAuditLogs.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── index.css
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── profileController.js
│   │   │   ├── actionController.js
│   │   │   └── adminController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── rateLimiter.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Wallet.js
│   │   │   ├── WalletTransaction.js
│   │   │   ├── LevelConfiguration.js
│   │   │   ├── Achievement.js
│   │   │   ├── UserAchievement.js
│   │   │   ├── Withdrawal.js
│   │   │   ├── Referral.js
│   │   │   ├── ActivityLog.js
│   │   │   └── AdminAuditLog.js
│   │   ├── routes/
│   │   ├── services/
│   │   │   ├── walletService.js
│   │   │   └── gamificationService.js
│   │   └── utils/
│   │       └── seedData.js
│   └── server.js
├── docs/
│   ├── screenshots/
│   └── demo/
├── postman/
│   └── VELoop_Rewards.postman_collection.json
├── DEMO_ACCESS.md
├── API_DOCUMENTATION.md
├── DATABASE.md
├── SECURITY.md
├── ADMIN_GUIDE.md
├── TESTING.md
├── .env.example
├── .gitignore
└── package.json
```

---

## ⚡ Quick Start Guide (Local Setup)

### Prerequisites
- Node.js v18+ installed
- MongoDB installed locally OR a free MongoDB Atlas connection string (or use the built-in automatic zero-config fallback)

### Step 1: Clone and Install Dependencies
```bash
git clone <your-repository-url>
cd ve_LOOP

# Install all backend and frontend dependencies in one command
npm run install:all
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/veloop_rewards
JWT_SECRET=veloop_rewards_secret_jwt_key_super_secure_2026
ADMIN_SEED_EMAIL=demo-admin@veloop.io
ADMIN_SEED_PASSWORD=AdminDemo@2026
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### Step 3: Seed the Database
Populate the demo user, admin, level configurations, achievements, and ledger transactions:
```bash
npm run seed
```

### Step 4: Run the Application
In terminal 1 (start Backend):
```bash
npm run backend
```
*(Server listens on `http://localhost:5000`)*

In terminal 2 (start Frontend):
```bash
npm run frontend
```
*(Vite app opens at `http://localhost:5173`)*

---

## 🔑 Demo Access Credentials (Section 30)

| Account | Email | Password | Access Portal |
| :--- | :--- | :--- | :--- |
| **Demo User** | `demo-user@veloop.io` | `UserDemo@2026` | `http://localhost:5173/login` |
| **Demo Admin** | `demo-admin@veloop.io` | `AdminDemo@2026` | `http://localhost:5173/admin/login` |

*Both login pages feature 1-click **Autofill Demo Credentials** buttons for instantaneous reviewer evaluation.*

---

## 🚀 Step-by-Step Deployment Guide

Follow these simple steps to deploy your live full-stack system:

### 1. MongoDB Database (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. Create a free **M0 Sandbox Cluster**.
3. Under **Database Access**, create a user (e.g. `veloop_admin`) and secure password.
4. Under **Network Access**, add IP Address `0.0.0.0/0` (allow access from anywhere).
5. Click **Connect** → **Drivers** and copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/veloop_rewards?retryWrites=true&w=majority
   ```

### 2. Backend Deployment (Render / Railway)
1. Push your repository to GitHub (see GitHub instructions below).
2. Go to [Render Dashboard](https://dashboard.render.com/) → Click **New** → **Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `MONGO_URI` = `<your-mongodb-atlas-uri>`
   - `JWT_SECRET` = `super_secure_production_jwt_secret_key`
   - `CLIENT_ORIGIN` = `https://your-frontend.vercel.app` (your Vercel domain)
   - `NODE_ENV` = `production`
6. Click **Deploy Web Service**.
7. Copy your deployed backend URL (e.g., `https://veloop-backend.onrender.com`).

### 3. Frontend Deployment (Vercel)
1. Go to [Vercel](https://vercel.com/) and click **Add New** → **Project**.
2. Select your repository.
3. In Project Settings:
   - **Root Directory**: Click edit and select `frontend`.
   - **Framework Preset**: `Vite`.
4. Under **Environment Variables**:
   - Add `VITE_API_URL` = `https://your-backend.onrender.com/api` (your live Render backend URL).
5. Click **Deploy**.
6. Your live rewards platform is ready and connected to the live backend!

---

## 📤 Step-by-Step GitHub Push Guide

To push this codebase into your GitHub repository:

1. Open your terminal in this project root: `c:\Users\kodal\OneDrive\Desktop\PROJECTS\ve_LOOP`
2. Initialize git and configure the branch:
   ```bash
   git init
   git branch -M main
   ```
3. Stage all files (excluding files in `.gitignore`):
   ```bash
   git add .
   ```
4. Commit the implementation:
   ```bash
   git commit -m "feat: complete full-stack VELoop Rewards user profile and admin management system"
   ```
5. Create a new repository on your GitHub account (named e.g. `veloop-rewards`).
6. Add the remote URL and push:
   ```bash
   git remote add origin https://github.com/<your-username>/veloop-rewards.git
   git push -u origin main
   ```

---

## 📄 Submission Documentation Checklist

- [x] Complete `/user-profile` Command Center
- [x] Protected Admin Panel (`/admin/*`) with live MongoDB metrics
- [x] Auditable balance adjustment workflow with ledger integrity
- [x] [DEMO_ACCESS.md](file:///c:/Users/kodal/OneDrive/Desktop/PROJECTS/ve_LOOP/DEMO_ACCESS.md)
- [x] [API_DOCUMENTATION.md](file:///c:/Users/kodal/OneDrive/Desktop/PROJECTS/ve_LOOP/API_DOCUMENTATION.md)
- [x] [DATABASE.md](file:///c:/Users/kodal/OneDrive/Desktop/PROJECTS/ve_LOOP/DATABASE.md)
- [x] [SECURITY.md](file:///c:/Users/kodal/OneDrive/Desktop/PROJECTS/ve_LOOP/SECURITY.md)
- [x] [ADMIN_GUIDE.md](file:///c:/Users/kodal/OneDrive/Desktop/PROJECTS/ve_LOOP/ADMIN_GUIDE.md)
- [x] [TESTING.md](file:///c:/Users/kodal/OneDrive/Desktop/PROJECTS/ve_LOOP/TESTING.md)
- [x] [Postman Collection](file:///c:/Users/kodal/OneDrive/Desktop/PROJECTS/ve_LOOP/postman/VELoop_Rewards.postman_collection.json)
- [x] Screenshots & Demonstration video recording in `docs/`
- [x] `.env.example` configurations
