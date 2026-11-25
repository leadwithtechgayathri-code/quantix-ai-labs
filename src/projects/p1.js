// Phase 1 project: Churn and Demand Forecasting
import { B, Tl, O, T, Z, Cy, L } from '../kit.js';

const L1 = `import numpy as np
import pandas as pd
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler


def make_customers(n=20_000, as_of_month=12, seed=0):
    """One row per customer, features as of the start of a month, label = no order in the next 90 days."""
    rng = np.random.default_rng(seed + as_of_month)
    tenure = rng.integers(1, 48, n)
    new = rng.random(n) < 0.15
    tenure[new] = 0
    days_since = np.where(new, rng.integers(0, 30, n), rng.gamma(2.0, 14, n).astype(int))
    orders_90 = np.where(new, 1, rng.poisson(2.5, n))
    late = rng.poisson(0.35, n)
    tickets = rng.poisson(0.15 + 0.2 * late, n)
    festival_only = rng.random(n) < 0.12
    spend_90 = np.round(orders_90 * rng.gamma(3, 450, n), 0)
    logit = (-2.85 + 0.025 * days_since - 0.35 * orders_90 + 0.75 * late + 0.5 * tickets
             + 1.1 * new - 0.03 * tenure + 0.9 * festival_only * (as_of_month in (11, 12)))
    churn = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)
    return pd.DataFrame({"customer_id": np.arange(n), "as_of_month": as_of_month, "tenure_months": tenure,
                         "days_since_order": days_since, "orders_90d": orders_90, "spend_90d": spend_90,
                         "late_deliveries_90d": late, "tickets_90d": tickets, "festival_only": festival_only.astype(int),
                         "churned_90d": churn})

df = make_customers()
FEATURES = ["tenure_months", "days_since_order", "orders_90d", "spend_90d", "late_deliveries_90d", "tickets_90d", "festival_only"]
X, y = df[FEATURES], df["churned_90d"]
print(f"customers {len(df):,}, churn rate {y.mean():.1%}")
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, stratify=y, random_state=0)

print(f"{'model':22s} ROC-AUC  PR-AUC")
print(f"{'always no churn':22s}  0.500   {y_te.mean():.3f}   (accuracy {1 - y_te.mean():.1%}!)")
print(f"{'rule: days since order':22s}  {roc_auc_score(y_te, X_te.days_since_order):.3f}   {average_precision_score(y_te, X_te.days_since_order):.3f}")
for name, m in [("logistic regression", make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))),
                ("gradient boosting", HistGradientBoostingClassifier(max_depth=3, learning_rate=0.05, max_iter=300, random_state=0))]:
    p = m.fit(X_tr, y_tr).predict_proba(X_te)[:, 1]
    print(f"{name:22s}  {roc_auc_score(y_te, p):.3f}   {average_precision_score(y_te, p):.3f}")

# Demand: 4-week forecast for one category vs seasonal naive (same weeks last year)
rng = np.random.default_rng(1)
t = np.arange(156)
diwali = np.isin(t % 52, [42, 43])
sales = 400 + 1.2 * t + 40 * np.sin(2 * np.pi * t / 52) + 350 * diwali + rng.normal(0, 20, t.size)
hist, future = sales[:144], sales[144:148]
naive = sales[144 - 52:148 - 52]
trend = (hist[-52:].mean() - hist[-104:-52].mean())
naive_trend = naive + trend
mape = lambda f: np.mean(np.abs(future - f) / future)
print(f"\\ndemand, weeks 145–148: seasonal naive MAPE {mape(naive):.1%}, seasonal naive + trend MAPE {mape(naive_trend):.1%}")
`;

