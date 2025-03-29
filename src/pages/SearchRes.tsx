import { useContext, useEffect, useState } from "react"
import { TrackContext } from "../contexts/MusicContext"
import { useLocation, useNavigate } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import { Playlist } from "../playlist";
import { Track } from "../track";
import { Artist } from "../artist";
import { Album } from "../album";
import SearchItemPrev from "../components/SearchItemPrev";
import PlaylistsPrev from "../components/PlaylistPrev";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

type Result = {
    tags: { [key: string]: Track },
    tracks: { [key: string]: Track },
    artists: { [key: string]: Artist },
    albums: { [key: string]: Album },
    playlists: { [key: string]: Playlist }
}

export default function SearchRes() {
    const query = useQuery();
    const { active, searchWTags, searchTracks, searchAlbums, searchArtists, setCurrentTrackFR, setQueue } = useContext(TrackContext);
    const { searchPlaylists } = useContext(AuthContext);
    const term = query.get("term");
    const filter = query.get("filter");

    const navigate = useNavigate();

    const [results, setResults] = useState<Result>({ tags: {}, tracks: {}, artists: {}, albums: {}, playlists: {} });

    const fetchTags = async () => {
        const res = await searchWTags(term!);

        const obj = res.reduce((acc: { [key: string]: Track }, track: Track, index: number) => {
            acc[index.toString()] = track;
            return acc;
        }, {})

        setResults(prevResults => ({ ...prevResults, tags: obj }));
    }

    const fetchTracks = async () => {
        const res = await searchTracks(term!);

        const obj = res.reduce((acc: { [key: string]: Track }, track: Track, index: number) => {
            acc[index.toString()] = track;
            return acc;
        }, {})

        setResults(prevResults => ({ ...prevResults, tracks: obj }));
    }

    const fetchAlbums = async () => {
        const res = await searchAlbums(term!);

        const obj = res.reduce((acc: { [key: string]: Album }, album: Album, index: number) => {
            acc[index.toString()] = album;
            return acc;
        }, {})

        setResults(prevResults => ({ ...prevResults, albums: obj }));
    }

    const fetchArtists = async () => {
        const res = await searchArtists(term!);

        const obj = res.reduce((acc: { [key: string]: Artist }, artist: Artist, index: number) => {
            acc[index.toString()] = artist;
            return acc;
        }, {})

        setResults(prevResults => ({ ...prevResults, artists: obj }));
    }

    const fetchPlaylists = async () => {
        const res = await searchPlaylists(term!);

        const obj = res.reduce((acc: { [key: string]: Playlist }, playlist: Playlist, index: number) => {
            acc[index.toString()] = playlist;
            return acc;
        }, {})

        setResults(prevResults => ({ ...prevResults, playlists: obj }));
    }

    const handleClick = (category: string, item: any) => {
        if (category === "tracks" || category === "tags") {
            setCurrentTrackFR(item);
            setQueue([item]);
        } else {
            const subsite = category.slice(0, -1);
            navigate(`/${subsite}/${item.id}`);
        }
    };

    useEffect(() => {
        const fetchResults = async () => {
            switch (filter) {
                case "tags":
                    await fetchTags();
                    break;
                case "artists":
                    await fetchArtists();
                    break
                case "albums":
                    await fetchAlbums();
                    break
                case "tracks":
                    await fetchTracks();
                    break
                case "playlists":
                    await fetchPlaylists();
                    break
                default:
                    fetchTags();
                    fetchTracks();
                    fetchPlaylists();
                    break;
            }
        }

        if (term && filter) {
            setResults({ tags: {}, tracks: {}, artists: {}, albums: {}, playlists: {} });
            fetchResults();
        }

    }, [term, filter]);

    return <>
        <div className={`${active == "info" ? "flex" : "hidden lg:flex"} lg:flex h-[75vh] md:h-[80vh] w-full flex-col pt-8 pr-8 pl-8 gap-10 bg-222 rounded-lg overflow-y-scroll overflow-x-clip scrollbar-hidden`}>
            {
                !Object.values(results).every(obj => Object.keys(obj).length === 0) ? (
                    Object.entries(results).map(([category, items]) => (
                        Object.keys(items).length > 0 && (
                            <div key={category} className="mb-8">
                                <h1 className="capitalize text-2xl font-semibold">{category}</h1>
                                <hr />
                                <ul>
                                    {Object.entries(items).map(([key, value]) => (
                                        <>
                                            {
                                                (
                                                    category != "playlists" ? (
                                                        <SearchItemPrev key={key} img={value.image} artist={value.artist_name ? value.artist_name : value.name} artist_id={value.artist_id ? value.artist_id : value.id} name={value.artist_name ? value.name : undefined} onClick={() => handleClick(category, value)} />
                                                    ) : (
                                                        <PlaylistsPrev playlist={value} />
                                                    )
                                                )
                                            }
                                        </>
                                    ))}
                                </ul>
                            </div>
                        )
                    ))
                ): (
                    <p>No results found...</p>
                )
           }
        </div>
    </>
}