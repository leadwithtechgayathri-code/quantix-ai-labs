import { Scene, buildStates, bounds } from './engine.js';
import { esc } from './kit.js';
import { runPython, highlight, renderOutput } from './runner.js';
// checked outputs, registered by each phase bundle as it loads
export const OUT = {};
export const registerOutputs = (o) => Object.assign(OUT, o);

const LAYERS = [
  ['concept', 'Concept', 'See it work'],
  ['math', 'Maths', 'The formulas'],
  ['code', 'Code', 'Build it three ways'],
  ['industry', 'Industry lens', 'How teams use it'],
  ['practice', 'Practice', 'Quiz and exercise'],
];
const SHOW = { simple: ['concept', 'industry', 'practice'], code: ['concept', 'code', 'industry', 'practice'], math: LAYERS.map((l) => l[0]) };
const CODE_TABS = [['scratch', 'From scratch', 'Plain Python, to see the mechanics'], ['library', 'With the library', 'How you would normally write it'], ['prod', 'Production style', 'Typed, tested, reusable']];
const $ = (s, r = document) => r.querySelector(s);

export function renderLesson(root, L, ctx) {
  const visible = LAYERS.filter(([k]) => SHOW[ctx.level].includes(k));
  let layer = visible.some(([k]) => k === ctx.layer) ? ctx.layer : visible[0][0];
  const seen = new Set();
  root.innerHTML = `
  <article class="lesson">
    <div class="crumbs"><b>Phase ${esc(L.phaseN)} · ${esc(L.phaseName)}</b> · Lesson ${esc(L.ref)}</div>
    <h1>${esc(L.title)}</h1>
    <p class="lede">${esc(L.sub)}</p>
    <div class="start">
      <div><b class="h">You will be able to</b><ul>${L.learn.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <div><b class="h">How to use this lesson · about ${esc(L.time)}</b>Work through the layers in order with the tabs below or the Next button. Each layer ends by pointing to the next. Use the depth switch at the top to show fewer layers.</div>
    </div>
    <div class="ltabs" role="tablist" aria-label="Lesson layers" id="layers"></div>
    <section id="layer" aria-live="polite"></section>
  </article>`;
  const tabs = $('#layers', root), body = $('#layer', root);
  function drawTabs() {
    tabs.innerHTML = visible.map(([k, name], i) => `<button type="button" role="tab" data-k="${k}" class="${seen.has(k) ? 'seen' : ''}" aria-current="${k === layer}"><span class="ln">${i + 1}</span>${esc(name)}</button>`).join('');
  }
  function go(k, scroll = true) {
    layer = k; seen.add(k); ctx.onLayer(k);
    drawTabs();
    const idx = visible.findIndex(([x]) => x === k);
    const [, name, hint] = visible[idx];
    const next = visible[idx + 1];
    body.innerHTML = `<div class="lhead"><h2>${idx + 1}. ${esc(name)}</h2><p>${esc(hint)}</p></div><div id="lbody"></div>
      <div class="pnav">${idx > 0 ? `<button class="btn" type="button" data-go="${visible[idx - 1][0]}">← ${esc(visible[idx - 1][1])}</button>` : ''}
      ${next ? `<button class="btn primary" type="button" data-go="${next[0]}">Next: ${esc(next[1])} →</button>` : ctx.next ? `<a class="btn primary" href="#${ctx.next.id}">Next lesson: ${esc(ctx.next.title)} →</a>` : '<a class="btn primary" href="#home">Back to the roadmap</a>'}</div>`;
    const lb = $('#lbody', body);
    ({ concept, math, code, industry, practice })[k](lb, L, ctx);
    if (scroll) tabs.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
  tabs.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) go(b.dataset.k); });
  body.addEventListener('click', (e) => { const b = e.target.closest('[data-go]'); if (b) go(b.dataset.go); });
  go(layer, false);
  return { key: (d) => ctx.conceptKey?.(d) };
}

