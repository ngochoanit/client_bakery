import localforage from 'localforage';
import LOCAL_FORAGE_KEY from 'src/constants/localForageKey';

export async function getLocalForageItem<T>(
  key: LOCAL_FORAGE_KEY,
): Promise<T | null> {
  const value = await localforage.getItem<T>(key);
  return value;
}

export async function setLocalForageItem<T>(
  key: LOCAL_FORAGE_KEY,
  value: T,
): Promise<void> {
  await localforage.setItem(key, value);
  window.dispatchEvent(new Event('storage'));
}

export async function removeLocalForageItem(
  key: LOCAL_FORAGE_KEY,
): Promise<void> {
  await localforage.removeItem(key);
  window.dispatchEvent(new Event('storage'));
}

export default {
  getLocalForageItem,
  setLocalForageItem,
  removeLocalForageItem,
};
