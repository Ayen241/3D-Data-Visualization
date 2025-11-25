#!/usr/bin/env node
/**
 * Build script to generate config.js from environment variables
 * Runs during Netlify build process
 */

const fs = require('fs');
const path = require('path');

// Get environment variables with defaults
const googleClientId = process.env.GOOGLE_CLIENT_ID || 'your_client_id.apps.googleusercontent.com';
const spreadsheetId = process.env.SPREADSHEET_ID || 'your_spreadsheet_id';
const sheetName = process.env.SHEET_NAME || 'Data Template';
const apiKey = process.env.API_KEY || '';
const usePublicSheet = process.env.USE_PUBLIC_SHEET !== 'false';

// Generate config.js content
const configContent = `// Auto-generated configuration file
// DO NOT commit this file to git

const CONFIG = {
    // Google OAuth Client ID
    GOOGLE_CLIENT_ID: '${googleClientId}',

    // Google Sheets Configuration
    SPREADSHEET_ID: '${spreadsheetId}',
    SHEET_NAME: '${sheetName}',
    API_KEY: '${apiKey}',
    USE_PUBLIC_SHEET: ${usePublicSheet}
};
`;

// Write config.js
const configPath = path.join(__dirname, '../js/config.js');

try {
    fs.writeFileSync(configPath, configContent, 'utf8');
    console.log('✓ config.js generated successfully');
    console.log(`  - Google Client ID: ${googleClientId.substring(0, 20)}...`);
    console.log(`  - Spreadsheet ID: ${spreadsheetId.substring(0, 20)}...`);
    console.log(`  - Sheet Name: ${sheetName}`);
    console.log(`  - Use Public Sheet: ${usePublicSheet}`);
} catch (error) {
    console.error('✗ Failed to generate config.js:', error.message);
    process.exit(1);
}
