'use client';

import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRole } from '@/context/role-context';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
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
import {
  appendDynamicIssuedCerts,
  clearWorkspaceStoredState,
  getWorkspaceStoredState,
  ISSUED_CERTS_KEY,
  PORTAL_STATE_KEY,
  PortalPersonaState,
  saveWorkspaceStoredState,
  subscribeStorageSync,
  VoiceTicketRecord,
  WORKSPACE_STATE_KEY,
  WorkspaceStoredState,
} from '@/lib/portal-storage';
import {
  WORKSPACE_MODULE_GROUPS,
  WORKSPACE_MODULES,
  WorkspaceModuleId,
} from '@/lib/workspace-config';
import {
  FacultyCode,
  IssuedCertificateRecord,
  PlanSubmissionItem,
  StaffMember,
} from '@/types';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileCheck2,
  GitBranch,
  Layers,
  Package,
  RotateCcw,
  Search,
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
    roomStatus: 'Rà thể thức và Đóng dấu Mộc',
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
    docTitle: 'Kế hoạch Ngày hội Sinh viên Khỏe và Kiểm tra Thể lực cấp Trường',
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
    badgeClass: 'bg-slate-100 text-slate-800 border border-slate-200',
    nextAction: 'Cụm trưởng duyệt →',
  },
  cluster_reviewed: {
    label: 'Bước 2/4: Cụm trưởng đã thẩm định',
    badgeClass: 'bg-[#0054A6]/10 text-[#0054A6] border border-[#0054A6]/30',
    nextAction: 'VP 206.B06 rà thể thức →',
  },
  office_format_checked: {
    label: 'Bước 3/4: VP 206.B06 đã duyệt thể thức',
    badgeClass: 'bg-[#FCB900]/15 text-[#8F5200] border border-[#FCB900]/40',
    nextAction: 'BTK ký ban hành →',
  },
  btk_approved: {
    label: 'Bước 4/4: BTK đã ký ban hành',
    badgeClass: 'bg-[#51803A]/10 text-[#2E521D] border border-[#51803A]/30',
  },
};

const DEFAULT_WORKSPACE_STATE: WorkspaceStoredState = {
  eventOverrides: {},
  candidateStages: {},
  planStages: {},
  assetOverrides: {},
  nextDecisionSeq: 35,
  votesByPersona: {},
};

const VOTE_OPTION_LABELS: Record<'APPROVE' | 'REJECT' | 'ABSTAIN', string> = {
  APPROVE: 'Tán thành Nghị quyết',
  REJECT: 'Không tán thành Nghị quyết',
  ABSTAIN: 'Ý kiến khác',
};

type WorkspaceConfirmState =
  | {
      type: 'issue_decision';
      eventId: string;
      title: string;
      baseVolunteerDays: number;
      isUnionWorkMultiplierEligible: boolean;
    }
  | {
      type: 'sv5t_stage3';
      candId: string;
      fullName: string;
    }
  | {
      type: 'plan_btk';
      plan: PlanSubmissionItem;
    }
  | {
      type: 'unlock_vote';
    }
  | {
      type: 'reset_workspace';
    }
  | null;

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

