export function normalizeText(text = "") {
  return text
    .toLowerCase()
    .normalize("NFD")                // tách dấu
    .replace(/[\u0300-\u036f]/g, "") // xoá dấu
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
