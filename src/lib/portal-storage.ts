import { ISSUED_CERTIFICATES } from '@/data/mock-data';
import {
  EventItem,
  IssuedCertificateRecord,
  OfficeAssetItem,
  PlanSubmissionItem,
  StaffMember,
} from '@/types';

export const ROLE_SESSION_KEY = 'hsv_eiu_role_session_v1';
export const REGISTERED_EVENTS_KEY = 'hsv_eiu_registered_events_v2';
export const LEGACY_REGISTERED_EVENTS_KEY = 'hsv_eiu_registered_events_v1';
export const CONTEST_ATTEMPTS_KEY = 'hsv_eiu_contest_attempts_v2';
export const LEGACY_CONTEST_ATTEMPTS_KEY = 'hsv_eiu_contest_attempts_v1';
export const ISSUED_CERTS_KEY = 'hsv_eiu_issued_certs_v1';
export const WORKSPACE_STATE_KEY = 'hsv_eiu_workspace_state_v1';
export const PORTAL_STATE_KEY = 'hsv_eiu_portal_state_v1';

export const STORAGE_SYNC_EVENT = 'hsv-eiu-storage-sync';

export interface RoleSessionRecord {
  personaId: string;
  positionId: string;
}

export interface QuarterInputStr {
  quarterName: string;
  creditsStr: string;
  gpaStr: string;
}

export interface VoiceTicketRecord {
  id: string;
  recipient: 'BKT' | 'BAN_TGPT';
  category: string;
  isAnonymous: boolean;
  content: string;
  createdAt: string;
  status: string;
}

export interface PortalPersonaState {
  quarters: QuarterInputStr[];
  cumulativeGpaStr: string;
  dossierSubmitted: boolean;
  submittedAt?: string;
  voiceTickets: VoiceTicketRecord[];
}

export interface Sv5tCandidateStored {
  id: string;
  reviewStage: 1 | 2 | 3;
}

export interface WorkspaceStoredState {
  eventOverrides: Record<
    string,
    Pick<
      EventItem,
      'preApprovalStatus' | 'certWorkflowStatus' | 'decisionNumber' | 'slaDaysRemaining'
    >
  >;
  candidateStages: Record<string, 1 | 2 | 3>;
  planStages: Record<string, PlanSubmissionItem['stage']>;
  assetOverrides: Record<
    string,
    Pick<
      OfficeAssetItem,
      'status' | 'availableQty' | 'borrowerUnit' | 'borrowerName' | 'dueDate'
    >
  >;
  nextDecisionSeq: number;
  votesByPersona: Record<string, Record<string, 'APPROVE' | 'REJECT' | 'ABSTAIN'>>;
  auditLogs?: string[];
}

export function emitStorageSync() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(STORAGE_SYNC_EVENT));
}

