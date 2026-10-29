'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SubpageBanner } from '@/components/public/subpage-banner';
import {
  BRANCH_UNITS,
  CLUB_UNITS,
  FACULTY_METADATA,
} from '@/data/mock-data';
import { ClubCategory, FacultyCode } from '@/types';
import { ChevronRight, ExternalLink } from 'lucide-react';

type UnitMenuTab =
  | 'ALL_CLUBS'
  | 'CONG_DONG'
  | 'HOC_THUAT'
  | 'NGHE_THUAT'
  | 'THE_THAO'
  | 'BRANCHES_ALL'
  | 'BRANCHES_BBS'
  | 'BRANCHES_SET'
  | 'BRANCHES_CIT'
  | 'BRANCHES_SNS';

const MENU_ITEMS: { id: UnitMenuTab; label: string; heading: string }[] = [
  {
    id: 'ALL_CLUBS',
    label: 'Tất cả 30 CLB – Đội – Nhóm',
    heading: 'DANH SÁCH 30 CÂU LẠC BỘ – ĐỘI – NHÓM TRỰC THUỘC',
  },
  {
    id: 'CONG_DONG',
    label: 'Khối Cộng đồng & Tình nguyện (07)',
    heading: 'KHỐI CÂU LẠC BỘ – ĐỘI CỘNG ĐỒNG & TÌNH NGUYỆN (07 ĐƠN VỊ)',
  },
  {
    id: 'HOC_THUAT',
    label: 'Khối Học thuật (06)',
    heading: 'KHỐI CÂU LẠC BỘ HỌC THUẬT (06 ĐƠN VỊ)',
  },
  {
    id: 'NGHE_THUAT',
    label: 'Khối Nghệ thuật (10)',
    heading: 'KHỐI CÂU LẠC BỘ – NHÓM NGHỆ THUẬT (10 ĐƠN VỊ)',
  },
  {
    id: 'THE_THAO',
    label: 'Khối Thể thao (07)',
    heading: 'KHỐI CÂU LẠC BỘ THỂ THAO (07 ĐƠN VỊ)',
  },
  {
    id: 'BRANCHES_ALL',
    label: 'Tất cả 25 Chi hội (04 Khoa)',
    heading: 'DANH SÁCH 25 CHI HỘI TRỰC THUỘC 04 CỤM KHOA',
  },
  {
    id: 'BRANCHES_BBS',
    label: 'Cụm Khoa QTKD (06 Chi hội)',
    heading: 'CỤM CHI HỘI KHOA QUẢN TRỊ KINH DOANH (06 CHI HỘI)',
  },
  {
    id: 'BRANCHES_SET',
    label: 'Cụm Khoa Kỹ thuật (06 Chi hội)',
    heading: 'CỤM CHI HỘI KHOA KỸ THUẬT (06 CHI HỘI)',
  },
  {
    id: 'BRANCHES_CIT',
    label: 'Cụm Khoa CNTT (07 Chi hội)',
    heading: 'CỤM CHI HỘI KHOA CÔNG NGHỆ THÔNG TIN (07 CHI HỘI)',
  },
  {
    id: 'BRANCHES_SNS',
    label: 'Cụm Khoa KH Sức khỏe (06 Chi hội)',
    heading: 'CỤM CHI HỘI KHOA KHOA HỌC SỨC KHỎE (06 CHI HỘI)',
  },
];

