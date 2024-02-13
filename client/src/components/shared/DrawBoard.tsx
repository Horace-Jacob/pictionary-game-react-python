import React from "react";
import { useSocket } from "../../lib/SocketProvider";

interface IDrawBoard {
  roomCode?: string;
}

export const DrawBoard: React.FC<IDrawBoard> = ({ roomCode }) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const contextRef = React.useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = React.useState<boolean>(false);
  const socket = useSocket();

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const context = canvas.getContext("2d");
      if (context) {
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;
        contextRef.current = context;
      }
    }
    socket.on("draw", (data) => {
      handleRemoteDraw(data);
    });

    return () => {
      socket.off("draw");
    };
  }, []);

  const handleRemoteDraw = (data: any) => {
    const { offsetX, offsetY } = data;
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
  };

  const startDrawing = ({
    nativeEvent,
  }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    socket.emit("draw", { roomCode, offsetX, offsetY });
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
    socket.emit("draw", { roomCode, offsetX, offsetY });
  };

  const endDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        className="border border-gray-300"
      />
    </div>
  );
};
