import { B, Tl, O, T, Z, Cy, L, row, mg } from '../kit.js';

const DATA = '#c4cdfb', GOOD = '#c1e4b1', BAD = '#ffc4b1', SIGNAL = '#fddf98', NAME = '#d9cafb';

// ===================================================================== W.06
const w06 = {
  id: 'w-06', title: 'Comprehensions and generators', time: '30 minutes',
  sub: 'Build lists and dictionaries in one readable line, and process data too big for memory one item at a time.',
  learn: ['Write list, dict and set comprehensions with conditions', 'Explain how a generator produces values lazily with yield', 'Stream a large file or sequence without loading it all'],
  legend: [[DATA, 'input'], [SIGNAL, 'filter'], [GOOD, 'output'], [NAME, 'generator']],
  steps: [
    {
      t: 'Loop, filter, build: in one line', b: ['<code>[p * 2 for p in prices if p > 500]</code> reads as: for each price, keep it if over 500, and put double it in a new list.'],
      n: 'Same result as a four-line for loop with append.',
      s: { ...row('i', ['300', '650', '1299', '450'], { x: 0, y: 0, dx: 1.8, c: 'blue', w: 1.5, d: 1.0, top: 1, fs: 11 }), f: B('if p > 500', 2.2, 1.6, { c: 'amber', w: 2.0, d: 1.1, h: 0.5, fs: 10 }), ...row('o', ['1300', '2598'], { x: 0.0, y: 3.4, dx: 1.8, c: 'green', w: 1.5, d: 1.0, top: 1, fs: 11 }) },
      l: { a: L('i1', 'f', { c: 'muted' }), b: L('i2', 'f', { c: 'muted' }), c: L('f', 'o0', { c: 'green', flow: 1 }), d: L('f', 'o1', { c: 'green', flow: 1 }) },
    },
    {
      t: 'Dict and set comprehensions', b: ['<code>{p["sku"]: p["price"] for p in products}</code> builds a lookup table; <code>{o["city"] for o in orders}</code> collects unique cities.'],
      n: 'Keep comprehensions short; if it needs two conditions and a nested loop, write a loop.',
      clear: true,
      s: { d: Tl('{ "SAR-1": 1299, "KUR-7": 650 }', 0, 0, { top: 1, c: 'green', w: 4.6, d: 1.1, fs: 10.5 }), st: Tl('{ "Chennai", "Madurai" }', 0, 2.8, { top: 1, c: 'green', w: 3.6, d: 1.1, fs: 10.5 }) },
    },
    {
      t: 'Generators make values on demand', b: ['Swap the brackets for parentheses: <code>(p * 2 for p in prices)</code>. Nothing is computed until someone asks for the next value.', '<code>sum(o["total"] for o in orders)</code> adds a million orders without building a million-item list.'],
      n: 'A list holds everything at once; a generator holds only where it is.',
      clear: true,
      s: { g: B('generator', 0, 0, { c: 'violet', w: 1.8, d: 1.3, h: 0.8, fs: 10.5 }), ...row('v', ['next → 1300', 'next → 2598', '…'], { x: 3.6, y: -1.6, dx: 0, dy: 1.6, c: 'green', w: 2.4, d: 1.0, top: 1, fs: 10 }) },
      l: { a: L('g', 'v0', { c: 'violet', flow: 1 }), b: L('g', 'v1', { c: 'violet', dash: 1 }) },
    },
    {
      t: 'yield writes your own', b: ['A function with <code>yield</code> is a generator: it pauses at each yield and resumes on the next request. Reading a huge file line by line works this way.'],
      n: 'Memory stays flat no matter how big the input.',
      s: { f: Cy('orders.csv\n10 GB', -3.0, 0, { c: 'blue', r: 0.7, h: 1.0, fs: 9.5 }) },
      l: { c: L('f', 'g', { flow: 1 }) },
    },
  ],
  math: {
    blocks: [
      { h: 'Shapes', f: '[expr for x in xs if cond]        list\n{k: v for x in xs}                dict\n{expr for x in xs}                set\n(expr for x in xs)                generator' },
      { h: 'Memory', f: 'list of n items  ≈ n × (8 bytes + item)\ngenerator        ≈ constant, whatever n is' },
    ],
    example: {
      intro: 'prices = [300, 650, 1299, 450]',
      steps: ['Keep p > 500: 650 and 1299.', 'Double them: <b>[1300, 2598]</b>.', '<code>sum(p for p in prices if p > 500)</code> gives 1949 without building a list.', 'A generator can be used only once: a second sum over the same generator gives 0.'],
    },
  },
  code: {
    scratch: { why: 'A loop and the comprehension that replaces it.', src: `prices = [300, 650, 1299, 450]

doubled = []
for p in prices:
    if p > 500:
        doubled.append(p * 2)
print(doubled)
print([p * 2 for p in prices if p > 500])

products = [{"sku": "SAR-1", "price": 1299}, {"sku": "KUR-7", "price": 650}]
print({p["sku"]: p["price"] for p in products})
print(sorted({c for c in ["Chennai", "Madurai", "Chennai"]}))   # sets have no order; sort to print` },
    library: { why: 'Generators, yield and memory use compared.', src: `import sys

big_list = [i * 2 for i in range(1_000_000)]
big_gen = (i * 2 for i in range(1_000_000))
print("list bytes:", sys.getsizeof(big_list) > 1_000_000, " generator bytes:", sys.getsizeof(big_gen) < 1_000)
print(sum(big_gen))
print(sum(big_gen), "(a generator is used up)")


def order_ids(n):
    for i in range(1, n + 1):
        yield f"O-{i:04d}"


ids = order_ids(3)
print(next(ids), next(ids), list(ids))` },
    prod: { why: 'Streaming a large CSV in chunks without loading it.', src: `import csv
import io
from itertools import islice

data = io.StringIO("order_id,total\\n" + "\\n".join(f"O{i},{100 + i % 900}" for i in range(50_000)))


def read_totals(f):
    for row in csv.DictReader(f):
        yield int(row["total"])


def batched(it, size):
    it = iter(it)
    while chunk := list(islice(it, size)):
        yield chunk


grand = 0
for n, chunk in enumerate(batched(read_totals(data), 10_000), start=1):
    grand += sum(chunk)
print(n, "chunks, total", grand)` },
  },
  industry: {
    when: ['Short transformations of lists and dicts.', 'Streaming large files, API pages or database rows.'],
    baseline: 'A comprehension for small, simple transforms; a generator when data may not fit in memory.',
    tools: ['comprehensions', 'yield, generator expressions', 'itertools (islice, chain, groupby)'],
    tradeoffs: ['Generators save memory but can be consumed only once and are harder to debug.', 'Long nested comprehensions hurt readability.'],
    failures: ['Reading a 10 GB file with readlines() crashes the machine.', 'Reusing an exhausted generator silently gives nothing.'],
    shopsense: 'Phase 0’s loader streams daily order files in chunks, which is why it runs within the memory budget at festival volume.',
    interview: [
      ['List comprehension vs generator expression?', 'A list builds all values now and stores them; a generator yields them lazily, one at a time.'],
      ['What does yield do?', 'It returns a value and pauses the function, resuming from that point on the next request.'],
    ],
  },
  quiz: [
    { q: '[x for x in [1, 2, 3, 4] if x % 2 == 0]?', opts: ['[1, 3]', '[2, 4]', '[4]', '[1, 2, 3, 4]'], a: 1, why: 'Even numbers.' },
    { q: '{x: x * x for x in [2, 3]}?', opts: ['{2: 4, 3: 9}', '[4, 9]', '{4, 9}', 'Error'], a: 0, why: 'A dict.' },
    { q: 'g = (x for x in [1, 2]); sum(g); sum(g) gives…', opts: ['3 then 3', '3 then 0', '0', 'Error'], a: 1, why: 'Used up.' },
    { q: 'Best for summing totals in a 10 GB file?', opts: ['readlines() into a list', 'A generator over lines', 'A dict', 'A set'], a: 1, why: 'Constant memory.' },
    { q: 'A function containing yield returns…', opts: ['A list', 'A generator', 'None', 'The first value'], a: 1, why: 'Calling it creates a generator.' },
  ],
  exercise: {
    task: ['Write <code>big_order_ids(orders, limit)</code> returning a list of IDs whose total exceeds <code>limit</code>, using a comprehension. Then write a generator <code>totals(orders)</code> that yields each total.'],
    starter: `def big_order_ids(orders, limit):
    pass


def totals(orders):
    pass


orders = [{"id": "O1", "total": 1299}, {"id": "O2", "total": 450}, {"id": "O3", "total": 7400}]
print(big_order_ids(orders, 1000))`,
    check: `assert big_order_ids(orders, 1000) == ["O1", "O3"]
assert sum(totals(orders)) == 9149
import types; assert isinstance(totals(orders), types.GeneratorType)`,
    solution: `def big_order_ids(orders, limit):
    return [o["id"] for o in orders if o["total"] > limit]


def totals(orders):
    for o in orders:
        yield o["total"]


orders = [{"id": "O1", "total": 1299}, {"id": "O2", "total": 450}, {"id": "O3", "total": 7400}]
print(big_order_ids(orders, 1000), sum(totals(orders)))`,
    hint: 'The generator is a for loop with <code>yield o["total"]</code> inside.',
  },
};

