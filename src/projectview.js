// Project page: brief, Engineering Studio, build levels, stress lab, review.
import { Scene, buildStates, bounds } from './engine.js';
import { B, Tl, O, T, Z, L, esc } from './kit.js';
import { highlight, renderOutput } from './runner.js';
import { runInto, OUT } from './lessonview.js';

const TABS = [['brief', 'Brief'], ['studio', 'Engineering Studio'], ['build', 'Build L1–L3'], ['stress', 'Stress lab'], ['review', 'Review and deliver']];

const store = {
  get(k, d) { try { const v = localStorage.getItem('qx:' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('qx:' + k, JSON.stringify(v)); } catch { /* unavailable */ } },
};

const money = (lakh) => (lakh >= 100 ? `₹${(lakh / 100).toFixed(2)} Cr` : `₹${lakh.toFixed(1)} lakh`);

// ---------- stress-lab model (illustrative figures) ----------
function outcome(on, guarded) {
  const base = 142 * (on.diwali ? 6 : 1), daily = base / 7;
  const r = { truth: money(base) };
  if (!guarded) {
    if (on.rename) return { ...r, gmv: '—', status: 'Pipeline crashes: KeyError \'amount\'. No report today.', bad: true, run: '—' };
    const g = base - (on.empty ? daily : 0) + (on.dup ? daily : 0);
    const notes = [];
    if (on.empty) notes.push('a missing day looks like a 14% sales drop');
    if (on.dup) notes.push('one day counted twice');
    return { ...r, gmv: money(g), status: notes.length ? `Wrong, silently: ${notes.join('; ')}.` : 'Correct.', bad: notes.length > 0, run: on.diwali ? '≈ 9 min, 7.5 GB peak: over budget' : '≈ 90 s, 1.3 GB' };
  }
  if (on.rename) return { ...r, gmv: 'last good report kept', status: 'Schema check rejects the file at the door; alert names the renamed column.', bad: false, run: '—' };
  const notes = [];
  if (on.empty) notes.push('1 Nov has 0 rows: week marked incomplete, alert sent');
  if (on.dup) notes.push('repeat file skipped, logged');
  return { ...r, gmv: money(base - (on.empty ? daily : 0)) + (on.empty ? ' (6 of 7 days)' : ''), status: notes.length ? `Handled: ${notes.join('; ')}.` : 'Correct.', bad: false, run: on.diwali ? '≈ 70 s, 1.6 GB (DuckDB, incremental)' : '≈ 15 s, 0.4 GB' };
}

function stressState(on, guarded) {
  const big = on.diwali ? 0.55 : 0.14;
  const s = {
    zone: Z(guarded ? 'pipeline with L2/L3 guards' : 'pipeline without guards', 5.0, 2.7, 13.0, 10.0, { c: guarded ? 'teal' : 'slate' }),
    f0: Tl(on.empty ? 'Nov 1 · empty' : 'Nov 1', 0, -0.8, { c: on.empty ? 'coral' : 'blue', w: 2.0, d: 1.0, h: on.empty ? 0.05 : big, fs: 9.5 }),
    f1: Tl(on.rename ? 'Nov 2 · renamed' : 'Nov 2', 0, 1.5, { c: on.rename ? 'coral' : 'blue', w: 2.0, d: 1.0, h: big, fs: 9 }),
    f2: Tl('Nov 3', 0, 3.8, { c: 'blue', w: 2.0, d: 1.0, h: big, fs: 9.5 }),
    fd: on.dup ? Tl('Nov 2 · again', 0, 6.1, { c: 'coral', w: 2.0, d: 1.0, h: big, fs: 9 }) : null,
    load: B(on.diwali && guarded ? 'DuckDB\nincremental' : 'load', 3.2, 2.4, { c: on.diwali && !guarded ? 'coral' : 'teal', w: 1.4, d: 1.2, h: 0.8, fs: 9.5 }),
    gate: guarded ? B('checks', 5.6, 2.4, { c: 'teal', w: 1.1, d: 1.6, h: 1.0, fs: 10, hl: on.dup || on.empty || on.rename ? 1 : 0 }) : null,
    kpi: B('KPIs', 7.9, 2.4, { c: 'teal', w: 1.2, d: 1.2, h: 0.7, fs: 10 }),
    q: guarded ? Tl(on.dup || on.rename ? 'quarantine\n1 file' : 'quarantine\nempty', 5.6, 5.6, { c: on.dup || on.rename ? 'coral' : 'slate', w: 1.7, d: 0.9, fs: 9 }) : null,
    al: (guarded && (on.empty || on.rename)) || (!guarded && on.rename) ? O(5.6, -0.8, { z: 0.6, r: 0.22, c: 'coral', hl: 1, sub: guarded ? 'alert sent' : 'crash' }) : null,
  };
  const res = outcome(on, guarded);
  s.rep = Tl(res.gmv === '—' ? 'no report' : 'report', 10.3, 2.4, { c: res.bad ? 'coral' : 'green', w: 1.6, d: 1.2, fs: 10 });
  const l = {
    a0: L('f0', 'load', { c: on.empty ? 'coral' : 'muted', na: 1 }), a1: L('f1', 'load', { c: on.rename ? 'coral' : 'muted', na: 1 }), a2: L('f2', 'load', { c: 'muted', na: 1 }),
    ad: on.dup ? L('fd', 'load', { c: 'coral', dash: 1 }) : null,
    b: guarded ? L('load', 'gate', { flow: 1 }) : L('load', 'kpi', { flow: 1, c: on.dup || on.empty ? 'coral' : 'blue' }),
    c: guarded ? L('gate', 'kpi', { flow: 1 }) : null,
    d: L('kpi', 'rep', { flow: 1, c: res.bad ? 'coral' : 'green' }),
    e: guarded ? L('gate', 'q', { c: on.dup || on.rename ? 'coral' : 'muted', dash: 1 }) : null,
  };
  return { s, l };
}

export function renderProject(root, P, ctx) {
  let tab = store.get(`proj:${P.id}:tab`, 'brief');
  const checks = new Set(store.get(`proj:${P.id}:checks`, []));
  root.innerHTML = `<article class="lesson project-page">
    <div class="crumbs"><b>Phase ${esc(P.phase)} · ${esc(P.phaseName)}</b> · ShopSense project</div>
    <h1>${esc(P.title)}</h1>
    <p class="sub">${esc(P.sub)}</p>
    <div class="start">
      <div><b class="h">You will build</b><ul>${P.outcomes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <div><b class="h">How to use · ${esc(P.time)}</b>Read the brief, walk through the Engineering Studio, then build level by level. Tick items as you finish them; your ticks are saved in this browser. Use the stress lab to see why each L2 and L3 requirement exists.</div>
    </div>
    <div class="ltabs" role="tablist" aria-label="Project sections" id="ptabs"></div>
    <div id="pbody"></div>
  </article>`;
  const tabsEl = root.querySelector('#ptabs'), body = root.querySelector('#pbody');
  let scene = null;

  const drawTabs = () => { tabsEl.innerHTML = TABS.map(([k, n], i) => `<button type="button" role="tab" data-k="${k}" aria-current="${k === tab}"><span class="ln">${i + 1}</span>${esc(n)}</button>`).join(''); };
  const tick = (key, label) => `<label class="tick"><input type="checkbox" data-c="${esc(key)}" ${checks.has(key) ? 'checked' : ''}><span>${label}</span></label>`;
  const codeBox = (key, c) => `<div class="codebox" data-src="${esc(key)}">
      <div class="codebar"><span class="why">${esc(c.why)}</span><button class="btn small" type="button" data-copy>Copy</button><button class="btn small primary" type="button" data-run>Run in browser</button></div>
      <pre><code>${highlight(c.src)}</code></pre>
      <div class="out" hidden data-live><b>Your run</b><pre></pre></div>
      <div class="out"><b>Output (checked)</b><pre>${renderOutput(OUT[key] ?? '')}</pre></div>
      <p class="runnote" data-note>Runs with Python in your browser where available. The checked output above is what this code prints.</p>
    </div>`;
  const pnav = (k) => {
    const i = TABS.findIndex(([x]) => x === k), prev = TABS[i - 1], next = TABS[i + 1];
    return `<div class="pnav">${prev ? `<button class="btn" type="button" data-go="${prev[0]}">← ${esc(prev[1])}</button>` : ctx.prev ? `<a class="btn" href="#${ctx.prev.id}">← ${esc(ctx.prev.title)}</a>` : ''}
      ${next ? `<button class="btn primary" type="button" data-go="${next[0]}">Next: ${esc(next[1])} →</button>` : `<a class="btn primary" href="#home">Back to the roadmap</a>`}</div>`;
  };

  const SECTIONS = {
    brief() {
      const b = P.brief;
      return `<div class="lhead"><h2>1. Brief</h2><p>What the business needs, and how you will know it works</p></div>
      <div class="cards">
        <div class="card wide"><h3>Business goal</h3><p>${esc(b.goal)}</p></div>
        <div class="card"><h3>Who uses it</h3><ul class="plain">${b.users.map(([n, p]) => `<li><b>${esc(n)}</b> ${esc(p)}</li>`).join('')}</ul></div>
        <div class="card"><h3>Data</h3><p>${esc(b.data)}</p><h3 style="margin-top:14px">Success metric</h3><p>${esc(b.metric)}</p></div>
        <div class="card"><h3>Non-functional requirements</h3><ul>${b.nfr.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
        <div class="card"><h3>Deliverables</h3><ul>${b.deliverables.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
        <div class="card wide"><h3>Lessons this project uses</h3><p>${b.uses.map(esc).join(' · ')}</p><p style="margin-top:8px">New to the problem? Watch the <a href="#${P.id.replace('project', 'story')}">Phase ${P.phase} story scene</a> first: it shows the pain this project removes.</p></div>
      </div>${pnav('brief')}`;
    },
    studio() {
      return `<div class="lhead"><h2>2. Engineering Studio</h2><p>Design thinking and AI-DLC, in the order a real team works</p></div>
      <ol class="studio">${P.studio.map((st, i) => `<li><div class="sn">${i + 1}</div><div><h3>${esc(st.h)}</h3><p>${esc(st.p)}</p>
        ${st.quotes ? `<div class="quotes">${st.quotes.map(([w, q]) => `<blockquote><b>${esc(w)}</b>“${esc(q)}”</blockquote>`).join('')}</div>` : ''}
        ${st.choice ? `<div class="qcard" data-choice><h3>${esc(st.choice.q)}</h3><div class="opts">${st.choice.opts.map(([o], j) => `<button type="button" data-ch="${j}">${esc(o)}</button>`).join('')}</div><div class="fb" hidden></div></div>` : ''}
        <div class="sout">${st.out}</div></div></li>`).join('')}</ol>
      <div class="card decision"><h3>Decision scenario<small>${esc(P.decision.q)}</small></h3>
        <div class="opts">${P.decision.opts.map(([o], j) => `<button type="button" data-dec="${j}">${esc(o)}</button>`).join('')}</div>
        <div class="fb" hidden id="decfb"></div></div>
      ${pnav('studio')}`;
    },
    build() {
      const lv = store.get(`proj:${P.id}:level`, 'L1');
      const L0 = P.levels.find((x) => x.n === lv) || P.levels[0];
      const done = (x) => x.checks.filter((_, i) => checks.has(`${x.n}:${i}`)).length;
      return `<div class="lhead"><h2>3. Build L1–L3</h2><p>Make it work, make it robust, make it scale</p></div>
      <div class="ctabs" role="group" aria-label="Level">${P.levels.map((x) => `<button type="button" data-lv="${x.n}" aria-pressed="${x.n === L0.n}"><b>${x.n} · ${esc(x.h)}</b><span>${esc(x.time)} · ${done(x)} of ${x.checks.length} done</span></button>`).join('')}</div>
      <div class="card wide" style="margin-top:12px"><h3>${L0.n} goal</h3><p>${esc(L0.goal)}</p>
        <div class="ticks">${L0.checks.map((c, i) => tick(`${L0.n}:${i}`, esc(c))).join('')}</div>
        <p class="hint"><b>Tip:</b> ${esc(L0.hint)}</p></div>
      ${codeBox(`${P.id}:${L0.n}`, L0.code)}
      ${pnav('build')}`;
    },
    stress() {
      const on = store.get(`proj:${P.id}:stress`, { dup: true });
      const g = store.get(`proj:${P.id}:guard`, true);
      const a = outcome(on, false), b = outcome(on, true);
      return `<div class="lhead"><h2>4. Stress lab</h2><p>Turn on the bad days and compare a naive pipeline with a guarded one</p></div>
      <div class="howto" style="margin-bottom:12px"><b>How to use</b>Switch scenarios on and off; combine them. The picture shows one pipeline; the table compares both. Figures are illustrative.</div>
      <div class="stresses">${P.stress.map((x) => `<label class="tick"><input type="checkbox" data-st="${x.id}" ${on[x.id] ? 'checked' : ''}><span><b>${esc(x.h)}</b><small>${x.p}</small></span></label>`).join('')}</div>
      <div class="seg" id="guard" role="group" aria-label="Pipeline shown" style="margin:12px 0"><button type="button" data-g="1" aria-pressed="${g}">With guards</button><button type="button" data-g="0" aria-pressed="${!g}">Without guards</button></div>
      <figure class="stage" style="aspect-ratio:16/8"><svg id="st-svg" role="img" aria-label="Pipeline under stress"></svg></figure>
      <div class="tablewrap"><table class="cmp"><thead><tr><th></th><th>Without guards</th><th>With L2/L3 guards</th></tr></thead><tbody>
        <tr><th>True weekly GMV</th><td>${a.truth}</td><td>${b.truth}</td></tr>
        <tr><th>Reported GMV</th><td class="${a.bad ? 'badc' : ''}">${esc(a.gmv)}</td><td>${esc(b.gmv)}</td></tr>
        <tr><th>What happened</th><td class="${a.bad ? 'badc' : ''}">${esc(a.status)}</td><td class="goodc">${esc(b.status)}</td></tr>
        <tr><th>Run time and memory (10M rows)</th><td class="${on.diwali ? 'badc' : ''}">${esc(a.run)}</td><td>${esc(b.run)}</td></tr>
      </tbody></table></div>
      ${pnav('stress')}`;
    },
    review() {
      return `<div class="lhead"><h2>5. Review and deliver</h2><p>Failure drills, design-review questions, and the final checklist</p></div>
      <h3 class="subh">Failure drills</h3>
      ${P.drills.map((d) => `<details class="qa"><summary><b>${esc(d.h)}</b> ${esc(d.p)}</summary><p>${esc(d.a)}</p></details>`).join('')}
      <h3 class="subh">Design-review questions</h3>
      ${P.review.map(([q, a]) => `<details class="qa"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}
      <h3 class="subh">Deliverables checklist</h3>
      <div class="ticks">${P.brief.deliverables.map((d, i) => tick(`del:${i}`, esc(d))).join('')}</div>
      <div class="card wide" style="margin-top:16px"><h3>${esc(P.side.h)}</h3><p>${esc(P.side.p)}</p></div>
      <div class="howto" style="margin-top:16px"><b>What comes next</b>Phase 1 turns these trusted numbers into churn and demand forecasts. It arrives in the next update.</div>
      ${pnav('review')}`;
    },
  };

  function drawStress() {
    const svg = root.querySelector('#st-svg');
    if (!svg) return;
    const on = store.get(`proj:${P.id}:stress`, { dup: true }), g = store.get(`proj:${P.id}:guard`, true);
    const st = stressState(on, g);
    const all = buildStates([{ clear: true, ...stressState({ diwali: 1, empty: 1, dup: 1, rename: 1 }, true) }, { clear: true, ...stressState({ diwali: 1, empty: 1, dup: 1, rename: 1 }, false) }]);
    const cur = buildStates([{ clear: true, s: st.s, l: st.l }])[0];
    if (!scene) { scene = new Scene(svg); scene.frame(bounds(all)); scene.show(cur, { dur: 0 }); } else scene.show(cur, { dur: 500 });
  }

  function go(k, scroll = true) {
    tab = k; store.set(`proj:${P.id}:tab`, k); scene = null;
    drawTabs();
    body.innerHTML = SECTIONS[k]();
    if (k === 'stress') drawStress();
    if (scroll) tabsEl.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
  tabsEl.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) go(b.dataset.k); });
  body.addEventListener('change', (e) => {
    const c = e.target.closest('[data-c]');
    if (c) { c.checked ? checks.add(c.dataset.c) : checks.delete(c.dataset.c); store.set(`proj:${P.id}:checks`, [...checks]); if (tab === 'build') { const y = window.scrollY; go('build', false); window.scrollTo(0, y); } }
    const s = e.target.closest('[data-st]');
    if (s) { const on = store.get(`proj:${P.id}:stress`, { dup: true }); on[s.dataset.st] = s.checked; store.set(`proj:${P.id}:stress`, on); const y = window.scrollY; const keep = scene; body.innerHTML = SECTIONS.stress(); scene = null; drawStressKeep(keep); window.scrollTo(0, y); }
  });
  function drawStressKeep() { drawStress(); }
  body.addEventListener('click', async (e) => {
    const go2 = e.target.closest('[data-go]'); if (go2) return go(go2.dataset.go);
    const lv = e.target.closest('[data-lv]'); if (lv) { store.set(`proj:${P.id}:level`, lv.dataset.lv); return go('build', false); }
    const gb = e.target.closest('[data-g]'); if (gb) { store.set(`proj:${P.id}:guard`, gb.dataset.g === '1'); root.querySelectorAll('#guard button').forEach((x) => x.setAttribute('aria-pressed', String(x === gb))); return drawStress(); }
    const ch = e.target.closest('[data-ch]');
    if (ch) {
      const card = ch.closest('[data-choice]'), st = P.studio.find((x) => x.choice), j = +ch.dataset.ch;
      card.querySelectorAll('[data-ch]').forEach((x) => { x.classList.toggle('right', +x.dataset.ch === st.choice.a); x.classList.toggle('wrong', x === ch && j !== st.choice.a); });
      const fb = card.querySelector('.fb'); fb.hidden = false; fb.className = 'fb ' + (j === st.choice.a ? 'ok' : 'no'); fb.innerHTML = `<b>${j === st.choice.a ? 'Correct' : 'Not quite'}</b>${esc(st.choice.opts[j][1])}`;
      return;
    }
    const dec = e.target.closest('[data-dec]');
    if (dec) {
      const [o, cons, kind] = P.decision.opts[+dec.dataset.dec];
      root.querySelectorAll('[data-dec]').forEach((x) => x.classList.toggle('picked', x === dec));
      const fb = root.querySelector('#decfb'); fb.hidden = false; fb.className = 'fb ' + (kind === 'good' ? 'ok' : 'no');
      fb.innerHTML = `<b>Next monthly review:</b> ${esc(cons)}${kind === 'good' ? '' : ' Try another option to compare.'}`;
      return;
    }
    const box = e.target.closest('[data-src]');
    if (box) {
      const lvObj = P.levels.find((x) => `${P.id}:${x.n}` === box.dataset.src);
      if (e.target.closest('[data-copy]')) { const b = e.target.closest('[data-copy]'); try { await navigator.clipboard.writeText(lvObj.code.src); b.textContent = 'Copied'; } catch { b.textContent = 'Select and copy'; } setTimeout(() => (b.textContent = 'Copy'), 1500); }
      if (e.target.closest('[data-run]')) runInto(lvObj.code.src, box.querySelector('[data-live]'), box.querySelector('[data-note]'), e.target.closest('[data-run]'));
    }
  });
  go(TABS.some(([k]) => k === tab) ? tab : 'brief', false);
  return { key: () => {} };
}
