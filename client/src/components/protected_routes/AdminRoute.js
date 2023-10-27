import { useState, useEffect } from 'react'
import { useAuth } from '../../context/Auth';
import { Outlet } from 'react-router-dom'
import axios from 'axios';
import Login from '../../pages/auth/Login';

export default function AdminRoute() {
    const [ok, setOk] = useState(false);
    const [auth, setAuth] = useAuth();

    const baseURL = process.env.REACT_APP_API

    useEffect(() => {

        // Confirms if the token provided is correct and user is signedIn or not. If signed in ok = true else false
        const authCheck = async () => {
            const res = await axios.get(`${baseURL}/api/v1/auth/admin-auth`)


            if (res.data.ok) {
                setOk(true)
            } else {
                setOk(false)
            }
        }

        // checks if the user is logged in | if yes it will call authCheck()
        if (auth?.token) authCheck();

    }, [auth?.token])

    return ok ? <Outlet /> : <Login />
}