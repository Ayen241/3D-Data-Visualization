// Load Google Client ID from config.js (not committed to repo for security)
// If config.js doesn't exist, this will fail with a clear error
if (typeof CONFIG === 'undefined') {
    throw new Error('config.js is missing. Copy js/config.js.example to js/config.js and add your credentials.');
}

const GOOGLE_CLIENT_ID = CONFIG.GOOGLE_CLIENT_ID;

// Initialize Google Sign-In
function initializeGoogleSignIn() {
    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
    });

    google.accounts.id.renderButton(
        document.getElementById('buttonDiv'),
        {
            theme: 'filled_blue',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            width: 250
        }
    );
}

// Handle the response from Google Sign-In
function handleCredentialResponse(response) {
    try {
        // Decode the JWT token
        const credential = response.credential;
        const payload = parseJwt(credential);
        
        console.log('User signed in:', payload);
        
        // Store user info in sessionStorage
        sessionStorage.setItem('userEmail', payload.email);
        sessionStorage.setItem('userName', payload.name);
        sessionStorage.setItem('userPicture', payload.picture);
        
        // Redirect to viewer page
        window.location.href = 'viewer.html';
    } catch (error) {
        console.error('Authentication error:', error);
        showError('Authentication failed. Please try again.');
    }
}

// Parse JWT token
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
}

// Initialize when DOM is loaded
window.addEventListener('load', function() {
    // Check if user is already authenticated
    const userEmail = sessionStorage.getItem('userEmail');
    if (userEmail && window.location.pathname.includes('index.html')) {
        window.location.href = 'viewer.html';
        return;
    }
    
    initializeGoogleSignIn();
});