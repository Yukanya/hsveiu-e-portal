'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  EVENT_ITEMS,
  NEWS_POSTS,
} from '@/data/mock-data';
import {
  ArrowRight,
  Award,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Newspaper,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';

function formatDateDot(dateStr: string) {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }
  return dateStr;
}

function formatEventTimeRange(startIso: string, endIso: string) {
  const s = new Date(startIso);
  const e = new Date(endIso);
  const pad = (n: number) => String(n).padStart(2, '0');
  const startHours = `${pad(s.getHours())}:${pad(s.getMinutes())}`;
  const endHours = `${pad(e.getHours())}:${pad(e.getMinutes())}`;
  const dateStr = `${pad(s.getDate())}/${pad(s.getMonth() + 1)}/${s.getFullYear()}`;
  return `${startHours} - ${endHours}, ${dateStr}`;
}

function getEventCardMeta(ev: (typeof EVENT_ITEMS)[0]) {
  const eventDeadlines: Record<
    string,
    { deadline: string; label: string; bgClass: string; isOpen: boolean }
  > = {
    'evt-01': {
      deadline: '17:00 03/11/2026',
      label: 'Còn 2 ngày',
      bgClass: 'bg-[#C10230] text-white',
      isOpen: true,
    },
    'evt-04': {
      deadline: '17:00 07/11/2026',
      label: 'Còn 5 ngày',
      bgClass: 'bg-[#FCB900] text-[#02294E]',
      isOpen: true,
    },
    'evt-05': {
      deadline: '17:00 18/11/2026',
      label: 'Đang mở đăng ký',
      bgClass: 'bg-[#51803A] text-white',
      isOpen: true,
    },
  };

  if (eventDeadlines[ev.id]) {
    return eventDeadlines[ev.id];
  }

  if (ev.certWorkflowStatus !== 'upcoming') {
    const s = new Date(ev.startTime);
    const pad = (n: number) => String(n).padStart(2, '0');
    return {
      deadline: `17:00 ${pad(s.getDate())}/${pad(s.getMonth() + 1)}/${s.getFullYear()}`,
      label: 'Đã đóng đăng ký',
      bgClass: 'bg-slate-400 text-white',
      isOpen: false,
    };
  }

  const s = new Date(ev.startTime);
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    deadline: `17:00 ${pad(Math.max(1, s.getDate() - 2))}/${pad(s.getMonth() + 1)}/${s.getFullYear()}`,
    label: 'Đang mở đăng ký',
    bgClass: 'bg-[#51803A] text-white',
    isOpen: true,
  };
}

const EVENT_CRITERIA_PILLS = [
  { id: 'ALL', label: 'TẤT CẢ' },
  { id: 'Học tập tốt', label: 'HỌC TẬP TỐT' },
  { id: 'Đạo đức tốt', label: 'ĐẠO ĐỨC TỐT' },
  { id: 'Thể lực tốt', label: 'THỂ LỰC TỐT' },
  { id: 'Tình nguyện tốt', label: 'TÌNH NGUYỆN TỐT' },
  { id: 'Hội nhập tốt', label: 'HỘI NHẬP TỐT' },
];

