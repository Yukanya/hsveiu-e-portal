'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SubpageBanner } from '@/components/public/subpage-banner';
import { OFFICIAL_DOCUMENTS } from '@/data/mock-data';
import { OfficialDocumentItem } from '@/types';
import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Minus,
  Plus,
  QrCode,
  Search,
  X,
} from 'lucide-react';

type DocTypeFilter = 'ALL' | OfficialDocumentItem['docType'];

const DOC_TYPE_PILLS: { id: DocTypeFilter; label: string }[] = [
  { id: 'ALL', label: 'Tất cả văn bản' },
  { id: 'QUYẾT ĐỊNH', label: 'Quyết định (QĐ-HSV)' },
  { id: 'THÔNG BÁO', label: 'Thông báo (TB-HSV)' },
];

const KEY_REGULATIONS_ACCORDION = [
  {
    id: 'acc-09',
    title:
      'Quyết định 09/QĐ-HSV (Sửa đổi, bổ sung năm 2026) — Chuẩn Sinh viên 5 Tốt, Top 10% Tiêu biểu & Tập thể SV5T',
    points: [
      '1. Đạo đức tốt: Điểm rèn luyện trung bình cả năm học ≥ 80/100 điểm; không vi phạm pháp luật, quy chế Nhà trường; đạt thêm ít nhất 01 tiêu chí phụ (tham gia cuộc thi tìm hiểu chính trị/pháp luật hoặc nêu gương người tốt việc tốt).',
      '2. Học tập tốt (Chuẩn 2026): Điểm trung bình chung năm học (gia quyền tín chỉ các Học kỳ Quý EIU) HOẶC Điểm tích lũy đạt từ 3.00/4.00 trở lên — hệ thống tự động ưu tiên lấy mức điểm cao hơn MAX(GPA năm học, GPA tích lũy) — kèm ít nhất 01 tiêu chí phụ (NCKH, cuộc thi học thuật, hoặc sinh hoạt CLB học thuật có xác nhận Mentor).',
      '3. Thể lực tốt: Hoàn thành đủ 03 môn Giáo dục thể chất theo chương trình đào tạo và đạt danh hiệu "Sinh viên Khỏe" cấp Trường (Phụ lục 1) hoặc tham gia rèn luyện định kỳ tại CLB thể thao / thi đấu từ cấp Khoa trở lên.',
      '4. Tình nguyện tốt: Tích lũy tối thiểu 05 ngày tình nguyện/năm học VÀ tham gia hiến máu tình nguyện hoặc hoạt động tích cực tại CLB/Đội công tác xã hội.',
      '5. Hội nhập tốt: Hoàn thành ít nhất 01 khóa Kỹ năng thực hành xã hội (Phụ lục 3) hoặc được khen thưởng Đoàn – Hội + tham gia ≥ 01 hoạt động hội nhập + đạt ≥ 01 tiêu chí phụ ngoại ngữ / giao lưu quốc tế.',
      '6. SV5T Tiêu biểu Toàn trường (Trần Top 10%): Đạt SV5T cấp Trường + có từ 02 tiêu chí phụ trở lên ở cả 04 tiêu chuẩn (Đạo đức, Học tập, Thể lực, Hội nhập) + đạt tiêu chí ưu tiên ở Tình nguyện tốt.',
      '7. Tập thể Sinh viên 5 Tốt: Thỏa đồng thời 03 điều kiện — 100% sinh viên đăng ký phấn đấu SV5T, ít nhất 30% sinh viên đạt SV5T cấp Trường và 0% sinh viên vi phạm kỷ luật.',
    ],
  },
  {
    id: 'acc-28',
    title:
      'Quyết định 28/QĐ-HSV — Quy định cấp Giấy chứng nhận điện tử (E-Certificate) & Hệ số Ngày tình nguyện',
    points: [
      '1. Thẩm định chủ trương trước ≥ 03 ngày: Đơn vị tổ chức gửi tờ trình đề nghị công nhận ngày tình nguyện qua Trưởng Ban Tổ chức và Xây dựng Hội trình Ban Thư ký trước sự kiện ít nhất 03 ngày (72 giờ).',
      '2. Hệ số quy đổi (Phụ lục 2, QĐ 09/QĐ-HSV): Áp dụng cho lĩnh vực 06 - Công tác Đoàn – Hội gồm Hệ số ×3 (Trưởng / Phó các Ban, Đội, Đội hình BTC), Hệ số ×2 (Thành viên Ban Tổ chức), Hệ số ×1 (Cộng tác viên hỗ trợ / Chiến sĩ / Sinh viên tham gia). Riêng Hiến máu tình nguyện (04 - Sức khỏe) công nhận cố định 5.0 ngày/lần.',
      '3. Mẫu danh sách Phụ lục 1 & Cam kết SLA 07 ngày làm việc: Danh sách đề nghị cấp GCN bắt buộc sắp xếp tăng dần theo Mã số sinh viên (10 chữ số); Ban Thư ký & Văn phòng 206.B06 ban hành Quyết định trong tối đa 07 ngày làm việc.',
      '4. Quy chuẩn Phụ lục 2: E-Certificate có số hiệu trùng STT sinh viên trong Quyết định, đính kèm mã QR dẫn trực tiếp tới Quyết định công nhận và mặc định đóng chữ "(Đã ký)" (không chèn ảnh mộc/chữ ký khi chưa bật cờ cho phép).',
    ],
  },
  {
    id: 'acc-23-24',
    title:
      'Quyết định 23/QĐ-HSV, 24/QĐ-HSV & Thông báo 04/TB-HSV — Quy chế BCH, Văn phòng 206.B06 & Các Ban chuyên môn',
    points: [
      '1. Cấp lãnh đạo & giám sát: Ban Chấp hành Khóa II gồm 15 đồng chí (Ban Thư ký 05 đồng chí: Chủ tịch Trương Châu Phước Lộc, PCT TT Nguyễn Như Quỳnh, PCT Trần Thị Thu Huyền, 02 UV BTK); Ban Kiểm tra gồm 05 đồng chí.',
      '2. Văn phòng Hội Sinh viên (Phòng 206.B06): Vận hành theo cơ chế đồng điều hành — Chánh Văn phòng Nguyễn Mỹ Hạnh phụ trách đối ngoại với các phòng/ban nhà trường, Tổng Thư ký Nguyễn Như Quỳnh phụ trách nội bộ.',
      '3. Ban TC-XDH & Ban TG-PT: Ban TC-XDH quản lý 04 Cụm Khoa (25 Chi hội) và Cụm 30 CLB – Đội – Nhóm; Ban TG-PT điều hành Mảng Tuyên giáo (Design, Video, Photo) và Mảng Phong trào (Tài chính, Nội dung, MC + Đội CTV Xung kích quản lý 02 Tiểu ban Hậu cần – Sân khấu & Lễ tân – Khánh tiết – Văn thể mỹ).',
    ],
  },
];

