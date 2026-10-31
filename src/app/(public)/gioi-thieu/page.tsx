'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SubpageBanner } from '@/components/public/subpage-banner';
import {
  BRANCH_UNITS,
  CLUB_UNITS,
  FACULTY_METADATA,
  STAFF_MEMBERS,
} from '@/data/mock-data';
import { StaffMember } from '@/types';
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  FileCheck2,
  GitBranch,
  Layers,
  Leaf,
  MapPin,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';

type OrgTabId =
  | 'overview'
  | 'chart'
  | 'btk'
  | 'bch'
  | 'bkt'
  | 'vp'
  | 'tcxdh'
  | 'tgpt';

interface OrgTabMeta {
  id: OrgTabId;
  group: 'DISCOVER' | 'APPARATUS';
  label: string;
  title: string;
  subtitle: string;
  badge?: string;
}

const ORG_TABS: OrgTabMeta[] = [
  {
    id: 'overview',
    group: 'DISCOVER',
    label: 'Tổng quan HSV EIU Khóa II',
    title: 'TỔNG QUAN HỘI SINH VIÊN VIỆT NAM TRƯỜNG ĐHQTMĐ KHÓA II (2026 – 2028)',
    subtitle:
      'Tổ chức chính trị – xã hội của sinh viên EIU, đồng hành rèn luyện Sinh viên 5 Tốt, học thuật, hội nhập quốc tế và phát triển bền vững.',
  },
  {
    id: 'chart',
    group: 'DISCOVER',
    label: 'Sơ đồ Tổ chức 3 Cấp',
    title: 'SƠ ĐỒ CƠ CẤU TỔ CHỨC BỘ MÁY HỘI SINH VIÊN TRƯỜNG KHÓA II (3 CẤP)',
    subtitle:
      'Mô hình phân cấp trực quan từ Ban Chấp hành, Ban Thư ký, Ban Kiểm tra đến 03 đơn vị chuyên môn và 55 cơ sở Hội trực thuộc.',
    badge: '3 CẤP',
  },
  {
    id: 'btk',
    group: 'APPARATUS',
    label: 'Ban Thư ký (05 đ/c)',
    title: 'BAN THƯ KÝ HỘI SINH VIÊN TRƯỜNG KHÓA II (05 ĐỒNG CHÍ)',
    subtitle:
      'Cơ quan thường trực điều hành công tác Hội và phong trào sinh viên toàn trường giữa hai kỳ họp Ban Chấp hành (23/QĐ-HSV).',
    badge: '05',
  },
  {
    id: 'bch',
    group: 'APPARATUS',
    label: 'Ban Chấp hành (15 đ/c)',
    title: 'BAN CHẤP HÀNH HỘI SINH VIÊN TRƯỜNG KHÓA II (15 ĐỒNG CHÍ)',
    subtitle:
      'Cơ quan lãnh đạo cao nhất của Hội Sinh viên trường nhiệm kỳ 2026 – 2028 gồm 01 Chủ tịch, 02 Phó Chủ tịch, 02 UV BTK và 10 UV BCH.',
    badge: '15',
  },
  {
    id: 'bkt',
    group: 'APPARATUS',
    label: 'Ban Kiểm tra (05 đ/c)',
    title: 'BAN KIỂM TRA HỘI SINH VIÊN TRƯỜNG KHÓA II (05 ĐỒNG CHÍ)',
    subtitle:
      'Cơ quan kiểm tra, giám sát việc thực hiện Điều lệ Hội, Nghị quyết Đại hội II và bảo vệ quyền lợi hợp pháp của hội viên, sinh viên.',
    badge: '05',
  },
  {
    id: 'vp',
    group: 'APPARATUS',
    label: 'Văn phòng Hội (206.B06)',
    title: 'VĂN PHÒNG HỘI SINH VIÊN TRƯỜNG — TRỤ SỞ PHÒNG 206.B06',
    subtitle:
      'Tham mưu hành chính, văn thư – lưu trữ, con dấu pháp lý và quản trị tài sản theo cơ chế đồng điều hành Đối ngoại – Nội bộ (24/QĐ-HSV).',
  },
  {
    id: 'tcxdh',
    group: 'APPARATUS',
    label: 'Ban Tổ chức & Xây dựng Hội',
    title: 'BAN TỔ CHỨC VÀ XÂY DỰNG HỘI — QUẢN LÝ 05 CỤM HOẠT ĐỘNG',
    subtitle:
      'Quản lý công tác cán bộ, hội viên, thẩm định chủ trương Ngày tình nguyện trước 03 ngày và điều phối 04 Cụm Khoa (25 Chi hội) cùng 30 CLB.',
  },
  {
    id: 'tgpt',
    group: 'APPARATUS',
    label: 'Ban Tuyên giáo – Phong trào',
    title: 'BAN TUYÊN GIÁO – PHONG TRÀO & ĐỘI CỘNG TÁC VIÊN XUNG KÍCH',
    subtitle:
      'Vận hành 02 mảng chuyên trách (Mảng Tuyên giáo & Mảng Phong trào), 06 tiểu ban trực thuộc và Đội CTV Xung kích quản lý 02 tiểu ban sự kiện.',
  },
];

