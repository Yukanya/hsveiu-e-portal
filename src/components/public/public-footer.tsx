import React from 'react';
import Link from 'next/link';
import { MapPin, Mail, Phone, Shield, ExternalLink } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="bg-[#0B2545] text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0054A6] flex items-center justify-center text-white font-extrabold text-sm">
                HSV
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-sky-400">
                  Hội Sinh viên Việt Nam
                </p>
                <p className="text-sm font-bold text-white">
                  Trường Đại học Quốc tế Miền Đông
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cổng thông tin Điện tử & Hệ thống E-Office Ban Chấp hành Hội Sinh viên Việt Nam Trường
              Đại học Quốc tế Miền Đông Khóa II, nhiệm kỳ 2026 – 2028.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>Nhân bản – Cộng đồng – Sáng tạo – Bền vững (UN SDGs)</span>
            </div>
          </div>

          {/* Column 2: Contact Office 206.B06 */}
          <div className="space-y-2.5 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Văn phòng Đoàn – Hội ("Nhà Bồ Câu Trắng")
            </h3>
            <p className="flex items-start gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>
                Phòng 206, Tòa nhà B6 (206.B06), Số 81 Đường Nam Kỳ Khởi Nghĩa, Phường Bình Dương,
                TP. Hồ Chí Minh
              </span>
            </p>
            <p className="flex items-center gap-2 text-slate-300">
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="font-mono">studentassociation@eiu.edu.vn</span>
            </p>
            <p className="flex items-center gap-2 text-slate-300">
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="font-mono text-[11px]">
                hsvdhquoctemiendong@hoisinhvientphcm.com
              </span>
            </p>
            <p className="flex items-center gap-2 text-slate-300">
              <Phone className="w-4 h-4 text-sky-400 shrink-0" />
              <span>0274 222 0340 • Phòng CTSV (101.B5): 0274 222 1186</span>
            </p>
          </div>

          {/* Column 3: 4 Khoa Đào tạo & Cụm hoạt động */}
          <div className="space-y-2 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              04 Cụm Hoạt động Khoa & Khối CLB
            </h3>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <Link href="/to-chuc?tab=branches&faculty=BBS" className="hover:text-white">
                  • Cụm Khoa Quản trị Kinh doanh (BBS – 104.B3)
                </Link>
              </li>
              <li>
                <Link href="/to-chuc?tab=branches&faculty=SET" className="hover:text-white">
                  • Cụm Khoa Kỹ thuật (SET – 303.B10)
                </Link>
              </li>
              <li>
                <Link href="/to-chuc?tab=branches&faculty=CIT" className="hover:text-white">
                  • Cụm Khoa Công nghệ Thông tin (CIT – 301.B10)
                </Link>
              </li>
              <li>
                <Link href="/to-chuc?tab=branches&faculty=SNS" className="hover:text-white">
                  • Cụm Khoa Khoa học Sức khỏe (SNS – 311.B10)
                </Link>
              </li>
              <li>
                <Link href="/to-chuc?tab=clubs" className="hover:text-white">
                  • Cụm 30 Câu lạc bộ / Đội / Nhóm trực thuộc
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Links */}
          <div className="space-y-2 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Phân khu Hệ thống & Liên kết EIU
            </h3>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <Link href="/gioi-thieu" className="hover:text-white">
                  Sơ đồ Bộ máy & Danh bạ BCH Khóa II
                </Link>
              </li>
              <li>
                <Link href="/tra-cuu-gcn" className="hover:text-white">
                  Cổng xác thực E-Certificate (QĐ 28/QĐ-HSV)
                </Link>
              </li>
              <li>
                <Link href="/portal" className="hover:text-white">
                  Sổ tay Kỹ thuật số Sinh viên 5 Tốt (QĐ 09/QĐ-HSV)
                </Link>
              </li>
              <li>
                <Link href="/workspace" className="hover:text-white">
                  E-Office Nội bộ & Họp không giấy (QĐ 23, 24/QĐ-HSV)
                </Link>
              </li>
              <li>
                <a
                  href="https://eiu.edu.vn"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sky-400 hover:underline"
                >
                  Trang chủ EIU (eiu.edu.vn) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © 2026 Ban Chấp hành Hội Sinh viên Việt Nam Trường Đại học Quốc tế Miền Đông (Khóa II,
            NK 2026 – 2028).
          </p>
          <p>
            Chủ nhiệm dự án / Kiến trúc sư trưởng:{' '}
            <strong className="text-slate-200">Đ/c Trương Châu Phước Lộc</strong> (Chủ tịch HSV
            Trường)
          </p>
        </div>
      </div>
    </footer>
  );
}
