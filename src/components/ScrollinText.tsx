import { useEffect, useState } from "react";

interface Props {
    text: string;
    className: string;
    trigger: any;
}

export default function ScrollingText(props: Props) {

    const [uniqueId] = useState(() => crypto.randomUUID());

    useEffect(() => {
        const textElement = document.getElementById(uniqueId);
        if (textElement) {
            const container = textElement.parentElement;

            if (textElement.scrollWidth > container!.clientWidth) {
                container!.classList.remove("justify-center");
                container!.classList.add("justify-start");
                container!.classList.add("scroll");
            } else {
                container!.classList.remove("justify-start");
                container!.classList.remove("scroll");
                container!.classList.add("justify-center");
            }
        }
    }, [props.trigger]);

    return <>
        <div className={props.className.concat(" flex overflow-hidden whitespace-nowrap")}>
            <p id={uniqueId} className="w-fit inline-block">{props.text}</p>
        </div>
    </>
}