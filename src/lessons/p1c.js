import { B, Tl, O, T, Z, S, P, Cy, Bub, L, row, bars, off, mg } from '../kit.js';

const DATA = '#c4cdfb', GOOD = '#c1e4b1', BAD = '#ffc4b1', SIGNAL = '#fddf98', MODEL = '#d9cafb', SYS = '#b2e5da';

// ===================================================================== P1.12
const ACT = [80, 120, 100, 140];
const l12 = {
  id: 'p1-12', title: 'Gradient boosting', time: '40 minutes',
  sub: 'Build trees one after another, each fixing the mistakes of the ones before it. The strongest default for tabular data in industry.',
  learn: ['Explain boosting as adding small trees that fit the remaining errors', 'Run one boosting step by hand with a learning rate', 'Tune trees, learning rate and early stopping without overfitting'],
  legend: [[DATA, 'actual'], [MODEL, 'prediction'], [BAD, 'residual'], [GOOD, 'tree']],
  steps: [
    {
      t: 'Start with a simple guess', b: ['Weekly orders for four stores: 80, 120, 100 and 140. Boosting starts with the simplest prediction: the average, 110, for every store.'],
      n: 'Blue bars are actual orders; violet is the current prediction.',
      s: mg(bars('a', ACT.map((v) => (v - 50) / 20), { x: 0, y: 0, dx: 1.8, w: 0.6, d: 0.6, c: 'blue', labels: ['80', '120', '100', '140'] }), bars('p', [3, 3, 3, 3], { x: 0.7, y: 0, dx: 1.8, w: 0.6, d: 0.6, c: 'violet' }), { pl: T('prediction: 110 everywhere', 2.4, -2.2, { z: 4.6, fs: 12.5, b: 1, c: 'violet' }) }),
    },
    {
      t: 'Look at the residuals', b: ['Residual = actual − prediction: −30, +10, −10, +30. These are the mistakes still left.', 'The next tree is trained to predict these residuals, not the orders.'],
      n: 'Each new tree learns what the model so far gets wrong.',
      s: { r0: T('−30', 0.35, 0, { z: 2.5, fs: 12.5, b: 1, c: 'coral' }), r1: T('+10', 2.15, 0, { z: 2.7, fs: 12.5, b: 1, c: 'coral' }), r2: T('−10', 3.95, 0, { z: 2.5, fs: 12.5, b: 1, c: 'coral' }), r3: T('+30', 5.75, 0, { z: 3.0, fs: 12.5, b: 1, c: 'coral' }) },
    },
    {
      t: 'Add a small step', b: ['Suppose the new tree predicts the residuals exactly. We do not add them in full: we add a fraction, the learning rate (here 0.1).', 'New predictions: 107, 111, 109, 113. Each moved a little towards the truth.'],
      n: 'Small steps with many trees generalise better than big steps with few.',
      s: mg(bars('p', [107, 111, 109, 113].map((v) => (v - 50) / 20), { x: 0.7, y: 0, dx: 1.8, w: 0.6, d: 0.6, c: 'violet' }), { pl: { t: 'after tree 1 (rate 0.1): 107 · 111 · 109 · 113' } }),
    },
    {
      t: 'Repeat hundreds of times', b: ['Tree after tree, the residuals shrink. Real libraries use shallow trees (depth 3–8), hundreds or thousands of rounds, and clever tricks for speed.', 'XGBoost, LightGBM, CatBoost and scikit-learn’s HistGradientBoosting all follow this idea.'],
      n: 'Boosting reduces bias step by step; forests reduce variance by averaging.',
      clear: true,
      s: { ...Object.fromEntries([0, 1, 2, 3, 4].map((i) => [`t${i}`, B(i < 4 ? `tree ${i + 1}` : '…', i * 2.4, 0, { c: 'green', w: 1.3, d: 1.1, h: 0.6 + i * 0.05, fs: 10.5 })])), sum: Tl('sum = prediction', 12.4, 0, { top: 1, c: 'violet', w: 2.6, d: 1.2, fs: 10 }), rl: T('each tree learns the residuals left by the ones before', 5.6, 2.8, { z: 0, fs: 12, b: 1, c: 'coral' }) },
      l: { ...Object.fromEntries([0, 1, 2, 3].map((i) => [`l${i}`, L(`t${i}`, `t${i + 1}`, { c: 'coral', flow: 1 })])), z: L('t4', 'sum', { c: 'violet', flow: 1 }) },
    },
    {
      t: 'Stop before it memorises', b: ['Keep adding trees and validation error eventually rises again. Early stopping watches a validation set and stops when it no longer improves.', 'Tune learning rate, tree depth and number of rounds together.'],
      n: 'A smaller learning rate needs more trees but usually ends lower.',
      warn: true,
      clear: true,
      s: mg(bars('v', [2.4, 1.5, 1.0, 0.8, 0.75, 0.82, 1.0], { x: 0, y: 0, dx: 0.9, w: 0.6, d: 0.6, c: 'amber', labels: ['10', '', '100', '', 'stop', '', '2000'] }), { v4: { c: 'green' }, vl: T('validation error vs number of trees', -0.6, -1.8, { z: 2.9, fs: 12.5, b: 1 }) }),
    },
  ],
  math: {
    blocks: [
      { h: 'Additive model', f: 'F₀(x) = mean of y\nFₘ(x) = Fₘ₋₁(x) + η · hₘ(x)', p: 'hₘ is a small tree trained on the current residuals; η is the learning rate.' },
      { h: 'Why residuals', f: 'for squared loss L = ½(y − F)²:\n−∂L/∂F = y − F = residual', p: 'Each tree follows the negative gradient of the loss, which is why it is called gradient boosting. Other losses (log loss for churn) give other "residuals".' },
    ],
    example: {
      intro: 'One boosting round for orders 80, 120, 100, 140 with η = 0.1.',
      steps: ['F₀ = mean = (80 + 120 + 100 + 140) / 4 = <b>110</b>.', 'Residuals: 80 − 110 = −30, 120 − 110 = 10, 100 − 110 = −10, 140 − 110 = 30.', 'If tree 1 predicts the residuals exactly: F₁ = 110 + 0.1 × (−30, 10, −10, 30) = <b>107, 111, 109, 113</b>.', 'Mean squared error falls from (900 + 100 + 100 + 900) / 4 = 500 to (729 + 81 + 81 + 729) / 4 = <b>405</b>. Repeat.'],
    },
  },
  code: {
    scratch: { why: 'Boosting with one-split trees (stumps) on a single feature, from scratch.', src: `import numpy as np

rng = np.random.default_rng(0)
x = np.sort(rng.uniform(0, 10, 80))
y = np.sin(x) * 3 + x + rng.normal(0, 0.4, 80)


def fit_stump(x, r):
    best = None
    for t in np.unique(x)[:-1]:
        left, right = r[x <= t].mean(), r[x > t].mean()
        err = ((r - np.where(x <= t, left, right)) ** 2).sum()
        if best is None or err < best[0]:
            best = (err, t, left, right)
    _, t, left, right = best
    return lambda z: np.where(z <= t, left, right)


pred, lr = np.full_like(y, y.mean()), 0.3
for m in range(1, 51):
    stump = fit_stump(x, y - pred)          # fit the residuals
    pred = pred + lr * stump(x)
    if m in (1, 5, 20, 50):
        print(f"round {m:2d}: training MSE {np.mean((y - pred) ** 2):.3f}")` },
    library: { why: 'HistGradientBoosting against a random forest on the churn data.', src: `import numpy as np
from sklearn.ensemble import HistGradientBoostingClassifier, RandomForestClassifier
from sklearn.model_selection import cross_val_score

rng = np.random.default_rng(0)
n = 4_000
X = np.c_[rng.integers(0, 120, n), rng.poisson(3, n), rng.normal(1500, 500, n), rng.integers(0, 5, n)]
logit = -1.5 + 0.04 * X[:, 0] - 0.4 * X[:, 1] + 0.8 * (X[:, 0] > 60) * (X[:, 1] < 2)
y = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)

for name, model in [("random forest", RandomForestClassifier(n_estimators=200, min_samples_leaf=5, random_state=0, n_jobs=1)),
                    ("gradient boosting", HistGradientBoostingClassifier(learning_rate=0.05, max_iter=150, max_depth=2, random_state=0))]:
    print(f"{name:18s} CV ROC-AUC {cross_val_score(model, X, y, cv=5, scoring='roc_auc').mean():.3f}")` },
    prod: { why: 'Early stopping on a validation slice picks the number of trees for you.', src: `import numpy as np
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(1)
n = 6_000
X = np.c_[rng.integers(0, 120, n), rng.poisson(3, n), rng.normal(1500, 500, n)]
y = (rng.random(n) < 1 / (1 + np.exp(-(-1.5 + 0.04 * X[:, 0] - 0.4 * X[:, 1])))).astype(int)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)

model = HistGradientBoostingClassifier(
    learning_rate=0.05, max_iter=2_000, max_depth=4,
    early_stopping=True, validation_fraction=0.15, n_iter_no_change=30, random_state=0,
).fit(X_tr, y_tr)
print("trees actually used:", model.n_iter_)
print(f"test ROC-AUC: {roc_auc_score(y_te, model.predict_proba(X_te)[:, 1]):.3f}")` },
  },
  industry: {
    when: ['Most tabular prediction problems: churn, fraud, demand, pricing, ranking features.', 'When you need the best accuracy on structured data.', 'Kaggle and industry benchmarks on tables are usually won by boosting.'],
    baseline: 'Logistic regression and a random forest on the same folds. Boosting should beat both; if not, look for data problems.',
    tools: ['scikit-learn HistGradientBoosting', 'LightGBM, XGBoost, CatBoost', 'Optuna for tuning'],
    tradeoffs: ['Usually the most accurate on tables, but more hyperparameters to tune than a forest.', 'Sequential training is harder to parallelise than forests (libraries mitigate this).'],
    failures: ['Too many rounds with a high learning rate: overfitting.', 'Tuning on the test set.', 'Leaked features making boosting look miraculous (it finds leaks very efficiently).'],
    shopsense: 'The production churn model in the Phase 1 project is a gradient-boosted model, chosen after beating logistic regression and a forest on time-based folds.',
    interview: [
      ['How does gradient boosting differ from a random forest?', 'Forests train independent deep trees in parallel and average them to reduce variance; boosting trains shallow trees sequentially, each correcting the previous ones, to reduce bias.'],
      ['What does the learning rate do in boosting?', 'It scales each tree’s contribution; smaller values need more trees but usually generalise better.'],
      ['How do you prevent boosting from overfitting?', 'Early stopping on validation data, shallow trees, subsampling rows and features, regularisation terms and a small learning rate.'],
    ],
  },
  quiz: [
    { q: 'Orders 80, 120, 100, 140. What is the first boosting prediction?', opts: ['80', '100', '110', '140'], a: 2, why: 'Boosting starts from the mean.' },
    { q: 'What does each new tree in gradient boosting learn?', opts: ['The original target', 'The current residuals (negative gradient)', 'Random noise', 'The previous tree'], a: 1, why: 'It corrects what the model so far gets wrong.' },
    { q: 'Prediction 110, residual −30, learning rate 0.1, tree predicts −30. New prediction?', opts: ['80', '107', '113', '110'], a: 1, why: '110 + 0.1 × (−30).' },
    { q: 'Validation error starts rising after 600 trees. What should you do?', opts: ['Add more trees', 'Use early stopping around the minimum', 'Raise the learning rate', 'Nothing'], a: 1, why: 'Beyond the minimum the model overfits.' },
    { q: 'Boosting mainly reduces…', opts: ['Variance, by averaging', 'Bias, by sequential correction', 'Memory use', 'Training time'], a: 1, why: 'Each step reduces remaining error.' },
  ],
  exercise: {
    task: ['Write <code>boost_step(y, pred, tree_pred, lr)</code> returning the new predictions. Starting from the mean of <code>y</code>, do one step with lr = 0.1 where the tree predicts the residuals exactly, and store the result in <code>new</code>.'],
    starter: `def boost_step(y, pred, tree_pred, lr):
    pass


y = [50, 70, 90]
pred = None        # start from the mean
residuals = None
new = None
print(new)`,
    check: `assert boost_step([1], [0], [10], 0.5) == [5.0]
assert [round(v, 6) for v in new] == [68.0, 70.0, 72.0], "mean 70, residuals −20, 0, +20, step 0.1"`,
    solution: `def boost_step(y, pred, tree_pred, lr):
    return [p + lr * t for p, t in zip(pred, tree_pred)]


y = [50, 70, 90]
pred = [sum(y) / len(y)] * len(y)
residuals = [a - p for a, p in zip(y, pred)]
new = boost_step(y, pred, residuals, 0.1)
print(new)`,
    hint: 'New prediction = old prediction + lr × tree prediction.',
  },
};

