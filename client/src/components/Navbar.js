import React from 'react'


const Navbar = ({ handleLogout }) => {
    return (
        <div className='flex w-full p-4 justify-between font-Poppins mb-5' >
            <img src="/images/logo-navbar.png" className='h-12' alt="" />

            <button onClick={handleLogout} className='flex justify-center items-center p-3 bg-black text-white  text-sm rounded-sm hover:bg-zinc-700 ease-in-out duration-300 '  ><i className="fa-solid fa-right-from-bracket mr-3"></i> Logout</button>
        </div>
    )
}

export default Navbar