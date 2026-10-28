'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
import {
  WORKSPACE_MODULES,
  WorkspaceModuleId,
} from './layout';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Eye,
  FileBadge,
  FileCheck2,
  FileSpreadsheet,
  Filter,
  FolderKanban,
  Megaphone,
  MessageSquareWarning,
  QrCode,
  ShieldAlert,
  Sparkles,
  Stamp,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';

const MOCK_SV5T_CANDIDATES = [
  {
    id: 'cand-01',
    studentId: '2431200018',
    fullName: 'Trần Nguyễn Minh Anh',
    branchCode: '24CNTT01',
    facultyCode: 'CIT' as FacultyCode,
    ethicsScore: 94,
    gpaYear: 3.68,
    physicalCert: 'Sinh viên Khỏe cấp Trường 2026',
    volunteerDays: 14.5,
    englishLevel: 'IELTS 6.5 (Tương đương B2)',
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
    physicalCert: 'Giải Nhì Cầu lông Hội thao EIU',
    volunteerDays: 12.0,
    englishLevel: 'Đạt chuẩn B1 + Kỹ năng Phụ lục 3',
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
    physicalCert: 'Sinh viên Khỏe cấp Trường 2026',
    volunteerDays: 9.5,
    englishLevel: 'Hoàn thành 02 khóa ngoại ngữ EIU',
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
    physicalCert: 'Sinh viên Khỏe cấp Trường 2026',
    volunteerDays: 16.0,
    englishLevel: 'Đạt chuẩn B1 + Giao lưu Quốc tế ASEAN',
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
    physicalCert: 'Sinh viên Khỏe cấp Trường 2026',
    volunteerDays: 6.5,
    englishLevel: 'Đạt chuẩn B1 + Tham gia cuộc thi Tiếng Anh',
    hasProvinceAward: false,
    hasMeritCert: false,
  },
];

const OFFICE_SHIFTS = [
  {
    day: 'Thứ Hai',
    morning: 'Phạm Thị Hồng Ngọc (Phó CVP - Quản trị VP)',
    afternoon: 'Lương Gia Hân (Cán bộ VP - Tài chính)',
    roomStatus: 'Đã mở cửa 07:30',
  },
  {
    day: 'Thứ Ba',
    morning: 'Lê Thị Hải Yến (Phó CVP - Văn thư Lưu trữ)',
    afternoon: 'Đào Văn Thanh (Cán bộ VP - Quản trị tài sản)',
    roomStatus: 'Tiếp nhận hồ sơ GCN',
  },
  {
    day: 'Thứ Tư',
    morning: 'Nguyễn Như Quỳnh (Tổng Thư ký VP - Nội bộ)',
    afternoon: 'Nguyễn Mỹ Hạnh (Chánh Văn phòng - Đối ngoại)',
    roomStatus: 'Họp giao ban Văn phòng',
  },
  {
    day: 'Thứ Năm',
    morning: 'Phạm Thị Hồng Ngọc (Phó CVP)',
    afternoon: 'Lê Thị Hải Yến (Phó CVP)',
    roomStatus: 'Đóng dấu Mộc văn bản',
  },
  {
    day: 'Thứ Sáu',
    morning: 'Lương Gia Hân (Cán bộ VP)',
    afternoon: 'Đào Văn Thanh (Cán bộ VP)',
    roomStatus: 'Kiểm kê tài sản cuối tuần',
  },
];

const SEAL_LOGS = [
  {
    id: 'seal-01',
    docNumber: '32/QĐ-HSV',
    docTitle: 'Quyết định công nhận danh sách GCN Tập huấn Cán bộ Đoàn - Hội 2026',
    approvedBy: 'Trương Châu Phước Lộc (Chủ tịch HSV)',
    stampedBy: 'Lê Thị Hải Yến (Phó CVP - Văn thư)',
    date: '19/10/2026',
    status: 'Đã đóng dấu & Lưu kho số',
  },
  {
    id: 'seal-02',
    docNumber: '15/KH-HSV',
    docTitle: 'Kế hoạch tổ chức Ngày hội Sinh viên Khỏe & Kiểm tra Thể lực cấp Trường',
    approvedBy: 'Nguyễn Như Quỳnh (PCT Thường trực)',
    stampedBy: 'Nguyễn Mỹ Hạnh (Chánh Văn phòng)',
    date: '21/10/2026',
    status: 'Đã đóng dấu & Phát hành',
  },
];

