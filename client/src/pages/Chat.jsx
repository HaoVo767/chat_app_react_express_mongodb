import Navbar from "../components/layout";
import { useContext, useEffect, useLayoutEffect, useState, useRef } from "react";
import { ChatContext } from "../context/chatContext";
import { AuthContext } from "../context/AuthContext";
import UserChat from "../components/chat/userChat";
import PotentialChats from "../components/chat/potentialChat";
import ChatBox from "../components/chat/chatBox";
import { postRequest } from "../utils/service";
import { IoBookmark } from "react-icons/io5";

function Chat() {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading, updateCurrentChat, clickCurrentChat, currentChat, updateSeenMessage } =
    useContext(ChatContext);
  const updateSeenChat = ({ chatId }) => {
    try {
      postRequest(
        "/chat/updateConfigUser",
        JSON.stringify({ userId: user?.id, chatId, userConfig: { isRead: true, unReadMessageCount: 0 } })
      );
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   onChangeChatRoom.current = !onChangeChatRoom.current;
  //   console.log("onChangeChatRoom ", onChangeChatRoom);
  //   if (currentChat) {
  //     listenClichCurrentChat();
  //   }
  // }, [currentChat]);
  useEffect(() => {
    console.log("user Chats", userChats);
  }, [userChats]);
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="bg-stone-800 max-h-full min-h-full">
        {userChats && <PotentialChats />}
        <div className="flex  w-2/3 mx-auto">
          <div>
            {isUserChatsLoading ? (
              <div className="text-white w-1/3 mr-10">Chat loading...</div>
            ) : (
              <div className="text-white max-w-sm mr-10 min-w-fit overflow-y-scroll h-4/5">
                {userChats?.length >= 1 &&
                  userChats[0] !== undefined &&
                  userChats.map((item) => (
                    <div
                      key={item?._id}
                      onClick={() => {
                        updateCurrentChat(item);
                        updateSeenChat({ chatId: item?._id });
                        // updateSeenMessage();
                      }}
                      className="flex"
                    >
                      <IoBookmark
                        className="text-2xl mt-10 mr-2"
                        style={{ color: currentChat?._id === item?._id ? "white" : "transparent " }}
                      />
                      <UserChat props={{ user, item }} key={item?._id} />
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="w-2/3 border-y-0">
            <ChatBox />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
