import { B, Tl, O, T, Z, S, P, Cy, Bub, L, row, bars, off, mg } from '../kit.js';

const DATA = '#c4cdfb', GOOD = '#c1e4b1', BAD = '#ffc4b1', SIGNAL = '#fddf98', MODEL = '#d9cafb', SYS = '#b2e5da';

// ===================================================================== P1.18
const WEEKS = [52, 55, 58, 54, 60, 63, 66, 61, 68, 72, 75, 70, 78, 82, 96, 120];
const l18 = {
  id: 'p1-18', title: 'Forecasting basics', time: '40 minutes',
  sub: 'Forecast weekly demand: separate trend, seasonality and festival spikes, beat naive baselines, and backtest honestly.',
  learn: ['Describe a series as level, trend, seasonality and events', 'Build naive and seasonal-naive baselines and lag features', 'Backtest a forecast with rolling origins and report error by horizon'],
  legend: [[DATA, 'history'], [MODEL, 'forecast'], [SIGNAL, 'festival'], [GOOD, 'backtest']],
  steps: [
    {
      t: 'Sixteen weeks of saree orders', b: ['Weekly orders (hundreds) for Sarees. They rise steadily, wobble in a 4-week pattern, and jump in the two weeks before Diwali.'],
      n: 'Bars run left to right in time; the last two are festival weeks.',
      s: mg(bars('w', WEEKS.map((v) => v / 40), { x: 0, y: 0, dx: 0, dy: -0.6, w: 0.45, d: 0.45, c: 'blue' }), { w14: { c: 'amber' }, w15: { c: 'amber' }, fl: T('Diwali', 0.9, -8.7, { z: 3.4, fs: 11.5, b: 1, c: 'amber' }) }),
    },
    {
      t: 'Pull the series apart', b: ['A series is roughly <b>level + trend + seasonality + events + noise</b>. Here: a level near 55, a trend of about +1.5 a week, a 4-week cycle (month-end pay days), and the festival lift.', 'Naming the parts tells you which features a model needs.'],
      n: 'Festival dates move each year; encode them as "weeks until Diwali", not as a week number.',
      s: { tr: T('trend +1.5 / week · 4-week cycle · festival lift', 2.4, -2.4, { z: 0, fs: 12.5, b: 1, c: 'violet' }) },
    },
    {
      t: 'Always start with naive baselines', b: ['<b>Naive</b>: next week = this week. <b>Seasonal naive</b>: next week = the same week last cycle (or last year’s Diwali week). <b>Moving average</b> of recent weeks.', 'Many expensive models fail to beat seasonal naive. Measure it first.'],
      n: 'A forecast that cannot beat "same as last year" is not worth deploying.',
      s: { tr: { t: 'baselines: naive · seasonal naive · moving average' } },
    },
    {
      t: 'Turn the series into a table', b: ['A regression model needs rows of features: last week’s orders (lag 1), the same week last cycle (lag 4), a 4-week rolling mean, weeks until Diwali, discount planned.', 'Then any model from this phase, such as gradient boosting, can forecast.'],
      n: 'Lags may only use weeks before the one being forecast.',
      clear: true,
      s: mg(row('h', ['week', 'lag 1', 'lag 4', 'roll 4', 'to Diwali', 'target'], { x: 0, y: 0, dx: 1.7, c: 'slate', w: 1.55, d: 1.1, fs: 9.5, top: 1 }), row('r', ['wk 13', '70', '66', '71.3', '3', '78'], { x: 0, y: 1.4, dx: 1.7, c: 'blue', w: 1.55, d: 1.1, fs: 10, top: 1 }), { r5: { c: 'green' } }),
    },
    {
      t: 'Backtest from several origins', b: ['Pretend it is week 8, forecast weeks 9–12, compare; then week 10, forecast 11–14; and so on. Average the errors by horizon (1 week ahead, 2 weeks, …).', 'Report the error for festival weeks separately: that is where planners need help most.'],
      n: 'Rolling-origin backtests mirror how the forecast is really used.',
      clear: true,
      s: Object.fromEntries([0, 1, 2].flatMap((k) => [[`b${k}`, Tl('history', 1.2 + k * 0.9, k * 2.0, { top: 1, c: 'blue', w: 2.4 + k * 1.8, d: 0.9, fs: 9.5 })], [`f${k}`, Tl('forecast', 3.2 + k * 1.8, k * 2.0, { top: 1, c: 'violet', w: 1.8, d: 0.9, fs: 9 })]])),
    },
  ],
  math: {
    blocks: [
      { h: 'Baselines', f: 'naive:           ŷₜ₊₁ = yₜ\nseasonal naive:  ŷₜ₊₁ = yₜ₊₁₋ₛ   (s = season length)\nmoving average:  ŷₜ₊₁ = (yₜ + … + yₜ₋ₖ₊₁) / k' },
      { h: 'Lag features', f: 'lagₖ(t) = yₜ₋ₖ     rolling_mean_k(t) = (yₜ₋₁ + … + yₜ₋ₖ) / k', p: 'For a forecast made at time t for t + h, only values up to t may be used.' },
      { h: 'Scaled error', f: 'MASE = MAE(model) / MAE(seasonal naive on training data)', p: 'Below 1 means the model beats seasonal naive.' },
    ],
    example: {
      intro: 'Forecast week 13 from weeks 9–12 = 68, 72, 75, 70 (4-week cycle).',
      steps: ['Naive: ŷ₁₃ = y₁₂ = <b>70</b>.', 'Seasonal naive (s = 4): ŷ₁₃ = y₉ = <b>68</b>.', '4-week moving average: (68 + 72 + 75 + 70) / 4 = 285 / 4 = <b>71.25</b>.', 'Actual week 13 = 78. Errors: naive 8, seasonal 10, moving average 6.75. None captures the trend; a model with a trend and lag features can.'],
    },
  },
  code: {
    scratch: { why: 'Three baselines and their errors on the last four weeks.', src: `weeks = [52, 55, 58, 54, 60, 63, 66, 61, 68, 72, 75, 70, 78, 82, 96, 120]
s = 4

for name, f in [("naive", lambda t: weeks[t - 1]),
                ("seasonal naive", lambda t: weeks[t - s]),
                ("moving average 4", lambda t: sum(weeks[t - 4:t]) / 4)]:
    errors = [abs(weeks[t] - f(t)) for t in range(12, 16)]
    print(f"{name:17s} MAE on weeks 13–16 = {sum(errors) / 4:.2f}   per week {[round(e, 1) for e in errors]}")` },
    library: { why: 'Lag features plus gradient boosting, compared with seasonal naive in a rolling backtest.', src: `import numpy as np
import pandas as pd
from sklearn.ensemble import HistGradientBoostingRegressor

rng = np.random.default_rng(0)
t = np.arange(156)                                   # three years of weeks
diwali = np.isin(t % 52, [42, 43])
y = 55 + 0.4 * t + 6 * np.sin(2 * np.pi * t / 4) + 45 * diwali + rng.normal(0, 3, t.size)
df = pd.DataFrame({"y": y, "week_of_year": t % 52, "festival": diwali.astype(int)})
for k in (1, 2, 4, 52):
    df[f"lag{k}"] = df["y"].shift(k)
df["roll4"] = df["y"].shift(1).rolling(4).mean()
df = df.dropna()

errors = {"seasonal naive (lag 52)": [], "boosting": []}
for origin in range(100, df.index.max() - 3, 4):           # rolling origins
    train, test = df.loc[:origin], df.loc[origin + 1: origin + 4]
    X_cols = [c for c in df.columns if c != "y"]
    model = HistGradientBoostingRegressor(max_iter=200, learning_rate=0.05, random_state=0).fit(train[X_cols], train["y"])
    errors["boosting"] += list(abs(test["y"] - model.predict(test[X_cols])))
    errors["seasonal naive (lag 52)"] += list(abs(test["y"] - test["lag52"]))
for name, e in errors.items():
    print(f"{name:24s} backtest MAE {np.mean(e):.2f} over {len(e)} weeks")` },
    prod: { why: 'A backtest helper that reports error by horizon, the way planners read it.', src: `import numpy as np


def backtest_by_horizon(y: np.ndarray, forecast_fn, start: int, horizon: int = 4) -> dict[int, float]:
    """forecast_fn(history) -> array of length horizon. Returns MAE for each step ahead."""
    errs = {h: [] for h in range(1, horizon + 1)}
    for origin in range(start, len(y) - horizon):
        f = forecast_fn(y[: origin + 1])
        if len(f) != horizon:
            raise ValueError("forecast_fn must return one value per step of the horizon")
        for h in range(1, horizon + 1):
            errs[h].append(abs(y[origin + h] - f[h - 1]))
    return {h: round(float(np.mean(e)), 2) for h, e in errs.items()}


rng = np.random.default_rng(1)
series = 55 + 0.4 * np.arange(120) + rng.normal(0, 3, 120)
drift = lambda h: h[-1] + (h[-1] - h[-9]) / 8 * np.arange(1, 5)       # naive with trend
print("MAE by horizon:", backtest_by_horizon(series, drift, start=60))` },
  },
  industry: {
    when: ['Inventory, staffing, cash-flow and capacity planning.', 'Any decision that depends on next week or next month.'],
    baseline: 'Seasonal naive (same week last year, aligned for festivals) and a moving average. Report a scaled error such as MASE against them.',
    tools: ['pandas shift and rolling', 'scikit-learn or LightGBM on lag features', 'statsmodels (ETS, SARIMA), Prophet, StatsForecast'],
    tradeoffs: ['Global models across many products share patterns but need careful features; per-product models are simple but noisy for small items.', 'Longer horizons are less accurate; plan with intervals, not single numbers.'],
    failures: ['Random train/test splits that leak the future.', 'Ignoring moving festival dates.', 'New products with no history forecast as zero (use similar products).', 'Promotions planned after the forecast is made.'],
    shopsense: 'The Phase 1 project forecasts 4 weeks of demand per category, with Diwali effects and a cold-start rule for new categories.',
    interview: [
      ['What baseline would you use for weekly retail demand?', 'Seasonal naive, aligned for moving festivals, plus a moving average; any model must beat them in a rolling backtest.'],
      ['How do you validate a forecasting model?', 'Rolling-origin backtesting: repeatedly train on data up to a point, forecast the next horizon, and average errors by horizon.'],
      ['How do you forecast a product with no history?', 'Borrow from similar products or the category, use hierarchical models, or start with a rule and update quickly as sales arrive.'],
    ],
  },
  quiz: [
    { q: 'Weeks 9–12: 68, 72, 75, 70. Seasonal-naive (s = 4) forecast for week 13?', opts: ['70', '68', '71.25', '78'], a: 1, why: 'Same position in the previous cycle: week 9.' },
    { q: 'Same data. 4-week moving-average forecast?', opts: ['70', '71.25', '72', '68'], a: 1, why: '285 / 4.' },
    { q: 'How should you split data for a forecasting model?', opts: ['Randomly', 'By time, with rolling origins', 'By product only', 'No split'], a: 1, why: 'Never let the future inform the past.' },
    { q: 'Diwali falls on a different week each year. How to encode it?', opts: ['Week number', '"Weeks until Diwali" feature', 'Ignore it', 'Random noise'], a: 1, why: 'It aligns festival effects across years.' },
    { q: 'MASE = 1.3 means…', opts: ['The model beats seasonal naive', 'The model is worse than seasonal naive', 'Perfect forecasts', 'Nothing'], a: 1, why: 'Above 1, the baseline wins.' },
  ],
  exercise: {
    task: ['Write <code>seasonal_naive(series, s, t)</code> returning the forecast for index <code>t</code>, and compute <code>mae</code>: the mean absolute error of seasonal naive (s = 4) on indices 12–15 of <code>weeks</code>.'],
    starter: `def seasonal_naive(series, s, t):
    pass


weeks = [52, 55, 58, 54, 60, 63, 66, 61, 68, 72, 75, 70, 78, 82, 96, 120]
mae = None
print(mae)`,
    check: `assert seasonal_naive(weeks, 4, 12) == 68
assert abs(mae - (10 + 10 + 21 + 50) / 4) < 1e-12`,
    solution: `def seasonal_naive(series, s, t):
    return series[t - s]


weeks = [52, 55, 58, 54, 60, 63, 66, 61, 68, 72, 75, 70, 78, 82, 96, 120]
mae = sum(abs(weeks[t] - seasonal_naive(weeks, 4, t)) for t in range(12, 16)) / 4
print(mae)`,
    hint: 'Forecast for t is <code>series[t - s]</code>. Average the absolute errors for t = 12, 13, 14, 15.',
  },
};

