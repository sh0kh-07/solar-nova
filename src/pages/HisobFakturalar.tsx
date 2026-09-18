import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  HelpCircle,
  FileCheck,
  Building2,
  Banknote,
  CreditCard,
  Layers,
  ArrowDownRight,
  ArrowUpRight,
  X,
  ExternalLink,
  Edit3,
  Warehouse,
  Check,
  Printer,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { InvoiceRegistryItem, InvoiceStatus, PaymentType } from '../types';

export const HisobFakturalar: React.FC = () => {
  const {
    invoices,
    clients,
    finishedProducts,
    addInvoiceItem,
    updateInvoiceAccountantData,
    updateInvoiceStatus,
    deductInvoiceFromWarehouse,
    unalignedInvoicesCount,
    setActivePage
  } = useApp();

  // View / Role Filter
  const [activeRoleView, setActiveRoleView] = useState<'all' | 'seller' | 'accountant'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'Naqd' | 'Perechisleniya'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [onlyDiscrepancies, setOnlyDiscrepancies] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Seller: New Deal Modal
  const [isNewDealModalOpen, setIsNewDealModalOpen] = useState(false);
  const [newDealNumber, setNewDealNumber] = useState(`SN-2026-0${invoices.length + 90}`);
  const [newSellerName, setNewSellerName] = useState('Alisher Vohidov (Katta menejer)');
  const [newClientId, setNewClientId] = useState(clients[0]?.id || '');
  const [newClientInn, setNewClientInn] = useState(clients[0]?.inn || '302948192');
  const [newClientName, setNewClientName] = useState(clients[0]?.companyName || 'Samarkand Qurilish MCHJ');
  const [newProductName, setNewProductName] = useState('Opora 9m po‘lat yoritish ustuni (Konussimon)');
  const [newQuantity, setNewQuantity] = useState(50);
  const [newUnit, setNewUnit] = useState('dona');
  const [newDealAmount, setNewDealAmount] = useState(92500000);
  const [newPaymentType, setNewPaymentType] = useState<PaymentType>('Perechisleniya');
  const [newSupplierGoods, setNewSupplierGoods] = useState('Po‘lat quvur d159x4.5 (450 metr), Flanets 50 dona');
  const [newWarehouseDeduction, setNewWarehouseDeduction] = useState('Opora 9m konussimon — 50 dona, Ankerli blok — 50 dona');

  // Accountant: Edit Invoice Modal
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRegistryItem | null>(null);
  const [isAccountantModalOpen, setIsAccountantModalOpen] = useState(false);
  const [editInvoiceNumber, setEditInvoiceNumber] = useState('');
  const [editInvoiceDate, setEditInvoiceDate] = useState('');
  const [editInvoiceAmount, setEditInvoiceAmount] = useState<number>(0);
  const [editVatIncluded, setEditVatIncluded] = useState(true);
  const [editVatRate, setEditVatRate] = useState(12);
  const [editStatus, setEditStatus] = useState<InvoiceStatus>('Yozilmagan');
  const [editAccountantNotes, setEditAccountantNotes] = useState('');

  // When client changes in modal
  const handleClientChange = (clientId: string) => {
    setNewClientId(clientId);
    const cli = clients.find(c => c.id === clientId);
    if (cli) {
      setNewClientName(cli.companyName);
      setNewClientInn(cli.inn || '000000000');
    }
  };

  // Open accountant modal
  const handleOpenAccountantModal = (item: InvoiceRegistryItem) => {
    setSelectedInvoice(item);
    setEditInvoiceNumber(item.invoiceNumber || `HF-2026-0${Math.floor(100 + Math.random() * 900)}`);
    setEditInvoiceDate(item.invoiceDate || new Date().toISOString().split('T')[0]);
    setEditInvoiceAmount(item.invoiceAmount || item.dealAmount);
    setEditVatIncluded(item.vatIncluded !== undefined ? item.vatIncluded : true);
    setEditVatRate(item.vatRate || 12);
    setEditStatus(item.status === 'Yozilmagan' ? 'Jarayonda' : item.status);
    setEditAccountantNotes(item.accountantNotes || '');
    setIsAccountantModalOpen(true);
  };

  // Save accountant edits
  const handleSaveAccountantData = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    updateInvoiceAccountantData(selectedInvoice.id, {
      invoiceNumber: editInvoiceNumber,
      invoiceDate: editInvoiceDate,
      invoiceAmount: Number(editInvoiceAmount),
      vatIncluded: editVatIncluded,
      vatRate: Number(editVatRate),
      status: editStatus,
      accountantNotes: editAccountantNotes
    });

    setIsAccountantModalOpen(false);
    setSelectedInvoice(null);
  };

  // Save new deal by seller
  const handleCreateNewDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDealNumber.trim() || !newClientName.trim() || newDealAmount <= 0) return;

    addInvoiceItem({
      dealNumber: newDealNumber,
      dealDate: new Date().toISOString().split('T')[0],
      sellerName: newSellerName,
      clientId: newClientId,
      clientName: newClientName,
      clientInn: newClientInn,
      productName: newProductName,
      quantity: Number(newQuantity),
      unit: newUnit,
      dealAmount: Number(newDealAmount),
      paymentType: newPaymentType,
      supplierGoods: newSupplierGoods,
      warehouseDeduction: newWarehouseDeduction,
      warehouseDeducted: false,
      invoiceNumber: '',
      invoiceDate: '',
      invoiceAmount: 0,
      vatIncluded: true,
      vatRate: 12,
      status: 'Yozilmagan',
      accountantNotes: ''
    });

    setIsNewDealModalOpen(false);
    // Reset defaults
    setNewDealNumber(`SN-2026-0${invoices.length + 92}`);
  };

  // Status helper badge
  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'Yozilmagan':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          icon: Clock,
          desc: 'Bitim sotuvchi tomonidan kiritildi, buxgalter hali ishni boshlamagan'
        };
      case 'Jarayonda':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          icon: Clock,
          desc: 'Buxgalter hisob-fakturani tayyorlamoqda'
        };
      case 'Aniqlashtirish kerak':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse font-bold',
          icon: AlertTriangle,
          desc: 'Summa/QQS/rekvizitlarda farq bor — sotuvchidan javob talab qilinadi'
        };
      case 'Yozildi':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-300',
          icon: FileCheck,
          desc: 'Hisob-faktura rasmiylashtirildi va qayd etildi'
        };
      case 'Mijozga yuborildi':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          icon: CheckCircle2,
          desc: 'Hujjat xaridorga topshirildi — bitim yopildi'
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: HelpCircle,
          desc: ''
        };
    }
  };

  // Calculations for summary metrics
  const metrics = useMemo(() => {
    let totalDealAmount = 0;
    let totalInvoicedAmount = 0;
    let totalNaqdAmount = 0;
    let totalPerechisleniyaAmount = 0;
    let naqdCount = 0;
    let perechisleniyaCount = 0;
    let discrepancyCount = 0;
    let closedCount = 0;

    invoices.forEach(inv => {
      totalDealAmount += inv.dealAmount;
      totalInvoicedAmount += inv.invoiceAmount;

      if (inv.paymentType === 'Naqd') {
        totalNaqdAmount += inv.dealAmount;
        naqdCount++;
      } else {
        totalPerechisleniyaAmount += inv.dealAmount;
        perechisleniyaCount++;
      }

      const diff = inv.dealAmount - inv.invoiceAmount;
      if (inv.status === 'Aniqlashtirish kerak' || (inv.status !== 'Yozilmagan' && diff !== 0)) {
        discrepancyCount++;
      }
      if (inv.status === 'Mijozga yuborildi') {
        closedCount++;
      }
    });

    return {
      totalDealAmount,
      totalInvoicedAmount,
      totalNaqdAmount,
      totalPerechisleniyaAmount,
      naqdCount,
      perechisleniyaCount,
      discrepancyCount,
      closedCount
    };
  }, [invoices]);

  // Filtered rows
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      // Payment filter
      if (paymentFilter !== 'all' && inv.paymentType !== paymentFilter) return false;

      // Status filter
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false;

      // Discrepancy only filter
      if (onlyDiscrepancies) {
        const diff = inv.dealAmount - inv.invoiceAmount;
        const isDiscrepant = inv.status === 'Aniqlashtirish kerak' || (inv.status !== 'Yozilmagan' && diff !== 0);
        if (!isDiscrepant) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          inv.dealNumber.toLowerCase().includes(q) ||
          inv.clientName.toLowerCase().includes(q) ||
          inv.clientInn.includes(q) ||
          inv.productName.toLowerCase().includes(q) ||
          inv.sellerName.toLowerCase().includes(q) ||
          inv.invoiceNumber.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [invoices, paymentFilter, statusFilter, onlyDiscrepancies, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl shadow-xs">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Hisob-fakturalarni kelishish reyestri
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  Sotuvchilar + Buxgalteriya
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Sotuvchi va buxgalter bir xil ma’lumotlarni ko‘radigan yagona reyestr jadvali — qaysi hisob-faktura va qancha summaga yopilishini to‘liq nazorat qiladi.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-xs"
            title="Reyestrni chop etish"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Chop etish</span>
          </button>

          <button
            onClick={() => setIsNewDealModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm hover:shadow active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi bitim kiritish (Sotuvchi)</span>
          </button>
        </div>
      </div>

      {/* How it works Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 via-amber-50/60 to-emerald-50/80 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Reyestr jadvalidagi rang zonalari qanday ishlaydi:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-100/90 text-blue-900 border border-blue-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              1. SOTUVCHI (Ko‘k zona): Bitim, tovar, xaridor va ombor ma’lumotlari
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100/90 text-amber-900 border border-amber-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              2. BUXGALTER (To‘q sariq): HF raqami, QQS va holat
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100/90 text-emerald-900 border border-emerald-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              3. AVTOMATIK (Yashil): Formula orqali Farq va QQS
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 border border-rose-300 font-black">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
              QIZIL FARQ: Aniqlashtirish kerak!
            </span>
          </div>
        </div>
      </div>

      {/* SMART PANELS: NAQD VA PERECHISLENIYA + BALANS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Panel 1: Jami bitimlar summasi */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jami bitimlar summasi</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {metrics.totalDealAmount.toLocaleString()} <span className="text-xs font-semibold text-slate-400">so‘m</span>
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Yozilgan fakturalar:</span>
            <span className="font-bold text-slate-800">{metrics.totalInvoicedAmount.toLocaleString()} so‘m</span>
          </div>
        </div>

        {/* Panel 2: PERECHISLENIYA PANELI (Bank o'tkazmasi) */}
        <div 
          onClick={() => setPaymentFilter(paymentFilter === 'Perechisleniya' ? 'all' : 'Perechisleniya')}
          className={`cursor-pointer transition-all bg-gradient-to-br from-indigo-50/80 via-white to-sky-50/50 p-5 rounded-2xl border ${
            paymentFilter === 'Perechisleniya' ? 'border-indigo-500 ring-2 ring-indigo-200 shadow-md' : 'border-slate-200 shadow-xs hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-indigo-950 uppercase tracking-wider">Perechisleniya paneli</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-indigo-100 text-indigo-800 rounded">Bank</span>
            </div>
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-indigo-900 tracking-tight">
              {metrics.totalPerechisleniyaAmount.toLocaleString()} <span className="text-xs font-semibold text-indigo-400">so‘m</span>
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-indigo-700 pt-2 border-t border-indigo-100/60 font-medium">
            <span>{metrics.perechisleniyaCount} ta bitim (E-faktura / Didox)</span>
            <span className="text-[11px] font-bold underline">Filtrlash →</span>
          </div>
        </div>

        {/* Panel 3: NAQD PUL PANELI (Kassa) */}
        <div 
          onClick={() => setPaymentFilter(paymentFilter === 'Naqd' ? 'all' : 'Naqd')}
          className={`cursor-pointer transition-all bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 p-5 rounded-2xl border ${
            paymentFilter === 'Naqd' ? 'border-emerald-500 ring-2 ring-emerald-200 shadow-md' : 'border-slate-200 shadow-xs hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-emerald-950 uppercase tracking-wider">Naqd to‘lov paneli</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">Kassa</span>
            </div>
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-emerald-900 tracking-tight">
              {metrics.totalNaqdAmount.toLocaleString()} <span className="text-xs font-semibold text-emerald-400">so‘m</span>
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-emerald-700 pt-2 border-t border-emerald-100/60 font-medium">
            <span>{metrics.naqdCount} ta bitim (Kassa kirim orderi)</span>
            <span className="text-[11px] font-bold underline">Filtrlash →</span>
          </div>
        </div>

        {/* Panel 4: FARQ VA OGOHLANTIRISH (Signal) */}
        <div 
          onClick={() => setOnlyDiscrepancies(!onlyDiscrepancies)}
          className={`cursor-pointer transition-all p-5 rounded-2xl border ${
            onlyDiscrepancies 
              ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-200 shadow-md' 
              : metrics.discrepancyCount > 0
                ? 'bg-rose-50/60 border-rose-200 shadow-xs hover:border-rose-400'
                : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Kelishmovchilik / Farq</span>
            <div className={`p-2 rounded-xl ${metrics.discrepancyCount > 0 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${metrics.discrepancyCount > 0 ? 'text-rose-700' : 'text-slate-800'}`}>
              {metrics.discrepancyCount} ta bitim
            </span>
            {metrics.discrepancyCount > 0 && (
              <span className="text-xs font-black text-rose-600 uppercase tracking-wider">Signal!</span>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-rose-700 pt-2 border-t border-rose-100 font-medium">
            <span>Aniqlashtirish kerak bo‘lgan qatorlar</span>
            <span className="text-[11px] font-bold underline">
              {onlyDiscrepancies ? 'Barchasini ko‘rish' : 'Faqat farqlilar'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and View Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Perspective Selector (Tabs) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-bold w-fit">
            <button
              onClick={() => setActiveRoleView('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeRoleView === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yagona jadval (Barcha zonalar)
            </button>
            <button
              onClick={() => setActiveRoleView('seller')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeRoleView === 'seller'
                  ? 'bg-blue-600 text-white shadow-xs font-black'
                  : 'text-blue-700 hover:bg-blue-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-300"></span>
              Sotuvchi ko‘rinishi
            </button>
            <button
              onClick={() => setActiveRoleView('accountant')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeRoleView === 'accountant'
                  ? 'bg-amber-600 text-white shadow-xs font-black'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-300"></span>
              Buxgalteriya ko‘rinishi
            </button>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Bitim №, mijoz, INN, tovar (opora) yoki hisob-faktura..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">To‘lov turi:</span>
          <button
            onClick={() => setPaymentFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              paymentFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Barchasi
          </button>
          <button
            onClick={() => setPaymentFilter('Perechisleniya')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              paymentFilter === 'Perechisleniya'
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Perechisleniya ({metrics.perechisleniyaCount})
          </button>
          <button
            onClick={() => setPaymentFilter('Naqd')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              paymentFilter === 'Naqd'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Banknote className="w-3.5 h-3.5" />
            Naqd pul ({metrics.naqdCount})
          </button>

          <span className="w-px h-4 bg-slate-200 mx-1"></span>

          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Holat:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">Barcha holatlar</option>
            <option value="Yozilmagan">Yozilmagan (yangi)</option>
            <option value="Jarayonda">Jarayonda</option>
            <option value="Aniqlashtirish kerak">Aniqlashtirish kerak (Farqli)</option>
            <option value="Yozildi">Yozildi</option>
            <option value="Mijozga yuborildi">Mijozga yuborildi</option>
          </select>

          <button
            onClick={() => setOnlyDiscrepancies(!onlyDiscrepancies)}
            className={`ml-auto px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
              onlyDiscrepancies
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Faqat farqli bitimlar (Qizil qatorlar)
          </button>
        </div>
      </div>

      {/* MAIN UNIFIED REYESTR TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              {/* TOP ZONE HEADER (Color Blocks) */}
              <tr className="border-b border-slate-200 text-center font-black tracking-wider text-[11px] uppercase">
                {/* Sotuvchi Zone */}
                {(activeRoleView === 'all' || activeRoleView === 'seller') && (
                  <th
                    colSpan={activeRoleView === 'seller' ? 8 : 7}
                    className="bg-blue-600 text-white py-2.5 px-4 border-r border-blue-500/80"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
                      <span>SOTUVCHI TO‘LDIRADI (Ko‘k zona) — Bitim, kirim tovari, mijoz, tovar va summa</span>
                    </div>
                  </th>
                )}

                {/* Buxgalter Zone */}
                {(activeRoleView === 'all' || activeRoleView === 'accountant') && (
                  <th
                    colSpan={5}
                    className="bg-amber-600 text-white py-2.5 px-4 border-r border-amber-500/80"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                      <span>BUXGALTER TO‘LDIRADI (To‘q sariq zona) — Yozilgan hisob-faktura va holati</span>
                    </div>
                  </th>
                )}

                {/* Avtomatik Zone */}
                {activeRoleView === 'all' && (
                  <th colSpan={3} className="bg-emerald-600 text-white py-2.5 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AVTOMATIK FORMULA (Yashil zona) — QQS, Farq va Ombor</span>
                    </div>
                  </th>
                )}
              </tr>

              {/* INDIVIDUAL COLUMN HEADERS */}
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-black text-[11px]">
                {/* SOTUVCHI COLUMNS */}
                {(activeRoleView === 'all' || activeRoleView === 'seller') && (
                  <>
                    <th className="py-3 px-3.5 bg-blue-50/70 border-r border-slate-200 whitespace-nowrap">
                      Bitim № & Sana
                    </th>
                    <th className="py-3 px-3.5 bg-blue-50/70 border-r border-slate-200 whitespace-nowrap">
                      Sotuvchi (Menejer)
                    </th>
                    <th className="py-3 px-3.5 bg-blue-50/70 border-r border-slate-200 min-w-[180px]">
                      Mijoz & INN
                    </th>
                    <th className="py-3 px-3.5 bg-blue-50/70 border-r border-slate-200 min-w-[200px]">
                      Tovar (Opora turi va miqdori)
                    </th>
                    <th className="py-3 px-3.5 bg-blue-50/70 border-r border-slate-200 text-center whitespace-nowrap">
                      To‘lov turi
                    </th>
                    <th className="py-3 px-3.5 bg-blue-50/70 border-r border-slate-200 text-right whitespace-nowrap">
                      Bitim summasi (so‘m)
                    </th>
                    <th className="py-3 px-3.5 bg-blue-50/70 border-r border-blue-200 min-w-[170px]">
                      Ta’minotchidan tovar / Ombor
                    </th>
                  </>
                )}

                {/* BUXGALTER COLUMNS */}
                {(activeRoleView === 'all' || activeRoleView === 'accountant') && (
                  <>
                    <th className="py-3 px-3.5 bg-amber-50/80 border-r border-slate-200 whitespace-nowrap">
                      Hisob-faktura № & Sana
                    </th>
                    <th className="py-3 px-3.5 bg-amber-50/80 border-r border-slate-200 text-right whitespace-nowrap">
                      HF summasi (so‘m)
                    </th>
                    <th className="py-3 px-3.5 bg-amber-50/80 border-r border-slate-200 text-center whitespace-nowrap">
                      QQS (12%)
                    </th>
                    <th className="py-3 px-3.5 bg-amber-50/80 border-r border-slate-200 whitespace-nowrap">
                      Hisob-faktura holati
                    </th>
                    <th className="py-3 px-3.5 bg-amber-50/80 border-r border-amber-200 text-center whitespace-nowrap">
                      Buxgalter amali
                    </th>
                  </>
                )}

                {/* AVTOMATIK COLUMNS */}
                {activeRoleView === 'all' && (
                  <>
                    <th className="py-3 px-3.5 bg-emerald-50/70 border-r border-slate-200 text-right whitespace-nowrap">
                      QQS summasi
                    </th>
                    <th className="py-3 px-3.5 bg-emerald-50/70 border-r border-slate-200 text-right whitespace-nowrap font-black">
                      Farq (Signal)
                    </th>
                    <th className="py-3 px-3.5 bg-emerald-50/70 text-center whitespace-nowrap">
                      Ombordan chiqarish
                    </th>
                  </>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/80 font-medium">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={15} className="py-12 text-center text-slate-400">
                    <FileSpreadsheet className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-bold text-slate-600">Mos keluvchi bitimlar topilmadi</p>
                    <p className="text-xs text-slate-400 mt-1">Filtr parametrlarini o‘zgartirib ko‘ring</p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((item, idx) => {
                  const statusInfo = getStatusBadge(item.status);
                  const StatusIcon = statusInfo.icon;

                  // Avtomatik hisob-kitoblar
                  const vatAmount = item.invoiceAmount > 0
                    ? Math.round((item.invoiceAmount * (item.vatRate || 12)) / (100 + (item.vatRate || 12)))
                    : Math.round(item.dealAmount * 0.12);

                  const difference = item.invoiceAmount > 0
                    ? item.dealAmount - item.invoiceAmount
                    : 0;

                  // FARQ MAVJUDMI? (Qizil rang signali)
                  const hasDiscrepancy =
                    item.status === 'Aniqlashtirish kerak' ||
                    (item.invoiceAmount > 0 && difference !== 0);

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors hover:bg-slate-50/80 ${
                        hasDiscrepancy
                          ? 'bg-rose-50/80 border-l-4 border-l-rose-500'
                          : idx % 2 === 0
                            ? 'bg-white'
                            : 'bg-slate-50/30'
                      }`}
                    >
                      {/* SOTUVCHI USTUNLARI */}
                      {(activeRoleView === 'all' || activeRoleView === 'seller') && (
                        <>
                          {/* Bitim № & Sana */}
                          <td className="py-3 px-3.5 border-r border-slate-200">
                            <span className="font-bold text-slate-900 block">{item.dealNumber}</span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" /> {item.dealDate}
                            </span>
                          </td>

                          {/* Sotuvchi (Menejer) */}
                          <td className="py-3 px-3.5 border-r border-slate-200 text-slate-700 whitespace-nowrap">
                            <div className="font-medium text-slate-800">{item.sellerName}</div>
                          </td>

                          {/* Mijoz & INN */}
                          <td className="py-3 px-3.5 border-r border-slate-200">
                            <div className="font-bold text-slate-900">{item.clientName}</div>
                            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                              <span className="text-slate-400">INN:</span> {item.clientInn || 'Mavjud emas'}
                            </div>
                          </td>

                          {/* Tovar (Opora turi) */}
                          <td className="py-3 px-3.5 border-r border-slate-200">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                              <span>{item.productName}</span>
                            </div>
                            <div className="text-[11px] text-blue-700 font-semibold mt-0.5">
                              Miqdori: {item.quantity} {item.unit}
                            </div>
                          </td>

                          {/* To'lov turi (Naqd / Perechisleniya) */}
                          <td className="py-3 px-3.5 border-r border-slate-200 text-center whitespace-nowrap">
                            {item.paymentType === 'Naqd' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <Banknote className="w-3.5 h-3.5" />
                                Naqd pul
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                                <Building2 className="w-3.5 h-3.5" />
                                Perechisleniya
                              </span>
                            )}
                          </td>

                          {/* Bitim summasi */}
                          <td className="py-3 px-3.5 border-r border-slate-200 text-right whitespace-nowrap">
                            <span className="font-black text-slate-900 text-[13px]">
                              {item.dealAmount.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-400 block">so‘m</span>
                          </td>

                          {/* Ta'minotchidan tovar va ombor */}
                          <td className="py-3 px-3.5 border-r border-blue-200 text-slate-600 text-[11px] space-y-1">
                            <div title="Ta'minotchidan kelgan tovar" className="truncate max-w-[200px]">
                              <span className="font-bold text-blue-800">Kirim:</span> {item.supplierGoods || 'Mavjud emas'}
                            </div>
                            <div title="Ombordan hisobdan chiqariladigan tovar" className="truncate max-w-[200px] text-slate-500">
                              <span className="font-bold text-slate-700">Chiqim:</span> {item.warehouseDeduction || 'Standart opora'}
                            </div>
                          </td>
                        </>
                      )}

                      {/* BUXGALTER USTUNLARI */}
                      {(activeRoleView === 'all' || activeRoleView === 'accountant') && (
                        <>
                          {/* HF № & Sana */}
                          <td className="py-3 px-3.5 border-r border-slate-200 whitespace-nowrap">
                            {item.invoiceNumber ? (
                              <div>
                                <span className="font-mono font-bold text-amber-950 block">{item.invoiceNumber}</span>
                                <span className="text-[10px] text-slate-400">{item.invoiceDate}</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">— kiritilmagan —</span>
                            )}
                          </td>

                          {/* HF summasi */}
                          <td className="py-3 px-3.5 border-r border-slate-200 text-right whitespace-nowrap">
                            {item.invoiceAmount > 0 ? (
                              <div>
                                <span className={`font-black text-[13px] ${hasDiscrepancy ? 'text-rose-700 underline' : 'text-slate-900'}`}>
                                  {item.invoiceAmount.toLocaleString()}
                                </span>
                                <span className="text-[10px] text-slate-400 block">so‘m</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">0 so‘m</span>
                            )}
                          </td>

                          {/* QQS stavkasi */}
                          <td className="py-3 px-3.5 border-r border-slate-200 text-center">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[11px]">
                              {item.vatRate || 12}%
                            </span>
                          </td>

                          {/* Hisob-faktura holati (Dropdown Select) */}
                          <td className="py-3 px-3.5 border-r border-slate-200">
                            <div className="flex flex-col gap-1">
                              <select
                                value={item.status}
                                onChange={e => updateInvoiceStatus(item.id, e.target.value as InvoiceStatus)}
                                className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-hidden cursor-pointer ${statusInfo.bg}`}
                              >
                                <option value="Yozilmagan">Yozilmagan (yangi)</option>
                                <option value="Jarayonda">Jarayonda</option>
                                <option value="Aniqlashtirish kerak">Aniqlashtirish kerak ⚠️</option>
                                <option value="Yozildi">Yozildi ✓</option>
                                <option value="Mijozga yuborildi">Mijozga yuborildi ✓✓</option>
                              </select>

                              {item.accountantNotes && (
                                <p className="text-[10px] text-slate-500 italic truncate max-w-[160px]" title={item.accountantNotes}>
                                  {item.accountantNotes}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Buxgalter tahrirlash amali */}
                          <td className="py-3 px-3.5 border-r border-amber-200 text-center">
                            <button
                              onClick={() => handleOpenAccountantModal(item)}
                              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                              title="Hisob-faktura rekvizitlarini to‘ldirish"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>HF to‘ldirish</span>
                            </button>
                          </td>
                        </>
                      )}

                      {/* AVTOMATIK FORMULA USTUNLARI */}
                      {activeRoleView === 'all' && (
                        <>
                          {/* QQS summasi */}
                          <td className="py-3 px-3.5 border-r border-slate-200 text-right whitespace-nowrap text-slate-700">
                            <span className="font-semibold text-slate-800">
                              {vatAmount.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-400 block">so‘m</span>
                          </td>

                          {/* FARQ USTUNI (Qizil rang signali agar mos kelmasa!) */}
                          <td className="py-3 px-3.5 border-r border-slate-200 text-right whitespace-nowrap">
                            {hasDiscrepancy ? (
                              <div className="p-1.5 rounded-lg bg-rose-100 border border-rose-300 text-rose-800 font-black animate-pulse">
                                <div>+{difference.toLocaleString()} so‘m</div>
                                <div className="text-[10px] font-extrabold uppercase tracking-tight text-rose-700">
                                  ⚠️ Aniqlashtirish kerak!
                                </div>
                              </div>
                            ) : item.invoiceAmount > 0 ? (
                              <div className="text-emerald-700 font-bold flex items-center justify-end gap-1">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>0 so‘m (To‘g‘ri)</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px]">— kutilmoqda —</span>
                            )}
                          </td>

                          {/* OMBORDAN HISOBDAN CHIQARISH */}
                          <td className="py-3 px-3.5 text-center whitespace-nowrap">
                            {item.warehouseDeducted ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Chiqarildi ✓
                              </span>
                            ) : (
                              <button
                                onClick={() => deductInvoiceFromWarehouse(item.id)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 mx-auto"
                                title="Ombordan oporani hisobdan chiqarish (Chiqim harakatini qayd etish)"
                              >
                                <Warehouse className="w-3 h-3" />
                                <span>Ombordan chiqarish</span>
                              </button>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer with totals */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Ko‘rsatilmoqda: {filteredInvoices.length} ta bitim</span>
            <span>•</span>
            <span className="text-blue-700 font-medium">Ko‘k: Sotuvchi</span>
            <span>•</span>
            <span className="text-amber-700 font-medium">To‘q sariq: Buxgalteriya</span>
            <span>•</span>
            <span className="text-emerald-700 font-medium">Yashil: Avtomatik</span>
          </div>

          <div className="flex items-center gap-4 text-slate-800 font-bold">
            <div>
              Bitimlar: <span className="font-black text-slate-900">{metrics.totalDealAmount.toLocaleString()} so‘m</span>
            </div>
            <div>
              HF summasi: <span className="font-black text-indigo-700">{metrics.totalInvoicedAmount.toLocaleString()} so‘m</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* MODAL 1: SOTUVCHI YANGI BITIM KIRITISH (Ko'k zona)   */}
      {/* ==================================================== */}
      {isNewDealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-blue-200" />
                <div>
                  <h3 className="font-black text-base">Yangi bitim kiritish (Sotuvchi bo‘limi)</h3>
                  <p className="text-xs text-blue-100">Reyestrning ko‘k ustunlarini to‘ldirish</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewDealModalOpen(false)}
                className="p-1 rounded-xl text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCreateNewDeal} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bitim / Shartnoma raqami *</label>
                  <input
                    type="text"
                    required
                    value={newDealNumber}
                    onChange={e => setNewDealNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sotuvchi (Mas’ul menejer) *</label>
                  <input
                    type="text"
                    required
                    value={newSellerName}
                    onChange={e => setNewSellerName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Client Selection */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
                <span className="font-bold text-blue-900 block text-xs">Xaridor (Mijoz) rekvizitlari:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Mavjud mijozlardan tanlash:</label>
                    <select
                      value={newClientId}
                      onChange={e => handleClientChange(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium"
                    >
                      {clients.map(cli => (
                        <option key={cli.id} value={cli.id}>
                          {cli.companyName} (INN: {cli.inn})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Mijoz INN raqami *</label>
                    <input
                      type="text"
                      required
                      value={newClientInn}
                      onChange={e => setNewClientInn(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Product and Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Tovar nomi (Opora turi) *</label>
                  <select
                    value={newProductName}
                    onChange={e => setNewProductName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white font-semibold"
                  >
                    {finishedProducts.map(fp => (
                      <option key={fp.id} value={fp.name}>
                        {fp.name} (Qoldiq: {fp.stock} dona)
                      </option>
                    ))}
                    <option value="Opora 8m po‘lat yoritish ustuni (Flanetsli dumaloq)">
                      Opora 8m po‘lat yoritish ustuni (Flanetsli dumaloq)
                    </option>
                    <option value="Opora 9m po‘lat yoritish ustuni (Konussimon)">
                      Opora 9m po‘lat yoritish ustuni (Konussimon)
                    </option>
                    <option value="Quyosh paneli metall oporasi (Geliotizim tayanchi)">
                      Quyosh paneli metall oporasi (Geliotizim tayanchi)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Miqdori (dona) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newQuantity}
                    onChange={e => setNewQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white font-bold"
                  />
                </div>
              </div>

              {/* Amount and Payment Type (Naqd / Perechisleniya) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bitim summasi (so‘m) *</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={newDealAmount}
                    onChange={e => setNewDealAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white font-black text-blue-700 text-sm"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">To‘lov turi *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewPaymentType('Perechisleniya')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        newPaymentType === 'Perechisleniya'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      Perechisleniya
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewPaymentType('Naqd')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        newPaymentType === 'Naqd'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Banknote className="w-3.5 h-3.5" />
                      Naqd pul
                    </button>
                  </div>
                </div>
              </div>

              {/* Supplier and Warehouse details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Ta’minotchidan kelgan tovar / xomashyo
                  </label>
                  <input
                    type="text"
                    value={newSupplierGoods}
                    onChange={e => setNewSupplierGoods(e.target.value)}
                    placeholder="Masalan: Bekobod metall listi 4mm..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Ombordan hisobdan chiqariladigan opora
                  </label>
                  <input
                    type="text"
                    value={newWarehouseDeduction}
                    onChange={e => setNewWarehouseDeduction(e.target.value)}
                    placeholder="Masalan: Opora 9m — 50 dona..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewDealModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Reyestrga kiritish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 2: BUXGALTER HISOB-FAKTURA TO'LDIRISH (To'q sariq) */}
      {/* ==================================================== */}
      {isAccountantModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-5 h-5 text-amber-200" />
                <div>
                  <h3 className="font-black text-base">Hisob-fakturani rasmiylashtirish (Buxgalteriya)</h3>
                  <p className="text-xs text-amber-100">
                    Bitim: {selectedInvoice.dealNumber} • {selectedInvoice.clientName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAccountantModalOpen(false)}
                className="p-1 rounded-xl text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveAccountantData} className="p-6 space-y-4 text-xs">
              {/* Reference deal amount notice */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-amber-800 block">Sotuvchi kiritgan bitim summasi:</span>
                  <span className="font-black text-amber-950 text-sm">
                    {selectedInvoice.dealAmount.toLocaleString()} so‘m
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2 py-1 bg-white rounded-lg border border-amber-300 text-amber-900">
                  {selectedInvoice.paymentType}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hisob-faktura raqami (HF №) *</label>
                  <input
                    type="text"
                    required
                    value={editInvoiceNumber}
                    onChange={e => setEditInvoiceNumber(e.target.value)}
                    placeholder="Masalan: HF-2026-0450"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">HF yozilgan sana *</label>
                  <input
                    type="date"
                    required
                    value={editInvoiceDate}
                    onChange={e => setEditInvoiceDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Invoice Amount and Discrepancy Alert */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 block">
                    Yozilgan hisob-faktura summasi (so‘m) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditInvoiceAmount(selectedInvoice.dealAmount)}
                    className="text-[11px] text-blue-600 hover:underline font-bold"
                  >
                    Bitim summasiga tenglashtirish
                  </button>
                </div>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  required
                  value={editInvoiceAmount}
                  onChange={e => setEditInvoiceAmount(Number(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-xl font-black text-sm ${
                    Number(editInvoiceAmount) !== selectedInvoice.dealAmount
                      ? 'border-rose-300 bg-rose-50/50 text-rose-800'
                      : 'border-slate-200 bg-slate-50 focus:bg-white text-slate-900'
                  }`}
                />

                {/* Instant preview of difference */}
                {Number(editInvoiceAmount) !== selectedInvoice.dealAmount && editInvoiceAmount > 0 && (
                  <div className="mt-2 p-2 bg-rose-100 border border-rose-300 rounded-lg text-rose-800 text-[11px] font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Diqqat! Farq: {Math.abs(selectedInvoice.dealAmount - editInvoiceAmount).toLocaleString()} so‘m.
                      Reyestrda «Aniqlashtirish kerak» deb qizil rangda ko‘rinadi!
                    </span>
                  </div>
                )}
              </div>

              {/* Status Selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Hisob-faktura holati (Ochiladigan ro‘yxat) *
                </label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value as InvoiceStatus)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white font-bold text-xs"
                >
                  <option value="Yozilmagan">Yozilmagan (Buxgalter hali ishni boshlamagan)</option>
                  <option value="Jarayonda">Jarayonda (Hisob-faktura tayyorlanmoqda)</option>
                  <option value="Aniqlashtirish kerak">Aniqlashtirish kerak (Summa/QQSda farq bor)</option>
                  <option value="Yozildi">Yozildi (Rasmiylashtirildi va qayd etildi)</option>
                  <option value="Mijozga yuborildi">Mijozga yuborildi (Didox/E-faktura yuborildi va bitim yopildi)</option>
                </select>
              </div>

              {/* Accountant Notes */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Buxgalter izohi / Sotuvchiga xabar (agar farq bo‘lsa sababi):
                </label>
                <textarea
                  rows={2}
                  value={editAccountantNotes}
                  onChange={e => setEditAccountantNotes(e.target.value)}
                  placeholder="Masalan: Didox orqali yuborildi yoki 5 dona qo‘shimcha opora hisobga kiritilmagan..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAccountantModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Saqlash va qayd etish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
