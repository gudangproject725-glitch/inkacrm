import React from 'react';
import {
  LayoutDashboard,
  Users2,
  GitPullRequest,
  MessageSquare,
  Contact,
  Cpu,
  BarChart3,
  UserCheck,
  QrCode,
  CreditCard,
  Settings,
  Sparkles,
  ChevronRight,
  Globe,
} from 'lucide-react';
import { Organization } from '../../types/crm.ts';

interface SidebarProps {
  currentOrg: Organization;
  activeView: string;
  onChangeView: (view: string) => void;
  unreadCount?: number;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentOrg,
  activeView,
  onChangeView,
  unreadCount = 2,
  isOpenOnMobile = false,
  onCloseMobile,
}) => {
  const quota = currentOrg.subscription;
  const leadPercentage = Math.round((quota.currentLeads / quota.maxLeads) * 100);

  const navItems = [
    { id: 'dashboard', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'leads', label: 'Prospek & Leads', icon: Users2 },
    { id: 'pipeline', label: 'Sales Pipeline', icon: GitPullRequest },
    {
      id: 'chat',
      label: 'WhatsApp Inbox',
      icon: MessageSquare,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { id: 'contacts', label: 'Database Kontak', icon: Contact },
    { id: 'automation', label: 'Otomatisasi', icon: Cpu },
    { id: 'reports', label: 'Laporan & ROI', icon: BarChart3 },
    { id: 'team', label: 'Tim & Pembagian', icon: UserCheck },
    { id: 'whatsapp', label: 'Koneksi WhatsApp', icon: QrCode },
    { id: 'billing', label: 'Paket & Langganan', icon: CreditCard },
    { id: 'settings', label: 'Pengaturan Organisasi', icon: Settings },
  ];

  const content = (
    <aside className="w-64 bg-slate-50 dark:bg-slate-900/90 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 select-none h-full">
      {/* Top Menu Links */}
      <div className="p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Workspace Utama
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white shrink-0">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-3">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Layanan Eksternal
          </div>
          <button
            onClick={() => onChangeView('marketing')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeView === 'marketing'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800/80'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Landing Page Publik</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Subscription Quota Card */}
      <div className="p-3 m-3 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white mb-1.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="capitalize">Paket {quota.tier}</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            {leadPercentage}% Kuota
          </span>
        </div>

        {/* Quota Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all"
            style={{ width: `${Math.min(100, leadPercentage)}%` }}
          />
        </div>

        <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5 mb-2.5">
          <div className="flex justify-between">
            <span>Kapasitas Leads:</span>
            <span className="font-mono tabular-nums text-slate-900 dark:text-white font-medium">
              {quota.currentLeads} / {quota.maxLeads.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Seat Agent:</span>
            <span className="font-mono tabular-nums text-slate-900 dark:text-white font-medium">
              {quota.currentAgents} / {quota.maxAgents}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Akun WhatsApp:</span>
            <span className="font-mono tabular-nums text-slate-900 dark:text-white font-medium">
              {quota.currentWhatsAppNumbers} / {quota.maxWhatsAppNumbers}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            onChangeView('billing');
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full py-1.5 px-2 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-lg transition-colors text-center"
        >
          Kelola / Upgrade Paket
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0 h-full">{content}</div>

      {/* Mobile Drawer Overlay */}
      {isOpenOnMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-10">{content}</div>
        </div>
      )}
    </>
  );
};
