'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRole } from '@/context/role-context';
import {
  decodeEiuEmail,
  decodeEiuStudentId,
  EVENT_ITEMS,
  FACULTY_METADATA,
  ISSUED_CERTIFICATES,
  ONLINE_QUIZ_QUESTIONS,
} from '@/data/mock-data';
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  FileCheck2,
  MessageSquare,
  QrCode,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

type PortalTab = 'sv5t' | 'gpa' | 'certs' | 'quiz' | 'idcard' | 'voice';

const PORTAL_MENU: {
  id: PortalTab;
  label: string;
  title: string;
  subtitle: string;
  badge?: string;
}[] = [
  {
    id: 'sv5t',
    label: 'Sổ tay Sinh viên 5 Tốt',
    title: 'SỔ TAY KỸ THUẬT SỐ SINH VIÊN 5 TỐT (09/QĐ-HSV SỬA ĐỔI 2026)',
    subtitle:
      'Theo dõi tự động 05 tiêu chuẩn cứng, danh mục tiêu chí phụ và tiến trình xét duyệt điện tử 3 cấp.',
    badge: '5/5',
  },
  {
    id: 'gpa',
    label: 'Máy tính GPA Quý (≥ 3.00)',
    title: 'MÁY TÍNH GPA HỌC CHẾ QUÝ EIU — CHUẨN HỌC TẬP TỐT ≥ 3.00/4.00',
    subtitle:
      'Tính bình quân gia quyền tín chỉ 03 Học kỳ chính (Thu – Đông – Xuân) + Học kỳ Hè và tự động lấy MAX với GPA tích lũy.',
  },
  {
    id: 'certs',
    label: 'Sự kiện & Kho E-Certificate',
    title: 'SỰ KIỆN ĐÃ ĐĂNG KÝ & KHO GIẤY CHỨNG NHẬN ĐIỆN TỬ CÁ NHÂN',
    subtitle:
      'Quản lý vé QR Check-in sự kiện và danh sách E-Certificate đã ban hành Quyết định công nhận (28/QĐ-HSV).',
  },
  {
    id: 'quiz',
    label: 'Phòng thi Trắc nghiệm Số',
    title: 'PHÒNG THI TRẮC NGHIỆM TRỰC TUYẾN — TÌM HIỂU NGHỊ QUYẾT & QUY CHẾ',
    subtitle:
      'Đạt từ 04/05 câu trở lên để tự động đồng bộ minh chứng tiêu chí phụ mục Đạo đức tốt & Hội nhập tốt.',
    badge: 'QUIZ',
  },
  {
    id: 'idcard',
    label: 'Thẻ Hội viên & Giải mã MSSV',
    title: 'THẺ HỘI VIÊN ĐIỆN TỬ & GIẢI MÃ ĐỊNH DANH 10 CHỮ SỐ EIU',
    subtitle:
      'Mã QR điểm danh hai chiều tại sự kiện và bảng phân tích cấu trúc Email @eiu.edu.vn & MSSV theo Sổ tay Sinh viên EIU.',
  },
  {
    id: 'voice',
    label: 'Hộp thư Lắng nghe SV',
    title: 'HỘP THƯ LẮNG NGHE SINH VIÊN — KẾT NỐI BAN KIỂM TRA & BAN TG-PT',
    subtitle:
      'Gửi kiến nghị, phản ánh quyền lợi hội viên (hỗ trợ chế độ bảo mật danh tính) trực tiếp tới Ban Kiểm tra HSV Trường.',
  },
];

