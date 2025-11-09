# Deployment Guide

## Quick Deploy to Render

1. **Create Render Account**: Sign up at [render.com](https://render.com)

2. **Connect Repository**: 
   - Go to Dashboard → New → Web Service
   - Connect your GitHub account
   - Select `assignment_backend` repository

3. **Configure Service**:
   ```
   Name: emi-products-backend
   Environment: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

4. **Set Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/emi-products
   PORT=10000
   NODE_ENV=production
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   FRONTEND_URL=https://vermillion-strudel-6bb21d.netlify.app
   ```

5. **Deploy**: Click "Create Web Service"

## Alternative: Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel

# Set environment variables in Vercel dashboard
```

## Alternative: Railway Deployment

1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Deploy: `railway up`

## Post-Deployment

1. **Seed Database**:
   ```bash
   # Access your deployed backend URL
   curl -X POST https://your-backend-url/api/admin/seed-data
   ```

2. **Test Health Check**:
   ```bash
   curl https://your-backend-url/api/health
   ```

3. **Update Frontend**: Update your frontend's API base URL to point to the deployed backend.