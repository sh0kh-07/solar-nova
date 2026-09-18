import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  X,
  ShoppingCart,
  Users,
  Cpu,
  Package,
  PhoneCall,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    setActivePage,
    setSelectedSaleId,
    setSelectedClientId,
    setSelectedMachineId,
    setActiveAudioCall,
    sales,
    clients,
    machines,
    rawMaterials,
    finishedProducts,
    calls
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Keyboard shortcut Ctrl+K / Cmd+K to toggle search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { sales: [], clients: [], machines: [], products: [], calls: [] };

    const matchedSales = sales.filter(
      s =>
        s.orderNumber.toLowerCase().includes(q) ||
        s.clientName.toLowerCase().includes(q) ||
        s.productName.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedClients = clients.filter(
      c =>
        c.companyName.toLowerCase().includes(q) ||
        c.contactPerson.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedMachines = machines.filter(
      m =>
        m.name.toLowerCase().includes(q) ||
        m.inventoryNumber.toLowerCase().includes(q) ||
        m.operator.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedProducts = [
      ...finishedProducts.filter(fp => fp.name.toLowerCase().includes(q)),
      ...rawMaterials.filter(rm => rm.name.toLowerCase().includes(q))
    ].slice(0, 4);

    const matchedCalls = calls.filter(
      c =>
        c.clientName.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.notes.toLowerCase().includes(q) ||
        c.operator.toLowerCase().includes(q)
    ).slice(0, 4);

    return {
      sales: matchedSales,
      clients: matchedClients,
      machines: matchedMachines,
      products: matchedProducts,
      calls: matchedCalls
    };
  }, [query, sales, clients, machines, rawMaterials, finishedProducts, calls]);

  const hasAnyResults =
    results.sales.length > 0 ||
    results.clients.length > 0 ||
    results.machines.length > 0 ||
    results.products.length > 0 ||
    results.calls.length > 0;

  if (!isSearchOpen) return null;

  return (
    <div
      id="global-search-overlay"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-start justify-center p-4 sm:pt-16"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        id="global-search-container"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3 bg-slate-50/70">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Qidiruv: Masalan 'Samarkand', 'SO-1024', 'Lazer', '9m ustun', '+998'..."
            className="w-full bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 text-base font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs font-semibold px-2 py-1 rounded bg-slate-200 text-slate-600 hover:bg-slate-300"
          >
            ESC
          </button>
        </div>

        {/* Search Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!query.trim() ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              <p className="font-semibold text-slate-600">Tizim bo‘ylab tezkor qidiruv</p>
              <p className="text-xs mt-1 text-slate-400">
                Mijoz nomi, telefon, buyurtma raqami, mahsulot yoki stanok nomini yozing
              </p>
              <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                {['Samarkand Qurilish', 'SO-1024', 'Lazer kesish', '9m ustun', 'Elektrod'].map(sample => (
                  <button
                    key={sample}
                    onClick={() => setQuery(sample)}
                    className="text-xs bg-slate-100 hover:bg-orange-50 hover:text-[#EA580C] text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          ) : !hasAnyResults ? (
            <div className="py-8 text-center text-slate-500">
              <p className="font-medium">"{query}" bo‘yicha hech narsa topilmadi</p>
              <p className="text-xs text-slate-400 mt-1">Boshqa so‘z yoki raqam kiritib ko‘ring</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Sales results */}
              {results.sales.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShoppingCart className="w-3.5 h-3.5 text-[#EA580C]" />
                    Sotuvlar va Buyurtmalar
                  </div>
                  <div className="space-y-1.5">
                    {results.sales.map(s => (
                      <div
                        key={s.id}
                        onClick={() => {
                          setSelectedSaleId(s.id);
                          setActivePage('sotuvlar');
                          setIsSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 cursor-pointer border border-slate-100 hover:border-slate-200 transition-all"
                      >
                        <div>
                          <div className="font-bold text-sm text-slate-800 flex items-center gap-2">
                            <span className="text-[#EA580C]">{s.orderNumber}</span>
                            <span>•</span>
                            <span>{s.clientName}</span>
                          </div>
                          <div className="text-xs text-slate-500">
                            {s.productName} ({s.quantity} dona) — {s.totalAmount.toLocaleString()} so‘m
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clients results */}
              {results.clients.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    Mijozlar
                  </div>
                  <div className="space-y-1.5">
                    {results.clients.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedClientId(c.id);
                          setActivePage('mijozlar');
                          setIsSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 cursor-pointer border border-slate-100 hover:border-slate-200 transition-all"
                      >
                        <div>
                          <div className="font-bold text-sm text-slate-800">{c.companyName}</div>
                          <div className="text-xs text-slate-500">
                            {c.contactPerson} • {c.phone} • {c.city}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Machines results */}
              {results.machines.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                    Stanoklar va Uskunalar
                  </div>
                  <div className="space-y-1.5">
                    {results.machines.map(m => (
                      <div
                        key={m.id}
                        onClick={() => {
                          setSelectedMachineId(m.id);
                          setActivePage('stanoklar');
                          setIsSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 cursor-pointer border border-slate-100 hover:border-slate-200 transition-all"
                      >
                        <div>
                          <div className="font-bold text-sm text-slate-800 flex items-center gap-2">
                            <span>{m.name}</span>
                            <span className="text-xs font-mono bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                              {m.inventoryNumber}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">
                            Operator: {m.operator} • Holat: {m.status}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warehouse Products */}
              {results.products.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-amber-600" />
                    Ombordagi Mahsulotlar va Xomashyo
                  </div>
                  <div className="space-y-1.5">
                    {results.products.map((p, idx) => (
                      <div
                        key={'prod-' + idx}
                        onClick={() => {
                          setActivePage('ombor');
                          setIsSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 cursor-pointer border border-slate-100 hover:border-slate-200 transition-all"
                      >
                        <div>
                          <div className="font-bold text-sm text-slate-800">{p.name}</div>
                          <div className="text-xs text-slate-500">
                            Qoldiq:{' '}
                            <span className="font-semibold text-slate-700">
                              {'stock' in p ? `${p.stock} dona` : `${p.currentStock} ${p.unit}`}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Calls */}
              {results.calls.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
                    Qo‘ng‘iroqlar
                  </div>
                  <div className="space-y-1.5">
                    {results.calls.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setActiveAudioCall(c);
                          setActivePage('qongiroqlar');
                          setIsSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 cursor-pointer border border-slate-100 hover:border-slate-200 transition-all"
                      >
                        <div>
                          <div className="font-bold text-sm text-slate-800 flex items-center gap-2">
                            <span>{c.clientName}</span>
                            <span className="text-xs text-slate-500 font-mono">{c.phone}</span>
                          </div>
                          <div className="text-xs text-slate-500 truncate max-w-md">
                            {c.notes}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
