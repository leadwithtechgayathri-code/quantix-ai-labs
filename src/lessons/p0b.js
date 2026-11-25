import { B, Tl, O, T, Z, S, P, Cy, Bub, L, row, bars, each, off, mg } from '../kit.js';

const DATA = '#c4cdfb', SYS = '#b2e5da', GOOD = '#c1e4b1', BAD = '#ffc4b1', MODEL = '#d9cafb', SIGNAL = '#fddf98';

// small table helper: cols × rows of tiles with header
function tbl(cols, rows, o = {}) {
  const r = {}, dx = o.dx || 2.5, dy = o.dy || 1.3, w = o.w || 2.3;
  cols.forEach((c, j) => { r['h' + j] = { k: 'tile', x: j * dx, y: 0, w, d: 1.1, h: 0.18, c: 'ink', t: c, fs: 9, top: 1 }; });
  rows.forEach((rw, i) => rw.forEach((v, j) => {
    const bad = v === 'NaN';
    r[`r${i}${j}`] = { k: 'tile', x: j * dx, y: 1.3 + i * dy, w, d: 1.1, h: 0.14, c: bad ? 'coral' : 'blue', t: v, fs: 9, top: 1 };
  }));
  return r;
}

// ===================================================================== P0.06
const MCOLS = ['order_id', 'city', 'amount', 'rating'];
const MROWS = [['1001', 'Coimbatore', '1299', '5'], ['1002', 'Chennai', 'NaN', '4'], ['1003', 'NaN', '799', 'NaN'], ['1003', 'NaN', '799', 'NaN'], ['1004', 'Madurai', '2499', 'NaN'], ['1005', 'Coimbatore', '8999', '2']];
const l6 = {
  id: 'p0-06', title: 'Missing data and duplicates', time: '35 minutes',
  sub: 'Find gaps and repeated rows, understand why they happen, and handle them with rules you can explain.',
  learn: ['Count missing values and duplicate rows', 'Choose between dropping, filling and flagging missing values', 'Explain how duplicates and filling change your results'],
  legend: [[DATA, 'values'], [BAD, 'missing or duplicate'], [SIGNAL, 'filled'], [GOOD, 'flag column']],
  steps: [
    {
      t: 'Spot the gaps', b: ['Six order rows. Coral tiles are missing values (NaN): an amount, two cities and three ratings.', 'In pandas, <code>df.isna().sum()</code> counts them per column.'],
      n: 'Missing values are normal. Ignoring them is the mistake.',
      s: tbl(MCOLS, MROWS),
    },
    {
      t: 'Ask why each value is missing', b: ['A missing city may be a form bug. Missing ratings are different: unhappy customers often do not rate at all, so the gap itself carries information.', 'If you fill or drop without asking why, you can bias every later result.'],
      n: 'The reason a value is missing decides how to handle it.',
      s: { r23: { hl: 1 }, r43: { hl: 1 }, why: Bub('Customers who don’t rate\nare often the unhappy ones.', 12.4, 0.4, { z: 0.6, c: 'coral' }) },
    },
    {
      t: 'Drop, fill or flag', b: ['<b>Drop</b> rows only when few are affected and the gaps are random. <b>Fill</b> (impute) with a sensible value such as the median. <b>Flag</b> with a new True/False column so a model can learn from the gap itself.', 'Here the missing amount is filled with the median, and a <code>rating_missing</code> flag is added.'],
      n: 'Filling hides uncertainty; flagging keeps it visible.',
      s: { r23: { hl: 0 }, r43: { hl: 0 }, why: null, r12: { t: '1899', c: 'amber' }, hf: Tl('rating_missing', 10.0, 0, { c: 'green', w: 2.3, d: 1.1, h: 0.18, fs: 8, top: 1 }), ...Object.fromEntries(MROWS.map((r, i) => [`f${i}`, Tl(r[3] === 'NaN' ? 'True' : 'False', 10.0, 1.3 + i * 1.3, { c: 'green', w: 2.3, d: 1.1, h: 0.14, fs: 9 })])) },
    },
    {
      t: 'Duplicates inflate totals', b: ['Order 1003 appears twice: the same file was loaded twice, or a retry wrote the row again. Every total that includes it is now wrong.', '<code>df.drop_duplicates(subset="order_id")</code> keeps one copy.'],
      n: 'Decide what makes a row unique (here, order_id) before removing duplicates.',
      warn: true,
      s: { ...Object.fromEntries([0, 1, 2, 3].map((j) => [`r3${j}`, { c: 'coral', hl: j === 0 ? 1 : 0 }])), f3: { c: 'coral' } },
    },
    {
      t: 'Cleaning changes the answer', b: ['Total amount with the duplicate and without filling: ₹14,395. After removing the duplicate and filling with the median: ₹15,495.', 'Both numbers can be defended only if the rules are written down. That is what a cleaning log is for.'],
      n: 'Always record what was dropped, filled and why. Reports must be reproducible.',
      clear: true,
      s: mg(bars('t', [14395 / 6000, 15495 / 6000], { x: 0, y: 0, dx: 2.6, w: 1.2, d: 1.2, c: 'coral', labels: ['raw · ₹14,395', 'cleaned · ₹15,495'] }), { t1: { c: 'green' } }),
    },
  ],
  math: {
    blocks: [
      { h: 'Missing rate', f: 'missing rate = missing values / total values', p: 'Report it per column. A column that is 60% missing needs a different decision from one that is 1% missing.' },
      { h: 'Median imputation', f: 'fill value = median of the known values', p: 'The median resists outliers better than the mean. Any constant fill shrinks the column’s variance, so models see less spread than really exists.' },
      { h: 'Duplicates and totals', f: 'reported total = true total + Σ (copies − 1) × value', p: 'Each extra copy of a row adds its value again.' },
    ],
    example: {
      intro: 'Fill a missing amount with the median.',
      steps: ['Known amounts (after removing the duplicate): <code>1299, 799, 2499, 8999</code>.', 'Sorted: 799, 1299, 2499, 8999. With 4 values the median is the mean of the middle two.', 'Median = (1299 + 2499) / 2 = <b>1899</b>.', 'Cleaned total = 1299 + 1899 + 799 + 2499 + 8999 = <b>15495</b>.'],
    },
  },
  code: {
    scratch: { why: 'Finding gaps and repeats by hand, to see what the library does.', src: `rows = [
    (1001, "Coimbatore", 1299), (1002, "Chennai", None), (1003, None, 799),
    (1003, None, 799), (1004, "Madurai", 2499), (1005, "Coimbatore", 8999),
]

missing_amount = sum(1 for r in rows if r[2] is None)
print("Missing amounts:", missing_amount)

seen, unique = set(), []
for r in rows:
    if r[0] not in seen:
        seen.add(r[0])
        unique.append(r)
print("Rows after removing duplicates:", len(unique))

known = sorted(r[2] for r in unique if r[2] is not None)
mid = len(known) // 2
median = (known[mid - 1] + known[mid]) / 2 if len(known) % 2 == 0 else known[mid]
print("Median amount:", median)` },
    library: { why: 'Counting, de-duplicating, filling and flagging with pandas.', src: `import numpy as np
import pandas as pd

df = pd.DataFrame({
    "order_id": [1001, 1002, 1003, 1003, 1004, 1005],
    "city": ["Coimbatore", "Chennai", None, None, "Madurai", "Coimbatore"],
    "amount": [1299, np.nan, 799, 799, 2499, 8999],
    "rating": [5, 4, np.nan, np.nan, np.nan, 2],
})
print(df.isna().sum())
print("Duplicate order ids:", df.duplicated(subset="order_id").sum())

clean = df.drop_duplicates(subset="order_id").copy()
clean["rating_missing"] = clean["rating"].isna()
clean["amount"] = clean["amount"].fillna(clean["amount"].median())
print(clean)
print("Total:", clean["amount"].sum())` },
    prod: { why: 'A cleaning function that returns a log of every change it made.', src: `import numpy as np
import pandas as pd


def clean_orders(df: pd.DataFrame) -> tuple[pd.DataFrame, dict]:
    """De-duplicate by order_id, fill missing amount with the median, flag missing ratings."""
    log = {"rows_in": len(df)}
    out = df.drop_duplicates(subset="order_id", keep="first").copy()
    log["duplicates_removed"] = log["rows_in"] - len(out)
    median = out["amount"].median()
    log["amounts_filled"] = int(out["amount"].isna().sum())
    log["fill_value"] = float(median)
    out["amount"] = out["amount"].fillna(median)
    out["rating_missing"] = out["rating"].isna()
    log["rows_out"] = len(out)
    return out, log


def test_clean_orders() -> None:
    raw = pd.DataFrame({"order_id": [1, 1, 2], "amount": [10.0, 10.0, np.nan], "rating": [5, 5, np.nan]})
    out, log = clean_orders(raw)
    assert log["duplicates_removed"] == 1 and log["amounts_filled"] == 1
    assert out["amount"].tolist() == [10.0, 10.0]


test_clean_orders()
raw = pd.DataFrame({"order_id": [1001, 1002, 1003, 1003], "amount": [1299, np.nan, 799, 799], "rating": [5, 4, np.nan, np.nan]})
print(clean_orders(raw)[1])` },
  },
  industry: {
    when: ['Every dataset, immediately after loading.', 'Before computing any KPI or training any model.', 'When numbers from two teams disagree: duplicates and gaps are the usual suspects.'],
    baseline: 'Count missing values and duplicates per column and write the numbers down. Then decide per column, with a reason, whether to drop, fill or flag.',
    tools: ['pandas isna, duplicated, drop_duplicates, fillna', 'scikit-learn SimpleImputer inside a model pipeline', 'Great Expectations or pandera to alert when missing rates jump'],
    tradeoffs: ['Dropping rows is simple but can bias results if gaps are not random.', 'Filling keeps rows but hides uncertainty and shrinks variance.', 'Flag columns add information for models but make tables wider.'],
    failures: ['Filling before splitting train and test data, leaking test information into training.', 'Removing "duplicates" that were genuine repeat orders because uniqueness was defined wrongly.', 'Treating 0 and missing as the same thing.'],
    shopsense: 'The Sales Insights Pipeline must survive the same daily file arriving twice. Removing duplicate order_ids with a logged count is exactly the L2 requirement.',
    interview: [
      ['How do you handle missing values?', 'First find out why they are missing. Then, per column, drop if few and random, impute with a robust value such as the median, or add a missing-indicator flag; fit imputers on training data only.'],
      ['Why can mean imputation be a problem?', 'It is pulled by outliers and shrinks variance, making the column look more certain than it is, and it can bias relationships between variables.'],
      ['How would you detect duplicates?', 'Define what makes a record unique (for example order_id, or order_id plus line number), then count rows sharing that key.'],
    ],
  },
  quiz: [
    { q: 'Which pandas expression counts missing values per column?', opts: ['df.count()', 'df.isna().sum()', 'df.dropna()', 'df.missing()'], a: 1, why: 'isna() marks missing cells as True; sum() counts the Trues per column.' },
    { q: 'Ratings are missing mostly for unhappy customers. What is the best first step?', opts: ['Drop those rows', 'Fill with the average rating', 'Add a rating_missing flag and treat the gap as information', 'Fill with 5'], a: 2, why: 'The gap is not random; dropping or filling would hide a real signal.' },
    { q: 'Known amounts are 1299, 799, 2499 and 8999. What is the median?', opts: ['1899', '3399', '1299', '2499'], a: 0, why: 'Sorted: 799, 1299, 2499, 8999. Middle two average: (1299 + 2499) / 2 = 1899.' },
    { q: 'Order 1003 (₹799) appears twice. How much does the total overstate?', opts: ['₹0', '₹799', '₹1,598', 'It depends on the city'], a: 1, why: 'One extra copy adds its value once more.' },
    { q: 'Why fit an imputer on training data only?', opts: ['It is faster', 'To avoid leaking information from the test set into training', 'Test data never has gaps', 'It is a pandas requirement'], a: 1, why: 'Using test data to compute fill values leaks information and makes evaluation over-optimistic.' },
  ],
  exercise: {
    task: ['Clean <code>df</code>: remove duplicate <code>order_id</code>s (keep the first), then fill missing <code>amount</code> with the median of the remaining amounts. Store the result in <code>clean</code> and its total amount in <code>total</code>.'],
    starter: `import numpy as np
import pandas as pd

df = pd.DataFrame({
    "order_id": [1, 2, 2, 3, 4, 5],
    "amount": [500, np.nan, np.nan, 700, 900, 1100],
})

clean = df    # replace
total = None  # replace

print(clean)
print(total)`,
    check: `assert clean["order_id"].is_unique, "remove duplicate order ids"
assert clean["amount"].isna().sum() == 0, "fill the missing amount"
assert total == 500 + 800 + 700 + 900 + 1100, "median of 500, 700, 900, 1100 is 800"`,
    solution: `import numpy as np
import pandas as pd

df = pd.DataFrame({
    "order_id": [1, 2, 2, 3, 4, 5],
    "amount": [500, np.nan, np.nan, 700, 900, 1100],
})

clean = df.drop_duplicates(subset="order_id").copy()
clean["amount"] = clean["amount"].fillna(clean["amount"].median())
total = clean["amount"].sum()

print(clean)
print(total)`,
    hint: 'De-duplicate first, then compute the median, so the duplicate cannot affect it.',
  },
};

