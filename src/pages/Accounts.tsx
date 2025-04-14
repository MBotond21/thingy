import { useContext, useEffect, useState } from "react"
import { ApiContext } from "../contexts/ApiContext"
import { useNavigate, useParams } from "react-router";
import { Playlist } from "../playlist";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

interface OutsideUser {
    Username: string;
    Pfp: any;
    Description: string | undefined;
    Playlists: Playlist[];
}

export default function Accounts() {

    const { user, getUser, profile } = useContext(ApiContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [current, setCurrent] = useState<OutsideUser>();
    const [pfp, setPfp] = useState<string>('');

    useEffect(() => {
        const load = async () => {
            await profile();
            if (id == user?.Id) navigate('/account');
            const res = await getUser(+id!);
            if (res) setCurrent(res as OutsideUser);
        }
        load();
    }, []);

    useEffect(() => {
        if (current) {
            if (current.Pfp) {
                const p = new Blob([new Uint8Array(current.Pfp.data)])
                const url = URL.createObjectURL(p);
                setPfp(url);

                return () => URL.revokeObjectURL(url);
            } else {
                setPfp('default.png');
            }
        }
    }, [current]);

    const getUrl = (b: any) => {
        if (!b) return 'default.png';
        const b2 = new Blob([new Uint8Array(b.data)]);
        const url = URL.createObjectURL(b2);

        return url;
    }

    return <>
        <main>
            <div className="flex bg-222 rounded-lg w-full h-full flex-col mt-6 text-white gap-2 p-4 md:p-10 xxl:p-14 transition-all tsm scrollbar-hidden">
                <div className="flex flex-row w-full">
                    <img src={pfp} alt="pfp" className="rounded-full size-36 md:size-72" />
                    <div className="flex flex-col p-4">
                        <h1 className="text-xl md:text-2xl font-bold">{current?.Username}</h1>
                        <div className="flex flex-row m-2 items-center justify-center group gap-2">
                            <p>{current?.Description}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row gap-4 mt-auto">
                    {current?.Playlists.map((playlist) => (
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 lg:w-32 lg:h-32 flex-shrink-0 relative group">
                                <img src={getUrl(playlist.PlaylistCover)} alt="track" className="w-full h-full object-contain hover:cursor-pointer rounded-md" onClick={() => navigate(`/playlist/${playlist.PlaylistID}`)} />
                                <FontAwesomeIcon icon={faPlay} className="absolute hidden lg:block lg:left-10 lg:top-10 lg:size-12 opacity-0 group-hover:opacity-45 transition-all" onClick={() => navigate(`/playlist/${playlist.PlaylistID}`)} />
                            </div>
                            <p className="overflow-hidden h-12 text-center w-28">{playlist.PlaylistName}</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    </>
}