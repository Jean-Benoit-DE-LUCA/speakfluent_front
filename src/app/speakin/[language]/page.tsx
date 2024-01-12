"use client"

import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { ConfigContext, SloganInterface, UserContext } from "../../layout";

import arrowDown from "../../../../public/assets/pictures/arrow-down.svg";
import videoCall from "../../../../public/assets/pictures/video-call.svg";

import { redirect, useRouter, useSearchParams } from "next/navigation";

export default function Language({ params }: { params: {language: string} }) {

    const socket = new WebSocket("ws://localhost:8081");

    const router = useRouter();

    const searchParams = useSearchParams();

    const id = searchParams.get("i");

    const configContext = useContext(ConfigContext);
    const userContext = useContext(UserContext);



    // USESTATE //

    const [timerFetch, setTimerFetch] = useState<boolean>(true);

    const [privateChat, setPrivateChat] = useState<object>({});

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
    };







    // SEND MESSAGE //

    const handleSendMessage = (chat: string, e?: React.MouseEvent) => {

        if (chat == "general") {


            // textarea 1 general//
            const messageText = (document.getElementsByClassName("speak--language--chat--text")[1] as HTMLTextAreaElement);

            const chatArea = (document.getElementsByClassName("speak--language--chat")[0] as HTMLElement);

            const dateTime = new Date();
            
            const dateFormat = dateTime.getFullYear() + "-" + (Number(dateTime.getMonth()) + 1) + "-" + dateTime.getUTCDate() + " " + dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds();



            // check if input is not empty //

            if (messageText.value !== "" && messageText.value.trim().length !== 0) {

                messageText.placeholder = "";

                createMessage(chatArea, userContext.firstname, messageText.value, dateFormat);

                socket.send(JSON.stringify({
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

            else if (messageText.value.trim().length == 0) {

                messageText.placeholder = "Empty messages are not allowed";
            }
        }




        else if (chat == "private") {

            // get select user value //
            const selectUser = (document.getElementsByClassName("private--chat--element--select--users")[0] as HTMLSelectElement);
            console.log(selectUser.value);

            // textarea 0 private //
            const messageText = (document.getElementsByClassName("speak--language--chat--text")[0] as HTMLTextAreaElement);

            const chatArea = (document.getElementsByClassName("speak--language--chat--private--chat")[0] as HTMLElement);

            const dateTime = new Date();
            
            const dateFormat = dateTime.getFullYear() + "-" + (Number(dateTime.getMonth()) + 1) + "-" + dateTime.getUTCDate() + " " + dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds();



            // check if input is not empty //

            if (messageText.value !== "" && messageText.value.trim().length !== 0) {

                messageText.placeholder = "";

                

                // add message to object state to distinct differents users conversations //

                const clonePrivateChat = Object.assign({}, privateChat);

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

                setPrivateChat(clonePrivateChat);







                // create message + send privateChat object to socket //

                createMessage(chatArea, userContext.firstname, messageText.value, dateFormat);

                socket.send(JSON.stringify({
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



            const userBoxElement = (document.getElementsByClassName("speak--language--users--element--wrap")[0] as HTMLElement);

            userBoxElement.classList.remove("active");


            // remove online users element active if contains //

            removeEachActiveOptionsUser();

            // remove video call box private //

            removePrivateVideoCallBox();



            setTimerFetch(true);
        }
    };







    // CLICK PRIVATE CHAT DIV USER //

    const handleClickPrivateChatUser = (user_id: string, user_firstname: string) => {

        console.log(user_id + " " + user_firstname);

        

        // remove active online users div + remove active options + set timer fetch ON //

        const userBoxElement = (document.getElementsByClassName("speak--language--users--element--wrap")[0] as HTMLElement);

        userBoxElement.classList.remove("active");

        removeEachActiveOptionsUser();

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

        loadPrivateMessages(e.currentTarget.value);
    }





    

    // GET USERS ONLINE BY LANGUAGE //

    const fetchUsersConnectedByLanguage = async (language_id: string) => {

        const response = await fetch(`${configContext.hostname}/api/language/${language_id}/getusers`, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        });

        const responseData = await response.json();


        manageUsersConnectedToList(responseData.usersOnline);
    
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

                /*const anchorElem = document.createElement("a");
                anchorElem.setAttribute("class", "speak--language--users--element--ul--anchor");
                anchorElem.setAttribute("href", "");*/

                // create li element //

                const liElem = document.createElement("li");
                liElem.setAttribute("class", "speak--language--users--element--ul--li");
                liElem.textContent = usersOnline[ind].firstname;
                liElem.setAttribute("data-id", usersOnline[ind].user_id);



                // create div options element //

                const divElem = document.createElement("div");
                divElem.setAttribute("class", "speak--language--users--element--ul--li--div--options");



                // create div options content elements //

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

                buttonPrivateChat.addEventListener("click", () => handleClickPrivateChatUser(usersOnline[ind].user_id, usersOnline[ind].firstname));

                //

                divWrapAge.append(spanLabelAge);
                divWrapAge.append(spanAge);

                divWrapGender.append(spanLabelGender);
                divWrapGender.append(spanGender);

                divWrapCity.append(spanLabelCity);
                divWrapCity.append(spanCity);

                buttonPrivateChat.append(spanHover)
                divWrapPrivateChat.append(buttonPrivateChat);

                divElem.append(divWrapAge);
                divElem.append(divWrapGender);
                divElem.append(divWrapCity);

                userContext.id !== usersOnline[ind].user_id ? divElem.append(divWrapPrivateChat) : "";

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

        if (e.target.className == "speak--language--users--element--ul--li") {


            const divOptions = (document.getElementsByClassName("speak--language--users--element--ul--li--div--options") as HTMLCollectionOf<HTMLDivElement>);

            const divOptionsUser = (e.currentTarget.getElementsByClassName("speak--language--users--element--ul--li--div--options")[0] as HTMLDivElement);




            for (let ind = 0; ind < divOptions.length; ind++) {

                if (divOptions[ind] !== divOptionsUser) {

                    divOptions[ind].classList.remove("active");
                }
            }




            // div options users toggle active for smooth render //

            if (divOptionsUser.classList.contains("active")) {

                setTimeout(() => {

                    divOptionsUser.classList.remove("active");
                }, 200);

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

                const resultFetch = await fetchUserDataById(e.target.getAttribute("data-id"));

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

                        // dynamic age + gender + city user //

                        divOptionsUser.children[0].children[1].textContent = resultFetch['userObj']['age'];
                        divOptionsUser.children[1].children[1].textContent = resultFetch['userObj']['gender'];
                        divOptionsUser.children[2].children[1].textContent = resultFetch['userObj']['city'];

                        //


                        divOptionsUser.classList.add("active");

                        setTimeout(() => {

                            // loop over childrens to add active to each one //

                            for (let ind = 0; ind < divOptionsUser.children.length; ind++) {

                                divOptionsUser.children[ind].classList.add("active");
                            }
                        }, 200);

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







    // LOAD PRIVATE MESSAGES //

    const loadPrivateMessages = (user_id_to_load: string) => {

        const selectUser = (document.getElementsByClassName("private--chat--element--select--users")[0] as HTMLSelectElement);
        const chatArea = (document.getElementsByClassName("speak--language--chat--private--chat")[0] as HTMLElement);

        const divMessages = (document.getElementsByClassName("chat--message--wrap") as HTMLCollectionOf<HTMLDivElement>);

        console.log(user_id_to_load);
        console.log(privateChat);


        const divPrivateMessages = (chatArea.getElementsByClassName("chat--message--wrap") as HTMLCollectionOf<HTMLDivElement>);

        console.log(divPrivateMessages);

        
        // while there is childs messages -> remove //

        while (divPrivateMessages.length > 0) {

            for (let ind = 0; ind < divPrivateMessages.length; ind++) {

                divPrivateMessages[ind].remove();
            }
        }






        // if key exist in privateChat object -> empty + load all messages //

        // if key "-" exists (user speak to himself) load messages //


        if (((privateChat as any)[user_id_to_load]) !== undefined) {


            while (divPrivateMessages.length > 0) {

                for (let ind = 0; ind < divPrivateMessages.length; ind++) {
    
                    divPrivateMessages[ind].remove();
                }
            }

            console.log(divPrivateMessages);

            for (let ind = 0; ind < ((privateChat as any)[user_id_to_load]).length; ind++) {

                createMessage(chatArea, (privateChat as any)[user_id_to_load][ind].firstname, (privateChat as any)[user_id_to_load][ind].message, (privateChat as any)[user_id_to_load][ind].date);
            }
        }

        else if (((privateChat as any)[user_id_to_load]) == undefined) {


            while (divPrivateMessages.length > 0) {

                for (let ind = 0; ind < divPrivateMessages.length; ind++) {

                    divPrivateMessages[ind].remove();
                }
            }



            console.log(divPrivateMessages);
        }
    }



    // ----------------------------- PASSWORD VIDEO CALL ----------------------------- //

    // SET PASSWORD VIDEO CALL //

    const handleSetVideoCallPassword = async (e: React.MouseEvent<HTMLButtonElement>) => {

        e.preventDefault();

        const errorElement = (document.getElementsByClassName("error--element")[0] as HTMLElement);
        const spanErrorElement = (document.getElementsByClassName("error--element--span")[0] as HTMLSpanElement);

        const selectUser = (document.getElementsByClassName("private--chat--element--select--users")[0] as HTMLSelectElement);

        const videoCallBoxPrivate = (document.getElementsByClassName("video--call--button--box private--chat")[0] as HTMLDivElement);

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
                        languageId: Number(id)
                    })
                })

                const responseData = await response.json();
                console.log(responseData);

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

                        console.log(responseData);

                        createLinkPrivateChat(chatArea, responseData.lastRowInserted[0]["id"]);

                        chatArea.scrollTo({
                            top: chatArea.scrollHeight,
                            behavior: "smooth"
                        });
                    }
                }
            }
        }
    }



    // RESET INPUT VALUES //

    const handleResetInputValues = (e: React.MouseEvent) => {

        const inputValuesPassword = (document.getElementsByClassName("video--call--button--form--input") as HTMLCollectionOf<HTMLInputElement>);

        for (let ind = 0; ind < inputValuesPassword.length; ind++) {

            inputValuesPassword[ind].value = "";
        }
    };


    // --------------------------- //







    // CREATE LINK PRIVATE CHAT //

    const createLinkPrivateChat = (wrap: HTMLElement, idPrivateChat: number) => {

        const divElement = document.createElement("div");
        divElement.setAttribute("class", "chat--message--wrap");

        const anchorElement = document.createElement("a");
        anchorElement.setAttribute("class", "link--private--chat");
        anchorElement.setAttribute("href", `/chat?i=${id}&pv=${idPrivateChat}`);
        anchorElement.setAttribute("target", "_blank");
        anchorElement.textContent = `Private chat invitation #${idPrivateChat}`;

        divElement.append(anchorElement);

        wrap.append(divElement);



        // create listener //

        anchorElement.addEventListener("click", (e) => handleClickAnchorPrivateChat(e, /* id language */ Number(id), idPrivateChat));
    };


    // HANDLE CLICK ANCHOR PRIVATE CHAT //

    const handleClickAnchorPrivateChat = (e: any, idLanguage: number, idPrivateChat: number) => {

        console.log(e.currentTarget);
        console.log(idLanguage);
        console.log(idPrivateChat);
        console.log(userContext);
        document.cookie = `user=${JSON.stringify(userContext)}`;
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


    // SET SLOGAN //

    useEffect(() => {

        setSloganFunc(params.language);
    }, []);

    // --------------------------- //





    // HANDLE CLICK VIDEO CALL //

    const handleClickVideoCallButton = (chat: string, e?: any) => {

        e?.preventDefault();

        if (e?.target.className == "video--call--img private--chat" ||
            e?.target.className == "video--call--button private--chat") {

                if (chat == "private") {

                    const videoCallButtonBox = (document.getElementsByClassName("video--call--button--box private--chat")[0] as HTMLDivElement);
        
                    videoCallButtonBox.classList.toggle("active");


                    const selectUser = (document.getElementsByClassName("private--chat--element--select--users")[0] as HTMLSelectElement);

                    if (videoCallButtonBox.classList.contains("active")) {

                        selectUser.classList.add("active");
                    }

                    else if (!videoCallButtonBox.classList.contains("active")) {

                        selectUser.classList.remove("active");
                    }
                }
        }
        
        
    }

    // --------------------------- //


    

    // WEBSOCKET //

    useEffect(() => {

        let fetchUsersConnectedByLanguageInterval: any;

        console.log(timerFetch);

        if (timerFetch) {

            fetchUsersConnectedByLanguageInterval = setInterval(() => {
                fetchUsersConnectedByLanguage(id as string);
            }, 5000);
        }

        else if (!timerFetch) {

            clearInterval(fetchUsersConnectedByLanguageInterval);
        }
        
        return () => clearInterval(fetchUsersConnectedByLanguageInterval);
        
        
    }, [timerFetch]);

    useEffect(() => {

        socket.onopen = async (e) => {

            // INSERT USER_LANGUAGE_CONNECTED //

            const response = await fetch(`${configContext.hostname}/api/user/${userContext.id}/language/${id}/connected`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                }
            });

            /*const responseData = await response.json();
            console.log(responseData);*/

            /*socket.send(JSON.stringify({
                userConnect: {
                    userFirstName: userContext.firstname,
                    userId: userContext.id,
                    languageId: id
                }
            }));*/
        };

        socket.onmessage = (e) => {

            let objData = JSON.parse(e.data);

            //console.log(objData);
            if (objData.hasOwnProperty("message")) {

                if (objData.message.language == params.language) {

                    // if general chat //
                    if (!objData.message.hasOwnProperty("private_user")) {

                        const chatArea = (document.getElementsByClassName("speak--language--chat")[0] as HTMLElement);

                        createMessage(chatArea, objData.message.firstname, objData.message.message, objData.message.date);
                    }

                    // if private chat //
                    if (objData.message.hasOwnProperty("private_user")) {

                        const selectUser = (document.getElementsByClassName("private--chat--element--select--users")[0] as HTMLSelectElement);
                        const chatArea = (document.getElementsByClassName("speak--language--chat--private--chat")[0] as HTMLElement);

                        if (objData.message.private_user == userContext.id) {

                            console.log(objData);
                            console.log(privateChat);

                            // set new message value in sending user property //

                            const newUserObjArrayMessage = {};

                            const newClonePrivateChat = Object.defineProperty(newUserObjArrayMessage, objData.message.sending_user, {
                                value: objData.clonePrivateChat,
                                enumerable: true,
                                writable: true
                                }
                            );

                            setPrivateChat(Object.assign(privateChat, newClonePrivateChat));

                            console.log(privateChat);

                            




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



                                // select default value of select //

                                //selectUser.value = objData.message.sending_user;




                                // add data-user_id attribute to chat section //

                                chatArea.setAttribute("data-user_id", objData.message.sending_user);
                            }



                            console.log(selectUser.value);
                            console.log(objData.message.sending_user);

                            
                            // if user has sending_user selected option -> empty all messages before update with new array of messages = live chat //

                            if (selectUser.value == objData.message.sending_user) {

                                loadPrivateMessages(objData.message.sending_user);
                            }

                            
                            //loadPrivateMessages(objData.message.sending_user);



                            //---//
                        }
                    }

                    
                }
            }
            
            /*if (objData.hasOwnProperty("userConnect")) {

                newUserConnected(objData.userConnect.userFirstName, objData.userConnect.userId);
            }

            else if (objData.hasOwnProperty("userDisconnect")) {

                userDisconnect(objData.userDisconnect.userFirstName, objData.userDisconnect.userId)
            }*/
        };

        socket.onclose = async (e) => {

            const response = await fetch(`${configContext.hostname}/api/user/${userContext.id}/language/${id}/connected/delete`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json"
                }
            })
            /*socket.send(JSON.stringify({
                userDisconnect: {
                    userFirstName: userContext.firstname,
                    userId: userContext.id
                }
            }));*/
        }

        socket.onerror = (e) => {

            console.log(e);
        }

        return () => {

            socket.close();
        }
    });





    if (userContext.id == null) {

        redirect("/");
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

                <div className="private--chat--element" onClick={handleClickPrivateChat}>

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

                                <button type="submit" className="speak--language--chat--text--submit" name="speak--language--chat--text--submit" id="speak--language--chat--text--submit" onClick={(e) => handleSendMessage("private", e)}>

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
                        className="arrow speak--language"
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

                <section className="speak--language--chat">

                    {   Array.from(Array(6).keys()).map( (elem, ind) => 

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
}