import './App.css'
import { Routes, Route, useLocation } from "react-router";
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AlbumView from './pages/Album';
import { TrackContext } from './contexts/MusicContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Artist from './pages/Artist';
import { AuthContext } from './contexts/AuthContext';
import Account from './pages/Account';
import PlaylistView from './pages/PlaylistView';
import Accounts from './pages/Accounts';
import { useContext, useEffect, useState } from 'react';
import MainPlayer from './components/MainPlayer';
import Header from './components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import PhoneNav from './components/PhoneNav';
import PlaylistsPrev from './components/PlaylistPrev';
import { CreateDialogv2 } from './components/CreateDialogv2';
import { DraggableItemv2 } from './components/DraggableItemv2';
import { DraggableContainer } from './contexts/SectionContext';

function App() {

  const { currentTrack, active } = useContext(TrackContext)
  const { user, createPlaylist } = useContext(AuthContext);
  const location = useLocation();
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [cover, setCover] = useState<File>();
  const [priv, setPriv] = useState<boolean>(false);

  const hideComponents = ["/login", "/signup", "/account"].includes(location.pathname);

  const [pCondition, setPCondition] = useState<boolean>(Boolean(user && !hideComponents));
  const [mCondition, setMCondition] = useState<boolean>(Boolean(!hideComponents && currentTrack));

  interface Section {
    id: number;
    type: string;
    className: string;
    condition: boolean;
  }

  const componentMap: Record<string, React.ReactNode> = {
    playlist: <>
      <div className={`${active == "playlist" ? "flex" : "hidden lg:flex"} w-full flex-col bg-222 max-h-[75vh] md:max-h-[80vh] rounded-lg pl-6 pt-4 pr-6 md:pl-10 md:pt-36 md:pr-10 items-center text-white overflow-scroll pb-8`}>
        {
          user?.Playlists.map((playlist) =>
            <PlaylistsPrev playlist={playlist} key={crypto.randomUUID()} />
          )
        }
        <button className="flex-shrink-0 hover:bg-gray28 p-2 transition-all rounded-md flex items-center justify-center text-xl md:text-base mb-6 lg:mb-0 mt-8" onClick={() => setIsCreating(true)}>
          <FontAwesomeIcon icon={faPlusCircle} className="size-6" />
        </button>
      </div>
    </>,
    info: <>
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
    </>,
    mainPlayer: <>
      <div className={`${active == "music" ? "flex" : "hidden lg:flex"} h-[75vh] w-full md:h-[80vh] flex-col bg-222 rounded-lg`} id='music'>
        <MainPlayer />
      </div>
    </>
  };

  const [sections, setSections] = useState<Section[]>(() => {
    const storedSections = localStorage.getItem("newSections");
    return storedSections
      ? JSON.parse(storedSections)
      : [
        { id: 1, type: "playlist", className: "flex-grow-[1]", condition: pCondition },
        { id: 2, type: "info", className: `flex-grow-[3]`, condition: true },
        { id: 3, type: "mainPlayer", className: `flex-grow-[2]`, condition: mCondition },
      ];
  });

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];

    if (file) {
      setCover(file);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await createPlaylist(name, priv, desc, cover);
    handleClose();
  }

  useEffect(() => {
    localStorage.removeItem("newSections");
  }, [])

  useEffect(() => {
    setMCondition(Boolean(!hideComponents && currentTrack));
  }, [currentTrack]);

  useEffect(() => {
    setPCondition(Boolean(user && !hideComponents));
  }, [user]);

  useEffect(() => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.type === "playlist") {
          return { ...section, condition: pCondition };
        }
        if (section.type === "info") {
          return { ...section, className: `flex-grow-[5]` };
        }
        return section;
      })
    );
  }, [pCondition]);


  useEffect(() => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.type === "mainPlayer"
          ? { ...section, condition: mCondition }
          : section
      )
    );
  }, [mCondition]);


  const handleClose = () => setIsCreating(false);

  // useEffect(() => {
  //   localStorage.setItem("newSections", JSON.stringify(sections));
  // }, [sections]);

  const moveItem = (fromIndex: number, toIndex: number): void => {
    const updatedSections = [...sections];
    const [movedItem] = updatedSections.splice(fromIndex, 1);
    updatedSections.splice(toIndex, 0, movedItem);
    setSections(updatedSections);
  };

  return (
    <>
      {!hideComponents && <Header />}
      <main className="flex flex-row h-screen w-full text-white gap-2 p-2 md:p-4 transition-all">
        <DraggableContainer>
          {
            sections.map((section, index) => (
              <DraggableItemv2 key={section.id} id={section.id} index={index} moveItem={moveItem} className={`${section.className} !w-full`} condition={section.condition}>
                {componentMap[section.type]}
              </DraggableItemv2>
            ))
          }
        </DraggableContainer>
      </main>
      {!hideComponents && <PhoneNav />}
      {
        isCreating && (
          <CreateDialogv2 props={{ caption: "Playlist", close: handleClose }}>
            <form className="p-4 flex flex-col gap-12 text-lg h-full items-center overflow-hidden">
              <div className="flex felx-row gap-2 mt-20 w-full items-center justify-between">
                <label htmlFor="name">Name: </label>
                <input type="text" name="name" className="rounded-lg p-1 w-3/5 border-2 outline-none transition-all bg-333 border-white focus:border-yellow-400 text-white" onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="flex felx-row gap-2 w-full items-center justify-between">
                <label htmlFor="desc">Description: </label>
                <input type="text" name="desc" className="rounded-lg p-1 w-3/5 border-2 outline-none transition-all bg-333 border-white focus:border-yellow-400 text-white" onChange={(e) => setDesc(e.target.value)} />
              </div>
              <div className="flex felx-row gap-2 w-full items-center justify-between">
                <label htmlFor="cover">Cover: </label>
                <input type="file" name="cover" onChange={(e) => handleFileChange(e)} />
              </div>
              <div className="flex felx-row gap-2 w-full items-center">
                <label htmlFor="private">Private: </label>
                <input type="checkbox" name="private" onChange={(e) => setPriv(e.target.checked)} />
              </div>
              <button type="submit" className="bg-white text-gray222 font-semibold w-fit p-1 rounded-md hover:bg-white-kinda" onClick={(e) => handleSubmit(e)}>Create</button>
            </form>
          </CreateDialogv2>
        )
      }
    </>
  )
}

export default App