import { Question } from "./form_question"

export interface FormType {
  id: string;
  name: string;
  description?: string;
  questions: Question[];
}