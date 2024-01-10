// Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/register`, {
          name: name,
          email: email,
          password: password
        })
        .then(response => {
          // Handle successful response here
          // console.log('Response:', response.data);
          Swal.fire({
            title: 'Registration Successful!',
            text: response.data.message,
            icon: 'success',
            confirmButtonText: 'OK',
          });
    
          // Redirect to the login page after a successful registration
          navigate('/login');
        })
        .catch(error => {
          // Handle error here
          console.error('Error:', error);
        
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (error.response.status === 422) {
              // Unprocessable Entity - validation error
              const validationErrors = error.response.data;
        
              if (validationErrors.email) {
                // Handle email validation error
                Swal.fire({
                  title: 'Registration Failed',
                  text: validationErrors.email[0], // Display the first email error message
                  icon: 'error',
                  confirmButtonText: 'OK',
                });
              } else if (validationErrors.password) {
                // Handle password validation error
                Swal.fire({
                  title: 'Registration Failed',
                  text: validationErrors.password[0], // Display the first password error message
                  icon: 'error',
                  confirmButtonText: 'OK',
                });
              } else {
                // Handle other validation errors
                // You can customize this part based on your server response structure
                Swal.fire({
                  title: 'Registration Failed',
                  text: 'Registration failed due to validation errors.',
                  icon: 'error',
                  confirmButtonText: 'OK',
                });
              }
            } else {
              // Handle other types of errors (e.g., network error)
              Swal.fire({
                title: 'Registration Failed',
                text: 'Registration failed due to a network error or server issue.',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            }
          }
        });        
    } catch (error) {
      // Handle exception if there's an issue with the try block
      console.error('Exception:', error);
      Swal.fire({
        title: 'Registrasi Gagal',
        text: "Registrasi Gagal, Silahkan Cobalagi",
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="col-md-6 offset-md-3">
        <h2 className="mb-4">Register</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" placeholder="Name" onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control" id="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="button" className="btn border-dark" onClick={handleRegister}>Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
