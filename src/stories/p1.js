import { B, Tl, O, T, Z, S, P, Cy, Bub, L } from '../kit.js';

const CAST = [
  { id: 'priya', name: 'Priya', role: 'Loyal customer, Coimbatore', color: '#7c5cd6', quote: 'I ordered every month for three years. Two late deliveries in a row, and nobody even noticed.' },
  { id: 'hendry', name: 'Hendry', role: 'Delivery partner', color: '#c77d0a', quote: 'I know Priya’s street. When the hub is backed up, her parcels sit for a day and there is nothing I can do.' },
  { id: 'shon', name: 'Shon', role: 'Retention agent', color: '#0f9488', quote: 'I get a list of 5,000 names a week. Half of them ordered yesterday. I need to know who is really leaving, and why.' },
  { id: 'jones', name: 'Jones', role: 'Category manager', color: '#1d2bd8', quote: 'If the forecast misses the Diwali spike, we run out of sarees in the week that matters most.' },
];

const PRIYA = { c: 'violet', sk: 1, s: 1.5, t: 'Priya', long: 1, pick: 'priya' };
const HENDRY = { c: 'amber', sk: 2, s: 1.5, t: 'Hendry', pick: 'hendry' };
const SHON = { c: 'teal', sk: 0, s: 1.5, t: 'Shon', pick: 'shon' };
const JONES = { c: 'blue', sk: 1, s: 1.45, t: 'Jones', pick: 'jones' };

// ---------- places ----------
const home = (o = {}) => ({
  floor: S(3.4, 1.9, 7.6, 4.0, { c: 'slate' }),
  wall: { k: 'slab', x: 3.4, y: -0.25, w: 7.6, d: 0.16, h: 1.9, c: 'violet' },
  win: B('', 1.2, -0.12, { z: 0.7, c: 'blue', w: 1.6, d: 0.08, h: 0.9, deco: 'windows', noshadow: 1 }),
  cal: Tl(o.cal || 'orders: monthly', 5.4, -0.05, { z: 1.0, c: o.calC || 'slate', w: 1.9, d: 0.1, fs: 9.5, noshadow: 1 }),
  sofa: B('', 1.6, 2.6, { c: 'coral', w: 2.6, d: 1.0, h: 0.5 }),
  back: B('', 1.6, 3.1, { c: 'coral', w: 2.6, d: 0.3, h: 1.0 }),
  tbl: B('', 4.4, 2.2, { c: 'amber', w: 1.2, d: 0.8, h: 0.45 }),
  box: o.box ? B('', 4.4, 2.2, { z: 0.45, c: 'amber', w: 0.55, d: 0.45, h: 0.35, deco: 'parcel' }) : null,
  priya: P(2.9, 1.6, { ...PRIYA, mood: o.priya || 'happy', hold: o.hold || 'phone', pose: o.pose || '' }),
  plant: O(6.4, 3.3, { z: 0.4, r: 0.36, c: 'green' }), pot: B('', 6.4, 3.3, { c: 'coral', w: 0.42, d: 0.42, h: 0.4 }),
});

const hub = (o = {}) => {
  const s = {
    floor: S(3.6, 1.9, 8.4, 4.2, { c: 'slate' }),
    wall: { k: 'slab', x: 3.6, y: -0.25, w: 8.4, d: 0.16, h: 1.8, c: 'amber' },
    sign: T('Delivery hub · Peelamedu', 3.6, -0.25, { z: 2.25, fs: 12.5, b: 1, c: 'amber' }),
    belt: B('', 3.0, 1.0, { c: 'slate', w: 5.4, d: 0.7, h: 0.4 }),
    van: B('ShopSense', 6.8, 2.9, { c: 'teal', w: 1.8, d: 1.1, h: 1.0, fs: 9.5 }),
    hendry: P(4.9, 2.9, { ...HENDRY, mood: o.hendry || 'neutral', hold: 'parcel' }),
  };
  const n = o.pile ?? 4;
  for (let i = 0; i < n; i++) s['pk' + i] = B('', 0.8 + (i % 6) * 0.85, 1.0 - 0.0, { z: 0.4 + Math.floor(i / 6) * 0.35, c: 'amber', w: 0.55, d: 0.45, h: 0.32, deco: 'parcel' });
  if (o.late) s.lt = T(o.late, 1.6, 3.4, { z: 0.6, fs: 12.5, b: 1, c: 'coral' });
  return s;
};

