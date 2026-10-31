'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BRANCH_UNITS,
  CLUB_UNITS,
  EVENT_ITEMS,
  FACULTY_METADATA,
  NEWS_POSTS,
  OFFICIAL_DOCUMENTS,
} from '@/data/mock-data';
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  ChevronRight,
  Leaf,
  MapPin,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 'slide-term2',
    kicker: 'ĐẠI HỘI II • NHIỆM KỲ 2026 – 2028',
    title: 'HỘI SINH VIÊN VIỆT NAM TRƯỜNG ĐẠI HỌC QUỐC TẾ MIỀN ĐÔNG',
    subtitle:
      'Cổng thông tin Điện tử, Sổ tay Hội viên Số & Hệ thống Điều hành E-Office chính thức của Ban Chấp hành Hội Sinh viên trường Khóa II.',
    primaryCta: { label: 'Sơ đồ Tổ chức 3 Cấp', href: '/gioi-thieu?tab=chart' },
    secondaryCta: { label: '25 Chi hội & 30 CLB', href: '/to-chuc' },
    metricLabel: 'BỘ MÁY CHỦ CHỐT',
    metricValue: '15 BCH • 05 BTK • 05 BKT',
  },
  {
    id: 'slide-sv5t',
    kicker: 'QUYẾT ĐỊNH 09/QĐ-HSV • SỬA ĐỔI NĂM 2026',
    title: 'PHONG TRÀO SINH VIÊN 5 TỐT & TẬP THỂ SINH VIÊN 5 TỐT',
    subtitle:
      'Chuẩn hóa Học tập tốt GPA ≥ 3.00/4.00 (lấy điểm cao hơn giữa năm học gia quyền và tích lũy), xét duyệt điện tử 3 cấp và vinh danh Top 10% Tiêu biểu toàn trường.',
    primaryCta: { label: 'Mở Sổ tay SV5T Số', href: '/portal?tab=sv5t' },
    secondaryCta: { label: 'Tính GPA Quý EIU', href: '/portal?tab=gpa' },
    metricLabel: 'CHUẨN HỌC TẬP 2026',
    metricValue: 'MAX(GPA) ≥ 3.00 / 4.00',
  },
  {
    id: 'slide-ecert',
    kicker: 'QUYẾT ĐỊNH 28/QĐ-HSV • UN SDGs GREEN EVENT',
    title: 'GIẤY CHỨNG NHẬN ĐIỆN TỬ QR & CAM KẾT SỰ KIỆN XANH EIU',
    subtitle:
      'Thẩm định ngày tình nguyện trước 03 ngày, xuất danh sách Phụ lục 1 tăng dần MSSV, cấp Quyết định trong SLA 07 ngày làm việc và 100% sự kiện không chai nhựa một lần.',
    primaryCta: { label: 'Tra cứu E-Certificate', href: '/tra-cuu-gcn' },
    secondaryCta: { label: 'Đăng ký Sự kiện 1-Chạm', href: '/su-kien' },
    metricLabel: 'CAM KẾT SLA PHÁP LÝ',
    metricValue: '≤ 07 NGÀY LÀM VIỆC',
  },
];

