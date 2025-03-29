import { useNavigate } from "react-router";

interface Props {
    img: string;
    artist_id: string;
    artist: string;
    name?: string;
    onClick: (event: React.MouseEvent) => void;
}

export default function SearchItemPrev(props: Props) {

    const navigate = useNavigate();

    return <>
        <div className={`flex relative flex-row gap-2 w-full text-white items-center hover:cursor-pointer rounded-md p-2 pr-8 hover:shadow-lg hover:bg-gray28`} onClick={props.onClick} >
            <img src={props.img.length > 0? props.img: "/default.png"} alt="playlistPic" className="size-14 rounded-sm" />
            <div className="flex flex-col">
                {props.name && <p>{props.name}</p>}
                <p className="text-gray-300 hover:text-white hover:underline transition-all" onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/artist/${props.artist_id}`);
                }}>{props.artist}</p>
            </div>
        </div>
    </>
}