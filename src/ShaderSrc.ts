import blit_shader_src_raw from "./blit.wgpu";
import compute_shader_src_raw from "./compute.wgpu";
import color_shader_src_raw from "./color.wgpu";
import shadow_shader_src_raw from "./shadow.wgpu";


export function blit_shader_src(res_x: number, res_y: number): string {
    return blit_shader_src_raw.replaceAll("RES_X", res_x).replaceAll("RES_Y", res_y);
}
export function compute_shader_src(res_x: number, res_y: number): string {
    return compute_shader_src_raw.replaceAll("RES_X", res_x).replaceAll("RES_Y", res_y);
}
export function color_shader_src(res_x: number, res_y: number): string {
    return color_shader_src_raw.replaceAll("RES_X", res_x).replaceAll("RES_Y", res_y);
}
export function shadow_shader_src(res_x: number, res_y: number) : string {
    return shadow_shader_src_raw.replaceAll("RES_X", res_x).replaceAll("RES_Y", res_y);
}