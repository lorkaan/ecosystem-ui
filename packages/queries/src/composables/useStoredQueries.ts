import { ref } from "vue";

import type { ParamDef } from "../types/paramdef";
import type { SavedQuery } from "../types/storedQuery";
import type { StoredQueryResponse } from "../types/storedqueryresult";

import { StoredQueryApiHandler } from "../api/StoredQueryApiHandler";
import { formatIfDateTime } from "@ecosystem/foundation";
import { EMPTY_RECORD, typedEntries } from "@ecosystem/foundation";

/* =========================================================
   Composable
========================================================= */
export function useStoredQueries() {
  /* --------------------
     State
  -------------------- */
  const queries = ref<Record<string | number, SavedQuery>>({});
  const activeId = ref<number | string | null>(null);

  const results = ref<Record<string, any>[]>([]);
  const resultsLoading = ref(false);

  const paramValues = ref<Record<string, any>>({});
  const paramErrors = ref<Record<string, string>>({});

  const selectedFields = ref<string[]>([]);
  const allFields = ref<string[]>([]);

  const error = ref("");

  /* --------------------
     Helpers
  -------------------- */

  function activeQuery(): SavedQuery | undefined {
    if (activeId.value == null) return undefined;
    return queries.value[activeId.value];
  }

  function queryParams(): Record<string, ParamDef> {
    return activeQuery()?.query?.params ?? EMPTY_RECORD<string, ParamDef>();
  }

  function getFieldLabel(field: string): string {
    return (
      activeQuery()?.query?.field_labels?.[field] ??
      prettifyField(field)
    );
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
    return activeQuery()?.query?.default_fields ?? [];
  }

  /* --------------------
     Param Handling
  -------------------- */

  function resetParams(query?: SavedQuery) {
    paramValues.value = {};
    paramErrors.value = {};

    if (!query?.query?.params) return;

    let autoRun = true;

    for (const [key, def] of typedEntries<Record<string, ParamDef>>(query.query.params)) {
      if (def?.default !== undefined) {
        paramValues.value[key] = def.default;
      } else {
        paramValues.value[key] = "";
      }

      if (def?.required && !paramValues.value[key]) {
        autoRun = false;
      }
    }

    if (autoRun && query?.id) {
      selectedFields.value = [];
      loadResults(query.id);
    }
  }

  function validateParams(): boolean {
    paramErrors.value = {};

    const params = queryParams();

    for (const [name, def] of Object.entries(params)) {
      if (def.required && !paramValues.value[name]) {
        paramErrors.value[name] = "This field is required";
      }
    }

    return Object.keys(paramErrors.value).length === 0;
  }

  /* --------------------
     Data Loading
  -------------------- */

  async function loadQueries() {
    error.value = "";

    const res = await StoredQueryApiHandler.list();

    if (!res.ok) {
      throw new Error("Failed to load queries");
    }

    const data: SavedQuery[] = await res.json();

    const map: Record<string | number, SavedQuery> = {};
    for (const q of data) {
      map[q.id] = q;
    }

    queries.value = map;
  }

  async function loadResults(id: number | string) {
    resultsLoading.value = true;
    error.value = "";

    try {
      if (Object.keys(queryParams()).length && !validateParams()) {
        throw new Error("Missing required parameters");
      }

      const res = await StoredQueryApiHandler.run(id, {
        params: paramValues.value,
      });

      if (!res.ok) throw new Error("Failed to run query");

      const data: StoredQueryResponse = await res.json();
      results.value = data.results ?? [];

      if (results.value.length > 0) {
        const first = results.value[0];
        if (first) {
          allFields.value = Object.keys(first);

          if (!selectedFields.value.length) {
            const defaults = getDefaultColumnFields();
            selectedFields.value =
              defaults.length > 0 ? defaults : [...allFields.value];
          }
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

  async function runActiveQuery() {
    if (!activeId.value) return;
    await loadResults(activeId.value);
  }

  async function downloadResults(id: number | string) {
    resultsLoading.value = true;
    error.value = "";

    try {
      if (Object.keys(queryParams()).length && !validateParams()) {
        throw new Error("Missing required parameters");
      }

      const res = await StoredQueryApiHandler.download(id, {
        params: paramValues.value,
      },
      selectedFields.value
    );

      if (!res.ok) throw new Error("Failed to run query");

    } catch (err: any) {
      error.value = err.message;
      results.value = [];
    } finally {
      resultsLoading.value = false;
    }
  }

  async function downloadActiveQuery(){
    if (!activeId.value) return;
    await downloadResults(activeId.value);
  }

  /* --------------------
     UI Helpers
  -------------------- */

  function setSelectedFields(fields: string[]) {
    selectedFields.value = fields;
  }

  /* --------------------
     Return
  -------------------- */
  return {
    // state
    queries,
    activeId,
    results,
    resultsLoading,
    error,

    paramValues,
    paramErrors,
    selectedFields,
    allFields,

    // helpers
    activeQuery,
    queryParams,
    getFieldLabel,
    prettifyFieldData,

    // actions
    loadQueries,
    loadResults,
    runActiveQuery,
    downloadActiveQuery,
    resetParams,
    setSelectedFields,
  };
}