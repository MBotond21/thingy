import { useContext, useEffect, useRef, useState } from "react";
import { TrackContext } from "../contexts/MusicContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForwardStep, faBackwardStep, faVolumeMute, faVolumeLow, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";

export default function MainPlayer() {
    const { track, loadTrack } = useContext(TrackContext);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        loadTrack("887211");
    }, []);

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
        if (audioRef.current) {
            audioRef.current.load();
        }
    }, [track?.audio]);

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
            <img src={track?.image} alt="trackPic" className="hover:cursor-default track" />
            <p><b>{track?.artist_name}</b> - {track?.name}</p>
            <div className="w-full m-4 inline">
                <audio ref={audioRef} className="w-3/4 ml-f-3/4 hover:cursor-default">
                    <source src={track?.audio} type="audio/mpeg" />
                </audio>
                <div className="w-3/4 ml-f-3/4 inline h-6">
                    <button id="play-pause" onClick={handlePlayClick} className="size-5">
                        {isPlaying ? (
                            <FontAwesomeIcon icon={faPause} />
                        ) : (
                            <FontAwesomeIcon icon={faPlay} />
                        )}
                    </button>
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
                            height: "0.4rem",
                            background: "linear-gradient(to right, #00f 0%, #00f 0%, #ccc 0%)",
                            borderRadius: "2px",
                            outline: "none",
                            appearance: "none",
                            cursor: "pointer",
                        }}
                    />
                    <span id="current-time">{formatTime(currentTime)}</span> /
                    <span id="duration">{formatTime(duration)}</span>
                </div>
            </div>
        </div>
    </>
}