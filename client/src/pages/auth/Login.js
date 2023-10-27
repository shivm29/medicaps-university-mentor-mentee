import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useAuth } from '../../context/Auth';

const Login = () => {

  const navigate = useNavigate();

  const [auth, setAuth] = useAuth();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const apiUrl = process.env.REACT_APP_API;



  const handleLogin = async (e) => {
    e.preventDefault();
    try {


      const res = await axios.post(`${apiUrl}/api/v1/auth/login`, { email, password })


      if (res.data.success) {
        // toast.success(res.data.message)
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token
        })
        localStorage.setItem('auth', JSON.stringify(res.data));
        if (res.data.user.role === "student") navigate("/student")
        if (res.data.user.role === "admin") navigate("/admin")
        if (res.data.user.role === "teacher") navigate("/teacher")


      } else {
        window.alert("error")
      }

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section  >
      <form onSubmit={handleLogin}  >

        <h1  >Login Form</h1>

        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Enter Email' />

        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Enter Password' />

        <button type='submit'  > Login </button>
      </form>
    </section>
  )
}

export default Login