'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SubpageBanner } from '@/components/public/subpage-banner';
import { useRole } from '@/context/role-context';
import {
  BRANCH_UNITS,
  CLUB_UNITS,
  EVENT_ITEMS,
  FACULTY_METADATA,
  OFFICIAL_DOCUMENTS,
  STAFF_MEMBERS,
} from '@/data/mock-data';
import { FacultyCode } from '@/types';
import { WORKSPACE_MODULES, WorkspaceModuleId } from './layout';

const MOCK_SV5T_CANDIDATES = [
  {
    id: 'cand-01',
    studentId: '2431200018',
    fullName: 'Trần Nguyễn Minh Anh',
    branchCode: '24CNTT01',
    facultyCode: 'CIT' as FacultyCode,
    ethicsScore: 94,
    gpaYear: 3.68,
    physicalCert: 'Sinh viên Khỏe 2026',
    volunteerDays: 14.5,
    englishLevel: 'IELTS 6.5 (B2)',
    hasProvinceAward: true,
    hasMeritCert: true,
  },
  {
    id: 'cand-02',
    studentId: '2532300042',
    fullName: 'Lê Hoàng Bảo Trâm',
    branchCode: '25QTKD01',
    facultyCode: 'BBS' as FacultyCode,
    ethicsScore: 92,
    gpaYear: 3.55,
    physicalCert: 'Giải Nhì Hội thao EIU',
    volunteerDays: 12.0,
    englishLevel: 'Chuẩn B1 + Kỹ năng PL3',
    hasProvinceAward: false,
    hasMeritCert: true,
  },
  {
    id: 'cand-03',
    studentId: '2531300019',
    fullName: 'Nguyễn Phúc Khang',
    branchCode: '25KT01',
    facultyCode: 'SET' as FacultyCode,
    ethicsScore: 89,
    gpaYear: 3.42,
    physicalCert: 'Sinh viên Khỏe 2026',
    volunteerDays: 9.5,
    englishLevel: '02 khóa ngoại ngữ EIU',
    hasProvinceAward: false,
    hasMeritCert: true,
  },
  {
    id: 'cand-04',
    studentId: '2533100088',
    fullName: 'Phạm Ngọc Thảo Vy',
    branchCode: '25KHSK01',
    facultyCode: 'SNS' as FacultyCode,
    ethicsScore: 91,
    gpaYear: 3.48,
    physicalCert: 'Sinh viên Khỏe 2026',
    volunteerDays: 16.0,
    englishLevel: 'Chuẩn B1 + ASEAN Exchange',
    hasProvinceAward: false,
    hasMeritCert: false,
  },
  {
    id: 'cand-05',
    studentId: '2531200105',
    fullName: 'Võ Minh Quân',
    branchCode: '25CNTT02',
    facultyCode: 'CIT' as FacultyCode,
    ethicsScore: 86,
    gpaYear: 3.12,
    physicalCert: 'Sinh viên Khỏe 2026',
    volunteerDays: 6.5,
    englishLevel: 'Chuẩn B1 + Cuộc thi TA',
    hasProvinceAward: false,
    hasMeritCert: false,
  },
];

const OFFICE_SHIFTS = [
  {
    day: 'Thứ Hai',
    morning: 'Phạm Thị Hồng Ngọc (Phó CVP)',
    afternoon: 'Lương Gia Hân (Cán bộ VP)',
    roomStatus: 'Mở cửa 07:30',
  },
  {
    day: 'Thứ Ba',
    morning: 'Lê Thị Hải Yến (Phó CVP)',
    afternoon: 'Đào Văn Thanh (Cán bộ VP)',
    roomStatus: 'Tiếp nhận GCN',
  },
  {
    day: 'Thứ Tư',
    morning: 'Nguyễn Như Quỳnh (Tổng Thư ký)',
    afternoon: 'Nguyễn Mỹ Hạnh (Chánh VP)',
    roomStatus: 'Giao ban VP',
  },
  {
    day: 'Thứ Năm',
    morning: 'Phạm Thị Hồng Ngọc (Phó CVP)',
    afternoon: 'Lê Thị Hải Yến (Phó CVP)',
    roomStatus: 'Đóng dấu Mộc',
  },
  {
    day: 'Thứ Sáu',
    morning: 'Lương Gia Hân (Cán bộ VP)',
    afternoon: 'Đào Văn Thanh (Cán bộ VP)',
    roomStatus: 'Kiểm kê tài sản',
  },
];

