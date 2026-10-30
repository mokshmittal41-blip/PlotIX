# 🏢 PropWise Backend API

Node.js, Express, and TypeScript backend service for **PropWise Real Estate Intelligence Platform**, powered by **Supabase PostgreSQL** and **Supabase Auth**.

---

## 🚀 Quick Setup & Installation

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Fill in your Supabase project credentials in `backend/.env`:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5174

SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

> ⚠️ **Security Warning**: The `SUPABASE_SERVICE_ROLE_KEY` has administrative access and is only used server-side in this Node.js backend. **Never expose it in the frontend or commit it to version control.**

---

## 🗄️ Supabase Dashboard Configuration

### Step 1: Run the Database Schema in Supabase
1. Open your [Supabase Dashboard](https://supabase.com/dashboard) and select your project.
2. In the left navigation, click on **SQL Editor**.
3. Click **New Query**, copy the entire contents of [`backend/src/db/schema.sql`](./src/db/schema.sql), and click **Run**.
4. This will create:
   - `public.profiles` table linked to `auth.users(id)`.
   - Unique index on phone numbers to avoid duplicates.
   - Row Level Security (RLS) policies.
   - Automatic database trigger to create a profile whenever a user signs up.

### Step 2: Supabase Auth Settings
1. Go to **Authentication** -> **Providers** -> **Email**:
   - Enable Email provider.
   - *(Optional for development)*: Disable **"Confirm email"** toggle if you want users to log in immediately without waiting for confirmation emails during local testing.
2. *(Optional)* Go to **Authentication** -> **Providers** -> **Google**:
   - Enable Google provider and paste your Google OAuth Client ID & Client Secret from Google Cloud Console.
3. In **Authentication** -> **URL Configuration**:
   - Set **Site URL** to `http://localhost:5174` (or your production frontend URL).
   - Add `http://localhost:5174/**` to **Redirect URLs**.

---

## 📱 Phone Number + Password Authentication Note

### Architectural Implementation:
- In PropWise, users can register and log in using either an **Email Address** or a **10-digit Indian Mobile Number** (`+91 XXXXXXXXXX`).
- To keep the platform 100% free and avoid paid third-party SMS OTP services (e.g. Twilio / MessageBird), mobile accounts are securely registered in Supabase Auth using a normalized internal domain format (`${cleanDigits}@phone.propwise.internal`).
- The actual phone number is stored in the `phone` column of `public.profiles` with a strict `UNIQUE` database constraint.
- **Important**: This is an MVP workaround for free password-based phone logins. It is not native Supabase SMS OTP authentication, but it leverages Supabase Auth's robust password hashing (bcrypt), token rotation, and session management.

---

## 🛠️ Running Locally

### Development Mode (with hot reload):
```bash
npm run dev
```

### Production Build & Start:
```bash
npm run build
npm start
```

---

## 📡 API Endpoints

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Access**: Public
- **Response**:
```json
{
  "success": true,
  "status": "healthy",
  "service": "PropWise Real Estate Intelligence API",
  "database": {
    "provider": "Supabase PostgreSQL",
    "status": "connected"
  }
}
```

### 2. Get Current Authenticated User & Profile
- **Endpoint**: `GET /api/users/me`
- **Access**: Protected (Requires `Authorization: Bearer <supabase_access_token>`)
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "fullName": "Moksh",
    "email": "moksh@propwise.intelligence",
    "phone": "+91 9876543210",
    "role": "Property Pro",
    "authProvider": "email"
  }
}
```

### 3. Update Profile
- **Endpoint**: `PUT /api/users/profile`
- **Access**: Protected (Requires `Authorization: Bearer <supabase_access_token>`)
- **Body**:
```json
{
  "fullName": "Moksh Kumar",
  "phone": "9876543210",
  "avatarUrl": "https://example.com/avatar.png"
}
```

---

## 🚢 Deployment Guide

### Deploying Backend to Render / Railway:
1. Push your repository to GitHub.
2. Create a new **Web Service** on [Render](https://render.com) or [Railway](https://railway.app).
3. Set **Root Directory** to `backend`.
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`
6. Add Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `SUPABASE_URL=https://your-project-ref.supabase.co`
   - `SUPABASE_ANON_KEY=...`
   - `SUPABASE_SERVICE_ROLE_KEY=...`
   - `FRONTEND_URL=https://your-frontend-domain.com`

### Deploying Frontend:
1. Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_BACKEND_API_URL` in your frontend deployment environment (Vercel / Netlify).
