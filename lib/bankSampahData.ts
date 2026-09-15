export interface WasteCategory {
  id: string;
  nama: string;
  deskripsi: string;
  satuan: 'kg' | 'liter';
  hargaPerSatuan: number; // Rupiah
  colorBg: string;
  colorText: string;
  colorBorder: string;
  colorBar: string;
  iconName: string;
  // Faktor dampak lingkungan per kg atau liter:
  co2Factor: number; // kg CO2e dicegah
  energyFactor: number; // kWh energi dihemat
  treeFactor: number; // pohon terselamatkan (terutama kertas)
  waterFactor: number; // liter air terlindungi dari kontaminasi
}

export interface SetoranDetailItem {
  kategoriId: string;
  jenisDetail: string;
  berat: number; // kg atau liter
  satuan: 'kg' | 'liter';
  hargaPerSatuan: number;
  subtotal: number;
}

export interface SetoranRecord {
  id: string; // e.g. TRX-2024-0901
  nasabahId: string;
  tanggal: string; // YYYY-MM-DD
  jam: string;
  petugas: string;
  lokasi: string;
  items: SetoranDetailItem[];
  totalBerat: number;
  totalNilai: number;
  status: 'Terverifikasi' | 'Menunggu';
  catatan?: string;
  metodePembayaran?: 'Masuk Saldo' | 'Tunai Langsung';
  unitId?: string;
  unitNama?: string;
}

export interface Nasabah {
  id: string; // e.g. NSB-0419
  nama: string;
  nik?: string;
  noTelepon: string;
  alamat: string;
  rt?: string;
  rw?: string;
  unitBankSampah: string;
  unitId?: string;
  tanggalBergabung: string;
  targetBulananKg: number;
  level: 'Pemula Hijau' | 'Penyelamat Bumi' | 'Pahlawan Lingkungan' | 'Bintang Daur Ulang';
  avatarInitials: string;
  avatarColor: string;
  saldoTarik: number; // Saldo yang sudah pernah ditarik
  avatarUrl?: string; // URL atau Base64 data URI foto profil
  pin?: string; // PIN Keamanan (default 123456)
  statusAkun?: 'Aktif' | 'Nonaktif';
}

export const WASTE_CATEGORIES: Record<string, WasteCategory> = {
  plastik: {
    id: 'plastik',
    nama: 'Plastik & Kemasan',
    deskripsi: 'Botol PET, gelas mineral, botol HDPE deterjen, tutup botol, kantong kresek bersih',
    satuan: 'kg',
    hargaPerSatuan: 3800,
    colorBg: 'bg-emerald-50',
    colorText: 'text-emerald-800',
    colorBorder: 'border-emerald-200',
    colorBar: 'bg-emerald-600',
    iconName: 'Package',
    co2Factor: 1.8, // 1 kg plastik daur ulang mencegah ~1.8 kg CO2
    energyFactor: 1.5, // 1.5 kWh
    treeFactor: 0,
    waterFactor: 15,
  },
  kertas: {
    id: 'kertas',
    nama: 'Kertas & Karton',
    deskripsi: 'Kardus tebal, duplex, kertas HVS putih, koran, majalah, buku tulis bekas',
    satuan: 'kg',
    hargaPerSatuan: 2400,
    colorBg: 'bg-amber-50',
    colorText: 'text-amber-800',
    colorBorder: 'border-amber-200',
    colorBar: 'bg-amber-500',
    iconName: 'FileText',
    co2Factor: 1.3,
    energyFactor: 1.2,
    treeFactor: 0.017, // ~17 pohon per 1 ton kertas (0.017 pohon/kg)
    waterFactor: 28, // 28 liter air dihemat
  },
  logam: {
    id: 'logam',
    nama: 'Logam & Kaleng',
    deskripsi: 'Kaleng minuman aluminium, seng, besi tua, kawat, peralatan dapur logam',
    satuan: 'kg',
    hargaPerSatuan: 8500,
    colorBg: 'bg-slate-100',
    colorText: 'text-slate-800',
    colorBorder: 'border-slate-300',
    colorBar: 'bg-slate-600',
    iconName: 'Cpu',
    co2Factor: 4.2, // Logam/aluminium sangat hemat energi jika didaur ulang
    energyFactor: 3.8, // 3.8 kWh
    treeFactor: 0,
    waterFactor: 40,
  },
  kaca: {
    id: 'kaca',
    nama: 'Kaca & Beling',
    deskripsi: 'Botol kecap, sirup, toples kaca utuh, pecahan kaca bersih',
    satuan: 'kg',
    hargaPerSatuan: 900,
    colorBg: 'bg-sky-50',
    colorText: 'text-sky-800',
    colorBorder: 'border-sky-200',
    colorBar: 'bg-sky-500',
    iconName: 'Wine',
    co2Factor: 0.4,
    energyFactor: 0.6,
    treeFactor: 0,
    waterFactor: 8,
  },
  minyak_jelantah: {
    id: 'minyak_jelantah',
    nama: 'Minyak Jelantah',
    deskripsi: 'Minyak goreng bekas pakai rumah tangga yang telah disaring bersih',
    satuan: 'liter',
    hargaPerSatuan: 7000,
    colorBg: 'bg-orange-50',
    colorText: 'text-orange-800',
    colorBorder: 'border-orange-200',
    colorBar: 'bg-orange-500',
    iconName: 'Droplets',
    co2Factor: 2.6, // Dikonversi jadi biodiesel ramah lingkungan
    energyFactor: 2.1,
    treeFactor: 0,
    waterFactor: 1000, // 1 liter minyak jelantah bisa mencemari 1.000 liter air jika dibuang ke selokan!
  },
  elektronik: {
    id: 'elektronik',
    nama: 'Elektronik & E-Waste',
    deskripsi: 'Kabel bekas, charger rusak, baterai, komponen PC, ponsel mati',
    satuan: 'kg',
    hargaPerSatuan: 14000,
    colorBg: 'bg-violet-50',
    colorText: 'text-violet-800',
    colorBorder: 'border-violet-200',
    colorBar: 'bg-violet-600',
    iconName: 'Zap',
    co2Factor: 5.5,
    energyFactor: 4.5,
    treeFactor: 0,
    waterFactor: 120,
  },
};

