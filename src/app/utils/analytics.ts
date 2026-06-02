// Google Analytics (GA4) 비동기 마운트 및 이벤트 로깅 유틸리티

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Google Analytics (GA4) 동적 초기화
 * @param measurementId GA4 측정 ID (예: G-XXXXXXXXXX)
 */
export const initGA = (measurementId: string) => {
  if (typeof window === 'undefined' || window.gtag) return;

  try {
    // 1. Google Gtag 스크립트 비동기 마운트
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // 2. dataLayer 및 gtag 초기화
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    // 3. 기본 설정 실행
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: true, // 페이지뷰 자동 로깅
    });

    console.log(`[Analytics] Google Analytics 4 (${measurementId}) 초기화 성공`);
  } catch (error) {
    console.error('[Analytics] GA4 초기화 실패:', error);
  }
};

/**
 * Google Analytics 4 맞춤 이벤트 로깅
 * @param action 이벤트 액션명 (예: 'quiz_start_clicked')
 * @param category 이벤트 카테고리 (예: 'engagement')
 * @param label 상세 설명 라벨 (선택)
 * @param value 수치형 가치값 (선택)
 */
export const logGAEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
      console.log(`[Analytics] GA4 Event Logged: ${action}`, { category, label, value });
    } catch (error) {
      console.error('[Analytics] GA4 이벤트 로깅 실패:', error);
    }
  }
};