const office = (o = {}) => ({
  floor: S(3.8, 1.9, 8.8, 4.0, { c: 'slate' }),
  wall: { k: 'slab', x: 3.8, y: -0.25, w: 8.8, d: 0.16, h: 2.0, c: 'teal' },
  scr: B('', 2.2, -0.12, { z: 0.6, c: 'ink', w: 2.6, d: 0.08, h: 1.15, deco: 'dash', trend: o.trend || 'down', noshadow: 1 }),
  scl: T(o.scl || 'Retention list · 5,000 calls', 2.2, 0.15, { z: 2.6, fs: 12, b: 1, c: o.sclC || 'teal' }),
  fc: B('', 6.4, -0.12, { z: 0.6, c: 'ink', w: 2.0, d: 0.08, h: 1.15, deco: 'dash', trend: 'up', noshadow: 1 }),
  fcl: T(o.fcl || 'Saree demand', 6.4, 0.15, { z: 2.6, fs: 12, b: 1, c: o.fclC || 'blue' }),
  desk: B('', 2.6, 2.3, { c: 'amber', w: 2.4, d: 1.0, h: 0.55 }),
  lap: B('', 2.6, 2.1, { z: 0.55, c: 'ink', w: 0.7, d: 0.06, h: 0.45, deco: 'screen', noshadow: 1 }),
  shon: P(2.6, 3.4, { ...SHON, mood: o.shon || 'neutral', hold: o.shonHold === undefined ? 'phone' : o.shonHold, pose: o.shonPose || '' }),
  jones: P(6.6, 2.6, { ...JONES, mood: o.jones || 'neutral', pose: o.jonesPose || '' }),
});

// ---------- data trail ----------
const trail = () => ({
  zone: Z('Priya’s data trail · last 120 days', 6.0, 2.6, 15.0, 9.0, { c: 'slate' }),
  ord: Cy('orders', 0, -0.6, { c: 'blue', r: 0.5, h: 0.75, fs: 9.5 }),
  del: Cy('deliveries', 0, 2.4, { c: 'blue', r: 0.5, h: 0.75, fs: 9 }),
  tix: Cy('tickets', 0, 5.4, { c: 'blue', r: 0.5, h: 0.75, fs: 9.5 }),
  g1: Tl('Aug ✓', 2.4, -0.6, { top: 1, c: 'blue', w: 1.2, d: 0.9, fs: 10 }), g2: Tl('Sep ✓', 3.8, -0.6, { top: 1, c: 'blue', w: 1.2, d: 0.9, fs: 10 }),
  g3: Tl('Oct late', 5.2, -0.6, { top: 1, c: 'coral', w: 1.2, d: 0.9, fs: 10 }), g4: Tl('no order', 6.7, -0.6, { top: 1, c: 'slate', w: 1.4, d: 0.9, fs: 10 }),
  d1: Tl('2 days late', 3.4, 2.4, { top: 1, c: 'coral', w: 1.8, d: 0.9, fs: 10 }), d2: Tl('3 days late', 5.6, 2.4, { top: 1, c: 'coral', w: 1.8, d: 0.9, fs: 10 }),
  t1: Tl('where is my parcel?', 4.2, 5.4, { top: 1, c: 'coral', w: 3.0, d: 0.9, fs: 10 }),
  old: Tl('old list:\ntop spenders', 12.2, 1.2, { top: 1, c: 'slate', w: 2.2, d: 1.3, fs: 10 }),
  shon: P(12.2, 5.0, { ...SHON, s: 1.3, mood: 'frustrated', hold: 'phone' }),
});
const trailL = () => ({
  a: L('ord', 'g1', { c: 'muted', na: 1 }), b: L('del', 'd1', { c: 'coral', na: 1 }), c: L('tix', 't1', { c: 'coral', na: 1 }),
  d: L('old', 'shon', { c: 'muted', dash: 1 }),
});

