import { Link } from "react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  Users,
  BarChart3,
  CheckCircle2,
  Trophy,
  Zap,
  Target,
  Scale,
  TrendingUp,
  User,
} from "lucide-react";
import { getTotalParticipants, incrementParticipants, getCurrentOnlineUsers, generateMockFeed, getRelativeTime, type FeedItem } from '../utils/engagement';
import EngagementToast from '../components/EngagementToast';

export default function StatsPage() {
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [liveCount, setLiveCount] = useState(0);
  const [mockFeed, setMockFeed] = useState<FeedItem[]>([]);
  const [currentFeedIndex, setCurrentFeedIndex] = useState(0);

  // 초기화 및 누적 참여자 증가
  useEffect(() => {
    const newTotal = incrementParticipants();
    setTotalParticipants(newTotal);
    setLiveCount(getCurrentOnlineUsers());

    // 목 피드 생성
    const feed = generateMockFeed(50);
    setMockFeed(feed);
  }, []);

  // 시간대별 접속자 수 업데이트 (5초마다 소폭 변동)
  useEffect(() => {
    const interval = setInterval(() => {
      const base = getCurrentOnlineUsers();
      const variation = Math.floor(Math.random() * 11) - 5; // -5 ~ +5
      setLiveCount(Math.max(5, base + variation));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // 실시간 피드 자동 스크롤 (3-8초마다)
  useEffect(() => {
    if (mockFeed.length === 0) return;

    const scheduleNext = () => {
      const delay = Math.floor(Math.random() * 5000) + 3000; // 3-8초
      return setTimeout(() => {
        setCurrentFeedIndex(prev => (prev + 1) % mockFeed.length);
        scheduleNext();
      }, delay);
    };

    const timer = scheduleNext();
    return () => clearTimeout(timer);
  }, [mockFeed]);

  // Mock data - in production, this would come from Supabase
  const stats = {
    totalResponses: totalParticipants,
    averageScore: 5.82,
    topGrade: "C",
    completionRate: 78.4,
    categoryAverages: {
      selfCare: 3.2,
      economy: 2.8,
      social: 3.5,
      lifestyle: 3.1,
      mindset: 2.9,
    },
    gradeDistribution: {
      S: 1.2,
      A: 4.3,
      B: 12.8,
      C: 28.5,
      D: 35.2,
      F: 18.0,
    },
    genderSplit: {
      male: 52,
      female: 48,
    },
  };

  // 최근 5개 피드 아이템을 표시
  const recentFeed = mockFeed.slice(currentFeedIndex, currentFeedIndex + 5).concat(
    mockFeed.slice(0, Math.max(0, 5 - (mockFeed.length - currentFeedIndex)))
  ).slice(0, 5);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[2px] bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 20 - 10],
              x: [0, Math.random() * 20 - 10],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 text-[13px] tracking-wide mb-3">
                <motion.span
                  className="w-2 h-2 rounded-full bg-red-500"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-white/65">LIVE</span>
                <span className="text-white/45">
                  {liveCount}명 참여 중
                </span>
              </div>
              <h1
                className="font-semibold leading-tight text-[48px]"
                style={{
                  textShadow:
                    "0 0 80px rgba(99, 102, 241, 0.4)",
                }}
              >
                실시간 통계
              </h1>
            </div>
            <Link
              to="/"
              className="px-6 py-3 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform text-[13px]"
            >
              퀴즈 시작하기
            </Link>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <MetricCard
            label="총 참여자"
            value={stats.totalResponses.toLocaleString()}
            icon={
              <Users
                size={40}
                strokeWidth={1.5}
                className="text-blue-400"
              />
            }
            delay={0.1}
          />
          <MetricCard
            label="평균 점수"
            value={stats.averageScore.toFixed(2)}
            icon={
              <BarChart3
                size={40}
                strokeWidth={1.5}
                className="text-purple-400"
              />
            }
            delay={0.2}
          />
          <MetricCard
            label="완료율"
            value={`${stats.completionRate}%`}
            icon={
              <CheckCircle2
                size={40}
                strokeWidth={1.5}
                className="text-green-400"
              />
            }
            delay={0.3}
          />
          <MetricCard
            label="최다 등급"
            value={stats.topGrade}
            icon={
              <Trophy
                size={40}
                strokeWidth={1.5}
                className="text-yellow-400"
              />
            }
            delay={0.4}
          />
        </div>

        {/* Live Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-[24px] p-6 mb-8"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(16px)",
          }}
        >
          <h2 className="text-[24px] font-semibold mb-4 flex items-center gap-2">
            <Zap
              size={28}
              strokeWidth={1.5}
              className="text-yellow-400"
            />
            실시간 점수
          </h2>
          <div className="space-y-3">
            {recentFeed.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${item.gender === "남" ? "bg-blue-500/20" : "bg-pink-500/20"}`}
                  >
                    <User
                      size={20}
                      strokeWidth={1.5}
                      className={
                        item.gender === "남"
                          ? "text-blue-400"
                          : "text-pink-400"
                      }
                    />
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-white">
                      {item.region} · {item.gender} · 상위 {item.percentile}%
                    </div>
                    <div className="text-[12px] text-white/45">
                      {getRelativeTime(item.timestamp)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Grade Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-[24px] p-6"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(16px)",
            }}
          >
            <h2 className="text-[21px] font-semibold mb-6 flex items-center gap-2">
              <Target
                size={24}
                strokeWidth={1.5}
                className="text-blue-400"
              />
              등급 분포
            </h2>
            <div className="space-y-4">
              {Object.entries(stats.gradeDistribution).map(
                ([grade, percentage], idx) => (
                  <div key={grade}>
                    <div className="flex justify-between mb-2">
                      <span className="text-[15px] font-semibold">
                        등급 {grade}
                      </span>
                      <span className="text-[15px] text-white/65">
                        {percentage}%
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{
                          duration: 1,
                          delay: 0.8 + idx * 0.1,
                        }}
                        className="h-full rounded-full"
                        style={{
                          background: getGradeColor(grade),
                        }}
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
          </motion.div>

          {/* Gender Split */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="rounded-[24px] p-6"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(16px)",
            }}
          >
            <h2 className="text-[21px] font-semibold mb-6 flex items-center gap-2">
              <Scale
                size={24}
                strokeWidth={1.5}
                className="text-purple-400"
              />
              성별 분포
            </h2>
            <div className="flex items-center justify-around h-full">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9, type: "spring" }}
                  className="mb-4 flex justify-center"
                >
                  <div className="p-4 rounded-full bg-blue-500/20">
                    <User
                      size={48}
                      strokeWidth={1.5}
                      className="text-blue-400"
                    />
                  </div>
                </motion.div>
                <div className="text-[40px] font-bold text-blue-400">
                  {stats.genderSplit.male}%
                </div>
                <div className="text-[15px] text-white/65">
                  남성
                </div>
              </div>
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                  className="mb-4 flex justify-center"
                >
                  <div className="p-4 rounded-full bg-pink-500/20">
                    <User
                      size={48}
                      strokeWidth={1.5}
                      className="text-pink-400"
                    />
                  </div>
                </motion.div>
                <div className="text-[40px] font-bold text-pink-400">
                  {stats.genderSplit.female}%
                </div>
                <div className="text-[15px] text-white/65">
                  여성
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Category Averages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="rounded-[24px] p-6 mb-8"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(16px)",
          }}
        >
          <h2 className="text-[21px] font-semibold mb-6 flex items-center gap-2">
            <TrendingUp
              size={24}
              strokeWidth={1.5}
              className="text-green-400"
            />
            카테고리별 평균 점수
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(stats.categoryAverages).map(
              ([key, value], idx) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + idx * 0.1 }}
                  className="text-center p-4 rounded-xl"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <div className="text-[32px] font-bold text-blue-400 mb-1">
                    {value.toFixed(1)}
                  </div>
                  <div className="text-[13px] text-white/65">
                    {getCategoryName(key)}
                  </div>
                </motion.div>
              ),
            )}
          </div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <Link
            to="/"
            className="inline-block px-12 py-4 rounded-full bg-white text-black font-bold text-[17px] hover:scale-105 transition-transform"
            style={{
              boxShadow: "0 20px 60px rgba(255, 255, 255, 0.2)",
            }}
          >
            나도 참여하기 →
          </Link>
        </motion.div>
      </div>

      {/* Engagement Toast */}
      <EngagementToast />
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  delay,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-[20px] p-6 text-center"
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="mb-2 flex justify-center">{icon}</div>
      <div className="text-[13px] text-white/45 mb-1">
        {label}
      </div>
      <div className="text-[32px] font-bold">{value}</div>
    </motion.div>
  );
}

function getCategoryName(key: string): string {
  const names: Record<string, string> = {
    selfCare: "자기관리",
    economy: "경제력",
    social: "사회성",
    lifestyle: "라이프스타일",
    mindset: "마인드셋",
  };
  return names[key] || key;
}

function getGradeColor(grade: string): string {
  const colors: Record<string, string> = {
    S: "#FFD700",
    A: "#3B82F6",
    B: "#10B981",
    C: "#F59E0B",
    D: "#EF4444",
    F: "#6B7280",
  };
  return colors[grade] || "#6B7280";
}