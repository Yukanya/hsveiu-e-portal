'use client';

import React, { Suspense, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRole } from '@/context/role-context';
import {
  BRANCH_UNITS,
  CLUB_UNITS,
  EVENT_ITEMS,
  FACULTY_METADATA,
  ISSUED_CERTIFICATES,
  NEWS_POSTS,
  OFFICE_206_ASSETS,
  OFFICIAL_DOCUMENTS,
  PLAN_SUBMISSIONS,
  STAFF_MEMBERS,
} from '@/data/mock-data';
import { FacultyCode, PlanSubmissionItem } from '@/types';
import { WORKSPACE_MODULES, WorkspaceModuleId } from './layout';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Eye,
  FileCheck2,
  GitBranch,
  Layers,
  Package,
  ShieldCheck,
  Vote,
} from 'lucide-react';

interface Sv5tCandidateRecord {
  id: string;
  studentId: string;
  fullName: string;
  branchCode: string;
  facultyCode: FacultyCode;
  ethicsScore: number;
  gpaMax: number;
  volunteerDays: number;
  subCriteriaCount: number;
  englishLevel: string;
  isTop10Eligible: boolean;
  reviewStage: 1 | 2 | 3; // 1: Cơ sở đã duyệt, 2: Ban chuyên môn đã duyệt, 3: Thường trực chốt duyệt
}

const INITIAL_SV5T_CANDIDATES: Sv5tCandidateRecord[] = [
  {
    id: 'cand-01',
    studentId: '2431200018',
    fullName: 'Trần Nguyễn Minh Anh',
    branchCode: '24CNTT01',
    facultyCode: 'CIT',
    ethicsScore: 94,
    gpaMax: 3.68,
    volunteerDays: 14.5,
    subCriteriaCount: 9,
    englishLevel: 'IELTS 6.5 (B2)',
    isTop10Eligible: true,
    reviewStage: 3,
  },
  {
    id: 'cand-02',
    studentId: '2532300042',
    fullName: 'Lê Hoàng Bảo Trâm',
    branchCode: '25QTKD01',
    facultyCode: 'BBS',
    ethicsScore: 92,
    gpaMax: 3.55,
    volunteerDays: 12.0,
    subCriteriaCount: 8,
    englishLevel: 'Chuẩn B1 + Kỹ năng PL3',
    isTop10Eligible: true,
    reviewStage: 2,
  },
  {
    id: 'cand-03',
    studentId: '2531300019',
    fullName: 'Nguyễn Phúc Khang',
    branchCode: '25KT01',
    facultyCode: 'SET',
    ethicsScore: 89,
    gpaMax: 3.42,
    volunteerDays: 9.5,
    subCriteriaCount: 6,
    englishLevel: '02 khóa ngoại ngữ EIU',
    isTop10Eligible: false,
    reviewStage: 2,
  },
  {
    id: 'cand-04',
    studentId: '2533100088',
    fullName: 'Phạm Ngọc Thảo Vy',
    branchCode: '25KHSK01',
    facultyCode: 'SNS',
    ethicsScore: 91,
    gpaMax: 3.48,
    volunteerDays: 16.0,
    subCriteriaCount: 8,
    englishLevel: 'Chuẩn B1 + ASEAN Exchange',
    isTop10Eligible: true,
    reviewStage: 1,
  },
  {
    id: 'cand-05',
    studentId: '2531200105',
    fullName: 'Võ Minh Quân',
    branchCode: '25CNTT02',
    facultyCode: 'CIT',
    ethicsScore: 86,
    gpaMax: 3.12,
    volunteerDays: 6.5,
    subCriteriaCount: 5,
    englishLevel: 'Chuẩn B1 + Cuộc thi TA',
    isTop10Eligible: false,
    reviewStage: 1,
  },
];

const OFFICE_SHIFTS = [
  {
    day: 'Thứ Hai',
    morning: 'Phạm Thị Hồng Ngọc (Phó CVP)',
    afternoon: 'Lương Gia Hân (Cán bộ VP – Tài chính)',
    roomStatus: 'Trực hành chính 08:00 – 16:30',
  },
  {
    day: 'Thứ Ba',
    morning: 'Lê Thị Hải Yến (Phó CVP – Văn thư)',
    afternoon: 'Đào Văn Thanh (Cán bộ VP – Quản trị)',
    roomStatus: 'Tiếp nhận Phụ lục 1 GCN',
  },
  {
    day: 'Thứ Tư',
    morning: 'Nguyễn Như Quỳnh (Tổng Thư ký – Nội bộ)',
    afternoon: 'Nguyễn Mỹ Hạnh (Chánh VP – Đối ngoại)',
    roomStatus: 'Giao ban Đồng điều hành VP',
  },
  {
    day: 'Thứ Năm',
    morning: 'Phạm Thị Hồng Ngọc (Phó CVP)',
    afternoon: 'Lê Thị Hải Yến (Phó CVP – Văn thư)',
    roomStatus: 'Rà thể thức & Đóng dấu Mộc',
  },
  {
    day: 'Thứ Sáu',
    morning: 'Lương Gia Hân (Cán bộ VP)',
    afternoon: 'Đào Văn Thanh (Cán bộ VP)',
    roomStatus: 'Kiểm kê tài sản Phòng 206.B06',
  },
];

const SEAL_LOGS = [
  {
    id: 'seal-01',
    docNumber: '32/QĐ-HSV',
    docTitle: 'Quyết định công nhận GCN Tập huấn Cán bộ Đoàn – Hội 2026 (11 SV)',
    approvedBy: 'Trương Châu Phước Lộc (Chủ tịch HSV)',
    stampedBy: 'Lê Thị Hải Yến (Phó CVP)',
    date: '19/10/2026',
  },
  {
    id: 'seal-02',
    docNumber: '15/KH-HSV',
    docTitle: 'Kế hoạch Ngày hội Sinh viên Khỏe & Kiểm tra Thể lực cấp Trường',
    approvedBy: 'Nguyễn Như Quỳnh (PCT Thường trực)',
    stampedBy: 'Nguyễn Mỹ Hạnh (Chánh VP)',
    date: '21/10/2026',
  },
];

const PLAN_STAGE_LABELS: Record<
  PlanSubmissionItem['stage'],
  { label: string; badgeClass: string; nextAction?: string }
> = {
  unit_submitted: {
    label: 'Bước 1/4: Cơ sở nộp',
    badgeClass: 'bg-slate-100 text-slate-800',
    nextAction: 'Cụm trưởng duyệt →',
  },
  cluster_reviewed: {
    label: 'Bước 2/4: Cụm trưởng đã thẩm định',
    badgeClass: 'bg-blue-50 text-[#0054A6] border border-blue-200',
    nextAction: 'VP 206.B06 rà thể thức →',
  },
  office_format_checked: {
    label: 'Bước 3/4: VP 206.B06 đã duyệt thể thức',
    badgeClass: 'bg-[#FFF9F0] text-[#A68556] border border-[#A68556]/40',
    nextAction: 'BTK ký ban hành →',
  },
  btk_approved: {
    label: 'Bước 4/4: BTK đã ký ban hành',
    badgeClass: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  },
};

