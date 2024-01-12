"use client";

import Link from "next/link";

export default function Header() {

    const handleClickMenu = (e: React.MouseEvent) => {

        const headerMenuNav = (document.getElementsByClassName("header--menu--nav")[0] as HTMLElement);

        headerMenuNav.classList.toggle("active");

        // CROSS SPAN ACTIVE TRANSITION //

        const headerMenuCross = (document.getElementsByClassName("header--menu--cross")[0] as HTMLDivElement);

        const spanCrossElement = (headerMenuCross.getElementsByClassName("header--menu--span") as HTMLCollectionOf<HTMLSpanElement>);

        Array.from(spanCrossElement).forEach( elem => elem.classList.toggle("active"));
    };

    return (

        <header className="header">
            
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
                        </Link>
                    </li>
                    
                    <li className="header--menu--nav--ul--li">
                        <Link className="header--menu--nav--ul--li--anchor" href="/register" onClick={handleClickMenu}>
                            <span className="header--menu--nav--ul--li--span">Register</span>
                        </Link>
                    </li>

                    <li className="header--menu--nav--ul--li">
                        <Link className="header--menu--nav--ul--li--anchor" href="/login" onClick={handleClickMenu}>
                            <span className="header--menu--nav--ul--li--span">Sign in</span>
                        </Link>
                    </li>

                </ul>

            </nav>

        </header>
    )
}