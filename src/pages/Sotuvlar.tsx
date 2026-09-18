import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  X,
  CheckCircle2,
  Clock,
  Truck,
  Factory,
  FileCheck,
  Ban,
  ChevronRight,
  Receipt,
  User,
  ExternalLink,
  Banknote,
  Building2,
  FileSpreadsheet,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SaleOrder, SaleStatus, PaymentStatus, PaymentType } from '../types';

export const Sotuvlar: React.FC = () => {
  const {
    sales,
    clients,
    finishedProducts,
    addSale,
    updateSaleStatus,
    selectedSaleId,
    setSelectedSaleId,
    setSelectedClientId,
    setActivePage,
    unalignedInvoicesCount,
    addInvoiceItem
  } = useApp();

  // Filters state
  const [filterClient, setFilterClient] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterPaymentType, setFilterPaymentType] = useState<'all' | 'Naqd' | 'Perechisleniya'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // New Sale Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClientId, setNewClientId] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newQuantity, setNewQuantity] = useState(50);
  const [newUnitPrice, setNewUnitPrice] = useState(1850000);
  const [newPaymentType, setNewPaymentType] = useState<PaymentType>('Perechisleniya');
  const [newNotes, setNewNotes] = useState('');

  // Selected sale for detail modal
  const activeSale = useMemo(() => {
    return sales.find(s => s.id === selectedSaleId) || null;
  }, [sales, selectedSaleId]);

  // Filtered sales
  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      if (filterClient && s.clientId !== filterClient) return false;
      if (filterStatus && s.status !== filterStatus) return false;
      if (filterProduct && !s.productName.toLowerCase().includes(filterProduct.toLowerCase())) return false;
      if (filterPaymentType !== 'all') {
        const pType = s.paymentType || (s.id.charCodeAt(s.id.length - 1) % 2 === 0 ? 'Perechisleniya' : 'Naqd');
        if (pType !== filterPaymentType) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          s.orderNumber.toLowerCase().includes(q) ||
          s.clientName.toLowerCase().includes(q) ||
          s.productName.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [sales, filterClient, filterStatus, filterProduct, filterPaymentType, searchQuery]);

  // Payment totals
  const salesPaymentStats = useMemo(() => {
    let totalPerechisleniya = 0;
    let totalNaqd = 0;
    let totalAll = 0;
    let countPerechisleniya = 0;
    let countNaqd = 0;

    sales.forEach(s => {
      totalAll += s.totalAmount;
      const pType = s.paymentType || (s.id.charCodeAt(s.id.length - 1) % 2 === 0 ? 'Perechisleniya' : 'Naqd');
      if (pType === 'Naqd') {
        totalNaqd += s.totalAmount;
        countNaqd++;
      } else {
        totalPerechisleniya += s.totalAmount;
        countPerechisleniya++;
      }
    });
    return { totalAll, totalPerechisleniya, totalNaqd, countPerechisleniya, countNaqd };
  }, [sales]);

  // Stage steps for order card
  const orderStages: SaleStatus[] = [
    'Yangi',
    'Tasdiqlangan',
    'Ishlab chiqarishda',
    'Tayyor',
    'Yetkazib berildi',
    'Yakunlangan'
  ];

  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientId || !newProductName || newQuantity <= 0 || newUnitPrice <= 0) return;

    const totalAmount = Number(newQuantity) * Number(newUnitPrice);
    const client = clients.find(c => c.id === newClientId);

    addSale({
      clientId: newClientId,
      productName: newProductName,
      quantity: Number(newQuantity),
      unitPrice: Number(newUnitPrice),
      paymentType: newPaymentType,
      notes: newNotes
    });

    // If Perechisleniya, also register directly into the Hisob-fakturalarni kelishish reyestri
    if (newPaymentType === 'Perechisleniya') {
      addInvoiceItem({
        clientName: client?.companyName || 'Mijoz',
        contractNumber: `SN-${Math.floor(100 + Math.random() * 900)}`,
        dealAmount: totalAmount,
        sellerResponsible: 'Sotuvchi (CRM)',
        goodsInboundDate: new Date().toISOString().split('T')[0],
        supplierName: 'O‘zmetkombinat AJ',
        warehouseDeducted: false,
        notes: `Sotuv buyurtmasidan avtomatik ro‘yxatga olindi: ${newProductName} (${newQuantity} dona)`
      });
    }

    setIsAddModalOpen(false);
    setNewNotes('');
  };

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

  const getPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'To‘langan':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Qisman to‘langan':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'To‘lanmagan':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Sotuvlar bo‘limi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Mijozlar buyurtmalari, Opora shartnomalari va to‘lov turlari (Naqd va Perechisleniya)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('hisob_faktura')}
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span>Hisob-faktura reyestri</span>
            {unalignedInvoicesCount > 0 && (
              <span className="px-1.5 py-0.5 bg-rose-500 text-white rounded-full text-[10px] font-black animate-pulse">
                {unalignedInvoicesCount}!
              </span>
            )}
          </button>

          <button
            id="open-new-sale-modal-btn"
            onClick={() => {
              if (clients.length > 0) setNewClientId(clients[0].id);
              if (finishedProducts.length > 0) {
                setNewProductName(finishedProducts[2]?.name || finishedProducts[0].name);
                setNewUnitPrice(finishedProducts[2]?.price || finishedProducts[0].price);
              }
              setIsAddModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-[#EA580C] hover:bg-[#D44806] text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Yangi buyurtma</span>
          </button>
        </div>
      </div>

      {/* SMART METRIC PANELS: SOTUVLAR, PERECHISLENIYA, NAQD VA REYESTR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jami sotuvlar</span>
            <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-black text-slate-900 tracking-tight">
              {salesPaymentStats.totalAll.toLocaleString()} <span className="text-xs font-medium text-slate-400">so‘m</span>
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between font-medium">
            <span>Jami bitimlar soni:</span>
            <span className="font-bold text-slate-800">{sales.length} ta</span>
          </div>
        </div>

        {/* Perechisleniya (Bank) */}
        <div
          onClick={() => setFilterPaymentType(filterPaymentType === 'Perechisleniya' ? 'all' : 'Perechisleniya')}
          className={`cursor-pointer transition-all bg-gradient-to-br from-indigo-50/70 to-white p-4.5 rounded-2xl border ${
            filterPaymentType === 'Perechisleniya'
              ? 'border-indigo-500 ring-2 ring-indigo-200 shadow-md'
              : 'border-slate-200 shadow-xs hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-indigo-950 uppercase tracking-wider">Perechisleniya</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-indigo-100 text-indigo-800 rounded">Bank</span>
            </div>
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-black text-indigo-900 tracking-tight">
              {salesPaymentStats.totalPerechisleniya.toLocaleString()} <span className="text-xs font-medium text-indigo-400">so‘m</span>
            </span>
          </div>
          <div className="mt-2 text-xs text-indigo-700 pt-2 border-t border-indigo-100/70 flex items-center justify-between font-medium">
            <span>{salesPaymentStats.countPerechisleniya} ta bitim (Hisob-faktura)</span>
            <span className="font-bold underline text-[11px]">Filtrlash →</span>
          </div>
        </div>

        {/* Naqd to'lov (Kassa) */}
        <div
          onClick={() => setFilterPaymentType(filterPaymentType === 'Naqd' ? 'all' : 'Naqd')}
          className={`cursor-pointer transition-all bg-gradient-to-br from-emerald-50/70 to-white p-4.5 rounded-2xl border ${
            filterPaymentType === 'Naqd'
              ? 'border-emerald-500 ring-2 ring-emerald-200 shadow-md'
              : 'border-slate-200 shadow-xs hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-emerald-950 uppercase tracking-wider">Naqd to‘lov</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">Kassa</span>
            </div>
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-black text-emerald-900 tracking-tight">
              {salesPaymentStats.totalNaqd.toLocaleString()} <span className="text-xs font-medium text-emerald-400">so‘m</span>
            </span>
          </div>
          <div className="mt-2 text-xs text-emerald-700 pt-2 border-t border-emerald-100/70 flex items-center justify-between font-medium">
            <span>{salesPaymentStats.countNaqd} ta bitim (Kassa tartibi)</span>
            <span className="font-bold underline text-[11px]">Filtrlash →</span>
          </div>
        </div>

        {/* Link to Invoice Registry */}
        <div
          onClick={() => setActivePage('hisob_faktura')}
          className="cursor-pointer transition-all bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-4.5 rounded-2xl shadow-sm hover:shadow-md active:scale-98 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Hisob-faktura reyestri</span>
            <div className="p-2 bg-white/10 rounded-xl">
              <FileSpreadsheet className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-black tracking-tight flex items-center gap-2">
              Buxgalteriya kelishuvi
            </span>
          </div>
          <div className="mt-2 text-xs text-blue-100 pt-2 border-t border-white/10 flex items-center justify-between font-medium">
            <span>
              {unalignedInvoicesCount > 0 ? `${unalignedInvoicesCount} ta kelishmovchilik!` : 'Barcha bitimlar muvofiq'}
            </span>
            <span className="font-bold flex items-center gap-1">
              Ochish <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buyurtma yoki mijoz qidirish..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
            />
          </div>

          {/* Client Filter */}
          <div>
            <select
              value={filterClient}
              onChange={e => setFilterClient(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
            >
              <option value="">Barcha mijozlar</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.companyName}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
            >
              <option value="">Barcha holatlar</option>
              <option value="Yangi">Yangi</option>
              <option value="Tasdiqlangan">Tasdiqlangan</option>
              <option value="Ishlab chiqarishda">Ishlab chiqarishda</option>
              <option value="Tayyor">Tayyor</option>
              <option value="Yetkazib berildi">Yetkazib berildi</option>
              <option value="Yakunlangan">Yakunlangan</option>
              <option value="Bekor qilingan">Bekor qilingan</option>
            </select>
          </div>

          {/* Product Filter */}
          <div>
            <select
              value={filterProduct}
              onChange={e => setFilterProduct(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
            >
              <option value="">Barcha mahsulotlar</option>
              <option value="opora">Barcha oporalar</option>
              <option value="6m">6m po‘lat ustun</option>
              <option value="8m">8m po‘lat ustun</option>
              <option value="9m">9m po‘lat ustun</option>
              <option value="10m">10m po‘lat ustun</option>
              <option value="12m">12m po‘lat ustun</option>
              <option value="quyosh">Quyosh paneli oporasi</option>
            </select>
          </div>
        </div>

        {/* Payment Type Quick Badges */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">To‘lov turi:</span>
          <button
            onClick={() => setFilterPaymentType('all')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              filterPaymentType === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Barchasi ({sales.length})
          </button>
          <button
            onClick={() => setFilterPaymentType('Perechisleniya')}
            className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              filterPaymentType === 'Perechisleniya'
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Perechisleniya ({salesPaymentStats.countPerechisleniya})
          </button>
          <button
            onClick={() => setFilterPaymentType('Naqd')}
            className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              filterPaymentType === 'Naqd'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Banknote className="w-3.5 h-3.5" />
            Naqd pul ({salesPaymentStats.countNaqd})
          </button>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4 sm:px-6">№</th>
                <th className="py-3.5 px-4">Mijoz</th>
                <th className="py-3.5 px-4">Mahsulot</th>
                <th className="py-3.5 px-4">Miqdor</th>
                <th className="py-3.5 px-4">Narx</th>
                <th className="py-3.5 px-4">Umumiy summa</th>
                <th className="py-3.5 px-4">To‘lov usuli</th>
                <th className="py-3.5 px-4">Holat</th>
                <th className="py-3.5 px-4">To‘lov</th>
                <th className="py-3.5 px-4">Sana</th>
                <th className="py-3.5 px-4 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-10 text-center text-slate-400">
                    Mos keluvchi sotuv buyurtmalari topilmadi
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale, idx) => {
                  const pType = sale.paymentType || (sale.id.charCodeAt(sale.id.length - 1) % 2 === 0 ? 'Perechisleniya' : 'Naqd');
                  return (
                    <tr
                      key={sale.id}
                      onClick={() => setSelectedSaleId(sale.id)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-xs text-[#EA580C]">
                        {sale.orderNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{sale.clientName}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700 max-w-xs truncate">
                        {sale.productName}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {sale.quantity} dona
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {sale.unitPrice.toLocaleString()} so‘m
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {sale.totalAmount.toLocaleString()} so‘m
                      </td>
                      <td className="py-3.5 px-4">
                        {pType === 'Perechisleniya' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <Building2 className="w-3 h-3" />
                            Perechisleniya
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Banknote className="w-3 h-3" />
                            Naqd (Kassa)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(
                            sale.status
                          )}`}
                        >
                          {sale.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${getPaymentBadge(
                            sale.paymentStatus
                          )}`}
                        >
                          {sale.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-500 whitespace-nowrap">
                        {sale.date}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedSaleId(sale.id);
                          }}
                          className="text-xs font-bold text-[#EA580C] hover:underline"
                        >
                          Ochish
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sale Detail Modal / Card */}
      {activeSale && (
        <div
          id="sale-detail-modal-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedSaleId(null)}
        >
          <div
            id="sale-detail-card"
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#0F2942] text-white p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold bg-[#EA580C] text-white px-2 py-0.5 rounded">
                    Buyurtma №{activeSale.orderNumber}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      activeSale.status === 'Tayyor'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {activeSale.status}
                  </span>
                </div>
                <h3 className="text-lg font-black mt-1 text-white">{activeSale.clientName}</h3>
              </div>

              <button
                onClick={() => setSelectedSaleId(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {/* Order Stages Stepper */}
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Buyurtma ijro bosqichlari (Holatni o‘zgartirish)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {orderStages.map((stage, idx) => {
                    const isCurrent = activeSale.status === stage;
                    const stageIndex = orderStages.indexOf(activeSale.status);
                    const isPassed = stageIndex >= idx && activeSale.status !== 'Bekor qilingan';

                    return (
                      <button
                        key={stage}
                        onClick={() => updateSaleStatus(activeSale.id, stage)}
                        className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                          isCurrent
                            ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-sm'
                            : isPassed
                            ? 'bg-orange-50/80 text-orange-900 border-orange-200 hover:bg-orange-100'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-[10px] font-mono font-bold">0{idx + 1}</span>
                        <span className="text-xs font-bold leading-tight">{stage}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm">
                <div>
                  <span className="text-xs text-slate-400 block">Mahsulot nomi:</span>
                  <span className="font-bold text-slate-900">{activeSale.productName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Buyurtma miqdori:</span>
                  <span className="font-bold text-slate-900">{activeSale.quantity} dona</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Birlik narxi:</span>
                  <span className="font-bold text-slate-900">
                    {activeSale.unitPrice.toLocaleString()} so‘m
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Jami shartnoma summasi:</span>
                  <span className="font-black text-base text-[#EA580C]">
                    {activeSale.totalAmount.toLocaleString()} so‘m
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Buyurtma sanasi:</span>
                  <span className="font-medium text-slate-800">{activeSale.date}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Yetkazib berish muddati:</span>
                  <span className="font-medium text-slate-800">
                    {activeSale.deliveryDate || '10 kun ichida'}
                  </span>
                </div>
              </div>

              {/* Payment Status Switcher */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    To‘lov holati
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getPaymentBadge(
                      activeSale.paymentStatus
                    )}`}
                  >
                    {activeSale.paymentStatus}
                  </span>
                </div>
                <div className="flex gap-2 pt-1">
                  {(['To‘lanmagan', 'Qisman to‘langan', 'To‘langan'] as PaymentStatus[]).map(ps => (
                    <button
                      key={ps}
                      onClick={() => updateSaleStatus(activeSale.id, activeSale.status, ps)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors ${
                        activeSale.paymentStatus === ps
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {ps}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {activeSale.notes && (
                <div className="p-3.5 bg-orange-50/50 rounded-xl border border-orange-100 text-xs">
                  <strong className="text-slate-800 block mb-1">Buyurtma izohi / Talablar:</strong>
                  <p className="text-slate-600 leading-relaxed">{activeSale.notes}</p>
                </div>
              )}

              {/* Actions Footer inside modal */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setSelectedClientId(activeSale.clientId);
                    setSelectedSaleId(null);
                    setActivePage('mijozlar');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  <User className="w-4 h-4" />
                  <span>Mijoz kartasini ochish</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedSaleId(null);
                    setActivePage('ishlab_chiqarish');
                  }}
                  className="inline-flex items-center gap-1.5 bg-[#EA580C] hover:bg-[#D44806] text-white text-xs font-bold px-3 py-2 rounded-xl"
                >
                  <Factory className="w-4 h-4" />
                  <span>Ishlab chiqarishga o‘tish</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Sale Modal */}
      {isAddModalOpen && (
        <div
          id="add-sale-modal-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            id="add-sale-modal-card"
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-[#0F2942] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">+ Yangi sotuv qo‘shish</h3>
                <p className="text-xs text-slate-300">Yangi buyurtma va shartnoma ro‘yxatga olish</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSale} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mijoz (Kompaniya):</label>
                <select
                  value={newClientId}
                  onChange={e => setNewClientId(e.target.value)}
                  required
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.companyName} ({c.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mahsulot:</label>
                <select
                  value={newProductName}
                  onChange={e => {
                    const found = finishedProducts.find(fp => fp.name === e.target.value);
                    setNewProductName(e.target.value);
                    if (found) setNewUnitPrice(found.price);
                  }}
                  required
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                >
                  {finishedProducts.map(fp => (
                    <option key={fp.id} value={fp.name}>
                      {fp.name} — {fp.price.toLocaleString()} so‘m
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Miqdor (dona):</label>
                  <input
                    type="number"
                    min="1"
                    value={newQuantity}
                    onChange={e => setNewQuantity(Math.max(1, Number(e.target.value)))}
                    required
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Narx (so‘m/dona):</label>
                  <input
                    type="number"
                    min="100000"
                    step="10000"
                    value={newUnitPrice}
                    onChange={e => setNewUnitPrice(Math.max(0, Number(e.target.value)))}
                    required
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Payment Type Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">To‘lov turi:</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setNewPaymentType('Perechisleniya')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      newPaymentType === 'Perechisleniya'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Perechisleniya (Bank)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewPaymentType('Naqd')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      newPaymentType === 'Naqd'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Banknote className="w-3.5 h-3.5" />
                    <span>Naqd pul (Kassa)</span>
                  </button>
                </div>
                {newPaymentType === 'Perechisleniya' && (
                  <p className="text-[11px] text-indigo-600 font-medium mt-1">
                    ✓ Ushbu bitim avtomatik ravishda «Hisob-fakturalarni kelishish reyestri»ga kiritiladi.
                  </p>
                )}
              </div>

              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-xs flex justify-between items-center">
                <span className="font-bold text-slate-700">Jami hisoblangan summa:</span>
                <span className="text-base font-black text-[#EA580C]">
                  {(newQuantity * newUnitPrice).toLocaleString()} so‘m
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Qo‘shimcha izoh / Shartlar:</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="Masalan: Issiq ruxlash, flanets qalinligi 16mm, yetkazib berish Samarqandga..."
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:border-orange-500"
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
