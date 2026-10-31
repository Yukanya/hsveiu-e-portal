'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SubpageBanner } from '@/components/public/subpage-banner';
import { EVENT_ITEMS } from '@/data/mock-data';
import { useRole } from '@/context/role-context';
import { EventItem } from '@/types';
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck2,
  Leaf,
  MapPin,
  QrCode,
  ShieldCheck,
  Users,
} from 'lucide-react';

type StatusFilter =
  | 'ALL'
  | 'upcoming'
  | 'list_submitted_sla'
  | 'decision_issued';

type CriterionFilter = 'ALL' | EventItem['sv5tCriterion'];

const STATUS_PILLS: { id: StatusFilter; label: string }[] = [
  { id: 'ALL', label: 'Tất cả chương trình' },
  { id: 'upcoming', label: 'Đang mở đăng ký' },
  { id: 'list_submitted_sla', label: 'Đang xử lý SLA 07 ngày' },
  { id: 'decision_issued', label: 'Đã cấp Quyết định GCN' },
];

const CRITERION_OPTIONS: CriterionFilter[] = [
  'ALL',
  'Tình nguyện tốt',
  'Học tập tốt',
  'Thể lực tốt',
  'Hội nhập tốt',
  'Đạo đức tốt',
];

function formatViDateBlock(iso: string): {
  dayMonth: string;
  timeRange: string;
  fullText: string;
} {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return {
    dayMonth: `${dd}/${mm}`,
    timeRange: `${hh}:${min}`,
    fullText: `${dd}/${mm}/${d.getFullYear()} • ${hh}:${min}`,
  };
}

