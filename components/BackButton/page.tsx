"use client";

import Image from "next/image";

import leftArrow from "../../public/assets/pictures/left-arrow.svg";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { ConfigContext, UserContext } from "../../src/app/layout";

export default function BackButton() {

    const router = useRouter();

    const pathname = usePathname();

    const configContext = useContext(ConfigContext);
    const userContext = useContext(UserContext);

    const handleClickBackButton = (e: React.MouseEvent) => {

        e.preventDefault();

        const errorElement = (document.getElementsByClassName("error--element")[0] as HTMLElement);
        const errorElementSetPassword = (document.getElementsByClassName("error--element--set--password")[0] as HTMLDivElement);

        errorElement.classList.remove("active_confirm");
        errorElement.classList.remove("active");
        errorElement.classList.remove("active_success");

        errorElementSetPassword.classList.remove("active");

        if (pathname.startsWith("/speakin")) {

            router.push("/");
        }

        else {

            window.history.back();
        }
    };

    useEffect(() => {

        window.addEventListener("popstate", () => {

            const errorElement = (document.getElementsByClassName("error--element")[0] as HTMLElement);
            const errorElementSetPassword = (document.getElementsByClassName("error--element--set--password")[0] as HTMLDivElement);
    
            errorElement.classList.remove("active_confirm");
            errorElement.classList.remove("active");
            errorElement.classList.remove("active_success");
            
            errorElementSetPassword.classList.remove("active");

            window.history.back();

        });
    }, []);

    return (

        <div className="back--button--wrap" onClick={handleClickBackButton}>
            <Image
                className="back--button--img"
                alt="left-arrow"
                src={leftArrow}
                height={30}
                width={30}
                unoptimized
            />
        </div>
    );
}