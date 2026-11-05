'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SubpageBanner } from '@/components/public/subpage-banner';
import { EVENT_ITEMS } from '@/data/mock-data';
import { useRole } from '@/context/role-context';
import { EventItem, EventStatusTag } from '@/types';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  QrCode,
  Search,
  Users,
  X,
} from 'lucide-react';

type CriteriaFilter = 'ALL' | EventItem['sv5tCriterion'];

const EVENT_CRITERIA_PILLS: { id: CriteriaFilter; label: string }[] = [
  { id: 'ALL', label: 'TẤT CẢ' },
  { id: 'Học tập tốt', label: 'HỌC TẬP TỐT' },
  { id: 'Đạo đức tốt', label: 'ĐẠO ĐỨC TỐT' },
  { id: 'Thể lực tốt', label: 'THỂ LỰC TỐT' },
  { id: 'Tình nguyện tốt', label: 'TÌNH NGUYỆN TỐT' },
  { id: 'Hội nhập tốt', label: 'HỘI NHẬP TỐT' },
];

const EVENTS_PER_PAGE = 12;

function formatEventTimeRange(
  startIso?: string | null,
  endIso?: string | null
): string {
  if (!startIso || !endIso) return 'Thời gian đang cập nhật';
  const s = new Date(startIso);
  const e = new Date(endIso);
  if (isNaN(s.getTime()) || isNaN(e.getTime()))
    return 'Thời gian đang cập nhật';
  const pad = (n: number) => String(n).padStart(2, '0');
  const startHours = `${pad(s.getHours())}:${pad(s.getMinutes())}`;
  const endHours = `${pad(e.getHours())}:${pad(e.getMinutes())}`;
  const dateStr = `${pad(s.getDate())}/${pad(s.getMonth() + 1)}/${s.getFullYear()}`;
  return `${startHours} - ${endHours}, ${dateStr}`;
}

interface EventCardMeta {
  deadline: string;
  label: EventStatusTag;
  bgClass: string;
  isOpen: boolean;
  ctaText: string;
}

function getEventCardMeta(ev: EventItem): EventCardMeta {
  // 1. Xác định nhãn Tag theo quy định 07 trạng thái của hệ thống
  let label: EventStatusTag = ev.statusTag || 'Đang mở đăng ký';

  if (!ev.statusTag) {
    if (ev.certWorkflowStatus === 'ongoing') {
      label = 'Đang diễn ra';
    } else if (
      ev.certWorkflowStatus === 'decision_issued' ||
      ev.certWorkflowStatus === 'list_submitted_sla'
    ) {
      label = 'Đã kết thúc';
    } else {
      label = 'Đang mở đăng ký';
    }
  }

  // 2. Tính deadline hiển thị
  const s = ev.startTime ? new Date(ev.startTime) : new Date();
  const isValidDate = !isNaN(s.getTime());
  const pad = (n: number) => String(n).padStart(2, '0');
  const formattedDate = isValidDate
    ? `${pad(s.getDate())}/${pad(s.getMonth() + 1)}/${s.getFullYear()}`
    : 'Đang cập nhật';

  // 3. Quy chuẩn màu sắc và thuộc tính tương tác cho 07 loại Tag
  switch (label) {
    case 'Chưa mở đăng ký':
      return {
        deadline: `Mở đơn: ${formattedDate}`,
        label: 'Chưa mở đăng ký',
        bgClass: 'bg-slate-600 text-white',
        isOpen: false,
        ctaText: 'CHƯA MỞ ĐƠN',
      };

    case 'Đang mở đăng ký':
      return {
        deadline: `17:00 ${
          isValidDate
            ? `${pad(Math.max(1, s.getDate() - 2))}/${pad(s.getMonth() + 1)}/${s.getFullYear()}`
            : formattedDate
        }`,
        label: 'Đang mở đăng ký',
        bgClass: 'bg-[#51803A] text-white',
        isOpen: true,
        ctaText: 'ĐĂNG KÝ NGAY',
      };

    case 'Còn 5 ngày':
      return {
        deadline: `17:00 ${
          isValidDate
            ? `${pad(s.getDate())}/${pad(s.getMonth() + 1)}/${s.getFullYear()}`
            : formattedDate
        }`,
        label: 'Còn 5 ngày',
        bgClass: 'bg-[#FCB900] text-[#02294E]',
        isOpen: true,
        ctaText: 'ĐĂNG KÝ NGAY',
      };

    case 'Còn 2 ngày':
      return {
        deadline: `17:00 ${
          isValidDate
            ? `${pad(s.getDate())}/${pad(s.getMonth() + 1)}/${s.getFullYear()}`
            : formattedDate
        }`,
        label: 'Còn 2 ngày',
        bgClass: 'bg-[#C10230] text-white',
        isOpen: true,
        ctaText: 'ĐĂNG KÝ NGAY',
      };

    case 'Đã đóng đăng ký':
      return {
        deadline: `17:00 ${formattedDate}`,
        label: 'Đã đóng đăng ký',
        bgClass: 'bg-[#EEB31D] text-[#02294E]',
        isOpen: false,
        ctaText: 'ĐÃ ĐÓNG ĐƠN',
      };

    case 'Đang diễn ra':
      return {
        deadline: `Diễn ra: ${formattedDate}`,
        label: 'Đang diễn ra',
        bgClass: 'bg-[#0054A6] text-white',
        isOpen: false,
        ctaText: 'ĐANG DIỄN RA',
      };

    case 'Đã kết thúc':
    default:
      return {
        deadline: `Hoàn tất: ${formattedDate}`,
        label: 'Đã kết thúc',
        bgClass: 'bg-slate-700 text-slate-100',
        isOpen: false,
        ctaText: 'NHẬN GCN',
      };
  }
}

