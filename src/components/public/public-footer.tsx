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
      <div className={`${containerClass} mx-auto px-4 sm:px-6 pt-11 pb-9`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-7 lg:gap-6">
          {/* Cột 1 (4/12): Cụm Logo EIU trắng và Logo Hội Sinh viên cân đối + Khẩu hiệu học thuật */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-3.5 pr-0 lg:pr-6">
            <div className="flex items-center gap-4">
              <Image
                src="/images/eiu-logo-full-white.png"
                alt="Trường Đại học Quốc tế Miền Đông"
                width={81}
                height={70}
                loading="lazy"
                style={{ width: 'auto' }}
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
                style={{ width: 'auto' }}
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

          {/* Cột 2 (2/12): Nổi bật */}
          <div className="lg:col-span-2 font-eiu-serif text-[14px] leading-snug">
            <h2 className="text-[15.5px] font-semibold text-white mb-2">
              Nổi bật
            </h2>
            <ul className="space-y-1 text-[#DED1BE]">
              <li>
                <Link
                  href="/gioi-thieu"
                  className="inline-block py-1 sm:py-0.5 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Về Hội Sinh viên EIU
                </Link>
              </li>
              <li>
                <Link
                  href="/gioi-thieu?tab=bch"
                  className="inline-block py-1 sm:py-0.5 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Đội ngũ cán bộ
                </Link>
              </li>
              <li>
                <Link
                  href="/portal"
                  className="inline-block py-1 sm:py-0.5 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Sinh viên 5 tốt
                </Link>
              </li>
              <li>
                <Link
                  href="/tin-tuc"
                  className="inline-block py-1 sm:py-0.5 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Tin tức Sinh viên
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3 (2/12): Hội viên – Sinh viên */}
          <div className="lg:col-span-2 font-eiu-serif text-[14px] leading-snug">
            <h2 className="text-[15.5px] font-semibold text-white mb-2">
              Hội viên – Sinh viên
            </h2>
            <ul className="space-y-1 text-[#DED1BE]">
              <li>
                <Link
                  href="/su-kien"
                  className="inline-block py-1 sm:py-0.5 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Sự kiện phong trào
                </Link>
              </li>
              <li>
                <Link
                  href="/portal"
                  className="inline-block py-1 sm:py-0.5 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Sổ tay hội viên
                </Link>
              </li>
              <li>
                <Link
                  href="/cuoc-thi"
                  className="inline-block py-1 sm:py-0.5 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Cuộc thi trực tuyến
                </Link>
              </li>
              <li>
                <Link
                  href="/tra-cuu-gcn"
                  className="inline-block py-1 sm:py-0.5 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Tra cứu GCN
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4 (2/12): Cán bộ Hội */}
          <div className="lg:col-span-2 font-eiu-serif text-[14px] leading-snug">
            <h2 className="text-[15.5px] font-semibold text-white mb-2">
              Cán bộ Hội
            </h2>
            <ul className="space-y-1 text-[#DED1BE]">
              <li>
                <Link
                  href="/workspace"
                  className="inline-block py-1 sm:py-0.5 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  e-Office
                </Link>
              </li>
              <li>
                <Link
                  href="/workspace?module=meetings"
                  className="inline-block py-1 sm:py-0.5 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Phòng họp số
                </Link>
              </li>
              <li>
                <Link
                  href="/van-ban"
                  className="inline-block py-1 sm:py-0.5 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Văn bản
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 5 (2/12): Kết nối với HSV */}
          <div className="lg:col-span-2 font-eiu-serif text-[14px] leading-snug">
            <h2 className="text-[15.5px] font-semibold text-white mb-2">
              Kết nối với HSV
            </h2>
            <ul className="space-y-1 text-[#DED1BE]">
              <li>
                <Link
                  href="/"
                  className="inline-block py-1 sm:py-0.5 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Cổng thông tin
                </Link>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/eiuhsv"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block py-1 sm:py-0.5 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Fanpage
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/vnsa.eiu"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block py-1 sm:py-0.5 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@vnsa.eiu"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block py-1 sm:py-0.5 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900] rounded-xs"
                >
                  Tiktok
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Thanh đáy Footer */}
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
                    name="newsletterEmail"
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
                    className="w-full sm:w-68 min-h-11 sm:min-h-10 px-3.5 bg-white text-slate-900 placeholder:text-slate-600 text-base sm:text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900]"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-h-11 sm:min-h-10 px-5 bg-[#8E6D3E] hover:bg-[#78592B] disabled:opacity-70 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shrink-0 cursor-pointer font-eiu-display transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900]"
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

      {/* Dòng bản quyền */}
      <div className="border-t border-white/10 bg-[#09223B] text-[#DED1BE] py-3.5">
        <div className={`${containerClass} mx-auto px-4 sm:px-6 text-center text-xs sm:text-[12.5px] leading-relaxed`}>
          <p>
            © 2026 - Phát triển bởi nhóm sinh viên Trương Châu Phước Lộc, Bùi Nhật Linh, Vũ Đức Tùng dưới sự hướng dẫn của Thầy Nguyễn Xuân Cường
          </p>
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
