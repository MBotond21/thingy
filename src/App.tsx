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
import { AuthProvider } from './contexts/AuthContext';
import Account from './pages/Account';
import PlaylistView from './pages/PlaylistView';
import Accounts from './pages/Accounts';

function App() {

  return (
    <>
      <AuthProvider>
        <TrackContextProvider>
          <DndProvider backend={HTML5Backend}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/albumView/:id" element={<AlbumView />} />
                <Route path='/artistView/:id' element={<Artist />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/account" element={<Account/>} />
                <Route path='/accounts/:id' element={<Accounts />} />
                <Route path='/playlist/:id' element={<PlaylistView/>} />
              </Routes>
            </BrowserRouter>
          </DndProvider>
        </TrackContextProvider>
      </AuthProvider>
    </>
  )
}

export default App
