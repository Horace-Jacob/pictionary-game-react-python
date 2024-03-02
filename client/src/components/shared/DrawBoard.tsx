import React from "react";
import { useSocket } from "../../lib/SocketProvider";
import {
  CanvasPath,
  ExportImageType,
  ReactSketchCanvas,
  ReactSketchCanvasProps,
  ReactSketchCanvasRef,
} from "react-sketch-canvas";

interface IDrawBoard {
  roomCode?: string;
}

export const DrawBoard: React.FC<IDrawBoard> = ({ roomCode }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const socket = useSocket();
  React.useEffect(() => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d")!;
    let drawing = false;

    const startDrawing = (event: MouseEvent) => {
      drawing = true;
      context.beginPath();
      context.moveTo(
        event.clientX - canvas.offsetLeft,
        event.clientY - canvas.offsetTop
      );
    };

    const draw = (event: MouseEvent) => {
      if (!drawing) return;
      context.lineTo(
        event.clientX - canvas.offsetLeft,
        event.clientY - canvas.offsetTop
      );
      context.stroke();
    };

    const stopDrawing = () => {
      drawing = false;
      const data = {
        roomCode: roomCode,
        drawingData: canvas.toDataURL(),
      };
      socket.emit("draw", data);
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
    };
  }, []);

  React.useEffect(() => {
    socket.on("draw", (data: string) => {
      const canvas = canvasRef.current!;
      const context = canvas.getContext("2d")!;
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0);
      };
      img.src = data;
    });
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border"
        style={{ touchAction: "none" }}
      />
    </div>
  );
};

// export const DrawBoard: React.FC<IDrawBoard> = ({ roomCode }) => {
//   const [paths, setPaths] = React.useState<CanvasPath[]>([]);
//   const socket = useSocket();
//   const [lastStroke, setLastStroke] = React.useState<{
//     stroke: CanvasPath | null;
//     isEraser: boolean | null;
//   }>({ stroke: null, isEraser: null });
//   const canvasRef = React.createRef<ReactSketchCanvasRef>();
//   const onChange = (updatedPaths: CanvasPath[]): void => {
//     setPaths(updatedPaths);

//     socket.emit("draw", { roomCode, paths: paths });
//   };

//   const clearCanvas = (): void => {
//     setPaths([]);
//     socket.emit("clear", { roomCode });
//   };

//   React.useEffect(() => {
//     socket.on("draw", (data) => {
//       // Update paths based on received data
//       setPaths(data.paths);
//     });

//     socket.on("clear", () => {
//       // Clear the canvas on receiving clear event
//       setPaths([]);
//     });

//     return () => {
//       // Cleanup on component unmount
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <ReactSketchCanvas
//       ref={canvasRef}
//       onChange={onChange}
//       // onStroke={(stroke, isEraser) => setLastStroke({ stroke, isEraser })}
//     />
//   );
// };
