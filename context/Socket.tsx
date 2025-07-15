'use client'
import { websocketService } from "@/api/wsService";
import React, { createContext, ReactNode, useContext, useEffect } from "react";

const SocketContext = createContext<typeof websocketService | undefined>(undefined);

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    websocketService.connect();
  }, []);

  return (
    <SocketContext.Provider value={websocketService}>
      {children}
    </SocketContext.Provider>
  );
}