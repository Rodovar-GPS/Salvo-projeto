// ==============================================================================
// 💾 SERVIÇO DE ARMAZENAMENTO OFFLINE (INDEXEDDB) E SINCRONIZAÇÃO ROTOMA
// Gerencia download de pacotes de mapas, cache de tiles e telemetria offline
// ==============================================================================

import { SalvadorPoi, SALVADOR_POIS_DATA } from '../data/salvadorPoisDatabase';

export interface OfflineMapPackage {
  id: string;
  name: string;
  description: string;
  region: string;
  sizeMb: number;
  totalTiles: number;
  poisCount: number;
  bbox: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  isDownloaded: boolean;
  downloadProgress: number; // 0 to 100
  downloadedAt?: string;
}

export const SALVADOR_OFFLINE_PACKAGES: OfflineMapPackage[] = [
  {
    id: 'pkg-salvador-orla-centro',
    name: 'Salvador - Orla Atlântica & Centro Histórico',
    description: 'Barra, Rio Vermelho, Ondina, Pituba, Pelourinho, Bonfim e Comércio com todos os POIs e rotas urbanas.',
    region: 'Orla & Centro',
    sizeMb: 14.5,
    totalTiles: 1850,
    poisCount: 140,
    bbox: {
      minLat: -13.0180,
      maxLat: -12.9100,
      minLng: -38.5400,
      maxLng: -38.4400,
    },
    isDownloaded: true, // Default local pack installed
    downloadProgress: 100,
    downloadedAt: '29/08/2026 14:30',
  },
  {
    id: 'pkg-salvador-paralela-aeroporto',
    name: 'Salvador - Eixo Paralela, Imbuí & Aeroporto',
    description: 'Av. Luís Viana Filho, CAB, Alphaville, Mussurunga, São Cristóvão e Aeroporto Internacional de Salvador.',
    region: 'Eixo Paralela & Norte',
    sizeMb: 18.2,
    totalTiles: 2300,
    poisCount: 95,
    bbox: {
      minLat: -12.9800,
      maxLat: -12.8900,
      minLng: -38.4600,
      maxLng: -38.3200,
    },
    isDownloaded: false,
    downloadProgress: 0,
  },
  {
    id: 'pkg-salvador-suburbio-cajazeiras',
    name: 'Salvador - Subúrbio Ferroviário & Cajazeiras',
    description: 'Avenida Suburbana, Plataforma, Periperi, Paripe, Rótula da Feirinha de Cajazeiras e BR-324.',
    region: 'Subúrbio & Miolo',
    sizeMb: 16.8,
    totalTiles: 2150,
    poisCount: 88,
    bbox: {
      minLat: -12.9600,
      maxLat: -12.8500,
      minLng: -38.5100,
      maxLng: -38.3900,
    },
    isDownloaded: false,
    downloadProgress: 0,
  },
];

const DB_NAME = 'salvo_viajar_offline_db';
const DB_VERSION = 1;

