import { useContext, useEffect, useRef } from "react";
import { TrackContext } from "../contexts/MusicContext";

export default function MainPlayer() {
    const { track, loadTrack } = useContext(TrackContext);
    const audioRef = useRef(null);

    useEffect(() => {
        loadTrack("1848357");
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
        }
    }, [track?.audio]);

    return <>
        <div className="content">
            <img src={track?.image} alt="trackPic" className="hover:cursor-default track" />
            <div className="w-full m-4 inline">
                <audio ref={audioRef} controls className="w-3/4 ml-f-3/4 hover:cursor-default">
                    <source src={track?.audio} type="audio/mpeg" />
                </audio>
            </div>
        </div>
    </>
}