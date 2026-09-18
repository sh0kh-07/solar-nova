import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  PhoneCall,
  Warehouse,
  Wallet,
  Factory,
  Cpu,
  Recycle,
  BarChart3,
  Settings,
  X,
  UserCheck,
  ChevronRight,
  FileSpreadsheet
} from 'lucide-react';
import { PageId } from '../types';
import { useApp } from '../context/AppContext';
import { SolarNovaLogo } from './SolarNovaLogo';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

export const Sidebar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    sidebarOpen,
    setSidebarOpen,
    openOrdersCount,
    activeProductionOrdersCount,
    unalignedInvoicesCount
  } = useApp();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Bosh sahifa', icon: LayoutDashboard },
    { id: 'sotuvlar', label: 'Sotuvlar', icon: ShoppingCart, badge: openOrdersCount },
    {
      id: 'hisob_faktura',
      label: 'Hisob-fakturalar',
      icon: FileSpreadsheet,
      badge: unalignedInvoicesCount > 0 ? `${unalignedInvoicesCount}!` : undefined
    },
    { id: 'mijozlar', label: 'Mijozlar', icon: Users },
    { id: 'qongiroqlar', label: 'Qo‘ng‘iroqlar', icon: PhoneCall },
    { id: 'ombor', label: 'Ombor', icon: Warehouse },
    { id: 'moliya', label: 'Moliya', icon: Wallet },
    { id: 'ishlab_chiqarish', label: 'Ishlab chiqarish', icon: Factory, badge: activeProductionOrdersCount },
    { id: 'stanoklar', label: 'Stanoklar', icon: Cpu },
    { id: 'chiqindilar', label: 'Chiqindilar', icon: Recycle },
    { id: 'hisobotlar', label: 'Hisobotlar', icon: BarChart3 }
  ];

  const handleNavClick = (id: PageId) => {
    setActivePage(id);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          id="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0F2942] text-slate-200 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header with Logo */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between bg-[#0A1E32]">
          <SolarNovaLogo variant="full" size="md" lightText={true} />
          <button
            id="close-sidebar-btn"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            title="Yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Company Subtitle Tagline */}
        <div className="px-5 py-2 bg-[#0C2237] border-b border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="font-medium text-amber-400/90">Quyosh energiyasi tizimlari</span>
          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Zavod faol
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
          <div className="px-3 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Asosiy bo‘limlar
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#EA580C] text-white shadow-md shadow-orange-950/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && Number(item.badge) > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-white text-[#EA580C]'
                        : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Section: Settings & User Profile */}
        <div className="p-3 border-t border-slate-800 bg-[#0A1E32] space-y-2">
          <button
            id="nav-link-sozlamalar"
            onClick={() => handleNavClick('sozlamalar')}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activePage === 'sozlamalar'
                ? 'bg-slate-700 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-slate-400" />
              <span>Sozlamalar</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          {/* User Profile Card */}
          <div
            id="user-profile-badge"
            className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800"
          >
            <div className="w-9 h-9 rounded-lg bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-bold shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">
                Alisher Rahimov
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                Bosh ishlab chiqarish boshqaruvchisi
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
