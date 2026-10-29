'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SubpageBanner } from '@/components/public/subpage-banner';
import { useRole } from '@/context/role-context';
import {
  decodeEiuEmail,
  decodeEiuStudentId,
  FACULTY_METADATA,
} from '@/data/mock-data';
import { QrCode } from 'lucide-react';

type PortalTab = 'sv5t' | 'gpa' | 'voice' | 'idcard';

const PORTAL_MENU: { id: PortalTab; label: string; title: string }[] = [
  {
    id: 'sv5t',
    label: 'Tiến độ Sinh viên 5 Tốt',
    title: 'HỒ SƠ XÉT CHỌN DANH HIỆU SINH VIÊN 5 TỐT (09/QĐ-HSV)',
  },
  {
    id: 'gpa',
    label: 'Máy tính GPA 3 Học kỳ',
    title: 'MÁY TÍNH GPA BÌNH QUÂN GIA QUYỀN 3 HỌC KỲ QUÝ EIU',
  },
  {
    id: 'idcard',
    label: 'Thẻ Hội viên & Điểm danh QR',
    title: 'THẺ HỘI VIÊN ĐIỆN TỬ & MÃ QR ĐIỂM DANH',
  },
  {
    id: 'voice',
    label: 'Hộp thư Lắng nghe Sinh viên',
    title: 'HỘP THƯ LẮNG NGHE SINH VIÊN — GỬI BAN KIỂM TRA',
  },
];

function calculateWeightedThreeQuarterGpa(
  quarters: { credits: number; gpa4: number }[]
): number {
  const totalCredits = quarters.reduce((sum, q) => sum + q.credits, 0);
  if (totalCredits === 0) return 0;
  const weightedSum = quarters.reduce(
    (sum, q) => sum + q.credits * q.gpa4,
    0
  );
  return weightedSum / totalCredits;
}

