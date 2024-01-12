"use client";

import { useContext } from "react";
import { ConfigContext } from "../layout";

export default function Register() {

    const configContext = useContext(ConfigContext);

    const handleSubmitRegister = async (e: React.FormEvent) => {

        e.preventDefault();
        
        const name = (document.getElementsByClassName("register--name")[0] as HTMLInputElement);
        const firstname = (document.getElementsByClassName("register--firstname")[0] as HTMLInputElement);
        const email = (document.getElementsByClassName("register--email")[0] as HTMLInputElement);
        const birthdate = (document.getElementsByClassName("register--birthdate")[0] as HTMLInputElement);
        const gender = (document.getElementsByClassName("register--gender")[0] as HTMLSelectElement);
        const address = (document.getElementsByClassName("register--address")[0] as HTMLInputElement);
        const zip = (document.getElementsByClassName("register--zip")[0] as HTMLInputElement);
        const city = (document.getElementsByClassName("register--city")[0] as HTMLInputElement);
        const password = (document.getElementsByClassName("register--password")[0] as HTMLInputElement);
        const passwordConfirm = (document.getElementsByClassName("register--password--confirm")[0] as HTMLInputElement);

        const errorElement = (document.getElementsByClassName("error--element")[0] as HTMLElement);
        const spanErrorElement = (document.getElementsByClassName("error--element--span")[0] as HTMLSpanElement);


        if (
            name.value == "" ||
            firstname.value == "" ||
            email.value == "" ||
            birthdate.value == "" ||
            gender.value == "" ||
            address.value == "" ||
            zip.value == "" ||
            city.value == "" ||
            password.value == "" ||
            passwordConfirm.value == ""
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

        else if (
            (name.value !== "" ||
            firstname.value !== "" ||
            email.value !== "" ||
            birthdate.value !== "" ||
            gender.value !== "" ||
            address.value !== "" ||
            zip.value !== "" ||
            city.value !== "" ||
            password.value !== "" ||
            passwordConfirm.value !== "")

            &&

            (password.value !== passwordConfirm.value)
        ) {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            errorElement.classList.add("active");
            spanErrorElement.textContent = "Passwords don't match, try again";

            setTimeout(() => {
                errorElement.classList.remove("active");
            }, 2500);
        }

        else if (
            (name.value !== "" ||
            firstname.value !== "" ||
            email.value !== "" ||
            birthdate.value !== "" ||
            gender.value !== "" ||
            address.value !== "" ||
            zip.value !== "" ||
            city.value !== "" ||
            password.value !== "" ||
            passwordConfirm.value !== "")

            &&

            (password.value == passwordConfirm.value)

        ) {

            const response = await fetch(`${configContext.hostname}/api/user/insert`, {

                method: "POST",
                /*headers: {
                    "Content-type": "application/json"
                },*/
                body: JSON.stringify({
                    name: name.value,
                    firstname: firstname.value,
                    email: email.value,
                    birthdate: birthdate.value,
                    gender: gender.value,
                    address: address.value,
                    zip: zip.value,
                    city: city.value,
                    password: password.value,
                })
            });

            const responseData = await response.json()
            
            if (responseData.hasOwnProperty('flag')) {

                if (responseData.flag) {

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
        
                    errorElement.classList.add("active_success");
                    spanErrorElement.textContent = "You have registered successfully";
        
                    setTimeout(() => {
                        errorElement.classList.remove("active_success");
                    }, 2500);
                }

                else if (!responseData.flag) {

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
        
                    errorElement.classList.add("active");
                    spanErrorElement.textContent = "User already registered";
        
                    setTimeout(() => {
                        errorElement.classList.remove("active");
                    }, 2500);
                }
            } 
        }
    };

    return (
        <main className="main main--register">
            
            <div className="main--register--slogan">
                <span className="main--register--slogan--span1">Create a new<br /></span>
                <span className="main--register--slogan--span2">account and<br /></span>
                <span className="main--register--slogan--span3">start talking!</span>
            </div>

            <article className="main--article main--article--register">

                <h2 className="main--register--title">Register</h2>

                <form name="main--article--register--form" className="main--article--register--form" method="POST" onSubmit={handleSubmitRegister}>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--name" className="register--form--label">Name:</label>
                        <input type="text" name="register--name" className="register--name" id="register--name" />
                    </div>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--firstname" className="register--form--label">Firstname:</label>
                        <input type="text" name="register--firstname" className="register--firstname" id="register--firstname" />
                    </div>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--email" className="register--form--label">Email:</label>
                        <input type="email" name="register--email" className="register--email" id="register--email" />
                    </div>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--birthdate" className="register--form--label">Birthdate:</label>
                        <input type="date" name="register--birthdate" className="register--birthdate" id="register--birthdate" />
                    </div>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--gender" className="register--form--label">Gender:</label>
                        <select name="register--gender" className="register--gender" id="register--gender">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--address" className="register--form--label">Address:</label>
                        <input type="text" name="register--address" className="register--address" id="register--address" />
                    </div>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--zip" className="register--form--label">Zip:</label>
                        <input type="number" name="register--zip" className="register--zip" id="register--zip" />
                    </div>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--city" className="register--form--label">City:</label>
                        <input type="text" name="register--city" className="register--city" id="register--city" />
                    </div>
                    
                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--password" className="register--form--label">Password:</label>
                        <input type="password" name="register--password" className="register--password" id="register--password" />
                    </div>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--password--confirm" className="register--form--label">Confirm password:</label>
                        <input type="password" name="register--password--confirm" className="register--password--confirm" id="register--password--confirm" />
                    </div>

                    <button type="submit" name="register--submit--button" className="register--submit--button" id="register--submit--button">Submit</button>

                </form>

            </article>
        </main>
    );
}