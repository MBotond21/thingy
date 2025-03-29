import { useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { useNavigate } from "react-router";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Account() {

    const { user, profile, update, streamPic } = useContext(AuthContext);
    const [pfp, setPfp] = useState<string>('');
    const navigate = useNavigate();
    const [newDesc, setNewDesc] = useState<string>(user?.Description || "");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const load = async () => {
            await profile();
        }
        setIsLoading(true);
        load();
        handleInput();
        setIsLoading(false);

    }, []);

    useEffect(() => {
        if (user) {
            if (user.Pfp) {
                setNewDesc(user.Description ? user.Description : "");
                const url = URL.createObjectURL(user.Pfp);
                setPfp(url);

                return () => URL.revokeObjectURL(url);
            } else {
                setPfp('default.png');
            }
        } else {
            if (!isLoading) navigate('/login');
        }
    }, [user]);

    useEffect(() => {
        if (!isLoading) {
            handleInput();
            if (isEditing === false && newDesc != user?.Description && confirm("Are you sure you want to save the edit?")) {
                console.log("update");
                update(newDesc);
            } else {
                setNewDesc(user?.Description ? user.Description : "");
            }
        }
    }, [isEditing]);

    const handleFileChange = async (event: any) => {
        const file = event.target.files[0];

        if (file) {
            streamPic(file);
        }
    };

    const MAX_HEIGHT = 500;
    const MAX_WIDTH = 600;
    const MIN_WIDTH = 100;

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

    return <>
        <div className="flex bg-222 rounded-lg w-full h-[85vh] columns-2 text-white gap-2 p-4 md:p-10 xxl:p-14 transition-all tsm scrollbar-hidden mt-auto mb-auto">
            <div className="flex flex-row w-full">
                <label htmlFor="upload" className="inline-block relative size-32 md:size-72 rounded-full shadow-lg cursor-pointer group">
                    <img src={pfp} alt="pfp" className="w-full h-full rounded-full" />
                    <FontAwesomeIcon icon={faPen} className="absolute size-7 md:size-14 top-16 left-16 md:top-29 md:left-29 opacity-0 shadow-lg group-hover:opacity-45 transition-all" />
                </label>
                <input type="file" accept="image/*" onChange={handleFileChange} id="upload" className="hidden" />
                <div className="flex flex-col p-4">
                    <h1 className="text-lg md:text-2xl font-bold">{user?.Username}</h1>
                    <h1 className="text-lg md:text-2xl font-bold">{user?.Email}</h1>
                    <div className="flex flex-row m-2 items-center justify-center group gap-2">
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
                            <p className="cursor-text text-lg max-w-[30vw] max-h-[30vh] overflow-y-scroll break-words scrollbar-hidden">
                                {newDesc || "description..."}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </>
}