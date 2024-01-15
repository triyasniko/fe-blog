import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import Register from './Register'; 
import Home from './Home';
import InsertArticle from './InsertArticle';
import UpdateArticle from './UpdateArticle';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/insertArticle" element={<InsertArticle />} />
        <Route path="/editArticle/:articleId" element={<UpdateArticle />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
