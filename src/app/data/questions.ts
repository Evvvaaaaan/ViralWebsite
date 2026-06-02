export interface Question {
  id: number;
  category: '자기관리' | '경제력' | '사회성' | '라이프스타일' | '마인드셋';
  categoryEmoji: string;
  question: string;
  options: string[];
  type: 'scale' | 'likert'; // 척도형(객관) vs 리커트형(주관)
  scaleType?: 'grid' | 'slider' | 'list'; // UI 렌더링 유형
  isReverse?: boolean; // 역채점 여부 (높을수록 나쁜 것 - 술, 담배, SNS 등)
  genderSpecificOptions?: { // 성별에 따른 선택지 분기 (예: 키 문항)
    male: string[];
    female: string[];
  };
}

// 1. 성인용 공통 25문항 데이터베이스
export const adultQuestions: Question[] = [
  // 1. 외모·자기관리 (Q1~Q5)
  {
    id: 1,
    category: '자기관리',
    categoryEmoji: '💪',
    question: '당신의 키는 어느 범위에 속하나요?',
    type: 'scale',
    scaleType: 'grid',
    options: [], // 성별에 따라 동적 주입됨
    genderSpecificOptions: {
      male: [
        '165cm 이하',
        '166~170cm',
        '171~175cm',
        '176~180cm',
        '181~185cm',
        '186cm 이상',
      ],
      female: [
        '155cm 이하',
        '156~160cm',
        '161~165cm',
        '166~170cm',
        '171~175cm',
        '176cm 이상',
      ]
    }
  },
  {
    id: 2,
    category: '자기관리',
    categoryEmoji: '💪',
    question: '체육 활동이나 운동을 주 몇 회 하시나요? (30분 이상 땀 흘리는 기준)',
    type: 'scale',
    scaleType: 'slider',
    options: ['안 함', '주 1회', '주 2회', '주 3회', '주 4회 이상'],
  },
  {
    id: 3,
    category: '자기관리',
    categoryEmoji: '💪',
    question: '솔직하게 현재 본인의 체형 상태를 선택하세요.',
    type: 'scale',
    scaleType: 'grid',
    options: [
      '배가 많이 나옴 / 비만형',
      '배가 약간 나옴 / 과체중',
      '보통 체형 (배 안 나옴)',
      '약간 탄탄함 (잔근육)',
      '매우 탄탄하고 군더더기 없음'
    ],
  },
  {
    id: 4,
    category: '자기관리',
    categoryEmoji: '💪',
    question: '매일 실천하는 피부관리 루틴은 몇 단계인가요?',
    type: 'scale',
    scaleType: 'list',
    options: [
      '안 함 (물로만 씻음)',
      '1단계 (세안만)',
      '2단계 (세안 + 보습제)',
      '3단계 (세안 + 토너 + 로션)',
      '4단계 이상 (+ 선크림·에센스·팩 등)'
    ],
  },
  {
    id: 5,
    category: '자기관리',
    categoryEmoji: '💪',
    question: '미용실 방문 또는 헤어컷 주기는 어떻게 되나요?',
    type: 'scale',
    scaleType: 'slider',
    options: [
      '6개월 이상 안 감',
      '4~6개월마다',
      '2~3개월마다',
      '한 달~두 달마다',
      '한 달 이내'
    ],
  },

  // 2. 생활습관·인성 (Q6~Q10)
  {
    id: 6,
    category: '생활습관', // 실제 매핑 시에는 '자기관리' 파트에 흡수되거나 백엔드 매핑 지원
    categoryEmoji: '🌟',
    question: '한 달에 술(음주)을 몇 번 마시나요?',
    type: 'scale',
    scaleType: 'slider',
    isReverse: true, // 역채점 (안 마실수록 높은 점수)
    options: ['거의 매일', '주 1~2회 (월 4~8회)', '월 3~5회', '월 1~2회', '전혀 안 마심 (0회)'],
  },
  {
    id: 7,
    category: '자기관리',
    categoryEmoji: '🚬',
    question: '현재 담배(전자담배·액상 포함)를 피우시나요?',
    type: 'scale',
    scaleType: 'slider',
    isReverse: true, // 역채점 (비흡연일수록 높은 점수)
    options: ['매일 핌', '가끔 핌 (월 수회)', '끊은 지 1년 미만', '끊은 지 1년 이상', '전혀 안 핌 (비흡연)'],
  },
  {
    id: 8,
    category: '자기관리',
    categoryEmoji: '❤️',
    question: '평소 대화나 메시지를 보낼 때 욕설이나 비속어를 쓰지 않는다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },
  {
    id: 9,
    category: '자기관리',
    categoryEmoji: '❤️',
    question: '평소 자극적이거나 불필요한 영상(연예인 직캠 등)을 굳이 찾아보지 않는다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },
  {
    id: 10,
    category: '자기관리',
    categoryEmoji: '❤️',
    question: '온라인 커뮤니티나 SNS 상에서 타인을 혐오하거나 비하하는 발언을 절대 하지 않는다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },

  // 3. 경제력·커리어 (Q11~Q15)
  {
    id: 11,
    category: '경제력',
    categoryEmoji: '💰',
    question: '본인의 월 평균 소득(월급·알바비) 중 저축 및 투자 비율은?',
    type: 'scale',
    scaleType: 'slider',
    options: ['0% (저축 없음)', '10% 미만', '10~20%', '20~30%', '30% 이상'],
  },
  {
    id: 12,
    category: '경제력',
    categoryEmoji: '📚',
    question: '한 달에 책을 몇 권 읽나요? (전자책, 오디오북 포함)',
    type: 'scale',
    scaleType: 'slider',
    options: ['0권', '1권', '2권', '3권', '4권 이상'],
  },
  {
    id: 13,
    category: '경제력',
    categoryEmoji: '📈',
    question: '현재 하시는 직무나 직장, 혹은 학업에서 눈에 띄게 성과를 내며 성장 중이다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },
  {
    id: 14,
    category: '경제력',
    categoryEmoji: '🎯',
    question: '향후 5년 뒤의 미래 커리어와 성장 목표가 구체적으로 계획되어 있다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },
  {
    id: 15,
    category: '경제력',
    categoryEmoji: '🏠',
    question: '부모님으로부터 경제적인 독립을 했거나 용돈을 직접 조달하고 있다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },

  // 4. 공감·관계 (Q16~Q20)
  {
    id: 16,
    category: '사회성',
    categoryEmoji: '👂',
    question: '상대방이 말할 때 중간에 끊지 않고 끝까지 귀 기울여 경청한다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },
  {
    id: 17,
    category: '사회성',
    categoryEmoji: '🤝',
    question: '친구, 연인 혹은 대화 상대의 미묘한 감정 변화를 빠르게 알아채고 배려한다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },
  {
    id: 18,
    category: '사회성',
    categoryEmoji: '🧘',
    question: '갈등 상황이나 억울한 일 앞에서도 감정을 다스리며 욱하거나 감정적으로 폭발하지 않는다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },
  {
    id: 19,
    category: '사회성',
    categoryEmoji: '💬',
    question: '가까운 지인들이나 소중한 인연에게 평소 안부를 묻거나 먼저 다정하게 연락하는 편이다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },
  {
    id: 20,
    category: '사회성',
    categoryEmoji: '⚖️',
    question: '친구와의 트러블이나 의견 다툼 시, 내 입장보다 상대방의 입장을 먼저 객관적으로 생각해보려 노력한다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },

  // 5. 매력·사교성 (Q21~Q25)
  {
    id: 21,
    category: '라이프스타일',
    categoryEmoji: '📱',
    question: '하루 평균 스마트폰으로 유튜브, 쇼츠, SNS를 사용하는 시간은?',
    type: 'scale',
    scaleType: 'slider',
    isReverse: true, // 역채점 (사용 시간이 적을수록 고득점)
    options: ['4시간 이상', '2~4시간', '1~2시간', '30분~1시간', '30분 이하'],
  },
  {
    id: 22,
    category: '라이프스타일',
    categoryEmoji: '🛌',
    question: '하루 평균 규칙적으로 자는 수면 시간은 얼마나 되나요?',
    type: 'scale',
    scaleType: 'grid',
    options: [
      '5시간 이하 (만성 피로)',
      '6시간 내외',
      '9시간 이상 (과수면)',
      '7시간 내외',
      '8시간 내외'
    ],
  },
  {
    id: 23,
    category: '마인드셋',
    categoryEmoji: '🗣️',
    question: '처음 만난 낯선 사람과도 어색함 없이 자연스럽고 유쾌하게 대화를 이끌어간다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },
  {
    id: 24,
    category: '마인드셋',
    categoryEmoji: '😀',
    question: '주변 지인들로부터 나와 대화하면 힐링이 되거나 매우 재미있다는 칭찬을 자주 듣는 편이다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },
  {
    id: 25,
    category: '마인드셋',
    categoryEmoji: '🎨',
    question: '단조로운 일상에 머물지 않고 나만의 다양한 취미 활동과 뚜렷한 관심사를 가지고 몰두한다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },
];

// 2. 10대 전용 맞춤 25문항 데이터베이스 (Q11~Q15가 학업/시간관리로 교체됨)
export const teenQuestions: Question[] = [
  // 1. 외모·자기관리 (Q1~Q5) - 공통
  {
    id: 1,
    category: '자기관리',
    categoryEmoji: '💪',
    question: '당신의 키는 어느 범위에 속하나요?',
    type: 'scale',
    scaleType: 'grid',
    options: [], // 성별에 따라 동적 주입됨
    genderSpecificOptions: {
      male: [
        '165cm 이하',
        '166~170cm',
        '171~175cm',
        '176~180cm',
        '181~185cm',
        '186cm 이상',
      ],
      female: [
        '155cm 이하',
        '156~160cm',
        '161~165cm',
        '166~170cm',
        '171~175cm',
        '176cm 이상',
      ]
    }
  },
  {
    id: 2,
    category: '자기관리',
    categoryEmoji: '💪',
    question: '체육 활동이나 운동을 주 몇 회 하시나요? (30분 이상 땀 흘리는 기준)',
    type: 'scale',
    scaleType: 'slider',
    options: ['안 함', '주 1회', '주 2회', '주 3회', '주 4회 이상'],
  },
  {
    id: 3,
    category: '자기관리',
    categoryEmoji: '💪',
    question: '솔직하게 현재 본인의 체형 상태를 선택하세요.',
    type: 'scale',
    scaleType: 'grid',
    options: [
      '배가 많이 나옴 / 비만형',
      '배가 약간 나옴 / 과체중',
      '보통 체형 (배 안 나옴)',
      '약간 탄탄함 (잔근육)',
      '매우 탄탄하고 군더더기 없음'
    ],
  },
  {
    id: 4,
    category: '자기관리',
    categoryEmoji: '💪',
    question: '매일 실천하는 피부관리 루틴은 몇 단계인가요?',
    type: 'scale',
    scaleType: 'list',
    options: [
      '안 함 (물로만 씻음)',
      '1단계 (세안만)',
      '2단계 (세안 + 보습제)',
      '3단계 (세안 + 토너 + 로션)',
      '4단계 이상 (+ 선크림·에센스·팩 등)'
    ],
  },
  {
    id: 5,
    category: '자기관리',
    categoryEmoji: '💪',
    question: '미용실 방문 또는 헤어컷 주기는 어떻게 되나요?',
    type: 'scale',
    scaleType: 'slider',
    options: [
      '6개월 이상 안 감',
      '4~6개월마다',
      '2~3개월마다',
      '한 달~두 달마다',
      '한 달 이내'
    ],
  },

  // 2. 생활습관·인성 (Q6~Q10) - 공통
  {
    id: 6,
    category: '생활습관',
    categoryEmoji: '🌟',
    question: '한 달에 술(음주)을 몇 번 마시나요?',
    type: 'scale',
    scaleType: 'slider',
    isReverse: true,
    options: ['거의 매일', '주 1~2회 (월 4~8회)', '월 3~5회', '월 1~2회', '전혀 안 마심 (0회)'],
  },
  {
    id: 7,
    category: '자기관리',
    categoryEmoji: '🚬',
    question: '현재 담배(전자담배·액상 포함)를 피우시나요?',
    type: 'scale',
    scaleType: 'slider',
    isReverse: true,
    options: ['매일 핌', '가끔 핌 (월 수회)', '끊은 지 1년 미만', '끊은 지 1년 이상', '전혀 안 핌 (비흡연)'],
  },
  {
    id: 8,
    category: '자기관리',
    categoryEmoji: '❤️',
    question: '평소 대화나 메시지를 보낼 때 욕설이나 비속어를 쓰지 않는다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },
  {
    id: 9,
    category: '자기관리',
    categoryEmoji: '❤️',
    question: '평소 자극적이거나 불필요한 영상(연예인 직캠 등)을 굳이 찾아보지 않는다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },
  {
    id: 10,
    category: '자기관리',
    categoryEmoji: '❤️',
    question: '온라인 커뮤니티나 SNS 상에서 타인을 혐오하거나 비하하는 발언을 절대 하지 않는다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },

  // 3. 10대 전용 맞춤 문항: 학업 및 시간관리 (Q11~Q15)
  {
    id: 11,
    category: '경제력', // 학업을 경제력 카테고리 자리에 맵
    categoryEmoji: '🏫',
    question: '현재 학교 또는 자신의 주관적 학업 성취도는 어느 정도인가요?',
    type: 'scale',
    scaleType: 'grid',
    options: [
      '하위권 (하위 40% 이하)',
      '중하위권',
      '중간 정도 (보통)',
      '중상위권',
      '상위권 (상위 20% 이상)'
    ],
  },
  {
    id: 12,
    category: '경제력',
    categoryEmoji: '🎮',
    question: '하루 평균 스마트폰 사용 및 게임 플레이 시간은 어떻게 되나요?',
    type: 'scale',
    scaleType: 'slider',
    isReverse: true, // 역채점 (시간이 적을수록 건강한 삶)
    options: ['6시간 이상', '4~6시간', '2~4시간', '1~2시간', '1시간 이하'],
  },
  {
    id: 13,
    category: '경제력',
    categoryEmoji: '🌙',
    question: '평일 저녁 취침 시간(자는 시각)은 대체로 몇 시인가요?',
    type: 'scale',
    scaleType: 'grid',
    isReverse: true, // 역채점 (자정을 넘기지 않고 일찍 잘수록 고득점)
    options: ['새벽 2시 이후', '새벽 1~2시', '자정~새벽 1시', '밤 11시~자정', '밤 11시 이전'],
  },
  {
    id: 14,
    category: '경제력',
    categoryEmoji: '🏃',
    question: '학교 체육 수업을 제외하고, 혼자 혹은 외부에서 별도의 운동을 주 몇 회 하나요?',
    type: 'scale',
    scaleType: 'slider',
    options: ['안 함', '주 1회', '주 2회', '주 3회', '주 4회 이상'],
  },
  {
    id: 15,
    category: '경제력',
    categoryEmoji: '🎯',
    question: '내 미래의 구체적인 꿈이나 주도적인 학업 계획이 세워져 있다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },

  // 4. 공감·관계 (Q16~Q20) - 공통
  {
    id: 16,
    category: '사회성',
    categoryEmoji: '👂',
    question: '상대방이 말할 때 중간에 끊지 않고 끝까지 귀 기울여 경청한다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },
  {
    id: 17,
    category: '사회성',
    categoryEmoji: '🤝',
    question: '친구, 연인 혹은 대화 상대의 미묘한 감정 변화를 빠르게 알아채고 배려한다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },
  {
    id: 18,
    category: '사회성',
    categoryEmoji: '🧘',
    question: '갈등 상황이나 억울한 일 앞에서도 감정을 다스리며 욱하거나 감정적으로 폭발하지 않는다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },
  {
    id: 19,
    category: '사회성',
    categoryEmoji: '💬',
    question: '가까운 지인들이나 소중한 인연에게 평소 안부를 묻거나 먼저 다정하게 연락하는 편이다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },
  {
    id: 20,
    category: '사회성',
    categoryEmoji: '⚖️',
    question: '친구와의 트러블이나 의견 다툼 시, 내 입장보다 상대방의 입장을 먼저 객관적으로 생각해보려 노력한다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },

  // 5. 매력·사교성 (Q21~Q25) - 공통
  {
    id: 21,
    category: '라이프스타일',
    categoryEmoji: '📱',
    question: '하루 평균 스마트폰으로 유튜브, 쇼츠, SNS를 사용하는 시간은?',
    type: 'scale',
    scaleType: 'slider',
    isReverse: true,
    options: ['4시간 이상', '2~4시간', '1~2시간', '30분~1시간', '30분 이하'],
  },
  {
    id: 22,
    category: '라이프스타일',
    categoryEmoji: '🛌',
    question: '하루 평균 규칙적으로 자는 수면 시간은 얼마나 되나요?',
    type: 'scale',
    scaleType: 'grid',
    options: [
      '5시간 이하 (만성 피로)',
      '6시간 내외',
      '9시간 이상 (과수면)',
      '7시간 내외',
      '8시간 내외'
    ],
  },
  {
    id: 23,
    category: '마인드셋',
    categoryEmoji: '🗣️',
    question: '처음 만난 낯선 사람과도 어색함 없이 자연스럽고 유쾌하게 대화를 이끌어간다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },
  {
    id: 24,
    category: '마인드셋',
    categoryEmoji: '😀',
    question: '주변 지인들로부터 나와 대화하면 힐링이 되거나 매우 재미있다는 칭찬을 자주 듣는 편이다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },
  {
    id: 25,
    category: '마인드셋',
    categoryEmoji: '🎨',
    question: '단조로운 일상에 머물지 않고 나만의 다양한 취미 활동과 뚜렷한 관심사를 가지고 몰두한다.',
    type: 'likert',
    options: ['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'],
  },
];

/**
 * 나이대에 따른 알맞은 질문 리스트 반환
 */
export const getQuestions = (ageGroup: string): Question[] => {
  return ageGroup === '10대' ? teenQuestions : adultQuestions;
};
