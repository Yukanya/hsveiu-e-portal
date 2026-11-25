'use client';

import React, { Suspense, useCallback, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SubpageBanner } from '@/components/public/subpage-banner';
import { OFFICIAL_DOCUMENTS } from '@/data/mock-data';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import {
  DocFieldCategory,
  DocIssuingUnitCategory,
  DocTypeCategory,
  OfficialDocumentItem,
} from '@/types';
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
  QrCode,
  Search,
  X,
} from 'lucide-react';

type DocTypeFilter = 'ALL' | DocTypeCategory;

const DOC_TYPE_PILLS: { id: DocTypeFilter; label: string; slug: string }[] = [
  { id: 'ALL', label: 'Tất cả', slug: 'all' },
  { id: 'KẾ HOẠCH', label: 'Kế hoạch', slug: 'ke-hoach' },
  { id: 'QUYẾT ĐỊNH', label: 'Quyết định', slug: 'quyet-dinh' },
  { id: 'THÔNG BÁO', label: 'Thông báo', slug: 'thong-bao' },
  { id: 'CÔNG VĂN', label: 'Công văn', slug: 'cong-van' },
  { id: 'TỜ TRÌNH', label: 'Tờ trình', slug: 'to-trinh' },
  { id: 'BÁO CÁO', label: 'Báo cáo', slug: 'bao-cao' },
  { id: 'BIÊN BẢN', label: 'Biên bản', slug: 'bien-ban' },
  { id: 'HƯỚNG DẪN', label: 'Hướng dẫn', slug: 'huong-dan' },
  { id: 'KHÁC', label: 'Khác', slug: 'khac' },
];

const FIELD_OPTIONS: ('ALL' | DocFieldCategory)[] = [
  'ALL',
  'Tổ chức và Xây dựng Hội',
  'Tuyên giáo và Phong trào',
  'Sinh viên 5 Tốt',
  'Ngày tình nguyện và Giấy chứng nhận',
  'Khác',
];

const NAMED_SIGNERS = [
  'Trương Châu Phước Lộc',
  'Nguyễn Như Quỳnh',
  'Trần Thị Thu Huyền',
  'Nguyễn Mỹ Hạnh',
] as const;

const ISSUING_UNIT_OPTIONS: ('ALL' | DocIssuingUnitCategory)[] = [
  'ALL',
  'Ban Thư ký HSV trường',
  'Ban Chấp hành HSV trường',
  'Ban Kiểm tra HSV trường',
  'Chi hội',
  'Câu lạc bộ/Đội/Nhóm',
  'HSV TP.HCM',
  'Trung ương HSV',
  'Khác',
];

const DOCS_PER_PAGE = 12;

function parseDdMmYyyy(val: string): number | null {
  const m = val.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const dt = new Date(year, month - 1, day);
  if (
    dt.getFullYear() !== year ||
    dt.getMonth() !== month - 1 ||
    dt.getDate() !== day
  ) {
    return null;
  }
  return dt.getTime();
}

