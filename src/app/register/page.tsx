"use client";

import Image from "next/image";
import { useContext } from "react";
import { ConfigContext, DataUserContext } from "../layout";
import { useRouter } from "next/navigation";

import undefinedImg from "../../../public/assets/pictures/undefined-img.svg";
import arrowDown from "../../../public/assets/pictures/arrow-down.svg";

export default function Register() {

    const router = useRouter();

    const configContext = useContext(ConfigContext);
    const dataUserContext = useContext(DataUserContext);

    const handleSubmitRegister = async (e: React.FormEvent) => {

        e.preventDefault();
        
        const photo = (document.getElementsByClassName("register--photo")[0] as HTMLInputElement);
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

            (/[0-9]+/.test(zip.value) == false)
        ) {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            errorElement.classList.add("active");
            spanErrorElement.textContent = "Zip code must be composed of numbers only";

            setTimeout(() => {
                errorElement.classList.remove("active");
            }, 2500);
        }


        else if (
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
            spanErrorElement.textContent = "Passwords don't match";

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

            (password.value.length < 6)
        ) {

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

            (password.value.length >= 6)

            &&

            (password.value == passwordConfirm.value)

        ) {

            const formData = new FormData();

            let photoData = null;

            if (photo.value == "") {

                photoData = null;
            }

            else if (photo.value !== "") {

                photoData = (photo.files as any)[0];
           }

           formData.append("photo", photoData);
           formData.append("name", name.value);
           formData.append("firstname", firstname.value);
           formData.append("email", email.value);
           formData.append("birthdate", birthdate.value);
           formData.append("gender", gender.value);
           formData.append("address", address.value);
           formData.append("zip", zip.value);
           formData.append("city", city.value);
           formData.append("password", password.value);

            const response = await fetch(`${configContext.hostname}/api/user/insert`, {

                method: "POST",

                body: formData
            });

            const responseData = await response.json()

            
            if (responseData.hasOwnProperty('flag')) {

                if (responseData.flag) {


                    // login when registered//

                    const responseSignIn = await fetch(`${configContext.hostname}/api/user/find`, {
                        method: "POST",
                        body: JSON.stringify({
                            email: email.value,
                            password: password.value
                        })
                    })

                    const responseSignInData = await responseSignIn.json();

                    if (responseSignInData.hasOwnProperty('user')) {

                        if (responseSignInData.user) {

                            dataUserContext.setUser(responseSignInData.user);
                            sessionStorage.setItem("user", JSON.stringify(responseSignInData.user));
                            dataUserContext.isJwtOk = true;
                        }
                    }

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
        
                    errorElement.classList.add("active_success");
                    spanErrorElement.textContent = "You have registered successfully";
        
                    setTimeout(() => {
                        errorElement.classList.remove("active_success");
                        router.push("/");
                    }, 2500);
                }

                else if (!responseData.flag) {

                    if (responseData.message !== null) {

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

                    else {

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
        }
    };



    // CHANGE PHOTO FILE //

    const handleChangePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {

        const imgPhoto = (document.getElementsByClassName("register--photo--img")[0] as HTMLImageElement);


        if (e.target.files !== undefined) {

            const reader = new FileReader();

            reader.addEventListener("load", (e) => {

                imgPhoto.src = e.target?.result as string;
            });

            if ((e.target?.files as any)[0] instanceof Blob) {

                reader.readAsDataURL((e.target.files as any)[0]);

                imgPhoto.classList.remove("undefined");
            }
        }
        
    };






    // RESET PICTURE //

    const handleClickCrossResetPicture = (e: React.MouseEvent<HTMLSpanElement>) => {

        const inputFilePhoto = (document.getElementsByClassName("register--photo")[0] as HTMLInputElement);

        const imgPhoto = (document.getElementsByClassName("register--photo--img")[0] as HTMLImageElement);

        inputFilePhoto.value = "";

        imgPhoto.src = "../../assets/pictures/undefined-img.svg";

        imgPhoto.classList.add("undefined");
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

                <form name="main--article--register--form" className="main--article--register--form" method="POST" onSubmit={handleSubmitRegister} noValidate>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--photo" className="register--form--label">Photo:
                        
                            <span className="upload--span">
                                <Image
                                    className="upload--span--img"
                                    alt="arrow"
                                    src={arrowDown}
                                    height={20}
                                    width={20}
                                    unoptimized
                                />
                            </span>
                        </label>

                        <span className="upload--span cross" onClick={handleClickCrossResetPicture}>
                            X        
                        </span>
                        
                        <input type="file" name="register--photo" className="register--photo" id="register--photo" onChange={handleChangePhoto}/>
                        <Image
                            className="register--photo--img undefined"
                            alt="photo"
                            src={undefinedImg}
                            height={30}
                            width={30}
                            unoptimized
                        />
                    </div>

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
                        <label htmlFor="register--birthdate" className="register--form--label">Birthdate: (min: 15 years old)</label>
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
                        <label htmlFor="register--password" className="register--form--label">Password: (min: 6 characters)</label>
                        <input type="password" name="register--password" className="register--password" id="register--password" minLength={6} autoComplete="off"/>
                    </div>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--password--confirm" className="register--form--label">Confirm password:</label>
                        <input type="password" name="register--password--confirm" className="register--password--confirm" id="register--password--confirm" minLength={6} autoComplete="off"/>
                    </div>

                    <button type="submit" name="register--submit--button" className="register--submit--button" id="register--submit--button">Submit</button>

                </form>

            </article>
        </main>
    );
}