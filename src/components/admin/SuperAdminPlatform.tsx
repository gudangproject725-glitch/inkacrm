import React from 'react';
import {
  ShieldCheck,
  Building2,
  DollarSign,
  Users2,
  Server,
  Activity,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Organization } from '../../types/crm.ts';
import { formatIDR } from '../../utils/crm-rules.ts';

interface SuperAdminPlatformProps {
  organizations: Organization[];
  onSelectTenant: (org: Organization) => void;
  onExitSuperAdmin: () => void;
}

export const SuperAdminPlatform: React.FC<SuperAdminPlatformProps> = ({
  organizations,
  onSelectTenant,
  onExitSuperAdmin,
}) => {
  const totalMRR = organizations.reduce((sum, o) => sum + o.subscription.priceMonthly, 0);
  const totalLeadsCapacity = organizations.reduce((sum, o) => sum + o.subscription.currentLeads, 0);

  return (
    <div className="space-y-6">
      {/* Super Admin Top Banner */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-900/60 text-purple-300 text-xs font-semibold mb-2 border border-purple-700/50">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Super Administrator Console</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">
            Pusat Pengawasan Multi-Tenant InkaCRM SaaS
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Monitoring seluruh tenant organisasi, utilisasi kuota, metrik MRR platform, dan isolasi data backend per tenant_id.
          </p>
        </div>

        <button
          onClick={onExitSuperAdmin}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg transition-colors shrink-0"
        >
          Kembali ke Dashboard Workspace
        </button>
      </div>

      {/* Global SaaS Platform Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 mb-1">Total Organisasi Terdaftar</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {organizations.length} <span className="text-xs font-normal text-slate-400">Tenant</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-2">100% Status Aktif</div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 mb-1">Platform MRR (Monthly Recurring)</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {formatIDR(totalMRR)}
          </div>
          <div className="text-[11px] text-purple-600 font-medium mt-2">
            ARR: {formatIDR(totalMRR * 12)}
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 mb-1">Total Leads di Seluruh Tenant</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {totalLeadsCapacity.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Terisolasi dengan tenant_id</div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 mb-1">Status Keamanan Multi-Tenancy</div>
          <div className="text-2xl font-bold font-mono text-emerald-600">Terisolasi</div>
          <div className="text-[11px] text-slate-400 mt-2">Shared DB + Shared Tables</div>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Daftar Tenant Organisasi Aktif
          </h2>
          <p className="text-xs text-slate-500">
            Klik "Masuk Workspace" untuk berpindah konteks tenant secara instan
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Nama Organisasi</th>
                <th className="p-3">Sektor Bisnis</th>
                <th className="p-3">Paket SaaS</th>
                <th className="p-3 text-right">Penggunaan Leads</th>
                <th className="p-3 text-right">Kursi Agen</th>
                <th className="p-3 text-right">Nilai Langganan</th>
                <th className="p-3 text-right">Aksi Super Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {organizations.map((org) => (
                <tr key={org.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="p-3">
                    <div className="font-bold text-slate-900 dark:text-white">{org.name}</div>
                    <div className="text-[11px] font-mono text-slate-400">tenant_id: {org.id}</div>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{org.businessSector}</td>
                  <td className="p-3">
                    <span className="uppercase text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {org.subscription.tier}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums text-slate-900 dark:text-white">
                    {org.subscription.currentLeads} / {org.subscription.maxLeads}
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums text-slate-900 dark:text-white">
                    {org.subscription.currentAgents} / {org.subscription.maxAgents}
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                    {formatIDR(org.subscription.priceMonthly)} / bln
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onSelectTenant(org)}
                      className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950 hover:bg-purple-100 text-purple-700 dark:text-purple-300 rounded font-semibold text-xs inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Masuk Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
