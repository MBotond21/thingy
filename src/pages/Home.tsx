import Header from "../components/Header";
import Main from "../components/Main";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function Home() {
    return <>
        <Header />
        <DndProvider backend={HTML5Backend}>
            <Main />
        </DndProvider>
    </>
}