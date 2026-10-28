'use client';

import React, { useState } from 'react';
import { STAFF_MEMBERS } from '@/data/mock-data';
import { Award, CheckCircle2, QrCode, Search, ShieldAlert } from 'lucide-react';

// Tạo danh sách mẫu chuẩn Phụ lục 1 QĐ 28/QĐ-HSV (Sắp xếp tăng dần theo MSSV!)
const SAMPLE_CERT_LIST = [...STAFF_MEMBERS]
  .filter((s) => s.studentId !== '-')
  .sort((a, b) => a.studentId.localeCompare(b.studentId))
  .slice(0, 6)
  .map((s, idx) => ({
    stt: idx + 1,
    fullName: s.fullName.toUpperCase(),
    studentId: s.studentId,
    email: s.email,
    volunteerDays: 0.5,
    programName: 'TẬP HUẤN CÁN BỘ ĐOÀN – HỘI CÁC CẤP NĂM HỌC 2026 – 2027',
    decisionNumber: '32/QĐ-HSV',
    signedDateText: 'TP. Hồ Chí Minh, ngày 17 tháng 10 năm 2026',
  }));

export default function CertificateVerificationPage() {
  const [selectedCert, setSelectedCert] = useState(SAMPLE_CERT_LIST[0]);
  const [headerType, setHeaderType] = useState<'DOAN_HSV' | 'HSV_ONLY'>('HSV_ONLY');
  const [searchMssv, setSearchMssv] = useState('');

  const filteredList = SAMPLE_CERT_LIST.filter(
    (c) =>
      c.studentId.includes(searchMssv.trim()) ||
      c.fullName.toLowerCase().includes(searchMssv.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-16">
      <section className="bg-[#0B2545] text-white py-10 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-sky-300">
            <Award className="w-3.5 h-3.5" />
            <span>Chuẩn Phụ lục 1 & Phụ lục 2 – Quyết định số 28/QĐ-HSV ngày 01/9/2026</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Cổng Tra Cứu & Xác Thực Giấy Chứng Nhận Điện Tử (E-Certificate)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Đối chiếu trực tiếp với Danh sách Quyết định công nhận (sắp xếp tăng dần theo MSSV).
            Theo đúng Phụ lục 2 QĐ 28/QĐ-HSV, Giấy chứng nhận mặc định thể hiện chữ{' '}
            <strong className="text-amber-300">(Đã ký)</strong> và gắn mã QR dẫn trực tiếp về Quyết
            định đã cấp để chống làm giả.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cột trái (5 cột): Tra cứu theo Danh sách Phụ lục 1 (Tăng dần MSSV) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-[#0B2545]">
                Danh sách sinh viên theo Quyết định số 32/QĐ-HSV
              </h2>
              <p className="text-[11px] text-slate-500">
                Đã sắp xếp thứ tự tăng dần theo Mã số sinh viên (Chuẩn Phụ lục 1, QĐ 28/QĐ-HSV)
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchMssv}
                onChange={(e) => setSearchMssv(e.target.value)}
                placeholder="Nhập MSSV hoặc Họ tên để tra cứu..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#0054A6]"
              />
            </div>

            <div className="space-y-2">
              {filteredList.map((item) => (
                <button
                  key={item.studentId}
                  type="button"
                  onClick={() => setSelectedCert(item)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedCert.studentId === item.studentId
                      ? 'bg-[#F0F7FF] border-[#0054A6] shadow-2xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#0B2545] text-white font-mono text-[10px] font-bold">
                        STT GCN: {item.stt}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#0054A6]">
                        MSSV: {item.studentId}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 mt-1">{item.fullName}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{item.email}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    +{item.volunteerDays} ngày
                  </span>
                </button>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Quy định nghiêm ngặt (Phụ lục 2, QĐ 28/QĐ-HSV):</strong> Không tự ý chèn
                hình mộc và chữ ký khi không có sự cho phép của HSV Trường; sử dụng cụm từ{' '}
                <strong>(Đã ký)</strong> thay thế và đối chiếu qua mã QR của Quyết định.
              </span>
            </div>
          </div>
        </div>

        {/* Cột phải (7 cột): Bản xem trước E-Certificate chuẩn Phụ lục 2 QĐ 28/QĐ-HSV */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-4 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-[#0B2545]">
              Chọn bộ tiêu đề & logo theo chương trình (Phụ lục 2):
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setHeaderType('HSV_ONLY')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  headerType === 'HSV_ONLY'
                    ? 'bg-[#0054A6] text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                Mẫu 1: Hội Sinh viên Trường
              </button>
              <button
                type="button"
                onClick={() => setHeaderType('DOAN_HSV')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  headerType === 'DOAN_HSV'
                    ? 'bg-[#0054A6] text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                Mẫu 2: Liên tịch Đoàn TNCS – Hội Sinh viên
              </button>
            </div>
          </div>

          {/* KHUNG GIẤY CHỨNG NHẬN ĐIỆN TỬ CHUẨN PHỤ LỤC 2 QĐ 28/QĐ-HSV */}
          <div className="bg-white rounded-2xl p-6 sm:p-10 border-4 border-double border-[#0054A6] shadow-lg relative overflow-hidden">
            <div className="border border-slate-300 p-6 sm:p-8 rounded-xl space-y-6 text-center">
              {/* Quốc hiệu / Tiêu ngữ Đoàn - Hội */}
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="px-2.5 py-1 rounded bg-[#0B2545] text-white text-[10px] font-bold tracking-wider">
                    EIU
                  </span>
                  {headerType === 'DOAN_HSV' && (
                    <span className="px-2.5 py-1 rounded bg-sky-700 text-white text-[10px] font-bold">
                      ĐOÀN TNCS
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded bg-[#0054A6] text-white text-[10px] font-bold">
                    HỘI SINH VIÊN VN
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide">
                  {headerType === 'DOAN_HSV'
                    ? 'ĐOÀN TNCS HỒ CHÍ MINH – HỘI SINH VIÊN VIỆT NAM'
                    : 'HỘI SINH VIÊN VIỆT NAM'}
                </p>
                <p className="text-xs sm:text-sm font-extrabold text-[#0B2545] uppercase tracking-wider">
                  TRƯỜNG ĐẠI HỌC QUỐC TẾ MIỀN ĐÔNG
                </p>
              </div>

              {/* Tên Giấy chứng nhận */}
              <div className="py-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-widest text-[#0054A6]">
                  GIẤY CHỨNG NHẬN
                </h2>
              </div>

              {/* Thông tin Sinh viên */}
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  SINH VIÊN
                </p>
                <p className="text-xl sm:text-2xl font-extrabold text-[#0B2545]">
                  {selectedCert.fullName}
                </p>
                <p className="text-sm font-mono font-bold text-slate-700">
                  MSSV: {selectedCert.studentId}
                </p>
              </div>

              {/* Nội dung chương trình & Số ngày tình nguyện */}
              <div className="space-y-1.5 max-w-xl mx-auto">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  ĐÃ THAM GIA CHƯƠNG TRÌNH
                </p>
                <p className="text-sm sm:text-base font-extrabold text-[#0054A6] leading-snug">
                  {selectedCert.programName}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-emerald-800 pt-1">
                  Số ngày tình nguyện được công nhận: {selectedCert.volunteerDays} ngày
                </p>
              </div>

              {/* Footer: Mã QR truy cập QĐ bên trái & Chữ ký (Đã ký) bên phải */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 items-end text-xs">
                {/* Cột trái: QR Truy cập Quyết định & STT GCN */}
                <div className="flex flex-col items-center sm:items-start space-y-2">
                  <div className="p-2.5 rounded-xl border-2 border-[#0B2545] bg-slate-50 flex items-center gap-2.5">
                    <QrCode className="w-12 h-12 text-[#0B2545]" />
                    <div className="text-left text-[10px] text-slate-600 leading-tight">
                      <p className="font-bold text-[#0B2545]">QR Xác thực Quyết định</p>
                      <p className="font-mono">Số QĐ: {selectedCert.decisionNumber}</p>
                      <p className="text-emerald-700 font-semibold flex items-center gap-0.5 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Hợp lệ
                      </p>
                    </div>
                  </div>
                  <p className="font-mono font-bold text-slate-800">
                    Số thứ tự GCN: {selectedCert.stt}{' '}
                    <span className="text-[11px] font-normal text-slate-500">
                      (Theo STT danh sách QĐ)
                    </span>
                  </p>
                </div>

                {/* Cột phải: Ngày ban hành QĐ & (Đã ký) */}
                <div className="text-center space-y-2">
                  <p className="italic text-slate-600 text-[11px]">{selectedCert.signedDateText}</p>
                  <p className="font-bold text-[#0B2545] uppercase">TM. BCH HỘI SINH VIÊN TRƯỜNG</p>
                  <p className="font-bold text-slate-700 uppercase text-[11px]">CHỦ TỊCH</p>
                  <div className="py-3">
                    <span className="inline-block px-3 py-1 rounded bg-slate-100 border border-slate-300 font-semibold italic text-slate-700">
                      (Đã ký)
                    </span>
                  </div>
                  <p className="font-extrabold text-[#0B2545] text-sm">Trương Châu Phước Lộc</p>
                  {headerType === 'DOAN_HSV' && (
                    <p className="text-[11px] text-slate-600">(Phó Bí thư Đoàn trường)</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
