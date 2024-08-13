import { Button, Input } from "antd";
import Navbar from "../components/layout";
import React, { useContext } from "react";
import { postRequest } from "../utils/service";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [loginUser, setLoginUser] = React.useState();
  const [loginMessage, setLoginMessage] = React.useState();
  const [loginError, setLoginError] = React.useState(false);
  const navigate = useNavigate();
  const { onChangeUser } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const data = await postRequest("/login", JSON.stringify(loginUser));
      if (!data.error) {
        sessionStorage.setItem("user", JSON.stringify(data));
        onChangeUser({ ...data });
        navigate("/chat");
      } else {
        setLoginError(data.error);
        setLoginMessage(data.message);
      }
    } catch (e) {
      console.log("error", e);
    }
  };
  const handleTryLogin = () => {
    setLoginUser(null);
    setLoginError(false);
    setLoginMessage(null);
  };
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="grow bg-stone-800">
        <div className="text-white text-lg mt-10">
          <div className="mx-auto w-2/3">
            <div className="flex mt-10 justify-center">
              <div className="text-md">Email</div>
              <Input
                size="large"
                className="relative left-6 w-1/3"
                value={loginUser?.email}
                onChange={(e) => setLoginUser((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="flex mt-3 justify-center">
              <div className="text-md relative right-3">Password</div>
              <Input
                size="large"
                className="w-1/3 relative left-2"
                value={loginUser?.password}
                onChange={(e) => setLoginUser((prev) => ({ ...prev, password: e.target.value }))}
              />
            </div>
            {loginError && (
              <div className="flex mt-3 text-white justify-center mb-4">
                <div className="">{loginMessage}</div>
                <span className="cursor-pointer hover:underline" onClick={handleTryLogin}>
                  -Try again
                </span>
              </div>
            )}
            <div className="mt-3 w-1/5 mx-auto relative left-12">
              <Button
                className="bg-yellow-500 text-lg text-white text-bold"
                style={{ border: "none" }}
                block
                size="large"
                onClick={handleLogin}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
