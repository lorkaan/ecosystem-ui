export type GraphKeyTransform<Key> = (key: Key) => string; // Needs to be deterministic, unqiue transformation

export class Graph<Key>{

    vertex_lookup: Record<string, number>;
    vertex: (Key | null)[];
    edges: Record<number, number[]>;
    backedges: Record<number, number[]>;
    keyTransform: GraphKeyTransform<Key>;
    constructor(transform: GraphKeyTransform<Key>){
        this.vertex = [];
        this.edges = {};
        this.vertex_lookup = {};
        this.backedges = {};
        this.keyTransform = transform;
    }

    addVertex(src: Key){
        const src_lookup: string = this.keyTransform(src);
        if(src_lookup.length <= 0){
            throw new Error(`Can not get lookup ${src_lookup} from key: ${src}`);
        }else{
            let src_number: number | null = this.vertex_lookup[src_lookup] || null;
            if(src_number == null){
                src_number = this.vertex.length;
                this.vertex.push(src);
            }
            if(this.vertex[src_number] == null){
                this.vertex[src_number] = src;
            }
        }
    }

    /** Adds an Edge to the Graph. 
     * If either side of the edge (or both) do not exist, it creates an entry for 
     * the vertex that do not.
     */
    addEdge(src: Key, dst: Key){
        const src_lookup: string = this.keyTransform(src);
        const dst_lookup: string = this.keyTransform(dst);
        if(src_lookup.length <= 0){
            throw new Error(`Can not get lookup ${src_lookup} from key: ${src}`);
        }else if(dst_lookup.length <= 0){
            throw new Error(`Can not get lookup ${dst_lookup} from key: ${dst}`);
        }else{
            let src_number: number | null = this.vertex_lookup[src_lookup] || null;
            if(src_number == null){
                src_number = this.vertex.length;
                this.vertex.push(src);
            }
            let dst_number: number | null = this.vertex_lookup[dst_lookup] || null;
            if(dst_number == null){
                dst_number = this.vertex.length;
                this.vertex.push(dst);
            }
            if(this.vertex[src_number] == null){
                this.vertex[src_number] = src;
            }
            if(this.vertex[dst_number] == null){
                this.vertex[dst_number] = dst;
            }
            const forwardEdges: number[] = this.edges[src_number] || [];
            const backwardEdges: number[] = this.backedges[dst_number] || [];
            if(!(dst_number in forwardEdges)){
                forwardEdges.push(dst_number);
            }
            if(!(src_number in backwardEdges)){
                backwardEdges.push(src_number);
            }
            this.edges[src_number] = forwardEdges;
            this.backedges[dst_number] = backwardEdges;
        }
    }

    /** This is an internal function for getting the Forward Edges. It specifically returns the
     * internal tracking values of the Vertex rather than the Key data.
     * 
     * @param src The Key to get edges for.
     * @returns Null if no such vertex exists, or an array of numbers to be transformed to Key data
     */
    _getForwardEdges(src: Key): number[] | null{
        const src_lookup: string = this.keyTransform(src);
        if(src_lookup.length <= 0){
            throw new Error(`Can not get lookup ${src_lookup} from key: ${src}`);
        }else{
            let src_number: number | null = this.vertex_lookup[src_lookup] || null;
            if(src_number == null || this.vertex[src_number] == null){
                return null;
            }else{
                return this.edges[src_number] || [];
            }
        }
    }

    /** This is an internal function for getting the Backward Edges. It specifically returns the
     * internal tracking values of the Vertex rather than the Key data.
     * 
     * @param dst The Key to get edges for.
     * @returns Null if no such vertex exists, or an array of numbers to be transformed to Key data
     */
    _getBackwardEdges(dst: Key): number[] | null{
        const dst_lookup: string = this.keyTransform(dst);
        if(dst_lookup.length <= 0){
            throw new Error(`Can not get lookup ${dst_lookup} from key: ${dst}`);
        }else{
            let dst_number: number | null = this.vertex_lookup[dst_lookup] || null;
            if(dst_number == null || this.vertex[dst_number] == null){
                return null;
            }else{
                return this.backedges[dst_number] || [];
            }
        }
    }

    getEdges(src: Key): Key[] | null{
        const edge_numbers: number[] | null = this._getForwardEdges(src);
        if(edge_numbers == null){
            return null;
        }else if(edge_numbers.length <= 0){
            return [];
        }else{
            const edge_keys: Key[] = [];
            for(const v in edge_numbers){
                if(this.vertex[v] == null){
                    continue;
                }else{
                    edge_keys.push(this.vertex[v]);
                }
            }
            return edge_keys;
        }
    }

    getBackEdges(dst: Key): Key[] | null{
        const backedge_numbers: number[] | null = this._getForwardEdges(dst);
        if(backedge_numbers == null){
            return null;
        }else if(backedge_numbers.length <= 0){
            return [];
        }else{
            const backedge_keys: Key[] = [];
            for(const v in backedge_numbers){
                if(this.vertex[v] == null){
                    continue;
                }else{
                    backedge_keys.push(this.vertex[v]);
                }
            }
            return backedge_keys;
        }
    }


}