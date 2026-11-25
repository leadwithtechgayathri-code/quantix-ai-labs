import { B, Tl, O, T, Z, S, P, Cy, Bub, L, row, bars, off, mg } from '../kit.js';

const DATA = '#c4cdfb', GOOD = '#c1e4b1', BAD = '#ffc4b1', SIGNAL = '#fddf98', MODEL = '#d9cafb', SYS = '#b2e5da';

// ===================================================================== P0.16
// 10 × 10 grid, each tile = 10 orders (1,000 orders). 1 fraud tile, 5 false-alarm tiles.
const FA = new Set(['14', '27', '43', '68', '85']);
const grid = (fn) => {
  const o = {};
  for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) o[`g${i}${j}`] = { k: 'tile', x: j * 0.62, y: i * 0.62, w: 0.54, d: 0.54, h: 0.1, c: 'blue', ...(fn ? fn(i, j) : {}) };
  return o;
};
const l16 = {
  id: 'p0-16', title: 'Probability and Bayes', time: '40 minutes',
  sub: 'Reason with conditional probability and update beliefs with evidence, including why a "99% accurate" alarm is usually wrong.',
  learn: ['Compute conditional probabilities from counts', 'Apply Bayes’ rule to update a belief after evidence', 'Explain base rates and why rare events cause many false alarms'],
  legend: [[DATA, 'genuine order'], [BAD, 'fraud'], [SIGNAL, 'false alarm']],
  steps: [
    {
      t: '1,000 orders', b: ['Each tile stands for 10 orders, so the grid is 1,000 orders. Past data says 1% are fraudulent: 10 orders, one tile.'],
      n: 'The base rate, 1%, is the starting belief before any evidence.',
      s: grid((i, j) => (i === 0 && j === 0 ? { c: 'coral' } : {})),
    },
    {
      t: 'A fraud detector checks every order', b: ['The detector catches 99% of fraud (sensitivity) and wrongly flags 5% of genuine orders (false-positive rate).', 'It sounds excellent. Let’s count what it flags.'],
      n: 'Two different error rates: missing fraud, and accusing genuine customers.',
      s: { det: B('fraud\ndetector', 8.6, 2.8, { c: 'teal', w: 1.4, d: 1.4, h: 0.9, fs: 10 }) },
    },
    {
      t: 'Count the flags', b: ['Of 10 fraud orders it flags about 9.9: the coral tile. Of 990 genuine orders it flags 5%, about 49.5: five amber tiles.', 'About 59 orders are flagged in total.'],
      n: 'Genuine orders vastly outnumber fraud, so even a small false-alarm rate produces many flags.',
      s: grid((i, j) => (i === 0 && j === 0 ? { c: 'coral', hl: 1 } : FA.has(`${i}${j}`) ? { c: 'amber', hl: 1 } : { o: 0.35 })),
    },
    {
      t: 'Given a flag, how likely is fraud?', b: ['Among flagged orders, only about 9.9 of 59.4 are fraud: <b>P(fraud | flag) ≈ 17%</b>.', 'So five out of six flagged orders are genuine customers. Blocking them all would anger many people.'],
      n: 'This is Bayes’ rule: rare events plus a small error rate give mostly false alarms.',
      warn: true,
      s: { res: T('P(fraud | flag) = 9.9 / 59.4 ≈ 0.17', 3.0, -1.4, { fs: 14, b: 1, c: 'coral' }) },
    },
    {
      t: 'Use the flag to prioritise, not to punish', b: ['ShopSense sends flagged orders to a human review queue instead of cancelling them. A second signal, such as a new address plus a high-value order, raises the probability further.', 'Each new piece of evidence updates the belief again.'],
      n: 'Bayesian updating: today’s posterior becomes tomorrow’s prior.',
      s: { det: { t: 'review\nqueue', c: 'violet' }, res: { t: 'flags → human review, not auto-cancel', c: 'violet' } },
    },
  ],
  math: {
    blocks: [
      { h: 'Conditional probability', f: 'P(A | B) = P(A and B) / P(B)', p: '"Probability of A given that B happened."' },
      { h: 'Bayes’ rule', f: 'P(A | B) = P(B | A) · P(A) / P(B)\n\nP(B) = P(B | A) P(A) + P(B | not A) P(not A)', p: 'P(A) is the prior, P(B | A) the likelihood, P(A | B) the posterior.' },
    ],
    example: {
      intro: 'Probability an order is fraud, given the detector flagged it.',
      steps: ['Prior P(fraud) = 0.01. Sensitivity P(flag | fraud) = 0.99. False-positive rate P(flag | genuine) = 0.05.', 'P(flag) = 0.99 × 0.01 + 0.05 × 0.99 = 0.0099 + 0.0495 = <b>0.0594</b>.', 'P(fraud | flag) = 0.0099 / 0.0594 ≈ <b>0.167</b>.', 'Only about 1 in 6 flags is real fraud, despite a 99% sensitivity.'],
    },
  },
  code: {
    scratch: { why: 'Bayes’ rule as a function, then the same answer by counting.', src: `def posterior(prior, sensitivity, false_positive_rate):
    p_flag = sensitivity * prior + false_positive_rate * (1 - prior)
    return sensitivity * prior / p_flag


print(f"P(fraud | flag) = {posterior(0.01, 0.99, 0.05):.3f}")

orders = 100_000
fraud = orders * 0.01
flagged_fraud = fraud * 0.99
flagged_genuine = (orders - fraud) * 0.05
print(f"flagged: {flagged_fraud + flagged_genuine:.0f}, of which fraud: {flagged_fraud:.0f}")

for prior in (0.001, 0.01, 0.1):
    print(f"base rate {prior:>5}: posterior {posterior(prior, 0.99, 0.05):.3f}")` },
    library: { why: 'A simulation with NumPy confirms the formula.', src: `import numpy as np

rng = np.random.default_rng(42)
n = 1_000_000
is_fraud = rng.random(n) < 0.01
flag = np.where(is_fraud, rng.random(n) < 0.99, rng.random(n) < 0.05)

print("orders flagged:", int(flag.sum()))
print(f"share of flags that are fraud: {is_fraud[flag].mean():.3f}")
print(f"share of fraud that is flagged: {flag[is_fraud].mean():.3f}")` },
    prod: { why: 'Sequential updating with likelihood ratios, tested against the direct formula.', src: `from math import isclose


def update(prior: float, likelihood_ratio: float) -> float:
    """Update a probability with evidence: posterior odds = prior odds × likelihood ratio."""
    if not 0 < prior < 1:
        raise ValueError("prior must be strictly between 0 and 1")
    odds = prior / (1 - prior) * likelihood_ratio
    return odds / (1 + odds)


def test_update() -> None:
    direct = 0.99 * 0.01 / (0.99 * 0.01 + 0.05 * 0.99)
    assert isclose(update(0.01, 0.99 / 0.05), direct)


test_update()
p = update(0.01, 0.99 / 0.05)        # detector flag
print(f"after flag: {p:.3f}")
p = update(p, 4.0)                    # new address on a high-value order (assumed 4× more common in fraud)
print(f"after second signal: {p:.3f}")` },
  },
  industry: {
    when: ['Fraud, spam and anomaly alerts, where the event is rare.', 'Medical and safety tests (Phase 8 healthcare track).', 'Naive Bayes classifiers (Phase 1) and any model that outputs probabilities.'],
    baseline: 'Before judging an alert system, write down the base rate and compute precision: what share of alerts are real.',
    tools: ['Plain Python and NumPy', 'scipy.stats for distributions', 'Confusion matrices (Phase 1)'],
    tradeoffs: ['A lower threshold catches more fraud but creates more false alarms and review cost.', 'Blocking automatically saves review effort but hurts genuine customers.'],
    failures: ['Ignoring the base rate (the base-rate fallacy).', 'Treating P(flag | fraud) as if it were P(fraud | flag).', 'Assuming signals are independent when they are not, which overstates certainty.'],
    shopsense: 'Phase 1 frames fraud and churn alerts with precision and recall; this lesson explains why precision collapses when the event is rare.',
    interview: [
      ['A test is 99% sensitive with a 5% false-positive rate and the condition affects 1%. What is P(condition | positive)?', 'About 17%: 0.0099 / (0.0099 + 0.0495).'],
      ['What is the base-rate fallacy?', 'Judging a probability from the test’s accuracy alone while ignoring how rare the condition is in the first place.'],
      ['How would you handle a fraud model that flags many genuine orders?', 'Route flags to review instead of blocking, tune the threshold against review capacity, and add independent signals to raise precision.'],
    ],
  },
  quiz: [
    { q: 'P(A and B) = 0.06 and P(B) = 0.2. What is P(A | B)?', opts: ['0.012', '0.3', '0.26', '0.06'], a: 1, why: '0.06 / 0.2 = 0.3.' },
    { q: 'Fraud is 1% of orders; the detector catches 99% and flags 5% of genuine orders. About what share of flags are fraud?', opts: ['99%', '50%', '17%', '1%'], a: 2, why: '0.0099 / 0.0594 ≈ 0.167.' },
    { q: 'In Bayes’ rule, what is the prior?', opts: ['The probability after seeing evidence', 'The belief before seeing evidence', 'The test’s sensitivity', 'The false-positive rate'], a: 1, why: 'The prior is updated by evidence into the posterior.' },
    { q: 'If fraud became ten times more common (10%), the share of flags that are fraud would…', opts: ['Fall', 'Stay the same', 'Rise', 'Become exactly 99%'], a: 2, why: 'A higher base rate raises the posterior (to about 69%).' },
    { q: 'What is the safest use of a fraud flag with 17% precision?', opts: ['Cancel every flagged order', 'Send flags to human review', 'Ignore it', 'Charge flagged customers a fee'], a: 1, why: 'Most flags are genuine; review avoids harming good customers.' },
  ],
  exercise: {
    task: ['Write <code>posterior(prior, sensitivity, fpr)</code> using Bayes’ rule. Then compute <code>p</code>: the probability that a review is fake given the spam filter flags it, when 4% of reviews are fake, the filter catches 90% of fakes, and wrongly flags 2% of real reviews.'],
    starter: `def posterior(prior, sensitivity, fpr):
    pass


p = posterior(0.04, 0.90, 0.02)
print(p)`,
    check: `assert abs(posterior(0.01, 0.99, 0.05) - 0.16667) < 1e-4
assert abs(p - 0.036 / (0.036 + 0.0192)) < 1e-9, "P(flag) = 0.9 × 0.04 + 0.02 × 0.96"`,
    solution: `def posterior(prior, sensitivity, fpr):
    p_flag = sensitivity * prior + fpr * (1 - prior)
    return sensitivity * prior / p_flag


p = posterior(0.04, 0.90, 0.02)
print(round(p, 3))`,
    hint: 'P(flag) = sensitivity × prior + fpr × (1 − prior). Then divide the true-positive part by it.',
  },
};

