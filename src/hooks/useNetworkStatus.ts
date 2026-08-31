import { useState, useEffect } from 'react';
import { swManager } from '../services/serviceWorkerRegistration';

export interface NetworkStatusInfo {
  isOnline: boolean;
  isOffline: boolean;
  hasCachedData: boolean;
}

export function useNetworkStatus(): NetworkStatusInfo {
  const [isOnline, setIsOnline] = useState<boolean>(swManager.isOnline());
  const [hasCachedData, setHasCachedData] = useState<boolean>(true);

  useEffect(() => {
    // Register service worker on mount
    swManager.register();

    // Subscribe to online/offline network changes
    const unsubscribe = swManager.subscribeNetworkStatus((online) => {
      setIsOnline(online);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    hasCachedData
  };
}
