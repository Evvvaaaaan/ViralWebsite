# 완벽한 이탈률 최소화 디자인 시스템
## Apple Minimalism × Cosmic Glass × Behavioral Engagement

---

# PART 1. 현재 가이드라인의 결정적 공백 — 왜 유저는 이탈하는가

현재 제시된 디자인 가이드라인은 **"아름다움"** 을 완성했지만, **"계속하게 만드는 힘"** 이 없다.
아름다운 앱과 끝까지 하게 만드는 앱은 전혀 다른 설계 원리에서 출발한다.

퀴즈형 서비스의 이탈은 크게 세 구간에서 발생한다.

```
[이탈 구간 분석]

① 랜딩 → 시작 전 (30~40% 이탈)
   → "이게 재밌을까?" 불확실성 제거 실패

② 문항 5~12번 구간 (30~35% 추가 이탈)
   → 단조로움, 진행감 부재, "아직 멀었다" 느낌

③ 문항 18~결과 직전 (10~15% 추가 이탈)
   → 결과에 대한 기대감이 오히려 조급함으로 전환
```

현재 가이드라인이 이 세 구간을 해결하지 못하는 구체적 이유는 다음과 같다.

---

## 공백 1. "첫 3초 훅"이 없다

**문제:** 현재 랜딩은 "아름답지만 정적"이다. Apple의 여백 철학은 정보가 충분한 사용자에게는 통하지만, 이 서비스의 타깃(바이럴로 유입된 20~30대)은 첫 3초 안에 "재밌겠다"는 신호를 받지 못하면 즉시 이탈한다.

**빠진 것:**
- 랜딩에서 결과 화면의 핵심 비주얼(레이더 차트, "상위 X%" 텍스트)을 미리 보여주는 **예고 효과(Preview Hook)**
- "OOO님도 방금 테스트했어요" 같은 **실시간 사회적 증거(Live Social Proof)**
- 유저가 참여하고 싶게 만드는 **결과 샘플 이미지** ("이런 결과가 나와요" 미리보기)

**왜 치명적인가:** BJ Fogg의 행동 모델에 따르면 행동 발생 = 동기 × 능력 × 트리거다. 현재 디자인은 능력(쉬운 UX)과 트리거(버튼)는 있지만 **동기(나도 저런 결과 보고 싶다)**를 심지 않는다.

---

## 공백 2. 문항 진행 중 "모멘텀 설계"가 전혀 없다

**문제:** 25문항을 단순한 리스트로 보여주는 것은 "할 일 목록"의 심리를 만든다. 유저는 "아직 20개 남았네"를 인식하는 순간 이탈을 고려한다.

**빠진 것:**
- **섹션 완료 세레머니(Section Completion Ceremony):** 5문항마다 "카테고리 완료" 마이크로 애니메이션
- **중간 흥미 유발 카드:** Q10/Q15/Q20 시점에 "지금까지 응답을 보면 당신은 XX 유형에 가깝네요" 형태의 중간 힌트 카드
- **진행 바의 심리적 설계:** 단순 퍼센트 바가 아닌, 카테고리별 5구간으로 분리된 세그먼트 바 (각 구간이 채워지는 피드백이 완전히 다름)
- **답변 선택 후 즉각 피드백:** "전국 응답자 중 67%도 같은 답을 골랐어요" 같은 소셜 데이터 피드백 (선택 후 0.5초 후 표시)

**왜 치명적인가:** 닐 에얄의 Hook Model — Variable Reward(가변적 보상). 매번 같은 패턴이면 뇌가 흥미를 잃는다. 예측 불가능한 작은 보상이 뇌를 각성 상태로 유지한다.

---

## 공백 3. 답변 선택의 "물리적 쾌감"이 없다

**문제:** `transform: scale(0.95)` 마이크로 모션은 필요조건이지 충분조건이 아니다. 선택 → 다음 문항으로 넘어가는 흐름에서 "내가 뭔가를 완성했다"는 성취감이 전혀 없다.

**빠진 것:**
- **선택 즉시 자동 진행(Auto-advance)** — 선택 후 300~400ms 딜레이 후 자동으로 다음 문항으로 슬라이드. "다음" 버튼 클릭을 없애거나 선택적으로.
- **선택 시 파문 효과(Ripple)** — 선택한 버튼에서 파문이 퍼지는 0.3초 마이크로 애니메이션
- **카테고리 전환 시 전환 화면** — "자기관리 섹션 완료 ✓ → 다음: 경제력" 0.8초짜리 전환 슬라이드
- **진동 패턴 설계(Haptic)** — 선택: light, 섹션 완료: medium, 결과: heavy (네이티브 앱 기준)

---

## 공백 4. "결과 직전 서스펜스" 설계가 없다

**문제:** 현재 로딩 화면은 "분석 중"이라는 텍스트와 스피너 뿐이다. 이 2.8초는 서비스 전체에서 가장 중요한 감정 조작 구간인데 완전히 낭비되고 있다.

