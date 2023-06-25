const FLOAT_SIZE = 4;
const U32_SIZE = 4;

export type Range = {
    start: number;
    count: number;
}

export type DrawableRange = {
    vertices: Range;
    indices: Range;
}

export class MergedBufer {
    private merged_vertices: Float32Array;
    private merged_indices: Uint32Array;
    private vertex_size: number;
    private index_size: number;
    private vertex_cap: number;
    private index_cap: number;
    private index_starts: number[];

    public vertex_buffer: GPUBuffer;
    public index_buffer: GPUBuffer;

    private device: GPUDevice;

    constructor(device: GPUDevice, initial_size: number = 1024){
        if(initial_size < 128) initial_size = 128;
        this.device = device;
        this.merged_vertices = new Float32Array(initial_size);
        this.merged_indices = new Uint32Array(initial_size);
        this.vertex_buffer = this.device.createBuffer({
            size: FLOAT_SIZE * initial_size,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX
        })

        this.index_buffer = this.device.createBuffer({
            size: FLOAT_SIZE * initial_size,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.INDEX
        })

        this.vertex_size = 0;
        this.index_size = 0;
        this.vertex_cap = initial_size;
        this.index_cap = initial_size;
    }

    add_geometry(vertices: Float32Array, indices: Uint32Array): DrawableRange {
        indices = indices.slice();
        for(let i = 0; i < indices.length; i++){
            indices[i] += this.index_size;
        }
        let vertex_offset = this.push_vertices(vertices);
        let index_offset = this.push_indices(indices);
        return {vertices: {start: vertex_offset, count: vertices.length}, indices: {start: index_offset, count: indices.length}};
    }

    rearange(ordered_ranges: DrawableRange[]) : DrawableRange[] {
        let new_indices= new Uint32Array(this.index_cap);
        let new_vertices = new Float32Array(this.vertex_cap);
        let index_ptr = 0;
        let vertex_ptr = 0;

        let new_ranges = ordered_ranges.map(range=>{
            new_indices.set(this.merged_indices.subarray(range.indices.start, range.indices.start + range.indices.count), index_ptr);
            new_vertices.set(this.merged_vertices.subarray(range.vertices.start, range.vertices.start + range.vertices.count), vertex_ptr);

            let new_range = { indices: {start: index_ptr, count: range.indices.count}, vertices: {start: vertex_ptr, count: range.vertices.count}}
            index_ptr += range.indices.count;
            vertex_ptr += range.vertices.count;

            for(let i = new_range.indices.start; i < new_range.indices.start + new_range.indices.count; i++){
                new_indices[i] += new_range.indices.start - range.indices.start;
            }
            return new_range;
        });

        this.merged_indices = new_indices;
        this.merged_vertices = new_vertices;
        this.device.queue.writeBuffer(this.index_buffer, 0, new_indices);
        this.device.queue.writeBuffer(this.vertex_buffer, 0, new_vertices);

        return new_ranges;
    }

    private new_cap(current_cap: number, required_size: number){
        return Math.max(current_cap * 2, required_size);
    }

    private push_indices(indices: Uint32Array): number{
        let push_index = this.index_size;

        if(this.index_size + indices.length > this.index_cap){
            this.index_cap = this.new_cap(this.index_cap, this.index_size + indices.length);
            let new_merged_indices = new Uint32Array(this.index_cap);
            new_merged_indices.set(this.merged_indices);
            this.merged_indices = new_merged_indices;

            this.index_buffer.destroy();
            this.index_buffer = this.device.createBuffer({
                size: this.index_cap * U32_SIZE,
                usage: this.index_buffer.usage,
            });
            this.device.queue.writeBuffer(this.index_buffer, 0, this.merged_indices);
        }

        this.device.queue.writeBuffer(this.index_buffer, this.index_size * U32_SIZE, indices);
        this.merged_indices.set(indices, this.index_size);
        this.index_size += indices.length;

        return push_index;
    }

    private push_vertices(vertices: Float32Array): number{
        let push_index = this.vertex_size;

        if(this.vertex_size + vertices.length > this.vertex_cap){
            this.vertex_cap = this.new_cap(this.vertex_cap, this.vertex_size + vertices.length);
            let new_merged_vertices = new Float32Array(this.vertex_cap);
            new_merged_vertices.set(this.merged_vertices);
            this.merged_vertices = new_merged_vertices;

            this.vertex_buffer.destroy();
            this.vertex_buffer = this.device.createBuffer({
                size: this.vertex_cap * FLOAT_SIZE,
                usage: this.vertex_buffer.usage,
            });
            this.device.queue.writeBuffer(this.vertex_buffer, 0, this.merged_vertices);
        }

        this.device.queue.writeBuffer(this.vertex_buffer, this.vertex_size * FLOAT_SIZE, vertices);
        this.merged_vertices.set(vertices, this.vertex_size);
        this.vertex_size += vertices.length;

        return push_index;
    }
}