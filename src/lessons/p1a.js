import { B, Tl, O, T, Z, S, P, Cy, Bub, L, row, bars, off, mg } from '../kit.js';

const DATA = '#c4cdfb', GOOD = '#c1e4b1', BAD = '#ffc4b1', SIGNAL = '#fddf98', MODEL = '#d9cafb', SYS = '#b2e5da';

// scatter helpers: x runs down-right along the floor, the value rises as height (z)
// the value axis runs up-right (along −y) so rising values also rise on screen
const dot = (x, z, o = {}) => ({ k: 'orb', x: 0, y: -x, z, r: 0.14, c: 'blue', noshadow: 1, ...o });
const floor = (len, label) => ({ base: S(0, -len / 2, 0.05, len, { c: 'slate', h: 0.02, noshadow: 1 }), bl: T(label, 0.9, -len - 0.6, { fs: 11.5, c: 'muted' }) });
const lineThrough = (id, x0, z0, x1, z1, c = 'green') => ({ [id + 'a']: { k: 'orb', x: 0, y: -x0, z: z0, r: 0.04, c, o: 0, noshadow: 1 }, [id + 'b']: { k: 'orb', x: 0, y: -x1, z: z1, r: 0.04, c, o: 0, noshadow: 1 } });

// ===================================================================== P1.01
const l1 = {
  id: 'p1-01', title: 'What machine learning is', time: '30 minutes',
  sub: 'Instead of writing the rules, show the computer examples and let it find the rule. Know when that is worth it, and when it is not.',
  learn: ['Explain the difference between writing rules and learning them from data', 'Name the three main kinds of machine learning and a ShopSense use for each', 'Describe training, prediction and generalisation in plain words'],
  legend: [[DATA, 'examples'], [MODEL, 'model'], [GOOD, 'prediction'], [SYS, 'rules']],
  steps: [
    {
      t: 'Rules written by people', b: ['Traditional software follows rules a person wrote: "if a customer has not ordered for 60 days, mark them at risk".', 'Rules work when people know the pattern and it is simple.'],
      n: 'Inputs + rules → answers. The programmer supplies the rules.',
      s: { inA: Tl('customer data', 0, 0, { c: 'blue', w: 1.8, d: 1.0, fs: 10 }), rules: B('rules\nwritten\nby people', 3.0, 0, { c: 'teal', w: 1.5, d: 1.3, h: 0.9, fs: 9.5 }), outA: Tl('at risk?', 6.0, 0, { c: 'green', w: 1.6, d: 1.0, fs: 10 }), cap1: T('traditional software', 3.0, -1.8, { z: 1.4, fs: 12.5, b: 1, c: 'muted' }) },
      l: { a: L('inA', 'rules', { flow: 1 }), b: L('rules', 'outA', { flow: 1, c: 'green' }) },
    },
    {
      t: 'Rules learned from examples', b: ['Machine learning flips it: give past customers together with what actually happened (churned or not), and an algorithm finds the rule itself.', 'The learned rule is called a model.'],
      n: 'Inputs + answers → rules. The data supplies the rules.',
      s: { inB: Tl('past customers', 0, 3.4, { c: 'blue', w: 1.8, d: 1.0, fs: 10 }), ans: Tl('what happened', 0, 4.8, { c: 'amber', w: 1.8, d: 1.0, fs: 10 }), algo: B('learning\nalgorithm', 3.0, 4.1, { c: 'violet', w: 1.5, d: 1.3, h: 0.9, fs: 9.5 }), model: B('model', 6.0, 4.1, { c: 'brand', w: 1.3, d: 1.2, h: 1.0, fs: 12 }), cap2: T('machine learning', 3.0, 6.2, { z: 0.2, fs: 12.5, b: 1, c: 'violet' }) },
      l: { c: L('inB', 'algo', { flow: 1 }), d: L('ans', 'algo', { flow: 1, c: 'amber' }), e: L('algo', 'model', { flow: 1, c: 'violet' }) },
    },
    {
      t: 'Then the model predicts', b: ['For a new customer, the model gives a prediction: for example, a 73% chance of churning in the next 60 days.', 'Training happens once (or on a schedule); prediction happens every time someone asks.'],
      n: 'Training is learning from the past. Prediction is applying it to someone new.',
      s: { nw: Tl('new customer', 6.0, 6.6, { c: 'blue', w: 1.8, d: 1.0, fs: 10 }), pr: Tl('73% churn risk', 9.0, 4.1, { c: 'green', w: 2.0, d: 1.0, fs: 10 }) },
      l: { f: L('nw', 'model', { c: 'blue' }), g: L('model', 'pr', { flow: 1, c: 'green' }) },
    },
    {
      t: 'Three kinds of learning', b: ['<b>Supervised</b>: examples come with answers (churned or not, units sold). <b>Unsupervised</b>: no answers; find structure such as customer segments. <b>Reinforcement</b>: learn by trying actions and receiving rewards, such as which offer to show.'],
      n: 'Phase 1 is mostly supervised learning, with clustering (unsupervised) near the end.',
      clear: true,
      s: { k1: B('supervised\nlabels given', 0, 0, { c: 'blue', w: 1.9, d: 1.5, h: 0.8, fs: 9.5 }), k2: B('unsupervised\nfind groups', 3.2, 0, { c: 'teal', w: 1.9, d: 1.5, h: 0.8, fs: 9.5 }), k3: B('reinforcement\nlearn from rewards', 6.4, 0, { c: 'amber', w: 2.1, d: 1.5, h: 0.8, fs: 9 }), e1: T('churn, demand', 0, 1.5, { z: 0.3, fs: 11, c: 'muted' }), e2: T('customer segments', 3.2, 1.5, { z: 0.3, fs: 11, c: 'muted' }), e3: T('which offer to show', 6.4, 1.5, { z: 0.3, fs: 11, c: 'muted' }) },
    },
    {
      t: 'The goal is generalisation', b: ['A model that only memorises past customers is useless. It must work on customers it has never seen. That is called generalisation.', 'So we always test on data the model did not train on (lesson P1.03).'],
      n: 'Learning is useful only when the pattern holds on new data.',
      warn: true,
      clear: true,
      s: mg(bars('g', [2.4, 2.3, 0.9], { x: 0, y: 0, dx: 2.4, w: 1.1, d: 1.1, c: 'green', labels: ['training data', 'new customers (good)', 'new customers (memorised)'] }), { g2: { c: 'coral' }, gl: T('accuracy', -0.8, -1.8, { z: 2.8, fs: 12, b: 1, c: 'muted' }) }),
    },
  ],
  math: {
    blocks: [
      { h: 'Learning as choosing a function', f: 'f* = the f that makes  (1/n) Σᵢ L(yᵢ, f(xᵢ))  smallest', p: 'Among a family of models f, pick the one with the lowest average loss L on the training examples (xᵢ, yᵢ).' },
      { h: 'Generalisation gap', f: 'gap = error on new data − error on training data', p: 'A small gap means the model learned a real pattern; a large gap means it memorised.' },
    ],
    example: {
      intro: 'Learn the simplest model, y = w × x, from three examples.',
      steps: ['Examples (x, y): (1, 2), (2, 4), (3, 7). We want the w that minimises the squared error Σ(y − w x)².', 'Setting the derivative to zero gives w = Σxy / Σx².', 'Σxy = 1×2 + 2×4 + 3×7 = <b>31</b>. Σx² = 1 + 4 + 9 = <b>14</b>. So w = 31 / 14 ≈ <b>2.214</b>.', 'Prediction for a new x = 4: ŷ = 2.214 × 4 ≈ <b>8.86</b>. The rule "multiply by 2.214" was learned, not written.'],
    },
  },
  code: {
    scratch: { why: 'A hand-written rule beside a rule learned from examples.', src: `def rule(days_since_last_order):
    return days_since_last_order > 60          # written by a person


xs = [1, 2, 3]
ys = [2, 4, 7]
w = sum(x * y for x, y in zip(xs, ys)) / sum(x * x for x in xs)   # learned from data

print("rule says at risk (75 days):", rule(75))
print(f"learned w = {w:.3f}")
print(f"prediction for x=4: {w * 4:.2f}")` },
    library: { why: 'scikit-learn: every model has fit (learn) and predict (apply).', src: `import numpy as np
from sklearn.linear_model import LinearRegression

X = np.array([[1], [2], [3]])
y = np.array([2, 4, 7])

model = LinearRegression(fit_intercept=False)
model.fit(X, y)                       # training
print(f"learned w = {model.coef_[0]:.3f}")
print("prediction for x=4:", np.round(model.predict([[4]]), 2))   # prediction` },
    prod: { why: 'A small train/predict interface that refuses to predict before training.', src: `from dataclasses import dataclass, field


@dataclass
class SlopeModel:
    """y ≈ w × x, learned by least squares."""
    w: float | None = field(default=None)

    def fit(self, xs: list[float], ys: list[float]) -> "SlopeModel":
        if len(xs) != len(ys) or not xs:
            raise ValueError("xs and ys must be non-empty and the same length")
        denom = sum(x * x for x in xs)
        if denom == 0:
            raise ValueError("all x are zero; slope is undefined")
        self.w = sum(x * y for x, y in zip(xs, ys)) / denom
        return self

    def predict(self, x: float) -> float:
        if self.w is None:
            raise RuntimeError("call fit() before predict()")
        return self.w * x


m = SlopeModel()
try:
    m.predict(4)
except RuntimeError as e:
    print("Refused:", e)
print(round(m.fit([1, 2, 3], [2, 4, 7]).predict(4), 2))` },
  },
  industry: {
    when: ['The pattern is too complex or changes too often for people to write rules (fraud, demand, ranking).', 'There are enough past examples with known outcomes.', 'A wrong prediction is affordable or can be reviewed.'],
    baseline: 'Write the best simple rule first and measure it. Use machine learning only if it clearly beats the rule on held-out data.',
    tools: ['scikit-learn for classical ML', 'pandas for data preparation', 'Jupyter for exploration, Python modules for production'],
    tradeoffs: ['Learned models adapt to data but are harder to explain than rules.', 'Models need retraining as behaviour changes; rules need manual updates.'],
    failures: ['Using ML where a simple rule works just as well.', 'Training on data that does not represent future customers.', 'Celebrating training accuracy instead of accuracy on new data.'],
    shopsense: 'The Phase 1 project predicts which customers will stop ordering and how many units each category will sell, replacing hand-written rules Jones uses today.',
    interview: [
      ['What is the difference between supervised and unsupervised learning?', 'Supervised learning trains on examples with known answers (labels); unsupervised learning finds structure, such as clusters, in data without labels.'],
      ['When would you not use machine learning?', 'When a simple rule solves it, when there is too little or no labelled data, or when every decision must be fully explainable and the pattern is known.'],
      ['What is generalisation?', 'How well a model performs on data it did not see during training. It is what we actually care about.'],
    ],
  },
  quiz: [
    { q: 'What does a machine-learning algorithm take as input during training?', opts: ['Only rules', 'Examples, usually with known answers', 'Only new customers', 'A finished model'], a: 1, why: 'Training learns the rule from examples (and their labels, in supervised learning).' },
    { q: 'Grouping customers into segments without any labels is…', opts: ['Supervised learning', 'Unsupervised learning', 'Reinforcement learning', 'Not machine learning'], a: 1, why: 'There are no answers given; the algorithm finds structure.' },
    { q: 'Examples (1, 2), (2, 4), (3, 7). What w minimises Σ(y − w x)²?', opts: ['2', '31/14 ≈ 2.214', '7/3', '13/6'], a: 1, why: 'w = Σxy / Σx² = 31 / 14.' },
    { q: 'A model scores 99% on training data and 60% on new data. What happened?', opts: ['It generalises well', 'It memorised the training data', 'The new data is wrong', 'Nothing; this is normal'], a: 1, why: 'A large gap between training and new-data accuracy means memorisation (overfitting).' },
    { q: 'When is a hand-written rule the better choice?', opts: ['Never', 'When the pattern is simple, known and stable', 'When there is lots of data', 'When accuracy matters'], a: 1, why: 'Rules are cheaper and more explainable when they work.' },
  ],
  exercise: {
    task: ['Write <code>fit_slope(xs, ys)</code> returning the least-squares w for y ≈ w × x, and use it to predict y for x = 5 from the data below. Store the prediction in <code>pred</code>.'],
    starter: `def fit_slope(xs, ys):
    pass


xs = [2, 4, 6]
ys = [5, 9, 13]
pred = None
print(pred)`,
    check: `assert abs(fit_slope([1, 2, 3], [2, 4, 7]) - 31 / 14) < 1e-12
assert abs(pred - 5 * (2*5 + 4*9 + 6*13) / (4 + 16 + 36)) < 1e-9, "w = Σxy / Σx², then multiply by 5"`,
    solution: `def fit_slope(xs, ys):
    return sum(x * y for x, y in zip(xs, ys)) / sum(x * x for x in xs)


xs = [2, 4, 6]
ys = [5, 9, 13]
pred = fit_slope(xs, ys) * 5
print(pred)`,
    hint: 'w = Σxy / Σx². Use <code>zip(xs, ys)</code> to pair the values.',
  },
};

