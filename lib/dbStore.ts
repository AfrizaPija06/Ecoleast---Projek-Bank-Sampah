/**
 * Data Store Layer & Hierarki 3 Tingkat Bank Sampah Desa Cicadas (Fase 1)
 *
 * Mengelola data:
 * - Tingkat 1: Forum Desa Cicadas (Super Admin)
 * - Tingkat 2: Bank Sampah Unit (RW/RT)
 * - Tingkat 3: Nasabah tiap Unit
 */

import {
  ForumDesa,
  BankUnit,
  NasabahTierRecord,
  TransaksiSetoranTier,
  TransaksiTarikSaldoTier,
  KatalogHargaKomoditasDesa,
} from './schema/types';

export const FORUM_DESA_INITIAL: ForumDesa = {
  id: 'FORUM-DESA-CICADAS',
  nama: 'Forum Bank Sampah Desa Cicadas',
  kodeDesa: '32.01.03.2005',
  kecamatan: 'Gunung Putri',
  kabupaten: 'Kabupaten Bogor',
  provinsi: 'Jawa Barat',
  ketuaForum: 'H. Rahmat Hidayat',
  kontakHp: '0813-1122-3344',
  emailResmi: 'forum.banksampah@cicadas.desa.id',
  alamatSekretariat: 'Kantor Balai Desa Cicadas, Jl. Raya Wanaherang No. 12',
  skPengesahanDesa: 'SK Kades Cicadas No. 147/BS-CCD/2023',
  totalUnitTerdaftar: 3,
  totalUnitAktif: 2,
  totalNasabahDesa: 48,
  totalSampahTerkumpulKg: 1240.5,
  status: 'aktif',
};

export const INITIAL_BANK_UNITS: BankUnit[] = [
  {
    id: 'UNIT-CCD-001',
    kodeUnit: 'CCD-U01',
    nama: 'Bank Sampah Mekar Jaya',
    rw: 'RW 01',
    rtCoverage: 'RT 01 s/d RT 06',
    ketuaUnit: 'Hendri Pratama',
    kontakHp: '0812-8899-0011',
    email: 'mekarjaya.rw01@cicadas.desa.id',
    alamatPos: 'Balai Warga RT 03 / RW 01, Desa Cicadas',
    status: 'active',
    tanggalPendaftaran: '2023-01-10',
    tanggalDisetujui: '2023-01-15',
    disetujuiOleh: 'H. Rahmat Hidayat (Ketua Forum Desa Cicadas)',
    nomorSK: 'SK.RW01/BS/2023',
    rekeningKas: {
      bank: 'Bank BJB',
      nomorRekening: '001239847101',
      namaPemilik: 'Bank Sampah Mekar Jaya RW 01',
      saldoKasUnit: 3250000,
    },
    jumlahNasabah: 24,
    totalSampahKg: 175.0,
    aktivitasTerakhir: 'Penimbangan 14.5 kg botol & kardus oleh Ibu Rahma • Kemarin, 14:20 WIB',
    koordinatPeta: { x: 30, y: 22, lat: -6.4421, lng: 106.9184 },
    wilayahDusun: 'Dusun I Kp. Mekar Jaya',
  },
  {
    id: 'UNIT-CCD-002',
    kodeUnit: 'CCD-U02',
    nama: 'Bank Sampah Cicadas',
    rw: 'RW 02',
    rtCoverage: 'RT 01 s/d RT 05',
    ketuaUnit: 'Hj. Siti Aisyah',
    kontakHp: '0813-7722-1100',
    email: 'berkah.asri02@cicadas.desa.id',
    alamatPos: 'Pos RW 02 Kp. Cicadas Hilir',
    status: 'active',
    tanggalPendaftaran: '2023-03-05',
    tanggalDisetujui: '2023-03-10',
    disetujuiOleh: 'H. Rahmat Hidayat (Ketua Forum Desa Cicadas)',
    nomorSK: 'SK.RW02/BS/2023',
    rekeningKas: {
      bank: 'Bank BRI',
      nomorRekening: '412001928374501',
      namaPemilik: 'Bank Sampah Cicadas RW 02',
      saldoKasUnit: 5840000,
    },
    jumlahNasabah: 38,
    totalSampahKg: 420.0,
    aktivitasTerakhir: 'Penyaluran 85 kg minyak jelantah & kertas ke off-taker • Hari ini, 09:15 WIB',
    koordinatPeta: { x: 18, y: 48, lat: -6.4468, lng: 106.9112 },
    wilayahDusun: 'Dusun II Cicadas Tengah',
  },
  {
    id: 'UNIT-CCD-003',
    kodeUnit: 'CCD-U03',
    nama: 'Bank Sampah Sukamaju',
    rw: 'RW 04',
    rtCoverage: 'RT 01 s/d RT 05',
    ketuaUnit: 'Budi Santoso, S.Pd',
    kontakHp: '0812-4455-6677',
    email: 'sukamaju.rw04@cicadas.desa.id',
    alamatPos: 'Kompleks Balai RW 04 Kp. Sukamaju',
    status: 'active',
    tanggalPendaftaran: '2023-06-12',
    tanggalDisetujui: '2023-06-18',
    disetujuiOleh: 'H. Rahmat Hidayat (Ketua Forum Desa Cicadas)',
    nomorSK: 'SK.RW04/BS/2023',
    rekeningKas: {
      bank: 'Bank Mandiri',
      nomorRekening: '1330029384751',
      namaPemilik: 'Bank Sampah Sukamaju RW 04',
      saldoKasUnit: 4120000,
    },
    jumlahNasabah: 26,
    totalSampahKg: 280.0,
    aktivitasTerakhir: 'Setoran kolektif 32 kg kaleng aluminium RT 02 • 2 hari lalu, 11:00 WIB',
    koordinatPeta: { x: 74, y: 48, lat: -6.4475, lng: 106.9275 },
    wilayahDusun: 'Dusun III Sukamaju Timur',
  },
  {
    id: 'UNIT-CCD-004',
    kodeUnit: 'CCD-U04',
    nama: 'Bank Sampah Unit RW 03',
    rw: 'RW 03',
    rtCoverage: 'RT 01 s/d RT 04',
    ketuaUnit: 'Drs. Mulyadi',
    kontakHp: '0856-9922-3311',
    email: 'mulyadi.rw03@cicadas.desa.id',
    alamatPos: 'Balai Serbaguna RW 03 Kp. Baru',
    status: 'active',
    tanggalPendaftaran: '2023-08-20',
    tanggalDisetujui: '2023-08-25',
    disetujuiOleh: 'H. Rahmat Hidayat (Ketua Forum Desa Cicadas)',
    nomorSK: 'SK.RW03/BS/2023',
    rekeningKas: {
      bank: 'Bank BJB',
      nomorRekening: '009881726351',
      namaPemilik: 'Bank Sampah Unit RW 03',
      saldoKasUnit: 4900000,
    },
    jumlahNasabah: 31,
    totalSampahKg: 350.0,
    aktivitasTerakhir: 'Timbang massal mingguan 46 kg anorganik terpilah • Kemarin, 16:00 WIB',
    koordinatPeta: { x: 46, y: 78, lat: -6.4532, lng: 106.9211 },
    wilayahDusun: 'Dusun IV Kp. Baru RW 03',
  },
];

