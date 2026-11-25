import { B, Tl, O, T, Z, Cy, L, row, mg } from '../kit.js';

const DATA = '#c4cdfb', GOOD = '#c1e4b1', BAD = '#ffc4b1', SIGNAL = '#fddf98', NAME = '#d9cafb';

// ===================================================================== W.01
const w01 = {
  id: 'w-01', title: 'Values, variables and types', time: '25 minutes',
  sub: 'Every Python program moves values around. Learn what a value is, how a name points to it, and why the type decides what you can do with it.',
  learn: ['Create variables and explain that a name points to a value', 'Recognise int, float, str, bool and None, and convert between them', 'Predict what happens when two names share one value'],
  legend: [[NAME, 'name'], [DATA, 'value'], [SIGNAL, 'type'], [BAD, 'error']],
  steps: [
    {
      t: 'A name points to a value', b: ['<code>price = 499</code> creates the value 499 and attaches the name <b>price</b> to it. The name is a label, not a box that holds the number.'],
      n: 'Read = as "now refers to", not "equals".',
      s: { n0: Tl('price', 0, 0, { top: 1, c: 'violet', w: 1.6, d: 0.9, fs: 11 }), v0: B('499', 4.0, 0, { c: 'blue', w: 1.2, d: 1.0, h: 0.6, fs: 12 }) },
      l: { a: L('n0', 'v0', { c: 'violet', flow: 1 }) },
    },
    {
      t: 'Every value has a type', b: ['499 is an <b>int</b>, 499.0 a <b>float</b>, "Saree" a <b>str</b>, True a <b>bool</b>, and None means "no value yet". <code>type(x)</code> tells you which.', 'The type decides what operations make sense: you can add two numbers, or join two strings, but not add a number to a string.'],
      n: 'Python checks types when the line runs, not before.',
      s: { v0: { sub: 'int' }, n1: Tl('name', 0, 2.6, { top: 1, c: 'violet', w: 1.6, d: 0.9, fs: 11 }), v1: B('"Saree"', 4.0, 2.6, { c: 'blue', w: 1.5, d: 1.0, h: 0.6, fs: 11, sub: 'str' }), n2: Tl('in_stock', 0, 5.2, { top: 1, c: 'violet', w: 1.6, d: 0.9, fs: 11 }), v2: B('True', 4.0, 5.2, { c: 'blue', w: 1.2, d: 1.0, h: 0.6, fs: 12, sub: 'bool' }) },
      l: { b: L('n1', 'v1', { c: 'violet', flow: 1 }), c: L('n2', 'v2', { c: 'violet', flow: 1 }) },
    },
    {
      t: 'Reassigning moves the label', b: ['<code>price = 449</code> does not change 499. It creates 449 and moves the label. The old value is cleaned up if nothing else points to it.'],
      n: 'Numbers and strings never change in place: they are immutable.',
      s: { v0b: B('449', 6.4, -1.6, { c: 'green', w: 1.2, d: 1.0, h: 0.6, fs: 12, sub: 'int' }), v0: { o: 0.35 } },
      l: { a: L('n0', 'v0b', { c: 'violet', flow: 1 }) },
    },
    {
      t: 'Mixing types fails loudly', b: ['<code>"Total: " + 499</code> raises a <b>TypeError</b>. Convert first: <code>"Total: " + str(499)</code>, or better, an f-string: <code>f"Total: {499}"</code>.', 'Input from files and forms always arrives as text. <code>int("499")</code> turns it into a number; <code>int("abc")</code> raises ValueError.'],
      n: 'An error that stops the program is better than a wrong number that does not.',
      warn: true,
      s: { e: T('"Total: " + 499  →  TypeError', 5.6, 8.0, { z: 0.2, fs: 13, b: 1, c: 'coral' }) },
    },
  ],
  math: {
    blocks: [
      { h: 'Core types', f: 'int    499, -3, 1_000_000\nfloat  499.0, 0.1, 1e6\nstr    "Saree", \'S\'\nbool   True, False\nNone   no value yet' },
      { h: 'Conversions', f: 'int("499") → 499      float("4.5") → 4.5\nstr(499) → "499"      bool(0) → False\nint(4.9) → 4 (cuts, does not round)' },
      { h: 'Floats are approximate', f: '0.1 + 0.2 == 0.30000000000000004', p: 'Store money as integer paise, or use <code>decimal.Decimal</code>, never float.' },
    ],
    example: {
      intro: 'An order total from text input.',
      steps: ['The form gives <code>qty = "3"</code> and <code>price = "499"</code> (both strings).', '<code>qty + price</code> gives "3499": strings join, they do not add.', '<code>int(qty) * int(price)</code> gives <b>1497</b>.', '<code>f"Total ₹{int(qty) * int(price):,}"</code> gives "Total ₹1,497".'],
    },
  },
  code: {
    scratch: { why: 'Names, values and types, printed one by one.', src: `price = 499
name = "Cotton saree"
in_stock = True
discount = None

for value in (price, name, in_stock, discount, 4.5):
    print(repr(value), "is", type(value).__name__)

qty = "3"                      # text, as it arrives from a form
print(qty + "499")             # joins text
print(int(qty) * price)        # multiplies numbers` },
    library: { why: 'f-strings, safe conversion and money in paise.', src: `from decimal import Decimal

qty, price_text = "3", "499.50"
total = int(qty) * Decimal(price_text)
print(f"Total: ₹{total:,.2f}")

print(0.1 + 0.2)                        # float rounding
print(Decimal("0.1") + Decimal("0.2"))  # exact

price_paise = 49950                     # integers never drift
print(f"₹{price_paise / 100:,.2f}")` },
    prod: { why: 'A parser that turns form text into a typed value, or explains why it cannot.', src: `def parse_quantity(text: str) -> int:
    """Return a positive whole quantity from user text, or raise ValueError with a clear message."""
    cleaned = text.strip()
    if not cleaned.isdigit():
        raise ValueError(f"quantity must be a whole number, got {text!r}")
    qty = int(cleaned)
    if qty == 0:
        raise ValueError("quantity must be at least 1")
    return qty


for raw in [" 3 ", "0", "two", "12"]:
    try:
        print(repr(raw), "->", parse_quantity(raw))
    except ValueError as err:
        print(repr(raw), "-> error:", err)` },
  },
  industry: {
    when: ['Reading every input: CSV columns, form fields and API payloads arrive as text.', 'Money, quantities and IDs, where the wrong type silently breaks reports.'],
    baseline: 'Convert input to the right type at the edge of your program, once, and fail loudly on bad values.',
    tools: ['Built-ins: int, float, str, bool, type, isinstance', 'decimal.Decimal for money', 'f-strings for formatting'],
    tradeoffs: ['Python’s dynamic typing is quick to write but lets type mistakes reach run time; type hints (W.10) catch many earlier.'],
    failures: ['Prices stored as float drift by fractions of a paisa and reports stop reconciling.', 'IDs like "007" read as int lose their leading zeros.', 'Empty strings converted with float("") crash a nightly job.'],
    shopsense: 'Phase 0’s pipeline converts amounts to integer paise and order IDs to strings on load, so every later report adds up.',
    interview: [
      ['What happens when you write a = b for two names?', 'Both names now refer to the same value; no copy is made.'],
      ['Why not use float for money?', 'Binary floats cannot represent most decimal fractions exactly, so sums drift; use integer paise or Decimal.'],
    ],
  },
  quiz: [
    { q: 'What does "3" + "4" give?', opts: ['7', '"34"', 'TypeError', '"7"'], a: 1, why: 'Strings join.' },
    { q: 'What does int(4.9) give?', opts: ['5', '4', '4.9', 'Error'], a: 1, why: 'int cuts towards zero.' },
    { q: 'type(None).__name__ is…', opts: ['"null"', '"NoneType"', '"None"', '"object"'], a: 1, why: 'None has its own type.' },
    { q: 'price = 499, then price = 449. What happened to 499?', opts: ['It became 449', 'The name moved to a new value 449', 'Both exist under price', 'Error'], a: 1, why: 'Names move; ints never change.' },
    { q: 'Best way to store ₹499.50 for exact sums?', opts: ['float 499.5', 'int 49950 paise', 'str "499.50"', 'bool'], a: 1, why: 'Integers are exact.' },
  ],
  exercise: {
    task: ['Write <code>order_total(qty_text, price_paise)</code> that converts <code>qty_text</code> (a string, possibly with spaces) to int and returns the total in paise.'],
    starter: `def order_total(qty_text, price_paise):
    pass


print(order_total(" 3 ", 49950))`,
    check: `assert order_total(" 3 ", 49950) == 149850
assert order_total("1", 100) == 100`,
    solution: `def order_total(qty_text, price_paise):
    return int(qty_text.strip()) * price_paise


print(order_total(" 3 ", 49950))`,
    hint: '<code>int()</code> already ignores surrounding spaces, but <code>.strip()</code> makes it explicit.',
  },
};

