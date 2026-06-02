import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, ArrowRight, X } from 'lucide-react';


interface AdditionalInfoScreenProps {
  onComplete: (info: { region: string | null; ageGroup: string | null }) => void;
  onSkip: () => void;
  preselectedAgeGroup?: string | null;
}

const regions = [
  '서울',
  '경기',
  '인천',
  '부산',
  '대구',
  '광주',
  '대전',
  '울산',
  '세종',
  '강원',
  '충북',
  '충남',
  '전북',
  '전남',
  '경북',
  '경남',
  '제주',
];


export default function AdditionalInfoScreen({ onComplete, onSkip, preselectedAgeGroup }: AdditionalInfoScreenProps) {
  const [region, setRegion] = useState<string | null>(null);
  const [ageGroup, setAgeGroup] = useState<string | null>(preselectedAgeGroup || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    onComplete({ region, ageGroup });
  };

  return (
    <div className="w-full min-h-screen overflow-y-auto relative" style={{ background: '#000000' }}>
      {/* Background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[2px] h-[2px] bg-blue-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
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
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12 relative z-10">
        {/* Skip button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={onSkip}
          className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all text-[14px]"
        >
          <span>건너뛰기</span>
          <X className="w-4 h-4" />
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-[42px] font-bold text-white mb-4">
            더 정확한 순위를 위해
          </h1>
          <p className="text-[18px] text-white/70">
            거주 지역을 선택하면 세분화된 지역 순위를 확인할 수 있어요
            <br />
            <span className="text-[15px] text-white/50">(선택사항)</span>
          </p>
        </motion.div>

        {/* Region Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
            <h2 className="text-[21px] font-semibold text-white">지역</h2>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {regions.map((r) => (
              <motion.button
                key={r}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRegion(r)}
                className="py-3 px-4 rounded-[12px] text-[15px] font-medium transition-all"
                style={{
                  background: region === r ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                  border: region === r ? '2px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: region === r ? '#60A5FA' : 'rgba(255, 255, 255, 0.7)',
                }}
              >
                {r}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <motion.button
            whileHover={isSubmitting ? {} : { scale: 1.02 }}
            whileTap={isSubmitting ? {} : { scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-5 rounded-full font-bold text-[18px] flex items-center justify-center gap-3"
            style={{
              background: isSubmitting
                ? 'rgba(255, 255, 255, 0.15)'
                : region
                  ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)'
                  : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: region && !isSubmitting ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            {isSubmitting ? (
              <>
                <motion.span
                  className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
                <span>로딩 중...</span>
              </>
            ) : (
              <>
                <span>{region ? '정확한 순위 확인하기' : '이대로 확인하기'}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>

          {!region ? (
            <p className="text-center text-[13px] text-white/50 mt-3">
              선택하지 않아도 전국 및 연령별 순위는 확인할 수 있어요
            </p>
          ) : null}
        </motion.div>

        {/* Info message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-[16px]"
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
          }}
        >
          <div className="flex items-start gap-3">
            <div className="text-[18px]">💡</div>
            <div className="flex-1 text-[13px] text-white/70">
              거주 지역을 선택하면 더 세분화된 지역 순위를 확인할 수 있어요.
              <br />
              예: 전국 7% → 서울 4.8%
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
