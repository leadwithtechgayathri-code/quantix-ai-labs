// Phase 0 project: Sales Insights Pipeline
const GEN = `import numpy as np
import pandas as pd

CATEGORIES = ["Sarees", "Phones", "Bedsheets", "Kurtas", "Footwear"]
CITIES = ["Coimbatore", "Chennai", "Madurai", "Salem", "Tiruppur"]


def generate_orders(n: int = 20_000, seed: int = 44) -> pd.DataFrame:
    """Synthetic ShopSense orders for October–November 2026, with festival spikes and deliberate problems."""
    rng = np.random.default_rng(seed)
    days = pd.date_range("2026-10-01", "2026-11-30", freq="D", tz="UTC")
    weight = np.where((days >= "2026-11-01") & (days <= "2026-11-08"), 6.0, 1.0)   # Diwali week ≈ 6×
    day = rng.choice(len(days), n, p=weight / weight.sum())
    ts = days[day] + pd.to_timedelta(rng.integers(0, 24 * 60, n), unit="min")
    cat = rng.choice(CATEGORIES, n, p=[0.3, 0.2, 0.2, 0.2, 0.1])
    base = {"Sarees": 7.2, "Phones": 9.2, "Bedsheets": 6.6, "Kurtas": 6.9, "Footwear": 7.0}
    amount = np.round(np.exp(np.array([base[c] for c in cat]) + rng.normal(0, 0.45, n)))
    df = pd.DataFrame({
        "order_id": np.arange(100_001, 100_001 + n),
        "placed_at": ts.strftime("%Y-%m-%d %H:%M"),
        "city": rng.choice(CITIES, n),
        "category": cat,
        "amount": amount,
        "status": rng.choice(["delivered", "cancelled", "returned"], n, p=[0.88, 0.07, 0.05]),
    })
    bulk = rng.choice(n, 8, replace=False)
    df.loc[bulk, "amount"] *= 120                                        # bulk B2B orders
    df.loc[rng.choice(n, 30, replace=False), "amount"] = np.nan          # missing amounts
    return pd.concat([df, df.sample(40, random_state=1)], ignore_index=True)   # duplicate rows


orders = generate_orders()
print(orders.shape)
print(orders.head(3))`;

const L1 = `${GEN.split('\n\n\norders = generate_orders()')[0]}


def weekly_kpis(orders: pd.DataFrame) -> pd.DataFrame:
    """L1: clean, then weekly GMV, orders and median order value by category."""
    df = orders.drop_duplicates("order_id").dropna(subset=["amount"]).copy()
    df["placed_at"] = pd.to_datetime(df["placed_at"], utc=True)
    df["week"] = df["placed_at"].dt.tz_convert("Asia/Kolkata").dt.strftime("%G-W%V")
    sold = df[df["status"] != "cancelled"]
    return (sold.groupby(["week", "category"])["amount"]
                .agg(gmv="sum", orders="count", median_order="median")
                .round(0).reset_index())


kpis = weekly_kpis(generate_orders())
print(kpis[kpis["week"] == "2026-W45"].to_string(index=False))`;

