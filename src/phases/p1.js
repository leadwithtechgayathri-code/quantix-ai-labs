// Phase 1 bundle: loaded only when a learner opens Phase 1.
import P1A from '../lessons/p1a.js';
import P1B from '../lessons/p1b.js';
import P1C from '../lessons/p1c.js';
import P1D from '../lessons/p1d.js';
import story from '../stories/p1.js';
import project from '../projects/p1.js';
import outputs from './outputs-p1.json' with { type: 'json' };

export default { lessons: [...P1A, ...P1B, ...P1C, ...P1D], story, project, outputs };
