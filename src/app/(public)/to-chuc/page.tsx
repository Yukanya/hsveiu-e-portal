'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SubpageBanner } from '@/components/public/subpage-banner';
import {
  BRANCH_UNITS,
  CLUB_UNITS,
  FACULTY_METADATA,
} from '@/data/mock-data';
import { ClubCategory, FacultyCode } from '@/types';
import {
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Filter,
  MapPin,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';

type UnitMenuTab =
  | 'ALL_CLUBS'
  | 'CONG_DONG'
  | 'HOC_THUAT'
  | 'NGHE_THUAT'
  | 'THE_THAO'
  | 'BRANCHES_ALL'
  | 'BRANCHES_BBS'
  | 'BRANCHES_SET'
  | 'BRANCHES_CIT'
  | 'BRANCHES_SNS';

type CohortFilter = 'ALL' | 21 | 22 | 23 | 24 | 25 | 26;

interface MenuItemMeta {
  id: UnitMenuTab;
  group: 'CLUBS' | 'BRANCHES';
  label: string;
  count: number;
  heading: string;
  subtitle: string;
}

const MENU_ITEMS: MenuItemMeta[] = [
  {
    id: 'ALL_CLUBS',
    group: 'CLUBS',
    label: 'Tất cả CLB – Đội – Nhóm',
    count: 30,
    heading: 'DANH BẠ 30 CÂU LẠC BỘ – ĐỘI – NHÓM TRỰC THUỘC HỘI SINH VIÊN',
    subtitle:
      'Gồm 02 đơn vị nòng cốt trực thuộc Hội (CLB Sinh viên 5 tốt, Đội CTV Xung kích) và 28 CLB thuộc 04 khối lĩnh vực.',
  },
  {
    id: 'CONG_DONG',
    group: 'CLUBS',
    label: 'Khối Cộng đồng & Tình nguyện',
    count: 7,
    heading: 'KHỐI CÂU LẠC BỘ – ĐỘI CỘNG ĐỒNG & TÌNH NGUYỆN (07 ĐƠN VỊ)',
    subtitle:
      'Nòng cốt phong trào Sinh viên 5 Tốt, xung kích sự kiện, hiến máu nhân đạo, sơ cấp cứu và công tác xã hội.',
  },
  {
    id: 'HOC_THUAT',
    group: 'CLUBS',
    label: 'Khối Học thuật – Nghiên cứu',
    count: 6,
    heading: 'KHỐI CÂU LẠC BỘ HỌC THUẬT – NGHIÊN CỨU KHOA HỌC (06 ĐƠN VỊ)',
    subtitle:
      'Đồng hành cùng Giảng viên Mentor các Khoa, xác nhận sinh hoạt học thuật xét tiêu chí phụ Học tập tốt (09/QĐ-HSV).',
  },
  {
    id: 'NGHE_THUAT',
    group: 'CLUBS',
    label: 'Khối Văn hóa – Nghệ thuật',
    count: 10,
    heading: 'KHỐI CÂU LẠC BỘ – NHÓM VĂN HÓA & NGHỆ THUẬT (10 ĐƠN VỊ)',
    subtitle:
      'Âm nhạc, vũ đạo, dẫn chương trình (MC), nhiếp ảnh, cổ động và giao lưu văn hóa quốc tế tại EIU.',
  },
  {
    id: 'THE_THAO',
    group: 'CLUBS',
    label: 'Khối Thể dục – Thể thao',
    count: 7,
    heading: 'KHỐI CÂU LẠC BỘ THỂ DỤC – THỂ THAO SINH VIÊN (07 ĐƠN VỊ)',
    subtitle:
      'Rèn luyện thể chất định kỳ, kiểm tra chuẩn Sinh viên Khỏe (Phụ lục 1) và tuyển chọn đội tuyển thể thao EIU.',
  },
  {
    id: 'BRANCHES_ALL',
    group: 'BRANCHES',
    label: 'Tất cả 25 Chi hội (04 Khoa)',
    count: 25,
    heading: 'HỆ THỐNG 25 CHI HỘI TRỰC THUỘC 04 CỤM KHOA (KHÓA K21 – K26)',
    subtitle:
      'Theo dõi danh bạ Ban Chấp hành Chi hội và tiến độ thi đua Tập thể Sinh viên 5 Tốt (100% ĐK • ≥ 30% Đạt • 0 Kỷ luật).',
  },
  {
    id: 'BRANCHES_BBS',
    group: 'BRANCHES',
    label: 'Cụm Khoa Quản trị Kinh doanh',
    count: 6,
    heading: 'CỤM CHI HỘI KHOA QUẢN TRỊ KINH DOANH — BBS (06 CHI HỘI)',
    subtitle:
      'Cụm trưởng phụ trách: Đ/c Trịnh Thị Phương Thủy (Ủy viên BCH, Phó Ban Tổ chức và Xây dựng Hội).',
  },
  {
    id: 'BRANCHES_SET',
    group: 'BRANCHES',
    label: 'Cụm Khoa Kỹ thuật',
    count: 6,
    heading: 'CỤM CHI HỘI KHOA KỸ THUẬT — SET (06 CHI HỘI)',
    subtitle:
      'Cụm trưởng phụ trách: Đ/c Nguyễn Thanh Nhã (Ủy viên BCH, Phó Ban Tổ chức và Xây dựng Hội).',
  },
  {
    id: 'BRANCHES_CIT',
    group: 'BRANCHES',
    label: 'Cụm Khoa Công nghệ Thông tin',
    count: 7,
    heading: 'CỤM CHI HỘI KHOA CÔNG NGHỆ THÔNG TIN — CIT (07 CHI HỘI)',
    subtitle:
      'Cụm trưởng phụ trách: Đ/c Trần Nguyễn Quỳnh Trân (Ủy viên BKT, Phó Ban Tổ chức và Xây dựng Hội).',
  },
  {
    id: 'BRANCHES_SNS',
    group: 'BRANCHES',
    label: 'Cụm Khoa Khoa học Sức khỏe',
    count: 6,
    heading: 'CỤM CHI HỘI KHOA KHOA HỌC SỨC KHỎE — SNS (06 CHI HỘI)',
    subtitle:
      'Cụm trưởng phụ trách: Đ/c Phạm Thị Thanh Thủy (Ủy viên BTK, Phó Ban Tổ chức và Xây dựng Hội).',
  },
];

const COHORT_PILLS: { id: CohortFilter; label: string }[] = [
  { id: 'ALL', label: 'Tất cả Khóa' },
  { id: 21, label: 'Khóa K21' },
  { id: 22, label: 'Khóa K22' },
  { id: 23, label: 'Khóa K23' },
  { id: 24, label: 'Khóa K24' },
  { id: 25, label: 'Khóa K25' },
  { id: 26, label: 'Khóa K26' },
];

const CLUB_HEADER_COLORS: Record<ClubCategory, string> = {
  CONG_DONG: 'bg-[#0054A6]',
  HOC_THUAT: 'bg-[#133F68]',
  NGHE_THUAT: 'bg-[#B44625]',
  THE_THAO: 'bg-[#51803A]',
};

function ToChucContent({
  initialMenu,
  initialQuery,
}: {
  initialMenu: UnitMenuTab;
  initialQuery: string;
}) {
  const [activeMenu, setActiveMenu] = useState<UnitMenuTab>(initialMenu);
  const [search, setSearch] = useState(initialQuery);
  const [onlyRecruiting, setOnlyRecruiting] = useState(false);
  const [cohortFilter, setCohortFilter] = useState<CohortFilter>('ALL');

  const currentMenuMeta =
    MENU_ITEMS.find((m) => m.id === activeMenu) || MENU_ITEMS[0];
  const isBranchView = activeMenu.startsWith('BRANCHES_');

  const clubMenuItems = MENU_ITEMS.filter((m) => m.group === 'CLUBS');
  const branchMenuItems = MENU_ITEMS.filter((m) => m.group === 'BRANCHES');

  const filteredClubs = CLUB_UNITS.filter((c) => {
    const matchCategory =
      activeMenu === 'ALL_CLUBS' ||
      c.category === (activeMenu as ClubCategory);
    const matchRecruit = !onlyRecruiting || c.recruitmentOpen;
    const q = search.trim().toLowerCase();
    const matchText =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.shortName.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      (c.presidentName && c.presidentName.toLowerCase().includes(q));
    return matchCategory && matchRecruit && matchText;
  });

  const selectedFacultyCode = isBranchView
    ? (activeMenu.replace('BRANCHES_', '') as 'ALL' | FacultyCode)
    : 'ALL';

  const filteredBranches = BRANCH_UNITS.filter((b) => {
    const matchFaculty =
      selectedFacultyCode === 'ALL' || b.facultyCode === selectedFacultyCode;
    const matchCohort =
      cohortFilter === 'ALL' || b.cohortYear === cohortFilter;
    const q = search.trim().toLowerCase();
    const matchText =
      !q ||
      b.code.toLowerCase().includes(q) ||
      b.name.toLowerCase().includes(q) ||
      b.clusterLeaderName.toLowerCase().includes(q) ||
      (b.branchPresidentName &&
        b.branchPresidentName.toLowerCase().includes(q));
    return matchFaculty && matchCohort && matchText;
  });

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <SubpageBanner
        kicker="BAN TỔ CHỨC VÀ XÂY DỰNG HỘI — 55 CƠ SỞ HỘI TRỰC THUỘC"
        title="Hệ thống 25 Chi hội & 30 Câu lạc bộ – Đội – Nhóm"
        subtitle="Mạng lưới cơ sở Hội trải rộng trên 04 Cụm Khoa (Khóa K21 – K26) và 04 Khối Câu lạc bộ học thuật, nghệ thuật, thể thao, tình nguyện"
        breadcrumbs={[
          { label: 'Chi hội & CLB', href: '/to-chuc' },
          { label: currentMenuMeta.label },
        ]}
      />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-9">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI (3/12): Menu dọc chia 02 khối rõ ràng */}
          <aside
            aria-label="Phân loại Chi hội và Câu lạc bộ"
            className="lg:col-span-3 space-y-5"
          >
            {/* Khối 1: 30 CLB - Đội - Nhóm */}
            <div className="bg-white border border-slate-200">
              <div className="bg-[#133F68] text-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider font-eiu-display">
                Khối 30 CLB – Đội – Nhóm
              </div>
              <div className="divide-y divide-white">
                {clubMenuItems.map((item) => {
                  const isSelected = activeMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveMenu(item.id)}
                      aria-current={isSelected ? 'page' : undefined}
                      className={`w-full text-left px-4 py-3 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#C10230] text-white font-bold'
                          : 'bg-[#EAE3D2] text-slate-900 hover:bg-[#dfd5be]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 font-bold ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-white/80 text-[#133F68]'
                        }`}
                      >
                        {String(item.count).padStart(2, '0')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Khối 2: 25 Chi hội - 04 Cụm Khoa */}
            <div className="bg-white border border-slate-200">
              <div className="bg-[#133F68] text-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider font-eiu-display">
                Khối 25 Chi hội – 04 Khoa
              </div>
              <div className="divide-y divide-white">
                {branchMenuItems.map((item) => {
                  const isSelected = activeMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveMenu(item.id)}
                      aria-current={isSelected ? 'page' : undefined}
                      className={`w-full text-left px-4 py-3 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#C10230] text-white font-bold'
                          : 'bg-[#EAE3D2] text-slate-900 hover:bg-[#dfd5be]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 font-bold ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-white/80 text-[#133F68]'
                        }`}
                      >
                        {String(item.count).padStart(2, '0')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hộp Phụ trách Cụm */}
            <div className="bg-[#C10230] text-white p-5 space-y-2">
              <div className="w-8 h-0.5 bg-white" aria-hidden="true" />
              <div className="text-sm font-bold font-eiu-display">
                {isBranchView
                  ? 'Chỉ tiêu Tập thể SV5T'
                  : 'Điều phối Cụm 30 CLB'}
              </div>
              <p className="text-xs text-white/92 leading-relaxed">
                {isBranchView
                  ? 'Theo QĐ 09/QĐ-HSV (2026): 100% hội viên đăng ký phấn đấu, ít nhất 30% hội viên đạt SV5T cấp Trường và 0% vi phạm kỷ luật.'
                  : 'Phó Ban TC-XDH phụ trách Cụm CLB/Đội/Nhóm: Đ/c Nguyễn Mỹ Hạnh (Chánh Văn phòng HSV). Mỗi đơn vị có BCN gồm 05 đồng chí.'}
              </p>
            </div>
          </aside>

          {/* CỘT PHẢI (9/12): Danh mục Đơn vị & Bộ lọc thông minh */}
          <div className="lg:col-span-9 space-y-5">
            {/* Header & Thanh tìm kiếm */}
            <div className="bg-white border border-slate-200 p-5 space-y-4 border-l-4 border-l-[#133F68]">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display">
                    {currentMenuMeta.heading}
                  </h2>
                  <p className="text-[13.5px] text-slate-600 mt-1 leading-relaxed">
                    {currentMenuMeta.subtitle}
                  </p>
                </div>

                <div className="relative w-full md:w-64 shrink-0">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={
                      isBranchView
                        ? 'Tìm mã Chi hội, Cụm trưởng...'
                        : 'Tìm tên CLB, mã, Chủ nhiệm...'
                    }
                    aria-label="Tìm kiếm đơn vị"
                    className="w-full h-9 pl-9 pr-3 bg-white border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Thanh lọc phụ tùy theo chế độ CLB hoặc Chi hội */}
              {!isBranchView ? (
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Filter className="w-3.5 h-3.5 text-[#0054A6]" />
                    <span>
                      Hiển thị{' '}
                      <strong className="font-mono text-[#133F68]">
                        {filteredClubs.length}
                      </strong>{' '}
                      đơn vị
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOnlyRecruiting(!onlyRecruiting)}
                    aria-pressed={onlyRecruiting}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer font-eiu-display ${
                      onlyRecruiting
                        ? 'bg-[#C10230] text-white border-[#C10230]'
                        : 'bg-[#F5F5F5] text-[#133F68] border-slate-300 hover:border-[#133F68]'
                    }`}
                  >
                    {onlyRecruiting
                      ? '✓ Đang lọc: Mở tuyển thành viên'
                      : 'Chỉ hiện CLB đang mở tuyển thành viên'}
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-[#133F68] mr-1 font-eiu-display">
                    Cụm Khóa:
                  </span>
                  {COHORT_PILLS.map((pill) => {
                    const active = cohortFilter === pill.id;
                    return (
                      <button
                        key={String(pill.id)}
                        type="button"
                        onClick={() => setCohortFilter(pill.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer font-eiu-display ${
                          active
                            ? 'bg-[#C10230] text-white border-[#C10230]'
                            : 'bg-[#F5F5F5] text-[#133F68] border-slate-300 hover:border-[#133F68]'
                        }`}
                      >
                        {pill.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {!isBranchView ? (
              /* ============================================================
                 CHẾ ĐỘ 1: LƯỚI 3 CỘT CHO 30 CLB – ĐỘI – NHÓM (KHÔNG LẶP TIÊU ĐỀ)
                 ============================================================ */
              filteredClubs.length === 0 ? (
                <div className="bg-white border border-slate-200 p-10 text-center space-y-3">
                  <p className="text-sm font-bold text-[#133F68] font-eiu-display">
                    Không tìm thấy Câu lạc bộ / Đội / Nhóm phù hợp
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setOnlyRecruiting(false);
                    }}
                    className="px-4 py-2 bg-[#133F68] text-white text-xs font-bold uppercase cursor-pointer"
                  >
                    Đặt lại bộ lọc
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {filteredClubs.map((club) => {
                    const headerBg = club.isCoreUnionUnit
                      ? 'bg-[#C10230]'
                      : CLUB_HEADER_COLORS[club.category];

                    return (
                      <article
                        key={club.id}
                        className="bg-white border border-slate-200 hover:border-[#133F68] transition-colors flex flex-col justify-between group"
                      >
                        {/* Architectural Graphic Card Header — CHỈ ĐẶT BADGE, MÃ ĐƠN VỊ & QUY MÔ (KHÔNG LẶP TÊN CLB) */}
                        <Link
                          href={`/to-chuc/${club.slug}`}
                          className={`h-29 p-4 flex flex-col justify-between text-white eiu-arch-pattern ${headerBg}`}
                        >
                          <div className="flex items-center justify-between gap-1.5">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider font-eiu-display ${
                                club.isCoreUnionUnit
                                  ? 'bg-[#FCB900] text-[#02294E]'
                                  : 'bg-[#00BCFF] text-[#02294E]'
                              }`}
                            >
                              {club.isCoreUnionUnit
                                ? 'ĐƠN VỊ NÒNG CỐT HSV'
                                : club.categoryLabel}
                            </span>

                            <span
                              className={`px-1.5 py-0.5 text-[9.5px] font-mono font-bold uppercase ${
                                club.recruitmentOpen
                                  ? 'bg-emerald-500/25 text-emerald-100 border border-emerald-300/40'
                                  : 'bg-black/25 text-white/75'
                              }`}
                            >
                              {club.recruitmentOpen
                                ? 'ĐANG TUYỂN'
                                : 'TẠM ĐÓNG'}
                            </span>
                          </div>

                          <div className="flex items-end justify-between gap-2 pt-2 border-t border-white/15">
                            <div className="font-mono text-xs font-bold tracking-wider text-[#DED1BE]">
                              #{String(club.stt).padStart(2, '0')} • {club.code}
                            </div>
                            <div className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-white">
                              <Users className="w-3.5 h-3.5 opacity-85" />
                              <span>{club.memberCount} TV</span>
                            </div>
                          </div>
                        </Link>

                        {/* Thân thẻ: Tên đơn vị duy nhất tại đây + Mô tả + Chủ nhiệm/Mentor */}
                        <div className="p-4 flex-1 flex flex-col justify-between gap-3.5">
                          <div className="space-y-1.5">
                            <Link href={`/to-chuc/${club.slug}`}>
                              <h3 className="text-[15px] font-bold text-[#133F68] group-hover:text-[#C10230] transition-colors leading-snug font-eiu-display">
                                {club.name}
                              </h3>
                            </Link>

                            {(club.presidentName || club.mentorName) && (
                              <div className="text-[11.5px] font-medium text-[#0054A6]">
                                {club.presidentName
                                  ? `${
                                      club.unitType === 'team'
                                        ? 'Đội trưởng'
                                        : 'Chủ nhiệm'
                                    }: Đ/c ${club.presidentName}`
                                  : `Mentor: ${club.mentorName}`}
                              </div>
                            )}

                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              {club.description}
                            </p>
                          </div>

                          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                            <Link
                              href={`/to-chuc/${club.slug}`}
                              className="inline-flex items-center gap-1 font-bold uppercase text-[#133F68] hover:text-[#C10230] font-eiu-display"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                              <span>TRANG ĐƠN VỊ</span>
                            </Link>
                            {club.fanpageUrl ? (
                              <a
                                href={club.fanpageUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-slate-500 hover:text-[#0054A6] font-medium"
                              >
                                <span>Fanpage</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[#A68556] font-semibold">
                                <Sparkles className="w-3 h-3" />
                                <span>Trực thuộc HSV</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )
            ) : (
              /* ============================================================
                 CHẾ ĐỘ 2: BẢNG HỌC THUẬT .eiu-table CHO 25 CHI HỘI 04 KHOA
                 ============================================================ */
              <div className="space-y-4">
                {selectedFacultyCode !== 'ALL' && (
                  <div className="bg-white border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-[#133F68] text-sm font-eiu-display">
                        {FACULTY_METADATA[selectedFacultyCode].nameVi} (
                        {FACULTY_METADATA[selectedFacultyCode].nameEn})
                      </div>
                      <div className="text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#C10230]" />
                          Văn phòng Khoa:{' '}
                          <strong>
                            {FACULTY_METADATA[selectedFacultyCode].officeRoom}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          Cụm trưởng:{' '}
                          <strong className="text-[#0054A6]">
                            {
                              FACULTY_METADATA[selectedFacultyCode]
                                .clusterLeaderName
                            }
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white border border-slate-300 overflow-x-auto">
                  <table className="eiu-table">
                    <thead>
                      <tr>
                        <th className="w-12 text-center">TT</th>
                        <th className="w-28">Mã Chi hội</th>
                        <th>Cụm Khoa &amp; Khóa tuyển sinh</th>
                        <th>Cụm trưởng / Chi hội trưởng</th>
                        <th className="w-56">Tiến độ Tập thể SV5T (≥ 30%)</th>
                        <th className="w-24 text-right">Hồ sơ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBranches.map((b, idx) => {
                        const isQualified =
                          b.sv5tRegisteredRate === 100 &&
                          b.sv5tAchievedRate >= 30 &&
                          !b.hasDisciplineViolation;

                        return (
                          <tr key={b.id}>
                            <td className="text-center font-mono text-xs text-slate-600">
                              {idx + 1}
                            </td>
                            <td className="font-mono font-bold text-[#133F68]">
                              <Link
                                href={`/to-chuc/${b.slug}`}
                                className="hover:text-[#C10230] hover:underline"
                              >
                                {b.code}
                              </Link>
                              <div className="text-[11px] font-normal text-slate-500">
                                {b.totalMembers} hội viên
                              </div>
                            </td>
                            <td className="text-xs text-slate-800">
                              <div className="font-semibold text-[#133F68]">
                                {FACULTY_METADATA[b.facultyCode].nameVi}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                Khóa 20{b.cohortYear} (K{b.cohortYear})
                              </div>
                            </td>
                            <td className="text-xs text-slate-700">
                              <div className="font-semibold text-slate-900">
                                {b.clusterLeaderName}
                              </div>
                              {b.branchPresidentName && (
                                <div className="text-[11px] text-[#0054A6]">
                                  CHT: Đ/c {b.branchPresidentName}
                                </div>
                              )}
                            </td>
                            <td>
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[11px] font-mono">
                                  <span
                                    className={`font-bold ${
                                      isQualified
                                        ? 'text-emerald-700'
                                        : 'text-[#C10230]'
                                    }`}
                                  >
                                    Đạt: {b.sv5tAchievedRate}% / 30%
                                  </span>
                                  <span className="text-slate-500">
                                    ĐK: {b.sv5tRegisteredRate}%
                                  </span>
                                </div>
                                <div className="w-full h-2 bg-slate-200 overflow-hidden">
                                  <div
                                    className={`h-full ${
                                      isQualified
                                        ? 'bg-[#51803A]'
                                        : 'bg-[#A68556]'
                                    }`}
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        Math.round(
                                          (b.sv5tAchievedRate / 45) * 100
                                        )
                                      )}%`,
                                    }}
                                  />
                                </div>
                                {isQualified && (
                                  <div className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Đạt chuẩn Tập thể SV5T</span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="text-right">
                              <Link
                                href={`/to-chuc/${b.slug}`}
                                className="inline-flex items-center gap-0.5 text-xs font-bold text-[#0054A6] hover:text-[#C10230] font-eiu-display"
                              >
                                <span>XEM</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function resolveInitialUnitMenu(
  tab: string | null,
  category: string | null,
  faculty: string | null
): UnitMenuTab {
  if (tab === 'branches' || faculty) {
    if (faculty === 'BBS') return 'BRANCHES_BBS';
    if (faculty === 'SET') return 'BRANCHES_SET';
    if (faculty === 'CIT') return 'BRANCHES_CIT';
    if (faculty === 'SNS') return 'BRANCHES_SNS';
    return 'BRANCHES_ALL';
  }
  if (
    category === 'CONG_DONG' ||
    category === 'HOC_THUAT' ||
    category === 'NGHE_THUAT' ||
    category === 'THE_THAO'
  ) {
    return category;
  }
  return 'ALL_CLUBS';
}

function ToChucSearchBridge() {
  const searchParams = useSearchParams();
  const initialMenu = resolveInitialUnitMenu(
    searchParams.get('tab'),
    searchParams.get('category'),
    searchParams.get('faculty')
  );
  const initialQuery = searchParams.get('q') || '';

  return (
    <ToChucContent
      key={`${initialMenu}::${initialQuery}`}
      initialMenu={initialMenu}
      initialQuery={initialQuery}
    />
  );
}

export default function ToChucPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1140px] mx-auto px-4 py-16 text-center text-sm text-slate-500">
          Đang tải hệ thống 25 Chi hội &amp; 30 Câu lạc bộ...
        </div>
      }
    >
      <ToChucSearchBridge />
    </Suspense>
  );
}
