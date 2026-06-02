import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Gender, QuizAnswer } from '../types';
import { getQuestionOptions, getQuestionScore, getQuestions } from '../data/questions';
import { getCurrentOnlineUsers } from '../utils/engagement';
import { Users } from 'lucide-react';
import { logGAEvent } from '../utils/analytics';
import { logUserEvent } from '../utils/apiClient';

interface QuizScreenProps {
  gender: Gender;
  ageGroup: string;
  onComplete: (answers: QuizAnswer[]) => void;
  initialAnswers: QuizAnswer[];
  initialQuestionIndex?: number;
}

const categories = [
  { name: '자기관리', range: [1, 5] },
  { name: '마인드셋', range: [6, 10] },
  { name: '경제력', range: [11, 15] },
  { name: '사회성', range: [16, 20] },
  { name: '라이프스타일', range: [21, 25] },
];

export default function QuizScreen({ gender, ageGroup, onComplete, initialAnswers, initialQuestionIndex = 0 }: QuizScreenProps) {
  const [answers, setAnswers] = useState<QuizAnswer[]>(initialAnswers);
  const questionsList = getQuestions(ageGroup);
  const [currentQuestion, setCurrentQuestion] = useState(() =>
    Math.max(0, Math.min(initialQuestionIndex, questionsList.length - 1)),
  );
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [socialFeedback, setSocialFeedback] = useState<string | null>(null);
  const [showSectionCard, setShowSectionCard] = useState(false);
  const [completedSection, setCompletedSection] = useState<number | null>(null);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [currentOnline, setCurrentOnline] = useState(0);

  const question = questionsList[currentQuestion];
  const options = getQuestionOptions(question, gender);

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
      localStorage.setItem('quiz-session', JSON.stringify({ answers, currentQuestion, gender, ageGroup }));
    }
  }, [answers, currentQuestion, gender, ageGroup]);

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

    const qNum = currentQuestion + 1;
    logGAEvent(`question_${qNum}_answered`, 'quiz_flow', `Question ${qNum}`);
    logUserEvent('question_answered', { questionNumber: qNum, answerIndex: optionIndex });

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
      const score = getQuestionScore(question, optionIndex, gender);
      const newAnswers = [
        ...answers.filter(a => a.questionId !== question.id),
        { questionId: question.id, answer: score },
      ];
      setAnswers(newAnswers);

      const currentSec = getCurrentSection(currentQuestion);

      // Check if section completed
      if (currentQuestion < questionsList.length - 1) {
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
      className="w-full min-h-screen flex flex-col overflow-hidden transition-colors duration-700"
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
                totalQuestions={questionsList.length}
                options={options}
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
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center gap-2"
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
  totalQuestions: number;
  options: string[];
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
  totalQuestions,
  options,
  selectedOption,
  socialFeedback,
  onAnswer,
  direction,
  isLightSection,
  textColor,
  mutedColor,
}: QuestionCardProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [localSelected, setLocalSelected] = useState<number | null>(null);

  useEffect(() => {
    setLocalSelected(selectedOption);
  }, [selectedOption]);

  const handleSliderSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setLocalSelected(idx);
    onAnswer(idx);
  };

  const renderContent = () => {
    if (question.type === 'scale') {
      if (question.scaleType === 'grid') {
        return (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {options.map((option: string, index: number) => (
              <motion.button
                key={index}
                onClick={() => onAnswer(index)}
                disabled={selectedOption !== null}
                whileTap={{ scale: selectedOption === null ? 0.98 : 1 }}
                className="text-left px-4 py-4 sm:px-5 sm:py-6 transition-all duration-200 relative overflow-hidden"
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
                <div className="flex flex-col gap-3 relative z-10">
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
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: 400,
                      lineHeight: 1.35,
                      letterSpacing: '-0.3px',
                      color: selectedOption === index ? '#ffffff' : textColor,
                    }}
                  >
                    {option}
                  </span>
                  <AnimatePresence>
                    {selectedOption === index && socialFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[12px] text-white/80 mt-1"
                      >
                        {socialFeedback}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            ))}
          </div>
        );
      }

      if (question.scaleType === 'slider') {
        const stepPercent = 100 / (options.length - 1);
        const activePercent = localSelected !== null ? localSelected * stepPercent : 0;

        return (
          <div className="w-full flex flex-col items-center">
            {/* Feedback bubble / indicator */}
            <div className="text-center mb-6 h-12 flex items-center justify-center">
              {localSelected !== null ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="px-5 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 font-medium text-[15px] sm:text-[17px] backdrop-blur-md shadow-[0_0_15px_rgba(0,102,204,0.15)]"
                >
                  {options[localSelected]}
                </motion.div>
              ) : hoveredIndex !== null ? (
                <div className="text-[15px] text-white/50 font-normal">
                  {options[hoveredIndex]}
                </div>
              ) : (
                <div className="text-[13px] sm:text-[14px]" style={{ color: mutedColor }}>
                  원하는 지점을 선택하세요
                </div>
              )}
            </div>

            {/* Slider track container */}
            <div className="relative w-full h-8 flex items-center mb-8 cursor-pointer select-none">
              {/* Background Track */}
              <div
                className="w-full h-1.5 rounded-full"
                style={{
                  background: isLightSection ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)',
                }}
              />
              {/* Active/Filled Track */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 left-0 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_10px_rgba(0,102,204,0.3)]"
                initial={{ width: 0 }}
                animate={{ width: `${activePercent}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
              {/* Steps Nodes */}
              {options.map((opt: string, idx: number) => {
                const leftPos = idx * stepPercent;
                const isStepSelected = localSelected === idx;

                return (
                  <div
                    key={idx}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
                    style={{ left: `${leftPos}%` }}
                    onClick={() => handleSliderSelect(idx)}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <motion.div
                      className="w-5 h-5 rounded-full border-2 transition-colors duration-200 cursor-pointer"
                      style={{
                        background: isStepSelected
                          ? '#ffffff'
                          : isLightSection
                          ? 'var(--canvas)'
                          : 'var(--cosmic-base)',
                        borderColor: isStepSelected
                          ? 'var(--action-blue)'
                          : isLightSection
                          ? 'rgba(0, 0, 0, 0.2)'
                          : 'rgba(255, 255, 255, 0.3)',
                        boxShadow: isStepSelected ? '0 0 12px var(--action-blue)' : 'none',
                      }}
                      whileHover={{ scale: selectedOption === null ? 1.25 : 1 }}
                      animate={{
                        scale: isStepSelected ? [1, 1.2, 1] : 1,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Labels below slider */}
            <div className="grid grid-cols-5 w-full gap-1">
              {options.map((opt: string, idx: number) => {
                const isStepSelected = localSelected === idx;
                return (
                  <button
                    key={idx}
                    disabled={selectedOption !== null}
                    onClick={() => handleSliderSelect(idx)}
                    className="text-center focus:outline-none flex flex-col items-center group cursor-pointer"
                    style={{ opacity: selectedOption !== null && !isStepSelected ? 0.35 : 1 }}
                  >
                    <span
                      className="text-[11px] sm:text-[13px] leading-snug font-normal transition-colors duration-200"
                      style={{
                        color: isStepSelected
                          ? 'var(--action-blue)'
                          : isLightSection
                          ? 'var(--ink)'
                          : 'rgba(255, 255, 255, 0.65)',
                        fontWeight: isStepSelected ? 600 : 400,
                      }}
                    >
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* Social feedback below slider */}
            <AnimatePresence>
              {selectedOption !== null && socialFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[13px] font-normal text-center mt-6 px-4 py-1.5 rounded-full"
                  style={{
                    color: isLightSection ? 'var(--action-blue)' : 'var(--body-on-dark)',
                    background: isLightSection ? 'var(--canvas-parchment)' : 'rgba(255, 255, 255, 0.05)',
                  }}
                >
                  {socialFeedback}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      }

      if (question.scaleType === 'list') {
        return (
          <div className="relative pl-8 space-y-4">
            {/* Connecting line */}
            <div
              className="absolute left-[11px] top-4 bottom-4 w-0.5"
              style={{
                background: isLightSection ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)',
              }}
            />
            {/* Active filling line */}
            {selectedOption !== null && (
              <motion.div
                className="absolute left-[11px] top-4 w-0.5 bg-blue-500 shadow-[0_0_8px_rgba(0,102,204,0.5)]"
                initial={{ height: 0 }}
                animate={{
                  height: `${(selectedOption / (options.length - 1)) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                style={{
                  maxHeight: 'calc(100% - 32px)',
                }}
              />
            )}

            {options.map((option: string, index: number) => {
              const isStepSelected = selectedOption === index;
              const isFilled = selectedOption !== null && index <= selectedOption;

              return (
                <motion.div
                  key={index}
                  className="relative"
                  whileTap={{ scale: selectedOption === null ? 0.98 : 1 }}
                >
                  {/* Timeline Node */}
                  <div
                    className="absolute -left-[29px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 z-10 transition-all duration-300"
                    style={{
                      background: isStepSelected
                        ? '#ffffff'
                        : isFilled
                        ? 'var(--action-blue)'
                        : isLightSection
                        ? 'var(--canvas)'
                        : 'var(--cosmic-base)',
                      borderColor: isFilled || isStepSelected
                        ? 'var(--action-blue)'
                        : isLightSection
                        ? 'rgba(0, 0, 0, 0.2)'
                        : 'rgba(255, 255, 255, 0.3)',
                      boxShadow: isStepSelected
                        ? '0 0 10px var(--action-blue)'
                        : 'none',
                    }}
                  />

                  {/* Content Card */}
                  <button
                    onClick={() => onAnswer(index)}
                    disabled={selectedOption !== null}
                    className="w-full text-left px-5 py-4 transition-all duration-200 relative overflow-hidden"
                    style={{
                      background: isStepSelected
                        ? 'var(--action-blue)'
                        : isLightSection
                        ? 'var(--canvas-parchment)'
                        : 'rgba(255, 255, 255, 0.04)',
                      border: isStepSelected
                        ? 'none'
                        : isLightSection
                        ? '1px solid var(--hairline)'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 'var(--rounded-lg)',
                      cursor: selectedOption === null ? 'pointer' : 'default',
                      opacity: selectedOption !== null && !isStepSelected ? 0.35 : 1,
                    }}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div
                        className="text-[12px] font-semibold flex-shrink-0"
                        style={{
                          color: isStepSelected ? '#ffffff' : mutedColor,
                        }}
                      >
                        단계 {index + 1}
                      </div>
                      <div className="flex-1">
                        <span
                          style={{
                            fontSize: '16px',
                            fontWeight: 400,
                            color: isStepSelected ? '#ffffff' : textColor,
                          }}
                        >
                          {option}
                        </span>

                        <AnimatePresence>
                          {isStepSelected && socialFeedback && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-[12px] text-white/80 mt-1"
                            >
                              {socialFeedback}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        );
      }
    }

    // Default vertical list (for Likert type or standard)
    return (
      <div className="space-y-3">
        {options.map((option: string, index: number) => (
          <motion.button
            key={index}
            onClick={() => onAnswer(index)}
            disabled={selectedOption !== null}
            whileTap={{ scale: selectedOption === null ? 0.98 : 1 }}
            className="w-full text-left px-4 py-3.5 sm:px-6 sm:py-5 transition-all duration-200 relative overflow-hidden"
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
    );
  };

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
        질문 {questionNumber} / {totalQuestions} · {question.category}
      </div>

      <h2
        className="mb-12"
        style={{
          fontSize: 'clamp(24px, 5vw, 40px)',
          fontWeight: 600,
          lineHeight: 1.1,
          color: textColor,
        }}
      >
        {question.question}
      </h2>

      {renderContent()}
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
