import { useContext, useState } from "react"
import { TrackContext } from "../contexts/MusicContext"
import { faPlay, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import { CreateDialogv2 } from "./CreateDialogv2";
import { Track } from "../track";

export default function AlbumInfo() {

    const { album, setCurrentTrackFR, loadArtist, setActive, setQueue } = useContext(TrackContext);
    const { addToPlaylist, user } = useContext(AuthContext)
    const navigate = useNavigate();

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [playlistIds, setPlaylistIds] = useState<number[]>([]);

    const handleClick = async (data: any) => {
        navigate(`/artist/${data.artist_id}`);
    }

    const getPic = (b: Blob | undefined) => {
        if (!b) return "/playlist_cover.png"
        return URL.createObjectURL(b);
    }

    const handleChange = (id: number) => {
        setPlaylistIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const data = await addToPlaylist(album?.tracks!.map((track) => track.id)!, playlistIds);
        setDialogOpen(false);
    }

    const handleTrackSwich = (track: Track) => {
        setCurrentTrackFR(track);
        setQueue(album!.tracks!);
        setActive("music");
    }

    return <>
        <div className="flex flex-col gap-4 items-center lg:flex-row">
            <img src={album?.image} alt="albumPic" className="size-52 lg:size-72 object-cover" />
            <div className="flex flex-col">
                <h1 className="text-2xl lg:text-4xl font-semibold">{album?.name}</h1>
                <div className="flex flex-row gap-6">
                    <p className="text-lg lg:text-xl">
                        <span className="hover:cursor-pointer hover:underline font-bold" onClick={() => handleClick(album)}>{album?.artist_name}</span>, {album?.tracks?.length}{" "}
                        {album?.tracks?.length === 1 ? "track" : "tracks"},{" "}
                        {album?.tracks?.reduce((sum, obj) => sum + obj.duration, 0)} sec
                    </p>
                    {
                        user && <button className="p-2 size-fit rounded-md hover:bg-gray28 transition-all hover:shadow-lg flex items-center justify-center" onClick={() => setDialogOpen(true)} ><FontAwesomeIcon icon={faPlusCircle} className="size-7" /></button>
                    }
                </div>
                <p className="text-lg lg:text-xl">
                    Release date: {album?.releasedate}
                </p>
            </div>
        </div>
        <div className="flex flex-row gap-10 overflow-scroll mt-auto mb-2 pl-8 pr-8 scrollbar-hidden">
            {album?.tracks?.map((track) => (
                <div className="flex flex-col items-center mb-6" key={crypto.randomUUID()}>
                    <div className="w-20 h-20 lg:w-32 lg:h-32 flex-shrink-0 relative group">
                        <img src={track.image} alt="track" className="w-full h-full object-contain hover:cursor-pointer" onClick={() => handleTrackSwich(track)} />
                        <FontAwesomeIcon icon={faPlay} className="absolute hidden lg:block lg:left-10 lg:top-10 lg:size-12 opacity-0 group-hover:opacity-45 transition-all" onClick={() => handleTrackSwich(track)} />
                    </div>
                    <p className="h-fit text-center w-28 overflow-hidden">{track.name}</p>
                </div>
            ))}
        </div>
        {
            dialogOpen &&
            <CreateDialogv2 props={{ caption: "Playlists", close: () => setDialogOpen(false) }}>
                <form className="flex flex-col p-2 md:p-4 gap-4 scrollbar-hidden">
                    {
                        user?.Playlists.map((playlist) =>
                            <div className="flex flex-row items-center gap-6">
                                <img src={getPic(playlist.PlaylistCover)} alt="playlistPic" className="size-16 rounded-md" />
                                <p className="w-24 overflow-scroll">{playlist.PlaylistName}</p>
                                <input type="checkbox" name="add" value={playlist.PlaylistID} checked={playlistIds.includes(playlist.PlaylistID)} onChange={() => handleChange(playlist.PlaylistID)} />
                            </div>
                        )
                    }
                    <button type="submit" className="bg-white text-gray222 font-semibold w-fit p-1 pl-2 pr-2 rounded-md hover:bg-white-kinda ml-auto mr-auto" onClick={handleSubmit}>Add</button>
                </form>
            </CreateDialogv2>
        }
    </>
}