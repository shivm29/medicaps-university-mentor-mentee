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
    <section>
      <form onSubmit={handleLogin}>
        <h1>Login Form</h1>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Enter Email' />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Enter Password' />
        <button type='submit'>Login</button>
      </form>
    </section>
  )
}

export default Login;