"use client";

import { ConfigContext, DataUserContext, UserContext } from "../../src/app/layout";

import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

import BackButton from "../BackButton/page";
import { usePathname, useRouter } from "next/navigation";

import logo from "../../public/assets/pictures/speakfluent-logo.svg";

export default function Header() {

    const router = useRouter();

    const pathname = usePathname();

    const userContext = useContext(UserContext);
    const configContext = useContext(ConfigContext);
    const dataUserContext = useContext(DataUserContext);

    

    const handleClickLogout = async (e: React.MouseEvent) => {

        e.preventDefault();

        const headerMenuNav = (document.getElementsByClassName("header--menu--nav")[0] as HTMLElement);

        const cloneUserContext = Object.assign({}, userContext);

        for (let ind = 0; ind < Object.keys(cloneUserContext).length; ind++) {

            if (Object.keys(cloneUserContext)[ind] == "id" ||
                Object.keys(cloneUserContext)[ind] == "zip") {

                (cloneUserContext as any)[Object.keys(cloneUserContext)[ind]] = null;
            }

            else {
                (cloneUserContext as any)[Object.keys(cloneUserContext)[ind]] = "";
            }
        }

        if (userContext !== null) {

            await fetch(`${configContext.hostname}/api/user/${userContext.id}/connected/delete`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${userContext.jwt}`
                }
            })
        }


        dataUserContext.setUser(cloneUserContext);

        sessionStorage.removeItem("user");

        headerMenuNav.classList.remove("active");

        const container = (document.getElementsByClassName("container")[0] as HTMLDivElement);
        const footer = (document.getElementsByClassName("footer")[0] as HTMLElement);

        headerMenuNav.classList.contains("active") ? (container.classList.add("active"), footer.classList.add("active")) : (container.classList.remove("active"), footer.classList.remove("active"));

        router.push("/");
    };



    const handleClickMenu = (e: React.MouseEvent) => {

        const errorElement = (document.getElementsByClassName("error--element")[0] as HTMLElement);
        const errorElementSetPassword = (document.getElementsByClassName("error--element--set--password")[0] as HTMLDivElement);

        errorElement.classList.remove("active_confirm");
        errorElement.classList.remove("active");
        errorElement.classList.remove("active_success");
        
        errorElementSetPassword.classList.remove("active");

        const headerMenuNav = (document.getElementsByClassName("header--menu--nav")[0] as HTMLElement);

        headerMenuNav.classList.toggle("active");





        // CROSS SPAN ACTIVE TRANSITION //

        const headerMenuCross = (document.getElementsByClassName("header--menu--cross")[0] as HTMLDivElement);

        const spanCrossElement = (headerMenuCross.getElementsByClassName("header--menu--span") as HTMLCollectionOf<HTMLSpanElement>);

        Array.from(spanCrossElement).forEach( elem => elem.classList.toggle("active"));






        // BLUR MAIN SITE //

        const container = (document.getElementsByClassName("container")[0] as HTMLDivElement);
        const footer = (document.getElementsByClassName("footer")[0] as HTMLElement);

        headerMenuNav.classList.contains("active") ? (container.classList.add("active"), footer.classList.add("active")) : (container.classList.remove("active"), footer.classList.remove("active"));

    };







    // PRIVATE CHAT + ONLINE USERS ABSOLUTE TO FIXED //

    useEffect(() => {

        const header = (document.getElementsByClassName("header")[0] as HTMLElement);
        const onlineUsers = (document.getElementsByClassName("speak--language--users")[0] as HTMLDivElement);
        const privateChat = (document.getElementsByClassName("private--chat--element")[0] as HTMLDivElement);

        let maxWidth400 = window.matchMedia("(max-width: 400px)");
        let minWidth400 = window.matchMedia("(min-width: 400px)");
        let maxWidth1100 = window.matchMedia("(max-width: 1100px)");
        let minWidth1100 = window.matchMedia("(min-width: 1100px)");
        let maxWidth1250 = window.matchMedia("(max-width: 1250px)");
        let minWidth1250 = window.matchMedia("(min-width: 1250px)");

        window.addEventListener("scroll", () => {

            if (onlineUsers !== undefined) {

                if (maxWidth400.matches) {

                    if ((window.scrollY - header.offsetTop >= 270) && (window.scrollY - header.offsetTop < 655)) {

                        onlineUsers.classList.remove("active_bottom")
                        privateChat.classList.remove("active_bottom");

                        onlineUsers.classList.add("active")
                        privateChat.classList.add("active");
                    }

                    else if ((window.scrollY - header.offsetTop >= 655)) {

                        onlineUsers.classList.remove("active")
                        privateChat.classList.remove("active");

                        onlineUsers.classList.add("active_bottom")
                        privateChat.classList.add("active_bottom");
                    }

                    else if (window.scrollY - header.offsetTop < 270) {

                        onlineUsers.classList.remove("active");
                        privateChat.classList.remove("active");
                    }
                }



                if (minWidth400.matches && maxWidth1100.matches) {

                    if ((window.scrollY - header.offsetTop >= 200) && (window.scrollY - header.offsetTop < 500)) {

                        onlineUsers.classList.remove("active_bottom")
                        privateChat.classList.remove("active_bottom");

                        onlineUsers.classList.add("active")
                        privateChat.classList.add("active");
                    }

                    else if ((window.scrollY - header.offsetTop >= 500)) {

                        onlineUsers.classList.remove("active")
                        privateChat.classList.remove("active");

                        onlineUsers.classList.add("active_bottom")
                        privateChat.classList.add("active_bottom");
                    }

                    else if ((window.scrollY - header.offsetTop < 200)) {

                        onlineUsers.classList.remove("active")
                        privateChat.classList.remove("active");
                    }
                }


                if (minWidth1100.matches && maxWidth1250.matches) {

                    if ((window.scrollY - header.offsetTop >= 208) && (window.scrollY - header.offsetTop < 588)) {

                        onlineUsers.classList.add("active")
                        privateChat.classList.add("active");

                        onlineUsers.classList.remove("active_bottom")
                        privateChat.classList.remove("active_bottom");
                    }

                    else if ((window.scrollY - header.offsetTop >= 588)) {

                        onlineUsers.classList.remove("active")
                        privateChat.classList.remove("active");

                        onlineUsers.classList.add("active_bottom")
                        privateChat.classList.add("active_bottom");
                    }

                    else if ((window.scrollY - header.offsetTop < 208)) {

                        onlineUsers.classList.remove("active")
                        privateChat.classList.remove("active");
                    }
                }


                if (minWidth1250.matches) {

                    if ((window.scrollY - header.offsetTop >= 208) && (window.scrollY - header.offsetTop < 588)) {

                        onlineUsers.classList.add("active")
                        privateChat.classList.add("active");

                        onlineUsers.classList.remove("active_bottom")
                        privateChat.classList.remove("active_bottom");
                    }

                    else if ((window.scrollY - header.offsetTop >= 588)) {

                        onlineUsers.classList.remove("active")
                        privateChat.classList.remove("active");

                        onlineUsers.classList.add("active_bottom")
                        privateChat.classList.add("active_bottom");
                    }

                    else if ((window.scrollY - header.offsetTop < 208)) {

                        onlineUsers.classList.remove("active")
                        privateChat.classList.remove("active");
                    }
                }

            }
        })
    });







    // DETECT LAST ACTIVITY DESKTOP //

    useEffect(() => {

        window.addEventListener("mousemove", () => {

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

        });
    });





    // DETECT LAST ACTIVITY MOBILE //

    useEffect(() => {

        window.addEventListener("touchstart", () => {

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

        });
    });




    // UPDATE USER LAST ACTIVITY + CHECK JWT //


    useEffect(() => {

            let timerIntervalLastActivityUpdate = setInterval(async () => {

                try {

                    const response = await fetch(`${configContext.hostname}/api/userlanguageconnected/updateactivity`, {
                        method: "PUT",
                        headers: {
                            "Content-type": "application/json",
                            "Authorization": `Bearer ${userContext.jwt}`
                        },
                        body: JSON.stringify({
                            user_id: userContext.id,
                            dateTime: configContext.lastActivity
                        })
                    });

                    if (!response.ok) {

                        throw new Error("network error");
                    }

                }

                catch (e) {

                }




                // check jwt //

                try {

                    const response = await fetch(`${configContext.hostname}/api/home/checkjwt`, {
                        method: "GET",
                        headers: {
                          "Content-type": "application/json",
                          "Authorization": `Bearer ${userContext.jwt}`
                        }
                      })
              
                    const responseData = await response.json();
                    
                    if (responseData.hasOwnProperty("flag")) {

                        if (!responseData.flag) {

                            dataUserContext.isJwtOk = false;
                        }
                    }
                }

                catch (e) {
                    
                }

            }, 120000); // 2 min //

            return () => clearInterval(timerIntervalLastActivityUpdate);
    });




    // GET USERS LAST ACTIVITY + REMOVE IF > 15MIN //

    useEffect(() => {

        let timerIntervalGetAllUsersConnected = setInterval(async () => {

            const response = await fetch(`${configContext.hostname}/api/userlanguageconnected/getall`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

        }, 300000); // 5 min //

        return () => clearInterval(timerIntervalGetAllUsersConnected);
    });















    // SET USER CONTEXT IF SESSION STORAGE USER ON //

    useEffect(() => {

        if (sessionStorage.getItem("user") !== null) {

            dataUserContext.setUser(JSON.parse(sessionStorage.getItem("user") as string));
        }

    }, []);







    // DELETE USER CONNECTED IF NOT /speakin //

    useEffect(() => {

        if (sessionStorage.getItem("user") !== null) {

            if (pathname == "/") {

                const idUser = JSON.parse(sessionStorage.getItem("user") as string)['id'];
                const jwtUser = JSON.parse(sessionStorage.getItem("user") as string)['jwt'];

                const deleteUserConnected = async () => {

                    try {
            
                        const response = await fetch(`${configContext.hostname}/api/user/${idUser}/connected/delete`, {
                            method: "DELETE",
                            headers: {
                                "Content-type": "application/json",
                                "Authorization": `Bearer ${jwtUser}`
                            }
                        })
                    }
            
                    catch (e) {

                    }
                }

                deleteUserConnected();
            }
        }
    });








    // ----------------------------- //


    return (

        <header className="header">

            {pathname !== "/" &&
                <BackButton />
            }

            {userContext.firstname !== "" &&
                <>
                <span className="welcome--span">Welcome</span>
                <span className="welcome--user--span">{userContext.firstname}!</span>
                </>
            }

            <Link href="/">
                <div className="header--logo--div">
                    <Image
                        className="header--logo--img"
                        alt="logo"
                        src={logo}
                        height={40}
                        width={80}
                        priority
                        unoptimized
                    />
                </div>
            </Link>
            
            <div className="header--menu" onClick={handleClickMenu}>
                <span className="header--menu--span"></span>
                <span className="header--menu--span"></span>
                <span className="header--menu--span"></span>
            </div>

            <nav className="header--menu--nav">

                <div className="header--menu--cross--wrap" onClick={handleClickMenu}>
                    <div className="header--menu--cross">
                        <span className="header--menu--span"></span>
                        <span className="header--menu--span"></span>
                    </div>
                </div>

                
                <ul className="header--menu--nav--ul">

                    <li className="header--menu--nav--ul--li">
                        <Link className="header--menu--nav--ul--li--anchor" href="/" onClick={handleClickMenu}>
                            <span className="header--menu--nav--ul--li--span">Home</span>
                            <span className="header--ul--a--line"></span>
                        </Link>
                    </li>
                    
                    <li className="header--menu--nav--ul--li">
                        <Link className="header--menu--nav--ul--li--anchor" href="/register" onClick={handleClickMenu}>
                            <span className="header--menu--nav--ul--li--span">Register</span>
                            <span className="header--ul--a--line"></span>
                        </Link>
                    </li>


                    {userContext == null || userContext.jwt == "" ?

                    <li className="header--menu--nav--ul--li">
                        <Link className="header--menu--nav--ul--li--anchor" href="/login" onClick={handleClickMenu}>
                            <span className="header--menu--nav--ul--li--span">Sign in</span>
                            <span className="header--ul--a--line"></span>
                        </Link>
                    </li>

                    :

                    <>
                    <li className="header--menu--nav--ul--li">
                        <Link className="header--menu--nav--ul--li--anchor" href="/profile" onClick={handleClickMenu}>
                            <span className="header--menu--nav--ul--li--span">Profile</span>
                            <span className="header--ul--a--line"></span>
                        </Link>
                    </li>

                    <li className="header--menu--nav--ul--li">
                        <Link className="header--menu--nav--ul--li--anchor" href="/login" onClick={handleClickLogout}>
                            <span className="header--menu--nav--ul--li--span">Logout</span>
                            <span className="header--ul--a--line"></span>
                        </Link>
                    </li>
                    </>

                    }

                </ul>

            </nav>

        </header>
    )
}