const L2 = `import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, roc_auc_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

def make_customers(n=20_000, as_of_month=12, seed=0):
    """One row per customer, features as of the start of a month, label = no order in the next 90 days."""
    rng = np.random.default_rng(seed + as_of_month)
    tenure = rng.integers(1, 48, n)
    new = rng.random(n) < 0.15
    tenure[new] = 0
    days_since = np.where(new, rng.integers(0, 30, n), rng.gamma(2.0, 14, n).astype(int))
    orders_90 = np.where(new, 1, rng.poisson(2.5, n))
    late = rng.poisson(0.35, n)
    tickets = rng.poisson(0.15 + 0.2 * late, n)
    festival_only = rng.random(n) < 0.12
    spend_90 = np.round(orders_90 * rng.gamma(3, 450, n), 0)
    logit = (-2.85 + 0.025 * days_since - 0.35 * orders_90 + 0.75 * late + 0.5 * tickets
             + 1.1 * new - 0.03 * tenure + 0.9 * festival_only * (as_of_month in (11, 12)))
    churn = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)
    return pd.DataFrame({"customer_id": np.arange(n), "as_of_month": as_of_month, "tenure_months": tenure,
                         "days_since_order": days_since, "orders_90d": orders_90, "spend_90d": spend_90,
                         "late_deliveries_90d": late, "tickets_90d": tickets, "festival_only": festival_only.astype(int),
                         "churned_90d": churn})


FEATURES = ["tenure_months", "days_since_order", "orders_90d", "spend_90d", "late_deliveries_90d", "tickets_90d", "festival_only"]

# 1. Time-based split: train on monthly snapshots Jun–Oct, test on December (festival season).
train = pd.concat([make_customers(as_of_month=m) for m in range(6, 11)], ignore_index=True)
test = make_customers(as_of_month=12)

# 2. Leakage audit: a feature recorded after the outcome. Screen every feature on its own.
train["retention_offer_sent"] = (train.churned_90d & (np.random.default_rng(0).random(len(train)) < 0.85)).astype(int)
print("single-feature ROC-AUC (train):")
for c in FEATURES + ["retention_offer_sent"]:
    auc = roc_auc_score(train.churned_90d, train[c])
    auc = max(auc, 1 - auc)
    print(f"  {c:22s} {auc:.3f}{'   <- leak: drop it' if auc > 0.9 else ''}")

# 3. Imbalance: class weights; judge by PR-AUC and precision in the call budget, not accuracy.
model = make_pipeline(StandardScaler(), LogisticRegression(class_weight="balanced", max_iter=1000))
model.fit(train[FEATURES], train.churned_90d)
p = model.predict_proba(test[FEATURES])[:, 1]
y = test.churned_90d.to_numpy()
print(f"\\nDecember test: churn rate {y.mean():.1%}, ROC-AUC {roc_auc_score(y, p):.3f}, PR-AUC {average_precision_score(y, p):.3f}")

# Balanced weights inflate the probabilities: use them to rank, or recalibrate before reading them as risk.
# 4. Budget threshold: 5,000 calls per 1M customers -> top 0.5% here.
k = int(len(test) * 0.005)
top = np.argsort(-p)[:k]
print(f"call budget {k} of {len(test):,}: churners reached {y[top].sum()} (precision {y[top].mean():.0%}) vs {y.mean() * k:.0f} if called at random")

# 5. One-sentence reason for each customer on the list.
scaler, lr = model[0], model[-1]
REASON = {"days_since_order": "no recent order", "late_deliveries_90d": "late deliveries", "tickets_90d": "support tickets",
          "festival_only": "festival-only shopper", "tenure_months": "a new customer", "orders_90d": "few orders", "spend_90d": "low spend"}
contrib = lr.coef_[0] * scaler.transform(test[FEATURES].iloc[top])
for row, c in list(zip(top, contrib))[:3]:
    names = [FEATURES[j] for j in np.argsort(-c)[:2] if c[j] > 0]
    print(f"  customer {test.customer_id[row]:5d}: risk {p[row]:.0%}, mainly " + " and ".join(REASON[n] for n in names))
`;

