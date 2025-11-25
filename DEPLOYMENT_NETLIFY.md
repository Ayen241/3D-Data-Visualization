# Netlify Deployment Checklist

Quick reference guide for deploying to Netlify.

## Pre-Deployment ✓

- [ ] Verify `.gitignore` includes `config.js` (CRITICAL FOR SECURITY)
- [ ] Test locally: `python -m http.server 8080` → visit `http://localhost:8080`
- [ ] Confirm all features work locally (sign in, 3D layouts, data loading)
- [ ] Create GitHub account if not already done
- [ ] Push code to GitHub

## Step-by-Step Deployment

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

### 2. Create Netlify Account
- [ ] Go to [netlify.com](https://netlify.com)
- [ ] Click "Sign Up"
- [ ] Choose "Continue with GitHub"
- [ ] Authorize Netlify to access your GitHub account

### 3. Create New Site
- [ ] Click "New site from Git"
- [ ] Choose GitHub as git provider
- [ ] Select your `3DataVis` repository
- [ ] Netlify auto-detects `netlify.toml` configuration
- [ ] **Leave default settings** (don't override build command):
  - [ ] Build command: (leave empty - netlify.toml handles it)
  - [ ] Publish directory: `.` (root directory)
- [ ] Click "Deploy site"
- [ ] Wait 1-2 minutes for initial deployment
- [ ] Note your Netlify URL: `https://[yoursite].netlify.app`

### 4. Add Environment Variables
1. [ ] Go to Site Settings (top menu)
2. [ ] Go to "Build & Deploy" section
3. [ ] Click "Environment" in left sidebar
4. [ ] Click "Edit variables"
5. [ ] Add variable: `GOOGLE_CLIENT_ID`
   - [ ] Value: `350471486924-vjm55gnpv7t14n8g2n7urimrrgarsq8u.apps.googleusercontent.com`
   - [ ] Click "Save"
6. [ ] Add variable: `SPREADSHEET_ID`
   - [ ] Value: `1OJw9C3SIBXa23lmRz5HsICwsp8PZB5QpJu28lTDgCP4`
   - [ ] Click "Save"
7. [ ] Add variable: `SHEET_NAME`
   - [ ] Value: `Data Template`
   - [ ] Click "Save"
8. [ ] Add variable: `USE_PUBLIC_SHEET`
   - [ ] Value: `true`
   - [ ] Click "Save"

### 5. Trigger New Deploy
- [ ] Go to "Deploys" tab
- [ ] Click "Trigger deploy" button
- [ ] Select "Deploy site"
- [ ] Wait for build to complete
- [ ] Netlify runs `scripts/build-config.js` automatically
- [ ] Should see ✓ Publish succeeded

### 6. Update Google Cloud Console
1. [ ] Go to [Google Cloud Console](https://console.cloud.google.com)
2. [ ] Select your OAuth project
3. [ ] Go to APIs & Services → Credentials
4. [ ] Click on your OAuth 2.0 Client ID (Web application)
5. [ ] Under "Authorized JavaScript origins":
   - [ ] Remove: `http://localhost:8080`
   - [ ] Add: `https://[yoursite].netlify.app` (replace [yoursite])
6. [ ] Under "Authorized redirect URIs":
   - [ ] Remove: `http://localhost:8080`
   - [ ] Add: `https://[yoursite].netlify.app`
7. [ ] Click "Save"
8. [ ] Wait 5 minutes for changes to propagate

### 7. Test Deployment
- [ ] Visit your Netlify URL: `https://[yoursite].netlify.app`
- [ ] Click "Sign in with Google"
- [ ] Sign in with your Google account
- [ ] Verify you're redirected to 3D visualization
- [ ] Test TABLE layout
- [ ] Test SPHERE layout
- [ ] Test HELIX layout
- [ ] Test GRID layout
- [ ] Test mouse drag (rotate view)
- [ ] Test scroll (zoom in/out)
- [ ] Verify data displays correctly

## Troubleshooting

### Issue: "config.js is missing" error on site
**Solution:**
1. Check browser console (F12) for exact error
2. Go to Netlify dashboard → Deploys tab
3. Click on latest deploy and check "Build log"
4. If build script didn't run, trigger deploy again:
   - Click "Trigger deploy" → "Deploy site"
5. Verify environment variables are set in Site Settings

### Issue: Build fails with "Module not found"
**Solution:**
1. Go to Deploys → click failed deploy
2. Click "Deploy log" to see error
3. Check that Node.js is available (Netlify includes it by default)
4. Try clearing cache: Deploys → Trigger deploy → "Clear build cache and deploy"

### Issue: Google Sign-In fails or shows consent screen errors
**Solution:**
1. **Check authorized origins match exactly:**
   - If Netlify URL is `https://abc123.netlify.app`
   - Google Cloud must have EXACTLY `https://abc123.netlify.app`
   - No trailing slashes, exact match required
2. **Check authorized redirect URIs:**
   - Add same URL as authorized origins
3. **Check test users:**
   - Go to Google Cloud → OAuth consent screen
   - Verify your email is added as test user
4. **Wait for propagation:**
   - Changes can take 5-15 minutes to apply
5. **Test in incognito mode:**
   - Clear cookies first: Ctrl+Shift+Delete
   - Try signing in again

### Issue: "Failed to fetch data" error
**Solution:**
1. Check browser console (F12) for detailed error
2. Verify `SPREADSHEET_ID` environment variable:
   - Netlify Site Settings → Environment
   - Check ID is exactly copied from Google Sheets URL
3. Verify `SHEET_NAME` environment variable:
   - Should match sheet tab name exactly
   - Default is "Data Template"
4. Verify Google Sheet is public:
   - Open sheet → Share → "Anyone with the link" → Viewer
5. Check sheet data format:
   - Columns: Name, Photo, Age, Country, Interest, Net Worth
   - Net Worth format: `$XXX,XXX.XX` (with dollar sign)
   - No empty rows at top

### Issue: Page looks broken or JavaScript errors
**Solution:**
1. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. Clear browser cache and cookies
3. Try in incognito mode
4. Check browser console for specific errors (F12)
5. Verify all script files loaded (Network tab in F12)

### Issue: Custom domain not working
**Solution:**
1. Verify DNS records updated (can take 24-48 hours)
2. Check Netlify shows domain as active (Domain settings)
3. Update Google Cloud Console:
   - Add your custom domain to authorized origins
   - Add your custom domain to redirect URIs
4. Test with `https://yoursite.netlify.app` first (before custom domain)

## After Deployment

- [ ] Share deployment URL: `https://[yoursite].netlify.app`
- [ ] Test with actual Google account (not just test user)
- [ ] Monitor Netlify Deploys tab for any issues
- [ ] Document your deployment steps for future reference

**For others cloning the repo:**
1. They should create their own `js/config.js` from `js/config.js.example`
2. For Netlify deployment:
   - Connect their own GitHub fork to Netlify
   - Set their own environment variables
   - Update their own Google OAuth credentials

## Netlify Benefits
- ✓ **Free tier** with generous limits
- ✓ **Git integration** - automatic deploys on push
- ✓ **Environment variables** - keep secrets out of git
- ✓ **Easy rollback** - previous deployments accessible
- ✓ **Analytics & monitoring** - built-in
- ✓ **Custom domain** - easy to set up
- ✓ **Fast CDN** - global edge network

## Useful Links
- [Netlify Dashboard](https://app.netlify.com)
- [Google Cloud Console](https://console.cloud.google.com)
- [README.md](README.md) - Full project documentation
- [Netlify Documentation](https://docs.netlify.com)
- [Google Sheets API Docs](https://developers.google.com/sheets/api)
