import { useContext, useEffect, useRef, useState } from "react";
import { MusicContext } from "../contexts/MusicContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForwardStep, faBackwardStep, faVolumeMute, faVolumeLow, faVolumeHigh, faHeartCirclePlus, faHeartCircleMinus, faCirclePlus, faBars, faShuffle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { ApiContext } from "../contexts/ApiContext";
import { CreateDialogv2 } from "./CreateDialogv2";
import ScrollingText from "./ScrollinText";
import TrackPrev from "./TrackPrev";
import { Track } from "../track";

export default function MainPlayer() {
    const { queue, currentTrack, setCurrentTrackFR } = useContext(MusicContext);
    const { user, addToPlaylist } = useContext(ApiContext);
    const { like } = useContext(ApiContext);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const [isFirstPlay, setIsFirstPlay] = useState<boolean>(true);

    const [volume, setVolume] = useState<number>(1);

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [playlistIds, setPlaylistIds] = useState<number[]>([]);

    const [liked, setLiked] = useState<boolean>(false);

    const [queueOpen, setQueueOpen] = useState<boolean>(false);
    const [shuffle, setShuffle] = useState<boolean>(false);

    const [actQueue, setActQueue] = useState<Track[]>(queue);

    const setCurrentTrack = setCurrentTrackFR;
    const navigate = useNavigate();

    const [history, setHistory] = useState<Track[]>([]);

    useEffect(() => {

        try {
            const c = localStorage.getItem("cTrack");
            if (c) setCurrentTrack(JSON.parse(c));

            const a = localStorage.getItem("aQueue");
            if (a) setCurrentTrack(JSON.parse(a));
        } catch {
            console.log("couldn't load from cache");
        }

        if (actQueue.length > 0 && !currentTrack) {
            setCurrentTrack(actQueue[0]);
        }
        if (actQueue.length == 1) {
            setCurrentTrack(actQueue[0]);
        }

        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration || 0);
        };

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("loadedmetadata", updateProgress);
        audio.addEventListener("play", handlePlay);
        audio.addEventListener("pause", handlePause);

        const vol = localStorage.getItem("volume");
        if (vol) audio.volume = parseFloat(vol);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("loadedmetadata", updateProgress);
            audio.removeEventListener("play", handlePlay);
            audio.removeEventListener("pause", handlePause);
        };
    }, []);

    useEffect(() => {
        localStorage.setItem("cTrack", JSON.stringify(currentTrack));
        localStorage.setItem("aQueue", JSON.stringify(actQueue));
    }, [currentTrack, actQueue]);

    const stepTrack = () => {
        if (currentTime >= duration && duration > 0) {
            if (actQueue.indexOf(currentTrack!) !== actQueue.length - 1) {
                setCurrentTrack(actQueue[actQueue.indexOf(currentTrack!) + 1]);
            } else {
                setCurrentTrack(actQueue[0]);
            }
            setCurrentTime(0);
            setHistory([...history, currentTrack!]);
        }
    };

    useEffect(() => {
        stepTrack();
    }, [currentTime]);

    useEffect(() => {
        if (!audioRef.current || !currentTrack?.audio) return;

        const timeout = setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.src = currentTrack.audio;
                audioRef.current.load();
                if (!isFirstPlay) {
                    audioRef.current.play().catch(err => console.warn("Autoplay prevented:", err));
                }
            }
            setIsFirstPlay(false);
        }, 500);

        return () => clearTimeout(timeout);
    }, [currentTrack?.audio]);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            let t = audio.currentTime / audio.duration * 100;
            document.getElementById("seek-bar")!.style.background = `linear-gradient(to right, #FDDA0D 0%, #FDDA0D ${t}%, #ccc ${t}%)`;
        }
    }, [currentTime]);

    function formatTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${minutes}:${secs}`;
    }

    const handlePlayClick = () => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = parseFloat(e.target.value);
        }
    };

    const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = parseFloat(e.target.value);
            setVolume(audio.volume);
            localStorage.setItem("volume", volume.toString());
            e.target.style.background = `linear-gradient(to right, #222 0%, #222 ${parseFloat(e.target.value) * 100}%, white ${parseFloat(e.target.value) * 100}%)`;
        }
    };

    const handleMute = () => {
        const audio = audioRef.current;
        if (audio) {
            if (audio.volume > 0) {
                audio.volume = 0;
            } else {
                audio.volume = volume;
            }
        }
    }

    const handleStep = (n: number) => {

        if (n > 0 && currentTrack) setHistory([...history, currentTrack]);

        if (actQueue.indexOf(currentTrack!) == 0 && n < 0) {
            audioRef.current?.pause();
            setCurrentTime(0);
            audioRef.current!.currentTime = 0;
        } else if (actQueue.indexOf(currentTrack!) == actQueue.length - 1 && n > 0) {
            setCurrentTrack(actQueue[0]);
        } else {
            let temp = actQueue.indexOf(currentTrack!) + n;
            setCurrentTrack(actQueue[temp]);
        }
        setCurrentTime(0);
    }

    const handleClick = async (data: any) => {
        navigate(`/artist/${data.artist_id}`);
    }

    const isLiked = (id: number) => {

        if (!user || !user.Playlists) return false;

        const ids = new Set(user.Playlists[0].Tracks?.map((t) => +t.SongID!));

        return ids.has(id);
    }

    const getPic = (b: Blob | undefined) => {
        if (!b) return "/playlist_cover.png"
        return URL.createObjectURL(b);
    }

    const handleChange = (id: number) => {
        setPlaylistIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const data = await addToPlaylist([currentTrack?.id!], playlistIds);
        setDialogOpen(false);
    }

    const handleLikeCliked = () => {
        like(currentTrack?.id!);
        setLiked(isLiked(+currentTrack?.id!));
        document.getElementById('like_btn')?.classList.add("like-anim");
        setTimeout(() => {
            document.getElementById('like_btn')?.classList.remove("like-anim");
        }, 600);
    }

    function shuffleArray(array: Track[]): Track[] {
        const shuffled = [...array].filter(track => track !== currentTrack);
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return [...history, currentTrack!, ...shuffled];
    }

    useEffect(() => {
        if (shuffle) {
            setActQueue(prevQueue => shuffleArray([...prevQueue]));
        } else {
            const nQ = queue.slice(queue.indexOf(currentTrack!));
            setActQueue([...history, ...nQ]);
        }
    }, [shuffle, queue]);

    useEffect(() => {
        setHistory([]);
        if (shuffle) {
            setActQueue(shuffleArray([...queue]));
        } else {
            setActQueue(queue);
        }
    }, [queue]);

    useEffect(() => {
        console.log(actQueue);
    }, [actQueue])

    const handleRemove = (track: Track) => {
        const nQueue = [...actQueue].filter((t) => t !== track);
        setActQueue([...nQueue]);
    }

    useEffect(() => {
        if (!dialogOpen) {
            setPlaylistIds([]);
        }
    }, [dialogOpen]);


    // useEffect(() => {
    //     console.log(history);
    // }, [history])

    return <>
        <div className={`flex-col w-full justify-center items-center h-full ${queueOpen ? "hidden" : "flex"}`}>
            <img src={currentTrack?.image} alt="trackPic" className="hover:cursor-default track size-52 md:size-72" />
            <p className="text-xl md:text-2xl w-fit text-center inline-block"><b className="hover:cursor-pointer hover:underline" onClick={() => handleClick(currentTrack)}>{currentTrack?.artist_name}</b></p>
            <ScrollingText text={currentTrack!.name} className="mt-1 mr-auto ml-auto w-2/4 text-xl md:text-2xl" trigger={[currentTrack]} />
            <div className="w-full m-4">
                <audio ref={audioRef} className="w-3/4 ml-f-3/4 hover:cursor-default">
                    <source src={currentTrack?.audio} type="audio/mpeg" />
                </audio>
                <div className="w-3/4 ml-f-3/4 inline h-6 mb-4">
                    <div className="flex items-center justify-center gap-10">
                        {
                            user && <button className="size-5">
                                <FontAwesomeIcon icon={liked ? faHeartCircleMinus : faHeartCirclePlus} className={`size-5 ${liked ? "text-yellow-300" : "text-white"}`} id="like_btn" onClick={() => handleLikeCliked()} />
                            </button>
                        }
                        <button className="size-5" onClick={() => handleStep(-1)}>
                            <FontAwesomeIcon icon={faBackwardStep} className="size-5" />
                        </button>
                        <button id="play-pause" onClick={handlePlayClick} className="size-5">
                            {isPlaying ? (
                                <FontAwesomeIcon icon={faPause} className="size-5" />
                            ) : (
                                <FontAwesomeIcon icon={faPlay} className="size-5" />
                            )}
                        </button>
                        <button className="size-5" onClick={() => handleStep(1)}>
                            <FontAwesomeIcon icon={faForwardStep} className="size-5" />
                        </button>
                        {
                            user && <button className="size-5">
                                <FontAwesomeIcon icon={faCirclePlus} className="size-5" onClick={() => setDialogOpen(true)} />
                            </button>
                        }
                    </div>
                    <div className="flex felx-row items-center justify-center mb-auto">
                        <div className="flex items-center justify-center gap-2 mr-1">
                            <span id="current-time" className="w-8">{formatTime(currentTime)}</span>
                            <input
                                id="seek-bar"
                                type="range"
                                min="0"
                                max={duration.toString()}
                                step="1"
                                value={currentTime}
                                onChange={handleSeek}
                                style={{
                                    width: "15rem",
                                    height: "0.5rem",
                                    background: "linear-gradient(to right, #00f 0%, #00f 0%, #ccc 0%)",
                                    borderRadius: "2px",
                                    outline: "none",
                                    appearance: "none",
                                    cursor: "pointer",
                                }}
                            />
                            <span id="duration" className="w-8">{formatTime(duration)}</span>
                        </div>
                    </div>
                    {
                        audioRef.current && <div className="flex items-center m-auto gap-2 bg-white-kinda px-4 py-2 rounded-lg w-48 hover:cursor-pointer">
                        <FontAwesomeIcon
                            icon={audioRef.current.volume > 0.4 ? faVolumeHigh : audioRef.current!.volume === 0 ? faVolumeMute : faVolumeLow}
                            className="text-gray28 text-lg"
                            onClick={handleMute}
                        />
                        <input
                            type="range"
                            className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer"
                            value={volume}
                            min={0}
                            max={1} 
                            step={0.05}
                            onChange={handleVolume}
                        />
                    </div>
                    }
                </div>
            </div>
        </div>

        <div className={`flex-col items-center w-full h-9/10 overflow-scroll p-4 ${queueOpen ? "flex" : "hidden"} scrollbar-hidden`}>
            {
                actQueue.slice(actQueue.lastIndexOf(currentTrack!)).map((track, i) =>
                    <TrackPrev track={track} isFirst={i == 0} add={() => { setDialogOpen(true); setPlaylistIds([]); }} remove={() => handleRemove(track)} />
                )
            }
        </div>

        <div className="flex flex-row w-full h-1/5 md:h-1/10 justify-center items-center gap-4">
            <button><FontAwesomeIcon icon={faBars} className={`size-5 ${queueOpen ? "text-yellow-400" : "text-white"}`} onClick={() => setQueueOpen(!queueOpen)} /></button>
            <button><FontAwesomeIcon icon={faShuffle} className={`size-5 ${shuffle ? "text-yellow-400" : "text-white"}`} onClick={() => setShuffle(!shuffle)} /></button>
        </div>

        {
            dialogOpen ? (
                <CreateDialogv2 props={{ caption: "Playlists", close: () => setDialogOpen(false) }}>
                    <form className="flex flex-col p-2 md:p-4 gap-4">
                        {
                            user?.Playlists.map((playlist) =>
                                // <div className="flex flex-row items-center gap-6">
                                //     <img src={getPic(playlist.PlaylistCover)} alt="playlistPic" className="size-16 rounded-md" />
                                //     <p className="w-24 overflow-scroll">{playlist.PlaylistName}</p>
                                //     <input type="checkbox" name="add" value={playlist.PlaylistID} checked={playlistIds.includes(playlist.PlaylistID)} onChange={() => handleChange(playlist.PlaylistID)} />
                                // </div>
                                <div className={`flex flex-row gap-2 w-[95%] ml-auto mr-auto items-center hover:cursor-pointer rounded-md p-2 pr-8 ${playlistIds.includes(playlist.PlaylistID) ? "bg-yellow-400 hover:bg-yellow-500 text-gray28" : "hover:bg-gray28 text-white"} hover:shadow-lg mt-8 -mb-8 group`} onClick={() => handleChange(playlist.PlaylistID)}>
                                    <img src={getPic(playlist.PlaylistCover)} alt="playlistPic" className="size-14 rounded-sm" />
                                    <p>{playlist.PlaylistName}</p>
                                </div>
                            )
                        }
                        <button type="submit" className="bg-white text-gray222 font-semibold w-fit p-1 pl-2 pr-2 rounded-md hover:bg-white-kinda ml-auto mr-auto" onClick={handleSubmit}>Add</button>
                    </form>
                </CreateDialogv2>
            ) : (
                <span></span>
            )
        }

    </>
}