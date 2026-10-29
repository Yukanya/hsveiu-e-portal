'use client';

import React from 'react';
import Link from 'next/link';
import { Send } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="bg-[#133F68] text-white">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-12 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Cột 1: Cụm Logo EIU trắng & Logo Hội Sinh viên giống hệt Footer eiu.edu.vn */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-start gap-3">
              <img
                src="/images/eiu-logo-full-white.png"
                alt="Trường Đại học Quốc tế Miền Đông"
                className="h-28 w-auto object-contain"
              />
              <img
                src="/images/hsv-logo.png"
                alt="Hội Sinh viên Việt Nam"
                className="h-11 w-11 object-contain mt-1"
              />
            </div>
          </div>

          {/* Cột 2: Nổi bật */}
          <div className="lg:col-span-2 space-y-2.5 text-xs">
            <h2 className="text-sm font-bold text-white mb-3">Nổi bật</h2>
            <ul className="space-y-2 text-[#DED1BE]">
              <li>
                <Link href="/gioi-thieu" className="hover:text-white">
                  Cơ cấu tổ chức
                </Link>
              </li>
              <li>
                <Link href="/portal" className="hover:text-white">
                  Sinh viên 5 Tốt
                </Link>
              </li>
              <li>
                <Link href="/su-kien" className="hover:text-white">
                  Sự kiện
                </Link>
              </li>
              <li>
                <Link href="/tra-cuu-gcn" className="hover:text-white">
                  Giấy chứng nhận
                </Link>
              </li>
              <li>
                <Link href="/van-ban" className="hover:text-white">
                  Văn bản
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Sinh viên */}
          <div className="lg:col-span-2 space-y-2.5 text-xs">
            <h2 className="text-sm font-bold text-white mb-3">Sinh viên</h2>
            <ul className="space-y-2 text-[#DED1BE]">
              <li>
                <Link href="/portal" className="hover:text-white">
                  Hồ sơ Hội viên
                </Link>
              </li>
              <li>
                <Link href="/portal" className="hover:text-white">
                  Tính GPA 3 Học kỳ
                </Link>
              </li>
              <li>
                <Link href="/to-chuc" className="hover:text-white">
                  25 Chi hội
                </Link>
              </li>
              <li>
                <Link href="/to-chuc" className="hover:text-white">
                  30 CLB – Đội – Nhóm
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Cán bộ Hội */}
          <div className="lg:col-span-2 space-y-2.5 text-xs">
            <h2 className="text-sm font-bold text-white mb-3">Cán bộ Hội</h2>
            <ul className="space-y-2 text-[#DED1BE]">
              <li>
                <Link href="/workspace" className="hover:text-white">
                  E-Office Nội bộ
                </Link>
              </li>
              <li>
                <Link href="/workspace#certificates" className="hover:text-white">
                  Duyệt Ngày tình nguyện
                </Link>
              </li>
              <li>
                <Link href="/workspace#office" className="hover:text-white">
                  Văn phòng 206.B06
                </Link>
              </li>
              <li>
                <Link href="/workspace#meetings" className="hover:text-white">
                  Họp không giấy
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 5: Đơn vị trực thuộc */}
          <div className="lg:col-span-2 space-y-2.5 text-xs">
            <h2 className="text-sm font-bold text-white mb-3">Ban Chuyên môn</h2>
            <ul className="space-y-2 text-[#DED1BE]">
              <li>
                <Link href="/gioi-thieu" className="hover:text-white">
                  Văn phòng Hội Sinh viên
                </Link>
              </li>
              <li>
                <Link href="/gioi-thieu" className="hover:text-white">
                  Ban Tổ chức – Xây dựng Hội
                </Link>
              </li>
              <li>
                <Link href="/gioi-thieu" className="hover:text-white">
                  Ban Tuyên giáo – Phong trào
                </Link>
              </li>
              <li>
                <Link href="/gioi-thieu" className="hover:text-white">
                  Ban Kiểm tra
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 6: Mạng xã hội */}
          <div className="lg:col-span-1 space-y-2.5 text-xs">
            <h2 className="text-sm font-bold text-white mb-3">Kết nối</h2>
            <ul className="space-y-2 text-[#DED1BE]">
              <li>
                <a
                  href="https://eiu.edu.vn"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  EIU Web
                </a>
              </li>
              <li>
                <a
                  href="mailto:youth.union@eiu.edu.vn"
                  className="hover:text-white"
                >
                  Email
                </a>
              </li>
              <li>
                <Link href="/to-chuc" className="hover:text-white">
                  Fanpage
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Thanh đáy Footer giống hệt eiu.edu.vn (Địa chỉ bên trái, Ô nhận bản tin bên phải) */}
      <div className="border-t border-white/15">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-[#DED1BE]">
          <div className="space-y-1">
            <p>
              Phòng 206.B06 — Đường Nam Kỳ Khởi Nghĩa, Phường Bình Dương, TP. Hồ Chí Minh
            </p>
            <p>(+84) 0274 222 0341 • youth.union@eiu.edu.vn</p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center w-full md:w-auto max-w-md"
          >
            <label htmlFor="footer-email" className="sr-only">
              Nhập email của bạn để nhận thông báo
            </label>
            <input
              id="footer-email"
              type="email"
              placeholder="Nhập email @eiu.edu.vn để nhận thông báo"
              className="w-full md:w-64 h-10 px-3 bg-white text-slate-900 text-xs focus:outline-none"
            />
            <button
              type="submit"
              className="h-10 px-5 bg-[#1B5E91] hover:bg-[#154A73] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>ĐĂNG KÝ</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}
