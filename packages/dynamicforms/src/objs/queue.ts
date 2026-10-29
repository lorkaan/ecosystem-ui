
class Node<T>{

    data: T;
    next: Node<T> | null;
    constructor(data: T, next: Node<T>|null = null){
        this.data = data;
        this.next = next;
    }
}

export class Queue<T>{
    
    root: Node<T> | null;
    tail: Node<T> | null;
    constructor(){
        this.root = null;
        this.tail = null;
    }

    add(item: T){
        const newNode: Node<T> =  new Node<T>(item, null);
        if(this.tail == null){
            this.root = newNode;
            this.tail = newNode;
        }else{
            this.tail.next = newNode;
            this.tail = newNode;
        }
    }

    peek(): T | null{
        if(this.root == null){
            return this.root;
        }else{
            return this.root.data;
        }
    }

    pop(): T | null{
        const rootNode: Node<T> | null = this.root;
        if(rootNode == null){
            this.tail = null;
            return rootNode;
        }else{
            this.root = rootNode.next;
            return rootNode.data;
        }
    }

    createList(): T[]{
        let dataList: T[] = [];
        while(this.peek() != null){
            const data: T | null = this.pop();
            if(data == null){
                break;
            }else{
                dataList.push(data);
            }
        }
        return dataList;
    }
}