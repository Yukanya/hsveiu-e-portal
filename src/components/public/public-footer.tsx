'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { CheckCircle2, Send } from 'lucide-react';

function PublicFooterInner() {
  const pathname = usePathname();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isWideWorkspace =
    pathname.startsWith('/workspace') || pathname.startsWith('/portal');
  const containerClass = isWideWorkspace
    ? 'max-w-[1200px]'
    : 'max-w-[1140px]';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = emailInput.trim();
    if (!trimmed) {
      setErrorMsg('Vui lòng nhập địa chỉ email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMsg('Định dạng email không hợp lệ.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    setTimeout(() => {
      setSubscribed(true);
      setIsSubmitting(false);
      setEmailInput('');
    }, 250);
  };

  return (
    <footer className="bg-[#133F68] text-[#DED1BE] border-t-4 border-[#A68556]">
      {/* Vùng cột liên kết học thuật — Font Crimson Text chuẩn post-157.css của eiu.edu.vn */}
      <div className={`${containerClass} mx-auto px-4 sm:px-6 pt-11 pb-9`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-7 lg:gap-6">
          {/* Cột 1 (4/12): Cụm Logo EIU trắng và Logo Hội Sinh viên cân đối + Khẩu hiệu học thuật */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-3.5 pr-0 lg:pr-6">
            <div className="flex items-center gap-4">
              <Image
                src="/images/eiu-logo-full-white.png"
                alt="Trường Đại học Quốc tế Miền Đông"
                width={180}
                height={70}
                loading="lazy"
                className="h-16 sm:h-18 w-auto object-contain"
              />
              <div
                className="h-12 w-px bg-white/25"
                aria-hidden="true"
              />
              <Image
                src="/images/hsv-logo.png"
                alt="Hội Sinh viên Việt Nam"
                width={60}
                height={60}
                loading="lazy"
                className="h-14 sm:h-15 w-auto object-contain"
              />
            </div>

            <div className="font-eiu-serif text-[14px] leading-snug text-[#DED1BE] space-y-1">
              <p className="text-white font-semibold text-[15.5px]">
                Hội Sinh viên Việt Nam Trường Đại học Quốc tế Miền Đông
              </p>
              <p>
                Ban Chấp hành Khóa II, Nhiệm kỳ 2026 – 2028 <br />
                <em>
                  &ldquo;Trí sáng - Đồng tâm - Vươn tầm - Cất cánh&rdquo;
                </em>
              </p>
            </div>
          </div>

          {/* Cột 2 (2/12): Tổ chức và Bộ máy */}
          <div className="lg:col-span-2 font-eiu-serif text-[13.5px] sm:text-[14px] leading-snug">
            <h2 className="text-[15.5px] font-semibold text-white mb-2">
              Tổ chức và Bộ máy
            </h2>
            <ul className="space-y-1.5 text-[#DED1BE]">
              <li>
                <Link
                  href="/gioi-thieu?tab=overview"
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Tổng quan Khóa II
                </Link>
              </li>
              <li>
                <Link
                  href="/gioi-thieu?tab=chart"
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Sơ đồ Tổ chức 3 Cấp
                </Link>
              </li>
              <li>
                <Link
                  href="/gioi-thieu?tab=vp"
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Văn phòng 206.B06
                </Link>
              </li>
              <li>
                <Link
                  href="/to-chuc"
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Chi hội và CLB
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3 (2/12): Hội viên và Cơ sở */}
          <div className="lg:col-span-2 font-eiu-serif text-[13.5px] sm:text-[14px] leading-snug">
            <h2 className="text-[15.5px] font-semibold text-white mb-2">
              Hội viên và Cơ sở
            </h2>
            <ul className="space-y-1.5 text-[#DED1BE]">
              <li>
                <Link
                  href="/portal?tab=sv5t"
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Sổ tay Sinh viên 5 Tốt
                </Link>
              </li>
              <li>
                <Link
                  href="/tin-tuc"
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Tin tức và Hoạt động
                </Link>
              </li>
              <li>
                <Link
                  href="/su-kien"
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Lịch Sự kiện
                </Link>
              </li>
              <li>
                <Link
                  href="/portal?tab=voice"
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Hộp thư Lắng nghe SV
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4 (2/12): Dịch vụ và Pháp lý */}
          <div className="lg:col-span-2 font-eiu-serif text-[13.5px] sm:text-[14px] leading-snug">
            <h2 className="text-[15.5px] font-semibold text-white mb-2">
              Dịch vụ và Pháp lý
            </h2>
            <ul className="space-y-1.5 text-[#DED1BE]">
              <li>
                <Link
                  href="/tra-cuu-gcn"
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Tra cứu E-Certificate QR
                </Link>
              </li>
              <li>
                <Link
                  href="/van-ban"
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Kho Văn bản Khóa II
                </Link>
              </li>
              <li>
                <Link
                  href="/van-ban?doc=09/QĐ-HSV"
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Chuẩn SV5T (QĐ 09)
                </Link>
              </li>
              <li>
                <Link
                  href="/van-ban?doc=28/QĐ-HSV"
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Quy định GCN (QĐ 28)
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 5 (2/12): E-Office và Kết nối */}
          <div className="lg:col-span-2 font-eiu-serif text-[13.5px] sm:text-[14px] leading-snug">
            <h2 className="text-[15.5px] font-semibold text-white mb-2">
              E-Office và Kết nối
            </h2>
            <ul className="space-y-1.5 text-[#DED1BE]">
              <li>
                <Link
                  href="/workspace"
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Trung tâm E-Office
                </Link>
              </li>
              <li>
                <a
                  href="https://eiu.edu.vn"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Trang chính EIU
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/eiuhsv"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Fanpage HSV EIU
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Thanh đáy Footer chuẩn eiu.edu.vn: Địa chỉ Phòng 206.B06 bên trái, Form nhận bản tin bên phải */}
      <div className="border-t border-white/15 bg-[#0F3356]">
        <div
          className={`${containerClass} mx-auto px-4 sm:px-6 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5`}
        >
          <div className="font-eiu-serif text-[14.5px] leading-snug text-[#DED1BE] space-y-1">
            <p className="text-white font-semibold">
              Văn phòng Hội Sinh viên: <br />
              Phòng 206.B06 - Số 81, Đường Nam Kỳ Khởi Nghĩa, Phường Bình Dương, Thành phố Hồ Chí Minh
            </p>
            <p>
              Hội viên và Sinh viên EIU liên hệ:{' '}
              <a
                href="mailto:studentassociation@eiu.edu.vn"
                className="text-white underline decoration-white/40 hover:decoration-white"
              >
                studentassociation@eiu.edu.vn
              </a>{' '}
              <br />
              Công tác đối ngoại:{' '}
              <a
                href="mailto:hsvdhquoctemiendong@hoisinhvientphcm.com"
                className="text-white underline decoration-white/40 hover:decoration-white"
              >
                hsvdhquoctemiendong@hoisinhvientphcm.com
              </a>
            </p>
          </div>

          <div className="w-full lg:w-auto max-w-md shrink-0">
            {subscribed ? (
              <div className="px-4 py-2.5 bg-[#51803A] text-white text-xs font-semibold inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Đã đăng ký nhận thông báo hoạt động và sự kiện HSV EIU!
                </span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <form
                  onSubmit={handleSubscribe}
                  noValidate
                  className="flex items-center"
                >
                  <label htmlFor="footer-email" className="sr-only">
                    Nhập email để nhận thông báo mới
                  </label>
                  <input
                    id="footer-email"
                    type="email"
                    required
                    maxLength={100}
                    autoComplete="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Nhập email để nhận thông báo mới"
                    className="w-full sm:w-68 h-10 px-3.5 bg-white text-slate-900 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900]"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 px-5 bg-[#A68556] hover:bg-[#8e7046] disabled:opacity-70 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shrink-0 cursor-pointer font-eiu-display transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900]"
                  >
                    <span>{isSubmitting ? 'ĐANG GỬI...' : 'ĐĂNG KÝ'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
                {errorMsg && (
                  <p role="alert" className="text-xs text-[#FCB900] font-sans">
                    {errorMsg}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PublicFooter() {
  return (
    <Suspense
      fallback={
        <footer className="bg-[#133F68] border-t-4 border-[#A68556] h-72" />
      }
    >
      <PublicFooterInner />
    </Suspense>
  );
}
