import { useContext, useEffect, useRef, useState } from "react";
import { TrackContext } from "../contexts/MusicContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForwardStep, faBackwardStep, faVolumeMute, faVolumeLow, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { Track } from "../track";

export default function MainPlayer() {
    const { track, loadTrack, changeInfoActive, queue, loadAlbum } = useContext(TrackContext);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const [currentTrack, setCurrentTrack] = useState<Track>(queue[0]);

    const [isFirstPlay, setIsFirstPlay] = useState<boolean>(true);

    useEffect(() => {
        //loadTrack("887211");
        loadAlbum("116770")
    }, []);

    useEffect(() =>{
        setCurrentTrack(queue[0]);
    }, [queue])

    useEffect(() => {
        const audio = audioRef.current;

        if (audio) {
            const updateProgress = () => {
                setCurrentTime(audio.currentTime);
                setDuration(audio.duration || 0);
            };

            audio.addEventListener("timeupdate", updateProgress);
            audio.addEventListener("loadedmetadata", updateProgress);
            audio.addEventListener("play", () => setIsPlaying(true));
            audio.addEventListener("pause", () => setIsPlaying(false));

            return () => {
                audio.removeEventListener("timeupdate", updateProgress);
                audio.removeEventListener("loadedmetadata", updateProgress);
                audio.removeEventListener("play", () => setIsPlaying(true));
                audio.removeEventListener("pause", () => setIsPlaying(false));
            };
        }
    }, []);

    useEffect(() => {
        if(currentTime == duration){
            setCurrentTrack(queue[queue.indexOf(currentTrack)+1]);
        }
    }, [currentTime])

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
            if(!isFirstPlay){
                audioRef.current.play();
            }
            setIsFirstPlay(false);
            changeInfoActive(true);
        }
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

    return <>
        <div className="content">
            <img src={currentTrack?.image} alt="trackPic" className="hover:cursor-default track" />
            <p className="text-2xl mt-1 hover:cursor-default" ><b>{currentTrack?.artist_name}</b> - {currentTrack?.name}</p>
            <div className="w-full m-4 relative top-1/4">
                <audio ref={audioRef} className="w-3/4 ml-f-3/4 hover:cursor-default">
                    <source src={currentTrack?.audio} type="audio/mpeg" />
                </audio>
                <div className="w-3/4 ml-f-3/4 inline h-6">
                    <div className="flex items-center justify-center">
                        <button id="play-pause" onClick={handlePlayClick} className="size-5">
                            {isPlaying ? (
                                <FontAwesomeIcon icon={faPause} className="size-5" />
                            ) : (
                                <FontAwesomeIcon icon={faPlay} className="size-5" />
                            )}
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <span id="current-time">{formatTime(currentTime)}</span>
                        <input
                            id="seek-bar"
                            type="range"
                            min="0"
                            max={duration.toString()}
                            step="1"
                            value={currentTime}
                            onChange={handleSeek}
                            style={{
                                width: "50%",
                                height: "0.5rem",
                                background: "linear-gradient(to right, #00f 0%, #00f 0%, #ccc 0%)",
                                borderRadius: "2px",
                                outline: "none",
                                appearance: "none",
                                cursor: "pointer",
                            }}
                        />
                        <span id="duration">{formatTime(duration)}</span>
                    </div>

                </div>
            </div>
        </div>
    </>
}