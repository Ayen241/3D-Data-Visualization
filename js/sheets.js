// Fetch data from Google Sheets
async function fetchSheetData() {
    try {
        // Show loading message
        document.getElementById('loading').style.display = 'block';
        document.getElementById('error').style.display = 'none';

        let url;
        
        if (CONFIG.USE_PUBLIC_SHEET) {
            // Method 1: Using public sheet (simpler, no API key needed)
            // Export the sheet as CSV
            url = `https://docs.google.com/spreadsheets/d/${CONFIG.SPREADSHEET_ID}/export?format=csv&gid=1081179165`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch data. Make sure the sheet is publicly accessible.');
            }
            
            const csvText = await response.text();
            const data = parseCSV(csvText);
            
            console.log('Data fetched successfully:', data.length, 'rows');
            return data;
            
        } else {
            // Method 2: Using Google Sheets API (requires API key)
            const range = `${CONFIG.SHEET_NAME}!A:F`; // Columns A to F
            url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SPREADSHEET_ID}/values/${range}?key=${CONFIG.API_KEY}`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch data from Google Sheets API');
            }
            
            const result = await response.json();
            const rows = result.values;
            
            if (!rows || rows.length === 0) {
                throw new Error('No data found in the sheet');
            }
            
            // Convert to object array
            const headers = rows[0];
            const data = rows.slice(1).map(row => {
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header.trim()] = row[index] || '';
                });
                return obj;
            });
            
            console.log('Data fetched successfully:', data.length, 'rows');
            return data;
        }
        
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('error').textContent = error.message;
        document.getElementById('error').style.display = 'block';
        document.getElementById('loading').style.display = 'none';
        throw error;
    }
}

// Parse CSV text into array of objects
function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length > 0) {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = values[index] ? values[index].trim().replace(/^"|"$/g, '') : '';
            });
            data.push(obj);
        }
    }
    
    return data;
}

// Parse a single CSV line (handles commas within quotes)
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    values.push(current);
    return values;
}

// Parse net worth string to number
function parseNetWorth(netWorthStr) {
    // Remove $ and commas, then parse
    return parseFloat(netWorthStr.replace(/[$,]/g, ''));
}

// Get color class based on net worth
function getNetWorthColor(netWorthStr) {
    const value = parseNetWorth(netWorthStr);
    
    if (value < 100000) {
        return 'low'; // Red
    } else if (value < 200000) {
        return 'medium'; // Orange
    } else {
        return 'high'; // Green
    }
}