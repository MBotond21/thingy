import { useContext, useEffect, useRef, useState } from "react";
import { TrackContext } from "../contexts/MusicContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForwardStep, faBackwardStep, faVolumeMute, faVolumeLow, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { Track } from "../track";
import { useNavigate } from "react-router";

export default function MainPlayer() {
    const { track, loadTrack, queue, loadAlbum, currentTrack, setCurrentTrackFR, loadArtist } = useContext(TrackContext);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const [isFirstPlay, setIsFirstPlay] = useState<boolean>(true);

    const [volume, setVolume] = useState<number>(1);

    const setCurrentTrack = setCurrentTrackFR;
    const navigate = useNavigate();

    useEffect(() => {
        if (queue.length > 0 && !currentTrack) {
            console.log("MainPlayer is setting the current track:", queue[0]);
            setCurrentTrack(queue[0]);
        }
    }, [queue]);

    useEffect(() => {
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
        if(vol) audio.volume = parseFloat(vol);

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
    }, [currentTime])

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

    return <>
        <div className="content">
            <img src={currentTrack?.image} alt="trackPic" className="hover:cursor-default track size-52 md:size-72" />
            <p className="text-xl md:text-2xl mt-1 hover:cursor-default w-2/4 text-center"><b className="hover:cursor-pointer hover:underline" onClick={() => handleClick(currentTrack)}>{currentTrack?.artist_name}</b> - {currentTrack?.name}</p>
            <div className="w-full m-4">
                <audio ref={audioRef} className="w-3/4 ml-f-3/4 hover:cursor-default">
                    <source src={currentTrack?.audio} type="audio/mpeg" />
                </audio>
                <div className="w-3/4 ml-f-3/4 inline h-6">
                    <div className="flex items-center justify-center gap-10">
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
    </>
}