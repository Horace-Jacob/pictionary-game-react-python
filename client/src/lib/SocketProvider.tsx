import React, { createContext, useEffect, useContext } from "react";
import io, { Socket } from "socket.io-client";

interface SocketContextProps {
  children: React.ReactNode;
}

const SocketContext = createContext<Socket | undefined>(undefined);

export const SocketProvider: React.FC<SocketContextProps> = ({ children }) => {
  const socket = io(
    process.env.REACT_APP_SERVER_API_URL
      ? process.env.REACT_APP_SERVER_API_URL
      : "<YOUR SERVER ENDPOINT>"
  );

  useEffect(() => {
    // Cleanup the socket connection when the component is unmounted
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = (): Socket => {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return socket;
};
