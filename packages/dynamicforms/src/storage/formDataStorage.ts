import { Graph } from "../objs/graph";
import { IdData, RegistryTree, Tree, TreeNode } from "../objs/tree";
import { AnswerValue } from "../types/form_answers";
import { FormGroup, FormQuestion, FormSection, FormType } from "../types/form_type";
import { LocalIdHandler } from "../utils/localIdHandler";

/** The following Interfaces are the minimal information needed by the system to represent Instances
 * Any additional information is probably metadata, static, or does not change often and can be linked via
 * question_id or type_id (or maybe even a Local ID, like used in the Instance Graph)
 */



interface FormAnswerInstance{
    question_id: string | number;
    answer_value: AnswerValue;
}

export interface FormGroupInstance extends IdData{
    type_id: string | number;   // This is the ID of the FormGroup Metadata
    answers: FormAnswerInstance[];
}

interface FormGroupMetaData{
    formGroup: FormGroup;
    instances: string[];
}

interface FormSectionMetadata{
    title: string;
    description: string;
}

export interface FormSectionData{
    order: (string | number)[];  // This is the order for the sections
    nodes: Record<string | number, RegistryTree<FormGroupInstance>[]>; // These are lists of Trees representing the different FormGroup for each section
    metadata: Record<string | number, FormSectionMetadata>;  // This is the metadata for each section (including things like title)
}

export class LocalIdClash extends Error{

    constructor(msg: string){
        super(msg);
    }
}


export class FormDataStorage{

    /** This function creates Local Unique IDs, represented as strings */
    static localIdCreate = LocalIdHandler.createLocalID;
    
    /** This function validates Local Unique IDs, represented as strings. Currently just does basic string checking, but can be improved later */
    static localIdValidation = LocalIdHandler.validLocalID;

    instanceGraph: Graph<string>;       // This stores the relationships between Form Group instances
    instanceRecord: Record<string, FormGroupInstance>;   // This holds the specific FormGroup instances data, not the relationships

    metaGraph: Graph<string | number>;  // This stores the relationships between Form Group Types
    metaRecord: Record<string | number, FormGroupMetaData>;  // This stores the instances for a given Type (or backend ID) of a Form Group

    metaQuestion: Record<string | number, FormQuestion>;    // Holds metadata for Questions specifically

    sections: FormSectionData;  // This to hold the order of the root form groups

    constructor(formType: FormType){

        /** This is where the data itself is held independent of relationships.
         * 
         * Meta currently just holds the individual instances for that type, but should probably hold things like the questions too.
         * Instance holds the current answers and is where the actual value changes take place,
         */
        this.metaRecord = {};
        this.instanceRecord = {};

        this.metaQuestion = {}; // Special type of meta records holding specifically FormQuestion Metadata, indexed by question_id (backend id)

        /** For these graphs, a Forward Edge indicates the child relationship, while a back edge indicates parenthood
         * Directionality of edges is determined by (src --> dst), which is seen in the add function. Graph.add(src, dst)
         * 
         * MetaGraph holds the static information about the relationships between FormGroup types as given by the backend.
         * InstanceGraph holds the dynamic edited relationships, mainly for when a FormGroup has multiple answers. The MetaGraph allows
         * for a look up for when duplicate instances are made, their children can also be duplicated, as well as perserving the specific 
         * links between instances.
         */
        this.instanceGraph = new Graph((key: string) => key);
        this.metaGraph = new Graph((key: string | number) => key.toString());   // May not need this

        this.sections = {
            order: [],
            nodes: {},
            metadata: {}
        };

        for(const section of formType.sections){
            this.initializeGivenFormSection(section);
        }

    }

    initializeGivenFormSection(section: FormSection){
        this.sections.order.push(section.id);
        this.sections.metadata[section.id] = {
            title: section.name || section.code,
            description: section.description || ""
        }
        for(const formGroup of section.groups){
            this.buildMetaFromFormGroupBackendData(formGroup);  // Build Metadata for FormGroups
            this.buildInstanceFromFormGroup(formGroup);         // Build initial instances for FormGroups
            this.sections.nodes[section.id] = this.parseInstanceByBackendID(formGroup.id);  // Parse instances for FormGroups into a form readable by UI Parser
        }
    }