const SEAL_LOGS = [
  {
    id: 'seal-01',
    docNumber: '32/QĐ-HSV',
    docTitle: 'Quyết định công nhận GCN Tập huấn Cán bộ Đoàn - Hội 2026',
    approvedBy: 'Trương Châu Phước Lộc',
    stampedBy: 'Lê Thị Hải Yến',
    date: '19/10/2026',
  },
  {
    id: 'seal-02',
    docNumber: '15/KH-HSV',
    docTitle: 'Kế hoạch Ngày hội Sinh viên Khỏe & Kiểm tra Thể lực cấp Trường',
    approvedBy: 'Nguyễn Như Quỳnh',
    stampedBy: 'Nguyễn Mỹ Hạnh',
    date: '21/10/2026',
  },
];

export default function WorkspacePage() {
  const {
    currentPersona,
    activePosition,
    setActivePositionById,
    setPersonaById,
  } = useRole();
  const [activeModule, setActiveModule] =
    useState<WorkspaceModuleId>('overview');

  const [eventsState, setEventsState] = useState(EVENT_ITEMS);
  const [actionToast, setActionToast] = useState<string | null>(null);
  const [branchFacultyFilter, setBranchFacultyFilter] = useState<
    'ALL' | FacultyCode
  >('ALL');
  const [onlyTop10Sv5t, setOnlyTop10Sv5t] = useState(false);

  const triggerToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 4000);
  };

  const handleApprove3DaysPrior = (eventId: string, title: string) => {
    setEventsState((prev) =>
      prev.map((ev) =>
        ev.id === eventId
          ? { ...ev, preApprovalStatus: 'approved_3days_prior' }
          : ev
      )
    );
    triggerToast(`Đã duyệt chủ trương trước 03 ngày: "${title}".`);
  };

  const handleIssueDecisionAndCerts = (eventId: string, title: string) => {
    setEventsState((prev) =>
      prev.map((ev) =>
        ev.id === eventId
          ? {
              ...ev,
              certWorkflowStatus: 'decision_issued',
              decisionNumber: '35/QĐ-HSV',
              slaDaysRemaining: 0,
            }
          : ev
      )
    );
    triggerToast(`Đã ký Quyết định 35/QĐ-HSV và cấp E-Certificate: "${title}".`);
  };

  const qualifiedCollectiveBranches = BRANCH_UNITS.filter(
    (b) =>
      b.sv5tRegisteredRate === 100 &&
      b.sv5tAchievedRate >= 30 &&
      !b.hasDisciplineViolation
  );

  const filteredBranches =
    branchFacultyFilter === 'ALL'
      ? BRANCH_UNITS
      : BRANCH_UNITS.filter((b) => b.facultyCode === branchFacultyFilter);

  const displayedCandidates = onlyTop10Sv5t
    ? MOCK_SV5T_CANDIDATES.filter((c) => c.hasProvinceAward || c.hasMeritCert)
    : MOCK_SV5T_CANDIDATES;

  const currentModuleMeta =
    WORKSPACE_MODULES.find((m) => m.id === activeModule) ||
    WORKSPACE_MODULES[0];

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      {/* Toast thông báo */}
      {actionToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-sm bg-[#133F68] text-white border-l-4 border-[#C10230] p-4 shadow-lg text-xs"
        >
          <div className="font-bold uppercase tracking-wider mb-1">
            E-Office HSV EIU
          </div>
          <div>{actionToast}</div>
        </div>
      )}

      <SubpageBanner
        title="Hệ thống Quản trị Nội bộ E-Office"
        breadcrumbs={[
          { label: 'E-Office Nội bộ' },
          { label: currentModuleMeta.label },
        ]}
      />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI (3/12): Menu dọc Đỏ #C10230 / Vàng kem #EAE3D2 góc vuông chuẩn eiu.edu.vn */}
          <aside
            aria-label="Phân hệ E-Office"
            className="lg:col-span-3 flex flex-col divide-y divide-white border border-slate-200/80"
          >
            {WORKSPACE_MODULES.map((item) => {
              const isSelected = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveModule(item.id)}
                  aria-current={isSelected ? 'page' : undefined}
                  className={`w-full text-left px-4 py-3 text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#C10230] text-white font-bold'
                      : 'bg-[#EAE3D2] text-slate-900 hover:bg-[#dfd5be]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </aside>

          {/* CỘT GIỮA (6/12): Bảng thanh ngang #133F68 góc vuông chuẩn lib.eiu.edu.vn */}
          <div className="lg:col-span-6 space-y-5">
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide text-[#133F68] font-eiu-display">
              {currentModuleMeta.title}
            </h2>

            {activePosition.roleLevel === 1 && (
              <div
                role="alert"
                className="bg-white border-l-4 border-[#C10230] p-4 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <strong className="text-[#133F68]">
                    Đang xem ở quyền Hội viên (Cấp 1/6).
                  </strong>{' '}
                  Chuyển sang tài khoản Chủ tịch HSV để thao tác duyệt.
                </div>
                <button
                  type="button"
                  onClick={() => setPersonaById('staff-01')}
                  className="px-3.5 py-1.5 bg-[#0D6EFD] text-white rounded text-xs font-bold shrink-0 cursor-pointer"
                >
                  Chuyển Cấp 6
                </button>
              </div>
            )}

            {/* 1. TỔNG QUAN ĐIỀU HÀNH */}
            {activeModule === 'overview' && (
              <div className="space-y-5">
                <div className="bg-white border border-slate-200">
                  <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold">
                    Chỉ số điều hành trọng tâm Khóa II (2026 – 2028)
                  </div>
                  <div className="divide-y divide-slate-200 text-xs">
                    <div className="grid grid-cols-12 p-3.5">
                      <div className="col-span-6 font-bold text-slate-900">
                        Nhân sự BCH &amp; Ban Kiểm tra:
                      </div>
                      <div className="col-span-6 font-mono font-bold text-[#133F68]">
                        15 đ/c BCH • 05 đ/c BKT (05 đ/c BTK)
                      </div>
                    </div>
                    <div className="grid grid-cols-12 p-3.5">
                      <div className="col-span-6 font-bold text-slate-900">
                        Hệ thống Đơn vị trực thuộc:
                      </div>
                      <div className="col-span-6 font-mono font-bold text-[#133F68]">
                        {BRANCH_UNITS.length} Chi hội (04 Khoa) • {CLUB_UNITS.length} CLB/Đội/Nhóm
                      </div>
                    </div>
                    <div className="grid grid-cols-12 p-3.5">
                      <div className="col-span-6 font-bold text-slate-900">
                        Tiến độ Tập thể SV5T (09/QĐ-HSV):
                      </div>
                      <div className="col-span-6 font-mono font-bold text-emerald-700">
                        {qualifiedCollectiveBranches.length} / {BRANCH_UNITS.length} Chi hội đạt chuẩn
                      </div>
                    </div>
                    <div className="grid grid-cols-12 p-3.5">
                      <div className="col-span-6 font-bold text-slate-900">
                        Cam kết SLA cấp E-Certificate (28/QĐ-HSV):
                      </div>
                      <div className="col-span-6 font-mono font-bold text-[#C10230]">
                        Tối đa 07 ngày làm việc
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200">
                  <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold">
                    Hàng đợi phê duyệt ưu tiên (28/QĐ-HSV)
                  </div>
                  <div className="divide-y divide-slate-200 text-xs">
                    {eventsState
                      .filter(
                        (e) =>
                          e.preApprovalStatus === 'pending_tcxdh' ||
                          e.certWorkflowStatus === 'list_submitted_sla'
                      )
                      .map((ev) => (
                        <div
                          key={ev.id}
                          className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="font-bold text-[#133F68]">
                              {ev.title}
                            </div>
                            <div className="text-slate-600">
                              {ev.organizerUnit} • Quy đổi gốc:{' '}
                              <strong className="font-mono">
                                +{ev.baseVolunteerDays.toFixed(1)} ngày
                              </strong>
                            </div>
                          </div>
                          {ev.preApprovalStatus === 'pending_tcxdh' ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleApprove3DaysPrior(ev.id, ev.title)
                              }
                              className="px-4 py-1.5 bg-[#0D6EFD] hover:bg-blue-700 text-white rounded text-xs font-bold shrink-0 cursor-pointer"
                            >
                              Duyệt trước 03 ngày
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleIssueDecisionAndCerts(ev.id, ev.title)
                              }
                              className="px-4 py-1.5 bg-[#0D6EFD] hover:bg-blue-700 text-white rounded text-xs font-bold shrink-0 cursor-pointer"
                            >
                              Ký QĐ &amp; Cấp GCN
                            </button>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. DUYỆT NGÀY TÌNH NGUYỆN & CẤP GCN */}
            {activeModule === 'certificates' && (
              <div className="bg-white border border-slate-200">
                <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold">
                  Danh mục hồ sơ sự kiện &amp; tiến độ SLA 07 ngày
                </div>
                <div className="divide-y divide-slate-200 text-xs">
                  {eventsState.map((ev) => (
                    <div key={ev.id} className="p-4 space-y-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-bold text-[#133F68] text-sm">
                            {ev.title}
                          </div>
                          <div className="text-slate-600 mt-0.5">
                            Đơn vị: <strong>{ev.organizerUnit}</strong> •{' '}
                            {ev.volunteerCategory}
                          </div>
                        </div>
                        <span className="font-mono font-bold text-[#C10230] shrink-0">
                          +{ev.baseVolunteerDays.toFixed(1)} ngày (BTC ×3, CTV ×2)
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <div className="text-slate-700">
                          Trạng thái:{' '}
                          <strong>
                            {ev.certWorkflowStatus === 'decision_issued'
                              ? `Đã ban hành ${ev.decisionNumber}`
                              : ev.certWorkflowStatus === 'list_submitted_sla'
                              ? `Đang đếm SLA (Còn 0${ev.slaDaysRemaining} ngày)`
                              : 'Chờ duyệt chủ trương trước 03 ngày'}
                          </strong>
                        </div>

                        <div className="flex items-center gap-2">
                          {ev.preApprovalStatus === 'pending_tcxdh' && (
                            <button
                              type="button"
                              onClick={() =>
                                handleApprove3DaysPrior(ev.id, ev.title)
                              }
                              className="px-3.5 py-1.5 bg-[#0D6EFD] hover:bg-blue-700 text-white rounded text-xs font-bold cursor-pointer"
                            >
                              Duyệt tờ trình
                            </button>
                          )}
                          {ev.certWorkflowStatus === 'list_submitted_sla' && (
                            <button
                              type="button"
                              onClick={() =>
                                handleIssueDecisionAndCerts(ev.id, ev.title)
                              }
                              className="px-3.5 py-1.5 bg-[#0D6EFD] hover:bg-blue-700 text-white rounded text-xs font-bold cursor-pointer"
                            >
                              Ký QĐ &amp; Cấp E-Cert
                            </button>
                          )}
                          {ev.certWorkflowStatus === 'decision_issued' && (
                            <Link
                              href="/tra-cuu-gcn"
                              className="text-xs font-bold text-[#133F68] hover:text-[#C10230]"
                            >
                              &gt; XEM E-CERT
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. HỘI ĐỒNG XÉT CHỌN SV5T */}
            {activeModule === 'sv5t' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOnlyTop10Sv5t(false)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                      !onlyTop10Sv5t
                        ? 'bg-[#C10230] text-white border-[#C10230]'
                        : 'bg-white text-[#133F68] border-[#133F68]'
                    }`}
                  >
                    TẤT CẢ HỒ SƠ ({MOCK_SV5T_CANDIDATES.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOnlyTop10Sv5t(true)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                      onlyTop10Sv5t
                        ? 'bg-[#C10230] text-white border-[#C10230]'
                        : 'bg-white text-[#133F68] border-[#133F68]'
                    }`}
                  >
                    TOP 10% TIÊU BIỂU
                  </button>
                </div>

                <div className="bg-white border border-slate-200">
                  <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold">
                    Danh sách ứng viên Sinh viên 5 Tốt cấp Trường
                  </div>
                  <div className="divide-y divide-slate-200 text-xs">
                    {displayedCandidates.map((c, idx) => (
                      <div
                        key={c.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-bold text-[#133F68] text-sm">
                            {idx + 1}. {c.fullName}{' '}
                            <span className="font-mono text-xs text-slate-600">
                              ({c.studentId} • {c.branchCode})
                            </span>
                          </div>
                          <div className="text-slate-600 mt-1">
                            ĐRL: <strong>{c.ethicsScore}</strong> • GPA:{' '}
                            <strong>{c.gpaYear.toFixed(2)}</strong> • TN:{' '}
                            <strong>{c.volunteerDays.toFixed(1)} ngày</strong> •{' '}
                            {c.englishLevel}
                          </div>
                        </div>
                        <div className="font-bold shrink-0">
                          {c.hasProvinceAward || c.hasMeritCert ? (
                            <span className="text-[#C10230]">
                              ★ TOP 10% TIÊU BIỂU
                            </span>
                          ) : (
                            <span className="text-emerald-700">
                              ✓ ĐẠT SV5T TRƯỜNG
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. TẬP THỂ SV5T 25 CHI HỘI */}
            {activeModule === 'collective' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {(
                    [
                      { code: 'ALL', label: 'TẤT CẢ (25)' },
                      { code: 'BBS', label: 'QTKD (06)' },
                      { code: 'SET', label: 'KỸ THUẬT (06)' },
                      { code: 'CIT', label: 'CNTT (07)' },
                      { code: 'SNS', label: 'KHOA HỌC SỨC KHỎE (06)' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.code}
                      type="button"
                      onClick={() => setBranchFacultyFilter(tab.code)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                        branchFacultyFilter === tab.code
                          ? 'bg-[#C10230] text-white border-[#C10230]'
                          : 'bg-white text-[#133F68] border-[#133F68]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="bg-white border border-slate-200">
                  <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold">
                    Tiến độ 25 Chi hội (100% ĐK • ≥ 30% Đạt SV5T • 0 Kỷ luật)
                  </div>
                  <div className="divide-y divide-slate-200 text-xs">
                    {filteredBranches.map((branch) => {
                      const isQualified =
                        branch.sv5tRegisteredRate === 100 &&
                        branch.sv5tAchievedRate >= 30 &&
                        !branch.hasDisciplineViolation;
                      return (
                        <div
                          key={branch.id}
                          className="grid grid-cols-12 p-3.5 items-center"
                        >
                          <div className="col-span-4 font-mono font-bold text-[#133F68]">
                            {branch.code}
                          </div>
                          <div className="col-span-5 text-slate-700">
                            {FACULTY_METADATA[branch.facultyCode].nameVi}
                          </div>
                          <div className="col-span-3 text-right font-mono font-bold">
                            <span
                              className={
                                isQualified
                                  ? 'text-emerald-700'
                                  : 'text-[#C10230]'
                              }
                            >
                              {branch.sv5tAchievedRate}% / 30%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 5. BAN TUYÊN GIÁO - PHONG TRÀO & ĐỘI CTVXK */}
            {activeModule === 'tgpt' && (
              <div className="space-y-4">
                <div className="bg-white border border-slate-200">
                  <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold">
                    Mảng Tuyên giáo — Trưởng mảng: Đ/c Đặng Trí Toàn
                  </div>
                  <div className="divide-y divide-slate-200 text-xs">
                    <div className="grid grid-cols-12 p-3.5">
                      <div className="col-span-4 font-bold text-slate-900">
                        Phó Trưởng ban:
                      </div>
                      <div className="col-span-8 text-slate-800">
                        Đ/c Võ Chí Kiên • Đ/c Liêu Gia Kỳ
                      </div>
                    </div>
                    <div className="grid grid-cols-12 p-3.5">
                      <div className="col-span-4 font-bold text-slate-900">
                        03 Tiểu ban chuyên môn:
                      </div>
                      <div className="col-span-8 text-slate-800">
                        Tiểu ban Design • Tiểu ban Video • Tiểu ban Photo
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200">
                  <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold">
                    Mảng Phong trào &amp; Đội CTV Xung kích — Trưởng mảng: Đ/c Nguyễn Mai Gia Tường
                  </div>
                  <div className="divide-y divide-slate-200 text-xs">
                    <div className="grid grid-cols-12 p-3.5">
                      <div className="col-span-4 font-bold text-slate-900">
                        Phó Trưởng ban:
                      </div>
                      <div className="col-span-8 text-slate-800">
                        Đ/c Nguyễn Thị Thúy Nhi • Đ/c Nguyễn Thanh Đạt
                      </div>
                    </div>
                    <div className="grid grid-cols-12 p-3.5">
                      <div className="col-span-4 font-bold text-slate-900">
                        03 Tiểu ban Phong trào:
                      </div>
                      <div className="col-span-8 text-slate-800">
                        Tiểu ban Tài chính • Tiểu ban Nội dung - Kịch bản • Tiểu ban MC
                      </div>
                    </div>
                    <div className="grid grid-cols-12 p-3.5">
                      <div className="col-span-4 font-bold text-[#C10230]">
                        Đội CTV Xung kích:
                      </div>
                      <div className="col-span-8 text-slate-800">
                        Quản lý 02 Tiểu ban: <strong>Hậu cần - Sân khấu</strong> &amp;{' '}
                        <strong>Lễ tân - Khánh tiết - Văn thể mỹ</strong> (Đội trưởng: Đ/c Nguyễn Thanh Đạt)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. VĂN PHÒNG 206.B06 & CON DẤU */}
            {activeModule === 'office' && (
              <div className="space-y-4">
                <div className="bg-white border border-slate-200">
                  <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold">
                    Lịch trực Văn phòng 206.B06 (24/QĐ-HSV)
                  </div>
                  <div className="divide-y divide-slate-200 text-xs">
                    {OFFICE_SHIFTS.map((s) => (
                      <div key={s.day} className="grid grid-cols-12 p-3.5">
                        <div className="col-span-3 font-bold text-[#133F68]">
                          {s.day}
                        </div>
                        <div className="col-span-6 text-slate-700">
                          Sáng: {s.morning}
                          <br />
                          Chiều: {s.afternoon}
                        </div>
                        <div className="col-span-3 text-right font-semibold text-emerald-700">
                          {s.roomStatus}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200">
                  <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold">
                    Nhật ký đóng dấu pháp lý (Mộc HSV)
                  </div>
                  <div className="divide-y divide-slate-200 text-xs">
                    {SEAL_LOGS.map((log) => (
                      <div key={log.id} className="p-3.5 space-y-1">
                        <div className="flex justify-between font-bold text-[#133F68]">
                          <span>
                            {log.docNumber} — {log.docTitle}
                          </span>
                          <span className="font-mono text-slate-500">
                            {log.date}
                          </span>
                        </div>
                        <div className="text-slate-600">
                          Người ký: <strong>{log.approvedBy}</strong> • Văn thư
                          đóng dấu: <strong>{log.stampedBy}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 7. HỌP KHÔNG GIẤY & BAN KIỂM TRA */}
            {activeModule === 'meetings' && (
              <div className="space-y-4">
                <div className="bg-white border border-slate-200">
                  <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold">
                    Lịch Họp Không Giấy — Ban Chấp hành &amp; Ban Thư ký (23/QĐ-HSV)
                  </div>
                  <div className="divide-y divide-slate-200 text-xs">
                    <div className="p-3.5 space-y-1">
                      <div className="font-bold text-[#133F68]">
                        Hội nghị Ban Thư ký Thường kỳ Tháng 11/2026 (Phòng 206.B06)
                      </div>
                      <div className="text-slate-600">
                        Chủ trì: Đ/c Trương Châu Phước Lộc (Chủ tịch HSV) • Tài
                        liệu QR &amp; biểu quyết điện tử.
                      </div>
                    </div>
                    <div className="p-3.5 space-y-1">
                      <div className="font-bold text-[#133F68]">
                        Hội nghị Ban Chấp hành Mở rộng Quý IV/2026 (15 đ/c BCH &amp; 05 đ/c BKT)
                      </div>
                      <div className="text-slate-600">
                        Rà soát chỉ tiêu 25 Chi hội và {OFFICIAL_DOCUMENTS.length}{' '}
                        văn bản pháp lý đầu nhiệm kỳ.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200">
                  <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold">
                    Ban Kiểm tra HSV Trường ({STAFF_MEMBERS.filter((s) => s.bktRole !== 'Không').length} đ/c) — Trưởng ban: Đ/c Trần Thị Thu Huyền
                  </div>
                  <div className="divide-y divide-slate-200 text-xs">
                    <div className="p-3.5 space-y-1">
                      <div className="font-bold text-[#133F68]">
                        Kiến nghị mở thêm khung giờ Kiểm tra Thể lực Sinh viên Khỏe (Khoa KHSK)
                      </div>
                      <div className="text-emerald-700 font-semibold">
                        ✓ Đã chuyển Mảng Phong trào bố trí lịch bổ sung.
                      </div>
                    </div>
                    <div className="p-3.5 space-y-1">
                      <div className="font-bold text-[#133F68]">
                        Kiến nghị xuất tự động Phụ lục 1 sắp xếp MSSV tăng dần (Chi hội 25CNTT01)
                      </div>
                      <div className="text-emerald-700 font-semibold">
                        ✓ Đã tích hợp trên Cổng thông tin Điện tử Khóa II.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CỘT PHẢI (3/12): Khối Đỏ Đô #C10230 giống hệt "Thông tin đặt phòng" lib.eiu.edu.vn */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-[#C10230] text-white p-6">
              <div className="w-8 h-0.5 bg-white mb-3" aria-hidden="true" />
              <h3 className="text-base font-bold leading-snug font-eiu-display">
                Thông tin cán bộ
              </h3>
              <div className="mt-3 space-y-1.5 text-xs text-white/95">
                <div className="font-bold text-sm">{currentPersona.fullName}</div>
                <div>Chức vụ: {activePosition.positionTitle}</div>
                <div>Đơn vị: {activePosition.unitName}</div>
                <div className="font-mono">
                  Phân quyền: Cấp {activePosition.roleLevel}/6
                </div>
              </div>

              {currentPersona.positions.length > 1 && (
                <div className="mt-4 pt-3 border-t border-white/25">
                  <label
                    htmlFor="workspace-role-select"
                    className="block text-[11px] font-bold uppercase tracking-wider text-white/90 mb-1.5"
                  >
                    Chuyển vị trí kiêm nhiệm ({currentPersona.positions.length}):
                  </label>
                  <select
                    id="workspace-role-select"
                    value={activePosition.id}
                    onChange={(e) => setActivePositionById(e.target.value)}
                    className="w-full h-8 px-2 bg-white text-slate-900 rounded text-xs font-semibold"
                  >
                    {currentPersona.positions.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        [Cấp {pos.roleLevel}] {pos.positionTitle}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-white/25 flex flex-col gap-1.5 text-xs font-bold">
                <Link href="/gioi-thieu" className="text-white hover:underline">
                  &gt; BỘ MÁY TỔ CHỨC KHÓA II
                </Link>
                <Link href="/tra-cuu-gcn" className="text-white hover:underline">
                  &gt; TRA CỨU E-CERTIFICATE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
