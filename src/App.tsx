import './App.css'
import { Routes, Route, useLocation } from "react-router";
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AlbumView from './pages/Album';
import { TrackContext, TrackContextProvider } from './contexts/MusicContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Artist from './pages/Artist';
import { AuthProvider } from './contexts/AuthContext';
import Account from './pages/Account';
import PlaylistView from './pages/PlaylistView';
import Accounts from './pages/Accounts';
import { useContext, useEffect } from 'react';
import MainPlayer from './components/MainPlayer';
import Header from './components/Header';

function App() {

  const { currentTrack } = useContext(TrackContext)
  const location = useLocation();

  const hideComponents = ["/login", "/signup"].includes(location.pathname);

  useEffect(() => {
    if(currentTrack) console.log("kéne legyen az a szar");
  }, [currentTrack])

  return (
    <>
      <AuthProvider>
        <TrackContextProvider>
          <DndProvider backend={HTML5Backend}>
              {!hideComponents && <Header />}
              <main className="flex flex-row h-screen w-full text-white gap-2 p-4 transition-all">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/albumView/:id" element={<AlbumView />} />
                  <Route path='/artistView/:id' element={<Artist />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/account" element={<Account />} />
                  <Route path='/accounts/:id' element={<Accounts />} />
                  <Route path='/playlist/:id' element={<PlaylistView />} />
                </Routes>
                {
                  !hideComponents && currentTrack ? (
                    <section className="flex-1 xl:h-full w-full flex-col justify-center gap-10 bg-222 rounded-lg">
                      <MainPlayer />
                    </section>
                  ) : (
                    <span></span>
                  )
                }
              </main>
          </DndProvider>
        </TrackContextProvider>
      </AuthProvider >
    </>
  )
}

export default App