function calculateWeightedQuarterGpa(
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

function StudentPortalContent({ initialTab }: { initialTab: PortalTab }) {
  const { currentPersona, activePosition, setPersonaById } = useRole();
  const [activeTab, setActiveTab] = useState<PortalTab>(initialTab);

  const emailDecoded = decodeEiuEmail(currentPersona.email);
  const idDecoded = decodeEiuStudentId(currentPersona.studentId);
  const facultyMeta = FACULTY_METADATA[currentPersona.facultyCode];

  // 1. State Máy tính GPA Học chế Quý EIU (03 kỳ chính + 01 kỳ Hè tùy chọn + GPA tích lũy)
  const [quarters, setQuarters] = useState([
    { quarterName: 'Học kỳ Thu (Quarter 1)', credits: 12, gpa4: 3.25 },
    { quarterName: 'Học kỳ Đông (Quarter 2)', credits: 14, gpa4: 3.05 },
    { quarterName: 'Học kỳ Xuân (Quarter 3)', credits: 12, gpa4: 3.2 },
    { quarterName: 'Học kỳ Hè (Tùy chọn — nhập 0 nếu không học)', credits: 0, gpa4: 0 },
  ]);
  const [cumulativeGpa, setCumulativeGpa] = useState<number>(3.12);
  const [dossierSubmitted, setDossierSubmitted] = useState(false);

  const weightedYearGpa = calculateWeightedQuarterGpa(quarters);
  const effectiveGpa = Math.max(weightedYearGpa, cumulativeGpa);
  const isGpaQualified = effectiveGpa >= 3.0;

  // 2. Kho E-Certificate cá nhân khớp MSSV thực trong ISSUED_CERTIFICATES
  const personalCerts = ISSUED_CERTIFICATES.filter(
    (c) => c.studentId === currentPersona.studentId
  );

  // 3. State Phòng thi Trắc nghiệm Trực tuyến (Online Quiz)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const quizCorrectCount = ONLINE_QUIZ_QUESTIONS.reduce((acc, q) => {
    return acc + (quizAnswers[q.id] === q.correctIndex ? 1 : 0);
  }, 0);
  const quizPassed = quizSubmitted && quizCorrectCount >= 4;

  // 4. State Hộp thư Lắng nghe Sinh viên
  const [feedbackRecipient, setFeedbackRecipient] = useState<
    'BKT' | 'BAN_TGPT'
  >('BKT');
  const [feedbackCategory, setFeedbackCategory] = useState(
    'Quy đổi Ngày tình nguyện & Cấp E-Certificate (28/QĐ-HSV)'
  );
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleQuarterChange = (
    index: number,
    field: 'credits' | 'gpa4',
    val: string
  ) => {
    const num = Math.max(0, parseFloat(val) || 0);
    setQuarters((prev) =>
      prev.map((q, i) =>
        i === index
          ? { ...q, [field]: field === 'gpa4' ? Math.min(4, num) : num }
          : q
      )
    );
  };

  const metCriteriaCount = isGpaQualified ? 5 : 4;
  const currentMenu =
    PORTAL_MENU.find((m) => m.id === activeTab) || PORTAL_MENU[0];

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      {/* COMMAND HEADER HỘI VIÊN (1200PX) — THAY CHO BANNER TĨNH ĐỂ HIỂN THỊ RÕ ĐỊNH DANH & KPI CÁ NHÂN */}
      <section className="bg-[#133F68] eiu-arch-pattern text-white border-b-3 border-[#A68556]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-7 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#00BCFF] text-[#02294E] text-[10.5px] font-bold uppercase tracking-wider font-eiu-display">
                  KHÔNG GIAN HỘI VIÊN SSO (@EIU.EDU.VN)
                </span>
                <span className="font-mono text-xs text-[#FCB900] font-bold">
                  Phân quyền hiện tại: Cấp {activePosition.roleLevel}/6
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-eiu-display">
                {currentPersona.fullName}{' '}
                <span className="text-sm font-mono font-normal text-[#DED1BE]">
                  (
                  {currentPersona.studentId !== '-'
                    ? `MSSV: ${currentPersona.studentId}`
                    : 'Chuyên viên CTSV'}
                  )
                </span>
              </h1>
              <div className="text-xs text-[#DED1BE] flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>{facultyMeta.nameVi}</span>
                <span>•</span>
                <span>
                  {activePosition.positionTitle} ({activePosition.unitName})
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {currentPersona.id !== 'student-demo' ? (
                <button
                  type="button"
                  onClick={() => setPersonaById('student-demo')}
                  className="px-3.5 py-2 bg-white/12 hover:bg-white/20 border border-white/25 text-white text-xs font-semibold cursor-pointer"
                >
                  Đóng vai Sinh viên mẫu (Cấp 1)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setPersonaById('staff-01')}
                  className="px-3.5 py-2 bg-white/12 hover:bg-white/20 border border-white/25 text-white text-xs font-semibold cursor-pointer"
                >
                  Chuyển sang Chủ tịch HSV (Cấp 6)
                </button>
              )}
              <Link
                href="/su-kien"
                className="px-4 py-2 bg-[#C10230] hover:bg-[#a30228] text-white text-xs font-bold uppercase tracking-wider font-eiu-display"
              >
                Đăng ký Sự kiện Mới
              </Link>
            </div>
          </div>

          {/* 04 Ô KPI Cá nhân */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setActiveTab('sv5t')}
              className="bg-[#02294E]/85 border border-white/15 hover:border-[#00BCFF] p-3.5 text-left cursor-pointer"
            >
              <div className="text-[10.5px] font-mono uppercase text-[#DED1BE]">
                Tiêu chuẩn SV5T đạt
              </div>
              <div className="text-xl font-extrabold font-mono text-[#00BCFF] mt-0.5">
                0{metCriteriaCount} / 05
              </div>
              <div className="text-[11px] text-white/80 mt-0.5">
                Xét duyệt 3 cấp (09/QĐ-HSV)
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gpa')}
              className="bg-[#02294E]/85 border border-white/15 hover:border-[#00BCFF] p-3.5 text-left cursor-pointer"
            >
              <div className="text-[10.5px] font-mono uppercase text-[#DED1BE]">
                GPA Xét chọn tốt nhất
              </div>
              <div
                className={`text-xl font-extrabold font-mono mt-0.5 ${
                  isGpaQualified ? 'text-[#FCB900]' : 'text-rose-400'
                }`}
              >
                {effectiveGpa.toFixed(2)} / 4.00
              </div>
              <div className="text-[11px] text-white/80 mt-0.5">
                {isGpaQualified
                  ? '✓ Đạt chuẩn ≥ 3.00 (2026)'
                  : 'Chưa chạm ngưỡng 3.00'}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('certs')}
              className="bg-[#02294E]/85 border border-white/15 hover:border-[#00BCFF] p-3.5 text-left cursor-pointer"
            >
              <div className="text-[10.5px] font-mono uppercase text-[#DED1BE]">
                Ngày Tình nguyện Năm học
              </div>
              <div className="text-xl font-extrabold font-mono text-emerald-300 mt-0.5">
                7.5 / 5.0 ngày
              </div>
              <div className="text-[11px] text-white/80 mt-0.5">
                Đã có Hiến máu + Đoàn – Hội
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('certs')}
              className="bg-[#02294E]/85 border border-white/15 hover:border-[#00BCFF] p-3.5 text-left cursor-pointer"
            >
              <div className="text-[10.5px] font-mono uppercase text-[#DED1BE]">
                Kho E-Cert &amp; Quiz Số
              </div>
              <div className="text-xl font-extrabold font-mono text-white mt-0.5">
                {personalCerts.length} GCN •{' '}
                {quizSubmitted ? `${quizCorrectCount}/5` : '5 Câu'}
              </div>
              <div className="text-[11px] text-white/80 mt-0.5">
                Xác thực QR Phụ lục 2
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* LƯỚI RỘNG 3/9 (MAX-W-1200PX) CHO KHÔNG GIAN LÀM VIỆC CỦA HỘI VIÊN */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI (3/12): Menu dọc #C10230 / #EAE3D2 */}
          <aside
            aria-label="Phân hệ Sổ tay Hội viên"
            className="lg:col-span-3 space-y-5"
          >
            <div className="bg-white border border-slate-200">
              <div className="bg-[#133F68] text-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider font-eiu-display">
                Sổ tay &amp; Tiện ích Hội viên
              </div>
              <div className="divide-y divide-white">
                {PORTAL_MENU.map((item) => {
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      aria-current={isSelected ? 'page' : undefined}
                      className={`w-full text-left px-4 py-3 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#C10230] text-white font-bold'
                          : 'bg-[#EAE3D2] text-slate-900 hover:bg-[#dfd5be]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 font-bold ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-[#133F68] text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#C10230] text-white p-5 space-y-2.5">
              <div className="w-8 h-0.5 bg-white" aria-hidden="true" />
              <h2 className="text-sm font-bold font-eiu-display">
                Điểm mới QĐ 09/QĐ-HSV (2026)
              </h2>
              <p className="text-xs text-white/92 leading-relaxed">
                Chuẩn <strong>Học tập tốt ≥ 3.00/4.00</strong> tự động lấy điểm
                cao hơn giữa GPA năm học gia quyền tín chỉ và GPA tích lũy, kèm
                tối thiểu 01 tiêu chí phụ ở từng tiêu chuẩn.
              </p>
              <Link
                href="/van-ban?doc=09/QĐ-HSV"
                className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#FCB900] hover:underline font-eiu-display pt-1"
              >
                <span>XEM VĂN BẢN 09/QĐ-HSV</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>

          {/* CỘT PHẢI (9/12): Không gian chức năng chi tiết */}
          <div className="lg:col-span-9 space-y-6">
            <div className="bg-white border border-slate-200 p-5 border-l-4 border-l-[#133F68]">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display">
                {currentMenu.title}
              </h2>
              <p className="text-[13.5px] text-slate-600 mt-1 leading-relaxed">
                {currentMenu.subtitle}
              </p>
            </div>

            {/* ============================================================
                MODULE 1: SỔ TAY KỸ THUẬT SỐ SINH VIÊN 5 TỐT (09/QĐ-HSV 2026)
               ============================================================ */}
            {activeTab === 'sv5t' && (
              <div className="space-y-6">
                {/* Thanh Tiến trình Xét duyệt 3 Cấp */}
                <div className="bg-white border border-slate-200 p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#133F68] font-eiu-display">
                      Quy trình Xét duyệt Điện tử 03 Cấp (09/QĐ-HSV)
                    </div>
                    <span className="px-2.5 py-0.5 bg-[#0054A6]/10 text-[#0054A6] font-mono text-[11px] font-bold">
                      {dossierSubmitted
                        ? 'TRẠNG THÁI: ĐÃ NỘP LÊN CẤP 1 (CƠ SỞ HỘI)'
                        : 'TRẠNG THÁI: ĐANG HOÀN THIỆN MINH CHỨNG'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    {[
                      {
                        lvl: 'CẤP 01 — CƠ SỞ HỘI',
                        actor: 'BCH Chi hội / BCN CLB sơ duyệt',
                        active: true,
                      },
                      {
                        lvl: 'CẤP 02 — BAN CHUYÊN MÔN',
                        actor: 'Ban TG-PT & Ban TC-XDH thẩm định chéo',
                        active: dossierSubmitted,
                      },
                      {
                        lvl: 'CẤP 03 — THƯỜNG TRỰC HỘI',
                        actor: 'Ban Thư ký chốt duyệt & Lọc Top 10%',
                        active: false,
                      },
                    ].map((st) => (
                      <div
                        key={st.lvl}
                        className={`p-3.5 border ${
                          st.active
                            ? 'bg-[#F0F6FC] border-[#0054A6]'
                            : 'bg-[#F8FAFC] border-slate-200'
                        }`}
                      >
                        <div className="font-mono font-bold text-[#133F68]">
                          {st.lvl}
                        </div>
                        <div className="text-slate-600 mt-0.5">{st.actor}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bảng 05 Tiêu chuẩn Cứng & Tiêu chí Phụ */}
                <div className="bg-white border border-slate-300 overflow-x-auto">
                  <table className="eiu-table">
                    <thead>
                      <tr>
                        <th className="w-44">Tiêu chuẩn</th>
                        <th>Chuẩn cứng bắt buộc (09/QĐ-HSV 2026)</th>
                        <th>Tiêu chí phụ đã tích lũy (≥ 01)</th>
                        <th className="w-32 text-right">Kết luận</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-bold text-[#133F68]">
                          1. Đạo đức tốt
                        </td>
                        <td className="text-xs">
                          Điểm rèn luyện năm học:{' '}
                          <strong className="font-mono text-[#133F68]">
                            92 / 100
                          </strong>{' '}
                          (Chuẩn ≥ 80, không vi phạm kỷ luật)
                        </td>
                        <td className="text-xs text-slate-700">
                          {quizPassed
                            ? `✓ Đạt ${quizCorrectCount}/5 bài thi Online Quiz Nghị quyết`
                            : '✓ Tham gia Hội thi Tìm hiểu Tư tưởng Hồ Chí Minh'}
                        </td>
                        <td className="text-right font-mono text-xs font-bold text-emerald-700">
                          ✓ ĐẠT CHUẨN
                        </td>
                      </tr>

                      <tr>
                        <td className="font-bold text-[#133F68]">
                          2. Học tập tốt
                        </td>
                        <td className="text-xs">
                          MAX(Năm học {weightedYearGpa.toFixed(2)}, Tích lũy{' '}
                          {cumulativeGpa.toFixed(2)}) ={' '}
                          <strong className="font-mono text-[#0054A6]">
                            {effectiveGpa.toFixed(2)} / 4.00
                          </strong>{' '}
                          (Chuẩn ≥ 3.00)
                        </td>
                        <td className="text-xs text-slate-700">
                          ✓ 01 Tham luận NCKH / Sinh hoạt CLB Học thuật có xác
                          nhận Mentor
                        </td>
                        <td className="text-right font-mono text-xs font-bold">
                          {isGpaQualified ? (
                            <span className="text-emerald-700">✓ ĐẠT CHUẨN</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setActiveTab('gpa')}
                              className="text-[#C10230] underline cursor-pointer"
                            >
                              CẦN ≥ 3.00 →
                            </button>
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td className="font-bold text-[#133F68]">
                          3. Thể lực tốt
                        </td>
                        <td className="text-xs">
                          Hoàn thành đủ 03 môn GDTC theo chương trình đào tạo EIU
                        </td>
                        <td className="text-xs text-slate-700">
                          ✓ Đạt Giấy chứng nhận &ldquo;Sinh viên Khỏe&rdquo; cấp
                          Trường 2026 (Phụ lục 1)
                        </td>
                        <td className="text-right font-mono text-xs font-bold text-emerald-700">
                          ✓ ĐẠT CHUẨN
                        </td>
                      </tr>

                      <tr>
                        <td className="font-bold text-[#133F68]">
                          4. Tình nguyện tốt
                        </td>
                        <td className="text-xs">
                          Tích lũy:{' '}
                          <strong className="font-mono text-[#133F68]">
                            7.5 / 5.0 ngày
                          </strong>{' '}
                          tình nguyện trong năm học (Phụ lục 2)
                        </td>
                        <td className="text-xs text-slate-700">
                          ✓ Tham gia Ngày hội Hiến máu tình nguyện EIU (+5.0
                          ngày) &amp; Tập huấn Đoàn – Hội
                        </td>
                        <td className="text-right font-mono text-xs font-bold text-emerald-700">
                          ✓ ĐẠT CHUẨN
                        </td>
                      </tr>

                      <tr>
                        <td className="font-bold text-[#133F68]">
                          5. Hội nhập tốt
                        </td>
                        <td className="text-xs">
                          Hoàn thành 01 khóa Kỹ năng thực hành xã hội (Phụ lục
                          3) + 01 hoạt động Hội nhập
                        </td>
                        <td className="text-xs text-slate-700">
                          ✓ Đạt chuẩn Tiếng Anh B1 / Giao lưu sinh viên quốc tế
                          tại EIU
                        </td>
                        <td className="text-right font-mono text-xs font-bold text-emerald-700">
                          ✓ ĐẠT CHUẨN
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-white border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-700">
                    Đạt đủ <strong>05/05 tiêu chuẩn</strong> để nộp hồ sơ xét
                    chọn danh hiệu <strong>Sinh viên 5 Tốt cấp Trường</strong>.
                  </div>
                  <button
                    type="button"
                    disabled={!isGpaQualified}
                    onClick={() => setDossierSubmitted(true)}
                    className={`px-5 py-2 rounded text-xs font-bold uppercase tracking-wider font-eiu-display ${
                      !isGpaQualified
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : dossierSubmitted
                        ? 'bg-[#51803A] text-white cursor-pointer'
                        : 'bg-[#0054A6] hover:bg-[#133F68] text-white cursor-pointer'
                    }`}
                  >
                    {dossierSubmitted
                      ? '✓ Đã gửi Hồ sơ lên BCH Cơ sở Hội (Cấp 1)'
                      : 'Gửi Hồ sơ Xét duyệt Cấp 1'}
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================
                MODULE 2: MÁY TÍNH GPA HỌC CHẾ QUÝ EIU (CHUẨN 3.00 — 2026)
               ============================================================ */}
            {activeTab === 'gpa' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200">
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 font-eiu-display">
                    <Calculator className="w-4 h-4 text-[#00BCFF]" />
                    <span>
                      1. Nhập điểm 03 Học kỳ Quý chính (Thu – Đông – Xuân) &amp;
                      Học kỳ Hè
                    </span>
                  </div>

                  <div className="divide-y divide-slate-200 text-xs">
                    {quarters.map((q, idx) => (
                      <div
                        key={q.quarterName}
                        className="grid grid-cols-1 sm:grid-cols-12 p-4 items-center gap-3"
                      >
                        <div className="sm:col-span-6 font-bold text-[#133F68]">
                          {q.quarterName}
                        </div>
                        <div className="sm:col-span-3">
                          <label
                            htmlFor={`q-cred-${idx}`}
                            className="block text-[10.5px] text-slate-500 mb-1"
                          >
                            Số tín chỉ tích lũy
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
                            className="w-full h-9 px-3 border border-slate-300 rounded font-mono text-xs text-slate-900"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label
                            htmlFor={`q-gpa-${idx}`}
                            className="block text-[10.5px] text-slate-500 mb-1"
                          >
                            GPA Học kỳ (Thang 4.00)
                          </label>
                          <input
                            id={`q-gpa-${idx}`}
                            type="number"
                            min={0}
                            max={4}
                            step={0.01}
                            value={q.gpa4}
                            onChange={(e) =>
                              handleQuarterChange(idx, 'gpa4', e.target.value)
                            }
                            className="w-full h-9 px-3 border border-slate-300 rounded font-mono text-xs font-bold text-[#0054A6]"
                          />
                        </div>
                      </div>
                    ))}

                    {/* Ô nhập GPA Tích lũy toàn khóa để lấy MAX */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 p-4 items-center gap-3 bg-[#F8FAFC]">
                      <div className="sm:col-span-6 space-y-0.5">
                        <div className="font-bold text-[#133F68]">
                          GPA Tích lũy toàn khóa hiện tại (Cumulative GPA)
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Hệ thống tự động ưu tiên lấy giá trị cao hơn giữa GPA
                          năm học và GPA tích lũy
                        </div>
                      </div>
                      <div className="sm:col-span-6">
                        <input
                          id="cum-gpa-input"
                          type="number"
                          min={0}
                          max={4}
                          step={0.01}
                          aria-label="GPA tích lũy hiện tại"
                          value={cumulativeGpa}
                          onChange={(e) =>
                            setCumulativeGpa(
                              Math.min(
                                4,
                                Math.max(0, parseFloat(e.target.value) || 0)
                              )
                            )
                          }
                          className="w-full sm:w-48 h-9 px-3 border-2 border-[#0054A6] rounded font-mono text-xs font-bold text-[#133F68] bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hộp đối chiếu kết quả MAX(Năm học, Tích lũy) so với ngưỡng 3.00 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-slate-200 p-4">
                    <div className="text-[11px] font-bold uppercase text-slate-500 font-eiu-display">
                      GPA Năm học (Gia quyền)
                    </div>
                    <div className="text-2xl font-extrabold font-mono text-[#133F68] mt-1">
                      {weightedYearGpa.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Tổng{' '}
                      {quarters.reduce((sum, item) => sum + item.credits, 0)}{' '}
                      tín chỉ trong năm
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-4">
                    <div className="text-[11px] font-bold uppercase text-slate-500 font-eiu-display">
                      GPA Tích lũy Hiện tại
                    </div>
                    <div className="text-2xl font-extrabold font-mono text-[#133F68] mt-1">
                      {cumulativeGpa.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Theo bảng điểm Portal EIU
                    </div>
                  </div>

                  <div
                    className={`border-2 p-4 ${
                      isGpaQualified
                        ? 'bg-emerald-50 border-[#51803A]'
                        : 'bg-[#FFF9F0] border-[#C10230]'
                    }`}
                  >
                    <div className="text-[11px] font-bold uppercase text-[#133F68] font-eiu-display">
                      Mức GPA Xét SV5T (MAX)
                    </div>
                    <div
                      className={`text-2xl font-extrabold font-mono mt-1 ${
                        isGpaQualified ? 'text-emerald-800' : 'text-[#C10230]'
                      }`}
                    >
                      {effectiveGpa.toFixed(2)} / 4.00
                    </div>
                    <div className="text-xs font-bold mt-1">
                      {isGpaQualified
                        ? '✓ ĐẠT CHUẨN CỨNG ≥ 3.00'
                        : `Thiếu ${(3.0 - effectiveGpa).toFixed(2)} để đạt 3.00`}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                MODULE 3: SỰ KIỆN CỦA TÔI & KHO E-CERTIFICATE CÁ NHÂN
               ============================================================ */}
            {activeTab === 'certs' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200">
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between font-eiu-display">
                    <span className="inline-flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-[#FCB900]" />
                      <span>
                        Giấy chứng nhận Điện tử Đã Ban hành Quyết định (
                        {personalCerts.length})
                      </span>
                    </span>
                    <Link
                      href="/tra-cuu-gcn?q=32/QĐ-HSV"
                      className="text-[11px] text-[#00BCFF] hover:underline"
                    >
                      Mở Phụ lục 1 toàn trường →
                    </Link>
                  </div>

                  {personalCerts.length > 0 ? (
                    <div className="divide-y divide-slate-200">
                      {personalCerts.map((cert) => (
                        <div
                          key={cert.id}
                          className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="px-2 py-0.5 bg-[#133F68] text-white font-mono font-bold">
                                {cert.certCode}
                              </span>
                              <span className="font-mono text-[#0054A6] font-bold">
                                Kèm theo: {cert.decisionNumber} ({cert.decisionDate})
                              </span>
                            </div>
                            <h3 className="text-sm font-bold text-[#133F68] font-eiu-display">
                              {cert.eventTitle}
                            </h3>
                            <div className="text-xs text-slate-600">
                              Vai trò: <strong>{cert.roleTitle}</strong> • Quy
                              đổi:{' '}
                              <strong className="font-mono text-[#C10230]">
                                +{cert.volunteerDays.toFixed(1)} ngày TN
                              </strong>
                            </div>
                          </div>

                          <Link
                            href={`/tra-cuu-gcn?q=${encodeURIComponent(
                              cert.certCode
                            )}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0054A6] hover:bg-[#133F68] text-white text-xs font-bold uppercase tracking-wider shrink-0 font-eiu-display"
                          >
                            <span>Xem E-Cert Phụ lục 2</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-xs text-slate-600">
                      Tài khoản hiện tại chưa có Giấy chứng nhận cá nhân trong
                      Phụ lục Quyết định 32/QĐ-HSV. Bạn có thể chuyển sang tài
                      khoản <strong>Sinh viên mẫu (2531200188)</strong> hoặc{' '}
                      <strong>Chủ tịch HSV (2331200066)</strong> để xem E-Cert
                      mẫu.
                    </div>
                  )}
                </div>

                {/* Danh sách sự kiện sắp tới đã đồng bộ vé QR */}
                <div className="bg-white border border-slate-200">
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider font-eiu-display">
                    Lịch Sự kiện Sắp diễn ra &amp; Vé Điểm danh QR Cá nhân
                  </div>
                  <div className="divide-y divide-slate-200 text-xs">
                    {EVENT_ITEMS.filter(
                      (e) => e.certWorkflowStatus === 'upcoming'
                    )
                      .slice(0, 3)
                      .map((ev) => (
                        <div
                          key={ev.id}
                          className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-0.5">
                            <div className="font-bold text-[#133F68]">
                              {ev.title}
                            </div>
                            <div className="text-slate-600">
                              {ev.organizerUnit} •{' '}
                              <span className="font-mono text-[#C10230] font-bold">
                                +{ev.baseVolunteerDays.toFixed(1)} ngày gốc
                              </span>
                            </div>
                          </div>
                          <Link
                            href={`/su-kien?event=${ev.id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#0054A6] hover:text-[#C10230] shrink-0 font-eiu-display"
                          >
                            <span>ĐĂNG KÝ / CHI TIẾT</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                MODULE 4: PHÒNG THI TRẮC NGHIỆM TRỰC TUYẾN (ONLINE QUIZ)
               ============================================================ */}
            {activeTab === 'quiz' && (
              <div className="space-y-5">
                {quizSubmitted && (
                  <div
                    className={`p-5 border-l-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      quizPassed
                        ? 'bg-emerald-50 border-[#51803A] text-emerald-950'
                        : 'bg-[#FFF9F0] border-[#C10230] text-slate-900'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-bold uppercase font-eiu-display">
                        Kết quả bài làm: {quizCorrectCount} /{' '}
                        {ONLINE_QUIZ_QUESTIONS.length} câu chính xác
                      </div>
                      <p className="text-xs leading-relaxed">
                        {quizPassed
                          ? '✓ Chúc mừng! Kết quả đạt chuẩn (≥ 04/05 câu) đã được đồng bộ tự động làm minh chứng tiêu chí phụ mục Đạo đức tốt & Hội nhập tốt trong Sổ tay SV5T.'
                          : 'Bạn cần đạt tối thiểu 04/05 câu để được ghi nhận hoàn thành chuyên đề trực tuyến. Hãy xem giải thích bên dưới và làm lại.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setQuizAnswers({});
                        setQuizSubmitted(false);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#133F68] text-white text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer font-eiu-display"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Làm lại bài thi</span>
                    </button>
                  </div>
                )}

                <div className="space-y-4">
                  {ONLINE_QUIZ_QUESTIONS.map((q, qIdx) => {
                    const chosen = quizAnswers[q.id];
                    return (
                      <div
                        key={q.id}
                        className="bg-white border border-slate-200 p-5 space-y-3.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                          <span className="font-mono font-bold text-[#0054A6]">
                            CÂU 0{qIdx + 1} • {q.topic}
                          </span>
                          <span className="px-2 py-0.5 bg-[#EAE3D2] text-[#133F68] font-bold font-eiu-display">
                            SV5T: {q.sv5tTarget}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-[#133F68] leading-snug">
                          {q.question}
                        </h3>

                        <div className="space-y-2 text-xs">
                          {q.options.map((opt, optIdx) => {
                            const isPicked = chosen === optIdx;
                            const isRight = q.correctIndex === optIdx;

                            let optionStyle =
                              'border-slate-200 hover:border-[#0054A6] bg-[#F8FAFC] text-slate-800';
                            if (!quizSubmitted && isPicked) {
                              optionStyle =
                                'border-2 border-[#0054A6] bg-[#F0F6FC] text-[#133F68] font-semibold';
                            } else if (quizSubmitted && isRight) {
                              optionStyle =
                                'border-2 border-[#51803A] bg-emerald-50 text-emerald-950 font-semibold';
                            } else if (quizSubmitted && isPicked && !isRight) {
                              optionStyle =
                                'border-2 border-[#C10230] bg-rose-50 text-rose-950';
                            }

                            return (
                              <button
                                key={opt}
                                type="button"
                                disabled={quizSubmitted}
                                onClick={() =>
                                  setQuizAnswers((prev) => ({
                                    ...prev,
                                    [q.id]: optIdx,
                                  }))
                                }
                                className={`w-full text-left p-3 border transition-colors flex items-start gap-2.5 ${optionStyle} ${
                                  quizSubmitted
                                    ? 'cursor-default'
                                    : 'cursor-pointer'
                                }`}
                              >
                                <span className="font-mono font-bold shrink-0">
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className="p-3 bg-[#F0F6FC] border-l-3 border-[#0054A6] text-xs text-slate-700 leading-relaxed">
                            <strong className="text-[#133F68]">
                              Căn cứ quy chế:
                            </strong>{' '}
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!quizSubmitted && (
                  <div className="bg-white border border-slate-200 p-4 flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-600">
                      Đã chọn{' '}
                      <strong className="font-mono text-[#133F68]">
                        {Object.keys(quizAnswers).length}/
                        {ONLINE_QUIZ_QUESTIONS.length}
                      </strong>{' '}
                      câu hỏi
                    </span>
                    <button
                      type="button"
                      disabled={
                        Object.keys(quizAnswers).length <
                        ONLINE_QUIZ_QUESTIONS.length
                      }
                      onClick={() => setQuizSubmitted(true)}
                      className={`px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider font-eiu-display ${
                        Object.keys(quizAnswers).length <
                        ONLINE_QUIZ_QUESTIONS.length
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          : 'bg-[#0054A6] hover:bg-[#133F68] text-white cursor-pointer'
                      }`}
                    >
                      Nộp bài &amp; Đồng bộ SV5T
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================
                MODULE 5: THẺ HỘI VIÊN ĐIỆN TỬ & GIẢI MÃ MSSV 10 CHỮ SỐ EIU
               ============================================================ */}
            {activeTab === 'idcard' && (
              <div className="space-y-6">
                {/* Thẻ Hội viên Điện tử EIU × HSV */}
                <div className="bg-white border-2 border-[#133F68] overflow-hidden max-w-2xl">
                  <div className="bg-[#133F68] eiu-arch-pattern text-white px-5 py-3.5 flex items-center justify-between border-b-3 border-[#A68556]">
                    <div className="flex items-center gap-3">
                      <img
                        src="/images/eiu-logo-shorten-white.png"
                        alt="EIU"
                        className="h-7 w-auto object-contain"
                      />
                      <span
                        className="h-5 w-px bg-white/30"
                        aria-hidden="true"
                      />
                      <img
                        src="/images/hsv-logo.png"
                        alt="HSV"
                        className="h-7 w-7 object-contain"
                      />
                      <span className="text-xs font-bold uppercase tracking-wider font-eiu-display">
                        THẺ HỘI VIÊN ĐIỆN TỬ — EIU STUDENT UNION
                      </span>
                    </div>
                    <CreditCard className="w-4 h-4 text-[#FCB900]" />
                  </div>

                  <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-32 h-32 border-2 border-[#133F68] p-2 flex flex-col items-center justify-center shrink-0 bg-[#F8FAFC]">
                      <QrCode className="w-24 h-24 text-[#133F68]" />
                      <span className="text-[9.5px] font-mono font-bold text-[#0054A6] mt-1">
                        QR CHECK-IN 2 CHIỀU
                      </span>
                    </div>

                    <div className="space-y-2 text-xs flex-1">
                      <div className="text-lg font-bold text-[#133F68] font-eiu-display">
                        {currentPersona.fullName}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <div>
                          <span className="text-slate-500">Mã định danh:</span>
                          <div className="font-mono font-bold text-slate-900">
                            {currentPersona.studentId !== '-'
                              ? currentPersona.studentId
                              : 'CÁN BỘ CTSV'}
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-500">Email SSO:</span>
                          <div className="font-mono font-semibold text-[#0054A6] break-all">
                            {currentPersona.email}
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-500">Khoa nhận diện:</span>
                          <div className="font-semibold text-slate-900">
                            {emailDecoded.facultyName}
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-500">Đơn vị cơ sở:</span>
                          <div className="font-semibold text-slate-900">
                            {activePosition.unitName}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bảng giải mã cấu trúc 10 chữ số MSSV EIU (Sổ tay Sinh viên EIU trang 15) */}
                <div className="bg-white border border-slate-300 overflow-x-auto">
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider font-eiu-display">
                    Giải mã Tự động Cấu trúc Mã số Sinh viên 10 Chữ số EIU (Sổ
                    tay Sinh viên trang 15)
                  </div>
                  {idDecoded.isValid ? (
                    <table className="eiu-table">
                      <thead>
                        <tr>
                          <th>Vị trí ký số</th>
                          <th>Giá trị tách</th>
                          <th>Ý nghĩa học vụ &amp; Định danh Khoa/Khóa</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="font-mono font-bold text-[#133F68]">
                            X1X2 (2 số đầu)
                          </td>
                          <td className="font-mono font-bold text-[#0054A6]">
                            {currentPersona.studentId.slice(0, 2)}
                          </td>
                          <td className="text-xs">
                            Khóa tuyển sinh:{' '}
                            <strong>Năm {idDecoded.enrollmentYear}</strong> (K
                            {currentPersona.studentId.slice(0, 2)})
                          </td>
                        </tr>
                        <tr>
                          <td className="font-mono font-bold text-[#133F68]">
                            X3 (Số thứ 3)
                          </td>
                          <td className="font-mono font-bold text-[#0054A6]">
                            {currentPersona.studentId.slice(2, 3)}
                          </td>
                          <td className="text-xs">
                            Bậc đào tạo: <strong>{idDecoded.degreeLevel}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td className="font-mono font-bold text-[#133F68]">
                            X4 (Số thứ 4)
                          </td>
                          <td className="font-mono font-bold text-[#0054A6]">
                            {currentPersona.studentId.slice(3, 4)}
                          </td>
                          <td className="text-xs">
                            Hệ đào tạo: <strong>{idDecoded.programType}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td className="font-mono font-bold text-[#133F68]">
                            X5X6 (Số 5 – 6)
                          </td>
                          <td className="font-mono font-bold text-[#0054A6]">
                            {idDecoded.majorCode}
                          </td>
                          <td className="text-xs">
                            Ngành đào tạo: <strong>{idDecoded.majorName}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td className="font-mono font-bold text-[#133F68]">
                            X7X8X9X10 (4 số cuối)
                          </td>
                          <td className="font-mono font-bold text-[#0054A6]">
                            {idDecoded.serialNumber}
                          </td>
                          <td className="text-xs">
                            Số thứ tự định danh cá nhân (dùng để sắp xếp tăng
                            dần trong Phụ lục 1 Quyết định 28/QĐ-HSV)
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-5 text-xs text-slate-700">
                      Tài khoản hiện tại thuộc nhóm{' '}
                      <strong>Cán bộ / Chuyên viên Nhà trường</strong> (
                      {currentPersona.email}), không áp dụng dãy 10 chữ số MSSV.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ============================================================
                MODULE 6: HỘP THƯ LẮNG NGHE SINH VIÊN (GỬI BAN KIỂM TRA / TG-PT)
               ============================================================ */}
            {activeTab === 'voice' && (
              <div className="space-y-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFeedbackSent(true);
                  }}
                  className="bg-white border border-slate-200"
                >
                  <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 font-eiu-display">
                    <MessageSquare className="w-4 h-4 text-[#00BCFF]" />
                    <span>
                      Biểu mẫu Gửi Kiến nghị, Đề xuất &amp; Phản ánh Quyền lợi
                      Hội viên
                    </span>
                  </div>

                  <div className="divide-y divide-slate-200 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-12 p-4 items-center gap-2">
                      <span className="sm:col-span-4 font-bold text-slate-900">
                        Cơ quan tiếp nhận:
                      </span>
                      <div className="sm:col-span-8 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setFeedbackRecipient('BKT')}
                          className={`px-3.5 py-2 border text-xs font-bold cursor-pointer font-eiu-display ${
                            feedbackRecipient === 'BKT'
                              ? 'bg-[#133F68] text-white border-[#133F68]'
                              : 'bg-[#F8FAFC] text-[#133F68] border-slate-300'
                          }`}
                        >
                          Ban Kiểm tra HSV Trường (Giám sát &amp; Quyền lợi)
                        </button>
                        <button
                          type="button"
                          onClick={() => setFeedbackRecipient('BAN_TGPT')}
                          className={`px-3.5 py-2 border text-xs font-bold cursor-pointer font-eiu-display ${
                            feedbackRecipient === 'BAN_TGPT'
                              ? 'bg-[#133F68] text-white border-[#133F68]'
                              : 'bg-[#F8FAFC] text-[#133F68] border-slate-300'
                          }`}
                        >
                          Ban Tuyên giáo – Phong trào (Ý tưởng Sự kiện)
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 p-4 items-center gap-2">
                      <label
                        htmlFor="fb-cat"
                        className="sm:col-span-4 font-bold text-slate-900"
                      >
                        Chủ đề phản ánh:
                      </label>
                      <div className="sm:col-span-8">
                        <select
                          id="fb-cat"
                          value={feedbackCategory}
                          onChange={(e) => setFeedbackCategory(e.target.value)}
                          className="w-full h-9 px-3 border border-slate-300 rounded text-xs bg-white text-slate-900 font-medium"
                        >
                          <option>
                            Quy đổi Ngày tình nguyện &amp; Cấp E-Certificate
                            (28/QĐ-HSV)
                          </option>
                          <option>
                            Xét chọn Danh hiệu Sinh viên 5 Tốt (09/QĐ-HSV 2026)
                          </option>
                          <option>
                            Hoạt động Chi hội Khoa &amp; Câu lạc bộ – Đội – Nhóm
                          </option>
                          <option>
                            Đề xuất Chương trình mới / Sự kiện Xanh UN SDGs
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 p-4 items-center gap-2">
                      <span className="sm:col-span-4 font-bold text-slate-900">
                        Chế độ danh tính:
                      </span>
                      <div className="sm:col-span-8 flex items-center gap-2.5">
                        <input
                          id="anon-toggle"
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="w-4 h-4 accent-[#0054A6]"
                        />
                        <label
                          htmlFor="anon-toggle"
                          className="text-slate-700 cursor-pointer"
                        >
                          Bảo mật danh tính người gửi (Chỉ Trưởng Ban Kiểm tra
                          tiếp cận mã hồ sơ)
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 p-4 items-start gap-2">
                      <label
                        htmlFor="fb-body"
                        className="sm:col-span-4 font-bold text-slate-900 pt-1.5"
                      >
                        Nội dung chi tiết:
                      </label>
                      <div className="sm:col-span-8">
                        <textarea
                          id="fb-body"
                          rows={4}
                          required
                          value={feedbackContent}
                          onChange={(e) => setFeedbackContent(e.target.value)}
                          placeholder="Trình bày cụ thể sự kiện, thời gian hoặc đề xuất của bạn để Ban Kiểm tra / Ban TG-PT phản hồi..."
                          className="w-full p-3 border border-slate-300 rounded text-xs text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {feedbackSent && (
                    <div className="px-5 py-3.5 bg-emerald-50 text-emerald-900 text-xs font-semibold border-t border-emerald-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#51803A] shrink-0" />
                      <span>
                        Đã chuyển hồ sơ kiến nghị (
                        {isAnonymous ? 'Chế độ Ẩn danh' : currentPersona.fullName}
                        ) tới{' '}
                        {feedbackRecipient === 'BKT'
                          ? 'Ban Kiểm tra HSV Trường (Trưởng ban: Đ/c Trần Thị Thu Huyền)'
                          : 'Ban Tuyên giáo – Phong trào'}
                        .
                      </span>
                    </div>
                  )}

                  <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-[#0054A6]" />
                      <span>Cam kết phản hồi trong 03 ngày làm việc</span>
                    </span>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#0054A6] hover:bg-[#133F68] text-white rounded text-xs font-bold uppercase tracking-wider cursor-pointer font-eiu-display"
                    >
                      Gửi Kiến nghị
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentPortalSearchBridge() {
  const searchParams = useSearchParams();
  const rawTab = searchParams.get('tab') as PortalTab | null;
  const validTab =
    rawTab && PORTAL_MENU.some((m) => m.id === rawTab) ? rawTab : 'sv5t';

  return <StudentPortalContent key={validTab} initialTab={validTab} />;
}

export default function StudentPortalPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1200px] mx-auto px-4 py-16 text-center text-sm text-slate-500">
          Đang tải Không gian Hội viên &amp; Sổ tay Sinh viên 5 Tốt...
        </div>
      }
    >
      <StudentPortalSearchBridge />
    </Suspense>
  );
}
