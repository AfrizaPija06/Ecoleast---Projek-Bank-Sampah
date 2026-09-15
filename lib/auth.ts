export type UserRole = 'superadmin_forum' | 'admin_unit' | 'nasabah' | 'admin';

export interface AuthSession {
  id: string;
  role: UserRole;
  tierLevel: 1 | 2 | 3; // 1: Forum Desa, 2: Bank Unit, 3: Nasabah
  username: string;
  name: string;
  title: string; // e.g. "Ketua Forum Desa Cicadas", "Pengurus Bank Unit", or "Nasabah"
  unitId?: string; // e.g. 'UNIT-CCD-001' (kosong jika Forum Desa)
  unitKode?: string; // e.g. 'CCD-U01'
  unitBankSampah: string;
  nasabahId?: string; // If role === 'nasabah', maps to Nasabah.id
  avatarUrl?: string;
  avatarInitials: string;
  phone?: string;
  email?: string;
  loginTime: string;
}

// Akun Tingkat 1: Forum Bank Sampah Desa Cicadas (Super Admin)
export const FORUM_SUPERADMIN_CREDENTIALS = {
  username: 'forum.cicadas',
  aliasUsername: 'forum',
  password: 'cicadas123',
  id: 'USR-FORUM-01',
  name: 'H. Rahmat Hidayat',
  title: 'Ketua Forum Bank Sampah Desa Cicadas',
  unitBankSampah: 'Forum Bank Sampah Desa Cicadas (Induk Desa)',
  avatarInitials: 'RH',
  avatarUrl: undefined,
  phone: '0813-1122-3344',
  email: 'forum.banksampah@cicadas.desa.id',
};

// Akun Tingkat 2: Pengurus Bank Sampah Unit RW 01 Mekar Jaya
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  aliasUsername: 'admin.mekarjaya',
  password: 'admin123',
  id: 'ADM-001',
  unitId: 'UNIT-CCD-001',
  unitKode: 'CCD-U01',
  name: 'Hendri Pratama',
  title: 'Pengurus Bank Sampah Unit RW 01',
  unitBankSampah: 'Bank Sampah Mekar Jaya RW 01',
  avatarInitials: 'HP',
  avatarUrl: undefined,
  phone: '0812-8899-0011',
  email: 'mekarjaya.rw01@cicadas.desa.id',
};

// Akun Tingkat 2 Alternatif: Pengurus Bank Sampah Unit RW 02 Berkah Asri
export const UNIT_02_CREDENTIALS = {
  username: 'admin.berkah',
  password: 'berkah123',
  id: 'ADM-002',
  unitId: 'UNIT-CCD-002',
  unitKode: 'CCD-U02',
  name: 'Hj. Siti Aisyah',
  title: 'Pengurus Bank Sampah Unit RW 02',
  unitBankSampah: 'Bank Sampah Berkah Asri RW 02',
  avatarInitials: 'SA',
  avatarUrl: undefined,
  phone: '0813-7722-1100',
  email: 'berkah.asri02@cicadas.desa.id',
};

export const AUTH_STORAGE_KEY = 'bank_sampah_auth_session_v2';

export function getStoredAuthSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function saveAuthSession(session: AuthSession): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
}

export function clearAuthSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
}
