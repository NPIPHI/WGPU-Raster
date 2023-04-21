import { mat4, vec3 } from "gl-matrix";
import { Scene } from "./scene";
import { color_shader_src, compute_shader_src, blit_shader_src, shadow_shader_src } from "./ShaderSrc";

const VEC_SIZE = 4;
const VEC_ALIGN = 16;
const FLOAT_SIZE = 4;
const U32_SIZE = 4;

type RasterData = {
    vertices: GPUBuffer,
    indices: GPUBuffer
    tri_count: number,
    depth_buffer: GPUTexture
    depth_buffer_view: GPUTextureView,
    point_light_buffer: GPUBuffer,

    forward_shader: GPUShaderModule,
    forward_pipeline: GPURenderPipeline,
    forward_bind_group: GPUBindGroup,

    shadow_shader: GPUShaderModule,
    shadow_bind_group: GPUBindGroup,
    shadow_pipeline: GPURenderPipeline,
    shadow_depth_buffer: GPUTexture,
    shadow_depth_buffer_view: GPUTextureView,
    shadow_view: GPUBuffer,
}

type Camera = {
    mat: mat4;
    buffer: GPUBuffer;
}

export class App {
    private camera: Camera;
    public scene: Scene;

    private raster: RasterData;
    private shadow_res_x: number;
    private shadow_res_y: number;

    constructor(private device: GPUDevice, private context: GPUCanvasContext, private res_x: number, private res_y: number){   
        this.scene = new Scene();
        this.shadow_res_x = 512;
        this.shadow_res_y = 512;
        this.camera = this.make_camera();
        this.raster = this.setup_raster();
        this.set_shadow(this.scene.shadow_perspectives());
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
        this.device.queue.writeBuffer(this.raster.shadow_view, 0, new Float32Array(mat));
    }

    private setup_raster(): RasterData {
        const forward_shader = this.device.createShaderModule({code: color_shader_src(this.res_x, this.res_y), label: "color shader"})
        const shadow_shader = this.device.createShaderModule({code: shadow_shader_src(this.res_x, this.res_y), label: "shadow shader"})
        
        const {vertices, indices} = this.scene.encode_ground_vertices();
        const lights = this.scene.encode_lights();

        let depth_buffer = this.device.createTexture({
            size: [this.context.canvas.width, this.context.canvas.height],
            format: "depth32float",
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            label: "forward pass depth buffer",
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
        
        const vertex_buffer = this.device.createBuffer({
            size: vertices.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });

        const index_buffer = this.device.createBuffer({
            size: indices.byteLength,
            usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
        })

        const light_buffer = this.device.createBuffer({
            size: lights.byteLength + U32_SIZE + 16,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        })

        const shadow_view_buffer = this.device.createBuffer({
            size: 16 * FLOAT_SIZE,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        })
    
        this.device.queue.writeBuffer(vertex_buffer, 0, vertices);
        this.device.queue.writeBuffer(light_buffer, 0, new Uint32Array([this.scene.light_count()]));
        this.device.queue.writeBuffer(light_buffer, U32_SIZE, new Float32Array([this.scene.ambient_luminance()]));
        this.device.queue.writeBuffer(light_buffer, VEC_ALIGN, lights, 0, lights.length);
        this.device.queue.writeBuffer(index_buffer, 0, indices);
          
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
    
        const forward_layout = this.device.createPipelineLayout({
            bindGroupLayouts: [forward_bind_group_layout],
            label: "forward layout"
        });

        const shadow_layout = this.device.createPipelineLayout({
            bindGroupLayouts: [shadow_bind_group_layout],
            label: "shadow layout"
        })
    
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
                // targets: [{
                //     format: navigator.gpu.getPreferredCanvasFormat(),
                // }],
            },
            primitive: {
                topology: "triangle-list",
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

        return { 
            forward_shader: forward_shader,
            shadow_shader: shadow_shader,
            forward_pipeline: forward_render_pipeline,
            shadow_pipeline: shadow_render_pipeline,
            forward_bind_group: forward_bind_group,
            shadow_bind_group: shadow_bind_group,
            vertices: vertex_buffer,
            indices: index_buffer,
            tri_count: indices.length / 3,
            depth_buffer: depth_buffer,
            depth_buffer_view: depth_buffer.createView(),
            shadow_depth_buffer: shadow_depth_buffer,
            shadow_depth_buffer_view: shadow_depth_buffer.createView(),
            point_light_buffer: light_buffer,
            shadow_view: shadow_view_buffer
        }
    }

    draw_raster() {
        const clearColor = { r: 0.0, g: 0.5, b: 1.0, a: 1.0 };

        const forward_render_pass_descriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    clearValue: clearColor,
                    loadOp: "clear",
                    storeOp: "store",
                    view: this.context.getCurrentTexture().createView(),
                },
            ],
            depthStencilAttachment: {
                view: this.raster.depth_buffer_view,
                depthClearValue: 1.0,
                depthLoadOp: "clear",
                depthStoreOp: "discard",
            },
            label: "forward pass descriptor"
        }; 

        const shadow_render_pass_descriptor: GPURenderPassDescriptor = {
            colorAttachments: [],
            // colorAttachments: [{
            //     clearValue: clearColor,
            //     loadOp: "clear",
            //     storeOp: "store",
            //     view: this.context.getCurrentTexture().createView(),
            // }],
            depthStencilAttachment: {
                view: this.raster.shadow_depth_buffer_view,
                depthClearValue: 1.0,
                depthLoadOp: "clear",
                depthStoreOp: "store",
            },
            label: "shadow pass descriptor"
        }; 

        const command_encoder = this.device.createCommandEncoder();

        const shadow_pass_encoder = command_encoder.beginRenderPass(shadow_render_pass_descriptor);
        shadow_pass_encoder.setPipeline(this.raster.shadow_pipeline);
        shadow_pass_encoder.setVertexBuffer(0, this.raster.vertices);
        shadow_pass_encoder.setIndexBuffer(this.raster.indices, "uint32")
        shadow_pass_encoder.setBindGroup(0, this.raster.shadow_bind_group);
        shadow_pass_encoder.drawIndexed(this.raster.tri_count * 3);
        shadow_pass_encoder.end();

        const forward_pass_encoder = command_encoder.beginRenderPass(forward_render_pass_descriptor);
        forward_pass_encoder.setPipeline(this.raster.forward_pipeline);
        forward_pass_encoder.setVertexBuffer(0, this.raster.vertices);
        forward_pass_encoder.setIndexBuffer(this.raster.indices, "uint32")
        forward_pass_encoder.setBindGroup(0, this.raster.forward_bind_group);
        forward_pass_encoder.drawIndexed(this.raster.tri_count * 3);
        forward_pass_encoder.end();

        this.device.queue.submit([command_encoder.finish()]);
    }
}