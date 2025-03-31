import { useContext, useEffect, useState } from "react";
import { TrackContext } from "../contexts/MusicContext";
import { Album } from "../album";
import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import ScrollingText from "../components/ScrollinText";

export default function Artist() {

    const { artist, loadArtist, active } = useContext(TrackContext);
    const { user, follow, unfollow } = useContext(AuthContext);
    const { id } = useParams();
    const [followed, setFollowed] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (id) loadArtist(id);
    }, [])

    useEffect(() => {
        if (id) loadArtist(id);
        const art = user?.Followed.filter((o) => o.TypeID == (+artist!.id));
        if (art) setFollowed(true);
        else setFollowed(false);
    }, [id])

    useEffect(() => {
        if (user && artist) {
            const art = user.Followed.filter((o) => o.TypeID == (+artist!.id));
            if (art) setFollowed(true);
            else setFollowed(false);
        }
    }, [user, artist])

    const handleClick = (data: Album) => {
        navigate(`/album/${data.id}`);
    }

    const handleFollow = () => {
        if (followed) {
            const followed = user!.Followed.filter((o) => o.TypeID == (+artist!.id));
            followed.map((o) => {
                unfollow(o.FollowedID);
            })
            setFollowed(false);
        }
        else {
            follow(+artist!.id, "Artist");
            setFollowed(true);
        }
    }

    return <>
        {
            artist ? (
                <div className={`${active == "info" ? "flex" : "hidden lg:flex"} lg:flex h-[75vh] md:h-[80vh] xxl:h-[85vh] w-full flex-col pt-8 pr-8 pl-8 gap-10 bg-222 rounded-lg overflow-hidden`}>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <img src={artist?.image} alt="albumPic" className="size-64 md:size-72 object-cover" />
                        <div className="flex flex-col">
                            <h1 className="text-4xl font-semibold">{artist?.name}</h1>
                            <p className="text-xl">
                                {artist?.name}, {artist?.albums?.length}{" "}
                                {artist?.albums?.length === 1 ? "album" : "albums"},{" "}
                            </p>
                            {user && <button className="px-2 py-1 bg-white rounded-full w-fit text-black mt-4 ml-auto mr-auto hover:bg-white-kinda transition-all" onClick={() => handleFollow()}>{followed ? "unfollow" : "follow"}</button>}
                        </div>
                    </div>
                    <div className="flex flex-row gap-10 overflow-scroll scrollbar-hidden mt-auto mb-9">
                        {artist?.albums?.map((album) => (
                            <div key={album.id} className="flex flex-col items-center">
                                <div className="w-32 h-32 flex-shrink-0">
                                    <img src={album.image} alt="track" className="w-full h-full object-contain hover:cursor-pointer" onClick={() => handleClick(album)} />
                                </div>
                                <ScrollingText text={album.name} className="w-24" trigger={album} />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="w-full h-4/5 flex items-center justify-center">
                    <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                </div>
            )
        }
    </>
}