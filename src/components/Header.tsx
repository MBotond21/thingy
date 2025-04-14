import { useNavigate } from "react-router";
import AccComp from "./AccComp";
import SearchBar from "./SearchBar";
import { useContext } from "react";
import { MusicContext } from "../contexts/MusicContext";

export default function Header(){

    const navigate = useNavigate();
    const { setActive } = useContext(MusicContext)

    const navToHome = () => {
        navigate("/");
        setActive("info");
    }

    return <>
        <header>
            <img src="/logo.png" alt="site" className="size-12 hover:cursor-pointer rounded-full shadow-xl" onClick={() => navToHome()} />
            <SearchBar/>
            <AccComp/>
        </header>
    </>
}