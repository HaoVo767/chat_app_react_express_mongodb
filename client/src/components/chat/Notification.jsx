import React, { useCallback, useContext, useEffect, useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { ChatContext } from "../../context/chatContext";
import { Popover, Badge } from "antd";
import { getRequest } from "../../utils/service";
import { formatDateTime } from "../../utils/fortmatDateTime";
import { AuthContext } from "../../context/AuthContext";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";

const ShowNoti = ({ props, notifications }) => {
  const { user } = useContext(AuthContext);
  console.log("notifications show", notifications);
  console.log("props noti", props);
  const [lastMessage, setLatestMessage] = useState(null);
  useEffect(() => {
    const getLatestMessage = async () => {
      try {
        const response = await getRequest(`/message/getLatestMessage/${props?._id}`);
        if (response) {
          setLatestMessage(response[0]);
          console.log("response", response);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getLatestMessage();
  }, [props]);

  const { recipientUser } = useFetchRecipient({ chat: props, user });
  console.log("recipientUser", recipientUser);
  return (
    <div className=" border-b-2 w-96" key={props._id}>
      <span className="w-[300px] text-[15px] text-stone-700 py-2 font-bold">{`${recipientUser?.name}: `}</span>
      <span className="text-[15px] text-stone-700 pl-10">{lastMessage?.text}</span>
      <div className="grid">
        <div className="text-stone-700 pb-2 justify-self-end">{formatDateTime(props?.lastMessageTime)}</div>
      </div>
    </div>
  );
};

function Notification() {
  const { userChats, notifications, currentChat } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const [unReadChatRooms, setUnReadChatRooms] = useState([]);

  useEffect(() => {
    const unReadNotificationsFunc = () => {
      const unReadList = [];

      const unReadChat = userChats?.filter((userChat) => {
        return (
          (userChat?.config[0]?.userId === user?.id && userChat?.config[0]?.isRead === false) ||
          (userChat?.config[1]?.userId === user?.id && userChat?.config[1]?.isRead === false)
        );
      });
      setUnReadChatRooms(unReadChat);
      console.log("Notifications", notifications);
    };
    unReadNotificationsFunc();
  }, [userChats, notifications, currentChat]);
  return (
    <div>
      <Badge count={unReadChatRooms?.length} showZero={false} size="small" className="cursor-default">
        <Popover
          style={{ backgroundColor: "transparent", border: "1px solid red", padding: 0 }}
          trigger="click"
          placement="bottom"
          title={<span className="text-[17px] ">Notifications</span>}
          content={
            <div className="max-h-[500px] overflow-scroll min-h-fit">
              {unReadChatRooms?.length ? (
                unReadChatRooms?.map((item) => <ShowNoti props={item} notifications={notifications} key={item._id} />)
              ) : (
                <div className="mx-auto w-fit">No notifications</div>
              )}
            </div>
          }
        >
          <IoIosNotifications className="text-white text-xl cursor-pointer" />
        </Popover>
      </Badge>
    </div>
  );
}

export default Notification;
