'use client';

import React, {
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRole } from '@/context/role-context';
import {
  AWARD_PROGRAMS,
  BRANCH_UNITS,
  CLUB_UNITS,
  decodeEiuEmail,
  decodeEiuStudentId,
  EVENT_ITEMS,
  FACULTY_METADATA,
  ISSUED_CERTIFICATES,
  ONLINE_CONTESTS,
} from '@/data/mock-data';
import {
  ContestCard,
  ContestExamModal,
  getContestCardMeta,
  useContestAttempts,
} from '@/components/shared/contest-system';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { DeterministicQrCode } from '@/components/shared/deterministic-qr';
import {
  AwardApplicationModal,
  CertificateViewerModal,
  MemberQrPassModal,
  SupportTicketModal,
  TranscriptModal,
} from '@/components/portal/portal-modals';
import {
  AwardApplicationSnapshot,
  ExternalEvidenceRecord,
  getDefaultPortalPersonaState,
  getPortalPersonaState,
  ISSUED_CERTS_KEY,
  PORTAL_STATE_KEY,
  PortalPersonaState,
  REGISTERED_EVENTS_KEY,
  savePortalPersonaState,
  setRegisteredEventIds,
  subscribeStorageSync,
  SubmittedAwardApplication,
  Sv5tCriterionKey,
  VoiceTicketRecord,
} from '@/lib/portal-storage';
import {
  AwardProgramCategory,
  AwardProgramItem,
  ClubUnit,
  IssuedCertificateRecord,
  OnlineContestItem,
} from '@/types';
import {
  ArrowRight,
  Award,
  Calculator,
  Calendar,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileCheck2,
  FileText,
  GraduationCap,
  HeartHandshake,
  HelpCircle,
  MapPin,
  Pencil,
  Plus,
  Printer,
  QrCode,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react';

type PortalTab =
  | 'overview'
  | 'sv5t'
  | 'applications'
  | 'activities'
  | 'certificates';

const PORTAL_TABS: { id: PortalTab; label: string }[] = [
  { id: 'overview', label: 'Thông tin chung' },
  { id: 'sv5t', label: 'Sổ tay Sinh viên 5 tốt' },
  { id: 'applications', label: 'Xét chọn hồ sơ' },
  { id: 'activities', label: 'Sự kiện và Cuộc thi' },
  { id: 'certificates', label: 'Kho Giấy chứng nhận' },
];

function parseLocaleDecimal(raw: string): number {
  const cleaned = raw.trim().replace(',', '.');
  if (!cleaned || cleaned === '.') return 0;
  const num = Number.parseFloat(cleaned);
  return Number.isFinite(num) ? Math.max(0, num) : 0;
}

function calculateWeightedQuarterGpa(
  quarters: { creditsStr: string; gpaStr: string }[]
): number {
  const totalCredits = quarters.reduce(
    (sum, q) => sum + Math.min(30, parseLocaleDecimal(q.creditsStr)),
    0
  );
  if (totalCredits <= 0) return 0;
  const weightedSum = quarters.reduce(
    (sum, q) =>
      sum +
      Math.min(30, parseLocaleDecimal(q.creditsStr)) *
        Math.min(4, parseLocaleDecimal(q.gpaStr)),
    0
  );
  return weightedSum / totalCredits;
}

function getStorageItemSnapshot(key: string): string {
  try {
    return window.localStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

function getEmptyServerSnapshot(): string {
  return '';
}

function getMonogramInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'SV';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function StudentPortalContent({
  initialTab,
  initialSubView,
}: {
  initialTab: PortalTab;
  initialSubView?: 'gpa' | 'quiz' | 'voice';
}) {
  const { currentPersona, activePosition } = useRole();
  const [tabSelection, setTabSelection] = useState<{
    base: PortalTab;
    current: PortalTab;
  }>({ base: initialTab, current: initialTab });
  const activeTab =
    tabSelection.base === initialTab ? tabSelection.current : initialTab;

  const contentTopRef = useRef<HTMLDivElement>(null);

  const setActiveTab = useCallback(
    (tab: PortalTab, scrollToContent = false) => {
      setTabSelection({ base: initialTab, current: tab });
      if (typeof window !== 'undefined' && window.history) {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
        window.history.replaceState({}, '', url.toString());
      }
      if (scrollToContent && contentTopRef.current) {
        contentTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [initialTab]
  );

  // Đồng bộ dữ liệu Portal tách riêng theo từng personaId
  const portalRaw = useSyncExternalStore(
    subscribeStorageSync,
    () => getStorageItemSnapshot(PORTAL_STATE_KEY),
    getEmptyServerSnapshot
  );

  const portalState = useMemo<PortalPersonaState>(() => {
    const defaults = getDefaultPortalPersonaState(currentPersona);
    if (!portalRaw) return defaults;
    try {
      const parsed = JSON.parse(portalRaw) as Record<string, PortalPersonaState>;
      const stored = parsed[currentPersona.id];
      if (stored && Array.isArray(stored.quarters) && stored.quarters.length === 4) {
        return {
          ...defaults,
          ...stored,
          voiceTickets: Array.isArray(stored.voiceTickets)
            ? stored.voiceTickets
            : defaults.voiceTickets,
          externalEvidences: Array.isArray(stored.externalEvidences)
            ? stored.externalEvidences
            : defaults.externalEvidences,
          awardApplications: Array.isArray(stored.awardApplications)
            ? stored.awardApplications
            : defaults.awardApplications,
        };
      }
      return defaults;
    } catch {
      return defaults;
    }
  }, [portalRaw, currentPersona]);

  const updatePortalState = useCallback(
    (updater: (prev: PortalPersonaState) => PortalPersonaState) => {
      const current = getPortalPersonaState(currentPersona);
      const next = updater(current);
      savePortalPersonaState(currentPersona.id, next);
    },
    [currentPersona]
  );

  // Đồng bộ sự kiện đã đăng ký từ /su-kien theo từng personaId
  const registeredRaw = useSyncExternalStore(
    subscribeStorageSync,
    () => getStorageItemSnapshot(REGISTERED_EVENTS_KEY),
    getEmptyServerSnapshot
  );
  const registeredEventIds = useMemo<string[]>(() => {
    if (!registeredRaw) return [];
    try {
      const parsed = JSON.parse(registeredRaw) as Record<string, string[]>;
      const list = parsed[currentPersona.id];
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }, [registeredRaw, currentPersona.id]);

  const registeredEvents = useMemo(
    () => EVENT_ITEMS.filter((ev) => registeredEventIds.includes(ev.id)),
    [registeredEventIds]
  );

  // Đồng bộ kho E-Certificate
  const dynamicCertsRaw = useSyncExternalStore(
    subscribeStorageSync,
    () => getStorageItemSnapshot(ISSUED_CERTS_KEY),
    getEmptyServerSnapshot
  );
  const allCertificates = useMemo<IssuedCertificateRecord[]>(() => {
    if (!dynamicCertsRaw) return ISSUED_CERTIFICATES;
    try {
      const parsed = JSON.parse(dynamicCertsRaw) as IssuedCertificateRecord[];
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return ISSUED_CERTIFICATES;
      }
      const seen = new Set(ISSUED_CERTIFICATES.map((c) => c.certCode));
      return [
        ...parsed.filter((c) => !seen.has(c.certCode)),
        ...ISSUED_CERTIFICATES,
      ];
    } catch {
      return ISSUED_CERTIFICATES;
    }
  }, [dynamicCertsRaw]);

  const personalCerts = useMemo(
    () => allCertificates.filter((c) => c.studentId === currentPersona.studentId),
    [allCertificates, currentPersona.studentId]
  );

  // Thông tin học vụ giải mã từ Email và MSSV
  const emailDecoded = decodeEiuEmail(currentPersona.email);
  const mssvDecoded = decodeEiuStudentId(currentPersona.studentId);
  const facultyMeta = FACULTY_METADATA[currentPersona.facultyCode];

  // Chi hội & CLB đang tham gia của Hội viên
  const primaryBranch = useMemo(() => {
    const code = currentPersona.grassrootsUnitCode || activePosition.unitCode;
    return (
      BRANCH_UNITS.find((b) => b.code === code) ||
      BRANCH_UNITS.find((b) => b.facultyCode === currentPersona.facultyCode) ||
      BRANCH_UNITS[0]
    );
  }, [currentPersona.grassrootsUnitCode, currentPersona.facultyCode, activePosition.unitCode]);

  const activeClubs = useMemo<ClubUnit[]>(() => {
    const matched = CLUB_UNITS.filter(
      (club) =>
        club.presidentName === currentPersona.fullName ||
        currentPersona.positions.some((p) => p.unitCode === club.code) ||
        (currentPersona.grassrootsUnitCode &&
          club.code === currentPersona.grassrootsUnitCode)
    );
    if (matched.length > 0) return matched;

    const facultyClubCodeMap: Record<string, string> = {
      CIT: 'CLB-IT',
      BBS: 'CLB-HONORS',
      SET: 'CLB-TECH',
      SNS: 'CLB-FIRSTAID',
    };
    const facultyClub = CLUB_UNITS.find(
      (c) => c.code === facultyClubCodeMap[currentPersona.facultyCode]
    );
    const sv5tClub = CLUB_UNITS.find((c) => c.code === 'CLB-SV5T');
    return [facultyClub, sv5tClub].filter((item): item is ClubUnit => Boolean(item));
  }, [currentPersona]);

  // Tính Ngày tình nguyện & GPA
  const certVolunteerDays = personalCerts.reduce((sum, c) => sum + c.volunteerDays, 0);
  const bloodDonationBonusDays = currentPersona.studentId !== '-' ? 5.0 : 0.0;
  const totalVolunteerDays = certVolunteerDays + bloodDonationBonusDays;
  const isVolunteerQualified = totalVolunteerDays >= 5.0;

  const weightedYearGpa = calculateWeightedQuarterGpa(portalState.quarters);
  const cumulativeGpa = Math.min(4, parseLocaleDecimal(portalState.cumulativeGpaStr));
  const effectiveGpa = Math.max(weightedYearGpa, cumulativeGpa);
  const isGpaQualified = effectiveGpa >= 3.0;

  const ethicsScore =
    currentPersona.id === 'student-demo'
      ? 88
      : currentPersona.id === 'staff-01'
      ? 95
      : 92;

  const metCriteriaCount = 3 + (isGpaQualified ? 1 : 0) + (isVolunteerQualified ? 1 : 0);

  // Cuộc thi trực tuyến
  const { attempts: contestAttempts, saveAttempt: saveContestAttempt } =
    useContestAttempts();
  const [activeModalContest, setActiveModalContest] =
    useState<OnlineContestItem | null>(null);
  const [activitySubFilter, setActivitySubFilter] = useState<'ALL' | 'EVENTS' | 'QUIZ'>(
    initialSubView === 'quiz' ? 'QUIZ' : 'ALL'
  );
  const [portalQuizFilter, setPortalQuizFilter] = useState<
    'ALL' | 'OPEN' | 'PASSED' | 'ENDED'
  >('ALL');

  const passedContests = ONLINE_CONTESTS.filter((c) => contestAttempts[c.id]?.passed);

  // Trạng thái Modals toàn cục trong Hồ sơ Hội viên
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [supportModalState, setSupportModalState] = useState<{
    open: boolean;
    prefillCategory?: string;
    prefillContent?: string;
  }>({ open: initialSubView === 'voice' });
  const [activeAwardProgram, setActiveAwardProgram] =
    useState<AwardProgramItem | null>(null);
  const [previewCert, setPreviewCert] = useState<IssuedCertificateRecord | null>(null);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [withdrawAppId, setWithdrawAppId] = useState<string | null>(null);

  // State Thông tin chung: Chỉnh sửa SĐT & Tóm tắt kỹ năng cá nhân
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactPhoneInput, setContactPhoneInput] = useState('');
  const [contactBioInput, setContactBioInput] = useState('');
  const [contactSavedNotice, setContactSavedNotice] = useState('');

  // State Sổ tay SV5T: Mở từng thẻ tiêu chuẩn + Thêm minh chứng ngoại khóa
  const [expandedPillarId, setExpandedPillarId] = useState<string | null>(
    initialSubView === 'gpa' ? 'study' : 'study'
  );
  const [showAddEvidenceForm, setShowAddEvidenceForm] = useState(false);
  const [evCriterion, setEvCriterion] = useState<Sv5tCriterionKey>('Hội nhập tốt');
  const [evCategoryLabel, setEvCategoryLabel] = useState('Chứng chỉ ngoại ngữ');
  const [evTitle, setEvTitle] = useState('');
  const [evIssuer, setEvIssuer] = useState('');
  const [evDate, setEvDate] = useState('');
  const [evCode, setEvCode] = useState('');
  const [evFormError, setEvFormError] = useState('');

  // State Xét chọn hồ sơ
  const [awardFilter, setAwardFilter] = useState<
    'ALL' | AwardProgramCategory | 'SUBMITTED'
  >('ALL');

  const displayPhone = portalState.phoneOverride || currentPersona.phone || 'Đang cập nhật';
  const displayBio =
    portalState.bioNote ||
    `Sinh viên ${facultyMeta.nameVi}, tích cực tham gia hoạt động Chi hội ${primaryBranch.code} và các chương trình rèn luyện kỹ năng chuyên môn.`;

  const liveSnapshot = useMemo<AwardApplicationSnapshot>(
    () => ({
      fullName: currentPersona.fullName,
      studentId:
        currentPersona.studentId !== '-' ? currentPersona.studentId : 'Chuyên viên Trường',
      email: currentPersona.email,
      phone: displayPhone,
      facultyName: facultyMeta.nameVi,
      majorName: currentPersona.majorName || mssvDecoded.majorName,
      cohortText: currentPersona.academicYearText,
      unitName: primaryBranch.name,
      effectiveGpa: effectiveGpa.toFixed(2),
      ethicsScore,
      volunteerDays: totalVolunteerDays.toFixed(1),
      metCriteriaCount,
    }),
    [
      currentPersona,
      displayPhone,
      facultyMeta.nameVi,
      mssvDecoded.majorName,
      primaryBranch.name,
      effectiveGpa,
      ethicsScore,
      totalVolunteerDays,
      metCriteriaCount,
    ]
  );

  // Bộ 05 Tiêu chuẩn Sinh viên 5 tốt kèm dữ liệu tổng hợp + gợi ý sự kiện/cuộc thi còn mở
  const sv5tStandards = useMemo(() => {
    const getEvidencesFor = (criterion: Sv5tCriterionKey) =>
      portalState.externalEvidences.filter((e) => e.criterion === criterion);

    const getSuggestionsFor = (criterion: Sv5tCriterionKey) => {
      const openEvents = EVENT_ITEMS.filter(
        (ev) =>
          ev.sv5tCriterion === criterion &&
          (ev.statusTag === 'Đang mở đăng ký' ||
            ev.statusTag === 'Còn 5 ngày' ||
            ev.statusTag === 'Còn 2 ngày') &&
          !registeredEventIds.includes(ev.id)
      ).slice(0, 2);

      const openQuizzes = ONLINE_CONTESTS.filter((c) => {
        const meta = getContestCardMeta(c);
        return (
          c.sv5tCriterion === criterion &&
          meta.isOpen &&
          !contestAttempts[c.id]?.passed
        );
      }).slice(0, 1);

      return { openEvents, openQuizzes };
    };

    const daoDucPassedQuiz = passedContests.find(
      (c) => c.sv5tCriterion === 'Đạo đức tốt'
    );

    return [
      {
        id: 'ethics',
        criterion: 'Đạo đức tốt' as Sv5tCriterionKey,
        title: '1. Đạo đức tốt',
        headlineMetric: `Điểm rèn luyện ${ethicsScore}/100`,
        hardRule: `Điểm rèn luyện đạt ${ethicsScore}/100 (yêu cầu từ 80/100 trở lên, không vi phạm kỷ luật).`,
        subRules: [
          daoDucPassedQuiz
            ? `Đạt ${contestAttempts[daoDucPassedQuiz.id]?.bestScore}% cuộc thi "${daoDucPassedQuiz.title}".`
            : 'Tham gia Hội thi Tìm hiểu Tư tưởng Hồ Chí Minh.',
          ...getEvidencesFor('Đạo đức tốt').map((e) => `${e.title} (${e.issuer})`),
        ],
        passed: true,
        suggestions: getSuggestionsFor('Đạo đức tốt'),
      },
      {
        id: 'study',
        criterion: 'Học tập tốt' as Sv5tCriterionKey,
        title: '2. Học tập tốt',
        headlineMetric: `GPA xét chọn ${effectiveGpa.toFixed(2)} / 4.00`,
        hardRule: `GPA xét chọn đạt ${effectiveGpa.toFixed(
          2
        )}/4.00 (lấy mức cao hơn giữa GPA năm học ${weightedYearGpa.toFixed(
          2
        )} và GPA tích lũy ${cumulativeGpa.toFixed(2)}; yêu cầu từ 3.00 trở lên).`,
        subRules: [
          'Tham gia sinh hoạt chuyên đề định kỳ tại Câu lạc bộ Học thuật có xác nhận Mentor.',
          ...getEvidencesFor('Học tập tốt').map((e) => `${e.title} (${e.issuer})`),
        ],
        passed: isGpaQualified,
        hasGpaCalculator: true,
        suggestions: getSuggestionsFor('Học tập tốt'),
      },
      {
        id: 'physical',
        criterion: 'Thể lực tốt' as Sv5tCriterionKey,
        title: '3. Thể lực tốt',
        headlineMetric: 'Hoàn thành 03/03 môn GDTC',
        hardRule:
          'Hoàn thành đủ 03 môn Giáo dục thể chất trong chương trình đào tạo chính quy EIU.',
        subRules: [
          'Đạt danh hiệu "Sinh viên Khỏe" cấp Trường hoặc tham gia hoạt động thể dục thể thao định kỳ.',
          ...getEvidencesFor('Thể lực tốt').map((e) => `${e.title} (${e.issuer})`),
        ],
        passed: true,
        suggestions: getSuggestionsFor('Thể lực tốt'),
      },
      {
        id: 'volunteer',
        criterion: 'Tình nguyện tốt' as Sv5tCriterionKey,
        title: '4. Tình nguyện tốt',
        headlineMetric: `${totalVolunteerDays.toFixed(1)} / 5.0 ngày tình nguyện`,
        hardRule: `Tích lũy ${totalVolunteerDays.toFixed(
          1
        )}/5.0 ngày tình nguyện (${personalCerts.length} Giấy chứng nhận và hiến máu ${bloodDonationBonusDays.toFixed(
          1
        )} ngày).`,
        subRules: [
          'Tham gia Ngày hội Hiến máu tình nguyện EIU hoặc hoạt động tình nguyện cộng đồng.',
          ...getEvidencesFor('Tình nguyện tốt').map((e) => `${e.title} (${e.issuer})`),
        ],
        passed: isVolunteerQualified,
        suggestions: getSuggestionsFor('Tình nguyện tốt'),
      },
      {
        id: 'integration',
        criterion: 'Hội nhập tốt' as Sv5tCriterionKey,
        title: '5. Hội nhập tốt',
        headlineMetric: 'Đạt chuẩn Kỹ năng và Ngoại ngữ',
        hardRule:
          'Hoàn thành ít nhất 01 khóa Kỹ năng thực hành xã hội và 01 hoạt động Hội nhập cấp Trường trở lên.',
        subRules: [
          'Đạt chuẩn ngoại ngữ B1 / IELTS hoặc tham gia giao lưu sinh viên quốc tế EIU.',
          ...getEvidencesFor('Hội nhập tốt').map((e) => `${e.title} (${e.issuer})`),
        ],
        passed: true,
        suggestions: getSuggestionsFor('Hội nhập tốt'),
      },
    ];
  }, [
    portalState.externalEvidences,
    registeredEventIds,
    contestAttempts,
    passedContests,
    ethicsScore,
    effectiveGpa,
    weightedYearGpa,
    cumulativeGpa,
    isGpaQualified,
    totalVolunteerDays,
    personalCerts.length,
    bloodDonationBonusDays,
    isVolunteerQualified,
  ]);

  const handleQuarterInputChange = (
    index: number,
    field: 'creditsStr' | 'gpaStr',
    rawVal: string
  ) => {
    const sanitized =
      field === 'gpaStr'
        ? rawVal.replace(/[^\d.,]/g, '').slice(0, 5)
        : rawVal.replace(/[^\d]/g, '').slice(0, 2);

    updatePortalState((prev) => ({
      ...prev,
      quarters: prev.quarters.map((q, i) =>
        i === index ? { ...q, [field]: sanitized } : q
      ),
    }));
  };

  const handleQuarterBlur = (index: number, field: 'creditsStr' | 'gpaStr') => {
    updatePortalState((prev) => ({
      ...prev,
      quarters: prev.quarters.map((q, i) => {
        if (i !== index) return q;
        const parsed = parseLocaleDecimal(q[field]);
        if (field === 'gpaStr') {
          const clamped = Math.min(4, Math.max(0, parsed));
          return {
            ...q,
            gpaStr: q.gpaStr.trim() === '' ? '0' : clamped.toFixed(2),
          };
        }
        const clampedCred = Math.min(30, Math.max(0, Math.round(parsed)));
        return { ...q, creditsStr: String(clampedCred) };
      }),
    }));
  };

  const handleSaveContactInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updatePortalState((prev) => ({
      ...prev,
      phoneOverride: contactPhoneInput.trim() || undefined,
      bioNote: contactBioInput.trim() || undefined,
    }));
    setIsEditingContact(false);
    setContactSavedNotice('Đã cập nhật thông tin liên hệ vào Hồ sơ Hội viên.');
  };

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    const titleTrim = evTitle.trim();
    const issuerTrim = evIssuer.trim();
    if (titleTrim.length < 5 || issuerTrim.length < 2) {
      setEvFormError(
        'Vui lòng nhập tên minh chứng (tối thiểu 5 ký tự) và đơn vị cấp hợp lệ.'
      );
      return;
    }
    const newRecord: ExternalEvidenceRecord = {
      id: `ext-ev-${Date.now()}`,
      criterion: evCriterion,
      categoryLabel: evCategoryLabel,
      title: titleTrim,
      issuer: issuerTrim,
      issuedDate: evDate.trim() || new Date().toLocaleDateString('vi-VN'),
      referenceCode: evCode.trim() || undefined,
    };
    updatePortalState((prev) => ({
      ...prev,
      externalEvidences: [newRecord, ...prev.externalEvidences],
    }));
    setEvTitle('');
    setEvIssuer('');
    setEvDate('');
    setEvCode('');
    setEvFormError('');
    setShowAddEvidenceForm(false);
  };

  const handleDeleteEvidence = (evId: string) => {
    updatePortalState((prev) => ({
      ...prev,
      externalEvidences: prev.externalEvidences.filter((item) => item.id !== evId),
    }));
  };

  const handleSubmitTicket = (ticket: {
    recipient: 'BKT' | 'BAN_TGPT';
    category: string;
    isAnonymous: boolean;
    content: string;
  }): string => {
    const nextSeq = 2603 + portalState.voiceTickets.length;
    const ticketCode = `#BKT-${nextSeq}`;
    const newTicket: VoiceTicketRecord = {
      id: ticketCode,
      recipient: ticket.recipient,
      category: ticket.category,
      isAnonymous: ticket.isAnonymous,
      content: ticket.content,
      createdAt: new Date().toLocaleString('vi-VN'),
      status: 'Đã tiếp nhận (Phản hồi trong 03 ngày làm việc)',
    };
    updatePortalState((prev) => ({
      ...prev,
      voiceTickets: [newTicket, ...prev.voiceTickets],
    }));
    return ticketCode;
  };

  const handleSubmitAwardApplication = ({
    program,
    snapshot,
    attachedCertCodes,
    attachedEvidenceIds,
    statement,
  }: {
    program: AwardProgramItem;
    snapshot: AwardApplicationSnapshot;
    attachedCertCodes: string[];
    attachedEvidenceIds: string[];
    statement: string;
  }) => {
    const nextCode = `#HS-26${String(portalState.awardApplications.length + 11).padStart(
      2,
      '0'
    )}`;
    const nowTime = new Date().toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const newApp: SubmittedAwardApplication = {
      id: nextCode,
      programId: program.id,
      programTitle: program.title,
      categoryLabel: program.categoryLabel,
      submittedAt: nowTime,
      reviewStage: 1,
      statusLabel: 'Cấp 1 – Đang chờ Cơ sở Hội sơ duyệt',
      autoFilledSnapshot: snapshot,
      attachedCertCodes,
      attachedEvidenceIds,
      statement,
    };

    updatePortalState((prev) => ({
      ...prev,
      dossierSubmitted:
        program.id === 'prog-sv5t-truong-2026' ? true : prev.dossierSubmitted,
      submittedAt:
        program.id === 'prog-sv5t-truong-2026' ? nowTime : prev.submittedAt,
      awardApplications: [
        newApp,
        ...prev.awardApplications.filter((a) => a.programId !== program.id),
      ],
    }));
  };

  const handleConfirmWithdrawApplication = () => {
    if (!withdrawAppId) return;
    updatePortalState((prev) => {
      const target = prev.awardApplications.find((a) => a.id === withdrawAppId);
      const isSv5tTruong = target?.programId === 'prog-sv5t-truong-2026';
      return {
        ...prev,
        dossierSubmitted: isSv5tTruong ? false : prev.dossierSubmitted,
        submittedAt: isSv5tTruong ? undefined : prev.submittedAt,
        awardApplications: prev.awardApplications.filter(
          (a) => a.id !== withdrawAppId
        ),
      };
    });
    setWithdrawAppId(null);
    setActiveAwardProgram(null);
  };

  const handleCancelRegisteredEvent = (eventId: string) => {
    setRegisteredEventIds(
      currentPersona.id,
      registeredEventIds.filter((id) => id !== eventId)
    );
  };

  const openEventsCount = AWARD_PROGRAMS.filter((p) => p.status === 'OPEN').length;
  const sv5tTruongProgram =
    AWARD_PROGRAMS.find((p) => p.id === 'prog-sv5t-truong-2026') || AWARD_PROGRAMS[0];
  const sv5tApplication = portalState.awardApplications.find(
    (a) => a.programId === 'prog-sv5t-truong-2026'
  );

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      {/* ====================================================================
          HEADER ĐỊNH DANH HỘI VIÊN TINH GỌN
         ==================================================================== */}
      <section className="bg-[#133F68] eiu-arch-pattern text-white border-b-3 border-[#A68556]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4 min-w-0">
            <div
              aria-hidden="true"
              className="w-14 h-14 sm:w-16 sm:h-16 bg-[#02294E] border-2 border-[#FCB900] flex items-center justify-center font-eiu-display font-extrabold text-xl text-[#FCB900] shrink-0"
            >
              {getMonogramInitials(currentPersona.fullName)}
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-extrabold font-eiu-display text-white leading-tight">
                  {currentPersona.fullName}
                </h1>
                <span className="px-2.5 py-0.5 bg-[#51803A] text-white text-[11px] font-bold font-eiu-display">
                  Hội viên đang sinh hoạt
                </span>
              </div>

              <div className="text-xs sm:text-[13px] text-[#DED1BE] flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="font-eiu-serif font-semibold text-white">
                  {currentPersona.studentId !== '-'
                    ? `MSSV: ${currentPersona.studentId}`
                    : 'Cán bộ Trường EIU'}
                </span>
                <span aria-hidden="true">•</span>
                <span>{facultyMeta.nameVi}</span>
                <span aria-hidden="true">•</span>
                <span>{primaryBranch.name}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setQrModalOpen(true)}
              className="min-h-[44px] px-4 py-2 bg-[#FCB900] hover:bg-[#eab000] active:scale-[0.98] text-[#02294E] text-xs font-extrabold uppercase tracking-wider font-eiu-display inline-flex items-center gap-2 cursor-pointer transition-transform duration-100 ease-out motion-reduce:transition-none motion-reduce:transform-none"
            >
              <QrCode className="w-4 h-4" />
              <span>Mã QR Hội viên</span>
            </button>

            <button
              type="button"
              onClick={() => setSupportModalState({ open: true })}
              className="min-h-[44px] px-4 py-2 bg-white/12 hover:bg-white/20 active:scale-[0.98] border border-white/25 text-white text-xs font-bold font-eiu-display inline-flex items-center gap-2 cursor-pointer transition-transform duration-100 ease-out motion-reduce:transition-none motion-reduce:transform-none"
            >
              <HelpCircle className="w-4 h-4 text-[#00BCFF]" />
              <span>Góp ý và Hỗ trợ</span>
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================================
          THANH 5 TAB NGANG CỐ ĐỊNH (TOÀN KHUNG 1200PX)
         ==================================================================== */}
      <div className="sticky top-[78px] z-30 bg-white border-b border-slate-200 shadow-2xs">
        <nav
          aria-label="Phân mục Hồ sơ Hội viên"
          className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-2 overflow-x-auto"
        >
          {PORTAL_TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-current={isSelected ? 'page' : undefined}
                onClick={() => setActiveTab(tab.id)}
                className={`relative min-h-[48px] px-3 sm:px-4 py-3 text-xs sm:text-[13px] font-bold whitespace-nowrap shrink-0 cursor-pointer font-eiu-display transition-colors ${
                  isSelected
                    ? 'text-[#C10230]'
                    : 'text-[#133F68] hover:text-[#A68556]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.id === 'applications' && portalState.awardApplications.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-[#0054A6] text-white text-[10.5px] font-eiu-serif rounded-full">
                    {portalState.awardApplications.length}
                  </span>
                )}
                {isSelected && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-2 right-2 h-[3px] bg-[#C10230]"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ====================================================================
          NỘI DUNG TỪNG PHÂN MỤC (PROGRESSIVE DISCLOSURE)
         ==================================================================== */}
      <div
        ref={contentTopRef}
        className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6 scroll-mt-32"
      >
        {/* ------------------------------------------------------------------
            TAB 1: THÔNG TIN CHUNG
           ------------------------------------------------------------------ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Dải 4 Chỉ số Tóm tắt Cá nhân (chỉ xuất hiện ở Thông tin chung) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('sv5t', true)}
                className="bg-white border border-slate-200 border-t-2 border-t-[#133F68] hover:border-[#0054A6] active:scale-[0.98] p-4 text-left flex items-center justify-between gap-3 cursor-pointer transition-all duration-150 ease-out motion-reduce:transition-none motion-reduce:transform-none"
              >
                <div>
                  <div className="text-xs text-slate-600 font-medium">
                    Tiêu chuẩn SV5T đạt
                  </div>
                  <div className="text-xl font-extrabold font-eiu-serif text-[#133F68] mt-0.5 tabular-nums">
                    {String(metCriteriaCount).padStart(2, '0')} / 05 tiêu chuẩn
                  </div>
                </div>
                <Award className="w-6 h-6 text-[#0054A6] shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('activities', true)}
                className="bg-white border border-slate-200 border-t-2 border-t-[#51803A] hover:border-[#51803A] active:scale-[0.98] p-4 text-left flex items-center justify-between gap-3 cursor-pointer transition-all duration-150 ease-out motion-reduce:transition-none motion-reduce:transform-none"
              >
                <div>
                  <div className="text-xs text-slate-600 font-medium">
                    Ngày tình nguyện tích lũy
                  </div>
                  <div className="text-xl font-extrabold font-eiu-serif text-[#2E521D] mt-0.5 tabular-nums">
                    {totalVolunteerDays.toFixed(1)} ngày
                  </div>
                </div>
                <HeartHandshake className="w-6 h-6 text-[#51803A] shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('certificates', true)}
                className="bg-white border border-slate-200 border-t-2 border-t-[#0054A6] hover:border-[#0054A6] active:scale-[0.98] p-4 text-left flex items-center justify-between gap-3 cursor-pointer transition-all duration-150 ease-out motion-reduce:transition-none motion-reduce:transform-none"
              >
                <div>
                  <div className="text-xs text-slate-600 font-medium">
                    Giấy chứng nhận điện tử
                  </div>
                  <div className="text-xl font-extrabold font-eiu-serif text-[#0054A6] mt-0.5 tabular-nums">
                    {personalCerts.length} chứng nhận
                  </div>
                </div>
                <FileCheck2 className="w-6 h-6 text-[#0054A6] shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('applications', true)}
                className="bg-white border border-slate-200 border-t-2 border-t-[#C10230] hover:border-[#C10230] active:scale-[0.98] p-4 text-left flex items-center justify-between gap-3 cursor-pointer transition-all duration-150 ease-out motion-reduce:transition-none motion-reduce:transform-none"
              >
                <div>
                  <div className="text-xs text-slate-600 font-medium">
                    Đợt xét chọn đang mở
                  </div>
                  <div className="text-xl font-extrabold font-eiu-serif text-[#C10230] mt-0.5 tabular-nums">
                    {openEventsCount} đợt hồ sơ
                  </div>
                </div>
                <Sparkles className="w-6 h-6 text-[#C10230] shrink-0" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* CỘT TRÁI (7/12): Hồ sơ Học vụ và Thông tin Liên hệ */}
              <section className="lg:col-span-7 bg-white border border-slate-200 border-t-2 border-t-[#133F68]">
                <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-[#133F68]" />
                    <h2 className="text-base font-bold text-[#133F68] font-eiu-display">
                      Thông tin học vụ và liên hệ
                    </h2>
                  </div>

                  {!isEditingContact && (
                    <button
                      type="button"
                      onClick={() => {
                        setContactPhoneInput(portalState.phoneOverride || currentPersona.phone);
                        setContactBioInput(displayBio);
                        setIsEditingContact(true);
                        setContactSavedNotice('');
                      }}
                      className="min-h-[40px] sm:min-h-[34px] px-3 py-1.5 border border-slate-300 hover:border-[#133F68] text-[#133F68] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Cập nhật liên hệ</span>
                    </button>
                  )}
                </div>

                <div className="p-5 space-y-5 text-xs sm:text-[13px]">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-slate-500">Họ và tên</dt>
                      <dd className="font-bold text-[#133F68] mt-0.5">
                        {currentPersona.fullName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Mã số sinh viên</dt>
                      <dd className="font-eiu-serif font-bold text-[#133F68] mt-0.5">
                        {currentPersona.studentId !== '-'
                          ? currentPersona.studentId
                          : 'Cán bộ Trường'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Khoa đào tạo</dt>
                      <dd className="font-semibold text-slate-900 mt-0.5">
                        {facultyMeta.nameVi}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Ngành học</dt>
                      <dd className="font-semibold text-slate-900 mt-0.5">
                        {currentPersona.majorName || mssvDecoded.majorName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Khóa tuyển sinh</dt>
                      <dd className="font-semibold text-slate-900 mt-0.5">
                        {emailDecoded.cohortYear
                          ? `Khóa ${emailDecoded.cohortYear} (${currentPersona.academicYearText})`
                          : currentPersona.academicYearText}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Ngày sinh / Giới tính</dt>
                      <dd className="font-semibold text-slate-900 mt-0.5">
                        {currentPersona.dateOfBirth} • {currentPersona.gender}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-slate-500">Email trường</dt>
                      <dd className="font-eiu-serif font-semibold text-[#0054A6] break-all mt-0.5">
                        {currentPersona.email}
                      </dd>
                    </div>
                  </dl>

                  {contactSavedNotice && (
                    <div
                      role="status"
                      className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium"
                    >
                      ✓ {contactSavedNotice}
                    </div>
                  )}

                  {isEditingContact ? (
                    <form
                      onSubmit={handleSaveContactInfo}
                      className="pt-4 border-t border-slate-200 space-y-3"
                    >
                      <div>
                        <label
                          htmlFor="edit-phone-input"
                          className="font-bold text-[#133F68] block mb-1"
                        >
                          Số điện thoại liên hệ
                        </label>
                        <input
                          id="edit-phone-input"
                          type="tel"
                          maxLength={20}
                          value={contactPhoneInput}
                          onChange={(e) => setContactPhoneInput(e.target.value)}
                          className="w-full sm:w-64 min-h-[44px] sm:min-h-[38px] px-3 border border-slate-300 rounded font-eiu-serif text-base sm:text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="edit-bio-input"
                          className="font-bold text-[#133F68] block mb-1"
                        >
                          Tóm tắt kỹ năng và định hướng cá nhân (dùng tự động điền hồ sơ)
                        </label>
                        <textarea
                          id="edit-bio-input"
                          rows={3}
                          maxLength={400}
                          value={contactBioInput}
                          onChange={(e) => setContactBioInput(e.target.value)}
                          className="w-full p-3 border border-slate-300 rounded text-base sm:text-xs text-slate-900"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="submit"
                          className="min-h-[44px] sm:min-h-[36px] px-4 py-1.5 bg-[#0054A6] hover:bg-[#133F68] text-white text-xs font-bold uppercase font-eiu-display rounded cursor-pointer"
                        >
                          Lưu thay đổi
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingContact(false)}
                          className="min-h-[44px] sm:min-h-[36px] px-4 py-1.5 border border-slate-300 text-slate-700 text-xs font-bold uppercase font-eiu-display rounded cursor-pointer"
                        >
                          Hủy
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="pt-4 border-t border-slate-200 space-y-2">
                      <div>
                        <span className="text-slate-500">Số điện thoại: </span>
                        <strong className="font-eiu-serif text-[#133F68]">
                          {displayPhone}
                        </strong>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{displayBio}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* CỘT PHẢI (5/12): Chi hội và Câu lạc bộ đang sinh hoạt */}
              <section className="lg:col-span-5 bg-white border border-slate-200 border-t-2 border-t-[#133F68]">
                <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#133F68]" />
                    <h2 className="text-base font-bold text-[#133F68] font-eiu-display">
                      Chi hội và CLB đang tham gia
                    </h2>
                  </div>
                </div>

                <div className="divide-y divide-slate-200 text-xs sm:text-[13px]">
                  {/* Chi hội trực thuộc */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[#133F68] text-sm font-eiu-display">
                        {primaryBranch.name}
                      </span>
                      <span className="px-2 py-0.5 bg-[#EAE3D2] text-[#133F68] text-[11px] font-bold">
                        Chi hội gốc
                      </span>
                    </div>
                    <p className="text-slate-600">{primaryBranch.facultyName}</p>
                    {primaryBranch.branchPresidentName && (
                      <p className="text-slate-700">
                        Chi hội trưởng:{' '}
                        <strong>{primaryBranch.branchPresidentName}</strong>
                      </p>
                    )}
                    <div className="pt-1">
                      <Link
                        href={`/to-chuc/${primaryBranch.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#0054A6] hover:text-[#C10230]"
                      >
                        <span>Xem thông tin Chi hội</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Các CLB – Đội – Nhóm đang sinh hoạt */}
                  <div className="p-5 space-y-3">
                    <div className="font-bold text-[#133F68]">
                      Câu lạc bộ – Đội – Nhóm ({activeClubs.length})
                    </div>
                    <div className="space-y-2.5">
                      {activeClubs.map((club) => (
                        <Link
                          key={club.id}
                          href={`/to-chuc/${club.slug}`}
                          className="block p-3 bg-[#F8FAFC] hover:bg-[#EAE3D2]/60 border border-slate-200 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-[#133F68]">
                              {club.name}
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                          </div>
                          <div className="text-[11.5px] text-slate-600 mt-0.5">
                            {club.categoryLabel} • {club.memberCount} thành viên
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="pt-1">
                      <Link
                        href="/to-chuc?tab=clb"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0054A6] hover:text-[#C10230]"
                      >
                        <span>Khám phá danh sách 30 CLB – Đội – Nhóm EIU</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            TAB 2: SỔ TAY SINH VIÊN 5 TỐT (ACCORDION + GPA + GỢI Ý + MINH CHỨNG)
           ------------------------------------------------------------------ */}
        {activeTab === 'sv5t' && (
          <div className="space-y-6">
            {/* Tổng quan tiến độ & Lối tắt nộp hồ sơ SV5T */}
            <section className="bg-white border border-slate-200 border-t-2 border-t-[#133F68] p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-base sm:text-lg font-bold text-[#133F68] font-eiu-display">
                    Lộ trình rèn luyện Sinh viên 5 tốt
                  </h2>
                  <span className="px-2.5 py-0.5 bg-[#0054A6]/10 text-[#0054A6] text-xs font-eiu-serif font-bold">
                    Đạt {String(metCriteriaCount).padStart(2, '0')} / 05 tiêu chuẩn
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-600">
                  {sv5tApplication
                    ? `Hồ sơ mã ${sv5tApplication.id} đang ở bước: ${sv5tApplication.statusLabel}.`
                    : metCriteriaCount === 5
                    ? 'Bạn đã đủ điều kiện đăng ký xét chọn danh hiệu Sinh viên 5 tốt cấp Trường.'
                    : 'Mở từng tiêu chuẩn bên dưới để kiểm tra chỉ số còn thiếu và gợi ý hoạt động phù hợp.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddEvidenceForm(true);
                    setExpandedPillarId(null);
                  }}
                  className="min-h-[44px] sm:min-h-[38px] px-4 py-2 border border-[#133F68] text-[#133F68] hover:bg-[#EAE3D2] text-xs font-bold font-eiu-display inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm minh chứng ngoại khóa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveAwardProgram(sv5tTruongProgram)}
                  className="min-h-[44px] sm:min-h-[38px] px-5 py-2 bg-[#0054A6] hover:bg-[#133F68] text-white text-xs font-bold uppercase tracking-wider font-eiu-display cursor-pointer"
                >
                  {sv5tApplication ? 'Xem hồ sơ đã nộp' : 'Nộp hồ sơ xét chọn'}
                </button>
              </div>
            </section>

            {/* 05 Thẻ Tiêu chuẩn Đóng/Mở (Progressive Disclosure) */}
            <div className="space-y-3">
              {sv5tStandards.map((item) => {
                const isOpen = expandedPillarId === item.id;
                const hasSuggestions =
                  item.suggestions.openEvents.length > 0 ||
                  item.suggestions.openQuizzes.length > 0;

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 transition-colors"
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() =>
                        setExpandedPillarId(isOpen ? null : item.id)
                      }
                      className="w-full p-4 sm:p-5 text-left flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-[#133F68] font-eiu-display">
                          {item.title}
                        </h3>
                        <div className="text-xs text-slate-600">
                          {item.headlineMetric}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 ml-auto">
                        <span
                          className={`px-2.5 py-1 text-xs font-eiu-serif font-bold border whitespace-nowrap ${
                            item.passed
                              ? 'bg-[#51803A]/10 text-[#2E521D] border-[#51803A]/30'
                              : 'bg-[#C10230]/10 text-[#9E0024] border-[#C10230]/30'
                          }`}
                        >
                          {item.passed ? '✓ Đạt chuẩn' : 'Cần bổ sung'}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#133F68] transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-slate-200 space-y-5 text-xs sm:text-[13px]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8FAFC] border border-slate-200 p-4">
                          <div className="space-y-1">
                            <div className="font-bold text-[#133F68]">
                              Điều kiện bắt buộc
                            </div>
                            <p className="text-slate-700 leading-relaxed">
                              {item.hardRule}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <div className="font-bold text-[#133F68]">
                              Tiêu chí phụ và minh chứng đã ghi nhận
                            </div>
                            <ul className="space-y-1 text-slate-700 list-disc pl-4">
                              {item.subRules.map((rule) => (
                                <li key={rule}>{rule}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Máy tính GPA Học chế Quý EIU tích hợp gọn trong Tiêu chuẩn Học tập tốt */}
                        {item.hasGpaCalculator && (
                          <div className="border border-slate-200 divide-y divide-slate-200">
                            <div className="bg-[#133F68] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                              <span className="font-bold text-xs font-eiu-display inline-flex items-center gap-2">
                                <Calculator className="w-4 h-4 text-[#00BCFF]" />
                                <span>Tính tự động GPA Học chế Quý EIU (Thu – Đông – Xuân)</span>
                              </span>
                              <span className="font-eiu-serif font-bold text-xs text-[#FCB900]">
                                Kết quả xét chọn: {effectiveGpa.toFixed(2)} / 4.00
                              </span>
                            </div>

                            <div className="divide-y divide-slate-200 text-xs">
                              {portalState.quarters.map((q, idx) => (
                                <div
                                  key={q.quarterName}
                                  className="grid grid-cols-1 sm:grid-cols-12 p-3.5 items-center gap-3"
                                >
                                  <div className="sm:col-span-6 font-semibold text-[#133F68]">
                                    {q.quarterName}
                                  </div>
                                  <div className="sm:col-span-3">
                                    <label
                                      htmlFor={`q-cred-${idx}`}
                                      className="block text-[11px] text-slate-600 mb-1"
                                    >
                                      Số tín chỉ
                                    </label>
                                    <input
                                      id={`q-cred-${idx}`}
                                      type="text"
                                      inputMode="numeric"
                                      value={q.creditsStr}
                                      onChange={(e) =>
                                        handleQuarterInputChange(
                                          idx,
                                          'creditsStr',
                                          e.target.value
                                        )
                                      }
                                      onBlur={() => handleQuarterBlur(idx, 'creditsStr')}
                                      className="w-full h-11 sm:h-9 px-3 border border-slate-300 rounded font-eiu-serif text-base sm:text-xs text-slate-900"
                                    />
                                  </div>
                                  <div className="sm:col-span-3">
                                    <label
                                      htmlFor={`q-gpa-${idx}`}
                                      className="block text-[11px] text-slate-600 mb-1"
                                    >
                                      GPA (Thang 4.00)
                                    </label>
                                    <input
                                      id={`q-gpa-${idx}`}
                                      type="text"
                                      inputMode="decimal"
                                      value={q.gpaStr}
                                      onChange={(e) =>
                                        handleQuarterInputChange(
                                          idx,
                                          'gpaStr',
                                          e.target.value
                                        )
                                      }
                                      onBlur={() => handleQuarterBlur(idx, 'gpaStr')}
                                      className="w-full h-11 sm:h-9 px-3 border border-slate-300 rounded font-eiu-serif text-base sm:text-xs font-bold text-[#0054A6]"
                                    />
                                  </div>
                                </div>
                              ))}

                              <div className="grid grid-cols-1 sm:grid-cols-12 p-3.5 items-center gap-3 bg-[#F8FAFC]">
                                <div className="sm:col-span-6">
                                  <label
                                    htmlFor="cum-gpa-input"
                                    className="font-bold text-[#133F68] block"
                                  >
                                    GPA Tích lũy toàn khóa
                                  </label>
                                  <span className="text-[11px] text-slate-600">
                                    Tự động chọn mức cao hơn giữa GPA năm học ({weightedYearGpa.toFixed(2)}) và GPA tích lũy
                                  </span>
                                </div>
                                <div className="sm:col-span-6">
                                  <input
                                    id="cum-gpa-input"
                                    type="text"
                                    inputMode="decimal"
                                    value={portalState.cumulativeGpaStr}
                                    onChange={(e) => {
                                      const cleaned = e.target.value
                                        .replace(/[^\d.,]/g, '')
                                        .slice(0, 5);
                                      updatePortalState((prev) => ({
                                        ...prev,
                                        cumulativeGpaStr: cleaned,
                                      }));
                                    }}
                                    onBlur={() => {
                                      const clamped = Math.min(
                                        4,
                                        Math.max(
                                          0,
                                          parseLocaleDecimal(portalState.cumulativeGpaStr)
                                        )
                                      );
                                      updatePortalState((prev) => ({
                                        ...prev,
                                        cumulativeGpaStr:
                                          prev.cumulativeGpaStr.trim() === ''
                                            ? '0.00'
                                            : clamped.toFixed(2),
                                      }));
                                    }}
                                    className="w-full sm:w-44 h-11 sm:h-9 px-3 border-2 border-[#0054A6] rounded font-eiu-serif text-base sm:text-xs font-bold text-[#133F68] bg-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Gợi ý Sự kiện và Cuộc thi đang mở phù hợp tiêu chuẩn */}
                        {hasSuggestions && (
                          <div className="space-y-2.5">
                            <div className="font-bold text-[#133F68] flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-[#FCB900]" />
                              <span>Hoạt động đang mở giúp hoàn thiện tiêu chuẩn này</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {item.suggestions.openEvents.map((ev) => (
                                <Link
                                  key={ev.id}
                                  href={`/su-kien?event=${encodeURIComponent(ev.id)}`}
                                  className="p-3.5 border border-slate-200 hover:border-[#0054A6] bg-white flex flex-col justify-between gap-2 transition-colors"
                                >
                                  <div className="font-bold text-[#133F68] leading-snug">
                                    {ev.title}
                                  </div>
                                  <div className="flex items-center justify-between text-xs text-slate-600">
                                    <span className="font-eiu-serif text-[#0054A6] font-bold">
                                      +{ev.baseVolunteerDays.toFixed(1)} ngày TN
                                    </span>
                                    <span className="font-bold text-[#C10230]">
                                      Đăng ký ngay →
                                    </span>
                                  </div>
                                </Link>
                              ))}

                              {item.suggestions.openQuizzes.map((qz) => (
                                <button
                                  key={qz.id}
                                  type="button"
                                  onClick={() => setActiveModalContest(qz)}
                                  className="p-3.5 border border-slate-200 hover:border-[#0054A6] bg-white text-left flex flex-col justify-between gap-2 cursor-pointer transition-colors"
                                >
                                  <div className="font-bold text-[#133F68] leading-snug">
                                    Cuộc thi: {qz.title}
                                  </div>
                                  <div className="flex items-center justify-between text-xs text-slate-600">
                                    <span className="font-eiu-serif text-[#0054A6] font-bold">
                                      Đạt từ {qz.passScore}%
                                    </span>
                                    <span className="font-bold text-[#0054A6]">
                                      Làm bài ngay →
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Khay Minh chứng Ngoại khóa Cá nhân */}
            <section className="bg-white border border-slate-200 border-t-2 border-t-[#133F68]">
              <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-base font-bold text-[#133F68] font-eiu-display">
                  Minh chứng ngoại khóa cá nhân ({portalState.externalEvidences.length})
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAddEvidenceForm((prev) => !prev)}
                  className="min-h-[40px] sm:min-h-[34px] px-3.5 py-1.5 bg-[#EAE3D2] hover:bg-[#dfd5be] text-[#133F68] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddEvidenceForm ? 'Ẩn biểu mẫu' : 'Bổ sung minh chứng'}</span>
                </button>
              </div>

              {showAddEvidenceForm && (
                <form
                  onSubmit={handleAddEvidence}
                  noValidate
                  className="p-5 bg-[#F8FAFC] border-b border-slate-200 space-y-4 text-xs"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label htmlFor="ev-criterion" className="font-bold text-[#133F68] block mb-1">
                        Tiêu chuẩn SV5T
                      </label>
                      <select
                        id="ev-criterion"
                        value={evCriterion}
                        onChange={(e) =>
                          setEvCriterion(e.target.value as Sv5tCriterionKey)
                        }
                        className="w-full min-h-[44px] sm:min-h-[38px] px-3 border border-slate-300 rounded bg-white text-base sm:text-xs"
                      >
                        <option value="Đạo đức tốt">Đạo đức tốt</option>
                        <option value="Học tập tốt">Học tập tốt</option>
                        <option value="Thể lực tốt">Thể lực tốt</option>
                        <option value="Tình nguyện tốt">Tình nguyện tốt</option>
                        <option value="Hội nhập tốt">Hội nhập tốt</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="ev-category" className="font-bold text-[#133F68] block mb-1">
                        Loại minh chứng
                      </label>
                      <select
                        id="ev-category"
                        value={evCategoryLabel}
                        onChange={(e) => setEvCategoryLabel(e.target.value)}
                        className="w-full min-h-[44px] sm:min-h-[38px] px-3 border border-slate-300 rounded bg-white text-base sm:text-xs"
                      >
                        <option value="Chứng chỉ ngoại ngữ">Chứng chỉ ngoại ngữ</option>
                        <option value="Giải thưởng / Học thuật">Giải thưởng / Học thuật</option>
                        <option value="Hoạt động ngoài trường">Hoạt động ngoài trường</option>
                        <option value="Giấy chứng nhận Thể thao">Giấy chứng nhận Thể thao</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="ev-date" className="font-bold text-[#133F68] block mb-1">
                        Ngày cấp
                      </label>
                      <input
                        id="ev-date"
                        type="text"
                        value={evDate}
                        onChange={(e) => setEvDate(e.target.value)}
                        placeholder="Ví dụ: 20/10/2026"
                        className="w-full min-h-[44px] sm:min-h-[38px] px-3 border border-slate-300 rounded bg-white text-base sm:text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="ev-title" className="font-bold text-[#133F68] block mb-1">
                        Tên chứng nhận / giải thưởng / hoạt động
                      </label>
                      <input
                        id="ev-title"
                        type="text"
                        required
                        maxLength={200}
                        value={evTitle}
                        onChange={(e) => {
                          setEvTitle(e.target.value);
                          if (evFormError) setEvFormError('');
                        }}
                        placeholder="Ví dụ: Giải Nhì Cuộc thi Hackathon Sinh viên Bình Dương 2026"
                        className="w-full min-h-[44px] sm:min-h-[38px] px-3 border border-slate-300 rounded bg-white text-base sm:text-xs"
                      />
                    </div>

                    <div>
                      <label htmlFor="ev-issuer" className="font-bold text-[#133F68] block mb-1">
                        Đơn vị cấp / Tổ chức
                      </label>
                      <input
                        id="ev-issuer"
                        type="text"
                        required
                        maxLength={120}
                        value={evIssuer}
                        onChange={(e) => {
                          setEvIssuer(e.target.value);
                          if (evFormError) setEvFormError('');
                        }}
                        placeholder="Ví dụ: Sở KH và CN"
                        className="w-full min-h-[44px] sm:min-h-[38px] px-3 border border-slate-300 rounded bg-white text-base sm:text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                      <label htmlFor="ev-code" className="font-bold text-[#133F68] block mb-1">
                        Mã xác thực hoặc liên kết minh chứng (tùy chọn)
                      </label>
                      <input
                        id="ev-code"
                        type="text"
                        maxLength={200}
                        value={evCode}
                        onChange={(e) => setEvCode(e.target.value)}
                        placeholder="Số hiệu chứng chỉ hoặc đường dẫn Google Drive..."
                        className="w-full min-h-[44px] sm:min-h-[38px] px-3 border border-slate-300 rounded bg-white text-base sm:text-xs"
                      />
                    </div>
                  </div>

                  {evFormError && (
                    <p role="alert" className="text-[#C10230] font-semibold">
                      {evFormError}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="submit"
                      className="min-h-[44px] sm:min-h-[38px] px-5 py-2 bg-[#0054A6] hover:bg-[#133F68] text-white font-bold uppercase font-eiu-display rounded cursor-pointer"
                    >
                      Lưu minh chứng vào Hồ sơ
                    </button>
                  </div>
                </form>
              )}

              {portalState.externalEvidences.length > 0 ? (
                <div className="divide-y divide-slate-200 text-xs sm:text-[13px]">
                  {portalState.externalEvidences.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 bg-[#133F68] text-white text-[11px] font-bold">
                            {ev.criterion}
                          </span>
                          <span className="px-2 py-0.5 bg-[#EAE3D2] text-[#133F68] text-[11px] font-semibold">
                            {ev.categoryLabel}
                          </span>
                          {ev.referenceCode && (
                            <span className="font-eiu-serif text-slate-600 text-xs">
                              Mã: {ev.referenceCode}
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-[#133F68]">{ev.title}</div>
                        <div className="text-slate-600">
                          Đơn vị cấp: <strong>{ev.issuer}</strong> • Ngày cấp:{' '}
                          <span className="font-eiu-serif">{ev.issuedDate}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteEvidence(ev.id)}
                        aria-label={`Xóa minh chứng ${ev.title}`}
                        className="min-h-[40px] sm:min-h-[34px] px-3 py-1.5 border border-slate-300 hover:border-[#C10230] text-slate-600 hover:text-[#C10230] text-xs font-semibold inline-flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-xs text-slate-600">
                  Chưa có minh chứng ngoại khóa nào được lưu.
                </div>
              )}
            </section>
          </div>
        )}

        {/* ------------------------------------------------------------------
            TAB 3: XÉT CHỌN HỒ SƠ (DANH HIỆU, KHEN THƯỞNG, HỌC BỔNG AUTO-FILL)
           ------------------------------------------------------------------ */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
              <div
                role="group"
                aria-label="Lọc đợt xét chọn hồ sơ"
                className="flex flex-wrap items-center gap-2"
              >
                {(
                  [
                    { id: 'ALL', label: `Tất cả (${AWARD_PROGRAMS.length})` },
                    { id: 'DANH_HIEU', label: 'Danh hiệu' },
                    { id: 'KHEN_THUONG', label: 'Khen thưởng' },
                    { id: 'HOC_BONG', label: 'Học bổng' },
                    {
                      id: 'SUBMITTED',
                      label: `Đã nộp (${portalState.awardApplications.length})`,
                    },
                  ] as const
                ).map((pill) => {
                  const active = awardFilter === pill.id;
                  return (
                    <button
                      key={pill.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setAwardFilter(pill.id)}
                      className={`min-h-[44px] sm:min-h-[36px] px-4 py-1.5 rounded-full text-xs font-bold font-eiu-display cursor-pointer transition-colors ${
                        active
                          ? 'bg-[#C10230] text-white'
                          : 'bg-slate-100 text-[#133F68] hover:bg-[#EAE3D2]'
                      }`}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>

              <span className="text-xs text-slate-600">
                Hỗ trợ tự động điền thông tin từ Hồ sơ Hội viên
              </span>
            </div>

            {(() => {
              const filteredPrograms = AWARD_PROGRAMS.filter((prog) => {
                if (awardFilter === 'ALL') return true;
                if (awardFilter === 'SUBMITTED') {
                  return portalState.awardApplications.some(
                    (a) => a.programId === prog.id
                  );
                }
                return prog.category === awardFilter;
              });

              if (filteredPrograms.length === 0) {
                return (
                  <div className="bg-white border border-slate-200 p-8 text-center space-y-3">
                    <p className="text-sm font-bold text-[#133F68] font-eiu-display">
                      Bạn chưa nộp hồ sơ nào trong nhóm lọc này
                    </p>
                    <button
                      type="button"
                      onClick={() => setAwardFilter('ALL')}
                      className="min-h-[44px] sm:min-h-[38px] px-4 py-2 bg-[#133F68] text-white text-xs font-bold rounded-full font-eiu-display cursor-pointer"
                    >
                      Xem tất cả đợt xét chọn
                    </button>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredPrograms.map((prog) => {
                    const submitted = portalState.awardApplications.find(
                      (a) => a.programId === prog.id
                    );
                    const isOpen = prog.status === 'OPEN';

                    return (
                      <article
                        key={prog.id}
                        className="bg-white border border-slate-200 border-t-2 border-t-[#133F68] p-5 flex flex-col justify-between gap-4"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-base font-bold text-[#133F68] font-eiu-display leading-snug">
                              {prog.title}
                            </h3>
                            <span
                              className={`px-2.5 py-0.5 text-[11px] font-bold shrink-0 ${
                                submitted
                                  ? 'bg-[#51803A] text-white'
                                  : isOpen
                                  ? 'bg-[#0054A6]/10 text-[#0054A6]'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {submitted
                                ? 'Đã nộp hồ sơ'
                                : isOpen
                                ? 'Đang mở'
                                : 'Sắp mở'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                            <span className="px-2 py-0.5 bg-[#EAE3D2] text-[#133F68] font-bold">
                              {prog.categoryLabel}
                            </span>
                            <span>{prog.issuingBody}</span>
                            <span aria-hidden="true">•</span>
                            <span className="font-eiu-serif font-bold text-[#C10230]">
                              Hạn: {prog.deadline}
                            </span>
                          </div>

                          <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                            {prog.summary}
                          </p>

                          <div className="bg-[#F8FAFC] border border-slate-200 p-3 space-y-1 text-xs">
                            <div className="font-bold text-[#133F68]">
                              Tiêu chuẩn nổi bật
                            </div>
                            <ul className="list-disc pl-4 space-y-1 text-slate-700">
                              {prog.requirements.slice(0, 3).map((req) => (
                                <li key={req}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs text-slate-600">
                            {submitted
                              ? `Mã hồ sơ: ${submitted.id}`
                              : `Tự động điền sẵn ${personalCerts.length + portalState.externalEvidences.length} minh chứng`}
                          </span>

                          {isOpen ? (
                            <button
                              type="button"
                              onClick={() => setActiveAwardProgram(prog)}
                              className={`min-h-[44px] sm:min-h-[38px] px-4 py-2 text-xs font-bold uppercase tracking-wider font-eiu-display cursor-pointer transition-colors ${
                                submitted
                                  ? 'bg-[#51803A] hover:bg-[#3f662d] text-white'
                                  : 'bg-[#0054A6] hover:bg-[#133F68] text-white'
                              }`}
                            >
                              {submitted
                                ? 'Xem hồ sơ đã gửi'
                                : 'Làm hồ sơ trực tuyến'}
                            </button>
                          ) : (
                            <span className="min-h-[38px] inline-flex items-center px-3.5 py-2 bg-slate-100 text-slate-600 text-xs font-bold font-eiu-display">
                              Chưa mở cổng nộp
                            </span>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* ------------------------------------------------------------------
            TAB 4: SỰ KIỆN VÀ CUỘC THI
           ------------------------------------------------------------------ */}
        {activeTab === 'activities' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
              <div
                role="group"
                aria-label="Lọc mục hoạt động"
                className="flex flex-wrap items-center gap-2"
              >
                {(
                  [
                    { id: 'ALL', label: 'Tất cả hoạt động' },
                    {
                      id: 'EVENTS',
                      label: `Sự kiện của tôi (${registeredEvents.length + personalCerts.length})`,
                    },
                    {
                      id: 'QUIZ',
                      label: `Cuộc thi trực tuyến (${ONLINE_CONTESTS.length})`,
                    },
                  ] as const
                ).map((item) => {
                  const active = activitySubFilter === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setActivitySubFilter(item.id)}
                      className={`min-h-[44px] sm:min-h-[36px] px-4 py-1.5 rounded-full text-xs font-bold font-eiu-display cursor-pointer transition-colors ${
                        active
                          ? 'bg-[#C10230] text-white'
                          : 'bg-slate-100 text-[#133F68] hover:bg-[#EAE3D2]'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <Link
                href="/su-kien"
                className="min-h-[44px] sm:min-h-0 inline-flex items-center gap-1.5 text-xs font-bold text-[#0054A6] hover:text-[#C10230] font-eiu-display"
              >
                <span>Khám phá sự kiện đang mở</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {activitySubFilter !== 'QUIZ' && (
              <div className="space-y-6">
                {/* 1. Vé QR sự kiện đã đăng ký */}
                <section className="bg-white border border-slate-200 border-t-2 border-t-[#0054A6]">
                  <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-2">
                    <h2 className="text-base font-bold text-[#133F68] font-eiu-display">
                      Vé QR sự kiện đã đăng ký ({registeredEvents.length})
                    </h2>
                    <button
                      type="button"
                      onClick={() => setQrModalOpen(true)}
                      className="text-xs font-bold text-[#0054A6] hover:text-[#C10230] cursor-pointer"
                    >
                      Mở QR Hội viên
                    </button>
                  </div>

                  {registeredEvents.length > 0 ? (
                    <div className="divide-y divide-slate-200">
                      {registeredEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-start gap-4 min-w-0">
                            <div className="border-2 border-[#133F68] p-1 bg-white shrink-0">
                              <DeterministicQrCode
                                value={`CHECKIN:${ev.id}:${currentPersona.studentId}`}
                                size={64}
                                label={`Vé QR sự kiện ${ev.title}`}
                              />
                            </div>
                            <div className="space-y-1 text-xs min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="px-2 py-0.5 bg-[#51803A] text-white text-[11px] font-bold">
                                  Đã đăng ký
                                </span>
                                <span className="px-2 py-0.5 bg-[#EAE3D2] text-[#133F68] text-[11px] font-bold font-eiu-serif">
                                  +{ev.baseVolunteerDays.toFixed(1)} ngày TN
                                </span>
                                {ev.hasTrainingPoints && (
                                  <span className="px-2 py-0.5 bg-[#FCB900] text-[#02294E] text-[11px] font-bold font-eiu-serif">
                                    +{ev.trainingPoints ?? 1} ĐRL
                                  </span>
                                )}
                              </div>
                              <h3 className="text-sm font-bold text-[#133F68] font-eiu-display leading-snug">
                                {ev.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-600">
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-[#8E6D3E]" />
                                  {ev.location}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-[#0054A6]" />
                                  {new Date(ev.startTime).toLocaleDateString('vi-VN')}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap sm:flex-col items-stretch sm:items-end gap-2 shrink-0">
                            <Link
                              href={`/su-kien?event=${encodeURIComponent(ev.id)}`}
                              className="min-h-[44px] sm:min-h-[36px] inline-flex items-center justify-center gap-1 px-3.5 py-1.5 bg-[#133F68] hover:bg-[#0054A6] text-white text-xs font-bold uppercase font-eiu-display"
                            >
                              <span>Chi tiết</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleCancelRegisteredEvent(ev.id)}
                              className="min-h-[44px] sm:min-h-[34px] px-3 py-1 border border-slate-300 hover:border-[#C10230] text-slate-700 hover:text-[#C10230] text-[11px] font-bold uppercase font-eiu-display cursor-pointer"
                            >
                              Hủy đăng ký
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-xs sm:text-[13px] text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span>
                        Chưa có vé sự kiện nào đang chờ điểm danh. Đăng ký tham gia sự kiện tại EIU để nhận mã QR tại đây.
                      </span>
                      <Link
                        href="/su-kien"
                        className="min-h-[44px] sm:min-h-[38px] inline-flex items-center gap-1.5 px-4 py-2 bg-[#133F68] hover:bg-[#0054A6] text-white text-xs font-bold uppercase font-eiu-display shrink-0"
                      >
                        <span>Mở Lịch Sự kiện</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </section>

                {/* 2. Lịch sử hoạt động đã công nhận + Đối soát điểm danh */}
                <section className="bg-white border border-slate-200 border-t-2 border-t-[#133F68]">
                  <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-base font-bold text-[#133F68] font-eiu-display">
                      Lịch sử hoạt động đã công nhận ({personalCerts.length})
                    </h2>
                    <button
                      type="button"
                      onClick={() =>
                        setSupportModalState({
                          open: true,
                          prefillCategory:
                            'Quy đổi Ngày tình nguyện và Cấp Giấy chứng nhận',
                          prefillContent:
                            'Tôi đã tham gia quét QR điểm danh sự kiện nhưng chưa thấy cập nhật trên hệ thống. Nhờ Ban Kiểm tra hỗ trợ đối soát: ',
                        })
                      }
                      className="min-h-[40px] sm:min-h-[34px] px-3 py-1 border border-slate-300 hover:border-[#0054A6] text-[#133F68] text-xs font-semibold cursor-pointer"
                    >
                      Báo thiếu điểm danh
                    </button>
                  </div>

                  {personalCerts.length > 0 ? (
                    <div className="divide-y divide-slate-200 text-xs sm:text-[13px]">
                      {personalCerts.map((cert) => (
                        <div
                          key={cert.id}
                          className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <h3 className="font-bold text-[#133F68] font-eiu-display">
                              {cert.eventTitle}
                            </h3>
                            <div className="text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                              <span>{cert.roleTitle}</span>
                              <span className="font-eiu-serif font-bold text-[#51803A]">
                                +{cert.volunteerDays.toFixed(1)} ngày tình nguyện
                              </span>
                              <span className="font-eiu-serif text-slate-500">
                                {cert.decisionNumber} ({cert.decisionDate})
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setSupportModalState({
                                open: true,
                                prefillCategory:
                                  'Quy đổi Ngày tình nguyện và Cấp Giấy chứng nhận',
                                prefillContent: `Đề nghị đối soát thông tin điểm danh / ngày tình nguyện cho chương trình "${cert.eventTitle}" (Mã GCN: ${cert.certCode}): `,
                              })
                            }
                            className="min-h-[40px] sm:min-h-[34px] px-3.5 py-1.5 border border-slate-300 hover:border-[#0054A6] text-[#133F68] text-xs font-semibold shrink-0 cursor-pointer self-start sm:self-center"
                          >
                            Đối soát điểm danh
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-xs text-slate-600">
                      Chưa ghi nhận hoạt động công nhận nào trong học kỳ này.
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* 3. Cuộc thi trắc nghiệm trực tuyến */}
            {activitySubFilter !== 'EVENTS' && (
              <section className="space-y-4">
                <div className="bg-white border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {(
                      [
                        { id: 'ALL', label: `Tất cả (${ONLINE_CONTESTS.length})` },
                        { id: 'OPEN', label: 'Đang mở thi' },
                        { id: 'PASSED', label: `Đã đạt (${passedContests.length})` },
                        { id: 'ENDED', label: 'Đã kết thúc' },
                      ] as const
                    ).map((pill) => {
                      const active = portalQuizFilter === pill.id;
                      return (
                        <button
                          key={pill.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setPortalQuizFilter(pill.id)}
                          className={`min-h-[40px] sm:min-h-[34px] px-3.5 py-1.5 rounded-full text-xs font-bold font-eiu-display cursor-pointer transition-colors ${
                            active
                              ? 'bg-[#133F68] text-white'
                              : 'bg-slate-100 text-[#133F68] hover:bg-[#EAE3D2]'
                          }`}
                        >
                          {pill.label}
                        </button>
                      );
                    })}
                  </div>

                  <Link
                    href="/cuoc-thi"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0054A6] hover:text-[#C10230] font-eiu-display"
                  >
                    <span>Trang Cuộc thi đầy đủ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {(() => {
                  const visibleContests = ONLINE_CONTESTS.filter((c) => {
                    const meta = getContestCardMeta(c);
                    if (portalQuizFilter === 'OPEN') return meta.isOpen;
                    if (portalQuizFilter === 'PASSED')
                      return Boolean(contestAttempts[c.id]?.passed);
                    if (portalQuizFilter === 'ENDED')
                      return meta.label === 'Đã kết thúc';
                    return true;
                  });

                  if (visibleContests.length === 0) {
                    return (
                      <div className="bg-white border border-slate-200 p-8 text-center space-y-3">
                        <p className="text-sm font-bold text-[#133F68] font-eiu-display">
                          Chưa có cuộc thi nào trong mục lọc này
                        </p>
                        <button
                          type="button"
                          onClick={() => setPortalQuizFilter('ALL')}
                          className="min-h-[44px] sm:min-h-[38px] px-4 py-2 bg-[#133F68] text-white text-xs font-bold rounded-full font-eiu-display cursor-pointer"
                        >
                          Xem tất cả cuộc thi
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {visibleContests.map((contest) => (
                        <ContestCard
                          key={contest.id}
                          contest={contest}
                          attempt={contestAttempts[contest.id]}
                          onOpenModal={setActiveModalContest}
                        />
                      ))}
                    </div>
                  );
                })()}
              </section>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------
            TAB 5: KHO GIẤY CHỨNG NHẬN VÀ BẢNG TỔNG HỢP NGOẠI KHÓA
           ------------------------------------------------------------------ */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <section className="bg-white border border-slate-200 border-t-2 border-t-[#133F68] p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-[#133F68] font-eiu-display">
                  Kho Giấy chứng nhận điện tử ({personalCerts.length})
                </h2>
                <p className="text-xs sm:text-[13px] text-slate-600">
                  Tổng ngày tình nguyện từ các quyết định công nhận:{' '}
                  <strong className="font-eiu-serif text-[#51803A]">
                    +{certVolunteerDays.toFixed(1)} ngày
                  </strong>{' '}
                  • Toàn bộ giấy chứng nhận có mã QR xác thực chống làm giả.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <Link
                  href={`/tra-cuu-gcn?q=${encodeURIComponent(
                    currentPersona.studentId !== '-' ? currentPersona.studentId : ''
                  )}`}
                  className="min-h-[44px] sm:min-h-[38px] px-4 py-2 border border-slate-300 hover:border-[#133F68] text-[#133F68] text-xs font-bold font-eiu-display inline-flex items-center gap-1.5"
                >
                  <span>Cổng tra cứu công khai</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => setTranscriptOpen(true)}
                  className="min-h-[44px] sm:min-h-[38px] px-5 py-2 bg-[#133F68] hover:bg-[#0054A6] text-white text-xs font-bold uppercase tracking-wider font-eiu-display inline-flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#FCB900]" />
                  <span>Xuất Bảng tổng hợp Hoạt động Ngoại khóa</span>
                </button>
              </div>
            </section>

            {personalCerts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {personalCerts.map((cert) => (
                  <article
                    key={cert.id}
                    className="bg-white border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-2.5 py-0.5 bg-[#133F68] text-white font-eiu-serif font-bold">
                          {cert.certCode}
                        </span>
                        <span className="font-eiu-serif text-[#0054A6] font-bold">
                          {cert.decisionNumber} ({cert.decisionDate})
                        </span>
                        <span className="px-2 py-0.5 bg-[#EAE3D2] text-[#133F68] font-eiu-serif font-bold">
                          +{cert.volunteerDays.toFixed(1)} ngày TN
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-[#133F68] font-eiu-display">
                        {cert.eventTitle}
                      </h3>

                      <div className="text-xs text-slate-600">
                        Vai trò: <strong>{cert.roleTitle}</strong> • Đơn vị:{' '}
                        <span>{cert.unitName}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setPreviewCert(cert)}
                        className="min-h-[44px] sm:min-h-[38px] px-4 py-2 bg-[#0054A6] hover:bg-[#133F68] text-white text-xs font-bold uppercase tracking-wider font-eiu-display inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Xem Giấy chứng nhận</span>
                      </button>

                      <Link
                        href={`/tra-cuu-gcn?q=${encodeURIComponent(cert.certCode)}`}
                        className="min-h-[44px] sm:min-h-[38px] px-3.5 py-2 border border-slate-300 hover:border-[#133F68] text-[#133F68] text-xs font-bold inline-flex items-center gap-1"
                      >
                        <span>Xác thực QR</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 p-8 text-center space-y-2 text-xs text-slate-600">
                <p>Chưa có Giấy chứng nhận nào được ban hành cho tài khoản này.</p>
                <p>
                  Sau khi hoàn tất sự kiện, Ban Thư ký sẽ ban hành Quyết định và kích hoạt Giấy chứng nhận trong vòng 07 ngày làm việc.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ====================================================================
          CÁC HỘP THOẠI CHỨC NĂNG (MODALS)
         ==================================================================== */}
      <MemberQrPassModal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        persona={currentPersona}
        facultyName={facultyMeta.nameVi}
        unitName={primaryBranch.name}
      />

      <SupportTicketModal
        open={supportModalState.open}
        onClose={() => setSupportModalState({ open: false })}
        personaName={currentPersona.fullName}
        prefillCategory={supportModalState.prefillCategory}
        prefillContent={supportModalState.prefillContent}
        voiceTickets={portalState.voiceTickets}
        onSubmitTicket={handleSubmitTicket}
      />

      <AwardApplicationModal
        program={activeAwardProgram}
        existingApplication={
          activeAwardProgram
            ? portalState.awardApplications.find(
                (a) => a.programId === activeAwardProgram.id
              )
            : undefined
        }
        liveSnapshot={liveSnapshot}
        personalCerts={personalCerts}
        externalEvidences={portalState.externalEvidences}
        onClose={() => setActiveAwardProgram(null)}
        onSubmitApplication={handleSubmitAwardApplication}
        onRequestWithdraw={(appId) => setWithdrawAppId(appId)}
      />

      <CertificateViewerModal
        cert={previewCert}
        onClose={() => setPreviewCert(null)}
      />

      <TranscriptModal
        open={transcriptOpen}
        onClose={() => setTranscriptOpen(false)}
        persona={currentPersona}
        facultyName={facultyMeta.nameVi}
        majorName={currentPersona.majorName || mssvDecoded.majorName}
        branchName={primaryBranch.name}
        activeClubs={activeClubs}
        effectiveGpa={effectiveGpa}
        ethicsScore={ethicsScore}
        totalVolunteerDays={totalVolunteerDays}
        metCriteriaCount={metCriteriaCount}
        personalCerts={personalCerts}
        externalEvidences={portalState.externalEvidences}
      />

      <ContestExamModal
        contest={activeModalContest}
        attempt={
          activeModalContest ? contestAttempts[activeModalContest.id] : undefined
        }
        onClose={() => setActiveModalContest(null)}
        onSaveAttempt={saveContestAttempt}
      />

      <ConfirmDialog
        open={withdrawAppId !== null}
        variant="danger"
        title="Xác nhận rút hồ sơ xét chọn"
        description="Bạn có chắc muốn rút hồ sơ đang chờ sơ duyệt Cấp 1 để cập nhật bổ sung thông tin hoặc minh chứng không?"
        confirmLabel="Rút hồ sơ"
        onCancel={() => setWithdrawAppId(null)}
        onConfirm={handleConfirmWithdrawApplication}
      />
    </div>
  );
}

function StudentPortalSearchBridge() {
  const searchParams = useSearchParams();
  const rawTab = searchParams.get('tab');

  let mappedTab: PortalTab = 'overview';
  let subView: 'gpa' | 'quiz' | 'voice' | undefined;

  switch (rawTab) {
    case 'sv5t':
      mappedTab = 'sv5t';
      break;
    case 'gpa':
      mappedTab = 'sv5t';
      subView = 'gpa';
      break;
    case 'applications':
      mappedTab = 'applications';
      break;
    case 'activities':
      mappedTab = 'activities';
      break;
    case 'quiz':
      mappedTab = 'activities';
      subView = 'quiz';
      break;
    case 'certificates':
    case 'certs':
      mappedTab = 'certificates';
      break;
    case 'voice':
      mappedTab = 'overview';
      subView = 'voice';
      break;
    case 'overview':
    case 'idcard':
    default:
      mappedTab = 'overview';
      break;
  }

  return <StudentPortalContent initialTab={mappedTab} initialSubView={subView} />;
}

export default function StudentPortalPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1200px] mx-auto px-4 py-16 text-center text-sm text-slate-500">
          Đang tải Hồ sơ Hội viên EIU...
        </div>
      }
    >
      <StudentPortalSearchBridge />
    </Suspense>
  );
}
