import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Create socket connection
    const newSocket = io("http://localhost:3001", {
      transports: ["websocket"],
      autoConnect: true,
    });

    // Store socket in state
    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  return socket;
}
