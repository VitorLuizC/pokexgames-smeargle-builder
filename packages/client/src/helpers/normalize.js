/**
 * Normalizes string values.
 * @param {string} [value]
 * @returns {string}
 */
export default function normalize(value) {
  return (value || "")
    .toLocaleLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}
