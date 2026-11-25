import { B, Tl, O, T, Z, S, L, row, bars, off, mg } from '../kit.js';

const DATA = '#c4cdfb', GOOD = '#c1e4b1', BAD = '#ffc4b1', SIGNAL = '#fddf98', MODEL = '#d9cafb', SYS = '#b2e5da';

// map a 2-D maths vector (a, b) onto the isometric floor: a runs down-right, b runs up-right
const K = 1.2;
const at = (a, b, s = K) => ({ x: a * s, y: -b * s });
const pt = (a, b, o = {}, s = K) => ({ k: 'orb', ...at(a, b, s), r: 0.13, noshadow: 1, ...o });
const axes = (n = 5, la = 'feature 1', lb = 'feature 2', s = K) => ({
  ax: S((n * s) / 2, 0, n * s, 0.05, { c: 'slate', h: 0.02, noshadow: 1 }),
  ay: S(0, -(n * s) / 2, 0.05, n * s, { c: 'slate', h: 0.02, noshadow: 1 }),
  o: { k: 'orb', x: 0, y: 0, r: 0.1, c: 'slate', noshadow: 1 },
  axl: T(la + ' →', n * s + 0.9, 0.5, { fs: 11.5, c: 'muted' }),
  ayl: T(lb + ' →', 0.5, -(n * s) - 0.9, { fs: 11.5, c: 'muted' }),
});

// ===================================================================== P0.11
const l11 = {
  id: 'p0-11', title: 'Vectors and dot products', time: '35 minutes',
  sub: 'Represent things as lists of numbers, measure their length, and compare them with the dot product and cosine similarity.',
  learn: ['Describe a product or a query as a vector', 'Compute a vector’s length and the dot product of two vectors', 'Use cosine similarity to find the closest match'],
  legend: [[DATA, 'product'], [SIGNAL, 'query'], [GOOD, 'best match']],
  steps: [
    {
      t: 'A product as a list of numbers', b: ['Give each saree two scores from 0 to 5: how suitable it is for the <b>office</b>, and how <b>festive</b> it is.', 'A cotton office saree scores <code>[4, 1]</code>. That list of numbers is a vector.'],
      n: 'Each number is one feature. The order is fixed: office first, festive second.',
      s: { ...axes(5, 'office', 'festive'), a: pt(4, 1, { c: 'blue', r: 0.16, sub: 'cotton office saree [4, 1]' }) },
      l: { la: L('o', 'a', { c: 'blue' }) },
    },
    {
      t: 'Vectors are arrows', b: ['Draw each vector as an arrow from the origin. A silk party saree scores <code>[1, 4]</code>: low for office, high for festive.', 'Arrows pointing in similar directions describe similar things.'],
      n: 'Direction carries the meaning. The two sarees point very differently.',
      s: { b: pt(1, 4, { c: 'violet', r: 0.16, sub: 'silk party saree [1, 4]' }) },
      l: { lb: L('o', 'b', { c: 'violet' }) },
    },
    {
      t: 'A search query is a vector too', b: ['Priya searches for a saree for the office. Turned into the same two scores, her query is <code>[3, 1]</code>.', 'Now finding the best product means finding the arrow closest in direction to hers.'],
      n: 'Search, recommendations and LLM embeddings all work this way, with hundreds of numbers instead of two.',
      s: { q: pt(3, 1, { c: 'amber', r: 0.16, z: 0.02 }), ql: T('Priya’s query [3, 1]', 0.6, 1.9, { fs: 11.5, c: 'amber', b: 1 }) },
      l: { lq: L('o', 'q', { c: 'amber', sw: 3 }) },
    },
    {
      t: 'Length of a vector', b: ['The length (or norm) is the arrow’s size: square each number, add, take the square root.', 'Cotton saree: √(4² + 1²) = √17 ≈ 4.12. Silk saree: √(1² + 4²) = √17, the same length. Only the direction differs.'],
      n: 'Length measures "how much"; direction measures "what kind".',
      s: { a: { hl: 1 }, b: { hl: 1 }, nl: T('|a| = |b| = √17 ≈ 4.12', 5.6, -5.8, { fs: 12.5, b: 1 }) },
    },
    {
      t: 'The dot product scores agreement', b: ['Multiply matching numbers and add. Query · cotton = 3×4 + 1×1 = <b>13</b>. Query · silk = 3×1 + 1×4 = <b>7</b>.', 'A bigger dot product means the arrows agree more.'],
      n: 'You met the dot product in P0.02 as total revenue. Same operation, new meaning.',
      s: { a: { hl: 0 }, b: { hl: 0 }, nl: { t: 'q · cotton = 13      q · silk = 7' } },
    },
    {
      t: 'Cosine similarity: direction only', b: ['Dividing the dot product by both lengths removes size and keeps direction. Cosine similarity runs from −1 (opposite) to 1 (same direction).', 'Query vs cotton: 13 / (√10 × √17) ≈ <b>0.997</b>. Query vs silk: 7 / (√10 × √17) ≈ <b>0.537</b>. The cotton office saree is the match.'],
      n: 'Cosine similarity is the standard way to compare embeddings in semantic search.',
      s: { a: { c: 'green', hl: 1, sub: 'cotton office saree · cos 0.997' }, b: { sub: 'silk party saree · cos 0.537' }, nl: { t: 'best match: cotton office saree' , c: 'green' } },
      l: { la: { c: 'green', sw: 3 } },
    },
  ],
  math: {
    blocks: [
      { h: 'Vector length (L2 norm)', f: '|a| = √(a₁² + a₂² + … + aₙ²)' },
      { h: 'Dot product', f: 'a · b = a₁b₁ + a₂b₂ + … + aₙbₙ\n      = |a| |b| cos θ', p: 'θ is the angle between the arrows. The second form explains why the dot product measures agreement.' },
      { h: 'Cosine similarity', f: 'cos θ = (a · b) / (|a| |b|)', p: '1 means the same direction, 0 means unrelated (perpendicular), −1 means opposite.' },
    ],
    example: {
      intro: 'Which saree matches Priya’s query q = [3, 1]?',
      steps: ['Lengths: |q| = √(9 + 1) = √10 ≈ 3.162. |cotton| = |silk| = √17 ≈ 4.123.', 'Dot products: q · cotton = 3×4 + 1×1 = <b>13</b>; q · silk = 3×1 + 1×4 = <b>7</b>.', 'Cosine with cotton = 13 / (3.162 × 4.123) = 13 / 13.04 ≈ <b>0.997</b>.', 'Cosine with silk = 7 / 13.04 ≈ <b>0.537</b>. The cotton office saree wins.'],
    },
  },
  code: {
    scratch: { why: 'Length, dot product and cosine similarity in plain Python.', src: `from math import sqrt

query = [3, 1]
products = {"cotton office saree": [4, 1], "silk party saree": [1, 4]}


def dot(a, b):
    return sum(x * y for x, y in zip(a, b))


def norm(a):
    return sqrt(dot(a, a))


def cosine(a, b):
    return dot(a, b) / (norm(a) * norm(b))


for name, vec in products.items():
    print(f"{name}: dot={dot(query, vec)}, cosine={cosine(query, vec):.3f}")` },
    library: { why: 'NumPy compares the query with every product in one step.', src: `import numpy as np

names = ["cotton office saree", "silk party saree", "handloom work saree"]
P = np.array([[4, 1], [1, 4], [5, 2]], dtype=float)
q = np.array([3, 1], dtype=float)

cos = (P @ q) / (np.linalg.norm(P, axis=1) * np.linalg.norm(q))
for name, c in zip(names, cos):
    print(f"{name:22s} {c:.3f}")
print("Best match:", names[int(np.argmax(cos))])` },
    prod: { why: 'A tested top-k search helper that guards against zero vectors.', src: `import numpy as np
from numpy.typing import NDArray


def top_k(query: NDArray, items: NDArray, k: int = 3) -> list[tuple[int, float]]:
    """Return (index, cosine) for the k items most similar to query."""
    qn = np.linalg.norm(query)
    norms = np.linalg.norm(items, axis=1)
    if qn == 0 or np.any(norms == 0):
        raise ValueError("zero vectors have no direction")
    scores = (items @ query) / (norms * qn)
    order = np.argsort(-scores)[:k]
    return [(int(i), round(float(scores[i]), 3)) for i in order]


def test_top_k() -> None:
    items = np.array([[1.0, 0.0], [0.0, 1.0]])
    assert top_k(np.array([2.0, 0.1]), items, k=1)[0][0] == 0


test_top_k()
print(top_k(np.array([3.0, 1.0]), np.array([[4.0, 1.0], [1.0, 4.0], [5.0, 2.0]])))` },
  },
  industry: {
    when: ['Semantic search and recommendations: products, queries and users become vectors.', 'Embeddings from language models (Phase 3) are compared with cosine similarity.', 'Any time you need "how similar are these two things?"'],
    baseline: 'Start with exact cosine similarity over all items with NumPy. Move to an approximate vector index only when the catalogue is too large to scan.',
    tools: ['NumPy for small collections', 'FAISS, pgvector, Qdrant or similar vector databases at scale (Phase 5)', 'scikit-learn cosine_similarity'],
    tradeoffs: ['Raw dot product rewards long vectors (popular items); cosine ignores length.', 'Exact search is accurate but slow on millions of items; approximate search trades a little recall for speed.'],
    failures: ['Comparing vectors made by different models or feature orders.', 'Forgetting to normalise, so one large feature dominates.', 'Zero vectors (empty descriptions) causing division by zero.'],
    shopsense: 'Phase 3’s semantic search turns Priya’s query and every product into vectors and ranks by cosine similarity. This lesson is that idea in two dimensions.',
    interview: [
      ['What is cosine similarity and why use it for embeddings?', 'The dot product divided by both lengths. It measures direction only, so items are compared by meaning rather than by vector size.'],
      ['When would you use the dot product instead of cosine?', 'When length carries useful meaning, for example popularity or confidence, or when vectors are already normalised (then they are equal).'],
      ['How do you search millions of vectors quickly?', 'Use an approximate nearest-neighbour index (such as HNSW or IVF) in a vector database, accepting slightly lower recall for much lower latency.'],
    ],
  },
  quiz: [
    { q: 'What is the length of the vector [3, 4]?', opts: ['5', '7', '12', '25'], a: 0, why: '√(3² + 4²) = √25 = 5.' },
    { q: 'What is [3, 1] · [1, 4]?', opts: ['4', '7', '13', '16'], a: 1, why: '3×1 + 1×4 = 7.' },
    { q: 'Two vectors have cosine similarity 0. What does that mean?', opts: ['They are identical', 'They point in opposite directions', 'They are perpendicular: unrelated in direction', 'One of them is zero'], a: 2, why: 'cos 90° = 0.' },
    { q: 'Why is cosine similarity preferred over the raw dot product for comparing meanings?', opts: ['It is faster', 'It ignores vector length and compares direction only', 'It is always positive', 'It needs fewer numbers'], a: 1, why: 'Dividing by both lengths removes size, leaving direction, which carries the meaning.' },
    { q: 'q = [3, 1] has cosine 0.997 with A and 0.537 with B. Which is the better match?', opts: ['A', 'B', 'They are equal', 'Cannot tell'], a: 0, why: 'Higher cosine means a closer direction.' },
  ],
  exercise: {
    task: ['Write <code>cosine(a, b)</code> for two lists of numbers. Then set <code>best</code> to the name of the product most similar to <code>query</code>.'],
    starter: `from math import sqrt

query = [2, 5]
products = {"silk party saree": [1, 4], "cotton office saree": [4, 1], "festive lehenga": [0, 5]}


def cosine(a, b):
    pass


best = None
print(best)`,
    check: `assert abs(cosine([1, 0], [0, 1])) < 1e-9
assert abs(cosine([3, 1], [4, 1]) - 0.9970) < 1e-3
assert best == "silk party saree", "compare cosine values: [2, 5] is closest in direction to [1, 4]"`,
    solution: `from math import sqrt

query = [2, 5]
products = {"silk party saree": [1, 4], "cotton office saree": [4, 1], "festive lehenga": [0, 5]}


def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    return dot / (sqrt(sum(x * x for x in a)) * sqrt(sum(y * y for y in b)))


best = max(products, key=lambda name: cosine(query, products[name]))
print(best)`,
    hint: '<code>max(products, key=lambda name: cosine(query, products[name]))</code> picks the name with the highest score.',
  },
};

