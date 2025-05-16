import { replaceSpotifyWrapper } from './playlist.js';

// Configuration
const clientId = 'a2cc8ad0028c48a7a05cc02a01ca0603';
const redirectUri = window.location.origin + window.location.pathname;
const tokenExpiryKey = 'spotify_token_expiry';
const resultElement = document.getElementById('result');

// Utility functions
function generateRandomString(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    function base64encode(string) {
      return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }
  
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
  
    return base64encode(digest);
}

function showAuthStatus(message, isError = false) {
    if (!resultElement) return;
    
    resultElement.innerHTML = `<div class="text-${isError ? 'red' : 'green'}-600 mt-2">${message}</div>`;
    resultElement.classList.remove(isError ? 'text-green-600' : 'text-red-600');
    resultElement.classList.add(isError ? 'text-red-600' : 'text-green-600');
}

function clearAuthStatus() {
    if (!resultElement) return;
    resultElement.innerHTML = '';
}

// Token management
function isTokenValid() {
    const token = localStorage.getItem('spotify_token');
    const expiry = localStorage.getItem(tokenExpiryKey);
    
    if (!token || !expiry) return false;
    
    // Check if token is expired (with 60 second buffer)
    return parseInt(expiry, 10) > Date.now() + 60000;
}

function setTokenExpiry(expiresIn) {
    // Set expiry time in milliseconds from now
    const expiryTime = Date.now() + (expiresIn * 1000);
    localStorage.setItem(tokenExpiryKey, expiryTime.toString());
}

function clearTokens() {
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem(tokenExpiryKey);
    localStorage.removeItem('code_verifier');
}

// Authentication functions
async function spotifyLogin() {
    try {
        clearAuthStatus();
        
        // Show loading state on button
        const loginButton = document.getElementById('login');
        const originalText = loginButton.innerHTML;
        loginButton.innerHTML = '<svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Connecting...';
        loginButton.disabled = true;
        
        const scope = "playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public";
        const codeVerifier = generateRandomString(128);
        const state = generateRandomString(16);
        
        try {
            const codeChallenge = await generateCodeChallenge(codeVerifier);
            
            localStorage.setItem('code_verifier', codeVerifier);
            
            const args = new URLSearchParams({
                response_type: 'code',
                client_id: clientId,
                scope: scope,
                redirect_uri: redirectUri,
                state: state,
                code_challenge_method: 'S256',
                code_challenge: codeChallenge,
                show_dialog: 'true', // Always show the auth dialog for better UX
            });
            
            window.location = 'https://accounts.spotify.com/authorize?' + args;
        } catch (error) {
            console.error('Error during login preparation:', error);
            showAuthStatus('Failed to prepare Spotify login. Please try again.', true);
            
            // Reset button
            loginButton.innerHTML = originalText;
            loginButton.disabled = false;
        }
    } catch (error) {
        console.error('Unexpected error during login:', error);
    }
}

async function spotifyLoginCallback(code) {
    try {
        const codeVerifier = localStorage.getItem('code_verifier');
        if (!codeVerifier) {
            throw new Error('Code verifier not found. Please try logging in again.');
        }

        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            client_id: clientId,
            code_verifier: codeVerifier,
        });

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error_description || `HTTP error ${response.status}`);
        }

        const data = await response.json();
        
        // Store tokens and expiry
        localStorage.setItem('spotify_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        setTokenExpiry(data.expires_in);
        
        // Clear the URL parameters to avoid issues with refreshing
        window.history.replaceState({}, document.title, redirectUri);
        
        // Update UI
        replaceSpotifyWrapper();
        showAuthStatus('Successfully connected to Spotify!');
        
        // Get user profile to show who's logged in
        try {
            const userResponse = await fetch('https://api.spotify.com/v1/me', {
                headers: {
                    'Authorization': 'Bearer ' + data.access_token
                }
            });
            
            if (userResponse.ok) {
                const userData = await userResponse.json();
                showAuthStatus(`Connected as ${userData.display_name || 'Spotify User'}`);
            }
        } catch (profileError) {
            console.warn('Could not fetch user profile:', profileError);
        }
    } catch (error) {
        console.error('Error during login callback:', error);
        clearTokens();
        showAuthStatus(`Authentication failed: ${error.message}`, true);
    }
}

async function refreshToken() {
    try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const body = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: clientId,
        });

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error_description || `HTTP error ${response.status}`);
        }

        const data = await response.json();
        
        localStorage.setItem('spotify_token', data.access_token);
        setTokenExpiry(data.expires_in);
        
        // Only update refresh token if a new one was provided
        if (data.refresh_token) {
            localStorage.setItem('refresh_token', data.refresh_token);
        }
        
        console.log('Token refreshed successfully');
        return true;
    } catch (error) {
        console.error('Error refreshing token:', error);
        clearTokens();
        showAuthStatus('Your Spotify session has expired. Please log in again.', true);
        return false;
    }
}

// Check and refresh token if needed
async function ensureValidToken() {
    if (isTokenValid()) {
        return true;
    }
    
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
        return await refreshToken();
    }
    
    return false;
}

// Initialize authentication
async function initAuth() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        
        if (error) {
            showAuthStatus(`Spotify login error: ${error}`, true);
            clearTokens();
            return;
        }
        
        if (code) {
            // We have a code from Spotify auth, process it
            await spotifyLoginCallback(code);
        } else if (localStorage.getItem('spotify_token')) {
            // We have a token, check if it's valid or refresh it
            if (!isTokenValid()) {
                await refreshToken();
            }
            
            // Update UI based on authentication state
            if (localStorage.getItem('spotify_token')) {
                replaceSpotifyWrapper();
            }
        }
    } catch (error) {
        console.error('Error during auth initialization:', error);
        showAuthStatus('Failed to initialize authentication', true);
    }
}

// Event listeners
document.getElementById("login").addEventListener("click", spotifyLogin);

// Export functions for use in other modules
export { ensureValidToken, clearTokens, showAuthStatus };

// Initialize authentication on page load
initAuth();
