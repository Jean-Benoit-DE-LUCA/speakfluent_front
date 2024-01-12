"use client";

import Head from "../../components/Head/page";
import Header from "../../components/Header/page";
import Error from "../../components/Error/page";
import { Dispatch, SetStateAction, createContext, useState } from "react";

// INTERFACE //

export interface ConfigInterface {
  hostname: string;
}

export interface UserInterface {
  id: null,
  name: string,
  firstname: string,
  email: string,
  birthdate: string,
  address: string,
  zip: null,
  city: string,
  password: string,
  gender: string,
  role_name: string,
  jwt: string
}

export interface DataUserInterface {
  setUser: Dispatch<SetStateAction<UserInterface>>
}

export interface SloganInterface {
  first: string;
  second: string;
  third: string;
}

// CREATE CONTEXT //

export const ConfigContext = createContext<ConfigInterface>({
  hostname: ""
});

export const UserContext = createContext<UserInterface>({
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
  jwt: ""
});

export const DataUserContext = createContext<DataUserInterface>({
  setUser: () => {}
});

// ROOT COMPONENT //

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  // STATE //

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
    jwt: ""
  });

  //

  const configContextObject = {
    hostname: "http://127.0.0.1:8000"
  };

  /*const userContextObject = {
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
    role_name: ""
  };*/

  const dataUserContextObject = {
    setUser: setUser
  }

  console.log(user);

  return (
    <html lang="en">
      <Head />
      <body>
        <ConfigContext.Provider value={configContextObject}>
          <UserContext.Provider value={user}>
            <DataUserContext.Provider value={dataUserContextObject}>
              <Header />
              <div className="container">
                <Error />
                {children}
              </div>
            </DataUserContext.Provider>
          </UserContext.Provider>
        </ConfigContext.Provider>
      </body>
    </html>
  )
}
