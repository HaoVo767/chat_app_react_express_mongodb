import { useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CiLogout, CiLogin } from "react-icons/ci";
import Notification from "../components/chat/Notification";

function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  return (
    <>
      <div className="flex justify-around py-3 bg-stone-900">
        <div className="flex">
          <FaUserCircle className="text-3xl text-yellow-500" />
          <span className="text-white ml-2 mt-1">{user?.name}</span>
        </div>
        <div className="flex">
          <div className=" mt-1.5 mr-4">
            <Notification />
          </div>
          {!user ? (
            <div className="flex">
              <div className="flex cursor-pointer text-white mr-10 text-lg">
                <div>
                  <CiLogin className="mt-1.5 mr-1" />
                </div>
                <div onClick={() => navigate("/login")}>Login</div>
              </div>
              <div className="cursor-pointer text-white text-lg" onClick={() => navigate("/register")}>
                Register
              </div>
            </div>
          ) : (
            <div>
              <div
                className="cursor-pointer flex text-white text-lg"
                onClick={() => {
                  sessionStorage.removeItem("user");
                  setUser(null);
                }}
              >
                <div>
                  <CiLogout className=" mr-1 mt-1.5" />
                </div>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      <div></div>
    </>
  );
}

export default Navbar;
