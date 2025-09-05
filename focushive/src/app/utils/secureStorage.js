/**
 * Secure Token Storage Utility
 * 
 * Uses IndexedDB with encryption for secure token storage in browsers.
 * Follows OWASP and industry best practices for OAuth token security.
 */

class SecureTokenStorage {
  constructor() {
    this.dbName = 'focushive_secure_tokens';
    this.dbVersion = 1;
    this.storeName = 'auth_tokens';
    this.db = null;
  }

  // Initialize IndexedDB
  async init() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('service', 'service', { unique: false });
        }
      };
    });
  }

  // Simple encryption using Web Crypto API
  async encrypt(data) {
    const encoder = new TextEncoder();
    const key = await this.getEncryptionKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(JSON.stringify(data))
    );

    return {
      encrypted: Array.from(new Uint8Array(encrypted)),
      iv: Array.from(iv)
    };
  }

  // Decrypt data
  async decrypt(encryptedData) {
    const decoder = new TextDecoder();
    const key = await this.getEncryptionKey();
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(encryptedData.iv) },
      key,
      new Uint8Array(encryptedData.encrypted)
    );

    return JSON.parse(decoder.decode(decrypted));
  }

  // Generate or retrieve encryption key (stored in memory only)
  async getEncryptionKey() {
    if (this._encryptionKey) return this._encryptionKey;

    // Generate a new key for this session
    this._encryptionKey = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      false, // Non-extractable for security
      ['encrypt', 'decrypt']
    );

    return this._encryptionKey;
  }

  // Store OAuth tokens securely
  async storeTokens(service, tokens) {
    try {
      await this.init();
      
      const encryptedTokens = await this.encrypt({
        ...tokens,
        storedAt: Date.now(),
        service
      });

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      await new Promise((resolve, reject) => {
        const request = store.put({
          id: `${service}_tokens`,
          service,
          data: encryptedTokens,
          timestamp: Date.now()
        });
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      console.log(`[SecureStorage] Tokens stored securely for ${service}`);
    } catch (error) {
      console.error(`[SecureStorage] Failed to store tokens:`, error);
      throw new Error('Failed to store authentication tokens');
    }
  }

  // Retrieve OAuth tokens
  async getTokens(service) {
    try {
      await this.init();
      
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      
      const data = await new Promise((resolve, reject) => {
        const request = store.get(`${service}_tokens`);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      if (!data) return null;

      const decryptedTokens = await this.decrypt(data.data);
      
      // Check if tokens are expired (basic check)
      if (this.areTokensExpired(decryptedTokens)) {
        await this.removeTokens(service);
        return null;
      }

      return decryptedTokens;
    } catch (error) {
      console.error(`[SecureStorage] Failed to retrieve tokens:`, error);
      // If decryption fails, remove corrupted data
      await this.removeTokens(service).catch(() => {});
      return null;
    }
  }

  // Remove stored tokens
  async removeTokens(service) {
    try {
      await this.init();
      
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      await new Promise((resolve, reject) => {
        const request = store.delete(`${service}_tokens`);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      console.log(`[SecureStorage] Tokens removed for ${service}`);
    } catch (error) {
      console.error(`[SecureStorage] Failed to remove tokens:`, error);
    }
  }

  // Check if tokens are expired
  areTokensExpired(tokens) {
    if (!tokens.expires_at) return false;
    
    const now = Date.now();
    const expiryTime = tokens.expires_at * 1000; // Convert to milliseconds
    const bufferTime = 5 * 60 * 1000; // 5 minutes buffer
    
    return now >= (expiryTime - bufferTime);
  }

  // Clear all stored data
  async clearAll() {
    try {
      await this.init();
      
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      await new Promise((resolve, reject) => {
        const request = store.clear();
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      console.log('[SecureStorage] All data cleared');
    } catch (error) {
      console.error('[SecureStorage] Failed to clear data:', error);
    }
  }

  // Clean up expired tokens periodically
  async cleanupExpiredTokens() {
    try {
      await this.init();
      
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const request = store.openCursor();
      const expiredKeys = [];
      
      await new Promise((resolve, reject) => {
        request.onsuccess = async (event) => {
          const cursor = event.target.result;
          if (cursor) {
            try {
              const decryptedData = await this.decrypt(cursor.value.data);
              if (this.areTokensExpired(decryptedData)) {
                expiredKeys.push(cursor.key);
              }
            } catch (error) {
              // If decryption fails, mark for removal
              expiredKeys.push(cursor.key);
            }
            cursor.continue();
          } else {
            resolve();
          }
        };
        
        request.onerror = () => reject(request.error);
      });

      // Remove expired tokens
      for (const key of expiredKeys) {
        await new Promise((resolve, reject) => {
          const deleteRequest = store.delete(key);
          deleteRequest.onsuccess = () => resolve();
          deleteRequest.onerror = () => reject(deleteRequest.error);
        });
      }

      if (expiredKeys.length > 0) {
        console.log(`[SecureStorage] Cleaned up ${expiredKeys.length} expired tokens`);
      }
    } catch (error) {
      console.error('[SecureStorage] Failed to cleanup expired tokens:', error);
    }
  }

  // Security: Clear encryption key from memory
  clearEncryptionKey() {
    this._encryptionKey = null;
  }
}

// Export singleton instance
export const secureStorage = new SecureTokenStorage();

// Cleanup on page unload for security
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    secureStorage.clearEncryptionKey();
  });

  // Periodic cleanup every hour
  setInterval(() => {
    secureStorage.cleanupExpiredTokens().catch(console.error);
  }, 60 * 60 * 1000);
}