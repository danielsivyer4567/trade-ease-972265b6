interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  severityFilter: string[];
  locationRadius: number;
  workingHoursOnly: boolean;
  weekendsIncluded: boolean;
  phoneLockedNotifications: boolean;
}

interface WeatherNotification {
  id: string;
  type: 'alert' | 'warning' | 'info' | 'update';
  title: string;
  message: string;
  severity: 'extreme' | 'severe' | 'moderate' | 'minor';
  timestamp: string;
  location: string;
  jobsAffected: string[];
  audioFile?: string;
  persistent: boolean;
}

export class WeatherNotificationService {
  private static instance: WeatherNotificationService;
  private settings: NotificationSettings;
  private audioContext: AudioContext | null = null;
  private notificationQueue: WeatherNotification[] = [];
  private isPlaying = false;

  private constructor() {
    this.settings = this.loadSettings();
    this.initializeAudio();
    this.requestNotificationPermission();
  }

  static getInstance(): WeatherNotificationService {
    if (!WeatherNotificationService.instance) {
      WeatherNotificationService.instance = new WeatherNotificationService();
    }
    return WeatherNotificationService.instance;
  }

  private loadSettings(): NotificationSettings {
    const saved = localStorage.getItem('weatherNotificationSettings');
    if (saved) {
      return JSON.parse(saved);
    }
    
    return {
      enabled: true,
      soundEnabled: true,
      vibrationEnabled: true,
      severityFilter: ['extreme', 'severe', 'moderate'],
      locationRadius: 50,
      workingHoursOnly: false,
      weekendsIncluded: true,
      phoneLockedNotifications: true
    };
  }

  private saveSettings(): void {
    localStorage.setItem('weatherNotificationSettings', JSON.stringify(this.settings));
  }