// ===================================================================== P0.07
const l7 = {
  id: 'p0-07', title: 'Dates, time zones and types', time: '35 minutes',
  sub: 'Parse dates properly, store time in UTC, report in IST, and fix columns with the wrong type.',
  learn: ['Convert text to real datetime values', 'Store timestamps in UTC and convert to Indian time (IST)', 'Explain how a time-zone mistake moves orders to the wrong day'],
  legend: [[BAD, 'text'], [DATA, 'datetime'], [SIGNAL, 'IST'], [GOOD, 'right day']],
  steps: [
    {
      t: 'A date stored as text is not a date', b: ['The order log has <code>"2026-10-31 23:30"</code> as a string. You cannot subtract strings, group them by week, or compare them reliably.', '<code>pd.to_datetime</code> turns them into real datetime values.'],
      n: 'Text dates sort alphabetically, which is often wrong ("9/11" after "10/11").',
      s: { txt: Tl('"2026-10-31 23:30"', 0, 0, { c: 'coral', w: 2.6, d: 0.9, fs: 10 }), dt: Tl('datetime 2026-10-31 23:30', 3.6, 0, { c: 'blue', w: 2.9, d: 0.9, fs: 9.5 }) },
      l: { p: L('txt', 'dt', { t: 'to_datetime', flow: 1 }) },
    },
    {
      t: 'Store time in UTC', b: ['Servers, cloud logs and payment systems usually record time in UTC, the world reference time. One clock for everything avoids confusion.', 'This order was placed at 23:30 UTC on 31 October.'],
      n: 'Rule of thumb: store UTC, convert only when you display or report.',
      s: { txt: null, dt: null, uL: S(3, 0, 7, 0.9, { c: 'blue', h: 0.12 }), uT: T('UTC', -1.2, 0, { fs: 13, b: 1, c: 'blue' }), uD1: T('31 Oct', 0.8, -0.9, { fs: 11, c: 'muted' }), uD2: T('1 Nov', 5.4, -0.9, { fs: 11, c: 'muted' }), uMid: B('', 3.8, 0, { c: 'slate', w: 0.08, d: 1.2, h: 0.5, noshadow: 1 }), ord: O(3.3, 0, { z: 0.15, r: 0.26, c: 'blue', sub: '23:30 UTC' }) },
    },
    {
      t: 'Convert to IST for Indian reports', b: ['India Standard Time is UTC + 5 hours 30 minutes. 23:30 UTC on 31 October is <b>05:00 IST on 1 November</b>.', 'Same moment, different calendar day.'],
      n: 'The order crosses midnight. Which day it belongs to depends on the time zone.',
      s: { iL: S(3, 3.8, 7, 0.9, { c: 'amber', h: 0.12 }), iT: T('IST', -1.2, 3.8, { fs: 13, b: 1, c: 'amber' }), iMid: B('', 1.6, 3.8, { c: 'slate', w: 0.08, d: 1.2, h: 0.5, noshadow: 1 }), iD1: T('31 Oct', 0.2, 2.9, { fs: 11, c: 'muted' }), iD2: T('1 Nov', 4.6, 2.9, { fs: 11, c: 'muted' }), ordI: O(2.6, 3.8, { z: 0.15, r: 0.26, c: 'amber', sub: '05:00 IST', hl: 1 }) },
      l: { c: L('ord', 'ordI', { c: 'amber', t: '+5:30' }) },
    },
    {
      t: 'Wrong zone, wrong day, wrong report', b: ['Diwali-night orders placed between 18:30 and 23:59 UTC fall on the <i>next</i> day in IST. Group them by UTC date and the festival spike lands on the wrong day in Jones’s daily report.'],
      n: 'Report by the business’s local time. For ShopSense, that is IST.',
      warn: true,
      clear: true,
      s: mg(bars('u', [1.2, 2.6, 1.0], { x: 0, y: 0, dx: 1.6, w: 0.9, d: 0.9, c: 'slate', labels: ['30 Oct', '31 Oct', '1 Nov'] }), bars('i', [1.0, 1.9, 1.9], { x: 6.4, y: 0, dx: 1.6, w: 0.9, d: 0.9, c: 'amber', labels: ['30 Oct', '31 Oct', '1 Nov'] }), { uT: T('by UTC day', 0.2, -2.0, { z: 3, fs: 12.5, b: 1, c: 'muted' }), iT: T('by IST day', 6.6, -2.0, { z: 3, fs: 12.5, b: 1, c: 'amber' }) }),
    },
    {
      t: 'Fix the other types too', b: ['Dates are one type problem. Also check numbers stored as text ("₹1,299"), IDs that lost leading zeros (PIN code "641001" is fine, but "0412" becomes 412), and repeated text such as city names, which can use the memory-saving <code>category</code> type.'],
      n: 'Set types once, at load time, and test them.',
      clear: true,
      s: { ...row('a', ['"₹1,299"', '"0412"', '"Chennai"'], { x: 0, y: 0, dx: 0, dy: 1.3, c: 'coral', w: 1.9, d: 0.9, fs: 10 }), ...row('b', ['1299 · int', '"0412" · str', 'Chennai · category'], { x: 3.8, y: 0, dx: 0, dy: 1.3, c: 'green', w: 2.6, d: 0.9, fs: 9.5 }) },
      l: { x0: L('a0', 'b0', { c: 'muted' }), x1: L('a1', 'b1', { c: 'muted' }), x2: L('a2', 'b2', { c: 'muted' }) },
    },
  ],
  math: {
    blocks: [
      { h: 'Converting UTC to IST', f: 'IST = UTC + 5 h 30 min\n\n23:30 + 5:30 = 29:00 → 05:00 the next day', p: 'India does not use daylight saving time, so the offset is always +5:30.' },
      { h: 'Timestamps as numbers', f: 'Unix time = seconds since 1970-01-01 00:00 UTC', p: 'Computers store a moment as one number; the time zone only changes how it is displayed.' },
      { h: 'Which IST day?', f: 'IST date = date(UTC timestamp + 5:30)', p: 'Any UTC time from 18:30 onwards lands on the next IST date.' },
    ],
    example: {
      intro: 'Which IST day does each order belong to?',
      steps: ['Order A: 31 Oct, 17:00 UTC → 17:00 + 5:30 = 22:30 IST, still <b>31 Oct</b>.', 'Order B: 31 Oct, 18:45 UTC → 18:45 + 5:30 = 24:15 → <b>00:15 IST on 1 Nov</b>.', 'Order C: 31 Oct, 23:30 UTC → 29:00 → <b>05:00 IST on 1 Nov</b>.', 'By UTC date all three are on 31 Oct; by IST date, one is on 31 Oct and two are on 1 Nov.'],
    },
  },
  code: {
    scratch: { why: 'Python’s datetime with a fixed +5:30 offset, so you see the arithmetic.', src: `from datetime import datetime, timedelta, timezone

IST = timezone(timedelta(hours=5, minutes=30))

text = "2026-10-31 23:30"
utc_time = datetime.strptime(text, "%Y-%m-%d %H:%M").replace(tzinfo=timezone.utc)
ist_time = utc_time.astimezone(IST)

print("UTC:", utc_time)
print("IST:", ist_time)
print("UTC date:", utc_time.date(), "| IST date:", ist_time.date())` },
    library: { why: 'pandas parses, converts and groups by IST day in a few lines.', src: `import pandas as pd

orders = pd.DataFrame({
    "placed_at": ["2026-10-31 17:00", "2026-10-31 18:45", "2026-10-31 23:30", "2026-11-01 06:10"],
    "amount": [1299, 2499, 799, 1899],
})
orders["placed_at"] = pd.to_datetime(orders["placed_at"], utc=True)
orders["placed_ist"] = orders["placed_at"].dt.tz_convert("Asia/Kolkata")

print(orders[["placed_at", "placed_ist"]])
print("\\nOrders per IST day:")
print(orders.groupby(orders["placed_ist"].dt.date)["amount"].count())` },
    prod: { why: 'A parser that rejects unreadable timestamps instead of silently dropping them.', src: `import pandas as pd


def parse_utc(values: pd.Series, max_bad_share: float = 0.01) -> pd.Series:
    """Parse timestamps as UTC. Raise if more than max_bad_share are unreadable."""
    parsed = pd.to_datetime(values, utc=True, errors="coerce")
    bad = parsed.isna() & values.notna()
    if bad.mean() > max_bad_share:
        raise ValueError(f"{int(bad.sum())} unreadable timestamps, e.g. {values[bad].iloc[0]!r}")
    return parsed


def to_ist_date(ts: pd.Series) -> pd.Series:
    return ts.dt.tz_convert("Asia/Kolkata").dt.date


def test_parsing() -> None:
    good = parse_utc(pd.Series(["2026-10-31 23:30"]))
    assert str(to_ist_date(good).iloc[0]) == "2026-11-01"
    try:
        parse_utc(pd.Series(["2026-10-31 23:30", "not a date"]))
    except ValueError:
        pass
    else:
        raise AssertionError("expected an error for bad timestamps")


test_parsing()
print(to_ist_date(parse_utc(pd.Series(["2026-10-31 17:00", "2026-10-31 18:45"]))).tolist())` },
  },
  industry: {
    when: ['Any data with timestamps: orders, logs, payments, sensors.', 'Daily, weekly and festival reports.', 'Features such as "hour of day" or "days since last order".'],
    baseline: 'Parse every timestamp column at load time, store it in UTC, and convert to the business time zone in exactly one place.',
    tools: ['pandas to_datetime, tz_convert, dt accessor', 'Python datetime and zoneinfo', 'Warehouse functions such as CONVERT_TIMEZONE or AT TIME ZONE'],
    tradeoffs: ['UTC everywhere is consistent but every report must remember to convert.', 'The category type saves memory but needs care when new values appear.'],
    failures: ['Festival or month-end numbers landing on the wrong day because of UTC grouping.', 'Ambiguous formats: 01/11/2026 is 1 November in India but 11 January in the US.', 'Leading zeros lost from codes read as integers.'],
    shopsense: 'Jones’s daily GMV must use IST days. The L2 requirement of the Sales Insights Pipeline is to convert time zones correctly so Diwali-night orders are counted on the right day.',
    interview: [
      ['Why store timestamps in UTC?', 'UTC has no daylight-saving changes and is a shared reference, so systems in different regions agree. Convert to local time only for display and reporting.'],
      ['What can go wrong with dates like 01/11/2026?', 'It is ambiguous between day-first and month-first formats. Use ISO 8601 (2026-11-01) or pass an explicit format when parsing.'],
      ['How do you make sure IDs keep leading zeros?', 'Read them as strings (dtype=str) and never as numbers, since they are labels, not quantities.'],
    ],
  },
  quiz: [
    { q: 'An order is placed at 23:30 UTC on 31 October. What is the IST date and time?', opts: ['31 Oct, 18:00', '1 Nov, 05:00', '31 Oct, 23:30', '1 Nov, 00:30'], a: 1, why: '23:30 + 5:30 = 29:00, which is 05:00 the next day.' },
    { q: 'From what UTC time onwards does an order fall on the next IST date?', opts: ['12:00', '18:30', '20:00', '23:00'], a: 1, why: '18:30 + 5:30 = 24:00, which is midnight in IST.' },
    { q: 'Why is storing dates as text a problem?', opts: ['Text uses less memory', 'You cannot reliably sort, subtract or group text dates', 'pandas cannot read text', 'Text is always UTC'], a: 1, why: 'Strings sort alphabetically and do not support date arithmetic.' },
    { q: 'A PIN-like code "0412" was loaded as the number 412. How do you prevent this?', opts: ['Multiply by 10', 'Read the column as a string', 'Use float', 'Sort the column'], a: 1, why: 'Codes are labels, not quantities, so read them with dtype=str.' },
    { q: 'Where should conversion to IST happen?', opts: ['In every query, differently each time', 'Once, in a single tested place, for reporting', 'Never', 'In the database server settings only'], a: 1, why: 'One tested conversion keeps every report consistent.' },
  ],
  exercise: {
    task: ['Parse <code>placed_at</code> as UTC, convert to IST, and compute <code>per_day</code>: the number of orders per <b>IST date</b>, as a Series indexed by date strings like <code>"2026-11-01"</code>.'],
    starter: `import pandas as pd

orders = pd.DataFrame({"placed_at": [
    "2026-10-31 10:00", "2026-10-31 18:20", "2026-10-31 18:40",
    "2026-10-31 22:15", "2026-11-01 04:00",
]})

per_day = None

print(per_day)`,
    check: `assert per_day is not None
d = {str(k): int(v) for k, v in per_day.items()}
assert d == {"2026-10-31": 2, "2026-11-01": 3}, "18:40 and 22:15 UTC are already 1 Nov in IST"`,
    solution: `import pandas as pd

orders = pd.DataFrame({"placed_at": [
    "2026-10-31 10:00", "2026-10-31 18:20", "2026-10-31 18:40",
    "2026-10-31 22:15", "2026-11-01 04:00",
]})

ist = pd.to_datetime(orders["placed_at"], utc=True).dt.tz_convert("Asia/Kolkata")
per_day = ist.dt.strftime("%Y-%m-%d").value_counts().sort_index()

print(per_day)`,
    hint: '<code>pd.to_datetime(..., utc=True)</code>, then <code>.dt.tz_convert("Asia/Kolkata")</code>, then count per <code>.dt.strftime("%Y-%m-%d")</code>.',
  },
};

