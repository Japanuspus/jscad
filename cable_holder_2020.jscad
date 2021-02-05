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

const backplane = (p) =>
  translate([-p.t_back, 0, 0],
    difference(
      cube({ size: [2 * p.t_back, p.l_back, p.h_back], rounded: true, radius: p.rc, center: cx }),
      translate([-p.t_back, 0, 0],
        cube({ size: [p.t_back, p.l_back, p.h_back] }))));


function getParameterDefinitions() {
  return [
    { name: 'l', caption: 'finger length', type: 'float', initial: 50, min: 0.1 },
    { name: 'w', caption: 'finger width', type: 'float', initial: 10, min: 0.1 },
    { name: 't', caption: 'finger thickness', type: 'float', initial: 3, min: 0.1 },
    { name: 'ht', caption: 'finger support height', type: 'float', initial: 7.5, min: 0 },
    { name: 'h_back', caption: 'bacplate_height', type: 'float', initial: 12, min: 0 },
    { name: 't_back', caption: 'bacplate_thickness', type: 'float', initial: 3, min: 0 },
    { name: 'alpha', caption: 'finger angle', type: 'float', initial: 3.0, min: -45, max: 45 },
    { name: 'n_finger', caption: 'finger count', type: 'int', initial: 7, min: 1 },
    { name: 'ws', caption: 'finger separation', type: 'float', initial: 3.0, min: 0.1 },
  ];
}

function main(p) {
  p.rc = min(0.25 * p.w, 0.5 * p.t, 0.5 * p.t_back);
  p.l_back = p.n_finger * p.w + (p.n_finger - 1) * p.ws;
  return [
    fingers(p),
    backplane(p),
  ];
}
