import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AlbumView from './pages/Album';
import { TrackContextProvider } from './contexts/MusicContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Artist from './pages/Artist';

function App() {

  return (
    <>
      <TrackContextProvider>
        <DndProvider backend={HTML5Backend}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/albumView" element={<AlbumView />} />
              <Route path='/artistView' element={<Artist />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/account" element={<h1>Acc</h1>} />
            </Routes>
          </BrowserRouter>
        </DndProvider>
      </TrackContextProvider>
    </>
  )
}

export default App
