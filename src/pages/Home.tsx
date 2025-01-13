import Header from "../components/Header";
import Main from "../components/Main";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TrackContextProvider } from '../contexts/MusicContext';

export default function Home() {
    return <>
        <Header />
        <TrackContextProvider>
            <DndProvider backend={HTML5Backend}>
                <Main />
            </DndProvider>
        </TrackContextProvider>
    </>
}