// ===================================================================== P0.12
const X = [[4, 1], [1, 4], [3, 2]], W = [0.7, 0.3], SC = X.map((r) => +(r[0] * W[0] + r[1] * W[1]).toFixed(1));
const mtile = (t, x, y, o = {}) => ({ k: 'tile', t, x, y, w: 1.1, d: 0.95, h: 0.16, c: 'blue', fs: 11, ...o });
const l12 = {
  id: 'p0-12', title: 'Matrices and multiplication', time: '40 minutes',
  sub: 'Stack vectors into matrices, multiply them to score many items at once, and see a matrix as a transformation of space.',
  learn: ['Read a matrix as rows of vectors and predict shapes in multiplication', 'Multiply a matrix by a vector and by another matrix', 'Explain why every neural-network layer is a matrix multiply'],
  legend: [[DATA, 'matrix'], [SIGNAL, 'weights'], [GOOD, 'result']],
  steps: [
    {
      t: 'A matrix is rows of vectors', b: ['Stack the score vectors of three sarees and you get a matrix with 3 rows and 2 columns: shape <code>(3, 2)</code>.', 'Each row is one product; each column is one feature (office, festive).'],
      n: 'Rows are items, columns are features. This layout is used everywhere in machine learning.',
      s: { ...Object.fromEntries(X.flatMap((r, i) => r.map((v, j) => [`x${i}${j}`, mtile(String(v), j * 1.25, i * 1.1)]))), xl: T('X  (3 × 2)', 0.6, -1.3, { fs: 13, b: 1 }) },
    },
    {
      t: 'Multiply by a weight vector', b: ['ShopSense ranks office-wear by weighting office 0.7 and festive 0.3: the vector <code>w = [0.7, 0.3]</code>.', '<code>X @ w</code> takes the dot product of every row with w, giving one score per product.'],
      n: 'One matrix multiply replaces a loop over products.',
      s: { w0: mtile('0.7', 4.0, 0.0, { c: 'amber' }), w1: mtile('0.3', 4.0, 1.1, { c: 'amber' }), wl: T('w  (2,)', 4.4, -1.3, { fs: 13, b: 1, c: 'amber' }) },
    },
    {
      t: 'Row times column', b: ['First product: 4 × 0.7 + 1 × 0.3 = <b>3.1</b>. Second: 1 × 0.7 + 4 × 0.3 = 1.9. Third: 3 × 0.7 + 2 × 0.3 = 2.7.', 'The cotton office saree scores highest.'],
      n: 'Each result is a dot product: one row of X with the column w.',
      s: { x00: { hl: 1 }, x01: { hl: 1 }, ...Object.fromEntries(SC.map((v, i) => ['s' + i, mtile(String(v), 7.0, i * 1.1, { c: 'green', hl: i === 0 ? 1 : 0 })])), sl: T('X @ w  (3,)', 7.4, -1.3, { fs: 13, b: 1, c: 'green' }) },
      l: { r0: L('x01', 'w0', { c: 'amber', na: 1, dash: 1 }), r1: L('w1', 's0', { c: 'green' }) },
    },
    {
      t: 'A matrix moves space', b: ['A matrix can also be read as a transformation. The shear matrix <code>[[1, 0.5], [0, 1]]</code> slides every point sideways in proportion to its height.', 'Faded dots show the original grid; solid dots show where the matrix sends them.'],
      n: 'Straight lines stay straight and the origin stays fixed: that is what "linear" means.',
      clear: true,
      s: (() => {
        const o = { ...axes(4, 'x₁', 'x₂', 1.3) };
        for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) {
          o[`g${a}${b}`] = pt(a, b, { c: 'slate', o: 0.35 }, 1.3);
          o[`h${a}${b}`] = pt(a + 0.5 * b, b, { c: 'violet', r: 0.15 }, 1.3);
        }
        return o;
      })(),
      l: { m1: L('g02', 'h02', { c: 'violet', dash: 1 }), m2: L('g22', 'h22', { c: 'violet', dash: 1 }) },
    },
    {
      t: 'Every neural layer is a matrix multiply', b: ['A batch of inputs <code>X</code> (examples × features) times a weight matrix <code>W</code> (features × outputs), plus a bias, gives the layer’s outputs.', 'Shapes chain: <code>(32, 2) @ (2, 4) → (32, 4)</code>. The inner numbers must match.'],
      n: 'GPUs exist largely to do this one operation very fast.',
      clear: true,
      s: { bx: B('X\n32 × 2', 0, 0, { c: 'blue', w: 1.2, d: 1.6, h: 0.6, fs: 11 }), bw: B('W\n2 × 4', 3.0, 0, { c: 'amber', w: 1.6, d: 1.2, h: 0.6, fs: 11 }), bb: B('+ b\n4', 5.6, 0, { c: 'amber', w: 0.9, d: 0.9, h: 0.4, fs: 10 }), by: B('outputs\n32 × 4', 8.4, 0, { c: 'green', w: 1.6, d: 1.6, h: 0.6, fs: 11 }) },
      l: { a: L('bx', 'bw', { flow: 1, t: '@' }), b2: L('bw', 'bb', { flow: 1 }), c: L('bb', 'by', { flow: 1, c: 'green' }) },
    },
  ],
  math: {
    blocks: [
      { h: 'Matrix–vector product', f: '(X w)ᵢ = Σⱼ Xᵢⱼ wⱼ', p: 'Each output is the dot product of row i with w.' },
      { h: 'Matrix–matrix product', f: '(A B)ᵢₖ = Σⱼ Aᵢⱼ Bⱼₖ\n\nshape:  (n, m) @ (m, p) → (n, p)', p: 'The inner sizes must match. Order matters: A B is usually not B A.' },
      { h: 'A neural layer', f: 'Y = X W + b', p: 'X has one row per example. Broadcasting (P0.03) adds the bias b to every row.' },
    ],
    example: {
      intro: 'Score three sarees with w = [0.7, 0.3].',
      steps: ['X = <code>[[4, 1], [1, 4], [3, 2]]</code>, shape (3, 2). w has shape (2,), so X @ w has shape (3,).', 'Row 1: 4 × 0.7 + 1 × 0.3 = 2.8 + 0.3 = <b>3.1</b>.', 'Row 2: 1 × 0.7 + 4 × 0.3 = 0.7 + 1.2 = <b>1.9</b>. Row 3: 3 × 0.7 + 2 × 0.3 = 2.1 + 0.6 = <b>2.7</b>.', 'Result <code>[3.1, 1.9, 2.7]</code>: the first saree ranks highest for office wear.'],
    },
  },
  code: {
    scratch: { why: 'Matrix multiplication with nested loops, to see every multiply and add.', src: `X = [[4, 1], [1, 4], [3, 2]]
W = [[0.7, 0.1], [0.3, 0.9]]   # column 1: office ranking, column 2: festive ranking


def matmul(A, B):
    n, m, p = len(A), len(B), len(B[0])
    if len(A[0]) != m:
        raise ValueError("inner dimensions must match")
    return [[round(sum(A[i][j] * B[j][k] for j in range(m)), 2) for k in range(p)] for i in range(n)]


for row in matmul(X, W):
    print(row)` },
    library: { why: 'NumPy’s @ operator, shapes, and a shear transformation.', src: `import numpy as np

X = np.array([[4, 1], [1, 4], [3, 2]], dtype=float)
w = np.array([0.7, 0.3])
print("scores:", X @ w)

W = np.array([[0.7, 0.1], [0.3, 0.9]])
print("shape:", X.shape, "@", W.shape, "->", (X @ W).shape)
print(np.round(X @ W, 2))

shear = np.array([[1, 0.5], [0, 1]])
points = np.array([[0, 0], [0, 2], [2, 2]])
print("sheared points:\\n", points @ shear.T)` },
    prod: { why: 'A dense layer with an explicit shape contract and a test.', src: `import numpy as np
from numpy.typing import NDArray


def dense(X: NDArray, W: NDArray, b: NDArray) -> NDArray:
    """One linear layer: (n, d) @ (d, k) + (k,) -> (n, k)."""
    if X.ndim != 2 or W.ndim != 2:
        raise ValueError("X and W must be 2-D")
    if X.shape[1] != W.shape[0]:
        raise ValueError(f"inner dims differ: {X.shape} @ {W.shape}")
    if b.shape != (W.shape[1],):
        raise ValueError(f"bias must have shape ({W.shape[1]},)")
    return X @ W + b


def test_dense() -> None:
    out = dense(np.ones((32, 2)), np.ones((2, 4)), np.zeros(4))
    assert out.shape == (32, 4) and np.all(out == 2)


test_dense()
rng = np.random.default_rng(0)
print(dense(rng.normal(size=(3, 2)), rng.normal(size=(2, 4)), np.zeros(4)).shape)` },
  },
  industry: {
    when: ['Scoring many items with one set of weights.', 'Inside every neural network layer and every transformer.', 'Recommendation systems: user matrix × item matrix gives all scores at once.'],
    baseline: 'Write the operation with @ and check shapes on paper first. Write loops only to understand, never for production speed.',
    tools: ['NumPy @ and einsum', 'PyTorch and JAX on GPUs', 'BLAS libraries underneath (OpenBLAS, MKL, cuBLAS)'],
    tradeoffs: ['Bigger matrices mean more capability and more compute: cost grows with n × m × p.', 'Lower precision (float16, int8) makes multiplies faster and cheaper at a small accuracy cost (Phase 4).'],
    failures: ['Shape mismatches from transposed matrices.', 'Confusing element-wise * with matrix @.', 'Running out of memory with huge intermediate products.'],
    shopsense: 'Ranking thousands of products for one query is one matrix–vector product; ranking for many users at once is a matrix–matrix product.',
    interview: [
      ['What is the shape of (64, 128) @ (128, 10)?', '(64, 10). The inner 128s must match and disappear.'],
      ['What is the difference between * and @ in NumPy?', '* multiplies element by element (with broadcasting); @ is matrix multiplication (sums of row × column products).'],
      ['Why are GPUs good for deep learning?', 'Deep learning is dominated by large matrix multiplications, which split into many independent multiply–adds that GPUs run in parallel.'],
    ],
  },
  quiz: [
    { q: 'What is the shape of (3, 2) @ (2, 4)?', opts: ['(3, 4)', '(2, 2)', '(3, 2)', 'Error'], a: 0, why: 'Inner dims (2 and 2) match; the result takes the outer dims.' },
    { q: 'X = [[4, 1], [1, 4]] and w = [0.7, 0.3]. What is X @ w?', opts: ['[3.1, 1.9]', '[2.8, 1.2]', '[3.5, 1.5]', '[1.9, 3.1]'], a: 0, why: '4×0.7 + 1×0.3 = 3.1 and 1×0.7 + 4×0.3 = 1.9.' },
    { q: 'Which product is invalid?', opts: ['(5, 3) @ (3, 1)', '(2, 4) @ (4, 4)', '(3, 2) @ (3, 2)', '(1, 6) @ (6, 2)'], a: 2, why: 'The inner dims 2 and 3 differ.' },
    { q: 'In a neural layer Y = XW + b, what does each row of X hold?', opts: ['One weight', 'One example’s features', 'One output', 'The bias'], a: 1, why: 'Rows are examples; columns are features.' },
    { q: 'Is A @ B always equal to B @ A?', opts: ['Yes', 'No, matrix multiplication is usually not commutative', 'Only for square matrices', 'Only for integers'], a: 1, why: 'Order matters; even for square matrices AB ≠ BA in general.' },
  ],
  exercise: {
    task: ['Using NumPy, compute <code>scores = X @ W</code> where each column of W is one ranking (office, festive). Then set <code>top_festive</code> to the row index of the product with the highest festive score.'],
    starter: `import numpy as np

X = np.array([[4, 1], [1, 4], [3, 2], [2, 5]], dtype=float)
W = np.array([[0.7, 0.2], [0.3, 0.8]])

scores = None
top_festive = None

print(scores)
print(top_festive)`,
    check: `assert scores.shape == (4, 2)
assert np.allclose(scores[0], [3.1, 1.6])
assert top_festive == 3, "the festive score is column 1; the row [2, 5] scores 4.4"`,
    solution: `import numpy as np

X = np.array([[4, 1], [1, 4], [3, 2], [2, 5]], dtype=float)
W = np.array([[0.7, 0.2], [0.3, 0.8]])

scores = X @ W
top_festive = int(np.argmax(scores[:, 1]))

print(scores)
print(top_festive)`,
    hint: 'The festive scores are <code>scores[:, 1]</code>; <code>np.argmax</code> gives the index of the largest.',
  },
};

