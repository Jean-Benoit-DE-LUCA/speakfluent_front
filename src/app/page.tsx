"use client";

import Link from "next/link";
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from "react";
import { ConfigContext } from "./layout";

export default function Home() {

  const router = useRouter();

  const configContext = useContext(ConfigContext);

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
    
    selectLanguage.value == "english" ? buttonSubmit.textContent = "Go!" : selectLanguage.value == "french" ? buttonSubmit.textContent = "Allez!" : selectLanguage.value == "german" ? buttonSubmit.textContent = "Gehen!" : selectLanguage.value == "italian" ? buttonSubmit.textContent = "Andare!" : selectLanguage.value == "arab" ? buttonSubmit.textContent = "اذهب!" : "";

  };

  // GET SELECTED LANGUAGE AND PASS IT ANCHOR //

  const handleSubmitLanguage = (e: React.FormEvent) => {

    e.preventDefault();

    const selectLanguage = (document.getElementsByClassName("select--language")[0] as HTMLSelectElement);

    router.push(`/speakin/${selectLanguage.value}?i=${selectLanguage.options[selectLanguage.selectedIndex].getAttribute("data-id")}`);
  };

  useEffect(() => {
    
    fetchLanguage();
  }, []);

  return (
    <main className="main">

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
                  (language as any)[elem] == "arab" ? "عربي" : ""
                }
              </option>
            )}

          </select>


          <button name="select--language--button" className="select--language--button" id="select--language--button" onClick={handleSubmitLanguage}>Go!</button>

        </form>
        
      </article>

    </main>
  )
}