const L2 = `import pandas as pd

REQUIRED = {"order_id", "placed_at", "city", "category", "amount", "status"}
STATUSES = {"delivered", "cancelled", "returned"}
BULK_THRESHOLD = 100_000          # written definition: one order of ₹1 lakh or more is B2B


def validate(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Reject a file with missing columns; quarantine bad rows with a reason."""
    missing = REQUIRED - set(df.columns)
    if missing:
        raise ValueError(f"schema check failed, missing columns: {sorted(missing)}")
    reasons = pd.Series("", index=df.index)
    reasons[df["amount"].isna()] += "missing amount; "
    reasons[df["amount"] <= 0] += "non-positive amount; "
    reasons[~df["status"].isin(STATUSES)] += "unknown status; "
    reasons[pd.to_datetime(df["placed_at"], utc=True, errors="coerce").isna()] += "bad timestamp; "
    bad = reasons != ""
    return df[~bad].copy(), df[bad].assign(reason=reasons[bad])


def gmv(df: pd.DataFrame) -> float:
    """Definition: GMV = sum of amount for orders that were not cancelled, excluding B2B bulk orders."""
    d = df.drop_duplicates("order_id")
    sold = d[(d["status"] != "cancelled") & (d["amount"] < BULK_THRESHOLD)]
    return float(sold["amount"].sum())


def return_rate(df: pd.DataFrame) -> float:
    """Definition: returned orders / orders not cancelled."""
    d = df.drop_duplicates("order_id")
    sold = d[d["status"] != "cancelled"]
    return round(float((sold["status"] == "returned").mean()), 4) if len(sold) else 0.0


def ist_day(df: pd.DataFrame) -> pd.Series:
    return pd.to_datetime(df["placed_at"], utc=True).dt.tz_convert("Asia/Kolkata").dt.date


# ---- unit tests: every KPI has a test with a hand-computed answer ----
def sample() -> pd.DataFrame:
    return pd.DataFrame({
        "order_id": [1, 2, 3, 3, 4, 5],
        "placed_at": ["2026-10-31 23:30", "2026-11-01 04:00", "2026-11-01 05:00", "2026-11-01 05:00", "2026-11-01 06:00", "2026-11-01 07:00"],
        "city": ["Chennai"] * 6,
        "category": ["Sarees"] * 6,
        "amount": [1000.0, 2000.0, 500.0, 500.0, 250_000.0, 300.0],
        "status": ["delivered", "cancelled", "returned", "returned", "delivered", "delivered"],
    })


def test_gmv_excludes_cancelled_duplicates_and_bulk():
    assert gmv(sample()) == 1000 + 500 + 300


def test_return_rate():
    assert return_rate(sample()) == round(1 / 4, 4)


def test_ist_moves_late_utc_orders_to_next_day():
    assert str(ist_day(sample()).iloc[0]) == "2026-11-01"


def test_validation_quarantines_and_rejects():
    bad = sample().assign(amount=[1000.0, -5, None, None, 10, 20])
    ok, q = validate(bad)
    assert len(q) == 3 and "missing amount" in q["reason"].iloc[1]
    try:
        validate(sample().rename(columns={"amount": "order_value"}))
    except ValueError as e:
        assert "amount" in str(e)
    else:
        raise AssertionError("renamed column must be rejected")


for test in [test_gmv_excludes_cancelled_duplicates_and_bulk, test_return_rate,
             test_ist_moves_late_utc_orders_to_next_day, test_validation_quarantines_and_rejects]:
    test()
    print("passed:", test.__name__)`;

const L3 = `import time

import duckdb
import numpy as np
import pandas as pd


def daily_file(day: str, n: int, seed: int) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    return pd.DataFrame({
        "order_id": [f"{day}-{i}" for i in range(n)],
        "category": rng.choice(["Sarees", "Phones", "Bedsheets"], n),
        "amount": rng.integers(300, 20_000, n),
        "status": rng.choice(["delivered", "cancelled", "returned"], n, p=[0.88, 0.07, 0.05]),
    })


con = duckdb.connect()
con.execute("CREATE TABLE orders (order_id VARCHAR PRIMARY KEY, category VARCHAR, amount BIGINT, status VARCHAR)")
con.execute("CREATE TABLE loaded_files (file_name VARCHAR PRIMARY KEY, rows BIGINT)")


def load(file_name: str, df: pd.DataFrame) -> str:
    """Idempotent incremental load: a file loads once; re-delivered rows are ignored."""
    if con.execute("SELECT 1 FROM loaded_files WHERE file_name = ?", [file_name]).fetchall():
        return f"{file_name}: skipped (already loaded)"
    before = con.execute("SELECT COUNT(*) FROM orders").fetchall()[0][0]
    con.register("incoming", df)
    con.execute("INSERT INTO orders SELECT * FROM incoming ON CONFLICT (order_id) DO NOTHING")
    con.execute("INSERT INTO loaded_files VALUES (?, ?)", [file_name, len(df)])
    new = con.execute("SELECT COUNT(*) FROM orders").fetchall()[0][0] - before
    return f"{file_name}: {new:,} new rows, {len(df) - new:,} already present"


def gmv_by_category() -> pd.DataFrame:
    return con.execute("""
        SELECT category, SUM(amount) AS gmv, COUNT(*) AS orders
        FROM orders WHERE status <> 'cancelled'
        GROUP BY category ORDER BY category
    """).df()


start = time.perf_counter()
for d, day in enumerate(["2026-11-01", "2026-11-02", "2026-11-03"]):
    print(load(f"orders_{day}.csv", daily_file(day, 60_000, d)))
print(load("orders_2026-11-02.csv", daily_file("2026-11-02", 60_000, 1)))   # delivered twice
before = gmv_by_category()
print(load("orders_2026-11-02_resend.csv", daily_file("2026-11-02", 60_000, 1)))  # same rows, new name
after = gmv_by_category()
print(after.to_string(index=False))
print("rerun changed GMV:", not before.equals(after))
print(f"rows: {con.execute('SELECT COUNT(*) FROM orders').fetchall()[0][0]:,}")
elapsed = time.perf_counter() - start
print("finished within a 2-minute budget:", elapsed < 120)`;

