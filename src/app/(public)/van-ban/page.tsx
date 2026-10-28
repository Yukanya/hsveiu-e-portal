import React from 'react';
import Link from 'next/link';
import { OFFICIAL_DOCUMENTS } from '@/data/mock-data';
import { FileText, QrCode, ShieldCheck } from 'lucide-react';

export default function OfficialDocumentsPage() {
  return (
    <div className="space-y-10 pb-16">
      <section className="bg-[#0B2545] text-white py-10 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-sky-300">
            <FileText className="w-3.5 h-3.5" />
            <span>Hệ thống Văn thư Lưu trữ Số hóa • Văn phòng Hội Sinh viên (206.B06)</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Kho Văn Bản Pháp Lý, Quyết Định & Quy Chế Khóa II (2026 – 2028)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
            Toàn bộ Quyết định, Quy chế làm việc, Quy định xét chọn Sinh viên 5 Tốt, Quy định cấp
            Giấy chứng nhận và Thông báo phân công của Ban Chấp hành, Ban Thư ký Hội Sinh viên
            trường.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {OFFICIAL_DOCUMENTS.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-[#0B2545] text-white font-mono text-xs font-bold">
                  Số: {doc.documentNumber}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-[#F0F7FF] text-[#0054A6] border border-sky-200 text-xs font-semibold">
                  {doc.docType}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Ban hành ngày: {doc.signedDate}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-[#0B2545]">{doc.title}</h2>
              <p className="text-xs text-slate-600 leading-relaxed">{doc.summary}</p>
              <p className="text-xs text-slate-500 pt-1">
                Cơ quan ban hành: <strong className="text-slate-800">{doc.issuingBody}</strong> •
                Người ký: <strong className="text-slate-900">{doc.signerName}</strong> (
                {doc.signerTitle})
              </p>
            </div>

            <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Đã ký & đóng dấu lưu VP
              </span>
              <Link
                href="/tra-cuu-gcn"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0054A6] hover:bg-[#004282] text-white text-xs font-semibold transition-colors"
              >
                <QrCode className="w-3.5 h-3.5" />
                Xem Mẫu GCN kèm QĐ
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
