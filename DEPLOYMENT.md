# Vercel Deployment Guide

This guide will help you deploy your YouTube MP3 Downloader to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Vercel CLI** (optional): `npm install -g vercel`

## Deployment Steps

### 1. Backend Deployment

#### Option A: Using Vercel CLI
```bash
cd backend
vercel --prod
```

#### Option B: Using GitHub Integration
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Set the root directory to `backend`
5. Deploy

### 2. Frontend Deployment

#### Environment Variables Setup
Before deploying the frontend, you need to set the backend API URL:

1. Go to your Vercel dashboard
2. Select your frontend project
3. Go to Settings → Environment Variables
4. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.vercel.app`
   - **Environment**: Production, Preview, Development

#### Deploy Frontend
```bash
cd frontend
vercel --prod
```

### 3. Alternative: Monorepo Deployment

If you want to deploy both from the same repository:

1. Create a `vercel.json` in the root directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "frontend/dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

## Important Notes

### Backend Limitations
- **Serverless Functions**: Vercel uses serverless functions with a 10-second timeout for hobby plans
- **File System**: Temporary file storage is limited
- **External Dependencies**: `yt-dlp` and `ffmpeg` need to be available

### Recommended Setup
For production use, consider:
1. **Upgraded Vercel Plan**: For longer function execution times
2. **Alternative Backend**: Consider deploying backend to a VPS or other platform
3. **CDN**: Use a CDN for better file delivery

### Environment Variables

#### Backend (.env)
```bash
# Add any backend-specific environment variables here
NODE_ENV=production
```

#### Frontend (.env.local)
```bash
# Local development
VITE_API_URL=http://localhost:5001
```

#### Frontend (Vercel Environment Variables)
```bash
# Production
VITE_API_URL=https://your-backend-url.vercel.app
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **API Connection Issues**
   - Verify environment variables are set correctly
   - Check CORS configuration
   - Ensure backend is deployed and accessible

3. **Function Timeouts**
   - Upgrade Vercel plan for longer execution times
   - Optimize download process
   - Consider chunking large files

### Support
- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Review build logs in Vercel dashboard
- Check function logs for backend issues

## Security Considerations

1. **Rate Limiting**: Implement rate limiting to prevent abuse
2. **Input Validation**: Validate YouTube URLs
3. **File Size Limits**: Set appropriate file size limits
4. **CORS**: Configure CORS properly for production

## Performance Optimization

1. **Caching**: Implement caching for frequently requested videos
2. **Compression**: Enable gzip compression
3. **CDN**: Use Vercel's edge network for better performance
4. **Optimization**: Minimize bundle sizes and optimize images 