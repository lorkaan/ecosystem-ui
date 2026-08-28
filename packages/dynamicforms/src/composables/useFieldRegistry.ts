// useFieldRegistry.ts
import TextField from "../components/form/fields/TextField.vue"
import NumberField from "../components/form/fields/NumberField.vue"
import DateField from "../components/form/fields/DateField.vue"
import DateRangeField from "../components/form/fields/DateRangeField.vue"
import SelectField from "../components/form/fields/SelectField.vue"
import DateTimeField from "../components/form/fields/DateTimeField.vue"
import DateTimeRangeField from "../components/form/fields/DateTimeRangeField.vue"

const FIELD_REGISTRY: Record<string, any> = {
  T: TextField,
  N: NumberField,
  D: DateField,
  DR: DateRangeField,
  DT: DateTimeField,           
  DTR: DateTimeRangeField,     
  E: SelectField,
  S: SelectField,
}

export function useFieldRegistry() {
  const getComponent = (type: string) => {
    return FIELD_REGISTRY[type] || TextField
  }

  return { getComponent }
}