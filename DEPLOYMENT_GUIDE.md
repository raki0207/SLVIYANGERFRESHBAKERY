# 🚀 Raki Bakery - Deployment Guide

This guide covers how to deploy your bakery app so that **images work correctly** in production.

---

## 📋 Table of Contents

1. [Understanding Your Current Setup](#understanding-your-current-setup)
2. [Option 1: Deploy on Render (Recommended - Free)](#option-1-deploy-on-render-recommended---free)
3. [Option 2: Deploy on Railway](#option-2-deploy-on-railway)
4. [Option 3: Use Cloudinary for Images](#option-3-use-cloudinary-for-images)
5. [Environment Variables Reference](#environment-variables-reference)
6. [Troubleshooting](#troubleshooting)

---

## Understanding Your Current Setup

Your app has:
- **Frontend**: React app (builds to `/build` folder)
- **Backend**: Express server in `/backend-server`
- **Images**: Stored in `/public` folder, served via `/media` route

**How images work:**
```
Database stores: "/Midnight-Belgian-Chocolate-Cake.png"
Backend converts to: "https://your-backend.com/media/Midnight-Belgian-Chocolate-Cake.png"
```

---

## Option 1: Deploy on Render (Recommended - Free)

Render is beginner-friendly and has a free tier.

### Step 1: Prepare Your Project

1. **Create a `.env.example` file** in `backend-server/`:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bakery

# Server Configuration
PORT=5000
NODE_ENV=production

# Image Configuration (will be auto-set by Render)
ASSET_BASE_URL=https://your-backend-url.onrender.com
STATIC_ASSETS_DIR=../public
```

2. **Update `backend-server/package.json`** - add a start script:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Step 2: Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Prepare for deployment"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/raki-bakery.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy Backend on Render

1. Go to [render.com](https://render.com) and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `raki-bakery-backend`
   - **Root Directory**: `backend-server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

5. Add **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | Your MongoDB connection string |
   | `NODE_ENV` | `production` |
   | `STATIC_ASSETS_DIR` | `../public` |

6. Click **"Create Web Service"**

7. After deployment, copy your backend URL (e.g., `https://raki-bakery-backend.onrender.com`)

### Step 4: Deploy Frontend on Render

1. Click **"New +"** → **"Static Site"**
2. Connect the same repository
3. Configure:
   - **Name**: `raki-bakery-frontend`
   - **Root Directory**: (leave empty or `.`)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. Add **Environment Variable**:
   | Key | Value |
   |-----|-------|
   | `REACT_APP_API_URL` | `https://raki-bakery-backend.onrender.com/api` |

5. Click **"Create Static Site"**

### Step 5: Update ASSET_BASE_URL

Go back to your **backend service** → Environment → Add:
```
ASSET_BASE_URL=https://raki-bakery-backend.onrender.com
```

✅ **Done!** Your images will now load from:
`https://raki-bakery-backend.onrender.com/media/your-image.jpg`

---

## Option 2: Deploy on Railway

Railway offers $5 free credit monthly.

### Step 1: Deploy

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"** → **"Deploy from GitHub Repo"**
3. Select your repository

### Step 2: Configure Services

**For Backend:**
1. Click on the service → **Settings**
2. Set **Root Directory**: `backend-server`
3. Add environment variables:
   ```
   MONGODB_URI=your_mongodb_uri
   NODE_ENV=production
   PORT=5000
   ```

**For Frontend:**
1. Add another service from same repo
2. Set build command: `npm run build`
3. Set start command: `npx serve -s build`

---

## Option 3: Use Cloudinary for Images (Best for Scale)

Cloudinary is a cloud image hosting service with a generous free tier.

### Step 1: Create Cloudinary Account

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to **Dashboard** and note your **Cloud Name**

### Step 2: Upload Your Images

**Option A: Manual Upload**
1. Go to **Media Library** in Cloudinary
2. Create a folder called `bakery`
3. Upload all images from your `public` folder

**Option B: Bulk Upload Script**

Create `backend-server/scripts/uploadToCloudinary.js`:

```javascript
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'YOUR_CLOUD_NAME',
  api_key: 'YOUR_API_KEY',
  api_secret: 'YOUR_API_SECRET'
});

const publicDir = path.join(__dirname, '../../public');
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

async function uploadImages() {
  const files = fs.readdirSync(publicDir);
  
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (imageExtensions.includes(ext)) {
      const filePath = path.join(publicDir, file);
      const publicId = path.basename(file, ext);
      
      try {
        console.log(`Uploading: ${file}`);
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'bakery',
          public_id: publicId,
          overwrite: true
        });
        console.log(`✅ Uploaded: ${result.secure_url}`);
      } catch (error) {
        console.error(`❌ Failed: ${file}`, error.message);
      }
    }
  }
}

uploadImages();
```

Install and run:
```bash
cd backend-server
npm install cloudinary
node scripts/uploadToCloudinary.js
```

### Step 3: Update Your Backend

Update `backend-server/routes/productRoutes.js`:

```javascript
const buildImageUrl = (imagePath, req) => {
  if (!imagePath) {
    return '';
  }

  // Already a full URL (including Cloudinary)
  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  // Check if Cloudinary is configured
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    const imageName = imagePath.replace(/^\//, '').replace(/\.[^.]+$/, '');
    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/bakery/${imageName}`;
  }

  // Fall back to local serving
  const baseUrl =
    (process.env.ASSET_BASE_URL && process.env.ASSET_BASE_URL.replace(/\/$/, '')) ||
    `${req.protocol}://${req.get('host')}`;
  const mediaPrefix = (process.env.MEDIA_URL_PREFIX || '/media').replace(/\/$/, '');
  const normalizedImagePath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  return `${baseUrl}${mediaPrefix}${normalizedImagePath}`;
};
```

### Step 4: Set Environment Variable

Add to your hosting provider:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
```

✅ **Done!** Images now load from Cloudinary CDN.

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode | `production` |
| `ASSET_BASE_URL` | Base URL for images | `https://your-backend.com` |
| `STATIC_ASSETS_DIR` | Path to images folder | `../public` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `my-cloud` |
| `REACT_APP_API_URL` | Backend API URL (frontend) | `https://backend.com/api` |

---

## Troubleshooting

### Images Not Loading?

1. **Check the image URL in browser DevTools**
   - Open Network tab
   - Look for 404 errors on images
   - Copy the URL and test directly

2. **Verify ASSET_BASE_URL is set correctly**
   ```bash
   # Should match your backend URL
   echo $ASSET_BASE_URL
   ```

3. **Check if images exist in public folder**
   - Make sure all images from `public/` are deployed
   - Some hosting services ignore certain files

4. **CORS Issues?**
   - Your backend already sets `Access-Control-Allow-Origin: *` for images
   - If issues persist, check browser console

### Database Images Not Matching Files?

Run this check in MongoDB:
```javascript
// Get all unique image paths from database
db.products.distinct("image")
```

Compare with files in your `public` folder.

### Backend Not Starting?

Check logs for:
- Missing environment variables
- MongoDB connection errors
- Port conflicts

---

## Quick Deployment Checklist

- [ ] MongoDB URI is set and working
- [ ] All images are in `public/` folder
- [ ] Backend `package.json` has `"start": "node server.js"`
- [ ] Environment variables are configured
- [ ] Frontend `REACT_APP_API_URL` points to backend
- [ ] `ASSET_BASE_URL` matches your deployed backend URL
- [ ] Test image URLs work: `https://your-backend.com/media/test-image.jpg`

---

## Need More Help?

Common hosting platforms with guides:
- **Render**: [render.com/docs](https://render.com/docs)
- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Vercel** (frontend): [vercel.com/docs](https://vercel.com/docs)
- **Heroku**: [devcenter.heroku.com](https://devcenter.heroku.com)

---

*Last updated: November 2025*

