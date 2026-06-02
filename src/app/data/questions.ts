import type { Gender } from "../types";

export type ResultCategoryKey =
  | "selfCare"
  | "economy"
  | "social"
  | "lifestyle"
  | "mindset";

export interface Question {
  id: number;
  category: "자기관리" | "경제력" | "사회성" | "라이프스타일" | "마인드셋";
  categoryEmoji: string;
  question: string;
  genderSpecificQuestions?: {
    male: string;
    female: string;
  };
  options: string[];
  type: "scale" | "likert"; // 척도형(객관) vs 리커트형(주관)
  scaleType?: "grid" | "slider" | "list"; // UI 렌더링 유형
  optionScores?: number[]; // 선택지별 직접 점수 매핑
  genderSpecificOptions?: {
    // 성별에 따른 선택지 분기 (예: 키 문항)
    male: string[];
    female: string[];
  };
  genderSpecificOptionScores?: {
    male: number[];
    female: number[];
  };
}

export const resultCategoryMap: Record<
  Question["category"],
  ResultCategoryKey
> = {
  자기관리: "selfCare",
  경제력: "economy",
  사회성: "social",
  라이프스타일: "lifestyle",
  마인드셋: "mindset",
};

export function getQuestionOptions(
  question: Question,
  gender: Gender,
): string[] {
  if (!question.genderSpecificOptions) return question.options;
  return gender === "male"
    ? question.genderSpecificOptions.male
    : question.genderSpecificOptions.female;
}

export function getQuestionText(question: Question, gender: Gender): string {
  if (!question.genderSpecificQuestions) return question.question;
  return gender === "male"
    ? question.genderSpecificQuestions.male
    : question.genderSpecificQuestions.female;
}

export function getQuestionScore(
  question: Question,
  optionIndex: number,
  gender: Gender,
): number {
  const optionScores = question.genderSpecificOptionScores
    ? gender === "male"
      ? question.genderSpecificOptionScores.male
      : question.genderSpecificOptionScores.female
    : question.optionScores;

  return optionScores?.[optionIndex] ?? optionIndex + 1;
}

