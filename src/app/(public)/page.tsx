import React from 'react';
import Link from 'next/link';
import {
  BRANCH_UNITS,
  CLUB_UNITS,
  EVENT_ITEMS,
  FACULTY_METADATA,
  NEWS_POSTS,
  OFFICIAL_DOCUMENTS,
} from '@/data/mock-data';
import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  GraduationCap,
  MapPin,
  Network,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

const SV5T_CRITERIA_SUMMARY = [
  {
    code: 'dao-duc',
    title: 'Đạo đức tốt',
    benchmark: 'ĐRL ≥ 80/100',
    mandatoryRule:
      'Điểm rèn luyện trung bình cả năm học đạt từ 80/100 điểm trở lên; không vi phạm pháp luật và quy chế.',
    plusRule: 'Tham gia thi tìm hiểu Mác - Lênin, Tư tưởng Hồ Chí Minh.',
  },
  {
    code: 'hoc-tap',
    title: 'Học tập tốt',
    benchmark: 'GPA ≥ 2.7/4.0',
    mandatoryRule:
      'Điểm trung bình chung năm học (bình quân 3 học kỳ Quý EIU) ≥ 2.7/4.0 và có ít nhất 01 bài tham luận / đề tài NCKH.',
    plusRule: 'Đạt giải cuộc thi học thuật cấp Khoa/Trường trở lên.',
  },
  {
    code: 'the-luc',
    title: 'Thể lực tốt',
    benchmark: 'SV Khỏe (PL1)',
    mandatoryRule:
      'Đạt danh hiệu "Sinh viên Khỏe" cấp Trường trở lên (vượt 3/4 nội dung sát hạch) hoặc tham gia Hội thao.',
    plusRule: 'Thành viên CLB Thể thao hoặc đạt giải Hội thao các cấp.',
  },
  {
    code: 'tinh-nguyen',
    title: 'Tình nguyện tốt',
    benchmark: '≥ 5.0 ngày/năm',
    mandatoryRule:
      'Tham gia ít nhất 05 ngày tình nguyện/năm (tính theo bảng quy đổi hệ số 1 – 2 – 3 tại Phụ lục 2 QĐ 09).',
    plusRule: 'Được khen thưởng trong chiến dịch Mùa hè xanh, Xuân tình nguyện.',
  },
  {
    code: 'hoi-nhap',
    title: 'Hội nhập tốt',
    benchmark: 'B1 + Kỹ năng PL3',
    mandatoryRule:
      'Đạt trình độ ngoại ngữ B1 (hoặc hoàn thành 02 khóa ngoại ngữ EIU) + 01 khóa Kỹ năng (Phụ lục 3) + 01 hoạt động Hội nhập.',
    plusRule: 'Tham gia giao lưu quốc tế và đạt giải cuộc thi Tiếng Anh.',
  },
];

