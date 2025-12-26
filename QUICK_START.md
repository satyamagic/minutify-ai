# Minutify - Quick Start Guide

Welcome to Minutify! This guide will help you get the application running in under 10 minutes.

## Prerequisites Check

Before you begin, ensure you have:

- ✅ Node.js 18+ (`node --version`)
- ✅ Python 3.9+ (`python3 --version`)
- ✅ npm installed (`npm --version`)
- ✅ Git installed (`git --version`)

## 🚀 Quick Start (Development)

### Step 1: Install Dependencies (2 min)

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
cd python-service
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### Step 2: Configure Firebase (5 min)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password + Google)
4. Create Firestore Database (production mode)
5. Set up Storage
6. Get your configuration values

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions.

### Step 3: Environment Variables (2 min)

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your Firebase credentials.

**Minimum Required:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

FIREBASE_PROJECT_ID=your_project
FIREBASE_CLIENT_EMAIL=your_email
FIREBASE_PRIVATE_KEY="your_private_key"

OPENAI_API_KEY=sk-proj-your_key
```

### Step 4: Install ffmpeg (Audio Processing)

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

### Step 5: Start Servers (1 min)

**Terminal 1:**
```bash
npm run dev
```

**Terminal 2:**
```bash
cd python-service
source venv/bin/activate
python main.py
```

### Step 6: Access Application

🎉 Open http://localhost:3000

- Register a new account
- Try recording or uploading a file
- Explore the dashboard

## 📋 Verification Checklist

- [ ] Next.js running on http://localhost:3000
- [ ] Python service running on http://localhost:8000
- [ ] Can register a new user
- [ ] Can log in
- [ ] Can access dashboard
- [ ] Can record audio (browser permission required)
- [ ] Can upload files

## 🐛 Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
- Check your `.env.local` file
- Ensure all Firebase variables are set correctly
- Restart Next.js dev server

### "Cannot access microphone"
- Browser needs HTTPS or localhost
- Grant microphone permissions when prompted
- Check browser console for errors

### "Python service connection refused"
- Ensure Python service is running on port 8000
- Check `PYTHON_SERVICE_URL` in `.env.local`
- Verify virtual environment is activated

### "Module not found: whisper"
- Activate Python virtual environment
- Run `pip install -r requirements.txt` again
- First install downloads ~2GB of model files

### "ffmpeg not found"
- Install ffmpeg using system package manager
- Verify with `ffmpeg -version`
- Restart Python service after installation

## 🎯 Next Steps

1. **Deploy Security Rules**
   - Go to Firebase Console
   - Deploy Firestore rules from `lib/firebase/firestore.rules`
   - Deploy Storage rules from `lib/firebase/storage.rules`

2. **Try Features**
   - Record a short audio clip
   - Upload a PDF document
   - View processed results
   - Test GDPR export/delete

3. **Customize**
   - Modify Whisper model in `python-service/transcription.py`
   - Adjust AI prompts (when implementing Step 8)
   - Customize UI colors in `tailwind.config.ts`

## 📚 Further Reading

- [Complete README](./README.md)
- [Firebase Setup Guide](./FIREBASE_SETUP.md)
- [Python Service Documentation](./python-service/README.md)
- [Project Plan](./PROJECT_PLAN.md)

## 🤝 Need Help?

- Check the [Troubleshooting](#-troubleshooting) section
- Review Firebase Console for errors
- Check browser console (F12)
- Verify environment variables
- Ensure all services are running

## 💡 Tips

- Use Chrome/Edge for best audio recording support
- Start with short audio clips (< 1 minute) for testing
- Whisper model downloads on first use (~2GB)
- Processing time is roughly 1-2x audio duration
- Keep terminal windows open to see logs

---

**Happy coding! 🚀**
