import React, { useState } from 'react';
import {
  Cpu,
  Plus,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  Filter,
  Check,
  X,
  FileText,
} from 'lucide-react';
import {
  AutomationRule,
  AutomationLog,
  Organization,
  User,
  LeadSource,
} from '../../types/crm.ts';

interface AutomationBuilderProps {
  currentOrg: Organization;
  rules: AutomationRule[];
  logs: AutomationLog[];
  users: User[];
  onToggleRule: (ruleId: string) => void;
  onAddRule: (rule: AutomationRule) => void;
  onRunTestRule: (ruleId: string) => void;
}

export const AutomationBuilder: React.FC<AutomationBuilderProps> = ({
  currentOrg,
  rules,
  logs,
  users,
  onToggleRule,
  onAddRule,
  onRunTestRule,
}) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'logs'>('rules');
  const [showNewRuleModal, setShowNewRuleModal] = useState(false);
  const [testNotification, setTestNotification] = useState<string | null>(null);

  // New Rule Form
  const [ruleForm, setRuleForm] = useState({
    name: '',
    description: '',
    trigger: 'lead_created' as any,
    sourceEquals: 'Meta Ads' as LeadSource,
    assignRoundRobin: true,
    addTag: 'Otomatis InkaCRM',
  });

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    const newRule: AutomationRule = {
      id: `rule-${Date.now()}`,
      tenantId: currentOrg.id,
      name: ruleForm.name.trim() || 'Otomatisasi Baru',
      description: ruleForm.description.trim() || 'Deskripsi aturan otomatisasi',
      trigger: ruleForm.trigger,
      conditions: {
        sourceEquals: ruleForm.sourceEquals,
      },
      actions: {
        assignRoundRobin: ruleForm.assignRoundRobin,
        addTag: ruleForm.addTag.trim(),
      },
      isActive: true,
      executionsCount: 0,
      lastRunAt: 'Belum pernah',
    };

    onAddRule(newRule);
    setShowNewRuleModal(false);
    setRuleForm({
      name: '',
      description: '',
      trigger: 'lead_created',
      sourceEquals: 'Meta Ads',
      assignRoundRobin: true,
      addTag: 'Otomatis InkaCRM',
    });
  };

  const handleTestRun = (ruleId: string, ruleName: string) => {
    onRunTestRule(ruleId);
    setTestNotification(`Alur "${ruleName}" berhasil dieksekusi secara instan! Cek tab Riwayat Eksekusi.`);
    setTimeout(() => setTestNotification(null), 4000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Pusat Otomatisasi Alur Kerja (Workflow Automation)
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Bangun aturan berbasis pemicu (Trigger & Action) untuk distribusi leads, tagging, dan respon WhatsApp instan
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Switcher */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'rules'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Aturan Aktif ({rules.length})
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'logs'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Riwayat Eksekusi ({logs.length})
            </button>
          </div>

          <button
            onClick={() => setShowNewRuleModal(true)}
            className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Alur Baru</span>
          </button>
        </div>
      </div>

      {/* Test Notification Banner */}
      {testNotification && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span>{testNotification}</span>
          </div>
          <button onClick={() => setTestNotification(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: Rules List */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`p-5 rounded-xl border bg-white dark:bg-slate-900 flex flex-col justify-between transition-all ${
                  rule.isActive
                    ? 'border-slate-200 dark:border-slate-800 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div>
                  {/* Top: Trigger & Toggle */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      ⚡ {rule.trigger.replace('_', ' ')}
                    </span>

                    <button
                      onClick={() => onToggleRule(rule.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        rule.isActive ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          rule.isActive ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                    {rule.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {rule.description}
                  </p>

                  {/* Flow Steps Visualization */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg space-y-2 text-xs mb-4">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-[10px] uppercase text-slate-400">Pemicu:</span>
                      <span>{rule.trigger === 'lead_created' ? 'Lead Baru Masuk' : rule.trigger === 'wa_incoming_message' ? 'WhatsApp Diterima' : 'Idle 24 Jam'}</span>
                    </div>

                    {rule.conditions.sourceEquals && (
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <span className="font-bold text-[10px] uppercase text-slate-400">Kondisi:</span>
                        <span>Sumber = {rule.conditions.sourceEquals}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-[10px] uppercase text-slate-400">Aksi:</span>
                      <span>
                        {rule.actions.assignRoundRobin ? 'Bagi Round-Robin' : ''}
                        {rule.actions.addTag ? ` · Beri Tag '${rule.actions.addTag}'` : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono tabular-nums">{rule.executionsCount}x dieksekusi</span>

                  <button
                    onClick={() => handleTestRun(rule.id, rule.name)}
                    className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md transition-colors flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 text-emerald-600" />
                    <span>Uji Coba Alur</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Execution Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Waktu Eksekusi</th>
                  <th className="p-3">Nama Aturan</th>
                  <th className="p-3">Pemicu & Entitas Terkait</th>
                  <th className="p-3">Rangkuman Hasil Aksi</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                      {log.executedAt}
                    </td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {log.ruleName}
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">
                      {log.triggerEvent}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">
                      {log.summary}
                    </td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Sukses</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Tambah Alur Otomatisasi Baru */}
      {showNewRuleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Buat Alur Otomatisasi Baru
              </h3>
              <button onClick={() => setShowNewRuleModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Alur Kerja *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Distribusi Khusus Iklan TikTok"
                  value={ruleForm.name}
                  onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Aturan
                </label>
                <textarea
                  rows={2}
                  placeholder="Jelaskan tujuan otomatisasi ini..."
                  value={ruleForm.description}
                  onChange={(e) => setRuleForm({ ...ruleForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pemicu (Trigger)
                  </label>
                  <select
                    value={ruleForm.trigger}
                    onChange={(e) => setRuleForm({ ...ruleForm, trigger: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="lead_created">Prospek (Lead) Baru Dibuat</option>
                    <option value="wa_incoming_message">Pesan WhatsApp Baru Masuk</option>
                    <option value="deal_stage_changed">Tahapan Deal Berubah</option>
                    <option value="lead_idle_24h">Prospek Diam &gt; 24 Jam</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sumber Lead (Kondisi)
                  </label>
                  <select
                    value={ruleForm.sourceEquals}
                    onChange={(e) => setRuleForm({ ...ruleForm, sourceEquals: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="WhatsApp Inbound">WhatsApp Inbound</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tag Otomatis yang Disematkan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Auto-Assign, Prioritas"
                  value={ruleForm.addTag}
                  onChange={(e) => setRuleForm({ ...ruleForm, addTag: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="assignRoundRobin"
                  checked={ruleForm.assignRoundRobin}
                  onChange={(e) => setRuleForm({ ...ruleForm, assignRoundRobin: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="assignRoundRobin" className="font-semibold text-slate-700 dark:text-slate-300">
                  Aktifkan pembagian otomatis Round Robin ke agen online
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewRuleModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Simpan Alur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
