import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import Register from './Register'; 
import Home from './Home';
import InsertJobApplication from './insertJobApplication';
import UpdateJobApplication from './updateJobApplication';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/insertJobApplication" element={<InsertJobApplication />} />
        <Route path="/editJobApplication/:applicationId" element={<UpdateJobApplication />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
