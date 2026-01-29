import instance from "./axios";

// Hàm upload nhiều ảnh (Dùng cho Hotel & Room)
export const uploadBatch = (formData) => {
  return instance.post("/upload/batch", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Hàm upload 1 ảnh (Dùng cho Avatar)
export const uploadSingle = (formData) => {
  return instance.post("/upload/single", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};