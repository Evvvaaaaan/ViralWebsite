import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function LoadingScreen() {
  const [percentage, setPercentage] = useState(87);
  const [phase, setPhase] = useState<'chaos' | 'slowdown' | 'confirm'>('chaos');
  const [statusText, setStatusText] = useState('분석 시작');

  useEffect(() => {
    const statusTexts = [
      '응답 데이터 25개 수집 완료',
      '전국 15,847명 비교 데이터 로드 중...',
      '카테고리별 편차 분석 중...',
      '백분위 산출 완료 ✓',
    ];

    let textIndex = 0;
    const textInterval = setInterval(() => {
      if (textIndex < statusTexts.length) {
        setStatusText(statusTexts[textIndex]);
        textIndex++;
      }
    }, 400);

    const chaosInterval = setInterval(() => {
      setPercentage(Math.floor(Math.random() * 100));
    }, 80);

    setTimeout(() => {
      clearInterval(chaosInterval);
      setPhase('slowdown');

      const finalPercentage = 8;
      const slowdownValues = [23, 15, 11, finalPercentage];
      let slowdownIndex = 0;

      const slowdownInterval = setInterval(() => {
        if (slowdownIndex < slowdownValues.length) {
          setPercentage(slowdownValues[slowdownIndex]);
          slowdownIndex++;
        } else {
          clearInterval(slowdownInterval);
        }
      }, 150);
    }, 1800);

    setTimeout(() => {
      setPhase('confirm');
    }, 2300);

    return () => {
      clearInterval(chaosInterval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[1px] h-[1px] bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center opacity-50 pointer-events-none">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <motion.polygon
            points="100,30 170,80 140,160 60,160 30,80"
            fill="none"
            stroke="rgba(99, 102, 241, 0.5)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: phase === 'confirm' ? 1 : 0.5 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
          <motion.polygon
            points="100,30 170,80 140,160 60,160 30,80"
            fill="rgba(99, 102, 241, 0.15)"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'confirm' ? 1 : 0.3 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          />
        </svg>
      </div>

      <div className="relative z-10 text-center">
        <motion.div
          className="text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-4"
          style={{
            color: phase === 'confirm' ? 'var(--cosmic-indigo)' : 'white',
            filter: phase === 'chaos' ? 'blur(2px)' : 'blur(0px)',
            textShadow:
              phase === 'confirm'
                ? '0 0 40px rgba(99, 102, 241, 0.5)'
                : 'none',
            transition: 'all 0.3s',
          }}
          animate={{
            scale: phase === 'confirm' ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 0.5,
            times: [0, 0.5, 1],
          }}
        >
          {percentage}%
        </motion.div>

        <motion.div
          className="text-[13px] font-mono tracking-wider mb-8"
          style={{
            color: 'rgba(255, 255, 255, 0.45)',
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {statusText}
        </motion.div>

        <div className="flex gap-2 justify-center">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-white"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
