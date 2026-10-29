'use client';

import React, { useState } from 'react';
import { SubpageBanner } from '@/components/public/subpage-banner';
import { useRole } from '@/context/role-context';
import { QrCode } from 'lucide-react';

export default function TraCuuGcnPage() {
  const { currentPersona } = useRole();
  const [queryId, setQueryId] = useState(
    currentPersona.studentId !== '-' ? currentPersona.studentId : '2331200066'
  );

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <SubpageBanner
        title="Tra cứu & Xác thực Giấy chứng nhận (E-Certificate)"
        breadcrumbs={[{ label: 'Giấy chứng nhận (QĐ 28/QĐ-HSV)' }]}
      />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Khu vực Tra cứu chuẩn trang Đặt phòng học lib.eiu.edu.vn */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white border border-slate-200">
            <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold">
              Tra cứu hồ sơ Giấy chứng nhận
            </div>
            <div className="divide-y divide-slate-200 text-xs">
              <div className="grid grid-cols-12 p-3.5 items-center">
                <label
                  htmlFor="cert-search-id"
                  className="col-span-4 font-bold text-slate-900"
                >
                  Mã số sinh viên / Số QĐ:
                </label>
                <div className="col-span-8 flex gap-2">
                  <input
                    id="cert-search-id"
                    type="text"
                    value={queryId}
                    onChange={(e) => setQueryId(e.target.value)}
                    className="flex-1 h-9 px-3 border border-slate-300 rounded font-mono text-xs text-slate-900"
                  />
                  <button
                    type="button"
                    className="px-4 h-9 bg-[#A68556] hover:bg-[#8e7046] text-white font-bold rounded text-xs cursor-pointer"
                  >
                    Tra cứu
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-12 p-3.5">
                <div className="col-span-4 font-bold text-slate-900">
                  Họ và tên hội viên:
                </div>
                <div className="col-span-8 font-bold text-[#133F68]">
                  {currentPersona.fullName}
                </div>
              </div>
              <div className="grid grid-cols-12 p-3.5">
                <div className="col-span-4 font-bold text-slate-900">
                  Quyết định công nhận:
                </div>
                <div className="col-span-8 font-mono text-slate-800">
                  Số 32/QĐ-HSV ngày 19/10/2026 của Ban Thư ký HSV Trường
                </div>
              </div>
              <div className="grid grid-cols-12 p-3.5">
                <div className="col-span-4 font-bold text-slate-900">
                  Trạng thái xác thực:
                </div>
                <div className="col-span-8 font-bold text-emerald-700">
                  HỢP LỆ — Đã ký số &amp; Lưu trữ tại Văn phòng 206.B06
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-[#C10230] text-white p-7">
              <div className="w-8 h-0.5 bg-white mb-3" aria-hidden="true" />
              <h2 className="text-lg font-bold leading-snug font-eiu-display">
                Quy chuẩn Phụ lục 2
              </h2>
              <p className="text-xs text-white/90 mt-2 leading-relaxed">
                Theo Quyết định 28/QĐ-HSV, Giấy chứng nhận điện tử gắn mã QR dẫn trực tiếp tới Quyết định công nhận và ghi chữ &quot;(Đã ký)&quot;.
              </p>
            </div>
          </div>
        </div>

        {/* Bản xem trước E-Certificate chuẩn Phụ lục 2 Quyết định 28/QĐ-HSV */}
        <div className="bg-white border-2 border-[#133F68] p-8 sm:p-12 max-w-4xl mx-auto shadow-xs space-y-6">
          {/* Header Quốc hiệu & Cụm Logo */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start border-b border-slate-200 pb-6 text-center">
            <div className="sm:col-span-5 space-y-1">
              <div className="flex items-center justify-center gap-3 mb-2">
                <img
                  src="/images/eiu-logo-full.png"
                  alt="EIU"
                  className="h-10 w-auto object-contain"
                />
                <img
                  src="/images/hsv-logo.png"
                  alt="HSV"
                  className="h-9 w-9 object-contain"
                />
              </div>
              <div className="text-[11px] font-medium uppercase text-slate-800">
                HỘI SINH VIÊN VIỆT NAM
              </div>
              <div className="text-[11px] font-bold uppercase text-[#133F68]">
                BCH TRƯỜNG ĐẠI HỌC QUỐC TẾ MIỀN ĐÔNG
              </div>
              <div className="text-[11px] font-bold text-slate-900">***</div>
            </div>

            <div className="sm:col-span-7 space-y-1">
              <div className="text-xs font-bold uppercase text-slate-900">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </div>
              <div className="text-xs font-bold text-slate-900 underline underline-offset-4">
                Độc lập – Tự do – Hạnh phúc
              </div>
            </div>
          </div>

          {/* Nội dung chính Giấy chứng nhận */}
          <div className="text-center space-y-3 py-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#133F68]">
              BAN CHẤP HÀNH HỘI SINH VIÊN VIỆT NAM TRƯỜNG ĐẠI HỌC QUỐC TẾ MIỀN ĐÔNG
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-[#C10230] font-eiu-display">
              GIẤY CHỨNG NHẬN
            </h3>

            <div className="pt-2 space-y-1">
              <div className="text-lg sm:text-xl font-bold text-[#133F68]">
                {currentPersona.fullName}
              </div>
              <div className="text-xs font-mono text-slate-700">
                Mã số sinh viên: <strong>{queryId}</strong> • Đơn vị:{' '}
                <strong>{currentPersona.grassrootsRole}</strong>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-800 max-w-2xl mx-auto leading-relaxed pt-2">
              Đã tham gia tích cực và hoàn thành xuất sắc chương trình{' '}
              <strong>
                &quot;Hội nghị Tập huấn Cán bộ Đoàn – Hội các cấp &amp; Kỹ năng Điều hành Cuộc họp Không giấy năm học 2026 – 2027&quot;
              </strong>{' '}
              (Được công nhận quy đổi ngày tình nguyện theo Phụ lục 2 Quyết định 09/QĐ-HSV).
            </p>
          </div>

          {/* Footer Giấy chứng nhận: Mã QR bên trái (2x2cm), Chữ ký TM. BTK bên phải */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-end pt-6 border-t border-slate-200 text-xs">
            <div className="sm:col-span-5 flex items-center gap-3">
              <div className="w-20 h-20 border border-slate-300 p-1.5 flex items-center justify-center bg-white shrink-0">
                <QrCode className="w-16 h-16 text-[#133F68]" />
              </div>
              <div className="space-y-1 text-[11px] text-slate-700 font-mono">
                <div className="font-bold text-[#133F68]">Số: 32/GCN-HSV</div>
                <div>Kèm theo: 32/QĐ-HSV</div>
                <div>Quét QR xem Quyết định</div>
              </div>
            </div>

            <div className="sm:col-span-7 text-center sm:text-right space-y-2">
              <div className="italic text-slate-700">
                Thành phố Hồ Chí Minh, ngày 19 tháng 10 năm 2026
              </div>
              <div className="font-bold uppercase text-slate-900">
                TM. BAN THƯ KÝ HỘI SINH VIÊN TRƯỜNG
              </div>
              <div className="font-bold uppercase text-slate-900">CHỦ TỊCH</div>
              <div className="py-2 font-bold italic text-[#C10230]">(Đã ký)</div>
              <div className="font-bold text-sm text-[#133F68]">
                Trương Châu Phước Lộc
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
