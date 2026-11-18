'use client';

import React, { Suspense, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SubpageBanner } from '@/components/public/subpage-banner';
import {
  ContestCard,
  ContestExamModal,
  getContestCardMeta,
  useContestAttempts,
} from '@/components/shared/contest-system';
import { ONLINE_CONTESTS } from '@/data/mock-data';
import { OnlineContestItem } from '@/types';
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from 'lucide-react';

type CriteriaFilter = 'ALL' | OnlineContestItem['sv5tCriterion'];

const CONTEST_CRITERIA_PILLS: { id: CriteriaFilter; label: string }[] = [
  { id: 'ALL', label: 'TẤT CẢ' },
  { id: 'Học tập tốt', label: 'HỌC TẬP TỐT' },
  { id: 'Đạo đức tốt', label: 'ĐẠO ĐỨC TỐT' },
  { id: 'Thể lực tốt', label: 'THỂ LỰC TỐT' },
  { id: 'Tình nguyện tốt', label: 'TÌNH NGUYỆN TỐT' },
  { id: 'Hội nhập tốt', label: 'HỘI NHẬP TỐT' },
];

const CONTESTS_PER_PAGE = 12;

function matchesContestStatus(c: OnlineContestItem, filter: string): boolean {
  if (filter === 'ALL') return true;
  const meta = getContestCardMeta(c);
  if (filter === 'OPEN_ALL') return meta.isOpen;
  return meta.rawTag === filter || meta.label === filter;
}

function matchesContestDuration(c: OnlineContestItem, filter: string): boolean {
  if (filter === 'ALL') return true;
  if (filter === 'SHORT') return c.durationMinutes <= 15;
  if (filter === 'MEDIUM')
    return c.durationMinutes > 15 && c.durationMinutes <= 30;
  if (filter === 'LONG') return c.durationMinutes > 30;
  return true;
}

function matchesTrainingPoints(c: OnlineContestItem, filter: string): boolean {
  if (filter === 'ALL') return true;
  if (filter === 'YES') return Boolean(c.hasTrainingPoints);
  if (filter === 'NO') return !c.hasTrainingPoints;
  return true;
}

function matchesBenefit(c: OnlineContestItem, filter: string): boolean {
  if (filter === 'ALL') return true;
  if (filter === 'VOLUNTEER') return c.baseVolunteerDays > 0;
  if (filter === 'CERT') return Boolean(c.decisionNumber) || c.statusTag === 'Đã kết thúc';
  if (filter === 'SV5T') return Boolean(c.sv5tCriterion);
  return true;
}