const L3 = `import hashlib
import json
import os
import tempfile
import time

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import HistGradientBoostingClassifier

def make_customers(n=20_000, as_of_month=12, seed=0):
    """One row per customer, features as of the start of a month, label = no order in the next 90 days."""
    rng = np.random.default_rng(seed + as_of_month)
    tenure = rng.integers(1, 48, n)
    new = rng.random(n) < 0.15
    tenure[new] = 0
    days_since = np.where(new, rng.integers(0, 30, n), rng.gamma(2.0, 14, n).astype(int))
    orders_90 = np.where(new, 1, rng.poisson(2.5, n))
    late = rng.poisson(0.35, n)
    tickets = rng.poisson(0.15 + 0.2 * late, n)
    festival_only = rng.random(n) < 0.12
    spend_90 = np.round(orders_90 * rng.gamma(3, 450, n), 0)
    logit = (-2.85 + 0.025 * days_since - 0.35 * orders_90 + 0.75 * late + 0.5 * tickets
             + 1.1 * new - 0.03 * tenure + 0.9 * festival_only * (as_of_month in (11, 12)))
    churn = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)
    return pd.DataFrame({"customer_id": np.arange(n), "as_of_month": as_of_month, "tenure_months": tenure,
                         "days_since_order": days_since, "orders_90d": orders_90, "spend_90d": spend_90,
                         "late_deliveries_90d": late, "tickets_90d": tickets, "festival_only": festival_only.astype(int),
                         "churned_90d": churn})


FEATURES = ["tenure_months", "days_since_order", "orders_90d", "spend_90d", "late_deliveries_90d", "tickets_90d", "festival_only"]
store = tempfile.mkdtemp()

# 1. One-command training writes a versioned model with a small model card.
def train_and_register(months=range(6, 11)) -> str:
    df = pd.concat([make_customers(as_of_month=m) for m in months], ignore_index=True)
    model = HistGradientBoostingClassifier(max_depth=3, learning_rate=0.05, max_iter=200, random_state=0)
    model.fit(df[FEATURES], df.churned_90d)
    version = hashlib.sha1(json.dumps({"months": list(months), "features": FEATURES}).encode()).hexdigest()[:8]
    joblib.dump(model, os.path.join(store, f"churn-{version}.joblib"))
    card = {"version": version, "trained_on_months": list(months), "rows": len(df), "features": FEATURES, "churn_rate": round(df.churned_90d.mean(), 4)}
    json.dump(card, open(os.path.join(store, f"churn-{version}.json"), "w"))
    return version

version = train_and_register()
print("registered model", version)

# 2. Nightly batch scoring in chunks: bounded memory, measurable throughput.
def score_nightly(version: str, customers: pd.DataFrame, chunk: int = 100_000, budget: int = 5_000) -> pd.DataFrame:
    model = joblib.load(os.path.join(store, f"churn-{version}.joblib"))
    parts = []
    for start in range(0, len(customers), chunk):
        part = customers.iloc[start:start + chunk]
        parts.append(pd.DataFrame({"customer_id": part.customer_id, "risk": model.predict_proba(part[FEATURES])[:, 1]}))
    scored = pd.concat(parts, ignore_index=True)
    scored["model_version"] = version
    return scored.nlargest(budget, "risk")

tonight = make_customers(n=200_000, as_of_month=12)
t0 = time.perf_counter()
call_list = score_nightly(version, tonight, budget=1_000)
secs = time.perf_counter() - t0
print(f"scored {len(tonight):,} customers in {secs:.1f} s -> about {secs * 5:.0f} s for 1M on this machine")
print("scoring is cheap; computing features from raw history is what threatens the 15-minute target")
print(f"call list: {len(call_list):,} rows, model {call_list.model_version.iloc[0]}, top risk {call_list.risk.iloc[0]:.0%}")

# 3. Track accuracy once outcomes arrive (here we already know December's labels).
reached = tonight.set_index("customer_id").loc[call_list.customer_id, "churned_90d"].mean()
print(f"precision of the call list once outcomes are known: {reached:.0%} (base rate {tonight.churned_90d.mean():.1%})")
`;


// ---------- stress-lab model (illustrative figures, 1M customers, 8% churn) ----------
const pct = (x) => `${Math.round(x * 100)}%`;
function outcome(on, guarded) {
  const calls = on.budget ? 5000 : 20000;
  let prec;
  if (!guarded) {
    prec = 0.22;                                   // threshold 0.5 list, called in arbitrary order
    if (on.newcust) prec -= 0.05;                  // new customers scored as "active" (missing history filled with 0)
    if (on.festival) prec -= 0.06;                 // festival-only shoppers flagged after Diwali
  } else {
    prec = on.budget ? 0.52 : 0.38;                // ranked top-K: the top of the list is purer
    if (on.newcust) prec -= 0.03;                  // cold-start rule covers new customers
    if (on.festival) prec -= 0.02;                 // festival features
  }
  const listSize = guarded ? calls : 31000;
  const reached = Math.round(calls * prec);
  const saved = Math.round(reached * 0.25);
  let fc, fcBad = false;
  if (on.newcat) fc = guarded ? 'new category: borrowed from similar categories, ≈ 22% error' : 'new category: no history, forecast = 0 units';
  else fc = guarded ? (on.festival ? '≈ 14% error (Diwali weeks aligned)' : '≈ 9% error') : (on.festival ? '≈ 41% error: misses the Diwali spike' : '≈ 18% error');
  if (!guarded && (on.newcat || on.festival)) fcBad = true;
  const notes = [];
  if (!guarded) {
    if (on.budget || listSize > calls) notes.push(`list of ${listSize.toLocaleString('en-IN')} names for ${calls.toLocaleString('en-IN')} calls; agents pick at random`);
    if (on.newcust) notes.push('40% new customers look "active" because missing history became 0');
    if (on.festival) notes.push('calls wasted on festival-only shoppers');
    if (on.newcat) notes.push('warehouse sees zero demand for the new category');
  } else {
    notes.push(`exactly the top ${calls.toLocaleString('en-IN')} by risk, each with a reason`);
    if (on.newcust) notes.push('new customers scored by a cold-start rule');
    if (on.festival) notes.push('festival features and aligned backtests');
    if (on.newcat) notes.push('category prior until 4 weeks of sales arrive');
  }
  return { calls, prec, reached, saved, fc, fcBad, status: notes.join('; ') + '.', bad: !guarded };
}