// 1. 성인용 공통 25문항 데이터베이스
export const adultQuestions: Question[] = [
  // 1. 외모·자기관리 (Q1~Q5)
  {
    id: 1,
    category: "자기관리",
    categoryEmoji: "💪",
    question: "당신의 키는 어느 범위에 속하나요?",
    type: "scale",
    scaleType: "grid",
    options: [], // 성별에 따라 동적 주입됨
    genderSpecificOptions: {
      male: ["165cm 이하", "166~170cm", "171~175cm", "176~179cm", "180cm 이상"],
      female: [
        "150cm 이하",
        "151~159cm",
        "160~166cm",
        "167~174cm",
        "175cm 이상",
      ],
    },
    genderSpecificOptionScores: {
      male: [1, 2, 3, 4, 5],
      female: [1, 4, 5, 4, 3],
    },
  },
  {
    id: 2,
    category: "자기관리",
    categoryEmoji: "💪",
    question:
      "일주일에 30분 이상 땀이 날 정도의 운동을 몇 회 하나요?",
    type: "scale",
    scaleType: "slider",
    options: ["안 함", "주 1회", "주 2회", "주 3회", "주 4회 이상"],
  },
  {
    id: 3,
    category: "자기관리",
    categoryEmoji: "💪",
    question: "솔직하게 현재 본인의 체형 상태는 어느 쪽에 가깝나요?",
    type: "scale",
    scaleType: "grid",
    options: [
      "배가 많이 나옴 / 비만형",
      "배가 약간 나옴 / 과체중",
      "보통 체형 (배 안 나옴)",
      "약간 탄탄함",
      "매우 탄탄하고 군더더기 없음",
    ],
  },
  {
    id: 4,
    category: "자기관리",
    categoryEmoji: "💪",
    question: "세안, 보습, 선크림 등 기본적인 피부관리를 꾸준히 하는 편인가요?",
    type: "likert",
    options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
  },
  {
    id: 5,
    category: "자기관리",
    categoryEmoji: "💪",
    question: "헤어스타일이나 옷차림을 상황에 맞게 신경 쓰는 편인가요?",
    type: "likert",
    options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
  },

  // 2. 마인드셋·자기통제 (Q6~Q10)
  {
    id: 6,
    category: "마인드셋",
    categoryEmoji: "🌟",
    question: "한 달에 술(음주)을 몇 번 마시나요?",
    type: "scale",
    scaleType: "slider",
    options: [
      "거의 매일",
      "주 1~2회 (월 4~8회)",
      "월 3~5회",
      "월 1~2회",
      "전혀 안 마심 (0회)",
    ],
  },
  {
    id: 7,
    category: "마인드셋",
    categoryEmoji: "🚬",
    question: "현재 담배(전자담배·액상 포함)를 피우시나요?",
    type: "scale",
    scaleType: "slider",
    options: [
      "매일 핌",
      "가끔 핌 (월 수회)",
      "끊은 지 1년 미만",
      "끊은 지 1년 이상",
      "전혀 안 핌 (비흡연)",
    ],
  },
  {
    id: 8,
    category: "마인드셋",
    categoryEmoji: "❤️",
    question: "평소 대화나 메시지에서 욕설이나 비속어를 쓰지 않는다.",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },
  {
    id: 9,
    category: "마인드셋",
    categoryEmoji: "❤️",
    question:
      "자극적인 콘텐츠나 숏폼 영상에 과하게 시간을 쓰지 않고 스스로 조절하는 편이다.",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },
  {
    id: 10,
    category: "마인드셋",
    categoryEmoji: "❤️",
    question:
      "온라인 커뮤니티나 SNS에서 타인을 혐오하거나 비하하는 발언을 하지 않는다.",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },

  // 3. 경제력·커리어 (Q11~Q15)
  {
    id: 11,
    category: "경제력",
    categoryEmoji: "💰",
    question: "본인의 월 평균 소득(월급·알바비) 중 저축 및 투자 비율은?",
    type: "scale",
    scaleType: "slider",
    options: ["0% (저축 없음)", "10% 미만", "10~20%", "20~30%", "30% 이상"],
  },
  {
    id: 12,
    category: "경제력",
    categoryEmoji: "📚",
    question: "한 달에 책을 몇 권 읽나요? (전자책, 오디오북 포함)",
    type: "scale",
    scaleType: "slider",
    options: ["0권", "1권", "2권", "3권", "4권 이상"],
  },
  {
    id: 13,
    category: "경제력",
    categoryEmoji: "📈",
    question:
      "현재 하시는 직무나 직장, 혹은 학업에서 눈에 띄게 성과를 내며 성장 중이다.",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },
  {
    id: 14,
    category: "경제력",
    categoryEmoji: "🎯",
    question:
      "향후 5년 뒤의 미래 커리어와 성장 목표가 구체적으로 계획되어 있다.",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },
  {
    id: 15,
    category: "경제력",
    categoryEmoji: "🏠",
    question:
      "부모님으로부터 경제적인 독립을 했거나 용돈을 직접 조달하고 있다.",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },

  // 4. 공감·관계 (Q16~Q20)
  {
    id: 16,
    category: "사회성",
    categoryEmoji: "👂",
    question: "상대방이 말할 때 중간에 끊지 않고 끝까지 듣는 편이다.",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },
  {
    id: 17,
    category: "사회성",
    categoryEmoji: "🤝",
    question: "대화 상대의 기분 변화나 분위기를 알아차리고 배려하려고 한다.",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },
  {
    id: 18,
    category: "사회성",
    categoryEmoji: "🧘",
    question: "갈등 상황에서도 바로 감정적으로 반응하기보다 차분히 표현하려고 한다.",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },
  {
    id: 19,
    category: "사회성",
    categoryEmoji: "💬",
    question: "가까운 사람들에게 먼저 안부를 묻거나 관계를 유지하려고 노력하는 편이다.",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },
  {
    id: 20,
    category: "사회성",
    categoryEmoji: "⚖️",
    question: "의견이 다를 때 내 입장만 고집하기보다 상대 입장도 객관적으로 생각하려고 한다.",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },

  // 5. 매력·사교성 (Q21~Q25)
  {
    id: 21,
    category: "라이프스타일",
    categoryEmoji: "📱",
    question: "하루 평균 스마트폰으로 유튜브, 쇼츠, SNS를 사용하는 시간은?",
    type: "scale",
    scaleType: "slider",
    options: ["4시간 이상", "2~4시간", "1~2시간", "30분~1시간", "30분 이하"],
  },
  {
    id: 22,
    category: "라이프스타일",
    categoryEmoji: "🛌",
    question: "다음 날 생활에 지장이 없도록 수면 시간을 관리하는 편이다.",
    type: "likert",
    options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
  },
  {
    id: 23,
    category: "라이프스타일",
    categoryEmoji: "🗣️",
    question: "처음 만난 사람과도 어색함을 줄이고 자연스럽게 대화할 수 있다.",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },
  {
    id: 24,
    category: "라이프스타일",
    categoryEmoji: "😀",
    question: "주변 사람들에게 같이 있으면 편하거나 재미있다는 말을 듣는 편이다.",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },
  {
    id: 25,
    category: "라이프스타일",
    categoryEmoji: "🎨",
    question: "단조로운 일상에 머물지 않고 나만의 취미나 관심사를 꾸준히 즐긴다.",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },
];

