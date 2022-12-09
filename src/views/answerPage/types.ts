export interface Question {
  id: number
  categoryId: number
  answer: string
  options: { key: string, value: string, isShow: boolean }[]
  content: string
  currentAnswer: string[]
  bg: string
  scale: number
  grade: number
}
