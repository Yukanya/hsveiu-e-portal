'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SubpageBanner } from '@/components/public/subpage-banner';
import { BRANCH_UNITS, CLUB_UNITS } from '@/data/mock-data';
import { useRole } from '@/context/role-context';
import { ExternalLink } from 'lucide-react';

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
      <div className="max-w-[1140px] mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-xl font-bold text-[#133F68]">Không tìm thấy đơn vị</h1>
        <Link
          href="/to-chuc"
          className="inline-block px-5 py-2.5 bg-[#133F68] text-white text-xs font-bold"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const unitTitle = club ? club.name : branch!.name;

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <SubpageBanner
        title={unitTitle}
        breadcrumbs={[
          { label: 'Chi hội & CLB', href: '/to-chuc' },
          { label: unitTitle },
        ]}
      />

      {/* Bố cục chuẩn trang "Đặt phòng học" trên lib.eiu.edu.vn: Cột trái bảng thanh ngang #133F68, Cột phải khối Đỏ #C10230 */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI (8/12): Bảng thanh ngang #133F68 */}
          <div className="lg:col-span-8 bg-white border border-slate-200">
            <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold">
              Thông tin đơn vị
            </div>
            <div className="divide-y divide-slate-200 text-xs">
              <div className="grid grid-cols-12 p-3.5">
                <div className="col-span-4 font-bold text-slate-900">Tên đơn vị:</div>
                <div className="col-span-8 text-slate-800 font-semibold">
                  {unitTitle}
                </div>
              </div>
              <div className="grid grid-cols-12 p-3.5">
                <div className="col-span-4 font-bold text-slate-900">Mã định danh:</div>
                <div className="col-span-8 font-mono text-slate-700">
                  {club ? club.code : branch!.code}
                </div>
              </div>
              <div className="grid grid-cols-12 p-3.5">
                <div className="col-span-4 font-bold text-slate-900">Khối / Cụm Khoa:</div>
                <div className="col-span-8 text-slate-700">
                  {club ? club.categoryLabel : branch!.facultyName}
                </div>
              </div>
              <div className="grid grid-cols-12 p-3.5">
                <div className="col-span-4 font-bold text-slate-900">Nhân sự phụ trách:</div>
                <div className="col-span-8 text-slate-700">
                  {club
                    ? club.presidentName || 'Ban Chủ nhiệm (05 đ/c)'
                    : `${branch!.clusterLeaderName} (Cụm trưởng)`}
                </div>
              </div>
              <div className="grid grid-cols-12 p-3.5">
                <div className="col-span-4 font-bold text-slate-900">Quy mô thành viên:</div>
                <div className="col-span-8 font-mono text-slate-700">
                  {club ? `${club.memberCount} thành viên` : `${branch!.totalMembers} hội viên`}
                </div>
              </div>
              {club?.fanpageUrl && (
                <div className="grid grid-cols-12 p-3.5">
                  <div className="col-span-4 font-bold text-slate-900">Kênh truyền thông:</div>
                  <div className="col-span-8">
                    <a
                      href={club.fanpageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[#0054A6] font-semibold hover:underline"
                    >
                      <span>Mở Fanpage chính thức</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold">
              Mô tả hoạt động
            </div>
            <div className="p-4 text-xs text-slate-700 leading-relaxed">
              {club ? club.description : branch!.description}
            </div>

            <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold">
              Đăng ký tham gia / Liên hệ Ban Chủ nhiệm
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setApplySubmitted(true);
              }}
              className="p-4 space-y-3 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <label className="sm:col-span-4 font-bold text-slate-900">
                  Hội viên đăng ký:
                </label>
                <div className="sm:col-span-8 text-slate-700">
                  <strong>{currentPersona.fullName}</strong> ({currentPersona.studentId}) —{' '}
                  {currentPersona.email}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 items-start gap-2 pt-2 border-t border-slate-100">
                <label
                  htmlFor="apply-reason"
                  className="sm:col-span-4 font-bold text-slate-900 pt-1.5"
                >
                  Nguyện vọng tham gia:
                </label>
                <div className="sm:col-span-8">
                  <textarea
                    id="apply-reason"
                    rows={3}
                    value={reasonText}
                    onChange={(e) => setReasonText(e.target.value)}
                    placeholder="Vui lòng nhập ban chuyên môn hoặc nguyện vọng tham gia..."
                    className="w-full p-2.5 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
              </div>

              {applySubmitted && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold">
                  ✓ Đã ghi nhận thông tin đăng ký vào đơn vị {unitTitle}.
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Link
                  href="/to-chuc"
                  className="px-4 py-1.5 border border-slate-400 rounded text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Quay lại
                </Link>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#0D6EFD] hover:bg-blue-700 text-white rounded text-xs font-bold cursor-pointer"
                >
                  Lưu đăng ký
                </button>
              </div>
            </form>
          </div>

          {/* CỘT PHẢI (4/12): Khối Đỏ Đô #C10230 giống hệt "Thông tin đặt phòng" trên lib.eiu.edu.vn */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-[#C10230] text-white p-7">
              <div className="w-8 h-0.5 bg-white mb-3" aria-hidden="true" />
              <h2 className="text-lg font-bold leading-snug font-eiu-display">
                Thông tin cơ sở Hội
              </h2>
              <p className="text-xs text-white/90 mt-2 leading-relaxed">
                Mỗi Câu lạc bộ, Đội, Nhóm và Chi hội có 05 đồng chí trong Ban Chủ nhiệm / Ban Chấp hành trực tiếp điều hành.
              </p>
            </div>
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
        <div className="max-w-[1140px] mx-auto px-4 py-16 text-center text-xs text-slate-500">
          Đang tải thông tin đơn vị...
        </div>
      }
    >
      <UnitMicrositeInner />
    </Suspense>
  );
}
