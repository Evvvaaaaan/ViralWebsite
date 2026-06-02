import { createBrowserRouter } from "react-router";
import QuizFlow from "./components/QuizFlow";
import StatsPage from "./pages/StatsPage";
// import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/AboutPage";
import ResultPage from "./pages/ResultPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import DownloadPage from "./components/DownloadPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: QuizFlow,
  },
  {
    path: "/result",
    Component: ResultPage,
  },
  {
    path: "/leaderboard",
    Component: LeaderboardPage,
  },
  {
    path: "/stats",
    Component: StatsPage,
  },
  // {
  //   path: "/admin",
  //   Component: AdminPage,
  // },
  {
    path: "/about",
    Component: AboutPage,
  },
  {
    path: "/download",
    Component: DownloadPage,
  },
], {
  basename: "/percentme"
});
