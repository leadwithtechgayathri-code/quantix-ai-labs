// Python warm-up bundle: loaded only when a learner opens the warm-up.
import WA from '../lessons/wa.js';
import WB from '../lessons/wb.js';
import outputs from './outputs-w.json' with { type: 'json' };

// The warm-up teaches Python itself, so its layers and code tabs are named for that.
const layerNames = { math: ['The rules', 'How Python behaves'] };
const codeTabs = [['scratch', 'Basic', 'The simplest version that works'], ['library', 'Idiomatic', 'How experienced Python developers write it'], ['prod', 'Production style', 'Typed, tested, reusable']];
const lessons = [...WA, ...WB].map((l) => ({ layerNames, codeTabs, ...l }));

export default { lessons, outputs };