// ===================================================================== P1.02
const l2 = {
  id: 'p1-02', title: 'Framing an ML problem', time: '35 minutes',
  sub: 'Turn a business worry into a precise prediction task: what exactly is predicted, when, from what data, and how the prediction pays off.',
  learn: ['Define a target label with an observation window and an outcome window', 'Check that every feature is available at prediction time', 'Link the model’s metric to the business action and its cost'],
  legend: [[DATA, 'history used'], [SIGNAL, 'prediction moment'], [GOOD, 'outcome window'], [BAD, 'leak']],
  steps: [
    {
      t: 'A worry is not a task', b: ['Jones says: "Some customers are drifting away." That is a worry. A model needs a precise question with a yes/no or a number as the answer.'],
      n: 'Start with the decision: Jones can send a retention coupon. Whom should he send it to?',
      s: { jones: P(0, 1.2, { c: 'teal', sk: 1, s: 1.5, t: 'Jones', mood: 'worried', pose: 'think' }), q: Bub('Some customers are\ndrifting away…', 0, 1.2, { z: 3.4, c: 'teal' }) },
    },
    {
      t: 'Pick the moment of prediction', b: ['Predictions are made on a schedule, say every Monday. On that day (the cutoff), we may only use what is known before it.', 'Everything after the cutoff is the future.'],
      n: 'The amber marker is the cutoff. Left of it: known. Right of it: unknown.',
      clear: true,
      s: { tl: S(5.0, 0, 10.0, 0.6, { c: 'slate', h: 0.06 }), cut: B('', 6.0, 0, { c: 'amber', w: 0.1, d: 1.2, h: 1.0, noshadow: 1 }), cl: T('cutoff: Monday 3 Nov', 6.0, -1.2, { z: 1.2, fs: 12, b: 1, c: 'amber' }), past: T('known history', 2.6, 1.1, { fs: 11.5, c: 'muted' }), fut: T('future', 8.4, 1.1, { fs: 11.5, c: 'muted' }) },
    },
    {
      t: 'Define the label precisely', b: ['Churn label = 1 if the customer places <b>no order in the 60 days after the cutoff</b>, else 0. Only customers who ordered in the 180 days before the cutoff are included.', 'Now the question has one correct answer for every customer.'],
      n: 'Observation window (blue) gives features; outcome window (green) gives the label.',
      s: { obs: S(3.0, 0, 6.0, 0.7, { c: 'blue', h: 0.1, z: 0.07 }), out: S(8.0, 0, 4.0, 0.7, { c: 'green', h: 0.1, z: 0.07 }), ol: T('180 days of history → features', 3.0, 1.2, { z: 0.2, fs: 11.5, b: 1, c: 'blue' }), gl: T('next 60 days → label', 8.0, 1.2, { z: 0.2, fs: 11.5, b: 1, c: 'green' }), past: null, fut: null },
    },
    {
      t: 'Features must exist at the cutoff', b: ['"Days since last order" and "orders in the last 90 days" are known on Monday: fine. "Opened the coupon email" happens after the cutoff: using it would leak the future into training.', 'Leakage makes a model look brilliant in testing and fail in production (lesson P1.16).'],
      n: 'Ask of every feature: would I know this on the morning of the prediction?',
      warn: true,
      s: { f1: Tl('days since last order', 3.0, 3.1, { c: 'blue', w: 2.6, d: 0.9, fs: 9.5 }), f2: Tl('opened coupon email', 8.0, 3.1, { c: 'coral', w: 2.6, d: 0.9, fs: 9.5, hl: 1 }) },
    },
    {
      t: 'Connect the metric to money', b: ['A coupon costs ₹100. If it saves a churner, ShopSense keeps about ₹1,500 of future margin, and it works for 1 in 5 churners.', 'So a coupon pays only when the model is right often enough: <b>precision of at least 33%</b> among the customers it targets.'],
      n: 'The business case sets the bar the model must clear, before any training.',
      clear: true,
      s: { c1: Tl('coupon cost ₹100', 0, 0, { c: 'coral', w: 2.2, d: 1.0, fs: 10 }), c2: Tl('saved value 0.2 × ₹1,500 = ₹300', 3.6, 0, { c: 'green', w: 3.4, d: 1.0, fs: 9.5 }), c3: Tl('break-even precision\n100 / 300 = 33%', 7.8, 0, { c: 'amber', w: 2.8, d: 1.2, fs: 9.5 }) },
      l: { a: L('c1', 'c3', { c: 'muted', na: 1 }), b: L('c2', 'c3', { c: 'muted', na: 1 }) },
    },
  ],
  math: {
    blocks: [
      { h: 'Label definition', f: 'yᵢ = 1  if customer i has no order in (cutoff, cutoff + 60 days]\nyᵢ = 0  otherwise' },
      { h: 'Expected value of targeting one customer', f: 'EV = P(churner) · p_save · V − c', p: 'p_save is the chance the coupon changes the outcome, V the value kept, c the coupon cost. Among targeted customers, P(churner) is the model’s precision.' },
      { h: 'Break-even precision', f: 'precision ≥ c / (p_save · V)' },
    ],
    example: {
      intro: 'How good must the churn model be for coupons to pay?',
      steps: ['Coupon cost c = ₹100. Value kept if saved V = ₹1,500. The coupon saves p_save = 20% of real churners.', 'Expected gain from targeting a real churner: 0.2 × 1,500 = <b>₹300</b>.', 'Targeting a non-churner wastes the ₹100 coupon. EV = precision × 300 − 100.', 'EV ≥ 0 when precision ≥ 100 / 300 = <b>33.3%</b>. A model whose targeted list is under a third churners loses money.'],
    },
  },
  code: {
    scratch: { why: 'The label rule written out for a handful of customers.', src: `from datetime import date, timedelta

cutoff = date(2026, 11, 3)
horizon = timedelta(days=60)
orders = {                     # customer -> order dates
    "Priya": [date(2026, 9, 2), date(2026, 10, 20), date(2026, 11, 15)],
    "Arun": [date(2026, 8, 1), date(2026, 9, 5)],
    "Meera": [date(2026, 10, 30), date(2027, 1, 20)],
}

for name, dates in orders.items():
    future = [d for d in dates if cutoff < d <= cutoff + horizon]
    days_since = (cutoff - max(d for d in dates if d <= cutoff)).days
    print(f"{name:6s} days since last order={days_since:3d}  churn label={int(not future)}")` },
    library: { why: 'Build labels and cutoff-safe features for every customer with pandas.', src: `import pandas as pd

orders = pd.DataFrame({
    "customer": ["Priya", "Priya", "Priya", "Arun", "Arun", "Meera", "Meera"],
    "order_date": pd.to_datetime(["2026-09-02", "2026-10-20", "2026-11-15", "2026-08-01",
                                  "2026-09-05", "2026-10-30", "2027-01-20"]),
    "amount": [1299, 799, 2499, 1899, 999, 3499, 1599],
})
cutoff, horizon = pd.Timestamp("2026-11-03"), pd.Timedelta(days=60)

past = orders[orders["order_date"] <= cutoff]
future = orders[(orders["order_date"] > cutoff) & (orders["order_date"] <= cutoff + horizon)]

features = past.groupby("customer").agg(
    days_since_last=("order_date", lambda d: (cutoff - d.max()).days),
    orders_180d=("order_date", "count"),
    spend_180d=("amount", "sum"),
)
features["churn"] = (~features.index.isin(future["customer"])).astype(int)
print(features)` },
    prod: { why: 'A label builder that makes the cutoff explicit and tests that no future data leaks in.', src: `import pandas as pd


def build_training_rows(orders: pd.DataFrame, cutoff: str, horizon_days: int = 60, lookback_days: int = 180) -> pd.DataFrame:
    """One row per active customer: features from before the cutoff, label from after it."""
    cut = pd.Timestamp(cutoff)
    start = cut - pd.Timedelta(days=lookback_days)
    past = orders[(orders["order_date"] > start) & (orders["order_date"] <= cut)]
    future = orders[(orders["order_date"] > cut) & (orders["order_date"] <= cut + pd.Timedelta(days=horizon_days))]
    rows = past.groupby("customer").agg(last=("order_date", "max"), orders=("order_date", "count"), spend=("amount", "sum"))
    rows["days_since_last"] = (cut - rows.pop("last")).dt.days
    rows["churn"] = (~rows.index.isin(future["customer"])).astype(int)
    rows["cutoff"] = cut
    return rows


def test_no_future_data_in_features() -> None:
    o = pd.DataFrame({"customer": ["a", "a"], "order_date": pd.to_datetime(["2026-10-01", "2026-11-10"]), "amount": [100, 9999]})
    r = build_training_rows(o, "2026-11-03")
    assert r.loc["a", "spend"] == 100, "spend after the cutoff must not count"
    assert r.loc["a", "churn"] == 0


test_no_future_data_in_features()
print("Cutoff safety test passed.")` },
  },
  industry: {
    when: ['At the very start of every ML project, before any data pull.', 'When a model works offline but disappoints in production: re-check the framing.', 'In design reviews: the label definition and cutoff are the first questions.'],
    baseline: 'A rule such as "no order in 45 days" uses the same label and metric, and gives the number the model must beat.',
    tools: ['A one-page problem brief: decision, label, cutoff, features, metric, baseline', 'pandas or SQL with an explicit cutoff parameter', 'A spreadsheet for the cost model'],
    tradeoffs: ['A longer outcome window gives more certain labels but older training data.', 'A narrow population (recent buyers only) is easier to predict but excludes some customers.'],
    failures: ['Labels that depend on the action the model triggers (coupon recipients behave differently).', 'Features computed over all time instead of up to the cutoff.', 'Optimising accuracy when the business cares about precision at a budget.'],
    shopsense: 'The Phase 1 churn model uses exactly this frame: weekly cutoff, 180-day lookback, 60-day outcome, and a precision target set by the coupon economics.',
    interview: [
      ['How would you define churn for an e-commerce company?', 'Choose a cutoff and an outcome window, for example no order in the next 60 days, among customers active in the previous 180 days, and check the definition with the business.'],
      ['What is point-in-time correctness?', 'Every feature value used for a training row must be what was known at that row’s cutoff, never later information.'],
      ['How do you choose the metric for a churn model?', 'From the action: if a coupon has a cost and a save rate, compute the break-even precision and evaluate precision and recall at the budgeted number of coupons.'],
    ],
  },
  quiz: [
    { q: 'Which is a well-framed prediction target?', opts: ['Customers who are unhappy', 'No order in the 60 days after the cutoff', 'Customers who might leave someday', 'Low-value customers'], a: 1, why: 'It has a precise window and one correct answer per customer.' },
    { q: 'Which feature leaks the future for a Monday cutoff?', opts: ['Days since last order', 'Orders in the last 90 days', 'Opened the coupon email sent on Tuesday', 'City'], a: 2, why: 'It happens after the prediction moment.' },
    { q: 'Coupon ₹100, value kept ₹1,500, save rate 20%. What is the break-even precision?', opts: ['6.7%', '20%', '33.3%', '50%'], a: 2, why: '100 / (0.2 × 1,500) = 100 / 300.' },
    { q: 'Why fix the cutoff date explicitly in code?', opts: ['It is faster', 'So features cannot accidentally use information from after the prediction moment', 'pandas needs it', 'To reduce memory'], a: 1, why: 'Point-in-time correctness prevents leakage.' },
    { q: 'What should come before choosing a model?', opts: ['Hyperparameter tuning', 'The decision, label, cutoff, metric and baseline', 'Buying GPUs', 'Feature importance'], a: 1, why: 'Framing determines everything that follows.' },
  ],
  exercise: {
    task: ['Write <code>break_even_precision(cost, value, save_rate)</code>. Then compute <code>bep</code> for a ₹150 voucher, ₹2,000 value kept and a 25% save rate, and set <code>worth_it</code> to True if a model with 28% precision makes money.'],
    starter: `def break_even_precision(cost, value, save_rate):
    pass


bep = None
worth_it = None
print(bep, worth_it)`,
    check: `assert abs(break_even_precision(100, 1500, 0.2) - 1 / 3) < 1e-12
assert abs(bep - 0.3) < 1e-12
assert worth_it is False, "28% precision is below the 30% break-even"`,
    solution: `def break_even_precision(cost, value, save_rate):
    return cost / (save_rate * value)


bep = break_even_precision(150, 2000, 0.25)
worth_it = 0.28 >= bep
print(bep, worth_it)`,
    hint: 'precision ≥ cost / (save_rate × value). Compare 0.28 with that number.',
  },
};

