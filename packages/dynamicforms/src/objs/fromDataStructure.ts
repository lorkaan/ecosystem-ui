import type { AnswerValue } from "../types/answers";
import type { FormGroup, FormSection } from "../types/form_type";
import { IdClashError, LocalIdHandler } from "../utils/localIdHandler";
import { TreeNode } from "./IdTree";

/** Hard Depreciated  */


/**
 * This class handles linking Instances to Backend Types and their Metadata
 */
class IdMetadataStorage<AValue, Metadata>{

    localToBackendMap: Record<string, (string | number)>;
    idStorage: Record<string, AValue>;
    metadata: Record<(string | number), Metadata>;
    constructor(){
        this.localToBackendMap = {};
        this.idStorage = {};
        this.metadata = {};
    }

    create(backend_id: (string | number), value: AValue, metadata: Metadata | null): string{
        if(LocalIdHandler.validBackendId(backend_id)){
            let cur_metadata: Metadata | null = this.metadata[backend_id] || null;
            if((metadata == null) && (cur_metadata == null)){
                throw new TypeError(`No Metadata previously stored, and no Metadata provided. ${metadata}`);
            }else if((metadata != null) && (cur_metadata != null)){
                throw new IdClashError(`Provided Metadata but already have Metadata stored for: ${backend_id}`);
            }else if((cur_metadata == null) && (metadata != null)){
                this.metadata[backend_id] = metadata;
            }
            const localID: string = LocalIdHandler.createLocalID();
            const idValue: AValue | undefined = this.idStorage[localID] || undefined;
            const localIdBackendId: (string | number) | null = this.localToBackendMap[localID] || null;
            if((idValue !== undefined) && (localIdBackendId != null)){
                throw new IdClashError(`Found a class at the Local ID: ${localID}`);
            }else if((idValue === undefined) && (localIdBackendId == null)){
                this.idStorage[localID] = value;
                this.localToBackendMap[localID] = backend_id;
                return localID;
            }else if((idValue === undefined) && (localIdBackendId == backend_id)){
                this.idStorage[localID] = value;
                return localID;
            }else{
                throw new IdClashError(`There is a hash collision on ${localID}`);
            }
        }else{
            throw new TypeError(`Backend ID ${backend_id} is not valid.`);
        }
    }

    getInstanceValue(local_id: string): AValue | undefined{
        if(LocalIdHandler.validLocalID(local_id)){
            return this.idStorage[local_id] || undefined;
        }else{
            return undefined;
        }
    }

    getMetadataForInstance(local_id: string): Metadata | null{
        if(LocalIdHandler.validLocalID(local_id)){
            const backend_id: (string | number) | null = this.getBackendIdFromInstance(local_id);
            if(backend_id == null){
                return null;
            }else{
                return this.getMetadata(backend_id);
            }
        }else{
            return null;
        }
    }

    getMetadata(backend_id: (string | number)): Metadata | null{
        if(LocalIdHandler.validBackendId(backend_id)){
            return this.metadata[backend_id] || null;
        }else{
            return null;
        }
        
    }

    getBackendIdFromInstance(local_id: string): (string | number) | null{
        if(LocalIdHandler.validLocalID(local_id)){
            return this.localToBackendMap[local_id] || null;
        }else{
            return null;
        }
    }
}

interface Ordering{
    type_order: Record<number, (string|number)>;                     // Ordering of different backend ids
    instances: Record<string|number, string[]>;  // Ordering of the same backend ids (local ids)
}

export class OrderError extends Error{

    constructor(msg: string){
        super(`Order Clash: ${msg}`);
    }
}

/** This class handles how the ordering works in relation to both the backend ids as well as
 * the ordering of the individual instance or local ids when dealing with looping groups.
 * 
 * types handles the ordering of the backend ids, using the order value as a key. This works because
 * iterating over a record with numbers as keys automatically does it in ascending order.
 * 
 * The instances holds a reference to the order of instances of the same backend id. 
 * 
 * A single instance of a Section could be considered as an OrderedCollection of the Groups under it,
 * similarly a single instance of a Group is considered as an OrderedCollection of the Questions under it.
 * 
 * This does not store the relationship between Groups themselves, which can be nested.
 */
class OrderedCollection implements Ordering{

    static validOrderNumber(order: number){
        return ((order >= 0) && Number.isInteger(order));
    }

    type_order: Record<number, (string|number)>;                   // Ordering of different backend ids
    instances: Record<string|number, string[]>;
    constructor(){
        this.type_order = {};
        this.instances = {};
    }

