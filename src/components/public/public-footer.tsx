import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="bg-[#133F68] text-white border-t-4 border-[#A68556]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Cột 1: Nhận diện EIU & Hội Sinh viên Trường */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5 bg-white px-4 py-2.5 rounded-xl w-fit">
              <img
                src="/images/eiu-logo.png"
                alt="Logo Trường Đại học Quốc tế Miền Đông"
                className="h-10 w-auto object-contain"
              />
              <div className="h-8 w-px bg-slate-200" aria-hidden="true" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#A68556] font-eiu-display">
                  HỘI SINH VIÊN VIỆT NAM
                </div>
                <div className="text-xs font-extrabold text-[#133F68] font-eiu-display">
                  TRƯỜNG ĐẠI HỌC QUỐC TẾ MIỀN ĐÔNG
                </div>
              </div>
            </div>
            <p className="text-sm text-[#DED1BE] leading-relaxed">
              Cổng thông tin Điện tử, Xét chọn Danh hiệu &quot;Sinh viên 5 Tốt&quot;, Cấp Giấy chứng nhận Điện tử và Điều hành Nội bộ Hội Sinh viên Việt Nam Trường Đại học Quốc tế Miền Đông Khóa II, nhiệm kỳ 2026 – 2028.
            </p>
          </div>

          {/* Cột 2: Liên hệ Văn phòng 206.B06 */}
          <div className="lg:col-span-4 space-y-3 text-sm">
            <h2 className="text-base font-bold text-white uppercase tracking-wide font-eiu-display">
              Văn phòng Hội Sinh viên
            </h2>
            <ul className="space-y-2.5 text-[#DED1BE]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FCB900] shrink-0 mt-1" />
                <span>
                  <strong className="text-white">Phòng 206.B06</strong> — Đường Nam Kỳ Khởi Nghĩa, Phường Bình Dương, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FCB900] shrink-0" />
                <a
                  href="mailto:youth.union@eiu.edu.vn"
                  className="hover:text-white underline underline-offset-4"
                >
                  youth.union@eiu.edu.vn
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FCB900] shrink-0" />
                <span>Phòng Công tác Sinh viên (101.B5): (0274) 222 0341</span>
              </li>
            </ul>
          </div>

          {/* Cột 3: Liên kết nhanh */}
          <div className="lg:col-span-3 space-y-3 text-sm">
            <h2 className="text-base font-bold text-white uppercase tracking-wide font-eiu-display">
              Phân hệ Hệ thống
            </h2>
            <ul className="space-y-2 text-[#DED1BE]">
              <li>
                <Link href="/gioi-thieu" className="hover:text-white transition-colors">
                  Cơ cấu Tổ chức &amp; Ban Chấp hành
                </Link>
              </li>
              <li>
                <Link href="/to-chuc" className="hover:text-white transition-colors">
                  25 Chi hội &amp; 30 CLB / Đội / Nhóm
                </Link>
              </li>
              <li>
                <Link href="/tra-cuu-gcn" className="hover:text-white transition-colors">
                  Tra cứu Giấy chứng nhận (QĐ 28)
                </Link>
              </li>
              <li>
                <Link href="/portal" className="hover:text-white transition-colors">
                  Sổ tay Sinh viên 5 Tốt (/portal)
                </Link>
              </li>
              <li>
                <Link href="/workspace" className="hover:text-white transition-colors">
                  Bàn làm việc Cán bộ (/workspace)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#DED1BE]">
          <p>
            © 2026 Hội Sinh viên Việt Nam Trường Đại học Quốc tế Miền Đông (Eastern International University).
          </p>
          <p className="font-mono text-white/90">
            09/QĐ-HSV • 23/QĐ-HSV • 24/QĐ-HSV • 28/QĐ-HSV • 04/TB-HSV
          </p>
        </div>
      </div>
    </footer>
  );
}