export default function StudentPortalPage() {
  const { currentPersona, activePosition } = useRole();
  const [activeTab, setActiveTab] = useState<PortalTab>('sv5t');

  const emailDecoded = decodeEiuEmail(currentPersona.email);
  const idDecoded = decodeEiuStudentId(currentPersona.studentId);
  const facultyMeta = FACULTY_METADATA[currentPersona.facultyCode];

  const [quarters, setQuarters] = useState([
    { quarterName: 'Học kỳ Thu (Quarter 1)', credits: 12, gpa4: 3.15 },
    { quarterName: 'Học kỳ Đông (Quarter 2)', credits: 14, gpa4: 2.85 },
    { quarterName: 'Học kỳ Xuân (Quarter 3)', credits: 12, gpa4: 3.1 },
  ]);

  const weightedGpa = calculateWeightedThreeQuarterGpa(quarters);
  const isGpaQualified = weightedGpa >= 2.7;

  const [feedbackCategory, setFeedbackCategory] = useState(
    'Quy đổi Ngày tình nguyện & Cấp E-Certificate'
  );
  const [feedbackContent, setFeedbackContent] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleQuarterChange = (
    index: number,
    field: 'credits' | 'gpa4',
    val: string
  ) => {
    const num = parseFloat(val) || 0;
    setQuarters((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: num } : q))
    );
  };

  const currentMenu =
    PORTAL_MENU.find((m) => m.id === activeTab) || PORTAL_MENU[0];

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <SubpageBanner
        title="Hồ sơ Hội viên & Sổ tay Sinh viên 5 Tốt"
        breadcrumbs={[{ label: 'Sinh viên & Hội viên' }, { label: currentMenu.label }]}
      />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI (3/12): Menu dọc Đỏ #C10230 / Vàng kem #EAE3D2 chuẩn eiu.edu.vn */}
          <aside
            aria-label="Menu Hồ sơ Hội viên"
            className="lg:col-span-3 flex flex-col divide-y divide-white border border-slate-200/80"
          >
            {PORTAL_MENU.map((item) => {
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  aria-current={isSelected ? 'page' : undefined}
                  className={`w-full text-left px-4 py-3 text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#C10230] text-white font-bold'
                      : 'bg-[#EAE3D2] text-slate-900 hover:bg-[#dfd5be]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </aside>

          {/* CỘT GIỮA (6/12): Bảng thanh ngang #133F68 chuẩn trang Đặt phòng học lib.eiu.edu.vn */}
          <div className="lg:col-span-6 space-y-5">
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide text-[#133F68] font-eiu-display">
              {currentMenu.title}
            </h2>

            {activeTab === 'sv5t' && (
              <div className="bg-white border border-slate-200">
                <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold">
                  Thông tin hội viên đăng ký
                </div>
                <div className="divide-y divide-slate-200 text-xs">
                  <div className="grid grid-cols-12 p-3.5">
                    <div className="col-span-4 font-bold text-slate-900">Họ và tên:</div>
                    <div className="col-span-8 font-bold text-[#133F68]">
                      {currentPersona.fullName}
                    </div>
                  </div>
                  <div className="grid grid-cols-12 p-3.5">
                    <div className="col-span-4 font-bold text-slate-900">MSSV / Khoa:</div>
                    <div className="col-span-8 font-mono text-slate-800">
                      {currentPersona.studentId} • {facultyMeta.nameVi}
                    </div>
                  </div>
                  <div className="grid grid-cols-12 p-3.5">
                    <div className="col-span-4 font-bold text-slate-900">Chi hội / Chức vụ:</div>
                    <div className="col-span-8 text-slate-800">
                      {activePosition.positionTitle} ({activePosition.unitName})
                    </div>
                  </div>
                </div>

                <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold">
                  Kết quả 05 Tiêu chuẩn Sinh viên 5 Tốt (09/QĐ-HSV)
                </div>
                <div className="divide-y divide-slate-200 text-xs">
                  <div className="grid grid-cols-12 p-3.5">
                    <div className="col-span-5 font-bold text-slate-900">
                      1. Đạo đức tốt (≥ 80 điểm):
                    </div>
                    <div className="col-span-7 font-mono font-semibold text-emerald-700">
                      92 / 100 điểm — ĐẠT CHUẨN
                    </div>
                  </div>
                  <div className="grid grid-cols-12 p-3.5">
                    <div className="col-span-5 font-bold text-slate-900">
                      2. Học tập tốt (≥ 2.7 + NCKH):
                    </div>
                    <div className="col-span-7 font-mono font-semibold text-[#0054A6]">
                      GPA {weightedGpa.toFixed(2)} / 4.0 + 01 NCKH —{' '}
                      {isGpaQualified ? 'ĐẠT CHUẨN' : 'CẦN BỔ SUNG'}
                    </div>
                  </div>
                  <div className="grid grid-cols-12 p-3.5">
                    <div className="col-span-5 font-bold text-slate-900">
                      3. Thể lực tốt (Phụ lục 1):
                    </div>
                    <div className="col-span-7 text-slate-800">
                      Sinh viên Khỏe cấp Trường 2026 — <strong className="text-emerald-700">ĐẠT CHUẨN</strong>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 p-3.5">
                    <div className="col-span-5 font-bold text-slate-900">
                      4. Tình nguyện tốt (≥ 5.0 ngày):
                    </div>
                    <div className="col-span-7 font-mono font-semibold text-emerald-700">
                      7.5 / 5.0 ngày (Phụ lục 2) — ĐẠT CHUẨN
                    </div>
                  </div>
                  <div className="grid grid-cols-12 p-3.5">
                    <div className="col-span-5 font-bold text-slate-900">
                      5. Hội nhập tốt (B1 + PL3):
                    </div>
                    <div className="col-span-7 text-slate-800">
                      Đạt chuẩn B1 + Kỹ năng Phụ lục 3 — <strong className="text-emerald-700">ĐẠT CHUẨN</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'gpa' && (
              <div className="bg-white border border-slate-200">
                <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold">
                  Nhập điểm 03 Học kỳ Quý trong năm học (Thu – Đông – Xuân)
                </div>
                <div className="divide-y divide-slate-200 text-xs">
                  {quarters.map((q, idx) => (
                    <div
                      key={q.quarterName}
                      className="grid grid-cols-12 p-3.5 items-center gap-2"
                    >
                      <div className="col-span-5 font-bold text-slate-900">
                        {q.quarterName}:
                      </div>
                      <div className="col-span-3">
                        <label
                          htmlFor={`q-cred-${idx}`}
                          className="block text-[10px] text-slate-500 mb-0.5"
                        >
                          Số tín chỉ
                        </label>
                        <input
                          id={`q-cred-${idx}`}
                          type="number"
                          min={0}
                          max={30}
                          value={q.credits}
                          onChange={(e) =>
                            handleQuarterChange(idx, 'credits', e.target.value)
                          }
                          className="w-full h-8 px-2 border border-slate-300 rounded font-mono text-xs"
                        />
                      </div>
                      <div className="col-span-4">
                        <label
                          htmlFor={`q-gpa-${idx}`}
                          className="block text-[10px] text-slate-500 mb-0.5"
                        >
                          GPA (Thang 4.0)
                        </label>
                        <input
                          id={`q-gpa-${idx}`}
                          type="number"
                          min={0}
                          max={4}
                          step={0.05}
                          value={q.gpa4}
                          onChange={(e) =>
                            handleQuarterChange(idx, 'gpa4', e.target.value)
                          }
                          className="w-full h-8 px-2 border border-slate-300 rounded font-mono text-xs font-bold text-[#0054A6]"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold">
                  Kết quả bình quân gia quyền năm học
                </div>
                <div className="p-4 grid grid-cols-12 items-center text-xs">
                  <div className="col-span-5 font-bold text-slate-900">
                    GPA cả năm học:
                  </div>
                  <div className="col-span-7 font-mono text-base font-extrabold text-[#C10230]">
                    {weightedGpa.toFixed(2)} / 4.00 (
                    {isGpaQualified ? 'Đạt chuẩn ≥ 2.70' : 'Chưa đạt 2.70'})
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'idcard' && (
              <div className="bg-white border border-slate-200">
                <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold">
                  Định danh Hội viên Điện tử
                </div>
                <div className="p-6 flex flex-col sm:flex-row items-center gap-6 text-xs">
                  <div className="w-28 h-28 border border-slate-300 p-2 flex items-center justify-center shrink-0">
                    <QrCode className="w-24 h-24 text-[#133F68]" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-base font-bold text-[#133F68]">
                      {currentPersona.fullName}
                    </div>
                    <div className="font-mono text-slate-700">
                      MSSV: <strong>{currentPersona.studentId}</strong>
                    </div>
                    <div className="text-slate-700">
                      Email: <span className="font-mono">{currentPersona.email}</span>
                    </div>
                    <div className="text-slate-700">
                      Khoa nhận diện: <strong>{emailDecoded.facultyName}</strong>
                    </div>
                    <div className="text-slate-600">
                      {idDecoded.isValid
                        ? `Ngành: ${idDecoded.majorName} (Khóa ${idDecoded.enrollmentYear})`
                        : 'Cán bộ chuyên trách'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'voice' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setFeedbackSent(true);
                }}
                className="bg-white border border-slate-200"
              >
                <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold">
                  Gửi kiến nghị tới Ban Kiểm tra &amp; Văn phòng HSV
                </div>
                <div className="divide-y divide-slate-200 text-xs">
                  <div className="grid grid-cols-12 p-3.5 items-center">
                    <label
                      htmlFor="fb-cat"
                      className="col-span-4 font-bold text-slate-900"
                    >
                      Chủ đề:
                    </label>
                    <div className="col-span-8">
                      <select
                        id="fb-cat"
                        value={feedbackCategory}
                        onChange={(e) => setFeedbackCategory(e.target.value)}
                        className="w-full h-9 px-3 border border-slate-300 rounded text-xs bg-white"
                      >
                        <option>Quy đổi Ngày tình nguyện &amp; Cấp E-Certificate</option>
                        <option>Xét chọn Danh hiệu Sinh viên 5 Tốt</option>
                        <option>Hoạt động Chi hội &amp; Câu lạc bộ</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 p-3.5 items-start">
                    <label
                      htmlFor="fb-body"
                      className="col-span-4 font-bold text-slate-900 pt-1.5"
                    >
                      Nội dung kiến nghị:
                    </label>
                    <div className="col-span-8">
                      <textarea
                        id="fb-body"
                        rows={4}
                        required
                        value={feedbackContent}
                        onChange={(e) => setFeedbackContent(e.target.value)}
                        placeholder="Vui lòng nhập nội dung..."
                        className="w-full p-2.5 border border-slate-300 rounded text-xs"
                      />
                    </div>
                  </div>
                </div>

                {feedbackSent && (
                  <div className="px-4 py-2.5 bg-emerald-50 text-emerald-900 text-xs font-bold border-t border-emerald-200">
                    ✓ Đã chuyển kiến nghị tới Ban Kiểm tra HSV Trường.
                  </div>
                )}

                <div className="p-3.5 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    type="submit"
                    className="px-5 py-1.5 bg-[#0D6EFD] hover:bg-blue-700 text-white rounded text-xs font-bold cursor-pointer"
                  >
                    Lưu &amp; Gửi
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* CỘT PHẢI (3/12): Khối Đỏ Đô #C10230 giống hệt "Thông tin đặt phòng" */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-[#C10230] text-white p-6">
              <div className="w-8 h-0.5 bg-white mb-3" aria-hidden="true" />
              <h3 className="text-base font-bold leading-snug font-eiu-display">
                Thông tin hồ sơ
              </h3>
              <p className="text-xs text-white/90 mt-2 leading-relaxed">
                Đạt đủ 05 tiêu chuẩn để xét chọn danh hiệu Sinh viên 5 Tốt cấp Trường (Quyết định 09/QĐ-HSV).
              </p>
              <div className="mt-4 pt-3 border-t border-white/20">
                <Link
                  href="/tra-cuu-gcn"
                  className="text-xs font-bold text-white underline"
                >
                  Tra cứu E-Certificate →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