const SV5T_HONOREES = [
  {
    id: 'sv5t-01',
    name: 'Nguyễn Mai Gia Tường',
    branch: '23QTKD01',
    faculty: 'Khoa Quản trị Kinh doanh',
    cohort: 'Khóa 2023',
    initials: 'GT',
    themeBg: 'from-[#0D3259] to-[#041527]',
  },
  {
    id: 'sv5t-02',
    name: 'Nguyễn Như Quỳnh',
    branch: '24QTKD01',
    faculty: 'Khoa Quản trị Kinh doanh',
    cohort: 'Khóa 2024',
    initials: 'NQ',
    themeBg: 'from-[#0D3259] to-[#041527]',
  },
  {
    id: 'sv5t-03',
    name: 'Lương Gia Hân',
    branch: '25QTKD01',
    faculty: 'Khoa Quản trị Kinh doanh',
    cohort: 'Khóa 2025',
    initials: 'GH',
    themeBg: 'from-[#0D3259] to-[#041527]',
  },
  {
    id: 'sv5t-04',
    name: 'Trương Châu Phước Lộc',
    branch: '23CNTT01',
    faculty: 'Khoa Công nghệ Thông tin',
    cohort: 'Khóa 2023',
    initials: 'PL',
    themeBg: 'from-[#0A3D62] to-[#041527]',
  },
  {
    id: 'sv5t-05',
    name: 'Trần Thị Thu Huyền',
    branch: '25CNTT01',
    faculty: 'Khoa Công nghệ Thông tin',
    cohort: 'Khóa 2025',
    initials: 'TH',
    themeBg: 'from-[#0A3D62] to-[#041527]',
  },
  {
    id: 'sv5t-06',
    name: 'Liêu Gia Kỳ',
    branch: '25CNTT01',
    faculty: 'Khoa Công nghệ Thông tin',
    cohort: 'Khóa 2025',
    initials: 'GK',
    themeBg: 'from-[#0A3D62] to-[#041527]',
  },
  {
    id: 'sv5t-07',
    name: 'Nguyễn Hoàng Thị Bích Ngọc',
    branch: '25CNTT01',
    faculty: 'Khoa Công nghệ Thông tin',
    cohort: 'Khóa 2025',
    initials: 'BN',
    themeBg: 'from-[#0A3D62] to-[#041527]',
  },
  {
    id: 'sv5t-08',
    name: 'Đặng Trí Toàn',
    branch: '25CNTT02',
    faculty: 'Khoa Công nghệ Thông tin',
    cohort: 'Khóa 2025',
    initials: 'TT',
    themeBg: 'from-[#0A3D62] to-[#041527]',
  },
  {
    id: 'sv5t-09',
    name: 'Đào Văn Thanh',
    branch: '23KT01',
    faculty: 'Khoa Kỹ thuật',
    cohort: 'Khóa 2023',
    initials: 'VT',
    themeBg: 'from-[#08333D] to-[#041527]',
  },
  {
    id: 'sv5t-10',
    name: 'Võ Duy Huân',
    branch: '25KHSK01',
    faculty: 'Khoa Khoa học Sức khỏe',
    cohort: 'Khóa 2025',
    initials: 'DH',
    themeBg: 'from-[#3D141C] to-[#041527]',
  },
  {
    id: 'sv5t-11',
    name: 'Phạm Thị Thanh Thủy',
    branch: '25KHSK01',
    faculty: 'Khoa Khoa học Sức khỏe',
    cohort: 'Khóa 2025',
    initials: 'TT',
    themeBg: 'from-[#3D141C] to-[#041527]',
  },
];

