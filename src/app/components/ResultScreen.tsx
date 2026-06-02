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
} from 'lucide-react';
import type { Gender } from "../types";
import confetti from "canvas-confetti";
import ShareModal from "./ShareModal";
import { Link } from "react-router";
import { logGAEvent } from "../utils/analytics";
import { logUserEvent } from "../utils/apiClient";
import { createResultImageBlob, downloadImageBlob, isMobile, type ResultImageData } from "../utils/resultImage";
import InstagramIcon from "./InstagramIcon";
import MobileSaveModal from "./MobileSaveModal";

// 카테고리별 유형명 매핑
const categoryTypes: Record<string, { adjective: string; noun: string }> = {
  selfCare: { adjective: "건강한", noun: "관리자" },
  economy: { adjective: "똑똑한", noun: "재테크형" },
  social: { adjective: "따뜻한", noun: "소셜형" },
  lifestyle: { adjective: "감각적인", noun: "라이프형" },
  mindset: { adjective: "강인한", noun: "성장형" },
};

// 유형명 생성 함수
function generateTypeName(categories: Record<string, number>): {
  name: string;
  rarity: number;
} {
  const sorted = Object.entries(categories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2);

  const [first, second] = sorted;
  const firstType = categoryTypes[first[0]];
  const secondType = categoryTypes[second[0]];

  // 희귀도 계산 (두 카테고리의 평균 점수 기반)
  const avgScore = (first[1] + second[1]) / 2;
  const rarity = Math.max(0.1, Math.min(25, 26 - avgScore));

  return {
    name: `${firstType.adjective} ${secondType.noun}`,
    rarity: parseFloat(rarity.toFixed(1)),
  };
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
        const angle = -Math.PI / 2 + (Math.PI * 2 * index) / radarCategories.length;
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
  const [newPercentile, setNewPercentile] = useState(result.percentile);
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

  // 유형명 생성
  const userType = generateTypeName(result.categories);

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
        (result.percentile + parseFloat(increase)).toFixed(2),
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

      if (blob) {
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
            console.warn(
              "Instagram share failed, fallback to modal:",
              shareErr,
            );
          }
        }

        setMobileSaveImage(URL.createObjectURL(blob));
        setMobileSaveContext("instagram");
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
    const text = `나는 전국 상위 ${result.percentile}%! ${userType.name} 유형\n당신의 순위는?`;
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

      if (isMobile()) {
        const file = new File([blob], `순위테스트-결과-상위${result.percentile}%.png`, { type: "image/png" });
        if (
          navigator.share &&
          navigator.canShare &&
          navigator.canShare({ files: [file] })
        ) {
          try {
            await navigator.share({ files: [file], title: "전국 순위 테스트 결과" });
            return;
          } catch (shareErr) {
            if ((shareErr as Error).name === "AbortError") return;
          }
        }
        setMobileSaveImage(URL.createObjectURL(blob));
        setMobileSaveContext("save");
      } else {
        const fileName = `순위테스트-결과-상위${result.percentile}%-${Date.now()}.png`;
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
    const end = result.percentile;
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

          {/* Percentile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-[15px] text-white/80 mb-6"
          >
            전국 기준{" "}
            <strong style={{ color: grade.color }}>
              상위 {result.percentile}%
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
                Math.min(99, Math.floor(result.percentile) - 1),
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
            밝게 표시된 사람이 당신입니다 (상위 {result.percentile}%: 100명 중{" "}
            {Math.floor(result.percentile)}번째)
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
          <div className="text-[11px] text-white/45 text-center mt-3">
            {detailedRankings.region !== null &&
            detailedRankings.ageGroup !== null
              ? "더 세분화할수록 희소해집니다"
              : "추가 정보를 입력하면 더 정확한 순위를 확인할 수 있어요"}
          </div>
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

        {/* Insights - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.82 }}
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
              <Gem
                className="w-4 h-4 text-white/80 flex-shrink-0 mt-0.5"
                strokeWidth={1.5}
              />
              <div>
                <div className="text-[13px] font-medium text-white">강점</div>
                <div className="text-[12px] text-white/65">
                  {maxCategory.name}가 전국 상위 수준입니다
                </div>
              </div>
            </div>
          </div>

          <div
            className="rounded-[14px] p-3"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
            }}
          >
            <div className="flex items-start gap-2">
              <Target
                className="w-4 h-4 text-white/80 flex-shrink-0 mt-0.5"
                strokeWidth={1.5}
              />
              <div>
                <div className="text-[13px] font-medium text-white">
                  개선 포인트
                </div>
                <div className="text-[12px] text-white/65">
                  {minCategory.name}을 1단계만 높이면 순위가 크게 오릅니다
                </div>
              </div>
            </div>
          </div>

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
                <div className="text-[13px] font-medium text-white">전략</div>
                <div className="text-[12px] text-white/65">
                  {maxCategory.name} 강점을 살려 {minCategory.name}을 보완하세요
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
          percentile: result.percentile,
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
                  {result.percentile}%
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
