// Prints every runnable code block (lessons, exercises, project starters) as JSON for tools/run.py.
import { LOADERS } from '../src/phases/manifest.js';

const out = [];
for (const [key, load] of Object.entries(LOADERS)) {
  const { default: B } = await load();
  for (const L of B.lessons) {
    for (const t of ['scratch', 'library', 'prod']) out.push({ key: `${L.id}:${t}`, phase: key, src: L.code[t].src });
    out.push({ key: `${L.id}:exercise`, phase: key, src: `${L.exercise.solution}\n\n${L.exercise.check}\nprint("All checks passed.")` });
    out.push({ key: `${L.id}:starter`, phase: key, src: L.exercise.starter, starter: true });
  }
  for (const lv of B.project?.levels || []) out.push({ key: `${B.project.id}:${lv.n}`, phase: key, src: lv.code.src });
}
process.stdout.write(JSON.stringify(out));
