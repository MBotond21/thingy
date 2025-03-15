import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

export default function SearchBar() {

    const { search, autoComplete, setAutoComplete } = useContext(AuthContext);
    const [term, setTerm] = useState<string>("");
    const [filtered, setFiltered] = useState<any[]>([]);
    const [filter, setFilter] = useState<string>("all");
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (term.length > 1) {
            search(term);
        } else {
            setAutoComplete(undefined);
            setFiltered([]);
        }
    }, [term]);

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
        console.log(autoComplete);
    }, [autoComplete]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!document.getElementById("dropdown-container")?.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClick = (clicked: any) => {
        if(clicked.PlaylistID) navigate(`/playlist/${clicked.PlaylistID}`);
    }

    return <>
        <div className="search-cont w-1/2 md:w-1/3">
            <div>
                <div className="absolute top-3.5 flex items-center ps-3 pointer-events-none z-30">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <div className="group">
                    <input type="text" id="term" placeholder="Search" className="w-full relative z-20" onChange={(e) => setTerm(e.target.value)} onFocus={() => setIsDropdownOpen(true)} />
                    <div id="dropdown-container" className={`${isDropdownOpen ? "flex" : "hidden"} flex-col bg-111 absolute z-10 inset-y-10 w-1/2 md:w-1/3 h-fit max-h-72 rounded-b-lg shadow-md transition-all text-white overflow-scroll p-4`} onMouseDown={(e) => e.stopPropagation()}>
                        <div className="flex flex-row gap-2 w-full items-center justify-center font-medium">
                            <button className="bg-white rounded-xl w-fit text-gray222 pl-2 pr-2 hover:bg-gray-300 transition-all disabled:bg-gray-300" onClick={() => setFilter("all")} disabled={filter == "all"}>All</button>
                            <button className="bg-white rounded-xl w-fit text-gray222 pl-2 pr-2 hover:bg-gray-300 transition-all disabled:bg-gray-300" onClick={() => setFilter("tags")} disabled={filter == "tags"}>Tags</button>
                            <button className="bg-white rounded-xl w-fit text-gray222 pl-2 pr-2 hover:bg-gray-300 transition-all disabled:bg-gray-300" onClick={() => setFilter("artists")} disabled={filter == "artists"}>Artists</button>
                            <button className="bg-white rounded-xl w-fit text-gray222 pl-2 pr-2 hover:bg-gray-300 transition-all disabled:bg-gray-300" onClick={() => setFilter("albums")} disabled={filter == "albums"}>Albums</button>
                            <button className="bg-white rounded-xl w-fit text-gray222 pl-2 pr-2 hover:bg-gray-300 transition-all disabled:bg-gray-300" onClick={() => setFilter("tracks")} disabled={filter == "tracks"}>Tracks</button>
                            <button className="bg-white rounded-xl w-fit text-gray222 pl-2 pr-2 hover:bg-gray-300 transition-all disabled:bg-gray-300" onClick={() => setFilter("playlists")} disabled={filter == "playlists"}>Playlists</button>
                        </div>
                        {
                            filtered?.map((item) => (
                                <div className="hover:bg-gray222 w-full transition-all" onClick={() => handleClick(item)}>
                                    <p className="p-4">{item.PlaylistName ? item.PlaylistName : item}</p>
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