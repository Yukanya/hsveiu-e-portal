'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/context/role-context';
import {
  Award,
  Building2,
  CalendarCheck,
  CheckCircle2,
  FileText,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogIn,
  Menu,
  Network,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'TRANG CHỦ', icon: Home },
  { href: '/gioi-thieu', label: 'BỘ MÁY & NHÂN SỰ', icon: Network },
  { href: '/to-chuc', label: 'CHI HỘI & CLB', icon: Building2 },
  { href: '/su-kien', label: 'SỰ KIỆN', icon: CalendarCheck },
  { href: '/van-ban', label: 'VĂN BẢN', icon: FileText },
  { href: '/tra-cuu-gcn', label: 'GIẤY CHỨNG NHẬN', icon: Award },
];

function PublicNavbarInner() {
  const pathname = usePathname();
  const { currentPersona, activePosition } = useRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Cụm Logo EIU chính thức + Định danh Hội Sinh viên Trường */}
            <Link
              href="/"
              aria-label="Trang chủ Hội Sinh viên Trường Đại học Quốc tế Miền Đông"
              className="flex items-center gap-3.5 shrink-0 group py-1"
            >
              <img
                src="/images/eiu-logo.png"
                alt="Logo Trường Đại học Quốc tế Miền Đông (EIU)"
                className="h-11 sm:h-12 w-auto object-contain"
              />
              <div className="h-9 w-px bg-slate-200 hidden sm:block" aria-hidden="true" />
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#A68556] font-eiu-display">
                  HỘI SINH VIÊN VIỆT NAM
                </div>
                <div className="text-sm sm:text-base font-extrabold text-[#133F68] leading-tight font-eiu-display">
                  HSV EIU • KHÓA II
                </div>
              </div>
            </Link>

            {/* Menu điều hướng Desktop đồng bộ font Montserrat & màu #133F68 / #A68556 của eiu.edu.vn */}
            <nav
              aria-label="Điều hướng chính Cổng thông tin"
              className="hidden xl:flex items-center gap-1"
            >
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative px-3 py-2.5 min-h-11 inline-flex items-center text-[13px] font-bold tracking-wide font-eiu-display transition-colors ${
                      isActive
                        ? 'text-[#133F68]'
                        : 'text-slate-700 hover:text-[#A68556]'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-3 right-3 h-[3px] rounded-full bg-[#A68556]"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Cụm nút tác vụ bên phải (Đạt chuẩn Touch Target >= 40px) */}
            <div className="hidden md:flex items-center gap-2.5 shrink-0">
              <Link
                href="/portal"
                className="min-h-10 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-[#133F68] bg-slate-100 hover:bg-slate-200/80 transition-colors"
              >
                <GraduationCap className="w-4 h-4 text-[#0054A6]" />
                <span>Hồ sơ SV5T</span>
              </Link>

              <button
                type="button"
                onClick={() => setLoginModalOpen(true)}
                className="min-h-10 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#133F68] hover:bg-[#0D2E4D] transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#FCB900]" />
                <span>@eiu.edu.vn</span>
              </button>
            </div>

            {/* Nút mở Menu trên thiết bị di động */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
              className="xl:hidden min-h-11 min-w-11 inline-flex items-center justify-center p-2.5 rounded-lg text-[#133F68] hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Ngăn kéo điều hướng trên Mobile */}
        {mobileMenuOpen && (
          <nav
            aria-label="Menu di động"
            className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg"
          >
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
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 min-h-11 rounded-xl text-sm font-bold ${
                      isActive
                        ? 'bg-[#133F68] text-white'
                        : 'text-slate-800 hover:bg-slate-100'
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
                className="flex-1 min-h-11 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-[#133F68] bg-slate-100"
              >
                <GraduationCap className="w-4 h-4" />
                Hồ sơ Hội viên (/portal)
              </Link>
              <Link
                href="/workspace"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 min-h-11 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-[#133F68]"
              >
                <LayoutDashboard className="w-4 h-4 text-[#FCB900]" />
                E-Office (/workspace)
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* Hộp thoại Xác thực Google OAuth @eiu.edu.vn */}
      {loginModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-oauth-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-[#133F68]">
                  Định danh Số EIU
                </span>
                <h2
                  id="modal-oauth-title"
                  className="text-lg font-bold text-[#133F68] mt-1.5"
                >
                  Đăng nhập Google OAuth (@eiu.edu.vn)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setLoginModalOpen(false)}
                aria-label="Đóng hộp thoại"
                className="min-h-10 min-w-10 inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#F5F5F5] border border-slate-200 text-sm text-slate-700 space-y-2">
              <p className="font-bold text-[#133F68] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Tài khoản đang kích hoạt (Giai đoạn 1):
              </p>
              <div className="space-y-1 text-xs text-slate-700">
                <p>
                  Họ và tên: <strong>{currentPersona.fullName}</strong>
                </p>
                <p>
                  Email trường: <code className="font-mono text-[#0054A6]">{currentPersona.email}</code>
                </p>
                <p>
                  MSSV: <code className="font-mono">{currentPersona.studentId}</code> • Khoa:{' '}
                  <strong>{currentPersona.facultyCode}</strong>
                </p>
                <p>
                  Chức vụ hiện tại: <strong>{activePosition.positionTitle}</strong>
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Hệ thống tự động nhận diện Khoa (<strong>CIT, BBS, SET, SNS – Khoa Khoa học Sức khỏe</strong>) và Khóa học từ địa chỉ email <code className="font-mono">@eiu.edu.vn</code>.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setLoginModalOpen(false)}
                className="min-h-10 px-4 py-2 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer"
              >
                Đóng
              </button>
              <Link
                href="/workspace"
                onClick={() => setLoginModalOpen(false)}
                className="min-h-10 inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#133F68] hover:bg-[#0D2E4D]"
              >
                Mở E-Office Nội bộ
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
        <header className="h-20 bg-white border-b border-slate-200 shadow-2xs" />
      }
    >
      <PublicNavbarInner />
    </Suspense>
  );
}
