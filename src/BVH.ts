class Triangle {
    constructor(public v0: Vec3, public v1: Vec3, public v2: Vec3){}
    center(): Vec3 {
        return new Vec3(
            (this.v0.x + this.v1.x + this.v2.x) / 3,
            (this.v0.y + this.v1.y + this.v2.y) / 3,
            (this.v0.z + this.v1.z + this.v2.z) / 3,
        );
    }
    min(axis: number): number {
        return Math.min(this.v0.at(axis), this.v1.at(axis), this.v2.at(axis));
    }
    max(axis: number): number {
        return Math.max(this.v0.at(axis), this.v1.at(axis), this.v2.at(axis));
    }
    extent(axis: number): [number, number] {
        return [this.min(axis), this.max(axis)];
    }
}

class Vec3 {
    constructor(public x: number, public y: number, public z: number){}
    at(axis: number){
        if(axis == 0) return this.x;
        if(axis == 1) return this.y;
        if(axis == 2) return this.z;
        throw new Error("Err out of range");
    }
}

class FlatBVHNode {
    constructor(public min_extent: Vec3, public max_extent: Vec3, public left: number, public right: number){

    }
}

// type OctNode2 = [OctNode, OctNode];
// type OctNode4 = [OctNode2, OctNode2];
// type OctNode8 = [OctNode4, OctNode4];

// class OctNode {
//     constructor(public tris: Triangle[], children?: OctNode8){}
// }

export class BVHNode {
    constructor(public min_extent: Vec3, public max_extent: Vec3, public children: [BVHNode | BVHLeaf, BVHNode | BVHLeaf]){}
}

export class BVHLeaf{
    constructor(public min_extent: Vec3, public max_extent: Vec3, public children: Triangle[]){}
}

export function geometry_data_to_triangles(verts: Float32Array, indices: Uint32Array): Triangle[] {
    const VERT_SIZE = 8;
    let tris = [];
    for(let i = 0; i < indices.length; i+=3){
        let i0 = indices[i] * VERT_SIZE;
        let i1 = indices[i+1] * VERT_SIZE;
        let i2 = indices[i+2] * VERT_SIZE;
        tris.push(new Triangle(
            new Vec3(verts[i0], verts[i0+1], verts[i0+2]),
            new Vec3(verts[i1], verts[i1+1], verts[i1+2]),
            new Vec3(verts[i2], verts[i2+1], verts[i2+2]),
        ))
    }
    return tris;
}

export class BVH {
    constructor(private triangles: Triangle[]) {}

    private extent_axis(tris: Triangle[], axis: number): [number, number] {
        return tris.reduce((prev, tri)=>{
            let ext = tri.extent(axis);
            return [Math.min(prev[0], ext[0]), Math.max(prev[1], ext[1])];
        }, [Infinity, -Infinity]);
    }

    private extent(tris: Triangle[]) : [Vec3, Vec3] {
        let ext0 = this.extent_axis(tris, 0);
        let ext1 = this.extent_axis(tris, 1);
        let ext2 = this.extent_axis(tris, 2);
        return [new Vec3(ext0[0], ext1[0], ext2[0]),new Vec3(ext0[1], ext1[1], ext2[1])];
    }

    private make_bvh_node(tris: Triangle[]): BVHLeaf | BVHNode {
        let extent = this.extent(tris);
        if(tris.length < 6) {
            return new BVHLeaf(extent[0], extent[1], tris);
        }
        let big_axis = 0;
        for(let i = 1; i < 3; i++){
            if(extent[1].at(i) - extent[0].at(i) > extent[1].at(big_axis) - extent[0].at(big_axis)){
                big_axis = i;
            }
        }
        
        tris.sort((a,b)=>a.center().at(big_axis) - b.center().at(big_axis));
        let midpoint = tris[(tris.length/2)|0].center().at(big_axis);
        // let midpoint = (extent[1].at(big_axis) + extent[0].at(big_axis))/2;

        let left = tris.filter(t=>t.center().at(big_axis) < midpoint);
        let right = tris.filter(t=>t.center().at(big_axis) >= midpoint);

        if(left.length == 0 || right.length == 0){
            return new BVHLeaf(extent[0], extent[1], tris);
        }

        return new BVHNode(extent[0], extent[1], [this.make_bvh_node(left), this.make_bvh_node(right)]);
    }

    build(): BVHNode | BVHLeaf {
        return this.make_bvh_node(this.triangles);
    }

    build_buffer() : {tree: Float32Array, tris: Float32Array} {
        let bvh = this.build();
        let flat_tree: (FlatBVHNode | BVHLeaf)[] = []

        // [minx, miny, minz, left_ptr, maxx, maxy, maxz, right_ptr]
        // [minx, miny, minz, -tri_count, maxx, maxy, maxz, tri_ptr]
        let visit = (node: BVHLeaf | BVHNode) => {
            if(node instanceof BVHNode){
                let flat_node = new FlatBVHNode(node.min_extent, node.max_extent, 0, 0);
                let idx = flat_tree.length;
                flat_tree.push(flat_node);
                flat_node.left = visit(node.children[0]);
                flat_node.right = visit(node.children[1]);
                return idx;
            } else {
                let idx = flat_tree.length;
                flat_tree.push(node);
                return idx;
            }
        }
        visit(bvh);

        let visit2 = (node: BVHLeaf | BVHNode) => {
            if(node instanceof BVHNode){
                return 1+Math.max(visit2(node.children[0]), visit2(node.children[1]));
            } else {
                return 1;
            }
        }
        console.log("Max height", visit2(bvh))

        let tris_buffer = [];
        let tree_buffer = flat_tree.flatMap((node, i)=>{
            if(node instanceof FlatBVHNode){
                return [node.min_extent.x, node.min_extent.y, node.min_extent.z, node.left, node.max_extent.x, node.max_extent.y, node.max_extent.z, node.right];
            } else {
                let ptr = tris_buffer.length;
                for(let t of node.children){
                    tris_buffer.push(
                        t.v0.x, t.v0.y, t.v0.z,
                        t.v1.x, t.v1.y, t.v1.z,
                        t.v2.x, t.v2.y, t.v2.z,
                    )
                }
                return [node.min_extent.x, node.min_extent.y, node.min_extent.z, -node.children.length, node.max_extent.x, node.max_extent.y, node.max_extent.z, ptr];
            }
        })

        return {tree: new Float32Array(tree_buffer), tris: new Float32Array(tris_buffer)};
    }
}