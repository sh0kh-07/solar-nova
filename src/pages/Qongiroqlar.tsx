import React, { useState, useMemo } from 'react';
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Play,
  Search,
  Filter,
  Plus,
  Clock,
  User,
  X,
  FileText,
  Volume2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CallRecord } from '../types';

export const Qongiroqlar: React.FC = () => {
  const { calls, addCallRecord, setActiveAudioCall, clients } = useApp();

  const [typeFilter, setTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New call state
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [operator, setOperator] = useState('Dilorom Rahimova');
  const [callType, setCallType] = useState<'Kiruvchi' | 'Chiquvchi'>('Kiruvchi');
  const [status, setStatus] = useState<CallRecord['status']>('Qabul qilindi');
  const [duration, setDuration] = useState('02:40');
  const [notes, setNotes] = useState('');

  const filteredCalls = useMemo(() => {
    return calls.filter(c => {
      if (typeFilter && c.type !== typeFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          c.clientName.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.operator.toLowerCase().includes(q) ||
          c.notes.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [calls, typeFilter, searchQuery]);

  const incomingCount = calls.filter(c => c.type === 'Kiruvchi').length;
  const outgoingCount = calls.filter(c => c.type === 'Chiquvchi').length;

  const handleCreateCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !notes.trim()) return;

    addCallRecord({
      clientName,
      phone,
      operator,
      type: callType,
      status,
      notes,
      duration
    });

    setIsAddModalOpen(false);
    setClientName('');
    setPhone('+998 ');
    setNotes('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Qo‘ng‘iroqlar va audio yozuvlar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Mijozlar bilan suhbatlar arxivi va virtual telefoniya DEMO pleyeri
          </p>
        </div>

        <button
          id="open-new-call-modal-btn"
          onClick={() => {
            if (clients.length > 0) {
              setClientName(clients[0].companyName);
              setPhone(clients[0].phone);
            }
            setIsAddModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-[#EA580C] hover:bg-[#D44806] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Suhbat qayd etish</span>
        </button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Jami yozuvlar</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{calls.length} ta</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center">
            <Volume2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Kiruvchi qo‘ng‘iroqlar</span>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">{incomingCount} ta</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <PhoneIncoming className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Chiquvchi qo‘ng‘iroqlar</span>
            <div className="text-2xl font-black text-blue-600 mt-0.5">{outgoingCount} ta</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <PhoneOutgoing className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Mijoz, telefon, operator yoki izoh bo‘yicha qidirish..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
          />
        </div>

        <div className="w-full sm:w-56">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
          >
            <option value="">Barcha turlar</option>
            <option value="Kiruvchi">Kiruvchi qo‘ng‘iroqlar</option>
            <option value="Chiquvchi">Chiquvchi qo‘ng‘iroqlar</option>
          </select>
        </div>
      </div>

      {/* Calls Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4 sm:px-6">Sana va vaqt</th>
                <th className="py-3.5 px-4">Turi</th>
                <th className="py-3.5 px-4">Mijoz</th>
                <th className="py-3.5 px-4">Telefon</th>
                <th className="py-3.5 px-4">Operator</th>
                <th className="py-3.5 px-4">Davomiyligi</th>
                <th className="py-3.5 px-4">Izoh</th>
                <th className="py-3.5 px-4 text-right">Yozuv</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredCalls.map(call => (
                <tr
                  key={call.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                    <div className="font-bold text-slate-900 text-xs">{call.date}</div>
                    <div className="text-[11px] text-slate-400">{call.time}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        call.type === 'Kiruvchi'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {call.type === 'Kiruvchi' ? (
                        <PhoneIncoming className="w-3 h-3" />
                      ) : (
                        <PhoneOutgoing className="w-3 h-3" />
                      )}
                      {call.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900">{call.clientName}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                    {call.phone}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-700 whitespace-nowrap">
                    {call.operator}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-800 whitespace-nowrap">
                    {call.duration}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 max-w-sm">
                    <p className="line-clamp-2">{call.notes}</p>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      id={`play-call-${call.id}`}
                      onClick={() => setActiveAudioCall(call)}
                      className="inline-flex items-center gap-1.5 bg-orange-50 hover:bg-[#EA580C] text-[#EA580C] hover:text-white border border-orange-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Tinglash</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Call Record Modal */}
      {isAddModalOpen && (
        <div
          id="add-call-modal-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            id="add-call-modal-card"
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-[#0F2942] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">+ Yangi suhbat yozuvi</h3>
                <p className="text-xs text-slate-300">Telefon muloqotini tizimga biriktirish</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCall} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mijoz / Tashkilot:</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  placeholder="Samarkand Qurilish MCHJ"
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Telefon:</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Qo‘ng‘iroq turi:</label>
                  <select
                    value={callType}
                    onChange={e => setCallType(e.target.value as 'Kiruvchi' | 'Chiquvchi')}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  >
                    <option value="Kiruvchi">Kiruvchi</option>
                    <option value="Chiquvchi">Chiquvchi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Operator:</label>
                  <input
                    type="text"
                    required
                    value={operator}
                    onChange={e => setOperator(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Davomiyligi (mm:ss):</label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    placeholder="03:20"
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Suhbat mazmuni va izoh:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Mijoz 100 dona 9 metrlik ustun narxini so‘radi..."
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