// ===================================================================== P1.03
const FOLD = (k) => Object.fromEntries(Array.from({ length: 5 }, (_, i) => [`f${i}`, { k: 'tile', x: i * 1.6, y: k * 1.6, w: 1.45, d: 0.9, h: 0.14, c: i === k ? 'amber' : 'blue', t: i === k ? 'validate' : 'train', fs: 9 }]));
const l3 = {
  id: 'p1-03', title: 'Splits and cross-validation', time: '35 minutes',
  sub: 'Hold data back so you can measure how a model does on data it has never seen, and use cross-validation to measure it reliably.',
  learn: ['Split data into training, validation and test sets and explain each one’s job', 'Run k-fold cross-validation and report a mean with its spread', 'Use time-based splits for data where the future must not inform the past'],
  legend: [[DATA, 'train'], [SIGNAL, 'validation'], [BAD, 'test (locked)'], [GOOD, 'score']],
  steps: [
    {
      t: 'Never grade on the training data', b: ['If a model is scored on the same customers it learned from, it can score well just by memorising. We must keep some data aside.'],
      n: 'A student who saw the exam questions in advance is not proven to understand the subject.',
      s: { all: Tl('10,000 customers', 0, 0, { c: 'blue', w: 6.0, d: 1.2, fs: 11 }) },
    },
    {
      t: 'Three sets, three jobs', b: ['<b>Training</b> (70%): the model learns from it. <b>Validation</b> (15%): compare models and settings. <b>Test</b> (15%): touched once, at the very end, to report the final score.', 'If you keep checking the test set while choosing models, it stops being an honest test.'],
      n: 'The coral test set stays locked until the end.',
      s: { all: null, tr: Tl('train 70%', 0, 0, { c: 'blue', w: 4.2, d: 1.2, fs: 11 }), va: Tl('validation 15%', 3.75, 0, { c: 'amber', w: 1.6, d: 1.2, fs: 9 }), te: Tl('test 15%', 5.55, 0, { c: 'coral', w: 1.6, d: 1.2, fs: 9.5 }) },
    },
    {
      t: 'k-fold cross-validation', b: ['With limited data, one validation slice is noisy. Cross-validation splits the training data into k folds (here 5) and trains 5 times, each time validating on a different fold.', 'Every row is used for validation exactly once.'],
      n: 'Rows move down the picture: each run validates on a different amber fold.',
      clear: true,
      s: { ...Object.fromEntries([0, 1, 2, 3, 4].flatMap((k) => Object.entries(FOLD(k)).map(([key, v]) => [`r${k}${key}`, v]))), cl: T('5 runs, 5 different validation folds', -1.6, -1.6, { z: 0.4, fs: 12.5, b: 1 }) },
    },
    {
      t: 'Report the mean and the spread', b: ['The five runs give five scores, for example 0.82, 0.85, 0.80, 0.84 and 0.83. Report <b>0.828 ± 0.019</b> (mean ± standard deviation).', 'If two models differ by less than the spread, the difference may be noise.'],
      n: 'One number hides how stable the model is; the spread shows it.',
      s: { ...Object.fromEntries([0.82, 0.85, 0.80, 0.84, 0.83].map((v, k) => [`sc${k}`, Tl(v.toFixed(2), 9.0, k * 1.6, { c: 'green', w: 1.2, d: 0.9, fs: 10 })])), cl: { t: 'mean 0.828 ± 0.019' } },
    },
    {
      t: 'Time series: split by time', b: ['For demand forecasting, a random split lets the model peek at November while predicting October. Instead train on the past and validate on the period right after it, rolling forward.', 'This mirrors how the model is really used.'],
      n: 'Each run trains only on weeks before the amber validation weeks.',
      warn: true,
      clear: true,
      s: Object.fromEntries([0, 1, 2].flatMap((k) => [[`t${k}`, Tl('train', (1.0 + k * 1.1), k * 1.3, { c: 'blue', w: 2.0 + k * 2.2, d: 0.9, fs: 9.5 })], [`v${k}`, Tl('validate', 2.0 + k * 2.2 + 0.85, k * 1.3, { c: 'amber', w: 1.5, d: 0.9, fs: 9 })]])),
    },
  ],
  math: {
    blocks: [
      { h: 'Cross-validated estimate', f: 'CV = (1/k) Σⱼ score(model trained without fold j, evaluated on fold j)' },
      { h: 'Spread', f: 's = √( Σ (scoreⱼ − CV)² / (k − 1) )', p: 'Report CV ± s. A rough standard error of the mean is s / √k.' },
    ],
    example: {
      intro: 'Summarise five fold accuracies: 0.82, 0.85, 0.80, 0.84, 0.83.',
      steps: ['Mean = (0.82 + 0.85 + 0.80 + 0.84 + 0.83) / 5 = 4.14 / 5 = <b>0.828</b>.', 'Deviations: −0.008, 0.022, −0.028, 0.012, 0.002. Squares sum to 0.00148.', 'Variance = 0.00148 / 4 = 0.00037; s = √0.00037 ≈ <b>0.019</b>.', 'Report 0.828 ± 0.019. Another model at 0.835 is not clearly better.'],
    },
  },
  code: {
    scratch: { why: 'k-fold indices by hand, then the mean and spread of fold scores.', src: `from statistics import mean, stdev


def kfold_indices(n, k):
    fold_size = n // k
    for j in range(k):
        start = j * fold_size
        stop = n if j == k - 1 else start + fold_size
        val = list(range(start, stop))
        train = [i for i in range(n) if i < start or i >= stop]
        yield train, val


for j, (train, val) in enumerate(kfold_indices(10, 5)):
    print(f"fold {j}: validate {val}, train on {len(train)} rows")

scores = [0.82, 0.85, 0.80, 0.84, 0.83]
print(f"CV = {mean(scores):.3f} ± {stdev(scores):.3f}")` },
    library: { why: 'scikit-learn: a held-out test set, then 5-fold cross-validation on the rest.', src: `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, train_test_split

rng = np.random.default_rng(0)
n = 2_000
days = rng.integers(0, 120, n)
orders = rng.poisson(3, n)
churn = (rng.random(n) < 1 / (1 + np.exp(-(0.04 * days - 0.5 * orders - 0.5)))).astype(int)
X = np.c_[days, orders]

X_trval, X_test, y_trval, y_test = train_test_split(X, churn, test_size=0.15, random_state=0, stratify=churn)
scores = cross_val_score(LogisticRegression(), X_trval, y_trval, cv=5, scoring="accuracy")
print("fold scores:", np.round(scores, 3))
print(f"CV accuracy = {scores.mean():.3f} ± {scores.std(ddof=1):.3f}")

final = LogisticRegression().fit(X_trval, y_trval)
print(f"test accuracy (reported once) = {final.score(X_test, y_test):.3f}")` },
    prod: { why: 'Time-based validation for weekly demand: each fold trains strictly on the past.', src: `import numpy as np
from sklearn.model_selection import TimeSeriesSplit

weeks = np.arange(1, 53)                 # 52 weeks of history
tss = TimeSeriesSplit(n_splits=4, test_size=4)


def check_no_future(train_idx, val_idx) -> None:
    assert weeks[train_idx].max() < weeks[val_idx].min(), "training must end before validation starts"


for i, (tr, va) in enumerate(tss.split(weeks)):
    check_no_future(tr, va)
    print(f"split {i}: train weeks {weeks[tr][0]}–{weeks[tr][-1]}, validate weeks {weeks[va][0]}–{weeks[va][-1]}")` },
  },
  industry: {
    when: ['Every model comparison and every hyperparameter choice.', 'Small datasets, where one validation slice is too noisy.', 'Time-ordered data: always split by time.'],
    baseline: 'Hold out a test set first and do not look at it. Compare models with 5-fold cross-validation on the rest (or time-based folds).',
    tools: ['scikit-learn train_test_split, KFold, StratifiedKFold, GroupKFold, TimeSeriesSplit', 'cross_val_score and cross_validate'],
    tradeoffs: ['More folds give a better estimate but cost more training runs.', 'A bigger test set gives a more reliable final number but leaves less data to train on.'],
    failures: ['Tuning on the test set until it looks good.', 'Random splits on time series, letting the future leak into training.', 'Rows from the same customer in both train and validation (use GroupKFold).', 'Preprocessing (scaling, imputing) fitted on all data before splitting.'],
    shopsense: 'The churn model uses customer-grouped folds; the demand model uses rolling weekly splits, matching how predictions are made each Monday.',
    interview: [
      ['Why do we need a separate test set if we use cross-validation?', 'Cross-validation scores are used to choose models, so they become optimistic. An untouched test set gives an honest final estimate.'],
      ['How do you validate a time-series model?', 'With forward-chaining splits: train on data up to a point, validate on the period after it, and roll forward.'],
      ['What is stratified k-fold?', 'Folds that keep the class proportions the same as in the full data, important for imbalanced labels such as churn.'],
    ],
  },
  quiz: [
    { q: 'What is the test set for?', opts: ['Choosing hyperparameters', 'An honest final estimate, used once at the end', 'Training the model', 'Feature engineering'], a: 1, why: 'Using it for choices makes it optimistic.' },
    { q: 'Five fold scores average 0.828 with s = 0.019. Another model scores 0.835. Conclusion?', opts: ['Clearly better', 'Not clearly better: the difference is within the spread', 'Clearly worse', 'Cross-validation failed'], a: 1, why: '0.007 is much smaller than the fold-to-fold variation.' },
    { q: 'In 5-fold cross-validation, how many times is each row used for validation?', opts: ['0', '1', '4', '5'], a: 1, why: 'Each row belongs to exactly one validation fold.' },
    { q: 'Forecasting weekly demand: which split is right?', opts: ['Random 80/20', 'Train on earlier weeks, validate on later weeks', 'Validate on the first weeks', 'No split needed'], a: 1, why: 'The model must not see the future it predicts.' },
    { q: 'Scaling features on all data before splitting causes…', opts: ['Faster training', 'Leakage of validation information into training', 'Better generalisation', 'Nothing'], a: 1, why: 'Fit preprocessing on training folds only, ideally inside a pipeline.' },
  ],
  exercise: {
    task: ['Write <code>kfold_indices(n, k)</code> returning a list of <code>(train, val)</code> index lists, where folds are consecutive blocks and the last fold takes any leftover rows.'],
    starter: `def kfold_indices(n, k):
    pass


print(kfold_indices(7, 3))`,
    check: `folds = kfold_indices(7, 3)
assert [f[1] for f in folds] == [[0, 1], [2, 3], [4, 5, 6]]
assert all(sorted(tr + va) == list(range(7)) for tr, va in folds), "train + val must cover every row once"`,
    solution: `def kfold_indices(n, k):
    size = n // k
    folds = []
    for j in range(k):
        start = j * size
        stop = n if j == k - 1 else start + size
        val = list(range(start, stop))
        train = [i for i in range(n) if not start <= i < stop]
        folds.append((train, val))
    return folds


for train, val in kfold_indices(7, 3):
    print(val)`,
    hint: 'Fold j runs from <code>j * (n // k)</code>; the last fold stops at n.',
  },
};

