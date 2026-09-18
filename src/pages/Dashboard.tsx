import React from 'react';
import {
  TrendingUp,
  ArrowDownLeft,
  PackageCheck,
  Factory,
  Clock,
  ReceiptText,
  ArrowRight,
  Plus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SaleStatus } from '../types';

export const Dashboard: React.FC = () => {
  const {
    sales,
    productionOrders,
    finishedProductsStockCount,
    openOrdersCount,
    todaySalesAmount,
    todayIncomeAmount,
    todayExpensesAmount,
    activeProductionOrdersCount,
    setActivePage,
    setSelectedSaleId
  } = useApp();

  // Status badge styling helper
  const getStatusBadge = (status: SaleStatus) => {
    switch (status) {
      case 'Yangi':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Tasdiqlangan':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Ishlab chiqarishda':
        return 'bg-orange-50 text-[#EA580C] border-orange-200';
      case 'Tayyor':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Yetkazib berildi':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Yakunlangan':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Bekor qilingan':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0F2942] to-[#1E3E62] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-300 text-xs font-semibold mb-3 backdrop-blur-xs border border-white/10">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
            Po‘lat yoritish ustunlari zavodi • Jonli demo
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            Assalomu alaykum!
          </h2>
          <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed">
            Ishlab chiqarish va savdoni bir joydan boshqaring. Barcha sotuvlar, ombor qoldiqlari, sex konveyeri va moliyaviy oqimlar to‘liq nazorat ostida.
          </p>
        </div>

        {/* Decorative steel mast background silhouette */}
        <div className="absolute right-4 -bottom-6 opacity-15 pointer-events-none hidden md:block">
          <svg width="220" height="220" viewBox="0 0 100 100" fill="currentColor">
            <line x1="50" y1="100" x2="50" y2="10" stroke="white" strokeWidth="4" />
            <path d="M30 18 Q50 10 70 18" stroke="white" strokeWidth="3" fill="none" />
            <circle cx="28" cy="18" r="6" fill="#F97316" />
            <circle cx="72" cy="18" r="6" fill="#F97316" />
          </svg>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Bugungi sotuv */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Bugungi sotuv
            </span>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#EA580C] border border-orange-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {todaySalesAmount.toLocaleString()} <span className="text-sm font-semibold text-slate-500">so‘m</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Yangi tasdiqlangan buyurtmalar</p>
        </div>

        {/* Card 2: Bugungi tushum */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Bugungi tushum
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {todayIncomeAmount.toLocaleString()} <span className="text-sm font-semibold text-slate-500">so‘m</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Bank va kassa orqali tushumlar</p>
        </div>

        {/* Card 3: Ombordagi mahsulot */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ombordagi mahsulot
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <PackageCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {finishedProductsStockCount} <span className="text-sm font-semibold text-slate-500">dona</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Tayyor ustunlar zaxirasi</p>
        </div>

        {/* Card 4: Ishlab chiqarish */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ishlab chiqarish
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <Factory className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {activeProductionOrdersCount} <span className="text-sm font-semibold text-slate-500">ta buyurtma</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Hozir sex konveyerida</p>
        </div>

        {/* Card 5: Ochiq buyurtmalar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ochiq buyurtmalar
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {openOrdersCount} <span className="text-sm font-semibold text-slate-500">ta</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Ijrosi kutilayotgan shartnomalar</p>
        </div>

        {/* Card 6: Xarajatlar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Xarajatlar
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
              <ReceiptText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {todayExpensesAmount.toLocaleString()} <span className="text-sm font-semibold text-slate-500">so‘m</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Xomashyo, oylik va energiya xarajatlari</p>
        </div>
      </div>

      {/* Section: Sotuvlar (Recent Sales Table) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Sotuvlar
            </h3>
            <p className="text-xs text-slate-500">
              Eng so‘nggi sotuv bitimlari va shartnomalar
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePage('sotuvlar')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EA580C] hover:text-[#C2410C] px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <span>Barcha sotuvlarni ko‘rish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                <th className="py-3.5 px-4 sm:px-6">Mijoz</th>
                <th className="py-3.5 px-4">Mahsulot</th>
                <th className="py-3.5 px-4">Miqdor</th>
                <th className="py-3.5 px-4">Summa</th>
                <th className="py-3.5 px-4">Holat</th>
                <th className="py-3.5 px-4">Sana</th>
                <th className="py-3.5 px-4 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {sales.slice(0, 5).map(sale => (
                <tr
                  key={sale.id}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedSaleId(sale.id);
                    setActivePage('sotuvlar');
                  }}
                >
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="font-bold text-slate-900">{sale.clientName}</div>
                    <div className="text-xs text-slate-400 font-mono">{sale.orderNumber}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {sale.productName}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {sale.quantity} dona
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {sale.totalAmount.toLocaleString()} so‘m
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                        sale.status
                      )}`}
                    >
                      {sale.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-500">
                    {sale.date}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedSaleId(sale.id);
                        setActivePage('sotuvlar');
                      }}
                      className="text-xs font-bold text-[#EA580C] hover:underline"
                    >
                      Ko‘rish
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section: Ishlab chiqarish holati (Production Status Progress) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Ishlab chiqarish holati
            </h3>
            <p className="text-xs text-slate-500">
              Sexdagi faol po‘lat ustun buyurtmalari bajarilish foizi
            </p>
          </div>

          <button
            onClick={() => setActivePage('ishlab_chiqarish')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EA580C] hover:text-[#C2410C] px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <span>Barcha buyurtmalar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productionOrders.slice(0, 4).map(po => {
            const percent = Math.round((po.completedQuantity / po.targetQuantity) * 100);
            return (
              <div
                key={po.id}
                onClick={() => setActivePage('ishlab_chiqarish')}
                className="p-4 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50/20 transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                      {po.code}
                    </span>
                    <span className="font-bold text-sm text-slate-900">{po.productName}</span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      po.status === 'Tayyor'
                        ? 'bg-emerald-100 text-emerald-800'
                        : po.status === 'To‘xtatilgan'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {po.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>
                    Bajarildi:{' '}
                    <strong className="text-slate-900">
                      {po.completedQuantity} / {po.targetQuantity} dona
                    </strong>
                  </span>
                  <span className="font-bold text-slate-900">{percent}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      percent === 100
                        ? 'bg-emerald-500'
                        : percent > 60
                        ? 'bg-[#EA580C]'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>Bosqich: <strong className="text-slate-700">{po.currentStage}</strong></span>
                  <span>Stanok: <strong className="text-slate-700">{po.machineName}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
