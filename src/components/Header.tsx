import AccComp from "./AccComp";
import SearchBar from "./SearchBar";

export default function Header(){
    return <>
        <header>
            <img src="/vite.svg" alt="site" className="size-12" />
            <SearchBar/>
            <AccComp/>
        </header>
    </>
}