export const INITIAL_KATALOG_DESA: KatalogHargaKomoditasDesa[] = [
  {
    id: 'KAT-DESA-01',
    kategoriId: 'plastik',
    nama: 'Plastik PET Bening (Botol Air)',
    deskripsi: 'Botol air mineral transparan, tutup dan label dilepas',
    satuan: 'kg',
    hargaRujukanDesa: 4200,
    hargaBeliUnitDefault: 3800,
    syaratMutu: 'Bersih, kering, dipipihkan tanpa air tersisa',
    trenPasar: 'naik',
    status: 'aktif',
  },
  {
    id: 'KAT-DESA-02',
    kategoriId: 'plastik',
    nama: 'Plastik HDPE / Kemasan Tebal',
    deskripsi: 'Botol sampo, jerigen minyak, botol sabun cuci',
    satuan: 'kg',
    hargaRujukanDesa: 3500,
    hargaBeliUnitDefault: 3000,
    syaratMutu: 'Sudah dibilas bersih dari sisa deterjen/sabun',
    trenPasar: 'stabil',
    status: 'aktif',
  },
  {
    id: 'KAT-DESA-03',
    kategoriId: 'kertas',
    nama: 'Kardus Gelombang (Box Tebal)',
    deskripsi: 'Kardus cokelat packing perabotan dan logistik',
    satuan: 'kg',
    hargaRujukanDesa: 2600,
    hargaBeliUnitDefault: 2400,
    syaratMutu: 'Kering, dipipihkan rapi, tidak basah atau terkena minyak',
    trenPasar: 'stabil',
    status: 'aktif',
  },
  {
    id: 'KAT-DESA-04',
    kategoriId: 'kertas',
    nama: 'Kertas HVS Putih & Arsip',
    deskripsi: 'Kertas fotokopi, dokumen bekas kantor, buku tulis',
    satuan: 'kg',
    hargaRujukanDesa: 2800,
    hargaBeliUnitDefault: 2500,
    syaratMutu: 'Bebas staples kawat, tidak campur karbon',
    trenPasar: 'stabil',
    status: 'aktif',
  },
  {
    id: 'KAT-DESA-05',
    kategoriId: 'logam',
    nama: 'Kaleng Minuman Aluminium',
    deskripsi: 'Kaleng minuman soda, kopi, susu beruang',
    satuan: 'kg',
    hargaRujukanDesa: 14000,
    hargaBeliUnitDefault: 12500,
    syaratMutu: 'Dipipihkan gepeng, kering tanpa cairan',
    trenPasar: 'naik',
    status: 'aktif',
  },
  {
    id: 'KAT-DESA-06',
    kategoriId: 'logam',
    nama: 'Besi Padat & Seng Tua',
    deskripsi: 'Besi plat sisa bangunan, pagar tua, seng bersih',
    satuan: 'kg',
    hargaRujukanDesa: 4800,
    hargaBeliUnitDefault: 4200,
    syaratMutu: 'Tidak mengandung adukan semen berlebih',
    trenPasar: 'fluktuatif',
    status: 'aktif',
  },
  {
    id: 'KAT-DESA-07',
    kategoriId: 'minyak_jelantah',
    nama: 'Minyak Jelantah Dapur',
    deskripsi: 'Minyak goreng bekas pakai rumah tangga yang telah disaring',
    satuan: 'liter',
    hargaRujukanDesa: 7500,
    hargaBeliUnitDefault: 7000,
    syaratMutu: 'Sudah disaring bebas remah makanan, wadah jerigen tertutup',
    trenPasar: 'naik',
    status: 'aktif',
  },
];

