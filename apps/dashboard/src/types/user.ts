
export interface User{
    username: string;
}

export function parseUser(data: any): User | null{
    if(data && data?.username){
        return {
            username: data.username
        }
    }else{
        return null;
    }
    
}