export interface Question {
  id: string;
  label: string;
  field_type: string;
  required: boolean;
  schema: Record<string, any>;
  options?: any[];
}