// Storage keys
const KEY_BANK_UNITS = 'bank_sampah_desa_units_v1';
const KEY_FORUM_DESA = 'bank_sampah_desa_forum_v1';

export function getStoredBankUnits(): BankUnit[] {
  if (typeof window === 'undefined') return INITIAL_BANK_UNITS;
  try {
    const raw = localStorage.getItem(KEY_BANK_UNITS);
    if (!raw) {
      localStorage.setItem(KEY_BANK_UNITS, JSON.stringify(INITIAL_BANK_UNITS));
      return INITIAL_BANK_UNITS;
    }
    const parsed = JSON.parse(raw) as BankUnit[];
    // Ensure all units have coordinates and if initial 4 are missing, merge them
    const initialMap = new Map(INITIAL_BANK_UNITS.map((u) => [u.id, u]));
    const enriched: BankUnit[] = parsed.map((unit): BankUnit => {
      const init = initialMap.get(unit.id);
      return {
        ...unit,
        koordinatPeta: unit.koordinatPeta || init?.koordinatPeta || { x: 50, y: 50 },
        aktivitasTerakhir: unit.aktivitasTerakhir || init?.aktivitasTerakhir || 'Belum ada aktivitas penimbangan terbaru',
        wilayahDusun: unit.wilayahDusun || init?.wilayahDusun || `Wilayah ${unit.rw}`,
      };
    });

    // If some initial units are missing from older saves, append them
    for (const initUnit of INITIAL_BANK_UNITS) {
      if (!enriched.some((u) => u.id === initUnit.id)) {
        enriched.push(initUnit);
      }
    }

    return enriched;
  } catch {
    return INITIAL_BANK_UNITS;
  }
}

export function saveStoredBankUnits(units: BankUnit[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY_BANK_UNITS, JSON.stringify(units));
  } catch {
    // ignore
  }
}

export function getStoredForumDesa(): ForumDesa {
  if (typeof window === 'undefined') return FORUM_DESA_INITIAL;
  try {
    const raw = localStorage.getItem(KEY_FORUM_DESA);
    if (!raw) {
      localStorage.setItem(KEY_FORUM_DESA, JSON.stringify(FORUM_DESA_INITIAL));
      return FORUM_DESA_INITIAL;
    }
    return JSON.parse(raw) as ForumDesa;
  } catch {
    return FORUM_DESA_INITIAL;
  }
}

export function saveStoredForumDesa(forum: ForumDesa): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY_FORUM_DESA, JSON.stringify(forum));
  } catch {
    // ignore
  }
}

/**
 * Mendaftarkan Bank Sampah Unit baru (Status otomatis: pending_review)
 * Menunggu verifikasi dan persetujuan dari Forum Desa Cicadas
 */
