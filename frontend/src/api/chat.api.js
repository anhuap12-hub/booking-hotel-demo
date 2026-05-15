import instance from "./axios";

export const sendChatMessage = async (message) => {
  return instance.post("/chat", { message });
};