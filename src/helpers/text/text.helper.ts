export const getFirstName = (name: string): string => {
  return name.trim().split(' ')[0]
}

export const capitalizeText = (text: string): string => {
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
