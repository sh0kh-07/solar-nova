import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Factory,
  PieChart,
  Calendar,
  Download,
  CheckCircle2,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Hisobotlar: React.FC = () => {
  const { sales, finishedProducts } = useApp();

  // Monthly Sales dynamic data (Jan - Sep 2026)
  const monthlySales = [
    { month: 'Yan', sales: 420, production: 310 },
    { month: 'Fev', sales: 510, production: 420 },
    { month: 'Mar', sales: 680, production: 540 },
    { month: 'Apr', sales: 820, production: 710 },
    { month: 'May', sales: 940, production: 830 },
    { month: 'Iyn', sales: 1120, production: 980 },
    { month: 'Iyl', sales: 1250, production: 1100 },
    { month: 'Avg', sales: 1480, production: 1320 },
    { month: 'Sen', sales: 1650, production: 1490 }
  ];

  const maxSales = Math.max(...monthlySales.map(m => m.sales));

  // Top products
  const topProducts = [
    { name: 'Po‘lat yoritish ustuni 9m (OGK-9)', sold: 480, share: 34, revenue: '888 mln so‘m' },
    { name: 'Po‘lat yoritish ustuni 10m (OGK-10)', sold: 340, share: 24, revenue: '731 mln so‘m' },
    { name: 'Po‘lat yoritish ustuni 12m (OGK-12)', sold: 260, share: 18, revenue: '676 mln so‘m' },
    { name: 'Po‘lat yoritish ustuni 8m (OGK-8)', sold: 210, share: 15, revenue: '346 mln so‘m' },
    { name: 'Boshqa modellar va kронштейнлар', sold: 130, share: 9, revenue: '195 mln so‘m' }
  ];

  // Cost structure breakdown
  const costStructure = [
    { category: 'Xomashyo (Po‘lat list, truba, sink, bo‘yoq)', percent: 68, color: 'bg-[#EA580C]', textColor: 'text-[#EA580C]' },
    { category: 'Ish haqi va oylik maoshlar', percent: 16, color: 'bg-[#0F2942]', textColor: 'text-[#0F2942]' },
    { category: 'Elektr energiyasi, gaz va suv', percent: 8, color: 'bg-amber-500', textColor: 'text-amber-500' },
    { category: 'Stanoklar ta’miri va amortizatsiya', percent: 5, color: 'bg-blue-600', textColor: 'text-blue-600' },
    { category: 'Soliqlar va ma’muriy xarajatlar', percent: 3, color: 'bg-emerald-600', textColor: 'text-emerald-600' }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Hisobotlar va tahliliy ko‘rsatkichlar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Oylik savdo o‘sishi, ishlab chiqarish unumdorligi va tannarx tahlili
          </p>
        </div>

        <button
          onClick={() => alert('PDF hisobot eksport qilindi (Demo)')}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Eksport (PDF / Excel)</span>
        </button>
      </div>

      {/* 2 Main Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Oylik sotuv dinamikasi */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">
                1. Oylik sotuv dinamikasi (mln so‘m)
              </h3>
              <p className="text-xs text-slate-500">2026-yil oylari kesimida shartnoma summalari</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-64 pt-6 flex items-end justify-between gap-2 border-b border-slate-200 pb-2">
            {monthlySales.map(item => {
              const heightPercent = Math.round((item.sales / maxSales) * 100);
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-bold text-slate-400 group-hover:text-[#EA580C] transition-colors">
                    {item.sales}
                  </div>
                  <div className="w-full max-w-[32px] bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                    <div
                      className="w-full bg-[#EA580C] rounded-t-lg transition-all duration-300 group-hover:bg-[#D44806]"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <div className="text-xs font-bold text-slate-600 mt-1">
                    {item.month}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>O‘sish sur’ati: <strong>+18.4%</strong> o‘tgan oylarga nisbatan</span>
            <span className="font-bold text-slate-900">Jami 9 oy: 8 360 mln so‘m</span>
          </div>
        </div>

        {/* Chart 2: Ishlab chiqarilgan ustunlar soni */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">
                2. Ishlab chiqarilgan ustunlar soni (dona)
              </h3>
              <p className="text-xs text-slate-500">Oyma-oy zavod konveyeridan chiqqan tayyor ustunlar</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Factory className="w-5 h-5" />
            </div>
          </div>

          {/* Bar Chart for Production Volume */}
          <div className="h-64 pt-6 flex items-end justify-between gap-2 border-b border-slate-200 pb-2">
            {monthlySales.map(item => {
              const heightPercent = Math.round((item.production / maxSales) * 100);
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                    {item.production}
                  </div>
                  <div className="w-full max-w-[32px] bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                    <div
                      className="w-full bg-[#0F2942] rounded-t-lg transition-all duration-300 group-hover:bg-[#1E3E62]"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <div className="text-xs font-bold text-slate-600 mt-1">
                    {item.month}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Sex quvvati: <strong>oyiga 1 800 donagacha</strong></span>
            <span className="font-bold text-slate-900">Jami 9 oy: 7 890 dona</span>
          </div>
        </div>
      </div>

      {/* Top Products & Cost Structure Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Eng ko‘p sotilgan mahsulotlar (Top 3) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                3. Eng ko‘p sotilgan mahsulotlar (Top-3)
              </h3>
              <p className="text-xs text-slate-500">Eng yuqori talabga ega po‘lat yoritish ustunlari</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {topProducts.map((prod, idx) => (
              <div key={prod.name} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        idx === 0
                          ? 'bg-amber-400 text-amber-950 font-black'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-900 font-bold'
                          : idx === 2
                          ? 'bg-amber-700 text-white font-bold'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-slate-900">
                      {prod.name}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-700">
                    {prod.sold} dona
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Ulushi: <strong>{prod.share}%</strong></span>
                  <span className="font-semibold text-slate-800">Tushum: {prod.revenue}</span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      idx === 0 ? 'bg-[#EA580C]' : 'bg-[#0F2942]'
                    }`}
                    style={{ width: `${prod.share * 2.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Xarajatlar tuzilishi (Cost Structure) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-[#EA580C]" />
                4. Xarajatlar tuzilishi (Tannarx tahlili)
              </h3>
              <p className="text-xs text-slate-500">Ishlab chiqarish xarajatlarining taqsimoti</p>
            </div>
          </div>

          {/* Segmented Progress Bar */}
          <div className="w-full h-5 rounded-xl overflow-hidden flex bg-slate-200 shadow-inner">
            {costStructure.map(item => (
              <div
                key={item.category}
                className={`${item.color} h-full transition-all`}
                style={{ width: `${item.percent}%` }}
                title={`${item.category}: ${item.percent}%`}
              />
            ))}
          </div>

          {/* Breakdown Items List */}
          <div className="space-y-3 pt-2">
            {costStructure.map(item => (
              <div
                key={item.category}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-3.5 h-3.5 rounded-md ${item.color} shrink-0`} />
                  <span className="font-semibold text-slate-800 truncate">{item.category}</span>
                </div>
                <span className="font-black text-slate-900 text-sm pl-2 shrink-0">
                  {item.percent}%
                </span>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-xs text-slate-700">
            <strong>Xulosa:</strong> Asosiy xarajat (68%) po‘lat prokat va issiq ruxlash xomashyosiga to‘g‘ri keladi. Metall bozoridagi narx tebranishlari ustunlar tannarxiga to‘g‘ridan-to‘g‘ri ta’sir qiladi.
          </div>
        </div>
      </div>
    </div>
  );
};
