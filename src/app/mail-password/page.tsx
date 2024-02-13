"use client";

import { useContext } from "react";
import { ConfigContext } from "../layout";

export default function MailPassword() {

    const configContext = useContext(ConfigContext);

    const handleSubmitResetPassword = async (e: React.FormEvent) => {

        const errorElement = (document.getElementsByClassName("error--element")[0] as HTMLElement);
        const spanErrorElement = (document.getElementsByClassName("error--element--span")[0] as HTMLSpanElement);

        e.preventDefault();

        const email = (document.getElementsByClassName("register--email")[0] as HTMLInputElement);

        if (email.value !== "" && email.value.includes("@")) {

            const response = await fetch(`${configContext.hostname}/api/resetpassword/generate`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    email: email.value
                })
            });

            const responseData = await response.json();
            
            

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
                spanErrorElement.textContent = 'An email has been sent to you to regenerate the password';
    
                setTimeout(() => {
                    errorElement.classList.remove("active_success");
                }, 2500);
            }
        }

        else {
            
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            errorElement.classList.add("active");
            spanErrorElement.textContent = 'Your email is not valid';

            setTimeout(() => {
                errorElement.classList.remove("active");
            }, 2500);
        }
    };

    return (
        <main className="main main--register">
            <article className="main--article main--article--register main--article--register--login">

                <h2 className="main--register--title reset">Reset Password</h2>

                <form name="main--article--register--for--login" className="main--article--register--form main--article--register--form--login" method="POST" onSubmit={handleSubmitResetPassword}>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--email" className="register--form--label">Email:</label>
                        <input type="email" name="register--email" className="register--email" id="register--email" />
                    </div>

                    <button type="submit" name="register--submit--button" className="register--submit--button" id="register--submit--button">Submit</button>

                </form>
            </article>
        </main>
    );
}