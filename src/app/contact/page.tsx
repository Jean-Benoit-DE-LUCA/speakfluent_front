"use client";

import { useContext } from "react";
import { ConfigContext } from "../main";
import { useRouter } from "next/navigation";

export default function Contact() {

    const router = useRouter();

    const configContext = useContext(ConfigContext);

    const handleSubmitContactMessage = async (e: React.FormEvent) => {

        e.preventDefault();

        const name = (document.getElementsByClassName("register--name")[0] as HTMLInputElement);
        const firstname = (document.getElementsByClassName("register--firstname")[0] as HTMLInputElement);
        const email = (document.getElementsByClassName("register--email")[0] as HTMLInputElement);
        const textareaField = (document.getElementsByClassName("contact--message")[0] as HTMLTextAreaElement);

        const errorElement = (document.getElementsByClassName("error--element")[0] as HTMLElement);
        const spanErrorElement = (document.getElementsByClassName("error--element--span")[0] as HTMLSpanElement);


        if (name.value == "" ||
            firstname.value == "" ||
            email.value == "" ||
            textareaField.value == "") {

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

        else if (name.value !== "" &&
                 firstname.value !== "" &&
                 email.value !== "" &&
                 textareaField.value !== "") {

            const response = await fetch(`${configContext.hostname}/api/contact`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    name: name.value,
                    firstname: firstname.value,
                    email: email.value,
                    message: textareaField.value
                })
            });

            const responseData = await response.json();

            if (responseData.hasOwnProperty("result")) {

                if (responseData.result) {

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
        
                    errorElement.classList.add("active_success");
                    spanErrorElement.textContent = "Your message has been sent successfully";
        
                    setTimeout(() => {
                        errorElement.classList.remove("active_success");
                        router.push("/");
                    }, 2000);
                }
            }
        }
    };

    return (
        <main className="main main--register">

            <article className="main--article main--article--register main--article--register--login">

                <h2 className="main--register--title">Contact</h2>

                <form name="main--article--register--for--login" className="main--article--register--form main--article--register--form--login" method="POST" onSubmit={handleSubmitContactMessage}>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--name" className="register--form--label">Name:</label>
                        <input type="text" name="register--name" className="register--name" id="register--name" />
                    </div>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--email" className="register--form--label">Firstname:</label>
                        <input type="text" name="register--firstname" className="register--firstname" id="register--firstname" />
                    </div>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--email" className="register--form--label">Email:</label>
                        <input type="email" name="register--email" className="register--email" id="register--email" />
                    </div>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="contact--message" className="register--form--label">Message:</label>
                        <textarea id="contact--message" name="contact--message" className="contact--message"></textarea>
                    </div>

                    <button type="submit" name="register--submit--button" className="register--submit--button" id="register--submit--button">Submit</button>

                </form>

            </article>
        </main>
    );
}