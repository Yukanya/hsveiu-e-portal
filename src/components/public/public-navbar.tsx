'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'TRANG CHỦ', hasDropdown: false },
  { href: '/gioi-thieu', label: 'BỘ MÁY TỔ CHỨC', hasDropdown: true },
  { href: '/to-chuc', label: 'CHI HỘI & CLB', hasDropdown: true },
  { href: '/su-kien', label: 'SỰ KIỆN', hasDropdown: true },
  { href: '/van-ban', label: 'VĂN BẢN', hasDropdown: true },
  { href: '/tra-cuu-gcn', label: 'GIẤY CHỨNG NHẬN', hasDropdown: false },
];

function PublicNavbarInner() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Cụm Logo EIU (eiu-logo-full.png) | HỘI SINH VIÊN (hsv-logo.png) chuẩn mẫu EIU | LIBRARY */}
          <Link
            href="/"
            aria-label="Trang chủ Hội Sinh viên Trường Đại học Quốc tế Miền Đông"
            className="flex items-center gap-3.5 shrink-0 py-1"
          >
            <img
              src="/images/eiu-logo-full.png"
              alt="Trường Đại học Quốc tế Miền Đông (EIU)"
              className="h-12 sm:h-14 w-auto object-contain"
            />
            <div className="h-9 w-px bg-slate-300" aria-hidden="true" />
            <div className="flex items-center gap-2.5">
              <img
                src="/images/hsv-logo.png"
                alt="Hội Sinh viên Việt Nam"
                className="h-9 w-9 sm:h-10 sm:w-10 object-contain"
              />
              <div className="hidden sm:block">
                <div className="text-sm sm:text-base font-bold tracking-wide text-[#133F68] leading-tight font-eiu-display">
                  HỘI SINH VIÊN
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-[#A68556]">
                  STUDENT UNION
                </div>
              </div>
            </div>
          </Link>

          {/* Menu Ngang Chuẩn eiu.edu.vn */}
          <nav
            aria-label="Điều hướng chính"
            className="hidden lg:flex items-center gap-1"
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
                  className={`px-3 py-2 min-h-10 inline-flex items-center gap-1 text-[13px] font-bold tracking-wide font-eiu-display transition-colors ${
                    isActive
                      ? 'text-[#C10230]'
                      : 'text-[#133F68] hover:text-[#A68556]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown className="w-3.5 h-3.5 opacity-75" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Nút Menu trên Mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
            className="lg:hidden min-h-10 min-w-10 inline-flex items-center justify-center text-[#133F68]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <nav
          aria-label="Menu di động"
          className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-md"
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
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 text-xs font-bold font-eiu-display ${
                  isActive
                    ? 'bg-[#C10230] text-white'
                    : 'text-[#133F68] hover:bg-[#F5F5F5]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}

export function PublicNavbar() {
  return (
    <Suspense
      fallback={<header className="h-20 bg-white border-b border-slate-200" />}
    >
      <PublicNavbarInner />
    </Suspense>
  );
}