**빠진 것:**
- **숫자가 랜덤하게 흔들리다 확정되는 연출** ("94%... 73%... 81%... → 확정: 상위 8%")
- **레이더 차트가 실시간으로 그려지는 과정** 시각화
- **"전국 X만 명 데이터와 비교 중..." 진행 텍스트**가 단계적으로 업데이트
- **서스펜스 음악/진동** 패턴 (BGM이 없어도 진동 패턴만으로 긴장감 형성 가능)

---

## 공백 5. 결과 화면의 "감정 피크" 설계가 없다

**문제:** 숫자를 보여주는 것과 감동을 주는 것은 다르다. 현재는 정보 전달에 그친다. 결과 화면에서의 감정 피크가 바이럴의 핵심이다.

**빠진 것:**
- **등급별 완전히 다른 연출** — S등급(파티클 폭발 + 골드 색상)과 D등급(조용한 위로 톤)이 동일한 템플릿을 쓰면 공유 욕구가 사라진다.
- **"이 퍼센트의 의미"를 실감 나게 전달** — "상위 8% = 전국 12명 중 1명 수준" 같은 시각화
- **공유 전 "미리보기"** — 공유 버튼 누르기 전에 "이런 이미지로 공유돼요" 프리뷰 제공
- **결과 숫자 카운트업 애니메이션** 이 존재하지만, **중간에 멈추는 드라마틱 포즈** 연출이 없음

---

## 공백 6. 이탈 방지 "손실 회피 트리거"가 없다

**문제:** 중간에 나가려 할 때 아무 저항이 없다.

**빠진 것:**
- **뒤로 가기 시 "X문항까지 완료했어요. 지금 나가면 처음부터 시작해야 해요"** 알림
- **세션 복구 기능** — localStorage 기반 중간 저장, 재방문 시 "이어하기" 제공
- **진행률 기반 동기 문구** — Q15 이후 "이제 40% 남았어요. 여기까지 온 당신, 포기하기 아깝죠?" 텍스트

---

# PART 2. 완벽 통합 디자인 프롬프트

---

## CHAPTER 1. 브랜드 아이덴티티 & 감정 아크

### 1-1. 핵심 디자인 철학: "심리적 여정 설계"

이 앱의 디자인 목표는 아름다움이 아니라 **완주율 극대화**다.
모든 디자인 결정은 다음 질문을 기준으로 한다:
> "이 디자인이 유저를 다음 단계로 끌어당기는가?"

세 가지 원칙:
1. **Progressive Revelation(점진적 노출):** 결과의 힌트를 조금씩 흘려 끝까지 가야만 전체가 보인다는 기대를 만든다
2. **Variable Micro-reward(가변적 소보상):** 매 5문항마다, 매 답변마다 예측 불가능한 작은 피드백으로 뇌를 깨어있게 한다
3. **Loss Aversion Anchoring(손실 회피 앵커링):** 진행할수록 "여기서 포기하면 손해"라는 인식을 심는다

### 1-2. 감정 아크 (Emotional Arc)

```
[화면별 감정 온도 설계]

랜딩:         호기심 70% + 기대 30%
              → 목표: "나도 해봐야겠다" 즉각 유발

성별 선택:    참여 몰입 100%
              → 목표: 선택의 순간 감정 이입 시작

Q1~Q5:        가벼운 재미 + 자기 반영
              → 목표: "이 질문들 꽤 정확하네" 신뢰 형성

Q6~Q10:       집중 + 자기 탐색 깊이 증가
              → 목표: "계속 하고 싶다" 모멘텀 유지

Q11~Q15:      중간 보상으로 재점화
              → 목표: "절반 왔다, 이제 진짜 재밌어짐" 전환

Q16~Q20:      서스펜스 + 결과 기대감 증폭
              → 목표: "빨리 결과 보고 싶다" 조급함 유발

Q21~Q25:      카운트다운 심리
              → 목표: "5개만 더!" 완주 의지 폭발

로딩:         서스펜스 클라이맥스
              → 목표: 심장이 두근거리는 2.8초

결과:         감정 피크 (자랑/위로/공유 욕구)
              → 목표: 즉각 공유 & 친구 도전
```

### 1-3. 컬러 시스템 (확장판)

