'use client';

import React, { Suspense, use, useState } from 'react';
import Link from 'next/link';
import { SubpageBanner } from '@/components/public/subpage-banner';
import {
  BRANCH_UNITS,
  CLUB_UNITS,
  FACULTY_METADATA,
} from '@/data/mock-data';
import { useRole } from '@/context/role-context';
import { ClubUnit } from '@/types';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Layers,
  Lock,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

function getClubSv5tBenefit(club: ClubUnit): {
  pillar: string;
  rule: string;
} {
  if (club.code === 'CLB-SV5T') {
    return {
      pillar: 'Đồng hành cả 05 Tiêu chuẩn Sinh viên 5 Tốt (09/QĐ-HSV 2026)',
      rule: 'Hỗ trợ rà soát hồ sơ Sổ tay số, tổ chức chuỗi Workshop kỹ năng thực hành xã hội (Phụ lục 3) và diễn đàn Gương SV5T Tiêu biểu.',
    };
  }
  if (club.code === 'DOI-CTVXK') {
    return {
      pillar: 'Tiêu chuẩn Tình nguyện tốt — Lĩnh vực 06: Công tác Đoàn – Hội',
      rule: 'Áp dụng quy đổi Ngày tình nguyện nhân Hệ số 1 – 2 – 3 (Phụ lục 2 QĐ 09 & QĐ 28/QĐ-HSV) khi trực tiếp điều phối Hậu cần – Sân khấu và Lễ tân – Khánh tiết.',
    };
  }
  if (club.code === 'CLB-BLOOD') {
    return {
      pillar: 'Tiêu chuẩn Tình nguyện tốt — Lĩnh vực 04: Sức khỏe cộng đồng',
      rule: 'Tham gia hiến máu tình nguyện được công nhận cố định 5.0 ngày tình nguyện/lần và thỏa điều kiện cần của tiêu chuẩn Tình nguyện tốt.',
    };
  }
  switch (club.category) {
    case 'HOC_THUAT':
      return {
        pillar: 'Tiêu chuẩn Học tập tốt (GPA ≥ 3.00 + Tiêu chí phụ học thuật)',
        rule: 'Hội viên tham gia sinh hoạt chuyên đề định kỳ có xác nhận của Giảng viên Cố vấn (Mentor) được tính đạt 01 tiêu chí phụ mục Học tập tốt.',
      };
    case 'THE_THAO':
      return {
        pillar: 'Tiêu chuẩn Thể lực tốt (Phụ lục 1 — Sinh viên Khỏe)',
        rule: 'Hội viên tham gia tập luyện định kỳ tại CLB thể thao hoặc thi đấu giải cấp Khoa/Trường được xét đạt tiêu chuẩn Thể lực tốt.',
      };
    case 'NGHE_THUAT':
      return {
        pillar: 'Tiêu chuẩn Hội nhập tốt & Kỹ năng Thực hành Xã hội',
        rule: 'Tham gia biểu diễn giao lưu văn hóa quốc tế, dẫn chương trình song ngữ và rèn luyện kỹ năng mềm tại các sự kiện toàn trường.',
      };
    default:
      return {
        pillar: 'Tiêu chuẩn Tình nguyện tốt (Tối thiểu 5.0 ngày/năm)',
        rule: 'Tham gia chiến dịch công tác xã hội và dự án cộng đồng được cấp E-Certificate xác thực QR trong 07 ngày làm việc (28/QĐ-HSV).',
      };
  }
}