// ===================================================================== P1.19
const PTS = [[1, 1], [1.4, 1.8], [2, 1.2], [5, 1.2], [5.6, 1.8], [6, 1], [3.2, 4.6], [3.8, 5.2], [3, 5.4]];
const l19 = {
  id: 'p1-19', title: 'Clustering', time: '35 minutes',
  sub: 'Find natural groups of customers without labels, using k-means, and turn the groups into segments the business can act on.',
  learn: ['Run k-means step by step: assign, update, repeat', 'Choose k with the elbow and silhouette, and scale features first', 'Describe clusters as actionable customer segments'],
  legend: [[DATA, 'customer'], [SIGNAL, 'centroid'], [GOOD, 'segment']],
  steps: [
    {
      t: 'Customers without labels', b: ['Each dot is a customer placed by order frequency (across) and average order value (into the picture). Nobody has told us which groups exist.'],
      n: 'Unsupervised learning: find structure, no answers given.',
      s: Object.fromEntries(PTS.map(([x, y], i) => ['p' + i, O(x, y, { r: 0.2, c: 'slate' })])),
    },
    {
      t: 'Place k starting centroids', b: ['Choose k = 3 and place three centroids, for example at three random customers.'],
      n: 'Different starts can give different results; libraries try several starts and keep the best.',
      s: { c0: B('', 1.4, 1.8, { c: 'amber', w: 0.35, d: 0.35, h: 0.8, hl: 1 }), c1: B('', 5.6, 1.8, { c: 'violet', w: 0.35, d: 0.35, h: 0.8, hl: 1 }), c2: B('', 3.8, 5.2, { c: 'green', w: 0.35, d: 0.35, h: 0.8, hl: 1 }) },
    },
    {
      t: 'Assign each customer to the nearest', b: ['Every customer joins the cluster of its nearest centroid.'],
      n: 'Colour now shows cluster membership.',
      s: Object.fromEntries(PTS.map((_, i) => ['p' + i, { c: i < 3 ? 'amber' : i < 6 ? 'violet' : 'green' }])),
    },
    {
      t: 'Move centroids to the middle, repeat', b: ['Each centroid moves to the average position of its members. Then assign again, and repeat until nothing changes.', 'Each round lowers the total squared distance from customers to their centroids.'],
      n: 'k-means always converges, though possibly to a local best.',
      s: { c0: { x: 1.47, y: 1.33 }, c1: { x: 5.53, y: 1.33 }, c2: { x: 3.33, y: 5.07 } },
    },
    {
      t: 'Name the segments', b: ['Describe each cluster in business terms: <b>frequent low spenders</b> (amber), <b>occasional big spenders</b> (violet), <b>festival-only shoppers</b> (green). Each gets a different offer.', 'A cluster nobody can describe or act on is not useful, however good its score.'],
      n: 'Clustering is judged by the decisions it enables.',
      s: { l0: T('frequent, low spend', 1.5, 0.0, { z: 1.2, fs: 11.5, b: 1, c: 'amber' }), l1: T('occasional, high spend', 5.6, 0.0, { z: 1.2, fs: 11.5, b: 1, c: 'violet' }), l2: T('festival-only', 3.4, 6.4, { z: 1.0, fs: 11.5, b: 1, c: 'green' }) },
    },
  ],
  math: {
    blocks: [
      { h: 'k-means objective', f: 'minimise  Σᵢ ‖xᵢ − μ_{c(i)}‖²', p: 'μ are the centroids and c(i) is the cluster of point i. This is the within-cluster sum of squares (inertia).' },
      { h: 'The two steps', f: 'assign: c(i) = argmin_k ‖xᵢ − μₖ‖\nupdate: μₖ = mean of points with c(i) = k' },
      { h: 'Silhouette of a point', f: 's = (b − a) / max(a, b)', p: 'a = mean distance to its own cluster, b = mean distance to the nearest other cluster. Near 1: well placed; near 0: on a border.' },
    ],
    example: {
      intro: 'Update the amber centroid after assignment.',
      steps: ['Amber members: (1, 1), (1.4, 1.8), (2, 1.2).', 'Mean x = (1 + 1.4 + 2) / 3 = 4.4 / 3 ≈ <b>1.47</b>. Mean y = (1 + 1.8 + 1.2) / 3 = <b>1.33</b>.', 'The centroid moves from (1.4, 1.8) to (1.47, 1.33).', 'Repeat assign and update; when no customer changes cluster, stop.'],
    },
  },
  code: {
    scratch: { why: 'k-means from scratch: assign, update, repeat.', src: `from math import dist

points = [(1, 1), (1.4, 1.8), (2, 1.2), (5, 1.2), (5.6, 1.8), (6, 1), (3.2, 4.6), (3.8, 5.2), (3, 5.4)]
centroids = [(1.4, 1.8), (5.6, 1.8), (3.8, 5.2)]

for step in range(10):
    groups = [[] for _ in centroids]
    for p in points:
        groups[min(range(len(centroids)), key=lambda k: dist(p, centroids[k]))].append(p)
    new = [tuple(round(sum(c) / len(g), 3) for c in zip(*g)) for g in groups]
    if new == centroids:
        print(f"converged after {step} updates")
        break
    centroids = new
print("centroids:", centroids)
print("inertia:", round(sum(min(dist(p, c) ** 2 for c in centroids) for p in points), 3))` },
    library: { why: 'scikit-learn KMeans with scaling, comparing k by inertia and silhouette.', src: `import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(0)
segments = [(8, 600, 120), (2, 4500, 80), (3, 2000, 100)]      # orders/month, avg order ₹, count
X = np.vstack([np.c_[rng.normal(f, 0.6, n), rng.normal(v, v * 0.12, n)] for f, v, n in segments])
Xs = StandardScaler().fit_transform(X)

for k in range(2, 6):
    km = KMeans(n_clusters=k, n_init=10, random_state=0).fit(Xs)
    print(f"k={k}: inertia {km.inertia_:7.1f}  silhouette {silhouette_score(Xs, km.labels_):.3f}")` },
    prod: { why: 'Segment profiles in business terms, ready for the marketing team.', src: `import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(0)
segments = [(8, 600, 120), (2, 4500, 80), (3, 2000, 100)]
df = pd.DataFrame(np.vstack([np.c_[rng.normal(f, 0.6, n), rng.normal(v, v * 0.12, n)] for f, v, n in segments]),
                  columns=["orders_per_month", "avg_order_value"])

model = make_pipeline(StandardScaler(), KMeans(n_clusters=3, n_init=10, random_state=0)).fit(df)
df["segment"] = model.predict(df)
profile = df.groupby("segment").agg(customers=("orders_per_month", "size"),
                                    orders_per_month=("orders_per_month", "mean"),
                                    avg_order_value=("avg_order_value", "mean")).round(1)
print(profile.sort_values("avg_order_value"))` },
  },
  industry: {
    when: ['Customer segmentation for marketing and pricing.', 'Grouping products, stores or support tickets.', 'Exploring data before supervised modelling.'],
    baseline: 'Simple rule-based segments (for example RFM tiers). Clusters must give more useful, stable groups than the rules.',
    tools: ['scikit-learn KMeans, MiniBatchKMeans, DBSCAN, AgglomerativeClustering, GaussianMixture', 'silhouette_score'],
    tradeoffs: ['k-means is fast and simple but assumes round, similar-sized clusters.', 'DBSCAN finds odd shapes and outliers but needs density settings.'],
    failures: ['Unscaled features, so rupees dominate counts.', 'Choosing k by score alone without asking whether segments are actionable.', 'Segments that change completely every month (unstable).'],
    shopsense: 'Segments feed the Phase 1 retention playbook: festival-only shoppers get a pre-Diwali reminder rather than a discount.',
    interview: [
      ['How does k-means work?', 'Initialise k centroids, assign each point to its nearest centroid, move each centroid to the mean of its points, and repeat until assignments stop changing.'],
      ['How do you choose k?', 'Use the elbow in inertia and the silhouette score, then check that clusters are interpretable, stable and useful for the decision.'],
      ['When would you not use k-means?', 'For non-spherical clusters, very different cluster sizes or densities, or many outliers; consider DBSCAN, Gaussian mixtures or hierarchical clustering.'],
    ],
  },
  quiz: [
    { q: 'Cluster members (1, 1), (1.4, 1.8), (2, 1.2). New centroid?', opts: ['(1.4, 1.8)', '(1.47, 1.33)', '(2, 2)', '(1, 1)'], a: 1, why: 'The mean of the members.' },
    { q: 'What does k-means minimise?', opts: ['Number of clusters', 'Within-cluster sum of squared distances', 'Silhouette', 'Accuracy'], a: 1, why: 'Inertia.' },
    { q: 'Why scale features before k-means?', opts: ['Faster', 'So one large-unit feature does not dominate distances', 'k-means needs integers', 'To add labels'], a: 1, why: 'Distances mix features.' },
    { q: 'A silhouette near 0 means a point…', opts: ['Is perfectly placed', 'Lies near a border between clusters', 'Is an error', 'Has no neighbours'], a: 1, why: 'a and b are similar.' },
    { q: 'What makes a segmentation useful?', opts: ['The highest silhouette', 'Groups the business can describe and act on, that stay stable', 'Exactly 5 clusters', 'Using all features'], a: 1, why: 'Clustering is judged by decisions it enables.' },
  ],
  exercise: {
    task: ['Write <code>kmeans_step(points, centroids)</code> doing one assign-and-update round and returning the new centroids (as tuples). Run it once on the data below and store the result in <code>new</code>.'],
    starter: `from math import dist


def kmeans_step(points, centroids):
    pass


points = [(0, 0), (0, 2), (10, 10), (10, 12)]
new = kmeans_step(points, [(1, 1), (9, 9)])
print(new)`,
    check: `assert [tuple(round(v, 6) for v in c) for c in new] == [(0.0, 1.0), (10.0, 11.0)]`,
    solution: `from math import dist


def kmeans_step(points, centroids):
    groups = [[] for _ in centroids]
    for p in points:
        k = min(range(len(centroids)), key=lambda j: dist(p, centroids[j]))
        groups[k].append(p)
    return [tuple(sum(c) / len(g) for c in zip(*g)) if g else centroids[i] for i, g in enumerate(groups)]


points = [(0, 0), (0, 2), (10, 10), (10, 12)]
new = kmeans_step(points, [(1, 1), (9, 9)])
print(new)`,
    hint: 'Group points by their nearest centroid, then average each group’s coordinates with <code>zip(*group)</code>.',
  },
};

