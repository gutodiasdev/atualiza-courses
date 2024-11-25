export const userNameFallback = (name: string): string => {
  let fallback: string = "";
  const splitted = name.split(" ");
  if (splitted.length > 1) {
    splitted.forEach((word) => {
      fallback+=word.charAt(0).toUpperCase();
    })
    return fallback;
  }
  return name.charAt(0).toUpperCase();
}