    /** Given a FormGroup data given from the Backend, store the necessary MetaData relationships in a graph and initialize the
     * starting Instances, with their relationships intact.
     * 
     * @param backendFormGroup A piece for backend data representing / describing a FormGroup that has no answers given.
     */
    buildMetaFromFormGroupBackendData(backendFormGroup: FormGroup){
        if(backendFormGroup.parent != null){
            this.metaGraph.addEdge(backendFormGroup.parent, backendFormGroup.id);   // Add the edge if the parent is not null
        }else{
            // Parent is null, which means this is a Root Node. A Root Node is a FormGroup that is not a child to another FormGroup,
            // but rather is standalone within its Section (denoted by the backendFormGroup.section which is the Backend ID for the FormSection)

            // I am not sure where to store root nodes at the moment.
            
            // Maybe just add as a vertex to the graph?
        }
        this.metaRecord[backendFormGroup.id] = {
            formGroup: backendFormGroup,
            instances: []
        }
        for(const question of backendFormGroup.questions){
            this.metaQuestion[question.id] = question;
        }

        for(const child of backendFormGroup.children){
            this.buildMetaFromFormGroupBackendData(child);
        }
    }

    /** This builds an Instance from a given FormGroup backend data. Used to initialize, but may also be used instead of MetaGraph???
     * Adds to the Instance Graph.
     * 
     * @param formGroup The backend data used to build the instances
     * @param parent The Local ID of the instance parent to use when building the new instance. Empty string indicates root
     */
    buildInstanceFromFormGroup(formGroup: FormGroup, parent: string = ""){
        const curGroupLocalID: string = FormDataStorage.localIdCreate();
        if(FormDataStorage.localIdValidation(curGroupLocalID)){
            const answers: FormAnswerInstance[] = [];
            for(const question of formGroup.questions){
                answers.push({
                    question_id: question.id,
                    answer_value: null
                });
            }
            this.instanceRecord[curGroupLocalID] = {
                type_id: formGroup.id,
                id: curGroupLocalID,
                answers: answers
            };

            // Add instance to the Meta Records
            let curMetaRecord: FormGroupMetaData | null = this.metaRecord[formGroup.id] || null;
            if(curMetaRecord == null){
                curMetaRecord = {
                    formGroup: formGroup,
                    instances: []
                };
            }
            curMetaRecord.instances.push(curGroupLocalID);
            this.metaRecord[formGroup.id] = curMetaRecord;

            // Check if has Parent
            if(FormDataStorage.localIdValidation(parent)){
                this.instanceGraph.addEdge(parent, curGroupLocalID)
            }else{
                this.instanceGraph.addVertex(curGroupLocalID);
            }

            for(const child of formGroup.children){
                this.buildInstanceFromFormGroup(child, curGroupLocalID);
            }
        }
    }

    _recursiveParseInstance(instanceID: string): TreeNode<FormGroupInstance> | null{
        const instanceRecord: FormGroupInstance | null = this.instanceRecord[instanceID] || null;
        if(instanceRecord != null){
            const childrenIDs: string[] | null = this.instanceGraph.getEdges(instanceID);
            const curNode: TreeNode<FormGroupInstance> = new TreeNode(instanceRecord);
            if(childrenIDs != null && childrenIDs.length > 0){
                for(const childID of childrenIDs){
                    let childNode: TreeNode<FormGroupInstance> | null = this._recursiveParseInstance(childID);
                    if(childNode != null){
                        curNode.addNodeChild(childNode);
                    }
                }
            }
            return curNode;
        }else{
            return null;
        }
        
    }

