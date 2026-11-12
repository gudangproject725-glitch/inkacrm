import React, { useState } from 'react';
import {
  Users2,
  Plus,
  Shield,
  CheckCircle,
  XCircle,
  Sparkles,
  AlertCircle,
  UserCheck,
  RefreshCw,
  X,
} from 'lucide-react';
import { User, Organization, UserRole } from '../../types/crm.ts';
import { checkQuotaEntitlement } from '../../utils/crm-rules.ts';

interface TeamManagementProps {
  currentOrg: Organization;
  users: User[];
  onAddUser: (user: User) => void;
  onToggleUserOnline: (userId: string) => void;
  onNavigateToBilling: () => void;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({
  currentOrg,
  users,
  onAddUser,
  onToggleUserOnline,
  onNavigateToBilling,
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'sales_rep' as UserRole,
  });

  const quota = currentOrg.subscription;
  const quotaCheck = checkQuotaEntitlement(quota, 'agents');

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);

    if (!quotaCheck.allowed) {
      setInviteError(
        `Batas kursi anggota (${quota.currentAgents}/${quota.maxAgents}) telah tercapai pada paket ${quota.tier.toUpperCase()}.`
      );
      return;
    }

    if (!inviteForm.name.trim() || !inviteForm.email.trim()) {
      setInviteError('Nama dan email anggota wajib diisi.');
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      tenantId: currentOrg.id,
      name: inviteForm.name.trim(),
      email: inviteForm.email.trim(),
      phone: inviteForm.phone.trim() || '081200001111',
      role: inviteForm.role,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(inviteForm.name)}`,
      isOnline: true,
      assignedLeadsCount: 0,
    };

    onAddUser(newUser);
    setShowInviteModal(false);
    setInviteForm({
      name: '',
      email: '',
      phone: '',
      role: 'sales_rep',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Seat Quota */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Manajemen Tim & Pembagian Tugas
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Atur peran staf sales & CS, status online, dan giliran distribusi prospek Round-Robin
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300">
            Kursi Terpakai:{' '}
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {users.length} / {quota.maxAgents}
            </span>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Undang Anggota</span>
          </button>
        </div>
      </div>

      {/* Round Robin Status Card */}
      <div className="p-5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              Antrean Round-Robin Otomatis Aktif
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Setiap lead baru yang masuk secara otomatis diberikan kepada agen aktif yang sedang online secara berurutan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {users
            .filter((u) => u.isOnline)
            .map((u) => (
              <span
                key={u.id}
                className="px-2.5 py-1 text-xs font-semibold bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-200 rounded-lg border border-emerald-300 dark:border-emerald-700 flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{u.name}</span>
              </span>
            ))}
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Anggota Tim</th>
                <th className="p-3">Peran (Role)</th>
                <th className="p-3">No. Kontak</th>
                <th className="p-3 text-center">Status Kehadiran</th>
                <th className="p-3 text-right">Leads Ditangani</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{member.name}</div>
                        <div className="text-[11px] text-slate-400">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="capitalize px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {member.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-600 dark:text-slate-400">
                    {member.phone}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onToggleUserOnline(member.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                        member.isOnline
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          member.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                      <span>{member.isOnline ? 'Online (Aktif)' : 'Offline (Libur)'}</span>
                    </button>
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                    {member.assignedLeadsCount} Leads
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onToggleUserOnline(member.id)}
                      className="text-xs font-semibold text-emerald-600 hover:underline"
                    >
                      Ubah Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Undang Anggota Baru */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Undang Anggota Tim Baru
              </h3>
              <button onClick={() => setShowInviteModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {inviteError && (
              <div className="p-3 mb-4 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 flex items-center justify-between">
                <span>{inviteError}</span>
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    onNavigateToBilling();
                  }}
                  className="font-bold underline ml-2 shrink-0"
                >
                  Upgrade
                </button>
              </div>
            )}

            <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rian Anggara"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Alamat Email Perusahaan *
                </label>
                <input
                  type="email"
                  required
                  placeholder="rian@nusantaraniaga.co.id"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Peran / Hak Akses
                </label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as UserRole })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="sales_rep">Sales Representative (Kelola Leads & Pipeline)</option>
                  <option value="cs_agent">Customer Service (Balas Chat WhatsApp)</option>
                  <option value="sales_manager">Sales Manager (Pantau Tim & Laporan)</option>
                  <option value="admin">Administrator Organisasi</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Kirim Undangan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