    add(backend_id: string|number, order:number, local_id: string = ""): string{
        if(LocalIdHandler.validBackendId(backend_id) && OrderedCollection.validOrderNumber(order)){
            if(LocalIdHandler.validLocalID(local_id) == false){
                local_id = LocalIdHandler.createLocalID();
            }
            if(this.type_order[order]){
                // Already something existing
                throw new OrderError(`Order ${order} already has a value -> ${this.type_order[order]}`);
            }else{
                this.type_order[order] = backend_id;
                let tmp = this.instances[backend_id] || []
                tmp.push(local_id);
                this.instances[backend_id] = tmp;
                return local_id
            }
        }else{
            throw new TypeError(`Expected a valid Backend ID or Order value, instead got: Backed ID: ${backend_id}, Order: ${order}`);
        }
    }

    // Change this ??
    removeInstance(backend_id: string|number, instance_index: number = -1): string | null{
        let tmp = this.instances[backend_id] || [];
        let local_id: string = "";
        if(tmp.length > 0){
            tmp.splice(instance_index, 1);
            if(tmp.length <= 0){ // Can't have no user interface
                local_id = LocalIdHandler.createLocalID();
                tmp.push(local_id);
            }
            this.instances[backend_id] = tmp;
        }else{  // Can't have no user interface
            local_id = LocalIdHandler.createLocalID();
            tmp.push(local_id);
        }
        if(LocalIdHandler.validLocalID(local_id)){
            return local_id;
        }else{
            return null;
        }
    }

    createOrderedList(): [(number|string), string, number][]{
        let orderList: [(number|string), string, number][] = [];
        Object.entries(this.type_order).forEach(([_, backend_id]) =>{
            const instances: string[] = this.instances[backend_id] || [];
            for(let i = 0; i < instances.length; i++){
                orderList.push([backend_id, instances[i], i]);  // Return Backend ID, Local ID, Index
            }
        });
        return orderList;
    }

    clone(): [OrderedCollection, string[]]{
        let newOrderedCollection: OrderedCollection = new OrderedCollection();
        let newLocalIds: string[] = [];
        Object.entries(this.type_order).forEach(([order, backend_id]) =>{
            const nummerized_order: number = Number.parseInt(order);
            if(Number.isInteger(nummerized_order)){
                let newID: string = newOrderedCollection.add(backend_id, nummerized_order);
                if(newID.length > 0){
                    newLocalIds.push(newID);
                }
            }else{
                throw new TypeError(`Expected order to be a stringified Integer, instead got: ${order} -> NaN = ${Number.isNaN(nummerized_order)}`);
            }
        });
        return [newOrderedCollection, newLocalIds];
    }
}

interface QuestionMetadata{

}

interface GroupMetadata{

}

interface SectionMetadata{

}

class FormDataStructure{

    createGroup(group: FormGroup, parent: TreeNode<OrderedCollection> | null = null){
        let curCollection: OrderedCollection = new OrderedCollection();
        group.questions.forEach(question =>{
            let qId: string = this.questions.create(question.id, null, {});
            curCollection.add(question.id, question.order, qId);
        })
        let groupNode: TreeNode<OrderedCollection> = new TreeNode(curCollection, parent);
        group.children?.forEach((child: FormGroup) => {
            
            groupNode.addChild()
        })
    }

    group_order: TreeNode<OrderedCollection>;

    questions: IdMetadataStorage<AnswerValue, QuestionMetadata>;
    groups: IdMetadataStorage<OrderedCollection, GroupMetadata>;
    sections: IdMetadataStorage<OrderedCollection, SectionMetadata>;
    constructor(formSections: FormSection[]){
        this.questions = new IdMetadataStorage();
        this.groups = new IdMetadataStorage();
        this.sections = new IdMetadataStorage();

        formSections.forEach((sectionDef: FormSection) =>{
            let currentSectionCollection: OrderedCollection = new OrderedCollection();
            sectionDef.groups.forEach((group: FormGroup) => {
                let groupNode: TreeNode<OrderedCollection> = new TreeNode(new OrderedCollection());
                if(group.children != null){
                    group.children.forEach((child: FormGroup) =>{
                        groupNode.addChild()
                    });
                }
                let curGroupInstanceID: string = this.groups.create(group.id, groupNode, {});
            })
            let curSectionInstanceID: string = this.sections.create(sectionDef.id, currentSectionCollection, {});
        });
    }
}