// ---------- 1. Concept: step-through animation ----------
function concept(el, L, ctx) {
  el.innerHTML = `<div class="player">
    <figure class="stage"><span class="badge" id="c-badge"></span><svg id="c-svg" role="img" aria-label="${esc(L.title)} diagram"></svg>
      ${L.legend ? `<div class="legend">${L.legend.map(([c, t]) => `<span><i style="background:${c}"></i>${esc(t)}</span>`).join('')}</div>` : ''}</figure>
    <div class="panel" aria-live="polite">
      <div class="dots" id="c-dots" role="group" aria-label="Steps"></div>
      <h3 id="c-title"></h3><div class="body" id="c-body"></div>
      <div class="nav"><button class="btn" id="c-prev" type="button">← Back</button><button class="btn primary" id="c-next" type="button">Next step →</button></div>
      <p class="hint">Use ← and → keys to step.</p>
    </div></div>`;
  const states = buildStates(L.steps);
  const all = bounds(states);
  const vbs = states.map((st) => (st.focus ? bounds([st], st.focus) : all));
  const sc = new Scene($('#c-svg', el));
  sc.frame(vbs[0]);
  let i = 0;
  const seen = new Set([0]);
  const draw = () => {
    const s = L.steps[i];
    sc.show(states[i], { vb: vbs[i], dur: 800 });
    $('#c-badge', el).textContent = `Step ${i + 1} of ${L.steps.length}`;
    $('#c-dots', el).innerHTML = L.steps.map((_, j) => `<button type="button" data-i="${j}" class="${seen.has(j) ? 'seen' : ''}" ${j === i ? 'aria-current="step"' : ''} aria-label="Step ${j + 1}">${j + 1}</button>`).join('');
    $('#c-title', el).textContent = s.t;
    $('#c-body', el).innerHTML = s.b.map((p) => `<p>${p}</p>`).join('') + (s.n ? `<div class="notice${s.warn ? ' warn' : ''}"><b>What to notice</b>${s.n}</div>` : '');
    $('#c-prev', el).disabled = i === 0;
    $('#c-next', el).textContent = i === L.steps.length - 1 ? 'Next: the maths →' : 'Next step →';
  };
  const step = (d) => {
    if (i + d >= L.steps.length) { el.closest('#layer').querySelector('.pnav [data-go], .pnav a')?.click(); return; }
    if (i + d < 0) return;
    i += d; seen.add(i); draw();
  };
  $('#c-prev', el).addEventListener('click', () => step(-1));
  $('#c-next', el).addEventListener('click', () => step(1));
  $('#c-dots', el).addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { i = +b.dataset.i; seen.add(i); draw(); } });
  ctx.conceptKey = (d) => { if (document.body.contains(el)) step(d); };
  draw();
}

// ---------- 2. Maths ----------
function math(el, L) {
  const M = L.math;
  el.innerHTML = `<div class="cards">
    ${M.blocks.map((b) => `<div class="card"><h3>${esc(b.h)}${b.sub ? `<small>${esc(b.sub)}</small>` : ''}</h3><div class="formula">${esc(b.f)}</div>${b.p ? `<p>${b.p}</p>` : ''}</div>`).join('')}
    <div class="card wide"><h3>Worked example<small>${esc(M.example.intro)}</small></h3><ol class="worked">${M.example.steps.map((s) => `<li>${s}</li>`).join('')}</ol></div>
  </div>`;
}

