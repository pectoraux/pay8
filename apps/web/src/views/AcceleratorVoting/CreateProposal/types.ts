import { Choice } from 'views/CanCan/market/Collection/CreateArticle/Choices'

export interface FormState {
  name: string
  body: string
  choices: Choice[]
  startDate: Date
  startTime: Date
  endDate: Date
  endTime: Date
  snapshot: number
}