// ===================================================================== P1.04
const AX = [1, 2, 3, 4, 5], AY = [12, 15, 19, 21, 26];
const sx = 1.6, sz = 0.12;
const l4 = {
  id: 'p1-04', title: 'Linear regression', time: '40 minutes',
  sub: 'Fit a straight line (or plane) through data to predict a number, read what its coefficients mean, and measure how much it explains.',
  learn: ['Fit a line by least squares and interpret its slope and intercept', 'Extend to several features and read each coefficient', 'Measure fit with residuals and R²'],
  legend: [[DATA, 'week'], [GOOD, 'fitted line'], [BAD, 'residual']],
  steps: [
    {
      t: 'Ad spend and saree orders', b: ['Five weeks of data: ad spend (₹ thousand) and saree orders (hundreds). More spend tends to bring more orders.', 'Can a straight line predict orders from spend?'],
      n: 'Position along the floor is ad spend; height is orders.',
      s: { ...floor(9.0, 'ad spend (₹ thousand) →'), ...Object.fromEntries(AX.map((x, i) => ['p' + i, dot(x * sx, AY[i] * sz, { sub: `${x}k · ${AY[i]}` })])) },
    },
    {
      t: 'Least squares picks the line', b: ['For any line, the residual of each point is its vertical distance to the line. Least squares picks the line that makes the sum of squared residuals smallest.', 'Here: <b>orders = 8.4 + 3.4 × spend</b>.'],
      n: 'Squaring means big misses count much more than small ones.',
      s: { ...lineThrough('ln', 0.5 * sx, (8.4 + 3.4 * 0.5) * sz, 5.5 * sx, (8.4 + 3.4 * 5.5) * sz), eq: T('orders = 8.4 + 3.4 × spend', -1.6, -2.4, { z: 4.0, fs: 13, b: 1, c: 'green' }) },
      l: { fit: L('lna', 'lnb', { c: 'green', na: 1, sw: 3 }) },
    },
    {
      t: 'Residuals show what the line misses', b: ['Week 3 had 19 hundred orders; the line predicts 18.6. Its residual is +0.4. Week 4 predicts 22.0 but saw 21: residual −1.', 'Patterns in residuals (for example, all positive at high spend) mean a straight line is the wrong shape.'],
      n: 'Coral stems are the residuals. Small and random is what we want.',
      s: Object.fromEntries(AX.flatMap((x, i) => { const yh = 8.4 + 3.4 * x; return [[`h${i}`, { k: 'orb', x: 0, y: -x * sx, z: yh * sz, r: 0.05, c: 'coral', noshadow: 1 }]]; })),
      l: Object.fromEntries(AX.map((_, i) => [`r${i}`, L('p' + i, 'h' + i, { c: 'coral', na: 1, sw: 2 })])),
    },
    {
      t: 'Reading the coefficients', b: ['Slope 3.4: each extra ₹1,000 of ad spend goes with about 340 more orders. Intercept 8.4: predicted orders with zero spend (840).', 'With several features, each coefficient means the change when that feature rises by one and the others stay fixed.'],
      n: 'Coefficients describe association in this data, not guaranteed cause.',
      s: { eq: { t: 'slope 3.4 = +340 orders per ₹1,000 of ads' } },
    },
    {
      t: 'R²: how much is explained', b: ['R² compares the line’s squared errors with those of simply predicting the average every week. Here R² ≈ 0.986: the line explains about 99% of the week-to-week variation.', 'R² near 0 means the line is no better than the average.'],
      n: 'High R² on five points can still mislead; check on held-out weeks.',
      s: { eq: { t: 'R² ≈ 0.986' } },
    },
  ],
  math: {
    blocks: [
      { h: 'Simple linear regression', f: 'ŷ = a + b x\nb = Σ(x − x̄)(y − ȳ) / Σ(x − x̄)²\na = ȳ − b x̄' },
      { h: 'Many features (matrix form)', f: 'ŷ = X w\nw = (Xᵀ X)⁻¹ Xᵀ y', p: 'X has a column of ones for the intercept. Libraries solve this stably without forming the inverse.' },
      { h: 'R²', f: 'R² = 1 − Σ(y − ŷ)² / Σ(y − ȳ)²' },
    ],
    example: {
      intro: 'Fit orders (y) on ad spend (x): x = 1, 2, 3, 4, 5 and y = 12, 15, 19, 21, 26.',
      steps: ['Means: x̄ = 3, ȳ = 93 / 5 = 18.6.', 'Deviations x − x̄: −2, −1, 0, 1, 2. y − ȳ: −6.6, −3.6, 0.4, 2.4, 7.4. Products sum to 13.2 + 3.6 + 0 + 2.4 + 14.8 = <b>34</b>; Σ(x − x̄)² = <b>10</b>.', 'Slope b = 34 / 10 = <b>3.4</b>. Intercept a = 18.6 − 3.4 × 3 = <b>8.4</b>.', 'Predicted orders at x = 6: 8.4 + 3.4 × 6 = <b>28.8</b> hundred. Residual sum of squares = 1.6 against a total of 117.2, so R² = 1 − 1.6 / 117.2 ≈ <b>0.986</b>.'],
    },
  },
  code: {
    scratch: { why: 'Slope, intercept and R² from the formulas.', src: `xs = [1, 2, 3, 4, 5]
ys = [12, 15, 19, 21, 26]

x_bar, y_bar = sum(xs) / len(xs), sum(ys) / len(ys)
b = sum((x - x_bar) * (y - y_bar) for x, y in zip(xs, ys)) / sum((x - x_bar) ** 2 for x in xs)
a = y_bar - b * x_bar
pred = [a + b * x for x in xs]
ss_res = sum((y - p) ** 2 for y, p in zip(ys, pred))
ss_tot = sum((y - y_bar) ** 2 for y in ys)

print(f"orders = {a:.1f} + {b:.1f} × spend")
print("residuals:", [round(y - p, 1) for y, p in zip(ys, pred)])
print(f"R² = {1 - ss_res / ss_tot:.3f}")` },
    library: { why: 'scikit-learn with two features: ad spend and discount.', src: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

rng = np.random.default_rng(4)
spend = rng.uniform(1, 10, 120)          # ₹ thousand
discount = rng.uniform(0, 30, 120)       # percent
orders = 8 + 3.2 * spend + 0.4 * discount + rng.normal(0, 2, 120)
X = np.c_[spend, discount]

model = LinearRegression().fit(X[:100], orders[:100])
print(f"intercept {model.intercept_:.2f}")
print("coefficients (spend, discount):", np.round(model.coef_, 2))
print(f"R² on 20 held-out weeks: {r2_score(orders[100:], model.predict(X[100:])):.3f}")` },
    prod: { why: 'A tested fit helper that refuses collinear or too-small data.', src: `import numpy as np


def fit_ols(X: np.ndarray, y: np.ndarray) -> tuple[float, np.ndarray]:
    """Least-squares fit with an intercept. Returns (intercept, coefficients)."""
    if X.ndim != 2 or len(X) != len(y):
        raise ValueError("X must be 2-D with one row per y")
    if len(X) <= X.shape[1] + 1:
        raise ValueError("need more rows than features + 1")
    A = np.c_[np.ones(len(X)), X]
    if np.linalg.matrix_rank(A) < A.shape[1]:
        raise ValueError("features are perfectly collinear")
    w, *_ = np.linalg.lstsq(A, y, rcond=None)
    return float(w[0]), w[1:]


def test_fit_ols() -> None:
    a, b = fit_ols(np.array([[1.0], [2], [3], [4], [5]]), np.array([12.0, 15, 19, 21, 26]))
    assert abs(a - 8.4) < 1e-9 and abs(b[0] - 3.4) < 1e-9
    try:
        fit_ols(np.array([[1.0, 2], [2, 4], [3, 6], [4, 8]]), np.array([1.0, 2, 3, 4]))
    except ValueError as e:
        assert "collinear" in str(e)


test_fit_ols()
print("OLS tests passed.")` },
  },
  industry: {
    when: ['Predicting a number (units, revenue, delivery time) with a roughly linear relationship.', 'As the baseline for any regression problem.', 'When stakeholders need coefficients they can read.'],
    baseline: 'Predict the average (or last week’s value); linear regression must beat it on held-out data.',
    tools: ['scikit-learn LinearRegression', 'statsmodels for coefficient confidence intervals and p-values', 'NumPy lstsq'],
    tradeoffs: ['Simple and interpretable, but misses curves and interactions unless you add features for them.', 'Sensitive to outliers because errors are squared.'],
    failures: ['Reading coefficients as causes.', 'Highly correlated features making coefficients unstable.', 'Extrapolating far beyond the data (₹50 lakh of ads is not in the data).'],
    shopsense: 'A linear model of weekly orders on price, discount and festival flags is the first baseline for the Phase 1 demand forecast.',
    interview: [
      ['What does a coefficient mean in multiple linear regression?', 'The expected change in the target for a one-unit increase in that feature, holding the other features constant.'],
      ['What is R²?', 'The share of the target’s variance explained by the model compared with predicting the mean: 1 − SS_res / SS_tot.'],
      ['What problems does multicollinearity cause?', 'Coefficients become unstable and hard to interpret, though predictions may still be fine; detect it with correlations or variance inflation factors.'],
    ],
  },
  quiz: [
    { q: 'For x = 1..5 and y = 12, 15, 19, 21, 26, what is the least-squares slope?', opts: ['2.8', '3.4', '4.0', '8.4'], a: 1, why: 'Σ(x − x̄)(y − ȳ) / Σ(x − x̄)² = 34 / 10.' },
    { q: 'With orders = 8.4 + 3.4 × spend, what is predicted at spend = 6?', opts: ['20.4', '28.8', '29.8', '34.0'], a: 1, why: '8.4 + 20.4 = 28.8.' },
    { q: 'R² = 0 means…', opts: ['Perfect fit', 'No better than predicting the mean', 'Negative relationship', 'The slope is zero by definition'], a: 1, why: 'R² compares with the mean-only model.' },
    { q: 'What does least squares minimise?', opts: ['The sum of residuals', 'The sum of absolute residuals', 'The sum of squared residuals', 'The number of errors'], a: 2, why: 'Hence the name.' },
    { q: 'A coefficient of 0.4 on discount (%) means…', opts: ['Discounts cause 0.4 more orders', 'Each extra percentage point goes with 0.4 more orders, other features fixed', '40% of orders come from discounts', 'Nothing'], a: 1, why: 'It is an association holding other features constant.' },
  ],
  exercise: {
    task: ['Write <code>fit_line(xs, ys)</code> returning <code>(a, b)</code> for ŷ = a + b x, and <code>r2(xs, ys, a, b)</code>. Fit the data below and store R² in <code>score</code>.'],
    starter: `def fit_line(xs, ys):
    return 0.0, 0.0        # replace: return (intercept, slope)


def r2(xs, ys, a, b):
    return 0.0             # replace


xs = [2, 4, 6, 8]
ys = [5, 9, 11, 15]
a, b = fit_line(xs, ys)
score = r2(xs, ys, a, b)
print(a, b, score)`,
    check: `aa, bb = fit_line([1, 2, 3, 4, 5], [12, 15, 19, 21, 26])
assert abs(aa - 8.4) < 1e-9 and abs(bb - 3.4) < 1e-9
assert abs(b - 1.6) < 1e-9 and abs(a - 2.0) < 1e-9
assert abs(score - (1 - 0.8 / 52)) < 1e-9`,
    solution: `def fit_line(xs, ys):
    xb, yb = sum(xs) / len(xs), sum(ys) / len(ys)
    b = sum((x - xb) * (y - yb) for x, y in zip(xs, ys)) / sum((x - xb) ** 2 for x in xs)
    return yb - b * xb, b


def r2(xs, ys, a, b):
    yb = sum(ys) / len(ys)
    ss_res = sum((y - (a + b * x)) ** 2 for x, y in zip(xs, ys))
    ss_tot = sum((y - yb) ** 2 for y in ys)
    return 1 - ss_res / ss_tot


xs = [2, 4, 6, 8]
ys = [5, 9, 11, 15]
a, b = fit_line(xs, ys)
score = r2(xs, ys, a, b)
print(a, b, score)`,
    hint: 'Slope = Σ(x − x̄)(y − ȳ) / Σ(x − x̄)²; intercept = ȳ − slope × x̄.',
  },
};

// ===================================================================== P1.05
const l5 = {
  id: 'p1-05', title: 'Regularisation', time: '40 minutes',
  sub: 'Stop a model from memorising noise by penalising large coefficients: ridge shrinks them, lasso can switch features off.',
  learn: ['Recognise overfitting from training and validation error', 'Explain how ridge and lasso penalties change coefficients', 'Choose the penalty strength with cross-validation'],
  legend: [[DATA, 'data'], [BAD, 'overfit curve'], [GOOD, 'regularised fit']],
  steps: [
    {
      t: 'Twelve noisy weeks', b: ['Weekly orders against discount, with some noise. The true relationship is close to a gentle line.'],
      n: 'Noise is variation the features cannot explain.',
      s: { ...floor(9.6, 'discount →'), ...Object.fromEntries([1.5, 1.9, 1.7, 2.3, 2.0, 2.6, 2.4, 2.9, 2.7, 3.2, 3.0, 3.5].map((z, i) => ['p' + i, dot(0.7 + i * 0.75, z)])) },
    },
    {
      t: 'A flexible model memorises', b: ['A degree-11 polynomial can pass through all twelve points exactly: zero training error. Between the points it swings wildly.', 'On new weeks its predictions are terrible. That is overfitting.'],
      n: 'Zero training error is a warning sign, not a success.',
      warn: true,
      s: {},
      l: Object.fromEntries(Array.from({ length: 11 }, (_, i) => [`w${i}`, L('p' + i, 'p' + (i + 1), { c: 'coral', na: 1, sw: 2.5, bend: i % 2 ? 0.7 : -0.7 })])),
    },
    {
      t: 'Penalise large coefficients', b: ['Wild curves need very large coefficients. Regularisation adds a penalty for coefficient size to the loss: the model must now balance fitting the data against keeping coefficients small.', 'The result is a smoother curve that generalises.'],
      n: 'Green: the regularised fit. Smoother, slightly worse on training, much better on new weeks.',
      s: { ...lineThrough('rg', 0.4, 1.55, 9.3, 3.45) },
      l: { ...Object.fromEntries(Array.from({ length: 11 }, (_, i) => [`w${i}`, null])), rg: L('rga', 'rgb', { c: 'green', na: 1, sw: 3 }) },
    },
    {
      t: 'Ridge versus lasso', b: ['<b>Ridge</b> (L2) penalises squared coefficients: every coefficient shrinks towards zero but rarely reaches it. <b>Lasso</b> (L1) penalises absolute values: unhelpful coefficients become exactly zero, so it also selects features.'],
      n: 'Bars are coefficients of 6 features. Lasso switches 3 of them off.',
      clear: true,
      s: mg(bars('r', [2.2, 1.4, 0.9, 0.6, 0.4, 0.3], { x: 0, y: 0, dx: 0.7, w: 0.5, d: 0.5, c: 'blue' }), bars('l', [2.0, 1.1, 0.5, 0.02, 0.02, 0.02], { x: 5.6, y: 0, dx: 0.7, w: 0.5, d: 0.5, c: 'green' }), { rl: T('ridge: all shrink', 1.8, -1.6, { z: 2.6, fs: 12.5, b: 1, c: 'blue' }), ll: T('lasso: some become 0', 7.4, -1.6, { z: 2.6, fs: 12.5, b: 1, c: 'green' }) }),
    },
    {
      t: 'Choose the strength with validation', b: ['The penalty strength λ (alpha in scikit-learn) controls the trade-off. Too small: overfits. Too large: underfits (everything shrinks to nothing).', 'Try a range of values with cross-validation and keep the one with the lowest validation error.'],
      n: 'Validation error is U-shaped in λ. Pick the bottom of the U.',
      clear: true,
      s: mg(bars('v', [2.4, 1.5, 1.0, 0.8, 1.1, 1.8, 2.6], { x: 0, y: 0, dx: 0.9, w: 0.6, d: 0.6, c: 'amber', labels: ['0.001', '', '', 'best', '', '', '1000'] }), { v3: { c: 'green' }, vl: T('validation error vs λ', 2.7, -1.6, { z: 2.8, fs: 12.5, b: 1 }) }),
    },
  ],
  math: {
    blocks: [
      { h: 'Ridge (L2)', f: 'minimise  Σ(y − ŷ)² + λ Σⱼ wⱼ²' },
      { h: 'Lasso (L1)', f: 'minimise  Σ(y − ŷ)² + λ Σⱼ |wⱼ|', p: 'The absolute value has a corner at zero, which is why lasso can set coefficients exactly to zero.' },
      { h: 'One-feature ridge, closed form', f: 'w = Σ x y / (Σ x² + λ)', p: 'λ = 0 gives ordinary least squares (through the origin). Larger λ shrinks w towards 0.' },
    ],
    example: {
      intro: 'Ridge shrinkage on the data (1, 2), (2, 4), (3, 7) for y ≈ w x.',
      steps: ['Σxy = 31 and Σx² = 14 (as in P1.01).', 'λ = 0: w = 31 / 14 ≈ <b>2.214</b>, ordinary least squares.', 'λ = 7: w = 31 / (14 + 7) = 31 / 21 ≈ <b>1.476</b>. The coefficient is pulled towards zero.', 'λ → ∞: w → 0. Cross-validation picks the λ between these extremes that predicts new data best.'],
    },
  },
  code: {
    scratch: { why: 'Overfitting in action: low and high polynomial degrees on train and validation weeks.', src: `import numpy as np

rng = np.random.default_rng(2)
x = np.linspace(0, 1, 24)
y = 1.5 + 2.0 * x + rng.normal(0, 0.25, x.size)
train, val = np.arange(0, 24, 2), np.arange(1, 24, 2)

for degree in (1, 3, 9):
    coefs = np.polyfit(x[train], y[train], degree)
    err = lambda idx: np.mean((np.polyval(coefs, x[idx]) - y[idx]) ** 2)
    print(f"degree {degree}: train MSE {err(train):.3f}  validation MSE {err(val):.3f}  largest |coef| {np.abs(coefs).max():.0f}")` },
    library: { why: 'Ridge shrinks all coefficients; lasso sets weak ones to exactly zero.', src: `import numpy as np
from sklearn.linear_model import Lasso, LinearRegression, Ridge
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(5)
n = 200
X = rng.normal(size=(n, 6))
y = 3 * X[:, 0] + 2 * X[:, 1] + 1 * X[:, 2] + rng.normal(0, 1, n)   # features 3–5 are noise
X = StandardScaler().fit_transform(X)

for name, model in [("OLS", LinearRegression()), ("Ridge α=50", Ridge(alpha=50)), ("Lasso α=0.3", Lasso(alpha=0.3))]:
    print(f"{name:12s}", np.round(model.fit(X, y).coef_, 2))` },
    prod: { why: 'Scaling plus ridge in one pipeline, with the penalty chosen by cross-validation.', src: `import numpy as np
from sklearn.linear_model import RidgeCV
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(6)
X = rng.normal(size=(300, 20))
y = X[:, :3] @ np.array([3.0, -2.0, 1.5]) + rng.normal(0, 1.5, 300)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, random_state=0)

model = make_pipeline(StandardScaler(), RidgeCV(alphas=np.logspace(-3, 3, 13)))
model.fit(X_tr, y_tr)
print("chosen alpha:", model[-1].alpha_)
print(f"test R²: {model.score(X_te, y_te):.3f}")` },
  },
  industry: {
    when: ['Many features relative to rows.', 'Correlated features making plain coefficients unstable.', 'Lasso when you want a smaller set of features.'],
    baseline: 'Plain linear regression, then RidgeCV with standardised features. Keep whichever validates better.',
    tools: ['scikit-learn Ridge, Lasso, ElasticNet and their CV versions', 'StandardScaler inside a Pipeline'],
    tradeoffs: ['More penalty: lower variance, higher bias.', 'Lasso picks features but can choose arbitrarily among correlated ones; ElasticNet mixes L1 and L2.'],
    failures: ['Forgetting to scale features, so the penalty hits features with small units harder.', 'Choosing λ on the test set.', 'Reading lasso’s zeroed features as "proven useless".'],
    shopsense: 'The demand model has dozens of calendar and promotion features; ridge keeps it stable, and the same idea (weight decay) returns in Phase 2 neural networks.',
    interview: [
      ['What is the difference between L1 and L2 regularisation?', 'L2 (ridge) penalises squared weights and shrinks them smoothly; L1 (lasso) penalises absolute weights and drives some exactly to zero, performing feature selection.'],
      ['Why must you scale features before regularisation?', 'The penalty depends on coefficient size, which depends on feature units; without scaling, features are penalised unequally.'],
      ['How do you choose the regularisation strength?', 'Cross-validate over a log-spaced range of values and pick the one with the best validation score.'],
    ],
  },
  quiz: [
    { q: 'Training error is near zero but validation error is high. What is happening?', opts: ['Underfitting', 'Overfitting', 'Perfect generalisation', 'Data leakage only'], a: 1, why: 'The model fits noise in the training data.' },
    { q: 'Which penalty can set coefficients exactly to zero?', opts: ['Ridge (L2)', 'Lasso (L1)', 'Both equally', 'Neither'], a: 1, why: 'The L1 penalty’s corner at zero produces exact zeros.' },
    { q: 'For y ≈ w x with Σxy = 31, Σx² = 14 and λ = 7, ridge gives w = …', opts: ['2.214', '1.476', '4.43', '0'], a: 1, why: '31 / (14 + 7).' },
    { q: 'What happens as λ becomes very large?', opts: ['Overfitting increases', 'Coefficients shrink towards zero and the model underfits', 'Nothing changes', 'Training error falls'], a: 1, why: 'The penalty dominates the loss.' },
    { q: 'Why scale features before ridge?', opts: ['It is faster', 'So the penalty treats features fairly regardless of units', 'Ridge requires integers', 'To remove outliers'], a: 1, why: 'Coefficient size depends on units.' },
  ],
  exercise: {
    task: ['Write <code>ridge_1d(xs, ys, lam)</code> using w = Σxy / (Σx² + λ). Then compute <code>ws</code>, the list of w for λ in [0, 1, 10, 100] on the data below, and check that it decreases.'],
    starter: `def ridge_1d(xs, ys, lam):
    pass


xs = [1, 2, 3, 4]
ys = [3, 5, 8, 9]
ws = None
print(ws)`,
    check: `assert abs(ridge_1d([1, 2, 3], [2, 4, 7], 7) - 31 / 21) < 1e-12
assert len(ws) == 4 and all(a > b for a, b in zip(ws, ws[1:])), "w must shrink as λ grows"
assert abs(ws[0] - 73 / 30) < 1e-12`,
    solution: `def ridge_1d(xs, ys, lam):
    return sum(x * y for x, y in zip(xs, ys)) / (sum(x * x for x in xs) + lam)


xs = [1, 2, 3, 4]
ys = [3, 5, 8, 9]
ws = [ridge_1d(xs, ys, lam) for lam in [0, 1, 10, 100]]
print(ws)`,
    hint: 'A list comprehension: <code>[ridge_1d(xs, ys, lam) for lam in [0, 1, 10, 100]]</code>.',
  },
};

// ===================================================================== P1.06
const sig = (z) => 1 / (1 + Math.exp(-z));
const l6 = {
  id: 'p1-06', title: 'Logistic regression', time: '40 minutes',
  sub: 'Predict a probability for a yes/no outcome, such as churn, by passing a linear score through the sigmoid, and learn it by minimising log loss.',
  learn: ['Turn a linear score into a probability with the sigmoid', 'Compute log loss and explain why it punishes confident mistakes', 'Choose a decision threshold from the business cost'],
  legend: [[DATA, 'customer'], [GOOD, 'probability curve'], [SIGNAL, 'threshold'], [BAD, 'churned']],
  steps: [
    {
      t: 'Churn is yes or no', b: ['Each dot is a customer, placed by days since their last order. Churned customers sit at the top (1), retained ones at the bottom (0).', 'A straight line would predict values below 0 and above 1, which are not probabilities.'],
      n: 'We want a smooth curve from 0 to 1.',
      s: { ...floor(10, 'days since last order →'), ...Object.fromEntries([[5, 0], [12, 0], [18, 0], [25, 0], [30, 1], [38, 0], [45, 1], [52, 1], [60, 0], [70, 1], [80, 1], [95, 1]].map(([d, y], i) => ['p' + i, dot(d / 10, y ? 2.4 : 0.15, { c: y ? 'coral' : 'blue' })])) },
    },
    {
      t: 'A score, then the sigmoid', b: ['First compute a linear score z = −3 + 0.08 × days. Then squash it with the sigmoid σ(z) = 1 / (1 + e^(−z)), which always lies between 0 and 1.', 'The result is the predicted probability of churn.'],
      n: 'The green S-curve is the model’s probability at each number of days.',
      s: Object.fromEntries(Array.from({ length: 21 }, (_, i) => { const d = i * 5; return [`c${i}`, { k: 'orb', x: 0, y: -d / 10, z: 0.15 + 2.25 * sig(-3 + 0.08 * d), r: 0.06, c: 'green', noshadow: 1 }]; })),
      l: Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`k${i}`, L('c' + i, 'c' + (i + 1), { c: 'green', na: 1, sw: 2.5 })])),
    },
    {
      t: 'Reading a prediction', b: ['50 days since last order: z = −3 + 4 = 1, so p = σ(1) ≈ <b>0.73</b>. 20 days: z = −1.4, p ≈ <b>0.20</b>.', 'Each extra day multiplies the odds of churn by e^0.08 ≈ 1.08: 8% higher odds per day.'],
      n: 'Coefficients act on the log-odds, not directly on the probability.',
      s: { q1: { k: 'orb', x: 0, y: -5.0, z: 0.15 + 2.25 * sig(1), r: 0.18, c: 'amber', hl: 1, sub: '50 days · 0.73' }, q2: { k: 'orb', x: 0, y: -2.0, z: 0.15 + 2.25 * sig(-1.4), r: 0.18, c: 'amber', hl: 1, sub: '20 days · 0.20' } },
    },
    {
      t: 'Log loss punishes confident mistakes', b: ['Training finds the coefficients that minimise log loss. For a churner, predicting 0.73 costs −ln 0.73 ≈ 0.31; predicting 0.05 costs −ln 0.05 ≈ 3.0.', 'Being confidently wrong is ten times worse than being moderately right.'],
      n: 'Log loss rewards honest probabilities, not just right answers.',
      clear: true,
      s: mg(bars('ll', [-Math.log(0.95), -Math.log(0.73), -Math.log(0.5), -Math.log(0.2), -Math.log(0.05)].map((v) => v * 0.8), { x: 0, y: 0, dx: 1.4, w: 0.9, d: 0.9, c: 'blue', labels: ['p=0.95', '0.73', '0.50', '0.20', '0.05'] }), { ll3: { c: 'coral' }, ll4: { c: 'coral' }, tl: T('log loss when the customer did churn', 2.8, -1.6, { z: 2.8, fs: 12.5, b: 1 }) }),
    },
    {
      t: 'From probability to action', b: ['To decide whom to send a coupon, choose a threshold. 0.5 is not special: with the coupon economics from P1.02, sending to everyone above about 0.33 maximises expected profit.', 'The model gives probabilities; the business picks the threshold.'],
      n: 'Moving the threshold trades missed churners against wasted coupons (next lesson).',
      clear: true,
      s: { tl0: S(5, 0, 10, 0.6, { c: 'slate', h: 0.05 }), th: B('', 3.3, 0, { c: 'amber', w: 0.1, d: 1.1, h: 1.0, noshadow: 1 }), thl: T('threshold 0.33', 3.3, -1.1, { z: 1.2, fs: 12, b: 1, c: 'amber' }), lo: T('no coupon', 1.4, 1.1, { fs: 11.5, c: 'muted' }), hi: T('send coupon', 6.8, 1.1, { fs: 11.5, c: 'green', b: 1 }), a0: T('0', 0, -0.9, { fs: 11, c: 'muted' }), a1: T('1', 10, -0.9, { fs: 11, c: 'muted' }) },
    },
  ],
  math: {
    blocks: [
      { h: 'Model', f: 'z = w₀ + w₁x₁ + … + wₖxₖ\np = σ(z) = 1 / (1 + e^(−z))', p: 'Equivalently log(p / (1 − p)) = z: the log-odds are linear in the features.' },
      { h: 'Log loss (binary cross-entropy)', f: 'L = −(1/n) Σ [ yᵢ ln pᵢ + (1 − yᵢ) ln(1 − pᵢ) ]' },
      { h: 'Gradient (used to train)', f: '∂L/∂w = (1/n) Xᵀ (p − y)', p: 'The same simple form as linear regression’s gradient, thanks to the sigmoid.' },
    ],
    example: {
      intro: 'Churn model z = −3 + 0.08 × days.',
      steps: ['50 days: z = −3 + 0.08 × 50 = <b>1</b>. p = 1 / (1 + e^(−1)) = 1 / 1.368 ≈ <b>0.731</b>.', '20 days: z = −3 + 1.6 = −1.4. p = 1 / (1 + e^1.4) = 1 / 5.055 ≈ <b>0.198</b>.', 'If the 50-day customer churned, their log loss is −ln 0.731 ≈ <b>0.313</b>. If they stayed, it is −ln 0.269 ≈ <b>1.313</b>.', 'Odds ratio per extra day = e^0.08 ≈ <b>1.083</b>: the odds of churn rise about 8% per day.'],
    },
  },
  code: {
    scratch: { why: 'Sigmoid, log loss and gradient descent for one feature, from scratch.', src: `from math import exp, log

days = [5, 12, 18, 25, 30, 38, 45, 52, 60, 70, 80, 95]
churn = [0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1]
x = [d / 100 for d in days]                       # scale for stable steps


def sigmoid(z):
    return 1 / (1 + exp(-z))


w0, w1, lr = 0.0, 0.0, 0.5
for step in range(3000):
    p = [sigmoid(w0 + w1 * xi) for xi in x]
    w0 -= lr * sum(pi - yi for pi, yi in zip(p, churn)) / len(x)
    w1 -= lr * sum((pi - yi) * xi for pi, yi, xi in zip(p, churn, x)) / len(x)

p = [sigmoid(w0 + w1 * xi) for xi in x]
loss = -sum(y * log(q) + (1 - y) * log(1 - q) for y, q in zip(churn, p)) / len(x)
print(f"z = {w0:.2f} + {w1 / 100:.4f} × days, log loss = {loss:.3f}")
print(f"p(churn | 50 days) = {sigmoid(w0 + w1 * 0.5):.2f}")` },
    library: { why: 'scikit-learn on two features, with probabilities and log loss on held-out customers.', src: `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import log_loss
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(0)
n = 3_000
days = rng.integers(0, 120, n)
orders = rng.poisson(3, n)
churn = (rng.random(n) < 1 / (1 + np.exp(-(-1.5 + 0.04 * days - 0.4 * orders)))).astype(int)
X = np.c_[days, orders]
X_tr, X_te, y_tr, y_te = train_test_split(X, churn, test_size=0.25, random_state=0, stratify=churn)

model = LogisticRegression().fit(X_tr, y_tr)
print("coefficients (days, orders):", np.round(model.coef_[0], 3), " intercept:", round(model.intercept_[0], 2))
print(f"odds multiplier per extra day: {np.exp(model.coef_[0][0]):.3f}")
print(f"held-out log loss: {log_loss(y_te, model.predict_proba(X_te)[:, 1]):.3f}")
print("P(churn) for 50 days, 1 order:", round(model.predict_proba([[50, 1]])[0, 1], 2))` },
    prod: { why: 'Choose the coupon threshold that maximises expected profit, not 0.5 by habit.', src: `import numpy as np


def best_threshold(p: np.ndarray, y: np.ndarray, cost: float, value: float, save_rate: float) -> tuple[float, float]:
    """Return (threshold, expected profit) over a grid of thresholds."""
    best = (0.5, -np.inf)
    for t in np.round(np.arange(0.05, 0.96, 0.01), 2):
        target = p >= t
        profit = save_rate * value * np.sum(target & (y == 1)) - cost * np.sum(target)
        if profit > best[1]:
            best = (float(t), float(profit))
    return best


rng = np.random.default_rng(1)
p = rng.beta(2, 5, 5_000)                       # model probabilities
y = (rng.random(5_000) < p).astype(int)         # outcomes consistent with p
t, profit = best_threshold(p, y, cost=100, value=1_500, save_rate=0.2)
print(f"best threshold {t:.2f}, expected profit ₹{profit:,.0f}")
print(f"profit at 0.50: ₹{0.2 * 1500 * np.sum((p >= 0.5) & (y == 1)) - 100 * np.sum(p >= 0.5):,.0f}")` },
  },
  industry: {
    when: ['Any yes/no prediction: churn, fraud, conversion, defects.', 'As the baseline classifier before trees or neural networks.', 'When you need well-calibrated probabilities and readable coefficients.'],
    baseline: 'Logistic regression on a handful of sensible features; tree models must beat it on held-out log loss or business profit.',
    tools: ['scikit-learn LogisticRegression', 'statsmodels Logit for coefficient inference', 'CalibratedClassifierCV for calibration checks'],
    tradeoffs: ['Readable and fast, but assumes the log-odds are linear in the features.', 'Regularisation (C in scikit-learn) controls overfitting; smaller C means stronger penalty.'],
    failures: ['Using 0.5 as the threshold by habit.', 'Reading coefficients without scaling features first.', 'Treating predicted scores as probabilities without checking calibration.'],
    shopsense: 'The first churn model in the Phase 1 project is a logistic regression with recency, frequency and spend features, thresholded by coupon economics.',
    interview: [
      ['Why is it called regression if it classifies?', 'It regresses the log-odds of the class on the features; a threshold on the resulting probability turns it into a classifier.'],
      ['How do you interpret a logistic-regression coefficient?', 'exp(coefficient) is the multiplicative change in the odds for a one-unit increase in the feature, holding others fixed.'],
      ['Why use log loss instead of accuracy for training?', 'Log loss is smooth and differentiable, and it rewards well-calibrated probabilities; accuracy is a step function and ignores confidence.'],
    ],
  },
  quiz: [
    { q: 'z = −3 + 0.08 × days. What is P(churn) at 50 days?', opts: ['0.50', '0.73', '0.88', '1.00'], a: 1, why: 'z = 1 and σ(1) ≈ 0.731.' },
    { q: 'What is the range of the sigmoid function?', opts: ['−1 to 1', '0 to 1 (exclusive)', '0 to ∞', 'Any real number'], a: 1, why: 'σ(z) = 1 / (1 + e^(−z)) stays between 0 and 1.' },
    { q: 'A churner gets p = 0.05. What is the log loss for this customer?', opts: ['0.05', '0.95', '≈ 3.0', '≈ 0.05'], a: 2, why: '−ln 0.05 ≈ 3.0: a confident mistake.' },
    { q: 'A coefficient of 0.08 on days means each extra day…', opts: ['Adds 0.08 to the probability', 'Multiplies the odds by about 1.08', 'Adds 8% to the probability', 'Has no effect'], a: 1, why: 'Coefficients act on log-odds; e^0.08 ≈ 1.083.' },
    { q: 'Who should choose the decision threshold?', opts: ['Always 0.5', 'The business, from the costs and benefits of each action', 'The library default', 'The test set'], a: 1, why: 'The best threshold depends on what errors cost.' },
  ],
  exercise: {
    task: ['Write <code>sigmoid(z)</code> and <code>log_loss(ys, ps)</code> (mean binary cross-entropy). Compute <code>loss</code> for the labels and probabilities below.'],
    starter: `from math import exp, log


def sigmoid(z):
    pass


def log_loss(ys, ps):
    pass


ys = [1, 0, 1, 0]
ps = [0.9, 0.2, 0.6, 0.4]
loss = log_loss(ys, ps)
print(loss)`,
    check: `assert abs(sigmoid(1) - 0.7310585786) < 1e-9 and sigmoid(0) == 0.5
expected = -(log(0.9) + log(0.8) + log(0.6) + log(0.6)) / 4
assert abs(loss - expected) < 1e-12, "for y = 0 use ln(1 − p)"`,
    solution: `from math import exp, log


def sigmoid(z):
    return 1 / (1 + exp(-z))


def log_loss(ys, ps):
    return -sum(y * log(p) + (1 - y) * log(1 - p) for y, p in zip(ys, ps)) / len(ys)


ys = [1, 0, 1, 0]
ps = [0.9, 0.2, 0.6, 0.4]
loss = log_loss(ys, ps)
print(round(loss, 4))`,
    hint: 'Each term is <code>y * log(p) + (1 - y) * log(1 - p)</code>; average and negate.',
  },
};

export default [l1, l2, l3, l4, l5, l6];