export default function WorkspacePage() {
  const { currentPersona, activePosition, setPersonaById } = useRole();
  const [activeModule, setActiveModule] = useState<WorkspaceModuleId>('overview');

  const [eventsState, setEventsState] = useState(EVENT_ITEMS);
  const [actionToast, setActionToast] = useState<string | null>(null);
  const [branchFacultyFilter, setBranchFacultyFilter] = useState<'ALL' | FacultyCode>('ALL');
  const [onlyTop10Sv5t, setOnlyTop10Sv5t] = useState(false);

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.replace('#', '') as WorkspaceModuleId;
      if (WORKSPACE_MODULES.some((m) => m.id === hash)) {
        setActiveModule(hash);
      }
    };
    const handleCustom = (e: Event) => {
      const customEvent = e as CustomEvent<WorkspaceModuleId>;
      if (customEvent.detail) {
        setActiveModule(customEvent.detail);
      }
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    window.addEventListener('workspace-module-change', handleCustom);
    return () => {
      window.removeEventListener('hashchange', syncHash);
      window.removeEventListener('workspace-module-change', handleCustom);
    };
  }, []);

  const switchModule = (id: WorkspaceModuleId) => {
    setActiveModule(id);
    window.history.replaceState(null, '', `#${id}`);
  };

  const triggerToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 4500);
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
      `[QĐ 28/QĐ-HSV] Đã phê duyệt chủ trương công nhận Ngày tình nguyện trước 03 ngày cho: "${title}".`
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
      `[QĐ 28/QĐ-HSV] Đã ký Quyết định số 35/QĐ-HSV và phát hành E-Certificate hàng loạt cho "${title}" đúng hạn SLA 07 ngày!`
    );
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

  return (
    <div className="space-y-6">
      {/* Toast thông báo tác nghiệp */}
      {actionToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-md bg-[#133F68] text-white border-2 border-[#A68556] rounded-2xl p-4 shadow-2xl flex items-start gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-[#FCB900] shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <div className="font-bold text-[#FCB900] mb-0.5 font-eiu-display">
              Hệ Thống Quản Trị E-Office HSV EIU
            </div>
            {actionToast}
          </div>
        </div>
      )}

      {/* Cảnh báo RBAC nếu đang chọn tài khoản Sinh viên Cấp 1 */}
      {activePosition.roleLevel === 1 && (
        <div
          role="alert"
          className="bg-amber-50 border border-amber-300 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold text-amber-950 font-eiu-display">
                Cảnh Báo Phân Quyền RBAC (Tài khoản hiện tại: Cấp 1 – Hội viên / Sinh viên)
              </h2>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                Khu vực E-Office dành cho Cán bộ Hội từ <strong>Cấp 2 đến Cấp 6</strong>. Đồng chí có thể chuyển nhanh sang tài khoản <strong>Chủ tịch HSV</strong> hoặc <strong>Trưởng Ban TC-XDH</strong> để kiểm thử đầy đủ quyền phê duyệt.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setPersonaById('staff-01')}
              className="min-h-10 px-4 py-2 rounded-xl bg-[#133F68] hover:bg-[#0D2E4D] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Đóng vai Chủ tịch HSV (Cấp 6)
            </button>
          </div>
        </div>
      )}

      {/* BANNER ĐỊNH DANH CÁN BỘ & THANH CHUYỂN PHÂN HỆ KIỂU APPLE SEGMENTED CONTROL */}
      <section
        aria-labelledby="workspace-hero-heading"
        className="bg-[#133F68] text-white rounded-2xl p-6 border-b-4 border-[#A68556] shadow-sm space-y-5"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FCB900] uppercase tracking-wider font-eiu-display">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                Tư cách hiện tại: Cấp {activePosition.roleLevel}/6 • {activePosition.unitName}
              </span>
            </div>
            <h1
              id="workspace-hero-heading"
              className="text-xl sm:text-2xl font-extrabold font-eiu-display"
            >
              Đ/c {currentPersona.fullName} — {activePosition.positionTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#DED1BE]">
              Chọn một phân hệ bên dưới (hoặc trên thanh bên trái) để tập trung xử lý từng tác vụ chuyên môn.
            </p>
          </div>

          {/* 4 Chỉ số tóm tắt gọn gàng */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
            <div className="px-3.5 py-2.5 rounded-xl bg-[#0D2E4D] border border-white/10 text-center">
              <div className="text-lg font-extrabold font-mono text-white">
                {BRANCH_UNITS.length}
              </div>
              <div className="text-[11px] text-[#DED1BE]">Chi hội</div>
            </div>
            <div className="px-3.5 py-2.5 rounded-xl bg-[#0D2E4D] border border-white/10 text-center">
              <div className="text-lg font-extrabold font-mono text-[#FCB900]">
                {CLUB_UNITS.length}
              </div>
              <div className="text-[11px] text-[#DED1BE]">CLB / Đội</div>
            </div>
            <div className="px-3.5 py-2.5 rounded-xl bg-[#0D2E4D] border border-white/10 text-center">
              <div className="text-lg font-extrabold font-mono text-emerald-300">
                ≤7d
              </div>
              <div className="text-[11px] text-[#DED1BE]">SLA Cấp GCN</div>
            </div>
            <div className="px-3.5 py-2.5 rounded-xl bg-[#0D2E4D] border border-white/10 text-center">
              <div className="text-lg font-extrabold font-mono text-white">
                {qualifiedCollectiveBranches.length}/{BRANCH_UNITS.length}
              </div>
              <div className="text-[11px] text-[#DED1BE]">Tập thể SV5T</div>
            </div>
          </div>
        </div>

        {/* Thanh chuyển phân hệ nhanh (Single-View Switcher) */}
        <div
          role="tablist"
          aria-label="Chọn phân hệ làm việc E-Office"
          className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-white/15"
        >
          {WORKSPACE_MODULES.map((m) => {
            const Icon = m.icon;
            const isSelected = activeModule === m.id;
            return (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => switchModule(m.id)}
                className={`min-h-10 px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#A68556] text-white shadow-xs'
                    : 'bg-white/10 text-white/90 hover:bg-white/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          VIEW 1: TỔNG QUAN ĐIỀU HÀNH (APPLE BENTO LAUNCHPAD — KHÔNG RỐI MẮT)
         ===================================================================== */}
      {activeModule === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WORKSPACE_MODULES.filter((m) => m.id !== 'overview').map((mod) => {
              const Icon = mod.icon;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => switchModule(mod.id)}
                  className="group bg-white hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#133F68] shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between gap-5 cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-[#133F68] text-white flex items-center justify-center group-hover:bg-[#A68556] transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 text-[#133F68]">
                        {mod.badge}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-[#133F68] font-eiu-display">
                      {mod.label}
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {mod.shortDesc}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0054A6] group-hover:translate-x-1 transition-transform">
                    <span>Mở phân hệ tác nghiệp</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tác vụ Khẩn cần xử lý ngay (SLA 07 ngày & Tờ trình trước 03 ngày) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-extrabold text-[#133F68] font-eiu-display">
                  Hàng Đợi Phê Duyệt Ưu Tiên Trong Tuần (QĐ 28/QĐ-HSV)
                </h2>
                <p className="text-xs text-slate-600">
                  Các hồ sơ đang chờ Ban TC-XDH thẩm định trước 03 ngày hoặc đang đếm ngược SLA 07 ngày làm việc.
                </p>
              </div>
              <button
                type="button"
                onClick={() => switchModule('certificates')}
                className="min-h-10 px-4 py-2 rounded-xl bg-[#133F68] text-white text-xs font-bold hover:bg-[#0D2E4D] cursor-pointer"
              >
                Xem toàn bộ quy trình GCN →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eventsState
                .filter(
                  (e) =>
                    e.preApprovalStatus === 'pending_tcxdh' ||
                    e.certWorkflowStatus === 'list_submitted_sla'
                )
                .map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-xl bg-[#F5F5F5] border border-slate-200 flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#0054A6]">
                          {ev.organizerUnit}
                        </span>
                        {ev.certWorkflowStatus === 'list_submitted_sla' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                            SLA: Còn 0{ev.slaDaysRemaining} ngày
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#133F68]">
                            Chờ duyệt trước 03 ngày
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-[#133F68]">
                        {ev.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <span className="text-xs font-mono text-slate-600">
                        Quy đổi gốc: +{ev.baseVolunteerDays.toFixed(1)} ngày
                      </span>
                      {ev.preApprovalStatus === 'pending_tcxdh' ? (
                        <button
                          type="button"
                          onClick={() => handleApprove3DaysPrior(ev.id, ev.title)}
                          className="min-h-9 px-3.5 py-1.5 rounded-lg bg-[#133F68] text-white text-xs font-bold cursor-pointer"
                        >
                          Duyệt tờ trình
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            handleIssueDecisionAndCerts(ev.id, ev.title)
                          }
                          className="min-h-9 px-3.5 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                        >
                          Ký QĐ &amp; Cấp E-Cert
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 2: DUYỆT NGÀY TÌNH NGUYỆN & CẤP GCN (QĐ 28/QĐ-HSV)
         ===================================================================== */}
      {activeModule === 'certificates' && (
        <section
          aria-labelledby="cert-module-heading"
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#A68556] font-eiu-display">
                Quyết định 28/QĐ-HSV &amp; Phụ lục 2 Quyết định 09/QĐ-HSV
              </div>
              <h2
                id="cert-module-heading"
                className="text-xl font-extrabold text-[#133F68] mt-1 font-eiu-display"
              >
                Thẩm Định Ngày Tình Nguyện (Trước ≥ 03 Ngày) &amp; Cấp E-Certificate (SLA 07 Ngày)
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Đơn vị gửi tờ trình qua <strong>Trưởng Ban TC-XDH (Đ/c Trần Thị Thu Huyền)</strong> trình Ban Thư ký trước ít nhất 03 ngày; sau sự kiện nộp danh sách chuẩn Phụ lục 1 (MSSV tăng dần) để cấp Quyết định trong 07 ngày làm việc.
              </p>
            </div>
            <Link
              href="/tra-cuu-gcn"
              className="min-h-11 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#133F68] text-white text-xs font-bold shrink-0"
            >
              <QrCode className="w-4 h-4 text-[#FCB900]" />
              <span>Xem Mẫu E-Certificate Phụ lục 2</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#F5F5F5] p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded bg-[#133F68] text-white font-mono font-bold mb-1">
                Hệ số ×3 — Ban Tổ chức (BTC)
              </span>
              <p className="text-slate-700">
                Nhân 3 lần số ngày tình nguyện gốc của hoạt động (Phụ lục 2 QĐ 09).
              </p>
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded bg-[#0054A6] text-white font-mono font-bold mb-1">
                Hệ số ×2 — Cộng tác viên / CTVXK
              </span>
              <p className="text-slate-700">
                Nhân 2 lần số ngày tình nguyện gốc khi hỗ trợ hậu cần, lễ tân, truyền thông.
              </p>
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded bg-slate-700 text-white font-mono font-bold mb-1">
                Hệ số ×1 — Sinh viên tham gia
              </span>
              <p className="text-slate-700">
                Tính 100% số ngày gốc (Hiến máu: 5.0 ngày/lần; Workshop ≤1 ngày: 0.5 ngày).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-[#133F68] bg-[#F5F5F5]">
                  <th className="py-3.5 px-4 font-bold">Chương trình / Đơn vị trình</th>
                  <th className="py-3.5 px-4 font-bold">Khung Quy đổi (PL2)</th>
                  <th className="py-3.5 px-4 font-bold">Duyệt Trước 03 Ngày</th>
                  <th className="py-3.5 px-4 font-bold">Tiến độ Cấp GCN (SLA 7d)</th>
                  <th className="py-3.5 px-4 font-bold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {eventsState.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50">
                    <td className="py-4 px-4 max-w-xs">
                      <div className="font-bold text-[#133F68]">{ev.title}</div>
                      <div className="text-xs text-slate-600 mt-1">
                        Đơn vị: <strong>{ev.organizerUnit}</strong>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-xs font-semibold text-slate-800">
                        {ev.volunteerCategory}
                      </div>
                      <div className="text-xs font-mono font-bold text-[#0054A6] mt-1">
                        Gốc: {ev.baseVolunteerDays.toFixed(1)}d (BTC: {(ev.baseVolunteerDays * 3).toFixed(1)}d | CTV: {(ev.baseVolunteerDays * 2).toFixed(1)}d)
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {ev.preApprovalStatus === 'approved_3days_prior' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đã duyệt ≥ 03 ngày
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
                          <Clock className="w-3.5 h-3.5" />
                          Chờ Ban TC-XDH
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {ev.certWorkflowStatus === 'decision_issued' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#133F68] border border-blue-200">
                          <FileCheck2 className="w-3.5 h-3.5" />
                          Đã cấp {ev.decisionNumber}
                        </span>
                      )}
                      {ev.certWorkflowStatus === 'list_submitted_sla' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          SLA: Còn 0{ev.slaDaysRemaining} ngày
                        </span>
                      )}
                      {ev.certWorkflowStatus === 'upcoming' && (
                        <span className="text-xs text-slate-600">
                          Chờ nộp Phụ lục 1 sau SK
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {ev.preApprovalStatus === 'pending_tcxdh' && (
                        <button
                          type="button"
                          onClick={() => handleApprove3DaysPrior(ev.id, ev.title)}
                          className="min-h-10 px-3.5 py-2 rounded-lg bg-[#133F68] hover:bg-[#0D2E4D] text-white font-bold text-xs cursor-pointer"
                        >
                          Duyệt Tờ trình
                        </button>
                      )}
                      {ev.certWorkflowStatus === 'list_submitted_sla' && (
                        <button
                          type="button"
                          onClick={() =>
                            handleIssueDecisionAndCerts(ev.id, ev.title)
                          }
                          className="min-h-10 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer"
                        >
                          Ký QĐ &amp; Cấp E-Cert
                        </button>
                      )}
                      {ev.certWorkflowStatus === 'decision_issued' && (
                        <Link
                          href="/tra-cuu-gcn"
                          className="min-h-10 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Xem GCN
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* =====================================================================
          VIEW 3: HỘI ĐỒNG XÉT CHỌN SINH VIÊN 5 TỐT 3 CẤP & TOP 10% (QĐ 09)
         ===================================================================== */}
      {activeModule === 'sv5t' && (
        <section
          aria-labelledby="sv5t-council-heading"
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#A68556] font-eiu-display">
                Quyết định 09/QĐ-HSV (Sửa đổi, bổ sung năm 2026)
              </div>
              <h2
                id="sv5t-council-heading"
                className="text-xl font-extrabold text-[#133F68] mt-1 font-eiu-display"
              >
                Hội Đồng Xét Chọn &quot;Sinh Viên 5 Tốt&quot; &amp; Lọc Top 10% Tiêu Biểu Toàn Trường
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Thứ tự ưu tiên lọc <strong>Tối đa 10% SV5T Tiêu biểu Toàn trường</strong>: (1) Đạt giải cấp Tỉnh/TW → (2) Có Giấy khen/Bằng khen → (3) Điểm rèn luyện cao hơn → (4) GPA năm học cao hơn → (5) Số ngày tình nguyện nhiều hơn.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOnlyTop10Sv5t(!onlyTop10Sv5t)}
              className={`min-h-11 px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors inline-flex items-center gap-2 shrink-0 cursor-pointer ${
                onlyTop10Sv5t
                  ? 'bg-[#133F68] text-white border-[#133F68]'
                  : 'bg-[#F5F5F5] text-[#133F68] border-slate-300 hover:bg-slate-200'
              }`}
            >
              <Filter className="w-4 h-4 text-[#FCB900]" />
              <span>
                {onlyTop10Sv5t
                  ? 'Đang lọc: Top 10% SV5T Tiêu biểu'
                  : 'Lọc ứng viên Top 10% SV5T Tiêu biểu'}
              </span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-[#133F68] bg-[#F5F5F5]">
                  <th className="py-3.5 px-4 font-bold">Ứng viên / Chi hội</th>
                  <th className="py-3.5 px-4 font-bold">Đạo đức (≥80)</th>
                  <th className="py-3.5 px-4 font-bold">Học tập (≥2.7 + NCKH)</th>
                  <th className="py-3.5 px-4 font-bold">Thể lực (PL1)</th>
                  <th className="py-3.5 px-4 font-bold">Tình nguyện (≥5d)</th>
                  <th className="py-3.5 px-4 font-bold">Hội nhập</th>
                  <th className="py-3.5 px-4 font-bold">Xếp hạng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {displayedCandidates.map((c, idx) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-4 px-4">
                      <div className="font-bold text-[#133F68]">{c.fullName}</div>
                      <div className="text-xs text-slate-600 font-mono mt-0.5">
                        {c.studentId} • {c.branchCode} ({FACULTY_METADATA[c.facultyCode].shortCode})
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-emerald-800">
                      {c.ethicsScore}/100
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-mono font-bold text-[#0054A6]">
                        {c.gpaYear.toFixed(2)}/4.0
                      </div>
                      <div className="text-xs text-emerald-700 font-medium">
                        ✓ Có 01 NCKH
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-700">
                      {c.physicalCert}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">
                      {c.volunteerDays.toFixed(1)} ngày
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-700">
                      {c.englishLevel}
                    </td>
                    <td className="py-4 px-4">
                      {c.hasProvinceAward || c.hasMeritCert ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-950 border border-amber-300">
                          ★ Top 10% (#{idx + 1})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Đạt SV5T Trường
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* =====================================================================
          VIEW 4: BẢNG TẬP THỂ SINH VIÊN 5 TỐT 25 CHI HỘI (QĐ 09/QĐ-HSV)
         ===================================================================== */}
      {activeModule === 'collective' && (
        <section
          aria-labelledby="collective-sv5t-heading"
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#A68556] font-eiu-display">
                Mục III Quyết định 09/QĐ-HSV • 25 Chi hội trực thuộc 04 Cụm Khoa
              </div>
              <h2
                id="collective-sv5t-heading"
                className="text-xl font-extrabold text-[#133F68] mt-1 font-eiu-display"
              >
                Theo Dõi Chỉ Tiêu &quot;Tập Thể Sinh Viên 5 Tốt&quot; (100% ĐK • ≥ 30% Đạt • 0 Kỷ Luật)
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { code: 'ALL', label: 'Tất cả (25)' },
                  { code: 'BBS', label: 'Cụm QTKD (6)' },
                  { code: 'SET', label: 'Cụm Kỹ thuật (6)' },
                  { code: 'CIT', label: 'Cụm CNTT (7)' },
                  { code: 'SNS', label: 'Cụm Khoa học Sức khỏe (6)' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.code}
                  type="button"
                  onClick={() => setBranchFacultyFilter(tab.code)}
                  className={`min-h-10 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    branchFacultyFilter === tab.code
                      ? 'bg-[#133F68] text-white'
                      : 'bg-[#F5F5F5] text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBranches.map((branch) => {
              const isQualified =
                branch.sv5tRegisteredRate === 100 &&
                branch.sv5tAchievedRate >= 30 &&
                !branch.hasDisciplineViolation;
              return (
                <div
                  key={branch.id}
                  className="rounded-2xl border border-slate-200 bg-[#F5F5F5] p-5 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-extrabold text-base text-[#133F68]">
                      {branch.code}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        isQualified
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {isQualified
                        ? '✓ Đạt Tập thể SV5T'
                        : `Cần +${30 - branch.sv5tAchievedRate}% SV đạt`}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1">
                    <div>
                      Khoa: <strong>{FACULTY_METADATA[branch.facultyCode].nameVi}</strong>
                    </div>
                    <div>
                      Cụm trưởng: <strong>{branch.clusterLeaderName}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">
                        Đăng ký: <strong>{branch.sv5tRegisteredRate}%</strong>
                      </span>
                      <span className="font-mono font-bold text-[#133F68]">
                        Đạt: {branch.sv5tAchievedRate}% / 30%
                      </span>
                    </div>
                    <div
                      role="progressbar"
                      aria-label={`Tỷ lệ đạt SV5T của ${branch.code}`}
                      aria-valuenow={branch.sv5tAchievedRate}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden"
                    >
                      <div
                        className={`h-full rounded-full ${
                          isQualified ? 'bg-emerald-600' : 'bg-[#A68556]'
                        }`}
                        style={{
                          width: `${Math.min(branch.sv5tAchievedRate * 2, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =====================================================================
          VIEW 5: BAN TUYÊN GIÁO - PHONG TRÀO & ĐỘI CTV XUNG KÍCH (QĐ 24)
         ===================================================================== */}
      {activeModule === 'tgpt' && (
        <section
          aria-labelledby="tgpt-heading"
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6"
        >
          <div className="border-b border-slate-200 pb-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#A68556] font-eiu-display">
              Đơn vị 03 • Quyết định 24/QĐ-HSV &amp; Sơ đồ Tổ chức Khóa II
            </div>
            <h2
              id="tgpt-heading"
              className="text-xl font-extrabold text-[#133F68] mt-1 font-eiu-display"
            >
              Ban Tuyên Giáo - Phong Trào (02 Mảng • 06 Tiểu Ban) &amp; Đội CTV Xung Kích
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mảng Tuyên giáo */}
            <div className="rounded-2xl border border-slate-200 bg-[#F5F5F5] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-[#133F68] text-white text-xs font-bold font-eiu-display">
                  MẢNG TUYÊN GIÁO (TRUYỀN THÔNG SỐ)
                </span>
                <span className="text-xs font-mono font-bold text-slate-600">
                  03 Tiểu ban
                </span>
              </div>
              <div className="text-sm space-y-1 text-slate-700">
                <p>
                  • <strong>Trưởng mảng:</strong> Đ/c Đặng Trí Toàn (UV BCH, Phó BKT, CHT 25CNTT02)
                </p>
                <p>
                  • <strong>02 Phó ban:</strong> Đ/c Võ Chí Kiên &amp; Đ/c Liêu Gia Kỳ
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    name: 'Tiểu ban Design',
                    desc: 'Ấn phẩm đồ họa & Bộ nhận diện sự kiện',
                  },
                  {
                    name: 'Tiểu ban Video',
                    desc: 'Sản xuất Reels, Trailer & Recap truyền thông',
                  },
                  {
                    name: 'Tiểu ban Photo',
                    desc: 'Phóng sự ảnh hiện trường & Lưu trữ tư liệu',
                  },
                ].map((tb) => (
                  <div
                    key={tb.name}
                    className="bg-white p-4 rounded-xl border border-slate-200 space-y-1"
                  >
                    <div className="font-bold text-sm text-[#133F68]">{tb.name}</div>
                    <p className="text-xs text-slate-600 leading-relaxed">{tb.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mảng Phong trào & Đội CTV Xung kích */}
            <div className="rounded-2xl border border-slate-200 bg-[#F5F5F5] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-[#0054A6] text-white text-xs font-bold font-eiu-display">
                  MẢNG PHONG TRÀO &amp; ĐỘI CTV XUNG KÍCH
                </span>
                <span className="text-xs font-mono font-bold text-[#133F68]">
                  03 Tiểu ban + Đội CTVXK
                </span>
              </div>
              <div className="text-sm space-y-1 text-slate-700">
                <p>
                  • <strong>Trưởng mảng:</strong> Đ/c Nguyễn Mai Gia Tường (UV BTK, Chủ nhiệm CLB SV5T)
                </p>
                <p>
                  • <strong>02 Phó ban:</strong> Đ/c Nguyễn Thị Thúy Nhi &amp; Đ/c Nguyễn Thanh Đạt
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    name: 'Tiểu ban Tài chính',
                    desc: 'Dự trù kinh phí, tài trợ & quyết toán',
                  },
                  {
                    name: 'Tiểu ban Nội dung - Kịch bản',
                    desc: 'Kịch bản chương trình & thể lệ hội thi',
                  },
                  {
                    name: 'Tiểu ban MC',
                    desc: 'Dẫn chương trình song ngữ & hoạt náo',
                  },
                ].map((tb) => (
                  <div
                    key={tb.name}
                    className="bg-white p-4 rounded-xl border border-slate-200 space-y-1"
                  >
                    <div className="font-bold text-sm text-[#133F68]">{tb.name}</div>
                    <p className="text-xs text-slate-600 leading-relaxed">{tb.desc}</p>
                  </div>
                ))}
              </div>

              {/* Đội CTV Xung kích quản lý 02 tiểu ban */}
              <div className="bg-white rounded-xl p-4 border-2 border-[#A68556] space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-bold text-sm text-[#133F68] flex items-center gap-2 font-eiu-display">
                    <UserCheck className="w-4 h-4 text-[#A68556]" />
                    ĐỘI CỘNG TÁC VIÊN XUNG KÍCH (ĐỘI TRƯỞNG: Đ/C NGUYỄN THANH ĐẠT)
                  </div>
                  <Link
                    href="/to-chuc/doi-cong-tac-vien-xung-kich"
                    className="text-xs font-bold text-[#0054A6] underline"
                  >
                    Micro-site Đội CTVXK →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-[#F5F5F5] border border-slate-200">
                    <div className="font-bold text-xs text-[#133F68]">
                      1. Tiểu ban Hậu cần - Sân khấu
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Âm thanh, ánh sáng, bàn ghế, kỹ thuật hiện trường &amp; sự kiện xanh.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F5F5F5] border border-slate-200">
                    <div className="font-bold text-xs text-[#133F68]">
                      2. Tiểu ban Lễ tân - Khánh tiết - Văn thể mỹ
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Đón tiếp đại biểu, trao giải thưởng &amp; tiết mục văn nghệ xung kích.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          VIEW 6: VĂN PHÒNG 206.B06, LỊCH TRỰC & CON DẤU MỘC (QĐ 24/QĐ-HSV)
         ===================================================================== */}
      {activeModule === 'office' && (
        <section
          aria-labelledby="office-heading"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#A68556] font-eiu-display">
                Đơn vị 01 • Phòng 206.B06 (Quyết định 24/QĐ-HSV)
              </div>
              <h2
                id="office-heading"
                className="text-lg font-extrabold text-[#133F68] mt-1 font-eiu-display"
              >
                Lịch Trực Văn Phòng 206.B06 (Chánh VP &amp; Tổng Thư Ký Song Hành)
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Chánh Văn phòng: <strong>Đ/c Nguyễn Mỹ Hạnh</strong> (Đối ngoại) • Tổng Thư ký: <strong>Đ/c Nguyễn Như Quỳnh</strong> (Nội bộ).
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-[#133F68] bg-[#F5F5F5]">
                    <th className="py-3 px-3.5 font-bold">Thứ</th>
                    <th className="py-3 px-3.5 font-bold">Ca Sáng</th>
                    <th className="py-3 px-3.5 font-bold">Ca Chiều</th>
                    <th className="py-3 px-3.5 font-bold">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {OFFICE_SHIFTS.map((s) => (
                    <tr key={s.day}>
                      <td className="py-3 px-3.5 font-bold text-[#133F68]">
                        {s.day}
                      </td>
                      <td className="py-3 px-3.5 text-slate-700">{s.morning}</td>
                      <td className="py-3 px-3.5 text-slate-700">{s.afternoon}</td>
                      <td className="py-3 px-3.5">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#133F68]">
                          {s.roomStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#A68556] font-eiu-display">
                Văn Thư – Lưu Trữ &amp; Con Dấu Pháp Lý
              </div>
              <h2 className="text-lg font-extrabold text-[#133F68] mt-1 font-eiu-display">
                Nhật Ký Đóng Dấu (Mộc HSV)
              </h2>
            </div>

            <div className="space-y-3">
              {SEAL_LOGS.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-[#F5F5F5] border border-slate-200 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#133F68]">
                      Số hiệu: {log.docNumber}
                    </span>
                    <span className="font-mono text-slate-600">{log.date}</span>
                  </div>
                  <div className="font-bold text-sm text-[#133F68]">
                    {log.docTitle}
                  </div>
                  <div className="text-slate-600">
                    Người ký: <strong>{log.approvedBy}</strong> • Văn thư:{' '}
                    <strong>{log.stampedBy}</strong>
                  </div>
                  <div className="text-emerald-800 font-bold">
                    ✓ {log.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          VIEW 7: HỌP KHÔNG GIẤY (QĐ 23) & BAN KIỂM TRA
         ===================================================================== */}
      {activeModule === 'meetings' && (
        <section
          aria-labelledby="meetings-heading"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#A68556] font-eiu-display">
                Quyết định 23/QĐ-HSV • Chế độ Họp Định kỳ
              </div>
              <h2
                id="meetings-heading"
                className="text-lg font-extrabold text-[#133F68] mt-1 font-eiu-display"
              >
                Phòng Họp Không Giấy (Paperless Meeting)
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-[#F5F5F5] border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#133F68]">
                    Hội nghị Ban Thư ký Thường kỳ Tháng 11/2026
                  </span>
                  <span className="font-mono text-xs font-bold text-[#A68556]">
                    Phòng 206.B06
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Chủ trì: <strong>Đ/c Trương Châu Phước Lộc</strong> (Chủ tịch HSV) • 100% tài liệu dự thảo truy cập qua mã QR, biểu quyết điện tử trực tiếp.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F5F5F5] border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#133F68]">
                    Hội nghị Ban Chấp hành Mở rộng Quý IV/2026 (15 đ/c BCH &amp; 05 đ/c BKT)
                  </span>
                  <span className="font-mono text-xs text-slate-600">
                    Định kỳ hàng quý
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Rà soát chỉ tiêu Tập thể SV5T của 25 Chi hội và tiến độ thực thi {OFFICIAL_DOCUMENTS.length} văn bản pháp lý đầu nhiệm kỳ.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#A68556] font-eiu-display">
                  Ban Kiểm Tra HSV Trường ({STAFF_MEMBERS.filter((s) => s.bktRole !== 'Không').length} đ/c)
                </div>
                <h2 className="text-lg font-extrabold text-[#133F68] mt-1 font-eiu-display">
                  Hộp Thư Lắng Nghe Sinh Viên &amp; Giám Sát
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-[#133F68]">
                Trưởng BKT: Đ/c Trần Thị Thu Huyền
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {[
                {
                  id: 'fb-01',
                  sender: 'Sinh viên Khoa Khoa học Sức khỏe (KHSK)',
                  topic:
                    'Đề xuất mở thêm khung giờ Kiểm tra Thể lực Sinh viên Khỏe buổi chiều muộn cho SV đi thực tập bệnh viện.',
                  status: 'Đã chuyển Mảng Phong trào xử lý',
                },
                {
                  id: 'fb-02',
                  sender: 'Chi hội 25CNTT01 (Khoa Công nghệ Thông tin)',
                  topic:
                    'Kiến nghị tích hợp xuất tự động danh sách Phụ lục 1 (sắp xếp MSSV tăng dần) từ dữ liệu điểm danh QR.',
                  status: 'Đã triển khai trên Cổng thông tin Khóa II',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#F5F5F5] border border-slate-200 space-y-1.5"
                >
                  <div className="text-slate-600 font-semibold">{item.sender}</div>
                  <div className="font-bold text-sm text-[#133F68]">
                    {item.topic}
                  </div>
                  <div className="text-[#0054A6] font-bold flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
