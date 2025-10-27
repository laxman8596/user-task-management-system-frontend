import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
export const AuthProvider=({children})=>{
    const [auth, setAuth] = useState(null);
    const [loading, setLoading]= useState(true);

    useEffect(()=>{
        const checkAuth = async()=>{
            try {
               const res = await axios.get("/api/auth/refresh",{
                withCredentials:true
               })
              setAuth({accessToken: res.data.accessToken, user: res.data.user})
            } catch (error) {
                setAuth(null)
            }finally{
                setLoading(false)
            }
        }
        checkAuth();
    },[])
 return (
    <AuthContext.Provider value={{auth, setAuth, loading}}>
        {children}
    </AuthContext.Provider>
 )
}

export const useAuth = ()=>useContext(AuthContext)