// ===================================================================== P0.17
const pois = (lam, k) => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return Math.exp(-lam) * lam ** k / f; };
const binom = (n, p, k) => { let c = 1; for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1); return c * p ** k * (1 - p) ** (n - k); };
const normal = (x, m, s) => Math.exp(-0.5 * ((x - m) / s) ** 2);
const l17 = {
  id: 'p0-17', title: 'Distributions', time: '35 minutes',
  sub: 'Recognise the shapes data comes in, normal, binomial, Poisson and skewed, and pick the right one to model a quantity.',
  learn: ['Recognise normal, binomial, Poisson and skewed data from histograms', 'Match a business quantity to a sensible distribution', 'Compute probabilities with a distribution’s formula or library'],
  legend: [[DATA, 'probability or frequency'], [SIGNAL, 'highlighted value'], [BAD, 'long tail']],
  steps: [
    {
      t: 'Orders per minute: Poisson', b: ['At 3 p.m. ShopSense receives on average 4 orders per minute, each arriving independently. Counts like this follow a Poisson distribution with λ = 4.', 'Bars show the probability of 0, 1, 2 … 10 orders in a minute.'],
      n: 'Poisson fits counts of independent events in a fixed window: orders per minute, support tickets per hour.',
      s: mg(bars('p', Array.from({ length: 11 }, (_, k) => pois(4, k) * 12), { x: 0, y: 0, dx: 0.75, w: 0.5, d: 0.5, c: 'blue' }), { p4: { c: 'amber' }, pl: T('Poisson, λ = 4 orders per minute', 1.2, -2.4, { z: 3.2, fs: 12.5, b: 1 }), p0: { sub: '0' }, p4x: T('4', 3.0, 0.9, { fs: 11, c: 'muted' }), p10: { sub: '10' } }),
    },
    {
      t: 'Buyers out of 20 visitors: binomial', b: ['Each of 20 visitors to a product page buys with probability 0.1, independently. The number who buy follows a binomial distribution, n = 20, p = 0.1.', 'Two buyers is the most likely outcome.'],
      n: 'Binomial fits "how many successes in n tries": conversions, clicks, defects in a batch.',
      clear: true,
      s: mg(bars('b', Array.from({ length: 9 }, (_, k) => binom(20, 0.1, k) * 10), { x: 0, y: 0, dx: 0.8, w: 0.55, d: 0.55, c: 'blue' }), { b2: { c: 'amber' }, bl: T('Binomial, n = 20, p = 0.1', 1.2, -2.4, { z: 3.4, fs: 12.5, b: 1 }), b0: { sub: '0' }, b8: { sub: '8' } }),
    },
    {
      t: 'Delivery time: roughly normal', b: ['Delivery times within Coimbatore average 48 hours with a standard deviation of 8. Many small delays add up, so the shape is close to a bell curve: the normal distribution.', 'About 68% of deliveries fall within one standard deviation: 40 to 56 hours.'],
      n: 'Sums of many small independent effects tend towards normal: the central limit theorem (next lesson).',
      clear: true,
      s: mg(bars('n', Array.from({ length: 13 }, (_, k) => normal(24 + k * 4, 48, 8) * 2.6), { x: 0, y: 0, dx: 0.6, w: 0.45, d: 0.45, c: 'blue' }), { n4: { c: 'amber' }, n5: { c: 'amber' }, n6: { c: 'amber' }, n7: { c: 'amber' }, n8: { c: 'amber' }, nl: T('Normal, mean 48 h, sd 8 h', 1.4, -2.4, { z: 3.2, fs: 12.5, b: 1 }), n0: { sub: '24 h' }, n6x: T('48 h', 3.0, 1.0, { fs: 11, c: 'muted' }), n12: { sub: '72 h' } }),
    },
    {
      t: 'Order values: right-skewed', b: ['Most orders are small, a few are very large. Money values like this are right-skewed (often close to log-normal). The mean is pulled above the median by the long tail.', 'For skewed data, report the median and percentiles, not only the mean.'],
      n: 'Prices, incomes, order values and response times are usually skewed.',
      warn: true,
      clear: true,
      s: mg(bars('s', [0.9, 2.4, 2.0, 1.4, 0.95, 0.65, 0.45, 0.3, 0.22, 0.16, 0.12, 0.08], { x: 0, y: 0, dx: 0.6, w: 0.45, d: 0.45, c: 'blue' }), { s7: { c: 'coral' }, s8: { c: 'coral' }, s9: { c: 'coral' }, s10: { c: 'coral' }, s11: { c: 'coral' }, sl: T('Order value: median below mean', 1.2, -2.4, { z: 3.2, fs: 12.5, b: 1 }), s0: { sub: 'small' }, s11x: T('large →', 6.9, 1.1, { fs: 11, c: 'coral' }) }),
    },
  ],
  math: {
    blocks: [
      { h: 'Poisson', f: 'P(X = k) = e^(−λ) λᵏ / k!\nmean = variance = λ', p: 'Counts of independent events at a steady average rate.' },
      { h: 'Binomial', f: 'P(X = k) = C(n, k) pᵏ (1 − p)ⁿ⁻ᵏ\nmean = np,  variance = np(1 − p)' },
      { h: 'Normal', f: 'f(x) = (1 / (σ√(2π))) · e^(−(x − μ)² / (2σ²))\n68% within μ ± σ,  95% within μ ± 1.96σ' },
    ],
    example: {
      intro: 'How likely is a minute with no orders when λ = 4?',
      steps: ['Poisson with k = 0: P(X = 0) = e^(−4) × 4⁰ / 0! = e^(−4).', 'e^(−4) ≈ <b>0.0183</b>, about 1.8% of minutes.', 'P(X = 4) = e^(−4) × 4⁴ / 4! = 0.0183 × 256 / 24 ≈ <b>0.195</b>, the most likely count (tied with 3).', 'Monitoring tip: one silent minute is normal; ten silent minutes in a row (0.0183¹⁰) means something is broken.'],
    },
  },
  code: {
    scratch: { why: 'The formulas directly, with math.', src: `from math import comb, exp, factorial


def poisson(k, lam):
    return exp(-lam) * lam ** k / factorial(k)


def binomial(k, n, p):
    return comb(n, k) * p ** k * (1 - p) ** (n - k)


print(f"P(0 orders in a minute) = {poisson(0, 4):.4f}")
print(f"P(4 orders in a minute) = {poisson(4, 4):.4f}")
print(f"P(2 buyers of 20)       = {binomial(2, 20, 0.1):.4f}")
print(f"P(at least 1 buyer)     = {1 - binomial(0, 20, 0.1):.4f}")` },
    library: { why: 'Random draws with NumPy and exact probabilities with SciPy.', src: `import numpy as np
from scipy import stats

rng = np.random.default_rng(1)
orders = rng.poisson(4, size=10_000)
print("simulated share of silent minutes:", (orders == 0).mean())
print("exact:", round(stats.poisson.pmf(0, 4), 4))

values = rng.lognormal(mean=7, sigma=0.8, size=10_000)
print(f"order value mean {values.mean():.0f} vs median {np.median(values):.0f}")

print("P(delivery > 60 h):", round(stats.norm.sf(60, loc=48, scale=8), 4))` },
    prod: { why: 'A monitor that alerts on improbable silence, using the Poisson tail.', src: `from math import exp


def silence_alert(silent_minutes: int, rate_per_minute: float, threshold: float = 1e-6) -> bool:
    """Alert if this many consecutive silent minutes is less likely than threshold."""
    if rate_per_minute <= 0:
        raise ValueError("rate must be positive")
    p = exp(-rate_per_minute) ** silent_minutes
    return p < threshold


def test_silence_alert() -> None:
    assert not silence_alert(1, 4.0)
    assert silence_alert(5, 4.0)          # e^-20 ≈ 2e-9


test_silence_alert()
for m in (1, 2, 3, 4):
    print(m, "silent minutes at 4/min ->", "ALERT" if silence_alert(m, 4.0) else "ok")` },
  },
  industry: {
    when: ['Capacity planning: orders per minute at peak (Poisson).', 'A/B tests on conversions (binomial).', 'Choosing the right summary and model for skewed money data.'],
    baseline: 'Plot a histogram before choosing a model. Check whether the mean equals the variance for counts, and whether money values look skewed.',
    tools: ['NumPy random Generator', 'scipy.stats', 'Histograms in Matplotlib or seaborn'],
    tradeoffs: ['Simple named distributions are easy to reason about but rarely fit perfectly.', 'Empirical distributions fit exactly but can miss rare future extremes.'],
    failures: ['Assuming normality for skewed or heavy-tailed data.', 'Using Poisson when events cluster (festival bursts): the variance is larger than the mean.', 'Planning capacity for the average instead of the 99th percentile.'],
    shopsense: 'Phase 6 load tests use Poisson-like arrivals with festival bursts; Phase 1 forecasts must respect skewed order values.',
    interview: [
      ['Which distribution would you use for the number of orders per minute?', 'Poisson as a first model, checking that the variance is close to the mean; if bursts make it larger, use a negative binomial.'],
      ['Why report the median for order values?', 'Order values are right-skewed; a few large orders pull the mean up, so the median represents a typical order better.'],
      ['What does the central limit theorem say?', 'Means of large enough samples are approximately normally distributed, whatever the shape of the original data (with finite variance).'],
    ],
  },
  quiz: [
    { q: 'Which distribution best fits "support tickets per hour"?', opts: ['Normal', 'Poisson', 'Uniform', 'Binomial with n = 1'], a: 1, why: 'Counts of independent events in a fixed window.' },
    { q: 'With λ = 4, what is P(0 orders in a minute)?', opts: ['0.0183', '0.25', '0', '0.4'], a: 0, why: 'e^(−4) ≈ 0.0183.' },
    { q: 'Out of 20 visitors each buying with p = 0.1, what is the expected number of buyers?', opts: ['0.1', '1', '2', '10'], a: 2, why: 'n × p = 20 × 0.1 = 2.' },
    { q: 'For a right-skewed variable, which is usually true?', opts: ['mean < median', 'mean = median', 'mean > median', 'there is no median'], a: 2, why: 'The long right tail pulls the mean up.' },
    { q: 'About what share of a normal distribution lies within one standard deviation of the mean?', opts: ['50%', '68%', '95%', '99.7%'], a: 1, why: 'The 68–95–99.7 rule.' },
  ],
  exercise: {
    task: ['Write <code>poisson_pmf(k, lam)</code> and use it to compute <code>p_busy</code>: the probability of <b>more than 6</b> orders in a minute when λ = 4.'],
    starter: `from math import exp, factorial


def poisson_pmf(k, lam):
    pass


p_busy = None
print(p_busy)`,
    check: `assert abs(poisson_pmf(0, 4) - exp(-4)) < 1e-12
assert abs(p_busy - (1 - sum(poisson_pmf(k, 4) for k in range(7)))) < 1e-12
assert 0.10 < p_busy < 0.12, "P(X > 6) for λ = 4 is about 0.111"`,
    solution: `from math import exp, factorial


def poisson_pmf(k, lam):
    return exp(-lam) * lam ** k / factorial(k)


p_busy = 1 - sum(poisson_pmf(k, 4) for k in range(7))
print(round(p_busy, 4))`,
    hint: 'P(X > 6) = 1 − P(X ≤ 6) = 1 − (P(0) + P(1) + … + P(6)).',
  },
};