function matchesStatus(ev: EventItem, filter: string): boolean {
  if (filter === 'ALL') return true;
  const meta = getEventCardMeta(ev);
  if (filter === 'OPEN_ALL') {
    return (
      meta.label === 'Đang mở đăng ký' ||
      meta.label === 'Còn 5 ngày' ||
      meta.label === 'Còn 2 ngày'
    );
  }
  return meta.label === filter;
}

function matchesVolunteerDays(ev: EventItem, filter: string): boolean {
  if (filter === 'ALL') return true;
  const days = Number(ev.baseVolunteerDays ?? 0);
  if (filter === '0_1') return days >= 0 && days <= 1.0;
  if (filter === '1.5_2') return days >= 1.5 && days <= 2.0;
  if (filter === 'GT_2') return days > 2.0;
  return true;
}

function matchesTrainingPoints(ev: EventItem, filter: string): boolean {
  if (filter === 'ALL') return true;
  if (filter === 'YES') return Boolean(ev.hasTrainingPoints);
  if (filter === 'NO') return !ev.hasTrainingPoints;
  return true;
}

function matchesTimeSlot(ev: EventItem, filter: string): boolean {
  if (filter === 'ALL') return true;
  if (ev.timeSlot === filter) return true;

  const s = new Date(ev.startTime);
  const e = new Date(ev.endTime);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return true;
  const isMultiDay = e.getTime() - s.getTime() > 24 * 60 * 60 * 1000;
  if (filter === 'MULTI_DAY') return isMultiDay;
  if (isMultiDay) return false;

  const hour = s.getHours() + s.getMinutes() / 60;
  if (filter === 'MORNING') return hour >= 6.0 && hour < 12.0;
  if (filter === 'AFTERNOON') return hour >= 12.0 && hour < 16.5;
  if (filter === 'EVENING') return hour >= 16.5 && hour < 22.0;
  return true;
}

function matchesLocationArea(ev: EventItem, filter: string): boolean {
  if (filter === 'ALL') return true;
  if (ev.locationArea === filter) return true;

  const loc = ev.location.toLowerCase();
  if (filter === 'EIU') {
    return loc.includes('eiu') || loc.includes('miền đông');
  }
  if (filter === 'HCM') {
    return (
      loc.includes('hồ chí minh') ||
      loc.includes('hcm') ||
      loc.includes('tp.hcm') ||
      loc.includes('sài gòn')
    );
  }
  if (filter === 'OTHER') {
    return (
      !loc.includes('eiu') &&
      !loc.includes('miền đông') &&
      !loc.includes('hồ chí minh') &&
      !loc.includes('hcm') &&
      !loc.includes('tp.hcm')
    );
  }
  return true;
}

