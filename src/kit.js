// Shorthand for scene objects. Kinds: box tile slab orb text zone person cyl van bubble.
export const B = (t, x, y, o = {}) => ({ k: 'box', t, x, y, ...o });
export const Tl = (t, x, y, o = {}) => ({ k: 'tile', t, x, y, ...o });
export const O = (x, y, o = {}) => ({ k: 'orb', x, y, ...o });
export const T = (t, x, y, o = {}) => ({ k: 'text', t, x, y, ...o });
export const Z = (t, x, y, w, d, o = {}) => ({ k: 'zone', t, x, y, w, d, ...o });
export const S = (x, y, w, d, o = {}) => ({ k: 'slab', x, y, w, d, ...o });
export const P = (x, y, o = {}) => ({ k: 'person', x, y, ...o });
export const Cy = (t, x, y, o = {}) => ({ k: 'cyl', t, x, y, ...o });
export const V = (x, y, o = {}) => ({ k: 'van', x, y, ...o });
export const Bub = (t, x, y, o = {}) => ({ k: 'bubble', t, x, y, ...o });
export const L = (a, b, o = {}) => ({ a, b, ...o });

export function row(p, labels, o = {}) {
  const { x = 0, y = 0, dx = 1.2, dy = 0, k = 'tile', ...rest } = o;
  const r = {};
  labels.forEach((t, i) => { r[p + i] = { k, t, x: x + i * dx, y: y + i * dy, ...rest }; });
  return r;
}
export function bars(p, values, o = {}) {
  const { x = 0, y = 0, dx = 0.8, dy = 0, scale = 1, w = 0.55, d = 0.55, labels, ...rest } = o;
  const r = {};
  values.forEach((v, i) => {
    r[p + i] = { k: 'box', x: x + i * dx, y: y + i * dy, w, d, h: Math.max(0.05, v * scale), ...rest };
    if (labels) r[p + i].sub = labels[i];
  });
  return r;
}
export const off = (p, n) => Object.fromEntries(Array.from({ length: n }, (_, i) => [p + i, null]));
export const each = (p, n, props) => Object.fromEntries(Array.from({ length: n }, (_, i) => [p + i, typeof props === 'function' ? props(i) : props]));
export function mg(...objs) {
  const r = {};
  for (const o of objs) for (const [k, v] of Object.entries(o)) r[k] = v && r[k] ? { ...r[k], ...v } : v;
  return r;
}
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
