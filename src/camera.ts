import { mat3, mat4, vec2, vec3 } from "gl-matrix"

export class Camera {
    private keymap: Map<string, boolean>;
    private pos: vec3;
    private speed: number = 100;
    private pitch_sensitivity = 0.01;
    private yaw_sensitivity = 0.01;
    private pitch: number = 0;
    private yaw: number = 0;
    constructor(){
        this.yaw = 3;
        this.keymap = new Map();
        this.pos = vec3.fromValues(20,20,20);
        document.addEventListener('keydown', (ev)=>{
            this.handle_evenet(ev, true);
        })
        document.addEventListener('keyup', (ev)=>{
            this.handle_evenet(ev, false);
        })
        document.addEventListener('mousemove', (ev)=>{
            this.handle_mouse(ev);
        })
    }

    public set_pos(pos: vec3){
        this.pos = pos;
    }

    private handle_evenet(ev: KeyboardEvent, pressed: boolean){
        this.keymap.set(ev.key, pressed);
    }

    private handle_mouse(ev: MouseEvent){
        this.yaw += this.yaw_sensitivity * -ev.movementX;
        this.pitch += this.pitch_sensitivity * -ev.movementY;
        this.pitch = Math.max(Math.min(1.3, this.pitch), -1.3);
    }

    public update(dt: number){
        let movement = vec3.create();
        if(this.keymap.get('w')) movement[1] += 1;
        if(this.keymap.get('s')) movement[1] -= 1;
        if(this.keymap.get('d')) movement[0] += 1;
        if(this.keymap.get('a')) movement[0] -= 1;
        if(this.keymap.get('e')) movement[2] += 1;
        if(this.keymap.get('q')) movement[2] -= 1;

        vec3.rotateZ(movement, movement, [0,0,0], this.yaw);
        vec3.scale(movement, movement, dt * this.speed);
        vec3.add(this.pos, this.pos, movement);
    }

    public view(): mat4 {
        const m = mat4.create();
        const focus = vec3.fromValues(0,1,0);
        vec3.rotateX(focus, focus, [0,0,0], this.pitch);
        vec3.rotateZ(focus, focus, [0,0,0], this.yaw);
        vec3.add(focus, focus, this.pos);
        return mat4.lookAt(m, this.pos, focus, [0,0,1]);
    }
}