// ===================================================================== P1.20
const l20 = {
  id: 'p1-20', title: 'Dimensionality reduction', time: '35 minutes',
  sub: 'Compress many correlated features into a few that keep most of the information, for speed, visualisation and less noise.',
  learn: ['Apply PCA and read the explained-variance ratio', 'Choose how many components to keep', 'Know when to use PCA, and when t-SNE or UMAP are for pictures only'],
  legend: [[DATA, 'original features'], [GOOD, 'principal component'], [BAD, 'discarded noise']],
  steps: [
    {
      t: 'Forty features, much repetition', b: ['The churn table has 40 behaviour features: orders in 30, 60, 90 days; spend in 30, 60, 90 days; and so on. Many move together, so they repeat the same information.'],
      n: 'Correlated features waste model capacity and make coefficients unstable.',
      s: Object.fromEntries(Array.from({ length: 12 }, (_, i) => [`f${i}`, Tl('', (i % 6) * 0.9, Math.floor(i / 6) * 0.9, { c: 'blue', w: 0.75, d: 0.75 })])),
    },
    {
      t: 'Find the main directions', b: ['PCA (from P0.13) finds new axes, the principal components, ordered by how much of the data’s spread each captures. The first follows the strongest pattern, such as "overall activity".'],
      n: 'Each component is a weighted mix of the original features.',
      s: { pc1: B('PC1\noverall activity', 6.4, -2.8, { c: 'green', w: 2.0, d: 1.0, h: 1.4, fs: 9.5 }), pc2: B('PC2\nspend vs frequency', 8.6, -1.2, { c: 'green', w: 2.0, d: 1.0, h: 0.8, fs: 9 }) },
      l: { a: L('f5', 'pc1', { c: 'muted', na: 1 }), b: L('f11', 'pc2', { c: 'muted', na: 1 }) },
    },
    {
      t: 'Keep enough variance', b: ['The explained-variance ratio says what share of the total spread each component holds. Here 8 components keep 90% of the variance of all 40 features.', 'Keep enough components to reach a target (often 90–95%), or tune the number by validation score.'],
      n: 'Bars: share of variance per component, falling quickly.',
      clear: true,
      s: mg(bars('v', [2.4, 1.3, 0.8, 0.55, 0.4, 0.3, 0.22, 0.18, 0.1, 0.08], { x: 0, y: 0, dx: 0.7, w: 0.5, d: 0.5, c: 'green' }), { v8: { c: 'coral' }, v9: { c: 'coral' }, vl: T('8 components keep 90%', -0.8, -1.8, { z: 2.9, fs: 12.5, b: 1, c: 'green' }) }),
    },
    {
      t: 'Pictures with t-SNE and UMAP', b: ['To look at high-dimensional data in 2-D, t-SNE and UMAP place similar points near each other. They are excellent for exploration.', 'But distances and cluster sizes in those pictures are not reliable, so do not feed their output to models or read too much into gaps.'],
      n: 'PCA for features; t-SNE and UMAP for pictures.',
      warn: true,
      clear: true,
      s: Object.fromEntries([...Array.from({ length: 6 }, (_, i) => [`a${i}`, O(1 + Math.cos(i) * 0.7, 1 + Math.sin(i) * 0.7, { r: 0.16, c: 'amber' })]), ...Array.from({ length: 6 }, (_, i) => [`b${i}`, O(4.5 + Math.cos(i) * 0.7, 1.5 + Math.sin(i) * 0.7, { r: 0.16, c: 'violet' })]), ...Array.from({ length: 6 }, (_, i) => [`c${i}`, O(2.8 + Math.cos(i) * 0.7, 4.2 + Math.sin(i) * 0.7, { r: 0.16, c: 'green' })])]),
    },
  ],
  math: {
    blocks: [
      { h: 'Explained-variance ratio', f: 'ratioⱼ = λⱼ / Σₖ λₖ', p: 'λⱼ are eigenvalues of the covariance matrix of the standardised features (P0.13).' },
      { h: 'Projection', f: 'Z = X_std · W_k', p: 'W_k holds the first k eigenvectors as columns; Z has k columns instead of the original d.' },
    ],
    example: {
      intro: 'Eigenvalues of a 5-feature covariance matrix: 4.0, 0.5, 0.3, 0.15, 0.05.',
      steps: ['Total variance = 4.0 + 0.5 + 0.3 + 0.15 + 0.05 = <b>5.0</b> (the number of standardised features).', 'Ratios: 0.80, 0.10, 0.06, 0.03, 0.01.', 'Cumulative: 0.80, 0.90, 0.96, 0.99, 1.00.', 'To keep 90%, keep <b>2 components</b>; for 95%, keep 3.'],
    },
  },
  code: {
    scratch: { why: 'Explained-variance ratios and the components needed for a target.', src: `eigenvalues = [4.0, 0.5, 0.3, 0.15, 0.05]
total = sum(eigenvalues)
cumulative = 0
for j, lam in enumerate(eigenvalues, start=1):
    cumulative += lam / total
    print(f"PC{j}: ratio {lam / total:.2f}, cumulative {cumulative:.2f}")

target = 0.9
running, needed = 0, 0
for lam in eigenvalues:
    running += lam / total
    needed += 1
    if running >= target - 1e-12:
        break
print(f"components for {target:.0%}: {needed}")` },
    library: { why: 'PCA on 40 correlated features: how many components keep 90%?', src: `import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(0)
n = 1_000
latent = rng.normal(size=(n, 5))                          # 5 real behaviours
X = latent @ rng.normal(size=(5, 40)) + rng.normal(0, 0.5, size=(n, 40))
Xs = StandardScaler().fit_transform(X)

pca = PCA().fit(Xs)
cum = np.cumsum(pca.explained_variance_ratio_)
print("first 6 ratios:", np.round(pca.explained_variance_ratio_[:6], 3))
print("components for 90%:", int(np.searchsorted(cum, 0.90) + 1))
print("shape after PCA(0.90):", PCA(n_components=0.90).fit_transform(Xs).shape)` },
    prod: { why: 'PCA inside a pipeline, with the number of components chosen by validation score.', src: `import numpy as np
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GridSearchCV
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(1)
n = 2_000
latent = rng.normal(size=(n, 5))
X = latent @ rng.normal(size=(5, 40)) + rng.normal(0, 0.5, size=(n, 40))
y = (rng.random(n) < 1 / (1 + np.exp(-(latent[:, 0] - 0.5 * latent[:, 1])))).astype(int)

search = GridSearchCV(make_pipeline(StandardScaler(), PCA(), LogisticRegression()),
                      {"pca__n_components": [2, 5, 10, 20, 40]}, cv=5, scoring="roc_auc").fit(X, y)
for k, s in zip(search.cv_results_["param_pca__n_components"], search.cv_results_["mean_test_score"]):
    print(f"{k:2d} components: CV ROC-AUC {s:.3f}")` },
  },
  industry: {
    when: ['Many correlated numeric features.', 'Speeding up models or reducing memory.', 'Visualising high-dimensional data (with t-SNE/UMAP for pictures).'],
    baseline: 'Train without reduction first. Add PCA only if it helps validation scores, speed or stability.',
    tools: ['scikit-learn PCA, TruncatedSVD (sparse data)', 'umap-learn, scikit-learn TSNE for visualisation'],
    tradeoffs: ['Fewer features and less noise, but components are harder to explain to the business.', 'PCA captures only linear structure.'],
    failures: ['Not standardising first.', 'Fitting PCA on all data before splitting (leakage).', 'Reading t-SNE cluster sizes or distances as meaningful.'],
    shopsense: 'PCA compresses 40 behaviour features before clustering customers into segments in the Phase 1 project.',
    interview: [
      ['What does the explained-variance ratio tell you?', 'The share of the total variance captured by each principal component; cumulative sums show how many components keep a target share.'],
      ['Should you scale before PCA?', 'Yes, unless features share units and scale; otherwise the largest-unit feature dominates.'],
      ['Can you use t-SNE output as model features?', 'Generally no: it is non-parametric, unstable between runs and does not preserve global distances; it is for visualisation.'],
    ],
  },
  quiz: [
    { q: 'Eigenvalues 4, 0.5, 0.3, 0.15, 0.05. Share of PC1?', opts: ['40%', '80%', '90%', '4%'], a: 1, why: '4 / 5.' },
    { q: 'Same eigenvalues. Components for 90%?', opts: ['1', '2', '3', '5'], a: 1, why: 'Cumulative 0.80, 0.90.' },
    { q: 'Why standardise before PCA?', opts: ['Required by maths', 'So large-unit features do not dominate the variance', 'To add labels', 'To remove outliers'], a: 1, why: 'Variance depends on units.' },
    { q: 'What are t-SNE and UMAP best for?', opts: ['Model features', '2-D pictures for exploration', 'Forecasting', 'Labelling data'], a: 1, why: 'Their layouts are for looking, not modelling.' },
    { q: 'Where should PCA be fitted?', opts: ['On all data', 'Inside the pipeline, on training folds only', 'On the test set', 'Anywhere'], a: 1, why: 'Avoid leakage.' },
  ],
  exercise: {
    task: ['Write <code>components_needed(eigenvalues, target)</code> returning the smallest number of leading components whose cumulative explained-variance ratio reaches the target.'],
    starter: `def components_needed(eigenvalues, target):
    pass


print(components_needed([4.0, 0.5, 0.3, 0.15, 0.05], 0.95))`,
    check: `assert components_needed([4.0, 0.5, 0.3, 0.15, 0.05], 0.90) == 2
assert components_needed([4.0, 0.5, 0.3, 0.15, 0.05], 0.95) == 3
assert components_needed([1, 1, 1, 1], 0.5) == 2`,
    solution: `def components_needed(eigenvalues, target):
    total = sum(eigenvalues)
    running = 0.0
    for k, lam in enumerate(sorted(eigenvalues, reverse=True), start=1):
        running += lam / total
        if running >= target - 1e-12:
            return k
    return len(eigenvalues)


print(components_needed([4.0, 0.5, 0.3, 0.15, 0.05], 0.95))`,
    hint: 'Sort eigenvalues from largest, add their shares, and stop when the running total reaches the target (allow a tiny tolerance).',
  },
};

