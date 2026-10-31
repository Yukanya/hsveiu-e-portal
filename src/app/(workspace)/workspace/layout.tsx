import React from 'react';
import { PublicNavbar } from '@/components/public/public-navbar';
import { PublicFooter } from '@/components/public/public-footer';

export type WorkspaceModuleId =
  | 'overview'
  | 'certificates'
  | 'sv5t'
  | 'collective'
  | 'documents'
  | 'tgpt'
  | 'office'
  | 'meetings';

export const WORKSPACE_MODULES: {
  id: WorkspaceModuleId;
  label: string;
  badge?: string;
  title: string;
  shortDesc: string;
}[] = [
  {
    id: 'overview',
    label: 'Tổng quan Điều hành',
    title: 'TRUNG TÂM ĐIỀU HÀNH E-OFFICE — HỘI SINH VIÊN EIU KHÓA II (2026 – 2028)',
    shortDesc:
      'Chỉ số điều hành toàn hệ thống 55 cơ sở Hội và hàng đợi phê duyệt ưu tiên.',
  },
  {
    id: 'certificates',
    label: 'Duyệt Ngày TN & Cấp GCN',
    badge: 'QĐ 28',
    title: 'THẨM ĐỊNH NGÀY TÌNH NGUYỆN & CẤP E-CERTIFICATE (28/QĐ-HSV)',
    shortDesc:
      'Thẩm định tờ trình trước ≥ 03 ngày, xuất Phụ lục 1 tăng dần MSSV & cấp Quyết định trong SLA 07 ngày làm việc.',
  },
  {
    id: 'sv5t',
    label: 'Hội đồng Xét chọn SV5T',
    badge: 'QĐ 09',
    title: 'HỘI ĐỒNG XÉT DUYỆT 3 CẤP SINH VIÊN 5 TỐT & TOP 10% TIÊU BIỂU (2026)',
    shortDesc:
      'Xét duyệt hồ sơ Cấp 1 → Cấp 2 → Cấp 3 (chuẩn GPA ≥ 3.00) và lọc ứng viên Top 10% Tiêu biểu toàn trường.',
  },
  {
    id: 'collective',
    label: 'Tập thể SV5T (25 Chi hội)',
    badge: '25 CH',
    title: 'CHỈ TIÊU TẬP THỂ SINH VIÊN 5 TỐT — 25 CHI HỘI THUỘC 04 CỤM KHOA',
    shortDesc:
      'Giám sát đồng thời 03 điều kiện: 100% hội viên đăng ký, ≥ 30% đạt SV5T cấp Trường, 0% vi phạm kỷ luật.',
  },
  {
    id: 'documents',
    label: 'Văn thư & Duyệt Kế hoạch',
    badge: 'MỚI',
    title: 'VĂN THƯ LƯU TRỮ SỐ & QUY TRÌNH TRÌNH DUYỆT KẾ HOẠCH 04 BƯỚC',
    shortDesc:
      'Luồng duyệt kế hoạch trực tuyến: Cơ sở Hội nộp → Cụm trưởng thẩm định → Văn phòng 206.B06 rà thể thức → BTK ký ban hành.',
  },
  {
    id: 'tgpt',
    label: 'Ban TG-PT & Đội CTVXK',
    title: 'BAN TUYÊN GIÁO – PHONG TRÀO (02 MẢNG, 06 TIỂU BAN) & ĐỘI CTV XUNG KÍCH',
    shortDesc:
      'Điều phối Mảng Tuyên giáo, Mảng Phong trào, Đội CTV Xung kích (02 tiểu ban) và xuất bản CMS Tin tức.',
  },
  {
    id: 'office',
    label: 'Văn phòng 206.B06 & Tài sản',
    badge: '206.B06',
    title: 'QUẢN TRỊ VĂN PHÒNG 206.B06 — LỊCH TRỰC, MƯỢN TÀI SẢN & SỔ CON DẤU MỘC',
    shortDesc:
      'Cơ chế đồng điều hành Chánh VP / Tổng Thư ký, quản lý thiết bị dùng chung và nhật ký đóng dấu pháp lý (24/QĐ-HSV).',
  },
  {
    id: 'meetings',
    label: 'Họp Không Giấy & Ban KT',
    badge: 'QĐ 23',
    title: 'PHÒNG HỌP KHÔNG GIẤY (23/QĐ-HSV), BIỂU QUYẾT SỐ & BAN KIỂM TRA',
    shortDesc:
      'Biểu quyết nghị quyết BCH/BTK thời gian thực và giám sát xử lý Hộp thư Lắng nghe Sinh viên của Ban Kiểm tra (05 đ/c).',
  },
];

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      <PublicNavbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
