import { LicenseData } from '../types';

const STORAGE_KEY = 'mani_signals_license_auth';
const CUSTOM_KEYS_STORAGE = 'mani_signals_custom_keys';

// Master Authorized Paid VIP Keys
export const MASTER_VIP_KEYS: Array<{ key: string; owner: string; plan: LicenseData['plan']; expiry: string }> = [
  {
    key: 'MANI-VIP-2026-PRO',
    owner: 'Mani Admin VIP (Owner)',
    plan: 'VIP_LIFETIME',
    expiry: '2099-12-31',
  },
  {
    key: 'MANI-PRO-8888-9999',
    owner: 'Verified Master Trader',
    plan: 'VIP_LIFETIME',
    expiry: '2099-12-31',
  },
  {
    key: 'MANI-SIGNALS-AI-PRO',
    owner: 'Amir FX Algorithm Linked',
    plan: 'VIP_LIFETIME',
    expiry: '2099-12-31',
  },
  {
    key: 'KING-RAJAB-VIP-081',
    owner: 'King Rajab (Official)',
    plan: 'VIP_LIFETIME',
    expiry: '2099-12-31',
  },
  {
    key: 'AMIR-FX-MANI-BOT',
    owner: 'Amir FX Bot Licensee',
    plan: 'OTC_MASTER',
    expiry: '2028-12-31',
  },
  {
    key: 'MANI-OTC-9999-WINS',
    owner: 'Pocket Option OTC Pro',
    plan: 'PRO_ANNUAL',
    expiry: '2027-08-30',
  },
];

// Generate consistent device fingerprint
export function getDeviceFingerprint(): string {
  if (typeof window === 'undefined') return 'SRV-001';
  let deviceId = localStorage.getItem('mani_device_hwid');
  if (!deviceId) {
    const raw = navigator.userAgent + navigator.language + screen.width + 'x' + screen.height;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    deviceId = 'HWID-' + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
    localStorage.setItem('mani_device_hwid', deviceId);
  }
  return deviceId;
}

// Get dynamically stored custom keys created by owner
export function getCustomKeys(): Array<{ key: string; owner: string; plan: LicenseData['plan']; expiry: string }> {
  try {
    const raw = localStorage.getItem(CUSTOM_KEYS_STORAGE);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return [];
}

export function saveCustomKey(keyData: { key: string; owner: string; plan: LicenseData['plan']; expiry: string }) {
  const existing = getCustomKeys();
  const filtered = existing.filter((k) => k.key !== keyData.key);
  filtered.push(keyData);
  localStorage.setItem(CUSTOM_KEYS_STORAGE, JSON.stringify(filtered));
}

// Generate new random authorized key
export function generateNewLicenseKey(ownerName: string = 'VIP Trader', plan: LicenseData['plan'] = 'VIP_LIFETIME'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const key = `MANI-${segment()}-${segment()}-${segment()}`;
  
  const expiryDate = new Date();
  if (plan === 'VIP_LIFETIME') {
    expiryDate.setFullYear(expiryDate.getFullYear() + 75);
  } else if (plan === 'PRO_ANNUAL') {
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  } else {
    expiryDate.setMonth(expiryDate.getMonth() + 6);
  }

  saveCustomKey({
    key,
    owner: ownerName,
    plan,
    expiry: expiryDate.toISOString().split('T')[0],
  });

  return key;
}

// Validate Key (Checks Master list + Custom saved list + Algorithm signature)
export function validateLicenseKey(rawInputKey: string): { valid: boolean; license?: LicenseData; message?: string } {
  const cleanKey = rawInputKey.trim().toUpperCase();
  if (!cleanKey) {
    return { valid: false, message: 'Please enter a valid license key.' };
  }

  const allKeys = [...MASTER_VIP_KEYS, ...getCustomKeys()];
  const match = allKeys.find((k) => k.key.toUpperCase() === cleanKey);

  if (match) {
    const license: LicenseData = {
      key: match.key,
      ownerName: match.owner,
      plan: match.plan,
      activatedAt: new Date().toISOString(),
      expiresAt: match.expiry,
      deviceId: getDeviceFingerprint(),
      isValid: true,
    };
    return { valid: true, license };
  }

  // Algorithm signature check: format MANI-XXXX-XXXX-XXXX
  const regex = /^MANI-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  if (regex.test(cleanKey)) {
    const license: LicenseData = {
      key: cleanKey,
      ownerName: 'Licensed VIP Trader',
      plan: 'VIP_LIFETIME',
      activatedAt: new Date().toISOString(),
      expiresAt: '2099-12-31',
      deviceId: getDeviceFingerprint(),
      isValid: true,
    };
    return { valid: true, license };
  }

  return {
    valid: false,
    message: 'Invalid License Key! This BOT is strictly locked. Contact Owner (@ManiAdmin) for official paid license key.',
  };
}

// Save active session
export function saveActiveLicense(license: LicenseData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(license));
}

// Get current session
export function getSavedLicense(): LicenseData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: LicenseData = JSON.parse(raw);
      if (parsed && parsed.isValid && parsed.key) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

// Clear license (Sign out / Lock)
export function revokeLicense() {
  localStorage.removeItem(STORAGE_KEY);
}
