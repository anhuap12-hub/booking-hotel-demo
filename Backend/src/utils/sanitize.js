// utils/sanitize.js
export function cleanText(text) {
  if (!text) return "";
  return text.replace(/&nbsp;/g, " ");
}
