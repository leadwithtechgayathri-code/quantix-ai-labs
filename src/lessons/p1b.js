import { B, Tl, O, T, Z, S, P, Cy, Bub, L, row, bars, off, mg } from '../kit.js';

const DATA = '#c4cdfb', GOOD = '#c1e4b1', BAD = '#ffc4b1', SIGNAL = '#fddf98', MODEL = '#d9cafb', SYS = '#b2e5da';

// ===================================================================== P1.07
const cell = (t, x, y, c, o = {}) => ({ k: 'tile', t, x, y, w: 2.6, d: 1.7, h: 0.16, c, fs: 12, top: 1, ...o });
const l7 = {
  id: 'p1-07', title: 'Classification metrics', time: '40 minutes',
  sub: 'Accuracy can lie. Use the confusion matrix, precision, recall and ROC-AUC to judge a classifier by the mistakes that matter.',
  learn: ['Build a confusion matrix and compute precision, recall and F1', 'Explain why accuracy misleads on imbalanced data', 'Read ROC-AUC and PR-AUC and choose a threshold'],
  legend: [[GOOD, 'correct'], [BAD, 'false alarm'], [SIGNAL, 'missed'], [DATA, 'total']],
  steps: [
    {
      t: '1,000 customers, 100 churn', b: ['ShopSense scores 1,000 customers. In reality 100 will churn. The model flags 150 as likely churners.', 'How good is it?'],
      n: 'Churn is the rare class: 10% of customers.',
      s: { all: Tl('1,000 customers\n100 will churn', 0, 0, { c: 'blue', w: 3.0, d: 1.6, fs: 11 }), fl: Tl('model flags 150', 4.4, 0, { c: 'violet', w: 2.4, d: 1.6, fs: 11 }) },
      l: { a: L('all', 'fl', { flow: 1 }) },
    },
    {
      t: 'The confusion matrix', b: ['Of the 150 flagged, 70 really churn (true positives) and 80 do not (false positives). Of the 850 not flagged, 30 churn anyway (false negatives) and 820 stay (true negatives).'],
      n: 'Rows: what really happened. Columns: what the model said.',
      clear: true,
      s: { tp: cell('TP 70', 0, 0, 'green'), fn: cell('FN 30', 3.0, 0, 'amber'), fp: cell('FP 80', 0, 2.0, 'coral'), tn: cell('TN 820', 3.0, 2.0, 'green'), h1: T('model: flagged', 0, -1.5, { z: 0.3, fs: 11.5, b: 1, c: 'muted' }), h2: T('model: not flagged', 3.0, -1.5, { z: 0.3, fs: 11.5, b: 1, c: 'muted' }), r1: T('really churned', -2.4, 0, { z: 0.3, fs: 11.5, b: 1, c: 'muted' }), r2: T('really stayed', -2.4, 2.0, { z: 0.3, fs: 11.5, b: 1, c: 'muted' }) },
    },
    {
      t: 'Accuracy hides the problem', b: ['Accuracy = (70 + 820) / 1,000 = 89%. Sounds good, but a model that says "nobody churns" scores 90% while catching zero churners.', 'On imbalanced data, accuracy rewards ignoring the rare class.'],
      n: 'Never judge a churn or fraud model by accuracy alone.',
      warn: true,
      s: { acc: T('accuracy 89% · "nobody churns" 90%', 2.4, 4.6, { fs: 13, b: 1, c: 'coral' }) },
    },
    {
      t: 'Precision and recall', b: ['<b>Precision</b> = 70 / 150 = 47%: of the customers we flag, how many really churn. It decides wasted coupons. <b>Recall</b> = 70 / 100 = 70%: of real churners, how many we catch. It decides lost customers.', 'F1 = 0.56 combines both into one number.'],
      n: 'Raise the threshold: precision up, recall down. Lower it: the reverse.',
      s: { acc: { t: 'precision 47% · recall 70% · F1 0.56', c: 'green' }, tp: { hl: 1 } },
    },
    {
      t: 'ROC and PR curves', b: ['Every threshold gives a different precision–recall pair. The ROC curve plots true-positive rate against false-positive rate across thresholds; its area (ROC-AUC) is the chance a random churner scores above a random non-churner.', 'For rare classes, the precision–recall curve and its area (PR-AUC) show differences more clearly.'],
      n: 'AUC summarises ranking quality; the threshold is still a business choice.',
      clear: true,
      s: (() => {
        const o = { bx: S(0, -2.0, 0.05, 4.0, { c: 'slate', h: 0.02, noshadow: 1 }), xl: T('false-positive rate →', 0.9, -4.6, { fs: 11, c: 'muted' }), yl: T('true-positive rate', -0.6, 0.8, { z: 2.6, fs: 11, c: 'muted' }) };
        const pts = [[0, 0], [0.05, 0.45], [0.1, 0.62], [0.2, 0.78], [0.35, 0.88], [0.6, 0.96], [1, 1]];
        pts.forEach(([fx, ty], i) => { o['r' + i] = { k: 'orb', x: 0, y: -fx * 4, z: ty * 2.4, r: 0.08, c: 'green', noshadow: 1 }; });
        o.d0 = { k: 'orb', x: 0, y: 0, z: 0, r: 0.03, c: 'slate', o: 0, noshadow: 1 }; o.d1 = { k: 'orb', x: 0, y: -4, z: 2.4, r: 0.03, c: 'slate', o: 0, noshadow: 1 };
        o.al = T('ROC-AUC ≈ 0.87', -0.6, -2.4, { z: 3.0, fs: 12.5, b: 1, c: 'green' }); o.rl = T('random guess', 0.6, -3.0, { z: 1.4, fs: 10.5, c: 'muted' });
        return o;
      })(),
      l: { ...Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`k${i}`, L('r' + i, 'r' + (i + 1), { c: 'green', na: 1, sw: 3 })])), dg: L('d0', 'd1', { c: 'muted', na: 1, dash: 1 }) },
    },
  ],
  math: {
    blocks: [
      { h: 'From the confusion matrix', f: 'precision = TP / (TP + FP)\nrecall = TP / (TP + FN)\nF1 = 2 · precision · recall / (precision + recall)\naccuracy = (TP + TN) / total' },
      { h: 'Rates for the ROC curve', f: 'TPR = recall = TP / (TP + FN)\nFPR = FP / (FP + TN)', p: 'ROC-AUC = P(score of a random positive > score of a random negative).' },
    ],
    example: {
      intro: 'TP = 70, FP = 80, FN = 30, TN = 820.',
      steps: ['Precision = 70 / (70 + 80) = 70 / 150 ≈ <b>0.467</b>. Recall = 70 / (70 + 30) = <b>0.70</b>.', 'F1 = 2 × 0.467 × 0.70 / (0.467 + 0.70) = 0.653 / 1.167 ≈ <b>0.56</b>.', 'Accuracy = (70 + 820) / 1,000 = <b>0.89</b>; predicting "no churn" for all gives 900 / 1,000 = <b>0.90</b>.', 'FPR = 80 / (80 + 820) ≈ <b>0.089</b>. Against the coupon break-even precision of 33% (P1.02), 47% precision makes money.'],
    },
  },
  code: {
    scratch: { why: 'All the metrics from the four counts.', src: `tp, fp, fn, tn = 70, 80, 30, 820

precision = tp / (tp + fp)
recall = tp / (tp + fn)
f1 = 2 * precision * recall / (precision + recall)
accuracy = (tp + tn) / (tp + fp + fn + tn)
baseline = (fp + tn) / (tp + fp + fn + tn)          # always predict "no churn"

print(f"precision {precision:.3f}  recall {recall:.3f}  F1 {f1:.3f}")
print(f"accuracy {accuracy:.2f} vs 'nobody churns' {baseline:.2f}")` },
    library: { why: 'scikit-learn metrics on a trained churn model, including ROC-AUC and PR-AUC.', src: `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, classification_report, confusion_matrix, roc_auc_score
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(0)
n = 5_000
days = rng.integers(0, 120, n)
orders = rng.poisson(3, n)
churn = (rng.random(n) < 1 / (1 + np.exp(-(-3.2 + 0.04 * days - 0.3 * orders)))).astype(int)
X = np.c_[days, orders]
X_tr, X_te, y_tr, y_te = train_test_split(X, churn, test_size=0.3, random_state=0, stratify=churn)

p = LogisticRegression().fit(X_tr, y_tr).predict_proba(X_te)[:, 1]
pred = (p >= 0.3).astype(int)
print(f"churn rate {y_te.mean():.1%}")
print("confusion matrix [[TN FP] [FN TP]]:\\n", confusion_matrix(y_te, pred))
print(classification_report(y_te, pred, digits=3))
print(f"ROC-AUC {roc_auc_score(y_te, p):.3f}   PR-AUC {average_precision_score(y_te, p):.3f}")` },
    prod: { why: 'A threshold report a team reviews before choosing the operating point.', src: `import numpy as np


def threshold_report(y: np.ndarray, p: np.ndarray, thresholds=(0.2, 0.3, 0.4, 0.5)) -> list[dict]:
    rows = []
    for t in thresholds:
        flag = p >= t
        tp = int(np.sum(flag & (y == 1)))
        fp = int(np.sum(flag & (y == 0)))
        fn = int(np.sum(~flag & (y == 1)))
        rows.append({"threshold": t, "flagged": int(flag.sum()),
                     "precision": round(tp / max(tp + fp, 1), 3), "recall": round(tp / max(tp + fn, 1), 3)})
    return rows


rng = np.random.default_rng(2)
p = rng.beta(1.5, 8, 10_000)
y = (rng.random(10_000) < p).astype(int)
for r in threshold_report(y, p):
    print(r)` },
  },
  industry: {
    when: ['Every classifier evaluation.', 'Choosing an operating threshold with the business.', 'Comparing models: ROC-AUC or PR-AUC for ranking, precision at a budget for operations.'],
    baseline: 'Report the trivial model ("always no") and a simple rule beside your model, on the same metrics.',
    tools: ['scikit-learn confusion_matrix, classification_report, roc_auc_score, average_precision_score, precision_recall_curve'],
    tradeoffs: ['Precision vs recall: wasted actions vs missed cases.', 'ROC-AUC can look high on very imbalanced data; PR-AUC is stricter.'],
    failures: ['Reporting accuracy on imbalanced data.', 'Choosing the threshold on the test set.', 'Comparing models at different thresholds.'],
    shopsense: 'The Phase 1 churn model is judged by PR-AUC and by precision when ShopSense can afford 2,000 coupons a week.',
    interview: [
      ['When is precision more important than recall?', 'When false positives are costly, for example blocking genuine payments; recall matters more when misses are costly, such as missing fraud or disease.'],
      ['What does ROC-AUC = 0.5 mean?', 'The model ranks positives and negatives no better than random.'],
      ['Why is accuracy misleading for imbalanced classes?', 'Predicting the majority class gives high accuracy while catching none of the minority class.'],
    ],
  },
  quiz: [
    { q: 'TP 70, FP 80, FN 30, TN 820. What is precision?', opts: ['0.47', '0.70', '0.89', '0.56'], a: 0, why: '70 / 150.' },
    { q: 'Same counts. What is recall?', opts: ['0.47', '0.70', '0.08', '0.97'], a: 1, why: '70 / 100.' },
    { q: 'Churn is 10% of customers. What accuracy does "nobody churns" get?', opts: ['10%', '50%', '90%', '100%'], a: 2, why: 'It is right for the 90% who stay.' },
    { q: 'Lowering the threshold usually…', opts: ['Raises precision and lowers recall', 'Raises recall and lowers precision', 'Changes nothing', 'Raises both'], a: 1, why: 'More customers are flagged: more caught, more false alarms.' },
    { q: 'ROC-AUC is the probability that…', opts: ['The model is correct', 'A random positive scores higher than a random negative', 'Precision exceeds recall', 'The threshold is 0.5'], a: 1, why: 'It measures ranking quality.' },
  ],
  exercise: {
    task: ['Write <code>metrics(tp, fp, fn, tn)</code> returning a dict with <code>precision</code>, <code>recall</code>, <code>f1</code> and <code>accuracy</code>. Compute it for TP 45, FP 15, FN 55, TN 885 and store it in <code>m</code>.'],
    starter: `def metrics(tp, fp, fn, tn):
    pass


m = metrics(45, 15, 55, 885)
print(m)`,
    check: `assert abs(m["precision"] - 0.75) < 1e-12 and abs(m["recall"] - 0.45) < 1e-12
assert abs(m["f1"] - 2 * 0.75 * 0.45 / 1.2) < 1e-12
assert abs(m["accuracy"] - 0.93) < 1e-12`,
    solution: `def metrics(tp, fp, fn, tn):
    precision = tp / (tp + fp)
    recall = tp / (tp + fn)
    return {
        "precision": precision,
        "recall": recall,
        "f1": 2 * precision * recall / (precision + recall),
        "accuracy": (tp + tn) / (tp + fp + fn + tn),
    }


m = metrics(45, 15, 55, 885)
print(m)`,
    hint: 'precision = tp / (tp + fp); recall = tp / (tp + fn).',
  },
};

