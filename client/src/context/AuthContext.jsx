import { createContext, useCallback, useEffect, useState } from "react";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  // const onChangeUser = useCallback((params) => {
  //   setUser(params);
  // }, []);
  const onChangeUser = (params) => {
    setUser((prev) => ({ ...prev, ...params }));
  };
  useEffect(() => {
    const user = sessionStorage.getItem("user");
    setUser(JSON.parse(user));
  }, []);
  console.log("user", user);
  return <AuthContext.Provider value={{ user, onChangeUser, setUser }}>{children}</AuthContext.Provider>;
};
