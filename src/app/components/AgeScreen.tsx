import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarDays, Sparkles } from 'lucide-react';
import { logGAEvent } from '../utils/analytics';
import { logUserEvent } from '../utils/apiClient';

interface AgeScreenProps {
  onSelect: (ageGroup: string) => void;
}

const ageGroups = [
  { key: '10대', description: '학업 · 스마트폰 · 취침 위주 문항' },
  { key: '20~24세', description: '생활습관 · 저축 · 피부 위주 문항' },
  { key: '25~29세', description: '경제력 · 커리어 · 관계 위주 문항' },
  { key: '30~39세', description: '커리어 · 재테크 · 자아성장 문항' },
  { key: '40세 이상', description: '삶의 여유 · 건강 · 성숙 지표 문항' },
];

export default function AgeScreen({ onSelect }: AgeScreenProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const handleSelect = (key: string) => {
    setSelected(key);
    logGAEvent('age_selected', 'engagement', key);
    logUserEvent('age_selected', { ageGroup: key });
    setTimeout(() => {
      onSelect(key);
    }, 450);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden"
      style={{
        background: 'var(--cosmic-deep)',
        transition: 'background 0.4s ease',
      }}
    >
      {/* Background glowing gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[20%] -left-[20%] w-[80%] aspect-square rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, var(--cosmic-indigo) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-[20%] -right-[20%] w-[80%] aspect-square rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, var(--cosmic-pink) 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-md w-full relative z-10 text-center mb-8 sm:mb-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] bg-white/5 border border-white/10 text-white/60 mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>통계 정밀화 단계</span>
        </motion.div>
        <h2 className="text-[28px] sm:text-[34px] font-semibold text-white tracking-[-0.025em] leading-snug">
          연령대를 알려주세요
        </h2>
        <p className="text-[14px] sm:text-[16px] text-white/50 mt-2">
          연령대에 맞는 맞춤형 질문과 점수 통계가 매핑됩니다.
        </p>
      </div>

      {/* 연령대 선택 그리드 카드 */}
      <div className="max-w-md w-full relative z-10 space-y-3.5">
        {ageGroups.map((group, idx) => {
          const isSelected = selected === group.key;
          const isHovered = hovered === group.key;

          return (
            <motion.button
              key={group.key}
              onClick={() => handleSelect(group.key)}
              onMouseEnter={() => setHovered(group.key)}
              onMouseLeave={() => setHovered(null)}
              disabled={selected !== null}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="w-full text-left px-5 py-4 sm:px-6 sm:py-5 rounded-2xl transition-all duration-300 relative overflow-hidden flex items-center justify-between border select-none pointer-events-auto"
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(255,100,150,0.1) 100%)'
                  : isHovered
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(255, 255, 255, 0.02)',
                borderColor: isSelected
                  ? 'rgba(99, 102, 241, 0.6)'
                  : isHovered
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(255, 255, 255, 0.06)',
                boxShadow: isSelected
                  ? '0 0 20px rgba(99, 102, 241, 0.2)'
                  : 'none',
              }}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                  style={{
                    background: isSelected
                      ? 'var(--cosmic-indigo)'
                      : 'rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <CalendarDays className="w-5 h-5 text-white/80" strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-[17px] font-bold text-white mb-0.5">
                    {group.key}
                  </h4>
                  <p className="text-[12px] text-white/45">
                    {group.description}
                  </p>
                </div>
              </div>

              {/* Check indicator */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[11px] font-bold z-10"
                  >
                    ✓
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Glowing ripple on select */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0.3 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 60%)',
                    }}
                  />
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
