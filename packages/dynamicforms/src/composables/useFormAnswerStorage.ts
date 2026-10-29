import { FormAnswerStorage } from "../objs/formAnswerStorage";
import { FormSection } from "../types/form_question";

export function useFormAnswers(formDef: FormSection[]){

    const answers: FormAnswerStorage = new FormAnswerStorage(formDef);
}