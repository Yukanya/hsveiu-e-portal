'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SubpageBanner } from '@/components/public/subpage-banner';
import {
  decodeEiuStudentId,
  ISSUED_CERTIFICATES,
  OFFICIAL_DOCUMENTS,
} from '@/data/mock-data';
import { useRole } from '@/context/role-context';
import { IssuedCertificateRecord } from '@/types';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  FileCheck2,
  QrCode,
  Search,
  ShieldCheck,
} from 'lucide-react';

const SAMPLE_QUERIES = [
  { label: 'Quyết định 32/QĐ-HSV (Phụ lục 1 — 11 SV)', value: '32/QĐ-HSV' },
  { label: 'MSSV: 2331200066 (Hệ số ×3)', value: '2331200066' },
  { label: 'MSSV: 2531200188 (Hội viên mẫu ×1)', value: '2531200188' },
  { label: 'Mã GCN: 32-007/GCN-HSV', value: '32-007/GCN-HSV' },
];

function CertificatePreviewPhuLuc2({
  cert,
}: {
  cert: IssuedCertificateRecord;
}) {
  return (
    <section
      aria-label={`Bản xem trước Giấy chứng nhận ${cert.certCode}`}
      className="bg-white border-2 border-[#133F68] p-6 sm:p-11 max-w-4xl mx-auto shadow-xs space-y-6"
    >
      {/* Header Quốc hiệu & Cụm Logo chuẩn Phụ lục 2 Quyết định 28/QĐ-HSV */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start border-b border-slate-200 pb-6 text-center">
        <div className="sm:col-span-5 space-y-1">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img
              src="/images/eiu-logo-full.png"
              alt="Trường Đại học Quốc tế Miền Đông"
              className="h-10 w-auto object-contain"
            />
            <img
              src="/images/hsv-logo.png"
              alt="Hội Sinh viên Việt Nam"
              className="h-9 w-9 object-contain"
            />
          </div>
          {cert.headerMode === 'DOAN_HOI' ? (
            <>
              <div className="text-[10.5px] font-medium uppercase text-slate-800">
                ĐOÀN TNCS HỒ CHÍ MINH – HỘI SINH VIÊN VIỆT NAM
              </div>
              <div className="text-[11px] font-bold uppercase text-[#133F68]">
                TRƯỜNG ĐẠI HỌC QUỐC TẾ MIỀN ĐÔNG
              </div>
            </>
          ) : (
            <>
              <div className="text-[10.5px] font-medium uppercase text-slate-800">
                HỘI SINH VIÊN VIỆT NAM
              </div>
              <div className="text-[11px] font-bold uppercase text-[#133F68]">
                BCH TRƯỜNG ĐẠI HỌC QUỐC TẾ MIỀN ĐÔNG
              </div>
            </>
          )}
          <div className="text-[11px] font-bold text-slate-900">***</div>
        </div>

        <div className="sm:col-span-7 space-y-1">
          <div className="text-xs font-bold uppercase text-slate-900">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </div>
          <div className="text-xs font-bold text-slate-900 underline underline-offset-4">
            Độc lập – Tự do – Hạnh phúc
          </div>
          <div className="pt-2 text-[11px] font-mono text-slate-500">
            Số thứ tự Phụ lục 1:{' '}
            <strong className="text-[#133F68]">
              #{String(cert.certSerialNumber).padStart(2, '0')}
            </strong>{' '}
            • Mã xác thực: <strong className="text-[#133F68]">{cert.certCode}</strong>
          </div>
        </div>
      </div>

      {/* Thân Giấy chứng nhận */}
      <div className="text-center space-y-3 py-2">
        <p className="text-xs font-bold uppercase tracking-wider text-[#133F68] font-eiu-display">
          BAN CHẤP HÀNH HỘI SINH VIÊN VIỆT NAM TRƯỜNG ĐẠI HỌC QUỐC TẾ MIỀN ĐÔNG
        </p>
        <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-[#C10230] font-eiu-display">
          GIẤY CHỨNG NHẬN
        </h3>

        <div className="pt-2 space-y-1">
          <div className="text-lg sm:text-xl font-bold text-[#133F68] font-eiu-display">
            {cert.fullName}
          </div>
          <div className="text-xs font-mono text-slate-700">
            Mã số sinh viên: <strong>{cert.studentId}</strong> • Đơn vị:{' '}
            <strong className="font-sans">{cert.unitName}</strong>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-800 max-w-2xl mx-auto leading-relaxed pt-2">
          Đã hoàn thành nhiệm vụ với vai trò{' '}
          <strong className="text-[#133F68]">{cert.roleTitle}</strong> trong
          chương trình <strong>&ldquo;{cert.eventTitle}&rdquo;</strong> — được
          công nhận quy đổi{' '}
          <strong className="font-mono text-[#C10230]">
            +{cert.volunteerDays.toFixed(1)} ngày tình nguyện
          </strong>{' '}
          theo Phụ lục 2 Quyết định 09/QĐ-HSV và Quyết định số{' '}
          <strong className="font-mono">{cert.decisionNumber}</strong>.
        </p>
      </div>

      {/* Footer Giấy chứng nhận: Mã QR 2×2cm bên trái + Chữ "(Đã ký)" bên phải (TUYỆT ĐỐI KHÔNG CHÈN ẢNH MỘC/CHỮ KÝ) */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-end pt-6 border-t border-slate-200 text-xs">
        <div className="sm:col-span-5 flex items-center gap-3.5">
          <Link
            href={`/van-ban?doc=${encodeURIComponent(cert.decisionNumber)}`}
            title={`Mở Quyết định gốc ${cert.decisionNumber}`}
            className="w-20 h-20 border-2 border-[#133F68] p-1.5 flex items-center justify-center bg-white shrink-0 hover:border-[#0054A6]"
          >
            <QrCode className="w-15 h-15 text-[#133F68]" />
          </Link>
          <div className="space-y-1 text-[11px] text-slate-700 font-mono">
            <div className="font-bold text-[#133F68]">Số: {cert.certCode}</div>
            <div>Kèm theo: {cert.decisionNumber}</div>
            <Link
              href={`/van-ban?doc=${encodeURIComponent(cert.decisionNumber)}`}
              className="text-[#0054A6] font-sans font-bold hover:underline block"
            >
              Xem Quyết định gốc →
            </Link>
          </div>
        </div>

        <div className="sm:col-span-7 text-center sm:text-right space-y-1.5">
          <div className="italic text-slate-700">
            Thành phố Hồ Chí Minh, ngày {cert.decisionDate.split('/')[0]} tháng{' '}
            {cert.decisionDate.split('/')[1]} năm{' '}
            {cert.decisionDate.split('/')[2]}
          </div>
          <div className="font-bold uppercase text-slate-900 font-eiu-display">
            TM. BAN THƯ KÝ HỘI SINH VIÊN TRƯỜNG
          </div>
          <div className="font-bold uppercase text-slate-900 font-eiu-display">
            CHỦ TỊCH
          </div>
          <div className="py-2 font-bold italic text-[#C10230]">(Đã ký)</div>
          <div className="font-bold text-sm text-[#133F68] font-eiu-display">
            {cert.signerName}
          </div>
        </div>
      </div>
    </section>
  );
}

function TraCuuGcnContent({ initialQuery }: { initialQuery: string }) {
  const [inputVal, setInputVal] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const [previewCertId, setPreviewCertId] = useState<string | null>(null);

  const normalized = submittedQuery.trim();
  const upper = normalized.toUpperCase();

  // Phân tích loại mã tra cứu: (1) Số Quyết định, (2) Mã GCN, hoặc (3) MSSV / Họ tên
  const isDecisionSearch =
    upper.includes('/QĐ-HSV') || upper === '32/QĐ' || upper === 'QD32';

  const matchedCerts: IssuedCertificateRecord[] = !normalized
    ? []
    : isDecisionSearch
    ? ISSUED_CERTIFICATES.filter((c) =>
        c.decisionNumber.toUpperCase().includes(upper.replace('QD32', '32/QĐ'))
      )
    : ISSUED_CERTIFICATES.filter(
        (c) =>
          c.studentId === normalized ||
          c.certCode.toUpperCase() === upper ||
          c.fullName.toLowerCase().includes(normalized.toLowerCase())
      );

  const activePreviewCert =
    matchedCerts.find((c) => c.id === previewCertId) || matchedCerts[0] || null;

  const decodedMssv = /^\d{10}$/.test(normalized)
    ? decodeEiuStudentId(normalized)
    : null;

  const matchedDecisionDoc = isDecisionSearch
    ? OFFICIAL_DOCUMENTS.find((d) =>
        d.documentNumber.toUpperCase().includes(upper)
      )
    : activePreviewCert
    ? OFFICIAL_DOCUMENTS.find(
        (d) => d.documentNumber === activePreviewCert.decisionNumber
      )
    : undefined;

  const executeLookup = (val: string) => {
    setInputVal(val);
    setSubmittedQuery(val);
    setPreviewCertId(null);
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <SubpageBanner
        kicker="XÁC THỰC SỐ QUYẾT ĐỊNH 28/QĐ-HSV — CHỐNG LÀM GIẢ MINH CHỨNG SV5T"
        title="Tra cứu & Xác thực Giấy chứng nhận (E-Certificate)"
        subtitle="Tra cứu theo Mã số sinh viên (10 chữ số), Số Quyết định (Phụ lục 1 tăng dần MSSV) hoặc Mã số Giấy chứng nhận"
        breadcrumbs={[{ label: 'Tra cứu E-Certificate (QĐ 28/QĐ-HSV)' }]}
      />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-9 space-y-8">
        {/* KHU VỰC TRA CỨU 8/4 CHUẨN EIU */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          <div className="lg:col-span-8 bg-white border border-slate-200">
            <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between font-eiu-display">
              <span>Cổng Xác thực Hồ sơ E-Certificate Trực tuyến</span>
              <span className="font-mono text-[#00BCFF]">
                CSDL VĂN PHÒNG 206.B06
              </span>
            </div>

            <div className="p-5 space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmittedQuery(inputVal);
                  setPreviewCertId(null);
                }}
                className="flex flex-col sm:flex-row gap-2.5"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="cert-search-id"
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Nhập MSSV (VD: 2331200066), Số QĐ (32/QĐ-HSV) hoặc Mã GCN..."
                    aria-label="Nhập MSSV, Số Quyết định hoặc Mã Giấy chứng nhận"
                    className="w-full h-10 pl-10 pr-3 border border-slate-300 rounded font-mono text-xs sm:text-sm text-slate-900"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 h-10 bg-[#0054A6] hover:bg-[#133F68] text-white font-bold rounded text-xs uppercase tracking-wider cursor-pointer shrink-0 font-eiu-display"
                >
                  Xác thực ngay
                </button>
              </form>

              {/* Chip dữ liệu mẫu thử nhanh */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-semibold mr-1">
                  Tra cứu mẫu:
                </span>
                {SAMPLE_QUERIES.map((sq) => (
                  <button
                    key={sq.value}
                    type="button"
                    onClick={() => executeLookup(sq.value)}
                    className={`px-2.5 py-1 border text-[11px] font-mono transition-colors cursor-pointer ${
                      submittedQuery === sq.value
                        ? 'bg-[#133F68] text-white border-[#133F68] font-bold'
                        : 'bg-[#F5F5F5] text-[#133F68] border-slate-300 hover:border-[#133F68]'
                    }`}
                  >
                    {sq.label}
                  </button>
                ))}
              </div>

              {/* Kết quả tóm tắt trạng thái xác thực trung thực */}
              {matchedCerts.length > 0 ? (
                <div className="bg-emerald-50 border-l-4 border-[#51803A] p-4 space-y-1.5 text-xs">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5 uppercase font-eiu-display">
                    <ShieldCheck className="w-4 h-4 text-[#51803A]" />
                    <span>
                      XÁC THỰC HỢP LỆ — TÌM THẤY {matchedCerts.length} HỒ SƠ
                      GIẤY CHỨNG NHẬN ĐÃ BAN HÀNH QUYẾT ĐỊNH
                    </span>
                  </div>
                  {matchedDecisionDoc && (
                    <div className="text-emerald-900/90">
                      Căn cứ pháp lý:{' '}
                      <strong className="font-mono">
                        Quyết định số {matchedDecisionDoc.documentNumber}
                      </strong>{' '}
                      ký ngày {matchedDecisionDoc.signedDate} bởi{' '}
                      <strong>{matchedDecisionDoc.signerName}</strong> (
                      {matchedDecisionDoc.signerTitle}).
                    </div>
                  )}
                  {decodedMssv && decodedMssv.isValid && (
                    <div className="text-slate-700 font-mono text-[11px] pt-0.5">
                      Cấu trúc MSSV EIU hợp lệ: Khóa {decodedMssv.enrollmentYear}{' '}
                      • {decodedMssv.degreeLevel} • {decodedMssv.majorName}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-[#FFF9F0] border-l-4 border-[#C10230] p-4 space-y-1.5 text-xs">
                  <div className="font-bold text-[#C10230] flex items-center gap-1.5 uppercase font-eiu-display">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>
                      Chưa ghi nhận Giấy chứng nhận đã ban hành Quyết định cho
                      mã &ldquo;{normalized || '(Trống)'}&rdquo;
                    </span>
                  </div>
                  {decodedMssv && decodedMssv.isValid ? (
                    <p className="text-slate-700 leading-relaxed">
                      Mã số sinh viên <strong>{normalized}</strong> có cấu trúc
                      EIU hợp lệ (Khóa {decodedMssv.enrollmentYear} —{' '}
                      {decodedMssv.majorName}), tuy nhiên hiện chưa có tên trong
                      các Phụ lục Quyết định đã ban hành hoặc hồ sơ sự kiện đang
                      trong thời hạn thẩm định{' '}
                      <strong>SLA 07 ngày làm việc</strong> tại Văn phòng
                      206.B06.
                    </p>
                  ) : (
                    <p className="text-slate-700 leading-relaxed">
                      Vui lòng kiểm tra lại đúng Mã số sinh viên EIU (10 chữ
                      số), Số Quyết định (VD: <code>32/QĐ-HSV</code>) hoặc Mã số
                      GCN (VD: <code>32-003/GCN-HSV</code>).
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Cột phải 4/12: Quy chuẩn Phụ lục 2 Quyết định 28/QĐ-HSV */}
          <aside className="lg:col-span-4 space-y-4">
            <div className="bg-[#C10230] text-white p-6 space-y-2.5">
              <div className="w-8 h-0.5 bg-white" aria-hidden="true" />
              <h2 className="text-base font-bold font-eiu-display">
                Quy chuẩn Phụ lục 1 &amp; Phụ lục 2
              </h2>
              <p className="text-xs text-white/92 leading-relaxed">
                Theo <strong>Quyết định 28/QĐ-HSV</strong>: Danh sách Phụ lục 1
                bắt buộc sắp xếp <strong>tăng dần theo MSSV</strong>; mỗi
                E-Certificate có STT trùng khớp Quyết định, gắn mã QR xác thực
                và mặc định ghi chữ <strong>&ldquo;(Đã ký)&rdquo;</strong>.
              </p>
              <Link
                href="/van-ban?doc=28/QĐ-HSV"
                className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#FCB900] hover:underline font-eiu-display pt-1"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>XEM QUYẾT ĐỊNH 28/QĐ-HSV</span>
              </Link>
            </div>
          </aside>
        </div>

        {/* BẢNG DANH SÁCH PHỤ LỤC 1 (SẮP XẾP TĂNG DẦN MSSV) KHI TRA CỨU THEO SỐ QUYẾT ĐỊNH HOẶC CÓ NHIỀU KẾT QUẢ */}
        {matchedCerts.length > 1 && (
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base sm:text-lg font-bold uppercase text-[#133F68] font-eiu-display">
                DANH SÁCH PHỤ LỤC 1 KÈM THEO QUYẾT ĐỊNH{' '}
                {matchedCerts[0].decisionNumber} (SẮP XẾP TĂNG DẦN THEO MSSV)
              </h2>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Đã kiểm tra thứ tự MSSV tăng dần ({matchedCerts.length} SV)</span>
              </span>
            </div>

            <div className="bg-white border border-slate-300 overflow-x-auto">
              <table className="eiu-table">
                <thead>
                  <tr>
                    <th className="w-12 text-center">STT</th>
                    <th className="w-34">Mã GCN</th>
                    <th className="w-28">MSSV (↑)</th>
                    <th>Họ và tên • Đơn vị</th>
                    <th>Vai trò &amp; Hệ số</th>
                    <th className="w-24 text-center">Ngày TN</th>
                    <th className="w-28 text-right">Bản Phụ lục 2</th>
                  </tr>
                </thead>
                <tbody>
                  {matchedCerts.map((cert) => {
                    const isPreviewing = activePreviewCert?.id === cert.id;
                    return (
                      <tr
                        key={cert.id}
                        className={isPreviewing ? 'bg-[#F0F6FC]' : undefined}
                      >
                        <td className="text-center font-mono text-xs font-bold text-[#133F68]">
                          {String(cert.certSerialNumber).padStart(2, '0')}
                        </td>
                        <td className="font-mono text-xs font-bold text-[#0054A6]">
                          {cert.certCode}
                        </td>
                        <td className="font-mono text-xs font-bold text-slate-900">
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
                          <div>{cert.roleTitle}</div>
                          <div className="text-[11px] text-slate-500">
                            {cert.evidenceNote}
                          </div>
                        </td>
                        <td className="text-center font-mono text-xs font-extrabold text-[#C10230]">
                          +{cert.volunteerDays.toFixed(1)} (×
                          {cert.multiplierApplied})
                        </td>
                        <td className="text-right">
                          <button
                            type="button"
                            onClick={() => setPreviewCertId(cert.id)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase cursor-pointer font-eiu-display ${
                              isPreviewing
                                ? 'bg-[#C10230] text-white'
                                : 'bg-[#133F68] text-white hover:bg-[#0054A6]'
                            }`}
                          >
                            <Eye className="w-3 h-3" />
                            <span>{isPreviewing ? 'Đang xem' : 'Xem GCN'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* BẢN XEM TRƯỚC GIẤY CHỨNG NHẬN ĐIỆN TỬ PHỤ LỤC 2 */}
        {activePreviewCert && (
          <CertificatePreviewPhuLuc2 cert={activePreviewCert} />
        )}
      </div>
    </div>
  );
}

function TraCuuSearchBridge() {
  const { currentPersona } = useRole();
  const searchParams = useSearchParams();
  const urlQ = searchParams.get('q');

  const defaultQuery =
    urlQ && urlQ.trim()
      ? urlQ.trim()
      : currentPersona.studentId !== '-'
      ? currentPersona.studentId
      : '32/QĐ-HSV';

  return <TraCuuGcnContent key={defaultQuery} initialQuery={defaultQuery} />;
}

export default function TraCuuGcnPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1140px] mx-auto px-4 py-16 text-center text-sm text-slate-500">
          Đang tải Cổng Xác thực E-Certificate...
        </div>
      }
    >
      <TraCuuSearchBridge />
    </Suspense>
  );
}