// ===================================================================== W.07
const w07 = {
  id: 'w-07', title: 'Files and exceptions', time: '35 minutes',
  sub: 'Read and write files safely, and handle errors deliberately instead of letting one bad row crash a whole job.',
  learn: ['Read and write text, CSV and JSON files with pathlib and with', 'Catch specific exceptions and raise clear ones', 'Quarantine bad records and keep processing the good ones'],
  legend: [[DATA, 'file'], [GOOD, 'good row'], [BAD, 'bad row'], [SIGNAL, 'handler']],
  steps: [
    {
      t: 'Open, use, close: with', b: ['<code>with open(path) as f:</code> opens the file and closes it automatically, even if an error happens inside.', '<code>pathlib.Path</code> builds paths that work on Windows, Mac and Linux.'],
      n: 'Always pass encoding="utf-8" for text: rupee signs and Tamil names need it.',
      s: { f: Cy('orders.csv', 0, 0, { c: 'blue', r: 0.7, h: 1.0, fs: 10 }), w: B('with open(…)', 3.4, 0, { c: 'teal', w: 2.0, d: 1.2, h: 0.6, fs: 10 }), c: Tl('closed automatically', 7.0, 0, { top: 1, c: 'green', w: 2.8, d: 1.0, fs: 10 }) },
      l: { a: L('f', 'w', { flow: 1 }), b: L('w', 'c', { c: 'green', flow: 1 }) },
    },
    {
      t: 'One bad row', b: ['Row 3 has <code>total = "abc"</code>. <code>int("abc")</code> raises ValueError, and without a handler the whole run stops at row 3.'],
      n: 'Errors are values Python throws up the call stack until someone catches them.',
      warn: true,
      clear: true,
      s: mg(row('r', ['O1 · 1299', 'O2 · 650', 'O3 · abc', 'O4 · 999'], { x: 0, y: 0, dx: 0, dy: 1.4, c: 'blue', w: 2.4, d: 1.0, top: 1, fs: 10.5 }), { r2: { c: 'coral' }, x: T('ValueError: stops here', 4.6, 2.8, { z: 0.2, fs: 12, b: 1, c: 'coral' }) }),
    },
    {
      t: 'Catch what you expect', b: ['<code>try: total = int(row["total"]) except ValueError: quarantine(row)</code>. Good rows continue; the bad one is set aside with a reason.', 'Catch the specific error you expect. A bare <code>except:</code> also hides real bugs.'],
      n: 'Handle the errors you understand; let unexpected ones fail loudly.',
      s: { r0: { c: 'green' }, r1: { c: 'green' }, r3: { c: 'green' }, x: null, q: Tl('quarantine: O3', 5.2, 2.8, { top: 1, c: 'coral', w: 2.6, d: 1.0, fs: 10 }) },
      l: { a: L('r2', 'q', { c: 'coral', flow: 1 }) },
    },
    {
      t: 'Raise clear errors, write results', b: ['When your own code finds bad input, <code>raise ValueError("total must be positive")</code> with a message a person can act on.', 'Write results with <code>json.dump</code> or the csv module, then report counts: 3 loaded, 1 quarantined.'],
      n: 'A good error message names the record, the field and the rule.',
      s: { out: Cy('clean.json\n3 rows', 5.4, 0, { c: 'green', r: 0.7, h: 1.0, fs: 9.5 }) },
      l: { b: L('r3', 'out', { c: 'green', flow: 1 }) },
    },
  ],
  math: {
    blocks: [
      { h: 'Patterns', f: 'with open(p, encoding="utf-8") as f: …\ntry:\n    risky()\nexcept ValueError as err:\n    handle(err)\nelse:\n    runs if no error\nfinally:\n    always runs' },
      { h: 'Common exceptions', f: 'ValueError      right type, bad value: int("abc")\nTypeError       wrong type: "a" + 1\nKeyError        missing dict key\nFileNotFoundError, PermissionError' },
    ],
    example: {
      intro: 'Four rows, one bad.',
      steps: ['O1: int("1299") works → loaded.', 'O2: works → loaded.', 'O3: int("abc") raises ValueError → caught, quarantined with the reason.', 'O4: loaded. Report: <b>3 loaded, 1 quarantined</b>, and the run finishes.'],
    },
  },
  code: {
    scratch: { why: 'Write a file, read it back, catch the bad row.', src: `from pathlib import Path
import tempfile

folder = Path(tempfile.mkdtemp())
path = folder / "orders.csv"
path.write_text("O1,1299\\nO2,650\\nO3,abc\\nO4,999\\n", encoding="utf-8")

good, bad = [], []
with open(path, encoding="utf-8") as f:
    for line in f:
        oid, total = line.strip().split(",")
        try:
            good.append((oid, int(total)))
        except ValueError:
            bad.append((oid, "total not a number"))
print("loaded", good)
print("quarantined", bad)` },
    library: { why: 'csv.DictReader, json and pathlib together.', src: `import csv
import json
import tempfile
from pathlib import Path

folder = Path(tempfile.mkdtemp())
(folder / "orders.csv").write_text("order_id,city,total\\nO1,Chennai,1299\\nO2,Madurai,\\nO3,Chennai,650\\n", encoding="utf-8")

rows, rejects = [], []
with (folder / "orders.csv").open(encoding="utf-8", newline="") as f:
    for row in csv.DictReader(f):
        try:
            row["total"] = int(row["total"])
            rows.append(row)
        except ValueError:
            rejects.append({**row, "reason": "missing total"})

(folder / "clean.json").write_text(json.dumps(rows, indent=1), encoding="utf-8")
print(len(rows), "loaded,", len(rejects), "rejected:", rejects)
print(json.loads((folder / "clean.json").read_text(encoding="utf-8"))[0])` },
    prod: { why: 'A custom exception and a loader that reports, quarantines and never half-writes.', src: `import json
import os
import tempfile
from pathlib import Path


class BadRecord(ValueError):
    """A row that breaks a data rule."""


def check(row: dict) -> dict:
    if not row.get("order_id"):
        raise BadRecord("order_id is empty")
    if row["total"] <= 0:
        raise BadRecord(f"{row['order_id']}: total must be positive, got {row['total']}")
    return row


def load(rows: list[dict], out: Path) -> dict:
    good, bad = [], []
    for r in rows:
        try:
            good.append(check(r))
        except BadRecord as err:
            bad.append(str(err))
    tmp = out.with_suffix(".tmp")
    tmp.write_text(json.dumps(good), encoding="utf-8")
    os.replace(tmp, out)                      # atomic: readers never see half a file
    return {"loaded": len(good), "quarantined": bad}


out = Path(tempfile.mkdtemp()) / "orders.json"
print(load([{"order_id": "O1", "total": 1299}, {"order_id": "O2", "total": -5}, {"order_id": "", "total": 10}], out))` },
  },
  industry: {
    when: ['Every data pipeline that reads files.', 'Any call that can fail: files, networks, parsing.'],
    baseline: 'with blocks, explicit encoding, specific except clauses, and a quarantine list with reasons.',
    tools: ['pathlib, open, csv, json', 'try / except / else / finally', 'logging for recording what was rejected'],
    tradeoffs: ['Catching too much hides bugs; catching too little crashes on one bad row.', 'Quarantining keeps runs going but needs someone to review the rejects.'],
    failures: ['A bare except swallowing a real bug.', 'Files written halfway when a job crashes, then read as complete.', 'Wrong encoding garbling names.'],
    shopsense: 'Phase 0’s L2 level rejects bad rows into a quarantine table with a reason, and the data-quality report counts them.',
    interview: [
      ['Why use with open(...)?', 'It guarantees the file is closed even if an exception occurs.'],
      ['Why not use a bare except?', 'It catches everything, including bugs and KeyboardInterrupt, hiding real problems.'],
    ],
  },
  quiz: [
    { q: 'int("abc") raises…', opts: ['TypeError', 'ValueError', 'KeyError', 'Nothing'], a: 1, why: 'Right type, bad value.' },
    { q: 'finally runs…', opts: ['Only on error', 'Always', 'Only without error', 'Never'], a: 1, why: 'Always.' },
    { q: 'Best handler for a parse failure?', opts: ['except:', 'except ValueError:', 'except Exception: pass', 'No handler'], a: 1, why: 'Specific.' },
    { q: 'Why write to a .tmp file then os.replace?', opts: ['Speed', 'Readers never see a half-written file', 'Compression', 'Required'], a: 1, why: 'Atomic swap.' },
    { q: 'with open(...) closes the file…', opts: ['Only if no error', 'Always when the block ends', 'Never', 'At program exit'], a: 1, why: 'Context manager.' },
  ],
  exercise: {
    task: ['Write <code>parse_totals(lines)</code> for lines like "O1,1299". Return <code>(good, bad)</code>: good is a list of (id, int total); bad is a list of IDs whose total is not a whole number.'],
    starter: `def parse_totals(lines):
    pass


print(parse_totals(["O1,1299", "O2,abc", "O3,650"]))`,
    check: `good, bad = parse_totals(["O1,1299", "O2,abc", "O3,650"])
assert good == [("O1", 1299), ("O3", 650)] and bad == ["O2"]`,
    solution: `def parse_totals(lines):
    good, bad = [], []
    for line in lines:
        oid, total = line.split(",")
        try:
            good.append((oid, int(total)))
        except ValueError:
            bad.append(oid)
    return good, bad


print(parse_totals(["O1,1299", "O2,abc", "O3,650"]))`,
    hint: 'Split each line, then wrap <code>int(total)</code> in try / except ValueError.',
  },
};

