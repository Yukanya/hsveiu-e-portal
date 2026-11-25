'use client';

import React, { Suspense, useCallback, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { SubpageBanner } from '@/components/public/subpage-banner';
import {
  CHI_HOI_CLUSTERS,
  CHI_HOI_LIST,
  CHI_HOI_SUMMARY_STATS,
  CLUB_GROUP_META,
  ClubDirectoryGroup,
  EIU_CLUBS_DIRECTORY,
  EIU_CLUBS_INTRO,
  EiuClubProfile,
} from '@/data/about-data';
import {
  Award,
  Building2,
  ExternalLink,
  FileCheck2,
  Globe,
  Mail,
  Search,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

type MainOrgTab = 'chi-hoi' | 'clb';
type ClusterFilter = 'ALL' | 'QTKD' | 'KT' | 'CNTT' | 'KHSK';
type ClubFilter = 'ALL' | 'HSV' | ClubDirectoryGroup;

function ClubCard({
  club,
  failedPhotos,
  failedLogos,
  onPhotoError,
  onLogoError,
}: {
  club: EiuClubProfile;
  failedPhotos: Record<string, boolean>;
  failedLogos: Record<string, boolean>;
  onPhotoError: (id: string) => void;
  onLogoError: (id: string) => void;
}) {
  const groupMeta = CLUB_GROUP_META.find((g) => g.id === club.group);
  const showPhoto = Boolean(club.photoUrl) && !failedPhotos[club.id];
  const showLogo = Boolean(club.logoUrl) && !failedLogos[club.id];

  return (
    <article
      className={`bg-white border flex flex-col justify-between overflow-hidden transition-colors ${
        club.isHsvAffiliated
          ? 'border-[#133F68]/45 border-t-3 border-t-[#C10230] shadow-2xs'
          : 'border-slate-200 hover:border-[#133F68]'
      }`}
    >
      <div>
        {/* Ảnh đại diện CLB + Logo vuông góc 0px */}
        <div className="relative h-40 w-full bg-[#02294E] eiu-arch-pattern overflow-hidden border-b border-slate-200">
          {showPhoto ? (
            <>
              <Image
                src={club.photoUrl as string}
                alt={club.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 360px"
                className="object-cover"
                onError={() => onPhotoError(club.id)}
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#02294E]/80 via-[#02294E]/20 to-transparent"
                aria-hidden="true"
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center p-4">
              {showLogo ? (
                <div className="bg-white/95 p-3 border border-white/20 shadow-xs">
                  <Image
                    src={club.logoUrl as string}
                    alt={`Logo ${club.name}`}
                    width={84}
                    height={84}
                    style={{ width: 'auto' }}
                    className="h-20 w-auto object-contain"
                    onError={() => onLogoError(club.id)}
                  />
                </div>
              ) : (
                <div className="text-center space-y-1">
                  <div className="text-xl font-extrabold font-eiu-display tracking-wider text-white">
                    {club.code}
                  </div>
                  <div className="text-[11px] font-eiu-serif text-[#FCB900]">
                    {groupMeta?.englishLabel}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Góc trên trái: Nhãn trực thuộc / nhóm */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
            {club.isHsvAffiliated ? (
              <span className="px-2 py-0.5 bg-[#C10230] text-white text-[10.5px] font-bold uppercase tracking-wider font-eiu-display">
                Trực thuộc HSV
              </span>
            ) : (
              <span
                className="px-2 py-0.5 text-white text-[10.5px] font-bold uppercase tracking-wider font-eiu-display"
                style={{ backgroundColor: groupMeta?.accent || '#133F68' }}
              >
                {groupMeta?.label}
              </span>
            )}
            {club.memberCountLabel && (
              <span className="px-2 py-0.5 bg-[#02294E]/90 text-[#FCB900] text-[10.5px] font-bold font-eiu-serif">
                {club.memberCountLabel}
              </span>
            )}
          </div>

          {/* Nếu có ảnh bìa và có logo riêng, ghim logo gọn góc dưới phải */}
          {showPhoto && showLogo && (
            <div className="absolute bottom-2.5 right-3 bg-white p-1.5 border border-slate-200 shadow-xs">
              <Image
                src={club.logoUrl as string}
                alt={`Logo ${club.name}`}
                width={38}
                height={38}
                style={{ width: 'auto' }}
                className="h-9 w-auto object-contain"
                onError={() => onLogoError(club.id)}
              />
            </div>
          )}
        </div>

        {/* Nội dung thông tin chung & mô tả */}
        <div className="p-5 space-y-3">
          <div className="space-y-0.5">
            <h3 className="text-[15px] font-bold text-[#133F68] leading-snug font-eiu-display">
              {club.name}
            </h3>
            {club.englishName && (
              <div className="text-xs text-slate-500 font-eiu-serif italic">
                {club.englishName}
              </div>
            )}
          </div>

          {club.slogan && (
            <div className="px-3 py-1.5 bg-[#FAF8F4] border border-[#EAE3D2] text-xs font-eiu-serif italic text-[#8E6D3E] font-semibold">
              “{club.slogan}”
            </div>
          )}

          <p className="text-[13px] text-slate-700 leading-relaxed font-sans">
            {club.description}
          </p>

          {/* Ban Chủ nhiệm / Ban Điều hành */}
          <div className="pt-2.5 border-t border-slate-100 space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#133F68] font-eiu-display">
              Ban Chủ nhiệm / Ban Điều hành
            </div>
            {club.boardMembers.length > 0 ? (
              <ul className="space-y-1 text-xs text-slate-700 font-sans">
                {club.boardMembers.map((bm, idx) => (
                  <li
                    key={`${club.id}-bm-${idx}`}
                    className="flex items-baseline justify-between gap-2"
                  >
                    <span className="text-slate-500 shrink-0">{bm.role}:</span>
                    <span className="font-semibold text-[#133F68] text-right">
                      {bm.fullName}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs italic text-slate-500 font-sans">
                Thông tin Ban Chủ nhiệm đang được cập nhật.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Chân thẻ: Liên hệ công khai (Email CLB / Fanpage — ẩn SĐT cá nhân) */}
      {(club.email || club.facebookUrl) && (
        <div className="px-5 py-3 bg-[#F8FAFC] border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs font-sans">
          {club.email ? (
            <a
              href={`mailto:${club.email}`}
              className="inline-flex items-center gap-1.5 text-slate-700 hover:text-[#0054A6] truncate max-w-full"
            >
              <Mail className="w-3.5 h-3.5 text-[#8E6D3E] shrink-0" />
              <span className="truncate">{club.email}</span>
            </a>
          ) : (
            <span />
          )}

          {club.facebookUrl && (
            <a
              href={club.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-[#0054A6] hover:text-[#C10230] shrink-0 font-eiu-display uppercase text-[11px]"
            >
              <span>Fanpage</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}
    </article>
  );
}

function ToChucContent({
  initialMainTab,
  initialClubFilter,
  initialClusterFilter,
}: {
  initialMainTab: MainOrgTab;
  initialClubFilter: ClubFilter;
  initialClusterFilter: ClusterFilter;
}) {
  const [mainTab, setMainTabState] = useState<MainOrgTab>(initialMainTab);
  const [clusterFilter, setClusterFilter] =
    useState<ClusterFilter>(initialClusterFilter);
  const [selectedChiHoiCode, setSelectedChiHoiCode] = useState<string | null>(
    null
  );
  const [showSeniorCohorts, setShowSeniorCohorts] = useState(false);

  const [clubFilter, setClubFilter] = useState<ClubFilter>(initialClubFilter);
  const [clubSearch, setClubSearch] = useState('');
  const [failedPhotos, setFailedPhotos] = useState<Record<string, boolean>>({});
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  const chiHoiDetailRef = useRef<HTMLDivElement>(null);

  const setMainTab = useCallback((nextTab: MainOrgTab) => {
    setMainTabState(nextTab);
    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', nextTab);
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const handleSelectChiHoiFromTree = (
    code: string,
    cluster: 'QTKD' | 'KT' | 'CNTT' | 'KHSK',
    hasActiveBoard: boolean
  ) => {
    setSelectedChiHoiCode(code);
    setClusterFilter(cluster);
    if (!hasActiveBoard) {
      setShowSeniorCohorts(true);
    }
    chiHoiDetailRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const visibleChiHoiList = useMemo(() => {
    return CHI_HOI_LIST.filter((ch) => {
      const matchCluster =
        clusterFilter === 'ALL' || ch.facultyCluster === clusterFilter;
      const matchBoard =
        showSeniorCohorts ||
        ch.hasActiveBoard ||
        ch.code === selectedChiHoiCode;
      return matchCluster && matchBoard;
    });
  }, [clusterFilter, showSeniorCohorts, selectedChiHoiCode]);

  const hsvClubs = useMemo(
    () => EIU_CLUBS_DIRECTORY.filter((c) => c.isHsvAffiliated),
    []
  );

  const filteredClubs = useMemo(() => {
    const q = clubSearch.trim().toLowerCase();
    return EIU_CLUBS_DIRECTORY.filter((club) => {
      const matchGroup =
        clubFilter === 'ALL'
          ? true
          : clubFilter === 'HSV'
          ? club.isHsvAffiliated
          : club.group === clubFilter;

      const matchQuery =
        !q ||
        club.name.toLowerCase().includes(q) ||
        (club.englishName && club.englishName.toLowerCase().includes(q)) ||
        club.code.toLowerCase().includes(q) ||
        club.description.toLowerCase().includes(q) ||
        club.boardMembers.some((bm) => bm.fullName.toLowerCase().includes(q));

      return matchGroup && matchQuery;
    });
  }, [clubFilter, clubSearch]);

  const filteredHsvClubs = useMemo(
    () => filteredClubs.filter((c) => c.isHsvAffiliated),
    [filteredClubs]
  );

  const filteredCampusClubs = useMemo(
    () => filteredClubs.filter((c) => !c.isHsvAffiliated),
    [filteredClubs]
  );

  const handlePhotoError = useCallback((id: string) => {
    setFailedPhotos((prev) => ({ ...prev, [id]: true }));
  }, []);

  const handleLogoError = useCallback((id: string) => {
    setFailedLogos((prev) => ({ ...prev, [id]: true }));
  }, []);

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <SubpageBanner
        title={
          mainTab === 'chi-hoi'
            ? 'HỆ THỐNG CHI HỘI SINH VIÊN EIU'
            : 'CÂU LẠC BỘ – ĐỘI – NHÓM SINH VIÊN EIU'
        }
        subtitle={
          mainTab === 'chi-hoi'
            ? 'Sơ đồ 04 Cụm Chi hội Khoa và danh bạ Ban Chấp hành các Chi hội trực thuộc Hội Sinh viên Trường Đại học Quốc tế Miền Đông.'
            : 'Danh bạ 06 Câu lạc bộ – Đội trực thuộc Hội Sinh viên Trường và hệ thống Câu lạc bộ Học thuật, Nghệ thuật, Thể thao, Cộng đồng tại EIU.'
        }
        breadcrumbs={[
          { label: 'Giới thiệu', href: '/gioi-thieu' },
          {
            label: mainTab === 'chi-hoi' ? 'Chi hội' : 'CLB – Đội – Nhóm',
          },
        ]}
      />

      {/* Thanh chuyển 02 tab Chi hội & CLB – Đội – Nhóm ngay trên cùng 01 trang */}
      <div className="bg-white border-b border-slate-200 sticky top-[78px] z-20">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label="Chuyển đổi giữa Chi hội và CLB - Đội - Nhóm"
            className="flex items-center gap-2"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mainTab === 'chi-hoi'}
              onClick={() => setMainTab('chi-hoi')}
              className={`min-h-[44px] sm:min-h-[40px] px-4 sm:px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider font-eiu-display transition-colors cursor-pointer ${
                mainTab === 'chi-hoi'
                  ? 'bg-[#C10230] text-white border border-[#C10230]'
                  : 'bg-white text-[#133F68] border border-slate-300 hover:border-[#133F68] hover:bg-[#EAE3D2]/40'
              }`}
            >
              Chi hội ({CHI_HOI_LIST.length})
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={mainTab === 'clb'}
              onClick={() => setMainTab('clb')}
              className={`min-h-[44px] sm:min-h-[40px] px-4 sm:px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider font-eiu-display transition-colors cursor-pointer ${
                mainTab === 'clb'
                  ? 'bg-[#C10230] text-white border border-[#C10230]'
                  : 'bg-white text-[#133F68] border border-slate-300 hover:border-[#133F68] hover:bg-[#EAE3D2]/40'
              }`}
            >
              CLB – Đội – Nhóm ({EIU_CLUBS_DIRECTORY.length})
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
              href="/gioi-thieu?tab=co-cau"
              className="px-3 py-1.5 text-[#0054A6] hover:text-[#C10230] font-bold hover:underline underline-offset-4"
            >
              Cơ cấu cấp trường
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* =====================================================================
            TAB 1: CHI HỘI (SƠ ĐỒ 04 CỤM KHOA + BAN CHẤP HÀNH CHI HỘI)
           ===================================================================== */}
        {mainTab === 'chi-hoi' && (
          <div className="space-y-8">
            {/* Tổng quan quy mô Chi hội theo bảng tổng hợp */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 border-t-3 border-t-[#133F68] p-4 space-y-1">
                <div className="text-2xl font-extrabold font-eiu-serif text-[#133F68] tabular-nums">
                  {CHI_HOI_SUMMARY_STATS.totalChiHoiAllCohorts}
                </div>
                <div className="text-xs font-bold uppercase text-[#133F68] font-eiu-display">
                  Tổng Chi hội (04 Cụm Khoa)
                </div>
                <div className="text-[11.5px] text-slate-600 font-sans">
                  Khóa K21 đến Khóa K26
                </div>
              </div>

              <div className="bg-white border border-slate-200 border-t-3 border-t-[#C10230] p-4 space-y-1">
                <div className="text-2xl font-extrabold font-eiu-serif text-[#C10230] tabular-nums">
                  {CHI_HOI_SUMMARY_STATS.totalActiveBoardChiHoi}
                </div>
                <div className="text-xs font-bold uppercase text-[#133F68] font-eiu-display">
                  Chi hội có BCH đương nhiệm
                </div>
                <div className="text-[11.5px] text-slate-600 font-sans">
                  Mỗi BCH gồm 05 đồng chí chuẩn y
                </div>
              </div>

              <div className="bg-white border border-slate-200 border-t-3 border-t-[#0054A6] p-4 space-y-1">
                <div className="text-2xl font-extrabold font-eiu-serif text-[#0054A6] tabular-nums">
                  {CHI_HOI_SUMMARY_STATS.totalMembers.toLocaleString('vi-VN')}
                </div>
                <div className="text-xs font-bold uppercase text-[#133F68] font-eiu-display">
                  Tổng số Hội viên
                </div>
                <div className="text-[11.5px] text-slate-600 font-sans">
                  Thực tế:{' '}
                  {CHI_HOI_SUMMARY_STATS.totalActualMembers.toLocaleString(
                    'vi-VN'
                  )}{' '}
                  hội viên
                </div>
              </div>

              <div className="bg-white border border-slate-200 border-t-3 border-t-[#51803A] p-4 space-y-1">
                <div className="text-2xl font-extrabold font-eiu-serif text-[#51803A] tabular-nums">
                  {CHI_HOI_SUMMARY_STATS.totalEliteMembers}
                </div>
                <div className="text-xs font-bold uppercase text-[#133F68] font-eiu-display">
                  Hội viên Ưu tú
                </div>
                <div className="text-[11.5px] text-slate-600 font-sans">
                  Lực lượng nòng cốt tại các Chi hội
                </div>
              </div>
            </section>

            {/* Sơ đồ cây 04 Cụm Chi hội Khoa */}
            <section className="bg-white border border-slate-200 border-t-3 border-t-[#133F68] p-5 sm:p-7 space-y-6">
              <div className="space-y-1 border-b border-slate-200 pb-4">
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display">
                  Sơ đồ Hệ thống Chi hội theo 04 Cụm Khoa
                </h2>
                <p className="text-xs sm:text-[13px] text-slate-600 font-sans">
                  Nhấp vào từng Chi hội trên sơ đồ để xem nhanh Ban Chấp hành
                  Chi hội và thông tin liên hệ bên dưới.
                </p>
              </div>

              {/* Đỉnh sơ đồ Chi hội */}
              <div className="flex flex-col items-center">
                <div className="w-full max-w-lg bg-[#133F68] text-white px-5 py-3.5 text-center border-b-3 border-[#A68556]">
                  <div className="text-xs sm:text-sm font-bold uppercase tracking-wide font-eiu-display">
                    BAN TỔ CHỨC VÀ XÂY DỰNG HỘI — 04 CỤM CHI HỘI KHOA
                  </div>
                  <div className="text-xs text-[#DED1BE] font-sans mt-0.5">
                    Trưởng ban: Đ/c Trần Thị Thu Huyền (Phó Chủ tịch HSV Trường)
                  </div>
                </div>
                <div className="w-0.5 h-6 bg-[#133F68]" aria-hidden="true" />
                <div
                  className="hidden lg:block w-[76%] h-0.5 bg-[#133F68]"
                  aria-hidden="true"
                />
              </div>

              {/* 04 Nhánh Cụm Khoa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 -mt-6">
                {CHI_HOI_CLUSTERS.map((cluster) => {
                  const clusterUnits = CHI_HOI_LIST.filter(
                    (ch) => ch.facultyCluster === cluster.code
                  );
                  const activeBoardCount = clusterUnits.filter(
                    (ch) => ch.hasActiveBoard
                  ).length;
                  const totalStudents = clusterUnits.reduce(
                    (acc, ch) => acc + (ch.studentCount || 0),
                    0
                  );

                  return (
                    <div
                      key={cluster.code}
                      className="flex flex-col items-center"
                    >
                      <div
                        className="hidden lg:block w-0.5 h-6 bg-[#133F68]"
                        aria-hidden="true"
                      />
                      <div
                        className="w-full flex-1 bg-[#F8FAFC] border border-slate-300 flex flex-col justify-between"
                        style={{
                          borderTopWidth: '3px',
                          borderTopColor: cluster.accentColor,
                        }}
                      >
                        <div className="p-4 space-y-2 border-b border-slate-200 bg-white">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className="px-2 py-0.5 text-white text-[11px] font-bold font-eiu-display"
                              style={{ backgroundColor: cluster.accentColor }}
                            >
                              {cluster.shortFacultyCode}
                            </span>
                            <span className="text-[11px] font-eiu-serif font-bold text-slate-600 tabular-nums">
                              {activeBoardCount}/{clusterUnits.length} có BCH
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-[#133F68] font-eiu-display leading-snug">
                            {cluster.name}
                          </h3>
                          <div className="text-[11.5px] text-slate-600 font-sans">
                            Phụ trách:{' '}
                            <strong className="text-[#133F68]">
                              Đ/c {cluster.supervisorName}
                            </strong>
                          </div>
                        </div>

                        {/* Các nút lá Chi hội */}
                        <div className="p-3 space-y-1.5">
                          {clusterUnits.map((unit) => {
                            const isSelected = selectedChiHoiCode === unit.code;
                            return (
                              <button
                                key={unit.code}
                                type="button"
                                onClick={() =>
                                  handleSelectChiHoiFromTree(
                                    unit.code,
                                    cluster.code,
                                    unit.hasActiveBoard
                                  )
                                }
                                className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between gap-2 border transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#C10230] text-white border-[#C10230] font-bold'
                                    : unit.hasActiveBoard
                                    ? 'bg-white text-[#133F68] border-[#133F68]/40 hover:border-[#133F68] hover:bg-[#EAE3D2]/40 font-bold'
                                    : 'bg-slate-100/80 text-slate-600 border-slate-200 hover:border-slate-400'
                                }`}
                              >
                                <span className="font-eiu-display">
                                  {unit.code}
                                </span>
                                <span
                                  className={`text-[11px] font-eiu-serif tabular-nums ${
                                    isSelected
                                      ? 'text-white/95'
                                      : unit.hasActiveBoard
                                      ? 'text-[#0054A6]'
                                      : 'text-slate-500'
                                  }`}
                                >
                                  {unit.hasActiveBoard
                                    ? 'BCH 05 đ/c'
                                    : `${unit.studentCount ?? '—'} SV`}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        <div className="px-4 py-2 bg-white border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between font-sans">
                          <span>Tổng sinh viên cụm:</span>
                          <strong className="font-eiu-serif text-[#133F68] tabular-nums">
                            {totalStudents.toLocaleString('vi-VN')}
                          </strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Danh bạ Ban Chấp hành Chi hội */}
            <section ref={chiHoiDetailRef} className="scroll-mt-36 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display">
                    Danh bạ Ban Chấp hành Chi hội ({visibleChiHoiList.length})
                  </h2>
                  <div className="w-12 h-1 bg-[#C10230]" aria-hidden="true" />
                </div>

                <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#133F68] cursor-pointer font-sans bg-white border border-slate-300 px-3.5 py-2">
                  <input
                    type="checkbox"
                    checked={showSeniorCohorts}
                    onChange={(e) => setShowSeniorCohorts(e.target.checked)}
                    className="w-4 h-4 accent-[#133F68] cursor-pointer"
                  />
                  <span>Hiển thị thêm các Chi hội khóa trên (K21 – K24)</span>
                </label>
              </div>

              {/* Bộ lọc theo 04 Cụm Khoa */}
              <div
                role="group"
                aria-label="Lọc danh bạ Chi hội theo Cụm Khoa"
                className="flex flex-wrap items-center gap-2"
              >
                {(
                  [
                    { id: 'ALL', label: 'Tất cả 04 Cụm' },
                    { id: 'QTKD', label: 'Cụm QTKD (BBS)' },
                    { id: 'KT', label: 'Cụm Kỹ thuật (SET)' },
                    { id: 'CNTT', label: 'Cụm CNTT (CIT)' },
                    { id: 'KHSK', label: 'Cụm KHSK (SNS)' },
                  ] as { id: ClusterFilter; label: string }[]
                ).map((pill) => {
                  const active = clusterFilter === pill.id;
                  return (
                    <button
                      key={pill.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setClusterFilter(pill.id);
                        setSelectedChiHoiCode(null);
                      }}
                      className={`min-h-[40px] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider font-eiu-display transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#133F68] text-white border border-[#133F68]'
                          : 'bg-white text-[#133F68] border border-slate-300 hover:border-[#133F68] hover:bg-[#EAE3D2]/40'
                      }`}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>

              {/* Lưới thẻ Ban Chấp hành Chi hội */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {visibleChiHoiList.map((ch) => {
                  const clusterMeta = CHI_HOI_CLUSTERS.find(
                    (c) => c.code === ch.facultyCluster
                  )!;
                  const isHighlighted = selectedChiHoiCode === ch.code;

                  return (
                    <article
                      key={ch.code}
                      className={`bg-white border flex flex-col justify-between transition-colors ${
                        isHighlighted
                          ? 'border-2 border-[#C10230] shadow-md'
                          : 'border-slate-200 hover:border-[#133F68]'
                      }`}
                    >
                      <div>
                        <div className="bg-[#133F68] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#A68556]">
                          <div className="flex items-center gap-2.5">
                            <Building2 className="w-4 h-4 text-[#FCB900] shrink-0" />
                            <h3 className="text-sm sm:text-base font-bold font-eiu-display">
                              Chi hội {ch.code}
                            </h3>
                          </div>
                          <span className="px-2 py-0.5 bg-white/15 text-[#DED1BE] text-[11px] font-bold font-eiu-display">
                            {clusterMeta.name}
                          </span>
                        </div>

                        <div className="p-5 space-y-4">
                          {/* Chỉ số quy mô Chi hội */}
                          <div className="flex flex-wrap items-center gap-3 text-xs font-sans">
                            <span className="px-2.5 py-1 bg-[#F8FAFC] border border-slate-200 text-slate-700">
                              Sĩ số:{' '}
                              <strong className="font-eiu-serif text-[#133F68] tabular-nums">
                                {ch.studentCount !== null
                                  ? `${ch.studentCount} sinh viên`
                                  : 'Chung khối K25 CNTT'}
                              </strong>
                            </span>
                            {ch.eliteMemberCount !== null && (
                              <span className="px-2.5 py-1 bg-[#FAF8F4] border border-[#EAE3D2] text-[#8E6D3E]">
                                Hội viên ưu tú:{' '}
                                <strong className="font-eiu-serif text-[#133F68] tabular-nums">
                                  {ch.eliteMemberCount}
                                </strong>
                              </span>
                            )}
                          </div>

                          {/* Danh sách Ban Chấp hành Chi hội */}
                          {ch.hasActiveBoard ? (
                            <div className="space-y-2">
                              <div className="text-[11px] font-bold uppercase tracking-wider text-[#133F68] font-eiu-display flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-[#0054A6]" />
                                <span>
                                  Ban Chấp hành Chi hội ({ch.boardMembers.length}{' '}
                                  đồng chí)
                                </span>
                              </div>
                              <div className="divide-y divide-slate-100 border border-slate-200 bg-[#F8FAFC]">
                                {ch.boardMembers.map((member, idx) => (
                                  <div
                                    key={`${ch.code}-m-${idx}`}
                                    className="px-3.5 py-2 flex items-center justify-between gap-3 text-xs font-sans"
                                  >
                                    <span
                                      className={`font-semibold ${
                                        member.position === 'Chi hội trưởng'
                                          ? 'text-[#C10230]'
                                          : member.position === 'Chi hội phó'
                                          ? 'text-[#0054A6]'
                                          : 'text-slate-600'
                                      }`}
                                    >
                                      {member.position}
                                    </span>
                                    <span className="font-bold text-[#133F68] text-right">
                                      Đ/c {member.fullName}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="p-3.5 bg-[#F8FAFC] border border-slate-200 text-xs text-slate-600 font-sans leading-relaxed">
                              Chi hội sinh viên khóa trên (Khóa K{ch.cohort})
                              thuộc {clusterMeta.name}, sinh hoạt và phối hợp
                              trực tiếp dưới sự điều phối của Ban Tổ chức và Xây
                              dựng Hội.
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Chân thẻ: Email liên hệ đại diện & Quyết định chuẩn y (ẩn SĐT cá nhân) */}
                      {ch.hasActiveBoard && (
                        <div className="px-5 py-3 bg-[#F8FAFC] border-t border-slate-200 space-y-1.5 text-xs font-sans">
                          {ch.representativeEmail && (
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-slate-600">
                                Đại diện: <strong>{ch.representativeName}</strong>{' '}
                                ({ch.representativeRole})
                              </span>
                              <a
                                href={`mailto:${ch.representativeEmail}`}
                                className="inline-flex items-center gap-1 text-[#0054A6] hover:text-[#C10230] font-medium break-all"
                              >
                                <Mail className="w-3.5 h-3.5 shrink-0" />
                                <span>{ch.representativeEmail}</span>
                              </a>
                            </div>
                          )}
                          {ch.latestDecisionFile && (
                            <div className="flex items-start gap-1.5 text-[11.5px] text-slate-500">
                              <FileCheck2 className="w-3.5 h-3.5 text-[#51803A] shrink-0 mt-0.5" />
                              <span>{ch.latestDecisionFile}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* =====================================================================
            TAB 2: CLB – ĐỘI – NHÓM (06 ĐƠN VỊ TRỰC THUỘC HSV + CÁC CLB EIU)
           ===================================================================== */}
        {mainTab === 'clb' && (
          <div className="space-y-8">
            {/* Giới thiệu chung hệ thống CLB sinh viên EIU */}
            <section className="bg-white border border-slate-200 border-t-3 border-t-[#133F68] p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display">
                    Hệ thống Câu lạc bộ – Đội – Nhóm Sinh viên EIU
                  </h2>
                  <p className="text-[13.5px] text-slate-700 leading-relaxed font-sans">
                    {EIU_CLUBS_INTRO.lead}
                  </p>
                  <p className="text-[13px] text-slate-600 leading-relaxed font-sans">
                    {EIU_CLUBS_INTRO.hsvNote}
                  </p>
                </div>

                <a
                  href={EIU_CLUBS_INTRO.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[42px] px-4 py-2 bg-[#F8FAFC] hover:bg-[#EAE3D2]/60 border border-slate-300 text-[#133F68] text-xs font-bold uppercase tracking-wider font-eiu-display inline-flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <Globe className="w-4 h-4 text-[#0054A6]" />
                  <span>Cổng CLB EIU.edu.vn</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Thanh lọc nhóm CLB & Tìm kiếm */}
              <div className="pt-4 border-t border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div
                  role="group"
                  aria-label="Lọc Câu lạc bộ theo nhóm lĩnh vực"
                  className="flex flex-wrap items-center gap-2"
                >
                  {(
                    [
                      {
                        id: 'ALL',
                        label: `Tất cả (${EIU_CLUBS_DIRECTORY.length})`,
                      },
                      {
                        id: 'HSV',
                        label: `Trực thuộc HSV (${hsvClubs.length})`,
                      },
                      ...CLUB_GROUP_META.map((g) => ({
                        id: g.id as ClubFilter,
                        label: `${g.label} (${
                          EIU_CLUBS_DIRECTORY.filter((c) => c.group === g.id)
                            .length
                        })`,
                      })),
                    ] as { id: ClubFilter; label: string }[]
                  ).map((pill) => {
                    const active = clubFilter === pill.id;
                    return (
                      <button
                        key={pill.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setClubFilter(pill.id)}
                        className={`min-h-[40px] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider font-eiu-display transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#C10230] text-white border border-[#C10230]'
                            : 'bg-white text-[#133F68] border border-slate-300 hover:border-[#133F68] hover:bg-[#EAE3D2]/40'
                        }`}
                      >
                        {pill.label}
                      </button>
                    );
                  })}
                </div>

                <div className="relative w-full lg:w-72 shrink-0">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="club-search-input"
                    name="clubSearch"
                    type="text"
                    value={clubSearch}
                    onChange={(e) => setClubSearch(e.target.value)}
                    placeholder="Tìm tên CLB hoặc Ban Chủ nhiệm..."
                    aria-label="Tìm kiếm câu lạc bộ sinh viên"
                    className="w-full h-11 sm:h-9.5 pl-9 pr-9 bg-white border border-slate-300 rounded text-base sm:text-xs text-slate-900 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68]"
                  />
                  {clubSearch && (
                    <button
                      type="button"
                      onClick={() => setClubSearch('')}
                      aria-label="Xóa từ khóa tìm kiếm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Trạng thái không có kết quả */}
            {filteredClubs.length === 0 ? (
              <div className="bg-white border border-slate-200 p-10 text-center space-y-3">
                <p className="text-base font-bold text-[#133F68] font-eiu-display">
                  Không tìm thấy Câu lạc bộ – Đội – Nhóm phù hợp
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setClubFilter('ALL');
                    setClubSearch('');
                  }}
                  className="min-h-[40px] px-5 py-2 bg-[#133F68] hover:bg-[#0054A6] text-white text-xs font-bold uppercase tracking-wider rounded-full font-eiu-display cursor-pointer"
                >
                  Xem toàn bộ {EIU_CLUBS_DIRECTORY.length} đơn vị
                </button>
              </div>
            ) : (
              <div className="space-y-10">
                {/* PHÂN KHU 1: 06 CLB – ĐỘI – NHÓM TRỰC THUỘC HỘI SINH VIÊN TRƯỜNG */}
                {filteredHsvClubs.length > 0 && (
                  <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="space-y-1">
                        <h2 className="text-lg font-bold uppercase tracking-wide text-[#133F68] font-eiu-display flex items-center gap-2">
                          <Award className="w-5 h-5 text-[#C10230]" />
                          <span>
                            CLB – Đội – Nhóm Trực thuộc Hội Sinh viên Trường (
                            {filteredHsvClubs.length})
                          </span>
                        </h2>
                        <div
                          className="w-12 h-1 bg-[#C10230]"
                          aria-hidden="true"
                        />
                      </div>
                      <span className="text-xs text-slate-600 font-sans">
                        Phụ trách cụm: Đ/c Nguyễn Mỹ Hạnh (Phó Ban TC-XDH)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredHsvClubs.map((club) => (
                        <ClubCard
                          key={club.id}
                          club={club}
                          failedPhotos={failedPhotos}
                          failedLogos={failedLogos}
                          onPhotoError={handlePhotoError}
                          onLogoError={handleLogoError}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* PHÂN KHU 2: CÁC CÂU LẠC BỘ SINH VIÊN EIU THEO 04 NHÓM */}
                {filteredCampusClubs.length > 0 && (
                  <section className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-lg font-bold uppercase tracking-wide text-[#133F68] font-eiu-display flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#0054A6]" />
                        <span>
                          Các Câu lạc bộ Sinh viên Trường Đại học Quốc tế Miền
                          Đông ({filteredCampusClubs.length})
                        </span>
                      </h2>
                      <div
                        className="w-12 h-1 bg-[#0054A6]"
                        aria-hidden="true"
                      />
                    </div>

                    {CLUB_GROUP_META.map((group) => {
                      const groupItems = filteredCampusClubs.filter(
                        (c) => c.group === group.id
                      );
                      if (groupItems.length === 0) return null;

                      return (
                        <div key={group.id} className="space-y-3.5">
                          <div className="bg-white border border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                            <div className="space-y-0.5">
                              <h3 className="text-sm sm:text-base font-bold uppercase text-[#133F68] font-eiu-display">
                                Nhóm Câu lạc bộ {group.label} ({groupItems.length}
                                )
                              </h3>
                              <p className="text-xs text-slate-600 font-sans">
                                {group.summary}
                              </p>
                            </div>
                            <span
                              className="px-2.5 py-0.5 text-white text-[11px] font-bold font-eiu-serif shrink-0"
                              style={{ backgroundColor: group.accent }}
                            >
                              {group.englishLabel}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {groupItems.map((club) => (
                              <ClubCard
                                key={club.id}
                                club={club}
                                failedPhotos={failedPhotos}
                                failedLogos={failedLogos}
                                onPhotoError={handlePhotoError}
                                onLogoError={handleLogoError}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </section>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ToChucSearchBridge() {
  const searchParams = useSearchParams();
  const rawTab = (searchParams.get('tab') || '').trim().toLowerCase();
  const rawCategory = (searchParams.get('category') || '').trim().toUpperCase();
  const rawFaculty = (searchParams.get('faculty') || '').trim().toUpperCase();

  const initialMainTab: MainOrgTab =
    rawTab === 'clb' || rawTab === 'clubs' ? 'clb' : 'chi-hoi';

  const validClubFilters: ClubFilter[] = [
    'ALL',
    'HSV',
    'CONG_DONG',
    'HOC_THUAT',
    'NGHE_THUAT',
    'THE_THAO',
  ];
  const initialClubFilter: ClubFilter = validClubFilters.includes(
    rawCategory as ClubFilter
  )
    ? (rawCategory as ClubFilter)
    : 'ALL';

  const facultyAliasMap: Record<string, ClusterFilter> = {
    BBS: 'QTKD',
    QTKD: 'QTKD',
    SET: 'KT',
    KT: 'KT',
    CIT: 'CNTT',
    CNTT: 'CNTT',
    SNS: 'KHSK',
    KHSK: 'KHSK',
  };
  const initialClusterFilter: ClusterFilter =
    facultyAliasMap[rawFaculty] || 'ALL';

  return (
    <ToChucContent
      key={`${initialMainTab}::${initialClubFilter}::${initialClusterFilter}`}
      initialMainTab={initialMainTab}
      initialClubFilter={initialClubFilter}
      initialClusterFilter={initialClusterFilter}
    />
  );
}

export default function ToChucPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1140px] mx-auto px-4 py-16 text-center text-sm text-slate-500">
          Đang tải danh bạ Chi hội và Câu lạc bộ – Đội – Nhóm...
        </div>
      }
    >
      <ToChucSearchBridge />
    </Suspense>
  );
}