export function registerNewBankUnit(data: {
  namaUnit: string;
  rw: string;
  rtCoverage: string;
  ketuaUnit: string;
  kontakHp: string;
  email?: string;
  alamatPos: string;
  nomorSK?: string;
  bankNama?: string;
  bankRekening?: string;
  bankAtasNama?: string;
}): BankUnit {
  const currentUnits = getStoredBankUnits();
  const nextNum = currentUnits.length + 1;
  const kodeUnit = `CCD-U${String(nextNum).padStart(2, '0')}`;
  const newId = `UNIT-CCD-${String(nextNum).padStart(3, '0')}`;

  const newUnit: BankUnit = {
    id: newId,
    kodeUnit,
    nama: data.namaUnit,
    rw: data.rw,
    rtCoverage: data.rtCoverage,
    ketuaUnit: data.ketuaUnit,
    kontakHp: data.kontakHp,
    email: data.email || `${data.namaUnit.toLowerCase().replace(/[^a-z0-9]/g, '')}@cicadas.desa.id`,
    alamatPos: data.alamatPos,
    status: 'pending_review',
    tanggalPendaftaran: new Date().toISOString().split('T')[0],
    nomorSK: data.nomorSK || `SK.${data.rw.replace(/\s+/g, '')}/BS/${new Date().getFullYear()}`,
    rekeningKas: {
      bank: data.bankNama || 'Bank BJB',
      nomorRekening: data.bankRekening || '-',
      namaPemilik: data.bankAtasNama || data.namaUnit,
      saldoKasUnit: 0,
    },
    jumlahNasabah: 0,
    totalSampahKg: 0,
    aktivitasTerakhir: 'Pendaftaran unit baru diajukan • Menunggu verifikasi SK',
    koordinatPeta: {
      x: Math.min(85, Math.max(15, 20 + ((nextNum * 23) % 65))),
      y: Math.min(85, Math.max(15, 25 + ((nextNum * 31) % 60))),
      lat: -6.4450 - (nextNum * 0.002),
      lng: 106.9150 + (nextNum * 0.003),
    },
    wilayahDusun: `Wilayah ${data.rw}`,
  };

  const updated = [...currentUnits, newUnit];
  saveStoredBankUnits(updated);
  return newUnit;
}

/**
 * Menyetujui pendaftaran Bank Unit (Hanya oleh Super Admin Forum Desa)
 */
export function approveBankUnit(unitId: string, disetujuiOleh: string): BankUnit | null {
  const currentUnits = getStoredBankUnits();
  const index = currentUnits.findIndex((u) => u.id === unitId);
  if (index === -1) return null;

  const target = currentUnits[index];
  const updatedUnit: BankUnit = {
    ...target,
    status: 'active',
    tanggalDisetujui: new Date().toISOString().split('T')[0],
    disetujuiOleh,
  };

  currentUnits[index] = updatedUnit;
  saveStoredBankUnits(currentUnits);
  return updatedUnit;
}

/**
 * Menolak atau menangguhkan pendaftaran Bank Unit
 */
export function rejectBankUnit(unitId: string, alasan: string): BankUnit | null {
  const currentUnits = getStoredBankUnits();
  const index = currentUnits.findIndex((u) => u.id === unitId);
  if (index === -1) return null;

  const target = currentUnits[index];
  const updatedUnit: BankUnit = {
    ...target,
    status: 'rejected',
    catatanVerifikasi: alasan,
  };

  currentUnits[index] = updatedUnit;
  saveStoredBankUnits(currentUnits);
  return updatedUnit;
}

/**
 * Mengambil ringkasan data statistik desa (Agregasi seluruh unit)
 */
export function getDesaAggregatedStats() {
  const units = getStoredBankUnits();
  const activeUnits = units.filter((u) => u.status === 'active');
  const pendingUnits = units.filter((u) => u.status === 'pending_review');

  const totalNasabah = activeUnits.reduce((acc, u) => acc + (u.jumlahNasabah || 0), 0);
  const totalSampahKg = activeUnits.reduce((acc, u) => acc + (u.totalSampahKg || 0), 0);
  const totalKasDesa = activeUnits.reduce((acc, u) => acc + (u.rekeningKas?.saldoKasUnit || 0), 0);

  return {
    totalUnit: units.length,
    totalUnitAktif: activeUnits.length,
    totalUnitPending: pendingUnits.length,
    totalNasabahDesa: totalNasabah,
    totalSampahKg: Number(totalSampahKg.toFixed(1)),
    totalKasDesa,
    units,
    activeUnits,
    pendingUnits,
  };
}
