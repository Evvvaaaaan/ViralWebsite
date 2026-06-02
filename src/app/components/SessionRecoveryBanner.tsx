import { motion } from 'motion/react';
import { RefreshCw, X } from 'lucide-react';

interface SessionRecoveryBannerProps {
  progress: number;
  onResume: () => void;
  onDismiss: () => void;
}

export default function SessionRecoveryBanner({ progress, onResume, onDismiss }: SessionRecoveryBannerProps) {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="fixed top-6 left-6 right-6 z-40 max-w-md mx-auto"
    >
      <div
        className="rounded-[18px] p-4 flex items-center gap-4"
        style={{
          background: 'var(--cosmic-surface)',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <RefreshCw className="w-5 h-5 text-white/80 flex-shrink-0" strokeWidth={1.5} />

        <div className="flex-1">
          <div className="text-[15px] font-medium text-white mb-1">
            이전 진행 내역이 있어요
          </div>
          <div className="text-[13px] text-white/65">
            {progress}문항까지 완료했습니다
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onResume}
          className="px-4 py-2 rounded-full text-[14px] font-medium"
          style={{
            background: 'var(--action-blue)',
            color: 'white',
          }}
        >
          이어하기
        </motion.button>

        <button
          onClick={onDismiss}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4 text-white/65" />
        </button>
      </div>
    </motion.div>
  );
}
