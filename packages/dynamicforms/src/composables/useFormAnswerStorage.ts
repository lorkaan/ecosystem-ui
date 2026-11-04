import { reactive, ref } from "vue";
import { FormDataStorage, FormSectionData } from "../storage/formDataStorage";
import { FormQuestion, FormType } from "../types/form_type";

export function useFormAnswers(formType: FormType){

    const error = ref<string>("");
    const loading = ref<boolean>(false);
    
    /** Reactive is how we get functionality like ref, but for an object vs Primative or Record | Array of primatives */
    const dataStorage = reactive(new FormDataStorage(formType));

    const getFormSectionData = function(): FormSectionData{
        return dataStorage.sections;
    }

    const resetError = function(){
        error.value = "";
    }

    const createNew = function(formGroupInstanceID: string){
        resetError();
        try{
            loading.value = true;
            const formGroupBackendId: string | number = dataStorage.getFormGroupMetadataIdForInstance(formGroupInstanceID);
            dataStorage.addNewInstance(formGroupBackendId, formGroupInstanceID)
        }catch(err){
            error.value = `${err}`;
        }finally{
            loading.value = false;
        }
    }

    const getQuestionMetaData = function(questionBackendId: (string | number)): FormQuestion | null{
        return dataStorage.metaQuestion[questionBackendId] || null;
    }

    return{
        "loading": loading,
        "error": error,
        "FormSections": getFormSectionData(),
        "clone": createNew,
        "resetError": resetError,
        "getQuestionMetaData": getQuestionMetaData
    }
}