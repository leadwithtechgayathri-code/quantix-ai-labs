import { B, Tl, O, T, Z, S, P, Cy, Bub, L, row, bars, each, off, mg } from '../kit.js';

const DATA = '#c4cdfb', SYS = '#b2e5da', GOOD = '#c1e4b1', BAD = '#ffc4b1', MODEL = '#d9cafb', SIGNAL = '#fddf98';

// ===================================================================== P0.01
const l1 = {
  id: 'p0-01', title: 'How AI projects use data', time: '25 minutes',
  sub: 'Every AI project is a path from a business decision, through data, to a better decision. Most of the work is in the data.',
  learn: ['Trace the path from raw data to a model to a business decision', 'Explain why a project starts from the decision, not the model', 'Build a simple baseline and measure its error'],
  legend: [[DATA, 'data'], [SYS, 'processing'], [MODEL, 'model'], [GOOD, 'decision']],
  steps: [
    {
      t: 'Start from a decision', b: ['Jones, the ShopSense category manager, must decide how many cotton sarees to stock for Diwali. That decision, not a model, is where an AI project begins.', 'If you cannot name the decision and who makes it, you are not ready to collect data or train anything.'],
      n: 'Good projects begin with a question a person will act on.',
      s: { jones: P(11.6, 2.1, { c: 'teal', sk: 1, s: 1.5, t: 'Jones', mood: 'thinking', pose: 'think' }), ask: Bub('How many sarees should\nwe stock for Diwali?', 11.6, 2.1, { z: 3.4, c: 'teal', side: 'left' }) },
      focus: ['jones', 'ask'],
    },
    {
      t: 'Collect the data that describes the problem', b: ['Past orders, returns, stock levels and reviews already exist in ShopSense systems. They are copied into one place, often a data warehouse or a data lake.'],
      n: 'Ask: which data would a human expert look at to make this decision?',
      s: { ...row('src', ['orders', 'returns', 'stock', 'reviews'], { x: 0, y: 0.2, dx: 0, dy: 1.25, c: 'blue', w: 1.4, d: 0.9, fs: 10 }), raw: Cy('raw\ndata', 2.8, 2.1, { c: 'blue', r: 0.65, h: 1, fs: 9.5 }), ask: null, jones: { mood: 'neutral', pose: '' } },
      l: Object.fromEntries([0, 1, 2, 3].map((i) => ['c' + i, L('src' + i, 'raw', { c: 'blue', na: i !== 1, flow: 1 })])),
    },
    {
      t: 'Clean it before anything learns from it', b: ['Raw data has duplicates, missing values, wrong types and outliers. Cleaning fixes or flags them, using rules written down so anyone can repeat them.'],
      n: 'Coral pieces are bad rows. They leave the clean step as blue, consistent data.',
      s: { clean: B('clean +\nvalidate', 5.0, 2.1, { c: 'teal', w: 1.4, d: 1.3, h: 0.9, fs: 10 }), bad0: Tl('dup', 3.0, 3.7, { z: 0.1, c: 'coral', w: 0.6, d: 0.5, fs: 8.5 }), bad1: Tl('null', 4.3, 3.6, { z: 0.1, c: 'coral', w: 0.6, d: 0.5, fs: 8.5 }) },
      l: { r: L('raw', 'clean', { flow: 1 }) },
    },
    {
      t: 'Learn a pattern from the clean data', b: ['Now a model, or sometimes just a simple calculation, learns the pattern: how saree orders rise before Diwali, by city and price band.', 'In this course you will always try a simple baseline first, then a model only if it beats the baseline.'],
      n: 'The model is one box in the middle of the pipeline, not the whole project.',
      s: { bad0: null, bad1: null, model: B('model', 7.2, 2.1, { c: 'brand', w: 1.4, d: 1.3, h: 1.1, fs: 13 }) },
      l: { m: L('clean', 'model', { flow: 1 }) },
    },
    {
      t: 'Decide, then measure what happened', b: ['The output is a stock plan Jones can act on. After Diwali, actual sales are compared with the plan, and that result flows back as new data.', 'This feedback loop is how real AI systems keep improving instead of quietly going stale.'],
      n: 'A project is a loop: decision → data → model → decision → measure → data.',
      s: { fbt: T('measure → feed back', 7.6, 5.6, { fs: 12, c: 'amber', b: 1 }), plan: Tl('stock plan', 9.3, 2.1, { c: 'green', w: 1.4, d: 1.0, fs: 10 }), jones: { mood: 'happy' } },
      l: { p: L('model', 'plan', { c: 'green', flow: 1 }), d: L('plan', 'jones', { c: 'green' }), fb: L('jones', 'raw', { c: 'amber', dash: 1, bend: 2.4 }) },
      focus: null,
    },
    {
      t: 'Where the time really goes', b: ['Surveys of data scientists consistently report that finding, cleaning and preparing data takes a large share of project time, often more than building models.', 'That is why Phase 0 spends ten lessons on data before any machine learning.'],
      n: 'The bars are illustrative. The point is the shape: data work usually dominates.',
      clear: true,
      s: mg(bars('t', [2.6, 1.0, 0.7], { x: 0, y: 0, dx: 2, w: 1.1, d: 1.1, c: 'teal', labels: ['data work', 'modelling', 'deployment'] }), { t1: { c: 'violet' }, t2: { c: 'green' } }),
    },
  ],
  math: {
    blocks: [
      { h: 'A model is a function', sub: 'It maps inputs to a prediction', f: 'ŷ = f(x)\n\nx = inputs (for example: last 4 weeks of orders)\nŷ = prediction (next week’s orders)', p: 'Every model in this course, from a simple average to a large language model, is some function f.' },
      { h: 'Error measures how wrong it was', sub: 'Compare prediction with what really happened', f: 'error = y − ŷ\n\npercentage error = |y − ŷ| / y', p: 'A baseline gives you an error to beat. A model that cannot beat it is not worth deploying.' },
      { h: 'The moving-average baseline', sub: 'The simplest useful forecast', f: 'ŷₜ₊₁ = (yₜ + yₜ₋₁ + … + yₜ₋ₖ₊₁) / k', p: 'Average the last k weeks and predict that for next week.' },
    ],
    example: {
      intro: 'Forecast next week’s saree orders from the last four weeks.',
      steps: ['Last four weeks of orders: <code>1200, 1350, 1280, 1410</code>.', 'Sum them: 1200 + 1350 + 1280 + 1410 = <b>5240</b>.', 'Average: 5240 / 4 = <b>1310</b>. That is the forecast ŷ.', 'Next week the actual orders are <b>1500</b>. Error y − ŷ = 1500 − 1310 = <b>190</b>.', 'Percentage error = 190 / 1500 ≈ <b>12.7%</b>. Any model must beat this to be useful.'],
    },
  },
  code: {
    scratch: { why: 'The whole idea in plain Python: a baseline forecast and its error.', src: `weekly_orders = [1200, 1350, 1280, 1410]

forecast = sum(weekly_orders) / len(weekly_orders)
print("Forecast for next week:", forecast)

actual = 1500
error = actual - forecast
print("Error:", error)
print(f"Percentage error: {error / actual:.1%}")` },
    library: { why: 'The same baseline with pandas, the tool you will use daily.', src: `import pandas as pd

orders = pd.Series(
    [1200, 1350, 1280, 1410],
    index=pd.date_range("2026-10-05", periods=4, freq="7D"),
    name="orders",
)
print(orders)

forecast = orders.tail(4).mean()
print(f"\\nBaseline forecast: {forecast:.0f}")` },
    prod: { why: 'A typed, tested function you could put in a real codebase.', src: `from dataclasses import dataclass
from statistics import mean


@dataclass(frozen=True)
class Forecast:
    value: float
    method: str


def moving_average_forecast(history: list[float], window: int = 4) -> Forecast:
    """Forecast the next value as the mean of the last \`window\` values."""
    if window < 1:
        raise ValueError("window must be at least 1")
    if len(history) < window:
        raise ValueError(f"need at least {window} values, got {len(history)}")
    return Forecast(value=mean(history[-window:]), method=f"mean of last {window}")


def test_moving_average_forecast() -> None:
    assert moving_average_forecast([1, 2, 3, 4]).value == 2.5
    try:
        moving_average_forecast([1, 2])
    except ValueError:
        pass
    else:
        raise AssertionError("expected ValueError for short history")


test_moving_average_forecast()
print(moving_average_forecast([1200, 1350, 1280, 1410]))` },
  },
  industry: {
    when: ['Every project, before any model is chosen.', 'Whenever someone says "let’s use AI for this": first ask which decision it improves.', 'When reviewing a proposal: check the data exists at the moment the decision is made.'],
    baseline: 'Answer the decision with a simple rule or average, measure its error, and write that number down. In many projects the baseline is good enough, and that is a successful outcome.',
    tools: ['SQL and a data warehouse (BigQuery, Snowflake, PostgreSQL)', 'pandas and Jupyter notebooks for exploration', 'Dashboards such as Metabase or Power BI to share results', 'A ticket or one-page brief stating the decision and the metric'],
    tradeoffs: ['More data sources add signal but also cleaning work and failure points.', 'A complex model may gain a little accuracy but cost explainability and maintenance.', 'Faster decisions need fresher data, which costs more to pipe in.'],
    failures: ['Solving a problem nobody will act on.', 'Using data that is not available at prediction time (leakage).', 'No feedback loop, so nobody notices when the model drifts.', 'Skipping the baseline, so nobody knows whether the model helps.'],
    shopsense: 'Phase 0’s project, the Sales Insights Pipeline, starts here: before any AI, Jones needs one trusted weekly sales number. Later phases add models on top of that clean data.',
    interview: [
      ['How would you start an ML project for a new business problem?', 'Clarify the decision and who acts on it, define the success metric, check what data exists at decision time, build a simple baseline, and only then consider a model that must beat it.'],
      ['Why build a baseline before a model?', 'It gives an error to beat, often solves the problem cheaply, and reveals data problems early. Without it you cannot prove the model adds value.'],
      ['What is a feedback loop in an ML system?', 'Outcomes after a decision are captured as new data, so the system can be evaluated and retrained. Without it, model quality silently decays.'],
    ],
  },
  quiz: [
    { q: 'Where should an AI project start?', opts: ['Choosing the most accurate model', 'Collecting as much data as possible', 'Naming the decision it will improve and who makes it', 'Buying GPUs'], a: 2, why: 'The decision defines which data, metric and model make sense. Everything else follows from it.' },
    { q: 'The last four weeks had 1200, 1350, 1280 and 1410 orders. What is the 4-week moving-average forecast?', opts: ['1280', '1310', '1350', '1410'], a: 1, why: '(1200 + 1350 + 1280 + 1410) / 4 = 5240 / 4 = 1310.' },
    { q: 'A model has 12% error. The moving-average baseline has 10% error. What should the team do?', opts: ['Deploy the model; models are better', 'Keep the baseline and investigate why the model is worse', 'Average the two', 'Add more layers to the model'], a: 1, why: 'A model must beat the baseline to earn its extra cost and complexity. Here it does not.' },
    { q: 'Why does a production AI system need a feedback loop?', opts: ['To make training faster', 'To capture outcomes so the system can be measured and improved', 'To reduce cloud costs', 'It does not need one'], a: 1, why: 'Without outcomes flowing back as data, nobody can tell when the model stops working.' },
    { q: 'Which usually takes the largest share of time in a data project?', opts: ['Choosing a model architecture', 'Finding, cleaning and preparing data', 'Writing the final report', 'Tuning hyperparameters'], a: 1, why: 'Practitioner surveys consistently put data preparation at or near the top. Phase 0 reflects that.' },
  ],
  exercise: {
    task: ['Write two functions. <code>forecast_last_k(history, k)</code> returns the mean of the last <code>k</code> values. <code>pct_error(actual, forecast)</code> returns the absolute error as a fraction of <code>actual</code>.', 'Then forecast the next week from the last <b>3</b> weeks of <code>[1200, 1350, 1280, 1410]</code>.'],
    starter: `def forecast_last_k(history, k):
    # return the mean of the last k values
    pass


def pct_error(actual, forecast):
    # return |actual - forecast| / actual
    pass


history = [1200, 1350, 1280, 1410]
f3 = forecast_last_k(history, 3)
print("3-week forecast:", f3)
print("error vs 1500:", pct_error(1500, f3))`,
    check: `assert abs(forecast_last_k([1200, 1350, 1280, 1410], 3) - 1346.6666) < 0.01, "3-week mean should be about 1346.67"
assert forecast_last_k([5, 7], 2) == 6
assert abs(pct_error(1500, 1310) - 0.12666) < 0.001
assert pct_error(100, 110) == 0.1, "use the absolute error"`,
    solution: `def forecast_last_k(history, k):
    last = history[-k:]
    return sum(last) / len(last)


def pct_error(actual, forecast):
    return abs(actual - forecast) / actual


history = [1200, 1350, 1280, 1410]
f3 = forecast_last_k(history, 3)
print("3-week forecast:", f3)
print("error vs 1500:", pct_error(1500, f3))`,
    hint: '<code>history[-k:]</code> gives the last k items. Use <code>abs()</code> for the absolute error.',
  },
};

