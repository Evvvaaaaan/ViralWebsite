import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import LandingScreen from './LandingScreen';
import GenderScreen from './GenderScreen';
import AgeScreen from './AgeScreen';
import QuizScreen from './QuizScreen';
import LoadingScreen from './LoadingScreen';
import AdditionalInfoScreen from './AdditionalInfoScreen';
import ChallengeModal from './ChallengeModal';
import SessionRecoveryBanner from './SessionRecoveryBanner';
import { AnimatePresence } from 'motion/react';
import type { Gender, QuizAnswer, Screen } from '../types';
import { submitResult } from '../utils/apiClient';
import { getQuestions, resultCategoryMap, type ResultCategoryKey } from '../data/questions';

interface CalculatedResult {
  percentile: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  total: number;
  categories: Record<ResultCategoryKey, number>;
  gender: Gender;
  ageGroup: string;
  rankings?: {
    national: number;
    region: number | null;
    ageGroup: number | null;
  };
  id?: string;
}

export default function QuizFlow() {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [gender, setGender] = useState<Gender>(null);
  const [ageGroup, setAgeGroup] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  const [savedSession, setSavedSession] = useState<any>(null);
  const [showRecoveryBanner, setShowRecoveryBanner] = useState(false);
  const [initialQuestionIndex, setInitialQuestionIndex] = useState(0);

  // Check for challenge URL and saved session
  useEffect(() => {
    // Check if coming from a challenge link
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('challenge') === 'true') {
      setIsChallengeMode(true);
    }

    // Check for saved session
    const savedSessionData = localStorage.getItem('quiz-session');
    if (savedSessionData) {
      try {
        const session = JSON.parse(savedSessionData);
        if (session.answers && session.answers.length > 0 && session.answers.length < 25) {
          setSavedSession(session);
          setShowRecoveryBanner(true);
        }
      } catch (e) {
        console.error('Failed to load session:', e);
      }
    }
  }, []);

  const handleResumeSession = () => {
    if (savedSession) {
      setGender(savedSession.gender);
      setAgeGroup(savedSession.ageGroup || '25~29세');
      setAnswers(savedSession.answers);
      setInitialQuestionIndex(savedSession.currentQuestion || savedSession.answers.length || 0);
      setCurrentScreen('quiz');
      setShowRecoveryBanner(false);
    }
  };

  const handleDismissRecovery = () => {
    setShowRecoveryBanner(false);
    localStorage.removeItem('quiz-session');
  };

  const handleStart = () => {
    setCurrentScreen('gender');
  };

  const handleGenderSelect = (selectedGender: Gender) => {
    setGender(selectedGender);
    setTimeout(() => {
      setCurrentScreen('age');
    }, 400);
  };

  const handleAgeSelect = (selectedAge: string) => {
    setAgeGroup(selectedAge);
    setTimeout(() => {
      setCurrentScreen('quiz');
    }, 400);
  };

  const handleQuizComplete = (quizAnswers: QuizAnswer[]) => {
    setAnswers(quizAnswers);
    setCurrentScreen('loading');

    // Show additional info screen after loading animation
    setTimeout(() => {
      setCurrentScreen('additional-info');
    }, 2800);
  };

  const handleAdditionalInfoComplete = async (info: { region: string | null; ageGroup: string | null }) => {
    // Calculate result
    const calculatedResult = calculateResult(answers, gender, info.ageGroup || ageGroup);

    try {
      // 서버로 결과 전송 (apiClient: 타임아웃 10초, 재시도 3회)
      const response = await submitResult({
        gender,
        total: calculatedResult.total,
        categories: calculatedResult.categories,
        region: info.region,
        ageGroup: info.ageGroup || ageGroup,
      });

      if (response.success && response.data?.rankings) {
        const { rankings, id } = response.data;
        // 서버에서 받은 실제 순위로 업데이트
        calculatedResult.rankings = rankings;
        calculatedResult.percentile = rankings.national;
        calculatedResult.id = id;

        // 등급 재계산 (실제 순위 기반)
        const percentile = rankings.national;
        if (percentile <= 1) calculatedResult.grade = 'S';
        else if (percentile <= 5) calculatedResult.grade = 'A';
        else if (percentile <= 15) calculatedResult.grade = 'B';
        else if (percentile <= 40) calculatedResult.grade = 'C';
        else if (percentile <= 70) calculatedResult.grade = 'D';
        else calculatedResult.grade = 'F';
      }
    } catch (error) {
      console.error('Failed to submit result to server:', error);
      // 서버 오류 시 로컬 계산 결과 사용
    }

    // Save result to localStorage
    localStorage.setItem('quiz-result', JSON.stringify({
      result: calculatedResult,
      gender: gender,
    }));

    // Clear saved session
    localStorage.removeItem('quiz-session');

    // Navigate to result page
    navigate('/result');
  };

  const handleSkipAdditionalInfo = () => {
    handleAdditionalInfoComplete({ region: null, ageGroup: null });
  };

  const handleRestart = () => {
    setCurrentScreen('landing');
    setGender(null);
    setAgeGroup(null);
    setAnswers([]);
    setInitialQuestionIndex(0);
    localStorage.removeItem('quiz-session');
    localStorage.removeItem('quiz-result');
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden" style={{
      background: currentScreen === 'landing' ? '#000000' :
                 currentScreen === 'gender' || currentScreen === 'age' ? 'var(--cosmic-deep)' :
                 currentScreen === 'loading' ? 'linear-gradient(180deg, #000000 0%, var(--cosmic-deep) 100%)' :
                 currentScreen === 'additional-info' ? '#000000' :
                 'transparent'
    }}>
      {currentScreen === 'landing' && <LandingScreen onStart={handleStart} />}
      {currentScreen === 'gender' && <GenderScreen onSelect={handleGenderSelect} />}
      {currentScreen === 'age' && <AgeScreen onSelect={handleAgeSelect} />}
      {currentScreen === 'quiz' && (
        <QuizScreen
          gender={gender!}
          ageGroup={ageGroup || '25~29세'}
          onComplete={handleQuizComplete}
          initialAnswers={answers}
          initialQuestionIndex={initialQuestionIndex}
        />
      )}
      {currentScreen === 'loading' && <LoadingScreen />}
      {currentScreen === 'additional-info' && (
        <AdditionalInfoScreen
          onComplete={handleAdditionalInfoComplete}
          onSkip={handleSkipAdditionalInfo}
          preselectedAgeGroup={ageGroup}
        />
      )}

      {/* Challenge Modal */}
      {isChallengeMode && currentScreen === 'landing' && (
        <ChallengeModal onAccept={() => {
          setIsChallengeMode(false);
          handleStart();
        }} />
      )}

      {/* Session Recovery Banner */}
      <AnimatePresence>
        {showRecoveryBanner && currentScreen === 'landing' && savedSession && (
          <SessionRecoveryBanner
            progress={savedSession.answers.length}
            onResume={handleResumeSession}
            onDismiss={handleDismissRecovery}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function normalCDF(x: number, mean: number, stdDev: number): number {
  const z = (x - mean) / stdDev;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  let cdf = 1 - p;
  if (z < 0) cdf = p;
  return cdf;
}

function calculateResult(answers: QuizAnswer[], gender: Gender, ageGroup: string | null): CalculatedResult {
  const age = ageGroup || '25~29세';
  const questionsList = getQuestions(age);
  const answersByQuestionId = new Map(answers.map((answer) => [answer.questionId, answer.answer]));
  const categories: Record<ResultCategoryKey, number> = {
    selfCare: 0,
    economy: 0,
    social: 0,
    lifestyle: 0,
    mindset: 0,
  };

  questionsList.forEach((question) => {
    const score = answersByQuestionId.get(question.id);
    if (score === undefined) return;
    categories[resultCategoryMap[question.category]] += score;
  });

  const total = Object.values(categories).reduce((sum, score) => sum + score, 0);

  // 연령대별 정규분포 통계 파라미터 적용 (μ, σ)
  let mean = 66;
  let stdDev = 16;

  if (age === '10대') {
    mean = 52;
    stdDev = 13;
  } else if (age === '20~24세') {
    mean = 60;
    stdDev = 15;
  } else if (age === '25~29세') {
    mean = 66;
    stdDev = 16;
  } else if (age === '30~39세') {
    mean = 72;
    stdDev = 17;
  } else if (age === '40세 이상') {
    mean = 75;
    stdDev = 16;
  }

  // 누적 정규 분포 CDF 기반 통계학적 상위 백분위 계산
  const cdfVal = normalCDF(total, mean, stdDev);
  const percentile = Math.max(0.1, Math.min(99.9, parseFloat(((1 - cdfVal) * 100).toFixed(1))));

  // Determine grade based on percentile
  let grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  if (percentile <= 1) grade = 'S';
  else if (percentile <= 5) grade = 'A';
  else if (percentile <= 15) grade = 'B';
  else if (percentile <= 40) grade = 'C';
  else if (percentile <= 70) grade = 'D';
  else grade = 'F';

  return {
    percentile,
    grade,
    total,
    categories,
    gender,
    ageGroup: age,
  };
}
