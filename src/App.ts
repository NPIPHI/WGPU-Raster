import { mat4, vec3 } from "gl-matrix";
import { Scene } from "./scene";
import { color_shader_src, compute_shader_src, shadow_shader_src, skybox_shader_src } from "./ShaderSrc";
import { Material, Mesh, Texture } from "./ModelLoad";
// import { Mesh, OBJ } from "webgl-obj-loader";

const VEC_SIZE = 4;
const VEC_ALIGN = 16;
const FLOAT_SIZE = 4;
const U32_SIZE = 4;

type SceneGeometry = {
    vertices: GPUBuffer;
    indices?: {
        indices: GPUBuffer;
        index_type: GPUIndexFormat
    }
    vertex_count: number;
    textures: GPUTexture[]
}

type RenderPass = {
    shader: GPUShaderModule,
    pipeline: GPURenderPipeline,
    bind_groups: GPUBindGroup[],
    geometries: SceneGeometry[],
    color_attachments: (GPURenderPassColorAttachment | "canvas")[]
    depth_attachment: GPURenderPassDepthStencilAttachment
}

type ComputePass = {
    shader: GPUShaderModule,
    pipeline: GPUComputePipeline,
    bind_groups: GPUBindGroup[],
    dispatch_size: [number] | [number, number] | [number, number, number]
}

type RasterData = {
    depth_buffer: GPUTexture
    point_light_buffer: GPUBuffer,
    shadow_depth_buffer: GPUTexture,
    shadow_view_buffer: GPUBuffer,
    groud_vertex_buffer: GPUBuffer,
    groud_index_buffer: GPUBuffer,
    skybox_vertex_buffer: GPUBuffer,

    forward_pass: RenderPass;
    shadow_pass: RenderPass;
    skybox_pass: RenderPass;
}

type ComputeData = {
    compute_pass: ComputePass

    data_buffer: GPUBuffer;
    read_buffer: GPUBuffer;
}

type Camera = {
    mat: mat4;
    buffer: GPUBuffer;
}

type RawMesh = {
    vertices: number[]
    
}

export class App {
    private camera: Camera;
    public scene: Scene;

    private raster: RasterData;
    private compute: ComputeData;
    private shadow_res_x: number;
    private shadow_res_y: number;
    private clear_color = { r: 0.0, g: 0.5, b: 1.0, a: 1.0 };
    private texture_cache: Map<ImageBitmap, GPUTexture> = new Map()

    constructor(private device: GPUDevice, private context: GPUCanvasContext, private res_x: number, private res_y: number){   
        this.scene = new Scene();
        this.shadow_res_x = 2048;
        this.shadow_res_y = 2048;
        this.camera = this.make_camera();
        this.raster = this.setup_raster();
        this.compute = this.setup_compute();
        this.update_lights();
    }

