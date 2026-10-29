import React from 'react';
import { PublicNavbar } from '@/components/public/public-navbar';
import { PublicFooter } from '@/components/public/public-footer';

export type WorkspaceModuleId =
  | 'overview'
  | 'certificates'
  | 'sv5t'
  | 'collective'
  | 'tgpt'
  | 'office'
  | 'meetings';

export const WORKSPACE_MODULES: {
  id: WorkspaceModuleId;
  label: string;
  title: string;
  shortDesc: string;
}[] = [
  {
    id: 'overview',
    label: 'Tổng quan Điều hành',
    title: 'TRUNG TÂM ĐIỀU HÀNH E-OFFICE — HỘI SINH VIÊN EIU KHÓA II',
    shortDesc: 'Chỉ số điều hành trọng tâm & Hàng đợi phê duyệt ưu tiên.',
  },
  {
    id: 'certificates',
    label: 'Duyệt Ngày TN & Cấp GCN',
    title: 'THẨM ĐỊNH NGÀY TÌNH NGUYỆN & CẤP E-CERTIFICATE (28/QĐ-HSV)',
    shortDesc: 'Thẩm định tờ trình trước ≥ 03 ngày & Cấp Quyết định trong SLA 07 ngày.',
  },
  {
    id: 'sv5t',
    label: 'Hội đồng Xét chọn SV5T',
    title: 'HỘI ĐỒNG XÉT CHỌN SINH VIÊN 5 TỐT & TOP 10% TIÊU BIỂU (09/QĐ-HSV)',
    shortDesc: 'Xét duyệt 3 cấp & Lọc ứng viên Sinh viên 5 Tốt tiêu biểu toàn trường.',
  },
  {
    id: 'collective',
    label: 'Tập thể SV5T (25 Chi hội)',
    title: 'CHỈ TIÊU TẬP THỂ SINH VIÊN 5 TỐT — 25 CHI HỘI THUỘC 04 CỤM KHOA',
    shortDesc: '100% hội viên đăng ký, ≥ 30% đạt danh hiệu SV5T, 0 vi phạm kỷ luật.',
  },
  {
    id: 'tgpt',
    label: 'Ban TG-PT & Đội CTVXK',
    title: 'BAN TUYÊN GIÁO - PHONG TRÀO (02 MẢNG, 06 TIỂU BAN) & ĐỘI CTV XUNG KÍCH',
    shortDesc: 'Điều phối Mảng Tuyên giáo, Mảng Phong trào và Đội CTV Xung kích.',
  },
  {
    id: 'office',
    label: 'Văn phòng 206.B06 & Con dấu',
    title: 'QUẢN TRỊ VĂN PHÒNG 206.B06 — LỊCH TRỰC & SỔ ĐÓNG DẤU MỘC (24/QĐ-HSV)',
    shortDesc: 'Lịch trực Chánh VP / Tổng Thư ký và nhật ký đóng dấu pháp lý.',
  },
  {
    id: 'meetings',
    label: 'Họp Không Giấy & Ban Kiểm Tra',
    title: 'PHÒNG HỌP KHÔNG GIẤY (23/QĐ-HSV) & HỘP THƯ GIÁM SÁT BAN KIỂM TRA',
    shortDesc: 'Hội nghị BCH/BTK định kỳ và xử lý kiến nghị sinh viên.',
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
