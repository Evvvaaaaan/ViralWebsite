import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import ResultScreen from '../components/ResultScreen';
import type { Gender } from '../types';

export default function ResultPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [gender, setGender] = useState<Gender>(null);

  useEffect(() => {
    // Load result from localStorage
    const savedResult = localStorage.getItem('quiz-result');
    if (savedResult) {
      try {
        const data = JSON.parse(savedResult);
        setResult(data.result);
        setGender(data.gender);
      } catch (e) {
        console.error('Failed to load result:', e);
        navigate('/');
      }
    } else {
      // No result found, redirect to home
      navigate('/');
    }
  }, [navigate]);

  const handleRestart = () => {
    localStorage.removeItem('quiz-result');
    navigate('/');
  };

  if (!result || !gender) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="text-[21px] mb-4">결과를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <ResultScreen
      result={result}
      gender={gender}
      onRestart={handleRestart}
    />
  );
}
