type BindGroupBucket = {
    bind_groups: {key: GPUBindGroupEntry[], value: GPUBindGroup}[]
}

export class BindGroupCache {
    private device: GPUDevice;
    private cache: Map<GPUBindGroupLayout, BindGroupBucket>;
    private cache_size: number;
    constructor(device: GPUDevice){
        this.device = device;
        this.cache = new Map();
        this.cache_size = 0;
    }

    private key_equal(a: GPUBindGroupEntry[], b: GPUBindGroupEntry[]): boolean {
        if(a.length != b.length) return false;
        a.sort((x,y)=>x.binding - y.binding);
        b.sort((x,y)=>x.binding - y.binding);

        for(let i = 0; i < a.length; i++){
            if(a[i].binding != b[i].binding) return false;
            if(a[i].resource != b[i].resource) return false;
        }
        return true;
    }

    createBindGroup(descriptor: GPUBindGroupDescriptor): GPUBindGroup{
        let bucket = this.cache.get(descriptor.layout);

        if(bucket){
            let entry = bucket.bind_groups.find(v=>this.key_equal(v.key, descriptor.entries as []));
            if(entry) {
                return entry.value;
            }
        } else {
            this.cache.set(descriptor.layout, {bind_groups: []});
        }

        let bind_group = this.device.createBindGroup(descriptor);
        bind_group.label = ""+this.cache_size;
        this.cache_size++;
        this.cache.get(descriptor.layout).bind_groups.push({key: descriptor.entries as [], value: bind_group});
        return bind_group;
    }
}