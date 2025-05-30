import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import { API_PATH } from "../utils/apiPath";

export const userContext = createContext();
const UserProvider = ({ children }) => {
    const[user, setUser] = useState(null);
    const[loading, setLoading] = useState(true);

    useEffect(() => {
        if(user) return;

        const data = localStorage.getItem("user");
        if(!data){
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(API_PATH.AUTH.GET_PROFILE);
                setUser(response.data?.data);
            } catch (error) {
                console.error("User not authenticated", error);
            } finally{
                setLoading(false);
            }
        }

        fetchUser();
    }, []);

    const updateUser = (userData) => {
        setUser(userData?.data);
        localStorage.setItem("user", userData?.data.userName);
        setLoading(false);
    };

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("user");
    }

    return(
        <userContext.Provider value={{ user, loading, updateUser, clearUser}}>
            {children}
        </userContext.Provider>
    )
}

export default UserProvider;
export const useUser = () => useContext(userContext);