export default function ToChucPage() {
  const [activeMenu, setActiveMenu] = useState<UnitMenuTab>('ALL_CLUBS');
  const [search, setSearch] = useState('');

  const currentMenuMeta =
    MENU_ITEMS.find((m) => m.id === activeMenu) || MENU_ITEMS[0];
  const isBranchView = activeMenu.startsWith('BRANCHES_');

  const filteredClubs = CLUB_UNITS.filter((c) => {
    const matchCategory =
      activeMenu === 'ALL_CLUBS' ||
      c.category === (activeMenu as ClubCategory);
    const matchText =
      !search.trim() ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.shortName.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchText;
  });

  const filteredBranches = BRANCH_UNITS.filter((b) => {
    const targetFaculty = activeMenu.replace('BRANCHES_', '') as
      | 'ALL'
      | FacultyCode;
    const matchFaculty =
      targetFaculty === 'ALL' || b.facultyCode === targetFaculty;
    const matchText =
      !search.trim() ||
      b.code.toLowerCase().includes(search.toLowerCase()) ||
      b.name.toLowerCase().includes(search.toLowerCase());
    return matchFaculty && matchText;
  });

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <SubpageBanner
        title="Hệ thống 25 Chi hội & 30 Câu lạc bộ"
        subtitle="Quản lý bởi Ban Tổ chức và Xây dựng Hội — Hội Sinh viên Trường Đại học Quốc tế Miền Đông"
        breadcrumbs={[{ label: 'Chi hội & CLB' }]}
      />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI (3/12): Menu dọc Đỏ #C10230 / Vàng kem #EAE3D2 chuẩn eiu.edu.vn */}
          <aside
            aria-label="Phân loại đơn vị"
            className="lg:col-span-3 flex flex-col divide-y divide-white border border-slate-200/80"
          >
            {MENU_ITEMS.map((item) => {
              const isSelected = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveMenu(item.id)}
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

          {/* CỘT PHẢI (9/12): Nội dung danh sách đơn vị */}
          <div className="lg:col-span-9 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display">
                {currentMenuMeta.heading}
              </h2>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm nhanh theo tên hoặc mã..."
                aria-label="Tìm nhanh đơn vị"
                className="h-9 px-3 bg-white border border-slate-300 text-xs text-slate-900 rounded w-full sm:w-56"
              />
            </div>

            {!isBranchView ? (
              /* Lưới 3 cột vuông vức cho 30 CLB / Đội / Nhóm */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {filteredClubs.map((club) => (
                  <article
                    key={club.id}
                    className="bg-white border border-slate-200/80 flex flex-col justify-between"
                  >
                    <div
                      className={`h-28 p-4 flex flex-col justify-between text-white ${
                        club.isCoreUnionUnit ? 'bg-[#C10230]' : 'bg-[#133F68]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-white/85">
                        <span>{club.categoryLabel}</span>
                        <span>{club.memberCount} TV</span>
                      </div>
                      <div className="text-sm font-bold leading-snug font-eiu-display">
                        {club.shortName}
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-1.5">
                        <h3 className="text-sm font-bold text-[#133F68] leading-snug">
                          {club.name}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {club.description}
                        </p>
                      </div>

                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <Link
                          href={`/to-chuc/${club.slug}`}
                          className="inline-flex items-center gap-1 font-bold uppercase text-[#133F68] hover:text-[#C10230]"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                          <span>CHI TIẾT</span>
                        </Link>
                        {club.fanpageUrl && (
                          <a
                            href={club.fanpageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-slate-500 hover:text-[#0054A6]"
                          >
                            <span>Fanpage</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* Bảng kẻ khung chuẩn trang "Thông tin học phí" trên eiu.edu.vn cho 25 Chi hội */
              <div className="bg-white border border-slate-300 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#EFEFEF] text-slate-900 border-b border-slate-300">
                      <th className="py-3 px-3.5 font-bold border-r border-slate-300 w-12">
                        TT
                      </th>
                      <th className="py-3 px-3.5 font-bold border-r border-slate-300">
                        Mã Chi hội
                      </th>
                      <th className="py-3 px-3.5 font-bold border-r border-slate-300">
                        Cụm Khoa &amp; Khóa
                      </th>
                      <th className="py-3 px-3.5 font-bold border-r border-slate-300">
                        Cụm trưởng phụ trách
                      </th>
                      <th className="py-3 px-3.5 font-bold border-r border-slate-300">
                        Tỷ lệ SV5T
                      </th>
                      <th className="py-3 px-3.5 font-bold text-right">
                        Chi tiết
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {filteredBranches.map((b, idx) => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3.5 border-r border-slate-300 font-mono text-slate-600">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3.5 border-r border-slate-300 font-mono font-bold text-[#133F68]">
                          {b.code}
                        </td>
                        <td className="py-3 px-3.5 border-r border-slate-300 text-slate-700">
                          {FACULTY_METADATA[b.facultyCode].nameVi} (Khóa 20{b.cohortYear})
                        </td>
                        <td className="py-3 px-3.5 border-r border-slate-300 text-slate-700">
                          {b.clusterLeaderName}
                        </td>
                        <td className="py-3 px-3.5 border-r border-slate-300 font-mono font-semibold text-slate-800">
                          {b.sv5tAchievedRate}% (ĐK: {b.sv5tRegisteredRate}%)
                        </td>
                        <td className="py-3 px-3.5 text-right">
                          <Link
                            href={`/to-chuc/${b.slug}`}
                            className="font-bold text-[#0054A6] hover:underline"
                          >
                            Xem →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
