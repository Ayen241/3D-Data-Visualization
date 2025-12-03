# 3D Data Visualization Project

A 3D interactive data visualization using Three.js that displays data from Google Sheets with Google authentication.

## Features
- Google OAuth authentication
- Real-time data fetching from Google Sheets
- 4 different 3D layouts: Table (20x10), Sphere, Double Helix, Grid (10×4×5)
- Color-coded tiles based on Net Worth:
  - 🔴 Red: < $100K
  - 🟠 Orange: $100K - $200K
  - 🟢 Green: > $200K
- Interactive 3D navigation (mouse drag to rotate, scroll to zoom)
- Smooth layout animations (5-second transitions)

## Quick Start

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd 3DataVis

# 2. Create config file
cp js/config.js.example js/config.js

# 3. Edit js/config.js with your credentials
# (Get Client ID from Google Cloud, Spreadsheet ID from Google Sheets)

# 4. Run local server
python -m http.server 8080

# 5. Open browser to http://localhost:8080
```

## Prerequisites
- Google Account
- Google Cloud Project with Sheets API enabled
- A web server (local or remote)

## Setup Instructions

### Step 1: Google Sheets Setup

1. **Create Google Sheet:**
   - Go to https://sheets.google.com
   - Create new spreadsheet
   - File → Import → Upload `Data_Template.csv`
   - Choose "Replace spreadsheet"

2. **Share the sheet:**
   - Click "Share" button
   - Add `lisa@kasatria.com` as Editor or Viewer
   - Click "General access" → "Anyone with the link" → "Viewer"
   - **Copy the Spreadsheet ID** from URL:
     ```
     https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
     ```

### Step 2: Google Cloud Console Setup

1. **Create Project:**
   - Go to https://console.cloud.google.com/
   - Click "Select a project" → "New Project"
   - Name it "3D Data Visualization"
   - Click "Create"

2. **Enable Google Sheets API:**
   - Go to "APIs & Services" → "Library"
   - Search "Google Sheets API"
   - Click "Enable"

3. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   
   **If prompted to configure consent screen:**
   - Click "Configure Consent Screen"
   - Choose "External"
   - Fill in:
     - App name: "3D Data Visualization"
     - User support email: (your email)
     - Developer contact: (your email)
   - Click "Save and Continue" (skip Scopes)
   - Add test users (your email)
   - Click "Save and Continue"
   
   **Create OAuth Client ID:**
   - Application type: "Web application"
   - Name: "3D Viz Client"
   - Authorized JavaScript origins:
     - `http://localhost:8080` (for local testing)
     - Add your production domain later
   - Authorized redirect URIs:
     - `http://localhost:8080`
   - Click "Create"
   - **Copy the Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)

### Step 3: Configure the Application

1. **Create `js/config.js` from the template:**
   ```bash
   cp js/config.js.example js/config.js
   ```

2. **Edit `js/config.js` and add your credentials:**
   ```javascript
   const CONFIG = {
       GOOGLE_CLIENT_ID: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
       SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID_HERE',
       SHEET_NAME: 'Data Template',
       API_KEY: '', // Optional: only needed if using Google Sheets API
       USE_PUBLIC_SHEET: true // Set to true if sheet is publicly accessible
   };
   ```

3. **⚠️ Important Security Note:**
   - `js/config.js` is **NOT tracked by git** (listed in `.gitignore`)
   - Never commit your actual credentials to the repository
   - Only commit `js/config.js.example` with placeholder values

### Step 4: Run the Application

**Option A: Using Python (Recommended)**
```bash
# Navigate to project directory
cd /path/to/project

# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

**Option B: Using Node.js**
```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server -p 8080
```

**Option C: Using PHP**
```bash
php -S localhost:8080
```

**Option D: Using VS Code Live Server**
- Install "Live Server" extension
- Right-click `index.html`
- Click "Open with Live Server"

### Step 5: Access the Application

1. Open browser: `http://localhost:8080`
2. Click "Sign in with Google"
3. Authenticate with your Google account
4. You'll be redirected to the 3D visualization

