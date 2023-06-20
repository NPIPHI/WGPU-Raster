type RawMesh = {
    name: string;
    material_index: number;
    vertices: number[];
    indices: number[];
}

type RawMaterial = {
    diffuse: string | null;
}

type RawModel = {
    meshes: RawMesh[];
    materials: RawMaterial[];
}

export type Mesh = {
    vertices: number[];
    normals: number[];
    uvs: number[];
    indices: number[];
    material: Material;
    name: string
}

export type Texture = {
    width: number;
    height: number;
    data: ImageBitmap;
}

export type Material = {
    diffuse: Texture
}

async function load_material(mat: RawMaterial, parent_path: string): Promise<Material> {
    if(mat.diffuse){
        let split = mat.diffuse.split('.')
        if(split[split.length-1] == "png"){
            let tex = await load_texture("StgDolpic_Chikei/" + mat.diffuse);
            return { diffuse: tex };
        } else {
            return blank_material();
        }
    } else {
        return blank_material();
    }
}

async function load_texture(path: string): Promise<Texture> {
    let blob = await (await fetch(path)).blob();
    let img = await createImageBitmap(blob, { colorSpaceConversion: 'none'});
    return {
        width: img.width,
        height: img.height,
        data: img
    }
}

function blank_material(): Material {
    return {
        diffuse: {
            width: 1,
            height: 1,
            data: null,
        }
    }
}

export async function load_json_model(path: string): Promise<Mesh[]> {
    let model: RawModel = await (await fetch(path)).json()
    let materials = await Promise.all(model.materials.map((m: RawMaterial)=>{
        return load_material(m, path);
    }));

    return model.meshes.map((m: RawMesh)=>{
        let verts = [];
        let norms = [];
        let uvs = [];
        for(let i = 0; i < m.vertices.length; i += 8){
            verts.push(m.vertices[i]);
            verts.push(m.vertices[i+1]);
            verts.push(m.vertices[i+2]);
            
            norms.push(m.vertices[i+3]);
            norms.push(m.vertices[i+4]);
            norms.push(m.vertices[i+5]);

            uvs.push(m.vertices[i+6]);
            uvs.push(m.vertices[i+7]);
        }

        return {
            vertices: verts,
            normals: norms,
            uvs: uvs,
            indices: m.indices,
            material: materials[m.material_index],
            name: m.name
        }
    });
}