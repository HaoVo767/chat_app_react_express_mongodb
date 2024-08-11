import { useContext, useState, useRef, useLayoutEffect, useEffect } from "react";
import { ChatContext } from "../../context/chatContext";
import { AuthContext } from "../../context/AuthContext";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { Button, Spin } from "antd";
import InputEmoji from "react-input-emoji";
import { formatDateTime } from "../../utils/fortmatDateTime";
const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const {
    userChats,
    currentChat,
    messages,
    isMessagesLoading,
    sendTextMessage,
    newMessage,
    usersOnline,
    updateUserChats,
    notifications,
    setNotifications,
    clickCurrentChat,
  } = useContext(ChatContext);
  const [isChatRoomChanged, setIsChatRoomChange] = useState(false);
  const { recipientUser } = useFetchRecipient({ chat: currentChat, user });
  const handleSenttextMessage = (text) => {
    sendTextMessage({ text, senderId: user.id, chatId: currentChat._id });
    const newChat = userChats?.find((userChat) => userChat?._id === currentChat?._id);
    userChats?.splice(userChats.indexOf(newChat), 1);
    userChats?.unshift(newChat);
    updateUserChats(userChats);
  };
  useEffect(() => {
    if (currentChat) {
      setIsChatRoomChange(true);
    }
  }, [currentChat]);
  return (
    <>
      {recipientUser && (
        <div className="flex flex-col">
          <div className="text-white text-xl text-center rounded-t-xl bg-neutral-900 py-2">{recipientUser?.name}</div>
          <div className="bg-zinc-950 grid h-[650px]">
            {/* {isMessagesLoading && (
              <span className=" place-self-center text-white ">
                <Spin size="large" />
              </span>
            )} */}
            {messages && (
              <div className="text-white flex overflow-scroll flex-col-reverse">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className="mx-6 w-1/3 rounded-lg mt-2"
                    style={{
                      placeSelf: message?.senderId === user.id ? "end" : "start",
                      backgroundColor: message?.senderId === user.id ? "#31B358" : "#292524",
                    }}
                  >
                    <div className="p-2 h-max w-full overflow-hidden">
                      <div className="p-2">{message?.text}</div>
                      <div className="ml-2 text-neutral-600">{formatDateTime(message?.createdAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-zinc-950 rounded-b-xl flex w-full">
            <InputEmoji
              onEnter={(text) => {
                if (text.trim() === "") return;
                handleSenttextMessage(text);
              }}
              cleanOnEnter={true}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;
