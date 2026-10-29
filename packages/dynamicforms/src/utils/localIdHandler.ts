
/** This class Handles the Validation for the 2 types of ids that is used by
 * Forms -> Local ID and Backend ID. Backed ID is the ID in the Django Database and can 
 * be used to identify specific Questions, Groups and Sections. The issue is that some of 
 * these objects are allowed to have multiple instances in the Forms based on metadata.
 * 
 * Local IDs, also known as Instance IDs, are used to uniquely identify each set of questions, and more importantly answers,
 * and their relationships to other data when there are multiples. 
 * 
 * Uniqueness within Questions, Groups and Instances is considered to be a simply the local id, but the backend id is
 * necessarily tied to in it order to look up metadata and to hold that relationship.
 */
export class LocalIdHandler{
    static validLocalID(local_id: string){
        if(local_id.length <= 0){
            return false;
        }else{
            return true;
        }
    }

    static validBackendId(backend_id: (string|number)){
        if(typeof(backend_id) == "number"){
            return ((backend_id > 0) && Number.isInteger(backend_id));
        }else if(typeof(backend_id) == "string"){
            return (backend_id.length > 0);
        }else{
            return false;
        }
    }

    static createLocalID(): string{
        return crypto.randomUUID();
    }
}

export class IdClashError extends Error{

    constructor(message: string){
        super(message);
    }
}

export class LocalIdInvalidError extends Error{

    constructor(message: string){
        super(message);
    }
}
