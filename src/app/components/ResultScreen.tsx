import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Crown,
  Diamond,
  Star,
  Sparkles,
  BarChart3,
  Sprout,
  Gem,
  Target,
  TrendingUp,
  MessageCircle,
  User,
  Dumbbell,
  Wallet,
  Users,
  Compass,
  Brain,
  MapPin,
  CalendarDays,
  Download,
  Loader2,
} from "lucide-react";
import type { Gender } from "../types";
import confetti from "canvas-confetti";
import ShareModal from "./ShareModal";
import { Link } from "react-router";
import { logGAEvent } from "../utils/analytics";
import { logUserEvent } from "../utils/apiClient";
import {
  createResultImageBlob,
  downloadImageBlob,
  isMobile,
  blobToDataURL,
  type ResultImageData,
} from "../utils/resultImage";
import InstagramIcon from "./InstagramIcon";
import MobileSaveModal from "./MobileSaveModal";

type CategoryKey = "selfCare" | "economy" | "social" | "lifestyle" | "mindset";

// 25가지 유형명 (강점 × 약점 조합)
const TYPE_MAP: Record<
  CategoryKey,
  Record<CategoryKey, { name: string; desc: string }>
> = {
  selfCare: {
    selfCare: {
      name: "균형 잡힌 자기관리러",
      desc: "자기관리가 가장 두드러진 균형형",
    },
    economy: {
      name: "건강한 방랑자",
      desc: "외모와 체력은 최상위인데 통장이 텅 빈 유형",
    },
    social: {
      name: "고독한 자기관리러",
      desc: "혼자는 완벽한데 관계가 어려운 유형",
    },
    lifestyle: {
      name: "폼생폼사형",
      desc: "겉은 완벽한데 생활 루틴이 무너진 유형",
    },
    mindset: {
      name: "관리형 쾌락주의자",
      desc: "몸은 만들었는데 술·담배에 발목 잡히는 유형",
    },
  },
  economy: {
    selfCare: {
      name: "일하는 기계형",
      desc: "커리어는 탄탄하지만 건강·외모 관리를 못 하는 유형",
    },
    economy: { name: "경제적 자립형", desc: "경제력이 가장 두드러진 균형형" },
    social: {
      name: "혼자 잘나가는 유형",
      desc: "혼자는 잘 나가지만 사람 관계가 약한 유형",
    },
    lifestyle: {
      name: "성실한 워커홀릭",
      desc: "일과 돈에는 강하지만 삶의 여유가 없는 유형",
    },
    mindset: {
      name: "냉철한 능력자",
      desc: "성과는 뛰어나지만 생활 습관이 아쉬운 유형",
    },
  },
  social: {
    selfCare: {
      name: "인기는 있는데 관리 안 된 유형",
      desc: "사람들은 좋아하지만 자기관리가 부족한 유형",
    },
    economy: {
      name: "인싸이지만 빈털터리",
      desc: "인기는 많은데 통장이 걱정인 유형",
    },
    social: { name: "사교적 매력형", desc: "사회성이 가장 두드러진 균형형" },
    lifestyle: {
      name: "사교적 번아웃형",
      desc: "사람을 잘 사귀지만 혼자만의 시간이 없는 유형",
    },
    mindset: {
      name: "매력적인 문제아",
      desc: "끌리는 매력은 있지만 생활 습관이 아쉬운 유형",
    },
  },
  lifestyle: {
    selfCare: {
      name: "자유로운 영혼형",
      desc: "삶의 감각은 있는데 자기관리가 아쉬운 유형",
    },
    economy: {
      name: "행복하지만 가난한 유형",
      desc: "삶의 질은 높은데 경제적 기반이 약한 유형",
    },
    social: {
      name: "혼자가 편한 라이프스타일러",
      desc: "자기 세계는 뚜렷한데 관계 형성이 어려운 유형",
    },
    lifestyle: {
      name: "삶의 여유형",
      desc: "라이프스타일이 가장 두드러진 균형형",
    },
    mindset: {
      name: "낭만적 즉흥주의자",
      desc: "취미와 감성은 풍부한데 절제력이 약한 유형",
    },
  },
  mindset: {
    selfCare: {
      name: "내면의 성인",
      desc: "인성과 가치관은 완벽한데 외모 관리가 약한 유형",
    },
    economy: {
      name: "착하지만 가난한 유형",
      desc: "마음은 바른데 경제 감각이 부족한 유형",
    },
    social: {
      name: "조용한 모범생",
      desc: "혼자는 완벽한데 사람 사귀는 게 어려운 유형",
    },
    lifestyle: {
      name: "절제의 달인",
      desc: "절제력은 뛰어나지만 삶이 단조로운 유형",
    },
    mindset: { name: "정신적 성숙형", desc: "마인드셋이 가장 두드러진 균형형" },
  },
};

// 카테고리별 실제 최대 점수
const CATEGORY_MAX: Record<string, number> = {
  selfCare: 50,
  economy: 25,
  social: 25,
  lifestyle: 10,
  mindset: 15,
};