export default function HomePage() {
  const [eventFilter, setEventFilter] = useState<string>('ALL');

  const carouselRef = useRef<HTMLDivElement>(null);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [activeHonoreeIndex, setActiveHonoreeIndex] = useState(1);

  const featuredNews = NEWS_POSTS[0];
  const secondaryLead = NEWS_POSTS[1];
  const listNews = NEWS_POSTS.slice(2, 6);

  const filteredEvents =
    eventFilter === 'ALL'
      ? EVENT_ITEMS
      : EVENT_ITEMS.filter((ev) => ev.sv5tCriterion === eventFilter);

  // Auto-scroll logic for infinite carousel
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    let animId: number;
    let lastTime = performance.now();

    const step = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (!isCarouselPaused && el) {
        el.scrollLeft += (38 * delta) / 1000;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft -= el.scrollWidth / 2;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isCarouselPaused]);

  const handleCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    const singleCardWidth = 280 + 20;
    const normalizedScroll = el.scrollLeft % (el.scrollWidth / 2);
    const idx = Math.min(
      SV5T_HONOREES.length,
      Math.floor(normalizedScroll / singleCardWidth) + 1
    );
    setActiveHonoreeIndex(idx);
  };

  const scrollCarouselPrev = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollCarouselNext = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#F5F5F5]">
      {/* =====================================================================
          PHÂN VÙNG 1: BANNER TĨNH HSV EIU KHÓA II (2026 – 2028)
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
          {/* Cột Trái (7/12): Khối đa giác nghiêng #C10230 chuẩn EIU */}
          <div className="lg:col-span-7">
            <div
              className="bg-[#C10230]/95 text-white p-7 sm:p-9 shadow-lg"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 91% 100%, 0% 100%)',
              }}
            >
              <h1 className="text-2xl sm:text-[29px] font-extrabold tracking-tight leading-snug font-eiu-display pr-6">
                HỘI SINH VIÊN VIỆT NAM TRƯỜNG ĐẠI HỌC QUỐC TẾ MIỀN ĐÔNG
              </h1>
              <p className="text-sm text-white/95 mt-3 pr-8 leading-relaxed">
                Cổng thông tin Điện tử của Ban Chấp hành Hội Sinh viên trường Đại học Quốc tế Miền Đông.
              </p>
            </div>
          </div>

          {/* Cột Phải (5/12): Khối Biểu trưng EIU × Đại hội II + Khẩu hiệu in nghiêng màu #A68556 căn giữa */}
          <div className="lg:col-span-5">
            <div className="bg-white border-t-4 border-[#A68556] shadow-xl">
              <div className="p-6 sm:p-7 flex items-center justify-center gap-6">
                <Image
                  src="/images/eiu-logo-full.png"
                  alt="Trường Đại học Quốc tế Miền Đông"
                  width={240}
                  height={100}
                  priority
                  className="h-22 sm:h-25 w-auto object-contain"
                />
                <div className="h-20 w-px bg-slate-200" aria-hidden="true" />
                <Image
                  src="/images/hsv-bch-dh2.png"
                  alt="Biểu trưng Đại hội II Hội Sinh viên EIU (2026 - 2028)"
                  width={140}
                  height={100}
                  priority
                  className="h-22 sm:h-25 w-auto object-contain"
                />
              </div>
              <div className="bg-[#133F68] text-white px-6 py-3.5 flex items-center justify-center border-t border-slate-100 text-center">
                <span className="text-xs sm:text-sm font-eiu-serif font-extrabold italic text-[#A68556]">
                  Trí sáng - Đồng tâm - Vươn tầm - Cất cánh
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          PHÂN VÙNG 2: KHÁM PHÁ HỘI SINH VIÊN EIU (BENTO SHOWCASE CHUẨN EIU.EDU.VN)
         ===================================================================== */}
      <section
        aria-label="Khám phá Hội Sinh viên EIU"
        className="py-10 sm:py-12 bg-white border-b border-slate-200/80"
      >
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {/* THẺ 1 (Chiếm 2 cột): Giới thiệu về Hội Sinh viên EIU */}
            <article className="sm:col-span-2 bg-[#02294E] border border-slate-200/90 hover:border-[#133F68] transition-all flex flex-col md:flex-row group shadow-2xs">
              {/* Nửa trái: Tiêu đề Header, thông tin tôn chỉ và liên kết */}
              <div className="md:w-1/2 p-6 sm:p-7 flex flex-col justify-between gap-5 relative bg-[#02294E] eiu-arch-pattern text-white">
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-[23px] font-bold text-white group-hover:text-[#FCB900] transition-colors leading-snug font-eiu-display">
                    Giới thiệu về Hội Sinh viên EIU
                  </h3>
                  <p className="text-xs sm:text-[13px] text-white/85 leading-relaxed line-clamp-4 font-sans">
                    Hội Sinh viên Việt Nam Trường Đại học Quốc tế Miền Đông là tổ chức chính trị – xã hội của sinh viên EIU, đồng hành rèn luyện Sinh viên 5 Tốt, học thuật, kỹ năng hội nhập và phát triển bền vững.
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href="/gioi-thieu"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FCB900] group-hover:text-white font-eiu-display transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900] rounded-xs"
                  >
                    <span>TÌM HIỂU THÊM</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Nửa phải: Biểu trưng đồ họa & Slogan học thuật EIU */}
              <div className="md:w-1/2 bg-[#133F68] eiu-arch-pattern p-6 flex flex-col items-center justify-center text-center border-t md:border-t-0 md:border-l border-white/10 relative overflow-hidden">
                <div className="flex items-center justify-center gap-4 py-2">
                  <Image
                    src="/images/eiu-logo-full-white.png"
                    alt="Trường Đại học Quốc tế Miền Đông"
                    width={130}
                    height={50}
                    className="h-10 w-auto object-contain"
                  />
                  <div className="h-10 w-px bg-white/20" aria-hidden="true" />
                  <Image
                    src="/images/hsv-bch-dh2.png"
                    alt="Biểu trưng Đại hội II"
                    width={60}
                    height={60}
                    className="h-12 w-auto object-contain"
                  />
                </div>
                <div className="w-16 h-0.5 bg-[#A68556] my-3" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-eiu-serif font-extrabold italic text-[#FCB900] max-w-[220px] leading-relaxed">
                  Trí sáng - Đồng tâm - Vươn tầm - Cất cánh
                </span>
              </div>
            </article>

            {/* THẺ 2: Sinh viên 5 tốt */}
            <article className="bg-white border border-slate-200/90 hover:border-[#133F68] transition-all flex flex-col justify-between group shadow-2xs">
              <div className="h-36 bg-[#0054A6] eiu-arch-pattern text-white p-5 flex flex-col justify-between relative overflow-hidden group-hover:bg-[#00478D] transition-colors">
                <div className="flex items-center justify-between">
                  <Award className="w-7 h-7 text-white/90 group-hover:scale-105 transition-transform" />
                  <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-lg sm:text-[19px] font-bold text-white font-eiu-display leading-snug">
                  Sinh viên 5 tốt
                </h3>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-3">
                  Chuẩn mực rèn luyện toàn diện gồm 05 tiêu chuẩn: Đạo đức tốt, Học tập tốt, Thể lực tốt, Tình nguyện tốt và Hội nhập tốt.
                </p>

                <div className="pt-3 border-t border-slate-100">
                  <Link
                    href="/portal"
                    className="inline-flex items-center gap-1 text-[11.5px] font-bold uppercase tracking-wider text-[#8E6D3E] group-hover:text-[#C10230] font-eiu-display transition-colors"
                  >
                    <span>XEM TIÊU CHUẨN</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>

            {/* THẺ 3: Đại hội II */}
            <article className="bg-white border border-slate-200/90 hover:border-[#133F68] transition-all flex flex-col justify-between group shadow-2xs">
              <div className="h-36 bg-[#133F68] eiu-arch-pattern text-white p-5 flex flex-col justify-between relative overflow-hidden group-hover:bg-[#0E2F4F] transition-colors">
                <div className="flex items-center justify-between">
                  <Image
                    src="/images/hsv-bch-dh2.png"
                    alt=""
                    width={36}
                    height={36}
                    className="w-9 h-9 object-contain opacity-95 group-hover:scale-105 transition-transform"
                  />
                  <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-lg sm:text-[19px] font-bold text-white font-eiu-display leading-snug">
                  Đại hội II
                </h3>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-3">
                  Đại hội Đại biểu Hội Sinh viên EIU Khóa II đề ra mục tiêu đồng hành cùng sinh viên học tập, nghiên cứu và phát triển toàn diện.
                </p>

                <div className="pt-3 border-t border-slate-100">
                  <Link
                    href="/gioi-thieu"
                    className="inline-flex items-center gap-1 text-[11.5px] font-bold uppercase tracking-wider text-[#8E6D3E] group-hover:text-[#C10230] font-eiu-display transition-colors"
                  >
                    <span>VĂN KIỆN ĐẠI HỘI</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>

            {/* THẺ 4: Đội ngũ cán bộ */}
            <article className="bg-white border border-slate-200/90 hover:border-[#133F68] transition-all flex flex-col justify-between group shadow-2xs">
              <div className="h-36 bg-[#144069] eiu-arch-pattern text-white p-5 flex flex-col justify-between relative overflow-hidden group-hover:bg-[#0E2F4F] transition-colors">
                <div className="flex items-center justify-between">
                  <Users className="w-7 h-7 text-white/90 group-hover:scale-105 transition-transform" />
                  <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-lg sm:text-[19px] font-bold text-white font-eiu-display leading-snug">
                  Đội ngũ cán bộ
                </h3>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-3">
                  Đội ngũ Ban Chấp hành, Ban Thư ký, Ban Kiểm tra và 03 Ban chuyên môn cấp trường tận tâm, trách nhiệm và nhiệt huyết.
                </p>

                <div className="pt-3 border-t border-slate-100">
                  <Link
                    href="/gioi-thieu"
                    className="inline-flex items-center gap-1 text-[11.5px] font-bold uppercase tracking-wider text-[#8E6D3E] group-hover:text-[#C10230] font-eiu-display transition-colors"
                  >
                    <span>XEM DANH SÁCH</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>

            {/* THẺ 5: Chi hội */}
            <article className="bg-white border border-slate-200/90 hover:border-[#133F68] transition-all flex flex-col justify-between group shadow-2xs">
              <div className="h-36 bg-[#02294E] eiu-arch-pattern text-white p-5 flex flex-col justify-between relative overflow-hidden group-hover:bg-[#011C35] transition-colors">
                <div className="flex items-center justify-between">
                  <Building2 className="w-7 h-7 text-white/90 group-hover:scale-105 transition-transform" />
                  <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-lg sm:text-[19px] font-bold text-white font-eiu-display leading-snug">
                  Chi hội
                </h3>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-3">
                  Hệ thống 25 Chi hội sinh viên trực thuộc 04 Cụm Khoa (CNTT, QTKD, Kỹ thuật, KHSK) kết nối mật thiết hội viên toàn trường.
                </p>

                <div className="pt-3 border-t border-slate-100">
                  <Link
                    href="/to-chuc?tab=branches"
                    className="inline-flex items-center gap-1 text-[11.5px] font-bold uppercase tracking-wider text-[#8E6D3E] group-hover:text-[#C10230] font-eiu-display transition-colors"
                  >
                    <span>DANH BẠ CHI HỘI</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>

            {/* THẺ 6: CLB – Đội – Nhóm */}
            <article className="bg-white border border-slate-200/90 hover:border-[#133F68] transition-all flex flex-col justify-between group shadow-2xs">
              <div className="h-36 bg-[#51803A] eiu-arch-pattern text-white p-5 flex flex-col justify-between relative overflow-hidden group-hover:bg-[#436C2F] transition-colors">
                <div className="flex items-center justify-between">
                  <Sparkles className="w-7 h-7 text-white/90 group-hover:scale-105 transition-transform" />
                  <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-lg sm:text-[19px] font-bold text-white font-eiu-display leading-snug">
                  CLB – Đội – Nhóm
                </h3>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-3">
                  Không gian phát triển sở thích, kỹ năng và đam mê qua 30 CLB học thuật, tình nguyện, văn nghệ và thể dục thể thao.
                </p>

                <div className="pt-3 border-t border-slate-100">
                  <Link
                    href="/to-chuc?tab=clubs"
                    className="inline-flex items-center gap-1 text-[11.5px] font-bold uppercase tracking-wider text-[#8E6D3E] group-hover:text-[#C10230] font-eiu-display transition-colors"
                  >
                    <span>KHÁM PHÁ CLB</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>

            {/* THẺ 7: Tin tức nổi bật */}
            <article className="bg-white border border-slate-200/90 hover:border-[#133F68] transition-all flex flex-col justify-between group shadow-2xs">
              <div className="h-36 bg-[#0054A6] eiu-arch-pattern text-white p-5 flex flex-col justify-between relative overflow-hidden group-hover:bg-[#00478D] transition-colors">
                <div className="flex items-center justify-between">
                  <Newspaper className="w-7 h-7 text-white/90 group-hover:scale-105 transition-transform" />
                  <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-lg sm:text-[19px] font-bold text-white font-eiu-display leading-snug">
                  Tin tức nổi bật
                </h3>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-3">
                  Cập nhật nhanh chóng các thông báo chính thức, hoạt động phong trào và gương sinh viên tiêu biểu Trường Đại học Quốc tế Miền Đông.
                </p>

                <div className="pt-3 border-t border-slate-100">
                  <Link
                    href="#news-heading"
                    className="inline-flex items-center gap-1 text-[11.5px] font-bold uppercase tracking-wider text-[#8E6D3E] group-hover:text-[#C10230] font-eiu-display transition-colors"
                  >
                    <span>XEM BẢN TIN</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================================
          PHÂN VÙNG 3: TIN TỨC SINH VIÊN (BENTO EDITORIAL CHUẨN BÁO CHÍ)
         ===================================================================== */}
      <section aria-labelledby="news-heading" className="py-13 bg-[#F5F5F5]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 space-y-7">
          <div className="text-center space-y-2">
            <h2
              id="news-heading"
              className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display"
            >
              TIN TỨC SINH VIÊN
            </h2>
            <div className="w-12 h-1 bg-[#C10230] mx-auto" aria-hidden="true" />
          </div>

          {/* Lưới Bento Tin tức theo mẫu Magazine Editorial */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
            {/* Cột Trái (6/12): Bài viết Tiêu điểm 01 */}
            <div className="lg:col-span-6 flex">
              <article className="relative w-full bg-[#02294E] eiu-arch-pattern text-white overflow-hidden p-6 sm:p-8 flex flex-col justify-between min-h-[460px] lg:min-h-full border border-slate-200/90 shadow-2xs group">
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#02294E] via-[#02294E]/85 to-transparent pointer-events-none"
                  aria-hidden="true"
                />

                {/* Phần trên: Số thứ tự 01, Badge Tiêu điểm và Ngày đăng */}
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <span
                    className="font-eiu-serif text-5xl sm:text-6xl font-light select-none tracking-tight leading-none"
                    style={{
                      WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.75)',
                      color: 'transparent',
                    }}
                    aria-hidden="true"
                  >
                    01
                  </span>

                  <div className="flex items-center gap-2.5 pt-1">
                    <span className="px-2.5 py-0.5 bg-[#FCB900] text-[#02294E] text-[11px] font-bold uppercase tracking-wider font-eiu-display">
                      TIÊU ĐIỂM
                    </span>
                    <span className="font-eiu-serif text-xs text-white/80">
                      {formatDateDot(featuredNews.publishedAt)}
                    </span>
                  </div>
                </div>

                {/* Phần dưới: Tiêu đề lớn Serif, Tóm tắt bài viết và Nút Đọc ngay */}
                <div className="relative z-10 space-y-4 pt-12 sm:pt-16">
                  <Link href={`/tin-tuc/${featuredNews.slug}`} className="block group/link">
                    <h3 className="font-eiu-serif text-2xl sm:text-[27px] font-bold text-white group-hover/link:text-[#FCB900] transition-colors leading-snug line-clamp-3">
                      {featuredNews.title}
                    </h3>
                  </Link>
                  <p className="text-xs sm:text-sm text-white/85 leading-relaxed line-clamp-3 font-light">
                    {featuredNews.summary}
                  </p>
                  <div className="pt-2">
                    <Link
                      href={`/tin-tuc/${featuredNews.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FCB900] hover:bg-[#EEB31D] text-[#02294E] text-xs font-bold uppercase tracking-wider transition-colors font-eiu-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900] focus-visible:ring-offset-2 focus-visible:ring-offset-[#02294E]"
                    >
                      <span>Đọc ngay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            </div>

            {/* Cột Phải (6/12): Bài 02 ở trên + Danh sách bài 03 - 06 ở dưới */}
            <div className="lg:col-span-6 flex flex-col gap-5 sm:gap-6">
              {/* Thẻ 02: Bài phụ tiêu điểm */}
              <article className="relative bg-[#144069] eiu-arch-pattern text-white overflow-hidden p-5 sm:p-6 border border-slate-200/90 shadow-2xs group flex flex-col justify-between gap-4">
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#144069] via-[#144069]/80 to-transparent pointer-events-none"
                  aria-hidden="true"
                />

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <span
                    className="font-eiu-serif text-4xl sm:text-5xl font-light select-none tracking-tight leading-none"
                    style={{
                      WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.75)',
                      color: 'transparent',
                    }}
                    aria-hidden="true"
                  >
                    02
                  </span>

                  <div className="flex items-center gap-2 pt-1 text-[11px] font-bold uppercase tracking-wider font-eiu-display">
                    <span className="text-[#00BCFF]">{secondaryLead.categoryLabel}</span>
                    <span className="text-white/40">•</span>
                    <span className="font-eiu-serif text-white/80 font-normal">
                      {formatDateDot(secondaryLead.publishedAt)}
                    </span>
                  </div>
                </div>

                <div className="relative z-10">
                  <Link href={`/tin-tuc/${secondaryLead.slug}`} className="block group/link">
                    <h3 className="font-eiu-serif text-base sm:text-lg font-bold text-white group-hover/link:text-[#00BCFF] transition-colors leading-snug line-clamp-2">
                      {secondaryLead.title}
                    </h3>
                  </Link>
                </div>
              </article>

              {/* Danh sách bài 03 - 06 */}
              <div className="bg-white border border-slate-200/90 shadow-2xs divide-y divide-slate-100 flex-1 flex flex-col justify-between">
                {listNews.map((post, idx) => (
                  <Link
                    key={post.id}
                    href={`/tin-tuc/${post.slug}`}
                    className="p-3.5 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 hover:bg-slate-50/80 transition-colors group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <span
                        className="font-eiu-serif text-2xl sm:text-3xl font-light select-none shrink-0 w-8 sm:w-10 text-center leading-none"
                        style={{
                          WebkitTextStroke: '1.2px #0054A6',
                          color: 'transparent',
                        }}
                        aria-hidden="true"
                      >
                        {String(idx + 3).padStart(2, '0')}
                      </span>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 text-[10.5px] uppercase font-bold tracking-wider font-eiu-display">
                          <span className="text-[#0054A6] truncate">{post.categoryLabel}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500 font-eiu-serif shrink-0">
                            {formatDateDot(post.publishedAt)}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-[13.5px] font-semibold text-[#133F68] group-hover:text-[#C10230] transition-colors leading-snug line-clamp-2 font-eiu-display">
                          {post.title}
                        </h4>
                      </div>
                    </div>

                    <div className="w-20 sm:w-24 h-14 sm:h-16 shrink-0 bg-[#144069] eiu-arch-pattern text-white flex items-center justify-center border border-slate-200 overflow-hidden relative group-hover:border-[#0054A6] transition-colors">
                      <Image
                        src="/images/hsv-logo.png"
                        alt=""
                        width={26}
                        height={26}
                        className="w-6 h-6 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Link
              href="/tin-tuc"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#133F68] hover:text-[#C10230] font-eiu-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68] focus-visible:ring-offset-2 rounded-xs"
            >
              <ChevronRight className="w-4 h-4" />
              <span>XEM TẤT CẢ TIN TỨC</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          PHÂN VÙNG 4: SỰ KIỆN PHONG TRÀO (BỘ LỌC TIÊU CHUẨN SV5T VÀ LƯỚI SỰ KIỆN)
         ===================================================================== */}
      <section aria-labelledby="events-heading" className="py-13 bg-white border-t border-slate-200/90">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 space-y-7">
          <div className="text-center space-y-3">
            <h2
              id="events-heading"
              className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display"
            >
              SỰ KIỆN PHONG TRÀO
            </h2>

            {/* Các Pills Bộ lọc Tiêu chuẩn */}
            <div
              role="tablist"
              aria-label="Lọc Sự kiện theo Tiêu chuẩn Sinh viên 5 Tốt"
              className="flex flex-wrap items-center justify-center gap-2 pt-1"
            >
              {EVENT_CRITERIA_PILLS.map((pill) => {
                const isSelected = eventFilter === pill.id;
                const count =
                  pill.id === 'ALL'
                    ? EVENT_ITEMS.length
                    : EVENT_ITEMS.filter((ev) => ev.sv5tCriterion === pill.id).length;

                return (
                  <button
                    key={pill.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setEventFilter(pill.id)}
                    className={`py-1.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer font-eiu-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C10230] focus-visible:ring-offset-2 ${
                      isSelected
                        ? 'bg-[#C10230] text-white border border-[#C10230]'
                        : 'bg-white text-[#133F68] border border-slate-300 hover:border-[#133F68] hover:bg-[#EAE3D2]/30'
                    }`}
                  >
                    {pill.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lưới Thẻ Sự kiện (Grid 3 cột) */}
          {filteredEvents.length === 0 ? (
            <div className="bg-[#F5F5F5] border border-slate-200/90 p-8 text-center space-y-3">
              <p className="text-sm text-slate-600">
                Hiện chưa có sự kiện nào thuộc tiêu chuẩn{' '}
                <strong>{eventFilter}</strong> đang mở.
              </p>
              <button
                type="button"
                onClick={() => setEventFilter('ALL')}
                className="px-4 py-2 bg-[#133F68] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#0054A6] transition-colors"
              >
                Xem tất cả sự kiện
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredEvents.map((ev) => {
                const fillPct = Math.min(
                  100,
                  Math.round((ev.registeredCount / ev.maxParticipants) * 100)
                );
                const meta = getEventCardMeta(ev);

                return (
                  <article
                    key={ev.id}
                    className="bg-white border border-slate-200/90 hover:border-[#133F68] transition-colors flex flex-col justify-between"
                  >
                    {/* Header Thẻ Sự kiện: Tag Trạng thái bên trái, Box Tiêu chuẩn và Box Ngày TN bên phải — Chiều cao h-36 đồng bộ với Thẻ Tin tức */}
                    <div className="h-36 bg-[#02294E] eiu-arch-pattern text-white p-5 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        {/* Tag trạng thái sự kiện bên trái */}
                        <span
                          className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider font-eiu-display shrink-0 ${meta.bgClass}`}
                        >
                          {meta.label}
                        </span>

                        {/* Cột 2 box bên phải: Box Tiêu chuẩn ở trên & Box Ngày tình nguyện ở dưới */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span className="font-eiu-serif text-xs font-bold px-2.5 py-0.5 bg-white text-[#133F68] text-right">
                            Tiêu chuẩn: {ev.sv5tCriterion}
                          </span>
                          <span className="font-eiu-serif text-xs font-bold px-2.5 py-0.5 bg-[#FCB900] text-[#02294E] text-right">
                            +{ev.baseVolunteerDays.toFixed(1)} Ngày Tình nguyện
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        {/* Tên chương trình */}
                        <h3 className="text-[15.5px] font-bold text-[#133F68] leading-snug line-clamp-2 font-eiu-display">
                          {ev.title}
                        </h3>

                        {/* Vị trí */}
                        <p className="text-xs text-slate-600 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#8E6D3E] shrink-0" />
                          <span className="line-clamp-1">{ev.location}</span>
                        </p>

                        {/* Thời gian diễn ra chương trình (giờ và ngày tháng năm) */}
                        <p className="text-xs text-slate-600 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#8E6D3E] shrink-0" />
                          <span>{formatEventTimeRange(ev.startTime, ev.endTime)}</span>
                        </p>

                        {/* Cây số lượng đăng ký và Hạn đăng ký */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between text-[11px] text-slate-600 font-eiu-serif">
                            <span>Đăng ký: {ev.registeredCount}/{ev.maxParticipants}</span>
                            <span>{fillPct}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-200 overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                fillPct >= 100
                                  ? 'bg-[#51803A]'
                                  : fillPct >= 85
                                  ? 'bg-[#EEB31D]'
                                  : 'bg-[#0054A6]'
                              }`}
                              style={{ width: `${fillPct}%` }}
                            />
                          </div>
                          {/* Hạn đăng ký bên phải phía dưới cây */}
                          <div className="flex justify-end pt-0.5">
                            <span className="text-[11px] text-slate-500 font-eiu-serif">
                              Hạn đăng ký: {meta.deadline}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer: Đăng ký */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <Link
                          href={`/su-kien?event=${encodeURIComponent(ev.id)}`}
                          className="inline-flex items-center gap-1 font-bold uppercase text-[#0054A6] hover:text-[#C10230] font-eiu-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0054A6] rounded-xs"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                          <span>{meta.isOpen ? 'ĐĂNG KÝ' : 'XEM TIẾN ĐỘ GCN'}</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Link
              href="/su-kien"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#133F68] hover:text-[#C10230] font-eiu-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68] focus-visible:ring-offset-2 rounded-xs"
            >
              <ChevronRight className="w-4 h-4" />
              <span>XEM TẤT CẢ SỰ KIỆN</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          PHÂN VÙNG 5: GƯƠNG SÁNG SINH VIÊN 5 TỐT (CAROUSEL TỰ CUỘN PHẢI SANG TRÁI)
         ===================================================================== */}
      <section
        aria-labelledby="sv5t-honorees-heading"
        className="py-14 sm:py-16 bg-[#02294E] relative overflow-hidden text-white"
      >
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 20%, #A68556 0%, transparent 45%), radial-gradient(circle at 20% 80%, #0054A6 0%, transparent 50%)',
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 eiu-arch-pattern pointer-events-none" aria-hidden="true" />

        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 relative z-10 mb-6 sm:mb-8 flex items-center justify-between gap-4">
          <h2
            id="sv5t-honorees-heading"
            className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold font-eiu-display tracking-tight text-white leading-tight flex items-baseline gap-2.5 flex-wrap"
          >
            <span>Gương sáng</span>
            <span className="font-eiu-serif italic font-bold text-[#FCB900] text-[1.18em] tracking-normal">
              Sinh viên 5 tốt
            </span>
          </h2>

          {/* Nút điều hướng thủ công Prev / Next */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={scrollCarouselPrev}
              aria-label="Xem gương mặt trước"
              className="w-10 h-10 rounded-full border border-white/25 hover:border-white hover:bg-white/10 text-white flex items-center justify-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={scrollCarouselNext}
              aria-label="Xem gương mặt tiếp theo"
              className="w-10 h-10 rounded-full border border-white/25 hover:border-white hover:bg-white/10 text-white flex items-center justify-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Khung Carousel tự cuộn từ phải sang trái (Infinite Seamless Loop) */}
        <div
          ref={carouselRef}
          onScroll={handleCarouselScroll}
          onMouseEnter={() => setIsCarouselPaused(true)}
          onMouseLeave={() => setIsCarouselPaused(false)}
          className="flex items-center gap-5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:none py-2 px-4 sm:px-6 relative z-10 cursor-grab active:cursor-grabbing"
        >
          {[...SV5T_HONOREES, ...SV5T_HONOREES].map((student, idx) => (
            <article
              key={`${student.id}-${idx}`}
              className={`w-[270px] sm:w-[285px] h-[340px] sm:h-[360px] shrink-0 bg-gradient-to-br ${student.themeBg} border border-white/15 hover:border-[#FCB900] transition-all flex flex-col justify-between p-5 relative overflow-hidden group select-none shadow-lg`}
            >
              <div className="absolute inset-0 eiu-arch-pattern opacity-40 pointer-events-none" aria-hidden="true" />

              {/* Hàng trên: Số thứ tự outline bên phải */}
              <div className="relative z-10 flex items-center justify-end">
                <span
                  className="font-eiu-serif text-2xl sm:text-3xl font-light select-none tracking-tight leading-none"
                  style={{
                    WebkitTextStroke: '1px rgba(255, 255, 255, 0.45)',
                    color: 'transparent',
                  }}
                  aria-hidden="true"
                >
                  {String((idx % SV5T_HONOREES.length) + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Phần giữa: Biểu trưng huy hiệu vinh danh SV5T */}
              <div className="relative z-10 my-auto py-2 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full border-2 border-[#FCB900]/70 bg-gradient-to-b from-[#133F68] to-[#02294E] flex flex-col items-center justify-center relative shadow-xl group-hover:border-[#FCB900] group-hover:scale-105 transition-all">
                  <Star className="w-4 h-4 fill-[#FCB900] text-[#FCB900] mb-0.5" />
                  <span className="font-eiu-serif font-bold text-base text-white tracking-wider">
                    {student.initials}
                  </span>
                  <span className="text-[8.5px] font-bold uppercase tracking-widest text-[#FCB900] font-eiu-display mt-0.5">
                    SV5T
                  </span>
                </div>
                <span className="text-[11px] text-white/60 font-eiu-serif mt-2.5 tracking-wide">
                  {student.cohort}
                </span>
              </div>

              {/* Hàng dưới: Tag màu vàng, Họ và tên (Header) và Chi hội */}
              <div className="relative z-10 space-y-2">
                <span className="px-2.5 py-0.5 bg-[#FCB900] text-[#02294E] text-[10px] font-bold uppercase tracking-wider font-eiu-display self-start inline-block">
                  Sinh viên 5 tốt cấp trường
                </span>

                <h3 className="font-eiu-display font-bold text-lg text-white group-hover:text-[#FCB900] transition-colors leading-snug line-clamp-1">
                  {student.name}
                </h3>

                <p className="text-xs text-white/80 line-clamp-1 font-medium">
                  Chi hội {student.branch}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Thanh tiến độ và chỉ số đếm số lượng */}
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-8 relative z-10 flex items-center justify-between gap-4">
          <div className="flex-1 h-0.5 bg-white/15 relative overflow-hidden">
            <div
              className="h-full bg-[#FCB900] transition-all duration-300"
              style={{
                width: `${(activeHonoreeIndex / SV5T_HONOREES.length) * 100}%`,
              }}
            />
          </div>
          <span className="font-eiu-serif text-xs sm:text-sm text-white/70 font-semibold tracking-wider shrink-0">
            {String(activeHonoreeIndex).padStart(2, '0')} / {String(SV5T_HONOREES.length).padStart(2, '0')}
          </span>
        </div>
      </section>
    </div>
  );
}
