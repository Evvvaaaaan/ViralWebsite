import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Crown, Diamond, Star, Sparkles, BarChart3, Sprout, Gem, Target, TrendingUp, Share2, MessageCircle, User, UserCircle, Dumbbell, Wallet, Users, Compass, Brain, MapPin, CalendarDays } from 'lucide-react';
import type { Gender } from '../types';
import confetti from 'canvas-confetti';
import ShareModal from './ShareModal';
import { Link } from 'react-router';

// 카테고리별 유형명 매핑
const categoryTypes: Record<string, { adjective: string; noun: string }> = {
  selfCare: { adjective: '건강한', noun: '관리자' },
  economy: { adjective: '똑똑한', noun: '재테크형' },
  social: { adjective: '따뜻한', noun: '소셜형' },
  lifestyle: { adjective: '감각적인', noun: '라이프러' },
  mindset: { adjective: '강인한', noun: '성장형' },
};

// 유형명 생성 함수
function generateTypeName(categories: Record<string, number>): { name: string; rarity: number } {
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
    color: '#f5a623',
    glow: 'rgba(245, 166, 35, 0.5)',
    label: '전설',
    icon: Crown,
    message: '전국 상위 1%. 당신 같은 사람, 100명 중 1명입니다.',
  },
  A: {
    color: '#7b68ee',
    glow: 'rgba(123, 104, 238, 0.3)',
    label: '탁월',
    icon: Diamond,
    message: '전국 상위 5%. 매우 뛰어난 수준입니다.',
  },
  B: {
    color: '#00d4aa',
    glow: 'rgba(0, 212, 170, 0.25)',
    label: '이상형급',
    icon: Star,
    message: '전국 상위 15%. 이상형에 가까운 수준입니다.',
  },
  C: {
    color: '#4fc3f7',
    glow: 'rgba(79, 195, 247, 0.2)',
    label: '평균 이상',
    icon: Sparkles,
    message: '전국 평균 이상. 좋은 수준입니다.',
  },
  D: {
    color: '#aaaaaa',
    glow: 'rgba(170, 170, 170, 0.15)',
    label: '평범',
    icon: BarChart3,
    message: '전국 평균 수준입니다.',
  },
  F: {
    color: '#ff6b6b',
    glow: 'rgba(255, 107, 107, 0.2)',
    label: '성장 중',
    icon: Sprout,
    message: '지금이 시작점이에요. 함께 성장해봐요.',
  },
};

