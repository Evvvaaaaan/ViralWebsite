import { createBrowserRouter, useRouteError } from "react-router";
import { useEffect } from "react";
import QuizFlow from "./components/QuizFlow";

function RouteErrorElement() {
  const error = useRouteError();
  const isChunkError =
    error instanceof TypeError &&
    (error.message.includes("Failed to fetch dynamically imported module") ||
      error.message.includes("Importing a module script failed") ||
      error.message.includes("Unable to preload CSS"));

  useEffect(() => {
    if (isChunkError) {
      window.location.reload();
    }
  }, [isChunkError]);

  if (isChunkError) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#000", color: "#fff", flexDirection: "column", gap: 12 }}>
        <p style={{ fontSize: 15, opacity: 0.7 }}>업데이트된 버전으로 이동 중...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#000", color: "#fff", flexDirection: "column", gap: 16, padding: 24 }}>
      <p style={{ fontSize: 18, fontWeight: 600 }}>오류가 발생했습니다</p>
      <p style={{ fontSize: 14, opacity: 0.6 }}>잠시 후 다시 시도해 주세요</p>
      <button
        onClick={() => (window.location.href = "/percentme")}
        style={{ marginTop: 8, padding: "10px 24px", borderRadius: 12, background: "#0066cc", color: "#fff", border: "none", fontSize: 14, cursor: "pointer" }}
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}

function withErrorElement(lazy: () => Promise<{ Component: React.ComponentType }>) {
  return { lazy, errorElement: <RouteErrorElement /> };
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: QuizFlow,
    errorElement: <RouteErrorElement />,
  },
  {
    path: "/result",
    ...withErrorElement(async () => {
      const { default: ResultPage } = await import("./pages/ResultPage");
      return { Component: ResultPage };
    }),
  },
  {
    path: "/leaderboard",
    ...withErrorElement(async () => {
      const { default: LeaderboardPage } = await import("./pages/LeaderboardPage");
      return { Component: LeaderboardPage };
    }),
  },
  {
    path: "/stats",
    ...withErrorElement(async () => {
      const { default: StatsPage } = await import("./pages/StatsPage");
      return { Component: StatsPage };
    }),
  },
  {
    path: "/about",
    ...withErrorElement(async () => {
      const { default: AboutPage } = await import("./pages/AboutPage");
      return { Component: AboutPage };
    }),
  },
  {
    path: "/download",
    ...withErrorElement(async () => {
      const { default: DownloadPage } = await import("./components/DownloadPage");
      return { Component: DownloadPage };
    }),
  },
], {
  basename: "/percentme",
});