export const INITIAL_NASABAH_LIST: Nasabah[] = [
  {
    id: 'NSB-0419',
    nama: 'Siti Rahma',
    nik: '3201035504890001',
    noTelepon: '0812-8821-4920',
    alamat: 'Kp. Cicadas Hilir RT 03 / RW 01',
    rt: 'RT 03',
    rw: 'RW 01',
    unitBankSampah: 'Bank Sampah Mekar Jaya RW 01',
    unitId: 'UNIT-CCD-001',
    tanggalBergabung: '15 Maret 2023',
    targetBulananKg: 25,
    level: 'Bintang Daur Ulang',
    avatarInitials: 'SR',
    avatarColor: 'bg-[#005596] text-white',
    saldoTarik: 0,
    pin: '123456',
    statusAkun: 'Aktif',
  },
  {
    id: 'NSB-0288',
    nama: 'Pak Budi Santoso',
    nik: '3201031208750002',
    noTelepon: '0857-1903-8821',
    alamat: 'Kp. Cicadas Tengah RT 02 / RW 01',
    rt: 'RT 02',
    rw: 'RW 01',
    unitBankSampah: 'Bank Sampah Mekar Jaya RW 01',
    unitId: 'UNIT-CCD-001',
    tanggalBergabung: '10 Agustus 2023',
    targetBulananKg: 35,
    level: 'Pahlawan Lingkungan',
    avatarInitials: 'BS',
    avatarColor: 'bg-sky-700 text-white',
    saldoTarik: 120000,
    pin: '123456',
    statusAkun: 'Aktif',
  },
  {
    id: 'NSB-0512',
    nama: 'Dewi Lestari, S.Farm',
    nik: '3201036802920003',
    noTelepon: '0813-7744-1290',
    alamat: 'Perum Cicadas Asri Blok B1 No. 4 RT 05 / RW 01',
    rt: 'RT 05',
    rw: 'RW 01',
    unitBankSampah: 'Bank Sampah Mekar Jaya RW 01',
    unitId: 'UNIT-CCD-001',
    tanggalBergabung: '02 Februari 2024',
    targetBulananKg: 15,
    level: 'Penyelamat Bumi',
    avatarInitials: 'DL',
    avatarColor: 'bg-amber-700 text-white',
    saldoTarik: 50000,
    pin: '123456',
    statusAkun: 'Aktif',
  },
  {
    id: 'NSB-0633',
    nama: 'H. Ahmad Supriyadi',
    nik: '3201031904700004',
    noTelepon: '0812-3344-5566',
    alamat: 'Kp. Cicadas Udik RT 01 / RW 01',
    rt: 'RT 01',
    rw: 'RW 01',
    unitBankSampah: 'Bank Sampah Mekar Jaya RW 01',
    unitId: 'UNIT-CCD-001',
    tanggalBergabung: '12 Mei 2024',
    targetBulananKg: 30,
    level: 'Penyelamat Bumi',
    avatarInitials: 'AS',
    avatarColor: 'bg-emerald-700 text-white',
    saldoTarik: 0,
    pin: '123456',
    statusAkun: 'Aktif',
  },
  // Nasabah Bank Sampah Cicadas RW 02 (UNIT-CCD-002)
  {
    id: 'NSB-0201',
    nama: 'Hj. Endang Sulastri',
    nik: '3201034401820005',
    noTelepon: '0813-2211-9988',
    alamat: 'Kp. Cicadas Hilir RT 02 / RW 02',
    rt: 'RT 02',
    rw: 'RW 02',
    unitBankSampah: 'Bank Sampah Cicadas',
    unitId: 'UNIT-CCD-002',
    tanggalBergabung: '10 Maret 2023',
    targetBulananKg: 40,
    level: 'Bintang Daur Ulang',
    avatarInitials: 'ES',
    avatarColor: 'bg-teal-700 text-white',
    saldoTarik: 250000,
    pin: '123456',
    statusAkun: 'Aktif',
  },
  {
    id: 'NSB-0202',
    nama: 'Suryadi Saputra',
    nik: '3201031109780006',
    noTelepon: '0857-4433-2211',
    alamat: 'Jl. Melati RT 01 / RW 02',
    rt: 'RT 01',
    rw: 'RW 02',
    unitBankSampah: 'Bank Sampah Cicadas',
    unitId: 'UNIT-CCD-002',
    tanggalBergabung: '18 April 2023',
    targetBulananKg: 35,
    level: 'Pahlawan Lingkungan',
    avatarInitials: 'SS',
    avatarColor: 'bg-sky-800 text-white',
    saldoTarik: 150000,
    pin: '123456',
    statusAkun: 'Aktif',
  },
  {
    id: 'NSB-0203',
    nama: 'Ratna Wulandari',
    nik: '3201036507910007',
    noTelepon: '0812-9988-7766',
    alamat: 'Kompleks RW 02 RT 04',
    rt: 'RT 04',
    rw: 'RW 02',
    unitBankSampah: 'Bank Sampah Cicadas',
    unitId: 'UNIT-CCD-002',
    tanggalBergabung: '05 Mei 2023',
    targetBulananKg: 25,
    level: 'Penyelamat Bumi',
    avatarInitials: 'RW',
    avatarColor: 'bg-indigo-700 text-white',
    saldoTarik: 80000,
    pin: '123456',
    statusAkun: 'Aktif',
  },
  {
    id: 'NSB-0204',
    nama: 'Joko Susilo',
    nik: '3201032303850008',
    noTelepon: '0878-1122-3344',
    alamat: 'Kp. Cicadas RT 03 / RW 02',
    rt: 'RT 03',
    rw: 'RW 02',
    unitBankSampah: 'Bank Sampah Cicadas',
    unitId: 'UNIT-CCD-002',
    tanggalBergabung: '20 Juni 2023',
    targetBulananKg: 20,
    level: 'Pemula Hijau',
    avatarInitials: 'JS',
    avatarColor: 'bg-emerald-600 text-white',
    saldoTarik: 0,
    pin: '123456',
    statusAkun: 'Aktif',
  },
  // Nasabah Bank Sampah Sukamaju RW 04 (UNIT-CCD-003)
  {
    id: 'NSB-0301',
    nama: 'Wahyu Pratama',
    nik: '3201031405880009',
    noTelepon: '0812-7766-5544',
    alamat: 'Kp. Sukamaju Timur RT 02 / RW 04',
    rt: 'RT 02',
    rw: 'RW 04',
    unitBankSampah: 'Bank Sampah Sukamaju',
    unitId: 'UNIT-CCD-003',
    tanggalBergabung: '15 Juli 2023',
    targetBulananKg: 35,
    level: 'Pahlawan Lingkungan',
    avatarInitials: 'WP',
    avatarColor: 'bg-blue-700 text-white',
    saldoTarik: 120000,
    pin: '123456',
    statusAkun: 'Aktif',
  },
  {
    id: 'NSB-0302',
    nama: 'Ibu Sri Mulyani',
    nik: '3201035206800010',
    noTelepon: '0856-3322-1100',
    alamat: 'Kp. Sukamaju RT 03 / RW 04',
    rt: 'RT 03',
    rw: 'RW 04',
    unitBankSampah: 'Bank Sampah Sukamaju',
    unitId: 'UNIT-CCD-003',
    tanggalBergabung: '01 Agustus 2023',
    targetBulananKg: 30,
    level: 'Penyelamat Bumi',
    avatarInitials: 'SM',
    avatarColor: 'bg-purple-700 text-white',
    saldoTarik: 90000,
    pin: '123456',
    statusAkun: 'Aktif',
  },
  {
    id: 'NSB-0303',
    nama: 'Kusnadi',
    nik: '3201030911760011',
    noTelepon: '0813-4455-6677',
    alamat: 'Jl. Sukamaju Blok C RT 01 / RW 04',
    rt: 'RT 01',
    rw: 'RW 04',
    unitBankSampah: 'Bank Sampah Sukamaju',
    unitId: 'UNIT-CCD-003',
    tanggalBergabung: '12 September 2023',
    targetBulananKg: 20,
    level: 'Pemula Hijau',
    avatarInitials: 'KN',
    avatarColor: 'bg-amber-800 text-white',
    saldoTarik: 0,
    pin: '123456',
    statusAkun: 'Aktif',
  },
  // Nasabah Bank Sampah Unit RW 03 (UNIT-CCD-004)
  {
    id: 'NSB-0401',
    nama: 'Dedi Kurniawan',
    nik: '3201031704810012',
    noTelepon: '0812-6655-4433',
    alamat: 'Balai Warga RT 02 / RW 03 Kp. Baru',
    rt: 'RT 02',
    rw: 'RW 03',
    unitBankSampah: 'Bank Sampah Unit RW 03',
    unitId: 'UNIT-CCD-004',
    tanggalBergabung: '28 Agustus 2023',
    targetBulananKg: 45,
    level: 'Bintang Daur Ulang',
    avatarInitials: 'DK',
    avatarColor: 'bg-[#005596] text-white',
    saldoTarik: 200000,
    pin: '123456',
    statusAkun: 'Aktif',
  },
  {
    id: 'NSB-0402',
    nama: 'Kartini Handayani',
    nik: '3201035908860013',
    noTelepon: '0857-8899-0011',
    alamat: 'Kp. Baru RT 03 / RW 03',
    rt: 'RT 03',
    rw: 'RW 03',
    unitBankSampah: 'Bank Sampah Unit RW 03',
    unitId: 'UNIT-CCD-004',
    tanggalBergabung: '05 September 2023',
    targetBulananKg: 35,
    level: 'Pahlawan Lingkungan',
    avatarInitials: 'KH',
    avatarColor: 'bg-rose-700 text-white',
    saldoTarik: 150000,
    pin: '123456',
    statusAkun: 'Aktif',
  },
  {
    id: 'NSB-0403',
    nama: 'Agus Setiawan',
    nik: '3201030402790014',
    noTelepon: '0813-8877-6655',
    alamat: 'Jl. Dahlia Kp. Baru RT 01 / RW 03',
    rt: 'RT 01',
    rw: 'RW 03',
    unitBankSampah: 'Bank Sampah Unit RW 03',
    unitId: 'UNIT-CCD-004',
    tanggalBergabung: '19 September 2023',
    targetBulananKg: 25,
    level: 'Penyelamat Bumi',
    avatarInitials: 'AS',
    avatarColor: 'bg-emerald-800 text-white',
    saldoTarik: 50000,
    pin: '123456',
    statusAkun: 'Aktif',
  },
];

