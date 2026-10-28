'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BRANCH_UNITS,
  CLUB_UNITS,
  FACULTY_METADATA,
  STAFF_MEMBERS,
  decodeEiuStudentId,
} from '@/data/mock-data';
import { StaffMember } from '@/types';
import {
  Award,
  Building2,
  CheckCircle2,
  ChevronRight,
  Mail,
  Network,
  Phone,
  Search,
  Shield,
  Sparkles,
  UserCheck,
  Users,
  X,
  Scale,
  Briefcase,
  Megaphone,
  Zap,
} from 'lucide-react';

export default function OrganizationAndPersonnelPage() {
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [unitFilter, setUnitFilter] = useState<
    'ALL' | 'BTK' | 'BCH' | 'BKT' | 'VP-HSV' | 'BAN-TCXDH' | 'BAN-TGPT'
  >('ALL');

  const getStaffByOrder = (order: number) =>
    STAFF_MEMBERS.find((s) => s.orderNumber === order)!;

  // Lọc danh bạ 20 nhân sự
  const filteredStaff = STAFF_MEMBERS.filter((member) => {
    const matchesSearch =
      member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.internalDeptRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.grassrootsRole.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (unitFilter === 'ALL') return true;
    if (unitFilter === 'BTK') return member.isBtkMember;
    if (unitFilter === 'BCH') return member.bchRole !== 'Không';
    if (unitFilter === 'BKT') return member.bktRole !== 'Không';
    if (unitFilter === 'VP-HSV') return member.internalDeptCode === 'VP-HSV';
    if (unitFilter === 'BAN-TCXDH')
      return member.internalDeptCode === 'BAN-TCXDH' || member.clusterManaged === 'CLUB';
    if (unitFilter === 'BAN-TGPT')
      return (
        member.internalDeptCode === 'BAN-TGPT' ||
        member.internalDeptRole.includes('TG-PT') ||
        member.internalDeptRole.includes('Tuyên giáo')
      );
    return true;
  });

  // Render thẻ nhân sự thu gọn dùng trực tiếp trong Sơ đồ Bộ máy
  const PersonMiniCard = ({
    member,
    roleBadge,
    subNote,
    accent = 'blue',
  }: {
    member: StaffMember;
    roleBadge: string;
    subNote?: string;
    accent?: 'blue' | 'navy' | 'amber' | 'teal';
  }) => {
    const accentStyles = {
      navy: 'bg-[#0B2545] text-white border-[#0B2545]',
      blue: 'bg-white text-slate-900 border-slate-200 hover:border-[#0054A6]',
      amber: 'bg-amber-50/50 text-slate-900 border-amber-200 hover:border-amber-500',
      teal: 'bg-sky-50/50 text-slate-900 border-sky-200 hover:border-[#0054A6]',
    };

    return (
      <button
        type="button"
        onClick={() => setSelectedStaff(member)}
        className={`w-full text-left rounded-xl p-3.5 border shadow-2xs hover:shadow-md transition-all cursor-pointer group ${accentStyles[accent]}`}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
              accent === 'navy'
                ? 'bg-amber-400 text-[#0B2545]'
                : accent === 'amber'
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-[#F0F7FF] text-[#0054A6] border border-sky-200'
            }`}
          >
            {roleBadge}
          </span>
          <span
            className={`text-[11px] font-mono ${
              accent === 'navy' ? 'text-sky-200' : 'text-slate-500'
            }`}
          >
            {member.studentId !== '-' ? member.studentId : 'Chuyên viên'}
          </span>
        </div>

        <p
          className={`text-sm font-bold flex items-center justify-between ${
            accent === 'navy'
              ? 'text-white'
              : 'text-[#0B2545] group-hover:text-[#0054A6]'
          }`}
        >
          <span>Đ/c {member.fullName}</span>
          <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </p>

        {subNote && (
          <p
            className={`text-xs mt-1 leading-snug ${
              accent === 'navy' ? 'text-slate-200' : 'text-slate-600'
            }`}
          >
            {subNote}
          </p>
        )}

        <div
          className={`mt-2 pt-2 border-t flex flex-wrap items-center justify-between gap-1 text-[11px] ${
            accent === 'navy'
              ? 'border-white/15 text-sky-200'
              : 'border-slate-100 text-slate-500'
          }`}
        >
          <span className="font-mono truncate max-w-[180px]">{member.email}</span>
          <span className="font-semibold">{member.facultyCode}</span>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-12 pb-16">
      {/* HEADER BANNER */}
      <section className="bg-[#0B2545] text-white border-b border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-sky-300">
            <Network className="w-3.5 h-3.5" />
            <span>Hệ thống Tổ chức Bộ máy & Danh bạ Cán bộ Chủ chốt Khóa II (2026 – 2028)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Sơ Đồ Cơ Cấu Tổ Chức & Nhân Sự Hội Sinh Viên Trường
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Thiết kế đồng bộ hóa giữa sơ đồ tổ chức bộ máy 03 cấp (theo Quyết định{' '}
            <code className="font-mono text-sky-300">15/QĐ-BTK-TC</code>,{' '}
            <code className="font-mono text-sky-300">16/QĐ-BTK-TC</code>,{' '}
            <code className="font-mono text-sky-300">23/QĐ-HSV</code>,{' '}
            <code className="font-mono text-sky-300">24/QĐ-HSV</code> & Thông báo{' '}
            <code className="font-mono text-sky-300">04/TB-HSV</code>) với dữ liệu con người thực
            tế. Nhấn vào bất kỳ đồng chí nào trên sơ đồ để xem hồ sơ trích ngang và các chức vụ kiêm
            nhiệm.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* ====================================================================
            CẤP 01: CẤP TRƯỜNG - BAN CHẤP HÀNH (15), BAN THƯ KÝ (05) & BAN KIỂM TRA (05)
           ==================================================================== */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-900 text-white px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-[#0054A6] flex items-center justify-center font-mono font-extrabold text-sm">
                01
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold">
                  CẤP TRƯỜNG: BAN CHẤP HÀNH, BAN THƯ KÝ & BAN KIỂM TRA
                </h2>
                <p className="text-xs text-slate-300">
                  Cơ quan lãnh đạo, điều hành và kiểm tra, giám sát của Hội Sinh viên trường
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15">
                Ban Chấp hành: <strong>15 đồng chí</strong>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-400/30 text-amber-200">
                Ban Thư ký: <strong>05 đồng chí</strong>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-sky-500/20 border border-sky-400/30 text-sky-200">
                Ban Kiểm tra: <strong>05 đồng chí</strong>
              </span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* KHỐI BAN CHẤP HÀNH (15 ĐỒNG CHÍ) - 8 CỘT */}
            <div className="lg:col-span-8 space-y-6 bg-slate-50/70 rounded-xl p-5 border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0054A6]">
                  ● Ban Chấp hành Hội Sinh viên trường (15 Đồng chí)
                </span>
                <span className="text-[11px] text-slate-500">
                  Gồm 05 đ/c Ban Thư ký & 10 đ/c Ủy viên BCH
                </span>
              </div>

              {/* Hộp lồng: BAN THƯ KÝ HỘI SINH VIÊN TRƯỜNG (05 ĐỒNG CHÍ) */}
              <div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-[#0054A6]/30 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F0F7FF] text-[#0054A6] text-xs font-bold border border-sky-200">
                    ★ Ban Thư ký Hội Sinh viên trường (05 Đồng chí)
                  </span>
                  <span className="text-[11px] text-slate-500">Cơ quan thường trực điều hành</span>
                </div>

                {/* 01 Chủ tịch */}
                <div className="max-w-xl mx-auto">
                  <PersonMiniCard
                    member={getStaffByOrder(1)}
                    roleBadge="★ 01 Đ/c • Chủ tịch HSV Trường"
                    subNote="Phụ trách chung, chỉ đạo toàn diện Ban Chấp hành và Ban Thư ký Hội Sinh viên trường • Phó Bí thư Đoàn Trường"
                    accent="navy"
                  />
                </div>

                {/* 01 PCT Thường trực + 01 PCT kiêm Trưởng BKT + 02 Ủy viên BTK */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <PersonMiniCard
                    member={getStaffByOrder(2)}
                    roleBadge="01 Đ/c • Phó Chủ tịch Thường trực"
                    subNote="Điều hành hoạt động thường trực • Tổng Thư ký Văn phòng HSV trường • CHP 24QTKD01"
                    accent="teal"
                  />
                  <PersonMiniCard
                    member={getStaffByOrder(3)}
                    roleBadge="01 Đ/c • Phó Chủ tịch, Trưởng BKT"
                    subNote="Phụ trách công tác kiểm tra, giám sát • Trưởng Ban Tổ chức & Xây dựng Hội • CHT 25CNTT01"
                    accent="amber"
                  />
                  <PersonMiniCard
                    member={getStaffByOrder(4)}
                    roleBadge="Ủy viên Ban Thư ký (1/2)"
                    subNote="Trưởng Ban Tuyên giáo - Phong trào (Trưởng mảng Phong trào) • Chủ nhiệm CLB Sinh viên 5 tốt"
                    accent="blue"
                  />
                  <PersonMiniCard
                    member={getStaffByOrder(5)}
                    roleBadge="Ủy viên Ban Thư ký (2/2)"
                    subNote="Phó Ban Tổ chức & Xây dựng Hội (Cụm trưởng Cụm KHSK) • Chi hội trưởng 25KHSK01"
                    accent="blue"
                  />
                </div>
              </div>

              {/* 10 ỦY VIÊN BAN CHẤP HÀNH CÒN LẠI */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    ● Các Ủy viên Ban Chấp hành (10 Đồng chí: 01 UV BCH kiêm UV BKT & 09 UV BCH)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 01 UV BCH kiêm UV BKT */}
                  <PersonMiniCard
                    member={getStaffByOrder(6)}
                    roleBadge="01 Đ/c • UV BCH, Phó Trưởng BKT"
                    subNote="Trưởng Ban TG-PT (Trưởng mảng Tuyên giáo) • Chi hội trưởng 25CNTT02"
                    accent="amber"
                  />
                  {/* 09 UV BCH */}
                  <PersonMiniCard
                    member={getStaffByOrder(8)}
                    roleBadge="Ủy viên BCH (1/9)"
                    subNote="Chánh Văn phòng HSV • Phó Ban TC-XDH (Quản lý CLB/Đội/Nhóm)"
                  />
                  <PersonMiniCard
                    member={getStaffByOrder(15)}
                    roleBadge="Ủy viên BCH (2/9)"
                    subNote="Phó Ban TC-XDH (Cụm trưởng Khoa QTKD) • CHT 23QTKD01"
                  />
                  <PersonMiniCard
                    member={getStaffByOrder(13)}
                    roleBadge="Ủy viên BCH (3/9)"
                    subNote="Phó Ban TC-XDH (Cụm trưởng Khoa Kỹ thuật) • CHT 24KT01"
                  />
                  <PersonMiniCard
                    member={getStaffByOrder(11)}
                    roleBadge="Ủy viên BCH (4/9)"
                    subNote="Phó Ban TG-PT (Mảng Tuyên giáo) • Chi hội trưởng 25KT01"
                  />
                  <PersonMiniCard
                    member={getStaffByOrder(12)}
                    roleBadge="Ủy viên BCH (5/9)"
                    subNote="Phó Ban TG-PT (Mảng Tuyên giáo) • Chi hội phó 25CNTT01"
                  />
                  <PersonMiniCard
                    member={getStaffByOrder(9)}
                    roleBadge="Ủy viên BCH (6/9)"
                    subNote="Cán bộ Văn phòng HSV (Mảng Tài chính) • Chi hội trưởng 25QTKD01"
                  />
                  <PersonMiniCard
                    member={getStaffByOrder(14)}
                    roleBadge="Ủy viên BCH (7/9)"
                    subNote="Cán bộ Văn phòng HSV (Quản trị VP) • Chủ nhiệm CLB BEAM"
                  />
                  <PersonMiniCard
                    member={getStaffByOrder(10)}
                    roleBadge="Ủy viên BCH (8/9)"
                    subNote="Cán bộ Ban TG-PT • Chủ nhiệm CLB Nghệ thuật The Voice Up"
                  />
                  <PersonMiniCard
                    member={getStaffByOrder(7)}
                    roleBadge="Ủy viên BCH (9/9)"
                    subNote="Cán bộ Ban TG-PT • Phó Chủ nhiệm CLB Hiến máu tình nguyện"
                  />
                </div>
              </div>
            </div>

            {/* KHỐI BAN KIỂM TRA (05 ĐỒNG CHÍ) - 4 CỘT */}
            <div className="lg:col-span-4 space-y-4 bg-slate-50/70 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#0B2545]">
                    <Scale className="w-4 h-4 text-[#0054A6]" />
                    Ban Kiểm tra HSV Trường (05 Đồng chí)
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Kiểm tra việc chấp hành Điều lệ, Nghị quyết & Quy chế làm việc của BCH
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="text-[11px] font-bold uppercase text-amber-800">
                    ● Trưởng Ban Kiểm tra (01 Đồng chí – Phó Chủ tịch đảm nhiệm)
                  </div>
                  <PersonMiniCard
                    member={getStaffByOrder(3)}
                    roleBadge="Trưởng Ban Kiểm tra"
                    subNote="Phó Chủ tịch HSV Trường • Trưởng Ban Tổ chức & Xây dựng Hội"
                    accent="amber"
                  />

                  <div className="text-[11px] font-bold uppercase text-amber-800 pt-1">
                    ● Ủy viên BCH tham gia Ban Kiểm tra (01 Đồng chí)
                  </div>
                  <PersonMiniCard
                    member={getStaffByOrder(6)}
                    roleBadge="Phó Trưởng BKT / UV BKT"
                    subNote="Ủy viên BCH • Trưởng Ban TG-PT (Mảng Tuyên giáo)"
                    accent="amber"
                  />

                  <div className="text-[11px] font-bold uppercase text-slate-700 pt-1">
                    ● Ủy viên Ban Kiểm tra chuyên trách (03 Đồng chí)
                  </div>
                  <PersonMiniCard
                    member={getStaffByOrder(16)}
                    roleBadge="Ủy viên BKT (1/3)"
                    subNote="Phó Ban TG-PT (Mảng Phong trào) • PCN CLB The Voice Up"
                  />
                  <PersonMiniCard
                    member={getStaffByOrder(17)}
                    roleBadge="Ủy viên BKT (2/3)"
                    subNote="Phó Ban TC-XDH (Cụm trưởng Khoa CNTT) • CHP 25CNTT01"
                  />
                  <PersonMiniCard
                    member={getStaffByOrder(18)}
                    roleBadge="Ủy viên BKT (3/3)"
                    subNote="Phó Chánh Văn phòng HSV (Văn thư – Lưu trữ) • CHP 25QTKD01"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-600">
                Theo Quyết định <strong className="text-slate-900">16/QĐ-BTK-TC</strong> và Quy chế{' '}
                <strong className="text-slate-900">23/QĐ-HSV</strong>, Ban Kiểm tra định kỳ hàng quý
                báo cáo tình hình kiểm tra và xử lý phản ánh với BCH, BTK.
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            CẤP 02: KHỐI CÁC BAN CHUYÊN MÔN HỘI SINH VIÊN TRƯỜNG (03 BAN)
           ==================================================================== */}
        <section
          id="khoi-ban-chuyen-mon"
          className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
        >
          <div className="bg-[#0B2545] text-white px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-mono font-extrabold text-sm">
                02
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold">
                  KHỐI CÁC BAN CHUYÊN MÔN HỘI SINH VIÊN TRƯỜNG
                </h2>
                <p className="text-xs text-slate-300">
                  Bộ máy tham mưu, điều phối vận hành và triển khai hoạt động chuyên môn (Quyết định
                  24/QĐ-HSV)
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-md bg-white/10 border border-white/15 text-xs">
              Quy mô: <strong>03 Ban chuyên môn • 08 Tiểu ban • Đội CTVXK</strong>
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* HÀNG TRÊN: ĐƠN VỊ 01 (VĂN PHÒNG) & ĐƠN VỊ 02 (BAN TỔ CHỨC & XÂY DỰNG HỘI) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ĐƠN VỊ 01: VĂN PHÒNG HỘI SINH VIÊN TRƯỜNG */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-[#0054A6] text-white text-[10px] font-bold uppercase">
                        Đơn vị 01 • Phòng 206.B06
                      </span>
                      <h3 className="text-base font-bold text-[#0B2545] mt-1">
                        Văn phòng Hội Sinh viên trường
                      </h3>
                    </div>
                    <Briefcase className="w-5 h-5 text-[#0054A6]" />
                  </div>

                  {/* Cấp điều hành cao nhất: Chánh VP & Tổng Thư ký (Ngang cấp) */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase text-[#0054A6]">
                      ★ Cấp điều hành cao nhất (02 Đồng chí • Ngang cấp)
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <PersonMiniCard
                        member={getStaffByOrder(8)}
                        roleBadge="Chánh Văn phòng • Ngang cấp"
                        subNote="Phụ trách công tác đối ngoại với các phòng, ban trong nhà trường"
                        accent="teal"
                      />
                      <PersonMiniCard
                        member={getStaffByOrder(2)}
                        roleBadge="Tổng Thư ký • Ngang cấp"
                        subNote="Điều hành các tác vụ nội bộ của Văn phòng Hội Sinh viên trường"
                        accent="teal"
                      />
                    </div>
                  </div>

                  {/* Cấp Phó Văn phòng: 02 Phó Chánh Văn phòng */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase text-slate-700">
                      ● Cấp Phó Văn phòng (02 Phó Chánh Văn phòng)
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <PersonMiniCard
                        member={getStaffByOrder(19)}
                        roleBadge="Phó Chánh Văn phòng (1/2)"
                        subNote="Mảng Quản trị văn phòng • Phó Bí thư Đoàn Trường • CHT 24QTKD01"
                      />
                      <PersonMiniCard
                        member={getStaffByOrder(18)}
                        roleBadge="Phó Chánh Văn phòng (2/2)"
                        subNote="Mảng Văn thư – Lưu trữ • Ủy viên Ban Kiểm tra • CHP 25QTKD01"
                      />
                    </div>
                  </div>

                  {/* Lực lượng thực thi */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase text-slate-700">
                      ● Lực lượng thực thi (Cán bộ Văn phòng & CTV Văn phòng)
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <PersonMiniCard
                        member={getStaffByOrder(9)}
                        roleBadge="Cán bộ Văn phòng"
                        subNote="Phụ trách Mảng Tài chính – Quỹ Hội"
                      />
                      <PersonMiniCard
                        member={getStaffByOrder(14)}
                        roleBadge="Cán bộ Văn phòng"
                        subNote="Phụ trách Mảng Quản trị văn phòng & Tài sản 206.B06"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-medium text-slate-700">
                    + Đội ngũ Cộng tác viên Văn phòng (CTV ban)
                  </span>
                </div>
              </div>

              {/* ĐƠN VỊ 02: BAN TỔ CHỨC VÀ XÂY DỰNG HỘI */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-[#0054A6] text-white text-[10px] font-bold uppercase">
                        Đơn vị 02 • Tổ chức & Cơ sở Hội
                      </span>
                      <h3 className="text-base font-bold text-[#0B2545] mt-1">
                        Ban Tổ chức và Xây dựng Hội
                      </h3>
                    </div>
                    <Users className="w-5 h-5 text-[#0054A6]" />
                  </div>

                  {/* Cấp Trưởng ban */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase text-amber-800">
                      ★ Cấp Trưởng ban (01 Đồng chí)
                    </p>
                    <PersonMiniCard
                      member={getStaffByOrder(3)}
                      roleBadge="Trưởng Ban Tổ chức và Xây dựng Hội"
                      subNote="Phụ trách chung công tác tổ chức, nhân sự, phát triển Hội viên & tiếp nhận thẩm định Ngày tình nguyện trước 03 ngày"
                      accent="amber"
                    />
                  </div>

                  {/* Cấp Phó ban: 04 Cụm trưởng Khoa + 01 Quản lý CLB/Đội/Nhóm */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase text-slate-700">
                      ● Cấp Phó ban (05 Phó ban: 04 Cụm trưởng Khoa & 01 Quản lý CLB/Đội/Nhóm)
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <PersonMiniCard
                        member={getStaffByOrder(15)}
                        roleBadge="Phó Ban • Cụm trưởng QTKD"
                        subNote="Quản lý 06 Chi hội Khoa Quản trị Kinh doanh (21–26QTKD01)"
                      />
                      <PersonMiniCard
                        member={getStaffByOrder(13)}
                        roleBadge="Phó Ban • Cụm trưởng KT"
                        subNote="Quản lý 06 Chi hội Khoa Kỹ thuật (21–26KT01)"
                      />
                      <PersonMiniCard
                        member={getStaffByOrder(17)}
                        roleBadge="Phó Ban • Cụm trưởng CNTT"
                        subNote="Quản lý 07 Chi hội Khoa Công nghệ Thông tin (21–26CNTT)"
                      />
                      <PersonMiniCard
                        member={getStaffByOrder(5)}
                        roleBadge="Phó Ban • Cụm trưởng KHSK"
                        subNote="Quản lý 06 Chi hội Khoa Khoa học Sức khỏe (21–26KHSK01)"
                      />
                    </div>
                    <div className="pt-1">
                      <PersonMiniCard
                        member={getStaffByOrder(8)}
                        roleBadge="01 Phó Ban • Quản lý Khối CLB / Đội / Nhóm"
                        subNote="Phụ trách quản lý, đồng hành và điều phối hoạt động 30 CLB / Đội / Nhóm trực thuộc"
                        accent="teal"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-medium text-slate-700">
                    + Cán bộ Ban Tổ chức - Xây dựng Hội
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-medium text-slate-700">
                    + Cộng tác viên ban (CTV)
                  </span>
                </div>
              </div>
            </div>

            {/* HÀNG DƯỚI: ĐƠN VỊ 03 - BAN TUYÊN GIÁO - PHONG TRÀO (02 MẢNG CHUYÊN MÔN) */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <span className="px-2 py-0.5 rounded bg-amber-600 text-white text-[10px] font-bold uppercase">
                    Đơn vị 03 • Truyền thông, Sự kiện & SV5T
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#0B2545] mt-1">
                    Ban Tuyên giáo - Phong trào
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                  Cơ cấu: <strong>02 Mảng chuyên môn (Tuyên giáo & Phong trào)</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* MẢNG TUYÊN GIÁO */}
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h4 className="text-sm font-extrabold text-[#0054A6] uppercase flex items-center gap-1.5">
                        <Megaphone className="w-4 h-4" />
                        MẢNG TUYÊN GIÁO
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-[#F0F7FF] text-[#0054A6] text-[11px] font-bold">
                        03 Tiểu ban
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase text-slate-600">
                        ★ Trưởng mảng Tuyên giáo (01 Đồng chí)
                      </p>
                      <PersonMiniCard
                        member={getStaffByOrder(6)}
                        roleBadge="Trưởng Ban TG-PT (Trưởng mảng Tuyên giáo)"
                        subNote="Điều hành toàn diện hoạt động truyền thông, hình ảnh và tuyên truyền của Hội"
                        accent="teal"
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase text-slate-600">
                        ● Phó ban Mảng Tuyên giáo (02 Đồng chí)
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <PersonMiniCard
                          member={getStaffByOrder(11)}
                          roleBadge="Phó Ban (Mảng Tuyên giáo)"
                          subNote="Điều phối chuyên môn các tiểu ban Tuyên giáo"
                        />
                        <PersonMiniCard
                          member={getStaffByOrder(12)}
                          roleBadge="Phó Ban (Mảng Tuyên giáo)"
                          subNote="Điều phối chuyên môn các tiểu ban Tuyên giáo"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase text-slate-600">
                        ● 03 Tiểu ban trực thuộc Mảng Tuyên giáo
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {['Tiểu ban Design', 'Tiểu ban Video', 'Tiểu ban Photo'].map((tb) => (
                          <div
                            key={tb}
                            className="p-2.5 rounded-lg bg-[#F0F7FF] border border-sky-200 text-center text-xs font-bold text-[#0054A6]"
                          >
                            {tb}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <p className="font-semibold text-slate-800 mb-1">
                      Cán bộ Ban TG-PT & Cộng tác viên (CTV):
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Đ/c Phạm Thị Thanh Thủy, Đ/c Trịnh Nguyễn Nguyệt Ánh, Đ/c Nguyễn Đức Lê Hoàng,
                      Đ/c Nguyễn Thanh Nhã, Đ/c Trịnh Thị Phương Thủy, Đ/c Trần Nguyễn Quỳnh Trân &
                      đội ngũ CTV.
                    </p>
                  </div>
                </div>

                {/* MẢNG PHONG TRÀO & ĐỘI CTV XUNG KÍCH */}
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-amber-200/80 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h4 className="text-sm font-extrabold text-amber-800 uppercase flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        MẢNG PHONG TRÀO
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                        03 Tiểu ban & Đội CTVXK
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase text-amber-800">
                        ★ Trưởng mảng Phong trào (01 Đồng chí)
                      </p>
                      <PersonMiniCard
                        member={getStaffByOrder(4)}
                        roleBadge="Trưởng Ban TG-PT (Trưởng mảng Phong trào)"
                        subNote="Điều hành toàn diện các chương trình, sự kiện, chiến dịch và phong trào Sinh viên 5 Tốt"
                        accent="amber"
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase text-slate-600">
                        ● Phó ban Mảng Phong trào (02 Đồng chí)
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <PersonMiniCard
                          member={getStaffByOrder(16)}
                          roleBadge="Phó Ban (Mảng Phong trào)"
                          subNote="Điều phối nội dung, tài chính, kịch bản & MC"
                        />
                        <PersonMiniCard
                          member={getStaffByOrder(20)}
                          roleBadge="Phó Ban (Mảng Phong trào)"
                          subNote="Đội trưởng Đội CTV Xung kích • Điều phối Hậu cần & Lễ tân"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase text-amber-800">
                        ● 03 Tiểu ban trực thuộc Mảng Phong trào
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          'Tiểu ban Tài chính',
                          'Tiểu ban Nội dung - Kịch bản',
                          'Tiểu ban MC',
                        ].map((tb) => (
                          <div
                            key={tb}
                            className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-center text-xs font-bold text-amber-900"
                          >
                            {tb}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* HỘP LỒNG: ĐỘI CỘNG TÁC VIÊN XUNG KÍCH (ĐỘI CTVXK) */}
                    <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300">
                          <Zap className="w-4 h-4" />
                          Đội Cộng tác viên Xung kích (Đội CTVXK)
                        </span>
                        <Link
                          href="/to-chuc/doi-cong-tac-vien-xung-kich"
                          className="text-[11px] text-sky-300 hover:underline"
                        >
                          Mở Micro-site →
                        </Link>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Trực thuộc Mảng Phong trào (Đội trưởng:{' '}
                        <strong className="text-white">Đ/c Nguyễn Thanh Đạt</strong>), được giao
                        quản lý trực tiếp 02 tiểu ban:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-xs font-semibold text-white">
                          1. Tiểu ban Hậu cần - Sân khấu
                        </div>
                        <div className="px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-xs font-semibold text-white">
                          2. Tiểu ban Lễ tân - Khánh tiết - Văn thể mỹ
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            CẤP 03A & 03B: KHỐI 25 CHI HỘI & 30 CLB / ĐỘI / NHÓM TRỰC THUỘC
           ==================================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 3A: 25 CHI HỘI */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-[#0054A6] text-white flex items-center justify-center font-mono font-bold text-xs">
                    3A
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-[#0B2545]">
                      KHỐI CHI HỘI TRỰC THUỘC (25 CHI HỘI)
                    </h3>
                    <p className="text-xs text-slate-500">
                      04 Cụm hoạt động Khoa & 06 Cụm thi đua khóa (2021 – 2026)
                    </p>
                  </div>
                </div>
                <Link
                  href="/to-chuc?tab=branches"
                  className="text-xs font-bold text-[#0054A6] hover:underline"
                >
                  Xem 25 Chi hội →
                </Link>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-xs font-bold text-[#0B2545]">
                  ★ Cơ cấu chuẩn mỗi Chi hội (05 Đồng chí BCH Chi hội):
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-[#0054A6] text-white font-semibold">
                    01 Chi hội trưởng
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-sky-100 text-[#0054A6] font-semibold">
                    02 Chi hội phó
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-medium">
                    02 Ủy viên BCH Chi hội
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 font-medium">
                    ★ Hội viên ưu tú & Hội viên Chi hội
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">
                      1. Khoa Quản trị Kinh doanh (QTKD) • 06 Chi hội
                    </p>
                    <p className="text-slate-500 font-mono text-[11px] mt-0.5">
                      21QTKD01 • 22QTKD01 • 23QTKD01 • 24QTKD01 • 25QTKD01 • 26QTKD01
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-[#0054A6] shrink-0">
                    Đ/c Phương Thủy
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">
                      2. Khoa Kỹ thuật (KT) • 06 Chi hội
                    </p>
                    <p className="text-slate-500 font-mono text-[11px] mt-0.5">
                      21KT01 • 22KT01 • 23KT01 • 24KT01 • 25KT01 • 26KT01
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-[#0054A6] shrink-0">
                    Đ/c Thanh Nhã
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">
                      3. Khoa Công nghệ Thông tin (CNTT) • 07 Chi hội
                    </p>
                    <p className="text-slate-500 font-mono text-[11px] mt-0.5">
                      21CNTT01 • 22CNTT01 • 23CNTT01 • 24CNTT01 • 25CNTT01 • 25CNTT02 • 26CNTT01
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-[#0054A6] shrink-0">
                    Đ/c Quỳnh Trân
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">
                      4. Khoa Khoa học Sức khỏe (KHSK) • 06 Chi hội
                    </p>
                    <p className="text-slate-500 font-mono text-[11px] mt-0.5">
                      21KHSK01 • 22KHSK01 • 23KHSK01 • 24KHSK01 • 25KHSK01 • 26KHSK01
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-[#0054A6] shrink-0">
                    Đ/c Thanh Thủy
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3B: 30 CLB / ĐỘI / NHÓM */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-mono font-bold text-xs">
                    3B
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-[#0B2545]">
                      KHỐI CLB / ĐỘI / NHÓM TRỰC THUỘC (30 ĐƠN VỊ)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Phụ trách điều phối chung: Đ/c Nguyễn Mỹ Hạnh (Phó Ban TC-XDH)
                    </p>
                  </div>
                </div>
                <Link
                  href="/to-chuc?tab=clubs"
                  className="text-xs font-bold text-[#0054A6] hover:underline"
                >
                  Xem 30 CLB/Đội →
                </Link>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-xs font-bold text-[#0B2545]">
                  ★ Cơ cấu chuẩn mỗi CLB / Đội / Nhóm (05 Đồng chí Ban Chủ nhiệm):
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-[#0B2545] text-white font-semibold">
                    01 Chủ nhiệm / Đội trưởng
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-sky-100 text-[#0054A6] font-semibold">
                    02 Phó Chủ nhiệm
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-medium">
                    02 Ủy viên Ban Chủ nhiệm
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                    Thành viên chính thức & CTV
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-amber-800">
                    ★ Đơn vị nòng cốt của Hội (02)
                  </span>
                  <p className="font-bold text-[#0B2545]">1. CLB Cộng đồng Sinh viên 5 tốt</p>
                  <p className="text-[11px] text-slate-600">
                    Chủ nhiệm: <strong>Đ/c Nguyễn Mai Gia Tường</strong>
                  </p>
                  <p className="font-bold text-[#0B2545] pt-1">2. Đội Cộng tác viên Xung kích</p>
                  <p className="text-[11px] text-slate-600">
                    Đội trưởng: <strong>Đ/c Nguyễn Thanh Đạt</strong>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-[#0054A6]">
                    ● 04 Khối lĩnh vực hoạt động (30 đơn vị)
                  </span>
                  <p className="text-slate-700">
                    • <strong>Khối Học thuật (06 CLB):</strong> Honors, IT, Finance, Korean,
                    Technical, Economics
                  </p>
                  <p className="text-slate-700">
                    • <strong>Khối Nghệ thuật (10 CLB):</strong> The Voice Up, Kurume, Soarers,
                    Bumblebee, Passion, EPC...
                  </p>
                  <p className="text-slate-700">
                    • <strong>Khối Thể thao (07 CLB):</strong> FireLions, Football, Volleyball,
                    Badminton, Ping-Pong, Calisthenics, Taekwondo
                  </p>
                  <p className="text-slate-700">
                    • <strong>Khối Cộng đồng (07 CLB/Đội):</strong> SV5T, CTVXK, Sunshine, Blood
                    Donation, BEAM, Hospitality, First Aid
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            DANH BẠ NHÂN SỰ TRÍCH NGANG ĐẦY ĐỦ (20 ĐỒNG CHÍ CHỦ CHỐT KHÓA II)
           ==================================================================== */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0054A6]">
                Danh bạ Điện tử Cán bộ Hội • Trích xuất từ Hồ sơ Nhân sự Khóa II
              </span>
              <h2 className="text-xl font-bold text-[#0B2545] mt-0.5">
                Danh Sách 20 Đồng Chí BCH, BTK, BKT & Các Ban Chuyên Môn
              </h2>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm tên, MSSV, email, chức vụ..."
                  className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-[#0054A6] w-60"
                />
              </div>
              <select
                aria-label="Lọc theo đơn vị"
                value={unitFilter}
                onChange={(e) => setUnitFilter(e.target.value as typeof unitFilter)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="ALL">Tất cả (20 đồng chí)</option>
                <option value="BTK">Ban Thư ký (05 đ/c)</option>
                <option value="BCH">Ban Chấp hành (15 đ/c)</option>
                <option value="BKT">Ban Kiểm tra (05 đ/c)</option>
                <option value="VP-HSV">Văn phòng HSV (06 đ/c)</option>
                <option value="BAN-TCXDH">Ban Tổ chức & Xây dựng Hội (06 đ/c)</option>
                <option value="BAN-TGPT">Ban Tuyên giáo - Phong trào (12 đ/c)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-600">
                  <th className="py-3 px-3">STT</th>
                  <th className="py-3 px-3">Họ và tên / Email EIU</th>
                  <th className="py-3 px-3">MSSV / Khoa - Ngành</th>
                  <th className="py-3 px-3">Chức vụ BCH / BKT</th>
                  <th className="py-3 px-3">Chức vụ Bộ máy Nội bộ</th>
                  <th className="py-3 px-3">Chức vụ Cơ sở Hội</th>
                  <th className="py-3 px-3 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {filteredStaff.map((member) => (
                  <tr
                    key={member.id}
                    onClick={() => setSelectedStaff(member)}
                    className="hover:bg-sky-50/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-slate-500">
                      {String(member.orderNumber).padStart(2, '0')}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-[#0B2545]">{member.fullName}</p>
                      <p className="font-mono text-[11px] text-[#0054A6]">{member.email}</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-mono font-semibold text-slate-800">{member.studentId}</p>
                      <p className="text-[11px] text-slate-500">
                        {member.facultyCode} • {member.majorName}
                      </p>
                    </td>
                    <td className="py-3 px-3 space-y-1">
                      {member.bchRole !== 'Không' && (
                        <span className="inline-block px-2 py-0.5 rounded bg-[#F0F7FF] text-[#0054A6] border border-sky-200 font-semibold text-[11px]">
                          {member.bchRole}
                        </span>
                      )}
                      {member.bktRole !== 'Không' && (
                        <span className="block px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[11px] w-fit">
                          {member.bktRole}
                        </span>
                      )}
                      {member.bchRole === 'Không' && member.bktRole === 'Không' && (
                        <span className="text-slate-400">Cán bộ bổ nhiệm chuyên môn</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium max-w-xs">
                      {member.internalDeptRole}
                    </td>
                    <td className="py-3 px-3 text-slate-700">{member.grassrootsRole}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStaff(member);
                        }}
                        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-[#0054A6] hover:text-white text-slate-700 font-semibold text-[11px] transition-colors"
                      >
                        Hồ sơ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* MODAL XEM HỒ SƠ CHI TIẾT CÁN BỘ HỘI & GIẢI MÃ MSSV */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F0F7FF] text-[#0054A6] border border-sky-200">
                  Hồ sơ Cán bộ Hội Khóa II (#{String(selectedStaff.orderNumber).padStart(2, '0')})
                </span>
                <h3 className="text-xl font-extrabold text-[#0B2545] mt-1">
                  Đồng chí {selectedStaff.fullName}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedStaff.academicYearText} • Ngành {selectedStaff.majorName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStaff(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-slate-500">Mã số sinh viên (MSSV):</p>
                <p className="font-mono font-bold text-sm text-[#0B2545]">
                  {selectedStaff.studentId}
                </p>
                {selectedStaff.studentId !== '-' && (
                  <p className="text-[11px] text-slate-500">
                    Khóa {decodeEiuStudentId(selectedStaff.studentId).enrollmentYear} •{' '}
                    {decodeEiuStudentId(selectedStaff.studentId).programType}
                  </p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-slate-500">Liên hệ công tác:</p>
                <p className="font-mono font-semibold text-[#0054A6] break-all">
                  {selectedStaff.email}
                </p>
                <p className="text-slate-700">
                  SĐT: <strong>{selectedStaff.phone}</strong> • Quê quán: {selectedStaff.hometown}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F0F7FF] border border-sky-200 space-y-1.5">
                <p className="font-bold text-[#0054A6] uppercase text-[11px]">
                  Chức vụ trong Hội Sinh viên & Đoàn Thanh niên:
                </p>
                <p>
                  • <strong>Ban Chấp hành HSV Trường:</strong> {selectedStaff.bchRole}
                </p>
                <p>
                  • <strong>Ban Kiểm tra HSV Trường:</strong> {selectedStaff.bktRole}
                </p>
                <p>
                  • <strong>Bộ máy nội bộ (Văn phòng / Ban Chuyên môn):</strong>{' '}
                  {selectedStaff.internalDeptRole}
                </p>
                <p>
                  • <strong>Chức vụ ở Cơ sở Hội:</strong> {selectedStaff.grassrootsRole}
                </p>
                <p>
                  • <strong>Chức vụ Đoàn TNCS Hồ Chí Minh:</strong> {selectedStaff.youthUnionTitle}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="font-bold text-slate-800 uppercase text-[11px]">
                  Các ngữ cảnh phân quyền kiêm nhiệm trên hệ thống (Context Switcher):
                </p>
                <div className="space-y-1.5">
                  {selectedStaff.positions.map((pos) => (
                    <div
                      key={pos.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200"
                    >
                      <div>
                        <p className="font-bold text-[#0B2545]">{pos.positionTitle}</p>
                        <p className="text-[11px] text-slate-500">{pos.unitName}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] font-bold">
                        Cấp {pos.roleLevel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedStaff(null)}
                className="px-4 py-2 rounded-lg bg-[#0054A6] text-white text-xs font-semibold cursor-pointer"
              >
                Đóng hồ sơ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
