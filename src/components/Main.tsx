import { useContext, useState } from "react"
import Top from "./Top";
import { AuthContext } from "../contexts/AuthContext";
import PlaylistsPrev from "./PlaylistPrev";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import CreateDialog from "./CreateDialog";
import { CreateDialogv2 } from "./CreateDialogv2";
import imageCompression from "browser-image-compression";
import { TrackContext } from "../contexts/MusicContext";
import MainPlayer from "./MainPlayer";

export default function Main() {

    const [isCreating, setIsCreating] = useState<boolean>(false);
    const { user, createPlaylist } = useContext(AuthContext);
    const { currentTrack } = useContext(TrackContext)

    const [name, setName] = useState<string>("");
    const [desc, setDesc] = useState<string>("");
    const [cover, setCover] = useState<File>();
    const [priv, setPriv] = useState<boolean>(false);

    const handleFileChange = async (event: any) => {
        const file = event.target.files[0];

        if (file) {

            // const options = {
            //     maxSizeMB: 0.05,
            //     maxWidthOrHeight: 300,
            //     useWebWorker: true,
            // };

            // try {
            //     let compressed = await imageCompression(file, options);

            //     const blob = new Blob([compressed], { type: compressed.type });
            //     setCover(blob);
            // } catch { console.log("Error during compression"); }

            setCover(file);

        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await createPlaylist(name, priv, desc, cover);
        handleClose();
    }

    const handleClose = () => setIsCreating(false);

    const handleClick = () => {
        setIsCreating(true);
        //document.body.classList.add('blur-md');
    }

    return <>
        {
            user ? (
                <div className="flex flex-1 flex-col bg-222 max-h-[80vh] rounded-lg pl-6 pt-4 pr-6 md:pl-10 md:pt-6 md:pr-10 items-center text-white overflow-scroll">
                    {
                        user.Playlists.map((playlist) =>
                            <PlaylistsPrev playlist={playlist} />
                        )
                    }
                    <button className="hover:bg-gray28 p-2 transition-all rounded-md flex items-center justify-center" onClick={() => handleClick()}>
                        <FontAwesomeIcon icon={faPlusCircle} className="size-6" />
                    </button>
                </div>
            ) : (
                <span></span>
            )
        }
        <div className={`flex flex-3 bg-222 rounded-lg w-full max-h-[80vh] ${user ? "sm xxl:columns-2" : "columns-2"} col text-white gap-2 p-4 xxl:p-10 transition-all tsm  overflow-scroll scrollbar-hidden`}>
            <div className={`flex ${user ? "w-fit" : "w-full"} xl:h-full flex-col justify-center gap-10`}>
                <Top type="week" from="tracks" />
                <Top type="week" from="albums" />
                <Top type="week" from="artists" />
            </div>
            <div className={`flex ${user ? "w-fit" : "w-full"} xl:h-full flex-col justify-center gap-10`}>
                <Top type="month" from="tracks" />
                <Top type="month" from="albums" />
                <Top type="month" from="artists" />
            </div>
        </div>
        {
            isCreating ? (
                <>
                    <CreateDialogv2 props={{ caption: "Playlist", close: handleClose }}>
                        <form className="p-4 flex flex-col gap-12 text-lg h-full items-center">
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
                </>
            ) : (
                <span></span>
            )
        }
    </>
}