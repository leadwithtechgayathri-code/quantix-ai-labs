import { B, Tl, O, T, Z, S, P, Cy, Bub, L } from '../kit.js';

const CAST = [
  { id: 'jones', name: 'Jones', role: 'Category manager', color: '#0f9488', quote: 'I need one number I can act on before Diwali. Instead, every Monday turns into an argument about whose spreadsheet is right.' },
  { id: 'fin', name: 'Finance analyst', role: 'Finance team', color: '#7c5cd6', quote: 'My GMV comes straight from the order system. If Jones’s number is lower, I want to know exactly what he removed and why.' },
  { id: 'david', name: 'David', role: 'On-call engineer', color: '#1d2bd8', quote: 'When a number jumps 300% overnight, I need to know in minutes whether it is a festival or a file loaded twice.' },
];

const JONES = { c: 'teal', sk: 1, s: 1.55, t: 'Jones', pick: 'jones' };
const FIN = { c: 'violet', sk: 0, s: 1.55, t: 'Finance', long: 1, pick: 'fin' };

// ---------- places ----------
const room = (o = {}) => ({
  floor: S(3.8, 1.9, 8.8, 4.0, { c: 'slate' }),
  wall: { k: 'slab', x: 3.8, y: -0.25, w: 8.8, d: 0.16, h: 2.0, c: 'violet' },
  scrA: B('', 1.5, -0.12, { z: 0.6, c: 'ink', w: 2.1, d: 0.08, h: 1.15, deco: 'dash', trend: o.trendA || 'up', noshadow: 1 }),
  scrB: B('', 6.1, -0.12, { z: 0.6, c: 'ink', w: 2.1, d: 0.08, h: 1.15, deco: 'dash', trend: o.trendB || 'up', noshadow: 1 }),
  lA: T(o.labelA || 'Jones · GMV ₹1.42 Cr', 1.5, 0.15, { z: 2.35, fs: 12, b: 1, c: o.cA || 'teal' }),
  lB: T(o.labelB || 'Finance · GMV ₹1.74 Cr', 6.1, 0.15, { z: 2.35, fs: 12, b: 1, c: o.cB || 'coral' }),
  clock: O(3.8, -0.12, { z: 1.45, r: 0.22, c: 'slate', noshadow: 1 }),
  table: B('', 3.8, 2.1, { c: 'amber', w: 4.4, d: 1.3, h: 0.55 }),
  lap1: B('', 2.6, 2.0, { z: 0.55, c: 'ink', w: 0.6, d: 0.06, h: 0.4, deco: 'screen', noshadow: 1 }),
  lap2: B('', 5.0, 2.0, { z: 0.55, c: 'ink', w: 0.6, d: 0.06, h: 0.4, deco: 'screen', noshadow: 1 }),
  cup: { k: 'cyl', x: 3.8, y: 2.3, z: 0.55, r: 0.1, h: 0.16, c: 'coral' },
  head: P(3.8, 1.0, { c: 'blue', sk: 2, s: 1.35, mood: o.head || 'neutral' }),
  ops: P(2.4, 3.6, { c: 'amber', sk: 1, s: 1.35, mood: o.ops || 'neutral', long: 1 }),
  jones: P(0.4, 1.7, { ...JONES, mood: o.jones || 'neutral', pose: o.jp || '' }),
  fin: P(5.4, 1.0, { ...FIN, mood: o.fin || 'neutral', pose: o.fp || '' }),
  plant: O(8.0, 3.4, { z: 0.4, r: 0.38, c: 'green' }), pot: B('', 8.0, 3.4, { c: 'coral', w: 0.45, d: 0.45, h: 0.4 }),
});

