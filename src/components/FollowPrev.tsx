import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDot, faDotCircle } from "@fortawesome/free-solid-svg-icons";
import { Followed } from "../followed";

interface Props {
    follow: Followed;
}

export default function FollowPrev(props: Props) {

    const navigate = useNavigate();

    return <>
        <div className="flex flex-row gap-2 w-[95%] ml-auto mr-auto text-white items-center hover:cursor-pointer rounded-md p-2 pr-8 hover:bg-gray28 hover:shadow-lg mt-8 -mb-8 group" onClick={() => navigate(`${props.follow.Type.toLowerCase()}/${props.follow.TypeID ? props.follow.TypeID : props.follow.PlaylistID}`)}>
            <img src={'/playlist_cover.png'} alt="playlistPic" className="size-14 rounded-sm" />
            <div className="flex flex-col">
                <p>{props.follow.FollowedID}</p>
                <p className="text-white-kinda text-sm">{props.follow.Type} ¤ Name</p>
            </div>
        </div>
    </>
}