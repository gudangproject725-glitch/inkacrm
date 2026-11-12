import React, { useState } from 'react';
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  Send,
  ShieldCheck,
  Server,
  Zap,
} from 'lucide-react';
import { Organization } from '../../types/crm.ts';
import { displayIndonesianPhone } from '../../utils/crm-rules.ts';

interface WhatsAppConnectionProps {
  currentOrg: Organization;
}

export const WhatsAppConnection: React.FC<WhatsAppConnectionProps> = ({ currentOrg }) => {
  const [connecting, setConnecting] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<'idle' | 'testing' | 'success'>('idle');

  const quota = currentOrg.subscription;

  const connectedNumbers = [
    {
      id: 'wa-1',
      phone: '081122334455',
      label: 'Nomor CS Utama (Official Meta API)',
      status: 'connected',
      uptime: '99.9%',
      dailyMessages: 432,
    },
    {
      id: 'wa-2',
      phone: '081399887766',
      label: 'Nomor Sales & B2B Inquiry',
      status: 'connected',
      uptime: '99.8%',
      dailyMessages: 198,
    },
  ];

  const handleTestWebhook = () => {
    setWebhookStatus('testing');
    setTimeout(() => {
      setWebhookStatus('success');
      setTimeout(() => setWebhookStatus('idle'), 4000);
    }, 1200);
  };

  const handleSimulateQRScan = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setQrScanned(true);
      setTimeout(() => setQrScanned(false), 5000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Koneksi & Gateway WhatsApp Business
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Integrasi multi-provider resmi (WhatsApp Cloud API & Gateway) untuk perpesanan multi-agent
          </p>
        </div>

        <div className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300">
          Koneksi Terpakai:{' '}
          <span className="font-mono font-bold text-slate-900 dark:text-white">
            {quota.currentWhatsAppNumbers} / {quota.maxWhatsAppNumbers} Nomor
          </span>
        </div>
      </div>

      {/* Connected Numbers List */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Nomor WhatsApp Aktif
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connectedNumbers.map((num) => (
            <div
              key={num.id}
              className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-base text-slate-900 dark:text-white">
                    {displayIndonesianPhone(num.phone)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Terhubung</span>
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-4">
                  {num.label}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Uptime Gateway: {num.uptime}</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {num.dailyMessages} Pesan / Hari
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Code Connect & Webhook Tester Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Simulator */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              Hubungkan Nomor Cadangan (Pindai QR)
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Buka aplikasi WhatsApp di ponsel Anda &gt; Pengaturan &gt; Perangkat Tertaut &gt; Pindai kode QR berikut untuk sinkronisasi pesan.
            </p>

            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60 mb-4">
              <div className="w-40 h-40 bg-white p-2.5 rounded-lg border border-slate-300 flex items-center justify-center shadow-xs">
                {connecting ? (
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
                    <span className="text-[11px] font-medium text-slate-600">Menghubungkan...</span>
                  </div>
                ) : qrScanned ? (
                  <div className="text-center text-emerald-600">
                    <CheckCircle2 className="w-10 h-10 mx-auto mb-1" />
                    <span className="text-[11px] font-bold">Berhasil Terhubung!</span>
                  </div>
                ) : (
                  <QrCode className="w-36 h-36 text-slate-900" />
                )}
              </div>
              <span className="text-[11px] text-slate-400 mt-3">
                Kode QR diperbarui otomatis setiap 45 detik
              </span>
            </div>
          </div>

          <button
            onClick={handleSimulateQRScan}
            disabled={connecting}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${connecting ? 'animate-spin' : ''}`} />
            <span>Simulasikan Pindai QR Sekarang</span>
          </button>
        </div>

        {/* Webhook & API Monitor */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              Pengujian Webhook Meta & Real-Time Sync
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              InkaCRM memproses webhook incoming messages dan status delivery (sent, delivered, read) dengan response time &lt; 80ms.
            </p>

            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] space-y-2 mb-4">
              <div className="text-emerald-400">POST /api/webhooks/whatsapp/incoming</div>
              <div className="text-slate-400">Host: inkacrm-gateway.local</div>
              <div className="text-slate-400">X-Hub-Signature-256: sha256=d8f7...a9e1</div>
              <div className="pt-2 border-t border-slate-800 text-slate-300">
                {webhookStatus === 'testing'
                  ? 'Sedang menguji handshake webhook...'
                  : webhookStatus === 'success'
                  ? 'Status: 200 OK — Payload terverifikasi, chat tersinkron.'
                  : 'Siap menerima payload pengujian.'}
              </div>
            </div>
          </div>

          <button
            onClick={handleTestWebhook}
            disabled={webhookStatus === 'testing'}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Kirim Simulasi Webhook Pesan Masuk</span>
          </button>
        </div>
      </div>
    </div>
  );
};