// ===================================================================== P0.18
const l18 = {
  id: 'p0-18', title: 'Statistics and sampling', time: '40 minutes',
  sub: 'Estimate from samples, measure how uncertain the estimate is, and know when the mean misleads.',
  learn: ['Explain the difference between a population and a sample', 'Compute the standard error and a 95% confidence interval for a mean', 'Choose mean or median for skewed business data'],
  legend: [[DATA, 'population'], [SIGNAL, 'sample'], [GOOD, 'estimate']],
  steps: [
    {
      t: 'A population we cannot fully see', b: ['ShopSense wants the average order value of all festival-week orders: the population. Analysing every order is slow, so we take a random sample.', 'Each dot is one order; the sample is shown in amber.'],
      n: 'A random sample represents the population; a convenience sample (say, only one city) does not.',
      s: (() => { const o = {}; let s = 3; for (let i = 0; i < 48; i++) { s = (s * 37 + 11) % 101; o['d' + i] = O((i % 8) * 0.8, Math.floor(i / 8) * 0.8, { r: 0.13, c: [5, 12, 19, 22, 30, 37, 41, 46].includes(i) ? 'amber' : 'blue', noshadow: 1, z: (s % 7) * 0.05 }); } return o; })(),
    },
    {
      t: 'Different samples, different answers', b: ['Draw several samples of 400 orders and each gives a slightly different mean: ₹1,512, ₹1,468, ₹1,535 …', 'The estimate itself is random. We need to know how much it wobbles.'],
      n: 'This wobble is sampling variability. It shrinks as samples grow.',
      clear: true,
      s: mg(bars('m', [1.2, 2.0, 2.8, 2.2, 1.0], { x: 0, y: 0, dx: 0.9, w: 0.65, d: 0.65, c: 'amber' }), { ml: T('means of many samples of 400', 0.2, -2.4, { z: 3.4, fs: 12.5, b: 1 }), m0: { sub: '₹1,420' }, m2: { sub: '₹1,500' }, m4: { sub: '₹1,580' } }),
    },
    {
      t: 'The standard error', b: ['The sample means form their own distribution, centred on the true mean. Its spread is the standard error: <code>SE = s / √n</code>.', 'With s = ₹800 and n = 400, SE = 800 / 20 = <b>₹40</b>.'],
      n: 'Four times the data halves the standard error. Precision gets expensive.',
      s: { sel: T('SE = 800 / √400 = ₹40', 1.8, 3.2, { fs: 13, b: 1, c: 'green' }) },
    },
    {
      t: 'A 95% confidence interval', b: ['Mean ± 1.96 × SE. With a sample mean of ₹1,512: 1,512 ± 78.4, so <b>₹1,434 to ₹1,590</b>.', 'Read it as: the method we used captures the true mean in 95% of samples.'],
      n: 'Always report an estimate with its interval. "₹1,512" alone hides the uncertainty.',
      s: { ci: S(1.8, 1.2, 3.4, 0.3, { c: 'green', h: 0.08 }), cil: T('95% CI: ₹1,434 – ₹1,590', 1.8, 2.3, { fs: 12.5, b: 1, c: 'green' }), sel: null },
    },
    {
      t: 'Mean or median?', b: ['Order values are skewed (P0.17). A few huge orders inflate the mean; the median shows the typical order.', 'Report both when they differ much, and say which one a KPI uses.'],
      n: 'In the Phase 0 project, average order value is reported as the median, with the mean alongside.',
      warn: true,
      clear: true,
      s: mg(bars('s', [0.9, 2.4, 2.0, 1.4, 0.95, 0.65, 0.45, 0.3, 0.22, 0.16], { x: 0, y: 0, dx: 0.6, w: 0.45, d: 0.45, c: 'blue' }), { med: B('', 1.2, 0.7, { c: 'green', w: 0.08, d: 0.08, h: 3.0, noshadow: 1 }), mean: B('', 2.5, 0.7, { c: 'coral', w: 0.08, d: 0.08, h: 3.0, noshadow: 1 }), mdl: T('median', 1.2, 0.7, { z: 3.3, fs: 12.5, b: 1, c: 'green' }), mnl: T('mean', 2.5, 0.7, { z: 3.3, fs: 12.5, b: 1, c: 'coral' }) }),
    },
  ],
  math: {
    blocks: [
      { h: 'Sample statistics', f: 'x̄ = Σxᵢ / n\ns = √( Σ(xᵢ − x̄)² / (n − 1) )', p: 'Dividing by n − 1 corrects the bias of estimating spread from a sample.' },
      { h: 'Standard error and CI', f: 'SE = s / √n\n95% CI = x̄ ± 1.96 · SE', p: 'Valid for the mean when n is reasonably large, thanks to the central limit theorem.' },
      { h: 'Sample size for a target precision', f: 'n = (1.96 · s / E)²', p: 'E is the margin of error you can accept.' },
    ],
    example: {
      intro: 'Confidence interval for festival-week average order value.',
      steps: ['Sample: n = 400 orders, mean x̄ = ₹1,512, standard deviation s = ₹800.', 'SE = 800 / √400 = 800 / 20 = <b>₹40</b>.', 'Margin = 1.96 × 40 = <b>₹78.4</b>. CI = 1,512 ± 78.4 = <b>₹1,433.6 to ₹1,590.4</b>.', 'To halve the margin to about ₹39, you need four times the data: n = (1.96 × 800 / 39.2)² = 1,600.'],
    },
  },
  code: {
    scratch: { why: 'Mean, standard deviation, standard error and the interval with the statistics module.', src: `from math import sqrt
from statistics import mean, stdev

n, xbar, s = 400, 1512, 800
se = s / sqrt(n)
print(f"SE = {se:.1f}; 95% CI = ({xbar - 1.96 * se:.1f}, {xbar + 1.96 * se:.1f})")

sample = [799, 1299, 999, 2499, 1499, 899, 8999, 1199, 1599, 1099]
print("mean:", mean(sample), " median:", sorted(sample)[4:6], "-> mid", (sorted(sample)[4] + sorted(sample)[5]) / 2)
print("std dev:", round(stdev(sample), 1))` },
    library: { why: 'Simulate the sampling distribution and check the 95% coverage claim.', src: `import numpy as np

rng = np.random.default_rng(3)
population = rng.lognormal(mean=7.1, sigma=0.5, size=200_000)
true_mean = population.mean()

covered, means = 0, []
for _ in range(2_000):
    s = rng.choice(population, 400, replace=False)
    se = s.std(ddof=1) / np.sqrt(400)
    covered += abs(s.mean() - true_mean) <= 1.96 * se
    means.append(s.mean())

print(f"true mean {true_mean:.0f}; sd of sample means {np.std(means):.1f}")
print(f"intervals that contained the true mean: {covered / 2000:.1%}")
print(f"population mean {true_mean:.0f} vs median {np.median(population):.0f}")` },
    prod: { why: 'A bootstrap interval for the median, where no simple formula exists.', src: `import numpy as np


def bootstrap_ci(x: np.ndarray, stat=np.median, n_boot: int = 2000, level: float = 0.95, seed: int = 0):
    """Percentile bootstrap confidence interval for any statistic."""
    if len(x) < 20:
        raise ValueError("need at least 20 observations")
    rng = np.random.default_rng(seed)
    boots = np.array([stat(rng.choice(x, len(x), replace=True)) for _ in range(n_boot)])
    lo, hi = np.percentile(boots, [(1 - level) / 2 * 100, (1 + level) / 2 * 100])
    return float(stat(x)), float(lo), float(hi)


rng = np.random.default_rng(5)
orders = rng.lognormal(mean=7.1, sigma=0.6, size=500)
est, lo, hi = bootstrap_ci(orders)
print(f"median order value {est:.0f} (95% CI {lo:.0f} to {hi:.0f})")` },
  },
  industry: {
    when: ['Any KPI computed from a sample or that varies week to week.', 'Deciding whether a change in a metric is real or noise.', 'Planning how much data a survey or test needs.'],
    baseline: 'Report every estimate with a confidence interval and the sample size. Use the bootstrap when no formula fits.',
    tools: ['statistics and NumPy', 'scipy.stats', 'Bootstrap helpers (scipy.stats.bootstrap)'],
    tradeoffs: ['Larger samples give tighter intervals but cost time and money.', 'Medians resist outliers but are harder to combine across groups than means.'],
    failures: ['Biased samples (only app users, only one city) that no sample size can fix.', 'Reporting point estimates with no uncertainty.', 'Using the mean for heavily skewed money data.'],
    shopsense: 'The Phase 0 dashboard shows median order value with an interval, so Jones can tell a real change from weekly noise.',
    interview: [
      ['What is a standard error?', 'The standard deviation of an estimate across repeated samples. For a mean it is s / √n.'],
      ['How do you interpret a 95% confidence interval?', 'If we repeated the sampling many times, 95% of intervals built this way would contain the true value.'],
      ['How would you get a confidence interval for a median?', 'Use the bootstrap: resample the data with replacement many times, compute the median each time, and take percentiles.'],
    ],
  },
  quiz: [
    { q: 's = 800 and n = 400. What is the standard error of the mean?', opts: ['2', '20', '40', '800'], a: 2, why: '800 / √400 = 800 / 20 = 40.' },
    { q: 'To halve the standard error, you need about…', opts: ['Twice the data', 'Four times the data', 'Half the data', 'The same data'], a: 1, why: 'SE ∝ 1/√n, so n must grow fourfold.' },
    { q: 'Mean ₹1,512 with SE ₹40. What is the 95% CI?', opts: ['₹1,472 – ₹1,552', '₹1,433.6 – ₹1,590.4', '₹1,312 – ₹1,712', '₹1,500 – ₹1,524'], a: 1, why: '1,512 ± 1.96 × 40 = 1,512 ± 78.4.' },
    { q: 'A survey only of app users estimates satisfaction for all customers. The main problem is…', opts: ['Too small a sample', 'Selection bias', 'Rounding', 'The median'], a: 1, why: 'The sample does not represent the population, whatever its size.' },
    { q: 'Which is the better "typical order" summary for skewed order values?', opts: ['Mean', 'Median', 'Maximum', 'Sum'], a: 1, why: 'The median resists the long right tail.' },
  ],
  exercise: {
    task: ['Write <code>mean_ci(values)</code> returning <code>(mean, low, high)</code> for a 95% CI using s / √n and 1.96. Use <code>statistics.stdev</code> for s.'],
    starter: `from math import sqrt
from statistics import mean, stdev


def mean_ci(values):
    pass


print(mean_ci([1200, 1500, 1300, 1700, 1400, 1600, 1100, 1800, 1500, 1400]))`,
    check: `m, lo, hi = mean_ci([1200, 1500, 1300, 1700, 1400, 1600, 1100, 1800, 1500, 1400])
assert m == 1450
se = stdev([1200, 1500, 1300, 1700, 1400, 1600, 1100, 1800, 1500, 1400]) / sqrt(10)
assert abs(lo - (1450 - 1.96 * se)) < 1e-9 and abs(hi - (1450 + 1.96 * se)) < 1e-9`,
    solution: `from math import sqrt
from statistics import mean, stdev


def mean_ci(values):
    m = mean(values)
    se = stdev(values) / sqrt(len(values))
    return m, m - 1.96 * se, m + 1.96 * se


print(mean_ci([1200, 1500, 1300, 1700, 1400, 1600, 1100, 1800, 1500, 1400]))`,
    hint: 'SE = stdev(values) / sqrt(len(values)); the interval is mean ± 1.96 × SE.',
  },
};

