import { createContext, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Track } from "../track";
import { Album } from "../album";
import { Artist } from "../artist";

interface TrackContextState {
    track: Track | null;
    album: Album | undefined;
    artist: Artist | undefined;
    active: "info" | "music" | "playlist";
    loadTrack: (id: string) => void;
    setActive: (active: "info" | "music" | "playlist") => void;
    loadAlbum: (id: string) => void;
    loadArtist: (id: string) => void;
    loadTopTracks: (type: string) => void;
    loadTopAlbums: (type: string) => void;
    loadTopArtists: (type: string) => void;
    queue: Track[];
    setQueue: (tracks: Track[]) => void;
    wtracks: Track[];
    mtracks: Track[];
    walbums: Album[];
    malbums: Album[];
    wartists: Artist[];
    martists: Artist[];
    currentTrack: Track | undefined;
    setCurrentTrackFR: (track: Track | undefined) => void;
    search: (term: string) => void;
    autoComplete: Record<string, string[]> | undefined;
    setAutoComplete: Dispatch<SetStateAction<Record<string, string[]> | undefined>>;
}

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}
interface Cache {
    [key: string]: CacheEntry<any>;
}

export const TrackContext = createContext<TrackContextState>({
    track: null,
    album: undefined,
    artist: undefined,
    active: "music",
    loadTrack: () => { },
    setActive: () => { },
    loadAlbum: () => { },
    loadArtist: () => { },
    loadTopTracks: () => { },
    loadTopAlbums: () => { },
    loadTopArtists: () => { },
    queue: [],
    setQueue: () => { },
    wtracks: [],
    mtracks: [],
    walbums: [],
    malbums: [],
    wartists: [],
    martists: [],
    currentTrack: undefined,
    setCurrentTrackFR: () => { },
    search: () => { },
    autoComplete: undefined,
    setAutoComplete: () => { },
});

