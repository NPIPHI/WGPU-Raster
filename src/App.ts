import { mat4, vec3 } from "gl-matrix";
import { Scene } from "./scene";
import { color_shader_src, compute_shader_src, postprocess_shader_src, shadow_shader_src, skybox_shader_src } from "./ShaderSrc";
import { Material, Mesh, Texture } from "./ModelLoad";
import { DrawableRange, MergedBufer, Range } from "./MergedBuffer";
import { BindGroupCache } from "./BindGroupCache";
import { MipMaper } from "./MipMapper";
// import { Mesh, OBJ } from "webgl-obj-loader";

const VEC_SIZE = 4;
const VEC_ALIGN = 16;
const FLOAT_SIZE = 4;
const U32_SIZE = 4;

type SceneGeometry = {
    range: DrawableRange;
    bind_groups: GPUBindGroup[]
}


type RenderPass = {
    shader: GPUShaderModule,
    pipeline: GPURenderPipeline,
    bind_groups: GPUBindGroup[],
    vertex_size: number;
    geometry_buffer: MergedBufer;
    geometries: SceneGeometry[],
    optimized_geometries?: SceneGeometry[]
    color_attachments: (GPURenderPassColorAttachment | "canvas")[]
    depth_attachment?: GPURenderPassDepthStencilAttachment
}

