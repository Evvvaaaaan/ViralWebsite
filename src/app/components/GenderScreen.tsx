import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, UserCircle } from 'lucide-react';
import type { Gender } from '../App';

interface GenderScreenProps {
  onSelect: (gender: Gender) => void;
}

export default function GenderScreen({ onSelect }: GenderScreenProps) {
  const [selected, setSelected] = useState<Gender>(null);
  const [hoveredGender, setHoveredGender] = useState<Gender>(null);

  const handleSelect = (gender: Gender) => {
    setSelected(gender);
    setTimeout(() => {
      onSelect(gender);
    }, 400);
  };

  const activeGender = selected || hoveredGender;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="size-full flex relative overflow-hidden"
      style={{
        background: activeGender === 'male'
          ? 'rgba(99, 102, 241, 0.08)'
          : activeGender === 'female'
          ? 'rgba(255, 100, 150, 0.08)'
          : 'var(--cosmic-deep)',
        transition: 'background 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)',
      }}
    >
      <motion.div
        className="flex-1 flex flex-col items-center justify-center cursor-pointer relative border-r"
        style={{
          borderColor: 'rgba(255, 255, 255, 0.08)',
          opacity: selected && selected !== 'male' ? 0.4 : 1,
          transition: 'opacity 0.3s',
        }}
        onClick={() => handleSelect('male')}
        onMouseEnter={() => setHoveredGender('male')}
        onMouseLeave={() => setHoveredGender(null)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <AnimatePresence>
          {(hoveredGender === 'male' || selected === 'male') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/5"
            />
          )}
        </AnimatePresence>

        <motion.div
          className="relative z-10 flex flex-col items-center"
          animate={{ scale: selected === 'male' ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <User className="w-16 h-16 mb-6 text-white" strokeWidth={1.5} />
          <h2 className="text-[24px] font-semibold text-white mb-2 tracking-[-0.015em]">
            남자
          </h2>
          <p className="text-[17px] text-white/65 mb-8">
            남성 기준 질문 · 남성 통계
          </p>

          <AnimatePresence>
            {(hoveredGender === 'male' || selected === 'male') && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="px-8 py-3 rounded-full text-[17px] font-medium"
                style={{
                  background: 'var(--cosmic-indigo)',
                  color: 'white',
                }}
              >
                선택하기
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex-1 flex flex-col items-center justify-center cursor-pointer relative"
        style={{
          opacity: selected && selected !== 'female' ? 0.4 : 1,
          transition: 'opacity 0.3s',
        }}
        onClick={() => handleSelect('female')}
        onMouseEnter={() => setHoveredGender('female')}
        onMouseLeave={() => setHoveredGender(null)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <AnimatePresence>
          {(hoveredGender === 'female' || selected === 'female') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/5"
            />
          )}
        </AnimatePresence>

        <motion.div
          className="relative z-10 flex flex-col items-center"
          animate={{ scale: selected === 'female' ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <UserCircle className="w-16 h-16 mb-6 text-white" strokeWidth={1.5} />
          <h2 className="text-[24px] font-semibold text-white mb-2 tracking-[-0.015em]">
            여자
          </h2>
          <p className="text-[17px] text-white/65 mb-8">
            여성 기준 질문 · 여성 통계
          </p>

          <AnimatePresence>
            {(hoveredGender === 'female' || selected === 'female') && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="px-8 py-3 rounded-full text-[17px] font-medium"
                style={{
                  background: 'var(--cosmic-pink)',
                  color: 'white',
                }}
              >
                선택하기
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
