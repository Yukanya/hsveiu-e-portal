import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface SubpageBannerProps {
  title: string;
  subtitle?: string;
  breadcrumbs: { label: string; href?: string }[];
}

export function SubpageBanner({
  title,
  subtitle,
  breadcrumbs,
}: SubpageBannerProps) {
  return (
    <div>
      {/* Banner với khối hình thang nghiêng Đỏ đô #C10230 chuẩn lib.eiu.edu.vn */}
      <div className="relative bg-[#133F68] overflow-hidden border-b border-slate-200">
        {/* Nền họa tiết trang nhã mô phỏng không gian học thuật EIU */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 30%, #A68556 0%, transparent 55%), linear-gradient(120deg, #0D2E4D 0%, #133F68 60%, #1E568A 100%)',
          }}
          aria-hidden="true"
        />

        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-10 sm:py-14 relative z-10 flex items-center justify-between gap-6">
          {/* Khối đa giác nghiêng màu Đỏ đô #C10230 giống hệt "Đặt phòng học" trên lib.eiu.edu.vn */}
          <div
            className="bg-[#C10230]/95 text-white px-7 py-6 sm:px-10 sm:py-8 max-w-xl w-full shadow-sm"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)',
            }}
          >
            <div className="w-10 h-0.5 bg-white mb-3" aria-hidden="true" />
            <h1 className="text-xl sm:text-2xl lg:text-[26px] font-bold tracking-tight leading-snug font-eiu-display">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-white/90 mt-1.5 pr-6">
                {subtitle}
              </p>
            )}
          </div>

          {/* Biểu trưng Đại hội II bên phải trên màn hình lớn */}
          <div className="hidden md:flex items-center gap-4 bg-white/95 px-5 py-3 shadow-xs">
            <img
              src="/images/eiu-logo-full.png"
              alt="EIU"
              className="h-12 w-auto object-contain"
            />
            <div className="h-10 w-px bg-slate-300" aria-hidden="true" />
            <img
              src="/images/hsv-logo.png"
              alt="Hội Sinh viên Việt Nam"
              className="h-11 w-11 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Dải Breadcrumb nền #F5F5F5 chuẩn eiu.edu.vn & lib.eiu.edu.vn */}
      <nav
        aria-label="Đường dẫn trang"
        className="bg-[#F5F5F5] border-b border-slate-200/80"
      >
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-1.5 text-xs">
          <Link
            href="/"
            className="text-[#0054A6] hover:underline font-medium"
          >
            Trang chủ
          </Link>
          {breadcrumbs.map((item, idx) => (
            <React.Fragment key={item.label}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              {item.href && idx < breadcrumbs.length - 1 ? (
                <Link
                  href={item.href}
                  className="text-[#0054A6] hover:underline font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-slate-800 font-semibold">
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </nav>
    </div>
  );
}
