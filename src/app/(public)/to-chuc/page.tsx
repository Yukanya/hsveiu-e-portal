'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BRANCH_UNITS,
  CLUB_UNITS,
  FACULTY_METADATA,
} from '@/data/mock-data';
import { ClubCategory, FacultyCode } from '@/types';
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  ExternalLink,
  Search,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';

export default function OrganizationDirectoryPage() {
  const [activeTab, setActiveTab] = useState<'clubs' | 'branches'>('clubs');
  const [clubCategory, setClubCategory] = useState<'ALL' | ClubCategory>('ALL');
  const [branchFaculty, setBranchFaculty] = useState<'ALL' | 'BBS' | 'SET' | 'CIT' | 'SNS'>('ALL');
  const [branchCohort, setBranchCohort] = useState<'ALL' | 21 | 22 | 23 | 24 | 25 | 26>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClubs = CLUB_UNITS.filter((club) => {
    const matchCategory = clubCategory === 'ALL' || club.category === clubCategory;
    const matchSearch =
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (club.presidentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const filteredBranches = BRANCH_UNITS.filter((branch) => {
    const matchFaculty = branchFaculty === 'ALL' || branch.facultyCode === branchFaculty;
    const matchCohort = branchCohort === 'ALL' || branch.cohortYear === branchCohort;
    const matchSearch =
      branch.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.facultyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (branch.branchPresidentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.clusterLeaderName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFaculty && matchCohort && matchSearch;
  });

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <section className="bg-[#0B2545] text-white border-b border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-sky-300">
            <Building2 className="w-3.5 h-3.5" />
            <span>Hệ thống Cơ sở Hội trực thuộc Hội Sinh viên Trường ĐHQTMĐ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Danh Bạ 30 Câu Lạc Bộ / Đội / Nhóm & 25 Chi Hội Trực Thuộc
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Tra cứu thông tin cơ cấu Ban Chủ nhiệm / Ban Chấp hành (05 đồng chí/đơn vị), trạng thái
            tuyển thành viên/CTV, tiến độ xây dựng{' '}
            <strong className="text-white">"Tập thể Sinh viên 5 Tốt"</strong> và truy cập Micro-site
            của từng đơn vị.
          </p>

          {/* Main Tab Switcher */}
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('clubs')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'clubs'
                  ? 'bg-[#0054A6] text-white shadow-sm border border-sky-400/40'
                  : 'bg-white/10 text-slate-200 hover:bg-white/15'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Khối 30 CLB / Đội / Nhóm (04 Lĩnh vực)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('branches')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'branches'
                  ? 'bg-[#0054A6] text-white shadow-sm border border-sky-400/40'
                  : 'bg-white/10 text-slate-200 hover:bg-white/15'
              }`}
            >
              <Users className="w-4 h-4 text-sky-300" />
              Khối 25 Chi hội (04 Cụm Khoa & 06 Cụm Khóa)
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === 'clubs'
                    ? 'Tìm tên CLB, Đội, Chủ nhiệm (VD: Voice Up, IT Club, SV5T...)'
                    : 'Tìm mã Chi hội, Khoa, Cụm trưởng (VD: 25CNTT01, 24QTKD01...)'
                }
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-[#0054A6]"
              />
            </div>

            <div className="text-xs text-slate-600">
              {activeTab === 'clubs' ? (
                <span>
                  Phó Ban TC-XDH phụ trách Cụm CLB/Đội/Nhóm:{' '}
                  <strong className="text-[#0B2545]">Đ/c Nguyễn Mỹ Hạnh</strong>
                </span>
              ) : (
                <span>
                  Cơ cấu mỗi Chi hội: <strong className="text-[#0B2545]">05 đ/c BCH Chi hội</strong>{' '}
                  (01 CHT, 02 CHP, 02 UV BCH)
                </span>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          {activeTab === 'clubs' ? (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              {[
                { key: 'ALL', label: 'Tất cả (30 đơn vị)' },
                { key: 'CONG_DONG', label: 'Cộng đồng & Tình nguyện (07)' },
                { key: 'HOC_THUAT', label: 'Học thuật – Nghiên cứu (06)' },
                { key: 'NGHE_THUAT', label: 'Văn hóa – Nghệ thuật (10)' },
                { key: 'THE_THAO', label: 'Thể dục – Thể thao (07)' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setClubCategory(item.key as typeof clubCategory)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    clubCategory === item.key
                      ? 'bg-[#0054A6] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              {/* Lọc theo 04 Cụm hoạt động Khoa */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 mr-1">Cụm Khoa:</span>
                {[
                  { key: 'ALL', label: 'Tất cả (25 Chi hội)' },
                  { key: 'BBS', label: 'Cụm Khoa QTKD (06)' },
                  { key: 'SET', label: 'Cụm Khoa Kỹ thuật (06)' },
                  { key: 'CIT', label: 'Cụm Khoa CNTT (07)' },
                  { key: 'SNS', label: 'Cụm Khoa Khoa học Sức khỏe (06)' },
                ].map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setBranchFaculty(f.key as typeof branchFaculty)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      branchFaculty === f.key
                        ? 'bg-[#0054A6] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Lọc theo 06 Cụm thi đua khóa */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 mr-1">Cụm Thi đua Khóa:</span>
                {[
                  { key: 'ALL', label: 'Tất cả Khóa (2021–2026)' },
                  { key: 21, label: 'Khóa 2021 (K21)' },
                  { key: 22, label: 'Khóa 2022 (K22)' },
                  { key: 23, label: 'Khóa 2023 (K23)' },
                  { key: 24, label: 'Khóa 2024 (K24)' },
                  { key: 25, label: 'Khóa 2025 (K25)' },
                  { key: 26, label: 'Khóa 2026 (K26)' },
                ].map((c) => (
                  <button
                    key={String(c.key)}
                    type="button"
                    onClick={() => setBranchCohort(c.key as typeof branchCohort)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      branchCohort === c.key
                        ? 'bg-[#0B2545] text-amber-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ====================================================================
            TAB 1: DANH SÁCH 30 CÂU LẠC BỘ / ĐỘI / NHÓM
           ==================================================================== */}
        {activeTab === 'clubs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClubs.map((club) => (
              <div
                key={club.id}
                className={`bg-white rounded-2xl p-5 border shadow-2xs hover:shadow-md transition-all flex flex-col justify-between ${
                  club.isCoreUnionUnit
                    ? 'border-amber-300 ring-1 ring-amber-200/60'
                    : 'border-slate-200 hover:border-[#0054A6]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#F0F7FF] text-[#0054A6] border border-sky-200">
                      {club.categoryLabel}
                    </span>

                    {club.isCoreUnionUnit ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 border border-amber-300">
                        <Sparkles className="w-3 h-3 text-amber-700" />
                        Đơn vị nòng cốt của Hội
                      </span>
                    ) : club.recruitmentOpen ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ● Đang mở tuyển CTV
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                        Ổn định nhân sự
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-[11px] font-mono text-slate-400">Mã đơn vị: {club.code}</p>
                    <h3 className="text-base font-bold text-[#0B2545] mt-0.5">{club.name}</h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{club.description}</p>

                  {/* Special badge for Đội CTV Xung kích */}
                  {club.linkedToTgptMovement && club.managedSubteams && (
                    <div className="p-3 rounded-xl bg-slate-900 text-white text-[11px] space-y-1.5">
                      <p className="font-bold text-amber-300 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" />
                        Trực thuộc Mảng Phong trào (Ban TG-PT)
                      </p>
                      <p className="text-slate-300">
                        Quản lý trực tiếp:{' '}
                        <strong className="text-white">{club.managedSubteams.join(' & ')}</strong>
                      </p>
                    </div>
                  )}

                  {/* Ban Chủ nhiệm (05 đồng chí) */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">
                      Cơ cấu Ban Chủ nhiệm (05 Đồng chí):
                    </p>
                    <p className="text-slate-700">
                      • {club.unitType === 'team' ? 'Đội trưởng:' : 'Chủ nhiệm:'}{' '}
                      <strong className="text-[#0B2545]">
                        {club.presidentName || 'Ban Chủ nhiệm CLB'}
                      </strong>
                    </p>
                    {club.vicePresidentName && (
                      <p className="text-slate-700">
                        • Phó Chủ nhiệm: <strong>{club.vicePresidentName}</strong>
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500">
                      • Quy mô: ~{club.memberCount} thành viên & CTV
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {club.fanpageUrl ? (
                    <a
                      href={club.fanpageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-[#0054A6]"
                    >
                      Fanpage <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">Kênh nội bộ HSV</span>
                  )}

                  <Link
                    href={`/to-chuc/${club.slug}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0054A6] hover:bg-[#004282] text-white text-xs font-semibold transition-colors"
                  >
                    Micro-site & Tuyển quân
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ====================================================================
            TAB 2: DANH SÁCH 25 CHI HỘI TRỰC THUỘC & TIẾN ĐỘ "TẬP THỂ SV5T"
           ==================================================================== */}
        {activeTab === 'branches' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBranches.map((branch) => {
              const meta = FACULTY_METADATA[branch.facultyCode];
              const isEligibleCollectiveSv5t =
                branch.sv5tRegisteredRate === 100 &&
                branch.sv5tAchievedRate >= 30 &&
                !branch.hasDisciplineViolation;

              return (
                <div
                  key={branch.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#0054A6] shadow-2xs transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${meta.badgeClass}`}
                      >
                        {branch.facultyName}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-xs font-bold">
                        Khóa 20{branch.cohortYear}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <h3 className="text-lg font-extrabold font-mono text-[#0B2545]">
                        {branch.code}
                      </h3>
                      <span className="text-xs text-slate-500">
                        Sĩ số: <strong>{branch.totalMembers} Hội viên</strong>
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">{branch.description}</p>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                      <p className="text-slate-600">
                        • Cụm trưởng phụ trách:{' '}
                        <strong className="text-[#0B2545]">{branch.clusterLeaderName}</strong>
                      </p>
                      <p className="text-slate-600">
                        • Chi hội trưởng:{' '}
                        <strong className="text-[#0054A6]">
                          {branch.branchPresidentName || `BCH Chi hội ${branch.code}`}
                        </strong>
                      </p>
                      {branch.branchVicePresidentNames && (
                        <p className="text-slate-600">
                          • Chi hội phó:{' '}
                          <strong>{branch.branchVicePresidentNames.join(', ')}</strong>
                        </p>
                      )}
                    </div>

                    {/* Tiến độ Tập thể Sinh viên 5 Tốt (Theo QĐ 09/QĐ-HSV) */}
                    <div className="p-3 rounded-xl bg-[#F0F7FF] border border-sky-200/80 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#0054A6] flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" />
                          Tiến độ Tập thể SV5T (QĐ 09)
                        </span>
                        {isEligibleCollectiveSv5t ? (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            Đạt chuẩn (≥30%)
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                            Đang phấn đấu
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 text-[11px] text-slate-700">
                        <div className="flex justify-between">
                          <span>1. Đăng ký phấn đấu SV5T:</span>
                          <strong className="font-mono text-emerald-700">
                            {branch.sv5tRegisteredRate}% (Yêu cầu 100%)
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span>2. Tỷ lệ đạt SV5T cấp trường:</span>
                          <strong className="font-mono text-[#0054A6]">
                            {branch.sv5tAchievedRate}% (Yêu cầu ≥30%)
                          </strong>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isEligibleCollectiveSv5t ? 'bg-emerald-600' : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(branch.sv5tAchievedRate * 2, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-emerald-700 font-medium inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />0 SV vi phạm kỷ luật
                    </span>
                    <Link
                      href={`/to-chuc/${branch.slug}`}
                      className="font-bold text-[#0054A6] hover:underline inline-flex items-center gap-1"
                    >
                      Chi tiết Chi hội <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
