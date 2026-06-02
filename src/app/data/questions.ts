import { LucideIcon } from 'lucide-react';

export interface Question {
  id: number;
  category: string;
  categoryEmoji: string;
  question: string;
  options: string[];
}

export const questions: Question[] = [
  // 자기관리 (1-5)
  {
    id: 1,
    category: '자기관리',
    categoryEmoji: '💪',
    question: '운동을 얼마나 자주 하시나요?',
    options: [
      '거의 매일 (주 5회 이상)',
      '자주 하는 편 (주 3-4회)',
      '가끔 (주 1-2회)',
      '거의 안 함 (월 1-2회)',
      '전혀 안 함',
    ],
  },
  {
    id: 2,
    category: '자기관리',
    categoryEmoji: '💪',
    question: '수면 시간은 규칙적인가요?',
    options: [
      '매우 규칙적 (오차 30분 이내)',
      '비교적 규칙적 (오차 1시간 이내)',
      '불규칙한 편',
      '매우 불규칙',
      '수면 패턴이 무너져 있음',
    ],
  },
  {
    id: 3,
    category: '자기관리',
    categoryEmoji: '💪',
    question: '외모 관리에 투자하는 시간은?',
    options: [
      '매일 1시간 이상',
      '매일 30분~1시간',
      '가끔 신경 씀',
      '최소한만',
      '거의 신경 안 씀',
    ],
  },
  {
    id: 4,
    category: '자기관리',
    categoryEmoji: '💪',
    question: '건강검진을 정기적으로 받나요?',
    options: [
      '1년에 2회 이상',
      '1년에 1회',
      '2-3년에 1회',
      '필요할 때만',
      '거의 안 받음',
    ],
  },
  {
    id: 5,
    category: '자기관리',
    categoryEmoji: '💪',
    question: '식사는 규칙적으로 하시나요?',
    options: [
      '하루 3끼 규칙적',
      '대부분 규칙적',
      '불규칙한 편',
      '자주 거름',
      '매우 불규칙',
    ],
  },

  // 경제력 (6-10)
  {
    id: 6,
    category: '경제력',
    categoryEmoji: '💰',
    question: '월 저축/투자 금액은?',
    options: [
      '월급의 50% 이상',
      '월급의 30-50%',
      '월급의 10-30%',
      '월급의 10% 미만',
      '저축 여력 없음',
    ],
  },
  {
    id: 7,
    category: '경제력',
    categoryEmoji: '💰',
    question: '부채는 어느 정도인가요?',
    options: [
      '전혀 없음',
      '소액 (연소득의 10% 미만)',
      '보통 (연소득의 10-50%)',
      '많음 (연소득의 50-100%)',
      '매우 많음 (연소득 초과)',
    ],
  },
  {
    id: 8,
    category: '경제력',
    categoryEmoji: '💰',
    question: '재테크 공부를 하시나요?',
    options: [
      '매일 학습',
      '주 3회 이상',
      '가끔',
      '관심만 있음',
      '전혀 안 함',
    ],
  },
  {
    id: 9,
    category: '경제력',
    categoryEmoji: '💰',
    question: '현재 자산은?',
    options: [
      '1억 이상',
      '5천만원~1억',
      '1천만원~5천만원',
      '1천만원 미만',
      '자산 거의 없음',
    ],
  },
  {
    id: 10,
    category: '경제력',
    categoryEmoji: '💰',
    question: '부수입이 있나요?',
    options: [
      '본업 수준의 부수입',
      '월 50만원 이상',
      '월 10-50만원',
      '가끔 있음',
      '없음',
    ],
  },

  // 사회성 (11-15)
  {
    id: 11,
    category: '사회성',
    categoryEmoji: '🤝',
    question: '친한 친구는 몇 명인가요?',
    options: [
      '10명 이상',
      '5-10명',
      '3-5명',
      '1-2명',
      '없음',
    ],
  },
  {
    id: 12,
    category: '사회성',
    categoryEmoji: '🤝',
    question: '모임/약속 빈도는?',
    options: [
      '주 3회 이상',
      '주 1-2회',
      '월 2-3회',
      '월 1회',
      '거의 없음',
    ],
  },
  {
    id: 13,
    category: '사회성',
    categoryEmoji: '🤝',
    question: '새로운 사람 만나는 것을 좋아하나요?',
    options: [
      '매우 좋아함',
      '좋아하는 편',
      '보통',
      '부담스러움',
      '매우 부담스러움',
    ],
  },
  {
    id: 14,
    category: '사회성',
    categoryEmoji: '🤝',
    question: '리더십 경험이 있나요?',
    options: [
      '여러 번 있음',
      '몇 번 있음',
      '1-2번 있음',
      '거의 없음',
      '전혀 없음',
    ],
  },
  {
    id: 15,
    category: '사회성',
    categoryEmoji: '🤝',
    question: '갈등 해결 능력은?',
    options: [
      '매우 뛰어남',
      '뛰어남',
      '보통',
      '부족',
      '매우 부족',
    ],
  },

  // 라이프스타일 (16-20)
  {
    id: 16,
    category: '라이프스타일',
    categoryEmoji: '🎯',
    question: '취미 활동을 하시나요?',
    options: [
      '3개 이상 활발히',
      '2개 활발히',
      '1개 가끔',
      '관심만 있음',
      '없음',
    ],
  },
  {
    id: 17,
    category: '라이프스타일',
    categoryEmoji: '🎯',
    question: '여행은 얼마나 자주?',
    options: [
      '월 1회 이상',
      '분기 1회',
      '연 2-3회',
      '연 1회',
      '거의 안 감',
    ],
  },
  {
    id: 18,
    category: '라이프스타일',
    categoryEmoji: '🎯',
    question: '문화생활 (영화, 공연 등) 빈도는?',
    options: [
      '주 1회 이상',
      '월 2-3회',
      '월 1회',
      '분기 1회',
      '거의 없음',
    ],
  },
  {
    id: 19,
    category: '라이프스타일',
    categoryEmoji: '🎯',
    question: '자기계발 활동은?',
    options: [
      '매일 함',
      '주 3회 이상',
      '가끔',
      '관심만',
      '안 함',
    ],
  },
  {
    id: 20,
    category: '라이프스타일',
    categoryEmoji: '🎯',
    question: '일과 삶의 균형은?',
    options: [
      '완벽한 균형',
      '잘 유지됨',
      '보통',
      '불균형',
      '매우 불균형',
    ],
  },

  // 마인드셋 (21-25)
  {
    id: 21,
    category: '마인드셋',
    categoryEmoji: '🧠',
    question: '목표를 얼마나 자주 세우나요?',
    options: [
      '매일',
      '주마다',
      '월마다',
      '가끔',
      '안 세움',
    ],
  },
  {
    id: 22,
    category: '마인드셋',
    categoryEmoji: '🧠',
    question: '계획 실행력은?',
    options: [
      '거의 항상 달성',
      '자주 달성',
      '가끔 달성',
      '잘 안 됨',
      '거의 안 됨',
    ],
  },
  {
    id: 23,
    category: '마인드셋',
    categoryEmoji: '🧠',
    question: '긍정적 사고를 하시나요?',
    options: [
      '항상 긍정적',
      '대부분 긍정적',
      '보통',
      '부정적인 편',
      '매우 부정적',
    ],
  },
  {
    id: 24,
    category: '마인드셋',
    categoryEmoji: '🧠',
    question: '스트레스 관리는?',
    options: [
      '매우 잘함',
      '잘하는 편',
      '보통',
      '잘 못함',
      '매우 못함',
    ],
  },
  {
    id: 25,
    category: '마인드셋',
    categoryEmoji: '🧠',
    question: '성장 의지는?',
    options: [
      '매우 강함',
      '강함',
      '보통',
      '약함',
      '매우 약함',
    ],
  },
];