function SuKienContent({
  initialEventId,
  initialCriteria,
}: {
  initialEventId: string | null;
  initialCriteria: CriteriaFilter;
}) {
  const { currentPersona } = useRole();
  const gridTopRef = useRef<HTMLDivElement>(null);

  // Bộ lọc tiêu chuẩn SV5T
  const [criteriaFilter, setCriteriaFilter] =
    useState<CriteriaFilter>(initialCriteria);

  // Bộ lọc chuyên sâu theo 07 Tag và các tiêu chí
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [volunteerDaysFilter, setVolunteerDaysFilter] = useState<string>('ALL');
  const [trainingPointsFilter, setTrainingPointsFilter] =
    useState<string>('ALL');
  const [timeSlotFilter, setTimeSlotFilter] = useState<string>('ALL');
  const [locationAreaFilter, setLocationAreaFilter] = useState<string>('ALL');

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);

  // Quản lý Modal Phiếu Đăng ký / Nhận GCN
  const [selectedModalEvent, setSelectedModalEvent] =
    useState<EventItem | null>(() => {
      if (initialEventId) {
        return (
          EVENT_ITEMS.find((ev) => ev.id === initialEventId) || null
        );
      }
      return null;
    });

  const [roleMultiplier, setRoleMultiplier] = useState<1 | 2 | 3>(1);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);

  // Đóng mở modal & xử lý phím ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedModalEvent(null);
      }
    };
    if (selectedModalEvent) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedModalEvent]);

  // Bộ lọc mượt mà có hiệu ứng transition êm dịu (Filter Continuity)
  const handleCriteriaChange = (newCrit: CriteriaFilter) => {
    if (newCrit === criteriaFilter) return;
    setIsFiltering(true);
    setCriteriaFilter(newCrit);
    setCurrentPage(1);
    setTimeout(() => setIsFiltering(false), 180);
  };

  const handleResetFilters = () => {
    setIsFiltering(true);
    setCriteriaFilter('ALL');
    setStatusFilter('ALL');
    setVolunteerDaysFilter('ALL');
    setTrainingPointsFilter('ALL');
    setTimeSlotFilter('ALL');
    setLocationAreaFilter('ALL');
    setSearchQuery('');
    setCurrentPage(1);
    setTimeout(() => setIsFiltering(false), 180);
  };

  const hasActiveFilter =
    criteriaFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    volunteerDaysFilter !== 'ALL' ||
    trainingPointsFilter !== 'ALL' ||
    timeSlotFilter !== 'ALL' ||
    locationAreaFilter !== 'ALL' ||
    Boolean(searchQuery.trim());

  const openEventModal = (ev: EventItem) => {
    setSelectedModalEvent(ev);
    setRoleMultiplier(1);
    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.set('event', ev.id);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const closeEventModal = () => {
    setSelectedModalEvent(null);
    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.delete('event');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleRegister = (id: string) => {
    if (!registeredIds.includes(id)) {
      setRegisteredIds((prev) => [...prev, id]);
    }
  };

  // Lọc tập sự kiện theo toàn bộ các tiêu chí
  const filteredEvents = EVENT_ITEMS.filter((ev) => {
    const matchCrit =
      criteriaFilter === 'ALL' || ev.sv5tCriterion === criteriaFilter;
    const matchStat = matchesStatus(ev, statusFilter);
    const matchDays = matchesVolunteerDays(ev, volunteerDaysFilter);
    const matchPoints = matchesTrainingPoints(ev, trainingPointsFilter);
    const matchTime = matchesTimeSlot(ev, timeSlotFilter);
    const matchLoc = matchesLocationArea(ev, locationAreaFilter);

    const q = searchQuery.trim().toLowerCase();
    const matchQ =
      !q ||
      ev.title.toLowerCase().includes(q) ||
      ev.location.toLowerCase().includes(q) ||
      (ev.decisionNumber && ev.decisionNumber.toLowerCase().includes(q));

    return (
      matchCrit &&
      matchStat &&
      matchDays &&
      matchPoints &&
      matchTime &&
      matchLoc &&
      matchQ
    );
  });

  // Phân trang: tối đa 12 sự kiện / trang
  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);
  const safePage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
  const paginatedEvents = filteredEvents.slice(
    (safePage - 1) * EVENTS_PER_PAGE,
    safePage * EVENTS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const isMultiplierEligible = Boolean(
    selectedModalEvent?.isUnionWorkMultiplierEligible
  );
  const effectiveMultiplier: 1 | 2 | 3 = isMultiplierEligible
    ? roleMultiplier
    : 1;
  const computedVolunteerDays = selectedModalEvent
    ? selectedModalEvent.baseVolunteerDays * effectiveMultiplier
    : 0;

  const isModalEventRegistered = selectedModalEvent
    ? registeredIds.includes(selectedModalEvent.id)
    : false;

  const modalMeta = selectedModalEvent
    ? getEventCardMeta(selectedModalEvent)
    : null;

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      {/* BANNER KIẾN TRÚC EIU ĐỒNG BỘ: TIÊU ĐỀ & MÔ TẢ ĐÃ CẬP NHẬT THEO YÊU CẦU */}
      <SubpageBanner
        kicker="ĐĂNG KÝ NGAY • QUY ĐỔI NGÀY TÌNH NGUYỆN • CẤP E-CERTIFICATE CHỐNG GIẢ MẠO"
        title="LỊCH SỰ KIỆN VÀ HOẠT ĐỘNG"
        subtitle="Tổng hợp tất cả các sự kiện sinh viên dành cho Sinh viên trường Đại học Quốc tế Miền Đông."
        breadcrumbs={[{ label: 'Sự kiện' }]}
      />

      <div
        ref={gridTopRef}
        className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-9 space-y-8 scroll-mt-24"
      >
        {/* =====================================================================
            BỘ LỌC ĐA TIÊU CHÍ: PILLS TIÊU CHUẨN SV5T & BỘ SORT / FILTER TOÀN DIỆN
           ===================================================================== */}
        <div className="space-y-4">
          {/* Hàng 1: Tiêu đề section & Pills 06 Tiêu chuẩn Sinh viên 5 Tốt */}
          <div className="text-center space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display">
              DANH MỤC SỰ KIỆN PHONG TRÀO
            </h2>

            <div
              role="tablist"
              aria-label="Lọc Sự kiện theo Tiêu chuẩn Sinh viên 5 Tốt"
              className="flex flex-wrap items-center justify-center gap-2 pt-1"
            >
              {EVENT_CRITERIA_PILLS.map((pill) => {
                const isSelected = criteriaFilter === pill.id;
                const count =
                  pill.id === 'ALL'
                    ? EVENT_ITEMS.length
                    : EVENT_ITEMS.filter((ev) => ev.sv5tCriterion === pill.id)
                        .length;

                return (
                  <button
                    key={pill.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleCriteriaChange(pill.id)}
                    className={`py-2 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer font-eiu-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C10230] focus-visible:ring-offset-2 min-h-[38px] ${
                      isSelected
                        ? 'bg-[#C10230] text-white border border-[#C10230] shadow-xs scale-[1.02]'
                        : 'bg-white text-[#133F68] border border-slate-300 hover:border-[#133F68] hover:bg-[#EAE3D2]/40 hover:scale-[1.01]'
                    }`}
                  >
                    {pill.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hàng 2: Hộp Tìm kiếm & Thanh Bộ Lọc & Sắp Xếp Toàn Diện */}
          <div className="bg-white border border-slate-200 p-4 space-y-3.5 shadow-2xs">
            {/* Ô Tìm Kiếm + Nút Lọc Nhanh Đang Mở Đăng Ký */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Tìm kiếm sự kiện theo tên, địa điểm..."
                  aria-label="Tìm kiếm sự kiện"
                  className="w-full h-10 pl-9 pr-9 bg-white border border-slate-300 rounded text-xs sm:text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68] focus-visible:border-transparent placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                    aria-label="Xóa từ khóa tìm kiếm"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Nút lọc nhanh: Đang mở đăng ký */}
              <button
                type="button"
                onClick={() => {
                  setStatusFilter((prev) =>
                    prev === 'OPEN_ALL' ? 'ALL' : 'OPEN_ALL'
                  );
                  setCurrentPage(1);
                }}
                className={`px-4 h-10 rounded text-xs font-bold uppercase tracking-wider font-eiu-display transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 shrink-0 ${
                  statusFilter === 'OPEN_ALL'
                    ? 'bg-[#51803A] text-white shadow-xs'
                    : 'bg-slate-100 text-[#133F68] hover:bg-[#EAE3D2] border border-slate-300'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Đang mở đăng ký</span>
              </button>

              {hasActiveFilter && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3 h-10 text-xs font-bold text-[#C10230] hover:bg-red-50 rounded transition-colors font-eiu-display cursor-pointer shrink-0"
                >
                  Đặt lại bộ lọc
                </button>
              )}
            </div>

            {/* Hàng Các Bộ Lọc Chuyên Sâu: Trạng thái (07 Tag), Ngày TN, ĐRL, Thời gian, Địa điểm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1 border-t border-slate-100">
              {/* 1. Trạng thái sự kiện theo đúng 07 Tag chuẩn */}
              <div className="space-y-1">
                <label
                  htmlFor="filter-status"
                  className="text-[11px] font-bold text-slate-600 font-eiu-display uppercase"
                >
                  Trạng thái Tag:
                </label>
                <select
                  id="filter-status"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9 px-2 bg-white border border-slate-300 rounded text-xs font-semibold text-[#133F68] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68]"
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="OPEN_ALL">
                    Đang mở đăng ký (tất cả)
                  </option>
                  <option value="Chưa mở đăng ký">Chưa mở đăng ký</option>
                  <option value="Đang mở đăng ký">Đang mở đăng ký</option>
                  <option value="Còn 5 ngày">Còn 5 ngày</option>
                  <option value="Còn 2 ngày">Còn 2 ngày</option>
                  <option value="Đã đóng đăng ký">Đã đóng đăng ký</option>
                  <option value="Đang diễn ra">Đang diễn ra</option>
                  <option value="Đã kết thúc">Đã kết thúc</option>
                </select>
              </div>

              {/* 2. Ngày tình nguyện: 0-1, 1.5-2, >2 */}
              <div className="space-y-1">
                <label
                  htmlFor="filter-volunteer-days"
                  className="text-[11px] font-bold text-slate-600 font-eiu-display uppercase"
                >
                  Ngày tình nguyện:
                </label>
                <select
                  id="filter-volunteer-days"
                  value={volunteerDaysFilter}
                  onChange={(e) => {
                    setVolunteerDaysFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9 px-2.5 bg-white border border-slate-300 rounded text-xs font-semibold text-[#133F68] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68]"
                >
                  <option value="ALL">Tất cả số ngày</option>
                  <option value="0_1">0 – 1 ngày</option>
                  <option value="1.5_2">1.5 – 2 ngày</option>
                  <option value="GT_2">&gt; 2 ngày</option>
                </select>
              </div>

              {/* 3. Điểm rèn luyện: Có/Không */}
              <div className="space-y-1">
                <label
                  htmlFor="filter-training-points"
                  className="text-[11px] font-bold text-slate-600 font-eiu-display uppercase"
                >
                  Điểm rèn luyện:
                </label>
                <select
                  id="filter-training-points"
                  value={trainingPointsFilter}
                  onChange={(e) => {
                    setTrainingPointsFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9 px-2.5 bg-white border border-slate-300 rounded text-xs font-semibold text-[#133F68] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68]"
                >
                  <option value="ALL">Tất cả</option>
                  <option value="YES">Có điểm rèn luyện</option>
                  <option value="NO">Không có điểm rèn luyện</option>
                </select>
              </div>

              {/* 4. Thời gian tổ chức: Sáng (7h30 - 11h30), Chiều (12h30 - 4h30), Tối (4h30 - 8h30), Nhiều ngày */}
              <div className="space-y-1">
                <label
                  htmlFor="filter-time-slot"
                  className="text-[11px] font-bold text-slate-600 font-eiu-display uppercase"
                >
                  Thời gian tổ chức:
                </label>
                <select
                  id="filter-time-slot"
                  value={timeSlotFilter}
                  onChange={(e) => {
                    setTimeSlotFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9 px-2.5 bg-white border border-slate-300 rounded text-xs font-semibold text-[#133F68] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68]"
                >
                  <option value="ALL">Tất cả khung giờ</option>
                  <option value="MORNING">Sáng (7h30 – 11h30)</option>
                  <option value="AFTERNOON">Chiều (12h30 – 4h30)</option>
                  <option value="EVENING">Tối (4h30 – 8h30)</option>
                  <option value="MULTI_DAY">Nhiều ngày</option>
                </select>
              </div>

              {/* 5. Địa điểm tổ chức: EIU, Thành phố Hồ Chí Minh, Khác */}
              <div className="space-y-1">
                <label
                  htmlFor="filter-location-area"
                  className="text-[11px] font-bold text-slate-600 font-eiu-display uppercase"
                >
                  Địa điểm tổ chức:
                </label>
                <select
                  id="filter-location-area"
                  value={locationAreaFilter}
                  onChange={(e) => {
                    setLocationAreaFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9 px-2 bg-white border border-slate-300 rounded text-xs font-semibold text-[#133F68] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68]"
                >
                  <option value="ALL">Tất cả địa điểm</option>
                  <option value="EIU">
                    Trường Đại học Quốc tế Miền Đông (EIU)
                  </option>
                  <option value="HCM">Thành phố Hồ Chí Minh</option>
                  <option value="OTHER">Địa điểm khác</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================================
            LƯỚI THẺ SỰ KIỆN 3 CỘT (TỐI ĐA 12 SỰ KIỆN / TRANG)
           ===================================================================== */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white border border-slate-200/90 p-10 text-center space-y-3.5 shadow-2xs">
            <p className="text-base font-bold text-[#133F68] font-eiu-display">
              Không tìm thấy chương trình nào phù hợp
            </p>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-sans">
              Không có sự kiện nào khớp với các bộ lọc hiện tại hoặc từ khóa
              &quot;{searchQuery}&quot;. Vui lòng thử lại với tiêu chí khác.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-[#133F68] hover:bg-[#0054A6] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer font-eiu-display min-h-[38px]"
            >
              Xem toàn bộ {EVENT_ITEMS.length} sự kiện
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 transition-all duration-200 ease-out motion-reduce:transition-none ${
                isFiltering
                  ? 'opacity-40 translate-y-1'
                  : 'opacity-100 translate-y-0'
              }`}
            >
              {paginatedEvents.map((ev) => {
                const maxParticipants = Number(ev.maxParticipants) || 1;
                const registeredCount =
                  Number(ev.registeredCount) +
                  (registeredIds.includes(ev.id) ? 1 : 0);
                const fillPct = Math.min(
                  100,
                  Math.max(
                    0,
                    Math.round((registeredCount / maxParticipants) * 100)
                  )
                );
                const meta = getEventCardMeta(ev);
                const isAlreadyRegistered = registeredIds.includes(ev.id);

                return (
                  <article
                    key={ev.id}
                    className="bg-white border border-slate-200/90 hover:border-[#133F68] hover:-translate-y-1 hover:shadow-md transition-all duration-300 ease-out flex flex-col justify-between group motion-reduce:hover:translate-y-0"
                  >
                    {/* Header Thẻ Sự kiện: Chiều cao h-36 đồng bộ, các tag thu nhỏ còn 75%, click mở đăng ký sự kiện */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => openEventModal(ev)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openEventModal(ev);
                        }
                      }}
                      aria-label={`Mở phiếu đăng ký sự kiện: ${ev.title}`}
                      className="h-36 bg-[#02294E] eiu-arch-pattern text-white p-5 flex flex-col justify-between relative overflow-hidden cursor-pointer select-none transition-all duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900] focus-visible:ring-inset"
                    >
                      <div className="flex items-start justify-between gap-2 relative z-10 w-full pointer-events-none">
                        {/* Tag trạng thái sự kiện bên trái (07 Tag chuẩn, thu nhỏ còn 75% kích thước) */}
                        <div className="flex flex-col gap-1">
                          <span
                            className={`px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-wider font-eiu-display shrink-0 shadow-2xs ${meta.bgClass}`}
                          >
                            {meta.label}
                          </span>
                        </div>

                        {/* Cột các box bên phải (thu nhỏ còn 75% kích thước) */}
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="font-eiu-serif text-[9px] font-bold px-2 py-0.5 bg-white text-[#133F68] text-right shadow-2xs">
                            Tiêu chuẩn: {ev.sv5tCriterion}
                          </span>
                          <span className="font-eiu-serif text-[9px] font-bold px-2 py-0.5 bg-[#FCB900] text-[#02294E] text-right shadow-2xs">
                            +{Number(ev.baseVolunteerDays ?? 0).toFixed(1)} Ngày
                            TN
                          </span>
                          {ev.hasTrainingPoints && (
                            <span className="font-eiu-serif text-[9px] font-bold px-2 py-0.5 bg-[#EAE3D2] text-[#133F68] text-right shadow-2xs">
                              +{ev.trainingPoints ?? 1} ĐRL
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Thân thẻ: Tiêu đề, Vị trí, Thời gian font sans-serif & Cây tiến độ */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="text-[15.5px] font-bold text-[#133F68] leading-snug line-clamp-2 break-words font-eiu-display">
                          <button
                            type="button"
                            onClick={() => openEventModal(ev)}
                            className="text-left font-bold text-[#133F68] hover:text-[#C10230] transition-colors cursor-pointer w-full leading-snug line-clamp-2 break-words font-eiu-display focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0054A6] rounded-xs"
                          >
                            {ev.title}
                          </button>
                        </h3>

                        <p className="text-xs text-slate-600 flex items-center gap-1.5 min-w-0 font-sans">
                          <MapPin className="w-3.5 h-3.5 text-[#8E6D3E] shrink-0" />
                          <span className="line-clamp-1 truncate">
                            {ev.location}
                          </span>
                        </p>

                        <p className="text-xs text-slate-600 flex items-center gap-1.5 min-w-0 font-sans">
                          <Clock className="w-3.5 h-3.5 text-[#8E6D3E] shrink-0" />
                          <span className="line-clamp-1 truncate">
                            {formatEventTimeRange(ev.startTime, ev.endTime)}
                          </span>
                        </p>

                        {/* Cây số lượng đăng ký và Hạn đăng ký */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between text-[11px] text-slate-600 font-sans">
                            <span>
                              Đăng ký: {registeredCount}/{maxParticipants}
                            </span>
                            <span>{fillPct}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-200 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-700 ease-out ${
                                fillPct >= 100
                                  ? 'bg-[#51803A]'
                                  : fillPct >= 85
                                  ? 'bg-[#EEB31D]'
                                  : 'bg-[#0054A6]'
                              }`}
                              style={{ width: `${fillPct}%` }}
                            />
                          </div>
                          <div className="flex justify-end pt-0.5">
                            <span className="text-[11px] text-slate-500 font-sans">
                              Hạn đăng ký: {meta.deadline}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Chân thẻ: Nút bấm tương ứng 07 Tag (ĐĂNG KÝ NGAY / NHẬN GCN / ...) */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => openEventModal(ev)}
                          className={`inline-flex items-center gap-1 font-bold uppercase font-eiu-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0054A6] rounded-xs group/link min-h-[36px] cursor-pointer ${
                            isAlreadyRegistered
                              ? 'text-[#51803A]'
                              : meta.isOpen
                              ? 'text-[#0054A6] hover:text-[#C10230]'
                              : meta.label === 'Đã kết thúc'
                              ? 'text-[#133F68] hover:text-[#C10230]'
                              : 'text-slate-600 hover:text-[#133F68]'
                          }`}
                        >
                          <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover/link:translate-x-0.5 motion-reduce:transition-none" />
                          <span>
                            {isAlreadyRegistered
                              ? '✓ ĐÃ ĐĂNG KÝ'
                              : meta.isOpen
                              ? 'ĐĂNG KÝ NGAY'
                              : meta.label === 'Đã kết thúc'
                              ? 'NHẬN GCN'
                              : meta.ctaText}
                          </span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* =====================================================================
                THANH CHUYỂN TRANG CĂN GIỮA ĐỒNG BỘ TRANG TIN TỨC (TRƯỚC 1 2 SAU)
               ===================================================================== */}
            {totalPages > 1 && (
              <nav
                aria-label="Phân trang danh sách sự kiện"
                className="pt-6 flex items-center justify-center gap-1.5"
              >
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => handlePageChange(Math.max(1, safePage - 1))}
                  aria-label="Trang trước"
                  className="h-10 px-4 bg-white border border-slate-300 hover:border-[#133F68] hover:text-[#133F68] disabled:opacity-35 disabled:pointer-events-none text-[#133F68] text-xs font-bold uppercase tracking-wider font-eiu-display inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68]"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Trước</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => {
                    const isCurrent = pageNum === safePage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        aria-current={isCurrent ? 'page' : undefined}
                        aria-label={`Trang ${pageNum}`}
                        className={`w-10 h-10 text-xs font-bold font-eiu-display transition-colors cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C10230] ${
                          isCurrent
                            ? 'bg-[#C10230] text-white border border-[#C10230] shadow-xs'
                            : 'bg-white text-[#133F68] border border-slate-300 hover:border-[#133F68] hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}

                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, safePage + 1))
                  }
                  aria-label="Trang tiếp theo"
                  className="h-10 px-4 bg-white border border-slate-300 hover:border-[#133F68] hover:text-[#133F68] disabled:opacity-35 disabled:pointer-events-none text-[#133F68] text-xs font-bold uppercase tracking-wider font-eiu-display inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68]"
                >
                  <span>Sau</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </nav>
            )}
          </div>
        )}

        {/* =====================================================================
            MODAL DIALOG: PHIẾU ĐĂNG KÝ HOẶC NHẬN GCN CHUẨN NGHIỆP VỤ
           ===================================================================== */}
        {selectedModalEvent && modalMeta && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-event-title"
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeEventModal();
            }}
          >
            <div className="bg-white border-2 border-[#133F68] w-full max-w-2xl my-auto shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Header Modal */}
              <div className="bg-[#133F68] text-white px-5 sm:px-6 py-4 flex items-center justify-between gap-3 border-b-3 border-[#A68556]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 bg-[#FCB900] rounded-full inline-block" />
                  <span className="text-xs font-bold uppercase tracking-wider font-eiu-display">
                    {modalMeta.isOpen
                      ? 'Phiếu Đăng ký Tham gia Sự kiện'
                      : modalMeta.label === 'Đã kết thúc'
                      ? 'Thông tin Sự kiện và Nhận GCN Điện tử'
                      : 'Thông tin Chi tiết Sự kiện'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={closeEventModal}
                  aria-label="Đóng phiếu đăng ký"
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Thân Modal */}
              <div className="p-5 sm:p-6 space-y-5 text-xs max-h-[calc(90vh-120px)] overflow-y-auto">
                {/* Thông tin cơ bản sự kiện & Tag trạng thái chuẩn */}
                <div className="space-y-2 pb-3.5 border-b border-slate-200">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider font-eiu-display ${modalMeta.bgClass}`}
                    >
                      {modalMeta.label}
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#00BCFF] text-[#02294E] text-[10.5px] font-bold uppercase font-eiu-display">
                      {selectedModalEvent.category}
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#FCB900] text-[#02294E] text-[10.5px] font-bold uppercase font-eiu-display">
                      SV5T: {selectedModalEvent.sv5tCriterion}
                    </span>
                    {selectedModalEvent.hasTrainingPoints && (
                      <span className="px-2.5 py-0.5 bg-[#EAE3D2] text-[#133F68] text-[10.5px] font-bold font-eiu-serif">
                        +{selectedModalEvent.trainingPoints ?? 1} Điểm rèn luyện
                      </span>
                    )}
                  </div>

                  <h3
                    id="modal-event-title"
                    className="text-base sm:text-lg font-bold text-[#133F68] leading-snug font-eiu-display"
                  >
                    {selectedModalEvent.title}
                  </h3>

                  <div className="text-slate-600 space-y-1.5 pt-1 sm:text-[13px] font-sans">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#A68556] shrink-0" />
                      <span>
                        {formatEventTimeRange(
                          selectedModalEvent.startTime,
                          selectedModalEvent.endTime
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#8E6D3E] shrink-0" />
                      <span>{selectedModalEvent.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#0054A6] shrink-0" />
                      <span>
                        Đơn vị tổ chức: {selectedModalEvent.organizerUnit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Khối Quy đổi Ngày tình nguyện chuẩn Phụ lục 2 QĐ 09/QĐ-HSV */}
                <div className="bg-[#F8FAFC] border border-slate-200 p-4 space-y-3">
                  <div className="font-bold text-[#133F68] uppercase tracking-wider text-[11px] font-eiu-display flex items-center justify-between">
                    <span>Quy đổi Ngày tình nguyện (QĐ 09/QĐ-HSV)</span>
                    <span className="text-[#C10230] font-eiu-serif font-bold">
                      {selectedModalEvent.baseVolunteerDays.toFixed(1)} Ngày TN
                      gốc
                    </span>
                  </div>
                  <div className="text-slate-700 font-sans">
                    Nhóm hoạt động:{' '}
                    <strong>{selectedModalEvent.volunteerCategory}</strong>
                  </div>

                  {isMultiplierEligible ? (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="role-multiplier-select"
                        className="block font-bold text-slate-900 font-sans"
                      >
                        Chọn vai trò tham gia (Nhân hệ số 1 – 2 – 3):
                      </label>
                      <select
                        id="role-multiplier-select"
                        value={roleMultiplier}
                        onChange={(e) =>
                          setRoleMultiplier(
                            Number(e.target.value) as 1 | 2 | 3
                          )
                        }
                        className="w-full h-9.5 px-3 border border-slate-300 rounded bg-white text-slate-900 font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68]"
                      >
                        <option value={1}>
                          Hệ số ×1 — CTV hỗ trợ / Chiến sĩ / Sinh viên tham gia
                        </option>
                        <option value={2}>
                          Hệ số ×2 — Thành viên Ban Tổ chức chương trình
                        </option>
                        <option value={3}>
                          Hệ số ×3 — Trưởng / Phó các Ban, Đội, Đội hình BTC
                        </option>
                      </select>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-white border border-slate-200 text-slate-700 leading-relaxed font-sans">
                      <strong>Quy đổi cố định (Hệ số ×1):</strong> Ghi nhận cố
                      định{' '}
                      <strong className="font-eiu-serif text-[#C10230]">
                        +{selectedModalEvent.baseVolunteerDays.toFixed(1)}{' '}
                        ngày/lần
                      </strong>
                      .
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-sans">
                    <span className="font-bold text-slate-900">
                      Số ngày dự kiến ghi nhận:
                    </span>
                    <span className="text-base font-extrabold font-eiu-serif text-[#C10230]">
                      +{computedVolunteerDays.toFixed(1)} ngày TN
                    </span>
                  </div>
                </div>

                {/* Thông tin Hội viên SSO */}
                <div className="border border-slate-200 p-3.5 flex items-center justify-between gap-3 bg-white">
                  <div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold font-eiu-display tracking-wider">
                      Tài khoản Hội viên EIU SSO
                    </div>
                    <div className="font-bold text-[#133F68] text-sm font-eiu-display mt-0.5">
                      {currentPersona.fullName}
                    </div>
                    <div className="font-eiu-serif text-xs text-slate-600">
                      MSSV: {currentPersona.studentId} • {currentPersona.email}
                    </div>
                  </div>
                  <QrCode className="w-9 h-9 text-[#133F68] shrink-0" />
                </div>

                {/* Hành động Modal tùy theo 07 Tag */}
                {modalMeta.isOpen ? (
                  <div className="space-y-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleRegister(selectedModalEvent.id)}
                      className={`w-full py-3 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer font-eiu-display min-h-[44px] shadow-sm ${
                        isModalEventRegistered
                          ? 'bg-[#51803A] text-white hover:bg-[#436C2F]'
                          : 'bg-[#0054A6] hover:bg-[#133F68] text-white'
                      }`}
                    >
                      {isModalEventRegistered
                        ? '✓ Đã ghi nhận đăng ký & Cấp mã QR Check-in'
                        : 'Đăng ký ngay'}
                    </button>

                    {isModalEventRegistered && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium leading-relaxed font-sans">
                        Hồ sơ của <strong>{currentPersona.fullName}</strong> đã
                        được đồng bộ vào danh sách điểm danh QR. Bạn có thể mở mã
                        QR tại{' '}
                        <Link
                          href="/portal?tab=certs"
                          className="font-bold underline text-[#0054A6] hover:text-[#C10230]"
                        >
                          Sổ tay Hội viên
                        </Link>
                        .
                      </div>
                    )}
                  </div>
                ) : modalMeta.label === 'Đã kết thúc' ? (
                  <div className="p-4 bg-[#51803A]/10 border border-[#51803A]/30 border-t-3 border-t-[#51803A] space-y-2.5">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5 uppercase font-eiu-display">
                      <CheckCircle2 className="w-4 h-4 text-[#51803A]" />
                      <span>
                        Chương trình đã kết thúc & Ban hành Giấy chứng nhận
                      </span>
                    </div>
                    <p className="text-emerald-900/90 leading-relaxed font-sans">
                      {selectedModalEvent.decisionNumber
                        ? `Đã ban hành Quyết định số ${selectedModalEvent.decisionNumber} công nhận ngày tình nguyện và cấp E-Certificate có mã QR xác thực.`
                        : 'Sự kiện đã hoàn tất. Bạn có thể tra cứu và tải Giấy chứng nhận điện tử (E-Certificate) chính thức.'}
                    </p>
                    <Link
                      href={`/tra-cuu-gcn?q=${encodeURIComponent(
                        selectedModalEvent.decisionNumber ||
                          selectedModalEvent.title
                      )}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#133F68] hover:bg-[#0054A6] text-white text-xs font-bold uppercase tracking-wider font-eiu-display"
                    >
                      <span>Tra cứu và Tải GCN điện tử</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : modalMeta.label === 'Chưa mở đăng ký' ? (
                  <div className="p-4 bg-slate-100 border border-slate-300 border-t-3 border-t-slate-500 space-y-1.5 font-sans">
                    <div className="font-bold text-slate-800 uppercase font-eiu-display">
                      Chương trình chưa mở cổng đăng ký
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Sự kiện đang trong giai đoạn chuẩn bị và thẩm duyệt kế
                      hoạch. Cổng đăng ký sẽ mở trước ngày diễn ra theo thông báo
                      từ Ban Tổ chức.
                    </p>
                  </div>
                ) : modalMeta.label === 'Đã đóng đăng ký' ? (
                  <div className="p-4 bg-amber-50 border border-amber-300 border-t-3 border-t-[#EEB31D] space-y-1.5 font-sans">
                    <div className="font-bold text-amber-900 uppercase font-eiu-display">
                      Đã đóng cổng đăng ký tham gia
                    </div>
                    <p className="text-amber-800 leading-relaxed">
                      Chương trình đã chốt sĩ số tham gia để chuẩn bị công tác tổ
                      chức và lập danh sách điểm danh mã QR.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-blue-50 border border-blue-300 border-t-3 border-t-[#0054A6] space-y-1.5 font-sans">
                    <div className="font-bold text-[#0054A6] uppercase font-eiu-display">
                      Sự kiện đang diễn ra
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      Chương trình hiện đang diễn ra tại địa điểm tổ chức. Hội
                      viên tham gia vui lòng mở mã QR trên Sổ tay Hội viên để
                      quét điểm danh Check-in/Check-out tại cửa.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SuKienSearchBridge() {
  const searchParams = useSearchParams();
  const rawEvent = searchParams.get('event');
  const rawCrit = searchParams.get('criteria') as CriteriaFilter | null;

  const validCrit: CriteriaFilter =
    rawCrit && EVENT_CRITERIA_PILLS.some((p) => p.id === rawCrit)
      ? rawCrit
      : 'ALL';

  return (
    <SuKienContent
      key={`${validCrit}::${rawEvent || 'none'}`}
      initialEventId={rawEvent}
      initialCriteria={validCrit}
    />
  );
}

export default function SuKienPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1140px] mx-auto px-4 py-16 text-center text-sm text-slate-500 font-eiu-display">
          Đang tải chuyên trang Sự kiện HSV EIU...
        </div>
      }
    >
      <SuKienSearchBridge />
    </Suspense>
  );
}
