import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  breadcrumbs,
  wide = false,
}: SubpageBannerProps) {
  const containerClass = wide ? 'max-w-[1200px]' : 'max-w-[1140px]';

  return (
    <div>
      {/* Banner Kiến trúc EIU × HSV đồng bộ 100% với Trang chủ */}
      <section
        aria-label={title}
        className="bg-[#02294E] relative overflow-hidden border-b border-slate-200"
      >
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              'radial-gradient(circle at 78% 35%, #A68556 0%, transparent 52%), linear-gradient(125deg, #02294E 0%, #133F68 58%, #0054A6 100%)',
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 eiu-arch-pattern" aria-hidden="true" />

        <div
          className={`${containerClass} mx-auto px-4 sm:px-6 py-11 lg:py-15 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center`}
        >
          {/* Cột Trái (7/12): Khối đa giác nghiêng #C10230 chuẩn EIU */}
          <div className="lg:col-span-7">
            <div
              className="bg-[#C10230]/95 text-white p-7 sm:p-9 shadow-lg"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 91% 100%, 0% 100%)',
              }}
            >
              <h1 className="text-2xl sm:text-[29px] font-extrabold tracking-tight leading-snug font-eiu-display pr-6 uppercase">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-white/95 mt-3 pr-8 leading-relaxed font-sans">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Cột Phải (5/12): Khối Biểu trưng EIU × Đại hội II + Khẩu hiệu đồng bộ Trang chủ */}
          <div className="lg:col-span-5">
            <div className="bg-white border-t-4 border-[#A68556] shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="p-6 sm:p-7 flex items-center justify-center gap-6">
                <Image
                  src="/images/eiu-logo-full.png"
                  alt="Trường Đại học Quốc tế Miền Đông"
                  width={240}
                  height={100}
                  priority
                  className="h-22 sm:h-25 w-auto object-contain hover:scale-102 transition-transform duration-300"
                />
                <div className="h-20 w-px bg-slate-200" aria-hidden="true" />
                <Image
                  src="/images/hsv-bch-dh2.png"
                  alt="Biểu trưng Đại hội II Hội Sinh viên EIU (2026 - 2028)"
                  width={140}
                  height={100}
                  priority
                  className="h-22 sm:h-25 w-auto object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="bg-[#133F68] text-white px-6 py-3.5 flex items-center justify-center border-t border-slate-100 text-center">
                <span className="text-xs sm:text-sm font-eiu-serif font-extrabold italic text-[#FCB900]">
                  Trí sáng - Đồng tâm - Vươn tầm - Cất cánh
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

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
