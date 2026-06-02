import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import LandingScreen from './LandingScreen';
import GenderScreen from './GenderScreen';
import QuizScreen from './QuizScreen';
import LoadingScreen from './LoadingScreen';
import AdditionalInfoScreen from './AdditionalInfoScreen';
import ChallengeModal from './ChallengeModal';
import SessionRecoveryBanner from './SessionRecoveryBanner';
import { AnimatePresence } from 'motion/react';
import type { Gender, QuizAnswer, Screen } from '../types';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function QuizFlow() {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [gender, setGender] = useState<Gender>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  const [savedSession, setSavedSession] = useState<any>(null);
  const [showRecoveryBanner, setShowRecoveryBanner] = useState(false);

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
      setAnswers(savedSession.answers);
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
    const calculatedResult = calculateResult(answers, gender);

    try {
      // 서버로 결과 전송
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2ae6dc9b/results`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            gender,
            total: calculatedResult.total,
            categories: calculatedResult.categories,
            region: info.region,
            ageGroup: info.ageGroup,
          }),
        }
      );

      const data = await response.json();

      if (data.success && data.rankings) {
        // 서버에서 받은 실제 순위로 업데이트
        calculatedResult.rankings = data.rankings;
        calculatedResult.percentile = data.rankings.national;

        // 등급 재계산 (실제 순위 기반)
        const percentile = data.rankings.national;
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
    setAnswers([]);
    localStorage.removeItem('quiz-session');
    localStorage.removeItem('quiz-result');
  };

  return (
    <div className="size-full overflow-hidden" style={{
      background: currentScreen === 'landing' ? '#000000' :
                 currentScreen === 'gender' ? 'var(--cosmic-deep)' :
                 currentScreen === 'loading' ? 'linear-gradient(180deg, #000000 0%, var(--cosmic-deep) 100%)' :
                 currentScreen === 'additional-info' ? '#000000' :
                 'transparent'
    }}>
      {currentScreen === 'landing' && <LandingScreen onStart={handleStart} />}
      {currentScreen === 'gender' && <GenderScreen onSelect={handleGenderSelect} />}
      {currentScreen === 'quiz' && (
        <QuizScreen
          gender={gender!}
          onComplete={handleQuizComplete}
          initialAnswers={answers}
        />
      )}
      {currentScreen === 'loading' && <LoadingScreen />}
      {currentScreen === 'additional-info' && (
        <AdditionalInfoScreen
          onComplete={handleAdditionalInfoComplete}
          onSkip={handleSkipAdditionalInfo}
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

function calculateResult(answers: QuizAnswer[], gender: Gender) {
  // Calculate scores by category
  const categories = {
    selfCare: answers.slice(0, 5).reduce((sum, a) => sum + a.answer, 0),
    economy: answers.slice(5, 10).reduce((sum, a) => sum + a.answer, 0),
    social: answers.slice(10, 15).reduce((sum, a) => sum + a.answer, 0),
    lifestyle: answers.slice(15, 20).reduce((sum, a) => sum + a.answer, 0),
    mindset: answers.slice(20, 25).reduce((sum, a) => sum + a.answer, 0),
  };

  const total = Object.values(categories).reduce((sum, score) => sum + score, 0);
  const maxScore = 125; // 25 questions × 5 points max
  const percentage = (total / maxScore) * 100;

  // Calculate percentile (inverse - higher score = lower percentile)
  const percentile = Math.max(1, Math.min(99, Math.round(100 - percentage * 0.9)));

  // Determine grade
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
  };
}