// ---------- 3. Code ----------
function code(el, L) {
  let tab = 'scratch';
  el.innerHTML = `<div class="ctabs" role="group" aria-label="Code version">${CODE_TABS.map(([k, n, d]) => `<button type="button" data-t="${k}" aria-pressed="${k === tab}"><b>${esc(n)}</b><span>${esc(d)}</span></button>`).join('')}</div><div id="cbox"></div>`;
  const box = $('#cbox', el);
  const draw = () => {
    const c = L.code[tab];
    const out = OUT[`${L.id}:${tab}`];
    box.innerHTML = `<div class="codebox">
      <div class="codebar"><span class="why">${esc(c.why)}</span><button class="btn small" type="button" data-copy>Copy</button><button class="btn small primary" type="button" data-run>Run in browser</button></div>
      <pre><code>${highlight(c.src)}</code></pre>
      <div class="out" id="o-live" hidden><b>Your run</b><pre></pre></div>
      <div class="out"><b>Output (checked)</b><pre>${renderOutput(out ?? '')}</pre></div>
      <p class="runnote" id="o-note">Runs with Python in your browser. The checked output above is what this code prints.</p>
    </div>`;
    document.querySelectorAll('.ctabs button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.t === tab)));
  };
  el.addEventListener('click', async (e) => {
    const t = e.target.closest('[data-t]');
    if (t) { tab = t.dataset.t; draw(); return; }
    if (e.target.closest('[data-copy]')) {
      const b = e.target.closest('[data-copy]');
      try { await navigator.clipboard.writeText(L.code[tab].src); b.textContent = 'Copied'; } catch { b.textContent = 'Select and copy'; }
      setTimeout(() => (b.textContent = 'Copy'), 1500);
    }
    if (e.target.closest('[data-run]')) runInto(L.code[tab].src, $('#o-live', box), $('#o-note', box), e.target.closest('[data-run]'));
  });
  draw();
}

export async function runInto(src, outEl, noteEl, btn) {
  btn.disabled = true;
  outEl.hidden = false; outEl.classList.remove('err');
  const pre = outEl.querySelector('pre');
  pre.textContent = '';
  try {
    const r = await runPython(src, (s) => (noteEl.textContent = s));
    pre.innerHTML = renderOutput(r.text);
    outEl.classList.toggle('err', !r.ok);
    noteEl.textContent = r.ok ? 'Done. If you did not change the code, this matches the checked output.' : 'The code raised an error; the last lines are shown above.';
  } catch {
    outEl.hidden = true;
    noteEl.innerHTML = 'Running Python is not available in this viewer. Copy the code into <a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> or your own Python; the checked output shows what it prints.';
  }
  btn.disabled = false;
}

// ---------- 4. Industry lens ----------
function industry(el, L) {
  const I = L.industry;
  const list = (a) => `<ul>${a.map((x) => `<li>${x}</li>`).join('')}</ul>`;
  el.innerHTML = `<div class="cards">
    <div class="card"><h3>When teams use it</h3>${list(I.when)}</div>
    <div class="card"><h3>Try this first<small>The baseline before anything clever</small></h3><p>${I.baseline}</p></div>
    <div class="card"><h3>Standard tools</h3>${list(I.tools)}</div>
    <div class="card"><h3>Trade-offs</h3>${list(I.tradeoffs)}</div>
    <div class="card"><h3>How it fails in production</h3>${list(I.failures)}</div>
    <div class="card"><h3>In ShopSense</h3><p>${I.shopsense}</p></div>
    <div class="card wide"><h3>Interview questions<small>Open each for a model answer</small></h3>${I.interview.map(([q, a]) => `<details class="qa"><summary>${esc(q)}</summary><p>${a}</p></details>`).join('')}</div>
  </div>`;
}

// ---------- 5. Practice ----------
function practice(el, L, ctx) {
  const answered = new Map();
  el.innerHTML = `<div class="quiz" id="quiz">${L.quiz.map((q, i) => `<div class="qcard" data-q="${i}"><h3><span>Q${i + 1}.</span>${esc(q.q)}</h3><div class="opts">${q.opts.map((o, j) => `<button type="button" data-o="${j}">${esc(o)}</button>`).join('')}</div><div class="fb" hidden></div></div>`).join('')}
    <div class="score" id="score" aria-live="polite">Answer all ${L.quiz.length} questions to see your score.</div></div>
    <h3 style="margin:26px 0 8px;font-size:19px">Hands-on exercise</h3>
    <div class="codebox ex">
      <div class="task">${L.exercise.task.map((p) => `<p>${p}</p>`).join('')}</div>
      <div class="codebar"><span class="why">Edit the code, then check it.</span><button class="btn small" type="button" data-hint>Hint</button><button class="btn small" type="button" data-sol>Show solution</button><button class="btn small primary" type="button" data-check>Run and check</button></div>
      <textarea id="ex-code" spellcheck="false" aria-label="Exercise code">${esc(L.exercise.starter)}</textarea>
      <div class="out" id="ex-out" hidden><b>Result</b><pre></pre></div>
      <p class="runnote" id="ex-note">Your code runs in the browser, then automatic checks test it.</p>
    </div>`;
  el.querySelector('#quiz').addEventListener('click', (e) => {
    const b = e.target.closest('[data-o]'); if (!b) return;
    const card = b.closest('[data-q]'), qi = +card.dataset.q, q = L.quiz[qi], pick = +b.dataset.o;
    if (answered.has(qi)) return;
    answered.set(qi, pick === q.a);
    card.querySelectorAll('[data-o]').forEach((x) => { x.disabled = true; if (+x.dataset.o === q.a) x.classList.add('right'); });
    if (pick !== q.a) b.classList.add('wrong');
    const fb = card.querySelector('.fb');
    fb.hidden = false;
    fb.innerHTML = `<b>${pick === q.a ? 'Correct.' : 'Not quite.'}</b>${q.why}`;
    if (answered.size === L.quiz.length) {
      const n = [...answered.values()].filter(Boolean).length;
      el.querySelector('#score').textContent = `You scored ${n} of ${L.quiz.length}. ${n === L.quiz.length ? 'Excellent.' : 'Read the explanations above, then try the exercise.'}`;
      ctx.onDone();
    }
  });
  const ta = el.querySelector('#ex-code');
  ta.addEventListener('keydown', (e) => { if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); const s = ta.selectionStart; ta.setRangeText('    ', s, ta.selectionEnd, 'end'); } });
  const note = el.querySelector('#ex-note'), out = el.querySelector('#ex-out');
  el.querySelector('[data-hint]').addEventListener('click', () => { note.innerHTML = `<b>Hint:</b> ${L.exercise.hint}`; });
  el.querySelector('[data-sol]').addEventListener('click', () => { ta.value = L.exercise.solution; note.textContent = 'Solution loaded. Run and check it, then compare with your own attempt.'; });
  el.querySelector('[data-check]').addEventListener('click', (e) => runInto(ta.value + '\n\n# --- automatic checks ---\n' + L.exercise.check + '\nprint("All checks passed.")', out, note, e.target));
}
