import React, { useState } from 'react';
import {
  Search,
  Send,
  MessageSquare,
  Phone,
  UserCheck,
  Tag,
  Check,
  CheckCheck,
  Clock,
  Sparkles,
  Paperclip,
  Smile,
  ShieldAlert,
  Building,
  Plus,
  RefreshCw,
  FileText,
  User,
} from 'lucide-react';
import {
  WhatsAppConversation,
  QuickReplyTemplate,
  User as UserType,
  Organization,
  ChatMessage,
} from '../../types/crm.ts';
import { displayIndonesianPhone } from '../../utils/crm-rules.ts';

interface WhatsAppInboxProps {
  currentOrg: Organization;
  conversations: WhatsAppConversation[];
  templates: QuickReplyTemplate[];
  users: UserType[];
  currentUser: UserType;
  onUpdateConversation: (updatedConv: WhatsAppConversation) => void;
}

export const WhatsAppInbox: React.FC<WhatsAppInboxProps> = ({
  currentOrg,
  conversations,
  templates,
  users,
  currentUser,
  onUpdateConversation,
}) => {
  const [selectedConvId, setSelectedConvId] = useState<string>(conversations[0]?.id || '');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'pending' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showTemplatesDropdown, setShowTemplatesDropdown] = useState(false);
  const [newInternalNote, setNewInternalNote] = useState('');

  const activeConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Send outgoing message from active agent
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !activeConv) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'agent',
      agentName: currentUser.name,
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      status: 'read',
    };

    const updatedConv: WhatsAppConversation = {
      ...activeConv,
      lastMessage: newMessage.text,
      lastMessageTime: 'Baru saja',
      messages: [...activeConv.messages, newMessage],
      unreadCount: 0,
    };

    onUpdateConversation(updatedConv);
    setMessageInput('');
  };

  // Simulate an incoming customer reply
  const handleSimulateCustomerReply = () => {
    if (!activeConv) return;
    const sampleReplies = [
      'Terima kasih infonya min, saya diskusikan dengan tim dulu ya.',
      'Bisa tolong buatkan penawaran resmi untuk 50 unit?',
      'Siap, jadwal meeting demo besok jam 10 pagi via Google Meet sudah oke.',
      'Kira-kira estimasi waktu pengiriman barang ke Surabaya berapa hari ya?',
    ];
    const randomReply = sampleReplies[Math.floor(Math.random() * sampleReplies.length)];

    const incomingMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      text: randomReply,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
    };

    const updatedConv: WhatsAppConversation = {
      ...activeConv,
      lastMessage: incomingMsg.text,
      lastMessageTime: 'Baru saja',
      messages: [...activeConv.messages, incomingMsg],
      unreadCount: activeConv.unreadCount + 1,
    };

    onUpdateConversation(updatedConv);
  };

  // Insert Quick Template
  const handleInsertTemplate = (template: QuickReplyTemplate) => {
    let replaced = template.text
      .replace('{nama_kontak}', activeConv?.contactName || 'Pelanggan')
      .replace('{nama_perusahaan}', currentOrg.name)
      .replace('{nama_agent}', currentUser.name);

    setMessageInput(replaced);
    setShowTemplatesDropdown(false);
  };

  // Add Internal Note
  const handleAddInternalNote = () => {
    if (!newInternalNote.trim() || !activeConv) return;
    const noteEntry = `${currentUser.name} (${new Date().toLocaleDateString('id-ID')}): ${newInternalNote.trim()}`;
    const updatedConv: WhatsAppConversation = {
      ...activeConv,
      internalNotes: [noteEntry, ...activeConv.internalNotes],
    };
    onUpdateConversation(updatedConv);
    setNewInternalNote('');
  };

  // Re-assign agent
  const handleReassignAgent = (agentId: string) => {
    if (!activeConv) return;
    const agent = users.find((u) => u.id === agentId);
    if (!agent) return;

    const updatedConv: WhatsAppConversation = {
      ...activeConv,
      assignedAgentId: agent.id,
      assignedAgentName: agent.name,
    };
    onUpdateConversation(updatedConv);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col h-[calc(100vh-140px)]">
      {/* Inbox Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Conversations List */}
        <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          {/* Search & Tabs */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari obrolan atau nomor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-200/60 dark:bg-slate-800 rounded-lg text-[11px] font-medium">
              {(['all', 'open', 'pending', 'resolved'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterStatus(tab)}
                  className={`flex-1 py-1 rounded capitalize transition-colors ${
                    filterStatus === tab
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {tab === 'all' ? 'Semua' : tab === 'open' ? 'Terbuka' : tab === 'pending' ? 'Tunda' : 'Selesai'}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations Scroll */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Tidak ada obrolan ditemukan.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activeConv?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setSelectedConvId(conv.id);
                      if (conv.unreadCount > 0) {
                        onUpdateConversation({ ...conv, unreadCount: 0 });
                      }
                    }}
                    className={`w-full p-3 text-left transition-colors flex items-start gap-3 ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-l-2 border-emerald-600'
                        : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-xs shrink-0 mt-0.5">
                      {conv.contactName.substring(0, 2).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                          {conv.contactName}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {conv.lastMessageTime}
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-slate-400 mb-0.5">
                        {displayIndonesianPhone(conv.phone)}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                        {conv.lastMessage}
                      </p>

                      <div className="flex items-center justify-between mt-1 pt-1">
                        <span className="text-[10px] text-slate-400 truncate">
                          CS: {conv.assignedAgentName}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Center Column: Chat Messages & Composer */}
        <div className="flex-1 flex flex-col justify-between bg-slate-100/40 dark:bg-slate-950/60">
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                    {activeConv.contactName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{activeConv.contactName}</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {displayIndonesianPhone(activeConv.phone)}
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>WhatsApp Official Terhubung</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Agent Assignment Dropdown */}
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-slate-400">Ditangani:</span>
                    <select
                      value={activeConv.assignedAgentId}
                      onChange={(e) => handleReassignAgent(e.target.value)}
                      className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-slate-900 dark:text-white"
                    >
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Simulate incoming customer message */}
                  <button
                    onClick={handleSimulateCustomerReply}
                    className="px-2.5 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors flex items-center gap-1 font-medium"
                    title="Simulasikan pesan balasan dari pelanggan WhatsApp"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Simulasi Balasan</span>
                  </button>
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeConv.messages.map((msg) => {
                  const isAgent = msg.sender === 'agent';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl p-3 text-xs shadow-xs space-y-1 ${
                          isAgent
                            ? 'bg-emerald-600 text-white rounded-br-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-xs border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {isAgent && msg.agentName && (
                          <div className="text-[10px] text-emerald-100 font-semibold">
                            {msg.agentName}
                          </div>
                        )}
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        <div
                          className={`flex items-center justify-end gap-1 text-[10px] ${
                            isAgent ? 'text-emerald-100' : 'text-slate-400'
                          }`}
                        >
                          <span>{msg.time}</span>
                          {isAgent && (
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-200" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Composer */}
              <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2 relative">
                {/* Quick Templates Dropdown */}
                {showTemplatesDropdown && (
                  <div className="absolute bottom-full left-4 mb-2 w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50 max-h-64 overflow-y-auto">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                      Pilih Template Balasan Cepat
                    </div>
                    {templates.map((tpl) => (
                      <button
                        key={tpl.id}
                        onClick={() => handleInsertTemplate(tpl)}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                          <span>{tpl.title}</span>
                          <span className="font-mono text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                            {tpl.shortcut}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{tpl.text}</p>
                      </button>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTemplatesDropdown(!showTemplatesDropdown)}
                    className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                    title="Gunakan Template WhatsApp"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span className="hidden sm:inline">Template</span>
                  </button>

                  <input
                    type="text"
                    placeholder="Ketik balasan WhatsApp... (Gunakan tombol Template untuk salam/katalog)"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1 text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />

                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all shadow-xs flex items-center gap-1 text-xs font-semibold"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
              Pilih salah satu percakapan di sebelah kiri.
            </div>
          )}
        </div>

        {/* Right Column: Contact Info & Internal Notes */}
        {activeConv && (
          <div className="w-72 border-l border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 hidden xl:flex flex-col justify-between overflow-y-auto">
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Profil Kontak
                </h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400">Nama:</span>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {activeConv.contactName}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Nomor Telepon:</span>
                    <div className="font-mono text-slate-900 dark:text-white">
                      {displayIndonesianPhone(activeConv.phone)}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Status Obrolan:</span>
                    <div className="capitalize font-medium text-emerald-600">
                      {activeConv.status}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Label / Tags
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {activeConv.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Internal Notes Section */}
              <div>
                <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  <span>Catatan Rahasia Tim</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">
                  Hanya terlihat oleh tim sales & CS internal, pelanggan tidak dapat melihat catatan ini.
                </p>

                <div className="space-y-2 mb-3">
                  <textarea
                    rows={2}
                    placeholder="Tambah catatan briefing..."
                    value={newInternalNote}
                    onChange={(e) => setNewInternalNote(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={handleAddInternalNote}
                    className="w-full py-1.5 text-xs font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Simpan Catatan
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {activeConv.internalNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 rounded-lg text-xs text-amber-900 dark:text-amber-200"
                    >
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
