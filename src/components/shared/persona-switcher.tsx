'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useRole } from '@/context/role-context';
import {
  BRANCH_UNITS,
  CLUB_UNITS,
  EVENT_ITEMS,
  NEWS_POSTS,
  OFFICIAL_DOCUMENTS,
} from '@/data/mock-data';
import { getAllCertificates } from '@/lib/portal-storage';
import {
  ChevronDown,
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

  const isWorkspaceRoute = pathname.startsWith('/workspace');

  // Phím tắt Cmd/Ctrl + K mở nhanh khay Tìm kiếm Toàn Cổng (trên các trang công khai và Portal)
  useEffect(() => {
    if (isWorkspaceRoute) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpenDrawer((prev) => (prev === 'SEARCH' ? 'NONE' : 'SEARCH'));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isWorkspaceRoute]);

  const containerClass = 'max-w-[1200px] xl:max-w-[1240px]';

  const quickResults = useMemo(() => {
    const q = globalQuery.trim().toLowerCase();
    if (!q) return null;

    const allCerts = getAllCertificates();
    const certs = allCerts
      .filter(
        (c) =>
          c.studentId.toLowerCase().includes(q) ||
          c.fullName.toLowerCase().includes(q) ||
          c.decisionNumber.toLowerCase().includes(q) ||
          c.certCode.toLowerCase().includes(q)
      )
      .slice(0, 3);

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

  // Ẩn hoàn toàn thanh utility công khai khi ở trong vỏ E-Office riêng (/workspace)
  if (isWorkspaceRoute) {
    return null;
  }

  const handleGlobalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = globalQuery.trim();
    if (!trimmed) return;
    setOpenDrawer('NONE');
    if (
      /^\d{6,10}$/.test(trimmed) ||
      trimmed.toUpperCase().includes('QĐ-HSV') ||
      trimmed.toUpperCase().includes('GCN')
    ) {
      router.push(`/tra-cuu-gcn?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(`/tin-tuc?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="bg-[#133F68] text-white text-[11.5px] relative z-50 border-b border-white/10">
      <div
        className={`${containerClass} mx-auto px-3 sm:px-6 min-h-10 py-1 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 font-eiu-display`}
      >
        <div className="flex flex-wrap items-center justify-end gap-x-2 sm:gap-x-3 gap-y-1 ml-auto w-full sm:w-auto">
          <button
            type="button"
            onClick={() =>
              setOpenDrawer(openDrawer === 'SEARCH' ? 'NONE' : 'SEARCH')
            }
            aria-expanded={openDrawer === 'SEARCH'}
            aria-controls="global-search-drawer"
            aria-label="Mở tìm kiếm"
            className={`min-h-[36px] sm:min-h-[32px] inline-flex items-center gap-1.5 uppercase tracking-wide font-semibold transition-colors cursor-pointer px-2 py-1 rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900] ${
              openDrawer === 'SEARCH'
                ? 'text-[#FCB900]'
                : 'text-white/95 hover:text-[#FCB900]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">TÌM KIẾM</span>
          </button>

          <span className="hidden sm:inline-block h-3 w-px bg-white/35" aria-hidden="true" />

          <Link
            href="/portal"
            className={`min-h-[36px] sm:min-h-[32px] inline-flex items-center uppercase tracking-wide transition-colors px-2 py-1 rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900] ${
              pathname.startsWith('/portal')
                ? 'text-[#FCB900] font-bold'
                : 'text-white/95 hover:text-[#DED1BE]'
            }`}
          >
            HỒ SƠ HỘI VIÊN
          </Link>

          <span className="hidden sm:inline-block h-3 w-px bg-white/35" aria-hidden="true" />

          <Link
            href="/workspace"
            className="min-h-[36px] sm:min-h-[32px] inline-flex items-center uppercase tracking-wide transition-colors px-2 py-1 rounded-xs text-white/95 hover:text-[#DED1BE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900]"
          >
            E-OFFICE
          </Link>

          <span className="hidden sm:inline-block h-3 w-px bg-white/35" aria-hidden="true" />

          <button
            type="button"
            onClick={() =>
              setOpenDrawer(openDrawer === 'PERSONA' ? 'NONE' : 'PERSONA')
            }
            aria-expanded={openDrawer === 'PERSONA'}
            aria-controls="persona-switcher-panel"
            className={`min-h-[36px] sm:min-h-[32px] inline-flex items-center gap-1.5 uppercase tracking-wide font-semibold transition-colors cursor-pointer px-2 py-1 rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900] ${
              openDrawer === 'PERSONA'
                ? 'text-[#FCB900]'
                : 'text-white hover:text-[#FCB900]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#00BCFF] hidden sm:inline" />
            <span className="truncate max-w-[205px] sm:max-w-none">
              {currentPersona.fullName}
              {currentPersona.studentId !== '-'
                ? ` (${currentPersona.studentId})`
                : ''}
            </span>
            <ChevronDown className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>

      {/* KHAY 1: TÌM KIẾM THÔNG MINH TOÀN CỔNG */}
      {openDrawer === 'SEARCH' && (
        <div
          id="global-search-drawer"
          role="region"
          aria-label="Tìm kiếm toàn cổng thông tin HSV EIU"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpenDrawer('NONE');
          }}
          className="bg-[#02294E] border-t border-white/15 shadow-2xl"
        >
          <div className={`${containerClass} mx-auto px-4 sm:px-6 py-5 space-y-4`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#00BCFF] font-eiu-display">
                Tìm kiếm
              </span>
              <button
                type="button"
                onClick={() => setOpenDrawer('NONE')}
                aria-label="Đóng khung tìm kiếm"
                className="min-h-11 min-w-11 inline-flex items-center justify-center text-white/80 hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900]"
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
                name="globalSearch"
                type="text"
                autoFocus
                maxLength={120}
                autoComplete="off"
                spellCheck={false}
                value={globalQuery}
                onChange={(e) => setGlobalQuery(e.target.value)}
                placeholder="Tìm kiếm trên cổng thông tin..."
                className="flex-1 min-h-[44px] sm:min-h-10 px-3.5 bg-white text-slate-900 text-base sm:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00BCFF]"
              />
              <button
                type="submit"
                className="min-h-[44px] sm:min-h-10 px-6 bg-[#A68556] hover:bg-[#8e7046] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900]"
              >
                Tìm kiếm
              </button>
            </form>

            {quickResults ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs">
                <div className="bg-[#133F68] border border-white/10 p-3.5 space-y-2">
                  <div className="font-bold uppercase tracking-wider text-[#FCB900] text-[11px]">
                    Giấy chứng nhận và Văn bản ({quickResults.certs.length + quickResults.docs.length})
                  </div>
                  {quickResults.certs.length === 0 && quickResults.docs.length === 0 ? (
                    <p className="text-white/70">Không khớp hồ sơ GCN hoặc Quyết định.</p>
                  ) : (
                    <ul className="space-y-2">
                      {quickResults.certs.map((c) => (
                        <li key={c.id}>
                          <Link
                            href={`/tra-cuu-gcn?q=${encodeURIComponent(c.studentId)}`}
                            onClick={() => setOpenDrawer('NONE')}
                            className="block py-0.5 hover:text-[#FCB900] focus-visible:outline-none focus-visible:text-[#FCB900]"
                          >
                            <span className="font-eiu-serif text-[#00BCFF]">{c.studentId}</span> —{' '}
                            <strong>{c.fullName}</strong> ({c.decisionNumber})
                          </Link>
                        </li>
                      ))}
                      {quickResults.docs.map((d) => (
                        <li key={d.id}>
                          <Link
                            href={`/van-ban?doc=${encodeURIComponent(d.documentNumber)}`}
                            onClick={() => setOpenDrawer('NONE')}
                            className="block py-0.5 hover:text-[#FCB900] line-clamp-1 focus-visible:outline-none focus-visible:text-[#FCB900]"
                          >
                            <span className="font-eiu-serif text-[#DED1BE]">{d.documentNumber}</span>:{' '}
                            {d.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-[#133F68] border border-white/10 p-3.5 space-y-2">
                  <div className="font-bold uppercase tracking-wider text-[#FCB900] text-[11px]">
                    25 Chi hội và 30 CLB ({quickResults.units.length})
                  </div>
                  {quickResults.units.length === 0 ? (
                    <p className="text-white/70">Không khớp mã Chi hội hoặc tên CLB.</p>
                  ) : (
                    <ul className="space-y-2">
                      {quickResults.units.map((u) => (
                        <li key={u.code}>
                          <Link
                            href={u.href}
                            onClick={() => setOpenDrawer('NONE')}
                            className="block py-0.5 hover:text-[#FCB900] focus-visible:outline-none focus-visible:text-[#FCB900]"
                          >
                            <strong className="text-white">{u.name}</strong>
                            <span className="block text-[11px] text-[#DED1BE]">{u.sub}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-[#133F68] border border-white/10 p-3.5 space-y-2">
                  <div className="font-bold uppercase tracking-wider text-[#FCB900] text-[11px]">
                    Tin tức và Sự kiện ({quickResults.posts.length + quickResults.events.length})
                  </div>
                  {quickResults.posts.length === 0 && quickResults.events.length === 0 ? (
                    <p className="text-white/70">Không khớp bài viết hoặc sự kiện.</p>
                  ) : (
                    <ul className="space-y-2">
                      {quickResults.posts.map((p) => (
                        <li key={p.id}>
                          <Link
                            href={`/tin-tuc/${p.slug}`}
                            onClick={() => setOpenDrawer('NONE')}
                            className="block py-0.5 hover:text-[#FCB900] line-clamp-1 focus-visible:outline-none focus-visible:text-[#FCB900]"
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
                            className="block py-0.5 hover:text-[#FCB900] line-clamp-1 focus-visible:outline-none focus-visible:text-[#FCB900]"
                          >
                            [Sự kiện] {ev.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* KHAY 2: CHUYỂN ĐỔI TÀI KHOẢN VÀ VAI TRÒ CÔNG TÁC */}
      {openDrawer === 'PERSONA' && (
        <div
          id="persona-switcher-panel"
          role="region"
          aria-label="Tài khoản và vai trò công tác"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpenDrawer('NONE');
          }}
          className="bg-[#02294E] border-t border-white/15 shadow-2xl"
        >
          <div className={`${containerClass} mx-auto px-4 sm:px-6 py-4 space-y-3`}>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FCB900] font-eiu-display">
                <ShieldCheck className="w-4 h-4 text-[#00BCFF]" />
                <span>Tài khoản và Vai trò công tác</span>
              </span>
              <button
                type="button"
                onClick={() => setOpenDrawer('NONE')}
                aria-label="Đóng khay chuyển vai trò"
                className="min-h-11 min-w-11 inline-flex items-center justify-center text-white/80 hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900]"
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
                  Tài khoản:
                </label>
                <div className="relative">
                  <select
                    id="select-demo-persona"
                    name="demoPersona"
                    value={currentPersona.id}
                    onChange={(e) => setPersonaById(e.target.value)}
                    className="w-full min-h-11 sm:min-h-9 bg-white text-slate-900 pl-3 pr-8 py-0 text-base sm:text-xs font-medium appearance-none leading-normal cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BCFF]"
                  >
                    {allPersonas.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.studentId}) —{' '}
                        {p.bchRole !== 'Không' ? p.bchRole : p.internalDeptRole}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="w-3.5 h-3.5 text-[#133F68] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="select-active-position"
                  className="block text-xs text-[#DED1BE] mb-1 font-sans"
                >
                  Vai trò công tác:
                </label>
                <div className="relative">
                  <select
                    id="select-active-position"
                    name="activePosition"
                    value={activePosition.id}
                    onChange={(e) => setActivePositionById(e.target.value)}
                    className="w-full min-h-11 sm:min-h-9 bg-white text-slate-900 pl-3 pr-8 py-0 text-base sm:text-xs font-semibold appearance-none leading-normal cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BCFF]"
                  >
                    {currentPersona.positions.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        [Cấp {pos.roleLevel}/6] {pos.positionTitle} — {pos.unitName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="w-3.5 h-3.5 text-[#133F68] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
