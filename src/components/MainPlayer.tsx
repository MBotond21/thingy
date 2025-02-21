import { useContext, useEffect, useRef, useState } from "react";
import { TrackContext } from "../contexts/MusicContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForwardStep, faBackwardStep, faVolumeMute, faVolumeLow, faVolumeHigh, faHeartCirclePlus, faHeartCircleMinus, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import { CreateDialogv2 } from "./CreateDialogv2";

export default function MainPlayer() {
    const { queue, currentTrack, setCurrentTrackFR, loadArtist } = useContext(TrackContext);
    const { user, addToPlaylist } = useContext(AuthContext);
    const { like } = useContext(AuthContext);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const [isFirstPlay, setIsFirstPlay] = useState<boolean>(true);

    const [volume, setVolume] = useState<number>(1);

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [playlistIds, setPlaylistIds] = useState<number[]>([]);

    const [liked, setLiked] = useState<boolean>(false);

    const setCurrentTrack = setCurrentTrackFR;
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (queue.length > 0 && !currentTrack) {
    //         setCurrentTrack(queue[0]);
    //     } else if (queue.length == 1) {
    //         setCurrentTrack(queue[0]);
    //     }
    // }, [queue]);

    useEffect(() => {
        console.log("queue: ", queue);
        console.log(`The current track is set to: `, currentTrack);
    }, [currentTrack]);

    useEffect(() => {

        if (queue.length > 0 && !currentTrack) {
            console.log("Mainplayer");
            setCurrentTrack(queue[0]);
        }
        if (queue.length == 1) {
            console.log("Mainplayer");
            setCurrentTrack(queue[0]);
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

    const stepTrack = () => {
        if (currentTime == duration) {
            if (queue.indexOf(currentTrack!) != queue.length - 1) {
                setCurrentTrack(queue[queue.indexOf(currentTrack!) + 1]);
            } else {
                setCurrentTrack(queue[0]);
            }
            setCurrentTime(0);
        }
    }

    useEffect(() => {
        if (currentTrack) setLiked(isLiked(+currentTrack.id));
    }, [currentTrack])

    useEffect(() => {
        stepTrack();
    }, [currentTime])

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
            e.target.style.background = `linear-gradient(to top, #FDDA0D 0%, #FDDA0D ${parseFloat(e.target.value) * 100}%, #ccc ${parseFloat(e.target.value) * 100}%)`;
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

        if (queue.indexOf(currentTrack!) == 0 && n < 0) {
            audioRef.current?.pause();
            setCurrentTime(0);
            audioRef.current!.currentTime = 0;
        } else if (queue.indexOf(currentTrack!) == queue.length - 1) {
            setCurrentTrack(queue[0]);
        } else {
            let temp = queue.indexOf(currentTrack!) + n;
            setCurrentTrack(queue[temp]);
        }
        setCurrentTime(0);
    }

    const handleClick = async (data: any) => {
        loadArtist(data.artist_id);
        navigate("/artistView");
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

    return <>
        <div className="content">
            <img src={currentTrack?.image} alt="trackPic" className="hover:cursor-default track size-52 md:size-72" />
            <p className="text-xl md:text-2xl w-fit text-center inline-block"><b className="hover:cursor-pointer hover:underline" onClick={() => handleClick(currentTrack)}>{currentTrack?.artist_name}</b></p>
            <div className="mt-1 mr-auto ml-auto w-2/4 overflow-hidden whitespace-nowrap scroll">                
                <p className="text-xl md:text-2xl w-fit text-center inline-block">{currentTrack?.name}</p>
            </div>
            <div className="w-full m-4">
                <audio ref={audioRef} className="w-3/4 ml-f-3/4 hover:cursor-default">
                    <source src={currentTrack?.audio} type="audio/mpeg" />
                </audio>
                <div className="w-3/4 ml-f-3/4 inline h-6">
                    <div className="flex items-center justify-center gap-10">
                        {
                            user ? (
                                <button className="size-5">
                                    <FontAwesomeIcon icon={isLiked(+currentTrack?.id!) ? faHeartCircleMinus : faHeartCirclePlus} className={`size-5 ${isLiked(+currentTrack?.id!) ? "text-pink-300" : ""}`} id="like_btn" onClick={() => handleLikeCliked()} />
                                </button>
                            ) : (
                                <span></span>
                            )
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
                            user ? (
                                <button className="size-5">
                                    <FontAwesomeIcon icon={faCirclePlus} className="size-5" onClick={() => setDialogOpen(true)} />
                                </button>
                            ) : (
                                <span></span>
                            )
                        }
                    </div>
                    <div className="flex felx-row items-center justify-center">
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
                        <div className="hidden relative lg:flex flex-col items-center p-2 ml-4 -mr-8 w-9 h-9 z-10 transition ease-in-out duration-700 group g">
                            <FontAwesomeIcon icon={audioRef.current?.volume! > 0.4 ? faVolumeHigh : audioRef.current?.volume == 0 ? faVolumeMute : faVolumeLow} className="size-5 cursor-pointer transition ease-in-out duration-700 group-hover:text-black" onClick={handleMute} />
                            <input type="range" className="vert absolute bottom-3/4 mb-2 hidden group-hover:flex hover:flex w-24 m-8 transition ease-in-out duration-700" value={audioRef.current?.volume} min={0} max={1} step={0.05} onChange={handleVolume} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {
            dialogOpen ? (
                <CreateDialogv2 props={{ caption: "Playlists", close: () => setDialogOpen(false) }}>
                    <form className="flex flex-col p-2 md:p-4 gap-4">
                        {
                            user?.Playlists.map((playlist) =>
                                <div className="flex flex-row items-center gap-6">
                                    <img src={getPic(playlist.PlaylistCover)} alt="playlistPic" className="size-16 rounded-md" />
                                    <p className="w-24 overflow-scroll">{playlist.PlaylistName}</p>
                                    <input type="checkbox" name="add" value={playlist.PlaylistID} checked={playlistIds.includes(playlist.PlaylistID)} onChange={() => handleChange(playlist.PlaylistID)} />
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