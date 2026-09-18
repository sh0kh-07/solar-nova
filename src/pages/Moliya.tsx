import React, { useState, useMemo } from 'react';
import {
  Wallet,
  Building2,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Search,
  ReceiptText,
  DollarSign,
  X,
  CreditCard
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FinanceRecord } from '../types';

export const Moliya: React.FC = () => {
  const {
    finances,
    cashBalance,
    bankBalance,
    totalBalance,
    addFinanceRecord,
    clients
  } = useApp();

  const [activeTab, setActiveTab] = useState<'tushum' | 'xarajat'>('tushum');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'Tushum' | 'Xarajat'>('Tushum');
  const [category, setCategory] = useState('Mijozdan to‘lov');
  const [amount, setAmount] = useState(25000000);
  const [paymentMethod, setPaymentMethod] = useState<'Bank' | 'Kassa'>('Bank');
  const [partner, setPartner] = useState('');
  const [notes, setNotes] = useState('');

  const tushumList = useMemo(() => {
    return finances.filter(f => f.type === 'Tushum');
  }, [finances]);

  const xarajatList = useMemo(() => {
    return finances.filter(f => f.type === 'Xarajat');
  }, [finances]);

  const filteredRecords = useMemo(() => {
    const list = activeTab === 'tushum' ? tushumList : xarajatList;
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      r =>
        r.category.toLowerCase().includes(q) ||
        r.partner.toLowerCase().includes(q) ||
        r.notes.toLowerCase().includes(q)
    );
  }, [activeTab, tushumList, xarajatList, searchQuery]);

  const handleOpenModal = (type: 'Tushum' | 'Xarajat') => {
    setModalType(type);
    if (type === 'Tushum') {
      setCategory('Mijozdan to‘lov');
      setPartner(clients[0]?.companyName || 'Samarkand Qurilish MCHJ');
      setPaymentMethod('Bank');
    } else {
      setCategory('Xomashyo sotib olish');
      setPartner('Metall Zavod OAJ');
      setPaymentMethod('Bank');
    }
    setIsModalOpen(true);
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !category.trim()) return;

    addFinanceRecord({
      type: modalType,
      category,
      amount: Number(amount),
      paymentMethod,
      partner: partner || (modalType === 'Tushum' ? 'Noma’lum mijoz' : 'Ichki xarajat'),
      notes
    });

    setIsModalOpen(false);
    setNotes('');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Moliya va hisob-kitoblar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kassa naqd pullari, bank hisob raqami, tushumlar va xarajatlar tahlili
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="finance-add-tushum-btn"
            onClick={() => handleOpenModal('Tushum')}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-xs transition-colors"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>+ Tushum qo‘shish</span>
          </button>

          <button
            id="finance-add-xarajat-btn"
            onClick={() => handleOpenModal('Xarajat')}
            className="flex items-center gap-1.5 bg-[#EA580C] hover:bg-[#D44806] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-xs transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>+ Xarajat qo‘shish</span>
          </button>
        </div>
      </div>

      {/* 3 Top Cards: Kassa, Bank, Umumiy Balans */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {/* Kassa */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              1. Kassa qoldig‘i (Naqd pul)
            </span>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#EA580C] border border-orange-100 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {cashBalance.toLocaleString()} <span className="text-sm font-semibold text-slate-500">so‘m</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Zavod seyfi va tezkor xarajatlar</p>
        </div>

        {/* Bank */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              2. Hisob raqam (Bank)
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {bankBalance.toLocaleString()} <span className="text-sm font-semibold text-slate-500">so‘m</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Kapitalbank / Ipak Yo‘li bank</p>
        </div>

        {/* Total Balance */}
        <div className="bg-gradient-to-br from-[#0F2942] to-[#1E3E62] text-white p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              3. Umumiy balans
            </span>
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {totalBalance.toLocaleString()} <span className="text-sm font-semibold text-slate-300">so‘m</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">Barcha mavjud likvid aktivlar</p>
        </div>
      </div>

      {/* Tabs Switcher: Tushumlar vs Xarajatlar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2">
        <button
          onClick={() => setActiveTab('tushum')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'tushum'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>Tushumlar (Kirim daromadlar)</span>
        </button>

        <button
          onClick={() => setActiveTab('xarajat')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'xarajat'
              ? 'bg-[#EA580C] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Xarajatlar (Chiqimlar)</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Kontragent, kategoriya yoki to‘lov izohi bo‘yicha qidirish..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4 sm:px-6">Sana</th>
                <th className="py-3.5 px-4">Kategoriya</th>
                <th className="py-3.5 px-4">{activeTab === 'tushum' ? 'Mijoz' : 'Kontragent / Maqsad'}</th>
                <th className="py-3.5 px-4">To‘lov turi</th>
                <th className="py-3.5 px-4">Summa</th>
                <th className="py-3.5 px-4">Izoh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredRecords.map(rec => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-xs font-medium text-slate-600">
                    {rec.date}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {rec.category}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {rec.partner}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
                        rec.paymentMethod === 'Bank'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {rec.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-black">
                    <span
                      className={
                        rec.type === 'Tushum' ? 'text-emerald-600' : 'text-rose-600'
                      }
                    >
                      {rec.type === 'Tushum' ? '+' : '-'}{rec.amount.toLocaleString()} so‘m
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 max-w-sm">
                    {rec.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Finance Record Modal */}
      {isModalOpen && (
        <div
          id="add-finance-modal-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            id="add-finance-modal-card"
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-[#0F2942] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">
                  {modalType === 'Tushum' ? '+ Yangi tushum qo‘shish' : '+ Yangi xarajat qo‘shish'}
                </h3>
                <p className="text-xs text-slate-300">
                  {modalType === 'Tushum' ? 'Mijozdan to‘lov qabul qilish' : 'Ishlab chiqarish va boshqa xarajatlar'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Xarajat / Tushum kategoriyasi:</label>
                {modalType === 'Tushum' ? (
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  >
                    <option value="Mijozdan to‘lov">Mijozdan to‘lov (Buyurtma bo‘yicha)</option>
                    <option value="Oldindan to‘lov (Avans)">Oldindan to‘lov (Avans)</option>
                    <option value="Boshqa tushum">Boshqa tushum</option>
                  </select>
                ) : (
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  >
                    <option value="Xomashyo sotib olish">Xomashyo sotib olish (Po‘lat, sink, bo‘yoq)</option>
                    <option value="Oylik maosh">Oylik maosh (Ishchilar va muhandislar)</option>
                    <option value="Elektr energiyasi">Elektr energiyasi va gaz</option>
                    <option value="Stanok ta’miri">Stanok ta’miri va ehtiyot qismlar</option>
                    <option value="Soliqlar">Soliqlar va majburiy to‘lovlar</option>
                    <option value="Transport va logistika">Transport va logistika</option>
                  </select>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {modalType === 'Tushum' ? 'Mijoz (Tashkilot):' : 'Kontragent / Qabul qiluvchi:'}
                </label>
                <input
                  type="text"
                  required
                  value={partner}
                  onChange={e => setPartner(e.target.value)}
                  placeholder="Masalan: Samarkand Qurilish MCHJ"
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Summa (so‘m):</label>
                  <input
                    type="number"
                    min="1000"
                    step="10000"
                    value={amount}
                    onChange={e => setAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">To‘lov turi:</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as 'Bank' | 'Kassa')}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  >
                    <option value="Bank">Bank (Hisob raqam)</option>
                    <option value="Kassa">Kassa (Naqd pul)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">To‘lov maqsadi / Izoh:</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Masalan: SO-1024 buyurtmasi uchun 50% avans..."
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs ${
                    modalType === 'Tushum'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-[#EA580C] hover:bg-[#D44806]'
                  }`}
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
