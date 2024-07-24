function calculateNormal(v0, v1, v2) {
    const edge1 = [
        v1[0] - v0[0],
        v1[1] - v0[1],
        v1[2] - v0[2]
    ];
    const edge2 = [
        v2[0] - v0[0],
        v2[1] - v0[1],
        v2[2] - v0[2]
    ];
    const normal = [
        edge1[1] * edge2[2] - edge1[2] * edge2[1],
        edge1[2] * edge2[0] - edge1[0] * edge2[2],
        edge1[0] * edge2[1] - edge1[1] * edge2[0]
    ];
    const length = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
    return normal.map(n => n / length);
}

function normalize(v3) {
    const length = Math.sqrt(v3[0] * v3[0] + v3[1] * v3[1] + v3[2] * v3[2]);
    return [v3[0] / length, v3[1] / length, v3[2] / length];
}


function helper_createCirclePos(numSegments, radius, z = 0) {
    const pos = [];
    for (let i = 0; i < numSegments; i++) {
        const angle = 2 * Math.PI * i / numSegments;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        pos.push([x, y, z]);
    }
    return pos;
}

// 圆形边缘的法线
function helper_edgeNormal(v3_vertex, radius_inner) {
    const vx = v3_vertex[0], vy = v3_vertex[1], vz = v3_vertex[2];
    const center = normalize([vx, vy, 0]).map(a => a * radius_inner);
    const v = [vx - center[0], vy - center[1], vz - center[2]]
    return normalize(v);
}


function paramMetal() {
    const seg_cirle = 64;
    const seg_edge = 32;
    const radius = 1;
    const edge_count = Math.floor(seg_edge * 4 / 3);//不止半圆，往回卷一点
    const radius_inner = 0.9;//除去圆边的半径
    const radius_edge = radius - radius_inner;
    return {
        seg_cirle,
        seg_edge,
        radius,
        edge_count,
        radius_inner,
        radius_edge
    };
}

const medal_param = paramMetal();
export function createMedalInner() {
    const {
        seg_cirle,
        seg_edge,
        radius,
        edge_count,
        radius_inner,
        radius_edge
    } = medal_param;

    const angle = Math.PI * edge_count / seg_edge;
    const z = -radius_edge * Math.cos(angle);
    //console.log(z)
    const delta = radius_edge * Math.sin(angle);
    const circle = helper_createCirclePos(seg_cirle, radius_inner + delta, z);


    const vertex_count =
        seg_cirle // 圈
        + 1 // 底部;
    const vertex = new Float32Array(vertex_count * 3);
    const normal = new Float32Array(vertex_count * 3);

    let offset = 0;
    let n = [0, 0, 1];
    circle.forEach(v3 => {
        vertex.set(v3, offset);
        normal.set(n, offset);
        offset += 3;
    });

    vertex.set([0, 0, z], offset);
    normal.set(n, offset);

    // indice
    const indices = [];
    const offset_bottom_p = vertex_count - 1;
    for (let i = 0; i < seg_cirle; i++) {
        indices.push(
            i,
            ((i + 1) % seg_cirle),
            offset_bottom_p
        );
    }

    return {
        vertex: vertex,
        normal: normal,
        indices: new Uint16Array(indices)
    }
}
export function createMedalOuter() {
    const {
        seg_cirle,
        seg_edge,
        radius,
        edge_count,
        radius_inner,
        radius_edge
    } = medal_param;

    const part_edge_vertex = [];
    // 外圈 从下向上
    for (let i = 0; i <= edge_count; i++) {
        const angle = Math.PI * i / seg_edge;
        const z = -radius_edge * Math.cos(angle);
        //console.log(z)
        const delta = radius_edge * Math.sin(angle);
        part_edge_vertex.push(helper_createCirclePos(seg_cirle, radius_inner + delta, z));
    }

    const vertex_count =
        part_edge_vertex.length * seg_cirle // 圈们
        + 1 // 底部;
    const vertex = new Float32Array(vertex_count * 3);
    const normal = new Float32Array(vertex_count * 3);
    let offset = 0;
    part_edge_vertex.forEach((array_of_v3) => {
        array_of_v3.forEach(v3 => {
            vertex.set(v3, offset);
            const n = helper_edgeNormal(v3, radius_inner);
            //console.log(n)
            normal.set(n, offset);
            offset += 3;
        });
    });
    //assert
    //console.log("offset==vertex_count*3", offset, vertex_count * 3)
    vertex.set([0, 0, -radius_edge], offset);
    normal.set([0, 0, -1], offset);

    const indices = [];
    for (let ring = 0; ring < part_edge_vertex.length - 1; ring++) {
        const base = ring * seg_cirle;
        for (let i = 0; i < seg_cirle; i++) {
            indices.push(
                base + i,
                base + ((i + 1) % seg_cirle),
                base + i + seg_cirle
            );
            indices.push(
                base + ((i + 1) % seg_cirle),
                base + ((i + 1) % seg_cirle) + seg_cirle,
                base + i + seg_cirle
            );
        }
    }

    // 底部
    const offset_bottom_p = vertex_count - 1;
    for (let i = 0; i < seg_cirle; i++) {
        indices.push(
            ((i + 1) % seg_cirle),
            i,
            offset_bottom_p
        );
    }
    //console.log(indices)
    return {
        vertex: vertex,
        normal: normal,
        indices: new Uint16Array(indices)
    }
}