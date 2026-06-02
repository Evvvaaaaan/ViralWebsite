export interface ResultImageData {
  percentile: number;
  grade: string;
  total: number;
  gender: "male" | "female";
  gradeColor: string;
  typeName: string;
  typeRarity: number;
  rankings?: {
    national?: number;
    region?: number | null;
    ageGroup?: number | null;
  };
  categories: {
    selfCare: number;
    economy: number;
    social: number;
    lifestyle: number;
    mindset: number;
  };
  maxCategoryName: string;
  minCategoryName: string;
}

const WIDTH = 720;
const HEIGHT = 1620;
const SCALE = 2;
const FONT = '"Apple SD Gothic Neo", "Malgun Gothic", Inter, Arial, sans-serif';

function rgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function setFont(ctx: CanvasRenderingContext2D, size: number, weight = 500) {
  ctx.font = `${weight} ${size}px ${FONT}`;
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function fillRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill: string,
  stroke = "rgba(255,255,255,0.12)",
) {
  roundedRect(ctx, x, y, width, height, radius);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawCenteredText(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  size: number,
  color: string,
  weight = 500,
) {
  setFont(ctx, size, weight);
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(value, x, y);
}

function drawText(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  size: number,
  color: string,
  weight = 500,
) {
  setFont(ctx, size, weight);
  ctx.fillStyle = color;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(value, x, y);
}

function drawRightText(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  size: number,
  color: string,
  weight = 700,
) {
  setFont(ctx, size, weight);
  ctx.fillStyle = color;
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(value, x, y);
}

function wrapText(ctx: CanvasRenderingContext2D, value: string, maxWidth: number) {
  const words = value.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth || !current) {
      current = next;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function drawSection(
  ctx: CanvasRenderingContext2D,
  y: number,
  height: number,
  title: string,
  drawContent: (contentY: number) => void,
) {
  fillRoundedRect(ctx, 48, y, 624, height, 24, "rgba(255,255,255,0.07)");
  drawCenteredText(ctx, title, WIDTH / 2, y + 38, 16, "rgba(255,255,255,0.48)", 800);
  drawContent(y + 58);
  return y + height + 26;
}

function withStrokeIcon(
  ctx: CanvasRenderingContext2D,
  color: string,
  draw: () => void,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  draw();
  ctx.restore();
}

function drawUserIcon(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, active = false) {
  withStrokeIcon(ctx, color, () => {
    ctx.lineWidth = active ? 2.6 : 1.8;
    ctx.beginPath();
    ctx.arc(x, y - 5, active ? 4.8 : 4.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y + 9, active ? 8 : 7, Math.PI * 1.12, Math.PI * 1.88);
    ctx.stroke();
  });
}

function drawMapPinIcon(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  withStrokeIcon(ctx, color, () => {
    ctx.beginPath();
    ctx.moveTo(x, y + 10);
    ctx.bezierCurveTo(x - 13, y - 2, x - 12, y - 14, x, y - 14);
    ctx.bezierCurveTo(x + 12, y - 14, x + 13, y - 2, x, y + 10);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y - 5, 3.6, 0, Math.PI * 2);
    ctx.stroke();
  });
}

function drawCalendarIcon(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  withStrokeIcon(ctx, color, () => {
    roundedRect(ctx, x - 9, y - 10, 18, 20, 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 9, y - 4);
    ctx.lineTo(x + 9, y - 4);
    ctx.moveTo(x - 4, y - 13);
    ctx.lineTo(x - 4, y - 7);
    ctx.moveTo(x + 4, y - 13);
    ctx.lineTo(x + 4, y - 7);
    ctx.stroke();
  });
}

function drawGemIcon(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  withStrokeIcon(ctx, color, () => {
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 4);
    ctx.lineTo(x - 4, y - 11);
    ctx.lineTo(x + 4, y - 11);
    ctx.lineTo(x + 10, y - 4);
    ctx.lineTo(x, y + 12);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 4);
    ctx.lineTo(x + 10, y - 4);
    ctx.moveTo(x - 4, y - 11);
    ctx.lineTo(x, y + 12);
    ctx.moveTo(x + 4, y - 11);
    ctx.lineTo(x, y + 12);
    ctx.stroke();
  });
}

function drawTargetIcon(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  withStrokeIcon(ctx, color, () => {
    [10, 6, 2].forEach((radius) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
    });
  });
}