```css
/* ── BASE PALETTE ── */
--cosmic-black:    #000000;
--cosmic-base:     #0a0a0f;      /* 순수 블랙보다 약간 따뜻한 베이스 */
--cosmic-deep:     #0f0c29;      /* 기존 유지 */
--cosmic-mid:      #302b63;      /* 기존 유지 */
--cosmic-surface:  #24243e;      /* 기존 유지 */

/* ── INTERACTION COLORS ── */
--action-blue:     #0066cc;      /* Apple 시그니처 */
--focus-blue:      #0071e3;
--cosmic-pink:     #ff6496;      /* 여성 테마 */
--cosmic-indigo:   #6366f1;      /* 남성 테마 (기존보다 더 생동감) */

/* ── GRADE COLORS (결과 등급별 고유 팔레트) ── */
--grade-s:         #f5a623;      /* 골드 — 전설 */
--grade-s-glow:    rgba(245, 166, 35, 0.35);
--grade-a:         #7b68ee;      /* 미드나잇 퍼플 — 탁월함 */
--grade-a-glow:    rgba(123, 104, 238, 0.3);
--grade-b:         #00d4aa;      /* 에메랄드 민트 — 이상형급 */
--grade-b-glow:    rgba(0, 212, 170, 0.25);
--grade-c:         #4fc3f7;      /* 아이스 블루 — 평균 이상 */
--grade-c-glow:    rgba(79, 195, 247, 0.2);
--grade-d:         #aaaaaa;      /* 뮤트 실버 — 평범함 */
--grade-d-glow:    rgba(170, 170, 170, 0.15);
--grade-f:         #ff6b6b;      /* 따뜻한 레드 — 성장 중 */
--grade-f-glow:    rgba(255, 107, 107, 0.2);

/* ── SEMANTIC TOKENS ── */
--glass-bg:           rgba(255, 255, 255, 0.06);
--glass-bg-hover:     rgba(255, 255, 255, 0.10);
--glass-border:       rgba(255, 255, 255, 0.08);
--glass-border-hover: rgba(255, 255, 255, 0.20);
--glass-border-active:rgba(255, 255, 255, 0.35);
--text-primary:       #ffffff;
--text-secondary:     rgba(255, 255, 255, 0.65);
--text-tertiary:      rgba(255, 255, 255, 0.35);
--text-on-light:      #1d1d1f;
```

### 1-4. 타이포그래피 (완전 재정의)

```
Font Stack:
  Primary:   'SF Pro Display', 'Inter Variable', -apple-system, sans-serif
  Fallback:  'Noto Sans KR', sans-serif

Scale:
  hero:      64px / weight 700 / tracking -0.03em / leading 1.05
             → 결과 퍼센트 수치 전용. 이 크기는 오직 이 용도에만 사용.

  display:   48px / weight 600 / tracking -0.025em / leading 1.07
             → 랜딩 메인 카피

  title-1:   34px / weight 600 / tracking -0.02em / leading 1.12
             → 섹션 타이틀, 등급 뱃지

  title-2:   24px / weight 600 / tracking -0.015em / leading 1.25
             → 질문 카드 질문 텍스트

  body-lg:   19px / weight 400 / tracking -0.01em / leading 1.50
             → 답변 옵션 텍스트 (16/17px보다 읽기 쾌적함)

  body:      17px / weight 400 / tracking -0.01em / leading 1.47
             → 기본 본문

  caption:   13px / weight 500 / tracking 0.01em / leading 1.43
             → 메타 정보, 힌트 텍스트 (uppercase 사용 시 letter-spacing +0.06em 추가)

Apple-tight Rule:
  34px 이상: tracking ≤ -0.02em (반드시 타이트하게)
  17~33px:   tracking -0.01em ~ -0.015em
  16px 이하: tracking 0 (읽기 편의 우선)
```

---

## CHAPTER 2. 화면별 완벽 설계 명세

---

### SCREEN 0. 랜딩 — "첫 3초에 혼을 뺏어라"

#### 전략
랜딩에서 결과 화면의 핵심 비주얼을 **블러 처리된 미리보기**로 노출한다.
유저는 "저 결과 나도 보고 싶다"는 충동을 즉각 느낀다.

#### 레이아웃 명세

```
[배경]
- 최상단 레이어: #000000 베이스
- 중앙 구역: 희미한 레이더 차트 실루엣 (opacity 15%, blur 20px)
  → "저게 내 결과 형태구나"라는 암시만 제공
- 미세한 파티클 애니메이션: 화면에 30~50개의 1~3px 흰 점이 0.3~0.8px/s 속도로 부유

[상단 영역 — 여백 최소 60px]
- 실시간 뱃지: "● LIVE  지금 347명 참여 중"
  · 붉은 점이 실제로 깜빡임 (pulse animation, 2s cycle)
  · 숫자는 5~15초마다 랜덤하게 ±1~3 변동 (JS로 simulate)
  · 폰트: caption, 뮤트 화이트

[중앙 히어로]
- 메인 카피: "나는 전국에서
  몇 번째인가?"
  · display size (48px), weight 600, tight tracking
  · 두 줄 처리, 두 번째 줄 끝에 물음표만 --action-blue 색상 처리
  · 텍스트 뒤 아주 미세한 glow: text-shadow 0 0 80px rgba(99,102,241,0.4)

- 서브카피 (body, text-secondary):
  "25개의 정밀 질문으로 확인하는
   대한민국 실시간 성향 순위"

[소셜 프루프 스트립]
- 수평 스크롤 되는 최근 결과 알림 리스트 (marquee 효과):
  "익명  ·  상위 3% 판정" ·  "익명  ·  상위 41% 판정"  ·  "익명  ·  상위 12% 판정" ...
  · 폰트: caption, text-tertiary
  · 실제 데이터처럼 보이게 랜덤하게 생성

[스탯 로우]
- 3개 수치: 참여자 수 | 질문 수 | 소요 시간
- 참여자 수는 카운트업 애니메이션으로 표시 (페이지 로드 시)
- 구분선: 세로 1px rgba(255,255,255,0.15)

[CTA 버튼 — rounded-pill, 최대폭 360px]
- 배경: #ffffff
- 텍스트: "지금 내 순위 확인 →" / --text-on-light / weight 700
- Active state: scale(0.96) + shadow 없어짐 (눌리는 느낌)
- Idle state: subtle pulse animation (scale 1.0 ↔ 1.015, 3s 주기)
- 버튼 아래 6px: "무료 · 익명 · 30초 완성" in caption + text-tertiary

[하단 미리보기 스니펫]
- 블러 처리된 결과 화면 상단 1/3 노출 (position: fixed bottom-0)
- "결과 미리보기 ↓" 레이블
- 스크롤 유도 효과: 미세한 위아래 bounce animation
```