function UnitMicrositeInner({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { currentPersona } = useRole();

  const club = CLUB_UNITS.find((c) => c.slug === slug);
  const branch = BRANCH_UNITS.find((b) => b.slug === slug);

  const [selectedDivision, setSelectedDivision] = useState(
    'Ban Chuyên môn / Hoạt động'
  );
  const [reasonText, setReasonText] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  if (!club && !branch) {
    return (
      <div className="bg-[#F5F5F5] min-h-screen py-16">
        <div className="max-w-[1140px] mx-auto px-4 text-center space-y-4">
          <h1 className="text-2xl font-bold text-[#133F68] font-eiu-display">
            Không tìm thấy cơ sở Hội
          </h1>
          <p className="text-sm text-slate-600">
            Đơn vị không tồn tại trong danh mục 25 Chi hội và 30 CLB – Đội –
            Nhóm Khóa II.
          </p>
          <Link
            href="/to-chuc"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#133F68] text-white text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Danh bạ Chi hội &amp; CLB</span>
          </Link>
        </div>
      </div>
    );
  }

  /* ========================================================================
     TRƯỜNG HỢP 1: MICRO-SITE CÂU LẠC BỘ / ĐỘI / NHÓM (30 ĐƠN VỊ)
     ======================================================================== */
  if (club) {
    const sv5tBenefit = getClubSv5tBenefit(club);
    const siblingClubs = CLUB_UNITS.filter(
      (c) => c.category === club.category && c.id !== club.id
    ).slice(0, 4);

    return (
      <div className="bg-[#F5F5F5] min-h-screen pb-16">
        <SubpageBanner
          kicker={
            club.isCoreUnionUnit
              ? 'ĐƠN VỊ NÒNG CỐT TRỰC THUỘC HỘI SINH VIÊN TRƯỜNG'
              : `KHỐI ${club.categoryLabel.toUpperCase()}`
          }
          title={club.name}
          subtitle={club.description}
          breadcrumbs={[
            { label: 'Chi hội & CLB', href: '/to-chuc?tab=clubs' },
            {
              label: club.categoryLabel,
              href: `/to-chuc?tab=clubs&category=${club.category}`,
            },
            { label: club.shortName },
          ]}
        />

        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-9">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* CỘT TRÁI (8/12): Hồ sơ CLB, Liên kết SV5T & Form Tuyển quân theo trạng thái thực */}
            <div className="lg:col-span-8 space-y-6">
              {/* 1. Bảng Định danh & Ban Chủ nhiệm 05 đồng chí */}
              <div className="bg-white border border-slate-200">
                <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between font-eiu-display">
                  <span>Hồ sơ Định danh &amp; Cơ cấu Ban Chủ nhiệm</span>
                  <span className="font-mono text-[#00BCFF]">{club.code}</span>
                </div>

                <div className="divide-y divide-slate-200 text-[13.5px]">
                  <div className="grid grid-cols-1 sm:grid-cols-12 p-4 gap-1">
                    <div className="sm:col-span-4 font-bold text-slate-900">
                      Tên chính thức:
                    </div>
                    <div className="sm:col-span-8 font-bold text-[#133F68]">
                      {club.name} ({club.shortName})
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 p-4 gap-1">
                    <div className="sm:col-span-4 font-bold text-slate-900">
                      Trạng thái tuyển thành viên:
                    </div>
                    <div className="sm:col-span-8">
                      {club.recruitmentOpen ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>ĐANG MỞ ĐƠN TUYỂN THÀNH VIÊN MỚI</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold">
                          <Lock className="w-3.5 h-3.5" />
                          <span>TẠM ĐÓNG ĐƠN TUYỂN TRONG HỌC KỲ HIỆN TẠI</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 p-4 gap-1">
                    <div className="sm:col-span-4 font-bold text-slate-900">
                      Cơ cấu điều hành chuẩn:
                    </div>
                    <div className="sm:col-span-8 text-slate-800 space-y-1">
                      <div>
                        <strong>Ban Chủ nhiệm 05 đồng chí</strong> (01 Chủ
                        nhiệm, 02 Phó Chủ nhiệm, 02 Ủy viên BCN)
                      </div>
                      {club.presidentName && (
                        <div className="text-xs text-[#0054A6] font-semibold">
                          •{' '}
                          {club.unitType === 'team' ? 'Đội trưởng' : 'Chủ nhiệm'}
                          : Đ/c {club.presidentName}
                          {club.vicePresidentName
                            ? ` • Phó CN: Đ/c ${club.vicePresidentName}`
                            : ''}
                        </div>
                      )}
                      {club.mentorName && (
                        <div className="text-xs text-slate-600">
                          • Cố vấn chuyên môn (Mentor):{' '}
                          <strong>{club.mentorName}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  {club.managedSubteams && club.managedSubteams.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-12 p-4 gap-1 bg-[#FFF9F0]">
                      <div className="sm:col-span-4 font-bold text-[#C10230]">
                        Tiểu ban trực tiếp quản lý:
                      </div>
                      <div className="sm:col-span-8 text-slate-900 space-y-1">
                        {club.managedSubteams.map((st) => (
                          <div
                            key={st}
                            className="inline-flex items-center gap-1.5 mr-3 text-xs font-bold text-[#133F68]"
                          >
                            <Layers className="w-3.5 h-3.5 text-[#C10230]" />
                            <span>{st}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-12 p-4 gap-1">
                    <div className="sm:col-span-4 font-bold text-slate-900">
                      Quy mô &amp; Truyền thông:
                    </div>
                    <div className="sm:col-span-8 flex flex-wrap items-center gap-4">
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#133F68]">
                        <Users className="w-4 h-4 text-[#0054A6]" />
                        {club.memberCount} thành viên đang sinh hoạt
                      </span>
                      {club.fanpageUrl && (
                        <a
                          href={club.fanpageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#0054A6] hover:text-[#C10230] hover:underline"
                        >
                          <span>Mở Fanpage chính thức</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Điểm nhấn hoạt động & Quyền lợi xét Sinh viên 5 Tốt */}
              <div className="bg-white border border-slate-200">
                <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 font-eiu-display">
                  <Sparkles className="w-4 h-4 text-[#FCB900]" />
                  <span>
                    Hoạt động Trọng tâm &amp; Liên thông Tiêu chuẩn Sinh viên 5
                    Tốt
                  </span>
                </div>
                <div className="p-5 space-y-4">
                  <ul className="space-y-2">
                    {club.highlights.map((hl) => (
                      <li
                        key={hl}
                        className="flex items-start gap-2.5 text-[13.5px] text-slate-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#0054A6] shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="bg-[#F0F6FC] border-l-4 border-[#0054A6] p-4 space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#0054A6] font-eiu-display">
                      {sv5tBenefit.pillar}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {sv5tBenefit.rule}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Khu vực Tuyển thành viên 1-Chạm (Có điều kiện theo club.recruitmentOpen) */}
              <div className="bg-white border border-slate-200">
                <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider font-eiu-display">
                  {club.recruitmentOpen
                    ? `Đăng ký Ứng tuyển Thành viên — ${club.shortName}`
                    : `Thông báo Đợt tuyển Thành viên — ${club.shortName}`}
                </div>

                {club.recruitmentOpen ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setFormSubmitted(true);
                    }}
                    className="p-5 space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                      <span className="sm:col-span-4 font-bold text-slate-900">
                        Hội viên đăng ký (SSO):
                      </span>
                      <div className="sm:col-span-8 bg-[#F8FAFC] border border-slate-200 px-3 py-2 text-slate-800">
                        <strong>{currentPersona.fullName}</strong> • MSSV:{' '}
                        <span className="font-mono">
                          {currentPersona.studentId}
                        </span>{' '}
                        ({currentPersona.email})
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                      <label
                        htmlFor="club-division"
                        className="sm:col-span-4 font-bold text-slate-900"
                      >
                        Mảng / Tiểu ban ứng tuyển:
                      </label>
                      <div className="sm:col-span-8">
                        <select
                          id="club-division"
                          value={selectedDivision}
                          onChange={(e) => setSelectedDivision(e.target.value)}
                          className="w-full h-9 px-3 border border-slate-300 rounded bg-white text-slate-900 font-medium"
                        >
                          {club.managedSubteams &&
                          club.managedSubteams.length > 0 ? (
                            club.managedSubteams.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))
                          ) : (
                            <>
                              <option value="Ban Chuyên môn / Hoạt động">
                                Ban Chuyên môn / Hoạt động
                              </option>
                              <option value="Ban Truyền thông – Sự kiện">
                                Ban Truyền thông – Sự kiện
                              </option>
                              <option value="Ban Đối ngoại – Hậu cần">
                                Ban Đối ngoại – Hậu cần
                              </option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 items-start gap-2">
                      <label
                        htmlFor="club-reason"
                        className="sm:col-span-4 font-bold text-slate-900 pt-2"
                      >
                        Kỹ năng &amp; Nguyện vọng:
                      </label>
                      <div className="sm:col-span-8">
                        <textarea
                          id="club-reason"
                          rows={3}
                          required
                          value={reasonText}
                          onChange={(e) => setReasonText(e.target.value)}
                          placeholder="Giới thiệu ngắn gọn thế mạnh hoặc mong muốn rèn luyện của bạn tại CLB..."
                          className="w-full p-2.5 border border-slate-300 rounded text-slate-900"
                        />
                      </div>
                    </div>

                    {formSubmitted && (
                      <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold">
                        ✓ Đã chuyển hồ sơ ứng tuyển ({selectedDivision}) của{' '}
                        {currentPersona.fullName} tới Ban Chủ nhiệm{' '}
                        {club.shortName}.
                      </div>
                    )}

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                      <Link
                        href="/to-chuc?tab=clubs"
                        className="inline-flex items-center gap-1 text-slate-600 hover:text-[#133F68] font-semibold"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Quay lại danh bạ CLB</span>
                      </Link>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#0054A6] hover:bg-[#133F68] text-white rounded text-xs font-bold uppercase tracking-wider cursor-pointer font-eiu-display"
                      >
                        Gửi hồ sơ ứng tuyển
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-5 space-y-3 text-[13.5px]">
                    <div className="bg-[#FFF9F0] border-l-4 border-[#A68556] p-4 space-y-1.5">
                      <div className="font-bold text-[#133F68] flex items-center gap-2 font-eiu-display text-xs uppercase">
                        <Lock className="w-4 h-4 text-[#A68556]" />
                        <span>
                          Đơn vị hiện đã kết thúc đợt tuyển thành viên Học kỳ
                          này
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        <strong>{club.name}</strong> tạm đóng biểu mẫu nhận đơn
                        trực tuyến để tập trung sinh hoạt chuyên môn cho{' '}
                        <strong>{club.memberCount} thành viên</strong> hiện hữu.
                        Hội viên vẫn có thể đăng ký tham gia các sự kiện mở của
                        CLB tại chuyên trang Sự kiện hoặc theo dõi lịch mở đơn
                        đợt kế tiếp trên Fanpage.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <Link
                        href="/su-kien"
                        className="px-4 py-2 bg-[#133F68] text-white text-xs font-bold uppercase tracking-wider font-eiu-display"
                      >
                        Xem Sự kiện Mở toàn trường
                      </Link>
                      {club.fanpageUrl && (
                        <a
                          href={club.fanpageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0054A6] hover:underline"
                        >
                          <span>Theo dõi Fanpage {club.shortName}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CỘT PHẢI (4/12): Quản lý Cụm CLB & Các CLB Cùng Khối */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-[#C10230] text-white p-6 space-y-3">
                <div className="w-8 h-0.5 bg-white" aria-hidden="true" />
                <h2 className="text-base font-bold font-eiu-display">
                  Quản lý Cụm 30 CLB – Đội – Nhóm
                </h2>
                <p className="text-xs text-white/92 leading-relaxed">
                  Trực thuộc sự điều phối của{' '}
                  <strong>Ban Tổ chức và Xây dựng Hội</strong> (Phó Ban phụ
                  trách: <strong>Đ/c Nguyễn Mỹ Hạnh</strong>). Mọi hoạt động có
                  quy đổi Ngày tình nguyện đều được thẩm định trước ít nhất 03
                  ngày theo Quyết định 28/QĐ-HSV.
                </p>
              </div>

              <div className="bg-white border border-slate-200">
                <div className="bg-[#133F68] text-white px-4 py-3 text-xs font-bold uppercase tracking-wider font-eiu-display">
                  Đơn vị Cùng Khối {club.categoryLabel}
                </div>
                <div className="divide-y divide-slate-200">
                  {siblingClubs.map((sc) => (
                    <Link
                      key={sc.id}
                      href={`/to-chuc/${sc.slug}`}
                      className="p-3.5 flex items-center justify-between gap-2 hover:bg-[#F5F5F5] transition-colors group"
                    >
                      <div>
                        <div className="text-xs font-bold text-[#133F68] group-hover:text-[#C10230]">
                          {sc.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {sc.code} • {sc.memberCount} TV
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  /* ========================================================================
     TRƯỜNG HỢP 2: MICRO-SITE CHI HỘI SINH VIÊN (25 CHI HỘI THUỘC 04 KHOA)
     ======================================================================== */
  const b = branch!;
  const facultyMeta = FACULTY_METADATA[b.facultyCode];
  const isCollectiveQualified =
    b.sv5tRegisteredRate === 100 &&
    b.sv5tAchievedRate >= 30 &&
    !b.hasDisciplineViolation;
  const siblingBranches = BRANCH_UNITS.filter(
    (item) => item.facultyCode === b.facultyCode && item.id !== b.id
  );

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <SubpageBanner
        kicker={`CỤM CHI HỘI ${facultyMeta.nameVi.toUpperCase()} — KHÓA 20${b.cohortYear}`}
        title={`${b.name} (${b.code})`}
        subtitle={b.description}
        breadcrumbs={[
          { label: 'Chi hội & CLB', href: '/to-chuc?tab=branches' },
          {
            label: facultyMeta.nameVi,
            href: `/to-chuc?tab=branches&faculty=${b.facultyCode}`,
          },
          { label: b.code },
        ]}
      />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-9">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI (8/12): Bảng tiến độ 03 điều kiện Tập thể SV5T + Hồ sơ BCH Chi hội */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Bảng theo dõi 03 điều kiện Tập thể Sinh viên 5 Tốt (09/QĐ-HSV 2026) */}
            <div className="bg-white border-2 border-[#133F68]">
              <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex flex-wrap items-center justify-between gap-2 font-eiu-display">
                <span className="inline-flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#FCB900]" />
                  <span>
                    Bảng Theo dõi Danh hiệu Tập thể Sinh viên 5 Tốt (09/QĐ-HSV)
                  </span>
                </span>
                <span
                  className={`px-2 py-0.5 font-mono text-[11px] font-bold ${
                    isCollectiveQualified
                      ? 'bg-[#51803A] text-white'
                      : 'bg-[#FCB900] text-[#02294E]'
                  }`}
                >
                  {isCollectiveQualified
                    ? '✓ ĐỦ ĐIỀU KIỆN XÉT TẬP THỂ SV5T'
                    : 'ĐANG PHẤN ĐẤU CHỈ TIÊU 30%'}
                </span>
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-slate-200 p-4 bg-[#F8FAFC] space-y-2">
                  <div className="text-[11px] font-bold uppercase text-slate-500 font-eiu-display">
                    Điều kiện 1: Đăng ký
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-[#0054A6]">
                    {b.sv5tRegisteredRate}%
                  </div>
                  <div className="w-full h-2 bg-slate-200">
                    <div
                      className="h-full bg-[#0054A6]"
                      style={{ width: `${b.sv5tRegisteredRate}%` }}
                    />
                  </div>
                  <div className="text-xs text-emerald-700 font-semibold">
                    ✓ Chuẩn yêu cầu: 100% hội viên
                  </div>
                </div>

                <div className="border border-slate-200 p-4 bg-[#F8FAFC] space-y-2">
                  <div className="text-[11px] font-bold uppercase text-slate-500 font-eiu-display">
                    Điều kiện 2: Đạt SV5T Trường
                  </div>
                  <div
                    className={`text-2xl font-extrabold font-mono ${
                      b.sv5tAchievedRate >= 30
                        ? 'text-emerald-700'
                        : 'text-[#C10230]'
                    }`}
                  >
                    {b.sv5tAchievedRate}%{' '}
                    <span className="text-xs font-normal text-slate-500">
                      / 30%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200">
                    <div
                      className={`h-full ${
                        b.sv5tAchievedRate >= 30
                          ? 'bg-[#51803A]'
                          : 'bg-[#C10230]'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((b.sv5tAchievedRate / 45) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-slate-700 font-medium">
                    {b.sv5tAchievedRate >= 30
                      ? `✓ Vượt chỉ tiêu +${b.sv5tAchievedRate - 30}%`
                      : `Còn thiếu ${30 - b.sv5tAchievedRate}% để chạm mốc 30%`}
                  </div>
                </div>

                <div className="border border-slate-200 p-4 bg-[#F8FAFC] space-y-2">
                  <div className="text-[11px] font-bold uppercase text-slate-500 font-eiu-display">
                    Điều kiện 3: Kỷ luật
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-emerald-700">
                    {b.hasDisciplineViolation ? 'CÓ VI PHẠM' : '0% VI PHẠM'}
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 pt-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Không có SV vi phạm quy chế</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Thông tin Hành chính & BCH Chi hội 05 đồng chí */}
            <div className="bg-white border border-slate-200">
              <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider font-eiu-display">
                Thông tin Hành chính &amp; Ban Chấp hành Chi hội
              </div>
              <div className="divide-y divide-slate-200 text-[13.5px]">
                <div className="grid grid-cols-1 sm:grid-cols-12 p-4 gap-1">
                  <div className="sm:col-span-4 font-bold text-slate-900">
                    Mã định danh &amp; Khóa:
                  </div>
                  <div className="sm:col-span-8 font-mono font-bold text-[#133F68]">
                    {b.code} • Khóa tuyển sinh 20{b.cohortYear} ({b.totalMembers}{' '}
                    hội viên)
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 p-4 gap-1">
                  <div className="sm:col-span-4 font-bold text-slate-900">
                    Cụm Khoa trực thuộc:
                  </div>
                  <div className="sm:col-span-8 text-slate-800">
                    <strong>{facultyMeta.nameVi}</strong> ({facultyMeta.nameEn})
                    — {facultyMeta.officeRoom}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 p-4 gap-1">
                  <div className="sm:col-span-4 font-bold text-slate-900">
                    Cụm trưởng phụ trách:
                  </div>
                  <div className="sm:col-span-8 text-slate-800">
                    <strong className="text-[#0054A6]">
                      {b.clusterLeaderName}
                    </strong>{' '}
                    ({b.clusterLeaderEmail})
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 p-4 gap-1">
                  <div className="sm:col-span-4 font-bold text-slate-900">
                    Cơ cấu BCH Chi hội:
                  </div>
                  <div className="sm:col-span-8 text-slate-800 space-y-1">
                    <div>
                      <strong>05 đồng chí</strong> (01 Chi hội trưởng, 02 Chi
                      hội phó, 02 Ủy viên BCH Chi hội)
                    </div>
                    {b.branchPresidentName && (
                      <div className="text-xs text-[#133F68] font-semibold">
                        • Chi hội trưởng: Đ/c {b.branchPresidentName}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Đề xuất Sinh hoạt Chuyên đề / Hỗ trợ Sơ duyệt SV5T Chi hội */}
            <div className="bg-white border border-slate-200">
              <div className="bg-[#133F68] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider font-eiu-display">
                Liên hệ BCH {b.name} &amp; Đăng ký Hỗ trợ Hồ sơ SV5T Cấp 1
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setFormSubmitted(true);
                }}
                className="p-5 space-y-4 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <span className="sm:col-span-4 font-bold text-slate-900">
                    Hội viên gửi yêu cầu:
                  </span>
                  <div className="sm:col-span-8 bg-[#F8FAFC] border border-slate-200 px-3 py-2 text-slate-800">
                    <strong>{currentPersona.fullName}</strong> (
                    {currentPersona.studentId}) — {currentPersona.email}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 items-start gap-2">
                  <label
                    htmlFor="branch-note"
                    className="sm:col-span-4 font-bold text-slate-900 pt-2"
                  >
                    Nội dung đề xuất / rà soát:
                  </label>
                  <div className="sm:col-span-8">
                    <textarea
                      id="branch-note"
                      rows={3}
                      required
                      value={reasonText}
                      onChange={(e) => setReasonText(e.target.value)}
                      placeholder="Nhập đề xuất hoạt động Chi hội hoặc yêu cầu BCH Chi hội sơ duyệt minh chứng SV5T Cấp 1..."
                      className="w-full p-2.5 border border-slate-300 rounded text-slate-900"
                    />
                  </div>
                </div>

                {formSubmitted && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold">
                    ✓ Đã gửi thông tin tới BCH {b.name} và Cụm trưởng{' '}
                    {b.clusterLeaderName}.
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <Link
                    href={`/to-chuc?tab=branches&faculty=${b.facultyCode}`}
                    className="inline-flex items-center gap-1 text-slate-600 hover:text-[#133F68] font-semibold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Danh sách Chi hội {facultyMeta.shortCode}</span>
                  </Link>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0054A6] hover:bg-[#133F68] text-white rounded text-xs font-bold uppercase tracking-wider cursor-pointer font-eiu-display"
                  >
                    Gửi BCH Chi hội
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* CỘT PHẢI (4/12): Thông tin Cụm Khoa & Các Chi hội Cùng Khoa */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-[#C10230] text-white p-6 space-y-2.5">
              <div className="w-8 h-0.5 bg-white" aria-hidden="true" />
              <h2 className="text-base font-bold font-eiu-display">
                Cụm {facultyMeta.nameVi}
              </h2>
              <p className="text-xs text-white/92 leading-relaxed">
                {facultyMeta.clusterLeaderRole}:{' '}
                <strong>{facultyMeta.clusterLeaderName}</strong>.
              </p>
              <div className="text-xs text-[#DED1BE] pt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Văn phòng Khoa: {facultyMeta.officeRoom} ({facultyMeta.email})
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200">
              <div className="bg-[#133F68] text-white px-4 py-3 text-xs font-bold uppercase tracking-wider font-eiu-display">
                Các Chi hội Cùng Cụm {facultyMeta.shortCode}
              </div>
              <div className="divide-y divide-slate-200">
                {siblingBranches.map((sb) => (
                  <Link
                    key={sb.id}
                    href={`/to-chuc/${sb.slug}`}
                    className="p-3.5 flex items-center justify-between gap-2 hover:bg-[#F5F5F5] transition-colors group"
                  >
                    <div>
                      <div className="text-xs font-mono font-bold text-[#133F68] group-hover:text-[#C10230]">
                        {sb.code} — Khóa 20{sb.cohortYear}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {sb.totalMembers} HV • Đạt SV5T: {sb.sv5tAchievedRate}%
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function UnitMicrositePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1140px] mx-auto px-4 py-16 text-center text-sm text-slate-500">
          Đang tải hồ sơ cơ sở Hội...
        </div>
      }
    >
      <UnitMicrositeInner params={params} />
    </Suspense>
  );
}
