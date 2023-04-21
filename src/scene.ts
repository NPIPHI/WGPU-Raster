import { mat4, vec3 } from "gl-matrix";
import { NoiseFunction2D, createNoise2D } from "simplex-noise"
import alea from "alea";

export interface Light {
    encode(): number[];
    shadow_view?(): mat4;
}

export class DirectionalLight implements Light {
    constructor(public dir: [number, number, number], public color: [number, number, number], public luminance: number){}
    public encode(): number[] {
        return [...this.dir, 1, ...this.color, this.luminance];
    }
}

export class SpotLight implements Light {
    constructor(public pos: [number, number, number], public dir: [number, number, number], public color: [number, number, number], public luminance: number){}
    public encode(): number[] {
        return [...this.pos, 0, ...this.color, this.luminance];
    }

    public shadow_view(): mat4 {
        const perspective = mat4.create();
        // mat4.ortho(dir_shadow, 10, -10, 10, -10, 1, 100);
        mat4.perspective(perspective, Math.PI/2, 1, 1, 200);

        const look_at = vec3.create();
        vec3.add(look_at, this.pos, this.dir);

        const view = mat4.create();
        mat4.lookAt(view, this.pos, look_at, [0,0,1]);

        const mvp_shadow = mat4.create();
        mat4.mul(mvp_shadow, perspective, view);
        return mvp_shadow;
    }
}

export class PointLight implements Light {
    constructor(public pos: [number, number, number], public color: [number, number, number], public luminance: number){}
    public encode(): number[] {
        return [...this.pos, 0, ...this.color, this.luminance];
    }
}

class NoiseOctave {
    constructor(private f: NoiseFunction2D, private s_x: number, private s_y: number, private s_z: number){

    }

    at(x: number, y: number){
        return (this.f(x * this.s_x, y * this.s_y)+1) * this.s_z;
    }
}