// ===================================================================== P0.13
const E = 2.0;
const l13 = {
  id: 'p0-13', title: 'Eigenvectors, intuitively', time: '35 minutes',
  sub: 'Find the special directions a matrix only stretches, and see why they power PCA and recommendations.',
  learn: ['Explain what an eigenvector and eigenvalue are, in pictures', 'Check A v = λ v for a given matrix and vector', 'Connect eigenvectors to PCA: the directions of greatest spread'],
  legend: [[DATA, 'before'], [BAD, 'turned'], [GOOD, 'only stretched']],
  steps: [
    {
      t: 'Four arrows before a transformation', b: ['Take the matrix <code>A = [[2, 1], [1, 2]]</code> and four arrows: [1, 0], [0, 1], [1, 1] and [1, −1].', 'We will apply A to each and watch what happens to their directions.'],
      n: 'Blue arrows are the inputs.',
      s: { ...axes(4, 'x₁', 'x₂', E), u: pt(1, 0, { c: 'blue', sub: '[1, 0]' }, E), v: pt(0, 1, { c: 'blue', sub: '[0, 1]' }, E), e1: pt(1, 1, { c: 'blue', sub: '[1, 1]' }, E), e2: pt(1, -1, { c: 'blue', sub: '[1, −1]' }, E) },
      l: { lu: L('o', 'u', { c: 'blue' }), lv: L('o', 'v', { c: 'blue' }), le1: L('o', 'e1', { c: 'blue' }), le2: L('o', 'e2', { c: 'blue' }) },
    },
    {
      t: 'Most arrows turn', b: ['A sends [1, 0] to [2, 1] and [0, 1] to [1, 2]. Both arrows change direction as well as length.'],
      n: 'Coral arrows are outputs that turned away from their input direction.',
      s: { Au: pt(2, 1, { c: 'coral', sub: 'A[1, 0] = [2, 1]' }, E), Av: pt(1, 2, { c: 'coral', sub: 'A[0, 1] = [1, 2]' }, E), u: { sub: '' }, v: { sub: '' } },
      l: { lAu: L('o', 'Au', { c: 'coral', dash: 1 }), lAv: L('o', 'Av', { c: 'coral', dash: 1 }) },
    },
    {
      t: 'One direction only stretches', b: ['A sends [1, 1] to [3, 3]: the <b>same direction</b>, three times longer.', '[1, 1] is an eigenvector of A, and 3 is its eigenvalue.'],
      n: 'Eigen is German for "own": the matrix’s own directions.',
      s: { Ae1: pt(3, 3, { c: 'green', r: 0.17, sub: 'A[1, 1] = [3, 3] = 3 × [1, 1]' }, E), e1: { sub: '' } },
      l: { lAe1: L('o', 'Ae1', { c: 'green', sw: 3 }) },
    },
    {
      t: 'And another stays put', b: ['A sends [1, −1] to [1, −1]: unchanged. It is an eigenvector with eigenvalue 1.', 'A 2 × 2 matrix like this has two eigen-directions, and they are perpendicular because A is symmetric.'],
      n: 'Along these directions, a complicated matrix acts like simple multiplication.',
      s: { e2: { c: 'green', r: 0.17, hl: 1, sub: 'A[1, −1] = [1, −1] = 1 × [1, −1]' }, Au: { o: 0.35 }, Av: { o: 0.35 } },
      l: { le2: { c: 'green', sw: 3 } },
    },
    {
      t: 'Why it matters: PCA', b: ['ShopSense customers plotted by monthly orders and average spend form a stretched cloud. The eigenvector of the data’s covariance matrix with the largest eigenvalue points along the stretch.', 'That direction is the first principal component: one number that keeps most of the information.'],
      n: 'PCA (Phase 1) compresses many features into a few eigen-directions.',
      clear: true,
      s: (() => {
        const o = { ...axes(4, 'orders', 'spend', 1.0) };
        const P = [[0.6, 0.8], [1.0, 0.9], [1.3, 1.5], [1.7, 1.4], [2.0, 2.2], [2.4, 2.1], [2.7, 2.9], [3.1, 2.8], [1.5, 1.1], [2.2, 2.6]];
        P.forEach(([a, b], i) => { o['c' + i] = pt(a, b, { c: 'blue', r: 0.12 }, 1.0); });
        o.p0 = pt(0.4, 0.4, { r: 0.04, c: 'green', o: 0 }, 1.0); o.p1 = pt(3.5, 3.4, { r: 0.12, c: 'green', sub: 'first principal component' }, 1.0);
        return o;
      })(),
      l: { pc: L('p0', 'p1', { c: 'green', sw: 3 }) },
    },
  ],
  math: {
    blocks: [
      { h: 'Definition', f: 'A v = λ v     (v ≠ 0)', p: 'v is an eigenvector, λ (lambda) its eigenvalue: applying A only scales v by λ.' },
      { h: 'Finding eigenvalues (2 × 2)', f: 'det(A − λI) = 0\n\nA = [[2, 1], [1, 2]]\n(2 − λ)² − 1 = 0  →  λ = 3 or λ = 1' },
      { h: 'PCA in one line', f: 'Σ = covariance matrix of the centred data\nprincipal components = eigenvectors of Σ, sorted by eigenvalue', p: 'Each eigenvalue is the variance of the data along its eigenvector.' },
    ],
    example: {
      intro: 'Verify the eigenvectors of A = [[2, 1], [1, 2]].',
      steps: ['A × [1, 1] = [2×1 + 1×1, 1×1 + 2×1] = [3, 3] = <b>3 × [1, 1]</b>. Eigenvalue 3.', 'A × [1, −1] = [2 − 1, 1 − 2] = [1, −1] = <b>1 × [1, −1]</b>. Eigenvalue 1.', 'A × [1, 0] = [2, 1], which is not a multiple of [1, 0]. Not an eigenvector.', 'The eigenvalues sum to 4 = 2 + 2, the diagonal sum (trace) of A, a handy check.'],
    },
  },
  code: {
    scratch: { why: 'Power iteration: apply A again and again and the arrow settles on the top eigenvector.', src: `from math import sqrt

A = [[2, 1], [1, 2]]
v = [1.0, 0.0]

for step in range(1, 9):
    w = [A[0][0] * v[0] + A[0][1] * v[1], A[1][0] * v[0] + A[1][1] * v[1]]
    length = sqrt(w[0] ** 2 + w[1] ** 2)
    v = [w[0] / length, w[1] / length]
    if step in (1, 2, 4, 8):
        print(f"step {step}: direction = [{v[0]:.4f}, {v[1]:.4f}]")

Av = [A[0][0] * v[0] + A[0][1] * v[1], A[1][0] * v[0] + A[1][1] * v[1]]
print("eigenvalue estimate:", round(Av[0] / v[0], 4))` },
    library: { why: 'NumPy finds all eigenvalues and eigenvectors (eigh is for symmetric matrices).', src: `import numpy as np

A = np.array([[2.0, 1.0], [1.0, 2.0]])
values, vectors = np.linalg.eigh(A)   # ascending order
print("eigenvalues:", values)
print("eigenvectors (columns):\\n", np.round(vectors, 4))

v = vectors[:, 1]
print("A @ v =", np.round(A @ v, 4), " λ v =", np.round(values[1] * v, 4))` },
    prod: { why: 'PCA from scratch with eigh, tested on data with a known main direction.', src: `import numpy as np
from numpy.typing import NDArray


def pca(X: NDArray, k: int) -> tuple[NDArray, NDArray]:
    """Return (components (k, d), explained variance ratio (k,)) via the covariance eigendecomposition."""
    Xc = X - X.mean(axis=0)
    cov = Xc.T @ Xc / (len(X) - 1)
    values, vectors = np.linalg.eigh(cov)
    order = np.argsort(values)[::-1][:k]
    return vectors[:, order].T, values[order] / values.sum()


def test_pca() -> None:
    t = np.linspace(0, 10, 50)
    X = np.c_[t, 2 * t]                   # all points on the line y = 2x
    comps, ratio = pca(X, 1)
    assert ratio[0] > 0.999
    assert abs(abs(comps[0] @ np.array([1, 2]) / np.sqrt(5)) - 1) < 1e-9


test_pca()
rng = np.random.default_rng(7)
orders = rng.normal(5, 2, 200)
spend = 300 * orders + rng.normal(0, 300, 200)
_, ratio = pca(np.c_[orders, spend / 300], 2)
print("explained variance ratio:", np.round(ratio, 3))` },
  },
  industry: {
    when: ['PCA for compressing and visualising many features (Phase 1).', 'Matrix factorisation in recommendation systems.', 'Understanding stability of systems and the maths behind spectral clustering.'],
    baseline: 'Use library PCA (scikit-learn) and look at the explained variance ratio before choosing how many components to keep.',
    tools: ['numpy.linalg.eigh and svd', 'scikit-learn PCA and TruncatedSVD', 'Implicit or Surprise libraries for recommendation factorisation'],
    tradeoffs: ['Fewer components compress more but lose detail.', 'PCA finds straight-line directions only; curved structure needs other methods (UMAP, t-SNE).'],
    failures: ['Forgetting to scale features, so the feature with the biggest units dominates the first component.', 'Reading meaning into components that mix many features.', 'Eigenvector signs flipping between runs and breaking comparisons.'],
    shopsense: 'Phase 1 uses PCA to summarise dozens of customer behaviour features for clustering shoppers into segments.',
    interview: [
      ['What is an eigenvector, in plain words?', 'A direction that a matrix only stretches or shrinks, without turning. The stretch factor is the eigenvalue.'],
      ['How does PCA use eigenvectors?', 'It computes the covariance matrix of centred data and keeps the eigenvectors with the largest eigenvalues, the directions of greatest variance.'],
      ['Why scale features before PCA?', 'Variance depends on units. Without scaling, a feature measured in rupees can dominate one measured in counts.'],
    ],
  },
  quiz: [
    { q: 'A v = 3v. What is the eigenvalue?', opts: ['v', '3', 'A', '1/3'], a: 1, why: 'The eigenvalue is the scale factor λ in A v = λ v.' },
    { q: 'For A = [[2, 1], [1, 2]], what is A × [1, −1]?', opts: ['[3, 3]', '[1, −1]', '[2, −2]', '[−1, 1]'], a: 1, why: '[2 − 1, 1 − 2] = [1, −1], so eigenvalue 1.' },
    { q: 'Which vector is NOT an eigenvector of [[2, 1], [1, 2]]?', opts: ['[1, 1]', '[2, 2]', '[1, −1]', '[1, 0]'], a: 3, why: 'A[1, 0] = [2, 1], which points in a different direction.' },
    { q: 'In PCA, the first principal component is…', opts: ['The first column of the data', 'The eigenvector of the covariance matrix with the largest eigenvalue', 'The mean of the data', 'A random direction'], a: 1, why: 'It is the direction of greatest variance.' },
    { q: 'Why scale features before PCA?', opts: ['To make it faster', 'So that features with large units do not dominate the variance', 'PCA needs integers', 'To remove outliers'], a: 1, why: 'Variance is unit-dependent; scaling puts features on equal footing.' },
  ],
  exercise: {
    task: ['Write <code>is_eigenvector(A, v)</code> that returns <code>(True, λ)</code> if <code>A @ v</code> is a multiple of <code>v</code>, otherwise <code>(False, None)</code>. Use NumPy.'],
    starter: `import numpy as np


def is_eigenvector(A, v):
    pass


A = np.array([[4.0, 1.0], [2.0, 3.0]])
print(is_eigenvector(A, np.array([1.0, 1.0])))
print(is_eigenvector(A, np.array([1.0, 0.0])))`,
    check: `ok, lam = is_eigenvector(A, np.array([1.0, 1.0]))
assert ok and abs(lam - 5) < 1e-9, "A @ [1, 1] = [5, 5]"
ok2, lam2 = is_eigenvector(A, np.array([1.0, -2.0]))
assert ok2 and abs(lam2 - 2) < 1e-9
assert is_eigenvector(A, np.array([1.0, 0.0])) == (False, None)`,
    solution: `import numpy as np


def is_eigenvector(A, v):
    Av = A @ v
    i = int(np.argmax(np.abs(v)))
    lam = Av[i] / v[i]
    if np.allclose(Av, lam * v):
        return True, float(lam)
    return False, None


A = np.array([[4.0, 1.0], [2.0, 3.0]])
print(is_eigenvector(A, np.array([1.0, 1.0])))
print(is_eigenvector(A, np.array([1.0, 0.0])))`,
    hint: 'Compute λ from one non-zero entry, <code>Av[i] / v[i]</code>, then check <code>np.allclose(A @ v, λ * v)</code>.',
  },
};

