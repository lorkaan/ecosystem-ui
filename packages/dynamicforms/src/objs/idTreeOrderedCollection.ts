import { IdTree, TreeNode } from "./IdTree";

/** Soft Depreciation */

interface IdTreeOrderedCollectionInterface<Data>{
    local_id_order: string[]; // These are the Local IDs of the root TreeNode for the IdTrees
    local_id_data_map: Record<string, IdTree<Data>>;
}

class IdTreeRootValueError extends Error{
    constructor(message: string){
        super(message);
    }
}

type Transformer<Key, Data> = (params: Key | null) => Data | null;

export class IdTreeOrderedCollection<Key, Data> implements IdTreeOrderedCollectionInterface<Data>{

    local_id_order: string[];
    local_id_data_map: Record<string, IdTree<Data>>;
    transform_data: Transformer<Key, Data>;
    constructor(transform_data_function: Transformer<Key, Data>){
        this.local_id_order = [];
        this.local_id_data_map = {};
        this.transform_data = transform_data_function;
    }

    push(tree: IdTree<Data>): boolean{
        return this._add_new_root_id(tree);
    }

    _add_new_root_id(tree: IdTree<Data>, rootNodeId: string = "", treeOrderIndex: number = -1){
        if(rootNodeId.length <= 0){
            rootNodeId = tree.rootId;
        }
        if(TreeNode.localIdValidation(rootNodeId)){
            if(treeOrderIndex < 0){
                this.local_id_order.push(rootNodeId);
            }else if(treeOrderIndex >= 0 && treeOrderIndex < this.local_id_order.length){
                this.local_id_order.splice(treeOrderIndex, 0, rootNodeId);
            }else{
                throw new RangeError(`Tree Index of: ${treeOrderIndex} is out of range`);
            }
            this.local_id_data_map[rootNodeId] = tree;
            return true;
        }else{
            return false;
        }
    }

    /** This is the external facing add function. It will take a key and use the transform function to build a Data for the given Key */
    add(key: Key, root: IdTree<Data> | string | null = null, parent: TreeNode<Data> | string | null = null, order_index: number = -1, treeOrderIndex: number = -1): boolean{
        const data: Data | null = this.transform_data(key);
        if(data == null){
            return false;
        }else{
            return this._add(data, root, parent, order_index, treeOrderIndex);
        }
    }

    _add(data: Data, root: IdTree<Data> | string | null = null, parent: TreeNode<Data> | string | null = null, order_index: number = -1, treeOrderIndex: number = -1): boolean{
        // Normalize the root from id to the actual object.
        let tree: IdTree<Data> | null = null;
        if(typeof(root) == "string"){
            if(root.length > 0){
                tree = this.getTree(root);
            }else{
                tree = null;
            }
        }else{
            tree = root;
        }
        if(tree == null){
            // This is to add a new Tree 
            tree = new IdTree();
            const rootNodeId: string = tree.add(data);
            return this._add_new_root_id(tree, rootNodeId);
        }else{
            // An IdTree was found

            // Normalize the Parent to TreeNode<Data> | null
            let parentNode: TreeNode<Data> | null;
            if(typeof(parent) == 'string'){
                if(parent.length > 0){
                    parentNode = this.getTreeNode(tree, parent);
                }else{
                    parentNode = null;
                }
            }else{
                parentNode = parent;
            }
            try{
                const childTreeNodeId: string = tree.add(data, parentNode, order_index);
                if(TreeNode.localIdValidation(childTreeNodeId)){
                    return true;
                }else{
                    return false;
                }
            }catch(e){
                return false;
            }
        }
    }

    getTree(id: string): IdTree<Data> | null{
        if(TreeNode.localIdValidation(id)){
            return this.local_id_data_map[id] || null;
        }else{
            throw null;
        }
    }

    getTreeNode(root: IdTree<Data> | string, id: string | null = null): TreeNode<Data> | null{
        // Normalize to either IdTree<Data> or null to remove the string variance
        let tree: IdTree<Data> | null = null;
        if(root == null){
            throw new IdTreeRootValueError(`Can not get Root TreeNode for: ${root}`);
        }else if(typeof(root) == 'string'){
            tree = this.getTree(root);
        }else{
            tree = root;
        }

        if((id == null) || (typeof(id) == "string" && id.length <= 0)){
            return tree?.root || null;
        }else{
            // The ID is given, so we are looking for a child or a IdTree instead of a root.
            return tree?.get(id) || null;
        }
    }

}