class Ground {
    dim_x: number;
    dim_y: number;
    res_x: number;
    res_y: number;
    major_octave: NoiseOctave;
    minor_octave: NoiseOctave;
    texture_octave: NoiseOctave;
    constructor(){
        this.dim_x = 1000;
        this.dim_y = 1000;
        this.res_x = 0.1;
        this.res_y = 0.1;
        this.major_octave = new NoiseOctave(createNoise2D(alea(10)), 0.01, 0.01, 5);
        this.minor_octave = new NoiseOctave(createNoise2D(alea(20)), 0.1, 0.1, 2);
        this.texture_octave = new NoiseOctave(createNoise2D(alea(30)), 1, 1, 0.02);
    }
    public encode_vertices(): {vertices: Float32Array, indices: Uint32Array} {
        let vertices = [];
        
        for(let yi = 0; yi < this.dim_y; yi++){
            for(let xi = 0; xi < this.dim_x; xi++){
                const x = xi * this.res_x;
                const y = yi * this.res_y;
                const h = this.height(x,y);
                const {dx, dy} = this.dheight(x,y);
                const n = vec3.fromValues(dx, dy, 1);
                vec3.normalize(n, n);
                let color = [1,1,1,0];
                if(h == 3){
                    //#2671aa
                    color = [0x26/255,0x71/255,0xaa/255,0]; 
                } else {
                    color = [0.2,0.5,0.2,0];
                }
                
                vertices.push(x,y,h,...n,...color);
            }
        }

        for(let xi = 0; xi < this.dim_x; xi++){
            const x = xi * this.res_x;
            const y = 0;
            const h = -2;
            const n = [0,1,0];
            let color = [0,0,0,0];
            vertices.push(x,y,h,...n,...color);
        }

        for(let xi = 0; xi < this.dim_x; xi++){
            const x = xi * this.res_x;
            const y = (this.dim_y-1) * this.res_y;
            const h = -2;
            const n = [0,1,0];
            let color = [0,0,0,0];
            vertices.push(x,y,h,...n,...color);
        }

        for(let yi = 0; yi < this.dim_y; yi++){
            const x = 0;
            const y = yi * this.res_y;
            const h = -2;
            const n = [0,1,0];
            let color = [0,0,0,0];
            vertices.push(x,y,h,...n,...color);
        }

        for(let yi = 0; yi < this.dim_y; yi++){
            const x = (this.dim_x-1) * this.res_x;
            const y = yi * this.res_y;
            const h = -2;
            const n = [0,1,0];
            let color = [0,0,0,0];
            vertices.push(x,y,h,...n,...color);
        }

        vertices.push(0,0,-2,0,0,-1,0,0,0,0);
        vertices.push(this.res_x*this.dim_x,0,-2,0,0,-1,0,0,0,0);
        vertices.push(0,this.res_y*this.dim_y,-2,0,0,-1,0,0,0,0);
        vertices.push(this.res_x*this.dim_x,this.res_y*this.dim_y,-2,0,0,-1,0,0,0,0);

        let indices = [];
        const ct = this.dim_x * this.dim_y;
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

        for(let x = 0; x < this.dim_x - 1; x++){
            indices.push((x+1) + 0 * this.dim_x);
            indices.push(x + 0 * this.dim_x);
            indices.push(ct + x + 0 * this.dim_x);
            indices.push((x+1) + 0 * this.dim_x);
            indices.push(ct + x + 0 * this.dim_x);
            indices.push(ct + (x+1) + 0 * this.dim_x);
        }

        for(let x = 0; x < this.dim_x - 1; x++){
            indices.push((x+1) + (this.dim_y-1) * this.dim_x);
            indices.push(ct + x + this.dim_x);
            indices.push(x + (this.dim_y-1) * this.dim_x);
            indices.push((x+1) + (this.dim_y-1) * this.dim_x);
            indices.push(ct + (x+1) + this.dim_x);
            indices.push(ct + x + this.dim_x);
        }

        for(let y = 0; y < this.dim_y - 1; y++){
            indices.push(y * this.dim_x);
            indices.push((y+1) * this.dim_x);
            indices.push(ct + this.dim_x*2 + y);
            indices.push(ct + this.dim_x*2 + y);
            indices.push((y+1) * this.dim_x);
            indices.push(ct + 1 + this.dim_x*2 + y);
        }

        for(let y = 0; y < this.dim_y - 1; y++){
            indices.push(this.dim_x - 1 + y * this.dim_x);
            indices.push(ct + this.dim_x*2 + this.dim_y + y);
            indices.push(this.dim_x - 1 + (y+1) * this.dim_x);
            indices.push(this.dim_x - 1 + (y+1) * this.dim_x);
            indices.push(ct + this.dim_x*2 + this.dim_y+ y);
            indices.push(ct + 1 + this.dim_x*2 + this.dim_y+ y);
        }

        const ct2 = ct + this.dim_x * 2 + this.dim_y * 2
        indices.push(ct2);
        indices.push(ct2+2);
        indices.push(ct2+1);
        indices.push(ct2+2);
        indices.push(ct2+3);
        indices.push(ct2+1);

        console.log(`${vertices.length / 10} verts, ${indices.length} indices`);
        return {vertices: new Float32Array(vertices), indices: new Uint32Array(indices)}
    }

    private height(x: number, y: number){
        const major = this.major_octave.at(x,y);

        const minor = this.minor_octave.at(x,y);
        const texture = this.texture_octave.at(x,y);
        if(major + minor < 3){
            return 3;
        }
        return major + minor + texture;
    }

    private dheight(x: number, y: number): {dx, dy} {
        const h = this.height(x,y);
        const ep = 0.001;
        return {dx: -(this.height(x + ep, y) - h)/ep, dy: -(this.height(x, y + ep) - h)/ep};
    }
}

export class Scene {
    
    public lights: Light[];
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
