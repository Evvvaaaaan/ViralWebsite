import { useEffect, useState } from "react";
import { color, motion } from "motion/react";
import { Link } from "react-router";
import {
  getTotalParticipants,
  incrementParticipants,
  getCurrentOnlineUsers,
} from "../utils/engagement";
import EngagementToast from "./EngagementToast";
import { logGAEvent } from "../utils/analytics";
import { logUserEvent } from "../utils/apiClient";

interface LandingScreenProps {
  onStart: () => void;
}

export default function LandingScreen({ onStart }: LandingScreenProps) {
  const [liveCount, setLiveCount] = useState(0);

  const handleStart = () => {
    logGAEvent("quiz_start_clicked", "engagement", "Landing Screen");
    logUserEvent("quiz_start_clicked", { source: "landing_button" });
    onStart();
  };
  const [participants, setParticipants] = useState(0);
  const [displayParticipants, setDisplayParticipants] = useState(0);

  // 초기화
  useEffect(() => {
    const total = incrementParticipants();
    setParticipants(total);
    setLiveCount(getCurrentOnlineUsers());

    // 카운트업 애니메이션 (보고서 명세: 1.8초)
    let start = 0;
    const duration = 1800; // 1.8초
    const increment = total / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= total) {
        setDisplayParticipants(total);
        clearInterval(timer);
      } else {
        setDisplayParticipants(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, []);

  // 시간대별 접속자 수 업데이트 (보고서 명세: 5초마다 ±2~5 변동)
  useEffect(() => {
    const interval = setInterval(() => {
      const base = getCurrentOnlineUsers();
      const variation = Math.floor(Math.random() * 8) - 2; // -2 ~ +5
      setLiveCount(Math.max(5, base + variation));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // 보고서 명세: 실시간 결과 피드 - 지역 + 성별 + 결과
  const generateRecentResults = () => {
    const feed = [];
    const regions = [
      "서울",
      "경기",
      "부산",
      "인천",
      "대구",
      "광주",
      "대전",
      "울산",
      "강원",
      "제주",
    ];
    const genders = ["남성", "여성"];

    for (let i = 0; i < 12; i++) {
      const region = regions[Math.floor(Math.random() * regions.length)];
      const gender = genders[Math.floor(Math.random() * genders.length)];
      const percentile = Math.floor(Math.random() * 100) + 1;
      const action =
        percentile <= 5 ? "달성" : percentile <= 50 ? "판정" : "확인";

      feed.push(`${region} · ${gender} · 상위 ${percentile}% ${action}`);
    }

    return feed;
  };

  const recentResults = generateRecentResults();

  return (
    <div className="w-full min-h-screen relative overflow-hidden flex flex-col">
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex gap-4 text-[13px]"
      >
        <Link
          to="/leaderboard"
          className="text-white/65 hover:text-white transition-colors"
        >
          리더보드
        </Link>
        <Link
          to="/about"
          className="text-white/65 hover:text-white transition-colors"
        >
          소개
        </Link>
        <Link
          to="/stats"
          className="text-white/65 hover:text-white transition-colors"
        >
          통계
        </Link>
      </motion.div>

      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
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

      {/* Glassmorphic LYRA LAB Logo Backdrop */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-0">
        <motion.img
          src="/og_thumbnail.png"
          alt="LYRA LAB Logo"
          className="w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] object-contain rounded-[40px] shadow-[0_0_80px_rgba(255,255,255,0.05)] border border-white/10"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 text-[13px] tracking-wide">
            <motion.span
              className="w-2 h-2 rounded-full bg-red-500"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-white/65">LIVE</span>
            <span className="text-white/45">{liveCount}명 참여 중</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <h1
            className="text-[32px] sm:text-[40px] md:text-[48px] font-semibold leading-[1.07] mb-4"
            style={{
              letterSpacing: "-0.025em",
              textShadow: "0 0 80px rgba(99, 102, 241, 0.4)",
            }}
          >
            <span className="text-white">나는 7의</span>
            <br />
            <span className="text-white">
              <span style={{ color: "var(--action-blue)" }}>남</span> ·{" "}
              <span style={{ color: "var(--action-pink)" }}>여자</span>
              인가
            </span>
            <span>?</span>
          </h1>
          <p className="text-[15px] sm:text-[17px] text-white/65 leading-[1.6] tracking-[-0.01em]">
            25개의 문항으로 확인하는
            <br />
            대한민국 실시간 순위 테스트
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-md mb-8 overflow-hidden"
        >
          <div className="relative h-8 overflow-hidden">
            <motion.div
              className="flex gap-6 absolute whitespace-nowrap text-[13px] text-white/35"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {[...recentResults, ...recentResults].map((result, i) => (
                <span key={i}>{result}</span>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12 text-[14px] sm:text-[15px]"
        >
          <div className="text-center">
            <div className="text-white font-medium">
              {displayParticipants.toLocaleString()}
            </div>
            <div className="text-white/45 text-[13px]">참여자</div>
          </div>
          <div className="w-[1px] h-8 bg-white/15" />
          <div className="text-center">
            <div className="text-white font-medium">25</div>
            <div className="text-white/45 text-[13px]">문항</div>
          </div>
          <div className="w-[1px] h-8 bg-white/15" />
          <div className="text-center">
            <div className="text-white font-medium">3분</div>
            <div className="text-white/45 text-[13px]">소요시간</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center"
        >
          <motion.button
            onClick={handleStart}
            className="px-8 sm:px-12 py-3.5 sm:py-4 rounded-full bg-white text-black font-bold text-[17px] tracking-[-0.01em] shadow-xl max-w-[360px] w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            animate={{ scale: [1, 1.015, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              boxShadow: "0 20px 60px rgba(255, 255, 255, 0.2)",
            }}
          >
            지금 내 순위 확인 →
          </motion.button>
          <p className="text-[13px] text-white/35 mt-3 tracking-wide">
            무료 · 익명 · 30초 완성
          </p>
        </motion.div>
      </div>

      {/* Engagement Toast */}
      <EngagementToast />
    </div>
  );
}