// ===================================================================== W.08
const w08 = {
  id: 'w-08', title: 'Classes and dataclasses', time: '35 minutes',
  sub: 'Bundle data with the behaviour that belongs to it. Dataclasses give you clean record types with almost no code.',
  learn: ['Define a class with __init__, attributes and methods', 'Use @dataclass for records, with defaults and frozen instances', 'Decide when a class helps and when a function or dict is enough'],
  legend: [[NAME, 'class'], [DATA, 'object'], [GOOD, 'method'], [SIGNAL, 'attribute']],
  steps: [
    {
      t: 'A class is a blueprint', b: ['<code>class Order</code> describes what every order has (id, items, city) and can do (total, add_item). Each actual order is an <b>object</b> made from it.'],
      n: 'One class, many objects.',
      s: { c: B('class Order', 0, 1.6, { c: 'violet', w: 2.0, d: 1.4, h: 0.9, fs: 10.5 }), o0: Tl('O-1042\nChennai', 4.0, 0, { top: 1, c: 'blue', w: 2.0, d: 1.2, fs: 10 }), o1: Tl('O-1043\nMadurai', 4.0, 3.2, { top: 1, c: 'blue', w: 2.0, d: 1.2, fs: 10 }) },
      l: { a: L('c', 'o0', { c: 'violet', flow: 1 }), b: L('c', 'o1', { c: 'violet', flow: 1 }) },
    },
    {
      t: 'Attributes and methods', b: ['<code>__init__</code> runs when an object is created and stores its data on <code>self</code>. A method such as <code>total(self)</code> uses that data.', '<code>order.total()</code> calls the method for that particular order.'],
      n: 'self is the object the method was called on.',
      s: { m: Tl('total() → 2,749', 7.4, 0, { top: 1, c: 'green', w: 2.4, d: 1.0, fs: 10 }) },
      l: { c: L('o0', 'm', { c: 'green', flow: 1 }) },
    },
    {
      t: '@dataclass writes the boring parts', b: ['<code>@dataclass class Item: sku: str; price: int; qty: int = 1</code> generates __init__, a readable print and equality for you.', '<code>frozen=True</code> makes instances read-only: safer to share.'],
      n: 'Most records in data code should be dataclasses, not loose dicts.',
      clear: true,
      s: { d: B('@dataclass Item', 0, 0, { c: 'violet', w: 2.4, d: 1.4, h: 0.8, fs: 10 }), ...row('f', ['sku: str', 'price: int', 'qty: int = 1'], { x: 4.0, y: -1.6, dx: 0, dy: 1.6, c: 'amber', w: 2.2, d: 1.0, top: 1, fs: 10 }) },
      l: { a: L('d', 'f0', { c: 'muted' }), b: L('d', 'f1', { c: 'muted' }), c: L('d', 'f2', { c: 'muted' }) },
    },
    {
      t: 'When not to use a class', b: ['A class with one method and no state is just a function. A one-off lookup is fine as a dict.', 'Use classes when data and the rules about it travel together: an Order that knows how to compute its own total.'],
      n: 'Prefer simple functions and dataclasses; add inheritance only when it clearly helps.',
      s: { w: T('one method, no state → write a function', 2.0, 5.6, { z: 0.2, fs: 12.5, b: 1, c: 'coral' }) },
    },
  ],
  math: {
    blocks: [
      { h: 'Class skeleton', f: 'class Order:\n    def __init__(self, oid, city):\n        self.oid = oid\n        self.city = city\n        self.items = []\n\n    def total(self):\n        return sum(i.price * i.qty for i in self.items)' },
      { h: 'Dataclass skeleton', f: '@dataclass(frozen=True)\nclass Item:\n    sku: str\n    price: int\n    qty: int = 1' },
    ],
    example: {
      intro: 'Order O-1042 with two items.',
      steps: ['Item("SAR-1", 1299, 1) and Item("KUR-7", 725, 2).', '1299 × 1 = 1299; 725 × 2 = 1450.', 'order.total() = <b>2,749</b>.', 'Item("SAR-1", 1299) == Item("SAR-1", 1299) is True: dataclasses compare by value.'],
    },
  },
  code: {
    scratch: { why: 'A plain class with __init__ and a method.', src: `class Order:
    def __init__(self, oid, city):
        self.oid = oid
        self.city = city
        self.items = []

    def add_item(self, sku, price, qty=1):
        self.items.append((sku, price, qty))

    def total(self):
        return sum(price * qty for _, price, qty in self.items)


order = Order("O-1042", "Chennai")
order.add_item("SAR-1", 1299)
order.add_item("KUR-7", 725, qty=2)
print(order.oid, order.city, order.total())` },
    library: { why: 'The same with dataclasses: shorter, printable, comparable.', src: `from dataclasses import dataclass, field


@dataclass(frozen=True)
class Item:
    sku: str
    price: int
    qty: int = 1


@dataclass
class Order:
    oid: str
    city: str
    items: list[Item] = field(default_factory=list)

    def total(self) -> int:
        return sum(i.price * i.qty for i in self.items)


o = Order("O-1042", "Chennai", [Item("SAR-1", 1299), Item("KUR-7", 725, 2)])
print(o.items[0])
print(o.total(), Item("SAR-1", 1299) == Item("SAR-1", 1299))` },
    prod: { why: 'Validation in __post_init__ and a property.', src: `from dataclasses import dataclass


@dataclass(frozen=True)
class Item:
    sku: str
    price: int
    qty: int = 1

    def __post_init__(self):
        if self.price <= 0 or self.qty <= 0:
            raise ValueError(f"{self.sku}: price and qty must be positive")

    @property
    def line_total(self) -> int:
        return self.price * self.qty


print(Item("KUR-7", 725, 2).line_total)
try:
    Item("BAD-1", 0)
except ValueError as err:
    print("rejected:", err)` },
  },
  industry: {
    when: ['Domain records: orders, customers, events.', 'Objects with state and behaviour: a model wrapper, a client for an API.'],
    baseline: 'A dataclass for records; plain functions for logic that does not need state.',
    tools: ['class, @dataclass, @property', 'pydantic for validated input (Phase 5–6)', 'typing for annotations'],
    tradeoffs: ['Classes organise code but deep inheritance makes it rigid.', 'Frozen dataclasses are safer but need replace() to change.'],
    failures: ['Mutable defaults in classes (use field(default_factory=list)).', 'God classes that do everything.'],
    shopsense: 'Model cards, order events and the churn scorer’s configuration are all dataclasses in later phases.',
    interview: [
      ['What does @dataclass generate?', '__init__, __repr__ and __eq__ (and optionally ordering, hashing and immutability).'],
      ['What is self?', 'The instance the method is being called on.'],
    ],
  },
  quiz: [
    { q: '__init__ runs…', opts: ['When the class is defined', 'When an object is created', 'When a method is called', 'Never'], a: 1, why: 'Construction.' },
    { q: 'Item("A", 10) == Item("A", 10) for a dataclass?', opts: ['False', 'True', 'Error', 'Depends'], a: 1, why: 'Compares fields.' },
    { q: 'frozen=True means…', opts: ['Faster', 'Fields cannot be changed after creation', 'Cannot be printed', 'Saved to disk'], a: 1, why: 'Immutable.' },
    { q: 'Default for a list field in a dataclass?', opts: ['items: list = []', 'items: list = field(default_factory=list)', 'items = list', 'None of these'], a: 1, why: 'A new list per object.' },
    { q: 'A class with one method and no state should usually be…', opts: ['Two classes', 'A function', 'A dict', 'A tuple'], a: 1, why: 'Keep it simple.' },
  ],
  exercise: {
    task: ['Create a dataclass <code>Item</code> with sku (str), price (int) and qty (int, default 1), and a function <code>cart_total(items)</code> returning the sum of price × qty.'],
    starter: `from dataclasses import dataclass

# define Item here


def cart_total(items):
    pass


print(cart_total([]))`,
    check: `assert cart_total([Item("SAR-1", 1299), Item("KUR-7", 725, 2)]) == 2749
assert Item("A", 5).qty == 1`,
    solution: `from dataclasses import dataclass


@dataclass
class Item:
    sku: str
    price: int
    qty: int = 1


def cart_total(items):
    return sum(i.price * i.qty for i in items)


print(cart_total([Item("SAR-1", 1299), Item("KUR-7", 725, 2)]))`,
    hint: 'Three annotated fields under <code>@dataclass</code>, with <code>qty: int = 1</code> last.',
  },
};