// ===================================================================== P0.08
const VALS = [799, 999, 1299, 1499, 1899, 2499];
const vx = (v) => v / 400; // position along the floor for normal orders
const l8 = {
  id: 'p0-08', title: 'Outliers and data validation', time: '35 minutes',
  sub: 'Flag unusual values with a clear rule, and stop impossible values at the door with validation.',
  learn: ['Detect outliers with the IQR rule and z-scores', 'Decide when to keep, separate or remove an outlier', 'Write validation rules that reject impossible rows'],
  legend: [[DATA, 'normal orders'], [BAD, 'outlier or invalid'], [SIGNAL, 'typical range'], [GOOD, 'passed']],
  steps: [
    {
      t: 'Most orders cluster together', b: ['Six saree orders between ₹799 and ₹2,499. They sit close together on the value line.'],
      n: 'Position along the floor shows the order value.',
      s: { line: S(4.2, 0, 10, 0.5, { c: 'slate', h: 0.06 }), ...Object.fromEntries(VALS.map((v, i) => ['v' + i, O(vx(v), 0, { z: 0.06, r: 0.22, c: 'blue', sub: i % 2 ? '' : '₹' + v.toLocaleString('en-IN') })])) },
    },
    {
      t: 'Then a ₹2,40,000 order arrives', b: ['A business bought 200 sarees for staff uniforms. Is it an error, fraud, or a genuine bulk order?', 'One value like this pulls the mean from ₹1,499 to about ₹35,571, while the median stays ₹1,499.'],
      n: 'Outliers wreck averages. The median barely moves.',
      s: { big: O(9.4, 0, { z: 0.06, r: 0.3, c: 'coral', hl: 1, sub: '₹2,40,000' }), gap: T('…far away', 8.0, -0.9, { fs: 11, c: 'muted' }) },
    },
    {
      t: 'The IQR rule draws a fence', b: ['Find Q1 and Q3, the 25th and 75th percentiles. The gap between them is the IQR. Values beyond Q3 + 1.5 × IQR (or below Q1 − 1.5 × IQR) are flagged.', 'For these seven orders the upper fence is ₹3,774. The bulk order is far beyond it.'],
      n: 'The amber band is the typical middle half of the data.',
      s: { band: Z('', 4.1, 0, 2.6, 1.0, { c: 'amber' }), fence: B('', 3774 / 400, 0, { c: 'coral', w: 0.08, d: 1.2, h: 0.7, noshadow: 1 }), fl: T('upper fence ₹3,774', 3774 / 400, -1.1, { fs: 11, c: 'coral' }) },
    },
    {
      t: 'Flag first, decide with the business', b: ['Do not delete an outlier just because a rule flagged it. Here, bulk orders are real but behave differently, so ShopSense reports them as a separate B2B segment.', 'Delete only values that are impossible, such as a negative price.'],
      n: 'Outlier means "look at this", not "remove this".',
      s: { big: { c: 'violet', hl: 0, sub: 'B2B segment' } },
    },
    {
      t: 'Validation stops impossible rows at the door', b: ['Validation rules check every incoming row: amount must be positive, quantity a whole number of at least 1, city from the known list.', 'Rows that fail go to a quarantine table with the reason, and someone is alerted.'],
      n: 'Validate on load, so bad data never reaches a report or a model.',
      clear: true,
      s: mg(row('in', ['₹1,299 · qty 1', '₹-50 · qty 1', '₹799 · qty 0', '₹2,499 · qty 2'], { x: 0, y: 0, dx: 0, dy: 1.3, c: 'blue', w: 2.2, d: 0.9, fs: 9 }), { gate: B('rules', 4.6, 1.95, { c: 'teal', w: 1.1, d: 4.4, h: 1.0, fs: 11 }), ok: Tl('2 passed', 8.0, 0.8, { c: 'green', w: 1.9, d: 0.9, fs: 10 }), bad: Tl('2 quarantined', 8.0, 3.2, { c: 'coral', w: 2.2, d: 0.9, fs: 9.5 }), in1: { c: 'coral' }, in2: { c: 'coral' } }),
      l: { a: L('gate', 'ok', { c: 'green' }), b: L('gate', 'bad', { c: 'coral' }) },
    },
  ],
  math: {
    blocks: [
      { h: 'Interquartile range (IQR)', f: 'IQR = Q3 − Q1\nlower fence = Q1 − 1.5 × IQR\nupper fence = Q3 + 1.5 × IQR', p: 'Robust: one extreme value barely moves Q1 and Q3.' },
      { h: 'z-score', f: 'z = (x − μ) / σ', p: 'Flags values more than about 3 standard deviations from the mean. It is less robust, because the outlier itself inflates μ and σ.' },
      { h: 'Mean vs median', f: 'mean = Σx / n     median = middle value when sorted', p: 'Report the median for skewed money data such as order values.' },
    ],
    example: {
      intro: 'Apply the IQR rule to seven orders (pandas’ default linear interpolation).',
      steps: ['Sorted: <code>799, 999, 1299, 1499, 1899, 2499, 240000</code> (n = 7).', 'Q1 sits at position 0.25 × 6 = 1.5, halfway between 999 and 1299: <b>1149</b>. Q3 at 4.5, halfway between 1899 and 2499: <b>2199</b>.', 'IQR = 2199 − 1149 = <b>1050</b>. Upper fence = 2199 + 1.5 × 1050 = <b>3774</b>.', '240000 > 3774, so it is flagged. Mean = 248994 / 7 ≈ <b>35571</b>; median = <b>1499</b>.'],
    },
  },
  code: {
    scratch: { why: 'Quartiles and fences computed by hand.', src: `values = sorted([799, 999, 1299, 1499, 1899, 2499, 240000])


def quantile(sorted_vals, q):
    pos = q * (len(sorted_vals) - 1)
    lo = int(pos)
    frac = pos - lo
    hi = min(lo + 1, len(sorted_vals) - 1)
    return sorted_vals[lo] + frac * (sorted_vals[hi] - sorted_vals[lo])


q1, q3 = quantile(values, 0.25), quantile(values, 0.75)
iqr = q3 - q1
upper = q3 + 1.5 * iqr
print("Q1:", q1, "Q3:", q3, "IQR:", iqr, "upper fence:", upper)
print("Outliers:", [v for v in values if v > upper])
print("Mean:", round(sum(values) / len(values)), "Median:", values[len(values) // 2])` },
    library: { why: 'pandas quantiles, an outlier flag and simple validation rules.', src: `import pandas as pd

orders = pd.DataFrame({
    "amount": [799, 999, 1299, 1499, 1899, 2499, 240000, -50],
    "qty": [1, 1, 1, 2, 1, 2, 200, 1],
})

valid = (orders["amount"] > 0) & (orders["qty"] >= 1)
print("Rejected rows:")
print(orders[~valid])

ok = orders[valid].copy()
q1, q3 = ok["amount"].quantile([0.25, 0.75])
upper = q3 + 1.5 * (q3 - q1)
ok["is_outlier"] = ok["amount"] > upper
print(f"\\nUpper fence: {upper:.0f}")
print(ok)
print("Median:", ok["amount"].median(), "| Mean:", round(ok["amount"].mean()))` },
    prod: { why: 'A validator that returns accepted and quarantined rows with reasons.', src: `import pandas as pd

RULES = {
    "amount must be positive": lambda df: df["amount"] > 0,
    "qty must be at least 1": lambda df: df["qty"] >= 1,
    "city must be known": lambda df: df["city"].isin(["Coimbatore", "Chennai", "Madurai"]),
}


def validate(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Split rows into (accepted, quarantined). Quarantined rows carry the failed rules."""
    reasons = pd.Series([[] for _ in range(len(df))], index=df.index)
    for name, rule in RULES.items():
        failed = ~rule(df)
        for i in df.index[failed]:
            reasons[i] = reasons[i] + [name]
    bad = reasons.str.len() > 0
    quarantined = df[bad].assign(reasons=reasons[bad].str.join("; "))
    return df[~bad], quarantined


def test_validate() -> None:
    df = pd.DataFrame({"amount": [10, -1], "qty": [1, 1], "city": ["Chennai", "Delhi"]})
    ok, bad = validate(df)
    assert len(ok) == 1 and "amount must be positive" in bad["reasons"].iloc[0]


test_validate()
df = pd.DataFrame({"amount": [1299, -50, 799], "qty": [1, 1, 0], "city": ["Chennai", "Madurai", "Coimbatore"]})
accepted, quarantined = validate(df)
print(quarantined)` },
  },
  industry: {
    when: ['Every data pipeline, at the point where data enters.', 'Before reporting averages of skewed values such as money.', 'Fraud and anomaly detection start from the same idea.'],
    baseline: 'Write three to five validation rules you are sure of, quarantine failures with reasons, and flag statistical outliers with the IQR rule for human review.',
    tools: ['pandas boolean rules', 'pandera or Great Expectations for declarative checks', 'Dashboards that track the number of quarantined rows per day'],
    tradeoffs: ['Strict rules protect reports but can block a whole load for one bad row; quarantining keeps the pipeline moving.', 'IQR is robust but treats every distribution the same; domain rules are often better.'],
    failures: ['Deleting genuine high-value customers as "outliers".', 'Validation that only logs warnings nobody reads.', 'Using the mean of skewed data in a KPI and being misled by one large order.'],
    shopsense: 'Bulk B2B orders are flagged and reported separately in the Sales Insights Pipeline, and impossible rows are quarantined with reasons, which is part of the L2 robustness requirement.',
    interview: [
      ['How do you detect outliers?', 'Start with domain rules, then a robust statistical rule such as the IQR fence or a median-based z-score; visualise; and confirm with the business before acting.'],
      ['Should you always remove outliers?', 'No. Remove impossible values; keep genuine extremes, possibly in a separate segment, because they can be the most important customers or events.'],
      ['Why is the z-score less robust than IQR?', 'The outlier inflates the mean and standard deviation used to compute z, which can hide it. Quartiles are barely affected by a single extreme value.'],
    ],
  },
  quiz: [
    { q: 'Q1 = 1149 and Q3 = 2199. What is the upper IQR fence?', opts: ['2199', '3249', '3774', '5349'], a: 2, why: 'IQR = 1050; 2199 + 1.5 × 1050 = 3774.' },
    { q: 'One ₹2,40,000 order joins six orders around ₹1,500. Which summary barely changes?', opts: ['Mean', 'Median', 'Total', 'Maximum'], a: 1, why: 'The median depends on the middle value, not the size of the extreme one.' },
    { q: 'A rule flags a ₹2,40,000 bulk order as an outlier. What should you do first?', opts: ['Delete it', 'Check with the business whether it is genuine', 'Replace it with the mean', 'Ignore the rule'], a: 1, why: 'Outlier means "investigate". Genuine bulk orders belong in a separate segment.' },
    { q: 'Which row should validation reject outright?', opts: ['amount = 15,999', 'amount = -50', 'qty = 3', 'city = Madurai'], a: 1, why: 'A negative price is impossible, not just unusual.' },
    { q: 'Why quarantine failed rows instead of dropping them silently?', opts: ['It is faster', 'So someone can see what failed and why, and fix the source', 'Quarantine deletes them later anyway', 'Models need them'], a: 1, why: 'Recording reasons makes data problems visible and fixable.' },
  ],
  exercise: {
    task: ['Add a boolean column <code>is_outlier</code> to <code>orders</code> using the IQR rule (values above Q3 + 1.5 × IQR or below Q1 − 1.5 × IQR). Store the median amount in <code>med</code>.'],
    starter: `import pandas as pd

orders = pd.DataFrame({"amount": [450, 520, 610, 700, 760, 820, 15000]})

# your code here
med = None

print(orders)
print(med)`,
    check: `assert "is_outlier" in orders.columns
assert orders["is_outlier"].tolist() == [False] * 6 + [True]
assert med == 700`,
    solution: `import pandas as pd

orders = pd.DataFrame({"amount": [450, 520, 610, 700, 760, 820, 15000]})

q1, q3 = orders["amount"].quantile([0.25, 0.75])
iqr = q3 - q1
orders["is_outlier"] = (orders["amount"] > q3 + 1.5 * iqr) | (orders["amount"] < q1 - 1.5 * iqr)
med = orders["amount"].median()

print(orders)
print(med)`,
    hint: '<code>q1, q3 = orders["amount"].quantile([0.25, 0.75])</code> gives both quartiles at once.',
  },
};

