import { useContext, useEffect, useState } from "react";
import { TrackContext } from "../contexts/MusicContext";
import { Track } from "../track";
import { Album } from "../album";
import { Artist } from "../artist";

interface Props {
    type: string;
    from: string;
}

export default function Top(props: Props) {

    const { loadTopTracks, loadTopAlbums, loadTopArtists, wtracks, mtracks, walbums, malbums, wartists, martists } = useContext(TrackContext);

    const dataMap: Record<string, Track[] | Album[] | Artist[]> = {
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
        } else if(props.from == "albums") {
            loadTopAlbums(props.type);
        }else{
            loadTopArtists(props.type);
        }
    }, [])

    return <>
        <div className="w-full">
            <h1 className="text-3xl font-semibold mb-2" >{props.type.substring(0, 1).toUpperCase() + props.type.substring(1, props.type.length)}ly top {props.from}</h1>
            <div className="flex flex-row gap-10">
                {
                    dataMap[props.type.concat(props.from)].map((track) => (
                        <div className="flex flex-col">
                            <img src={track.image} alt="track" className="size-20" />
                            <p className="overflow-hidden w-24 h-12 hover:cursor-default" title={track.name}>{track.name}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    </>
}