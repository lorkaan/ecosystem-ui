import { IdClashError, LocalIdHandler, LocalIdInvalidError } from "../utils/localIdHandler";

/** Soft Depreciation */

export interface TreeNodeInterface<Data>{
    parent: TreeNodeInterface<Data> | null;
    id: string;
    data: Data;
    children: Record<string, TreeNodeInterface<Data>>;
    children_order: string[];
}

export class TreeNode<Data> implements TreeNodeInterface<Data>{

    static localIdCreate = LocalIdHandler.createLocalID;

    static localIdValidation = LocalIdHandler.validLocalID;

    static retryHashIterations: number = 5;

    id: string;
    parent: TreeNode<Data> | null;
    data: Data;
    children: Record<string, TreeNode<Data>>;
    children_order: string[];
    constructor(data: Data, parent: TreeNode<Data> | null = null, id: string = ""){
        this.parent = parent;
        this.data = data;
        this.children = {};
        this.children_order = [];
        if(TreeNode.localIdValidation(id)){
            this.id = id;
        }else{
            this.id = TreeNode.localIdCreate();
        }
        
    }

    addChild(childData: Data, index: number = -1, local_id: string = ""): [string, TreeNode<Data>]{
        if(!Number.isInteger(index) || index < -1 || index >= this.children_order.length){
            index = -1;
        }
        let tmp: TreeNode<Data> | null
        if(local_id.length > 0){
            if(TreeNode.localIdValidation(local_id)){
                tmp = this.children[local_id] || null;
                if(tmp != null){
                    throw new IdClashError(`Already had a id of ${local_id}`);
                }else{
                    let newNode: TreeNode<Data> = new TreeNode<Data>(childData, this, local_id);
                    this.children[local_id] = newNode
                    if(index < 0){
                        this.children_order.push(local_id);
                    }else{
                        this.children_order.splice(index, 0, local_id);
                    }
                    return [local_id, newNode];
                }
            }else{
                throw new LocalIdInvalidError(`Invalid Lookup ID: ${local_id}`)
            }
        }else{
            let childNodeID: string = TreeNode.localIdCreate();
            tmp = this.children[childNodeID] || null;
            for(let i = 0; i < TreeNode.retryHashIterations; i++){
                childNodeID = TreeNode.localIdCreate();
                tmp = this.children[childNodeID] || null;
                if(tmp == null){
                    let newNode: TreeNode<Data> = new TreeNode<Data>(childData, this, childNodeID);
                    this.children[childNodeID] =  newNode;
                    if(index < 0){
                        this.children_order.push(childNodeID);
                    }else{
                        this.children_order.splice(index, 0, childNodeID);
                    }
                    return [childNodeID, newNode];
                }else{
                    continue;
                }
            }
            throw new IdClashError(`Could not create a new child with unique ID for: ${childData}`)
        }
    }

    getChildren(){
        return this.children;
    }

    getChildrenOrder(){
        return this.children_order;
    }

    getChildByIndex(index: number): [string, (TreeNode<Data> | null)]{
        if(Number.isInteger(index) && index >= 0 && index < this.children_order.length){
            const indexID: string = this.children_order[index];
            return [indexID, this.children[indexID] || null];
        }else{
            throw new RangeError(`Index is not within range: ${index}`);
        }
    }

    removeByIndex(index: number): boolean{
        if(Number.isInteger(index) && index >= 0 && index < this.children_order.length){
            const removeId: string = this.children_order.splice(index, 1)[0];
            delete this.children[removeId];
            return true;
        }else{
            return false;
        }
    }

    removeById(local_id: string){
        if(local_id.length > 0){
            if(TreeNode.localIdValidation(local_id)){
                const removeIndex: number = this.children_order.indexOf(local_id);
                if(removeIndex >= 0 && removeIndex < this.children_order.length){
                    this.children_order.splice(removeIndex, 1);
                }
                delete this.children[local_id];
                return true;
            }else{
                throw new LocalIdInvalidError(`Can not validate the given ID: ${local_id}`);
            }
        }else{
            return true;
        }
    }
}

export class IdSearchError<Data> extends Error {

    
    constructor(message: string){
        super(message);
        
    }
}
export interface IdTreeInsertionDataInterface<Data>{
    data: Data
    parent: TreeNodeInterface<Data> | string | null
}

/** This is a special error for indicating a new Tree needs to be made. */
export class IdTreeNewRootError extends Error{

    constructor(message: string){
        super(message);
    }
}

export class IdTree<Data>{

    root: TreeNode<Data> | null;
    IdRecord: Record<string, TreeNode<Data>>;
    rootId: string;
    constructor(){
        this.root = null;
        this.rootId = "";
        this.IdRecord = {};
    }

    add(data: Data, parent: TreeNode<Data> | string | null = null, order_index: number = -1): string{
        if(this.root == null){
            // This is the base case where there is no data in the Tree yet.
            if((parent == null) || (typeof(parent) == 'string' && parent.length <= 0)){
                // A null representation of parent. Correct for this case.
                let childNodeID: string = TreeNode.localIdCreate();
                this.root = new TreeNode<Data>(data, null, childNodeID);
                this.IdRecord[childNodeID] = this.root;
                this.rootId = childNodeID;
                return childNodeID;
            }else{
                throw new IdSearchError(`Children added to Tree with no root can not have parent: ${parent}`);
            }
        }else{
            // The following are the cases when the Tree is not empty.

            // Normalize the parent parameter to be a TreeNodeInterface object or null. 
            let parentNode: TreeNode<Data> | null;
            if(typeof(parent) == "string"){
                if(parent.length > 0){
                    parentNode = this.get(parent);
                }else{
                    parentNode = null;
                }
            }else{
                parentNode = parent;
            }

            if(parentNode == null){
                // No Parent for this Node and Root is already set. This belongs in either a differnt IdTree, or a new IdTree
                throw new IdTreeNewRootError("Given data can not be found in this tree, or needs a new tree");
            }else{
                const [childID, childNode]: [string, TreeNode<Data>] = parentNode.addChild(data, order_index);
                this.IdRecord[childID] = childNode;
                return childID;
            }
        }
    }

    get(id: string): TreeNode<Data> | null{
        if(TreeNode.localIdValidation(id)){
            return this.IdRecord[id] || null;
        }else{
            throw new IdSearchError(`ID given is invalid: ${id}`);
        }
    }

    remove(parent: TreeNode<Data> | string, remove_obj: string | number){
        if(typeof(parent) == 'string'){
            const parentNode: TreeNode<Data> | null = this.get(parent);
            if(parentNode == null){
                throw new IdSearchError(`Can not find parent node for: ${parent}`);
            }else{
                parent = parentNode;
            }
        }
        if(typeof(remove_obj) == 'string'){
            if(parent.removeById(remove_obj)){
                delete this.IdRecord[remove_obj]
            }
        }else{
            const [id, node]: [string, TreeNode<Data> | null] = parent.getChildByIndex(remove_obj);
            if(parent.removeById(id)){
                delete this.IdRecord[remove_obj]
            }
        }
    }

}