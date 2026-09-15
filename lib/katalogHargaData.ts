export interface KatalogHargaItem {
  id: string;
  kategoriId: 'plastik' | 'kertas' | 'logam' | 'kaca' | 'minyak_jelantah' | 'elektronik';
  kategoriNama: string;
  nama: string;
  hargaPerSatuan: number;
  satuan: 'kg' | 'liter' | 'buah';
  kualitas: string;
  tips: string;
  trenHarga: 'naik' | 'stabil' | 'turun';
  terakhirDiperbarui: string;
  bisaDiterima: boolean;
  kodeReferensi?: string;
}

export const INITIAL_KATALOG_HARGA: KatalogHargaItem[] = [
  // 1. Plastik & Kemasan
  {
    id: 'pet-bening',
    kategoriId: 'plastik',
    kategoriNama: 'Plastik & Kemasan',
    nama: 'Botol PET Bening Bersih',
    hargaPerSatuan: 3800,
    satuan: 'kg',
    kualitas: 'Bening transparan, kering, dibilas bersih, label dilepas',
    tips: 'Remas botol hingga pipih untuk menghemat ruang karung penampung.',
    trenHarga: 'stabil',
    terakhirDiperbarui: '2026-09-01',
    bisaDiterima: true,
    kodeReferensi: 'PL-01',
  },
  {
    id: 'pet-warna',
    kategoriId: 'plastik',
    kategoriNama: 'Plastik & Kemasan',
    nama: 'Botol PET Berwarna / Campur',
    hargaPerSatuan: 2600,
    satuan: 'kg',
    kualitas: 'Botol Sprite hijau, botol isotonic biru, botol kecap plastik',
    tips: 'Pisahkan dari botol bening agar mendapatkan harga tertinggi.',
    trenHarga: 'stabil',
    terakhirDiperbarui: '2026-09-01',
    bisaDiterima: true,
    kodeReferensi: 'PL-02',
  },
  {
    id: 'gelas-mineral',
    kategoriId: 'plastik',
    kategoriNama: 'Plastik & Kemasan',
    nama: 'Gelas Plastik Air Mineral (PP Bersih)',
    hargaPerSatuan: 4500,
    satuan: 'kg',
    kualitas: 'Gelas air mineral bening tanpa sisa air, ring/tutup dilepas',
    tips: 'Tumpuk rapi ke atas seperti corong agar muat banyak di wadah.',
    trenHarga: 'naik',
    terakhirDiperbarui: '2026-09-05',
    bisaDiterima: true,
    kodeReferensi: 'PL-03',
  },
  {
    id: 'hdpe-botol',
    kategoriId: 'plastik',
    kategoriNama: 'Plastik & Kemasan',
    nama: 'Botol HDPE (Shampoo / Sabun / Jerigen)',
    hargaPerSatuan: 3200,
    satuan: 'kg',
    kualitas: 'Plastik tebal buram (kode 2), dibilas sisa sabunnya',
    tips: 'Keringkan botol sehabis dibilas sebelum ditimbang.',
    trenHarga: 'stabil',
    terakhirDiperbarui: '2026-09-01',
    bisaDiterima: true,
    kodeReferensi: 'PL-04',
  },
  {
    id: 'kresek-campur',
    kategoriId: 'plastik',
    kategoriNama: 'Plastik & Kemasan',
    nama: 'Kantong Kresek Bening / Bersih',
    hargaPerSatuan: 1200,
    satuan: 'kg',
    kualitas: 'Kering, bebas minyak, kotoran tanah, dan sisa basah',
    tips: 'Kumpulkan dalam satu kantong besar lalu padatkan.',
    trenHarga: 'stabil',
    terakhirDiperbarui: '2026-09-01',
    bisaDiterima: true,
    kodeReferensi: 'PL-05',
  },
  {
    id: 'tutup-botol',
    kategoriId: 'plastik',
    kategoriNama: 'Plastik & Kemasan',
    nama: 'Tutup Botol Plastik (HDPE/PP Campur)',
    hargaPerSatuan: 3500,
    satuan: 'kg',
    kualitas: 'Tutup botol galon, tutup botol minuman, dibilas bersih',
    tips: 'Kumpulkan terpisah di stoples atau kantong kecil.',
    trenHarga: 'naik',
    terakhirDiperbarui: '2026-09-05',
    bisaDiterima: true,
    kodeReferensi: 'PL-06',
  },

  // 2. Kertas & Karton
  {
    id: 'kardus-tebal',
    kategoriId: 'kertas',
    kategoriNama: 'Kertas & Karton',
    nama: 'Kardus Cokelat Tebal (Corrugated)',
    hargaPerSatuan: 2400,
    satuan: 'kg',
    kualitas: 'Kardus cokelat tebal, kering, bebas lakban tebal & staples besar',
    tips: 'Buka lipatan kardus hingga pipih, ikat rapi dengan tali rafia.',
    trenHarga: 'stabil',
    terakhirDiperbarui: '2026-09-01',
    bisaDiterima: true,
    kodeReferensi: 'KT-01',
  },
  {
    id: 'hvs-putih',
    kategoriId: 'kertas',
    kategoriNama: 'Kertas & Karton',
    nama: 'Kertas HVS Putih & Arsip Bersih',
    hargaPerSatuan: 3000,
    satuan: 'kg',
    kualitas: 'Kertas dokumen print, lembar kerja putih, bebas klip kawat',
    tips: 'Hindari kertas yang basah atau terkena minyak makanan.',
    trenHarga: 'naik',
    terakhirDiperbarui: '2026-09-04',
    bisaDiterima: true,
    kodeReferensi: 'KT-02',
  },
  {
    id: 'koran-majalah',
    kategoriId: 'kertas',
    kategoriNama: 'Kertas & Karton',
    nama: 'Koran & Majalah Bekas',
    hargaPerSatuan: 2000,
    satuan: 'kg',
    kualitas: 'Koran lembaran atau majalah, halaman utuh dan kering',
    tips: 'Ikat per tumpukan setinggi 20-30 cm agar mudah ditimbang.',
    trenHarga: 'stabil',
    terakhirDiperbarui: '2026-09-01',
    bisaDiterima: true,
    kodeReferensi: 'KT-03',
  },
  {
    id: 'duplex-box',
    kategoriId: 'kertas',
    kategoriNama: 'Kertas & Karton',
    nama: 'Karton Duplex & Kemasan Produk',
    hargaPerSatuan: 1100,
    satuan: 'kg',
    kualitas: 'Kotak odol, kotak sereal, kotak snack tipis bagian abu-abu',
    tips: 'Pastikan tidak ada lapisan sisa makanan berlemak di dalamnya.',
    trenHarga: 'stabil',
    terakhirDiperbarui: '2026-09-01',
    bisaDiterima: true,
    kodeReferensi: 'KT-04',
  },

  // 3. Logam & Kaleng
  {
    id: 'kaleng-aluminium',
    kategoriId: 'logam',
    kategoriNama: 'Logam & Kaleng',
    nama: 'Kaleng Minuman Aluminium (UBC)',
    hargaPerSatuan: 13000,
    satuan: 'kg',
    kualitas: 'Kaleng soda/larutan aluminium asli, tidak menempel magnet',
    tips: 'Injak kaleng hingga pipih agar muat banyak dan hemat tempat.',
    trenHarga: 'naik',
    terakhirDiperbarui: '2026-09-06',
    bisaDiterima: true,
    kodeReferensi: 'LG-01',
  },
  {
    id: 'besi-campur',
    kategoriId: 'logam',
    kategoriNama: 'Logam & Kaleng',
    nama: 'Besi Tua / Seng / Plat Logam',
    hargaPerSatuan: 4500,
    satuan: 'kg',
    kualitas: 'Besi plat, paku, pipa besi, kawat pagar, seng atap bekas',
    tips: 'Hati-hati ujung tajam, letakkan di wadah kaleng atau karung kuat.',
    trenHarga: 'stabil',
    terakhirDiperbarui: '2026-09-01',
    bisaDiterima: true,
    kodeReferensi: 'LG-02',
  },
  {
    id: 'kaleng-susu',
    kategoriId: 'logam',
    kategoriNama: 'Logam & Kaleng',
    nama: 'Kaleng Susu & Biskuit (Besi Kaleng)',
    hargaPerSatuan: 3000,
    satuan: 'kg',
    kualitas: 'Kaleng kental manis, kaleng biskuit, kaleng sarden bersih',
    tips: 'Bilas sisa makanan/susu agar tidak berbau dan mengundang semut.',
    trenHarga: 'stabil',
    terakhirDiperbarui: '2026-09-01',
    bisaDiterima: true,
    kodeReferensi: 'LG-03',
  },
  {
    id: 'tembaga-kuningan',
    kategoriId: 'logam',
    kategoriNama: 'Logam & Kaleng',
    nama: 'Tembaga Kabel Kupas & Kuningan',
    hargaPerSatuan: 75000,
    satuan: 'kg',
    kualitas: 'Tembaga bersih berkilau tanpa lapisan isolator plastik, kran kuningan',
    tips: 'Komoditas bernilai sangat tinggi, timbang di timbangan presisi petugas.',
    trenHarga: 'naik',
    terakhirDiperbarui: '2026-09-07',
    bisaDiterima: true,
    kodeReferensi: 'LG-04',
  },

  // 4. Kaca & Beling
  {
    id: 'botol-kaca-kecap',
    kategoriId: 'kaca',
    kategoriNama: 'Kaca & Beling',
    nama: 'Botol Kaca Kecap / Sirup / Saus (Utuh)',
    hargaPerSatuan: 1200,
    satuan: 'kg',
    kualitas: 'Botol utuh tidak gompal/retak, dibilas bersih dari cairan sisa',
    tips: 'Gunakan krat atau kardus bersekat agar tidak saling membentur.',
    trenHarga: 'stabil',
    terakhirDiperbarui: '2026-09-01',
    bisaDiterima: true,
    kodeReferensi: 'KC-01',
  },
  {
    id: 'pecahan-kaca-bersih',
    kategoriId: 'kaca',
    kategoriNama: 'Kaca & Beling',
    nama: 'Pecahan Kaca Bening & Berwarna',
    hargaPerSatuan: 500,
    satuan: 'kg',
    kualitas: 'Pecahan beling bersih bebas tanah/debu, dimasukkan karung tebal',
    tips: 'Beri tanda awas kaca pecah pada karung demi keselamatan petugas.',
    trenHarga: 'turun',
    terakhirDiperbarui: '2026-09-01',
    bisaDiterima: true,
    kodeReferensi: 'KC-02',
  },

  // 5. Minyak Jelantah
  {
    id: 'minyak-jelantah-saring',
    kategoriId: 'minyak_jelantah',
    kategoriNama: 'Minyak Jelantah',
    nama: 'Minyak Jelantah Rumah Tangga (Tersaring)',
    hargaPerSatuan: 7000,
    satuan: 'liter',
    kualitas: 'Disaring dari ampas gorengan/tepung, tidak tercampur air atau sabun',
    tips: 'Simpan di botol air mineral atau jerigen bekas yang tertutup rapat.',
    trenHarga: 'naik',
    terakhirDiperbarui: '2026-09-08',
    bisaDiterima: true,
    kodeReferensi: 'MJ-01',
  },

  // 6. Elektronik & E-Waste
  {
    id: 'kabel-elektronik',
    kategoriId: 'elektronik',
    kategoriNama: 'Elektronik & E-Waste',
    nama: 'Kabel Rusak, Charger & Adaptor Bekas',
    hargaPerSatuan: 8000,
    satuan: 'kg',
    kualitas: 'Kabel tembaga lapis plastik, adaptor HP/laptop yang sudah mati',
    tips: 'Ikat kabel agar rapi dan tidak terlilit saat proses penimbangan.',
    trenHarga: 'stabil',
    terakhirDiperbarui: '2026-09-01',
    bisaDiterima: true,
    kodeReferensi: 'EW-01',
  },
  {
    id: 'pcb-komponen',
    kategoriId: 'elektronik',
    kategoriNama: 'Elektronik & E-Waste',
    nama: 'Motherboard / Komponen PCB Elektronik',
    hargaPerSatuan: 22000,
    satuan: 'kg',
    kualitas: 'Papan PCB komputer, TV, DVD, bebas rangka plastik tebal',
    tips: 'Hindari patahan yang merusak sirkuit jika memungkinkan.',
    trenHarga: 'naik',
    terakhirDiperbarui: '2026-09-06',
    bisaDiterima: true,
    kodeReferensi: 'EW-02',
  },
  {
    id: 'hp-mati',
    kategoriId: 'elektronik',
    kategoriNama: 'Elektronik & E-Waste',
    nama: 'Handphone / Smartphone Mati Total',
    hargaPerSatuan: 15000,
    satuan: 'buah',
    kualitas: 'Mesin masih utuh (bukan casing kosong), baterai tidak bocor/kembung parah',
    tips: 'Lepas kartu SIM dan kartu memori Anda sebelum disetorkan.',
    trenHarga: 'stabil',
    terakhirDiperbarui: '2026-09-01',
    bisaDiterima: true,
    kodeReferensi: 'EW-03',
  },
];

const LOCAL_STORAGE_KEY = 'bank_sampah_katalog_harga_v1';

export function getStoredKatalogHarga(): KatalogHargaItem[] {
  if (typeof window === 'undefined') {
    return INITIAL_KATALOG_HARGA;
  }
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading katalog harga from storage:', err);
  }
  return INITIAL_KATALOG_HARGA;
}

export function saveStoredKatalogHarga(items: KatalogHargaItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('katalog_harga_updated'));
  } catch (err) {
    console.error('Error saving katalog harga to storage:', err);
  }
}

export function resetStoredKatalogHarga(): KatalogHargaItem[] {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      window.dispatchEvent(new Event('katalog_harga_updated'));
    } catch {
      // ignore
    }
  }
  return INITIAL_KATALOG_HARGA;
}
