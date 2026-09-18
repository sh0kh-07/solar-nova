import React, { useState } from 'react';
import {
  Factory,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Play,
  RotateCw,
  Cpu,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductionOrder, ProductionStage, PRODUCTION_STAGES_LIST } from '../types';

const STAGE_DETAILS: Record<string, { label: string; desc: string }> = {
  'Xomashyo': { label: 'Xomashyo', desc: 'Po‘lat list va quvurlar qabuli' },
  'Kesish': { label: 'Lazer kesish', desc: 'Konus andazalarini bichish' },
  'Payvandlash': { label: 'Payvandlash', desc: 'Bo‘ylama chok va flanets' },
  'Tozalash': { label: 'Tozalash', desc: 'Drobemjot bilan silliqlash' },
  'Bo‘yash': { label: 'Ruxlash va Bo‘yash', desc: 'Issiq galvanika va kukunli bo‘yoq' },
  'Quritish': { label: 'Quritish', desc: 'Polimerizatsiya pechida toblash' },
  'Sifat nazorati': { label: 'Sifat nazorati', desc: 'OTK qabul nazorati' },
  'Tayyor mahsulot': { label: 'Tayyor mahsulot', desc: 'Omborga kirim va qadoqlash' }
};

export const IshlabChiqarish: React.FC = () => {
  const {
    productionOrders = [],
    productionStagesList,
    advanceProductionStage,
    addProductionOrder,
    machines = []
  } = useApp();

  const stages: ProductionStage[] =
    productionStagesList && productionStagesList.length > 0
      ? productionStagesList
      : PRODUCTION_STAGES_LIST;

  // Detail Modal state
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);

  // New Order Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productName, setProductName] = useState('Po‘lat yoritish ustuni 9m (OGK)');
  const [targetQuantity, setTargetQuantity] = useState(100);
  const [foreman, setForeman] = useState('Nodirbek Alimov');
  const [machineName, setMachineName] = useState('Lazer kesish uskunasi 6kW (Bystronic)');
  const [deadline, setDeadline] = useState('28.09.2026');

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || targetQuantity <= 0) return;

    if (addProductionOrder) {
      addProductionOrder({
        productName,
        targetQuantity: Number(targetQuantity),
        foreman,
        machineName,
        deadline
      });
    }

    setIsAddModalOpen(false);
  };

  const handleAdvance = (orderId: string) => {
    if (advanceProductionStage) {
      advanceProductionStage(orderId);
    }
    // update modal view state
    setSelectedOrder(prev => {
      if (!prev || prev.id !== orderId) return prev;
      const currentIdx = Math.max(0, stages.indexOf(prev.currentStage));
      if (currentIdx < stages.length - 1) {
        const nextStage = stages[currentIdx + 1];
        const isDone = currentIdx + 1 === stages.length - 1;
        return {
          ...prev,
          currentStage: nextStage,
          status: isDone ? 'Tayyor' : 'Jarayonda',
          completedQuantity: isDone
            ? prev.targetQuantity
            : Math.min(
                prev.targetQuantity,
                Math.round((prev.targetQuantity * (currentIdx + 2)) / stages.length)
              )
        };
      }
      return prev;
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Ishlab chiqarish konveyeri
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            8 bosqichli texnologik tsikl: kesishdan tortib issiq ruxlash va bo‘yashgacha
          </p>
        </div>

        <button
          id="open-new-production-modal-btn"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#EA580C] hover:bg-[#D44806] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Yangi buyurtma ochish</span>
        </button>
      </div>

      {/* 8 Technological Stages Visual Reference */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Factory className="w-4 h-4 text-[#EA580C]" />
            Po‘lat yoritish ustunlarini tayyorlashning 8 asosiy bosqichi
          </h3>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Standart: GOST 32947-2014
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {stages.map((stage, idx) => {
            const detail = STAGE_DETAILS[stage] || { label: stage, desc: 'Texnologik operatsiya' };
            return (
              <div
                key={stage}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between min-h-[95px] text-center hover:bg-orange-50/30 transition-colors"
              >
                <div className="flex items-center justify-center">
                  <span className="w-6 h-6 rounded-full bg-[#0F2942] text-white text-[11px] font-mono font-black flex items-center justify-center">
                    0{idx + 1}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-800 leading-tight block mt-1">
                    {detail.label}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5 line-clamp-1">
                    {detail.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Production Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900">
            Sex buyurtmalari ro‘yxati ({productionOrders.length})
          </h3>
          <span className="text-xs text-slate-400">
            Buyurtma ustiga bosib bosqichlarni boshqaring
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4 sm:px-6">Kodi</th>
                <th className="py-3.5 px-4">Mahsulot</th>
                <th className="py-3.5 px-4">Reja / Tayyor</th>
                <th className="py-3.5 px-4">Ijro foizi</th>
                <th className="py-3.5 px-4">Joriy bosqich</th>
                <th className="py-3.5 px-4">Mas’ul usta</th>
                <th className="py-3.5 px-4">Holat</th>
                <th className="py-3.5 px-4 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {productionOrders.map(order => {
                const percent =
                  order.targetQuantity > 0
                    ? Math.min(100, Math.round(((order.completedQuantity || 0) / order.targetQuantity) * 100))
                    : 0;
                const foremanDisplay = order.foreman || order.responsible || 'Sobir Tursunov';
                return (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-xs text-[#EA580C]">
                      {order.code}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{order.productName}</div>
                      <div className="text-xs text-slate-500">{order.machineName || 'Lazer kesish uskunasi'}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {order.completedQuantity || 0} / {order.targetQuantity} dona
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-28 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                          <span>{percent}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              percent === 100
                                ? 'bg-emerald-500'
                                : percent > 50
                                ? 'bg-[#EA580C]'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {STAGE_DETAILS[order.currentStage]?.label || order.currentStage}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                      {foremanDisplay}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          order.status === 'Tayyor'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                        className="text-xs font-bold text-[#EA580C] hover:underline"
                      >
                        Bosqichlar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Production Order Detail Modal (Interactive 8-stage progress & Advance Stage button) */}
      {selectedOrder && (
        <div
          id="production-detail-modal-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            id="production-detail-card"
            className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#0F2942] text-white p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-[#EA580C] text-white px-2 py-0.5 rounded">
                    {selectedOrder.code}
                  </span>
                  <span className="text-xs text-slate-300">
                    Bajarilish muddati: {selectedOrder.deadline || selectedOrder.endDate || '28.09.2026'}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white mt-1">
                  {selectedOrder.productName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {/* Order Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Reja hajmi:</span>
                  <strong className="text-slate-900 font-bold">{selectedOrder.targetQuantity} dona</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Tayyor bo‘ldi:</span>
                  <strong className="text-slate-900 font-bold">{selectedOrder.completedQuantity || 0} dona</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Mas’ul usta:</span>
                  <strong className="text-slate-900 font-bold">{selectedOrder.foreman || selectedOrder.responsible || 'Sobir Tursunov'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Asosiy stanok:</span>
                  <strong className="text-slate-900 font-bold truncate block">{selectedOrder.machineName || 'Lazer kesish uskunasi'}</strong>
                </div>
              </div>

              {/* 8-stage interactive Stepper */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    8 Bosqichli texnologik marshrut
                  </span>
                  <span className="text-xs font-bold text-[#EA580C]">
                    Hozirgi bosqich: {STAGE_DETAILS[selectedOrder.currentStage]?.label || selectedOrder.currentStage}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {stages.map((stage, idx) => {
                    const currentIndex = Math.max(0, stages.indexOf(selectedOrder.currentStage));
                    const isCompleted = idx < currentIndex || selectedOrder.status === 'Tayyor';
                    const isCurrent = idx === currentIndex && selectedOrder.status !== 'Tayyor';
                    const detail = STAGE_DETAILS[stage] || { label: stage, desc: '' };

                    return (
                      <div
                        key={stage}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                          isCurrent
                            ? 'bg-orange-50/80 border-[#EA580C] shadow-xs'
                            : isCompleted
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-slate-50/50 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-black shrink-0 ${
                              isCompleted
                                ? 'bg-emerald-600 text-white'
                                : isCurrent
                                ? 'bg-[#EA580C] text-white'
                                : 'bg-slate-300 text-slate-700'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : `0${idx + 1}`}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-slate-900 block">
                              {detail.label}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {isCompleted
                                ? 'Muvaffaqiyatli yakunlangan'
                                : isCurrent
                                ? `${detail.desc} • Hozir sexda bajarilmoqda`
                                : detail.desc || 'Navbatdagi operatsiya'}
                            </span>
                          </div>
                        </div>

                        {isCurrent && (
                          <span className="text-xs font-bold text-[#EA580C] px-2.5 py-1 rounded-full bg-orange-100 border border-orange-200 animate-pulse">
                            Jarayonda
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Yopish
                </button>

                {selectedOrder.status !== 'Tayyor' && (
                  <button
                    id="advance-stage-btn"
                    onClick={() => handleAdvance(selectedOrder.id)}
                    className="flex items-center gap-2 bg-[#EA580C] hover:bg-[#D44806] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>Keyingi bosqichga o‘tkazish</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Production Order Modal */}
      {isAddModalOpen && (
        <div
          id="add-production-order-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            id="add-production-order-card"
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-[#0F2942] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">+ Yangi ishlab chiqarish buyurtmasi</h3>
                <p className="text-xs text-slate-300">Sex konveyeriga yangi partiya kiritish</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mahsulot (Opora turi):</label>
                <select
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                >
                  <option value="Po‘lat yoritish ustuni 6m (OGK-6)">Po‘lat yoritish ustuni 6m (OGK-6)</option>
                  <option value="Po‘lat yoritish ustuni 8m (OGK-8)">Po‘lat yoritish ustuni 8m (OGK-8)</option>
                  <option value="Po‘lat yoritish ustuni 9m (OGK-9)">Po‘lat yoritish ustuni 9m (OGK-9)</option>
                  <option value="Po‘lat yoritish ustuni 10m (OGK-10)">Po‘lat yoritish ustuni 10m (OGK-10)</option>
                  <option value="Po‘lat yoritish ustuni 12m (OGK-12)">Po‘lat yoritish ustuni 12m (OGK-12)</option>
                  <option value="Trubali yoritish ustuni 8m (OT-8)">Trubali yoritish ustuni 8m (OT-8)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Reja miqdori (dona):</label>
                  <input
                    type="number"
                    min="1"
                    value={targetQuantity}
                    onChange={e => setTargetQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Bajarish muddati:</label>
                  <input
                    type="text"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    placeholder="30.09.2026"
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Boshlang‘ich stanok:</label>
                <select
                  value={machineName}
                  onChange={e => setMachineName(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                >
                  {machines.map(m => (
                    <option key={m.id} value={`${m.name} (${m.inventoryNumber})`}>
                      {m.name} — {m.operator}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mas’ul usta / brigadir:</label>
                <input
                  type="text"
                  value={foreman}
                  onChange={e => setForeman(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#EA580C] hover:bg-[#D44806] text-white shadow-xs"
                >
                  Ishga tushirish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
