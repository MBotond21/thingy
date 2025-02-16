import { useContext, useState } from "react"
import Top from "./Top";
import { AuthContext } from "../contexts/AuthContext";
import PlaylistsPrev from "./PlaylistPrev";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import CreateDialog from "./CreateDialog";

export default function Main() {

    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const { user } = useContext(AuthContext);

    const handleClose = () => setIsCreating(false);

    const handleClick = () => {
        setIsCreating(true);
        //document.body.classList.add('blur-md');
    }

    return <>
        <main>
            {
                user ? (
                    <div className="flex flex-1 flex-col bg-222 h-9/10 rounded-lg pl-6 pt-4 pr-6 md:pl-10 md:pt-6 md:pr-10 items-center text-white overflow-scroll">
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
            <div className={`flex flex-3 bg-222 rounded-lg w-full h-9/10 ${user ? "sm xxl:columns-2" : "columns-2"} col text-white gap-2 p-4 xxl:p-10 transition-all tsm scrollbar-hidden`}>
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
        </main>
        {
            isCreating ? (
                <>
                    <div className="absolute z-40 w-full h-full top-0 left-0 bg-black opacity-25 flex items-center justify-center"></div>
                    <div className="absolute z-50 w-full h-full top-0 left-0 flex items-center justify-center">
                        <CreateDialog close={handleClose} />
                    </div>
                </>
            ) : (
                <span></span>
            )
        }
    </>
}