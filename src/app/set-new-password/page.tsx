"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ConfigContext } from "../main";
import { useContext } from "react";

export default function SetNewPassword() {

    const router = useRouter();

    const configContext = useContext(ConfigContext);

    const searchParams = useSearchParams();

    const tokenGet = searchParams.get("key");
    const mailGet = searchParams.get("mail");

    const handleSubmitSetNewPassword = async (e: React.FormEvent) => {

        e.preventDefault();

        const errorElement = (document.getElementsByClassName("error--element")[0] as HTMLElement);
        const spanErrorElement = (document.getElementsByClassName("error--element--span")[0] as HTMLSpanElement);

        const password = (document.getElementsByClassName("register--password")[0] as HTMLInputElement);
        const passwordConfirm = (document.getElementsByClassName("register--password--confirm")[0] as HTMLInputElement);

        if (password.value.length < 6) {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            errorElement.classList.add("active");
            spanErrorElement.textContent = "Password must be at least 6 characters long";

            setTimeout(() => {
                errorElement.classList.remove("active");
            }, 2500);
        }

        else if ((password.value !== "" && passwordConfirm.value !== "")
            &&
            (password.value == passwordConfirm.value)
            &&
            (password.value.length >= 6)
            ) {


                const response = await fetch(`${configContext.hostname}/api/resetpassword/check`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        email: mailGet,
                        token: tokenGet,
                        password: password.value
                    })
                });

                const responseData = await response.json();

                if (responseData.hasOwnProperty("flag")) {

                    if (!responseData.flag) {

                        if (responseData.hasOwnProperty("message")) {

                            window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            });
                
                            errorElement.classList.add("active");
                            spanErrorElement.textContent = responseData.message;
                
                            setTimeout(() => {
                                errorElement.classList.remove("active");
                            }, 2500);
                        }
                    }


                    else if (responseData.flag) {

                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });
            
                        errorElement.classList.add("active_success");
                        spanErrorElement.textContent = 'Password changed successfully';
            
                        setTimeout(() => {
                            errorElement.classList.remove("active_success");
                            router.push("/login");
                        }, 2500);
                    }
                }
        }

        else {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            errorElement.classList.add("active");
            spanErrorElement.textContent = 'Your password is not valid';

            setTimeout(() => {
                errorElement.classList.remove("active");
            }, 2500);
        }
    };

    return (

        <main className="main main--register">
            <article className="main--article main--article--register main--article--register--login">

                <h2 className="main--register--title reset">Set New Password</h2>

                <form name="main--article--register--for--login" className="main--article--register--form main--article--register--form--login" method="POST" onSubmit={handleSubmitSetNewPassword}>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--password" className="register--form--label">New Password: (min: 6 characters)</label>
                        <input type="password" name="register--password" className="register--password" id="register--password" autoComplete="off" minLength={6}/>
                    </div>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--password--confirm" className="register--form--label">Confirm password:</label>
                        <input type="password" name="register--password--confirm" className="register--password--confirm" id="register--password--confirm" autoComplete="off" minLength={6}/>
                    </div>

                    <button type="submit" name="register--submit--button" className="register--submit--button" id="register--submit--button">Submit</button>

                </form>
            </article>
        </main>
    );
}