// ===================================================================== P0.14
const loss = (w) => (w - 3) ** 2 + 1;
const ZS = 0.3;
const curve = () => {
  const o = { base: S(3, 0, 6.4, 0.05, { c: 'slate', h: 0.02, noshadow: 1 }), wl: T('weight w →', 7.2, 0.5, { fs: 11.5, c: 'muted' }) };
  for (let i = 0; i <= 12; i++) { const w = i * 0.5; o['c' + i] = { k: 'orb', x: w, y: 0, z: loss(w) * ZS, r: 0.07, c: 'slate', noshadow: 1 }; }
  return o;
};
const curveL = () => Object.fromEntries(Array.from({ length: 12 }, (_, i) => ['k' + i, L('c' + i, 'c' + (i + 1), { c: 'slate', na: 1, sw: 2 })]));
const ball = (w, o = {}) => ({ k: 'orb', x: w, y: 0, z: loss(w) * ZS + 0.12, r: 0.2, c: 'coral', ...o });
const l14 = {
  id: 'p0-14', title: 'Derivatives and gradients', time: '40 minutes',
  sub: 'Measure how fast a value changes, and use that slope to walk downhill to the lowest error. This is how models learn.',
  learn: ['Read a derivative as the slope of a curve at a point', 'Compute derivatives of simple functions and estimate them numerically', 'Take gradient-descent steps towards a minimum'],
  legend: [['#b8bdd4', 'loss curve'], [BAD, 'current weight'], [SIGNAL, 'slope'], [GOOD, 'minimum']],
  steps: [
    {
      t: 'A loss curve', b: ['A model has one weight w. For each value of w, the loss L(w) measures how wrong the model is. Here <code>L(w) = (w − 3)² + 1</code>.', 'Training means finding the w with the lowest loss.'],
      n: 'Height is the loss. Lower is better. The lowest point is at w = 3.',
      s: curve(), l: curveL(),
    },
    {
      t: 'Start somewhere', b: ['Training starts with a guess: w = 5. The loss there is (5 − 3)² + 1 = 5.', 'Which way should w move to reduce the loss?'],
      n: 'The model cannot see the whole curve. It only knows the loss near where it stands.',
      s: { b: ball(5), bl: T('w = 5, loss 5', 5.4, -1.0, { z: 2.0, fs: 12, c: 'coral', b: 1 }) },
    },
    {
      t: 'The derivative is the slope', b: ['The derivative <code>L′(w) = 2(w − 3)</code> gives the slope at any point. At w = 5 the slope is 2 × 2 = <b>4</b>: the curve rises steeply to the right.', 'A positive slope means "loss goes up if w goes up", so w should go down.'],
      n: 'The amber line touches the curve at one point: the tangent. Its steepness is the derivative.',
      s: { t0: { k: 'orb', x: 4.4, y: 0, z: (5 - 4 * 0.6) * ZS, r: 0.05, c: 'amber', noshadow: 1, o: 0 }, t1: { k: 'orb', x: 5.6, y: 0, z: (5 + 4 * 0.6) * ZS, r: 0.05, c: 'amber', noshadow: 1, o: 0 }, bl: { t: 'slope L′(5) = 4' , c: 'amber' } },
      l: { tan: L('t0', 't1', { c: 'amber', na: 1, sw: 3 }) },
    },
    {
      t: 'Step downhill', b: ['Gradient descent moves against the slope: <code>w ← w − η × L′(w)</code>. With learning rate η = 0.1, w goes from 5 to 5 − 0.1 × 4 = <b>4.6</b>.', 'The loss drops from 5 to (1.6)² + 1 = 3.56.'],
      n: 'The learning rate sets the step size. Too big overshoots; too small crawls.',
      s: { b: ball(4.6), bl: { t: 'w = 4.6, loss 3.56', c: 'coral', x: 5.0 }, t0: null, t1: null },
      l: { tan: null },
    },
    {
      t: 'Repeat until the slope is zero', b: ['Each step uses the new slope, which shrinks as the curve flattens. After about 20 steps, w is within 0.04 of 3.', 'At the minimum the slope is zero, so the steps stop by themselves.'],
      n: 'With millions of weights the slope becomes a gradient, a vector of slopes, but the rule is the same.',
      s: { b: ball(3.0, { c: 'green', hl: 1 }), bl: { t: 'minimum: w = 3, loss 1', c: 'green', x: 3.4, z: 1.6 }, g1: ball(4.28, { r: 0.1, o: 0.5 }), g2: ball(3.82, { r: 0.1, o: 0.5 }), g3: ball(3.52, { r: 0.1, o: 0.5 }) },
    },
  ],
  math: {
    blocks: [
      { h: 'Derivative as a limit', f: 'f′(x) = lim (f(x + h) − f(x)) / h   as h → 0', p: 'In code we approximate it with a small h: the central difference (f(x + h) − f(x − h)) / 2h is more accurate.' },
      { h: 'Rules you will use', f: 'd/dx (c) = 0\nd/dx (xⁿ) = n xⁿ⁻¹\nd/dx (a f + b g) = a f′ + b g′\nd/dx (eˣ) = eˣ      d/dx (ln x) = 1/x' },
      { h: 'Gradient descent', f: '∇L = [∂L/∂w₁, ∂L/∂w₂, …]\nw ← w − η ∇L', p: 'The gradient points uphill; subtracting it moves downhill. η is the learning rate.' },
    ],
    example: {
      intro: 'Two gradient-descent steps on L(w) = (w − 3)² + 1 from w = 5 with η = 0.1.',
      steps: ['Derivative: L′(w) = 2(w − 3). At w = 5, L′ = 4.', 'Step 1: w = 5 − 0.1 × 4 = <b>4.6</b>. Loss = 1.6² + 1 = <b>3.56</b>.', 'At w = 4.6, L′ = 2 × 1.6 = 3.2. Step 2: w = 4.6 − 0.32 = <b>4.28</b>. Loss = 1.28² + 1 ≈ <b>2.64</b>.', 'Each step multiplies the distance to 3 by 0.8 (here 1 − 2η), so the steps shrink as w nears the minimum.'],
    },
  },
  code: {
    scratch: { why: 'A numerical derivative and a gradient-descent loop in plain Python.', src: `def loss(w):
    return (w - 3) ** 2 + 1


def derivative(f, x, h=1e-5):
    return (f(x + h) - f(x - h)) / (2 * h)


print("slope at w=5:", round(derivative(loss, 5), 6))

w, lr = 5.0, 0.1
for step in range(1, 21):
    w -= lr * derivative(loss, w)
    if step in (1, 2, 5, 10, 20):
        print(f"step {step:2d}: w = {w:.4f}, loss = {loss(w):.4f}")` },
    library: { why: 'SymPy computes exact derivatives symbolically.', src: `import sympy as sp

w = sp.symbols("w")
L = (w - 3) ** 2 + 1
dL = sp.diff(L, w)
print("L'(w) =", sp.expand(dL))
print("slope at w=5:", dL.subs(w, 5))
print("minimum where L'(w) = 0:", sp.solve(dL, w))

x, y = sp.symbols("x y")
f = x ** 2 + 3 * x * y
print("gradient of x² + 3xy:", [sp.diff(f, v) for v in (x, y)])` },
    prod: { why: 'A gradient checker: the standard test for hand-written derivatives.', src: `import numpy as np
from collections.abc import Callable


def numerical_grad(f: Callable[[np.ndarray], float], w: np.ndarray, h: float = 1e-5) -> np.ndarray:
    grad = np.zeros_like(w)
    for i in range(w.size):
        e = np.zeros_like(w)
        e[i] = h
        grad[i] = (f(w + e) - f(w - e)) / (2 * h)
    return grad


def check_grad(f, grad_f, w, tol=1e-6) -> float:
    """Relative difference between analytic and numerical gradients."""
    a, n = grad_f(w), numerical_grad(f, w)
    rel = np.linalg.norm(a - n) / max(np.linalg.norm(a) + np.linalg.norm(n), 1e-12)
    if rel > tol:
        raise AssertionError(f"gradient mismatch: {rel:.2e}")
    return rel


f = lambda w: float(((w - 3) ** 2).sum() + 1)
grad_f = lambda w: 2 * (w - 3)
print(f"relative error: {check_grad(f, grad_f, np.array([5.0, -1.0, 2.5])):.1e}")` },
  },
  industry: {
    when: ['Training every model in Phases 1–4: the optimiser follows gradients.', 'Debugging custom loss functions with gradient checks.', 'Sensitivity analysis: how much does the output change if an input changes?'],
    baseline: 'Let the framework compute gradients (autograd). Check any hand-written gradient against a numerical estimate before trusting it.',
    tools: ['PyTorch and JAX autograd', 'SymPy for symbolic work', 'Numerical differentiation for testing'],
    tradeoffs: ['Larger learning rates train faster but can diverge.', 'Numerical gradients are simple but slow and approximate; autograd is exact and fast.'],
    failures: ['Learning rate too high: loss explodes to NaN.', 'Learning rate too low: training stalls.', 'Vanishing or exploding gradients in deep networks (Phase 2).'],
    shopsense: 'The churn model in Phase 1 learns its weights by gradient descent on a loss over past customers.',
    interview: [
      ['What does gradient descent do?', 'It repeatedly moves parameters a small step against the gradient of the loss, which is the direction of steepest decrease.'],
      ['What happens if the learning rate is too large?', 'Steps overshoot the minimum; the loss oscillates or diverges.'],
      ['How do you verify a hand-written gradient?', 'Compare it with a central-difference numerical gradient at random points; the relative error should be tiny (around 1e-7).'],
    ],
  },
  quiz: [
    { q: 'L(w) = (w − 3)² + 1. What is L′(5)?', opts: ['2', '4', '5', '10'], a: 1, why: 'L′(w) = 2(w − 3) = 2 × 2 = 4.' },
    { q: 'At w = 5 the slope is 4 and η = 0.1. What is the next w?', opts: ['5.4', '4.6', '4.0', '1.0'], a: 1, why: 'w − η × slope = 5 − 0.4 = 4.6.' },
    { q: 'What is the derivative of x³?', opts: ['3x', 'x²', '3x²', 'x³/3'], a: 2, why: 'Power rule: n xⁿ⁻¹.' },
    { q: 'The loss jumps to NaN after a few steps. What is the most likely cause?', opts: ['Learning rate too small', 'Learning rate too large', 'Too much data', 'The loss is convex'], a: 1, why: 'Large steps overshoot and blow up.' },
    { q: 'What is the slope at a minimum of a smooth curve?', opts: ['Positive', 'Negative', 'Zero', 'Infinite'], a: 2, why: 'The curve is flat at its lowest point.' },
  ],
  exercise: {
    task: ['Write <code>gradient_descent(start, lr, steps)</code> for L(w) = (w − 3)² + 1 using the exact derivative 2(w − 3). Return the final w. Then run it from w = 0 with lr = 0.1 for 50 steps and store the result in <code>w_final</code>.'],
    starter: `def gradient_descent(start, lr, steps):
    w = start
    # your loop here
    return w


w_final = gradient_descent(0.0, 0.1, 50)
print(round(w_final, 4))`,
    check: `assert abs(w_final - 3) < 1e-3, "after 50 steps w should be very close to 3"
assert abs(gradient_descent(5.0, 0.1, 1) - 4.6) < 1e-9, "one step from 5 should give 4.6"`,
    solution: `def gradient_descent(start, lr, steps):
    w = start
    for _ in range(steps):
        w -= lr * 2 * (w - 3)
    return w


w_final = gradient_descent(0.0, 0.1, 50)
print(round(w_final, 4))`,
    hint: 'Inside the loop: <code>w -= lr * 2 * (w - 3)</code>.',
  },
};