---

### SCREEN 1. 성별 선택 — "감정 이입의 시작"

#### 레이아웃 명세

```
[배경]
- --cosmic-deep 단색 (그라디언트 사용 금지)
- 선택 시 배경이 부드럽게 해당 테마색으로 틴팅됨
  · 남자 선택: 배경에 rgba(99,102,241,0.08) 오버레이
  · 여자 선택: 배경에 rgba(255,100,150,0.08) 오버레이

[카드 구조 — 두 카드가 화면을 50/50 분할]
- 각 카드: 화면 높이 100%, 폭 50%
- 카드 경계: 세로 1px rgba(255,255,255,0.08)
- 카드 내부: 중앙 정렬, 상단 이모지 + 하단 레이블

[호버/터치 상태]
- 선택된 카드: 배경 투명도 증가 + 카드 내 모든 요소 scale(1.05)로 확대
- 비선택 카드: opacity 0.4로 dimming
- 선택 확정 후: 0.4초 대기 → 퀴즈 화면으로 슬라이드 전환

[카드 내부]
- 이모지: 64px (화면 중앙보다 약간 위)
- 레이블: title-2, white, weight 600
- 서브: body, text-secondary (예: "남성 기준 질문 · 남성 통계")
- 하단 CTA: pill 형태의 작은 버튼 — "선택하기" (hover 시만 표시)
```

---

### SCREEN 2. 퀴즈 화면 — "모멘텀이 전부다"

#### 진행 바 (Progress Bar) — Apple Segmented 방식

```
[구조]
- 5개 구간으로 나뉜 세그먼트 바 (각 구간 = 5문항)
- 각 구간은 독립된 pill 형태, 구간 사이 4px 갭
- 현재 구간: 활성 색상으로 부분 채워짐
- 완료된 구간: 불투명 accent 색상으로 완전히 채워짐
- 다음 구간: rgba(255,255,255,0.12) 배경 (아직 비어있음)

[각 구간 위에 카테고리 레이블]
- 완료: "✓ 자기관리" (체크마크 + 취소선 없는 완료 표시)
- 현재: "💪 자기관리" (이모지 + 아이콘, 활성)
- 미완: "경제력" (폰트 dimmed)

[구간 완료 시 마이크로 애니메이션]
- 마지막 5번째 문항 답변 선택 순간:
  1. 해당 구간 pill이 0.15초 동안 scale(1.05)로 확대
  2. 0.1초 동안 유지
  3. 0.2초 동안 원래 크기로 복귀하며 fill 색상 전환
  4. 완료 진동 (medium haptic)
```

#### 전환 카드 (Section Transition Card) — 5문항마다 등장

```
[등장 조건] Q5, Q10, Q15, Q20 완료 직후

[구조]
- 전체 화면을 덮는 오버레이 카드 (0.3초 fadeIn)
- 배경: 해당 카테고리의 테마 색상 (10% opacity glass)
- 중앙:
  · 완료 아이콘 (카테고리 이모지, 48px, scale 0→1 bounce)
  · "자기관리 완료! ✓" (title-2, white)
  · 점수 프리뷰: "이 섹션 X/25점" (작은 숫자, text-secondary)
  · 힌트 텍스트: "지금까지 답변을 보면, 당신은 자기 관리형에 가깝네요"
    → 상위 2개 선택 기반으로 동적 생성

- 하단: "다음 섹션: 경제력 →" pill 버튼
- 자동 진행: 2.5초 후 자동으로 다음 문항으로 전환
  (타이머 바 시각화: 카드 하단에 얇은 progress 선이 2.5초 동안 채워짐)

[Q15 특별 처리 — 이탈 방지 최대 구간]
- "벌써 절반! 🎯 지금까지 15,847명 중 당신만큼 성실한 응답자는 23%입니다"
- 이 문구는 "나는 특별하다" 감정을 자극해 완주 의지를 강화
```

