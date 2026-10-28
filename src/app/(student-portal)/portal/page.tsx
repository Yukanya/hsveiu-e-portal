'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRole } from '@/context/role-context';
import { decodeEiuEmail, decodeEiuStudentId } from '@/data/mock-data';
import {
  Award,
  BookOpen,
  Calculator,
  CheckCircle2,
  Dumbbell,
  Globe2,
  HeartHandshake,
  MessageSquareHeart,
  QrCode,
  Send,
  ShieldCheck,
  Sparkles,
  Upload,
} from 'lucide-react';

export default function StudentPortalPage() {
  const { currentPersona, activePosition } = useRole();
  const emailDecoded = decodeEiuEmail(currentPersona.email);
  const mssvDecoded = decodeEiuStudentId(currentPersona.studentId);

  // Máy tính GPA bình quân gia quyền theo hệ thống Quý EIU (HK1, HK2, HK3 + HK Hè) - Đúng ví dụ QĐ 09/QĐ-HSV
  const [semesters, setSemesters] = useState([
    { name: 'Học kỳ I', gpa: 3.7, credits: 16 },
    { name: 'Học kỳ II', gpa: 3.55, credits: 20 },
    { name: 'Học kỳ III', gpa: 3.8, credits: 16 },
  ]);
  const [cumulativeGpa, setCumulativeGpa] = useState(3.45);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const totalCredits = semesters.reduce((sum, s) => sum + Number(s.credits || 0), 0);
  const weightedSum = semesters.reduce(
    (sum, s) => sum + Number(s.gpa || 0) * Number(s.credits || 0),
    0
  );
  const calculatedYearGpa =
    totalCredits > 0 ? Math.round((weightedSum / totalCredits) * 100) / 100 : 0;
  const effectiveGpa = Math.max(calculatedYearGpa, cumulativeGpa);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Thẻ Hội Viên Số & Giải mã Tự động @eiu.edu.vn */}
      <section className="bg-gradient-to-r from-[#0B2545] via-[#133B5C] to-[#0054A6] text-white py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-sky-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Khu vực (student-portal) • Sổ Tay Kỹ Thuật Số Hội Viên EIU</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">
                Xin chào, {currentPersona.fullName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Hệ thống đã tự động nhận diện thông tin từ địa chỉ email{' '}
                <code className="font-mono text-amber-300">{currentPersona.email}</code> và giải mã
                cấu trúc MSSV 10 chữ số theo quy chuẩn Sổ tay Sinh viên EIU.
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/15 font-mono">
                  MSSV: <strong>{currentPersona.studentId}</strong>
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/15">
                  Khoa: <strong>{emailDecoded.facultyName}</strong>
                </span>
                <span className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 font-semibold">
                  Tổng ngày tình nguyện tích lũy: <strong>6.5 / 5.0 ngày</strong>
                </span>
              </div>
            </div>

            {/* Thẻ QR Định danh Hội viên */}
            <div className="lg:col-span-5">
              <div className="bg-white text-slate-900 rounded-2xl p-5 border border-slate-200 shadow-lg flex items-center justify-between gap-4">
                <div className="space-y-1.5 text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#F0F7FF] text-[#0054A6] font-bold text-[10px] uppercase">
                    Thẻ Hội Viên Điện Tử (Check-in 1 chạm)
                  </span>
                  <p className="text-base font-extrabold text-[#0B2545]">
                    {currentPersona.fullName}
                  </p>
                  <p className="font-mono text-slate-600">
                    Ngành: <strong>{mssvDecoded.majorName}</strong>
                  </p>
                  <p className="text-slate-500">
                    Chức vụ hiện tại: <strong className="text-slate-800">{activePosition.positionTitle}</strong>
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border-2 border-[#0B2545] text-center shrink-0">
                  <QrCode className="w-14 h-14 text-[#0B2545] mx-auto" />
                  <span className="text-[10px] font-mono font-bold text-slate-600 block mt-1">
                    {currentPersona.studentId}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 1. TIẾN ĐỘ 5 TIÊU CHUẨN "SINH VIÊN 5 TỐT" CẤP TRƯỜNG (CHUẨN QĐ 09/QĐ-HSV SỬA ĐỔI 2026) */}
        <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0054A6]">
                Quyết định số 09/QĐ-HSV (Sửa đổi, bổ sung năm 2026)
              </span>
              <h2 className="text-xl font-bold text-[#0B2545] mt-0.5 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Sổ Tay Kỹ Thuật Số Xét Duyệt "Sinh Viên 5 Tốt" & "SV5T Tiêu Biểu Toàn Trường"
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Đủ điều kiện ứng viên Top 10% "SV5T Tiêu biểu toàn trường"
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                title: '1. Đạo đức tốt',
                icon: ShieldCheck,
                hardMetric: 'Điểm rèn luyện: 88 / 100 (≥ 80)',
                subCount: 2,
                detail: '4 môn Chính trị đạt ≥ 3.2/4.0 + Tham gia thi Mác – Lênin cấp trường',
                status: 'Đạt chuẩn + 02 TC phụ',
              },
              {
                title: '2. Học tập tốt',
                icon: BookOpen,
                hardMetric: `GPA xét duyệt: ${effectiveGpa.toFixed(2)} / 4.00 (≥ 3.0)`,
                subCount: 2,
                detail: 'Sinh hoạt thường xuyên tại CLB Học thuật (có xác nhận Mentor & CN CLB)',
                status: 'Đạt chuẩn + 02 TC phụ',
              },
              {
                title: '3. Thể lực tốt',
                icon: Dumbbell,
                hardMetric: 'Hoàn thành 03/03 môn GDTC',
                subCount: 2,
                detail: 'Đạt GCN "Sinh viên khỏe" cấp trường (Phụ lục 1) + Hội viên CLB Thể thao',
                status: 'Đạt chuẩn + 02 TC phụ',
              },
              {
                title: '4. Tình nguyện tốt',
                icon: HeartHandshake,
                hardMetric: '6.5 / 5.0 ngày TN + Đã Hiến máu',
                subCount: 1,
                detail: 'Đạt Tiêu chí ưu tiên: Có giấy khen hoạt động tình nguyện cấp trường',
                status: 'Đạt chuẩn + Ưu tiên',
              },
              {
                title: '5. Hội nhập tốt',
                icon: Globe2,
                hardMetric: 'IELTS 6.5 (≥ 6.0) + Kỹ năng XH',
                subCount: 2,
                detail: 'Hoàn thành khóa Kỹ năng thực hành XH (Phụ lục 3) + Giao lưu SV quốc tế',
                status: 'Đạt chuẩn + 02 TC phụ',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-xl p-4 bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="p-2 rounded-lg bg-[#F0F7FF] text-[#0054A6]">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#0B2545]">{item.title}</h3>
                    <p className="text-xs font-mono font-bold text-[#0054A6]">{item.hardMetric}</p>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{item.detail}</p>
                  </div>

                  <button
                    type="button"
                    className="w-full py-1.5 px-2.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#0054A6]" />
                    Bổ sung minh chứng PDF
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. CÔNG CỤ TÍNH ĐIỂM TRUNG BÌNH NĂM HỌC (CHUẨN HỆ THỐNG HỌC KỲ QUÝ EIU) & HỘP THƯ LẮNG NGHE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Máy tính GPA bình quân gia quyền 3 Học kỳ chính + Học kỳ Hè */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0B2545] flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#0054A6]" />
                  Công Cụ Tính Điểm Trung Bình Năm Học (Tiêu chuẩn Học tập tốt – QĐ 09/QĐ-HSV)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tự động tính bình quân gia quyền theo số tín chỉ của 03 Học kỳ chính tại EIU và ưu
                  tiên lấy mức điểm cao hơn giữa Điểm TB năm học và Điểm tích lũy.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {semesters.map((sem, index) => (
                <div
                  key={sem.name}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                >
                  <p className="font-bold text-[#0B2545]">{sem.name}</p>
                  <div>
                    <label className="block text-[11px] text-slate-500">Điểm TB học kỳ (/4.0):</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      value={sem.gpa}
                      onChange={(e) => {
                        const next = [...semesters];
                        next[index].gpa = Number(e.target.value);
                        setSemesters(next);
                      }}
                      className="w-full mt-0.5 px-2.5 py-1.5 rounded border border-slate-300 bg-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500">Số tín chỉ tích lũy:</label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={sem.credits}
                      onChange={(e) => {
                        const next = [...semesters];
                        next[index].credits = Number(e.target.value);
                        setSemesters(next);
                      }}
                      className="w-full mt-0.5 px-2.5 py-1.5 rounded border border-slate-300 bg-white font-mono font-bold"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-[#F0F7FF] border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <p className="text-slate-700">
                  • Điểm TB năm học tính tự động (Làm tròn 2 chữ số):{' '}
                  <strong className="font-mono text-sm text-[#0054A6]">
                    {calculatedYearGpa.toFixed(2)} / 4.00
                  </strong>{' '}
                  ({totalCredits} tín chỉ)
                </p>
                <div className="flex items-center gap-2">
                  <span>• Điểm tích lũy toàn khóa (AAO):</span>
                  <input
                    type="number"
                    step="0.01"
                    value={cumulativeGpa}
                    onChange={(e) => setCumulativeGpa(Number(e.target.value))}
                    className="w-20 px-2 py-0.5 rounded border border-slate-300 bg-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0B2545] text-white text-center shrink-0">
                <p className="text-[10px] uppercase text-sky-300 font-bold">
                  Điểm ưu tiên xét SV5T
                </p>
                <p className="text-xl font-mono font-extrabold text-amber-300">
                  {effectiveGpa.toFixed(2)} / 4.00
                </p>
                <span className="text-[10px] text-emerald-300 font-semibold">
                  {effectiveGpa >= 3.0 ? '✓ Đạt chuẩn Học tập tốt (≥ 3.0)' : 'Chưa đạt 3.0'}
                </span>
              </div>
            </div>
          </div>

          {/* Hộp thư Lắng nghe Sinh viên & Khảo sát Dư luận (Ban TG-PT & Ban Kiểm tra) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-[#0B2545] flex items-center gap-2">
                <MessageSquareHeart className="w-5 h-5 text-[#0054A6]" />
                Hộp Thư Lắng Nghe Sinh Viên EIU
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Phản ánh nguyện vọng về học tập, rèn luyện hoặc công tác Hội (Tiếp nhận bởi Ban
                Tuyên giáo - Phong trào & Ban Kiểm tra HSV Trường).
              </p>
            </div>

            {feedbackSent ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Đã gửi ý kiến thành công!
                </p>
                <p>
                  Ý kiến của bạn đã được mã hóa và chuyển tới Ban Tuyên giáo - Phong trào / Ban Kiểm
                  tra để tổng hợp báo cáo Ban Thư ký.
                </p>
                <button
                  type="button"
                  onClick={() => setFeedbackSent(false)}
                  className="text-[#0054A6] font-bold underline cursor-pointer"
                >
                  Gửi thêm ý kiến khác
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setFeedbackSent(true);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Đơn vị tiếp nhận xử lý:
                  </label>
                  <select className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white">
                    <option>Ban Tuyên giáo - Phong trào (Đề xuất hoạt động, dư luận SV)</option>
                    <option>Ban Kiểm tra HSV Trường (Giám sát quy chế, bảo vệ quyền lợi SV)</option>
                    <option>Văn phòng HSV 206.B06 (Thắc mắc Giấy chứng nhận / Ngày TN)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nội dung gửi:</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Nhập nội dung kiến nghị, đề xuất hoặc phản ánh..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0054A6]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0054A6] hover:bg-[#004282] text-white font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Gửi Ý Kiến Đến Hội Sinh Viên Trường
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
