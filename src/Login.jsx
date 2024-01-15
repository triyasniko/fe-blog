// Login.js
import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import NavLoginRegister from './NavLoginRegister';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticate = localStorage.getItem('access_token');
    if (isAuthenticate) {
      // Redirect to home if already logged in
      navigate('/');
    }
  }, []); 

  const handleLogin = async () => {
    try {
      await axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/login`, {
          email: email,
          password: password
        })
        .then(response => {
          // Handle successful response here
          console.log('Response:', response.data);
          if (response.data.access_token) {
            // Save the access token to a secure location
            localStorage.setItem('access_token', response.data.access_token);
      
            // Optionally, you can also save user information if needed
            const user = response.data.user;
            localStorage.setItem('user', JSON.stringify(user));
      
            // Perform actions for successful login
            // For example, you can redirect to another page or update the UI
            console.log('Login successful!');
      
            // Display success message using SweetAlert
            Swal.fire({
              title: 'Login Successful',
              text: 'Welcome back!',
              icon: 'success',
              confirmButtonText: 'OK',
            });
            navigate('/');
          } else {
            // Handle unsuccessful login
            // You can display an error message to the user
            console.error('Login failed:', response.data.message);
      
            // Display error message using SweetAlert
            Swal.fire({
              title: 'Login Failed',
              text: 'Invalid email or password',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        })
    } catch (error) {
      // Handle exception if there's an issue with the try block
      console.error('Exception:', error);
    }
  };

  return (
    <>
    <div className="container mt-5">
      <div className="col-md-6 offset-md-3">
        <h2 className="mb-4">Login</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control" id="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="button" className="btn border-dark" onClick={handleLogin}>Login</button>
        </form>
      </div>
    </div>
    <NavLoginRegister />
    </>
  );
};

export default Login;