// ===================================================================== W.02
const CART = ['saree', 'kurta', 'bedsheet', 'phone'];
const w02 = {
  id: 'w-02', title: 'Lists, tuples and sets', time: '30 minutes',
  sub: 'Three ways to keep many values: lists you can change, tuples you cannot, and sets that keep each item once.',
  learn: ['Index, slice, append and sort a list', 'Choose between list, tuple and set for a job', 'Explain why changing a list through one name changes it for every name'],
  legend: [[DATA, 'item'], [SIGNAL, 'index'], [GOOD, 'selected'], [NAME, 'name']],
  steps: [
    {
      t: 'A list is an ordered row', b: ['<code>cart = ["saree", "kurta", "bedsheet", "phone"]</code>. Positions start at <b>0</b>. <code>cart[0]</code> is "saree"; <code>cart[-1]</code> is the last item.'],
      n: 'Index numbers sit above each item.',
      s: mg(row('c', CART, { x: 0, y: 0, dx: 1.9, c: 'blue', w: 1.7, d: 1.0, top: 1, fs: 10.5 }), Object.fromEntries(CART.map((_, i) => [`i${i}`, T(String(i), i * 1.9, -1.0, { z: 0.3, fs: 12, b: 1, c: 'amber' })]))),
    },
    {
      t: 'Slices take a range', b: ['<code>cart[1:3]</code> gives items 1 and 2: the end is not included. <code>cart[:2]</code> is the first two.'],
      n: 'Start included, end excluded: cart[1:3] has 3 − 1 = 2 items.',
      s: { c1: { c: 'green' }, c2: { c: 'green' } },
    },
    {
      t: 'Lists change in place', b: ['<code>cart.append("footwear")</code> adds to the end; <code>cart.sort()</code> reorders the same list. If <code>saved = cart</code>, both names see the change: there is only one list.', 'Make a copy with <code>cart.copy()</code> or <code>list(cart)</code> when you need one.'],
      n: 'Two names, one list.',
      clear: true,
      s: mg(row('c', [...CART, 'footwear'], { x: 0, y: 0, dx: 1.9, c: 'blue', w: 1.7, d: 1.0, top: 1, fs: 10.5 }), { c4: { c: 'green' }, n0: Tl('cart', -1.0, 2.4, { top: 1, c: 'violet', w: 1.4, d: 0.8, fs: 10.5 }), n1: Tl('saved', 2.6, 2.4, { top: 1, c: 'violet', w: 1.4, d: 0.8, fs: 10.5 }) }),
      l: { a: L('n0', 'c0', { c: 'violet', flow: 1 }), b: L('n1', 'c0', { c: 'violet', flow: 1 }) },
    },
    {
      t: 'Tuples and sets', b: ['A <b>tuple</b> <code>(13.0827, 80.2707)</code> is a fixed record: it cannot change, so it is safe to share and can be a dictionary key.', 'A <b>set</b> keeps each item once and answers "is it in?" instantly: <code>{"Chennai", "Coimbatore", "Chennai"}</code> has two items.'],
      n: 'List: ordered and changeable. Tuple: ordered and fixed. Set: unique, unordered, fast membership.',
      clear: true,
      s: { tp: Tl('tuple\n(13.08, 80.27)', 0, 0, { top: 1, c: 'amber', w: 2.6, d: 1.3, fs: 10.5 }), st: Tl('set\n{Chennai, Coimbatore}', 3.6, 0, { top: 1, c: 'green', w: 3.2, d: 1.3, fs: 10.5 }) },
    },
  ],
  math: {
    blocks: [
      { h: 'Indexing and slicing', f: 'xs[i]        item i (0-based)\nxs[-1]       last item\nxs[a:b]      items a … b−1 (b − a of them)\nxs[::-1]     reversed copy' },
      { h: 'Cost of common operations', f: 'list   append O(1)   x in list O(n)   sort O(n log n)\nset    add O(1)      x in set  O(1) on average', p: 'For 1 million items, "x in list" may check every item; "x in set" checks about one.' },
    ],
    example: {
      intro: 'cart = ["saree", "kurta", "bedsheet", "phone"]',
      steps: ['<code>cart[1]</code> → "kurta".', '<code>cart[-2]</code> → "bedsheet".', '<code>cart[1:3]</code> → ["kurta", "bedsheet"].', '<code>len(set(cart + ["saree"]))</code> → <b>4</b>: the repeat is dropped.'],
    },
  },
  code: {
    scratch: { why: 'Indexing, slicing, changing and copying a list.', src: `cart = ["saree", "kurta", "bedsheet", "phone"]
print(cart[0], cart[-1], cart[1:3])

saved = cart                 # same list, second name
backup = cart.copy()         # a real copy
cart.append("footwear")
print("saved: ", saved)
print("backup:", backup)

cities = {"Chennai", "Coimbatore", "Chennai"}
print(len(cities), "Madurai" in cities)
location = (13.0827, 80.2707)
print("lat", location[0])` },
    library: { why: 'Sorting with keys, counting and de-duplicating while keeping order.', src: `from collections import Counter

orders = [("saree", 1299), ("kurta", 799), ("phone", 15999), ("kurta", 899)]
print(sorted(orders, key=lambda o: o[1], reverse=True)[:2])   # two most expensive

items = [name for name, _ in orders]
print(Counter(items).most_common(1))

unique_in_order = list(dict.fromkeys(items))
print(unique_in_order)` },
    prod: { why: 'Why sets matter: membership checks on 200,000 IDs.', src: `import time

blocked = [f"C{i:06d}" for i in range(200_000)]
blocked_set = set(blocked)
incoming = [f"C{i:06d}" for i in range(199_000, 201_000)]

t0 = time.perf_counter(); hits_list = sum(c in blocked for c in incoming[:200]); t_list = time.perf_counter() - t0
t0 = time.perf_counter(); hits_set = sum(c in blocked_set for c in incoming[:200]); t_set = time.perf_counter() - t0
print(f"list: {hits_list} hits, set: {hits_set} hits")
print("set is faster:", t_set < t_list)` },
  },
  industry: {
    when: ['Lists for ordered rows: a cart, a batch of orders.', 'Sets for de-duplication and fast "seen before?" checks.', 'Tuples for fixed records and dictionary keys.'],
    baseline: 'Start with a list; switch to a set the moment you check membership in a loop.',
    tools: ['list, tuple, set', 'sorted with key=', 'collections.Counter'],
    tradeoffs: ['Sets lose order and need hashable items.', 'Tuples cannot be edited, which is the point.'],
    failures: ['A shared list changed by one function surprises another (aliasing).', '"x in big_list" inside a loop turns a 1-second job into an hour.'],
    shopsense: 'The Phase 0 loader keeps a set of order IDs already loaded, so a repeated file is spotted in one check per row.',
    interview: [
      ['List vs tuple?', 'Lists are mutable; tuples are immutable, hashable when their contents are, and signal a fixed record.'],
      ['Why is "in" faster on a set?', 'Sets use a hash table, so lookup is O(1) on average instead of scanning every item.'],
    ],
  },
  quiz: [
    { q: 'xs = [10, 20, 30, 40]. xs[1:3]?', opts: ['[10, 20]', '[20, 30]', '[20, 30, 40]', '[30, 40]'], a: 1, why: 'End excluded.' },
    { q: 'xs[-1]?', opts: ['10', '40', 'Error', '30'], a: 1, why: 'Last item.' },
    { q: 'a = [1]; b = a; b.append(2). a is…', opts: ['[1]', '[1, 2]', '[2]', 'Error'], a: 1, why: 'One list, two names.' },
    { q: 'len({"a", "b", "a"})?', opts: ['3', '2', '1', 'Error'], a: 1, why: 'Sets drop repeats.' },
    { q: 'Which can be a dictionary key?', opts: ['[1, 2]', '(1, 2)', '{1, 2}', 'All'], a: 1, why: 'Keys must be hashable.' },
  ],
  exercise: {
    task: ['Write <code>new_customers(today, seen)</code> returning a sorted list of IDs in <code>today</code> that are not in <code>seen</code>, each once.'],
    starter: `def new_customers(today, seen):
    pass


print(new_customers(["C3", "C1", "C3", "C9"], ["C1", "C2"]))`,
    check: `assert new_customers(["C3", "C1", "C3", "C9"], ["C1", "C2"]) == ["C3", "C9"]
assert new_customers([], ["C1"]) == []`,
    solution: `def new_customers(today, seen):
    return sorted(set(today) - set(seen))


print(new_customers(["C3", "C1", "C3", "C9"], ["C1", "C2"]))`,
    hint: 'Set difference: <code>set(a) - set(b)</code>, then <code>sorted()</code>.',
  },
};

