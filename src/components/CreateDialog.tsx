import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX } from "@fortawesome/free-solid-svg-icons"
import { useContext, useState } from "react";
import imageCompression from "browser-image-compression";
import { AuthContext } from "../contexts/AuthContext";

interface Props {
    close: () => void;
}

export default function CreateDialog(props: Props) {

    const { createPlaylist } = useContext(AuthContext)

    const [name, setName] = useState<string>("");
    const [desc, setDesc] = useState<string>("");
    const [cover, setCover] = useState<Blob>();
    const [priv, setPriv] = useState<boolean>(false);

    const handleFileChange = async (event: any) => {
        const file = event.target.files[0];

        if (file) {

            const options = {
                maxSizeMB: 0.05,
                maxWidthOrHeight: 300,
                useWebWorker: true,
            };

            try {
                let compressed = await imageCompression(file, options);

                const blob = new Blob([compressed], { type: compressed.type });
                setCover(blob);
            } catch { console.log("Error during compression"); }

        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const pic = await cover?.arrayBuffer();
        await createPlaylist(name, priv, desc, pic);
        props.close();
    }

    return <>
        <div className="flex flex-col bg-gray222 rounded-lg w-full h-9/10 md:w-1/3 md:h-9/10 text-white absolute z-50 shadow-lg">
            <div className="flex flex-row w-full h-fit bg-gray-18 items-center justify-between pt-2 pb-2">
                <div className="flex-1 flex justify-center">
                    <h1 className="text-2xl font-bold">Playlist</h1>
                </div>
                <button className="hover:bg-gray28 p-2 transition-all flex items-center justify-center" onClick={props.close}>
                    <FontAwesomeIcon icon={faX} className="size-4" />
                </button>
            </div>
            <form className="p-4 flex flex-col gap-12 text-lg h-full items-center">
                <div className="flex felx-row gap-2 mt-20 w-full items-center justify-between">
                    <label htmlFor="name">Name: </label>
                    <input type="text" name="name" className="rounded-lg p-1 w-3/5 border-2 outline-none transition-all bg-333 border-white focus:border-yellow-400 text-white" onChange={(e) => setName(e.target.value)} required/>
                </div>
                <div className="flex felx-row gap-2 w-full items-center justify-between">
                    <label htmlFor="desc">Description: </label>
                    <input type="text" name="desc" className="rounded-lg p-1 w-3/5 border-2 outline-none transition-all bg-333 border-white focus:border-yellow-400 text-white" onChange={(e) => setDesc(e.target.value)} />
                </div>
                <div className="flex felx-row gap-2 w-full items-center justify-between">
                    <label htmlFor="cover">Cover: </label>
                    <input type="file" name="cover" onChange={(e) => handleFileChange(e)} />
                </div>
                <div className="flex felx-row gap-2 w-full items-center">
                    <label htmlFor="private">Private: </label>
                    <input type="checkbox" name="private" onChange={(e) => setPriv(e.target.checked)} />
                </div>
                <button type="submit" className="bg-white text-gray222 font-semibold w-fit p-1 rounded-md hover:bg-white-kinda" onClick={(e) => handleSubmit(e)}>Create</button>
            </form>
        </div>
    </>

}