// ===================================================================== P0.19
const l19 = {
  id: 'p0-19', title: 'Hypothesis tests and A/B tests', time: '45 minutes',
  sub: 'Decide whether a change really moved a metric, with p-values and confidence intervals, and avoid the traps that create false wins.',
  learn: ['Set up an A/B test with a null hypothesis and a pre-chosen sample size', 'Run a two-proportion z-test and read the p-value and confidence interval', 'Explain why peeking early inflates false wins'],
  legend: [[DATA, 'version A (control)'], [MODEL, 'version B (new)'], [GOOD, 'significant'], [BAD, 'false win risk']],
  steps: [
    {
      t: 'Split traffic at random', b: ['ShopSense tests a one-page checkout (B) against the current checkout (A). Visitors are randomly assigned, 10,000 to each.', 'Randomisation makes the groups alike in every other way, so a difference can be credited to the change.'],
      n: 'Decide the metric (conversion) and sample size before starting.',
      s: { door: B('random\nsplit', 0, 1.6, { c: 'slate', w: 1.2, d: 1.2, h: 0.8, fs: 10 }), A: B('A · current\n10,000 visitors', 3.6, 0, { c: 'blue', w: 2.0, d: 1.2, h: 0.6, fs: 10 }), Bv: B('B · one-page\n10,000 visitors', 3.6, 3.2, { c: 'violet', w: 2.0, d: 1.2, h: 0.6, fs: 10 }) },
      l: { a: L('door', 'A', { flow: 1 }), b: L('door', 'Bv', { flow: 1, c: 'violet' }) },
    },
    {
      t: 'Results: 4.0% vs 4.6%', b: ['A converts 400 of 10,000 (4.0%). B converts 460 of 10,000 (4.6%). B looks better by 0.6 percentage points.', 'But even two identical checkouts would differ a little by chance. Is 0.6 points more than chance?'],
      n: 'The null hypothesis says "no real difference". The test asks how surprising the data would be if that were true.',
      s: mg(bars('r', [4.0 / 2.6, 4.6 / 2.6], { x: 8.4, y: 0.0, dy: 3.2, dx: 0, w: 0.9, d: 0.9, c: 'blue', labels: ['4.0%', '4.6%'] }), { r1: { c: 'violet' } }),
      l: { ra: L('A', 'r0', { c: 'muted', na: 1 }), rb: L('Bv', 'r1', { c: 'muted', na: 1 }) },
    },
    {
      t: 'Two overlapping distributions', b: ['Each conversion rate has a standard error of about 0.2 points. Drawn as distributions, A and B overlap, but their centres are about 2 standard errors apart.', 'The z-test gives z ≈ 2.09 and a p-value ≈ 0.037.'],
      n: 'p = 0.037 means: if there were no real difference, a gap this large would appear about 3.7% of the time.',
      clear: true,
      s: mg(bars('a', [0.3, 1.0, 2.2, 2.8, 2.2, 1.0, 0.3], { x: 0, y: 0, dx: 0.55, w: 0.42, d: 0.42, c: 'blue', o: 0.85 }), bars('b', [0.3, 1.0, 2.2, 2.8, 2.2, 1.0, 0.3], { x: 1.65, y: 1.6, dx: 0.55, w: 0.42, d: 0.42, c: 'violet', o: 0.85 }), { al: T('A: 4.0% ± 0.2', 0.6, -1.3, { z: 3, fs: 12, b: 1, c: 'blue' }), bl: T('B: 4.6% ± 0.2', 4.8, 0.6, { z: 3, fs: 12, b: 1, c: 'violet' }), zl: T('z ≈ 2.09,  p ≈ 0.037', 2.4, 4.4, { fs: 13, b: 1, c: 'green' }) }),
    },
    {
      t: 'The confidence interval tells you more', b: ['The 95% CI for the lift is <b>+0.04 to +1.16 points</b>. It excludes zero, so the result is significant at the 5% level.', 'But the lift could be tiny (0.04) or large (1.16). Is the low end still worth the engineering cost? That is a business call.'],
      n: 'Statistically significant does not mean big. Always read the interval.',
      s: { ci: S(2.4, 5.6, 4.2, 0.3, { c: 'green', h: 0.08 }), cil: T('lift: +0.04 to +1.16 points', 2.4, 6.6, { fs: 12.5, b: 1, c: 'green' }) },
    },
    {
      t: 'Peeking creates false wins', b: ['If you check the p-value every day and stop the first time it dips below 0.05, you will "find" winners far more than 5% of the time, even when nothing changed.', 'Fix the sample size in advance, or use a sequential method designed for peeking.'],
      n: 'Simulations (in the code tab) show daily peeking raises false wins from 5% to well over 15%.',
      warn: true,
      clear: true,
      s: mg(bars('f', [0.5, 1.9], { x: 0, y: 0, dx: 2.6, w: 1.1, d: 1.1, c: 'green', labels: ['fixed sample: ~5%', 'daily peeking: much higher'] }), { f1: { c: 'coral' }, fl: T('false-win rate when A and B are identical', 1.3, -1.4, { z: 2.2, fs: 12.5, b: 1 }) }),
    },
  ],
  math: {
    blocks: [
      { h: 'Two-proportion z-test', f: 'p̂ = (x_A + x_B) / (n_A + n_B)\nSE = √( p̂ (1 − p̂) (1/n_A + 1/n_B) )\nz = (p̂_B − p̂_A) / SE', p: 'The pooled p̂ is the conversion rate if the null hypothesis (no difference) were true.' },
      { h: 'p-value and CI', f: 'two-sided p = 2 · P(Z > |z|)\nCI = (p̂_B − p̂_A) ± 1.96 · √( p̂_A(1−p̂_A)/n_A + p̂_B(1−p̂_B)/n_B )' },
      { h: 'Errors', f: 'Type I (false win): reject a true null; rate α, usually 0.05\nType II (missed win): fail to detect a real effect; power = 1 − β' },
    ],
    example: {
      intro: 'A: 400 / 10,000 convert. B: 460 / 10,000 convert.',
      steps: ['Rates: p̂_A = 0.040, p̂_B = 0.046, difference = <b>0.006</b>. Pooled p̂ = 860 / 20,000 = 0.043.', 'SE = √(0.043 × 0.957 × (1/10,000 + 1/10,000)) = √(8.23 × 10⁻⁶) ≈ <b>0.00287</b>.', 'z = 0.006 / 0.00287 ≈ <b>2.09</b>; two-sided p ≈ <b>0.037</b>.', 'CI: unpooled SE ≈ 0.00287, so 0.006 ± 1.96 × 0.00287 = <b>0.0004 to 0.0116</b>, i.e. +0.04 to +1.16 points.'],
    },
  },
  code: {
    scratch: { why: 'The z-test with only the math module.', src: `from math import erfc, sqrt

xa, na, xb, nb = 400, 10_000, 460, 10_000
pa, pb = xa / na, xb / nb
pooled = (xa + xb) / (na + nb)
se = sqrt(pooled * (1 - pooled) * (1 / na + 1 / nb))
z = (pb - pa) / se
p_value = erfc(abs(z) / sqrt(2))          # two-sided

se_diff = sqrt(pa * (1 - pa) / na + pb * (1 - pb) / nb)
lo, hi = (pb - pa) - 1.96 * se_diff, (pb - pa) + 1.96 * se_diff
print(f"z = {z:.3f}, p = {p_value:.4f}")
print(f"lift = {100 * (pb - pa):.2f} points, 95% CI ({100 * lo:.2f}, {100 * hi:.2f})")` },
    library: { why: 'SciPy for the p-value, and a simulation showing the peeking problem.', src: `import numpy as np
from scipy import stats

z = (0.046 - 0.040) / np.sqrt(0.043 * 0.957 * 2 / 10_000)
print(f"p-value: {2 * stats.norm.sf(abs(z)):.4f}")

rng = np.random.default_rng(0)
def false_win_rate(peek_daily, tests=1000, days=20, per_day=500, p=0.04):
    wins = 0
    for _ in range(tests):
        a = rng.binomial(per_day, p, days).cumsum()
        b = rng.binomial(per_day, p, days).cumsum()
        n = per_day * np.arange(1, days + 1)
        pool = (a + b) / (2 * n)
        zs = (b - a) / n / np.sqrt(pool * (1 - pool) * 2 / n)
        checks = zs if peek_daily else zs[-1:]
        wins += np.any(np.abs(checks) > 1.96)
    return wins / tests

print(f"false wins, fixed sample : {false_win_rate(False):.1%}")
print(f"false wins, daily peeking: {false_win_rate(True):.1%}")` },
    prod: { why: 'A tested A/B analysis function that also enforces the planned sample size.', src: `from dataclasses import dataclass
from math import erfc, sqrt


@dataclass(frozen=True)
class ABResult:
    lift: float
    ci_low: float
    ci_high: float
    p_value: float
    significant: bool


def analyse_ab(xa: int, na: int, xb: int, nb: int, planned_n: int, alpha: float = 0.05) -> ABResult:
    if min(na, nb) < planned_n:
        raise ValueError(f"stopped early: planned {planned_n} per arm, have {min(na, nb)}")
    pa, pb = xa / na, xb / nb
    pool = (xa + xb) / (na + nb)
    z = (pb - pa) / sqrt(pool * (1 - pool) * (1 / na + 1 / nb))
    p = erfc(abs(z) / sqrt(2))
    se = sqrt(pa * (1 - pa) / na + pb * (1 - pb) / nb)
    return ABResult(round(pb - pa, 4), round(pb - pa - 1.96 * se, 4), round(pb - pa + 1.96 * se, 4), round(p, 4), p < alpha)


try:
    analyse_ab(200, 5_000, 240, 5_000, planned_n=10_000)
except ValueError as e:
    print("Refused:", e)
print(analyse_ab(400, 10_000, 460, 10_000, planned_n=10_000))` },
  },
  industry: {
    when: ['Any product change whose effect on a metric you need to prove: checkout, ranking, prices, recommendations.', 'Comparing a new model against the current one in production (Phase 6).', 'Deciding whether a KPI change is real or noise.'],
    baseline: 'Write the test plan first: metric, minimum effect worth detecting, sample size, duration and stopping rule. Then run it untouched.',
    tools: ['scipy.stats and statsmodels', 'Experimentation platforms (GrowthBook, Optimizely, in-house tools)', 'Power calculators for sample size'],
    tradeoffs: ['Lower α means fewer false wins but needs more traffic.', 'Longer tests are more reliable but delay decisions; sequential methods help.', 'Testing many metrics at once raises false wins unless corrected.'],
    failures: ['Peeking and stopping early.', 'Sample ratio mismatch: the split is not really 50/50 because of a bug.', 'Novelty effects that fade after a week.', 'Declaring a "significant" lift that is too small to matter.'],
    shopsense: 'Phase 1 and Phase 6 evaluate model changes with A/B tests on conversion and churn, using pre-registered plans.',
    interview: [
      ['What does a p-value of 0.03 mean?', 'If there were truly no difference, data at least this extreme would occur 3% of the time. It is not the probability that the null is true.'],
      ['Why is peeking at an A/B test a problem?', 'Each look is another chance to cross the threshold by luck, so the overall false-positive rate rises well above α.'],
      ['How do you choose an A/B test’s sample size?', 'From the baseline rate, the minimum detectable effect, α and the desired power (often 80%), using a power calculation.'],
    ],
  },
  quiz: [
    { q: 'A converts 400/10,000 and B 460/10,000. What is the lift?', opts: ['0.6 percentage points', '6 percentage points', '15%', '60 points'], a: 0, why: '4.6% − 4.0% = 0.6 points (a 15% relative lift).' },
    { q: 'p = 0.037. Which statement is correct?', opts: ['There is a 3.7% chance B is worse', 'If there were no difference, a gap this large would appear about 3.7% of the time', 'B is 3.7% better', 'The test failed'], a: 1, why: 'The p-value is computed assuming the null hypothesis is true.' },
    { q: 'The 95% CI for the lift is +0.04 to +1.16 points. What can you say?', opts: ['The lift is exactly 0.6 points', 'The result is significant but the true lift could be small', 'The result is not significant', 'B is worse'], a: 1, why: 'The interval excludes zero but its low end is tiny.' },
    { q: 'Why is checking the p-value daily and stopping at the first p < 0.05 a problem?', opts: ['It is slow', 'It inflates the false-win rate', 'It reduces sample size requirements', 'It is required'], a: 1, why: 'Multiple looks give chance more opportunities to cross the threshold.' },
    { q: 'What does random assignment protect against?', opts: ['Small samples', 'Other differences between the groups explaining the result', 'Peeking', 'Rounding errors'], a: 1, why: 'Randomisation balances everything except the change being tested, on average.' },
  ],
  exercise: {
    task: ['Write <code>z_test(xa, na, xb, nb)</code> returning <code>(z, p_value)</code> for a two-sided two-proportion z-test using the pooled standard error. Then test A = 300/6,000 vs B = 345/6,000 and store the result in <code>res</code>.'],
    starter: `from math import erfc, sqrt


def z_test(xa, na, xb, nb):
    pass


res = z_test(300, 6000, 345, 6000)
print(res)`,
    check: `z, p = z_test(400, 10000, 460, 10000)
assert abs(z - 2.0915) < 1e-3 and abs(p - 0.0365) < 1e-3
z2, p2 = res
assert abs(z2 - 1.8215) < 1e-3, "pooled p̂ = 645 / 12000"
assert p2 > 0.05, "this smaller test is not significant at 5%"`,
    solution: `from math import erfc, sqrt


def z_test(xa, na, xb, nb):
    pa, pb = xa / na, xb / nb
    pool = (xa + xb) / (na + nb)
    z = (pb - pa) / sqrt(pool * (1 - pool) * (1 / na + 1 / nb))
    return z, erfc(abs(z) / sqrt(2))


res = z_test(300, 6000, 345, 6000)
print(res)`,
    hint: 'Two-sided p-value: <code>erfc(abs(z) / sqrt(2))</code>.',
  },
};