// ===================================================================== P1.13
const A = [[1, 1], [1.6, 2.2], [2.2, 1.2], [1.2, 2.8]], C = [[4.2, 3.6], [5, 2.6], [4.4, 4.8], [5.6, 4.0]];
const l13 = {
  id: 'p1-13', title: 'Support vector machines', time: '35 minutes',
  sub: 'Separate two classes with the widest possible margin, and bend the boundary with kernels when a straight line is not enough.',
  learn: ['Explain the maximum-margin idea and support vectors', 'Compute a margin from the weight vector and the hinge loss of a point', 'Know when kernels help and why SVMs need scaled features'],
  legend: [[BAD, 'churned'], [GOOD, 'stayed'], [SIGNAL, 'support vector'], [MODEL, 'boundary']],
  steps: [
    {
      t: 'Many lines separate the classes', b: ['Churned (coral) and retained (green) customers on two features. Many straight lines separate them perfectly. Which is best?'],
      n: 'A line that hugs one class will misclassify new customers near it.',
      s: { ...Object.fromEntries(A.map(([x, y], i) => ['a' + i, O(x, y, { r: 0.22, c: 'coral' })])), ...Object.fromEntries(C.map(([x, y], i) => ['c' + i, O(x, y, { r: 0.22, c: 'green' })])) },
    },
    {
      t: 'Choose the widest street', b: ['An SVM picks the boundary with the largest margin: the widest street between the classes with no points inside it.', 'A wide margin is more robust to small changes in new data.'],
      n: 'The violet band is the street; the centre line is the decision boundary.',
      s: { m0: { k: 'orb', x: 1.6, y: 5.4, r: 0.03, o: 0, noshadow: 1 }, m1: { k: 'orb', x: 5.0, y: 0.2, r: 0.03, o: 0, noshadow: 1 }, e0: { k: 'orb', x: 0.9, y: 4.8, r: 0.03, o: 0, noshadow: 1 }, e1: { k: 'orb', x: 4.3, y: -0.4, r: 0.03, o: 0, noshadow: 1 }, f0: { k: 'orb', x: 2.3, y: 6.0, r: 0.03, o: 0, noshadow: 1 }, f1: { k: 'orb', x: 5.7, y: 0.8, r: 0.03, o: 0, noshadow: 1 } },
      l: { mid: L('m0', 'm1', { c: 'violet', na: 1, sw: 3 }), ed0: L('e0', 'e1', { c: 'violet', na: 1, dash: 1 }), ed1: L('f0', 'f1', { c: 'violet', na: 1, dash: 1 }) },
    },
    {
      t: 'Support vectors decide everything', b: ['Only the points on the edge of the street matter: the support vectors. Move any other point (without crossing the street) and the boundary does not change.'],
      n: 'Highlighted points are the support vectors.',
      s: { a2: { hl: 1, c: 'amber' }, c0: { hl: 1, c: 'amber' } },
    },
    {
      t: 'Soft margins allow some mistakes', b: ['Real data overlaps. A soft-margin SVM allows a few points inside the street or on the wrong side, paying a penalty (the hinge loss). The C parameter sets how strict it is.', 'Large C: few violations, narrow margin, risk of overfitting. Small C: wider margin, more violations.'],
      n: 'C plays the role of 1/λ in regularisation (P1.05).',
      s: { odd: O(3.4, 3.0, { r: 0.22, c: 'coral', hl: 1 }), oddl: T('this churner sits inside the street: it pays a penalty', 3.4, 7.4, { z: 0.3, fs: 12, b: 1, c: 'coral' }) },
    },
    {
      t: 'Kernels bend the boundary', b: ['When no straight line works (one class surrounds the other), a kernel such as RBF measures similarity in a way that lets the SVM draw a curved boundary, without computing new features explicitly.', 'Always scale features first: the margin is measured in feature units.'],
      n: 'RBF kernels need two settings tuned together: C and gamma.',
      clear: true,
      s: { ...Object.fromEntries(Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return ['o' + i, O(3 + 2.4 * Math.cos(a), 3 + 2.4 * Math.sin(a), { r: 0.2, c: 'green' })]; })), ...Object.fromEntries(Array.from({ length: 4 }, (_, i) => { const a = (i / 4) * Math.PI * 2 + 0.4; return ['i' + i, O(3 + 0.7 * Math.cos(a), 3 + 0.7 * Math.sin(a), { r: 0.2, c: 'coral' })]; })), ring: Z('', 3, 3, 3.0, 3.0, { c: 'violet' }), rl: T('RBF boundary: a closed curve around the churners', 3, 6.6, { z: 0.3, fs: 12, b: 1, c: 'violet' }) },
    },
  ],
  math: {
    blocks: [
      { h: 'Linear SVM', f: 'decision: sign(w · x + b)\nmargin width = 2 / ‖w‖', p: 'Maximising the margin is the same as minimising ‖w‖² subject to every point being on the right side with room to spare.' },
      { h: 'Soft margin (hinge loss)', f: 'minimise  ½‖w‖² + C Σᵢ max(0, 1 − yᵢ (w · xᵢ + b))', p: 'Labels yᵢ are −1 or +1. Points beyond the margin on the correct side cost nothing.' },
      { h: 'RBF kernel', f: 'k(x, z) = exp(−γ ‖x − z‖²)' },
    ],
    example: {
      intro: 'A linear SVM with w = (3, 4) and b = −10.',
      steps: ['‖w‖ = √(3² + 4²) = 5, so the margin width is 2 / 5 = <b>0.4</b> (in scaled feature units).', 'Point x = (2, 1), label y = +1: w · x + b = 6 + 4 − 10 = 0. Hinge loss = max(0, 1 − 1 × 0) = <b>1</b>: it sits on the boundary.', 'Point x = (3, 2), y = +1: score 9 + 8 − 10 = 7; loss = max(0, 1 − 7) = <b>0</b>: safely classified.', 'Point x = (1, 1), y = +1: score 3 + 4 − 10 = −3; loss = max(0, 1 + 3) = <b>4</b>: wrong side, heavily penalised.'],
    },
  },
  code: {
    scratch: { why: 'Margin width and hinge loss from the formulas.', src: `from math import sqrt

w, b = (3, 4), -10


def score(x):
    return w[0] * x[0] + w[1] * x[1] + b


def hinge(x, y):
    return max(0, 1 - y * score(x))


print("margin width:", 2 / sqrt(w[0] ** 2 + w[1] ** 2))
for x, y in [((2, 1), 1), ((3, 2), 1), ((1, 1), 1), ((1, 1), -1)]:
    print(f"x={x} y={y:+d} score={score(x):+d} hinge={hinge(x, y)}")` },
    library: { why: 'Linear versus RBF SVMs on data a straight line cannot separate.', src: `from sklearn.datasets import make_circles
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

X, y = make_circles(n_samples=600, factor=0.4, noise=0.08, random_state=0)
for kernel in ("linear", "rbf"):
    model = make_pipeline(StandardScaler(), SVC(kernel=kernel, C=1.0))
    print(f"{kernel:6s} kernel: CV accuracy {cross_val_score(model, X, y, cv=5).mean():.3f}")

fitted = make_pipeline(StandardScaler(), SVC(kernel="rbf")).fit(X, y)
print("support vectors used:", fitted[-1].n_support_.sum(), "of", len(X))` },
    prod: { why: 'Tune C and gamma together inside a scaled pipeline.', src: `from sklearn.datasets import make_moons
from sklearn.model_selection import GridSearchCV
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

X, y = make_moons(n_samples=800, noise=0.25, random_state=0)
search = GridSearchCV(
    make_pipeline(StandardScaler(), SVC(kernel="rbf")),
    {"svc__C": [0.1, 1, 10, 100], "svc__gamma": [0.1, 1, 10]},
    cv=5,
).fit(X, y)
print("best:", search.best_params_, f"CV accuracy {search.best_score_:.3f}")` },
  },
  industry: {
    when: ['Small to medium datasets with clear margins.', 'High-dimensional sparse data such as text features (linear SVMs).', 'When a strong non-linear classifier is needed on modest data.'],
    baseline: 'Logistic regression; a linear SVM performs similarly. Try RBF only if curved boundaries clearly help in cross-validation.',
    tools: ['scikit-learn SVC, LinearSVC', 'StandardScaler in a Pipeline'],
    tradeoffs: ['Strong on small data, but kernel SVMs scale poorly beyond tens of thousands of rows.', 'No native probabilities (Platt scaling adds them at extra cost).'],
    failures: ['Unscaled features.', 'Tuning C without gamma (or the reverse).', 'Using kernel SVMs on millions of rows.'],
    shopsense: 'ShopSense uses linear SVMs for quick text classifiers on support tickets; boosting wins on the churn tables.',
    interview: [
      ['What are support vectors?', 'The training points on or inside the margin; they alone determine the decision boundary.'],
      ['What is the kernel trick?', 'Computing inner products in a high-dimensional feature space through a kernel function, without building the features explicitly.'],
      ['What does C control?', 'The penalty for margin violations: high C fits training data tightly (narrow margin), low C allows more violations (wider margin).'],
    ],
  },
  quiz: [
    { q: 'w = (3, 4). What is the margin width 2 / ‖w‖?', opts: ['0.2', '0.4', '2', '5'], a: 1, why: '‖w‖ = 5, so 2 / 5.' },
    { q: 'A correctly classified point well outside the margin has hinge loss…', opts: ['1', '0', 'Negative', 'Infinite'], a: 1, why: 'max(0, 1 − y·score) is 0 when y·score ≥ 1.' },
    { q: 'Which points determine an SVM’s boundary?', opts: ['All points equally', 'The support vectors', 'The class means', 'Random points'], a: 1, why: 'Only points on or inside the margin matter.' },
    { q: 'One class surrounds the other. What helps?', opts: ['A larger C only', 'An RBF kernel', 'Removing scaling', 'Fewer features'], a: 1, why: 'Kernels allow curved boundaries.' },
    { q: 'Why are kernel SVMs rarely used on 10 million rows?', opts: ['They are inaccurate', 'Training cost grows very quickly with the number of rows', 'They need GPUs', 'They cannot classify'], a: 1, why: 'Kernel methods scale roughly quadratically or worse.' },
  ],
  exercise: {
    task: ['Write <code>hinge(w, b, x, y)</code> for 2-D vectors and labels ±1, and <code>margin(w)</code>. Compute the total hinge loss of the three points below and store it in <code>total</code>.'],
    starter: `from math import sqrt


def hinge(w, b, x, y):
    pass


def margin(w):
    pass


w, b = (1, 2), -4
points = [((3, 2), 1), ((1, 1), -1), ((2, 1), 1)]
total = None    # sum the hinge losses of the three points
print(total, margin(w))`,
    check: `assert hinge((3, 4), -10, (1, 1), 1) == 4
assert abs(margin((3, 4)) - 0.4) < 1e-12
assert total == 0 + 0 + 1, "(3,2): score 3 → 0; (1,1) y=−1: score −1 → 0; (2,1): score 0 → 1"`,
    solution: `from math import sqrt


def hinge(w, b, x, y):
    return max(0, 1 - y * (w[0] * x[0] + w[1] * x[1] + b))


def margin(w):
    return 2 / sqrt(w[0] ** 2 + w[1] ** 2)


w, b = (1, 2), -4
points = [((3, 2), 1), ((1, 1), -1), ((2, 1), 1)]
total = sum(hinge(w, b, x, y) for x, y in points)
print(total, margin(w))`,
    hint: 'Score = w·x + b. Hinge = max(0, 1 − y × score).',
  },
};

