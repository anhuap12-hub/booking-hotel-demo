// src/api/chat.api.js
import axios from "axios";

export const sendChatMessage = async (message) => {
  const token = localStorage.getItem("accessToken");
  return axios.post(
    "/api/chat",
    { message },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
