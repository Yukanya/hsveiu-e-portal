'use client';

import React, { useState } from 'react';
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
  AlertTriangle,
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
  ShieldCheck,
  Sparkles,
  Stamp,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';

// Dữ liệu giả lập Hồ sơ ứng viên xét chọn Sinh viên 5 Tốt & Lọc Top 10% Tiêu biểu Toàn trường (QĐ 09/QĐ-HSV)
const MOCK_SV5T_CANDIDATES = [
  {
    id: 'cand-01',
    studentId: '2431200018',
    fullName: 'Trần Nguyễn Minh Anh',
    branchCode: '24CNTT01',
    facultyCode: 'CIT' as FacultyCode,
    ethicsScore: 94,
    gpaYear: 3.68,
    hasScientificPaper: true,
    physicalCert: 'Sinh viên Khỏe cấp Trường 2026',
    volunteerDays: 14.5,
    englishLevel: 'IELTS 6.5 (Tương đương B2)',
    hasProvinceAward: true,
    hasMeritCert: true,
    reviewStage: 'Đã duyệt cấp Trường',
  },
  {
    id: 'cand-02',
    studentId: '2532300042',
    fullName: 'Lê Hoàng Bảo Trâm',
    branchCode: '25QTKD01',
    facultyCode: 'BBS' as FacultyCode,
    ethicsScore: 92,
    gpaYear: 3.55,
    hasScientificPaper: true,
    physicalCert: 'Giải Nhì Cầu lông Hội thao EIU',
    volunteerDays: 12.0,
    englishLevel: 'Đạt chuẩn B1 + Chứng chỉ Kỹ năng Phụ lục 3',
    hasProvinceAward: false,
    hasMeritCert: true,
    reviewStage: 'Đã duyệt cấp Trường',
  },
  {
    id: 'cand-03',
    studentId: '2531300019',
    fullName: 'Nguyễn Phúc Khang',
    branchCode: '25KT01',
    facultyCode: 'SET' as FacultyCode,
    ethicsScore: 89,
    gpaYear: 3.42,
    hasScientificPaper: true,
    physicalCert: 'Sinh viên Khỏe cấp Trường 2026',
    volunteerDays: 9.5,
    englishLevel: 'Hoàn thành 02 khóa ngoại ngữ ĐHQTMĐ',
    hasProvinceAward: false,
    hasMeritCert: true,
    reviewStage: 'Đã duyệt cấp Trường',
  },
  {
    id: 'cand-04',
    studentId: '2533100088',
    fullName: 'Phạm Ngọc Thảo Vy',
    branchCode: '25KHSK01',
    facultyCode: 'SNS' as FacultyCode,
    ethicsScore: 91,
    gpaYear: 3.48,
    hasScientificPaper: true,
    physicalCert: 'Sinh viên Khỏe cấp Trường 2026',
    volunteerDays: 16.0,
    englishLevel: 'Đạt chuẩn B1 + Giao lưu Quốc tế ASEAN',
    hasProvinceAward: false,
    hasMeritCert: false,
    reviewStage: 'Chờ Hội đồng Cấp Trường',
  },
  {
    id: 'cand-05',
    studentId: '2531200105',
    fullName: 'Võ Minh Quân',
    branchCode: '25CNTT02',
    facultyCode: 'CIT' as FacultyCode,
    ethicsScore: 86,
    gpaYear: 3.12,
    hasScientificPaper: true,
    physicalCert: 'Sinh viên Khỏe cấp Trường 2026',
    volunteerDays: 6.5,
    englishLevel: 'Đạt chuẩn B1 + Tham gia cuộc thi Tiếng Anh',
    hasProvinceAward: false,
    hasMeritCert: false,
    reviewStage: 'Cụm trưởng Khoa đã thẩm định',
  },
];

// Dữ liệu giả lập Lịch trực Văn phòng 206.B06 & Quản lý Mộc / Tài sản (QĐ 24/QĐ-HSV)
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
    roomStatus: 'Trực tiếp nhận hồ sơ GCN',
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
    roomStatus: 'Đóng dấu Mộc văn bản định kỳ',
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
    requestedBy: 'Ban Tổ chức và Xây dựng Hội',
    approvedBy: 'Trương Châu Phước Lộc (Chủ tịch HSV)',
    stampedBy: 'Lê Thị Hải Yến (Phó CVP - Văn thư)',
    date: '19/10/2026',
    status: 'Đã đóng dấu & Lưu kho số',
  },
  {
    id: 'seal-02',
    docNumber: '15/KH-HSV',
    docTitle: 'Kế hoạch tổ chức Ngày hội Sinh viên Khỏe & Kiểm tra Thể lực cấp Trường',
    requestedBy: 'Ban Tuyên giáo - Phong trào (Mảng Phong trào)',
    approvedBy: 'Nguyễn Như Quỳnh (PCT Thường trực)',
    stampedBy: 'Nguyễn Mỹ Hạnh (Chánh Văn phòng)',
    date: '21/10/2026',
    status: 'Đã đóng dấu & Phát hành',
  },
];

