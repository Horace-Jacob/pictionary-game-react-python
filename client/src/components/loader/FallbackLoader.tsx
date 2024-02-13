import React from "react";
import { HashLoader } from "react-spinners";

interface IFallbackLoader {}

export const FallbackLoader: React.FC<IFallbackLoader> = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <HashLoader color="#36d7b7" />
    </div>
  );
};
