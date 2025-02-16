import { useEffect, useState } from "react";
import { Playlist } from "../playlist"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";

interface Props {
    playlist: Playlist;
}

export default function PlaylistInfo(props: Props) {

    const playlist = props.playlist;
    const [pic, setPic] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        console.log(playlist);
        if (playlist.PlaylistCover) {
            const url = URL.createObjectURL(playlist.PlaylistCover);
            setPic(url);

            return () => URL.revokeObjectURL(url);
        } else {
            setPic('/playlist_cover.png');
        }
    }, []);

    return <>
        <div className="flex flex-col gap-4 pl-8 pr-8 items-center lg:flex-row">
            <img src={pic} alt="PlaylistPic" className="size-52 lg:size-72 object-cover rounded-md" />
            <div className="flex flex-col">
                <h1 className="text-4xl font-semibold">{playlist.PlaylistName}</h1>
                <p className="text-lg lg:text-xl">
                    <span className="hover:cursor-pointer hover:underline font-bold" onClick={() => navigate(`/accounts/${playlist.OwnerID}`)}>{playlist.Owner!.Username}</span>, {playlist.Tracks?.length}{" "}
                    {playlist.Tracks?.length === 1 ? "track" : "tracks"},{" "}
                    {playlist.Tracks?.reduce((sum, obj) => sum + obj.duration, 0)} sec
                </p>
                <p className="text-xl lg:text-2xl">{playlist.Description}</p>
            </div>
        </div>
        <div className="flex flex-row gap-10 overflow-scroll mt-auto pl-8 pr-8 pb-8 ">
            {playlist.Tracks?.map((track) => (
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 lg:w-32 lg:h-32 flex-shrink-0 relative group">
                        <img src={track.image} alt="track" className="w-full h-full object-contain hover:cursor-pointer" />
                        <FontAwesomeIcon icon={faPlay} className="absolute hidden lg:block lg:left-10 lg:top-10 lg:size-12 opacity-0 group-hover:opacity-45 transition-all" />
                    </div>
                    <p className="overflow-hidden h-12 text-center w-28">{track.name}</p>
                </div>
            ))}
        </div>
    </>
}