function drawTrendingIcon(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  withStrokeIcon(ctx, color, () => {
    ctx.beginPath();
    ctx.moveTo(x - 11, y + 7);
    ctx.lineTo(x - 3, y - 1);
    ctx.lineTo(x + 3, y + 4);
    ctx.lineTo(x + 11, y - 9);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 5, y - 9);
    ctx.lineTo(x + 11, y - 9);
    ctx.lineTo(x + 11, y - 3);
    ctx.stroke();
  });
}

function drawPeopleGrid(ctx: CanvasRenderingContext2D, data: ResultImageData, y: number) {
  const startX = 186;
  const startY = y;
  const columnGap = 34;
  const rowGap = 25;
  const userPosition = Math.max(0, Math.min(99, Math.ceil(data.percentile) - 1));

  for (let index = 0; index < 100; index += 1) {
    const x = startX + (index % 10) * columnGap;
    const iconY = startY + Math.floor(index / 10) * rowGap;
    const isUser = index === userPosition;
    const color = isUser ? data.gradeColor : "rgba(255,255,255,0.16)";
    drawUserIcon(ctx, x, iconY + 5, color, isUser);
  }
}

function drawCenteredWrappedText(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  maxWidth: number,
  size: number,
  color: string,
  weight = 500,
  lineHeight = 22,
) {
  setFont(ctx, size, weight);
  const lines = wrapText(ctx, value, maxWidth).slice(0, 2);
  lines.forEach((line, index) => {
    drawCenteredText(ctx, line, x, y + index * lineHeight, size, color, weight);
  });
}

function categoryLabel(key: keyof ResultImageData["categories"]) {
  return {
    selfCare: "자기관리",
    economy: "경제력",
    social: "사회성",
    lifestyle: "라이프",
    mindset: "마인드셋",
  }[key];
}

function drawRadar(ctx: CanvasRenderingContext2D, data: ResultImageData, y: number) {
  const keys: Array<keyof ResultImageData["categories"]> = [
    "selfCare",
    "economy",
    "social",
    "lifestyle",
    "mindset",
  ];
  const cx = WIDTH / 2;
  const cy = y + 140;
  const radius = 105;
  const maxValue = 25;

  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1;
  [1 / 3, 2 / 3, 1].forEach((scale) => {
    ctx.beginPath();
    keys.forEach((_, index) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / keys.length;
      const x = cx + Math.cos(angle) * radius * scale;
      const py = cy + Math.sin(angle) * radius * scale;
      if (index === 0) ctx.moveTo(x, py);
      else ctx.lineTo(x, py);
    });
    ctx.closePath();
    ctx.stroke();
  });

  keys.forEach((key, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / keys.length;
    const x = cx + Math.cos(angle) * radius;
    const py = cy + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, py);
    ctx.stroke();

    drawCenteredText(
      ctx,
      categoryLabel(key),
      cx + Math.cos(angle) * (radius + 36),
      cy + Math.sin(angle) * (radius + 36) + 5,
      15,
      "rgba(255,255,255,0.68)",
      500,
    );
  });

  ctx.beginPath();
  keys.forEach((key, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / keys.length;
    const valueRadius = radius * Math.max(0, Math.min(1, data.categories[key] / maxValue));
    const x = cx + Math.cos(angle) * valueRadius;
    const py = cy + Math.sin(angle) * valueRadius;
    if (index === 0) ctx.moveTo(x, py);
    else ctx.lineTo(x, py);
  });
  ctx.closePath();
  ctx.fillStyle = rgba(data.gradeColor, 0.24);
  ctx.fill();
  ctx.strokeStyle = data.gradeColor;
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawInsight(
  ctx: CanvasRenderingContext2D,
  y: number,
  title: string,
  copy: string,
  icon: "gem" | "target" | "trending",
) {
  fillRoundedRect(ctx, 48, y, 624, 74, 18, "rgba(255,255,255,0.07)", "rgba(255,255,255,0.11)");
  if (icon === "gem") drawGemIcon(ctx, 78, y + 36, "rgba(255,255,255,0.8)");
  if (icon === "target") drawTargetIcon(ctx, 78, y + 36, "rgba(255,255,255,0.8)");
  if (icon === "trending") drawTrendingIcon(ctx, 78, y + 36, "rgba(255,255,255,0.8)");

  drawText(ctx, title, 108, y + 31, 19, "#ffffff", 800);
  setFont(ctx, 17, 500);
  ctx.fillStyle = "rgba(255,255,255,0.66)";
  wrapText(ctx, copy, 520).slice(0, 2).forEach((line, index) => {
    drawText(ctx, line, 108, y + 56 + index * 22, 17, "rgba(255,255,255,0.66)", 500);
  });
}

