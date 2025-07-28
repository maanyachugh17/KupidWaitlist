# Kupid Waitlist Deployment Guide

## Backend Server Deployment (Required for friends to use)

Your friends are getting network errors because the Node.js server only runs on your local machine. You need to deploy the backend server to make it work for everyone.

### Option 1: Deploy to Render (Free & Easy)

1. **Go to [render.com](https://render.com)** and sign up for free
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository** (KupidWaitlist)
4. **Configure the service:**
   - **Name**: `kupid-waitlist-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Click "Create Web Service"**
6. **Wait for deployment** (takes 2-3 minutes)
7. **Copy the URL** (e.g., `https://kupid-waitlist-api.onrender.com`)

### Option 2: Deploy to Railway (Alternative)

1. **Go to [railway.app](https://railway.app)** and sign up
2. **Click "New Project" → "Deploy from GitHub repo"**
3. **Select your KupidWaitlist repository**
4. **Railway will auto-detect it's a Node.js app**
5. **Deploy and copy the URL**

### Update Frontend URL

Once you have your deployed server URL, update the frontend:

1. **Replace the URL in `src/App.jsx`**:
   ```javascript
   const apiUrl = window.location.hostname === 'localhost' 
     ? 'http://localhost:3001/api/submit'
     : 'https://YOUR-DEPLOYED-URL/api/submit';
   ```

2. **Push the changes**:
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push
   ```

### Test

After deployment:
1. Your local development will still use `localhost:3001`
2. Your deployed website will use the deployed server
3. Friends can now use the website without network errors!

## Current Status

- ✅ **Frontend**: Deployed to Vercel (works for everyone)
- ❌ **Backend**: Only local (needs deployment for friends to use)
- 🔄 **Next Step**: Deploy backend server using one of the options above 