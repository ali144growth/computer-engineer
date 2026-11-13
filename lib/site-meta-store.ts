import { useSyncExternalStore } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

export interface SiteMeta {
  updatedAt: string;
}

const META_STORAGE_KEY = 'ce_portfolio_last_updated_v1';
const META_EVENT_NAME = 'ce_portfolio_last_updated_event';
const META_COLLECTION = 'settings';
const META_DOC_ID = 'meta';

export const DEFAULT_LAST_UPDATED = '2026-10-25T14:30:00.000Z';

const SERVER_META: SiteMeta = { updatedAt: DEFAULT_LAST_UPDATED };
let cachedMeta: SiteMeta = SERVER_META;
let cachedRawMeta: string | null = null;

export function getStoredSiteMeta(): SiteMeta {
  if (typeof window === 'undefined') {
    return SERVER_META;
  }
  try {
    const raw = localStorage.getItem(META_STORAGE_KEY);
    if (!raw) {
      return SERVER_META;
    }
    if (raw === cachedRawMeta) {
      return cachedMeta;
    }
    const parsed = JSON.parse(raw) as SiteMeta;
    if (parsed && typeof parsed.updatedAt === 'string') {
      cachedRawMeta = raw;
      cachedMeta = parsed;
      return parsed;
    }
    return SERVER_META;
  } catch {
    return SERVER_META;
  }
}

export function getServerSiteMeta(): SiteMeta {
  return SERVER_META;
}

function saveLocalSiteMeta(meta: SiteMeta): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = JSON.stringify(meta);
    cachedRawMeta = raw;
    cachedMeta = meta;
    localStorage.setItem(META_STORAGE_KEY, raw);
    window.dispatchEvent(new Event(META_EVENT_NAME));
  } catch (err) {
    console.error('Error saving site metadata:', err);
  }
}

export async function touchSiteUpdatedAt(): Promise<void> {
  const nextMeta: SiteMeta = {
    updatedAt: new Date().toISOString(),
  };
  saveLocalSiteMeta(nextMeta);

  try {
    await setDoc(doc(db, META_COLLECTION, META_DOC_ID), nextMeta);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${META_COLLECTION}/${META_DOC_ID}`);
  }
}

export function subscribeSiteMeta(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleLocalUpdate = () => callback();
  window.addEventListener(META_EVENT_NAME, handleLocalUpdate);
  window.addEventListener('storage', handleLocalUpdate);

  let unsubscribeFirestore = () => {};
  try {
    const metaRef = doc(db, META_COLLECTION, META_DOC_ID);
    unsubscribeFirestore = onSnapshot(
      metaRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as SiteMeta;
          if (data && typeof data.updatedAt === 'string') {
            saveLocalSiteMeta({ updatedAt: data.updatedAt });
            callback();
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `${META_COLLECTION}/${META_DOC_ID}`);
      }
    );
  } catch {
    // Offline or initialization fallback
  }

  return () => {
    window.removeEventListener(META_EVENT_NAME, handleLocalUpdate);
    window.removeEventListener('storage', handleLocalUpdate);
    unsubscribeFirestore();
  };
}

export function useSiteMeta(): SiteMeta {
  return useSyncExternalStore(subscribeSiteMeta, getStoredSiteMeta, getServerSiteMeta);
}
