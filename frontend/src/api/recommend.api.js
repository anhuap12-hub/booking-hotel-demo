// src/api/recommend.api.js
import axios from "axios";

export const getRecommendations = async () => {
  const token = localStorage.getItem("accessToken");
  return axios.get("/api/recommend", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
