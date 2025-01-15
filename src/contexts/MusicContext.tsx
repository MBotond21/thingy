import { createContext, useState } from "react";
import { Track } from "../track";
import { Album } from "../album";

interface TrackContextState {
    track: Track | null;
    infoActive: boolean;
    loadTrack: (id: string) => void;
    changeInfoActive: (next: boolean) => void;
    loadAlbum: (id: string) => void;
    queue: Track[];
}

export const TrackContext = createContext<TrackContextState>({
    track: null,
    infoActive: false,
    loadTrack: () => { },
    changeInfoActive: () => { },
    loadAlbum: () => { },
    queue: [],
});

export const TrackContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [track, setTrack] = useState<Track | null>(null);
    const [infoActive, setInfoActive] = useState<boolean>(false);
    const [queue, setQueue] = useState<Track[]>([]);

    const loadTrack = async (id: string) => {
        await fetch(`https://api.jamendo.com/v3.0/tracks/?client_id=8b1de417&format=jsonpretty&id=${id}`, {
            method: 'GET',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                let t: Track = {
                    id: data.results[0].id,
                    name: data.results[0].name,
                    duration: +data.results[0].duration,
                    artist_id: data.results[0].artist_id,
                    artist_name: data.results[0].artist_name,
                    album_id: data.results[0].album_id,
                    releasedate: data.results[0].releasedate,
                    album_image: data.results[0].album_image,
                    audio: data.results[0].audio,
                    image: data.results[0].image
                }

                setTrack(t);
            })
            .catch((error) => {
                console.log("An error occured while loading the track", error);
                alert("kabe");
            });
    }

    const loadAlbum = async (id: string) => {
        console.log("loading...");
        await fetch(`https://api.jamendo.com/v3.0/albums/tracks/?client_id=8b1de417&format=jsonpretty&id=${id}`, {
            method: 'GET',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {

                for (let i = 0; i < data.results[0].tracks.length; i++) {

                    let t: Track = {
                        id: data.results[0].tracks[i].id,
                        name: data.results[0].tracks[i].name,
                        duration: +data.results[0].tracks[i].duration,
                        artist_id: data.results[0].artist_id,
                        artist_name: data.results[0].artist_name,
                        album_id: data.results[0].id,
                        releasedate: data.results[0].releasedate,
                        album_image:data.results[0].album_image,
                        audio: data.results[0].tracks[i].audio,
                        image: data.results[0].image
                    }

                    setQueue((prevItems) => [...prevItems, t]);
                }

                console.log("loaded");
            })
            .catch((error) => {
                console.log("An error occured while loading the album", error);
                alert("kabe");
            });
    }

    const changeInfoActive = (next: boolean) => {
        setInfoActive(next);
    }

    return (
        <TrackContext.Provider value={{ track, infoActive, loadTrack, changeInfoActive, loadAlbum, queue }}>
            {children}
        </TrackContext.Provider>
    );
}