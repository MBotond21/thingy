import AccComp from "./AccComp";
import SearchBar from "./SearchBar";

export default function Header(){
    return <>
        <header>
            <SearchBar/>
            <AccComp/>
        </header>
    </>
}