const CATEGORY_LABEL: Record<string, string> = {
  selfCare: "자기관리",
  economy: "경제력",
  social: "사회성",
  lifestyle: "라이프스타일",
  mindset: "마인드셋",
};

// 카테고리 점수 비율 → 수준 (0~1)
function level(score: number, key: string): number {
  return score / CATEGORY_MAX[key];
}

// 티어 분류 (정규화 레벨 기준)
type Tier = "high" | "mid" | "low";
function getTier(lv: number): Tier {
  if (lv >= 0.72) return "high";
  if (lv >= 0.48) return "mid";
  return "low";
}

// 카테고리별 티어 메시지 (강점 설명 / 개선 조언)
const CATEGORY_FEEDBACK: Record<
  CategoryKey,
  Record<Tier, { title: string; message: string; action: string }>
> = {
  selfCare: {
    high: {
      title: "강점 ✦",
      message:
        "자기관리 능력이 최상위권입니다. 규칙적인 루틴과 건강 관리가 완전히 습관화되어 있어요.",
      action:
        "이 강점이 연애·커리어에서 실질적 경쟁력이 됩니다. 계속 유지하세요.",
    },
    mid: {
      title: "보통",
      message:
        "자기관리가 평균 수준입니다. 운동 빈도나 수면 관리 중 하나만 꾸준히 올려도 점수가 크게 오릅니다.",
      action: "주 3회 운동 루틴을 먼저 잡아보세요.",
    },
    low: {
      title: "개선 필요",
      message: "자기관리 영역이 전체 순위에서 가장 많이 깎이는 구간입니다.",
      action: "수면·식단·운동 중 하나부터 시작하세요. 주 1회부터도 충분합니다.",
    },
  },
  economy: {
    high: {
      title: "강점 ✦",
      message:
        "경제적 사고력과 재정 관리가 탁월합니다. 현명한 소비·저축·투자 습관을 모두 갖추고 있어요.",
      action: "이 영역의 강점이 가장 오래 지속되는 실질적 매력입니다.",
    },
    mid: {
      title: "보통",
      message:
        "재정 감각이 평균 수준입니다. 저축·투자 비중을 조금만 높여도 순위가 빠르게 상승합니다.",
      action: "월 소득의 10%부터 저축을 시작해보세요.",
    },
    low: {
      title: "개선 필요",
      message: "경제력이 전체 점수의 발목을 잡고 있습니다.",
      action:
        "월 지출을 기록하는 것부터 시작하세요. 파악만으로도 점수가 눈에 띄게 오릅니다.",
    },
  },
  social: {
    high: {
      title: "강점 ✦",
      message:
        "대인관계와 소통 능력이 매우 뛰어납니다. 신뢰 구축이 자연스럽게 이루어지는 유형이에요.",
      action: "이 강점은 연애·직장 모든 곳에서 실질적 경쟁력이 됩니다.",
    },
    mid: {
      title: "보통",
      message:
        "사회성이 평균 수준입니다. 먼저 연락하거나 안부를 묻는 작은 행동을 의식적으로 늘려보세요.",
      action: "관계는 큰 이벤트보다 작은 꾸준함이 훨씬 효과적입니다.",
    },
    low: {
      title: "개선 필요",
      message: "사회성 영역에서 개선 여지가 가장 큽니다.",
      action:
        "대화에서 상대방 말을 끝까지 듣는 것 하나만 의식해도 사회성 점수가 달라집니다.",
    },
  },
  lifestyle: {
    high: {
      title: "강점 ✦",
      message:
        "삶의 방식이 균형 잡히고 풍요롭습니다. 여가·취미·스마트폰 절제가 조화롭게 설계되어 있어요.",
      action:
        "이 영역의 높은 점수는 매력적인 대화 주제와 자기 충족감을 동시에 만듭니다.",
    },
    mid: {
      title: "보통",
      message:
        "라이프스타일이 평균 수준입니다. 스마트폰 시간을 1시간 줄이고 취미에 투자해보세요.",
      action: "삶의 여유가 생기면 대화도, 관계도 풍부해집니다.",
    },
    low: {
      title: "개선 필요",
      message: "라이프스타일 영역이 전체 점수에 영향을 주고 있습니다.",
      action:
        "하루 스마트폰 사용 시간을 2시간 줄이는 것만으로도 전국 상위 35%로 진입 가능합니다.",
    },
  },
  mindset: {
    high: {
      title: "강점 ✦",
      message:
        "성장 지향적 마인드와 절제력이 매우 강합니다. 음주·흡연 등 생활 습관이 전국 기준 상위권이에요.",
      action:
        "이 영역의 높은 점수는 건강·관계·인상 모두에 장기적으로 영향을 줍니다.",
    },
    mid: {
      title: "보통",
      message:
        "마인드셋이 평균 수준입니다. 음주 빈도나 온라인 시간 중 하나만 줄여도 점수가 오릅니다.",
      action: "월 음주 횟수를 3회 이하로 줄이는 것이 가장 효과적입니다.",
    },
    low: {
      title: "개선 필요",
      message: "마인드셋 영역이 전체 순위를 가장 많이 깎고 있습니다.",
      action:
        "음주·흡연 중 하나라도 개선하면 이 카테고리 점수가 크게 상승하고 전국 수만 명을 앞섭니다.",
    },
  },
};

