import React from "react";
import { DrawBoard } from "../shared/DrawBoard";

interface ILiveGameSection {
  roomCode?: string;
}

export const LiveGameSection: React.FC<ILiveGameSection> = ({ roomCode }) => {
  return (
    <>
      <DrawBoard roomCode={roomCode} />
    </>
  );
};
