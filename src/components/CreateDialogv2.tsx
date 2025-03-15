import { faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Props {
    caption: string;
    close: () => void;
}

export const CreateDialogv2: React.FC<{ children: React.ReactNode, props: Props }> = ({ children, props }) => {
    return <>
        <div className="fixed inset-0 z-40 bg-black opacity-25" onClick={props.close}></div>
        <div className="absolute z-50 w-full h-full top-0 left-0 flex items-center justify-center overflow-hidden">
            <div className="flex flex-col bg-gray222 rounded-lg w-full h-9/10 md:w-1/3 md:h-9/10 text-white absolute z-50 shadow-lg">
                <div className="flex flex-row w-full h-fit bg-gray-18 items-center justify-between pt-2 pb-2">
                    <div className="flex-1 flex justify-center">
                        <h1 className="text-2xl font-bold">{props.caption}</h1>
                    </div>
                    <button className="hover:bg-gray28 p-2 transition-all flex items-center justify-center" onClick={props.close}>
                        <FontAwesomeIcon icon={faX} className="size-4" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    </>
}