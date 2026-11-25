// Phase 1 bundle: loaded only when a learner opens Phase 1.
import P1A from '../lessons/p1a.js';
import P1B from '../lessons/p1b.js';
import outputs from './outputs-p1.json' with { type: 'json' };

export default { lessons: [...P1A, ...P1B], outputs };
