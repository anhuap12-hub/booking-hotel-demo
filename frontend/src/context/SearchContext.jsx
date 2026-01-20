import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const createDefaultSearch = () => ({
  city: "",
  keyword: "",
  types: [],
  rating: null,
  amenities: [],
  priceRange: [0, 2_000_000],
});

export function SearchProvider({ children }) {
  const [search, setSearch] = useState(createDefaultSearch());

  const updateSearch = (updater) => {
    setSearch((prev) =>
      typeof updater === "function"
        ? updater(prev)
        : { ...prev, ...updater }
    );
  };

  const resetSearch = () => {
    setSearch(createDefaultSearch());
  };

  return (
    <SearchContext.Provider
      value={{ search, updateSearch, resetSearch }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext);
