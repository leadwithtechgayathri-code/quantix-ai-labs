// Phase 0 bundle: loaded only when a learner opens Phase 0.
import P0A from '../lessons/p0a.js';
import P0B from '../lessons/p0b.js';
import P0C from '../lessons/p0c.js';
import P0D from '../lessons/p0d.js';
import story from '../stories/p0.js';
import project from '../projects/p0.js';
import outputs from './outputs-p0.json' with { type: 'json' };

export default { lessons: [...P0A, ...P0B, ...P0C, ...P0D], story, project, outputs };
