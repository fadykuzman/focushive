import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { browserNotifications } from '../notifications.js';

describe('BrowserNotifications', () => {
  let mockNotification;
  let originalNotification;
  let originalWindow;

  beforeEach(() => {
    originalNotification = global.Notification;
    originalWindow = global.window;
    
    mockNotification = vi.fn();
    mockNotification.requestPermission = vi.fn();
    mockNotification.permission = 'default';
    
    global.window = {
      Notification: mockNotification
    };
    global.Notification = mockNotification;
    
    browserNotifications.permission = 'default';
    browserNotifications.isSupported = true;
  });

  afterEach(() => {
    global.Notification = originalNotification;
    global.window = originalWindow;
    vi.restoreAllMocks();
  });

  describe('requestPermission', () => {
    it('should return true if permission already granted', async () => {
      browserNotifications.permission = 'granted';
      const result = await browserNotifications.requestPermission();
      expect(result).toBe(true);
    });

    it('should request permission if default and return result', async () => {
      mockNotification.requestPermission.mockResolvedValue('granted');
      const result = await browserNotifications.requestPermission();
      expect(mockNotification.requestPermission).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if not supported', async () => {
      browserNotifications.isSupported = false;
      const result = await browserNotifications.requestPermission();
      expect(result).toBe(false);
    });
  });

  describe('getNotificationContent', () => {
    it('should return focus session complete message', () => {
      const content = browserNotifications.getNotificationContent('focus');
      expect(content.title).toBe('Focus Session Complete!');
      expect(content.body).toBe('Time for a break.');
    });

    it('should return short break over message', () => {
      const content = browserNotifications.getNotificationContent('shortBreak');
      expect(content.title).toBe('Short Break Over!');
      expect(content.body).toBe('Ready to focus again?');
    });

    it('should return long break finished message', () => {
      const content = browserNotifications.getNotificationContent('longBreak');
      expect(content.title).toBe('Long Break Finished!');
      expect(content.body).toBe("Let's get back to work!");
    });

    it('should return default message for unknown mode', () => {
      const content = browserNotifications.getNotificationContent('unknown');
      expect(content.title).toBe('Timer Complete!');
      expect(content.body).toBe('Time to switch modes.');
    });
  });

  describe('showNotification', () => {
    beforeEach(() => {
      browserNotifications.permission = 'granted';
      browserNotifications.isSupported = true;
    });

    it('should create notification with correct content', async () => {
      const result = await browserNotifications.showNotification('focus');
      
      expect(mockNotification).toHaveBeenCalledWith(
        'Focus Session Complete!',
        expect.objectContaining({
          body: 'Time for a break.',
          icon: '/favicon.ico',
          tag: 'focushive-timer'
        })
      );
      expect(result).toBe(true);
    });

    it('should return false if permission not granted', async () => {
      browserNotifications.permission = 'denied';
      const result = await browserNotifications.showNotification('focus');
      expect(result).toBe(false);
      expect(mockNotification).not.toHaveBeenCalled();
    });

    it('should return false if not supported', async () => {
      browserNotifications.isSupported = false;
      const result = await browserNotifications.showNotification('focus');
      expect(result).toBe(false);
    });

    it('should handle notification creation errors', async () => {
      mockNotification.mockImplementation(() => {
        throw new Error('Notification failed');
      });
      
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const result = await browserNotifications.showNotification('focus');
      
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to show notification:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });

  describe('permission helpers', () => {
    it('should return true for isPermissionGranted when granted', () => {
      browserNotifications.permission = 'granted';
      browserNotifications.isSupported = true;
      expect(browserNotifications.isPermissionGranted()).toBe(true);
    });

    it('should return false for isPermissionGranted when denied', () => {
      browserNotifications.permission = 'denied';
      expect(browserNotifications.isPermissionGranted()).toBe(false);
    });

    it('should return true for canRequestPermission when default', () => {
      browserNotifications.permission = 'default';
      browserNotifications.isSupported = true;
      expect(browserNotifications.canRequestPermission()).toBe(true);
    });

    it('should return false for canRequestPermission when not supported', () => {
      browserNotifications.isSupported = false;
      expect(browserNotifications.canRequestPermission()).toBe(false);
    });
  });
});