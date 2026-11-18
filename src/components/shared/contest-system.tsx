'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRole } from '@/context/role-context';
import { OnlineContestItem } from '@/types';
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  ListChecks,
  Play,
  QrCode,
  RotateCcw,
  ShieldCheck,
  Timer,
  X,
} from 'lucide-react';

export interface ContestAttemptRecord {
  contestId: string;
  attemptsUsed: number;
  bestScore: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  answers: Record<string, number>;
  completedAt: string;
}

const STORAGE_KEY = 'hsv_eiu_contest_attempts_v1';

export function useContestAttempts() {
  const [attempts, setAttempts] = useState<
    Record<string, ContestAttemptRecord>
  >({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          setAttempts(parsed);
        }
      }
    } catch {
      // Ignore storage read errors cleanly
    }
  }, []);

  const saveAttempt = useCallback((record: ContestAttemptRecord) => {
    setAttempts((prev) => {
      const existing = prev[record.contestId];
      const merged: ContestAttemptRecord = existing
        ? {
            ...record,
            attemptsUsed: existing.attemptsUsed + 1,
            bestScore: Math.max(existing.bestScore, record.bestScore),
            passed: existing.passed || record.passed,
          }
        : record;
      const next = { ...prev, [record.contestId]: merged };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage write errors cleanly
      }
      return next;
    });
  }, []);

  return { attempts, saveAttempt };
}

export function formatContestTimeRange(
  startIso?: string | null,
  endIso?: string | null
): string {
  if (!startIso || !endIso) return 'Thời gian đang cập nhật';
  const s = new Date(startIso);
  const e = new Date(endIso);
  if (isNaN(s.getTime()) || isNaN(e.getTime()))
    return 'Thời gian đang cập nhật';
  const pad = (n: number) => String(n).padStart(2, '0');
  const startStr = `${pad(s.getDate())}/${pad(s.getMonth() + 1)}`;
  const endStr = `${pad(e.getDate())}/${pad(e.getMonth() + 1)}/${e.getFullYear()}`;
  const endTimeStr = `${pad(e.getHours())}:${pad(e.getMinutes())}`;
  return `${startStr} – ${endStr} (đến ${endTimeStr})`;
}

export interface ContestCardMeta {
  deadline: string;
  label: string;
  rawTag: OnlineContestItem['statusTag'];
  bgClass: string;
  isOpen: boolean;
  ctaText: string;
}

export function getContestCardMeta(c: OnlineContestItem): ContestCardMeta {
  const e = c.endTime ? new Date(c.endTime) : new Date();
  const s = c.startTime ? new Date(c.startTime) : new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const endDateFormatted = !isNaN(e.getTime())
    ? `${pad(e.getHours())}:${pad(e.getMinutes())} ${pad(e.getDate())}/${pad(
        e.getMonth() + 1
      )}/${e.getFullYear()}`
    : 'Đang cập nhật';
  const startDateFormatted = !isNaN(s.getTime())
    ? `${pad(s.getDate())}/${pad(s.getMonth() + 1)}/${s.getFullYear()}`
    : 'Đang cập nhật';

  switch (c.statusTag) {
    case 'Chưa mở đăng ký':
      return {
        deadline: `Mở thi: ${startDateFormatted}`,
        label: 'Chưa mở thi',
        rawTag: c.statusTag,
        bgClass: 'bg-slate-600 text-white',
        isOpen: false,
        ctaText: 'CHƯA MỞ THI',
      };
    case 'Đang mở đăng ký':
      return {
        deadline: endDateFormatted,
        label: 'Đang mở thi',
        rawTag: c.statusTag,
        bgClass: 'bg-[#51803A] text-white',
        isOpen: true,
        ctaText: 'THAM GIA THI NGAY',
      };
    case 'Còn 5 ngày':
      return {
        deadline: endDateFormatted,
        label: 'Còn 5 ngày',
        rawTag: c.statusTag,
        bgClass: 'bg-[#FCB900] text-[#02294E]',
        isOpen: true,
        ctaText: 'THAM GIA THI NGAY',
      };
    case 'Còn 2 ngày':
      return {
        deadline: endDateFormatted,
        label: 'Còn 2 ngày',
        rawTag: c.statusTag,
        bgClass: 'bg-[#C10230] text-white',
        isOpen: true,
        ctaText: 'THAM GIA THI NGAY',
      };
    case 'Đã đóng đăng ký':
      return {
        deadline: endDateFormatted,
        label: 'Đã đóng bài thi',
        rawTag: c.statusTag,
        bgClass: 'bg-[#EEB31D] text-[#02294E]',
        isOpen: false,
        ctaText: 'ĐÃ ĐÓNG BÀI THI',
      };
    case 'Đang diễn ra':
      return {
        deadline: endDateFormatted,
        label: 'Đang diễn ra',
        rawTag: c.statusTag,
        bgClass: 'bg-[#0054A6] text-white',
        isOpen: true,
        ctaText: 'THAM GIA THI NGAY',
      };
    case 'Đã kết thúc':
    default:
      return {
        deadline: `Hoàn tất: ${
          !isNaN(e.getTime())
            ? `${pad(e.getDate())}/${pad(e.getMonth() + 1)}/${e.getFullYear()}`
            : 'Đang cập nhật'
        }`,
        label: 'Đã kết thúc',
        rawTag: c.statusTag,
        bgClass: 'bg-slate-700 text-slate-100',
        isOpen: false,
        ctaText: 'NHẬN GCN',
      };
  }
}

