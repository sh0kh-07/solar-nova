import React from 'react';
import {
  Menu,
  Search,
  Plus,
  AlertTriangle,
  Calendar,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    activePage,
    setActivePage,
    setSidebarOpen,
    setIsSearchOpen,
    rawMaterials,
    finishedProducts
  } = useApp();

  // Page titles and descriptions in Uzbek Latin
  const pageMeta: Record<string, { title: string; desc: string }> = {
    dashboard: {
      title: 'Bosh sahifa',
      desc: 'Ishlab chiqarish va savdoni bir joydan boshqaring'
    },
    sotuvlar: {
      title: 'Sotuvlar',
      desc: 'Buyurtmalar, shartnomalar va mijozlar bilan hisob-kitoblar'
    },
    mijozlar: {
      title: 'Mijozlar',
      desc: 'Qurilish kompaniyalari, DUK va doimiy hamkorlar bazasi'
    },
    qongiroqlar: {
      title: 'Qo‘ng‘iroqlar',
      desc: 'Mijozlar bilan suhbat yozuvlari va audio player DEMO'
    },
    ombor: {
      title: 'Ombor',
      desc: 'Xomashyo va tayyor mahsulotlar qoldig‘i va harakatlari'
    },
    moliya: {
      title: 'Moliya',
      desc: 'Kassa, bank hisoblari, tushumlar va xarajatlar nazorati'
    },
    ishlab_chiqarish: {
      title: 'Ishlab chiqarish',
      desc: 'Sex buyurtmalari, 8 bosqichli konveyer va reja monitoringi'
    },
    stanoklar: {
      title: 'Stanoklar',
      desc: 'Lazer kesish, press, payvandlash va bo‘yash kameralari'
    },
    chiqindilar: {
      title: 'Chiqindilar',
      desc: 'Metall parchalari, kukun bo‘yoq va utilizatsiya hisobi'
    },
    hisobotlar: {
      title: 'Hisobotlar',
      desc: 'Oylik savdo, ishlab chiqarish hajmi va xarajatlar tahlili'
    },
    sozlamalar: {
      title: 'Sozlamalar',
      desc: 'Tizim parametrlari, korxona rekvizitlari va DEMO ma’lumotlarni tiklash'
    }
  };

  const current = pageMeta[activePage] || {
    title: 'Solar Nova ERP',
    desc: 'Quyosh energiyasi va metall konstruksiyalar ishlab chiqarish boshqaruvi'
  };

  // Low stock check
  const lowStockCount =
    rawMaterials.filter(rm => rm.currentStock < rm.minStock).length +
    finishedProducts.filter(fp => fp.stock < fp.minStock).length;

  return (
    <header
      id="top-header"
      className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4"
    >
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          id="mobile-menu-btn"
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shrink-0"
          title="Menyu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight truncate flex items-center gap-2">
            <span>{current.title}</span>
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block truncate">
            {current.desc}
          </p>
        </div>
      </div>

      {/* Right: Search, Date, Low Stock, Quick Action */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Low Stock Indicator */}
        {lowStockCount > 0 && (
          <button
            onClick={() => setActivePage('ombor')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold hover:bg-amber-100 transition-colors"
            title="Omborda minimal qoldiqdan kam xomashyolar mavjud"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{lowStockCount} ta kam qoldiq</span>
          </button>
        )}

        {/* Global Search Trigger */}
        <button
          id="header-search-trigger"
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-2 sm:px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/80 text-sm font-medium transition-colors"
        >
          <Search className="w-4 h-4 text-slate-500" />
          <span className="hidden sm:inline text-xs text-slate-500">Qidirish...</span>
          <kbd className="hidden md:inline-block text-[10px] font-bold bg-white px-1.5 py-0.5 rounded text-slate-500 border border-slate-300">
            Ctrl+K
          </kbd>
        </button>

        {/* Date Display */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          <Calendar className="w-4 h-4 text-[#EA580C]" />
          <span>17-Sentabr, 2026</span>
        </div>

        {/* Quick Action Button */}
        {activePage !== 'sotuvlar' && (
          <button
            id="header-quick-new-sale-btn"
            onClick={() => setActivePage('sotuvlar')}
            className="flex items-center gap-1.5 bg-[#EA580C] hover:bg-[#D44806] text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">+ Yangi sotuv</span>
          </button>
        )}
      </div>
    </header>
  );
};
