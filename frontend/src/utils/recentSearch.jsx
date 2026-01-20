const KEY = "booking_recent_searches";
const LIMIT = Number(import.meta.env.VITE_RECENT_SEARCH_LIMIT) || 8;

export const getRecentSearches = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const addRecentSearch = ({ keyword, city }) => {
  if (!keyword && !city) return;

  const list = getRecentSearches();

  const key = (keyword || city).toLowerCase();

  const filtered = list.filter(
    (s) => (s.keyword || s.city).toLowerCase() !== key
  );

  const newList = [
    {
      keyword,
      city,
      createdAt: Date.now(),
    },
    ...filtered,
  ].slice(0, LIMIT);

  localStorage.setItem(KEY, JSON.stringify(newList));
};

export const clearRecentSearches = () => {
  localStorage.removeItem(KEY);
};

export const removeRecentSearch = (keywordOrCity) => {
  const list = getRecentSearches();
  const newList = list.filter(
    (item) =>
      (item.keyword || item.city).toLowerCase() !==
      keywordOrCity.toLowerCase()
  );
  localStorage.setItem(KEY, JSON.stringify(newList));
  return newList;
};
