import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_URL } from 'src/configs';
import { useAppSelector } from 'src/redux';

const useSocket = () => {
  const socketRef = useRef<Socket>();
  const token = useAppSelector((s) => s.auth.accessToken);
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.close();
    } else {
      socketRef.current = io(API_URL ?? '', {
        query: {
          token,
        },
        secure: true,
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [token]);

  return { appSocket: socketRef.current };
};
export default useSocket;