// ===================================================================== P1.21
const l21 = {
  id: 'p1-21', title: 'Hyperparameter tuning', time: '35 minutes',
  sub: 'Choose model settings such as depth, learning rate and regularisation systematically, within a budget, without fooling yourself.',
  learn: ['Separate parameters (learned) from hyperparameters (chosen)', 'Use grid, random and Bayesian search and count their cost', 'Report a tuned model’s score honestly with a held-out test or nested CV'],
  legend: [[DATA, 'trial'], [GOOD, 'best'], [BAD, 'wasted trial'], [SIGNAL, 'budget']],
  steps: [
    {
      t: 'Settings the model cannot learn', b: ['Coefficients are learned from data. Tree depth, learning rate, number of trees and C are chosen before training: hyperparameters.', 'Defaults are a starting point, not an answer.'],
      n: 'Parameters: learned. Hyperparameters: chosen by you, using validation data.',
      s: { p: Tl('parameters\nlearned by fit()', 0, 0, { top: 1, c: 'blue', w: 2.4, d: 1.2, fs: 9.5 }), h: Tl('hyperparameters\nchosen before fit()', 3.6, 0, { top: 1, c: 'amber', w: 2.6, d: 1.2, fs: 9.5 }) },
    },
    {
      t: 'Grid search', b: ['Try every combination: 4 depths × 3 learning rates × 5 tree counts = 60 settings. With 5-fold cross-validation that is <b>300 training runs</b>.', 'Grids are thorough but explode with more hyperparameters.'],
      n: 'Each dot is one setting on a 2-D slice of the grid.',
      clear: true,
      s: (() => { const o = {}; for (let i = 0; i < 4; i++) for (let j = 0; j < 5; j++) o[`g${i}${j}`] = O(j * 1.0, i * 1.0, { r: 0.14, c: i === 2 && j === 3 ? 'green' : 'blue', hl: i === 2 && j === 3 ? 1 : 0 }); o.gl = T('grid: every combination', 2.0, -2.0, { z: 0.4, fs: 12, b: 1 }); return o; })(),
    },
    {
      t: 'Random search', b: ['Sample settings at random from sensible ranges. With the same budget it tries many more distinct values of the hyperparameters that matter, so it usually finds good settings faster than a grid.'],
      n: 'Usually only a few hyperparameters really matter; random search explores those better.',
      clear: true,
      s: (() => { const o = {}; const pts = [[0.3, 2.6], [1.7, 0.4], [2.6, 1.9], [3.9, 3.1], [0.8, 1.2], [3.2, 0.7], [1.2, 3.4], [4.4, 1.5], [2.1, 2.8], [3.6, 2.3]]; pts.forEach(([x, y], i) => { o['r' + i] = O(x, y, { r: 0.14, c: i === 2 ? 'green' : 'blue', hl: i === 2 ? 1 : 0 }); }); o.gl = T('random: same budget, more distinct values', 2.0, -2.0, { z: 0.4, fs: 12, b: 1 }); return o; })(),
    },
    {
      t: 'Bayesian search learns as it goes', b: ['Tools such as Optuna use earlier trials to pick promising next settings, and stop bad trials early. Good for expensive models.', 'Whatever the method, set a budget in trials or hours before starting.'],
      n: 'Later trials cluster around the best region.',
      s: Object.fromEntries([[2.4, 2.0], [2.7, 1.8], [2.5, 1.7], [2.8, 2.1]].map(([x, y], i) => [`b${i}`, O(x, y, { r: 0.12, c: 'amber' })])),
    },
    {
      t: 'Do not grade the tuning on its own data', b: ['The best cross-validation score after trying 300 settings is optimistic: some setting won partly by luck. Report the final score on an untouched test set, or use nested cross-validation.'],
      n: 'Tuning is a form of training. It needs its own held-out check.',
      warn: true,
      clear: true,
      s: mg(bars('s', [2.2, 1.95], { x: 0, y: 0, dx: 2.6, w: 1.2, d: 1.2, c: 'amber', labels: ['best CV 0.842', 'test 0.828'] }), { s1: { c: 'green' } }),
    },
  ],
  math: {
    blocks: [
      { h: 'Cost of grid search', f: 'fits = (Πⱼ number of values for hyperparameter j) × k folds' },
      { h: 'Why random search covers important axes better', f: 'n random trials → n distinct values on every axis\ngrid of n trials over d axes → n^(1/d) values per axis' },
    ],
    example: {
      intro: 'Budget for a boosting model.',
      steps: ['Grid: max_depth ∈ {3, 4, 6, 8}, learning_rate ∈ {0.03, 0.1, 0.3}, n_estimators ∈ {100, 200, 400, 800, 1600}.', 'Combinations: 4 × 3 × 5 = <b>60</b>. With 5-fold CV: 60 × 5 = <b>300 fits</b>.', 'If one fit takes 20 seconds, that is 6,000 s ≈ <b>1 hour 40 minutes</b>.', 'Random search with 30 trials × 5 folds = 150 fits ≈ 50 minutes, and 30 distinct values of each hyperparameter instead of 3–5.'],
    },
  },
  code: {
    scratch: { why: 'Counting the cost of a search before running it.', src: `from math import prod

grid = {"max_depth": [3, 4, 6, 8], "learning_rate": [0.03, 0.1, 0.3], "n_estimators": [100, 200, 400, 800, 1600]}
folds, seconds_per_fit = 5, 20

combos = prod(len(v) for v in grid.values())
fits = combos * folds
print(f"grid: {combos} settings x {folds} folds = {fits} fits ≈ {fits * seconds_per_fit / 60:.0f} minutes")
trials = 30
print(f"random: {trials} trials x {folds} folds = {trials * folds} fits ≈ {trials * folds * seconds_per_fit / 60:.0f} minutes")` },
    library: { why: 'Grid versus random search on the same model and budget.', src: `import numpy as np
from scipy.stats import loguniform, randint
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV

rng = np.random.default_rng(0)
n = 3_000
X = np.c_[rng.integers(0, 120, n), rng.poisson(3, n), rng.normal(1500, 500, n)]
y = (rng.random(n) < 1 / (1 + np.exp(-(-1.5 + 0.04 * X[:, 0] - 0.4 * X[:, 1])))).astype(int)
model = HistGradientBoostingClassifier(random_state=0)

grid = GridSearchCV(model, {"max_depth": [2, 4], "learning_rate": [0.05, 0.2], "max_iter": [100, 300]},
                    cv=3, scoring="roc_auc").fit(X, y)
rand = RandomizedSearchCV(model, {"max_depth": randint(2, 8), "learning_rate": loguniform(0.01, 0.3), "max_iter": randint(50, 400)},
                          n_iter=8, cv=3, scoring="roc_auc", random_state=0).fit(X, y)
print(f"grid   (8 settings): best CV ROC-AUC {grid.best_score_:.3f} {grid.best_params_}")
print(f"random (8 settings): best CV ROC-AUC {rand.best_score_:.3f}")` },
    prod: { why: 'Nested cross-validation: an honest score for the whole tuning procedure.', src: `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GridSearchCV, KFold, cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(1)
n = 1_500
X = rng.normal(size=(n, 10))
y = (rng.random(n) < 1 / (1 + np.exp(-(X[:, 0] - 0.7 * X[:, 1] + 0.3 * X[:, 2])))).astype(int)

inner = GridSearchCV(make_pipeline(StandardScaler(), LogisticRegression()),
                     {"logisticregression__C": [0.01, 0.1, 1, 10]}, cv=KFold(5, shuffle=True, random_state=0), scoring="roc_auc")
inner.fit(X, y)
outer = cross_val_score(inner, X, y, cv=KFold(5, shuffle=True, random_state=1), scoring="roc_auc")
print(f"best inner CV score (optimistic): {inner.best_score_:.3f}")
print(f"nested CV score (honest):         {outer.mean():.3f} ± {outer.std(ddof=1):.3f}")` },
  },
  industry: {
    when: ['After features and baseline are in place; tuning cannot fix bad features.', 'Before a final comparison between model families.', 'When moving to a new data volume (good settings change).'],
    baseline: 'Library defaults with early stopping. Tune only if validation shows clear room to improve.',
    tools: ['scikit-learn GridSearchCV, RandomizedSearchCV, HalvingGridSearchCV', 'Optuna for Bayesian search and pruning', 'Experiment tracking (Phase 6)'],
    tradeoffs: ['More trials find slightly better settings but cost compute and risk overfitting the validation folds.', 'Wide search spaces need more trials; narrow ones may miss the best region.'],
    failures: ['Tuning on the test set.', 'Huge grids that run for days for a 0.002 gain.', 'Tuning without fixing random seeds, so results cannot be reproduced.'],
    shopsense: 'The Phase 1 churn model is tuned with 40 Optuna-style random trials on time-based folds; the final number is reported on the most recent untouched month.',
    interview: [
      ['What is the difference between a parameter and a hyperparameter?', 'Parameters are learned from data during training (coefficients, splits); hyperparameters are set before training (depth, learning rate, regularisation).'],
      ['Why does random search often beat grid search?', 'With the same budget it explores more distinct values of each hyperparameter, and usually only a few matter.'],
      ['What is nested cross-validation?', 'An outer loop estimates performance while an inner loop does the tuning, so the reported score includes the selection step and is not optimistic.'],
    ],
  },
  quiz: [
    { q: '4 × 3 × 5 grid with 5-fold CV. How many fits?', opts: ['12', '60', '300', '1,500'], a: 2, why: '60 settings × 5 folds.' },
    { q: 'Which is a hyperparameter?', opts: ['A logistic-regression coefficient', 'Tree max_depth', 'A split threshold learned by a tree', 'A centroid position'], a: 1, why: 'It is chosen before training.' },
    { q: 'Why is the best CV score after many trials optimistic?', opts: ['It is computed wrongly', 'Some settings win partly by luck on those folds', 'CV is always biased low', 'It is not'], a: 1, why: 'Selection on noisy scores favours lucky winners.' },
    { q: 'With the same budget, random search usually…', opts: ['Explores more distinct values of each hyperparameter', 'Tries fewer values', 'Is slower', 'Needs no validation'], a: 0, why: 'Every trial uses a new value on every axis.' },
    { q: 'How do you report a tuned model’s performance honestly?', opts: ['Best CV score', 'Untouched test set or nested CV', 'Training score', 'Average of all trials'], a: 1, why: 'The selection step must be evaluated too.' },
  ],
  exercise: {
    task: ['Write <code>search_cost(grid, folds, seconds_per_fit)</code> returning <code>(fits, hours)</code> for a grid given as a dict of value lists. Compute it for the grid below with 5 folds and 12 seconds per fit.'],
    starter: `def search_cost(grid, folds, seconds_per_fit):
    pass


grid = {"max_depth": [3, 5, 7], "learning_rate": [0.01, 0.05, 0.1, 0.3], "min_samples_leaf": [10, 50]}
print(search_cost(grid, 5, 12))`,
    check: `fits, hours = search_cost(grid, 5, 12)
assert fits == 3 * 4 * 2 * 5
assert abs(hours - fits * 12 / 3600) < 1e-12`,
    solution: `from math import prod


def search_cost(grid, folds, seconds_per_fit):
    fits = prod(len(v) for v in grid.values()) * folds
    return fits, fits * seconds_per_fit / 3600


grid = {"max_depth": [3, 5, 7], "learning_rate": [0.01, 0.05, 0.1, 0.3], "min_samples_leaf": [10, 50]}
print(search_cost(grid, 5, 12))`,
    hint: 'Multiply the number of values for each hyperparameter, then by the folds.',
  },
};

