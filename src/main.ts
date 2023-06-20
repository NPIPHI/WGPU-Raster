import { mat4, vec3 } from "gl-matrix";
import { App } from "./App";
import { Camera } from "./camera";
import { SpotLight } from "./scene";
import { OBJ } from "webgl-obj-loader"
import { load_json_model } from "./ModelLoad";

async function main(){
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("gpuCanvas");
    const context: GPUCanvasContext = canvas.getContext("webgpu");
    const gpu = navigator.gpu;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const adapter = await gpu.requestAdapter({powerPreference: "high-performance"});

    console.log("Supported Features: {");
    adapter.features.forEach((a)=>console.log(a))
    console.log("}");
    
    const device = await adapter.requestDevice({label: "GPU device"});

    console.log("Device Features: {");
    device.features.forEach((a)=>console.log(a));
    console.log("}");

    console.log(`${canvas.width}x${canvas.height}`);

    context.configure({
        device: device,
        format: gpu.getPreferredCanvasFormat(),
        alphaMode: "premultiplied"
    })

    const RES_X = canvas.width;
    const RES_Y = canvas.height;


    const app = new App(device, context, RES_X, RES_Y);
    // app.exec_compute();
    // app.draw_blit();
    const perspective = mat4.create();
    mat4.perspective(perspective, Math.PI/2, RES_X/RES_Y, 0.1, null);

    // fetch("./Delfino Plaza.obj").then(data=>data.text()).then(str=>{
    //     const model = new OBJ.Mesh(str);
    //     app.set_mesh(model);
    //     // app.draw_raster();
    // });
    load_json_model("StgDolpic_Chikei/verts.json").then((meshes)=>{
        meshes.forEach(mesh=>{
            if(mesh.indices.length > 0){
                app.add_mesh(mesh)
            }
        });
    });


    // const dir_shadow = mat4.create();
    // // mat4.ortho(dir_shadow, 10, -10, 10, -10, 1, 100);
    // mat4.perspective(dir_shadow, Math.PI/2, RES_X/RES_Y, 1, 100);

    // const shadow_look = mat4.create();
    // mat4.lookAt(shadow_look, [5, -10, 1], [5,5,0], [0,0,1]);

    // const mvp_shadow = mat4.create();
    // mat4.mul(mvp_shadow, dir_shadow, shadow_look);

    // mat4.rotateX(transform, transform, 0.6);
    // mat4.translate(transform, transform, vec3.fromValues(0,0,0));
    // mvp = transform;
    let t = Math.PI;
    const camera = new Camera();
    const run = ()=>{
        // t += 0.008 * 0.5;
        camera.update(0.008)
        let mvp = mat4.create();
        const view = camera.view();
        mat4.multiply(mvp, perspective, view);
        const light = <SpotLight>app.scene.lights[0];
        const center = 50;
        light.color = [1,1,1];
        light.luminance = 1;
        light.dir = [Math.cos(t), 0, Math.sin(t)];
        light.pos = [-Math.cos(t)*2*center+center, center, -Math.sin(t)*2*center+center];
        
        app.update_lights();


        // const shadow_look = mat4.create();
        // mat4.lookAt(shadow_look, [5 + Math.sin(t) * 10, 5 + Math.sin(t) * 10, 10], [5,5,0], [0,0,1]);

        // const mvp_shadow = mat4.create();
        // mat4.mul(mvp_shadow, dir_shadow, shadow_look);
        

        app.set_camera(mvp);
        // app.set_camera(app.scene.shadow_perspectives());
        app.draw_raster();
        requestAnimationFrame(run);
    }
    run();
}


main();