// ===================================================================== P1.14
const l14 = {
  id: 'p1-14', title: 'Naive Bayes', time: '30 minutes',
  sub: 'Classify text such as reviews or support tickets by combining word probabilities with Bayes’ rule. Fast, simple and a strong text baseline.',
  learn: ['Apply Bayes’ rule with several words assuming independence', 'Estimate word probabilities from counts with Laplace smoothing', 'Know where Naive Bayes shines and where its assumption breaks'],
  legend: [[BAD, 'complaint'], [GOOD, 'praise'], [SIGNAL, 'word evidence']],
  steps: [
    {
      t: 'Sorting reviews', b: ['ShopSense receives thousands of product reviews. The support team wants complaints flagged automatically. 20% of past reviews were complaints.'],
      n: 'The prior: before reading a review, P(complaint) = 0.2.',
      s: { inbox: Tl('new review', 0, 0, { top: 1, c: 'blue', w: 2.0, d: 1.2, fs: 10 }), pr: T('prior: 20% complaints', 0, -1.6, { z: 0.6, fs: 12, b: 1, c: 'muted' }) },
    },
    {
      t: 'Words carry evidence', b: ['The word "late" appears in 50% of complaints but only 5% of praise. Seeing it multiplies the odds of a complaint by 10.'],
      n: 'Each word is a clue; Bayes’ rule weighs the clues.',
      s: { w1: Tl('"late"\n50% vs 5%', 3.4, -0.8, { top: 1, c: 'amber', w: 2.1, d: 1.2, fs: 9.5 }) },
      l: { a: L('w1', 'inbox', { c: 'amber', na: 1 }) },
    },
    {
      t: 'Combine with Bayes’ rule', b: ['P(complaint | "late") = 0.5 × 0.2 / (0.5 × 0.2 + 0.05 × 0.8) = 0.10 / 0.14 ≈ <b>0.71</b>.', 'One word moved us from 20% to 71%.'],
      n: 'Posterior ∝ likelihood × prior.',
      s: { pr: { t: 'P(complaint | "late") ≈ 0.71', c: 'coral' }, inbox: { c: 'coral' } },
    },
    {
      t: 'Many words, naively', b: ['"Naive" Bayes assumes words are independent given the class, so their likelihoods simply multiply. Add "refund" (40% vs 2%) and the posterior jumps above 0.98.', 'The independence assumption is false ("late delivery" goes together), yet the classifier often works well.'],
      n: 'Libraries add log-probabilities instead of multiplying, to avoid tiny numbers.',
      s: { w2: Tl('"refund"\n40% vs 2%', 3.4, 1.2, { top: 1, c: 'amber', w: 1.7, d: 1.0, fs: 9.5 }), pr: { t: 'with "refund" too: ≈ 0.98' } },
      l: { b: L('w2', 'inbox', { c: 'amber', na: 1 }) },
    },
    {
      t: 'Smooth the counts', b: ['A word never seen in praise would have probability 0 and veto the whole calculation. Laplace smoothing adds 1 to every count so nothing is impossible.'],
      n: 'Smoothing keeps one rare word from overruling all the others.',
      warn: true,
      s: { sm: T('P(word | class) = (count + 1) / (total + vocabulary size)', 3.4, 4.6, { z: 0.3, fs: 12, b: 1, c: 'green' }) },
    },
  ],
  math: {
    blocks: [
      { h: 'Naive Bayes rule', f: 'P(c | w₁…wₙ) ∝ P(c) · Πᵢ P(wᵢ | c)', p: 'Compute this for each class and normalise so the classes sum to 1.' },
      { h: 'Laplace smoothing', f: 'P(w | c) = (count(w, c) + 1) / (Σ counts in c + V)', p: 'V is the vocabulary size.' },
    ],
    example: {
      intro: 'A review contains "late" and "refund". Prior P(complaint) = 0.2.',
      steps: ['Complaint: 0.2 × P(late | C) × P(refund | C) = 0.2 × 0.5 × 0.4 = <b>0.04</b>.', 'Praise: 0.8 × 0.05 × 0.02 = <b>0.0008</b>.', 'Normalise: 0.04 / (0.04 + 0.0008) = 0.04 / 0.0408 ≈ <b>0.980</b>.', 'With "late" alone: 0.1 / (0.1 + 0.04) ≈ <b>0.714</b>.'],
    },
  },
  code: {
    scratch: { why: 'Word counts, smoothing and posteriors, in plain Python.', src: `from collections import Counter
from math import exp, log

train = [("late delivery want refund", "complaint"), ("arrived late again", "complaint"),
         ("refund not received", "complaint"), ("lovely saree great quality", "praise"),
         ("great fit fast delivery", "praise"), ("quality is great", "praise"), ("love the colour", "praise")]
counts = {c: Counter() for c in ("complaint", "praise")}
docs = Counter(label for _, label in train)
for text, label in train:
    counts[label].update(text.split())
vocab = {w for c in counts.values() for w in c}


def posterior(text):
    scores = {}
    for c in counts:
        total = sum(counts[c].values())
        s = log(docs[c] / len(train))
        for w in text.split():
            s += log((counts[c][w] + 1) / (total + len(vocab)))
        scores[c] = s
    z = sum(exp(v) for v in scores.values())
    return {c: round(exp(v) / z, 3) for c, v in scores.items()}


print(posterior("late refund"))
print(posterior("great quality"))` },
    library: { why: 'scikit-learn: count words, then multinomial Naive Bayes.', src: `from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

texts = ["late delivery want refund", "arrived late again", "refund not received", "package damaged refund please",
         "lovely saree great quality", "great fit fast delivery", "quality is great", "love the colour",
         "fast delivery thank you", "damaged box late"]
labels = ["complaint", "complaint", "complaint", "complaint", "praise", "praise", "praise", "praise", "praise", "complaint"]

model = make_pipeline(CountVectorizer(), MultinomialNB(alpha=1.0)).fit(texts, labels)
for review in ["refund for late order", "great colour and quality", "delivery was fast"]:
    p = model.predict_proba([review])[0]
    print(f"{review!r:28s} -> {model.predict([review])[0]:9s} P(complaint)={p[0]:.2f}")` },
    prod: { why: 'A tested routing function with a confidence floor: unsure tickets go to a person.', src: `from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import ComplementNB
from sklearn.pipeline import make_pipeline

texts = ["late delivery want refund", "arrived late again", "refund not received", "package damaged refund please",
         "lovely saree great quality", "great fit fast delivery", "quality is great", "love the colour"]
labels = ["complaint"] * 4 + ["praise"] * 4
model = make_pipeline(TfidfVectorizer(), ComplementNB()).fit(texts, labels)


def route(ticket: str, floor: float = 0.65) -> str:
    probs = dict(zip(model.classes_, model.predict_proba([ticket])[0]))
    label, p = max(probs.items(), key=lambda kv: kv[1])
    return label if p >= floor else "human review"


assert route("refund late damaged") == "complaint"
for t in ["refund late damaged", "great quality", "where is my parcel"]:
    print(f"{t!r:24s} -> {route(t)}")` },
  },
  industry: {
    when: ['Text classification baselines: spam, complaint detection, ticket routing.', 'Very little training data or the need for very fast training.', 'Streaming updates: counts are easy to update.'],
    baseline: 'Naive Bayes on word counts is the first baseline for any text classifier; transformers (Phase 3) must beat it.',
    tools: ['scikit-learn MultinomialNB, ComplementNB, BernoulliNB, GaussianNB', 'CountVectorizer / TfidfVectorizer'],
    tradeoffs: ['Extremely fast and data-efficient, but probabilities are often overconfident.', 'Independence assumption ignores word order and phrases.'],
    failures: ['No smoothing: unseen words zero out a class.', 'Trusting its probabilities without calibration.', 'Code-mixed Tamil–English text broken into meaningless tokens (Phase 3).'],
    shopsense: 'Support tickets are routed by a Naive Bayes baseline until the Phase 3 transformer classifier replaces it.',
    interview: [
      ['Why is Naive Bayes called naive?', 'It assumes features are conditionally independent given the class, which is rarely true but often works.'],
      ['What is Laplace smoothing for?', 'To avoid zero probabilities for words not seen with a class, which would make the whole product zero.'],
      ['Why use log-probabilities?', 'Multiplying many small probabilities underflows to zero; adding logs is numerically stable.'],
    ],
  },
  quiz: [
    { q: 'P(complaint) = 0.2, P(late | C) = 0.5, P(late | praise) = 0.05. P(complaint | late)?', opts: ['0.10', '0.50', '≈ 0.71', '0.95'], a: 2, why: '0.1 / (0.1 + 0.04).' },
    { q: 'What does "naive" refer to?', opts: ['Small data', 'Assuming features are independent given the class', 'No smoothing', 'Binary labels only'], a: 1, why: 'Likelihoods are multiplied as if independent.' },
    { q: 'A word never appeared in praise reviews. Without smoothing, P(praise | review with that word) =', opts: ['0', '0.5', '1', 'Undefined'], a: 0, why: 'One zero factor zeroes the product.' },
    { q: 'Why add log-probabilities instead of multiplying?', opts: ['Faster typing', 'To avoid numerical underflow', 'It changes the answer', 'Required by Bayes'], a: 1, why: 'Products of many small numbers underflow.' },
    { q: 'Naive Bayes is a good first choice for…', opts: ['Image segmentation', 'Text classification baselines', 'Time-series forecasting', 'Clustering'], a: 1, why: 'Fast, data-efficient and strong on word counts.' },
  ],
  exercise: {
    task: ['Write <code>nb_posterior(prior, like_c, like_not)</code> for one class against the rest, where <code>like_c</code> and <code>like_not</code> are lists of word likelihoods. Compute <code>p</code> for prior 0.2, likelihoods [0.5, 0.4] vs [0.05, 0.02].'],
    starter: `def nb_posterior(prior, like_c, like_not):
    pass


p = nb_posterior(0.2, [0.5, 0.4], [0.05, 0.02])
print(p)`,
    check: `assert abs(nb_posterior(0.2, [0.5], [0.05]) - 0.1 / 0.14) < 1e-12
assert abs(p - 0.04 / 0.0408) < 1e-12`,
    solution: `from math import prod


def nb_posterior(prior, like_c, like_not):
    a = prior * prod(like_c)
    b = (1 - prior) * prod(like_not)
    return a / (a + b)


p = nb_posterior(0.2, [0.5, 0.4], [0.05, 0.02])
print(p)`,
    hint: 'Multiply the prior by all the class likelihoods; do the same for "not"; normalise.',
  },
};

