import React, { useState } from 'react';
import {
  Check,
  ChevronDown,
  MessageSquare,
  Users2,
  GitPullRequest,
  Cpu,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Zap,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { ASSET_IMAGES } from '../../data/mock-seed.ts';
import { formatIDR } from '../../utils/crm-rules.ts';

interface MarketingLandingProps {
  onEnterApp: () => void;
}

export const MarketingLanding: React.FC<MarketingLandingProps> = ({ onEnterApp }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const discountPercent = 20;

  const plans = [
    {
      name: 'Starter',
      badge: 'Untuk UMKM & Bisnis Baru',
      monthlyPrice: 299000,
      annualPrice: 239000, // per month when paid annually
      description: 'Solusi esensial untuk tim penjualan kecil yang ingin merapikan kontak & follow-up WhatsApp.',
      features: [
        'Hingga 1.000 Database Leads',
        '3 Akun Sales & CS (Seats)',
        '1 Akun Nomor WhatsApp Terhubung',
        'Sales Pipeline Kanban (5 Tahapan)',
        'Distribusi Round-Robin Dasar',
        'Ekspor & Impor Data Excel/CSV',
        'Dukungan Komunitas & Email SLA 24 Jam',
      ],
      popular: false,
      ctaText: 'Pilih Paket Starter',
    },
    {
      name: 'Growth',
      badge: 'Paling Populer',
      monthlyPrice: 799000,
      annualPrice: 639000,
      description: 'Pilihan utama bisnis berkembang untuk otomatisasi penuh tim sales dan multi-agent CS.',
      features: [
        'Hingga 5.000 Database Leads',
        '10 Akun Sales & CS (Seats)',
        '3 Nomor WhatsApp Official Terhubung',
        'Otomatisasi Alur Kerja & Notifikasi H+1',
        'Pelacakan Konversi Meta Ads & Google',
        'Catatan Internal & Template Pesan Tim',
        'Laporan Performa Agent & Response Time',
        'Dukungan Prioritas WhatsApp Langsung',
      ],
      popular: true,
      ctaText: 'Mulai Uji Coba Gratis',
    },
    {
      name: 'Enterprise',
      badge: 'Perusahaan Skala Besar',
      monthlyPrice: 1999000,
      annualPrice: 1599000,
      description: 'Kapasitas maksimal, integrasi webhook custom, dan SLA keamanan untuk korporasi.',
      features: [
        'Hingga 25.000 Database Leads',
        '30 Akun Sales & CS (Seats)',
        '10 Nomor WhatsApp Terhubung',
        'Custom Webhook & Rest API Full Access',
        'Multi-Tenant Workspace Khusus Divisi',
        'Dedicated Account Manager di Jakarta',
        'Custom Roles & Audit Log Keamanan',
        'Pelatihan Tim Penjualan On-Site/Zoom',
      ],
      popular: false,
      ctaText: 'Hubungi Tim Penjualan',
    },
  ];

  const faqs = [
    {
      q: 'Bagaimana InkaCRM mengintegrasikan nomor WhatsApp bisnis kami?',
      a: 'InkaCRM menyediakan arsitektur multi-provider yang kompatibel dengan WhatsApp Business Platform resmi (Meta Cloud API) maupun provider pihak ketiga. Anda dapat menghubungkan nomor Anda via QR scan atau konfigurasi API token sehingga seluruh tim customer service dan sales dapat membalas pesan dari satu inbox bersama.',
    },
    {
      q: 'Apakah InkaCRM mendukung pembagian prospek (Round Robin) otomatis?',
      a: 'Ya, sistem otomatisasi InkaCRM membagi setiap leads baru (dari Facebook Ads, Google Ads, atau website form) secara bergiliran dan adil ke agent yang sedang aktif/online tanpa perlu pembagian manual.',
    },
    {
      q: 'Bagaimana keamanan data pelanggan antar organisasi (Multi-Tenancy)?',
      a: 'InkaCRM dirancang dengan standar keamanan enterprise. Setiap organisasi memiliki tenant_id terisolasi secara ketat di layer backend dan database sehingga data prospek perusahaan Anda tidak akan pernah bocor ke pengguna lain.',
    },
    {
      q: 'Apakah saya bisa memindahkan data prospek lama dari Excel atau spreadsheet?',
      a: 'Sangat mudah! InkaCRM memiliki fitur Impor CSV & Excel satu klik yang dapat memetakan kolom nama, nomor WhatsApp, email, dan nilai transaksi secara instan.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Header strictly adhering to Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between gap-8">
        <a href="#hero" className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            I
          </div>
          <span>Inka<span className="text-emerald-600 dark:text-emerald-400">CRM</span></span>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
          <a href="#fitur" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">Fitur Utama</a>
          <a href="#harga" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">Paket & Harga</a>
          <a href="#solusi" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">Solusi Bisnis</a>
          <a href="#testimoni" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">Testimoni</a>
          <a href="#faq" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">FAQ</a>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onEnterApp}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0"
          >
            Buka Dashboard Demo
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="pt-16 pb-20 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Platform CRM & Sales WhatsApp Terintegrasi Indonesia</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6 text-balance">
              Ubah Percakapan WhatsApp & Leads Tersebar Menjadi Penjualan Terukur.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-xl">
              Hentikan hilangnya prospek di spreadsheet dan chat pribadi. InkaCRM memusatkan database pelanggan, membagi leads secara otomatis via Round-Robin, dan mempercepat closing penjualan tim Anda.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10">
              <button
                onClick={onEnterApp}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Coba Dashboard InkaCRM Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#fitur"
                className="px-6 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm rounded-lg transition-colors text-center"
              >
                Pelajari Fitur Lengkap
              </a>
            </div>

            {/* Proof Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
              <div>
                <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  10.000+
                </div>
                <div className="text-xs">Leads Terkelola / Hari</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  99.8%
                </div>
                <div className="text-xs">Uptime WhatsApp Gateway</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  +3.8x
                </div>
                <div className="text-xs">Kenaikan Konversi Closing</div>
              </div>
            </div>
          </div>

          {/* Hero Visual Asset */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900">
              <img
                src={ASSET_IMAGES.hero}
                alt="InkaCRM Sales Performance Overview Dashboard"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="text-sm font-semibold">Tampilan Dashboard Multi-Tenant InkaCRM</div>
                  <div className="text-xs text-slate-200">Visibilitas pipeline real-time, funnel penjualan, dan multi-agent chat WhatsApp</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Feature Deep-Dive Section */}
      <section id="fitur" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              Sistem Operasional Terpadu
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Semua yang Dibutuhkan Tim Penjualan untuk Meningkatkan Omzet
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Dari manajemen prospek iklan hingga closing di WhatsApp, kendalikan seluruh alur bisnis Anda dalam satu platform yang mudah digunakan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-emerald-500/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                Unified WhatsApp Multi-Agent
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Satu nomor WhatsApp bisnis dapat diakses bersamaan oleh puluhan staf CS & Sales. Dilengkapi template cepat dan catatan internal rahasia.
              </p>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Respon lebih cepat, tanpa rebutan chat.
              </div>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-emerald-500/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                <GitPullRequest className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                Sales Pipeline Kanban
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Visualisasikan perjalanan prospek dari tahap kualifikasi, proposal terkirim, negosiasi, hingga deal dimenangkan dengan sistem kartu seret-lepas.
              </p>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Prakiraan nilai closing akurat per tahapan.
              </div>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-emerald-500/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                Otomatisasi Round-Robin
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Leads baru dari Meta Ads, Google Ads, atau Web otomatis dibagikan secara adil dan merata ke sales rep yang online tanpa intervensi manual.
              </p>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Tidak ada prospek yang terbengkalai.
              </div>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-emerald-500/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                Analitik ROI & Kinerja Tim
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Pantau sumber kampanye mana yang paling menguntungkan serta leaderboard performa agen berdasarkan nilai penjualan dan kecepatan balas pesan.
              </p>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Keputusan berbasis data nyata, bukan asumsi.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="harga" className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
            Investasi Transparan
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Pilihan Paket Berlangganan Fleksibel
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-8">
            Tanpa biaya instalasi tersembunyi. Tingkatkan atau turunkan paket kapan saja sesuai pertumbuhan operasional bisnis Anda.
          </p>

          {/* Monthly vs Annual Toggle */}
          <div className="inline-flex items-center gap-2 p-1.5 bg-slate-200/70 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tagihan Bulanan
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Tagihan Tahunan</span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded">
                Hemat {discountPercent}%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
            return (
              <div
                key={plan.name}
                className={`flex flex-col justify-between p-8 rounded-2xl transition-all ${
                  plan.popular
                    ? 'bg-white dark:bg-slate-900 border-2 border-emerald-600 shadow-xl relative'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 min-h-[32px]">
                    {plan.description}
                  </p>

                  <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
                        {formatIDR(price)}
                      </span>
                      <span className="text-xs text-slate-500">/ bulan</span>
                    </div>
                    {billingCycle === 'annual' && (
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                        Ditagih tahunan {formatIDR(price * 12)} / tahun
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                      Fitur Termasuk:
                    </div>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onEnterApp}
                  className={`w-full py-3 rounded-lg text-xs font-semibold transition-all ${
                    plan.popular
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {plan.ctaText}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Solutions / Use Cases */}
      <section id="solusi" className="py-20 bg-slate-100/60 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              Solusi Vertikal Industri
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Dirancang untuk Ekosistem Bisnis Indonesia
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Sesuai kebiasaan konsumen lokal yang 90% mengandalkan WhatsApp untuk negosiasi & transaksi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Distributor & Suplai B2B</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                Kelola pesanan repeat order, riwayat penawaran tempo (TOP), dan jadwal follow-up berkala ke ratusan toko ritel mitra.
              </p>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Contoh: PT Nusantara Niaga</div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Retail & Online Shop</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                Multi-agent WhatsApp untuk menangani ribuan chat saat promo live/iklan tanpa ada pembeli potensial yang tidak terbalas.
              </p>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Contoh: Toko Berkah Mandiri</div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Digital Marketing Agency</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                Tunjukkan bukti nilai riil konversi dari kampanye iklan Meta & Google langsung ke pipeline closing klien Anda.
              </p>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Contoh: Agensi Sinergi Kreatif</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section with Indonesian Founders */}
      <section id="testimoni" className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
            Kisah Sukses Nyata
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Dipercaya Pengusaha & Manajer Penjualan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <blockquote className="text-sm text-slate-700 dark:text-slate-300 italic mb-6 leading-relaxed">
              "Sebelum menggunakan InkaCRM, leads iklan Meta kami sering tercecer karena sales membagi nomor kontak secara manual di grup WhatsApp. Dengan Round-Robin otomatis dan Kanban Pipeline, closing rate kami melonjak hingga 45% dalam 2 bulan pertama."
            </blockquote>
            <div className="flex items-center gap-3">
              <img
                src={ASSET_IMAGES.leadBudi}
                alt="Budi Hartono"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Budi Hartono</div>
                <div className="text-xs text-slate-500">Managing Director, PT Nusantara Niaga</div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <blockquote className="text-sm text-slate-700 dark:text-slate-300 italic mb-6 leading-relaxed">
              "Fitur multi-agent WhatsApp dan template pesan InkaCRM sangat membantu tim CS kami. Rata-rata waktu respon pelanggan turun dari 25 menit menjadi di bawah 3 menit. Sangat direkomendasikan untuk pemilik bisnis online di Indonesia."
            </blockquote>
            <div className="flex items-center gap-3">
              <img
                src={ASSET_IMAGES.agentSiti}
                alt="Siti Rahmawati"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Siti Rahmawati</div>
                <div className="text-xs text-slate-500">Head of Customer Support, Berkah Group</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              Pertanyaan Umum
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Kerap Ditanyakan Seputar InkaCRM
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950/60"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-slate-900 dark:text-white transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/50 dark:border-slate-800/50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 px-6 bg-emerald-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">
            Mulai Transformasi Penjualan Bisnis Anda Hari Ini
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base mb-8">
            Daftar sekarang dan nikmati akses penuh ke seluruh fitur InkaCRM selama 14 hari tanpa kartu kredit.
          </p>
          <button
            onClick={onEnterApp}
            className="px-8 py-4 bg-white text-emerald-900 hover:bg-slate-100 font-bold text-sm rounded-lg shadow-lg transition-transform hover:scale-105"
          >
            Masuk ke Aplikasi InkaCRM
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-slate-900 text-slate-400 text-xs px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-white font-semibold">
            <div className="w-6 h-6 rounded bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              I
            </div>
            <span>InkaCRM Indonesia</span>
          </div>

          <div className="text-center md:text-left text-slate-500">
            © 2026 InkaCRM. Platform CRM & Sales Management B2B Multi-Tenant.
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <button onClick={onEnterApp} className="hover:text-white transition-colors">
              Login Pengguna
            </button>
            <a href="#harga" className="hover:text-white transition-colors">
              Paket Berlangganan
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              Bantuan & Panduan
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