// ===================================================================== W.03
const w03 = {
  id: 'w-03', title: 'Dictionaries', time: '30 minutes',
  sub: 'Look things up by name instead of position. Dictionaries power JSON, configs, counts and almost every record you will handle.',
  learn: ['Create, read, update and loop over a dictionary', 'Use get, setdefault and Counter for safe lookups and counting', 'Represent nested records like an order with items'],
  legend: [[NAME, 'key'], [DATA, 'value'], [GOOD, 'updated'], [BAD, 'missing key']],
  steps: [
    {
      t: 'Keys point to values', b: ['<code>order = {"id": "O-1042", "city": "Coimbatore", "total": 1299}</code>. Ask by key: <code>order["city"]</code> gives "Coimbatore".'],
      n: 'Keys must be unique and hashable (str, int, tuple).',
      s: { ...row('k', ['"id"', '"city"', '"total"'], { x: 0, y: 0, dx: 0, dy: 2.0, c: 'violet', w: 1.6, d: 1.0, top: 1, fs: 10.5 }), ...row('v', ['"O-1042"', '"Coimbatore"', '1299'], { x: 4.4, y: 0, dx: 0, dy: 2.0, c: 'blue', w: 2.2, d: 1.0, top: 1, fs: 10.5 }) },
      l: { a: L('k0', 'v0', { c: 'violet', flow: 1 }), b: L('k1', 'v1', { c: 'violet', flow: 1 }), c: L('k2', 'v2', { c: 'violet', flow: 1 }) },
    },
    {
      t: 'Update and add', b: ['<code>order["total"] = 1199</code> replaces a value; <code>order["status"] = "shipped"</code> adds a new key.'],
      n: 'Same syntax for both: if the key exists it is replaced, otherwise added.',
      s: { v2: { t: '1199', c: 'green' }, k3: Tl('"status"', 0, 6.0, { top: 1, c: 'violet', w: 1.6, d: 1.0, fs: 10.5 }), v3: Tl('"shipped"', 4.4, 6.0, { top: 1, c: 'green', w: 2.2, d: 1.0, fs: 10.5 }) },
      l: { d: L('k3', 'v3', { c: 'green', flow: 1 }) },
    },
    {
      t: 'Missing keys', b: ['<code>order["coupon"]</code> raises <b>KeyError</b>. <code>order.get("coupon")</code> returns None, and <code>order.get("coupon", "NONE")</code> a default.'],
      n: 'Use [] when the key must exist; get() when it may not.',
      warn: true,
      s: { k4: Tl('"coupon"', 0, 8.0, { top: 1, c: 'coral', w: 1.6, d: 1.0, fs: 10.5 }), e4: T('KeyError (or .get → None)', 4.6, 8.0, { z: 0.3, fs: 12, b: 1, c: 'coral' }) },
    },
    {
      t: 'Counting and nesting', b: ['Count orders per city by adding 1 to <code>counts[city]</code>; <code>collections.Counter</code> does it in one line.', 'Values can be lists or other dictionaries: an order holds a list of items, each a dictionary. This is exactly what JSON looks like.'],
      n: 'Most API responses are dictionaries of lists of dictionaries.',
      clear: true,
      s: { o: Tl('order', 0, 0, { top: 1, c: 'violet', w: 1.6, d: 1.0, fs: 11 }), it: Tl('"items": [ … ]', 3.2, 0, { top: 1, c: 'blue', w: 2.6, d: 1.0, fs: 10.5 }), i0: Tl('SAR-1 × 1', 7.0, -1.4, { top: 1, c: 'blue', w: 2.0, d: 1.0, fs: 10 }), i1: Tl('KUR-7 × 2', 7.0, 1.4, { top: 1, c: 'blue', w: 2.0, d: 1.0, fs: 10 }) },
      l: { a: L('o', 'it', { c: 'violet', flow: 1 }), b: L('it', 'i0', { c: 'muted' }), c: L('it', 'i1', { c: 'muted' }) },
    },
  ],
  math: {
    blocks: [
      { h: 'Core operations', f: 'd[k]            read (KeyError if missing)\nd.get(k, dflt)  read with default\nd[k] = v        add or replace\nk in d          membership, O(1)\nfor k, v in d.items(): …' },
      { h: 'Order', f: 'Dictionaries keep insertion order (Python 3.7+).' },
    ],
    example: {
      intro: 'Count orders by city: ["Chennai", "Coimbatore", "Chennai"].',
      steps: ['Start with <code>counts = {}</code>.', '"Chennai": not present, so get(…, 0) + 1 = 1.', '"Coimbatore": 1.', '"Chennai" again: 1 + 1 = 2. Result <b>{"Chennai": 2, "Coimbatore": 1}</b>.'],
    },
  },
  code: {
    scratch: { why: 'Reading, updating, safe lookups and counting by hand.', src: `order = {"id": "O-1042", "city": "Coimbatore", "total": 1299}
print(order["city"])
order["total"] = 1199
order["status"] = "shipped"
print(order)
print(order.get("coupon", "NONE"))

counts = {}
for city in ["Chennai", "Coimbatore", "Chennai"]:
    counts[city] = counts.get(city, 0) + 1
print(counts)` },
    library: { why: 'Counter, defaultdict and JSON round trips.', src: `import json
from collections import Counter, defaultdict

cities = ["Chennai", "Coimbatore", "Chennai", "Madurai", "Chennai"]
print(Counter(cities).most_common(2))

orders_by_city = defaultdict(list)
for oid, city in [("O1", "Chennai"), ("O2", "Madurai"), ("O3", "Chennai")]:
    orders_by_city[city].append(oid)
print(dict(orders_by_city))

text = '{"id": "O-1042", "items": [{"sku": "SAR-1", "qty": 1}, {"sku": "KUR-7", "qty": 2}]}'
order = json.loads(text)
print(sum(item["qty"] for item in order["items"]), "items")` },
    prod: { why: 'Validating a JSON order before trusting it.', src: `import json

REQUIRED = {"id": str, "city": str, "items": list}


def parse_order(text: str) -> dict:
    data = json.loads(text)
    missing = [k for k in REQUIRED if k not in data]
    if missing:
        raise ValueError(f"missing keys: {missing}")
    wrong = [k for k, t in REQUIRED.items() if not isinstance(data[k], t)]
    if wrong:
        raise ValueError(f"wrong types: {wrong}")
    return data


for raw in ['{"id": "O1", "city": "Chennai", "items": []}', '{"id": "O2", "items": "SAR-1"}']:
    try:
        print("ok:", parse_order(raw)["id"])
    except ValueError as err:
        print("rejected:", err)` },
  },
  industry: {
    when: ['Parsing JSON from APIs and event streams.', 'Configs, lookup tables and counts.', 'Grouping records by a key before aggregating.'],
    baseline: 'A plain dict with get(); reach for Counter or defaultdict when you count or group.',
    tools: ['dict, collections.Counter, collections.defaultdict', 'json module', 'pydantic for validated records (later)'],
    tradeoffs: ['Dicts are flexible but nothing stops a typo in a key; dataclasses (W.08) give fixed fields.'],
    failures: ['KeyError at 3 a.m. because one API response skipped a field.', 'get() with a default hiding a real data problem.'],
    shopsense: 'Order events arrive as JSON; Phase 0 validates required keys before loading, and Phase 5’s order agent passes dictionaries as tool arguments.',
    interview: [
      ['How do you count items in Python?', 'collections.Counter, or a dict with get(key, 0) + 1.'],
      ['d[k] vs d.get(k)?', 'd[k] raises KeyError if missing; get returns None or a default.'],
    ],
  },
  quiz: [
    { q: 'd = {"a": 1}. d.get("b", 0)?', opts: ['None', '0', 'KeyError', '1'], a: 1, why: 'Default returned.' },
    { q: 'd["b"] when "b" is missing?', opts: ['None', 'KeyError', '0', '""'], a: 1, why: 'Square brackets require the key.' },
    { q: 'd["a"] = 5 when "a" exists…', opts: ['Adds a second "a"', 'Replaces the value', 'Error', 'Ignored'], a: 1, why: 'Keys are unique.' },
    { q: 'Counter(["x", "y", "x"])["x"]?', opts: ['1', '2', '3', '0'], a: 1, why: 'Two x.' },
    { q: 'Which cannot be a key?', opts: ['"city"', '42', '("a", 1)', '["a", 1]'], a: 3, why: 'Lists are not hashable.' },
  ],
  exercise: {
    task: ['Write <code>revenue_by_city(orders)</code> where each order is a dict with "city" and "total". Return a dict of city → summed total.'],
    starter: `def revenue_by_city(orders):
    pass


orders = [{"city": "Chennai", "total": 1299}, {"city": "Madurai", "total": 799}, {"city": "Chennai", "total": 500}]
print(revenue_by_city(orders))`,
    check: `assert revenue_by_city(orders) == {"Chennai": 1799, "Madurai": 799}
assert revenue_by_city([]) == {}`,
    solution: `def revenue_by_city(orders):
    totals = {}
    for o in orders:
        totals[o["city"]] = totals.get(o["city"], 0) + o["total"]
    return totals


orders = [{"city": "Chennai", "total": 1299}, {"city": "Madurai", "total": 799}, {"city": "Chennai", "total": 500}]
print(revenue_by_city(orders))`,
    hint: 'Same pattern as counting, but add the total instead of 1.',
  },
};

