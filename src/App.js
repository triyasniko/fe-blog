import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import Register from './Register'; 

function App() {
  return (
    <BrowserRouter>
      <div class="d-flex justify-content-center">
        <ul class="nav nav-tabs mt-2">
          <li class="nav-item">
            <Link class="nav-link text-dark rounded-0" to="/login">Login</Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link text-dark rounded-0" to="/register">Register</Link>
          </li>
        </ul>
      </div>
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
