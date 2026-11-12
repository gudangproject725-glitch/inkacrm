import React from 'react';
import {
  Users2,
  TrendingUp,
  DollarSign,
  MessageSquare,
  ArrowUpRight,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { Organization, Lead, Deal, User, DealStage } from '../../types/crm.ts';
import {
  formatIDR,
  calculatePipelineMetrics,
  calculateLeadConversionRate,
} from '../../utils/crm-rules.ts';

interface DashboardOverviewProps {
  currentOrg: Organization;
  leads: Lead[];
  deals: Deal[];
  users: User[];
  onNavigate: (view: string) => void;
  onOpenNewLeadModal: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentOrg,
  leads,
  deals,
  users,
  onNavigate,
  onOpenNewLeadModal,
}) => {
  const pipelineMetrics = calculatePipelineMetrics(deals);
  const conversionRate = calculateLeadConversionRate(leads);

  // Lead Sources breakdown
  const sourceCounts: Record<string, number> = {};
  leads.forEach((l) => {
    sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1;
  });

  // Funnel counts
  const stageOrder: { key: DealStage; label: string; color: string }[] = [
    { key: 'new', label: 'Prospek Baru', color: 'bg-blue-500' },
    { key: 'qualification', label: 'Terkualifikasi', color: 'bg-amber-500' },
    { key: 'proposal_sent', label: 'Penawaran Dikirim', color: 'bg-purple-500' },
    { key: 'negotiation', label: 'Negosiasi', color: 'bg-indigo-500' },
    { key: 'won', label: 'Menang (Won)', color: 'bg-emerald-500' },
  ];

  // Activities across leads
  const allActivities = leads
    .flatMap((l) =>
      l.activities.map((a) => ({
        ...a,
        leadName: l.name,
        company: l.company,
      }))
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Ruang Kerja Aktif: <span className="font-semibold text-slate-800 dark:text-slate-200">{currentOrg.name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
            Ringkasan Operasional Penjualan
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('chat')}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>WhatsApp Inbox</span>
          </button>
          <button
            onClick={onOpenNewLeadModal}
            className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Lead Baru</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
            <span>Total Leads Dikelola</span>
            <Users2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {leads.length}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span className="font-medium">+18% dari bulan lalu</span>
          </div>
        </div>

        {/* Active Pipeline Value */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
            <span>Nilai Pipeline Aktif</span>
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {formatIDR(pipelineMetrics.totalPipelineValue)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            {pipelineMetrics.totalActiveDeals} transaksi sedang berjalan
          </div>
        </div>

        {/* Closed Won Revenue */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
            <span>Penjualan Menang (Won)</span>
            <DollarSign className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {formatIDR(pipelineMetrics.wonDealsValue)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 mt-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="font-medium">Konversi: {conversionRate}%</span>
          </div>
        </div>

        {/* CS WhatsApp Response Time */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
            <span>Rata-rata Respon WA</span>
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            2.4 <span className="text-sm font-normal text-slate-500">Menit</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2">
            98.2% mematuhi SLA &lt; 5 menit
          </div>
        </div>
      </div>

      {/* Main Grid: Funnel & Lead Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Pipeline Funnel (2 Cols) */}
        <div className="lg:col-span-2 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Funnel Tahapan Penjualan
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Penyebaran transaksi aktif pada setiap tahapan pipeline
              </p>
            </div>
            <button
              onClick={() => onNavigate('pipeline')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Buka Kanban</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {stageOrder.map((stage) => {
              const stageData = pipelineMetrics.stageTotals[stage.key] || { count: 0, totalValue: 0 };
              const maxCount = Math.max(...Object.values(pipelineMetrics.stageTotals).map((s) => s.count), 1);
              const barWidth = Math.max(8, Math.round((stageData.count / maxCount) * 100));

              return (
                <div key={stage.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{stage.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                        {stageData.count} Deals
                      </span>
                      <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                        {formatIDR(stageData.totalValue)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${stage.color}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Sources Distribution (1 Col) */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Sumber Prospek (Channels)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Distribusi akuisisi leads berdasarkan saluran iklan & kontak
            </p>

            <div className="space-y-3">
              {Object.entries(sourceCounts).map(([src, count]) => {
                const pct = Math.round((count / leads.length) * 100);
                return (
                  <div key={src} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-medium text-slate-800 dark:text-slate-200">{src}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono tabular-nums">
                      <span className="font-bold text-slate-900 dark:text-white">{count} leads</span>
                      <span className="text-slate-400">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs text-slate-600 dark:text-slate-400 mt-4">
            <span className="font-semibold text-slate-900 dark:text-white">Meta Ads</span> menghasilkan volume prospek tertinggi (60%), disusul Inbound WhatsApp dengan konversi closing tercepat (2.1 hari).
          </div>
        </div>
      </div>

      {/* Bottom Grid: Team Leaderboard & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales & CS Leaderboard */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Leaderboard Tim Sales & CS
              </h2>
            </div>
            <button
              onClick={() => onNavigate('team')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Kelola Tim
            </button>
          </div>

          <div className="space-y-3">
            {users.slice(0, 4).map((u, idx) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={u.avatarUrl}
                      alt={u.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
                        u.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{u.name}</span>
                      {idx === 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded">
                          Top Performer
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 capitalize">
                      {u.role.replace('_', ' ')} · {u.assignedLeadsCount} Leads aktif
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                    {formatIDR(idx === 0 ? 165000000 : idx === 1 ? 60000000 : 35000000)}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    {idx === 0 ? '94% SLA Respon' : '98% SLA Respon'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Timeline */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Aktivitas Follow-up Terbaru
            </h2>
            <button
              onClick={() => onNavigate('leads')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Semua Leads
            </button>
          </div>

          <div className="space-y-3">
            {allActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900 dark:text-white truncate">
                      {act.leadName} ({act.company})
                    </span>
                    <span className="text-[11px] text-slate-400 shrink-0">{act.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">
                    {act.description}
                  </p>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Ditindaklanjuti oleh: <span className="font-medium text-slate-700 dark:text-slate-300">{act.performedByName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
