import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  MessageSquare,
  Phone,
  Mail,
  UserCheck,
  Tag,
  Clock,
  ChevronRight,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  Trash2,
} from 'lucide-react';
import { Lead, User, LeadSource, LeadStatus, DealStage, Organization } from '../../types/crm.ts';
import {
  formatIDR,
  displayIndonesianPhone,
  normalizeIndonesianPhone,
  checkQuotaEntitlement,
  getNextRoundRobinAgent,
} from '../../utils/crm-rules.ts';

interface LeadsManagementProps {
  currentOrg: Organization;
  leads: Lead[];
  users: User[];
  onAddLead: (newLead: Lead) => void;
  onUpdateLead: (updatedLead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
  onOpenChatWithLead: (lead: Lead) => void;
}

export const LeadsManagement: React.FC<LeadsManagementProps> = ({
  currentOrg,
  leads,
  users,
  onAddLead,
  onUpdateLead,
  onDeleteLead,
  onOpenChatWithLead,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  // Modals & Drawer State
  const [activeLeadDetail, setActiveLeadDetail] = useState<Lead | null>(null);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [newActivityDesc, setNewActivityDesc] = useState('');
  const [newActivityType, setNewActivityType] = useState<any>('whatsapp');

  // New Lead Form State
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    source: 'Meta Ads' as LeadSource,
    estimatedValue: 20000000,
    assignedAgentId: 'auto',
    tags: 'Meta Lead, Prioritas',
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);

    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
    const matchesSource = selectedSource === 'all' || lead.source === selectedSource;
    const matchesAgent = selectedAgent === 'all' || lead.assignedAgentId === selectedAgent;

    return matchesSearch && matchesStatus && matchesSource && matchesAgent;
  });

  // Handle select all checkbox
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeadIds(filteredLeads.map((l) => l.id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedLeadIds.includes(id)) {
      setSelectedLeadIds(selectedLeadIds.filter((item) => item !== id));
    } else {
      setSelectedLeadIds([...selectedLeadIds, id]);
    }
  };

  // Form submit for New Lead
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate Quota
    const quotaCheck = checkQuotaEntitlement(currentOrg.subscription, 'leads');
    if (!quotaCheck.allowed) {
      setFormError(quotaCheck.message || 'Batas kuota leads telah tercapai.');
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim()) {
      setFormError('Nama kontak dan nomor WhatsApp wajib diisi.');
      return;
    }

    let assignedUser: User | null = null;
    if (formData.assignedAgentId === 'auto') {
      assignedUser = getNextRoundRobinAgent(users);
    } else {
      assignedUser = users.find((u) => u.id === formData.assignedAgentId) || null;
    }

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      tenantId: currentOrg.id,
      name: formData.name.trim(),
      company: formData.company.trim() || 'Perorangan',
      phone: normalizeIndonesianPhone(formData.phone.trim()),
      email: formData.email.trim() || `${formData.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      source: formData.source,
      status: 'new',
      stage: 'new',
      estimatedValue: Number(formData.estimatedValue) || 10000000,
      assignedAgentId: assignedUser ? assignedUser.id : users[0]?.id || 'unassigned',
      assignedAgentName: assignedUser ? assignedUser.name : 'Unassigned',
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      notes: ['Lead dibuat melalui input manual dashboard.'],
      activities: [
        {
          id: `act-${Date.now()}`,
          timestamp: 'Baru saja',
          type: 'assignment',
          description: `Lead dibuat dan dialokasikan ke ${assignedUser?.name || 'Unassigned'}`,
          performedByName: 'Sistem InkaCRM',
        },
      ],
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      lastContactedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    onAddLead(newLead);
    setShowNewLeadModal(false);
    setFormData({
      name: '',
      company: '',
      phone: '',
      email: '',
      source: 'Meta Ads',
      estimatedValue: 20000000,
      assignedAgentId: 'auto',
      tags: 'Meta Lead, Prioritas',
    });
  };

  // Add Note to active lead
  const handleAddNote = () => {
    if (!activeLeadDetail || !newNoteText.trim()) return;
    const updatedLead: Lead = {
      ...activeLeadDetail,
      notes: [newNoteText.trim(), ...activeLeadDetail.notes],
    };
    onUpdateLead(updatedLead);
    setActiveLeadDetail(updatedLead);
    setNewNoteText('');
  };

  // Add Activity to active lead
  const handleAddActivity = () => {
    if (!activeLeadDetail || !newActivityDesc.trim()) return;
    const newAct = {
      id: `act-${Date.now()}`,
      timestamp: 'Baru saja',
      type: newActivityType,
      description: newActivityDesc.trim(),
      performedByName: users[0]?.name || 'Admin',
    };
    const updatedLead: Lead = {
      ...activeLeadDetail,
      activities: [newAct, ...activeLeadDetail.activities],
      lastContactedAt: 'Baru saja',
    };
    onUpdateLead(updatedLead);
    setActiveLeadDetail(updatedLead);
    setNewActivityDesc('');
  };

  // CSV Export simulation
  const handleExportCSV = () => {
    const headers = 'ID,Nama,Perusahaan,WhatsApp,Email,Sumber,Status,Nilai (IDR),Sales Owner\n';
    const rows = filteredLeads
      .map(
        (l) =>
          `"${l.id}","${l.name}","${l.company}","${l.phone}","${l.email}","${l.source}","${l.status}","${l.estimatedValue}","${l.assignedAgentName}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `inkacrm_leads_${currentOrg.slug}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Database Prospek & Leads
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola {leads.length} prospek bisnis, riwayat kontak, dan distribusi sales agent
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-3 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Impor CSV</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Data</span>
          </button>
          <button
            onClick={() => setShowNewLeadModal(true)}
            className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Lead Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, perusahaan, atau no. WhatsApp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filter Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="new">Baru</option>
            <option value="contacted">Dihubungi</option>
            <option value="qualified">Terkualifikasi</option>
            <option value="negotiation">Negosiasi</option>
            <option value="won">Menang (Won)</option>
            <option value="lost">Kalah (Lost)</option>
          </select>

          {/* Source Filter */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">Semua Sumber</option>
            <option value="Meta Ads">Meta Ads</option>
            <option value="Google Ads">Google Ads</option>
            <option value="WhatsApp Inbound">WhatsApp Inbound</option>
            <option value="Referral">Referral</option>
            <option value="Website Form">Website Form</option>
          </select>

          {/* Agent Filter */}
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">Semua Sales Agent</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Action Bar (if items selected) */}
      {selectedLeadIds.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs">
          <div className="font-semibold text-emerald-900 dark:text-emerald-200">
            {selectedLeadIds.length} lead dipilih
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const nextAgent = getNextRoundRobinAgent(users);
                selectedLeadIds.forEach((id) => {
                  const lead = leads.find((l) => l.id === id);
                  if (lead && nextAgent) {
                    onUpdateLead({
                      ...lead,
                      assignedAgentId: nextAgent.id,
                      assignedAgentName: nextAgent.name,
                    });
                  }
                });
                setSelectedLeadIds([]);
              }}
              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium"
            >
              Re-assign Round Robin
            </button>
            <button
              onClick={() => {
                selectedLeadIds.forEach((id) => onDeleteLead(id));
                setSelectedLeadIds([]);
              }}
              className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-medium flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Terpilih</span>
            </button>
          </div>
        </div>
      )}

      {/* Leads Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3 w-8">
                  <input
                    type="checkbox"
                    checked={
                      filteredLeads.length > 0 &&
                      selectedLeadIds.length === filteredLeads.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th className="p-3">Nama Kontak & WhatsApp</th>
                <th className="p-3">Perusahaan</th>
                <th className="p-3">Sumber Leads</th>
                <th className="p-3 text-right">Estimasi Nilai</th>
                <th className="p-3">Status</th>
                <th className="p-3">Sales Owner</th>
                <th className="p-3 text-right">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Tidak ada leads yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const isChecked = selectedLeadIds.includes(lead.id);
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(lead.id)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => setActiveLeadDetail(lead)}
                          className="text-left group"
                        >
                          <div className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                            {lead.name}
                          </div>
                          <div className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                            {displayIndonesianPhone(lead.phone)}
                          </div>
                        </button>
                      </td>
                      <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">
                        {lead.company}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {lead.source}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                        {formatIDR(lead.estimatedValue)}
                      </td>
                      <td className="p-3">
                        <span
                          className={`capitalize text-[11px] font-medium px-2 py-0.5 rounded ${
                            lead.status === 'won'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : lead.status === 'qualified'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                              : lead.status === 'negotiation'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="text-slate-900 dark:text-white font-medium">
                          {lead.assignedAgentName}
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenChatWithLead(lead)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded transition-colors"
                            title="Kirim Pesan WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setActiveLeadDetail(lead)}
                            className="px-2 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                          >
                            Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Tambah Lead Baru */}
      {showNewLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Tambah Prospek (Lead) Baru
                </h3>
                <p className="text-xs text-slate-500">
                  Data akan langsung terhubung ke sistem pembagian otomatis
                </p>
              </div>
              <button
                onClick={() => setShowNewLeadModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Kontak *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pak Herman"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Perusahaan / Bisnis
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: PT Prima Logistik"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    No. WhatsApp (Aktif) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="081234567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Kontak
                  </label>
                  <input
                    type="email"
                    placeholder="herman@perusahaan.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sumber Prospek (Lead Source)
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Meta Ads">Meta Ads (Facebook/IG)</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="WhatsApp Inbound">WhatsApp Inbound</option>
                    <option value="Referral">Referral Klien</option>
                    <option value="Website Form">Website Form</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estimasi Nilai Transaksi (IDR)
                  </label>
                  <input
                    type="number"
                    step={1000000}
                    value={formData.estimatedValue}
                    onChange={(e) => setFormData({ ...formData, estimatedValue: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Alokasi Sales Representative
                </label>
                <select
                  value={formData.assignedAgentId}
                  onChange={(e) => setFormData({ ...formData, assignedAgentId: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="auto">⚡ Otomatis Pembagian Round Robin (Sistem)</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role.replace('_', ' ')})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewLeadModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Simpan Prospek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Impor CSV Mock */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Impor Data Leads dari CSV/Excel
              </h3>
              <button onClick={() => setShowImportModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Unggah file CSV dengan kolom Nama, WhatsApp, Perusahaan, dan Estimasi Nilai. Sistem akan otomatis memvalidasi duplikasi nomor telepon.
            </p>
            <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center mb-4 bg-slate-50 dark:bg-slate-800/40">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Tarik file CSV ke sini, atau klik untuk memilih
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Maksimal 5.000 baris per unggahan</div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  alert('Fitur impor instan siap diproses.');
                  setShowImportModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
              >
                Mulai Impor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer: Detail Lead */}
      {activeLeadDetail && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-slate-200 dark:border-slate-800">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
                  Detail Prospek
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeLeadDetail.name}
                </h2>
                <div className="text-xs text-slate-500">{activeLeadDetail.company}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onOpenChatWithLead(activeLeadDetail);
                    setActiveLeadDetail(null);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Kirim WhatsApp</span>
                </button>
                <button
                  onClick={() => setActiveLeadDetail(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Body Scroll */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400">WhatsApp:</span>
                  <div className="font-mono font-medium text-slate-900 dark:text-white mt-0.5">
                    {displayIndonesianPhone(activeLeadDetail.phone)}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Email:</span>
                  <div className="font-medium text-slate-900 dark:text-white mt-0.5 truncate">
                    {activeLeadDetail.email}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Estimasi Nilai:</span>
                  <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                    {formatIDR(activeLeadDetail.estimatedValue)}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Sales Owner:</span>
                  <div className="font-medium text-slate-900 dark:text-white mt-0.5">
                    {activeLeadDetail.assignedAgentName}
                  </div>
                </div>
              </div>

              {/* Status and Stage Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Ubah Status Prospek
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['new', 'contacted', 'qualified', 'negotiation', 'won', 'lost'] as LeadStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => {
                          const updated = {
                            ...activeLeadDetail,
                            status: st,
                            stage: st as DealStage,
                          };
                          onUpdateLead(updated);
                          setActiveLeadDetail(updated);
                        }}
                        className={`py-1.5 px-2 rounded-lg text-xs capitalize font-medium transition-colors ${
                          activeLeadDetail.status === st
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Team Notes Section */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  Catatan Internal Tim
                </h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Tulis catatan mengenai kebutuhan prospek..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-1 text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={handleAddNote}
                    className="px-3 py-2 text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg shrink-0"
                  >
                    Simpan
                  </button>
                </div>
                <div className="space-y-2">
                  {activeLeadDetail.notes.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-xs text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800"
                    >
                      {note}
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Timeline Section */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  Riwayat Aktivitas & Follow-up
                </h3>

                {/* Add Activity Form */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <select
                      value={newActivityType}
                      onChange={(e) => setNewActivityType(e.target.value)}
                      className="text-xs p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="call">Panggilan Telepon</option>
                      <option value="meeting">Meeting / Demo</option>
                      <option value="email">Email</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Rincian hasil follow-up..."
                      value={newActivityDesc}
                      onChange={(e) => setNewActivityDesc(e.target.value)}
                      className="flex-1 text-xs p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                    <button
                      onClick={handleAddActivity}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded shrink-0"
                    >
                      Catat
                    </button>
                  </div>
                </div>

                {/* Timeline Items */}
                <div className="space-y-3">
                  {activeLeadDetail.activities.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-start gap-3 text-xs border-l-2 border-emerald-500 pl-3 py-1"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 dark:text-white capitalize">
                            {act.type}
                          </span>
                          <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                          {act.description}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          Oleh: {act.performedByName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center text-xs">
              <span className="text-slate-400">ID: {activeLeadDetail.id}</span>
              <button
                onClick={() => {
                  onDeleteLead(activeLeadDetail.id);
                  setActiveLeadDetail(null);
                }}
                className="text-red-600 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Lead</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
