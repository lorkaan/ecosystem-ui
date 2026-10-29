/** This defines the data that is given to the frontend from the backend
 * when requesting forms.
 */

import type { FieldType } from "./field_type";

export interface OrderedInterface{
  order: number;
}

export interface FormQuestionOption{
  label: string;
  value: string | number;
}

export interface FormQuestion extends OrderedInterface{
  id: string | number;
  label: string;
  required: boolean;
  schema: Record<string | number, any> | null;
  field_type: FieldType;
  options: FormQuestionOption[] | null;
}

export interface FormGroup extends OrderedInterface{
  id: string | number;
  parent: string | number | null;
  form_section: string | number;
  questions: FormQuestion[];
  children: FormGroup[];
}

export interface FormSection extends OrderedInterface{
  id: string | number;
  name?: string;
  code: string;
  description?: string;
  groups: FormGroup[];
}

export interface FormType {
  id: string | number;
  name: string;
  code: string;
  description?: string;
  version: number;
  sections: FormSection[];
}