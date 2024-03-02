import type { RouteObject } from "react-router-dom";
import { Home } from "./pages/home.pages";
import { History } from "./pages/history.pages";
import { LiveGame } from "./pages/liveGame.pages";
import TestPage from "./pages/test.pages";

const normalRoutes: RouteObject = {
  path: "*",
  element: "",
  children: [
    {
      index: true,
      element: <Home />,
    },
    {
      path: "liveGame/:roomCode",
      element: <LiveGame />,
    },
    {
      path: "history",
      element: <History />,
    },
    {
      path: "test",
      element: <TestPage />,
    },
  ],
};

const routes: RouteObject[] = [normalRoutes];

export default routes;
