'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRole } from '@/context/role-context';
import {
  Award,
  Building2,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  FileBadge,
  FileSpreadsheet,
  FolderKanban,
  Globe,
  LayoutDashboard,
  Menu,
  MessageSquareWarning,
  ShieldCheck,
  Stamp,
  UserCircle2,
  Users,
  X,
} from 'lucide-react';

const SIDEBAR_SECTIONS = [
  {
    groupLabel: 'ĐIỀU HÀNH CHUNG',
    items: [
      {
        id: 'overview',
        label: 'Tổng quan Điều hành',
        badge: 'Live',
        icon: LayoutDashboard,
        href: '/workspace#overview',
      },
      {
        id: 'Units',
        label: 'Quản lý 25 Chi hội & 30 CLB',
        badge: '55',
        icon: Users,
        href: '/workspace#units',
      },
    ],
  },
  {
    groupLabel: 'NGHIỆP VỤ TRỌNG TÂM (QĐ 09 & 28)',
    items: [
      {
        id: 'certificates',
        label: 'Duyệt Ngày TN & Cấp GCN',
        badge: 'SLA 7d',
        icon: FileBadge,
        href: '/workspace#certificates',
      },
      {
        id: 'sv5t',
        label: 'Hội đồng Xét chọn SV5T',
        badge: '3 cấp',
        icon: Award,
        href: '/workspace#sv5t',
      },
      {
        id: 'collective-sv5t',
        label: 'Bảng Tập thể SV5T (Chi hội)',
        badge: '≥30%',
        icon: FileSpreadsheet,
        href: '/workspace#collective-sv5t',
      },
    ],
  },
  {
    groupLabel: 'BAN CHUYÊN MÔN & VĂN PHÒNG (QĐ 23 & 24)',
    items: [
      {
        id: 'tgpt',
        label: 'Ban TG-PT & Đội CTV Xung kích',
        badge: '8 TB',
        icon: FolderKanban,
        href: '/workspace#tgpt',
      },
      {
        id: 'office',
        label: 'Văn phòng 206.B06 & Con dấu',
        badge: 'VP',
        icon: Stamp,
        href: '/workspace#office',
      },
      {
        id: 'meetings',
        label: 'Họp Không giấy & Ban Kiểm tra',
        badge: 'BCH/BKT',
        icon: CalendarCheck,
        href: '/workspace#meetings',
      },
      {
        id: 'voice',
        label: 'Hộp thư Lắng nghe Sinh viên',
        badge: '03 mới',
        icon: MessageSquareWarning,
        href: '/workspace#voice',
      },
    ],
  },
];

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentPersona, activePosition, setActivePositionById } = useRole();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <div className="flex-1 flex relative">
        {/* Sidebar Desktop */}
        <aside
          className={`hidden lg:flex flex-col bg-[#0B2545] text-white border-r border-slate-800 transition-all duration-200 shrink-0 ${
            collapsed ? 'w-20' : 'w-72'
          }`}
        >
          {/* Logo & Tên E-Office */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between gap-2">
            <Link href="/workspace" className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#0054A6] border border-sky-400/30 flex items-center justify-center font-bold text-white shrink-0 shadow-sm">
                HSV
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <div className="text-xs font-bold tracking-wider uppercase text-sky-300 truncate">
                    E-OFFICE KHÓA II
                  </div>
                  <div className="text-sm font-bold text-white truncate">
                    Bàn làm việc Cán bộ
                  </div>
                </div>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? 'Mở rộng Sidebar' : 'Thu gọn Sidebar'}
              className="p-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Hộp hiển thị Ngữ cảnh Kiêm nhiệm đang kích hoạt */}
          {!collapsed && (
            <div className="p-3.5 m-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-400">
                  Tư cách làm việc hiện tại
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0054A6] text-white">
                  Cấp {activePosition.roleLevel}/6
                </span>
              </div>
              <div className="text-xs font-bold text-white leading-snug">
                {activePosition.positionTitle}
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5 truncate">
                Đơn vị: {activePosition.unitName}
              </div>
              {currentPersona.positions.length > 1 && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/90">
                  <label className="block text-[10px] text-slate-400 mb-1">
                    Chuyển nhanh vai trò kiêm nhiệm ({currentPersona.positions.length}):
                  </label>
                  <select
                    value={activePosition.id}
                    onChange={(e) => setActivePositionById(e.target.value)}
                    className="w-full text-xs bg-slate-800 text-white border border-slate-700 rounded-lg px-2 py-1.5 focus:outline-none focus:border-sky-400"
                  >
                    {currentPersona.positions.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        [Cấp {pos.roleLevel}] {pos.positionTitle}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Danh mục điều hướng phân hệ E-Office */}
          <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
            {SIDEBAR_SECTIONS.map((section) => (
              <div key={section.groupLabel}>
                {!collapsed && (
                  <div className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {section.groupLabel}
                  </div>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.id}
                        href={item.href}
                        className="flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-[#0054A6] hover:text-white transition-colors group"
                        title={collapsed ? item.label : undefined}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className="w-4 h-4 shrink-0 text-sky-300 group-hover:text-white" />
                          {!collapsed && (
                            <span className="truncate">{item.label}</span>
                          )}
                        </div>
                        {!collapsed && item.badge && (
                          <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-800 text-sky-200 group-hover:bg-white/20 group-hover:text-white shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer thông tin trụ sở Văn phòng 206.B06 */}
          <div className="p-3 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-2">
            {!collapsed ? (
              <div className="bg-slate-900/70 rounded-lg p-2.5 border border-slate-800">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-sky-400" />
                  Văn phòng HSV: Phòng 206.B06
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  ĐM: youth.union@eiu.edu.vn
                </div>
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-1">
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200"
                title="Về Cổng thông tin Public"
              >
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                {!collapsed && <span>Public</span>}
              </Link>
              <Link
                href="/portal"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200"
                title="Về Sổ tay Hội viên"
              >
                <UserCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {!collapsed && <span>Portal</span>}
              </Link>
            </div>
          </div>
        </aside>

        {/* Drawer Sidebar trên Mobile */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative w-72 max-w-[85vw] bg-[#0B2545] text-white flex flex-col h-full z-10 shadow-2xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0054A6] flex items-center justify-center font-bold text-xs">
                    HSV
                  </div>
                  <div>
                    <div className="text-xs font-bold text-sky-300">
                      E-OFFICE HSV EIU
                    </div>
                    <div className="text-xs text-slate-300">
                      Phòng 206.B06
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-3 space-y-4">
                {SIDEBAR_SECTIONS.map((section) => (
                  <div key={section.groupLabel}>
                    <div className="px-2 mb-1 text-[10px] font-bold uppercase text-slate-400">
                      {section.groupLabel}
                    </div>
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <a
                            key={item.id}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-[#0054A6]"
                          >
                            <span className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-sky-300" />
                              {item.label}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800">
                              {item.badge}
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Khu vực Nội dung chính của Workspace */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar Nội bộ */}
          <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                aria-label="Mở menu quản trị"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm sm:text-base font-bold text-[#0B2545]">
                    Hệ thống Quản trị & Điều hành Nội bộ (E-Office)
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0054A6] border border-blue-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Khóa II (2026 – 2028)
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Đang thao tác dưới quyền:{' '}
                  <strong className="text-slate-800">
                    {currentPersona.fullName}
                  </strong>{' '}
                  • <span className="text-[#0054A6] font-medium">{activePosition.positionTitle}</span> ({activePosition.unitName})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/portal"
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
              >
                Sổ tay Hội viên
              </Link>
              <Link
                href="/gioi-thieu"
                className="px-3 py-1.5 rounded-lg bg-[#0054A6] hover:bg-blue-800 text-xs font-semibold text-white transition-colors"
              >
                Sơ đồ Tổ chức
              </Link>
            </div>
          </header>

          {/* Main Workspace Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
