import bannedWords from '../constants/bannedWords'

export default function containsBannedWord(text: string): boolean {
  const textLower = text.toLowerCase()
  return bannedWords.some((word: string) => textLower.includes(word))
}
