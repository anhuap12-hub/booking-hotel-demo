import instance from "./axios";

export const getRecommendations = async () => {
  return instance.get("/recommend");
};