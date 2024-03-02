// src/DrawingBoard.tsx
import React, { useRef, useEffect, useCallback } from "react";
import { useSocket } from "../lib/SocketProvider";
import { DrawBoard } from "../components/shared/DrawBoard";

interface DrawingBoardProps {}

const TestPage: React.FC<DrawingBoardProps> = () => {
  return <DrawBoard />;
};

export default TestPage;
