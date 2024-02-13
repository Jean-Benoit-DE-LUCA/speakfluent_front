"use client";

import { useContext } from "react";
import { useRouter } from 'next/navigation'
import { ConfigContext, DataUserContext, UserContext } from "../layout";
import Link from "next/link";

export default function Login() {

    const router = useRouter();

    const configContext = useContext(ConfigContext);
    const userContext = useContext(UserContext);
    const dataUserContext = useContext(DataUserContext);


    const handleSubmitLogin = async (e: React.FormEvent) => {

        e.preventDefault();

        const email = (document.getElementsByClassName("register--email")[0] as HTMLInputElement);
        const password = (document.getElementsByClassName("register--password")[0] as HTMLInputElement);

        const errorElement = (document.getElementsByClassName("error--element")[0] as HTMLElement);
        const spanErrorElement = (document.getElementsByClassName("error--element--span")[0] as HTMLSpanElement);


        if (
            email.value == "" ||
            password.value == ""
        ) {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            errorElement.classList.add("active");
            spanErrorElement.textContent = "Please fill in all the fields";

            setTimeout(() => {
                errorElement.classList.remove("active");
            }, 2500);
        }

        else {

            const response = await fetch(`${configContext.hostname}/api/user/find`, {
                method: "POST",
                body: JSON.stringify({
                    email: email.value,
                    password: password.value
                })
            })

            const responseData = await response.json();



            if (responseData.hasOwnProperty('user')) {

                if (!responseData.user) {

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
        
                    errorElement.classList.add("active");
                    spanErrorElement.textContent = "User not registered";
        
                    setTimeout(() => {
                        errorElement.classList.remove("active");
                    }, 2500);
                }

                else {

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
        
                    errorElement.classList.add("active_success");
                    spanErrorElement.textContent = "You have successfully authenticated";


                    sessionStorage.setItem("user", JSON.stringify(responseData.user));

                    dataUserContext.setUser(responseData.user);
                    dataUserContext.isJwtOk = true;
        
                    setTimeout(() => {
                        errorElement.classList.remove("active_success");
                        router.push("/");
                    }, 2500);
                }
            }

            if (responseData.hasOwnProperty('password')) {

                if (!responseData.password) {

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
        
                    errorElement.classList.add("active");
                    spanErrorElement.textContent = "Wrong password";
        
                    setTimeout(() => {
                        errorElement.classList.remove("active");
                    }, 2500);
                }
            }
        }
    };

    return (

        <main className="main main--register">

            <article className="main--article main--article--register main--article--register--login">

                <h2 className="main--register--title">Login</h2>

                <form name="main--article--register--for--login" className="main--article--register--form main--article--register--form--login" method="POST" onSubmit={handleSubmitLogin}>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--email" className="register--form--label">Email:</label>
                        <input type="email" name="register--email" className="register--email" id="register--email" />
                    </div>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--password" className="register--form--label">Password:</label>
                        <input type="password" name="register--password" className="register--password" id="register--password" autoComplete="off"/>
                    </div>

                    <button type="submit" name="register--submit--button" className="register--submit--button" id="register--submit--button">Submit</button>

                    <div className="anchor--reset--password--wrap">
                        <Link className="anchor--reset--password" href="/mail-password">Lost password?</Link>
                    </div>

                </form>

            </article>
        </main>
    );
}