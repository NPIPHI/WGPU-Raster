import { compute_shader_src } from "./ShaderSrc";

export class MipMaper {
    private device: GPUDevice;
    private shader: GPUShaderModule;
    private pipeline: GPUComputePipeline;
    private bind_layout: GPUBindGroupLayout;
    private wg_dimension = [16, 16];
    constructor(device: GPUDevice){
        this.device = device;
        this.shader = this.device.createShaderModule({code: compute_shader_src(), label: "compute shader"});

        this.pipeline = this.device.createComputePipeline({
            layout: "auto",
            compute: {
                module: this.shader, 
                entryPoint: "main",
                constants: {
                    dimx: this.wg_dimension[0],
                    dimy: this.wg_dimension[1],
                }
            },

        })
        
        this.bind_layout = this.pipeline.getBindGroupLayout(0);
    }

    private isPow2(v) {
        return v && !(v & (v - 1));
    }

    mip_level_count(width: number, height: number){
        if(!this.isPow2(width) || !this.isPow2(height) || width < 2 || height < 2){
            return 1;
        }
        return Math.floor(Math.min(Math.log2(width), Math.log2(height)));
    }

    generate_mip_maps(tex: GPUTexture) {
        if(!this.isPow2(tex.width) || !this.isPow2(tex.height) || tex.width < 2 || tex.height < 2){
            return tex;
        }

        for(let i = 0; i < tex.mipLevelCount - 1; i++){
            let src_level = tex.createView({
                baseMipLevel: i,
                mipLevelCount: 1,
            })

            let dst_level = tex.createView({
                baseMipLevel: i + 1,
                mipLevelCount: 1
            })

            let binding = this.device.createBindGroup({
                layout: this.bind_layout,
                entries: [
                    {
                        binding: 0,
                        resource: src_level
                    },
                    {
                        binding: 1,
                        resource: dst_level
                    }
                ]
            });

            let command_encoder = this.device.createCommandEncoder();
            let compute_pass = command_encoder.beginComputePass();

            compute_pass.setPipeline(this.pipeline);
            compute_pass.setBindGroup(0, binding);
            compute_pass.dispatchWorkgroups(Math.ceil((tex.width/(2 << i)) / this.wg_dimension[0]), Math.ceil((tex.height/ (2 << i)) / this.wg_dimension[1]));
            compute_pass.end();

            this.device.queue.submit([command_encoder.finish()]);
        }
    }
}