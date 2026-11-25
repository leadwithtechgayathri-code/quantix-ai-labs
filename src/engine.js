// Quantix AI Labs isometric scene engine (v2).
// Scenes are lists of states { o: objects, l: links }. The engine tweens numeric props
// between states and can move the camera (viewBox) to focus on chosen objects.

const U = 32;
const CX = Math.cos(Math.PI / 6) * U;
const CY = 0.5 * U;
export const proj = (x, y, z = 0) => [(x - y) * CX, (x + y) * CY - z * U];

const DEF = {
  box: { w: 1, d: 1, h: 1 },
  tile: { w: 1, d: 1, h: 0.22 },
  slab: { w: 4, d: 2, h: 0.16, c: 'slate' },
  orb: { r: 0.32 },
  text: { c: 'ink' },
  zone: { w: 3, d: 2, c: 'blue' },
  person: { c: 'violet', s: 1, sk: 0 },
  cyl: { r: 0.6, h: 0.9, c: 'teal' },
  van: { c: 'slate' },
  scooter: { c: 'coral' },
  bubble: { c: 'slate', fs: 12 },
};
const NUM = ['x', 'y', 'z', 'w', 'd', 'h', 'r', 'o', 'fs', 's'];
const LNUM = ['o', 'sw', 'bend'];
const SKIN = ['#E9B98F', '#C98E62', '#8D5A3B'];

