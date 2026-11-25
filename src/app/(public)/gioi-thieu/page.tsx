'use client';

import React, { Suspense, useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { SubpageBanner } from '@/components/public/subpage-banner';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import {
  FACULTY_METADATA,
  STAFF_MEMBERS,
} from '@/data/mock-data';
import {
  CHI_HOI_SUMMARY_STATS,
  EIU_CLUBS_DIRECTORY,
  HSV_EIU_OVERVIEW,
  SCHOOL_ORG_DEPARTMENTS,
} from '@/data/about-data';
import { StaffMember } from '@/types';
import {
  ArrowRight,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  FileCheck2,
  Flag,
  GitBranch,
  Layers,
  MapPin,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
} from 'lucide-react';

type MainTabId = 'hsv-eiu' | 'co-cau';
type OrgBranchId = 'bch' | 'btk' | 'bkt' | 'tgpt' | 'vp' | 'tcxdh';

function normalizeStaffDisplayName(fullName: string): string {
  if (fullName === 'Trịnh Thị Phương Thủy') return 'Trịnh Thị Phương Thùy';
  if (fullName === 'Nguyễn Thị Thúy Nhi') return 'Nguyễn Thị Thùy Nhi';
  return fullName;
}

function StaffCompactCard({
  member,
  roleHighlight,
  subLabel,
  featured = false,
  onSelect,
}: {
  member: StaffMember;
  roleHighlight: string;
  subLabel?: string;
  featured?: boolean;
  onSelect: (m: StaffMember) => void;
}) {
  const displayName = normalizeStaffDisplayName(member.fullName);
  const initials = displayName
    .split(' ')
    .slice(-2)
    .map((n) => n[0])
    .join('');
  const facultyMeta = FACULTY_METADATA[member.facultyCode];

  return (
    <button
      type="button"
      onClick={() => onSelect(member)}
      className={`w-full text-left bg-white border transition-colors cursor-pointer group flex items-start gap-4 p-4 ${
        featured
          ? 'border-2 border-[#133F68] shadow-2xs'
          : 'border-slate-200 hover:border-[#133F68]'
      }`}
    >
      <div
        className={`${
          featured ? 'w-16 h-16 text-lg' : 'w-14 h-14 text-base'
        } shrink-0 bg-[#133F68] eiu-arch-pattern text-white flex flex-col items-center justify-center border-b-3 border-[#A68556]`}
      >
        <span className="font-bold font-eiu-display tracking-wide">
          {initials}
        </span>
        <span className="text-[11px] font-eiu-serif text-[#DED1BE] leading-none mt-0.5">
          {member.cohortYear ? `K${member.cohortYear}` : 'EIU'}
        </span>
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider font-eiu-display ${
              featured
                ? 'bg-[#C10230] text-white'
                : 'bg-[#0054A6]/10 text-[#0054A6]'
            }`}
          >
            {roleHighlight}
          </span>
          {member.positions.length > 1 && (
            <span className="px-1.5 py-0.5 bg-[#EAE3D2] text-[#133F68] font-eiu-serif text-[11px] font-bold">
              {member.positions.length} vị trí
            </span>
          )}
        </div>

        <div
          className={`${
            featured ? 'text-base' : 'text-[14.5px]'
          } font-bold text-[#133F68] group-hover:text-[#C10230] transition-colors font-eiu-display`}
        >
          Đ/c {displayName}
        </div>

        <div className="text-xs text-slate-700 leading-snug line-clamp-2 font-sans">
          {subLabel || member.internalDeptRole}
        </div>

        <div className="pt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] text-slate-600 font-sans">
          <span className="font-medium">
            {facultyMeta.shortCode} — {member.majorName}
          </span>
          <span aria-hidden="true">•</span>
          <span className="font-eiu-serif text-slate-500 break-all">
            {member.email}
          </span>
        </div>
      </div>
    </button>
  );
}

function GioiThieuContent({
  initialMainTab,
  initialBranch,
}: {
  initialMainTab: MainTabId;
  initialBranch: OrgBranchId;
}) {
  const [mainTab, setMainTabState] = useState<MainTabId>(initialMainTab);
  const [activeBranch, setActiveBranch] = useState<OrgBranchId>(initialBranch);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [posterFailed, setPosterFailed] = useState(false);

  const branchDetailRef = useRef<HTMLDivElement>(null);
  const staffModalRef = useRef<HTMLDivElement>(null);

  const setMainTab = useCallback((nextTab: MainTabId) => {
    setMainTabState(nextTab);
    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', nextTab);
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const selectOrgBranch = useCallback((branch: OrgBranchId, shouldScroll = false) => {
    setActiveBranch(branch);
    if (shouldScroll) {
      branchDetailRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  const closeStaffModal = useCallback(() => setSelectedStaff(null), []);
  useFocusTrap(Boolean(selectedStaff), staffModalRef, closeStaffModal);

  const president = STAFF_MEMBERS.find((m) => m.bchRole === 'Chủ tịch')!;
  const vicePresidents = STAFF_MEMBERS.filter(
    (m) =>
      m.bchRole === 'Phó Chủ tịch thường trực' || m.bchRole === 'Phó Chủ tịch'
  );
  const btkMembersOnly = STAFF_MEMBERS.filter(
    (m) => m.bchRole === 'Ủy viên Ban Thư ký'
  );
  const bchMembersOnly = STAFF_MEMBERS.filter(
    (m) => m.bchRole === 'Ủy viên Ban Chấp hành'
  );

  const bktHead = STAFF_MEMBERS.find(
    (m) => m.bktRole === 'Trưởng Ban Kiểm tra'
  )!;
  const bktDeputy = STAFF_MEMBERS.find(
    (m) => m.bktRole === 'Phó trưởng Ban Kiểm tra'
  )!;
  const bktMembers = STAFF_MEMBERS.filter(
    (m) => m.bktRole === 'Ủy viên Ban Kiểm tra'
  );

  const selectedDept = SCHOOL_ORG_DEPARTMENTS.find(
    (d) => d.id === activeBranch
  );

  const openStaffById = (staffId?: string) => {
    if (!staffId) return;
    const found = STAFF_MEMBERS.find((m) => m.id === staffId);
    if (found) setSelectedStaff(found);
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <SubpageBanner
        title={
          mainTab === 'hsv-eiu'
            ? 'HỘI SINH VIÊN TRƯỜNG ĐẠI HỌC QUỐC TẾ MIỀN ĐÔNG'
            : 'CƠ CẤU TỔ CHỨC CẤP TRƯỜNG KHÓA II (2026 – 2028)'
        }
        subtitle={
          mainTab === 'hsv-eiu'
            ? 'Sứ mệnh, vai trò, hành trình hình thành, dấu ấn Đại hội II và các chương trình tiêu biểu đồng hành cùng sinh viên EIU.'
            : 'Sơ đồ cây bộ máy lãnh đạo gồm Ban Chấp hành, Ban Thư ký, Ban Kiểm tra, Văn phòng Hội và các Ban Chuyên môn trực thuộc.'
        }
        breadcrumbs={[
          { label: 'Giới thiệu', href: '/gioi-thieu' },
          {
            label:
              mainTab === 'hsv-eiu'
                ? 'Hội Sinh viên EIU'
                : 'Cơ cấu tổ chức cấp trường',
          },
        ]}
      />

      {/* Thanh chuyển 02 tab chính ngay trên cùng 01 trang + lối tắt sang 02 trang còn lại */}
      <div className="bg-white border-b border-slate-200 sticky top-[78px] z-20">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label="Chuyển đổi nội dung Giới thiệu Hội Sinh viên EIU"
            className="flex items-center gap-2"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mainTab === 'hsv-eiu'}
              onClick={() => setMainTab('hsv-eiu')}
              className={`min-h-[44px] sm:min-h-[40px] px-4 sm:px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider font-eiu-display transition-colors cursor-pointer ${
                mainTab === 'hsv-eiu'
                  ? 'bg-[#C10230] text-white border border-[#C10230]'
                  : 'bg-white text-[#133F68] border border-slate-300 hover:border-[#133F68] hover:bg-[#EAE3D2]/40'
              }`}
            >
              Hội Sinh viên EIU
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={mainTab === 'co-cau'}
              onClick={() => setMainTab('co-cau')}
              className={`min-h-[44px] sm:min-h-[40px] px-4 sm:px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider font-eiu-display transition-colors cursor-pointer ${
                mainTab === 'co-cau'
                  ? 'bg-[#C10230] text-white border border-[#C10230]'
                  : 'bg-white text-[#133F68] border border-slate-300 hover:border-[#133F68] hover:bg-[#EAE3D2]/40'
              }`}
            >
              Cơ cấu tổ chức cấp trường
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-eiu-display">
            <Link
              href="/hoi-sinh-vien-viet-nam"
              className="px-3 py-1.5 text-[#0054A6] hover:text-[#C10230] font-bold hover:underline underline-offset-4"
            >
              Hội Sinh viên Việt Nam
            </Link>
            <span className="text-slate-300" aria-hidden="true">
              |
            </span>
            <Link
              href="/to-chuc?tab=chi-hoi"
              className="px-3 py-1.5 text-[#0054A6] hover:text-[#C10230] font-bold hover:underline underline-offset-4"
            >
              Chi hội và CLB – Đội – Nhóm
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-8 space-y-10">
        {/* =====================================================================
            TAB 1 (MẶC ĐỊNH): HỘI SINH VIÊN EIU
           ===================================================================== */}
        {mainTab === 'hsv-eiu' && (
          <div className="space-y-10">
            {/* 1. Khối Giới thiệu Đại hội II & Biểu trưng chính thức */}
            <section className="bg-white border border-slate-200 overflow-hidden shadow-2xs">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-5 bg-[#02294E] relative min-h-72 flex items-center justify-center p-5">
                  {!posterFailed ? (
                    <Image
                      src="/images/hsv-dai-hoi-2-poster.jpg"
                      alt="Biểu trưng Đại hội Đại biểu Hội Sinh viên Việt Nam Trường Đại học Quốc tế Miền Đông lần thứ II, nhiệm kỳ 2026 – 2028"
                      width={460}
                      height={460}
                      className="w-full max-w-[340px] h-auto object-contain border border-white/20 shadow-md"
                      onError={() => setPosterFailed(true)}
                    />
                  ) : (
                    <Image
                      src="/images/hsv-bch-dh2.png"
                      alt="Biểu trưng Đại hội II Hội Sinh viên EIU"
                      width={240}
                      height={290}
                      style={{ width: 'auto' }}
                      className="h-64 w-auto object-contain"
                    />
                  )}
                </div>

                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6">
                  <div className="space-y-4">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#133F68] font-eiu-display leading-snug text-balance">
                      {HSV_EIU_OVERVIEW.fullName}
                    </h2>

                    <div className="bg-[#F8FAFC] border border-slate-200 p-4 space-y-1.5">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#8E6D3E] font-eiu-display">
                        Khẩu hiệu hành động Đại hội II (2026 – 2028)
                      </div>
                      <p className="text-lg sm:text-xl font-eiu-serif italic font-bold text-[#C10230]">
                        “{HSV_EIU_OVERVIEW.actionSlogan}”
                      </p>
                      <p className="text-xs text-slate-600 font-sans pt-1">
                        Hình mẫu sinh viên EIU:{' '}
                        <strong className="text-[#133F68]">
                          {HSV_EIU_OVERVIEW.studentIdentitySlogan}
                        </strong>
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                      <div className="border border-slate-200 p-3 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-[#133F68] font-eiu-display uppercase">
                          <Calendar className="w-3.5 h-3.5 text-[#0054A6]" />
                          <span>Đại hội I (Thành lập)</span>
                        </div>
                        <div className="font-eiu-serif font-bold text-base text-[#133F68]">
                          Ngày {HSV_EIU_OVERVIEW.foundingCongressDate}
                        </div>
                        <div className="text-slate-600">
                          {HSV_EIU_OVERVIEW.foundingTerm}
                        </div>
                      </div>

                      <div className="border border-slate-200 p-3 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-[#133F68] font-eiu-display uppercase">
                          <Flag className="w-3.5 h-3.5 text-[#C10230]" />
                          <span>Đại hội đại biểu lần thứ II</span>
                        </div>
                        <div className="font-eiu-serif font-bold text-base text-[#C10230]">
                          Ngày {HSV_EIU_OVERVIEW.secondCongressDate}
                        </div>
                        <div className="text-slate-600">
                          {HSV_EIU_OVERVIEW.secondCongressVenue}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-slate-600 font-sans">
                      <MapPin className="w-4 h-4 text-[#A68556] shrink-0 mt-0.5" />
                      <span>
                        Trực thuộc <strong>{HSV_EIU_OVERVIEW.parentOrg}</strong>{' '}
                        • {HSV_EIU_OVERVIEW.officeLocation}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setMainTab('co-cau')}
                      className="min-h-[44px] px-5 py-2.5 bg-[#133F68] hover:bg-[#0054A6] text-white text-xs font-bold uppercase tracking-wider font-eiu-display inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span>Xem Cơ cấu tổ chức cấp trường</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      href="/to-chuc?tab=chi-hoi"
                      className="min-h-[44px] px-4 py-2.5 border border-[#133F68] text-[#133F68] hover:bg-[#133F68] hover:text-white text-xs font-bold uppercase tracking-wider font-eiu-display inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Chi hội và CLB – Đội – Nhóm</span>
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Sứ mệnh và Vai trò của Hội Sinh viên EIU */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <article className="bg-white border border-slate-200 border-t-3 border-t-[#133F68] p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#0054A6]" />
                  <h3 className="text-base font-bold uppercase text-[#133F68] font-eiu-display">
                    Sứ mệnh Đồng hành Sinh viên EIU
                  </h3>
                </div>
                <p className="text-[13.5px] text-slate-700 leading-relaxed font-sans">
                  {HSV_EIU_OVERVIEW.mission}
                </p>
              </article>

              <article className="bg-white border border-slate-200 border-t-3 border-t-[#C10230] p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#C10230]" />
                  <h3 className="text-base font-bold uppercase text-[#133F68] font-eiu-display">
                    Vai trò Tổ chức và Kết nối
                  </h3>
                </div>
                <p className="text-[13.5px] text-slate-700 leading-relaxed font-sans">
                  {HSV_EIU_OVERVIEW.role}
                </p>
              </article>
            </section>

            {/* 3. Các Dấu ấn nổi bật Nhiệm kỳ I (2024 – 2026) */}
            <section className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display">
                  Các Dấu ấn nổi bật Nhiệm kỳ I (2024 – 2026)
                </h2>
                <div className="w-12 h-1 bg-[#C10230]" aria-hidden="true" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {HSV_EIU_OVERVIEW.term1Highlights.map((item) => (
                  <div
                    key={item.label}
                    className="bg-white border border-slate-200 p-5 space-y-2"
                  >
                    <div className="text-2xl sm:text-[26px] font-extrabold font-eiu-serif text-[#0054A6] tabular-nums leading-none">
                      {item.figure}
                    </div>
                    <h3 className="text-xs font-bold uppercase text-[#133F68] font-eiu-display leading-snug">
                      {item.label}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Những Chương trình tiêu biểu của Hội Sinh viên EIU */}
            <section className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display">
                  Những Chương trình tiêu biểu
                </h2>
                <div className="w-12 h-1 bg-[#C10230]" aria-hidden="true" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {HSV_EIU_OVERVIEW.signaturePrograms.map((prog) => (
                  <article
                    key={prog.title}
                    className="bg-white border border-slate-200 p-5 sm:p-6 space-y-2.5"
                  >
                    <span className="inline-block px-2.5 py-0.5 bg-[#EAE3D2] text-[#133F68] text-[11px] font-bold uppercase font-eiu-display">
                      {prog.category}
                    </span>
                    <h3 className="text-base font-bold text-[#133F68] font-eiu-display leading-snug">
                      {prog.title}
                    </h3>
                    <p className="text-[13.5px] text-slate-700 leading-relaxed font-sans">
                      {prog.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {/* 5. Đại hội II (2026 – 2028): Công trình, Đề án và Hệ thống Chỉ tiêu */}
            <section className="bg-[#02294E] text-white eiu-arch-pattern border-t-4 border-t-[#A68556] p-6 sm:p-8 space-y-6">
              <div className="space-y-1.5">
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-white font-eiu-display">
                  Định hướng Nhiệm kỳ Đại hội II (2026 – 2028)
                </h2>
                <p className="text-[13.5px] text-[#DED1BE] font-sans">
                  Trọng tâm Đề án, Chương trình, Công trình thanh niên và Hệ
                  thống chỉ tiêu theo Văn kiện Đại hội đại biểu Hội Sinh viên
                  EIU lần thứ II.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {HSV_EIU_OVERVIEW.term2Flagships.map((flagship) => (
                  <div
                    key={flagship.type}
                    className="bg-[#133F68] border border-white/15 p-5 space-y-2"
                  >
                    <div className="text-xs font-bold uppercase tracking-wider text-[#FCB900] font-eiu-display">
                      {flagship.type}
                    </div>
                    <p className="text-[13.5px] text-white leading-relaxed font-sans font-medium">
                      “{flagship.title}”
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-white text-slate-800 p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <h3 className="text-sm font-bold uppercase text-[#133F68] font-eiu-display flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C10230]" />
                    <span>Chỉ tiêu trọng tâm Nhiệm kỳ 2026 – 2028</span>
                  </h3>
                  <Link
                    href="/van-ban"
                    className="text-xs font-bold text-[#0054A6] hover:text-[#C10230] inline-flex items-center gap-1 font-eiu-display uppercase"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Tra cứu văn bản quy chế</span>
                  </Link>
                </div>

                <ul className="space-y-2.5 text-[13.5px] text-slate-700 font-sans">
                  {HSV_EIU_OVERVIEW.term2KeyTargets.map((target) => (
                    <li key={target} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#51803A] shrink-0 mt-0.5" />
                      <span>{target}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        )}

        {/* =====================================================================
            TAB 2: CƠ CẤU TỔ CHỨC CẤP TRƯỜNG (SƠ ĐỒ CÂY TƯƠNG TÁC + DANH SÁCH)
           ===================================================================== */}
        {mainTab === 'co-cau' && (
          <div className="space-y-8">
            {/* Sơ đồ cây trực quan toàn chiều rộng */}
            <section className="bg-white border border-slate-200 border-t-3 border-t-[#133F68] p-5 sm:p-7 space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4">
                <div className="space-y-1">
                  <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display">
                    Sơ đồ Cây Cơ cấu Tổ chức Cấp Trường Khóa II
                  </h2>
                  <p className="text-xs sm:text-[13px] text-slate-600 font-sans">
                    Theo Quyết định công nhận BCH, BKT và Thông báo phân công
                    nhân sự các mảng công tác có hiệu lực từ 01/11/2026. Nhấp
                    vào từng nhánh trên sơ đồ để xem nhân sự chi tiết bên dưới.
                  </p>
                </div>
              </div>

              {/* Đỉnh cây: Đại hội Đại biểu HSV Trường */}
              <div className="flex flex-col items-center">
                <div className="w-full max-w-xl bg-[#02294E] text-white px-5 py-4 text-center border-b-4 border-[#A68556]">
                  <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wide font-eiu-display">
                    ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM TRƯỜNG ĐHQTMĐ
                  </div>
                  <div className="text-xs font-eiu-serif text-[#FCB900] mt-1">
                    Lần thứ II, Nhiệm kỳ 2026 – 2028 (Cơ quan lãnh đạo cao nhất)
                  </div>
                </div>

                {/* Trục dọc nối xuống Tầng 1 */}
                <div className="w-0.5 h-6 bg-[#133F68]" aria-hidden="true" />
                <div
                  className="hidden md:block w-[62%] h-0.5 bg-[#133F68]"
                  aria-hidden="true"
                />
              </div>

              {/* Tầng 1: Nhánh Ban Chấp hành -> Ban Thư ký và Nhánh Ban Kiểm tra */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch -mt-6">
                {/* Nhánh trái (7/12): Ban Chấp hành -> Ban Thư ký */}
                <div className="md:col-span-7 flex flex-col items-center">
                  <div
                    className="hidden md:block w-0.5 h-6 bg-[#133F68]"
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    onClick={() => selectOrgBranch('bch', true)}
                    className={`w-full text-left p-4 transition-colors cursor-pointer border-2 ${
                      activeBranch === 'bch'
                        ? 'bg-[#133F68] text-white border-[#C10230] shadow-md'
                        : 'bg-[#133F68] hover:bg-[#0054A6] text-white border-[#133F68]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider font-eiu-display text-[#00BCFF]">
                        Ban Chấp hành Hội Sinh viên Trường
                      </span>
                      <span className="px-2 py-0.5 bg-white/15 font-eiu-serif text-xs font-bold shrink-0">
                        15 đồng chí
                      </span>
                    </div>
                    <p className="text-xs text-white/90 mt-1.5 font-sans">
                      01 Chủ tịch • 01 Phó Chủ tịch thường trực • 01 Phó Chủ
                      tịch • 02 Ủy viên Ban Thư ký • 10 Ủy viên BCH
                    </p>
                  </button>

                  <div className="w-0.5 h-5 bg-[#0054A6]" aria-hidden="true" />

                  <button
                    type="button"
                    onClick={() => selectOrgBranch('btk', true)}
                    className={`w-full text-left p-4 transition-colors cursor-pointer border-2 ${
                      activeBranch === 'btk'
                        ? 'bg-[#0054A6] text-white border-[#FCB900] shadow-md'
                        : 'bg-[#0054A6] hover:bg-[#133F68] text-white border-[#0054A6]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider font-eiu-display text-[#FCB900]">
                        Ban Thư ký và Thường trực Hội
                      </span>
                      <span className="px-2 py-0.5 bg-white/20 font-eiu-serif text-xs font-bold shrink-0">
                        05 đồng chí
                      </span>
                    </div>
                    <p className="text-xs text-white/95 mt-1.5 leading-relaxed font-sans">
                      Chủ tịch: <strong>Trương Châu Phước Lộc</strong> • PCT TT:{' '}
                      <strong>Nguyễn Như Quỳnh</strong> • PCT:{' '}
                      <strong>Trần Thị Thu Huyền</strong> • 02 UV BTK:{' '}
                      <strong>Nguyễn Mai Gia Tường</strong>,{' '}
                      <strong>Phạm Thị Thanh Thủy</strong>
                    </p>
                  </button>
                </div>

                {/* Nhánh phải (5/12): Ban Kiểm tra */}
                <div className="md:col-span-5 flex flex-col items-center">
                  <div
                    className="hidden md:block w-0.5 h-6 bg-[#C10230]"
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    onClick={() => selectOrgBranch('bkt', true)}
                    className={`w-full flex-1 text-left p-4 flex flex-col justify-between transition-colors cursor-pointer border-2 ${
                      activeBranch === 'bkt'
                        ? 'bg-[#FFF5F7] border-[#C10230] shadow-md'
                        : 'bg-[#F8FAFC] hover:bg-[#EAE3D2]/50 border-[#C10230]'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase text-[#C10230] font-eiu-display">
                          <ShieldCheck className="w-4 h-4 shrink-0" />
                          <span>Ban Kiểm tra HSV Trường</span>
                        </span>
                        <span className="px-2 py-0.5 bg-[#C10230] text-white font-eiu-serif text-xs font-bold shrink-0">
                          05 đ/c
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans">
                        Kiểm tra thi hành Điều lệ Hội, Nghị quyết Đại hội II,
                        công tác tài chính – hội phí và bảo vệ quyền lợi hợp
                        pháp của hội viên.
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-200 text-xs text-slate-800 space-y-0.5 font-sans">
                      <div>
                        Trưởng ban:{' '}
                        <strong className="text-[#133F68]">
                          Đ/c Trần Thị Thu Huyền
                        </strong>
                      </div>
                      <div>
                        Phó Trưởng ban:{' '}
                        <strong className="text-[#133F68]">
                          Đ/c Đặng Trí Toàn
                        </strong>
                      </div>
                      <div>
                        03 Ủy viên: Nguyễn Thị Thùy Nhi, Trần Nguyễn Quỳnh Trân,
                        Lê Thị Hải Yến
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Trục nối xuống 03 Ban Chuyên môn và Văn phòng */}
              <div className="flex flex-col items-center -my-2">
                <div className="w-0.5 h-6 bg-[#133F68]" aria-hidden="true" />
                <div
                  className="hidden lg:block w-[68%] h-0.5 bg-[#133F68]"
                  aria-hidden="true"
                />
              </div>

              {/* Tầng 2: 03 Ban Chuyên môn và Văn phòng (phân công theo 03 Thường trực) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 -mt-4">
                {SCHOOL_ORG_DEPARTMENTS.map((dept) => {
                  const isActive = activeBranch === dept.id;
                  const IconComponent =
                    dept.id === 'tgpt'
                      ? GitBranch
                      : dept.id === 'vp'
                      ? Building2
                      : Layers;
                  return (
                    <div key={dept.id} className="flex flex-col items-center">
                      <div
                        className="hidden lg:block w-0.5 h-5 bg-[#133F68]"
                        aria-hidden="true"
                      />
                      <button
                        type="button"
                        onClick={() => selectOrgBranch(dept.id, true)}
                        className={`w-full flex-1 text-left p-4 flex flex-col justify-between gap-3 transition-colors cursor-pointer border-2 ${
                          isActive
                            ? 'bg-[#F0F6FC] border-[#C10230] shadow-md'
                            : 'bg-[#F8FAFC] hover:border-[#133F68] border-slate-300'
                        }`}
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2 py-0.5 bg-[#133F68] text-white text-[11px] font-eiu-serif font-bold">
                              {dept.badge}
                            </span>
                            <IconComponent className="w-4 h-4 text-[#0054A6]" />
                          </div>
                          <div className="text-sm font-bold text-[#133F68] font-eiu-display">
                            {dept.name}
                          </div>
                          <div className="bg-white border border-slate-200 p-2.5 text-xs space-y-1 font-sans">
                            <div className="text-[11px] font-bold uppercase text-[#8E6D3E] font-eiu-display">
                              Quản lý và Điều phối
                            </div>
                            <div className="font-bold text-[#133F68]">
                              Đ/c {dept.coordinatorName}
                            </div>
                            <div className="text-slate-600 text-[11.5px]">
                              {dept.coordinatorTitle}
                            </div>
                          </div>
                        </div>

                        <ul className="space-y-1 text-[11.5px] text-slate-600 pt-2 border-t border-slate-200 font-sans">
                          {dept.subDivisions.map((sd) => (
                            <li key={sd}>• {sd}</li>
                          ))}
                        </ul>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Trục nối xuống Cơ sở Hội trực thuộc (Link sang trang /to-chuc) */}
              <div className="flex flex-col items-center -my-2">
                <div className="w-0.5 h-6 bg-[#A68556]" aria-hidden="true" />
              </div>

              <div className="border-2 border-[#A68556] bg-[#FAF8F4] p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/to-chuc?tab=chi-hoi"
                  className="bg-white border border-slate-200 hover:border-[#133F68] p-4 flex items-center justify-between gap-3 group transition-colors"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase text-[#133F68] group-hover:text-[#C10230] font-eiu-display">
                      Hệ thống {CHI_HOI_SUMMARY_STATS.totalChiHoiAllCohorts} Chi
                      hội (04 Cụm Khoa)
                    </div>
                    <p className="text-xs text-slate-600 font-sans">
                      {CHI_HOI_SUMMARY_STATS.totalActiveBoardChiHoi} Chi hội có
                      BCH đang hoạt động •{' '}
                      {CHI_HOI_SUMMARY_STATS.totalMembers.toLocaleString(
                        'vi-VN'
                      )}{' '}
                      hội viên
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#0054A6] shrink-0 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/to-chuc?tab=clb"
                  className="bg-white border border-slate-200 hover:border-[#133F68] p-4 flex items-center justify-between gap-3 group transition-colors"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase text-[#133F68] group-hover:text-[#C10230] font-eiu-display">
                      Hệ thống CLB – Đội – Nhóm EIU ({EIU_CLUBS_DIRECTORY.length}{' '}
                      đơn vị)
                    </div>
                    <p className="text-xs text-slate-600 font-sans">
                      06 CLB/Đội trực thuộc Hội Sinh viên và các CLB Học thuật,
                      Nghệ thuật, Thể thao, Cộng đồng
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#0054A6] shrink-0 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </section>

            {/* Thanh chọn nhánh nhân sự chi tiết */}
            <section
              ref={branchDetailRef}
              className="scroll-mt-36 space-y-5"
            >
              <div
                role="tablist"
                aria-label="Chọn nhánh cơ cấu để xem danh sách nhân sự"
                className="flex flex-wrap items-center gap-2"
              >
                {(
                  [
                    { id: 'bch', label: 'Ban Chấp hành (15)' },
                    { id: 'btk', label: 'Ban Thư ký (05)' },
                    { id: 'bkt', label: 'Ban Kiểm tra (05)' },
                    { id: 'tgpt', label: 'Ban Tuyên giáo – Phong trào (19)' },
                    { id: 'vp', label: 'Văn phòng Hội (06)' },
                    { id: 'tcxdh', label: 'Ban Tổ chức – Xây dựng Hội (11)' },
                  ] as { id: OrgBranchId; label: string }[]
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={activeBranch === item.id}
                    onClick={() => selectOrgBranch(item.id, false)}
                    className={`min-h-[40px] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider font-eiu-display transition-colors cursor-pointer ${
                      activeBranch === item.id
                        ? 'bg-[#133F68] text-white border border-[#133F68]'
                        : 'bg-white text-[#133F68] border border-slate-300 hover:border-[#133F68] hover:bg-[#EAE3D2]/40'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Nội dung chi tiết: Ban Chấp hành */}
              {activeBranch === 'bch' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E6D3E] font-eiu-display">
                      I. Thường trực Hội Sinh viên Trường (03 đồng chí)
                    </h3>
                    <StaffCompactCard
                      member={president}
                      roleHighlight="Chủ tịch HSV Trường"
                      featured
                      onSelect={setSelectedStaff}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {vicePresidents.map((vp) => (
                        <StaffCompactCard
                          key={vp.id}
                          member={vp}
                          roleHighlight={`${vp.bchRole} HSV Trường`}
                          featured
                          onSelect={setSelectedStaff}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E6D3E] font-eiu-display">
                      II. Ủy viên Ban Thư ký (02 đồng chí)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {btkMembersOnly.map((m) => (
                        <StaffCompactCard
                          key={m.id}
                          member={m}
                          roleHighlight="Ủy viên Ban Thư ký"
                          onSelect={setSelectedStaff}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E6D3E] font-eiu-display">
                      III. Ủy viên Ban Chấp hành Hội Sinh viên Trường (10 đồng
                      chí)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {bchMembersOnly.map((m) => (
                        <StaffCompactCard
                          key={m.id}
                          member={m}
                          roleHighlight="Ủy viên Ban Chấp hành"
                          onSelect={setSelectedStaff}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Nội dung chi tiết: Ban Thư ký */}
              {activeBranch === 'btk' && (
                <div className="space-y-5">
                  <StaffCompactCard
                    member={president}
                    roleHighlight="Chủ tịch HSV Trường"
                    subLabel={president.internalDeptRole}
                    featured
                    onSelect={setSelectedStaff}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vicePresidents.map((vp) => (
                      <StaffCompactCard
                        key={vp.id}
                        member={vp}
                        roleHighlight={`${vp.bchRole} HSV Trường`}
                        subLabel={vp.internalDeptRole}
                        featured
                        onSelect={setSelectedStaff}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {btkMembersOnly.map((m) => (
                      <StaffCompactCard
                        key={m.id}
                        member={m}
                        roleHighlight="Ủy viên Ban Thư ký"
                        subLabel={m.internalDeptRole}
                        onSelect={setSelectedStaff}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Nội dung chi tiết: Ban Kiểm tra */}
              {activeBranch === 'bkt' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StaffCompactCard
                      member={bktHead}
                      roleHighlight="Trưởng Ban Kiểm tra"
                      subLabel="Phó Chủ tịch HSV Trường • Trưởng Ban Tổ chức và Xây dựng Hội"
                      featured
                      onSelect={setSelectedStaff}
                    />
                    <StaffCompactCard
                      member={bktDeputy}
                      roleHighlight="Phó Trưởng Ban Kiểm tra"
                      subLabel="Ủy viên BCH • Trưởng Ban Tuyên giáo – Phong trào (Mảng Tuyên giáo)"
                      featured
                      onSelect={setSelectedStaff}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {bktMembers.map((m) => (
                      <StaffCompactCard
                        key={m.id}
                        member={m}
                        roleHighlight="Ủy viên Ban Kiểm tra"
                        onSelect={setSelectedStaff}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Nội dung chi tiết: 03 Ban Chuyên môn và Văn phòng (từ Thông báo phân công PDF 3) */}
              {selectedDept && (
                <div className="bg-white border border-slate-200 p-5 sm:p-6 space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200">
                    <div className="space-y-1.5 max-w-2xl">
                      <h3 className="text-base sm:text-lg font-bold uppercase text-[#133F68] font-eiu-display">
                        {selectedDept.name}
                      </h3>
                      <p className="text-[13px] text-slate-600 leading-relaxed font-sans">
                        {selectedDept.summary}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openStaffById(selectedDept.coordinatorStaffId)}
                      className="bg-[#F8FAFC] hover:bg-[#EAE3D2]/50 border border-slate-300 px-4 py-3 text-left transition-colors cursor-pointer shrink-0"
                    >
                      <div className="text-[11px] font-bold uppercase text-[#8E6D3E] font-eiu-display">
                        Chủ chốt Quản lý và Điều phối
                      </div>
                      <div className="text-sm font-bold text-[#133F68] font-eiu-display mt-0.5">
                        Đ/c {selectedDept.coordinatorName}
                      </div>
                      <div className="text-xs text-slate-600 font-sans">
                        {selectedDept.coordinatorTitle}
                      </div>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {selectedDept.officers.map((officer, idx) => {
                      const isLeader =
                        officer.assignedPosition.startsWith('Trưởng') ||
                        officer.assignedPosition.startsWith('Chánh') ||
                        officer.assignedPosition.startsWith('Phó');
                      const clickable = Boolean(officer.staffId);
                      const CardTag = clickable ? 'button' : 'div';
                      return (
                        <CardTag
                          key={`${selectedDept.id}-${officer.fullName}-${idx}`}
                          {...(clickable
                            ? {
                                type: 'button' as const,
                                onClick: () => openStaffById(officer.staffId),
                              }
                            : {})}
                          className={`text-left border p-4 space-y-1.5 transition-colors ${
                            isLeader
                              ? 'bg-[#F8FAFC] border-[#133F68]/40'
                              : 'bg-white border-slate-200'
                          } ${
                            clickable
                              ? 'hover:border-[#133F68] cursor-pointer group'
                              : ''
                          }`}
                        >
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 text-[11px] font-bold uppercase font-eiu-display ${
                                officer.assignedPosition.startsWith('Trưởng') ||
                                officer.assignedPosition.startsWith('Chánh')
                                  ? 'bg-[#C10230] text-white'
                                  : isLeader
                                  ? 'bg-[#0054A6] text-white'
                                  : 'bg-[#EAE3D2] text-[#133F68]'
                              }`}
                            >
                              {officer.assignedPosition}
                            </span>
                          </div>
                          <div className="text-sm font-bold text-[#133F68] group-hover:text-[#C10230] font-eiu-display">
                            Đ/c {officer.fullName}
                          </div>
                          <div className="text-xs text-slate-600 font-sans">
                            {officer.currentRole}
                          </div>
                          {officer.division && (
                            <div className="pt-1 text-[11.5px] font-semibold text-[#0054A6] font-sans">
                              {officer.division}
                            </div>
                          )}
                        </CardTag>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {/* Modal Hồ sơ Cán bộ (Ẩn SĐT cá nhân & Ngày sinh theo quy tắc bảo mật công khai) */}
      {selectedStaff && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/65 flex items-center justify-center p-4 overflow-y-auto"
          onClick={closeStaffModal}
        >
          <div
            ref={staffModalRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Hồ sơ cán bộ ${normalizeStaffDisplayName(
              selectedStaff.fullName
            )}`}
            tabIndex={-1}
            className="bg-white max-w-xl w-full border-2 border-[#133F68] shadow-2xl overflow-hidden my-auto focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#133F68] text-white px-5 py-4 flex items-center justify-between gap-3 border-b-3 border-[#A68556]">
              <div className="flex items-center gap-3 min-w-0">
                <Award className="w-5 h-5 text-[#FCB900] shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-bold font-eiu-display truncate">
                    HỒ SƠ CÁN BỘ — Đ/c{' '}
                    {normalizeStaffDisplayName(selectedStaff.fullName)}
                  </div>
                  <div className="text-[11px] font-eiu-serif text-[#DED1BE] truncate">
                    {selectedStaff.email}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={closeStaffModal}
                aria-label="Đóng hồ sơ"
                className="w-11 h-11 -mr-2 rounded-full hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="divide-y divide-slate-200 text-xs max-h-[calc(90vh-90px)] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 p-3.5">
                <div className="sm:col-span-4 font-bold text-slate-800">
                  Khoa / Chuyên ngành:
                </div>
                <div className="sm:col-span-8 text-slate-800">
                  <strong>
                    {FACULTY_METADATA[selectedStaff.facultyCode].nameVi}
                  </strong>{' '}
                  — {selectedStaff.majorName} ({selectedStaff.academicYearText})
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 p-3.5">
                <div className="sm:col-span-4 font-bold text-slate-800">
                  Chức vụ BCH / BKT:
                </div>
                <div className="sm:col-span-8 text-[#133F68] font-semibold">
                  {selectedStaff.bchRole !== 'Không'
                    ? `${selectedStaff.bchRole} HSV Trường`
                    : 'Cán bộ chuyên môn'}
                  {selectedStaff.bktRole !== 'Không'
                    ? ` • ${selectedStaff.bktRole}`
                    : ''}
                </div>
              </div>
              {selectedStaff.youthUnionTitle !== 'Không' && (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 p-3.5">
                  <div className="sm:col-span-4 font-bold text-slate-800">
                    Chức vụ bên Đoàn:
                  </div>
                  <div className="sm:col-span-8 text-slate-700">
                    {selectedStaff.youthUnionTitle}
                  </div>
                </div>
              )}
              <div className="p-4 space-y-2.5 bg-[#F8FAFC]">
                <div className="font-bold uppercase tracking-wider text-[#133F68] flex items-center gap-1.5 font-eiu-display">
                  <Users className="w-3.5 h-3.5 text-[#0054A6]" />
                  <span>
                    Danh mục Vị trí và Kiêm nhiệm (
                    {selectedStaff.positions.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {selectedStaff.positions.map((pos) => (
                    <div
                      key={pos.id}
                      className="bg-white border border-slate-200 p-3 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-[#133F68]">
                          {pos.positionTitle}
                        </div>
                        <div className="text-[11px] text-slate-600">
                          {pos.unitName}
                          {pos.divisionName ? ` — ${pos.divisionName}` : ''}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-[#0054A6]/10 text-[#0054A6] font-eiu-serif text-[11px] font-bold shrink-0">
                        Cấp {pos.roleLevel}/6
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GioiThieuSearchBridge() {
  const searchParams = useSearchParams();
  const rawTab = (searchParams.get('tab') || '').trim().toLowerCase();

  const orgAliases: Record<string, OrgBranchId> = {
    'co-cau': 'bch',
    chart: 'bch',
    bch: 'bch',
    staff: 'bch',
    btk: 'btk',
    bkt: 'bkt',
    tgpt: 'tgpt',
    vp: 'vp',
    tcxdh: 'tcxdh',
  };

  const isOrgTab = Boolean(orgAliases[rawTab]);
  const initialMainTab: MainTabId = isOrgTab ? 'co-cau' : 'hsv-eiu';
  const initialBranch: OrgBranchId = orgAliases[rawTab] || 'bch';

  return (
    <GioiThieuContent
      key={`${initialMainTab}::${initialBranch}`}
      initialMainTab={initialMainTab}
      initialBranch={initialBranch}
    />
  );
}

export default function GioiThieuPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1140px] mx-auto px-4 py-16 text-center text-sm text-slate-500">
          Đang tải chuyên trang Giới thiệu Hội Sinh viên EIU...
        </div>
      }
    >
      <GioiThieuSearchBridge />
    </Suspense>
  );
}
