import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import Home from './pages/Home';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={ <h1>Reg</h1> } />
          <Route path="/login" element={ <h1>Login</h1> } />
          <Route path="/account" element={ <h1>Acc</h1> } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
