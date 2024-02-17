"use client";

import Image from "next/image";
import { useSearchParams, redirect, useRouter, usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ConfigContext, DataUserContext, SocketContext, UserContext } from "../main";

import pickUp from "../../../public/assets/pictures/phone-call.svg";
import hangUp from "../../../public/assets/pictures/phone-block.svg";

import disconnectImg from "../../../public/assets/pictures/disconnect-img.svg";
import connectImg from "../../../public/assets/pictures/connect-img.svg";

import Loader from "../../../components/Loader/page";

export default function Chat() {

    const configContext = useContext(ConfigContext);
    const userContext = useContext(UserContext);
    const dataUserContext = useContext(DataUserContext);
    const socketContext = useContext(SocketContext);

    const router = useRouter();

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const chat_id = searchParams.get("pv");

    const gen_chat_id = searchParams.get("gen");
    

    const [isAudio, setIsAudio] = useState<boolean>(true);


    //let socket = new WebSocket("ws://localhost:8081");


    const [chatData, setChatData] = useState<any>({
        data: {

        },
        jwt: false
    });
    const [count, setCount] = useState<number>(0);





    // FETCH PRIVATE CHAT DATA //

    const fetchPrivateChatData = async () => {

        const errorElement = (document.getElementsByClassName("error--element")[0] as HTMLElement);
        const spanErrorElement = (document.getElementsByClassName("error--element--span")[0] as HTMLSpanElement);


        // PRIVATE CHAT //
        if (gen_chat_id == undefined) {

            const response = await fetch(`${configContext.hostname}/api/userchatpassword/get/id/${chat_id}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${userContext.jwt}`
                }
            });
    
            const responseData = await response.json();
            
            return responseData;
        }

        

        // GENERAL CHAT //
        else if (gen_chat_id !== undefined) {

            const response = await fetch(`${configContext.hostname}/api/userchatpassword/get/general/id/${gen_chat_id}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${userContext.jwt}`
                }
            });

            const responseData = await response.json();

            

            if (responseData.jwt !== false) {


                // if user connected is user registered on general chat (user_id or user_receive) //

                if ((responseData.data.user_id == userContext.id ||
                    responseData.data.user_receive == userContext.id)
                    &&
                    (responseData.data.user_id !== null &&
                    responseData.data.user_receive !== null)
                    ) { 

                    const responseGetDataUser = await fetch(`${configContext.hostname}/api/userchatpassword/get/id/${gen_chat_id}`, {
                        method: "GET",
                        headers: {
                            "Content-type": "application/json",
                            "Authorization": `Bearer ${userContext.jwt}`
                        }
                    });
            
                    const responseGetDataUserData = await responseGetDataUser.json();

                    // if two users connected on general chat private -> new render of component -> send data to socket an refresh //

                    socketContext.socket.send(JSON.stringify({
                        responseGetDataUserData: responseGetDataUserData
                    }));

                    return responseGetDataUserData;
                    
                }

                else {

                    return responseData;
                }
            }

            else {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
    
                errorElement.classList.add("active");
                spanErrorElement.textContent = "Authentication error, you must logout and login again";
    
                setTimeout(() => {
                    errorElement.classList.remove("active");
                    router.push("/");
                }, 2500);
            }
        }
    };



    // ONCHANGE INPUT MUTE //

    const handleChangeInputMute = async (e: React.ChangeEvent<HTMLInputElement>) => {

        if (localStream !== undefined) {

            if (e.target.checked) {
                localStream.getAudioTracks()[0].enabled = false;
            }

            else if (!e.target.checked) {
                localStream.getAudioTracks()[0].enabled = true;
            }
        }


        else if (localStream == undefined) {

            if (e.target.checked) {
                setIsAudio(false);
            }

            else if (!e.target.checked) {
                setIsAudio(true);
            }
        }
    };



    // HANG UP CALL //

    const handleHangUpCall = async () => {

        const localVideo = (document.getElementsByClassName("video--chat--local")[0] as HTMLVideoElement);
        const localVideoImg = (document.getElementsByClassName("video--chat--connect--img")[0] as HTMLImageElement);

        
        try {
            localStream.getAudioTracks()[0].stop();
            localStream.getVideoTracks()[0].stop();

            (localStream as any) = undefined;
        }
        catch (e) {
            
        }

        localVideoImg.classList.remove("active");
        localVideo.srcObject = null;



        let chat_id_sender: any = null;

        // set chat_id_sender to check if chatroom other OK //
        gen_chat_id == null ? chat_id_sender = chat_id : chat_id_sender = gen_chat_id;

        socketContext.socket.send(JSON.stringify({
            endCall: true,
            chat_id_sender: chat_id_sender
        }));
    }

    // START VIDEO CALL //

    let peerConnection: RTCPeerConnection;
    let localStream: MediaStream;

    const handlePickUpCall = async (e: React.MouseEvent<HTMLButtonElement>) => {

        const errorElement = (document.getElementsByClassName("error--element")[0] as HTMLElement);
        const spanErrorElement = (document.getElementsByClassName("error--element--span")[0] as HTMLSpanElement);

        let isRegistered = false;

        // if general chat //

        if (gen_chat_id !== null) {

            try {

                const response = await fetch(`${configContext.hostname}/api/userchatpassword/get/general/id/${gen_chat_id}`, {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${userContext.jwt}`
                    }
                });

                const responseData = await response.json();


                if (responseData.data.user_id == userContext.id ||
                    responseData.data.user_receive == userContext.id) {

                        isRegistered = true;
                    }
            }

            catch (e) {

                isRegistered = false;
            }
        }

        // if private chat //

        else if (chat_id !== null) {

            try {

                const response = await fetch(`${configContext.hostname}/api/userchatpassword/get/id/${chat_id}`, {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${userContext.jwt}`
                    }
                });
        
                const responseData = await response.json();
    
                if (responseData.data.user_chat_password_user_id == userContext.id ||
                    responseData.data.user_chat_password_user_receive == userContext.id) {

                    isRegistered = true;
                }
            }

            catch (e) {

                isRegistered = false;
            }
        }

        // if user actually registered to the chat //

        if (isRegistered) {

            if (peerConnection !== undefined) {

                peerConnection.close();
            }

            const configuration = {"iceServers": [{"urls": "stun:stun.l.google.com:19302"}]};
            peerConnection = new RTCPeerConnection(configuration);

            localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});

            const localVideo = (document.getElementsByClassName("video--chat--local")[0] as HTMLVideoElement);
            const localVideoImg = (document.getElementsByClassName("video--chat--connect--img")[0] as HTMLImageElement);

            // remove picture connect + send websocket //

            localVideoImg.classList.add("active");

            let chat_id_sender: any = null;


            // set chat_id_sender to check if chatroom other OK //
            gen_chat_id == null ? chat_id_sender = chat_id : chat_id_sender = gen_chat_id;


            socketContext.socket.send(JSON.stringify({
                remoteConnected: true,
                chat_id_sender: chat_id_sender
            }));



            localVideo.srcObject = localStream;

            localStream.getTracks().forEach( track => {

                peerConnection.addTrack(track, localStream);
            })


            
            // check if mute on init //

            localStream.getAudioTracks()[0].enabled = isAudio;




            // track listener //

            peerConnection.addEventListener("track", async (e) => {

                const remoteVideo = (document.getElementsByClassName("video--chat--remote")[0] as HTMLVideoElement);

                const remoteVideoImgWait = (document.getElementsByClassName("video--chat--connect--img--wait")[1] as HTMLImageElement);

                const [remoteStream] = e.streams;
                remoteVideo.srcObject = remoteStream;

                remoteVideoImgWait.classList.remove("active");
            });





            // ICE candidate listener //

            peerConnection.addEventListener("icecandidate", (e) => {

                if (e.candidate) {

                    socketContext.socket.send(JSON.stringify({
                        iceCandidate: e.candidate,
                        chat_id_sender: chat_id_sender
                    }));
                }
            });



            // create offer //

            const offer = await peerConnection.createOffer({offerToReceiveAudio: true, offerToReceiveVideo: true});
            await peerConnection.setLocalDescription(offer);

            socketContext.socket.send(JSON.stringify({
                offer: offer,
                chat_id_sender: chat_id_sender
            }));

        }

        else if (!isRegistered) {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            errorElement.classList.add("active");
            spanErrorElement.textContent = "You are disconnected, you have to create a new chat room";

            setTimeout(() => {
                errorElement.classList.remove("active");
            }, 2500);
        }

    };





    //

    useEffect(() => {

        if (sessionStorage.getItem("user") == null) {

            const errorElement = (document.getElementsByClassName("error--element")[0] as HTMLElement);
            const spanErrorElement = (document.getElementsByClassName("error--element--span")[0] as HTMLSpanElement);

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            errorElement.classList.add("active");
            spanErrorElement.textContent = "You must be logged and registered for this chat to access this area";

            setTimeout(() => {
                errorElement.classList.remove("active");
            }, 2500);

            redirect("/");
        }

        else if (sessionStorage.getItem("user") !== null) {

            dataUserContext.setUser(JSON.parse(sessionStorage.getItem("user") as string));
            setCount(count + 1);
        }

        
    }, []);


    useEffect(() => {

        let isUserChatRegistered: any = null;

        if (userContext !== null) {


            let result = async () => {

                if (userContext.jwt.length > 0) {

                    let result = await fetchPrivateChatData();

                    return result;
                }
            
            };

            const response = async () => {

                const responseData = await result();

                try {

                    if (responseData.jwt !== false) {

                        if ((responseData.data.hasOwnProperty("user_chat_password_user_id") &&
                             responseData.data.hasOwnProperty("user_chat_password_user_receive"))
                             &&
                            responseData.data.user_chat_password_user_id == userContext.id ||
                            responseData.data.user_chat_password_user_receive == userContext.id) {

                                isUserChatRegistered = true;

                                setChatData(responseData);
                        }

                        else if (
                            (responseData.data.hasOwnProperty("user_chat_password_user_id") &&
                             responseData.data.hasOwnProperty("user_chat_password_user_receive"))
                             &&
                            (responseData.data.user_chat_password_user_id !== userContext.id ||
                            responseData.data.user_chat_password_user_receive !== userContext.id)) {

                                isUserChatRegistered = false;
                            }

                        else if ((responseData.data.hasOwnProperty("user_id") && 
                                  responseData.data.hasOwnProperty("user_receive"))
                                 &&
                                 (responseData.data.user_id !== userContext.id &&
                                  responseData.data.user_receive !== userContext.id)) {

                                isUserChatRegistered = false;
                        }

                        else if (
                            (responseData.data.hasOwnProperty("user_id") && 
                             responseData.data.hasOwnProperty("user_receive"))
                             &&
                             (responseData.data.user_id == userContext.id ||
                              responseData.data.user_receive == userContext.id)
                        ) {

                            isUserChatRegistered = true;
                            setChatData(responseData);
                        }

                        return isUserChatRegistered;
                    }

                    else if (responseData.jwt == false) {

                        return false;
                    }
                }

                catch (e) {
                    
                }
                
            };

            const resultResponse = async () => {

                const responseResult = await response();

                if (responseResult == false) {

                    const errorElement = (document.getElementsByClassName("error--element")[0] as HTMLElement);
                    const spanErrorElement = (document.getElementsByClassName("error--element--span")[0] as HTMLSpanElement);
        
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
        
                    errorElement.classList.add("active");
                    spanErrorElement.textContent = "You can't access this room, please create another room";
        
                    setTimeout(() => {
                        errorElement.classList.remove("active");
                    }, 2500);

                    router.push("/");
                }
            };

            resultResponse();


        }

    }, [count]);







    // WEBsocketContext.socket //

    useEffect(() => {

        socketContext.socket.onopen = async (e) => {

        }

        


        // on message //

        socketContext.socket.onmessage = async (e) => {

            let data = null;

            try {
                
                data = JSON.parse(e.data)


                if (data.responseGetDataUserData) {

                    // if two users connected on general chat private -> new render of component //

                    setChatData(data.responseGetDataUserData);
                }
                
                if (data.answer) {

                    const remoteDescription = new RTCSessionDescription(data.answer);
                    await peerConnection?.setRemoteDescription(remoteDescription);

                }

                if (data.offer) {
                    
                    let idChat = null;

                    gen_chat_id == null ? idChat = chat_id : idChat = gen_chat_id;

                    if (data.chat_id_sender == idChat) {

                        peerConnection?.setRemoteDescription(new RTCSessionDescription(data.offer));
                        const answer = await peerConnection?.createAnswer();
                        await peerConnection?.setLocalDescription(answer);

                        socketContext.socket.send(JSON.stringify({
                            answer: answer
                        }));
                    }
                }

                if (data.iceCandidate) {

                    let idChat = null;

                    gen_chat_id == null ? idChat = chat_id : idChat = gen_chat_id;

                    if (data.chat_id_sender == idChat) {

                        try {

                            await peerConnection.addIceCandidate(data.iceCandidate);
                        }

                        catch (e) {

                        }
                    }
                }

                //

                if (data.remoteConnected) {

                    let idChat = null;

                    gen_chat_id == null ? idChat = chat_id : idChat = gen_chat_id;

                    if (data.chat_id_sender == idChat) {
                    
                        const remoteVideoImg = (document.getElementsByClassName("video--chat--connect--img")[1] as HTMLImageElement);

                        const remoteVideoImgWait = (document.getElementsByClassName("video--chat--connect--img--wait")[1] as HTMLImageElement);


                        remoteVideoImg.classList.add("active");
                        remoteVideoImgWait.classList.add("active");
                    }

                }

                if (data.endCall) {

                    let idChat = null;

                    gen_chat_id == null ? idChat = chat_id : idChat = gen_chat_id;

                    if (data.chat_id_sender == idChat) {

                        const remoteVideo = (document.getElementsByClassName("video--chat--remote")[0] as HTMLVideoElement);
                        const remoteVideoImg = (document.getElementsByClassName("video--chat--connect--img")[1] as HTMLImageElement);
                        const remoteVideoImgWait = (document.getElementsByClassName("video--chat--connect--img--wait")[1] as HTMLImageElement);

                        remoteVideo.srcObject = null;
                        remoteVideoImg.classList.remove("active");
                        remoteVideoImgWait.classList.remove("active");
                    }
                }

            }

            catch (e) {

            }


        }

        /*return () => {
            
            socketContext.socket.close();
        }*/

    });



    if ((!chatData.data.hasOwnProperty("user_id") ||
        !chatData.data.hasOwnProperty("user_receive"))
        &&
        (!chatData.data.hasOwnProperty("user_chat_password_user_id") ||
         !chatData.data.hasOwnProperty("user_chat_password_user_receive"))) {

        return <Loader />
    }

    else if (chatData.data.user_id == userContext.id ||
        chatData.data.user_receive == userContext.id ||
        chatData.data.user_chat_password_user_id == userContext.id ||
        chatData.data.user_chat_password_user_receive == userContext.id) {


        return (

            <main className="main main--video--chat">

                {chatData !== undefined && chatData.jwt !== false && chatData.data.user_send_firstname !== undefined && chatData.data.user_receive_firstname !== undefined ?
                    <div className="main--register--slogan video--chat">
                        <span className="main--register--slogan--span1">Private chat<br /></span>
                        <span className="main--register--slogan--span2">between<br /></span>
                        <span className="main--register--slogan--span3">
                        {chatData.data.user_send_firstname} and {chatData.data.user_receive_firstname}
                        </span>
                    </div>

                :
                    <>
                    </>
                }

                <article className="video--chat--wrap">

                    <div className="video--chat--local--remote--wrap">
                        <div className="video--chat--local--wrap">
                            <video className="video--chat--local" autoPlay playsInline controls={false}></video>
                            <Image
                                className="video--chat--connect--img"
                                src={disconnectImg}
                                alt="socket-img"
                                height={20}
                                width={20}
                                unoptimized
                            />
                            <Image
                                className="video--chat--connect--img--wait"
                                src={connectImg}
                                alt="socket-img"
                                height={20}
                                width={20}
                                unoptimized
                            />
                        </div>

                        <div className="video--chat--remote--wrap">
                            <video className="video--chat--remote" autoPlay playsInline controls={false}></video>
                            <Image
                                className="video--chat--connect--img"
                                src={disconnectImg}
                                alt="socket-img"
                                height={20}
                                width={20}
                                unoptimized
                            />
                            <Image
                                className="video--chat--connect--img--wait"
                                src={connectImg}
                                alt="socket-img"
                                height={20}
                                width={20}
                                unoptimized
                            />
                        </div>
                    </div>

                    <div className="video--chat--buttons">

                        <div className="video--chat--input--wrap">
                            <label htmlFor="video--chat--mute--input" className="video--chat--mute--label">Mute</label>
                            <input type="checkbox" className="video--chat--mute--input" name="video--chat--mute--input" id="video--chat--mute--input" onChange={handleChangeInputMute}/>
                        </div>

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

                            <button className="video--chat--hangup--button" onClick={handleHangUpCall}>
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
}