import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'ECO Least - Sistem Informasi Bank Sampah',
  description: 'Sistem Informasi Bank Sampah Terpadu 3 Tingkat: Forum Desa, Bank Unit RW/RT, dan Nasabah Warga.',
  openGraph: {
    title: 'ECO Least - Sistem Informasi Bank Sampah',
    description: 'Sistem Informasi Bank Sampah Terpadu 3 Tingkat: Forum Desa, Bank Unit RW/RT, dan Nasabah Warga.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ECO Least - Sistem Informasi Bank Sampah',
    description: 'Sistem Informasi Bank Sampah Terpadu 3 Tingkat: Forum Desa, Bank Unit RW/RT, dan Nasabah Warga.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
