
export interface IdData{
    id: string;
}

export class TreeNode<Data>{
    data: Data;
    children: TreeNode<Data>[];

    constructor(data: Data, children: TreeNode<Data>[] = []){
        this.data = data;
        this.children = children;
    }

    addChild(data: Data){
        this.children.push(new TreeNode<Data>(data));
    }

    addNodeChild(newNode: TreeNode<Data>){
        this.children.push(newNode);
    }

}

export class Tree<Data>{

    static mutable_root_flag: boolean = false;

    root: TreeNode<Data> | null;

    constructor(root: TreeNode<Data> | null = null){
        this.root = root;
    }

    // Convience method as direct root access is possible for setting TreeNode<Data> as root.
    setRoot(rootData: Data){
        if(this.root == null){
            this.root = new TreeNode<Data>(rootData);
        }else if(!Tree.mutable_root_flag){
            throw new Error("Root was not Null")
        }else{
            this.root = new TreeNode<Data>(rootData)
        }
    }
}


export class RegistryTree<Data extends IdData> extends Tree<Data>{

    register: Record<string, TreeNode<Data>>;

    constructor(root: TreeNode<Data> | null = null){
        super(root);
        this.register = {};
        if(this.root != null){
            this.registerNode(this.root);
        }
    }

    // Depreciated
    addNode(id: string, node: TreeNode<Data>, parentID: string = ""){
        if(id.length > 0){
            let registeredNode: TreeNode<Data> | null = this.register[id] || null;
            if(registeredNode == null){
                if(parentID.length <= 0){
                    // This means a Root Node
                    if(this.root == null){
                        this.root = node;
                    }else if(Tree.mutable_root_flag){
                        this.root = node; 
                    }else{
                        throw new Error("Root already exists and is not mutable")
                    }
                }else{
                    let parentNode: TreeNode<Data> | null = this.register[parentID] || null;
                    if(parentNode == null){
                        // Parent supplied, but no parent found
                        throw new Error(`No parent for id: ${parentID} has been found`);
                    }else{
                        this.register[id] = node;
                        parentNode.addNodeChild(node);
                    }
                }
                this.registerNode(node, false);    // This will cause an error if it touches any old IDs
            }else{
                throw new Error(`Already exists a node with this id: ${id}`);
            }
        }else{
            throw new Error("No ID provided")
        }
    }

    registerNode(node: TreeNode<Data>, skipConflicts: boolean = false){
        let nodeID: string = node.data.id;
        if(nodeID.length > 0){
            let registeredNode: TreeNode<Data> | null = this.register[nodeID] || null;
            if(registeredNode == null){
                this.register[nodeID] = node;
            }else{
                // Conflict
                if(!skipConflicts){
                    throw new Error(`A node already has the id: ${nodeID} registered\n\tOld Node: ${registeredNode}\n\tNew Node: ${node}`)
                }
            }
            for(let i = 0; i < node.children.length; i++){
                this.registerNode(node.children[i]);
            }
        }else{
            throw new Error(`Node has an invalid ID: ${node}`)
        }
    }

}