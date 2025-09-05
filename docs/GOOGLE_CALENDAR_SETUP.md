# Google Calendar Integration Setup Guide

This guide walks you through setting up Google Cloud credentials for calendar integration in FocusHive.

## 🚀 Quick Start (Automated Setup)

**Recommended**: Use our automated setup script that handles everything:

```bash
# Run the complete setup automation
./infrastructure/setup.sh
```

This script will:
- Install OpenTofu/Terraform and Google Cloud CLI
- Authenticate with Google Cloud
- Deploy infrastructure automatically
- Generate environment variables
- Guide you through any manual steps

**Continue to Manual Setup below if you prefer manual configuration**

---

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Project name: `focushive-calendar` (or your preferred name)
4. Click "Create"

## Step 2: Enable Google Calendar API

1. In your project dashboard, go to "APIs & Services" → "Library"
2. Search for "Google Calendar API"
3. Click on "Google Calendar API" → "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" (for public use) → "Create"
3. Fill out required fields:
   - **App name**: FocusHive
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. **Scopes**: Add `calendar.events.readonly`
   - Click "Add or Remove Scopes"
   - Filter for "Google Calendar API"
   - Select "See events on all your calendars" (readonly)
   - Click "Update"
5. **Test users**: Add your email for testing
6. Click "Save and Continue" through all steps

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Application type: "Web application"
4. Name: "FocusHive Calendar Client"
5. **Authorized JavaScript origins**:
   - Development: `http://localhost:3000` and `http://localhost:3001`
   - Production: `https://yourdomain.com`
6. **Authorized redirect URIs**:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`
7. Click "Create"

## Step 5: Save Credentials

1. Copy the **Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)
2. **DO NOT** copy the Client Secret (not used in PKCE flow)
3. Create `.env.local` file in your project root:

```env
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3001/auth/callback
```

## Step 6: Security Best Practices

- ✅ Use PKCE flow (no client secret in frontend)
- ✅ Request minimal scopes (`calendar.events.readonly`)
- ✅ Use secure storage for tokens
- ✅ Implement token refresh mechanism
- ✅ Provide clear disconnect option

## Environment Variables

For development, add to `.env.local`:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_actual_client_id
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3001/auth/callback
NEXT_PUBLIC_GOOGLE_SCOPES=https://www.googleapis.com/auth/calendar.events.readonly
```

For production, set these in your deployment platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables

## Testing the Setup

1. Start your development server: `pnpm dev`
2. Navigate to Settings → Calendar Integration
3. Click "Connect Google Calendar"
4. Verify OAuth consent screen appears with your app name
5. Check that only calendar read permissions are requested

## Troubleshooting

**Error: "redirect_uri_mismatch"**
- Verify redirect URIs match exactly in Google Cloud Console
- Include both `http://localhost:3000` and `http://localhost:3001`

**Error: "access_denied"**
- Check OAuth consent screen is configured correctly
- Verify test users are added during development

**Error: "invalid_client"**
- Verify Client ID is correctly set in `.env.local`
- Restart development server after adding environment variables

## Next Steps

**With Automated Setup:**
1. Run `./infrastructure/setup.sh`
2. Follow any manual configuration prompts
3. Start development: `pnpm dev`
4. Test calendar integration in Settings

**With Manual Setup:**
1. Implement OAuth PKCE flow
2. Create secure token storage  
3. Build calendar integration features
4. Test with your Google account

## Infrastructure Management

After using the automated setup, you can manage your infrastructure:

```bash
# Show current infrastructure status
./infrastructure/deploy.sh status

# Update infrastructure
./infrastructure/deploy.sh plan
./infrastructure/deploy.sh apply

# Remove all infrastructure
./infrastructure/deploy.sh destroy
```