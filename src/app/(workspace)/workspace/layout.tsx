'use client';

import React, { useEffect, useState } from 'react';
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
  ShieldCheck,
  Stamp,
  UserCircle2,
  X,
} from 'lucide-react';

export type WorkspaceModuleId =
  | 'overview'
  | 'certificates'
  | 'sv5t'
  | 'collective'
  | 'tgpt'
  | 'office'
  | 'meetings';

export const WORKSPACE_MODULES: {
  id: WorkspaceModuleId;
  label: string;
  shortDesc: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'overview',
    label: 'Tổng quan Điều hành',
    shortDesc: 'Bảng chỉ số KPI & Bàn làm việc trung tâm',
    badge: 'Trung tâm',
    icon: LayoutDashboard,
  },
  {
    id: 'certificates',
    label: 'Duyệt Ngày TN & Cấp GCN',
    shortDesc: 'Thẩm định trước 03 ngày & SLA 07 ngày (QĐ 28)',
    badge: 'SLA 7d',
    icon: FileBadge,
  },
  {
    id: 'sv5t',
    label: 'Hội đồng Xét chọn SV5T',
    shortDesc: 'Xét duyệt 3 cấp & Lọc Top 10% Tiêu biểu (QĐ 09)',
    badge: 'Top 10%',
    icon: Award,
  },
  {
    id: 'collective',
    label: 'Tập thể SV5T (25 Chi hội)',
    shortDesc: 'Theo dõi 100% ĐK & ≥30% đạt tại 04 Cụm Khoa',
    badge: '25 Chi hội',
    icon: FileSpreadsheet,
  },
  {
    id: 'tgpt',
    label: 'Ban TG-PT & Đội CTVXK',
    shortDesc: '02 Mảng, 06 Tiểu ban & Đội CTV Xung kích',
    badge: '08 Tiểu ban',
    icon: FolderKanban,
  },
  {
    id: 'office',
    label: 'Văn phòng 206.B06 & Con dấu',
    shortDesc: 'Lịch trực, Tài sản & Sổ đóng dấu Mộc (QĐ 24)',
    badge: '206.B06',
    icon: Stamp,
  },
  {
    id: 'meetings',
    label: 'Họp Không Giấy & Ban Kiểm Tra',
    shortDesc: 'Họp BCH/BTK (QĐ 23) & Hộp thư Giám sát',
    badge: 'BCH/BKT',
    icon: CalendarCheck,
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
  const [activeModule, setActiveModule] = useState<WorkspaceModuleId>('overview');

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace('#', '') as WorkspaceModuleId;
      if (WORKSPACE_MODULES.some((m) => m.id === hash)) {
        setActiveModule(hash);
      }
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const selectModule = (id: WorkspaceModuleId) => {
    setActiveModule(id);
    window.history.replaceState(null, '', `#${id}`);
    window.dispatchEvent(new CustomEvent('workspace-module-change', { detail: id }));
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-[#0F172A]">
      <div className="flex-1 flex relative">
        {/* Sidebar Desktop — Màu #133F68 chuẩn eiu.edu.vn */}
        <aside
          aria-label="Thanh điều hướng E-Office"
          className={`hidden lg:flex flex-col bg-[#133F68] text-white border-r border-white/10 transition-all duration-200 shrink-0 ${
            collapsed ? 'w-20' : 'w-72'
          }`}
        >
          {/* Logo EIU & Tên E-Office */}
          <div className="p-4 border-b border-white/15 flex items-center justify-between gap-2">
            <Link href="/workspace" className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 p-1">
                <img
                  src="/images/eiu-logo.png"
                  alt="EIU"
                  className="w-full h-full object-contain"
                />
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <div className="text-[11px] font-bold tracking-wider uppercase text-[#FCB900] font-eiu-display truncate">
                    E-OFFICE HSV EIU
                  </div>
                  <div className="text-sm font-bold text-white truncate font-eiu-display">
                    Quản Trị Nội Bộ
                  </div>
                </div>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'}
              className="min-h-9 min-w-9 inline-flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Ngữ cảnh Kiêm nhiệm đang kích hoạt */}
          {!collapsed && (
            <div className="p-3.5 m-3 rounded-xl bg-[#0D2E4D] border border-white/15 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#DED1BE]">
                  Tư cách tác nghiệp
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#A68556] text-white">
                  Cấp {activePosition.roleLevel}/6
                </span>
              </div>
              <div className="text-xs font-bold text-white leading-snug">
                {activePosition.positionTitle}
              </div>
              <div className="text-xs text-[#DED1BE] truncate">
                {activePosition.unitName}
              </div>

              {currentPersona.positions.length > 1 && (
                <div className="pt-2 border-t border-white/10">
                  <label
                    htmlFor="sidebar-role-select"
                    className="block text-[11px] text-[#DED1BE] mb-1"
                  >
                    Đổi vai trò kiêm nhiệm ({currentPersona.positions.length}):
                  </label>
                  <select
                    id="sidebar-role-select"
                    value={activePosition.id}
                    onChange={(e) => setActivePositionById(e.target.value)}
                    className="w-full min-h-9 text-xs bg-[#133F68] text-white border border-white/25 rounded-lg px-2.5 py-1.5"
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

          {/* Danh sách 7 Phân hệ (Single-View Switcher theo Apple HIG) */}
          <nav
            aria-label="Phân hệ nghiệp vụ E-Office"
            className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5"
          >
            {WORKSPACE_MODULES.map((item) => {
              const Icon = item.icon;
              const isSelected = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectModule(item.id)}
                  aria-current={isSelected ? 'page' : undefined}
                  title={collapsed ? item.label : undefined}
                  className={`w-full min-h-11 flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-[#A68556] text-white shadow-xs'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-white' : 'text-[#FCB900]'
                      }`}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </span>
                  {!collapsed && (
                    <span
                      className={`px-2 py-0.5 text-[11px] font-mono rounded-full shrink-0 ${
                        isSelected
                          ? 'bg-black/20 text-white'
                          : 'bg-[#0D2E4D] text-[#DED1BE]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer Sidebar */}
          <div className="p-3 border-t border-white/15 text-xs space-y-2">
            {!collapsed && (
              <div className="bg-[#0D2E4D] rounded-xl p-3 border border-white/10">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#FCB900]" />
                  Phòng 206.B06
                </div>
                <div className="text-xs text-[#DED1BE] mt-0.5">
                  Văn phòng Hội Sinh viên EIU
                </div>
              </div>
            )}
            <div className="flex items-center justify-between gap-2">
              <Link
                href="/"
                className="flex-1 min-h-10 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white"
              >
                <Globe className="w-4 h-4 text-[#FCB900]" />
                {!collapsed && <span>Cổng TT</span>}
              </Link>
              <Link
                href="/portal"
                className="flex-1 min-h-10 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white"
              >
                <UserCircle2 className="w-4 h-4 text-emerald-300" />
                {!collapsed && <span>Hồ sơ SV</span>}
              </Link>
            </div>
          </div>
        </aside>

        {/* Drawer Sidebar trên Mobile */}
        {mobileOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu điều hướng E-Office"
            className="fixed inset-0 z-50 lg:hidden flex"
          >
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative w-72 max-w-[85vw] bg-[#133F68] text-white flex flex-col h-full z-10 shadow-2xl">
              <div className="p-4 border-b border-white/15 flex items-center justify-between">
                <div className="font-bold text-sm font-eiu-display text-[#FCB900]">
                  E-OFFICE HSV EIU
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Đóng menu"
                  className="min-h-10 min-w-10 inline-flex items-center justify-center rounded-lg bg-white/10 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {WORKSPACE_MODULES.map((item) => {
                  const Icon = item.icon;
                  const isSelected = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectModule(item.id)}
                      className={`w-full min-h-11 flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                        isSelected
                          ? 'bg-[#A68556] text-white'
                          : 'text-white/90 hover:bg-white/10'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-[#FCB900]" />
                        {item.label}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-black/20">
                        {item.badge}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Khu vực Nội dung chính */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Mở menu quản trị"
                className="lg:hidden min-h-10 min-w-10 inline-flex items-center justify-center rounded-lg border border-slate-200 text-[#133F68] hover:bg-slate-50"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-base font-extrabold text-[#133F68] font-eiu-display">
                    Hệ Thống Quản Trị &amp; Điều Hành Nội Bộ (E-Office)
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-[#133F68]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#A68556]" />
                    Khóa II (2026 – 2028)
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Người dùng: <strong className="text-slate-900">{currentPersona.fullName}</strong> •{' '}
                  <span className="font-semibold text-[#0054A6]">{activePosition.positionTitle}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/gioi-thieu"
                className="min-h-10 inline-flex items-center px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-[#133F68]"
              >
                Sơ đồ Tổ chức
              </Link>
              <Link
                href="/tra-cuu-gcn"
                className="min-h-10 inline-flex items-center px-3.5 py-2 rounded-lg bg-[#133F68] hover:bg-[#0D2E4D] text-xs font-bold text-white"
              >
                Mẫu E-Certificate
              </Link>
            </div>
          </header>

          <main
            id="main-content"
            className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
