# Firebase Setup Guide

This guide explains how to set up Firebase for the Minutify application.

## Prerequisites

- Firebase account (free tier is sufficient for development)
- Firebase CLI installed: `npm install -g firebase-tools`

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `minutify` (or your preferred name)
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Enable **Google** provider (optional)
4. Save changes

## Step 3: Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in production mode**
3. Select your preferred location (e.g., europe-west3 for EU)
4. Click **Enable**

## Step 4: Configure Firestore Security Rules

1. Go to **Firestore Database** → **Rules**
2. Copy the content from `lib/firebase/firestore.rules`
3. Paste and publish

## Step 5: Set Up Firebase Storage

1. Go to **Storage** → **Get started**
2. Choose **Start in production mode**
3. Click **Done**

## Step 6: Configure Storage Security Rules

1. Go to **Storage** → **Rules**
2. Copy the content from `lib/firebase/storage.rules`
3. Paste and publish

## Step 7: Get Firebase Configuration

### Client Configuration

1. Go to **Project Settings** (gear icon) → **General**
2. Scroll to "Your apps" and click **Web** icon (</>)
3. Register app with name "Minutify Web"
4. Copy the `firebaseConfig` object values

### Admin SDK Configuration

1. Go to **Project Settings** → **Service accounts**
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the following values:
   - `project_id`
   - `client_email`
   - `private_key`

## Step 8: Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in the values:

```env
# Client Config (from Step 7)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin SDK (from Step 7)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

**Important**: Keep the private key wrapped in quotes and preserve the `\n` characters.

## Step 9: Initialize Firestore Collections (Optional)

The application will automatically create collections on first use. Initial structure:

```
/users/{userId}
/meetings/{meetingId}
  /segments/{segmentId}
/analysis/{analysisId}
```

## Step 10: Verify Setup

Run the development server:

```bash
npm run dev
```

Try to register a new user. If successful, check Firebase Console:
- Authentication → Users (should show new user)
- Firestore → Data (collections created on first write)

## Security Notes

- Never commit `.env.local` to version control
- Firestore rules ensure users can only access their own data
- Storage rules restrict file types and sizes
- All operations require authentication

## Troubleshooting

### "Permission denied" errors
- Check Firestore security rules are deployed
- Verify user is authenticated
- Ensure `userId` fields match `request.auth.uid`

### "Admin SDK initialization failed"
- Verify private key format (preserve newlines)
- Check all admin environment variables are set
- Ensure service account has proper permissions

### Storage upload fails
- Check file size limits (100MB audio, 50MB documents)
- Verify file MIME type matches storage rules
- Ensure Storage rules are deployed

## GDPR Compliance

- Storage location set to EU region
- User data deletion implemented in application
- All data scoped to individual users
- No third-party data sharing
