# YouTube to MP3 Downloader

A full-stack web application that allows users to download the audio (MP3) of YouTube videos by pasting the URL. Built with React frontend and Node.js backend, using `yt-dlp` and `ffmpeg` for video/audio extraction.

---

## 🚀 Features

- **Simple Interface**: Paste a YouTube link and download MP3 instantly
- **High Quality**: Extracts audio in MP3 format with good quality
- **Fast Downloads**: Optimized for quick audio extraction
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Modern UI**: Clean React interface with responsive design

### Tech Stack
- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Audio Processing**: yt-dlp + ffmpeg
- **Styling**: CSS3 with modern design

---

## 📁 Project Structure

```
youtube-mp3-downloader/
├── backend/
│   ├── index.js              # Express server setup
│   ├── routes/
│   │   └── download.js       # Download API endpoints
│   ├── downloads/            # Temporary MP3 storage
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main React component
│   │   ├── App.css           # Styles
│   │   └── main.jsx          # React entry point
│   ├── index.html
│   └── package.json
├── package.json              # Root package.json for concurrent running
└── README.md
```

---

## ⚙️ Requirements

### Local Development
- Node.js (v16 or higher)
- `yt-dlp` ([Installation Guide](https://github.com/yt-dlp/yt-dlp#installation))
- `ffmpeg` ([Installation Guide](https://ffmpeg.org/download.html))

### Vercel Deployment
- Vercel account
- GitHub repository

---

## 🧪 Local Development

### Quick Start (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd youtube-mp3-downloader

# Install all dependencies
npm run install-all

# Start both frontend and backend
npm run dev
```

### Manual Setup

#### 1. Backend Setup
```bash
cd backend
npm install
node index.js
```
> **Note**: Make sure `yt-dlp` and `ffmpeg` are installed and available in your system PATH.

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001

---

## 🚀 Vercel Deployment

### Prerequisites
1. Create a [Vercel account](https://vercel.com/signup)
2. Install [Vercel CLI](https://vercel.com/docs/cli): `npm i -g vercel`
3. Ensure your code is pushed to a GitHub repository

### Deployment Steps

#### 1. Prepare for Deployment
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login
```

#### 2. Deploy Backend API
```bash
# Navigate to backend directory
cd backend

# Deploy to Vercel
vercel --prod
```

#### 3. Deploy Frontend
```bash
# Navigate to frontend directory
cd frontend

# Deploy to Vercel
vercel --prod
```

#### 4. Configure Environment Variables
In your Vercel dashboard:
1. Go to your project settings
2. Add environment variables if needed
3. Configure build settings if required

### Alternative: GitHub Integration
1. Connect your GitHub repository to Vercel
2. Vercel will automatically deploy on every push
3. Configure build settings in Vercel dashboard

---

## 🔧 Configuration

### Backend Configuration
The backend runs on port 5001 by default. You can modify this in `backend/index.js`:

```javascript
app.listen(5001, () => {
  console.log('Server running on http://localhost:5001');
});
```

### Frontend Configuration
The frontend runs on port 3000 by default. API endpoint is configured in `frontend/src/App.jsx`.

---

## 📦 How It Works

1. **User Input**: User pastes a YouTube URL in the frontend
2. **API Request**: Frontend sends the URL to the backend API
3. **Video Processing**: Backend uses `yt-dlp` to extract video info and download audio
4. **Audio Conversion**: `ffmpeg` converts the audio to MP3 format
5. **File Delivery**: Backend serves the MP3 file to the user
6. **Cleanup**: Temporary files are automatically deleted

### File Flow
```
YouTube URL → yt-dlp → Audio Extraction → ffmpeg → MP3 → User Download → Cleanup
```

---

## 🛠️ Troubleshooting

### Common Issues

#### Backend Won't Start
- Ensure `yt-dlp` and `ffmpeg` are installed
- Check if port 5001 is available
- Verify all dependencies are installed

#### Frontend Can't Connect to Backend
- Ensure backend is running on port 5001
- Check CORS configuration
- Verify API endpoint URLs

#### Download Fails
- Check if YouTube URL is valid
- Ensure video is publicly available
- Verify internet connection

### Vercel Deployment Issues
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify environment variables are set correctly

---

## 📜 License

This project is for personal use only. Please respect YouTube's [Terms of Service](https://www.youtube.com/t/terms) when downloading content.

### Disclaimer
This tool is intended for downloading content that you have the right to access. Please ensure you comply with all applicable laws and terms of service.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with detailed information

---

**Happy Downloading! 🎵**

