import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDot, faDotCircle } from "@fortawesome/free-solid-svg-icons";
import { Followed } from "../followed";
import { useContext, useEffect, useState } from "react";
import { MusicContext } from "../contexts/MusicContext";

interface Props {
    follow: Followed;
}

export default function FollowPrev(props: Props) {

    const navigate = useNavigate();
    const { resolveFollowItem } = useContext(MusicContext);
    const [item, setItem] = useState<{ name: string, image: string, owner: string }>();

    useEffect(() => {
        const load = async () => {
            const i = await resolveFollowItem(props.follow);
            if (i) {
                setItem(i);
            }
        }
        load();
    }, []);

    return <>
        <div className="flex flex-row gap-2 w-[95%] ml-auto mr-auto text-white items-center hover:cursor-pointer rounded-md p-2 pr-8 hover:bg-gray28 hover:shadow-lg mt-8 -mb-8 group" onClick={() => navigate(`${props.follow.Type.toLowerCase()}/${props.follow.TypeID ? props.follow.TypeID : props.follow.PlaylistID}`)}>
            {
                item && (
                    <>
                        <img src={item.image} alt="playlistPic" className="size-14 rounded-sm" />
                        <div className="flex flex-col">
                            <p>{item.name}</p>
                            <p className="text-white-kinda text-sm">{props.follow.Type} ¤ {item.owner}</p>
                        </div>
                    </>
                )
            }
        </div>
    </>
}