#### 질문 카드 (Question Card)

```
[카드 구조]
- rounded-lg (18px), glass-bg, glass-border
- 카드 진입 애니메이션:
  · 새 카드: 오른쪽에서 슬라이드 인 (translateX 40px → 0, 0.3s ease)
  · 이전 카드: 왼쪽으로 슬라이드 아웃 (translateX 0 → -40px, 0.2s ease, 동시 실행)
  · 전체 체감 속도: 350ms (빠르지도 느리지도 않은 리듬)

[카드 내부]
- Q번호 + 카테고리: caption, text-tertiary
  예: "Q7  ·  경제력" (dot separator)
- 질문 텍스트: title-2 (24px), white, weight 500
  → 한 줄이 아닌 두 줄 내외가 이상적 (너무 짧으면 가볍게 느껴짐)
- 카드 하단 우측: 작은 텍스트로 "진솔하게 답할수록 정확해요" (text-tertiary, caption)
  → 신뢰도를 높이는 심리적 장치
```

#### 답변 버튼 (Answer Buttons)

```
[기본 상태]
- 5개 버튼, 수직 나열
- 각 버튼: 최소 54px 높이 (터치 타겟 확보), rounded-lg
- 배경: glass-bg, 테두리: glass-border
- 내부 왼쪽: 번호 원형 뱃지 (28px)
- 내부 우측: 답변 텍스트 (body-lg, 19px)

[선택 순간 — 가장 중요한 마이크로 모션]
Step 1 (0ms):    클릭 순간 전체 버튼 scale(0.96) + 테두리 glass-border-active
Step 2 (80ms):   scale(1.0) 복귀 + 선택 색상 fill 시작 (ripple 효과)
Step 3 (200ms):  번호 원형이 체크마크(✓)로 교체 + 테두리 --action-blue
Step 4 (350ms):  소셜 피드백 텍스트 등장 (아래 참고)
Step 5 (650ms):  자동으로 다음 문항 슬라이드 (Auto-advance)

[소셜 피드백 — 선택 350ms 후 버튼 하단에 등장]
- "전체 응답자 중 이 답을 선택한 비율: XX%"
  · 실제 DB 있으면 실제 데이터, 없으면 시뮬레이션 데이터
  · 내가 선택한 것이 소수인지 다수인지 순간적으로 확인
  · 예: "⬆ 응답자 68%도 같은 선택" (다수) / "↓ 상위 19%만 이 답 선택" (희소)
  · 이 피드백은 자기 검증 욕구를 자극하여 다음 질문 기대감 증폭

[여성 테마 선택 상태]
- 테두리: --cosmic-pink
- 배경 fill: rgba(255, 100, 150, 0.12)

[비활성화 버튼 (다른 옵션)]
- 선택 후 나머지 버튼: opacity 0.4로 dimming (선택 강조 효과)
```

#### 손실 회피 가드 (Exit Intent Guard)

```
[발동 조건]
- 뒤로 가기 버튼 또는 제스처 감지 시 (특히 Q5 이후)
- 브라우저: beforeunload 이벤트

[팝업 내용]
- 타이틀: "잠깐! 결과가 아직 남아있어요" (title-2)
- 서브: "지금까지 [N]문항 완료했어요. 여기서 나가면 처음부터 다시 시작해야 합니다."
- 하단: [계속하기 (accent, pill)] [그냥 나가기 (ghost, 작은 텍스트)]
- 배경: 블러 처리된 현재 화면 (유저가 진행한 내용이 희미하게 보임)
  → "이미 이만큼 했는데" 손실 회피 심리 극대화

[세션 자동 저장]
- 답변 1개마다 localStorage에 자동 저장
- 재방문 시: "17문항까지 완료된 테스트가 있어요. 이어서 할까요?" 배너 표시
```

---

### SCREEN 3. 로딩/분석 화면 — "서스펜스 설계"