// ===================================================================== P1.08
const ACT = [100, 120, 80, 200], PRED = [110, 115, 90, 150];
const l8 = {
  id: 'p1-08', title: 'Regression metrics', time: '35 minutes',
  sub: 'Measure how far numeric predictions are from reality with MAE, RMSE, MAPE and R², and pick the one that matches what a miss costs.',
  learn: ['Compute MAE, RMSE, MAPE and R² by hand', 'Explain how RMSE punishes large misses more than MAE', 'Choose a metric from the business cost of errors'],
  legend: [[DATA, 'actual'], [MODEL, 'forecast'], [BAD, 'error']],
  steps: [
    {
      t: 'Four weeks of forecasts', b: ['Weekly saree orders: actual 100, 120, 80 and 200. The forecast said 110, 115, 90 and 150.', 'Week 4 was a festival week the model under-forecast by 50.'],
      n: 'Blue bars are actual orders; violet are the forecast.',
      s: mg(bars('a', ACT.map((v) => v / 80), { x: 0, y: 0, dx: 1.8, w: 0.6, d: 0.6, c: 'blue', labels: ['wk 1', 'wk 2', 'wk 3', 'wk 4'] }), bars('f', PRED.map((v) => v / 80), { x: 0.7, y: 0, dx: 1.8, w: 0.6, d: 0.6, c: 'violet' })),
    },
    {
      t: 'Errors, week by week', b: ['Error = actual − forecast: −10, +5, −10 and +50.', 'A positive error means we under-forecast and may run out of stock; negative means leftover stock.'],
      n: 'The sign matters to operations: stock-outs and overstock cost differently.',
      s: { e0: T('−10', 0.35, 0, { z: 1.9, fs: 12, b: 1, c: 'coral' }), e1: T('+5', 2.15, 0, { z: 2.0, fs: 12, b: 1, c: 'coral' }), e2: T('−10', 3.95, 0, { z: 1.6, fs: 12, b: 1, c: 'coral' }), e3: T('+50', 5.75, 0, { z: 3.0, fs: 13, b: 1, c: 'coral' }) },
    },
    {
      t: 'MAE: the typical miss', b: ['Mean absolute error = (10 + 5 + 10 + 50) / 4 = <b>18.75</b> orders. Easy to explain: "on average we are off by about 19 orders a week".'],
      n: 'MAE treats a 50-order miss as exactly five times a 10-order miss.',
      s: { m: T('MAE 18.75', -1.8, -1.8, { z: 3.4, fs: 14, b: 1, c: 'blue' }) },
    },
    {
      t: 'RMSE: big misses count more', b: ['Root mean squared error squares errors first: √((100 + 25 + 100 + 2,500) / 4) = √681.25 ≈ <b>26.1</b>. The festival miss dominates.', 'Use RMSE when one big miss (an empty shelf at Diwali) hurts more than several small ones.'],
      n: 'RMSE ≥ MAE always; a big gap between them signals a few large errors.',
      s: { m: { t: 'MAE 18.75 · RMSE 26.1' } },
    },
    {
      t: 'MAPE and R²', b: ['MAPE averages percentage errors: (10% + 4.2% + 12.5% + 25%) / 4 ≈ <b>12.9%</b>. Handy across products of different sizes, but it explodes when actuals are near zero.', 'R² compares with always predicting the average.'],
      n: 'Pick the metric whose meaning matches what an error costs the business.',
      s: { m: { t: 'MAE 18.75 · RMSE 26.1 · MAPE 12.9%' } },
    },
  ],
  math: {
    blocks: [
      { h: 'Definitions', f: 'MAE  = (1/n) Σ |yᵢ − ŷᵢ|\nRMSE = √( (1/n) Σ (yᵢ − ŷᵢ)² )\nMAPE = (100/n) Σ |yᵢ − ŷᵢ| / |yᵢ|\nR²   = 1 − Σ(yᵢ − ŷᵢ)² / Σ(yᵢ − ȳ)²' },
      { h: 'Which centre each metric favours', f: 'minimising MAE → median forecast\nminimising RMSE → mean forecast', p: 'For skewed demand, the two can differ a lot.' },
    ],
    example: {
      intro: 'Actual 100, 120, 80, 200; forecast 110, 115, 90, 150.',
      steps: ['Errors y − ŷ: −10, 5, −10, 50. Absolute: 10, 5, 10, 50; MAE = 75 / 4 = <b>18.75</b>.', 'Squares: 100, 25, 100, 2,500; mean 681.25; RMSE = √681.25 ≈ <b>26.10</b>.', 'Percentage errors: 10/100 = 10%, 5/120 ≈ 4.17%, 10/80 = 12.5%, 50/200 = 25%; MAPE ≈ <b>12.92%</b>.', 'ȳ = 125; Σ(y − ȳ)² = 625 + 25 + 2,025 + 5,625 = 8,300. R² = 1 − 2,725 / 8,300 ≈ <b>0.672</b>.'],
    },
  },
  code: {
    scratch: { why: 'The four metrics from their formulas.', src: `from math import sqrt

actual = [100, 120, 80, 200]
forecast = [110, 115, 90, 150]
errors = [a - f for a, f in zip(actual, forecast)]
mean_a = sum(actual) / len(actual)

mae = sum(abs(e) for e in errors) / len(errors)
rmse = sqrt(sum(e * e for e in errors) / len(errors))
mape = 100 * sum(abs(e) / a for e, a in zip(errors, actual)) / len(errors)
r2 = 1 - sum(e * e for e in errors) / sum((a - mean_a) ** 2 for a in actual)

print("errors:", errors)
print(f"MAE {mae:.2f}  RMSE {rmse:.2f}  MAPE {mape:.2f}%  R² {r2:.3f}")` },
    library: { why: 'scikit-learn’s metric functions give the same numbers.', src: `import numpy as np
from sklearn.metrics import mean_absolute_error, mean_absolute_percentage_error, mean_squared_error, r2_score

y = np.array([100, 120, 80, 200])
yhat = np.array([110, 115, 90, 150])

print(f"MAE  {mean_absolute_error(y, yhat):.2f}")
print(f"RMSE {np.sqrt(mean_squared_error(y, yhat)):.2f}")
print(f"MAPE {100 * mean_absolute_percentage_error(y, yhat):.2f}%")
print(f"R²   {r2_score(y, yhat):.3f}")` },
    prod: { why: 'A cost-weighted error: under-forecasting (stock-outs) costs more than over-forecasting.', src: `import numpy as np


def stock_cost(y: np.ndarray, yhat: np.ndarray, under_cost: float = 300.0, over_cost: float = 60.0) -> float:
    """Business cost: lost margin per unit short, holding cost per unit left over (₹)."""
    if y.shape != yhat.shape:
        raise ValueError("shapes differ")
    short = np.clip(y - yhat, 0, None)
    extra = np.clip(yhat - y, 0, None)
    return float(under_cost * short.sum() + over_cost * extra.sum())


y = np.array([100, 120, 80, 200])
for name, f in {"model": np.array([110, 115, 90, 150]), "model + 10%": np.array([121, 126, 99, 165])}.items():
    print(f"{name:12s} cost ₹{stock_cost(y, f):,.0f}")` },
  },
  industry: {
    when: ['Any numeric prediction: demand, revenue, delivery time, price.', 'Reporting forecast quality to planners.', 'Choosing the training loss to match the business metric.'],
    baseline: 'Compare against a naive forecast (same week last year, or the last 4-week average) on the same metric.',
    tools: ['scikit-learn regression metrics', 'Custom cost functions when errors are asymmetric'],
    tradeoffs: ['MAE is robust and readable; RMSE punishes big misses; MAPE is scale-free but unstable near zero.', 'A single metric hides who is hurt: break results down by category and festival weeks.'],
    failures: ['MAPE on items that often sell zero.', 'Comparing RMSE across products of very different volumes.', 'Optimising a symmetric metric when stock-outs cost far more than overstock.'],
    shopsense: 'The Phase 1 demand forecast is reported in MAE per category, with a separate stock-cost figure for festival weeks.',
    interview: [
      ['When would you use RMSE over MAE?', 'When large errors are disproportionately costly; RMSE squares errors so big misses dominate.'],
      ['What is wrong with MAPE?', 'It is undefined or explodes when actual values are zero or tiny, and it penalises over- and under-forecasts asymmetrically.'],
      ['Can R² be negative?', 'Yes, on held-out data, when the model predicts worse than simply using the mean.'],
    ],
  },
  quiz: [
    { q: 'Errors −10, 5, −10, 50. What is MAE?', opts: ['8.75', '18.75', '26.1', '75'], a: 1, why: '(10 + 5 + 10 + 50) / 4.' },
    { q: 'Same errors. What is RMSE?', opts: ['18.75', '≈ 26.1', '681.25', '50'], a: 1, why: '√((100 + 25 + 100 + 2,500) / 4) = √681.25.' },
    { q: 'Which metric is most affected by one large miss?', opts: ['MAE', 'RMSE', 'Median absolute error', 'None'], a: 1, why: 'Squaring magnifies large errors.' },
    { q: 'A product often sells zero units. Which metric should you avoid?', opts: ['MAE', 'RMSE', 'MAPE', 'Stock cost'], a: 2, why: 'Dividing by zero actual values breaks MAPE.' },
    { q: 'Stock-outs cost five times more than leftover stock. What should you do?', opts: ['Use MAPE', 'Use a cost-weighted metric that penalises under-forecasts more', 'Use accuracy', 'Ignore it'], a: 1, why: 'The metric should reflect business cost.' },
  ],
  exercise: {
    task: ['Write <code>mae(y, yhat)</code> and <code>rmse(y, yhat)</code>. Compute both for the data below and store them in <code>a</code> and <code>r</code>.'],
    starter: `from math import sqrt


def mae(y, yhat):
    pass


def rmse(y, yhat):
    pass


y = [50, 60, 70, 80]
yhat = [52, 57, 75, 80]
a, r = mae(y, yhat), rmse(y, yhat)
print(a, r)`,
    check: `assert mae([100, 120, 80, 200], [110, 115, 90, 150]) == 18.75
assert abs(a - 2.5) < 1e-12
assert abs(r - sqrt((4 + 9 + 25 + 0) / 4)) < 1e-12`,
    solution: `from math import sqrt


def mae(y, yhat):
    return sum(abs(a - b) for a, b in zip(y, yhat)) / len(y)


def rmse(y, yhat):
    return sqrt(sum((a - b) ** 2 for a, b in zip(y, yhat)) / len(y))


y = [50, 60, 70, 80]
yhat = [52, 57, 75, 80]
a, r = mae(y, yhat), rmse(y, yhat)
print(a, r)`,
    hint: 'MAE averages <code>abs(a − b)</code>; RMSE is the square root of the average of <code>(a − b) ** 2</code>.',
  },
};

