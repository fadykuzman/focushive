/**
 * Google OAuth 2.0 with PKCE Implementation
 * 
 * Secure implementation following Google's best practices and OAuth 2.1 standards.
 * Uses Authorization Code + PKCE flow for maximum security in SPAs.
 */

import { secureStorage } from './secureStorage';

class GoogleAuthManager {
  constructor() {
    this.clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    this.redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/callback`;
    this.scopes = [
      'https://www.googleapis.com/auth/calendar.events.readonly'
    ];
    
    // OAuth endpoints
    this.authUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    this.tokenUrl = 'https://oauth2.googleapis.com/token';
    this.revokeUrl = 'https://oauth2.googleapis.com/revoke';
    this.userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
    
    this.isAuthenticated = false;
    this.currentUser = null;
  }

  // Generate cryptographically secure random string
  generateRandomString(length = 128) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => 
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'[byte % 66]
    ).join('');
  }

  // Generate PKCE code verifier
  generateCodeVerifier() {
    return this.generateRandomString(128);
  }

  // Generate PKCE code challenge
  async generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    
    // Base64URL encode
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  // Generate secure state parameter
  generateState() {
    return this.generateRandomString(32);
  }

  // Build authorization URL
  async buildAuthUrl() {
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    const state = this.generateState();

    // Store PKCE parameters securely
    await secureStorage.storeTokens('google_pkce', {
      code_verifier: codeVerifier,
      state: state,
      created_at: Date.now()
    });

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: this.scopes.join(' '),
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      access_type: 'offline', // For refresh tokens
      prompt: 'consent', // Ensure we get a refresh token
      include_granted_scopes: 'true' // Enable incremental authorization
    });

    return `${this.authUrl}?${params}`;
  }

  // Initiate OAuth flow
  async initiateAuth() {
    try {
      if (!this.clientId) {
        throw new Error('Google Client ID not configured');
      }

      const authUrl = await this.buildAuthUrl();
      
      console.log('[GoogleAuth] Initiating OAuth flow...');
      
      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error('[GoogleAuth] Failed to initiate auth:', error);
      throw new Error('Failed to start Google authentication');
    }
  }

  // Handle OAuth callback
  async handleCallback() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      if (error) {
        console.error('[GoogleAuth] OAuth error:', error);
        throw new Error(`OAuth error: ${error}`);
      }

      if (!code || !state) {
        throw new Error('Missing authorization code or state');
      }

      // Retrieve and validate PKCE parameters
      const pkceData = await secureStorage.getTokens('google_pkce');
      if (!pkceData || pkceData.state !== state) {
        throw new Error('Invalid state parameter - potential CSRF attack');
      }

      // Check PKCE data age (should be recent)
      const age = Date.now() - pkceData.created_at;
      if (age > 10 * 60 * 1000) { // 10 minutes
        throw new Error('OAuth flow expired');
      }

      // Exchange code for tokens
      const tokens = await this.exchangeCodeForTokens(code, pkceData.code_verifier);
      
      // Clean up PKCE data
      await secureStorage.removeTokens('google_pkce');
      
      // Store tokens securely
      await this.storeTokens(tokens);
      
      // Get user info
      const userInfo = await this.getUserInfo(tokens.access_token);
      this.currentUser = userInfo;
      this.isAuthenticated = true;

      console.log('[GoogleAuth] Authentication successful');
      
      return {
        success: true,
        user: userInfo,
        tokens: tokens
      };

    } catch (error) {
      console.error('[GoogleAuth] Callback handling failed:', error);
      
      // Clean up on error
      await secureStorage.removeTokens('google_pkce');
      
      throw error;
    }
  }

  // Exchange authorization code for tokens
  async exchangeCodeForTokens(code, codeVerifier) {
    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        code: code,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Token exchange failed: ${errorData.error_description || response.statusText}`);
    }

    const tokens = await response.json();
    
    // Add expiry timestamp
    if (tokens.expires_in) {
      tokens.expires_at = Math.floor(Date.now() / 1000) + tokens.expires_in;
    }

    return tokens;
  }

  // Store tokens securely
  async storeTokens(tokens) {
    await secureStorage.storeTokens('google_oauth', {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expires_at,
      scope: tokens.scope,
      token_type: tokens.token_type
    });
  }

  // Get stored tokens
  async getStoredTokens() {
    return await secureStorage.getTokens('google_oauth');
  }

  // Refresh access token
  async refreshAccessToken() {
    try {
      const storedTokens = await this.getStoredTokens();
      if (!storedTokens?.refresh_token) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          grant_type: 'refresh_token',
          refresh_token: storedTokens.refresh_token
        })
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const newTokens = await response.json();
      
      // Merge with existing tokens (keep refresh_token if not provided)
      const updatedTokens = {
        ...storedTokens,
        access_token: newTokens.access_token,
        expires_at: Math.floor(Date.now() / 1000) + newTokens.expires_in,
        refresh_token: newTokens.refresh_token || storedTokens.refresh_token
      };

      await this.storeTokens(updatedTokens);
      
      console.log('[GoogleAuth] Token refreshed successfully');
      return updatedTokens;

    } catch (error) {
      console.error('[GoogleAuth] Token refresh failed:', error);
      
      // If refresh fails, clear tokens and require re-auth
      await this.signOut();
      throw error;
    }
  }

  // Get valid access token (auto-refresh if needed)
  async getValidAccessToken() {
    const tokens = await this.getStoredTokens();
    
    if (!tokens) {
      return null;
    }

    // Check if token needs refresh
    if (secureStorage.areTokensExpired(tokens)) {
      try {
        const refreshedTokens = await this.refreshAccessToken();
        return refreshedTokens.access_token;
      } catch (error) {
        return null;
      }
    }

    return tokens.access_token;
  }

  // Get user information
  async getUserInfo(accessToken) {
    const response = await fetch(`${this.userInfoUrl}?access_token=${accessToken}`);
    
    if (!response.ok) {
      throw new Error('Failed to get user info');
    }

    return await response.json();
  }

  // Check authentication status
  async isUserAuthenticated() {
    if (this.isAuthenticated) return true;

    const tokens = await this.getStoredTokens();
    if (!tokens) return false;

    try {
      // Try to get a valid access token
      const accessToken = await this.getValidAccessToken();
      if (accessToken) {
        // Get current user info
        this.currentUser = await this.getUserInfo(accessToken);
        this.isAuthenticated = true;
        return true;
      }
    } catch (error) {
      console.error('[GoogleAuth] Auth check failed:', error);
    }

    return false;
  }

  // Sign out user
  async signOut() {
    try {
      const tokens = await this.getStoredTokens();
      
      // Revoke tokens at Google
      if (tokens?.access_token) {
        try {
          await fetch(`${this.revokeUrl}?token=${tokens.access_token}`, {
            method: 'POST'
          });
        } catch (error) {
          console.warn('[GoogleAuth] Token revocation failed:', error);
        }
      }

      // Clear stored tokens
      await secureStorage.removeTokens('google_oauth');
      
      // Clear state
      this.isAuthenticated = false;
      this.currentUser = null;

      console.log('[GoogleAuth] Sign out successful');

    } catch (error) {
      console.error('[GoogleAuth] Sign out failed:', error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }
}

// Export singleton instance
export const googleAuth = new GoogleAuthManager();