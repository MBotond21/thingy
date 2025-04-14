import { useContext, useEffect, useState } from "react";
import { Playlist } from "../playlist"
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ApiContext } from "../contexts/ApiContext";

interface Props {
    playlist: Playlist;
    deletable: boolean;
}

export default function PlaylistsPrev(props: Props){

    const [pic, setPic] = useState<string>('');
    const { deletePlaylist } = useContext(ApiContext);
    const navigate = useNavigate();

    useEffect(() => {
            try {
                if(props.playlist.PlaylistCover){
                    const url = URL.createObjectURL(props.playlist.PlaylistCover);
                    setPic(url);
        
                    return () => URL.revokeObjectURL(url);
                }else{
                    setPic('/playlist_cover.png');
                }
            }catch {
                setPic('/playlist_cover.png');
            }
        }, []);

    const handleClick = () => {
        navigate(`/playlist/${props.playlist.PlaylistID}`)
    }

    const handleDelete = () => {
        if(confirm("Are you sure you want to delete this playlist?\n(This actions is irreversible, and the playlist will forever be lost)")){
            //TODO: delete function
            deletePlaylist(props.playlist.PlaylistID);
        }
    }

    return <>
        <div className="flex flex-row gap-2 w-[95%] ml-auto mr-auto text-white items-center hover:cursor-pointer rounded-md p-2 pr-8 hover:bg-gray28 hover:shadow-lg mt-8 -mb-8 group" onClick={handleClick}>
            <img src={pic} alt="playlistPic" className="size-14 rounded-sm" />
            <p>{props.playlist.PlaylistName}</p>
            {props.deletable &&  <button className="ml-auto hidden group-hover:block p-2 hover:bg-gray-333 hover:text-red-600 rounded-md transition-all" onClick={(e) => {e.stopPropagation(); handleDelete();}}><FontAwesomeIcon icon={faTrashCan}/></button>}
        </div>
    </>
}