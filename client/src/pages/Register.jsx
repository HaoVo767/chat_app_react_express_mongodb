import Navbar from "../components/layout";
import { Button, Input } from "antd";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { postRequest } from "../utils/service";

function Register() {
  // eslint-disable-next-line no-unused-vars
  const { user } = useContext(AuthContext);
  const [registerUser, setRegisterUser] = useState();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleRegister = async () => {
    const response = await postRequest("/register", JSON.stringify(registerUser));
    console.log("response", response);
    setErrorMessage(response.message);
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
                onChange={(e) => {
                  setRegisterUser((prev) => ({ ...prev, email: e.target.value }));
                }}
              />
            </div>
            <div className="flex mt-3 justify-center">
              <div className="text-md">Name</div>
              <Input
                size="large"
                className="relative left-5 w-1/3"
                onChange={(e) => {
                  setRegisterUser((prev) => ({ ...prev, name: e.target.value }));
                }}
              />
            </div>
            <div className="flex mt-3 justify-center">
              <div className="text-md relative right-3">Password </div>
              <Input
                size="large"
                className="w-1/3 relative left-2"
                onChange={(e) => {
                  setRegisterUser((prev) => ({ ...prev, password: e.target.value }));
                }}
              />
            </div>
            <div className="mt-3 text-center mb-4 text-white">{errorMessage}</div>
            <div className="mt-3 w-1/5 mx-auto relative left-12">
              <Button
                className="bg-yellow-500 text-lg text-white text-bold"
                style={{ border: "none" }}
                block
                size="large"
                onClick={handleRegister}
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
