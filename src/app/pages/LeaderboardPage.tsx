import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Home, BarChart3, Info, User, Users, Crown } from 'lucide-react';
import { fetchLeaderboard } from '../utils/apiClient';
import type React from 'react';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'male' | 'female'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboards, setLeaderboards] = useState<any>({
    all: [],
    male: [],
    female: [],
  });

  useEffect(() => {
    let active = true;
    async function loadLeaderboard() {
      try {
        const response = await fetchLeaderboard();
        if (response.success && response.data && active) {
          const { all, male, female } = response.data;
          setLeaderboards({
            all: all || [],
            male: male || [],
            female: female || [],
          });
        }
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        if (active) setIsLoading(false);
      }
    }
    loadLeaderboard();
    return () => { active = false; };
  }, []);

  const [myId, setMyId] = useState<string | null>(null);

  useEffect(() => {
    const savedResult = localStorage.getItem('quiz-result');
    if (savedResult) {
      try {
        const parsed = JSON.parse(savedResult);
        if (parsed.result && parsed.result.id) {
          setMyId(parsed.result.id);
        }
      } catch (e) {
        console.error('Failed to parse quiz-result:', e);
      }
    }
  }, []);

  const currentData = leaderboards[activeTab];
  const myEntry = currentData.find((entry: any) => entry.id === myId);

  const scrollToMyRank = () => {
    if (!myId) return;
    const element = document.getElementById(myId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.style.outline = '3px solid var(--action-blue)';
      element.style.boxShadow = '0 0 25px rgba(0, 102, 204, 0.4)';
      element.style.zIndex = '10';
      setTimeout(() => {
        element.style.outline = 'none';
        element.style.boxShadow = 'none';
        element.style.zIndex = 'auto';
      }, 2000);
    }
  };

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
              <p className="text-[14px] md:text-[15px] text-gray-500">실시간 데이터베이스 기반 전체 순위</p>
            </div>
            {isLoading && (
              <span className="text-[12px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full font-medium animate-pulse">
                동기화 중...
              </span>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 md:gap-2 mb-4 md:mb-6 bg-white rounded-xl p-1 border border-gray-200">
            <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')} label="전체" />
            <TabButton active={activeTab === 'male'} onClick={() => setActiveTab('male')} label="남성" />
            <TabButton active={activeTab === 'female'} onClick={() => setActiveTab('female')} label="여성" />
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="p-12 md:p-16 text-center flex flex-col items-center justify-center bg-white">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-600 font-semibold text-[15px] mb-1">데이터를 불러오는 중입니다...</p>
                <p className="text-gray-400 text-[13px] animate-pulse">실시간 순위표를 동기화하고 있습니다.</p>
              </div>
            ) : currentData.length === 0 ? (
              <div className="p-8 md:p-12 text-center flex flex-col items-center justify-center bg-white">
                <Trophy className="w-12 h-12 text-gray-300 mb-3 animate-pulse" />
                <p className="text-gray-500 font-semibold text-[15px] mb-1">등록된 순위 데이터가 없습니다.</p>
                <p className="text-gray-400 text-[13px]">첫 번째 순위 기록을 남겨보세요!</p>
              </div>
            ) : (
              <div>
                {currentData.map((entry: any, idx: number) => {
                  const isMe = entry.id && entry.id === myId;
                  const shouldAnimate = idx < 30;

                  return (
                    <motion.div
                      key={entry.id || idx}
                      id={entry.id || undefined}
                      initial={shouldAnimate ? { opacity: 0, x: -20 } : undefined}
                      animate={shouldAnimate ? { opacity: 1, x: 0 } : undefined}
                      transition={shouldAnimate ? { delay: Math.min(idx, 15) * 0.04 } : undefined}
                      className={`flex items-center gap-2 md:gap-4 p-3 md:p-4 transition-all duration-300 border-b border-gray-100 last:border-0 ${
                        isMe
                          ? 'bg-blue-50/70 border-l-4 border-l-blue-500 shadow-inner'
                          : 'hover:bg-gray-50'
                      }`}
                      style={{ scrollMargin: '100px' }}
                    >
                      {/* Rank */}
                      <div className="w-8 md:w-12 flex-shrink-0 flex items-center justify-center">
                        {entry.rank === 1 && (
                          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-sm">
                            <Trophy className="w-4 h-4 md:w-5 md:h-5 text-white" />
                          </div>
                        )}
                        {entry.rank === 2 && (
                          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow-sm">
                            <Medal className="w-4 h-4 md:w-5 md:h-5 text-white" />
                          </div>
                        )}
                        {entry.rank === 3 && (
                          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-sm">
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
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${
                        isMe ? 'from-blue-500 to-blue-600' : 'from-blue-400 to-purple-500'
                      }`}>
                        {entry.gender === 'male' ? (
                          <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        ) : (
                          <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        )}
                      </div>

                      {/* Name */}
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] md:text-[15px] font-semibold text-gray-800 flex items-center flex-wrap gap-1">
                          {isMe ? '나 (내 기록)' : entry.name}
                          {isMe && (
                            <span className="text-[10px] sm:text-[11px] font-bold text-white bg-blue-500 px-2.5 py-0.5 rounded-full animate-pulse shadow-md">
                              MY
                            </span>
                          )}
                        </div>
                        <div className="text-[12px] md:text-[13px] text-gray-500">
                          {entry.gender === 'male' ? '남성' : '여성'}
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right flex-shrink-0">
                        <div className={`text-[18px] md:text-[20px] font-bold ${isMe ? 'text-blue-600' : 'text-gray-800'}`}>
                          {entry.score.toFixed(2)}
                        </div>
                        <div className="text-[11px] md:text-[12px] text-gray-500">점수</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 md:mt-8 text-center"
          >
            <Link
              to="/"
              className="inline-block w-full md:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl bg-blue-500 text-white font-semibold text-[14px] md:text-[15px] hover:bg-blue-600 transition-colors shadow-md"
            >
              다시 테스트하기
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Floating Jump to My Rank Button */}
      <AnimatePresence>
        {myId && myEntry && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 md:right-8 z-40"
          >
            <motion.button
              onClick={scrollToMyRank}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-3 rounded-full text-white font-bold text-[14px] shadow-lg border cursor-pointer bg-blue-500 shadow-[0_10px_25px_rgba(59,130,246,0.4)] border-blue-400/20"
            >
              <Crown size={16} />
              <span>내 순위 ({myEntry.rank}위) 바로가기</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon, label, to, active }: { icon: React.ReactNode; label: string; to: string; active?: boolean }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
        active ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
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
        active ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );
}
