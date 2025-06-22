# Container Deployment Guide

This guide shows you how to deploy your YouTube MP3 Downloader as a container to various platforms.

## 🐳 **Why Containers?**

Containers solve the Vercel limitations by:
- ✅ **Full system access**: Install `yt-dlp`, `ffmpeg`, and other tools
- ✅ **Persistent storage**: Full file system access
- ✅ **No time limits**: Processes can run as long as needed
- ✅ **Consistent environment**: Same as your local setup

## 🚀 **Deployment Options**

### **Option 1: Railway (Recommended)**
**Best for**: Easy deployment, good free tier, automatic HTTPS

1. **Sign up**: [railway.app](https://railway.app)
2. **Connect GitHub**: Link your repository
3. **Deploy**: Railway will auto-detect the Dockerfile
4. **Get URL**: Your app will be live at `https://your-app.railway.app`

### **Option 2: Render**
**Best for**: Free tier, easy setup

1. **Sign up**: [render.com](https://render.com)
2. **Create Web Service**: Connect your GitHub repo
3. **Configure**:
   - **Build Command**: `docker build -t youtube-mp3-downloader .`
   - **Start Command**: `docker run -p 5001:5001 youtube-mp3-downloader`
4. **Deploy**: Your app will be live at `https://your-app.onrender.com`

### **Option 3: Fly.io**
**Best for**: Global deployment, good performance

1. **Install Fly CLI**: `curl -L https://fly.io/install.sh | sh`
2. **Login**: `fly auth login`
3. **Deploy**: `fly launch`
4. **Scale**: `fly scale count 1`

### **Option 4: DigitalOcean App Platform**
**Best for**: Production apps, good performance

1. **Create App**: Connect your GitHub repository
2. **Select Docker**: Choose Docker deployment
3. **Configure**: Set environment variables if needed
4. **Deploy**: Your app will be live

## 🧪 **Local Testing**

### **Test the Container Locally**
```bash
# Build the container
docker build -t youtube-mp3-downloader .

# Run the container
docker run -p 5001:5001 youtube-mp3-downloader

# Or use docker-compose
docker-compose up --build
```

### **Test the API**
```bash
# Health check
curl http://localhost:5001/health

# Test download
curl -X POST http://localhost:5001/api/download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

## 🔧 **Configuration**

### **Environment Variables**
```bash
# Production
NODE_ENV=production
PORT=5001

# Optional: Custom yt-dlp options
YT_DLP_OPTIONS="--audio-format mp3 --audio-quality 0"
```

### **Volume Mounts**
```bash
# For persistent downloads (optional)
-v ./downloads:/app/backend/downloads
```

## 📊 **Platform Comparison**

| Platform | Free Tier | Docker Support | Auto HTTPS | Custom Domain |
|----------|-----------|----------------|------------|---------------|
| Railway  | ✅ Yes    | ✅ Yes         | ✅ Yes     | ✅ Yes        |
| Render   | ✅ Yes    | ✅ Yes         | ✅ Yes     | ✅ Yes        |
| Fly.io   | ✅ Yes    | ✅ Yes         | ✅ Yes     | ✅ Yes        |
| DigitalOcean | ❌ No | ✅ Yes         | ✅ Yes     | ✅ Yes        |

## 🚨 **Important Notes**

### **File System**
- Downloads are temporary in containers
- Files are deleted when container restarts
- Use volume mounts for persistence (if needed)

### **Memory Usage**
- Video processing can be memory-intensive
- Monitor your app's memory usage
- Consider upgrading if needed

### **Rate Limiting**
- Some platforms have request limits
- Monitor your usage
- Consider caching strategies

## 🔄 **Updates**

### **Automatic Deployments**
Most platforms support automatic deployments:
1. Push to your main branch
2. Platform automatically rebuilds and deploys
3. Zero downtime updates

### **Manual Deployments**
```bash
# Railway
railway up

# Render
# Automatic from GitHub

# Fly.io
fly deploy

# DigitalOcean
# Automatic from GitHub
```

## 🛠️ **Troubleshooting**

### **Common Issues**

#### Build Fails
```bash
# Check Docker build locally
docker build -t test .

# Check logs
docker logs <container-id>
```

#### App Won't Start
```bash
# Check if port is exposed
docker run -p 5001:5001 youtube-mp3-downloader

# Check environment variables
docker run -e NODE_ENV=production -p 5001:5001 youtube-mp3-downloader
```

#### yt-dlp Issues
```bash
# Test yt-dlp in container
docker run -it youtube-mp3-downloader yt-dlp --version

# Update yt-dlp
docker run -it youtube-mp3-downloader pip3 install --upgrade yt-dlp
```

## 🎉 **Success!**

Your containerized YouTube MP3 Downloader will now work exactly like your local environment, but deployed to the cloud!

**Benefits:**
- ✅ Same functionality as local
- ✅ No Vercel limitations
- ✅ Full system access
- ✅ Scalable and reliable
- ✅ Automatic HTTPS
- ✅ Custom domains supported 