// 강점+약점 조합별 전략
const STRATEGY_MAP: Record<
  CategoryKey,
  Partial<Record<CategoryKey, string>>
> = {
  selfCare: {
    economy: "건강한 몸과 머리로 경제 공부에 집중하면 시너지 효과가 큽니다.",
    social: "좋은 컨디션에서 관계에 더 투자하면 금방 사회성도 올라갑니다.",
    lifestyle: "자기관리 루틴에 여가를 접목하면 삶의 질이 한 단계 올라갑니다.",
    mindset:
      "이미 갖춰진 규칙적인 생활 습관으로 마인드셋 훈련을 더하면 최고 조합입니다.",
  },
  economy: {
    selfCare:
      "재정적 여유를 건강 투자로 연결하면 자기관리 점수도 빠르게 오릅니다.",
    social: "경제적 안정감을 바탕으로 관계에 더 투자할 여유를 만들어보세요.",
    lifestyle: "재정 능력을 활용해 의미 있는 경험에 투자하면 큰 차이가 납니다.",
    mindset: "경제적 성공 경험이 마인드셋 강화에 가장 좋은 연료입니다.",
  },
  social: {
    selfCare: "넓은 인맥을 통해 좋은 건강 습관 정보를 적극 활용해보세요.",
    economy:
      "주변 네트워크를 경제 성장의 발판으로 활용하는 전략이 효과적입니다.",
    lifestyle: "다양한 관계망을 통해 라이프스타일 영역도 함께 넓혀보세요.",
    mindset: "좋은 관계는 마인드셋 성장의 가장 강력한 동력입니다.",
  },
  lifestyle: {
    selfCare: "풍요로운 여가를 자기관리와 결합하면 두 영역 모두 올라갑니다.",
    economy: "라이프스타일에서 쌓은 경험을 경제적 가치로 연결해보세요.",
    social:
      "취미와 여가를 함께할 사람을 늘리면 사회성이 자연스럽게 따라옵니다.",
    mindset: "여유로운 삶의 방식이 마인드셋 성장에 좋은 토대가 됩니다.",
  },
  mindset: {
    selfCare:
      "강한 의지력을 생활 루틴 구축에 집중하면 가장 빠른 변화를 만듭니다.",
    economy: "도전 정신을 경제적 목표에 연결하면 재정 성장이 빨라집니다.",
    social: "성장 마인드로 관계에 접근하면 주변 사람들의 반응이 달라집니다.",
    lifestyle: "마인드셋 힘으로 라이프스타일 변화에 도전해보세요.",
  },
};

// 유형명 + 카테고리 피드백 + 전략 생성
function generateUserProfile(categories: Record<string, number>) {
  const keys = Object.keys(CATEGORY_MAX) as CategoryKey[];
  const lvs = Object.fromEntries(
    keys.map((k) => [k, level(categories[k] ?? 0, k)]),
  );

  const maxKey = keys.reduce((a, b) => (lvs[a] >= lvs[b] ? a : b));
  const minKey = keys.reduce((a, b) => (lvs[a] <= lvs[b] ? a : b));

  const userType = TYPE_MAP[maxKey][minKey];
  const strategy =
    STRATEGY_MAP[maxKey]?.[minKey] ??
    `${CATEGORY_LABEL[maxKey]} 강점을 살려 ${CATEGORY_LABEL[minKey]} 영역에 집중 투자하면 순위가 크게 오릅니다.`;

  const categoryCards = keys.map((k) => ({
    key: k,
    label: CATEGORY_LABEL[k],
    lv: lvs[k],
    tier: getTier(lvs[k]),
    ...CATEGORY_FEEDBACK[k][getTier(lvs[k])],
  }));

  return { userType, maxKey, minKey, strategy, categoryCards };
}

