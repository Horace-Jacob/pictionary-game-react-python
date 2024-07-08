import React, { useRef, useEffect, useState } from "react";
import { useSocket } from "../../lib/SocketProvider";
import { debounce } from "lodash";
interface Point {
  x: number;
  y: number;
}

interface DrawAction {
  type: "start" | "move" | "end";
  point: Point;
  color: string;
  thickness: number;
  tool: "brush" | "eraser";
}

interface DrawBoardProps {
  roomCode?: string;
}

export const DrawBoard: React.FC<DrawBoardProps> = ({ roomCode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const socketRef = useSocket();
  const [thickness, setThickness] = useState(2);
  const [tool, setTool] = useState<"brush" | "eraser">("brush");

  useEffect(() => {
    socketRef.on("draw_action", (action: DrawAction) => {
      drawOnCanvas(action);
    });
    socketRef.on("load_drawing", (actions: DrawAction[]) => {
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext("2d");
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          actions.forEach((action) => drawOnCanvas(action));
        }
      }
    });
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) {
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = 2;
    }
  }, []);

  const drawOnCanvas = (action: DrawAction) => {
    requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!context) return;

      context.strokeStyle = action.tool === "eraser" ? "#FFFFFF" : action.color;
      context.lineWidth = action.thickness;

      switch (action.type) {
        case "start":
          context.beginPath();
          context.moveTo(action.point.x, action.point.y);
          break;
        case "move":
          context.lineTo(action.point.x, action.point.y);
          context.stroke();
          break;
        case "end":
          context.closePath();
          break;
      }
    });
  };

  const getMousePos = (
    canvas: HTMLCanvasElement,
    evt: React.MouseEvent
  ): Point => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  };

  const handleMouseDown = (evt: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const point = getMousePos(canvas, evt);
    const action: DrawAction = { type: "start", point, color, thickness, tool };
    socketRef.emit("draw_action", { roomCode, action });
    drawOnCanvas(action);
  };

  const handleMouseMove = (evt: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const point = getMousePos(canvas, evt);
    const action: DrawAction = { type: "move", point, color, thickness, tool };
    socketRef.emit("draw_action", { roomCode, action });
    drawOnCanvas(action);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    const action: DrawAction = {
      type: "end",
      point: { x: 0, y: 0 },
      color,
      thickness,
      tool,
    };
    socketRef.emit("draw_action", { roomCode, action });
  };

  return (
    <div>
      <div>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          disabled={tool === "eraser"}
        />
        <input
          type="range"
          min="1"
          max="20"
          value={thickness}
          onChange={(e) => setThickness(Number(e.target.value))}
        />
        <button onClick={() => setTool("brush")} disabled={tool === "brush"}>
          Brush
        </button>
        <button onClick={() => setTool("eraser")} disabled={tool === "eraser"}>
          Eraser
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseUp}
        style={{ border: "1px solid #000" }}
      />
    </div>
  );
};