// ===================================================================== P1.15
const l15 = {
  id: 'p1-15', title: 'Feature engineering', time: '40 minutes',
  sub: 'Turn raw tables into the signals a model can use: recency, frequency, ratios, calendar effects and encoded categories. Often worth more than a fancier model.',
  learn: ['Build RFM (recency, frequency, monetary) features from orders', 'Encode dates and categories correctly', 'Avoid features that leak the label or explode in size'],
  legend: [[DATA, 'raw data'], [GOOD, 'feature'], [BAD, 'risky feature'], [MODEL, 'model']],
  steps: [
    {
      t: 'Raw orders are not features', b: ['The orders table has one row per order: customer, date, amount. A churn model needs one row per customer with numbers that describe behaviour.'],
      n: 'Feature engineering turns events into a customer profile.',
      s: { raw: Cy('orders\none row per order', 0, 1.8, { c: 'blue', r: 0.8, h: 1.1, fs: 9.5 }), m: B('model', 8.4, 1.8, { c: 'brand', w: 1.3, d: 1.2, h: 1.0, fs: 12 }) },
    },
    {
      t: 'RFM: the classic trio', b: ['<b>Recency</b>: days since the last order. <b>Frequency</b>: orders in the last 90 days. <b>Monetary</b>: spend in the last 90 days.', 'These three explain a large share of churn in most retail businesses.'],
      n: 'All computed up to the cutoff date (P1.02).',
      s: { ...Object.fromEntries([['recency', 'days since last order'], ['frequency', 'orders in 90 days'], ['monetary', 'spend in 90 days']].map(([k, t], i) => [k, Tl(t, 4.2, i * 1.4 + 0.4, { top: 1, c: 'green', w: 2.6, d: 1.0, fs: 9.5 })])) },
      l: { a: L('raw', 'frequency', { flow: 1 }), b: L('frequency', 'm', { flow: 1, c: 'green' }) },
    },
    {
      t: 'Ratios, trends and calendar', b: ['Ratios capture change: orders in the last 30 days ÷ orders in the previous 60. Trends: is spend rising or falling? Calendar: is a festival coming, which day of the week, month end?', 'Dates are never fed in raw: they become days-since, day-of-week or festival flags.'],
      n: 'A falling order rate is often the earliest churn signal.',
      s: { trend: Tl('order trend\n30 d ÷ previous 60 d', 4.2, 4.6, { top: 1, c: 'green', w: 2.6, d: 1.1, fs: 9 }), cal: Tl('festival in next\n30 days?', 4.2, 6.0, { top: 1, c: 'green', w: 2.6, d: 1.1, fs: 9 }) },
    },
    {
      t: 'Encode categories', b: ['City or favourite category are text. One-hot encoding makes one 0/1 column per value. For high-cardinality columns (thousands of products), use grouping, frequency encoding or target encoding fitted inside cross-validation.'],
      n: 'Trees can split on integer codes; linear models need one-hot columns.',
      s: { city: Tl('city → one-hot\nis_chennai, is_madurai…', 4.2, -1.2, { top: 1, c: 'amber', w: 2.8, d: 1.1, fs: 8.5 }) },
    },
    {
      t: 'Features that bite back', b: ['"Number of retention calls received" looks predictive, but calls are made because the customer was already at risk: it encodes the label. "Customer ID" lets a model memorise individuals.', 'Every feature needs a reason it would be known at prediction time and would generalise.'],
      n: 'If a single feature looks too good, suspect leakage (next lesson).',
      warn: true,
      s: { bad1: Tl('retention calls received', 1.4, 5.2, { top: 1, c: 'coral', w: 2.6, d: 1.0, fs: 9, hl: 1 }), bad2: Tl('customer ID', 1.4, 6.6, { top: 1, c: 'coral', w: 2.0, d: 1.0, fs: 9.5, hl: 1 }) },
    },
  ],
  math: {
    blocks: [
      { h: 'RFM at cutoff t', f: 'recency = t − last order date (days)\nfrequency = number of orders in (t − 90, t]\nmonetary = Σ amount in (t − 90, t]' },
      { h: 'Ratio feature', f: 'trend = orders(t − 30, t] / max(1, orders(t − 90, t − 30])', p: 'The max(1, …) avoids division by zero.' },
      { h: 'Cyclical encoding', f: 'dow_sin = sin(2π · day / 7),  dow_cos = cos(2π · day / 7)', p: 'Lets a model see that Sunday is next to Monday.' },
    ],
    example: {
      intro: 'Priya’s orders before the cutoff of 3 November: 10 Aug (₹1,299), 2 Sep (₹799), 20 Oct (₹2,499).',
      steps: ['Recency: 3 Nov − 20 Oct = <b>14 days</b>.', 'Frequency (90 days, from 5 Aug): all three orders are inside, so <b>3</b>.', 'Monetary: 1,299 + 799 + 2,499 = <b>₹4,597</b>.', 'Trend: orders in the last 30 days (since 4 Oct) = 1; previous 60 days = 2; trend = 1 / 2 = <b>0.5</b>: she is ordering less often.'],
    },
  },
  code: {
    scratch: { why: 'RFM and a trend feature for one customer, by hand.', src: `from datetime import date

cutoff = date(2026, 11, 3)
orders = [(date(2026, 8, 10), 1299), (date(2026, 9, 2), 799), (date(2026, 10, 20), 2499)]

recency = (cutoff - max(d for d, _ in orders)).days
in_90 = [(d, a) for d, a in orders if 0 <= (cutoff - d).days < 90]
last_30 = sum(1 for d, _ in orders if (cutoff - d).days < 30)
prev_60 = sum(1 for d, _ in orders if 30 <= (cutoff - d).days < 90)

print("recency:", recency, "days")
print("frequency:", len(in_90), " monetary: ₹", sum(a for _, a in in_90))
print("trend:", last_30 / max(1, prev_60))` },
    library: { why: 'RFM, trend and calendar features for every customer with pandas.', src: `import numpy as np
import pandas as pd

rng = np.random.default_rng(0)
n = 2_000
orders = pd.DataFrame({
    "customer": rng.integers(1, 301, n),
    "order_date": pd.Timestamp("2026-06-01") + pd.to_timedelta(rng.integers(0, 155, n), unit="D"),
    "amount": rng.gamma(2, 700, n).round(),
    "city": rng.choice(["Coimbatore", "Chennai", "Madurai"], n),
})
cutoff = pd.Timestamp("2026-11-03")
past = orders[orders["order_date"] <= cutoff]
days_ago = (cutoff - past["order_date"]).dt.days

f = past.assign(days_ago=days_ago).groupby("customer").agg(
    recency=("days_ago", "min"),
    frequency_90=("days_ago", lambda d: (d < 90).sum()),
    monetary_90=("amount", lambda a: a[days_ago.loc[a.index] < 90].sum()),
    last_30=("days_ago", lambda d: (d < 30).sum()),
    prev_60=("days_ago", lambda d: ((d >= 30) & (d < 90)).sum()),
    city=("city", lambda c: c.mode().iloc[0]),
)
f["trend"] = f["last_30"] / f["prev_60"].clip(lower=1)
f = pd.get_dummies(f.drop(columns=["last_30", "prev_60"]), columns=["city"], dtype=int)
print(f.head())
print(f.shape)` },
    prod: { why: 'A ColumnTransformer that encodes and scales in one fitted, reusable object.', src: `import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

rng = np.random.default_rng(1)
X = pd.DataFrame({
    "recency": rng.integers(0, 120, 500), "frequency_90": rng.poisson(3, 500),
    "monetary_90": rng.gamma(2, 900, 500), "city": rng.choice(["Coimbatore", "Chennai", "Madurai"], 500),
})
y = (rng.random(500) < 1 / (1 + np.exp(-(0.04 * X["recency"] - 0.5 * X["frequency_90"] - 0.5)))).astype(int)

prep = ColumnTransformer([
    ("num", StandardScaler(), ["recency", "frequency_90", "monetary_90"]),
    ("cat", OneHotEncoder(handle_unknown="ignore"), ["city"]),
])
model = Pipeline([("prep", prep), ("clf", LogisticRegression())]).fit(X, y)
new = pd.DataFrame({"recency": [45], "frequency_90": [1], "monetary_90": [800.0], "city": ["Salem"]})  # unseen city
print("features after encoding:", list(model[0].get_feature_names_out()))
print("P(churn) for a new Salem customer:", round(model.predict_proba(new)[0, 1], 2))` },
  },
  industry: {
    when: ['Every tabular ML project, before and alongside model choice.', 'When a better model gives little gain: better features usually give more.', 'After error analysis shows a group the model gets wrong.'],
    baseline: 'Start with RFM plus a few domain features; add more only if they improve validation scores.',
    tools: ['pandas groupby and window functions, SQL', 'scikit-learn ColumnTransformer, OneHotEncoder, TargetEncoder', 'Feature stores in production (Phase 6)'],
    tradeoffs: ['More features can add signal but also noise, leakage risk and maintenance.', 'Hand-crafted features are explainable; automated feature generation is faster but opaque.'],
    failures: ['Features computed with data after the cutoff.', 'Target encoding fitted on all data (leakage).', 'Training and serving computing the same feature differently (train/serve skew).'],
    shopsense: 'The Phase 1 churn model’s features are RFM, order trend, late-delivery count, support tickets and festival flags, all computed by one shared function for training and nightly scoring.',
    interview: [
      ['What are RFM features?', 'Recency (time since last purchase), frequency (number of purchases in a window) and monetary value (spend in a window): strong, simple behaviour signals.'],
      ['How do you encode a categorical feature with 50,000 values?', 'Group rare values, use frequency or target encoding fitted inside cross-validation, hashing, or learned embeddings.'],
      ['What is train/serve skew?', 'A difference between how features are computed in training and in production, which silently degrades the model; prevent it with one shared feature pipeline.'],
    ],
  },
  quiz: [
    { q: 'Last order 20 Oct, cutoff 3 Nov. Recency?', opts: ['3', '14', '20', '34'], a: 1, why: '14 days.' },
    { q: 'Why not feed a raw date into a model?', opts: ['Dates are too big', 'Models need meaningful numbers such as days-since or day-of-week', 'Dates are always wrong', 'It is illegal'], a: 1, why: 'Encode what matters about the date.' },
    { q: '"Retention calls received" predicts churn well. Why is it risky?', opts: ['It is expensive', 'Calls happen because the customer was already at risk: it encodes the label', 'It is categorical', 'It has missing values'], a: 1, why: 'It is a consequence, not a cause known in advance.' },
    { q: 'A linear model and a city column with 3 values. Best encoding?', opts: ['Integer codes 1, 2, 3', 'One-hot encoding', 'Drop it', 'Use the city name as text'], a: 1, why: 'Integer codes impose a false order.' },
    { q: 'What is train/serve skew?', opts: ['Imbalanced labels', 'Features computed differently in training and production', 'Slow servers', 'Large models'], a: 1, why: 'One shared feature pipeline prevents it.' },
  ],
  exercise: {
    task: ['Write <code>rfm(order_days_ago, amounts)</code> returning <code>(recency, frequency_90, monetary_90)</code>, where <code>order_days_ago</code> lists how many days before the cutoff each order was placed.'],
    starter: `def rfm(order_days_ago, amounts):
    pass


print(rfm([85, 62, 14, 130], [1299, 799, 2499, 999]))`,
    check: `assert rfm([85, 62, 14, 130], [1299, 799, 2499, 999]) == (14, 3, 1299 + 799 + 2499)
assert rfm([95], [500]) == (95, 0, 0), "orders 90+ days ago are outside the window"`,
    solution: `def rfm(order_days_ago, amounts):
    recency = min(order_days_ago)
    in_window = [a for d, a in zip(order_days_ago, amounts) if d < 90]
    return recency, len(in_window), sum(in_window)


print(rfm([85, 62, 14, 130], [1299, 799, 2499, 999]))`,
    hint: 'Recency is the smallest days-ago value; the 90-day window keeps orders with days-ago below 90.',
  },
};

