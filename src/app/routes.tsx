import { createBrowserRouter } from "react-router";
import QuizFlow from "./components/QuizFlow";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: QuizFlow,
  },
  {
    path: "/result",
    lazy: async () => {
      const { default: ResultPage } = await import("./pages/ResultPage");
      return { Component: ResultPage };
    },
  },
  {
    path: "/leaderboard",
    lazy: async () => {
      const { default: LeaderboardPage } = await import("./pages/LeaderboardPage");
      return { Component: LeaderboardPage };
    },
  },
  {
    path: "/stats",
    lazy: async () => {
      const { default: StatsPage } = await import("./pages/StatsPage");
      return { Component: StatsPage };
    },
  },
  // {
  //   path: "/admin",
  //   lazy: async () => {
  //     const { default: AdminPage } = await import("./pages/AdminPage");
  //     return { Component: AdminPage };
  //   },
  // },
  {
    path: "/about",
    lazy: async () => {
      const { default: AboutPage } = await import("./pages/AboutPage");
      return { Component: AboutPage };
    },
  },
  {
    path: "/download",
    lazy: async () => {
      const { default: DownloadPage } = await import("./components/DownloadPage");
      return { Component: DownloadPage };
    },
  },
], {
  basename: "/percentme"
});
