export interface EducationArticle {
  id: string;
  title: string;
  category: 'Panduan' | 'Pengumuman' | 'Tips Daur Ulang' | 'Inspirasi' | 'Jadwal & Lokasi';
  summary: string;
  content: string;
  coverImage: string;
  author: string;
  authorRole: string;
  publishedAt: string; // YYYY-MM-DD
  isPublished: boolean;
  tags: string[];
  readTimeMinutes: number;
  viewsCount: number;
  isPinned?: boolean;
}

export const ARTICLE_CATEGORIES = [
  'Panduan',
  'Pengumuman',
  'Tips Daur Ulang',
  'Inspirasi',
  'Jadwal & Lokasi',
] as const;

export const INITIAL_ARTICLES: EducationArticle[] = [
  {
    id: 'ART-001',
    title: 'Panduan Praktis Memilah Sampah Plastik Rumah Tangga Bernilai Jual Tinggi',
    category: 'Panduan',
    summary: 'Ketahui cara membedakan jenis plastik PET, HDPE, dan PP serta trik membersihkannya agar dihargai maksimal saat penimbangan di Bank Sampah.',
    content: `Memilah sampah plastik dari rumah merupakan langkah paling krusial dalam rantai ekonomi sirkular. Banyak warga belum mengetahui bahwa sampah plastik yang bersih dan terpilah memiliki nilai jual hingga 3 kali lipat lebih tinggi dibandingkan plastik campur aduk.

### 1. Kenali Kode dan Jenis Plastik yang Diterima
- **PET / PETE (Kode 1)**: Botol air mineral bening, botol jus, wadah minyak goreng. Harganya paling stabil di pasar daur ulang.
- **HDPE (Kode 2)**: Botol sampo tebal, botol deterjen, jeriken putih susu. Memiliki nilai daur ulang sangat tinggi karena mudah dilebur kembali.
- **PP (Kode 5)**: Gelas plastik air mineral, wadah makanan thinwall, sedotan, tutup botol galon.

### 2. Trik 3 Langkah: Cuci - Keringkan - Pipihkan
1. **Bilas Sisa Minuman/Kotoran**: Jangan biarkan ada sisa manis atau minyak di dalam botol karena memicu jamur dan bau tidak sedap.
2. **Keringkan**: Tiriskan botol sebelum dimasukkan ke dalam karung simpanan.
3. **Pipihkan / Gepengkan**: Injak atau remas botol hingga pipih. Ini menghemat hingga 70% ruang penyimpanan di rumah Anda dan mempermudah pengangkutan petugas pos timbang.

### 3. Pisahkan Tutup dan Label
Lepaskan tutup botol dan plastik label pembungkus merek jika memungkinkan. Tutup botol biasanya terbuat dari HDPE/PP yang dapat ditimbang terpisah dengan harga premium.

Mari jadikan rumah kita pelopor kelestarian lingkungan dan raih tabungan keluarga yang berkah!`,
    coverImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80',
    author: 'Pengurus Bank Sampah UCIDA',
    authorRole: 'Koordinator Edukasi Warga',
    publishedAt: '2026-09-05',
    isPublished: true,
    tags: ['Plastik', 'Pemilahan', 'Tips Rumahan', 'Nilai Jual'],
    readTimeMinutes: 4,
    viewsCount: 142,
    isPinned: true,
  },
  {
    id: 'ART-002',
    title: 'Minyak Jelantah Jadi Cuan: Bahaya Dibuang ke Saluran & Cara Setor yang Benar',
    category: 'Tips Daur Ulang',
    summary: 'Jangan buang minyak bekas goreng ke wastafel! Kumpulkan dalam jeriken dan tukarkan menjadi saldo tabungan bank sampah hingga Rp 7.500/liter.',
    content: `Membuang 1 liter minyak jelantah ke saluran pembuangan air dapat mencemari hingga 1.000.000 liter air tanah dan menyebabkan penyumbatan pipa paralon drainase rumah tangga.

### Dampak Buruk Membuang Jelantah Sembarangan:
- Menggumpal dan membatu di gorong-gorong (fatberg) sehingga memicu banjir saat musim hujan.
- Menutup pori-pori tanah dan meracuni mikroorganisme penyubur tanah.
- Mencemari sumber air sumur warga sekitar.

### Cara Mengumpulkan Jelantah yang Bernilai Tinggi:
1. **Tunggu Hingga Dingin**: Biarkan minyak sisa memasak dingin secara alami.
2. **Saring Ampas**: Gunakan saringan teh atau kain tipis saat menuang minyak ke dalam botol/jeriken agar terbebas dari remah gosong makanan.
3. **Simpan dalam Wadah Tertutup**: Gunakan botol PET bekas atau jeriken khusus. Jangan dicampur dengan air atau cairan sabun.
4. **Setor Saat Jadwal Timbang**: Bawa wadah jelantah ke pos bank sampah terdekat.

Minyak jelantah yang Anda setorkan akan diproses menjadi bahan bakar ramah lingkungan (Biodiesel B35) dan lilin aromaterapi!`,
    coverImage: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=80',
    author: 'Hendri Pratama',
    authorRole: 'Admin Kasir & Timbang',
    publishedAt: '2026-09-02',
    isPublished: true,
    tags: ['Minyak Jelantah', 'Biodiesel', 'Cegah Banjir', 'Tabungan'],
    readTimeMinutes: 3,
    viewsCount: 98,
    isPinned: true,
  },
  {
    id: 'ART-003',
    title: 'Pengumuman: Jadwal Penimbangan Akbar & Penyesuaian Harga Kardus & Kertas',
    category: 'Pengumuman',
    summary: 'Informasi jadwal penimbangan serentak seluruh RW akhir pekan ini dan update harga komoditas kertas duplex & kardus tebal.',
    content: `Diberitahukan kepada seluruh Nasabah Bank Sampah UCIDA LESTARI yang terhormat,

Sehubungan dengan agenda rutin bulanan dan evaluasi harga pasar daur ulang regional, berikut kami sampaikan beberapa informasi penting:

### 1. Jadwal Penimbangan Akbar Serentak
- **Hari / Tanggal**: Minggu, 13 September 2026
- **Waktu**: Pukul 07.30 - 11.30 WIB
- **Lokasi Utama**: Posko Balai Warga RW 05 (Depan Taman Pintar)
- **Fasilitas**: 2 unit timbangan digital kapasitas 150 kg (bebas antre panjang)

### 2. Update Harga Komoditas Daur Ulang:
- **Kardus Gelombang (Box Tebal)**: Naik menjadi **Rp 2.600 / kg** (sebelumnya Rp 2.400 / kg)
- **Kertas Putih HVS / Arsip Kantor**: **Rp 3.000 / kg**
- **Kaleng Aluminium Softdrink**: **Rp 12.500 / kg**
- **Botol PET Bening Bersih**: **Rp 4.000 / kg**

### 3. Layanan Penarikan Saldo Tunai & Konversi Emas
Bagi nasabah yang ingin mencairkan saldo tabungan atau melakukan konversi poin ke tabungan emas batangan mini, silakan membawa Buku Tabungan / Kartu Identitas Nasabah Anda ke loket kasir saat acara berlangsung.

Terima kasih atas partisipasi aktif seluruh warga dalam mewujudkan lingkungan RW yang asri, bersih, dan berdaya secara ekonomi.`,
    coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    author: 'Pengurus Bank Sampah UCIDA',
    authorRole: 'Sekretariat Unit',
    publishedAt: '2026-09-06',
    isPublished: true,
    tags: ['Jadwal Timbang', 'Harga Terbaru', 'Pengumuman', 'RW 05'],
    readTimeMinutes: 2,
    viewsCount: 215,
    isPinned: false,
  },
  {
    id: 'ART-004',
    title: 'Kisah Inspiratif: Ibu Siti Sukses Beli Perlengkapan Sekolah Anak dari Hasil Pilah Sampah',
    category: 'Inspirasi',
    summary: 'Simak cerita nyata kegigihan Ibu Siti mengumpulkan sampah organik dan anorganik secara konsisten selama 6 bulan.',
    content: `Konsistensi membuahkan hasil manis. Ibu Siti Rahma (42 tahun), salah satu nasabah teladan Bank Sampah UCIDA LESTARI, membuktikan bahwa sampah bukanlah barang tak berguna jika dikelola dengan cermat.

Awalnya, Ibu Siti hanya menyisihkan kardus belanjaan dan botol plastik sisa konsumsi rumah tangganya setiap hari di sudut teras rumah. Setiap dua pekan sekali, beliau rutin menyetorkannya ke pos penimbangan RW.

"Saya tidak menyangka, awalnya hanya ingin halaman rumah rapi tanpa sampah plastik menumpuk. Tapi setelah 6 bulan rutin menimbang dan saldo tabungan tidak saya ambil, terkumpul lebih dari Rp 850.000! Uang ini langsung saya gunakan untuk membeli seragam dan tas sekolah baru anak saya menjelang tahun ajaran baru," ujar Ibu Siti dengan penuh senyum.

Selain mendapat keuntungan finansial, Ibu Siti kini juga menjadi relawan penggerak ibu-ibu PKK di lingkungannya untuk mulai membuat kompos sisa sayuran dan menolak kantong plastik sekali pakai.

Semoga kisah Ibu Siti menginspirasi kita semua bahwa langkah kecil dari dapur rumah tangga kita mampu membawa dampak besar bagi masa depan keluarga dan bumi kita tercinta.`,
    coverImage: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80',
    author: 'Tim Komunikasi UCIDA',
    authorRole: 'Redaksi Buletin Warga',
    publishedAt: '2026-08-28',
    isPublished: true,
    tags: ['Inspirasi', 'Kisah Nyata', 'Tabungan Berkah', 'Pahlawan Lingkungan'],
    readTimeMinutes: 3,
    viewsCount: 310,
    isPinned: false,
  },
];

const STORAGE_KEY_ARTICLES = 'ucida_education_articles_v1';

export function getStoredArticles(): EducationArticle[] {
  if (typeof window === 'undefined') {
    return INITIAL_ARTICLES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ARTICLES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(INITIAL_ARTICLES));
      return INITIAL_ARTICLES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_ARTICLES;
  } catch (err) {
    console.error('Failed to load articles from storage', err);
    return INITIAL_ARTICLES;
  }
}

export function saveStoredArticles(articles: EducationArticle[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(articles));
  } catch (err) {
    console.error('Failed to save articles to storage', err);
  }
}
