import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface SubpageBannerProps {
  title: string;
  subtitle?: string;
  kicker?: string;
  breadcrumbs: { label: string; href?: string }[];
  wide?: boolean;
}

export function SubpageBanner({
  title,
  subtitle,
  kicker,
  breadcrumbs,
  wide = false,
}: SubpageBannerProps) {
  const containerClass = wide ? 'max-w-[1200px]' : 'max-w-[1140px]';

  return (
    <div>
      {/* Banner Kiến trúc EIU × HSV với Khối đa giác nghiêng Đỏ đô #C10230 */}
      <div className="relative bg-[#133F68] overflow-hidden border-b border-slate-200">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 82% 30%, #A68556 0%, transparent 52%), linear-gradient(120deg, #02294E 0%, #133F68 58%, #0054A6 100%)',
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 eiu-arch-pattern" aria-hidden="true" />

        <div
          className={`${containerClass} mx-auto px-4 sm:px-6 py-9 sm:py-12 relative z-10 flex items-center justify-between gap-6`}
        >
          {/* Khối đa giác nghiêng #C10230 chuẩn lib.eiu.edu.vn & eiu.edu.vn */}
          <div
            className="bg-[#C10230]/95 text-white px-7 py-6 sm:px-10 sm:py-7 max-w-2xl w-full shadow-md"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0% 100%)',
            }}
          >
            <div className="flex items-center gap-3 mb-2.5">
              <span className="w-9 h-0.5 bg-white" aria-hidden="true" />
              {kicker && (
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#DED1BE]">
                  {kicker}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-[27px] font-bold tracking-tight leading-snug font-eiu-display pr-6">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[13.5px] sm:text-sm text-white/92 mt-2 pr-8 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Cụm Biểu trưng EIU | HSV Khóa II trang trọng bên phải */}
          <div className="hidden md:flex items-center gap-4 bg-white/96 px-5 py-3.5 border-l-4 border-[#A68556] shadow-sm shrink-0">
            <img
              src="/images/eiu-logo-full.png"
              alt="EIU"
              className="h-11 w-auto object-contain"
            />
            <div className="h-9 w-px bg-slate-300" aria-hidden="true" />
            <img
              src="/images/hsv-logo.png"
              alt="Hội Sinh viên Việt Nam"
              className="h-10 w-10 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Dải Breadcrumb nền #F5F5F5 chuẩn eiu.edu.vn */}
      <nav
        aria-label="Đường dẫn trang"
        className="bg-[#F5F5F5] border-b border-slate-200/90"
      >
        <div
          className={`${containerClass} mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-1.5 text-[13px]`}
        >
          <Link
            href="/"
            className="text-[#0054A6] hover:text-[#133F68] hover:underline font-medium"
          >
            Trang chủ
          </Link>
          {breadcrumbs.map((item, idx) => (
            <React.Fragment key={item.label}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              {item.href && idx < breadcrumbs.length - 1 ? (
                <Link
                  href={item.href}
                  className="text-[#0054A6] hover:text-[#133F68] hover:underline font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-[#133F68] font-semibold">
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
