'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
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
  {
    href: '/gioi-thieu',
    label: 'GIỚI THIỆU & BỘ MÁY',
    children: [
      { label: 'Tổng quan HSV EIU Khóa II (2026–2028)', href: '/gioi-thieu?tab=overview' },
      { label: 'Sơ đồ Cơ cấu Tổ chức 3 Cấp', href: '/gioi-thieu?tab=chart', badge: '3 CẤP' },
      { label: 'Ban Thư ký HSV Trường (05 đ/c)', href: '/gioi-thieu?tab=btk' },
      { label: 'Ban Chấp hành HSV Trường (15 đ/c)', href: '/gioi-thieu?tab=bch' },
      { label: 'Ban Kiểm tra HSV Trường (05 đ/c)', href: '/gioi-thieu?tab=bkt' },
      { label: 'Văn phòng Hội Sinh viên (Phòng 206.B06)', href: '/gioi-thieu?tab=vp' },
      { label: 'Ban Tổ chức và Xây dựng Hội (05 Cụm)', href: '/gioi-thieu?tab=tcxdh' },
      { label: 'Ban Tuyên giáo – Phong trào & Đội CTVXK', href: '/gioi-thieu?tab=tgpt' },
    ],
  },
  {
    href: '/to-chuc',
    label: 'CHI HỘI & CLB',
    children: [
      { label: 'Danh bạ 30 Câu lạc bộ – Đội – Nhóm', href: '/to-chuc?tab=clubs', badge: '30 CLB' },
      { label: 'Khối Cộng đồng & Tình nguyện (07)', href: '/to-chuc?tab=clubs&category=CONG_DONG' },
      { label: 'Khối Học thuật – Nghiên cứu (06)', href: '/to-chuc?tab=clubs&category=HOC_THUAT' },
      { label: 'Khối Văn hóa – Nghệ thuật (10)', href: '/to-chuc?tab=clubs&category=NGHE_THUAT' },
      { label: 'Khối Thể dục – Thể thao (07)', href: '/to-chuc?tab=clubs&category=THE_THAO' },
      { label: 'Hệ thống 25 Chi hội (04 Cụm Khoa)', href: '/to-chuc?tab=branches', badge: '25 CHI HỘI' },
      { label: 'Cụm Khoa Quản trị Kinh doanh (06)', href: '/to-chuc?tab=branches&faculty=BBS' },
      { label: 'Cụm Khoa Kỹ thuật (06)', href: '/to-chuc?tab=branches&faculty=SET' },
      { label: 'Cụm Khoa Công nghệ Thông tin (07)', href: '/to-chuc?tab=branches&faculty=CIT' },
      { label: 'Cụm Khoa Khoa học Sức khỏe (06)', href: '/to-chuc?tab=branches&faculty=SNS' },
    ],
  },
  {
    href: '/tin-tuc',
    label: 'TIN TỨC',
    children: [
      { label: 'Tất cả Tin tức & Điểm tin Phong trào', href: '/tin-tuc' },
      { label: 'Chuyên mục Sinh viên 5 Tốt', href: '/tin-tuc?category=SINH_VIEN_5_TOT' },
      { label: 'Tổ chức – Xây dựng Hội', href: '/tin-tuc?category=TIN_HOAT_DONG' },
      { label: 'Tuyên giáo – Phát triển Bền vững (SDGs)', href: '/tin-tuc?category=TUYEN_TRUYEN' },
      { label: 'Thông báo – Văn bản Chỉ đạo', href: '/tin-tuc?category=THONG_BAO' },
    ],
  },
  {
    href: '/su-kien',
    label: 'SỰ KIỆN',
    children: [
      { label: 'Lịch Sự kiện & Đăng ký 1-Chạm', href: '/su-kien' },
      { label: 'Chương trình Đang mở Đăng ký', href: '/su-kien?status=upcoming' },
      { label: 'Chương trình Đã ban hành Quyết định GCN', href: '/su-kien?status=decision_issued' },
      { label: 'Quy trình 5 Bước & Hệ số Ngày TN (QĐ 28)', href: '/su-kien#quy-trinh-qd28' },
    ],
  },
  {
    href: '/van-ban',
    label: 'VĂN BẢN',
    children: [
      { label: 'Kho Văn bản Pháp lý Hiện hành', href: '/van-ban' },
      { label: 'QĐ 09/QĐ-HSV — Chuẩn Sinh viên 5 Tốt (2026)', href: '/van-ban?doc=09/QĐ-HSV' },
      { label: 'QĐ 28/QĐ-HSV — Cấp E-Certificate & Ngày TN', href: '/van-ban?doc=28/QĐ-HSV' },
      { label: 'QĐ 23 & 24/QĐ-HSV — Quy chế BCH & Các Ban', href: '/van-ban?doc=23/QĐ-HSV' },
      { label: 'TB 04/TB-HSV — Phân công Nhân sự Chủ chốt', href: '/van-ban?doc=04/TB-HSV' },
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

  const isWideWorkspace =
    pathname.startsWith('/workspace') || pathname.startsWith('/portal');
  const containerClass = isWideWorkspace
    ? 'max-w-[1200px]'
    : 'max-w-[1140px]';

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
            className="flex items-center gap-3 shrink-0 py-1 group"
          >
            <img
              src="/images/eiu-logo-full.png"
              alt="Trường Đại học Quốc tế Miền Đông (EIU)"
              className="h-11 sm:h-13 w-auto object-contain"
            />
            <div className="h-9 w-px bg-slate-300" aria-hidden="true" />
            <div className="flex items-center gap-2.5">
              <img
                src="/images/hsv-logo.png"
                alt="Hội Sinh viên Việt Nam"
                className="h-9 w-9 sm:h-10 sm:w-10 object-contain"
              />
              <div className="hidden sm:block">
                <div className="text-[14px] sm:text-[15px] font-extrabold tracking-wide text-[#133F68] group-hover:text-[#0054A6] transition-colors leading-tight font-eiu-display">
                  HỘI SINH VIÊN
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A68556]">
                  STUDENT UNION
                </div>
              </div>
            </div>
          </Link>

          {/* Menu Ngang + Dropdown #144069 Góc vuông 0px chuẩn post-5773.css của eiu.edu.vn */}
          <nav
            aria-label="Điều hướng chính"
            className="hidden xl:flex items-center gap-0.5 h-full"
          >
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
              const isDropdownOpen = openDesktopDropdown === item.href;

              return (
                <div
                  key={item.href}
                  className="relative h-full flex items-center"
                  onMouseEnter={() =>
                    item.children && setOpenDesktopDropdown(item.href)
                  }
                  onMouseLeave={() =>
                    item.children && setOpenDesktopDropdown(null)
                  }
                >
                  <Link
                    href={item.href}
                    onFocus={() =>
                      item.children
                        ? setOpenDesktopDropdown(item.href)
                        : setOpenDesktopDropdown(null)
                    }
                    aria-current={isActive ? 'page' : undefined}
                    aria-haspopup={item.children ? 'true' : undefined}
                    aria-expanded={item.children ? isDropdownOpen : undefined}
                    className={`px-2.5 py-2 min-h-10 inline-flex items-center gap-1 text-[13px] font-bold tracking-wide font-eiu-display transition-colors relative ${
                      isActive
                        ? 'text-[#C10230]'
                        : 'text-[#133F68] hover:text-[#A68556]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.children && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-150 ${
                          isDropdownOpen ? 'rotate-180 text-[#A68556]' : 'opacity-75'
                        }`}
                      />
                    )}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-2.5 right-2.5 h-[3px] bg-[#C10230]"
                        aria-hidden="true"
                      />
                    )}
                  </Link>

                  {/* Dropdown Panel Nền Xanh Navy #144069 Góc vuông 0px */}
                  {item.children && isDropdownOpen && (
                    <div
                      role="menu"
                      className="absolute left-0 top-full w-76 bg-[#144069] text-white shadow-xl border-t-2 border-[#A68556] py-1.5 z-50"
                    >
                      {item.children.map((sub) => (
                        <Link
                          key={sub.href + sub.label}
                          href={sub.href}
                          role="menuitem"
                          onClick={() => setOpenDesktopDropdown(null)}
                          className="px-4 py-2.5 flex items-center justify-between gap-2 text-[13px] font-medium text-white/95 hover:bg-[#133F68] hover:text-[#FCB900] border-l-2 border-transparent hover:border-[#FCB900] transition-colors"
                        >
                          <span className="leading-snug">{sub.label}</span>
                          {sub.badge ? (
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-[#00BCFF]/20 text-[#00BCFF] shrink-0">
                              {sub.badge}
                            </span>
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Nút Mở Menu trên Tablet / Mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
            className="xl:hidden min-h-10 min-w-10 inline-flex items-center justify-center text-[#133F68] border border-slate-200 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile có Accordion Submenu #144069 */}
      {mobileMenuOpen && (
        <nav
          aria-label="Menu di động"
          className="xl:hidden border-t border-slate-200 bg-white divide-y divide-slate-100 shadow-lg"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            const isExpanded = openMobileSubmenu === item.href;

            return (
              <div key={item.href}>
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex-1 px-4 py-3 text-[13px] font-bold font-eiu-display ${
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
                      className={`px-4 py-3 border-l border-slate-200 cursor-pointer ${
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
                        className="block px-6 py-2.5 text-[13px] text-[#DED1BE] hover:text-white hover:bg-[#133F68]"
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
