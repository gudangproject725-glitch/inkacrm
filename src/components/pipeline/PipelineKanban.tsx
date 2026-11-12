import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Plus,
  Filter,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  UserCheck,
  Building,
  X,
  AlertCircle,
} from 'lucide-react';
import { Deal, DealStage, User, Organization, Lead } from '../../types/crm.ts';
import { formatIDR } from '../../utils/crm-rules.ts';

interface PipelineKanbanProps {
  currentOrg: Organization;
  deals: Deal[];
  users: User[];
  leads: Lead[];
  onUpdateDeal: (deal: Deal) => void;
  onAddDeal: (newDeal: Deal) => void;
}

const STAGES: { id: DealStage; label: string; color: string; border: string }[] = [
  { id: 'new', label: 'Prospek Baru', color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-900' },
  { id: 'qualification', label: 'Kualifikasi', color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-900' },
  { id: 'proposal_sent', label: 'Penawaran Dikirim', color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-900' },
  { id: 'negotiation', label: 'Negosiasi', color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-900' },
  { id: 'won', label: 'Menang (Won)', color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-900' },
  { id: 'lost', label: 'Kalah (Lost)', color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-900' },
];

export const PipelineKanban: React.FC<PipelineKanbanProps> = ({
  currentOrg,
  deals,
  users,
  leads,
  onUpdateDeal,
  onAddDeal,
}) => {
  const [selectedOwner, setSelectedOwner] = useState<string>('all');
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);

  // New Deal form state
  const [dealForm, setDealForm] = useState({
    title: '',
    company: '',
    contactName: '',
    value: 30000000,
    stage: 'qualification' as DealStage,
    probability: 60,
    ownerId: users[0]?.id || '',
    expectedClosing: '2026-11-30',
  });

  const filteredDeals = deals.filter((deal) => {
    return selectedOwner === 'all' || deal.ownerId === selectedOwner;
  });

  // Stage transition handler with celebration on WON
  const handleMoveStage = (deal: Deal, targetStage: DealStage) => {
    const updatedDeal: Deal = {
      ...deal,
      stage: targetStage,
      probability: targetStage === 'won' ? 100 : targetStage === 'lost' ? 0 : deal.probability,
    };

    onUpdateDeal(updatedDeal);

    if (targetStage === 'won') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setCelebrationMessage(`Selamat! Deal "${deal.title}" senilai ${formatIDR(deal.value)} berhasil dimenangkan!`);
      setTimeout(() => setCelebrationMessage(null), 5000);
    }
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    const owner = users.find((u) => u.id === dealForm.ownerId) || users[0];
    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      tenantId: currentOrg.id,
      leadId: `lead-${Date.now()}`,
      title: dealForm.title.trim() || 'Deal Baru',
      company: dealForm.company.trim() || 'Perusahaan Prospek',
      contactName: dealForm.contactName.trim() || 'Kontak',
      value: Number(dealForm.value) || 10000000,
      stage: dealForm.stage,
      probability: Number(dealForm.probability) || 50,
      ownerId: owner?.id || 'unassigned',
      ownerName: owner?.name || 'Unassigned',
      expectedClosing: dealForm.expectedClosing,
      priority: 'high',
    };

    onAddDeal(newDeal);
    setShowAddDealModal(false);
    setDealForm({
      title: '',
      company: '',
      contactName: '',
      value: 30000000,
      stage: 'qualification',
      probability: 60,
      ownerId: users[0]?.id || '',
      expectedClosing: '2026-11-30',
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Sales Pipeline Kanban
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pantau pergerakan transaksi dan proyeksi pendapatan di setiap tahapan closing
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Owner Filter */}
          <select
            value={selectedOwner}
            onChange={(e) => setSelectedOwner(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">Semua Sales Owner</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddDealModal(true)}
            className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Deal Baru</span>
          </button>
        </div>
      </div>

      {/* Won Deal Celebration Banner */}
      {celebrationMessage && (
        <div className="p-4 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">{celebrationMessage}</span>
          </div>
          <button onClick={() => setCelebrationMessage(null)} className="text-white/80 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Kanban Board Horizontal Scroll */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4 items-start">
        {STAGES.map((col, colIndex) => {
          const colDeals = filteredDeals.filter((d) => d.stage === col.id);
          const colTotalValue = colDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div
              key={col.id}
              className="bg-slate-100/70 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-200 dark:border-slate-800 flex flex-col min-w-[260px] max-h-[calc(100vh-250px)]"
            >
              {/* Column Header */}
              <div className="pb-3 mb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {col.label}
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {colDeals.length}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono tabular-nums font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {formatIDR(colTotalValue)}
                  </div>
                </div>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                {colDeals.length === 0 ? (
                  <div className="p-4 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-400">
                    Belum ada transaksi di tahap ini.
                  </div>
                ) : (
                  colDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="p-3 bg-white dark:bg-slate-800/90 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs hover:border-emerald-500/50 transition-all space-y-2.5"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                          {deal.title}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3" />
                          <span className="truncate">{deal.company}</span>
                        </div>
                      </div>

                      {/* Value and Probability */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-700/60">
                        <span className="font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                          {formatIDR(deal.value)}
                        </span>
                        <span className="text-[10px] font-mono font-medium text-slate-500">
                          Prob: {deal.probability}%
                        </span>
                      </div>

                      {/* Owner & Expected Date */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{deal.ownerName}</span>
                        <span className="font-mono text-[10px]">{deal.expectedClosing}</span>
                      </div>

                      {/* Quick Move Stage Controls */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60 text-[10px] relative z-10">
                        {colIndex > 0 ? (
                          <button
                            type="button"
                            aria-label={`Mundur ke tahap sebelumnya: ${deal.title}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveStage(deal, STAGES[colIndex - 1].id);
                            }}
                            className="text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-0.5 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                            title="Kembali ke tahap sebelumnya"
                          >
                            <ChevronLeft className="w-3 h-3" />
                            <span>Mundur</span>
                          </button>
                        ) : (
                          <span />
                        )}

                        {colIndex < STAGES.length - 1 && (
                          <button
                            type="button"
                            aria-label={`Lanjut ke tahap selanjutnya: ${deal.title}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveStage(deal, STAGES[colIndex + 1].id);
                            }}
                            className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-0.5 ml-auto p-1 rounded hover:bg-emerald-50 dark:hover:bg-emerald-950"
                            title="Maju ke tahap selanjutnya"
                          >
                            <span>Lanjut</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Tambah Deal Baru */}
      {showAddDealModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Buat Transaksi / Deal Baru
              </h3>
              <button onClick={() => setShowAddDealModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Transaksi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengadaan Mesin Kopi 10 Unit"
                  value={dealForm.title}
                  onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Perusahaan / Bisnis
                  </label>
                  <input
                    type="text"
                    placeholder="PT Kopi Nusantara"
                    value={dealForm.company}
                    onChange={(e) => setDealForm({ ...dealForm, company: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nilai Kontrak (IDR)
                  </label>
                  <input
                    type="number"
                    step={1000000}
                    value={dealForm.value}
                    onChange={(e) => setDealForm({ ...dealForm, value: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tahapan Awal Pipeline
                  </label>
                  <select
                    value={dealForm.stage}
                    onChange={(e) => setDealForm({ ...dealForm, stage: e.target.value as DealStage })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sales Owner
                  </label>
                  <select
                    value={dealForm.ownerId}
                    onChange={(e) => setDealForm({ ...dealForm, ownerId: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddDealModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Simpan Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
