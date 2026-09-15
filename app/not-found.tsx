export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-6 text-sm">Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.</p>
        <a 
          href="/" 
          className="inline-flex items-center justify-center px-6 py-2.5 bg-[#005596] hover:bg-[#003B6D] text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-95"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  )
}