const system = (after) => after ? {
  zone: Z('churn and demand models', 4.4, 2.5, 12.2, 7.8, { c: 'violet' }),
  src: Cy('history', 0, 0.6, { c: 'blue', r: 0.6, h: 0.9, fs: 10 }),
  feat: B('features', 3.0, 0.6, { c: 'teal', w: 1.5, d: 1.2, h: 0.7, fs: 10.5 }),
  mdl: B('churn\nmodel', 5.8, 0.6, { c: 'brand', w: 1.3, d: 1.2, h: 1.0, fs: 10.5 }),
  list: Tl('top 5,000\n+ reasons', 8.8, 0.6, { top: 1, c: 'green', w: 2.0, d: 1.4, fs: 10.5 }),
  ws: Cy('weekly\nsales', 0, 4.4, { c: 'blue', r: 0.6, h: 0.9, fs: 9.5 }),
  fcm: B('demand\nforecast', 4.2, 4.4, { c: 'brand', w: 1.5, d: 1.2, h: 0.9, fs: 10 }),
  wh: Tl('stock up\nsarees', 8.4, 4.4, { top: 1, c: 'green', w: 2.0, d: 1.4, fs: 10.5 }),
} : trail();
const systemL = (after) => after ? {
  p1: L('src', 'feat', { flow: 1 }), p2: L('feat', 'mdl', { flow: 1 }), p3: L('mdl', 'list', { flow: 1, c: 'green' }),
  q1: L('ws', 'fcm', { flow: 1 }), q2: L('fcm', 'wh', { flow: 1, c: 'green' }),
} : trailL();

// ---------- device screens ----------
const OLD = [
  ['Arun K.', 'ordered yesterday', '#e8492b', 'bad'],
  ['Meena S.', 'big spender, active', '#e8492b', 'bad'],
  ['Priya R.', 'not on the list', '#8a8fa3', 'bad'],
];
const NEW = [
  ['Priya R. 52%', '2 late deliveries', '#7c5cd6', 'good'],
  ['Karthik V. 47%', 'open ticket', '#0f9488', 'good'],
  ['Lakshmi N. 44%', 'festival-only', '#8d6e3f', 'good'],
];

