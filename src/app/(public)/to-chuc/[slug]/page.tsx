'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BRANCH_UNITS, CLUB_UNITS, EVENT_ITEMS } from '@/data/mock-data';
import { useRole } from '@/context/role-context';
import {
  ArrowLeft,
  Award,
  Building2,
  CheckCircle2,
  ExternalLink,
  Send,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';

function UnitMicrositeInner() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || '';
  const { currentPersona } = useRole();

  const club = CLUB_UNITS.find((c) => c.slug === slug);
  const branch = BRANCH_UNITS.find((b) => b.slug === slug);

  const [applySubmitted, setApplySubmitted] = useState(false);
  const [reasonText, setReasonText] = useState('');

  if (!club && !branch) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#0B2545]">Không tìm thấy đơn vị</h1>
        <Link
          href="/to-chuc"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0054A6] text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại Danh bạ 25 Chi hội & 30 CLB
        </Link>
      </div>
    );
  }

  const title = club ? club.name : branch!.name;
  const code = club ? club.code : branch!.code;
  const description = club ? club.description : branch!.description;

  return (
    <div className="space-y-10 pb-16">
      {/* Banner Micro-site */}
      <section className="bg-gradient-to-r from-[#0B2545] to-[#0054A6] text-white py-10 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link
            href="/to-chuc"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-200 hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Quay lại Danh bạ Tổ chức / CLB / Đội / Nhóm
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-white/15 text-xs font-mono font-bold">
              Mã đơn vị: {code}
            </span>
            {club?.isCoreUnionUnit && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 text-xs font-extrabold">
                <Sparkles className="w-3.5 h-3.5" />
                Đơn vị nòng cốt của Hội Sinh viên Trường
              </span>
            )}
            {branch && (
              <span className="px-2.5 py-0.5 rounded bg-sky-500/30 text-sky-100 text-xs font-semibold">
                {branch.facultyName} • Cụm thi đua Khóa 20{branch.cohortYear}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{title}</h1>
          <p className="text-sm text-slate-200 max-w-3xl leading-relaxed">{description}</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 cols: Structure & Activities */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-[#0B2545] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0054A6]" />
              Cơ cấu Tổ chức Đơn vị (Chuẩn 05 Đồng chí)
            </h2>

            {club ? (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#F0F7FF] border border-sky-200">
                    <span className="text-[10px] font-bold uppercase text-[#0054A6]">
                      01 {club.unitType === 'team' ? 'Đội trưởng' : 'Chủ nhiệm'}
                    </span>
                    <p className="text-sm font-bold text-[#0B2545] mt-0.5">
                      {club.presidentName || 'Ban Chủ nhiệm CLB'}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-500">
                      02 Phó Chủ nhiệm & 02 Ủy viên BCN
                    </span>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">
                      {club.vicePresidentName || 'Ban Điều hành chuyên môn'}
                    </p>
                  </div>
                </div>

                {club.mentorName && (
                  <p className="text-slate-600 pt-1">
                    • Đơn vị / Giảng viên cố vấn (Mentor):{' '}
                    <strong className="text-slate-900">{club.mentorName}</strong> (Hỗ trợ ký xác
                    nhận sinh hoạt thường xuyên xét tiêu chí Học tập tốt / Thể lực tốt / Tình nguyện
                    tốt SV5T).
                  </p>
                )}

                {club.linkedToTgptMovement && club.managedSubteams && (
                  <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
                    <p className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Zap className="w-4 h-4" />
                      Đơn vị gắn kết trực tiếp với Mảng Phong trào (Ban Tuyên giáo - Phong trào)
                    </p>
                    <p className="text-slate-300">
                      Trực tiếp quản lý và điều phối lực lượng cho 02 Tiểu ban cấp trường:
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {club.managedSubteams.map((st) => (
                        <span
                          key={st}
                          className="px-3 py-1 rounded-lg bg-white/10 border border-white/15 font-semibold"
                        >
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 space-y-2">
                  <p className="font-bold text-slate-800">Hoạt động trọng tâm & Quyền lợi Hội viên:</p>
                  <ul className="space-y-1.5 text-slate-600">
                    {club.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {club.fanpageUrl && (
                  <div className="pt-2">
                    <a
                      href={club.fanpageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold"
                    >
                      Truy cập Fanpage chính thức <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#F0F7FF] border border-sky-200">
                    <span className="text-[10px] font-bold uppercase text-[#0054A6]">
                      01 Chi hội trưởng
                    </span>
                    <p className="text-sm font-bold text-[#0B2545] mt-0.5">
                      {branch!.branchPresidentName || `Chi hội trưởng ${branch!.code}`}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-500">
                      Cụm trưởng phụ trách (Ban TC-XDH)
                    </span>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">
                      {branch!.clusterLeaderName}
                    </p>
                  </div>
                </div>
                <p className="text-slate-600">
                  • Chỉ tiêu Tập thể Sinh viên 5 Tốt: <strong>{branch!.sv5tRegisteredRate}%</strong>{' '}
                  hội viên đăng ký phấn đấu • <strong>{branch!.sv5tAchievedRate}%</strong> hội viên
                  đạt danh hiệu SV5T cấp trường.
                </p>
              </div>
            )}
          </div>

          {/* Sự kiện liên quan */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
            <h2 className="text-base font-bold text-[#0B2545]">
              Sự kiện & Chương trình phối hợp gần đây
            </h2>
            <div className="space-y-2.5">
              {EVENT_ITEMS.slice(0, 2).map((evt) => (
                <div
                  key={evt.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <p className="font-bold text-[#0B2545]">{evt.title}</p>
                    <p className="text-slate-500 mt-0.5">
                      {evt.organizerUnit} • +{evt.baseVolunteerDays} ngày tình nguyện
                    </p>
                  </div>
                  <Link
                    href="/su-kien"
                    className="px-3 py-1.5 rounded-lg bg-[#0054A6] text-white font-semibold shrink-0"
                  >
                    Chi tiết
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 cols: Form Đăng ký Tuyển Thành viên / CTV */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 sticky top-24">
            <div className="border-b border-slate-200 pb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Đăng ký 1-Click bằng Hồ sơ @eiu.edu.vn
              </span>
              <h2 className="text-base font-bold text-[#0B2545] mt-1.5">
                Đăng Ký Tham Gia / Tuyển Cộng Tác Viên
              </h2>
            </div>

            {applySubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
                <p className="font-bold flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Đã ghi nhận hồ sơ đăng ký!
                </p>
                <p>
                  Thông tin của <strong>{currentPersona.fullName}</strong> (
                  <code className="font-mono">{currentPersona.studentId}</code>) đã được chuyển tới
                  Ban Chủ nhiệm <strong>{title}</strong> và Phó Ban TC-XDH phụ trách Cụm.
                </p>
                <button
                  type="button"
                  onClick={() => setApplySubmitted(false)}
                  className="text-xs font-bold text-[#0054A6] underline cursor-pointer"
                >
                  Gửi lại phản hồi khác
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setApplySubmitted(true);
                }}
                className="space-y-3 text-xs"
              >
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-slate-600">
                  <p>
                    Họ và tên: <strong className="text-slate-900">{currentPersona.fullName}</strong>
                  </p>
                  <p>
                    MSSV: <code className="font-mono text-slate-900">{currentPersona.studentId}</code>{' '}
                    • Khoa: <strong>{currentPersona.facultyCode}</strong>
                  </p>
                  <p>
                    Email: <code className="font-mono text-[#0054A6]">{currentPersona.email}</code>
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Vị trí / Tiểu ban mong muốn ứng tuyển:
                  </label>
                  <select className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white">
                    <option>Thành viên chính thức / Hội viên sinh hoạt định kỳ</option>
                    <option>Cộng tác viên Truyền thông (Design / Photo / Video)</option>
                    <option>Cộng tác viên Hậu cần - Sự kiện - Lễ tân</option>
                    <option>Cộng tác viên Nội dung - Học thuật - Đối ngoại</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Giới thiệu ngắn gọn kỹ năng & định hướng phấn đấu SV5T:
                  </label>
                  <textarea
                    rows={3}
                    value={reasonText}
                    onChange={(e) => setReasonText(e.target.value)}
                    placeholder="Chia sẻ nguyện vọng tham gia CLB/Đội/Chi hội..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0054A6]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0054A6] hover:bg-[#004282] text-white font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Gửi Đăng Ký Gia Nhập Đơn Vị
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UnitMicrositePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-slate-500">
          Đang tải thông tin Micro-site đơn vị...
        </div>
      }
    >
      <UnitMicrositeInner />
    </Suspense>
  );
}
