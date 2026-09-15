'use client';

import React, { useState } from 'react';
import { Nasabah, formatRupiah } from '@/lib/bankSampahData';
import { Wallet, X, Check, Banknote, Smartphone, Zap, AlertCircle } from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  nasabah: Nasabah;
  availableBalance: number;
  onClose: () => void;
  onConfirmWithdraw: (amount: number, method: string) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  nasabah,
  availableBalance,
  onClose,
  onConfirmWithdraw,
}) => {
  const [amount, setAmount] = useState<number>(
    availableBalance >= 50000 ? 50000 : availableBalance
  );
  const [method, setMethod] = useState<'tunai' | 'ewallet' | 'pln'>('tunai');
  const [accountNumber, setAccountNumber] = useState(nasabah.noTelepon);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleQuickAmount = (val: number) => {
    setAmount(Math.min(availableBalance, val));
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setErrorMsg('Nominal penarikan harus lebih dari Rp 0.');
      return;
    }
    if (amount > availableBalance) {
      setErrorMsg('Nominal melebihi saldo tabungan yang tersedia.');
      return;
    }

    let methodDesc = 'Tarik Tunai di Loket Bank Sampah';
    if (method === 'ewallet') {
      methodDesc = `Transfer E-Wallet ke ${accountNumber}`;
    } else if (method === 'pln') {
      methodDesc = `Konversi Token Listrik PLN ID ${accountNumber}`;
    }

    onConfirmWithdraw(amount, methodDesc);
    setSuccessMsg(`Berhasil mengajukan penarikan ${formatRupiah(amount)}!`);
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  return (
    <div
      id="withdraw-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="withdraw-modal-content"
        className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative my-6 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F0F7FC] border-b border-[#D0E5F5] text-gray-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#BAE6FD] flex items-center justify-center text-[#005596]">
              <Wallet className="w-4 h-4 text-[#005596]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#003B6D]">Tarik Saldo Tabungan</h3>
              <p className="text-xs text-[#1E4E79]">{nasabah.nama} ({nasabah.id})</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-[#003B6D] text-xs flex items-center gap-2 font-semibold">
              <Check className="w-4 h-4 text-[#005596] flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Saldo Aktif Card */}
          <div className="p-4 bg-[#F0F7FC] rounded-2xl border border-[#D0E5F5] text-center">
            <span className="text-xs text-[#1E4E79] font-medium">
              Saldo Tabungan Tersedia
            </span>
            <div className="text-2xl font-bold text-[#003B6D] mt-0.5 tracking-tight">
              {formatRupiah(availableBalance)}
            </div>
          </div>

          {/* Nominal Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Nominal Penarikan (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">
                Rp
              </span>
              <input
                type="number"
                min="1000"
                max={availableBalance}
                step="1000"
                value={amount === 0 ? '' : amount}
                onChange={(e) => {
                  setAmount(parseInt(e.target.value, 10) || 0);
                  setErrorMsg('');
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 text-sm focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] focus:outline-none"
                placeholder="0"
                required
              />
            </div>

            {/* Quick Presets */}
            <div className="flex gap-2 mt-2">
              {[25000, 50000, 100000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  disabled={preset > availableBalance}
                  onClick={() => handleQuickAmount(preset)}
                  className={`flex-1 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    amount === preset
                      ? 'border-[#005596] bg-sky-50 text-[#005596] font-bold'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed'
                  }`}
                >
                  {preset / 1000}rb
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleQuickAmount(availableBalance)}
                className={`flex-1 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  amount === availableBalance && availableBalance > 0
                    ? 'border-[#005596] bg-sky-50 text-[#005596] font-bold'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Semua
              </button>
            </div>
          </div>

          {/* Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Metode Penyaluran
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('tunai')}
                className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition-all ${
                  method === 'tunai'
                    ? 'border-[#005596] bg-sky-50 text-[#003B6D] font-bold ring-1 ring-[#005596]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Banknote className="w-5 h-5 text-[#005596]" />
                <span className="text-[11px] text-center">Tunai di Pos</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('ewallet')}
                className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition-all ${
                  method === 'ewallet'
                    ? 'border-[#005596] bg-sky-50 text-[#003B6D] font-bold ring-1 ring-[#005596]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Smartphone className="w-5 h-5 text-[#00A3E0]" />
                <span className="text-[11px] text-center">E-Wallet</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('pln')}
                className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition-all ${
                  method === 'pln'
                    ? 'border-[#005596] bg-sky-50 text-[#003B6D] font-bold ring-1 ring-[#005596]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="text-[11px] text-center">Token PLN</span>
              </button>
            </div>
          </div>

          {/* Account/Phone Field if e-wallet or PLN */}
          {method !== 'tunai' && (
            <div className="text-xs">
              <label className="block font-medium text-gray-700 mb-1">
                {method === 'ewallet' ? 'Nomor E-Wallet (DANA/OVO/GoPay)' : 'ID Pelanggan Listrik PLN'}
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-xs focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] focus:bg-white focus:outline-none"
                placeholder={method === 'ewallet' ? '08xxxxxxxx' : '12 digit nomor meteran PLN'}
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={amount <= 0 || amount > availableBalance}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-[#005596] hover:bg-[#004077] disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Konfirmasi Penarikan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
