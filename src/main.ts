import { mat4, vec3 } from "gl-matrix";
import { App } from "./App";
import { Camera } from "./camera";
import { SpotLight } from "./scene";
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
        alphaMode: "premultiplied",
    })

    const RES_X = canvas.width;
    const RES_Y = canvas.height;


    const app = new App(device, context, RES_X, RES_Y);

    const perspective = mat4.create();
    mat4.perspective(perspective, Math.PI/2, RES_X/RES_Y, 0.1, null);

    load_json_model("Windfall").then((meshes)=>{
        meshes.forEach(mesh=>{
            if(mesh.indices.length > 0){
                app.add_mesh(mesh)
            }
        });
        app.optimize_buffers();
    });

    const camera = new Camera();

    let frame_count = 0;
    let last_time = 0;


    const run = ()=>{
        // requestAnimationFrame(run);
        // const run2 = ()=>{
            // requestAnimationFrame(run);
        // }
        // requestAnimationFrame(run2);
        requestAnimationFrame(run);
        camera.update(0.008)
        let mvp = mat4.create();
        const view = camera.view();
        mat4.multiply(mvp, perspective, view);

        app.set_camera(mvp);
        app.draw_raster();
        frame_count++;
        if(frame_count % 300 == 0){
            console.log("FPS ", 300/((performance.now() - last_time)/1000))
            last_time = performance.now();
        }
    }
    requestAnimationFrame(run);
    // run();
}


main();