export const TrackContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [track, setTrack] = useState<Track | null>(null);
    const [album, setAlbum] = useState<Album>();
    const [artist, setArtist] = useState<Artist>();
    const [active, setActive] = useState<"info" | "music" | "playlist">("music");
    const [queue, setQueue] = useState<Track[]>([]);

    const [wtracks, setwTracks] = useState<Track[]>([]);
    const [mtracks, setmTracks] = useState<Track[]>([]);

    const [walbums, setwAlbums] = useState<Album[]>([]);
    const [malbums, setmAlbums] = useState<Album[]>([]);

    const [wartists, setwArtists] = useState<Artist[]>([]);
    const [martists, setmArtists] = useState<Artist[]>([]);

    const [currentTrack, setCurrentTrack] = useState<Track>();

    const [autoComplete, setAutoComplete] = useState<Record<string, string[]>>();
    const isCurrentlySetting = useRef(false);

    const client_id = "8b1de417";

    useEffect(() => {
        if(!currentTrack) setActive('info');
    }, []);

    const toReadable = (text: string) => {
        const parser = new DOMParser();
        const newText = parser.parseFromString(text, "text/html").body.textContent
        return newText;
    }

    async function fetchCache<T>(key: string, fetchFunc: () => Promise<T>, ttl: number = 3600000): Promise<T> {
        const storedCache = JSON.parse(localStorage.getItem("apiData") || "{}") as Cache;

        const entry = storedCache[key];

        if (entry && Date.now() - entry.timestamp < ttl) {
            return Promise.resolve(entry.data);
        }

        try {
            const data = await fetchFunc();

            const updatedCache: Cache = {
                ...storedCache,
                [key]: { data, timestamp: Date.now() }
            };

            console.log(data);

            localStorage.setItem("apiData", JSON.stringify(updatedCache));

            return Promise.resolve(data);
        } catch (e) {
            console.log("Error while fetching: " + e);

            if (entry) {
                return Promise.resolve(entry.data);
            }

            throw e;
        }
    };

    async function compareImagesByteToByte(url: string) {
        try {
            const [response1, response2] = await Promise.all([
                fetch("https://usercontent.jamendo.com/?type=album&id=570388&width=300"),
                fetch(url),
            ]);

            if (!response1.ok || !response2.ok) {
                console.error("Failed to fetch one or both images.");
                return false;
            }

            const buffer1 = await response1.arrayBuffer();
            const buffer2 = await response2.arrayBuffer();

            if (buffer1.byteLength !== buffer2.byteLength) {
                console.log("Images are different (size mismatch).");
                return false;
            }

            const view1 = new Uint8Array(buffer1);
            const view2 = new Uint8Array(buffer2);

            for (let i = 0; i < view1.length; i++) {
                if (view1[i] !== view2[i]) {
                    console.log("Images are different (byte mismatch).");
                    return false;
                }
            }

            console.log("Images are identical (byte-to-byte match).");
            return true;
        } catch (error) {
            console.error("Error during image comparison:", error);
            return false;
        }
    }

    const loadPicForSingle = async (id: string): Promise<string> => {
        let img = "";
        await fetch(`https://api.jamendo.com/v3.0/tracks/?client_id=${client_id}&format=jsonpretty&album_id=${id}`, {
            method: 'GET',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                img = data.results[0].album_image;
            })
            .catch((error) => {
                console.log("An error occured while loading the track", error);
                alert("kabe");
                return "";
            });
        return img;
    }

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
                    artist_name: toReadable(data.results[0].artist_name)!,
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

    const loadAlbum = async (id?: string) => {
        if (!id) {
            const ize = await localStorage.getItem("album");
            if (ize) setAlbum(JSON.parse(ize));
        }
        else {
            setAlbum(undefined);
            await fetch(`https://api.jamendo.com/v3.0/albums/tracks/?client_id=${client_id}&format=jsonpretty&id=${id}`, {
                method: 'GET',
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(async (data) => {

                    let a: Album = {
                        id: data.results[0].id,
                        name: data.results[0].name,
                        artist_id: data.results[0].artist_id,
                        artist_name: toReadable(data.results[0].artist_name)!,
                        releasedate: data.results[0].releasedate,
                        image: data.results[0].image,
                        tracks: []
                    }

                    if (await compareImagesByteToByte(a.image)) {
                        a.image = (await loadPicForSingle(a.id)).toString();
                    }

                    for (let i = 0; i < data.results[0].tracks.length; i++) {

                        let t: Track = {
                            id: data.results[0].tracks[i].id,
                            name: data.results[0].tracks[i].name,
                            duration: +data.results[0].tracks[i].duration,
                            artist_id: data.results[0].artist_id,
                            artist_name: toReadable(data.results[0].artist_name)!,
                            album_id: data.results[0].id,
                            releasedate: data.results[0].releasedate,
                            album_image: a.image,
                            audio: data.results[0].tracks[i].audio,
                            image: a.image
                        }

                        a.tracks!.push(t);
                    }

                    setAlbum(a);
                    if (a.tracks) setQueue(a.tracks);
                    localStorage.setItem("album", JSON.stringify(a));

                })
                .catch((error) => {
                    console.log("An error occured while loading the album", error);
                    alert("kabe");
                });
        }

    }

    const loadArtist = async (id: string) => {
        setArtist(undefined);
        await fetch(`https://api.jamendo.com/v3.0/artists/albums/?client_id=${client_id}&format=jsonpretty&id=${id}`, {
            method: 'GET',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(async (data) => {

                let a: Artist = {
                    id: data.results[0].id,
                    name: toReadable(data.results[0].name)!,
                    website: data.results[0].website,
                    join_date: data.results[0].join_date,
                    image: data.results[0].image || "default.png",
                    albums: []
                }

                const raw = data.results[0].albums.map((album: any): Album => ({
                    id: album.id,
                    name: album.name,
                    artist_id: album.artist_id,
                    artist_name: toReadable(album.artist_name)!,
                    releasedate: album.releasedate,
                    image: album.image,
                }));

                const processedAlbums: Album[] = [];

                for (const album of raw) {
                    let updatedAlbum = { ...album };

                    // if (await compareImagesByteToByte(updatedAlbum.image)) {
                    //     updatedAlbum.image = await loadPicForSingle(updatedAlbum.id);
                    // }

                    processedAlbums.push(updatedAlbum);
                }

                a.albums = processedAlbums;

                setArtist(a);
            })
            .catch((error) => {
                console.log("An error occured while loading the album", error);
                alert("kabe");
            });
    }

    const loadTopTracks = async (type: string) => {
        const key = `topTracks_${type}`;

        const fetchFunction = async () => {
            const response = await fetch(
                `https://api.jamendo.com/v3.0/tracks/?client_id=${client_id}&format=jsonpretty&order=popularity_${type}&limit=5&offset=1`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data.results.map((result: any): Track => ({
                id: result.id,
                name: result.name,
                duration: +result.duration,
                artist_id: result.artist_id,
                artist_name: toReadable(result.artist_name)!,
                album_id: result.album_id,
                releasedate: result.releasedate,
                album_image: result.album_image,
                audio: result.audio,
                image: result.image,
            }));
        };

        const data = await fetchCache(key, fetchFunction);
        // const data = await fetchFunction();
        if (type == "week") {
            setwTracks(data);
        } else {
            setmTracks(data);
        }
    }

    const loadTopAlbums = async (type: string) => {
        const key = `topAlbums_${type}`;

        const fetchFunction = async () => {
            const response = await fetch(
                `https://api.jamendo.com/v3.0/albums/?client_id=${client_id}&format=jsonpretty&order=popularity_${type}&limit=5`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            const rawAlbums = data.results.map((result: any): Album => ({
                id: result.id,
                name: result.name,
                artist_id: result.artist_id,
                artist_name: toReadable(result.artist_name)!,
                releasedate: result.releasedate,
                image: result.image,
            }));

            const processedAlbums: Promise<Album>[] = rawAlbums.map(async (album: Album): Promise<Album> => {
                if (await compareImagesByteToByte(album.image)) {
                    return { ...album, image: await loadPicForSingle(album.id) };
                }
                return album;
            });

            const finalAlbums: Album[] = await Promise.all(processedAlbums);

            return finalAlbums;
        };

        const data = await fetchCache(key, fetchFunction);

        if (type === "week") {
            setwAlbums(data);
        } else {
            setmAlbums(data);
        }
    };

    const loadTopArtists = async (type: string) => {
        const key = `topArtists_${type}`;

        const fetchFunction = async () => {
            const response = await fetch(
                `https://api.jamendo.com/v3.0/artists/?client_id=${client_id}&format=jsonpretty&order=popularity_${type}&limit=5`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data.results.map((result: any): Artist => ({
                id: result.id,
                name: toReadable(result.name)!,
                join_date: result.join_date,
                image: result.image || "default.png",
                website: result.website,
            }));
        }

        const data = await fetchCache(key, fetchFunction);
        //const data = await fetchFunction();
        if (type == "week") {
            setwArtists(data);
        } else {
            setmArtists(data);
        }
    }

    const setCurrentTrackFR = async (track: Track | undefined) => {
        // if (isCurrentlySetting.current) return;

        // isCurrentlySetting.current = true;
        // await setCurrentTrack((prev) => track);

        // setTimeout(() => {
        //     isCurrentlySetting.current = false;
        // }, 600);
        console.log("something is setting the current track to: ", track);
        
        if(track) setCurrentTrack(track);
    };

    const search = async (term: string) => {
        console.log("searching " + term);
        setAutoComplete(undefined);
        const response = await fetch(
            `https://api.jamendo.com/v3.0/autocomplete/?client_id=${client_id}&format=jsonpretty&limit=3&prefix=${term}`
        );
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        setAutoComplete(data.results);
    }

    return (
        <TrackContext.Provider value={{ track, album, artist, active, loadTrack, setActive, loadAlbum, loadArtist, loadTopTracks, loadTopAlbums, loadTopArtists, queue, setQueue, wtracks, mtracks, walbums, malbums, wartists, martists, currentTrack, setCurrentTrackFR, search, autoComplete, setAutoComplete }}>
            {children}
        </TrackContext.Provider>
    );
}