import postprocess_shader_src_raw from "./shaders/postprocess.wgpu";
import compute_shader_src_raw from "./shaders/compute.wgpu";
import color_shader_src_raw from "./shaders/color.wgpu";
import shadow_shader_src_raw from "./shaders/shadow.wgpu";
import skybox_shader_src_raw from "./shaders/skybox.wgpu";

export function compute_shader_src(): string {
    return compute_shader_src_raw;
}
export function color_shader_src(): string {
    return color_shader_src_raw;
}
export function shadow_shader_src() : string {
    return shadow_shader_src_raw;
}
export function skybox_shader_src() : string {
    return skybox_shader_src_raw;
}
export function postprocess_shader_src() : string {
    return postprocess_shader_src_raw;
}