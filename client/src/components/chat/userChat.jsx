/* eslint-disable react/prop-types */
import { useState, useLayoutEffect } from "react";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { FaUserCircle } from "react-icons/fa";
import { Badge } from "antd";
import { useContext, useEffect } from "react";
import { ChatContext } from "../../context/chatContext";
import { getRequest, postRequest } from "../../utils/service";
import { formatDateTime } from "../../utils/fortmatDateTime";

const UserChat = ({ props }) => {
  const { recipientUser } = useFetchRecipient({ chat: props.item, user: props.user });
  const { usersOnline, userChats, updateUserChats, notifications } = useContext(ChatContext);
  const [latestMessage, setLatestMessage] = useState([]);
  // console.log("latestMessage", latestMessage[0]?.createdAt);
  const isOnline = usersOnline.some((userOnline) => userOnline?.userId === recipientUser?._id);
  useLayoutEffect(() => {
    const getLatestMessage = async () => {
      try {
        const response = await getRequest(`/message/getLatestMessage/${props?.item?._id}`);
        if (response) {
          setLatestMessage(response);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getLatestMessage();
  }, [userChats, updateUserChats, notifications]);
  const { config } = props?.item;
  const userConfig = config?.find((c) => c?.userId === props?.user?.id);
  // console.log("userConfig", userConfig);
  return (
    <div
      className="hover:cursor-pointer max-h-[90px] w-[350px] overflow-hidden"
      style={{ borderBottom: "1px solid gray" }}
    >
      <div className="flex justify-between">
        <div>
          <div className="flex mt-6">
            <FaUserCircle
              className="mb-2 mr-1 text-blue-600 rounded-full text-3xl bg-slate-200"
              style={{ padding: "1px" }}
            ></FaUserCircle>
            {isOnline && <div className="rounded-full bg-green-500 px-1 py-1 mb-8 "></div>}
            <div className="text-white mt-1">{recipientUser?.name}</div>
          </div>
          <div
            className=" ml-8 overflow-hidden"
            style={{ fontWeight: userConfig?.isRead ? 300 : 600, color: userConfig?.isRead ? "#DDD" : "#FFF" }}
          >
            {latestMessage[0]?.text}
          </div>
        </div>
        <div className="mt-8">
          {/* {isOnline && <div className="float-right rounded-full bg-green-500 px-1 py-1"></div>} */}
          <div className="text-stone-300 text-sm">
            {latestMessage.length ? formatDateTime(latestMessage[0]?.createdAt) : "no text yet"}
          </div>
          {!userConfig?.isRead && (
            <Badge className="text-white rounded-full px-2 py-1 bg-red-700 float-right">
              {userConfig?.unReadMessageCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserChat;
