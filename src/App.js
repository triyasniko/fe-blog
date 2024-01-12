import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import Register from './Register'; 
import Home from './Home';
import InsertTask from './InsertTask';
import UpdateTask from './UpdateTask';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/insertTask" element={<InsertTask />} />
        <Route path="/editTask/:taskId" element={<UpdateTask />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