function stressScene(on, guarded) {
  const r = outcome(on, guarded);
  const badFeat = !guarded && (on.newcust || on.festival);
  const s = {
    zone: Z(guarded ? 'scoring with L2/L3 guards' : 'naive scoring', 5.6, 2.0, 15.4, 10.4, { c: guarded ? 'teal' : 'slate' }),
    src: Cy('history', 0, 0, { c: 'blue', r: 0.6, h: 0.9, fs: 10 }),
    nc: on.newcust ? Tl('40% new', 1.8, -2.6, { top: 1, c: 'coral', w: 1.7, d: 1.0, fs: 10 }) : null,
    fest: on.festival ? Tl('Diwali spike', 4.4, -2.6, { top: 1, c: 'coral', w: 2.0, d: 1.0, fs: 10 }) : null,
    feat: B(guarded ? 'features\n+ cold start' : 'features\nnulls → 0', 3.2, 0, { c: badFeat ? 'coral' : 'teal', w: 1.7, d: 1.3, h: 0.8, fs: 10 }),
    mdl: B('model', 6.2, 0, { c: 'brand', w: 1.3, d: 1.3, h: 1.0, fs: 10.5 }),
    thr: B(guarded ? (on.budget ? 'top 5,000' : 'top 20,000') : 'p > 0.5', 9.0, 0, { c: guarded ? 'teal' : 'coral', w: 1.6, d: 1.3, h: 0.6, fs: 10, hl: on.budget ? 1 : 0 }),
    list: Tl(`${r.calls.toLocaleString('en-IN')} calls\n${r.reached.toLocaleString('en-IN')} reached`, 12.0, 0, { top: 1, c: r.bad ? 'coral' : 'green', w: 2.2, d: 1.4, fs: 10 }),
    ws: Cy('sales', 0, 5.0, { c: 'blue', r: 0.6, h: 0.9, fs: 10 }),
    newc: on.newcat ? Tl('new category', 2.6, 7.6, { top: 1, c: 'coral', w: 2.2, d: 1.0, fs: 10 }) : null,
    fcm: B(guarded ? 'forecast\n+ festival' : 'seasonal\nnaive', 5.2, 5.0, { c: r.fcBad ? 'coral' : 'brand', w: 1.7, d: 1.3, h: 0.9, fs: 10 }),
    wh: Tl(r.fcBad ? 'stock-out' : 'stocked', 9.0, 5.0, { top: 1, c: r.fcBad ? 'coral' : 'green', w: 2.0, d: 1.3, fs: 10.5 }),
  };
  const l = {
    a: L('src', 'feat', { flow: 1 }), b: on.newcust ? L('nc', 'feat', { c: 'coral', dash: 1 }) : null, c: on.festival ? L('fest', 'feat', { c: 'coral', dash: 1 }) : null,
    d: L('feat', 'mdl', { flow: 1 }), e: L('mdl', 'thr', { flow: 1 }), f: L('thr', 'list', { flow: 1, c: r.bad ? 'coral' : 'green' }),
    g: L('ws', 'fcm', { flow: 1 }), h: on.newcat ? L('newc', 'fcm', { c: 'coral', dash: 1 }) : null, i: L('fcm', 'wh', { flow: 1, c: r.fcBad ? 'coral' : 'green' }),
  };
  return { s, l };
}

