import { ref } from "vue";
import { formatIfDateTime } from "@ecosystem/core-ui/index";
import { DrfApiHandler } from "../drf_http";
import { QueryListResponse } from "../types/queryResponse";
import { QueryParams } from "../types/queryParams";

type DrfApiHandlerStatic = typeof DrfApiHandler;

export function useGenericQueries<TItem>(
  ApiHandler: DrfApiHandlerStatic
) {
  const results = ref<TItem[]>([]);
  const resultsLoading = ref(false);
  const error = ref("");

  const selectedFields = ref<string[]>([]);
  const allFields = ref<string[]>([]);

  /* --------------------
     Helpers
  -------------------- */

  function getFieldLabel(field: string): string {
    return prettifyField(field);
  }

  function prettifyField(name: string): string {
    return name
      .replace(/__/g, " → ")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  function prettifyFieldData(val: any) {
    if (typeof val === "string") {
      return formatIfDateTime(val);
    }
    return val;
  }

  function getDefaultColumnFields(): string[] {
    return [];
  }

  /* --------------------
     API
  -------------------- */

  async function loadResults(params: QueryParams) {
    resultsLoading.value = true;
    error.value = "";

    try {
      const res = await ApiHandler.list(params);

      if (!res.ok) throw new Error("Failed to load results");

      const data: QueryListResponse<TItem> = await res.json();
      results.value = data.results ?? [];

      if (results.value.length > 0) {
        const first = results.value[0] as Record<string, any>;

        allFields.value = Object.keys(first);

        if (!selectedFields.value.length) {
          const defaults = getDefaultColumnFields();
          selectedFields.value =
            defaults.length > 0 ? defaults : [...allFields.value];
        }
      } else {
        allFields.value = [];
        selectedFields.value = [];
      }
    } catch (err: any) {
      error.value = err.message;
      results.value = [];
    } finally {
      resultsLoading.value = false;
    }
  }

  async function loadFilterSchema() {
    try {
      const res = await ApiHandler.filter_schema();

      if (!res.ok) throw new Error("Failed to load filter schema");

      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  function setSelectedFields(fields: string[]) {
    selectedFields.value = fields;
  }

  return {
    // state
    results,
    resultsLoading,
    error,
    selectedFields,
    allFields,

    // helpers
    getFieldLabel,
    prettifyFieldData,

    // actions
    loadResults,
    loadFilterSchema,
    setSelectedFields,
  };
}