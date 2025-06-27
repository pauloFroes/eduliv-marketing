export const getFirstName = (name: string): string => {
  if (!name || name.trim() === '') return ''
  return name.replace(/\s+/g, ' ').trim().split(' ')[0]
}

export const capitalizeText = (text: string): string => {
  if (!text || text.trim() === '') return ''

  return text
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => {
      // Trata palavras com hífens, capitalizando cada parte
      if (word.includes('-')) {
        return word
          .split('-')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join('-')
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}
