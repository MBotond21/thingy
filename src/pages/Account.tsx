import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { useNavigate } from "react-router";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import imageCompression from "browser-image-compression";

export default function Account() {

    const { user, profile, update, streamPic } = useContext(AuthContext);
    const [pfp, setPfp] = useState<string>('');
    const navigate = useNavigate();
    const [newDesc, setNewDesc] = useState<string>(user?.Description || "");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [imageBlob, setImageBlob] = useState<Blob | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            await profile();
        }
        setIsLoading(true);
        load();
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (user) {
            if (user.Pfp) {
                setNewDesc(user.Description? user.Description: "");
                const url = URL.createObjectURL(user.Pfp);
                setPfp(url);

                return () => URL.revokeObjectURL(url);
            } else {
                setPfp('default.png');
            }
        } else {
            if(!isLoading) navigate('/login');
        }
    }, [user]);

    useEffect(() => {
        if(!isLoading){
            if (isEditing === false && newDesc != user?.Description && confirm("Are you sure you want to save the edit?")) {
                console.log("update");
                update(newDesc);
            } else {
                setNewDesc(user?.Description ? user.Description : "");
            }
        }
    }, [isEditing])

    const handleFileChange = async (event: any) => {
        const file = event.target.files[0];

        if(file) {
            streamPic(file);
        }

        // if (file) {

        //     const options = {
        //         maxSizeMB: 0.05,
        //         maxWidthOrHeight: 300,
        //         useWebWorker: true,
        //     };

        //     try {
        //         let compressed = await imageCompression(file, options);

        //         // while (compressed.size / 1024 > maxSizeKB) {
        //         //     compressed = await imageCompression(compressed, {
        //         //       ...options,
        //         //       maxSizeMB: (compressed.size / 1024 / 1024) * 0.9,
        //         //     });
        //         //   }

        //         // streamPic(compressed);

        //         // const blob = new Blob([compressed], { type: compressed.type });
        //         // setImageBlob(blob);
        //     } catch { console.log("Error during compression"); }

        //     // Optional: Create a preview URL for the image
        //     // const url = URL.createObjectURL(blob);
        //     // setPreviewUrl(url);
        // }
    };

    // useEffect(() => {
    //     if (imageBlob) {
    //         update(undefined, imageBlob);
    //     }
    // }, [imageBlob]);

    return <>
        <main>
            <div className="flex bg-222 rounded-lg w-full h-full columns-2 col mt-6 text-white gap-2 p-4 md:p-10 xxl:p-14 transition-all tsm scrollbar-hidden">
                <div className="flex flex-row w-full">
                    <label htmlFor="upload" className="inline-block relative size-36 md:size-72 rounded-full shadow-lg cursor-pointer group">
                        <img src={pfp} alt="pfp" className="w-full h-full rounded-full" />
                        <FontAwesomeIcon icon={faPen} className="absolute size-14 top-29 left-29 opacity-0 shadow-lg group-hover:opacity-45 transition-all" />
                    </label>
                    <input type="file" accept="image/*" onChange={handleFileChange} id="upload" className="hidden" />
                    <div className="flex flex-col p-4">
                        <h1 className="text-xl md:text-2xl font-bold">{user?.Username}</h1>
                        <h1 className="text-xl md:text-2xl font-bold">{user?.Email}</h1>
                        <div className="flex flex-row m-2 items-center justify-center group gap-2">
                            <button onClick={() => setIsEditing(true)}>
                                <FontAwesomeIcon icon={faPen} className="hover:cursor-pointer" />
                            </button>

                            <input
                                type="text"
                                className={`size-fit border-white bg-gray-333 border-2 p-2 text-white rounded-lg ${isEditing ? "block" : "hidden"}`}
                                onChange={(e) => setNewDesc(e.target.value)}
                                value={newDesc}
                                onFocus={() => setIsEditing(true)}
                                onBlur={() => setIsEditing(false)}
                                size={newDesc.length || 10}
                            />

                            {!isEditing && (
                                <p className="cursor-text">
                                    {newDesc || "description..."}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </>
}