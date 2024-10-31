"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState
} from "react";
import { api } from "../api";
import { getCookie } from "cookies-next";

type UserContextType = {
  user: any | null;
  setUser: (user: any | null) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function UserProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<any | null>(null);
  const token = getCookie("session");

  if (!user) {
    api.get("/me", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then((response) => {
        const { data } = response;
        console.log(data);
        setUser(data);
      });
  }


  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