function getStorageSnapshot(key: string): string {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

function getServerEmptySnapshot(): string {
  return '';
}

function isValidWorkspaceModule(val: string | null): val is WorkspaceModuleId {
  return Boolean(val && WORKSPACE_MODULES.some((m) => m.id === val));
}

function selectDecisionRecipients(currentPersona: StaffMember): StaffMember[] {
  const pool = [
    currentPersona,
    ...STAFF_MEMBERS.filter((m) => m.id !== currentPersona.id),
  ];
  const uniqueByMssv: StaffMember[] = [];
  const seen = new Set<string>();

  for (const member of pool) {
    if (/^\d{10}$/.test(member.studentId) && !seen.has(member.studentId)) {
      seen.add(member.studentId);
      uniqueByMssv.push(member);
    }
    if (uniqueByMssv.length >= 4) break;
  }

  return uniqueByMssv
    .slice(0, 4)
    .sort((a, b) => a.studentId.localeCompare(b.studentId));
}

function escapeCsvCell(val: string | number): string {
  const str = String(val);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function WorkspaceContent({
  initialModule,
}: {
  initialModule: WorkspaceModuleId;
}) {
  const { currentPersona, activePosition, setPersonaById } = useRole();

  const [moduleSelection, setModuleSelection] = useState<{
    base: WorkspaceModuleId;
    value: WorkspaceModuleId;
  }>({ base: initialModule, value: initialModule });
  const activeModule =
    moduleSelection.base === initialModule
      ? moduleSelection.value
      : initialModule;

  const [actionToast, setActionToast] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentTopRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // State bộ lọc & tìm kiếm theo phân hệ
  const [showPhuLuc1Table, setShowPhuLuc1Table] = useState(false);
  const [certSearch, setCertSearch] = useState('');
  const [sv5tSearch, setSv5tSearch] = useState('');
  const [onlyTop10Sv5t, setOnlyTop10Sv5t] = useState(false);
  const [branchFacultyFilter, setBranchFacultyFilter] = useState<
    'ALL' | FacultyCode
  >('ALL');
  const [branchSearch, setBranchSearch] = useState('');
  const [docSearch, setDocSearch] = useState('');
  const [cmsSearch, setCmsSearch] = useState('');
  const [confirmState, setConfirmState] = useState<WorkspaceConfirmState>(null);

  // Đồng bộ dữ liệu bền vững qua useSyncExternalStore
  const workspaceRaw = useSyncExternalStore(
    subscribeStorageSync,
    () => getStorageSnapshot(WORKSPACE_STATE_KEY),
    getServerEmptySnapshot
  );
  const issuedCertsRaw = useSyncExternalStore(
    subscribeStorageSync,
    () => getStorageSnapshot(ISSUED_CERTS_KEY),
    getServerEmptySnapshot
  );
  const portalRaw = useSyncExternalStore(
    subscribeStorageSync,
    () => getStorageSnapshot(PORTAL_STATE_KEY),
    getServerEmptySnapshot
  );

  const storedWorkspace = useMemo<WorkspaceStoredState>(() => {
    if (!workspaceRaw) return DEFAULT_WORKSPACE_STATE;
    try {
      const saved = JSON.parse(workspaceRaw) as Partial<WorkspaceStoredState>;
      return {
        ...DEFAULT_WORKSPACE_STATE,
        ...saved,
        eventOverrides: saved.eventOverrides || {},
        candidateStages: saved.candidateStages || {},
        planStages: saved.planStages || {},
        assetOverrides: saved.assetOverrides || {},
        votesByPersona: saved.votesByPersona || {},
        nextDecisionSeq: saved.nextDecisionSeq || 35,
      };
    } catch {
      return DEFAULT_WORKSPACE_STATE;
    }
  }, [workspaceRaw]);

  const allIssuedCerts = useMemo<IssuedCertificateRecord[]>(() => {
    if (!issuedCertsRaw) return ISSUED_CERTIFICATES;
    try {
      const dynamicCerts = JSON.parse(
        issuedCertsRaw
      ) as IssuedCertificateRecord[];
      if (!Array.isArray(dynamicCerts) || dynamicCerts.length === 0) {
        return ISSUED_CERTIFICATES;
      }
      const seen = new Set(ISSUED_CERTIFICATES.map((c) => c.certCode));
      return [
        ...dynamicCerts.filter((c) => !seen.has(c.certCode)),
        ...ISSUED_CERTIFICATES,
      ];
    } catch {
      return ISSUED_CERTIFICATES;
    }
  }, [issuedCertsRaw]);

  const sortedPhuLuc1Certs = useMemo(
    () =>
      [...allIssuedCerts].sort((a, b) =>
        a.studentId.localeCompare(b.studentId)
      ),
    [allIssuedCerts]
  );

  const submittedVoiceTickets = useMemo(() => {
    if (!portalRaw) return [];
    try {
      const portalMap = JSON.parse(
        portalRaw
      ) as Record<string, PortalPersonaState>;
      const items: (VoiceTicketRecord & { personaKey: string })[] = [];
      for (const [personaKey, pState] of Object.entries(portalMap)) {
        if (pState && Array.isArray(pState.voiceTickets)) {
          for (const ticket of pState.voiceTickets) {
            items.push({ ...ticket, personaKey });
          }
        }
      }
      return items.reverse();
    } catch {
      return [];
    }
  }, [portalRaw]);

  const eventsState = useMemo(
    () =>
      EVENT_ITEMS.map((ev) => {
        const override = storedWorkspace.eventOverrides[ev.id];
        return override ? { ...ev, ...override } : ev;
      }),
    [storedWorkspace.eventOverrides]
  );

  const candidatesState = useMemo(
    () =>
      INITIAL_SV5T_CANDIDATES.map((cand) => {
        const stage = storedWorkspace.candidateStages[cand.id];
        return stage ? { ...cand, reviewStage: stage } : cand;
      }),
    [storedWorkspace.candidateStages]
  );

  const plansState = useMemo(
    () =>
      PLAN_SUBMISSIONS.map((plan) => {
        const stage = storedWorkspace.planStages[plan.id];
        return stage ? { ...plan, stage } : plan;
      }),
    [storedWorkspace.planStages]
  );

  const assetsState = useMemo(
    () =>
      OFFICE_206_ASSETS.map((ast) => {
        const override = storedWorkspace.assetOverrides[ast.id];
        return override ? { ...ast, ...override } : ast;
      }),
    [storedWorkspace.assetOverrides]
  );

  const nextDecisionSeq = storedWorkspace.nextDecisionSeq || 35;
  const myVote =
    storedWorkspace.votesByPersona[currentPersona.id]?.['res-q4-2026'] ?? null;

  const triggerToast = useCallback((msg: string) => {
    setActionToast(msg);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setActionToast(null);
      toastTimerRef.current = null;
    }, 4500);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // Phím tắt Cmd/Ctrl + K để trỏ nhanh vào ô tìm kiếm của phân hệ hiện tại
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        if (searchInputRef.current) {
          e.preventDefault();
          searchInputRef.current.focus();
          searchInputRef.current.select();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateWorkspaceState = useCallback(
    (updater: (prev: WorkspaceStoredState) => WorkspaceStoredState) => {
      const current = getWorkspaceStoredState()
        ? {
            ...DEFAULT_WORKSPACE_STATE,
            ...getWorkspaceStoredState(),
          }
        : DEFAULT_WORKSPACE_STATE;
      const next = updater(current);
      saveWorkspaceStoredState(next);
    },
    []
  );

  const selectModule = useCallback(
    (id: WorkspaceModuleId, scrollMobile = false) => {
      setModuleSelection({ base: initialModule, value: id });
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', '/workspace?module=' + id);
      }
      if (
        scrollMobile &&
        typeof window !== 'undefined' &&
        window.innerWidth < 1024
      ) {
        contentTopRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    },
    [initialModule]
  );

  const handleApprove3DaysPrior = (eventId: string, title: string) => {
    if (activePosition.roleLevel < 4) return;
    updateWorkspaceState((prev) => ({
      ...prev,
      eventOverrides: {
        ...prev.eventOverrides,
        [eventId]: {
          ...prev.eventOverrides[eventId],
          preApprovalStatus: 'approved_3days_prior',
          certWorkflowStatus:
            eventsState.find((e) => e.id === eventId)?.certWorkflowStatus ??
            'upcoming',
        },
      },
    }));
    triggerToast(
      `Đã thẩm định và duyệt chủ trương Ngày tình nguyện trước 03 ngày: "${title}".`
    );
  };

  const executeIssueDecisionAndCerts = (target: {
    eventId: string;
    title: string;
    baseVolunteerDays: number;
    isUnionWorkMultiplierEligible: boolean;
  }) => {
    const seq = nextDecisionSeq;
    const decisionNumber = `${seq}/QĐ-HSV`;
    const now = new Date();
    const decisionDate = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()}`;

    const recipients = selectDecisionRecipients(currentPersona);
    const newCerts: IssuedCertificateRecord[] = recipients.map((member, idx) => {
      const multiplier: 1 | 2 | 3 = target.isUnionWorkMultiplierEligible
        ? idx === 0
          ? 3
          : idx === 1
          ? 2
          : 1
        : 1;
      const roleTitle = target.isUnionWorkMultiplierEligible
        ? idx === 0
          ? 'Trưởng Ban Tổ chức'
          : idx === 1
          ? 'Thành viên Ban Tổ chức'
          : 'Hội viên / Cộng tác viên tham gia'
        : 'Sinh viên / Hội viên tham gia';

      return {
        id: `dyn-cert-${seq}-${idx + 1}`,
        certSerialNumber: idx + 1,
        certCode: `${seq}-${String(idx + 1).padStart(2, '0')}/GCN-HSV`,
        decisionNumber,
        decisionDate,
        headerMode: 'HOI_SINH_VIEN',
        studentId: member.studentId,
        fullName: member.fullName,
        email: member.email,
        unitName: member.positions[0]?.unitName || 'Hội Sinh viên EIU',
        eventId: target.eventId,
        eventTitle: target.title,
        roleTitle,
        multiplierApplied: multiplier,
        volunteerDays: Number(
          (target.baseVolunteerDays * multiplier).toFixed(1)
        ),
        evidenceNote: `Phê duyệt trực tuyến theo Quy trình 07 ngày QĐ 28/QĐ-HSV trên E-Office (${decisionNumber})`,
        signerName: currentPersona.fullName,
        signerTitle: activePosition.positionTitle,
      };
    });

    appendDynamicIssuedCerts(newCerts);
    updateWorkspaceState((prev) => ({
      ...prev,
      nextDecisionSeq: seq + 1,
      eventOverrides: {
        ...prev.eventOverrides,
        [target.eventId]: {
          ...prev.eventOverrides[target.eventId],
          preApprovalStatus:
            eventsState.find((e) => e.id === target.eventId)
              ?.preApprovalStatus ?? 'approved_3days_prior',
          certWorkflowStatus: 'decision_issued',
          decisionNumber,
          slaDaysRemaining: 0,
        },
      },
    }));

    triggerToast(
      `Đã ký Quyết định ${decisionNumber} và cấp ${newCerts.length} mã E-Certificate cho "${target.title}".`
    );
  };

  const executeAdvanceSv5tStage = (
    candId: string,
    fullName: string,
    nextStage: 2 | 3
  ) => {
    updateWorkspaceState((prev) => ({
      ...prev,
      candidateStages: {
        ...prev.candidateStages,
        [candId]: nextStage,
      },
    }));
    triggerToast(
      `Đã phê duyệt hồ sơ Sinh viên 5 Tốt của ${fullName} lên Cấp ${nextStage}/3.`
    );
  };

  const handleRequestSv5tAdvance = (cand: Sv5tCandidateRecord) => {
    if (cand.reviewStage >= 3) return;
    if (cand.reviewStage === 1) {
      if (activePosition.roleLevel < 4) return;
      executeAdvanceSv5tStage(cand.id, cand.fullName, 2);
      return;
    }
    if (activePosition.roleLevel < 6) return;
    setConfirmState({
      type: 'sv5t_stage3',
      candId: cand.id,
      fullName: cand.fullName,
    });
  };

  const executeAdvancePlanStage = (
    plan: PlanSubmissionItem,
    nextStage: PlanSubmissionItem['stage']
  ) => {
    updateWorkspaceState((prev) => ({
      ...prev,
      planStages: {
        ...prev.planStages,
        [plan.id]: nextStage,
      },
    }));
    triggerToast(
      `Đã chuyển kế hoạch ${plan.planCode} sang: ${PLAN_STAGE_LABELS[nextStage].label}.`
    );
  };

  const handleRequestPlanAdvance = (plan: PlanSubmissionItem) => {
    if (plan.stage === 'btk_approved') return;
    if (plan.stage === 'office_format_checked') {
      if (activePosition.roleLevel < 6) return;
      setConfirmState({ type: 'plan_btk', plan });
      return;
    }
    if (activePosition.roleLevel < 4) return;
    const nextStage: PlanSubmissionItem['stage'] =
      plan.stage === 'unit_submitted'
        ? 'cluster_reviewed'
        : 'office_format_checked';
    executeAdvancePlanStage(plan, nextStage);
  };

  const handleToggleAssetReturn = (assetId: string, name: string) => {
    if (activePosition.roleLevel < 3) return;
    const ast = assetsState.find((a) => a.id === assetId);
    if (!ast) return;
    updateWorkspaceState((prev) => ({
      ...prev,
      assetOverrides: {
        ...prev.assetOverrides,
        [assetId]:
          ast.status === 'borrowed'
            ? {
                status: 'available',
                availableQty: ast.totalQty,
                borrowerUnit: undefined,
                borrowerName: undefined,
                dueDate: undefined,
              }
            : {
                status: 'borrowed',
                availableQty: Math.max(0, ast.totalQty - 1),
                borrowerUnit: activePosition.unitName,
                borrowerName: currentPersona.fullName,
                dueDate: '20/11/2026',
              },
      },
    }));
    triggerToast(`Đã cập nhật sổ tài sản Phòng 206.B06: "${name}".`);
  };

  const handleCastVote = (choice: 'APPROVE' | 'REJECT' | 'ABSTAIN') => {
    if (activePosition.roleLevel < 5 || myVote !== null) return;
    updateWorkspaceState((prev) => ({
      ...prev,
      votesByPersona: {
        ...prev.votesByPersona,
        [currentPersona.id]: {
          ...(prev.votesByPersona[currentPersona.id] || {}),
          'res-q4-2026': choice,
        },
      },
    }));
    triggerToast(
      `Đã ghi nhận phiếu biểu quyết của ${currentPersona.fullName}: ${VOTE_OPTION_LABELS[choice]}.`
    );
  };

  const handleExportPhuLuc1Csv = () => {
    const headers = [
      'STT',
      'MSSV',
      'Ho va ten',
      'Don vi',
      'Ma GCN',
      'So Quyet dinh',
      'Ngay ky',
      'Chuong trinh',
      'Vai tro',
      'He so',
      'Ngay tinh nguyen',
    ];
    const rows = sortedPhuLuc1Certs.map((cert, index) => [
      index + 1,
      cert.studentId,
      cert.fullName,
      cert.unitName,
      cert.certCode,
      cert.decisionNumber,
      cert.decisionDate,
      cert.eventTitle,
      cert.roleTitle,
      `x${cert.multiplierApplied}`,
      cert.volunteerDays.toFixed(1),
    ]);

    const csvContent =
      '\uFEFF' +
      [headers, ...rows]
        .map((row) => row.map(escapeCsvCell).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Phu-luc-1-HSV-EIU.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast(
      `Đã kết xuất Phụ lục 1 (${sortedPhuLuc1Certs.length} dòng, sắp xếp MSSV tăng dần).`
    );
  };

  // Thống kê và dữ liệu lọc
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

  const filteredCertEvents = useMemo(() => {
    const q = certSearch.trim().toLowerCase();
    if (!q) return eventsState;
    return eventsState.filter(
      (ev) =>
        ev.title.toLowerCase().includes(q) ||
        ev.organizerUnit.toLowerCase().includes(q) ||
        ev.sv5tCriterion.toLowerCase().includes(q) ||
        (ev.decisionNumber || '').toLowerCase().includes(q)
    );
  }, [eventsState, certSearch]);

  const displayedCandidates = useMemo(() => {
    const q = sv5tSearch.trim().toLowerCase();
    return candidatesState.filter((c) => {
      if (onlyTop10Sv5t && !c.isTop10Eligible) return false;
      if (!q) return true;
      return (
        c.fullName.toLowerCase().includes(q) ||
        c.studentId.includes(q) ||
        c.branchCode.toLowerCase().includes(q)
      );
    });
  }, [candidatesState, onlyTop10Sv5t, sv5tSearch]);

  const filteredBranches = useMemo(() => {
    const q = branchSearch.trim().toLowerCase();
    return BRANCH_UNITS.filter((b) => {
      if (branchFacultyFilter !== 'ALL' && b.facultyCode !== branchFacultyFilter)
        return false;
      if (!q) return true;
      return (
        b.code.toLowerCase().includes(q) ||
        b.name.toLowerCase().includes(q) ||
        b.clusterLeaderName.toLowerCase().includes(q)
      );
    });
  }, [branchFacultyFilter, branchSearch]);

  const filteredPlans = useMemo(() => {
    const q = docSearch.trim().toLowerCase();
    if (!q) return plansState;
    return plansState.filter(
      (p) =>
        p.planCode.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.submittingUnit.toLowerCase().includes(q) ||
        p.clusterName.toLowerCase().includes(q)
    );
  }, [plansState, docSearch]);

  const filteredDocs = useMemo(() => {
    const q = docSearch.trim().toLowerCase();
    if (!q) return OFFICIAL_DOCUMENTS;
    return OFFICIAL_DOCUMENTS.filter(
      (doc) =>
        doc.documentNumber.toLowerCase().includes(q) ||
        doc.title.toLowerCase().includes(q)
    );
  }, [docSearch]);

  const filteredNewsPosts = useMemo(() => {
    const q = cmsSearch.trim().toLowerCase();
    if (!q) return NEWS_POSTS;
    return NEWS_POSTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q)
    );
  }, [cmsSearch]);

  const currentModuleMeta =
    WORKSPACE_MODULES.find((m) => m.id === activeModule) ||
    WORKSPACE_MODULES[0];

  const greetingName =
    activePosition.roleLevel >= 2
      ? `Đ/c ${currentPersona.fullName}`
      : `Hội viên ${currentPersona.fullName}`;

  const confirmDialogConfig = (() => {
    if (!confirmState) return null;
    if (confirmState.type === 'issue_decision') {
      return {
        title: `Ký Quyết định ${nextDecisionSeq}/QĐ-HSV và Cấp E-Certificate`,
        description: `Hệ thống sẽ ghi nhận Quyết định ${nextDecisionSeq}/QĐ-HSV cho chương trình "${confirmState.title}", đồng thời tự động tạo 04 mã E-Certificate sắp xếp MSSV tăng dần để tra cứu công khai trên Cổng xác thực.`,
        details: [
          `Người ký: ${currentPersona.fullName} — ${activePosition.positionTitle}`,
          `Số Quyết định mới: ${nextDecisionSeq}/QĐ-HSV`,
          `Ngày tình nguyện gốc: +${confirmState.baseVolunteerDays.toFixed(1)} ngày`,
        ],
        confirmLabel: `Ký ${nextDecisionSeq}/QĐ-HSV`,
        variant: 'primary' as const,
      };
    }
    if (confirmState.type === 'sv5t_stage3') {
      return {
        title: 'Phê duyệt Thường trực Cấp 3/3 — Sinh viên 5 Tốt',
        description: `Xác nhận chốt duyệt hồ sơ Sinh viên 5 Tốt cấp Trường cho hội viên ${confirmState.fullName}? Sau bước này hồ sơ chuyển sang trạng thái Đủ điều kiện ra Quyết định.`,
        details: [
          `Thẩm quyền chốt duyệt: ${currentPersona.fullName} (Cấp ${activePosition.roleLevel}/6)`,
        ],
        confirmLabel: 'Chốt duyệt Cấp 3/3',
        variant: 'primary' as const,
      };
    }
    if (confirmState.type === 'plan_btk') {
      return {
        title: `Ban Thư ký ký ban hành Kế hoạch ${confirmState.plan.planCode}`,
        description: `Xác nhận ký ban hành chính thức kế hoạch "${confirmState.plan.title}" của ${confirmState.plan.submittingUnit}?`,
        details: [
          `Cụm quản lý: ${confirmState.plan.clusterName}`,
          `Ngày tổ chức dự kiến: ${confirmState.plan.eventDate}`,
        ],
        confirmLabel: 'Ký ban hành kế hoạch',
        variant: 'primary' as const,
      };
    }
    if (confirmState.type === 'unlock_vote') {
      return {
        title: 'Mở khóa để đổi phiếu biểu quyết',
        description:
          'Phiếu biểu quyết điện tử hiện tại sẽ được gỡ để đ/c chọn lại phương án biểu quyết mới trong Hội nghị.',
        confirmLabel: 'Mở khóa đổi phiếu',
        variant: 'primary' as const,
      };
    }
    return {
      title: 'Đặt lại dữ liệu điều hành',
      description:
        'Toàn bộ quyết định vừa ký, tiến độ duyệt SV5T, kế hoạch, mượn – trả thiết bị và phiếu biểu quyết lưu cục bộ sẽ được đưa về trạng thái mặc định ban đầu.',
      confirmLabel: 'Đặt lại dữ liệu',
      variant: 'danger' as const,
    };
  })();

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      {/* Toast thông báo điều hành */}
      {actionToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-md bg-[#133F68] text-white border-t-2 border-[#FCB900] border-x border-b border-white/15 p-4 shadow-2xl text-xs"
        >
          <div className="font-bold uppercase tracking-wider text-[#00BCFF] mb-1 font-eiu-display">
            E-Office HSV EIU • Phòng 206.B06
          </div>
          <div>{actionToast}</div>
        </div>
      )}

      {/* E-OFFICE COMMAND HEADER (MAX-W-1200PX) */}
      <section className="bg-[#02294E] eiu-arch-pattern text-white border-b-3 border-[#A68556]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#C10230] text-white text-[11px] font-bold uppercase tracking-wider font-eiu-display">
                  HỆ THỐNG QUẢN TRỊ NỘI BỘ E-OFFICE KHÓA II
                </span>
                <span className="px-2 py-0.5 bg-[#00BCFF]/20 text-[#00BCFF] font-eiu-serif text-xs font-bold">
                  PHÂN QUYỀN: CẤP {activePosition.roleLevel}/6
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-eiu-display">
                {greetingName}
              </h1>
              <div className="text-xs text-[#DED1BE]">
                Đang tác nghiệp với vai trò:{' '}
                <strong className="text-white">
                  {activePosition.positionTitle}
                </strong>{' '}
                — {activePosition.unitName}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setConfirmState({ type: 'reset_workspace' })}
              className="inline-flex items-center justify-center gap-2 min-h-11 sm:min-h-10 px-4 py-2 bg-[#133F68] hover:bg-[#1B5387] border border-white/25 text-white text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer transition-colors font-eiu-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900]"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#FCB900]" aria-hidden="true" />
              <span>Đặt lại dữ liệu</span>
            </button>
          </div>

          {/* 04 Ô KPI Điều hành thời gian thực */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <button
              type="button"
              onClick={() => selectModule('certificates', true)}
              className="bg-[#133F68]/90 border border-white/15 hover:border-[#00BCFF] p-3.5 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900]"
            >
              <div className="text-[11px] font-eiu-serif uppercase text-[#DED1BE]">
                Hàng đợi Phê duyệt
              </div>
              <div className="text-xl font-extrabold font-eiu-serif text-[#FCB900] mt-0.5">
                {String(pendingCertEvents.length).padStart(2, '0')} Hồ sơ
              </div>
              <div className="text-[11px] text-white/85 mt-0.5">
                Duyệt trước 3N và Cấp E-Cert
              </div>
            </button>

            <button
              type="button"
              onClick={() => selectModule('documents', true)}
              className="bg-[#133F68]/90 border border-white/15 hover:border-[#00BCFF] p-3.5 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900]"
            >
              <div className="text-[11px] font-eiu-serif uppercase text-[#DED1BE]">
                Kế hoạch Trình duyệt
              </div>
              <div className="text-xl font-extrabold font-eiu-serif text-[#00BCFF] mt-0.5">
                {String(pendingPlans.length).padStart(2, '0')} /{' '}
                {String(plansState.length).padStart(2, '0')} KH
              </div>
              <div className="text-[11px] text-white/85 mt-0.5">
                Đang luân chuyển 4 bước
              </div>
            </button>

            <button
              type="button"
              onClick={() => selectModule('collective', true)}
              className="bg-[#133F68]/90 border border-white/15 hover:border-[#00BCFF] p-3.5 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900]"
            >
              <div className="text-[11px] font-eiu-serif uppercase text-[#DED1BE]">
                Tập thể SV5T Đạt chuẩn
              </div>
              <div className="text-xl font-extrabold font-eiu-serif text-emerald-300 mt-0.5">
                {qualifiedCollectiveBranches.length} / {BRANCH_UNITS.length} CH
              </div>
              <div className="text-[11px] text-white/85 mt-0.5">
                100% ĐK • ≥ 30% Đạt • 0 KL
              </div>
            </button>

            <button
              type="button"
              onClick={() => selectModule('office', true)}
              className="bg-[#133F68]/90 border border-white/15 hover:border-[#00BCFF] p-3.5 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900]"
            >
              <div className="text-[11px] font-eiu-serif uppercase text-[#DED1BE]">
                Văn phòng 206.B06 và Mộc
              </div>
              <div className="text-xl font-extrabold font-eiu-serif text-white mt-0.5">
                {String(borrowedAssets.length).padStart(2, '0')} Thiết bị
              </div>
              <div className="text-[11px] text-white/85 mt-0.5">
                Đang cho cơ sở Hội mượn
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* LƯỚI RỘNG 3/9 (MAX-W-1200PX) */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 lg:pt-8">
        {/* Thanh chuyển phân hệ ngang cho Mobile & Tablet (< 1024px) */}
        <nav
          aria-label="Điều hướng nhanh phân hệ E-Office"
          className="lg:hidden mb-5 -mx-4 px-4 overflow-x-auto pb-2"
        >
          <div className="flex items-center gap-2 w-max">
            {WORKSPACE_MODULES.map((item) => {
              const isSelected = activeModule === item.id;
              return (
                <button
                  key={`mob-${item.id}`}
                  type="button"
                  onClick={() => selectModule(item.id, true)}
                  aria-current={isSelected ? 'page' : undefined}
                  className={`min-h-[44px] px-3.5 py-2 text-xs font-bold whitespace-nowrap shrink-0 border transition-colors cursor-pointer font-eiu-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C10230] ${
                    isSelected
                      ? 'bg-[#C10230] text-white border-[#C10230]'
                      : 'bg-white text-[#133F68] border-slate-300 hover:bg-[#EAE3D2]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI (3/12): Menu 08 Phân hệ E-Office chia 03 nhóm nghiệp vụ */}
          <aside
            aria-label="Danh mục 08 Phân hệ E-Office"
            className="hidden lg:block lg:col-span-3 space-y-5"
          >
            <div className="bg-white border border-slate-200">
              <div className="bg-[#133F68] text-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider font-eiu-display">
                08 Phân hệ Điều hành Số
              </div>

              {WORKSPACE_MODULE_GROUPS.map((group) => (
                <div key={group.id} className="border-t border-slate-200 first:border-t-0">
                  <div className="px-4 py-2 bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-slate-600 font-eiu-display border-b border-slate-200">
                    {group.label}
                  </div>
                  <div className="divide-y divide-white">
                    {group.moduleIds.map((modId) => {
                      const item = WORKSPACE_MODULES.find((m) => m.id === modId);
                      if (!item) return null;
                      const isSelected = activeModule === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => selectModule(item.id)}
                          aria-current={isSelected ? 'page' : undefined}
                          className={`w-full text-left px-4 py-3 text-xs font-semibold flex items-center justify-between gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C10230] focus-visible:ring-inset ${
                            isSelected
                              ? 'bg-[#C10230] text-white font-bold'
                              : 'bg-[#EAE3D2] text-slate-900 hover:bg-[#dfd5be]'
                          }`}
                        >
                          <span>{item.label}</span>
                          {item.badge && (
                            <span
                              className={`text-[11px] font-eiu-serif px-1.5 py-0.5 font-bold shrink-0 ${
                                isSelected
                                  ? 'bg-white/20 text-white'
                                  : 'bg-white/90 text-[#133F68]'
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
              ))}
            </div>
          </aside>

          {/* CỘT PHẢI (9/12): Không gian làm việc rộng rãi cho Bảng dữ liệu và Quy trình */}
          <div ref={contentTopRef} className="lg:col-span-9 space-y-6 scroll-mt-4">
            <div className="bg-white border border-slate-200 border-t-2 border-t-[#133F68] p-5">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display">
                {currentModuleMeta.title}
              </h2>
              <p className="text-[13.5px] text-slate-600 mt-1 leading-relaxed max-w-prose">
                {currentModuleMeta.shortDesc}
              </p>
            </div>

            {activePosition.roleLevel === 1 && (
              <div
                role="alert"
                className="bg-[#FFF9F0] border border-[#C10230]/40 p-4 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div className="max-w-prose">
                  <strong className="text-[#133F68]">
                    Quyền xem (Cấp 1/6):
                  </strong>{' '}
                  Tài khoản hiện tại đang ở chế độ xem. Chuyển sang tài khoản
                  Ban Chấp hành để thực hiện phê duyệt.
                </div>
                <button
                  type="button"
                  onClick={() => setPersonaById('staff-01')}
                  className="min-h-11 sm:min-h-9 px-4 py-1.5 bg-[#0054A6] hover:bg-[#133F68] text-white text-xs font-bold shrink-0 cursor-pointer font-eiu-display"
                >
                  Chuyển tài khoản Ban Chấp hành
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
                      điều hành), Ban Tổ chức và Xây dựng Hội (05 Cụm), Ban
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
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex flex-wrap items-center justify-between gap-2 font-eiu-display">
                    <span>Hàng đợi Phê duyệt Ưu tiên</span>
                  </div>
                  <div className="divide-y divide-slate-200 text-xs">
                    {pendingCertEvents.length === 0 ? (
                      <div className="p-6 text-center text-emerald-700 font-semibold">
                        ✓ Toàn bộ hồ sơ ưu tiên trong hàng đợi đã được xử lý
                        hoàn tất.
                      </div>
                    ) : (
                      pendingCertEvents.map((ev) => (
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
                              <strong className="font-eiu-serif text-[#C10230]">
                                +{ev.baseVolunteerDays.toFixed(1)} ngày
                              </strong>
                            </div>
                          </div>
                          {ev.preApprovalStatus === 'pending_tcxdh' ? (
                            <button
                              type="button"
                              disabled={activePosition.roleLevel < 4}
                              title={
                                activePosition.roleLevel < 4
                                  ? 'Yêu cầu phân quyền từ Cấp 4/6 trở lên để duyệt trước 03 ngày'
                                  : 'Duyệt chủ trương trước 03 ngày'
                              }
                              onClick={() =>
                                handleApprove3DaysPrior(ev.id, ev.title)
                              }
                              className="min-h-11 sm:min-h-9 px-4 py-2 bg-[#0054A6] hover:bg-[#133F68] disabled:bg-slate-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer font-eiu-display"
                            >
                              Duyệt trước 03 ngày
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={activePosition.roleLevel < 6}
                              title={
                                activePosition.roleLevel < 6
                                  ? 'Yêu cầu phân quyền Cấp 6/6 (Thường trực / Chủ tịch HSV) để ký Quyết định'
                                  : `Ký Quyết định ${nextDecisionSeq}/QĐ-HSV`
                              }
                              onClick={() =>
                                setConfirmState({
                                  type: 'issue_decision',
                                  eventId: ev.id,
                                  title: ev.title,
                                  baseVolunteerDays: ev.baseVolunteerDays,
                                  isUnionWorkMultiplierEligible: Boolean(
                                    ev.isUnionWorkMultiplierEligible
                                  ),
                                })
                              }
                              className="min-h-11 sm:min-h-9 px-4 py-2 bg-[#C10230] hover:bg-[#a10228] disabled:bg-slate-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer font-eiu-display"
                            >
                              Ký QĐ và Cấp E-Cert (SLA{' '}
                              {String(ev.slaDaysRemaining).padStart(2, '0')}N)
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                2. DUYỆT NGÀY TÌNH NGUYỆN VÀ CẤP GCN (CERTIFICATES)
               ============================================================ */}
            {activeModule === 'certificates' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="relative flex-1 min-w-[220px]">
                    <label htmlFor="ws-cert-search" className="sr-only">
                      Tìm chương trình hoặc số quyết định
                    </label>
                    <Search
                      className="w-4 h-4 text-slate-400 pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <input
                      id="ws-cert-search"
                      name="certEventSearch"
                      ref={searchInputRef}
                      type="text"
                      value={certSearch}
                      onChange={(e) => setCertSearch(e.target.value)}
                      placeholder="Tìm chương trình, đơn vị, số quyết định..."
                      className="w-full min-h-11 sm:min-h-9 pl-9 pr-3 bg-[#F8FAFC] border border-slate-300 text-base sm:text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0054A6]"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleExportPhuLuc1Csv}
                      className="min-h-11 sm:min-h-9 px-3.5 py-1.5 bg-[#51803A] hover:bg-emerald-800 text-white font-bold uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5 font-eiu-display"
                    >
                      <Download className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Xuất danh sách (CSV)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPhuLuc1Table(!showPhuLuc1Table)}
                      className="min-h-11 sm:min-h-9 px-3.5 py-1.5 bg-[#133F68] hover:bg-[#0054A6] text-white font-bold uppercase tracking-wider cursor-pointer font-eiu-display"
                    >
                      {showPhuLuc1Table
                        ? 'Ẩn danh sách đã cấp'
                        : `Xem danh sách đã cấp (${sortedPhuLuc1Certs.length})`}
                    </button>
                  </div>
                </div>

                {showPhuLuc1Table && (
                  <div className="bg-white border-2 border-[#133F68] overflow-x-auto">
                    <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex flex-wrap items-center justify-between gap-2 font-eiu-display">
                      <span>
                        Danh sách Giấy chứng nhận đã cấp (
                        {sortedPhuLuc1Certs.length})
                      </span>
                      <Link
                        href={`/tra-cuu-gcn?q=${encodeURIComponent(
                          sortedPhuLuc1Certs[0]?.decisionNumber || '32/QĐ-HSV'
                        )}`}
                        className="text-[#00BCFF] hover:underline"
                      >
                        Mở trang Xác thực Công khai →
                      </Link>
                    </div>
                    <table className="eiu-table min-w-[760px]">
                      <thead>
                        <tr>
                          <th className="w-12 text-center">STT</th>
                          <th className="w-28">MSSV</th>
                          <th>Họ và tên • Đơn vị</th>
                          <th>Số QĐ • Vai trò</th>
                          <th className="w-28 text-right">Ngày TN</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedPhuLuc1Certs.map((cert, index) => (
                          <tr key={cert.id}>
                            <td className="text-center font-eiu-serif text-xs font-bold">
                              {String(index + 1).padStart(2, '0')}
                            </td>
                            <td className="font-eiu-serif text-xs font-bold text-[#133F68]">
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
                              <span className="font-eiu-serif font-bold text-[#0054A6]">
                                {cert.decisionNumber}
                              </span>{' '}
                              • {cert.roleTitle}
                            </td>
                            <td className="text-right font-eiu-serif text-xs font-bold text-[#C10230]">
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
                  <table className="eiu-table min-w-[760px]">
                    <thead>
                      <tr>
                        <th>Chương trình và Đơn vị tổ chức</th>
                        <th className="w-48">Cơ chế Quy đổi Ngày TN</th>
                        <th className="w-48">Tiến độ và SLA</th>
                        <th className="w-44 text-right">Thao tác duyệt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCertEvents.map((ev) => (
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
                            <div className="font-eiu-serif font-bold text-[#C10230]">
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
                              <span className="inline-flex items-center whitespace-nowrap gap-1 px-2 py-0.5 bg-[#51803A]/10 border border-[#51803A]/30 text-[#2E521D] text-[11px] font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#51803A] shrink-0" />
                                <span>Đã cấp {ev.decisionNumber}</span>
                              </span>
                            ) : ev.certWorkflowStatus ===
                              'list_submitted_sla' ? (
                              <span className="inline-flex items-center whitespace-nowrap gap-1 px-2 py-0.5 bg-[#FCB900]/15 border border-[#FCB900]/40 text-[#8F5200] text-[11px] font-bold">
                                <Clock className="w-3.5 h-3.5 text-[#8F5200] shrink-0" />
                                <span>
                                  SLA còn{' '}
                                  {String(ev.slaDaysRemaining).padStart(2, '0')}
                                  /07N
                                </span>
                              </span>
                            ) : ev.preApprovalStatus === 'pending_tcxdh' ? (
                              <span className="inline-flex items-center whitespace-nowrap px-2 py-0.5 bg-[#C10230]/10 border border-[#C10230]/30 text-[#9E0024] text-[11px] font-bold">
                                Chờ duyệt trước 03 ngày
                              </span>
                            ) : (
                              <span className="inline-flex items-center whitespace-nowrap px-2 py-0.5 bg-[#EAE3D2] border border-[#A68556]/30 text-[#133F68] text-[11px] font-semibold">
                                ✓ Đã duyệt chủ trương 3N
                              </span>
                            )}
                          </td>
                          <td className="text-right">
                            {ev.preApprovalStatus === 'pending_tcxdh' ? (
                              <button
                                type="button"
                                disabled={activePosition.roleLevel < 4}
                                title={
                                  activePosition.roleLevel < 4
                                    ? 'Yêu cầu phân quyền từ Cấp 4/6 trở lên để duyệt trước 03 ngày'
                                    : 'Duyệt chủ trương trước 03 ngày'
                                }
                                onClick={() =>
                                  handleApprove3DaysPrior(ev.id, ev.title)
                                }
                                className="min-h-11 sm:min-h-9 px-3 py-1.5 bg-[#0054A6] hover:bg-[#133F68] disabled:bg-slate-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold cursor-pointer whitespace-nowrap"
                              >
                                Duyệt trước 3N
                              </button>
                            ) : ev.certWorkflowStatus ===
                              'list_submitted_sla' ? (
                              <button
                                type="button"
                                disabled={activePosition.roleLevel < 6}
                                title={
                                  activePosition.roleLevel < 6
                                    ? 'Yêu cầu phân quyền Cấp 6/6 (Thường trực / Chủ tịch HSV) để ký QĐ 28'
                                    : `Ký ${nextDecisionSeq}/QĐ-HSV và cấp E-Certificate`
                                }
                                onClick={() =>
                                  setConfirmState({
                                    type: 'issue_decision',
                                    eventId: ev.id,
                                    title: ev.title,
                                    baseVolunteerDays: ev.baseVolunteerDays,
                                    isUnionWorkMultiplierEligible: Boolean(
                                      ev.isUnionWorkMultiplierEligible
                                    ),
                                  })
                                }
                                className="min-h-11 sm:min-h-9 px-3 py-1.5 bg-[#C10230] hover:bg-[#a10228] disabled:bg-slate-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold cursor-pointer whitespace-nowrap"
                              >
                                Ký QĐ và E-Cert
                              </button>
                            ) : ev.certWorkflowStatus === 'decision_issued' ? (
                              <Link
                                href={`/tra-cuu-gcn?q=${encodeURIComponent(
                                  ev.decisionNumber || '32/QĐ-HSV'
                                )}`}
                                className="inline-flex items-center gap-1 text-xs font-bold text-[#0054A6] hover:text-[#C10230] whitespace-nowrap"
                              >
                                <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Xem GCN</span>
                              </Link>
                            ) : (
                              <span className="text-[11px] text-slate-600">
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
                3. HỘI ĐỒNG XÉT CHỌN SV5T 3 CẤP VÀ TOP 10% (QĐ 09/2026)
               ============================================================ */}
            {activeModule === 'sv5t' && (
              <div className="space-y-5">
                <div className="bg-white border border-slate-200 p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setOnlyTop10Sv5t(false)}
                        className={`min-h-11 sm:min-h-9 px-4 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer font-eiu-display ${
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
                        className={`min-h-11 sm:min-h-9 px-4 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer font-eiu-display ${
                          onlyTop10Sv5t
                            ? 'bg-[#C10230] text-white border-[#C10230]'
                            : 'bg-[#F5F5F5] text-[#133F68] border-slate-300'
                        }`}
                      >
                        ★ Lọc Ứng viên Top 10% Tiêu biểu Toàn trường
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="ws-sv5t-search" className="sr-only">
                      Tìm ứng viên SV5T
                    </label>
                    <div className="relative">
                      <Search
                        className="w-4 h-4 text-slate-400 pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        id="ws-sv5t-search"
                        name="sv5tSearch"
                        ref={searchInputRef}
                        type="text"
                        value={sv5tSearch}
                        onChange={(e) => setSv5tSearch(e.target.value)}
                        placeholder="Tìm ứng viên, MSSV, Chi hội..."
                        className="w-full min-h-11 sm:min-h-9 pl-9 pr-3 bg-[#F8FAFC] border border-slate-300 text-base sm:text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0054A6]"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-300 overflow-x-auto">
                  <table className="eiu-table min-w-[760px]">
                    <thead>
                      <tr>
                        <th>Ứng viên • Chi hội</th>
                        <th>Chỉ số 05 Tiêu chuẩn</th>
                        <th className="w-52">Cấp xét duyệt hiện tại</th>
                        <th className="w-40 text-right">Phê duyệt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedCandidates.map((c) => {
                        const requiredLevel = c.reviewStage === 2 ? 6 : 4;
                        const isDisabled =
                          activePosition.roleLevel < requiredLevel;
                        return (
                          <tr key={c.id}>
                            <td className="space-y-0.5">
                              <div className="font-bold text-[#133F68]">
                                {c.fullName}
                              </div>
                              <div className="text-xs font-eiu-serif text-slate-500">
                                {c.studentId} • {c.branchCode}
                              </div>
                              {c.isTop10Eligible && (
                                <span className="inline-flex items-center whitespace-nowrap px-2 py-0.5 bg-[#C10230] text-white text-[11px] font-bold uppercase font-eiu-display">
                                  ★ Ứng viên Top 10% Tiêu biểu
                                </span>
                              )}
                            </td>
                            <td className="text-xs text-slate-700 space-y-1">
                              <div>
                                ĐRL: <strong>{c.ethicsScore}</strong> • GPA MAX:{' '}
                                <strong className="font-eiu-serif text-[#0054A6]">
                                  {c.gpaMax.toFixed(2)}/4.00
                                </strong>{' '}
                                • TN:{' '}
                                <strong className="font-eiu-serif text-[#C10230]">
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
                                <span className="inline-flex items-center whitespace-nowrap px-2 py-0.5 bg-[#51803A]/10 border border-[#51803A]/30 text-[#2E521D] text-[11px] font-bold">
                                  ✓ Cấp 3: Thường trực đã chốt
                                </span>
                              ) : c.reviewStage === 2 ? (
                                <span className="inline-flex items-center whitespace-nowrap px-2 py-0.5 bg-[#0054A6]/10 border border-[#0054A6]/30 text-[#0054A6] text-[11px] font-bold">
                                  Cấp 2: Ban TG-PT/TC-XDH duyệt
                                </span>
                              ) : (
                                <span className="inline-flex items-center whitespace-nowrap px-2 py-0.5 bg-[#EAE3D2] border border-[#A68556]/30 text-[#133F68] text-[11px] font-bold">
                                  Cấp 1: Cơ sở Hội sơ duyệt
                                </span>
                              )}
                            </td>
                            <td className="text-right">
                              {c.reviewStage < 3 ? (
                                <button
                                  type="button"
                                  disabled={isDisabled}
                                  title={
                                    isDisabled
                                      ? `Yêu cầu phân quyền từ Cấp ${requiredLevel}/6 trở lên để duyệt Cấp ${c.reviewStage + 1}`
                                      : `Phê duyệt hồ sơ lên Cấp ${c.reviewStage + 1}`
                                  }
                                  onClick={() => handleRequestSv5tAdvance(c)}
                                  className="min-h-11 sm:min-h-9 px-3 py-1.5 bg-[#0054A6] hover:bg-[#133F68] disabled:bg-slate-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold cursor-pointer whitespace-nowrap"
                                >
                                  Duyệt Cấp {c.reviewStage + 1} →
                                </button>
                              ) : (
                                <span className="text-xs font-bold text-emerald-700 whitespace-nowrap">
                                  Đủ điều kiện QĐ
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
                4. TẬP THỂ SV5T — 25 CHI HỘI THUỘC 04 CỤM KHOA
               ============================================================ */}
            {activeModule === 'collective' && (
              <div className="space-y-5">
                <div className="bg-white border border-slate-200 p-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
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
                        className={`min-h-11 sm:min-h-9 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer font-eiu-display ${
                          branchFacultyFilter === tab.code
                            ? 'bg-[#C10230] text-white border-[#C10230]'
                            : 'bg-[#F5F5F5] text-[#133F68] border-slate-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label htmlFor="ws-branch-search" className="sr-only">
                      Tìm Chi hội theo mã lớp hoặc tên Cụm trưởng
                    </label>
                    <div className="relative">
                      <Search
                        className="w-4 h-4 text-slate-400 pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        id="ws-branch-search"
                        name="branchSearch"
                        ref={searchInputRef}
                        type="text"
                        value={branchSearch}
                        onChange={(e) => setBranchSearch(e.target.value)}
                        placeholder="Tìm mã Chi hội hoặc Cụm trưởng..."
                        className="w-full min-h-11 sm:min-h-9 pl-9 pr-3 bg-[#F8FAFC] border border-slate-300 text-base sm:text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0054A6]"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-300 overflow-x-auto">
                  <table className="eiu-table min-w-[720px]">
                    <thead>
                      <tr>
                        <th className="w-28">Mã Chi hội</th>
                        <th>Cụm Khoa và Cụm trưởng</th>
                        <th className="w-24 text-center">ĐK SV5T</th>
                        <th className="w-52">Tỷ lệ Đạt SV5T</th>
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
                            <td className="font-eiu-serif font-bold text-[#133F68]">
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
                            <td className="text-center font-eiu-serif text-xs font-bold text-[#0054A6]">
                              {branch.sv5tRegisteredRate}%
                            </td>
                            <td>
                              <div className="space-y-1">
                                <div className="flex justify-between font-eiu-serif text-xs font-bold">
                                  <span
                                    className={
                                      isQualified
                                        ? 'text-emerald-700'
                                        : 'text-[#C10230]'
                                    }
                                  >
                                    {branch.sv5tAchievedRate}% / 30%
                                  </span>
                                  <span className="text-[11px] text-slate-500">
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
                            <td className="text-right text-xs font-bold whitespace-nowrap">
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
                5. VĂN THƯ LƯU TRỮ VÀ TRÌNH DUYỆT KẾ HOẠCH 04 BƯỚC (DOCUMENTS)
               ============================================================ */}
            {activeModule === 'documents' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 p-4">
                  <label htmlFor="ws-doc-search" className="sr-only">
                    Tìm kế hoạch trình duyệt hoặc văn bản pháp lý
                  </label>
                  <div className="relative">
                    <Search
                      className="w-4 h-4 text-slate-400 pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <input
                      id="ws-doc-search"
                      name="docSearch"
                      ref={searchInputRef}
                      type="text"
                      value={docSearch}
                      onChange={(e) => setDocSearch(e.target.value)}
                      placeholder="Tìm số kế hoạch, tên văn bản, đơn vị..."
                      className="w-full min-h-11 sm:min-h-9 pl-9 pr-3 bg-[#F8FAFC] border border-slate-300 text-base sm:text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0054A6]"
                    />
                  </div>
                </div>

                {/* Quy trình trình duyệt kế hoạch trực tuyến */}
                <div className="bg-white border border-slate-300 overflow-x-auto">
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between font-eiu-display">
                    <span className="inline-flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-[#FCB900]" />
                      <span>Trình duyệt Kế hoạch Trực tuyến</span>
                    </span>
                  </div>
                  <table className="eiu-table min-w-[760px]">
                    <thead>
                      <tr>
                        <th className="w-32">Số KH</th>
                        <th>Tên Kế hoạch và Đơn vị trình</th>
                        <th className="w-56">Bước xử lý hiện tại</th>
                        <th className="w-44 text-right">Luân chuyển</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPlans.map((plan) => {
                        const stageMeta = PLAN_STAGE_LABELS[plan.stage];
                        const requiredLevel =
                          plan.stage === 'office_format_checked' ? 6 : 4;
                        const isDisabled =
                          activePosition.roleLevel < requiredLevel;
                        return (
                          <tr key={plan.id}>
                            <td className="font-eiu-serif text-xs font-bold text-[#133F68]">
                              {plan.planCode}
                              <div className="text-[11px] font-normal text-slate-500">
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
                                className={`inline-flex items-center whitespace-nowrap px-2 py-1 text-[11px] font-bold ${stageMeta.badgeClass}`}
                              >
                                {stageMeta.label}
                              </span>
                            </td>
                            <td className="text-right">
                              {stageMeta.nextAction ? (
                                <button
                                  type="button"
                                  disabled={isDisabled}
                                  title={
                                    isDisabled
                                      ? `Yêu cầu phân quyền từ Cấp ${requiredLevel}/6 trở lên để chuyển bước này`
                                      : stageMeta.nextAction
                                  }
                                  onClick={() => handleRequestPlanAdvance(plan)}
                                  className="min-h-11 sm:min-h-9 px-3 py-1.5 bg-[#0054A6] hover:bg-[#133F68] disabled:bg-slate-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold cursor-pointer whitespace-nowrap"
                                >
                                  {stageMeta.nextAction}
                                </button>
                              ) : (
                                <span className="text-xs font-bold text-emerald-700 whitespace-nowrap">
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
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex flex-wrap items-center justify-between gap-2 font-eiu-display">
                    <span>
                      Sổ Đăng ký Văn bản Pháp lý Đã Ban hành (
                      {filteredDocs.length})
                    </span>
                    <Link
                      href="/van-ban"
                      className="text-[#00BCFF] hover:underline"
                    >
                      Mở Kho Văn bản Công khai →
                    </Link>
                  </div>
                  <div className="divide-y divide-slate-200 text-xs">
                    {filteredDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <span className="font-eiu-serif font-bold text-[#0054A6] mr-2">
                            {doc.documentNumber}
                          </span>
                          <span className="font-semibold text-[#133F68]">
                            {doc.title}
                          </span>
                        </div>
                        <span className="font-eiu-serif text-slate-500 shrink-0">
                          {doc.signedDate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                6. BAN TUYÊN GIÁO - PHONG TRÀO VÀ ĐỘI CTV XUNG KÍCH (TGPT)
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
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5 font-eiu-serif text-[11px]">
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
                      <span>Mảng Phong trào và Đội CTV Xung kích</span>
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
                          <strong>Hậu cần – Sân khấu</strong> và{' '}
                          <strong>Lễ tân – Khánh tiết – Văn thể mỹ</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tìm kiếm & Quản trị CMS Tin tức đã xuất bản */}
                <div className="bg-white border border-slate-200 p-4">
                  <label htmlFor="ws-cms-search" className="sr-only">
                    Tìm bài viết CMS trong mục Tuyên giáo
                  </label>
                  <div className="relative">
                    <Search
                      className="w-4 h-4 text-slate-400 pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <input
                      id="ws-cms-search"
                      name="cmsSearch"
                      ref={searchInputRef}
                      type="text"
                      value={cmsSearch}
                      onChange={(e) => setCmsSearch(e.target.value)}
                      placeholder="Tìm tiêu đề hoặc chuyên mục bài viết..."
                      className="w-full min-h-11 sm:min-h-9 pl-9 pr-3 bg-[#F8FAFC] border border-slate-300 text-base sm:text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0054A6]"
                    />
                  </div>
                </div>

                <div className="bg-white border border-slate-300 overflow-x-auto">
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex flex-wrap items-center justify-between gap-2 font-eiu-display">
                    <span>
                      Quản trị Bản tin CMS Cổng thông tin (
                      {filteredNewsPosts.length} bài đã xuất bản)
                    </span>
                    <Link
                      href="/tin-tuc"
                      className="text-[#00BCFF] hover:underline"
                    >
                      Mở Chuyên trang Tin tức →
                    </Link>
                  </div>
                  <table className="eiu-table min-w-[680px]">
                    <thead>
                      <tr>
                        <th>Tiêu đề bài viết</th>
                        <th className="w-44">Chuyên mục</th>
                        <th className="w-28 text-center">Lượt đọc</th>
                        <th className="w-24 text-right">Xem bài</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNewsPosts.map((post) => (
                        <tr key={post.id}>
                          <td className="text-xs font-bold text-[#133F68]">
                            {post.title}
                          </td>
                          <td className="text-xs text-slate-700">
                            {post.categoryLabel}
                          </td>
                          <td className="text-center font-eiu-serif text-xs text-slate-600">
                            {post.viewCount.toLocaleString('vi-VN')}
                          </td>
                          <td className="text-right whitespace-nowrap">
                            <Link
                              href={`/tin-tuc/${post.slug}`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#0054A6] hover:text-[#C10230]"
                            >
                              <span>Mở</span>
                              <ArrowRight
                                className="w-3.5 h-3.5"
                                aria-hidden="true"
                              />
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
                7. VĂN PHÒNG 206.B06, TÀI SẢN VÀ CON DẤU MỘC (OFFICE — QĐ 24)
               ============================================================ */}
            {activeModule === 'office' && (
              <div className="space-y-6">
                {/* Lịch trực Phòng 206.B06 */}
                <div className="bg-white border border-slate-300 overflow-x-auto">
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 font-eiu-display">
                    <Building2 className="w-4 h-4 text-[#FCB900] shrink-0" />
                    <span>Lịch trực Hành chính Văn phòng 206.B06</span>
                  </div>
                  <table className="eiu-table min-w-[720px]">
                    <thead>
                      <tr>
                        <th className="w-28">Ngày trực</th>
                        <th>Ca Sáng (08:00 – 11:30)</th>
                        <th>Ca Chiều (13:00 – 16:30)</th>
                        <th className="w-48">Trọng tâm nghiệp vụ</th>
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

                {/* Sổ Mượn - Trả Tài sản và Thiết bị Dùng chung Phòng 206.B06 */}
                <div className="bg-white border border-slate-300 overflow-x-auto">
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 font-eiu-display">
                    <Package className="w-4 h-4 text-[#00BCFF] shrink-0" />
                    <span>
                      Sổ Quản lý Tài sản và Thiết bị Dùng chung Phòng 206.B06
                    </span>
                  </div>
                  <table className="eiu-table min-w-[720px]">
                    <thead>
                      <tr>
                        <th className="w-32">Mã tài sản</th>
                        <th>Tên thiết bị và Đơn vị đang mượn</th>
                        <th className="w-28 text-center">Tồn kho</th>
                        <th className="w-36 text-right">Cập nhật</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assetsState.map((ast) => (
                        <tr key={ast.id}>
                          <td className="font-eiu-serif text-xs font-bold text-[#133F68]">
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
                          <td className="text-center font-eiu-serif text-xs font-bold">
                            {ast.availableQty} / {ast.totalQty}
                          </td>
                          <td className="text-right">
                            <button
                              type="button"
                              disabled={activePosition.roleLevel < 3}
                              title={
                                activePosition.roleLevel < 3
                                  ? 'Yêu cầu phân quyền từ Cấp 3/6 (BCH Cơ sở / Chủ nhiệm CLB trở lên) để mượn – trả thiết bị'
                                  : ast.status === 'borrowed'
                                  ? 'Xác nhận đã trả về kho 206.B06'
                                  : 'Đăng ký mượn thiết bị'
                              }
                              onClick={() =>
                                handleToggleAssetReturn(ast.id, ast.name)
                              }
                              className={`min-h-11 sm:min-h-9 px-3 py-1.5 text-xs font-bold cursor-pointer disabled:bg-slate-400 disabled:opacity-50 disabled:cursor-not-allowed text-white whitespace-nowrap ${
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
                          <span className="font-eiu-serif text-slate-500">
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
                8. HỌP KHÔNG GIẤY VÀ BAN KIỂM TRA (MEETINGS — QĐ 23)
               ============================================================ */}
            {activeModule === 'meetings' && (
              <div className="space-y-6">
                {/* Phòng họp không giấy & Biểu quyết điện tử */}
                <div className="bg-white border-2 border-[#133F68]">
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex flex-wrap items-center justify-between gap-2 font-eiu-display">
                    <span className="inline-flex items-center gap-2">
                      <Vote className="w-4 h-4 text-[#FCB900] shrink-0" />
                      <span>Biểu quyết Nghị quyết Hội nghị</span>
                    </span>
                    <span className="font-eiu-serif text-[#00BCFF]">
                      PHÒNG 206.B06
                    </span>
                  </div>

                  <div className="p-5 space-y-4 text-xs">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-[#133F68] font-eiu-display">
                        Dự thảo Nghị quyết Hội nghị Ban Chấp hành Mở rộng Quý
                        IV/2026 (15 đ/c BCH và 05 đ/c BKT)
                      </div>
                      <p className="text-slate-600 leading-relaxed max-w-prose">
                        Nội dung biểu quyết: Thông qua chỉ tiêu hỗ trợ 04 Chi
                        hội Tân sinh viên Khóa K26 đạt chuẩn Tập thể SV5T và áp
                        dụng 100% tiêu chí Sự kiện Xanh UN SDGs cho Chiến dịch
                        Xuân Tình nguyện 2027.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        disabled={
                          activePosition.roleLevel < 5 || myVote !== null
                        }
                        title={
                          activePosition.roleLevel < 5
                            ? 'Yêu cầu phân quyền từ Cấp 5/6 (Ủy viên BCH / BKT) để biểu quyết'
                            : myVote !== null
                            ? 'Phiếu đã được ghi nhận; bấm "Đổi phiếu biểu quyết" nếu muốn thay đổi'
                            : 'Bỏ phiếu Tán thành'
                        }
                        onClick={() => handleCastVote('APPROVE')}
                        className={`p-3 border text-left cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed ${
                          myVote === 'APPROVE'
                            ? 'border-2 border-[#51803A] bg-[#51803A]/10'
                            : 'border-slate-200 bg-[#F8FAFC] hover:border-[#133F68]'
                        }`}
                      >
                        <div className="font-bold text-[#2E521D] uppercase font-eiu-display">
                          Tán thành
                        </div>
                        <div className="text-xl font-extrabold font-eiu-serif text-[#133F68] mt-1">
                          {14 + (myVote === 'APPROVE' ? 1 : 0)} / 15 phiếu
                        </div>
                      </button>

                      <button
                        type="button"
                        disabled={
                          activePosition.roleLevel < 5 || myVote !== null
                        }
                        title={
                          activePosition.roleLevel < 5
                            ? 'Yêu cầu phân quyền từ Cấp 5/6 (Ủy viên BCH / BKT) để biểu quyết'
                            : myVote !== null
                            ? 'Phiếu đã được ghi nhận; bấm "Đổi phiếu biểu quyết" nếu muốn thay đổi'
                            : 'Bỏ phiếu Không tán thành'
                        }
                        onClick={() => handleCastVote('REJECT')}
                        className={`p-3 border text-left cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed ${
                          myVote === 'REJECT'
                            ? 'border-2 border-[#C10230] bg-rose-50'
                            : 'border-slate-200 bg-[#F8FAFC] hover:border-[#133F68]'
                        }`}
                      >
                        <div className="font-bold text-[#C10230] uppercase font-eiu-display">
                          Không tán thành
                        </div>
                        <div className="text-xl font-extrabold font-eiu-serif text-[#133F68] mt-1">
                          {myVote === 'REJECT' ? 1 : 0} / 15 phiếu
                        </div>
                      </button>

                      <button
                        type="button"
                        disabled={
                          activePosition.roleLevel < 5 || myVote !== null
                        }
                        title={
                          activePosition.roleLevel < 5
                            ? 'Yêu cầu phân quyền từ Cấp 5/6 (Ủy viên BCH / BKT) để biểu quyết'
                            : myVote !== null
                            ? 'Phiếu đã được ghi nhận; bấm "Đổi phiếu biểu quyết" nếu muốn thay đổi'
                            : 'Bỏ phiếu Ý kiến khác'
                        }
                        onClick={() => handleCastVote('ABSTAIN')}
                        className={`p-3 border text-left cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed ${
                          myVote === 'ABSTAIN'
                            ? 'border-2 border-[#A68556] bg-[#FFF9F0]'
                            : 'border-slate-200 bg-[#F8FAFC] hover:border-[#133F68]'
                        }`}
                      >
                        <div className="font-bold text-[#7A5928] uppercase font-eiu-display">
                          Ý kiến khác
                        </div>
                        <div className="text-xl font-extrabold font-eiu-serif text-[#133F68] mt-1">
                          {myVote === 'ABSTAIN' ? 1 : 0} / 15 phiếu
                        </div>
                      </button>
                    </div>

                    {myVote !== null && (
                      <div className="bg-[#F0F6FC] border border-[#0054A6]/30 p-3.5 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs text-[#133F68]">
                          ✓ Đã chốt phiếu biểu quyết của{' '}
                          <strong>{currentPersona.fullName}</strong>:{' '}
                          <strong className="text-[#0054A6]">
                            {VOTE_OPTION_LABELS[myVote]}
                          </strong>
                        </div>
                        <button
                          type="button"
                          disabled={activePosition.roleLevel < 5}
                          onClick={() =>
                            setConfirmState({ type: 'unlock_vote' })
                          }
                          className="min-h-11 sm:min-h-9 px-3.5 py-1.5 border border-[#133F68] bg-white hover:bg-[#133F68] hover:text-white text-[#133F68] text-xs font-bold uppercase cursor-pointer transition-colors font-eiu-display disabled:opacity-50"
                        >
                          Đổi phiếu biểu quyết
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Giám sát Ban Kiểm tra (05 đồng chí) */}
                <div className="bg-white border border-slate-200">
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 font-eiu-display">
                    <ShieldCheck className="w-4 h-4 text-[#00BCFF] shrink-0" />
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
                    {submittedVoiceTickets.map((ticket) => (
                      <div key={ticket.id} className="p-4 space-y-1 bg-[#FFF9F0]">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-bold text-[#133F68]">
                            Hồ sơ #{ticket.id} — {ticket.category} (
                            {ticket.isAnonymous
                              ? 'Ẩn danh từ Cổng Hội viên'
                              : `Gửi từ ${ticket.personaKey}`}
                            )
                          </span>
                          <span className="font-eiu-serif text-[11px] text-slate-600">
                            {ticket.createdAt}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                          {ticket.content}
                        </p>
                        <div className="text-[#0054A6] font-semibold">
                          • Trạng thái tiếp nhận: {ticket.status} (Đơn vị thụ
                          lý:{' '}
                          {ticket.recipient === 'BKT'
                            ? 'Ban Kiểm tra HSV'
                            : 'Ban Tuyên giáo – Phong trào'}
                          )
                        </div>
                      </div>
                    ))}
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

      {/* Modal Xác nhận thao tác điều hành E-Office (Cấp 6 / Đổi phiếu / Khôi phục) */}
      <ConfirmDialog
        open={Boolean(confirmState && confirmDialogConfig)}
        title={confirmDialogConfig?.title || ''}
        description={confirmDialogConfig?.description || ''}
        details={confirmDialogConfig?.details}
        confirmLabel={confirmDialogConfig?.confirmLabel}
        variant={confirmDialogConfig?.variant}
        onCancel={() => setConfirmState(null)}
        onConfirm={() => {
          if (!confirmState) return;
          if (confirmState.type === 'issue_decision') {
            executeIssueDecisionAndCerts(confirmState);
          } else if (confirmState.type === 'sv5t_stage3') {
            executeAdvanceSv5tStage(
              confirmState.candId,
              confirmState.fullName,
              3
            );
          } else if (confirmState.type === 'plan_btk') {
            executeAdvancePlanStage(confirmState.plan, 'btk_approved');
          } else if (confirmState.type === 'unlock_vote') {
            updateWorkspaceState((prev) => {
              const personaVotes = {
                ...(prev.votesByPersona[currentPersona.id] || {}),
              };
              delete personaVotes['res-q4-2026'];
              return {
                ...prev,
                votesByPersona: {
                  ...prev.votesByPersona,
                  [currentPersona.id]: personaVotes,
                },
              };
            });
            triggerToast(
              'Đã mở khóa phiếu biểu quyết — đ/c có thể chọn lại phương án biểu quyết.'
            );
          } else if (confirmState.type === 'reset_workspace') {
            clearWorkspaceStoredState();
            triggerToast(
              'Đã đặt lại toàn bộ dữ liệu E-Office và danh sách Giấy chứng nhận về mặc định.'
            );
          }
          setConfirmState(null);
        }}
      />
    </div>
  );
}

function WorkspaceSearchAndHashBridge() {
  const searchParams = useSearchParams();
  const hashVal = useSyncExternalStore(
    subscribeToHash,
    getHashSnapshot,
    getServerEmptySnapshot
  );
  const queryMod = searchParams.get('module');
  const queryTab = searchParams.get('tab');

  const resolvedModule: WorkspaceModuleId = isValidWorkspaceModule(hashVal)
    ? hashVal
    : isValidWorkspaceModule(queryMod)
    ? queryMod
    : isValidWorkspaceModule(queryTab)
    ? queryTab
    : 'overview';

  return <WorkspaceContent initialModule={resolvedModule} />;
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
