import React from "react";
import { HistorySection } from "../components/main/HistorySection";
import { DrawBoard } from "../components/shared/DrawBoard";

interface IHistory {}

export const History: React.FC<IHistory> = () => {
  return (
    <>
      <HistorySection />
      <DrawBoard />
    </>
  );
};