// ---------- system design sandbox: nightly scoring of 1M customers ----------
const EFF = { 1: 1, 2: 0.9, 4: 0.85, 8: 0.8 };
const MODEL = { logistic: [0.5, 0.2, 'logistic'], boosting: [4, 3, 'boosting'], ensemble: [40, 30, '10-model ensemble'] };
function sandboxCompute(v) {
  const w = v.workers, eff = EFF[w];
  const featWork = v.features === 'recompute' ? 36 : 4;                        // CPU-minutes for 1M customers
  const [scoreWork, explainWork, mname] = MODEL[v.model];
  const batches = Math.ceil(1_000_000 / v.batch);
  const overhead = batches * 2 / 60;                                           // 2 s fixed cost per batch
  const memGB = { 10000: 0.3, 100000: 1.6, 1000000: 14 }[v.batch];
  const oom = memGB > 8;
  const feat = featWork / (w * eff), score = scoreWork / (w * eff), expl = explainWork / (w * eff), over = overhead / w;
  const total = feat + score + expl + over;
  const cost = Math.max(total, 10) / 60 * w * 40;                              // ₹40 per worker-hour, 10-minute minimum
  const finish = 6 * 60 + 30 + total;                                          // data lands at 06:30
  const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(Math.round(m % 60)).padStart(2, '0')}`;
  const retry = total * 2 <= 30;
  const ok = !oom && total <= 15 && finish <= 7 * 60;
  let verdict;
  if (oom) verdict = `A 1M-row batch needs about ${memGB} GB per worker; workers have 8 GB, so the job crashes halfway. Use smaller batches.`;
  else if (total > 15) verdict = `${total.toFixed(1)} minutes: ${feat > score + expl ? 'feature computation is the bottleneck; compute features incrementally or add workers' : 'the model is the bottleneck; a simpler model or more workers would fit'}.`;
  else verdict = `${total.toFixed(1)} minutes for ₹${cost.toFixed(0)} a night${retry ? ', with time for one full retry before 7 a.m.' : '; no time for a retry if it fails.'}`;
  const rows = [
    ['Features', `${feat.toFixed(1)} min`, v.features === 'recompute' ? 'from raw history' : 'yesterday’s changes only', feat > 10],
    ['Scoring + reasons', `${(score + expl).toFixed(1)} min`, mname, score + expl > 10],
    ['Batch overhead', `${over.toFixed(1)} min`, `${batches} batches`, over > 3],
    ['Total runtime', oom ? 'crash (out of memory)' : `${total.toFixed(1)} min`, 'under 15 min', oom || total > 15],
    ['Peak memory per worker', `${memGB} GB`, 'under 8 GB', oom],
    ['List ready', oom ? 'not ready' : hhmm(finish), 'by 07:00 (data lands 06:30)', oom || finish > 7 * 60],
    ['Cost per night', `₹${cost.toFixed(0)}`, '₹40 per worker-hour', false],
  ];
  // diagram
  const hot = (x) => (x ? 'coral' : 'teal');
  const s = {
    zone: Z('nightly batch · 06:30 → 07:00', 5.0, 2.6, 13.0, 8.0, { c: ok ? 'teal' : 'slate' }),
    src: Cy('raw\nhistory', -0.4, 2.6, { c: 'blue', r: 0.6, h: 0.9, fs: 9.5 }),
    feat: B(v.features === 'recompute' ? 'recompute' : 'incremental', 2.6, 2.6, { c: hot(feat > 10), w: 1.7, d: 1.4, h: Math.min(0.4 + feat / 12, 2.2), fs: 10 }),
  };
  for (let i = 0; i < 8; i++) s['w' + i] = i < w ? B('', 5.4 + (i % 2) * 1.4, 0.0 + Math.floor(i / 2) * 1.6, { c: oom ? 'coral' : 'brand', w: 0.9, d: 1.0, h: 0.5 + Math.min((score + expl) / 8, 1.6), deco: 'server' }) : null;
  s.wl = T(`${w} worker${w > 1 ? 's' : ''} · ${mname}`, 6.1, 7.0, { z: 0.2, fs: 12, b: 1, c: oom ? 'coral' : 'violet' });
  s.out = Tl(oom ? 'no list' : `call list\n${hhmm(finish)}`, 10.0, 2.6, { top: 1, c: ok ? 'green' : 'coral', w: 2.0, d: 1.4, fs: 10.5 });
  s.clk = O(10.0, 0.2, { z: 0.5, r: 0.3, c: ok ? 'green' : 'coral', hl: ok ? 0 : 1, sub: '07:00' });
  const l = { a: L('src', 'feat', { flow: 1 }), b: L('feat', 'w0', { flow: 1, c: feat > 10 ? 'coral' : 'muted' }), c: L('w0', 'out', { flow: 1, c: ok ? 'green' : 'coral' }) };
  return { ok, verdict, rows, scene: { s, l } };
}

export default {
  id: 'p1-project', phase: 1, phaseName: 'Classical ML',
  title: 'Project: Churn and Demand Forecasting',
  sub: 'Score every customer each night, hand the retention team the 5,000 most at risk with a reason for each, and forecast four weeks of demand per category.',
  time: '14–20 hours across three levels',
  outcomes: ['A churn model that beats simple baselines on PR-AUC and precision within the call budget', 'A 4-week demand forecast per category that beats seasonal naive, including festival weeks', 'A nightly job that scores 1M customers in under 15 minutes, with versioned models and a one-sentence reason per customer'],
  brief: {
    goal: 'Reduce 90-day churn by 5% by giving the retention team a weekly list of at-risk customers they can act on, and give inventory planners a 4-week demand forecast per category so festival stock is right.',
    users: [['Shon, retention agent', 'Calls 5,000 customers a week. Needs the right names, ranked, with a reason he can say on the phone.'], ['Jones, category manager', 'Plans stock four weeks ahead. Needs a forecast per category that sees the Diwali spike.'], ['David, on-call engineer', 'Owns the nightly job. Needs it to finish by 7 a.m., fail loudly, and rerun from one command.']],
    data: 'A provided generator creates monthly customer snapshots (tenure, recency, orders, spend, late deliveries, tickets, festival-only flag) with a 90-day churn label, plus three years of weekly sales per category with trend, seasonality and moving festival weeks.',
    metric: 'Churn: precision within the 5,000-call budget and PR-AUC, against a recency rule and a logistic baseline; business impact measured as 90-day churn versus a control group. Demand: MASE below 1 against seasonal naive.',
    nfr: ['The scored list is ready by 7 a.m. every day.', 'L3: 1 million customers scored in under 15 minutes.', 'Every score is explainable in one sentence.', 'Training and scoring each run from one command; every list records the model version that made it.'],
    deliverables: ['Repository with a README', 'Training and scoring pipeline (one command each)', 'Model cards for the churn and demand models', 'Threshold analysis for the call budget', 'Scored sample list with reasons', 'Backtest report for the forecast, including festival weeks', 'Decision log: features dropped, threshold chosen, and why'],
    uses: ['P1.02–P1.03 framing and time-based splits', 'P1.06–P1.07 logistic regression and classification metrics', 'P1.12 gradient boosting', 'P1.15–P1.17 features, leakage and imbalance', 'P1.18 forecasting', 'P1.21–P1.22 tuning, pipelines and explainability'],
  },
  studio: [
    { h: 'Empathise and define', p: 'Read the three interview snippets. What problem do they describe?', quotes: [['Retention lead', 'We call the wrong people. Half the list ordered yesterday, and the customers who actually leave are never on it.'], ['Inventory planner', 'We stock for Diwali using last year’s numbers by hand. Every year one category runs out and another is left over.'], ['A customer who left', 'Two late deliveries and a ticket nobody answered. I did not complain again; I just stopped ordering.']], out: '<b>Output:</b> a problem statement: "Find customers likely to stop ordering in the next 90 days, early enough and with a reason, so a 5,000-call budget saves the most customers."' },
    { h: 'Ideate and frame', p: 'Compare three ways to build the call list before choosing one.', choice: { q: 'Which approach should you start with?', opts: [['Train the most complex model available', 'Complexity first hides whether simple signals already work, and it is harder to explain on the phone.'], ['Rules, then a scorecard, then ML: compare all three on precision within the budget', 'Correct. A recency rule and a logistic scorecard are fast baselines; ML must beat them on the business metric to earn its place.'], ['Keep calling last month’s top spenders', 'Big spenders are mostly not leaving. This is the current approach, and it misses customers like Priya.']], a: 1 } },
    { h: 'Construction', p: 'Write tests first: a feature function that must not use data after the snapshot date, a threshold function that returns exactly K customers, and a reason function that always names at least one feature.', out: '<b>Output:</b> tests such as <code>test_features_ignore_orders_after_snapshot</code> and <code>test_call_list_has_exactly_budget_rows</code> passing.' },
    { h: 'Validate', p: 'Run the four stress scenarios and the two failure drills, in the stress lab and in your pipeline. Size the nightly job in the system design sandbox.', out: '<b>Output:</b> a report of precision within the budget for each scenario, and a sized nightly job that meets 15 minutes.' },
    { h: 'Retrospective', p: 'Write down which features you dropped for leakage, how you chose the threshold, and what you would do for customers with no history.', out: '<b>Output:</b> decision-log entries for each choice, with evidence.' },
  ],
  decision: {
    q: 'The new churn model is 92% accurate and the team wants to ship it. What do you do?',
    opts: [
      ['Ship it: 92% is high', 'At the next monthly review, churn has not moved. With 8% churn, a model that predicts "nobody leaves" is also 92% accurate, and this one flags almost no one.', 'bad'],
      ['Compare it with the "always no churn" baseline first', 'Better: the comparison shows the 92% is no better than predicting nobody leaves. But the team still needs a metric and a threshold that fit the call budget.', 'bad'],
      ['Switch to PR-AUC and precision within the 5,000-call budget', 'The model is re-evaluated where it is used: among the top 5,000 it finds churners at 5× the base rate. At the monthly review, the called group’s 90-day churn is measurably below the control group’s.', 'good'],
    ],
  },
  levels: [
    {
      n: 'L1', h: 'Make it work', time: '4–6 hours',
      goal: 'Train a churn classifier and a demand forecast, each beating a simple baseline.',
      checks: ['Generate the data and check the churn rate and feature ranges', 'Report the "always no churn" baseline and its misleading accuracy', 'Train a recency rule, logistic regression and gradient boosting; compare ROC-AUC and PR-AUC', 'Forecast 4 weeks of demand for one category and beat seasonal naive', 'Write down which model you would take forward and why'],
      code: { why: 'Starter: the data generator, three churn baselines and a first demand forecast. Extend it to every category.', src: L1 },
      hint: 'Accuracy is the wrong yardstick at 8% churn (P1.07, P1.17). Use PR-AUC, and later precision within the call budget.',
    },
    {
      n: 'L2', h: 'Make it robust', time: '5–7 hours',
      goal: 'Time-based splits, a leakage audit, imbalance handling, a threshold set by the call budget, one-sentence reasons, and festival effects.',
      checks: ['Train on earlier monthly snapshots and test on a later month (no random splits)', 'Screen every feature alone and drop any recorded after the outcome', 'Use class weights or resampling, and evaluate with PR-AUC', 'Set the threshold as the top 5,000 per 1M customers and report precision at that budget', 'Attach a one-sentence reason to every customer on the list', 'Add a cold-start rule for customers with no history and festival features for the forecast'],
      code: { why: 'Starter: a time split, a leakage screen, class weights, a budget threshold and reason codes.', src: L2 },
      hint: 'The leak in the starter is "retention offer sent": it is only recorded after a customer is already leaving (P1.16).',
    },
    {
      n: 'L3', h: 'Make it scale', time: '5–7 hours',
      goal: 'Nightly batch scoring of 1M customers in under 15 minutes, versioned models, one-command training, and accuracy tracking.',
      checks: ['Train from one command and write a versioned model file with a model card', 'Score customers in chunks with bounded memory', 'Record the model version on every scored list', 'Measure runtime for 1M customers and size the job in the sandbox', 'Track list precision once outcomes arrive, month by month', 'Make the job safe to rerun after a failure halfway'],
      code: { why: 'Starter: versioned training, chunked nightly scoring and outcome tracking. Scale it to 1M customers on your machine and time it.', src: L3 },
      hint: 'Scoring is fast; computing features from raw history is what blows the time budget. Compute features incrementally and keep the model simple enough to explain.',
    },
  ],
  stressSub: 'Turn on the hard cases and compare a naive model with a guarded one',
  stressCols: ['Naive model', 'With L2/L3 guards'],
  stressDefault: { budget: true },
  stressRows(on) {
    const a = outcome(on, false), b = outcome(on, true);
    const n = (x) => x.toLocaleString('en-IN');
    return [
      ['Calls made this week', [n(a.calls)], [n(b.calls)]],
      ['Precision among calls', [pct(a.prec), true], [pct(b.prec), false, true]],
      ['Churners reached', [n(a.reached), true], [n(b.reached), false, true]],
      ['Customers saved (25% save rate)', [n(a.saved), true], [n(b.saved), false, true]],
      ['4-week demand forecast', [a.fc, a.fcBad], [b.fc]],
      ['What happened', [a.status, true], [b.status, false, true]],
    ];
  },
  stressScene,
  stress: [
    { id: 'newcust', h: '40% new customers', p: 'This month’s shoppers include a flood of first-time buyers with no history.' },
    { id: 'festival', h: 'Diwali and end-of-season distortion', p: 'Festival-only shoppers look loyal in October and "churned" in November.' },
    { id: 'budget', h: 'Budget: 5,000 calls', p: 'The retention team can make 5,000 calls a week, not 20,000.' },
    { id: 'newcat', h: 'New category with no history', p: 'ShopSense launches home décor; there are no past sales to forecast from.' },
  ],
  sandbox: {
    sub: 'Size the nightly job: score 1M customers with reasons, between 06:30 when data lands and 07:00 when Shon starts',
    howto: 'Pick one option in each box. The picture, verdict and table update. Aim for under 15 minutes, so a failed run can be retried before 7 a.m., at the lowest cost. Figures are illustrative.',
    controls: [
      { id: 'workers', label: 'Workers', def: 2, opts: [[1, '1'], [2, '2'], [4, '4'], [8, '8']], help: 'More workers run in parallel but cost more, with some coordination overhead.' },
      { id: 'batch', label: 'Batch size', def: 100000, opts: [[10000, '10k'], [100000, '100k'], [1000000, '1M']], help: 'Small batches add fixed overhead; huge batches need a lot of memory.' },
      { id: 'features', label: 'Feature computation', def: 'recompute', opts: [['recompute', 'Recompute from raw'], ['incremental', 'Incremental']], help: 'Incremental updates only the customers who changed yesterday (a simple feature store).' },
      { id: 'model', label: 'Model', def: 'boosting', opts: [['logistic', 'Logistic'], ['boosting', 'Boosting'], ['ensemble', 'Ensemble ×10']], help: 'Includes computing a reason for each customer (P1.22).' },
    ],
    compute: sandboxCompute,
    frames: [{ workers: 1, batch: 1000000, features: 'recompute', model: 'ensemble' }, { workers: 8, batch: 10000, features: 'incremental', model: 'logistic' }],
    note: 'Model: 36 CPU-minutes to recompute features for 1M customers (4 when incremental), scoring plus reasons from 0.7 (logistic) to 70 (ensemble) CPU-minutes, 2 s per batch, 8 GB per worker, ₹40 per worker-hour with a 10-minute minimum.',
  },
  drills: [
    { h: 'A post-churn feature is discovered', p: 'After launch you learn that "account_downgraded" is set by the retention team after a customer leaves. What now?', a: 'Treat it as an incident: remove the feature, retrain with a time-based split, and re-report precision honestly (it will drop). Add the feature-timing check to the leakage screen and the tests, and record it in the decision log and model card.' },
    { h: 'The nightly job fails halfway', p: 'At 06:48 the job crashes after scoring 600,000 customers. What should happen?', a: 'Nothing half-written reaches Shon: write to a staging table and publish atomically only when the run is complete. Make chunks idempotent so the rerun skips finished chunks. If it cannot finish by 7 a.m., keep yesterday’s list, label it as such, and alert David.' },
  ],
  review: [
    ['Why is 92% accuracy meaningless at 8% churn?', 'Predicting "nobody churns" is already 92% accurate. Accuracy rewards ignoring the rare class; use PR-AUC and precision within the call budget, compared against simple baselines.'],
    ['How did you choose the threshold?', 'From the business constraint: the team can make 5,000 calls per million customers, so the list is the top 5,000 by risk. Report precision and expected saves at that point, and check whether a different budget would pay off.'],
    ['What happens to customers with no history?', 'They cannot be scored like the others, and filling missing history with 0 makes them look active. Use a separate cold-start rule (first-order experience, delivery problems, early tickets) until enough history exists, and monitor that group separately.'],
  ],
  side: { h: 'Side lab: credit-card fraud (2–3 hours)', p: 'Train a fraud classifier on a public, heavily imbalanced card-transactions dataset (under 0.2% fraud). Compare PR-AUC across class weights and resampling, set a threshold from the cost of a missed fraud versus a declined good transaction, and explain three flagged transactions in one sentence each.' },
  next: 'Phase 2 moves to deep learning: neural networks for images, text and recommendations.',
};
