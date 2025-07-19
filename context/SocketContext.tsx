'use client'

import { websocketService } from "@/api/wsService";
import { useRouter } from "next/navigation";
import React, { createContext, ReactNode, useContext, useEffect } from "react";

const SocketContext = createContext<typeof websocketService | undefined>(undefined);

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token)return router.replace('/login')
    router.replace('/')
    websocketService.connect();
  }, []);

  return (
    <SocketContext.Provider value={websocketService}>
      {children}
    </SocketContext.Provider>
  );
}