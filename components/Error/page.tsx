"use client";

import { useContext, useState } from "react";
import { ConfigContext, DataUserContext, UserContext, UserInterface } from "../../src/app/layout";
import { redirect, useRouter, usePathname } from "next/navigation";

export default function Error() {

    const userContext = useContext(UserContext);
    const configContext = useContext(ConfigContext);
    const dataUserContext = useContext(DataUserContext);

    const router = useRouter();
    const pathname = usePathname();

    const [user, setUser] = useState<UserInterface>({
        id: null,
        name: "",
        firstname: "",
        email: "",
        birthdate: "",
        address: "",
        zip: null,
        city: "",
        password: "",
        gender: "",
        role_name: "",
        jwt: "",
        photo: ""
    });



    // CONFIRM YES //

    const handleClickConfirmYes = async (e: React.FormEvent) => {

        e.preventDefault();

        const errorElement = (document.getElementsByClassName("error--element")[0] as HTMLElement);
        const spanErrorElement = (document.getElementsByClassName("error--element--span")[0] as HTMLSpanElement);

        const errorElementSetPassword = (document.getElementsByClassName("error--element--set--password")[0] as HTMLDivElement);


        if (window.location.pathname == "/profile") {

            errorElement.classList.remove("active_confirm");
            errorElementSetPassword.classList.add("active");
        }
    };



    // DELETE BUTTON CLICK //

    const handleClickDeleteAccount = async (e: React.MouseEvent<HTMLButtonElement>) => {

        const errorElement = (document.getElementsByClassName("error--element")[0] as HTMLElement);
        const spanErrorElement = (document.getElementsByClassName("error--element--span")[0] as HTMLSpanElement);

        const errorElementSetPassword = (document.getElementsByClassName("error--element--set--password")[0] as HTMLDivElement);


        const passwordDelete = (document.getElementsByClassName("register--password--delete")[0] as HTMLInputElement);
        const passwordDeleteConfirm = (document.getElementsByClassName("register--password--confirm--delete")[0] as HTMLInputElement);

        e.preventDefault()
        
        if (
            (passwordDelete.value == "" || passwordDeleteConfirm.value == "")
        ) {

            errorElementSetPassword.classList.remove("active");

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
            (passwordDelete.value !== "" && passwordDeleteConfirm.value !== "")
            &&
            (passwordDelete.value !== passwordDeleteConfirm.value)
        ) {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            errorElementSetPassword.classList.remove("active");

            errorElement.classList.add("active");
            spanErrorElement.textContent = "Passwords don't match";

            setTimeout(() => {
                errorElement.classList.remove("active");
            }, 2500);
        }


        else if (
            (passwordDelete.value !== "" && passwordDeleteConfirm.value !== "")
            &&
            (passwordDelete.value == passwordDeleteConfirm.value)
        ) {

            if (userContext.id !== null) {

                const responseCheck = await fetch(`${configContext.hostname}/api/user/check/password/${userContext.id}`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${userContext.jwt}`
                    },
                    body: JSON.stringify({
                        password: passwordDelete.value
                    })
                });

                const responseCheckData = await responseCheck.json();

                if (responseCheckData.hasOwnProperty("flag")) {

                    if (!responseCheckData.flag) {

                        errorElementSetPassword.classList.remove("active");

                        if (responseCheckData.hasOwnProperty("message")) {

                            window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            });
                
                            errorElement.classList.add("active");
                            spanErrorElement.textContent = responseCheckData.message;
        
                
                            setTimeout(() => {
                                errorElement.classList.remove("active");
                            }, 2500);
                        }
                    }

                    else if (responseCheckData.flag) {

                        // if true -> delete account //

                        const response = await fetch(`${configContext.hostname}/api/user/delete/${userContext.id}`, {
                            method: "DELETE",
                            headers: {
                                "Authorization": `Bearer ${userContext.jwt}`
                            }
                        });
        
                        const responseData = await response.json();
        
                        if (responseData.flag) {
        
                            errorElementSetPassword.classList.remove("active");
        
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            });
                
                            errorElement.classList.add("active_success");
                            spanErrorElement.textContent = "You have deleted your account successfully";
        
                
                            setTimeout(() => {
                                errorElement.classList.remove("active_success");
                                dataUserContext.setUser(user);
                                sessionStorage.removeItem("user");
                                router.push("/");
                            }, 2500);
                        }
                    }
                }
            }
        }
    };





    // CLICK CANCEL BUTTON //

    const handleClickCancel = (e: React.MouseEvent<HTMLButtonElement>) => {

        e.preventDefault();

        const errorElementSetPassword = (document.getElementsByClassName("error--element--set--password")[0] as HTMLDivElement);

        errorElementSetPassword.classList.remove("active");
    }







    // CONFIRM NO //

    const handleClickConfirmNo = (e: React.FormEvent) => {

        e.preventDefault();

        const errorElement = (document.getElementsByClassName("error--element")[0] as HTMLElement);
        const spanErrorElement = (document.getElementsByClassName("error--element--span")[0] as HTMLSpanElement);

        if (errorElement.classList.contains("active_confirm")) {

            errorElement.classList.remove("active_confirm");
        }
    };

    return (
        <>
        <aside className="error--element">
            <span className="error--element--span">
                
            </span>

            <div className="error--element--yes--no--wrap">
                <button className="error--element--button--yes" onClick={handleClickConfirmYes}>Yes</button>
                <button className="error--element--button--no" onClick={handleClickConfirmNo}>No</button>
            </div>
        </aside>
        
        <div className="error--element--set--password">
            <span className="error--element--set--password--span">Set your current password and click "Delete" to completely delete your account</span>

            <form className="error--element--set--password--form" name="error--element--set--password--form" method="POST">
                <div className="main--article--register--form--field--wrap">
                    <label htmlFor="register--password--delete" className="register--form--label">Password:</label>
                    <input type="password" name="register--password--delete" className="register--password--delete" id="register--password--delete" autoComplete="off"/>
                </div>

                <div className="main--article--register--form--field--wrap">
                    <label htmlFor="register--password--confirm--delete" className="register--form--label">Confirm password:</label>
                    <input type="password" name="register--password--confirm--delete" className="register--password--confirm--delete" id="register--password--confirm--delete" autoComplete="off"/>
                </div>

                <div className="error--element--set--password--form--button--wrap">
                    <button className="error--element--set--password--form--button--submit" name="error--element--set--password--form--button--submit" type="submit" onClick={handleClickDeleteAccount}>Delete</button>

                    <button className="error--element--set--password--form--button--cancel" name="error--element--set--password--form--button--cancel" type="button" onClick={handleClickCancel}>Cancel</button>
                </div>
                
            </form>
        </div>
        </>
    );
}