// ===================================================================== P0.09
const l9 = {
  id: 'p0-09', title: 'Visualisation that tells the truth', time: '35 minutes',
  sub: 'Choose the chart that answers the question, and avoid the tricks that make small changes look huge.',
  learn: ['Choose a chart type from the question being asked', 'Spot a truncated axis and compute its lie factor', 'Write a chart title that states the finding'],
  legend: [[DATA, 'honest'], [BAD, 'misleading'], [GOOD, 'right chart for the question']],
  steps: [
    {
      t: 'Two months of saree sales', b: ['October: ₹95 lakh. November: ₹100 lakh. A 5.3% increase.', 'Drawn from zero, the bars look similar, which is the truth.'],
      n: 'Bar length should be proportional to the value.',
      s: mg(bars('h', [95 / 40, 100 / 40], { x: 0, y: 0, dx: 1.8, w: 1.1, d: 1.1, c: 'blue', labels: ['Oct · 95', 'Nov · 100'] }), { ht: T('axis starts at 0', -0.4, -1.8, { z: 3.4, fs: 12.5, b: 1, c: 'muted' }) }),
    },
    {
      t: 'Start the axis at 90 and it looks like doubling', b: ['The same data with the axis starting at 90: the bars become 5 and 10 units tall. November now looks twice as big.', 'The visual effect (100% bigger) is about 19 times the real effect (5.3%). That ratio is the lie factor.'],
      n: 'For bar charts, start the axis at zero.',
      warn: true,
      s: mg(bars('m', [5 / 4, 10 / 4], { x: 4.8, y: 0, dx: 1.8, w: 1.1, d: 1.1, c: 'coral', labels: ['Oct · 95', 'Nov · 100'] }), { mt: T('axis starts at 90', 4.4, -1.8, { z: 3.4, fs: 12.5, b: 1, c: 'coral' }) }),
    },
    {
      t: 'Pick the chart from the question', b: ['<b>Comparing items?</b> Bars. <b>Change over time?</b> A line. <b>Parts of a whole?</b> A stacked bar. <b>How values are spread?</b> A histogram.', 'Choose by the question first, then make it look good.'],
      n: 'A trend over 12 weeks is a line, not 12 separate bars.',
      clear: true,
      s: { ...Object.fromEntries([0.6, 1.0, 0.9, 1.4, 1.7, 2.3].map((v, i) => ['w' + i, O(i * 1.0, -3.2, { z: v, r: 0.13, c: 'green', noshadow: 1 })])), lt: T('trend → line', 2.4, -3.2, { z: 3.4, fs: 12.5, c: 'green', b: 1 }), ...bars('c', [1.6, 1.1, 0.7], { x: 0.5, y: 3.4, dx: 1.3, w: 0.8, d: 0.8, c: 'blue', labels: ['Sarees', 'Phones', 'Bedsheets'] }), ct: T('compare → bars', 1.8, 3.4, { z: 2.6, fs: 12.5, c: 'blue', b: 1 }) },
      l: Object.fromEntries([0, 1, 2, 3, 4].map((i) => ['wl' + i, L('w' + i, 'w' + (i + 1), { c: 'green', na: 1, sw: 2 })])),
    },
    {
      t: 'Say the finding in the title', b: ['"Monthly sales" names a topic. <b>"Saree sales rose 5% in November"</b> states the finding, so the reader knows what to look for.', 'Label axes with units (₹ lakh), start bars at zero, and note the data source and date.'],
      n: 'A good chart can be understood in five seconds.',
      s: { title: T('Saree sales rose 5% in November', -2.6, -2.6, { z: 3.4, fs: 15, b: 1 }) },
    },
  ],
  math: {
    blocks: [
      { h: 'Lie factor', sub: 'Edward Tufte’s measure of visual exaggeration', f: 'lie factor = (size of effect shown in the chart) / (size of effect in the data)', p: 'A value near 1 is honest. Above about 1.05 or below 0.95, the chart distorts.' },
      { h: 'Relative change', f: 'change = (new − old) / old' },
    ],
    example: {
      intro: 'Compute the lie factor of the truncated chart.',
      steps: ['Data effect: (100 − 95) / 95 ≈ <b>0.053</b>, a 5.3% increase.', 'With the axis starting at 90, bar heights are 95 − 90 = 5 and 100 − 90 = 10.', 'Shown effect: (10 − 5) / 5 = <b>1.0</b>, a 100% increase.', 'Lie factor = 1.0 / 0.053 ≈ <b>19</b>. The chart exaggerates the change about nineteen times.'],
    },
  },
  code: {
    scratch: { why: 'A text bar chart: the bar length is the value, nothing else.', src: `sales = {"Oct": 95, "Nov": 100}

print("Honest (axis from 0, 1 block = 5 lakh):")
for month, value in sales.items():
    print(f"{month} {'█' * (value // 5)} {value}")

print("\\nTruncated (axis from 90, 1 block = 0.5 lakh):")
for month, value in sales.items():
    print(f"{month} {'█' * int((value - 90) * 2)} {value}")` },
    library: { why: 'Matplotlib: the honest chart beside the misleading one.', src: `import matplotlib.pyplot as plt

months, sales = ["Oct", "Nov"], [95, 100]
fig, (a, b) = plt.subplots(1, 2, figsize=(7, 3))

a.bar(months, sales, color="#4a56ec")
a.set_ylim(0, 110)
a.set_title("Honest: axis from 0")
a.set_ylabel("Sales (₹ lakh)")

b.bar(months, sales, color="#e8492b")
b.set_ylim(90, 101)
b.set_title("Misleading: axis from 90")

fig.tight_layout()
show(fig)` },
    prod: { why: 'A chart helper that enforces a zero baseline and a finding-style title.', src: `import matplotlib.pyplot as plt


def bar_chart(labels: list[str], values: list[float], finding: str, unit: str):
    """Bar chart with a zero baseline, a finding as the title, and a labelled axis."""
    if len(labels) != len(values):
        raise ValueError("labels and values must have the same length")
    if any(v < 0 for v in values):
        raise ValueError("use a diverging chart for negative values")
    fig, ax = plt.subplots(figsize=(5, 3))
    ax.bar(labels, values, color="#4a56ec")
    ax.set_ylim(0, max(values) * 1.15)
    ax.set_title(finding, loc="left", fontweight="bold")
    ax.set_ylabel(unit)
    ax.spines[["top", "right"]].set_visible(False)
    for i, v in enumerate(values):
        ax.text(i, v, f"{v:g}", ha="center", va="bottom")
    return fig


fig = bar_chart(["Oct", "Nov"], [95, 100], "Saree sales rose 5% in November", "₹ lakh")
show(fig)` },
  },
  industry: {
    when: ['Exploring data (for yourself) and explaining results (for others).', 'Dashboards that leaders read in seconds.', 'Model evaluation: loss curves, confusion matrices, error plots.'],
    baseline: 'For any chart, write the one-sentence finding first. If you cannot, you are not ready to draw it.',
    tools: ['Matplotlib and seaborn in notebooks', 'Plotly for interactive charts', 'BI tools such as Power BI, Tableau, Metabase or Superset'],
    tradeoffs: ['Exploration charts can be quick and rough; presentation charts need care and labels.', 'Interactive dashboards invite exploration but can hide the main message.'],
    failures: ['Truncated bar axes exaggerating small changes.', 'Pie charts with many slices that nobody can compare.', 'Dual-axis charts that suggest relationships which are not there.', 'Missing units, dates or sources.'],
    shopsense: 'The Sales Insights Pipeline’s weekly dashboard uses finding-style titles and zero-based bars, so Jones and finance read the same story from the same numbers.',
    interview: [
      ['When would you use a line chart instead of bars?', 'For a continuous change over time, where the trend between points matters. Bars suit comparing separate categories.'],
      ['Why should bar charts start at zero?', 'Viewers compare bar lengths. Starting elsewhere changes the ratios and exaggerates differences; lines can use a tighter range because they show change, not size.'],
      ['How do you make a chart for executives?', 'One message per chart, a title stating the finding, minimal decoration, clear units, the key number highlighted, and the source noted.'],
    ],
  },
  quiz: [
    { q: 'Sales went from 95 to 100. A bar chart with its axis starting at 90 shows bars of height 5 and 10. What is the lie factor, roughly?', opts: ['1', '5', '19', '100'], a: 2, why: 'Shown change 100%, real change 5.3%: 1.0 / 0.053 ≈ 19.' },
    { q: 'Which chart best shows weekly orders over 12 weeks?', opts: ['Pie chart', 'Line chart', 'Twelve separate pie charts', 'A table only'], a: 1, why: 'A line shows change over time and the trend between points.' },
    { q: 'Which is the best chart title?', opts: ['Sales', 'Monthly sales chart', 'Saree sales rose 5% in November', 'Figure 1'], a: 2, why: 'It states the finding, so the reader knows what to see.' },
    { q: 'Why is a pie chart with 12 slices a poor choice?', opts: ['Pies cannot show 12 values', 'People compare angles and small slices badly', 'Pies are always wrong', 'It uses too much ink'], a: 1, why: 'Humans compare lengths far better than angles; use sorted bars instead.' },
    { q: 'For which chart type is starting the axis above zero usually acceptable?', opts: ['Bar chart', 'Line chart showing change over time', 'Stacked bar', 'Pie chart'], a: 1, why: 'Lines encode change through slope, not length, so a tighter range can be fine if labelled.' },
  ],
  exercise: {
    task: ['Write <code>lie_factor(old, new, baseline)</code>: the effect shown by bars drawn from <code>baseline</code>, divided by the real effect. Then compute it for old = 95, new = 100, baseline = 90.'],
    starter: `def lie_factor(old, new, baseline):
    # real effect: (new - old) / old
    # shown effect: ((new - baseline) - (old - baseline)) / (old - baseline)
    pass


print(lie_factor(95, 100, 90))`,
    check: `assert abs(lie_factor(95, 100, 90) - 19.0) < 0.01
assert abs(lie_factor(95, 100, 0) - 1.0) < 1e-9, "an axis from zero is honest"`,
    solution: `def lie_factor(old, new, baseline):
    real = (new - old) / old
    shown = ((new - baseline) - (old - baseline)) / (old - baseline)
    return shown / real


print(round(lie_factor(95, 100, 90), 1))`,
    hint: 'Follow the two comments in the starter code, then divide shown by real.',
  },
};