    /** Initializes the List of Trees for a FormSection. It must be List of Trees since the top level group
     * could allow for multiple instances. Each Tree represents nested FormGroup instances, where children are 
     * FormGroupInstances that are necessarily tied to the FormGroupInstance parent. This allows for the structure
     * to maintained during editing and enables the relationships between the Data to persist in a format that can be 
     * sent to the backend.
     * 
     * @param rootFormGroupBackendId This is the ID of the FormGroupType, otherwise known as the Backend ID provided by Django.
     * @returns A list of RegistryTree objects that hold FormGroupInstances. 
     */
    parseInstanceByBackendID(rootFormGroupBackendId: string | number): RegistryTree<FormGroupInstance>[]{
        const formGroupMetadata: FormGroupMetaData | null = this.metaRecord[rootFormGroupBackendId] || null;
        if(formGroupMetadata != null){
            const instanceIds: string[] = formGroupMetadata.instances;
            let trees: RegistryTree<FormGroupInstance>[] = [];
            for(const instanceID of instanceIds){
                let curNode: TreeNode<FormGroupInstance> | null = this._recursiveParseInstance(instanceID);
                if(curNode == null){
                    continue;
                }else{
                    trees.push(new RegistryTree<FormGroupInstance>(curNode));
                }
            }
            return trees;
        }else{
            throw new Error(`No Metadata found for id: ${rootFormGroupBackendId}`);
        }
    }

    getParents(instanceID: string): string[]{
        if(FormDataStorage.localIdValidation(instanceID)){
            const parents: string[] | null = this.instanceGraph.getBackEdges(instanceID);
            if(parents == null){
                return [];
            }else{
                return parents;
            }
        }else{
            throw new Error(`Invalid Instace Local ID: ${instanceID}`)
        }
    }

    getFormGroupMetadataIdForInstance(instanceID: string): string | number{
        if(FormDataStorage.localIdValidation(instanceID)){
            const instanceObject: FormGroupInstance | null = this.instanceRecord[instanceID] || null;
            if(instanceObject == null){
                throw new Error(`Instance Object can not be found for given Instance ID: ${instanceID}`);
            }else{
                const metadata: FormGroupMetaData | null = this.metaRecord[instanceObject.type_id] || null;
                if(metadata == null){
                    throw new Error(`Metadata associated with ID: ${instanceObject.type_id} was not found the given Instance ID: ${instanceID}`);
                }else if(instanceID in metadata.instances){
                    return metadata.formGroup.id;
                }else{
                    throw new Error(`Metadata with ID: ${metadata.formGroup.id} does not contain the given InstanceID: ${instanceID}`);
                }
            }
        }else{
            throw new Error(`The Instance ID: ${instanceID} is not valid`);
        }
    }

    addNewInstance(groupMetadataID: string | number, oldInstanceID: string = ""){
        const formGroupMetadata: FormGroupMetaData | null = this.metaRecord[groupMetadataID] || null;
        if(formGroupMetadata == null){
            throw new Error(`No Metadata found for this Group Metadata ID: ${groupMetadataID}`)
        }else{
            const sectionID: string | number = formGroupMetadata.formGroup.form_section;
            const sectionMetaObj: FormSectionMetadata | null = this.sections.metadata[sectionID] || null;
            if(sectionMetaObj == null){
                throw new Error(`Can not find a FormSection for ${sectionID}`);
            }
            const newCurLocalID: string = FormDataStorage.localIdCreate();
            if(FormDataStorage.localIdValidation(newCurLocalID)){
                const instanceObj: FormGroupInstance | null = this.instanceRecord[newCurLocalID] || null;
                if(instanceObj == null){
                    const answers: FormAnswerInstance[] = [];
                    for(const question of formGroupMetadata.formGroup.questions){
                        answers.push({
                            question_id: question.id,
                            answer_value: null
                        });
                    }
                    this.instanceRecord[newCurLocalID] = {
                        type_id: formGroupMetadata.formGroup.id,
                        id: newCurLocalID,
                        answers: answers
                    };
                    formGroupMetadata.instances.push(newCurLocalID)
                    if(typeof(oldInstanceID) == 'string' && FormDataStorage.localIdValidation(oldInstanceID)){
                        const parentInstanceIDs: string[] = this.getParents(oldInstanceID);
                        for(const parent of parentInstanceIDs){
                            this.instanceGraph.addEdge(parent, newCurLocalID)
                        }
                    }else{
                        this.instanceGraph.addVertex(newCurLocalID);
                    }

                }else{
                    throw new LocalIdClash(`This ID already exists: ${newCurLocalID}\n\t`)
                }
                
            }
        }
    }

}