export const INITIAL_SETORAN_RECORDS: SetoranRecord[] = [
  {
    id: 'TRX-2025-0812',
    nasabahId: 'NSB-0419',
    tanggal: '2025-08-12',
    jam: '09:15 WIB',
    petugas: 'Hendri (Petugas Timbang)',
    lokasi: 'Pos Bank Sampah Mekar Jaya',
    status: 'Terverifikasi',
    metodePembayaran: 'Masuk Saldo',
    totalBerat: 5.0,
    totalNilai: 25000,
    catatan: 'Botol plastik air mineral bersih dan kering.',
    items: [
      {
        kategoriId: 'plastik',
        jenisDetail: 'Botol Plastik',
        berat: 5.0,
        satuan: 'kg',
        hargaPerSatuan: 5000,
        subtotal: 25000,
      },
    ],
  },
  {
    id: 'TRX-2025-0810',
    nasabahId: 'NSB-0419',
    tanggal: '2025-08-10',
    jam: '08:40 WIB',
    petugas: 'Supriyanto (Petugas 01)',
    lokasi: 'Pos Bank Sampah Mekar Jaya',
    status: 'Terverifikasi',
    metodePembayaran: 'Masuk Saldo',
    totalBerat: 8.0,
    totalNilai: 40000,
    catatan: 'Kertas HVS dokumen dan majalah.',
    items: [
      {
        kategoriId: 'kertas',
        jenisDetail: 'Kertas',
        berat: 8.0,
        satuan: 'kg',
        hargaPerSatuan: 5000,
        subtotal: 40000,
      },
    ],
  },
  {
    id: 'TRX-2025-0807',
    nasabahId: 'NSB-0419',
    tanggal: '2025-08-07',
    jam: '10:20 WIB',
    petugas: 'Hendri (Petugas Timbang)',
    lokasi: 'Pos Bank Sampah Mekar Jaya',
    status: 'Terverifikasi',
    metodePembayaran: 'Masuk Saldo',
    totalBerat: 12.0,
    totalNilai: 60000,
    catatan: 'Plastik campur kemasan dan wadah tebal.',
    items: [
      {
        kategoriId: 'plastik',
        jenisDetail: 'Plastik Campur',
        berat: 12.0,
        satuan: 'kg',
        hargaPerSatuan: 5000,
        subtotal: 60000,
      },
    ],
  },
  {
    id: 'TRX-2025-0803',
    nasabahId: 'NSB-0419',
    tanggal: '2025-08-03',
    jam: '09:00 WIB',
    petugas: 'Supriyanto (Petugas 01)',
    lokasi: 'Pos Bank Sampah Mekar Jaya',
    status: 'Terverifikasi',
    metodePembayaran: 'Masuk Saldo',
    totalBerat: 10.0,
    totalNilai: 50000,
    catatan: 'Kardus cokelat tebal dipipihkan rapi.',
    items: [
      {
        kategoriId: 'kertas',
        jenisDetail: 'Kardus',
        berat: 10.0,
        satuan: 'kg',
        hargaPerSatuan: 5000,
        subtotal: 50000,
      },
    ],
  },
  {
    id: 'TRX-2025-0728',
    nasabahId: 'NSB-0419',
    tanggal: '2025-07-28',
    jam: '11:10 WIB',
    petugas: 'Hendri (Petugas Timbang)',
    lokasi: 'Pos Bank Sampah Mekar Jaya',
    status: 'Terverifikasi',
    metodePembayaran: 'Masuk Saldo',
    totalBerat: 7.0,
    totalNilai: 35000,
    catatan: 'Botol plastik PET bening tanpa label.',
    items: [
      {
        kategoriId: 'plastik',
        jenisDetail: 'Botol Plastik',
        berat: 7.0,
        satuan: 'kg',
        hargaPerSatuan: 5000,
        subtotal: 35000,
      },
    ],
  },
  {
    id: 'TRX-2025-0715',
    nasabahId: 'NSB-0419',
    tanggal: '2025-07-15',
    jam: '08:30 WIB',
    petugas: 'Supriyanto (Petugas 01)',
    lokasi: 'Pos Bank Sampah Mekar Jaya',
    status: 'Terverifikasi',
    metodePembayaran: 'Masuk Saldo',
    totalBerat: 83.0,
    totalNilai: 540000,
    catatan: 'Akumulasi setoran rutin periode semester 1 (kardus, minyak jelantah, logam & botol).',
    items: [
      {
        kategoriId: 'kertas',
        jenisDetail: 'Kardus & Kertas Campur',
        berat: 40.0,
        satuan: 'kg',
        hargaPerSatuan: 5000,
        subtotal: 200000,
      },
      {
        kategoriId: 'plastik',
        jenisDetail: 'Kemasan Plastik & Galon',
        berat: 25.0,
        satuan: 'kg',
        hargaPerSatuan: 6000,
        subtotal: 150000,
      },
      {
        kategoriId: 'minyak_jelantah',
        jenisDetail: 'Minyak Jelantah Jerigen',
        berat: 12.0,
        satuan: 'liter',
        hargaPerSatuan: 10000,
        subtotal: 120000,
      },
      {
        kategoriId: 'logam',
        jenisDetail: 'Kaleng Biskuit & Besi Ringan',
        berat: 6.0,
        satuan: 'kg',
        hargaPerSatuan: 11666,
        subtotal: 70000,
      },
    ],
  },
  // Data untuk nasabah lain (Pak Budi)
  {
    id: 'TRX-2024-0902',
    nasabahId: 'NSB-0288',
    tanggal: '2024-09-01',
    jam: '10:30 WIB',
    petugas: 'Supriyanto (Petugas Timbang 01)',
    lokasi: 'Pos Bank Sampah Balai Warga RT 03',
    status: 'Terverifikasi',
    metodePembayaran: 'Masuk Saldo',
    totalBerat: 42.5,
    totalNilai: 184500,
    catatan: 'Kardus toko kelontong & kaleng susu dalam jumlah banyak.',
    items: [
      {
        kategoriId: 'kertas',
        jenisDetail: 'Kardus Cokelat Indomie & Minyak',
        berat: 28.0,
        satuan: 'kg',
        hargaPerSatuan: 2400,
        subtotal: 67200,
      },
      {
        kategoriId: 'logam',
        jenisDetail: 'Kaleng Susu Kental Manis & Biskuit',
        berat: 11.5,
        satuan: 'kg',
        hargaPerSatuan: 8500,
        subtotal: 97750,
      },
      {
        kategoriId: 'plastik',
        jenisDetail: 'Kresek & Plastik Pembungkus',
        berat: 3.0,
        satuan: 'kg',
        hargaPerSatuan: 6500,
        subtotal: 19550,
      },
    ],
  },
  // Data untuk Dewi Lestari
  {
    id: 'TRX-2024-0905',
    nasabahId: 'NSB-0512',
    tanggal: '2024-08-30',
    jam: '11:15 WIB',
    petugas: 'Hendri Kurniawan',
    lokasi: 'Pos Bank Sampah Balai Warga RT 03',
    status: 'Terverifikasi',
    metodePembayaran: 'Masuk Saldo',
    totalBerat: 8.4,
    totalNilai: 61800,
    catatan: 'Botol kopi susu plastik & keyboard bekas.',
    items: [
      {
        kategoriId: 'elektronik',
        jenisDetail: 'Keyboard Rusak & Charger Handphone',
        berat: 1.8,
        satuan: 'kg',
        hargaPerSatuan: 14000,
        subtotal: 25200,
      },
      {
        kategoriId: 'plastik',
        jenisDetail: 'Botol PET Kopi & Gelas Plastik',
        berat: 3.6,
        satuan: 'kg',
        hargaPerSatuan: 3800,
        subtotal: 13680,
      },
      {
        kategoriId: 'kertas',
        jenisDetail: 'Kertas Resep & Box Obat Bekas',
        berat: 3.0,
        satuan: 'kg',
        hargaPerSatuan: 7640,
        subtotal: 22920,
      },
    ],
    unitId: 'UNIT-CCD-001',
    unitNama: 'Bank Sampah Mekar Jaya RW 01',
  },
  // ==========================================
  // UNIT 2: Bank Sampah Cicadas RW 02 (420.0 kg)
  // ==========================================
  {
    id: 'TRX-CCD02-01',
    nasabahId: 'NSB-0201',
    tanggal: '2025-08-14',
    jam: '09:30 WIB',
    petugas: 'Siti Aisyah (Ketua Unit 02)',
    lokasi: 'Pos Balai RW 02 Kp. Cicadas Hilir',
    status: 'Terverifikasi',
    metodePembayaran: 'Masuk Saldo',
    totalBerat: 115.0,
    totalNilai: 615500,
    catatan: 'Penyetoran kardus packing toko & minyak jelantah terpilah.',
    items: [
      {
        kategoriId: 'kertas',
        jenisDetail: 'Kardus Tebal Packing Toko',
        berat: 65.0,
        satuan: 'kg',
        hargaPerSatuan: 4200,
        subtotal: 273000,
      },
      {
        kategoriId: 'plastik',
        jenisDetail: 'Botol PET & Jerigen Bening',
        berat: 35.0,
        satuan: 'kg',
        hargaPerSatuan: 5500,
        subtotal: 192500,
      },
      {
        kategoriId: 'minyak_jelantah',
        jenisDetail: 'Minyak Jelantah Saring Jerigen',
        berat: 15.0,
        satuan: 'liter',
        hargaPerSatuan: 10000,
        subtotal: 150000,
      },
    ],
    unitId: 'UNIT-CCD-002',
    unitNama: 'Bank Sampah Cicadas',
  },
  {
    id: 'TRX-CCD02-02',
    nasabahId: 'NSB-0202',
    tanggal: '2025-08-11',
    jam: '10:45 WIB',
    petugas: 'Ahmad Fauzi (Petugas Timbang)',
    lokasi: 'Pos Balai RW 02 Kp. Cicadas Hilir',
    status: 'Terverifikasi',
    metodePembayaran: 'Masuk Saldo',
    totalBerat: 140.0,
    totalNilai: 817600,
    catatan: 'Besi plat, plastik HDPE tebal & botol sirup beling.',
    items: [
      {
        kategoriId: 'plastik',
        jenisDetail: 'Plastik HDPE Tebal & Ember Pecah',
        berat: 60.0,
        satuan: 'kg',
        hargaPerSatuan: 5200,
        subtotal: 312000,
      },
      {
        kategoriId: 'logam',
        jenisDetail: 'Besi Pipa & Seng Pagar Bekas',
        berat: 48.0,
        satuan: 'kg',
        hargaPerSatuan: 8800,
        subtotal: 422400,
      },
      {
        kategoriId: 'kaca',
        jenisDetail: 'Botol Sirup & Toples Kaca Bening',
        berat: 28.0,
        satuan: 'kg',
        hargaPerSatuan: 900,
        subtotal: 25200,
      },
      {
        kategoriId: 'elektronik',
        jenisDetail: 'Monitor Tabung & Stavolt Rusak',
        berat: 4.0,
        satuan: 'kg',
        hargaPerSatuan: 14500,
        subtotal: 58000,
      },
    ],
    unitId: 'UNIT-CCD-002',
    unitNama: 'Bank Sampah Cicadas',
  },
  {
    id: 'TRX-CCD02-03',
    nasabahId: 'NSB-0203',
    tanggal: '2025-08-08',
    jam: '08:15 WIB',
    petugas: 'Siti Aisyah (Ketua Unit 02)',
    lokasi: 'Pos Balai RW 02 Kp. Cicadas Hilir',
    status: 'Terverifikasi',
    metodePembayaran: 'Masuk Saldo',
    totalBerat: 95.0,
    totalNilai: 512300,
    catatan: 'Koran arsip kantor & minyak jelantah dapur warga.',
    items: [
      {
        kategoriId: 'kertas',
        jenisDetail: 'Koran & Majalah Arsip Kantor',
        berat: 55.0,
        satuan: 'kg',
        hargaPerSatuan: 4300,
        subtotal: 236500,
      },
      {
        kategoriId: 'plastik',
        jenisDetail: 'Gelas Mineral & Botol Minuman',
        berat: 27.0,
        satuan: 'kg',
        hargaPerSatuan: 5400,
        subtotal: 145800,
      },
      {
        kategoriId: 'minyak_jelantah',
        jenisDetail: 'Minyak Jelantah Dapur Warga',
        berat: 13.0,
        satuan: 'liter',
        hargaPerSatuan: 10000,
        subtotal: 130000,
      },
    ],
    unitId: 'UNIT-CCD-002',
    unitNama: 'Bank Sampah Cicadas',
  },
  {
    id: 'TRX-CCD02-04',
    nasabahId: 'NSB-0204',
    tanggal: '2025-08-05',
    jam: '11:20 WIB',
    petugas: 'Ahmad Fauzi (Petugas Timbang)',
    lokasi: 'Pos Balai RW 02 Kp. Cicadas Hilir',
    status: 'Terverifikasi',
    metodePembayaran: 'Masuk Saldo',
    totalBerat: 70.0,
    totalNilai: 298200,
    catatan: 'Buku pelajaran bekas & botol kecap beling.',
    items: [
      {
        kategoriId: 'kertas',
        jenisDetail: 'Buku Tulis & Kertas HVS Arsip',
        berat: 40.0,
        satuan: 'kg',
        hargaPerSatuan: 4250,
        subtotal: 170000,
      },
      {
        kategoriId: 'plastik',
        jenisDetail: 'Kemasan Plastik & Kresek Bening',
        berat: 23.0,
        satuan: 'kg',
        hargaPerSatuan: 5300,
        subtotal: 121900,
      },
      {
        kategoriId: 'kaca',
        jenisDetail: 'Botol Kecap & Botol Saus Beling',
        berat: 7.0,
        satuan: 'kg',
        hargaPerSatuan: 900,
        subtotal: 6300,
      },
    ],
    unitId: 'UNIT-CCD-002',
    unitNama: 'Bank Sampah Cicadas',
  },
  // ==========================================
  // UNIT 3: Bank Sampah Sukamaju RW 04 (280.0 kg)
  // ==========================================
  {
    id: 'TRX-CCD03-01',
    nasabahId: 'NSB-0301',
    tanggal: '2025-08-13',
    jam: '09:00 WIB',
    petugas: 'Budi Santoso (Ketua Unit 03)',
    lokasi: 'Balai RW 04 Kp. Sukamaju',
    status: 'Terverifikasi',
    metodePembayaran: 'Masuk Saldo',
    totalBerat: 110.0,
    totalNilai: 458200,
    catatan: 'Kardus kemasan paket & botol kaca kecap.',
    items: [
      {
        kategoriId: 'kertas',
        jenisDetail: 'Kardus Packing Logistik',
        berat: 60.0,
        satuan: 'kg',
        hargaPerSatuan: 4100,
        subtotal: 246000,
      },
      {
        kategoriId: 'plastik',
        jenisDetail: 'Botol Plastik PET Bersih',
        berat: 38.0,
        satuan: 'kg',
        hargaPerSatuan: 5300,
        subtotal: 201400,
      },
      {
        kategoriId: 'kaca',
        jenisDetail: 'Botol Kaca Kecap & Sirup',
        berat: 12.0,
        satuan: 'kg',
        hargaPerSatuan: 900,
        subtotal: 10800,
      },
    ],
    unitId: 'UNIT-CCD-003',
    unitNama: 'Bank Sampah Sukamaju',
  },
  {
    id: 'TRX-CCD03-02',
    nasabahId: 'NSB-0302',
    tanggal: '2025-08-09',
    jam: '10:15 WIB',
    petugas: 'Roni Hendrawan (Petugas Timbang)',
    lokasi: 'Balai RW 04 Kp. Sukamaju',
    status: 'Terverifikasi',
    metodePembayaran: 'Masuk Saldo',
    totalBerat: 95.0,
    totalNilai: 658800,
    catatan: 'Kaleng biskuit & cat, minyak jelantah rumahan.',
    items: [
      {
        kategoriId: 'plastik',
        jenisDetail: 'Kemasan Plastik Sabun & Shampoo',
        berat: 35.0,
        satuan: 'kg',
        hargaPerSatuan: 5200,
        subtotal: 182000,
      },
      {
        kategoriId: 'logam',
        jenisDetail: 'Kaleng Cat & Biskuit Logam',
        berat: 36.0,
        satuan: 'kg',
        hargaPerSatuan: 8600,
        subtotal: 309600,
      },
      {
        kategoriId: 'minyak_jelantah',
        jenisDetail: 'Minyak Jelantah Kering Bersih',
        berat: 16.0,
        satuan: 'liter',
        hargaPerSatuan: 10000,
        subtotal: 160000,
      },
      {
        kategoriId: 'kaca',
        jenisDetail: 'Toples Beling Selai & Sirup',
        berat: 8.0,
        satuan: 'kg',
        hargaPerSatuan: 900,
        subtotal: 7200,
      },
    ],
    unitId: 'UNIT-CCD-003',
    unitNama: 'Bank Sampah Sukamaju',
  },
  {
    id: 'TRX-CCD03-03',
    nasabahId: 'NSB-0303',
    tanggal: '2025-08-06',
    jam: '14:30 WIB',
    petugas: 'Budi Santoso (Ketua Unit 03)',
    lokasi: 'Balai RW 04 Kp. Sukamaju',
    status: 'Terverifikasi',
    metodePembayaran: 'Masuk Saldo',
    totalBerat: 75.0,
    totalNilai: 370800,
    catatan: 'HVS kantor, majalah, kabel & adaptor rusak.',
    items: [
      {
        kategoriId: 'kertas',
        jenisDetail: 'Kertas HVS & Majalah Bekas',
        berat: 50.0,
        satuan: 'kg',
        hargaPerSatuan: 4200,
        subtotal: 210000,
      },
      {
        kategoriId: 'plastik',
        jenisDetail: 'Plastik Tebal Wadah Makanan',
        berat: 22.0,
        satuan: 'kg',
        hargaPerSatuan: 5400,
        subtotal: 118800,
      },
      {
        kategoriId: 'elektronik',
        jenisDetail: 'Kabel Tembaga & Adaptor Rusak',
        berat: 3.0,
        satuan: 'kg',
        hargaPerSatuan: 14000,
        subtotal: 42000,
      },
    ],
    unitId: 'UNIT-CCD-003',
    unitNama: 'Bank Sampah Sukamaju',
  },
  // ==========================================
  // UNIT 4: Bank Sampah Unit RW 03 (350.0 kg)
  // ==========================================
  {
    id: 'TRX-CCD04-01',
    nasabahId: 'NSB-0401',
    tanggal: '2025-08-15',
    jam: '08:45 WIB',
    petugas: 'Drs. Mulyadi (Ketua Unit 04)',
    lokasi: 'Balai Serbaguna RW 03 Kp. Baru',
    status: 'Terverifikasi',
    metodePembayaran: 'Masuk Saldo',
    totalBerat: 140.0,
    totalNilai: 555000,
    catatan: 'Kardus TV perabotan, botol galon pecah & beling.',
    items: [
      {
        kategoriId: 'kertas',
        jenisDetail: 'Kardus Cokelat Gelombang Box',
        berat: 70.0,
        satuan: 'kg',
        hargaPerSatuan: 4200,
        subtotal: 294000,
      },
      {
        kategoriId: 'plastik',
        jenisDetail: 'Galon Pecah & Botol PET Bening',
        berat: 45.0,
        satuan: 'kg',
        hargaPerSatuan: 5300,
        subtotal: 238500,
      },
      {
        kategoriId: 'kaca',
        jenisDetail: 'Botol Sirup & Toples Beling Kaca',
        berat: 25.0,
        satuan: 'kg',
        hargaPerSatuan: 900,
        subtotal: 22500,
      },
    ],
    unitId: 'UNIT-CCD-004',
    unitNama: 'Bank Sampah Unit RW 03',
  },
  {
    id: 'TRX-CCD04-02',
    nasabahId: 'NSB-0402',
    tanggal: '2025-08-12',
    jam: '11:00 WIB',
    petugas: 'Herman Saputra (Petugas Timbang)',
    lokasi: 'Balai Serbaguna RW 03 Kp. Baru',
    status: 'Terverifikasi',
    metodePembayaran: 'Masuk Saldo',
    totalBerat: 120.0,
    totalNilai: 933200,
    catatan: 'Besi seng, kaleng susu, minyak jelantah & printer.',
    items: [
      {
        kategoriId: 'plastik',
        jenisDetail: 'Kemasan Deterjen & Sabun Cuci',
        berat: 52.0,
        satuan: 'kg',
        hargaPerSatuan: 5400,
        subtotal: 280800,
      },
      {
        kategoriId: 'logam',
        jenisDetail: 'Kaleng Minuman & Besi Konstruksi',
        berat: 42.0,
        satuan: 'kg',
        hargaPerSatuan: 8700,
        subtotal: 365400,
      },
      {
        kategoriId: 'minyak_jelantah',
        jenisDetail: 'Minyak Jelantah Saring Jerigen',
        berat: 20.0,
        satuan: 'liter',
        hargaPerSatuan: 10000,
        subtotal: 200000,
      },
      {
        kategoriId: 'elektronik',
        jenisDetail: 'Printer Bekas & Komponen PC',
        berat: 6.0,
        satuan: 'kg',
        hargaPerSatuan: 14500,
        subtotal: 87000,
      },
    ],
    unitId: 'UNIT-CCD-004',
    unitNama: 'Bank Sampah Unit RW 03',
  },
  {
    id: 'TRX-CCD04-03',
    nasabahId: 'NSB-0403',
    tanggal: '2025-08-04',
    jam: '09:20 WIB',
    petugas: 'Drs. Mulyadi (Ketua Unit 04)',
    lokasi: 'Balai Serbaguna RW 03 Kp. Baru',
    status: 'Terverifikasi',
    metodePembayaran: 'Masuk Saldo',
    totalBerat: 90.0,
    totalNilai: 412000,
    catatan: 'Koran lama, kardus mie & botol plastik.',
    items: [
      {
        kategoriId: 'kertas',
        jenisDetail: 'Koran Bekas & Kardus Mie Instan',
        berat: 65.0,
        satuan: 'kg',
        hargaPerSatuan: 4300,
        subtotal: 279500,
      },
      {
        kategoriId: 'plastik',
        jenisDetail: 'Botol Plastik & Tutup Botol',
        berat: 25.0,
        satuan: 'kg',
        hargaPerSatuan: 5300,
        subtotal: 132500,
      },
    ],
    unitId: 'UNIT-CCD-004',
    unitNama: 'Bank Sampah Unit RW 03',
  },
];

