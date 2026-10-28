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
      className={`${beVietnamPro.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head suppressHydrationWarning>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: EXTENSION_CLEANUP_SCRIPT }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-slate-50 text-slate-900"
      >
        <RoleProvider>
          <Suspense fallback={<div className="h-10 bg-slate-950" />}>
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
