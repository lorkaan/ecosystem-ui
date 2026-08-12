type StoredQueryResult = Record<string, any>

export interface StoredQueryResponse{
    results: StoredQueryResult[];
}