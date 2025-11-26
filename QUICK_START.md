# ⚡ Quick Start Guide - Backend Setup

## 🎯 5-Minute Setup

### Step 1: Install Node.js (If Needed)
- Download: https://nodejs.org/ (LTS version)
- Install it (just click Next, Next, Next...)
- ✅ Done!

### Step 2: Open Terminal in Backend Folder
```bash
cd backend-server
```

### Step 3: Install Packages
```bash
npm install
```
⏳ Wait 1-2 minutes...

### Step 4: Get Free MongoDB Database
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (FREE)
3. Create free cluster
4. Create database user (save password!)
5. Whitelist IP (click "Allow Access from Anywhere")
6. Get connection string

### Step 5: Create .env File
In `backend-server` folder, create file named `.env`:

```env
PORT=5000
MONGO_URL=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/bakery-db?retryWrites=true&w=majority
NODE_ENV=development
```

**Replace YOUR_USERNAME and YOUR_PASSWORD with your MongoDB credentials!**

### Step 6: Add Sample Products
```bash
npm run seed
```

### Step 7: Start Server
```bash
npm start
```

✅ You should see: "Server running on port 5000"

### Step 8: Test It
Open browser: http://localhost:5000/api/products

You should see products! 🎉

---

## 🔗 Connect Frontend

1. In project root, create `.env` file:
```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

2. Restart React app:
```bash
npm start
```

---

## 📚 Full Guide
See `backend-server/BACKEND_SETUP_GUIDE.md` for detailed instructions.

