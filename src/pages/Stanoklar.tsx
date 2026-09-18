import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Activity,
  Calendar,
  X,
  ShieldCheck,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Machine, MachineStatus } from '../types';

export const Stanoklar: React.FC = () => {
  const {
    machines,
    updateMachineStatus,
    selectedMachineId,
    setSelectedMachineId
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const activeMachine = useMemo(() => {
    return machines.find(m => m.id === selectedMachineId) || null;
  }, [machines, selectedMachineId]);

  const filteredMachines = useMemo(() => {
    return machines.filter(m => {
      if (statusFilter && m.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.inventoryNumber.toLowerCase().includes(q) ||
          m.operator.toLowerCase().includes(q) ||
          m.model.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [machines, statusFilter, searchQuery]);

  const workingCount = machines.filter(m => m.status === 'Ishlayapti').length;
  const idleCount = machines.filter(m => m.status === 'To‘xtab turibdi').length;
  const repairCount = machines.filter(m => m.status === 'Ta’mirda').length;

  const getStatusBadge = (status: MachineStatus) => {
    switch (status) {
      case 'Ishlayapti':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'To‘xtab turibdi':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Ta’mirda':
        return 'bg-rose-50 text-rose-700 border-rose-200';
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
            Stanoklar va texnologik uskunalar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Sex asosiy fondlari, yuklama foizi va rejaviy texnik xizmat ko‘rsatish (TO)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Jami: {machines.length} ta uskuna</span>
        </div>
      </div>

      {/* Metric Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Faol ishlamoqda</span>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">{workingCount} ta</div>
            <span className="text-[11px] text-slate-400">Sex normal rejimda</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">To‘xtab turibdi</span>
            <div className="text-2xl font-black text-amber-600 mt-0.5">{idleCount} ta</div>
            <span className="text-[11px] text-slate-400">Navbat yoki sozlashda</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Ta’mirda</span>
            <div className="text-2xl font-black text-rose-600 mt-0.5">{repairCount} ta</div>
            <span className="text-[11px] text-slate-400">Texnik xizmat</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Stanok nomi, invertar raqami yoki operator orqali qidirish..."
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
            <option value="Ishlayapti">Ishlayapti</option>
            <option value="To‘xtab turibdi">To‘xtab turibdi</option>
            <option value="Ta’mirda">Ta’mirda</option>
          </select>
        </div>
      </div>

      {/* Machines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredMachines.map(machine => (
          <div
            key={machine.id}
            onClick={() => setSelectedMachineId(machine.id)}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-orange-300 transition-all cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  {machine.inventoryNumber}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(
                    machine.status
                  )}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      machine.status === 'Ishlayapti'
                        ? 'bg-emerald-500'
                        : machine.status === 'Ta’mirda'
                        ? 'bg-rose-500'
                        : 'bg-amber-500'
                    }`}
                  />
                  {machine.status}
                </span>
              </div>

              <h3 className="font-black text-base text-slate-900 hover:text-[#EA580C] transition-colors">
                {machine.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{machine.model}</p>

              <div className="mt-3 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Operator: <strong className="text-slate-800">{machine.operator}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-slate-400" />
                  <span>Bugungi yuklama: <strong className="text-slate-800">{machine.todayWorkload}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Oxirgi ko‘rik: <strong className="text-slate-800">{machine.lastInspection}</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={e => {
                e.stopPropagation();
                setSelectedMachineId(machine.id);
              }}
              className="w-full py-2 bg-slate-50 hover:bg-orange-50 hover:text-[#EA580C] text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors text-center"
            >
              Texnik pasport va holat
            </button>
          </div>
        ))}
      </div>

      {/* Machine Details Modal */}
      {activeMachine && (
        <div
          id="machine-detail-modal-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedMachineId(null)}
        >
          <div
            id="machine-detail-card"
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Top */}
            <div className="bg-[#0F2942] text-white p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-[#EA580C] text-white px-2 py-0.5 rounded">
                    {activeMachine.inventoryNumber}
                  </span>
                  <span className="text-xs text-slate-300">{activeMachine.model}</span>
                </div>
                <h3 className="text-lg font-black text-white mt-1">{activeMachine.name}</h3>
              </div>
              <button
                onClick={() => setSelectedMachineId(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-5">
              {/* Status Switcher */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Uskuna joriy holatini o‘zgartirish
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Ishlayapti', 'To‘xtab turibdi', 'Ta’mirda'] as MachineStatus[]).map(st => (
                    <button
                      key={st}
                      onClick={() => updateMachineStatus(activeMachine.id, st)}
                      className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all ${
                        activeMachine.status === st
                          ? st === 'Ishlayapti'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : st === 'Ta’mirda'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-amber-500 text-white border-amber-500 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block mb-0.5">Operator:</span>
                  <strong className="text-slate-900 font-bold">{activeMachine.operator}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Ishlangan soatlar:</span>
                  <strong className="text-slate-900 font-bold">{activeMachine.workHours} soat</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Oxirgi texnik ko‘rik:</span>
                  <strong className="text-slate-900 font-bold">{activeMachine.lastInspection}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Navbatdagi TO sanasi:</span>
                  <strong className="text-[#EA580C] font-bold">{activeMachine.nextMaintenance}</strong>
                </div>
              </div>

              {/* Specs text */}
              <div className="p-3.5 bg-orange-50/50 rounded-xl border border-orange-100 text-xs">
                <strong className="text-slate-800 block mb-1">Xarakteristika va vazifasi:</strong>
                <p className="text-slate-600 leading-relaxed">{activeMachine.specifications}</p>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedMachineId(null)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800"
                >
                  Yopish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