const SV5T_PILLARS_2026 = [
  {
    num: '01',
    title: 'Đạo đức tốt',
    threshold: 'ĐRL ≥ 80 / 100',
    desc: 'Không vi phạm pháp luật, quy chế + đạt ≥ 01 tiêu chí phụ (môn chính trị ≥ 3.2, thi tìm hiểu Mác-Lênin/HCM...).',
    accent: 'border-t-[#133F68]',
  },
  {
    num: '02',
    title: 'Học tập tốt',
    threshold: 'GPA ≥ 3.00 / 4.00',
    desc: 'Ưu tiên lấy MAX(GPA năm học gia quyền, GPA tích lũy) + ≥ 01 tiêu chí phụ (NCKH, thi học thuật, CLB học thuật).',
    accent: 'border-t-[#0054A6]',
  },
  {
    num: '03',
    title: 'Thể lực tốt',
    threshold: '03 GDTC + SV Khỏe',
    desc: 'Hoàn thành 03 môn GDTC + đạt "Sinh viên khỏe" (Phụ lục 1) hoặc rèn luyện định kỳ tại CLB thể thao.',
    accent: 'border-t-[#EEB31D]',
  },
  {
    num: '04',
    title: 'Tình nguyện tốt',
    threshold: '≥ 5.0 Ngày TN/năm',
    desc: 'Cộng dồn theo Phụ lục 2 + tham gia hiến máu tình nguyện (5.0 ngày/lần) hoặc hoạt động tích cực CLB CTXH.',
    accent: 'border-t-[#51803A]',
  },
  {
    num: '05',
    title: 'Hội nhập tốt',
    threshold: 'Kỹ năng PL3 + Ngoại ngữ',
    desc: 'Hoàn thành ≥ 01 khóa kỹ năng Phụ lục 3 (hoặc khen thưởng Đoàn–Hội) + hoạt động hội nhập + ngoại ngữ B/IELTS ≥ 6.0.',
    accent: 'border-t-[#C10230]',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [heroIdx, setHeroIdx] = useState(0);
  const [newsTab, setNewsTab] = useState<'NEWS' | 'EVENTS'>('NEWS');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchScope, setSearchScope] = useState<
    'ALL' | 'CERT' | 'UNITS' | 'DOCS' | 'NEWS'
  >('ALL');

  const activeSlide = HERO_SLIDES[heroIdx];
  const featuredNews = NEWS_POSTS[0];
  const secondaryNews = NEWS_POSTS.slice(1, 4);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();

    if (searchScope === 'CERT') {
      router.push(q ? `/tra-cuu-gcn?q=${encodeURIComponent(q)}` : '/tra-cuu-gcn');
      return;
    }
    if (searchScope === 'UNITS') {
      router.push(q ? `/to-chuc?q=${encodeURIComponent(q)}` : '/to-chuc');
      return;
    }
    if (searchScope === 'DOCS') {
      router.push(q ? `/van-ban?q=${encodeURIComponent(q)}` : '/van-ban');
      return;
    }
    if (searchScope === 'NEWS') {
      router.push(q ? `/tin-tuc?q=${encodeURIComponent(q)}` : '/tin-tuc');
      return;
    }

    // Chế độ Tất cả phân hệ: Tự động nhận diện MSSV / Số Quyết định / Mã Chi hội
    if (!q) {
      router.push('/tra-cuu-gcn');
      return;
    }
    if (
      /^\d{6,10}$/.test(q) ||
      q.toUpperCase().includes('GCN') ||
      q.toUpperCase().includes('32/QĐ')
    ) {
      router.push(`/tra-cuu-gcn?q=${encodeURIComponent(q)}`);
    } else if (
      q.toUpperCase().includes('QĐ-HSV') ||
      q.toUpperCase().includes('TB-HSV')
    ) {
      router.push(`/van-ban?doc=${encodeURIComponent(q)}`);
    } else if (
      /^\d{2}(CNTT|QTKD|KT|KHSK)/i.test(q) ||
      q.toLowerCase().includes('clb') ||
      q.toLowerCase().includes('chi hội')
    ) {
      router.push(`/to-chuc?q=${encodeURIComponent(q)}`);
    } else {
      router.push(`/tin-tuc?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <div className="bg-[#F5F5F5]">
      {/* =====================================================================
          PHÂN VÙNG 1: FLAGSHIP HERO 3 TIÊU ĐIỂM + DẢI 04 CHỈ SỐ QUY MÔ KHÓA II
         ===================================================================== */}
      <section
        aria-label="Tiêu điểm Cổng thông tin HSV EIU"
        className="bg-[#02294E] relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              'radial-gradient(circle at 78% 35%, #A68556 0%, transparent 52%), linear-gradient(125deg, #02294E 0%, #133F68 58%, #0054A6 100%)',
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 eiu-arch-pattern" aria-hidden="true" />

        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-11 lg:py-15 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Cột Trái (7/12): Khối đa giác nghiêng #C10230 chuẩn EIU + Cặp nút CTA */}
          <div className="lg:col-span-7 space-y-5">
            <div
              className="bg-[#C10230]/95 text-white p-7 sm:p-9 shadow-lg"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 91% 100%, 0% 100%)',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-0.5 bg-white" aria-hidden="true" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#FCB900]">
                  {activeSlide.kicker}
                </span>
              </div>
              <h1 className="text-2xl sm:text-[29px] font-extrabold tracking-tight leading-snug font-eiu-display pr-6">
                {activeSlide.title}
              </h1>
              <p className="text-sm text-white/95 mt-3 pr-8 leading-relaxed">
                {activeSlide.subtitle}
              </p>
            </div>

            {/* Cặp nút CTA + Bộ chuyển Slide 01 / 02 / 03 */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={activeSlide.primaryCta.href}
                  className="px-5 py-2.5 bg-[#A68556] hover:bg-[#8e7046] text-white text-xs font-bold uppercase tracking-wider rounded inline-flex items-center gap-2 font-eiu-display transition-colors"
                >
                  <span>{activeSlide.primaryCta.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={activeSlide.secondaryCta.href}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-wider rounded inline-flex items-center gap-1.5 font-eiu-display transition-colors"
                >
                  <span>{activeSlide.secondaryCta.label}</span>
                </Link>
              </div>

              <div
                role="tablist"
                aria-label="Chọn tiêu điểm nhiệm kỳ"
                className="flex items-center gap-1.5"
              >
                {HERO_SLIDES.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={heroIdx === idx}
                    aria-label={`Tiêu điểm 0${idx + 1}`}
                    onClick={() => setHeroIdx(idx)}
                    className={`h-8 px-3 font-mono text-xs font-bold transition-colors cursor-pointer ${
                      heroIdx === idx
                        ? 'bg-[#FCB900] text-[#02294E]'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    0{idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cột Phải (5/12): Khối Biểu trưng EIU × Đại hội II + Chỉ số Tiêu điểm */}
          <div className="lg:col-span-5">
            <div className="bg-white border-t-4 border-[#A68556] shadow-xl">
              <div className="p-6 sm:p-7 flex items-center justify-center gap-6">
                <img
                  src="/images/eiu-logo-full.png"
                  alt="Trường Đại học Quốc tế Miền Đông"
                  className="h-22 sm:h-25 w-auto object-contain"
                />
                <div className="h-20 w-px bg-slate-200" aria-hidden="true" />
                <img
                  src="/images/hsv-bch-dh2.png"
                  alt="Biểu trưng Đại hội II Hội Sinh viên EIU (2026 - 2028)"
                  className="h-22 sm:h-25 w-auto object-contain"
                />
              </div>
              <div className="bg-[#133F68] text-white px-6 py-3.5 flex items-center justify-between border-t border-slate-100">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#DED1BE]">
                  {activeSlide.metricLabel}
                </span>
                <span className="text-xs sm:text-sm font-mono font-extrabold text-[#00BCFF]">
                  {activeSlide.metricValue}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dải 04 Chỉ số Quy mô Tổ chức trên nền trắng sắc nét */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-[1140px] mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            {[
              {
                label: 'LÃNH ĐẠO & GIÁM SÁT',
                value: '15 BCH • 05 BKT',
                sub: '05 đ/c Thường trực Ban Thư ký',
                href: '/gioi-thieu?tab=bch',
              },
              {
                label: 'KHỐI BAN CHUYÊN MÔN',
                value: '03 Đơn vị Cấp Trường',
                sub: 'Văn phòng 206.B06 • TC-XDH • TG-PT',
                href: '/gioi-thieu?tab=vp',
              },
              {
                label: 'HỆ THỐNG CHI HỘI',
                value: `${BRANCH_UNITS.length} Chi hội Sinh viên`,
                sub: '04 Cụm Khoa • 06 Cụm Khóa (K21–K26)',
                href: '/to-chuc?tab=branches',
              },
              {
                label: 'CLB – ĐỘI – NHÓM',
                value: `${CLUB_UNITS.length} Đơn vị Trực thuộc`,
                sub: 'Học thuật • Nghệ thuật • Thể thao • Cộng đồng',
                href: '/to-chuc?tab=clubs',
              },
            ].map((stat) => (
              <Link
                key={stat.label}
                href={stat.href}
                className="py-4 px-4 hover:bg-[#F5F5F5] transition-colors group block"
              >
                <div className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#A68556]">
                  {stat.label}
                </div>
                <div className="text-base font-extrabold text-[#133F68] group-hover:text-[#0054A6] font-eiu-display mt-0.5">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">{stat.sub}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          PHÂN VÙNG 2: TRUNG TÂM TRA CỨU THÔNG MINH ĐA PHÂN HỆ (NỀN #FFFFFF)
         ===================================================================== */}
      <section
        aria-labelledby="smart-lookup-heading"
        className="bg-white py-10 border-b border-slate-200"
      >
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 space-y-5">
          <div className="text-center space-y-1">
            <h2
              id="smart-lookup-heading"
              className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display"
            >
              TRUNG TÂM TRA CỨU THÔNG TIN &amp; XÁC THỰC E-CERTIFICATE
            </h2>
            <p className="text-sm text-slate-600">
              Tra cứu trực tuyến Giấy chứng nhận theo MSSV 10 số, Danh sách Phụ lục 1 theo Số Quyết định, Văn bản pháp lý hoặc Danh bạ cơ sở Hội
            </p>
          </div>

          <div className="bg-[#EFEFEF] p-3.5 max-w-4xl mx-auto border border-slate-200">
            <form
              onSubmit={handleQuickSearch}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2.5"
            >
              <label htmlFor="quick-search-input" className="sr-only">
                Nhập mã số sinh viên, số quyết định hoặc tên đơn vị
              </label>
              <div className="sm:col-span-7 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="quick-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nhập MSSV (VD: 2331200066), Số QĐ (32/QĐ-HSV) hoặc tên CLB/Chi hội..."
                  className="w-full h-10 pl-10 pr-3.5 bg-white border border-slate-300 text-sm text-slate-900 rounded"
                />
              </div>

              <label htmlFor="quick-search-scope" className="sr-only">
                Phạm vi tra cứu
              </label>
              <select
                id="quick-search-scope"
                value={searchScope}
                onChange={(e) =>
                  setSearchScope(
                    e.target.value as 'ALL' | 'CERT' | 'UNITS' | 'DOCS' | 'NEWS'
                  )
                }
                className="sm:col-span-3 h-10 px-3 bg-white border border-slate-300 text-sm font-medium text-slate-800 rounded"
              >
                <option value="ALL">Tự động nhận diện</option>
                <option value="CERT">E-Certificate (QĐ 28)</option>
                <option value="UNITS">25 Chi hội &amp; 30 CLB</option>
                <option value="DOCS">Văn bản Pháp lý</option>
                <option value="NEWS">Tin tức Phong trào</option>
              </select>

              <button
                type="submit"
                className="sm:col-span-2 h-10 bg-[#A68556] hover:bg-[#8e7046] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer font-eiu-display"
              >
                Tra cứu
              </button>
            </form>
          </div>

          {/* Hàng lối tắt viên thuốc chuẩn lib.eiu.edu.vn */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            {[
              { label: 'Thử tra cứu MSSV: 2331200066', href: '/tra-cuu-gcn?q=2331200066' },
              { label: 'Xem Phụ lục 1: 32/QĐ-HSV', href: '/tra-cuu-gcn?q=32/QĐ-HSV' },
              { label: 'Sổ tay Sinh viên 5 Tốt', href: '/portal?tab=sv5t' },
              { label: 'Thi Trắc nghiệm Online', href: '/portal?tab=quiz' },
              { label: '30 CLB – Đội – Nhóm', href: '/to-chuc?tab=clubs' },
              { label: '25 Chi hội (04 Khoa)', href: '/to-chuc?tab=branches' },
            ].map((pill) => (
              <Link
                key={pill.label}
                href={pill.href}
                className="px-4 py-1.5 rounded-full border border-[#133F68] text-xs font-semibold text-[#133F68] hover:bg-[#133F68] hover:text-white transition-colors"
              >
                {pill.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          PHÂN VÙNG 3: TIN TỨC & SỰ KIỆN TRỌNG ĐIỂM (NỀN #F5F5F5 — ƯU TIÊN SỐ 1)
         ===================================================================== */}
      <section aria-labelledby="news-events-heading" className="py-13 bg-[#F5F5F5]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 space-y-7">
          <div className="text-center space-y-3">
            <h2
              id="news-events-heading"
              className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display"
            >
              TIN TỨC PHONG TRÀO &amp; LỊCH SỰ KIỆN SINH VIÊN
            </h2>

            {/* Cặp nút Pill Đỏ #C10230 / Trắng viền #133F68 chuẩn eiu.edu.vn */}
            <div
              role="tablist"
              aria-label="Chuyển đổi Tin tức và Sự kiện"
              className="flex items-center justify-center gap-3 pt-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={newsTab === 'NEWS'}
                onClick={() => setNewsTab('NEWS')}
                className={`min-w-36 py-2 px-6 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer font-eiu-display ${
                  newsTab === 'NEWS'
                    ? 'bg-[#C10230] text-white border border-[#C10230]'
                    : 'bg-white text-[#133F68] border border-[#133F68] hover:bg-slate-100'
                }`}
              >
                TIN TỨC ({NEWS_POSTS.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={newsTab === 'EVENTS'}
                onClick={() => setNewsTab('EVENTS')}
                className={`min-w-36 py-2 px-6 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer font-eiu-display ${
                  newsTab === 'EVENTS'
                    ? 'bg-[#C10230] text-white border border-[#C10230]'
                    : 'bg-white text-[#133F68] border border-[#133F68] hover:bg-slate-100'
                }`}
              >
                SỰ KIỆN ({EVENT_ITEMS.length})
              </button>
            </div>
          </div>

          {newsTab === 'NEWS' ? (
            <div className="space-y-5">
              {/* Bài viết Tiêu điểm 50/50 chuẩn Bento Editorial của eiu.edu.vn */}
              <article className="grid grid-cols-1 lg:grid-cols-12 bg-white border border-slate-200/90 shadow-2xs">
                <div className="lg:col-span-5 bg-[#133F68] eiu-arch-pattern text-white p-7 flex flex-col justify-between gap-6 relative">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-[#00BCFF] text-[#02294E] text-[11px] font-bold uppercase tracking-wider font-eiu-display">
                      {featuredNews.categoryLabel}
                    </span>
                    {featuredNews.relatedDocNumber && (
                      <span className="font-mono text-xs font-bold text-[#FCB900]">
                        {featuredNews.relatedDocNumber}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] font-mono uppercase tracking-widest text-[#DED1BE]">
                      TIÊU ĐIỂM NHIỆM KỲ KHÓA II
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                      GPA ≥ 3.00 / 4.00
                    </div>
                    <p className="text-xs text-[#DED1BE]">
                      Xét duyệt 3 cấp • Tự động lấy MAX(GPA năm học, GPA tích lũy)
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-white/80 pt-3 border-t border-white/15">
                    <span>{featuredNews.authorUnit}</span>
                    <span className="font-mono text-[#FCB900]">
                      {featuredNews.publishedAt}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-7 p-7 flex flex-col justify-between gap-5">
                  <div className="space-y-3">
                    <Link
                      href={`/tin-tuc/${featuredNews.slug}`}
                      className="block group"
                    >
                      <h3 className="text-lg sm:text-xl font-bold text-[#133F68] group-hover:text-[#C10230] transition-colors leading-snug font-eiu-display">
                        {featuredNews.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {featuredNews.summary}
                    </p>
                    {featuredNews.leadQuote && (
                      <blockquote className="border-l-3 border-[#A68556] pl-3.5 text-[13px] italic text-slate-700">
                        &ldquo;{featuredNews.leadQuote}&rdquo;
                      </blockquote>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <Link
                      href={`/tin-tuc/${featuredNews.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0054A6] hover:text-[#C10230] font-eiu-display"
                    >
                      <ChevronRight className="w-4 h-4" />
                      <span>ĐỌC TOÀN VĂN BÀI VIẾT</span>
                    </Link>
                    <span className="text-xs text-slate-500 font-mono">
                      {featuredNews.viewCount.toLocaleString('vi-VN')} lượt xem •{' '}
                      {featuredNews.readMinutes || 4} phút đọc
                    </span>
                  </div>
                </div>
              </article>

              {/* Lưới 3 Thẻ Tin tức tiếp theo chuẩn post-5065.css (Không lặp tiêu đề!) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {secondaryNews.map((post, idx) => {
                  const headerColors = [
                    'bg-[#144069]',
                    'bg-[#0054A6]',
                    'bg-[#51803A]',
                  ];
                  return (
                    <article
                      key={post.id}
                      className="bg-white border border-slate-200/90 hover:border-[#133F68] transition-colors flex flex-col justify-between group"
                    >
                      {/* Architectural Graphic Header — KHÔNG lặp lại tiêu đề bài viết */}
                      <Link
                        href={`/tin-tuc/${post.slug}`}
                        className={`h-36 ${headerColors[idx % headerColors.length]} eiu-arch-pattern text-white p-5 flex flex-col justify-between`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 bg-[#00BCFF] text-[#02294E] text-[10.5px] font-bold uppercase tracking-wider font-eiu-display">
                            {post.categoryLabel}
                          </span>
                          <img
                            src="/images/hsv-logo.png"
                            alt=""
                            className="w-7 h-7 object-contain opacity-90"
                          />
                        </div>
                        <div className="flex items-end justify-between">
                          <span className="text-xs text-white/90 font-medium">
                            {post.authorUnit}
                          </span>
                          {post.relatedDocNumber && (
                            <span className="font-mono text-xs font-bold text-[#FCB900]">
                              {post.relatedDocNumber}
                            </span>
                          )}
                        </div>
                      </Link>

                      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                        <div className="space-y-2">
                          <Link href={`/tin-tuc/${post.slug}`}>
                            <h3 className="text-[15.5px] font-bold text-[#133F68] group-hover:text-[#C10230] transition-colors leading-snug line-clamp-2 font-eiu-display">
                              {post.title}
                            </h3>
                          </Link>
                          <p className="text-[13.5px] text-slate-600 leading-relaxed line-clamp-2">
                            {post.summary}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <Link
                            href={`/tin-tuc/${post.slug}`}
                            className="inline-flex items-center gap-1 font-bold uppercase text-[#0054A6] hover:text-[#C10230] font-eiu-display"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                            <span>XEM CHI TIẾT</span>
                          </Link>
                          <span className="font-mono text-[#A68556] font-semibold">
                            {post.publishedAt}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Lưới 3 Sự kiện với Trạng thái Vòng đời QĐ 28 chính xác */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {EVENT_ITEMS.slice(0, 3).map((ev) => {
                const startDate = new Date(ev.startTime);
                const dayStr = String(startDate.getDate()).padStart(2, '0');
                const monthStr = `TH${startDate.getMonth() + 1}`;
                const fillPct = Math.min(
                  100,
                  Math.round((ev.registeredCount / ev.maxParticipants) * 100)
                );
                const isOpen = ev.certWorkflowStatus === 'upcoming';

                return (
                  <article
                    key={ev.id}
                    className="bg-white border border-slate-200/90 hover:border-[#133F68] transition-colors flex flex-col justify-between"
                  >
                    <div className="h-38 bg-[#02294E] eiu-arch-pattern text-white p-5 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div className="bg-white text-[#133F68] px-2.5 py-1 text-center leading-tight shrink-0">
                          <div className="text-base font-extrabold font-mono">
                            {dayStr}
                          </div>
                          <div className="text-[10px] font-bold uppercase text-[#C10230]">
                            {monthStr}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#FCB900] text-[#02294E]">
                            +{ev.baseVolunteerDays.toFixed(1)} NGÀY TN
                          </span>
                          {ev.isGreenEvent && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 bg-[#51803A] text-white">
                              <Leaf className="w-3 h-3" />
                              <span>Sự kiện Xanh SDGs</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#00BCFF] font-semibold">
                          Tiêu chuẩn: {ev.sv5tCriterion}
                        </span>
                        <span className="text-[#DED1BE] font-mono text-[11px]">
                          {isOpen ? 'ĐANG MỞ ĐK' : ev.decisionNumber || 'SLA 07 NGÀY'}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="text-[15.5px] font-bold text-[#133F68] leading-snug line-clamp-2 font-eiu-display">
                          {ev.title}
                        </h3>
                        <p className="text-xs text-slate-600 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#A68556] shrink-0" />
                          <span className="line-clamp-1">{ev.location}</span>
                        </p>
                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-[11px] text-slate-600 font-mono">
                            <span>Đăng ký: {ev.registeredCount}/{ev.maxParticipants}</span>
                            <span>{fillPct}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-200 overflow-hidden">
                            <div
                              className="h-full bg-[#0054A6]"
                              style={{ width: `${fillPct}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <Link
                          href={`/su-kien?event=${encodeURIComponent(ev.id)}`}
                          className="inline-flex items-center gap-1 font-bold uppercase text-[#0054A6] hover:text-[#C10230] font-eiu-display"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                          <span>{isOpen ? 'ĐĂNG KÝ 1-CHẠM' : 'XEM TIẾN ĐỘ GCN'}</span>
                        </Link>
                        <span className="text-slate-500 text-[11px] truncate max-w-[130px]">
                          {ev.organizerCode}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div className="flex justify-end">
            <Link
              href={newsTab === 'NEWS' ? '/tin-tuc' : '/su-kien'}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#133F68] hover:text-[#C10230] font-eiu-display"
            >
              <ChevronRight className="w-4 h-4" />
              <span>
                {newsTab === 'NEWS'
                  ? `XEM CHUYÊN TRANG TIN TỨC (${NEWS_POSTS.length} BÀI VIẾT)`
                  : `XEM TOÀN BỘ LỊCH SỰ KIỆN (${EVENT_ITEMS.length} CHƯƠNG TRÌNH)`}
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          PHÂN VÙNG 4: PHONG TRÀO SINH VIÊN 5 TỐT — BENTO 5 TIÊU CHUẨN QĐ 09/2026 (NỀN #FFFFFF)
         ===================================================================== */}
      <section
        aria-labelledby="sv5t-section-title"
        className="py-13 bg-white border-t border-b border-slate-200"
      >
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 space-y-7">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#A68556]">
                QUYẾT ĐỊNH 09/QĐ-HSV (SỬA ĐỔI, BỔ SUNG NĂM 2026)
              </div>
              <h2
                id="sv5t-section-title"
                className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display mt-1"
              >
                PHONG TRÀO SINH VIÊN 5 TỐT &amp; TẬP THỂ SINH VIÊN 5 TỐT
              </h2>
            </div>
            <Link
              href="/portal?tab=sv5t"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0054A6] hover:text-[#C10230] font-eiu-display"
            >
              <span>TỰ ĐÁNH GIÁ HỒ SƠ CÁ NHÂN</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Hàng 1: 2 Thẻ Ghép Đôi 50/50 chuẩn Bento Tuyển sinh eiu.edu.vn (#B44625 & #51803A) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 bg-[#F5F5F5] border border-slate-200">
              <div className="bg-[#B44625] text-white p-6 flex flex-col justify-between gap-5">
                <div className="space-y-2">
                  <span className="text-[10.5px] font-mono uppercase tracking-widest text-white/80">
                    DANH HIỆU CÁ NHÂN
                  </span>
                  <h3 className="text-lg font-bold font-eiu-display">
                    Sinh viên 5 Tốt &amp; Tiêu biểu Toàn trường
                  </h3>
                  <p className="text-[13px] text-white/95 leading-relaxed">
                    Xét duyệt 3 cấp điện tử (Cơ sở → Ban Chuyên môn → Thường trực Hội) ngay trên Sổ tay Hội viên.
                  </p>
                </div>
                <Link
                  href="/portal?tab=gpa"
                  className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white hover:text-[#FCB900] font-eiu-display"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span>MÁY TÍNH GPA QUÝ EIU</span>
                </Link>
              </div>
              <div className="p-6 flex flex-col justify-center bg-white space-y-2">
                <div className="text-3xl font-extrabold font-mono text-[#B44625]">
                  Top 10%
                </div>
                <div className="text-sm font-bold text-[#133F68] font-eiu-display">
                  SV5T Tiêu biểu Toàn trường
                </div>
                <p className="text-[13px] text-slate-600 leading-relaxed">
                  Đạt chuẩn SV5T + ≥ 02 tiêu chí phụ ở 4 tiêu chuẩn + tiêu chí ưu tiên Tình nguyện (tối đa 10%).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 bg-[#F5F5F5] border border-slate-200">
              <div className="bg-[#51803A] text-white p-6 flex flex-col justify-between gap-5">
                <div className="space-y-2">
                  <span className="text-[10.5px] font-mono uppercase tracking-widest text-white/80">
                    DANH HIỆU TẬP THỂ
                  </span>
                  <h3 className="text-lg font-bold font-eiu-display">
                    Tập thể Sinh viên 5 Tốt Cấp Trường
                  </h3>
                  <p className="text-[13px] text-white/95 leading-relaxed">
                    Áp dụng cho 25 Chi hội thuộc 04 Cụm Khoa và 30 CLB – Đội – Nhóm trực thuộc Hội Sinh viên.
                  </p>
                </div>
                <Link
                  href="/workspace#collective"
                  className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white hover:text-[#FCB900] font-eiu-display"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span>BẢNG TIẾN ĐỘ 25 CHI HỘI</span>
                </Link>
              </div>
              <div className="p-6 flex flex-col justify-center bg-white space-y-2">
                <div className="text-2xl font-extrabold font-mono text-[#51803A]">
                  100% • ≥30% • 0%
                </div>
                <div className="text-sm font-bold text-[#133F68] font-eiu-display">
                  Bộ 03 Điều kiện Tập thể SV5T
                </div>
                <p className="text-[13px] text-slate-600 leading-relaxed">
                  100% SV đăng ký phấn đấu • Ít nhất 30% SV đạt SV5T cấp Trường • 0% vi phạm kỷ luật.
                </p>
              </div>
            </div>
          </div>

          {/* Hàng 2: 05 Cột Tiêu chuẩn Cá nhân Chuẩn QĐ 09/QĐ-HSV Sửa đổi 2026 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {SV5T_PILLARS_2026.map((p) => (
              <div
                key={p.num}
                className={`bg-[#F5F5F5] border border-slate-200 border-t-4 ${p.accent} p-4 flex flex-col justify-between gap-3`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      TIÊU CHUẨN {p.num}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-[#A68556]" />
                  </div>
                  <h3 className="text-[15px] font-bold text-[#133F68] font-eiu-display">
                    {p.title}
                  </h3>
                  <div className="inline-block px-2 py-0.5 bg-white border border-slate-200 font-mono text-xs font-bold text-[#0054A6]">
                    {p.threshold}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          PHÂN VÙNG 5: HỆ SINH THÁI CƠ SỞ HỘI — DẢI NỀN XANH NAVY #133F68 ĐẶC TRƯNG EIU
         ===================================================================== */}
      <section
        aria-labelledby="grassroots-ecosystem-heading"
        className="py-13 bg-[#133F68] text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 eiu-arch-pattern" aria-hidden="true" />
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 relative z-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#FCB900]">
                CẤP 03A &amp; 03B • QUẢN LÝ BỞI BAN TỔ CHỨC VÀ XÂY DỰNG HỘI
              </div>
              <h2
                id="grassroots-ecosystem-heading"
                className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-white font-eiu-display mt-1"
              >
                MẠNG LƯỚI 25 CHI HỘI (04 KHOA) &amp; 30 CÂU LẠC BỘ – ĐỘI – NHÓM
              </h2>
            </div>
            <Link
              href="/to-chuc"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#00BCFF] hover:text-white font-eiu-display"
            >
              <span>KHÁM PHÁ TOÀN BỘ DANH BẠ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Nửa trái (6/12): 04 Cụm Chi hội Khoa */}
            <div className="lg:col-span-6 bg-[#02294E]/80 border border-white/15 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#00BCFF]" />
                  <h3 className="text-base font-bold font-eiu-display">
                    04 Cụm Chi hội Khoa (25 Chi hội • K21–K26)
                  </h3>
                </div>
                <Link
                  href="/to-chuc?tab=branches"
                  className="text-xs font-bold text-[#FCB900] hover:underline"
                >
                  Xem 25 Chi hội →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['BBS', 'SET', 'CIT', 'SNS'] as const).map((code) => {
                  const meta = FACULTY_METADATA[code];
                  const count = BRANCH_UNITS.filter(
                    (b) => b.facultyCode === code
                  ).length;
                  return (
                    <Link
                      key={code}
                      href={`/to-chuc?tab=branches&faculty=${code}`}
                      className="bg-[#133F68] hover:bg-[#144069] border border-white/15 hover:border-[#A68556] p-4 transition-colors block"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#00BCFF]">
                          CỤM {meta.shortCode} ({code})
                        </span>
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-white/10 text-[#FCB900]">
                          0{count} Chi hội
                        </span>
                      </div>
                      <div className="text-sm font-bold text-white mt-1.5 font-eiu-display">
                        {meta.nameVi}
                      </div>
                      <div className="text-xs text-[#DED1BE] mt-1">
                        Cụm trưởng: {meta.clusterLeaderName}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Nửa phải (6/12): 04 Khối CLB & 02 Đơn vị Nòng cốt */}
            <div className="lg:col-span-6 bg-[#02294E]/80 border border-white/15 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#FCB900]" />
                  <h3 className="text-base font-bold font-eiu-display">
                    04 Khối Câu lạc bộ – Đội – Nhóm (30 Đơn vị)
                  </h3>
                </div>
                <Link
                  href="/to-chuc?tab=clubs"
                  className="text-xs font-bold text-[#FCB900] hover:underline"
                >
                  Xem 30 CLB →
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    cat: 'CONG_DONG',
                    name: 'Cộng đồng & Tình nguyện',
                    count: '07 đơn vị',
                    note: 'CLB SV5T, Đội CTVXK, Blood Donation, BEAM...',
                  },
                  {
                    cat: 'HOC_THUAT',
                    name: 'Học thuật – Nghiên cứu',
                    count: '06 CLB',
                    note: 'Honors, IT Club, Finance, Technical, Korean, Econ',
                  },
                  {
                    cat: 'NGHE_THUAT',
                    name: 'Văn hóa – Nghệ thuật',
                    count: '10 CLB',
                    note: 'The Voice Up, EPC, Bumblebee, Passion, Helios...',
                  },
                  {
                    cat: 'THE_THAO',
                    name: 'Thể dục – Thể thao',
                    count: '07 CLB',
                    note: 'FireLions, Football, ACE Volleyball, Calisthenics...',
                  },
                ].map((blk) => (
                  <Link
                    key={blk.cat}
                    href={`/to-chuc?tab=clubs&category=${blk.cat}`}
                    className="bg-[#133F68] hover:bg-[#144069] border border-white/15 hover:border-[#A68556] p-4 transition-colors block"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#FCB900]">
                        {blk.count}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-white/60" />
                    </div>
                    <div className="text-sm font-bold text-white mt-1.5 font-eiu-display">
                      {blk.name}
                    </div>
                    <div className="text-xs text-[#DED1BE] mt-1 line-clamp-1">
                      {blk.note}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          PHÂN VÙNG 6: VĂN BẢN PHÁP LÝ MỚI BAN HÀNH & 03 BAN CHUYÊN MÔN (NỀN #FFFFFF)
         ===================================================================== */}
      <section aria-label="Văn bản pháp lý và Ban chuyên môn" className="py-13 bg-white">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cột Trái (7/12): Bảng Văn bản Pháp lý Hiện hành chuẩn EIU */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display">
                VĂN BẢN &amp; QUYẾT ĐỊNH HIỆN HÀNH
              </h2>
              <Link
                href="/van-ban"
                className="inline-flex items-center gap-1 text-xs font-bold uppercase text-[#0054A6] hover:text-[#C10230] font-eiu-display"
              >
                <span>KHO VĂN BẢN ({OFFICIAL_DOCUMENTS.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="border border-slate-300 bg-white divide-y divide-slate-200">
              <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-between font-eiu-display">
                <span>Số hiệu &amp; Trích yếu Văn bản Khóa II</span>
                <span>Xác thực QR</span>
              </div>
              {OFFICIAL_DOCUMENTS.slice(0, 5).map((doc) => (
                <Link
                  key={doc.id}
                  href={`/van-ban?doc=${encodeURIComponent(doc.documentNumber)}`}
                  className="p-4 flex items-start justify-between gap-4 hover:bg-[#F0F6FC] transition-colors group"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#133F68] text-white">
                        {doc.documentNumber}
                      </span>
                      <span className="text-xs font-mono text-[#A68556] font-semibold">
                        Ban hành: {doc.signedDate}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900 group-hover:text-[#0054A6] leading-snug">
                      {doc.title}
                    </div>
                  </div>
                  <QrCode className="w-5 h-5 text-[#133F68] shrink-0 mt-1 opacity-75 group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>

          {/* Cột Phải (5/12): 03 Đơn vị Chuyên môn Cấp Trường (Level 02) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display">
                03 ĐƠN VỊ CHUYÊN MÔN
              </h2>
              <Link
                href="/gioi-thieu?tab=chart"
                className="inline-flex items-center gap-1 text-xs font-bold uppercase text-[#0054A6] hover:text-[#C10230] font-eiu-display"
              >
                <span>BỘ MÁY KHÓA II</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {[
                {
                  code: 'ĐƠN VỊ 01 • PHÒNG 206.B06',
                  name: 'Văn phòng Hội Sinh viên Trường',
                  desc: 'Đồng điều hành bởi Chánh Văn phòng (Đối ngoại trường) & Tổng Thư ký (Nội bộ); quản lý văn thư, tài sản, tài chính và con dấu Mộc.',
                  href: '/gioi-thieu?tab=vp',
                  icon: Building2,
                  bar: 'border-l-[#133F68]',
                },
                {
                  code: 'ĐƠN VỊ 02 • 05 CỤM QUẢN LÝ',
                  name: 'Ban Tổ chức và Xây dựng Hội',
                  desc: 'Quản lý hồ sơ cán bộ/hội viên, 04 Cụm Chi hội Khoa (25 Chi hội), Cụm 30 CLB/Đội/Nhóm và thẩm định Ngày tình nguyện trước 03 ngày.',
                  href: '/gioi-thieu?tab=tcxdh',
                  icon: ShieldCheck,
                  bar: 'border-l-[#0054A6]',
                },
                {
                  code: 'ĐƠN VỊ 03 • 02 MẢNG & ĐỘI CTVXK',
                  name: 'Ban Tuyên giáo – Phong trào',
                  desc: 'Mảng Tuyên giáo (Design, Video, Photo) & Mảng Phong trào (Tài chính, Nội dung, MC + Đội CTV Xung kích quản lý Hậu cần & Lễ tân).',
                  href: '/gioi-thieu?tab=tgpt',
                  icon: BookOpen,
                  bar: 'border-l-[#C10230]',
                },
              ].map((dept) => {
                const Icon = dept.icon;
                return (
                  <Link
                    key={dept.name}
                    href={dept.href}
                    className={`block bg-[#F5F5F5] hover:bg-[#F0F6FC] border border-slate-200 border-l-4 ${dept.bar} p-4.5 transition-colors group`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#A68556]">
                        {dept.code}
                      </span>
                      <Icon className="w-4 h-4 text-[#133F68]" />
                    </div>
                    <h3 className="text-[15.5px] font-bold text-[#133F68] group-hover:text-[#C10230] font-eiu-display mt-1">
                      {dept.name}
                    </h3>
                    <p className="text-[13px] text-slate-600 leading-relaxed mt-1">
                      {dept.desc}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
