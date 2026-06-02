import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Link as LinkIcon, Check } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultData: {
    percentile: number;
    grade: string;
    gender: 'male' | 'female';
    gradeConfig: {
      color: string;
      label: string;
      icon: any;
    };
    userType?: {
      name: string;
      rarity: number;
    };
  };
}

export default function ShareModal({ isOpen, onClose, resultData }: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Generate shareable URL
      const url = `${window.location.origin}?challenge=true`;
      setShareUrl(url);

      // Generate share image
      generateShareImage();
    }
  }, [isOpen, resultData]);

  const generateShareImage = async () => {
    // Create a canvas with the result - optimized for social media (1.91:1 ratio)
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630; // Optimized for Facebook, Twitter, LinkedIn

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient - more dramatic
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(0.5, '#1a1a2e');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add glow effect for top grades
    if (['S', 'A', 'B'].includes(resultData.grade)) {
      const glowGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        400
      );
      glowGradient.addColorStop(0, `${resultData.gradeConfig.color}40`);
      glowGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Left side - Result display
    const leftWidth = canvas.width * 0.55;

    // User type name as title
    const typeTitle = resultData.userType?.name || '대한민국 순위';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 52px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(typeTitle, 60, 120);

    // Rarity badge
    if (resultData.userType) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '400 32px Inter, sans-serif';
      ctx.fillText(`전체 ${resultData.userType.rarity}%`, 60, 165);
    }

    // Main percentage - bigger and bolder
    ctx.fillStyle = resultData.gradeConfig.color;
    ctx.font = 'bold 140px Inter, sans-serif';
    ctx.shadowColor = resultData.gradeConfig.color;
    ctx.shadowBlur = 40;
    ctx.fillText(`상위 ${resultData.percentile}%`, 60, 320);

    // Reset shadow
    ctx.shadowBlur = 0;

    // Grade badge - left aligned
    ctx.fillStyle = resultData.gradeConfig.color;
    ctx.font = 'bold 56px Inter, sans-serif';
    ctx.fillText(`${resultData.gradeConfig.label} 등급`, 60, 400);

    // Provocative challenge message
    let challengeMsg = '';
    if (resultData.percentile <= 5) {
      challengeMsg = '이길 자신 있어?';
    } else if (resultData.percentile <= 15) {
      challengeMsg = '너도 도전해봐';
    } else if (resultData.percentile <= 40) {
      challengeMsg = '나보다 잘할 수 있어?';
    } else {
      challengeMsg = '네 순위는 어떨까?';
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '500 38px Inter, sans-serif';
    ctx.fillText(challengeMsg, 60, 490);

    // Right side - Visual impact
    const rightX = leftWidth + 80;

    // Decorative element - vertical bars showing rank
    const barCount = 10;
    const barWidth = 35;
    const barGap = 15;
    const barStartY = 100;
    const barMaxHeight = 400;

    for (let i = 0; i < barCount; i++) {
      const isHighlighted = i === Math.floor(resultData.percentile / 10);
      const barHeight = barMaxHeight * (1 - i / barCount);
      const x = rightX + i * (barWidth + barGap);
      const y = barStartY + (barMaxHeight - barHeight);

      ctx.fillStyle = isHighlighted
        ? resultData.gradeConfig.color
        : 'rgba(255, 255, 255, 0.1)';

      if (isHighlighted) {
        ctx.shadowColor = resultData.gradeConfig.color;
        ctx.shadowBlur = 20;
      }

      // Rounded rectangle
      const radius = 8;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + barWidth - radius, y);
      ctx.arcTo(x + barWidth, y, x + barWidth, y + radius, radius);
      ctx.lineTo(x + barWidth, y + barHeight - radius);
      ctx.arcTo(x + barWidth, y + barHeight, x + barWidth - radius, y + barHeight, radius);
      ctx.lineTo(x + radius, y + barHeight);
      ctx.arcTo(x, y + barHeight, x, y + barHeight - radius, radius);
      ctx.lineTo(x, y + radius);
      ctx.arcTo(x, y, x + radius, y, radius);
      ctx.closePath();
      ctx.fill();

      if (isHighlighted) {
        ctx.shadowBlur = 0;
      }
    }

    // Bottom CTA
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '400 28px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👉 전국 순위 테스트', canvas.width / 2, 580);

    setImageDataUrl(canvas.toDataURL('image/png'));
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadImage = () => {
    if (!imageDataUrl) return;

    const link = document.createElement('a');
    link.download = `quiz-result-${resultData.percentile}.png`;
    link.href = imageDataUrl;
    link.click();
  };

  const handleNativeShare = async () => {
    if (!imageDataUrl) return;

    try {
      // Convert data URL to blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'quiz-result.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: '전국 순위 테스트 결과',
          text: `나는 전국 상위 ${resultData.percentile}%! 당신의 순위는?`,
          url: shareUrl,
          files: [file],
        });
      } else {
        // Fallback: just copy link
        handleCopyLink();
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const handleKakaoShare = () => {
    // Kakao SDK would be initialized in production
    // For now, fallback to URL scheme
    const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}`;
    window.open(kakaoUrl, '_blank', 'width=600,height=600');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
          >
            <div
              className="max-w-2xl w-full rounded-[24px] p-8 pointer-events-auto"
              style={{
                background: 'var(--cosmic-surface)',
                border: '1px solid var(--glass-border)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-[24px] font-semibold text-white mb-1">
                    {resultData.percentile <= 5
                      ? '🔥 자랑할 준비 됐어요!'
                      : resultData.percentile <= 15
                      ? '상위권 결과 공유하기'
                      : '친구들에게 도전장 보내기'}
                  </h2>
                  <p className="text-[14px] text-white/65">
                    {resultData.percentile <= 15
                      ? '상위 ' + resultData.percentile + '%는 공유할 가치가 있어요'
                      : '친구 순위가 궁금하지 않나요?'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-white/65" />
                </button>
              </div>

              {/* Preview Image */}
              {imageDataUrl && (
                <div className="mb-6 rounded-[18px] overflow-hidden" style={{ background: '#000' }}>
                  <img
                    src={imageDataUrl}
                    alt="Share preview"
                    className="w-full"
                    style={{ display: 'block' }}
                  />
                </div>
              )}

              {/* Share URL */}
              <div className="mb-6">
                <label className="text-[13px] text-white/65 mb-2 block">
                  공유 링크
                </label>
                <div className="flex gap-2">
                  <div
                    className="flex-1 px-4 py-3 rounded-lg text-[15px] text-white/80 truncate"
                    style={{
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                    }}
                  >
                    {shareUrl}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyLink}
                    className="px-4 py-3 rounded-lg flex items-center gap-2"
                    style={{
                      background: copied ? 'var(--grade-b)' : 'var(--action-blue)',
                      color: 'white',
                    }}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-[14px]">복사됨</span>
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-4 h-4" />
                        <span className="text-[14px]">복사</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNativeShare}
                  className="w-full py-5 rounded-full font-semibold text-[18px]"
                  style={{
                    background: resultData.grade === 'S'
                      ? `linear-gradient(135deg, ${resultData.gradeConfig.color}, #ffd700)`
                      : resultData.gradeConfig.color,
                    color: 'white',
                  }}
                >
                  {resultData.percentile <= 5
                    ? '🏆 지금 바로 자랑하기'
                    : resultData.percentile <= 15
                    ? '💪 친구들한테 자랑하기'
                    : '📤 친구에게 도전장 보내기'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleKakaoShare}
                  className="w-full py-4 rounded-full font-semibold text-[17px]"
                  style={{
                    background: '#FEE500',
                    color: '#000000',
                  }}
                >
                  카카오톡으로 "이거 이길 수 있어?" 보내기
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownloadImage}
                  className="w-full py-4 rounded-full font-semibold text-[17px] flex items-center justify-center gap-2"
                  style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    color: 'white',
                  }}
                >
                  <Download className="w-5 h-5" />
                  <span>이미지로 저장하기</span>
                </motion.button>
              </div>

              {/* Challenge Link */}
              <div className="mt-6 text-center">
                <p className="text-[14px] text-white/65 mb-2">
                  링크로 친구 순위 확인하기
                </p>
                <button
                  onClick={handleCopyLink}
                  className="text-[15px] hover:text-white transition-colors"
                  style={{ color: resultData.gradeConfig.color }}
                >
                  {resultData.percentile <= 15
                    ? '친구들이 날 이길 수 있을까? →'
                    : '친구 순위 확인하기 →'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