// ===================================================================== P1.09
const PTS = [[1, 1.0, 1], [1.5, 1.4, 1], [2, 0.8, 1], [5, 3.0, 0], [5.5, 3.6, 0], [6, 2.8, 0], [4.5, 3.2, 0]];
const l9 = {
  id: 'p1-09', title: 'k-Nearest neighbours', time: '35 minutes',
  sub: 'Predict for a new customer by looking at the most similar past customers. Simple, intuitive, and a lesson in why feature scaling matters.',
  learn: ['Classify a point by majority vote of its k nearest neighbours', 'Compute Euclidean distance and explain why features must be scaled', 'Choose k with cross-validation and know kNN’s limits'],
  legend: [[BAD, 'churned'], [GOOD, 'stayed'], [SIGNAL, 'new customer']],
  steps: [
    {
      t: 'Customers on a map', b: ['Place past customers by two features: orders per month (across) and average order value in ₹ thousand (into the picture). Coral churned; green stayed.'],
      n: 'Similar customers sit close together.',
      s: { ...Object.fromEntries(PTS.map(([x, y, c], i) => ['p' + i, O(x, y, { r: 0.22, c: c ? 'coral' : 'green' })])), ax: T('orders per month →', 7.2, 0.2, { fs: 11.5, c: 'muted' }), ay: T('order value →', -0.4, 4.6, { fs: 11.5, c: 'muted' }) },
    },
    {
      t: 'A new customer arrives', b: ['A new customer orders 2.5 times a month with an average order of ₹1,600. Will they churn?'],
      n: 'kNN needs no training: it keeps all past customers and compares at prediction time.',
      s: { q: O(2.5, 1.6, { r: 0.26, c: 'amber', hl: 1, sub: 'new: 2.5 orders, ₹1.6k' }) },
    },
    {
      t: 'Find the 3 nearest', b: ['Measure the straight-line (Euclidean) distance to every customer and keep the k = 3 closest. Here all three nearest neighbours churned.'],
      n: 'Lines connect the new customer to its three nearest neighbours.',
      s: { p0: { hl: 1 }, p1: { hl: 1 }, p2: { hl: 1 } },
      l: { n0: L('q', 'p0', { c: 'amber', na: 1, dash: 1 }), n1: L('q', 'p1', { c: 'amber', na: 1, dash: 1 }), n2: L('q', 'p2', { c: 'amber', na: 1, dash: 1 }) },
    },
    {
      t: 'Vote', b: ['3 of 3 neighbours churned, so predict churn with estimated probability 3/3. With k = 5, the vote might be 3 to 2.', 'Small k follows noise; large k blurs real differences. Choose k by cross-validation.'],
      n: 'Odd k avoids ties in two-class problems.',
      s: { q: { c: 'coral', sub: 'predict: churn (3 of 3)' } },
    },
    {
      t: 'Scale first, or one feature dominates', b: ['If spend were in rupees (₹1,600) and orders in counts (2.5), distances would be almost entirely about spend. Standardise every feature to mean 0 and standard deviation 1 first.', 'Without scaling, kNN quietly ignores small-unit features.'],
      n: 'Scaling belongs inside a pipeline, fitted on training data only.',
      warn: true,
      clear: true,
      s: mg(bars('u', [2.6, 0.05], { x: 0, y: 0, dx: 1.6, w: 1.0, d: 1.0, c: 'coral', labels: ['spend (₹)', 'orders'] }), bars('s', [1.2, 1.3], { x: 5.0, y: 0, dx: 1.6, w: 1.0, d: 1.0, c: 'green', labels: ['spend (scaled)', 'orders (scaled)'] }), { ul: T('share of distance, unscaled', 0.8, -1.6, { z: 2.9, fs: 12, b: 1, c: 'coral' }), sl: T('after scaling', 5.8, -1.6, { z: 2.9, fs: 12, b: 1, c: 'green' }) }),
    },
  ],
  math: {
    blocks: [
      { h: 'Euclidean distance', f: 'd(a, b) = √( Σⱼ (aⱼ − bⱼ)² )' },
      { h: 'kNN prediction', f: 'classification: majority label among the k nearest\nprobability: (count of class c among the k) / k\nregression: mean target of the k nearest' },
      { h: 'Standardisation', f: 'z = (x − mean) / standard deviation', p: 'Computed on training data, then applied to new data.' },
    ],
    example: {
      intro: 'New customer q = (2.5, 1.6). Distances to three customers.',
      steps: ['To (2, 0.8): √(0.5² + 0.8²) = √(0.25 + 0.64) = √0.89 ≈ <b>0.94</b>.', 'To (1.5, 1.4): √(1.0² + 0.2²) = √1.04 ≈ <b>1.02</b>. To (1, 1.0): √(1.5² + 0.6²) = √2.61 ≈ <b>1.62</b>.', 'To the nearest stayer (4.5, 3.2): √(2.0² + 1.6²) = √6.56 ≈ <b>2.56</b>, further than all three churners.', 'With k = 3, all neighbours churned: predict churn with probability 3/3 = 1.0.'],
    },
  },
  code: {
    scratch: { why: 'Distances, sorting and a vote, in plain Python.', src: `from collections import Counter
from math import dist

customers = [((1, 1.0), "churn"), ((1.5, 1.4), "churn"), ((2, 0.8), "churn"),
             ((5, 3.0), "stay"), ((5.5, 3.6), "stay"), ((6, 2.8), "stay"), ((4.5, 3.2), "stay")]
q = (2.5, 1.6)

ranked = sorted(customers, key=lambda c: dist(q, c[0]))
for point, label in ranked[:4]:
    print(f"{point} {label:5s} distance {dist(q, point):.2f}")
for k in (3, 5):
    votes = Counter(label for _, label in ranked[:k])
    print(f"k={k}: {dict(votes)} -> predict {votes.most_common(1)[0][0]}")` },
    library: { why: 'A scaled kNN pipeline, with k chosen by cross-validation.', src: `import numpy as np
from sklearn.model_selection import GridSearchCV
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(3)
n = 1_500
orders = rng.gamma(2, 1.5, n)
spend = rng.normal(1500, 600, n).clip(200)            # rupees: large units
churn = (rng.random(n) < 1 / (1 + np.exp(1.2 * orders - 3 + 0.0006 * (spend - 1500)))).astype(int)
X = np.c_[orders, spend]

for name, model in [("unscaled", KNeighborsClassifier()), ("scaled", make_pipeline(StandardScaler(), KNeighborsClassifier()))]:
    grid = {"n_neighbors": [3, 7, 15, 31]} if name == "unscaled" else {"kneighborsclassifier__n_neighbors": [3, 7, 15, 31]}
    search = GridSearchCV(model, grid, cv=5, scoring="roc_auc").fit(X, churn)
    print(f"{name:9s} best params {search.best_params_}  CV ROC-AUC {search.best_score_:.3f}")` },
    prod: { why: 'Similar-customer lookup for support agents, with a guard against unscaled inputs.', src: `import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(4)
features = np.c_[rng.gamma(2, 1.5, 500), rng.normal(1500, 600, 500).clip(200), rng.integers(0, 120, 500)]
ids = np.arange(10_001, 10_501)

scaler = StandardScaler().fit(features)
index = NearestNeighbors(n_neighbors=4).fit(scaler.transform(features))


def similar_customers(row: np.ndarray, k: int = 3) -> list[int]:
    """IDs of the k most similar customers (excluding an exact self-match)."""
    if row.shape != (features.shape[1],):
        raise ValueError(f"expected {features.shape[1]} features")
    dist, idx = index.kneighbors(scaler.transform(row.reshape(1, -1)), n_neighbors=k + 1)
    return [int(ids[i]) for d, i in zip(dist[0], idx[0]) if d > 1e-12][:k]


print(similar_customers(features[0]))` },
  },
  industry: {
    when: ['Small to medium datasets with meaningful distances.', '"Customers like you" lookups and simple recommendations.', 'A quick, assumption-light baseline.'],
    baseline: 'kNN with standardised features and k chosen by cross-validation; compare with logistic regression.',
    tools: ['scikit-learn KNeighborsClassifier / Regressor, NearestNeighbors', 'Approximate nearest-neighbour libraries (FAISS) at scale'],
    tradeoffs: ['No training time, but prediction compares with every stored row (slow on millions).', 'Works poorly with many irrelevant features: distances become meaningless in high dimensions.'],
    failures: ['Forgetting to scale features.', 'Leaving duplicate rows that vote many times.', 'Using kNN on hundreds of raw features.'],
    shopsense: 'Support agents use a nearest-neighbour lookup to see how similar customers were helped; the same idea powers embedding search in Phase 3.',
    interview: [
      ['Why must features be scaled for kNN?', 'Distance mixes features; without scaling, features with large units dominate and others are ignored.'],
      ['What happens with very small or very large k?', 'Small k overfits to noise; large k underfits by averaging over dissimilar points.'],
      ['What is the curse of dimensionality?', 'In many dimensions, points become roughly equally distant, so "nearest" carries little information.'],
    ],
  },
  quiz: [
    { q: 'What is the distance between (2.5, 1.6) and (2, 0.8)?', opts: ['≈ 0.94', '1.3', '0.89', '1.6'], a: 0, why: '√(0.25 + 0.64) = √0.89 ≈ 0.94.' },
    { q: 'k = 5: three neighbours churned, two stayed. Prediction?', opts: ['Stay', 'Churn, probability 0.6', 'Churn, probability 1.0', 'Undefined'], a: 1, why: 'Majority vote 3 of 5.' },
    { q: 'Spend in rupees and orders as counts, unscaled. What happens?', opts: ['Nothing', 'Spend dominates the distance', 'Orders dominate', 'kNN refuses to run'], a: 1, why: 'Rupee differences are hundreds of times larger.' },
    { q: 'Why choose an odd k for two classes?', opts: ['Faster', 'Avoids tied votes', 'Required by scikit-learn', 'Improves scaling'], a: 1, why: 'An odd number of votes cannot split evenly.' },
    { q: 'kNN is slow at prediction time because…', opts: ['Training is long', 'It compares each query with all stored examples', 'It uses gradient descent', 'It needs GPUs'], a: 1, why: 'All the work happens at prediction time.' },
  ],
  exercise: {
    task: ['Write <code>knn_predict(points, labels, q, k)</code> returning the majority label of the k nearest points to <code>q</code> (Euclidean distance). Predict for <code>q = (3, 3)</code> with k = 3 and store it in <code>pred</code>.'],
    starter: `from collections import Counter
from math import dist


def knn_predict(points, labels, q, k):
    pass


points = [(1, 1), (2, 2), (3, 4), (4, 3), (6, 6), (7, 7)]
labels = ["stay", "stay", "churn", "churn", "churn", "stay"]
pred = knn_predict(points, labels, (3, 3), 3)
print(pred)`,
    check: `assert pred == "churn", "the nearest three are (3,4), (4,3) and (2,2): two churn"
assert knn_predict([(0, 0), (10, 10)], ["a", "b"], (1, 1), 1) == "a"`,
    solution: `from collections import Counter
from math import dist


def knn_predict(points, labels, q, k):
    order = sorted(range(len(points)), key=lambda i: dist(points[i], q))
    votes = Counter(labels[i] for i in order[:k])
    return votes.most_common(1)[0][0]


points = [(1, 1), (2, 2), (3, 4), (4, 3), (6, 6), (7, 7)]
labels = ["stay", "stay", "churn", "churn", "churn", "stay"]
pred = knn_predict(points, labels, (3, 3), 3)
print(pred)`,
    hint: 'Sort the indices by <code>dist(points[i], q)</code>, take the first k, and count labels with <code>Counter</code>.',
  },
};

