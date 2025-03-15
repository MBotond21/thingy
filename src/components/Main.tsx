import { useContext, useState } from "react"
import Top from "./Top";
import { AuthContext } from "../contexts/AuthContext";
import { TrackContext } from "../contexts/MusicContext";

export default function Main() {

    const { user } = useContext(AuthContext);
    const { active, currentTrack } = useContext(TrackContext)


    return <>
        <div className={`${active == "info"? "flex": "hidden lg:flex"} w-full bg-222 rounded-lg max-h-[75vh] md:max-h-[80vh] ${user ? "sm xxl:columns-2" : `${currentTrack? "sm": "columns-2"}`} text-white gap-2 pl-4 pr-4 pb-4 pt-8 xxl:p-10 transition-all tsm justify-between overflow-scroll scrollbar-hidden`}>
            <div className={`flex w-fit xl:h-full flex-col justify-center gap-10`}>
                <Top type="week" from="tracks" />
                <Top type="week" from="albums" />
                <Top type="week" from="artists" />
            </div>
            <div className={`flex w-fit xl:h-full flex-col justify-center gap-10`}>
                <Top type="month" from="tracks" />
                <Top type="month" from="albums" />
                <Top type="month" from="artists" />
            </div>
        </div>
    </>
}