// ===================================================================== W.04
const w04 = {
  id: 'w-04', title: 'Control flow', time: '30 minutes',
  sub: 'Make decisions with if, repeat with for and while, and stop or skip with break and continue.',
  learn: ['Write if / elif / else decisions with clear conditions', 'Loop over items with for, enumerate and zip', 'Use while, break and continue without infinite loops'],
  legend: [[DATA, 'step'], [SIGNAL, 'decision'], [GOOD, 'path taken'], [BAD, 'path skipped']],
  steps: [
    {
      t: 'A decision splits the path', b: ['Delivery fee rule: orders of ₹999 or more ship free; otherwise ₹49. <code>if total >= 999: fee = 0 else: fee = 49</code>.'],
      n: 'Only one branch runs.',
      s: { o: Tl('order ₹1,299', 0, 0, { top: 1, c: 'blue', w: 2.2, d: 1.0, fs: 10.5 }), d: B('total ≥ 999?', 3.4, 0, { c: 'amber', w: 1.8, d: 1.2, h: 0.6, fs: 10 }), y: Tl('fee ₹0', 6.6, -1.4, { top: 1, c: 'green', w: 1.6, d: 1.0, fs: 10.5 }), n: Tl('fee ₹49', 6.6, 1.4, { top: 1, c: 'slate', w: 1.6, d: 1.0, fs: 10.5 }) },
      l: { a: L('o', 'd', { flow: 1 }), b: L('d', 'y', { c: 'green', flow: 1, t: 'yes' }), c: L('d', 'n', { c: 'muted', dash: 1, t: 'no' }) },
    },
    {
      t: 'elif for more than two cases', b: ['Conditions are checked top to bottom and the first true one wins: <code>if total >= 5000: "gold" elif total >= 1000: "silver" else: "standard"</code>.'],
      n: 'Put the most specific condition first.',
      clear: true,
      s: { o: Tl('total ₹1,800', 0, 0, { top: 1, c: 'blue', w: 2.2, d: 1.0, fs: 10.5 }), d2: B('≥ 5000?', 3.6, 0, { c: 'amber', w: 1.6, d: 1.1, h: 0.5, fs: 10 }), d3: B('≥ 1000?', 3.6, 3.0, { c: 'amber', w: 1.6, d: 1.1, h: 0.5, fs: 10 }), g: Tl('gold', 7.0, 0, { top: 1, c: 'slate', w: 1.4, d: 0.9, fs: 10.5 }), s2: Tl('silver', 7.0, 3.0, { top: 1, c: 'green', w: 1.4, d: 0.9, fs: 10.5 }) },
      l: { a0: L('o', 'd2', { flow: 1 }), e: L('d2', 'g', { c: 'muted', dash: 1, t: 'no' }), f: L('d2', 'd3', { c: 'green', flow: 1 }), g2: L('d3', 's2', { c: 'green', flow: 1 }) },
    },
    {
      t: 'for repeats over items', b: ['<code>for order in orders:</code> runs the body once per order. <code>enumerate</code> adds a counter; <code>zip</code> walks two lists together.'],
      n: 'Prefer for over items to for i in range(len(xs)).',
      clear: true,
      s: mg(row('r', ['₹1,299', '₹650', '₹7,400', '₹999'], { x: 0, y: 0, dx: 2.0, c: 'blue', w: 1.7, d: 1.0, top: 1, fs: 10.5 }), { cur: O(0, -1.3, { z: 0.4, r: 0.25, c: 'amber', hl: 1, sub: 'order' }) }),
    },
    {
      t: 'while, break and continue', b: ['<code>while stock > 0:</code> repeats until a condition fails. <code>break</code> leaves the loop early (first order over ₹5,000 found); <code>continue</code> skips to the next item (cancelled orders).', 'Every while loop needs something inside that eventually makes the condition false.'],
      n: 'An infinite loop is the classic while bug.',
      s: { r1: { c: 'slate', t: 'cancelled' }, r2: { c: 'green' }, cur: { x: 4.0 }, br: T('break: found ₹7,400', 3.0, 2.6, { z: 0.2, fs: 12, b: 1, c: 'green' }) },
    },
  ],
  math: {
    blocks: [
      { h: 'Comparisons and logic', f: '==  !=  <  <=  >  >=\nand  or  not\n0 < x <= 10       chained comparison\nx in {"a", "b"}   membership', p: '<code>and</code> stops at the first false value; <code>or</code> at the first true one (short-circuit).' },
      { h: 'Truthiness', f: 'False, None, 0, 0.0, "", [], {}, set()  → false\neverything else → true' },
    ],
    example: {
      intro: 'Loyalty tier for total = 1,800.',
      steps: ['1800 >= 5000? No.', '1800 >= 1000? Yes → <b>"silver"</b>.', 'The else branch is never checked.', 'If the conditions were reversed, 1800 >= 1000 would match first, and a ₹6,000 order would also wrongly get "silver".'],
    },
  },
  code: {
    scratch: { why: 'Fees, tiers, loops, break and continue.', src: `orders = [("O1", 1299, "paid"), ("O2", 650, "cancelled"), ("O3", 7400, "paid"), ("O4", 999, "paid")]

for oid, total, status in orders:
    if status == "cancelled":
        continue
    fee = 0 if total >= 999 else 49
    if total >= 5000:
        tier = "gold"
    elif total >= 1000:
        tier = "silver"
    else:
        tier = "standard"
    print(oid, total, "fee", fee, tier)

for oid, total, _ in orders:
    if total > 5000:
        print("first big order:", oid)
        break` },
    library: { why: 'enumerate, zip, any and all.', src: `names = ["saree", "kurta", "phone"]
stock = [12, 0, 3]

for i, (name, qty) in enumerate(zip(names, stock), start=1):
    print(i, name, "in stock" if qty else "OUT")

print("anything out?", any(q == 0 for q in stock))
print("all in stock?", all(q > 0 for q in stock))` },
    prod: { why: 'A retry loop that always ends.', src: `import random

random.seed(3)


def fetch_rate() -> float:
    if random.random() < 0.6:
        raise ConnectionError("gateway timeout")
    return 83.2


attempt, max_attempts = 0, 5
while True:
    attempt += 1
    try:
        print("rate:", fetch_rate(), "after", attempt, "attempt(s)")
        break
    except ConnectionError as err:
        print("attempt", attempt, "failed:", err)
        if attempt == max_attempts:
            print("giving up")
            break` },
  },
  industry: {
    when: ['Business rules: fees, tiers, eligibility.', 'Processing batches of records.', 'Retries around unreliable services.'],
    baseline: 'Clear if/elif chains with the most specific case first; a for loop over items.',
    tools: ['if / elif / else, for, while, break, continue', 'enumerate, zip, any, all', 'match statements for many cases (Python 3.10+)'],
    tradeoffs: ['Long elif chains get hard to maintain; a lookup table (dict) is often clearer.', 'Python loops are slow for millions of numbers; NumPy (P0.02) vectorises them.'],
    failures: ['Conditions in the wrong order give the wrong tier.', 'A while loop without a limit hangs a job.', 'Comparing floats with == misses equal-looking values.'],
    shopsense: 'Delivery fees, loyalty tiers and the retry loop around the payment gateway are all control flow.',
    interview: [
      ['break vs continue?', 'break leaves the loop; continue skips the rest of this iteration.'],
      ['How do you avoid infinite while loops?', 'Make sure the loop changes its condition, and add a maximum count or timeout.'],
    ],
  },
  quiz: [
    { q: 'x = 1800. Which branch runs: if x >= 5000 / elif x >= 1000 / else?', opts: ['if', 'elif', 'else', 'all'], a: 1, why: 'First true condition.' },
    { q: 'bool([]) is…', opts: ['True', 'False', 'Error', 'None'], a: 1, why: 'Empty containers are false.' },
    { q: 'continue in a loop…', opts: ['Exits the loop', 'Skips to the next item', 'Restarts', 'Pauses'], a: 1, why: 'Next iteration.' },
    { q: 'list(zip([1, 2], ["a", "b"]))?', opts: ['[1, 2, "a", "b"]', '[(1, "a"), (2, "b")]', '[[1, 2], ["a", "b"]]', 'Error'], a: 1, why: 'Pairs.' },
    { q: 'any([0, 0, 3])?', opts: ['False', 'True', '3', 'Error'], a: 1, why: '3 is true.' },
  ],
  exercise: {
    task: ['Write <code>delivery_fee(total, is_member)</code>: members pay 0; others pay 0 if total ≥ 999, else 49.'],
    starter: `def delivery_fee(total, is_member):
    pass


print(delivery_fee(500, False), delivery_fee(500, True), delivery_fee(1200, False))`,
    check: `assert delivery_fee(500, False) == 49
assert delivery_fee(500, True) == 0
assert delivery_fee(999, False) == 0`,
    solution: `def delivery_fee(total, is_member):
    if is_member or total >= 999:
        return 0
    return 49


print(delivery_fee(500, False), delivery_fee(500, True), delivery_fee(1200, False))`,
    hint: 'One condition with <code>or</code> covers both free cases.',
  },
};