function SuKienContent({
  initialEventId,
  initialStatus,
}: {
  initialEventId: string;
  initialStatus: StatusFilter;
}) {
  const { currentPersona } = useRole();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatus);
  const [criterionFilter, setCriterionFilter] =
    useState<CriterionFilter>('ALL');
  const [selectedEventId, setSelectedEventId] =
    useState<string>(initialEventId);
  const [roleMultiplier, setRoleMultiplier] = useState<1 | 2 | 3>(1);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);

  const filteredEvents = EVENT_ITEMS.filter((ev) => {
    const matchStatus =
      statusFilter === 'ALL' || ev.certWorkflowStatus === statusFilter;
    const matchCrit =
      criterionFilter === 'ALL' || ev.sv5tCriterion === criterionFilter;
    return matchStatus && matchCrit;
  });

  const selectedEvent =
    EVENT_ITEMS.find((e) => e.id === selectedEventId) ||
    filteredEvents[0] ||
    EVENT_ITEMS[0];

  const isMultiplierEligible = Boolean(
    selectedEvent.isUnionWorkMultiplierEligible
  );
  const effectiveMultiplier: 1 | 2 | 3 = isMultiplierEligible
    ? roleMultiplier
    : 1;
  const computedVolunteerDays =
    selectedEvent.baseVolunteerDays * effectiveMultiplier;

  const isRegistered = registeredIds.includes(selectedEvent.id);

  const handleRegister = (id: string) => {
    if (!registeredIds.includes(id)) {
      setRegisteredIds([...registeredIds, id]);
    }
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <SubpageBanner
        kicker="ĐĂNG KÝ 1-CHẠM • QUY ĐỔI NGÀY TÌNH NGUYỆN • CAM KẾT SLA 07 NGÀY (28/QĐ-HSV)"
        title="Lịch Sự kiện, Phong trào & Hoạt động Tình nguyện"
        subtitle="Đăng ký trực tuyến bằng tài khoản @eiu.edu.vn, minh bạch chủ trương duyệt trước 03 ngày và quy trình cấp E-Certificate gắn QR"
        breadcrumbs={[{ label: 'Sự kiện & Tình nguyện' }]}
      />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-9 space-y-10">
        {/* Thanh lọc trạng thái vòng đời QĐ 28 & Tiêu chuẩn SV5T */}
        <div className="bg-white border border-slate-200 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {STATUS_PILLS.map((pill) => {
              const active = statusFilter === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setStatusFilter(pill.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer font-eiu-display ${
                    active
                      ? 'bg-[#C10230] text-white border-[#C10230]'
                      : 'bg-[#F5F5F5] text-[#133F68] border-slate-300 hover:border-[#133F68]'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label
              htmlFor="sv5t-crit-filter"
              className="text-xs font-bold text-[#133F68] font-eiu-display"
            >
              Tiêu chuẩn SV5T:
            </label>
            <select
              id="sv5t-crit-filter"
              value={criterionFilter}
              onChange={(e) =>
                setCriterionFilter(e.target.value as CriterionFilter)
              }
              className="h-9 px-3 bg-white border border-slate-300 rounded text-xs font-semibold text-[#133F68]"
            >
              {CRITERION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'ALL' ? 'Tất cả 05 tiêu chuẩn' : opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* BỐ CỤC MASTER-DETAIL 7/5: CỘT TRÁI DANH MỤC THẺ SỰ KIỆN • CỘT PHẢI ĐĂNG KÝ 1-CHẠM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* CỘT TRÁI (7/12): Danh mục Sự kiện trực quan */}
          <div className="lg:col-span-7 space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="bg-white border border-slate-200 p-10 text-center space-y-3">
                <p className="text-sm font-bold text-[#133F68] font-eiu-display">
                  Không có chương trình nào khớp với bộ lọc hiện tại
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('ALL');
                    setCriterionFilter('ALL');
                  }}
                  className="px-4 py-2 bg-[#133F68] text-white text-xs font-bold uppercase cursor-pointer"
                >
                  Xem toàn bộ {EVENT_ITEMS.length} chương trình
                </button>
              </div>
            ) : (
              filteredEvents.map((ev) => {
                const isSelected = ev.id === selectedEvent.id;
                const dateInfo = formatViDateBlock(ev.startTime);
                const fillPct = Math.min(
                  100,
                  Math.round(
                    ((ev.registeredCount +
                      (registeredIds.includes(ev.id) ? 1 : 0)) /
                      ev.maxParticipants) *
                      100
                  )
                );

                return (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => setSelectedEventId(ev.id)}
                    className={`w-full text-left bg-white border transition-colors p-4 sm:p-5 cursor-pointer flex flex-col sm:flex-row gap-4 ${
                      isSelected
                        ? 'border-2 border-[#133F68] shadow-xs'
                        : 'border-slate-200 hover:border-[#0054A6]'
                    }`}
                  >
                    {/* Khối Ngày Tháng Kiến trúc EIU */}
                    <div
                      className={`sm:w-22 shrink-0 p-3 flex sm:flex-col items-center justify-between sm:justify-center text-center ${
                        ev.certWorkflowStatus === 'decision_issued'
                          ? 'bg-[#51803A] text-white'
                          : ev.certWorkflowStatus === 'list_submitted_sla'
                          ? 'bg-[#A68556] text-white'
                          : 'bg-[#133F68] text-white'
                      }`}
                    >
                      <span className="text-lg font-extrabold font-mono leading-none">
                        {dateInfo.dayMonth}
                      </span>
                      <span className="text-[11px] font-mono text-white/85 sm:mt-1.5">
                        {dateInfo.timeRange}
                      </span>
                      <span className="text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-black/20 sm:mt-2 font-eiu-display">
                        {ev.certWorkflowStatus === 'decision_issued'
                          ? ev.decisionNumber
                          : ev.certWorkflowStatus === 'list_submitted_sla'
                          ? `SLA 0${ev.slaDaysRemaining}N`
                          : 'MỞ ĐƠN'}
                      </span>
                    </div>

                    {/* Nội dung tóm tắt thẻ sự kiện */}
                    <div className="min-w-0 flex-1 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-[#0054A6]/10 text-[#0054A6] text-[10.5px] font-bold uppercase font-eiu-display">
                          SV5T: {ev.sv5tCriterion}
                        </span>

                        {ev.isGreenEvent && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10.5px] font-semibold">
                            <Leaf className="w-3 h-3" />
                            <span>Sự kiện Xanh SDGs</span>
                          </span>
                        )}

                        <span
                          className={`px-2 py-0.5 text-[10.5px] font-mono font-bold ${
                            ev.preApprovalStatus === 'approved_3days_prior'
                              ? 'bg-[#EAE3D2] text-[#133F68]'
                              : 'bg-amber-50 border border-amber-200 text-amber-800'
                          }`}
                        >
                          {ev.preApprovalStatus === 'approved_3days_prior'
                            ? '✓ Đã duyệt trước 03 ngày'
                            : '⏳ Chờ Ban TC-XDH duyệt'}
                        </span>
                      </div>

                      <h3 className="text-[15.5px] font-bold text-[#133F68] leading-snug font-eiu-display">
                        {ev.title}
                      </h3>

                      <div className="text-xs text-slate-600 space-y-1">
                        <div>
                          Đơn vị tổ chức:{' '}
                          <strong className="text-slate-800">
                            {ev.organizerUnit}
                          </strong>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-[#C10230] shrink-0" />
                          <span className="truncate">{ev.location}</span>
                        </div>
                      </div>

                      {/* Thanh sĩ số & Quy đổi ngày TN gốc */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-slate-600">
                            Sĩ số:{' '}
                            <strong>
                              {ev.registeredCount +
                                (registeredIds.includes(ev.id) ? 1 : 0)}
                              /{ev.maxParticipants}
                            </strong>
                          </span>
                          <div className="w-20 h-1.5 bg-slate-200 overflow-hidden">
                            <div
                              className="h-full bg-[#0054A6]"
                              style={{ width: `${fillPct}%` }}
                            />
                          </div>
                        </div>

                        <span className="font-mono font-bold text-[#C10230]">
                          +{ev.baseVolunteerDays.toFixed(1)} ngày gốc
                          {ev.isUnionWorkMultiplierEligible
                            ? ' (Hệ số 1–2–3)'
                            : ' (Cố định)'}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* CỘT PHẢI (5/12): Bảng Đăng ký 1-Chạm & Theo dõi SLA Quyết định 28/QĐ-HSV */}
          <aside className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
            <div className="bg-white border-2 border-[#133F68]">
              {/* Thanh tiêu đề trạng thái */}
              <div className="bg-[#133F68] text-white px-5 py-3.5 flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider font-eiu-display">
                  Phiếu Đăng ký &amp; Quy đổi Ngày TN
                </span>
                <span
                  className={`px-2 py-0.5 text-[10.5px] font-mono font-bold uppercase ${
                    selectedEvent.certWorkflowStatus === 'decision_issued'
                      ? 'bg-[#51803A] text-white'
                      : selectedEvent.certWorkflowStatus ===
                        'list_submitted_sla'
                      ? 'bg-[#FCB900] text-[#02294E]'
                      : 'bg-[#00BCFF] text-[#02294E]'
                  }`}
                >
                  {selectedEvent.certWorkflowStatus === 'decision_issued'
                    ? `ĐÃ BAN HÀNH ${selectedEvent.decisionNumber}`
                    : selectedEvent.certWorkflowStatus === 'list_submitted_sla'
                    ? `ĐANG XỬ LÝ SLA (CÒN 0${selectedEvent.slaDaysRemaining} NGÀY)`
                    : 'ĐANG MỞ ĐĂNG KÝ'}
                </span>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <div className="space-y-1.5 pb-3 border-b border-slate-200">
                  <div className="text-[11px] font-bold uppercase text-[#0054A6] font-eiu-display">
                    {selectedEvent.category} • SV5T:{' '}
                    {selectedEvent.sv5tCriterion}
                  </div>
                  <h2 className="text-base font-bold text-[#133F68] leading-snug font-eiu-display">
                    {selectedEvent.title}
                  </h2>
                  <div className="text-slate-600 space-y-1 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#A68556] shrink-0" />
                      <span className="font-mono">
                        {formatViDateBlock(selectedEvent.startTime).fullText}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C10230] shrink-0" />
                      <span>{selectedEvent.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#0054A6] shrink-0" />
                      <span>Đơn vị: {selectedEvent.organizerUnit}</span>
                    </div>
                  </div>
                </div>

                {/* Khối Quy đổi Ngày tình nguyện chuẩn Phụ lục 2 QĐ 09/QĐ-HSV */}
                <div className="bg-[#F8FAFC] border border-slate-200 p-4 space-y-3">
                  <div className="font-bold text-[#133F68] uppercase tracking-wider text-[11px] font-eiu-display">
                    Quy đổi Ngày tình nguyện (Phụ lục 2, QĐ 09/QĐ-HSV)
                  </div>
                  <div className="text-slate-700">
                    Nhóm hoạt động:{' '}
                    <strong>{selectedEvent.volunteerCategory}</strong>
                  </div>

                  {isMultiplierEligible ? (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="role-multiplier-select"
                        className="block font-bold text-slate-900"
                      >
                        Chọn vai trò tham gia (Lĩnh vực 06 — Công tác Đoàn –
                        Hội):
                      </label>
                      <select
                        id="role-multiplier-select"
                        value={roleMultiplier}
                        onChange={(e) =>
                          setRoleMultiplier(
                            Number(e.target.value) as 1 | 2 | 3
                          )
                        }
                        className="w-full h-9 px-3 border border-slate-300 rounded bg-white text-slate-900 font-semibold"
                      >
                        <option value={1}>
                          Hệ số ×1 — CTV hỗ trợ / Chiến sĩ / Sinh viên tham gia
                        </option>
                        <option value={2}>
                          Hệ số ×2 — Thành viên Ban Tổ chức chương trình
                        </option>
                        <option value={3}>
                          Hệ số ×3 — Trưởng / Phó các Ban, Đội, Đội hình BTC
                        </option>
                      </select>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-white border border-slate-200 text-slate-700 leading-relaxed">
                      <strong>Quy đổi cố định (Hệ số ×1):</strong> Chương trình
                      thuộc nhóm ngoài <em>06 - Công tác Đoàn – Hội</em> nên ghi
                      nhận cố định{' '}
                      <strong className="font-mono text-[#C10230]">
                        +{selectedEvent.baseVolunteerDays.toFixed(1)} ngày/lần
                      </strong>
                      , không nhân hệ số 1 – 2 – 3.
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      Số ngày dự kiến ghi nhận:
                    </span>
                    <span className="text-base font-extrabold font-mono text-[#C10230]">
                      +{computedVolunteerDays.toFixed(1)} ngày TN
                    </span>
                  </div>
                </div>

                {/* Thông tin Hội viên SSO */}
                <div className="border border-slate-200 p-3.5 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10.5px] uppercase text-slate-500 font-bold">
                      Tài khoản Hội viên SSO
                    </div>
                    <div className="font-bold text-[#133F68]">
                      {currentPersona.fullName}
                    </div>
                    <div className="font-mono text-[11px] text-slate-600">
                      MSSV: {currentPersona.studentId} • {currentPersona.email}
                    </div>
                  </div>
                  <QrCode className="w-8 h-8 text-[#133F68] shrink-0" />
                </div>

                {/* Hành động theo đúng vòng đời sự kiện */}
                {selectedEvent.certWorkflowStatus === 'upcoming' ||
                selectedEvent.certWorkflowStatus === 'ongoing' ? (
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => handleRegister(selectedEvent.id)}
                      className={`w-full py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer font-eiu-display ${
                        isRegistered
                          ? 'bg-[#51803A] text-white'
                          : 'bg-[#0054A6] hover:bg-[#133F68] text-white'
                      }`}
                    >
                      {isRegistered
                        ? '✓ Đã ghi nhận đăng ký & Cấp mã QR Check-in'
                        : 'Đăng ký tham gia 1-Chạm'}
                    </button>
                    {isRegistered && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium leading-relaxed">
                        Hồ sơ của <strong>{currentPersona.fullName}</strong> đã
                        được đồng bộ vào danh sách điểm danh QR. Bạn có thể mở
                        mã QR tại{' '}
                        <Link
                          href="/portal?tab=certs"
                          className="font-bold underline"
                        >
                          Sổ tay Hội viên
                        </Link>
                        .
                      </div>
                    )}
                  </div>
                ) : selectedEvent.certWorkflowStatus ===
                  'list_submitted_sla' ? (
                  <div className="p-4 bg-[#FFF9F0] border-l-4 border-[#A68556] space-y-1.5">
                    <div className="font-bold text-[#133F68] flex items-center gap-1.5 uppercase font-eiu-display">
                      <Clock className="w-4 h-4 text-[#A68556]" />
                      <span>
                        Đã đóng đăng ký — Đang thẩm định SLA 07 ngày làm việc
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      Đơn vị tổ chức đã nộp danh sách <strong>Phụ lục 1</strong>{' '}
                      (sắp xếp tăng dần MSSV). Văn phòng Hội 206.B06 và Ban Thư
                      ký sẽ ban hành Quyết định công nhận trong tối đa{' '}
                      <strong>
                        0{selectedEvent.slaDaysRemaining} ngày làm việc
                      </strong>{' '}
                      tới.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-50 border-l-4 border-[#51803A] space-y-2.5">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5 uppercase font-eiu-display">
                      <CheckCircle2 className="w-4 h-4 text-[#51803A]" />
                      <span>
                        Đã ban hành Quyết định {selectedEvent.decisionNumber} &amp;
                        Cấp E-Certificate
                      </span>
                    </div>
                    <p className="text-emerald-900/90 leading-relaxed">
                      Chương trình đã hoàn tất và kích hoạt mã QR xác thực trực
                      tuyến cho toàn bộ danh sách Phụ lục 1.
                    </p>
                    <Link
                      href={`/tra-cuu-gcn?q=${encodeURIComponent(
                        selectedEvent.decisionNumber || '32/QĐ-HSV'
                      )}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#133F68] hover:bg-[#0054A6] text-white text-xs font-bold uppercase tracking-wider font-eiu-display"
                    >
                      <span>Tra cứu Phụ lục 1 &amp; E-Cert</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* QUY TRÌNH 5 BƯỚC CHUẨN QUYẾT ĐỊNH 28/QĐ-HSV */}
        <section
          id="quy-trinh-qd28"
          className="bg-white border border-slate-200 p-6 sm:p-7 space-y-5 scroll-mt-24"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#C10230]">
                QUYẾT ĐỊNH 28/QĐ-HSV &amp; PHỤ LỤC 2 QUYẾT ĐỊNH 09/QĐ-HSV
              </span>
              <h2 className="text-lg sm:text-xl font-bold uppercase text-[#133F68] font-eiu-display mt-0.5">
                Quy trình 05 Bước Công nhận Ngày Tình nguyện &amp; Cấp
                E-Certificate
              </h2>
            </div>
            <Link
              href="/van-ban?doc=28/QĐ-HSV"
              className="text-xs font-bold uppercase text-[#0054A6] hover:text-[#C10230] inline-flex items-center gap-1 font-eiu-display"
            >
              <span>XEM TOÀN VĂN 28/QĐ-HSV</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                step: 'BƯỚC 01',
                title: 'Trình trước ≥ 03 ngày',
                desc: 'Cơ sở Hội gửi tờ trình qua Trưởng Ban TC-XDH trình Ban Thư ký duyệt chủ trương ngày TN trước sự kiện ít nhất 72 giờ.',
                icon: ShieldCheck,
              },
              {
                step: 'BƯỚC 02',
                title: 'Đăng ký & QR Check-in',
                desc: 'Sinh viên đăng ký 1-chạm bằng tài khoản @eiu.edu.vn và quét QR điểm danh hai chiều tại sự kiện.',
                icon: QrCode,
              },
              {
                step: 'BƯỚC 03',
                title: 'Xuất Phụ lục 1 (MSSV ↑)',
                desc: 'Hệ thống tự động xuất danh sách Mẫu Phụ lục 1 bắt buộc sắp xếp tăng dần theo Mã số sinh viên 10 chữ số.',
                icon: FileCheck2,
              },
              {
                step: 'BƯỚC 04',
                title: 'Thẩm định SLA ≤ 07 ngày',
                desc: 'Văn phòng 206.B06 và Ban Thư ký rà soát, ký ban hành Quyết định công nhận trong tối đa 07 ngày làm việc.',
                icon: Clock,
              },
              {
                step: 'BƯỚC 05',
                title: 'Cấp E-Cert Phụ lục 2',
                desc: 'Phát hành Giấy chứng nhận điện tử gắn mã QR trỏ về Quyết định gốc, STT khớp Phụ lục 1 và ghi chữ "(Đã ký)".',
                icon: Award,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="bg-[#F8FAFC] border border-slate-200 p-4 space-y-2 border-t-3 border-t-[#133F68]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-[#C10230]">
                      {item.step}
                    </span>
                    <Icon className="w-4 h-4 text-[#0054A6]" />
                  </div>
                  <h3 className="text-xs font-bold uppercase text-[#133F68] font-eiu-display">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function SuKienSearchBridge() {
  const searchParams = useSearchParams();
  const rawEvent = searchParams.get('event');
  const rawStatus = searchParams.get('status') as StatusFilter | null;

  const validStatus: StatusFilter =
    rawStatus && STATUS_PILLS.some((p) => p.id === rawStatus)
      ? rawStatus
      : 'ALL';

  const matchingEvents =
    validStatus === 'ALL'
      ? EVENT_ITEMS
      : EVENT_ITEMS.filter((e) => e.certWorkflowStatus === validStatus);

  const validEventId =
    rawEvent && EVENT_ITEMS.some((e) => e.id === rawEvent)
      ? rawEvent
      : (matchingEvents[0] || EVENT_ITEMS[0]).id;

  return (
    <SuKienContent
      key={`${validStatus}::${validEventId}`}
      initialEventId={validEventId}
      initialStatus={validStatus}
    />
  );
}

export default function SuKienPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1140px] mx-auto px-4 py-16 text-center text-sm text-slate-500">
          Đang tải lịch Sự kiện &amp; Hoạt động Tình nguyện...
        </div>
      }
    >
      <SuKienSearchBridge />
    </Suspense>
  );
}
