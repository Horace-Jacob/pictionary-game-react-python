import type { RouteObject } from "react-router-dom";
import { Home } from "./pages/home.pages";
import { History } from "./pages/history.pages";
import { LiveGame } from "./pages/liveGame.pages";

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
  ],
};

const routes: RouteObject[] = [normalRoutes];

export default routes;