// ===================================================================== W.05
const w05 = {
  id: 'w-05', title: 'Functions', time: '35 minutes',
  sub: 'Package logic into named, reusable pieces with inputs and outputs, so it can be tested and trusted.',
  learn: ['Define functions with parameters, defaults and return values', 'Explain local scope and why functions should not change global state', 'Pass functions as values, for example as a sort key'],
  legend: [[DATA, 'input'], [NAME, 'function'], [GOOD, 'output'], [BAD, 'side effect']],
  steps: [
    {
      t: 'Inputs in, output out', b: ['<code>def apply_discount(price, pct): return price * (100 - pct) // 100</code>. Call it as <code>apply_discount(1299, 10)</code> to get 1169.', 'A function that only uses its inputs and returns a result is easy to test.'],
      n: 'return sends a value back; without it the function returns None.',
      s: { a: Tl('price = 1299', -0.6, -1.4, { top: 1, c: 'blue', w: 2.2, d: 0.9, fs: 10.5 }), b: Tl('pct = 10', -0.6, 1.4, { top: 1, c: 'blue', w: 2.2, d: 0.9, fs: 10.5 }), f: B('apply_discount', 3.6, 0, { c: 'violet', w: 2.6, d: 1.4, h: 0.8, fs: 10 }), r: Tl('1169', 7.0, 0, { top: 1, c: 'green', w: 1.6, d: 1.0, fs: 11 }) },
      l: { x: L('a', 'f', { flow: 1 }), y: L('b', 'f', { flow: 1 }), z: L('f', 'r', { c: 'green', flow: 1 }) },
    },
    {
      t: 'Defaults and keywords', b: ['<code>def fee(total, free_above=999, charge=49)</code>. Callers can rely on defaults or name what they change: <code>fee(500, charge=29)</code>.'],
      n: 'Keyword arguments make calls readable.',
      s: { c2: Tl('free_above=999', -0.6, 3.8, { top: 1, c: 'amber', w: 2.4, d: 0.9, fs: 10 }) },
    },
    {
      t: 'Local scope', b: ['Names created inside a function exist only there. A function that quietly edits a global list makes bugs that depend on call order.', 'Pass data in and return results out instead.'],
      n: 'Default values are created once: never use a mutable default like items=[].',
      warn: true,
      s: { g: Tl('global cart', 4.4, 3.8, { top: 1, c: 'coral', w: 2.2, d: 0.9, fs: 10.5 }) },
      l: { w: L('f', 'g', { c: 'coral', dash: 1, t: 'avoid' }) },
    },
    {
      t: 'Functions are values', b: ['You can pass a function to another function: <code>sorted(products, key=lambda p: p["price"])</code>. <code>lambda</code> writes a tiny one-line function.'],
      n: 'Sort keys, callbacks and handlers all use this idea.',
      clear: true,
      s: { k: B('key = price', 0, 0, { c: 'violet', w: 1.8, d: 1.2, h: 0.6, fs: 10 }), srt: B('sorted', 3.2, 0, { c: 'violet', w: 1.6, d: 1.2, h: 0.8, fs: 10.5 }), ...row('p', ['₹650', '₹999', '₹1,299'], { x: 6.0, y: -1.6, dx: 0, dy: 1.6, c: 'green', w: 1.6, d: 1.0, top: 1, fs: 10.5 }) },
      l: { a: L('k', 'srt', { c: 'violet', flow: 1 }), b: L('srt', 'p1', { c: 'green', flow: 1 }) },
    },
  ],
  math: {
    blocks: [
      { h: 'Anatomy', f: 'def name(pos, opt=default, *args, key_only=..., **kwargs) -> ReturnType:\n    """What it does."""\n    ...\n    return value' },
      { h: 'Integer rupee arithmetic', f: 'price * (100 - pct) // 100', p: '<code>//</code> is floor division; it keeps results whole when working in rupees or paise.' },
    ],
    example: {
      intro: 'apply_discount(1299, 10)',
      steps: ['100 − 10 = 90.', '1299 × 90 = 116,910.', '116,910 // 100 = <b>1169</b>.', 'The function returns 1169; the caller decides what to do with it.'],
    },
  },
  code: {
    scratch: { why: 'Parameters, defaults, return and a sort key.', src: `def apply_discount(price, pct):
    return price * (100 - pct) // 100


def fee(total, free_above=999, charge=49):
    return 0 if total >= free_above else charge


print(apply_discount(1299, 10))
print(fee(500), fee(500, charge=29), fee(1500))

products = [{"name": "saree", "price": 1299}, {"name": "kurta", "price": 650}, {"name": "bedsheet", "price": 999}]
print([p["name"] for p in sorted(products, key=lambda p: p["price"])])` },
    library: { why: 'The mutable-default trap and its fix.', src: `def add_item_bad(item, cart=[]):        # one list shared by every call!
    cart.append(item)
    return cart


def add_item(item, cart=None):
    cart = [] if cart is None else cart
    cart.append(item)
    return cart


print(add_item_bad("saree"), add_item_bad("kurta"))
print(add_item("saree"), add_item("kurta"))` },
    prod: { why: 'A typed, documented, keyword-only function with input checks.', src: `def final_price(price: int, *, discount_pct: int = 0, coupon: int = 0) -> int:
    """Price in rupees after a percentage discount, then a flat coupon. Never below zero."""
    if not 0 <= discount_pct <= 90:
        raise ValueError("discount_pct must be between 0 and 90")
    discounted = price * (100 - discount_pct) // 100
    return max(discounted - coupon, 0)


print(final_price(1299, discount_pct=10, coupon=100))
print(final_price(299, coupon=500))
try:
    final_price(1299, discount_pct=95)
except ValueError as err:
    print("error:", err)` },
  },
  industry: {
    when: ['Every piece of business logic: one rule, one function, one test.', 'Callbacks, sort keys and handlers.'],
    baseline: 'Small pure functions: inputs in, value out, no hidden state.',
    tools: ['def, lambda, return', 'functools (partial, lru_cache)', 'type hints and docstrings'],
    tradeoffs: ['Many tiny functions can scatter logic; group them in modules (W.09).', 'Keyword-only arguments are clearer but more verbose.'],
    failures: ['Mutable default arguments sharing state between calls.', 'Functions that print instead of return, so nothing can test them.', 'Silent global changes.'],
    shopsense: 'Every KPI in Phase 0 is one documented function with a test, so finance and category teams run identical logic.',
    interview: [
      ['What is a pure function?', 'One whose output depends only on its inputs and that has no side effects.'],
      ['Why avoid def f(x=[])?', 'The default list is created once and shared across calls.'],
    ],
  },
  quiz: [
    { q: 'A function without return gives…', opts: ['0', 'None', 'Error', '""'], a: 1, why: 'Implicit None.' },
    { q: 'apply_discount(1000, 25) with price * (100 - pct) // 100?', opts: ['250', '750', '975', '1025'], a: 1, why: '1000 × 75 // 100.' },
    { q: 'fee(500, charge=29) uses free_above =…', opts: ['500', 'its default', '29', 'None'], a: 1, why: 'Not passed, so default.' },
    { q: 'lambda p: p["price"] is…', opts: ['A dict', 'A small function', 'A loop', 'A list'], a: 1, why: 'Anonymous function.' },
    { q: 'Why is def f(items=[]) risky?', opts: ['Syntax error', 'The list is shared across calls', 'Slow', 'It is fine'], a: 1, why: 'Created once.' },
  ],
  exercise: {
    task: ['Write <code>cheapest(products, n=1)</code> returning the names of the <code>n</code> cheapest products (dicts with "name" and "price").'],
    starter: `def cheapest(products, n=1):
    pass


products = [{"name": "saree", "price": 1299}, {"name": "kurta", "price": 650}, {"name": "bedsheet", "price": 999}]
print(cheapest(products), cheapest(products, n=2))`,
    check: `assert cheapest(products) == ["kurta"]
assert cheapest(products, n=2) == ["kurta", "bedsheet"]`,
    solution: `def cheapest(products, n=1):
    return [p["name"] for p in sorted(products, key=lambda p: p["price"])[:n]]


products = [{"name": "saree", "price": 1299}, {"name": "kurta", "price": 650}, {"name": "bedsheet", "price": 999}]
print(cheapest(products), cheapest(products, n=2))`,
    hint: 'Sort with a key, slice the first n, then pick names.',
  },
};

export default [w01, w02, w03, w04, w05];