export function ContestCard({
  contest,
  attempt,
  onOpenModal,
}: {
  contest: OnlineContestItem;
  attempt?: ContestAttemptRecord;
  onOpenModal: (c: OnlineContestItem) => void;
}) {
  const meta = getContestCardMeta(contest);
  const maxParticipants = Number(contest.maxParticipants) || 1;
  const participantsCount =
    Number(contest.participantsCount) + (attempt ? 1 : 0);
  const fillPct = Math.min(
    100,
    Math.max(0, Math.round((participantsCount / maxParticipants) * 100))
  );

  return (
    <article className="bg-white border border-slate-200/90 hover:border-[#133F68] hover:-translate-y-1 hover:shadow-md transition-all duration-300 ease-out flex flex-col justify-between group motion-reduce:hover:translate-y-0">
      {/* Header Thẻ Cuộc thi: Chiều cao h-36 đồng bộ /su-kien, tag thu nhỏ 75%, toàn vùng bấm được */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpenModal(contest)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenModal(contest);
          }
        }}
        aria-label={`Mở thông tin và phòng thi cuộc thi: ${contest.title}`}
        className="h-36 bg-[#02294E] eiu-arch-pattern text-white p-5 flex flex-col justify-between relative overflow-hidden cursor-pointer select-none transition-all duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900] focus-visible:ring-inset"
      >
        <div className="flex items-start justify-between gap-2 relative z-10 w-full pointer-events-none">
          {/* Tag trạng thái bên trái (07 Tag chuẩn, thu nhỏ 75%) */}
          <div className="flex flex-col gap-1">
            <span
              className={`px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-wider font-eiu-display shrink-0 shadow-2xs ${meta.bgClass}`}
            >
              {meta.label}
            </span>
          </div>

          {/* Cột 3 box bên phải (thu nhỏ 75%) */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="font-eiu-serif text-[9px] font-bold px-2 py-0.5 bg-white text-[#133F68] text-right shadow-2xs">
              Tiêu chuẩn: {contest.sv5tCriterion}
            </span>
            <span className="font-eiu-serif text-[9px] font-bold px-2 py-0.5 bg-[#FCB900] text-[#02294E] text-right shadow-2xs">
              {contest.baseVolunteerDays > 0
                ? `+${Number(contest.baseVolunteerDays).toFixed(1)} Ngày TN`
                : `${contest.questionCount} Câu • ${contest.durationMinutes} Phút`}
            </span>
            {contest.hasTrainingPoints && (
              <span className="font-eiu-serif text-[9px] font-bold px-2 py-0.5 bg-[#EAE3D2] text-[#133F68] text-right shadow-2xs">
                +{contest.trainingPoints ?? 1} ĐRL
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Thân thẻ: Tiêu đề, Quy cách thi, Thời gian font sans-serif đồng nhất & Thanh tiến độ */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          <h3 className="text-[15.5px] font-bold text-[#133F68] leading-snug line-clamp-2 break-words font-eiu-display min-h-[42px]">
            <button
              type="button"
              onClick={() => onOpenModal(contest)}
              className="text-left font-bold text-[#133F68] hover:text-[#C10230] transition-colors cursor-pointer w-full leading-snug line-clamp-2 break-words font-eiu-display focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0054A6] rounded-xs"
            >
              {contest.title}
            </button>
          </h3>

          <p className="text-xs text-slate-600 flex items-center gap-1.5 min-w-0 font-sans font-normal">
            <ListChecks className="w-3.5 h-3.5 text-[#8E6D3E] shrink-0" />
            <span className="line-clamp-1 truncate">
              {contest.questionCount} câu hỏi • {contest.durationMinutes} phút •
              Đạt ≥ {contest.passScore}%
            </span>
          </p>

          <p className="text-xs text-slate-600 flex items-center gap-1.5 min-w-0 font-sans font-normal">
            <Clock className="w-3.5 h-3.5 text-[#8E6D3E] shrink-0" />
            <span className="line-clamp-1 truncate">
              {formatContestTimeRange(contest.startTime, contest.endTime)}
            </span>
          </p>

          {/* Cây số lượng dự thi & Hạn dự thi */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] text-slate-600 font-sans tabular-nums">
              <span>
                Đã dự thi: {participantsCount}/{maxParticipants}
              </span>
              <span>{fillPct}%</span>
            </div>
            <div className="h-1.5 bg-slate-200 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ease-out ${
                  fillPct >= 100
                    ? 'bg-[#51803A]'
                    : fillPct >= 85
                    ? 'bg-[#EEB31D]'
                    : 'bg-[#0054A6]'
                }`}
                style={{ width: `${fillPct}%` }}
              />
            </div>
            <div className="flex justify-end pt-0.5">
              <span className="text-[11px] text-slate-500 font-sans font-normal">
                Hạn dự thi: {meta.deadline}
              </span>
            </div>
          </div>
        </div>

        {/* Chân thẻ: CTA đồng bộ trạng thái */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => onOpenModal(contest)}
            className={`inline-flex items-center gap-1 font-bold uppercase font-eiu-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0054A6] rounded-xs group/link min-h-[36px] cursor-pointer ${
              attempt?.passed
                ? 'text-[#51803A]'
                : meta.isOpen
                ? 'text-[#0054A6] hover:text-[#C10230]'
                : meta.label === 'Đã kết thúc'
                ? 'text-[#133F68] hover:text-[#C10230]'
                : 'text-slate-600 hover:text-[#133F68]'
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover/link:translate-x-0.5 motion-reduce:transition-none" />
            <span>
              {attempt?.passed
                ? `✓ ĐÃ ĐẠT (${attempt.bestScore}%)`
                : attempt
                ? `LÀM LẠI (${attempt.bestScore}%)`
                : meta.isOpen
                ? 'THAM GIA THI NGAY'
                : meta.label === 'Đã kết thúc'
                ? 'NHẬN GCN'
                : meta.ctaText}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

type ModalStep = 'intro' | 'exam' | 'result';

export function ContestExamModal({
  contest,
  attempt,
  onClose,
  onSaveAttempt,
}: {
  contest: OnlineContestItem | null;
  attempt?: ContestAttemptRecord;
  onClose: () => void;
  onSaveAttempt: (record: ContestAttemptRecord) => void;
}) {
  const { currentPersona } = useRole();

  const [step, setStep] = useState<ModalStep>('intro');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [latestResult, setLatestResult] =
    useState<ContestAttemptRecord | null>(null);

  // Reset modal step whenever contest changes
  useEffect(() => {
    if (!contest) return;
    if (attempt && !getContestCardMeta(contest).isOpen) {
      setLatestResult(attempt);
      setAnswers(attempt.answers);
      setStep('result');
    } else {
      setStep('intro');
      setAnswers({});
      setLatestResult(attempt || null);
      setSecondsLeft(contest.durationMinutes * 60);
    }
  }, [contest, attempt]);

  const handleSubmitExam = useCallback(() => {
    if (!contest) return;
    const totalQuestions = contest.questions.length || 1;
    const correctCount = contest.questions.reduce(
      (acc, q) => acc + (answers[q.id] === q.correctIndex ? 1 : 0),
      0
    );
    const scorePct = Math.round((correctCount / totalQuestions) * 100);
    const passed = scorePct >= contest.passScore;

    const record: ContestAttemptRecord = {
      contestId: contest.id,
      attemptsUsed: 1,
      bestScore: scorePct,
      correctCount,
      totalQuestions,
      passed,
      answers,
      completedAt: new Date().toISOString(),
    };
    setLatestResult(record);
    onSaveAttempt(record);
    setStep('result');
  }, [contest, answers, onSaveAttempt]);

  // Countdown Timer during active exam step
  useEffect(() => {
    if (!contest || step !== 'exam') return;
    if (secondsLeft <= 0) {
      handleSubmitExam();
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [contest, step, secondsLeft, handleSubmitExam]);

  // Keyboard ESC handler + lock body scroll
  useEffect(() => {
    if (!contest) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [contest, onClose]);

  if (!contest) return null;

  const meta = getContestCardMeta(contest);
  const attemptsUsed = attempt?.attemptsUsed ?? 0;
  const canRetake =
    meta.isOpen && attemptsUsed < contest.maxAttempts;

  const startExam = () => {
    setAnswers({});
    setSecondsLeft(contest.durationMinutes * 60);
    setStep('exam');
  };

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');
  const answeredCount = Object.keys(answers).length;
  const totalQ = contest.questions.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-contest-title"
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white border-2 border-[#133F68] w-full max-w-2xl my-auto shadow-2xl relative overflow-hidden">
        {/* Header Modal */}
        <div className="bg-[#133F68] text-white px-5 sm:px-6 py-4 flex items-center justify-between gap-3 border-b-3 border-[#A68556]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 bg-[#FCB900] rounded-full inline-block" />
            <span className="text-xs font-bold uppercase tracking-wider font-eiu-display">
              {step === 'exam'
                ? 'Phòng Thi Trực Tuyến — Đang Tính Giờ'
                : step === 'result'
                ? 'Kết Quả Bài Thi & Đồng Bộ SV5T'
                : meta.isOpen
                ? 'Thông Tin & Thể Lệ Cuộc Thi'
                : meta.label === 'Đã kết thúc'
                ? 'Kết Quả Cuộc Thi & Nhận E-Certificate'
                : 'Thông Tin Chi Tiết Cuộc Thi'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ cuộc thi"
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sticky Countdown Bar khi đang thi */}
        {step === 'exam' && (
          <div className="bg-[#02294E] text-white px-5 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-white/15 text-xs">
            <div className="flex items-center gap-2">
              <Timer
                className={`w-4 h-4 ${
                  secondsLeft <= 60 ? 'text-[#FCB900]' : 'text-[#00BCFF]'
                }`}
              />
              <span className="font-sans text-[#DED1BE]">Thời gian còn lại:</span>
              <span
                className={`font-eiu-serif text-base font-bold tabular-nums ${
                  secondsLeft <= 60 ? 'text-[#FCB900]' : 'text-white'
                }`}
              >
                {mins}:{secs}
              </span>
            </div>
            <div className="font-sans text-[#DED1BE] tabular-nums">
              Đã hoàn thành:{' '}
              <strong className="text-white">
                {answeredCount}/{totalQ}
              </strong>{' '}
              câu
            </div>
          </div>
        )}

        {/* Nội dung Modal */}
        <div className="p-5 sm:p-6 space-y-5 text-xs max-h-[calc(90vh-140px)] overflow-y-auto">
          {/* Header thông tin cuộc thi */}
          <div className="space-y-2 pb-3.5 border-b border-slate-200">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider font-eiu-display ${meta.bgClass}`}
              >
                {meta.label}
              </span>
              <span className="px-2.5 py-0.5 bg-[#FCB900] text-[#02294E] text-[10.5px] font-bold uppercase font-eiu-display">
                SV5T: {contest.sv5tCriterion}
              </span>
              {contest.hasTrainingPoints && (
                <span className="px-2.5 py-0.5 bg-[#EAE3D2] text-[#133F68] text-[10.5px] font-bold font-eiu-serif">
                  +{contest.trainingPoints ?? 1} Điểm rèn luyện
                </span>
              )}
              {contest.baseVolunteerDays > 0 && (
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 text-[10.5px] font-bold font-eiu-serif">
                  +{contest.baseVolunteerDays.toFixed(1)} Ngày tình nguyện
                </span>
              )}
            </div>

            <h3
              id="modal-contest-title"
              className="text-base sm:text-lg font-bold text-[#133F68] leading-snug font-eiu-display"
            >
              {contest.title}
            </h3>

            {step === 'intro' && (
              <p className="text-slate-600 leading-relaxed font-sans">
                {contest.description}
              </p>
            )}
          </div>

          {/* STEP 1: INTRO / THỂ LỆ / NHẬN GCN */}
          {step === 'intro' && (
            <div className="space-y-4">
              {/* Bảng thông số cuộc thi */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#F8FAFC] border border-slate-200 p-3">
                  <div className="text-[11px] text-slate-500 font-sans">
                    Số lượng câu hỏi
                  </div>
                  <div className="text-sm font-bold text-[#133F68] font-eiu-serif mt-0.5 tabular-nums">
                    {contest.questionCount} câu trắc nghiệm
                  </div>
                </div>
                <div className="bg-[#F8FAFC] border border-slate-200 p-3">
                  <div className="text-[11px] text-slate-500 font-sans">
                    Thời gian làm bài
                  </div>
                  <div className="text-sm font-bold text-[#133F68] font-eiu-serif mt-0.5 tabular-nums">
                    {contest.durationMinutes} phút
                  </div>
                </div>
                <div className="bg-[#F8FAFC] border border-slate-200 p-3">
                  <div className="text-[11px] text-slate-500 font-sans">
                    Ngưỡng đạt chuẩn
                  </div>
                  <div className="text-sm font-bold text-[#51803A] font-eiu-serif mt-0.5 tabular-nums">
                    ≥ {contest.passScore}% câu đúng
                  </div>
                </div>
                <div className="bg-[#F8FAFC] border border-slate-200 p-3">
                  <div className="text-[11px] text-slate-500 font-sans">
                    Số lượt thi tối đa
                  </div>
                  <div className="text-sm font-bold text-[#133F68] font-eiu-serif mt-0.5 tabular-nums">
                    {attemptsUsed} / {contest.maxAttempts} lượt
                  </div>
                </div>
              </div>

              {/* Thông tin thí sinh SSO EIU */}
              <div className="bg-[#F0F6FC] border border-[#0054A6]/25 p-4 space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#0054A6] font-eiu-display flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Định danh Thí sinh SSO (@eiu.edu.vn)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-800 font-sans pt-1">
                  <div>
                    Họ và tên:{' '}
                    <strong className="text-[#133F68]">
                      {currentPersona.fullName}
                    </strong>
                  </div>
                  <div>
                    MSSV:{' '}
                    <strong className="font-eiu-serif text-[#133F68]">
                      {currentPersona.studentId}
                    </strong>
                  </div>
                  <div className="sm:col-span-2">
                    Email xác thực:{' '}
                    <strong className="text-[#0054A6]">
                      {currentPersona.email}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Nếu đã có lịch sử thi */}
              {attempt && (
                <div
                  className={`p-3.5 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    attempt.passed
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-[#FFF9F0] border-amber-300 text-slate-900'
                  }`}
                >
                  <div>
                    <div className="font-bold font-eiu-display uppercase">
                      {attempt.passed
                        ? `✓ Đã đạt chuẩn (${attempt.bestScore}%)`
                        : `Lần thi gần nhất: ${attempt.bestScore}% (chưa đạt ${contest.passScore}%)`}
                    </div>
                    <p className="text-[11px] mt-0.5 font-sans">
                      {attempt.passed
                        ? 'Kết quả đã được đồng bộ vào Sổ tay Kỹ thuật số Sinh viên 5 Tốt.'
                        : 'Bạn vẫn có thể thi lại để cải thiện điểm số nếu còn lượt.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLatestResult(attempt);
                      setAnswers(attempt.answers);
                      setStep('result');
                    }}
                    className="px-3.5 py-2 bg-white border border-slate-300 hover:border-[#133F68] text-[#133F68] font-bold uppercase font-eiu-display shrink-0 cursor-pointer"
                  >
                    Xem lại bài làm
                  </button>
                </div>
              )}

              {/* Khu vực đã kết thúc: Cấp GCN */}
              {meta.label === 'Đã kết thúc' && (
                <div className="bg-slate-50 border border-slate-200 p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#133F68] font-eiu-display uppercase">
                      Quyết định Công nhận & E-Certificate
                    </span>
                    {contest.decisionNumber && (
                      <span className="px-2 py-0.5 bg-[#133F68] text-white font-eiu-serif font-bold text-[11px]">
                        Số {contest.decisionNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 font-sans leading-relaxed">
                    Cuộc thi đã kết thúc và hoàn tất tổng hợp danh sách theo MSSV
                    tăng dần (QĐ 28/QĐ-HSV). Sinh viên đạt chuẩn có thể tra cứu
                    và tải Giấy chứng nhận điện tử kèm mã QR xác thực.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Link
                      href={`/tra-cuu-gcn${
                        contest.decisionNumber
                          ? `?q=${encodeURIComponent(contest.decisionNumber)}`
                          : ''
                      }`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#133F68] hover:bg-[#0054A6] text-white font-bold uppercase tracking-wider font-eiu-display"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Tra cứu & Nhận GCN Điện tử</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Nút hành động chính */}
              <div className="pt-2 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold uppercase font-eiu-display cursor-pointer"
                >
                  Đóng
                </button>
                {meta.isOpen && canRetake && (
                  <button
                    type="button"
                    onClick={startExam}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0054A6] hover:bg-[#133F68] text-white font-bold uppercase tracking-wider font-eiu-display cursor-pointer transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>
                      {attempt ? 'Thi lại (Cải thiện điểm)' : 'Bắt đầu làm bài thi'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: PHÒNG LÀM BÀI TRẮC NGHIỆM */}
          {step === 'exam' && (
            <div className="space-y-4">
              {contest.questions.map((q, qIdx) => {
                const chosen = answers[q.id];
                return (
                  <div
                    key={q.id}
                    className="bg-white border border-slate-200 p-4 sm:p-5 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <span className="font-eiu-serif font-bold text-[#0054A6]">
                        CÂU {String(qIdx + 1).padStart(2, '0')} • {q.topic}
                      </span>
                      <span className="px-2 py-0.5 bg-[#EAE3D2] text-[#133F68] font-bold font-eiu-display">
                        SV5T: {q.sv5tTarget}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#133F68] leading-snug font-sans">
                      {q.question}
                    </h4>

                    <div className="space-y-2 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isPicked = chosen === optIdx;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() =>
                              setAnswers((prev) => ({
                                ...prev,
                                [q.id]: optIdx,
                              }))
                            }
                            className={`w-full text-left p-3 border transition-colors flex items-start gap-2.5 cursor-pointer font-sans ${
                              isPicked
                                ? 'border-2 border-[#0054A6] bg-[#F0F6FC] text-[#133F68] font-semibold'
                                : 'border-slate-200 hover:border-[#0054A6] bg-[#F8FAFC] text-slate-800'
                            }`}
                          >
                            <span className="font-eiu-serif font-bold shrink-0">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setStep('intro')}
                  className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold uppercase font-eiu-display cursor-pointer"
                >
                  Quay lại thể lệ
                </button>
                <button
                  type="button"
                  disabled={answeredCount < totalQ}
                  onClick={handleSubmitExam}
                  className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider font-eiu-display transition-colors ${
                    answeredCount < totalQ
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-[#C10230] hover:bg-[#a30228] text-white cursor-pointer'
                  }`}
                >
                  Nộp bài và Chấm điểm ({answeredCount}/{totalQ})
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: KẾT QUẢ & ĐÁP ÁN GIẢI THÍCH */}
          {step === 'result' && latestResult && (
            <div className="space-y-4">
              <div
                className={`p-4 sm:p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  latestResult.passed
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-[#FFF9F0] border-amber-300 text-slate-900'
                }`}
              >
                <div className="space-y-1">
                  <div className="text-sm font-bold uppercase font-eiu-display flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      Kết quả: {latestResult.correctCount} /{' '}
                      {latestResult.totalQuestions} câu ({latestResult.bestScore}
                      %)
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed font-sans">
                    {latestResult.passed
                      ? `✓ Chúc mừng ${currentPersona.fullName}! Kết quả đạt chuẩn (≥ ${contest.passScore}%) đã tự động đồng bộ vào tiêu chuẩn "${contest.sv5tCriterion}" trong Sổ tay SV5T${
                          contest.hasTrainingPoints
                            ? ` và ghi nhận +${contest.trainingPoints ?? 1} ĐRL`
                            : ''
                        }.`
                      : `Bạn cần đạt tối thiểu ${contest.passScore}% để được công nhận hoàn thành cuộc thi. Hãy xem giải thích chi tiết bên dưới.`}
                  </p>
                </div>

                {canRetake && (
                  <button
                    type="button"
                    onClick={startExam}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#133F68] hover:bg-[#0054A6] text-white text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer font-eiu-display"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Làm lại bài thi</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {contest.questions.map((q, qIdx) => {
                  const chosen = latestResult.answers[q.id];
                  return (
                    <div
                      key={q.id}
                      className="bg-white border border-slate-200 p-4 space-y-2.5"
                    >
                      <div className="font-eiu-serif text-[11px] font-bold text-[#0054A6]">
                        CÂU {String(qIdx + 1).padStart(2, '0')} • {q.topic}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#133F68] font-sans">
                        {q.question}
                      </h4>
                      <div className="space-y-1.5 text-xs font-sans">
                        {q.options.map((opt, optIdx) => {
                          const isPicked = chosen === optIdx;
                          const isRight = q.correctIndex === optIdx;
                          let cls =
                            'border-slate-200 bg-[#F8FAFC] text-slate-700';
                          if (isRight) {
                            cls =
                              'border-2 border-[#51803A] bg-emerald-50 text-emerald-950 font-semibold';
                          } else if (isPicked && !isRight) {
                            cls =
                              'border-2 border-[#C10230] bg-rose-50 text-rose-950';
                          }
                          return (
                            <div
                              key={opt}
                              className={`p-2.5 border flex items-start gap-2 ${cls}`}
                            >
                              <span className="font-eiu-serif font-bold shrink-0">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              <span>{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="p-3 bg-[#F0F6FC] border border-[#0054A6]/25 text-xs text-slate-700 leading-relaxed font-sans">
                        <strong className="text-[#133F68]">
                          Căn cứ & Giải thích:
                        </strong>{' '}
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-200">
                <Link
                  href="/portal?tab=sv5t"
                  className="px-4 py-2.5 bg-[#EAE3D2] hover:bg-[#dfd5be] text-[#133F68] font-bold uppercase font-eiu-display"
                >
                  Xem Sổ tay SV5T
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#133F68] hover:bg-[#0054A6] text-white font-bold uppercase font-eiu-display cursor-pointer"
                >
                  Hoàn tất & Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