const adultEconomyQuestionsByAgeGroup: Record<string, Question[]> = {
  "20~24세": [
    {
      id: 11,
      category: "경제력",
      categoryEmoji: "🎯",
      question: "현재 학업, 취업, 자격증, 포트폴리오 등 내가 집중하는 성장 목표가 있다.",
      type: "likert",
      options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
    },
    {
      id: 12,
      category: "경제력",
      categoryEmoji: "💰",
      question: "알바비, 용돈, 월급 등 들어오는 돈을 충동적으로 쓰기보다 계획해서 쓰는 편이다.",
      type: "likert",
      options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
    },
    {
      id: 13,
      category: "경제력",
      categoryEmoji: "📈",
      question: "관심 있는 직무, 전공, 진로를 위해 실제로 준비하거나 경험을 쌓고 있다.",
      type: "likert",
      options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
    },
    {
      id: 14,
      category: "경제력",
      categoryEmoji: "🏠",
      question: "경제적으로 부모님이나 주변에 의존하는 정도를 줄였거나 노력하고 있다.",
      type: "likert",
      options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
    },
    {
      id: 15,
      category: "경제력",
      categoryEmoji: "🗓️",
      question: "3년 안에 이루고 싶은 커리어, 학업, 경제적 목표가 어느 정도 구체적으로 있다.",
      type: "likert",
      options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
    },
  ],
  "25~29세": [
    {
      id: 11,
      category: "경제력",
      categoryEmoji: "📈",
      question: "현재 하는 일이나 학업에서 실질적인 성과를 만들기 위해 꾸준히 노력하고 있다.",
      type: "likert",
      options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
    },
    {
      id: 12,
      category: "경제력",
      categoryEmoji: "💰",
      question: "월 소득 중 일정 비율을 저축, 투자, 자기계발에 사용하고 있다.",
      type: "likert",
      options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
    },
    {
      id: 13,
      category: "경제력",
      categoryEmoji: "🎯",
      question: "내 직무나 커리어 경쟁력을 높이기 위한 구체적인 행동을 하고 있다.",
      type: "likert",
      options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
    },
    {
      id: 14,
      category: "경제력",
      categoryEmoji: "🏠",
      question: "경제적으로 부모님이나 주변에 크게 의존하지 않고 생활을 관리하고 있다.",
      type: "likert",
      options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
    },
    {
      id: 15,
      category: "경제력",
      categoryEmoji: "🗓️",
      question: "향후 5년의 커리어, 소득, 주거, 생활 목표가 어느 정도 구체적으로 있다.",
      type: "likert",
      options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
    },
  ],
  "30~39세": [
    {
      id: 11,
      category: "경제력",
      categoryEmoji: "🏢",
      question: "현재 직업, 사업, 전문성, 학업 등에서 안정적인 기반을 만들어가고 있다.",
      type: "likert",
      options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
    },
    {
      id: 12,
      category: "경제력",
      categoryEmoji: "💰",
      question: "소득, 지출, 저축, 투자 등 경제 상황을 계획적으로 관리하고 있다.",
      type: "likert",
      options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
    },
    {
      id: 13,
      category: "경제력",
      categoryEmoji: "📈",
      question: "장기적으로 성장할 수 있는 커리어 또는 수입 구조를 고민하고 실행하고 있다.",
      type: "likert",
      options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
    },
    {
      id: 14,
      category: "경제력",
      categoryEmoji: "🧭",
      question: "혼자서도 생활, 건강, 돈, 인간관계를 무너지지 않게 관리할 수 있다.",
      type: "likert",
      options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
    },
    {
      id: 15,
      category: "경제력",
      categoryEmoji: "🗓️",
      question: "앞으로의 5~10년에 대한 현실적인 삶의 계획이 있다.",
      type: "likert",
      options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
    },
  ],
  "40세 이상": [
    {
      id: 11,
      category: "경제력",
      categoryEmoji: "🤝",
      question: "현재 일, 사업, 전문성, 역할에서 신뢰받을 만한 책임감을 가지고 있다.",
      type: "likert",
      options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
    },
    {
      id: 12,
      category: "경제력",
      categoryEmoji: "💰",
      question: "소득, 지출, 자산, 부채를 충동적이지 않고 안정적으로 관리하는 편이다.",
      type: "likert",
      options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
    },
    {
      id: 13,
      category: "경제력",
      categoryEmoji: "🧭",
      question: "현재의 경제 활동이나 생활 방식이 앞으로도 지속 가능하도록 관리하고 있다.",
      type: "likert",
      options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
    },
    {
      id: 14,
      category: "경제력",
      categoryEmoji: "📚",
      question: "나이가 들수록 배움을 멈추지 않고 새로운 것을 익히려는 태도가 있다.",
      type: "likert",
      options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
    },
    {
      id: 15,
      category: "경제력",
      categoryEmoji: "🗓️",
      question: "앞으로의 삶에서 지키고 싶은 경제적 기준이나 생활 방향성이 분명한 편이다.",
      type: "likert",
      options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
    },
  ],
};

