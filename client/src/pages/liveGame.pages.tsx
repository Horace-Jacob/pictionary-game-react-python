import React from "react";
import { WaitingRoomSection } from "../components/main/WaitingRoomSection";
import { useParams } from "react-router-dom";

interface ILiveGame {}

export const LiveGame: React.FC<ILiveGame> = () => {
  const { roomCode } = useParams();
  return (
    <>
      <WaitingRoomSection roomCode={roomCode} />
    </>
  );
};
