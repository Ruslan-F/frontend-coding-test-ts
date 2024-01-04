export type Language = {
  code: string
  name: string
}

export type Country = {
  code: string
  name: string
  native: string
  capital: string
  emoji: string
  currency: string
  languages: Language[]
}