    private setup_compute(): ComputeData {
        let buffer_size = (1 + (1<<10)) * U32_SIZE;
        const shader = this.device.createShaderModule({code: compute_shader_src(), label: "compute shader"});

        const output_buffer = this.device.createBuffer({
            size: buffer_size,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.VERTEX
        })

        const read_buffer = this.device.createBuffer({
            size: buffer_size,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
        })

        const pipeline = this.device.createComputePipeline({
            layout: "auto",
            compute: {
                module: shader, 
                entryPoint: "main"
            }
        })
        
        const bind_group_layout = pipeline.getBindGroupLayout(0);

        const bind_group = this.device.createBindGroup({
            layout: bind_group_layout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: output_buffer
                    }
                }
            ]
        })

        return {
            compute_pass: {
                shader: shader,
                pipeline: pipeline,
                bind_groups: [bind_group],
                dispatch_size: [Math.floor(buffer_size/U32_SIZE/64)]
            },
            data_buffer: output_buffer,
            read_buffer: read_buffer,
        }
    }

    private get_texture(texture: Texture) {
        if(!this.texture_cache.get(texture.data)){
            let tex = this.device.createTexture({
                size: [texture.width, texture.height], 
                format: "rgba8unorm",
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT  
            });

            if(texture.data) {
                this.device.queue.copyExternalImageToTexture({source: texture.data }, { texture: tex }, { width : texture.width, height: texture.height});
            }
            this.texture_cache.set(texture.data, tex);
        }

        return this.texture_cache.get(texture.data);

    }

    private make_camera(): Camera {
        let mat = mat4.create();
        mat4.identity(mat);
        const buffer = this.device.createBuffer({
            size: mat.length * FLOAT_SIZE,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM
        })

        this.device.queue.writeBuffer(buffer, 0, new Float32Array(mat));
        return { mat: mat, buffer: buffer};
    }

    set_camera(mat: mat4) {
        this.camera.mat = mat;
        this.device.queue.writeBuffer(this.camera.buffer, 0, new Float32Array(mat));
    }

    set_shadow(mat: mat4) {
        this.device.queue.writeBuffer(this.raster.shadow_view_buffer, 0, new Float32Array(mat));
    }

    add_mesh(mesh: Mesh) {
        let vertices = new Float32Array(mesh.vertices.length/3 * 10);
        let indices = new Uint32Array(mesh.indices);
        for(let i = 0; i < mesh.vertices.length/3; i++){
            vertices[i*10+0] = mesh.vertices[i*3+0]
            vertices[i*10+1] = mesh.vertices[i*3+1]
            vertices[i*10+2] = mesh.vertices[i*3+2]
            vertices[i*10+3] = mesh.normals[i*3+0]
            vertices[i*10+4] = mesh.normals[i*3+1]
            vertices[i*10+5] = mesh.normals[i*3+2]
            vertices[i*10+6] = mesh.uvs[i*2+0]
            vertices[i*10+7] = mesh.uvs[i*2+1];
            vertices[i*10+8] = 1;
            vertices[i*10+9] = 0;
        }

        let vertex_buffer = this.device.createBuffer({
            size: vertices.byteLength,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX
        })

        let index_buffer = this.device.createBuffer({
            size: indices.byteLength,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.INDEX
        })

       

        this.device.queue.writeBuffer(vertex_buffer, 0, vertices);
        this.device.queue.writeBuffer(index_buffer, 0, indices);

        let geo: SceneGeometry = {
            vertices: vertex_buffer,
            indices: {
                indices: index_buffer,
                index_type: "uint32"
            },
            vertex_count: indices.length,
            textures: [this.get_texture(mesh.material.diffuse)]
        }

        this.raster.forward_pass.geometries.push(geo);
        this.raster.shadow_pass.geometries.push(geo);
    }

    update_lights(){
        this.set_shadow(this.scene.shadow_perspectives());
        const lights = this.scene.encode_lights();
        const needed_size = lights.byteLength + VEC_ALIGN;
        if(this.raster.point_light_buffer.size < needed_size){
            this.raster.point_light_buffer.destroy();
            this.raster.point_light_buffer = this.device.createBuffer({
                size: needed_size,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
            })
        }
        this.device.queue.writeBuffer(this.raster.point_light_buffer, 0, new Uint32Array([this.scene.light_count()]));
        this.device.queue.writeBuffer(this.raster.point_light_buffer, U32_SIZE, new Float32Array([this.scene.ambient_luminance()]));
        this.device.queue.writeBuffer(this.raster.point_light_buffer, VEC_ALIGN, lights, 0, lights.length);
    }

    private setup_raster(): RasterData {
        const forward_shader = this.device.createShaderModule({code: color_shader_src(), label: "color shader"})
        const shadow_shader = this.device.createShaderModule({code: shadow_shader_src(), label: "shadow shader"})
        const skybox_shader = this.device.createShaderModule({code: skybox_shader_src(), label: "skybox shader"})

        const {vertices, indices} = this.scene.encode_ground_vertices();
        
        const skybox_verts = new Float32Array([
            1,3,1,-1,
            -3,-1,-1,1,
            1,-1,1,1,
        ])

        let depth_buffer = this.device.createTexture({
            size: [this.context.canvas.width, this.context.canvas.height],
            format: "depth32float",
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            label: "depth buffer",
        });

        let shadow_depth_buffer = this.device.createTexture({
            size: [this.shadow_res_x, this.shadow_res_y],
            format: "depth32float",
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            label: "shadow pass depth buffer",
        });

        let shadow_sampler = this.device.createSampler({
            addressModeU: "clamp-to-edge",
            addressModeV: "clamp-to-edge",
            magFilter: "linear",
            minFilter: "linear",

        })
        
        const ground_vertex_buffer = this.device.createBuffer({
            size: vertices.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });

        const ground_index_buffer = this.device.createBuffer({
            size: indices.byteLength,
            usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
        })

        const light_buffer = this.device.createBuffer({
            size: 64, //starting size
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        })

        const shadow_view_buffer = this.device.createBuffer({
            size: 16 * FLOAT_SIZE,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        })

        const skybox_vertex_buffer = this.device.createBuffer({
            size: skybox_verts.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
        })
    
        this.device.queue.writeBuffer(ground_vertex_buffer, 0, vertices);
        this.device.queue.writeBuffer(ground_index_buffer, 0, indices);
        this.device.queue.writeBuffer(skybox_vertex_buffer, 0, skybox_verts);
        
        const skybox_vertex_buffers: GPUVertexBufferLayout[] = [
            {
                attributes: [
                    {
                        shaderLocation: 0, // position
                        offset: 0,
                        format: "float32x2",
                    },
                    {
                        shaderLocation: 1,
                        offset: 2 * FLOAT_SIZE,
                        format: "float32x2",
                    }
                ],
                arrayStride: 4 * FLOAT_SIZE,
                stepMode: "vertex"
            }
        ]
          
        const shadow_vertex_buffers: GPUVertexBufferLayout[] = [
            {
                attributes: [
                    {
                        shaderLocation: 0, // position
                        offset: 0,
                        format: "float32x3",
                    }
                ],
                arrayStride: 40,
                stepMode: "vertex"
            }
        ]

        const forward_vertex_buffers: GPUVertexBufferLayout[] = [
            {
              attributes: [
                {
                  shaderLocation: 0, // position
                  offset: 0,
                  format: "float32x3",
                },
                {
                  shaderLocation: 1, // normal
                  offset: 12,
                  format: "float32x3",
                },
                {
                  shaderLocation: 2, // color
                  offset: 24,
                  format: "float32x4",
                }
              ],
              arrayStride: 40,
              stepMode: "vertex",
            },
        ];

        const skybox_bind_group_layout = this.device.createBindGroupLayout({
            entries: [],
            label: "skybox bind group layout",
        })
    
        const forward_bind_group_layout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0, //camera
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {
                        type: "uniform",
                    }
                },
                {
                    binding: 1, //lights
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: "read-only-storage",
                    }
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {
                        type: "filtering"
                    }
                },
                {
                    binding: 3, //shadow tex
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: "depth",
                        viewDimension: "2d",
                        multisampled: false,
                    }
                },
                {
                    binding: 4, //shadow view
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: "uniform"
                    }
                }
            ],
            label: "forward bind group layout"
        });

        const shadow_bind_group_layout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0, //camera
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {
                        type: "uniform",
                    }
                },
            ],
            label: "shadow bind group layout"
        });

        const skybox_layout = this.device.createPipelineLayout({
            bindGroupLayouts: [skybox_bind_group_layout],
            label: "skybox layout"
        })
    
        const forward_layout = this.device.createPipelineLayout({
            bindGroupLayouts: [forward_bind_group_layout],
            label: "forward layout"
        });

        const shadow_layout = this.device.createPipelineLayout({
            bindGroupLayouts: [shadow_bind_group_layout],
            label: "shadow layout"
        })
    
        const skybox_bind_group = this.device.createBindGroup({
            layout: skybox_bind_group_layout,
            entries: []
        });

        const forward_bind_group = this.device.createBindGroup({
            layout: forward_bind_group_layout,
            entries: [
                {
                    binding: 0, //camera
                    resource: {
                        buffer: this.camera.buffer
                    }
                },
                {
                    binding: 1, //lights
                    resource: {
                        buffer: light_buffer,
                    }
                },
                {
                    binding: 2, //shadows sampler
                    resource: shadow_sampler
                },
                {
                    binding: 3, //shadows tex
                    resource: shadow_depth_buffer.createView()
                },
                {
                    binding: 4, //shadow view
                    resource: {
                        buffer: shadow_view_buffer
                    }
                }
            ]
        });

        const shadow_bind_group = this.device.createBindGroup({
            layout: shadow_bind_group_layout,
            entries: [
                {
                    binding: 0, //camera
                    resource: {
                        buffer: shadow_view_buffer
                    }
                }
            ]
        })

        const skybox_pipeline_descriptor: GPURenderPipelineDescriptor = {
            vertex: {
                module: skybox_shader,
                entryPoint: "vertex_main",
                buffers: skybox_vertex_buffers,
            },
            fragment: {
                module: skybox_shader,
                entryPoint: "fragment_main",
                targets: [{
                    format: navigator.gpu.getPreferredCanvasFormat(),
                }]
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "none"
            },
            depthStencil: {
                format: "depth32float",
                depthWriteEnabled: false,
                depthCompare: "less-equal"
            },
            layout: skybox_layout,
            label: "skybox pipieline descriptor"
        }

        const forward_pipeline_descriptor: GPURenderPipelineDescriptor = {
            vertex: {
                module: forward_shader,
                entryPoint: "vertex_main",
                buffers: forward_vertex_buffers,
            },
            fragment: {
                module: forward_shader,
                entryPoint: "fragment_main",
                targets: [{
                    format: navigator.gpu.getPreferredCanvasFormat(),
                }],
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "back",
            },
            depthStencil: {
                format: "depth32float",
                depthWriteEnabled: true,
                depthCompare: "less",
            },
            layout: forward_layout,
            label: "forward pipeline descriptor",
        };      

        const shadow_pipeline_descriptor: GPURenderPipelineDescriptor = {
            vertex: {
                module: shadow_shader,
                entryPoint: "vertex_main",
                buffers: shadow_vertex_buffers,
            },
            fragment: {
                module: shadow_shader,
                entryPoint: "fragment_main",
                targets: [],
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "none"
            },
            depthStencil: {
                format: "depth32float",
                depthWriteEnabled: true,
                depthCompare: "less"
            },
            layout: shadow_layout,
            label: "shadow pipeline descriptor",
        };
    
        const forward_render_pipeline = this.device.createRenderPipeline(forward_pipeline_descriptor);
        const shadow_render_pipeline = this.device.createRenderPipeline(shadow_pipeline_descriptor);
        const skybox_render_pipeline = this.device.createRenderPipeline(skybox_pipeline_descriptor);

        const forward_color_attachment = "canvas";
        const forward_depth_attachment: GPURenderPassDepthStencilAttachment = {
            view: depth_buffer.createView(),
            depthClearValue: 1.0,
            depthLoadOp: "clear",
            depthStoreOp: "discard",
        };
        const skybox_color_attachmet = "canvas";
        const skybox_depth_attachment: GPURenderPassDepthStencilAttachment = {
            view: depth_buffer.createView(),
            depthClearValue: 1.0,
            depthLoadOp: "clear",
            depthStoreOp: "discard",
        };
        // const skybox_depth_attachment = undefined;
        const shadow_color_attachments = [];
        const shadow_depth_attachment: GPURenderPassDepthStencilAttachment = {
            view: shadow_depth_buffer.createView(),
            depthClearValue: 1.0,
            depthLoadOp: "clear",
            depthStoreOp: "store",
        }

        return { 
            forward_pass: {
                shader: forward_shader,
                pipeline: forward_render_pipeline,
                bind_groups: [forward_bind_group],
                geometries: [],
                color_attachments: [forward_color_attachment],
                depth_attachment: forward_depth_attachment
            },
            shadow_pass: {
                shader: shadow_shader,
                pipeline: shadow_render_pipeline,
                bind_groups: [shadow_bind_group],
                geometries: [],                
                color_attachments: shadow_color_attachments,
                depth_attachment: shadow_depth_attachment
            },
            skybox_pass: {
                shader: skybox_shader,
                pipeline: skybox_render_pipeline,
                bind_groups: [skybox_bind_group],
                geometries: [{
                    vertices: skybox_vertex_buffer,
                    vertex_count: 3,
                    textures: []
                }],
                color_attachments: [skybox_color_attachmet],
                depth_attachment: skybox_depth_attachment,
            },
            skybox_vertex_buffer: skybox_vertex_buffer,
            depth_buffer: depth_buffer,
            shadow_depth_buffer: shadow_depth_buffer,
            point_light_buffer: light_buffer,
            shadow_view_buffer: shadow_view_buffer,
            groud_vertex_buffer: ground_vertex_buffer,
            groud_index_buffer: ground_index_buffer,
        }
    }

    private verify_attachments(passes: RenderPass[]){
        //verify maybe
    }

    private make_pass_descriptor(passes: RenderPass[]) : GPURenderPassDescriptor{
        this.verify_attachments(passes);
        return {
            colorAttachments: passes[0].color_attachments.map(a=>{
                return a == "canvas" ? {
                    view: this.context.getCurrentTexture().createView(),
                    clearValue: this.clear_color,
                    loadOp: "clear",
                    storeOp: "store"
                } : a
            }),

            depthStencilAttachment: passes[0].depth_attachment
        };
    }

    private encode_compute_pass(pass: ComputePass, encoder: GPUCommandEncoder) {
        const pass_encoder = encoder.beginComputePass();
        
        pass_encoder.setPipeline(pass.pipeline);
        pass.bind_groups.forEach((group, idx)=>pass_encoder.setBindGroup(idx, group));
        pass_encoder.dispatchWorkgroups(...pass.dispatch_size);

        pass_encoder.end();
    }

    private encode_render_passes(passes: RenderPass[], encoder: GPUCommandEncoder) {
        const pass_descriptor = this.make_pass_descriptor(passes);

        const pass_encoder = encoder.beginRenderPass(pass_descriptor);
        passes.forEach(pass => {
            pass_encoder.setPipeline(pass.pipeline);
            pass.bind_groups.forEach((group, idx)=>pass_encoder.setBindGroup(idx, group));
            pass.geometries.forEach(geom => {
                pass_encoder.setVertexBuffer(0, geom.vertices);
                if(geom.indices){
                    pass_encoder.setIndexBuffer(geom.indices.indices, geom.indices.index_type);
                    pass_encoder.drawIndexed(geom.vertex_count);
                } else {
                    pass_encoder.draw(geom.vertex_count);
                }
            })
            
        });
        
        pass_encoder.end();
    }

    draw_raster() {
        const command_encoder = this.device.createCommandEncoder();

        
        // this.encode_render_passes([this.raster.shadow_pass], command_encoder);
        this.encode_render_passes([this.raster.forward_pass, this.raster.skybox_pass], command_encoder);
        // this.encode_compute_pass(this.compute.compute_pass, command_encoder);
        // command_encoder.copyBufferToBuffer(this.compute.data_buffer, 0, this.compute.read_buffer, 0, this.compute.data_buffer.size);

        // console.time("QUEUE");
        this.device.queue.submit([command_encoder.finish()]);

        // this.compute.read_buffer.mapAsync(GPUMapMode.READ).then(()=>{
        //     console.timeEnd("QUEUE");
        //     const range = this.compute.read_buffer.getMappedRange();
        //     console.log(range);
        //     console.log(new Set(new Uint32Array(range)));
        //     this.compute.read_buffer.unmap();
        // });
    }
}