export function subscribeStorageSync(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener(STORAGE_SYNC_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(STORAGE_SYNC_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

export function readJsonStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJsonStorage<T>(key: string, value: T, notify = true) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    if (notify) {
      emitStorageSync();
    }
  } catch {
    // Bỏ qua lỗi hạn mức bộ nhớ trình duyệt
  }
}

export function getContestDraftKey(personaId: string, contestId: string) {
  return `hsv_eiu_contest_draft_v2_${personaId}_${contestId}`;
}

export function getRegisteredEventsMap(): Record<string, string[]> {
  if (typeof window === 'undefined') return {};
  const map = readJsonStorage<Record<string, string[]>>(REGISTERED_EVENTS_KEY, {});
  if (Object.keys(map).length > 0) return map;

  // Di trú dữ liệu phiên bản cũ sang tài khoản mặc định đầu tiên nếu tồn tại
  const legacy = readJsonStorage<string[]>(LEGACY_REGISTERED_EVENTS_KEY, []);
  if (Array.isArray(legacy) && legacy.length > 0) {
    const migrated = { 'staff-01': legacy };
    writeJsonStorage(REGISTERED_EVENTS_KEY, migrated, false);
    return migrated;
  }
  return {};
}

export function getRegisteredEventIds(personaId: string): string[] {
  const map = getRegisteredEventsMap();
  const list = map[personaId];
  return Array.isArray(list) ? list : [];
}

export function setRegisteredEventIds(personaId: string, eventIds: string[]) {
  const map = getRegisteredEventsMap();
  const next = { ...map, [personaId]: Array.from(new Set(eventIds)) };
  writeJsonStorage(REGISTERED_EVENTS_KEY, next, true);
}

export function getDynamicIssuedCerts(): IssuedCertificateRecord[] {
  const list = readJsonStorage<IssuedCertificateRecord[]>(ISSUED_CERTS_KEY, []);
  return Array.isArray(list) ? list : [];
}

export function appendDynamicIssuedCerts(newCerts: IssuedCertificateRecord[]) {
  if (newCerts.length === 0) return;
  const existing = getDynamicIssuedCerts();
  const seen = new Set(existing.map((c) => c.certCode));
  const merged = [...existing];
  for (const cert of newCerts) {
    if (!seen.has(cert.certCode)) {
      seen.add(cert.certCode);
      merged.push(cert);
    }
  }
  writeJsonStorage(ISSUED_CERTS_KEY, merged, true);
}

export function getAllCertificates(): IssuedCertificateRecord[] {
  const dynamicCerts = getDynamicIssuedCerts();
  if (dynamicCerts.length === 0) return ISSUED_CERTIFICATES;
  const seen = new Set(ISSUED_CERTIFICATES.map((c) => c.certCode));
  const extra = dynamicCerts.filter((c) => !seen.has(c.certCode));
  return [...extra, ...ISSUED_CERTIFICATES];
}

export function getDefaultPortalPersonaState(
  persona: StaffMember
): PortalPersonaState {
  // Khởi tạo giá trị học tập đa dạng theo từng tài khoản mẫu để kiểm thử thực tế
  const presets: Record<
    string,
    { q: [string, string][]; cum: string; baseNotes?: string }
  > = {
    'staff-01': {
      q: [
        ['12', '3.55'],
        ['14', '3.42'],
        ['12', '3.60'],
        ['0', '0'],
      ],
      cum: '3.48',
    },
    'student-demo': {
      q: [
        ['12', '3.18'],
        ['12', '2.96'],
        ['12', '3.15'],
        ['0', '0'],
      ],
      cum: '3.08',
    },
    'staff-02': {
      q: [
        ['12', '3.40'],
        ['14', '3.35'],
        ['12', '3.45'],
        ['0', '0'],
      ],
      cum: '3.38',
    },
    'staff-03': {
      q: [
        ['12', '3.32'],
        ['14', '3.28'],
        ['12', '3.38'],
        ['0', '0'],
      ],
      cum: '3.30',
    },
  };

  const preset = presets[persona.id] || {
    q: [
      ['12', '3.25'],
      ['14', '3.10'],
      ['12', '3.22'],
      ['0', '0'],
    ],
    cum: '3.16',
  };

  return {
    quarters: [
      {
        quarterName: 'Học kỳ Thu (Quarter 1)',
        creditsStr: preset.q[0][0],
        gpaStr: preset.q[0][1],
      },
      {
        quarterName: 'Học kỳ Đông (Quarter 2)',
        creditsStr: preset.q[1][0],
        gpaStr: preset.q[1][1],
      },
      {
        quarterName: 'Học kỳ Xuân (Quarter 3)',
        creditsStr: preset.q[2][0],
        gpaStr: preset.q[2][1],
      },
      {
        quarterName: 'Học kỳ Hè (Tùy chọn — nhập 0 nếu không học)',
        creditsStr: preset.q[3][0],
        gpaStr: preset.q[3][1],
      },
    ],
    cumulativeGpaStr: preset.cum,
    dossierSubmitted: false,
    voiceTickets: [],
  };
}

export function getPortalPersonaState(
  persona: StaffMember
): PortalPersonaState {
  const all = readJsonStorage<Record<string, PortalPersonaState>>(
    PORTAL_STATE_KEY,
    {}
  );
  const stored = all[persona.id];
  if (stored && Array.isArray(stored.quarters) && stored.quarters.length === 4) {
    return {
      ...getDefaultPortalPersonaState(persona),
      ...stored,
    };
  }
  return getDefaultPortalPersonaState(persona);
}

export function savePortalPersonaState(
  personaId: string,
  state: PortalPersonaState
) {
  const all = readJsonStorage<Record<string, PortalPersonaState>>(
    PORTAL_STATE_KEY,
    {}
  );
  writeJsonStorage(
    PORTAL_STATE_KEY,
    { ...all, [personaId]: state },
    true
  );
}

export function getWorkspaceStoredState(): WorkspaceStoredState | null {
  return readJsonStorage<WorkspaceStoredState | null>(WORKSPACE_STATE_KEY, null);
}

export function saveWorkspaceStoredState(state: WorkspaceStoredState) {
  writeJsonStorage(WORKSPACE_STATE_KEY, state, true);
}

export function clearWorkspaceStoredState() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(WORKSPACE_STATE_KEY);
    window.localStorage.removeItem(ISSUED_CERTS_KEY);
    emitStorageSync();
  } catch {
    // Bỏ qua lỗi storage
  }
}
