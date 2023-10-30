import React from 'react'
import { useAuth } from '../../context/Auth';
import Navbar from '../../components/Navbar';
const AdminHome = () => {

    const [auth, setAuth] = useAuth()

    const handleLogout = () => {
        localStorage.clear();

        setAuth({
            user: null,
            token: null
        })

        window.location.reload()
        window.alert("You are being logged out")

    }


    return (
        <div className='font-Poppins' >

            <Navbar handleLogout={handleLogout} />

            <div className='p-4' >
                Admin page

            </div>

        </div>

    )
}

export default AdminHome