// ===================================================================== P1.10
const node = (t, x, y, c, o = {}) => B(t, x, y, { c, w: 2.6, d: 1.4, h: 0.5, fs: 9, ...o });
const l10 = {
  id: 'p1-10', title: 'Decision trees', time: '40 minutes',
  sub: 'Split customers with a sequence of yes/no questions, choosing each question to make the groups as pure as possible.',
  learn: ['Read a decision tree as a set of if/else rules', 'Compute Gini impurity and the gain of a split', 'Control depth to stop a tree from memorising'],
  legend: [[DATA, 'mixed group'], [BAD, 'mostly churn'], [GOOD, 'mostly stay']],
  steps: [
    {
      t: 'Start with everyone', b: ['10 customers: 4 churned, 6 stayed. The group is mixed. A tree asks a question that separates them as cleanly as possible.'],
      n: 'Gini impurity of this group: 1 − (0.4² + 0.6²) = 0.48.',
      s: { root: node('10 customers\n4 churn · 6 stay', 0, 0, 'blue'), gl: T('Gini 0.48', -0.6, 2.0, { z: 0.3, fs: 12, b: 1, c: 'muted' }) },
    },
    {
      t: 'Try a question', b: ['"Days since last order > 30?" Yes: 4 customers, 3 churned. No: 6 customers, 1 churned.', 'Both groups are purer than before.'],
      n: 'The tree tries many questions and keeps the one with the biggest drop in impurity.',
      s: { yes: node('> 30 days\n3 churn · 1 stay', 4.0, -2.4, 'coral'), no: node('≤ 30 days\n1 churn · 5 stay', 4.0, 2.4, 'green') },
      l: { a: L('root', 'yes', { t: 'yes', c: 'coral' }), b: L('root', 'no', { t: 'no', c: 'green' }) },
    },
    {
      t: 'Measure the gain', b: ['Gini of the "yes" group: 1 − (0.75² + 0.25²) = 0.375. "No" group: 1 − ((1/6)² + (5/6)²) ≈ 0.278.', 'Weighted: 0.4 × 0.375 + 0.6 × 0.278 ≈ 0.317. Gain = 0.48 − 0.317 ≈ <b>0.163</b>.'],
      n: 'Bigger gain means a more useful question.',
      s: { gl: { t: 'Gini 0.48 → 0.317 · gain 0.163' } },
    },
    {
      t: 'Keep splitting', b: ['Each group is split again with its own best question, for example "orders in the last 90 days ≤ 1?". Leaves predict the majority class (or the share of churners as a probability).'],
      n: 'The path from root to leaf reads as a rule a person can check.',
      s: { yy: node('≤ 1 order\n3 churn · 0 stay', 8.2, -4.2, 'coral'), yn: node('> 1 order\n0 churn · 1 stay', 8.2, -1.6, 'green'), ny: node('high spend\n0 churn · 4 stay', 8.2, 1.6, 'green'), nn: node('low spend\n1 churn · 1 stay', 8.2, 4.2, 'blue') },
      l: { c: L('yes', 'yy', { c: 'coral', na: 1 }), d: L('yes', 'yn', { c: 'green', na: 1 }), e: L('no', 'ny', { c: 'green', na: 1 }), f: L('no', 'nn', { c: 'muted', na: 1 }) },
    },
    {
      t: 'Deep trees memorise', b: ['Left alone, a tree keeps splitting until every leaf holds one customer: perfect on training data, poor on new data.', 'Limit depth, require a minimum number of customers per leaf, and choose those limits with cross-validation.'],
      n: 'Trees are unstable alone; the next two lessons combine many of them.',
      warn: true,
      clear: true,
      s: mg(bars('d', [0.8, 0.86, 0.88, 0.87, 0.82, 0.76], { x: 0, y: 0, dx: 1.1, w: 0.7, d: 0.7, c: 'amber', labels: ['depth 1', '2', '3', '5', '10', 'none'] }), { d2: { c: 'green' }, dl: T('validation accuracy by depth (illustrative)', 2.8, -1.6, { z: 1.4, fs: 12, b: 1 }) }),
    },
  ],
  math: {
    blocks: [
      { h: 'Gini impurity', f: 'G = 1 − Σₖ pₖ²', p: 'pₖ is the share of class k in the node. 0 = pure; 0.5 is the maximum for two classes.' },
      { h: 'Gain of a split', f: 'gain = G(parent) − Σ (n_child / n_parent) · G(child)' },
      { h: 'Entropy (alternative)', f: 'H = − Σₖ pₖ log₂ pₖ', p: 'Information gain uses entropy instead of Gini; results are usually similar.' },
    ],
    example: {
      intro: 'Split 10 customers (4 churn) on "days since last order > 30".',
      steps: ['Parent: G = 1 − (0.4² + 0.6²) = 1 − 0.52 = <b>0.48</b>.', 'Yes branch, 4 customers, 3 churn: G = 1 − (0.75² + 0.25²) = 1 − 0.625 = <b>0.375</b>.', 'No branch, 6 customers, 1 churn: G = 1 − (1/36 + 25/36) = 10/36 ≈ <b>0.278</b>.', 'Weighted child impurity = 0.4 × 0.375 + 0.6 × 0.278 ≈ 0.317. Gain ≈ 0.48 − 0.317 = <b>0.163</b>.'],
    },
  },
  code: {
    scratch: { why: 'Gini impurity and the best threshold for one feature, by brute force.', src: `def gini(labels):
    n = len(labels)
    if n == 0:
        return 0.0
    p = sum(labels) / n
    return 1 - (p ** 2 + (1 - p) ** 2)


days = [5, 12, 18, 22, 28, 35, 41, 50, 64, 80]
churn = [0, 0, 0, 1, 0, 0, 1, 1, 0, 1]

best = None
for t in sorted(set(days))[:-1]:
    left = [c for d, c in zip(days, churn) if d <= t]
    right = [c for d, c in zip(days, churn) if d > t]
    weighted = (len(left) * gini(left) + len(right) * gini(right)) / len(days)
    gain = gini(churn) - weighted
    if best is None or gain > best[1]:
        best = (t, gain)
print(f"parent Gini {gini(churn):.3f}; best split: days > {best[0]} with gain {best[1]:.3f}")` },
    library: { why: 'scikit-learn trees of different depths, and the learned rules printed as text.', src: `import numpy as np
from sklearn.model_selection import cross_val_score
from sklearn.tree import DecisionTreeClassifier, export_text

rng = np.random.default_rng(0)
n = 3_000
days = rng.integers(0, 120, n)
orders = rng.poisson(3, n)
churn = (rng.random(n) < 1 / (1 + np.exp(-(-1.5 + 0.04 * days - 0.4 * orders)))).astype(int)
X = np.c_[days, orders]

for depth in (1, 3, 6, None):
    score = cross_val_score(DecisionTreeClassifier(max_depth=depth, random_state=0), X, churn, cv=5).mean()
    print(f"max_depth={depth}: CV accuracy {score:.3f}")

tree = DecisionTreeClassifier(max_depth=2, random_state=0).fit(X, churn)
print(export_text(tree, feature_names=["days_since_last", "orders_90d"]))` },
    prod: { why: 'Depth and leaf size chosen by grid search, with the rules saved for review.', src: `import numpy as np
from sklearn.model_selection import GridSearchCV
from sklearn.tree import DecisionTreeClassifier, export_text

rng = np.random.default_rng(1)
n = 3_000
X = np.c_[rng.integers(0, 120, n), rng.poisson(3, n), rng.normal(1500, 500, n)]
y = (rng.random(n) < 1 / (1 + np.exp(-(-1.5 + 0.04 * X[:, 0] - 0.4 * X[:, 1])))).astype(int)

search = GridSearchCV(
    DecisionTreeClassifier(random_state=0),
    {"max_depth": [2, 3, 4, 6], "min_samples_leaf": [20, 50, 100]},
    cv=5, scoring="roc_auc",
).fit(X, y)
print("best:", search.best_params_, f"CV ROC-AUC {search.best_score_:.3f}")
rules = export_text(search.best_estimator_, feature_names=["days", "orders", "spend"], max_depth=2)
print(rules)` },
  },
  industry: {
    when: ['When rules must be explainable to non-technical colleagues.', 'Mixed feature types and non-linear thresholds (days > 30).', 'As the building block of random forests and gradient boosting.'],
    baseline: 'A depth-2 or depth-3 tree is a readable baseline; compare with logistic regression.',
    tools: ['scikit-learn DecisionTreeClassifier / Regressor, export_text, plot_tree'],
    tradeoffs: ['Readable and needs no scaling, but unstable: small data changes can change the whole tree.', 'Deep trees overfit; shallow trees underfit.'],
    failures: ['No depth limit, so the tree memorises.', 'Over-trusting a single tree’s "important" first split.', 'High-cardinality IDs used as features, giving fake purity.'],
    shopsense: 'A shallow tree explains to Jones which customer patterns drive churn; the production model uses boosted trees (lesson P1.12).',
    interview: [
      ['How does a decision tree choose a split?', 'It evaluates candidate features and thresholds and picks the one that most reduces impurity (Gini or entropy) or, for regression, squared error.'],
      ['Why do trees overfit and how do you stop it?', 'They can keep splitting until leaves are pure; limit max_depth, min_samples_leaf, or prune with cost-complexity.'],
      ['Do trees need feature scaling?', 'No; splits depend on order, not on scale.'],
    ],
  },
  quiz: [
    { q: 'Gini impurity of a node with 4 churn and 6 stay?', opts: ['0.24', '0.48', '0.5', '0.6'], a: 1, why: '1 − (0.16 + 0.36) = 0.48.' },
    { q: 'Gini of a perfectly pure node?', opts: ['0', '0.5', '1', 'Undefined'], a: 0, why: 'One class only: 1 − 1² = 0.' },
    { q: 'Parent Gini 0.48, weighted child Gini 0.317. Gain?', opts: ['0.163', '0.797', '0.317', '0.48'], a: 0, why: '0.48 − 0.317.' },
    { q: 'An unlimited-depth tree has 100% training accuracy. Likely?', opts: ['Excellent model', 'Overfitting', 'Underfitting', 'Data leakage only'], a: 1, why: 'Leaves of one customer memorise noise.' },
    { q: 'Do decision trees need feature scaling?', opts: ['Yes, always', 'No, splits depend on order only', 'Only for categories', 'Only for regression'], a: 1, why: 'A threshold works the same whatever the units.' },
  ],
  exercise: {
    task: ['Write <code>gini(labels)</code> for 0/1 labels and <code>split_gain(left, right)</code> (parent Gini minus weighted child Gini). Compute the gain for the split below and store it in <code>gain</code>.'],
    starter: `def gini(labels):
    pass


def split_gain(left, right):
    pass


left = [1, 1, 1, 0]
right = [0, 0, 0, 0, 0, 1]
gain = split_gain(left, right)
print(gain)`,
    check: `assert abs(gini([1, 1, 1, 1, 0, 0, 0, 0, 0, 0]) - 0.48) < 1e-12
assert gini([1, 1]) == 0
expected = 0.48 - (0.4 * 0.375 + 0.6 * (10 / 36))
assert abs(gain - expected) < 1e-12`,
    solution: `def gini(labels):
    if not labels:
        return 0.0
    p = sum(labels) / len(labels)
    return 1 - (p ** 2 + (1 - p) ** 2)


def split_gain(left, right):
    parent = left + right
    n = len(parent)
    return gini(parent) - (len(left) / n * gini(left) + len(right) / n * gini(right))


left = [1, 1, 1, 0]
right = [0, 0, 0, 0, 0, 1]
gain = split_gain(left, right)
print(round(gain, 4))`,
    hint: 'Weight each child’s Gini by its share of the rows, and subtract from the parent’s Gini.',
  },
};

