// Project page: brief, Engineering Studio, build levels, stress lab, review.
import { Scene, buildStates, bounds } from './engine.js';
import { B, Tl, O, T, Z, L, esc } from './kit.js';
import { highlight, renderOutput } from './runner.js';
import { runInto, OUT } from './lessonview.js';

const tabsFor = (P) => [['brief', 'Brief'], ['studio', 'Engineering Studio'], ['build', 'Build L1–L3'], ['stress', 'Stress lab'], ...(P.sandbox ? [['sandbox', 'System design']] : []), ['review', 'Review and deliver']];

const store = {
  get(k, d) { try { const v = localStorage.getItem('qx:' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('qx:' + k, JSON.stringify(v)); } catch { /* unavailable */ } },
};

export function renderProject(root, P, ctx) {
  const TABS = tabsFor(P);
  const num = (k) => TABS.findIndex(([x]) => x === k) + 1;
  const defOn = () => store.get(`proj:${P.id}:stress`, P.stressDefault || {});
  const allOn = Object.fromEntries(P.stress.map((x) => [x.id, 1]));
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
      const on = defOn();
      const g = store.get(`proj:${P.id}:guard`, true);
      const rows = P.stressRows(on);
      const [ca, cb] = P.stressCols || ['Without guards', 'With L2/L3 guards'];
      const cell = ([v, bad, good]) => `<td class="${bad ? 'badc' : good ? 'goodc' : ''}">${esc(v)}</td>`;
      return `<div class="lhead"><h2>${num('stress')}. Stress lab</h2><p>${esc(P.stressSub || 'Turn on the bad days and compare a naive pipeline with a guarded one')}</p></div>
      <div class="howto" style="margin-bottom:12px"><b>How to use</b>Switch scenarios on and off; combine them. The picture shows one pipeline; the table compares both. Figures are illustrative.</div>
      <div class="stresses">${P.stress.map((x) => `<label class="tick"><input type="checkbox" data-st="${x.id}" ${on[x.id] ? 'checked' : ''}><span><b>${esc(x.h)}</b><small>${x.p}</small></span></label>`).join('')}</div>
      <div class="seg" id="guard" role="group" aria-label="Pipeline shown" style="margin:12px 0"><button type="button" data-g="1" aria-pressed="${g}">With guards</button><button type="button" data-g="0" aria-pressed="${!g}">Without guards</button></div>
      <figure class="stage" style="aspect-ratio:16/8"><svg id="st-svg" role="img" aria-label="Pipeline under stress"></svg></figure>
      <div class="tablewrap"><table class="cmp"><thead><tr><th></th><th>${esc(ca)}</th><th>${esc(cb)}</th></tr></thead><tbody>
        ${rows.map(([h, a, b]) => `<tr><th>${esc(h)}</th>${cell(a)}${cell(b)}</tr>`).join('')}
      </tbody></table></div>
      ${pnav('stress')}`;
    },
    sandbox() {
      const S = P.sandbox, v = { ...Object.fromEntries(S.controls.map((c) => [c.id, c.def])), ...store.get(`proj:${P.id}:sbx`, {}) };
      const r = S.compute(v);
      return `<div class="lhead"><h2>${num('sandbox')}. System design sandbox</h2><p>${esc(S.sub)}</p></div>
      <div class="howto" style="margin-bottom:12px"><b>How to use</b>${S.howto}</div>
      <div class="sbx">${S.controls.map((c) => `<div class="sbxc"><b>${esc(c.label)}</b><div class="seg" role="group" aria-label="${esc(c.label)}">${c.opts.map(([val, lab]) => `<button type="button" data-sb="${c.id}" data-v="${esc(String(val))}" aria-pressed="${String(val) === String(v[c.id])}">${esc(lab)}</button>`).join('')}</div>${c.help ? `<small>${esc(c.help)}</small>` : ''}</div>`).join('')}</div>
      <figure class="stage" style="aspect-ratio:16/7"><svg id="sb-svg" role="img" aria-label="Nightly scoring pipeline"></svg></figure>
      <div class="fb ${r.ok ? 'ok' : 'no'}" style="margin:12px 0"><b>${r.ok ? 'Meets the targets' : 'Misses a target'}</b>${esc(r.verdict)}</div>
      <div class="tablewrap"><table class="cmp"><thead><tr><th>Measure</th><th>Value</th><th>Target</th></tr></thead><tbody>
        ${r.rows.map(([h, val, tgt, bad]) => `<tr><th>${esc(h)}</th><td class="${bad ? 'badc' : 'goodc'}">${esc(val)}</td><td>${esc(tgt)}</td></tr>`).join('')}
      </tbody></table></div>
      ${S.note ? `<p class="runnote">${esc(S.note)}</p>` : ''}
      ${pnav('sandbox')}`;
    },
    review() {
      return `<div class="lhead"><h2>${num('review')}. Review and deliver</h2><p>Failure drills, design-review questions, and the final checklist</p></div>
      <h3 class="subh">Failure drills</h3>
      ${P.drills.map((d) => `<details class="qa"><summary><b>${esc(d.h)}</b> ${esc(d.p)}</summary><p>${esc(d.a)}</p></details>`).join('')}
      <h3 class="subh">Design-review questions</h3>
      ${P.review.map(([q, a]) => `<details class="qa"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}
      <h3 class="subh">Deliverables checklist</h3>
      <div class="ticks">${P.brief.deliverables.map((d, i) => tick(`del:${i}`, esc(d))).join('')}</div>
      <div class="card wide" style="margin-top:16px"><h3>${esc(P.side.h)}</h3><p>${esc(P.side.p)}</p></div>
      <div class="howto" style="margin-top:16px"><b>What comes next</b>${esc(P.next || '')}</div>
      ${pnav('review')}`;
    },
  };

  function drawStress() {
    const svg = root.querySelector('#st-svg');
    if (!svg) return;
    const on = defOn(), g = store.get(`proj:${P.id}:guard`, true);
    const st = P.stressScene(on, g);
    const all = buildStates([{ clear: true, ...P.stressScene(allOn, true) }, { clear: true, ...P.stressScene(allOn, false) }, { clear: true, ...P.stressScene({}, true) }]);
    const cur = buildStates([{ clear: true, s: st.s, l: st.l }])[0];
    if (!scene) { scene = new Scene(svg); scene.frame(bounds(all)); scene.show(cur, { dur: 0 }); } else scene.show(cur, { dur: 500 });
  }

  function drawSandbox() {
    const svg = root.querySelector('#sb-svg');
    if (!svg) return;
    const S = P.sandbox, v = { ...Object.fromEntries(S.controls.map((c) => [c.id, c.def])), ...store.get(`proj:${P.id}:sbx`, {}) };
    const all = buildStates(S.frames.map((f) => ({ clear: true, ...S.compute(f).scene })));
    const cur = buildStates([{ clear: true, ...S.compute(v).scene }])[0];
    if (!scene) { scene = new Scene(svg); scene.frame(bounds(all)); scene.show(cur, { dur: 0 }); } else scene.show(cur, { dur: 450 });
  }

  function go(k, scroll = true) {
    tab = k; store.set(`proj:${P.id}:tab`, k); scene = null;
    drawTabs();
    body.innerHTML = SECTIONS[k]();
    if (k === 'stress') drawStress();
    if (k === 'sandbox') drawSandbox();
    if (scroll) tabsEl.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
  tabsEl.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) go(b.dataset.k); });
  body.addEventListener('change', (e) => {
    const c = e.target.closest('[data-c]');
    if (c) { c.checked ? checks.add(c.dataset.c) : checks.delete(c.dataset.c); store.set(`proj:${P.id}:checks`, [...checks]); if (tab === 'build') { const y = window.scrollY; go('build', false); window.scrollTo(0, y); } }
    const s = e.target.closest('[data-st]');
    if (s) { const on = defOn(); on[s.dataset.st] = s.checked; store.set(`proj:${P.id}:stress`, on); const y = window.scrollY; const keep = scene; body.innerHTML = SECTIONS.stress(); scene = null; drawStressKeep(keep); window.scrollTo(0, y); }
  });
  function drawStressKeep() { drawStress(); }
  body.addEventListener('click', async (e) => {
    const go2 = e.target.closest('[data-go]'); if (go2) return go(go2.dataset.go);
    const lv = e.target.closest('[data-lv]'); if (lv) { store.set(`proj:${P.id}:level`, lv.dataset.lv); return go('build', false); }
    const sb = e.target.closest('[data-sb]');
    if (sb) {
      const cur = store.get(`proj:${P.id}:sbx`, {}), c = P.sandbox.controls.find((x) => x.id === sb.dataset.sb);
      const raw = sb.dataset.v; cur[c.id] = typeof c.def === 'number' ? +raw : raw; store.set(`proj:${P.id}:sbx`, cur);
      const y = window.scrollY, keep = scene; body.innerHTML = SECTIONS.sandbox(); scene = keep; const svg = root.querySelector('#sb-svg');
      if (keep) { const old = keep.svg; if (old && old !== svg) svg.replaceWith(old); }
      drawSandbox(); window.scrollTo(0, y); return;
    }
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