// 2. 10대 전용 맞춤 25문항 데이터베이스 (Q11~Q15가 학업/시간관리로 교체됨)
export const teenQuestions: Question[] = [
  // 1. 외모·자기관리 (Q1~Q5) - 공통
  {
    id: 1,
    category: "자기관리",
    categoryEmoji: "💪",
    question: "당신의 키는 어느 범위에 속하나요?",
    type: "scale",
    scaleType: "grid",
    options: [], // 성별에 따라 동적 주입됨
    genderSpecificOptions: {
      male: ["165cm 이하", "166~170cm", "171~175cm", "176~181cm", "180cm 이상"],
      female: [
        "150cm 이하",
        "151~159cm",
        "160~166cm",
        "167~174cm",
        "175cm 이상",
      ],
    },
    genderSpecificOptionScores: {
      male: [1, 2, 3, 4, 5],
      female: [1, 4, 5, 4, 3],
    },
  },
  {
    id: 2,
    category: "자기관리",
    categoryEmoji: "💪",
    question:
      "체육 활동이나 운동을 주 몇 회 하나요? (30분 이상 땀 흘리는 기준)",
    type: "scale",
    scaleType: "slider",
    options: ["안 함", "주 1회", "주 2회", "주 3회", "주 4회 이상"],
  },
  {
    id: 3,
    category: "자기관리",
    categoryEmoji: "💪",
    question: "솔직하게 현재 본인의 체형 상태는 어느 쪽에 가깝나요?",
    type: "scale",
    scaleType: "grid",
    options: [
      "배가 많이 나옴 / 비만형",
      "배가 약간 나옴 / 과체중",
      "보통 체형 (배 안 나옴)",
      "약간 탄탄함 (잔근육)",
      "매우 탄탄하고 군더더기 없음",
    ],
  },
  {
    id: 4,
    category: "자기관리",
    categoryEmoji: "💪",
    question: "세안, 보습, 선크림 등 기본적인 피부관리를 꾸준히 하는 편인가요?",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },
  {
    id: 5,
    category: "자기관리",
    categoryEmoji: "💪",
    question: "헤어스타일이나 옷차림을 상황에 맞게 신경 쓰는 편인가요?",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },

  // 2. 마인드셋·자기통제 (Q6~Q10) - 공통
  {
    id: 6,
    category: "마인드셋",
    categoryEmoji: "🌟",
    question: "법적으로 허용되지 않는 음주를 하지 않는다.",
    type: "likert",
    options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
  },
  {
    id: 7,
    category: "마인드셋",
    categoryEmoji: "🚬",
    question: "담배, 전자담배, 액상 등 니코틴 제품을 사용하지 않는다.",
    type: "likert",
    options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
  },
  {
    id: 8,
    category: "마인드셋",
    categoryEmoji: "❤️",
    question: "평소 대화나 메시지에서 욕설이나 비속어를 쓰지 않는다.",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },
  {
    id: 9,
    category: "마인드셋",
    categoryEmoji: "❤️",
    question:
      "자극적인 콘텐츠나 숏폼 영상에 과하게 시간을 쓰지 않고 스스로 조절하는 편이다.",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },
  {
    id: 10,
    category: "마인드셋",
    categoryEmoji: "❤️",
    question:
      "온라인 커뮤니티나 SNS에서 타인을 혐오하거나 비하하는 발언을 하지 않는다.",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },

  // 3. 10대 전용 맞춤 문항: 미래 경제력 기반 (Q11~Q15)
  {
    id: 11,
    category: "경제력",
    categoryEmoji: "🏫",
    question: "학교생활이나 학업에서 스스로 성실하게 노력하고 있다고 느낀다.",
    type: "likert",
    options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
  },
  {
    id: 12,
    category: "경제력",
    categoryEmoji: "🎮",
    question: "공부나 해야 할 일을 할 때 집중을 방해하는 요소를 스스로 조절할 수 있다.",
    type: "likert",
    options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
  },
  {
    id: 13,
    category: "경제력",
    categoryEmoji: "🌙",
    question: "용돈이나 돈을 쓸 때 충동적으로 쓰기보다 계획해서 쓰는 편이다.",
    type: "likert",
    options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
  },
  {
    id: 14,
    category: "경제력",
    categoryEmoji: "🏃",
    question: "막연히 “잘 살고 싶다”가 아니라 구체적으로 이루고 싶은 목표가 있다.",
    type: "likert",
    options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
  },
  {
    id: 15,
    category: "경제력",
    categoryEmoji: "🎯",
    question:
      "관심 있는 진로, 전공, 직업에 대해 직접 찾아보거나 이를 이루기 위해 노력한 경험이 있다.",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },

  // 4. 공감·관계 (Q16~Q20)
  {
    id: 16,
    category: "사회성",
    categoryEmoji: "👂",
    question: "상대방이 말할 때 중간에 끊지 않고 끝까지 듣는 편이다.",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },
  {
    id: 17,
    category: "사회성",
    categoryEmoji: "🤝",
    question: "친구나 대화 상대의 기분 변화를 알아차리고 배려하려고 한다.",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },
  {
    id: 18,
    category: "사회성",
    categoryEmoji: "🧘",
    question:
      "화나거나 억울한 상황에서도 바로 욱하기보다 감정을 조절하려고 한다.",
    genderSpecificQuestions: {
      male: "화나거나 억울한 상황에서도 바로 욱하기보다 감정을 조절하려고 한다.",
      female:
        "서운하거나 화나는 일이 있어도 바로 감정적으로 반응하기보다 차분히 표현하려고 한다.",
    },
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },
  {
    id: 19,
    category: "사회성",
    categoryEmoji: "💬",
    question: "친구 관계에서 장난과 무례함의 선을 구분하려고 한다.",
    genderSpecificQuestions: {
      male: "친구 관계에서 장난과 무례함의 선을 구분하려고 한다.",
      female:
        "친구 관계에서 뒷말이나 편 가르기보다 직접적이고 건강하게 풀려고 한다.",
    },
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },
  {
    id: 20,
    category: "사회성",
    categoryEmoji: "⚖️",
    question:
      "의견이 다를 때 내 말만 밀어붙이기보다 상대 입장도 생각하려고 한다.",
    genderSpecificQuestions: {
      male: "의견이 다를 때 내 말만 밀어붙이기보다 상대 입장도 생각하려고 한다.",
      female:
        "의견이 다를 때 내 감정만 앞세우기보다 상대 입장도 생각하려고 한다.",
    },
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },

  // 5. 라이프스타일 (Q21~Q25)
  {
    id: 21,
    category: "라이프스타일",
    categoryEmoji: "📱",
    question: "하루 평균 유튜브, 쇼츠, SNS, 게임 사용 시간은?",
    type: "scale",
    scaleType: "slider",
    options: ["4시간 이상", "2~4시간", "1~2시간", "30분~1시간", "30분 이하"],
  },
  {
    id: 22,
    category: "라이프스타일",
    categoryEmoji: "🛌",
    question: "다음 날 생활에 지장이 없도록 수면 시간을 관리하는 편이다.",
    type: "likert",
    options: ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"],
  },
  {
    id: 23,
    category: "라이프스타일",
    categoryEmoji: "🗣️",
    question: "처음 만난 사람과도 어색함을 줄이고 자연스럽게 대화할 수 있다.",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },
  {
    id: 24,
    category: "라이프스타일",
    categoryEmoji: "😀",
    question: "주변 사람들에게 같이 있으면 편하거나 재미있다는 말을 듣는 편이다.",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },
  {
    id: 25,
    category: "라이프스타일",
    categoryEmoji: "🎨",
    question:
      "단조로운 일상에 머물지 않고 나만의 다양한 취미 활동과 뚜렷한 관심사를 가지고 몰두한다.",
    type: "likert",
    options: [
      "전혀 그렇지 않다",
      "그렇지 않은 편이다",
      "보통이다",
      "그런 편이다",
      "매우 그렇다",
    ],
  },
];

/**
 * 나이대에 따른 알맞은 질문 리스트 반환
 */
export const getQuestions = (ageGroup: string): Question[] => {
  if (ageGroup === "10대") return teenQuestions;

  const adultEconomyQuestions =
    adultEconomyQuestionsByAgeGroup[ageGroup] ??
    adultEconomyQuestionsByAgeGroup["25~29세"];

  return [
    ...adultQuestions.slice(0, 10),
    ...adultEconomyQuestions,
    ...adultQuestions.slice(15),
  ];
};
