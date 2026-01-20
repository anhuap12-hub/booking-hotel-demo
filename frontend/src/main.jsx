import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import { BrowserRouter } from "react-router-dom";
import { FilterProvider } from "./context/FilterContext";
import { LanguageProvider } from "./context/LanguageContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <LanguageProvider>
      <AuthProvider>
        <SearchProvider>
          <FilterProvider>
            <App />
          </FilterProvider>
        </SearchProvider>
      </AuthProvider>
    </LanguageProvider>
  </BrowserRouter>
);
