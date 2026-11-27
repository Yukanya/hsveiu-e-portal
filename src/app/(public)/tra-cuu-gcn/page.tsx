'use client';

import React, { Suspense, useMemo, useState, useSyncExternalStore } from 'react';
import { useSearchParams } from 'next/navigation';
import { SubpageBanner } from '@/components/public/subpage-banner';
import { CertificatePreviewPhuLuc2 } from '@/components/shared/certificate-preview';
import {
  decodeEiuStudentId,
  ISSUED_CERTIFICATES,
  OFFICIAL_DOCUMENTS,
} from '@/data/mock-data';
import {
  ISSUED_CERTS_KEY,
  subscribeStorageSync,
} from '@/lib/portal-storage';
import { IssuedCertificateRecord } from '@/types';
import {
  AlertCircle,
  Eye,
  Search,
  ShieldCheck,
} from 'lucide-react';

function getDynamicCertsSnapshot(): string {
  try {
    return window.localStorage.getItem(ISSUED_CERTS_KEY) || '';
  } catch {
    return '';
  }
}

function getServerDynamicCertsSnapshot(): string {
  return '';
}

function TraCuuGcnContent({ initialQuery }: { initialQuery: string }) {
  const [inputVal, setInputVal] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const [previewCertId, setPreviewCertId] = useState<string | null>(null);

  const dynamicCertsRaw = useSyncExternalStore(
    subscribeStorageSync,
    getDynamicCertsSnapshot,
    getServerDynamicCertsSnapshot
  );

  const allCertificates = useMemo<IssuedCertificateRecord[]>(() => {
    if (!dynamicCertsRaw) return ISSUED_CERTIFICATES;
    try {
      const parsed = JSON.parse(dynamicCertsRaw) as IssuedCertificateRecord[];
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return ISSUED_CERTIFICATES;
      }
      const seen = new Set(ISSUED_CERTIFICATES.map((c) => c.certCode));
      return [...parsed.filter((c) => !seen.has(c.certCode)), ...ISSUED_CERTIFICATES];
    } catch {
      return ISSUED_CERTIFICATES;
    }
  }, [dynamicCertsRaw]);

  const normalized = submittedQuery.trim();
  const upper = normalized.toUpperCase();

  // Phân tích loại mã tra cứu: (1) Số Quyết định, (2) Mã GCN, hoặc (3) MSSV / Họ tên
  const isDecisionSearch =
    upper.includes('/QĐ-HSV') || upper === '32/QĐ' || upper === 'QD32';

  const matchedCerts: IssuedCertificateRecord[] = !normalized
    ? []
    : isDecisionSearch
    ? allCertificates.filter((c) =>
        c.decisionNumber.toUpperCase().includes(upper.replace('QD32', '32/QĐ'))
      )
    : allCertificates.filter(
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

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <SubpageBanner
        title="TRA CỨU VÀ XÁC THỰC GIẤY CHỨNG NHẬN"
        subtitle="Tra cứu theo Mã số sinh viên, Số Quyết định hoặc Mã số Giấy chứng nhận."
        breadcrumbs={[{ label: 'Tra cứu GCN' }]}
      />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-9 space-y-8">
        <div className="bg-white border border-slate-200">
          <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between font-eiu-display">
            <span>Tra cứu Hồ sơ Giấy chứng nhận Trực tuyến</span>
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
                  name="certificateQuery"
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Nhập MSSV, số quyết định hoặc mã GCN..."
                  aria-label="Nhập MSSV, Số Quyết định hoặc Mã Giấy chứng nhận"
                  className="w-full h-11 sm:h-10 pl-10 pr-3 border border-slate-300 rounded font-eiu-serif text-base sm:text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68]"
                />
              </div>
              <button
                type="submit"
                className="px-6 h-11 sm:h-10 bg-[#0054A6] hover:bg-[#133F68] text-white font-bold rounded text-xs uppercase tracking-wider cursor-pointer shrink-0 font-eiu-display"
              >
                Xác thực ngay
              </button>
            </form>

            {!normalized ? null : matchedCerts.length > 0 ? (
              <div className="bg-[#51803A]/10 border border-[#51803A]/30 border-t-2 border-t-[#51803A] p-4 space-y-1.5 text-xs">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5 uppercase font-eiu-display">
                  <ShieldCheck className="w-4 h-4 text-[#51803A]" />
                  <span>
                    XÁC THỰC HỢP LỆ — {matchedCerts.length} GIẤY CHỨNG NHẬN ĐÃ
                    BAN HÀNH QUYẾT ĐỊNH
                  </span>
                </div>
                {matchedDecisionDoc ? (
                  <div className="text-emerald-900/90 max-w-prose">
                    Căn cứ:{' '}
                    <strong className="font-eiu-serif">
                      Quyết định số {matchedDecisionDoc.documentNumber}
                    </strong>{' '}
                    ký ngày {matchedDecisionDoc.signedDate} bởi{' '}
                    <strong>{matchedDecisionDoc.signerName}</strong> (
                    {matchedDecisionDoc.signerTitle}).
                  </div>
                ) : activePreviewCert ? (
                  <div className="text-emerald-900/90 max-w-prose">
                    Căn cứ:{' '}
                    <strong className="font-eiu-serif">
                      Quyết định số {activePreviewCert.decisionNumber}
                    </strong>{' '}
                    ký ngày {activePreviewCert.decisionDate} bởi{' '}
                    <strong>{activePreviewCert.signerName}</strong> (
                    {activePreviewCert.signerTitle}).
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="bg-[#C10230]/[0.06] border border-[#C10230]/25 border-t-2 border-t-[#C10230] p-4 space-y-1.5 text-xs">
                <div className="font-bold text-[#C10230] flex items-center gap-1.5 uppercase font-eiu-display">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    Chưa ghi nhận Giấy chứng nhận cho mã &ldquo;{normalized}
                    &rdquo;
                  </span>
                </div>
                {decodedMssv && decodedMssv.isValid ? (
                  <p className="text-slate-700 leading-relaxed max-w-prose">
                    Mã số sinh viên <strong>{normalized}</strong> chưa có trong
                    danh sách Giấy chứng nhận đã ban hành.
                  </p>
                ) : (
                  <p className="text-slate-700 leading-relaxed max-w-prose">
                    Không tìm thấy hồ sơ khớp với mã vừa nhập. Vui lòng kiểm tra
                    lại Mã số sinh viên, Số Quyết định hoặc Mã Giấy chứng nhận.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* DANH SÁCH CẤP GIẤY CHỨNG NHẬN */}
        {matchedCerts.length > 1 && (
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold uppercase text-[#133F68] font-eiu-display text-balance">
              DANH SÁCH CẤP GIẤY CHỨNG NHẬN — QUYẾT ĐỊNH{' '}
              {matchedCerts[0].decisionNumber}
            </h2>

            <div className="bg-white border border-slate-300 overflow-x-auto">
              <table className="eiu-table min-w-[720px]">
                <thead>
                  <tr>
                    <th className="w-12 text-center">STT</th>
                    <th className="w-36">Mã GCN</th>
                    <th className="w-28">MSSV</th>
                    <th>Họ và tên • Đơn vị</th>
                    <th>Vai trò và Hệ số</th>
                    <th className="w-24 text-center">Ngày TN</th>
                    <th className="w-32 text-right">Giấy chứng nhận</th>
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
                        <td className="text-center font-eiu-serif text-xs font-bold text-[#133F68]">
                          {String(cert.certSerialNumber).padStart(2, '0')}
                        </td>
                        <td className="font-eiu-serif text-xs font-bold text-[#0054A6] whitespace-nowrap">
                          {cert.certCode}
                        </td>
                        <td className="font-eiu-serif text-xs font-bold text-slate-900 whitespace-nowrap">
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
                        <td className="text-center font-eiu-serif text-xs font-extrabold text-[#C10230] whitespace-nowrap">
                          +{cert.volunteerDays.toFixed(1)} (×
                          {cert.multiplierApplied})
                        </td>
                        <td className="text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setPreviewCertId(cert.id)}
                            className={`inline-flex items-center gap-1 min-h-[36px] px-3 py-1.5 text-[11px] font-bold uppercase cursor-pointer font-eiu-display whitespace-nowrap shrink-0 ${
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
  const searchParams = useSearchParams();
  const urlQ = searchParams.get('q');
  const defaultQuery = urlQ && urlQ.trim() ? urlQ.trim() : '';

  return <TraCuuGcnContent key={defaultQuery || 'empty'} initialQuery={defaultQuery} />;
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