export function norm(o) {
  const k = o.k || 'box';
  return { k, x: 0, y: 0, z: 0, o: 1, c: 'blue', ...DEF[k], ...o };
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const f = (n) => Math.round(n * 10) / 10;
const pts = (a) => a.map((p) => f(p[0]) + ',' + f(p[1])).join(' ');
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
export const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

function lines(t, x, y, fs, cls, extra = '') {
  const parts = String(t).split('\n');
  const y0 = y - ((parts.length - 1) * fs * 1.15) / 2;
  return `<text class="${cls}" x="${f(x)}" y="${f(y0)}" font-size="${f(fs)}" ${extra}>${parts
    .map((p, i) => `<tspan x="${f(x)}" dy="${i ? f(fs * 1.15) : 0}">${esc(p)}</tspan>`)
    .join('')}</text>`;
}

function topFace(o, z1) {
  const hw = o.w / 2, hd = o.d / 2;
  return [proj(o.x - hw, o.y - hd, z1), proj(o.x + hw, o.y - hd, z1), proj(o.x + hw, o.y + hd, z1), proj(o.x - hw, o.y + hd, z1)];
}

let SUBS = [], BUBS = [];

function drawShadow(o) {
  if (o.o <= 0.01 || o.k === 'text' || o.k === 'zone' || o.k === 'bubble' || o.noshadow) return '';
  const a = Math.max(0, 0.2 - Math.max(0, o.z) * 0.04) * o.o;
  if (a <= 0.01) return '';
  if (o.k === 'orb' || o.k === 'cyl' || o.k === 'person') {
    const r = o.k === 'orb' ? o.r : o.k === 'cyl' ? o.r : 0.36 * o.s;
    const [cx, cy] = proj(o.x + 0.08, o.y + 0.08, 0);
    return `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(r * U * 1.05)}" ry="${f(r * U * 0.55)}" fill="var(--shadow)" opacity="${a.toFixed(2)}" filter="url(#blur)"/>`;
  }
  const w = o.k === 'van' ? 2.1 : o.k === 'scooter' ? 1.2 : o.w, d = o.k === 'van' ? 0.8 : o.k === 'scooter' ? 0.45 : o.d, x = o.k === 'van' ? o.x + 0.3 : o.x;
  const s = { x: x + 0.14, y: o.y + 0.14, w: w * 1.04, d: d * 1.04 };
  return `<polygon points="${pts(topFace(s, 0))}" fill="var(--shadow)" opacity="${a.toFixed(2)}" filter="url(#blur)"/>`;
}

function deco(o, z0, z1) {
  const hw = o.w / 2, hd = o.d / 2;
  let s = '';
  if (o.deco === 'server') {
    for (const fr of [0.28, 0.55, 0.82]) {
      const z = z1 - fr * o.h;
      s += `<polyline class="dl" points="${pts([proj(o.x + hw, o.y - hd * 0.8, z), proj(o.x + hw, o.y + hd * 0.8, z)])}"/>`;
      const [lx, ly] = proj(o.x + hw, o.y - hd * 0.6, z + o.h * 0.12);
      s += `<circle class="led${o.hot ? ' hot' : ''}" cx="${f(lx)}" cy="${f(ly)}" r="2"/>`;
    }
  } else if (o.deco === 'gpu') {
    for (const fr of [-0.25, 0, 0.25]) {
      s += `<polyline class="dl" points="${pts([proj(o.x + fr * o.w, o.y - hd * 0.8, z1), proj(o.x + fr * o.w, o.y + hd * 0.8, z1)])}"/>`;
      s += `<polyline class="dl" points="${pts([proj(o.x - hw * 0.8, o.y + fr * o.d, z1), proj(o.x + hw * 0.8, o.y + fr * o.d, z1)])}"/>`;
    }
    s += `<polygon class="chip" points="${pts(topFace({ x: o.x, y: o.y, w: o.w * 0.34, d: o.d * 0.34 }, z1))}"/>`;
  } else if (o.deco === 'parcel') {
    s += `<polyline class="tape" points="${pts([proj(o.x, o.y - hd, z1), proj(o.x, o.y + hd, z1), proj(o.x, o.y + hd, z0 + o.h * 0.35)])}"/>`;
  } else if (o.deco === 'screen') {
    const inset = (x, y, z) => proj(x, y, z);
    const m = 0.1;
    s += `<polygon class="scr" points="${pts([inset(o.x - hw + m, o.y + hd, z1 - m), inset(o.x + hw - m, o.y + hd, z1 - m), inset(o.x + hw - m, o.y + hd, z0 + m), inset(o.x - hw + m, o.y + hd, z0 + m)])}"/>`;
    for (const fr of [0.3, 0.5, 0.7]) s += `<polyline class="scrl" points="${pts([proj(o.x - hw + 0.2, o.y + hd, z1 - fr * o.h), proj(o.x + hw - 0.25, o.y + hd, z1 - fr * o.h)])}"/>`;
  } else if (o.deco === 'windows') {
    for (let i = 0; i < 4; i++) {
      const xa = o.x - hw + ((i + 0.12) / 4) * o.w, xb = o.x - hw + ((i + 0.88) / 4) * o.w, za = z0 + o.h * 0.38, zb = z1 - o.h * 0.1;
      s += `<polygon class="win" points="${pts([proj(xa, o.y + hd, zb), proj(xb, o.y + hd, zb), proj(xb, o.y + hd, za), proj(xa, o.y + hd, za)])}"/>`;
    }
  } else if (o.deco === 'dash') {
    const m = 0.08;
    s += `<polygon class="scr" points="${pts([proj(o.x - hw + m, o.y + hd, z1 - m), proj(o.x + hw - m, o.y + hd, z1 - m), proj(o.x + hw - m, o.y + hd, z0 + m), proj(o.x - hw + m, o.y + hd, z0 + m)])}"/>`;
    const hs = o.trend === 'down' ? [0.3, 0.45, 0.6, 0.78] : [0.78, 0.6, 0.45, 0.3];
    hs.forEach((hh, i) => {
      const xa = o.x - hw + 0.18 + i * ((o.w - 0.36) / 4), xb = xa + (o.w - 0.36) / 4 * 0.6, zb = z0 + 0.14, zt = zb + hh * (o.h - 0.3);
      s += `<polygon class="dbar${o.trend === 'down' ? ' bad' : ''}" points="${pts([proj(xa, o.y + hd, zt), proj(xb, o.y + hd, zt), proj(xb, o.y + hd, zb), proj(xa, o.y + hd, zb)])}"/>`;
    });
  } else if (o.deco === 'doc') {
    for (const fr of [-0.25, 0, 0.25]) s += `<polyline class="dl" points="${pts([proj(o.x - hw * 0.7, o.y + fr * o.d, z1), proj(o.x + hw * 0.7, o.y + fr * o.d, z1)])}"/>`;
  } else if (o.deco === 'shop') {
    const zt = z1, zb = z1 - o.h * 0.28;
    const n = 6;
    for (let i = 0; i < n; i += 2) {
      const xa = o.x - hw + (i / n) * o.w, xb = o.x - hw + ((i + 1) / n) * o.w;
      s += `<polygon class="awn" points="${pts([proj(xa, o.y + hd, zt), proj(xb, o.y + hd, zt), proj(xb, o.y + hd, zb), proj(xa, o.y + hd, zb)])}"/>`;
    }
    s += `<polygon class="scr" points="${pts([proj(o.x - hw * 0.5, o.y + hd, z0 + o.h * 0.55), proj(o.x + hw * 0.1, o.y + hd, z0 + o.h * 0.55), proj(o.x + hw * 0.1, o.y + hd, z0), proj(o.x - hw * 0.5, o.y + hd, z0)])}"/>`;
  }
  return s;
}

function drawBox(o, id) {
  if (o.o <= 0.01) return '';
  const hw = o.w / 2, hd = o.d / 2, z0 = o.z, z1 = o.z + o.h;
  const t = topFace(o, z1);
  const r = [proj(o.x + hw, o.y - hd, z1), proj(o.x + hw, o.y + hd, z1), proj(o.x + hw, o.y + hd, z0), proj(o.x + hw, o.y - hd, z0)];
  const l = [proj(o.x - hw, o.y + hd, z1), proj(o.x + hw, o.y + hd, z1), proj(o.x + hw, o.y + hd, z0), proj(o.x - hw, o.y + hd, z0)];
  let s = `<g class="obj c-${o.c}${o.hl ? ' is-hl' : ''}${o.pick ? ' pickable' : ''}" opacity="${o.o.toFixed(3)}"${o.pick ? ` data-pick="${esc(id)}"` : ''}>`;
  s += `<polygon class="fl" points="${pts(l)}"/><polygon class="fr" points="${pts(r)}"/><polygon class="ft" points="${pts(t)}"/>`;
  s += `<polyline class="edge" points="${pts([t[3], t[0], t[1]])}"/>`;
  s += deco(o, z0, z1);
  if (o.hl) s += `<polygon class="hl" points="${pts(t)}"/>`;
  if (o.t !== undefined && o.t !== '') {
    const [cx, cy] = proj(o.x, o.y, z1);
    const fs = o.fs || Math.min(15, 8.5 + 3.6 * Math.min(o.w, o.d));
    const tl = lines(o.t, cx, cy + fs * 0.35, fs, 'lbl');
    if (o.top) SUBS.push(`<g class="c-${o.c}" opacity="${o.o.toFixed(3)}">${tl}</g>`); else s += tl;
  }
  if (o.sub) {
    const [sx, sy] = proj(o.x + hw * 0.3, o.y + hd + 0.5, z0);
    SUBS.push(`<g opacity="${o.o.toFixed(3)}">${lines(o.sub, sx, sy + 6, 10.5, 'sub')}</g>`);
  }
  return s + '</g>';
}

function drawVan(o, id) {
  const body = { ...o, k: 'box', w: 1.5, d: 0.8, h: 0.8, t: o.t, sub: '' };
  const cab = { ...o, k: 'box', x: o.x + 1.08, w: 0.62, d: 0.8, h: 0.58, t: '', sub: '', deco: 'screen' };
  let s = drawBox(body, id) + drawBox(cab, id);
  for (const wx of [o.x - 0.4, o.x + 1.05]) {
    const [cx, cy] = proj(wx, o.y + 0.4, o.z + 0.1);
    s += `<g opacity="${o.o.toFixed(3)}"><ellipse class="wheel" cx="${f(cx)}" cy="${f(cy)}" rx="5.5" ry="6.5"/></g>`;
  }
  if (o.sub) { const [sx, sy] = proj(o.x + 0.4, o.y + 0.9, o.z); SUBS.push(`<g opacity="${o.o.toFixed(3)}">${lines(o.sub, sx, sy + 6, 10.5, 'sub')}</g>`); }
  return s;
}

function drawOrb(o, id) {
  if (o.o <= 0.01) return '';
  const [cx, cy] = proj(o.x, o.y, o.z + o.r);
  const R = o.r * U;
  let s = `<g class="obj c-${o.c}${o.hl ? ' is-hl' : ''}${o.pick ? ' pickable' : ''}" opacity="${o.o.toFixed(3)}"${o.pick ? ` data-pick="${esc(id)}"` : ''}>`;
  s += `<circle class="orb" cx="${f(cx)}" cy="${f(cy)}" r="${f(R)}"/>`;
  s += `<circle cx="${f(cx - R * 0.32)}" cy="${f(cy - R * 0.34)}" r="${f(R * 0.3)}" fill="#fff" opacity=".55"/>`;
  if (o.hl) s += `<circle class="hl" cx="${f(cx)}" cy="${f(cy)}" r="${f(R + 3)}"/>`;
  if (o.t) s += lines(o.t, cx, cy + (o.fs || 11) * 0.35, o.fs || 11, 'lbl');
  if (o.sub) SUBS.push(`<g opacity="${o.o.toFixed(3)}">${lines(o.sub, cx, cy + R + 13, 10.5, 'sub')}</g>`);
  return s + '</g>';
}

function drawCyl(o, id) {
  if (o.o <= 0.01) return '';
  const [bx, by] = proj(o.x, o.y, o.z);
  const rx = o.r * U, ry = rx * 0.5, H = o.h * U;
  let s = `<g class="obj c-${o.c}${o.hl ? ' is-hl' : ''}${o.pick ? ' pickable' : ''}" opacity="${o.o.toFixed(3)}"${o.pick ? ` data-pick="${esc(id)}"` : ''}>`;
  s += `<ellipse class="fl" cx="${f(bx)}" cy="${f(by)}" rx="${f(rx)}" ry="${f(ry)}"/>`;
  s += `<rect class="fr" x="${f(bx - rx)}" y="${f(by - H)}" width="${f(2 * rx)}" height="${f(H)}" stroke="none"/>`;
  s += `<path class="band" d="M${f(bx - rx)},${f(by - H / 2)} A${f(rx)},${f(ry)} 0 0 0 ${f(bx + rx)},${f(by - H / 2)}"/>`;
  s += `<line class="side" x1="${f(bx - rx)}" y1="${f(by - H)}" x2="${f(bx - rx)}" y2="${f(by)}"/><line class="side" x1="${f(bx + rx)}" y1="${f(by - H)}" x2="${f(bx + rx)}" y2="${f(by)}"/>`;
  s += `<ellipse class="ft" cx="${f(bx)}" cy="${f(by - H)}" rx="${f(rx)}" ry="${f(ry)}"/>`;
  if (o.hl) s += `<ellipse class="hl" cx="${f(bx)}" cy="${f(by - H)}" rx="${f(rx + 3)}" ry="${f(ry + 2)}"/>`;
  if (o.t) s += lines(o.t, bx, by - H + 4, o.fs || 10.5, 'lbl');
  if (o.sub) SUBS.push(`<g opacity="${o.o.toFixed(3)}">${lines(o.sub, bx, by + ry + 13, 10.5, 'sub')}</g>`);
  return s + '</g>';
}

function drawPerson(o, id) {
  if (o.o <= 0.01) return '';
  const [bx, by0] = proj(o.x, o.y, o.z);
  const k = o.s, dy = o.sit ? 8 * k : 0, by = by0 + dy;
  const skin = SKIN[o.sk % SKIN.length];
  let s = `<g class="obj person c-${o.c}${o.pick ? ' pickable' : ''}" opacity="${o.o.toFixed(3)}"${o.pick ? ` data-pick="${esc(id)}"` : ''}>`;
  if (o.hl) s += `<ellipse class="hl" cx="${f(bx)}" cy="${f(by0)}" rx="${f(15 * k)}" ry="${f(6.5 * k)}"/>`;
  const legH = o.sit ? 9 : 17;
  s += `<rect class="pants" x="${f(bx - 6 * k)}" y="${f(by0 - legH * k)}" width="${f(5 * k)}" height="${f(legH * k)}" rx="${f(2 * k)}"/>`;
  s += `<rect class="pants" x="${f(bx + 1 * k)}" y="${f(by0 - legH * k)}" width="${f(5 * k)}" height="${f(legH * k)}" rx="${f(2 * k)}"/>`;
  if (o.bag) s += `<rect class="bag" x="${f(bx - 13 * k)}" y="${f(by - 34 * k)}" width="${f(7 * k)}" height="${f(14 * k)}" rx="${f(2.5 * k)}"/>`;
  s += `<rect class="fr" x="${f(bx - 9.5 * k)}" y="${f(by - 37 * k)}" width="${f(19 * k)}" height="${f(23 * k)}" rx="${f(7 * k)}"/>`;
  s += `<rect class="ft" x="${f(bx - 7 * k)}" y="${f(by - 34 * k)}" width="${f(5 * k)}" height="${f(15 * k)}" rx="${f(2.5 * k)}" stroke="none"/>`;
  // arms: shoulder → hand, by pose
  const sh = by - 33 * k;
  let L = [bx - 11 * k, by - 19 * k], R = [bx + 11 * k, by - 19 * k];
  if (o.hold === 'phone') R = [bx + 8.5 * k, by - 27 * k];
  if (o.hold === 'parcel') { L = [bx - 7 * k, by - 25 * k]; R = [bx + 7 * k, by - 25 * k]; }
  if (o.pose === 'wave') R = [bx + 15 * k, by - 52 * k];
  if (o.pose === 'think') R = [bx + 3.5 * k, by - 40.5 * k];
  if (o.pose === 'type') { L = [bx - 4 * k, by - 22 * k]; R = [bx + 6 * k, by - 22 * k]; }
  const arm = (sx, [hx, hy]) => `<path class="arm" d="M${f(sx)},${f(sh)} Q${f((sx + hx) / 2 + (hx > sx ? 2 : -2) * k)},${f((sh + hy) / 2 + 2 * k)} ${f(hx)},${f(hy)}" stroke-width="${f(4 * k)}"/><circle cx="${f(hx)}" cy="${f(hy)}" r="${f(1.9 * k)}" fill="${skin}"/>`;
  s += arm(bx - 8.2 * k, L) + arm(bx + 8.2 * k, R);
  s += `<circle cx="${f(bx)}" cy="${f(by - 45 * k)}" r="${f(8 * k)}" fill="${skin}" stroke="rgba(0,0,0,.18)" stroke-width=".6"/>`;
  s += `<path class="hair" d="M${f(bx - 8 * k)},${f(by - 45 * k)} A${f(8 * k)},${f(8 * k)} 0 0 1 ${f(bx + 8 * k)},${f(by - 45 * k)} Q${f(bx)},${f(by - 49 * k)} ${f(bx - 8 * k)},${f(by - 45 * k)}Z"/>`;
  if (o.long) s += `<path class="hair" d="M${f(bx - 8 * k)},${f(by - 46 * k)} Q${f(bx - 10.5 * k)},${f(by - 38 * k)} ${f(bx - 7.5 * k)},${f(by - 33 * k)} L${f(bx - 5.5 * k)},${f(by - 41 * k)}Z"/><path class="hair" d="M${f(bx + 8 * k)},${f(by - 46 * k)} Q${f(bx + 10.5 * k)},${f(by - 38 * k)} ${f(bx + 7.5 * k)},${f(by - 33 * k)} L${f(bx + 5.5 * k)},${f(by - 41 * k)}Z"/>`;
  if (k >= 1.0) s += face(bx, by, k, o.mood || 'neutral');
  if (o.hold === 'phone') s += `<rect x="${f(bx + 6.5 * k)}" y="${f(by - 34 * k)}" width="${f(5 * k)}" height="${f(8.5 * k)}" rx="${f(1.2 * k)}" class="hphone"/>`;
  if (o.hold === 'parcel') s += `<rect x="${f(bx - 8 * k)}" y="${f(by - 31 * k)}" width="${f(16 * k)}" height="${f(11 * k)}" rx="1.5" class="hparcel"/><line x1="${f(bx)}" y1="${f(by - 31 * k)}" x2="${f(bx)}" y2="${f(by - 20 * k)}" class="tape"/>`;
  if (o.t) {
    const w = String(o.t).length * 6.4 + 14;
    s += `<rect class="tag" x="${f(bx - w / 2)}" y="${f(by - 70 * k)}" width="${f(w)}" height="17" rx="8.5"/>`;
    s += `<text class="tagtx" x="${f(bx)}" y="${f(by - 70 * k + 12)}" text-anchor="middle">${esc(o.t)}</text>`;
  }
  if (o.sub) SUBS.push(`<g opacity="${o.o.toFixed(3)}">${lines(o.sub, bx, by0 + 15, 10.5, 'sub')}</g>`);
  return s + '</g>';
}

// Expressions: neutral happy excited relieved sad worried frustrated surprised thinking
function face(bx, by, k, mood) {
  const ey = by - 45.6 * k, my = by - 41.4 * k, ex = 2.8 * k;
  let s = '';
  const brow = (x1, y1, x2, y2) => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" class="mouth"/>`;
  const smile = (c, w = 2.8) => `<path d="M${f(bx - w * k)},${f(my)} Q${f(bx)},${f(my + c * k)} ${f(bx + w * k)},${f(my)}" class="mouth"/>`;
  if (mood === 'relieved' || mood === 'excited') {
    // closed, curved happy eyes
    for (const sx of [-1, 1]) s += `<path d="M${f(bx + sx * ex - 1.3 * k)},${f(ey + 0.4 * k)} Q${f(bx + sx * ex)},${f(ey - 1.2 * k)} ${f(bx + sx * ex + 1.3 * k)},${f(ey + 0.4 * k)}" class="mouth"/>`;
  } else {
    const look = mood === 'thinking' ? [0.9 * k, -0.9 * k] : [0, 0];
    const r = mood === 'surprised' ? 1.35 * k : 1.05 * k;
    for (const sx of [-1, 1]) s += `<circle cx="${f(bx + sx * ex + look[0])}" cy="${f(ey + look[1])}" r="${f(r)}" class="eye"/>`;
  }
  if (mood === 'happy' || mood === 'relieved') s += smile(2.6);
  else if (mood === 'excited') s += `<path d="M${f(bx - 3 * k)},${f(my - 0.6 * k)} Q${f(bx)},${f(my + 4 * k)} ${f(bx + 3 * k)},${f(my - 0.6 * k)}Z" class="mouthO"/>`;
  else if (mood === 'sad' || mood === 'worried') s += smile(-2.2);
  else if (mood === 'frustrated') s += smile(-1.2, 2.4);
  else if (mood === 'surprised') s += `<ellipse cx="${f(bx)}" cy="${f(my)}" rx="${f(1.3 * k)}" ry="${f(1.8 * k)}" class="mouthO"/>`;
  else if (mood === 'thinking') s += `<line x1="${f(bx + 0.2 * k)}" y1="${f(my)}" x2="${f(bx + 2.8 * k)}" y2="${f(my - 0.4 * k)}" class="mouth"/>`;
  else s += `<line x1="${f(bx - 2.2 * k)}" y1="${f(my)}" x2="${f(bx + 2.2 * k)}" y2="${f(my)}" class="mouth"/>`;
  // eyebrows
  const by_ = ey - 3 * k;
  if (mood === 'worried' || mood === 'sad') s += brow(bx - 4.2 * k, by_ + 0.4 * k, bx - 1.6 * k, by_ - 0.6 * k) + brow(bx + 1.6 * k, by_ - 0.6 * k, bx + 4.2 * k, by_ + 0.4 * k);
  if (mood === 'frustrated') s += brow(bx - 4.2 * k, by_ - 0.6 * k, bx - 1.4 * k, by_ + 0.7 * k) + brow(bx + 1.4 * k, by_ + 0.7 * k, bx + 4.2 * k, by_ - 0.6 * k);
  if (mood === 'surprised') s += brow(bx - 4 * k, by_ - 1 * k, bx - 1.6 * k, by_ - 1.4 * k) + brow(bx + 1.6 * k, by_ - 1.4 * k, bx + 4 * k, by_ - 1 * k);
  if (mood === 'thinking') s += brow(bx + 1.4 * k, by_ - 1.4 * k, bx + 4.2 * k, by_ - 0.6 * k);
  return s;
}

function drawScooter(o, id) {
  let s = drawBox({ ...o, k: 'box', z: o.z + 0.22, w: 1.1, d: 0.42, h: 0.34, t: '', sub: '' }, id);
  s += drawBox({ ...o, k: 'box', x: o.x - 0.18, z: o.z + 0.56, w: 0.5, d: 0.38, h: 0.1, c: 'ink', t: '', sub: '' }, id);
  s += drawBox({ ...o, k: 'box', x: o.x + 0.5, z: o.z + 0.56, w: 0.1, d: 0.1, h: 0.5, c: 'slate', t: '', sub: '' }, id);
  for (const wx of [o.x - 0.42, o.x + 0.5]) { const [cx, cy] = proj(wx, o.y + 0.22, o.z + 0.16); s += `<g opacity="${o.o.toFixed(3)}"><ellipse class="wheel" cx="${f(cx)}" cy="${f(cy)}" rx="5" ry="6"/></g>`; }
  return s;
}

function bubbleBox(o) {
  const [ax, ay] = proj(o.x, o.y, o.z);
  const parts = String(o.t || '').split('\n');
  const fs = o.fs;
  const w = Math.max(...parts.map((p) => p.length)) * fs * 0.54 + 22;
  const h = parts.length * fs * 1.3 + 14;
  const left = o.side === 'left';
  const x = left ? ax - 10 - w : ax + 10;
  return { ax, ay, x, y: ay - h - 12, w, h, parts, fs, left };
}
function drawBubble(o) {
  if (o.o <= 0.01 || !o.t) return '';
  const b = bubbleBox(o), fs = b.fs;
  const tail = b.left
    ? `${f(b.x + b.w - 26)},${f(b.y + b.h - 1)} ${f(b.x + b.w - 12)},${f(b.y + b.h - 1)} ${f(b.ax - 2)},${f(b.ay - 2)}`
    : `${f(b.x + 12)},${f(b.y + b.h - 1)} ${f(b.x + 26)},${f(b.y + b.h - 1)} ${f(b.ax + 2)},${f(b.ay - 2)}`;
  let s = `<g class="bub c-${o.c}" opacity="${o.o.toFixed(3)}">`;
  s += `<polygon class="bubt" points="${tail}"/><rect class="bubr" x="${f(b.x)}" y="${f(b.y)}" width="${f(b.w)}" height="${f(b.h)}" rx="10"/>`;
  s += `<polygon class="bubt2" points="${tail}"/>`;
  s += b.parts.map((p, i) => `<text class="bubtx" x="${f(b.x + 11)}" y="${f(b.y + 7 + fs + i * fs * 1.3)}" font-size="${fs}">${esc(p)}</text>`).join('');
  return s + '</g>';
}

function drawText(o) {
  if (o.o <= 0.01 || !o.t) return '';
  const [x, y] = proj(o.x, o.y, o.z);
  const fs = o.fs || 13;
  const cls = `tx tc-${o.c}${o.b ? ' b' : ''}`;
  return `<g opacity="${o.o.toFixed(3)}">${lines(o.t, x, y, fs, cls, `text-anchor="${o.a || 'middle'}"`)}</g>`;
}

function drawZone(o) {
  if (o.o <= 0.01) return '';
  const t = topFace(o, o.z);
  let s = `<g class="c-${o.c}" opacity="${o.o.toFixed(3)}"><polygon class="zone" points="${pts(t)}"/>`;
  if (o.t) { const [x, y] = t[0]; s += `<text class="zlbl" x="${f(x)}" y="${f(y - 8)}" text-anchor="middle">${esc(o.t)}</text>`; }
  return s + '</g>';
}

function anchor(o) {
  if (o.k === 'orb') return { p: proj(o.x, o.y, o.z + o.r), r: o.r * U + 5 };
  if (o.k === 'text' || o.k === 'bubble') return { p: proj(o.x, o.y, o.z), r: 10 };
  if (o.k === 'person') return { p: proj(o.x, o.y, o.z + 0.8 * o.s), r: 16 * o.s };
  if (o.k === 'cyl') return { p: proj(o.x, o.y, o.z + o.h / 2), r: o.r * U + 6 };
  if (o.k === 'van') return { p: proj(o.x + 0.3, o.y, o.z + 0.4), r: 34 };
  const h = o.h ?? 0;
  return { p: proj(o.x, o.y, o.z + h / 2), r: ((o.w + o.d) / 2) * CX * 0.62 + 5 };
}

function drawLink(L, objs) {
  const A = objs[L.a], B = objs[L.b];
  if (!A || !B || L.o <= 0.01) return '';
  const a = anchor(A), b = anchor(B);
  const [x1, y1] = a.p, [x2, y2] = b.p;
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
  const bend = (L.bend || 0) * U;
  const mx = (x1 + x2) / 2 - (dy / len) * bend, my = (y1 + y2) / 2 + (dx / len) * bend;
  const d1 = Math.hypot(mx - x1, my - y1) || 1, d2 = Math.hypot(x2 - mx, y2 - my) || 1;
  const sx = x1 + ((mx - x1) / d1) * a.r, sy = y1 + ((my - y1) / d1) * a.r;
  const ex = x2 - ((x2 - mx) / d2) * (b.r + (L.na ? 0 : 3)), ey = y2 - ((y2 - my) / d2) * (b.r + (L.na ? 0 : 3));
  const d = `M${f(sx)},${f(sy)} Q${f(mx)},${f(my)} ${f(ex)},${f(ey)}`;
  const sw = L.sw || 1.7, c = L.c || 'ink';
  let s = `<g class="lk lk-${c}" opacity="${L.o.toFixed(3)}">`;
  s += `<path d="${d}" stroke-width="${f(sw)}" ${L.dash ? 'stroke-dasharray="4 4"' : ''} ${L.na ? '' : `marker-end="url(#ah-${c})"`}/>`;
  if (L.flow) s += `<path class="flow${L.fast ? ' fast' : ''}" d="${d}" stroke-width="${f(Math.max(2.4, sw + 0.8))}"/>`;
  if (L.t) {
    const lx = 0.25 * sx + 0.5 * mx + 0.25 * ex, ly = 0.25 * sy + 0.5 * my + 0.25 * ey;
    const w = String(L.t).length * 6.1 + 12;
    s += `<rect class="pill" x="${f(lx - w / 2)}" y="${f(ly - 9)}" width="${f(w)}" height="18" rx="9"/>`;
    s += `<text class="pilltx" x="${f(lx)}" y="${f(ly + 3.8)}" text-anchor="middle">${esc(L.t)}</text>`;
  }
  return s + '</g>';
}

const COLORS = ['ink', 'blue', 'violet', 'teal', 'coral', 'amber', 'green', 'slate', 'muted'];
export const DEFS = `<defs><filter id="blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>${COLORS.map(
  (c) => `<marker id="ah-${c}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="lk-${c} ah" d="M0,0 L10,5 L0,10 z"/></marker>`
).join('')}</defs>`;

const SOLID = new Set(['box', 'tile', 'orb', 'cyl', 'person', 'van', 'scooter']);
const depth = (o) => o.x + o.y + o.z * 0.3 + (o.k === 'van' ? 0.6 : 0);

export function render(state) {
  const entries = Object.entries(state.o);
  const under = entries.filter(([, o]) => o.k === 'zone' || o.k === 'slab');
  const solid = entries.filter(([, o]) => SOLID.has(o.k)).sort((a, b) => depth(a[1]) - depth(b[1]));
  SUBS = []; BUBS = [];
  let s = '';
  for (const [id, o] of under) s += o.k === 'zone' ? drawZone(o) : drawShadow(o) + drawBox(o, id);
  for (const [, o] of solid) s += drawShadow(o);
  for (const [id, o] of solid) {
    s += o.k === 'orb' ? drawOrb(o, id) : o.k === 'cyl' ? drawCyl(o, id) : o.k === 'person' ? drawPerson(o, id) : o.k === 'van' ? drawVan(o, id) : o.k === 'scooter' ? drawScooter(o, id) : drawBox(o, id);
  }
  for (const L of Object.values(state.l)) s += drawLink(L, state.o);
  s += SUBS.join('');
  for (const [, o] of entries) if (o.k === 'text') s += drawText(o);
  for (const [, o] of entries) if (o.k === 'bubble') s += drawBubble(o);
  return s;
}

// Fold steps into complete states. `s` objects and `l` links merge into the previous step;
// null removes; `clear: true` starts fresh; `focus: [ids]` aims the camera.
export function buildStates(steps) {
  const out = [];
  let o = {}, l = {};
  for (const st of steps) {
    if (st.clear) { o = {}; l = {}; }
    o = { ...o }; l = { ...l };
    for (const [id, v] of Object.entries(st.s || {})) { if (v === null) delete o[id]; else o[id] = { ...(o[id] || {}), ...v }; }
    for (const [id, v] of Object.entries(st.l || {})) { if (v === null) delete l[id]; else l[id] = { ...(l[id] || {}), ...v }; }
    const no = {};
    for (const [id, v] of Object.entries(o)) no[id] = norm(v);
    const nl = {};
    for (const [id, v] of Object.entries(l)) if (no[v.a] && no[v.b]) nl[id] = { o: 1, sw: 1.7, bend: 0, ...v };
    out.push({ o: no, l: nl, focus: st.focus });
  }
  return out;
}

export function bounds(states, only) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const add = (x, y) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); };
  for (const st of states) {
    for (const [id, o] of Object.entries(st.o)) {
      if (only && !only.includes(id)) continue;
      if (o.k === 'text') {
        const [x, y] = proj(o.x, o.y, o.z), fs = o.fs || 13, n = String(o.t || '').split('\n');
        const w = Math.max(...n.map((s) => s.length)) * fs * 0.56;
        const ax = o.a === 'start' ? 0 : o.a === 'end' ? -w : -w / 2;
        add(x + ax, y - fs * n.length * 0.7); add(x + ax + w, y + fs * n.length * 0.6);
        continue;
      }
      if (o.k === 'bubble') { if (!o.t) continue; const b = bubbleBox(o); add(b.x, b.y); add(b.x + b.w, b.ay); continue; }
      if (o.k === 'orb') { const [x, y] = proj(o.x, o.y, o.z + o.r); add(x - o.r * U, y - o.r * U); add(x + o.r * U, y + o.r * U + (o.sub ? 18 : 0)); continue; }
      if (o.k === 'person') { const [x, y] = proj(o.x, o.y, o.z); add(x - 16 * o.s, y - (o.t ? 72 : 56) * o.s); add(x + 16 * o.s, y + (o.sub ? 24 : 8)); if (o.t) { const w = o.t.length * 3.4 + 8; add(x - w, y); add(x + w, y); } continue; }
      if (o.k === 'cyl') { const [x, y] = proj(o.x, o.y, o.z); add(x - o.r * U, y - o.h * U - o.r * U * 0.5); add(x + o.r * U, y + o.r * U * 0.5 + (o.sub ? 20 : 0)); continue; }
      const w = o.k === 'van' ? 2.3 : o.k === 'scooter' ? 1.3 : o.w, d = o.k === 'van' || o.k === 'scooter' ? 0.8 : o.d, cx = o.k === 'van' ? o.x + 0.35 : o.x, h = o.k === 'zone' ? 0 : o.k === 'van' ? 0.8 : o.k === 'scooter' ? 1.1 : o.h;
      for (const [dx, dy] of [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]])
        for (const z of [o.z, o.z + h]) { const [x, y] = proj(cx + dx, o.y + dy, z); add(x, y); }
      if (o.k === 'zone' && o.t) { const [x, y] = proj(o.x - w / 2, o.y - d / 2, o.z); add(x - o.t.length * 3.6, y - 20); add(x + o.t.length * 3.6, y); }
      if (o.sub) { const [x, y] = proj(o.x + (w / 2) * 0.3, o.y + d / 2 + 0.5, o.z); add(x - o.sub.length * 3.2, y); add(x + o.sub.length * 3.2, y + 22); }
    }
  }
  if (!isFinite(x0)) return [-100, -60, 200, 120];
  const p = 22;
  let w = x1 - x0 + p * 2, h = y1 - y0 + p * 2, vx = x0 - p, vy = y0 - p;
  if (w / h > 2.2) { const nh = w / 2.2; vy -= (nh - h) / 2; h = nh; }
  if (w / h < 1.2) { const nw = h * 1.2; vx -= (nw - w) / 2; w = nw; }
  return [vx, vy, w, h].map(f);
}

export class Scene {
  constructor(svg) {
    this.svg = svg;
    this.svg.innerHTML = DEFS + '<g class="world"></g>';
    this.g = this.svg.querySelector('.world');
    this.drawn = { o: {}, l: {} };
    this.vb = null;
    this.raf = 0;
  }
  frame(vb) { this.vb = vb; this.svg.setAttribute('viewBox', vb.join(' ')); }
  reset() { cancelAnimationFrame(this.raf); this.drawn = { o: {}, l: {} }; this.g.innerHTML = ''; }
  show(next, opts = {}) {
    cancelAnimationFrame(this.raf);
    const from = this.drawn, op = [], lp = [];
    for (const id of new Set([...Object.keys(from.o), ...Object.keys(next.o)])) {
      const a = from.o[id], b = next.o[id];
      if (a && b) op.push([id, a, b, false]);
      else if (b) op.push([id, { ...b, o: 0, z: b.z + (['text', 'zone', 'bubble'].includes(b.k) ? 0 : 0.6) }, b, false]);
      else op.push([id, a, { ...a, o: 0 }, true]);
    }
    for (const id of new Set([...Object.keys(from.l), ...Object.keys(next.l)])) {
      const a = from.l[id], b = next.l[id];
      if (a && b) lp.push([id, a, b, false]);
      else if (b) lp.push([id, { ...b, o: 0 }, b, false]);
      else lp.push([id, a, { ...a, o: 0 }, true]);
    }
    const vbFrom = this.vb, vbTo = opts.vb || this.vb;
    const dur = opts.instant || reduced() ? 0 : opts.dur ?? 700;
    const t0 = performance.now();
    const tick = (now) => {
      const p = dur ? ease(Math.min(1, (now - t0) / dur)) : 1;
      const st = { o: {}, l: {} };
      for (const [id, a, b, rm] of op) {
        if (rm && p >= 1) continue;
        const v = { ...(rm ? a : b) };
        for (const k of NUM) if (typeof a[k] === 'number' && typeof b[k] === 'number') v[k] = a[k] + (b[k] - a[k]) * p;
        st.o[id] = v;
      }
      for (const [id, a, b, rm] of lp) {
        if (rm && p >= 1) continue;
        const v = { ...(rm ? a : b) };
        for (const k of LNUM) if (typeof a[k] === 'number' && typeof b[k] === 'number') v[k] = a[k] + (b[k] - a[k]) * p;
        st.l[id] = v;
      }
      if (vbFrom && vbTo && vbFrom !== vbTo) this.svg.setAttribute('viewBox', vbFrom.map((v, i) => f(v + (vbTo[i] - v) * p)).join(' '));
      this.drawn = st;
      this.g.innerHTML = render(st);
      if (p < 1) this.raf = requestAnimationFrame(tick);
      else if (vbTo) this.vb = vbTo;
    };
    if (!dur) tick(t0 + 1); else this.raf = requestAnimationFrame(tick);
  }
}
