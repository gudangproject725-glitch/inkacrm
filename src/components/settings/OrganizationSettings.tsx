import React, { useState } from 'react';
import { Settings, Building2, Clock, Tag, Save, CheckCircle2 } from 'lucide-react';
import { Organization } from '../../types/crm.ts';

interface OrganizationSettingsProps {
  currentOrg: Organization;
  onUpdateOrg: (org: Organization) => void;
}

export const OrganizationSettings: React.FC<OrganizationSettingsProps> = ({
  currentOrg,
  onUpdateOrg,
}) => {
  const [form, setForm] = useState({
    name: currentOrg.name,
    businessSector: currentOrg.businessSector,
    phone: currentOrg.phone,
    city: currentOrg.city,
    operatingHours: '08:30 - 17:30 WIB (Senin - Sabtu)',
  });
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Organization = {
      ...currentOrg,
      name: form.name.trim(),
      businessSector: form.businessSector.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
    };
    onUpdateOrg(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Pengaturan Profil Organisasi
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola identitas workspace, kontak perusahaan, dan parameter operasional sistem
          </p>
        </div>
        {savedNotice && (
          <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 animate-pulse">
            <CheckCircle2 className="w-4 h-4" />
            <span>Perubahan berhasil disimpan!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-5 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nama Organisasi / Perusahaan *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Sektor Industri / Bisnis
            </label>
            <input
              type="text"
              value={form.businessSector}
              onChange={(e) => setForm({ ...form, businessSector: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nomor Telepon Kantor
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Kota Domisili Operasional
            </label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Jam Operasional CS & Sales (Waktu Kerja)
          </label>
          <input
            type="text"
            value={form.operatingHours}
            onChange={(e) => setForm({ ...form, operatingHours: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Di luar jam ini, pesan masuk WhatsApp dapat direspon dengan pesan otomatis di luar jam kerja.
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
