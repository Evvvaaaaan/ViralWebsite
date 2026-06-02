# 전국 순위 퀴즈 애플리케이션

React + TypeScript + Tailwind CSS로 제작된 바이럴 인터랙티브 퀴즈 앱입니다.

## 🎯 주요 기능

- **25개 질문 퀴즈**: 자기관리, 경제력, 사회성, 라이프스타일, 마인드셋 5개 카테고리
- **실시간 진행률**: 섹션별 진행 상태 표시 및 완료 애니메이션
- **등급 시스템**: S, A, B, C, D, F 등급 및 전국 순위 계산
- **반응형 디자인**: 모바일/데스크톱 최적화
- **세션 저장**: 중단 시 이어서 진행 가능
- **애니메이션**: Motion(Framer Motion) 기반 부드러운 전환 효과
- **소셜 공유**: SNS 최적화 이미지 자동 생성 (1200x630)
- **도전장 모드**: 친구 초대 및 비교 기능

## 🚀 시작하기

### 설치

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm run dev

# 프로덕션 빌드
pnpm run build
```

## 📦 기술 스택

- **React 18.3.1** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **Tailwind CSS 4** - 유틸리티 기반 스타일링
- **Motion** - 애니메이션
- **Recharts** - 차트 시각화
- **html2canvas** - 이미지 캡처
- **canvas-confetti** - 축하 효과
- **Radix UI** - 접근성 좋은 UI 컴포넌트
- **Lucide React** - 아이콘

## 📂 프로젝트 구조

```
src/
├── app/
│   ├── components/
│   │   ├── LandingScreen.tsx         # 랜딩 페이지
│   │   ├── GenderScreen.tsx          # 성별 선택 화면
│   │   ├── QuizScreen.tsx            # 퀴즈 화면 (핵심)
│   │   ├── LoadingScreen.tsx         # 로딩 애니메이션
│   │   ├── ResultScreen.tsx          # 결과 화면
│   │   ├── ShareModal.tsx            # 공유 모달
│   │   ├── DownloadPage.tsx          # 코드 다운로드 페이지
│   │   ├── ChallengeModal.tsx        # 도전장 모달
│   │   └── SessionRecoveryBanner.tsx # 세션 복구 배너
│   ├── data/
│   │   └── questions.ts              # 퀴즈 질문 데이터
│   └── App.tsx                       # 메인 앱 컴포넌트
└── styles/
    ├── theme.css                     # 테마 변수
    └── fonts.css                     # 폰트 설정
```

## 🎨 주요 기능 상세

### 1. QuizScreen (퀴즈 화면)

- 25개 질문을 5개 섹션으로 나눠 진행
- 실시간 섹션별 진행률 표시
- 답변 시 소셜 피드백 (다른 사용자 응답 비율)
- 자동 세션 저장 (localStorage)
- 브라우저 뒤로가기 방지

### 2. ResultScreen (결과 화면)

- 전국 순위 및 등급 시각화
- 5개 영역별 레이더 차트
- 강점/약점 자동 분석
- 자극적인 공유 메시지
- 등급별 맞춤형 UI/애니메이션

### 3. ShareModal (공유 기능)

- SNS 최적화 이미지 자동 생성 (1200x630)
- 등급별 자극적인 공유 메시지
  - 상위 5%: "100명 중 X등, 이길 자신 있어?"
  - 상위 15%: "상위권 남자/여자, 너도 도전해봐"
- 카카오톡 공유 버튼
- 이미지 다운로드 기능

### 4. 도전장 모드

- URL 파라미터 `?challenge=true`로 활성화
- 친구가 보낸 도전을 수락하고 바로 시작
- 결과 비교 및 순위 경쟁

## 🔧 커스터마이징

### 질문 수정

`src/app/data/questions.ts` 파일에서 질문을 추가/수정할 수 있습니다.

```typescript
{
  id: 1,
  category: '자기관리',
  question: '질문 내용',
  options: ['옵션1', '옵션2', '옵션3', '옵션4', '옵션5']
}
```

### 테마 변경

`src/styles/theme.css` 파일에서 CSS 변수를 수정하여 색상 및 스타일을 변경할 수 있습니다.

### 등급 기준 변경

`src/app/App.tsx`의 `calculateResult` 함수에서 등급 계산 로직을 수정할 수 있습니다.

## 🌐 배포

### Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### Netlify 배포

```bash
# 빌드
pnpm run build

# dist 폴더를 Netlify에 드래그 앤 드롭
```

## 📱 특수 URL 파라미터

- `?download=true` - 소스 코드 다운로드 페이지
- `?challenge=true` - 도전장 모드 활성화

## 🤝 기여

이슈 및 풀 리퀘스트를 환영합니다!

## 📄 라이선스

MIT License - 자유롭게 사용 및 수정 가능합니다.

## 💡 팁

- **바이럴 전략**: 상위권 사용자에게 자랑 유도, 일반 사용자에게 도전 유도
- **공유 최적화**: 1200x630 비율로 모든 SNS에 최적화됨
- **자극적 메시지**: 등급별로 다른 공유 문구로 클릭률 증가
- **세션 저장**: 사용자 이탈 방지를 위한 자동 저장 기능
