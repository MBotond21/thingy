import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { TrackContext } from "../contexts/MusicContext";

export default function SearchBar() {

    const { search, autoComplete, setAutoComplete } = useContext(AuthContext);
    const [term, setTerm] = useState<string>("");
    const [filtered, setFiltered] = useState<any[]>([]);
    const [filter, setFilter] = useState<string>("all");
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const termRef = useRef(term);
    const filterRef = useRef(filter);

    useEffect(() => {
        if (term.length > 1) {
            search(term);
        } else {
            setAutoComplete(undefined);
            setFiltered([]);
        }
        termRef.current = term;
    }, [term]);

    useEffect(() => {
        filterRef.current = filter;
    }, [filter])

    useEffect(() => {
        if (autoComplete) {
            if (filter == "all") {
                setFiltered(Object.values(autoComplete).flat());
            }
            else {
                setFiltered(autoComplete[filter]);
            }
        }
    }, [autoComplete, filter]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!document.getElementById("dropdown-container")?.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        const handleSubmit = (event: KeyboardEvent) => {
            if (event.key == "Enter") {
                navigate(`/search?term=${termRef.current}&filter=${filterRef.current}`);
                setIsDropdownOpen(false);
            };
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.getElementById('term')?.addEventListener("keydown", handleSubmit);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.getElementById('term')?.addEventListener("keydown", handleSubmit);
        }
    }, []);

    return <>
        <div className="w-1/2 md:w-1/3 overflow-visible relative">
            <div className="relative">
                <div className="absolute top-3.5 flex items-center ps-3 pointer-events-none z-30">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <div className="group">
                    <input
                        type="text"
                        id="term"
                        placeholder="Search"
                        value={term}
                        className="w-full peer relative z-20 
                            below-lg:focus-within:absolute 
                            below-lg:focus-within:-right-[52%] 
                            below-lg:focus-within:w-[90vw] 
                            below-lg:focus-within:z-[9999] 
                            transition-[width] duration-300 delay-200 
                            below-lg:focus-within:transition-[position,z-index] below-lg:focus-within:duration-500 below-lg:focus-within:delay-500"
                        onChange={(e) => setTerm(e.target.value)}
                        onFocus={() => setIsDropdownOpen(true)}
                    />
                    <div
                        id="dropdown-container"
                        className={`
                            ${isDropdownOpen ? "flex" : "hidden"} flex-col bg-111 absolute z-[9999] w-full md:w-full 
                            h-fit max-h-72 rounded-b-lg shadow-md text-white overflow-scroll p-4 scrollbar-hidden 
                            below-lg:peer-focus-within:absolute 
                            below-lg:peer-focus-within:-right-[52%] 
                            below-lg:peer-focus-within:w-[90vw] 
                            below-lg:peer-focus-within:z-[9998] 
                            below-lg:peer-focus-within:top-10 
                            
                            /* Staggered transitions */
                            transition-[width] duration-300 delay-200
                            below-lg:peer-focus-within:transition-[position,z-index,top] below-lg:peer-focus-within:duration-500 below-lg:peer-focus-within:delay-500
                        `}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-row gap-2 w-full h-fit items-center justify-center font-medium">
                            <button className="bg-white rounded-xl w-fit text-gray222 pl-2 pr-2 hover:bg-gray-300 transition-all disabled:bg-gray-300" onClick={() => setFilter("all")} disabled={filter == "all"}>All</button>
                            <button className="bg-white rounded-xl w-fit text-gray222 pl-2 pr-2 hover:bg-gray-300 transition-all disabled:bg-gray-300" onClick={() => setFilter("tags")} disabled={filter == "tags"}>Tags</button>
                            <button className="bg-white rounded-xl w-fit text-gray222 pl-2 pr-2 hover:bg-gray-300 transition-all disabled:bg-gray-300" onClick={() => setFilter("artists")} disabled={filter == "artists"}>Artists</button>
                            <button className="bg-white rounded-xl w-fit text-gray222 pl-2 pr-2 hover:bg-gray-300 transition-all disabled:bg-gray-300" onClick={() => setFilter("albums")} disabled={filter == "albums"}>Albums</button>
                            <button className="bg-white rounded-xl w-fit text-gray222 pl-2 pr-2 hover:bg-gray-300 transition-all disabled:bg-gray-300" onClick={() => setFilter("tracks")} disabled={filter == "tracks"}>Tracks</button>
                            <button className="bg-white rounded-xl w-fit text-gray222 pl-2 pr-2 hover:bg-gray-300 transition-all disabled:bg-gray-300" onClick={() => setFilter("playlists")} disabled={filter == "playlists"}>Playlists</button>
                        </div>
                        {
                            filtered?.map((item, index) => (
                                <div
                                    key={index}
                                    className="hover:bg-gray-700 hover:cursor-pointer w-full transition-all z-[200]"
                                    onClick={() => {
                                        setTerm(item);
                                    }}
                                >
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