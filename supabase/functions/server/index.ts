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
// 평균이 약 11.25점(총점 56.25점, 10점 만점 기준 약 4.5점)이 되도록 정규분포 가중치 적용
function generateMockScore(): number {
  let score = 0;
  for (let i = 0; i < 5; i++) {
    const rand = Math.random();
    if (rand < 0.30) score += 1;
    else if (rand < 0.65) score += 2;
    else if (rand < 0.85) score += 3;
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

// 목업 데이터 초기화 (배치 처리를 통한 만개 이상 고속 삽입 지원)
app.post("/make-server-2ae6dc9b/init-mock-data", async (c) => {
  try {
    const mockCount = 10000;
    const batchSize = 1000;
    const regions = ['서울/경기', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '충남', '충북', '전남', '전북', '경남', '경북', '강원', '제주'];
    const ageGroups = ['10대', '20대', '30대', '40대', '50대 이상'];

    console.log(`Generating ${mockCount} mock data entries in batches of ${batchSize}...`);

    for (let b = 0; b < mockCount; b += batchSize) {
      const keys: string[] = [];
      const values: any[] = [];
      const currentBatchSize = Math.min(batchSize, mockCount - b);

      for (let i = 0; i < currentBatchSize; i++) {
        const globalIdx = b + i;
        const categories = generateMockCategories();
        const total = Object.values(categories).reduce((sum: number, val) => sum + val, 0);
        const gender = Math.random() > 0.5 ? 'male' : 'female';
        const region = regions[Math.floor(Math.random() * regions.length)];
        const ageGroup = ageGroups[Math.floor(Math.random() * ageGroups.length)];

        const mockData = {
          id: `mock-${globalIdx}`,
          gender,
          total,
          categories,
          timestamp: Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
          isMock: true,
          region,
          ageGroup,
        };

        keys.push(`result:mock-${globalIdx}`);
        values.push(mockData);
      }

      await kv.mset(keys, values);
      console.log(`Inserted batch ${b} to ${b + currentBatchSize}`);
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
  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }

  const { gender, total, categories, region, ageGroup } = body;

  if (!gender || total == null || !categories) {
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

  // 저장 실패 시 500 반환 (클라이언트 재시도 방지를 위해 저장과 순위 계산을 분리)
  try {
    await kv.set(`result:${id}`, resultData);
  } catch (error) {
    console.error('Error saving result:', error);
    return c.json({ error: String(error) }, 500);
  }

  // 순위 계산은 저장 성공 후 독립적으로 시도 (실패해도 저장된 데이터에 영향 없음)
  let rankings = null;
  try {
    const allResults = await kv.getByPrefix('result:');
    rankings = calculateRankings(resultData, allResults);
    console.log(`Saved result ${id} with rankings:`, rankings);
  } catch (error) {
    console.warn(`Ranking calculation failed for ${id}, returning without rankings:`, error);
  }

  return c.json({ success: true, id, rankings });
});

function normalCDF(x: number, mean: number, stdDev: number): number {
  const z = (x - mean) / stdDev;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  let cdf = 1 - p;
  if (z < 0) cdf = p;
  return cdf;
}

function getAgeDistribution(ageGroup: string | null) {
  if (ageGroup === '10대') return { mean: 52, stdDev: 13 };
  if (ageGroup === '20~24세') return { mean: 60, stdDev: 15 };
  if (ageGroup === '25~29세') return { mean: 66, stdDev: 16 };
  if (ageGroup === '30~39세') return { mean: 72, stdDev: 17 };
  if (ageGroup === '40세 이상') return { mean: 75, stdDev: 16 };
  return { mean: 66, stdDev: 16 };
}

function modelPercentile(total: number, ageGroup: string | null): number {
  const { mean, stdDev } = getAgeDistribution(ageGroup);
  const cdfVal = normalCDF(total, mean, stdDev);
  return Math.max(0.1, Math.min(99.9, parseFloat(((1 - cdfVal) * 100).toFixed(1))));
}

function empiricalPercentile(total: number, results: any[]): number | null {
  if (results.length === 0) return null;
  const betterCount = results.filter((r: any) => r.total > total).length;
  return Math.max(0.1, parseFloat(((betterCount / results.length) * 100).toFixed(1)));
}

function stabilizePercentile(empirical: number | null, model: number, sampleSize: number): number {
  if (empirical === null || sampleSize < 200) return model;
  const blended = model * 0.75 + empirical * 0.25;
  return Math.max(0.1, Math.min(99.9, parseFloat(blended.toFixed(1))));
}

// 순위 계산 로직
function calculateRankings(userResult: any, allResults: any[]) {
  const { gender, total, region, ageGroup } = userResult;

  const sameGenderResults = allResults.filter((r: any) => r.gender === gender);
  const model = modelPercentile(total, ageGroup);
  const national = stabilizePercentile(
    empiricalPercentile(total, sameGenderResults),
    model,
    sameGenderResults.length,
  );

  let regionalPercentile = null;
  if (region) {
    const sameRegionResults = sameGenderResults.filter((r: any) => r.region === region);
    regionalPercentile = stabilizePercentile(
      empiricalPercentile(total, sameRegionResults),
      national,
      sameRegionResults.length,
    );
  }

  let agePercentile = null;
  if (ageGroup) {
    const sameAgeResults = sameGenderResults.filter((r: any) => r.ageGroup === ageGroup);
    agePercentile = stabilizePercentile(
      empiricalPercentile(total, sameAgeResults),
      model,
      sameAgeResults.length,
    );
  }

  return {
    national,
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
