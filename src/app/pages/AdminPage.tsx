import { Link } from 'react-router';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'settings'>('overview');

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      {/* Header */}
      <div className="border-b border-[var(--hairline)] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-[28px] font-semibold">관리자 패널</h1>
            <Link
              to="/"
              className="px-6 py-2 rounded-full bg-[var(--action-blue)] text-white hover:opacity-90 transition-opacity text-[15px]"
            >
              퀴즈로 돌아가기
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--hairline)] bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <TabButton
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            >
              개요
            </TabButton>
            <TabButton
              active={activeTab === 'questions'}
              onClick={() => setActiveTab('questions')}
            >
              문항 관리
            </TabButton>
            <TabButton
              active={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
            >
              설정
            </TabButton>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'questions' && <QuestionsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="relative py-4 text-[15px] transition-colors"
      style={{
        color: active ? 'var(--action-blue)' : 'var(--ink-muted-48)',
        fontWeight: active ? 600 : 400,
      }}
    >
      {children}
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--action-blue)]"
        />
      )}
    </button>
  );
}

function OverviewTab() {
  const [stats, setStats] = useState<{ total: number; real: number; mock: number } | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initMessage, setInitMessage] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2ae6dc9b/stats`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const initializeMockData = async () => {
    if (!confirm('2,000개의 목업 데이터를 생성합니다. 계속하시겠습니까?\n(기존 목업 데이터는 유지됩니다)')) {
      return;
    }

    setIsInitializing(true);
    setInitMessage('목업 데이터 생성 중...');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2ae6dc9b/init-mock-data`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setInitMessage(`✅ ${data.count}개의 목업 데이터가 생성되었습니다!`);
        await loadStats();
      } else {
        setInitMessage('❌ 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Failed to initialize mock data:', error);
      setInitMessage('❌ 오류가 발생했습니다.');
    } finally {
      setIsInitializing(false);
      setTimeout(() => setInitMessage(''), 5000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdminCard
          title="전체 데이터"
          value={stats?.total.toLocaleString() || '-'}
          change={stats ? `실제 ${stats.real}개` : '-'}
        />
        <AdminCard
          title="실제 사용자"
          value={stats?.real.toLocaleString() || '-'}
          change={stats ? `목업 ${stats.mock}개` : '-'}
        />
        <AdminCard
          title="목업 데이터"
          value={stats?.mock.toLocaleString() || '-'}
          change={stats ? `전체 ${stats.total}개` : '-'}
        />
      </div>

      <div className="bg-white rounded-[24px] p-6 border border-[var(--hairline)]">
        <h2 className="text-[21px] font-semibold mb-4">데이터베이스 관리</h2>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-[12px]">
            <div className="flex items-start gap-3">
              <div className="text-[20px]">ℹ️</div>
              <div className="flex-1">
                <div className="text-[15px] font-medium text-blue-900 mb-1">
                  목업 데이터 정보
                </div>
                <div className="text-[13px] text-blue-700">
                  목업 데이터는 실제 사용자들이 높은 순위를 받을 수 있도록 낮은 점수 위주로 생성됩니다.
                  <br />
                  분포: 40%(40~50점), 30%(50~60점), 20%(60~70점), 10%(70~100점)
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={initializeMockData}
            disabled={isInitializing}
            className="w-full px-6 py-4 rounded-[12px] bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-[15px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isInitializing ? '생성 중...' : '🎲 목업 데이터 2,000개 생성'}
          </button>

          {initMessage && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-[12px] text-[14px] text-green-800 text-center">
              {initMessage}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[24px] p-6 border border-[var(--hairline)]">
        <h2 className="text-[21px] font-semibold mb-4">빠른 작업</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ActionButton icon="📊" label="통계 보기" to="/stats" />
          <ActionButton icon="🔄" label="데이터 새로고침" onClick={loadStats} />
          <ActionButton icon="📥" label="리더보드 보기" to="/leaderboard" />
          <ActionButton icon="🏆" label="순위 보기" to="/stats" />
        </div>
      </div>

      <div className="bg-white rounded-[24px] p-6 border border-[var(--hairline)]">
        <h2 className="text-[21px] font-semibold mb-4">시스템 상태</h2>
        <div className="space-y-3">
          <StatusRow label="서버 상태" status="정상" color="green" />
          <StatusRow label="데이터베이스" status={stats ? '정상' : '연결 중...'} color={stats ? 'green' : 'yellow'} />
          <StatusRow label="Supabase" status="연결됨" color="green" />
          <StatusRow label="총 데이터" status={`${stats?.total || 0}개`} color="blue" />
        </div>
      </div>
    </div>
  );
}

function QuestionsTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[24px] p-6 border border-[var(--hairline)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[21px] font-semibold">문항 목록</h2>
          <button className="px-4 py-2 rounded-full bg-[var(--action-blue)] text-white text-[15px]">
            + 새 문항 추가
          </button>
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((num) => (
            <div
              key={num}
              className="p-4 border border-[var(--hairline)] rounded-[12px] hover:bg-[var(--canvas-parchment)] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-[15px] font-medium mb-1">
                    질문 {num}. 하루에 물을 얼마나 마시나요?
                  </div>
                  <div className="text-[13px] text-[var(--ink-muted-48)]">
                    카테고리: 자기관리 • 응답률: 98.5%
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-[13px] text-[var(--action-blue)] hover:bg-blue-50 rounded-lg transition-colors">
                    수정
                  </button>
                  <button className="px-3 py-1.5 text-[13px] text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[24px] p-6 border border-[var(--hairline)]">
        <h2 className="text-[21px] font-semibold mb-6">일반 설정</h2>
        <div className="space-y-4">
          <SettingRow
            label="퀴즈 제목"
            description="랜딩 페이지에 표시되는 제목"
            value="바이럴 퀴즈"
          />
          <SettingRow
            label="결과 공유 활성화"
            description="사용자가 결과를 SNS에 공유할 수 있게 합니다"
            toggle
          />
          <SettingRow
            label="챌린지 모드"
            description="친구 챌린지 기능을 활성화합니다"
            toggle
          />
          <SettingRow
            label="세션 복구"
            description="중단된 퀴즈를 복구할 수 있게 합니다"
            toggle
          />
        </div>
      </div>

      <div className="bg-white rounded-[24px] p-6 border border-[var(--hairline)]">
        <h2 className="text-[21px] font-semibold mb-6">고급 설정</h2>
        <div className="space-y-4">
          <SettingRow
            label="분석 추적"
            description="사용자 행동 분석을 위한 데이터 수집"
            toggle
          />
          <SettingRow
            label="A/B 테스트"
            description="문항 순서 및 디자인 A/B 테스트"
            toggle
          />
          <SettingRow
            label="데이터 보관 기간"
            description="응답 데이터 보관 기간 (일)"
            value="90"
          />
        </div>
      </div>
    </div>
  );
}

function AdminCard({ title, value, change }: { title: string; value: string; change: string }) {
  const isPositive = change.startsWith('+');
  return (
    <div className="bg-white rounded-[24px] p-6 border border-[var(--hairline)]">
      <div className="text-[13px] text-[var(--ink-muted-48)] mb-2">{title}</div>
      <div className="text-[32px] font-semibold mb-1">{value}</div>
      <div
        className="text-[13px]"
        style={{ color: isPositive ? '#10B981' : '#EF4444' }}
      >
        {change}
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  to,
  onClick,
}: {
  icon: string;
  label: string;
  to?: string;
  onClick?: () => void;
}) {
  const content = (
    <div className="flex items-center gap-3 p-4 border border-[var(--hairline)] rounded-[12px] hover:bg-[var(--canvas-parchment)] transition-colors cursor-pointer">
      <div className="text-[24px]">{icon}</div>
      <div className="text-[15px]">{label}</div>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return <button onClick={onClick}>{content}</button>;
}

function StatusRow({ label, status, color }: { label: string; status: string; color: string }) {
  const colors: Record<string, string> = {
    green: '#10B981',
    blue: '#3B82F6',
    yellow: '#F59E0B',
    red: '#EF4444',
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-[15px]">{label}</span>
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: colors[color] }}
        />
        <span className="text-[15px]" style={{ color: colors[color] }}>
          {status}
        </span>
      </div>
    </div>
  );
}

function SettingRow({
  label,
  description,
  value,
  toggle,
}: {
  label: string;
  description: string;
  value?: string;
  toggle?: boolean;
}) {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--hairline)] last:border-0">
      <div className="flex-1">
        <div className="text-[15px] font-medium mb-1">{label}</div>
        <div className="text-[13px] text-[var(--ink-muted-48)]">{description}</div>
      </div>
      {toggle ? (
        <button
          onClick={() => setEnabled(!enabled)}
          className="ml-4 w-12 h-6 rounded-full transition-colors relative"
          style={{
            background: enabled ? 'var(--action-blue)' : 'var(--divider-soft)',
          }}
        >
          <motion.div
            className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
            animate={{ left: enabled ? '26px' : '2px' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
      ) : (
        <input
          type="text"
          defaultValue={value}
          className="ml-4 px-3 py-1.5 border border-[var(--hairline)] rounded-lg text-[15px] w-32"
        />
      )}
    </div>
  );
}
