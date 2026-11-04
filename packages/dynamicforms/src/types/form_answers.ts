import { ReferenceValue } from "./answers";
import { DateTimeRange } from "./datetimerange";

export type AnswerValue =
  | string
  | number
  | boolean
  | null
  | number[]
  | string[]
  | DateTimeRange
  | ReferenceValue


export interface QuestionAnswer{
    question: string | number;
    answer: AnswerValue;
}