function CuocThiContent({
  initialContestId,
  initialCriteria,
}: {
  initialContestId: string | null;
  initialCriteria: CriteriaFilter;
}) {
  const gridTopRef = useRef<HTMLDivElement>(null);
  const { attempts, saveAttempt } = useContestAttempts();

  const [criteriaFilter, setCriteriaFilter] =
    useState<CriteriaFilter>(initialCriteria);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [topicFilter, setTopicFilter] = useState<string>('ALL');
  const [trainingPointsFilter, setTrainingPointsFilter] =
    useState<string>('ALL');
  const [durationFilter, setDurationFilter] = useState<string>('ALL');
  const [benefitFilter, setBenefitFilter] = useState<string>('ALL');

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const activeDropdownFilterCount = [
    statusFilter !== 'ALL' && statusFilter !== 'OPEN_ALL',
    topicFilter !== 'ALL',
    trainingPointsFilter !== 'ALL',
    durationFilter !== 'ALL',
    benefitFilter !== 'ALL',
  ].filter(Boolean).length;

  const [selectedModalContest, setSelectedModalContest] =
    useState<OnlineContestItem | null>(() => {
      if (initialContestId) {
        return (
          ONLINE_CONTESTS.find((c) => c.id === initialContestId) || null
        );
      }
      return null;
    });

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
    setTopicFilter('ALL');
    setTrainingPointsFilter('ALL');
    setDurationFilter('ALL');
    setBenefitFilter('ALL');
    setSearchQuery('');
    setCurrentPage(1);
    setTimeout(() => setIsFiltering(false), 180);
  };

  const hasActiveFilter =
    criteriaFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    topicFilter !== 'ALL' ||
    trainingPointsFilter !== 'ALL' ||
    durationFilter !== 'ALL' ||
    benefitFilter !== 'ALL' ||
    Boolean(searchQuery.trim());

  const openContestModal = (c: OnlineContestItem) => {
    setSelectedModalContest(c);
    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.set('contest', c.id);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const closeContestModal = () => {
    setSelectedModalContest(null);
    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.delete('contest');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const filteredContests = ONLINE_CONTESTS.filter((c) => {
    const matchCrit =
      criteriaFilter === 'ALL' || c.sv5tCriterion === criteriaFilter;
    const matchStat = matchesContestStatus(c, statusFilter);
    const matchTopic = topicFilter === 'ALL' || c.topic === topicFilter;
    const matchPoints = matchesTrainingPoints(c, trainingPointsFilter);
    const matchDur = matchesContestDuration(c, durationFilter);
    const matchBen = matchesBenefit(c, benefitFilter);

    const q = searchQuery.trim().toLowerCase();
    const matchQ =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.topic.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      (c.decisionNumber && c.decisionNumber.toLowerCase().includes(q));

    return (
      matchCrit &&
      matchStat &&
      matchTopic &&
      matchPoints &&
      matchDur &&
      matchBen &&
      matchQ
    );
  });

  const totalPages = Math.ceil(filteredContests.length / CONTESTS_PER_PAGE);
  const safePage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
  const paginatedContests = filteredContests.slice(
    (safePage - 1) * CONTESTS_PER_PAGE,
    safePage * CONTESTS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      {/* BANNER KIẾN TRÚC EIU ĐỒNG BỘ 1-1 VỚI TRANG SỰ KIỆN */}
      <SubpageBanner
        kicker="THI TRỰC TUYẾN • ĐỒNG BỘ SỔ TAY SV5T • CẤP E-CERTIFICATE CHỐNG GIẢ MẠO"
        title="CUỘC THI TRỰC TUYẾN"
        subtitle="Tổng hợp các cuộc thi trắc nghiệm tìm hiểu kiến thức, học thuật và kỹ năng dành cho Sinh viên trường Đại học Quốc tế Miền Đông."
        breadcrumbs={[
          { label: 'Sự kiện', href: '/su-kien' },
          { label: 'Cuộc thi trực tuyến' },
        ]}
      />

      <div
        ref={gridTopRef}
        className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-9 space-y-8 scroll-mt-24"
      >
        {/* BỘ LỌC ĐA TIÊU CHÍ: PILLS TIÊU CHUẨN SV5T & BỘ LỌC 5 Ô */}
        <div className="space-y-4">
          <div className="text-center space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display">
              DANH MỤC CUỘC THI TRỰC TUYẾN
            </h2>

            <div
              role="tablist"
              aria-label="Lọc Cuộc thi theo Tiêu chuẩn Sinh viên 5 Tốt"
              className="flex flex-wrap items-center justify-center gap-2 pt-1"
            >
              {CONTEST_CRITERIA_PILLS.map((pill) => {
                const isSelected = criteriaFilter === pill.id;
                const count =
                  pill.id === 'ALL'
                    ? ONLINE_CONTESTS.length
                    : ONLINE_CONTESTS.filter(
                        (c) => c.sv5tCriterion === pill.id
                      ).length;

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

          {/* Hộp Tìm kiếm & Bộ lọc 5 tiêu chí */}
          <div className="bg-white border border-slate-200 p-4 space-y-3.5 shadow-2xs">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="contest-search-input"
                  name="q"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Tìm kiếm cuộc thi theo tên, chủ đề..."
                  aria-label="Tìm kiếm cuộc thi"
                  className="w-full h-10 pl-9 pr-10 bg-white border border-slate-300 rounded text-xs sm:text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68] focus-visible:border-transparent placeholder:text-slate-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                    aria-label="Xóa từ khóa tìm kiếm"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
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
                  <span>Đang mở thi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowMobileFilters((prev) => !prev)}
                  aria-expanded={showMobileFilters}
                  className="sm:hidden px-3.5 h-10 rounded text-xs font-bold uppercase tracking-wider font-eiu-display border border-slate-300 bg-white text-[#133F68] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>
                    Bộ lọc chi tiết
                    {activeDropdownFilterCount > 0
                      ? ` (${activeDropdownFilterCount})`
                      : ''}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      showMobileFilters ? 'rotate-180' : ''
                    }`}
                  />
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
            </div>

            {/* Hàng 5 Bộ Lọc Chuyên Sâu (Căn giữa chữ dọc với appearance-none + ChevronDown) */}
            <div
              className={`${
                showMobileFilters || activeDropdownFilterCount > 0
                  ? 'grid'
                  : 'hidden sm:grid'
              } grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1 border-t border-slate-100`}
            >
              {/* 1. Trạng thái Tag */}
              <div className="space-y-1">
                <label
                  htmlFor="contest-filter-status"
                  className="block text-[11px] font-bold text-slate-600 font-eiu-display uppercase"
                >
                  Trạng thái Tag:
                </label>
                <div className="relative">
                  <select
                    id="contest-filter-status"
                    value={statusFilter === 'OPEN_ALL' ? 'ALL' : statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-9 pl-2.5 pr-8 py-0 bg-white border border-slate-300 rounded text-xs font-semibold text-[#133F68] appearance-none leading-normal cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68]"
                  >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="Chưa mở đăng ký">Chưa mở thi</option>
                    <option value="Đang mở đăng ký">Đang mở thi</option>
                    <option value="Còn 5 ngày">Còn 5 ngày</option>
                    <option value="Còn 2 ngày">Còn 2 ngày</option>
                    <option value="Đã đóng đăng ký">Đã đóng bài thi</option>
                    <option value="Đang diễn ra">Đang diễn ra</option>
                    <option value="Đã kết thúc">Đã kết thúc</option>
                  </select>
                  <ChevronDown
                    className="w-3.5 h-3.5 text-[#133F68] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* 2. Chủ đề cuộc thi */}
              <div className="space-y-1">
                <label
                  htmlFor="contest-filter-topic"
                  className="block text-[11px] font-bold text-slate-600 font-eiu-display uppercase"
                >
                  Chủ đề cuộc thi:
                </label>
                <div className="relative">
                  <select
                    id="contest-filter-topic"
                    value={topicFilter}
                    onChange={(e) => {
                      setTopicFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-9 pl-2.5 pr-8 py-0 bg-white border border-slate-300 rounded text-xs font-semibold text-[#133F68] appearance-none leading-normal cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68]"
                  >
                    <option value="ALL">Tất cả chủ đề</option>
                    <option value="Lý luận và Quy chế Hội">
                      Lý luận và Quy chế Hội
                    </option>
                    <option value="Học thuật và Chuyên môn">
                      Học thuật và Chuyên môn
                    </option>
                    <option value="Hội nhập và Ngoại ngữ">
                      Hội nhập và Ngoại ngữ
                    </option>
                    <option value="Phát triển bền vững và Kỹ năng">
                      Phát triển bền vững và Kỹ năng
                    </option>
                  </select>
                  <ChevronDown
                    className="w-3.5 h-3.5 text-[#133F68] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* 3. Điểm rèn luyện */}
              <div className="space-y-1">
                <label
                  htmlFor="contest-filter-training-points"
                  className="block text-[11px] font-bold text-slate-600 font-eiu-display uppercase"
                >
                  Điểm rèn luyện:
                </label>
                <div className="relative">
                  <select
                    id="contest-filter-training-points"
                    value={trainingPointsFilter}
                    onChange={(e) => {
                      setTrainingPointsFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-9 pl-2.5 pr-8 py-0 bg-white border border-slate-300 rounded text-xs font-semibold text-[#133F68] appearance-none leading-normal cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68]"
                  >
                    <option value="ALL">Tất cả</option>
                    <option value="YES">Có điểm rèn luyện (+1 ĐRL)</option>
                    <option value="NO">Không có điểm rèn luyện</option>
                  </select>
                  <ChevronDown
                    className="w-3.5 h-3.5 text-[#133F68] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* 4. Thời lượng làm bài */}
              <div className="space-y-1">
                <label
                  htmlFor="contest-filter-duration"
                  className="block text-[11px] font-bold text-slate-600 font-eiu-display uppercase"
                >
                  Thời lượng làm bài:
                </label>
                <div className="relative">
                  <select
                    id="contest-filter-duration"
                    value={durationFilter}
                    onChange={(e) => {
                      setDurationFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-9 pl-2.5 pr-8 py-0 bg-white border border-slate-300 rounded text-xs font-semibold text-[#133F68] appearance-none leading-normal cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68]"
                  >
                    <option value="ALL">Tất cả thời lượng</option>
                    <option value="SHORT">Nhanh (≤ 15 phút)</option>
                    <option value="MEDIUM">Tiêu chuẩn (20 – 30 phút)</option>
                    <option value="LONG">Chuyên sâu (&gt; 30 phút)</option>
                  </select>
                  <ChevronDown
                    className="w-3.5 h-3.5 text-[#133F68] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* 5. Quyền lợi & Minh chứng */}
              <div className="space-y-1">
                <label
                  htmlFor="contest-filter-benefit"
                  className="block text-[11px] font-bold text-slate-600 font-eiu-display uppercase"
                >
                  Quyền lợi và Minh chứng:
                </label>
                <div className="relative">
                  <select
                    id="contest-filter-benefit"
                    value={benefitFilter}
                    onChange={(e) => {
                      setBenefitFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-9 pl-2.5 pr-8 py-0 bg-white border border-slate-300 rounded text-xs font-semibold text-[#133F68] appearance-none leading-normal cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68]"
                  >
                    <option value="ALL">Tất cả quyền lợi</option>
                    <option value="SV5T">Đồng bộ tiêu chí SV5T</option>
                    <option value="VOLUNTEER">Có cộng Ngày tình nguyện</option>
                    <option value="CERT">Đã cấp E-Certificate</option>
                  </select>
                  <ChevronDown
                    className="w-3.5 h-3.5 text-[#133F68] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LƯỚI THẺ CUỘC THI 3 CỘT (TỐI ĐA 12 CUỘC THI / TRANG) */}
        {filteredContests.length === 0 ? (
          <div className="bg-white border border-slate-200/90 p-10 text-center space-y-3.5 shadow-2xs">
            <p className="text-base font-bold text-[#133F68] font-eiu-display">
              Không tìm thấy cuộc thi nào phù hợp
            </p>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-sans">
              Không có cuộc thi nào khớp với các bộ lọc hiện tại hoặc từ khóa
              &quot;{searchQuery}&quot;. Vui lòng thử lại với tiêu chí khác.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-[#133F68] hover:bg-[#0054A6] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer font-eiu-display min-h-[38px]"
            >
              Xem toàn bộ {ONLINE_CONTESTS.length} cuộc thi
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
              {paginatedContests.map((contest) => (
                <ContestCard
                  key={contest.id}
                  contest={contest}
                  attempt={attempts[contest.id]}
                  onOpenModal={openContestModal}
                />
              ))}
            </div>

            {/* THANH CHUYỂN TRANG CĂN GIỮA ĐỒNG BỘ /su-kien & /tin-tuc */}
            {totalPages > 1 && (
              <nav
                aria-label="Phân trang danh sách cuộc thi"
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

        {/* MODAL PHÒNG THI TRỰC TUYẾN 2 BƯỚC + KẾT QUẢ / NHẬN GCN */}
        <ContestExamModal
          contest={selectedModalContest}
          attempt={
            selectedModalContest ? attempts[selectedModalContest.id] : undefined
          }
          onClose={closeContestModal}
          onSaveAttempt={saveAttempt}
        />
      </div>
    </div>
  );
}

function CuocThiSearchBridge() {
  const searchParams = useSearchParams();
  const contestParam = searchParams.get('contest');
  const critParam = searchParams.get('criteria');

  const validCrit: CriteriaFilter =
    CONTEST_CRITERIA_PILLS.find((p) => p.id === critParam)?.id || 'ALL';

  return (
    <CuocThiContent
      key={`${contestParam || 'none'}-${validCrit}`}
      initialContestId={contestParam}
      initialCriteria={validCrit}
    />
  );
}

export default function CuocThiPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center text-sm text-[#133F68] font-eiu-display">
          Đang tải danh sách Cuộc thi trực tuyến EIU...
        </div>
      }
    >
      <CuocThiSearchBridge />
    </Suspense>
  );
}
