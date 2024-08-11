import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/chatContext";
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () => {
  const { createChat, getPotentialChat, userChats, usersOnline } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const [potentialChat, setPotentialChat] = useState([]);
  useEffect(() => {
    const getPotentialChats = async () => {
      const potentialChat = await getPotentialChat();
      // console.log("potentialChat", potentialChat);
      setPotentialChat(potentialChat);
    };
    getPotentialChats();
  }, [userChats]);

  return (
    <div className="mt-5 mb-5 flex w-2/3 mx-auto overflow-scroll overflow-y-hidden ">
      {potentialChat?.map((item) => (
        <div key={item._id} className="mr-2 hover:cursor-pointer" onClick={() => createChat(user.id, item._id)}>
          {usersOnline?.some((userOnline) => userOnline.userId === item._id) && (
            <div className="px-1 py-1 rounded-full relative right-8 bg-green-400 float-right"></div>
          )}
          <FaUserCircle
            className="text-blue-600 mx-auto rounded-full text-4xl bg-slate-200"
            style={{ padding: "1px" }}
          ></FaUserCircle>

          <div className="text-white w-28 text-center">{item?.name}</div>
        </div>
      ))}
    </div>
  );
};

export default PotentialChats;
