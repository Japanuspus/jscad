// Cable Holder 2020, @japanuspus
// To view: drag file into https://openjscad.org/
const cx = [true, false, false];
const cy = [false, true, false];

const tooth = (p) =>
  translate(
    [-p.ht, 0, 0],
    cube({ size: [p.l + p.ht, p.w, p.t], rounded: true, radius: p.rc, fn: 16, center: cy }));

const support_pos = (p) =>
  translate([-p.ht, 0, p.ht],
    rotate([0, atan(p.ht / p.l), 0],
      translate([0, 0, -p.ht],
        cube({ size: [p.l + p.ht, p.t, p.ht + p.t], rounded: true, radius: p.rc, fn: 16, center: cy }))));

const support_neg = (p) =>
  translate([-p.ht, 0, -p.ht - 0.5 * p.t], cube({ size: [p.l + p.ht, p.w, p.t + p.ht], center: cy }));

const support = (p) => difference(support_pos(p), support_neg(p));

const finger_neg = (p) =>
  rotate([0, -90 - p.alpha, 0], cube({ size: [2 * p.ht + p.t, p.w, p.ht + p.t], center: cy }));

const finger = (p) => difference(union(tooth(p), support(p)), finger_neg(p));

const fingers = (p) => {
  const f = finger(p);
  return union([...Array(p.n_finger)].map((_, i) => translate([0, 0.5 * p.w + i * (p.ws + p.w), 0], f)));
}

const fingerplane = (p) => 
  translate([-p.t_back-p.rc,0,0],
    difference(
      cube({size: [p.rc+p.t_back+p.rc, p.l_back, p.t], rounded: true, radius: p.rc, fn: 16}),
      cube({size: [p.rc, p.l_back, p.t]})));


const backplane_raw = (p) =>
  translate([-p.t_back, 0, 0],
    difference(
      cube({ size: [2 * p.t_back, p.l_back, p.h_back], rounded: true, radius: p.rc, center: cx }),
      translate([-p.t_back, 0, 0],
        cube({ size: [p.t_back, p.l_back, p.h_back] }))));

// hole locations
const hole_location = (p) => {
  let y0 = p.w+0.5*p.ws;
  let dy_tot = (p.n_finger-2)*(p.w+p.ws);
  let dy = dy_tot/(p.n_hole-1);
  return [...Array(p.n_hole)].map((_, i) => y0+i*dy)
} 

const backplane_holes = (p) => 
  union(hole_location(p).map( (y) => cylinder({start: [-p.t_back, y, p.t+p.d_head/2], end: [0, y, p.t+p.d_head/2], r: p.d_screw/2})))



const backplane = (p) => 
  difference(
    rotate([0,-p.alpha,0], difference(backplane_raw(p), backplane_holes(p))),
    translate([-p.h_back,0,-p.h_back], cube({size: [p.h_back, p.l_back, p.h_back]})));


function getParameterDefinitions() {
  return [
    { name: 'n_finger', caption: 'finger count', type: 'int', initial: 7, min: 1 },
    { name: 'n_hole', caption: 'screw hole count', type: 'int', initial: 2, min: 2 },
    { name: 'l', caption: 'finger length', type: 'float', initial: 50, min: 0.1 },
    { name: 'w', caption: 'finger width', type: 'float', initial: 10, min: 0.1 },
    { name: 't', caption: 'finger thickness', type: 'float', initial: 3, min: 0.1 },
    { name: 'ht', caption: 'finger support height', type: 'float', initial: 7.5, min: 0 },
    { name: 'h_back', caption: 'bacplate_height', type: 'float', initial: 12, min: 0 },
    { name: 't_back', caption: 'bacplate_thickness', type: 'float', initial: 3, min: 0 },
    { name: 'alpha', caption: 'finger angle', type: 'float', initial: 3.0, min: -45, max: 45 },
    { name: 'ws', caption: 'finger separation', type: 'float', initial: 3.0, min: 0.1 },
    { name: 'd_screw', caption: 'screw diameter', type: 'float', initial: 4.5, min: 0.1 },
    { name: 'd_head', caption: 'screw head diameter', type: 'float', initial: 9, min: 0.1 },
  ];
}

function main(p) {
  p.rc = min(0.25 * p.w, 0.5 * p.t, 0.5 * p.t_back);
  p.l_back = p.n_finger * p.w + (p.n_finger - 1) * p.ws;
  return union([
    fingers(p),
    backplane(p),
    fingerplane(p),
  ])
}