// ===================================================================== W.09
const w09 = {
  id: 'w-09', title: 'Modules, packages and environments', time: '30 minutes',
  sub: 'Split code into files, import it cleanly, install libraries, and keep every project’s dependencies separate and reproducible.',
  learn: ['Organise code into modules and packages and import from them', 'Create a virtual environment and install pinned dependencies', 'Explain why "works on my machine" happens and how lock files prevent it'],
  legend: [[DATA, 'module'], [NAME, 'package'], [GOOD, 'environment'], [BAD, 'conflict']],
  steps: [
    {
      t: 'A module is a file; a package is a folder', b: ['<code>pricing.py</code> is a module. A folder <code>shopsense/</code> with modules inside is a package. <code>from shopsense.pricing import apply_discount</code> brings in one function.'],
      n: 'Name modules after what they contain: pricing, loaders, metrics.',
      s: { z: Z('shopsense/', 2.4, 1.6, 6.4, 4.6, { c: 'violet' }), m0: Tl('pricing.py', 0.8, 0.2, { top: 1, c: 'blue', w: 2.2, d: 1.0, fs: 10 }), m1: Tl('loaders.py', 4.0, 0.2, { top: 1, c: 'blue', w: 2.2, d: 1.0, fs: 10 }), m2: Tl('metrics.py', 0.8, 2.8, { top: 1, c: 'blue', w: 2.2, d: 1.0, fs: 10 }), m3: Tl('__init__.py', 4.0, 2.8, { top: 1, c: 'slate', w: 2.2, d: 1.0, fs: 10 }) },
    },
    {
      t: 'Libraries come from PyPI', b: ['<code>pip install pandas</code> downloads a library. Installed globally, every project shares one version, and upgrading for one project can break another.'],
      n: 'Two projects needing pandas 1.5 and pandas 2.2 cannot share one global install.',
      warn: true,
      clear: true,
      s: { g: Cy('global Python', 3.0, 0, { c: 'coral', r: 0.9, h: 1.0, fs: 10 }), a: Tl('project A\nneeds pandas 1.5', 0, 3.0, { top: 1, c: 'blue', w: 2.6, d: 1.2, fs: 10 }), b: Tl('project B\nneeds pandas 2.2', 6.0, 3.0, { top: 1, c: 'blue', w: 2.6, d: 1.2, fs: 10 }) },
      l: { x: L('a', 'g', { c: 'coral', dash: 1 }), y: L('b', 'g', { c: 'coral', dash: 1 }) },
    },
    {
      t: 'One environment per project', b: ['<code>python -m venv .venv</code> creates a private Python for the project. Activate it, then install. Each project gets its own versions.', 'Tools such as uv or Poetry do the same, faster, with lock files.'],
      n: 'Never commit the .venv folder; commit the list of dependencies instead.',
      s: { g: null, ea: Cy('.venv A\npandas 1.5', 0, 0, { c: 'green', r: 0.8, h: 1.0, fs: 9.5 }), eb: Cy('.venv B\npandas 2.2', 6.0, 0, { c: 'green', r: 0.8, h: 1.0, fs: 9.5 }) },
      l: { x: L('a', 'ea', { c: 'green', flow: 1 }), y: L('b', 'eb', { c: 'green', flow: 1 }) },
    },
    {
      t: 'Pin versions to reproduce', b: ['<code>requirements.txt</code> or <code>pyproject.toml</code> lists dependencies; a lock file pins exact versions. A teammate, CI or the server installs exactly the same set.', 'This is the start of reproducibility, which Phase 6 builds on.'],
      n: '"Works on my machine" usually means unpinned versions.',
      s: { lk: Tl('pandas==2.2.3\nscikit-learn==1.9.1', 3.0, 5.6, { top: 1, c: 'amber', w: 3.4, d: 1.2, fs: 10 }) },
    },
  ],
  math: {
    blocks: [
      { h: 'Import forms', f: 'import math                      math.sqrt(2)\nfrom math import sqrt            sqrt(2)\nimport pandas as pd              pd.DataFrame\nfrom shopsense.pricing import apply_discount' },
      { h: 'Environment commands', f: 'python -m venv .venv\nsource .venv/bin/activate        (Windows: .venv\\Scripts\\activate)\npip install -r requirements.txt\npip freeze > requirements.txt' },
      { h: 'Run a module as a script', f: 'if __name__ == "__main__":\n    main()', p: 'The block runs when the file is executed directly, not when it is imported.' },
    ],
    example: {
      intro: 'Where does Python look for an import?',
      steps: ['The folder of the script being run comes first.', 'Then folders in PYTHONPATH, if set.', 'Then the active environment’s site-packages, where pip installed libraries.', '<code>import sys; print(sys.path)</code> shows the exact list, and is the first thing to check when an import fails.'],
    },
  },
  code: {
    scratch: { why: 'Write a tiny package to disk and import from it.', src: `import sys
import tempfile
from pathlib import Path

root = Path(tempfile.mkdtemp())
pkg = root / "shopsense"
pkg.mkdir()
(pkg / "__init__.py").write_text("", encoding="utf-8")
(pkg / "pricing.py").write_text(
    "def apply_discount(price, pct):\\n    return price * (100 - pct) // 100\\n", encoding="utf-8")

sys.path.insert(0, str(root))
from shopsense.pricing import apply_discount
print(apply_discount(1299, 10))` },
    library: { why: 'Inspecting versions and where packages come from.', src: `import sys
from importlib.metadata import version

import numpy as np
import pandas as pd

print("python", sys.version.split()[0])
print("numpy", version("numpy"), "| pandas", version("pandas"))
print("numpy is installed in this environment:", "site-packages" in np.__file__)
print("standard library modules are always available:", "json" in sys.stdlib_module_names)` },
    prod: { why: 'A module that works both as a library and as a command.', src: `import argparse


def apply_discount(price: int, pct: int) -> int:
    return price * (100 - pct) // 100


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Apply a percentage discount")
    parser.add_argument("price", type=int)
    parser.add_argument("--pct", type=int, default=10)
    args = parser.parse_args(argv)
    print(apply_discount(args.price, args.pct))


# In pricing.py you would end with:
#     if __name__ == "__main__":
#         main()
# and run:  python pricing.py 1299 --pct 20
# Here we call main with those arguments directly:
main(["1299", "--pct", "20"])` },
  },
  industry: {
    when: ['Every project with more than one file.', 'Every project that installs libraries, which is all of them.'],
    baseline: 'One virtual environment per project, a requirements or pyproject file, pinned versions.',
    tools: ['venv, pip', 'uv or Poetry with lock files', 'pyproject.toml'],
    tradeoffs: ['Strict pins reproduce exactly but need regular upgrades for security fixes.', 'Monorepos share code easily but need care with dependency versions.'],
    failures: ['A server installs a newer library and results change silently.', 'Circular imports between two modules.', 'Committing .venv bloats the repository.'],
    shopsense: 'Every ShopSense project starts with a pinned environment so the nightly job and a laptop produce identical numbers.',
    interview: [
      ['Why use virtual environments?', 'To isolate each project’s dependencies so versions do not conflict and installs are reproducible.'],
      ['What does if __name__ == "__main__" do?', 'Runs the block only when the file is executed directly, not when imported.'],
    ],
  },
  quiz: [
    { q: 'A Python package is…', opts: ['A single .py file', 'A folder of modules', 'A zip file', 'A class'], a: 1, why: 'Folder of modules.' },
    { q: 'python -m venv .venv creates…', opts: ['A new project', 'A private Python environment', 'A Docker image', 'A git repo'], a: 1, why: 'Isolated environment.' },
    { q: 'Should you commit .venv?', opts: ['Yes', 'No, commit the dependency list', 'Only on Windows', 'Only the bin folder'], a: 1, why: 'Recreate it from the list.' },
    { q: 'What makes installs reproducible?', opts: ['Latest versions', 'Pinned versions in a lock file', 'Global installs', 'Restarting'], a: 1, why: 'Same versions everywhere.' },
    { q: 'An import fails. First thing to check?', opts: ['Reinstall Python', 'sys.path and the active environment', 'Delete the file', 'Restart the computer'], a: 1, why: 'Where Python looks.' },
  ],
  exercise: {
    task: ['Write <code>parse_requirements(text)</code> that turns lines like "pandas==2.2.3" into a dict {"pandas": "2.2.3"}, ignoring blank lines and lines starting with #.'],
    starter: `def parse_requirements(text):
    pass


print(parse_requirements("pandas==2.2.3\\n# ml\\nscikit-learn==1.9.1\\n"))`,
    check: `assert parse_requirements("pandas==2.2.3\\n# ml\\n\\nscikit-learn==1.9.1\\n") == {"pandas": "2.2.3", "scikit-learn": "1.9.1"}`,
    solution: `def parse_requirements(text):
    pins = {}
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        name, ver = line.split("==")
        pins[name] = ver
    return pins


print(parse_requirements("pandas==2.2.3\\n# ml\\nscikit-learn==1.9.1\\n"))`,
    hint: 'Loop over <code>splitlines()</code>, skip blanks and comments, then <code>split("==")</code>.',
  },
};

