/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useCallback, useLayoutEffect } from "react";
import { getRequest, postRequest } from "../utils/service";

import { socket } from "../utils/connectSocket.js";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState([]);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatError, setUserChatError] = useState(null);
  const [potentialChat, setPotentialChat] = useState([]);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isMessageError, setIsMessageError] = useState(false);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  // const [socket, setSocket] = useState(null);
  const [usersOnline, setUsersOnline] = useState([]);
  const [notifications, setNotifications] = useState(null);
  const [clickCurrentChat, setClickCurrentChat] = useState(false);
  // console.log("notifications", notifications);

  useEffect(() => {
    // const newSocket = io("http://localhost:3000");
    // setSocket(newSocket);
    // if (!socket || !user) return;

    socket?.on("connect", () => {
      console.log("socketId ", socket?.id);
    });
    socket?.on("disconnect", (reason, details) => {
      // ...
      console.log("disconnected", reason, details);
    });
    return () => {
      socket?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !user) return;
    socket?.emit("addNewUser", user?.id);
    socket?.on("getUsersOnline", (res) => {
      setUsersOnline(res);
    });
    return () => {
      socket?.off("addNewUser");
      socket?.off("getUsersOnline");
    };
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    const recipientId = currentChat?.members?.find((member) => member !== user.id);
    socket.emit("sendMessage", { ...newMessage, recipientId });
    return () => {
      socket.off("sendMessage");
    };
  }, [newMessage]);

  useEffect(() => {
    if (!socket) return;
    socket.on("connect_error", (err) => {
      // the reason of the error, for example "xhr poll error"
      console.log(err.message);

      // some additional description, for example the status code of the initial HTTP response
      console.log(err.description);

      // some additional context, for example the XMLHttpRequest object
      console.log(err.context);
    });
  }, []);

  useEffect(() => {
    // if (!socket) return;
    socket?.on("getMessage", (message) => {
      if (currentChat?._id !== message?.chatId) return;
      setMessages((prev) => [message, ...prev]);
    });
    socket?.on("getNotifications", async (res) => {
      if (!currentChat) {
        if (user?.id) {
          const response = await getRequest(`/chat/${user.id}`);
          if (response.err) {
            return;
          }
          const newChat = response?.find((userChat) => userChat?._id === res?.chatId);
          console.log("newChat", newChat);
          const configUser = newChat?.config?.find((item) => item.userId === user?.id);
          const configOtherUser = newChat?.config?.filter((item) => item.userId !== user?.id);
          response?.splice(response.indexOf(newChat), 1);
          response?.unshift({
            ...newChat,
            config: [
              ...configOtherUser,
              { ...configUser, isRead: false, unReadMessageCount: ++configUser.unReadMessageCount },
            ],
          });
          setUserChats(response);
        }
      } else {
        const isChatOpen = currentChat?.members?.some((member) => member === res?.senderId);
        const configUser = currentChat?.config?.find((item) => item.userId === user?.id);
        const configOtherUser = currentChat?.config?.filter((item) => item.userId !== user?.id);
        if (isChatOpen) {
          setIsMessagesLoading(false);
          setClickCurrentChat(false);
          setCurrentChat((prev) => ({
            ...prev,
            config: [...configOtherUser, { ...configUser, isRead: true, unReadMessageCount: 0 }],
          }));
        } else {
          const newChat = userChats?.find((userChat) => userChat?._id === res?.chatId);
          const configUserNotOpenChat = newChat?.config?.find((item) => item.userId === user?.id);
          const configOtherUserNotOpenChat = newChat?.config?.filter((item) => item.userId !== user?.id);
          console.log("newChat ", newChat);
          const newUnReadMessageCount = configUserNotOpenChat?.unReadMessageCount + 1;
          userChats?.splice(userChats.indexOf(newChat), 1);
          userChats?.unshift({
            ...newChat,
            config: [
              ...configOtherUserNotOpenChat,
              { ...configUserNotOpenChat, isRead: false, unReadMessageCount: newUnReadMessageCount },
            ],
          });
          setUserChats(userChats);
          try {
            await postRequest(
              "/chat/updateConfigUser",
              JSON.stringify({
                userId: user?.id,
                chatId: res?.chatId,
                userConfig: { isRead: false, unReadMessageCount: newUnReadMessageCount },
              })
            );
            console.log("tryyyyyyyyyyyyyyy");
          } catch (error) {
            console.log(error);
          }
        }
      }

      setNotifications(res);
    });
    return () => {
      socket?.off("getMessage");
      socket?.off("getNotifications");
    };
  }, [socket, currentChat]);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?.id) {
        setUserChatError(null);
        setIsUserChatsLoading(true);
        const response = await getRequest(`/chat/${user.id}`);
        if (response.err) {
          setUserChatError(true);
          setIsUserChatsLoading(false);
          return;
        }
        setUserChats(response);
        setIsUserChatsLoading(false);
      }
    };

    getUserChats();
  }, [user]);

  const getPotentialChat = async () => {
    let isChatCreated = false;
    const response = await getRequest("/findUser/users");
    if (response.error) {
      return console.log("error", response);
    }
    const pChats = response?.filter((item) => {
      if (user.id === item._id) return false;
      isChatCreated = userChats?.some((userChat) => {
        return userChat?.members?.indexOf(item._id) + 1;
      });
      return !isChatCreated;
    });
    return pChats;
  };

  // const updateSeenMessage = () => {
  //   if (currentChat) {
  //     const configUser = currentChat?.config?.find((item) => item?.userId === user?.id);
  //     const configOtherUser = currentChat?.config?.filter((item) => item.userId !== user?.id);
  //     setCurrentChat((prev) => ({
  //       ...prev,
  //       config: [...configOtherUser, { ...configUser, isRead: true, unReadMessageCount: 0 }],
  //     }));
  //   }
  // };

  const updateCurrentChat = (chat) => {
    setClickCurrentChat(true);
    setCurrentChat(chat);

    const configUser = chat?.config?.find((item) => item?.userId === user?.id);
    const configOtherUser = chat?.config?.filter((item) => item?.userId !== user?.id);
    setCurrentChat((prev) => ({
      ...prev,
      config: [...configOtherUser, { ...configUser, isRead: true, unReadMessageCount: 0 }],
    }));

    if (userChats) {
      const index = userChats.indexOf(chat);
      if (index !== -1) {
        userChats[index] = {
          ...chat,
          config: [...configOtherUser, { ...configUser, isRead: true, unReadMessageCount: 0 }],
        };
      }
      setUserChats(userChats);
    }
  };

  const listenClichCurrentChat = useCallback(() => {
    setClickCurrentChat(true);
  });
  const updateUserChats = (chat) => {
    setUserChats(chat);
  };
  const sendTextMessage = useCallback(async ({ text, senderId, chatId, setTextMessage }) => {
    try {
      const response = await postRequest(
        "/message/create",
        JSON.stringify({
          text,
          senderId,
          chatId,
        })
      );
      if (response?.error) {
        return setSendTextMessageError(response);
      }
      setNewMessage(response);
      setMessages((prev) => [response, ...prev]);
      setTextMessage("");
      // console.log("chatId: " + chatId);
    } catch (error) {
      setSendTextMessageError(true);
    }
  }, []);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest("/chat/createChat", JSON.stringify({ firstId, secondId }));

    if (response.error) {
      return response;
    }
    setUserChats((prev) => [...prev, response]);
  });

  useEffect(() => {
    const getMessages = async () => {
      // if (clickCurrentChat) {
      if (currentChat) {
        setIsMessagesLoading(true);
      } else {
        setIsMessagesLoading(false);
      }

      setIsMessageError(null);
      try {
        const response = await getRequest(`/message/getMessage/${currentChat?._id}`);
        setIsMessagesLoading(false);
        setClickCurrentChat(false);
        setMessages(response);
      } catch (error) {
        setIsMessageError(true);
        setIsMessagesLoading(false);
        return error;
      }
    };
    getMessages();
  }, [currentChat]);

  return (
    <ChatContext.Provider
      value={{
        currentChat,
        userChats,
        isUserChatsLoading,
        userChatError,
        potentialChat,
        getPotentialChat,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        isMessageError,
        sendTextMessage,
        newMessage,
        usersOnline,
        notifications,
        updateUserChats,

        clickCurrentChat,
        listenClichCurrentChat,
        // updateSeenMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