// ===================================================================== P0.02
const PRICES = [499, 799, 1299, 349, 999, 1999];
const l2 = {
  id: 'p0-02', title: 'NumPy arrays and vectorisation', time: '30 minutes',
  sub: 'Replace slow Python loops with array operations that work on every value at once.',
  learn: ['Create NumPy arrays and do element-wise arithmetic', 'Explain why vectorised code is much faster than loops', 'Compute totals such as revenue with a dot product'],
  legend: [[DATA, 'values'], [GOOD, 'computed'], [SIGNAL, 'memory']],
  steps: [
    {
      t: 'Six prices in a Python list', b: ['ShopSense has six product prices in rupees. In plain Python they sit in a list: <code>[499, 799, 1299, 349, 999, 1999]</code>.', 'We want the price including 18% GST for every product.'],
      n: 'Each tile is one value. The task is the same for every tile.',
      s: row('p', PRICES.map(String), { x: 0, y: 0, dx: 1.25, c: 'blue', w: 1.1, d: 0.9 }),
    },
    {
      t: 'A loop works one value at a time', b: ['A Python <code>for</code> loop takes the first price, multiplies it, stores it, then moves to the next. Python checks types and looks up the operation for every single value.'],
      n: 'Only one tile changes per loop step. With a million prices, that is a million slow steps.',
      s: { p0: { t: '588.82', c: 'green', hl: 1 }, p1: { hl: 0 }, loop: T('for p in prices: …  one at a time', 4.6, 2.4, { fs: 13, c: 'muted' }) },
    },
    {
      t: 'Vectorised: every value at once', b: ['With NumPy you write <code>prices * 1.18</code>. One instruction updates the whole array, and the actual loop runs in fast, compiled C code.'],
      n: 'All tiles change in one step. No Python loop in your code.',
      s: { ...each('p', 6, (i) => ({ t: (Math.round(PRICES[i] * 118) / 100).toFixed(2), c: 'green', hl: 0, fs: 9.5 })), loop: { t: 'prices * 1.18   all at once', c: 'green' } },
    },
    {
      t: 'Why it is faster: memory layout', b: ['A Python list holds pointers to separate number objects scattered around memory. A NumPy array stores raw numbers side by side in one block, all the same type.', 'The CPU can stream through a contiguous block very efficiently.'],
      n: 'Top: a list points to scattered boxes. Bottom: an array is one tight block.',
      clear: true,
      s: {
        lst: B('list', 0, 0, { c: 'slate', w: 1.1, d: 0.9, h: 0.5, fs: 11 }),
        o0: O(2.4, -1.4, { r: 0.28, c: 'blue' }), o1: O(3.6, 0.4, { r: 0.28, c: 'blue' }), o2: O(2.2, 1.4, { r: 0.28, c: 'blue' }), o3: O(4.4, -0.6, { r: 0.28, c: 'blue' }),
        arr: S(2.2, 4.2, 4.8, 1.0, { c: 'amber', h: 0.3 }), al: T('array: one block, same type', 5.4, 6.6, { fs: 12, c: 'muted' }), ll: T('list: pointers to scattered objects', -1.6, -1.6, { fs: 12, c: 'muted' }),
        ...row('a', ['499', '799', '1299', '349'], { x: 0.4, y: 4.2, dx: 1.2, z: 0.3, c: 'blue', w: 1.1, d: 0.8, h: 0.14, fs: 10 }),
      },
      l: { q0: L('lst', 'o0', { c: 'muted', na: 0 }), q1: L('lst', 'o1', { c: 'muted' }), q2: L('lst', 'o2', { c: 'muted' }), q3: L('lst', 'o3', { c: 'muted' }) },
    },
    {
      t: 'The payoff', b: ['On large arrays, vectorised NumPy code is commonly tens to hundreds of times faster than a Python loop. It is also shorter and easier to read.', 'Rule of thumb: if you are writing a <code>for</code> loop over numbers, look for the NumPy operation instead.'],
      n: 'Bars are illustrative; measure on your own data with <code>%timeit</code>.',
      clear: true,
      s: mg(bars('sp', [2.8, 0.15], { x: 0, y: 0, dx: 2.4, w: 1.2, d: 1.2, c: 'coral', labels: ['Python loop', 'NumPy'] }), { sp1: { c: 'green' }, cap: T('time to process 1 million prices', -0.6, -2.4, { z: 3.4, fs: 13, c: 'muted' }) }),
    },
  ],
  math: {
    blocks: [
      { h: 'Element-wise operations', sub: 'Apply the same operation to every element', f: 'c = a × s   means   cᵢ = aᵢ × s  for every i\nc = a + b   means   cᵢ = aᵢ + bᵢ', p: 'Arrays must have compatible shapes; the next lesson explains broadcasting.' },
      { h: 'Sum and mean', f: 'sum(a) = a₁ + a₂ + … + aₙ\nmean(a) = sum(a) / n' },
      { h: 'Dot product', sub: 'Multiply pairs, then add', f: 'p · q = p₁q₁ + p₂q₂ + … + pₙqₙ', p: 'With prices p and quantities q, the dot product is total revenue. It is also the core operation inside every neural network.' },
    ],
    example: {
      intro: 'Total revenue from three products.',
      steps: ['Prices p = <code>[499, 799, 1299]</code>, quantities q = <code>[2, 1, 3]</code>.', 'Multiply pairs: 499 × 2 = 998, 799 × 1 = 799, 1299 × 3 = 3897.', 'Add them: 998 + 799 + 3897 = <b>5694</b>.', 'In NumPy this is one call: <code>p @ q</code> or <code>np.dot(p, q)</code>, which returns 5694.'],
    },
  },
  code: {
    scratch: { why: 'The loop you are learning to avoid, so you can see what NumPy replaces.', src: `prices = [499, 799, 1299, 349, 999, 1999]

with_gst = []
for p in prices:
    with_gst.append(round(p * 1.18, 2))
print(with_gst)

quantities = [2, 1, 3, 5, 1, 2]
revenue = 0
for p, q in zip(prices, quantities):
    revenue += p * q
print("Revenue:", revenue)` },
    library: { why: 'Vectorised NumPy: no loops, one operation per idea.', src: `import numpy as np

prices = np.array([499, 799, 1299, 349, 999, 1999])
quantities = np.array([2, 1, 3, 5, 1, 2])

print(np.round(prices * 1.18, 2))
print("Revenue:", prices @ quantities)
print("Average price:", prices.mean())
print("Expensive items:", prices[prices > 1000])` },
    prod: { why: 'Typed functions with input checks and a test, as a team would ship them.', src: `import numpy as np
from numpy.typing import NDArray

GST_RATE = 0.18


def add_gst(prices: NDArray[np.float64], rate: float = GST_RATE) -> NDArray[np.float64]:
    """Return prices including GST, rounded to paise."""
    if np.any(prices < 0):
        raise ValueError("prices must be non-negative")
    return np.round(prices * (1 + rate), 2)


def revenue(prices: NDArray[np.float64], quantities: NDArray[np.int64]) -> float:
    if prices.shape != quantities.shape:
        raise ValueError(f"shape mismatch: {prices.shape} vs {quantities.shape}")
    return float(prices @ quantities)


def test_pricing() -> None:
    assert add_gst(np.array([100.0]))[0] == 118.0
    assert revenue(np.array([499.0, 799.0, 1299.0]), np.array([2, 1, 3])) == 5694.0


test_pricing()
print(add_gst(np.array([499.0, 799.0, 1299.0])))` },
  },
  industry: {
    when: ['Any numeric work on more than a few thousand values.', 'Feature calculations before training a model.', 'Inside libraries: pandas, scikit-learn and PyTorch are built on the same array idea.'],
    baseline: 'Write the clearest vectorised version first. Only optimise further (Numba, Polars, GPU) if profiling shows a real bottleneck.',
    tools: ['NumPy for arrays', 'pandas (built on NumPy) for tables', '<code>%timeit</code> in Jupyter for quick timing', 'Numba or PyTorch when NumPy is not enough'],
    tradeoffs: ['Arrays need one data type; mixed data belongs in pandas.', 'Vectorised code can use more memory for intermediate arrays.', 'Very clever one-liners can hurt readability; name intermediate steps.'],
    failures: ['Silent integer overflow with small integer types (for example <code>int8</code>).', 'Floating-point rounding when comparing money with <code>==</code>.', 'Accidentally creating object arrays, which are as slow as lists.'],
    shopsense: 'GST calculations, discounts and revenue totals across millions of order lines in the Sales Insights Pipeline are all vectorised array operations.',
    interview: [
      ['Why is NumPy faster than Python lists?', 'Arrays store one data type contiguously in memory, and operations run as compiled loops in C, avoiding per-element Python overhead such as type checks and object lookups.'],
      ['What is vectorisation?', 'Expressing an operation on whole arrays instead of explicit Python loops, so the library can run it efficiently in compiled code.'],
      ['How would you compute total revenue from price and quantity arrays?', 'Use the dot product: <code>prices @ quantities</code>, after checking both arrays have the same shape.'],
    ],
  },
  quiz: [
    { q: 'What does prices * 1.18 do when prices is a NumPy array?', opts: ['Repeats the array 1.18 times', 'Multiplies every element by 1.18', 'Multiplies only the first element', 'Raises an error'], a: 1, why: 'Arithmetic between an array and a number applies to every element.' },
    { q: 'Why are NumPy operations usually much faster than Python loops?', opts: ['They use the GPU automatically', 'They store same-type values contiguously and loop in compiled code', 'They skip some elements', 'Python loops are deliberately slowed down'], a: 1, why: 'Contiguous memory and compiled loops remove Python’s per-element overhead.' },
    { q: 'p = [499, 799, 1299] and q = [2, 1, 3]. What is p · q?', opts: ['2597', '5694', '3897', '6000'], a: 1, why: '499×2 + 799×1 + 1299×3 = 998 + 799 + 3897 = 5694.' },
    { q: 'Which expression selects prices above 1000?', opts: ['prices > 1000', 'prices[prices > 1000]', 'prices.filter(1000)', 'prices[1000:]'], a: 1, why: 'prices > 1000 makes a True/False mask; indexing with it keeps the True positions.' },
    { q: 'You see a for loop summing a million floats. What should you try first?', opts: ['Rewrite it in C', 'Use np.sum or array arithmetic', 'Add more RAM', 'Run it on a GPU cluster'], a: 1, why: 'The vectorised NumPy version is usually enough and keeps code simple.' },
  ],
  exercise: {
    task: ['Using NumPy and no <code>for</code> loops, apply a 10% discount to every price <b>above 1000</b> (others unchanged), then compute total revenue with the quantities.', 'Store the discounted prices in <code>discounted</code> and the total in <code>total</code>.'],
    starter: `import numpy as np

prices = np.array([499, 799, 1299, 349, 999, 1999], dtype=float)
quantities = np.array([2, 1, 3, 5, 1, 2])

discounted = prices  # change this line
total = 0            # and this one

print(discounted)
print(total)`,
    check: `assert np.allclose(discounted, [499, 799, 1169.1, 349, 999, 1799.1]), "only prices above 1000 get 10% off"
assert abs(total - (499*2 + 799 + 1169.1*3 + 349*5 + 999 + 1799.1*2)) < 1e-6`,
    solution: `import numpy as np

prices = np.array([499, 799, 1299, 349, 999, 1999], dtype=float)
quantities = np.array([2, 1, 3, 5, 1, 2])

discounted = np.where(prices > 1000, prices * 0.9, prices)
total = discounted @ quantities

print(discounted)
print(total)`,
    hint: '<code>np.where(condition, value_if_true, value_if_false)</code> works on whole arrays.',
  },
};

