import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'ECO LEAST - Sistem Informasi Bank Sampah Desa Cicadas',
  description: 'Sistem Informasi Bank Sampah Terpadu 3 Tingkat: Forum Desa, Bank Unit RW/RT, dan Nasabah Warga.',
  icons: {
    icon: [
      { url: '/logo.png', sizes: 'any' },
      { url: 'https://res.cloudinary.com/wyvqhb2n/image/upload/v1788945377/Aplikasi_Bank_Sampah_-_TIV_Citeureup_2026.png', sizes: 'image/png' },
      { url: 'https://res.cloudinary.com/wyvqhb2n/image/upload/v1788945377/Aplikasi_Bank_Sampah_-_TIV_Citeureup_2026.png', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'ECO LEAST - Sistem Informasi Bank Sampah Desa Cicadas',
    description: 'Sistem Informasi Bank Sampah Terpadu 3 Tingkat: Forum Desa, Bank Unit RW/RT, dan Nasabah Warga.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ECO LEAST - Sistem Informasi Bank Sampah Desa Cicadas',
    description: 'Sistem Informasi Bank Sampah Terpadu 3 Tingkat: Forum Desa, Bank Unit RW/RT, dan Nasabah Warga.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
