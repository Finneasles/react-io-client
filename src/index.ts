import { useEffect, useRef } from "react";
import io, { SocketOptions } from "socket.io-client";

export const useSocket = (url: string, options?: SocketOptions & any) => {
  const socket = useRef(io(url, options)).current;
  useEffect(
    () => () => {
      socket?.close();
    },
    [socket]
  );
  return [socket];
};

export default useSocket;
