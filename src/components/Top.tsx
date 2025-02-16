import { useContext, useEffect, useState } from "react";
import { TrackContext } from "../contexts/MusicContext";
import { Track } from "../track";
import { Album } from "../album";
import { Artist } from "../artist";
import { useNavigate } from "react-router";

interface Props {
    type: string;
    from: string;
}

export default function Top(props: Props) {

    const navigate = useNavigate();

    const {loadAlbum, loadArtist, loadTopTracks, loadTopAlbums, loadTopArtists, wtracks, mtracks, walbums, malbums, wartists, martists, setQueue, setCurrentTrackFR, setActive } = useContext(TrackContext);

    const dataMap: Record<string, any[]> = {
        weektracks: wtracks,
        monthtracks: mtracks,
        weekalbums: walbums,
        monthalbums: malbums,
        weekartists: wartists,
        monthartists: martists,
    }

    useEffect(() => {
        console.log("AAAAacfAsd")
        setCurrentTrackFR(undefined);
        if (props.from == "tracks") {
            loadTopTracks(props.type);
        } else if(props.from == "albums") {
            loadTopAlbums(props.type);
        }else{
            loadTopArtists(props.type);
        }
    }, [])

    const handleClick = async (data: any) => {
        if(props.from == "tracks"){
            console.log("Top is setting the current track");
            if(window.innerWidth < 1024){
                setActive("music");
            }
            setCurrentTrackFR(data as Track);
            loadAlbum(data.album_id);
            navigate("/albumView");
        };
        if(props.from == "albums"){
            if(window.innerWidth < 1024){
                setActive("info");
            }
            loadAlbum(data.id);
            navigate("/albumView");
        };
        if(props.from == "artists"){
            loadArtist(data.id);
            navigate("/artistView");
        }
    }

    return <>
        <div className="w-full">
            <h1 className="text-3xl xxl:text-5xl font-semibold mb-2" >{props.type.substring(0, 1).toUpperCase() + props.type.substring(1, props.type.length)}ly top {props.from}</h1>
            <div className="flex flex-row gap-10 overflow-scroll scrollbar-hidden">
                {
                    dataMap[props.type.concat(props.from)].map((data) => (
                        <div className="flex flex-col">
                            <img src={data.image} alt="track" className="size-20 xxl:size-28 cursor-pointer" onClick={() => handleClick(data)} />
                            <p className="overflow-hidden w-24 xxl:w-28 h-12 hover:cursor-default" title={data.name}>{data.name}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    </>
}