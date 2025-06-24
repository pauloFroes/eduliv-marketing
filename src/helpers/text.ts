export const textCapitalize = (text: string) => {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const textFirstName = (text: string) => {
  return text.split(" ").slice(0, 1).join(" ");
};
