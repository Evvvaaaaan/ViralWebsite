import { Download } from 'lucide-react';
import { motion } from 'motion/react';

export default function DownloadPage() {
  const handleDownload = () => {
    // Create a download link
    const link = document.createElement('a');
    link.href = '/quiz-app-complete.tar.gz';
    link.download = 'quiz-app-complete.tar.gz';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--cosmic-deep)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full rounded-[24px] p-8 text-center"
        style={{
          background: 'var(--cosmic-surface)',
          border: '1px solid var(--glass-border)',
        }}
      >
        <div className="text-[48px] mb-4">📦</div>

        <h1 className="text-[28px] font-semibold text-white mb-4">
          퀴즈 앱 다운로드
        </h1>

        <p className="text-[15px] text-white/65 mb-8">
          전체 소스 코드가 포함된 압축 파일입니다.
          <br />
          다운로드 후 압축을 풀고 사용하세요.
        </p>

        <div className="mb-6 p-4 rounded-lg" style={{ background: 'var(--glass-bg)' }}>
          <div className="text-[13px] text-white/65 mb-2">파일 정보</div>
          <div className="text-[15px] text-white">
            <strong>quiz-app-complete.tar.gz</strong>
          </div>
          <div className="text-[13px] text-white/45 mt-1">크기: 75KB</div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDownload}
          className="w-full py-4 rounded-full font-semibold text-[17px] flex items-center justify-center gap-2"
          style={{
            background: 'var(--action-blue)',
            color: 'white',
          }}
        >
          <Download className="w-5 h-5" strokeWidth={2} />
          <span>다운로드</span>
        </motion.button>

        <div className="mt-6 p-4 rounded-lg text-left" style={{ background: 'var(--glass-bg)' }}>
          <div className="text-[13px] text-white/65 mb-2">📝 사용 방법</div>
          <div className="text-[13px] text-white/80 space-y-1">
            <div>1. 압축 파일 다운로드</div>
            <div>2. 압축 해제: <code className="text-blue-400">tar -xzf quiz-app-complete.tar.gz</code></div>
            <div>3. 폴더 이동: <code className="text-blue-400">cd quiz-app-export</code></div>
            <div>4. 설치: <code className="text-blue-400">pnpm install</code></div>
            <div>5. 실행: <code className="text-blue-400">pnpm run dev</code></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