// ===================================================================== P1.16
const l16 = {
  id: 'p1-16', title: 'Data leakage', time: '35 minutes',
  sub: 'Catch information that would not exist at prediction time before it makes a useless model look brilliant.',
  learn: ['Recognise target leakage, time leakage and train–test contamination', 'Audit features with timing questions and single-feature scores', 'Prevent leakage with cutoffs, pipelines and group-aware splits'],
  legend: [[DATA, 'safe feature'], [BAD, 'leak'], [GOOD, 'pipeline'], [SIGNAL, 'suspicious score']],
  steps: [
    {
      t: 'Too good to be true', b: ['A new churn model scores ROC-AUC 0.97 in testing. Real churn models usually land between 0.70 and 0.85. A score this high is a warning, not a celebration.'],
      n: 'When results look amazing, look for a leak first.',
      warn: true,
      s: mg(bars('s', [1.6, 1.9, 2.8], { x: 0, y: 0, dx: 2.2, w: 1.1, d: 1.1, c: 'blue', labels: ['typical 0.75', 'good 0.85', 'suspicious 0.97'] }), { s2: { c: 'coral' } }),
    },
    {
      t: 'Target leakage', b: ['The model used "refund issued in the last 30 days". But many refunds were issued <i>after</i> the customer complained and left: the feature is partly a record of the churn itself.', 'In production, at prediction time, that information does not exist yet.'],
      n: 'Ask of every feature: when exactly is this value recorded?',
      clear: true,
      s: { tl: S(5, 0, 10, 0.6, { c: 'slate', h: 0.05 }), cut: B('', 4.0, 0, { c: 'amber', w: 0.1, d: 1.1, h: 1.0, noshadow: 1 }), cl: T('prediction time', 4.0, -1.2, { z: 1.2, fs: 12, b: 1, c: 'amber' }), f1: Tl('last order', 1.6, 1.4, { top: 1, c: 'blue', w: 1.6, d: 0.9, fs: 9.5 }), f2: Tl('refund issued', 6.8, 1.4, { top: 1, c: 'coral', w: 1.8, d: 0.9, fs: 9.5, hl: 1 }) },
    },
    {
      t: 'Train–test contamination', b: ['Scaling or imputing with statistics from all rows, then splitting, lets test data influence training. So does having the same customer in both train and test.', 'Fix: put preprocessing inside a Pipeline and split by customer (GroupKFold) or by time.'],
      n: 'The test set must be untouched by anything learned during training.',
      clear: true,
      s: { all: Cy('all data', 0, 1.6, { c: 'blue', r: 0.7, h: 1.0, fs: 10 }), sc: B('scaler fitted\non ALL rows', 3.2, 1.6, { c: 'coral', w: 1.8, d: 1.3, h: 0.7, fs: 9 }), tr: Tl('train', 6.4, 0.6, { top: 1, c: 'blue', w: 1.4, d: 0.9, fs: 10 }), te: Tl('test', 6.4, 2.6, { top: 1, c: 'coral', w: 1.4, d: 0.9, fs: 10 }) },
      l: { a: L('all', 'sc', { flow: 1, c: 'coral' }), b: L('sc', 'tr', { c: 'muted' }), c: L('sc', 'te', { c: 'coral' }) },
    },
    {
      t: 'Audit with single-feature scores', b: ['Train a model on each feature alone. A single feature with ROC-AUC above 0.9 is either a miracle or a leak; it is almost always a leak.', 'Then confirm the timing with the team that produces the data.'],
      n: 'Leaks are found by questions as much as by code.',
      clear: true,
      s: mg(bars('f', [1.6, 0.8, 0.3, 2.6], { x: 0, y: 0, dx: 1.6, w: 0.9, d: 0.9, c: 'blue', labels: ['recency 0.81', 'frequency 0.63', 'city 0.51', 'refund 0.93'] }), { f3: { c: 'coral' } }),
    },
    {
      t: 'The fix, and an honest score', b: ['Drop the leaky feature, compute everything as of the cutoff, keep preprocessing in a pipeline, and split by time. The honest ROC-AUC drops to 0.83.', 'Lower, but real: this model will perform like this in production.'],
      n: 'An honest 0.83 beats a fake 0.97 every time.',
      clear: true,
      s: mg(bars('h', [2.8, 1.95], { x: 0, y: 0, dx: 2.6, w: 1.2, d: 1.2, c: 'coral', labels: ['with leak 0.97', 'honest 0.83'] }), { h1: { c: 'green' } }),
    },
  ],
  math: {
    blocks: [
      { h: 'The leakage test for a feature', f: 'feature value must be computable using only data with timestamp ≤ cutoff', p: 'Formally: features at time t must be measurable with respect to the information available at t.' },
      { h: 'Single-feature screening', f: 'AUCⱼ = ROC-AUC of a model using feature j alone', p: 'Flag any feature whose single-feature AUC is close to the full model’s, or above about 0.9 on a hard problem.' },
    ],
    example: {
      intro: 'Why does a leaky feature inflate the score?',
      steps: ['Suppose 90% of churners received a refund after leaving, but only 2% of active customers received one.', 'A rule "refund issued → churn" already catches 90% of churners while flagging only 2% of active customers.', 'With 10% churn among 1,000 customers: TP = 90, FP = 0.02 × 900 = 18. Precision = 90 / 108 ≈ <b>0.83</b> from one feature.', 'At prediction time the refund has not happened yet, so in production this feature is mostly zero and the model collapses.'],
    },
  },
  code: {
    scratch: { why: 'A leaky feature makes the score jump; removing it gives the honest number.', src: `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(0)
n = 5_000
recency = rng.integers(0, 120, n)
frequency = rng.poisson(3, n)
churn = (rng.random(n) < 1 / (1 + np.exp(-(-2 + 0.04 * recency - 0.4 * frequency)))).astype(int)
refund_after = np.where(churn == 1, rng.random(n) < 0.9, rng.random(n) < 0.02).astype(int)   # recorded AFTER churn

for name, X in [("with leak", np.c_[recency, frequency, refund_after]), ("honest", np.c_[recency, frequency])]:
    X_tr, X_te, y_tr, y_te = train_test_split(X, churn, test_size=0.3, random_state=0)
    auc = roc_auc_score(y_te, LogisticRegression().fit(X_tr, y_tr).predict_proba(X_te)[:, 1])
    print(f"{name:10s} ROC-AUC {auc:.3f}")` },
    library: { why: 'Single-feature screening flags the leak automatically.', src: `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

rng = np.random.default_rng(0)
n = 5_000
features = {
    "recency": rng.integers(0, 120, n),
    "frequency": rng.poisson(3, n),
    "city_code": rng.integers(0, 5, n),
}
logit = -2 + 0.04 * features["recency"] - 0.4 * features["frequency"]
churn = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)
features["refund_issued"] = np.where(churn == 1, rng.random(n) < 0.9, rng.random(n) < 0.02).astype(int)

for name, values in features.items():
    auc = cross_val_score(LogisticRegression(), values.reshape(-1, 1), churn, cv=5, scoring="roc_auc").mean()
    flag = "  <- suspicious, check its timing" if auc > 0.9 else ""
    print(f"{name:14s} single-feature ROC-AUC {auc:.3f}{flag}")` },
    prod: { why: 'Preprocessing inside the pipeline and customer-grouped folds: contamination cannot happen.', src: `import numpy as np
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GroupKFold, cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(2)
customers = rng.integers(0, 800, 4_000)            # several rows (weekly snapshots) per customer
X = np.c_[rng.integers(0, 120, 4_000).astype(float), rng.poisson(3, 4_000).astype(float)]
X[rng.random(4_000) < 0.05, 1] = np.nan
y = (rng.random(4_000) < 1 / (1 + np.exp(-(-2 + 0.04 * X[:, 0])))).astype(int)

model = make_pipeline(SimpleImputer(strategy="median"), StandardScaler(), LogisticRegression())
scores = cross_val_score(model, X, y, groups=customers, cv=GroupKFold(n_splits=5), scoring="roc_auc")
print(f"grouped CV ROC-AUC {scores.mean():.3f} ± {scores.std(ddof=1):.3f}")
print("imputer and scaler were fitted inside each training fold only")` },
  },
  industry: {
    when: ['Before trusting any surprisingly good result.', 'In every design review of a new feature.', 'When production performance is far below offline results.'],
    baseline: 'For each feature, record its source table and the timestamp it becomes known. Run single-feature screening before training the full model.',
    tools: ['scikit-learn Pipeline, GroupKFold, TimeSeriesSplit', 'Point-in-time joins in feature stores', 'Data lineage notes in the decision log'],
    tradeoffs: ['Strict cutoffs remove some useful but late information.', 'Group-aware splits give lower but honest scores.'],
    failures: ['Features recorded after the outcome (refunds, cancellations, agent notes).', 'Normalising on all data before splitting.', 'The same customer or household in train and test.', 'Using future prices or stock levels in demand features.'],
    shopsense: 'The Phase 1 project includes a leakage audit as an L2 requirement and a failure drill where a post-churn feature is discovered.',
    interview: [
      ['What is data leakage?', 'When training data contains information that would not be available at prediction time, making offline performance unrealistically good.'],
      ['How do you detect leakage?', 'Suspiciously high scores, single features with near-perfect predictive power, checking each feature’s timestamp against the prediction time, and comparing offline with production results.'],
      ['How do pipelines prevent leakage?', 'They fit preprocessing steps only on each training fold during cross-validation, so validation data never influences them.'],
    ],
  },
  quiz: [
    { q: 'A churn model scores ROC-AUC 0.99. First reaction?', opts: ['Ship it', 'Suspect leakage and audit features', 'Add more features', 'Retrain on the test set'], a: 1, why: 'Real churn rarely allows near-perfect ranking.' },
    { q: 'Which feature leaks for a churn model predicting next month?', opts: ['Days since last order', 'Refund issued after the customer left', 'Orders in the last 90 days', 'City'], a: 1, why: 'It is recorded after the outcome.' },
    { q: 'Scaling with statistics from all rows before splitting is…', opts: ['Best practice', 'Train–test contamination', 'Required by scikit-learn', 'Harmless always'], a: 1, why: 'Test data influences the training transformation.' },
    { q: 'Weekly snapshots of the same customers. Which split?', opts: ['Random rows', 'GroupKFold by customer (or by time)', 'No split', 'Split by city'], a: 1, why: 'The same customer in train and test inflates scores.' },
    { q: 'After removing a leak, ROC-AUC falls from 0.97 to 0.83. This means…', opts: ['The model got worse', 'You now have an honest estimate of production performance', 'You should restore the leak', 'The data is broken'], a: 1, why: 'The old score was never real.' },
  ],
  exercise: {
    task: ['Write <code>suspicious(feature_aucs, threshold=0.9)</code> returning the sorted list of feature names whose single-feature AUC is above the threshold.'],
    starter: `def suspicious(feature_aucs, threshold=0.9):
    pass


aucs = {"recency": 0.66, "refund_issued": 0.96, "frequency": 0.70, "agent_note_length": 0.93}
print(suspicious(aucs))`,
    check: `assert suspicious(aucs) == ["agent_note_length", "refund_issued"]
assert suspicious({"a": 0.95}, threshold=0.97) == []`,
    solution: `def suspicious(feature_aucs, threshold=0.9):
    return sorted(name for name, auc in feature_aucs.items() if auc > threshold)


aucs = {"recency": 0.66, "refund_issued": 0.96, "frequency": 0.70, "agent_note_length": 0.93}
print(suspicious(aucs))`,
    hint: 'A sorted comprehension over <code>feature_aucs.items()</code>.',
  },
};

