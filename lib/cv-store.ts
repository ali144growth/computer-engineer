import { useSyncExternalStore } from 'react';
import { doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { touchSiteUpdatedAt } from './site-meta-store';

export interface CvDocument {
  fileName: string;
  mimeType: string;
  fileSize: number;
  dataUrl: string;
  updatedAt: string;
}

const CV_STORAGE_KEY = 'ce_portfolio_cv_v1';
const CV_EVENT_NAME = 'ce_portfolio_cv_updated';
const CV_COLLECTION = 'settings';
const CV_DOC_ID = 'cv';

export const MAX_CV_FILE_SIZE = 700 * 1024; // 700 KB (fits safely inside 1 MiB Firestore document limit)

let cachedCv: CvDocument | null = null;
let cachedRawCv: string | null = null;

export function getStoredCv(): CvDocument | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = localStorage.getItem(CV_STORAGE_KEY);
    if (!raw) {
      cachedRawCv = null;
      cachedCv = null;
      return null;
    }
    if (raw === cachedRawCv) {
      return cachedCv;
    }
    const parsed = JSON.parse(raw) as CvDocument;
    if (parsed && typeof parsed.fileName === 'string' && typeof parsed.dataUrl === 'string') {
      cachedRawCv = raw;
      cachedCv = parsed;
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function getServerCv(): CvDocument | null {
  return null;
}

function saveLocalCv(cv: CvDocument | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!cv) {
      localStorage.removeItem(CV_STORAGE_KEY);
      cachedRawCv = null;
      cachedCv = null;
    } else {
      const raw = JSON.stringify(cv);
      cachedRawCv = raw;
      cachedCv = cv;
      localStorage.setItem(CV_STORAGE_KEY, raw);
    }
    window.dispatchEvent(new Event(CV_EVENT_NAME));
  } catch (err) {
    console.error('Error saving local CV document:', err);
  }
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL.'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('FileReader error'));
    reader.readAsDataURL(file);
  });
}

export async function saveCvDocument(file: File): Promise<CvDocument> {
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const lowerName = file.name.toLowerCase();
  const hasAllowedExt = allowedExtensions.some((ext) => lowerName.endsWith(ext));

  if (!hasAllowedExt) {
    throw new Error('INVALID_TYPE');
  }

  if (file.size <= 0 || file.size > MAX_CV_FILE_SIZE) {
    throw new Error('FILE_TOO_LARGE');
  }

  const dataUrl = await readFileAsDataUrl(file);
  const cvDoc: CvDocument = {
    fileName: file.name.slice(0, 255),
    mimeType: (file.type || 'application/octet-stream').slice(0, 128),
    fileSize: file.size,
    dataUrl,
    updatedAt: new Date().toISOString(),
  };

  // Optimistic local save
  saveLocalCv(cvDoc);

  // Persist to Firestore
  try {
    await setDoc(doc(db, CV_COLLECTION, CV_DOC_ID), cvDoc);
    await touchSiteUpdatedAt();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${CV_COLLECTION}/${CV_DOC_ID}`);
  }

  return cvDoc;
}

export async function deleteCvDocument(): Promise<void> {
  saveLocalCv(null);

  try {
    await deleteDoc(doc(db, CV_COLLECTION, CV_DOC_ID));
    await touchSiteUpdatedAt();
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${CV_COLLECTION}/${CV_DOC_ID}`);
  }
}

export function subscribeCv(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleLocalUpdate = () => callback();
  window.addEventListener(CV_EVENT_NAME, handleLocalUpdate);
  window.addEventListener('storage', handleLocalUpdate);

  let unsubscribeFirestore = () => {};
  try {
    const cvRef = doc(db, CV_COLLECTION, CV_DOC_ID);
    unsubscribeFirestore = onSnapshot(
      cvRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as CvDocument;
          if (data && data.fileName && data.dataUrl) {
            saveLocalCv(data);
            callback();
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `${CV_COLLECTION}/${CV_DOC_ID}`);
      }
    );
  } catch {
    // Offline or non-fatal initialization issue
  }

  return () => {
    window.removeEventListener(CV_EVENT_NAME, handleLocalUpdate);
    window.removeEventListener('storage', handleLocalUpdate);
    unsubscribeFirestore();
  };
}

export function useCv(): CvDocument | null {
  return useSyncExternalStore(subscribeCv, getStoredCv, getServerCv);
}
