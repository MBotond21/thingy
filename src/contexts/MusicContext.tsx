import { createContext, useState } from "react";
import { Track } from "../track";

interface TrackContextState {
    track: Track | null;
    loadTrack: (id: string) => void;
}

export const TrackContext = createContext<TrackContextState>({
    track: null,
    loadTrack: () => {},
});

export const TrackContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [track, setTrack] = useState<Track | null>(null);

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
                console.log("An error happend while loading the track", error);
                alert("kabe");
            });
    }

    return (
        <TrackContext.Provider value={{ track, loadTrack }}>
            {children}
        </TrackContext.Provider>
    );
}