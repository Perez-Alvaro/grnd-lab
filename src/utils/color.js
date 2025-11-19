export function getReadableTextColor(bgColor = "#111111") {
  const hex = bgColor.replace("#", "");
  if (hex.length !== 6) return "#ffffff";
  const [r, g, b] = hex.match(/\w\w/g).map((value) => parseInt(value, 16));
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128 ? "#ffffff" : "#111111";
}
