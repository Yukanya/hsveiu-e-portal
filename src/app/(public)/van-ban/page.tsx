'use client';

import React, { useState } from 'react';
import { SubpageBanner } from '@/components/public/subpage-banner';
import { OFFICIAL_DOCUMENTS } from '@/data/mock-data';
import { Minus, Plus } from 'lucide-react';

const KEY_REGULATIONS_ACCORDION = [
  {
    id: 'acc-09',
    title: 'Quyết định 09/QĐ-HSV — Tiêu chuẩn Sinh viên 5 Tốt & Tập thể SV5T (Sửa đổi 2026)',
    points: [
      '1. Đạo đức tốt: Điểm rèn luyện trung bình cả năm học ≥ 80/100 điểm; không vi phạm pháp luật và quy chế.',
      '2. Học tập tốt: Điểm trung bình chung năm học (bình quân gia quyền 3 học kỳ Quý EIU) ≥ 2.7/4.0 và có ít nhất 01 bài tham luận / đề tài NCKH.',
      '3. Thể lực tốt: Đạt danh hiệu "Sinh viên Khỏe" cấp Trường (Phụ lục 1) hoặc tham gia Hội thao từ cấp Khoa trở lên.',
      '4. Tình nguyện tốt: Tích lũy tối thiểu 05 ngày tình nguyện/năm (nhân hệ số 1 – 2 – 3 theo Phụ lục 2).',
      '5. Hội nhập tốt: Đạt trình độ Tiếng Anh B1 (hoặc hoàn thành 02 khóa ngoại ngữ EIU) + 01 khóa Kỹ năng (Phụ lục 3) + 01 hoạt động Hội nhập.',
      '6. Tập thể Sinh viên 5 Tốt: 100% sinh viên đăng ký tham gia, ít nhất 30% sinh viên đạt SV5T cấp Trường, không có sinh viên vi phạm kỷ luật.',
    ],
  },
  {
    id: 'acc-28',
    title: 'Quyết định 28/QĐ-HSV — Quy định cấp Giấy chứng nhận điện tử (E-Certificate)',
    points: [
      '1. Xin công nhận Ngày tình nguyện: Đơn vị gửi danh mục qua Trưởng Ban TC-XDH trình Ban Thư ký trước ít nhất 03 ngày.',
      '2. Thời hạn xử lý (SLA): Tối đa 07 ngày làm việc kể từ khi nhận đủ danh sách chuẩn Phụ lục 1 (tăng dần theo MSSV).',
      '3. Quy chuẩn Phụ lục 2: Giấy chứng nhận có mã QR dẫn trực tiếp tới Quyết định công nhận và đóng chữ "(Đã ký)".',
    ],
  },
  {
    id: 'acc-23-24',
    title: 'Quyết định 23/QĐ-HSV, 24/QĐ-HSV & Thông báo 04/TB-HSV — Quy chế BCH & Các Ban chuyên môn',
    points: [
      '1. Ban Chấp hành Khóa II gồm 15 đồng chí (Ban Thư ký 05 đồng chí); Ban Kiểm tra gồm 05 đồng chí.',
      '2. Văn phòng Hội Sinh viên đặt tại Phòng 206.B06 (Chánh Văn phòng phụ trách đối ngoại, Tổng Thư ký phụ trách nội bộ).',
      '3. Ban TC-XDH quản lý 04 Cụm Khoa (25 Chi hội) và 30 CLB – Đội – Nhóm; Ban TG-PT quản lý Mảng Tuyên giáo, Mảng Phong trào và Đội CTV Xung kích.',
    ],
  },
];

export default function VanBanPage() {
  const [openAccId, setOpenAccId] = useState<string>('acc-09');

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <SubpageBanner
        title="Hệ thống Văn bản & Quy chế Khóa II"
        breadcrumbs={[{ label: 'Văn bản & Quy chế' }]}
      />

      {/* Bố cục chuẩn trang "Thông tin học phí & Học bổng" trên eiu.edu.vn */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-10 space-y-10">
        {/* Phần 1: Bảng danh mục văn bản */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display">
            DANH MỤC VĂN BẢN PHÁP LÝ HIỆN HÀNH
          </h2>
          <p className="text-xs italic text-slate-600">
            *Áp dụng cho nhiệm kỳ Khóa II (2026 – 2028) của Hội Sinh viên Việt Nam Trường Đại học Quốc tế Miền Đông
          </p>

          <div className="bg-white border border-slate-300 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#EFEFEF] text-slate-900 border-b border-slate-300">
                  <th className="py-3 px-4 font-bold border-r border-slate-300 w-12">
                    TT
                  </th>
                  <th className="py-3 px-4 font-bold border-r border-slate-300 w-32">
                    Số hiệu
                  </th>
                  <th className="py-3 px-4 font-bold border-r border-slate-300">
                    Trích yếu nội dung văn bản
                  </th>
                  <th className="py-3 px-4 font-bold border-r border-slate-300 w-32">
                    Ngày ban hành
                  </th>
                  <th className="py-3 px-4 font-bold w-48">Người ký</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {OFFICIAL_DOCUMENTS.map((doc, idx) => (
                  <tr key={doc.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 border-r border-slate-300 font-mono text-slate-600">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4 border-r border-slate-300 font-mono font-bold text-[#133F68]">
                      {doc.documentNumber}
                    </td>
                    <td className="py-3.5 px-4 border-r border-slate-300 text-slate-800 leading-relaxed">
                      <div className="font-semibold text-slate-900">
                        {doc.title}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 border-r border-slate-300 font-mono text-slate-700">
                      {doc.signedDate}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="font-semibold text-slate-900">
                        {doc.signerName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {doc.signerTitle}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Phần 2: Accordion Quy định chi tiết giống hệt mục "HỌC BỔNG TUYỂN SINH 2026" trên eiu.edu.vn */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display">
            TÓM TẮT QUY ĐỊNH TRỌNG TÂM
          </h2>

          <div className="space-y-2">
            {KEY_REGULATIONS_ACCORDION.map((acc) => {
              const isOpen = openAccId === acc.id;
              return (
                <div key={acc.id} className="border border-slate-300 bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenAccId(isOpen ? '' : acc.id)}
                    aria-expanded={isOpen}
                    className={`w-full px-4 py-3 text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      isOpen
                        ? 'bg-[#133F68] text-white'
                        : 'bg-[#EFEFEF] text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    <span>{acc.title}</span>
                    {isOpen ? (
                      <Minus className="w-4 h-4 shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-5 space-y-2 text-xs text-slate-800 leading-relaxed">
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
    </div>
  );
}
