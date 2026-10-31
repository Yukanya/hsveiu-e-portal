'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useRole } from '@/context/role-context';
import {
  BRANCH_UNITS,
  CLUB_UNITS,
  EVENT_ITEMS,
  ISSUED_CERTIFICATES,
  NEWS_POSTS,
  OFFICIAL_DOCUMENTS,
} from '@/data/mock-data';
import {
  Building2,
  ChevronDown,
  ExternalLink,
  Search,
  ShieldCheck,
  UserCheck,
  X,
} from 'lucide-react';

export function PersonaSwitcherBar() {
  const {
    currentPersona,
    activePosition,
    setPersonaById,
    setActivePositionById,
    allPersonas,
  } = useRole();
  const pathname = usePathname();
  const router = useRouter();

  const [openDrawer, setOpenDrawer] = useState<'NONE' | 'PERSONA' | 'SEARCH'>(
    'NONE'
  );
  const [globalQuery, setGlobalQuery] = useState('');

  const isWideWorkspace =
    pathname.startsWith('/workspace') || pathname.startsWith('/portal');
  const containerClass = isWideWorkspace
    ? 'max-w-[1200px]'
    : 'max-w-[1140px]';

  const quickResults = useMemo(() => {
    const q = globalQuery.trim().toLowerCase();
    if (!q) return null;

    const certs = ISSUED_CERTIFICATES.filter(
      (c) =>
        c.studentId.toLowerCase().includes(q) ||
        c.fullName.toLowerCase().includes(q) ||
        c.decisionNumber.toLowerCase().includes(q) ||
        c.certCode.toLowerCase().includes(q)
    ).slice(0, 3);

    const docs = OFFICIAL_DOCUMENTS.filter(
      (d) =>
        d.documentNumber.toLowerCase().includes(q) ||
        d.title.toLowerCase().includes(q)
    ).slice(0, 3);

    const posts = NEWS_POSTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q)
    ).slice(0, 3);

    const events = EVENT_ITEMS.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.organizerUnit.toLowerCase().includes(q)
    ).slice(0, 3);

    const units = [
      ...CLUB_UNITS.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.shortName.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q)
      ).map((c) => ({
        code: c.code,
        name: c.name,
        sub: `CLB/Đội • ${c.categoryLabel}`,
        href: `/to-chuc/${c.slug}`,
      })),
      ...BRANCH_UNITS.filter(
        (b) =>
          b.code.toLowerCase().includes(q) ||
          b.name.toLowerCase().includes(q) ||
          b.facultyName.toLowerCase().includes(q)
      ).map((b) => ({
        code: b.code,
        name: b.name,
        sub: `Chi hội • ${b.facultyName}`,
        href: `/to-chuc/${b.slug}`,
      })),
    ].slice(0, 4);

    return { certs, docs, posts, events, units };
  }, [globalQuery]);

  const handleGlobalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = globalQuery.trim();
    if (!trimmed) return;
    setOpenDrawer('NONE');
    if (/^\d{6,10}$/.test(trimmed) || trimmed.toUpperCase().includes('QĐ-HSV') || trimmed.toUpperCase().includes('GCN')) {
      router.push(`/tra-cuu-gcn?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(`/tin-tuc?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="bg-[#133F68] text-white text-[11.5px] relative z-50 border-b border-white/10">
      <div
        className={`${containerClass} mx-auto px-4 sm:px-6 min-h-9 py-1.5 flex flex-wrap items-center justify-between gap-2 font-eiu-display`}
      >
        {/* Trái: Liên kết Hệ sinh thái EIU & Trụ sở Văn phòng 206.B06 */}
        <div className="hidden md:flex items-center gap-3 text-white/90">
          <a
            href="https://eiu.edu.vn"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-semibold tracking-wide hover:text-[#FCB900] transition-colors"
          >
            <span>EIU.EDU.VN</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
          <span className="h-3 w-px bg-white/30" aria-hidden="true" />
          <span className="inline-flex items-center gap-1.5 text-[#DED1BE] font-medium">
            <Building2 className="w-3.5 h-3.5 text-[#A68556]" />
            <span>VP HỘI: PHÒNG 206.B06 (08:00 – 16:30)</span>
          </span>
        </div>

        {/* Phải: Tìm kiếm toàn cổng | Sổ tay Hội viên | E-Office Nội bộ | Chuyển vai trò kiêm nhiệm */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 sm:gap-3 ml-auto">
          <button
            type="button"
            onClick={() =>
              setOpenDrawer(openDrawer === 'SEARCH' ? 'NONE' : 'SEARCH')
            }
            aria-expanded={openDrawer === 'SEARCH'}
            aria-controls="global-search-drawer"
            className={`inline-flex items-center gap-1.5 uppercase tracking-wide font-semibold transition-colors cursor-pointer ${
              openDrawer === 'SEARCH'
                ? 'text-[#FCB900]'
                : 'text-white/95 hover:text-[#FCB900]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">TÌM KIẾM</span>
          </button>

          <span className="h-3 w-px bg-white/35" aria-hidden="true" />

          <Link
            href="/portal"
            className={`uppercase tracking-wide transition-colors ${
              pathname.startsWith('/portal')
                ? 'text-[#FCB900] font-bold'
                : 'text-white/95 hover:text-[#DED1BE]'
            }`}
          >
            SỔ TAY HỘI VIÊN
          </Link>

          <span className="h-3 w-px bg-white/35" aria-hidden="true" />

          <Link
            href="/workspace"
            className={`inline-flex items-center gap-1 uppercase tracking-wide transition-colors ${
              pathname.startsWith('/workspace')
                ? 'text-[#FCB900] font-bold'
                : 'text-white/95 hover:text-[#DED1BE]'
            }`}
          >
            <span>E-OFFICE</span>
            <span className="hidden sm:inline font-mono text-[10px] px-1.5 py-0.5 bg-white/15 text-[#FCB900]">
              CẤP {activePosition.roleLevel}/6
            </span>
          </Link>

          <span className="h-3 w-px bg-white/35" aria-hidden="true" />

          {/* Tên người dùng + MSSV chuẩn "TRƯƠNG CHÂU PHƯỚC LỘC (2331200066) ▾" */}
          <button
            type="button"
            onClick={() =>
              setOpenDrawer(openDrawer === 'PERSONA' ? 'NONE' : 'PERSONA')
            }
            aria-expanded={openDrawer === 'PERSONA'}
            aria-controls="persona-switcher-panel"
            className={`inline-flex items-center gap-1.5 uppercase tracking-wide font-semibold transition-colors cursor-pointer ${
              openDrawer === 'PERSONA'
                ? 'text-[#FCB900]'
                : 'text-white hover:text-[#FCB900]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#00BCFF] hidden sm:inline" />
            <span>
              {currentPersona.fullName}
              {currentPersona.studentId !== '-'
                ? ` (${currentPersona.studentId})`
                : ''}
            </span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KHAY 1: TÌM KIẾM THÔNG MINH TOÀN CỔNG (Góc vuông chuẩn EIU) */}
      {openDrawer === 'SEARCH' && (
        <div
          id="global-search-drawer"
          role="region"
          aria-label="Tìm kiếm toàn cổng thông tin HSV EIU"
          className="bg-[#02294E] border-t border-white/15 shadow-2xl"
        >
          <div className={`${containerClass} mx-auto px-4 sm:px-6 py-5 space-y-4`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#00BCFF] font-eiu-display">
                Tìm kiếm Toàn Cổng thông tin Điện tử HSV EIU (MSSV • Số QĐ • Tin tức • Chi hội &amp; CLB)
              </span>
              <button
                type="button"
                onClick={() => setOpenDrawer('NONE')}
                aria-label="Đóng khung tìm kiếm"
                className="p-1 text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleGlobalSearchSubmit}
              className="flex flex-col sm:flex-row gap-2.5"
            >
              <label htmlFor="global-portal-search" className="sr-only">
                Từ khóa tìm kiếm toàn cổng
              </label>
              <input
                id="global-portal-search"
                type="text"
                autoFocus
                value={globalQuery}
                onChange={(e) => setGlobalQuery(e.target.value)}
                placeholder="Nhập MSSV (VD: 2331200066), Số QĐ (32/QĐ-HSV, 09/QĐ-HSV), tên CLB hoặc mã Chi hội (25CNTT01)..."
                className="flex-1 h-10 px-3.5 bg-white text-slate-900 text-sm rounded focus:outline-none"
              />
              <button
                type="submit"
                className="h-10 px-6 bg-[#A68556] hover:bg-[#8e7046] text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer shrink-0"
              >
                Tìm kiếm ngay
              </button>
            </form>

            {quickResults ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs">
                {/* Cột 1: E-Certificate & Văn bản */}
                <div className="bg-[#133F68] border border-white/10 p-3.5 space-y-2">
                  <div className="font-bold uppercase tracking-wider text-[#FCB900] text-[11px]">
                    Giấy chứng nhận &amp; Văn bản ({quickResults.certs.length + quickResults.docs.length})
                  </div>
                  {quickResults.certs.length === 0 && quickResults.docs.length === 0 ? (
                    <p className="text-white/60">Không khớp hồ sơ GCN / Quyết định.</p>
                  ) : (
                    <ul className="space-y-2">
                      {quickResults.certs.map((c) => (
                        <li key={c.id}>
                          <Link
                            href={`/tra-cuu-gcn?q=${encodeURIComponent(c.studentId)}`}
                            onClick={() => setOpenDrawer('NONE')}
                            className="block hover:text-[#FCB900]"
                          >
                            <span className="font-mono text-[#00BCFF]">{c.studentId}</span> —{' '}
                            <strong>{c.fullName}</strong> ({c.decisionNumber})
                          </Link>
                        </li>
                      ))}
                      {quickResults.docs.map((d) => (
                        <li key={d.id}>
                          <Link
                            href={`/van-ban?doc=${encodeURIComponent(d.documentNumber)}`}
                            onClick={() => setOpenDrawer('NONE')}
                            className="block hover:text-[#FCB900] line-clamp-1"
                          >
                            <span className="font-mono text-[#DED1BE]">{d.documentNumber}</span>:{' '}
                            {d.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Cột 2: Chi hội & CLB */}
                <div className="bg-[#133F68] border border-white/10 p-3.5 space-y-2">
                  <div className="font-bold uppercase tracking-wider text-[#FCB900] text-[11px]">
                    25 Chi hội &amp; 30 CLB ({quickResults.units.length})
                  </div>
                  {quickResults.units.length === 0 ? (
                    <p className="text-white/60">Không khớp mã Chi hội hoặc tên CLB.</p>
                  ) : (
                    <ul className="space-y-2">
                      {quickResults.units.map((u) => (
                        <li key={u.code}>
                          <Link
                            href={u.href}
                            onClick={() => setOpenDrawer('NONE')}
                            className="block hover:text-[#FCB900]"
                          >
                            <strong className="text-white">{u.name}</strong>
                            <span className="block text-[11px] text-[#DED1BE]">{u.sub}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Cột 3: Tin tức & Sự kiện */}
                <div className="bg-[#133F68] border border-white/10 p-3.5 space-y-2">
                  <div className="font-bold uppercase tracking-wider text-[#FCB900] text-[11px]">
                    Tin tức &amp; Sự kiện ({quickResults.posts.length + quickResults.events.length})
                  </div>
                  {quickResults.posts.length === 0 && quickResults.events.length === 0 ? (
                    <p className="text-white/60">Không khớp bài viết hoặc sự kiện.</p>
                  ) : (
                    <ul className="space-y-2">
                      {quickResults.posts.map((p) => (
                        <li key={p.id}>
                          <Link
                            href={`/tin-tuc/${p.slug}`}
                            onClick={() => setOpenDrawer('NONE')}
                            className="block hover:text-[#FCB900] line-clamp-1"
                          >
                            [Tin tức] {p.title}
                          </Link>
                        </li>
                      ))}
                      {quickResults.events.map((ev) => (
                        <li key={ev.id}>
                          <Link
                            href={`/su-kien?event=${encodeURIComponent(ev.id)}`}
                            onClick={() => setOpenDrawer('NONE')}
                            className="block hover:text-[#FCB900] line-clamp-1"
                          >
                            [Sự kiện] {ev.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#DED1BE]">
                <span>Gợi ý tra cứu nhanh:</span>
                {[
                  { label: 'MSSV: 2331200066', href: '/tra-cuu-gcn?q=2331200066' },
                  { label: 'Phụ lục 1: 32/QĐ-HSV', href: '/tra-cuu-gcn?q=32/QĐ-HSV' },
                  { label: 'SV5T 2026: 09/QĐ-HSV', href: '/van-ban?doc=09/QĐ-HSV' },
                  { label: 'Chi hội 25CNTT01', href: '/to-chuc/chi-hoi-25cntt01' },
                  { label: 'Đội CTV Xung kích', href: '/to-chuc/doi-cong-tac-vien-xung-kich' },
                ].map((tag) => (
                  <Link
                    key={tag.label}
                    href={tag.href}
                    onClick={() => setOpenDrawer('NONE')}
                    className="px-2.5 py-1 bg-white/10 hover:bg-[#A68556] text-white transition-colors"
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* KHAY 2: CHUYỂN ĐỔI TÀI KHOẢN & VỊ TRÍ KIÊM NHIỆM (RBAC 6 CẤP + CONTEXT SWITCHER) */}
      {openDrawer === 'PERSONA' && (
        <div
          id="persona-switcher-panel"
          role="region"
          aria-label="Chuyển đổi tài khoản và chức vụ kiêm nhiệm"
          className="bg-[#02294E] border-t border-white/15 shadow-2xl"
        >
          <div className={`${containerClass} mx-auto px-4 sm:px-6 py-4 space-y-3`}>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FCB900] font-eiu-display">
                <ShieldCheck className="w-4 h-4 text-[#00BCFF]" />
                <span>
                  Giả lập Phiên Đăng nhập `@eiu.edu.vn` &amp; Chuyển Ngữ cảnh Kiêm nhiệm (Cấp{' '}
                  {activePosition.roleLevel}/6)
                </span>
              </span>
              <button
                type="button"
                onClick={() => setOpenDrawer('NONE')}
                aria-label="Đóng khay chuyển vai trò"
                className="p-1 text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="select-demo-persona"
                  className="block text-xs text-[#DED1BE] mb-1 font-sans"
                >
                  Tài khoản Google Workspace (`@eiu.edu.vn`):
                </label>
                <select
                  id="select-demo-persona"
                  value={currentPersona.id}
                  onChange={(e) => setPersonaById(e.target.value)}
                  className="w-full min-h-9 rounded bg-white text-slate-900 px-3 py-1.5 text-xs font-medium"
                >
                  {allPersonas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.studentId}) —{' '}
                      {p.bchRole !== 'Không' ? p.bchRole : p.internalDeptRole}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="select-active-position"
                  className="block text-xs text-[#DED1BE] mb-1 font-sans"
                >
                  Ngữ cảnh Tác nghiệp Kiêm nhiệm ({currentPersona.positions.length} vị trí):
                </label>
                <select
                  id="select-active-position"
                  value={activePosition.id}
                  onChange={(e) => setActivePositionById(e.target.value)}
                  className="w-full min-h-9 rounded bg-white text-slate-900 px-3 py-1.5 text-xs font-semibold"
                >
                  {currentPersona.positions.map((pos) => (
                    <option key={pos.id} value={pos.id}>
                      [Cấp {pos.roleLevel}/6] {pos.positionTitle} — {pos.unitName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