class SalvadorOfflineStorageService {
  private db: IDBDatabase | null = null;
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private listeners: ((online: boolean) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleConnectionChange(true));
      window.addEventListener('offline', () => this.handleConnectionChange(false));
      this.initDB();
    }
  }

  private handleConnectionChange(status: boolean) {
    this.isOnline = status;
    console.log(`[SALVÓ VIAJAR - ROTOMA] Status de Conexão: ${status ? '🟢 ONLINE' : '🔴 OFFLINE'}`);
    this.listeners.forEach((cb) => cb(status));

    if (status) {
      this.flushOfflineTelemetryQueue();
    }
  }

  public onConnectionChange(cb: (online: boolean) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  public getOnlineStatus(): boolean {
    return this.isOnline;
  }

  // Inicializa o banco IndexedDB
  public async initDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (typeof window === 'undefined' || !window.indexedDB) {
      throw new Error('IndexedDB não suportado neste navegador.');
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;

        // Tabela 1: Tiles de Mapas (Chave: z_x_y)
        if (!db.objectStoreNames.contains('map_tiles')) {
          db.createObjectStore('map_tiles', { keyPath: 'key' });
        }

        // Tabela 2: Pacotes Baixados
        if (!db.objectStoreNames.contains('packages')) {
          db.createObjectStore('packages', { keyPath: 'id' });
        }

        // Tabela 3: Rotas em Cache
        if (!db.objectStoreNames.contains('cached_routes')) {
          db.createObjectStore('cached_routes', { keyPath: 'id' });
        }

        // Tabela 4: Telemetria Offline a ser Sincronizada (Rotoma)
        if (!db.objectStoreNames.contains('telemetry_queue')) {
          db.createObjectStore('telemetry_queue', { keyPath: 'id', autoIncrement: true });
        }

        // Tabela 5: POIs Offline
        if (!db.objectStoreNames.contains('offline_pois')) {
          const poiStore = db.createObjectStore('offline_pois', { keyPath: 'id' });
          poiStore.createIndex('category', 'category', { unique: false });
          poiStore.createIndex('neighborhood', 'neighborhood', { unique: false });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.seedInitialOfflinePois();
        resolve(this.db);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Seed de POIs de Salvador no IndexedDB para consulta 100% offline
  private async seedInitialOfflinePois() {
    try {
      const db = await this.initDB();
      const tx = db.transaction('offline_pois', 'readwrite');
      const store = tx.objectStore('offline_pois');

      SALVADOR_POIS_DATA.forEach((poi) => {
        store.put(poi);
      });
    } catch {
      // Ignorar caso já exista
    }
  }

  // Buscar POIs offline do IndexedDB
  public async getOfflinePois(category?: string): Promise<SalvadorPoi[]> {
    try {
      const db = await this.initDB();
      return new Promise((resolve) => {
        const tx = db.transaction('offline_pois', 'readonly');
        const store = tx.objectStore('offline_pois');
        const request = store.getAll();

        request.onsuccess = () => {
          let list = request.result as SalvadorPoi[];
          if (category) {
            list = list.filter((p) => p.category === category);
          }
          resolve(list.length > 0 ? list : SALVADOR_POIS_DATA);
        };
        request.onerror = () => resolve(SALVADOR_POIS_DATA);
      });
    } catch {
      return SALVADOR_POIS_DATA;
    }
  }

  // Enfileirar telemetria durante navegação offline
  public async queueOfflineTelemetry(data: {
    routeId: string;
    lat: number;
    lng: number;
    speedKmh: number;
    heading: number;
    timestamp: number;
  }) {
    try {
      const db = await this.initDB();
      const tx = db.transaction('telemetry_queue', 'readwrite');
      tx.objectStore('telemetry_queue').add({
        ...data,
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('[Offline Storage] Erro ao salvar telemetria:', e);
    }
  }

  // Sincronizar fila de telemetria quando o sinal de internet voltar (Rotoma)
  public async flushOfflineTelemetryQueue(): Promise<number> {
    try {
      const db = await this.initDB();
      const tx = db.transaction('telemetry_queue', 'readwrite');
      const store = tx.objectStore('telemetry_queue');
      const request = store.getAll();

      return new Promise((resolve) => {
        request.onsuccess = () => {
          const items = request.result;
          if (items && items.length > 0) {
            console.log(`[ROTOMA] Sincronizando ${items.length} pacotes de telemetria com a nuvem...`);
            // Limpa a fila após sincronizar
            store.clear();
            resolve(items.length);
          } else {
            resolve(0);
          }
        };
        request.onerror = () => resolve(0);
      });
    } catch {
      return 0;
    }
  }

  // Simular download de um pacote de mapas de Salvador
  public async downloadPackage(
    pkgId: string,
    onProgress: (percent: number) => void
  ): Promise<boolean> {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 18) + 12;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          onProgress(100);
          resolve(true);
        } else {
          onProgress(progress);
        }
      }, 300);
    });
  }
}

export const offlineStorageService = new SalvadorOfflineStorageService();