// Helper kalkulasi dampak lingkungan
export function calculateImpact(records: SetoranRecord[]) {
  let totalKg = 0;
  let co2eKg = 0;
  let energyKwh = 0;
  let treesSaved = 0;
  let waterSavedLiter = 0;
  let totalNilaiRupiah = 0;

  const categoryBreakdown: Record<
    string,
    {
      kategori: WasteCategory;
      berat: number;
      nilai: number;
      persenBerat: number;
    }
  > = {};

  // Initialize breakdown
  Object.keys(WASTE_CATEGORIES).forEach((key) => {
    categoryBreakdown[key] = {
      kategori: WASTE_CATEGORIES[key],
      berat: 0,
      nilai: 0,
      persenBerat: 0,
    };
  });

  records.forEach((record) => {
    totalNilaiRupiah += record.totalNilai;
    record.items.forEach((item) => {
      totalKg += item.berat;
      const cat = WASTE_CATEGORIES[item.kategoriId] || WASTE_CATEGORIES['plastik'];

      co2eKg += item.berat * cat.co2Factor;
      energyKwh += item.berat * cat.energyFactor;
      treesSaved += item.berat * cat.treeFactor;
      waterSavedLiter += item.berat * cat.waterFactor;

      if (categoryBreakdown[item.kategoriId]) {
        categoryBreakdown[item.kategoriId].berat += item.berat;
        categoryBreakdown[item.kategoriId].nilai += item.subtotal;
      }
    });
  });

  // Calculate percentages
  if (totalKg > 0) {
    Object.keys(categoryBreakdown).forEach((key) => {
      categoryBreakdown[key].persenBerat =
        (categoryBreakdown[key].berat / totalKg) * 100;
    });
  }

  // Equivalent equivalents for easy human understanding
  const equivalentMotorKm = Math.round(co2eKg * 4.6); // 1 kg CO2 ~ 4.6 km motor bensin
  const equivalentLedHours = Math.round(energyKwh * 100); // 1 kWh ~ 100 jam lampu LED 10W
  const equivalentHouseholdWaterDays = Math.round(waterSavedLiter / 150); // rata-rata konsumsi harian keluarga ~150 L

  return {
    totalSetoranCount: records.length,
    totalKg: Number(totalKg.toFixed(1)),
    totalNilaiRupiah,
    co2eKg: Number(co2eKg.toFixed(1)),
    energyKwh: Number(energyKwh.toFixed(1)),
    treesSaved: Number(treesSaved.toFixed(2)),
    waterSavedLiter: Math.round(waterSavedLiter),
    categoryBreakdown,
    equivalentMotorKm,
    equivalentLedHours,
    equivalentHouseholdWaterDays,
  };
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateIndo(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}
