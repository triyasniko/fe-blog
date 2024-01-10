// Login.js
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/login`, {
          email: email,
          password: password
        })
        .then(response => {
          // Handle successful response here
          console.log('Response:', response.data);
        })
        .catch(error => {
          // Handle error here
          console.error('Error:', error);
        });
    } catch (error) {
      // Handle exception if there's an issue with the try block
      console.error('Exception:', error);
    }
  };

  return (
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
  );
};

export default Login;
