export const LocalStorageKeys = {
  ADMIN_TOKEN: 'andiamo_admin_token',
  ADMIN_SETTINGS: 'andiamo_admin_settings',
};

// Generic getter
export const getItem = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage`, error);
    return null;
  }
};

// Generic setter
export const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error)
{
    console.error(`Error setting item ${key} in localStorage`, error);
  }
};

// Generic remover
export const removeItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage`, error);
  }
};
