declare global {
  interface Window {
    Kakao: any;
  }
}

export function initKakao(): boolean {
  if (typeof window !== 'undefined' && window.Kakao) {
    if (!window.Kakao.isInitialized()) {
      const key = import.meta.env.VITE_KAKAO_APP_KEY;
      if (!key) {
        console.warn('VITE_KAKAO_APP_KEY is not defined. Kakao SDK will not initialize.');
        return false;
      }
      try {
        window.Kakao.init(key);
        return true;
      } catch (e) {
        console.error('Kakao init failed:', e);
        return false;
      }
    }
    return true;
  }
  return false;
}

interface KakaoShareParams {
  percentile: number;
  userType: string;
  grade: string;
}

export function shareToKakao({ percentile, userType, grade }: KakaoShareParams): boolean {
  const isInit = initKakao();
  if (!isInit) {
    return false;
  }

  const shareUrl = 'https://lyralab.site/percentme';
  const description = `${userType ? `유형: ${userType} | ` : ''}등급: ${grade}`;

  try {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `나는 전국 상위 ${percentile}%! 🏆`,
        description: description,
        imageUrl: 'https://lyralab.site/og_thumbnail.png',
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: '나도 테스트하기',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    });
    return true;
  } catch (err) {
    console.error('Kakao share error:', err);
    return false;
  }
}
