'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';

interface NavSubItem {
  label: string;
  href: string;
  badge?: string;
}

interface NavItem {
  href: string;
  label: string;
  children?: NavSubItem[];
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'TRANG CHỦ' },
  { href: '/tin-tuc', label: 'TIN TỨC' },
  {
    href: '/su-kien',
    label: 'SỰ KIỆN',
    children: [
      { label: 'Tham gia sự kiện', href: '/su-kien' },
      { label: 'Cuộc thi trực tuyến', href: '/cuoc-thi' },
    ],
  },
  {
    href: '/van-ban',
    label: 'VĂN BẢN',
    children: [
      { label: 'Kế hoạch', href: '/van-ban?type=ke-hoach' },
      { label: 'Quyết định', href: '/van-ban?type=quyet-dinh' },
      { label: 'Thông báo', href: '/van-ban?type=thong-bao' },
      { label: 'Công văn', href: '/van-ban?type=cong-van' },
      { label: 'Tờ trình', href: '/van-ban?type=to-trinh' },
      { label: 'Báo cáo', href: '/van-ban?type=bao-cao' },
      { label: 'Biên bản', href: '/van-ban?type=bien-ban' },
      { label: 'Hướng dẫn', href: '/van-ban?type=huong-dan' },
      { label: 'Khác', href: '/van-ban?type=khac' },
    ],
  },
  {
    href: '/gioi-thieu',
    label: 'GIỚI THIỆU',
    children: [
      { label: 'Hội Sinh viên EIU', href: '/gioi-thieu?tab=overview' },
      { label: 'Sơ đồ Tổ chức Khóa II', href: '/gioi-thieu?tab=chart' },
      { label: 'Ban Chuyên môn', href: '/gioi-thieu?tab=tcxdh' },
      { label: 'Chi hội', href: '/to-chuc?tab=branches' },
      { label: 'CLB – Đội – Nhóm', href: '/to-chuc?tab=clubs' },
    ],
  },
  { href: '/tra-cuu-gcn', label: 'TRA CỨU GCN' },
];

