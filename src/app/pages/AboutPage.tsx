import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  Target,
  BarChart3,
  Zap,
  Dumbbell,
  Wallet,
  Users,
  Palette,
  Brain,
  FileText,
  Rocket,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[2px] bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 20 - 10],
              x: [0, Math.random() * 20 - 10],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Blurred background element */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 blur-[100px] pointer-events-none">
        <div className="w-[500px] h-[500px] bg-blue-500 rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-[64px] font-semibold mb-6 leading-tight" style={{
            textShadow: '0 0 80px rgba(99, 102, 241, 0.4)'
          }}>
            당신의 진짜 점수를
            <br />
            발견하세요
          </h1>
          <p className="text-[21px] text-white/70 mb-8">
            25개의 문항으로 확인하는
            <br />
            대한민국 실시간 순위 테스트
          </p>
          <Link
            to="/"
            className="inline-block px-12 py-4 rounded-full bg-white text-black font-bold text-[17px] hover:scale-105 transition-transform"
            style={{
              boxShadow: '0 20px 60px rgba(255, 255, 255, 0.2)',
            }}
          >
            지금 바로 시작하기
          </Link>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-[40px] font-semibold text-center mb-12">
            왜 이 테스트를 해야 할까요?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Target size={56} strokeWidth={1.5} />}
              title="정확한 분석"
              description="5가지 핵심 카테고리로 당신의 생활을 다각도로 분석합니다"
              delay={0.3}
            />
            <FeatureCard
              icon={<BarChart3 size={56} strokeWidth={1.5} />}
              title="실시간 순위"
              description="수천 명의 데이터를 기반으로 한 정확한 백분위 순위"
              delay={0.4}
            />
            <FeatureCard
              icon={<Zap size={56} strokeWidth={1.5} />}
              title="즉시 결과"
              description="3분이면 당신의 점수와 전국 순위를 확인할 수 있습니다"
              delay={0.5}
            />
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-[40px] font-semibold text-center mb-12">
            5가지 카테고리
          </h2>

          <div className="space-y-4">
            <CategoryCard
              number="01"
              icon={<Dumbbell size={40} strokeWidth={1.5} />}
              title="자기관리"
              description="건강, 운동, 식습관, 수면 등 기본적인 자기관리 능력을 측정합니다"
              color="#3B82F6"
              delay={0.7}
            />
            <CategoryCard
              number="02"
              icon={<Wallet size={40} strokeWidth={1.5} />}
              title="경제력"
              description="재무 관리, 저축, 투자 등 경제적 안정성과 계획성을 평가합니다"
              color="#10B981"
              delay={0.8}
            />
            <CategoryCard
              number="03"
              icon={<Users size={40} strokeWidth={1.5} />}
              title="사회성"
              description="대인관계, 네트워킹, 의사소통 능력 등 사회적 역량을 확인합니다"
              color="#F59E0B"
              delay={0.9}
            />
            <CategoryCard
              number="04"
              icon={<Palette size={40} strokeWidth={1.5} />}
              title="라이프스타일"
              description="취미, 여가, 자기계발 등 삶의 질과 균형을 살펴봅니다"
              color="#8B5CF6"
              delay={1.0}
            />
            <CategoryCard
              number="05"
              icon={<Brain size={40} strokeWidth={1.5} />}
              title="마인드셋"
              description="목표의식, 성장 마인드, 긍정성 등 정신적 태도를 분석합니다"
              color="#EF4444"
              delay={1.1}
            />
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mb-20"
        >
          <h2 className="text-[40px] font-semibold text-center mb-12">
            어떻게 진행되나요?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StepCard number="1" icon={<Zap size={48} strokeWidth={1.5} />} title="성별 선택" delay={1.3} />
            <StepCard number="2" icon={<FileText size={48} strokeWidth={1.5} />} title="25개 문항" delay={1.4} />
            <StepCard number="3" icon={<Target size={48} strokeWidth={1.5} />} title="즉시 분석" delay={1.5} />
            <StepCard number="4" icon={<Rocket size={48} strokeWidth={1.5} />} title="결과 공유" delay={1.6} />
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          className="rounded-[32px] p-12 text-center mb-12"
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <h2 className="text-[48px] font-semibold mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-[21px] text-white/80 mb-8">
            3분이면 당신의 전국 순위를 확인할 수 있습니다
          </p>
          <Link
            to="/"
            className="inline-block px-12 py-4 rounded-full bg-white text-black font-bold text-[17px] hover:scale-105 transition-transform"
            style={{
              boxShadow: '0 20px 60px rgba(255, 255, 255, 0.2)',
            }}
          >
            무료로 시작하기
          </Link>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="pt-8 border-t border-white/10 text-center"
        >
          <div className="flex items-center justify-center gap-8 text-[15px] text-white/45">
            <Link to="/leaderboard" className="hover:text-white transition-colors">
              리더보드
            </Link>
            <Link to="/stats" className="hover:text-white transition-colors">
              통계 보기
            </Link>
            <Link to="/admin" className="hover:text-white transition-colors">
              관리자
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05 }}
      className="rounded-[24px] p-8 text-center"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="mb-4 flex justify-center text-blue-400">{icon}</div>
      <h3 className="text-[21px] font-semibold mb-3">{title}</h3>
      <p className="text-[15px] text-white/65 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

function CategoryCard({
  number,
  icon,
  title,
  description,
  color,
  delay,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      className="rounded-[24px] p-6 flex items-start gap-6"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-[20px] font-bold flex-shrink-0"
          style={{ background: color }}
        >
          {number}
        </div>
        <div className="flex items-center justify-center text-white">{icon}</div>
      </div>
      <div className="flex-1">
        <h3 className="text-[21px] font-semibold mb-2">{title}</h3>
        <p className="text-[15px] text-white/65 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

function StepCard({
  number,
  icon,
  title,
  delay,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05 }}
      className="text-center rounded-[20px] p-6"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-[28px] font-bold mx-auto mb-4">
        {number}
      </div>
      <div className="mb-3 flex justify-center text-blue-400">{icon}</div>
      <h3 className="text-[17px] font-semibold">{title}</h3>
    </motion.div>
  );
}
