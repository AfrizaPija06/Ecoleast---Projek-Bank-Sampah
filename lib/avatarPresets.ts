// Koleksi preset foto profil avatar bank sampah UCIDA LESTARI

export interface AvatarPreset {
  id: string;
  name: string;
  category: 'Warga' | 'Petugas' | 'Maskot';
  description: string;
  dataUrl: string;
}

// Helper untuk membuat SVG data URI
function svgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'siti-rahma',
    name: 'Siti Rahma',
    category: 'Warga',
    description: 'Ibu Kader Penggerak Bank Sampah',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="bgSiti" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#E2F4F0"/>
            <stop offset="100%" stop-color="#B2E2D7"/>
          </linearGradient>
          <linearGradient id="hijabGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1B635A"/>
            <stop offset="100%" stop-color="#134740"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bgSiti)"/>
        <!-- Hijab base -->
        <path d="M22 88 C22 55, 30 26, 50 26 C70 26, 78 55, 78 88 Z" fill="url(#hijabGrad)"/>
        <!-- Face oval -->
        <ellipse cx="50" cy="53" rx="17" ry="20" fill="#FBD5BE"/>
        <!-- Hijab fold wrap -->
        <path d="M33 50 C33 34, 42 32, 50 32 C58 32, 67 34, 67 50 C67 65, 59 74, 50 74 C41 74, 33 65, 33 50 Z" fill="#1B635A" opacity="0.15"/>
        <path d="M34 52 C34 38, 42 35, 50 35 C58 35, 66 38, 66 52 C66 64, 58 72, 50 72 C42 72, 34 64, 34 52 Z" fill="#FCD9C4"/>
        <!-- Eyes -->
        <ellipse cx="44" cy="51" rx="2.2" ry="2.8" fill="#2E241E"/>
        <ellipse cx="56" cy="51" rx="2.2" ry="2.8" fill="#2E241E"/>
        <circle cx="45" cy="50" r="0.8" fill="#FFFFFF"/>
        <circle cx="57" cy="50" r="0.8" fill="#FFFFFF"/>
        <!-- Eyebrows -->
        <path d="M41 46 Q44 44 47 46" stroke="#5A3A28" stroke-width="1.2" stroke-linecap="round" fill="none"/>
        <path d="M53 46 Q56 44 59 46" stroke="#5A3A28" stroke-width="1.2" stroke-linecap="round" fill="none"/>
        <!-- Smile -->
        <path d="M46 60 Q50 64 54 60" stroke="#C06254" stroke-width="1.6" stroke-linecap="round" fill="none"/>
        <!-- Cheeks -->
        <circle cx="42" cy="56" r="3" fill="#F49E8D" opacity="0.45"/>
        <circle cx="58" cy="56" r="3" fill="#F49E8D" opacity="0.45"/>
        <!-- Hijab drape on shoulders -->
        <path d="M30 84 C38 78, 62 78, 70 84 L78 100 L22 100 Z" fill="#155149"/>
        <!-- Small eco leaf broach on chest -->
        <path d="M50 82 C53 76, 58 76, 60 80 C58 84, 52 84, 50 82 Z" fill="#52B788"/>
      </svg>
    `),
  },
  {
    id: 'budi-santoso',
    name: 'Pak Budi Santoso',
    category: 'Warga',
    description: 'Nasabah Teladan & Pahlawan Lingkungan',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="bgBudi" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#E0F2FE"/>
            <stop offset="100%" stop-color="#BAE6FD"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bgBudi)"/>
        <!-- Shoulders & Shirt -->
        <path d="M20 96 C22 76, 36 72, 50 72 C64 72, 78 76, 80 96 Z" fill="#0369A1"/>
        <path d="M45 72 L50 82 L55 72 Z" fill="#F6C39F"/>
        <!-- Neck -->
        <rect x="44" y="63" width="12" height="12" rx="4" fill="#F6C39F"/>
        <!-- Head -->
        <ellipse cx="50" cy="49" rx="17" ry="20" fill="#FCD9C4"/>
        <!-- Hair -->
        <path d="M33 46 C32 30, 42 24, 50 24 C58 24, 68 30, 67 46 C64 36, 58 32, 50 33 C42 32, 36 36, 33 46 Z" fill="#1F2937"/>
        <!-- Ears -->
        <circle cx="33" cy="50" r="4" fill="#FCD9C4"/>
        <circle cx="67" cy="50" r="4" fill="#FCD9C4"/>
        <!-- Eyes -->
        <circle cx="44" cy="48" r="2.2" fill="#1F2937"/>
        <circle cx="56" cy="48" r="2.2" fill="#1F2937"/>
        <!-- Eyebrows -->
        <path d="M41 43 Q44 41 47 43" stroke="#1F2937" stroke-width="1.5" stroke-linecap="round" fill="none"/>
        <path d="M53 43 Q56 41 59 43" stroke="#1F2937" stroke-width="1.5" stroke-linecap="round" fill="none"/>
        <!-- Friendly Smile -->
        <path d="M46 58 Q50 63 54 58" stroke="#9A3412" stroke-width="1.6" stroke-linecap="round" fill="none"/>
      </svg>
    `),
  },
  {
    id: 'petugas-ucida',
    name: 'Petugas UCIDA',
    category: 'Petugas',
    description: 'Petugas Penimbangan & Verifikator',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="bgPetugas" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FEF3C7"/>
            <stop offset="100%" stop-color="#FDE68A"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bgPetugas)"/>
        <!-- Vest/Body -->
        <path d="M22 96 C24 74, 38 70, 50 70 C62 70, 76 74, 78 96 Z" fill="#0D9488"/>
        <!-- Hi-vis stripe -->
        <path d="M34 76 L34 96 M66 76 L66 96" stroke="#FBBF24" stroke-width="4"/>
        <!-- Neck -->
        <rect x="44" y="60" width="12" height="12" rx="4" fill="#F8CBA6"/>
        <!-- Head -->
        <ellipse cx="50" cy="48" rx="17" ry="19" fill="#FCD9C4"/>
        <!-- UCIDA Cap -->
        <path d="M31 38 C31 24, 69 24, 69 38 Z" fill="#115E59"/>
        <path d="M28 38 Q50 32 72 38 Q74 44 50 42 Q26 44 28 38 Z" fill="#0F766E"/>
        <circle cx="50" cy="30" r="3" fill="#FBBF24"/>
        <!-- Eyes & glasses -->
        <rect x="39" y="44" width="9" height="7" rx="2" fill="none" stroke="#374151" stroke-width="1.4"/>
        <rect x="52" y="44" width="9" height="7" rx="2" fill="none" stroke="#374151" stroke-width="1.4"/>
        <line x1="48" y1="47" x2="52" y2="47" stroke="#374151" stroke-width="1.4"/>
        <circle cx="43.5" cy="47.5" r="1.5" fill="#1F2937"/>
        <circle cx="56.5" cy="47.5" r="1.5" fill="#1F2937"/>
        <!-- Smile -->
        <path d="M46 56 Q50 60 54 56" stroke="#9A3412" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      </svg>
    `),
  },
  {
    id: 'dewi-lestari',
    name: 'Dewi Lestari',
    category: 'Warga',
    description: 'Penyelamat Bumi Aktif',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="bgDewi" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FCE7F3"/>
            <stop offset="100%" stop-color="#FBCFE8"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bgDewi)"/>
        <!-- Shirt -->
        <path d="M22 96 C24 74, 38 70, 50 70 C62 70, 76 74, 78 96 Z" fill="#BE185D"/>
        <!-- Neck -->
        <rect x="44" y="60" width="12" height="12" fill="#FAD0C4"/>
        <!-- Long Hair Back -->
        <path d="M30 40 C28 65, 34 85, 34 85 C34 85, 66 85, 66 85 C66 85, 72 65, 70 40 Z" fill="#312E81"/>
        <!-- Head -->
        <ellipse cx="50" cy="48" rx="16" ry="19" fill="#FCD9C4"/>
        <!-- Hair Front -->
        <path d="M32 45 C32 30, 42 24, 50 24 C58 24, 68 30, 68 45 C64 35, 56 32, 50 33 C44 32, 36 35, 32 45 Z" fill="#312E81"/>
        <!-- Eyes -->
        <ellipse cx="44" cy="47" rx="2" ry="2.5" fill="#1E1B4B"/>
        <ellipse cx="56" cy="47" rx="2" ry="2.5" fill="#1E1B4B"/>
        <circle cx="45" cy="46" r="0.7" fill="#FFFFFF"/>
        <circle cx="57" cy="46" r="0.7" fill="#FFFFFF"/>
        <path d="M46 56 Q50 61 54 56" stroke="#9D174D" stroke-width="1.6" stroke-linecap="round" fill="none"/>
        <circle cx="41" cy="52" r="3" fill="#F472B6" opacity="0.4"/>
        <circle cx="59" cy="52" r="3" fill="#F472B6" opacity="0.4"/>
      </svg>
    `),
  },
  {
    id: 'maskot-tunas',
    name: 'Tunas Lestari',
    category: 'Maskot',
    description: 'Maskot Resmi UCIDA LESTARI',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="bgTunas" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#DCFCE7"/>
            <stop offset="100%" stop-color="#BBF7D0"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bgTunas)"/>
        <!-- Plant pot / Seed base -->
        <ellipse cx="50" cy="68" rx="24" ry="18" fill="#4B382A"/>
        <path d="M26 68 L32 90 L68 90 L74 68 Z" fill="#8D5B4C"/>
        <!-- Recycled pot band -->
        <rect x="28" y="74" width="44" height="6" rx="2" fill="#A16207"/>
        <!-- Sprout Body -->
        <circle cx="50" cy="50" r="18" fill="#4ADE80"/>
        <!-- Eyes -->
        <circle cx="44" cy="48" r="3.2" fill="#14532D"/>
        <circle cx="56" cy="48" r="3.2" fill="#14532D"/>
        <circle cx="45" cy="46.5" r="1.2" fill="#FFFFFF"/>
        <circle cx="57" cy="46.5" r="1.2" fill="#FFFFFF"/>
        <!-- Rosy Cheeks -->
        <circle cx="39" cy="54" r="3" fill="#F87171" opacity="0.7"/>
        <circle cx="61" cy="54" r="3" fill="#F87171" opacity="0.7"/>
        <!-- Big happy smile -->
        <path d="M46 54 Q50 60 54 54" stroke="#14532D" stroke-width="2" stroke-linecap="round" fill="none"/>
        <!-- Sprouting Leaves on Top -->
        <path d="M50 32 C42 16, 26 22, 34 32 C42 38, 48 34, 50 32 Z" fill="#22C55E"/>
        <path d="M50 32 C58 16, 74 22, 66 32 C58 38, 52 34, 50 32 Z" fill="#16A34A"/>
        <path d="M50 34 L50 26" stroke="#15803D" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `),
  },
  {
    id: 'maskot-bumi',
    name: 'Bumi Sehat',
    category: 'Maskot',
    description: 'Pelindung Iklim & Daur Ulang',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="bgBumi" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#E0F2FE"/>
            <stop offset="100%" stop-color="#BAE6FD"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bgBumi)"/>
        <!-- Globe Body -->
        <circle cx="50" cy="50" r="34" fill="#0284C7"/>
        <!-- Continents (Green patches) -->
        <path d="M30 38 Q42 32 46 42 Q40 54 32 50 Z" fill="#22C55E"/>
        <path d="M52 28 Q68 28 66 42 Q58 46 52 38 Z" fill="#22C55E"/>
        <path d="M54 52 Q72 50 68 68 Q52 72 50 62 Z" fill="#22C55E"/>
        <path d="M28 58 Q38 60 36 72 Q24 70 28 58 Z" fill="#22C55E"/>
        <!-- Face -->
        <circle cx="44" cy="50" r="2.5" fill="#0F172A"/>
        <circle cx="56" cy="50" r="2.5" fill="#0F172A"/>
        <circle cx="45" cy="49" r="0.8" fill="#FFFFFF"/>
        <circle cx="57" cy="49" r="0.8" fill="#FFFFFF"/>
        <!-- Blush -->
        <circle cx="40" cy="55" r="2.5" fill="#F43F5E" opacity="0.6"/>
        <circle cx="60" cy="55" r="2.5" fill="#F43F5E" opacity="0.6"/>
        <!-- Smile -->
        <path d="M46 55 Q50 60 54 55" stroke="#0F172A" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        <!-- Leaf Ribbon on Head -->
        <path d="M50 18 C42 8, 30 14, 38 22 C44 26, 48 22, 50 18 Z" fill="#16A34A"/>
        <path d="M50 18 C58 8, 70 14, 62 22 C56 26, 52 22, 50 18 Z" fill="#22C55E"/>
      </svg>
    `),
  },
];

// Utility: Resize/compress image file to max 400x400 data URL for lightweight localStorage storage
export function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File yang dipilih harus berupa gambar (JPG, PNG, WEBP, GIF).'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 360;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Export to JPEG with good balance
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Gagal memproses file gambar.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Gagal membaca file dari perangkat.'));
    reader.readAsDataURL(file);
  });
}
