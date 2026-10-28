'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/context/role-context';
import {
  Menu,
  X,
  LogIn,
  LayoutDashboard,
  GraduationCap,
  Award,
  Building2,
  CalendarCheck,
  FileText,
  Network,
  Home,
  CheckCircle2,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Trang chủ', icon: Home },
  { href: '/gioi-thieu', label: 'Bộ máy & Nhân sự', icon: Network },
  { href: '/to-chuc', label: '25 Chi hội & 30 CLB', icon: Building2 },
  { href: '/su-kien', label: 'Sự kiện & Tình nguyện', icon: CalendarCheck },
  { href: '/van-ban', label: 'Văn bản & Quy chế', icon: FileText },
  { href: '/tra-cuu-gcn', label: 'Tra cứu E-Certificate', icon: Award },
];

function PublicNavbarInner() {
  const pathname = usePathname();
  const { currentPersona, activePosition } = useRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
            {/* Brand Identity */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#0054A6] to-[#0B2545] flex items-center justify-center text-white font-extrabold text-sm shadow-xs group-hover:shadow-md transition-all">
                HSV
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0054A6]">
                    Hội Sinh viên Việt Nam
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded border border-slate-200">
                    EIU • Khóa II
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#0B2545] leading-tight">
                  Trường Đại học Quốc tế Miền Đông
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#F0F7FF] text-[#0054A6] border border-sky-200/80'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-[#0B2545]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions: Login OAuth @eiu.edu.vn & Quick Portals */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <Link
                href="/portal"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors"
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#0054A6]" />
                Sổ tay SV5T
              </Link>

              {activePosition.roleLevel >= 2 && (
                <Link
                  href="/workspace"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-[#0B2545] hover:bg-[#133B5C] transition-colors shadow-2xs"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-sky-400" />
                  E-Office Nội bộ
                </Link>
              )}

              <button
                type="button"
                onClick={() => setLoginModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-[#0054A6] hover:bg-[#004282] transition-colors shadow-2xs cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>@eiu.edu.vn</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Mở menu điều hướng"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                      isActive
                        ? 'bg-[#F0F7FF] text-[#0054A6] border border-sky-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-wrap gap-2">
              <Link
                href="/portal"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-800 bg-slate-100"
              >
                <GraduationCap className="w-4 h-4 text-[#0054A6]" />
                Cổng Sinh viên (/portal)
              </Link>
              <Link
                href="/workspace"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#0B2545]"
              >
                <LayoutDashboard className="w-4 h-4 text-sky-400" />
                Workspace E-Office
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLoginModalOpen(true);
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#0054A6]"
              >
                <LogIn className="w-4 h-4" />
                Đăng nhập Google OAuth (@eiu.edu.vn)
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Modal Giả lập Đăng nhập Google OAuth @eiu.edu.vn (Chuẩn bị cho Giai đoạn 2) */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F0F7FF] text-[#0054A6] border border-sky-200">
                  Xác thực Định danh EIU
                </span>
                <h3 className="text-lg font-bold text-[#0B2545] mt-1">
                  Đăng nhập Google OAuth (@eiu.edu.vn)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLoginModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Phiên làm việc hiện tại (Demo Giai đoạn 1):
              </p>
              <div className="pl-5 space-y-1 text-slate-600">
                <p>
                  Họ tên: <strong className="text-slate-900">{currentPersona.fullName}</strong>
                </p>
                <p>
                  Email: <code className="font-mono text-[#0054A6]">{currentPersona.email}</code>
                </p>
                <p>
                  MSSV: <code className="font-mono text-slate-800">{currentPersona.studentId}</code> • Khoa:{' '}
                  <strong>{currentPersona.facultyCode}</strong>
                </p>
                <p>
                  Ngữ cảnh đang chọn:{' '}
                  <strong className="text-[#0B2545]">{activePosition.positionTitle}</strong>
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Ở <strong>Giai đoạn 2</strong>, nút này sẽ kết nối trực tiếp với{' '}
              <strong>Supabase Google OAuth</strong> (chỉ cho phép tên miền{' '}
              <code className="font-mono text-[#0054A6]">@eiu.edu.vn</code>) và tự động bóc tách
              Khoa (<code className="font-mono">cit, bbs, set, sns</code>) cùng Khóa học ngay lần
              đăng nhập đầu tiên.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLoginModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer"
              >
                Đóng
              </button>
              <Link
                href="/workspace"
                onClick={() => setLoginModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#0054A6] hover:bg-[#004282]"
              >
                Vào E-Office Workspace
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function PublicNavbar() {
  return (
    <Suspense
      fallback={
        <header className="h-16 bg-white border-b border-slate-200 shadow-2xs" />
      }
    >
      <PublicNavbarInner />
    </Suspense>
  );
}
