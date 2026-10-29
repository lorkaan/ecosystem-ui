import type { DateTimeRange } from "./datetimerange";
import type { record_key } from "@ecosystem/foundation";

export type Answers = Record<string, any>;

export interface ReferenceValue{
    reference_set: string;
    code: string;
}

export type AnswerValue =
  | string
  | number
  | boolean
  | null
  | number[]
  | string[]
  | DateTimeRange
  | ReferenceValue

export type QuestionAnswerState = Record<record_key, AnswerValue>;

export interface GroupInstance{
    questions: QuestionAnswerState;
    parent: GroupInstance | null;
} 

export interface SectionInstances{
    groups: GroupInstance[]
}

export type SectionState = Record<record_key, SectionInstances>