// ===================================================================== P1.22
const l22 = {
  id: 'p1-22', title: 'Pipelines and explainability', time: '45 minutes',
  sub: 'Lock preprocessing and model into one object that trains, saves and serves identically, then explain each prediction in one sentence.',
  learn: ['Build a scikit-learn Pipeline with a ColumnTransformer and save it', 'Explain global behaviour with permutation importance and partial dependence', 'Explain one prediction with feature contributions (the idea behind SHAP)'],
  legend: [[SYS, 'preprocessing'], [MODEL, 'model'], [BAD, 'pushes risk up'], [GOOD, 'pushes risk down']],
  steps: [
    {
      t: 'Two codebases drift apart', b: ['Data scientists scale and encode features in a notebook; engineers rewrite the same steps for the nightly job. One rounds differently, or forgets an encoding, and predictions go quietly wrong.', 'This is train/serve skew.'],
      n: 'The fix is one object that does everything, used in both places.',
      warn: true,
      s: { nb: Tl('notebook\nscale · encode · model', 0, 0, { top: 1, c: 'blue', w: 2.6, d: 1.3, fs: 9.5 }), job: Tl('nightly job\nrewritten by hand', 0, 3.0, { top: 1, c: 'coral', w: 2.6, d: 1.3, fs: 9.5 }) },
    },
    {
      t: 'One pipeline object', b: ['A Pipeline chains steps: impute missing values, scale numbers, one-hot encode cities, then the model. fit() learns every step from training data only; predict() applies every step the same way.', 'Save it once (joblib) and load the same file in the nightly job.'],
      n: 'Pipelines also make cross-validation leakage-proof (P1.16).',
      clear: true,
      s: { i: B('impute', 0, 0, { c: 'teal', w: 1.3, d: 1.1, h: 0.6, fs: 10 }), sc: B('scale +\none-hot', 2.4, 0, { c: 'teal', w: 1.4, d: 1.1, h: 0.6, fs: 9.5 }), m: B('model', 4.8, 0, { c: 'brand', w: 1.3, d: 1.1, h: 0.9, fs: 11 }), f: Tl('churn_model.joblib', 7.6, 0, { top: 1, c: 'green', w: 2.6, d: 1.0, fs: 9.5 }), z: Z('Pipeline', 2.4, 0, 6.6, 2.2, { c: 'violet' }) },
      l: { a: L('i', 'sc', { flow: 1 }), b: L('sc', 'm', { flow: 1 }), c: L('m', 'f', { flow: 1, c: 'green', t: 'save' }) },
    },
    {
      t: 'Global view: what the model uses', b: ['Permutation importance: shuffle one feature on test data and see how much the score drops. Partial dependence: how predicted risk changes as one feature changes, averaging over the others.', 'Here, risk rises steeply after 45 days without an order.'],
      n: 'These describe the model, not the causes of churn.',
      clear: true,
      s: mg(bars('pd', [0.4, 0.5, 0.6, 0.8, 1.4, 2.0, 2.3, 2.4], { x: 0, y: 0, dx: 0, dy: -0.8, w: 0.55, d: 0.55, c: 'violet', labels: ['0 d', '', '30', '', '60', '', '90', ''] }), { pl: T('partial dependence on days since last order', 1.4, -3.0, { z: 3.4, fs: 12, b: 1 }) }),
    },
    {
      t: 'Local view: why this customer?', b: ['For Priya, start from the average customer’s risk (8%) and add each feature’s contribution: two late deliveries push it up most, then 52 days without an order and an open support ticket; three years as a customer pulls it down a little. Total ≈ 52% (the code tab computes it).', 'This is the idea behind SHAP values: contributions that add up to the prediction.'],
      n: 'Read from the bottom up. Coral bars push risk up; green pull it down.',
      clear: true,
      s: { base: Tl('average customer: 8%', 1.3, 4.0, { top: 1, c: 'slate', w: 2.6, d: 1.0, fs: 10 }), c1: Tl('late deliveries ↑↑', 2.1, 2.3, { top: 1, c: 'coral', w: 4.2, d: 1.0, fs: 10 }), c2: Tl('52 days, no order ↑', 1.5, 0.6, { top: 1, c: 'coral', w: 3.0, d: 1.0, fs: 10 }), c3: Tl('open ticket ↑', 1.0, -1.1, { top: 1, c: 'coral', w: 2.0, d: 1.0, fs: 10 }), c4: Tl('3 years ↓', 0.75, -2.8, { top: 1, c: 'green', w: 1.5, d: 1.0, fs: 10 }), tot: Tl('Priya: 52%', 1.6, -4.5, { top: 1, c: 'amber', w: 3.2, d: 1.0, fs: 11 }) },
    },
    {
      t: 'One sentence for the agent', b: ['The retention agent does not need charts. Turn the top contributions into a sentence: "High risk mainly because of two late deliveries and no order for 52 days."', 'An explanation the agent can act on (apologise, guarantee delivery) is the real deliverable.'],
      n: 'NFR from the project brief: every score explainable in one sentence.',
      s: { msg: Bub('High risk: two late deliveries\nand no order for 52 days.', 5.6, -5.4, { z: 1.0, c: 'violet' }) },
    },
  ],
  math: {
    blocks: [
      { h: 'Additive explanation', f: 'prediction = base value + Σⱼ φⱼ', p: 'φⱼ is feature j’s contribution for this one prediction. SHAP chooses φ fairly using game theory (Shapley values).' },
      { h: 'Linear model contributions', f: 'φⱼ = wⱼ · (xⱼ − mean(xⱼ))', p: 'For a linear model (on the log-odds scale) this is exact. Tree SHAP computes the same kind of numbers for tree models.' },
      { h: 'Permutation importance', f: 'importanceⱼ = score(test) − score(test with column j shuffled)' },
    ],
    example: {
      intro: 'Using just two features of a linear churn score (log-odds): weights late deliveries 0.9, days since order 0.03. Average customer: 0.3 late deliveries, 25 days.',
      steps: ['Priya: 2 late deliveries, 52 days.', 'Contribution of late deliveries: 0.9 × (2 − 0.3) = <b>+1.53</b> log-odds.', 'Contribution of recency: 0.03 × (52 − 25) = <b>+0.81</b>.', 'Base log-odds −2.44 (8% risk) + 1.53 + 0.81 = −0.10, so risk = σ(−0.10) ≈ <b>48%</b>. Late deliveries are the main reason.'],
    },
  },
  code: {
    scratch: { why: 'Contributions for a linear churn score, turned into a sentence.', src: `from math import exp

weights = {"late_deliveries": 0.9, "days_since_order": 0.03, "open_tickets": 0.6, "years_customer": -0.25}
means = {"late_deliveries": 0.3, "days_since_order": 25, "open_tickets": 0.1, "years_customer": 1.5}
base = -2.44                                          # log-odds of an average customer (≈ 8%)
priya = {"late_deliveries": 2, "days_since_order": 52, "open_tickets": 1, "years_customer": 3}

phi = {k: weights[k] * (priya[k] - means[k]) for k in weights}
z = base + sum(phi.values())
risk = 1 / (1 + exp(-z))
print({k: round(v, 2) for k, v in phi.items()})
print(f"risk {risk:.0%} (average {1 / (1 + exp(-base)):.0%})")
top = sorted(phi, key=phi.get, reverse=True)[:2]
print("Agent note: high risk mainly because of", " and ".join(t.replace("_", " ") for t in top))` },
    library: { why: 'A full Pipeline with a ColumnTransformer, saved and reloaded, plus permutation importance.', src: `import io

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.impute import SimpleImputer
from sklearn.inspection import permutation_importance
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline, make_pipeline
from sklearn.preprocessing import OneHotEncoder

rng = np.random.default_rng(0)
n = 3_000
X = pd.DataFrame({"days_since_order": rng.integers(0, 120, n).astype(float), "late_deliveries": rng.poisson(0.4, n),
                  "open_tickets": rng.poisson(0.2, n), "city": rng.choice(["Coimbatore", "Chennai", "Madurai"], n)})
X.loc[rng.random(n) < 0.05, "days_since_order"] = np.nan
logit = -3 + 0.03 * X["days_since_order"].fillna(30) + 0.9 * X["late_deliveries"] + 0.6 * X["open_tickets"]
y = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=0)

prep = ColumnTransformer([("num", SimpleImputer(strategy="median"), ["days_since_order", "late_deliveries", "open_tickets"]),
                          ("cat", OneHotEncoder(handle_unknown="ignore"), ["city"])], sparse_threshold=0)
pipe = Pipeline([("prep", prep), ("model", HistGradientBoostingClassifier(random_state=0))]).fit(X_tr, y_tr)

buf = io.BytesIO(); joblib.dump(pipe, buf); buf.seek(0)
served = joblib.load(buf)                                  # the nightly job loads the same object
assert np.allclose(served.predict_proba(X_te), pipe.predict_proba(X_te))

imp = permutation_importance(served, X_te, y_te, scoring="roc_auc", n_repeats=5, random_state=0)
for name, v in sorted(zip(X.columns, imp.importances_mean), key=lambda t: -t[1]):
    print(f"{name:17s} {v:.3f}")` },
    prod: { why: 'Reason codes for every scored customer, from contributions of a logistic model.', src: `import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(1)
n = 4_000
cols = ["days_since_order", "late_deliveries", "open_tickets", "years_customer"]
X = pd.DataFrame(np.c_[rng.integers(0, 120, n), rng.poisson(0.4, n), rng.poisson(0.2, n), rng.integers(0, 6, n)], columns=cols)
y = (rng.random(n) < 1 / (1 + np.exp(-(-3 + 0.03 * X.days_since_order + 0.9 * X.late_deliveries + 0.6 * X.open_tickets - 0.25 * X.years_customer)))).astype(int)
pipe = make_pipeline(StandardScaler(), LogisticRegression()).fit(X, y)
scaler, model = pipe[0], pipe[-1]
REASON = {"days_since_order": "no recent order", "late_deliveries": "late deliveries",
          "open_tickets": "an open support ticket", "years_customer": "a new customer"}


def reason_codes(row: pd.DataFrame, top: int = 2) -> str:
    z = scaler.transform(row)[0]
    phi = model.coef_[0] * z                               # contributions on the standardised scale
    order = [cols[i] for i in np.argsort(-phi) if phi[i] > 0][:top]
    risk = pipe.predict_proba(row)[0, 1]
    return f"risk {risk:.0%}: mainly " + " and ".join(REASON[c] for c in order) if order else f"risk {risk:.0%}: no strong risk factors"


priya = pd.DataFrame([[52, 2, 1, 3]], columns=cols)
print(reason_codes(priya))` },
  },
  industry: {
    when: ['Every model that leaves a notebook.', 'Any decision affecting customers, where people must understand and trust the score.', 'Regulated domains (credit, insurance, health), where explanations are required.'],
    baseline: 'Pipeline + saved artifact + permutation importance + one reason sentence per prediction, before any fancier explanation tool.',
    tools: ['scikit-learn Pipeline, ColumnTransformer, permutation_importance, PartialDependenceDisplay', 'joblib or skops for saving', 'SHAP library for per-prediction attributions'],
    tradeoffs: ['Explanations add compute and engineering time; skipping them costs trust and adoption.', 'Simple models are easier to explain; complex models need attribution tools that approximate.'],
    failures: ['Train/serve skew from rewritten preprocessing.', 'Treating explanations as causes ("fixing" a feature changes nothing if it is only correlated).', 'Loading a model with a different library version than it was saved with.'],
    shopsense: 'The Phase 1 churn pipeline is one saved object; the nightly job attaches a one-sentence reason to each of the 5,000 customers on the call list.',
    interview: [
      ['Why use scikit-learn Pipelines?', 'They bundle preprocessing and model so the same fitted steps are applied in training, cross-validation and serving, preventing leakage and train/serve skew.'],
      ['What are SHAP values?', 'Per-prediction feature contributions based on Shapley values that add up from a base value to the model’s output.'],
      ['What is the difference between global and local explanations?', 'Global explanations describe the model’s overall behaviour (importance, partial dependence); local ones explain a single prediction.'],
    ],
  },
  quiz: [
    { q: 'What problem does a single saved Pipeline prevent?', opts: ['Overfitting', 'Train/serve skew from different preprocessing', 'Imbalance', 'Slow GPUs'], a: 1, why: 'The same fitted steps run everywhere.' },
    { q: 'Weight 0.9, Priya has 2 late deliveries, average is 0.3. Contribution?', opts: ['1.8', '+1.53', '0.27', '2.0'], a: 1, why: '0.9 × (2 − 0.3).' },
    { q: 'Permutation importance measures…', opts: ['Feature correlation with the label', 'The score drop when a feature is shuffled on test data', 'The number of splits', 'Causality'], a: 1, why: 'It measures how much the model relies on the feature.' },
    { q: 'SHAP contributions for one prediction…', opts: ['Are always positive', 'Add up from a base value to the prediction', 'Are causes', 'Ignore the base value'], a: 1, why: 'They are additive attributions.' },
    { q: 'What explanation does a retention agent need?', opts: ['A SHAP beeswarm plot', 'One sentence naming the main reasons', 'The model’s weights', 'No explanation'], a: 1, why: 'Actionable and readable.' },
  ],
  exercise: {
    task: ['Write <code>contributions(weights, means, x)</code> returning a dict of wⱼ × (xⱼ − meanⱼ), and <code>top_reason(contribs)</code> returning the feature with the largest positive contribution. Apply them to Priya below.'],
    starter: `def contributions(weights, means, x):
    pass


def top_reason(contribs):
    pass


weights = {"late_deliveries": 0.9, "days_since_order": 0.03, "open_tickets": 0.6}
means = {"late_deliveries": 0.3, "days_since_order": 25, "open_tickets": 0.1}
priya = {"late_deliveries": 2, "days_since_order": 52, "open_tickets": 1}
phi = contributions(weights, means, priya)
print(phi, top_reason(phi) if phi else None)`,
    check: `assert abs(phi["late_deliveries"] - 1.53) < 1e-9 and abs(phi["days_since_order"] - 0.81) < 1e-9
assert abs(phi["open_tickets"] - 0.54) < 1e-9
assert top_reason(phi) == "late_deliveries"`,
    solution: `def contributions(weights, means, x):
    return {k: weights[k] * (x[k] - means[k]) for k in weights}


def top_reason(contribs):
    return max(contribs, key=contribs.get)


weights = {"late_deliveries": 0.9, "days_since_order": 0.03, "open_tickets": 0.6}
means = {"late_deliveries": 0.3, "days_since_order": 25, "open_tickets": 0.1}
priya = {"late_deliveries": 2, "days_since_order": 52, "open_tickets": 1}
phi = contributions(weights, means, priya)
print(phi, top_reason(phi))`,
    hint: 'A dict comprehension over the weights; <code>max(contribs, key=contribs.get)</code> picks the largest.',
  },
};

export default [l18, l19, l20, l21, l22];