type RasterData = {
    depth_buffer: GPUTexture

    forward_diffuse_pass: RenderPass;
    forward_diffuse_opacity_pass: RenderPass;
    skybox_pass: RenderPass;
    postprocess_pass: RenderPass;
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
    private mipmapper: MipMaper;
    private clear_color = { r: 0.0, g: 0.5, b: 1.0, a: 1.0 };
    private texture_cache: Map<ImageBitmap, {tex: GPUTexture, view: GPUTextureView}> = new Map()
    private forward_layout: GPUBindGroupLayout;
    private bind_group_cache: BindGroupCache;

    constructor(private device: GPUDevice, private context: GPUCanvasContext, private res_x: number, private res_y: number){   
        this.scene = new Scene();
        this.bind_group_cache = new BindGroupCache(device);
        this.camera = this.make_camera();
        this.raster = this.setup_raster();
        this.mipmapper = new MipMaper(this.device);;
    }

    private get_texture(texture: Texture) {
        if(!this.texture_cache.get(texture.data)){
            let tex = this.device.createTexture({
                size: [texture.width, texture.height], 
                format: "rgba8unorm",
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.STORAGE_BINDING,
                mipLevelCount: this.mipmapper.mip_level_count(texture.width, texture.height),
            });

            if(texture.data) {
                this.device.queue.copyExternalImageToTexture({source: texture.data }, { texture: tex }, { width : texture.width, height: texture.height});
            }
            this.mipmapper.generate_mip_maps(tex);
            let view = tex.createView();
            this.texture_cache.set(texture.data, {tex, view});
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

    add_mesh(mesh: Mesh) {
        let vertices = new Float32Array(mesh.vertices.length/3 * 8);
        let indices = new Uint32Array(mesh.indices);
        for(let i = 0; i < mesh.vertices.length/3; i++){
            vertices[i*8+0] = mesh.vertices[i*3+0]/50
            vertices[i*8+1] = mesh.vertices[i*3+2]/50
            vertices[i*8+2] = mesh.vertices[i*3+1]/50
            vertices[i*8+3] = mesh.normals[i*3+0]
            vertices[i*8+4] = mesh.normals[i*3+1]
            vertices[i*8+5] = mesh.normals[i*3+2]
            vertices[i*8+6] = mesh.uvs[i*2+0]
            vertices[i*8+7] = mesh.uvs[i*2+1];
        }

        let diffuse = this.get_texture(mesh.material.diffuse);

        let bind_group;
        let opacity = mesh.material.opacity ? this.get_texture(mesh.material.opacity) : diffuse;

        bind_group = this.bind_group_cache.createBindGroup({
            layout: this.forward_layout,
            entries: [
                {
                    binding: 2, //diffuse view
                    resource: diffuse.view
                },
                {
                    binding: 3, //opacity view
                    resource: opacity.view
                }
            ]
        });

        


        if(mesh.material.opacity){
            let range = this.raster.forward_diffuse_opacity_pass.geometry_buffer.add_geometry(vertices, indices);

            let geo: SceneGeometry = {
                range: range,
                bind_groups: [bind_group]
            }
            this.raster.forward_diffuse_opacity_pass.geometries.push(geo);
        } else {
            let range = this.raster.forward_diffuse_pass.geometry_buffer.add_geometry(vertices, indices);
            let geo: SceneGeometry = {
                range: range,
                bind_groups: [bind_group]
            }
            this.raster.forward_diffuse_pass.geometries.push(geo);
        }
    }

    optimize_buffers(){
        this.optimize_pass_buffers(this.raster.forward_diffuse_opacity_pass);
        this.optimize_pass_buffers(this.raster.forward_diffuse_pass);
    }

    private sort_materials(pass: RenderPass){
        pass.geometries.sort((a,b)=>a.bind_groups[0].label.localeCompare((b.bind_groups[0].label)));
    }

    private optimize_pass_buffers(pass: RenderPass){
        this.sort_materials(pass);
        let ranges = pass.geometries.map(g=>g.range);
        let new_ranges = pass.geometry_buffer.rearange(ranges);
        for(let i = 0; i < new_ranges.length; i++){
            pass.geometries[i].range = new_ranges[i];
        }
        pass.optimized_geometries = this.merge_geometries(pass.geometries);
    }

    private setup_raster(): RasterData {
        const forward_shader = this.device.createShaderModule({code: color_shader_src(), label: "color shader"})
        const postprocess_shader = this.device.createShaderModule({code: postprocess_shader_src(), label: "postprocess shader"})
        const skybox_shader = this.device.createShaderModule({code: skybox_shader_src(), label: "skybox shader"})
        
        const full_screen_verts = new Float32Array([
            1,3,1,-1,
            -3,-1,-1,1,
            1,-1,1,1,
        ])

        const fullscreen_indices = new Uint32Array([
            0,1,2
        ])

        let gbuffer_dimensions = [this.context.canvas.width, this.context.canvas.height]

        let depth_buffer = this.device.createTexture({
            size: gbuffer_dimensions,
            format: "depth32float",
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            label: "depth buffer",
        });

        const gbuffer_color = this.device.createTexture({
            size: gbuffer_dimensions,
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            format: navigator.gpu.getPreferredCanvasFormat(),
            label: "gbuffer color"
        })

        console.log("Canvas format ", navigator.gpu.getPreferredCanvasFormat());

        const gbuffer_position = this.device.createTexture({
            size: gbuffer_dimensions,
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            format: "rgba32float",
            label: "gbuffer position"
        })

        const gbuffer_normal = this.device.createTexture({
            size: gbuffer_dimensions,
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            format: "rgba16float",
            label: "gbuffer normal"
        })

        let filtering_tex_sampler = this.device.createSampler({
            addressModeU: "repeat",
            addressModeV: "repeat",
            magFilter: "linear",
            minFilter: "linear",
        })

        let nearest_tex_sampler = this.device.createSampler({
            magFilter: "nearest",
            minFilter: "nearest"
        })
            
        const uv_2d_vertex_layout: GPUVertexBufferLayout[] = [
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

        const forward_vertex_layout: GPUVertexBufferLayout[] = [
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
                  shaderLocation: 2, // uv
                  offset: 24,
                  format: "float32x2",
                }
              ],
              arrayStride: 32,
              stepMode: "vertex",
            },
        ];

        const skybox_bind_group_layout = this.device.createBindGroupLayout({
            entries: [],
            label: "skybox bind group layout",
        })

        const postprocess_bind_group_layout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {
                        type: "filtering"
                    }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: "float",
                        viewDimension: "2d",
                    }
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: "unfilterable-float",
                        viewDimension: "2d",
                    }
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: "unfilterable-float",
                        viewDimension: "2d",
                    }
                }
            ],
            label: "postprocess bind group layout",
        })
    
        const forward_bind_group_frame_layout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0, //camera
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {
                        type: "uniform",
                    }
                },
                {
                    binding: 1, //sampler
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {
                        type: "filtering"
                    }
                },
            ],
            label: "forward bind group layout"
        });

        const forward_bind_group_material_layout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 2, //diffuse tex
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: "float",
                        viewDimension: "2d",
                        multisampled: false,
                    }
                },
                {
                    binding: 3, //opacity tex
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: "float",
                        viewDimension: "2d",
                        multisampled: false,
                    }
                }
            ],
            label: "forward bind group material layout"
        })

        this.forward_layout = forward_bind_group_material_layout;

        const postprocess_layout = this.device.createPipelineLayout({
            bindGroupLayouts: [postprocess_bind_group_layout],
            label: "postprocess layout"
        })

        const skybox_layout = this.device.createPipelineLayout({
            bindGroupLayouts: [skybox_bind_group_layout],
            label: "skybox layout"
        })
    
        const forward_layout = this.device.createPipelineLayout({
            bindGroupLayouts: [forward_bind_group_frame_layout, forward_bind_group_material_layout],
            label: "forward layout"
        });

        const skybox_bind_group = this.bind_group_cache.createBindGroup({
            layout: skybox_bind_group_layout,
            entries: []
        });

        const forward_bind_group = this.bind_group_cache.createBindGroup({
            layout: forward_bind_group_frame_layout,
            entries: [
                {
                    binding: 0, //camera
                    resource: {
                        buffer: this.camera.buffer
                    }
                },
                {
                    binding: 1, //tex sampler
                    resource: filtering_tex_sampler
                },
            ]
        });

        const postprocess_bind_group = this.bind_group_cache.createBindGroup({
            layout: postprocess_bind_group_layout,
            entries: [
                {
                    binding: 0,
                    resource: nearest_tex_sampler
                },
                {
                    binding: 1,
                    resource: gbuffer_color.createView()
                },
                {
                    binding: 2,
                    resource: gbuffer_position.createView()
                },
                {
                    binding: 3,
                    resource: gbuffer_normal.createView()
                }
            ]
        })

        const blend_mode: GPUBlendState = {
            alpha: {
                srcFactor: "src-alpha",
                dstFactor: "one-minus-src-alpha",
                operation: "add"
            },
            color: {
                srcFactor: "src-alpha",
                dstFactor: "one-minus-src-alpha",
                operation: "add"
            }
        }

        const pass1_targets = [
            {format: navigator.gpu.getPreferredCanvasFormat(), blend: blend_mode},
            {format: gbuffer_position.format},
            {format: gbuffer_normal.format}
        ]

        const canvas_target = [
            {format: navigator.gpu.getPreferredCanvasFormat()},
        ]

        const postprocess_pipeline_descriptor: GPURenderPipelineDescriptor = {
            vertex: {
                module: postprocess_shader,
                entryPoint: "vertex_main",
                buffers: uv_2d_vertex_layout,
            },
            fragment: {
                module: postprocess_shader,
                entryPoint: "fragment_main",
                targets: canvas_target,
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "none",
            },
            
            
            layout: postprocess_layout,
            label: "postprocess pipeline descriptor"
        }

        const skybox_pipeline_descriptor: GPURenderPipelineDescriptor = {
            vertex: {
                module: skybox_shader,
                entryPoint: "vertex_main",
                buffers: uv_2d_vertex_layout,
            },
            fragment: {
                module: skybox_shader,
                entryPoint: "fragment_main",
                targets: pass1_targets
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

        const forward_diffuse_pipeline_descriptor: GPURenderPipelineDescriptor = {
            vertex: {
                module: forward_shader,
                entryPoint: "vertex_main",
                buffers: forward_vertex_layout,
            },
            fragment: {
                module: forward_shader,
                entryPoint: "fragment_main",
                targets: pass1_targets,
                constants: {
                    has_opacity: 0
                }
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

        const forward_diffuse_opacity_pipeline_descriptor: GPURenderPipelineDescriptor = {
            vertex: {
                module: forward_shader,
                entryPoint: "vertex_main",
                buffers: forward_vertex_layout,
            },
            fragment: {
                module: forward_shader,
                entryPoint: "fragment_main",
                targets: pass1_targets,
                constants: {
                    has_opacity: 1
                }
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

    
        const postprocess_render_pipeline = this.device.createRenderPipeline(postprocess_pipeline_descriptor);
        const forward_diffuse_render_pipeline = this.device.createRenderPipeline(forward_diffuse_pipeline_descriptor);
        const forward_diffuse_opacity_render_pipeline = this.device.createRenderPipeline(forward_diffuse_opacity_pipeline_descriptor);
        const skybox_render_pipeline = this.device.createRenderPipeline(skybox_pipeline_descriptor);

        const forward_color_attachment: GPURenderPassColorAttachment = {
            view: gbuffer_color.createView(),
            loadOp: "clear",
            storeOp: "store",
        };
        const forward_position_attachment: GPURenderPassColorAttachment = {
            view: gbuffer_position.createView(),
            loadOp: "clear",
            storeOp: "store",
        };
        const forward_normal_attachment: GPURenderPassColorAttachment = {
            view: gbuffer_normal.createView(),
            loadOp: "clear",
            storeOp: "store",
        };
        const forward_attachments = [forward_color_attachment, forward_position_attachment, forward_normal_attachment];
        
        const forward_depth_attachment: GPURenderPassDepthStencilAttachment = {
            view: depth_buffer.createView(),
            depthClearValue: 1.0,
            depthLoadOp: "clear",
            depthStoreOp: "discard",
        };
        const postprocess_color_attachmet = "canvas";

        let fullscreen_buffer = new MergedBufer(this.device);
        let fullscreen_range = fullscreen_buffer.add_geometry(full_screen_verts, fullscreen_indices);

        return { 
            forward_diffuse_pass: {
                shader: forward_shader,
                pipeline: forward_diffuse_render_pipeline,
                bind_groups: [forward_bind_group],
                geometry_buffer: new MergedBufer(this.device),
                vertex_size: forward_vertex_layout[0].arrayStride,
                geometries: [],
                color_attachments: forward_attachments,
                depth_attachment: forward_depth_attachment
            },
            forward_diffuse_opacity_pass: {
                shader: forward_shader,
                pipeline: forward_diffuse_opacity_render_pipeline,
                bind_groups: [forward_bind_group],
                geometry_buffer: new MergedBufer(this.device),
                vertex_size: forward_vertex_layout[0].arrayStride,
                geometries: [],
                color_attachments: forward_attachments,
                depth_attachment: forward_depth_attachment
            },
            skybox_pass: {
                shader: skybox_shader,
                pipeline: skybox_render_pipeline,
                bind_groups: [skybox_bind_group],
                vertex_size: uv_2d_vertex_layout[0].arrayStride,
                geometries: [{
                    range: fullscreen_range,
                    bind_groups: []
                }],
                geometry_buffer: fullscreen_buffer,
                color_attachments: forward_attachments,
                depth_attachment: forward_depth_attachment,
            },
            postprocess_pass: {
                shader: postprocess_shader,
                pipeline: postprocess_render_pipeline,
                bind_groups: [postprocess_bind_group],
                vertex_size: uv_2d_vertex_layout[0].arrayStride,
                geometries: [{
                    range: fullscreen_range,
                    bind_groups: []
                }],
                geometry_buffer: fullscreen_buffer,
                color_attachments: [postprocess_color_attachmet]
            },
            depth_buffer: depth_buffer,
        }
    }

    private verify_attachments(passes: RenderPass[]){
        for(let i = 1; i < passes.length; i++){
            if(passes[i].color_attachments != passes[i-1].color_attachments) throw new Error("mismatch pass");
        }
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

            depthStencilAttachment: passes[0].depth_attachment,
            label: "render pass descriptor"
        };
    }

    private merge_geometries(geos: SceneGeometry[]): SceneGeometry[] {
        let cmp_bindgroups = (a: GPUBindGroup[],b: GPUBindGroup[])=>{
            if(a.length != b.length){
                return false;
            }
            for(let i = 0; i < a.length; i++){
                if(a[i] != b[i]) return false;
            }
            return true;
        }
        let ret: SceneGeometry[] = [];
        for(let i = 0; i < geos.length; i++){
            if(ret.length == 0){
                ret.push(geos[i]);
            } else {
                let prev = ret[ret.length-1];
                if(prev.range.indices.count + prev.range.indices.start == geos[i].range.indices.start && cmp_bindgroups(prev.bind_groups, geos[i].bind_groups)){
                    prev.range.indices.count += geos[i].range.indices.count;
                } else {
                    let r = geos[i].range;
                    let range = { indices: {start: r.indices.start, count: r.indices.count}, vertices: r.vertices}
                    ret.push({bind_groups: geos[i].bind_groups, range});
                }
            }
        }
        return ret;
    }

    private encode_render_passes(passes: RenderPass[], encoder: GPUCommandEncoder) {
        const pass_descriptor = this.make_pass_descriptor(passes);
        let tris_rendered = 0;
        let bind_groups_bound = 0;
        let draw_calls = 0;
        const pass_encoder = encoder.beginRenderPass(pass_descriptor);
        passes.forEach(pass => {
            pass_encoder.setPipeline(pass.pipeline);
            pass.bind_groups.forEach((group, idx)=>pass_encoder.setBindGroup(idx, group));
            pass_encoder.setVertexBuffer(0, pass.geometry_buffer.vertex_buffer);
            pass_encoder.setIndexBuffer(pass.geometry_buffer.index_buffer, "uint32");
            let existing_bind_groups = [null, null, null, null, null];

            (pass.optimized_geometries || pass.geometries).forEach(geom => {
                geom.bind_groups.forEach((group, idx)=>{
                    if(existing_bind_groups[idx + pass.bind_groups.length] != group){
                        pass_encoder.setBindGroup(idx + pass.bind_groups.length, group)
                        existing_bind_groups[idx + pass.bind_groups.length] = group;
                        bind_groups_bound++;
                    }
                });
                pass_encoder.drawIndexed(geom.range.indices.count, 1, geom.range.indices.start, 0);
                tris_rendered += geom.range.indices.count / 3;
                draw_calls ++;
            })
        });
        
        pass_encoder.end();
        // console.log(draw_calls, tris_rendered, bind_groups_bound);
    }

    draw_raster() {
        const command_encoder = this.device.createCommandEncoder();

        this.encode_render_passes([
            this.raster.forward_diffuse_pass, 
            this.raster.forward_diffuse_opacity_pass, 
            this.raster.skybox_pass,
        ], command_encoder);

        this.encode_render_passes([
            this.raster.postprocess_pass
        ], command_encoder);
        this.device.queue.submit([command_encoder.finish()]);
    }
}