function PublicNavbarInner() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState<string | null>(
    null
  );
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(
    null
  );

  const containerClass = 'max-w-[1200px] xl:max-w-[1240px]';

  return (
    <header
      className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setOpenDesktopDropdown(null);
          setMobileMenuOpen(false);
        }
      }}
    >
      <div className={`${containerClass} mx-auto px-4 sm:px-6`}>
        <div className="flex items-center justify-between h-[78px] gap-3">
          {/* Cụm Logo EIU | HỘI SINH VIÊN chuẩn Hệ sinh thái EIU */}
          <Link
            href="/"
            aria-label="Trang chủ Hội Sinh viên Trường Đại học Quốc tế Miền Đông"
            className="flex items-center gap-2.5 xl:gap-3 shrink-0 py-1 group"
          >
            <Image
              src="/images/eiu-logo-full.png"
              alt="Trường Đại học Quốc tế Miền Đông (EIU)"
              width={44}
              height={44}
              priority
              style={{ width: 'auto' }}
              className="h-10 sm:h-11 w-auto object-contain"
            />
            <div className="h-8 w-px bg-slate-300" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <Image
                src="/images/hsv-logo.png"
                alt="Hội Sinh viên Việt Nam"
                width={36}
                height={36}
                priority
                className="h-8 w-8 sm:h-9 sm:w-9 object-contain"
              />
              <div className="hidden sm:block">
                <div className="text-[13px] sm:text-[14px] font-extrabold tracking-wide text-[#133F68] group-hover:text-[#0054A6] transition-colors leading-tight font-eiu-display whitespace-nowrap">
                  HỘI SINH VIÊN
                </div>
                <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8E6D3E] whitespace-nowrap">
                  STUDENT ASSOCIATION
                </div>
              </div>
            </div>
          </Link>

          {/* Menu Ngang + Disclosure Dropdown #144069 Góc vuông 0px */}
          <nav
            aria-label="Điều hướng chính"
            className="hidden lg:flex items-center gap-0.5 xl:gap-1 2xl:gap-1.5 h-full shrink-0"
          >
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`) ||
                    Boolean(
                      item.children &&
                        item.children.some(
                          (sub) => pathname === sub.href.split('?')[0]
                        )
                    );
              const isDropdownOpen = openDesktopDropdown === item.href;

              return (
                <div
                  key={item.href}
                  className="relative h-full flex items-center shrink-0"
                  onMouseEnter={() =>
                    item.children && setOpenDesktopDropdown(item.href)
                  }
                  onMouseLeave={() =>
                    item.children && setOpenDesktopDropdown(null)
                  }
                  onBlur={(e) => {
                    if (
                      item.children &&
                      !e.currentTarget.contains(e.relatedTarget as Node)
                    ) {
                      setOpenDesktopDropdown(null);
                    }
                  }}
                >
                  <div className="relative flex items-center h-full">
                    <Link
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => setOpenDesktopDropdown(null)}
                      className={`py-2 min-h-10 inline-flex items-center text-[12px] xl:text-[13px] font-bold tracking-tight xl:tracking-normal font-eiu-display whitespace-nowrap shrink-0 transition-colors rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C10230] focus-visible:ring-offset-2 ${
                        item.children ? 'pl-2 xl:pl-2.5 pr-1' : 'px-2 xl:px-2.5 2xl:px-3'
                      } ${
                        isActive
                          ? 'text-[#C10230]'
                          : 'text-[#133F68] hover:text-[#A68556]'
                      }`}
                    >
                      <span className="whitespace-nowrap">{item.label}</span>
                    </Link>

                    {/* Nút mở danh mục con tách biệt để Tab bàn phím không ép đi qua 16 link con */}
                    {item.children && (
                      <button
                        type="button"
                        onClick={() =>
                          setOpenDesktopDropdown(
                            isDropdownOpen ? null : item.href
                          )
                        }
                        aria-expanded={isDropdownOpen}
                        aria-label={`Mở danh mục con ${item.label}`}
                        className={`p-1.5 min-h-8 min-w-7 inline-flex items-center justify-center cursor-pointer transition-colors rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C10230] ${
                          isActive
                            ? 'text-[#C10230]'
                            : 'text-[#133F68] hover:text-[#A68556]'
                        }`}
                      >
                        <ChevronDown
                          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-150 ${
                            isDropdownOpen ? 'rotate-180 text-[#A68556]' : 'opacity-75'
                          }`}
                        />
                      </button>
                    )}

                    {isActive && (
                      <span
                        className="absolute bottom-0 left-2 right-2 h-[3px] bg-[#C10230]"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* Dropdown Panel Nền Xanh Navy #144069 Góc vuông 0px */}
                  {item.children && isDropdownOpen && (
                    <ul
                      aria-label={`Danh mục con ${item.label}`}
                      className="absolute left-0 top-full w-76 bg-[#144069] text-white shadow-xl border-t-2 border-[#A68556] py-1 z-50 divide-y divide-white/10"
                    >
                      {item.children.map((sub) => (
                        <li key={sub.href + sub.label}>
                          <Link
                            href={sub.href}
                            onClick={() => setOpenDesktopDropdown(null)}
                            className="px-4 py-2.5 flex items-center justify-between gap-2 text-[13px] font-medium text-white/95 hover:bg-[#133F68] hover:text-[#FCB900] transition-colors focus-visible:outline-none focus-visible:bg-[#133F68] focus-visible:text-[#FCB900]"
                          >
                            <span className="leading-snug">{sub.label}</span>
                            {sub.badge ? (
                              <span className="text-[11px] font-eiu-serif font-bold px-1.5 py-0.5 bg-[#00BCFF]/20 text-[#00BCFF] shrink-0">
                                {sub.badge}
                              </span>
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Nút Mở Menu trên Tablet / Mobile (44×44px chuẩn WCAG/Apple HIG) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
            className="lg:hidden min-h-11 min-w-11 inline-flex items-center justify-center text-[#133F68] border border-slate-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68] focus-visible:ring-offset-1"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile có Accordion Submenu #144069 */}
      {mobileMenuOpen && (
        <nav
          aria-label="Menu di động"
          className="lg:hidden border-t border-slate-200 bg-white divide-y divide-slate-100 shadow-lg"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`) ||
                  Boolean(
                    item.children &&
                      item.children.some(
                        (sub) => pathname === sub.href.split('?')[0]
                      )
                  );
            const isExpanded = openMobileSubmenu === item.href;

            return (
              <div key={item.href}>
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex-1 min-h-[44px] inline-flex items-center px-4 py-3 text-[13px] font-bold font-eiu-display ${
                      isActive
                        ? 'bg-[#C10230] text-white'
                        : 'text-[#133F68] hover:bg-[#F5F5F5]'
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMobileSubmenu(isExpanded ? null : item.href)
                      }
                      aria-expanded={isExpanded}
                      aria-label={`Mở danh mục con ${item.label}`}
                      className={`min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-4 py-3 border-l border-slate-200 cursor-pointer ${
                        isActive ? 'bg-[#C10230] text-white' : 'text-[#133F68]'
                      }`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>

                {item.children && isExpanded && (
                  <div className="bg-[#144069] text-white divide-y divide-white/10">
                    {item.children.map((sub) => (
                      <Link
                        key={sub.href + sub.label}
                        href={sub.href}
                        onClick={() => {
                          setOpenMobileSubmenu(null);
                          setMobileMenuOpen(false);
                        }}
                        className="min-h-[44px] flex items-center px-6 py-2.5 text-[13px] text-[#DED1BE] hover:text-white hover:bg-[#133F68]"
                      >
                        • {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
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
      fallback={<header className="h-[78px] bg-white border-b border-slate-200" />}
    >
      <PublicNavbarInner />
    </Suspense>
  );
}