const trail = () => ({
  zone: Z('Data today: two spreadsheets', 4.6, 2.5, 11.4, 7.6, { c: 'slate' }),
  ord: Cy('orders', 0, -0.6, { c: 'blue', r: 0.5, h: 0.75, fs: 9.5 }),
  can: Cy('cancels', 0, 1.2, { c: 'blue', r: 0.5, h: 0.75, fs: 9.5 }),
  ref: Cy('refunds', 0, 3.0, { c: 'blue', r: 0.5, h: 0.75, fs: 9.5 }),
  day: Tl('daily file\n1 Nov', 0, 4.8, { c: 'blue', w: 1.4, d: 1.0, fs: 9 }),
  day2: Tl('daily file\n1 Nov (again)', 1.4, 5.9, { c: 'coral', w: 1.7, d: 1.0, fs: 8.5 }),
  shA: Tl('Jones’s sheet\n₹1.42 Cr', 7.4, 0.4, { c: 'teal', w: 2.1, d: 1.4, fs: 10 }),
  shB: Tl('Finance sheet\n₹1.74 Cr', 7.4, 4.0, { c: 'violet', w: 2.1, d: 1.4, fs: 10 }),
  jones: P(10.0, 0.4, { ...JONES, s: 1.35, mood: 'worried' }),
  fin: P(10.0, 4.0, { ...FIN, s: 1.35, mood: 'frustrated' }),
});
const trailL = () => ({
  a1: L('ord', 'shA', { c: 'teal' }), a2: L('can', 'shA', { c: 'teal', dash: 1 }),
  b1: L('ord', 'shB', { c: 'violet' }), b2: L('can', 'shB', { c: 'violet' }), b3: L('day2', 'shB', { c: 'coral' }),
  r1: L('ref', 'shA', { c: 'muted', na: 1, dash: 1 }),
});

const pipeline = (after) => after ? {
  zone: Z('Sales Insights Pipeline', 3.8, 1.6, 8.0, 4.4, { c: 'teal' }),
  src: Cy('orders ·\ncancels ·\nrefunds', 0.2, 1.6, { c: 'blue', r: 0.62, h: 0.95, fs: 8.5 }),
  dup: Tl('daily file\n(again)', 0.2, 3.9, { c: 'coral', w: 1.3, d: 0.9, fs: 8.5 }),
  val: B('validate +\nde-duplicate', 2.6, 1.6, { c: 'teal', w: 1.4, d: 1.2, h: 0.8, fs: 9.5 }),
  def: B('KPI\ndefinitions', 4.9, 1.6, { c: 'teal', w: 1.3, d: 1.2, h: 0.8, fs: 9.5 }),
  rep: Tl('one report\nGMV ₹1.42 Cr', 7.4, 1.6, { c: 'green', w: 2.0, d: 1.3, fs: 10 }),
  q: Tl('quarantine:\n1 file rejected', 3.0, 4.1, { c: 'coral', w: 1.9, d: 0.9, fs: 8.5 }),
} : trail();
const pipelineL = (after) => after ? {
  p1: L('src', 'val', { flow: 1 }), p2: L('val', 'def', { flow: 1 }), p3: L('def', 'rep', { flow: 1, c: 'green' }),
  p4: L('dup', 'val', { c: 'coral', dash: 1 }), p5: L('val', 'q', { c: 'coral' }),
} : trailL();