export default function ResultScreen({ result, gender, onRestart }: ResultScreenProps) {
  const [displayPercentile, setDisplayPercentile] = useState(0);
  const [showParticles, setShowParticles] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [showRankChange, setShowRankChange] = useState(false);
  const [newPercentile, setNewPercentile] = useState(result.percentile);
  const grade = gradeConfig[result.grade as keyof typeof gradeConfig];
  const isTopRank = result.grade === 'S';

  // 유형명 생성
  const userType = generateTypeName(result.categories);

  // 세분화 순위 - 서버에서 받은 실제 순위 사용
  const detailedRankings = result.rankings || {
    national: result.percentile,
    region: Math.max(0.1, result.percentile * 0.7),
    ageGroup: Math.max(0.1, result.percentile * 0.45),
  };

  // 순위 변동 알림 (30-90초 후)
  useEffect(() => {
    // 보고서 명세: 30~90초 랜덤 딜레이 후
    const delay = Math.floor(Math.random() * 60000) + 30000; // 30-90초

    const timer = setTimeout(() => {
      // 보고서 명세: 순위 소폭 하락 (0.05 ~ 0.15% 증가)
      const increase = (Math.random() * 0.1 + 0.05).toFixed(2);
      const updated = parseFloat((result.percentile + parseFloat(increase)).toFixed(2));
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

  const handleKakaoShare = () => {
    // Quick share without modal
    const shareUrl = `${window.location.origin}?challenge=true`;
    const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}`;
    window.open(kakaoUrl, '_blank', 'width=600,height=600');
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
          colors: ['#f5a623', '#ffd700', '#ffed4e', '#ffa500'],
          gravity: 0.8,
          scalar: 1.2,
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 80,
          origin: { x: 1, y: 0.5 },
          colors: ['#f5a623', '#ffd700', '#ffed4e', '#ffa500'],
          gravity: 0.8,
          scalar: 1.2,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        } else {
          setShowParticles(false);
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

  const radarData = [
    { category: '자기관리', value: result.categories.selfCare },
    { category: '경제력', value: result.categories.economy },
    { category: '사회성', value: result.categories.social },
    { category: '라이프', value: result.categories.lifestyle },
    { category: '마인드셋', value: result.categories.mindset },
  ];

  const categoryScores = [
    { name: '자기관리', icon: Dumbbell, score: result.categories.selfCare },
    { name: '경제력', icon: Wallet, score: result.categories.economy },
    { name: '사회성', icon: Users, score: result.categories.social },
    { name: '라이프스타일', icon: Compass, score: result.categories.lifestyle },
    { name: '마인드셋', icon: Brain, score: result.categories.mindset },
  ];

  const maxCategory = categoryScores.reduce((max, cat) =>
    cat.score > max.score ? cat : max
  );
  const minCategory = categoryScores.reduce((min, cat) =>
    cat.score < min.score ? cat : min
  );

  return (
    <div className="size-full overflow-y-auto relative">
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
              ease: 'easeInOut',
            }}
          />
        </div>
      )}

      <div className="max-w-2xl mx-auto px-6 py-6 relative z-10 min-h-screen flex flex-col justify-center" style={{ background: '#000000' }}>
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
            className="text-[56px] font-bold mb-2 tracking-[-0.03em]"
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
            의 {gender === 'male' ? '남자' : '여자'}입니다
          </motion.div>

          {/* 유형명 + 희귀 뱃지 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[19px] font-bold mb-3"
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
            <span className="text-[14px] opacity-90">(전체 {userType.rarity}%)</span>
          </motion.div>

          {/* Percentile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-[15px] text-white/80 mb-6"
          >
            전국 기준 <strong style={{ color: grade.color }}>상위 {result.percentile}%</strong>
          </motion.div>
        </motion.div>

        {/* 100명 시각화 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="rounded-[20px] p-4 mb-4"
          style={{
            background: 'var(--glass-bg)',
            border: `1px solid ${isTopRank ? grade.color + '40' : 'var(--glass-border)'}`,
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="text-[13px] text-white/45 uppercase tracking-wider mb-3 text-center">
            100명 중 당신의 위치
          </div>
          <div className="grid grid-cols-10 gap-1.5 max-w-md mx-auto">
            {Array.from({ length: 100 }).map((_, i) => {
              // percentile이 8이면 상위 8%이므로 100명 중 8번째
              // 배열 인덱스는 0부터 시작하므로 인덱스 7
              const userPosition = Math.max(0, Math.min(99, Math.floor(result.percentile) - 1));
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
                    className={`w-full h-auto ${isUser ? 'drop-shadow-lg' : ''}`}
                    strokeWidth={isUser ? 2.5 : 1.5}
                    style={{
                      color: isUser ? grade.color : 'rgba(255, 255, 255, 0.15)',
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
            밝게 표시된 사람이 당신입니다 (상위 {result.percentile}%: 100명 중 {Math.floor(result.percentile)}번째)
          </div>
        </motion.div>

        {/* 세분화 순위 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68 }}
          className="rounded-[20px] p-4 mb-4"
          style={{
            background: 'var(--glass-bg)',
            border: `1px solid ${isTopRank ? grade.color + '40' : 'var(--glass-border)'}`,
            backdropFilter: 'blur(16px)',
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
              <div className="text-[16px] font-semibold" style={{ color: grade.color }}>
                상위 {detailedRankings.national.toFixed(1)}%
              </div>
            </div>
            {detailedRankings.region !== undefined && detailedRankings.region !== null && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                  <span className="text-[14px] text-white/80">지역별</span>
                </div>
                <div className="text-[16px] font-semibold" style={{ color: grade.color }}>
                  상위 {detailedRankings.region.toFixed(1)}%
                </div>
              </div>
            )}
            {detailedRankings.ageGroup !== undefined && detailedRankings.ageGroup !== null && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                  <span className="text-[14px] text-white/80">연령대별</span>
                </div>
                <div className="text-[16px] font-semibold" style={{ color: grade.color }}>
                  상위 {detailedRankings.ageGroup.toFixed(1)}%
                </div>
              </div>
            )}
          </div>
          <div className="text-[11px] text-white/45 text-center mt-3">
            {detailedRankings.region !== null && detailedRankings.ageGroup !== null
              ? '더 세분화할수록 희소해집니다'
              : '추가 정보를 입력하면 더 정확한 순위를 확인할 수 있어요'}
          </div>
        </motion.div>

        {/* Radar Chart - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="rounded-[20px] p-3 mb-4 w-full max-w-[360px] mx-auto"
          style={{
            background: 'var(--glass-bg)',
            border: `1px solid ${isTopRank ? grade.color + '40' : 'var(--glass-border)'}`,
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="text-[11px] text-white/45 uppercase tracking-wider mb-1 text-center">
            역량 분석
          </div>

          <div className="flex justify-center">
            <RadarChart data={radarData} width={320} height={320} margin={{ top: 5, right: 35, bottom: 5, left: 35 }}>
              <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fill: 'rgba(255, 255, 255, 0.65)', fontSize: 11 }}
              />
              <Radar
                dataKey="value"
                stroke={grade.color}
                fill={grade.color}
                fillOpacity={isTopRank ? 0.15 : 0.25}
                strokeWidth={2}
              />
            </RadarChart>
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
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
            }}
          >
            <div className="flex items-start gap-2">
              <Gem className="w-4 h-4 text-white/80 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
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
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
            }}
          >
            <div className="flex items-start gap-2">
              <Target className="w-4 h-4 text-white/80 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <div className="text-[13px] font-medium text-white">개선 포인트</div>
                <div className="text-[12px] text-white/65">
                  {minCategory.name}을 1단계만 높이면 순위가 크게 오릅니다
                </div>
              </div>
            </div>
          </div>

          <div
            className="rounded-[14px] p-3"
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
            }}
          >
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-white/80 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <div className="text-[13px] font-medium text-white">전략</div>
                <div className="text-[12px] text-white/65">
                  {maxCategory.name} 강점을 살려 {minCategory.name}을 보완하세요
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Share Buttons - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
          className="space-y-2"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShare}
            className="w-full py-3 rounded-full font-semibold text-[15px] flex items-center justify-center gap-2"
            style={{
              background: grade.color,
              color: 'white',
            }}
          >
            <Share2 className="w-4 h-4" strokeWidth={2} />
            <span>결과 공유하기</span>
          </motion.button>

          <button
            onClick={onRestart}
            className="w-full py-2 text-[13px] text-white/65 hover:text-white transition-colors"
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
          gender: gender,
          gradeConfig: grade,
          userType: userType,
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
                background: 'rgba(0, 0, 0, 0.9)',
                border: '2px solid rgba(255, 107, 107, 0.5)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp size={20} strokeWidth={2} className="text-red-400" />
                <span className="text-[16px] font-bold text-white">
                  순위가 소폭 변동했어요
                </span>
              </div>
              <div className="text-[14px] text-white/80 mb-1">
                상위 <span className="text-red-400 font-semibold">{result.percentile}%</span>
                {' → '}
                <span className="text-red-400 font-semibold">{newPercentile}%</span>로 조정됐어요
              </div>
              <div className="text-[12px] text-white/50 mt-2">
                지금 공유하지 않으면 순위가 더 내려갈 수 있어요
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}