import { createContext, useContext, useState, useEffect } from "react";
import {io} from 'socket.io-client';
import {useAuth} from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({children}) =>{
    const[socket, setSocket] = useState(null);
    const {token} = useAuth();

    useEffect(() => {
        if(token)  {
            const newSocket = io('http://13.203.98.195:8000', {
                auth : {token}
            });
            setSocket(newSocket);

            return () => newSocket.disconnect();
        }
    },[token]);

    return(
        <SocketContext.Provider value = {{socket}}>
            {children}
        </SocketContext.Provider>
    )
};

export const useSocket = () => useContext(SocketContext);