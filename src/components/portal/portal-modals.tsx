'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AwardProgramItem, ClubUnit, IssuedCertificateRecord, StaffMember } from '@/types';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { DeterministicQrCode } from '@/components/shared/deterministic-qr';
import { CertificatePreviewPhuLuc2 } from '@/components/shared/certificate-preview';
import {
  AwardApplicationSnapshot,
  ExternalEvidenceRecord,
  SubmittedAwardApplication,
  VoiceTicketRecord,
} from '@/lib/portal-storage';
import {
  CheckCircle2,
  Printer,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';

/* ============================================================================
   1. MODAL THẺ HỘI VIÊN SỐ PHÓNG TO (QR CHECK-IN NHANH 1 CHẠM)
   ============================================================================ */
export function MemberQrPassModal({
  open,
  onClose,
  persona,
  facultyName,
  unitName,
}: {
  open: boolean;
  onClose: () => void;
  persona: StaffMember;
  facultyName: string;
  unitName: string;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, modalRef, onClose);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#02294E]/75 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-qr-modal-title"
        tabIndex={-1}
        className="bg-white border-2 border-[#133F68] w-full max-w-md shadow-2xl overflow-hidden focus:outline-none"
      >
        <div className="bg-[#133F68] eiu-arch-pattern text-white px-5 py-4 flex items-center justify-between gap-3 border-b-3 border-[#A68556]">
          <div className="flex items-center gap-3 min-w-0">
            <Image
              src="/images/eiu-logo-shorten-white.png"
              alt="EIU"
              width={78}
              height={26}
              className="w-[78px] h-6 object-contain shrink-0"
            />
            <span className="h-5 w-px bg-white/30 shrink-0" aria-hidden="true" />
            <Image
              src="/images/hsv-logo.png"
              alt="HSV"
              width={26}
              height={26}
              className="h-6 w-6 object-contain shrink-0"
            />
            <h2
              id="member-qr-modal-title"
              className="text-xs font-bold uppercase tracking-wider font-eiu-display truncate"
            >
              THẺ HỘI VIÊN ĐIỆN TỬ
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng thẻ QR Hội viên"
            className="min-h-11 min-w-11 inline-flex items-center justify-center text-white/85 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center text-center space-y-4">
          <div className="border-2 border-[#133F68] p-3 bg-white">
            <DeterministicQrCode
              value={`MEMBER:${persona.studentId}:${persona.email}`}
              size={196}
              label={`Mã QR điểm danh của ${persona.fullName}`}
            />
          </div>

          <div className="space-y-1">
            <div className="text-lg font-bold text-[#133F68] font-eiu-display">
              {persona.fullName}
            </div>
            <div className="text-xs font-eiu-serif font-bold text-[#0054A6]">
              {persona.studentId !== '-' ? `MSSV: ${persona.studentId}` : 'Cán bộ Trường'}
            </div>
          </div>

          <div className="w-full bg-[#F8FAFC] border border-slate-200 p-3.5 text-xs text-left space-y-1.5">
            <div className="flex justify-between gap-2">
              <span className="text-slate-600">Đơn vị đào tạo:</span>
              <span className="font-semibold text-[#133F68] text-right">{facultyName}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-600">Chi hội / Đơn vị:</span>
              <span className="font-semibold text-slate-900 text-right">{unitName}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-600">Email trường:</span>
              <span className="font-eiu-serif text-[#0054A6] break-all text-right">
                {persona.email}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Đưa mã QR này cho Ban Tổ chức quét khi tham dự các chương trình, hội thảo và hoạt động phong trào tại EIU.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   2. MODAL GÓP Ý, HỖ TRỢ VÀ ĐỐI SOÁT QUYỀN LỢI HỘI VIÊN
   ============================================================================ */
export function SupportTicketModal(props: {
  open: boolean;
  onClose: () => void;
  personaName: string;
  prefillCategory?: string;
  prefillContent?: string;
  voiceTickets: VoiceTicketRecord[];
  onSubmitTicket: (ticket: {
    recipient: 'BKT' | 'BAN_TGPT';
    category: string;
    isAnonymous: boolean;
    content: string;
  }) => string;
}) {
  if (!props.open) return null;
  const formKey = `${props.prefillCategory || ''}-${props.prefillContent || ''}`;
  return <SupportTicketModalInner key={formKey} {...props} />;
}

function SupportTicketModalInner({
  open,
  onClose,
  personaName,
  prefillCategory,
  prefillContent,
  voiceTickets,
  onSubmitTicket,
}: {
  open: boolean;
  onClose: () => void;
  personaName: string;
  prefillCategory?: string;
  prefillContent?: string;
  voiceTickets: VoiceTicketRecord[];
  onSubmitTicket: (ticket: {
    recipient: 'BKT' | 'BAN_TGPT';
    category: string;
    isAnonymous: boolean;
    content: string;
  }) => string;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, modalRef, onClose);

  const [recipient, setRecipient] = useState<'BKT' | 'BAN_TGPT'>('BKT');
  const [category, setCategory] = useState(
    prefillCategory || 'Quy đổi Ngày tình nguyện và Cấp Giấy chứng nhận'
  );
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [content, setContent] = useState(prefillContent || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (trimmed.length < 10) {
      setErrorMsg('Vui lòng nhập tối thiểu 10 ký tự nội dung cần hỗ trợ hoặc kiến nghị.');
      return;
    }
    const newCode = onSubmitTicket({
      recipient,
      category,
      isAnonymous,
      content: trimmed,
    });
    setSubmittedCode(newCode);
    setContent('');
    setErrorMsg('');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#02294E]/75 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-modal-title"
        tabIndex={-1}
        className="bg-white border-2 border-[#133F68] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl focus:outline-none"
      >
        <div className="bg-[#133F68] text-white px-5 py-3.5 flex items-center justify-between gap-3 border-b-2 border-[#A68556] shrink-0">
          <h2
            id="support-modal-title"
            className="text-sm font-bold uppercase tracking-wider font-eiu-display"
          >
            HỘP THƯ HỖ TRỢ VÀ LẮNG NGHE SINH VIÊN
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng hộp thư hỗ trợ"
            className="min-h-11 min-w-11 inline-flex items-center justify-center text-white/85 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <span className="font-bold text-[#133F68] block">Bộ phận tiếp nhận</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRecipient('BKT')}
                  className={`min-h-[44px] px-3.5 py-2 border text-left font-semibold cursor-pointer transition-colors ${
                    recipient === 'BKT'
                      ? 'bg-[#133F68] text-white border-[#133F68]'
                      : 'bg-[#F8FAFC] text-[#133F68] border-slate-300 hover:bg-[#EAE3D2]'
                  }`}
                >
                  Ban Kiểm tra (Đối soát điểm danh, quyền lợi)
                </button>
                <button
                  type="button"
                  onClick={() => setRecipient('BAN_TGPT')}
                  className={`min-h-[44px] px-3.5 py-2 border text-left font-semibold cursor-pointer transition-colors ${
                    recipient === 'BAN_TGPT'
                      ? 'bg-[#133F68] text-white border-[#133F68]'
                      : 'bg-[#F8FAFC] text-[#133F68] border-slate-300 hover:bg-[#EAE3D2]'
                  }`}
                >
                  Ban Tuyên giáo – Phong trào (Đề xuất hoạt động)
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="support-cat" className="font-bold text-[#133F68] block">
                Chủ đề
              </label>
              <select
                id="support-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full min-h-[44px] px-3 border border-slate-300 rounded bg-white text-slate-900 font-medium text-base sm:text-xs"
              >
                <option value="Quy đổi Ngày tình nguyện và Cấp Giấy chứng nhận">
                  Quy đổi Ngày tình nguyện và Cấp Giấy chứng nhận
                </option>
                <option value="Xét chọn Danh hiệu Sinh viên 5 Tốt">
                  Xét chọn Danh hiệu Sinh viên 5 Tốt
                </option>
                <option value="Hoạt động Chi hội Khoa và Câu lạc bộ – Đội – Nhóm">
                  Hoạt động Chi hội Khoa và Câu lạc bộ – Đội – Nhóm
                </option>
                <option value="Đề xuất Chương trình mới và Sự kiện Xanh UN SDGs">
                  Đề xuất Chương trình mới và Sự kiện Xanh UN SDGs
                </option>
              </select>
            </div>

            <div className="flex items-center gap-2.5">
              <input
                id="support-anon"
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-5 h-5 accent-[#0054A6]"
              />
              <label htmlFor="support-anon" className="text-slate-700 cursor-pointer">
                Gửi ở chế độ ẩn danh (bảo mật thông tin người gửi)
              </label>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="support-content" className="font-bold text-[#133F68] block">
                Nội dung chi tiết
              </label>
              <textarea
                id="support-content"
                rows={4}
                maxLength={2000}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Mô tả nội dung cần đối soát điểm danh, hỏi đáp tiêu chuẩn hoặc đề xuất ý tưởng..."
                className="w-full p-3 border border-slate-300 rounded text-base sm:text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0054A6]"
              />
              {errorMsg && (
                <p role="alert" className="text-[#C10230] font-semibold">
                  {errorMsg}
                </p>
              )}
            </div>

            {submittedCode && (
              <div
                role="status"
                className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-[#51803A] shrink-0" />
                <span>
                  Đã tiếp nhận yêu cầu mã <strong className="font-eiu-serif">{submittedCode}</strong> ({isAnonymous ? 'Ẩn danh' : personaName}). Phản hồi dự kiến trong 03 ngày làm việc.
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-[#0054A6]" />
                <span>Phản hồi trong 03 ngày làm việc</span>
              </span>
              <button
                type="submit"
                className="min-h-[44px] px-5 bg-[#0054A6] hover:bg-[#133F68] text-white font-bold uppercase tracking-wider font-eiu-display rounded cursor-pointer"
              >
                Gửi yêu cầu
              </button>
            </div>
          </form>

          {voiceTickets.length > 0 && (
            <div className="border-t border-slate-200 pt-4 space-y-2.5">
              <div className="font-bold uppercase tracking-wider text-[#133F68] font-eiu-display">
                Lịch sử yêu cầu đã gửi ({voiceTickets.length})
              </div>
              <div className="divide-y divide-slate-200 border border-slate-200">
                {voiceTickets.map((t) => (
                  <div key={t.id} className="p-3 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#133F68] text-white font-eiu-serif font-bold">
                          {t.id}
                        </span>
                        <span className="font-semibold text-[#0054A6]">{t.category}</span>
                      </div>
                      <span className="font-eiu-serif text-slate-500">{t.createdAt}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{t.content}</p>
                    <div className="text-[#2E521D] font-semibold">✓ {t.status}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   3. MODAL LÀM HỒ SƠ TRỰC TUYẾN TỰ ĐỘNG ĐIỀN TỪ HỒ SƠ HỘI VIÊN
   ============================================================================ */
export function AwardApplicationModal(props: {
  program: AwardProgramItem | null;
  existingApplication?: SubmittedAwardApplication;
  liveSnapshot: AwardApplicationSnapshot;
  personalCerts: IssuedCertificateRecord[];
  externalEvidences: ExternalEvidenceRecord[];
  onClose: () => void;
  onSubmitApplication: (payload: {
    program: AwardProgramItem;
    snapshot: AwardApplicationSnapshot;
    attachedCertCodes: string[];
    attachedEvidenceIds: string[];
    statement: string;
  }) => void;
  onRequestWithdraw: (applicationId: string) => void;
}) {
  if (!props.program) return null;
  const modalKey = `${props.program.id}-${props.existingApplication?.id || 'new'}`;
  return (
    <AwardApplicationModalInner
      key={modalKey}
      {...props}
      program={props.program}
    />
  );
}

function AwardApplicationModalInner({
  program,
  existingApplication,
  liveSnapshot,
  personalCerts,
  externalEvidences,
  onClose,
  onSubmitApplication,
  onRequestWithdraw,
}: {
  program: AwardProgramItem;
  existingApplication?: SubmittedAwardApplication;
  liveSnapshot: AwardApplicationSnapshot;
  personalCerts: IssuedCertificateRecord[];
  externalEvidences: ExternalEvidenceRecord[];
  onClose: () => void;
  onSubmitApplication: (payload: {
    program: AwardProgramItem;
    snapshot: AwardApplicationSnapshot;
    attachedCertCodes: string[];
    attachedEvidenceIds: string[];
    statement: string;
  }) => void;
  onRequestWithdraw: (applicationId: string) => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(true, modalRef, onClose);

  const [snapshot, setSnapshot] = useState<AwardApplicationSnapshot>(
    existingApplication ? existingApplication.autoFilledSnapshot : liveSnapshot
  );
  const [selectedCertCodes, setSelectedCertCodes] = useState<string[]>(
    existingApplication
      ? existingApplication.attachedCertCodes
      : personalCerts.map((c) => c.certCode)
  );
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>(
    existingApplication
      ? existingApplication.attachedEvidenceIds
      : externalEvidences.map((ev) => ev.id)
  );
  const [statement, setStatement] = useState(
    existingApplication ? existingApplication.statement : ''
  );
  const [syncNotice, setSyncNotice] = useState('');
  const [formError, setFormError] = useState('');

  const isReadOnly = Boolean(existingApplication);

  const handleReSyncProfile = () => {
    setSnapshot(liveSnapshot);
    setSelectedCertCodes(personalCerts.map((c) => c.certCode));
    setSelectedEvidenceIds(externalEvidences.map((ev) => ev.id));
    setSyncNotice('Đã đồng bộ lại toàn bộ thông tin mới nhất từ Hồ sơ Hội viên.');
  };

  const toggleCert = (certCode: string) => {
    if (isReadOnly) return;
    setSelectedCertCodes((prev) =>
      prev.includes(certCode) ? prev.filter((c) => c !== certCode) : [...prev, certCode]
    );
  };

  const toggleEvidence = (evId: string) => {
    if (isReadOnly) return;
    setSelectedEvidenceIds((prev) =>
      prev.includes(evId) ? prev.filter((id) => id !== evId) : [...prev, evId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (statement.trim().length < 20) {
      setFormError('Vui lòng nhập tối thiểu 20 ký tự tóm tắt thành tích hoặc lý do đăng ký xét chọn.');
      return;
    }
    onSubmitApplication({
      program,
      snapshot,
      attachedCertCodes: selectedCertCodes,
      attachedEvidenceIds: selectedEvidenceIds,
      statement: statement.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#02294E]/75 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="award-modal-title"
        tabIndex={-1}
        className="bg-white border-2 border-[#133F68] w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl focus:outline-none"
      >
        <div className="bg-[#133F68] text-white px-5 py-4 flex items-start justify-between gap-3 border-b-3 border-[#A68556] shrink-0">
          <div className="space-y-1 min-w-0">
            <h2
              id="award-modal-title"
              className="text-base font-bold font-eiu-display leading-snug"
            >
              {program.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#DED1BE]">
              <span>{program.categoryLabel}</span>
              <span aria-hidden="true">•</span>
              <span>{program.issuingBody}</span>
              <span aria-hidden="true">•</span>
              <span className="font-eiu-serif text-[#FCB900] font-semibold">
                Hạn nộp: {program.deadline}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng biểu mẫu xét chọn hồ sơ"
            className="min-h-11 min-w-11 inline-flex items-center justify-center text-white/85 hover:text-white cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
          {/* Trạng thái đã nộp nếu xem lại */}
          {existingApplication && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold font-eiu-display uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#51803A]" />
                  <span>Hồ sơ mã {existingApplication.id} đã được gửi thành công</span>
                </span>
                <span className="px-2.5 py-0.5 bg-[#51803A] text-white font-bold font-eiu-serif">
                  {existingApplication.statusLabel}
                </span>
              </div>
              <p className="text-emerald-900">
                Nộp lúc: <strong className="font-eiu-serif">{existingApplication.submittedAt}</strong>. Bạn có thể rút hồ sơ để cập nhật bổ sung minh chứng trong thời gian chờ sơ duyệt Cấp 1.
              </p>
            </div>
          )}

          {/* Thanh xác nhận Tự động điền */}
          <div className="p-3.5 bg-[#F0F6FC] border border-[#0054A6]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2 text-[#133F68]">
              <Sparkles className="w-4 h-4 text-[#0054A6] shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                <strong>Tự động điền từ Hồ sơ Hội viên:</strong> Thông tin cá nhân, kết quả học tập, ngày tình nguyện và minh chứng đã được điền sẵn.
              </span>
            </div>
            {!isReadOnly && (
              <button
                type="button"
                onClick={handleReSyncProfile}
                className="min-h-[40px] sm:min-h-[34px] px-3 py-1.5 bg-white border border-[#0054A6] text-[#0054A6] hover:bg-[#0054A6] hover:text-white font-bold uppercase font-eiu-display inline-flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Đồng bộ lại từ Hồ sơ</span>
              </button>
            )}
          </div>

          {syncNotice && (
            <div role="status" className="text-emerald-800 font-semibold">
              ✓ {syncNotice}
            </div>
          )}

          {/* Khối 1: Thông tin cá nhân & Chỉ số tự động điền */}
          <div className="border border-slate-200 divide-y divide-slate-200">
            <div className="bg-[#F8FAFC] px-4 py-2.5 font-bold uppercase tracking-wider text-[#133F68] font-eiu-display">
              Thông tin hội viên và thành tích học tập
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-500 block">Họ và tên</span>
                <strong className="text-[#133F68]">{snapshot.fullName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Mã số sinh viên</span>
                <strong className="font-eiu-serif text-[#133F68]">{snapshot.studentId}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Số điện thoại liên hệ</span>
                <strong className="font-eiu-serif text-slate-900">{snapshot.phone}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Khoa / Ngành đào tạo</span>
                <strong className="text-slate-900">
                  {snapshot.facultyName} – {snapshot.majorName}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Đơn vị sinh hoạt</span>
                <strong className="text-slate-900">{snapshot.unitName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Email trường</span>
                <strong className="font-eiu-serif text-[#0054A6] break-all">
                  {snapshot.email}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">GPA xét chọn tốt nhất</span>
                <strong className="font-eiu-serif text-[#0054A6] text-sm">
                  {snapshot.effectiveGpa} / 4.00
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Điểm rèn luyện</span>
                <strong className="font-eiu-serif text-[#133F68] text-sm">
                  {snapshot.ethicsScore} / 100
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Ngày tình nguyện tích lũy</span>
                <strong className="font-eiu-serif text-[#51803A] text-sm">
                  {snapshot.volunteerDays} ngày ({snapshot.metCriteriaCount}/05 chuẩn SV5T)
                </strong>
              </div>
            </div>
          </div>

          {/* Khối 2: Giấy chứng nhận & Minh chứng đính kèm */}
          <div className="border border-slate-200 divide-y divide-slate-200">
            <div className="bg-[#F8FAFC] px-4 py-2.5 font-bold uppercase tracking-wider text-[#133F68] font-eiu-display flex items-center justify-between gap-2">
              <span>Giấy chứng nhận và Minh chứng đính kèm</span>
              <span className="font-eiu-serif text-[#0054A6]">
                Đã chọn {selectedCertCodes.length + selectedEvidenceIds.length} mục
              </span>
            </div>
            <div className="p-4 space-y-3">
              {personalCerts.length === 0 && externalEvidences.length === 0 ? (
                <p className="text-slate-600">
                  Chưa có Giấy chứng nhận hoặc Minh chứng ngoại khóa được đồng bộ.
                </p>
              ) : (
                <div className="space-y-2">
                  {personalCerts.map((cert) => {
                    const checked = selectedCertCodes.includes(cert.certCode);
                    return (
                      <label
                        key={cert.id}
                        className={`flex items-start gap-2.5 p-2.5 border cursor-pointer transition-colors ${
                          checked
                            ? 'bg-[#F0F6FC] border-[#0054A6]'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          disabled={isReadOnly}
                          checked={checked}
                          onChange={() => toggleCert(cert.certCode)}
                          className="w-4 h-4 mt-0.5 accent-[#0054A6]"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-[#133F68]">{cert.eventTitle}</div>
                          <div className="text-slate-600">
                            <span className="font-eiu-serif font-bold text-[#0054A6]">
                              {cert.certCode}
                            </span>{' '}
                            • {cert.roleTitle} • +{cert.volunteerDays.toFixed(1)} ngày TN
                          </div>
                        </div>
                      </label>
                    );
                  })}

                  {externalEvidences.map((ev) => {
                    const checked = selectedEvidenceIds.includes(ev.id);
                    return (
                      <label
                        key={ev.id}
                        className={`flex items-start gap-2.5 p-2.5 border cursor-pointer transition-colors ${
                          checked
                            ? 'bg-[#F0F6FC] border-[#0054A6]'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          disabled={isReadOnly}
                          checked={checked}
                          onChange={() => toggleEvidence(ev.id)}
                          className="w-4 h-4 mt-0.5 accent-[#0054A6]"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-[#133F68]">{ev.title}</div>
                          <div className="text-slate-600">
                            <span>{ev.criterion}</span> • {ev.issuer} ({ev.issuedDate})
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Khối 3: Tự thuật thành tích / Lý do ứng tuyển */}
          <div className="space-y-1.5">
            <label htmlFor="award-statement" className="font-bold text-[#133F68] block">
              {program.category === 'HOC_BONG'
                ? 'Tóm tắt hoàn cảnh và mục tiêu phấn đấu'
                : 'Tóm tắt thành tích nổi bật và cam kết cống hiến'}
            </label>
            <textarea
              id="award-statement"
              rows={4}
              readOnly={isReadOnly}
              maxLength={2000}
              value={statement}
              onChange={(e) => {
                setStatement(e.target.value);
                if (formError) setFormError('');
              }}
              placeholder="Trình bày ngắn gọn những đóng góp nổi bật trong học tập, nghiên cứu, hoạt động Chi hội / CLB hoặc mục tiêu phát triển bản thân..."
              className={`w-full p-3 border border-slate-300 rounded text-base sm:text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0054A6] ${
                isReadOnly ? 'bg-slate-50 text-slate-700' : 'bg-white'
              }`}
            />
            {formError && (
              <p role="alert" className="text-[#C10230] font-semibold">
                {formError}
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold uppercase font-eiu-display cursor-pointer"
            >
              Đóng
            </button>
            {existingApplication ? (
              <button
                type="button"
                onClick={() => onRequestWithdraw(existingApplication.id)}
                className="min-h-[44px] px-5 py-2 border border-[#C10230] text-[#C10230] hover:bg-red-50 font-bold uppercase font-eiu-display cursor-pointer"
              >
                Rút hồ sơ để chỉnh sửa
              </button>
            ) : (
              <button
                type="submit"
                className="min-h-[44px] px-6 py-2 bg-[#0054A6] hover:bg-[#133F68] text-white font-bold uppercase tracking-wider font-eiu-display cursor-pointer"
              >
                Gửi hồ sơ xét chọn
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================================================================
   4. MODAL XEM TRỰC QUAN GIẤY CHỨNG NHẬN (PHỤ LỤC 2)
   ============================================================================ */
export function CertificateViewerModal({
  cert,
  onClose,
}: {
  cert: IssuedCertificateRecord | null;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(Boolean(cert), modalRef, onClose);

  if (!cert) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#02294E]/80 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cert-viewer-title"
        tabIndex={-1}
        className="bg-[#F5F5F5] border-2 border-[#133F68] w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl focus:outline-none"
      >
        <div className="bg-[#133F68] text-white px-5 py-3.5 flex items-center justify-between gap-3 border-b-2 border-[#A68556] shrink-0">
          <h2 id="cert-viewer-title" className="text-xs sm:text-sm font-bold font-eiu-display truncate">
            Giấy chứng nhận điện tử {cert.certCode}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng bản xem trước Giấy chứng nhận"
            className="min-h-11 min-w-11 inline-flex items-center justify-center text-white/85 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto">
          <CertificatePreviewPhuLuc2 cert={cert} />
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   5. MODAL BẢNG TỔNG HỢP HOẠT ĐỘNG NGOẠI KHÓA (CHUẨN IN / PDF GẮN CV)
   ============================================================================ */
export function TranscriptModal({
  open,
  onClose,
  persona,
  facultyName,
  majorName,
  branchName,
  activeClubs,
  effectiveGpa,
  ethicsScore,
  totalVolunteerDays,
  metCriteriaCount,
  personalCerts,
  externalEvidences,
}: {
  open: boolean;
  onClose: () => void;
  persona: StaffMember;
  facultyName: string;
  majorName: string;
  branchName: string;
  activeClubs: ClubUnit[];
  effectiveGpa: number;
  ethicsScore: number;
  totalVolunteerDays: number;
  metCriteriaCount: number;
  personalCerts: IssuedCertificateRecord[];
  externalEvidences: ExternalEvidenceRecord[];
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, modalRef, onClose);

  useEffect(() => {
    const cleanup = () => {
      document.body.classList.remove('printing-transcript');
    };
    window.addEventListener('afterprint', cleanup);
    return () => {
      window.removeEventListener('afterprint', cleanup);
      cleanup();
    };
  }, []);

  if (!open) return null;

  const handlePrint = () => {
    document.body.classList.add('printing-transcript');
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#02294E]/80 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="transcript-modal-title"
        tabIndex={-1}
        className="bg-[#F5F5F5] border-2 border-[#133F68] w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl focus:outline-none"
      >
        <div className="no-print bg-[#133F68] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#A68556] shrink-0">
          <h2 id="transcript-modal-title" className="text-xs sm:text-sm font-bold font-eiu-display">
            BẢNG TỔNG HỢP HOẠT ĐỘNG NGOẠI KHÓA (DÀNH CHO HỒ SƠ CV / HỌC BỔNG)
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[40px] px-4 py-1.5 bg-[#FCB900] hover:bg-[#eab000] text-[#02294E] text-xs font-bold uppercase font-eiu-display inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In / Lưu bản PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng bảng tổng hợp hoạt động ngoại khóa"
              className="min-h-11 min-w-11 inline-flex items-center justify-center text-white/85 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto">
          <article
            id="eiu-printable-transcript"
            className="bg-white border border-slate-300 p-6 sm:p-10 space-y-6 text-xs text-slate-900"
          >
            {/* Quốc hiệu / Tiêu đề Trường */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-[#133F68] pb-5">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/eiu-logo-full.png"
                  alt="EIU"
                  width={44}
                  height={44}
                  style={{ width: 'auto' }}
                  className="h-11 w-auto object-contain"
                />
                <Image
                  src="/images/hsv-logo.png"
                  alt="HSV EIU"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
                <div>
                  <div className="font-bold text-[#133F68] uppercase font-eiu-display">
                    HỘI SINH VIÊN VIỆT NAM TRƯỜNG ĐẠI HỌC QUỐC TẾ MIỀN ĐÔNG
                  </div>
                  <div className="text-slate-600">
                    Văn phòng Hội Sinh viên – Phòng 206.B06 • Cổng Thông tin Điện tử HSV EIU
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="border border-[#133F68] p-1 bg-white">
                  <DeterministicQrCode
                    value={`TRANSCRIPT:${persona.studentId}:${persona.email}`}
                    size={56}
                    label={`QR xác thực hồ sơ ngoại khóa ${persona.studentId}`}
                  />
                </div>
                <div className="text-[11px] font-eiu-serif text-slate-600">
                  <div>Năm học: 2026 – 2027</div>
                  <div>Xác thực trực tuyến</div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-extrabold uppercase text-[#133F68] font-eiu-display">
                BẢNG TỔNG HỢP HOẠT ĐỘNG NGOẠI KHÓA HỘI VIÊN
              </h3>
              <p className="text-slate-600">
                Co-Curricular Activities Transcript – Eastern International University
              </p>
            </div>

            {/* Thông tin sinh viên */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F8FAFC] border border-slate-200 p-4">
              <div>
                <span className="text-slate-500">Họ và tên: </span>
                <strong className="text-[#133F68]">{persona.fullName}</strong>
              </div>
              <div>
                <span className="text-slate-500">Mã số sinh viên: </span>
                <strong className="font-eiu-serif text-[#133F68]">{persona.studentId}</strong>
              </div>
              <div>
                <span className="text-slate-500">Khoa đào tạo: </span>
                <strong>{facultyName}</strong>
              </div>
              <div>
                <span className="text-slate-500">Ngành học: </span>
                <strong>{majorName}</strong>
              </div>
              <div>
                <span className="text-slate-500">Chi hội gốc: </span>
                <strong>{branchName}</strong>
              </div>
              <div>
                <span className="text-slate-500">CLB tham gia: </span>
                <strong>
                  {activeClubs.map((c) => c.shortName).join(', ') || 'Chưa cập nhật'}
                </strong>
              </div>
            </div>

            {/* Chỉ số rèn luyện */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="border border-slate-200 p-3">
                <div className="text-[11px] text-slate-600">Tiêu chuẩn SV5T</div>
                <div className="text-lg font-extrabold font-eiu-serif text-[#133F68]">
                  {String(metCriteriaCount).padStart(2, '0')} / 05
                </div>
              </div>
              <div className="border border-slate-200 p-3">
                <div className="text-[11px] text-slate-600">GPA xét chọn</div>
                <div className="text-lg font-extrabold font-eiu-serif text-[#0054A6]">
                  {effectiveGpa.toFixed(2)} / 4.00
                </div>
              </div>
              <div className="border border-slate-200 p-3">
                <div className="text-[11px] text-slate-600">Điểm rèn luyện</div>
                <div className="text-lg font-extrabold font-eiu-serif text-[#133F68]">
                  {ethicsScore} / 100
                </div>
              </div>
              <div className="border border-slate-200 p-3">
                <div className="text-[11px] text-slate-600">Ngày tình nguyện</div>
                <div className="text-lg font-extrabold font-eiu-serif text-[#51803A]">
                  {totalVolunteerDays.toFixed(1)} ngày
                </div>
              </div>
            </div>

            {/* Bảng Giấy chứng nhận */}
            <div className="space-y-2">
              <h4 className="font-bold uppercase text-[#133F68] font-eiu-display">
                1. Hoạt động và Giấy chứng nhận đã cấp ({personalCerts.length})
              </h4>
              {personalCerts.length > 0 ? (
                <div className="overflow-x-auto border border-slate-200">
                  <table className="eiu-table">
                    <thead>
                      <tr>
                        <th className="w-28 text-center">Mã GCN</th>
                        <th>Chương trình / Hoạt động</th>
                        <th>Vai trò</th>
                        <th className="w-24 text-center">Ngày TN</th>
                        <th className="w-28 text-center">Quyết định</th>
                      </tr>
                    </thead>
                    <tbody>
                      {personalCerts.map((c) => (
                        <tr key={c.id}>
                          <td className="font-eiu-serif font-bold text-[#133F68] text-center whitespace-nowrap">
                            {c.certCode}
                          </td>
                          <td>{c.eventTitle}</td>
                          <td>{c.roleTitle}</td>
                          <td className="font-eiu-serif font-bold text-[#C10230] text-center">
                            +{c.volunteerDays.toFixed(1)}
                          </td>
                          <td className="font-eiu-serif text-center whitespace-nowrap">
                            {c.decisionNumber}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-600">Chưa có Giấy chứng nhận điện tử được ban hành.</p>
              )}
            </div>

            {/* Bảng Minh chứng ngoại khóa */}
            {externalEvidences.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold uppercase text-[#133F68] font-eiu-display">
                  2. Thành tích và Minh chứng bổ sung ({externalEvidences.length})
                </h4>
                <div className="overflow-x-auto border border-slate-200">
                  <table className="eiu-table">
                    <thead>
                      <tr>
                        <th className="w-36 text-center">Tiêu chuẩn</th>
                        <th>Tên minh chứng / Chứng chỉ / Giải thưởng</th>
                        <th className="w-48">Đơn vị cấp</th>
                        <th className="w-28 text-center">Ngày cấp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {externalEvidences.map((ev) => (
                        <tr key={ev.id}>
                          <td className="font-semibold text-[#133F68] text-center">
                            {ev.criterion}
                          </td>
                          <td>{ev.title}</td>
                          <td>{ev.issuer}</td>
                          <td className="font-eiu-serif text-center">{ev.issuedDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-2 text-[11px] text-slate-600">
              <span>
                Bản tổng hợp được kết xuất từ Hồ sơ Hội viên EIU ({persona.email}).
              </span>
              <span className="font-eiu-serif">
                Tra cứu đối chiếu công khai tại /tra-cuu-gcn?q={persona.studentId}
              </span>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
