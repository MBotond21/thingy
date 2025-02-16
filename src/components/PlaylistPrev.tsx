import { useEffect, useState } from "react";
import { Playlist } from "../playlist"
import { useNavigate } from "react-router";

interface Props {
    playlist: Playlist;
}

export default function PlaylistsPrev(props: Props){

    const [pic, setPic] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
            if(props.playlist.PlaylistCover){
                const url = URL.createObjectURL(props.playlist.PlaylistCover);
                setPic(url);
    
                return () => URL.revokeObjectURL(url);
            }else{
                setPic('/playlist_cover.png');
            }
        }, []);

    const handleClick = () => {
        navigate(`/playlist/${props.playlist.PlaylistID}`)
    }

    return <>
        <div className="flex flex-row gap-2 w-full text-white items-center hover:cursor-pointer rounded-md p-2 pr-8 hover:bg-gray28 hover:shadow-lg overflow-scroll" onClick={handleClick}>
            <img src={pic} alt="playlistPic" className="size-14 rounded-sm" />
            <p>{props.playlist.PlaylistName}</p>
        </div>
    </>
}