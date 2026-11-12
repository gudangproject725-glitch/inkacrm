import React, { useState } from 'react';
import { Contact, Search, Phone, Mail, Building, Plus, Download, MessageSquare } from 'lucide-react';
import { Lead, Organization } from '../../types/crm.ts';
import { formatIDR, displayIndonesianPhone } from '../../utils/crm-rules.ts';

interface ContactsDatabaseProps {
  currentOrg: Organization;
  leads: Lead[];
  onOpenChatWithLead: (lead: Lead) => void;
}

export const ContactsDatabase: React.FC<ContactsDatabaseProps> = ({
  currentOrg,
  leads,
  onOpenChatWithLead,
}) => {
  const [search, setSearch] = useState('');

  const contacts = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Buku Kontak & Direktori Pelanggan
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pusat kontak terpadu seluruh entitas prospek dan pelanggan perusahaan Anda
          </p>
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama atau telepon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs hover:border-emerald-500/50 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                  {contact.name.substring(0, 2).toUpperCase()}
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                    contact.status === 'won'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {contact.status === 'won' ? 'Pelanggan Aktif' : `Prospek: ${contact.status}`}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-0.5">
                {contact.name}
              </h3>
              <div className="text-xs text-slate-500 mb-3">{contact.company}</div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{displayIndonesianPhone(contact.phone)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{contact.email}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Nilai Transaksi:</span>
                <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                  {formatIDR(contact.estimatedValue)}
                </span>
              </div>
              <button
                onClick={() => onOpenChatWithLead(contact)}
                className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat WA</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
