"use client";

import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { ConfigContext, DataUserContext, UserContext, UserInterface } from "../layout";

import undefinedImg from "../../../public/assets/pictures/undefined-img.svg";
import arrowDown from "../../../public/assets/pictures/arrow-down.svg";

import { redirect, useRouter } from "next/navigation";
import Loader from "../../../components/Loader/page";

export default function Profile() {

    const router = useRouter();

    const userContext = useContext(UserContext);
    const dataUserContext = useContext(DataUserContext);
    const configContext = useContext(ConfigContext);

    

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


    useEffect(() => {

        const cloneUserContext = Object.assign({}, userContext);

        cloneUserContext.password = "";

        setUser(cloneUserContext);
    }, []);


    // CLICK PASSWORD INPUT //

    const handleClickSetPassword = (e: React.MouseEvent<HTMLDivElement>) => {

        const divWrapSpanPassword = (document.getElementsByClassName("password--placeholder--div")[0] as HTMLDivElement);


        if ((e.target as HTMLSpanElement).className == "password--placeholder--span" ||
            (e.target as HTMLSpanElement).className == "password--placeholder--span--text") {

            if (!divWrapSpanPassword.classList.contains("active")) {

                divWrapSpanPassword.classList.add("active");
            }
        }
    };




    // UPDATE PROFILE //

    const handleSubmitUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const photo = (document.getElementsByClassName("register--photo")[0] as HTMLInputElement);
        const imgPhoto = (document.getElementsByClassName("register--photo--img")[0] as HTMLImageElement);

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
            let removeFile = "no";

            if (photo.value == "" && imgPhoto.src.includes("undefined-img")) {

                photoData = null;
                removeFile = "yes"
            }

            else if (photo.value == "" && !imgPhoto.src.includes("undefined-img")) {

                photoData = null;
                removeFile = "no";
            }

            else if (photo.value !== "") {

                photoData = (photo.files as any)[0];
                removeFile = "yes";
           }



           formData.append("photo", photoData);
           formData.append("removeFile", removeFile);
           formData.append("name", name.value);
           formData.append("firstname", firstname.value);
           formData.append("email", email.value);
           formData.append("birthdate", birthdate.value);
           formData.append("gender", gender.value);
           formData.append("address", address.value);
           formData.append("zip", zip.value);
           formData.append("city", city.value);
           formData.append("password", password.value);
           formData.append("user_id", (userContext as any).id);
           formData.append("jwt", userContext.jwt);

            const response = await fetch(`${configContext.hostname}/api/user/update`, {

                method: "POST",

                body: formData
            });

            const responseData = await response.json()


            if (responseData.hasOwnProperty("flag")) {

                if (responseData.flag) {

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
        
                    errorElement.classList.add("active_success");
                    spanErrorElement.textContent = "You have updated your profile successfully";

                    password.value = "";
                    passwordConfirm.value = "";

                    if (responseData.hasOwnProperty("user")) {

                        const newObjData = Object.assign({}, responseData.user);

                        newObjData.jwt = userContext.jwt;

                        dataUserContext.setUser(newObjData);

                        sessionStorage.setItem("user", JSON.stringify(newObjData));
                    }
        
                    setTimeout(() => {
                        errorElement.classList.remove("active_success");
                        router.push("/");
                    }, 2500);
                }

                else if (!responseData.flag) {

                    if (responseData.hasOwnProperty("message")) {


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
                    }


                    else {

                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });
        
                        errorElement.classList.add("active");
                        spanErrorElement.textContent = "Please, reconnect and try again";
            
                        setTimeout(() => {
                            errorElement.classList.remove("active");
                        }, 2500);
                    }
                }
            }
        }
    };




    // CONTROLLED INPUT UPDATE VALUE //

    const handleChangeValueProfile = (e: React.ChangeEvent <HTMLInputElement | HTMLSelectElement>, property: string) => {

        const propertyName = property;

        const cloneUserContext: any = Object.assign({}, user);

        cloneUserContext[propertyName] = e.target.value;

        setUser(cloneUserContext);
    };






    // CLICK ON DELETE BUTTON //

    const handleClickButtonDeleteAccount = (e: React.MouseEvent) => {

        e.preventDefault();

        const errorElement = (document.getElementsByClassName("error--element")[0] as HTMLElement);
        const spanErrorElement = (document.getElementsByClassName("error--element--span")[0] as HTMLSpanElement);

        errorElement.classList.toggle("active_confirm");

        if (errorElement.classList.contains("active_confirm")) {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }

        spanErrorElement.textContent = "Are you sure to delete your account ?";
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

                const cloneUserStorage = Object.assign({}, JSON.parse(sessionStorage.getItem("user") as string));

                cloneUserStorage.password = "";

                setUser(cloneUserStorage);

                setIsLoading(false);
            }
            
        }, 1000);

        return <Loader />
    }




    return (
        <main className="main main--register">
            
            <div className="main--register--slogan">
                <span className="main--register--slogan--span1">Update<br /></span>
                <span className="main--register--slogan--span2">your<br /></span>
                <span className="main--register--slogan--span3">profile</span>
            </div>

            <article className="main--article main--article--register profile">

                <h2 className="main--register--title">Modify</h2>

                <form name="main--article--register--form" className="main--article--register--form" method="POST" onSubmit={handleSubmitUpdateProfile}>

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

                            {user.photo == null || user.photo == "" ?
                                <Image
                                    className="register--photo--img undefined"
                                    alt="photo"
                                    src={undefinedImg}
                                    height={30}
                                    width={30}
                                    unoptimized
                                />
                            :

                                <Image
                                    className="register--photo--img"
                                    alt="photo"
                                    src={`${configContext.hostname}/assets/pictures/${user.photo}`}
                                    height={30}
                                    width={30}
                                    unoptimized
                                />
                            }

                    </div>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--name" className="register--form--label">Name:</label>
                        <input type="text" name="register--name" className="register--name" id="register--name" value={user.name} onChange={(e) => handleChangeValueProfile(e, "name")}/>
                    </div>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--firstname" className="register--form--label">Firstname:</label>
                        <input type="text" name="register--firstname" className="register--firstname" id="register--firstname" value={user.firstname} onChange={(e) => handleChangeValueProfile(e, "firstname")}/>
                    </div>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--email" className="register--form--label">Email:</label>
                        <input type="email" name="register--email" className="register--email" id="register--email" value={user.email} onChange={(e) => handleChangeValueProfile(e, "email")}/>
                    </div>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--birthdate" className="register--form--label">Birthdate:</label>
                        <input type="date" name="register--birthdate" className="register--birthdate" id="register--birthdate" value={user.birthdate} onChange={(e) => handleChangeValueProfile(e, "birthdate")}/>
                    </div>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--gender" className="register--form--label">Gender:</label>
                        <select name="register--gender" className="register--gender" id="register--gender" value={user.gender} onChange={(e) => handleChangeValueProfile(e, "gender")}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--address" className="register--form--label">Address:</label>
                        <input type="text" name="register--address" className="register--address" id="register--address" value={user.address} onChange={(e) => handleChangeValueProfile(e, "address")}/>
                    </div>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--zip" className="register--form--label">Zip:</label>
                        <input type="number" name="register--zip" className="register--zip" id="register--zip" value={user.zip == null ? "" : user.zip} onChange={(e) => handleChangeValueProfile(e, "zip")}/>
                    </div>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--city" className="register--form--label">City:</label>
                        <input type="text" name="register--city" className="register--city" id="register--city" value={user.city} onChange={(e) => handleChangeValueProfile(e, "city")}/>
                    </div>
                    
                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--password" className="register--form--label">Password: (min: 6 characters)</label>
                        <div className="password--wrap" onClick={handleClickSetPassword}>
                            <input type="password" name="register--password" className="register--password" id="register--password" value={user.password} onChange={(e) => handleChangeValueProfile(e, "password")} minLength={6} autoComplete="off"/>
                            <div className="password--placeholder--div">
                                <span className="password--placeholder--span">
                                    <span className="password--placeholder--span--text">Enter your current password or set a new one</span>
                                    </span>
                            </div>
                        </div>
                    </div>

                    <div className="main--article--register--form--field--wrap">
                        <label htmlFor="register--password--confirm" className="register--form--label">Confirm password:</label>
                        <input type="password" name="register--password--confirm" className="register--password--confirm" id="register--password--confirm" minLength={6} autoComplete="off"/>
                    </div>

                    <button type="submit" name="register--submit--button" className="register--submit--button" id="register--submit--button">Submit</button>

                </form>

            </article>

            <div className="delete--account--wrap">
                <button className="delete--account--button" onClick={handleClickButtonDeleteAccount}>Delete account</button>
            </div>
        </main>
    );
}