```
[전체 구조]
- 배경: #000000 → --cosmic-deep 그라디언트 (검정에서 인디고로 변화)
- 총 2.8초 분량의 정확한 연출 시퀀스

[0.0~0.3초] 화면 전환
- 퀴즈 마지막 문항 슬라이드 아웃 + 검정 화면 페이드 인

[0.3~0.8초] 첫 텍스트 등장
- "분석 시작" (caption, text-tertiary, fadeIn)
- 화면 중앙에 작은 점 3개 반짝임

[0.8~1.8초] 숫자 카오스
- 화면 중앙에 거대한 퍼센트 숫자 (hero 크기, 64px)
- 숫자가 빠르게 랜덤하게 바뀜: 87%...23%...61%...44%...
  · 0.08초마다 새 숫자 (flickering effect)
  · 텍스트는 blur(2px)로 살짝 흐릿하게 → "아직 확정 안 됨" 신호

[1.8~2.3초] 속도 감소
- 숫자 변화 속도: 0.08초 → 0.2초 → 0.5초 → 멈춤
- 멈추기 직전 마지막 두 숫자는 최종 답과 가깝게 (예: 최종 8%면, 11%...8%)
- 심장이 두근거리는 효과를 위한 의도적 슬로우다운

[2.3~2.8초] 확정 연출
- 숫자 확정: blur 제거, 선명해짐
- 해당 등급의 색상으로 숫자 색상 전환 (0.3초 transition)
- 등급 아이콘 등장 (스케일 0 → 1.2 → 1.0 bounce)
- 결과 화면으로 자동 전환

[사이드 텍스트 스트림 — 우측 또는 하단]
순차 등장 (각 400ms 간격):
1. "응답 데이터 25개 수집 완료"
2. "전국 [N]명 비교 데이터 로드 중..."
3. "카테고리별 편차 분석 중..."
4. "백분위 산출 완료 ✓"
→ 폰트: caption, text-tertiary, mono-spaced font 권장 (터미널 느낌)

[레이더 차트 라이브 드로잉]
- 로딩 중 레이더 차트 오각형이 0.8초에 걸쳐 선으로 그려짐
- 축만 먼저 그려지고 → 데이터 면이 천천히 채워짐
- 최종 확정 전에는 opacity 50%로 유지
- 확정 순간 opacity 100%로 전환
```

---

### SCREEN 4. 결과 화면 — "감정 피크 설계"

#### 결과 화면은 등급별로 완전히 다른 연출이 적용된다

```
[S등급: 상위 1% — 전설 연출]
배경: --grade-s-glow 기반의 골드 암시 + 파티클 폭발 효과
  · 화면 전체에 금빛 파티클 50~80개가 중앙에서 퍼져나감 (3초간)
  · 이후 파티클 서서히 사라지고 결과 카드 안착

숫자 등장:
  · 0 → 최종값까지 1.2초 동안 카운트업
  · 최종값에서 1.5배 크기로 잠깐 확대되었다가 원래 크기로 (overshoot bounce)
  · 색상: --grade-s (골드)
  · text-shadow: 0 0 40px var(--grade-s-glow) (금빛 글로우)

배지: 👑 "전설" — 24px gold
등급 설명: "전국 상위 1%. 당신 같은 사람, 100명 중 1명입니다."

[A등급: 상위 5% — 탁월함]
배경: 미드나잇 퍼플 글로우
숫자: 퍼플 글로우 효과
파티클: 소규모 퍼플 스파클

[B등급: 상위 15% — 이상형급]
배경: 에메랄드 민트 암시
숫자: 민트 색상

[C/D/F등급: 위로 톤 처리]
배경: 화려함 없이 조용한 다크
숫자: text-secondary 색상 (화이트)
메시지 톤: "지금이 시작점이에요. 함께 성장해봐요." (따뜻한 위로)
→ 낮은 결과에 수치심을 주면 공유를 안 한다. 위로 톤이 오히려 공유 욕구를 만든다.
```

#### 결과 화면 레이아웃 상세

```
[섹션 1: 히어로 퍼센트]
- 여백 상단 60px
- "상위" (caption, text-tertiary, 위)
- 퍼센트 수치 (hero, 64px, grade color)
- "의 [남자/여자]입니다" (title-2, text-secondary)
- 구분선: 1px rgba(255,255,255,0.08), 여백 24px

[섹션 2: 실감 수치화]
- "전국 기준: 100명 중 X번째" (숫자 강조)
- 시각화: 사람 아이콘 20개 나열, X번째만 accent color로 하이라이트
  → "이게 어느 정도인지" 즉각 체감 가능
- "서울 25세 기준: 상위 X%" (세분화 수치, 더 희소하게 보임)

[섹션 3: 레이더 차트 카드 — glass card]
- 타이틀: "역량 분석" (small caps, text-tertiary)
- 등장: 카드가 아래에서 올라오는 slideUp 애니메이션
- 레이더 차트: 화면 진입 후 0.5초 딜레이 → 1초 동안 fill 애니메이션
- 가장 높은 축: accent color 강조 dot
- 가장 낮은 축: 빨간 dot (개선 포인트 직관적 표시)

[섹션 4: 카테고리 점수 — 수평 스크롤 카드 열]
- 가로 스크롤 가능한 카드 5개 (각 카드 140px 폭)
- 각 카드: 카테고리명 + 점수/25 + 작은 바 + 등급 이모지
- 스크롤 유도: 오른쪽에 다음 카드 살짝 노출 (peek)

[섹션 5: 맞춤 인사이트 — 3개 항목]
- 강점: "💎 [카테고리]가 전국 상위 X%입니다"
- 개선: "🎯 [카테고리]을 1단계만 높이면 순위가 크게 오릅니다"
- 전략: "📈 [구체적 행동 제안]"

[섹션 6: 공유 — 가장 중요한 섹션]
공유 버튼 누르기 전 미리보기:
  - 작은 카드 섬네일 (공유될 이미지 미리보기, 80x140px)
  - "이런 이미지로 공유돼요" 레이블
  - 탭하면 풀사이즈 프리뷰

공유 버튼 구조:
  1. "📤 결과 공유하기" — primary pill 버튼
  2. "💬 카카오로 보내기" — yellow button
  3. "🔗 링크 복사" — ghost button (작은 텍스트)
  4. "도전장 보내기 →" — 텍스트 링크 형태
     "친구에게 도전장 → 친구 성별 선택 → 커스텀 링크"

[스티키 하단 바 — 스크롤해도 고정]
- 높이 64px, backdrop-blur, --cosmic-surface 배경
- 왼쪽: "상위 X% · [등급명]" 축약 표시
- 오른쪽: "공유하기" pill 버튼 (accent color)
```

