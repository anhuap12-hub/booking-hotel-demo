import { normalizeText } from "./normalizeText";
import { CITIES } from "../constants/cities";

export function detectCity(input) {
  const text = normalizeText(input);

  return CITIES.find((c) =>
    [normalizeText(c.label), ...c.aliases].includes(text)
  );
}
