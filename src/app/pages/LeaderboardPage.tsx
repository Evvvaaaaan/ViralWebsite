import { Link } from 'react-router';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Home, BarChart3, Info, User, Users } from 'lucide-react';
import { fetchLeaderboard } from '../utils/apiClient';
import type React from 'react';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'male' | 'female'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboards, setLeaderboards] = useState<any>({
    all: [
      { rank: 1, name: '익명', score: 9.87, gender: 'male' },
      { rank: 2, name: '익명', score: 9.45, gender: 'female' },
      { rank: 3, name: '익명', score: 9.23, gender: 'male' },
      { rank: 4, name: '익명', score: 8.91, gender: 'female' },
      { rank: 5, name: '익명', score: 8.76, gender: 'male' },
      { rank: 6, name: '익명', score: 8.54, gender: 'female' },
      { rank: 7, name: '익명', score: 8.32, gender: 'male' },
      { rank: 8, name: '익명', score: 8.10, gender: 'female' },
      { rank: 9, name: '익명', score: 7.98, gender: 'male' },
      { rank: 10, name: '익명', score: 7.76, gender: 'female' },
    ],
    male: [
      { rank: 1, name: '익명', score: 9.87, gender: 'male' },
      { rank: 2, name: '익명', score: 9.23, gender: 'male' },
      { rank: 3, name: '익명', score: 8.76, gender: 'male' },
      { rank: 4, name: '익명', score: 8.32, gender: 'male' },
      { rank: 5, name: '익명', score: 7.98, gender: 'male' },
      { rank: 6, name: '익명', score: 7.45, gender: 'male' },
      { rank: 7, name: '익명', score: 7.21, gender: 'male' },
      { rank: 8, name: '익명', score: 6.98, gender: 'male' },
      { rank: 9, name: '익명', score: 6.76, gender: 'male' },
      { rank: 10, name: '익명', score: 6.54, gender: 'male' },
    ],
    female: [
      { rank: 1, name: '익명', score: 9.45, gender: 'female' },
      { rank: 2, name: '익명', score: 8.91, gender: 'female' },
      { rank: 3, name: '익명', score: 8.54, gender: 'female' },
      { rank: 4, name: '익명', score: 8.10, gender: 'female' },
      { rank: 5, name: '익명', score: 7.76, gender: 'female' },
      { rank: 6, name: '익명', score: 7.43, gender: 'female' },
      { rank: 7, name: '익명', score: 7.12, gender: 'female' },
      { rank: 8, name: '익명', score: 6.87, gender: 'female' },
      { rank: 9, name: '익명', score: 6.65, gender: 'female' },
      { rank: 10, name: '익명', score: 6.32, gender: 'female' },
    ],
  });

  useEffect(() => {
    let active = true;
    async function loadLeaderboard() {
      try {
        const response = await fetchLeaderboard();
        if (response.success && response.data && active) {
          const { all, male, female } = response.data;
          setLeaderboards({
            all: all && all.length > 0 ? all : leaderboards.all,
            male: male && male.length > 0 ? male : leaderboards.male,
            female: female && female.length > 0 ? female : leaderboards.female,
          });
        }
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        if (active) setIsLoading(false);
      }
    }
    loadLeaderboard();
    return () => {
      active = false;
    };
  }, []);

  const currentData = leaderboards[activeTab];

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-blue-500" />
          <div className="text-[18px] font-bold text-gray-800">순위 테스트</div>
        </Link>
        <div className="flex gap-1">
          <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg">
            <Home className="w-5 h-5 text-gray-600" />
          </Link>
          <Link to="/stats" className="p-2 hover:bg-gray-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-gray-600" />
          </Link>
          <Link to="/about" className="p-2 hover:bg-gray-100 rounded-lg">
            <Info className="w-5 h-5 text-gray-600" />
          </Link>
        </div>
      </div>

      {/* Sidebar - Desktop Only */}
      <div className="hidden md:block w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3 mb-8">
            <Trophy className="w-7 h-7 text-blue-500" />
            <div className="text-[22px] font-bold text-gray-800">순위 테스트</div>
          </Link>
          <nav className="space-y-1">
            <NavItem icon={<Home className="w-5 h-5" />} label="메인" to="/" />
            <NavItem icon={<Trophy className="w-5 h-5" />} label="리더보드" to="/leaderboard" active />
            <NavItem icon={<BarChart3 className="w-5 h-5" />} label="통계" to="/stats" />
            <NavItem icon={<Info className="w-5 h-5" />} label="소개" to="/about" />
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="mb-6 md:mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-[24px] md:text-[32px] font-bold text-gray-800 mb-2 flex items-center gap-3">
                전국 리더보드
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
              </h1>
              <p className="text-[14px] md:text-[15px] text-gray-500">실시간 데이터베이스 기반 상위 10명</p>
            </div>
            {isLoading && (
              <span className="text-[12px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full font-medium animate-pulse">
                동기화 중...
              </span>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 md:gap-2 mb-4 md:mb-6 bg-white rounded-xl p-1 border border-gray-200">
            <TabButton
              active={activeTab === 'all'}
              onClick={() => setActiveTab('all')}
              label="전체"
            />
            <TabButton
              active={activeTab === 'male'}
              onClick={() => setActiveTab('male')}
              label="남성"
            />
            <TabButton
              active={activeTab === 'female'}
              onClick={() => setActiveTab('female')}
              label="여성"
            />
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 overflow-hidden">
            {currentData.map((entry, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-2 md:gap-4 p-3 md:p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
              >
                {/* Rank */}
                <div className="w-8 md:w-12 flex-shrink-0 flex items-center justify-center">
                  {entry.rank === 1 && (
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                      <Trophy className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                  )}
                  {entry.rank === 2 && (
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
                      <Medal className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                  )}
                  {entry.rank === 3 && (
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                      <Award className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                  )}
                  {entry.rank > 3 && (
                    <div className="text-[14px] md:text-[16px] font-semibold text-gray-400">
                      {entry.rank}
                    </div>
                  )}
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                  {entry.gender === 'male' ? (
                    <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  ) : (
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  )}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] md:text-[15px] font-semibold text-gray-800">
                    {entry.name}
                  </div>
                  <div className="text-[12px] md:text-[13px] text-gray-500">
                    {entry.gender === 'male' ? '남성' : '여성'}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right flex-shrink-0">
                  <div className="text-[18px] md:text-[20px] font-bold text-gray-800">
                    {entry.score.toFixed(2)}
                  </div>
                  <div className="text-[11px] md:text-[12px] text-gray-500">점수</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 md:mt-8 text-center"
          >
            <Link
              to="/"
              className="inline-block w-full md:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl bg-blue-500 text-white font-semibold text-[14px] md:text-[15px] hover:bg-blue-600 transition-colors"
            >
              내 순위 확인하기
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, to, active }: { icon: React.ReactNode; label: string; to: string; active?: boolean }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
        active
          ? 'bg-blue-50 text-blue-600 font-semibold'
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <span>{icon}</span>
      <span className="text-[15px]">{label}</span>
    </Link>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 px-2 md:px-4 rounded-lg text-[13px] md:text-[14px] font-medium transition-colors ${
        active
          ? 'bg-blue-500 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );
}
