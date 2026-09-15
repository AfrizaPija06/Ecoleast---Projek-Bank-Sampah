-- ====================================================================
-- SKEMA DATABASE RELASIONAL SISTEM BANK SAMPAH TERPADU DESA CICADAS
-- Format: PostgreSQL / Google Cloud SQL / Supabase
-- Fase 1: Fondasi Skema Database & Hierarki Akun 3 Tingkat
-- ====================================================================

-- 1. Ekstensi UUID (jika diperlukan untuk kunci primer acak)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- TABEL 1: FORUM_DESA (Tingkat 1 - Super Admin / Induk Desa)
-- ====================================================================
CREATE TABLE IF NOT EXISTS forum_desa (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'FORUM-DESA-CICADAS',
    nama_forum VARCHAR(150) NOT NULL DEFAULT 'Forum Bank Sampah Desa Cicadas',
    kode_desa VARCHAR(20) NOT NULL DEFAULT '32.01.03.2005',
    kecamatan VARCHAR(100) NOT NULL DEFAULT 'Gunung Putri',
    kabupaten VARCHAR(100) NOT NULL DEFAULT 'Kabupaten Bogor',
    provinsi VARCHAR(100) NOT NULL DEFAULT 'Jawa Barat',
    ketua_forum VARCHAR(100) NOT NULL,
    kontak_hp VARCHAR(30) NOT NULL,
    email_resmi VARCHAR(100) NOT NULL,
    alamat_sekretariat TEXT NOT NULL,
    sk_pengesahan_desa VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- TABEL 2: BANK_UNIT (Tingkat 2 - Unit-Unit Bank Sampah Tingkat RW/RT)
-- ====================================================================
CREATE TABLE IF NOT EXISTS bank_unit (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'UNIT-CCD-001'
    kode_unit VARCHAR(20) UNIQUE NOT NULL, -- e.g. 'CCD-U01'
    nama_unit VARCHAR(150) NOT NULL, -- e.g. 'Bank Sampah Mekar Jaya RW 01'
    rw VARCHAR(10) NOT NULL, -- 'RW 01'
    rt_coverage VARCHAR(100) NOT NULL, -- 'RT 01 s/d RT 06'
    ketua_unit VARCHAR(100) NOT NULL,
    kontak_hp VARCHAR(30) NOT NULL,
    email VARCHAR(100),
    alamat_pos TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending_review' 
        CHECK (status IN ('pending_review', 'active', 'suspended', 'rejected')),
    nomor_sk VARCHAR(100),
    bank_nama VARCHAR(50) DEFAULT 'Bank BJB / BRI',
    bank_rekening VARCHAR(50),
    bank_atas_nama VARCHAR(100),
    saldo_kas_unit NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    tanggal_pendaftaran DATE NOT NULL DEFAULT CURRENT_DATE,
    tanggal_disetujui DATE,
    disetujui_oleh VARCHAR(100),
    catatan_verifikasi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bank_unit_status ON bank_unit(status);
CREATE INDEX IF NOT EXISTS idx_bank_unit_rw ON bank_unit(rw);

-- ====================================================================
-- TABEL 3: USER_ACCOUNT (Otentikasi & Akun Pengguna 3-Tier)
-- ====================================================================
CREATE TABLE IF NOT EXISTS user_account (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    role VARCHAR(30) NOT NULL 
        CHECK (role IN ('SUPERADMIN_FORUM', 'ADMIN_UNIT', 'NASABAH')),
    unit_id VARCHAR(50) REFERENCES bank_unit(id) ON DELETE SET NULL,
    nasabah_id VARCHAR(50), -- Map ke tabel nasabah jika role NASABAH
    status VARCHAR(20) NOT NULL DEFAULT 'active' 
        CHECK (status IN ('active', 'pending', 'suspended')),
    email VARCHAR(100),
    phone VARCHAR(30),
    avatar_url TEXT,
    avatar_initials VARCHAR(5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_user_role ON user_account(role);
CREATE INDEX IF NOT EXISTS idx_user_unit ON user_account(unit_id);

-- ====================================================================
-- TABEL 4: NASABAH (Tingkat 3 - Warga Terdaftar di Suatu Bank Unit)
-- ====================================================================
CREATE TABLE IF NOT EXISTS nasabah (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'CCD-U01-0419' (Prefix kode unit)
    unit_id VARCHAR(50) NOT NULL REFERENCES bank_unit(id) ON DELETE RESTRICT,
    nik_hash VARCHAR(64), -- Hashed NIK untuk privasi warga
    nik_masked VARCHAR(20), -- e.g. '320103******0002'
    nama VARCHAR(120) NOT NULL,
    no_telepon VARCHAR(30) NOT NULL,
    alamat TEXT NOT NULL,
    rt VARCHAR(10),
    rw VARCHAR(10),
    tanggal_bergabung DATE NOT NULL DEFAULT CURRENT_DATE,
    target_bulanan_kg NUMERIC(6, 2) DEFAULT 20.00,
    level_kategori VARCHAR(50) DEFAULT 'Pemula Hijau' 
        CHECK (level_kategori IN ('Pemula Hijau', 'Penyelamat Bumi', 'Pahlawan Lingkungan', 'Bintang Daur Ulang')),
    saldo_aktif NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    total_setoran_kg NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_penarikan_rupiah NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    pin_hash VARCHAR(255) NOT NULL DEFAULT '123456',
    status VARCHAR(20) NOT NULL DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
    avatar_url TEXT,
    avatar_initials VARCHAR(5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_nasabah_unit ON nasabah(unit_id);
CREATE INDEX IF NOT EXISTS idx_nasabah_nama ON nasabah(nama);

-- ====================================================================
-- TABEL 5: KATALOG_KOMODITAS_DESA (Standar Harga Acuan Forum Desa)
-- ====================================================================
CREATE TABLE IF NOT EXISTS katalog_komoditas_desa (
    id VARCHAR(50) PRIMARY KEY,
    kategori_id VARCHAR(50) NOT NULL, -- plastik, kertas, logam, kaca, minyak_jelantah, elektronik
    nama VARCHAR(100) NOT NULL,
    satuan VARCHAR(20) NOT NULL DEFAULT 'kg' CHECK (satuan IN ('kg', 'liter', 'buah')),
    harga_rujukan_desa NUMERIC(12, 2) NOT NULL, -- Rekomendasi plafon Forum Desa
    harga_beli_unit_default NUMERIC(12, 2) NOT NULL, -- Standar beli lokal unit
    syarat_mutu TEXT,
    tren_pasar VARCHAR(20) DEFAULT 'stabil' CHECK (tren_pasar IN ('naik', 'stabil', 'fluktuatif')),
    status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'tutup_sementara')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- TABEL 6: TRANSAKSI_SETORAN (Pencatatan Penimbangan Sampah)
-- ====================================================================
CREATE TABLE IF NOT EXISTS transaksi_setoran (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'TRX-CCD01-202509-001'
    unit_id VARCHAR(50) NOT NULL REFERENCES bank_unit(id) ON DELETE RESTRICT,
    nasabah_id VARCHAR(50) NOT NULL REFERENCES nasabah(id) ON DELETE RESTRICT,
    tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    jam VARCHAR(20) NOT NULL,
    petugas_timbang VARCHAR(100) NOT NULL,
    lokasi VARCHAR(150) NOT NULL,
    total_berat_kg NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_nilai_rupiah NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    metode_pembayaran VARCHAR(30) NOT NULL DEFAULT 'Masuk Saldo' 
        CHECK (metode_pembayaran IN ('Masuk Saldo', 'Tunai Langsung')),
    status VARCHAR(20) NOT NULL DEFAULT 'Terverifikasi' 
        CHECK (status IN ('Terverifikasi', 'Menunggu', 'Dibatalkan')),
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transaksi_unit ON transaksi_setoran(unit_id);
CREATE INDEX IF NOT EXISTS idx_transaksi_nasabah ON transaksi_setoran(nasabah_id);
CREATE INDEX IF NOT EXISTS idx_transaksi_tanggal ON transaksi_setoran(tanggal);

-- ====================================================================
-- TABEL 7: TRANSAKSI_SETORAN_DETAIL (Rincian Item Sampah per Transaksi)
-- ====================================================================
CREATE TABLE IF NOT EXISTS transaksi_setoran_detail (
    id SERIAL PRIMARY KEY,
    setoran_id VARCHAR(50) NOT NULL REFERENCES transaksi_setoran(id) ON DELETE CASCADE,
    kategori_id VARCHAR(50) NOT NULL,
    jenis_detail VARCHAR(100) NOT NULL,
    berat NUMERIC(8, 2) NOT NULL,
    satuan VARCHAR(20) NOT NULL,
    harga_per_satuan NUMERIC(12, 2) NOT NULL,
    subtotal NUMERIC(15, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_setoran_detail_fk ON transaksi_setoran_detail(setoran_id);

-- ====================================================================
-- TABEL 8: TRANSAKSI_TARIK_SALDO (Penarikan Uang Tabungan Nasabah)
-- ====================================================================
CREATE TABLE IF NOT EXISTS transaksi_tarik_saldo (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'WD-CCD01-202509-001'
    unit_id VARCHAR(50) NOT NULL REFERENCES bank_unit(id) ON DELETE RESTRICT,
    nasabah_id VARCHAR(50) NOT NULL REFERENCES nasabah(id) ON DELETE RESTRICT,
    tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    jam VARCHAR(20) NOT NULL,
    nominal NUMERIC(15, 2) NOT NULL,
    saldo_sebelum NUMERIC(15, 2) NOT NULL,
    saldo_sesudah NUMERIC(15, 2) NOT NULL,
    metode VARCHAR(30) NOT NULL DEFAULT 'Tunai di Pos' 
        CHECK (metode IN ('Tunai di Pos', 'Transfer Bank')),
    status VARCHAR(30) NOT NULL DEFAULT 'Selesai' 
        CHECK (status IN ('Selesai', 'Menunggu Konfirmasi', 'Dibatalkan')),
    petugas VARCHAR(100) NOT NULL,
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tarik_unit ON transaksi_tarik_saldo(unit_id);
CREATE INDEX IF NOT EXISTS idx_tarik_nasabah ON transaksi_tarik_saldo(nasabah_id);

-- ====================================================================
-- DATA AWAL (INITIAL SEED DATA)
-- ====================================================================

-- 1. Forum Desa Cicadas
INSERT INTO forum_desa (
    id, nama_forum, kode_desa, kecamatan, kabupaten, provinsi,
    ketua_forum, kontak_hp, email_resmi, alamat_sekretariat, sk_pengesahan_desa
) VALUES (
    'FORUM-DESA-CICADAS',
    'Forum Bank Sampah Desa Cicadas',
    '32.01.03.2005',
    'Gunung Putri',
    'Kabupaten Bogor',
    'Jawa Barat',
    'H. Rahmat Hidayat',
    '0813-1122-3344',
    'forum.banksampah@cicadas.desa.id',
    'Kantor Balai Desa Cicadas, Jl. Raya Wanaherang No. 12',
    'SK Kades Cicadas No. 147/BS-CCD/2023'
) ON CONFLICT (id) DO NOTHING;

-- 2. Bank Sampah Unit Contoh
INSERT INTO bank_unit (
    id, kode_unit, nama_unit, rw, rt_coverage, ketua_unit, kontak_hp, email,
    alamat_pos, status, nomor_sk, saldo_kas_unit, tanggal_pendaftaran, tanggal_disetujui, disetujui_oleh
) VALUES 
(
    'UNIT-CCD-001',
    'CCD-U01',
    'Bank Sampah Mekar Jaya RW 01',
    'RW 01',
    'RT 01 - RT 06',
    'Hendri Pratama',
    '0812-8899-0011',
    'mekarjaya.rw01@cicadas.desa.id',
    'Balai Pertemuan RW 01, Desa Cicadas',
    'active',
    'SK.RW01/BS/2023',
    4250000.00,
    '2023-01-10',
    '2023-01-15',
    'H. Rahmat Hidayat (Ketua Forum Desa Cicadas)'
),
(
    'UNIT-CCD-002',
    'CCD-U02',
    'Bank Sampah Berkah Asri RW 02',
    'RW 02',
    'RT 01 - RT 05',
    'Hj. Siti Aisyah',
    '0813-7722-1100',
    'berkah.asri02@cicadas.desa.id',
    'Pos RW 02 Kp. Cicadas Hilir',
    'active',
    'SK.RW02/BS/2023',
    2800000.00,
    '2023-03-05',
    '2023-03-10',
    'H. Rahmat Hidayat (Ketua Forum Desa Cicadas)'
),
(
    'UNIT-CCD-003',
    'CCD-U03',
    'Bank Sampah Hijau Lestari RW 03',
    'RW 03',
    'RT 01 - RT 04',
    'Drs. Mulyadi',
    '0856-9922-3311',
    'mulyadi.rw03@cicadas.desa.id',
    'Balai Serbaguna RW 03',
    'pending_review',
    'SK.RW03/BS/2024',
    0.00,
    '2024-08-20',
    NULL,
    NULL
) ON CONFLICT (id) DO NOTHING;

-- 3. Akun Pengguna Contoh (Otentikasi 3 Tingkat)
INSERT INTO user_account (
    id, username, password_hash, full_name, role, unit_id, status, email, phone, avatar_initials
) VALUES 
(
    'USR-FORUM-01',
    'forum.cicadas',
    'cicadas123', -- Catatan: Di production menggunakan bcrypt/argon2
    'H. Rahmat Hidayat',
    'SUPERADMIN_FORUM',
    NULL,
    'active',
    'forum.banksampah@cicadas.desa.id',
    '0813-1122-3344',
    'RH'
),
(
    'USR-UNIT-01',
    'admin.mekarjaya',
    'admin123',
    'Hendri Pratama',
    'ADMIN_UNIT',
    'UNIT-CCD-001',
    'active',
    'mekarjaya.rw01@cicadas.desa.id',
    '0812-8899-0011',
    'HP'
),
(
    'USR-UNIT-02',
    'admin.berkah',
    'berkah123',
    'Hj. Siti Aisyah',
    'ADMIN_UNIT',
    'UNIT-CCD-002',
    'active',
    'berkah.asri02@cicadas.desa.id',
    '0813-7722-1100',
    'SA'
) ON CONFLICT (id) DO NOTHING;
