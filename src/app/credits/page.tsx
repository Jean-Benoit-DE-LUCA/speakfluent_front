"use client";

import Link from "next/link";

export default function Credits() {

    return (
        <article className="article--privacy">
            <div className="article--privacy--div">
                <span className="span--max">Credits</span>

                <span className="span--max">Graphic files</span>

                <ul className="credits--ul">

                    <li className="credits--ul--li">Undefined image by: <Link href="https://github.com/carbon-design-system/carbon?ref=svgrepo.com" target="_blank">Carbon design</Link> in Apache License via <Link href="https://www.svgrepo.com/" target="_blank">SVG Repo</Link>
                    </li>

                    <li className="credits--ul--li">Background image by: <Link href="https://www.freepik.com/free-photo/medium-shot-friends-chatting_15500766.htm#query=happy%20humans%20speaking&position=1&from_view=search&track=ais&uuid=7ab8f909-d1c2-4e5a-9f1d-5f3f89c7e722" target="_blank">Freepik</Link>
                    
                    </li>
                </ul>
            </div>
        </article>
    );
}