import React, { Suspense } from "react";
import { getUsername, isAuth } from "../../utils/shared";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../navbar/Navbar";
import { PictionaryHistory } from "../games/PictionaryHistory";
import { FallbackLoader } from "../loader/FallbackLoader";

interface IHistorySection {}

export const HistorySection: React.FC<IHistorySection> = () => {
  const [username, setUsername] = React.useState<string>("");
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!isAuth()) {
      navigate("/");
    } else {
      const username = getUsername();
      setUsername(username ? username : "");
    }
  }, []);
  return (
    <>
      <Navbar username={username} currentTab="history" />
      <main className="container mx-auto">
        <Suspense fallback={<FallbackLoader />}>
          <PictionaryHistory />
        </Suspense>
      </main>
    </>
  );
};
