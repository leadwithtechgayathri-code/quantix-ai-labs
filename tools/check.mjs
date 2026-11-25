// Pre-build check: the manifest must match what each phase bundle actually contains,
// and every code block must have a checked output.
import { LOADERS, MANIFEST } from '../src/phases/manifest.js';

let bad = 0;
const fail = (m) => { console.error('✗', m); bad++; };
for (const [key, m] of Object.entries(MANIFEST)) {
  if (!LOADERS[key]) { fail(`${key}: in MANIFEST but has no loader`); continue; }
  const { default: B } = await LOADERS[key]();
  const ids = B.lessons.map((l) => l.id);
  const missing = m.ready.filter((id) => !ids.includes(id));
  const extra = ids.filter((id) => !m.ready.includes(id));
  if (missing.length) fail(`${key}: manifest lists lessons the bundle lacks: ${missing.join(', ')}`);
  if (extra.length) fail(`${key}: bundle has lessons the manifest does not list: ${extra.join(', ')}`);
  for (const kind of ['story', 'project']) if (Boolean(m[kind]) !== Boolean(B[kind]) || (m[kind] && m[kind].id !== B[kind].id)) fail(`${key}: ${kind} differs between manifest and bundle`);
  for (const L of B.lessons) for (const t of ['scratch', 'library', 'prod']) if (!(`${L.id}:${t}` in B.outputs)) fail(`${L.id}:${t} has no checked output (run npm run outputs)`);
  for (const lv of B.project?.levels || []) if (!(`${B.project.id}:${lv.n}` in B.outputs)) fail(`${B.project.id}:${lv.n} has no checked output`);
  console.log(`✓ ${key}: ${ids.length} lessons${B.story ? ', story' : ''}${B.project ? ', project' : ''}`);
}
if (bad) { console.error(`${bad} problem(s). Build stopped.`); process.exit(1); }
