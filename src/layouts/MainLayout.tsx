import React from 'react';
import { useApp } from '../context/AppContext';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { GlobalSearchModal } from '../components/GlobalSearchModal';
import { AudioPlayerModal } from '../components/AudioPlayerModal';

// Pages
import { Dashboard } from '../pages/Dashboard';
import { Sotuvlar } from '../pages/Sotuvlar';
import { Mijozlar } from '../pages/Mijozlar';
import { Qongiroqlar } from '../pages/Qongiroqlar';
import { Ombor } from '../pages/Ombor';
import { IshlabChiqarish } from '../pages/IshlabChiqarish';
import { Stanoklar } from '../pages/Stanoklar';
import { Moliya } from '../pages/Moliya';
import { Chiqindilar } from '../pages/Chiqindilar';
import { Hisobotlar } from '../pages/Hisobotlar';
import { Sozlamalar } from '../pages/Sozlamalar';

export const MainLayout: React.FC = () => {
  const { activePage } = useApp();

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'sotuvlar':
        return <Sotuvlar />;
      case 'mijozlar':
        return <Mijozlar />;
      case 'qongiroqlar':
        return <Qongiroqlar />;
      case 'ombor':
        return <Ombor />;
      case 'ishlab_chiqarish':
        return <IshlabChiqarish />;
      case 'stanoklar':
        return <Stanoklar />;
      case 'moliya':
        return <Moliya />;
      case 'chiqindilar':
        return <Chiqindilar />;
      case 'hisobotlar':
        return <Hisobotlar />;
      case 'sozlamalar':
        return <Sozlamalar />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Sidebar (Desktop fixed 72 width, Mobile drawer) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-slate-200/80 text-center text-xs text-slate-400 bg-white/50">
          <span>SOLAR NOVA ENERGY © 2026 • Quyosh panellari va geliotizimlar ishlab chiqarish boshqaruv tizimi (DEMO)</span>
        </footer>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal />
      <AudioPlayerModal />
    </div>
  );
};
