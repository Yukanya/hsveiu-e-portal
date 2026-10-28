'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRole } from '@/context/role-context';
import {
  decodeEiuEmail,
  decodeEiuStudentId,
  FACULTY_METADATA,
} from '@/data/mock-data';
import {
  Award,
  BookOpen,
  Calculator,
  CheckCircle2,
  Dumbbell,
  Globe2,
  HeartHandshake,
  MessageSquarePlus,
  QrCode,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

type PortalTab = 'sv5t' | 'gpa' | 'voice';

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

  // Giải mã tự động Email @eiu.edu.vn & MSSV 10 chữ số
  const emailDecoded = decodeEiuEmail(currentPersona.email);
  const idDecoded = decodeEiuStudentId(currentPersona.studentId);
  const facultyMeta = FACULTY_METADATA[currentPersona.facultyCode];

  // State Máy tính GPA bình quân gia quyền 3 học kỳ Quý EIU (Thu - Đông - Xuân)
  const [quarters, setQuarters] = useState([
    { quarterName: 'Học kỳ Thu (Quarter 1)', credits: 12, gpa4: 3.15 },
    { quarterName: 'Học kỳ Đông (Quarter 2)', credits: 14, gpa4: 2.85 },
    { quarterName: 'Học kỳ Xuân (Quarter 3)', credits: 12, gpa4: 3.1 },
  ]);

  const weightedGpa = calculateWeightedThreeQuarterGpa(quarters);
  const isGpaQualified = weightedGpa >= 2.7;

  // State Hộp thư Lắng nghe Sinh viên
  const [feedbackCategory, setFeedbackCategory] = useState('Học vụ & Cơ sở vật chất');
  const [feedbackAnonymous, setFeedbackAnonymous] = useState(false);
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

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackContent.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setFeedbackContent('');
    }, 4000);
  };

  const sv5tCriteriaCards = [
    {
      id: 'dao-duc',
      title: '1. Đạo đức tốt',
      icon: ShieldCheck,
      currentValue: '92 / 100 điểm',
      targetValue: 'Yêu cầu ≥ 80 điểm',
      progress: 100,
      qualified: true,
      mandatoryNote:
        'Điểm rèn luyện trung bình cả năm học ≥ 80/100; không vi phạm quy chế thi và pháp luật.',
      plusNote:
        'Điểm cộng ưu tiên: Đã tham gia đội thi tìm hiểu Chủ nghĩa Mác - Lênin, Tư tưởng Hồ Chí Minh.',
    },
    {
      id: 'hoc-tap',
      title: '2. Học tập tốt',
      icon: BookOpen,
      currentValue: `GPA: ${weightedGpa.toFixed(2)} / 4.0`,
      targetValue: 'Yêu cầu ≥ 2.70 / 4.0 + 01 NCKH',
      progress: Math.min(Math.round((weightedGpa / 2.7) * 100), 100),
      qualified: isGpaQualified,
      mandatoryNote:
        'Điểm trung bình chung năm học (bình quân gia quyền Thu – Đông – Xuân) ≥ 2.7/4.0 và có ít nhất 01 bài tham luận / đề tài NCKH.',
      plusNote:
        'Điểm cộng ưu tiên: Đạt giải Khuyến khích trở lên cuộc thi Học thuật cấp Khoa/Trường.',
    },
    {
      id: 'the-luc',
      title: '3. Thể lực tốt',
      icon: Dumbbell,
      currentValue: 'Đã cấp GCN Sinh viên Khỏe',
      targetValue: 'Đạt 1 trong 2 điều kiện (Phụ lục 1)',
      progress: 100,
      qualified: true,
      mandatoryNote:
        'Đạt danh hiệu "Sinh viên Khỏe" cấp Trường (vượt qua 3/4 nội dung sát hạch thể lực) hoặc tham gia Hội thao từ cấp Khoa trở lên.',
      plusNote:
        'Điểm cộng ưu tiên: Thành viên thường trực CLB Thể thao EIU hoặc đạt huy chương Hội thao.',
    },
    {
      id: 'tinh-nguyen',
      title: '4. Tình nguyện tốt',
      icon: HeartHandshake,
      currentValue: '7.5 / 5.0 ngày tình nguyện',
      targetValue: 'Yêu cầu ≥ 5.0 ngày / năm học',
      progress: 100,
      qualified: true,
      mandatoryNote:
        'Tích lũy tối thiểu 05 ngày tình nguyện/năm (được cộng tự động từ hệ thống điểm danh QR theo hệ số 1 – 2 – 3 tại Phụ lục 2 QĐ 09).',
      plusNote:
        'Điểm cộng ưu tiên: Có Giấy khen chiến dịch Mùa hè xanh, Xuân tình nguyện hoặc Tiếp sức mùa thi.',
    },
    {
      id: 'hoi-nhap',
      title: '5. Hội nhập tốt',
      icon: Globe2,
      currentValue: 'Đạt chuẩn B1 + Kỹ năng PL3',
      targetValue: 'Ngoại ngữ + Kỹ năng + Hội nhập',
      progress: 100,
      qualified: true,
      mandatoryNote:
        'Đạt trình độ Tiếng Anh B1 (hoặc hoàn thành 02 khóa ngoại ngữ EIU) + 01 khóa Kỹ năng thực hành xã hội (Phụ lục 3) + 01 hoạt động Hội nhập.',
      plusNote:
        'Điểm cộng ưu tiên: Tham gia giao lưu sinh viên quốc tế và đạt giải cuộc thi Olympic Tiếng Anh.',
    },
  ];

  const completedCount = sv5tCriteriaCards.filter((c) => c.qualified).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* 1. THẺ HỘI VIÊN SỐ EIU (CLEAN DIGITAL ID CARD) */}
      <section
        aria-labelledby="student-id-heading"
        className="bg-[#133F68] text-white rounded-2xl p-6 sm:p-8 border-b-4 border-[#A68556] shadow-md"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#A68556] text-white font-eiu-display">
                THẺ HỘI VIÊN SỐ • HSV EIU
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-[#DED1BE]">
                {activePosition.positionTitle}
              </span>
            </div>

            <div>
              <h1
                id="student-id-heading"
                className="text-2xl sm:text-3xl font-extrabold font-eiu-display"
              >
                {currentPersona.fullName}
              </h1>
              <p className="text-sm text-[#DED1BE] mt-1">
                Email định danh: <span className="font-mono text-white">{currentPersona.email}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#0D2E4D] border border-white/10">
                <div className="text-xs text-[#DED1BE]">Mã số sinh viên</div>
                <div className="text-sm font-mono font-bold text-white mt-0.5">
                  {currentPersona.studentId}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0D2E4D] border border-white/10">
                <div className="text-xs text-[#DED1BE]">Khoa quản lý</div>
                <div className="text-sm font-bold text-[#FCB900] mt-0.5">
                  {facultyMeta.shortCode} ({currentPersona.facultyCode})
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0D2E4D] border border-white/10">
                <div className="text-xs text-[#DED1BE]">Chi hội / Đơn vị</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {currentPersona.grassrootsUnitCode || activePosition.unitCode}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0D2E4D] border border-white/10">
                <div className="text-xs text-[#DED1BE]">Tiến độ SV5T</div>
                <div className="text-sm font-mono font-bold text-emerald-300 mt-0.5">
                  Đạt {completedCount}/5 tiêu chuẩn
                </div>
              </div>
            </div>

            <p className="text-xs text-[#DED1BE]">
              Giải mã tự động từ hệ thống EIU: <strong className="text-white">{emailDecoded.facultyName}</strong> •{' '}
              {idDecoded.isValid
                ? `Khóa ${idDecoded.enrollmentYear} • Ngành ${idDecoded.majorName}`
                : 'Cán bộ chuyên trách'}
            </p>
          </div>

          {/* Mã QR Điểm danh 1-Chạm */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="bg-white text-[#133F68] rounded-2xl p-5 w-full max-w-[260px] text-center space-y-2 shadow-sm">
              <div className="w-28 h-28 mx-auto rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                <QrCode className="w-20 h-20 text-[#133F68]" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#133F68] font-eiu-display">
                QR Điểm Danh Sự Kiện
              </div>
              <div className="text-xs font-mono text-slate-600">
                ID: HSV-{currentPersona.studentId}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THANH CHUYỂN ĐỔI PHÂN KHU THEO NGUYÊN TẮC APPLE SEGMENTED CONTROL (PROGRESSIVE DISCLOSURE) */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-2xs">
        <div
          role="tablist"
          aria-label="Chức năng Sổ tay Hội viên"
          className="grid grid-cols-1 sm:grid-cols-3 gap-2"
        >
          {[
            {
              id: 'sv5t' as PortalTab,
              label: '1. Tiến Độ 5 Tiêu Chuẩn SV5T',
              badge: `${completedCount}/5 Đạt`,
              icon: Award,
            },
            {
              id: 'gpa' as PortalTab,
              label: '2. Máy Tính GPA 3 Học Kỳ Quý',
              badge: `${weightedGpa.toFixed(2)}/4.0`,
              icon: Calculator,
            },
            {
              id: 'voice' as PortalTab,
              label: '3. Hộp Thư Lắng Nghe & GCN',
              badge: 'Phản hồi 24h',
              icon: MessageSquarePlus,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isSelected}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-12 px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#133F68] text-white shadow-xs'
                    : 'bg-transparent text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isSelected ? 'text-[#FCB900]' : 'text-[#133F68]'
                    }`}
                  />
                  <span>{tab.label}</span>
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                    isSelected
                      ? 'bg-[#A68556] text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PANEL 1: TIẾN ĐỘ 5 TIÊU CHUẨN SINH VIÊN 5 TỐT */}
      {activeTab === 'sv5t' && (
        <section
          id="panel-sv5t"
          role="tabpanel"
          aria-labelledby="tab-sv5t"
          className="space-y-5"
        >
          <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#133F68] font-eiu-display">
                Bảng Theo Dõi 5 Tiêu Chuẩn &quot;Sinh Viên 5 Tốt&quot; Cấp Trường
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Áp dụng theo <strong>Quyết định số 09/QĐ-HSV</strong> (Sửa đổi, bổ sung ngày 27/5/2026 của Ban Thư ký HSV Trường ĐHQTMĐ).
              </p>
            </div>
            <Link
              href="/tra-cuu-gcn"
              className="min-h-11 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0054A6] hover:bg-[#133F68] text-white text-xs font-bold shrink-0 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Xem E-Certificate đã tích lũy</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sv5tCriteriaCards.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-[#133F68] text-white flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-[#FCB900]" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-[#133F68] font-eiu-display">
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-600">{item.targetValue}</p>
                        </div>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                          item.qualified
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {item.qualified ? '✓ Đạt chuẩn' : 'Cần bổ sung'}
                      </span>
                    </div>

                    {/* Thanh tiến độ chuẩn Accessibility */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-medium">Kết quả hiện tại:</span>
                        <span className="font-mono font-bold text-[#133F68]">
                          {item.currentValue}
                        </span>
                      </div>
                      <div
                        role="progressbar"
                        aria-label={`Tiến độ ${item.title}`}
                        aria-valuenow={item.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200"
                      >
                        <div
                          className={`h-full rounded-full transition-all ${
                            item.qualified ? 'bg-emerald-600' : 'bg-amber-500'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed">
                      {item.mandatoryNote}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <strong className="text-[#A68556]">Lợi thế xét Top 10% Tiêu biểu:</strong>{' '}
                    {item.plusNote}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* PANEL 2: MÁY TÍNH GPA BÌNH QUÂN GIA QUYỀN 3 HỌC KỲ QUÝ EIU */}
      {activeTab === 'gpa' && (
        <section
          id="panel-gpa"
          role="tabpanel"
          aria-labelledby="tab-gpa"
          className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6"
        >
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-extrabold text-[#133F68] font-eiu-display">
              Công Cụ Tính GPA Bình Quân Gia Quyền 3 Học Kỳ Quý EIU (Thu – Đông – Xuân)
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Theo Sổ tay Sinh viên EIU (trang 27) và Quyết định 09/QĐ-HSV, điểm trung bình chung năm học dùng xét chọn <strong>Học tập tốt</strong> được tính bình quân gia quyền theo số tín chỉ của 03 học kỳ chính (cần đạt tối thiểu <strong>2.70 / 4.0</strong>).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              {quarters.map((q, idx) => (
                <div
                  key={q.quarterName}
                  className="p-4 rounded-xl bg-[#F5F5F5] border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
                >
                  <div className="sm:col-span-5 font-bold text-sm text-[#133F68]">
                    {q.quarterName}
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor={`credits-q-${idx}`}
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Số tín chỉ:
                    </label>
                    <input
                      id={`credits-q-${idx}`}
                      type="number"
                      min={0}
                      max={30}
                      step={1}
                      value={q.credits}
                      onChange={(e) =>
                        handleQuarterChange(idx, 'credits', e.target.value)
                      }
                      className="w-full min-h-10 px-3 py-2 rounded-lg bg-white border border-slate-300 font-mono text-sm font-bold text-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label
                      htmlFor={`gpa-q-${idx}`}
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      GPA Học kỳ (Thang 4.0):
                    </label>
                    <input
                      id={`gpa-q-${idx}`}
                      type="number"
                      min={0}
                      max={4}
                      step={0.05}
                      value={q.gpa4}
                      onChange={(e) =>
                        handleQuarterChange(idx, 'gpa4', e.target.value)
                      }
                      className="w-full min-h-10 px-3 py-2 rounded-lg bg-white border border-slate-300 font-mono text-sm font-bold text-[#0054A6]"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Kết quả tính toán */}
            <div className="lg:col-span-5 bg-[#133F68] text-white rounded-2xl p-6 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-[#DED1BE] font-eiu-display">
                Kết Quả Quy Đổi Năm Học
              </div>
              <div className="text-4xl font-extrabold font-mono text-[#FCB900]">
                {weightedGpa.toFixed(2)} <span className="text-lg text-white">/ 4.00</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 text-xs leading-relaxed">
                {isGpaQualified ? (
                  <p className="text-emerald-300 font-semibold">
                    ✓ Chúc mừng! Điểm GPA bình quân 3 học kỳ của bạn đạt chuẩn &quot;Học tập tốt&quot; (≥ 2.70/4.0). Hãy đảm bảo hoàn thành ít nhất 01 bài tham luận / đề tài NCKH.
                  </p>
                ) : (
                  <p className="text-amber-300 font-semibold">
                    ⚠ Bạn cần cải thiện thêm {(2.7 - weightedGpa).toFixed(2)} điểm ở học kỳ tới để chạm ngưỡng 2.70/4.0 của danh hiệu Sinh viên 5 Tốt cấp Trường.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PANEL 3: HỘP THƯ LẮNG NGHE SINH VIÊN & TRA CỨU NHANH GCN */}
      {activeTab === 'voice' && (
        <section
          id="panel-voice"
          role="tabpanel"
          aria-labelledby="tab-voice"
          className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6"
        >
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-extrabold text-[#133F68] font-eiu-display">
              Hộp Thư Lắng Nghe Sinh Viên (Gửi Ban Kiểm Tra &amp; Ban Thường Trực HSV)
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Mọi kiến nghị về quyền lợi sinh viên, công tác xét chọn SV5T và cấp Giấy chứng nhận đều được <strong>Ban Kiểm tra HSV Trường (05 đ/c)</strong> tiếp nhận và phản hồi minh bạch.
            </p>
          </div>

          <form onSubmit={handleFeedbackSubmit} className="max-w-2xl space-y-4">
            <div>
              <label
                htmlFor="feedback-category"
                className="block text-sm font-bold text-[#133F68] mb-1.5"
              >
                Chủ đề phản ánh / đóng góp ý kiến:
              </label>
              <select
                id="feedback-category"
                value={feedbackCategory}
                onChange={(e) => setFeedbackCategory(e.target.value)}
                className="w-full min-h-11 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900"
              >
                <option>Học vụ &amp; Cơ sở vật chất</option>
                <option>Quy đổi Ngày tình nguyện &amp; Cấp E-Certificate (QĐ 28/QĐ-HSV)</option>
                <option>Xét chọn Danh hiệu Sinh viên 5 Tốt (QĐ 09/QĐ-HSV)</option>
                <option>Hoạt động Chi hội &amp; Câu lạc bộ / Đội / Nhóm</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="feedback-content"
                className="block text-sm font-bold text-[#133F68] mb-1.5"
              >
                Nội dung chi tiết:
              </label>
              <textarea
                id="feedback-content"
                rows={4}
                required
                value={feedbackContent}
                onChange={(e) => setFeedbackContent(e.target.value)}
                placeholder="Nhập nội dung kiến nghị hoặc câu hỏi cần giải đáp..."
                className="w-full p-3.5 rounded-xl border border-slate-300 text-sm text-slate-900"
              />
            </div>

            <div className="flex items-center gap-2.5">
              <input
                id="feedback-anon"
                type="checkbox"
                checked={feedbackAnonymous}
                onChange={(e) => setFeedbackAnonymous(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#133F68]"
              />
              <label htmlFor="feedback-anon" className="text-sm text-slate-700">
                Gửi ở chế độ ẩn danh (chỉ hiển thị Khoa {facultyMeta.shortCode} với Ban Kiểm tra)
              </label>
            </div>

            {feedbackSent && (
              <div
                role="status"
                className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-900 flex items-center gap-2 font-medium"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Đã gửi ý kiến thành công tới Ban Kiểm tra &amp; Văn phòng Hội Sinh viên Trường!
                </span>
              </div>
            )}

            <button
              type="submit"
              className="min-h-11 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#133F68] hover:bg-[#0D2E4D] text-white text-sm font-bold transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Gửi Ý Kiến Tới Hội Sinh Viên Trường</span>
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
