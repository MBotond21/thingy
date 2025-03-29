import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Track } from "../track";
import { TrackContext } from "../contexts/MusicContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faPlusCircle, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../contexts/AuthContext";

interface Props {
    track: Track;
    isFirst: boolean;
    add: () => void;
    remove: () => void;
}

export default function TrackPrev(props: Props) {

    const navigate = useNavigate();
    const { setCurrentTrackFR } = useContext(TrackContext);
    const { user } = useContext(AuthContext);

    return <>
        <div className={`flex relative flex-row gap-2 w-full text-white items-center hover:cursor-pointer rounded-md p-2 pr-8 hover:shadow-lg ${props.isFirst ? "bg-yellow-400 hover:bg-yellow-500" : "hover:bg-gray28"}`} onClick={() => setCurrentTrackFR(props.track)}>
            <img src={props.track.image} alt="playlistPic" className="size-14 rounded-sm" />
            <div className="flex flex-col">
                <p>{props.track.name}</p>
                <p className="text-gray-300 hover:text-white hover:underline transition-all" onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/artist/${props.track.artist_id}`);
                }}>{props.track.artist_name}</p>
            </div>
            <div className="group ml-auto">
                <button className={`peer p-2 ${props.isFirst ? "hover:bg-yellow-400" : "hover:bg-gray-333"} rounded-lg`} onClick={(event) => {
                    event.stopPropagation();
                }}><FontAwesomeIcon icon={faEllipsisV} /></button>
                <div className={`hidden group-hover:flex peer-focus:flex flex-col absolute rounded-lg text-lg top-11 right-5 z-50`}>
                    {user && <button className="pt-2 pl-4 pr-4 text-left bg-gray222 bg-opacity-80 hover:bg-opacity-100 transition-all rounded-t-lg" onClick={(e) => { e.stopPropagation(); props.add(); }}><FontAwesomeIcon icon={faPlusCircle} /> Add to playlist(s)</button>}
                    {!props.isFirst && <button className="pb-2 pl-4 pr-4 text-left bg-gray222 bg-opacity-80 hover:bg-opacity-100 transition-all rounded-b-lg" onClick={(e) => { e.stopPropagation(); props.remove(); }}><FontAwesomeIcon icon={faTrashCan} /> Delete from queue</button>}
                </div>
            </div>
        </div>
    </>
}