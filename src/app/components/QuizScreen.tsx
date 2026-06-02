import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Gender, QuizAnswer } from '../types';
import { questions } from '../data/questions';
import { getCurrentOnlineUsers } from '../utils/engagement';
import { Users } from 'lucide-react';

interface QuizScreenProps {
  gender: Gender;
  onComplete: (answers: QuizAnswer[]) => void;
  initialAnswers: QuizAnswer[];
}

const categories = [
  { name: '자기관리', range: [1, 5] },
  { name: '경제력', range: [6, 10] },
  { name: '사회성', range: [11, 15] },
  { name: '라이프스타일', range: [16, 20] },
  { name: '마인드셋', range: [21, 25] },
];

export default function QuizScreen({ gender, onComplete, initialAnswers }: QuizScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>(initialAnswers);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [socialFeedback, setSocialFeedback] = useState<string | null>(null);
  const [showSectionCard, setShowSectionCard] = useState(false);
  const [completedSection, setCompletedSection] = useState<number | null>(null);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [currentOnline, setCurrentOnline] = useState(0);

  const question = questions[currentQuestion];

  // 동시 참여자 수 업데이트 (5초마다 변동)
  useEffect(() => {
    const base = getCurrentOnlineUsers();
    setCurrentOnline(Math.max(8, base));

    const interval = setInterval(() => {
      setCurrentOnline(prev => {
        // 보고서 명세: 5초마다 ±2~4 변동
        const variation = Math.floor(Math.random() * 7) - 2; // -2 ~ +4
        return Math.max(8, prev + variation);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 보고서 명세: 문항 번호에 따라 동적으로 변경되는 메시지
  const getConcurrentMessage = () => {
    const qNum = currentQuestion + 1;
    
    if (qNum <= 5) {
      return `지금 ${currentOnline}명이 함께 시작했어요`;
    } else if (qNum <= 15) {
      return `지금 ${currentOnline}명이 함께 풀고 있어요`;
    } else if (qNum <= 20) {
      return `${currentOnline}명이 곧 결과를 받아요`;
    } else {
      return `${currentOnline}명이 지금 결과 직전이에요!`;
    }
  };

  const isLightSection = Math.floor(currentQuestion / 5) % 2 === 0;
  const bgColor = isLightSection ? 'var(--canvas)' : 'var(--surface-tile-1)';
  const textColor = isLightSection ? 'var(--ink)' : 'var(--body-on-dark)';
  const mutedColor = isLightSection ? 'var(--ink-muted-48)' : 'var(--body-muted)';

  // Save session
  useEffect(() => {
    if (answers.length > 0) {
      localStorage.setItem('quiz-session', JSON.stringify({ answers, currentQuestion, gender }));
    }
  }, [answers, currentQuestion, gender]);

  // Handle browser back button
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentQuestion >= 5) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handlePopState = () => {
      if (currentQuestion >= 5) {
        setShowExitWarning(true);
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentQuestion]);

  const getCurrentSection = (qNum: number) => Math.floor(qNum / 5);

  const getCategoryProgress = (catIndex: number) => {
    const [start, end] = categories[catIndex].range;
    const questionsInCategory = end - start + 1;
    const answeredInCategory = answers.filter(
      a => a.questionId >= start && a.questionId <= end
    ).length;
    return (answeredInCategory / questionsInCategory) * 100;
  };

  const handleAnswer = (optionIndex: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(optionIndex);

    // Social feedback after 350ms
    setTimeout(() => {
      const percentage = Math.floor(Math.random() * 40) + 30;
      const isPopular = percentage > 50;
      setSocialFeedback(
        isPopular
          ? `⬆ 응답자 ${percentage}%도 같은 선택`
          : `↓ 상위 ${100 - percentage}%만 이 답 선택`
      );
    }, 350);

    // Auto-advance after 1000ms (Increased to give more reading time)
    setTimeout(() => {
      const newAnswers = [
        ...answers.filter(a => a.questionId !== question.id),
        { questionId: question.id, answer: 5 - optionIndex },
      ];
      setAnswers(newAnswers);

      const currentSec = getCurrentSection(currentQuestion);

      // Check if section completed
      if (currentQuestion < 24) {
        if ((currentQuestion + 1) % 5 === 0) {
          setCompletedSection(currentSec);
          setShowSectionCard(true);
          setSelectedOption(null);
          setSocialFeedback(null);

          // Auto-advance to next question after 2.5s
          setTimeout(() => {
            setShowSectionCard(false);
            setDirection('forward');
            setCurrentQuestion(prev => prev + 1);
          }, 2500);
        } else {
          setSelectedOption(null);
          setSocialFeedback(null);
          setDirection('forward');
          setCurrentQuestion(prev => prev + 1);
        }
      } else {
        onComplete(newAnswers);
      }
    }, 1000);
  };

  return (
    <div
      className="size-full flex flex-col overflow-hidden transition-colors duration-700"
      style={{ background: bgColor }}
    >
      {/* Segmented Progress Bar */}
      <div
        className="sticky top-0 px-6 pt-8 pb-6 z-10"
        style={{ background: bgColor }}
      >
        <div className="flex gap-1">
          {categories.map((cat, idx) => {
            const [start, end] = cat.range;
            const isCompleted = currentQuestion >= end;
            const isCurrent = currentQuestion >= start - 1 && currentQuestion < end;
            const progress = getCategoryProgress(idx);

            return (
              <div key={idx} className="flex-1 flex flex-col gap-1">
                <div className="text-[9px] text-center mb-1 min-h-[14px] px-0.5">
                  {isCompleted ? (
                    <span style={{ color: textColor }}>✓ {cat.name}</span>
                  ) : isCurrent ? (
                    <span style={{ color: textColor }}>{cat.name}</span>
                  ) : (
                    <span style={{ color: mutedColor, opacity: 0.5 }}>{cat.name}</span>
                  )}
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{
                    background: isLightSection ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: isCompleted || isCurrent ? 'var(--action-blue)' : 'transparent',
                      width: `${progress}%`,
                    }}
                    animate={{
                      scale: isCompleted && currentQuestion === end ? [1, 1.05, 1] : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 flex items-center justify-center px-6 py-20 overflow-hidden">
        <div className="max-w-[640px] w-full">
          <AnimatePresence mode="wait">
            {showSectionCard && completedSection !== null ? (
              <SectionCompletionCard
                key="section-card"
                section={categories[completedSection]}
                currentQuestion={currentQuestion + 1}
                textColor={textColor}
                mutedColor={mutedColor}
              />
            ) : (
              <QuestionCard
                key={currentQuestion}
                question={question}
                questionNumber={currentQuestion + 1}
                selectedOption={selectedOption}
                socialFeedback={socialFeedback}
                onAnswer={handleAnswer}
                direction={direction}
                isLightSection={isLightSection}
                textColor={textColor}
                mutedColor={mutedColor}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Exit Warning Modal */}
      <AnimatePresence>
        {showExitWarning && (
          <ExitWarningModal
            progress={currentQuestion + 1}
            onContinue={() => setShowExitWarning(false)}
            onExit={() => {
              localStorage.removeItem('quiz-session');
              window.location.href = '/';
            }}
          />
        )}
      </AnimatePresence>

      {/* 동시 참여자 수 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full flex items-center gap-2"
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <Users size={14} strokeWidth={2} className="text-blue-400" />
        <span className="text-[13px] text-white/80">
          {getConcurrentMessage()}
        </span>
      </motion.div>
    </div>
  );
}

interface QuestionCardProps {
  question: any;
  questionNumber: number;
  selectedOption: number | null;
  socialFeedback: string | null;
  onAnswer: (index: number) => void;
  direction: 'forward' | 'backward';
  isLightSection: boolean;
  textColor: string;
  mutedColor: string;
}

function QuestionCard({
  question,
  questionNumber,
  selectedOption,
  socialFeedback,
  onAnswer,
  direction,
  isLightSection,
  textColor,
  mutedColor,
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction === 'forward' ? 40 : -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction === 'forward' ? -40 : 40 }}
      transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
    >
      <div
        className="mb-6"
        style={{
          fontSize: '14px',
          color: mutedColor,
          letterSpacing: '-0.224px',
        }}
      >
        질문 {questionNumber} / {questions.length} · {question.category}
      </div>

      <h2
        className="mb-12"
        style={{
          fontSize: '40px',
          fontWeight: 600,
          lineHeight: 1.1,
          color: textColor,
        }}
      >
        {question.question}
      </h2>

      <div className="space-y-3">
        {question.options.map((option: string, index: number) => (
          <motion.button
            key={index}
            onClick={() => onAnswer(index)}
            disabled={selectedOption !== null}
            whileTap={{ scale: selectedOption === null ? 0.98 : 1 }}
            className="w-full text-left px-6 py-5 transition-all duration-200 relative overflow-hidden"
            style={{
              background:
                selectedOption === index
                  ? 'var(--action-blue)'
                  : isLightSection
                  ? 'var(--canvas-parchment)'
                  : 'rgba(255, 255, 255, 0.05)',
              border:
                selectedOption === index
                  ? 'none'
                  : isLightSection
                  ? '1px solid var(--hairline)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--rounded-lg)',
              cursor: selectedOption === null ? 'pointer' : 'default',
              opacity: selectedOption !== null && selectedOption !== index ? 0.3 : 1,
            }}
          >
            {/* Ripple effect */}
            <AnimatePresence>
              {selectedOption === index && (
                <motion.div
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 rounded-[18px]"
                  style={{ background: 'var(--action-blue)' }}
                />
              )}
            </AnimatePresence>

            <div className="flex items-center gap-4 relative z-10">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background:
                    selectedOption === index
                      ? 'rgba(255, 255, 255, 0.3)'
                      : isLightSection
                      ? 'var(--divider-soft)'
                      : 'rgba(255, 255, 255, 0.1)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: selectedOption === index ? '#ffffff' : mutedColor,
                }}
              >
                {selectedOption === index ? '✓' : index + 1}
              </div>
              <div className="flex-1">
                <span
                  style={{
                    fontSize: '17px',
                    fontWeight: 400,
                    lineHeight: 1.47,
                    letterSpacing: '-0.374px',
                    color: selectedOption === index ? '#ffffff' : textColor,
                  }}
                >
                  {option}
                </span>

                {/* Social feedback */}
                <AnimatePresence>
                  {selectedOption === index && socialFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2"
                      style={{
                        fontSize: '13px',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      {socialFeedback}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

interface SectionCompletionCardProps {
  section: { name: string; range: number[] };
  currentQuestion: number;
  textColor: string;
  mutedColor: string;
}

function SectionCompletionCard({ section, currentQuestion, textColor, mutedColor }: SectionCompletionCardProps) {
  const isHalfway = currentQuestion === 15;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.5, times: [0, 0.6, 1] }}
        className="text-[64px] mb-6"
      >
        {isHalfway ? '🎯' : '✓'}
      </motion.div>

      <h2
        className="mb-4"
        style={{
          fontSize: '40px',
          fontWeight: 600,
          lineHeight: 1.1,
          color: textColor,
        }}
      >
        {section.name} 완료!
      </h2>

      {isHalfway ? (
        <>
          <p className="text-[21px] mb-4" style={{ color: textColor }}>
            벌써 절반!
          </p>
          <p className="text-[17px] leading-relaxed" style={{ color: mutedColor }}>
            지금까지 15,847명 중 당신만큼
            <br />
            성실한 응답자는 23%입니다
          </p>
        </>
      ) : (
        <p className="text-[17px] leading-relaxed" style={{ color: mutedColor }}>
          지금까지 답변을 보면,
          <br />
          당신은 {section.name}형에 가깝네요
        </p>
      )}

      {/* Auto progress bar */}
      <div className="mt-8 h-1 rounded-full bg-white/10 overflow-hidden max-w-xs mx-auto">
        <motion.div
          className="h-full rounded-full bg-blue-500"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.5, ease: 'linear' }}
        />
      </div>

      <div className="mt-4 text-[13px]" style={{ color: mutedColor }}>
        다음 섹션으로 자동 이동...
      </div>
    </motion.div>
  );
}

interface ExitWarningModalProps {
  progress: number;
  onContinue: () => void;
  onExit: () => void;
}

function ExitWarningModal({ progress, onContinue, onExit }: ExitWarningModalProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={onContinue}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
      >
        <div
          className="max-w-md w-full rounded-[24px] p-8 text-center pointer-events-auto"
          style={{
            background: 'var(--cosmic-surface)',
            border: '1px solid var(--glass-border)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[48px] mb-4">⚠️</div>

          <h2 className="text-[28px] font-semibold text-white mb-4">
            잠깐! 결과가 아직 남아있어요
          </h2>

          <p className="text-[17px] text-white/65 mb-2 leading-relaxed">
            지금까지 <strong className="text-white">{progress}문항</strong> 완료했어요.
          </p>
          <p className="text-[17px] text-white/65 mb-8 leading-relaxed">
            여기서 나가면 처음부터 다시 시작해야 합니다.
          </p>

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onContinue}
              className="w-full py-4 rounded-full font-semibold text-[17px]"
              style={{
                background: 'var(--action-blue)',
                color: 'white',
              }}
            >
              계속하기
            </motion.button>

            <button
              onClick={onExit}
              className="w-full py-3 text-[15px] text-white/45 hover:text-white/65 transition-colors"
            >
              그냥 나가기
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}