// ===================================================================== P0.20
const l20 = {
  id: 'p0-20', title: 'Big data on one machine', time: '40 minutes',
  sub: 'Process tens of millions of rows on a laptop with chunking, columnar files and DuckDB, before reaching for a cluster.',
  learn: ['Estimate the memory a dataset needs before loading it', 'Process a file in chunks with constant memory', 'Choose between pandas, DuckDB/Polars and a cluster'],
  legend: [[DATA, 'data'], [BAD, 'too much memory'], [GOOD, 'fits'], [SYS, 'engine']],
  steps: [
    {
      t: 'Ten million orders', b: ['A year of ShopSense orders is 10 million rows: a CSV of about 1.2 GB. Loading it all into pandas can need several times that in RAM.', 'The laptop has 8 GB, and other programs need some of it.'],
      n: 'Estimate memory before loading: rows × columns × bytes per value, then add overhead for text.',
      s: { file: Cy('CSV', 0, 0, { c: 'blue', r: 0.9, h: 1.4, fs: 11, sub: 'orders.csv · 10M rows · 1.2 GB' }), ram: Z('RAM budget 4 GB', 5.0, 0, 3.0, 2.6, { c: 'green' }) },
    },
    {
      t: 'Load it all at once: too big', b: ['pandas reads every row into memory, with strings stored as Python objects. Peak memory can reach 5–10 GB for this file. The laptop starts swapping or the process is killed.'],
      n: 'Coral means over budget. The job may "work" on a small sample and fail on the real file.',
      warn: true,
      s: { big: B('pandas\nfull load\n~6 GB', 5.0, 0, { c: 'coral', w: 2.6, d: 2.2, h: 2.4, fs: 10 }) },
      l: { a: L('file', 'big', { c: 'coral', flow: 1 }) },
    },
    {
      t: 'Stream it in chunks', b: ['Read 1 million rows at a time, aggregate each chunk (for example, GMV by category), keep only the small running totals, and discard the chunk.', 'Memory stays flat no matter how big the file grows.'],
      n: 'Chunking works whenever the answer can be built from partial results: sums, counts, min and max.',
      s: { big: null, ...row('ch', ['1M', '1M', '1M', '…'], { x: 2.2, y: 0.6, dx: 0, dy: 1.1, c: 'blue', w: 0.9, d: 0.8, fs: 10 }), acc: B('running\ntotals', 5.0, 0, { c: 'green', w: 1.4, d: 1.2, h: 0.6, fs: 10 }) },
      l: { a: L('file', 'ch0', { c: 'blue', na: 1 }), b: L('ch1', 'acc', { c: 'green', flow: 1 }) },
    },
    {
      t: 'Columnar files and DuckDB', b: ['Convert the CSV once to Parquet, a compressed columnar format: about 250 MB. A query engine such as DuckDB or Polars reads only the columns it needs and processes them in parallel, out of core.', 'The weekly GMV query runs in seconds within the memory budget.'],
      n: 'Columnar storage plus a vectorised engine is often 10–100× faster than row-by-row CSV processing.',
      clear: true,
      s: { pq: Cy('Parquet', 0, 0, { c: 'teal', r: 0.8, h: 1.0, fs: 10, sub: 'orders.parquet · ~250 MB' }), dk: B('DuckDB\nor Polars', 3.4, 0, { c: 'teal', w: 1.5, d: 1.4, h: 0.9, fs: 10 }), out: Tl('weekly GMV\nby category', 6.6, 0, { c: 'green', w: 1.8, d: 1.2, fs: 9.5 }), ram: Z('RAM budget 4 GB', 3.4, 0, 3.0, 2.6, { c: 'green' }) },
      l: { a: L('pq', 'dk', { flow: 1 }), b: L('dk', 'out', { flow: 1, c: 'green' }) },
    },
    {
      t: 'The scaling ladder', b: ['Step up only when the current step fails: pandas in memory → pandas in chunks → DuckDB or Polars on Parquet → a cluster (Spark, BigQuery) for data that truly cannot fit on one machine.', 'Each step adds cost and complexity.'],
      n: 'Phase 0’s L3 requirement: 10M rows in under 2 minutes within 4 GB, on one machine.',
      clear: true,
      s: mg(bars('st', [0.5, 1.0, 1.6, 2.4], { x: 0, y: 0, dx: 1.9, w: 1.3, d: 1.3, c: 'blue', labels: ['pandas', 'chunks', 'DuckDB / Polars', 'cluster'] }), { st2: { c: 'green' }, st3: { c: 'slate' } }),
    },
  ],
  math: {
    blocks: [
      { h: 'Memory estimate', f: 'memory ≈ rows × Σ(bytes per column)\n\nint64 / float64: 8 bytes\ncategory: ~1–2 bytes + labels\nPython string objects: ~50+ bytes each', p: 'Text columns usually dominate. Converting repeated strings to category saves the most.' },
      { h: 'Chunked aggregation', f: 'total = Σ over chunks (Σ over rows in chunk)\nmean = (Σ sums) / (Σ counts)', p: 'Keep sums and counts, never per-chunk means, to combine correctly.' },
    ],
    example: {
      intro: 'Memory for 10 million order rows.',
      steps: ['Numeric columns: order_id, amount, quantity, timestamp, customer_id, product_id: 6 × 8 bytes = <b>48 bytes per row</b>.', '10,000,000 × 48 bytes = 480,000,000 bytes ≈ <b>480 MB</b>.', 'Two text columns (city, category) as Python strings at about 55 bytes each add 10M × 110 ≈ <b>1.1 GB</b>. As category type they shrink to about 20 MB.', 'Total ≈ 1.6 GB as loaded, or about 0.5 GB with categories, before pandas’ temporary copies during operations (often 2–3× peak).'],
    },
  },
  code: {
    scratch: { why: 'Streaming a CSV line by line with constant memory, using only the standard library.', src: `import csv
import io
import random

random.seed(1)
cats = ["Sarees", "Phones", "Bedsheets"]
buf = io.StringIO()
buf.write("order_id,category,amount\\n")
for i in range(100_000):
    buf.write(f"{i},{random.choice(cats)},{random.randint(200, 20000)}\\n")
buf.seek(0)

totals, counts = {}, {}
for row in csv.DictReader(buf):                 # one row in memory at a time
    c = row["category"]
    totals[c] = totals.get(c, 0) + int(row["amount"])
    counts[c] = counts.get(c, 0) + 1

for c in sorted(totals):
    print(f"{c:10s} orders={counts[c]:6d}  GMV={totals[c]:,}")` },
    library: { why: 'pandas with chunksize: combine sums and counts across chunks.', src: `import io

import numpy as np
import pandas as pd

rng = np.random.default_rng(1)
n = 300_000
df = pd.DataFrame({
    "category": rng.choice(["Sarees", "Phones", "Bedsheets"], n),
    "amount": rng.integers(200, 20_000, n),
})
csv_text = df.to_csv(index=False)

parts = []
for chunk in pd.read_csv(io.StringIO(csv_text), chunksize=100_000, dtype={"category": "category"}):
    parts.append(chunk.groupby("category", observed=True)["amount"].agg(["sum", "count"]))

result = pd.concat(parts).groupby(level=0).sum()
result["mean"] = (result["sum"] / result["count"]).round(1)
print(result)
print("matches full load:", np.allclose(result["sum"].sort_index(), df.groupby("category")["amount"].sum().sort_index()))` },
    prod: { why: 'DuckDB runs SQL directly over a DataFrame or Parquet files, out of core.', src: `import duckdb
import numpy as np
import pandas as pd

rng = np.random.default_rng(1)
n = 1_000_000
orders = pd.DataFrame({
    "order_ts": pd.Timestamp("2026-10-01") + pd.to_timedelta(rng.integers(0, 60 * 24 * 60, n), unit="min"),
    "category": rng.choice(["Sarees", "Phones", "Bedsheets"], n),
    "amount": rng.integers(200, 20_000, n),
})

con = duckdb.connect()
con.execute("SET memory_limit = '1GB'")
weekly = con.execute("""
    SELECT date_trunc('week', order_ts) AS week, category,
           SUM(amount) AS gmv, COUNT(*) AS orders
    FROM orders
    GROUP BY ALL
    ORDER BY week, category
    LIMIT 6
""").df()
print(weekly)` },
  },
  industry: {
    when: ['Data from a few GB to a few hundred GB on one machine.', 'Batch reports and feature pipelines that must run on modest hardware.', 'Before proposing a Spark cluster: prove one machine is not enough.'],
    baseline: 'Measure: file size, row count, memory of a sample with <code>df.memory_usage(deep=True)</code>. Convert to Parquet with proper types, then try DuckDB or Polars.',
    tools: ['pandas chunksize and category dtype', 'Parquet (pyarrow)', 'DuckDB and Polars', 'Spark, BigQuery or Snowflake when data outgrows one machine'],
    tradeoffs: ['Clusters scale further but add cost, operations and latency.', 'Chunking is simple but only works for aggregations that combine.', 'Parquet is fast to read but not human-readable; keep raw files too.'],
    failures: ['Code that works on a sample and runs out of memory on the full file.', 'Averaging per-chunk means instead of combining sums and counts.', 'Reprocessing all history every day instead of loading incrementally.'],
    shopsense: 'L3 of the Sales Insights Pipeline: 10M order rows in under 2 minutes within 4 GB RAM, with incremental daily loads that never double-count.',
    interview: [
      ['How would you process a 50 GB CSV on a laptop?', 'Convert it to Parquet with proper types (streaming), then query with DuckDB or Polars, which read only the needed columns and spill to disk; or aggregate in chunks.'],
      ['Why is Parquet faster than CSV?', 'It is columnar and compressed, stores types, and lets engines skip columns and row groups they do not need.'],
      ['When do you actually need Spark?', 'When data or computation cannot fit on one large machine within time limits, or many jobs must share distributed storage. Many teams reach for it too early.'],
    ],
  },
  quiz: [
    { q: '10 million rows × 6 numeric (8-byte) columns need roughly…', opts: ['48 MB', '480 MB', '4.8 GB', '48 GB'], a: 1, why: '10M × 48 bytes = 480 MB.' },
    { q: 'You aggregate in chunks. How do you get the overall mean correctly?', opts: ['Average the chunk means', 'Sum all chunk sums and divide by the sum of counts', 'Take the last chunk’s mean', 'Take the median of chunk means'], a: 1, why: 'Chunks can have different sizes; combine sums and counts.' },
    { q: 'Why is Parquet usually faster to query than CSV?', opts: ['It is plain text', 'It is columnar, typed and compressed', 'It has no schema', 'It stores one row per file'], a: 1, why: 'Engines read only the needed columns, already typed.' },
    { q: 'Which change saves the most memory for a city column with few distinct values?', opts: ['float64', 'category dtype', 'object dtype', 'Sorting'], a: 1, why: 'Category stores small integer codes plus one copy of each label.' },
    { q: 'What should you try before a Spark cluster for 20 GB of orders?', opts: ['Nothing; use Spark', 'DuckDB or Polars on Parquet on one machine', 'Excel', 'Loading everything into pandas'], a: 1, why: 'One machine with a columnar engine handles this size comfortably.' },
  ],
  exercise: {
    task: ['Process <code>csv_text</code> in chunks of 2 rows with <code>pd.read_csv(..., chunksize=2)</code>. Compute <code>gmv</code>, a dict of total amount per category, and <code>overall_mean</code>, the mean amount across all rows, without loading the whole file at once.'],
    starter: `import io
import pandas as pd

csv_text = """category,amount
Sarees,1299
Phones,8999
Sarees,2499
Bedsheets,799
Phones,15999"""

gmv = {}
overall_mean = None

print(gmv, overall_mean)`,
    check: `assert gmv == {"Sarees": 3798, "Phones": 24998, "Bedsheets": 799}
assert overall_mean == (1299 + 8999 + 2499 + 799 + 15999) / 5, "combine sums and counts, not chunk means"`,
    solution: `import io
import pandas as pd

csv_text = """category,amount
Sarees,1299
Phones,8999
Sarees,2499
Bedsheets,799
Phones,15999"""

gmv, total, count = {}, 0, 0
for chunk in pd.read_csv(io.StringIO(csv_text), chunksize=2):
    for cat, amt in chunk.groupby("category")["amount"].sum().items():
        gmv[cat] = gmv.get(cat, 0) + int(amt)
    total += int(chunk["amount"].sum())
    count += len(chunk)
overall_mean = total / count

print(gmv, overall_mean)`,
    hint: 'Inside the loop add each chunk’s per-category sums to the dict, and keep running <code>total</code> and <code>count</code>.',
  },
};

export default [l16, l17, l18, l19, l20];
