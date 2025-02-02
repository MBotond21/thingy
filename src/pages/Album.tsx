import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { TrackContext } from "../contexts/MusicContext";
import MainPlayer from "../components/MainPlayer";
import { DraggableItem } from "../components/DraggableItem";
import AlbumInfo from "../components/AlbumInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo, faMusic } from "@fortawesome/free-solid-svg-icons";

const ITEM_TYPE = 'SECTION';

interface Section {
    id: number;
    type: string;
    className: string;
}

const componentMap: Record<string, React.ReactNode> = {
    info: <AlbumInfo />,
    mainPlayer: <MainPlayer />,
};

export default function AlbumView() {
    const { album, queue, setQueue, active, setActive } = useContext(TrackContext);
    const [sections, setSections] = useState<Section[]>(() => {
        const storedSections = localStorage.getItem("sections");
        return storedSections
            ? JSON.parse(storedSections)
            : [
                { id: 1, type: "info", className: `${active == "info"? "flex": "hidden"} flex-2 lg:flex xl:h-full flex-col gap-10 bg-222 rounded-lg overflow-hidden` },
                { id: 2, type: "mainPlayer", className: `flex-1 ${active == "music"? "flex": "hidden"} xl:h-full w-full flex-col justify-center gap-10 bg-222 rounded-lg` },
            ];
    });

    useEffect(() => {
        if (album) {
            setQueue(album.tracks!);
        }
    }, [album]);

    useEffect(() => {
        localStorage.setItem("sections", JSON.stringify(sections));
    }, [sections]);

    const moveItem = (fromIndex: number, toIndex: number): void => {
        const updatedSections = [...sections];
        const [movedItem] = updatedSections.splice(fromIndex, 1);
        updatedSections.splice(toIndex, 0, movedItem);
        setSections(updatedSections);
    };

    const handleViewChange = (type: "info" | "music") => {
        setActive(type);
        const aiElement = document.getElementsByTagName('section')[0];
        const mpElement = document.getElementsByTagName('section')[1];

        if (aiElement) aiElement.style.display = type == "info" ? "flex" : "none";
        if (mpElement) mpElement.style.display = type == "music" ? "flex" : "none";
    }

    return <>
        <Header />
        {
            album ? (
                <main className="flex flex-row h-5/6 w-full text-white gap-2 p-4 transition-all">
                    {
                        sections.map((section, index) => (
                            <DraggableItem key={section.id} id={section.id} index={index} moveItem={moveItem} className={section.className} >
                                {componentMap[section.type]}
                            </DraggableItem>
                        ))
                    }
                    <div className="flex lg:hidden absolute left-0 bottom-12 gap-7 w-full items-center justify-center">
                        <button className="size-10 rounded-lg bg-white text-gray222 hover:bg-gray-200 disabled:bg-gray-300" onClick={() => handleViewChange("info")}  disabled={active === "info"} ><FontAwesomeIcon icon={faInfo}/></button>
                        <button className="size-10 rounded-lg bg-white text-gray222 hover:bg-gray-200 disabled:bg-gray-300" onClick={() => handleViewChange("music")} disabled={active === "music"} ><FontAwesomeIcon icon={faMusic}/></button>
                    </div>
                </main>
            ) : (
                <div className="w-full h-4/5 flex items-center justify-center">
                    <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                </div>
            )
        }
    </>
}