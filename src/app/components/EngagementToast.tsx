import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Sparkles, Zap, Trophy, Flame, Users, Star } from 'lucide-react';

interface ToastMessage {
  id: string;
  message: string;
  icon: React.ReactNode;
}

// 보고서 명세: 4가지 유형의 활동 알림 메시지
const messageTypes = {
  // 유형 1: 결과 달성 알림 (가장 효과적)
  achievement: [
    { message: '경기도 남성 · 방금 상위 4.2% 달성', icon: <Trophy size={16} strokeWidth={2} className="text-yellow-400" /> },
    { message: '서울 여성 · 방금 상위 11.7% 판정', icon: <Trophy size={16} strokeWidth={2} className="text-yellow-400" /> },
    { message: '부산 남성 · 방금 상위 3.8% 달성', icon: <Trophy size={16} strokeWidth={2} className="text-yellow-400" /> },
    { message: '인천 여성 · 방금 상위 7.3% 판정', icon: <Trophy size={16} strokeWidth={2} className="text-yellow-400" /> },
  ],
  
  // 유형 2: 유행 압박 문구
  trending: [
    { message: '오늘 벌써 2,847명이 확인했어요', icon: <Flame size={16} strokeWidth={2} className="text-orange-400" /> },
    { message: '지금 이 시간 가장 많이 공유되는 중', icon: <Flame size={16} strokeWidth={2} className="text-orange-400" /> },
  ],
  
  // 유형 3: 희소성 자극
  scarcity: [
    { message: '오늘 상위 1% 달성자: 23명', icon: <Star size={16} strokeWidth={2} className="text-yellow-300" /> },
    { message: '방금 전설 등급(상위 1%) 판정이 나왔어요', icon: <Star size={16} strokeWidth={2} className="text-yellow-300" /> },
  ],
  
  // 유형 4: 사회적 증거
  social: [
    { message: '친구 링크로 접속한 사람이 많아요', icon: <Users size={16} strokeWidth={2} className="text-blue-400" /> },
    { message: '지금 단체로 도전 중인 팀이 있어요', icon: <Users size={16} strokeWidth={2} className="text-blue-400" /> },
  ],
};

// 모든 메시지를 평탄화
const allMessages = [
  ...messageTypes.achievement,
  ...messageTypes.trending,
  ...messageTypes.scarcity,
  ...messageTypes.social,
];

export default function EngagementToast() {
  const [currentToast, setCurrentToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    const scheduleNext = () => {
      // 보고서 명세: 15~45초 랜덤 간격
      const delay = Math.floor(Math.random() * 30000) + 15000;

      return setTimeout(() => {
        // 랜덤 메시지 선택
        const randomMessage = allMessages[Math.floor(Math.random() * allMessages.length)];
        const toast = {
          id: `toast-${Date.now()}`,
          ...randomMessage,
        };

        setCurrentToast(toast);

        // 보고서 명세: 3.5초 후 사라짐
        setTimeout(() => {
          setCurrentToast(null);
        }, 3500);

        // 다음 토스트 스케줄
        scheduleNext();
      }, delay);
    };

    const timer = scheduleNext();
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {currentToast && (
        <motion.div
          key={currentToast.id}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 pointer-events-none"
        >
          <div
            className="flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl"
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(16px)',
            }}
          >
            {currentToast.icon}
            <span className="text-[14px] font-medium text-white">
              {currentToast.message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}