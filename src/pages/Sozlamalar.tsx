import React, { useState } from 'react';
import {
  Settings,
  Building,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Save,
  Globe,
  Coins,
  Cpu,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SolarNovaLogo } from '../components/SolarNovaLogo';

export const Sozlamalar: React.FC = () => {
  const { resetToDefaultData } = useApp();
  const [isResetDone, setIsResetDone] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [companyName, setCompanyName] = useState('SOLAR NOVA ENERGY MCHJ');
  const [brandTitle, setBrandTitle] = useState('Solar Nova — Quyosh energiyasi va geliotizimlar');
  const [factoryAddress, setFactoryAddress] = useState('Toshkent viloyati, Zangiota tumani, Quyoshli sanoat zonasi, 8-bino');
  const [phone, setPhone] = useState('+998 71 200 88 44');
  const [inn, setInn] = useState('309482019');
  const [mfo, setMfo] = useState('00440');
  const [bankAccount, setBankAccount] = useState('20208000700593819001');

  const handleReset = () => {
    if (window.confirm('Haqiqatan ham barcha ma’lumotlarni boshlang‘ich DEMO holatiga qaytarmoqchimisiz?')) {
      resetToDefaultData();
      setIsResetDone(true);
      setTimeout(() => setIsResetDone(false), 3500);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Tizim sozlamalari
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Korxona rekvizitlari, tizim parametrlari va DEMO ma’lumotlar boshqaruvi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SolarNovaLogo variant="full" size="sm" />
        </div>
      </div>

      {isResetDone && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-semibold animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Barcha DEMO ma’lumotlar (sotuvlar, ombor, ishlab chiqarish va hisoblar) muvaffaqiyatli boshlang‘ich holatga qaytarildi!</span>
        </div>
      )}

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-semibold animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Sozlamalar va korxona rekvizitlari saqlandi!</span>
        </div>
      )}

      {/* Brand & Logo Identity Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <ImageIcon className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-base font-black text-slate-900">
                Rasmiy korxona logotipi va brendi
              </h3>
              <p className="text-xs text-slate-500">
                Tizim paneli, hisobotlar va bosma hujjatlar uchun rasmiy Solar Nova logotipi
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Faol brend
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Light Theme Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center gap-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Och fonda ko‘rinishi</span>
            <div className="p-3 bg-white rounded-2xl shadow-xs border border-slate-200/80">
              <SolarNovaLogo variant="full" size="md" lightText={false} />
            </div>
            <span className="text-[11px] text-slate-500">Quyosh paneli, vakuumli suv isitgich va 3D Solar Nova yozuvi</span>
          </div>

          {/* Dark Theme Preview */}
          <div className="p-4 rounded-2xl bg-[#0F2942] border border-slate-800 flex flex-col items-center justify-center text-center gap-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">To‘q fonda ko‘rinishi (Sidebar)</span>
            <div className="p-3 bg-[#0A1E32] rounded-2xl shadow-inner border border-slate-800">
              <SolarNovaLogo variant="full" size="md" lightText={true} />
            </div>
            <span className="text-[11px] text-slate-300">Asosiy navigatsiya paneli uchun optimallashtirilgan</span>
          </div>
        </div>
      </div>

      {/* Enterprise Details Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <Building className="w-5 h-5 text-[#EA580C]" />
          <h3 className="text-base font-black text-slate-900">
            Korxona rekvizitlari va ishlab chiqarish manzili
          </h3>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">To‘liq yuridik nomi:</label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Brend / Savdo belgisi:</label>
              <input
                type="text"
                value={brandTitle}
                onChange={e => setBrandTitle(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Zavod / Sex joylashgan manzil:</label>
            <input
              type="text"
              value={factoryAddress}
              onChange={e => setFactoryAddress(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">INN (STIR):</label>
              <input
                type="text"
                value={inn}
                onChange={e => setInn(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">MFO:</label>
              <input
                type="text"
                value={mfo}
                onChange={e => setMfo(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Telefon:</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Bank hisob raqami (UZS):</label>
            <input
              type="text"
              value={bankAccount}
              onChange={e => setBankAccount(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-medium focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#EA580C] hover:bg-[#D44806] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Rekvizitlarni saqlash</span>
            </button>
          </div>
        </form>
      </div>

      {/* System Defaults */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          Tizim parametrlari
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block mb-1">Interfeys tili:</span>
            <strong className="text-slate-900 text-sm">O‘zbekcha (Lotin alifbosi)</strong>
            <p className="text-slate-500 text-[11px] mt-1">Barcha modullar, hisobotlar va menyular</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block mb-1">Asosiy valyuta:</span>
            <strong className="text-slate-900 text-sm">O‘zbekiston so‘mi (UZS)</strong>
            <p className="text-slate-500 text-[11px] mt-1">Naqd va bank hisob-kitoblari</p>
          </div>
        </div>
      </div>

      {/* DEMO Reset Section */}
      <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-200/80 space-y-4">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <h3 className="text-base font-black text-rose-950">
            DEMO ma’lumotlarni boshqarish
          </h3>
        </div>

        <p className="text-xs text-rose-800 leading-relaxed">
          Agar siz yangi buyurtmalar, xarajatlar yoki ombor harakatlarini kiritib ko‘rgan bo‘lsangiz va tizimni dastlabki toza ko‘rgazmali holatiga qaytarmoqchi bo‘lsangiz, quyidagi tugmani bosing. Bu barcha jadvallarni namunaviy ma’lumotlar bilan to‘ldiradi.
        </p>

        <button
          id="reset-demo-data-btn"
          onClick={handleReset}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Boshlang‘ich DEMO ma’lumotlarni qayta tiklash</span>
        </button>
      </div>
    </div>
  );
};