---

## CHAPTER 3. 인터랙션 & 애니메이션 완전 명세

### 3-1. 전역 애니메이션 원칙

```css
/* 모든 인터랙션의 기본 easing */
--ease-standard:  cubic-bezier(0.4, 0.0, 0.2, 1);  /* 대부분의 전환 */
--ease-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);  /* 요소 등장 */
--ease-accelerate: cubic-bezier(0.4, 0.0, 1.0, 1);  /* 요소 퇴장 */
--ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1); /* bounce 효과 */

/* 지속 시간 토큰 */
--duration-instant:   80ms;   /* 즉각 피드백 (클릭 반응) */
--duration-fast:     200ms;   /* 버튼 색상/상태 전환 */
--duration-moderate: 350ms;   /* 카드 슬라이드, 화면 전환 */
--duration-slow:     600ms;   /* 큰 레이아웃 변화 */
--duration-drama:   1200ms;   /* 결과 카운트업, 차트 fill */
```

### 3-2. 화면 전환 매트릭스

```
랜딩 → 성별 선택:    fade (300ms)
성별 선택 → 퀴즈:    slide left (350ms, --ease-decelerate)
문항 → 문항:         slide left (300ms) / slide right (뒤로 갈 때, 250ms)
문항 → 섹션 완료 카드: scale from center (300ms, --ease-spring)
섹션 완료 → 다음 문항: fade + slide left (350ms)
마지막 문항 → 로딩:   fade to black (400ms)
로딩 → 결과:         결과 화면이 아래에서 올라옴 (500ms, --ease-decelerate)
```

### 3-3. 진동 패턴 (Haptic Feedback)

```
답변 선택:           light impact (iOS: UIImpactFeedbackGenerator light)
섹션 완료:           medium impact
로딩 완료 → 결과:    notification feedback (success)
S/A등급 결과:        heavy impact × 2회 (파티클과 동기화)
공유 성공:           light impact
오류:                error feedback
```

### 3-4. 접근성 (Accessibility)

```
색상 대비:
  - 모든 본문 텍스트: WCAG AA (4.5:1 이상)
  - 헤드라인/CTA: WCAG AAA (7:1 이상)
  - 등급 색상 텍스트: 배경 대비 최소 4.5:1 보장
    (예: grade-s 골드는 어두운 배경에서만 사용)

포커스:
  - 키보드 포커스: --focus-blue 2px solid outline
  - 포커스 링 radius: 컴포넌트 radius + 2px

감소 모션:
  @media (prefers-reduced-motion: reduce):
    모든 애니메이션 duration 0ms로 설정
    파티클, 카운트업 등 생략
    대신 fade만 유지
```

---

## CHAPTER 4. 이탈률 최소화 UX 체크리스트

아래 항목이 모두 구현되어야 "완벽"이라 부를 수 있다.

```
[랜딩 단계]
□ 첫 로드 3초 내 "재밌겠다" 신호 전달 (미리보기 + 소셜 프루프)
□ 실시간 참여자 수 변동 (JS 시뮬레이션)
□ 결과 샘플 블러 이미지 노출
□ CTA 버튼 pulse 애니메이션 (멈춰있으면 죽은 UI처럼 보임)

[성별 선택]
□ 선택 시 배경이 즉각 반응 (테마 색상 틴팅)
□ 400ms 딜레이 후 자동 진행

[퀴즈 진행]
□ 세그먼트 진행 바 (5구간, 각 완료 시 피드백)
□ 섹션 완료 카드 (Q5, Q10, Q15, Q20)
□ Q15에서 특별 모티베이션 메시지
□ 답변 선택 → 소셜 피드백 텍스트 (350ms 후)
□ Auto-advance (650ms 후 자동 다음 문항)
□ 카드 슬라이드 애니메이션 (왼쪽/오른쪽 방향 구분)
□ 손실 회피 팝업 (뒤로 가기 시)
□ localStorage 자동 저장 + 이어하기 기능

[로딩]
□ 숫자 카오스 → 슬로우다운 → 확정 시퀀스 (2.8초)
□ 레이더 차트 라이브 드로잉
□ 터미널 스타일 텍스트 스트림

[결과]
□ 등급별 완전히 다른 연출 (파티클, 색상, 메시지 톤)
□ "100명 중 X번째" 사람 아이콘 시각화
□ 공유 이미지 미리보기 (공유 전 확인 가능)
□ 스티키 하단 공유 바
□ 친구 도전장 기능
```

