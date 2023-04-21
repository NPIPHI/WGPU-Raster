import { mat4, vec3 } from "gl-matrix";
import { NoiseFunction2D, createNoise2D } from "simplex-noise"
import alea from "alea";

interface Light {
    encode(): number[];
    shadow_view?(): mat4;
}

class DirectionalLight implements Light {
    constructor(public dir: [number, number, number], public color: [number, number, number], public luminance: number){}
    public encode(): number[] {
        return [...this.dir, 1, ...this.color, this.luminance];
    }
}

class SpotLight implements Light {
    constructor(public pos: [number, number, number], public dir: [number, number, number], public color: [number, number, number], public luminance: number){}
    public encode(): number[] {
        return [...this.pos, 0, ...this.color, this.luminance];
    }

    public shadow_view(): mat4 {
        const perspective = mat4.create();
        // mat4.ortho(dir_shadow, 10, -10, 10, -10, 1, 100);
        mat4.perspective(perspective, Math.PI/2, 1, 0.1, 100);

        const look_at = vec3.create();
        vec3.add(look_at, this.pos, this.dir);

        const view = mat4.create();
        mat4.lookAt(view, this.pos, look_at, [0,0,1]);

        const mvp_shadow = mat4.create();
        mat4.mul(mvp_shadow, perspective, view);
        return mvp_shadow;
    }
}

class PointLight implements Light {
    constructor(public pos: [number, number, number], public color: [number, number, number], public luminance: number){}
    public encode(): number[] {
        return [...this.pos, 0, ...this.color, this.luminance];
    }
}

class Ground {
    dim_x: number;
    dim_y: number;
    res_x: number;
    res_y: number;
    noise_octaves: {f: NoiseFunction2D, s_x: number, s_y: number, s_z: number}[]
    constructor(){
        this.dim_x = 200;
        this.dim_y = 200;
        this.res_x = 0.1;
        this.res_y = 0.1;
        this.noise_octaves = [
            {f: createNoise2D(alea(1)), s_x: 0.01, s_y: 0.01, s_z: 4},
            {f: createNoise2D(alea(2)), s_x: 0.1, s_y: 0.1, s_z: 5},
            {f: createNoise2D(alea(3)), s_x: 1, s_y: 1, s_z: 0.02},
        ];
    }
    public encode_vertices(): {vertices: Float32Array, indices: Uint32Array} {
        let vertices = [];
        
        for(let xi = 0; xi < this.dim_x; xi++){
            for(let yi = 0; yi < this.dim_y; yi++){
                const x = xi * this.res_x;
                const y = yi * this.res_y;
                const h = this.height(x,y);
                const {dx, dy} = this.dheight(x,y);
                const n = vec3.fromValues(dx, dy, 1);
                vec3.normalize(n, n);
                const color = [1,1,1,0];
                
                vertices.push(x,y,h,...n,...color);
            }
        }

        let indices = [];
        for(let x = 0; x < this.dim_x-1; x++){
            for(let y = 0; y < this.dim_y-1; y++){
                indices.push(x + y * this.dim_x);
                indices.push((x+1) + y * this.dim_x);
                indices.push(x + (y+1) * this.dim_x);
                indices.push((x+1) + y * this.dim_x);
                indices.push((x+1) + (y+1) * this.dim_x);
                indices.push(x + (y+1) * this.dim_x);
            }
        }

        console.log(`${vertices.length / 10} verts, ${indices.length} indices`);
        return {vertices: new Float32Array(vertices), indices: new Uint32Array(indices)}
    }

    private height(x: number, y: number){
        return this.noise_octaves.reduce((a,b)=>a + b.f(x*b.s_x, y*b.s_y) * b.s_z, 0);
    }

    private dheight(x: number, y: number): {dx, dy} {
        const h = this.height(x,y);
        const ep = 0.001;
        return {dx: -(this.height(x + ep, y) - h)/ep, dy: -(this.height(x, y + ep) - h)/ep};
    }
}

export class Scene {
    
    private lights: Light[];
    private ground: Ground;
    private ambient_light: number;
    constructor(){
        this.lights = [new SpotLight([5, -10, 10], [0, 1, 0], [1, 1, 1], 1)];
        this.ground = new Ground();
        this.ambient_light = 0.1;
    }

    encode_ground_vertices(): {vertices: Float32Array, indices: Uint32Array} {
        return this.ground.encode_vertices();
    }

    encode_lights(): Float32Array {
        return new Float32Array(this.lights.flatMap(s => s.encode()));
    }

    shadow_perspectives(): mat4 {
        return this.lights[0].shadow_view();
    }

    light_count(): number {
        return this.lights.length;
    }

    ambient_luminance(): number {
        return this.ambient_light;
    }
}
