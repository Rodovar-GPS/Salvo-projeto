// ==============================================================================
// 💾 USE OFFLINE STORAGE HOOK — TECNOLOGIA ROTOMA / INDEXEDDB SALVADOR
// ==============================================================================

import { useState, useEffect } from 'react';
import {
  offlineStorageService,
  SALVADOR_OFFLINE_PACKAGES,
  OfflineMapPackage,
} from '../services/salvadorOfflineStorage';

export function useOfflineStorage() {
  const [isOnline, setIsOnline] = useState<boolean>(offlineStorageService.getOnlineStatus());
  const [packages, setPackages] = useState<OfflineMapPackage[]>(SALVADOR_OFFLINE_PACKAGES);

  useEffect(() => {
    const unsub = offlineStorageService.onConnectionChange((online) => {
      setIsOnline(online);
    });
    return () => unsub();
  }, []);

  const downloadPackage = async (packageId: string) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === packageId ? { ...p, downloadProgress: 10 } : p))
    );

    await offlineStorageService.downloadPackage(packageId, (progress) => {
      setPackages((prev) =>
        prev.map((p) =>
          p.id === packageId
            ? {
                ...p,
                downloadProgress: progress,
                isDownloaded: progress >= 100,
                downloadedAt: progress >= 100 ? 'Hoje' : undefined,
              }
            : p
        )
      );
    });
  };

  return {
    isOnline,
    packages,
    downloadPackage,
  };
}