// ===================================================================== P0.03
const grid = (p, rows, cols, o = {}) => {
  const r = {};
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) r[`${p}${i}${j}`] = { k: 'tile', x: (o.x || 0) + j * 1.05, y: (o.y || 0) + i * 1.05, w: 0.95, d: 0.95, h: 0.16, c: o.c || 'blue', t: o.t ? o.t(i, j) : '', fs: 10, ...(o.extra || {}) };
  return r;
};
const SALES = [[12, 15, 9, 20], [30, 25, 28, 35], [8, 6, 10, 7]];
const l3 = {
  id: 'p0-03', title: 'Shapes and broadcasting', time: '30 minutes',
  sub: 'Predict the shape of any array operation, and let NumPy stretch smaller arrays to fit, safely.',
  learn: ['Read and reason about array shapes such as (3, 4)', 'Apply the broadcasting rules to predict results or errors', 'Use keepdims to normalise rows and columns correctly'],
  legend: [[DATA, 'sales'], [SIGNAL, 'stretched copy'], [GOOD, 'result'], [BAD, 'mismatch']],
  steps: [
    {
      t: 'A table of sales has a shape', b: ['Daily sarees sold in 3 stores over 4 days form a 2-D array with shape <code>(3, 4)</code>: 3 rows, 4 columns.', 'Shape is always listed as rows first, then columns.'],
      n: 'Every NumPy array carries its shape. Check it often with <code>a.shape</code>.',
      s: { ...grid('m', 3, 4, { t: (i, j) => String(SALES[i][j]) }), sh: T('shape (3, 4)', 2.6, 5.6, { fs: 13, b: 1 }) },
    },
    {
      t: 'Add a different bonus for each day', b: ['A promotion adds a bonus per day: <code>[1, 2, 3, 4]</code>, shape <code>(4,)</code>. We want to add it to every store’s row.'],
      n: 'The bonus row has 4 values, matching the 4 columns.',
      s: row('v', ['+1', '+2', '+3', '+4'], { x: 0, y: -2.6, dx: 1.05, c: 'amber', w: 0.95, d: 0.95, fs: 10 }),
    },
    {
      t: 'Broadcasting stretches the smaller array', b: ['NumPy compares shapes from the right: 4 matches 4. The missing first dimension is treated as 1 and stretched to 3, as if the bonus row were copied for every store.', 'No copy is actually made in memory. NumPy just reuses the same row.'],
      n: 'The faded rows are virtual copies, not real data.',
      s: { ...grid('g', 3, 4, { x: 5.6, c: 'amber', t: (i, j) => `+${j + 1}`, extra: { o: 0.6 } }), gl: T('virtual copies', 10.6, 4.4, { fs: 12, c: 'amber' }), sh: { t: '(3, 4) + (4,) → (3, 4)' } },
    },
    {
      t: 'The result has the larger shape', b: ['Each store’s sales now include the daily bonus. The result keeps shape <code>(3, 4)</code>.'],
      n: 'Store 1, day 4: 20 + 4 = 24.',
      s: mg(Object.fromEntries([0, 1, 2].flatMap((i) => [0, 1, 2, 3].map((j) => [`g${i}${j}`, null]))), grid('m', 3, 4, { c: 'green', t: (i, j) => String(SALES[i][j] + j + 1) }), { m03: { hl: 1 }, gl: null }),
    },
    {
      t: 'When shapes do not fit', b: ['Now try a per-store adjustment of shape <code>(3,)</code>. Comparing from the right, 3 does not match 4, and neither is 1. NumPy raises an error instead of guessing.', 'Reshape it to <code>(3, 1)</code> and it broadcasts across columns.'],
      n: 'The fix for per-row values is almost always shape (n, 1), for example with <code>keepdims=True</code>.',
      warn: true,
      s: { m03: { hl: 0 }, ...off('v', 4), ...row('r', ['−5', '−2', '−1'], { x: -1.6, y: 0, dx: 0, dy: 1.05, c: 'coral', w: 0.95, d: 0.95, fs: 10 }), sh: { t: '(3, 4) + (3,) → error   ·   (3, 4) + (3, 1) → OK', c: 'coral' } },
    },
  ],
  math: {
    blocks: [
      { h: 'The broadcasting rule', sub: 'Compare shapes from the rightmost dimension', f: 'Two dimensions are compatible when\n  they are equal, or\n  one of them is 1.\nMissing leading dimensions count as 1.', p: 'The result takes the larger size in each dimension.' },
      { h: 'Examples', f: '(3, 4) + (4,)    → (3, 4)\n(3, 4) + (3, 1)  → (3, 4)\n(3, 4) + (3,)    → error (4 vs 3)\n(5, 1) * (1, 6)  → (5, 6)' },
      { h: 'Row shares with keepdims', f: 'shareᵢⱼ = xᵢⱼ / Σⱼ xᵢⱼ\n\nrow_sums = x.sum(axis=1, keepdims=True)   # shape (3, 1)', p: 'keepdims keeps the summed axis as size 1, so the division broadcasts per row.' },
    ],
    example: {
      intro: 'Each store’s share of its own weekly sales.',
      steps: ['Store 1 sold <code>[12, 15, 9, 20]</code>. Its row sum is 12 + 15 + 9 + 20 = <b>56</b>.', '<code>x.sum(axis=1, keepdims=True)</code> gives <code>[[56], [118], [31]]</code>, shape (3, 1).', 'Dividing (3, 4) by (3, 1) broadcasts each row sum across its own row.', 'Store 1, day 4 share = 20 / 56 ≈ <b>0.357</b>. Each row of shares adds up to 1.'],
    },
  },
  code: {
    scratch: { why: 'Nested loops doing by hand what broadcasting does for you.', src: `sales = [[12, 15, 9, 20], [30, 25, 28, 35], [8, 6, 10, 7]]
bonus = [1, 2, 3, 4]

result = []
for row in sales:
    result.append([value + b for value, b in zip(row, bonus)])
print(result)

shares = []
for row in sales:
    total = sum(row)
    shares.append([round(v / total, 3) for v in row])
print(shares[0])` },
    library: { why: 'Broadcasting: one line per idea, and shape errors are caught for you.', src: `import numpy as np

sales = np.array([[12, 15, 9, 20], [30, 25, 28, 35], [8, 6, 10, 7]])
bonus = np.array([1, 2, 3, 4])

print((sales + bonus).shape)
print(sales + bonus)

row_sums = sales.sum(axis=1, keepdims=True)
print(row_sums.shape)
print(np.round(sales / row_sums, 3))

try:
    sales + np.array([5, 2, 1])
except ValueError as e:
    print("Error:", e)` },
    prod: { why: 'A reusable function that states and checks its shape contract.', src: `import numpy as np
from numpy.typing import NDArray


def row_shares(x: NDArray[np.float64]) -> NDArray[np.float64]:
    """Divide each row by its own total. Input shape (n, m) -> output (n, m)."""
    if x.ndim != 2:
        raise ValueError(f"expected a 2-D array, got shape {x.shape}")
    totals = x.sum(axis=1, keepdims=True)
    if np.any(totals == 0):
        raise ValueError("a row sums to zero; shares are undefined")
    return x / totals


def test_row_shares() -> None:
    out = row_shares(np.array([[1.0, 3.0], [2.0, 2.0]]))
    assert out.shape == (2, 2)
    assert np.allclose(out.sum(axis=1), 1.0)


test_row_shares()
print(np.round(row_shares(np.array([[12.0, 15, 9, 20], [8, 6, 10, 7]])), 3))` },
  },
  industry: {
    when: ['Normalising features per row or per column before training.', 'Applying per-store, per-day or per-category adjustments in one step.', 'Inside every deep-learning layer (adding a bias vector to a batch).'],
    baseline: 'Print <code>.shape</code> after every important step. Most array bugs are shape bugs, and they are cheap to catch early.',
    tools: ['NumPy broadcasting', 'pandas aligns by labels instead of positions', 'PyTorch and JAX follow the same broadcasting rules'],
    tradeoffs: ['Broadcasting is concise but can hide mistakes when shapes happen to fit.', 'Explicit reshapes such as (n, 1) are clearer than relying on implicit rules.'],
    failures: ['A (n,) vector broadcasting against (n, n) and silently producing an n × n result instead of an error.', 'Dividing by row sums without keepdims, which broadcasts the wrong way or fails.', 'Mixing up axis=0 (down columns) and axis=1 (across rows).'],
    shopsense: 'Computing each store’s share of weekly sales, or each category’s share of GMV, uses exactly the keepdims pattern from this lesson.',
    interview: [
      ['State NumPy’s broadcasting rule.', 'Compare shapes from the right; dimensions are compatible if equal or if one is 1. Missing leading dimensions count as 1, and the result takes the larger size.'],
      ['Why might (5,) + (5, 1) be dangerous?', 'It broadcasts to (5, 5) without an error, which is rarely intended. Check shapes or reshape explicitly.'],
      ['What does keepdims=True do?', 'It keeps reduced axes with size 1, so the result can broadcast back against the original array, for example dividing rows by their sums.'],
    ],
  },
  quiz: [
    { q: 'What is the result shape of (3, 4) + (4,)?', opts: ['(4,)', '(3, 4)', '(3,)', 'Error'], a: 1, why: 'From the right, 4 matches 4; the missing dimension is treated as 1 and stretched to 3.' },
    { q: 'What happens with (3, 4) + (3,)?', opts: ['(3, 4)', '(3, 3)', 'Error', '(4, 3)'], a: 2, why: 'Comparing from the right, 4 and 3 are different and neither is 1.' },
    { q: 'You want to subtract each row’s mean from that row of x (shape (3, 4)). Which is correct?', opts: ['x - x.mean(axis=0)', 'x - x.mean(axis=1)', 'x - x.mean(axis=1, keepdims=True)', 'x - x.mean()'], a: 2, why: 'Row means need shape (3, 1) to broadcast across columns; keepdims gives that.' },
    { q: 'What is the shape of (5, 1) * (1, 6)?', opts: ['(5, 6)', '(1, 1)', '(5, 1)', 'Error'], a: 0, why: 'Each 1 stretches to match the other: 5 rows and 6 columns.' },
    { q: 'Why is (5,) + (5, 1) a classic silent bug?', opts: ['It raises an error', 'It quietly produces a (5, 5) array', 'It returns (5,)', 'It converts to strings'], a: 1, why: 'Both shapes are compatible, so you get a 5 × 5 result instead of the intended 5 values.' },
  ],
  exercise: {
    task: ['Given <code>sales</code> (3 stores × 4 days), compute <code>share</code>: each value divided by its <b>day’s</b> total across all stores (so each column sums to 1).', 'Use broadcasting, not loops.'],
    starter: `import numpy as np

sales = np.array([[12, 15, 9, 20], [30, 25, 28, 35], [8, 6, 10, 7]], dtype=float)

share = sales  # replace with your calculation

print(np.round(share, 3))`,
    check: `assert share.shape == (3, 4)
assert np.allclose(share.sum(axis=0), 1.0), "each column (day) should sum to 1"
assert abs(share[0, 0] - 12 / 50) < 1e-9`,
    solution: `import numpy as np

sales = np.array([[12, 15, 9, 20], [30, 25, 28, 35], [8, 6, 10, 7]], dtype=float)

share = sales / sales.sum(axis=0, keepdims=True)

print(np.round(share, 3))`,
    hint: 'Day totals run down the columns: <code>axis=0</code>. Keep the dimension so the result has shape (1, 4).',
  },
};

