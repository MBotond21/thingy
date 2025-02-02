import { useContext } from "react"
import { TrackContext } from "../contexts/MusicContext"
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";

export default function AlbumInfo() {

    const { album, setCurrentTrackFR, loadArtist } = useContext(TrackContext);
    const navigate = useNavigate();

    const handleClick = async (data: any) => {
        loadArtist(data.artist_id);
        navigate("/artistView");
    }

    return <>
        <div className="flex flex-col gap-4 pl-8 pr-8 items-center lg:flex-row">
            <img src={album?.image} alt="albumPic" className="size-52 lg:size-72 object-cover" />
            <div className="flex flex-col">
                <h1 className="text-4xl font-semibold">{album?.name}</h1>
                <p className="text-lg lg:text-xl">
                    <span className="hover:cursor-pointer hover:underline font-bold" onClick={() => handleClick(album)}>{album?.artist_name}</span>, {album?.tracks?.length}{" "}
                    {album?.tracks?.length === 1 ? "track" : "tracks"},{" "}
                    {album?.tracks?.reduce((sum, obj) => sum + obj.duration, 0)} sec
                </p>
            </div>
        </div>
        <div className="flex flex-row gap-10 overflow-scroll mt-auto pl-8 pr-8 pb-8 ">
            {album?.tracks?.map((track) => (
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 lg:w-32 lg:h-32 flex-shrink-0 relative group">
                        <img src={track.image} alt="track" className="w-full h-full object-contain hover:cursor-pointer" onClick={() => setCurrentTrackFR(track)} />
                        <FontAwesomeIcon icon={faPlay} className="absolute hidden lg:block lg:left-10 lg:top-10 lg:size-12 opacity-0 group-hover:opacity-45 transition-all" onClick={() => setCurrentTrackFR(track)} />
                    </div>
                    <p className="overflow-hidden h-12 text-center w-28">{track.name}</p>
                </div>
            ))}
        </div>
    </>
}