function formatDateInputMasked(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function formatSignedDateParts(dateStr: string): string {
  const m = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return dateStr;
  return `Thành phố Hồ Chí Minh, ngày ${m[1]} tháng ${m[2]} năm ${m[3]}`;
}

function escapeHtml(val: string): string {
  return val
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildPrintableHtml(
  doc: OfficialDocumentItem,
  autoPrint = false
): string {
  const pointsHtml = (doc.keyPoints || [])
    .map((p) => `<li style="margin-bottom:6px;">${escapeHtml(p)}</li>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(doc.documentNumber)} - ${escapeHtml(doc.title)}</title>
<style>
  @page { size: A4; margin: 20mm 20mm 20mm 25mm; }
  body { font-family: "Times New Roman", serif; color: #0f172a; margin: 36px auto; max-width: 720px; line-height: 1.6; padding: 0 16px; }
  .toolbar { background: #133F68; color: #ffffff; padding: 10px 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; font-family: sans-serif; font-size: 12px; border-bottom: 3px solid #A68556; }
  .toolbar button { background: #FCB900; color: #02294E; border: none; padding: 6px 14px; font-weight: bold; text-transform: uppercase; cursor: pointer; font-size: 11px; }
  @media print { .toolbar { display: none !important; } body { margin: 0; padding: 0; } }
  .header { display: flex; justify-content: space-between; text-align: center; margin-bottom: 24px; font-size: 13px; }
  .title { text-align: center; font-weight: bold; font-size: 16px; text-transform: uppercase; margin: 18px 0 8px; }
  .subtitle { text-align: center; font-weight: bold; font-size: 14px; margin-bottom: 20px; }
  .footer { display: flex; justify-content: space-between; margin-top: 36px; font-size: 13px; }
</style>
</head>
<body>
  <div class="toolbar">
    <span>Bản in văn bản chuẩn A4 — ${escapeHtml(doc.attachmentName)}</span>
    <button type="button" onclick="window.print()">In hoặc Lưu thành PDF</button>
  </div>
  <div class="header">
    <div>
      <div><strong>HỘI SINH VIÊN VIỆT NAM</strong></div>
      <div><strong>TRƯỜNG ĐH QUỐC TẾ MIỀN ĐÔNG</strong></div>
      <div style="margin-top:6px;">Số: ${escapeHtml(doc.documentNumber)}</div>
    </div>
    <div>
      <div><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong></div>
      <div><strong>Độc lập - Tự do - Hạnh phúc</strong></div>
      <div style="margin-top:6px;font-style:italic;">${escapeHtml(formatSignedDateParts(doc.signedDate))}</div>
    </div>
  </div>
  <div class="title">${escapeHtml(doc.docType)}</div>
  <div class="subtitle">${escapeHtml(doc.title)}</div>
  <p><strong>Đơn vị ban hành:</strong> ${escapeHtml(doc.issuingBody)}</p>
  <p><strong>Lĩnh vực:</strong> ${escapeHtml(doc.field)} | <strong>Ngày hiệu lực:</strong> ${escapeHtml(doc.effectiveDate)}</p>
  <p>${escapeHtml(doc.summary)}</p>
  ${pointsHtml ? `<ul>${pointsHtml}</ul>` : ''}
  <div class="footer">
    <div><strong>Nơi nhận:</strong><br/>- Như trên;<br/>- Lưu VP 206.B06.</div>
    <div style="text-align:center;">
      <div><strong>TM. ${escapeHtml(doc.issuingBody.toUpperCase())}</strong></div>
      <div>${escapeHtml(doc.signerTitle)}</div>
      <div style="margin:18px 0;color:#c10230;font-style:italic;">(Đã ký)</div>
      <div><strong>${escapeHtml(doc.signerName)}</strong></div>
    </div>
  </div>
  ${
    autoPrint
      ? `<script>window.addEventListener('load', function(){ setTimeout(function(){ window.print(); }, 250); });</script>`
      : ''
  }
</body>
</html>`;
}

function downloadDocumentFile(doc: OfficialDocumentItem) {
  if (doc.fileUrl) {
    window.open(doc.fileUrl, '_blank', 'noopener,noreferrer');
    return;
  }
  const html = buildPrintableHtml(doc, true);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank', 'noopener,noreferrer');
  if (!win) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function VanBanContent({
  initialSelectedDoc,
  initialType,
  initialQuery,
}: {
  initialSelectedDoc: OfficialDocumentItem | null;
  initialType: DocTypeFilter;
  initialQuery: string;
}) {
  const listTopRef = useRef<HTMLDivElement>(null);

  const [docTypeFilter, setDocTypeFilter] =
    useState<DocTypeFilter>(initialType);
  const [search, setSearch] = useState(initialQuery);
  const [fromDateStr, setFromDateStr] = useState('');
  const [toDateStr, setToDateStr] = useState('');
  const [fieldFilter, setFieldFilter] = useState<string>('ALL');
  const [signerFilter, setSignerFilter] = useState<string>('ALL');
  const [unitFilter, setUnitFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [selectedDoc, setSelectedDoc] = useState<OfficialDocumentItem | null>(
    initialSelectedDoc
  );
  const docModalRef = useRef<HTMLDivElement>(null);
  const closeDocModal = useCallback(() => setSelectedDoc(null), []);

  useFocusTrap(Boolean(selectedDoc), docModalRef, closeDocModal);

  const fromTimestamp = parseDdMmYyyy(fromDateStr);
  const toTimestamp = parseDdMmYyyy(toDateStr);

  const isFromInvalid =
    fromDateStr.trim().length === 10 && fromTimestamp === null;
  const isToInvalid = toDateStr.trim().length === 10 && toTimestamp === null;
  const isRangeReversed =
    fromTimestamp !== null &&
    toTimestamp !== null &&
    fromTimestamp > toTimestamp;

  const dateValidationError = isFromInvalid
    ? `Ngày bắt đầu "${fromDateStr}" không hợp lệ. Vui lòng nhập đúng ngày thực tế theo định dạng dd/mm/yyyy.`
    : isToInvalid
    ? `Ngày kết thúc "${toDateStr}" không hợp lệ. Vui lòng nhập đúng ngày thực tế theo định dạng dd/mm/yyyy.`
    : isRangeReversed
    ? 'Khoảng thời gian không hợp lệ: Ngày bắt đầu ("Từ") không được lớn hơn ngày kết thúc ("đến").'
    : null;

  const activeDropdownFilterCount = [
    fieldFilter !== 'ALL',
    signerFilter !== 'ALL',
    unitFilter !== 'ALL',
  ].filter(Boolean).length;

  const filteredDocs = OFFICIAL_DOCUMENTS.filter((doc) => {
    const matchType = docTypeFilter === 'ALL' || doc.docType === docTypeFilter;

    const q = search.trim().toLowerCase();
    const matchText =
      !q ||
      doc.documentNumber.toLowerCase().includes(q) ||
      doc.title.toLowerCase().includes(q) ||
      doc.summary.toLowerCase().includes(q) ||
      doc.signerName.toLowerCase().includes(q) ||
      doc.issuingBody.toLowerCase().includes(q);

    const docTimestamp = parseDdMmYyyy(doc.signedDate);
    const matchFrom =
      fromTimestamp === null ||
      (docTimestamp !== null && docTimestamp >= fromTimestamp);
    const matchTo =
      toTimestamp === null ||
      (docTimestamp !== null && docTimestamp <= toTimestamp);

    const matchField = fieldFilter === 'ALL' || doc.field === fieldFilter;

    const matchSigner =
      signerFilter === 'ALL'
        ? true
        : signerFilter === 'Khác'
        ? !NAMED_SIGNERS.includes(
            doc.signerName as (typeof NAMED_SIGNERS)[number]
          )
        : doc.signerName === signerFilter;

    const matchUnit =
      unitFilter === 'ALL' || doc.issuingUnitCategory === unitFilter;

    return (
      matchType &&
      matchText &&
      matchFrom &&
      matchTo &&
      matchField &&
      matchSigner &&
      matchUnit
    );
  });

  const hasActiveFilter =
    docTypeFilter !== 'ALL' ||
    Boolean(search.trim()) ||
    Boolean(fromDateStr.trim()) ||
    Boolean(toDateStr.trim()) ||
    fieldFilter !== 'ALL' ||
    signerFilter !== 'ALL' ||
    unitFilter !== 'ALL';

  const handleResetFilters = () => {
    setDocTypeFilter('ALL');
    setSearch('');
    setFromDateStr('');
    setToDateStr('');
    setFieldFilter('ALL');
    setSignerFilter('ALL');
    setUnitFilter('ALL');
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredDocs.length / DOCS_PER_PAGE);
  const safePage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
  const paginatedDocs = filteredDocs.slice(
    (safePage - 1) * DOCS_PER_PAGE,
    safePage * DOCS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const relatedDocs = selectedDoc?.relatedDocNumbers
    ? OFFICIAL_DOCUMENTS.filter((d) =>
        selectedDoc.relatedDocNumbers?.includes(d.documentNumber)
      )
    : [];

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <SubpageBanner
        title="VĂN BẢN HỘI SINH VIÊN"
        subtitle="Tra cứu Quyết định, Kế hoạch, Thông báo, Công văn, Tờ trình, Báo cáo, Biên bản và Hướng dẫn chính thức của Hội Sinh viên Trường Đại học Quốc tế Miền Đông."
        breadcrumbs={[{ label: 'Văn bản Hội Sinh viên' }]}
      />

      <div
        ref={listTopRef}
        className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-9 space-y-6 scroll-mt-24"
      >
        {/* =====================================================================
            KHU VỰC SORT PILLS VÀ BỘ LỌC TÌM KIẾM VĂN BẢN
           ===================================================================== */}
        <section className="space-y-4">
          {/* Hàng 1: Pills 09 Thể loại + Tất cả */}
          <div
            role="group"
            aria-label="Lọc văn bản theo thể loại"
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {DOC_TYPE_PILLS.map((pill) => {
              const active = docTypeFilter === pill.id;
              const count =
                pill.id === 'ALL'
                  ? OFFICIAL_DOCUMENTS.length
                  : OFFICIAL_DOCUMENTS.filter((d) => d.docType === pill.id)
                      .length;

              return (
                <button
                  key={pill.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setDocTypeFilter(pill.id);
                    setCurrentPage(1);
                  }}
                  className={`py-2 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer font-eiu-display min-h-[44px] sm:min-h-[38px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C10230] focus-visible:ring-offset-2 ${
                    active
                      ? 'bg-[#C10230] text-white border border-[#C10230] shadow-xs'
                      : 'bg-white text-[#133F68] border border-slate-300 hover:border-[#133F68] hover:bg-[#EAE3D2]/40'
                  }`}
                >
                  {pill.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Hàng 2 & 3: Tìm kiếm, Thời gian ban hành (Từ - Đến dd/mm/yyyy) và 4 Bộ lọc dropdown */}
          <div className="bg-white border border-slate-200 p-4 sm:p-5 space-y-4 shadow-2xs">
            <div className="flex flex-col lg:flex-row lg:items-end gap-3">
              {/* Thanh tìm kiếm */}
              <div className="flex-1 space-y-1">
                <label
                  htmlFor="doc-search-input"
                  className="block text-[11px] font-bold text-slate-600 font-eiu-display uppercase"
                >
                  Tìm kiếm văn bản:
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="doc-search-input"
                    name="q"
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Tìm số hiệu hoặc trích yếu..."
                    className="w-full h-11 sm:h-9.5 pl-9 pr-10 bg-white border border-slate-300 rounded text-base sm:text-sm text-slate-900 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68]"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('');
                        setCurrentPage(1);
                      }}
                      aria-label="Xóa từ khóa tìm kiếm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Thời gian ban hành: Từ dd/mm/yyyy đến dd/mm/yyyy */}
              <div className="space-y-1 shrink-0">
                <span className="block text-[11px] font-bold text-slate-600 font-eiu-display uppercase">
                  Thời gian ban hành:
                </span>
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                  <div className="relative flex items-center">
                    <label
                      htmlFor="doc-date-from"
                      className="text-xs text-slate-600 mr-1.5 font-sans"
                    >
                      Từ
                    </label>
                    <div className="relative">
                      <Calendar className="w-3.5 h-3.5 text-[#8E6D3E] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="doc-date-from"
                        name="fromDate"
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        value={fromDateStr}
                        onChange={(e) => {
                          setFromDateStr(formatDateInputMasked(e.target.value));
                          setCurrentPage(1);
                        }}
                        placeholder="dd/mm/yyyy"
                        aria-label="Thời gian ban hành từ ngày"
                        aria-invalid={isFromInvalid || isRangeReversed}
                        className={`w-36 h-11 sm:h-9.5 pl-8 pr-2.5 bg-white border rounded text-base sm:text-xs text-slate-900 font-sans tabular-nums placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 ${
                          isFromInvalid || isRangeReversed
                            ? 'border-[#C10230] focus-visible:ring-[#C10230]'
                            : 'border-slate-300 focus-visible:ring-[#133F68]'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="relative flex items-center">
                    <label
                      htmlFor="doc-date-to"
                      className="text-xs text-slate-600 mr-1.5 font-sans"
                    >
                      đến
                    </label>
                    <div className="relative">
                      <Calendar className="w-3.5 h-3.5 text-[#8E6D3E] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="doc-date-to"
                        name="toDate"
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        value={toDateStr}
                        onChange={(e) => {
                          setToDateStr(formatDateInputMasked(e.target.value));
                          setCurrentPage(1);
                        }}
                        placeholder="dd/mm/yyyy"
                        aria-label="Thời gian ban hành đến ngày"
                        aria-invalid={isToInvalid || isRangeReversed}
                        className={`w-36 h-11 sm:h-9.5 pl-8 pr-2.5 bg-white border rounded text-base sm:text-xs text-slate-900 font-sans tabular-nums placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 ${
                          isToInvalid || isRangeReversed
                            ? 'border-[#C10230] focus-visible:ring-[#C10230]'
                            : 'border-slate-300 focus-visible:ring-[#133F68]'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowMobileFilters((prev) => !prev)}
                  aria-expanded={showMobileFilters}
                  className="sm:hidden px-3.5 h-11 rounded text-xs font-bold uppercase tracking-wider font-eiu-display border border-slate-300 bg-white text-[#133F68] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>
                    Bộ lọc chi tiết
                    {activeDropdownFilterCount > 0
                      ? ` (${activeDropdownFilterCount})`
                      : ''}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      showMobileFilters ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {hasActiveFilter && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-3.5 h-11 sm:h-9.5 text-xs font-bold text-[#C10230] hover:bg-red-50 border border-red-200 rounded transition-colors font-eiu-display cursor-pointer shrink-0"
                  >
                    Đặt lại bộ lọc
                  </button>
                )}
              </div>
            </div>

            {dateValidationError && (
              <p
                role="alert"
                className="text-xs font-semibold text-[#C10230] bg-red-50 border border-red-200 px-3 py-2 rounded font-sans"
              >
                {dateValidationError}
              </p>
            )}

            {/* 3 Bộ lọc: Lĩnh vực, Người ký, Đơn vị ban hành */}
            <div
              className={`${
                showMobileFilters || activeDropdownFilterCount > 0
                  ? 'grid'
                  : 'hidden sm:grid'
              } grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100`}
            >
              {/* 1. Lĩnh vực */}
              <div className="space-y-1">
                <label
                  htmlFor="doc-filter-field"
                  className="block text-[11px] font-bold text-slate-600 font-eiu-display uppercase"
                >
                  Lĩnh vực:
                </label>
                <div className="relative">
                  <select
                    id="doc-filter-field"
                    name="docFieldFilter"
                    value={fieldFilter}
                    onChange={(e) => {
                      setFieldFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-11 sm:h-9 pl-2.5 pr-8 py-0 bg-white border border-slate-300 rounded text-base sm:text-xs font-semibold text-[#133F68] appearance-none leading-normal cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68]"
                  >
                    {FIELD_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f === 'ALL' ? 'Tất cả lĩnh vực' : f}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="w-3.5 h-3.5 text-[#133F68] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* 2. Người ký */}
              <div className="space-y-1">
                <label
                  htmlFor="doc-filter-signer"
                  className="block text-[11px] font-bold text-slate-600 font-eiu-display uppercase"
                >
                  Người ký:
                </label>
                <div className="relative">
                  <select
                    id="doc-filter-signer"
                    name="docSignerFilter"
                    value={signerFilter}
                    onChange={(e) => {
                      setSignerFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-11 sm:h-9 pl-2.5 pr-8 py-0 bg-white border border-slate-300 rounded text-base sm:text-xs font-semibold text-[#133F68] appearance-none leading-normal cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68]"
                  >
                    <option value="ALL">Tất cả người ký</option>
                    {NAMED_SIGNERS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                    <option value="Khác">Khác</option>
                  </select>
                  <ChevronDown
                    className="w-3.5 h-3.5 text-[#133F68] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* 3. Đơn vị ban hành */}
              <div className="space-y-1">
                <label
                  htmlFor="doc-filter-unit"
                  className="block text-[11px] font-bold text-slate-600 font-eiu-display uppercase"
                >
                  Đơn vị ban hành:
                </label>
                <div className="relative">
                  <select
                    id="doc-filter-unit"
                    name="docUnitFilter"
                    value={unitFilter}
                    onChange={(e) => {
                      setUnitFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-11 sm:h-9 pl-2.5 pr-8 py-0 bg-white border border-slate-300 rounded text-base sm:text-xs font-semibold text-[#133F68] appearance-none leading-normal cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68]"
                  >
                    {ISSUING_UNIT_OPTIONS.map((u) => (
                      <option key={u} value={u}>
                        {u === 'ALL' ? 'Tất cả đơn vị' : u}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="w-3.5 h-3.5 text-[#133F68] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            DANH SÁCH VĂN BẢN (CARD LIST TRÊN MOBILE <768PX, BẢNG 5 CỘT TRÊN DESKTOP)
           ===================================================================== */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display">
            DANH SÁCH VĂN BẢN HỘI SINH VIÊN ({filteredDocs.length})
          </h2>

          {filteredDocs.length === 0 ? (
            <div className="bg-white border border-slate-200 p-10 text-center space-y-3.5 shadow-2xs">
              <p className="text-base font-bold text-[#133F68] font-eiu-display">
                Không tìm thấy văn bản nào phù hợp
              </p>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-sans">
                Vui lòng thử điều chỉnh từ khóa, khoảng thời gian ban hành hoặc
                bộ lọc thể loại khác.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="min-h-[44px] sm:min-h-[38px] px-5 py-2.5 bg-[#133F68] hover:bg-[#0054A6] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer font-eiu-display"
              >
                Xem toàn bộ {OFFICIAL_DOCUMENTS.length} văn bản
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Mobile Card List (< 768px) cho trải nghiệm đọc mượt trên 390px */}
              <div className="md:hidden space-y-3">
                {paginatedDocs.map((doc, idx) => {
                  const rowNum = (safePage - 1) * DOCS_PER_PAGE + idx + 1;
                  return (
                    <article
                      key={`mob-${doc.id}`}
                      className="bg-white border border-slate-300 border-t-3 border-t-[#133F68] p-4 space-y-3 shadow-2xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-eiu-serif text-xs font-bold text-slate-500 tabular-nums">
                            #{String(rowNum).padStart(2, '0')}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedDoc(doc)}
                            className="font-eiu-serif font-bold text-sm text-[#133F68] hover:text-[#C10230] underline underline-offset-2 text-left cursor-pointer"
                          >
                            {doc.documentNumber}
                          </button>
                          <span className="px-2 py-0.5 bg-[#EAE3D2] text-[#133F68] text-[11px] font-bold font-eiu-display">
                            {doc.docType}
                          </span>
                        </div>
                        <span className="font-eiu-serif text-xs text-slate-600 tabular-nums">
                          {doc.signedDate}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold leading-snug font-eiu-display">
                        <button
                          type="button"
                          onClick={() => setSelectedDoc(doc)}
                          className="text-left text-[#133F68] hover:text-[#C10230] cursor-pointer"
                        >
                          {doc.title}
                        </button>
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] font-sans text-slate-600">
                        <span>{doc.field}</span>
                        <span aria-hidden="true">•</span>
                        <span>Người ký: {doc.signerName}</span>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setSelectedDoc(doc)}
                          className="w-full min-h-[44px] px-3 py-2 bg-[#133F68] hover:bg-[#0054A6] text-white text-xs font-bold uppercase tracking-wider font-eiu-display inline-flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 shrink-0" />
                          <span>Xem văn bản</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Desktop Table (>= 768px) giữ nguyên cấu trúc 5 cột hành chính */}
              <div className="hidden md:block bg-white border border-slate-300 overflow-x-auto shadow-2xs">
                <table className="eiu-table min-w-[720px]">
                  <thead>
                    <tr>
                      <th className="w-14 text-center!">STT</th>
                      <th className="w-38 text-center!">Số kí hiệu</th>
                      <th className="w-28 text-center! whitespace-nowrap">
                        Ngày
                        <br />
                        ban hành
                      </th>
                      <th className="text-center!">Trích yếu</th>
                      <th className="w-40 text-center!">File đính kèm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedDocs.map((doc, idx) => {
                      const rowNum = (safePage - 1) * DOCS_PER_PAGE + idx + 1;
                      return (
                        <tr key={doc.id}>
                          <td className="text-center font-eiu-serif text-xs text-slate-600 tabular-nums">
                            {rowNum}
                          </td>

                          <td>
                            <button
                              type="button"
                              onClick={() => setSelectedDoc(doc)}
                              className="font-eiu-serif font-bold text-sm text-[#133F68] hover:text-[#C10230] hover:underline underline-offset-2 text-left cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0054A6]"
                            >
                              {doc.documentNumber}
                            </button>
                            <div className="mt-1">
                              <span className="inline-block px-2 py-0.5 bg-[#EAE3D2] text-[#133F68] text-[11px] font-bold font-eiu-display whitespace-nowrap">
                                {doc.docType}
                              </span>
                            </div>
                          </td>

                          <td className="text-center font-eiu-serif text-xs text-slate-700 tabular-nums whitespace-nowrap">
                            {doc.signedDate}
                          </td>

                          <td className="space-y-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedDoc(doc)}
                              className="text-left font-bold text-[#133F68] hover:text-[#C10230] hover:underline underline-offset-2 leading-snug cursor-pointer font-eiu-display focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0054A6]"
                            >
                              {doc.title}
                            </button>
                            <div className="text-[11px] font-sans text-slate-500">
                              <span>{doc.field}</span>
                            </div>
                          </td>

                          <td className="text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedDoc(doc)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#133F68] hover:bg-[#0054A6] text-white text-[11px] font-bold uppercase tracking-wider cursor-pointer font-eiu-display transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5 shrink-0" />
                              <span>Xem văn bản</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* PHÂN TRANG CĂN GIỮA ĐỒNG BỘ */}
              {totalPages > 1 && (
                <nav
                  aria-label="Phân trang danh sách văn bản"
                  className="pt-2 flex items-center justify-center gap-1.5"
                >
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => handlePageChange(Math.max(1, safePage - 1))}
                    aria-label="Trang trước"
                    className="h-10 px-4 bg-white border border-slate-300 hover:border-[#133F68] hover:text-[#133F68] disabled:opacity-35 disabled:pointer-events-none text-[#133F68] text-xs font-bold uppercase tracking-wider font-eiu-display inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Trước</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => {
                      const isCurrent = pageNum === safePage;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handlePageChange(pageNum)}
                          aria-current={isCurrent ? 'page' : undefined}
                          aria-label={`Trang ${pageNum}`}
                          className={`w-10 h-10 text-xs font-bold font-eiu-display transition-colors cursor-pointer shadow-2xs ${
                            isCurrent
                              ? 'bg-[#C10230] text-white border border-[#C10230] shadow-xs'
                              : 'bg-white text-[#133F68] border border-slate-300 hover:border-[#133F68] hover:bg-slate-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}

                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, safePage + 1))
                    }
                    aria-label="Trang tiếp theo"
                    className="h-10 px-4 bg-white border border-slate-300 hover:border-[#133F68] hover:text-[#133F68] disabled:opacity-35 disabled:pointer-events-none text-[#133F68] text-xs font-bold uppercase tracking-wider font-eiu-display inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>Sau</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </nav>
              )}
            </div>
          )}
        </section>
      </div>

      {/* =====================================================================
          POPUP CHI TIẾT THÔNG TIN VÀ XEM TRƯỚC (PREVIEW) VĂN BẢN
         ===================================================================== */}
      {selectedDoc && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDocModal();
          }}
        >
          <div
            ref={docModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-doc-title"
            tabIndex={-1}
            className="bg-white max-w-3xl w-full border-2 border-[#133F68] shadow-2xl overflow-hidden my-auto focus:outline-none"
          >
            {/* Header Popup */}
            <div className="bg-[#133F68] text-white px-5 sm:px-6 py-4 flex items-center justify-between gap-3 border-b-3 border-[#A68556]">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileCheck2 className="w-5 h-5 text-[#FCB900] shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider font-eiu-display truncate">
                  Chi tiết Văn bản Hội Sinh viên — {selectedDoc.documentNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={closeDocModal}
                aria-label="Đóng cửa sổ chi tiết văn bản"
                className="w-11 h-11 -mr-2 rounded-full hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nội dung Popup */}
            <div className="p-5 sm:p-6 space-y-5 max-h-[calc(90vh-90px)] overflow-y-auto text-xs">
              {/* Bảng thông tin thuộc tính văn bản đầy đủ */}
              <div className="border border-slate-300 bg-white divide-y divide-slate-200 font-sans">
                {/* 1. Tên / Trích yếu văn bản */}
                <div className="grid grid-cols-1 sm:grid-cols-12">
                  <div className="sm:col-span-4 bg-[#F8FAFC] px-3.5 py-2.5 font-bold text-[#133F68]">
                    Tên / Trích yếu văn bản
                  </div>
                  <div
                    id="modal-doc-title"
                    className="sm:col-span-8 px-3.5 py-2.5 font-bold text-[#133F68] leading-snug"
                  >
                    {selectedDoc.title}
                  </div>
                </div>

                {/* 2. Số kí hiệu */}
                <div className="grid grid-cols-1 sm:grid-cols-12">
                  <div className="sm:col-span-4 bg-[#F8FAFC] px-3.5 py-2.5 font-bold text-[#133F68]">
                    Số kí hiệu
                  </div>
                  <div className="sm:col-span-8 px-3.5 py-2.5">
                    <span className="font-eiu-serif text-sm font-bold text-[#133F68]">
                      {selectedDoc.documentNumber}
                    </span>
                  </div>
                </div>

                {/* 3. Ngày ban hành */}
                <div className="grid grid-cols-1 sm:grid-cols-12">
                  <div className="sm:col-span-4 bg-[#F8FAFC] px-3.5 py-2.5 font-bold text-[#133F68]">
                    Ngày ban hành
                  </div>
                  <div className="sm:col-span-8 px-3.5 py-2.5 font-eiu-serif font-semibold text-slate-800 tabular-nums">
                    {selectedDoc.signedDate}
                  </div>
                </div>

                {/* 4. Ngày hiệu lực */}
                <div className="grid grid-cols-1 sm:grid-cols-12">
                  <div className="sm:col-span-4 bg-[#F8FAFC] px-3.5 py-2.5 font-bold text-[#133F68]">
                    Ngày hiệu lực
                  </div>
                  <div className="sm:col-span-8 px-3.5 py-2.5 font-eiu-serif font-semibold text-slate-800 tabular-nums">
                    {selectedDoc.effectiveDate}
                  </div>
                </div>

                {/* 5. Thể loại */}
                <div className="grid grid-cols-1 sm:grid-cols-12">
                  <div className="sm:col-span-4 bg-[#F8FAFC] px-3.5 py-2.5 font-bold text-[#133F68]">
                    Thể loại
                  </div>
                  <div className="sm:col-span-8 px-3.5 py-2.5">
                    <span className="inline-block px-2 py-0.5 bg-[#EAE3D2] text-[#133F68] text-[11px] font-bold uppercase font-eiu-display">
                      {selectedDoc.docType}
                    </span>
                  </div>
                </div>

                {/* 6. Lĩnh vực */}
                <div className="grid grid-cols-1 sm:grid-cols-12">
                  <div className="sm:col-span-4 bg-[#F8FAFC] px-3.5 py-2.5 font-bold text-[#133F68]">
                    Lĩnh vực
                  </div>
                  <div className="sm:col-span-8 px-3.5 py-2.5 text-slate-800 font-medium">
                    {selectedDoc.field}
                  </div>
                </div>

                {/* 7. Đơn vị ban hành */}
                <div className="grid grid-cols-1 sm:grid-cols-12">
                  <div className="sm:col-span-4 bg-[#F8FAFC] px-3.5 py-2.5 font-bold text-[#133F68]">
                    Đơn vị ban hành
                  </div>
                  <div className="sm:col-span-8 px-3.5 py-2.5 text-slate-800">
                    {selectedDoc.issuingBody}
                  </div>
                </div>

                {/* 8. Người ký */}
                <div className="grid grid-cols-1 sm:grid-cols-12">
                  <div className="sm:col-span-4 bg-[#F8FAFC] px-3.5 py-2.5 font-bold text-[#133F68]">
                    Người ký
                  </div>
                  <div className="sm:col-span-8 px-3.5 py-2.5 text-slate-800">
                    <strong>{selectedDoc.signerName}</strong> —{' '}
                    <span className="text-slate-600">
                      {selectedDoc.signerTitle}
                    </span>
                  </div>
                </div>

                {/* 9. Link tải văn bản về */}
                <div className="grid grid-cols-1 sm:grid-cols-12">
                  <div className="sm:col-span-4 bg-[#F8FAFC] px-3.5 py-2.5 font-bold text-[#133F68]">
                    Tải văn bản về
                  </div>
                  <div className="sm:col-span-8 px-3.5 py-2.5">
                    <button
                      type="button"
                      onClick={() => downloadDocumentFile(selectedDoc)}
                      className="inline-flex items-center gap-1.5 text-[#0054A6] hover:text-[#C10230] font-bold underline underline-offset-2 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {selectedDoc.attachmentName}
                        {selectedDoc.attachmentSize
                          ? ` (${selectedDoc.attachmentSize})`
                          : ''}
                      </span>
                    </button>
                  </div>
                </div>

                {/* 10. Văn bản liên quan (Luôn giữ hàng này; nếu không có thì để trống) */}
                <div className="grid grid-cols-1 sm:grid-cols-12">
                  <div className="sm:col-span-4 bg-[#F8FAFC] px-3.5 py-2.5 font-bold text-[#133F68]">
                    Văn bản liên quan
                  </div>
                  <div className="sm:col-span-8 px-3.5 py-2.5 min-h-[38px]">
                    {relatedDocs.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {relatedDocs.map((rel) => (
                          <button
                            key={rel.id}
                            type="button"
                            onClick={() => setSelectedDoc(rel)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F0F6FC] hover:bg-[#133F68] text-[#133F68] hover:text-white border border-[#0054A6]/30 text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            <FileText className="w-3 h-3 shrink-0" />
                            <span>{rel.documentNumber}</span>
                            <span className="hidden sm:inline max-w-[200px] truncate">
                              — {rel.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Ô PREVIEW VĂN BẢN NÀY */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#133F68] font-eiu-display flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-[#0054A6]" />
                    <span>Xem trước văn bản</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const html = buildPrintableHtml(selectedDoc);
                      const blob = new Blob([html], {
                        type: 'text/html;charset=utf-8',
                      });
                      const url = URL.createObjectURL(blob);
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0054A6] hover:text-[#C10230] cursor-pointer font-eiu-display uppercase"
                  >
                    <span>Mở rộng cửa sổ đọc</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="bg-slate-200/80 border border-slate-300 p-3 sm:p-5 max-h-[380px] overflow-y-auto">
                  {selectedDoc.fileUrl ? (
                    <iframe
                      src={selectedDoc.fileUrl}
                      title={`Xem trước ${selectedDoc.documentNumber}`}
                      className="w-full h-[340px] bg-white border border-slate-200"
                    />
                  ) : (
                    /* Bản mô phỏng văn bản hành chính A4 chuẩn HSV EIU */
                    <div className="bg-white border border-slate-300 shadow-sm p-5 sm:p-8 mx-auto max-w-[600px] font-eiu-serif text-slate-900 space-y-5 text-[13px]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                        <div className="space-y-0.5">
                          <div className="font-bold uppercase text-[11.5px]">
                            HỘI SINH VIÊN VIỆT NAM
                          </div>
                          <div className="font-bold uppercase text-[11.5px] border-b border-slate-800 inline-block pb-0.5">
                            TRƯỜNG ĐH QUỐC TẾ MIỀN ĐÔNG
                          </div>
                          <div className="pt-1.5 text-xs">
                            Số: <strong>{selectedDoc.documentNumber}</strong>
                          </div>
                        </div>
                        <div className="space-y-0.5">
                          <div className="font-bold uppercase text-[11.5px]">
                            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                          </div>
                          <div className="font-bold text-[12px] border-b border-slate-800 inline-block pb-0.5">
                            Độc lập - Tự do - Hạnh phúc
                          </div>
                          <div className="pt-1.5 text-xs italic">
                            {formatSignedDateParts(selectedDoc.signedDate)}
                          </div>
                        </div>
                      </div>

                      <div className="text-center space-y-1.5 pt-2">
                        <div className="text-base font-bold uppercase tracking-wide text-[#133F68]">
                          {selectedDoc.docType}
                        </div>
                        <div className="font-bold text-[13.5px] leading-snug max-w-md mx-auto">
                          {selectedDoc.title}
                        </div>
                      </div>

                      <div className="space-y-2.5 text-justify leading-relaxed text-[13px]">
                        <p>{selectedDoc.summary}</p>
                        {selectedDoc.keyPoints &&
                          selectedDoc.keyPoints.length > 0 && (
                            <ul className="list-disc pl-5 space-y-1">
                              {selectedDoc.keyPoints.map((kp) => (
                                <li key={kp}>{kp}</li>
                              ))}
                            </ul>
                          )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 text-xs">
                        <div>
                          <div className="font-bold italic">Nơi nhận:</div>
                          <div>- Như trên;</div>
                          <div>- Lưu VP 206.B06.</div>
                        </div>
                        <div className="text-center space-y-1">
                          <div className="font-bold uppercase">
                            TM. {selectedDoc.issuingBody}
                          </div>
                          <div className="text-[11px]">
                            {selectedDoc.signerTitle}
                          </div>
                          <div className="py-2 italic font-bold text-[#C10230]">
                            (Đã ký)
                          </div>
                          <div className="font-bold">
                            {selectedDoc.signerName}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => downloadDocumentFile(selectedDoc)}
                  className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0054A6] hover:bg-[#133F68] text-white font-bold uppercase tracking-wider font-eiu-display cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>
                    {selectedDoc.fileUrl ? 'Tải văn bản về' : 'Mở bản in / Lưu PDF'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={closeDocModal}
                  className="min-h-[44px] px-5 py-2.5 bg-[#133F68] hover:bg-[#02294E] text-white font-bold uppercase font-eiu-display cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VanBanSearchBridge() {
  const searchParams = useSearchParams();
  const docParam = searchParams.get('doc');
  const typeParam = searchParams.get('type');
  const qParam = searchParams.get('q') || '';

  const matchedDoc = docParam
    ? OFFICIAL_DOCUMENTS.find(
        (d) => d.documentNumber.toLowerCase() === docParam.trim().toLowerCase()
      ) || null
    : null;

  const matchedPill = typeParam
    ? DOC_TYPE_PILLS.find(
        (p) => p.slug === typeParam.trim().toLowerCase()
      )?.id || 'ALL'
    : 'ALL';

  return (
    <VanBanContent
      key={`${docParam || ''}::${typeParam || ''}::${qParam}`}
      initialSelectedDoc={matchedDoc}
      initialType={matchedPill}
      initialQuery={qParam}
    />
  );
}

export default function VanBanPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1140px] mx-auto px-4 py-16 text-center text-sm text-slate-500">
          Đang tải Văn bản Hội Sinh viên...
        </div>
      }
    >
      <VanBanSearchBridge />
    </Suspense>
  );
}
