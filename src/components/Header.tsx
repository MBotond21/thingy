import { useNavigate } from "react-router";
import AccComp from "./AccComp";
import SearchBar from "./SearchBar";

export default function Header(){

    const navigate = useNavigate();

    return <>
        <header>
            <img src="/vite.svg" alt="site" className="size-12 hover:cursor-pointer" onClick={() => navigate("/")} />
            <SearchBar/>
            <AccComp/>
        </header>
    </>
}