import { faCirclePlay, faMusic, faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { MusicContext } from "../contexts/MusicContext";
import { ApiContext } from "../contexts/ApiContext";

export default function PhoneNav() {

    const { active, setActive, currentTrack } = useContext(MusicContext);
    const { user } = useContext(ApiContext);

    const needForPlaylistBtn = (user? true: false);
    const needForTrackBtn = (currentTrack? true: false);

    return <>
        <div className={"flex lg:hidden absolute left-0 bottom-6 z-[9999] gap-7 w-full h-fit items-center justify-center self-end"}>
            { needForPlaylistBtn && <button className="size-10 rounded-lg bg-white text-gray222 hover:bg-gray-200 disabled:bg-gray-300" onClick={() => setActive("playlist")} disabled={active == "playlist"} ><FontAwesomeIcon icon={faCirclePlay} /></button> }
            { (needForPlaylistBtn || needForTrackBtn) && <button className="size-10 rounded-lg bg-white text-gray222 hover:bg-gray-200 disabled:bg-gray-300" onClick={() => setActive("info")} disabled={active == "info"} ><FontAwesomeIcon icon={faInfo} /></button> }
            { needForTrackBtn && <button className="size-10 rounded-lg bg-white text-gray222 hover:bg-gray-200 disabled:bg-gray-300" onClick={() => setActive("music")} disabled={active == "music"} ><FontAwesomeIcon icon={faMusic} /></button> }
        </div>
    </>
}