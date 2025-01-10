import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<h1>Acc</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