// ===================================================================== P1.11
const l11 = {
  id: 'p1-11', title: 'Random forests', time: '40 minutes',
  sub: 'Grow many different trees on random samples of the data and features, then let them vote. The crowd is far steadier than any single tree.',
  learn: ['Explain bootstrap sampling and random feature selection', 'Show why averaging many varied trees reduces error', 'Use out-of-bag error and feature importance sensibly'],
  legend: [[DATA, 'data'], [GOOD, 'tree'], [SIGNAL, 'vote']],
  steps: [
    {
      t: 'One tree is unstable', b: ['Change a few customers in the training data and a single deep tree can look completely different, with different predictions.', 'High variance: it reacts strongly to noise.'],
      n: 'Idea: train many trees on slightly different data and average them.',
      s: { data: Cy('training\ndata', 0, 2.4, { c: 'blue', r: 0.7, h: 1.0, fs: 10 }), t0: B('tree', 3.4, 2.4, { c: 'green', w: 1.0, d: 1.0, h: 1.2, fs: 10 }) },
      l: { a: L('data', 't0', { flow: 1 }) },
    },
    {
      t: 'Bootstrap samples', b: ['Each tree trains on a bootstrap sample: as many rows as the original, drawn with replacement. Some customers appear twice, and about 37% are left out of each sample.'],
      n: 'Each tree sees a different version of the data.',
      s: { t0: null, ...Object.fromEntries([0, 1, 2, 3].map((i) => [`b${i}`, Tl(`sample ${i + 1}`, 3.0, i * 1.6, { c: 'blue', w: 1.6, d: 0.9, fs: 9.5 })])) },
      l: { a: null, ...Object.fromEntries([0, 1, 2, 3].map((i) => [`s${i}`, L('data', `b${i}`, { c: 'muted', na: 1 })])) },
    },
    {
      t: 'Random features at each split', b: ['At every split, a tree may only choose among a random subset of features (for example √ of the feature count). This stops all trees from making the same first split, so their errors differ.'],
      n: 'Different data and different features make the trees disagree in useful ways.',
      s: Object.fromEntries([0, 1, 2, 3].map((i) => [`t${i}`, B(`tree ${i + 1}`, 6.0, i * 1.6, { c: 'green', w: 1.0, d: 0.9, h: 0.9 + (i % 2) * 0.3, fs: 9.5 })])),
      l: Object.fromEntries([0, 1, 2, 3].map((i) => [`u${i}`, L(`b${i}`, `t${i}`, { flow: 1, c: 'green' })])),
    },
    {
      t: 'The forest votes', b: ['For a new customer, each tree votes (or gives a probability) and the forest averages them. 3 of 4 trees say churn: probability 0.75.', 'Individual mistakes cancel out when the trees are varied.'],
      n: 'Averaging reduces variance without adding much bias.',
      s: { v: Tl('vote: 3 of 4 say churn\np = 0.75', 9.6, 2.4, { c: 'amber', w: 2.6, d: 1.3, fs: 9.5 }) },
      l: Object.fromEntries([0, 1, 2, 3].map((i) => [`w${i}`, L(`t${i}`, 'v', { c: i === 2 ? 'muted' : 'amber', na: 1 })])),
    },
    {
      t: 'Free validation and importance', b: ['Each tree can be tested on the ~37% of rows it never saw: the out-of-bag (OOB) score, a free validation estimate.', 'Feature importance shows which features the forest relies on; permutation importance on held-out data is the more trustworthy version.'],
      n: 'Importance means "the model uses it", not "it causes churn".',
      clear: true,
      s: mg(bars('fi', [2.4, 1.5, 0.6, 0.2], { x: 0, y: 0, dx: 1.5, w: 0.9, d: 0.9, c: 'green', labels: ['days since last', 'orders 90d', 'spend', 'city'] }), { fl: T('permutation importance (illustrative)', 2.2, -1.6, { z: 2.8, fs: 12, b: 1 }) }),
    },
  ],
  math: {
    blocks: [
      { h: 'Bootstrap: share of rows left out', f: 'P(row not chosen in n draws) = (1 − 1/n)ⁿ → e⁻¹ ≈ 0.368', p: 'So each tree sees about 63.2% of distinct rows; the rest are out-of-bag.' },
      { h: 'Variance of an average of correlated trees', f: 'Var(average) = ρσ² + (1 − ρ) σ² / B', p: 'B trees, each with variance σ² and pairwise correlation ρ. More trees shrink the second term; random features lower ρ.' },
    ],
    example: {
      intro: 'How much does a forest of B = 100 trees reduce variance?',
      steps: ['Suppose each tree’s prediction has variance σ² = 1.', 'If the trees were independent (ρ = 0): Var = 1 / 100 = <b>0.01</b>.', 'Realistically ρ = 0.3: Var = 0.3 × 1 + 0.7 × 1 / 100 = 0.3 + 0.007 = <b>0.307</b>.', 'Lowering ρ to 0.1 (more feature randomness): 0.1 + 0.009 = <b>0.109</b>. Decorrelation matters more than adding trees.'],
    },
  },
  code: {
    scratch: { why: 'Bootstrap sampling and the 63% rule, then a majority vote.', src: `import random
from collections import Counter

random.seed(7)
n = 10_000
sample = [random.randrange(n) for _ in range(n)]           # draw with replacement
print(f"distinct rows in one bootstrap sample: {len(set(sample)) / n:.1%}")

tree_votes = ["churn", "churn", "stay", "churn", "stay", "churn", "churn"]
counts = Counter(tree_votes)
print(f"votes {dict(counts)} -> predict {counts.most_common(1)[0][0]}, p(churn) = {counts['churn'] / len(tree_votes):.2f}")` },
    library: { why: 'A single tree versus a forest on the same data, with the OOB score.', src: `import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
from sklearn.tree import DecisionTreeClassifier

rng = np.random.default_rng(0)
n = 3_000
X = np.c_[rng.integers(0, 120, n), rng.poisson(3, n), rng.normal(1500, 500, n), rng.integers(0, 5, n)]
y = (rng.random(n) < 1 / (1 + np.exp(-(-1.5 + 0.04 * X[:, 0] - 0.4 * X[:, 1])))).astype(int)

tree = DecisionTreeClassifier(random_state=0)
forest = RandomForestClassifier(n_estimators=200, min_samples_leaf=5, oob_score=True, random_state=0, n_jobs=1)
print(f"single tree  CV ROC-AUC {cross_val_score(tree, X, y, cv=5, scoring='roc_auc').mean():.3f}")
print(f"forest       CV ROC-AUC {cross_val_score(forest, X, y, cv=5, scoring='roc_auc').mean():.3f}")
print(f"forest OOB accuracy {forest.fit(X, y).oob_score_:.3f}")` },
    prod: { why: 'Permutation importance on held-out data: what the forest actually relies on.', src: `import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(1)
n = 4_000
names = ["days_since_last", "orders_90d", "spend", "city_code"]
X = np.c_[rng.integers(0, 120, n), rng.poisson(3, n), rng.normal(1500, 500, n), rng.integers(0, 5, n)]
y = (rng.random(n) < 1 / (1 + np.exp(-(-1.5 + 0.04 * X[:, 0] - 0.4 * X[:, 1])))).astype(int)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=0)

forest = RandomForestClassifier(n_estimators=200, min_samples_leaf=5, random_state=0, n_jobs=1).fit(X_tr, y_tr)
result = permutation_importance(forest, X_te, y_te, scoring="roc_auc", n_repeats=5, random_state=0)
for i in np.argsort(-result.importances_mean):
    print(f"{names[i]:16s} {result.importances_mean[i]:.3f}")` },
  },
  industry: {
    when: ['Tabular data with non-linear patterns and interactions.', 'A strong default that needs little tuning.', 'When you want a free validation estimate (OOB).'],
    baseline: 'A random forest with default settings is a strong baseline for tabular problems; compare with logistic regression and gradient boosting.',
    tools: ['scikit-learn RandomForestClassifier / Regressor', 'permutation_importance', 'SHAP for per-prediction explanations (lesson P1.22)'],
    tradeoffs: ['Robust and hard to overfit badly, but large models can be slow to predict and big to store.', 'Usually slightly less accurate than well-tuned gradient boosting.'],
    failures: ['Trusting impurity-based importance, which favours high-cardinality features.', 'Treating importance as causation.', 'Very deep trees on tiny data still overfitting.'],
    shopsense: 'The Phase 1 churn project compares logistic regression, a random forest and gradient boosting on the same folds before choosing.',
    interview: [
      ['How does a random forest reduce variance?', 'By averaging many trees trained on bootstrap samples with random feature subsets, which makes their errors less correlated.'],
      ['What is the out-of-bag score?', 'Each tree is evaluated on rows not in its bootstrap sample; aggregated, this gives a validation estimate without a separate set.'],
      ['Why prefer permutation importance?', 'It measures the drop in held-out performance when a feature is shuffled, and is less biased towards high-cardinality features than impurity importance.'],
    ],
  },
  quiz: [
    { q: 'About what share of distinct rows does a bootstrap sample contain?', opts: ['37%', '50%', '63%', '100%'], a: 2, why: '1 − e⁻¹ ≈ 0.632.' },
    { q: 'Why does a forest pick random features at each split?', opts: ['To train faster only', 'To make trees less correlated, so averaging helps more', 'To reduce memory', 'It does not'], a: 1, why: 'Lower correlation ρ reduces the variance of the average.' },
    { q: 'σ² = 1, ρ = 0.3, B = 100. Variance of the forest average?', opts: ['0.01', '0.307', '0.3', '1'], a: 1, why: '0.3 + 0.7 / 100.' },
    { q: 'The OOB score is computed on…', opts: ['The test set', 'Rows each tree did not see during training', 'Training rows', 'Random noise'], a: 1, why: 'Out-of-bag rows act as validation.' },
    { q: 'A feature has high importance. You can conclude…', opts: ['It causes churn', 'The model relies on it for predictions', 'It should be removed', 'It is leaking'], a: 1, why: 'Importance describes the model, not causality (though very high importance can hint at leakage).' },
  ],
  exercise: {
    task: ['Write <code>majority_vote(votes)</code> returning <code>(label, share)</code>: the most common label and its share of the votes. Then estimate the out-of-bag share by simulation: draw 10,000 indices with replacement from 10,000 rows (seed 0) and store the share NOT drawn in <code>oob</code>.'],
    starter: `import random
from collections import Counter


def majority_vote(votes):
    pass


random.seed(0)
oob = None
print(majority_vote(["churn", "stay", "churn"]), oob)`,
    check: `assert majority_vote(["churn", "stay", "churn"]) == ("churn", 2 / 3)
assert 0.35 < oob < 0.39, "about 36.8% of rows are out of bag"`,
    solution: `import random
from collections import Counter


def majority_vote(votes):
    label, count = Counter(votes).most_common(1)[0]
    return label, count / len(votes)


random.seed(0)
n = 10_000
drawn = {random.randrange(n) for _ in range(n)}
oob = 1 - len(drawn) / n
print(majority_vote(["churn", "stay", "churn"]), oob)`,
    hint: '<code>Counter(votes).most_common(1)[0]</code> gives the top label and its count. For OOB, count distinct indices drawn.',
  },
};

export default [l7, l8, l9, l10, l11];
