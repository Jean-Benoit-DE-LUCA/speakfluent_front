"use client";

import Link from "next/link";
import Image from "next/image";

import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from "react";
import { ConfigContext, UserContext } from "./main";

import talkIcon from "../../public/assets/pictures/icon-both-talk_.png";
import padLock from "../../public/assets/pictures/padlock_.png";
import heart from "../../public/assets/pictures/heart.svg";

import arrowDown from "../../public/assets/pictures/arrow-down.svg";

export default function Home() {

  const router = useRouter();

  const configContext = useContext(ConfigContext);
  const userContext = useContext(UserContext);

  // FETCH LANGUAGES //

  const [language, setLanguage] = useState({});

  const fetchLanguage = async () => {

    const response = await fetch(`${configContext.hostname}/api/home`, {
      method: "GET",
      headers: {
        "Content-type": "application/json"
      }
    });

    const responseData = await response.json();
    
    const newObj = {};

    for (let ind = 0; ind < responseData.language.length; ind++) {

      Object.defineProperty(newObj, responseData.language[ind].id, {
        value: responseData.language[ind].name,
        writable: true,
        enumerable: true
      });
    }

    setLanguage(newObj);
  };

  // CHANGE TEXT CONTENT BUTTON DEPENDING SELECT OPTION //

  const handleChangeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {

    const buttonSubmit = (document.getElementsByClassName("select--language--button")[0] as HTMLButtonElement);

    const selectLanguage = e.currentTarget;
    
    selectLanguage.value == "english" ? buttonSubmit.textContent = "Go!" : selectLanguage.value == "french" ? buttonSubmit.textContent = "Allez!" : selectLanguage.value == "german" ? buttonSubmit.textContent = "Gehen!" : selectLanguage.value == "italian" ? buttonSubmit.textContent = "Andare!" : selectLanguage.value == "arab" ? buttonSubmit.textContent = "اذهب!" : selectLanguage.value == "spanish" ? buttonSubmit.textContent = "¡Ir!" : "";

  };

  // GET SELECTED LANGUAGE AND PASS IT ANCHOR //

  const handleSubmitLanguage = async (e: React.FormEvent) => {

    e.preventDefault();

    const errorElement = (document.getElementsByClassName("error--element")[0] as HTMLElement);
    const spanErrorElement = (document.getElementsByClassName("error--element--span")[0] as HTMLSpanElement);

    const selectLanguage = (document.getElementsByClassName("select--language")[0] as HTMLSelectElement);

    if (selectLanguage.options[selectLanguage.selectedIndex] !== undefined ) {

      if (userContext.jwt !== "") {

        const response = await fetch(`${configContext.hostname}/api/home/checkjwt`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${userContext.jwt}`
          }
        })

        const responseData = await response.json();

        if (responseData.hasOwnProperty("flag")) {

          if (responseData.flag) {

            router.push(`/speakin/${selectLanguage.value}?i=${selectLanguage.options[selectLanguage.selectedIndex].getAttribute("data-id")}`);
          }

          else if (!responseData.flag) {

            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });
    
            errorElement.classList.add("active");
            spanErrorElement.textContent = "Session has expired, please sign in again";
    
            setTimeout(() => {
                errorElement.classList.remove("active");
            }, 2500);
          }
        }
      }


      else if (userContext.jwt == "") {

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


    }
  };







  // INTERSECTION OBSERVER //

  useEffect(() => {

    const homeMessageElement = (document.getElementsByClassName("home--message--element") as HTMLCollectionOf<HTMLElement>);
    const arrowImg = (document.getElementsByClassName("arrow--message--wrap") as HTMLCollectionOf<HTMLDivElement>);
    const liElementWhySection = (document.getElementsByClassName("why--section--ul--li") as HTMLCollectionOf<HTMLLIElement>);

    const observer = new IntersectionObserver( entries => {

      entries.forEach( entry => {

        if (entry.isIntersecting) {
          
          entry.target.classList.add("active");
        }

      });

    });


    // loop message elements //
    
    Array.from(homeMessageElement).forEach( elem => {

      observer.observe(elem);
    } )



    // loop arrow elements //

    Array.from(arrowImg).forEach( elem => {

      observer.observe(elem);
    })




    // loop li why section //

    Array.from(liElementWhySection).forEach( elem => {

      observer.observe(elem);
    })

  }, []);





  // FETCH LANGUAGES //

  useEffect(() => {
    
    try {
      fetchLanguage();
    }
    catch (e) {
      
    }
  }, []);

  return (
    <main className="main main--home">

      <article className="main--article">

        <span className="main--article--span--talk">Let's talk in:</span>

        <form name="select--language--form" className="select--language--form" method="POST">

          <select name="select--language" className="select--language" onChange={handleChangeLanguage}>

            {Object.keys(language).map( elem => 
              <option value={(language as any)[elem]} key={elem} data-id={elem}>
                {
                  (language as any)[elem] == "english" ? "English" : 
                  (language as any)[elem] == "french" ? "Français" :
                  (language as any)[elem] == "italian" ? "Italiano" :
                  (language as any)[elem] == "german" ? "Deutsch" :
                  (language as any)[elem] == "arab" ? "عربي" :
                  (language as any)[elem] == "spanish" ? "Español" : ""
                }
              </option>
            )}

          </select>


          <button name="select--language--button" className="select--language--button" id="select--language--button" onClick={handleSubmitLanguage}>Go!</button>

        </form>
        
      </article>

      <div className="home--message--element--why--section--wrap">

      <article className="home--message--element--wrap">

        <section className="home--message--element">

          <Image
            className="home--message--element--img"
            alt="img-message-element"
            src={talkIcon}
            width={30}
            height={30}
            unoptimized
          />  
          <span className="home--message--element--span">Connect and communicate with style! Written chat or video chat, your voice finds its home on our platform.</span>
        
        </section>


        <div className="arrow--message--wrap">
          <Image
            className="arrow--message--img left"
            alt="arrow-message"
            src={arrowDown}
            width={30}
            height={30}
          />

          <Image
            className="arrow--message--img right"
            alt="arrow-message"
            src={arrowDown}
            width={30}
            height={30}
          />
        </div>


        <section className="home--message--element">

          <Image
            className="home--message--element--img"
            alt="img-message-element"
            src={padLock}
            width={30}
            height={30}
            unoptimized
          />  
          <span className="home--message--element--span">Chat with confidence, your privacy is our priority. Here your words are yours and only yours.</span>
        
        </section> 


        <div className="arrow--message--wrap">
          <Image
            className="arrow--message--img left"
            alt="arrow-message"
            src={arrowDown}
            width={30}
            height={30}
          />

          <Image
            className="arrow--message--img right"
            alt="arrow-message"
            src={arrowDown}
            width={30}
            height={30}
          />
        </div>



        <section className="home--message--element">

          <Image
            className="home--message--element--img heart"
            alt="img-message-element"
            src={heart}
            width={30}
            height={30}
            unoptimized
          />  
          <span className="home--message--element--span">Chat without bounds, feel the joy of sharing. On our platform, communication is simple, but connection runs deep.</span>
        
        </section>

      </article>


      <div className="why--section">

        <p className="why--section--p">
        Welcome to Speakfluent, where language barriers disappear, and connections thrive. Our video chat platform is designed to make communication across different languages seamless and enjoyable. Here's why you should choose us:
        </p>

        <ul className="why--section--ul">
          <li className="why--section--ul--li"><strong>Connect in Your Preferred Language:</strong> Choose from our selection of 6 languages to have conversations that feel natural and comfortable.</li>

          <li className="why--section--ul--li"><strong>Break Down Language Barriers:</strong> No more struggling with translation tools or misunderstandings. Speak directly in the language you're most proficient in.</li>

          <li className="why--section--ul--li"><strong>Learn and Practice:</strong> Use our platform not only for conversations but also as a tool to enhance your language skills. Practice with native speakers and improve your fluency.</li>

          <li className="why--section--ul--li"><strong>Easy to Use:</strong> Our user-friendly interface ensures a hassle-free experience, allowing you to focus on what matters most &#8212; meaningful conversations.</li>
        </ul>
      </div>

      </div>

    </main>
  )
}
