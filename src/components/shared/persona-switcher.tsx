'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/context/role-context';
import { decodeEiuEmail } from '@/data/mock-data';
import {
  ShieldCheck,
  UserCheck,
  Layers,
  LayoutDashboard,
  GraduationCap,
  Globe,
} from 'lucide-react';

const ROLE_LEVEL_BADGES: Record<number, { label: string; color: string }> = {
  1: { label: 'Cấp 1 • Hội viên / Sinh viên', color: 'bg-slate-700 text-slate-100' },
  2: { label: 'Cấp 2 • Cộng tác viên', color: 'bg-sky-800 text-sky-100' },
  3: { label: 'Cấp 3 • Thường trực Chi hội / CLB', color: 'bg-teal-800 text-teal-100' },
  4: { label: 'Cấp 4 • Văn phòng / Ban Chuyên môn', color: 'bg-indigo-700 text-indigo-100' },
  5: { label: 'Cấp 5 • Ban Chấp hành / Ban Kiểm tra', color: 'bg-amber-700 text-amber-100' },
  6: { label: 'Cấp 6 • Thường trực Ban Thư ký', color: 'bg-[#0054A6] text-white' },
};

export function PersonaSwitcherBar() {
  const {
    currentPersona,
    activePosition,
    setPersonaById,
    setActivePositionById,
    allPersonas,
  } = useRole();
  const pathname = usePathname();
  const emailInfo = decodeEiuEmail(currentPersona.email);
  const badgeInfo = ROLE_LEVEL_BADGES[activePosition.roleLevel] || ROLE_LEVEL_BADGES[1];

  return (
    <div className="bg-[#0B2545] text-white border-b border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
        {/* Left: Institutional Identity & Area Switcher */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="inline-flex items-center gap-1.5 font-semibold tracking-wide text-sky-300 uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            HSV EIU Portal • Khóa II (2026–2028)
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <div className="inline-flex items-center rounded-md bg-slate-900/90 p-0.5 border border-slate-700/80">
            <Link
              href="/"
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                !pathname.startsWith('/portal') && !pathname.startsWith('/workspace')
                  ? 'bg-[#0054A6] text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3" />
              (public) Cổng thông tin
            </Link>
            <Link
              href="/portal"
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                pathname.startsWith('/portal')
                  ? 'bg-[#0054A6] text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3 h-3" />
              (student-portal) Sổ tay SV
            </Link>
            <Link
              href="/workspace"
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                pathname.startsWith('/workspace')
                  ? 'bg-[#0054A6] text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3 h-3" />
              (workspace) E-Office
            </Link>
          </div>
        </div>

        {/* Right: Demo Persona & Multi-Role Context Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-700 rounded-md px-2 py-1">
            <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-400 hidden sm:inline">Đóng vai:</span>
            <select
              aria-label="Chọn nhân sự giả lập"
              value={currentPersona.id}
              onChange={(e) => setPersonaById(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer max-w-[210px] sm:max-w-[250px] truncate"
            >
              {allPersonas.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.fullName} ({p.bchRole !== 'Không' ? p.bchRole : p.grassrootsRole})
                </option>
              ))}
            </select>
          </div>

          {/* Multi-role Context Switcher */}
          {currentPersona.positions.length > 1 && (
            <div className="flex items-center gap-1.5 bg-sky-950/80 border border-sky-700/70 rounded-md px-2 py-1">
              <Layers className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="text-sky-300 hidden xl:inline">Kiêm nhiệm:</span>
              <select
                aria-label="Chuyển ngữ cảnh kiêm nhiệm"
                value={activePosition.id}
                onChange={(e) => setActivePositionById(e.target.value)}
                className="bg-transparent text-sky-100 font-medium focus:outline-none cursor-pointer max-w-[220px] truncate"
              >
                {currentPersona.positions.map((pos) => (
                  <option key={pos.id} value={pos.id} className="bg-slate-900 text-white">
                    [{pos.unitCode}] {pos.positionTitle}
                  </option>
                ))}
              </select>
            </div>
          )}

          <span
            className={`px-2 py-1 rounded text-[11px] font-medium border border-white/15 ${badgeInfo.color}`}
            title={`Tự động nhận diện từ ${currentPersona.email}: ${emailInfo.facultyName}`}
          >
            {badgeInfo.label}
          </span>
        </div>
      </div>
    </div>
  );
}
