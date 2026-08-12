export type Visibility = "auth" | "unauth" | "both";

export interface ToolbarItem{
    path: string;
    label: string;
    visibility: Visibility;
    params?: Record<string, string | number | boolean>;
}

export interface ToolbarAuthLists{
    auth: ToolbarItem[];
    unauth: ToolbarItem[];
}

/** Converts a single toolbar list to auth and unauth lists
 * 
 * @param toolbarItems ToolbarItem[]
 * @returns 
 */
export function createToolbarLists(toolbarItems: ToolbarItem[]): ToolbarAuthLists{
    let authList: ToolbarItem[] = [];
    let unauthList: ToolbarItem[] = [];
    for(let i = 0; i < toolbarItems.length; i++){
        if(toolbarItems[i].visibility == "both"){
            authList.push(toolbarItems[i]);
            unauthList.push(toolbarItems[i]);
        }else if(toolbarItems[i].visibility == "auth"){
            authList.push(toolbarItems[i]);
        }else if(toolbarItems[i].visibility == "unauth"){
            unauthList.push(toolbarItems[i]);
        }else{
            continue;
        }
    }
    return {
        auth: authList,
        unauth: unauthList
    }
}