import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart,
  Calendar,
  Filter,
  Download,
  ArrowUpRight,
  Clock,
  Target,
  Award,
} from 'lucide-react';
import { MarketingCampaign, Lead, Deal, Organization } from '../../types/crm.ts';
import { formatIDR } from '../../utils/crm-rules.ts';

interface ReportsAnalyticsProps {
  currentOrg: Organization;
  campaigns: MarketingCampaign[];
  leads: Lead[];
  deals: Deal[];
}

export const ReportsAnalytics: React.FC<ReportsAnalyticsProps> = ({
  currentOrg,
  campaigns,
  leads,
  deals,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const totalMarketingSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalCampaignRevenue = campaigns.reduce((sum, c) => sum + c.revenueGenerated, 0);
  const overallROAS = (totalCampaignRevenue / Math.max(1, totalMarketingSpend)).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Laporan Analitik & Efektivitas Pemasaran
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kaji laba atas belanja iklan (ROAS), biaya per lead (CPL), dan kecepatan closing penjualan
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="7d">7 Hari Terakhir</option>
            <option value="30d">30 Hari Terakhir (Default)</option>
            <option value="q4">Kuartal 4 (Q4 2026)</option>
            <option value="ytd">Sepanjang Tahun 2026</option>
          </select>
        </div>
      </div>

      {/* Top 3 KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 mb-1 flex items-center justify-between">
            <span>Total Belanja Iklan (Ad Spend)</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {formatIDR(totalMarketingSpend)}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Dari Meta Ads, Google Ads & WhatsApp
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 mb-1 flex items-center justify-between">
            <span>Pendapatan Dihasilkan (Revenue)</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {formatIDR(totalCampaignRevenue)}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-2">
            33 Transaksi Menang dari Iklan
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 mb-1 flex items-center justify-between">
            <span>Rata-rata ROAS (Return On Ad Spend)</span>
            <Target className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600">
            {overallROAS}x
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Setiap Rp 1 belanja iklan menghasilkan {overallROAS}x omzet
          </div>
        </div>
      </div>

      {/* Campaign Performance Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Kinerja Sumber Kampanye & Saluran Pemasaran
          </h2>
          <p className="text-xs text-slate-500">
            Perbandingan akurat antara biaya iklan terhadap nilai deal yang berhasil ditutup
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Nama Kampanye / Saluran</th>
                <th className="p-3 text-right">Biaya Iklan</th>
                <th className="p-3 text-right">Leads Masuk</th>
                <th className="p-3 text-right">Biaya / Lead (CPL)</th>
                <th className="p-3 text-right">Deals Closing</th>
                <th className="p-3 text-right">Omzet Dihasilkan</th>
                <th className="p-3 text-right">ROAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="p-3">
                    <div className="font-bold text-slate-900 dark:text-white">{camp.name}</div>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.2 rounded font-medium">
                      {camp.channel}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {formatIDR(camp.spend)}
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                    {camp.leadsGenerated}
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums text-slate-500">
                    {formatIDR(camp.cpl)}
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums font-semibold text-emerald-600">
                    {camp.dealsClosed}
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                    {formatIDR(camp.revenueGenerated)}
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums font-bold text-emerald-600">
                    {camp.roas}x
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
