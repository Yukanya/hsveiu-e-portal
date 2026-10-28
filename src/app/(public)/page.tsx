import React from 'react';
import Link from 'next/link';
import {
  BRANCH_UNITS,
  CLUB_UNITS,
  EVENT_ITEMS,
  FACULTY_METADATA,
  NEWS_POSTS,
  OFFICIAL_DOCUMENTS,
  STAFF_MEMBERS,
} from '@/data/mock-data';
import {
  Award,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  GraduationCap,
  HeartHandshake,
  LayoutDashboard,
  Leaf,
  MapPin,
  Network,
  QrCode,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

export default function HomePage() {
  const featuredClubs = CLUB_UNITS.slice(0, 6);
  const btkMembers = STAFF_MEMBERS.filter((m) => m.isBtkMember);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO BANNER - CLEAN CORPORATE & E-GOV FIRST */}
      <section className="relative bg-gradient-to-br from-[#0B2545] via-[#133B5C] to-[#0054A6] text-white overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Hero Left */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-sky-200">
                <ShieldCheck className="w-4 h-4 text-sky-300" />
                <span>Đại hội Đại biểu HSV Trường ĐHQTMĐ Khóa II, Nhiệm kỳ 2026 – 2028</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight leading-tight">
                Cổng Thông Tin Điện Tử & Hệ Thống Điều Hành Số{' '}
                <span className="text-sky-300">Hội Sinh Viên EIU</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
                Nền tảng quản trị tập trung kết nối toàn thể Sinh viên, 25 Chi hội thuộc 04 Khoa, 30
                Câu lạc bộ/Đội/Nhóm và 03 Ban Chuyên môn. Số hóa toàn diện quy trình Xét chọn{' '}
                <strong className="text-white">"Sinh viên 5 Tốt"</strong> (QĐ 09/QĐ-HSV), cấp{' '}
                <strong className="text-white">E-Certificate & Ngày tình nguyện</strong> (QĐ
                28/QĐ-HSV) và <strong className="text-white">Văn phòng điện tử 206.B06</strong>.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/portal"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#0B2545] font-bold text-xs sm:text-sm shadow-sm hover:bg-sky-50 transition-all"
                >
                  <GraduationCap className="w-4 h-4 text-[#0054A6]" />
                  Sổ tay Sinh viên 5 Tốt
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/to-chuc"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0054A6] hover:bg-[#0284C7] text-white font-semibold text-xs sm:text-sm border border-sky-400/30 transition-all"
                >
                  <Building2 className="w-4 h-4" />
                  Danh bạ 25 Chi hội & 30 CLB
                </Link>
                <Link
                  href="/gioi-thieu"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all"
                >
                  <Network className="w-4 h-4 text-sky-300" />
                  Sơ đồ Tổ chức & Nhân sự
                </Link>
              </div>
            </div>

            {/* Hero Right: Institutional Metrics & Quick Actions */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/20 space-y-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
                      Hệ thống Tổ chức Bộ máy Khóa II
                    </p>
                    <h2 className="text-base font-bold text-white">
                      Thống kê Toàn mạng lưới HSV EIU
                    </h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-[11px] font-semibold">
                    Trực tuyến 24/7
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/gioi-thieu"
                    className="p-3.5 rounded-xl bg-slate-900/50 hover:bg-slate-900/75 border border-white/10 transition-colors"
                  >
                    <p className="text-2xl font-extrabold font-mono text-white">15 / 05 / 05</p>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Ủy viên BCH • Ban Thư ký • Ban Kiểm tra
                    </p>
                  </Link>
                  <Link
                    href="/gioi-thieu#khoi-ban-chuyen-mon"
                    className="p-3.5 rounded-xl bg-slate-900/50 hover:bg-slate-900/75 border border-white/10 transition-colors"
                  >
                    <p className="text-2xl font-extrabold font-mono text-sky-300">03 Ban & 08 TB</p>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Văn phòng • Ban TC-XDH • Ban TG-PT
                    </p>
                  </Link>
                  <Link
                    href="/to-chuc?tab=branches"
                    className="p-3.5 rounded-xl bg-slate-900/50 hover:bg-slate-900/75 border border-white/10 transition-colors"
                  >
                    <p className="text-2xl font-extrabold font-mono text-amber-300">25 Chi hội</p>
                    <p className="text-xs text-slate-300 mt-0.5">
                      04 Cụm Khoa (QTKD, KT, CNTT, KHSK) • 06 Khóa
                    </p>
                  </Link>
                  <Link
                    href="/to-chuc?tab=clubs"
                    className="p-3.5 rounded-xl bg-slate-900/50 hover:bg-slate-900/75 border border-white/10 transition-colors"
                  >
                    <p className="text-2xl font-extrabold font-mono text-emerald-300">
                      30 CLB / Đội
                    </p>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Học thuật • Nghệ thuật • Thể thao • Cộng đồng
                    </p>
                  </Link>
                </div>

                {/* Quick Utility Links */}
                <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <Link
                    href="/tra-cuu-gcn"
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-sky-300" />
                      Xác thực E-Certificate
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/workspace"
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-amber-100 font-medium transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4 text-amber-300" />
                      Bàn làm việc Cán bộ Hội
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THƯỜNG TRỰC BAN THƯ KÝ & 04 CỤM HOẠT ĐỘNG KHOA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0054A6]">
              Cơ quan điều hành thường trực (Quyết định 23/QĐ-HSV & 04/TB-HSV)
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B2545] mt-1">
              Ban Thư Ký Hội Sinh Viên Trường Khóa II (05 Đồng chí)
            </h2>
          </div>
          <Link
            href="/gioi-thieu"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0054A6] hover:underline"
          >
            Xem toàn bộ Sơ đồ Tổ chức & 20 Nhân sự chủ chốt
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {btkMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      member.bchRole === 'Chủ tịch'
                        ? 'bg-[#0B2545] text-amber-300'
                        : 'bg-[#F0F7FF] text-[#0054A6] border border-sky-200'
                    }`}
                  >
                    {member.bchRole}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{member.facultyCode}</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#0B2545]">{member.fullName}</h3>
                  <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                    MSSV: {member.studentId}
                  </p>
                </div>

                <p className="text-xs text-slate-700 font-medium leading-snug">
                  {member.internalDeptRole}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                {member.grassrootsRole !== 'Không' && (
                  <p className="text-slate-600 font-medium truncate" title={member.grassrootsRole}>
                    • {member.grassrootsRole}
                  </p>
                )}
                <p className="font-mono text-[10px] text-[#0054A6] truncate">{member.email}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 4 Cụm hoạt động theo Khoa */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {(['BBS', 'SET', 'CIT', 'SNS'] as const).map((fCode) => {
            const meta = FACULTY_METADATA[fCode];
            const countBranches = BRANCH_UNITS.filter((b) => b.facultyCode === fCode).length;
            return (
              <Link
                key={fCode}
                href={`/to-chuc?tab=branches&faculty=${fCode}`}
                className="bg-white rounded-xl p-4 border border-slate-200 hover:border-[#0054A6] transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${meta.badgeClass}`}
                  >
                    Cụm {meta.shortCode} ({fCode})
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {countBranches} Chi hội (K21–K26)
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#0B2545] group-hover:text-[#0054A6] transition-colors">
                  {meta.nameVi}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{meta.nameEn}</p>
                <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-600">
                  <p>
                    Cụm trưởng: <strong className="text-slate-900">{meta.clusterLeaderName}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Văn phòng Khoa: {meta.officeRoom}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. SỰ KIỆN & QUY TRÌNH NGÀY TÌNH NGUYỆN (CHUẨN QĐ 28/QĐ-HSV) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0054A6]">
              Đăng ký 1-Click • Check-in QR Động • Cấp E-Certificate (QĐ 28/QĐ-HSV)
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B2545] mt-1">
              Sự Kiện & Hoạt Động Phong Trào Trọng Điểm
            </h2>
          </div>
          <Link
            href="/su-kien"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0054A6] hover:underline"
          >
            Xem toàn bộ Sự kiện & Quy định quy đổi ngày tình nguyện
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {EVENT_ITEMS.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#F0F7FF] text-[#0054A6] border border-sky-200">
                    Tiêu chí: {evt.sv5tCriterion}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {evt.isGreenEvent && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Leaf className="w-3 h-3" />
                        Sự kiện Xanh (Không chai nhựa)
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      +{evt.baseVolunteerDays} ngày TN gốc
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#0B2545] leading-snug">{evt.title}</h3>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <p className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-[#0054A6] shrink-0" />
                    <span>
                      Đơn vị tổ chức: <strong className="text-slate-900">{evt.organizerUnit}</strong>
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{evt.location}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {new Date(evt.startTime).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs">
                  {evt.preApprovalStatus === 'approved_3days_prior' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Đã duyệt chủ trương quy đổi TN (Trước 03 ngày)
                    </span>
                  ) : (
                    <span className="text-amber-700 font-semibold">
                      ⏳ Đang trình Trưởng Ban TC-XDH duyệt quy đổi TN
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">
                    {evt.registeredCount}/{evt.maxParticipants} SV
                  </span>
                  <Link
                    href="/su-kien"
                    className="px-3.5 py-1.5 rounded-lg bg-[#0054A6] hover:bg-[#004282] text-white text-xs font-semibold transition-colors"
                  >
                    Đăng ký 1-Click
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DANH MỤC 30 CÂU LẠC BỘ / ĐỘI / NHÓM TIÊU BIỂU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0054A6]">
              Khối Cơ sở Hội trực thuộc • 04 Nhóm lĩnh vực
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B2545] mt-1">
              Hệ Sinh Thái 30 Câu Lạc Bộ, Đội, Nhóm Sinh Viên EIU
            </h2>
          </div>
          <Link
            href="/to-chuc?tab=clubs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0054A6] hover:underline"
          >
            Khám phá toàn bộ 30 CLB / Đội / Nhóm
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredClubs.map((club) => (
            <Link
              key={club.id}
              href={`/to-chuc/${club.slug}`}
              className="bg-white rounded-xl p-5 border border-slate-200 hover:border-[#0054A6] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                    {club.categoryLabel}
                  </span>
                  {club.isCoreUnionUnit && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Đơn vị nòng cốt của Hội
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-[#0B2545] group-hover:text-[#0054A6] transition-colors">
                  {club.name}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {club.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600">
                  {club.unitType === 'team' ? 'Đội trưởng:' : 'Chủ nhiệm:'}{' '}
                  <strong className="text-slate-900">{club.presidentName || 'Ban Chủ nhiệm'}</strong>
                </span>
                <span className="font-semibold text-[#0054A6] inline-flex items-center gap-1">
                  Micro-site <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. TIN TỨC & KHO VĂN BẢN PHÁP LÝ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Tin tức truyền thông */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-[#0B2545] flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-[#0054A6]" />
                Bản Tin Công Tác Hội & Phong Trào Sinh Viên
              </h2>
            </div>

            <div className="space-y-3">
              {NEWS_POSTS.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl p-4 border border-slate-200 hover:border-sky-300 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#0054A6]">{post.categoryLabel}</span>
                    <span className="text-slate-400 font-mono">{post.publishedAt}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0B2545] leading-snug">{post.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{post.summary}</p>
                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Đăng bởi: {post.authorUnit}</span>
                    <span>{post.viewCount.toLocaleString('vi-VN')} lượt xem</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Văn bản - Quy chế */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-[#0B2545] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0054A6]" />
                Văn Bản Chỉ Đạo & Quy Chế Khóa II
              </h2>
              <Link href="/van-ban" className="text-xs font-bold text-[#0054A6] hover:underline">
                Xem tất cả
              </Link>
            </div>

            <div className="space-y-3">
              {OFFICIAL_DOCUMENTS.map((doc) => (
                <Link
                  key={doc.id}
                  href="/van-ban"
                  className="block bg-white rounded-xl p-4 border border-slate-200 hover:border-[#0054A6] transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-[#0B2545] text-white font-mono text-[11px] font-bold">
                      Số: {doc.documentNumber}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Ngày ký: {doc.signedDate}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {doc.title}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Người ký: <strong className="text-slate-700">{doc.signerName}</strong> (
                    {doc.signerTitle})
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