// ===================================================================== P1.17
const l17 = {
  id: 'p1-17', title: 'Imbalanced data', time: '35 minutes',
  sub: 'When the event you care about is rare, rebalance the learning, judge with the right metric, and set the threshold from costs.',
  learn: ['Explain why rare classes break naive training and accuracy', 'Use class weights, resampling and threshold moving appropriately', 'Evaluate with PR-AUC and precision at a budget'],
  legend: [[DATA, 'majority class'], [BAD, 'rare class'], [GOOD, 'weighted'], [SIGNAL, 'threshold']],
  steps: [
    {
      t: 'A rare event', b: ['Of 10,000 transactions, 200 are fraudulent (2%). A model that says "never fraud" is 98% accurate and completely useless.'],
      n: 'Coral tiles are the rare class.',
      s: (() => { const o = {}; for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) o[`g${i}${j}`] = { k: 'tile', x: j * 0.62, y: i * 0.62, w: 0.54, d: 0.54, h: 0.1, c: i === 3 && j < 2 ? 'coral' : 'blue' }; return o; })(),
    },
    {
      t: 'The model barely sees the rare class', b: ['During training, 98% of the loss comes from normal transactions. The easiest way to reduce it is to predict "normal" almost always.'],
      n: 'Imbalance is not a bug in the data; it is the reality the model must handle.',
      clear: true,
      s: mg(bars('w', [2.8, 0.06], { x: 0, y: 0, dx: 2.4, w: 1.2, d: 1.2, c: 'blue', labels: ['normal: 98% of loss', 'fraud: 2%'] }), { w1: { c: 'coral' } }),
    },
    {
      t: 'Class weights', b: ['Give each fraud example more weight in the loss. "Balanced" weights make both classes count equally in total: fraud weight 25, normal weight about 0.51.', 'The model now pays attention to fraud.'],
      n: 'Weights change what the model optimises; they do not change the data.',
      s: { w0: { sub: 'normal × 0.51' }, w1: { h: 2.75, c: 'green', sub: 'fraud × 25' } },
    },
    {
      t: 'Resampling, with care', b: ['Alternatives: undersample normal transactions, or oversample fraud (for example with SMOTE). Resample <b>only the training folds</b>, never the validation or test data.', 'Resampling changes the predicted probabilities; recalibrate if you need real probabilities.'],
      n: 'Class weights are usually simpler and work as well.',
      warn: true,
      s: { note: T('resample training folds only', 1.4, -1.8, { z: 2.8, fs: 12.5, b: 1, c: 'coral' }) },
    },
    {
      t: 'Judge and decide correctly', b: ['Evaluate with PR-AUC and with precision and recall at the number of cases the team can review (for example 300 a day).', 'Then set the threshold from costs: a missed fraud costs ₹8,000; blocking a genuine customer costs about ₹200 in lost goodwill.'],
      n: 'Rare-event systems are judged at the operating point, not by accuracy.',
      clear: true,
      s: { tl: S(5, 0, 10, 0.6, { c: 'slate', h: 0.05 }), th: B('', 2.0, 0, { c: 'amber', w: 0.1, d: 1.1, h: 1.0, noshadow: 1 }), thl: T('threshold set from costs', 2.0, -1.2, { z: 1.2, fs: 12, b: 1, c: 'amber' }), lo: T('allow', 0.8, 1.1, { fs: 11.5, c: 'muted' }), hi: T('send to review', 6.4, 1.1, { fs: 11.5, c: 'coral', b: 1 }) },
    },
  ],
  math: {
    blocks: [
      { h: 'Balanced class weights', f: 'w_c = n / (k · n_c)', p: 'n = total rows, k = number of classes, n_c = rows in class c.' },
      { h: 'Cost-based threshold', f: 'flag when p · cost_miss > (1 − p) · cost_false_alarm\n⇔ p > cost_false_alarm / (cost_false_alarm + cost_miss)', p: 'Valid when p is a calibrated probability.' },
    ],
    example: {
      intro: '10,000 transactions, 200 fraud. Missed fraud ₹8,000; false alarm ₹200.',
      steps: ['Fraud weight = 10,000 / (2 × 200) = <b>25</b>. Normal weight = 10,000 / (2 × 9,800) ≈ <b>0.51</b>.', 'Total weight: 200 × 25 = 5,000 and 9,800 × 0.51 ≈ 5,000. The classes now count equally.', 'Threshold = 200 / (200 + 8,000) ≈ <b>0.024</b>: flag any transaction with a fraud probability above about 2.4%.', 'That low threshold reflects how much worse a miss is than a false alarm.'],
    },
  },
  code: {
    scratch: { why: 'Balanced weights and the cost-based threshold from the formulas.', src: `n, n_fraud = 10_000, 200
n_normal = n - n_fraud
w_fraud = n / (2 * n_fraud)
w_normal = n / (2 * n_normal)
print(f"weights: fraud {w_fraud:.1f}, normal {w_normal:.3f}")
print(f"total weight: fraud {n_fraud * w_fraud:.0f}, normal {n_normal * w_normal:.0f}")

cost_miss, cost_false_alarm = 8_000, 200
print(f"cost-based threshold: {cost_false_alarm / (cost_false_alarm + cost_miss):.3f}")` },
    library: { why: 'Accuracy hides the problem; class weights and PR-AUC show it.', src: `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, average_precision_score, recall_score
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(0)
n = 20_000
X = rng.normal(size=(n, 4))
logit = -5 + 1.6 * X[:, 0] + 1.2 * X[:, 1]
y = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)
print(f"fraud rate {y.mean():.2%}")
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)

for name, model in [("plain", LogisticRegression()), ("balanced", LogisticRegression(class_weight="balanced"))]:
    p = model.fit(X_tr, y_tr).predict_proba(X_te)[:, 1]
    pred = (p >= 0.5).astype(int)
    print(f"{name:9s} accuracy {accuracy_score(y_te, pred):.3f}  recall {recall_score(y_te, pred):.3f}  PR-AUC {average_precision_score(y_te, p):.3f}")` },
    prod: { why: 'Precision and recall at a review budget: the number operations actually cares about.', src: `import numpy as np


def at_budget(y: np.ndarray, p: np.ndarray, budget: int) -> dict:
    """Review the budget highest-scored cases. Report what that catches."""
    top = np.argsort(-p)[:budget]
    caught = int(y[top].sum())
    return {"reviewed": budget, "fraud caught": caught,
            "precision": round(caught / budget, 3), "recall": round(caught / max(int(y.sum()), 1), 3)}


rng = np.random.default_rng(3)
y = (rng.random(50_000) < 0.02).astype(int)
p = np.clip(0.02 + 0.5 * y * rng.random(50_000) + 0.1 * rng.random(50_000), 0, 1)
for b in (300, 1_000, 3_000):
    print(at_budget(y, p, b))` },
  },
  industry: {
    when: ['Fraud, churn, defects, rare diseases, ad clicks: anything rare.', 'Whenever the positive class is below roughly 10%.'],
    baseline: 'Plain model plus a tuned threshold, evaluated with PR-AUC and precision at budget. Add class weights next; try resampling last.',
    tools: ['scikit-learn class_weight, average_precision_score, precision_recall_curve', 'imbalanced-learn for resampling inside pipelines'],
    tradeoffs: ['Weights and resampling raise recall but distort probabilities; recalibrate if probabilities are used downstream.', 'Undersampling is fast but throws data away.'],
    failures: ['Reporting accuracy.', 'Resampling before splitting, so synthetic copies leak into validation.', 'A threshold of 0.5 on a 2% problem.'],
    shopsense: 'Churn is about 8% at ShopSense; the Phase 1 side lab on card fraud works at 0.2%, where these techniques decide everything.',
    interview: [
      ['How do you handle a 1% positive class?', 'Use stratified splits, class weights or careful resampling inside training folds, evaluate with PR-AUC and precision/recall at the operating point, and choose the threshold from costs.'],
      ['Why not oversample before splitting?', 'Copies or synthetic neighbours of the same examples end up in both training and validation, inflating scores.'],
      ['Why is PR-AUC preferred to ROC-AUC for rare events?', 'ROC-AUC can look high because true negatives are plentiful; PR-AUC focuses on the positive class and reflects precision directly.'],
    ],
  },
  quiz: [
    { q: '10,000 rows, 200 positives. Balanced weight for positives?', opts: ['2', '25', '50', '0.51'], a: 1, why: '10,000 / (2 × 200).' },
    { q: '2% fraud. Accuracy of "never fraud"?', opts: ['2%', '50%', '98%', '100%'], a: 2, why: 'It is right for every normal transaction.' },
    { q: 'Missed fraud ₹8,000, false alarm ₹200. Cost-based threshold?', opts: ['0.5', '≈ 0.024', '0.2', '0.976'], a: 1, why: '200 / 8,200.' },
    { q: 'When should resampling happen?', opts: ['Before splitting', 'Inside training folds only', 'On the test set', 'Never'], a: 1, why: 'Otherwise validation is contaminated.' },
    { q: 'Which metric best summarises a rare-event classifier?', opts: ['Accuracy', 'PR-AUC', 'R²', 'MAE'], a: 1, why: 'It focuses on the rare class.' },
  ],
  exercise: {
    task: ['Write <code>balanced_weights(n_pos, n_neg)</code> returning <code>(w_pos, w_neg)</code>, and <code>cost_threshold(cost_miss, cost_fa)</code>. Compute both for 150 positives, 14,850 negatives, a ₹5,000 miss and a ₹250 false alarm.'],
    starter: `def balanced_weights(n_pos, n_neg):
    pass


def cost_threshold(cost_miss, cost_fa):
    pass


w = balanced_weights(150, 14_850)
t = cost_threshold(5_000, 250)
print(w, t)`,
    check: `wp, wn = w
assert abs(wp - 50) < 1e-12 and abs(wn - 15_000 / 29_700) < 1e-12
assert abs(t - 250 / 5_250) < 1e-12`,
    solution: `def balanced_weights(n_pos, n_neg):
    n = n_pos + n_neg
    return n / (2 * n_pos), n / (2 * n_neg)


def cost_threshold(cost_miss, cost_fa):
    return cost_fa / (cost_fa + cost_miss)


w = balanced_weights(150, 14_850)
t = cost_threshold(5_000, 250)
print(w, t)`,
    hint: 'w_c = n / (2 × n_c); threshold = cost_fa / (cost_fa + cost_miss).',
  },
};

export default [l12, l13, l14, l15, l16, l17];
