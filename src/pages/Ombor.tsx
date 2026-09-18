import React, { useState, useMemo } from 'react';
import {
  Package,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  Plus,
  Search,
  CheckCircle2,
  X,
  History,
  Boxes
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WarehouseMovement } from '../types';

export const Ombor: React.FC = () => {
  const {
    rawMaterials,
    finishedProducts,
    warehouseMovements,
    addWarehouseMovement
  } = useApp();

  const [activeTab, setActiveTab] = useState<'xomashyo' | 'tayyor' | 'harakatlar'>('xomashyo');
  const [searchQuery, setSearchQuery] = useState('');
  const [movementCategoryFilter, setMovementCategoryFilter] = useState<'all' | 'opora' | 'raw'>('all');

  // Kirim / Chiqim Modal state
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [movementType, setMovementType] = useState<'Kirim' | 'Chiqim'>('Kirim');
  const [selectedTargetType, setSelectedTargetType] = useState<'raw' | 'finished'>('raw');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [movementQty, setMovementQty] = useState(10);
  const [performedBy, setPerformedBy] = useState('Rustam Ahmedov (Bosh omborchi)');
  const [movementNotes, setMovementNotes] = useState('');

  // Low stock counts
  const rawLowStockCount = (rawMaterials || []).filter(rm => (rm.currentStock ?? 0) < (rm.minStock ?? 0)).length;
  const finishedLowStockCount = (finishedProducts || []).filter(fp => (fp.stock ?? 0) < (fp.minStock ?? 0)).length;

  // Opora calculations for full Prikhod / Raskhod tracking
  const oporaStats = useMemo(() => {
    const prods = finishedProducts || [];
    const movs = warehouseMovements || [];
    const totalStock = prods.reduce((sum, p) => sum + (p.stock || 0), 0);
    const oporaMovements = movs.filter(m => {
      const name = (m.productName || '').toLowerCase();
      return name.includes('ustun') || name.includes('opora') || m.unit === 'dona';
    });
    const totalKirim = oporaMovements.filter(m => m.type === 'Kirim').reduce((sum, m) => sum + (m.quantity || 0), 0);
    const totalChiqim = oporaMovements.filter(m => m.type === 'Chiqim').reduce((sum, m) => sum + (m.quantity || 0), 0);
    return { totalStock, totalKirim, totalChiqim, totalModels: prods.length };
  }, [finishedProducts, warehouseMovements]);

  // Filtered raw materials
  const filteredRaw = useMemo(() => {
    return (rawMaterials || []).filter(rm => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const name = (rm.name || '').toLowerCase();
      const cat = (rm.category || '').toLowerCase();
      const loc = (rm.location || '').toLowerCase();
      const id = (rm.id || '').toLowerCase();
      return name.includes(q) || cat.includes(q) || loc.includes(q) || id.includes(q);
    });
  }, [rawMaterials, searchQuery]);

  // Filtered finished products
  const filteredFinished = useMemo(() => {
    return (finishedProducts || []).filter(fp => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const name = (fp.name || '').toLowerCase();
      const height = (fp.height || '').toLowerCase();
      const diam = (fp.diameter || '').toLowerCase();
      const status = (fp.status || '').toLowerCase();
      const id = (fp.id || '').toLowerCase();
      return name.includes(q) || height.includes(q) || diam.includes(q) || status.includes(q) || id.includes(q);
    });
  }, [finishedProducts, searchQuery]);

  // Filtered movements
  const filteredMovements = useMemo(() => {
    return (warehouseMovements || []).filter(wm => {
      const prodName = (wm.productName || '').toLowerCase();
      const isOpora = prodName.includes('ustun') || prodName.includes('opora') || wm.unit === 'dona';
      if (movementCategoryFilter === 'opora') {
        if (!isOpora) return false;
      } else if (movementCategoryFilter === 'raw') {
        if (isOpora) return false;
      }
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const supp = (wm.supplierOrDestination || '').toLowerCase();
      const notes = (wm.notes || '').toLowerCase();
      const reason = (wm.reason || '').toLowerCase();
      return prodName.includes(q) || supp.includes(q) || notes.includes(q) || reason.includes(q);
    });
  }, [warehouseMovements, movementCategoryFilter, searchQuery]);

  const handleOpenMovementModal = (type: 'Kirim' | 'Chiqim') => {
    setMovementType(type);
    if (rawMaterials && rawMaterials.length > 0) {
      setSelectedItemId(rawMaterials[0].id);
      setSelectedTargetType('raw');
    } else if (finishedProducts && finishedProducts.length > 0) {
      setSelectedItemId(finishedProducts[0].id);
      setSelectedTargetType('finished');
    }
    setIsMovementModalOpen(true);
  };

  const handleSaveMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId || movementQty <= 0) return;

    let pName = '';
    let pUnit = 'dona';
    let pPrice: number | undefined;

    if (selectedTargetType === 'raw') {
      const found = (rawMaterials || []).find(r => r.id === selectedItemId);
      if (found) {
        pName = found.name;
        pUnit = found.unit;
        pPrice = found.pricePerUnit;
      }
    } else {
      const found = (finishedProducts || []).find(f => f.id === selectedItemId);
      if (found) {
        pName = found.name;
        pUnit = 'dona';
        pPrice = found.price;
      }
    }

    addWarehouseMovement({
      type: movementType,
      productName: pName,
      quantity: Number(movementQty),
      unit: pUnit,
      supplierOrDestination: performedBy || 'Omborchi',
      price: pPrice,
      notes: movementNotes || (movementType === 'Kirim' ? 'Omborga kirim qilindi' : 'Ombordan chiqim qilindi')
    });

    setIsMovementModalOpen(false);
    setMovementNotes('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Ombor xo‘jaligi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Xomashyo zaxiralari, tayyor po‘lat ustunlar va qoldiqlar harakati
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="warehouse-kirim-btn"
            onClick={() => handleOpenMovementModal('Kirim')}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-xs transition-colors"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>+ Kirim qilish</span>
          </button>

          <button
            id="warehouse-chiqim-btn"
            onClick={() => handleOpenMovementModal('Chiqim')}
            className="flex items-center gap-1.5 bg-[#EA580C] hover:bg-[#D44806] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-xs transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>+ Chiqim qilish</span>
          </button>
        </div>
      </div>

      {/* 3 Tabs Navigation Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto">
        <button
          id="tab-xomashyo"
          onClick={() => setActiveTab('xomashyo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shrink-0 ${
            activeTab === 'xomashyo'
              ? 'bg-[#0F2942] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. Xomashyo (Сырье)</span>
          {rawLowStockCount > 0 && (
            <span className="text-[11px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">
              {rawLowStockCount} kam
            </span>
          )}
        </button>

        <button
          id="tab-tayyor"
          onClick={() => setActiveTab('tayyor')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shrink-0 ${
            activeTab === 'tayyor'
              ? 'bg-[#0F2942] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>2. Opora ustunlari (Tayyor mahsulot)</span>
          {finishedLowStockCount > 0 && (
            <span className="text-[11px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">
              {finishedLowStockCount}
            </span>
          )}
        </button>

        <button
          id="tab-harakatlar"
          onClick={() => setActiveTab('harakatlar')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shrink-0 ${
            activeTab === 'harakatlar'
              ? 'bg-[#0F2942] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>3. Harakatlar (Приход / Расход jurnali)</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder={
              activeTab === 'xomashyo'
                ? 'Xomashyo nomi yoki kodi bo‘yicha qidirish...'
                : activeTab === 'tayyor'
                ? 'Po‘lat ustun nomi yoki balandligi bo‘yicha qidirish...'
                : 'Kirim-chiqim operatsiyalari bo‘yicha qidirish...'
            }
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
          />
        </div>
      </div>

      {/* TAB 1: Xomashyo Content */}
      {activeTab === 'xomashyo' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-4 sm:px-6">Kodi</th>
                  <th className="py-3.5 px-4">Xomashyo nomi</th>
                  <th className="py-3.5 px-4">Kategoriya</th>
                  <th className="py-3.5 px-4">Joriy qoldiq</th>
                  <th className="py-3.5 px-4">O‘lchov birligi</th>
                  <th className="py-3.5 px-4">Min. qoldiq</th>
                  <th className="py-3.5 px-4">Holat</th>
                  <th className="py-3.5 px-4 text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredRaw.map(item => {
                  const isLow = item.currentStock < item.minStock;
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isLow ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-xs text-slate-500">
                        {item.id.toUpperCase()}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-400">{item.location}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                        {item.category}
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        {item.currentStock.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-slate-500">
                        {item.unit}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-500">
                        {item.minStock.toLocaleString()} {item.unit}
                      </td>
                      <td className="py-3.5 px-4">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle className="w-3 h-3" />
                            Kam qoldi
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Yetarli
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedTargetType('raw');
                            setSelectedItemId(item.id);
                            setMovementType('Kirim');
                            setIsMovementModalOpen(true);
                          }}
                          className="text-xs font-bold text-[#EA580C] hover:underline"
                        >
                          + Kirim
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Tayyor mahsulot (Opora po‘lat ustunlari) Content */}
      {activeTab === 'tayyor' && (
        <div className="space-y-4">
          {/* Opora Prikhod / Raskhod Quick Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-gradient-to-r from-slate-900 to-[#0F2942] p-4 rounded-2xl text-white shadow-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Jami Oporalar qoldig‘i</span>
              <span className="text-2xl font-black text-amber-400 mt-1 block">{oporaStats.totalStock} dona</span>
              <span className="text-[11px] text-slate-300">Ombor hududida tayyor</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Kirim (Приход)</span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">+{oporaStats.totalKirim} dona</span>
              <span className="text-[11px] text-emerald-200">Sexdan qabul qilingan</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Chiqim (Расход / Yuklash)</span>
              <span className="text-2xl font-black text-orange-400 mt-1 block">-{oporaStats.totalChiqim} dona</span>
              <span className="text-[11px] text-orange-200">Mijozlarga yetkazilgan</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Opora turlari</span>
                <span className="text-2xl font-black text-white mt-1 block">{oporaStats.totalModels} ta model</span>
              </div>
              <button
                onClick={() => {
                  setSelectedTargetType('finished');
                  if (finishedProducts.length > 0) setSelectedItemId(finishedProducts[0].id);
                  setMovementType('Kirim');
                  setIsMovementModalOpen(true);
                }}
                className="mt-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 py-1.5 px-3 rounded-lg text-center transition-colors"
              >
                + Opora kirim qilish
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3.5 px-4 sm:px-6">Artikul</th>
                    <th className="py-3.5 px-4">Mahsulot nomi</th>
                    <th className="py-3.5 px-4">Balandligi</th>
                    <th className="py-3.5 px-4">Diametr / Profil</th>
                    <th className="py-3.5 px-4">Qoldiq (dona)</th>
                    <th className="py-3.5 px-4">Narx (so‘m)</th>
                    <th className="py-3.5 px-4">Holat</th>
                    <th className="py-3.5 px-4 text-right">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredFinished.map(product => {
                    const isLow = product.stock < product.minStock;
                    return (
                      <tr
                        key={product.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isLow ? 'bg-amber-50/30' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-xs text-slate-500">
                          {product.id.toUpperCase()}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{product.name}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                          {product.height}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">
                          {product.diameter}
                        </td>
                        <td className="py-3.5 px-4 font-black text-slate-900">
                          {product.stock} dona
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {product.price.toLocaleString()} so‘m
                        </td>
                        <td className="py-3.5 px-4">
                          {isLow ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              Kam qoldi ({product.stock}/{product.minStock})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Zaxirada mavjud
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedTargetType('finished');
                              setSelectedItemId(product.id);
                              setMovementType('Chiqim');
                              setIsMovementModalOpen(true);
                            }}
                            className="text-xs font-bold text-[#EA580C] hover:underline"
                          >
                            Chiqim qilish
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Harakatlar Content */}
      {activeTab === 'harakatlar' && (
        <div className="space-y-4">
          {/* Quick Filter Bar for Prikhod / Raskhod */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Harakat turi:</span>
              <button
                onClick={() => setMovementCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  movementCategoryFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Barchasi ({warehouseMovements.length})
              </button>
              <button
                onClick={() => setMovementCategoryFilter('opora')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  movementCategoryFilter === 'opora'
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                    : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                Faqat Opora (Приход / Расход)
              </button>
              <button
                onClick={() => setMovementCategoryFilter('raw')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  movementCategoryFilter === 'raw'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Xomashyo harakati
              </button>
            </div>

            <div className="text-xs font-bold text-slate-500">
              Jami ko‘rsatilmoqda: <span className="text-slate-900">{filteredMovements.length} ta operatsiya</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3.5 px-4 sm:px-6">Sana</th>
                    <th className="py-3.5 px-4">Turi</th>
                    <th className="py-3.5 px-4">Mahsulot / Xomashyo</th>
                    <th className="py-3.5 px-4">Miqdor</th>
                    <th className="py-3.5 px-4">Manba / Qabul qiluvchi</th>
                    <th className="py-3.5 px-4">Izoh / Asos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredMovements.map(mov => (
                    <tr key={mov.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                        <div className="font-bold text-slate-900 text-xs">{mov.date}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            mov.type === 'Kirim'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-orange-50 text-orange-700 border-orange-200'
                          }`}
                        >
                          {mov.type === 'Kirim' ? (
                            <ArrowDownLeft className="w-3 h-3" />
                          ) : (
                            <ArrowUpRight className="w-3 h-3" />
                          )}
                          {mov.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {mov.productName}
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        {mov.type === 'Kirim' ? '+' : '-'}{mov.quantity.toLocaleString()} {mov.unit}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                        {mov.supplierOrDestination || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        {mov.reason && <span className="font-semibold text-slate-700">{mov.reason}: </span>}
                        {mov.notes || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Movement Modal (Kirim / Chiqim) */}
      {isMovementModalOpen && (
        <div
          id="movement-modal-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsMovementModalOpen(false)}
        >
          <div
            id="movement-modal-card"
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-[#0F2942] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">
                  {movementType === 'Kirim' ? '+ Omborga kirim qilish' : '- Ombordan chiqim qilish'}
                </h3>
                <p className="text-xs text-slate-300">Moddiy qimmatliklar harakatini rasmiylashtirish</p>
              </div>
              <button
                onClick={() => setIsMovementModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMovement} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTargetType('raw');
                    if (rawMaterials.length > 0) setSelectedItemId(rawMaterials[0].id);
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    selectedTargetType === 'raw'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Xomashyo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTargetType('finished');
                    if (finishedProducts.length > 0) setSelectedItemId(finishedProducts[0].id);
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    selectedTargetType === 'finished'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tayyor mahsulot
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Pozitsiyani tanlang:</label>
                <select
                  value={selectedItemId}
                  onChange={e => setSelectedItemId(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                >
                  {selectedTargetType === 'raw'
                    ? rawMaterials.map(rm => (
                        <option key={rm.id} value={rm.id}>
                          {rm.name} (Qoldiq: {rm.currentStock} {rm.unit})
                        </option>
                      ))
                    : finishedProducts.map(fp => (
                        <option key={fp.id} value={fp.id}>
                          {fp.name} (Qoldiq: {fp.stock} dona)
                        </option>
                      ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Miqdor:</label>
                <input
                  type="number"
                  min="1"
                  value={movementQty}
                  onChange={e => setMovementQty(Math.max(1, Number(e.target.value)))}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mas’ul shaxs (Omborchi):</label>
                <input
                  type="text"
                  value={performedBy}
                  onChange={e => setPerformedBy(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Izoh / Nakladnoy raqami:</label>
                <input
                  type="text"
                  placeholder="Masalan: TTN №8492, yetkazib beruvchi Zavod"
                  value={movementNotes}
                  onChange={e => setMovementNotes(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsMovementModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs ${
                    movementType === 'Kirim'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-[#EA580C] hover:bg-[#D44806]'
                  }`}
                >
                  {movementType === 'Kirim' ? 'Kirimni tasdiqlash' : 'Chiqimni tasdiqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
