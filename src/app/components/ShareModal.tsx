import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Link as LinkIcon, Check, MessageCircle, Loader2 } from 'lucide-react';
import { logGAEvent } from '../utils/analytics';
import { logUserEvent } from '../utils/apiClient';
import { createResultImageBlob, downloadImageBlob, isMobile } from '../utils/resultImage';
import type { ResultImageData } from '../utils/resultImage';
import InstagramIcon from './InstagramIcon';
import MobileSaveModal from './MobileSaveModal';

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
    userType?: string;
    imageData: ResultImageData;
  };
}

export default function ShareModal({ isOpen, onClose, resultData }: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [mobileSaveImage, setMobileSaveImage] = useState<string | null>(null);
  const [mobileSaveContext, setMobileSaveContext] = useState<'instagram' | 'save' | null>(null);

  const closeMobileSaveModal = () => {
    if (mobileSaveImage) {
      URL.revokeObjectURL(mobileSaveImage);
      setMobileSaveImage(null);
      setMobileSaveContext(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      logGAEvent('share_modal_opened', 'engagement', 'Share Modal');
      logUserEvent('share_modal_opened');
      const url = 'https://lyralab.site/percentme';
      setShareUrl(url);
      setImageBlob(null);

      // Pre-capture image in background
      captureResultImage();
    }
  }, [isOpen]);

  const captureResultImage = useCallback(async (): Promise<Blob | null> => {
    try {
      setIsCapturing(true);
      const blob = await createResultImageBlob(resultData.imageData);
      setImageBlob(blob);
      setIsCapturing(false);
      return blob;
    } catch (error) {
      console.error('Failed to capture result image:', error);
      setIsCapturing(false);
      return null;
    }
  }, [resultData.imageData]);

  /**
   * 인스타그램 스토리 공유 (이미지 파일 전달)
   */
  const handleInstagramShare = async () => {
    logGAEvent('insta_share_modal_clicked', 'engagement', 'Share Modal');
    logUserEvent('insta_share_modal_clicked');
    let blob = imageBlob;
    if (!blob) {
      blob = await captureResultImage();
    }
    if (!blob) return;

    const file = new File([blob], 'quiz-result.png', { type: 'image/png' });

    if (isMobile() && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: '전국 순위 테스트 결과',
        });
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return; // User cancelled
        console.warn('Instagram share failed, fallback to modal:', err);
      }
    }

    // Fallback to long-press modal with Instagram context
    const url = URL.createObjectURL(blob);
    setMobileSaveImage(url);
    setMobileSaveContext('instagram');
  };

  /**
   * 카카오톡 공유
   */
  const handleKakaoShare = async () => {
    logGAEvent('kakao_share_modal_clicked', 'engagement', 'Share Modal');
    logUserEvent('kakao_share_modal_clicked');
    const text = `나는 전국 상위 ${resultData.percentile}%! 🏆\n${resultData.userType ? `유형: ${resultData.userType}` : ''}\n당신의 순위는?`;

    if (navigator.share) {
      try {
        await navigator.share({ title: '전국 순위 테스트 결과', text, url: shareUrl });
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
      }
    }

    if (isMobile()) {
      window.location.href = `kakaotalk://send?msg=${encodeURIComponent(`${text}\n${shareUrl}`)}`;
      return;
    }

    try {
      await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
      alert('링크가 복사되었습니다! 카카오톡에 붙여넣기하세요.');
    } catch (_) {}
  };

  /**
   * X (트위터) 공유
   */
  const handleTwitterShare = () => {
    logGAEvent('twitter_share_modal_clicked', 'engagement', 'Share Modal');
    logUserEvent('twitter_share_modal_clicked');
    const text = `나는 전국 상위 ${resultData.percentile}%! 🏆 당신의 순위는?`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=600');
  };

  /**
   * 링크 복사
   */
  const handleCopyLink = async () => {
    logGAEvent('link_copy_clicked', 'engagement', 'Share Modal');
    logUserEvent('link_copy_clicked');
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /**
   * 이미지 다운로드 - 결과 페이지 상단부터 전략 카드까지 저장
   */
  const handleDownloadImage = async () => {
    logGAEvent('image_save_modal_clicked', 'engagement', 'Share Modal');
    logUserEvent('image_save_modal_clicked');
    let blob = imageBlob;
    if (!blob) {
      blob = await captureResultImage();
    }
    if (!blob) return;

    if (isMobile()) {
      const file = new File([blob], `순위테스트-결과-상위${resultData.percentile}%.png`, { type: 'image/png' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: '전국 순위 테스트 결과' });
          return;
        } catch (err) {
          if ((err as Error).name === 'AbortError') return;
        }
      }
      setMobileSaveImage(URL.createObjectURL(blob));
      setMobileSaveContext('save');
    } else {
      const fileName = `순위테스트-결과-상위${resultData.percentile}%-${Date.now()}.png`;
      downloadImageBlob(blob, fileName);
    }
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

          {/* Bottom Sheet Style Modal */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
          >
            <div
              className="w-full max-w-lg rounded-t-[28px] p-6 pb-8 pointer-events-auto"
              style={{
                background: 'var(--cosmic-surface)',
                border: '1px solid var(--glass-border)',
                borderBottom: 'none',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Handle */}
              <div className="flex justify-center mb-4">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[20px] font-semibold text-white">
                  공유하기
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-white/65" />
                </button>
              </div>

              {/* Quick Share Grid */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {/* 인스타 스토리 */}
                <ShareButton
                  icon={<InstagramIcon className="w-6 h-6" />}
                  label="인스타 스토리"
                  color="linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)"
                  onClick={handleInstagramShare}
                />

                {/* 카카오톡 */}
                <ShareButton
                  icon={<MessageCircle className="w-6 h-6" />}
                  label="카카오톡"
                  color="#FEE500"
                  textColor="#000"
                  onClick={handleKakaoShare}
                />

                {/* X (트위터) */}
                <ShareButton
                  icon={<span className="text-[18px] font-bold">𝕏</span>}
                  label="X"
                  color="#000000"
                  border
                  onClick={handleTwitterShare}
                />

                {/* 링크 복사 */}
                <ShareButton
                  icon={copied ? <Check className="w-6 h-6" /> : <LinkIcon className="w-6 h-6" />}
                  label={copied ? '복사됨!' : '링크 복사'}
                  color={copied ? '#00d4aa' : 'rgba(255,255,255,0.1)'}
                  onClick={handleCopyLink}
                />
              </div>

              {/* 이미지 저장 */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleDownloadImage}
                disabled={isCapturing}
                className="w-full py-4 rounded-2xl font-semibold text-[16px] flex items-center justify-center gap-2.5 transition-colors disabled:opacity-50"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'white',
                }}
              >
                {isCapturing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>캡처 중...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>결과 이미지로 저장하기</span>
                  </>
                )}
              </motion.button>

              {/* 도전장 보내기 */}
              <div className="mt-4 text-center">
                <button
                  onClick={handleCopyLink}
                  className="text-[14px] hover:text-white transition-colors"
                  style={{ color: resultData.gradeConfig.color }}
                >
                  {resultData.percentile <= 15
                    ? '친구들이 날 이길 수 있을까? →'
                    : '친구에게 도전장 보내기 →'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* 모바일 이미지 길게 눌러 저장 유도 모달 */}
          <AnimatePresence>
            {mobileSaveImage && mobileSaveContext && (
              <MobileSaveModal
                imageUrl={mobileSaveImage}
                context={mobileSaveContext}
                onClose={closeMobileSaveModal}
                zIndex="z-[60]"
              />
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * 공유 버튼 그리드 아이템
 */
function ShareButton({
  icon,
  label,
  color,
  textColor,
  border,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  textColor?: string;
  border?: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform"
        style={{
          background: color,
          color: textColor || 'white',
          border: border ? '1px solid rgba(255,255,255,0.2)' : 'none',
        }}
      >
        {icon}
      </div>
      <span className="text-[11px] text-white/65">{label}</span>
    </motion.button>
  );
}
