import { useEffect, useState } from "react";
import { getRequest } from "../utils/service";
export const useFetchRecipient = ({ chat, user }) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);
  const recipientId = chat?.members?.find((id) => id !== user?.id);
  // console.log("user", user);
  // console.log("chat ", chat);
  // console.log("recipientId", recipientId);

  useEffect(() => {
    const getRecipientUser = async () => {
      if (!recipientId) {
        return null;
      }
      const response = await getRequest(`/findUser/${recipientId}`);
      if (response.error) {
        return setError(response);
      }
      setRecipientUser(response);
    };

    getRecipientUser();
  }, [recipientId]);
  return { recipientUser } || { error };
};