// ===================================================================== P0.15
const l15 = {
  id: 'p0-15', title: 'The chain rule', time: '40 minutes',
  sub: 'Differentiate functions built from other functions by multiplying local slopes. Backpropagation is this rule, applied at scale.',
  learn: ['Apply the chain rule to nested functions', 'Run a forward and a backward pass on a tiny computation graph', 'Explain how backpropagation computes gradients for every weight'],
  legend: [[DATA, 'value'], [SYS, 'operation'], [SIGNAL, 'local slope'], [BAD, 'gradient flowing back']],
  steps: [
    {
      t: 'Functions inside functions', b: ['y = (2x + 1)² is two steps: first u = 2x + 1, then y = u². With x = 1: u = 3 and y = 9.', 'This is a forward pass: values flow left to right.'],
      n: 'Each box does one simple operation. Complicated models are long chains of simple boxes.',
      s: { x: O(0, 0, { r: 0.3, c: 'blue', sub: 'x = 1' }), f1: B('2x + 1', 2.6, 0, { c: 'teal', w: 1.4, d: 1.0, h: 0.5, fs: 11 }), u: O(5.0, 0, { r: 0.3, c: 'blue', sub: 'u = 3' }), f2: B('u²', 7.4, 0, { c: 'teal', w: 1.2, d: 1.0, h: 0.5, fs: 12 }), y: O(9.8, 0, { r: 0.3, c: 'blue', sub: 'y = 9' }) },
      l: { a: L('x', 'f1', { flow: 1 }), b: L('f1', 'u', { flow: 1 }), c: L('u', 'f2', { flow: 1 }), d: L('f2', 'y', { flow: 1 }) },
    },
    {
      t: 'Each box knows its own slope', b: ['Box 1: du/dx = 2 (u grows twice as fast as x). Box 2: dy/du = 2u = 6 at u = 3.', 'Each slope is local: it only needs the box’s own input.'],
      n: 'Think of gears: each gear turns the next at its own ratio.',
      s: { s1: T('du/dx = 2', 2.6, -1.4, { z: 0.6, fs: 12.5, b: 1, c: 'amber' }), s2: T('dy/du = 2u = 6', 7.4, -1.4, { z: 0.6, fs: 12.5, b: 1, c: 'amber' }) },
    },
    {
      t: 'Multiply the slopes', b: ['The chain rule: <b>dy/dx = dy/du × du/dx = 6 × 2 = 12</b>.', 'Check: nudge x from 1 to 1.001 and y goes from 9 to about 9.012, a change 12 times as big.'],
      n: 'Two gears with ratios 2 and 6 give an overall ratio of 12.',
      s: { tot: T('dy/dx = 6 × 2 = 12', 4.9, 2.2, { fs: 14, b: 1, c: 'coral' }), x: { hl: 1 } },
      l: { r1: L('y', 'u', { c: 'coral', dash: 1, bend: 1.2 }), r2: L('u', 'x', { c: 'coral', dash: 1, bend: 1.2 }) },
    },
    {
      t: 'A tiny model: forward pass', b: ['A one-weight model predicts y = w × x. With x = 2 and w = 1.5 it predicts 3. The target is 4, so the loss (y − t)² = (3 − 4)² = 1.', 'To improve w, we need dL/dw.'],
      n: 'Same picture, new meaning: the boxes are a model and its loss.',
      clear: true,
      s: { w: O(0, -1.4, { r: 0.28, c: 'amber', sub: 'w = 1.5' }), x: O(0, 1.4, { r: 0.28, c: 'blue', sub: 'x = 2' }), m: B('× ', 2.8, 0, { c: 'teal', w: 1.0, d: 1.0, h: 0.5, fs: 14 }), y: O(5.2, 0, { r: 0.3, c: 'blue', sub: 'y = 3' }), lf: B('(y − 4)²', 7.8, 0, { c: 'teal', w: 1.5, d: 1.0, h: 0.5, fs: 11 }), L: O(10.4, 0, { r: 0.3, c: 'coral', sub: 'loss = 1' }) },
      l: { a: L('w', 'm', { flow: 1 }), b: L('x', 'm', { flow: 1 }), c: L('m', 'y', { flow: 1 }), d: L('y', 'lf', { flow: 1 }), e: L('lf', 'L', { flow: 1 }) },
    },
    {
      t: 'Backward pass: gradients flow back', b: ['Start at the loss and walk backwards, multiplying local slopes. dL/dy = 2(y − 4) = <b>−2</b>. dy/dw = x = 2. So <b>dL/dw = −2 × 2 = −4</b>.', 'Negative means increasing w lowers the loss. Gradient descent with η = 0.1 moves w from 1.5 to 1.9.'],
      n: 'Backpropagation does exactly this for millions of weights, reusing each intermediate result once.',
      s: { gy: T('dL/dy = −2', 6.5, -1.6, { z: 0.8, fs: 12.5, b: 1, c: 'coral' }), gw: T('dL/dw = −2 × x = −4', 1.6, -3.0, { z: 0.8, fs: 12.5, b: 1, c: 'coral' }), w: { hl: 1 } },
      l: { r1: L('L', 'y', { c: 'coral', dash: 1, bend: -1.4 }), r2: L('y', 'w', { c: 'coral', dash: 1, bend: -1.2 }) },
    },
  ],
  math: {
    blocks: [
      { h: 'The chain rule', f: 'if y = f(g(x)) then dy/dx = f′(g(x)) · g′(x)\n\nwith u = g(x):  dy/dx = dy/du · du/dx' },
      { h: 'Longer chains', f: 'dL/dw = dL/dy · dy/dz · dz/dw', p: 'Multiply the local slopes along the path from the output back to the weight.' },
      { h: 'One-weight model', f: 'y = w x,   L = (y − t)²\ndL/dy = 2(y − t),   dy/dw = x\ndL/dw = 2(y − t) · x' },
    ],
    example: {
      intro: 'Backpropagate through y = w x, L = (y − t)² with x = 2, w = 1.5, t = 4.',
      steps: ['Forward: y = 1.5 × 2 = <b>3</b>. L = (3 − 4)² = <b>1</b>.', 'Backward, step 1: dL/dy = 2(3 − 4) = <b>−2</b>.', 'Backward, step 2: dy/dw = x = 2, so dL/dw = −2 × 2 = <b>−4</b>.', 'Update with η = 0.1: w = 1.5 − 0.1 × (−4) = <b>1.9</b>. New prediction 3.8, new loss 0.04: much better.'],
    },
  },
  code: {
    scratch: { why: 'Forward and backward passes by hand, then a few training steps.', src: `x, t = 2.0, 4.0
w, lr = 1.5, 0.1

for step in range(1, 6):
    y = w * x                 # forward
    loss = (y - t) ** 2
    dL_dy = 2 * (y - t)       # backward
    dL_dw = dL_dy * x
    print(f"step {step}: w={w:.4f}  y={y:.4f}  loss={loss:.4f}  dL/dw={dL_dw:.4f}")
    w -= lr * dL_dw` },
    library: { why: 'SymPy confirms the chain rule symbolically.', src: `import sympy as sp

x = sp.symbols("x")
y = (2 * x + 1) ** 2
print("dy/dx =", sp.diff(y, x), "  at x=1:", sp.diff(y, x).subs(x, 1))

w, xv, t = sp.symbols("w x t")
L = (w * xv - t) ** 2
dL_dw = sp.diff(L, w)
print("dL/dw =", sp.factor(dL_dw))
print("at w=1.5, x=2, t=4:", dL_dw.subs({w: 1.5, xv: 2, t: 4}))` },
    prod: { why: 'A minimal reverse-mode autograd: the idea inside PyTorch, in 30 lines.', src: `class Value:
    """A number that remembers how it was computed, so it can backpropagate."""

    def __init__(self, data, parents=(), grad_fns=()):
        self.data, self.grad = data, 0.0
        self._parents, self._grad_fns = parents, grad_fns

    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        return Value(self.data + other.data, (self, other), (lambda g: g, lambda g: g))

    def __mul__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        return Value(self.data * other.data, (self, other),
                     (lambda g: g * other.data, lambda g: g * self.data))

    def __sub__(self, other):
        return self + (other * -1 if isinstance(other, Value) else Value(-other))

    def backward(self, g=1.0):
        self.grad += g
        for parent, fn in zip(self._parents, self._grad_fns):
            parent.backward(fn(g))


w, x = Value(1.5), Value(2.0)
err = w * x - 4.0
loss = err * err
loss.backward()
print("loss =", loss.data, " dL/dw =", w.grad, " dL/dx =", x.grad)
assert w.grad == -4.0` },
  },
  industry: {
    when: ['Every time a neural network trains: backpropagation is the chain rule.', 'Understanding why deep networks can have vanishing or exploding gradients.', 'Debugging custom layers and losses.'],
    baseline: 'Trust the framework’s autograd for standard layers; write a gradient check for any custom operation.',
    tools: ['PyTorch autograd (loss.backward())', 'JAX grad', 'micrograd-style toy engines for learning'],
    tradeoffs: ['Storing every intermediate value makes the backward pass fast but uses memory; gradient checkpointing trades compute for memory.', 'Long chains multiply many slopes: small slopes vanish, large ones explode.'],
    failures: ['Gradients vanishing through many saturated activations.', 'Exploding gradients without clipping in recurrent networks.', 'Accidentally detaching a tensor so no gradient flows.'],
    shopsense: 'Every deep model in Phases 2–4, from image classification to fine-tuned language models, learns through this backward pass.',
    interview: [
      ['Explain backpropagation in one sentence.', 'It applies the chain rule backwards through the computation graph, multiplying local derivatives to get the gradient of the loss with respect to every parameter, reusing shared intermediate results.'],
      ['Why do gradients vanish in deep networks?', 'The gradient is a product of many local derivatives; if many are below 1 (for example saturated sigmoids), the product shrinks towards zero.'],
      ['What is reverse-mode autodiff and why is it used for training?', 'It computes all partial derivatives of one scalar output with respect to many inputs in a single backward pass, ideal for one loss and millions of weights.'],
    ],
  },
  quiz: [
    { q: 'y = (2x + 1)². What is dy/dx at x = 1?', opts: ['6', '9', '12', '4'], a: 2, why: 'dy/du × du/dx = 2u × 2 = 2 × 3 × 2 = 12.' },
    { q: 'If dy/du = 5 and du/dx = 3, what is dy/dx?', opts: ['8', '15', '2', '5/3'], a: 1, why: 'Multiply the local slopes.' },
    { q: 'y = w x and L = (y − t)². What is dL/dw?', opts: ['2(y − t)', '2(y − t) x', 'x', '(y − t)²'], a: 1, why: 'dL/dy × dy/dw = 2(y − t) × x.' },
    { q: 'dL/dw = −4. Gradient descent with η = 0.1 changes w by…', opts: ['−0.4', '+0.4', '−4', '+4'], a: 1, why: 'w ← w − η × (−4) = w + 0.4.' },
    { q: 'Why do gradients vanish in very deep networks?', opts: ['Too much data', 'Many local slopes below 1 multiply together', 'The learning rate is too high', 'Weights are integers'], a: 1, why: 'A long product of small numbers shrinks towards zero.' },
  ],
  exercise: {
    task: ['For the model y = w × x + b with loss L = (y − t)², write <code>grads(w, b, x, t)</code> returning <code>(dL/dw, dL/db)</code>. Then compute them for w = 1.5, b = 0.5, x = 2, t = 4 and store the result in <code>g</code>.'],
    starter: `def grads(w, b, x, t):
    y = w * x + b
    # dL/dy, then use the chain rule for w and b
    pass


g = grads(1.5, 0.5, 2.0, 4.0)
print(g)`,
    check: `assert g == (-2.0, -1.0), "y = 3.5, dL/dy = -1, dL/dw = -1 * 2, dL/db = -1 * 1"
assert grads(1.0, 0.0, 3.0, 3.0) == (0.0, 0.0)`,
    solution: `def grads(w, b, x, t):
    y = w * x + b
    dL_dy = 2 * (y - t)
    return dL_dy * x, dL_dy * 1.0


g = grads(1.5, 0.5, 2.0, 4.0)
print(g)`,
    hint: 'dy/dw = x and dy/db = 1. Multiply each by dL/dy = 2(y − t).',
  },
};

export default [l11, l12, l13, l14, l15];
