import React, { lazy, Suspense } from "react";
import { Navbar } from "../navbar/Navbar";
import { FallbackLoader } from "../loader/FallbackLoader";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { JwtType } from "../../utils/types";

const PictionaryGame = lazy(() => import("../games/PictionaryGame"));

interface IMainSection {}

export const MainSection: React.FC<IMainSection> = () => {
  const navigator = useNavigate();
  const [username, setUsername] = React.useState<string>("");

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token != null) {
      const user: JwtType = jwtDecode(token);
      setUsername(user.name);
    } else {
      const query = new URLSearchParams(window.location.search);
      const jwt = query.get("jwt");
      if (jwt) {
        localStorage.setItem("token", jwt);
        const user: JwtType = jwtDecode(jwt);
        setUsername(user.name);
        return navigator("/");
      } else {
      }
    }
  }, []);
  return (
    <>
      <Navbar username={username} currentTab="activities" />
      <main className="container mx-auto">
        <Suspense fallback={<FallbackLoader />}>
          <PictionaryGame />
        </Suspense>
      </main>
    </>
  );
};
