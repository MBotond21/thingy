import { useContext, useEffect, useRef, useState } from "react";
import { Playlist } from "../playlist"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPen } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { Track } from "../track";
import { MusicContext } from "../contexts/MusicContext";
import { ApiContext } from "../contexts/ApiContext";

interface Props {
    playlist: Playlist;
}

export default function PlaylistInfo(props: Props) {

    const playlist = props.playlist;
    const [pic, setPic] = useState<string>('');
    const navigate = useNavigate();
    const { setCurrentTrackFR, setQueue } = useContext(MusicContext);
    const { user, updatePlaylist, follow, unfollow } = useContext(ApiContext);
    const owned = (playlist.OwnerID == user?.Id);

    const likedP = (user?.Playlists[0].PlaylistID == playlist.PlaylistID);

    const [newDesc, setNewDesc] = useState<string>(playlist.Description || "");
    const [newName, setNewName] = useState<string>(playlist.PlaylistName);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [followed, setFollowed] = useState<boolean>(false);
    const [prvt, setPrvt] = useState<boolean>(playlist.Private);

    useEffect(() => {
        setIsLoading(true);

        if (playlist.PlaylistCover) {
            const url = URL.createObjectURL(playlist.PlaylistCover);
            setPic(url);
            setIsLoading(false);
            return () => URL.revokeObjectURL(url);
        } else {
            setPic('/playlist_cover.png');
        }

        if(user?.Follows){
            const followed = user!.Follows.filter((o) => o.PlaylistID == playlist.PlaylistID);
            if(followed.length > 0) setFollowed(true);
        }

        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (playlist) setNewName(playlist.PlaylistName);
    }, [playlist])

    useEffect(() => {
        if (user && playlist) {
            const isFollowing = user.Follows.some((o) => o.PlaylistID === playlist.PlaylistID);
            setFollowed(isFollowing);
        } else {
            setFollowed(false);
        }
    }, [playlist, user]);

    const handleClicked = (track: Track) => {
        setCurrentTrackFR(track);
        setQueue(playlist.Tracks!);
    }

    const MAX_HEIGHT = 500;
    const MAX_WIDTH = 600;
    const MIN_WIDTH = 100;

    useEffect(() => {
        if (!isLoading) {
            handleInput();

            if (isEditing == false && newDesc != playlist.Description && confirm("Are you sure you want to save the edit?")) {
                updatePlaylist(playlist.PlaylistID, { Description: newDesc });
            } else {
                setNewDesc(playlist.Description ? playlist.Description : "");
            }
        }
    }, [isEditing]);

    const handleInput = () => {
        if (textareaRef.current && spanRef.current) {
            const textarea = textareaRef.current;
            const span = spanRef.current;

            span.textContent = textarea.value || " ";

            textarea.style.height = "auto";

            const newHeight = Math.min(textarea.scrollHeight, MAX_HEIGHT);
            const newWidth = Math.min(span.offsetWidth + 20, MAX_WIDTH);

            textarea.style.height = `${newHeight}px`;
            textarea.style.width = `${Math.max(newWidth, MIN_WIDTH)}px`;
        }
    };

    const handleFileChange = async (event: any) => {
        const file = event.target.files[0];

        if (file) {
            updatePlaylist(playlist.PlaylistID, { PlaylistCover: file })
        }
    };

    const handleFollow = () => {
        if(followed){
            const followed = user!.Follows.filter((o) => o.PlaylistID == playlist.PlaylistID);
            followed.map((o) => {
                unfollow(o.FollowedID);
            })
        }
        else {
            follow(playlist.PlaylistID, "Playlist");
        }
    }

    const handlePrivateUpdate = () => {
        setPrvt((prev) => {
            const newValue = !prev;
            updatePlaylist(playlist.PlaylistID, { Private: newValue });
            return newValue;
        });
    }

    return <>
        <div className="flex flex-col gap-4 pl-8 pr-8 items-center lg:flex-row">
            <img src={pic} alt="PlaylistPic" className={`${!owned || likedP ? "size-52 lg:size-72 object-cover rounded-md" : "hidden"}`} />
            <label htmlFor="upload" className={`${owned && !likedP ? "inline-block relative size-32 md:size-72 rounded-md shadow-lg cursor-pointer group" : "hidden"}`}>
                <img src={pic} alt="pfp" className="size-full object-cover rounded-md" />
                <FontAwesomeIcon icon={faPen} className="absolute size-7 md:size-14 top-16 left-16 md:top-29 md:left-29 opacity-0 shadow-lg group-hover:opacity-45 transition-all" />
            </label>
            <input type="file" accept="image/*" onChange={handleFileChange} id="upload" className="hidden" />
            <div className="flex flex-col below-lg:relative">
                <div className={`${owned && !likedP ? "flex flex-row m-2 items-center justify-start group gap-1" : "hidden"}`}>
                    <button onClick={() => setIsEditingName(!isEditingName)}>
                        <FontAwesomeIcon icon={faPen} className="hover:cursor-pointer size-5" />
                    </button>

                    <div className="relative w-fit">
                        <input
                            value={newName}
                            type="text"
                            maxLength={24}
                            onChange={(e) => { setNewName(e.target.value); handleInput(); }}
                            className={`border-white bg-gray-333 border-2 p-2 text-white rounded-lg ${isEditingName ? "block" : "hidden"} transition-all duration-200 ease-in-out`}
                            onFocus={() => setIsEditingName(true)}
                            onBlur={() => setIsEditingName(false)}
                        />
                    </div>

                    {!isEditingName && (
                        <h1 className="text-4xl font-semibold">
                            {newName}
                        </h1>
                    )}
                </div>
                <h1 className={`${!owned || likedP ? "text-4xl font-semibold" : "hidden"}`}>{playlist.PlaylistName}</h1>
                <p className="text-lg lg:text-xl">
                    <span className="hover:cursor-pointer hover:underline font-bold" onClick={() => { if(!owned) navigate(`/accounts/${playlist.OwnerID}`); }}>{playlist.Owner!.Username}</span>, {playlist.Tracks?.length}{" "}
                    {playlist.Tracks?.length === 1 ? "track" : "tracks"},{" "}
                    {playlist.Tracks?.reduce((sum, obj) => sum + obj.duration, 0)} sec
                </p>
                <div className={`${owned && !likedP ? "flex flex-row m-2 items-center justify-start group gap-2" : "hidden"}`}>
                    <button onClick={() => setIsEditing(!isEditing)}>
                        <FontAwesomeIcon icon={faPen} className="hover:cursor-pointer" />
                    </button>

                    <div className="relative w-fit">
                        <span
                            ref={spanRef}
                            className="absolute invisible whitespace-pre p-2"
                        ></span>

                        <textarea
                            ref={textareaRef}
                            value={newDesc}
                            onChange={(e) => { setNewDesc(e.target.value); handleInput(); }}
                            className={`resize-none border-white bg-gray-333 border-2 p-2 text-white rounded-lg ${isEditing ? "block" : "hidden"} transition-all duration-200 ease-in-out`}
                            rows={1}
                            onFocus={() => setIsEditing(true)}
                            onBlur={() => setIsEditing(false)}
                            style={{ minWidth: `${MIN_WIDTH}px` }}
                        />
                    </div>

                    {!isEditing && (
                        <p className="cursor-text text-lg max-w-[30vw]">
                            {newDesc || "description..."}
                        </p>
                    )}
                </div>
                <p className={`${!owned || likedP ? "text-xl lg:text-2xl" : "hidden"}`}>{playlist.Description}</p>
                {!owned && user && <button className="px-2 py-1 bg-white rounded-full w-fit text-black mt-4 ml-auto mr-auto hover:bg-white-kinda transition-all" onClick={() => handleFollow()}>{followed? "unfollow": "follow"}</button>}
            </div>
            {owned && user && !likedP && <button className="px-2 py-1 rounded-full w-fit mt-4 ml-auto mb-auto hover:border-white-kinda border-2 transition-all below-lg:absolute below-lg:right-4 below-lg:top-4" onClick={() => handlePrivateUpdate()}>{prvt? "private": "public"}</button>}
        </div>
        <div className="flex flex-row gap-10 overflow-scroll mt-auto pl-8 pr-8 pb-8 scrollbar-hidden">
            {playlist.Tracks?.map((track) => (
                <div className="flex flex-col items-center" key={crypto.randomUUID()}>
                    <div className="w-20 h-20 lg:w-32 lg:h-32 flex-shrink-0 relative group" onClick={() => handleClicked(track)}>
                        <img src={track.image} alt="track" className="w-full h-full object-contain hover:cursor-pointer" />
                        <FontAwesomeIcon icon={faPlay} className="absolute hidden lg:block lg:left-10 lg:top-10 lg:size-12 opacity-0 group-hover:opacity-45 transition-all" />
                    </div>
                    {/* <p className="overflow-hidden h-12 text-center w-28">{track.name}</p> */}
                    <div className="flex mt-1 mr-auto ml-auto w-28 overflow-hidden whitespace-nowrap scroll">
                        <p className="w-fit inline-block">{track.name}</p>
                    </div>
                </div>
            ))}
        </div>
    </>
}