"use client";

import Header from "../../components/Header/page";
import Footer from "../../components/Footer/page";
import Error from "../../components/Error/page";
import { Dispatch, SetStateAction, createContext, useEffect, useState } from "react";

// INTERFACE //

export interface ConfigInterface {
  hostname: string;
  lastActivity: string;
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
  jwt: string,
  photo: string
}

export interface DataUserInterface {
  setUser: Dispatch<SetStateAction<UserInterface>>,
  isJwtOk: boolean,
  privateChat: Object
}

export interface SloganInterface {
  first: string;
  second: string;
  third: string;
}

// CREATE CONTEXT //

export const ConfigContext = createContext<ConfigInterface>({
  hostname: "",
  lastActivity: ""
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
  jwt: "",
  photo: ""
});

export const DataUserContext = createContext<DataUserInterface>({
  setUser: () => {},
  isJwtOk: true,
  privateChat: {}
});



export const SocketContext = createContext({
  socket: new WebSocket("ws://localhost:8081")
});






// ROOT COMPONENT //

export default function Main({
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
    jwt: "",
    photo: ""
  });




  // WEBSOCKET INIT //

  const [socket, setSocket] = useState(new WebSocket("ws://localhost:8081"));

  const socketContextObject = {
    socket: socket
  };





  //---/**/---//

  const configContextObject = {
    hostname: "http://127.0.0.1:8000",
    lastActivity: '1970-01-01 00:00:00'
  };


  const dataUserContextObject = {
    setUser: setUser,
    isJwtOk: true,
    privateChat: {}
  }

  return (

        <ConfigContext.Provider value={configContextObject}>
          <UserContext.Provider value={user}>
            <DataUserContext.Provider value={dataUserContextObject}>
              <SocketContext.Provider value={socketContextObject}>
                <Header />
                <div className="container">
                  <Error />
                  {children}
                </div>
                <Footer />
              </SocketContext.Provider>
            </DataUserContext.Provider>
          </UserContext.Provider>
        </ConfigContext.Provider>

  )
}