import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Be_Vietnam_Pro, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { RoleProvider } from '@/context/role-context';
import { PersonaSwitcherBar } from '@/components/shared/persona-switcher';

const beVietnamPro = Be_Vietnam_Pro({
  variable: '--font-be-vietnam',
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title:
    'Cổng thông tin Điện tử & E-Office Hội Sinh viên Việt Nam Trường Đại học Quốc tế Miền Đông (HSV EIU)',
  description:
    'Hệ thống Thông tin Điện tử, Quản lý Sự kiện, Xét chọn Sinh viên 5 Tốt, Cấp Giấy chứng nhận Điện tử và E-Office Nội bộ Hội Sinh viên Trường Đại học Quốc tế Miền Đông Khóa II (2026 - 2028).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <RoleProvider>
          <Suspense fallback={<div className="h-10 bg-slate-950" />}>
            <PersonaSwitcherBar />
          </Suspense>
          <div className="flex-1 flex flex-col">{children}</div>
        </RoleProvider>
      </body>
    </html>
  );
}
