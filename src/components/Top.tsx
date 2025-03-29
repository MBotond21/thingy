import { useContext, useEffect, useState } from "react";
import { TrackContext } from "../contexts/MusicContext";
import { Track } from "../track";
import { Album } from "../album";
import { Artist } from "../artist";
import { useNavigate } from "react-router";
import ScrollingText from "./ScrollinText";

interface Props {
    type: string;
    from: string;
}

export default function Top(props: Props) {

    const navigate = useNavigate();

    const { loadAlbum, loadArtist, loadTopTracks, loadTopAlbums, loadTopArtists, wtracks, mtracks, walbums, malbums, wartists, martists, setQueue, setCurrentTrackFR, setActive } = useContext(TrackContext);

    const dataMap: Record<string, any[]> = {
        weektracks: wtracks,
        monthtracks: mtracks,
        weekalbums: walbums,
        monthalbums: malbums,
        weekartists: wartists,
        monthartists: martists,
    }

    useEffect(() => {
        if (props.from == "tracks") {
            loadTopTracks(props.type);
        } else if (props.from == "albums") {
            loadTopAlbums(props.type);
        } else {
            loadTopArtists(props.type);
        }
    }, [])

    const handleClick = async (data: any) => {
        if (props.from == "tracks") {
            if (window.innerWidth < 1024) {
                setActive("music");
            }
            setCurrentTrackFR(data as Track);
            setQueue([data]);
            navigate(`/album/${data.album_id}`);
        };
        if (props.from == "albums") {
            if (window.innerWidth < 1024) {
                setActive("info");
            }
            navigate(`/album/${data.id}`);
        };
        if (props.from == "artists") {
            navigate(`/artist/${data.id}`);
        }
    }

    return <>
        <div className="w-full">
            <h1 className="text-3xl xxl:text-5xl font-semibold mb-2" >{props.type.substring(0, 1).toUpperCase() + props.type.substring(1, props.type.length)}ly top {props.from}</h1>
            <div className="flex flex-row gap-10 !overflow-x-scroll scrollbar-hidden">
                {
                    dataMap[props.type.concat(props.from)].map((data) => (
                        <div className="flex flex-col items-center" key={crypto.randomUUID()}>
                            <img src={data.image} alt="track" className="size-20 xxl:size-28 cursor-pointer" onClick={() => handleClick(data)} />
                            <ScrollingText text={data.name} className="mt-1 mr-auto ml-auto w-24 xxl:w-28" trigger={data} />
                        </div>
                    ))
                }
            </div>
        </div>
    </>
}