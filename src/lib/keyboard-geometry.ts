export type Point = [number, number];
export const project = (x: number, y: number, z = 0): Point => [
  290 + (x - y) * 0.8660254,
  300 + (x + y) * 0.5 - z,
];
const p = (point: Point) => point.map((v) => +v.toFixed(3)).join(",");
export const plane = (x = 0, y = 0, z = 0) =>
  `matrix(.8660254 .5 -.8660254 .5 ${p(project(x, y, z)).replace(",", " ")})`;

// Round projected polygons in screen space for a consistent hand-drawn outline.
export function outline(points: Point[], radius = 12) {
  const corners = points.map((c, i) => {
    const a = points[(i + points.length - 1) % points.length],
      b = points[(i + 1) % points.length];
    const la = Math.hypot(a[0] - c[0], a[1] - c[1]),
      lb = Math.hypot(b[0] - c[0], b[1] - c[1]);
    const r = Math.min(radius, la / 2, lb / 2);
    return {
      c,
      a: [
        c[0] + ((a[0] - c[0]) * r) / la,
        c[1] + ((a[1] - c[1]) * r) / la,
      ] as Point,
      b: [
        c[0] + ((b[0] - c[0]) * r) / lb,
        c[1] + ((b[1] - c[1]) * r) / lb,
      ] as Point,
    };
  });
  return `M${p(corners[0].a)} ${corners.map((c, i) => `Q${p(c.c)} ${p(c.b)} L${p(corners[(i + 1) % corners.length].a)}`).join(" ")} Z`;
}

// Boundary of a polygon swept down the screen: its visible extruded side wall.
export function extruded(points: Point[], height: number, radius = 12) {
  const boundary: Point[] = [];
  points.forEach((point, i) => {
    const previous = points[(i + points.length - 1) % points.length],
      next = points[(i + 1) % points.length];
    const incoming = point[0] < previous[0] ? height : 0;
    const outgoing = next[0] < point[0] ? height : 0;
    boundary.push([point[0], point[1] + incoming]);
    if (incoming !== outgoing) boundary.push([point[0], point[1] + outgoing]);
  });
  return outline(boundary, radius);
}
