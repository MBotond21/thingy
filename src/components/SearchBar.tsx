import { useContext, useEffect, useState } from "react"
import { TrackContext } from "../contexts/MusicContext";

export default function SearchBar() {

    const {search, autoComplete, setAutoComplete} = useContext(TrackContext);
    const [term, setTerm] = useState<string>("");

    useEffect(() => {
        if(term.length > 1){
            search(term);
        }else{
            setAutoComplete([]);
        }
    }, [term]);

    return <>
        <div className="search-cont w-2/5 md:w-1/4">
            <div>
                <div className="absolute inset-y-0 flex items-center ps-3 pointer-events-none z-20">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <div className="group">
                    <input type="text" id="term" placeholder="Search" className="w-full relative z-10" onChange={(e) => setTerm(e.target.value)} />
                    <div className=" hidden group-focus-within:flex flex-col bg-111 absolute inset-y-10 w-2/5 md:w-1/4 h-fit max-h-72 rounded-b-lg shadow-md transition-all text-white overflow-scroll p-4">
                        {
                            autoComplete.map((item) => (
                                <div className="hover:bg-gray222 w-full transition-all">
                                    <p className="p-4">{item}</p>
                                    <hr />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    </>
}