import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-2ae6dc9b`;

interface FetchOptions {
  method?: 'GET' | 'POST';
  body?: Record<string, unknown>;
  timeoutMs?: number;
  retries?: number;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * API 통신 유틸리티
 * - 10초 타임아웃
 * - 최대 3회 자동 재시도 (지수 백오프)
 * - 에러 응답 표준화
 * - Supabase 인증 헤더 자동 부착
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    body,
    timeoutMs = 10000,
    retries = 3,
  } = options;

  const url = `${BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${publicAnonKey}`,
    'Content-Type': 'application/json',
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const fetchOptions: RequestInit = {
        method,
        headers,
        signal: controller.signal,
      };

      if (body && method === 'POST') {
        fetchOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data: data as T };
    } catch (error: unknown) {
      const isLastAttempt = attempt === retries;
      const err = error instanceof Error ? error : new Error(String(error));

      // AbortError = 타임아웃
      if (err.name === 'AbortError') {
        console.warn(`[API] 타임아웃 (${timeoutMs}ms) - ${endpoint} (${attempt}/${retries})`);
      } else {
        console.warn(`[API] 요청 실패 - ${endpoint} (${attempt}/${retries}):`, err.message);
      }

      if (isLastAttempt) {
        return {
          success: false,
          error: err.message || '네트워크 오류가 발생했습니다',
        };
      }

      // 지수 백오프: 1초, 2초, 4초...
      const delay = Math.pow(2, attempt - 1) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return { success: false, error: '알 수 없는 오류가 발생했습니다' };
}

/**
 * 결과 제출 API
 */
export async function submitResult(data: {
  gender: string | null;
  total: number;
  categories: Record<string, number>;
  region: string | null;
  ageGroup: string | null;
}) {
  return apiRequest<{
    success: boolean;
    rankings: {
      national: number;
      region: number;
      ageGroup: number;
    };
  }>('/results', {
    method: 'POST',
    body: data as unknown as Record<string, unknown>,
  });
}

/**
 * 통계 조회 API
 */
export async function fetchStats() {
  return apiRequest<{
    total: number;
    real: number;
    mock: number;
  }>('/stats');
}

/**
 * 리더보드 조회 API
 */
export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  gender: 'male' | 'female';
}

export interface LeaderboardResponse {
  all: LeaderboardEntry[];
  male: LeaderboardEntry[];
  female: LeaderboardEntry[];
}

export async function fetchLeaderboard() {
  return apiRequest<LeaderboardResponse>('/leaderboard');
}

/**
 * 목업 데이터 초기화 API
 */
export async function initMockData() {
  return apiRequest<{
    success: boolean;
    count: number;
  }>('/init-mock-data', {
    method: 'POST',
    timeoutMs: 30000, // 목업 데이터 생성은 시간이 더 걸릴 수 있음
  });
}

/**
 * 사용자 행동 로그 로깅 API (Supabase 커스텀 이벤트 로그용)
 */
export async function logUserEvent(eventType: string, metadata?: Record<string, unknown>) {
  return apiRequest<{
    success: boolean;
    id: string;
  }>('/events', {
    method: 'POST',
    body: {
      eventType,
      metadata: metadata || {},
    },
  });
}
