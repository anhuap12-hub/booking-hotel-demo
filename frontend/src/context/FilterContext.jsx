import { createContext, useContext, useState, useMemo } from "react";

const FilterContext = createContext();

export function FilterProvider({ children }) {
  const [filter, setFilter] = useState({
    price: [0, 5_000_000],
    amenities: [],
  });

  const value = useMemo(
    () => ({ filter, setFilter }),
    [filter]
  );

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

export const useFilter = () => useContext(FilterContext);
