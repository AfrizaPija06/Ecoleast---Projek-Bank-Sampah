/**
 * Skema Tipe Data Multi-Tier Bank Sampah Desa Cicadas (Fase 1)
 *
 * Tingkatan Hierarki:
 * 1. SUPERADMIN_FORUM: Forum Bank Sampah Desa Cicadas (Induk / Koordinasi Desa)
 * 2. ADMIN_UNIT: Pengurus Bank Sampah Unit (Tingkat RW / RT / Dusun)
 * 3. NASABAH: Warga masyarakat terdaftar pada Unit Bank Sampah tertentu
 */

export type UnitStatus = 'pending_review' | 'active' | 'suspended' | 'rejected';

export type UserRoleType = 'superadmin_forum' | 'admin_unit' | 'nasabah' | 'admin';

export interface ForumDesa {
  id: string; // e.g. 'FORUM-DESA-CICADAS'
  nama: string; // 'Forum Bank Sampah Desa Cicadas'
  kodeDesa: string; // '32.01.03.2005'
  kecamatan: string; // 'Gunung Putri'
  kabupaten: string; // 'Kabupaten Bogor'
  provinsi: string; // 'Jawa Barat'
  ketuaForum: string; // 'H. Rahmat Hidayat'
  kontakHp: string; // '0813-1122-3344'
  emailResmi: string; // 'forum.banksampah@cicadas.desa.id'
  alamatSekretariat: string; // 'Kantor Balai Desa Cicadas, Jl. Raya Wanaherang No. 12'
  skPengesahanDesa: string; // 'SK Kades Cicadas No. 147/BS-CCD/2023'
  totalUnitTerdaftar: number;
  totalUnitAktif: number;
  totalNasabahDesa: number;
  totalSampahTerkumpulKg: number;
  status: 'aktif';
}

export interface BankUnitRekening {
  bank: string;
  nomorRekening: string;
  namaPemilik: string;
  saldoKasUnit: number;
}

export interface BankUnit {
  id: string; // e.g. 'UNIT-CCD-001'
  kodeUnit: string; // e.g. 'CCD-U01'
  nama: string; // e.g. 'Bank Sampah Mekar Jaya RW 01'
  rw: string; // 'RW 01'
  rtCoverage: string; // 'RT 01 s/d RT 06'
  ketuaUnit: string; // e.g. 'Hendri Pratama'
  kontakHp: string; // e.g. '0812-8899-0011'
  email: string; // e.g. 'mekarjaya.rw01@cicadas.desa.id'
  alamatPos: string; // 'Balai Warga RT 03 / RW 01, Cicadas'
  status: UnitStatus;
  tanggalPendaftaran: string; // YYYY-MM-DD
  tanggalDisetujui?: string; // YYYY-MM-DD
  disetujuiOleh?: string; // e.g. 'Ketua Forum Desa Cicadas'
  nomorSK?: string; // 'SK.RW.01/BS/2023'
  rekeningKas: BankUnitRekening;
  catatanVerifikasi?: string;
  jumlahNasabah: number;
  totalSampahKg: number;
  aktivitasTerakhir?: string;
  koordinatPeta?: { x: number; y: number; lat?: number; lng?: number };
  wilayahDusun?: string;
}

export interface UserAccount {
  id: string; // e.g. 'USR-001'
  username: string;
  passwordHash: string; // Hash atau mock token
  fullName: string;
  role: UserRoleType;
  unitId?: string; // ID Unit jika ADMIN_UNIT atau NASABAH
  nasabahId?: string; // ID Nasabah jika NASABAH
  status: 'active' | 'pending' | 'suspended';
  email?: string;
  phone?: string;
  avatarUrl?: string;
  avatarInitials: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface NasabahTierRecord {
  id: string; // e.g. 'CCD-U01-0419' (Memiliki kode prefiks unit)
  unitId: string; // Foreign Key ke BankUnit.id
  unitNama: string;
  nama: string;
  nikMasked?: string; // e.g. '320103******0002'
  noTelepon: string;
  alamat: string;
  rt: string;
  rw: string;
  tanggalBergabung: string;
  targetBulananKg: number;
  level: 'Pemula Hijau' | 'Penyelamat Bumi' | 'Pahlawan Lingkungan' | 'Bintang Daur Ulang';
  avatarInitials: string;
  avatarColor: string;
  avatarUrl?: string;
  saldoAktif: number;
  totalSetoranKg: number;
  totalPenarikanRupiah: number;
  pinHash: string; // Default: '123456'
  status: 'aktif' | 'nonaktif';
}

export interface TransaksiSetoranDetail {
  kategoriId: string;
  jenisDetail: string;
  berat: number; // kg atau liter
  satuan: 'kg' | 'liter' | 'buah';
  hargaPerSatuan: number; // Harga yang disetujui unit
  subtotal: number;
}

export interface TransaksiSetoranTier {
  id: string; // e.g. 'TRX-CCD01-202509-001'
  unitId: string; // Foreign Key ke BankUnit
  unitNama: string;
  nasabahId: string; // Foreign Key ke Nasabah
  nasabahNama: string;
  tanggal: string; // YYYY-MM-DD
  jam: string; // HH:mm WIB
  petugasTimbang: string;
  lokasi: string;
  items: TransaksiSetoranDetail[];
  totalBerat: number;
  totalNilai: number;
  status: 'Terverifikasi' | 'Menunggu' | 'Dibatalkan';
  metodePembayaran: 'Masuk Saldo' | 'Tunai Langsung';
  catatan?: string;
}

export interface TransaksiTarikSaldoTier {
  id: string; // e.g. 'WD-CCD01-202509-001'
  unitId: string;
  unitNama: string;
  nasabahId: string;
  nasabahNama: string;
  tanggal: string;
  jam: string;
  nominal: number;
  saldoSebelum: number;
  saldoSesudah: number;
  metode: 'Tunai di Pos' | 'Transfer Bank';
  status: 'Selesai' | 'Menunggu Konfirmasi' | 'Dibatalkan';
  petugas: string;
  catatan?: string;
}

export interface KatalogHargaKomoditasDesa {
  id: string;
  kategoriId: string;
  nama: string;
  deskripsi: string;
  satuan: 'kg' | 'liter' | 'buah';
  hargaRujukanDesa: number; // Plafon referensi Forum Desa Cicadas
  hargaBeliUnitDefault: number; // Standar unit lokal
  syaratMutu: string;
  trenPasar: 'naik' | 'stabil' | 'fluktuatif';
  status: 'aktif' | 'tutup_sementara';
}
