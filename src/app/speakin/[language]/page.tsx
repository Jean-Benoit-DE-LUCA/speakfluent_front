"use client"

import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { ConfigContext, DataUserContext, SloganInterface, SocketContext, UserContext } from "../../main";

import mail from "../../../../public/assets/pictures/mail.svg";
import arrowDown from "../../../../public/assets/pictures/arrow-down.svg";
import videoCall from "../../../../public/assets/pictures/video-call.svg";
import undefinedImg from "../../../../public/assets/pictures/undefined-img.svg";

import { redirect, useRouter, useSearchParams } from "next/navigation";
import Loader from "../../../../components/Loader/page";


export default function Language({ params }: { params: {language: string} }) {

    const socketContext = useContext(SocketContext);

    

    // const socket = new WebSocket("ws://localhost:8081");

    const router = useRouter();

    const searchParams = useSearchParams();

    const id = searchParams.get("i");

    const dataUserContext = useContext(DataUserContext);
    const configContext = useContext(ConfigContext);
    const userContext = useContext(UserContext);


    

    // USESTATE //

    const [timerFetch, setTimerFetch] = useState<boolean>(true);
    const [mailBoxId, setMailBoxId] = useState<Array<number>>([]);

    


    //const [privateChat, setPrivateChat] = useState<object>({});

    // SET SLOGAN //

    const [slogan, setSlogan] = useState<SloganInterface>({
        first: "",
        second: "",
        third: ""
    });

    const setSloganFunc = (language: string) => {

        if (language == "english") {

            const newObj = Object.assign({}, {
                first: "Speak in",
                second: language,
                third: "with other people!"
            });
            
            setSlogan(newObj);
        }

        else if (language == "french") {

            const newObj = Object.assign({}, {
                first: "Parlez en",
                second: "français",
                third: "avec d'autres personnes!"
            });
            
            setSlogan(newObj);
        }

        else if (language == "italian") {

            const newObj = Object.assign({}, {
                first: "Parlate in",
                second: "italiano",
                third: "con altre persone!"
            });
            
            setSlogan(newObj);
        }

        else if (language == "german") {

            const newObj = Object.assign({}, {
                first: "Sprechen Sie",
                second: "Deutsch",
                third: "mit anderen Personen!"
            });
            
            setSlogan(newObj);
        }

        else if (language == "arab"){

            const newObj = Object.assign({}, {
                first: "آخرين",
                second: "مع أشخاص",
                third: "تحدث باللغة العربية!"
            });
            
            setSlogan(newObj);
        }

        else if (language == "spanish") {

            const newObj = Object.assign({}, {
                first: "¡Hablar en",
                second: "castellano",
                third: "con otras personas!"
            });

            setSlogan(newObj);
        }
    };








    // UPDATED ACTIVITY //

    const updateActivityFunc = () => {

        const dateTime = new Date();
            
            let month: number | string = (Number(dateTime.getMonth()) + 1);
            if (Number(month) < 10) {
                month = "0" + month;
            }

            let day: number | string = dateTime.getUTCDate();
            if (Number(day) < 10) {
                day = "0" + day;
            }

            let hours: number | string = dateTime.getHours();
            if (Number(hours) < 10) {
                hours = "0" + hours;
            }

            let minutes: number | string = dateTime.getMinutes();
            if (Number(minutes) < 10) {
                minutes = "0" + minutes;
            }

            let seconds: number | string = dateTime.getSeconds();
            if (Number(seconds) < 10) {
                seconds = "0" + seconds;
            }
            
            const dateFormat = dateTime.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

            configContext.lastActivity = dateFormat;
    };










    // SEND MESSAGE //

    const handleSendMessage = async (chat: string, e?: React.MouseEvent) => {


        const errorElement = (document.getElementsByClassName("error--element")[0] as HTMLElement);
        const spanErrorElement = (document.getElementsByClassName("error--element--span")[0] as HTMLSpanElement);

        updateActivityFunc();

        if (chat == "general") {


            // textarea 1 general//
            const messageText = (document.getElementsByClassName("speak--language--chat--text")[1] as HTMLTextAreaElement);

            const chatArea = (document.getElementsByClassName("speak--language--chat")[0] as HTMLElement);

            const dateTime = new Date();
            
            let month: number | string = (Number(dateTime.getMonth()) + 1);
            if (Number(month) < 10) {
                month = "0" + month;
            }

            let day: number | string = dateTime.getUTCDate();
            if (Number(day) < 10) {
                day = "0" + day;
            }

            let hours: number | string = dateTime.getHours();
            if (Number(hours) < 10) {
                hours = "0" + hours;
            }

            let minutes: number | string = dateTime.getMinutes();
            if (Number(minutes) < 10) {
                minutes = "0" + minutes;
            }

            let seconds: number | string = dateTime.getSeconds();
            if (Number(seconds) < 10) {
                seconds = "0" + seconds;
            }
            
            const dateFormat = dateTime.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;



            // check if input is not empty //

            if (messageText.value !== "" && messageText.value.trim().length !== 0) {

                if (dataUserContext.isJwtOk) {

                    messageText.placeholder = "";

                    createMessage(chatArea, userContext.firstname, messageText.value, dateFormat);

                    socketContext.socket.send(JSON.stringify({
                        message: {
                            firstname: userContext.firstname,
                            message: messageText.value,
                            date: dateFormat,
                            language: params.language
                        }
                    }));


                    messageText.value = "";
                    messageText.focus();
                }

                else if (!dataUserContext.isJwtOk) {

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
            
                    errorElement.classList.add("active");
                    spanErrorElement.textContent = "Session has expired, please sign in again";
            
                    setTimeout(() => {
                        errorElement.classList.remove("active");
                    }, 2500);
                }
            }

            else if (messageText.value.trim().length == 0) {

                messageText.placeholder = "Empty messages are not allowed";
            }
        }




        else if (chat == "private") {

            // get select user value //
            const selectUser = (document.getElementsByClassName("private--chat--element--select--users")[0] as HTMLSelectElement);

            // textarea 0 private //
            const messageText = (document.getElementsByClassName("speak--language--chat--text")[0] as HTMLTextAreaElement);

            const chatArea = (document.getElementsByClassName("speak--language--chat--private--chat")[0] as HTMLElement);

            const dateTime = new Date();
            
            let month: number | string = (Number(dateTime.getMonth()) + 1);
            if (Number(month) < 10) {
                month = "0" + month;
            }

            let day: number | string = dateTime.getUTCDate();
            if (Number(day) < 10) {
                day = "0" + day;
            }

            let hours: number | string = dateTime.getHours();
            if (Number(hours) < 10) {
                hours = "0" + hours;
            }

            let minutes: number | string = dateTime.getMinutes();
            if (Number(minutes) < 10) {
                minutes = "0" + minutes;
            }

            let seconds: number | string = dateTime.getSeconds();
            if (Number(seconds) < 10) {
                seconds = "0" + seconds;
            }
            
            const dateFormat = dateTime.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;



            // check if input is not empty //

            if (messageText.value !== "" && messageText.value.trim().length !== 0) {

                if (dataUserContext.isJwtOk) {

                    messageText.placeholder = "";

                    // add message to object state to distinct differents users conversations //

                    const clonePrivateChat = Object.assign({}, dataUserContext.privateChat);

                    const newObjMessage: {
                        firstname: string,
                        message: string,
                        date: string,
                        language: string,
                        sending_user: string,
                        private_user: string
                    } = {
                        firstname: "",
                        message: "",
                        date: "",
                        language: "",
                        sending_user: "",
                        private_user: ""
                    };

                    newObjMessage["firstname"] = userContext.firstname;
                    newObjMessage["message"] = messageText.value;
                    newObjMessage["date"] = dateFormat;
                    newObjMessage["language"] = params.language;
                    (newObjMessage["sending_user"] as string|null) = (userContext.id as any).toString();
                    newObjMessage["private_user"] = selectUser.value;







                    // if messages already sent -> add message to array | if still no message sent -> create property + array of message //
                    if (clonePrivateChat.hasOwnProperty(selectUser.value)) {

                        (clonePrivateChat as any)[selectUser.value].push(newObjMessage);
                    }

                    else {

                        (clonePrivateChat as any)[selectUser.value] = [];
                        (clonePrivateChat as any)[selectUser.value].push(newObjMessage);
                    }

                    //setPrivateChat(clonePrivateChat);
                    dataUserContext.privateChat = Object.assign({}, clonePrivateChat);

                    setCountChat(countChat + 1);




                    // create message + send privateChat object to socketContext.socket //

                    createMessage(chatArea, userContext.firstname, messageText.value, dateFormat);

                    socketContext.socket.send(JSON.stringify({
                        message: {
                            firstname: userContext.firstname,
                            message: messageText.value,
                            date: dateFormat,
                            language: params.language,

                            // add private_user property if private message //
                            sending_user: (userContext.id as any).toString(),
                            private_user: selectUser.value
                        },
                        clonePrivateChat: (clonePrivateChat as any)[selectUser.value]
                    }));







                    //

                    messageText.value = "";
                    messageText.focus();
                }

                else if (!dataUserContext.isJwtOk) {

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
            
                    errorElement.classList.add("active");
                    spanErrorElement.textContent = "Session has expired, please sign in again";
            
                    setTimeout(() => {
                        errorElement.classList.remove("active");
                    }, 2500);
                }
            }

            else if (messageText.value.trim().length == 0) {

                messageText.placeholder = "Empty messages are not allowed";
            }
        }
        
        
    };







    const handleKeyDownMessage = (e: React.KeyboardEvent<HTMLTextAreaElement>, chat: string) => {

        if (e.key == "Enter") {

            handleSendMessage(chat, undefined);
        }
    };







    // CREATE MESSAGE CHAT //
    
    const createMessage = (wrap: HTMLElement, user: string, message: string, datetime: string) => {

        const divElement = document.createElement("div");
        divElement.setAttribute("class", "chat--message--wrap");

        const spanUser = document.createElement("span");
        spanUser.setAttribute("class", "chat--message--user")
        spanUser.textContent = user + ":";

        const spanMessage = document.createElement("span");
        spanMessage.setAttribute("class", "chat--message--message");
        spanMessage.textContent = message;

        const spanDate = document.createElement("span");
        spanDate.setAttribute("class", "chat--message--date");
        spanDate.textContent = datetime;

        divElement.append(spanUser);
        divElement.append(spanMessage);
        divElement.append(spanDate);

        wrap.append(divElement);

        wrap.scrollTop = wrap.scrollHeight;
    };








    // FUNCTION REMOVE EACH ACTIVE USER OPTIONS //

    const removeEachActiveOptionsUser = () => {

        const userBoxElement = (document.getElementsByClassName("speak--language--users--element--wrap")[0] as HTMLElement);

        if (!userBoxElement.classList.contains("active")) {

            const divOptions = (document.getElementsByClassName("speak--language--users--element--ul--li--div--options") as HTMLCollectionOf<HTMLDivElement>);

            for (let ind = 0; ind < divOptions.length; ind++) {

                divOptions[ind].parentElement?.getElementsByClassName("speak--language--users--element--ul--li--span--firstname--list")[0].classList.remove("active");

                divOptions[ind].classList.remove("active");
            }
        }
    };



    // FUNCTION REMOVE PRIVATE VIDEO CALL BOX //

    const removePrivateVideoCallBox = () => {

        const privateChatElement = (document.getElementsByClassName("private--chat--element--wrap--element private--chat")[0] as HTMLElement);

        if (!privateChatElement.classList.contains("active")) {

            const videoCallBoxPrivate = (document.getElementsByClassName("video--call--button--box private--chat")[0] as HTMLDivElement);

            videoCallBoxPrivate.classList.remove("active");

        }
    };






    // ONCLICK USERS ONLINE //

    const handleClickUsers = (e: React.MouseEvent) => {


        if ((e.target as any).className == "speak--language--users" || 
            (e.target as any).className == "speak--language--users--span" ||
            (e.target as any).className == "arrow speak--language") {

            const privateChatElement = (document.getElementsByClassName("private--chat--element--wrap--element private--chat")[0] as HTMLElement);

            privateChatElement.classList.remove("active");

            const userBoxElement = (document.getElementsByClassName("speak--language--users--element--wrap")[0] as HTMLElement);

            userBoxElement.classList.toggle("active");
            
            // if div users element raised //

            removeEachActiveOptionsUser();


            // remove video call box private //

            removePrivateVideoCallBox();

            setTimerFetch(true);
        }
    }







    // CLICK PRIVATE CHAT //

    const handleClickPrivateChat = (e:React.MouseEvent) => {

        if ((e.target as any).className == "private--chat--element" ||
            (e.target as any).className == "private--chat--element--span private--chat" ||
            (e.target as any).className == "arrow speak--language private--chat") {




            const privateChatElement = (document.getElementsByClassName("private--chat--element--wrap--element private--chat")[0] as HTMLElement);
            privateChatElement.classList.toggle("active");

            if (privateChatElement.classList.contains("active")) {

                const selectUser = (document.getElementsByClassName("private--chat--element--select--users")[0] as HTMLSelectElement);

                if (mailBoxId.includes(Number(selectUser.value))) {

                    let copyMailBoxId = mailBoxId.slice();
        
                    let result = copyMailBoxId.filter( elem => elem !== Number(selectUser.value));
        
                    setMailBoxId(result);
                    setCountMail(countMail + 1);
                }

            }








            const userBoxElement = (document.getElementsByClassName("speak--language--users--element--wrap")[0] as HTMLElement);
            userBoxElement.classList.remove("active");



            const mailImgElement = (document.getElementsByClassName("private--chat--element--mail--img")[0] as HTMLImageElement);
            mailImgElement.classList.remove("active");


            // remove online users element active if contains //

            removeEachActiveOptionsUser();

            // remove video call box private //

            removePrivateVideoCallBox();



            setTimerFetch(true);
        }
    };





    // CLICK PRIVATE CHAT DIV USER //

    const handleClickPrivateChatUser = (e: any, user_id: string, user_firstname: string) => {


        // remove active online users div + remove active options + set timer fetch ON //

        const userBoxElement = (document.getElementsByClassName("speak--language--users--element--wrap")[0] as HTMLElement);

        removeEachActiveOptionsUser();

        userBoxElement.classList.remove("active");

        

        setTimerFetch(true);

        const privateChatElement = (document.getElementsByClassName("private--chat--element--wrap--element private--chat")[0] as HTMLElement);

        privateChatElement.classList.add("active");



        // add new chat user to select private chat //

        const selectUser = (document.getElementsByClassName("private--chat--element--select--users")[0] as HTMLSelectElement);


        const optionElem = document.createElement("option");
        optionElem.setAttribute("value", user_id);
        optionElem.textContent = user_firstname;

        // loop over select options -> if not contains user -> add //

        let selectContainUser = false;
        let selectValue = "";

        for (let ind = 0; ind < selectUser.options.length; ind++) {

            if (selectUser.options[ind].value == user_id) {

                selectContainUser = true;
                selectValue = selectUser.options[ind].value;
                break;
            }
        }




        // select value if contains else add user + add data-user_id attribute to chat private section //

        const chatArea = (document.getElementsByClassName("speak--language--chat--private--chat")[0] as HTMLElement);

        chatArea.setAttribute("data-user_id", user_id);

        if (selectContainUser) {

            selectUser.value = selectValue;

            let evt = new Event("change", {"bubbles": true});
            selectUser.dispatchEvent(evt);

            loadPrivateMessages(selectValue);
        }

        else {

            selectUser.append(optionElem);

            selectUser.value = user_id;

            loadPrivateMessages(user_id);
        }

    };






    // HANDLE CHANGE USER SELECT PRIVATE CHAT //

    const handleChangeSelectPrivateUser = (e: React.ChangeEvent<HTMLSelectElement>) => {


        const chatArea = (document.getElementsByClassName("speak--language--chat--private--chat")[0] as HTMLElement);
        chatArea.setAttribute("data-user_id", e.currentTarget.value);

        if (mailBoxId.includes(Number(e.currentTarget.value))) {

            let copyMailBoxId = mailBoxId.slice();

            let result = copyMailBoxId.filter( elem => elem !== Number(e.currentTarget.value));

            setMailBoxId(result);
            setCountMail(countMail + 1);
        }

        loadPrivateMessages(e.currentTarget.value);
    }





    const [countMail, setCountMail] = useState<number>(0);

    useEffect(() => {

        const mailImgElement = (document.getElementsByClassName("private--chat--element--mail--img")[0] as HTMLImageElement);

        const privateChatElement = (document.getElementsByClassName("private--chat--element--wrap--element private--chat")[0] as HTMLElement);

        const selectUser = (document.getElementsByClassName("private--chat--element--select--users")[0] as HTMLSelectElement);


        let intervalMail = setInterval(() => {

            if (mailImgElement !== undefined) {

                if (mailBoxId.length == 0) {
                    mailImgElement.classList.remove("active");
                }

                else if (mailBoxId.length > 0) {

                    mailImgElement.classList.add("active");
                }
            }

        }, 150);

        return () => clearInterval(intervalMail);

    }, [countMail]);









    // REINSERT USER LANGUAGE CONNECTED IF ACTIVITY //

    const insertUserLanguageConnectedIfReconnect = async (arrayOnlineUsers: Array<any>) => {

        const currentDateTime = (new Date()).getTime();

        const currentDateTimeLastActivity = new Date(configContext.lastActivity);

        let idUserStore = null;

        if (sessionStorage.getItem("user") !== null) {

            idUserStore = JSON.parse(sessionStorage.getItem("user") as string)['id'];
        }

        // check if array online users not empty //

        let flag = false;

        for (let ind = 0; ind < arrayOnlineUsers.length; ind++) {

            if (arrayOnlineUsers[ind].user_id == userContext.id || arrayOnlineUsers[ind].user_id == idUserStore) {

                flag = true;
                break;
            }
        }




        // if not flag -> user not in database user language connected -> insert if activity //

        if (!flag) {

            if (currentDateTime - currentDateTimeLastActivity.getTime() <= 900000) {

                // INSERT USER_LANGUAGE_CONNECTED //

                if (userContext.id == null) {

                    if (idUserStore !== null) {

                        userContext.id = idUserStore;
                    }
                }

                const response = await fetch(`${configContext.hostname}/api/user/${userContext.id}/language/${id}/connected`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    }
                });
            }
        }
        
    };



    

    // GET USERS ONLINE BY LANGUAGE //

    const fetchUsersConnectedByLanguage = async (language_id: string) => {


        try {
            const response = await fetch(`${configContext.hostname}/api/language/${language_id}/getusers`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const responseData = await response.json();

            insertUserLanguageConnectedIfReconnect(responseData.usersOnline);



            try {
                manageUsersConnectedToList(responseData.usersOnline);
            }

            catch (e) {
                
            }
        }

        catch (e) {

        }
    
    };

    const manageUsersConnectedToList = (usersOnline: Array<any>) => {


        const ulElemList = (document.getElementsByClassName("speak--language--users--element--ul")[0] as HTMLUListElement);

        const liElems = ulElemList.getElementsByClassName("speak--language--users--element--ul--li");


        for (let ind = 0; ind < liElems.length; ind++) {

            liElems[ind].remove();
        }




        // add user //


        for (let ind = 0; ind < usersOnline.length; ind++) {

            let flag = false;

            for (let ind2 = 0; ind2 < liElems.length; ind2++) {

                if (liElems[ind2].getAttribute("data-id") == usersOnline[ind].user_id) {

                    flag = true;
                }
            }

            if (!flag) {

                // create li element //

                const liElem = document.createElement("li");
                liElem.setAttribute("class", "speak--language--users--element--ul--li");
                liElem.setAttribute("data-id", usersOnline[ind].user_id);



                // 1- create span element firstname //

                const spanFirstNameList = document.createElement("span");
                spanFirstNameList.setAttribute("class", "speak--language--users--element--ul--li--span--firstname--list")
                spanFirstNameList.textContent = usersOnline[ind].firstname;



                // 2- create div options element //

                const divElem = document.createElement("div");
                divElem.setAttribute("class", "speak--language--users--element--ul--li--div--options");



                // create div options content elements //

                // picture //

                const divWrapPhoto = document.createElement("div");
                divWrapPhoto.setAttribute("class", "speak--language--users--element--ul--li--div--options--div--wrap");

                const anchorElementImg = document.createElement("a");
                anchorElementImg.setAttribute("class", "speak--language--users--element--ul--li--div--options--anchor--img");
                anchorElementImg.setAttribute("href", "../../assets/pictures/undefined-img.svg");
                anchorElementImg.setAttribute("target", "_blank");

                const imgElement = document.createElement("img");
                imgElement.setAttribute("class", "speak--language--users--element--ul--li--div--options--img--profile");
                imgElement.setAttribute("src", "../../assets/pictures/undefined-img.svg");

                // age //

                const divWrapAge = document.createElement("div");
                divWrapAge.setAttribute("class", "speak--language--users--element--ul--li--div--options--div--wrap");

                const spanLabelAge = document.createElement("span");
                spanLabelAge.setAttribute("class", "speak--language--users--element--ul--li--div--options--span--label");
                spanLabelAge.textContent = "Age:";

                const spanAge = document.createElement("span");
                spanAge.setAttribute("class", "speak--language--users--element--ul--li--div--options--span--span");
                spanAge.textContent = "";

                // gender //

                const divWrapGender = document.createElement("div");
                divWrapGender.setAttribute("class", "speak--language--users--element--ul--li--div--options--div--wrap");

                const spanLabelGender = document.createElement("span");
                spanLabelGender.setAttribute("class", "speak--language--users--element--ul--li--div--options--span--label");
                spanLabelGender.textContent = "Gender:";

                const spanGender = document.createElement("span");
                spanGender.setAttribute("class", "speak--language--users--element--ul--li--div--options--span--span");
                spanGender.textContent = "";

                // city //

                const divWrapCity = document.createElement("div");
                divWrapCity.setAttribute("class", "speak--language--users--element--ul--li--div--options--div--wrap");

                const spanLabelCity = document.createElement("span");
                spanLabelCity.setAttribute("class", "speak--language--users--element--ul--li--div--options--span--label");
                spanLabelCity.textContent = "City:";

                const spanCity = document.createElement("span");
                spanCity.setAttribute("class", "speak--language--users--element--ul--li--div--options--span--span");
                spanCity.textContent = "";

                // button private chat //

                const divWrapPrivateChat = document.createElement("div");
                divWrapPrivateChat.setAttribute("class", "speak--language--users--element--ul--li--div--options--div--wrap");

                const buttonPrivateChat = document.createElement("button");
                buttonPrivateChat.setAttribute("class", "speak--language--users--element--ul--li--div--options--button--private--chat");
                buttonPrivateChat.textContent = "Private chat";

                const spanHover = document.createElement("span");
                spanHover.setAttribute("class", "speak--language--users--element--ul--li--div--options--button--private--chat--span");
                spanHover.textContent = "Private chat";


                // add listener to button private chat //

                buttonPrivateChat.addEventListener("click", (e) => handleClickPrivateChatUser(e, usersOnline[ind].user_id, usersOnline[ind].firstname));

                //

                anchorElementImg.append(imgElement);

                divWrapPhoto.append(anchorElementImg);

                divWrapAge.append(spanLabelAge);
                divWrapAge.append(spanAge);

                divWrapGender.append(spanLabelGender);
                divWrapGender.append(spanGender);

                divWrapCity.append(spanLabelCity);
                divWrapCity.append(spanCity);

                buttonPrivateChat.append(spanHover)
                divWrapPrivateChat.append(buttonPrivateChat);

                divElem.append(divWrapPhoto);
                divElem.append(divWrapAge);
                divElem.append(divWrapGender);
                divElem.append(divWrapCity);

                if (userContext.id == null) {

                    if (sessionStorage.getItem("user") !== null) {

                        userContext.id = JSON.parse(sessionStorage.getItem("user") as string)['id'];
                    }
                }

                userContext.id !== usersOnline[ind].user_id ? divElem.append(divWrapPrivateChat) : "";

                liElem.append(spanFirstNameList);
                liElem.append(divElem);
                ulElemList.append(liElem);
            }

            else if (flag) {

                continue;
            }
        }






        // DELETE USER //

        const arrayOnlineUsers = [];

        for (let ind = 0; ind < usersOnline.length; ind++) {

            arrayOnlineUsers.push(Number(usersOnline[ind].user_id));
        }

        const arrayCurrentUsersList = [];

        for (let ind = 0; ind < liElems.length; ind++) {

            arrayCurrentUsersList.push(Number(liElems[ind].getAttribute("data-id")));
        }


        // if not includes -> remove user from list //

        for (let ind = 0; ind < arrayCurrentUsersList.length; ind++) {

            if (!arrayOnlineUsers.includes(arrayCurrentUsersList[ind])) {

                for (let ind2 = 0; ind2 < liElems.length; ind2++) {

                    if (Number(liElems[ind2].getAttribute("data-id")) == Number(arrayCurrentUsersList[ind])) {

                        liElems[ind2].remove();
                        break;
                    }
                }
            }
        }

        




        // SORT LI ELEMENTS //

        const newArrayOnlineUsersSorted = [];

        for (let ind = 0; ind < liElems.length; ind++) {

            newArrayOnlineUsersSorted.push(liElems[ind]);
        }

        newArrayOnlineUsersSorted.sort((a: any, b: any) => {

            if (a.textContent < b.textContent) {
                return -1;
            }

            if (a.textContent > b.textContent) {
                return 1;
            }
            return 0;
        });

        ulElemList.remove();

        const divUsersElement = (document.getElementsByClassName("speak--language--users--element")[0] as HTMLDivElement);

        const ulElement = document.createElement("ul");
        ulElement.setAttribute("class", "speak--language--users--element--ul");

        for (let ind = 0; ind < newArrayOnlineUsersSorted.length; ind++) {

            ulElement.append(newArrayOnlineUsersSorted[ind]);
        }

        divUsersElement.append(ulElement);




        // add click listener on li element //

        const newLiElements = (document.getElementsByClassName("speak--language--users--element--ul--li") as HTMLCollectionOf<HTMLLIElement>);

        for (let ind = 0; ind < newLiElements.length; ind++) {

            if (newLiElements[ind].getAttribute("data-listener") == null || newLiElements[ind].getAttribute("data-listener") == "false") {

                newLiElements[ind].addEventListener("click", (e) => handleClickUniqueUser(e));
                newLiElements[ind].setAttribute("data-listener", "true");
            }
        }
    };







    // SHOW DIV OPTIONS USER //


    // fetch user data by id //

    const fetchUserDataById = async (user_id: string) => {

        if (userContext.jwt.length == 0) {

            if (sessionStorage.getItem("user") !== null) {

                userContext.jwt = JSON.parse(sessionStorage.getItem("user") as string)['jwt'];
            }
        }



        const response = await fetch(`${configContext.hostname}/api/user/find/id/${user_id}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${userContext.jwt}`
                }
        });

        const responseData = await response.json();
        
        return responseData;
    };

    //






    const handleClickUniqueUser = async (e: any) => {


        const liUsersList = (document.getElementsByClassName("speak--language--users--element--ul--li") as HTMLCollectionOf<HTMLLIElement>);

        for (let ind = 0; ind < liUsersList.length; ind++) {

            liUsersList[ind].classList.remove("active");
        }


        if (e.currentTarget.className == "speak--language--users--element--ul--li") {

            e.currentTarget.classList.add("active");

            const spanFirstNameList = (e.currentTarget.getElementsByClassName("speak--language--users--element--ul--li--span--firstname--list")[0] as HTMLSpanElement);

            const divOptions = (document.getElementsByClassName("speak--language--users--element--ul--li--div--options") as HTMLCollectionOf<HTMLDivElement>);

            const divOptionsUser = (e.currentTarget.getElementsByClassName("speak--language--users--element--ul--li--div--options")[0] as HTMLDivElement);




            for (let ind = 0; ind < divOptions.length; ind++) {

                if (divOptions[ind] !== divOptionsUser) {

                    divOptions[ind].classList.remove("active");
                }




                // loop over childrens to remove each active //

                for (let ind2 = 0; ind2 < divOptions[ind].children.length; ind2++) {

                    divOptions[ind].children[ind2].classList.remove("active");
                }
            }






            // div options users toggle active for smooth render //

            if (divOptionsUser.classList.contains("active")) {

                setTimeout(() => {

                    spanFirstNameList.classList.remove("active");
                    divOptionsUser.classList.remove("active");
                }, 100);

                // loop over childrens to remove each active //

                for (let ind = 0; ind < divOptionsUser.children.length; ind++) {

                    divOptionsUser.children[ind].classList.remove("active");
                }

                setTimerFetch(true);
            }


            else if (!divOptionsUser.classList.contains("active")) {

                const errorElement = (document.getElementsByClassName("error--element")[0] as HTMLElement);
                const spanErrorElement = (document.getElementsByClassName("error--element--span")[0] as HTMLSpanElement);

                // get data from user //

                const resultFetch = await fetchUserDataById(e.currentTarget.getAttribute("data-id"));

                if (resultFetch.hasOwnProperty("jwtCheck")) {

                    


                    // if token expired //

                    if (resultFetch.jwtCheck == false) {

                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });
            
                        errorElement.classList.add("active");
                        spanErrorElement.textContent = "Session has expired, please sign in again";
            
                        setTimeout(() => {
                            errorElement.classList.remove("active");
                        }, 2500);
                    }



                    // if token ok //

                    else {

                        // dynamic photo + age + gender + city user //


                        if (resultFetch['userObj']['photo'] !== null) {

                            (divOptionsUser.children[0].children[0] as HTMLAnchorElement).href = `${configContext.hostname}/assets/pictures/${resultFetch['userObj']['photo']}`;

                            (divOptionsUser.children[0].children[0].children[0] as HTMLImageElement).src = `${configContext.hostname}/assets/pictures/${resultFetch['userObj']['photo']}`;
                        }

                        divOptionsUser.children[1].children[1].textContent = resultFetch['userObj']['age'];
                        divOptionsUser.children[2].children[1].textContent = resultFetch['userObj']['gender'];
                        divOptionsUser.children[3].children[1].textContent = resultFetch['userObj']['city'];

                        //

                        spanFirstNameList.classList.add("active");
                        divOptionsUser.classList.add("active");

                        setTimeout(() => {

                            // loop over childrens to add active to each one //

                            for (let ind = 0; ind < divOptionsUser.children.length; ind++) {

                                divOptionsUser.children[ind].classList.add("active");
                            }
                        }, 100);

                        setTimerFetch(false);
                    }
                }
            }





            // flag to check if all "active" are removed //

            let flag = false;

            for (let ind = 0; ind < divOptions.length; ind++) {

                if (divOptions[ind].classList.contains("active")) {

                    flag = true;
                    break;
                }
            }

            !flag ? setTimerFetch(true) : "";
        }
    };





    const [pvChat, setPvChat] = useState<any>({});
    const [countChat, setCountChat] = useState<number>(0);

    useEffect(() => {

        setPvChat(Object.assign(pvChat, dataUserContext.privateChat));
    }, [countChat]);

    // LOAD PRIVATE MESSAGES //

    const loadPrivateMessages = (user_id_to_load: string) => {



        const selectUser = (document.getElementsByClassName("private--chat--element--select--users")[0] as HTMLSelectElement);
        const chatArea = (document.getElementsByClassName("speak--language--chat--private--chat")[0] as HTMLElement);

        const divMessages = (document.getElementsByClassName("chat--message--wrap") as HTMLCollectionOf<HTMLDivElement>);


        const divPrivateMessages = (chatArea.getElementsByClassName("chat--message--wrap") as HTMLCollectionOf<HTMLDivElement>);

        
        // while there is childs messages -> remove //

        while (divPrivateMessages.length > 0) {

            for (let ind = 0; ind < divPrivateMessages.length; ind++) {

                divPrivateMessages[ind].remove();
            }
        }






        // if key exist in privateChat object -> empty + load all messages //

        // if key "-" exists (user speak to himself) load messages //


        if (((pvChat as any)[user_id_to_load]) !== undefined) {


            while (divPrivateMessages.length > 0) {

                for (let ind = 0; ind < divPrivateMessages.length; ind++) {
    
                    divPrivateMessages[ind].remove();
                }
            }



            for (let ind = 0; ind < ((pvChat as any)[user_id_to_load]).length; ind++) {

                if ((pvChat as any)[user_id_to_load][ind].hasOwnProperty("link_chat_id")) {

                    createLinkPrivateChat(chatArea, (pvChat as any)[user_id_to_load][ind]["language_id"], (pvChat as any)[user_id_to_load][ind]["link_chat_id"], (pvChat as any)[user_id_to_load][ind]["user_id"], (pvChat as any)[user_id_to_load][ind]["user_receive"]);

                    chatArea.scrollTo({
                        top: chatArea.scrollHeight,
                        behavior: "smooth"
                    });
                }

                else {

                    createMessage(chatArea, (pvChat as any)[user_id_to_load][ind].firstname, (pvChat as any)[user_id_to_load][ind].message, (pvChat as any)[user_id_to_load][ind].date);
                }
            }
        }

        else if (((pvChat as any)[user_id_to_load]) == undefined) {


            while (divPrivateMessages.length > 0) {

                for (let ind = 0; ind < divPrivateMessages.length; ind++) {

                    divPrivateMessages[ind].remove();
                }
            }


        }
    }



    // ----------------------------- PASSWORD VIDEO CALL ----------------------------- //

    // SET PASSWORD VIDEO CALL //

    const handleSetVideoCallPassword = async (e: React.MouseEvent<HTMLButtonElement>) => {

        e.preventDefault();

        const errorElement = (document.getElementsByClassName("error--element")[0] as HTMLElement);
        const spanErrorElement = (document.getElementsByClassName("error--element--span")[0] as HTMLSpanElement);

        const videoCallBoxPrivate = (document.getElementsByClassName("video--call--button--box private--chat")[0] as HTMLDivElement);

        const labelTitlePassword = (document.getElementsByClassName("video--call--button--form--label")[0] as HTMLLabelElement);


        // check if user SET or ENTER password //

        if (videoCallBoxPrivate.getAttribute("data-password") !== "enter") {



            const selectUser = (document.getElementsByClassName("private--chat--element--select--users")[0] as HTMLSelectElement);

            const inputValuesPassword = (document.getElementsByClassName("video--call--button--form--input") as HTMLCollectionOf<HTMLInputElement>);

            let flag = false;
            let passwordInputs = "";

            for (let ind = 0; ind < inputValuesPassword.length; ind++) {

                if (inputValuesPassword[ind].value == "" ||
                    inputValuesPassword[ind].value == " ") {

                    flag = true;
                    break;
                }

                else {

                    passwordInputs += inputValuesPassword[ind].value;
                }
            }

            if (flag) {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

                errorElement.classList.add("active");
                spanErrorElement.textContent = "Empty fields are not allowed";

                setTimeout(() => {
                    errorElement.classList.remove("active");
                }, 2500);
            }

            else if (!flag) {

                if (selectUser.value == "-") {

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
        
                    errorElement.classList.add("active");
                    spanErrorElement.textContent = "Please choose an user in your private list";
        
                    setTimeout(() => {
                        errorElement.classList.remove("active");
                    }, 2500);

                    videoCallBoxPrivate.classList.remove("active");
                    selectUser.classList.remove("active");
                }

                else if (passwordInputs.length == 4) {

                    const response = await fetch (`${configContext.hostname}/api/userchatpassword/insert`, {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json",
                            "Authorization": `Bearer ${userContext.jwt}`
                        },
                        body: JSON.stringify({
                            passwordInputs: passwordInputs,
                            userSet: userContext.id,
                            userReceive: Number(selectUser.value),
                            languageId: Number(id),
                            chatType: "private"
                        })
                    })

                    const responseData = await response.json();


                    if (responseData.hasOwnProperty("jwtCheck")) {

                        


                        // if token expired //

                        if (responseData.jwtCheck == false) {

                            window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            });
                
                            errorElement.classList.add("active");
                            spanErrorElement.textContent = "Session has expired, please sign in again";
                
                            setTimeout(() => {
                                errorElement.classList.remove("active");
                            }, 2500);
                        }


                        // else -> token ok //

                        else {

                            videoCallBoxPrivate.classList.remove("active");

                            const chatArea = (document.getElementsByClassName("speak--language--chat--private--chat")[0] as HTMLElement);


                            createLinkPrivateChat(chatArea, Number(id), responseData.lastRowInserted[0]["id"], responseData.lastRowInserted[0]["user_id"], responseData.lastRowInserted[0]["user_receive"]);



                            // update private chat with anchor link //

                            const clonePrivateChat = Object.assign({}, dataUserContext.privateChat);

                            const newObjLink : {
                                link_chat_id: number,
                                language_id: number,
                                user_id: number,
                                user_receive: number
                            } = {
                                link_chat_id: 0,
                                language_id: 0,
                                user_id: 0,
                                user_receive: 0
                            };

                            newObjLink["link_chat_id"] = responseData.lastRowInserted[0]["id"];
                            newObjLink["language_id"] = Number(id);
                            newObjLink["user_id"] = responseData.lastRowInserted[0]["user_id"];
                            newObjLink["user_receive"] = responseData.lastRowInserted[0]["user_receive"];

                            // if messages already sent -> add message to array | if still no message sent -> create property + array of message //
                            if (clonePrivateChat.hasOwnProperty(selectUser.value)) {

                                (clonePrivateChat as any)[selectUser.value].push(newObjLink);
                            }

                            else {

                                (clonePrivateChat as any)[selectUser.value] = [];
                                (clonePrivateChat as any)[selectUser.value].push(newObjLink);
                            }

                            //setPrivateChat(clonePrivateChat);

                            dataUserContext.privateChat = Object.assign({}, clonePrivateChat);

                            setCountChat(countChat + 1);

                            //



                            socketContext.socket.send(JSON.stringify({
                                private_link_object: {
                                    data: responseData.lastRowInserted[0],
                                    userSetFirstName: userContext.firstname,
                                    userReceiveFirstName: selectUser.options[selectUser.selectedIndex].text,
                                    idLanguage: id
                                },
                                clonePrivateChat: (clonePrivateChat as any)[selectUser.value]

                            }));

                            chatArea.scrollTo({
                                top: chatArea.scrollHeight,
                                behavior: "smooth"
                            });

                            selectUser.classList.remove("active");
                        }
                    }
                }
            }
        }


        else if (videoCallBoxPrivate.getAttribute("data-password") == "enter") {

            const inputValuesPassword = (document.getElementsByClassName("video--call--button--form--input") as HTMLCollectionOf<HTMLInputElement>);

            let flag = false;
            let passwordInputs = "";

            for (let ind = 0; ind < inputValuesPassword.length; ind++) {

                if (inputValuesPassword[ind].value == "" ||
                    inputValuesPassword[ind].value == " ") {

                    flag = true;
                    break;
                }

                else {

                    passwordInputs += inputValuesPassword[ind].value;
                }
            }

            if (flag) {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

                errorElement.classList.add("active");
                spanErrorElement.textContent = "Empty fields are not allowed";

                setTimeout(() => {
                    errorElement.classList.remove("active");
                }, 2500);
            }

            else if (!flag) {

                if (passwordInputs.length == 4) {

                    const response = await fetch(`${configContext.hostname}/api/userchatpassword/check`, {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json",
                            "Authorization": `Bearer ${userContext.jwt}`
                        },
                        body: JSON.stringify({
                            passwordInputs: passwordInputs,
                            pvChatId: videoCallBoxPrivate.getAttribute("data-id-pv-chat")
                        })
                    });

                    const responseData = await response.json();
                    

                    // if token expired //

                    if (responseData.jwtCheck == false) {

                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });
            
                        errorElement.classList.add("active");
                        spanErrorElement.textContent = "Session has expired, please sign in again";
            
                        setTimeout(() => {
                            errorElement.classList.remove("active");
                        }, 2500);
                    }


                    // else -> token ok //

                    else {

                        if (responseData.resultCheckChatPassword) {

                            videoCallBoxPrivate.classList.remove("active");

                            setTimeout(() => {

                                labelTitlePassword.textContent = "Set a private chat password:";
                            }, 300);



                            // open in new tab + set sessionStorage //

                            sessionStorage.setItem("user", JSON.stringify(userContext));

                            setTimeout(() => {

                                window.open(`/chat?i=${id}&pv=${responseData.data[0]["user_chat_password_id"]}&us1=${responseData.data[0]["user_chat_password_user_id"]}&us2=${responseData.data[0]["user_chat_password_user_receive"]}`, "_blank");

                            }, 300);
                            
                        }

                        else if (!responseData.resultCheckChatPassword) {

                            window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            });
                
                            errorElement.classList.add("active");
                            spanErrorElement.textContent = "Chat password error";
                
                            setTimeout(() => {
                                errorElement.classList.remove("active");
                            }, 2500);
                        }


                    }


                }
            }
        }
    }






    // RESET INPUT VALUES //

    const handleResetInputValues = (e: any) => {

        const inputValuesPassword = (document.getElementsByClassName("video--call--button--form--input") as HTMLCollectionOf<HTMLInputElement>);

        for (let ind = 0; ind < inputValuesPassword.length; ind++) {

            inputValuesPassword[ind].value = "";
        }
    };


    // --------------------------- //







    // CREATE LINK PRIVATE CHAT //

    const createLinkPrivateChat = (wrap: HTMLElement, idLanguage: number, idPrivateChat: number, idUserOne: number, idUserTwo: number) => {

        const divElement = document.createElement("div");
        divElement.setAttribute("class", "chat--message--wrap");

        const anchorElement = document.createElement("a");
        anchorElement.setAttribute("class", "link--private--chat");
        anchorElement.setAttribute("href", `/chat?i=${idLanguage}&pv=${idPrivateChat}&us1=${idUserOne}&us2=${idUserTwo}`);
        anchorElement.setAttribute("target", "_blank");
        anchorElement.textContent = `Private chat invitation #${idPrivateChat}`;

        divElement.append(anchorElement);

        wrap.append(divElement);


        // create listener //

        anchorElement.addEventListener("click", (e) => handleClickAnchorPrivateChat(e, idPrivateChat, idUserOne, idUserTwo ));
    };







    // CREATE LINK GENERAL CHAT //

    const createLinkGeneralChat = (wrap: HTMLElement, idLanguage: number, idGeneralChat: number, userFirstName: string) => {

        const divElement = document.createElement("div");
        divElement.setAttribute("class", "chat--message--wrap");

        const anchorElement = document.createElement("a");
        anchorElement.setAttribute("class", "link--general--chat");
        anchorElement.setAttribute("href", `/chat?i=${idLanguage}&gen=${idGeneralChat}`);
        anchorElement.setAttribute("target", "_blank");
        anchorElement.textContent = `General chat invitation #${idGeneralChat} by ${userFirstName}`;

        divElement.append(anchorElement);

        wrap.append(divElement);


        // create listener //

        anchorElement.addEventListener("click", (e) => handleClickAnchorGeneralChat(e, idGeneralChat));
    };







    // HANDLE CLICK ANCHOR PRIVATE CHAT //

    const handleClickAnchorPrivateChat = (e: any, idPrivateChat: number, idUserOne: number, idUserTwo: number) => {

        e.preventDefault();

        const videoCallBoxPrivate = (document.getElementsByClassName("video--call--button--box private--chat")[0] as HTMLDivElement);

        const labelTitlePassword = (document.getElementsByClassName("video--call--button--form--label")[0] as HTMLLabelElement);

        videoCallBoxPrivate.setAttribute("data-password", "enter");
        videoCallBoxPrivate.setAttribute("data-id-pv-chat", idPrivateChat.toString());

        if (userContext.id == idUserOne || userContext.id == idUserTwo) {

            labelTitlePassword.textContent = `Enter the password to access private chat #${idPrivateChat}`;
            videoCallBoxPrivate.classList.add("active");
        }
    };



    // HANDLE CLICK ANCHOR GENERAL CHAT //

    const handleClickAnchorGeneralChat = async (e: any, idGeneralChat: number) => {

        const errorElement = (document.getElementsByClassName("error--element")[0] as HTMLElement);
        const spanErrorElement = (document.getElementsByClassName("error--element--span")[0] as HTMLSpanElement);

        e.preventDefault();

        // check if empty seat //

        

        const response = await fetch(`${configContext.hostname}/api/userchatpassword/get/general/id/${idGeneralChat}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${userContext.jwt}`
            }
        });

        const responseData = await response.json();


        // if token expired //

        if (responseData.jwtCheck == false) {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            errorElement.classList.add("active");
            spanErrorElement.textContent = "Session has expired, please sign in again";

            setTimeout(() => {
                errorElement.classList.remove("active");
            }, 2500);
        }


        // else -> token ok //

        else {


            if (responseData.hasOwnProperty("data")) {


                if (responseData.data.user_id == null || responseData.data.user_receive == null) {

                    // update general chat row //

                    const responseUpdate = await fetch(`${configContext.hostname}/api/userchatpassword/updateuser/${idGeneralChat}`, {
                        method: "PUT",
                        headers: {
                            "Content-type": "application/json",
                            "Authorization": `Bearer ${userContext.jwt}`
                        },
                        body: JSON.stringify({
                            addUser: userContext.id
                        })
                    });

                    const responseUpdateData = await responseUpdate.json();


                    // check error no empty seat //

                    
                    if (responseUpdateData.hasOwnProperty("error")) {

                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });
            
                        errorElement.classList.add("active");
                        spanErrorElement.textContent = responseUpdateData.error;
            
                        setTimeout(() => {
                            errorElement.classList.remove("active");
                        }, 2500);
                    }



                    // open in new tab + set sessionStorage //

                    else if (responseUpdateData.hasOwnProperty("alreadyRegistered")) {

                        sessionStorage.setItem("user", JSON.stringify(userContext));

                        setTimeout(() => {

                            window.open(`/chat?i=${id}&gen=${responseData.data.id}`, "_blank");

                        }, 300);
                    }


                    


                    else {

                        sessionStorage.setItem("user", JSON.stringify(userContext));

                        setTimeout(() => {

                            window.open(`/chat?i=${id}&gen=${responseData.data.id}`, "_blank");

                        }, 300);
                    }

                    
                }

                else if ((responseData.data.user_id !== null && responseData.data.user_receive !== null) &&
                         (responseData.data.user_id == userContext.id || responseData.data.user_receive == userContext.id)) {

                    sessionStorage.setItem("user", JSON.stringify(userContext));

                    setTimeout(() => {

                        window.open(`/chat?i=${id}&gen=${responseData.data.id}`, "_blank");

                    }, 300);
                }

                else if (responseData.data.user_id !== null && responseData.data.user_receive !== null) {

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
        
                    errorElement.classList.add("active");
                    spanErrorElement.textContent = "All seats are taken, please create another room";
        
                    setTimeout(() => {
                        errorElement.classList.remove("active");
                    }, 2500);
                }

            }
        }
    };

    // GO TO NEXT INPUT PASSWORD VIDEO CALL //

    const handleChangeNextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        
        const inputValuesPassword = (document.getElementsByClassName("video--call--button--form--input") as HTMLCollectionOf<HTMLInputElement>);

        for (let ind = 0; ind < inputValuesPassword.length; ind++) {

            if (inputValuesPassword[ind] == e.currentTarget) {

                if (ind !== 3) {

                    inputValuesPassword[ind + 1].focus();
                }
            }
        }
    };

    // ---------------------------- //


    // ---------------------------------------------------------- //




    // HANDLE CLICK VIDEO CALL //

    const handleClickVideoCallButton = async (chat: string, e?: any) => {


        const errorElement = (document.getElementsByClassName("error--element")[0] as HTMLElement);
        const spanErrorElement = (document.getElementsByClassName("error--element--span")[0] as HTMLSpanElement);

        e?.preventDefault();

        if (e?.target.className == "video--call--img private--chat" ||
            e?.target.className == "video--call--button private--chat") {

                if (chat == "private") {

                    const event = new MouseEvent("click");

                    handleResetInputValues(event);

                    const videoCallButtonBox = (document.getElementsByClassName("video--call--button--box private--chat")[0] as HTMLDivElement);

                    const labelTitlePassword = (document.getElementsByClassName("video--call--button--form--label")[0] as HTMLLabelElement);

        
                    videoCallButtonBox.classList.toggle("active");


                    // remove attribute to check if div SET or ENTER password //
                    videoCallButtonBox.removeAttribute("data-password");
                    videoCallButtonBox.removeAttribute("data-id-pv-chat");



                    const selectUser = (document.getElementsByClassName("private--chat--element--select--users")[0] as HTMLSelectElement);

                    if (videoCallButtonBox.classList.contains("active")) {

                        selectUser.classList.add("active");

                        labelTitlePassword.textContent = "Set a private chat password:";
                    }

                    else if (!videoCallButtonBox.classList.contains("active")) {

                        selectUser.classList.remove("active");

                        setTimeout(() => {

                            labelTitlePassword.textContent = "Set a private chat password:";
                        }, 300);
                    }
                }
        }



        else if (e?.target.className == "video--call--img" ||
                 e?.target.className == "video--call--button") {

                if (chat == "general") {

                    const response = await fetch (`${configContext.hostname}/api/userchatpassword/insert`, {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json",
                            "Authorization": `Bearer ${userContext.jwt}`
                        },
                        body: JSON.stringify({
                            passwordInputs: null,
                            userSet: userContext.id,
                            userReceive: null,
                            languageId: Number(id),
                            chatType: "general"
                        })
                    })

                    const responseData = await response.json();

                    
                    if (responseData.hasOwnProperty("jwtCheck")) {

                        


                        // if token expired //

                        if (responseData.jwtCheck == false) {

                            window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            });
                
                            errorElement.classList.add("active");
                            spanErrorElement.textContent = "Session has expired, please sign in again";
                
                            setTimeout(() => {
                                errorElement.classList.remove("active");
                            }, 2500);
                        }




                        // else -> token ok //

                        else {

                            const generalChat = (document.getElementsByClassName("speak--language--chat")[0] as HTMLDivElement);

                            createLinkGeneralChat(generalChat, Number(id), Number(responseData.lastRowInserted[0].id), userContext.firstname);

                            socketContext.socket.send(JSON.stringify({
                                general_link_object: {
                                    idLanguage: Number(id),
                                    idGeneralChat: Number(responseData.lastRowInserted[0].id),
                                    userFirstName: userContext.firstname
                                }
                            }));

                            generalChat.scrollTo({
                                top: generalChat.scrollHeight,
                                behavior: "smooth"
                            });
                        }
                    }
                }
        }
        
        
    }

    // --------------------------- //







    // SET SLOGAN //

    useEffect(() => {

        setSloganFunc(params.language);
    }, []);

    // --------------------------- //


    /****** */

    const [onlineUsers, setOnlineUsers] = useState({
        online_users: [userContext.id],
        languageId: id
    });

    useEffect(() => {

        let sendOnlineUsersInterval = setInterval(() => {

            if (socketContext.socket.readyState == 1) {

                socketContext.socket.send(JSON.stringify({
                    online_users: onlineUsers
                }));
            }

        }, 3000);

        return () => clearInterval(sendOnlineUsersInterval);
    });


    /****** */



    useEffect(() => {

        let fetchUsersConnectedByLanguageInterval: any;

        if (timerFetch) {

            fetchUsersConnectedByLanguageInterval = setInterval(() => {

                try {

                    fetchUsersConnectedByLanguage(id as string);
                }

                catch (e) {

                }

            }, 5000);
        }

        else if (!timerFetch) {

            clearInterval(fetchUsersConnectedByLanguageInterval);
        }
        
        return () => clearInterval(fetchUsersConnectedByLanguageInterval);
        
    }, [timerFetch]);









    // WEBSOCKET //

    useEffect(() => {

        

        socketContext.socket.onopen = async (e) => {

            // INSERT USER_LANGUAGE_CONNECTED //

            let idUser: string | null = null;

            if (sessionStorage.getItem("user") !== null) {

                idUser = JSON.parse(sessionStorage.getItem("user") as string)['id'];
            }

            if (idUser !== null) {

                const response = await fetch(`${configContext.hostname}/api/user/${idUser}/language/${id}/connected`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    }
                });
            }
        };
    
        

        socketContext.socket.onmessage = (e) => {

            let objData = JSON.parse(e.data);

            const selectUser = (document.getElementsByClassName("private--chat--element--select--users")[0] as HTMLSelectElement);
            const chatArea = (document.getElementsByClassName("speak--language--chat--private--chat")[0] as HTMLElement);

            if (objData.hasOwnProperty("online_users")) {

                if (objData.online_users.languageId == id) {

                    const cloneArrayUsersOnline = objData.online_users.online_users.slice();

                    cloneArrayUsersOnline.push(userContext.id);


                    const newDataOnlineUsers = Object.assign({}, {
                        online_users: cloneArrayUsersOnline,
                        languageId: id
                    });

                }
            }

            if (objData.hasOwnProperty("message")) {

                if (objData.message.language == params.language) {

                    // if general chat //
                    if (!objData.message.hasOwnProperty("private_user")) {

                        const chatArea = (document.getElementsByClassName("speak--language--chat")[0] as HTMLElement);

                        createMessage(chatArea, objData.message.firstname, objData.message.message, objData.message.date);
                    }

                    // if private chat //
                    if (objData.message.hasOwnProperty("private_user")) {


                        if (objData.message.private_user == userContext.id) {


                            // add user id to mail array //

                            const privateChatElement = (document.getElementsByClassName("private--chat--element--wrap--element private--chat")[0] as HTMLElement);

                            if (!privateChatElement.classList.contains("active")) {

                                let copyMailBoxId = mailBoxId.slice();
                                copyMailBoxId.push(Number(objData.message.sending_user));
                                setMailBoxId(copyMailBoxId);

                                setCountMail(countMail + 1);
                            }


                            else if (privateChatElement.classList.contains("active")) {

                                if (selectUser.value !== objData.message.sending_user) {

                                    let copyMailBoxId = mailBoxId.slice();
                                    copyMailBoxId.push(Number(objData.message.sending_user));
                                    setMailBoxId(copyMailBoxId);
    
                                    setCountMail(countMail + 1);
                                }
                            }

                            
     



                            // set new message value in sending user property //

                            const newUserObjArrayMessage = {};

                            const newClonePrivateChat = Object.defineProperty(newUserObjArrayMessage, objData.message.sending_user, {
                                value: objData.clonePrivateChat,
                                enumerable: true,
                                writable: true
                                }
                            );

                            //setPrivateChat(Object.assign(privateChat, newClonePrivateChat));

                            dataUserContext.privateChat = Object.assign(dataUserContext.privateChat, newClonePrivateChat);
                            setPvChat(Object.assign(pvChat, newClonePrivateChat));
                            
                            setCountChat(countChat + 1);



                            // if option element of user not exists -> add //

                            let flag = false;

                            for (let ind = 0; ind < selectUser.options.length; ind++) {

                                if (selectUser.options[ind].value == objData.message.sending_user) {

                                    flag = true;
                                    break;
                                }
                            }

                            if (!flag) {

                                const optionElem = document.createElement("option");
                                optionElem.value = objData.message.sending_user;
                                optionElem.textContent = objData.message.firstname;

                                selectUser.append(optionElem);




                                // add data-user_id attribute to chat section //

                                chatArea.setAttribute("data-user_id", objData.message.sending_user);
                            }




                            
                            // if user has sending_user selected option -> empty all messages before update with new array of messages = live chat //

                            if (selectUser.value == objData.message.sending_user) {

                                loadPrivateMessages(objData.message.sending_user);
                            }

                            //---//
                        }
                    }

                    
                }
            }


            else if (objData.hasOwnProperty("private_link_object")) {

                if (objData.private_link_object.data.user_receive == userContext.id) {



                    // add user id to mail array //

                    const privateChatElement = (document.getElementsByClassName("private--chat--element--wrap--element private--chat")[0] as HTMLElement);

                    if (!privateChatElement.classList.contains("active")) {

                        let copyMailBoxId = mailBoxId.slice();
                        copyMailBoxId.push(Number(objData.private_link_object.data.user_owner_id));
                        setMailBoxId(copyMailBoxId);

                        setCountMail(countMail + 1);
                    }


                    else if (privateChatElement.classList.contains("active")) {

                        if (Number(selectUser.value) !== Number(objData.private_link_object.data.user_owner_id)) {

                            let copyMailBoxId = mailBoxId.slice();
                            copyMailBoxId.push(Number(objData.private_link_object.data.user_owner_id));
                            setMailBoxId(copyMailBoxId);

                            setCountMail(countMail + 1);
                        }
                    }


                    


                    // set new message link value in sending user property //

                    const newUserObjArrayMessage = {};

                    const newClonePrivateChat = Object.defineProperty(newUserObjArrayMessage, objData.private_link_object.data.user_id, {
                        value: objData.clonePrivateChat,
                        enumerable: true,
                        writable: true
                        }
                    );

                    //setPrivateChat(Object.assign(privateChat, newClonePrivateChat));

                    dataUserContext.privateChat = Object.assign(dataUserContext.privateChat, newClonePrivateChat);
                    setPvChat(Object.assign(pvChat, newClonePrivateChat));

                    setCountChat(countChat + 1);


                    // if option element of user not exists -> add //

                    let flag = false;

                    for (let ind = 0; ind < selectUser.options.length; ind++) {

                        if (selectUser.options[ind].value == objData.private_link_object.data.user_id) {

                            flag = true;
                            break;
                        }
                    }

                    if (!flag) {

                        const optionElem = document.createElement("option");
                        optionElem.value = objData.private_link_object.data.user_id;
                        optionElem.textContent = objData.private_link_object.userSetFirstName;

                        selectUser.append(optionElem);




                        // add data-user_id attribute to chat section //

                        chatArea.setAttribute("data-user_id", objData.private_link_object.data.user_id);
                    }




                    // if user has sending_user selected option -> empty all messages before update with new array of messages = live chat //

                    if (selectUser.value == objData.private_link_object.data.user_id) {

                        loadPrivateMessages(objData.private_link_object.data.user_id);
                    }

                    //---//


                    chatArea.scrollTo({
                        top: chatArea.scrollHeight,
                        behavior: "smooth"
                    });
                }
            }

            // if general chat link //

            else if (objData.hasOwnProperty("general_link_object")) {

                if (objData.general_link_object.idLanguage == id) {

                    const generalChat = (document.getElementsByClassName("speak--language--chat")[0] as HTMLDivElement);

                    createLinkGeneralChat(generalChat, objData.general_link_object.idLanguage, objData.general_link_object.idGeneralChat, objData.general_link_object.userFirstName);

                    generalChat.scrollTo({
                        top: generalChat.scrollHeight,
                        behavior: "smooth"
                    });
                }
            }
            
        };

        socketContext.socket.onclose = async (e) => {

            try {

                if (userContext.id !== null) {

                    const response = await fetch(`${configContext.hostname}/api/user/${userContext.id}/language/${id}/connected/delete`, {
                        method: "DELETE",
                        headers: {
                            "Content-type": "application/json"
                        }
                    })
                }
            }

            catch (e) {

            }
        }

        // socketContext.socket.onerror = (e) => {

        //     console.log(e);
        // }

        // return () => {

        //     //if (socketContext.socket.readyState == socketContext.socket.OPEN) {

        //         socketContext.socket.close();
        //     //}
        // }
    });





    // IF USER COME DIRECTLY FROM OUTSIDE APP -> ENTER URL LINK SPEAKIN DIRECTLY //

    useEffect(() => {

        let idUser: string | null = null;

        if (sessionStorage.getItem("user") !== null) {

            idUser = JSON.parse(sessionStorage.getItem("user") as string)['id'];
        }

        // INSERT USER_LANGUAGE_CONNECTED //

        const insertUserConnected = async () => {

            if (idUser !== null) {

                const response = await fetch(`${configContext.hostname}/api/user/${idUser}/language/${id}/connected`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    }
                })
            }
        }

        setTimeout(() => {

            insertUserConnected();
        }, 2000);


    }, []);




    

    const [isLoading, setIsLoading] = useState<boolean>(true);

    if (isLoading) {

        const errorElement = (document.getElementsByClassName("error--element")[0] as HTMLElement);
        const spanErrorElement = (document.getElementsByClassName("error--element--span")[0] as HTMLSpanElement);

        setTimeout(() => {

            if (sessionStorage.getItem("user") == null) {

                if (errorElement !== undefined) {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
    
                errorElement.classList.add("active");
                spanErrorElement.textContent = "You must be logged to access this area";
    
                setTimeout(() => {
                    errorElement.classList.remove("active");
                }, 2500);

                }

                router.push("/");
            }

            else {

                dataUserContext.setUser(JSON.parse(sessionStorage.getItem("user") as string));

                setIsLoading(false);
            }
            
        }, 1000);

        return <Loader />
    }



    return (
        
        <main className="main">

            <div className="main--register--slogan speak--language">
                <span className="main--register--slogan--span1">{slogan.first}<br /></span>
                <span className="main--register--slogan--span2">{slogan.second}<br /></span>
                <span className="main--register--slogan--span3">{slogan.third}</span>
            </div>

            <article className="main--article speak--language">

                <h2 className="main--register--title">Chat</h2>

                <div className="private--chat--users--online--wrap">
                    

                
                <div className="private--chat--element" onClick={handleClickPrivateChat}>

                    <Image
                        className="private--chat--element--mail--img"
                        alt="mail"
                        src={mail}
                        width={20}
                        height={20}
                    />

                    <span className="private--chat--element--span private--chat">Private chat</span>
                    <Image
                        className="arrow speak--language private--chat"
                        alt="arrow"
                        src={arrowDown}
                        width={15}
                        height={15}
                    />

                    <aside className="private--chat--element--wrap--element private--chat">

                        <div className="private--chat--element--div">

                            <h3 className="speak--language--users--element--title">
                                Private chat
                            </h3>

                            <div className="private--chat--element--div--wrap">
                                
                                <label className="private--chat--element--div--wrap--label" htmlFor="private--chat--element--select--users">
                                    User:
                                </label>

                                <select className="private--chat--element--select--users" name="private--chat--element--select--users" id="private--chat--element--select--users" onChange={handleChangeSelectPrivateUser}>
                                    <option value="-">-</option>
                                </select>
                            </div>


                            <section className="speak--language--chat--private--chat">
                            {   Array.from(Array(6).keys()).map( (elem, ind) => 

                                <div className="chat--message--wrap--fake" key={ind}>
                                    <span className="chat--message--user">Lorem, ipsum.</span>
                                    <span className="chat--message--message">Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio, nostrum?</span>
                                    <span className="chat--message--date">Lorem, ipsum dolor.</span>
                                </div>

                            )}
                            </section>



                            <div className="speak--language--chat--text--wrap">
                                <textarea name="speak--language--chat--text" className="speak--language--chat--text" id="speak--language--chat--text--private" onKeyDown={(e) => handleKeyDownMessage(e, "private")}></textarea>

                                <button type="button" className="video--call--button private--chat" name="video--call--button" id="video--call--button--private--chat" onClick={(e) => handleClickVideoCallButton("private", e)}>

                                    <Image
                                        className="video--call--img private--chat"
                                        alt="headphone"
                                        src={videoCall}
                                        width={15}
                                        height={15}
                                    />



                                    <div className="video--call--button--box private--chat">

                                        <form name="video--call--button--form" className="video--call--button--form" method="POST">

                                            <label htmlFor="video--call--button--form--input1" className="video--call--button--form--label">Set a private chat password:</label>

                                            <div className="video--call--button--form--input--wrap">
                                                <input type="text" name="video--call--button--form--input[]" className="video--call--button--form--input" id="video--call--button--form--input1" maxLength={1} onChange={handleChangeNextInput}/>

                                                <input type="text" name="video--call--button--form--input[]" className="video--call--button--form--input" id="video--call--button--form--input2" maxLength={1} onChange={handleChangeNextInput}/>

                                                <input type="text" name="video--call--button--form--input[]" className="video--call--button--form--input" id="video--call--button--form--input3" maxLength={1} onChange={handleChangeNextInput}/>

                                                <input type="text" name="video--call--button--form--input[]" className="video--call--button--form--input" id="video--call--button--form--input4" maxLength={1} onChange={handleChangeNextInput}/>
                                            </div>

                                            <div className="video--call--button--form--validate--wrap">
                                                <span className="video--call--button--form--span--reset" onClick={handleResetInputValues}>Reset</span>

                                                <span className="video--call--button--form--button--submit" onClick={handleSetVideoCallPassword}>Set</span>
                                            </div>

                                        </form>

                                    </div>

                                </button>

                                <button type="submit" className="speak--language--chat--text--submit" name="speak--language--chat--text--submit" id="speak--language--chat--text--submit--private" onClick={(e) => handleSendMessage("private", e)}>

                                    <Image
                                        className="arrow speak--language--chat--text--submit private--chat"
                                        alt="arrow"
                                        src={arrowDown}
                                        width={15}
                                        height={15}
                                    />

                                </button>
                            </div>

                        </div>

                    </aside>

                </div>



                
                <div className="speak--language--users" onClick={handleClickUsers}>

                    <span className="speak--language--users--span">Users</span>
                    <Image
                        className="arrow speak--language users"
                        alt="arrow"
                        src={arrowDown}
                        width={15}
                        height={15}
                    />

                    <aside className="speak--language--users--element--wrap">

                        <div className="speak--language--users--element">

                            <h3 className="speak--language--users--element--title">
                                Online
                            </h3>

                            <ul className="speak--language--users--element--ul">

                                {/*<li className="speak--language--users--element--ul--li">
                                    Example
                                </li>*/}

                            </ul>

                        </div>

                    </aside>

                </div>

                </div>

                <section className="speak--language--chat">

                    {   Array.from(Array(12).keys()).map( (elem, ind) => 

                        <div className="chat--message--wrap--fake" key={ind}>
                            <span className="chat--message--user">Lorem, ipsum.</span>
                            <span className="chat--message--message">Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio, nostrum?</span>
                            <span className="chat--message--date">Lorem, ipsum dolor.</span>
                        </div>

                    )}

                </section>
                
                <div className="speak--language--chat--text--wrap">
                    <textarea name="speak--language--chat--text" className="speak--language--chat--text" id="speak--language--chat--text" onKeyDown={(e) => handleKeyDownMessage(e, "general")}></textarea>

                    <button type="button" className="video--call--button" name="video--call--button" id="video--call--button" onClick={(e) => handleClickVideoCallButton("general", e)}>
                        <Image
                            className="video--call--img"
                            alt="headphone"
                            src={videoCall}
                            width={15}
                            height={15}
                        />
                    </button>

                    <button type="submit" className="speak--language--chat--text--submit general--chat" name="speak--language--chat--text--submit" id="speak--language--chat--text--submit" onClick={(e) => handleSendMessage("general", e)}>
                        <Image
                            className="arrow speak--language--chat--text--submit"
                            alt="arrow"
                            src={arrowDown}
                            width={15}
                            height={15}
                        />
                    </button>
                </div>
            </article>
        </main>
    )
                    //}
}