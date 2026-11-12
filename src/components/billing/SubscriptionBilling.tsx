import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Download,
  AlertCircle,
  FileText,
  Clock,
  Zap,
} from 'lucide-react';
import { Organization, PlanTier, BillingInvoice } from '../../types/crm.ts';
import { formatIDR } from '../../utils/crm-rules.ts';

interface SubscriptionBillingProps {
  currentOrg: Organization;
  invoices: BillingInvoice[];
  onUpgradePlan: (tier: PlanTier) => void;
}

export const SubscriptionBilling: React.FC<SubscriptionBillingProps> = ({
  currentOrg,
  invoices,
  onUpgradePlan,
}) => {
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const quota = currentOrg.subscription;

  const handleSelectUpgrade = (tier: PlanTier) => {
    onUpgradePlan(tier);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
    setSuccessNotice(`Paket organisasi berhasil diperbarui ke ${tier.toUpperCase()}! Kuota telah ditingkatkan.`);
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  const handleDownloadInvoice = (inv: BillingInvoice) => {
    alert(`Mengunduh salinan resmi invoice ${inv.invoiceNumber} (${formatIDR(inv.amount)})...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Paket Langganan & Tagihan SaaS
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola kapasitas prospek, kuota agen, dan riwayat faktur pembayaran resmi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase tracking-wider">
            Status: {quota.status.toUpperCase()}
          </span>
        </div>
      </div>

      {successNotice && (
        <div className="p-4 bg-emerald-600 text-white rounded-xl shadow-md flex items-center justify-between text-xs font-bold animate-pulse">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{successNotice}</span>
          </div>
        </div>
      )}

      {/* Active Plan & Quotas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Leads Meter */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="text-xs text-slate-500 mb-1">Kuota Database Leads</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {quota.currentLeads}{' '}
              <span className="text-sm font-normal text-slate-400">
                / {quota.maxLeads.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (quota.currentLeads / quota.maxLeads) * 100)}%` }}
              />
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-3">
            Tersisa {(quota.maxLeads - quota.currentLeads).toLocaleString('id-ID')} kontak prospek
          </div>
        </div>

        {/* Agents Meter */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="text-xs text-slate-500 mb-1">Kursi Staf (Agent Seats)</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {quota.currentAgents}{' '}
              <span className="text-sm font-normal text-slate-400">/ {quota.maxAgents}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-purple-600 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (quota.currentAgents / quota.maxAgents) * 100)}%` }}
              />
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-3">
            {quota.maxAgents - quota.currentAgents} kursi tersedia untuk diundang
          </div>
        </div>

        {/* WhatsApp Numbers Meter */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="text-xs text-slate-500 mb-1">Koneksi Nomor WhatsApp</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {quota.currentWhatsAppNumbers}{' '}
              <span className="text-sm font-normal text-slate-400">/ {quota.maxWhatsAppNumbers}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-amber-600 h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (quota.currentWhatsAppNumbers / quota.maxWhatsAppNumbers) * 100)}%`,
                }}
              />
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-3">
            Perpanjangan paket berikutnya: {quota.renewalDate}
          </div>
        </div>
      </div>

      {/* Plan Upgrade Selector */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Pilihan Paket Langganan Organisasi
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Klik tombol di bawah untuk meningkatkan atau menurunkan tingkatan paket secara instan
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter */}
          <div
            className={`p-5 rounded-xl border flex flex-col justify-between ${
              quota.tier === 'starter'
                ? 'border-2 border-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">Starter</span>
                {quota.tier === 'starter' && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Paket Aktif
                  </span>
                )}
              </div>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mb-3">
                {formatIDR(299000)} <span className="text-xs font-normal text-slate-400">/ bln</span>
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 mb-6">
                <li>• 1.000 Database Leads</li>
                <li>• 3 Kursi Staf</li>
                <li>• 1 Nomor WhatsApp</li>
              </ul>
            </div>
            <button
              onClick={() => handleSelectUpgrade('starter')}
              disabled={quota.tier === 'starter'}
              className="w-full py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-800 dark:text-slate-200 transition-colors"
            >
              {quota.tier === 'starter' ? 'Sedang Digunakan' : 'Ganti ke Starter'}
            </button>
          </div>

          {/* Growth */}
          <div
            className={`p-5 rounded-xl border flex flex-col justify-between relative ${
              quota.tier === 'growth'
                ? 'border-2 border-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">Growth</span>
                {quota.tier === 'growth' ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Paket Aktif
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Rekomendasi
                  </span>
                )}
              </div>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mb-3">
                {formatIDR(799000)} <span className="text-xs font-normal text-slate-400">/ bln</span>
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 mb-6">
                <li>• 5.000 Database Leads</li>
                <li>• 10 Kursi Staf</li>
                <li>• 3 Nomor WhatsApp</li>
                <li>• Pelacakan Konversi Iklan Meta</li>
              </ul>
            </div>
            <button
              onClick={() => handleSelectUpgrade('growth')}
              disabled={quota.tier === 'growth'}
              className="w-full py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition-colors shadow-xs"
            >
              {quota.tier === 'growth' ? 'Sedang Digunakan' : 'Ganti ke Growth'}
            </button>
          </div>

          {/* Enterprise */}
          <div
            className={`p-5 rounded-xl border flex flex-col justify-between ${
              quota.tier === 'enterprise'
                ? 'border-2 border-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">Enterprise</span>
                {quota.tier === 'enterprise' && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Paket Aktif
                  </span>
                )}
              </div>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mb-3">
                {formatIDR(1999000)} <span className="text-xs font-normal text-slate-400">/ bln</span>
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 mb-6">
                <li>• 25.000 Database Leads</li>
                <li>• 30 Kursi Staf</li>
                <li>• 10 Nomor WhatsApp</li>
                <li>• Dedicated Account Manager</li>
              </ul>
            </div>
            <button
              onClick={() => handleSelectUpgrade('enterprise')}
              disabled={quota.tier === 'enterprise'}
              className="w-full py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors"
            >
              {quota.tier === 'enterprise' ? 'Sedang Digunakan' : 'Ganti ke Enterprise'}
            </button>
          </div>
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Riwayat Pembayaran & Faktur Resmi
          </h2>
          <p className="text-xs text-slate-500">
            Faktur elektronik resmi dapat diunduh untuk kebutuhan pembukuan & laporan pajak perusahaan
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Nomor Faktur</th>
                <th className="p-3">Tanggal Tagihan</th>
                <th className="p-3">Periode Layanan</th>
                <th className="p-3">Metode Bayar</th>
                <th className="p-3 text-right">Jumlah Total</th>
                <th className="p-3 text-right">Status</th>
                <th className="p-3 text-right">Unduh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                    {inv.invoiceNumber}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{inv.date}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{inv.period}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{inv.paymentMethod}</td>
                  <td className="p-3 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                    {formatIDR(inv.amount)}
                  </td>
                  <td className="p-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Lunas</span>
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDownloadInvoice(inv)}
                      className="p-1.5 text-slate-500 hover:text-emerald-600 rounded transition-colors"
                      title="Unduh PDF Faktur"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