// ===================================================================== P0.04
const COLS = ['order_id', 'city', 'category', 'amount'];
const ROWS = [['1001', 'Coimbatore', 'Sarees', '1299'], ['1002', 'Chennai', 'Phones', '15999'], ['1003', 'Coimbatore', 'Bedsheets', '799'], ['1004', 'Madurai', 'Sarees', '2499'], ['1005', 'Coimbatore', 'Phones', '8999']];
const table = (o = {}) => {
  const r = {};
  COLS.forEach((c, j) => { r['h' + j] = { k: 'tile', x: j * 2.5, y: 0, w: 2.3, d: 1.1, h: 0.18, c: 'ink', t: c, fs: 9, top: 1 }; });
  ROWS.forEach((row, i) => row.forEach((v, j) => { r[`r${i}${j}`] = { k: 'tile', x: j * 2.5, y: 1.3 + i * 1.3, w: 2.3, d: 1.1, h: 0.14, c: 'blue', t: v, fs: 9, top: 1, ...(o[`${i}${j}`] || {}) }; }));
  return r;
};
const l4 = {
  id: 'p0-04', title: 'Pandas DataFrames', time: '35 minutes',
  sub: 'Load, select and filter tabular data with pandas, the everyday tool of data work.',
  learn: ['Load a CSV into a DataFrame and inspect it', 'Select columns and filter rows with boolean masks', 'Add calculated columns and check data types'],
  legend: [['#3b4060', 'column names'], [DATA, 'values'], [GOOD, 'selected'], [SIGNAL, 'new column']],
  steps: [
    {
      t: 'A DataFrame is a labelled table', b: ['Five ShopSense orders, loaded from a CSV file. Every column has a name and one data type; every row has an index label.', 'Think of it as a spreadsheet you control with code.'],
      n: 'Dark tiles are column names. Blue tiles are values.',
      s: table(),
    },
    {
      t: 'Select a column', b: ['<code>df["amount"]</code> picks one column. The result is a Series: a single labelled column with its own data type.'],
      n: 'The amount column lifts out. All other columns stay in the table.',
      s: { ...each('r', 0, {}), ...Object.fromEntries([0, 1, 2, 3, 4].map((i) => [`r${i}3`, { c: 'green', z: 0.35 }])), h3: { c: 'green', z: 0.35 } },
    },
    {
      t: 'Filter rows with a condition', b: ['<code>df[df["city"] == "Coimbatore"]</code> keeps only rows where the condition is True. The condition itself is a column of True/False values called a mask.'],
      n: 'Rows from Chennai and Madurai fade out; three Coimbatore orders remain.',
      s: { ...Object.fromEntries([0, 1, 2, 3, 4].map((i) => [`r${i}3`, { c: 'blue', z: 0 }])), h3: { c: 'ink', z: 0 }, ...Object.fromEntries([1, 3].flatMap((i) => [0, 1, 2, 3].map((j) => [`r${i}${j}`, { o: 0.2 }]))), ...Object.fromEntries([0, 2, 4].map((i) => [`r${i}1`, { c: 'green' }])) },
    },
    {
      t: 'Add a calculated column', b: ['<code>df["gst"] = df["amount"] * 0.18</code> adds a new column, computed for every row at once (it is vectorised, like NumPy).'],
      n: 'The new amber column appears at the right for all rows.',
      s: { ...Object.fromEntries([0, 1, 2, 3, 4].flatMap((i) => [0, 1, 2, 3].map((j) => [`r${i}${j}`, { o: 1, c: 'blue' }]))), h4: Tl('gst', 10.0, 0, { c: 'amber', w: 2.3, d: 1.1, h: 0.18, fs: 9 }), ...Object.fromEntries(ROWS.map((r, i) => [`g${i}`, Tl((Number(r[3]) * 0.18).toFixed(2), 10.0, 1.3 + i * 1.3, { c: 'amber', w: 2.3, d: 1.1, h: 0.14, fs: 9 })])) },
    },
    {
      t: 'Check the data types', b: ['<code>df.dtypes</code> shows each column’s type. Here order_id and amount are integers; city and category are text.', 'A number stored as text, such as "1,299", is a common source of bugs. Check types right after loading.'],
      n: 'Wrong types are cheap to fix at load time and expensive to find later.',
      s: { dt: T('dtypes: int64 · str · str · int64 · float64', -1.4, -1.4, { fs: 12.5, b: 1, c: 'blue' }) },
    },
  ],
  math: {
    blocks: [
      { h: 'Boolean mask', sub: 'A filter is a column of True/False', f: 'mask = (city == "Coimbatore")\nresult = rows where mask is True', p: 'Masks can be combined with & (and), | (or) and ~ (not). Wrap each condition in brackets.' },
      { h: 'Mean of a filtered column', f: 'mean = (x₁ + x₂ + … + xₙ) / n   over the kept rows only' },
      { h: 'Calculated column', f: 'gstᵢ = amountᵢ × 0.18   for every row i' },
    ],
    example: {
      intro: 'Average order value in Coimbatore.',
      steps: ['The mask <code>df["city"] == "Coimbatore"</code> is True for orders 1001, 1003 and 1005.', 'Their amounts are 1299, 799 and 8999.', 'Sum: 1299 + 799 + 8999 = <b>11097</b>.', 'Mean: 11097 / 3 = <b>3699.0</b>. In pandas: <code>df.loc[mask, "amount"].mean()</code>.'],
    },
  },
  code: {
    scratch: { why: 'Rows as plain dictionaries, so you see what a DataFrame saves you from.', src: `rows = [
    {"order_id": 1001, "city": "Coimbatore", "category": "Sarees", "amount": 1299},
    {"order_id": 1002, "city": "Chennai", "category": "Phones", "amount": 15999},
    {"order_id": 1003, "city": "Coimbatore", "category": "Bedsheets", "amount": 799},
    {"order_id": 1004, "city": "Madurai", "category": "Sarees", "amount": 2499},
    {"order_id": 1005, "city": "Coimbatore", "category": "Phones", "amount": 8999},
]

cbe = [r for r in rows if r["city"] == "Coimbatore"]
amounts = [r["amount"] for r in cbe]
print("Coimbatore orders:", len(cbe))
print("Average amount:", sum(amounts) / len(amounts))` },
    library: { why: 'The same in pandas: load, inspect, filter, compute.', src: `import io
import pandas as pd

csv = """order_id,city,category,amount
1001,Coimbatore,Sarees,1299
1002,Chennai,Phones,15999
1003,Coimbatore,Bedsheets,799
1004,Madurai,Sarees,2499
1005,Coimbatore,Phones,8999"""

df = pd.read_csv(io.StringIO(csv))
print(df.shape)
print(df.head(3))

mask = df["city"] == "Coimbatore"
print("\\nAverage in Coimbatore:", df.loc[mask, "amount"].mean())

df["gst"] = df["amount"] * 0.18
print(df[["order_id", "amount", "gst"]])` },
    prod: { why: 'A loader that enforces column types and fails loudly on bad input.', src: `import io
import pandas as pd

SCHEMA = {"order_id": "int64", "city": "string", "category": "string", "amount": "int64"}


def load_orders(csv_text: str) -> pd.DataFrame:
    """Load orders and enforce the expected columns and types."""
    df = pd.read_csv(io.StringIO(csv_text), dtype={"city": "string", "category": "string"})
    missing = set(SCHEMA) - set(df.columns)
    if missing:
        raise ValueError(f"missing columns: {sorted(missing)}")
    df = df.astype(SCHEMA)
    if (df["amount"] <= 0).any():
        raise ValueError("amount must be positive")
    return df


def test_load_orders() -> None:
    good = "order_id,city,category,amount\\n1,Chennai,Phones,100"
    assert load_orders(good)["amount"].iloc[0] == 100
    try:
        load_orders("order_id,city,amount\\n1,Chennai,100")
    except ValueError:
        pass
    else:
        raise AssertionError("expected missing-column error")


test_load_orders()
orders = load_orders("order_id,city,category,amount\\n1001,Coimbatore,Sarees,1299\\n1002,Chennai,Phones,15999")
print(orders.dtypes)` },
  },
  industry: {
    when: ['Exploring any tabular dataset up to a few million rows on one machine.', 'Cleaning and preparing features before machine learning.', 'Quick reports and checks during a project.'],
    baseline: 'Load, then immediately check <code>shape</code>, <code>dtypes</code>, <code>head()</code> and missing values before any analysis.',
    tools: ['pandas', 'Jupyter notebooks', 'Polars or DuckDB for larger data (lesson P0.20)', 'pandera for declaring and checking column types'],
    tradeoffs: ['pandas is flexible and popular but loads data into memory.', 'Chained one-liners are compact but hard to debug; name intermediate DataFrames.', 'Notebooks are great for exploring; move reusable logic into tested functions.'],
    failures: ['Numbers read as text because of commas or currency symbols.', 'Modifying a filtered copy and expecting the original to change (use <code>.loc</code>).', 'Leading zeros lost from IDs such as PIN codes when read as integers.'],
    shopsense: 'The Sales Insights Pipeline loads order, product and return tables with an enforced schema exactly like the production example, so bad files fail at the door.',
    interview: [
      ['What is the difference between a Series and a DataFrame?', 'A Series is one labelled column with a single type; a DataFrame is a table of Series sharing the same row index.'],
      ['How do you filter rows by two conditions in pandas?', 'Combine masks with & or |, each in brackets: <code>df[(df.city == "Chennai") & (df.amount > 1000)]</code>.'],
      ['Why use .loc when assigning values?', 'It makes the row and column selection explicit and avoids modifying a temporary copy, which can silently do nothing.'],
    ],
  },
  quiz: [
    { q: 'What does df["amount"] return?', opts: ['A DataFrame with all columns', 'A Series: one labelled column', 'A Python list', 'A NumPy matrix of all values'], a: 1, why: 'Selecting one column with a string returns a Series.' },
    { q: 'Which line keeps only Coimbatore orders?', opts: ['df["Coimbatore"]', 'df[df["city"] == "Coimbatore"]', 'df.city("Coimbatore")', 'df.filter == "Coimbatore"'], a: 1, why: 'The comparison builds a True/False mask; indexing with it keeps matching rows.' },
    { q: 'Amounts for the Coimbatore orders are 1299, 799 and 8999. What is the mean?', opts: ['3699.0', '3700.5', '11097', '2333.3'], a: 0, why: '(1299 + 799 + 8999) / 3 = 11097 / 3 = 3699.0.' },
    { q: 'After loading, amount has dtype "object" (text). What is the likely cause?', opts: ['The file is too large', 'Values contain characters such as commas or ₹ signs', 'pandas always loads text', 'The column name is wrong'], a: 1, why: 'Non-numeric characters force pandas to keep the column as text. Clean them and convert.' },
    { q: 'What should you check first after loading any dataset?', opts: ['Train a model', 'shape, dtypes, head() and missing values', 'Plot a pie chart', 'Delete all rows with missing values'], a: 1, why: 'These four checks catch most loading problems before they spread.' },
  ],
  exercise: {
    task: ['Load the CSV into <code>df</code>. Compute <code>saree_total</code>: the total amount for the <b>Sarees</b> category, and <code>saree_count</code>: how many saree orders there are.'],
    starter: `import io
import pandas as pd

csv = """order_id,city,category,amount
1001,Coimbatore,Sarees,1299
1002,Chennai,Phones,15999
1003,Coimbatore,Bedsheets,799
1004,Madurai,Sarees,2499
1005,Coimbatore,Phones,8999
1006,Chennai,Sarees,1899"""

df = pd.read_csv(io.StringIO(csv))

saree_total = None
saree_count = None

print(saree_total, saree_count)`,
    check: `assert int(saree_total) == 1299 + 2499 + 1899, "sum the amount of Sarees rows only"
assert int(saree_count) == 3`,
    solution: `import io
import pandas as pd

csv = """order_id,city,category,amount
1001,Coimbatore,Sarees,1299
1002,Chennai,Phones,15999
1003,Coimbatore,Bedsheets,799
1004,Madurai,Sarees,2499
1005,Coimbatore,Phones,8999
1006,Chennai,Sarees,1899"""

df = pd.read_csv(io.StringIO(csv))

sarees = df[df["category"] == "Sarees"]
saree_total = sarees["amount"].sum()
saree_count = len(sarees)

print(saree_total, saree_count)`,
    hint: 'Filter first: <code>df[df["category"] == "Sarees"]</code>, then use <code>.sum()</code> and <code>len()</code>.',
  },
};