  private async initializeAudio(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Audio context not supported:', error);
    }
  }

  private async requestNotificationPermission(): Promise<void> {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  /**
   * Send a weather notification
   */
  async sendNotification(notification: WeatherNotification): Promise<void> {
    if (!this.settings.enabled) return;

    // Check if notification should be filtered
    if (!this.shouldSendNotification(notification)) return;

    // Add to queue
    this.notificationQueue.push(notification);

    // Send browser notification
    await this.sendBrowserNotification(notification);

    // Play audio alert
    if (this.settings.soundEnabled) {
      await this.playAudioAlert(notification);
    }

    // Vibrate device
    if (this.settings.vibrationEnabled && 'vibrate' in navigator) {
      this.vibrateDevice(notification.severity);
    }

    // Send push notification (for PWA)
    await this.sendPushNotification(notification);
  }

  private shouldSendNotification(notification: WeatherNotification): boolean {
    // Check severity filter
    if (!this.settings.severityFilter.includes(notification.severity)) {
      return false;
    }

    // Check working hours
    if (this.settings.workingHoursOnly) {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();
      
      // Skip if outside working hours (8 AM - 6 PM)
      if (hour < 8 || hour > 18) {
        return false;
      }
      
      // Skip weekends if not included
      if (!this.settings.weekendsIncluded && (day === 0 || day === 6)) {
        return false;
      }
    }

    return true;
  }

  private async sendBrowserNotification(notification: WeatherNotification): Promise<void> {
    if ('Notification' in window && Notification.permission === 'granted') {
             const options: NotificationOptions = {
         body: notification.message,
         icon: this.getNotificationIcon(notification.severity),
         badge: '/weather-badge.png',
         tag: notification.id,
         requireInteraction: notification.persistent,
         silent: !this.settings.soundEnabled,
         data: {
           notification,
           timestamp: Date.now()
         }
       };

      const browserNotification = new Notification(notification.title, options);
      
      browserNotification.onclick = () => {
        window.focus();
        // Navigate to weather intelligence page
        window.location.href = '/weather-intelligence';
        browserNotification.close();
      };

      // Auto-close after 10 seconds unless persistent
      if (!notification.persistent) {
        setTimeout(() => browserNotification.close(), 10000);
      }
    }
  }

  private async sendPushNotification(notification: WeatherNotification): Promise<void> {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        
        if (subscription) {
                     // Send push notification via service worker
           await registration.showNotification(notification.title, {
             body: notification.message,
             icon: this.getNotificationIcon(notification.severity),
             badge: '/weather-badge.png',
             tag: notification.id,
             requireInteraction: notification.persistent,
             silent: !this.settings.soundEnabled,
             data: notification
           });
        }
      } catch (error) {
        console.warn('Push notification failed:', error);
      }
    }
  }

  private async playAudioAlert(notification: WeatherNotification): Promise<void> {
    if (this.isPlaying || !this.audioContext) return;

    try {
      this.isPlaying = true;
      
      // Choose audio based on severity
      const audioFile = this.getAudioFile(notification.severity);
      
      if (audioFile) {
        const audio = new Audio(audioFile);
        audio.volume = 0.7;
        await audio.play();
        
        // Wait for audio to finish
        audio.onended = () => {
          this.isPlaying = false;
        };
      } else {
        // Generate synthetic beep if no audio file
        await this.generateSyntheticAlert(notification.severity);
      }
    } catch (error) {
      console.warn('Audio alert failed:', error);
      this.isPlaying = false;
    }
  }

  private async generateSyntheticAlert(severity: string): Promise<void> {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // Different frequencies for different severities
    const frequency = this.getAlertFrequency(severity);
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    // Volume envelope
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.5);
    
    // Repeat for severe alerts
    if (severity === 'extreme' || severity === 'severe') {
      setTimeout(() => {
        if (this.audioContext) {
          const oscillator2 = this.audioContext.createOscillator();
          const gainNode2 = this.audioContext.createGain();
          
          oscillator2.connect(gainNode2);
          gainNode2.connect(this.audioContext.destination);
          
          oscillator2.frequency.setValueAtTime(frequency * 1.2, this.audioContext.currentTime);
          gainNode2.gain.setValueAtTime(0, this.audioContext.currentTime);
          gainNode2.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1);
          gainNode2.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
          
          oscillator2.start(this.audioContext.currentTime);
          oscillator2.stop(this.audioContext.currentTime + 0.5);
        }
      }, 600);
    }
    
    setTimeout(() => {
      this.isPlaying = false;
    }, severity === 'extreme' || severity === 'severe' ? 1200 : 600);
  }

  private vibrateDevice(severity: string): void {
    const pattern = this.getVibrationPattern(severity);
    if (pattern) {
      navigator.vibrate(pattern);
    }
  }

  private getNotificationIcon(severity: string): string {
    switch (severity) {
      case 'extreme':
        return '/icons/weather-extreme.png';
      case 'severe':
        return '/icons/weather-severe.png';
      case 'moderate':
        return '/icons/weather-moderate.png';
      default:
        return '/icons/weather-minor.png';
    }
  }

  private getAudioFile(severity: string): string | null {
    // In a real app, these would be actual audio files
    switch (severity) {
      case 'extreme':
        return '/audio/weather-extreme.mp3';
      case 'severe':
        return '/audio/weather-severe.mp3';
      case 'moderate':
        return '/audio/weather-moderate.mp3';
      default:
        return null;
    }
  }

  private getAlertFrequency(severity: string): number {
    switch (severity) {
      case 'extreme':
        return 1000; // High pitch for extreme alerts
      case 'severe':
        return 800;  // Medium-high pitch
      case 'moderate':
        return 600;  // Medium pitch
      default:
        return 400;  // Lower pitch for minor alerts
    }
  }

  private getVibrationPattern(severity: string): number[] {
    switch (severity) {
      case 'extreme':
        return [200, 100, 200, 100, 200]; // Long pulses
      case 'severe':
        return [150, 100, 150]; // Medium pulses
      case 'moderate':
        return [100, 50, 100]; // Short pulses
      default:
        return [50]; // Single short pulse
    }
  }

  /**
   * Update notification settings
   */
  updateSettings(newSettings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  /**
   * Get current notification settings
   */
  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  /**
   * Clear all notifications
   */
  clearNotifications(): void {
    this.notificationQueue = [];
  }

  /**
   * Get notification history
   */
  getNotificationHistory(): WeatherNotification[] {
    return [...this.notificationQueue];
  }

  /**
   * Test notification system
   */
  async testNotification(): Promise<void> {
    const testNotification: WeatherNotification = {
      id: 'test-' + Date.now(),
      type: 'info',
      title: 'Weather Intelligence Test',
      message: 'This is a test notification to verify your weather alert system is working.',
      severity: 'moderate',
      timestamp: new Date().toISOString(),
      location: 'Test Location',
      jobsAffected: [],
      persistent: false
    };

    await this.sendNotification(testNotification);
  }

  /**
   * Check if notifications are supported and enabled
   */
  isNotificationSupported(): boolean {
    return 'Notification' in window && Notification.permission === 'granted';
  }

  /**
   * Check if audio is supported
   */
  isAudioSupported(): boolean {
    return this.audioContext !== null;
  }

  /**
   * Check if vibration is supported
   */
  isVibrationSupported(): boolean {
    return 'vibrate' in navigator;
  }
}

export default WeatherNotificationService; 