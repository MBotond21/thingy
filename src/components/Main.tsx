import { useState } from "react"
import Top from "./Top";

export default function Main() {

    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    return <>
        <main>
            <div className="flex bg-222 h-9/10 rounded-lg w-full columns-2 col text-white gap-2 p-4 transition-all tsm">
                <div className="flex w-full xl:h-full flex-col justify-center gap-10">
                    <Top type="week" from="tracks"/>
                    <Top type="week" from="albums"/>
                    <Top type="week" from="artists"/>
                </div>
                <div className="w-full xl:h-full flex flex-col justify-center gap-10">
                    <Top type="month" from="tracks"/>
                    <Top type="month" from="albums"/>
                    <Top type="month" from="artists"/>
                </div>
            </div>
        </main>
    </>
}