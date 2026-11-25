// What is published, per phase, without loading the phase itself.
// tools/check.mjs verifies this list against the phase bundles before every build.
export const LOADERS = {
  p0: () => import('./p0.js'),
  p1: () => import('./p1.js'),
};

const range = (key, n) => Array.from({ length: n }, (_, i) => `${key}-${String(i + 1).padStart(2, '0')}`);

export const MANIFEST = {
  p0: {
    ready: range('p0', 20),
    story: { id: 'p0-story', title: 'Story: two numbers for one week' },
    project: { id: 'p0-project', title: 'Project: Sales Insights Pipeline' },
  },
  p1: {
    ready: range('p1', 22),
    story: { id: 'p1-story', title: 'Story: Priya quietly stops ordering' },
    project: { id: 'p1-project', title: 'Project: Churn and Demand Forecasting' },
  },
};
