'use client';

import { useEffect, useRef } from 'react';

let activeModalLockCount = 0;
let previousBodyOverflow = '';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) =>
      !el.hasAttribute('disabled') &&
      el.getAttribute('aria-hidden') !== 'true' &&
      (el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0)
  );
}

/**
 * Giữ vòng điều hướng Tab/Shift+Tab bên trong hộp thoại đang mở,
 * khóa cuộn nền an toàn cho nhiều modal lồng nhau, bắt phím Escape
 * và tự động khôi phục focus về nút kích hoạt ban đầu khi đóng.
 */
export function useFocusTrap(
  isOpen: boolean,
  containerRef: React.RefObject<HTMLElement | null>,
  onEscape?: () => void
) {
  const onEscapeRef = useRef(onEscape);
  useEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    if (activeModalLockCount === 0) {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    activeModalLockCount += 1;

    const focusTimer = window.setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;
      if (!container.contains(document.activeElement)) {
        const focusables = getFocusableElements(container);
        if (focusables.length > 0) {
          focusables[0].focus();
        } else {
          container.focus();
        }
      }
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;

      // Chỉ xử lý modal nằm trên cùng nếu có modal lồng nhau
      const openDialogs = document.querySelectorAll(
        '[role="dialog"], [role="alertdialog"]'
      );
      const topDialog = openDialogs[openDialogs.length - 1];
      if (topDialog && topDialog !== container && !topDialog.contains(container)) {
        return;
      }

      if (e.key === 'Escape') {
        if (onEscapeRef.current) {
          e.preventDefault();
          e.stopPropagation();
          onEscapeRef.current();
        }
        return;
      }

      if (e.key !== 'Tab') return;

      const focusables = getFocusableElements(container);
      if (focusables.length === 0) {
        e.preventDefault();
        container.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !container.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !container.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown, true);
      activeModalLockCount = Math.max(0, activeModalLockCount - 1);
      if (activeModalLockCount === 0) {
        document.body.style.overflow = previousBodyOverflow;
      }
      if (previouslyFocused && previouslyFocused.isConnected) {
        window.setTimeout(() => {
          previouslyFocused.focus();
        }, 0);
      }
    };
  }, [isOpen, containerRef]);
}
