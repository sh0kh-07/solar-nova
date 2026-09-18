import React, { useState, useMemo } from 'react';
import {
  Recycle,
  Plus,
  Search,
  CheckCircle2,
  Boxes,
  Truck,
  Flame,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WasteRecord, WasteStatus } from '../types';

export const Chiqindilar: React.FC = () => {
  const { wasteRecords, addWasteRecord } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New waste form state
  const [wasteType, setWasteType] = useState('Metallolom (List qoldiqlari)');
  const [quantity, setQuantity] = useState(450);
  const [unit, setUnit] = useState('kg');
  const [sourceStage, setSourceStage] = useState('Lazer kesish uskunasi (Bystronic)');
  const [status, setStatus] = useState<WasteStatus>('Omborda');
  const [notes, setNotes] = useState('');

  const filteredRecords = useMemo(() => {
    return wasteRecords.filter(w => {
      if (statusFilter && w.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          w.type.toLowerCase().includes(q) ||
          w.sourceStage.toLowerCase().includes(q) ||
          w.notes.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [wasteRecords, statusFilter, searchQuery]);

  const totalScrapTons = wasteRecords
    .filter(w => w.type.toLowerCase().includes('metall'))
    .reduce((sum, w) => sum + (w.unit === 'tonna' ? w.quantity : w.quantity / 1000), 0);

  const handleCreateWaste = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;

    addWasteRecord({
      type: wasteType,
      quantity: Number(quantity),
      unit,
      sourceStage,
      status,
      notes
    });

    setIsAddModalOpen(false);
    setNotes('');
  };

  const getStatusBadge = (status: WasteStatus) => {
    switch (status) {
      case 'Omborda':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Sotildi':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Qayta ishlashga yuborildi':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Chiqindilar va ikkilamchi xomashyo
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Metall parchalari, qirindi, shlak va rux qoldiqlari hisobi va realizatsiyasi
          </p>
        </div>

        <button
          id="open-new-waste-modal-btn"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#EA580C] hover:bg-[#D44806] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Chiqindi kiritish</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Jami to‘plangan po‘latlom</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {totalScrapTons.toFixed(2)} <span className="text-sm font-semibold text-slate-500">tonna</span>
            </div>
            <span className="text-[11px] text-slate-400">Metallolom maydonchasida</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center">
            <Recycle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Sotilgan metall chiqindi</span>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">
              {(totalScrapTons * 0.65).toFixed(2)} <span className="text-sm font-semibold text-slate-500">tonna</span>
            </div>
            <span className="text-[11px] text-slate-400">Qayta eritish korxonalariga</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Qayta tiklangan rux/izgar</span>
            <div className="text-2xl font-black text-blue-600 mt-0.5">
              1.2 <span className="text-sm font-semibold text-slate-500">tonna</span>
            </div>
            <span className="text-[11px] text-slate-400">Gartsink va shlak</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Chiqindi turi, stanok yoki izoh orqali qidirish..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
          />
        </div>

        <div className="w-full sm:w-56">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
          >
            <option value="">Barcha holatlar</option>
            <option value="Omborda">Omborda</option>
            <option value="Sotildi">Sotildi</option>
            <option value="Qayta ishlashga yuborildi">Qayta ishlashga yuborildi</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4 sm:px-6">Sana</th>
                <th className="py-3.5 px-4">Chiqindi turi</th>
                <th className="py-3.5 px-4">Miqdor</th>
                <th className="py-3.5 px-4">Qayerdan chiqdi (Stanok / Bosqich)</th>
                <th className="py-3.5 px-4">Holat</th>
                <th className="py-3.5 px-4">Izoh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredRecords.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 text-xs font-medium text-slate-600 whitespace-nowrap">
                    {item.date}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {item.type}
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-900">
                    {item.quantity.toLocaleString()} {item.unit}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                    {item.sourceStage}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">
                    {item.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Waste Modal */}
      {isAddModalOpen && (
        <div
          id="add-waste-modal-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            id="add-waste-modal-card"
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-[#0F2942] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">+ Yangi chiqindi qayd qilish</h3>
                <p className="text-xs text-slate-300">Ishlab chiqarish chiqindilari va brak hisobi</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWaste} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Chiqindi turi:</label>
                <select
                  value={wasteType}
                  onChange={e => setWasteType(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                >
                  <option value="Metallolom (List qirqimlari)">Metallolom (List qirqimlari)</option>
                  <option value="Payvandlash shlaki va qoldig‘i">Payvandlash shlaki va qoldig‘i</option>
                  <option value="Gartsink (Sink qoldig‘i)">Gartsink (Sink qoldig‘i)</option>
                  <option value="Kukun bo‘yoq cho‘kmasi">Kukun bo‘yoq cho‘kmasi</option>
                  <option value="Brak profil (Noto‘g‘ri bukilgan)">Brak profil (Noto‘g‘ri bukilgan)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Miqdor:</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">O‘lchov birligi:</label>
                  <select
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  >
                    <option value="kg">kg</option>
                    <option value="tonna">tonna</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Qayerdan chiqdi (Uskuna / Sex):</label>
                <input
                  type="text"
                  value={sourceStage}
                  onChange={e => setSourceStage(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Holati:</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as WasteStatus)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                >
                  <option value="Omborda">Omborda</option>
                  <option value="Sotildi">Sotildi</option>
                  <option value="Qayta ishlashga yuborildi">Qayta ishlashga yuborildi</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Izoh:</label>
                <input
                  type="text"
                  placeholder="Partiya raqami, xaridor yoki saqlash joyi"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
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
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