export async function createResultImageBlob(data: ResultImageData) {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH * SCALE;
  canvas.height = HEIGHT * SCALE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available");

  ctx.scale(SCALE, SCALE);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const score = ((data.total / 125) * 10).toFixed(2);
  const genderLabel = data.gender === "male" ? "남자" : "여자";

  const gradient = ctx.createRadialGradient(WIDTH / 2, 80, 20, WIDTH / 2, 80, 240);
  gradient.addColorStop(0, rgba(data.gradeColor, 0.18));
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, 300);

  drawText(ctx, "나는", 230, 112, 28, "rgba(255,255,255,0.36)", 700);
  drawCenteredText(ctx, score, WIDTH / 2, 118, 64, data.gradeColor, 800);
  drawCenteredText(ctx, `의 ${genderLabel}입니다`, WIDTH / 2, 166, 25, "rgba(255,255,255,0.68)", 500);

  const typeText = `${data.typeName} (전체 ${data.typeRarity}%)`;
  setFont(ctx, 25, 800);
  const typeWidth = Math.min(560, ctx.measureText(typeText).width + 56);
  fillRoundedRect(ctx, (WIDTH - typeWidth) / 2, 194, typeWidth, 60, 30, rgba(data.gradeColor, 0.14), data.gradeColor);
  drawCenteredText(ctx, typeText, WIDTH / 2, 233, 25, data.gradeColor, 800);
  drawCenteredText(ctx, `전국 기준 상위 ${data.percentile}%`, WIDTH / 2, 286, 22, "rgba(255,255,255,0.86)", 700);

  let y = 326;
  y = drawSection(ctx, y, 368, "100명 중 당신의 위치", (contentY) => {
    drawPeopleGrid(ctx, data, contentY + 12);
    drawCenteredWrappedText(
      ctx,
      `밝게 표시된 사람이 당신입니다 (상위 ${data.percentile}%: 100명 중 ${Math.max(1, Math.ceil(data.percentile))}번째)`,
      WIDTH / 2,
      contentY + 276,
      500,
      16,
      "rgba(255,255,255,0.62)",
      500,
    );
  });

  const rankingRows: Array<[string, number]> = [
    ["전국", data.rankings?.national ?? data.percentile],
    ...(data.rankings?.region !== undefined && data.rankings.region !== null
      ? [["지역별", data.rankings.region] as [string, number]]
      : []),
    ...(data.rankings?.ageGroup !== undefined && data.rankings.ageGroup !== null
      ? [["연령대별", data.rankings.ageGroup] as [string, number]]
      : []),
  ];
  y = drawSection(ctx, y, 104 + rankingRows.length * 38, "세분화 순위", (contentY) => {
    rankingRows.forEach(([label, value], index) => {
      const rowY = contentY + 28 + index * 38;
      if (label === "연령대별") {
        drawCalendarIcon(ctx, 88, rowY - 5, "rgba(255,255,255,0.6)");
      } else {
        drawMapPinIcon(ctx, 88, rowY - 5, "rgba(255,255,255,0.6)");
      }
      drawText(ctx, label, 112, rowY, 20, "rgba(255,255,255,0.78)", 600);
      drawRightText(ctx, `상위 ${value.toFixed(1)}%`, 632, rowY, 23, data.gradeColor, 800);
    });
  });

  y = drawSection(ctx, y, 344, "역량 분석", (contentY) => {
    drawRadar(ctx, data, contentY);
  });

  y += 2;
  drawInsight(ctx, y, "강점", `${data.maxCategoryName}가 전국 상위 수준입니다`, "gem");
  y += 96;
  drawInsight(ctx, y, "개선 포인트", `${data.minCategoryName}을 1단계만 높이면 순위가 크게 오릅니다`, "target");
  y += 96;
  drawInsight(ctx, y, "전략", `${data.maxCategoryName} 강점을 살려 ${data.minCategoryName}을 보완하세요`, "trending");

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to create result image"));
    }, "image/png", 1);
  });
}
