import { FieldType } from "../types/field_type";
import type { FormGroupInstance } from "../types/form_answers";
import type {FormGroup, FormQuestion, FormSection, FormType} from "../types/form_type";
import {IdSearchError, IdTree, TreeNode, TreeNodeInterface} from "./IdTree";
import { IdTreeOrderedCollection } from "./idTreeOrderedCollection";

/** Hard Depreciation */

interface FormSectionMetadata{
    id: string | number;
    code: string;
    description: string;
}

interface FormGroupMetadata{
    id: string | number;
    parent: string | number | null;
    form_section: string | number;
    order: number;
    questions: FormQuestion[];
    children: FormGroup[];
}

interface FormQuestionMetadata{
    id: string | number;
    label: string;
    required: boolean;
    schema: Record<string | number, any> | null;
    field_type: FieldType;
}

interface FormTypeMetadata{
    id: string | number;
    name: string;
    code: string;
    description: string;
    version: number;
}

class MetadataError extends Error{
    constructor(message: string){
        super(message);
    }
}

/** Hard Depreciation */

export class FormAnswerStorage{

    sections: IdTreeOrderedCollection<string | number, FormGroupInstance>;
    section_metadata: Record<string | number, FormSectionMetadata>;
    group_metadata: Record<string | number, FormGroupMetadata>;
    question_metadata: Record<string | number, FormQuestionMetadata>;
    form_type_metadata: FormTypeMetadata;
    constructor(form_type: FormType){
        this.sections = new IdTreeOrderedCollection(this.transformFormGroupMetadataToInstance);
        this.section_metadata = {};
        this.group_metadata = {};
        this.question_metadata = {};
        this.form_type_metadata = {
            id: form_type.id,
            name: form_type.name,
            code: form_type.code,
            version: form_type.version,
            description: form_type.description ?? ""
        }
        this.buildSections(form_type);
    }

    /** This transforms the Keys for the IdTreeOrderedCollection into a Data, which is a FormGroupInstance */
    transformFormGroupMetadataToInstance(metadata_id: string | number | null): FormGroupInstance | null{
        if(metadata_id == null){
            return null;
        }
        const metadata: FormGroupMetadata | null = this.group_metadata[metadata_id] || null;
        if(metadata == null){
            return null;
        }else{
            return this.buildEmptyGroupInstanceFromMetadata(metadata);
        }
    }

    /** This builds an EMPTY Question instance given a FormQuestion object. Specifically it builds a question and answer paired together */
    buildEmptyQuestionInstance(form_question: FormQuestion){
        let curQuestion: FormQuestionMetadata | null = this.question_metadata[form_question.id] || null;
        if(curQuestion == null){
            this.question_metadata[form_question.id] = {
                id: form_question.id,
                label: form_question.label,
                required: form_question.required,
                schema: form_question.schema,
                field_type: form_question.field_type
            };
        }
        return {
            question: form_question.id,
            answer: null
        };
    }


    /** This builds an Empty Group Instance.  SHould be renamed to build Single Group Instance
     * 
     * Note: This does not recursively build groups. Just the questions and a Metadata object if does not exist already 
     * 
     */
    buildEmptyGroupinstance(form_group: FormGroup): FormGroupInstance{
        let curGroup: FormGroupMetadata | null = this.group_metadata[form_group.id] || null;
        if(curGroup == null){
            this.group_metadata[form_group.id] = {
                id: form_group.id,
                parent: form_group.parent,
                form_section: form_group.form_section,
                order: form_group.order,
                questions: form_group.questions,
                children: form_group.children
            }
        }
        let cur_answers = [];
        for(let j = 0; j < form_group.questions.length; j++){
            cur_answers.push(this.buildEmptyQuestionInstance(form_group.questions[j]));
        }
        return {
            group: form_group.id,
            answers: cur_answers
        };
    }

    _recursiveAddFormGroup(form_groups: FormGroup[]){

    }

    /**
     * 
     * @param form_group List of FormGroup objects
     * @param curTree The current Tree to use
     * @param parentLocalID The ID of the parent. Specifically the LOCAL id which can not be a number
     * @returns 
     */
    buildGroup(form_group: FormGroup[], curTree: IdTree<FormGroupInstance> | null = null, parentLocalID: string = ""){
        if(curTree == null){
            curTree = new IdTree();
        }
        for(let i = 0; i < form_group.length; i++){
            let curGroup: FormGroupInstance = this.buildEmptyGroupinstance(form_group[i]);
            let localID: string = curTree.add(curGroup, parentLocalID);
            if(form_group[i].children.length > 0){
                this.buildGroup(form_group[i].children, curTree, localID);
            }
        }
        return curTree;
    }

    buildSections(form_type: FormType){
        for(let i = 0; i < form_type.sections.length; i++){
            this.section_metadata[form_type.sections[i].id] = {
                id: form_type.sections[i].id,
                code: form_type.sections[i].code,
                description: form_type.sections[i].description ?? ""
            }
            let curTree: IdTree<FormGroupInstance> = this.buildGroup(form_type.sections[i].groups);
            this.sections.push(curTree);
        }
    }

    buildEmptyGroupInstanceFromMetadata(form_group_metadata: FormGroupMetadata): FormGroupInstance{
        let cur_answers = [];
        for(let j = 0; j < form_group_metadata.questions.length; j++){
            cur_answers.push(this.buildEmptyQuestionInstance(form_group_metadata.questions[j]));
        }
        return {
            group: form_group_metadata.id,
            answers: cur_answers
        };
    }

    cloneNode(rootId: string, targetId: string): boolean{
        if(rootId.length > 0){
            let tree: 
        }else{
            return false;
        }
    }


}
