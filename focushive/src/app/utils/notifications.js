class BrowserNotifications {
  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'Notification' in window;
    this.permission = this.isSupported ? Notification.permission : 'denied';
  }

  async requestPermission() {
    if (!this.isSupported) return false;
    
    if (this.permission === 'granted') return true;
    
    if (this.permission === 'default') {
      this.permission = await Notification.requestPermission();
    }
    
    return this.permission === 'granted';
  }

  getNotificationContent(mode) {
    switch (mode) {
      case 'focus':
        return {
          title: 'Focus Session Complete!',
          body: 'Time for a break.',
          icon: '/favicon.ico'
        };
      case 'shortBreak':
        return {
          title: 'Short Break Over!',
          body: 'Ready to focus again?',
          icon: '/favicon.ico'
        };
      case 'longBreak':
        return {
          title: 'Long Break Finished!',
          body: "Let's get back to work!",
          icon: '/favicon.ico'
        };
      default:
        return {
          title: 'Timer Complete!',
          body: 'Time to switch modes.',
          icon: '/favicon.ico'
        };
    }
  }

  async showNotification(mode) {
    if (!this.isSupported || this.permission !== 'granted') return false;
    
    const content = this.getNotificationContent(mode);
    
    try {
      const notification = new Notification(content.title, {
        body: content.body,
        icon: content.icon,
        tag: 'focushive-timer',
        requireInteraction: false,
        silent: false
      });

      setTimeout(() => {
        notification.close();
      }, 5000);

      return true;
    } catch (error) {
      console.warn('Failed to show notification:', error);
      return false;
    }
  }

  isPermissionGranted() {
    return this.isSupported && this.permission === 'granted';
  }

  canRequestPermission() {
    return this.isSupported && this.permission === 'default';
  }
}

export const browserNotifications = new BrowserNotifications();