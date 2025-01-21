import { createContext, useState } from "react";
import { Track } from "../track";
import { Album } from "../album";
import { Artist } from "../artist";

interface TrackContextState {
    track: Track | null;
    infoActive: boolean;
    loadTrack: (id: string) => void;
    changeInfoActive: (next: boolean) => void;
    loadAlbum: (id: string) => void;
    loadTopTracks: (type: string) => void;
    loadTopAlbums: (type: string) => void;
    loadTopArtists: (type: string) => void;
    queue: Track[];
    wtracks: Track[];
    mtracks: Track[];
    walbums: Album[];
    malbums: Album[];
    wartists: Artist[];
    martists: Artist[];
}

export const TrackContext = createContext<TrackContextState>({
    track: null,
    infoActive: false,
    loadTrack: () => {},
    changeInfoActive: () => {},
    loadAlbum: () => {},
    loadTopTracks: () => {},
    loadTopAlbums: () => {},
    loadTopArtists: () => {},
    queue: [],
    wtracks: [],
    mtracks: [],
    walbums: [],
    malbums: [],
    wartists: [],
    martists: [],
});

export const TrackContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [track, setTrack] = useState<Track | null>(null);
    const [infoActive, setInfoActive] = useState<boolean>(false);
    const [queue, setQueue] = useState<Track[]>([]);

    const [wtracks, setwTracks] = useState<Track[]>([]);
    const [mtracks, setmTracks] = useState<Track[]>([]);

    const [walbums, setwAlbums] = useState<Album[]>([]);
    const [malbums, setmAlbums] = useState<Album[]>([]);

    const [wartists, setwArtists] = useState<Artist[]>([]);
    const [martists, setmArtists] = useState<Artist[]>([]);

    const client_id = "8b1de417";

    const loadTrack = async (id: string) => {
        await fetch(`https://api.jamendo.com/v3.0/tracks/?client_id=${client_id}&format=jsonpretty&id=${id}`, {
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
        await fetch(`https://api.jamendo.com/v3.0/albums/tracks/?client_id=${client_id}&format=jsonpretty&id=${id}`, {
            method: 'GET',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {

                setQueue([]);

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

    const loadTopTracks = async (type: string) => {
        console.log("loading...");
        await fetch(`https://api.jamendo.com/v3.0/tracks/?client_id=${client_id}&format=jsonpretty&order=popularity_${type}&limit=5`, {
            method: 'GET',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {

                if(type == "week"){
                    setwTracks([]);
                }else{
                    setmTracks([]);
                }

                for (let i = 0; i < data.results.length; i++) {

                    let t: Track = {
                        id: data.results[i].id,
                        name: data.results[i].name,
                        duration: +data.results[i].duration,
                        artist_id: data.results[i].artist_id,
                        artist_name: data.results[i].artist_name,
                        album_id: data.results[i].album_id,
                        releasedate: data.results[i].releasedate,
                        album_image: data.results[i].album_image,
                        audio: data.results[i].audio,
                        image: data.results[i].image
                    }

                    if(type == "week"){
                        setwTracks((prevItems) => [...prevItems, t]);
                    }else{
                        setmTracks((prevItems) => [...prevItems, t]);
                    }
                }

                console.log("loaded");
            })
            .catch((error) => {
                console.log("An error occured while loading the tracks", error);
                alert("kabe");
            });
    }

    const loadTopAlbums = async (type: string) => {
        console.log("loading...");
        await fetch(`https://api.jamendo.com/v3.0/albums/?client_id=${client_id}&format=jsonpretty&order=popularity_${type}&limit=5`, {
            method: 'GET',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {

                if(type == "week"){
                    setwAlbums([]);
                }else{
                    setmAlbums([]);
                }

                for (let i = 0; i < data.results.length; i++) {

                    let a: Album = {
                        id: data.results[i].id,
                        name: data.results[i].name,
                        artist_id: data.results[i].artist_id,
                        artist_name: data.results[i].artist_name,
                        releasedate: data.results[i].releasedate,
                        image: data.results[i].image
                    }

                    if(type == "week"){
                        setwAlbums((prevItems) => [...prevItems, a]);
                    }else{
                        setmAlbums((prevItems) => [...prevItems, a]);
                    }
                }

                console.log("loaded");
            })
            .catch((error) => {
                console.log("An error occured while loading the tracks", error);
                alert("kabe");
            });
    }

    const loadTopArtists = async (type: string) => {
        console.log("loading...");
        await fetch(`https://api.jamendo.com/v3.0/artists/?client_id=${client_id}&format=jsonpretty&order=popularity_${type}&limit=5`, {
            method: 'GET',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {

                if(type == "week"){
                    setwArtists([]);
                }else{
                    setmArtists([]);
                }

                for (let i = 0; i < data.results.length; i++) {

                    let a: Artist = {
                        id: data.results[i].id,
                        name: data.results[i].name,
                        join_date: data.results[i].join_date,
                        image: data.results[i].image,
                        website: data.results[i].website
                    }

                    if(type == "week"){
                        setwArtists((prevItems) => [...prevItems, a]);
                    }else{
                        setmArtists((prevItems) => [...prevItems, a]);
                    }
                }

                console.log("loaded");
            })
            .catch((error) => {
                console.log("An error occured while loading the artists", error);
                alert("kabe");
            });
    }

    const changeInfoActive = (next: boolean) => {
        setInfoActive(next);
    }

    return (
        <TrackContext.Provider value={{ track, infoActive, loadTrack, changeInfoActive, loadAlbum, loadTopTracks, loadTopAlbums, loadTopArtists, queue, wtracks, mtracks, walbums, malbums, wartists, martists }}>
            {children}
        </TrackContext.Provider>
    );
}