// ===================================================================== P0.05
const l5 = {
  id: 'p0-05', title: 'Grouping, joins and reshaping', time: '40 minutes',
  sub: 'Aggregate by group, combine tables on a key, and pivot data into the shape a report needs.',
  learn: ['Aggregate with groupby (sum, mean, count)', 'Join two tables on a key and predict the row count', 'Pivot long data into a wide report table'],
  legend: [[DATA, 'orders'], ['#d9cafb', 'products'], [GOOD, 'aggregate'], [BAD, 'duplicate key']],
  steps: [
    {
      t: 'Orders arrive in mixed order', b: ['Six orders from three categories, in the order they happened.'],
      n: 'Colour shows each order’s category.',
      s: row('o', ['Sarees 1299', 'Phones 8999', 'Sarees 2499', 'Bedsheets 799', 'Phones 15999', 'Sarees 1899'], { x: 0, y: 0, dx: 1.9, c: 'blue', w: 1.7, d: 0.85, fs: 8.5 }),
    },
    {
      t: 'groupby sorts rows into groups', b: ['<code>df.groupby("category")</code> splits the rows into one group per category. Nothing is calculated yet; the rows are just sorted into bins.'],
      n: 'Split: each order moves into its category’s bin.',
      s: {
        bS: Z('Sarees', 0.6, 4.2, 2.2, 4.4, { c: 'coral' }), bP: Z('Phones', 4.2, 4.2, 2.2, 4.4, { c: 'violet' }), bB: Z('Bedsheets', 7.8, 4.2, 2.2, 4.4, { c: 'teal' }),
        o0: { x: 0.6, y: 2.8, c: 'coral' }, o2: { x: 0.6, y: 4.2, c: 'coral' }, o5: { x: 0.6, y: 5.6, c: 'coral' },
        o1: { x: 4.2, y: 3.5, c: 'violet' }, o4: { x: 4.2, y: 4.9, c: 'violet' }, o3: { x: 7.8, y: 4.2, c: 'teal' },
      },
    },
    {
      t: 'Then aggregate each group', b: ['<code>.agg(total=("amount", "sum"), orders=("amount", "count"))</code> collapses each group into one row. This pattern is called split–apply–combine.'],
      n: 'Sarees: 1299 + 2499 + 1899 = 5697 from 3 orders.',
      s: { ...off('o', 6), bS: { t: '' }, bP: { t: '' }, bB: { t: '' }, ...bars('t', [5697 / 9600, 24998 / 9600, 799 / 9600], { x: 0.6, y: 4.2, dx: 3.6, w: 0.9, d: 0.9, c: 'green', labels: ['Sarees\n₹5,697 · 3 orders', 'Phones\n₹24,998 · 2 orders', 'Bedsheets\n₹799 · 1 order'] }) },
    },
    {
      t: 'Join adds columns from another table', b: ['A products table has each product’s brand. <code>orders.merge(products, on="product_id")</code> matches rows by the key and adds the brand to every order.'],
      n: 'Lines connect matching keys. Each order should find exactly one product.',
      clear: true,
      s: { ...row('k', ['P1', 'P2', 'P1'], { x: 0, y: 0, dx: 0, dy: 1.6, c: 'blue', w: 1.2, d: 0.9, fs: 10 }), ...row('p', ['P1 · Kanchi', 'P2 · Nova'], { x: 5.6, y: 0.8, dx: 0, dy: 1.6, c: 'violet', w: 2.2, d: 0.9, fs: 9.5 }), ol: T('orders', -1.4, -1.4, { fs: 12, c: 'muted' }), pl: T('products', 4.4, -0.8, { fs: 12, c: 'muted' }) },
      l: { j0: L('k0', 'p0', { c: 'muted', na: 1 }), j1: L('k1', 'p1', { c: 'muted', na: 1 }), j2: L('k2', 'p0', { c: 'muted', na: 1 }) },
    },
    {
      t: 'Duplicate keys multiply rows', b: ['If the products table accidentally lists P1 twice, every P1 order matches twice. Three orders become five rows, and revenue is overstated.', 'Pass <code>validate="many_to_one"</code> so pandas raises an error instead.'],
      n: 'This silent "join explosion" is one of the most common reporting bugs.',
      warn: true,
      s: { p2: Tl('P1 · Kanchi (again)', 5.6, 4.0, { c: 'coral', w: 2.2, d: 0.9, fs: 9, hl: 1 }) },
      l: { j3: L('k0', 'p2', { c: 'coral', na: 1 }), j4: L('k2', 'p2', { c: 'coral', na: 1 }) },
    },
  ],
  math: {
    blocks: [
      { h: 'Group aggregate', sub: 'One value per group g', f: 'total_g = Σ amountᵢ  over rows i in group g\nmean_g  = total_g / n_g', p: 'n_g is the number of rows in group g.' },
      { h: 'Rows after a join', sub: 'For an inner join on key k', f: 'rows = Σₖ n_left(k) × n_right(k)', p: 'If the right table has one row per key, the row count stays the same as the left table. Duplicates multiply it.' },
    ],
    example: {
      intro: 'Predict the row count of a join with a duplicate key.',
      steps: ['Orders: key P1 appears 2 times, P2 once.', 'Products (by mistake): P1 appears 2 times, P2 once.', 'Rows = 2 × 2 (for P1) + 1 × 1 (for P2) = 4 + 1 = <b>5</b>.', 'The orders table had 3 rows, so the join created 2 false rows. <code>validate="many_to_one"</code> would have raised an error.'],
    },
  },
  code: {
    scratch: { why: 'Grouping with a dictionary: the idea behind groupby.', src: `orders = [("Sarees", 1299), ("Phones", 8999), ("Sarees", 2499),
          ("Bedsheets", 799), ("Phones", 15999), ("Sarees", 1899)]

totals, counts = {}, {}
for category, amount in orders:
    totals[category] = totals.get(category, 0) + amount
    counts[category] = counts.get(category, 0) + 1

for category in sorted(totals):
    print(category, totals[category], counts[category])` },
    library: { why: 'groupby, a safe merge, and a pivot table for a report.', src: `import pandas as pd

orders = pd.DataFrame({
    "order_id": [1, 2, 3, 4, 5, 6],
    "product_id": ["P1", "P2", "P1", "P3", "P2", "P1"],
    "city": ["Coimbatore", "Chennai", "Madurai", "Coimbatore", "Chennai", "Coimbatore"],
    "amount": [1299, 8999, 2499, 799, 15999, 1899],
})
products = pd.DataFrame({
    "product_id": ["P1", "P2", "P3"],
    "category": ["Sarees", "Phones", "Bedsheets"],
})

df = orders.merge(products, on="product_id", how="left", validate="many_to_one")
print(df.groupby("category").agg(total=("amount", "sum"), orders=("amount", "count")))

print(df.pivot_table(index="city", columns="category", values="amount",
                     aggfunc="sum", fill_value=0))` },
    prod: { why: 'A join helper that refuses to explode rows, with a test proving it.', src: `import pandas as pd


def attach_products(orders: pd.DataFrame, products: pd.DataFrame) -> pd.DataFrame:
    """Add product columns to orders. Fails if a product_id is duplicated or unknown."""
    out = orders.merge(products, on="product_id", how="left",
                       validate="many_to_one", indicator=True)
    unknown = out.loc[out["_merge"] == "left_only", "product_id"].unique()
    if len(unknown):
        raise ValueError(f"unknown product ids: {list(unknown)}")
    assert len(out) == len(orders), "join changed the row count"
    return out.drop(columns="_merge")


def test_attach_products() -> None:
    orders = pd.DataFrame({"product_id": ["P1", "P1"], "amount": [10, 20]})
    dup = pd.DataFrame({"product_id": ["P1", "P1"], "category": ["A", "B"]})
    try:
        attach_products(orders, dup)
    except pd.errors.MergeError:
        pass
    else:
        raise AssertionError("expected MergeError for duplicate keys")


test_attach_products()
print("Join checks passed.")` },
  },
  industry: {
    when: ['Every report: totals by category, city, week or customer.', 'Building features such as "orders in the last 30 days per customer".', 'Combining facts (orders) with dimensions (products, customers).'],
    baseline: 'After any join, compare row counts before and after. If they differ unexpectedly, stop and find out why.',
    tools: ['pandas groupby, merge, pivot_table', 'SQL GROUP BY and JOIN in the warehouse', 'dbt for tested, versioned SQL transformations'],
    tradeoffs: ['Doing joins in the warehouse (SQL) scales better; pandas is handier for exploration.', 'Wide pivot tables are easy to read but awkward to analyse further; keep long data for processing.'],
    failures: ['Join explosions from duplicate keys inflating revenue.', 'Inner joins silently dropping rows whose key is missing on one side.', 'Grouping by a column with inconsistent spellings ("chennai" vs "Chennai").'],
    shopsense: 'Weekly GMV by category in the Sales Insights Pipeline is a groupby on orders joined to products, protected by <code>validate="many_to_one"</code>.',
    interview: [
      ['What is split–apply–combine?', 'Split rows into groups by a key, apply an aggregation or transformation to each group, then combine the results into one table. groupby implements it.'],
      ['How can a join increase the number of rows?', 'If the key is duplicated on the right side, each left row matches several right rows. Rows = sum over keys of left count × right count.'],
      ['Inner vs left join?', 'An inner join keeps only keys present in both tables; a left join keeps every left row and fills missing right columns with nulls.'],
    ],
  },
  quiz: [
    { q: 'What does df.groupby("category")["amount"].sum() return?', opts: ['The overall total', 'One total per category', 'The number of categories', 'The first row of each category'], a: 1, why: 'It splits by category and sums amount within each group.' },
    { q: 'Orders have key P1 three times. Products list P1 twice by mistake. How many rows does an inner join produce for P1?', opts: ['3', '5', '6', '2'], a: 2, why: '3 × 2 = 6. Duplicate keys multiply rows.' },
    { q: 'Which merge option makes pandas fail if a product appears twice in the products table?', opts: ['how="inner"', 'validate="many_to_one"', 'sort=True', 'indicator=True'], a: 1, why: 'validate checks the key relationship and raises a MergeError when it is violated.' },
    { q: 'You need a table with cities as rows and categories as columns. Which tool fits?', opts: ['merge', 'pivot_table', 'dropna', 'astype'], a: 1, why: 'pivot_table reshapes long data into a wide summary table.' },
    { q: 'After a left join, row count went from 10,000 to 10,400. What should you do?', opts: ['Ignore it', 'Investigate duplicate keys in the right table', 'Drop 400 random rows', 'Switch to an inner join'], a: 1, why: 'Extra rows from a left join almost always mean duplicated keys on the right.' },
  ],
  exercise: {
    task: ['Compute <code>by_city</code>: total amount per city as a Series, <b>sorted from highest to lowest</b>.'],
    starter: `import pandas as pd

orders = pd.DataFrame({
    "city": ["Coimbatore", "Chennai", "Madurai", "Coimbatore", "Chennai", "Coimbatore"],
    "amount": [1299, 8999, 2499, 799, 15999, 1899],
})

by_city = None

print(by_city)`,
    check: `assert list(by_city.index) == ["Chennai", "Coimbatore", "Madurai"], "sort from highest to lowest"
assert by_city["Chennai"] == 24998 and by_city["Coimbatore"] == 3997 and by_city["Madurai"] == 2499`,
    solution: `import pandas as pd

orders = pd.DataFrame({
    "city": ["Coimbatore", "Chennai", "Madurai", "Coimbatore", "Chennai", "Coimbatore"],
    "amount": [1299, 8999, 2499, 799, 15999, 1899],
})

by_city = orders.groupby("city")["amount"].sum().sort_values(ascending=False)

print(by_city)`,
    hint: 'Group by city, select amount, sum, then <code>.sort_values(ascending=False)</code>.',
  },
};

export default [l1, l2, l3, l4, l5];
