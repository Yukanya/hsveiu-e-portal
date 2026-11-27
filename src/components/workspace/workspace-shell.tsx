'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRole } from '@/context/role-context';
import {
  ChevronDown,
  ExternalLink,
  Home,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const {
    currentPersona,
    activePosition,
    allPersonas,
    setPersonaById,
    setActivePositionById,
  } = useRole();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      {/* Thanh ứng dụng E-Office chuyên biệt — Gọn, không trùng lặp thanh công khai */}
      <header className="sticky top-0 z-40 bg-[#02294E] text-white border-b-2 border-[#A68556] shadow-md">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-2.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Trái: Định danh phần mềm điều hành & liên kết nhanh */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/workspace"
              className="flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900]"
            >
              <Image
                src="/images/eiu-logo-shorten-white.png"
                alt="Trường Đại học Quốc tế Miền Đông (EIU)"
                width={86}
                height={28}
                priority
                className="w-[86px] h-7 object-contain shrink-0"
              />
              <span className="h-6 w-px bg-white/25" aria-hidden="true" />
              <Image
                src="/images/hsv-logo.png"
                alt="Hội Sinh viên EIU"
                width={28}
                height={28}
                priority
                className="h-7 w-7 object-contain shrink-0"
              />
              <div>
                <div className="text-xs sm:text-[13px] font-extrabold tracking-wide text-white font-eiu-display leading-tight">
                  E-OFFICE HỘI SINH VIÊN EIU
                </div>
                <div className="text-[11px] font-eiu-serif text-[#DED1BE] leading-tight">
                  Hệ thống Điều hành Nội bộ Khóa II (2026 – 2028)
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2 lg:hidden">
              <Link
                href="/portal"
                className="min-h-[36px] px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-[11px] font-bold uppercase tracking-wider text-[#00BCFF] font-eiu-display inline-flex items-center gap-1"
              >
                <span>Hồ sơ</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <Link
                href="/"
                className="min-h-[36px] px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-[11px] font-bold uppercase tracking-wider text-white font-eiu-display inline-flex items-center gap-1"
              >
                <Home className="w-3 h-3" />
                <span>Cổng chính</span>
              </Link>
            </div>
          </div>

          {/* Phải: Bộ chuyển Vai trò và Ngữ cảnh Kiêm nhiệm duy nhất trong E-Office + 2 nút liên kết */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 lg:justify-end">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 lg:max-w-[660px]">
              <div className="relative flex items-center">
                <UserCheck
                  className="w-3.5 h-3.5 text-[#00BCFF] absolute left-2.5 pointer-events-none"
                  aria-hidden="true"
                />
                <label htmlFor="workspace-shell-persona" className="sr-only">
                  Chọn tài khoản
                </label>
                <select
                  id="workspace-shell-persona"
                  name="workspacePersona"
                  aria-label="Chọn tài khoản"
                  value={currentPersona.id}
                  onChange={(e) => setPersonaById(e.target.value)}
                  className="w-full h-10 sm:h-9 pl-8 pr-8 py-0 border border-white/25 bg-[#133F68] text-white text-base sm:text-xs font-medium appearance-none leading-normal cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BCFF]"
                >
                  {allPersonas.map((p) => (
                    <option key={p.id} value={p.id} className="bg-white text-slate-900">
                      {p.fullName} ({p.studentId})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="w-3.5 h-3.5 text-white/80 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
              </div>

              <div className="relative flex items-center">
                <ShieldCheck
                  className="w-3.5 h-3.5 text-[#FCB900] absolute left-2.5 pointer-events-none"
                  aria-hidden="true"
                />
                <label htmlFor="workspace-shell-position" className="sr-only">
                  Chọn vai trò công tác
                </label>
                <select
                  id="workspace-shell-position"
                  name="workspacePosition"
                  aria-label="Chọn vai trò công tác"
                  value={activePosition.id}
                  onChange={(e) => setActivePositionById(e.target.value)}
                  className="w-full h-10 sm:h-9 pl-8 pr-8 py-0 border border-[#FCB900]/45 bg-[#133F68] text-[#FCB900] text-base sm:text-xs font-bold appearance-none leading-normal cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900]"
                >
                  {currentPersona.positions.map((pos) => (
                    <option
                      key={pos.id}
                      value={pos.id}
                      className="bg-white text-slate-900"
                    >
                      [Cấp {pos.roleLevel}/6] {pos.positionTitle} — {pos.unitName}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="w-3.5 h-3.5 text-[#FCB900] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2 shrink-0 pl-1 border-l border-white/15">
              <Link
                href="/portal"
                className="h-9 px-3 bg-white/10 hover:bg-white/20 text-[11px] font-bold uppercase tracking-wider text-[#00BCFF] font-eiu-display inline-flex items-center gap-1 whitespace-nowrap"
              >
                <span>Hồ sơ Hội viên</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <Link
                href="/"
                className="h-9 px-3 bg-[#C10230] hover:bg-[#9E0024] text-[11px] font-bold uppercase tracking-wider text-white font-eiu-display inline-flex items-center gap-1 whitespace-nowrap"
              >
                <Home className="w-3 h-3" />
                <span>Về Cổng Công khai</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      {/* Footer nội bộ 1 dòng gọn gàng thay PublicFooter 5 cột bản tin */}
      <footer className="bg-[#133F68] text-[#DED1BE] border-t-2 border-[#A68556] py-3.5">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p className="font-eiu-serif text-center sm:text-left">
            Văn phòng Hội Sinh viên EIU — Phòng 206.B06
          </p>
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase font-eiu-display">
            <Link href="/van-ban" className="hover:text-white underline underline-offset-2">
              Kho Văn bản
            </Link>
            <span aria-hidden="true">•</span>
            <Link href="/tra-cuu-gcn" className="hover:text-white underline underline-offset-2">
              Tra cứu GCN
            </Link>
            <span aria-hidden="true">•</span>
            <Link href="/portal" className="hover:text-[#00BCFF] underline underline-offset-2">
              Hồ sơ Hội viên
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
