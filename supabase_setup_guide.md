# 🚀 Supabase 연동 및 Google Analytics 4 (GA4) 설정 가이드

이 문서는 실시간 순위 테스트 웹 애플리케이션의 **Supabase 백엔드 데이터베이스 세팅**, **Edge Functions 서버 배포**, 그리고 **Google Analytics 4 (GA4)** 연동을 진행하기 위한 가이드라인입니다.

---

## 1. Supabase 데이터베이스 테이블 생성 (SQL)

데이터와 사용자 행동 로그를 안전하게 보관하기 위해 Supabase 대시보드에서 테이블을 먼저 생성해야 합니다.

1. [Supabase Console](https://supabase.com/dashboard)에 로그인하고 해당 프로젝트를 선택합니다.
2. 좌측 메뉴의 **SQL Editor**로 이동하여 **New query**를 클릭합니다.
3. 아래의 SQL 쿼리를 복사하여 붙여넣고 **Run** 버튼을 눌러 실행합니다.

```sql
-- 1. 초경량 Key-Value 스토어 테이블 생성 (진단 결과 및 행동 분석 이벤트 누적용)
CREATE TABLE IF NOT EXISTS kv_store_2ae6dc9b (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);

-- 2. 성능 향상을 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_kv_store_key_prefix ON kv_store_2ae6dc9b (key text_pattern_ops);
```

> [!SUCCESS]
> 이제 진단 결과(`result:*`)와 사용자 분석 로그(`event:*`)를 저장할 수 있는 DB 설계 세팅이 완료되었습니다.

---

## 2. Supabase Edge Functions 서버 배포

진단 연산 및 이벤트 축적을 담당하는 백엔드 서버(Hono/Deno 기반 Edge Function)를 배포합니다.

### 사전 준비 (Supabase CLI 설치)

개발 환경 터미널에서 Supabase CLI가 설치되어 있어야 합니다. (없다면 설치 진행)

```bash
# npm으로 Supabase CLI 설치
npm install -g supabase
```

### 배포 순서

1. `temp_clone` 디렉토리로 이동한 뒤 Supabase에 로그인합니다.
   ```bash
   cd temp_clone
   supabase login
   ```
2. 본인 프로젝트 ID(`thfvvpjefyfcjfsqprgb`)와 연동합니다.
   ```bash
   supabase link --project-ref thfvvpjefyfcjfsqprgb
   ```
3. Edge Function 서버를 배포합니다.
   ```bash
   supabase functions deploy server
   ```

### 3. Edge Functions 환경변수 설정

배포가 완료되면 Supabase 대시보드의 **Edge Functions** 메뉴에서 `server` 함수로 들어간 후, **Settings** 또는 **Database** 설정을 통해 아래의 2개 환경 변수가 올바르게 세팅되어 있는지 검토하거나 수동으로 기입합니다.

- `SUPABASE_URL` : 본인 Supabase 프로젝트 URL
- `SUPABASE_SERVICE_ROLE_KEY` : 비밀 액세스 키 (Service Role Key)

---

## 3. Google Analytics 4 (GA4) 연동 설정

웹 서비스 기획자 및 마케터가 실시간 방문자 유입량과 기기 분포를 트래킹하기 위해 GA4를 연동합니다.

1. [Google Analytics 홈페이지](https://analytics.google.com/)에서 새로운 웹 스트림을 개설하고 **측정 ID (Measurement ID)**를 발급받습니다. (형식: `G-XXXXXXXXXX`)
2. `temp_clone` 폴더 루트에 `.env` 파일을 생성하고 발급받은 측정 ID를 추가합니다.

```env
# Google Analytics 4 측정 ID
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

> [!TIP]
> **동작 원리:** 앱이 새로고침되거나 실행될 때, React는 자동으로 이 환경변수를 감지하여 비동기식 구글 애널리틱스 스크립트(`analytics.ts`)를 Head 영역에 안전하게 마운트하고 실시간 이벤트 수집을 개시합니다.

---

## 4. 커스텀 사용자 행동 분석 퍼널(Funnel) 트래킹 구조

이 프로젝트에는 사용자 행동 흐름의 단계별 이탈율을 분석할 수 있도록 세밀한 추적 로그가 내장되었습니다. 수집되는 주요 행동 이벤트 맵은 아래와 같습니다:

| 이벤트 키                     | 발생 시점                      | 수집되는 정보 (Metadata)                     | 용도                                               |
| ----------------------------- | ------------------------------ | -------------------------------------------- | -------------------------------------------------- |
| `quiz_start_clicked`          | 랜딩에서 테스트 시작 클릭      | `source: 'landing_button'`                   | 유입 퍼널 시작 확인                                |
| `gender_selected`             | 성별(남/여) 선택               | `gender: 'male' \| 'female'`                 | 성별 세그먼트 분석                                 |
| `question_answered`           | 개별 퀴즈 응답 완료            | `questionNumber: 1~25`, `answerIndex`        | 퍼널 단계별 이탈율 정밀 분석 (주요 이탈 구간 포착) |
| `result_viewed`               | 종합 결과화면 렌더링 완료      | `percentile: 상위%`, `grade: 등급`, `gender` | 최종 진단 결과 통계                                |
| `insta_share_clicked`         | 결과화면 인스타 스토리 버튼 탭 | `source: 'result_page'`                      | 핵심 SNS 확산 바이럴 측정                          |
| `image_save_clicked`          | 결과화면 저장 버튼 터치        | `source: 'result_page'`                      | 소장 의도 유저 비율 측정                           |
| `more_shares_clicked`         | 더 많은 공유 옵션 터치         | `source: 'result_page'`                      | 공유 확장성 확인                                   |
| `restart_clicked`             | 다시하기 버튼 터치             | `source: 'result_page'`                      | 서비스 리텐션 및 재참여량 측정                     |
| `share_modal_opened`          | 공유 하단 바 모달 팝업         | -                                            | 공유 의향 도달률 측정                              |
| `kakao_share_modal_clicked`   | 모달 내 카카오톡 버튼 터치     | -                                            | 국내 카카오톡 공유 바이럴 효율 측정                |
| `twitter_share_modal_clicked` | 모달 내 X(트위터) 버튼 터치    | -                                            | 글로벌/매니아층 확산율 측정                        |
| `link_copy_clicked`           | 링크 복사 버튼 터치            | -                                            | 구전/단축 링크 확산 확인                           |
| `image_save_modal_clicked`    | 모달 내 전체 이미지 저장 터치  | -                                            | 이미지 저장률 종합 분석                            |