// ===================================================================== W.10
const w10 = {
  id: 'w-10', title: 'Type hints and testing basics', time: '35 minutes',
  sub: 'Say what types your code expects so tools catch mistakes early, and write tests that prove each function does what you claim.',
  learn: ['Annotate functions and variables with type hints, including optional and list types', 'Write unit tests with assert, then with pytest-style test functions', 'Use tests first to pin down a rule before writing the code'],
  legend: [[DATA, 'code'], [SIGNAL, 'type check'], [GOOD, 'test passed'], [BAD, 'test failed']],
  steps: [
    {
      t: 'Hints say what you expect', b: ['<code>def apply_discount(price: int, pct: int) -> int:</code>. Python does not enforce hints at run time, but editors and type checkers (mypy, pyright) read them and flag mistakes before you run anything.'],
      n: 'Hints are documentation that tools can check.',
      s: { f: B('apply_discount(…) -> int', 2.6, 0, { c: 'blue', w: 3.4, d: 1.3, h: 0.6, fs: 10 }), tc: Tl('type checker', 2.6, 2.6, { top: 1, c: 'amber', w: 2.2, d: 1.0, fs: 10.5 }) },
      l: { a: L('f', 'tc', { c: 'amber', flow: 1 }) },
    },
    {
      t: 'Catch the bug before it runs', b: ['<code>apply_discount("1299", 10)</code> passes a string. The type checker reports: argument "price" expects int, got str. Without hints, this surfaces as a crash or a wrong number later.', 'Useful forms: <code>list[int]</code>, <code>dict[str, int]</code>, <code>str | None</code>.'],
      n: 'Cheap to add, saves hours of debugging.',
      warn: true,
      s: { bad: Tl('apply_discount("1299", 10)', 0.4, 5.4, { top: 1, c: 'coral', w: 4.2, d: 1.0, fs: 10 }), msg: T('error: expected int, got str', 0.4, 7.0, { z: 0.2, fs: 12, b: 1, c: 'coral' }) },
      l: { b: L('bad', 'tc', { c: 'coral', dash: 1 }) },
    },
    {
      t: 'A test is code that checks code', b: ['<code>def test_ten_percent(): assert apply_discount(1000, 10) == 900</code>. Run all tests with one command; each passes or fails with the values that differed.', 'Test the edge cases too: 0%, 100%, odd prices that need rounding.'],
      n: 'A test turns "I think it works" into "it works for these cases".',
      clear: true,
      s: { ...row('t', ['10% → 900', '0% → same', '999 at 15% → 849', '100% → 0'], { x: 0, y: 0, dx: 0, dy: 2.0, c: 'green', w: 3.0, d: 1.0, top: 1, fs: 10 }), r: T('4 passed', 5.2, 3.0, { z: 0.2, fs: 13, b: 1, c: 'green' }) },
    },
    {
      t: 'Write the test first', b: ['For a rule like "free delivery at ₹999 or more", write the test before the code: <code>assert fee(999) == 0</code> and <code>assert fee(998) == 49</code>. Then write the code until both pass.', 'The test settles the ambiguous edge (exactly ₹999) in writing.'],
      n: 'Tests first is how Phase 0 pins down every KPI definition.',
      s: { t3: { c: 'coral', t: 'fee(999) == 0 ✗' }, r: { t: '3 passed, 1 failed', c: 'coral' } },
    },
  ],
  math: {
    blocks: [
      { h: 'Common hints', f: 'x: int        s: str        ok: bool\nprices: list[int]\nstock: dict[str, int]\ncoupon: str | None = None\ndef f(a: int) -> float: …' },
      { h: 'A test', f: 'def test_fee_at_threshold():\n    assert fee(999) == 0\n    assert fee(998) == 49', p: 'Run with <code>pytest</code>: it finds functions named test_* and reports each.' },
    ],
    example: {
      intro: 'Testing apply_discount(price, pct) = price * (100 − pct) // 100.',
      steps: ['10% of 1000: 1000 × 90 // 100 = 900 ✓.', '0% of 1299: 1299 × 100 // 100 = 1299 ✓.', '15% of 999: 999 × 85 // 100 = 84,915 // 100 = <b>849</b> (rounds down; the test documents that choice).', '100% of 500: 0 ✓. Four cases, one rule, written down.'],
    },
  },
  code: {
    scratch: { why: 'Plain asserts as tests, and what a failure looks like.', src: `def apply_discount(price: int, pct: int) -> int:
    return price * (100 - pct) // 100


tests = [((1000, 10), 900), ((1299, 0), 1299), ((999, 15), 849), ((500, 100), 0)]
passed = 0
for args, expected in tests:
    got = apply_discount(*args)
    if got == expected:
        passed += 1
    else:
        print("FAIL", args, "expected", expected, "got", got)
print(passed, "of", len(tests), "passed")

try:
    assert apply_discount(1000, 10) == 899, "10% of 1000 should be 900"
except AssertionError as err:
    print("assertion message:", err)` },
    library: { why: 'unittest from the standard library (pytest works the same way, with less code).', src: `import io
import unittest


def fee(total: int, free_above: int = 999, charge: int = 49) -> int:
    return 0 if total >= free_above else charge


class FeeTests(unittest.TestCase):
    def test_free_at_threshold(self):
        self.assertEqual(fee(999), 0)

    def test_charged_below(self):
        self.assertEqual(fee(998), 49)

    def test_custom_charge(self):
        self.assertEqual(fee(100, charge=29), 29)


suite = unittest.defaultTestLoader.loadTestsFromTestCase(FeeTests)
result = unittest.TextTestRunner(verbosity=0, stream=io.StringIO()).run(suite)
print("ran", result.testsRun, "tests, failures:", len(result.failures))` },
    prod: { why: 'Typed code with Optional, plus table-driven tests.', src: `from dataclasses import dataclass


@dataclass(frozen=True)
class Coupon:
    code: str
    flat_off: int


def checkout_total(subtotal: int, coupon: Coupon | None = None, fee: int = 49) -> int:
    """Subtotal minus coupon (never below zero), plus delivery fee below ₹999."""
    discounted = max(subtotal - (coupon.flat_off if coupon else 0), 0)
    return discounted + (0 if discounted >= 999 else fee)


CASES = [
    ("no coupon, small", 500, None, 549),
    ("no coupon, free delivery", 1200, None, 1200),
    ("coupon drops below threshold", 1050, Coupon("DIWALI100", 100), 999),
    ("coupon larger than subtotal", 80, Coupon("BIG", 500), 49),
]
for name, sub, cp, want in CASES:
    got = checkout_total(sub, cp)
    print(f"{'PASS' if got == want else 'FAIL'}  {name}: {got}")` },
  },
  industry: {
    when: ['Every function that others depend on.', 'Before refactoring, so you know nothing broke.', 'For every business rule with an edge case.'],
    baseline: 'Hints on public functions, a type checker in the editor, and a few tests per rule, including edges.',
    tools: ['typing, mypy, pyright', 'pytest (and unittest in the standard library)', 'CI that runs tests on every change (Phase 6)'],
    tradeoffs: ['Tests take time to write but save far more in debugging and fear of change.', 'Over-mocked tests can pass while the real system fails.'],
    failures: ['Tests that only check the happy path.', 'Hints that lie because nobody runs the type checker.', 'Tests that depend on today’s date or random seeds and fail at random.'],
    shopsense: 'Phase 0’s L2 level requires a unit test for every KPI function; Phase 1 tests that features never use data after the snapshot date.',
    interview: [
      ['Does Python enforce type hints?', 'No, at run time they are ignored; static checkers like mypy use them to find errors.'],
      ['What makes a good unit test?', 'It checks one behaviour, including edge cases, is fast, deterministic and independent of other tests.'],
    ],
  },
  quiz: [
    { q: 'At run time, a wrong type passed to a hinted function…', opts: ['Is blocked by Python', 'Runs anyway; a type checker would have warned', 'Converts automatically', 'Crashes immediately'], a: 1, why: 'Hints are not enforced.' },
    { q: 'Hint for "a string or nothing"?', opts: ['str?', 'str | None', 'Optional', 'any'], a: 1, why: 'Union with None.' },
    { q: 'apply_discount(999, 15) with floor division?', opts: ['850', '849', '849.15', '848'], a: 1, why: '84,915 // 100.' },
    { q: 'pytest finds tests by…', opts: ['File size', 'Functions named test_*', 'Comments', 'Docstrings'], a: 1, why: 'Naming convention.' },
    { q: 'Why write the test before the code?', opts: ['Faster typing', 'It pins down the rule, including edges, before implementing', 'Required by Python', 'No reason'], a: 1, why: 'Specification first.' },
  ],
  exercise: {
    task: ['Add type hints to <code>loyalty_tier</code> (int in, str out). Then write <code>test_loyalty_tier()</code> that asserts: 5000 → "gold", 4999 → "silver", 1000 → "silver", 999 → "standard".'],
    starter: `def loyalty_tier(total):
    if total >= 5000:
        return "gold"
    if total >= 1000:
        return "silver"
    return "standard"


def test_loyalty_tier():
    pass


test_loyalty_tier()
print("ran")`,
    check: `assert loyalty_tier.__annotations__.get("return") is str and loyalty_tier.__annotations__.get("total") is int
test_loyalty_tier()
_real = loyalty_tier
caught = 0
for wrong in (lambda t: "gold", lambda t: "silver", lambda t: "standard"):
    loyalty_tier = wrong
    try:
        test_loyalty_tier()
    except AssertionError:
        caught += 1
loyalty_tier = _real
assert caught == 3, "the test should fail for a wrong implementation"`,
    solution: `def loyalty_tier(total: int) -> str:
    if total >= 5000:
        return "gold"
    if total >= 1000:
        return "silver"
    return "standard"


def test_loyalty_tier():
    assert loyalty_tier(5000) == "gold"
    assert loyalty_tier(4999) == "silver"
    assert loyalty_tier(1000) == "silver"
    assert loyalty_tier(999) == "standard"


test_loyalty_tier()
print("all tests passed")`,
    hint: 'Annotate with <code>total: int</code> and <code>-> str</code>; the test is four assert lines.',
  },
};

export default [w06, w07, w08, w09, w10];