// 순위 상승 시뮬레이션 (약점 카테고리 1단계 개선 시)
function simulateRankImprovement(
  currentTotal: number,
  minKey: CategoryKey,
  mean: number,
  stdDev: number,
): { improvedPct: number; rise: number } {
  const improvement = CATEGORY_MAX[minKey] * 0.2; // 약점 카테고리 20% 향상 = 1단계
  const newTotal = Math.min(currentTotal + improvement, 125);

  function normalCDF(z: number): number {
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp((-z * z) / 2);
    const p =
      d *
      t *
      (0.3193815 +
        t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return z > 0 ? 1 - p : p;
  }

  const currentPct = (1 - normalCDF((currentTotal - mean) / stdDev)) * 100;
  const improvedPct = (1 - normalCDF((newTotal - mean) / stdDev)) * 100;
  const rise = Math.max(0.1, parseFloat((currentPct - improvedPct).toFixed(1)));

  return { improvedPct: parseFloat(improvedPct.toFixed(1)), rise };
}

interface ResultScreenProps {
  result: any;
  gender: Gender;
  onRestart: () => void;
}

const gradeConfig = {
  S: {
    color: "#f5a623",
    glow: "rgba(245, 166, 35, 0.5)",
    label: "전설",
    icon: Crown,
    message: "전국 상위 1%. 당신 같은 사람, 100명 중 1명입니다.",
  },
  A: {
    color: "#7b68ee",
    glow: "rgba(123, 104, 238, 0.3)",
    label: "탁월",
    icon: Diamond,
    message: "전국 상위 5%. 매우 뛰어난 수준입니다.",
  },
  B: {
    color: "#00d4aa",
    glow: "rgba(0, 212, 170, 0.25)",
    label: "이상형급",
    icon: Star,
    message: "전국 상위 15%. 이상형에 가까운 수준입니다.",
  },
  C: {
    color: "#4fc3f7",
    glow: "rgba(79, 195, 247, 0.2)",
    label: "평균 이상",
    icon: Sparkles,
    message: "전국 평균 이상. 좋은 수준입니다.",
  },
  D: {
    color: "#aaaaaa",
    glow: "rgba(170, 170, 170, 0.15)",
    label: "평범",
    icon: BarChart3,
    message: "전국 평균 수준입니다.",
  },
  F: {
    color: "#ff6b6b",
    glow: "rgba(255, 107, 107, 0.2)",
    label: "성장 중",
    icon: Sprout,
    message: "지금이 시작점이에요. 함께 성장해봐요.",
  },
};

const radarCategories = [
  { key: "selfCare", label: "자기관리" },
  { key: "economy", label: "경제력" },
  { key: "social", label: "사회성" },
  { key: "lifestyle", label: "라이프" },
  { key: "mindset", label: "마인드셋" },
] as const;

function ResultRadarChart({
  categories,
  color,
  fillOpacity,
}: {
  categories: ResultImageData["categories"];
  color: string;
  fillOpacity: number;
}) {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 100;
  const maxValue = 25;

  const point = (index: number, scale: number) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / radarCategories.length;
    return {
      x: cx + Math.cos(angle) * radius * scale,
      y: cy + Math.sin(angle) * radius * scale,
    };
  };

  const polygonPoints = radarCategories
    .map(({ key }, index) => {
      const scale = Math.max(0, Math.min(1, categories[key] / maxValue));
      const { x, y } = point(index, scale);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="역량 분석 레이더 차트"
      className="block"
    >
      {[1 / 3, 2 / 3, 1].map((scale) => (
        <polygon
          key={scale}
          points={radarCategories
            .map((_, index) => {
              const { x, y } = point(index, scale);
              return `${x},${y}`;
            })
            .join(" ")}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
        />
      ))}

      {radarCategories.map(({ label }, index) => {
        const outer = point(index, 1);
        const angle =
          -Math.PI / 2 + (Math.PI * 2 * index) / radarCategories.length;
        const labelX = cx + Math.cos(angle) * (radius + 38);
        const labelY = cy + Math.sin(angle) * (radius + 38);

        return (
          <g key={label}>
            <line
              x1={cx}
              y1={cy}
              x2={outer.x}
              y2={outer.y}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
            <text
              x={labelX}
              y={labelY}
              dy="0.35em"
              textAnchor="middle"
              fill="rgba(255, 255, 255, 0.65)"
              fontSize="12"
              fontWeight="500"
            >
              {label}
            </text>
          </g>
        );
      })}

      <polygon
        points={polygonPoints}
        fill={color}
        fillOpacity={fillOpacity}
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ResultScreen({
  result,
  gender,
  onRestart,
}: ResultScreenProps) {
  const [displayPercentile, setDisplayPercentile] = useState(0);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [showRankChange, setShowRankChange] = useState(false);
  const adjustedPercentile = result.percentile;
  const [newPercentile, setNewPercentile] = useState(adjustedPercentile);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mobileSaveImage, setMobileSaveImage] = useState<string | null>(null);
  const [mobileSaveContext, setMobileSaveContext] = useState<
    "instagram" | "save" | null
  >(null);
  const grade = gradeConfig[result.grade as keyof typeof gradeConfig];

  const closeMobileSaveModal = () => {
    if (mobileSaveImage) {
      URL.revokeObjectURL(mobileSaveImage);
      setMobileSaveImage(null);
      setMobileSaveContext(null);
    }
  };

  const isTopRank = result.grade === "S";

  // 유형명 + 카테고리 피드백 생성
  const profile = generateUserProfile(result.categories);
  const { userType, categoryCards, strategy, minKey } = profile;

  // 연령대별 정규분포 파라미터 (QuizFlow와 동일)
  const ageGroup = result.ageGroup || "25~29세";
  const meanMap: Record<string, number> = {
    "10대": 52,
    "20~24세": 60,
    "25~29세": 66,
    "30~39세": 72,
    "40세 이상": 75,
  };
  const stdMap: Record<string, number> = {
    "10대": 13,
    "20~24세": 15,
    "25~29세": 16,
    "30~39세": 17,
    "40세 이상": 16,
  };
  const simMean = meanMap[ageGroup] ?? 66;
  const simStd = stdMap[ageGroup] ?? 16;
  const rankSim = simulateRankImprovement(
    result.total,
    minKey,
    simMean,
    simStd,
  );

  // 세분화 순위 - 서버에서 받은 실제 순위 사용
  const detailedRankings = result.rankings || {
    national: result.percentile,
    region: Math.max(0.1, result.percentile * 0.7),
    ageGroup: Math.max(0.1, result.percentile * 0.45),
  };

  // 결과 화면 마운트 시 행동 분석 로깅
  useEffect(() => {
    logGAEvent(
      "result_viewed",
      "conversion",
      `Percentile: ${result.percentile} (${result.grade})`,
    );
    logUserEvent("result_viewed", {
      percentile: result.percentile,
      grade: result.grade,
      gender,
    });
  }, [result.percentile, result.grade, gender]);

  // 순위 변동 알림 (30-90초 후)
  useEffect(() => {
    // 보고서 명세: 30~90초 랜덤 딜레이 후
    const delay = Math.floor(Math.random() * 60000) + 30000; // 30-90초

    const timer = setTimeout(() => {
      // 보고서 명세: 순위 소폭 하락 (0.05 ~ 0.15% 증가)
      const increase = (Math.random() * 0.1 + 0.05).toFixed(2);
      const updated = parseFloat(
        (adjustedPercentile + parseFloat(increase)).toFixed(2),
      );
      setNewPercentile(updated);
      setShowRankChange(true);

      // 5초 후 사라짐
      setTimeout(() => {
        setShowRankChange(false);
      }, 5000);
    }, delay);

    return () => clearTimeout(timer);
  }, [result.percentile]);

  const handleShare = () => {
    setShareModalOpen(true);
  };

  /** 빠른 인스타그램 스토리 공유 (결과 화면에서 바로) */
  const handleInstagramShare = async () => {
    logGAEvent("insta_share_clicked", "engagement", "Quick Actions");
    logUserEvent("insta_share_clicked", { source: "result_page" });
    try {
      setIsCapturing(true);
      const blob = await createResultImageBlob(getResultImageData());
      setIsCapturing(false);

      if (!blob) return;

      const fileName = `순위테스트-결과-상위${adjustedPercentile}%.png`;
      // Using a clean alphanumeric filename prevents broken preview thumbnails and file loading errors on mobile OS share sheets (e.g. iOS Safari)
      const file = new File([blob], "quiz-result.png", { type: "image/png" });

      if (
        isMobile() &&
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            files: [file],
            title: "전국 순위 테스트 결과",
          });
          return;
        } catch (shareErr) {
          if ((shareErr as Error).name === "AbortError") return; // User cancelled
          console.warn("Instagram share failed, fallback to modal:", shareErr);
        }
      }

      if (isMobile()) {
        // Reverted: Do NOT call downloadImageBlob on mobile to avoid web downloads. Use URL.createObjectURL for preview.
        setMobileSaveImage(URL.createObjectURL(blob));
        setMobileSaveContext("instagram");
      } else {
        downloadImageBlob(blob, fileName);
        alert("결과 이미지가 다운로드되었습니다. 인스타그램에 업로드해보세요!");
      }
    } catch (err) {
      setIsCapturing(false);
      console.error("Instagram share failed:", err);
    }
  };

  /** 빠른 카카오톡 공유 */
  const handleKakaoShare = async () => {
    logGAEvent("kakao_share_clicked", "engagement", "Quick Actions");
    logUserEvent("kakao_share_clicked", { source: "result_page" });
    const text = `나는 전국 상위 ${adjustedPercentile}%! ${userType.name} 유형\n당신의 순위는?`;
    const url = "https://lyralab.site/percentme";

    if (navigator.share) {
      try {
        await navigator.share({ title: "전국 순위 테스트 결과", text, url });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
      }
    }

    if (isMobile()) {
      window.location.href = `kakaotalk://send?msg=${encodeURIComponent(`${text}\n${url}`)}`;
      return;
    }

    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      alert("링크가 복사되었습니다! 카카오톡에 붙여넣기하세요.");
    } catch (_) {}
  };

  /** 빠른 이미지 저장 (결과 화면에서 바로) */
  const handleQuickDownload = async () => {
    logGAEvent("image_save_clicked", "engagement", "Quick Actions");
    logUserEvent("image_save_clicked", { source: "result_page" });
    try {
      setIsSaving(true);
      const blob = await createResultImageBlob(getResultImageData());
      setIsSaving(false);

      if (!blob) return;

      const fileName = `순위테스트-결과-상위${adjustedPercentile}%-${Date.now()}.png`;
      // Using a clean alphanumeric filename prevents broken preview thumbnails and file loading errors on mobile OS share sheets (e.g. iOS Safari)
      const file = new File([blob], "quiz-result.png", { type: "image/png" });

      if (
        isMobile() &&
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            files: [file],
            title: "전국 순위 테스트 결과",
          });
          return;
        } catch (shareErr) {
          if ((shareErr as Error).name === "AbortError") return;
        }
      }

      if (isMobile()) {
        // Reverted: Do NOT call downloadImageBlob on mobile to avoid web downloads. Use URL.createObjectURL for preview.
        setMobileSaveImage(URL.createObjectURL(blob));
        setMobileSaveContext("save");
      } else {
        downloadImageBlob(blob, fileName);
      }
    } catch (err) {
      setIsSaving(false);
      console.error("Download failed:", err);
    }
  };

  // Gold particle explosion for S grade
  useEffect(() => {
    if (isTopRank) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 80,
          origin: { x: 0, y: 0.5 },
          colors: ["#f5a623", "#ffd700", "#ffed4e", "#ffa500"],
          gravity: 0.8,
          scalar: 1.2,
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 80,
          origin: { x: 1, y: 0.5 },
          colors: ["#f5a623", "#ffd700", "#ffed4e", "#ffa500"],
          gravity: 0.8,
          scalar: 1.2,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isTopRank]);

  // Count up animation with overshoot
  useEffect(() => {
    let start = 0;
    const end = adjustedPercentile;
    const duration = isTopRank ? 1500 : 1200;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayPercentile(end);
        clearInterval(timer);
      } else {
        setDisplayPercentile(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [result.percentile, isTopRank]);

  const categoryScores = [
    { name: "자기관리", icon: Dumbbell, score: result.categories.selfCare },
    { name: "경제력", icon: Wallet, score: result.categories.economy },
    { name: "사회성", icon: Users, score: result.categories.social },
    { name: "라이프스타일", icon: Compass, score: result.categories.lifestyle },
    { name: "마인드셋", icon: Brain, score: result.categories.mindset },
  ];

  const maxCategory = categoryScores.reduce((max, cat) =>
    cat.score > max.score ? cat : max,
  );
  const minCategory = categoryScores.reduce((min, cat) =>
    cat.score < min.score ? cat : min,
  );

  const getResultImageData = (): ResultImageData => ({
    percentile: result.percentile,
    grade: result.grade,
    total: result.total,
    gender: gender!,
    gradeColor: grade.color,
    typeName: userType.name,
    rankings: detailedRankings,
    categories: result.categories,
    maxCategoryName: maxCategory.name,
    minCategoryName: minCategory.name,
  });

  return (
    <div className="w-full min-h-screen relative">
      {/* Animated background for S grade */}
      {isTopRank && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at center, ${grade.glow} 0%, transparent 70%)`,
            }}
            animate={{
              opacity: [0, 0.3, 0],
              scale: [0.8, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      )}

      <div
        className="max-w-2xl mx-auto px-6 py-6 relative z-10 min-h-screen flex flex-col justify-center"
        style={{ background: "#000000" }}
      >
        {/* Compact Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          {/* Score */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[40px] sm:text-[56px] font-bold mb-2 tracking-[-0.03em]"
            style={{
              color: grade.color,
              textShadow: `0 0 40px ${grade.glow}`,
            }}
          >
            <span className="text-[20px] text-white/35 mr-2">나는</span>
            {((result.total / 125) * 10).toFixed(2)}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[18px] text-white/65 mb-3"
          >
            의 {gender === "male" ? "남자" : "여자"}입니다
          </motion.div>

          {/* 유형명 + 희귀 뱃지 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-[16px] sm:text-[19px] font-bold mb-3"
            style={{
              background: isTopRank
                ? `linear-gradient(135deg, ${grade.color}30, ${grade.color}50)`
                : `${grade.color}20`,
              border: `2px solid ${grade.color}`,
              color: grade.color,
            }}
          >
            <grade.icon className="w-5 h-5" strokeWidth={2} />
            <span>{userType.name}</span>
          </motion.div>

          {/* 유형 설명 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="text-[13px] text-white/50 mb-3 px-2"
          >
            {userType.desc}
          </motion.div>

          {/* Percentile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-[15px] text-white/80 mb-6"
          >
            전국 기준{" "}
            <strong style={{ color: grade.color }}>
              상위 {adjustedPercentile}%
            </strong>
          </motion.div>
        </motion.div>

        {/* 100명 시각화 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="rounded-[20px] p-4 mb-4"
          style={{
            background: "var(--glass-bg)",
            border: `1px solid ${isTopRank ? grade.color + "40" : "var(--glass-border)"}`,
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="text-[13px] text-white/45 uppercase tracking-wider mb-3 text-center">
            100명 중 당신의 위치
          </div>
          <div className="grid grid-cols-10 gap-1 sm:gap-1.5 max-w-md mx-auto">
            {Array.from({ length: 100 }).map((_, i) => {
              // percentile이 8이면 상위 8%이므로 100명 중 8번째
              // 배열 인덱스는 0부터 시작하므로 인덱스 7
              const userPosition = Math.max(
                0,
                Math.min(99, Math.floor(adjustedPercentile) - 1),
              );
              const isUser = i === userPosition;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.003 }}
                  className="relative"
                >
                  <User
                    className={`w-full h-auto ${isUser ? "drop-shadow-lg" : ""}`}
                    strokeWidth={isUser ? 2.5 : 1.5}
                    style={{
                      color: isUser ? grade.color : "rgba(255, 255, 255, 0.15)",
                    }}
                  />
                  {isUser && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                      style={{ background: grade.color }}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
          <div className="text-[12px] text-white/60 text-center mt-3">
            밝게 표시된 사람이 당신입니다 (상위 {adjustedPercentile}%: 100명 중{" "}
            {Math.floor(adjustedPercentile)}번째)
          </div>
        </motion.div>

        {/* 세분화 순위 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68 }}
          className="rounded-[20px] p-4 mb-4"
          style={{
            background: "var(--glass-bg)",
            border: `1px solid ${isTopRank ? grade.color + "40" : "var(--glass-border)"}`,
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="text-[13px] text-white/45 uppercase tracking-wider mb-3 text-center">
            세분화 순위
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                <span className="text-[14px] text-white/80">전국</span>
              </div>
              <div
                className="text-[16px] font-semibold"
                style={{ color: grade.color }}
              >
                상위 {detailedRankings.national.toFixed(1)}%
              </div>
            </div>
            {detailedRankings.region !== undefined &&
              detailedRankings.region !== null && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin
                      className="w-4 h-4 text-white/60"
                      strokeWidth={1.5}
                    />
                    <span className="text-[14px] text-white/80">지역별</span>
                  </div>
                  <div
                    className="text-[16px] font-semibold"
                    style={{ color: grade.color }}
                  >
                    상위 {detailedRankings.region.toFixed(1)}%
                  </div>
                </div>
              )}
            {detailedRankings.ageGroup !== undefined &&
              detailedRankings.ageGroup !== null && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarDays
                      className="w-4 h-4 text-white/60"
                      strokeWidth={1.5}
                    />
                    <span className="text-[14px] text-white/80">연령대별</span>
                  </div>
                  <div
                    className="text-[16px] font-semibold"
                    style={{ color: grade.color }}
                  >
                    상위 {detailedRankings.ageGroup.toFixed(1)}%
                  </div>
                </div>
              )}
          </div>
          <div style={{ margin: "10px 0" }}></div>
        </motion.div>
        {/* Radar Chart - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="rounded-[20px] p-4 mb-4 w-full"
          style={{
            background: "var(--glass-bg)",
            border: `1px solid ${isTopRank ? grade.color + "40" : "var(--glass-border)"}`,
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="text-[11px] text-white/45 uppercase tracking-wider mb-1 text-center">
            역량 분석
          </div>

          <div className="mx-auto w-full max-w-[380px] aspect-square">
            <ResultRadarChart
              categories={result.categories}
              color={grade.color}
              fillOpacity={isTopRank ? 0.15 : 0.25}
            />
          </div>
        </motion.div>

        {/* 카테고리별 상세 피드백 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.82 }}
          className="space-y-2 mb-4"
        >
          <div className="text-[11px] text-white/40 uppercase tracking-wider mb-2 text-center">
            카테고리 분석
          </div>
          {categoryCards.map((card, i) => (
            <div
              key={card.key}
              className="rounded-[14px] p-3"
              style={{
                background:
                  card.tier === "high"
                    ? `${grade.color}12`
                    : card.tier === "low"
                      ? "rgba(255,107,107,0.08)"
                      : "var(--glass-bg)",
                border:
                  card.tier === "high"
                    ? `1px solid ${grade.color}30`
                    : card.tier === "low"
                      ? "1px solid rgba(255,107,107,0.2)"
                      : "1px solid var(--glass-border)",
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] font-semibold text-white">
                      {card.label}
                    </span>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        background:
                          card.tier === "high"
                            ? `${grade.color}30`
                            : card.tier === "low"
                              ? "rgba(255,107,107,0.2)"
                              : "rgba(255,255,255,0.1)",
                        color:
                          card.tier === "high"
                            ? grade.color
                            : card.tier === "low"
                              ? "#ff6b6b"
                              : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {card.title}
                    </span>
                  </div>
                  <div className="text-[12px] text-white/65 leading-relaxed">
                    {card.message}
                  </div>
                  <div className="text-[11px] text-white/40 mt-1">
                    {card.action}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div
                    className="text-[15px] font-bold"
                    style={{
                      color:
                        card.tier === "high"
                          ? grade.color
                          : card.tier === "low"
                            ? "#ff6b6b"
                            : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {Math.round(card.lv * 100)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* 전략 + 순위 시뮬레이션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="space-y-2 mb-4"
        >
          <div
            className="rounded-[14px] p-3"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
            }}
          >
            <div className="flex items-start gap-2">
              <TrendingUp
                className="w-4 h-4 text-white/80 flex-shrink-0 mt-0.5"
                strokeWidth={1.5}
              />
              <div>
                <div className="text-[13px] font-medium text-white mb-0.5">
                  나만의 전략
                </div>
                <div className="text-[12px] text-white/65">{strategy}</div>
              </div>
            </div>
          </div>

          <div
            className="rounded-[14px] p-3"
            style={{
              background: `${grade.color}10`,
              border: `1px solid ${grade.color}25`,
            }}
          >
            <div className="flex items-start gap-2">
              <Target
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                style={{ color: grade.color }}
                strokeWidth={1.5}
              />
              <div>
                <div className="text-[13px] font-medium text-white mb-0.5">
                  📈 순위 상승 시뮬레이션
                </div>
                <div className="text-[12px] text-white/70">
                  <span className="text-white/50">
                    {CATEGORY_LABEL[minKey]}
                  </span>
                  을 1단계 개선하면
                </div>
                <div
                  className="text-[14px] font-bold mt-1"
                  style={{ color: grade.color }}
                >
                  상위 {adjustedPercentile}% → 상위 {rankSim.improvedPct}%
                  <span className="text-[12px] font-normal text-white/50 ml-2">
                    ({rankSim.rise}% 상승)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Share Buttons - Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
          className="space-y-3"
        >
          {/* 빠른 공유 버튼 그리드 */}
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleKakaoShare}
              disabled={isCapturing}
              className="py-3.5 rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all duration-300"
              style={{
                background: "#FEE500",
                color: "#3A1D1D",
              }}
            >
              <MessageCircle className="w-4 h-4" />
              <span>카카오톡</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleInstagramShare}
              disabled={isCapturing}
              className="py-3.5 rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all duration-300"
              style={{
                background:
                  "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                color: "white",
                boxShadow: "0 4px 15px rgba(220, 39, 67, 0.3)",
              }}
            >
              {isCapturing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <InstagramIcon className="w-4 h-4" />
              )}
              <span>인스타 스토리</span>
            </motion.button>
          </div>

          {/* 이미지 저장 */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleQuickDownload}
            disabled={isSaving}
            className="w-full py-3.5 rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "white",
            }}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" strokeWidth={2} />
            )}
            <span>결과 이미지 저장</span>
          </motion.button>

          {/* 내가 전국에서 몇등인지 확인해보세요! */}
          <Link to="/leaderboard" className="block w-full">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                logGAEvent(
                  "check_leaderboard_clicked",
                  "engagement",
                  "Quick Actions",
                );
                logUserEvent("check_leaderboard_clicked", {
                  source: "result_page",
                });
              }}
              className="w-full py-4 rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2 text-white transition-all duration-300 active:scale-[0.98]"
              style={{
                background:
                  "linear-gradient(90deg, #8A2387 0%, #E94057 50%, #F27121 100%)",
                boxShadow: "0 4px 15px rgba(233, 64, 87, 0.4)",
              }}
            >
              <span>🏆 내가 전국에서 몇등인지 확인해보세요!</span>
            </motion.button>
          </Link>

          {/* 더 많은 공유 옵션 */}
          <button
            onClick={() => {
              logGAEvent("more_shares_clicked", "engagement", "Quick Actions");
              logUserEvent("more_shares_clicked", { source: "result_page" });
              handleShare();
            }}
            className="w-full py-2 text-[13px] text-white/65 hover:text-white transition-colors"
          >
            더 많은 공유 옵션 →
          </button>

          <button
            onClick={() => {
              logGAEvent("restart_clicked", "engagement", "Quick Actions");
              logUserEvent("restart_clicked", { source: "result_page" });
              onRestart();
            }}
            className="w-full py-2 text-[13px] text-white/45 hover:text-white/65 transition-colors"
          >
            다시 테스트하기
          </button>
        </motion.div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        resultData={{
          percentile: adjustedPercentile,
          grade: result.grade,
          gender: gender!,
          gradeConfig: grade,
          userType: userType.name,
          imageData: getResultImageData(),
        }}
      />

      {/* 순위 변동 알림 */}
      <AnimatePresence>
        {showRankChange && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-6"
          >
            <div
              className="p-5 rounded-[20px] shadow-2xl"
              style={{
                background: "rgba(0, 0, 0, 0.9)",
                border: "2px solid rgba(255, 107, 107, 0.5)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp
                  size={20}
                  strokeWidth={2}
                  className="text-red-400"
                />
                <span className="text-[16px] font-bold text-white">
                  순위가 소폭 변동했어요
                </span>
              </div>
              <div className="text-[14px] text-white/80 mb-1">
                상위{" "}
                <span className="text-red-400 font-semibold">
                  {adjustedPercentile}%
                </span>
                {" → "}
                <span className="text-red-400 font-semibold">
                  {newPercentile}%
                </span>
                로 조정됐어요
              </div>
              <div className="text-[12px] text-white/50 mt-2">
                지금 공유하지 않으면 순위가 더 내려갈 수 있어요
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 모바일 이미지 길게 눌러 저장 유도 모달 */}
      <AnimatePresence>
        {mobileSaveImage && mobileSaveContext && (
          <MobileSaveModal
            imageUrl={mobileSaveImage}
            context={mobileSaveContext}
            onClose={closeMobileSaveModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
