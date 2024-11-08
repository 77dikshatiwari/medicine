import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'

export const AuthContent = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const api_url = import.meta.env.VITE_API_URL;

    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(token){
            axios.get(`${api_url}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response=>{
                setUser(response.data.user);
            }).catch(error=>{
                console.log(error.message);
                localStorage.removeItem('token');
            })
        }
    }, [])
    const login = async (email, password) => {
        try {
            const response = await axios.post(`${api_url}/login`, {
                email,
                password
            });
            const {token, user} = response.data;
            localStorage.setItem('token', token);
            setUser(user);
        } catch (error) {
            console.log(`Login Error: ${error.message}`);
            throw error;
        }
    }
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    }
  return (
    <AuthContent.Provider value={{user, login, logout}}>
        {children}
    </AuthContent.Provider>
  )
}


