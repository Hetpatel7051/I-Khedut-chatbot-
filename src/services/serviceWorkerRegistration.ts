// Service Worker Registration and Offline Cache Synchronizer

type NetworkStatusCallback = (isOnline: boolean) => void;

class ServiceWorkerManager {
  private isOnlineStatus: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private listeners: Set<NetworkStatusCallback> = new Set();
  private registration: ServiceWorkerRegistration | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    }
  }

  private handleOnline = () => {
    this.isOnlineStatus = true;
    this.notifyListeners(true);
    console.log('[Network] Farmer connection restored: Online');
  };

  private handleOffline = () => {
    this.isOnlineStatus = false;
    this.notifyListeners(false);
    console.log('[Network] Poor or disconnected connectivity: Offline Mode Activated');
  };

  private notifyListeners(isOnline: boolean) {
    this.listeners.forEach((callback) => {
      try {
        callback(isOnline);
      } catch (err) {
        console.error('Error in network status listener:', err);
      }
    });
  }

  public register(): Promise<ServiceWorkerRegistration | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.log('[ServiceWorker] Service Workers not supported in this browser/environment');
      return Promise.resolve(null);
    }

    return navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        this.registration = reg;
        console.log('[ServiceWorker] iKhedut Offline Service Worker registered with scope:', reg.scope);

        // Check for updates
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[ServiceWorker] New offline scheme dataset content available; refresh to update.');
              }
            };
          }
        };

        return reg;
      })
      .catch((error) => {
        console.warn('[ServiceWorker] Registration failed:', error);
        return null;
      });
  }

  public subscribeNetworkStatus(callback: NetworkStatusCallback): () => void {
    this.listeners.add(callback);
    // Initial emission
    callback(this.isOnlineStatus);

    return () => {
      this.listeners.delete(callback);
    };
  }

  public isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : this.isOnlineStatus;
  }

  // Pre-seed offline cache with scheme dataset
  public cacheSchemesOffline(schemesData: any[]): void {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_SCHEMES_DATA',
        payload: schemesData
      });
    }
  }
}

export const swManager = new ServiceWorkerManager();
