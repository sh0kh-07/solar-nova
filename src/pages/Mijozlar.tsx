import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Building2,
  User,
  Phone,
  MapPin,
  X,
  CreditCard,
  ShoppingCart,
  PhoneCall,
  Calendar,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Client } from '../types';

export const Mijozlar: React.FC = () => {
  const {
    clients,
    sales,
    calls,
    addClient,
    selectedClientId,
    setSelectedClientId,
    setSelectedSaleId,
    setActiveAudioCall,
    setActivePage
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  // Add Client modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Toshkent');
  const [address, setAddress] = useState('');
  const [inn, setInn] = useState('');
  const [notes, setNotes] = useState('');

  // Active client details
  const activeClient = useMemo(() => {
    return clients.find(c => c.id === selectedClientId) || null;
  }, [clients, selectedClientId]);

  // Client's sales orders
  const clientSales = useMemo(() => {
    if (!activeClient) return [];
    return sales.filter(s => s.clientId === activeClient.id);
  }, [sales, activeClient]);

  // Client's call history
  const clientCalls = useMemo(() => {
    if (!activeClient) return [];
    return calls.filter(
      c =>
        c.clientName.toLowerCase().includes(activeClient.companyName.toLowerCase()) ||
        c.phone === activeClient.phone
    );
  }, [calls, activeClient]);

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      if (cityFilter && c.city !== cityFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          c.companyName.toLowerCase().includes(q) ||
          c.contactPerson.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.city.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [clients, cityFilter, searchQuery]);

  const uniqueCities = Array.from(new Set(clients.map(c => c.city)));

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactPerson.trim() || !phone.trim()) return;

    addClient({
      companyName,
      contactPerson,
      phone,
      email,
      city,
      address,
      inn,
      notes
    });

    setIsAddModalOpen(false);
    setCompanyName('');
    setContactPerson('');
    setPhone('+998 ');
    setEmail('');
    setAddress('');
    setInn('');
    setNotes('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Mijozlar (CRM)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Qurilish korxonalari, davlat tarmoqlari va doimiy xaridorlar ro‘yxati
          </p>
        </div>

        <button
          id="open-new-client-modal-btn"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#EA580C] hover:bg-[#D44806] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Yangi mijoz</span>
        </button>
      </div>

      {/* Search & City Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Kompaniya, vakil yoki telefon orqali qidirish..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
          />
        </div>

        <div className="w-full sm:w-56">
          <select
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
          >
            <option value="">Barcha shaharlar</option>
            {uniqueCities.map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {filteredClients.map(client => (
          <div
            key={client.id}
            onClick={() => setSelectedClientId(client.id)}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-orange-300 transition-all cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#0F2942] font-black shrink-0">
                  <Building2 className="w-5 h-5 text-slate-700" />
                </div>
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#EA580C]" />
                  {client.city}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 hover:text-[#EA580C] transition-colors line-clamp-1">
                {client.companyName}
              </h3>

              <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{client.contactPerson}</span>
              </div>

              <div className="text-xs text-slate-600 font-mono flex items-center gap-1.5 mt-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{client.phone}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Oxirgi buyurtma:</span>
                <span className="font-semibold text-slate-800">{client.lastOrderDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Umumiy savdo:</span>
                <span className="font-black text-slate-900">
                  {client.totalSales.toLocaleString()} so‘m
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Qarz:</span>
                <span
                  className={`font-black ${
                    client.debt > 0 ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  {client.debt > 0 ? `${client.debt.toLocaleString()} so‘m` : 'Qarz yo‘q'}
                </span>
              </div>
            </div>

            <button
              onClick={e => {
                e.stopPropagation();
                setSelectedClientId(client.id);
              }}
              className="w-full py-2 bg-slate-50 hover:bg-orange-50 hover:text-[#EA580C] text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Mijoz kartasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Client Detail Modal */}
      {activeClient && (
        <div
          id="client-detail-modal-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedClientId(null)}
        >
          <div
            id="client-detail-card"
            className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#0F2942] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-orange-400 uppercase">
                  Mijoz kartasi
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">
                  {activeClient.companyName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedClientId(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {/* Contact info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Mas’ul shaxs:</span>
                  <span className="font-bold text-slate-900">{activeClient.contactPerson}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Telefon:</span>
                  <span className="font-bold text-slate-900 font-mono">{activeClient.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Shahar / Manzil:</span>
                  <span className="font-bold text-slate-900">{activeClient.city}, {activeClient.address}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">INN:</span>
                  <span className="font-bold text-slate-900 font-mono">{activeClient.inn}</span>
                </div>
              </div>

              {/* Financial snapshot */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">Jami savdo hajmi:</span>
                  <span className="text-lg font-black text-slate-900">
                    {activeClient.totalSales.toLocaleString()} so‘m
                  </span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">Hozirgi qarzdorlik:</span>
                  <span
                    className={`text-lg font-black ${
                      activeClient.debt > 0 ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {activeClient.debt.toLocaleString()} so‘m
                  </span>
                </div>
              </div>

              {/* History of Interaction */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#EA580C]" />
                  Muloqot va o‘zaro hamkorlik tarixi
                </h4>

                <div className="space-y-3">
                  {activeClient.interactions && activeClient.interactions.length > 0 ? (
                    activeClient.interactions.map(int => (
                      <div
                        key={int.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900">{int.title}</span>
                          <span className="text-slate-500 font-mono">{int.date}</span>
                        </div>
                        <p className="text-xs text-slate-600">{int.description}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                      Muloqotlar tarixi avtomatik shakllanadi
                    </div>
                  )}
                </div>
              </div>

              {/* Client's Orders */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ShoppingCart className="w-4 h-4 text-[#EA580C]" />
                  Mijoz buyurtmalari ({clientSales.length})
                </h4>

                <div className="space-y-2">
                  {clientSales.length > 0 ? (
                    clientSales.map(sale => (
                      <div
                        key={sale.id}
                        onClick={() => {
                          setSelectedSaleId(sale.id);
                          setSelectedClientId(null);
                          setActivePage('sotuvlar');
                        }}
                        className="p-3 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50/20 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                            <span className="text-[#EA580C] font-mono">{sale.orderNumber}</span>
                            <span>{sale.productName}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {sale.quantity} dona • {sale.totalAmount.toLocaleString()} so‘m • {sale.status}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-400">
                      Ushbu mijozda hali faol buyurtma yo‘q
                    </div>
                  )}
                </div>
              </div>

              {/* Calls with client */}
              {clientCalls.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <PhoneCall className="w-4 h-4 text-indigo-600" />
                    Telefon qo‘ng‘iroqlari yozuvlari
                  </h4>

                  <div className="space-y-2">
                    {clientCalls.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setActiveAudioCall(c);
                          setSelectedClientId(null);
                          setActivePage('qongiroqlar');
                        }}
                        className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900">{c.notes}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {c.date} • {c.duration} • Operator: {c.operator}
                          </div>
                        </div>
                        <button className="text-xs font-bold text-[#EA580C] px-2 py-1 rounded bg-orange-50">
                          ▶ Tinglash
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {isAddModalOpen && (
        <div
          id="add-client-modal-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            id="add-client-modal-card"
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-[#0F2942] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">+ Yangi mijoz qo‘shish</h3>
                <p className="text-xs text-slate-300">Qurilish korxonasi yoki buyurtmachi ma’lumotlari</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Kompaniya nomi:</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Yangi Bino MCHJ"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Kontakt shaxs:</label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Sardor Aliyev"
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Telefon:</label>
                  <input
                    type="text"
                    required
                    placeholder="+998 90 123 45 67"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Shahar:</label>
                  <input
                    type="text"
                    required
                    placeholder="Toshkent, Samarqand..."
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">INN (Soliq raqami):</label>
                  <input
                    type="text"
                    placeholder="304819284"
                    value={inn}
                    onChange={e => setInn(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Manzil:</label>
                <input
                  type="text"
                  placeholder="Ko‘cha, bino raqami"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Izoh:</label>
                <textarea
                  rows={2}
                  placeholder="Mijoz faoliyati, qiziqishi yoki loyihalari haqida..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
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
