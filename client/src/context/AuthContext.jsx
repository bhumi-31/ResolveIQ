import { createContext, useContext, useState, useEffect } from "react";
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if(token){
            api.get('/auth/me')
               .then(res => setUser(res.data.user))
               .catch(() => logout())
               .finally(() => setLoading(false));
        }else{
            setLoading(false);
        }
    },[token]);

    const login = (userData, userToken) =>{
        localStorage.setItem('token', userToken);
        setToken(userToken);
        setUser(userData);
    };


    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return(
        <AuthContext.Provider value={{user, token, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    )
};


export const useAuth = () => useContext(AuthContext);