const STALL = [[0.2, -0.4], [2.3, -0.4], [4.4, -0.4], [6.5, -0.4]];
const CROWD = [[0.4, 1.5], [1.6, 2.6], [2.8, 1.6], [3.9, 2.9], [5.0, 1.5], [6.2, 2.7], [7.0, 1.4], [1.0, 3.5], [4.6, 3.8], [6.8, 3.6], [2.4, 3.9], [3.4, 0.9]];
const market = (n, mood = 'happy') => {
  const o = { floor: S(3.6, 1.9, 8.6, 4.2, { c: 'slate' }) };
  STALL.forEach(([x, y], i) => { o['st' + i] = B('', x, y, { c: 'slate', w: 1.6, d: 1.0, h: 1.2, deco: 'shop' }); });
  for (let i = 0; i < 12; i++) o['lt' + i] = O(-0.9 + i * 0.8, -1.1, { z: 2.25 + (i % 2) * 0.12, r: 0.09, c: i % 3 ? 'amber' : 'coral', noshadow: 1 });
  for (let i = 0; i < 9; i++) o['dy' + i] = O(0 + i * 0.95, 4.7, { r: 0.08, c: 'amber', noshadow: 1 });
  o.ban = T('Diwali Mega Sale', 3.6, -1.1, { z: 2.75, fs: 14, b: 1, c: 'coral' });
  CROWD.forEach(([x, y], i) => {
    o['c' + i] = i < n ? P(x, y, { c: ['violet', 'teal', 'amber', 'coral', 'blue'][i % 5], sk: i % 3, s: 1.25, hold: i % 3 === 2 ? 'parcel' : 'phone', long: i % 2, mood: typeof mood === 'function' ? mood(i) : mood }) : null;
  });
  return o;
};
const serverRoom = (mood = 'surprised') => {
  const o = { floor: S(3.4, 1.7, 7.4, 3.6, { c: 'slate' }), wall: { k: 'slab', x: 3.4, y: -0.25, w: 7.4, d: 0.16, h: 1.9, c: 'slate' } };
  for (let i = 0; i < 4; i++) o['r' + i] = B('', 0.6 + i * 1.3, 0.6, { c: 'blue', w: 0.8, d: 0.9, h: 1.5, deco: 'server' });
  o.scr = B('', 6.4, -0.12, { z: 0.8, c: 'ink', w: 1.4, d: 0.08, h: 0.8, deco: 'dash', trend: 'up', noshadow: 1 });
  o.scl = T('GMV today +300%', 6.4, -0.6, { z: 1.95, fs: 12, b: 1, c: 'coral' });
  o.alarm = O(7.6, -0.12, { z: 1.7, r: 0.16, c: 'coral', hl: 1, noshadow: 1 });
  o.desk = B('', 5.2, 2.2, { c: 'amber', w: 1.4, d: 0.8, h: 0.55 });
  o.lap = B('', 5.2, 2.0, { z: 0.55, c: 'ink', w: 0.7, d: 0.06, h: 0.45, deco: 'screen', noshadow: 1 });
  o.david = P(3.7, 2.6, { c: 'blue', sk: 0, s: 1.6, t: 'David', pick: 'david', mood, hold: 'phone' });
  return o;
};

// ---------- device screens ----------
const TWO = [
  ['Jones: ₹1.42 Cr', 'cancels removed', '#0f9488', 'bad'],
  ['Finance: ₹1.74 Cr', 'cancels kept', '#7c5cd6', 'bad'],
  ['Gap: ₹32 lakh', 'nobody can explain', '#e8492b', 'bad'],
];
const ONE = [
  ['GMV: ₹1.42 Cr', 'net of cancels', '#2e7d6b', 'good'],
  ['Cancels: ₹12 lakh', 'shown separately', '#8d6e3f', 'good'],
  ['1 file rejected', 'duplicate, logged', '#7e57c2', 'good'],
];