function VanBanContent({
  initialSelectedDoc,
  initialQuery,
  initialOpenAcc,
}: {
  initialSelectedDoc: OfficialDocumentItem | null;
  initialQuery: string;
  initialOpenAcc: string;
}) {
  const [docTypeFilter, setDocTypeFilter] = useState<DocTypeFilter>('ALL');
  const [search, setSearch] = useState(initialQuery);
  const [selectedDoc, setSelectedDoc] = useState<OfficialDocumentItem | null>(
    initialSelectedDoc
  );
  const [openAccId, setOpenAccId] = useState<string>(initialOpenAcc);

  const filteredDocs = OFFICIAL_DOCUMENTS.filter((doc) => {
    const matchType = docTypeFilter === 'ALL' || doc.docType === docTypeFilter;
    const q = search.trim().toLowerCase();
    const matchText =
      !q ||
      doc.documentNumber.toLowerCase().includes(q) ||
      doc.title.toLowerCase().includes(q) ||
      doc.summary.toLowerCase().includes(q) ||
      doc.signerName.toLowerCase().includes(q);
    return matchType && matchText;
  });

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <SubpageBanner
        kicker="VĂN PHÒNG HỘI SINH VIÊN (PHÒNG 206.B06) — VĂN THƯ & LƯU TRỮ SỐ"
        title="Hệ thống Văn bản Pháp lý & Quy chế Khóa II"
        subtitle="Tra cứu Quyết định, Quy chế, Thông báo phân công nhân sự và tóm tắt chuẩn nghiệp vụ nhiệm kỳ 2026 – 2028"
        breadcrumbs={[{ label: 'Văn bản & Quy chế' }]}
      />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-9 space-y-10">
        {/* PHẦN 1: BỘ LỌC & BẢNG DANH MỤC VĂN BẢN .eiu-table */}
        <section className="space-y-4">
          <div className="bg-white border border-slate-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {DOC_TYPE_PILLS.map((pill) => {
                const active = docTypeFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setDocTypeFilter(pill.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer font-eiu-display ${
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

            <div className="relative w-full md:w-72 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm số hiệu (09/QĐ-HSV), trích yếu..."
                aria-label="Tìm kiếm văn bản"
                className="w-full h-9 pl-9 pr-3 bg-white border border-slate-300 rounded text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display">
                DANH MỤC VĂN BẢN PHÁP LÝ HIỆN HÀNH ({filteredDocs.length})
              </h2>
              <span className="text-xs italic text-slate-600">
                *Lưu trữ gốc tại Văn phòng Hội Sinh viên — Phòng 206.B06
              </span>
            </div>

            <div className="bg-white border border-slate-300 overflow-x-auto">
              <table className="eiu-table">
                <thead>
                  <tr>
                    <th className="w-12 text-center">TT</th>
                    <th className="w-32">Số hiệu</th>
                    <th>Trích yếu nội dung &amp; Cơ quan ban hành</th>
                    <th className="w-30">Ngày ký</th>
                    <th className="w-44">Người ký</th>
                    <th className="w-32 text-right">Trích yếu &amp; QR</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc, idx) => (
                    <tr key={doc.id}>
                      <td className="text-center font-mono text-xs text-slate-600">
                        {idx + 1}
                      </td>
                      <td>
                        <div className="font-mono font-bold text-[#133F68]">
                          {doc.documentNumber}
                        </div>
                        <span className="inline-block mt-1 px-1.5 py-0.5 bg-[#EAE3D2] text-[#133F68] text-[10px] font-bold font-eiu-display">
                          {doc.docType}
                        </span>
                      </td>
                      <td className="space-y-1">
                        <button
                          type="button"
                          onClick={() => setSelectedDoc(doc)}
                          className="text-left font-bold text-[#133F68] hover:text-[#C10230] leading-snug cursor-pointer"
                        >
                          {doc.title}
                        </button>
                        <div className="text-xs text-slate-600 line-clamp-2">
                          {doc.summary}
                        </div>
                      </td>
                      <td className="font-mono text-xs text-slate-700">
                        {doc.signedDate}
                      </td>
                      <td className="text-xs">
                        <div className="font-bold text-slate-900">
                          {doc.signerName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {doc.signerTitle}
                        </div>
                      </td>
                      <td className="text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedDoc(doc)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#133F68] hover:bg-[#0054A6] text-white text-[11px] font-bold uppercase tracking-wider cursor-pointer font-eiu-display"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Xem &amp; QR</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* PHẦN 2: ACCORDION QUY ĐỊNH TRỌNG TÂM KHÓA II (CHUẨN HÓA GPA ≥ 3.00 & HỆ SỐ 1-2-3) */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display">
            TÓM TẮT QUY ĐỊNH NGHIỆP VỤ TRỌNG TÂM KHÓA II
          </h2>

          <div className="space-y-2.5">
            {KEY_REGULATIONS_ACCORDION.map((acc) => {
              const isOpen = openAccId === acc.id;
              return (
                <div key={acc.id} className="border border-slate-300 bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenAccId(isOpen ? '' : acc.id)}
                    aria-expanded={isOpen}
                    className={`w-full px-5 py-3.5 text-left text-xs sm:text-[13px] font-bold flex items-center justify-between gap-4 transition-colors cursor-pointer font-eiu-display ${
                      isOpen
                        ? 'bg-[#133F68] text-white'
                        : 'bg-[#EFEFEF] text-[#133F68] hover:bg-[#EAE3D2]'
                    }`}
                  >
                    <span>{acc.title}</span>
                    {isOpen ? (
                      <Minus className="w-4 h-4 shrink-0 text-[#FCB900]" />
                    ) : (
                      <Plus className="w-4 h-4 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-5 space-y-2.5 text-[13.5px] text-slate-800 leading-relaxed">
                      {acc.points.map((pt) => (
                        <p key={pt}>{pt}</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* MODAL CHI TIẾT TRÍCH YẾU VĂN BẢN & MÃ QR XÁC THỰC */}
      {selectedDoc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Trích yếu văn bản ${selectedDoc.documentNumber}`}
          className="fixed inset-0 z-50 bg-slate-900/65 flex items-center justify-center p-4"
          onClick={() => setSelectedDoc(null)}
        >
          <div
            className="bg-white max-w-2xl w-full border-2 border-[#133F68] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#133F68] text-white px-5 py-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-5 h-5 text-[#FCB900] shrink-0" />
                <div>
                  <div className="text-xs font-mono text-[#00BCFF] font-bold">
                    {selectedDoc.docType} SỐ {selectedDoc.documentNumber} • KÝ
                    NGÀY {selectedDoc.signedDate}
                  </div>
                  <div className="text-sm font-bold font-eiu-display">
                    {selectedDoc.issuingBody}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                aria-label="Đóng"
                className="text-white/80 hover:text-white cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-[13.5px]">
              <h3 className="text-base sm:text-lg font-bold text-[#133F68] leading-snug font-eiu-display">
                {selectedDoc.title}
              </h3>

              <p className="text-slate-700 leading-relaxed bg-[#F8FAFC] border-l-4 border-[#A68556] p-4">
                {selectedDoc.summary}
              </p>

              {selectedDoc.keyPoints && selectedDoc.keyPoints.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#133F68] font-eiu-display">
                    Điểm cốt lõi cần lưu ý:
                  </div>
                  <ul className="space-y-2">
                    {selectedDoc.keyPoints.map((kp) => (
                      <li
                        key={kp}
                        className="flex items-start gap-2 text-xs text-slate-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#0054A6] shrink-0 mt-0.5" />
                        <span>{kp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 border border-slate-300 p-1.5 flex items-center justify-center shrink-0">
                    <QrCode className="w-11 h-11 text-[#133F68]" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-mono font-bold text-[#133F68]">
                      Mã định danh QR: {selectedDoc.qrSlug}
                    </div>
                    <div className="text-slate-600">
                      Người ký: <strong>{selectedDoc.signerName}</strong> (
                      {selectedDoc.signerTitle}) —{' '}
                      <em className="text-[#C10230] font-semibold">(Đã ký)</em>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {selectedDoc.documentNumber === '32/QĐ-HSV' && (
                    <Link
                      href="/tra-cuu-gcn?q=32/QĐ-HSV"
                      className="inline-flex items-center gap-1 px-4 py-2 bg-[#0054A6] hover:bg-[#133F68] text-white font-bold uppercase tracking-wider font-eiu-display"
                    >
                      <span>Xem Phụ lục 1 (11 GCN)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                  {selectedDoc.documentNumber === '09/QĐ-HSV' && (
                    <Link
                      href="/portal?tab=gpa"
                      className="inline-flex items-center gap-1 px-4 py-2 bg-[#0054A6] hover:bg-[#133F68] text-white font-bold uppercase tracking-wider font-eiu-display"
                    >
                      <span>Mở Máy tính GPA 3.00</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
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
  const qParam = searchParams.get('q') || '';

  const matchedDoc = docParam
    ? OFFICIAL_DOCUMENTS.find(
        (d) => d.documentNumber.toLowerCase() === docParam.trim().toLowerCase()
      ) || null
    : null;

  const initialAcc =
    docParam?.includes('28')
      ? 'acc-28'
      : docParam?.includes('23') ||
        docParam?.includes('24') ||
        docParam?.includes('04')
      ? 'acc-23-24'
      : 'acc-09';

  return (
    <VanBanContent
      key={`${docParam || ''}::${qParam}`}
      initialSelectedDoc={matchedDoc}
      initialQuery={qParam}
      initialOpenAcc={initialAcc}
    />
  );
}

export default function VanBanPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1140px] mx-auto px-4 py-16 text-center text-sm text-slate-500">
          Đang tải Kho Văn bản Pháp lý &amp; Quy chế...
        </div>
      }
    >
      <VanBanSearchBridge />
    </Suspense>
  );
}