export default function HomePage() {
  const facultyList = (['BBS', 'SET', 'CIT', 'SNS'] as const).map((code) => {
    const meta = FACULTY_METADATA[code];
    const branches = BRANCH_UNITS.filter((b) => b.facultyCode === code);
    const totalStudents = branches.reduce((acc, b) => acc + b.totalMembers, 0);
    return {
      ...meta,
      branchCount: branches.length,
      totalStudents,
    };
  });

  return (
    <div>
      {/* 1. HERO SECTION — Đồng bộ chuẩn màu #133F68 & #A68556 của https://eiu.edu.vn/ */}
      <section
        aria-labelledby="hero-heading"
        className="bg-[#133F68] text-white border-b-4 border-[#A68556]"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Cột trái: Thông điệp định danh */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-[#DED1BE]">
                <ShieldCheck className="w-4 h-4 text-[#FCB900] shrink-0" />
                <span>Hội Sinh viên Việt Nam Trường ĐH Quốc tế Miền Đông • Khóa II (2026 – 2028)</span>
              </div>

              <h1
                id="hero-heading"
                className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-[1.2] font-eiu-display"
              >
                Cổng Thông Tin Điện Tử &amp;{' '}
                <span className="text-[#FCB900]">Hệ Sinh Thái Sinh Viên EIU</span>
              </h1>

              <p className="text-base sm:text-lg text-[#DED1BE] leading-relaxed max-w-2xl">
                Nền tảng số chính thức phục vụ hội viên, sinh viên 04 Khoa, 25 Chi hội và 30 Câu lạc bộ – Đội – Nhóm: Theo dõi lộ trình <strong className="text-white">Sinh viên 5 Tốt</strong>, đăng ký hoạt động tình nguyện và xác thực <strong className="text-white">Giấy chứng nhận điện tử QR</strong>.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/portal"
                  className="min-h-12 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#A68556] hover:bg-[#8f7146] text-white font-bold text-sm shadow-sm transition-colors"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>Mở Sổ Tay Sinh Viên 5 Tốt</span>
                </Link>

                <Link
                  href="/tra-cuu-gcn"
                  className="min-h-12 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#133F68] hover:bg-slate-100 font-bold text-sm shadow-sm transition-colors"
                >
                  <QrCode className="w-5 h-5 text-[#0054A6]" />
                  <span>Tra Cứu E-Certificate</span>
                </Link>
              </div>
            </div>

            {/* Cột phải: 4 Chỉ số Cốt lõi (Thiết kế tối giản, độ tương phản cao theo Apple HIG) */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-6 border border-white/15 space-y-5">
                <div className="flex items-center justify-between border-b border-white/15 pb-3.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#DED1BE] font-eiu-display">
                    Quy mô Tổ chức Khóa II
                  </span>
                  <span className="text-xs font-mono font-semibold text-[#FCB900]">
                    Phòng 206.B06
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#0D2E4D]/80 border border-white/10">
                    <div className="text-3xl font-extrabold font-mono text-white">
                      {BRANCH_UNITS.length}
                    </div>
                    <div className="text-sm font-semibold text-[#DED1BE] mt-1">
                      Chi hội trực thuộc
                    </div>
                    <div className="text-xs text-white/75 mt-0.5">
                      04 Cụm Khoa • 06 Khóa
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0D2E4D]/80 border border-white/10">
                    <div className="text-3xl font-extrabold font-mono text-[#FCB900]">
                      {CLUB_UNITS.length}
                    </div>
                    <div className="text-sm font-semibold text-[#DED1BE] mt-1">
                      CLB • Đội • Nhóm
                    </div>
                    <div className="text-xs text-white/75 mt-0.5">
                      04 Khối lĩnh vực hoạt động
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0D2E4D]/80 border border-white/10">
                    <div className="text-3xl font-extrabold font-mono text-white">
                      05
                    </div>
                    <div className="text-sm font-semibold text-[#DED1BE] mt-1">
                      Tiêu chuẩn SV5T
                    </div>
                    <div className="text-xs text-white/75 mt-0.5">
                      Theo Quyết định 09/QĐ-HSV
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0D2E4D]/80 border border-white/10">
                    <div className="text-3xl font-extrabold font-mono text-emerald-300">
                      ≤07
                    </div>
                    <div className="text-sm font-semibold text-[#DED1BE] mt-1">
                      Ngày làm việc (SLA)
                    </div>
                    <div className="text-xs text-white/75 mt-0.5">
                      Cấp GCN điện tử (QĐ 28)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LỐI TẮT DỊCH VỤ TRỌNG TÂM — Nền trắng #FFFFFF chuẩn eiu.edu.vn */}
      <section
        aria-labelledby="services-heading"
        className="bg-white py-14 border-b border-slate-200/80"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="w-12 h-1 bg-[#A68556] mb-3 rounded-full" aria-hidden="true" />
              <h2
                id="services-heading"
                className="text-2xl sm:text-3xl font-extrabold text-[#133F68] font-eiu-display"
              >
                Tiện Ích Số Dành Cho Sinh Viên &amp; Cơ Sở Hội
              </h2>
            </div>
            <p className="text-sm text-slate-600 max-w-md">
              Truy cập nhanh 04 phân hệ cốt lõi được thiết kế tinh gọn, rõ ràng theo đúng nhu cầu tra cứu hàng ngày.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                href: '/portal',
                title: 'Hồ Sơ & Sổ Tay SV5T',
                desc: 'Theo dõi 5 tiêu chuẩn Sinh viên 5 Tốt và tự động tính GPA bình quân 3 học kỳ Quý EIU.',
                icon: GraduationCap,
                cta: 'Mở hồ sơ cá nhân',
              },
              {
                href: '/tra-cuu-gcn',
                title: 'Tra Cứu E-Certificate',
                desc: 'Xác thực Giấy chứng nhận điện tử bằng mã QR gắn liền với Quyết định công nhận của BTK.',
                icon: QrCode,
                cta: 'Kiểm tra chứng nhận',
              },
              {
                href: '/to-chuc',
                title: '25 Chi Hội & 30 CLB',
                desc: 'Danh bạ đầy đủ các Chi hội thuộc 4 Khoa và 30 Câu lạc bộ, Đội, Nhóm sinh viên toàn trường.',
                icon: Building2,
                cta: 'Khám phá đơn vị',
              },
              {
                href: '/gioi-thieu',
                title: 'Sơ Đồ Tổ Chức Bộ Máy',
                desc: 'Cơ cấu Ban Chấp hành, Ban Thư ký, Ban Kiểm tra, Văn phòng 206.B06 và các Ban chuyên môn.',
                icon: Network,
                cta: 'Xem sơ đồ 3 cấp',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group bg-[#F5F5F5] hover:bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-[#133F68] hover:shadow-md transition-all flex flex-col justify-between gap-5"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[#133F68] text-white flex items-center justify-center group-hover:bg-[#A68556] transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#133F68] font-eiu-display">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0054A6] group-hover:translate-x-1 transition-transform">
                    <span>{item.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. PHONG TRÀO SINH VIÊN 5 TỐT & 04 CỤM KHOA — Nền #F5F5F5 chuẩn eiu.edu.vn */}
      <section
        aria-labelledby="sv5t-heading"
        className="bg-[#F5F5F5] py-16 border-b border-slate-200/80"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="w-12 h-1 bg-[#A68556] mb-3 rounded-full" aria-hidden="true" />
              <h2
                id="sv5t-heading"
                className="text-2xl sm:text-3xl font-extrabold text-[#133F68] font-eiu-display"
              >
                5 Tiêu Chuẩn &quot;Sinh Viên 5 Tốt&quot; (Quyết định 09/QĐ-HSV)
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Chuẩn hóa tiêu chí xét chọn cấp Trường và cơ chế lọc tối đa 10% &quot;Sinh viên 5 Tốt Tiêu biểu Toàn trường&quot;.
              </p>
            </div>
            <Link
              href="/portal"
              className="min-h-11 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#133F68] text-white text-xs font-bold hover:bg-[#0D2E4D] transition-colors shrink-0"
            >
              <span>Tự đánh giá tiêu chuẩn của bạn</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 5 Thẻ Tiêu chuẩn gọn gàng, dễ đọc */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {SV5T_CRITERIA_SUMMARY.map((item, idx) => (
              <div
                key={item.code}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-lg bg-[#133F68] text-white font-mono text-xs font-bold flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#0054A6] bg-blue-50 px-2.5 py-1 rounded-full">
                      {item.benchmark}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#133F68] font-eiu-display pt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.mandatoryRule}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-xs text-slate-700 font-medium">
                  <span className="text-[#A68556] font-bold">Điểm cộng:</span> {item.plusRule}
                </div>
              </div>
            ))}
          </div>

          {/* 04 Cụm Khoa trực thuộc Ban TC-XDH */}
          <div className="pt-2 space-y-4">
            <h3 className="text-lg font-bold text-[#133F68] font-eiu-display">
              04 Cụm Hoạt Động Chi Hội Theo Khoa (Quản lý bởi Ban Tổ chức và Xây dựng Hội)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {facultyList.map((f) => (
                <Link
                  key={f.code}
                  href={`/to-chuc?faculty=${f.code}`}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-[#133F68] transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#133F68] text-white font-mono">
                      Cụm {f.shortCode}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-600">
                      0{f.branchCount} Chi hội
                    </span>
                  </div>
                  <div className="text-base font-bold text-[#133F68] font-eiu-display">
                    {f.nameVi}
                  </div>
                  <div className="text-xs text-slate-600">
                    Cụm trưởng: <strong className="text-slate-900">{f.clusterLeaderName}</strong>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. SỰ KIỆN & HOẠT ĐỘNG TÌNH NGUYỆN — Nền trắng #FFFFFF */}
      <section
        aria-labelledby="events-heading"
        className="bg-white py-16 border-b border-slate-200/80"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="w-12 h-1 bg-[#A68556] mb-3 rounded-full" aria-hidden="true" />
              <h2
                id="events-heading"
                className="text-2xl sm:text-3xl font-extrabold text-[#133F68] font-eiu-display"
              >
                Sự Kiện &amp; Hoạt Động Quy Đổi Ngày Tình Nguyện
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Mọi hoạt động có tính ngày tình nguyện đều được thẩm định trước 03 ngày và cấp E-Certificate trong 07 ngày làm việc.
              </p>
            </div>
            <Link
              href="/su-kien"
              className="min-h-11 inline-flex items-center gap-1.5 text-sm font-bold text-[#0054A6] hover:text-[#133F68]"
            >
              <span>Xem tất cả {EVENT_ITEMS.length} chương trình</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EVENT_ITEMS.map((ev) => (
              <article
                key={ev.id}
                className="bg-[#F5F5F5] rounded-2xl p-6 border border-slate-200/90 flex flex-col justify-between gap-5"
              >
                <div className="space-y-3">
                  {/* Tối đa 2 nhãn trạng thái rõ ràng theo nguyên tắc Clarity của Apple */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#133F68] text-white">
                      Tiêu chuẩn: {ev.sv5tCriterion}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      +{ev.baseVolunteerDays.toFixed(1)} ngày tình nguyện
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#133F68] leading-snug font-eiu-display">
                    {ev.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#A68556] shrink-0" />
                      <span>
                        Thời gian:{' '}
                        <strong>
                          {new Date(ev.startTime).toLocaleDateString('vi-VN')}
                        </strong>{' '}
                        • Đơn vị: <strong>{ev.organizerUnit}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#A68556] shrink-0" />
                      <span>{ev.location}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-600 font-medium">
                    Đã đăng ký: <strong className="font-mono text-slate-900">{ev.registeredCount}/{ev.maxParticipants}</strong> SV
                  </span>
                  <Link
                    href="/su-kien"
                    className="min-h-10 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#133F68] hover:bg-[#0D2E4D] text-white text-xs font-bold transition-colors"
                  >
                    <span>Đăng ký tham gia</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TIN TỨC & VĂN BẢN CHỈ ĐẠO KHÓA II — Nền #F5F5F5 */}
      <section
        aria-labelledby="news-docs-heading"
        className="bg-[#F5F5F5] py-16"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Cột trái: Tin tức hoạt động */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-300 pb-3">
                <h2
                  id="news-docs-heading"
                  className="text-xl font-extrabold text-[#133F68] font-eiu-display"
                >
                  Bản Tin Hoạt Động Hội Sinh Viên
                </h2>
                <span className="text-xs font-semibold text-slate-600">
                  Cập nhật mới nhất
                </span>
              </div>

              <div className="space-y-4">
                {NEWS_POSTS.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/90 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="font-bold text-[#0054A6]">
                        {post.categoryLabel}
                      </span>
                      <span className="font-mono">{post.publishedAt}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#133F68] font-eiu-display">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {post.summary}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            {/* Cột phải: Kho Văn bản Pháp lý Khóa II */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-300 pb-3">
                <h2 className="text-xl font-extrabold text-[#133F68] font-eiu-display">
                  Văn Bản &amp; Quy Chế Khóa II
                </h2>
                <Link
                  href="/van-ban"
                  className="text-xs font-bold text-[#0054A6] hover:underline"
                >
                  Xem tất cả →
                </Link>
              </div>

              <div className="space-y-3">
                {OFFICIAL_DOCUMENTS.map((doc) => (
                  <Link
                    key={doc.id}
                    href="/van-ban"
                    className="block bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-[#133F68] transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded bg-[#133F68] text-white font-mono text-xs font-bold">
                        {doc.documentNumber}
                      </span>
                      <span className="text-xs font-mono text-slate-600">
                        Ngày ký: {doc.signedDate}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#133F68] leading-snug">
                      {doc.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Người ký: {doc.signerName} ({doc.signerTitle})</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
