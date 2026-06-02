// 누적 참여자 수 시뮬레이션
// 보고서 명세: 베이스 47,000~52,000 사이, 방문당 1~5 증가
const BASE_COUNT = 47200;
const BASE_RANDOM_RANGE = 3000; // 0~3000 랜덤 추가
const STORAGE_KEY = 'quiz-total-participants';

export function getTotalParticipants(): number {
  if (typeof window === 'undefined') return BASE_COUNT;

  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {
    return parseInt(stored, 10);
  } else {
    // 첫 방문 - 베이스값 + 랜덤(0~3000)
    const initial = BASE_COUNT + Math.floor(Math.random() * BASE_RANDOM_RANGE);
    localStorage.setItem(STORAGE_KEY, initial.toString());
    return initial;
  }
}

export function incrementParticipants(): number {
  const current = getTotalParticipants();
  const increment = Math.floor(Math.random() * 5) + 1; // 1-5
  const newTotal = current + increment;
  localStorage.setItem(STORAGE_KEY, newTotal.toString());
  return newTotal;
}

// 시간대별 실시간 접속자 수
// 보고서 명세: 한국 인터넷 트래픽 패턴 반영
export function getCurrentOnlineUsers(): number {
  const hour = new Date().getHours();

  // 20~23시: 200~420명 (최대 피크)
  if (hour >= 20 && hour <= 23) {
    return Math.floor(Math.random() * 221) + 200; // 200-420
  }

  // 18~20시: 150~250명 (퇴근 후)
  if (hour >= 18 && hour < 20) {
    return Math.floor(Math.random() * 101) + 150; // 150-250
  }

  // 12~14시: 120~200명 (점심 시간 피크)
  if (hour >= 12 && hour < 14) {
    return Math.floor(Math.random() * 81) + 120; // 120-200
  }

  // 14~18시: 80~140명 (오후)
  if (hour >= 14 && hour < 18) {
    return Math.floor(Math.random() * 61) + 80; // 80-140
  }

  // 09~12시: 60~120명 (오전 업무 중)
  if (hour >= 9 && hour < 12) {
    return Math.floor(Math.random() * 61) + 60; // 60-120
  }

  // 06~09시: 25~70명 (출근 전)
  if (hour >= 6 && hour < 9) {
    return Math.floor(Math.random() * 46) + 25; // 25-70
  }

  // 23~24시: 100~180명 (취침 전)
  if (hour === 23) {
    return Math.floor(Math.random() * 81) + 100; // 100-180
  }

  // 00~06시: 8~35명 (야간 최저)
  return Math.floor(Math.random() * 28) + 8; // 8-35
}

// 실시간 결과 피드 데이터
export interface FeedItem {
  id: string;
  region: string;
  gender: '남' | '여';
  percentile: number;
  timestamp: number;
}

// 보고서 명세: 실제 인구 비율 반영
const REGION_WEIGHTS = [
  { region: '서울', weight: 25 },
  { region: '경기', weight: 22 },
  { region: '인천', weight: 7 },
  { region: '부산', weight: 7 },
  { region: '대구', weight: 5 },
  { region: '광주', weight: 4 },
  { region: '대전', weight: 4 },
  { region: '울산', weight: 3 },
  { region: '세종', weight: 1 },
  { region: '강원', weight: 3 },
  { region: '충북', weight: 3 },
  { region: '충남', weight: 4 },
  { region: '전북', weight: 3 },
  { region: '전남', weight: 3 },
  { region: '경북', weight: 5 },
  { region: '경남', weight: 5 },
  { region: '제주', weight: 1 },
];

// 가중치 기반 지역 선택
function getWeightedRegion(): string {
  const totalWeight = REGION_WEIGHTS.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of REGION_WEIGHTS) {
    random -= item.weight;
    if (random <= 0) {
      return item.region;
    }
  }
  
  return '서울'; // fallback
}

// 보고서 명세: 정규분포 반영한 결과 분포
function getWeightedPercentile(): number {
  const rand = Math.random() * 100;
  
  // 상위 1~5%: 10% 확률
  if (rand < 10) {
    return Math.floor(Math.random() * 5) + 1;
  }
  
  // 상위 6~20%: 25% 확률
  if (rand < 35) {
    return Math.floor(Math.random() * 15) + 6;
  }
  
  // 상위 21~50%: 40% 확률 (가장 많이)
  if (rand < 75) {
    return Math.floor(Math.random() * 30) + 21;
  }
  
  // 상위 51~80%: 20% 확률
  if (rand < 95) {
    return Math.floor(Math.random() * 30) + 51;
  }
  
  // 하위 20%: 5% 확률
  return Math.floor(Math.random() * 20) + 81;
}

export function generateMockFeed(count: number = 50): FeedItem[] {
  const feed: FeedItem[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    feed.push({
      id: `feed-${i}-${Math.random().toString(36).substr(2, 9)}`,
      region: getWeightedRegion(),
      gender: Math.random() > 0.5 ? '남' : '여',
      percentile: getWeightedPercentile(),
      timestamp: now - Math.floor(Math.random() * 3600000), // 최근 1시간 이내
    });
  }

  return feed;
}

// 타임스탬프를 상대 시간으로 변환
export function getRelativeTime(timestamp: number): string {
  const elapsed = Date.now() - timestamp;
  const seconds = Math.floor(elapsed / 1000);

  if (seconds < 60) {
    return '방금';
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}분 전`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}시간 전`;
  }

  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}