function StaffCompactCard({
  member,
  roleHighlight,
  subLabel,
  featured = false,
  onSelect,
}: {
  member: StaffMember;
  roleHighlight: string;
  subLabel?: string;
  featured?: boolean;
  onSelect: (m: StaffMember) => void;
}) {
  const initials = member.fullName
    .split(' ')
    .slice(-2)
    .map((n) => n[0])
    .join('');
  const facultyMeta = FACULTY_METADATA[member.facultyCode];

  return (
    <button
      type="button"
      onClick={() => onSelect(member)}
      className={`w-full text-left bg-white border transition-colors cursor-pointer group flex items-start gap-4 p-4 ${
        featured
          ? 'border-2 border-[#133F68] shadow-2xs'
          : 'border-slate-200 hover:border-[#133F68]'
      }`}
    >
      {/* Huy hiệu Chân dung Cán bộ gọn, trang trọng (60px / 68px) */}
      <div
        className={`${
          featured ? 'w-17 h-17 text-lg' : 'w-14 h-14 text-base'
        } shrink-0 bg-[#133F68] eiu-arch-pattern text-white flex flex-col items-center justify-center relative border-b-3 border-[#A68556]`}
      >
        <span className="font-bold font-eiu-display tracking-wide group-hover:scale-105 transition-transform">
          {initials}
        </span>
        <span className="text-[9px] font-mono text-[#DED1BE] leading-none mt-0.5">
          {member.cohortYear ? `K${member.cohortYear}` : 'CTSV'}
        </span>
      </div>

      {/* Khối thông tin phân cấp rõ ràng */}
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider font-eiu-display ${
              featured
                ? 'bg-[#C10230] text-white'
                : 'bg-[#0054A6]/10 text-[#0054A6]'
            }`}
          >
            {roleHighlight}
          </span>
          {member.positions.length > 1 && (
            <span className="px-1.5 py-0.5 bg-[#EAE3D2] text-[#133F68] font-mono text-[10px] font-bold">
              {member.positions.length} vị trí
            </span>
          )}
        </div>

        <div
          className={`${
            featured ? 'text-base' : 'text-[14.5px]'
          } font-bold text-[#133F68] group-hover:text-[#C10230] transition-colors font-eiu-display`}
        >
          Đ/c {member.fullName}
        </div>

        <div className="text-xs text-slate-700 leading-snug line-clamp-2">
          {subLabel || member.internalDeptRole}
        </div>

        <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500 font-mono">
          <span>
            {member.studentId !== '-'
              ? `MSSV: ${member.studentId}`
              : 'Chuyên viên Phòng CTSV'}
          </span>
          <span>•</span>
          <span className="font-sans font-medium text-slate-600">
            {facultyMeta.shortCode} — {member.majorName}
          </span>
        </div>
      </div>
    </button>
  );
}

function GioiThieuContent({ initialTab }: { initialTab: OrgTabId }) {
  const [activeTab, setActiveTab] = useState<OrgTabId>(initialTab);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const currentTabMeta =
    ORG_TABS.find((t) => t.id === activeTab) || ORG_TABS[0];

  const discoverTabs = ORG_TABS.filter((t) => t.group === 'DISCOVER');
  const apparatusTabs = ORG_TABS.filter((t) => t.group === 'APPARATUS');

  // Phân tầng dữ liệu nhân sự theo đúng chức danh Khóa II
  const president = STAFF_MEMBERS.find((m) => m.bchRole === 'Chủ tịch')!;
  const vicePresidents = STAFF_MEMBERS.filter(
    (m) =>
      m.bchRole === 'Phó Chủ tịch thường trực' || m.bchRole === 'Phó Chủ tịch'
  );
  const btkMembersOnly = STAFF_MEMBERS.filter(
    (m) => m.bchRole === 'Ủy viên Ban Thư ký'
  );
  const bchMembersOnly = STAFF_MEMBERS.filter(
    (m) => m.bchRole === 'Ủy viên Ban Chấp hành'
  );

  const bktHead = STAFF_MEMBERS.find(
    (m) => m.bktRole === 'Trưởng Ban Kiểm tra'
  )!;
  const bktDeputy = STAFF_MEMBERS.find(
    (m) => m.bktRole === 'Phó trưởng Ban Kiểm tra'
  )!;
  const bktMembers = STAFF_MEMBERS.filter(
    (m) => m.bktRole === 'Ủy viên Ban Kiểm tra'
  );

  // Văn phòng 206.B06 (Đồng điều hành Đối ngoại & Nội bộ)
  const vpCoLeaders = STAFF_MEMBERS.filter(
    (m) => m.id === 'staff-08' || m.id === 'staff-02'
  );
  const vpOfficers = STAFF_MEMBERS.filter(
    (m) =>
      m.internalDeptCode === 'VP-HSV' &&
      m.id !== 'staff-08' &&
      m.id !== 'staff-02'
  );

  // Ban Tổ chức & Xây dựng Hội (Trưởng ban + 05 Cụm)
  const tcxdhHead = STAFF_MEMBERS.find((m) => m.id === 'staff-03')!;
  const tcxdhClusterLeaders = [
    {
      member: STAFF_MEMBERS.find((m) => m.id === 'staff-15')!,
      role: 'Phó Ban • Cụm trưởng Cụm QTKD (06 Chi hội)',
    },
    {
      member: STAFF_MEMBERS.find((m) => m.id === 'staff-13')!,
      role: 'Phó Ban • Cụm trưởng Cụm Kỹ thuật (06 Chi hội)',
    },
    {
      member: STAFF_MEMBERS.find((m) => m.id === 'staff-17')!,
      role: 'Phó Ban • Cụm trưởng Cụm CNTT (07 Chi hội)',
    },
    {
      member: STAFF_MEMBERS.find((m) => m.id === 'staff-05')!,
      role: 'Phó Ban • Cụm trưởng Cụm KHSK (06 Chi hội)',
    },
    {
      member: STAFF_MEMBERS.find((m) => m.id === 'staff-08')!,
      role: 'Phó Ban • Quản lý Cụm 30 CLB – Đội – Nhóm',
    },
  ];

  // Ban Tuyên giáo - Phong trào (02 Mảng)
  const tgptPropaganda = [
    {
      member: STAFF_MEMBERS.find((m) => m.id === 'staff-06')!,
      role: 'Trưởng Ban TG-PT (Trưởng mảng Tuyên giáo)',
      featured: true,
    },
    {
      member: STAFF_MEMBERS.find((m) => m.id === 'staff-11')!,
      role: 'Phó Trưởng Ban TG-PT (Mảng Tuyên giáo)',
      featured: false,
    },
    {
      member: STAFF_MEMBERS.find((m) => m.id === 'staff-12')!,
      role: 'Phó Trưởng Ban TG-PT (Mảng Tuyên giáo)',
      featured: false,
    },
  ];

  const tgptMovement = [
    {
      member: STAFF_MEMBERS.find((m) => m.id === 'staff-04')!,
      role: 'Trưởng Ban TG-PT (Trưởng mảng Phong trào)',
      featured: true,
    },
    {
      member: STAFF_MEMBERS.find((m) => m.id === 'staff-16')!,
      role: 'Phó Trưởng Ban TG-PT (Mảng Phong trào)',
      featured: false,
    },
    {
      member: STAFF_MEMBERS.find((m) => m.id === 'staff-20')!,
      role: 'Phó Ban TG-PT • Đội trưởng Đội CTV Xung kích',
      featured: false,
    },
    {
      member: STAFF_MEMBERS.find((m) => m.id === 'staff-07')!,
      role: 'Ủy viên BCH • Cán bộ Ban TG-PT',
      featured: false,
    },
    {
      member: STAFF_MEMBERS.find((m) => m.id === 'staff-10')!,
      role: 'Ủy viên BCH • Cán bộ Ban TG-PT',
      featured: false,
    },
  ];

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <SubpageBanner
        kicker="HỘI SINH VIÊN VIỆT NAM TRƯỜNG ĐHQTMĐ — KHÓA II (2026 – 2028)"
        title="Giới thiệu Tổ chức & Đội ngũ Cán bộ Chủ chốt"
        subtitle="Cơ cấu bộ máy 3 cấp, Thường trực Ban Thư ký, Ban Chấp hành, Ban Kiểm tra và 03 Ban chuyên môn trực thuộc"
        breadcrumbs={[
          { label: 'Giới thiệu & Bộ máy', href: '/gioi-thieu' },
          { label: currentTabMeta.label },
        ]}
      />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-9">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI (3/12): Menu dọc Đỏ #C10230 / Kem #EAE3D2 chia 2 cụm chuẩn EIU */}
          <aside
            aria-label="Danh mục Giới thiệu và Cơ cấu bộ máy"
            className="lg:col-span-3 space-y-5"
          >
            <div className="border border-slate-200 bg-white">
              <div className="bg-[#133F68] text-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider font-eiu-display">
                Khám phá &amp; Sơ đồ Bộ máy
              </div>
              <div className="divide-y divide-white">
                {discoverTabs.map((tab) => {
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      aria-current={isSelected ? 'page' : undefined}
                      className={`w-full text-left px-4 py-3 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#C10230] text-white font-bold'
                          : 'bg-[#EAE3D2] text-slate-900 hover:bg-[#dfd5be]'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 font-bold ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-[#133F68] text-white'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border border-slate-200 bg-white">
              <div className="bg-[#133F68] text-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider font-eiu-display">
                Lãnh đạo &amp; 03 Ban Chuyên môn
              </div>
              <div className="divide-y divide-white">
                {apparatusTabs.map((tab) => {
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      aria-current={isSelected ? 'page' : undefined}
                      className={`w-full text-left px-4 py-3 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#C10230] text-white font-bold'
                          : 'bg-[#EAE3D2] text-slate-900 hover:bg-[#dfd5be]'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 font-bold ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-white/80 text-[#133F68]'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hộp Trụ sở Văn phòng 206.B06 chuẩn lib.eiu.edu.vn */}
            <div className="bg-[#C10230] text-white p-5 space-y-2.5">
              <div className="w-8 h-0.5 bg-white" aria-hidden="true" />
              <div className="text-sm font-bold font-eiu-display">
                Trụ sở Văn phòng Hội
              </div>
              <p className="text-xs text-white/92 leading-relaxed">
                <strong>Phòng 206.B06</strong> — Khu Hành chính Trường ĐH Quốc
                tế Miền Đông. Tiếp hội viên từ 08:00 – 16:30 (Thứ Hai – Thứ
                Sáu).
              </p>
              <Link
                href="/to-chuc"
                className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#FCB900] hover:underline font-eiu-display pt-1"
              >
                <span>XEM 25 CHI HỘI &amp; 30 CLB</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>

          {/* CỘT PHẢI (9/12): Nội dung chuyên biệt theo từng Tab */}
          <div className="lg:col-span-9 space-y-6">
            {/* Tiêu đề & Mô tả học thuật */}
            <div className="bg-white border border-slate-200 p-5 sm:p-6 border-l-4 border-l-[#133F68]">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display">
                {currentTabMeta.title}
              </h2>
              <p className="text-[13.5px] text-slate-600 mt-1.5 leading-relaxed">
                {currentTabMeta.subtitle}
              </p>
            </div>

            {/* ============================================================
                TAB 1: TỔNG QUAN HỘI SINH VIÊN EIU KHÓA II (2026 - 2028)
               ============================================================ */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Khung Ảnh tập thể BCH Đại hội II & Sứ mệnh */}
                <div className="bg-white border border-slate-200 overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    <div className="md:col-span-6 bg-[#133F68] relative min-h-64 flex items-center justify-center p-4">
                      <img
                        src="/images/hsv-bch-dh2.png"
                        alt="Ban Chấp hành Hội Sinh viên Việt Nam Trường Đại học Quốc tế Miền Đông Khóa II"
                        className="w-full h-full max-h-72 object-cover border border-white/20"
                      />
                    </div>
                    <div className="md:col-span-6 p-6 flex flex-col justify-between gap-4">
                      <div className="space-y-3">
                        <span className="inline-block px-2.5 py-1 bg-[#0054A6] text-white text-[10.5px] font-bold uppercase tracking-wider font-eiu-display">
                          NHIỆM KỲ KHÓA II (2026 – 2028)
                        </span>
                        <h3 className="text-lg font-bold text-[#133F68] leading-snug font-eiu-display">
                          Đồng hành toàn diện cùng Sinh viên EIU: Bản lĩnh – Học
                          thuật – Tình nguyện – Hội nhập Quốc tế
                        </h3>
                        <p className="text-[13.5px] text-slate-700 leading-relaxed">
                          Hội Sinh viên Việt Nam Trường Đại học Quốc tế Miền
                          Đông (EIU) là cầu nối trực tiếp giữa Nhà trường và hơn
                          4.000 hội viên, sinh viên; tiên phong chuyển đổi số
                          công tác Hội với Sổ tay Kỹ thuật số Sinh viên 5 Tốt,
                          Hệ thống E-Certificate xác thực QR và Phòng họp Không
                          giấy E-Office.
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setActiveTab('chart')}
                          className="px-4 py-2 bg-[#133F68] hover:bg-[#0054A6] text-white text-xs font-bold uppercase tracking-wider cursor-pointer font-eiu-display"
                        >
                          Xem Sơ đồ Bộ máy 3 Cấp
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('btk')}
                          className="px-4 py-2 border border-[#133F68] text-[#133F68] hover:bg-[#133F68] hover:text-white text-xs font-bold uppercase tracking-wider cursor-pointer font-eiu-display"
                        >
                          Danh sách Ban Thư ký
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 04 Chỉ số quy mô tổ chức */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    {
                      num: '15 / 05',
                      label: 'Ủy viên BCH / Ban Thư ký',
                      note: '01 CT • 02 PCT • 02 UV BTK',
                      tab: 'bch' as OrgTabId,
                    },
                    {
                      num: '05 đ/c',
                      label: 'Ủy viên Ban Kiểm tra',
                      note: 'Giám sát Điều lệ & Kiến nghị SV',
                      tab: 'bkt' as OrgTabId,
                    },
                    {
                      num: '03 Đơn vị',
                      label: 'Văn phòng & Ban Chuyên môn',
                      note: 'VP 206.B06 • TC-XDH • TG-PT',
                      tab: 'vp' as OrgTabId,
                    },
                    {
                      num: '25 + 30',
                      label: 'Chi hội Khoa & CLB/Đội/Nhóm',
                      note: '04 Cụm Khoa • 04 Khối CLB',
                      tab: 'tcxdh' as OrgTabId,
                    },
                  ].map((stat) => (
                    <button
                      key={stat.label}
                      type="button"
                      onClick={() => setActiveTab(stat.tab)}
                      className="bg-white border border-slate-200 hover:border-[#0054A6] p-4 text-left transition-colors cursor-pointer"
                    >
                      <div className="text-xl font-extrabold font-mono text-[#0054A6]">
                        {stat.num}
                      </div>
                      <div className="text-xs font-bold text-[#133F68] mt-1 font-eiu-display">
                        {stat.label}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {stat.note}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Giá trị cốt lõi EIU & Cam kết Phát triển Bền vững UN SDGs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-white border border-slate-200">
                    <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 font-eiu-display">
                      <Leaf className="w-4 h-4 text-[#00BCFF]" />
                      <span>Hệ Giá trị EIU &amp; Cam kết Sự kiện Xanh SDGs</span>
                    </div>
                    <div className="p-5 space-y-3 text-[13.5px] text-slate-700 leading-relaxed">
                      <p>
                        Kế thừa hệ giá trị cốt lõi{' '}
                        <strong className="text-[#133F68]">
                          Nhân bản – Cộng đồng – Sáng tạo – Bền vững
                        </strong>{' '}
                        của Trường Đại học Quốc tế Miền Đông và Báo cáo Phát
                        triển Bền vững EIU (UN SDGs):
                      </p>
                      <ul className="space-y-2 text-xs text-slate-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#51803A] shrink-0 mt-0.5" />
                          <span>
                            <strong>100% Sự kiện Xanh:</strong> Không sử dụng
                            chai nhựa dùng một lần, khuyến khích bình cá nhân và
                            ấn phẩm QR số.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#51803A] shrink-0 mt-0.5" />
                          <span>
                            <strong>Họp Không Giấy (23/QĐ-HSV):</strong> Số hóa
                            100% tài liệu kỳ họp BCH/BTK và biểu quyết nghị
                            quyết trực tuyến.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200">
                    <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 font-eiu-display">
                      <FileCheck2 className="w-4 h-4 text-[#FCB900]" />
                      <span>Nền tảng Quy chế &amp; Văn bản Pháp lý Khóa II</span>
                    </div>
                    <div className="divide-y divide-slate-100 text-xs">
                      {[
                        {
                          code: '09/QĐ-HSV',
                          desc: 'Chuẩn Sinh viên 5 Tốt & Tập thể SV5T (Sửa đổi 2026 — GPA ≥ 3.00)',
                        },
                        {
                          code: '28/QĐ-HSV',
                          desc: 'Quy định cấp E-Certificate QR, duyệt trước 03 ngày & SLA 07 ngày',
                        },
                        {
                          code: '23/QĐ-HSV',
                          desc: 'Quy chế làm việc của Ban Chấp hành & Ban Thư ký Khóa II',
                        },
                        {
                          code: '24/QĐ-HSV',
                          desc: 'Chức năng, nhiệm vụ Văn phòng 206.B06, Ban TC-XDH & Ban TG-PT',
                        },
                        {
                          code: '04/TB-HSV',
                          desc: 'Thông báo phân công nhiệm vụ 20 cán bộ chủ chốt đầu nhiệm kỳ',
                        },
                      ].map((doc) => (
                        <Link
                          key={doc.code}
                          href={`/van-ban?doc=${encodeURIComponent(doc.code)}`}
                          className="px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-[#F5F5F5] transition-colors"
                        >
                          <div>
                            <span className="font-mono font-bold text-[#0054A6] mr-2">
                              {doc.code}
                            </span>
                            <span className="text-slate-700">{doc.desc}</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                TAB 2: SƠ ĐỒ CƠ CẤU TỔ CHỨC 3 CẤP TRỰC QUAN TƯƠNG TÁC
               ============================================================ */}
            {activeTab === 'chart' && (
              <div className="space-y-6">
                {/* CẤP 01: LÃNH ĐẠO & GIÁM SÁT */}
                <div className="bg-white border-2 border-[#133F68] p-5 sm:p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-[#133F68] text-white text-xs font-mono font-bold">
                        CẤP 01
                      </span>
                      <h3 className="text-sm sm:text-base font-bold uppercase text-[#133F68] font-eiu-display">
                        Cấp Lãnh đạo, Chỉ đạo &amp; Giám sát Toàn trường
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      Nhấp vào từng khối để xem nhân sự chi tiết
                    </span>
                  </div>

                  {/* Đỉnh sơ đồ: Đại hội II */}
                  <div className="max-w-lg mx-auto bg-[#02294E] text-white p-3.5 text-center border-b-3 border-[#A68556]">
                    <div className="text-[10.5px] font-mono uppercase tracking-widest text-[#FCB900]">
                      CƠ QUAN QUYỀN LỰC CAO NHẤT
                    </div>
                    <div className="text-xs sm:text-sm font-bold font-eiu-display mt-0.5">
                      ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN TRƯỜNG ĐHQTMĐ KHÓA II (2026
                      – 2028)
                    </div>
                  </div>

                  {/* Trục nối xuống BCH & BKT */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                    {/* Nhánh chính BCH -> BTK */}
                    <div className="md:col-span-7 space-y-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab('bch')}
                        className="w-full text-left bg-[#133F68] hover:bg-[#0054A6] text-white p-4 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider font-eiu-display text-[#00BCFF]">
                            BAN CHẤP HÀNH HSV TRƯỜNG
                          </span>
                          <span className="px-2 py-0.5 bg-white/15 font-mono text-xs font-bold">
                            15 ĐỒNG CHÍ
                          </span>
                        </div>
                        <p className="text-xs text-white/90 mt-1.5">
                          01 Chủ tịch • 01 PCT Thường trực • 01 PCT • 02 UV Ban
                          Thư ký • 10 Ủy viên BCH
                        </p>
                      </button>

                      <div className="flex justify-center" aria-hidden="true">
                        <div className="w-0.5 h-4 bg-[#133F68]" />
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTab('btk')}
                        className="w-full text-left bg-[#0054A6] hover:bg-[#133F68] text-white p-4 border-l-4 border-[#00BCFF] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider font-eiu-display text-[#FCB900]">
                            BAN THƯ KÝ &amp; THƯỜNG TRỰC HỘI
                          </span>
                          <span className="px-2 py-0.5 bg-white/20 font-mono text-xs font-bold">
                            05 ĐỒNG CHÍ
                          </span>
                        </div>
                        <p className="text-xs text-white/95 mt-1.5 leading-relaxed">
                          Chủ tịch: <strong>Đ/c Trương Châu Phước Lộc</strong> •
                          PCT TT: <strong>Đ/c Nguyễn Như Quỳnh</strong> • PCT:{' '}
                          <strong>Đ/c Trần Thị Thu Huyền</strong> • 02 UV BTK:{' '}
                          <strong>Đ/c Nguyễn Mai Gia Tường</strong>,{' '}
                          <strong>Đ/c Phạm Thị Thanh Thủy</strong>
                        </p>
                      </button>
                    </div>

                    {/* Nhánh Giám sát độc lập: Ban Kiểm tra */}
                    <div className="md:col-span-5 flex">
                      <button
                        type="button"
                        onClick={() => setActiveTab('bkt')}
                        className="w-full text-left bg-[#F8FAFC] hover:bg-[#EAE3D2]/60 border-2 border-[#C10230] p-4 flex flex-col justify-between transition-colors cursor-pointer"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-[#C10230] font-eiu-display">
                              <ShieldCheck className="w-4 h-4" />
                              <span>BAN KIỂM TRA HSV TRƯỜNG</span>
                            </span>
                            <span className="px-2 py-0.5 bg-[#C10230] text-white font-mono text-xs font-bold">
                              05 Đ/C
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            Kiểm tra thi hành Điều lệ Hội, giám sát quy trình
                            xét SV5T, cấp E-Certificate và xử lý Hộp thư Lắng
                            nghe Sinh viên.
                          </p>
                        </div>
                        <div className="pt-3 mt-3 border-t border-slate-200 text-xs text-slate-800 space-y-0.5">
                          <div>
                            • Trưởng ban:{' '}
                            <strong className="text-[#133F68]">
                              Đ/c Trần Thị Thu Huyền
                            </strong>
                          </div>
                          <div>
                            • Phó ban:{' '}
                            <strong className="text-[#133F68]">
                              Đ/c Đặng Trí Toàn
                            </strong>
                          </div>
                          <div>
                            • 03 Ủy viên: Thúy Nhi, Quỳnh Trân, Hải Yến
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Trục kết nối Cấp 01 -> Cấp 02 */}
                <div className="flex justify-center -my-3" aria-hidden="true">
                  <div className="w-0.5 h-6 bg-[#133F68]" />
                </div>

                {/* CẤP 02: 03 ĐƠN VỊ CHUYÊN MÔN CẤP TRƯỜNG */}
                <div className="bg-white border-2 border-[#0054A6] p-5 sm:p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-[#0054A6] text-white text-xs font-mono font-bold">
                        CẤP 02
                      </span>
                      <h3 className="text-sm sm:text-base font-bold uppercase text-[#133F68] font-eiu-display">
                        Văn phòng &amp; Các Ban Chuyên môn Cấp Trường (03 Đơn vị)
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-[#0054A6] font-bold">
                      Quyết định 24/QĐ-HSV
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* 01. Văn phòng HSV */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('vp')}
                      className="text-left border border-slate-300 hover:border-[#133F68] bg-[#F8FAFC] p-4 flex flex-col justify-between gap-3 transition-colors cursor-pointer"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 bg-[#133F68] text-white text-[10.5px] font-mono font-bold">
                            PHÒNG 206.B06
                          </span>
                          <Building2 className="w-4 h-4 text-[#133F68]" />
                        </div>
                        <div className="text-sm font-bold text-[#133F68] font-eiu-display">
                          01. Văn phòng Hội Sinh viên
                        </div>
                        <div className="bg-white border border-slate-200 p-2.5 text-xs space-y-1">
                          <div className="font-bold text-[#C10230] uppercase text-[10.5px]">
                            Cơ chế Đồng điều hành:
                          </div>
                          <div>
                            • Chánh VP (Đối ngoại):{' '}
                            <strong>Nguyễn Mỹ Hạnh</strong>
                          </div>
                          <div>
                            • Tổng Thư ký (Nội bộ):{' '}
                            <strong>Nguyễn Như Quỳnh</strong>
                          </div>
                        </div>
                      </div>
                      <div className="text-[11.5px] text-slate-600 pt-2 border-t border-slate-200">
                        02 Phó CVP (Hồng Ngọc, Hải Yến) • 02 Cán bộ VP (Gia Hân,
                        Văn Thanh)
                      </div>
                    </button>

                    {/* 02. Ban TC-XDH */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('tcxdh')}
                      className="text-left border border-slate-300 hover:border-[#133F68] bg-[#F8FAFC] p-4 flex flex-col justify-between gap-3 transition-colors cursor-pointer"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 bg-[#0054A6] text-white text-[10.5px] font-mono font-bold">
                            05 CỤM QUẢN LÝ
                          </span>
                          <Layers className="w-4 h-4 text-[#0054A6]" />
                        </div>
                        <div className="text-sm font-bold text-[#133F68] font-eiu-display">
                          02. Ban Tổ chức &amp; Xây dựng Hội
                        </div>
                        <div className="bg-white border border-slate-200 p-2.5 text-xs space-y-1">
                          <div>
                            • Trưởng ban:{' '}
                            <strong className="text-[#133F68]">
                              Trần Thị Thu Huyền
                            </strong>
                          </div>
                          <div>• 04 Cụm trưởng Khoa (QTKD, KT, CNTT, KHSK)</div>
                          <div>
                            • Phó ban Cụm 30 CLB:{' '}
                            <strong>Nguyễn Mỹ Hạnh</strong>
                          </div>
                        </div>
                      </div>
                      <div className="text-[11.5px] text-slate-600 pt-2 border-t border-slate-200">
                        Thẩm định Ngày tình nguyện trước ≥ 03 ngày &amp; Quản lý
                        cán bộ, hội viên
                      </div>
                    </button>

                    {/* 03. Ban TG-PT */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('tgpt')}
                      className="text-left border border-slate-300 hover:border-[#133F68] bg-[#F8FAFC] p-4 flex flex-col justify-between gap-3 transition-colors cursor-pointer"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 bg-[#C10230] text-white text-[10.5px] font-mono font-bold">
                            02 MẢNG + ĐỘI CTVXK
                          </span>
                          <GitBranch className="w-4 h-4 text-[#C10230]" />
                        </div>
                        <div className="text-sm font-bold text-[#133F68] font-eiu-display">
                          03. Ban Tuyên giáo – Phong trào
                        </div>
                        <div className="bg-white border border-slate-200 p-2.5 text-xs space-y-1.5">
                          <div>
                            • <strong>Mảng Tuyên giáo</strong> (Đặng Trí Toàn):
                            03 Tiểu ban <em>Design, Video, Photo</em>
                          </div>
                          <div>
                            • <strong>Mảng Phong trào</strong> (Nguyễn Mai Gia
                            Tường): 03 Tiểu ban{' '}
                            <em>Tài chính, Nội dung, MC</em> +{' '}
                            <strong className="text-[#C10230]">
                              Đội CTV Xung kích
                            </strong>
                          </div>
                        </div>
                      </div>
                      <div className="text-[11.5px] text-slate-600 pt-2 border-t border-slate-200">
                        Đội CTVXK quản lý 02 Tiểu ban: <em>Hậu cần – Sân khấu</em>{' '}
                        &amp; <em>Lễ tân – Khánh tiết – VTM</em>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Trục kết nối Cấp 02 -> Cấp 03 */}
                <div className="flex justify-center -my-3" aria-hidden="true">
                  <div className="w-0.5 h-6 bg-[#A68556]" />
                </div>

                {/* CẤP 03: HỆ THỐNG 55 CƠ SỞ HỘI TRỰC THUỘC */}
                <div className="bg-white border-2 border-[#A68556] p-5 sm:p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-[#A68556] text-white text-xs font-mono font-bold">
                        CẤP 03
                      </span>
                      <h3 className="text-sm sm:text-base font-bold uppercase text-[#133F68] font-eiu-display">
                        Hệ thống Cơ sở Hội Trực thuộc ({BRANCH_UNITS.length} Chi
                        hội &amp; {CLUB_UNITS.length} CLB – Đội – Nhóm)
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Mỗi đơn vị do BCH / BCN gồm 05 đồng chí điều hành
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                      href="/to-chuc?tab=branches"
                      className="border border-slate-200 hover:border-[#133F68] p-4 bg-[#F8FAFC] flex flex-col justify-between gap-3 group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase text-[#133F68] group-hover:text-[#C10230] font-eiu-display">
                            CẤP 03A — 25 CHI HỘI (04 CỤM KHOA × 06 KHÓA)
                          </span>
                          <ArrowRight className="w-4 h-4 text-[#0054A6]" />
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Cụm QTKD (06) • Cụm Kỹ thuật (06) • Cụm CNTT (07) •
                          Cụm Khoa học Sức khỏe (06), trải dài từ Khóa K21 đến
                          K26.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 text-[10.5px] font-mono">
                        <span className="px-2 py-0.5 bg-white border border-slate-200 text-[#133F68]">
                          BBS: 06
                        </span>
                        <span className="px-2 py-0.5 bg-white border border-slate-200 text-[#133F68]">
                          SET: 06
                        </span>
                        <span className="px-2 py-0.5 bg-white border border-slate-200 text-[#133F68]">
                          CIT: 07
                        </span>
                        <span className="px-2 py-0.5 bg-white border border-slate-200 text-[#133F68]">
                          SNS: 06
                        </span>
                      </div>
                    </Link>

                    <Link
                      href="/to-chuc?tab=clubs"
                      className="border border-slate-200 hover:border-[#133F68] p-4 bg-[#F8FAFC] flex flex-col justify-between gap-3 group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase text-[#133F68] group-hover:text-[#C10230] font-eiu-display">
                            CẤP 03B — 30 CLB – ĐỘI – NHÓM (04 KHỐI LĨNH VỰC)
                          </span>
                          <ArrowRight className="w-4 h-4 text-[#0054A6]" />
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Gồm 02 đơn vị nòng cốt của Hội (
                          <strong>CLB Sinh viên 5 tốt</strong> &amp;{' '}
                          <strong>Đội CTV Xung kích</strong>) cùng 28 CLB học
                          thuật, nghệ thuật, thể thao, cộng đồng.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 text-[10.5px] font-mono">
                        <span className="px-2 py-0.5 bg-white border border-slate-200 text-[#C10230] font-bold">
                          Cộng đồng: 07
                        </span>
                        <span className="px-2 py-0.5 bg-white border border-slate-200 text-[#133F68]">
                          Học thuật: 06
                        </span>
                        <span className="px-2 py-0.5 bg-white border border-slate-200 text-[#133F68]">
                          Nghệ thuật: 10
                        </span>
                        <span className="px-2 py-0.5 bg-white border border-slate-200 text-[#133F68]">
                          Thể thao: 07
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                TAB 3: BAN THƯ KÝ (05 ĐỒNG CHÍ) — PHÂN TẦNG LÃNH ĐẠO
               ============================================================ */}
            {activeTab === 'btk' && (
              <div className="space-y-5">
                <div className="space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#A68556] font-eiu-display">
                    Chủ tịch Hội Sinh viên Trường
                  </div>
                  <StaffCompactCard
                    member={president}
                    roleHighlight="Chủ tịch HSV Trường"
                    subLabel={president.internalDeptRole}
                    featured
                    onSelect={setSelectedStaff}
                  />
                </div>

                <div className="space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#A68556] font-eiu-display">
                    Các Phó Chủ tịch Hội Sinh viên Trường (02 đồng chí)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vicePresidents.map((vp) => (
                      <StaffCompactCard
                        key={vp.id}
                        member={vp}
                        roleHighlight={`${vp.bchRole} HSV Trường`}
                        subLabel={vp.internalDeptRole}
                        featured
                        onSelect={setSelectedStaff}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#A68556] font-eiu-display">
                    Ủy viên Ban Thư ký Hội Sinh viên Trường (02 đồng chí)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {btkMembersOnly.map((m) => (
                      <StaffCompactCard
                        key={m.id}
                        member={m}
                        roleHighlight="Ủy viên Ban Thư ký"
                        subLabel={m.internalDeptRole}
                        onSelect={setSelectedStaff}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                TAB 4: BAN CHẤP HÀNH (15 ĐỒNG CHÍ) — PHÂN TẦNG 3 CẤP
               ============================================================ */}
            {activeTab === 'bch' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#A68556] font-eiu-display">
                    I. Thường trực Hội Sinh viên Trường (03 đồng chí)
                  </div>
                  <StaffCompactCard
                    member={president}
                    roleHighlight="Chủ tịch HSV Trường"
                    featured
                    onSelect={setSelectedStaff}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vicePresidents.map((vp) => (
                      <StaffCompactCard
                        key={vp.id}
                        member={vp}
                        roleHighlight={`${vp.bchRole} HSV Trường`}
                        featured
                        onSelect={setSelectedStaff}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#A68556] font-eiu-display">
                    II. Ủy viên Ban Thư ký (02 đồng chí)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {btkMembersOnly.map((m) => (
                      <StaffCompactCard
                        key={m.id}
                        member={m}
                        roleHighlight="Ủy viên Ban Thư ký"
                        onSelect={setSelectedStaff}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#A68556] font-eiu-display">
                    III. Ủy viên Ban Chấp hành Hội Sinh viên Trường (10 đồng
                    chí)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bchMembersOnly.map((m) => (
                      <StaffCompactCard
                        key={m.id}
                        member={m}
                        roleHighlight="Ủy viên Ban Chấp hành"
                        onSelect={setSelectedStaff}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                TAB 5: BAN KIỂM TRA (05 ĐỒNG CHÍ)
               ============================================================ */}
            {activeTab === 'bkt' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <StaffCompactCard
                    member={bktHead}
                    roleHighlight="Trưởng Ban Kiểm tra"
                    subLabel="Phó Chủ tịch HSV Trường • Trưởng Ban Tổ chức & Xây dựng Hội"
                    featured
                    onSelect={setSelectedStaff}
                  />
                  <StaffCompactCard
                    member={bktDeputy}
                    roleHighlight="Phó Trưởng Ban Kiểm tra"
                    subLabel="Ủy viên BCH • Trưởng Ban TG-PT (Mảng Tuyên giáo)"
                    featured
                    onSelect={setSelectedStaff}
                  />
                </div>

                <div className="space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#A68556] font-eiu-display">
                    Ủy viên Ban Kiểm tra Hội Sinh viên Trường (03 đồng chí)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bktMembers.map((m) => (
                      <StaffCompactCard
                        key={m.id}
                        member={m}
                        roleHighlight="Ủy viên Ban Kiểm tra"
                        onSelect={setSelectedStaff}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                TAB 6: VĂN PHÒNG HỘI SINH VIÊN (PHÒNG 206.B06)
               ============================================================ */}
            {activeTab === 'vp' && (
              <div className="space-y-5">
                <div className="bg-white border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-[#133F68] font-semibold">
                    <MapPin className="w-4 h-4 text-[#C10230]" />
                    <span>
                      Trụ sở: <strong>Phòng 206.B06</strong> • Văn thư, lưu trữ,
                      quản lý con dấu Mộc và tài sản dùng chung
                    </span>
                  </div>
                  <span className="font-mono font-bold text-[#0054A6]">
                    Quyết định 24/QĐ-HSV
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#A68556] font-eiu-display">
                    Ban Lãnh đạo Đồng điều hành (Đối ngoại &amp; Nội bộ)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vpCoLeaders.map((m) => (
                      <StaffCompactCard
                        key={m.id}
                        member={m}
                        roleHighlight={
                          m.id === 'staff-08'
                            ? 'Chánh Văn phòng (Đối ngoại)'
                            : 'Tổng Thư ký VP (Nội bộ)'
                        }
                        subLabel={
                          m.id === 'staff-08'
                            ? 'Phụ trách đối ngoại với các phòng, ban EIU • Phó Ban TC-XDH (30 CLB)'
                            : 'Phó Chủ tịch Thường trực HSV • Điều hành tác vụ nội bộ Phòng 206.B06'
                        }
                        featured
                        onSelect={setSelectedStaff}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#A68556] font-eiu-display">
                    Phó Chánh Văn phòng &amp; Cán bộ Chuyên trách Văn phòng (04
                    đồng chí)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vpOfficers.map((m) => (
                      <StaffCompactCard
                        key={m.id}
                        member={m}
                        roleHighlight={
                          m.internalDeptRole.includes('Phó Chánh Văn phòng')
                            ? 'Phó Chánh Văn phòng'
                            : 'Cán bộ Văn phòng'
                        }
                        subLabel={m.internalDeptRole}
                        onSelect={setSelectedStaff}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                TAB 7: BAN TỔ CHỨC & XÂY DỰNG HỘI (05 CỤM QUẢN LÝ)
               ============================================================ */}
            {activeTab === 'tcxdh' && (
              <div className="space-y-5">
                <div className="space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#A68556] font-eiu-display">
                    Trưởng Ban Tổ chức và Xây dựng Hội
                  </div>
                  <StaffCompactCard
                    member={tcxdhHead}
                    roleHighlight="Trưởng Ban TC-XDH"
                    subLabel="Phó Chủ tịch, Trưởng Ban Kiểm tra HSV Trường • Tiếp nhận thẩm định Ngày tình nguyện trước ≥ 03 ngày"
                    featured
                    onSelect={setSelectedStaff}
                  />
                </div>

                <div className="space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#A68556] font-eiu-display">
                    04 Cụm trưởng Cụm Chi hội Khoa &amp; Phó Ban Quản lý 30 CLB
                    – Đội – Nhóm
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tcxdhClusterLeaders.map((item) => (
                      <StaffCompactCard
                        key={item.member.id + item.role}
                        member={item.member}
                        roleHighlight={item.role.split(' • ')[1]}
                        subLabel={item.role}
                        onSelect={setSelectedStaff}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                TAB 8: BAN TUYÊN GIÁO - PHONG TRÀO & ĐỘI CTV XUNG KÍCH
               ============================================================ */}
            {activeTab === 'tgpt' && (
              <div className="space-y-6">
                {/* Mảng 1: Tuyên giáo */}
                <div className="bg-white border border-slate-200 p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div>
                      <h3 className="text-sm font-bold uppercase text-[#133F68] font-eiu-display">
                        I. Mảng Tuyên giáo — Truyền thông &amp; Nhận diện Số
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Quản lý 03 Tiểu ban chuyên môn:{' '}
                        <strong>Tiểu ban Design</strong> •{' '}
                        <strong>Tiểu ban Video</strong> •{' '}
                        <strong>Tiểu ban Photo</strong>
                      </p>
                    </div>
                    <span className="px-2.5 py-1 bg-[#133F68] text-white font-mono text-[11px] font-bold">
                      03 TIỂU BAN
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tgptPropaganda.map((item) => (
                      <div
                        key={item.member.id}
                        className={item.featured ? 'md:col-span-2' : ''}
                      >
                        <StaffCompactCard
                          member={item.member}
                          roleHighlight={item.role}
                          featured={item.featured}
                          onSelect={setSelectedStaff}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mảng 2: Phong trào & Đội CTVXK */}
                <div className="bg-white border border-slate-200 p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div>
                      <h3 className="text-sm font-bold uppercase text-[#133F68] font-eiu-display">
                        II. Mảng Phong trào &amp; Đội Cộng tác viên Xung kích
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        03 Tiểu ban Phong trào (<strong>Tài chính</strong> •{' '}
                        <strong>Nội dung – Kịch bản</strong> •{' '}
                        <strong>MC</strong>) +{' '}
                        <strong className="text-[#C10230]">
                          Đội CTV Xung kích
                        </strong>{' '}
                        quản lý 02 Tiểu ban (<strong>Hậu cần – Sân khấu</strong>{' '}
                        &amp; <strong>Lễ tân – Khánh tiết – Văn thể mỹ</strong>)
                      </p>
                    </div>
                    <span className="px-2.5 py-1 bg-[#C10230] text-white font-mono text-[11px] font-bold">
                      03 TB + ĐỘI CTVXK
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tgptMovement.map((item) => (
                      <div
                        key={item.member.id}
                        className={item.featured ? 'md:col-span-2' : ''}
                      >
                        <StaffCompactCard
                          member={item.member}
                          roleHighlight={item.role}
                          featured={item.featured}
                          onSelect={setSelectedStaff}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Hồ sơ Cán bộ & Danh mục Vị trí Kiêm nhiệm */}
      {selectedStaff && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Hồ sơ cán bộ ${selectedStaff.fullName}`}
          className="fixed inset-0 z-50 bg-slate-900/65 flex items-center justify-center p-4"
          onClick={() => setSelectedStaff(null)}
        >
          <div
            className="bg-white max-w-xl w-full border-2 border-[#133F68] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#133F68] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-[#FCB900]" />
                <div>
                  <div className="text-sm font-bold font-eiu-display">
                    HỒ SƠ CÁN BỘ HỘI — Đ/c {selectedStaff.fullName}
                  </div>
                  <div className="text-[11px] font-mono text-[#DED1BE]">
                    {selectedStaff.studentId !== '-'
                      ? `MSSV: ${selectedStaff.studentId}`
                      : 'Chuyên viên Phòng Công tác Sinh viên'}{' '}
                    • {selectedStaff.email}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStaff(null)}
                aria-label="Đóng hồ sơ"
                className="text-white/80 hover:text-white cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="divide-y divide-slate-200 text-xs">
              <div className="grid grid-cols-12 p-3.5">
                <div className="col-span-4 font-bold text-slate-800">
                  Khoa / Chuyên ngành:
                </div>
                <div className="col-span-8 text-slate-800">
                  <strong>
                    {FACULTY_METADATA[selectedStaff.facultyCode].nameVi}
                  </strong>{' '}
                  — {selectedStaff.majorName} ({selectedStaff.academicYearText})
                </div>
              </div>
              <div className="grid grid-cols-12 p-3.5">
                <div className="col-span-4 font-bold text-slate-800">
                  Chức vụ BCH / BKT:
                </div>
                <div className="col-span-8 text-[#133F68] font-semibold">
                  {selectedStaff.bchRole !== 'Không'
                    ? `${selectedStaff.bchRole} HSV Trường`
                    : 'Cán bộ chuyên môn'}
                  {selectedStaff.bktRole !== 'Không'
                    ? ` • ${selectedStaff.bktRole}`
                    : ''}
                </div>
              </div>
              {selectedStaff.youthUnionTitle !== 'Không' && (
                <div className="grid grid-cols-12 p-3.5">
                  <div className="col-span-4 font-bold text-slate-800">
                    Chức vụ bên Đoàn:
                  </div>
                  <div className="col-span-8 text-slate-700">
                    {selectedStaff.youthUnionTitle}
                  </div>
                </div>
              )}
              <div className="p-4 space-y-2.5 bg-[#F8FAFC]">
                <div className="font-bold uppercase tracking-wider text-[#133F68] flex items-center gap-1.5 font-eiu-display">
                  <Users className="w-3.5 h-3.5 text-[#0054A6]" />
                  <span>
                    Danh mục Vị trí &amp; Kiêm nhiệm ({selectedStaff.positions.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {selectedStaff.positions.map((pos) => (
                    <div
                      key={pos.id}
                      className="bg-white border border-slate-200 p-3 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-[#133F68]">
                          {pos.positionTitle}
                        </div>
                        <div className="text-[11px] text-slate-600">
                          {pos.unitName}
                          {pos.divisionName ? ` — ${pos.divisionName}` : ''}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-[#0054A6]/10 text-[#0054A6] font-mono text-[10.5px] font-bold shrink-0">
                        Cấp {pos.roleLevel}/6
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GioiThieuSearchBridge() {
  const searchParams = useSearchParams();
  const rawTab = searchParams.get('tab') as OrgTabId | null;
  const validTab =
    rawTab && ORG_TABS.some((t) => t.id === rawTab) ? rawTab : 'overview';

  return <GioiThieuContent key={validTab} initialTab={validTab} />;
}

export default function GioiThieuPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1140px] mx-auto px-4 py-16 text-center text-sm text-slate-500">
          Đang tải chuyên trang Giới thiệu &amp; Cơ cấu bộ máy...
        </div>
      }
    >
      <GioiThieuSearchBridge />
    </Suspense>
  );
}
