# Deployment Instructions

## Frontend Deployment (Vercel)

### Steps to Deploy
1. **Push Code to Repository**
   - Ensure your frontend code is committed and pushed to a Git repository.

2. **Connect Repository to Vercel**
   - Go to Vercel Dashboard.
   - Click **New Project** and select your repository.

3. **Configure Project Settings**
   - Select **Framework Preset** as `Vite`.
   - Set **Build Command**: `npm run build`
   - Set **Output Directory**: `dist`

4. **Set Environment Variables** (If Required)
   - Go to **Settings > Environment Variables**
   - Add necessary variables.

5. **Deploy**
   - Click **Deploy** and wait for deployment to complete.
   - Your frontend will be live on `https://your-project-name.vercel.app`.

---

## Backend Deployment (Render)

### Steps to Deploy

1. **Push Code to Repository**
   - Ensure your backend code is committed and pushed to a Git repository.

2. **Create a New Service on Render**
   - Go to Render Dashboard.
   - Click **New Web Service**.
   - Connect your repository.

3. **Configure Service Settings**
   - Select **Environment**: `Node`.
   - Set **Build Command**: `npm install;npx prisma generate; npm run build`
   - Set **Start Command**: `npm run start:prod`

4. **Set Up Environment Variables**
   - Add required variables like `DATABASE_URL`.

5. **Deploy**
   - Click **Deploy** and wait for the build to complete.
   - Your backend will be live at `https://your-backend-service.onrender.com`.

### Additional Notes
- Ensure CORS is configured correctly for frontend-backend communication.
- Monitor logs via Vercel and Render dashboards for debugging.
- Set up auto-deploy for continuous integration.

