import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("bookingLanguage") || "en";
  });

  const translations = {
    en: {
      // Header
      stays: "Stays",
      myBookings: "My Bookings",
      register: "Register",
      signIn: "Sign in",
      account: "Account",
      profile: "Profile",
      admin: "Admin Panel",
      logout: "Logout",
      support: "Support",
      language: "EN",
      
      // Search
      where: "Where are you going?",
      checkIn: "Check-in date",
      checkOut: "Check-out date",
      adults: "Adults",
      children: "Children",
      search: "Search",
      
      // Common
      viewDetails: "View details",
      perNight: "per night",
      propertiesFound: "properties found",
      propertyFound: "property found",
      noPropertiesFound: "No properties found",
      tryAdjusting: "Try adjusting your search or filters",
    },
    vi: {
      // Header
      stays: "Chỗ ở",
      myBookings: "Đặt chỗ của tôi",
      register: "Đăng ký",
      signIn: "Đăng nhập",
      account: "Tài khoản",
      profile: "Hồ sơ",
      admin: "Bảng quản trị",
      logout: "Đăng xuất",
      support: "Hỗ trợ",
      language: "VI",
      
      // Search
      where: "Bạn muốn đi đâu?",
      checkIn: "Ngày nhận phòng",
      checkOut: "Ngày trả phòng",
      adults: "Người lớn",
      children: "Trẻ em",
      search: "Tìm kiếm",
      
      // Common
      viewDetails: "Xem chi tiết",
      perNight: "mỗi đêm",
      propertiesFound: "chỗ ở được tìm thấy",
      propertyFound: "chỗ ở được tìm thấy",
      noPropertiesFound: "Không tìm thấy chỗ ở",
      tryAdjusting: "Hãy thử điều chỉnh tìm kiếm hoặc bộ lọc của bạn",
    },
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
