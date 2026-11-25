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
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useRole } from '@/context/role-context';
import {
  decodeEiuEmail,
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
  getDefaultPortalPersonaState,
  getPortalPersonaState,
  ISSUED_CERTS_KEY,
  PORTAL_STATE_KEY,
  PortalPersonaState,
  REGISTERED_EVENTS_KEY,
  savePortalPersonaState,
  setRegisteredEventIds,
  subscribeStorageSync,
  VoiceTicketRecord,
} from '@/lib/portal-storage';
import { IssuedCertificateRecord, OnlineContestItem } from '@/types';
import {
  ArrowRight,
  Calculator,
  Calendar,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  ExternalLink,
  FileCheck2,
  MapPin,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

type PortalTab = 'sv5t' | 'gpa' | 'certs' | 'quiz' | 'idcard' | 'voice';

const PORTAL_MENU: {
  id: PortalTab;
  label: string;
  title: string;
  subtitle: string;
  badge?: string;
}[] = [
  {
    id: 'sv5t',
    label: 'Sổ tay Sinh viên 5 Tốt',
    title: 'SỔ TAY SINH VIÊN 5 TỐT',
    subtitle: 'Theo dõi tiến độ 05 tiêu chuẩn và trạng thái xét duyệt hồ sơ.',
  },
  {
    id: 'gpa',
    label: 'Máy tính GPA Quý',
    title: 'MÁY TÍNH GPA HỌC CHẾ QUÝ EIU',
    subtitle:
      'Tính điểm trung bình năm học theo tín chỉ và đối chiếu chuẩn Học tập tốt.',
  },
  {
    id: 'certs',
    label: 'Sự kiện và Giấy chứng nhận',
    title: 'SỰ KIỆN ĐÃ ĐĂNG KÝ VÀ GIẤY CHỨNG NHẬN',
    subtitle:
      'Quản lý vé QR sự kiện và danh sách Giấy chứng nhận điện tử cá nhân.',
  },
  {
    id: 'quiz',
    label: 'Cuộc thi Trực tuyến',
    title: 'CUỘC THI TRẮC NGHIỆM TRỰC TUYẾN',
    subtitle:
      'Tham gia các cuộc thi trực tuyến và đồng bộ kết quả vào hồ sơ cá nhân.',
  },
  {
    id: 'idcard',
    label: 'Thẻ Hội viên Điện tử',
    title: 'THẺ HỘI VIÊN ĐIỆN TỬ',
    subtitle: 'Thông tin định danh hội viên và mã QR điểm danh sự kiện.',
  },
  {
    id: 'voice',
    label: 'Hộp thư Lắng nghe',
    title: 'HỘP THƯ LẮNG NGHE SINH VIÊN',
    subtitle: 'Gửi kiến nghị, đề xuất và phản ánh quyền lợi hội viên.',
  },
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

function StudentPortalContent({ initialTab }: { initialTab: PortalTab }) {
  const { currentPersona, activePosition, setPersonaById } = useRole();
  const [tabSelection, setTabSelection] = useState<{
    base: PortalTab;
    current: PortalTab;
  }>({ base: initialTab, current: initialTab });
  const activeTab =
    tabSelection.base === initialTab ? tabSelection.current : initialTab;
  const contentTopRef = useRef<HTMLDivElement>(null);

  const setActiveTab = useCallback(
    (tab: PortalTab, scrollMobile = false) => {
      setTabSelection({ base: initialTab, current: tab });
      if (typeof window !== 'undefined' && window.history) {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
        window.history.replaceState({}, '', url.toString());
      }
      if (scrollMobile && typeof window !== 'undefined' && window.innerWidth < 1024) {
        contentTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [initialTab]
  );

  const emailDecoded = decodeEiuEmail(currentPersona.email);
  const facultyMeta = FACULTY_METADATA[currentPersona.facultyCode];

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
        return { ...defaults, ...stored };
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

  // Đồng bộ sự kiện đã đăng ký từ /su-kien theo từng personaId (hydration-safe)
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

  // Đồng bộ kho E-Certificate (kể cả QĐ mới ký động trên /workspace)
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
    () =>
      allCertificates.filter((c) => c.studentId === currentPersona.studentId),
    [allCertificates, currentPersona.studentId]
  );

  // Tính Ngày tình nguyện thực tế từ QĐ + Hiến máu nhân đạo (khác biệt thực theo từng tài khoản)
  const certVolunteerDays = personalCerts.reduce(
    (sum, c) => sum + c.volunteerDays,
    0
  );
  const bloodDonationBonusDays =
    currentPersona.studentId !== '-' ? 5.0 : 0.0;
  const totalVolunteerDays = certVolunteerDays + bloodDonationBonusDays;
  const isVolunteerQualified = totalVolunteerDays >= 5.0;

  // Đánh giá chuẩn GPA
  const weightedYearGpa = calculateWeightedQuarterGpa(portalState.quarters);
  const cumulativeGpa = Math.min(
    4,
    parseLocaleDecimal(portalState.cumulativeGpaStr)
  );
  const effectiveGpa = Math.max(weightedYearGpa, cumulativeGpa);
  const isGpaQualified = effectiveGpa >= 3.0;

  // Điểm Đạo đức minh họa có khác biệt nhẹ theo tài khoản
  const ethicsScore =
    currentPersona.id === 'student-demo'
      ? 88
      : currentPersona.id === 'staff-01'
      ? 95
      : 92;

  // State Phòng thi Trắc nghiệm Trực tuyến
  const { attempts: contestAttempts, saveAttempt: saveContestAttempt } =
    useContestAttempts();
  const [portalQuizFilter, setPortalQuizFilter] = useState<
    'ALL' | 'OPEN' | 'PASSED' | 'ENDED'
  >('ALL');
  const [activeModalContest, setActiveModalContest] =
    useState<OnlineContestItem | null>(null);

  const passedContests = ONLINE_CONTESTS.filter(
    (c) => contestAttempts[c.id]?.passed
  );
  const passedDaoDucContest = passedContests.find(
    (c) => c.sv5tCriterion === 'Đạo đức tốt'
  );

  // State Hộp thư Lắng nghe & Dialog xác nhận
  const [feedbackRecipient, setFeedbackRecipient] = useState<
    'BKT' | 'BAN_TGPT'
  >('BKT');
  const [feedbackCategory, setFeedbackCategory] = useState(
    'Quy đổi Ngày tình nguyện và Cấp E-Certificate (28/QĐ-HSV)'
  );
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState('');
  const [latestTicketId, setLatestTicketId] = useState<string | null>(null);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  const [sv5tConfirmMode, setSv5tConfirmMode] = useState<
    'submit' | 'withdraw' | null
  >(null);

  const handleQuarterInputChange = (
    index: number,
    field: 'creditsStr' | 'gpaStr',
    rawVal: string
  ) => {
    // Cho phép nhập chuỗi thập phân tự nhiên ("3.", "3.05", "") không nhảy số khi đang gõ
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

  const handleQuarterBlur = (
    index: number,
    field: 'creditsStr' | 'gpaStr'
  ) => {
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

  const handleCancelRegisteredEvent = (eventId: string) => {
    setRegisteredEventIds(
      currentPersona.id,
      registeredEventIds.filter((id) => id !== eventId)
    );
  };

  const metCriteriaCount =
    3 + (isGpaQualified ? 1 : 0) + (isVolunteerQualified ? 1 : 0);
  const currentMenu =
    PORTAL_MENU.find((m) => m.id === activeTab) || PORTAL_MENU[0];

  const sv5tStandards = [
    {
      id: 'ethics',
      dotClass: 'bg-[#133F68]',
      title: '1. Đạo đức tốt',
      subTitle: 'Tư tưởng chính trị và Kỷ luật',
      hardRule: (
        <>
          Điểm rèn luyện năm học:{' '}
          <strong className="font-eiu-serif text-[#133F68]">
            {ethicsScore} / 100
          </strong>{' '}
          (Chuẩn ≥ 80, không vi phạm kỷ luật)
        </>
      ),
      subRule: passedDaoDucContest
        ? `✓ Đạt ${contestAttempts[passedDaoDucContest.id]?.bestScore}% cuộc thi "${passedDaoDucContest.title}"`
        : '✓ Tham gia Hội thi Tìm hiểu Tư tưởng Hồ Chí Minh',
      passed: true,
    },
    {
      id: 'study',
      dotClass: 'bg-[#8E6D3E]',
      title: '2. Học tập tốt',
      subTitle: 'Học thuật và Nghiên cứu khoa học',
      hardRule: (
        <>
          MAX(Năm học {weightedYearGpa.toFixed(2)}, Tích lũy{' '}
          {cumulativeGpa.toFixed(2)}) ={' '}
          <strong className="font-eiu-serif text-[#0054A6]">
            {effectiveGpa.toFixed(2)} / 4.00
          </strong>{' '}
          (Chuẩn ≥ 3.00)
        </>
      ),
      subRule:
        '✓ 01 Tham luận NCKH / Sinh hoạt CLB Học thuật có xác nhận Mentor',
      passed: isGpaQualified,
      failTargetTab: 'gpa' as PortalTab,
      failText: 'CẦN ≥ 3.00 →',
    },
    {
      id: 'physical',
      dotClass: 'bg-[#51803A]',
      title: '3. Thể lực tốt',
      subTitle: 'Rèn luyện thể thao và GDTC',
      hardRule: 'Hoàn thành đủ 03 môn GDTC theo chương trình đào tạo EIU',
      subRule:
        '✓ Đạt Giấy chứng nhận “Sinh viên Khỏe” cấp Trường 2026',
      passed: true,
    },
    {
      id: 'volunteer',
      dotClass: 'bg-[#0054A6]',
      title: '4. Tình nguyện tốt',
      subTitle: 'Cống hiến và Ngày tình nguyện',
      hardRule: (
        <>
          Tích lũy:{' '}
          <strong className="font-eiu-serif text-[#133F68]">
            {totalVolunteerDays.toFixed(1)} / 5.0 ngày
          </strong>{' '}
          ({personalCerts.length} GCN + Hiến máu{' '}
          {bloodDonationBonusDays.toFixed(1)} ngày)
        </>
      ),
      subRule:
        '✓ Tham gia Ngày hội Hiến máu tình nguyện EIU (+5.0 ngày) và các hoạt động Đoàn – Hội',
      passed: isVolunteerQualified,
    },
    {
      id: 'integration',
      dotClass: 'bg-[#B44625]',
      title: '5. Hội nhập tốt',
      subTitle: 'Tiếng Anh và Kỹ năng toàn cầu',
      hardRule:
        'Hoàn thành 01 khóa Kỹ năng thực hành xã hội + 01 hoạt động Hội nhập',
      subRule:
        '✓ Đạt chuẩn Tiếng Anh B1 / Giao lưu sinh viên quốc tế tại EIU',
      passed: true,
    },
  ];

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      {/* COMMAND HEADER HỘI VIÊN (1200PX) */}
      <section className="bg-[#133F68] eiu-arch-pattern text-white border-b-3 border-[#A68556]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-7 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#00BCFF] text-[#02294E] text-[11px] font-bold uppercase tracking-wider font-eiu-display">
                  KHÔNG GIAN HỘI VIÊN
                </span>
                <span className="font-eiu-serif text-xs text-[#FCB900] font-bold">
                  Phân quyền hiện tại: Cấp {activePosition.roleLevel}/6
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-eiu-display text-balance">
                {currentPersona.fullName}{' '}
                <span className="text-sm font-eiu-serif font-normal text-[#DED1BE] whitespace-nowrap">
                  (
                  {currentPersona.studentId !== '-'
                    ? `MSSV: ${currentPersona.studentId}`
                    : 'Chuyên viên CTSV'}
                  )
                </span>
              </h1>
              <div className="text-xs text-[#DED1BE] flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>{facultyMeta.nameVi}</span>
                <span aria-hidden="true">•</span>
                <span>
                  {activePosition.positionTitle} ({activePosition.unitName})
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {currentPersona.id !== 'student-demo' ? (
                <button
                  type="button"
                  onClick={() => setPersonaById('student-demo')}
                  className="min-h-[44px] sm:min-h-[38px] px-3.5 py-2 bg-white/12 hover:bg-white/20 border border-white/25 text-white text-xs font-semibold cursor-pointer"
                >
                  Chuyển tài khoản Sinh viên
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setPersonaById('staff-01')}
                  className="min-h-[44px] sm:min-h-[38px] px-3.5 py-2 bg-white/12 hover:bg-white/20 border border-white/25 text-white text-xs font-semibold cursor-pointer"
                >
                  Chuyển tài khoản Ban Chấp hành
                </button>
              )}
              <Link
                href="/su-kien"
                className="min-h-[44px] sm:min-h-[38px] inline-flex items-center px-4 py-2 bg-[#C10230] hover:bg-[#9E0024] text-white text-xs font-bold uppercase tracking-wider font-eiu-display"
              >
                Đăng ký Sự kiện Mới
              </Link>
            </div>
          </div>

          {/* 04 Ô KPI Cá nhân */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setActiveTab('sv5t', true)}
              className="bg-[#02294E]/85 border border-white/15 hover:border-[#00BCFF] p-3.5 text-left cursor-pointer min-h-[84px]"
            >
              <div className="text-[11px] font-eiu-serif uppercase text-[#DED1BE]">
                Tiêu chuẩn SV5T đạt
              </div>
              <div className="text-xl font-extrabold font-eiu-serif text-[#00BCFF] mt-0.5 tabular-nums">
                {String(metCriteriaCount).padStart(2, '0')} / 05
              </div>
              <div className="text-[11px] text-white/85 mt-0.5">
                Xét duyệt 3 cấp
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gpa', true)}
              className="bg-[#02294E]/85 border border-white/15 hover:border-[#00BCFF] p-3.5 text-left cursor-pointer min-h-[84px]"
            >
              <div className="text-[11px] font-eiu-serif uppercase text-[#DED1BE]">
                GPA Xét chọn tốt nhất
              </div>
              <div
                className={`text-xl font-extrabold font-eiu-serif mt-0.5 tabular-nums ${
                  isGpaQualified ? 'text-[#FCB900]' : 'text-rose-300'
                }`}
              >
                {effectiveGpa.toFixed(2)} / 4.00
              </div>
              <div className="text-[11px] text-white/85 mt-0.5">
                {isGpaQualified
                  ? '✓ Đạt chuẩn ≥ 3.00'
                  : 'Chưa chạm ngưỡng 3.00'}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('certs', true)}
              className="bg-[#02294E]/85 border border-white/15 hover:border-[#00BCFF] p-3.5 text-left cursor-pointer min-h-[84px]"
            >
              <div className="text-[11px] font-eiu-serif uppercase text-[#DED1BE]">
                Ngày Tình nguyện Năm học
              </div>
              <div className="text-xl font-extrabold font-eiu-serif text-emerald-300 mt-0.5 tabular-nums">
                {totalVolunteerDays.toFixed(1)} / 5.0 ngày
              </div>
              <div className="text-[11px] text-white/85 mt-0.5">
                {registeredEvents.length} sự kiện • {personalCerts.length} GCN
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('quiz', true)}
              className="bg-[#02294E]/85 border border-white/15 hover:border-[#00BCFF] p-3.5 text-left cursor-pointer min-h-[84px]"
            >
              <div className="text-[11px] font-eiu-serif uppercase text-[#DED1BE]">
                Kho E-Cert và Quiz Số
              </div>
              <div className="text-xl font-extrabold font-eiu-serif text-white mt-0.5 tabular-nums">
                {personalCerts.length} GCN • {passedContests.length}/
                {ONLINE_CONTESTS.length} Thi
              </div>
              <div className="text-[11px] text-white/85 mt-0.5">
                Xác thực QR trực tuyến
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* LƯỚI RỘNG 3/9 (MAX-W-1200PX) */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 lg:pt-8">
        {/* Thanh chuyển phân hệ ngang gọn cho Mobile (< 1024px) */}
        <div
          role="group"
          aria-label="Chọn phân hệ Sổ tay Hội viên"
          className="lg:hidden flex items-center gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1"
        >
          {PORTAL_MENU.map((item) => {
            const isSelected = activeTab === item.id;
            return (
              <button
                key={`mob-${item.id}`}
                type="button"
                aria-current={isSelected ? 'page' : undefined}
                onClick={() => setActiveTab(item.id, true)}
                className={`min-h-[44px] px-3.5 py-2 text-xs font-bold whitespace-nowrap shrink-0 border transition-colors cursor-pointer font-eiu-display ${
                  isSelected
                    ? 'bg-[#C10230] text-white border-[#C10230]'
                    : 'bg-[#EAE3D2] text-[#133F68] border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI (3/12): Menu dọc Desktop */}
          <aside
            aria-label="Phân hệ Sổ tay Hội viên"
            className="hidden lg:block lg:col-span-3 space-y-5"
          >
            <div className="bg-white border border-slate-200">
              <div className="bg-[#133F68] text-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider font-eiu-display">
                Sổ tay và Tiện ích Hội viên
              </div>
              <div className="divide-y divide-white">
                {PORTAL_MENU.map((item) => {
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
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
                          className={`text-[11px] font-eiu-serif px-1.5 py-0.5 font-bold ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-[#133F68] text-white'
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
          </aside>

          {/* CỘT PHẢI (9/12): Không gian chức năng chi tiết */}
          <div
            ref={contentTopRef}
            className="lg:col-span-9 space-y-6 scroll-mt-24"
          >
            <div className="bg-white border border-slate-200 border-t-2 border-t-[#133F68] p-5">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display text-balance">
                {currentMenu.title}
              </h2>
              <p className="text-[13.5px] text-slate-600 mt-1 leading-relaxed max-w-prose">
                {currentMenu.subtitle}
              </p>
            </div>

            {/* ============================================================
                MODULE 1: SỔ TAY KỸ THUẬT SỐ SINH VIÊN 5 TỐT (09/QĐ-HSV 2026)
               ============================================================ */}
            {activeTab === 'sv5t' && (
              <div className="space-y-6">
                {/* Thanh Tiến trình Xét duyệt 3 Cấp nhất quán tuyệt đối */}
                <div className="bg-white border border-slate-200 p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#133F68] font-eiu-display">
                      Tiến trình Xét duyệt 03 Cấp
                    </div>
                    <span className="px-2.5 py-0.5 bg-[#0054A6]/10 text-[#0054A6] font-eiu-serif text-[11px] font-bold">
                      {portalState.dossierSubmitted
                        ? `TRẠNG THÁI: ĐÃ NỘP LÊN CẤP 1 (${
                            portalState.submittedAt || 'ĐÃ GỬI'
                          })`
                        : 'TRẠNG THÁI: CHƯA NỘP — ĐANG HOÀN THIỆN MINH CHỨNG'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    {[
                      {
                        lvl: 'CẤP 01 — CƠ SỞ HỘI',
                        actor: 'BCH Chi hội / BCN CLB sơ duyệt',
                        active: portalState.dossierSubmitted,
                        statusText: portalState.dossierSubmitted
                          ? 'Đang sơ duyệt'
                          : 'Chờ nộp hồ sơ',
                      },
                      {
                        lvl: 'CẤP 02 — BAN CHUYÊN MÔN',
                        actor: 'Ban TG-PT và Ban TC-XDH thẩm định chéo',
                        active: false,
                        statusText: portalState.dossierSubmitted
                          ? 'Chờ chuyển từ Cấp 1'
                          : 'Chưa bắt đầu',
                      },
                      {
                        lvl: 'CẤP 03 — THƯỜNG TRỰC HỘI',
                        actor: 'Ban Thư ký chốt duyệt và Lọc Top 10%',
                        active: false,
                        statusText: portalState.dossierSubmitted
                          ? 'Chờ thẩm định'
                          : 'Chưa bắt đầu',
                      },
                    ].map((st) => (
                      <div
                        key={st.lvl}
                        className={`p-3.5 border transition-colors ${
                          st.active
                            ? 'bg-[#0054A6]/[0.05] border-[#0054A6]'
                            : 'bg-[#F8FAFC] border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5 flex-wrap">
                          <span className="font-eiu-serif font-bold text-[#133F68]">
                            {st.lvl}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 whitespace-nowrap ${
                              st.active
                                ? 'bg-[#0054A6] text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {st.statusText}
                          </span>
                        </div>
                        <div className="text-slate-600 mt-1.5">{st.actor}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Card List (< 768px) cho 05 Tiêu chuẩn SV5T */}
                <div className="md:hidden space-y-3">
                  {sv5tStandards.map((item) => (
                    <div
                      key={`mob-${item.id}`}
                      className="bg-white border border-slate-300 border-t-3 border-t-[#133F68] p-4 space-y-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${item.dotClass} shrink-0`}
                            aria-hidden="true"
                          />
                          <span className="font-bold text-sm text-[#133F68] font-eiu-display">
                            {item.title}
                          </span>
                        </div>
                        {item.passed ? (
                          <span className="px-2 py-0.5 bg-[#51803A]/10 text-[#2E521D] border border-[#51803A]/30 font-eiu-serif text-[11px] font-bold whitespace-nowrap">
                            ✓ ĐẠT CHUẨN
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              item.failTargetTab &&
                              setActiveTab(item.failTargetTab, true)
                            }
                            className="px-2.5 py-1 bg-[#C10230]/10 text-[#9E0024] border border-[#C10230]/30 font-eiu-serif text-[11px] font-bold underline cursor-pointer whitespace-nowrap"
                          >
                            {item.failText}
                          </button>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-eiu-display">
                        {item.subTitle}
                      </div>
                      <div className="bg-[#F8FAFC] border border-slate-200 p-2.5 space-y-1">
                        <div>
                          <strong className="text-[#133F68]">Chuẩn cứng:</strong>{' '}
                          {item.hardRule}
                        </div>
                        <div className="text-slate-700">
                          <strong className="text-[#133F68]">Tiêu chí phụ:</strong>{' '}
                          {item.subRule}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table (>= 768px) cho 05 Tiêu chuẩn SV5T */}
                <div className="hidden md:block bg-white border border-slate-300 overflow-x-auto">
                  <table className="eiu-table min-w-[720px]">
                    <thead>
                      <tr>
                        <th className="w-56">Tiêu chuẩn SV5T</th>
                        <th>Chuẩn cứng bắt buộc</th>
                        <th>Tiêu chí phụ đã tích lũy</th>
                        <th className="w-36 text-right">Kết luận</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sv5tStandards.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${item.dotClass} shrink-0`}
                                aria-hidden="true"
                              />
                              <span className="font-bold text-[#133F68]">
                                {item.title}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-600 pl-4.5 block font-eiu-display">
                              {item.subTitle}
                            </span>
                          </td>
                          <td className="text-xs">{item.hardRule}</td>
                          <td className="text-xs text-slate-700">{item.subRule}</td>
                          <td className="text-right whitespace-nowrap">
                            {item.passed ? (
                              <span className="inline-block px-2 py-0.5 bg-[#51803A]/10 text-[#2E521D] border border-[#51803A]/30 font-eiu-serif text-xs font-bold">
                                ✓ ĐẠT CHUẨN
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  item.failTargetTab &&
                                  setActiveTab(item.failTargetTab, true)
                                }
                                className="inline-block px-2 py-0.5 bg-[#C10230]/10 text-[#9E0024] border border-[#C10230]/30 font-eiu-serif text-xs font-bold underline cursor-pointer"
                              >
                                {item.failText}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Hành động Nộp / Rút hồ sơ SV5T (có ConfirmDialog xác nhận) */}
                <div className="bg-white border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-700 max-w-prose">
                    {metCriteriaCount === 5 ? (
                      <>
                        Đã đạt đủ <strong>05/05 tiêu chuẩn</strong> để nộp hồ sơ
                        xét chọn danh hiệu{' '}
                        <strong>Sinh viên 5 Tốt cấp Trường</strong>.
                      </>
                    ) : (
                      <>
                        Hiện đạt{' '}
                        <strong>{metCriteriaCount}/05 tiêu chuẩn</strong>. Vui
                        lòng hoàn thiện các tiêu chuẩn còn thiếu trước khi gửi
                        hồ sơ.
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {!portalState.dossierSubmitted ? (
                      <button
                        type="button"
                        disabled={metCriteriaCount < 5}
                        title={
                          metCriteriaCount < 5
                            ? 'Cần đạt đủ 05/05 tiêu chuẩn SV5T mới có thể gửi xét duyệt Cấp 1'
                            : 'Gửi hồ sơ xét duyệt Cấp 1 tới BCH Chi hội'
                        }
                        onClick={() => setSv5tConfirmMode('submit')}
                        className={`min-h-[44px] sm:min-h-[38px] px-5 py-2 text-xs font-bold uppercase tracking-wider font-eiu-display ${
                          metCriteriaCount < 5
                            ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                            : 'bg-[#0054A6] hover:bg-[#133F68] text-white cursor-pointer'
                        }`}
                      >
                        Gửi Hồ sơ Xét duyệt Cấp 1
                      </button>
                    ) : (
                      <>
                        <span className="min-h-[44px] sm:min-h-[38px] inline-flex items-center px-4 py-2 bg-[#51803A] text-white text-xs font-bold uppercase tracking-wider font-eiu-display">
                          ✓ Đã gửi hồ sơ Cấp 1
                        </span>
                        <button
                          type="button"
                          onClick={() => setSv5tConfirmMode('withdraw')}
                          className="min-h-[44px] sm:min-h-[38px] px-4 py-2 bg-white hover:bg-red-50 border border-slate-300 hover:border-[#C10230] text-slate-700 hover:text-[#C10230] text-xs font-bold uppercase tracking-wider cursor-pointer font-eiu-display"
                        >
                          Rút hồ sơ để bổ sung
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                MODULE 2: MÁY TÍNH GPA HỌC CHẾ QUÝ EIU
               ============================================================ */}
            {activeTab === 'gpa' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200">
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 font-eiu-display">
                    <Calculator className="w-4 h-4 text-[#00BCFF]" />
                    <span>
                      Nhập điểm 03 Học kỳ Quý chính (Thu – Đông – Xuân) và Học
                      kỳ Hè
                    </span>
                  </div>

                  <div className="divide-y divide-slate-200 text-xs">
                    {portalState.quarters.map((q, idx) => (
                      <div
                        key={q.quarterName}
                        className="grid grid-cols-1 sm:grid-cols-12 p-4 items-center gap-3"
                      >
                        <div className="sm:col-span-6 font-bold text-[#133F68]">
                          {q.quarterName}
                        </div>
                        <div className="sm:col-span-3">
                          <label
                            htmlFor={`q-cred-${idx}`}
                            className="block text-[11px] text-slate-600 font-semibold mb-1"
                          >
                            Số tín chỉ tích lũy
                          </label>
                          <input
                            id={`q-cred-${idx}`}
                            name={`quarterCredits_${idx}`}
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
                            className="w-full h-11 sm:h-9 px-3 border border-slate-300 rounded font-eiu-serif text-base sm:text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0054A6]"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label
                            htmlFor={`q-gpa-${idx}`}
                            className="block text-[11px] text-slate-600 font-semibold mb-1"
                          >
                            GPA Học kỳ (Thang 4.00)
                          </label>
                          <input
                            id={`q-gpa-${idx}`}
                            name={`quarterGpa_${idx}`}
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
                            placeholder="0.00"
                            className="w-full h-11 sm:h-9 px-3 border border-slate-300 rounded font-eiu-serif text-base sm:text-xs font-bold text-[#0054A6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0054A6]"
                          />
                        </div>
                      </div>
                    ))}

                    {/* Ô nhập GPA Tích lũy toàn khóa */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 p-4 items-center gap-3 bg-[#F8FAFC]">
                      <div className="sm:col-span-6 space-y-0.5">
                        <label
                          htmlFor="cum-gpa-input"
                          className="font-bold text-[#133F68] block"
                        >
                          GPA Tích lũy toàn khóa hiện tại (Cumulative GPA)
                        </label>
                        <div className="text-[11px] text-slate-600">
                          Hệ thống tự động ưu tiên lấy giá trị cao hơn giữa GPA
                          năm học và GPA tích lũy
                        </div>
                      </div>
                      <div className="sm:col-span-6">
                        <input
                          id="cum-gpa-input"
                          name="cumulativeGpa"
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
                          placeholder="0.00"
                          className="w-full sm:w-48 h-11 sm:h-9 px-3 border-2 border-[#0054A6] rounded font-eiu-serif text-base sm:text-xs font-bold text-[#133F68] bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0054A6]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hộp đối chiếu kết quả MAX(Năm học, Tích lũy) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-slate-200 p-4">
                    <div className="text-[11px] font-bold uppercase text-slate-600 font-eiu-display">
                      GPA Năm học (Gia quyền)
                    </div>
                    <div className="text-2xl font-extrabold font-eiu-serif text-[#133F68] mt-1 tabular-nums">
                      {weightedYearGpa.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      Tổng{' '}
                      {portalState.quarters.reduce(
                        (sum, item) =>
                          sum + Math.min(30, parseLocaleDecimal(item.creditsStr)),
                        0
                      )}{' '}
                      tín chỉ trong năm
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-4">
                    <div className="text-[11px] font-bold uppercase text-slate-600 font-eiu-display">
                      GPA Tích lũy Hiện tại
                    </div>
                    <div className="text-2xl font-extrabold font-eiu-serif text-[#133F68] mt-1 tabular-nums">
                      {cumulativeGpa.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      Theo bảng điểm Portal EIU
                    </div>
                  </div>

                  <div
                    className={`border-2 p-4 ${
                      isGpaQualified
                        ? 'bg-emerald-50 border-[#51803A]'
                        : 'bg-[#FFF9F0] border-[#C10230]'
                    }`}
                  >
                    <div className="text-[11px] font-bold uppercase text-[#133F68] font-eiu-display">
                      Mức GPA Xét SV5T (MAX)
                    </div>
                    <div
                      className={`text-2xl font-extrabold font-eiu-serif mt-1 tabular-nums ${
                        isGpaQualified ? 'text-emerald-800' : 'text-[#C10230]'
                      }`}
                    >
                      {effectiveGpa.toFixed(2)} / 4.00
                    </div>
                    <div className="text-xs font-bold mt-1">
                      {isGpaQualified
                        ? '✓ ĐẠT CHUẨN CỨNG ≥ 3.00'
                        : `Thiếu ${(3.0 - effectiveGpa).toFixed(2)} để đạt 3.00`}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                MODULE 3: SỰ KIỆN ĐÃ ĐĂNG KÝ (VÉ QR) VÀ KHO E-CERTIFICATE
               ============================================================ */}
            {activeTab === 'certs' && (
              <div className="space-y-6">
                {/* 1. Vé QR Check-in Sự kiện Đã Đăng ký đồng bộ trực tiếp từ /su-kien */}
                <div className="bg-white border-2 border-[#0054A6]">
                  <div className="bg-[#0054A6] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex flex-wrap items-center justify-between gap-2 font-eiu-display">
                    <span>
                      Vé QR Check-in Sự kiện Đã Đăng ký ({registeredEvents.length})
                    </span>
                    <Link
                      href="/su-kien"
                      className="text-[11px] text-white underline underline-offset-4 hover:text-[#FCB900]"
                    >
                      Đăng ký thêm sự kiện →
                    </Link>
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
                                <span className="px-2 py-0.5 bg-[#51803A] text-white text-[11px] font-bold uppercase font-eiu-display">
                                  ĐÃ ĐĂNG KÝ
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
                                  {new Date(ev.startTime).toLocaleDateString(
                                    'vi-VN'
                                  )}
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
                    <div className="p-6 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <p className="max-w-prose leading-relaxed">
                        Tài khoản <strong>{currentPersona.fullName}</strong> chưa
                        đăng ký sự kiện sắp diễn ra nào. Khi bạn bấm{' '}
                        <strong>&ldquo;Đăng ký ngay&rdquo;</strong> tại trang Sự
                        kiện, vé QR Check-in sẽ tự động xuất hiện tại đây.
                      </p>
                      <Link
                        href="/su-kien"
                        className="min-h-[44px] sm:min-h-[38px] inline-flex items-center gap-1.5 px-4 py-2 bg-[#133F68] hover:bg-[#0054A6] text-white text-xs font-bold uppercase tracking-wider shrink-0 font-eiu-display"
                      >
                        <span>Mở Lịch Sự kiện</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* 2. Kho Giấy chứng nhận Điện tử Đã Ban hành Quyết định */}
                <div className="bg-white border border-slate-200">
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex flex-wrap items-center justify-between gap-2 font-eiu-display">
                    <span className="inline-flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-[#FCB900]" />
                      <span>
                        Giấy chứng nhận Điện tử Đã Ban hành Quyết định (
                        {personalCerts.length})
                      </span>
                    </span>
                    <Link
                      href="/tra-cuu-gcn?q=32/QĐ-HSV"
                      className="text-[11px] text-[#00BCFF] hover:underline"
                    >
                      Tra cứu toàn trường →
                    </Link>
                  </div>

                  {personalCerts.length > 0 ? (
                    <div className="divide-y divide-slate-200">
                      {personalCerts.map((cert) => (
                        <div
                          key={cert.id}
                          className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="px-2 py-0.5 bg-[#133F68] text-white font-eiu-serif font-bold">
                                {cert.certCode}
                              </span>
                              <span className="font-eiu-serif text-[#0054A6] font-bold">
                                Kèm theo: {cert.decisionNumber} ({cert.decisionDate})
                              </span>
                            </div>
                            <h3 className="text-sm font-bold text-[#133F68] font-eiu-display">
                              {cert.eventTitle}
                            </h3>
                            <div className="text-xs text-slate-600">
                              Vai trò: <strong>{cert.roleTitle}</strong> • Quy
                              đổi:{' '}
                              <strong className="font-eiu-serif text-[#C10230]">
                                +{cert.volunteerDays.toFixed(1)} ngày TN
                              </strong>
                            </div>
                          </div>

                          <Link
                            href={`/tra-cuu-gcn?q=${encodeURIComponent(
                              cert.certCode
                            )}`}
                            className="min-h-[44px] sm:min-h-[38px] inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#0054A6] hover:bg-[#133F68] text-white text-xs font-bold uppercase tracking-wider shrink-0 font-eiu-display"
                          >
                            <span>Xem Giấy chứng nhận</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-xs text-slate-600 leading-relaxed">
                      Chưa có Giấy chứng nhận nào được cấp cho tài khoản này.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ============================================================
                MODULE 4: CUỘC THI TRẮC NGHIỆM TRỰC TUYẾN
               ============================================================ */}
            {activeTab === 'quiz' && (
              <div className="space-y-5">
                <div className="bg-white border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div
                    role="group"
                    aria-label="Lọc cuộc thi trong Sổ tay"
                    className="flex flex-wrap items-center gap-2"
                  >
                    {(
                      [
                        { id: 'ALL', label: `Tất cả (${ONLINE_CONTESTS.length})` },
                        { id: 'OPEN', label: 'Đang mở thi' },
                        {
                          id: 'PASSED',
                          label: `Đã đạt (${passedContests.length})`,
                        },
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
                          className={`min-h-[44px] sm:min-h-[34px] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider font-eiu-display transition-colors cursor-pointer ${
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

                  <Link
                    href="/cuoc-thi"
                    className="min-h-[44px] sm:min-h-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase text-[#0054A6] hover:text-[#C10230] font-eiu-display shrink-0"
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
                          className="min-h-[44px] sm:min-h-[38px] px-4 py-2 bg-[#133F68] text-white text-xs font-bold uppercase rounded-full font-eiu-display cursor-pointer"
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

                <ContestExamModal
                  contest={activeModalContest}
                  attempt={
                    activeModalContest
                      ? contestAttempts[activeModalContest.id]
                      : undefined
                  }
                  onClose={() => setActiveModalContest(null)}
                  onSaveAttempt={saveContestAttempt}
                />
              </div>
            )}

            {/* ============================================================
                MODULE 5: THẺ HỘI VIÊN ĐIỆN TỬ VÀ GIẢI MÃ MSSV 10 CHỮ SỐ EIU
               ============================================================ */}
            {activeTab === 'idcard' && (
              <div className="space-y-6">
                <div className="bg-white border-2 border-[#133F68] overflow-hidden max-w-2xl">
                  <div className="bg-[#133F68] eiu-arch-pattern text-white px-5 py-3.5 flex items-center justify-between border-b-3 border-[#A68556]">
                    <div className="flex items-center gap-3 min-w-0">
                      <Image
                        src="/images/eiu-logo-shorten-white.png"
                        alt="EIU"
                        width={86}
                        height={28}
                        className="w-[86px] h-7 object-contain shrink-0"
                      />
                      <span
                        className="h-5 w-px bg-white/30 shrink-0"
                        aria-hidden="true"
                      />
                      <Image
                        src="/images/hsv-logo.png"
                        alt="HSV"
                        width={28}
                        height={28}
                        className="h-7 w-7 object-contain shrink-0"
                      />
                      <span className="text-xs font-bold uppercase tracking-wider font-eiu-display truncate">
                        THẺ HỘI VIÊN ĐIỆN TỬ — EIU STUDENT ASSOCIATION
                      </span>
                    </div>
                    <CreditCard className="w-4 h-4 text-[#FCB900] shrink-0" />
                  </div>

                  <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-32 h-32 border-2 border-[#133F68] p-2 flex flex-col items-center justify-center shrink-0 bg-white">
                      <DeterministicQrCode
                        value={`MEMBER:${currentPersona.studentId}:${currentPersona.email}`}
                        size={88}
                        label={`Mã QR Hội viên ${currentPersona.fullName}`}
                      />
                      <span className="text-[11px] font-eiu-serif font-bold text-[#0054A6] mt-1 leading-none">
                        QR CHECK-IN
                      </span>
                    </div>

                    <div className="space-y-2 text-xs flex-1 w-full">
                      <div className="text-lg font-bold text-[#133F68] font-eiu-display">
                        {currentPersona.fullName}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <div>
                          <span className="text-slate-600">Mã định danh:</span>
                          <div className="font-eiu-serif font-bold text-slate-900">
                            {currentPersona.studentId !== '-'
                              ? currentPersona.studentId
                              : 'CÁN BỘ CTSV'}
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-600">Email SSO:</span>
                          <div className="font-eiu-serif font-semibold text-[#0054A6] break-all">
                            {currentPersona.email}
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-600">Khoa nhận diện:</span>
                          <div className="font-semibold text-slate-900">
                            {emailDecoded.facultyName}
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-600">Đơn vị cơ sở:</span>
                          <div className="font-semibold text-slate-900">
                            {activePosition.unitName}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                MODULE 6: HỘP THƯ LẮNG NGHE SINH VIÊN (LƯU BỀN VỮNG + MÃ #BKT)
               ============================================================ */}
            {activeTab === 'voice' && (
              <div className="space-y-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const trimmed = feedbackContent.trim();
                    if (trimmed.length < 10) {
                      setFeedbackError(
                        'Vui lòng nhập tối thiểu 10 ký tự nội dung kiến nghị/phản ánh (không chỉ nhập khoảng trắng).'
                      );
                      return;
                    }
                    setIsSubmittingFeedback(true);
                    setFeedbackError('');
                    setTimeout(() => {
                      const nextSeq = 2603 + portalState.voiceTickets.length;
                      const ticketCode = `#BKT-${nextSeq}`;
                      const newTicket: VoiceTicketRecord = {
                        id: ticketCode,
                        recipient: feedbackRecipient,
                        category: feedbackCategory,
                        isAnonymous,
                        content: trimmed,
                        createdAt: new Date().toLocaleString('vi-VN'),
                        status: 'Đã tiếp nhận (Phản hồi trong 03 ngày làm việc)',
                      };
                      updatePortalState((prev) => ({
                        ...prev,
                        voiceTickets: [newTicket, ...prev.voiceTickets],
                      }));
                      setLatestTicketId(ticketCode);
                      setIsSubmittingFeedback(false);
                      setFeedbackContent('');
                    }, 220);
                  }}
                  noValidate
                  className="bg-white border border-slate-200"
                >
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 font-eiu-display">
                    <MessageSquare className="w-4 h-4 text-[#00BCFF]" />
                    <span>
                      Biểu mẫu Gửi Kiến nghị, Đề xuất và Phản ánh Quyền lợi
                      Hội viên
                    </span>
                  </div>

                  <div className="divide-y divide-slate-200 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-12 p-4 items-center gap-2">
                      <span className="sm:col-span-4 font-bold text-slate-900">
                        Cơ quan tiếp nhận:
                      </span>
                      <div className="sm:col-span-8 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setFeedbackRecipient('BKT')}
                          className={`min-h-[44px] sm:min-h-[38px] px-3.5 py-2 border text-xs font-bold cursor-pointer font-eiu-display ${
                            feedbackRecipient === 'BKT'
                              ? 'bg-[#133F68] text-white border-[#133F68]'
                              : 'bg-[#F8FAFC] text-[#133F68] border-slate-300'
                          }`}
                        >
                          Ban Kiểm tra HSV Trường (Giám sát và Quyền lợi)
                        </button>
                        <button
                          type="button"
                          onClick={() => setFeedbackRecipient('BAN_TGPT')}
                          className={`min-h-[44px] sm:min-h-[38px] px-3.5 py-2 border text-xs font-bold cursor-pointer font-eiu-display ${
                            feedbackRecipient === 'BAN_TGPT'
                              ? 'bg-[#133F68] text-white border-[#133F68]'
                              : 'bg-[#F8FAFC] text-[#133F68] border-slate-300'
                          }`}
                        >
                          Ban Tuyên giáo – Phong trào (Ý tưởng Sự kiện)
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 p-4 items-center gap-2">
                      <label
                        htmlFor="fb-cat"
                        className="sm:col-span-4 font-bold text-slate-900"
                      >
                        Chủ đề phản ánh:
                      </label>
                      <div className="sm:col-span-8 relative">
                        <select
                          id="fb-cat"
                          name="feedbackCategory"
                          value={feedbackCategory}
                          onChange={(e) => setFeedbackCategory(e.target.value)}
                          className="w-full h-11 sm:h-9 pl-3 pr-8 py-0 border border-slate-300 rounded text-base sm:text-xs bg-white text-slate-900 font-medium appearance-none leading-normal cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0054A6]"
                        >
                          <option>
                            Quy đổi Ngày tình nguyện và Cấp Giấy chứng nhận
                          </option>
                          <option>
                            Xét chọn Danh hiệu Sinh viên 5 Tốt
                          </option>
                          <option>
                            Hoạt động Chi hội Khoa và Câu lạc bộ – Đội – Nhóm
                          </option>
                          <option>
                            Đề xuất Chương trình mới / Sự kiện Xanh UN SDGs
                          </option>
                        </select>
                        <ChevronDown
                          className="w-3.5 h-3.5 text-[#133F68] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 p-4 items-center gap-2">
                      <span className="sm:col-span-4 font-bold text-slate-900">
                        Chế độ danh tính:
                      </span>
                      <div className="sm:col-span-8 flex items-center gap-2.5">
                        <input
                          id="anon-toggle"
                          name="isAnonymous"
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="w-5 h-5 accent-[#0054A6]"
                        />
                        <label
                          htmlFor="anon-toggle"
                          className="text-slate-700 cursor-pointer"
                        >
                          Bảo mật danh tính người gửi (Chỉ Trưởng Ban Kiểm tra
                          tiếp cận mã hồ sơ)
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 p-4 items-start gap-2">
                      <label
                        htmlFor="fb-body"
                        className="sm:col-span-4 font-bold text-slate-900 pt-1.5"
                      >
                        Nội dung chi tiết:
                      </label>
                      <div className="sm:col-span-8">
                        <textarea
                          id="fb-body"
                          name="feedbackContent"
                          rows={4}
                          required
                          maxLength={2000}
                          value={feedbackContent}
                          onChange={(e) => {
                            setFeedbackContent(e.target.value);
                            if (feedbackError) setFeedbackError('');
                          }}
                          placeholder="Nhập nội dung kiến nghị hoặc đề xuất..."
                          className="w-full p-3 border border-slate-300 rounded text-base sm:text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0054A6]"
                        />
                        <div className="flex justify-between items-center text-[11px] text-slate-600 mt-1">
                          <span>Tối thiểu 10 ký tự</span>
                          <span>{feedbackContent.length}/2000 ký tự</span>
                        </div>
                        {feedbackError && (
                          <p role="alert" className="text-xs text-[#C10230] font-semibold mt-1">
                            {feedbackError}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {latestTicketId && (
                    <div
                      role="status"
                      className="px-5 py-3.5 bg-emerald-50 text-emerald-900 text-xs font-semibold border-t border-emerald-200 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#51803A] shrink-0" />
                      <span>
                        Đã chuyển hồ sơ kiến nghị mã{' '}
                        <strong className="font-eiu-serif">{latestTicketId}</strong>{' '}
                        ({isAnonymous ? 'Chế độ Ẩn danh' : currentPersona.fullName})
                        tới{' '}
                        {feedbackRecipient === 'BKT'
                          ? 'Ban Kiểm tra HSV Trường (Trưởng ban: Đ/c Trần Thị Thu Huyền)'
                          : 'Ban Tuyên giáo – Phong trào'}
                        .
                      </span>
                    </div>
                  )}

                  <div className="p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 text-slate-600">
                      <ShieldCheck className="w-4 h-4 text-[#0054A6]" />
                      <span>Cam kết phản hồi trong 03 ngày làm việc</span>
                    </span>
                    <button
                      type="submit"
                      disabled={isSubmittingFeedback}
                      className="min-h-[44px] sm:min-h-[38px] px-6 py-2 bg-[#0054A6] hover:bg-[#133F68] disabled:opacity-60 text-white rounded text-xs font-bold uppercase tracking-wider cursor-pointer font-eiu-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0054A6]"
                    >
                      {isSubmittingFeedback ? 'Đang gửi...' : 'Gửi Kiến nghị'}
                    </button>
                  </div>
                </form>

                {/* Lịch sử Kiến nghị Đã Gửi (Lưu bền vững theo Persona) */}
                {portalState.voiceTickets.length > 0 && (
                  <div className="bg-white border border-slate-200">
                    <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider font-eiu-display">
                      Lịch sử Kiến nghị Đã Gửi ({portalState.voiceTickets.length})
                    </div>
                    <div className="divide-y divide-slate-200 text-xs">
                      {portalState.voiceTickets.map((ticket) => (
                        <div key={ticket.id} className="p-4 space-y-1.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-[#133F68] text-white font-eiu-serif font-bold">
                                {ticket.id}
                              </span>
                              <span className="font-bold text-[#0054A6]">
                                {ticket.recipient === 'BKT'
                                  ? 'Ban Kiểm tra HSV Trường'
                                  : 'Ban Tuyên giáo – Phong trào'}
                              </span>
                              {ticket.isAnonymous && (
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold text-[11px]">
                                  Ẩn danh
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-eiu-serif text-slate-500">
                              {ticket.createdAt}
                            </span>
                          </div>
                          <div className="font-semibold text-[#133F68]">
                            {ticket.category}
                          </div>
                          <p className="text-slate-700 leading-relaxed max-w-prose">
                            {ticket.content}
                          </p>
                          <div className="text-[11px] font-semibold text-emerald-700">
                            ✓ {ticket.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hộp thoại Xác nhận Nộp / Rút hồ sơ Sinh viên 5 Tốt */}
      <ConfirmDialog
        open={sv5tConfirmMode !== null}
        variant={sv5tConfirmMode === 'withdraw' ? 'danger' : 'primary'}
        title={
          sv5tConfirmMode === 'withdraw'
            ? 'Xác nhận rút hồ sơ Sinh viên 5 Tốt'
            : 'Xác nhận gửi Hồ sơ Xét duyệt Cấp 1'
        }
        description={
          sv5tConfirmMode === 'withdraw'
            ? 'Bạn có chắc muốn rút hồ sơ Sinh viên 5 Tốt đang chờ sơ duyệt Cấp 1 để cập nhật bổ sung minh chứng không?'
            : `Hệ thống sẽ khóa bản khai tạm thời và chuyển hồ sơ Sinh viên 5 Tốt của ${currentPersona.fullName} tới Ban Chấp hành Cơ sở Hội (${activePosition.unitName}) để sơ duyệt Cấp 1.`
        }
        details={
          sv5tConfirmMode === 'submit'
            ? [
                `GPA xét chọn: ${effectiveGpa.toFixed(2)}/4.00 (Chuẩn ≥ 3.00)`,
                `Ngày tình nguyện: ${totalVolunteerDays.toFixed(1)} ngày (Chuẩn ≥ 5.0)`,
                `Tiêu chuẩn hoàn thành: ${metCriteriaCount}/05 tiêu chuẩn`,
              ]
            : undefined
        }
        confirmLabel={
          sv5tConfirmMode === 'withdraw' ? 'Rút hồ sơ' : 'Gửi hồ sơ ngay'
        }
        onCancel={() => setSv5tConfirmMode(null)}
        onConfirm={() => {
          if (sv5tConfirmMode === 'submit') {
            updatePortalState((prev) => ({
              ...prev,
              dossierSubmitted: true,
              submittedAt: new Date().toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              }),
            }));
          } else if (sv5tConfirmMode === 'withdraw') {
            updatePortalState((prev) => ({
              ...prev,
              dossierSubmitted: false,
              submittedAt: undefined,
            }));
          }
          setSv5tConfirmMode(null);
        }}
      />
    </div>
  );
}

function StudentPortalSearchBridge() {
  const searchParams = useSearchParams();
  const rawTab = searchParams.get('tab') as PortalTab | null;
  const validTab: PortalTab =
    rawTab && PORTAL_MENU.some((m) => m.id === rawTab) ? rawTab : 'sv5t';

  return <StudentPortalContent initialTab={validTab} />;
}

export default function StudentPortalPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1200px] mx-auto px-4 py-16 text-center text-sm text-slate-500">
          Đang tải Không gian Hội viên và Sổ tay Sinh viên 5 Tốt...
        </div>
      }
    >
      <StudentPortalSearchBridge />
    </Suspense>
  );
}
