import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
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

// 목업 데이터 생성 (낮은 점수 위주)
function generateMockScore(): number {
  const rand = Math.random();
  if (rand < 0.4) {
    // 40% - 40~50점 범위
    return Math.floor(Math.random() * 11) + 40;
  } else if (rand < 0.7) {
    // 30% - 50~60점 범위
    return Math.floor(Math.random() * 11) + 50;
  } else if (rand < 0.9) {
    // 20% - 60~70점 범위
    return Math.floor(Math.random() * 11) + 60;
  } else {
    // 10% - 70~100점 범위
    return Math.floor(Math.random() * 31) + 70;
  }
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

Deno.serve(app.fetch);