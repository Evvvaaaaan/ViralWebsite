import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.ts";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-2ae6dc9b/health", (c) => {
  return c.json({ status: "ok" });
});

// 목업 카테고리 점수 생성 (실제 유저와 동일한 5~25점 범위)
// 평균이 약 12~14점이 되도록 실제 문항 응답 가중치를 부여한 종형 분포 적용
function generateMockScore(): number {
  let score = 0;
  for (let i = 0; i < 5; i++) {
    const rand = Math.random();
    if (rand < 0.20) score += 1;
    else if (rand < 0.50) score += 2;
    else if (rand < 0.80) score += 3;
    else if (rand < 0.95) score += 4;
    else score += 5;
  }
  return score;
}

function generateMockCategories() {
  return {
    selfCare: generateMockScore(),
    economy: generateMockScore(),
    social: generateMockScore(),
    lifestyle: generateMockScore(),
    mindset: generateMockScore(),
  };
}

// 목업 데이터 초기화
app.post("/make-server-2ae6dc9b/init-mock-data", async (c) => {
  try {
    const mockCount = 2000;
    const regions = ['서울/경기', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '기타'];
    const ageGroups = ['10대', '20대', '30대', '40대', '50대 이상'];

    console.log(`Generating ${mockCount} mock data entries...`);

    for (let i = 0; i < mockCount; i++) {
      const categories = generateMockCategories();
      const total = Object.values(categories).reduce((sum: number, val) => sum + val, 0);
      const gender = Math.random() > 0.5 ? 'male' : 'female';
      const region = regions[Math.floor(Math.random() * regions.length)];
      const ageGroup = ageGroups[Math.floor(Math.random() * ageGroups.length)];

      const mockData = {
        id: `mock-${i}`,
        gender,
        total,
        categories,
        timestamp: Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
        isMock: true,
        region,
        ageGroup,
      };

      await kv.set(`result:mock-${i}`, mockData);
    }

    console.log(`Successfully generated ${mockCount} mock data entries`);
    return c.json({ success: true, count: mockCount });
  } catch (error) {
    console.error('Error initializing mock data:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// 결과 저장
app.post("/make-server-2ae6dc9b/results", async (c) => {
  try {
    const body = await c.req.json();
    const { gender, total, categories, region, ageGroup } = body;

    if (!gender || !total || !categories) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const resultData = {
      id,
      gender,
      total,
      categories,
      timestamp: Date.now(),
      isMock: false,
      region: region || '서울/경기',
      ageGroup: ageGroup || '20대',
    };

    await kv.set(`result:${id}`, resultData);

    // 순위 계산
    const allResults = await kv.getByPrefix('result:');
    const rankings = calculateRankings(resultData, allResults);

    console.log(`Saved result ${id} with rankings:`, rankings);
    return c.json({ success: true, id, rankings });
  } catch (error) {
    console.error('Error saving result:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// 순위 계산 로직
function calculateRankings(userResult: any, allResults: any[]) {
  const { gender, total, region, ageGroup } = userResult;

  // 전국 순위
  const sameGenderResults = allResults.filter((r: any) => r.gender === gender);
  const betterCount = sameGenderResults.filter((r: any) => r.total > total).length;
  const national = Math.max(0.1, ((betterCount / sameGenderResults.length) * 100).toFixed(1));

  // 지역 순위 (region이 있을 때만)
  let regionalPercentile = null;
  if (region) {
    const sameRegionResults = sameGenderResults.filter((r: any) => r.region === region);
    const betterRegionCount = sameRegionResults.filter((r: any) => r.total > total).length;
    regionalPercentile = sameRegionResults.length > 0
      ? parseFloat(Math.max(0.1, ((betterRegionCount / sameRegionResults.length) * 100).toFixed(1)))
      : parseFloat(national);
  }

  // 연령대 순위 (ageGroup이 있을 때만)
  let agePercentile = null;
  if (ageGroup) {
    const sameAgeResults = sameGenderResults.filter((r: any) => r.ageGroup === ageGroup);
    const betterAgeCount = sameAgeResults.filter((r: any) => r.total > total).length;
    agePercentile = sameAgeResults.length > 0
      ? parseFloat(Math.max(0.1, ((betterAgeCount / sameAgeResults.length) * 100).toFixed(1)))
      : parseFloat(national);
  }

  return {
    national: parseFloat(national),
    region: regionalPercentile,
    ageGroup: agePercentile,
    totalCount: sameGenderResults.length,
  };
}

// 리더보드 순위 조회 (전체, 남성, 여성 상위 10명)
app.get("/make-server-2ae6dc9b/leaderboard", async (c) => {
  try {
    const allResults = await kv.getByPrefix('result:');
    const validResults = allResults.filter((r: any) => r && typeof r.total === 'number');

    const mapAndSort = (results: any[]) => {
      return results
        .sort((a, b) => b.total - a.total)
        .map((r, idx) => ({
          id: r.id,
          rank: idx + 1,
          name: r.isMock ? '익명' : (r.region ? `${r.region} 참여자` : '익명 유저'),
          score: parseFloat(((r.total / 125) * 10).toFixed(2)),
          gender: r.gender,
        }));
    };

    const allRankings = mapAndSort(validResults);
    const maleRankings = mapAndSort(validResults.filter((r: any) => r.gender === 'male'));
    const femaleRankings = mapAndSort(validResults.filter((r: any) => r.gender === 'female'));

    return c.json({
      success: true,
      all: allRankings,
      male: maleRankings,
      female: femaleRankings,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// 통계 조회
app.get("/make-server-2ae6dc9b/stats", async (c) => {
  try {
    const allResults = await kv.getByPrefix('result:');
    const realUsers = allResults.filter((r: any) => !r.isMock);
    const mockUsers = allResults.filter((r: any) => r.isMock);

    return c.json({
      total: allResults.length,
      real: realUsers.length,
      mock: mockUsers.length,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// 사용자 행동 분석 이벤트 로깅
app.post("/make-server-2ae6dc9b/events", async (c) => {
  try {
    const body = await c.req.json();
    const { eventType, metadata } = body;

    if (!eventType) {
      return c.json({ error: 'Missing required field: eventType' }, 400);
    }

    const id = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const eventData = {
      id,
      eventType,
      metadata: metadata || {},
      timestamp: Date.now(),
    };

    await kv.set(`event:${id}`, eventData);

    console.log(`Log event saved: ${eventType}`, eventData);
    return c.json({ success: true, id });
  } catch (error) {
    console.error('Error logging event:', error);
    return c.json({ error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