---

## CHAPTER 5. 완성된 Figma 프롬프트 (v2)

### 랜딩 페이지 (최종)
```
Design a premium, high-engagement mobile landing screen for a Korean viral quiz app.

Background: Pure #000000 with a subtle blurred radar chart silhouette (15% opacity) 
floating in the center — this is the "result preview hook."
Fine particle field: 40-60 white dots (1-3px), floating slowly.

Top: Live badge with pulsing red dot — "● LIVE  347명 참여 중" (caption, muted white)
Below: Marquee strip with fake real-time results — "익명 · 상위 3% 판정" scrolling.

Hero: 2-line display title (48px, weight 600, tight tracking -0.025em):
  "나는 전국에서
  몇 번째인가?"
  Last character "?" in #0066cc (action blue only).
  Text has soft indigo glow: text-shadow 0 0 80px rgba(99,102,241,0.4).

Sub-copy: 17px, text-secondary, 1.6 line-height.

Stats row: 3 items (참여자 animated count-up | 25문항 | 3분), thin vertical dividers.

CTA: Pill button, #ffffff fill, dark text, max-width 360px, subtle pulse animation.
Below CTA: "무료 · 익명 · 30초 완성" in caption + very muted opacity.

Bottom: Blurred glimpse of result screen (1/3 height peek) with "결과 미리보기 ↓" label.

Overall feel: Cosmic, mysterious, premium. Makes user think "I MUST see my result."
```

### 퀴즈 질문 카드 (최종)
```
Design a quiz question card for a dark cosmic mobile app with high engagement.

Segmented progress bar at top: 5 pill segments (representing 5 categories, 5 questions each).
Completed segments: filled with indigo accent. Current: partially filled. Remaining: dim.
Each segment has a small category label above it.

Question card: glassmorphism (blur 16px, 6% white bg, 8% white border, 18px radius).
Inside: Q-number + category dot label (caption, tertiary) → question text (24px, weight 500).
Bottom right of card: "진솔하게 답할수록 정확해요" in tiny tertiary text.

Answer buttons (5 stacked, 54px height each):
  Default: glass card, numbered circle left, answer text right.
  Selected state: indigo border (2px) + ripple fill + numbered circle becomes ✓.
  After selection (350ms delay): small text appears below the button:
    "⬆ 응답자 68%도 같은 선택" — social proof micro-feedback.
  Non-selected buttons: dim to 40% opacity.

Card slide animation: new question slides in from right (300ms).
Female theme variant: replace all indigo with pink #ff6496.
```

### 결과 화면 — S등급 (최종)
```
Design a dramatic, gold-themed result reveal screen for top 1% ranking in a Korean quiz app.

When screen appears: gold particle explosion from center (50 particles, 3 second animation).

Hero section (centered):
  Small label: "상위" (caption, tertiary)
  Giant number: "1%" in #f5a623 gold, 64px, weight 700, 
    with text-shadow: 0 0 40px rgba(245,166,35,0.5) — neon glow effect.
    Enters with: count-up from 0, then overshoot scale(1.2) → scale(1.0).
  Below: "의 남자입니다" (24px, text-secondary)
  Grade badge: 👑 "전설" pill, gold color, gold border.

Social proof bar:
  Row of 20 small person icons — 1st one highlighted gold, rest gray.
  Label: "100명 중 1번째" 

Glassmorphism cards (slide up sequentially with 100ms stagger):
  Card 1: Radar chart (pentagon, gold stroke, gold fill 15%)
  Card 2: Category bars (gradient fills, animated on scroll)
  Card 3: Insights (3 items with icons)

Share section:
  Small card thumbnail preview: "공유 이미지 미리보기"
  Primary button: gold gradient, "📤 결과 공유하기"
  Secondary: yellow KakaoTalk button
  Text link: "친구에게 도전장 보내기 →"

Sticky bottom bar (64px, backdrop-blur):
  Left: "상위 1% · 전설" | Right: "공유하기" pill button

Overall: cinematic, victory screen energy. User must feel like sharing immediately.
```

---

*이 문서는 퀴즈형 바이럴 서비스의 완주율 극대화를 위한 완전한 디자인 명세입니다.  
모든 결정에는 행동심리학적 근거가 있으며, 아름다움보다 "계속하게 만드는 힘"을 우선합니다.*