import dynamic from "next/dynamic";

const dynamicLanguage = dynamic(() => import("../[language]/pageClient"), {
    ssr: false,
});

export default dynamicLanguage;