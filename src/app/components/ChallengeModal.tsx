import { motion } from 'motion/react';
import { Trophy } from 'lucide-react';

interface ChallengeModalProps {
  onAccept: () => void;
}

export default function ChallengeModal({ onAccept }: ChallengeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-md w-full rounded-[24px] p-8 text-center"
        style={{
          background: 'var(--cosmic-surface)',
          border: '1px solid var(--glass-border)',
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <Trophy className="w-16 h-16 mx-auto mb-6 text-yellow-500" strokeWidth={1.5} />
        </motion.div>

        <h2 className="text-[28px] font-semibold text-white mb-4">
          친구의 도전장이 도착했어요!
        </h2>

        <p className="text-[17px] text-white/65 mb-8 leading-relaxed">
          친구가 당신에게 도전장을 보냈습니다.<br />
          과연 당신은 어느 정도일까요?
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAccept}
          className="w-full py-4 rounded-full font-semibold text-[17px]"
          style={{
            background: 'linear-gradient(135deg, var(--cosmic-indigo), var(--cosmic-pink))',
            color: 'white',
          }}
        >
          도전 받아들이기
        </motion.button>

        <p className="text-[13px] text-white/45 mt-4">
          25문항 · 약 3분 소요
        </p>
      </motion.div>
    </div>
  );
}
