import React from 'react';
import {
  Building2,
  ChevronDown,
  Layers,
  Moon,
  Sun,
  ExternalLink,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';
import { Organization, User } from '../../types/crm.ts';

interface NavbarProps {
  currentOrg: Organization;
  organizations: Organization[];
  currentUser: User;
  onSelectOrg: (org: Organization) => void;
  activeView: string;
  onChangeView: (view: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentOrg,
  organizations,
  currentUser,
  onSelectOrg,
  activeView,
  onChangeView,
  isDarkMode,
  onToggleDarkMode,
  onToggleMobileMenu,
}) => {
  const [showOrgDropdown, setShowOrgDropdown] = React.useState(false);

  return (
    <header className="flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors shrink-0">
      {/* Zone 1: Brand Wordmark adhering strictly to Top Bar Contract */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            aria-label="Buka menu navigasi"
            className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 rounded-lg"
          >
            <Layers className="w-5 h-5 text-emerald-600" />
          </button>
        )}

        <button
          onClick={() => onChangeView('dashboard')}
          className="flex items-center gap-2 text-left focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            I
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            Inka<span className="text-emerald-600 dark:text-emerald-400">CRM</span>
          </span>
        </button>

        {/* Tenant Organization Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowOrgDropdown(!showOrgDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
            title="Ganti Organisasi (Multi-Tenant)"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="font-semibold text-slate-900 dark:text-white">{currentOrg.name}</span>
            <span className="text-slate-400">·</span>
            <span className="uppercase text-[10px] tracking-wider font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
              {currentOrg.subscription.tier}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {showOrgDropdown && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg py-1.5 z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Pilih Ruang Kerja (Workspace)
              </div>
              {organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => {
                    onSelectOrg(org);
                    setShowOrgDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                    org.id === currentOrg.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="truncate">
                    <div>{org.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{org.businessSector}</div>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                    {org.subscription.tier}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
        <button
          onClick={() => onChangeView('dashboard')}
          className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap ${
            activeView === 'dashboard' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
          }`}
        >
          Ringkasan
        </button>
        <button
          onClick={() => onChangeView('leads')}
          className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap ${
            activeView === 'leads' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
          }`}
        >
          Prospek & Leads
        </button>
        <button
          onClick={() => onChangeView('pipeline')}
          className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap ${
            activeView === 'pipeline' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
          }`}
        >
          Sales Pipeline
        </button>
        <button
          onClick={() => onChangeView('chat')}
          className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap ${
            activeView === 'chat' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
          }`}
        >
          WhatsApp Inbox
        </button>
        <button
          onClick={() => onChangeView('marketing')}
          className={`flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap ${
            activeView === 'marketing' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
          }`}
        >
          <span>Website Publik</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action + Quick Utilities */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Dark Mode Switcher */}
        <button
          onClick={onToggleDarkMode}
          aria-label={isDarkMode ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
          className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Superadmin Mode Switcher */}
        <button
          onClick={() => onChangeView(activeView === 'superadmin' ? 'dashboard' : 'superadmin')}
          className={`p-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 ${
            activeView === 'superadmin'
              ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-medium'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Super Admin Platform InkaCRM"
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="hidden sm:inline">Super Admin</span>
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
          <div className="hidden md:block text-left">
            <div className="text-xs font-medium text-slate-900 dark:text-white leading-tight">
              {currentUser.name}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
              {currentUser.role.replace('_', ' ')}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
