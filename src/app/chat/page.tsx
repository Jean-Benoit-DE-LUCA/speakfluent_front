"use client";

import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { ConfigContext, DataUserContext, UserContext } from "../layout";

import pickUp from "../../../public/assets/pictures/phone-call.svg";
import hangUp from "../../../public/assets/pictures/phone-block.svg";

export default function Chat() {

    const configContext = useContext(ConfigContext);
    const userContext = useContext(UserContext);
    const dataUserContext = useContext(DataUserContext);

    const [localStream, setLocalStream] = useState<any>("");

    console.log(userContext);
    console.log(configContext);




    // START VIDEO CALL //

    const handlePickUpCall = (e: React.MouseEvent<HTMLButtonElement>) => {

        const localVideo = (document.getElementsByClassName("video--chat--local")[0] as HTMLVideoElement);

        console.log(e.currentTarget);
        navigator.mediaDevices.getUserMedia({video: true, audio: true})
        
        .then(stream => {
            setLocalStream(stream);
            localVideo.srcObject = stream;
        })
    };

    console.log(localStream);

    useEffect(() => {
        const userCookie = JSON.parse(document.cookie.replace("user=", ""));
        dataUserContext.setUser(userCookie);
    }, []);

    console.log(userContext);

    return (
        <main className="main main--video--chat">

            <div className="main--register--slogan video--chat">
                <span className="main--register--slogan--span1">Private chat<br /></span>
                <span className="main--register--slogan--span2">between<br /></span>
                <span className="main--register--slogan--span3">Jean-Benoit and Naiara</span>
            </div>

            <article className="video--chat--wrap">

                <video className="video--chat--local" autoPlay></video>
                <video className="video--chat--remote" autoPlay></video>

                <div className="video--chat--buttons">

                    <div className="video--chat--pickup--hangup--div">

                        <button className="video--chat--pickup--button" onClick={handlePickUpCall}>
                            <Image
                                className="video--chat--pickup--img"
                                alt="pick-up-phone"
                                src={pickUp}
                                width={15}
                                height={15}
                                unoptimized
                            />
                        </button>

                        <button className="video--chat--hangup--button">
                            <Image
                                className="video--chat--hangup--img"
                                alt="hang-up-phone"
                                src={hangUp}
                                width={15}
                                height={15}
                                unoptimized
                            />
                        </button>

                    </div>
                </div>

            </article>
            
        </main>
    );
}