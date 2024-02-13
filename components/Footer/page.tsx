"use client";

import Link from "next/link";

import { usePathname } from 'next/navigation'

export default function Footer() {

    const pathname = usePathname();

    return (

        <footer className={pathname == "/register" 
                        || pathname == "/profile" 
                        || pathname == "/login" 
                        || pathname == "/mail-password" 
                        || pathname == "/contact" 
                        || pathname.startsWith("/set-new-password")
                        || pathname == "/privacy-policy" ? "footer register" 
                        : pathname == "/" ? "footer home" 
                        : pathname.startsWith("/speakin/") ? "footer speakin" 
                        : pathname.startsWith("/chat") ? "footer chat" 
                        : pathname == "/about-us" ? "footer about--us"
                        : pathname == "/credits"
                        || pathname == "/terms-of-service" ? "footer"
                        : "footer base"}>

            <ul className="footer--ul">
                <Link href="/contact" className="footer--ul--a">
                    <li className="footer--ul--li">Contact</li>
                    <span className="footer--ul--a--line"></span>
                </Link>

                <Link href="/about-us" className="footer--ul--a">
                    <li className="footer--ul--li">About us</li>
                    <span className="footer--ul--a--line"></span>
                </Link>

                <Link href="/privacy-policy" className="footer--ul--a">
                    <li className="footer--ul--li">Privacy policy</li>
                    <span className="footer--ul--a--line"></span>
                </Link>

                <Link href="/terms-of-service" className="footer--ul--a">
                    <li className="footer--ul--li">Terms of service</li>
                    <span className="footer--ul--a--line"></span>
                </Link>

                <Link href="/credits" className="footer--ul--a">
                    <li className="footer--ul--li">Credits</li>
                    <span className="footer--ul--a--line"></span>
                </Link>
            </ul>

            <span className="copyright--span">Copyright &copy; {new Date().getFullYear()} Speakfluent</span>

        </footer>
    )
}