export default {
  id: 'p1-story', phase: 1, phaseName: 'Classical ML', time: '5 minutes',
  title: 'Story: Priya quietly stops ordering',
  sub: 'A loyal customer leaves after two late deliveries, and nobody notices. This story shows how a churn model and a demand forecast change that, and sets up the Phase 1 project.',
  shows: ['How churn shows up in data long before anyone notices', 'Why a ranked list with a reason beats a list of big spenders', 'The cases a model gets wrong: new customers, budgets and festivals'],
  toggle: ['Before models', 'After models'],
  device: { brand: 'ShopSense', icon: '☎' },
  cast: CAST,
  takeaways: [
    ['Predict, then act', 'A churn score is only useful if it reaches someone who can act on it, with a reason they understand.'],
    ['Measure the right thing', 'With 8% churn, a model that says "nobody leaves" is 92% accurate and useless. Ranking quality within the call budget is what counts.'],
    ['Plan for the gaps', 'New customers have no history, budgets are fixed and festivals distort behaviour. These become the project’s stress scenarios.'],
  ],
  beats: [
    {
      name: 'Beat 1 of 6 · Context', title: 'A loyal monthly customer',
      body: ['Priya in Coimbatore has ordered from ShopSense every month for three years: household items, a saree before each festival.', 'Hendry delivers on her street and knows her by name.'],
      note: 'The story starts with a person and a habit, the thing the business wants to keep.',
      frames: [
        { at: 0, mode: 'world', cut: true, s: home({ box: 1 }), cap: 'Priya’s home. Another ShopSense parcel has arrived on time.' },
        { at: 2400, s: { sp: Bub('Ordered again. Arrived\nthe next day, as always.', 2.9, 1.6, { z: 3.45, c: 'violet' }) }, cap: 'She orders every month and the parcels usually arrive the next day.' },
        { at: 5200, mode: 'world', cut: true, s: hub({ hendry: 'happy', pile: 3 }), cap: 'At the delivery hub, Hendry loads his van. Priya’s street is on his route.' },
      ],
    },
    {
      name: 'Beat 2 of 6 · Pain', title: 'Two late deliveries, then silence',
      body: ['In October the hub is backed up. Priya’s parcel arrives two days late, then her next one three days late. She raises a ticket and gets an automated reply.', 'She stops ordering. Nobody notices. The retention team spends the week calling people who ordered yesterday.'],
      note: 'The pain: a loyal customer lost silently, and a retention budget spent on the wrong people.',
      frames: [
        { at: 0, mode: 'world', cut: true, s: hub({ hendry: 'worried', pile: 12, late: 'backlog: 2–3 days' }), cap: 'October: parcels pile up at the hub.' },
        { at: 2400, s: { sh: Bub('Priya’s parcel is stuck\nagain. Nothing I can do.', 4.9, 2.9, { z: 3.45, c: 'amber' }) }, cap: 'Hendry sees Priya’s parcel stuck for a second time.' },
        { at: 5000, mode: 'world', cut: true, s: home({ priya: 'frustrated', cal: 'last order: 52 days ago', calC: 'coral' }), cap: 'Priya gives up and starts ordering elsewhere.' },
        { at: 7600, mode: 'phone', device: { q: 'Call list', rows: OLD, meta: 'Last month’s top spenders' }, cap: 'Meanwhile, Shon’s call list is last month’s big spenders. Priya is not on it.' },
      ],
    },
    {
      name: 'Beat 3 of 6 · Data trail', title: 'The signs were all there',
      body: ['Priya’s data shows the story clearly: monthly orders, then two late deliveries, a "where is my parcel" ticket, and a growing gap since her last order.', 'Turn on the data lens to see the signals a model can learn from.'],
      note: 'Churn is rarely sudden in the data. It shows as gaps, bad experiences and complaints, weeks before anyone acts.',
      lens: {
        s: {
          n0: T('gap: 30 → 52 days', 9.4, -0.6, { z: 0.2, fs: 12, c: 'violet', b: 1 }),
          n1: T('2 late in a row', 8.4, 2.4, { z: 0.2, fs: 12, c: 'coral', b: 1 }),
          n2: T('never resolved', 7.6, 5.4, { z: 0.2, fs: 12, c: 'coral', b: 1 }),
        },
      },
      frames: [
        { at: 0, mode: 'world', cut: true, s: trail(), cap: 'Priya’s last four months, from three tables ShopSense already has.' },
        { at: 2400, l: trailL(), cap: 'Orders stop after two late deliveries and an unresolved ticket.' },
        { at: 5000, s: { old: { hl: 1 } }, cap: 'But the call list is built from last month’s spending, so it misses her.' },
        { at: 7400, lensOn: true, cap: 'Data lens: the three signals a churn model can learn from.' },
      ],
    },
    {
      name: 'Beat 4 of 6 · AI in action', title: 'A ranked list with a reason, and a forecast',
      body: ['The Phase 1 project builds a churn model that scores every customer each night and ranks them. Shon’s list is now the 5,000 customers most likely to leave, each with a one-sentence reason.', 'A demand forecast, built from the same history, warns that saree demand will spike before Diwali, so the warehouse stocks up.'],
      note: 'Use Before models and After models to compare. The model does not call anyone; it tells Shon whom to call and why.',
      toggle: true,
      before: { s: system(false), l: systemL(false), device: { q: 'Call list', rows: OLD, meta: 'Last month’s top spenders' }, cap: 'Before: a list of big spenders, and no forecast.' },
      afterCap: 'After: a ranked list with reasons, and a 4-week demand forecast.',
      frames: [
        { at: 0, mode: 'split', cut: true, s: system(true), device: { q: 'Call list', rows: 'loading', meta: 'Scoring 1 million customers…' }, cap: 'Every night, features are computed from orders, deliveries and tickets.' },
        { at: 1800, l: { p1: L('src', 'feat', { flow: 1 }), p2: L('feat', 'mdl', { flow: 1 }) }, cap: 'The churn model scores every customer.' },
        { at: 4000, l: { p3: L('mdl', 'list', { flow: 1, c: 'green' }) }, s: { list: { hl: 1 } }, cap: 'The top 5,000, the call budget, go to Shon, each with a reason.' },
        { at: 6200, l: { q1: L('ws', 'fcm', { flow: 1 }), q2: L('fcm', 'wh', { flow: 1, c: 'green' }) }, s: { list: { hl: 0 }, wh: { hl: 1 } }, cap: 'The demand forecast sees the Diwali spike four weeks ahead.' },
        { at: 8400, device: { q: 'Call list', rows: NEW, meta: 'Ranked by churn risk', toast: ['Priya flagged', 'good'] }, cap: 'Priya is near the top: "two late deliveries; no order in 52 days".' },
      ],
    },
    {
      name: 'Beat 5 of 6 · Outcome', title: 'An apology, a guarantee, an order',
      body: ['Shon calls Priya, apologises for the late deliveries and offers next-day delivery guaranteed on her next order. She orders a saree for Diwali, and it is in stock because the forecast saw the spike.', 'The project’s target: reduce 90-day churn by 5%. The figures here are illustrative.'],
      note: 'Every story ends on a business outcome and a measurable target.',
      frames: [
        { at: 0, mode: 'world', cut: true, s: office({ shon: 'happy', scl: 'Ranked list · reasons', sclC: 'green', trend: 'up', fcl: 'Diwali spike: stocked', fclC: 'green', jones: 'happy' }), cap: 'At the ShopSense office, Shon works through the new list.' },
        { at: 2400, s: { ss: Bub('Sorry about the late parcels.\nNext-day delivery, guaranteed.', 2.6, 3.4, { z: 3.45, c: 'teal' }) }, cap: 'He calls Priya with the reason in front of him.' },
        { at: 5000, mode: 'world', cut: true, s: home({ priya: 'happy', box: 1, cal: 'ordered: Diwali saree', calC: 'green' }), cap: 'Priya orders again. The saree is in stock and arrives the next day.' },
        { at: 7600, mode: 'world', cut: true, s: office({ shon: 'excited', shonPose: 'wave', scl: '90-day churn ↓ toward −5%', sclC: 'green', trend: 'up', fcl: 'Forecast error −40%', fclC: 'green', jones: 'happy', jonesPose: 'wave' }), cap: 'Success metric for the project: 90-day churn down 5%, measured against a control group.' },
      ],
    },
    {
      name: 'Beat 6 of 6 · What can go wrong', title: 'New customers, a fixed budget, festival noise',
      body: ['40% of this month’s shoppers are new and have no history to score. The budget covers only 5,000 calls. And Diwali buying makes festival-only shoppers look loyal one month and "churned" the next.', 'These become the project’s stress scenarios: a model must handle them, not just score well on average.'],
      note: 'The bad day is designed for from the start: cold-start rules and festival features are L2 requirements; nightly scoring at scale is L3.',
      warn: true,
      frames: [
        { at: 0, mode: 'world', cut: true, s: office({ shon: 'thinking', scl: '40% new · no history', sclC: 'coral', trend: 'down', fcl: 'Festival distortion', fclC: 'coral', jones: 'worried' }), cap: 'Next month: a flood of new customers with no history.' },
        { at: 2600, s: { sj: Bub('Festival-only shoppers look\nlike churners in November.', 6.6, 2.6, { z: 3.35, c: 'blue' }) }, cap: 'Jones points out that Diwali shoppers distort recent behaviour.' },
        { at: 5400, s: { sj: null, ss: Bub('Only 5,000 calls. Who\ngoes first, and why?', 2.6, 3.4, { z: 3.45, c: 'teal' }) }, cap: 'Shon has a fixed budget: the threshold must fit 5,000 calls.' },
      ],
    },
  ],
};