export default {
  id: 'p0-project', phase: 0, phaseName: 'Foundations',
  title: 'Project: Sales Insights Pipeline',
  sub: 'Build the weekly sales report every ShopSense team trusts: clean data, written KPI definitions, tests, and a pipeline that survives Diwali week.',
  time: '10–14 hours across three levels',
  outcomes: ['A pipeline that loads, validates and cleans order data from one command', 'Weekly KPIs by category from written, tested definitions', 'Evidence that it survives duplicates, empty days, schema changes and 6× festival volume'],
  brief: {
    goal: 'Category managers get one weekly sales report they trust: gross merchandise value (GMV), average order value, return rate and festival impact by category. Today finance and category teams quote different numbers.',
    users: [['Jones, category manager', 'Decides stock for each category every Monday. Needs one GMV number and the reason behind any change.'], ['Finance analyst', 'Reports to the board. Needs every number to reconcile with the order system, with cancellations visible.'], ['David, on-call engineer', 'Gets paged when numbers look wrong. Needs alerts and logs that say why.']],
    data: 'A provided generator creates realistic orders, customers, products and returns, including festival spikes and deliberate problems: duplicates, missing amounts, bulk B2B orders, UTC timestamps and cancelled orders.',
    metric: 'Every KPI matches a reference calculation to the rupee.',
    nfr: ['KPIs match the reference calculation to the rupee.', 'L3: 10 million order rows processed in under 2 minutes within 4 GB of RAM.', 'The whole pipeline reruns from one command; a rerun never double-counts.', 'Every rejected file or row is logged with a reason.'],
    deliverables: ['Repository with a README', 'Pipeline script runnable from one command', 'Unit tests for every KPI function', 'Data-quality report (rows loaded, rejected, why)', 'Static KPI dashboard (charts from P0.09)', 'Decision log: every definition and why it was chosen'],
    uses: ['P0.04–P0.05 pandas, grouping and joins', 'P0.06–P0.08 missing data, time zones, validation', 'P0.09–P0.10 honest charts and EDA', 'P0.18 median vs mean', 'P0.20 DuckDB and incremental loads'],
  },
  studio: [
    { h: 'Empathise and define', p: 'Read the three interview snippets. What do they have in common?', quotes: [['Jones, category manager', 'Finance and I never agree on GMV. By the time we do, the stock decision is late.'], ['Finance analyst', 'I need to reconcile every number with the order system, including cancellations.'], ['Operations lead', 'Festival weeks break the reports. Last Diwali the dashboard showed a 300% jump that turned out to be a reloaded file.']], out: '<b>Problem statement:</b> How might we give every team one weekly sales number, with written definitions, that stays correct during festival weeks?' },
    { h: 'Ideate and frame', p: 'Before choosing a technique, decide whether AI is needed at all.', choice: { q: 'Does this problem need a machine-learning model?', opts: [['Yes: train a model to predict the right GMV', 'No. GMV is a definition, not a prediction. A model would hide the disagreement instead of resolving it.'], ['No: it needs trusted analytics first', 'Correct. The problem is inconsistent definitions and data quality. Trusted analytics comes first; models in later phases will be trained on these numbers.'], ['Use an LLM to explain the difference each week', 'An LLM could describe the gap, but it would not remove it. Fix the definitions and the pipeline first.']], a: 1 }, out: '<b>Output:</b> KPI definitions (GMV, orders, median order value, return rate, festival uplift) and one success metric: KPIs match the reference to the rupee.' },
    { h: 'Construction', p: 'Write a test for each KPI definition first, with a tiny hand-made table where you know the answer. Then write the code until the tests pass.', out: '<b>Output:</b> tests such as <code>test_gmv_excludes_cancelled_duplicates_and_bulk</code> in the L2 starter code.' },
    { h: 'Validate', p: 'Run the four stress scenarios and the two failure drills in the stress lab and in your own pipeline. Record what each one did.', out: '<b>Output:</b> a data-quality report showing every scenario handled, with evidence.' },
    { h: 'Retrospective', p: 'Write down what broke, which definitions changed, and what you would automate next.', out: '<b>Output:</b> a short decision log entry for each change.' },
  ],
  decision: {
    q: 'Finance’s GMV includes cancelled orders and yours does not. What do you do?',
    opts: [
      ['Change yours to match finance', 'At the next monthly review, stock plans are 7% too high: cancelled orders inflated apparent demand, and unsold sarees pile up after Diwali.', 'bad'],
      ['Ask finance to change theirs', 'Finance’s board pack changes mid-year without warning. The CFO asks why history was restated, and trust in both teams drops.', 'bad'],
      ['Report both, clearly labelled', 'The report shows “GMV (net of cancellations)” for decisions and “Gross order value” for finance, on one definitions page. At the monthly review both numbers reconcile in two minutes.', 'good'],
    ],
  },
  levels: [
    {
      n: 'L1', h: 'Make it work', time: '3–4 hours',
      goal: 'Load the tables, clean them, compute weekly KPIs by category, and publish charts.',
      checks: ['Generate the data and inspect shape, types and missing values', 'Remove duplicate orders and handle missing amounts with a written rule', 'Convert timestamps to IST before assigning weeks', 'Compute weekly GMV, order count and median order value by category', 'Draw one honest chart per KPI with a finding as the title'],
      code: { why: 'Starter: the data generator and a first weekly KPI table. Extend it to every KPI.', src: L1 },
      hint: 'Use median, not mean, for order value (P0.18): a few bulk orders distort the mean. Week numbers use ISO weeks (%G-W%V) on IST dates.',
    },
    {
      n: 'L2', h: 'Make it robust', time: '4–5 hours',
      goal: 'Validation at load time; cancelled orders, refunds and duplicate deliveries handled by written definitions; IST time zones; bulk B2B orders flagged; unit tests for every KPI function.',
      checks: ['Schema check rejects files with missing or renamed columns', 'Bad rows go to a quarantine table with a reason', 'GMV, return rate and order count each have a written definition and a unit test', 'Bulk B2B orders are flagged and reported separately', 'A daily file delivered twice does not change any KPI'],
      code: { why: 'Starter: validation, KPI definitions and their tests. Every test uses a tiny table with a hand-computed answer.', src: L2 },
      hint: 'Write the definition as a docstring first, then the test, then the code. If you cannot write the test, the definition is not clear yet.',
    },
    {
      n: 'L3', h: 'Make it scale', time: '3–5 hours',
      goal: '10M order rows processed in under 2 minutes within 4 GB RAM using DuckDB or Polars; incremental daily loads; reruns never double-count.',
      checks: ['Store data as Parquet and query with DuckDB or Polars', 'Load each daily file incrementally and record which files were loaded', 'Prove that loading the same file twice changes nothing', 'Measure runtime and peak memory on 10 million rows', 'Run the whole pipeline from one command'],
      code: { why: 'Starter: an idempotent incremental loader in DuckDB. Scale the row count to 10 million on your own machine and measure.', src: L3 },
      hint: 'Two guards together: a table of loaded file names, and a primary key on order_id so re-delivered rows under a new file name are ignored.',
    },
  ],
  stress: [
    { id: 'diwali', h: 'Diwali week: 6× orders', p: 'Order volume rises to six times normal.' },
    { id: 'empty', h: 'One day arrives empty', p: 'The 1 November file has headers but no rows.' },
    { id: 'dup', h: 'Same file delivered twice', p: 'The 2 November file arrives again an hour later.' },
    { id: 'rename', h: 'Column renamed at the source', p: '<code>amount</code> becomes <code>order_value</code>.' },
  ],
  drills: [
    { h: 'A corrupted CSV arrives mid-run', p: 'The file stops halfway through a row. What should the pipeline do?', a: 'Detect it (row count or checksum from the sender does not match, last line malformed), quarantine the whole file, keep yesterday’s report live, alert with the file name, and reload once a good copy arrives. Never load a partial file silently.' },
    { h: 'GMV jumps 300% overnight', p: 'Real growth or a data bug? How do you decide in minutes?', a: 'Check duplicate order IDs and the loaded-files log first (a repeat file is the most common cause), then order counts by hour and city, then compare with the festival calendar. If order IDs are unique and the spike matches the calendar, it is real. Write the checks as a runbook.' },
  ],
  review: [
    ['What counts as a sale?', 'Decide and write it down: for example, orders not cancelled, net of returns for revenue reporting, excluding B2B bulk orders reported separately. The point is a single written definition used by every report, with tests.'],
    ['Why median rather than mean order value?', 'Order values are right-skewed and include bulk orders; a few large orders pull the mean far from a typical order. The median is robust; report the mean alongside if finance needs it.'],
    ['How do you prove a rerun cannot double-count?', 'Make loads idempotent: record loaded file names, enforce a unique key on order_id, and add a test that loads the same file twice and asserts every KPI is unchanged.'],
  ],
  side: { h: 'Side lab: fuel-station sales (2–3 hours)', p: 'Analyse daily sales by fuel type for a set of stations, reconcile pump meter readings with tank stock, and flag anomalies such as meter mismatches and unusual night-time sales. The same skills apply: written definitions, validation, IST days and honest charts.' },
};
