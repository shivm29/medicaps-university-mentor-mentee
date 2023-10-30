import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/Auth';

const Login = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [userRole, setUserRole] = useState('');

  const apiUrl = process.env.REACT_APP_API;


  useEffect(() => {
    if (auth.user) {
      // User is already logged in, redirect to "/student"
      navigate(`/${auth?.user?.role}`);
    }
  }, [auth.user, navigate]);


  const handleLogin = async (e) => {
    // Clear user role before making a new login request
    // setUserRole('');
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/api/v1/auth/login`, { email, password });

      if (res.data.success) {
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });

        localStorage.setItem('auth', JSON.stringify(res.data));
        navigate(`/${res?.data?.user?.role}`);

      } else {
        window.alert("Login failed");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='flex h-screen w-full justify-center items-center font-Poppins' >
      {/* form container */}
      <div className='flex flex-col border rounded-lg h-fit md:w-1/3 w-96 p-4 ' >
        <div className='flex p-4 justify-center mb-10 '  >
          <img src="/images/logo-navbar.png" alt="" />
        </div>
        <form onSubmit={handleLogin} className='flex flex-col' >
          <h1 className=' text-2xl mb-3 ' >Login Form</h1>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className='focus:outline-none p-3 border my-3' type="email" placeholder='Enter Email' />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className='focus:outline-none p-3 border my-3' placeholder='Enter Password' />
          <button type='submit' className='flex justify-center items-center p-3  bg-medicaps text-white font-semibold my-5 hover:scale-95 ease-in-out duration-300   ' >Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login;


/**
 
 <section className=' bg-black text-white ' >
      <form onSubmit={handleLogin}>
        <h1 >Login Form</h1>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Enter Email' />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Enter Password' />
        <button type='submit'>Login</button>
      </form>
    </section>

 */