export default function WorkspacePage() {
  const { currentPersona, activePosition, setPersonaById } = useRole();

  // State tương tác Duyệt Tờ trình Ngày tình nguyện & Cấp GCN (QĐ 28/QĐ-HSV)
  const [eventsState, setEventsState] = useState(EVENT_ITEMS);
  const [actionToast, setActionToast] = useState<string | null>(null);

  // State lọc Cụm Khoa tại Bảng Tập thể SV5T (25 Chi hội)
  const [branchFacultyFilter, setBranchFacultyFilter] = useState<'ALL' | FacultyCode>('ALL');
  const [onlyTop10Sv5t, setOnlyTop10Sv5t] = useState(false);

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
      `[QĐ 28/QĐ-HSV] Đã phê duyệt chủ trương công nhận Ngày tình nguyện trước 03 ngày cho chương trình: "${title}".`
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
      `[QĐ 28/QĐ-HSV] Đã ban hành Quyết định số 35/QĐ-HSV và phát hành E-Certificate hàng loạt (kèm QR & chữ "(Đã ký)") cho "${title}" đúng hạn SLA 07 ngày!`
    );
  };

  // Thống kê tập thể SV5T (100% đăng ký, >= 30% đạt, 0 kỷ luật)
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
    <div className="space-y-8">
      {/* Thông báo Toast khi Cán bộ thao tác */}
      {actionToast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-[#0B2545] text-white border border-sky-400/40 rounded-2xl p-4 shadow-2xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <div className="font-bold text-sky-300 mb-0.5">
              Hệ thống Quản trị Điện tử HSV EIU
            </div>
            {actionToast}
          </div>
        </div>
      )}

      {/* Cảnh báo RBAC nếu người dùng đang chọn Persona là Sinh viên Cấp 1 */}
      {activePosition.roleLevel === 1 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold text-amber-900">
                Chế độ Xem trước Phân quyền RBAC (Tài khoản hiện tại: Cấp 1 – Hội viên / Sinh viên)
              </h2>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Trong môi trường thực tế, khu vực <strong>/workspace (E-Office)</strong> được bảo vệ bởi Middleware phân quyền từ <strong>Cấp 2 (Cộng tác viên) đến Cấp 6 (Ban Thư ký)</strong>. Bạn có thể bấm nút bên cạnh để đóng vai <strong>Chủ tịch HSV</strong> hoặc <strong>Trưởng Ban TC-XDH</strong> để kiểm thử đầy đủ quyền phê duyệt.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setPersonaById('staff-01')}
              className="px-3.5 py-2 rounded-xl bg-[#0054A6] hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Đóng vai Chủ tịch HSV (Cấp 6)
            </button>
            <button
              type="button"
              onClick={() => setPersonaById('staff-03')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold transition-colors"
            >
              Đóng vai Trưởng Ban TC-XDH
            </button>
          </div>
        </div>
      )}

      {/* 1. BANNER TỔNG QUAN ĐIỀU HÀNH & NGỮ CẢNH KIÊM NHIỆM (#overview) */}
      <section
        id="overview"
        className="bg-gradient-to-r from-[#0B2545] via-[#0F3156] to-[#0054A6] rounded-2xl p-6 sm:p-7 text-white shadow-sm"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-sky-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>
                Bàn làm việc Cán bộ Hội • Tư cách hiện tại: Cấp {activePosition.roleLevel}/6 ({activePosition.roleInUnit})
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Xin chào Đ/c {currentPersona.fullName} — {activePosition.positionTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Đơn vị tác nghiệp đang chọn: <strong className="text-white">{activePosition.unitName}</strong>
              {activePosition.divisionName ? ` (${activePosition.divisionName})` : ''}. Hệ thống tự động đồng bộ quyền hạn theo{' '}
              <span className="underline decoration-sky-300">Quyết định 23/QĐ-HSV</span>,{' '}
              <span className="underline decoration-sky-300">24/QĐ-HSV</span> và{' '}
              <span className="underline decoration-sky-300">Thông báo 04/TB-HSV</span>.
            </p>
          </div>

          {/* Tóm tắt Hồ sơ Cán bộ đang đăng nhập */}
          <div className="bg-slate-950/35 border border-white/15 rounded-xl p-4 min-w-[260px] text-xs space-y-1.5">
            <div className="flex items-center justify-between text-sky-200 font-semibold">
              <span>Mã định danh / MSSV:</span>
              <span className="font-mono text-white">{currentPersona.studentId}</span>
            </div>
            <div className="flex items-center justify-between text-sky-200">
              <span>Khoa / Đơn vị gốc:</span>
              <span className="font-semibold text-white">
                {FACULTY_METADATA[currentPersona.facultyCode].shortCode} ({currentPersona.facultyCode})
              </span>
            </div>
            <div className="flex items-center justify-between text-sky-200">
              <span>Chức vụ BCH / BKT:</span>
              <span className="font-semibold text-amber-300">
                {currentPersona.bchRole !== 'Không'
                  ? currentPersona.bchRole
                  : currentPersona.bktRole}
              </span>
            </div>
            <div className="flex items-center justify-between text-sky-200">
              <span>Số vị trí kiêm nhiệm:</span>
              <span className="font-mono font-bold text-emerald-300">
                0{currentPersona.positions.length} vị trí
              </span>
            </div>
          </div>
        </div>

        {/* 4 KPI Cards Điều hành Real-time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-xs text-sky-200">
              <span>Hệ thống Chi hội (4 Khoa)</span>
              <Users className="w-4 h-4 text-sky-300" />
            </div>
            <div className="text-2xl font-extrabold font-mono mt-1.5">
              {BRANCH_UNITS.length} Chi hội
            </div>
            <div className="text-[11px] text-slate-300 mt-1">
              QTKD: 6 • KT: 6 • CNTT: 7 • KHSK: 6
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-xs text-sky-200">
              <span>CLB / Đội / Nhóm trực thuộc</span>
              <FolderKanban className="w-4 h-4 text-amber-300" />
            </div>
            <div className="text-2xl font-extrabold font-mono mt-1.5">
              {CLUB_UNITS.length} Đơn vị
            </div>
            <div className="text-[11px] text-slate-300 mt-1">
              02 đơn vị nòng cốt: CLB SV5T & Đội CTVXK
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-xs text-sky-200">
              <span>Cam kết SLA Cấp GCN (QĐ 28)</span>
              <Clock className="w-4 h-4 text-emerald-300" />
            </div>
            <div className="text-2xl font-extrabold font-mono mt-1.5">
              ≤ 07 ngày
            </div>
            <div className="text-[11px] text-emerald-200 mt-1">
              01 danh sách đang đếm ngược (Còn 04 ngày)
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-xs text-sky-200">
              <span>Tập thể SV5T Đạt chuẩn (QĐ 09)</span>
              <Award className="w-4 h-4 text-amber-300" />
            </div>
            <div className="text-2xl font-extrabold font-mono mt-1.5">
              {qualifiedCollectiveBranches.length}/{BRANCH_UNITS.length} Chi hội
            </div>
            <div className="text-[11px] text-slate-300 mt-1">
              100% ĐK • ≥ 30% Đạt SV5T • 0 Kỷ luật
            </div>
          </div>
        </div>
      </section>

      {/* 2. PHÂN HỆ DUYỆT NGÀY TÌNH NGUYỆN TRƯỚC 03 NGÀY & CẤP E-CERTIFICATE SLA 07 NGÀY (#certificates - QĐ 28/QĐ-HSV) */}
      <section
        id="certificates"
        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0054A6]">
              <FileBadge className="w-4 h-4" />
              Quy trình Pháp lý Khép kín • Quyết định 28/QĐ-HSV & Phụ lục 2 QĐ 09/QĐ-HSV
            </div>
            <h2 className="text-lg font-bold text-[#0B2545] mt-1">
              Thẩm định Ngày Tình nguyện (Trước ≥ 03 ngày) & Phát hành E-Certificate (SLA 07 ngày làm việc)
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Bước 1: Đơn vị gửi danh mục hoạt động qua <strong>Trưởng Ban TC-XDH (Đ/c Trần Thị Thu Huyền)</strong> trình Ban Thư ký trước ít nhất <strong>03 ngày</strong>. Bước 2: Sau sự kiện, nộp danh sách chuẩn <strong>Phụ lục 1 (tăng dần theo MSSV)</strong> để Văn phòng & BTK ban hành Quyết định kèm QR trong <strong>07 ngày làm việc</strong>.
            </p>
          </div>
          <Link
            href="/tra-cuu-gcn"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0054A6] text-xs font-bold shrink-0 transition-colors"
          >
            <QrCode className="w-4 h-4" />
            Xem Mẫu E-Certificate Phụ lục 2
          </Link>
        </div>

        {/* Bảng quy tắc nhân hệ số 1-2-3 tóm tắt */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
          <div className="flex items-start gap-2.5">
            <span className="px-2 py-0.5 rounded bg-[#0054A6] text-white font-mono font-bold">
              Hệ số ×3
            </span>
            <div>
              <div className="font-bold text-slate-800">Thành viên Ban Tổ chức (BTC)</div>
              <div className="text-slate-600">Nhân 3 lần số ngày tình nguyện gốc của hoạt động (Phụ lục 2 QĐ 09).</div>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="px-2 py-0.5 rounded bg-teal-600 text-white font-mono font-bold">
              Hệ số ×2
            </span>
            <div>
              <div className="font-bold text-slate-800">Cộng tác viên / Đội CTV Xung kích</div>
              <div className="text-slate-600">Nhân 2 lần số ngày tình nguyện gốc khi hỗ trợ hậu cần, lễ tân, truyền thông.</div>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="px-2 py-0.5 rounded bg-slate-700 text-white font-mono font-bold">
              Hệ số ×1
            </span>
            <div>
              <div className="font-bold text-slate-800">Hội viên / Sinh viên tham gia</div>
              <div className="text-slate-600">Tính 100% số ngày gốc (Hiến máu: 5.0 ngày/lần; Workshop ≤1 ngày: 0.5 ngày).</div>
            </div>
          </div>
        </div>

        {/* Danh sách các Sự kiện cần duyệt */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase bg-slate-50/70">
                <th className="py-3 px-3 font-bold">Chương trình / Đơn vị trình</th>
                <th className="py-3 px-3 font-bold">Khung Quy đổi (Phụ lục 2)</th>
                <th className="py-3 px-3 font-bold">Thẩm định Trước 03 Ngày</th>
                <th className="py-3 px-3 font-bold">Tiến độ Cấp GCN (SLA 07 ngày)</th>
                <th className="py-3 px-3 font-bold text-right">Thao tác Nghiệp vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {eventsState.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-3 max-w-xs">
                    <div className="font-bold text-[#0B2545] line-clamp-2">
                      {ev.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Đơn vị: <span className="font-medium text-slate-700">{ev.organizerUnit}</span> • Sĩ số: <span className="font-mono">{ev.registeredCount}/{ev.maxParticipants}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-slate-800">
                      {ev.volunteerCategory}
                    </div>
                    <div className="text-[11px] font-mono text-[#0054A6] font-bold mt-0.5">
                      Gốc: {ev.baseVolunteerDays.toFixed(1)} ngày (BTC: {(ev.baseVolunteerDays * 3).toFixed(1)}d | CTV: {(ev.baseVolunteerDays * 2).toFixed(1)}d)
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    {ev.preApprovalStatus === 'approved_3days_prior' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Đã duyệt trước ≥ 03 ngày
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3.5 h-3.5" />
                        Chờ Ban TC-XDH & BTK duyệt
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3">
                    {ev.certWorkflowStatus === 'decision_issued' && (
                      <div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-[#0054A6] border border-blue-200">
                          <FileCheck2 className="w-3.5 h-3.5" />
                          Đã cấp QĐ: {ev.decisionNumber}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-1">
                          Đã gắn QR & chữ &quot;(Đã ký)&quot;
                        </div>
                      </div>
                    )}
                    {ev.certWorkflowStatus === 'list_submitted_sla' && (
                      <div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          Đang chạy SLA: Còn 0{ev.slaDaysRemaining} ngày làm việc
                        </span>
                        <div className="text-[10px] text-slate-500 mt-1">
                          Đã kiểm chuẩn Phụ lục 1 (MSSV tăng dần)
                        </div>
                      </div>
                    )}
                    {ev.certWorkflowStatus === 'upcoming' && (
                      <span className="text-slate-500 text-[11px]">
                        Chưa diễn ra (Chờ nộp Phụ lục 1 sau SK)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    {ev.preApprovalStatus === 'pending_tcxdh' && (
                      <button
                        type="button"
                        onClick={() => handleApprove3DaysPrior(ev.id, ev.title)}
                        className="px-3 py-1.5 rounded-lg bg-[#0054A6] hover:bg-blue-800 text-white font-semibold text-xs shadow-xs transition-colors"
                      >
                        Duyệt Tờ trình (Trước 3 ngày)
                      </button>
                    )}
                    {ev.certWorkflowStatus === 'list_submitted_sla' && (
                      <button
                        type="button"
                        onClick={() => handleIssueDecisionAndCerts(ev.id, ev.title)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
                      >
                        Ký QĐ & Cấp E-Cert ({ev.registeredCount} SV)
                      </button>
                    )}
                    {ev.certWorkflowStatus === 'decision_issued' && (
                      <Link
                        href="/tra-cuu-gcn"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs"
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

      {/* 3. HỘI ĐỒNG XÉT CHỌN SINH VIÊN 5 TỐT 3 CẤP & LỌC TOP 10% TIÊU BIỂU TOÀN TRƯỜNG (#sv5t - QĐ 09/QĐ-HSV) */}
      <section
        id="sv5t"
        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700">
              <Award className="w-4 h-4 text-amber-600" />
              Hội đồng Xét duyệt 3 Cấp • Quyết định 09/QĐ-HSV (Sửa đổi, bổ sung năm 2026)
            </div>
            <h2 className="text-lg font-bold text-[#0B2545] mt-1">
              Xét chọn &quot;Sinh viên 5 Tốt&quot; Cấp Trường & Lọc Top 10% &quot;SV5T Tiêu biểu Toàn trường&quot;
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Quy tắc ưu tiên lọc <strong>Tối đa 10% SV5T Tiêu biểu Toàn trường</strong>: (1) Đạt giải cấp Tỉnh/Trung ương → (2) Có Giấy khen/Bằng khen → (3) Điểm rèn luyện cao hơn → (4) GPA năm học cao hơn → (5) Số ngày tình nguyện nhiều hơn.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setOnlyTop10Sv5t(!onlyTop10Sv5t)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                onlyTop10Sv5t
                  ? 'bg-amber-500 text-slate-950 border-amber-500'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              {onlyTop10Sv5t
                ? 'Đang lọc: Top 10% SV5T Tiêu biểu'
                : 'Lọc ứng viên Top 10% SV5T Tiêu biểu'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase bg-slate-50/70">
                <th className="py-3 px-3 font-bold">Ứng viên / Chi hội</th>
                <th className="py-3 px-3 font-bold">1. Đạo đức (≥80)</th>
                <th className="py-3 px-3 font-bold">2. Học tập (≥2.7 + NCKH)</th>
                <th className="py-3 px-3 font-bold">3. Thể lực (PL1)</th>
                <th className="py-3 px-3 font-bold">4. Tình nguyện (≥5d)</th>
                <th className="py-3 px-3 font-bold">5. Hội nhập (B1 + PL3)</th>
                <th className="py-3 px-3 font-bold">Xếp hạng Tiêu biểu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {displayedCandidates.map((c, idx) => (
                <tr key={c.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-[#0B2545]">{c.fullName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      MSSV: {c.studentId} • {c.branchCode} ({FACULTY_METADATA[c.facultyCode].shortCode})
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {c.ethicsScore}/100
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-mono font-bold text-[#0054A6]">
                      GPA: {c.gpaYear.toFixed(2)}/4.0
                    </div>
                    <div className="text-[11px] text-emerald-700">
                      ✓ Đạt 01 bài NCKH
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-[11px] text-slate-700">
                    {c.physicalCert}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-mono font-bold text-slate-900">
                      {c.volunteerDays.toFixed(1)} ngày
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-[11px] text-slate-700">
                    {c.englishLevel}
                  </td>
                  <td className="py-3.5 px-3">
                    {c.hasProvinceAward || c.hasMeritCert ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        <Sparkles className="w-3 h-3 text-amber-700" />
                        Top 10% Tiêu biểu (#{idx + 1})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Đạt chuẩn SV5T Trường
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. BẢNG THEO DÕI "TẬP THỂ SINH VIÊN 5 TỐT" 25 CHI HỘI (#collective-sv5t - QĐ 09/QĐ-HSV) */}
      <section
        id="collective-sv5t"
        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0054A6]">
              <FileSpreadsheet className="w-4 h-4" />
              Quản trị 25 Chi hội & 04 Cụm Khoa • Mục III Quyết định 09/QĐ-HSV
            </div>
            <h2 className="text-lg font-bold text-[#0B2545] mt-1">
              Bảng Theo dõi Danh hiệu &quot;Tập thể Sinh viên 5 Tốt&quot; (25 Chi hội trực thuộc)
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Điều kiện công nhận <strong>Tập thể Sinh viên 5 Tốt cấp Trường</strong>: (1) <strong>100%</strong> sinh viên thuộc đơn vị đăng ký tham gia phong trào; (2) Có ít nhất <strong>30%</strong> sinh viên đạt danh hiệu &quot;Sinh viên 5 Tốt&quot; cấp Trường trở lên; (3) Không có sinh viên vi phạm kỷ luật.
            </p>
          </div>

          {/* Bộ lọc 4 Cụm Khoa */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { code: 'ALL', label: 'Tất cả (25 Chi hội)' },
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
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  branchFacultyFilter === tab.code
                    ? 'bg-[#0054A6] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredBranches.map((branch) => {
            const isCollectiveQualified =
              branch.sv5tRegisteredRate === 100 &&
              branch.sv5tAchievedRate >= 30 &&
              !branch.hasDisciplineViolation;
            return (
              <div
                key={branch.id}
                className={`rounded-xl border p-4 transition-all ${
                  isCollectiveQualified
                    ? 'bg-emerald-50/30 border-emerald-200'
                    : 'bg-slate-50/60 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-sm text-[#0B2545]">
                      {branch.code}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        FACULTY_METADATA[branch.facultyCode].badgeClass
                      }`}
                    >
                      {FACULTY_METADATA[branch.facultyCode].shortCode} • K{branch.cohortYear}
                    </span>
                  </div>
                  {isCollectiveQualified ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ✓ Đạt Tập thể SV5T
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                      Cần thêm {30 - branch.sv5tAchievedRate}% SV đạt
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 mt-2 flex items-center justify-between">
                  <span>Cụm trưởng phụ trách:</span>
                  <strong className="text-slate-800">{branch.clusterLeaderName}</strong>
                </div>
                <div className="text-xs text-slate-600 mt-0.5 flex items-center justify-between">
                  <span>Chi hội trưởng:</span>
                  <span className="font-medium text-slate-800">
                    {branch.branchPresidentName || 'BCH Chi hội (05 đ/c)'}
                  </span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">Đăng ký SV5T: <strong>{branch.sv5tRegisteredRate}%</strong></span>
                    <span className="font-mono font-bold text-[#0054A6]">
                      Tỷ lệ đạt: {branch.sv5tAchievedRate}% (Mục tiêu ≥30%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        branch.sv5tAchievedRate >= 30 ? 'bg-emerald-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(branch.sv5tAchievedRate * 2, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. ĐIỀU PHỐI BAN TUYÊN GIÁO - PHONG TRÀO & ĐỘI CTV XUNG KÍCH (#tgpt - QĐ 24/QĐ-HSV) */}
      <section
        id="tgpt"
        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5"
      >
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0054A6]">
            <Megaphone className="w-4 h-4" />
            Đơn vị 03 • Ban Tuyên giáo - Phong trào (02 Mảng • 06 Tiểu ban • Đội CTV Xung kích)
          </div>
          <h2 className="text-lg font-bold text-[#0B2545] mt-1">
            Bảng Điều phối Tác nghiệp Truyền thông, Sự kiện & Đội Cộng tác viên Xung kích
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Thiết kế đúng cấu trúc thực tế tại <code className="text-[#0054A6] font-mono">CƠ CẤU TỔ CHỨC ĐẦY ĐỦ.html</code>: Tách biệt rõ <strong>Mảng Tuyên giáo</strong> (Đ/c Đặng Trí Toàn) và <strong>Mảng Phong trào</strong> (Đ/c Nguyễn Mai Gia Tường), trong đó <strong>Đội CTV Xung kích</strong> trực thuộc Mảng Phong trào và quản lý trực tiếp 02 tiểu ban hiện trường.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Mảng Tuyên giáo */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-[#0054A6] text-white text-xs font-bold">
                MẢNG TUYÊN GIÁO (TRUYỀN THÔNG SỐ)
              </span>
              <span className="text-xs font-mono font-semibold text-slate-600">
                03 Tiểu ban chuyên môn
              </span>
            </div>
            <div className="text-xs space-y-1 text-slate-700">
              <div>
                • <strong>Trưởng mảng (Trưởng ban):</strong> Đ/c Đặng Trí Toàn (UV BCH, Phó BKT, CHT 25CNTT02)
              </div>
              <div>
                • <strong>02 Phó ban Tuyên giáo:</strong> Đ/c Võ Chí Kiên (UV BCH) & Đ/c Liêu Gia Kỳ (UV BCH)
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              {[
                {
                  name: 'Tiểu ban Design',
                  desc: 'Ấn phẩm đồ họa, Bộ nhận diện SV5T & Sự kiện',
                  tasks: '04 ấn phẩm đang thiết kế',
                },
                {
                  name: 'Tiểu ban Video',
                  desc: 'Reels/TikTok, Trailer & Recap truyền thông',
                  tasks: '02 video hậu kỳ',
                },
                {
                  name: 'Tiểu ban Photo',
                  desc: 'Phóng sự ảnh hiện trường & Lưu trữ tư liệu số',
                  tasks: '03 ca trực chụp ảnh',
                },
              ].map((tb) => (
                <div
                  key={tb.name}
                  className="bg-white p-3 rounded-lg border border-slate-200 space-y-1"
                >
                  <div className="font-bold text-xs text-[#0B2545]">{tb.name}</div>
                  <div className="text-[11px] text-slate-500 leading-snug">{tb.desc}</div>
                  <div className="text-[10px] font-mono font-semibold text-[#0054A6] pt-1">
                    {tb.tasks}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mảng Phong trào & Đội CTV Xung kích */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-[#0B2545] text-white text-xs font-bold">
                MẢNG PHONG TRÀO & ĐỘI CTV XUNG KÍCH
              </span>
              <span className="text-xs font-mono font-semibold text-[#0054A6]">
                03 Tiểu ban + Đội CTVXK (02 Tiểu ban)
              </span>
            </div>
            <div className="text-xs space-y-1 text-slate-700">
              <div>
                • <strong>Trưởng mảng (Trưởng ban):</strong> Đ/c Nguyễn Mai Gia Tường (UV BTK, Chủ nhiệm CLB SV5T)
              </div>
              <div>
                • <strong>02 Phó ban Phong trào:</strong> Đ/c Nguyễn Thị Thúy Nhi (UV BKT) & Đ/c Nguyễn Thanh Đạt (Đội trưởng Đội CTVXK)
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {[
                {
                  name: 'Tiểu ban Tài chính',
                  desc: 'Dự trù kinh phí, vận động tài trợ & quyết toán',
                },
                {
                  name: 'Tiểu ban Nội dung - Kịch bản',
                  desc: 'Kịch bản chương trình, format hội thi & điều phối',
                },
                {
                  name: 'Tiểu ban MC',
                  desc: 'Dẫn chương trình song ngữ & hoạt náo sự kiện',
                },
              ].map((tb) => (
                <div
                  key={tb.name}
                  className="bg-white p-3 rounded-lg border border-slate-200 space-y-1"
                >
                  <div className="font-bold text-xs text-[#0B2545]">{tb.name}</div>
                  <div className="text-[11px] text-slate-500 leading-snug">{tb.desc}</div>
                </div>
              ))}
            </div>

            {/* Khối Đội CTV Xung kích trực thuộc Mảng Phong trào */}
            <div className="bg-white rounded-xl p-3.5 border-2 border-[#0054A6]/30 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-bold text-xs text-[#0054A6] flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  ĐỘI CỘNG TÁC VIÊN XUNG KÍCH (ĐỘI CTVXK – NÒNG CỐT HỘI)
                </div>
                <Link
                  href="/to-chuc/doi-cong-tac-vien-xung-kich"
                  className="text-[11px] font-semibold text-[#0054A6] underline"
                >
                  Mở Micro-site Đội CTVXK →
                </Link>
              </div>
              <p className="text-[11px] text-slate-600">
                Do <strong>Đ/c Nguyễn Thanh Đạt</strong> (Phó Ban TG-PT Mảng Phong trào kiêm Đội trưởng) trực tiếp chỉ huy, quản lý <strong>02 Tiểu ban tác chiến hiện trường</strong>:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-bold text-slate-800">
                    1. Tiểu ban Hậu cần - Sân khấu
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Thiết lập âm thanh, ánh sáng, bàn ghế, trực kỹ thuật sân khấu & môi trường xanh.
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-bold text-slate-800">
                    2. Tiểu ban Lễ tân - Khánh tiết - Văn thể mỹ
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Đón tiếp đại biểu, trao giải thưởng, tiết mục văn nghệ xung kích & nghi thức Hội.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. QUẢN TRỊ VĂN PHÒNG 206.B06, LỊCH TRỰC & ĐÓNG DẤU MỘC (#office - QĐ 24/QĐ-HSV) */}
      <section
        id="office"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* Lịch trực Phòng 206.B06 */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0054A6]">
              <Building2 className="w-4 h-4" />
              Đơn vị 01 • Văn phòng Hội Sinh viên Trường (Phòng 206.B06)
            </div>
            <h2 className="text-base font-bold text-[#0B2545] mt-1">
              Lịch Trực Văn phòng 206.B06 & Điều hành Song hành (Chánh VP & Tổng Thư ký)
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Cấp điều hành cao nhất của Văn phòng gồm <strong>01 Chánh Văn phòng</strong> (Đ/c Nguyễn Mỹ Hạnh – phụ trách đối ngoại) và <strong>01 Tổng Thư ký</strong> (Đ/c Nguyễn Như Quỳnh – phụ trách nội bộ) ngang cấp, cùng <strong>02 Phó Chánh Văn phòng</strong> (Đ/c Phạm Thị Hồng Ngọc, Đ/c Lê Thị Hải Yến).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase bg-slate-50">
                  <th className="py-2.5 px-3 font-bold">Thứ</th>
                  <th className="py-2.5 px-3 font-bold">Ca Sáng (08:00 – 11:30)</th>
                  <th className="py-2.5 px-3 font-bold">Ca Chiều (13:30 – 16:30)</th>
                  <th className="py-2.5 px-3 font-bold">Trạng thái 206.B06</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {OFFICE_SHIFTS.map((s) => (
                  <tr key={s.day}>
                    <td className="py-2.5 px-3 font-bold text-[#0B2545]">{s.day}</td>
                    <td className="py-2.5 px-3 text-slate-700">{s.morning}</td>
                    <td className="py-2.5 px-3 text-slate-700">{s.afternoon}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-[#0054A6]">
                        {s.roomStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sổ Quản lý Con dấu (Mộc) & Tài sản (QĐ 24/QĐ-HSV) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700">
              <Stamp className="w-4 h-4" />
              Quản lý Con dấu (Mộc) & Văn thư Lưu trữ
            </div>
            <h2 className="text-base font-bold text-[#0B2545] mt-1">
              Nhật ký Đóng dấu Pháp lý & Cấp Số Công văn
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Mọi văn bản đóng dấu Hội Sinh viên Trường đều tự động sinh mã tra cứu QR chống giả mạo theo Điều 4 Quyết định 24/QĐ-HSV.
            </p>
          </div>

          <div className="space-y-3">
            {SEAL_LOGS.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#0054A6]">
                    Số hiệu: {log.docNumber}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {log.date}
                  </span>
                </div>
                <div className="font-bold text-slate-800">{log.docTitle}</div>
                <div className="text-[11px] text-slate-600">
                  Người ký: <strong>{log.approvedBy}</strong> • Văn thư đóng dấu: <strong>{log.stampedBy}</strong>
                </div>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. HỌP KHÔNG GIẤY (QĐ 23/QĐ-HSV) & HỘP THƯ BAN KIỂM TRA (#meetings & #voice) */}
      <section
        id="meetings"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Họp không giấy (Paperless Meeting) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0054A6]">
                <CalendarCheck className="w-4 h-4" />
                Quy chế BCH 23/QĐ-HSV • Chế độ Họp Định kỳ
              </div>
              <h2 className="text-base font-bold text-[#0B2545] mt-1">
                Phòng Họp Không Giấy (Paperless Meeting)
              </h2>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              100% Tài liệu số QR
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0054A6]">
                  Hội nghị Ban Thư ký Thường kỳ Tháng 11/2026
                </span>
                <span className="font-mono text-[11px] font-semibold text-slate-600">
                  Phòng 206.B06
                </span>
              </div>
              <p className="text-slate-600">
                Chủ trì: <strong>Đ/c Trương Châu Phước Lộc</strong> (Chủ tịch HSV) • Thành phần: 05 đ/c Ban Thư ký & Chánh Văn phòng.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] font-medium">
                  Đã tải lên 04 Dự thảo Kế hoạch
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                  Biểu quyết Điện tử sẵn sàng
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">
                  Hội nghị Ban Chấp hành Mở rộng Quý IV/2026 (15 đ/c BCH & 05 đ/c BKT)
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  Định kỳ 3 tháng/lần
                </span>
              </div>
              <p className="text-slate-600">
                Nội dung: Sơ kết công tác Hội học kỳ Thu, rà soát chỉ tiêu Tập thể SV5T của 25 Chi hội và hoạt động của {OFFICIAL_DOCUMENTS.length} văn bản chỉ đạo.
              </p>
            </div>
          </div>
        </div>

        {/* Hộp thư Lắng nghe Sinh viên & Ban Kiểm tra (#voice) */}
        <div
          id="voice"
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700">
                <MessageSquareWarning className="w-4 h-4" />
                Ban Kiểm tra HSV Trường (05 đ/c) & Ban TG-PT
              </div>
              <h2 className="text-base font-bold text-[#0B2545] mt-1">
                Hộp thư Lắng nghe Sinh viên & Giám sát Nội bộ
              </h2>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
              Trưởng BKT: Đ/c Trần Thị Thu Huyền
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              {
                id: 'fb-01',
                sender: 'Ẩn danh (Sinh viên Khoa Khoa học Sức khỏe - KHSK)',
                topic: 'Đề xuất mở thêm khung giờ Kiểm tra Thể lực Sinh viên Khỏe buổi chiều muộn cho SV đi thực tập bệnh viện',
                status: 'Đã chuyển Mảng Phong trào xử lý',
                time: '2 giờ trước',
              },
              {
                id: 'fb-02',
                sender: 'Chi hội 25CNTT01 (Khoa Công nghệ Thông tin)',
                topic: 'Kiến nghị tích hợp xuất tự động danh sách Phụ lục 1 (sắp xếp MSSV tăng dần) từ dữ liệu điểm danh QR',
                status: 'Đã triển khai trên Cổng thông tin Khóa II',
                time: '1 ngày trước',
              },
              {
                id: 'fb-03',
                sender: 'CLB Cộng đồng Sinh viên 5 tốt',
                topic: 'Xin ý kiến hướng dẫn quy đổi điểm kỹ năng thực hành xã hội (Phụ lục 3 QĐ 09) cho chuỗi Workshop Kỹ năng số',
                status: 'Ban TC-XDH đang thẩm định',
                time: '2 ngày trước',
              },
            ].map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">{item.sender}</span>
                  <span>{item.time}</span>
                </div>
                <div className="font-bold text-[#0B2545]">{item.topic}</div>
                <div className="pt-1 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0054A6]">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {item.status}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Ban Kiểm tra ({STAFF_MEMBERS.filter((s) => s.bktRole !== 'Không').length} đ/c) giám sát
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
