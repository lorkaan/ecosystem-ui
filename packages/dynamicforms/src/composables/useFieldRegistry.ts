// useFieldRegistry.ts
import TextField from "../components/form/fields/TextField.vue"
import NumberField from "../components/form/fields/NumberField.vue"
import DateField from "../components/form/fields/DateField.vue"
import DateRangeField from "../components/form/fields/DateRangeField.vue"
import SelectField from "../components/form/fields/SelectField.vue"

const FIELD_REGISTRY: Record<string, any> = {
  T: TextField,
  N: NumberField,
  D: DateField,
  R: DateRangeField,
  E: SelectField,
  S: SelectField,
}

export function useFieldRegistry() {
  const getComponent = (type: string) => {
    return FIELD_REGISTRY[type] || TextField
  }

  return { getComponent }
}