export default {
  id: 'p0-story', phase: 0, phaseName: 'Foundations', time: '4 minutes',
  title: 'Story: two numbers for one week',
  sub: 'Before any AI, ShopSense needs numbers everyone trusts. This story shows why, and sets up the Phase 0 project.',
  shows: ['Why one KPI with a written definition matters more than any model', 'How cancellations and a duplicated file create two "true" numbers', 'The stress case that becomes the project’s failure drill'],
  toggle: ['Before pipeline', 'After pipeline'],
  device: { brand: 'ShopSense · Reports', icon: '▤' },
  cast: CAST,
  takeaways: [
    ['Analytics before AI', 'Phase 0’s project is deliberately not an AI project. Every later model is trained and judged on these numbers, so they must be trusted first.'],
    ['Definitions are code', 'What counts as a sale (delivered? cancelled? refunded?) is written down, tested and versioned like any other code.'],
    ['Design for the bad day', 'Duplicate files, empty days and festival spikes are part of the requirements from day one, not surprises in production.'],
  ],
  beats: [
    {
      name: 'Beat 1 of 6 · Context', title: 'Monday sales review',
      body: ['Every Monday, Jones, the category manager, presents last week’s sales by category to the leadership team at ShopSense in Coimbatore.', 'Diwali is three weeks away. Today they must decide how much stock to order.'],
      note: 'The story starts with a decision people must make, not with data or a tool.',
      frames: [
        { at: 0, mode: 'world', cut: true, s: room({ labelB: ' ', labelA: 'Weekly review · week 44' }), cap: 'Monday, 10 a.m. The weekly sales review at ShopSense.' },
        { at: 2400, s: { jones: { mood: 'happy', pose: 'wave' }, sj: Bub('Sarees are up 18%.\nLet’s order more for Diwali.', 0.4, 1.7, { z: 3.55, c: 'teal' }) }, cap: 'Jones presents: saree sales are up, so he wants to stock more for Diwali.' },
        { at: 5400, s: { sj: null, jones: { pose: '' }, head: { mood: 'happy' } }, cap: 'The head of category is ready to approve the order.' },
      ],
    },
    {
      name: 'Beat 2 of 6 · Pain', title: 'The finance screen shows a different number',
      body: ['The finance analyst puts up her report: GMV of ₹1.74 crore. Jones’s report says ₹1.42 crore for the same week.', 'The meeting turns into an argument about whose spreadsheet is right. No stock decision is made.'],
      note: 'The pain is concrete: a decision delayed and trust lost, because one word, GMV, means two things.',
      frames: [
        { at: 0, mode: 'world', cut: true, s: room({ labelA: 'Jones · GMV ₹1.42 Cr', labelB: 'Finance · GMV ₹1.74 Cr' }), cap: 'The finance analyst shares her screen.' },
        { at: 2200, s: { fin: { mood: 'surprised' }, sf: Bub('My GMV is ₹1.74 crore.\nYours is ₹1.42?', 5.4, 1.0, { z: 3.55, c: 'violet' }) }, cap: 'Same week, same company, two different GMV numbers.' },
        { at: 5000, mode: 'phone', device: { q: 'GMV · week 44', rows: TWO, meta: 'Two reports for the same week' }, cap: 'A gap of ₹32 lakh that nobody can explain.' },
        { at: 8200, mode: 'world', s: { sf: null, jones: { mood: 'frustrated' }, fin: { mood: 'frustrated' }, head: { mood: 'worried' }, sh: Bub('Come back when you agree.', 3.8, 1.0, { z: 3.25, c: 'blue' }) }, cap: 'The meeting ends without a decision. Diwali is getting closer.' },
      ],
    },
    {
      name: 'Beat 3 of 6 · Data trail', title: 'Where the two numbers come from',
      body: ['Both reports start from the same order system. Jones removes cancelled orders; finance keeps them. And the 1 November daily file was loaded into finance’s sheet twice.', 'Turn on the data lens to see what each path adds.'],
      note: 'Neither person is "wrong". The definitions were never written down, and nothing checked for repeated files.',
      lens: {
        s: {
          d0: O(3.7, 0.8, { z: 0.3, r: 0.15, c: 'teal', noshadow: 1 }), n0: T('cancels removed', 3.7, 0.8, { z: 0.9, fs: 11.5, c: 'teal', b: 1 }),
          d1: O(3.7, 2.6, { z: 0.3, r: 0.15, c: 'violet', noshadow: 1 }), n1: T('+₹12 lakh cancelled', 3.7, 2.6, { z: 0.9, fs: 11.5, c: 'violet', b: 1 }),
          d2: O(4.4, 4.95, { z: 0.3, r: 0.15, c: 'coral', noshadow: 1 }), n2: T('+₹20 lakh repeated file', 4.4, 4.95, { z: 0.9, fs: 11.5, c: 'coral', b: 1 }),
        },
      },
      frames: [
        { at: 0, mode: 'world', cut: true, s: trail(), cap: 'Behind the two screens: the same order data, two different paths.' },
        { at: 2200, l: trailL(), cap: 'Jones’s sheet drops cancelled orders. Finance’s sheet keeps them.' },
        { at: 5000, s: { day2: { hl: 1 } }, cap: 'And the 1 November file was delivered twice. Finance’s sheet counted it twice.' },
        { at: 7600, lensOn: true, cap: 'Data lens: ₹1.42 Cr + ₹12 lakh cancelled + ₹20 lakh repeated = ₹1.74 Cr.' },
      ],
    },
    {
      name: 'Beat 4 of 6 · Solution in action', title: 'One pipeline, written definitions',
      body: ['The Phase 0 project builds one pipeline: it validates every file, rejects repeats, and computes each KPI from a written, tested definition.', 'Cancelled orders are reported separately, so both teams see the same GMV and the same breakdown. This is analytics, not AI, and that is the point.'],
      note: 'Use Before pipeline and After pipeline to compare. One box changes everything downstream.',
      toggle: true,
      before: { s: pipeline(false), l: pipelineL(false), device: { q: 'GMV · week 44', rows: TWO, meta: 'Two reports for the same week' }, cap: 'Before: two spreadsheets, two definitions, one file counted twice.' },
      afterCap: 'After: one pipeline, one definition, the repeated file rejected.',
      frames: [
        { at: 0, mode: 'split', cut: true, s: pipeline(true), device: { q: 'GMV · week 44', rows: 'loading', meta: 'Rebuilding the report…' }, cap: 'The same data now flows through one pipeline.' },
        { at: 1600, l: { p1: L('src', 'val', { flow: 1 }), p4: L('dup', 'val', { c: 'coral', dash: 1 }) }, cap: 'Every file is validated. The repeated 1 November file is spotted…' },
        { at: 3800, l: { p5: L('val', 'q', { c: 'coral' }) }, s: { q: { hl: 1 } }, cap: '…and quarantined with a reason, instead of being counted twice.' },
        { at: 6000, l: { p2: L('val', 'def', { flow: 1 }), p3: L('def', 'rep', { flow: 1, c: 'green' }) }, s: { q: { hl: 0 }, rep: { hl: 1 } }, cap: 'KPIs are computed from written definitions: GMV excludes cancelled orders, which are shown separately.' },
        { at: 8400, device: { q: 'GMV · week 44', rows: ONE, meta: 'One report, shared by every team', toast: ['Both teams: same number', 'good'] }, cap: 'Jones and finance now open the same report.' },
      ],
    },
    {
      name: 'Beat 5 of 6 · Outcome', title: 'A ten-minute review that ends in a decision',
      body: ['Next Monday both screens show ₹1.42 crore, with cancellations listed beside it. The review takes ten minutes and ends with a decision: order 25% more cotton sarees for Diwali.', 'The project’s success metric: every KPI matches a reference calculation to the rupee.'],
      note: 'Every story ends on a business outcome and a measurable target. The figures here are illustrative.',
      frames: [
        { at: 0, mode: 'world', cut: true, s: room({ labelA: 'Jones · GMV ₹1.42 Cr', labelB: 'Finance · GMV ₹1.42 Cr', cB: 'green', cA: 'green', jones: 'happy', fin: 'happy' }), cap: 'Next Monday. Both screens show the same number.' },
        { at: 2400, s: { fin: { mood: 'relieved' }, sf: Bub('Same GMV. Cancels are\nlisted separately. Agreed.', 5.4, 1.0, { z: 3.55, c: 'violet' }) }, cap: 'The finance analyst agrees: the definitions are written down and tested.' },
        { at: 5200, s: { sf: null, head: { mood: 'happy' }, sh: Bub('Order 25% more cotton\nsarees for Diwali.', 3.8, 1.0, { z: 3.25, c: 'green' }), jones: { mood: 'excited', pose: 'wave' } }, cap: 'Ten minutes later, the decision is made.' },
        { at: 8000, s: { sh: { t: 'Every KPI matches the\nreference to the rupee.' } }, cap: 'Success metric for the project: KPIs match a reference calculation to the rupee.' },
      ],
    },
    {
      name: 'Beat 6 of 6 · What can go wrong', title: 'Diwali week: real growth or a data bug?',
      body: ['In Diwali week orders rise to six times normal, and one morning the daily file arrives twice again. The dashboard shows GMV up 300% overnight.', 'David, the on-call engineer, must answer fast: is this the festival, or a file counted twice? These cases become the project’s stress scenarios and failure drills.'],
      note: 'The bad day is designed for from the start: validation, de-duplication and alerts are L2 requirements; handling 6× volume is L3.',
      warn: true,
      frames: [
        { at: 0, mode: 'world', cut: true, s: market(5), cap: 'Diwali week in Coimbatore. Shoppers are out in force.' },
        { at: 2200, s: market(12), cap: 'Orders rise to about six times a normal week.' },
        { at: 4600, mode: 'world', cut: true, s: serverRoom('surprised'), cap: 'Early next morning, an alert fires: GMV is up 300% overnight.' },
        { at: 6800, s: { david: { mood: 'thinking' }, sd: Bub('Festival spike, or the same\nfile counted twice?', 3.7, 2.6, { z: 3.65, c: 'blue' }) }, cap: 'David has to tell real growth from a data bug, quickly.' },
        { at: 9400, s: { david: { mood: 'relieved' }, sd: { t: 'Order IDs are unique: real.\nRepeat file was rejected.' } }, cap: 'With validation and de-duplication in place, he can prove it in minutes.' },
      ],
    },
  ],
};
