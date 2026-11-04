import { ref } from "vue"
import { DynamicFormInstanceApiHandler, DynamicFormTypeApiHandler } from "../api/DynamicFormApiHandler"
import { RegistryTree } from "../objs/tree"
import { FormGroupInstance } from "../storage/formDataStorage"
import { FormType } from "../types/form_type"

export function useFormBackend() {

    // Depreciated. Going to put the backend code and the data code togehter as a single unit. Question if this is viable

    const formType = ref<FormType | null>(null)

    const loading = ref(false)
    const submitting = ref(false)
    const error = ref<string | null>(null)

    const loadForm = async (code: string) => {
        loading.value = true
        error.value = null
    
        try {
            const res = await DynamicFormTypeApiHandler.get_latest(code);
            const data = await res.json()
    
            formType.value = data;
    
        } catch (err: any) {
            error.value = err?.message || "Failed to load form"
        } finally {
            loading.value = false
        }
    }

    const saveDraft = async function(payload: any, instance_id: (string | number | null) = null){
        if (!formType.value) return

        submitting.value = true
        error.value = null
        try{
            if(instance_id == null){
                await DynamicFormInstanceApiHandler.create(payload);
            }else{
                await DynamicFormInstanceApiHandler.update(instance_id.toString(), payload);
            }
        }catch(err){
            error.value = `${err}`;
        }finally{
            submitting.value = false;
        }
    }

    const submit = async function(payload: any){
        if (!formType.value) return

        submitting.value = true
        error.value = null
        try{
            await DynamicFormInstanceApiHandler.create(payload);
        }catch(err){
            error.value = `${err}`;
        }finally{
            submitting.value = false;
        }
    }

    return {
        "FormType_loading": loading,
        "FormType_error": error,
        "FormType_submitting": submitting,
        "FormType": formType,
        "load": loadForm,
        "submit": submit

    }
}