// ===================================================================== P0.10
const l10 = {
  id: 'p0-10', title: 'The EDA workflow', time: '40 minutes',
  sub: 'A repeatable path through any new dataset: shape, quality, distributions, relationships, then findings written as decisions.',
  learn: ['Run exploratory data analysis (EDA) in a fixed, repeatable order', 'Measure a relationship with correlation and interpret it carefully', 'Write findings as decisions someone can act on'],
  legend: [[SYS, 'workflow step'], [DATA, 'data'], [GOOD, 'finding']],
  steps: [
    {
      t: 'Start with the question', b: ['Jones asks: <i>does a bigger discount sell more sarees?</i> EDA explores the data with that question in mind, instead of plotting everything.'],
      n: 'EDA without a question becomes a pile of charts nobody uses.',
      s: { jones: P(-1.6, 1.4, { c: 'teal', sk: 1, s: 1.45, t: 'Jones', mood: 'thinking', pose: 'think' }), ask: Bub('Do bigger discounts\nsell more sarees?', -1.6, 1.4, { z: 3.3, c: 'teal' }) },
    },
    {
      t: '1 · Shape and types', b: ['How many rows and columns? Is each column the right type? <code>df.shape</code>, <code>df.dtypes</code>, <code>df.head()</code>.'],
      n: 'Five steps, always in the same order.',
      s: { ask: null, jones: { mood: 'neutral', pose: '' }, ...row('st', ['shape', 'quality', 'spread', 'relations', 'findings'], { x: 0.8, y: 0, dx: 1.9, c: 'slate', w: 1.7, d: 1.1, fs: 9.5 }), st0: { k: 'tile', t: 'shape', x: 0.8, y: 0, w: 1.7, d: 1.1, fs: 9.5, c: 'teal', hl: 1 } },
    },
    {
      t: '2 · Quality', b: ['Missing values, duplicates, impossible values, odd categories. Everything from lessons P0.06 to P0.08 happens here.'],
      n: 'Fix or flag quality problems before trusting any pattern.',
      s: { st0: { hl: 0 }, st1: { c: 'teal', hl: 1 } },
    },
    {
      t: '3 · Distributions', b: ['Look at each important column alone: histograms, value counts, median and spread. Is it skewed? Are there clusters?'],
      n: 'Here, most orders have small discounts; few have 20%.',
      s: { st1: { hl: 0 }, st2: { c: 'teal', hl: 1 }, ...bars('hb', [1.6, 1.2, 0.8, 0.5, 0.25], { x: 3.4, y: 3.4, dx: 0.7, w: 0.5, d: 0.5, c: 'blue' }) },
    },
    {
      t: '4 · Relationships', b: ['Now look at pairs: discount against quantity. Here, quantity rises with discount; the correlation is about 0.97.', 'But correlation is not causation: bigger discounts also happened during festivals, when people buy more anyway.'],
      n: 'Check for a hidden third factor (here, festivals) before concluding.',
      warn: true,
      s: { st2: { hl: 0 }, st3: { c: 'teal', hl: 1 }, ...Object.fromEntries([[0, 0.4], [1, 0.9], [2, 1.6], [3, 1.6], [4, 2.4]].map(([i, z]) => ['sc' + i, O(3.4 + i * 0.8, 3.4, { z: z, r: 0.14, c: 'violet', noshadow: 1 })])), ...off('hb', 5) },
    },
    {
      t: '5 · Findings written as decisions', b: ['Not "here are 30 charts", but: <b>"Discounts above 15% coincide with 40% more units, mostly in festival weeks. Test a 15% discount in a non-festival week before changing pricing."</b>', 'Each finding says what was seen, how sure we are, and what to do next.'],
      n: 'The output of EDA is a decision or a next experiment.',
      s: { st3: { hl: 0 }, st4: { c: 'green', hl: 1 }, note: B('', 4.8, 3.6, { c: 'green', w: 1.3, d: 1.6, h: 0.12, deco: 'doc' }), jones: { mood: 'happy' } },
      l: { n: L('note', 'jones', { c: 'green', bend: -0.8 }) },
    },
  ],
  math: {
    blocks: [
      { h: 'Summary statistics', f: 'mean x̄ = Σx / n\nstandard deviation s = √( Σ(x − x̄)² / (n − 1) )\nmedian, Q1, Q3 from the sorted values' },
      { h: 'Pearson correlation', sub: 'Strength of a straight-line relationship, from −1 to 1', f: 'r = Σ(x − x̄)(y − ȳ) / √( Σ(x − x̄)² · Σ(y − ȳ)² )', p: 'r near 0 means no linear relationship; it does not rule out a curved one. And r never proves cause.' },
    ],
    example: {
      intro: 'Correlation between discount (%) and units sold.',
      steps: ['Discount x = <code>0, 5, 10, 15, 20</code>; units y = <code>10, 12, 15, 15, 18</code>. Means: x̄ = 10, ȳ = 14.', 'Deviations: x − x̄ = −10, −5, 0, 5, 10; y − ȳ = −4, −2, 1, 1, 4.', 'Σ(x − x̄)(y − ȳ) = 40 + 10 + 0 + 5 + 40 = <b>95</b>. Σ(x − x̄)² = 250; Σ(y − ȳ)² = 38.', 'r = 95 / √(250 × 38) = 95 / 97.47 ≈ <b>0.97</b>: a strong positive linear relationship, but not proof that discounts cause sales.'],
    },
  },
  code: {
    scratch: { why: 'Mean, standard deviation and correlation from first principles.', src: `from math import sqrt

discount = [0, 5, 10, 15, 20]
units = [10, 12, 15, 15, 18]

def mean(v):
    return sum(v) / len(v)

mx, my = mean(discount), mean(units)
cov = sum((x - mx) * (y - my) for x, y in zip(discount, units))
sx = sqrt(sum((x - mx) ** 2 for x in discount))
sy = sqrt(sum((y - my) ** 2 for y in units))

print("Mean units:", my)
print("Std dev of units:", round(sqrt(sum((y - my) ** 2 for y in units) / (len(units) - 1)), 2))
print("Correlation r:", round(cov / (sx * sy), 3))` },
    library: { why: 'The five EDA steps with pandas, in order.', src: `import pandas as pd

df = pd.DataFrame({
    "week": range(1, 9),
    "discount": [0, 5, 10, 15, 20, 5, 0, 20],
    "festival": [False, False, False, True, True, False, False, True],
    "units": [10, 12, 15, 15, 18, 11, 9, 19],
})

print("1. shape:", df.shape)
print("2. missing:", int(df.isna().sum().sum()), "| duplicates:", int(df.duplicated().sum()))
print("3. distribution of units:")
print(df["units"].describe().round(2))
print("4. correlation discount vs units:", round(df["discount"].corr(df["units"]), 3))
print("   mean units by festival:")
print(df.groupby("festival")["units"].mean())` },
    prod: { why: 'A reusable EDA summary that a pipeline can run on every new dataset.', src: `import pandas as pd


def eda_summary(df: pd.DataFrame, target: str) -> dict:
    """A compact, repeatable first look at a dataset."""
    numeric = df.select_dtypes("number")
    corr = numeric.corr()[target].drop(target).round(3) if target in numeric else pd.Series(dtype=float)
    return {
        "rows": len(df),
        "columns": df.shape[1],
        "missing_by_column": df.isna().sum()[lambda s: s > 0].to_dict(),
        "duplicate_rows": int(df.duplicated().sum()),
        "target_median": float(df[target].median()),
        "correlation_with_target": corr.to_dict(),
    }


def test_eda_summary() -> None:
    df = pd.DataFrame({"x": [1, 2, 3], "y": [2, 4, 6]})
    s = eda_summary(df, "y")
    assert s["rows"] == 3 and s["correlation_with_target"]["x"] == 1.0


test_eda_summary()
df = pd.DataFrame({"discount": [0, 5, 10, 15, 20], "units": [10, 12, 15, 15, 18]})
print(eda_summary(df, "units"))` },
  },
  industry: {
    when: ['At the start of every project and whenever a new data source arrives.', 'Before choosing features or a model.', 'When a metric moves unexpectedly and someone asks why.'],
    baseline: 'Follow the same five steps every time, keep the notebook, and finish with three to five written findings, each with a recommended action.',
    tools: ['pandas describe, value_counts, corr', 'Matplotlib and seaborn for quick plots', 'ydata-profiling for automatic first reports', 'Notebooks shared with the team'],
    tradeoffs: ['Automatic profiling reports are fast but generic; your question decides what matters.', 'Deep EDA finds more but delays delivery; time-box it.'],
    failures: ['Concluding cause from correlation (the festival effect).', 'Exploring the test data and then using what you saw to tune the model.', 'Endless charts with no written conclusion.'],
    shopsense: 'Phase 0 ends with EDA on the cleaned ShopSense orders: findings about festival spikes and B2B orders feed directly into the churn and demand models of Phase 1.',
    interview: [
      ['Walk me through how you explore a new dataset.', 'Clarify the question; check shape and types; check quality (missing, duplicates, invalid values); study distributions; study relationships with the target; write findings with confidence and next actions.'],
      ['What does a correlation of 0.97 tell you?', 'A strong positive linear relationship. It does not prove cause; look for confounders such as seasonality, and test with an experiment if the decision matters.'],
      ['How do you avoid data leakage during EDA?', 'Split off the test set first and explore only the training data, so insights do not silently tune the model to the test set.'],
    ],
  },
  quiz: [
    { q: 'What is the right order for EDA?', opts: ['Model, then clean, then look', 'Shape → quality → distributions → relationships → findings', 'Charts first, question later', 'Relationships first'], a: 1, why: 'Each step relies on the previous one being done.' },
    { q: 'Discount and units sold have r = 0.97. What can you conclude?', opts: ['Discounts cause sales', 'There is a strong linear relationship; check for confounders before concluding cause', 'There is no relationship', 'The data is wrong'], a: 1, why: 'Correlation is not causation. Here festivals drive both discounts and buying.' },
    { q: 'r is close to 0. What does that mean?', opts: ['No relationship of any kind', 'No straight-line relationship; a curved one may still exist', 'The variables are identical', 'A perfect relationship'], a: 1, why: 'Pearson r measures only linear relationships.' },
    { q: 'What should the output of EDA be?', opts: ['As many charts as possible', 'Findings with a confidence level and a recommended action', 'A trained model', 'A cleaned CSV only'], a: 1, why: 'EDA exists to inform decisions and next experiments.' },
    { q: 'Why explore only the training data?', opts: ['It is smaller', 'To avoid leaking test-set information into your modelling choices', 'Test data is always clean', 'pandas requires it'], a: 1, why: 'Looking at test data biases your choices and makes evaluation over-optimistic.' },
  ],
  exercise: {
    task: ['For <code>df</code>, compute <code>r</code>: the correlation between <code>ad_spend</code> and <code>orders</code> (rounded to 2 decimals), and <code>n_missing</code>: the total number of missing values in the whole table.'],
    starter: `import numpy as np
import pandas as pd

df = pd.DataFrame({
    "ad_spend": [10, 20, 30, 40, 50],
    "orders": [100, 130, 150, 190, 210],
    "rating": [4.1, np.nan, 4.3, np.nan, 4.0],
})

r = None
n_missing = None

print(r, n_missing)`,
    check: `assert r == round(df["ad_spend"].corr(df["orders"]), 2) and r >= 0.99, "round r to 2 decimals"
assert n_missing == 2`,
    solution: `import numpy as np
import pandas as pd

df = pd.DataFrame({
    "ad_spend": [10, 20, 30, 40, 50],
    "orders": [100, 130, 150, 190, 210],
    "rating": [4.1, np.nan, 4.3, np.nan, 4.0],
})

r = round(df["ad_spend"].corr(df["orders"]), 2)
n_missing = int(df.isna().sum().sum())

print(r, n_missing)`,
    hint: '<code>df["a"].corr(df["b"])</code> gives Pearson r. <code>df.isna().sum().sum()</code> counts all missing values.',
  },
};

export default [l6, l7, l8, l9, l10];
