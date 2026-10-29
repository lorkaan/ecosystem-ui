import {LocalIdHandler } from "../utils/localIdHandler";

interface BackendData{
    id: (string | number);
}

interface Ordering<D extends BackendData>{
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

/** Soft Depreciation */
export class OrderedCollection implements Ordering{

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