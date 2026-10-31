import type { Metadata } from 'next';
import { Suspense } from 'react';
import {
  Be_Vietnam_Pro,
  Crimson_Text,
  JetBrains_Mono,
  Montserrat,
} from 'next/font/google';
import './globals.css';
import { RoleProvider } from '@/context/role-context';
import { PersonaSwitcherBar } from '@/components/shared/persona-switcher';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700', '800'],
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: '--font-be-vietnam',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
});

const crimsonText = Crimson_Text({
  variable: '--font-crimson-text',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title:
    'Hội Sinh viên Việt Nam | Trường Đại học Quốc tế Miền Đông (EIU)',
  description:
    'Cổng thông tin Điện tử, Quản lý Sự kiện, Xét chọn Sinh viên 5 Tốt, Cấp Giấy chứng nhận Điện tử và Hệ thống E-Office Hội Sinh viên Trường Đại học Quốc tế Miền Đông Khóa II (2026 - 2028).',
};

const EXTENSION_CLEANUP_SCRIPT = `
(function () {
  try {
    function cleanElement(el) {
      if (!el || !el.getAttributeNames) return;
      var attrs = el.getAttributeNames();
      for (var i = 0; i < attrs.length; i++) {
        var name = attrs[i];
        if (
          name === 'bis_skin_checked' ||
          name === 'bis_register' ||
          name.indexOf('bis_') === 0 ||
          name.indexOf('__processed_') === 0
        ) {
          el.removeAttribute(name);
        }
      }
    }
    function cleanTree(root) {
      if (!root) return;
      cleanElement(root);
      if (root.querySelectorAll) {
        var nodes = root.querySelectorAll('[bis_skin_checked], [bis_register]');
        for (var i = 0; i < nodes.length; i++) {
          cleanElement(nodes[i]);
        }
      }
    }
    cleanTree(document.documentElement);
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.type === 'attributes' && m.target) {
          var attr = m.attributeName || '';
          if (
            attr === 'bis_skin_checked' ||
            attr === 'bis_register' ||
            attr.indexOf('bis_') === 0 ||
            attr.indexOf('__processed_') === 0
          ) {
            m.target.removeAttribute(attr);
          }
        } else if (m.type === 'childList' && m.addedNodes) {
          for (var j = 0; j < m.addedNodes.length; j++) {
            var node = m.addedNodes[j];
            if (node && node.nodeType === 1) {
              cleanTree(node);
            }
          }
        }
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${montserrat.variable} ${beVietnamPro.variable} ${crimsonText.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head suppressHydrationWarning>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: EXTENSION_CLEANUP_SCRIPT }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#F5F5F5] text-[#0F172A] text-[14px]"
      >
        {/* Skip-to-Content Link chuẩn WCAG 2.1 AA */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#133F68] focus:text-white focus:font-semibold focus:shadow-lg"
        >
          Chuyển thẳng tới nội dung chính
        </a>

        <RoleProvider>
          <Suspense fallback={<div className="h-9 bg-[#133F68]" />}>
            <PersonaSwitcherBar />
          </Suspense>
          <div suppressHydrationWarning className="flex-1 flex flex-col">
            {children}
          </div>
        </RoleProvider>
      </body>
    </html>
  );
}