function subscribeToHash(callback: () => void) {
  window.addEventListener('hashchange', callback);
  window.addEventListener('popstate', callback);
  return () => {
    window.removeEventListener('hashchange', callback);
    window.removeEventListener('popstate', callback);
  };
}

function getHashSnapshot(): string {
  return window.location.hash.replace(/^#/, '');
}

function getServerHashSnapshot(): string {
  return '';
}

function isValidWorkspaceModule(val: string | null): val is WorkspaceModuleId {
  return Boolean(val && WORKSPACE_MODULES.some((m) => m.id === val));
}

function WorkspaceContent({
  initialModule,
}: {
  initialModule: WorkspaceModuleId;
}) {
  const {
    currentPersona,
    activePosition,
    allPersonas,
    setActivePositionById,
    setPersonaById,
  } = useRole();

  const [activeModule, setActiveModule] =
    useState<WorkspaceModuleId>(initialModule);
  const [actionToast, setActionToast] = useState<string | null>(null);

  // State các phân hệ nghiệp vụ
  const [eventsState, setEventsState] = useState(EVENT_ITEMS);
  const [showPhuLuc1Table, setShowPhuLuc1Table] = useState(false);

  const [candidatesState, setCandidatesState] = useState<Sv5tCandidateRecord[]>(
    INITIAL_SV5T_CANDIDATES
  );
  const [onlyTop10Sv5t, setOnlyTop10Sv5t] = useState(false);

  const [branchFacultyFilter, setBranchFacultyFilter] = useState<
    'ALL' | FacultyCode
  >('ALL');

  const [plansState, setPlansState] =
    useState<PlanSubmissionItem[]>(PLAN_SUBMISSIONS);

  const [assetsState, setAssetsState] = useState(OFFICE_206_ASSETS);

  const [myVote, setMyVote] = useState<
    'APPROVE' | 'REJECT' | 'ABSTAIN' | null
  >(null);

  const triggerToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 4000);
  };

  const selectModule = (id: WorkspaceModuleId) => {
    setActiveModule(id);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `/workspace#${id}`);
    }
  };

  const handleApprove3DaysPrior = (eventId: string, title: string) => {
    setEventsState((prev) =>
      prev.map((ev) =>
        ev.id === eventId
          ? { ...ev, preApprovalStatus: 'approved_3days_prior' }
          : ev
      )
    );
    triggerToast(
      `Đã thẩm định & duyệt chủ trương Ngày tình nguyện trước 03 ngày: "${title}".`
    );
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
    triggerToast(
      `Đã ký Quyết định 35/QĐ-HSV (đúng hạn SLA 07 ngày) và kích hoạt QR E-Certificate: "${title}".`
    );
  };

  const handleAdvanceSv5tStage = (candId: string, fullName: string) => {
    setCandidatesState((prev) =>
      prev.map((c) =>
        c.id === candId && c.reviewStage < 3
          ? { ...c, reviewStage: (c.reviewStage + 1) as 1 | 2 | 3 }
          : c
      )
    );
    triggerToast(`Đã phê duyệt nâng cấp hồ sơ SV5T của hội viên ${fullName}.`);
  };

  const handleAdvancePlanStage = (plan: PlanSubmissionItem) => {
    const nextMap: Record<
      PlanSubmissionItem['stage'],
      PlanSubmissionItem['stage']
    > = {
      unit_submitted: 'cluster_reviewed',
      cluster_reviewed: 'office_format_checked',
      office_format_checked: 'btk_approved',
      btk_approved: 'btk_approved',
    };
    const nextStage = nextMap[plan.stage];
    setPlansState((prev) =>
      prev.map((p) => (p.id === plan.id ? { ...p, stage: nextStage } : p))
    );
    triggerToast(
      `Đã chuyển kế hoạch ${plan.planCode} sang: ${PLAN_STAGE_LABELS[nextStage].label}.`
    );
  };

  const handleToggleAssetReturn = (assetId: string, name: string) => {
    setAssetsState((prev) =>
      prev.map((ast) => {
        if (ast.id !== assetId) return ast;
        if (ast.status === 'borrowed') {
          return {
            ...ast,
            status: 'available',
            availableQty: ast.totalQty,
            borrowerUnit: undefined,
            borrowerName: undefined,
            dueDate: undefined,
          };
        }
        return {
          ...ast,
          status: 'borrowed',
          availableQty: Math.max(0, ast.totalQty - 1),
          borrowerUnit: activePosition.unitName,
          borrowerName: currentPersona.fullName,
          dueDate: '20/11/2026',
        };
      })
    );
    triggerToast(`Đã cập nhật sổ tài sản Phòng 206.B06: "${name}".`);
  };

  const pendingCertEvents = eventsState.filter(
    (e) =>
      e.preApprovalStatus === 'pending_tcxdh' ||
      e.certWorkflowStatus === 'list_submitted_sla'
  );
  const pendingPlans = plansState.filter((p) => p.stage !== 'btk_approved');
  const qualifiedCollectiveBranches = BRANCH_UNITS.filter(
    (b) =>
      b.sv5tRegisteredRate === 100 &&
      b.sv5tAchievedRate >= 30 &&
      !b.hasDisciplineViolation
  );
  const borrowedAssets = assetsState.filter((a) => a.status === 'borrowed');

  const filteredBranches =
    branchFacultyFilter === 'ALL'
      ? BRANCH_UNITS
      : BRANCH_UNITS.filter((b) => b.facultyCode === branchFacultyFilter);

  const displayedCandidates = onlyTop10Sv5t
    ? candidatesState.filter((c) => c.isTop10Eligible)
    : candidatesState;

  const currentModuleMeta =
    WORKSPACE_MODULES.find((m) => m.id === activeModule) ||
    WORKSPACE_MODULES[0];

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      {/* Toast thông báo điều hành */}
      {actionToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-md bg-[#133F68] text-white border-l-4 border-[#FCB900] p-4 shadow-xl text-xs"
        >
          <div className="font-bold uppercase tracking-wider text-[#00BCFF] mb-1 font-eiu-display">
            E-Office HSV EIU • Phòng 206.B06
          </div>
          <div>{actionToast}</div>
        </div>
      )}

      {/* E-OFFICE COMMAND HEADER (MAX-W-1200PX) — TÍCH HỢP CHUYỂN VAI TRÒ KIÊM NHIỆM & 4 KPI ĐIỀU HÀNH */}
      <section className="bg-[#02294E] eiu-arch-pattern text-white border-b-3 border-[#A68556]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-7 space-y-5">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#C10230] text-white text-[10.5px] font-bold uppercase tracking-wider font-eiu-display">
                  HỆ THỐNG QUẢN TRỊ NỘI BỘ E-OFFICE KHÓA II
                </span>
                <span className="px-2 py-0.5 bg-[#00BCFF]/20 text-[#00BCFF] font-mono text-xs font-bold">
                  RBAC: CẤP {activePosition.roleLevel}/6
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-eiu-display">
                Đ/c {currentPersona.fullName}
              </h1>
              <div className="text-xs text-[#DED1BE]">
                Đang tác nghiệp với vai trò:{' '}
                <strong className="text-white">
                  {activePosition.positionTitle}
                </strong>{' '}
                — {activePosition.unitName}
              </div>
            </div>

            {/* Bộ chuyển nhanh Cán bộ & Vị trí Kiêm nhiệm ngay trên Command Header */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 xl:w-[500px] shrink-0">
              <div className="bg-[#133F68] border border-white/15 p-2.5">
                <label
                  htmlFor="eoffice-persona-select"
                  className="block text-[10px] font-mono uppercase text-[#DED1BE] mb-1"
                >
                  Đóng vai Cán bộ / Hội viên (6 Cấp):
                </label>
                <select
                  id="eoffice-persona-select"
                  value={currentPersona.id}
                  onChange={(e) => setPersonaById(e.target.value)}
                  className="w-full h-8 px-2 bg-white text-slate-900 rounded text-xs font-semibold"
                >
                  {allPersonas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} (Cấp {p.positions[0].roleLevel}/6)
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-[#133F68] border border-white/15 p-2.5">
                <label
                  htmlFor="eoffice-pos-select"
                  className="block text-[10px] font-mono uppercase text-[#DED1BE] mb-1"
                >
                  Ngữ cảnh Kiêm nhiệm ({currentPersona.positions.length} vị
                  trí):
                </label>
                <select
                  id="eoffice-pos-select"
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
            </div>
          </div>

          {/* 04 Ô KPI Điều hành thời gian thực */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <button
              type="button"
              onClick={() => selectModule('certificates')}
              className="bg-[#133F68]/90 border border-white/15 hover:border-[#00BCFF] p-3.5 text-left cursor-pointer"
            >
              <div className="text-[10.5px] font-mono uppercase text-[#DED1BE]">
                Hàng đợi QĐ 28 &amp; SLA
              </div>
              <div className="text-xl font-extrabold font-mono text-[#FCB900] mt-0.5">
                0{pendingCertEvents.length} Hồ sơ
              </div>
              <div className="text-[11px] text-white/80 mt-0.5">
                Duyệt trước 3N &amp; Cấp E-Cert
              </div>
            </button>

            <button
              type="button"
              onClick={() => selectModule('documents')}
              className="bg-[#133F68]/90 border border-white/15 hover:border-[#00BCFF] p-3.5 text-left cursor-pointer"
            >
              <div className="text-[10.5px] font-mono uppercase text-[#DED1BE]">
                Kế hoạch Trình duyệt
              </div>
              <div className="text-xl font-extrabold font-mono text-[#00BCFF] mt-0.5">
                0{pendingPlans.length} / 0{plansState.length} KH
              </div>
              <div className="text-[11px] text-white/80 mt-0.5">
                Đang luân chuyển 4 bước
              </div>
            </button>

            <button
              type="button"
              onClick={() => selectModule('collective')}
              className="bg-[#133F68]/90 border border-white/15 hover:border-[#00BCFF] p-3.5 text-left cursor-pointer"
            >
              <div className="text-[10.5px] font-mono uppercase text-[#DED1BE]">
                Tập thể SV5T Đạt chuẩn
              </div>
              <div className="text-xl font-extrabold font-mono text-emerald-300 mt-0.5">
                {qualifiedCollectiveBranches.length} / {BRANCH_UNITS.length} CH
              </div>
              <div className="text-[11px] text-white/80 mt-0.5">
                100% ĐK • ≥ 30% Đạt • 0 KL
              </div>
            </button>

            <button
              type="button"
              onClick={() => selectModule('office')}
              className="bg-[#133F68]/90 border border-white/15 hover:border-[#00BCFF] p-3.5 text-left cursor-pointer"
            >
              <div className="text-[10.5px] font-mono uppercase text-[#DED1BE]">
                Văn phòng 206.B06 &amp; Mộc
              </div>
              <div className="text-xl font-extrabold font-mono text-white mt-0.5">
                0{borrowedAssets.length} Thiết bị
              </div>
              <div className="text-[11px] text-white/80 mt-0.5">
                Đang cho cơ sở Hội mượn
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* LƯỚI RỘNG 3/9 (MAX-W-1200PX) — LOẠI BỎ HOÀN TOÀN BỐ CỤC 3-6-3 CHẬT HẸP */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI (3/12): Menu 08 Phân hệ E-Office góc vuông chuẩn EIU */}
          <aside
            aria-label="Danh mục 08 Phân hệ E-Office"
            className="lg:col-span-3 space-y-5"
          >
            <div className="bg-white border border-slate-200">
              <div className="bg-[#133F68] text-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider font-eiu-display">
                08 Phân hệ Điều hành Số
              </div>
              <div className="divide-y divide-white">
                {WORKSPACE_MODULES.map((item) => {
                  const isSelected = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectModule(item.id)}
                      aria-current={isSelected ? 'page' : undefined}
                      className={`w-full text-left px-4 py-3 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#C10230] text-white font-bold'
                          : 'bg-[#EAE3D2] text-slate-900 hover:bg-[#dfd5be]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 font-bold ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-white/85 text-[#133F68]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#C10230] text-white p-5 space-y-2">
              <div className="w-8 h-0.5 bg-white" aria-hidden="true" />
              <h2 className="text-sm font-bold font-eiu-display">
                Trực Văn phòng 206.B06
              </h2>
              <p className="text-xs text-white/92 leading-relaxed">
                Đồng điều hành bởi <strong>Chánh Văn phòng</strong> (Đối ngoại)
                và <strong>Tổng Thư ký</strong> (Nội bộ) theo Quyết định
                24/QĐ-HSV.
              </p>
            </div>
          </aside>

          {/* CỘT PHẢI (9/12): Không gian làm việc rộng rãi cho Bảng dữ liệu & Quy trình */}
          <div className="lg:col-span-9 space-y-6">
            <div className="bg-white border border-slate-200 p-5 border-l-4 border-l-[#133F68]">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display">
                {currentModuleMeta.title}
              </h2>
              <p className="text-[13.5px] text-slate-600 mt-1 leading-relaxed">
                {currentModuleMeta.shortDesc}
              </p>
            </div>

            {activePosition.roleLevel === 1 && (
              <div
                role="alert"
                className="bg-[#FFF9F0] border-l-4 border-[#C10230] p-4 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div>
                  <strong className="text-[#133F68]">
                    Chế độ xem Hội viên (Cấp 1/6):
                  </strong>{' '}
                  Bạn đang đăng nhập bằng tài khoản Sinh viên mẫu. Chuyển sang
                  tài khoản Thường trực / BCH (Cấp 4 – 6) để thực hiện ký duyệt.
                </div>
                <button
                  type="button"
                  onClick={() => setPersonaById('staff-01')}
                  className="px-4 py-1.5 bg-[#0054A6] hover:bg-[#133F68] text-white rounded text-xs font-bold shrink-0 cursor-pointer font-eiu-display"
                >
                  Chuyển sang Chủ tịch HSV (Cấp 6)
                </button>
              </div>
            )}

            {/* ============================================================
                1. TỔNG QUAN ĐIỀU HÀNH (OVERVIEW)
               ============================================================ */}
            {activeModule === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-slate-200 p-5 space-y-2">
                    <div className="text-xs font-bold uppercase text-[#0054A6] font-eiu-display">
                      Cơ cấu Cấp Trường (Khóa II, 2026 – 2028)
                    </div>
                    <div className="text-lg font-bold text-[#133F68] font-eiu-display">
                      15 Ủy viên BCH • 05 Ban Thư ký • 05 Ban Kiểm tra
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      03 đơn vị chuyên môn trực thuộc: Văn phòng 206.B06 (Đồng
                      điều hành), Ban Tổ chức &amp; Xây dựng Hội (05 Cụm), Ban
                      Tuyên giáo – Phong trào (02 Mảng + Đội CTVXK).
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 p-5 space-y-2">
                    <div className="text-xs font-bold uppercase text-[#C10230] font-eiu-display">
                      Mạng lưới 55 Cơ sở Hội Trực thuộc
                    </div>
                    <div className="text-lg font-bold text-[#133F68] font-eiu-display">
                      {BRANCH_UNITS.length} Chi hội (04 Khoa) •{' '}
                      {CLUB_UNITS.length} CLB – Đội – Nhóm
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Hiện có{' '}
                      <strong className="text-emerald-700">
                        {qualifiedCollectiveBranches.length}/
                        {BRANCH_UNITS.length} Chi hội
                      </strong>{' '}
                      đạt đủ 03 điều kiện Tập thể Sinh viên 5 Tốt cấp Trường
                      theo Quyết định 09/QĐ-HSV sửa đổi 2026.
                    </p>
                  </div>
                </div>

                {/* Hàng đợi phê duyệt ưu tiên */}
                <div className="bg-white border border-slate-200">
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between font-eiu-display">
                    <span>Hàng đợi Phê duyệt Ưu tiên (QĐ 28/QĐ-HSV &amp; Văn thư)</span>
                    <span className="font-mono text-[#FCB900]">
                      SLA CAM KẾT ≤ 07 NGÀY LÀM VIỆC
                    </span>
                  </div>
                  <div className="divide-y divide-slate-200 text-xs">
                    {pendingCertEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="font-bold text-[#133F68] text-sm">
                            {ev.title}
                          </div>
                          <div className="text-slate-600">
                            Đơn vị: <strong>{ev.organizerUnit}</strong> • Quy
                            đổi gốc:{' '}
                            <strong className="font-mono text-[#C10230]">
                              +{ev.baseVolunteerDays.toFixed(1)} ngày
                            </strong>
                          </div>
                        </div>
                        {ev.preApprovalStatus === 'pending_tcxdh' ? (
                          <button
                            type="button"
                            disabled={activePosition.roleLevel < 4}
                            onClick={() =>
                              handleApprove3DaysPrior(ev.id, ev.title)
                            }
                            className="px-4 py-2 bg-[#0054A6] hover:bg-[#133F68] disabled:bg-slate-300 text-white rounded text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer font-eiu-display"
                          >
                            Duyệt trước 03 ngày
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={activePosition.roleLevel < 6}
                            onClick={() =>
                              handleIssueDecisionAndCerts(ev.id, ev.title)
                            }
                            className="px-4 py-2 bg-[#C10230] hover:bg-[#a10228] disabled:bg-slate-300 text-white rounded text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer font-eiu-display"
                          >
                            Ký QĐ &amp; Cấp E-Cert (SLA 0{ev.slaDaysRemaining}N)
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                2. DUYỆT NGÀY TÌNH NGUYỆN & CẤP GCN (CERTIFICATES — QĐ 28)
               ============================================================ */}
            {activeModule === 'certificates' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-slate-700">
                    <strong>Quy tắc Hệ số Phụ lục 2:</strong> Nhóm{' '}
                    <em>06 - Công tác Đoàn – Hội</em> nhân{' '}
                    <strong>×3 (Trưởng/Phó BTC)</strong>,{' '}
                    <strong>×2 (Thành viên BTC)</strong>,{' '}
                    <strong>×1 (CTV/Chiến sĩ/SV)</strong>. Hiến máu cố định{' '}
                    <strong>5.0 ngày/lần</strong>.
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPhuLuc1Table(!showPhuLuc1Table)}
                    className="px-3.5 py-1.5 bg-[#133F68] hover:bg-[#0054A6] text-white font-bold uppercase tracking-wider cursor-pointer font-eiu-display"
                  >
                    {showPhuLuc1Table
                      ? 'Ẩn Bảng Phụ lục 1 Mẫu'
                      : 'Xem Phụ lục 1 (MSSV Tăng dần)'}
                  </button>
                </div>

                {showPhuLuc1Table && (
                  <div className="bg-white border-2 border-[#133F68] overflow-x-auto">
                    <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between font-eiu-display">
                      <span>
                        Mẫu Kết xuất Phụ lục 1 — Quyết định 32/QĐ-HSV (Đã sắp
                        xếp MSSV tăng dần)
                      </span>
                      <Link
                        href="/tra-cuu-gcn?q=32/QĐ-HSV"
                        className="text-[#00BCFF] hover:underline"
                      >
                        Mở trang Xác thực Công khai →
                      </Link>
                    </div>
                    <table className="eiu-table">
                      <thead>
                        <tr>
                          <th className="w-12 text-center">STT</th>
                          <th className="w-28">MSSV (↑)</th>
                          <th>Họ và tên • Đơn vị</th>
                          <th>Vai trò tham gia</th>
                          <th className="w-24 text-right">Ngày TN</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ISSUED_CERTIFICATES.map((cert) => (
                          <tr key={cert.id}>
                            <td className="text-center font-mono text-xs font-bold">
                              {String(cert.certSerialNumber).padStart(2, '0')}
                            </td>
                            <td className="font-mono text-xs font-bold text-[#133F68]">
                              {cert.studentId}
                            </td>
                            <td className="text-xs">
                              <div className="font-bold text-[#133F68]">
                                {cert.fullName}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {cert.unitName}
                              </div>
                            </td>
                            <td className="text-xs text-slate-700">
                              {cert.roleTitle}
                            </td>
                            <td className="text-right font-mono text-xs font-bold text-[#C10230]">
                              +{cert.volunteerDays.toFixed(1)} (×
                              {cert.multiplierApplied})
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="bg-white border border-slate-300 overflow-x-auto">
                  <table className="eiu-table">
                    <thead>
                      <tr>
                        <th>Chương trình &amp; Đơn vị tổ chức</th>
                        <th className="w-44">Cơ chế Quy đổi Ngày TN</th>
                        <th className="w-44">Tiến độ QĐ 28 &amp; SLA</th>
                        <th className="w-40 text-right">Thao tác duyệt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventsState.map((ev) => (
                        <tr key={ev.id}>
                          <td className="space-y-1">
                            <div className="font-bold text-[#133F68]">
                              {ev.title}
                            </div>
                            <div className="text-xs text-slate-600">
                              {ev.organizerUnit} • SV5T:{' '}
                              <strong>{ev.sv5tCriterion}</strong>
                            </div>
                          </td>
                          <td className="text-xs">
                            <div className="font-mono font-bold text-[#C10230]">
                              Gốc: +{ev.baseVolunteerDays.toFixed(1)} ngày
                            </div>
                            <div className="text-[11px] text-slate-600 mt-0.5">
                              {ev.isUnionWorkMultiplierEligible
                                ? '06 - Đoàn–Hội (Nhân ×1, ×2, ×3)'
                                : '04 - Sức khỏe (Cố định ×1)'}
                            </div>
                          </td>
                          <td className="text-xs">
                            {ev.certWorkflowStatus === 'decision_issued' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Đã cấp {ev.decisionNumber}</span>
                              </span>
                            ) : ev.certWorkflowStatus ===
                              'list_submitted_sla' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FFF9F0] border border-[#A68556] text-[#133F68] font-bold">
                                <Clock className="w-3.5 h-3.5 text-[#A68556]" />
                                <span>SLA còn 0{ev.slaDaysRemaining}/07N</span>
                              </span>
                            ) : ev.preApprovalStatus === 'pending_tcxdh' ? (
                              <span className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-[#C10230] font-bold">
                                Chờ duyệt trước 03 ngày
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-[#EAE3D2] text-[#133F68] font-semibold">
                                ✓ Đã duyệt chủ trương 3N
                              </span>
                            )}
                          </td>
                          <td className="text-right">
                            {ev.preApprovalStatus === 'pending_tcxdh' ? (
                              <button
                                type="button"
                                disabled={activePosition.roleLevel < 4}
                                onClick={() =>
                                  handleApprove3DaysPrior(ev.id, ev.title)
                                }
                                className="px-3 py-1.5 bg-[#0054A6] hover:bg-[#133F68] disabled:bg-slate-300 text-white rounded text-xs font-bold cursor-pointer"
                              >
                                Duyệt trước 3N
                              </button>
                            ) : ev.certWorkflowStatus ===
                              'list_submitted_sla' ? (
                              <button
                                type="button"
                                disabled={activePosition.roleLevel < 6}
                                onClick={() =>
                                  handleIssueDecisionAndCerts(ev.id, ev.title)
                                }
                                className="px-3 py-1.5 bg-[#C10230] hover:bg-[#a10228] disabled:bg-slate-300 text-white rounded text-xs font-bold cursor-pointer"
                              >
                                Ký QĐ &amp; E-Cert
                              </button>
                            ) : ev.certWorkflowStatus === 'decision_issued' ? (
                              <Link
                                href={`/tra-cuu-gcn?q=${encodeURIComponent(
                                  ev.decisionNumber || '32/QĐ-HSV'
                                )}`}
                                className="inline-flex items-center gap-1 text-xs font-bold text-[#0054A6] hover:text-[#C10230]"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Xem GCN</span>
                              </Link>
                            ) : (
                              <span className="text-[11px] text-slate-400">
                                Chờ kết thúc SK
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ============================================================
                3. HỘI ĐỒNG XÉT CHỌN SV5T 3 CẤP & TOP 10% (QĐ 09/2026)
               ============================================================ */}
            {activeModule === 'sv5t' && (
              <div className="space-y-5">
                <div className="bg-white border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setOnlyTop10Sv5t(false)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer font-eiu-display ${
                        !onlyTop10Sv5t
                          ? 'bg-[#C10230] text-white border-[#C10230]'
                          : 'bg-[#F5F5F5] text-[#133F68] border-slate-300'
                      }`}
                    >
                      Tất cả Hồ sơ Đạt chuẩn GPA ≥ 3.00 ({candidatesState.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setOnlyTop10Sv5t(true)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer font-eiu-display ${
                        onlyTop10Sv5t
                          ? 'bg-[#C10230] text-white border-[#C10230]'
                          : 'bg-[#F5F5F5] text-[#133F68] border-slate-300'
                      }`}
                    >
                      ★ Lọc Ứng viên Top 10% Tiêu biểu Toàn trường
                    </button>
                  </div>

                  <span className="text-xs font-mono text-slate-600">
                    Cấp 1 Cơ sở → Cấp 2 Ban CM → Cấp 3 Thường trực
                  </span>
                </div>

                <div className="bg-white border border-slate-300 overflow-x-auto">
                  <table className="eiu-table">
                    <thead>
                      <tr>
                        <th>Ứng viên • Chi hội</th>
                        <th>Chỉ số 05 Tiêu chuẩn (GPA ≥ 3.00)</th>
                        <th className="w-44">Cấp xét duyệt hiện tại</th>
                        <th className="w-36 text-right">Phê duyệt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedCandidates.map((c) => (
                        <tr key={c.id}>
                          <td className="space-y-0.5">
                            <div className="font-bold text-[#133F68]">
                              {c.fullName}
                            </div>
                            <div className="text-xs font-mono text-slate-500">
                              {c.studentId} • {c.branchCode}
                            </div>
                            {c.isTop10Eligible && (
                              <span className="inline-block px-1.5 py-0.5 bg-[#C10230] text-white text-[10px] font-bold uppercase font-eiu-display">
                                ★ Ứng viên Top 10% Tiêu biểu
                              </span>
                            )}
                          </td>
                          <td className="text-xs text-slate-700 space-y-1">
                            <div>
                              ĐRL: <strong>{c.ethicsScore}</strong> • GPA MAX:{' '}
                              <strong className="font-mono text-[#0054A6]">
                                {c.gpaMax.toFixed(2)}/4.00
                              </strong>{' '}
                              • TN:{' '}
                              <strong className="font-mono text-[#C10230]">
                                {c.volunteerDays.toFixed(1)} ngày
                              </strong>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {c.englishLevel} • Tích lũy:{' '}
                              <strong>{c.subCriteriaCount} tiêu chí phụ</strong>
                            </div>
                          </td>
                          <td className="text-xs">
                            {c.reviewStage === 3 ? (
                              <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                                ✓ Cấp 3: Thường trực đã chốt
                              </span>
                            ) : c.reviewStage === 2 ? (
                              <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-[#0054A6] font-bold">
                                Cấp 2: Ban TG-PT/TC-XDH duyệt
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-[#EAE3D2] text-[#133F68] font-bold">
                                Cấp 1: Cơ sở Hội sơ duyệt
                              </span>
                            )}
                          </td>
                          <td className="text-right">
                            {c.reviewStage < 3 ? (
                              <button
                                type="button"
                                disabled={activePosition.roleLevel < 4}
                                onClick={() =>
                                  handleAdvanceSv5tStage(c.id, c.fullName)
                                }
                                className="px-3 py-1.5 bg-[#0054A6] hover:bg-[#133F68] disabled:bg-slate-300 text-white rounded text-xs font-bold cursor-pointer"
                              >
                                Duyệt Cấp {c.reviewStage + 1} →
                              </button>
                            ) : (
                              <span className="text-xs font-bold text-emerald-700">
                                Đủ điều kiện QĐ
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ============================================================
                4. TẬP THỂ SV5T — 25 CHI HỘI THUỘC 04 CỤM KHOA
               ============================================================ */}
            {activeModule === 'collective' && (
              <div className="space-y-5">
                <div className="bg-white border border-slate-200 p-4 flex flex-wrap items-center gap-2">
                  {(
                    [
                      { code: 'ALL', label: 'Tất cả 25 Chi hội' },
                      { code: 'BBS', label: 'Cụm QTKD (06)' },
                      { code: 'SET', label: 'Cụm Kỹ thuật (06)' },
                      { code: 'CIT', label: 'Cụm CNTT (07)' },
                      { code: 'SNS', label: 'Cụm KH Sức khỏe (06)' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.code}
                      type="button"
                      onClick={() => setBranchFacultyFilter(tab.code)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer font-eiu-display ${
                        branchFacultyFilter === tab.code
                          ? 'bg-[#C10230] text-white border-[#C10230]'
                          : 'bg-[#F5F5F5] text-[#133F68] border-slate-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="bg-white border border-slate-300 overflow-x-auto">
                  <table className="eiu-table">
                    <thead>
                      <tr>
                        <th className="w-28">Mã Chi hội</th>
                        <th>Cụm Khoa &amp; Cụm trưởng</th>
                        <th className="w-24 text-center">ĐK SV5T</th>
                        <th className="w-52">Tỷ lệ Đạt SV5T (≥ 30%)</th>
                        <th className="w-32 text-right">Xếp loại</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBranches.map((branch) => {
                        const isQualified =
                          branch.sv5tRegisteredRate === 100 &&
                          branch.sv5tAchievedRate >= 30 &&
                          !branch.hasDisciplineViolation;
                        return (
                          <tr key={branch.id}>
                            <td className="font-mono font-bold text-[#133F68]">
                              <Link
                                href={`/to-chuc/${branch.slug}`}
                                className="hover:text-[#C10230] hover:underline"
                              >
                                {branch.code}
                              </Link>
                              <div className="text-[11px] font-normal text-slate-500">
                                {branch.totalMembers} HV
                              </div>
                            </td>
                            <td className="text-xs">
                              <div className="font-bold text-[#133F68]">
                                {FACULTY_METADATA[branch.facultyCode].nameVi}
                              </div>
                              <div className="text-slate-600">
                                {branch.clusterLeaderName}
                              </div>
                            </td>
                            <td className="text-center font-mono text-xs font-bold text-[#0054A6]">
                              {branch.sv5tRegisteredRate}%
                            </td>
                            <td>
                              <div className="space-y-1">
                                <div className="flex justify-between font-mono text-xs font-bold">
                                  <span
                                    className={
                                      isQualified
                                        ? 'text-emerald-700'
                                        : 'text-[#C10230]'
                                    }
                                  >
                                    {branch.sv5tAchievedRate}% / 30%
                                  </span>
                                  <span className="text-[10.5px] text-slate-500">
                                    0% KL
                                  </span>
                                </div>
                                <div className="w-full h-2 bg-slate-200">
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
                                          (branch.sv5tAchievedRate / 45) * 100
                                        )
                                      )}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="text-right text-xs font-bold">
                              {isQualified ? (
                                <span className="text-emerald-700">
                                  ✓ ĐẠT CHUẨN
                                </span>
                              ) : (
                                <span className="text-[#C10230]">
                                  ĐÔN ĐỐC CƠ SỞ
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ============================================================
                5. VĂN THƯ LƯU TRỮ & TRÌNH DUYỆT KẾ HOẠCH 04 BƯỚC (DOCUMENTS)
               ============================================================ */}
            {activeModule === 'documents' && (
              <div className="space-y-6">
                {/* Quy trình trình duyệt kế hoạch trực tuyến 4 bước */}
                <div className="bg-white border border-slate-300 overflow-x-auto">
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between font-eiu-display">
                    <span className="inline-flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-[#FCB900]" />
                      <span>
                        Luồng Trình duyệt Kế hoạch Trực tuyến 04 Bước (Cơ sở →
                        Cụm trưởng → VP 206.B06 → BTK)
                      </span>
                    </span>
                  </div>
                  <table className="eiu-table">
                    <thead>
                      <tr>
                        <th className="w-32">Số KH</th>
                        <th>Tên Kế hoạch &amp; Đơn vị trình</th>
                        <th className="w-52">Bước xử lý hiện tại</th>
                        <th className="w-44 text-right">Luân chuyển</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plansState.map((plan) => {
                        const stageMeta = PLAN_STAGE_LABELS[plan.stage];
                        return (
                          <tr key={plan.id}>
                            <td className="font-mono text-xs font-bold text-[#133F68]">
                              {plan.planCode}
                              <div className="text-[10.5px] font-normal text-slate-500">
                                Tổ chức: {plan.eventDate}
                              </div>
                            </td>
                            <td className="space-y-1">
                              <div className="font-bold text-[#133F68]">
                                {plan.title}
                              </div>
                              <div className="text-xs text-slate-600">
                                {plan.submittingUnit} • {plan.clusterName}
                              </div>
                            </td>
                            <td>
                              <span
                                className={`inline-block px-2 py-1 text-[11px] font-bold ${stageMeta.badgeClass}`}
                              >
                                {stageMeta.label}
                              </span>
                            </td>
                            <td className="text-right">
                              {stageMeta.nextAction ? (
                                <button
                                  type="button"
                                  disabled={activePosition.roleLevel < 4}
                                  onClick={() => handleAdvancePlanStage(plan)}
                                  className="px-3 py-1.5 bg-[#0054A6] hover:bg-[#133F68] disabled:bg-slate-300 text-white rounded text-xs font-bold cursor-pointer"
                                >
                                  {stageMeta.nextAction}
                                </button>
                              ) : (
                                <span className="text-xs font-bold text-emerald-700">
                                  ✓ Đã ban hành
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Sổ Đăng ký Văn bản Đi / Quyết định Khóa II */}
                <div className="bg-white border border-slate-200">
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between font-eiu-display">
                    <span>Sổ Đăng ký Văn bản Pháp lý Đã Ban hành ({OFFICIAL_DOCUMENTS.length})</span>
                    <Link
                      href="/van-ban"
                      className="text-[#00BCFF] hover:underline"
                    >
                      Mở Kho Văn bản Công khai →
                    </Link>
                  </div>
                  <div className="divide-y divide-slate-200 text-xs">
                    {OFFICIAL_DOCUMENTS.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <span className="font-mono font-bold text-[#0054A6] mr-2">
                            {doc.documentNumber}
                          </span>
                          <span className="font-semibold text-[#133F68]">
                            {doc.title}
                          </span>
                        </div>
                        <span className="font-mono text-slate-500 shrink-0">
                          {doc.signedDate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                6. BAN TUYÊN GIÁO - PHONG TRÀO & ĐỘI CTV XUNG KÍCH (TGPT)
               ============================================================ */}
            {activeModule === 'tgpt' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-white border border-slate-200">
                    <div className="bg-[#133F68] text-white px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 font-eiu-display">
                      <Layers className="w-4 h-4 text-[#00BCFF]" />
                      <span>Mảng Tuyên giáo (03 Tiểu ban)</span>
                    </div>
                    <div className="p-4 space-y-2.5 text-xs">
                      <div>
                        Trưởng mảng:{' '}
                        <strong className="text-[#133F68]">
                          Đ/c Đặng Trí Toàn
                        </strong>{' '}
                        (UV BCH, Phó Trưởng BKT)
                      </div>
                      <div>
                        02 Phó Trưởng ban: <strong>Đ/c Võ Chí Kiên</strong> •{' '}
                        <strong>Đ/c Liêu Gia Kỳ</strong>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5 font-mono text-[11px]">
                        <span className="px-2 py-1 bg-[#F0F6FC] border border-slate-200 text-[#133F68] font-bold">
                          Tiểu ban Design
                        </span>
                        <span className="px-2 py-1 bg-[#F0F6FC] border border-slate-200 text-[#133F68] font-bold">
                          Tiểu ban Video
                        </span>
                        <span className="px-2 py-1 bg-[#F0F6FC] border border-slate-200 text-[#133F68] font-bold">
                          Tiểu ban Photo
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200">
                    <div className="bg-[#C10230] text-white px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 font-eiu-display">
                      <GitBranch className="w-4 h-4 text-[#FCB900]" />
                      <span>Mảng Phong trào &amp; Đội CTV Xung kích</span>
                    </div>
                    <div className="p-4 space-y-2.5 text-xs">
                      <div>
                        Trưởng mảng:{' '}
                        <strong className="text-[#133F68]">
                          Đ/c Nguyễn Mai Gia Tường
                        </strong>{' '}
                        (UV BTK, CN CLB SV5T)
                      </div>
                      <div>
                        02 Phó Trưởng ban:{' '}
                        <strong>Đ/c Nguyễn Thị Thúy Nhi</strong> •{' '}
                        <strong>Đ/c Nguyễn Thanh Đạt</strong> (Đội trưởng Đội
                        CTVXK)
                      </div>
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <div className="text-[11px] text-slate-600">
                          • 03 Tiểu ban Phong trào:{' '}
                          <strong>Tài chính • Nội dung – Kịch bản • MC</strong>
                        </div>
                        <div className="text-[11px] text-[#C10230] font-semibold">
                          • Đội CTV Xung kích quản lý 02 Tiểu ban:{' '}
                          <strong>Hậu cần – Sân khấu</strong> &amp;{' '}
                          <strong>Lễ tân – Khánh tiết – Văn thể mỹ</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quản trị CMS Tin tức đã xuất bản */}
                <div className="bg-white border border-slate-300 overflow-x-auto">
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between font-eiu-display">
                    <span>Quản trị Bản tin CMS Cổng thông tin ({NEWS_POSTS.length} bài đã xuất bản)</span>
                    <Link
                      href="/tin-tuc"
                      className="text-[#00BCFF] hover:underline"
                    >
                      Mở Chuyên trang Tin tức →
                    </Link>
                  </div>
                  <table className="eiu-table">
                    <thead>
                      <tr>
                        <th>Tiêu đề bài viết</th>
                        <th className="w-40">Chuyên mục</th>
                        <th className="w-28 text-center">Lượt đọc</th>
                        <th className="w-24 text-right">Xem bài</th>
                      </tr>
                    </thead>
                    <tbody>
                      {NEWS_POSTS.map((post) => (
                        <tr key={post.id}>
                          <td className="text-xs font-bold text-[#133F68]">
                            {post.title}
                          </td>
                          <td className="text-xs text-slate-700">
                            {post.categoryLabel}
                          </td>
                          <td className="text-center font-mono text-xs text-slate-600">
                            {post.viewCount.toLocaleString('vi-VN')}
                          </td>
                          <td className="text-right">
                            <Link
                              href={`/tin-tuc/${post.slug}`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#0054A6] hover:text-[#C10230]"
                            >
                              <span>Mở</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ============================================================
                7. VĂN PHÒNG 206.B06, TÀI SẢN & CON DẤU MỘC (OFFICE — QĐ 24)
               ============================================================ */}
            {activeModule === 'office' && (
              <div className="space-y-6">
                {/* Lịch trực Phòng 206.B06 */}
                <div className="bg-white border border-slate-300 overflow-x-auto">
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 font-eiu-display">
                    <Building2 className="w-4 h-4 text-[#FCB900]" />
                    <span>
                      Lịch trực Hành chính Văn phòng 206.B06 (Đồng điều hành:
                      Chánh VP Nguyễn Mỹ Hạnh &amp; Tổng Thư ký Nguyễn Như Quỳnh)
                    </span>
                  </div>
                  <table className="eiu-table">
                    <thead>
                      <tr>
                        <th className="w-28">Ngày trực</th>
                        <th>Ca Sáng (08:00 – 11:30)</th>
                        <th>Ca Chiều (13:00 – 16:30)</th>
                        <th className="w-44">Trọng tâm nghiệp vụ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {OFFICE_SHIFTS.map((s) => (
                        <tr key={s.day}>
                          <td className="font-bold text-[#133F68] text-xs">
                            {s.day}
                          </td>
                          <td className="text-xs text-slate-700">
                            {s.morning}
                          </td>
                          <td className="text-xs text-slate-700">
                            {s.afternoon}
                          </td>
                          <td className="text-xs font-semibold text-emerald-700">
                            {s.roomStatus}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Sổ Mượn - Trả Tài sản & Thiết bị Dùng chung Phòng 206.B06 */}
                <div className="bg-white border border-slate-300 overflow-x-auto">
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 font-eiu-display">
                    <Package className="w-4 h-4 text-[#00BCFF]" />
                    <span>
                      Sổ Quản lý Tài sản &amp; Thiết bị Dùng chung Phòng 206.B06
                    </span>
                  </div>
                  <table className="eiu-table">
                    <thead>
                      <tr>
                        <th className="w-32">Mã tài sản</th>
                        <th>Tên thiết bị &amp; Đơn vị đang mượn</th>
                        <th className="w-28 text-center">Tồn kho</th>
                        <th className="w-36 text-right">Cập nhật</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assetsState.map((ast) => (
                        <tr key={ast.id}>
                          <td className="font-mono text-xs font-bold text-[#133F68]">
                            {ast.assetCode}
                          </td>
                          <td className="space-y-0.5 text-xs">
                            <div className="font-bold text-[#133F68]">
                              {ast.name}
                            </div>
                            {ast.status === 'borrowed' ? (
                              <div className="text-[#C10230]">
                                Đang mượn: <strong>{ast.borrowerUnit}</strong> (
                                {ast.borrowerName} • Hạn trả: {ast.dueDate})
                              </div>
                            ) : (
                              <div className="text-emerald-700 font-medium">
                                ✓ Sẵn sàng tại kho Phòng 206.B06
                              </div>
                            )}
                          </td>
                          <td className="text-center font-mono text-xs font-bold">
                            {ast.availableQty} / {ast.totalQty}
                          </td>
                          <td className="text-right">
                            <button
                              type="button"
                              disabled={activePosition.roleLevel < 3}
                              onClick={() =>
                                handleToggleAssetReturn(ast.id, ast.name)
                              }
                              className={`px-3 py-1.5 rounded text-xs font-bold cursor-pointer disabled:bg-slate-300 text-white ${
                                ast.status === 'borrowed'
                                  ? 'bg-[#51803A] hover:bg-emerald-800'
                                  : 'bg-[#0054A6] hover:bg-[#133F68]'
                              }`}
                            >
                              {ast.status === 'borrowed'
                                ? 'Xác nhận trả'
                                : 'Đăng ký mượn'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Nhật ký đóng dấu Mộc pháp lý */}
                <div className="bg-white border border-slate-200">
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider font-eiu-display">
                    Nhật ký Đóng dấu Pháp lý (Mộc Hội Sinh viên Trường)
                  </div>
                  <div className="divide-y divide-slate-200 text-xs">
                    {SEAL_LOGS.map((log) => (
                      <div key={log.id} className="p-4 space-y-1">
                        <div className="flex flex-wrap justify-between gap-2 font-bold text-[#133F68]">
                          <span>
                            {log.docNumber} — {log.docTitle}
                          </span>
                          <span className="font-mono text-slate-500">
                            {log.date}
                          </span>
                        </div>
                        <div className="text-slate-600">
                          Thẩm quyền ký: <strong>{log.approvedBy}</strong> • Văn
                          thư đóng dấu: <strong>{log.stampedBy}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                8. HỌP KHÔNG GIẤY & BAN KIỂM TRA (MEETINGS — QĐ 23)
               ============================================================ */}
            {activeModule === 'meetings' && (
              <div className="space-y-6">
                {/* Phòng họp không giấy & Biểu quyết điện tử */}
                <div className="bg-white border-2 border-[#133F68]">
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between font-eiu-display">
                    <span className="inline-flex items-center gap-2">
                      <Vote className="w-4 h-4 text-[#FCB900]" />
                      <span>
                        Phiên Họp Không Giấy &amp; Biểu quyết Nghị quyết Điện tử
                        (23/QĐ-HSV)
                      </span>
                    </span>
                    <span className="font-mono text-[#00BCFF]">
                      PHÒNG 206.B06
                    </span>
                  </div>

                  <div className="p-5 space-y-4 text-xs">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-[#133F68] font-eiu-display">
                        Dự thảo Nghị quyết Hội nghị Ban Chấp hành Mở rộng Quý
                        IV/2026 (15 đ/c BCH &amp; 05 đ/c BKT)
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        Nội dung biểu quyết: Thông qua chỉ tiêu hỗ trợ 04 Chi
                        hội Tân sinh viên Khóa K26 đạt chuẩn Tập thể SV5T và áp
                        dụng 100% tiêu chí Sự kiện Xanh UN SDGs cho Chiến dịch
                        Xuân Tình nguyện 2027.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        disabled={activePosition.roleLevel < 5}
                        onClick={() => {
                          setMyVote('APPROVE');
                          triggerToast(
                            'Đã ghi nhận phiếu biểu quyết: TÁN THÀNH Nghị quyết.'
                          );
                        }}
                        className={`p-3 border text-left cursor-pointer disabled:cursor-not-allowed ${
                          myVote === 'APPROVE'
                            ? 'border-2 border-[#51803A] bg-emerald-50'
                            : 'border-slate-200 bg-[#F8FAFC] hover:border-[#133F68]'
                        }`}
                      >
                        <div className="font-bold text-emerald-800 uppercase font-eiu-display">
                          Tán thành
                        </div>
                        <div className="text-xl font-extrabold font-mono text-[#133F68] mt-1">
                          {14 + (myVote === 'APPROVE' ? 1 : 0)} / 15 phiếu
                        </div>
                      </button>

                      <button
                        type="button"
                        disabled={activePosition.roleLevel < 5}
                        onClick={() => {
                          setMyVote('REJECT');
                          triggerToast(
                            'Đã ghi nhận phiếu biểu quyết: KHÔNG TÁN THÀNH.'
                          );
                        }}
                        className={`p-3 border text-left cursor-pointer disabled:cursor-not-allowed ${
                          myVote === 'REJECT'
                            ? 'border-2 border-[#C10230] bg-rose-50'
                            : 'border-slate-200 bg-[#F8FAFC] hover:border-[#133F68]'
                        }`}
                      >
                        <div className="font-bold text-[#C10230] uppercase font-eiu-display">
                          Không tán thành
                        </div>
                        <div className="text-xl font-extrabold font-mono text-[#133F68] mt-1">
                          {myVote === 'REJECT' ? 1 : 0} / 15 phiếu
                        </div>
                      </button>

                      <button
                        type="button"
                        disabled={activePosition.roleLevel < 5}
                        onClick={() => {
                          setMyVote('ABSTAIN');
                          triggerToast(
                            'Đã ghi nhận phiếu biểu quyết: Ý KIẾN KHÁC.'
                          );
                        }}
                        className={`p-3 border text-left cursor-pointer disabled:cursor-not-allowed ${
                          myVote === 'ABSTAIN'
                            ? 'border-2 border-[#A68556] bg-[#FFF9F0]'
                            : 'border-slate-200 bg-[#F8FAFC] hover:border-[#133F68]'
                        }`}
                      >
                        <div className="font-bold text-[#A68556] uppercase font-eiu-display">
                          Ý kiến khác
                        </div>
                        <div className="text-xl font-extrabold font-mono text-[#133F68] mt-1">
                          {myVote === 'ABSTAIN' ? 1 : 0} / 15 phiếu
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Giám sát Ban Kiểm tra (05 đồng chí) */}
                <div className="bg-white border border-slate-200">
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 font-eiu-display">
                    <ShieldCheck className="w-4 h-4 text-[#00BCFF]" />
                    <span>
                      Ban Kiểm tra HSV Trường (
                      {
                        STAFF_MEMBERS.filter((s) => s.bktRole !== 'Không')
                          .length
                      }{' '}
                      đ/c) — Trưởng ban: Đ/c Trần Thị Thu Huyền
                    </span>
                  </div>
                  <div className="divide-y divide-slate-200 text-xs">
                    <div className="p-4 space-y-1">
                      <div className="font-bold text-[#133F68]">
                        Hồ sơ #BKT-2601 — Kiến nghị mở thêm đợt Kiểm tra Thể lực
                        Sinh viên Khỏe cho sinh viên thực tập lâm sàng Khoa KHSK
                      </div>
                      <div className="text-emerald-700 font-semibold">
                        ✓ Đã chuyển Ban TG-PT (Mảng Phong trào) bố trí lịch kiểm
                        tra bổ sung vào Chủ nhật.
                      </div>
                    </div>
                    <div className="p-4 space-y-1">
                      <div className="font-bold text-[#133F68]">
                        Hồ sơ #BKT-2602 — Rà soát định kỳ quy trình xuất Phụ lục
                        1 sắp xếp tăng dần MSSV tại các Câu lạc bộ
                      </div>
                      <div className="text-emerald-700 font-semibold">
                        ✓ 100% Quyết định ban hành trên E-Office tuân thủ đúng
                        SLA 07 ngày làm việc (Quyết định 28/QĐ-HSV).
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkspaceSearchAndHashBridge() {
  const searchParams = useSearchParams();
  const hashVal = useSyncExternalStore(
    subscribeToHash,
    getHashSnapshot,
    getServerHashSnapshot
  );
  const queryMod = searchParams.get('module');

  const resolvedModule: WorkspaceModuleId = isValidWorkspaceModule(hashVal)
    ? hashVal
    : isValidWorkspaceModule(queryMod)
    ? queryMod
    : 'overview';

  return (
    <WorkspaceContent key={resolvedModule} initialModule={resolvedModule} />
  );
}

export default function WorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1200px] mx-auto px-4 py-16 text-center text-sm text-slate-500">
          Đang tải Hệ thống Quản trị Nội bộ E-Office...
        </div>
      }
    >
      <WorkspaceSearchAndHashBridge />
    </Suspense>
  );
}