### Step 6: Use the Application

**Controls:**
- Click buttons to switch layouts: TABLE | SPHERE | HELIX | GRID
- **Mouse drag**: Rotate view
- **Mouse scroll**: Zoom in/out
- **Hover over tiles**: Highlight effect

## Troubleshooting

### Issue: "config.js is missing" error
**Solution:**
- Create `js/config.js` from the template: `cp js/config.js.example js/config.js`
- Never commit `js/config.js` to git (it's in `.gitignore` for security)
- Only `js/config.js.example` should be in version control

### Issue: "Failed to fetch data"
**Solution:**
- Verify Spreadsheet ID is correct in `js/config.js`
- Make sure sheet is set to "Anyone with the link can view"
- Verify sheet name matches `CONFIG.SHEET_NAME` in `js/config.js`
- Check browser console (F12) for error details
- Ensure your data starts from row 1 (no header row above column headers)

### Issue: Google Sign-In not working
**Solution:**
- Verify `GOOGLE_CLIENT_ID` is correct in `js/config.js`
- Check authorized JavaScript origins in Google Cloud Console match your domain
- Make sure you're accessing via `http://localhost:8080` (not `file://`)
- Verify test user email is added in Google Cloud Console OAuth consent screen
- Clear browser cache and cookies, try incognito mode

### Issue: CORS errors
**Solution:**
- Must use a web server (cannot open `file://` directly in browser)
- Use one of the server options from Quick Start section
- For GitHub Pages, ensure your OAuth origins are updated to your GitHub Pages URL

### Issue: Data not displaying in 3D view
**Solution:**
- Open browser console (F12) and check for JavaScript errors
- Verify CSV data format matches expected columns
- Check that all required columns exist: Name, Photo, Age, Country, Interest, Net Worth
- Verify `Net Worth` format is `$XXX,XXX.XX` (with dollar sign and commas)
- Ensure photos are valid image URLs

## Project Structure

```
3DataVis/
├── index.html                  # Login page
├── viewer.html                 # 3D visualization page
├── .gitignore                  # Git ignore configuration
├── .env.example                # Environment variables template
├── netlify.toml                # Netlify deployment config
├── README.md                   # This file
├── css/
│   └── style.css              # Styles for both pages
├── js/
│   ├── config.js              # Configuration (local, NOT in git)
│   ├── config.js.example      # Configuration template (in git)
│   ├── auth.js                # Google OAuth authentication
│   ├── sheets.js              # Data fetching from Google Sheets
│   └── visualization.js       # Three.js 3D visualization
├── scripts/
│   └── build-config.js        # Build script to generate config.js
```

## Technical Details

**Libraries Used:**
- Three.js r128 - 3D rendering
- CSS3DRenderer - CSS-based 3D objects
- Google Identity Services - OAuth authentication
- Tween.js (embedded) - Smooth animations

**Layout Specifications:**
- **Table**: 20 columns × 10 rows
- **Sphere**: Fibonacci sphere distribution
- **Helix**: Double helix with offset spirals
- **Grid**: 10 × 4 × 5 (width × height × depth)

**Color Coding:**
- Red: Net Worth < $100,000
- Orange: Net Worth $100,000 - $200,000
- Green: Net Worth > $200,000

## Deployment to Production

⚠️ **IMPORTANT: Before pushing to GitHub, ensure `js/config.js` is NOT committed**
- Verify `.gitignore` includes `config.js`
- Only `js/config.js.example` should be in the repository

### For Netlify (Recommended) 🚀

**See [DEPLOYMENT_NETLIFY.md](DEPLOYMENT_NETLIFY.md) for a complete step-by-step checklist with troubleshooting.**

**Quick Overview:**

**Step 1: Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

**Step 2: Connect to Netlify**
1. Go to [netlify.com](https://netlify.com) and sign up (use GitHub)
2. Click "New site from Git"
3. Select GitHub and authorize Netlify
4. Select your repository (`3DataVis`)
5. **Important:** Keep these settings:
   - Build command: (leave empty - we use `netlify.toml`)
   - Publish directory: `.` (current directory)
6. Click "Deploy site"
7. Wait 1-2 minutes for deployment - you'll get a URL like `https://3datavis.netlify.app`

**Step 3: Add Environment Variables in Netlify**
1. In Netlify dashboard, go to Site Settings → "Build & Deploy" → "Environment"
2. Click "Edit variables"
3. Add these variables:
   - `GOOGLE_CLIENT_ID` = `your_client_id.apps.googleusercontent.com`
   - `SPREADSHEET_ID` = `your_spreadsheet_id`
   - `SHEET_NAME` = `Data Template`
   - `USE_PUBLIC_SHEET` = `true`
4. Click "Save"

**Step 4: Trigger Build with Environment Variables**
1. Go back to "Deployments" tab
2. Click "Trigger Deploy" → "Deploy site"
3. Netlify will run `scripts/build-config.js` and generate `config.js` from your environment variables

**Step 5: Update Google Cloud Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Go to APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Update authorized origins and redirect URIs:
   - Remove: `http://localhost:8080`
   - Add: `https://3datavis.netlify.app`
5. Click "Save"

**Step 6: Test Your Deployment**
1. Visit `https://3datavis.netlify.app`
2. Click "Sign in with Google"
3. Verify the 3D visualization loads
4. Test all layouts: TABLE, SPHERE, HELIX, GRID

**Connecting Custom Domain (Optional)**
1. Buy a domain (Namecheap, GoDaddy, etc.)
2. In Netlify, go to Site Settings → Domain management
3. Add your custom domain
4. Update DNS records as shown by Netlify
5. Update Google Cloud Console to include your custom domain

**How It Works:**
- `netlify.toml` tells Netlify to run `scripts/build-config.js` during build
- The script reads environment variables from Netlify dashboard
- It generates `config.js` with your credentials
- Credentials never get committed to git!

**Troubleshooting:**
- **"config.js is missing" error:** Trigger a new deploy in Netlify dashboard
- **Google Sign-In fails:** Check that authorized origins in Google Cloud match your Netlify domain
- **Build fails:** Check "Deploys" tab → click failed deploy → "Deploy log" for error details
- **Data not loading:** Verify `SPREADSHEET_ID` and `SHEET_NAME` in environment variables

### For GitHub Pages:
1. Create `js/config.js` locally from `js/config.js.example`
2. Verify `js/config.js` is in `.gitignore`
3. Push code to GitHub repository (config.js will NOT be included)
4. Go to Settings → Pages
5. Select branch and save
6. Update Google Cloud Console:
   - Add `https://yourusername.github.io` to authorized origins in OAuth consent screen
   - Add `https://yourusername.github.io` to authorized redirect URIs
7. Users cloning the repo must:
   - Copy `js/config.js.example` to `js/config.js`
   - Add their own Google Client ID and Spreadsheet ID

### For Custom Domain:
1. Create `js/config.js` locally from `js/config.js.example`
2. Verify `js/config.js` is in `.gitignore`
3. Upload files to your web server (don't upload `js/config.js` - upload `js/config.js.example` instead)
4. On the server, copy `js/config.js.example` to `js/config.js` and add credentials
5. Update Google Cloud Console:
   - Add `https://yourdomain.com` to authorized origins
   - Add `https://yourdomain.com` to redirect URIs

## Data Format

CSV must have these columns:
- Name
- Photo (URL)
- Age
- Country
- Interest
- Net Worth (format: $XXX,XXX.XX)

## Browser Support

- Chrome/Edge (Recommended)
- Firefox
- Safari
- Modern browsers with WebGL support

## License

This project is for educational purposes.

## Support

If you encounter issues:
1. Check browser console (F12) for detailed error messages
2. Verify all configuration values in `js/config.js` are correct
3. Ensure Google Sheet is publicly accessible
4. Test with incognito/private browsing mode to bypass cache issues
