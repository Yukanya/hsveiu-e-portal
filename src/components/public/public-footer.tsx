'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckCircle2, Send } from 'lucide-react';

function PublicFooterInner() {
  const pathname = usePathname();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const isWideWorkspace =
    pathname.startsWith('/workspace') || pathname.startsWith('/portal');
  const containerClass = isWideWorkspace
    ? 'max-w-[1200px]'
    : 'max-w-[1140px]';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribed(true);
    setEmailInput('');
  };

  return (
    <footer className="bg-[#133F68] text-[#DED1BE] border-t-4 border-[#A68556]">
      {/* Vùng cột liên kết học thuật — Font Crimson Text 17px chuẩn post-157.css của eiu.edu.vn */}
      <div className={`${containerClass} mx-auto px-4 sm:px-6 pt-13 pb-11`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">
          {/* Cột 1 (4/12): Cụm Logo EIU trắng & Logo Hội Sinh viên cân đối + Khẩu hiệu học thuật */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4 pr-0 lg:pr-6">
            <div className="flex items-center gap-4">
              <img
                src="/images/eiu-logo-full-white.png"
                alt="Trường Đại học Quốc tế Miền Đông"
                className="h-20 sm:h-22 w-auto object-contain"
              />
              <div className="h-14 w-px bg-white/25" aria-hidden="true" />
              <img
                src="/images/hsv-logo.png"
                alt="Hội Sinh viên Việt Nam"
                className="h-16 sm:h-18 w-auto object-contain"
              />
            </div>

            <div className="font-eiu-serif text-[17px] leading-[1.55] text-[#DED1BE] space-y-1.5">
              <p className="text-white font-semibold text-[18px]">
                Hội Sinh viên Việt Nam Trường Đại học Quốc tế Miền Đông
              </p>
              <p>
                Ban Chấp hành Khóa II, Nhiệm kỳ 2026 – 2028 • Đồng hành cùng
                triết lý <em>&ldquo;Nhân bản – Cộng đồng – Sáng tạo – Bền vững&rdquo;</em>.
              </p>
            </div>
          </div>

          {/* Cột 2 (2/12): Tổ chức & Bộ máy */}
          <div className="lg:col-span-2 font-eiu-serif text-[17px] leading-[1.5]">
            <h2 className="text-[18px] font-semibold text-white mb-3.5">
              Tổ chức &amp; Bộ máy
            </h2>
            <ul className="space-y-2 text-[#DED1BE]">
              <li>
                <Link
                  href="/gioi-thieu?tab=overview"
                  className="hover:text-white transition-colors"
                >
                  Tổng quan Khóa II
                </Link>
              </li>
              <li>
                <Link
                  href="/gioi-thieu?tab=chart"
                  className="hover:text-white transition-colors"
                >
                  Sơ đồ Tổ chức 3 Cấp
                </Link>
              </li>
              <li>
                <Link
                  href="/gioi-thieu?tab=vp"
                  className="hover:text-white transition-colors"
                >
                  Văn phòng 206.B06
                </Link>
              </li>
              <li>
                <Link
                  href="/gioi-thieu?tab=tcxdh"
                  className="hover:text-white transition-colors"
                >
                  Ban Tổ chức – Xây dựng Hội
                </Link>
              </li>
              <li>
                <Link
                  href="/gioi-thieu?tab=tgpt"
                  className="hover:text-white transition-colors"
                >
                  Ban Tuyên giáo – Phong trào
                </Link>
              </li>
              <li>
                <Link
                  href="/gioi-thieu?tab=bkt"
                  className="hover:text-white transition-colors"
                >
                  Ban Kiểm tra HSV
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3 (2/12): Phong trào & Hội viên */}
          <div className="lg:col-span-2 font-eiu-serif text-[17px] leading-[1.5]">
            <h2 className="text-[18px] font-semibold text-white mb-3.5">
              Hội viên &amp; Cơ sở
            </h2>
            <ul className="space-y-2 text-[#DED1BE]">
              <li>
                <Link
                  href="/portal?tab=sv5t"
                  className="hover:text-white transition-colors"
                >
                  Sổ tay Sinh viên 5 Tốt
                </Link>
              </li>
              <li>
                <Link
                  href="/portal?tab=gpa"
                  className="hover:text-white transition-colors"
                >
                  Máy tính GPA Quý EIU
                </Link>
              </li>
              <li>
                <Link
                  href="/portal?tab=quiz"
                  className="hover:text-white transition-colors"
                >
                  Thi Trắc nghiệm Online
                </Link>
              </li>
              <li>
                <Link
                  href="/to-chuc?tab=branches"
                  className="hover:text-white transition-colors"
                >
                  Hệ thống 25 Chi hội
                </Link>
              </li>
              <li>
                <Link
                  href="/to-chuc?tab=clubs"
                  className="hover:text-white transition-colors"
                >
                  30 CLB – Đội – Nhóm
                </Link>
              </li>
              <li>
                <Link
                  href="/tin-tuc"
                  className="hover:text-white transition-colors"
                >
                  Tin tức &amp; Điểm tin
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4 (2/12): Dịch vụ Số & Pháp lý */}
          <div className="lg:col-span-2 font-eiu-serif text-[17px] leading-[1.5]">
            <h2 className="text-[18px] font-semibold text-white mb-3.5">
              Dịch vụ &amp; Pháp lý
            </h2>
            <ul className="space-y-2 text-[#DED1BE]">
              <li>
                <Link
                  href="/su-kien"
                  className="hover:text-white transition-colors"
                >
                  Đăng ký Sự kiện 1-Chạm
                </Link>
              </li>
              <li>
                <Link
                  href="/tra-cuu-gcn"
                  className="hover:text-white transition-colors"
                >
                  Tra cứu E-Certificate QR
                </Link>
              </li>
              <li>
                <Link
                  href="/van-ban"
                  className="hover:text-white transition-colors"
                >
                  Kho Văn bản Khóa II
                </Link>
              </li>
              <li>
                <Link
                  href="/van-ban?doc=09/QĐ-HSV"
                  className="hover:text-white transition-colors"
                >
                  Quy định 09/QĐ-HSV (2026)
                </Link>
              </li>
              <li>
                <Link
                  href="/van-ban?doc=28/QĐ-HSV"
                  className="hover:text-white transition-colors"
                >
                  Quy định 28/QĐ-HSV
                </Link>
              </li>
              <li>
                <Link
                  href="/portal?tab=voice"
                  className="hover:text-white transition-colors"
                >
                  Hộp thư Lắng nghe SV
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 5 (2/12): Điều hành E-Office & Hệ sinh thái */}
          <div className="lg:col-span-2 font-eiu-serif text-[17px] leading-[1.5]">
            <h2 className="text-[18px] font-semibold text-white mb-3.5">
              E-Office &amp; Kết nối
            </h2>
            <ul className="space-y-2 text-[#DED1BE]">
              <li>
                <Link
                  href="/workspace#overview"
                  className="hover:text-white transition-colors"
                >
                  Trung tâm E-Office
                </Link>
              </li>
              <li>
                <Link
                  href="/workspace#certificates"
                  className="hover:text-white transition-colors"
                >
                  Duyệt Ngày TN &amp; SLA
                </Link>
              </li>
              <li>
                <Link
                  href="/workspace#sv5t"
                  className="hover:text-white transition-colors"
                >
                  Hội đồng SV5T 3 Cấp
                </Link>
              </li>
              <li>
                <Link
                  href="/workspace#meetings"
                  className="hover:text-white transition-colors"
                >
                  Phòng Họp Không Giấy
                </Link>
              </li>
              <li>
                <a
                  href="https://eiu.edu.vn"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Cổng Trường EIU
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/eiuhsv"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
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
          className={`${containerClass} mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5`}
        >
          <div className="font-eiu-serif text-[16px] leading-[1.55] text-[#DED1BE] space-y-0.5">
            <p className="text-white font-semibold">
              Trụ sở Văn phòng Hội Sinh viên: Phòng 206.B06 — Số 81, Đường Nam Kỳ Khởi Nghĩa, Phường Bình Dương, TP. Hồ Chí Minh
            </p>
            <p>
              Hội viên &amp; Sinh viên EIU liên hệ:{' '}
              <a
                href="mailto:studentassociation@eiu.edu.vn"
                className="text-white underline decoration-white/40 hover:decoration-white"
              >
                studentassociation@eiu.edu.vn
              </a>{' '}
              • Công tác đối ngoại:{' '}
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
                <span>Đã đăng ký nhận thông báo hoạt động &amp; sự kiện HSV EIU!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center">
                <label htmlFor="footer-email" className="sr-only">
                  Nhập email @eiu.edu.vn để nhận bản tin hoạt động
                </label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Nhập email @eiu.edu.vn nhận thông báo..."
                  className="w-full sm:w-68 h-10 px-3.5 bg-white text-slate-900 text-xs focus:outline-none"
                />
                <button
                  type="submit"
                  className="h-10 px-5 bg-[#A68556] hover:bg-[#8e7046] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shrink-0 cursor-pointer font-eiu-display transition-colors"
                >
                  <span>ĐĂNG KÝ</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
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
