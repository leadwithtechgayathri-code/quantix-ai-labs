import './base.css';
import { NEXT } from './release.js';
import './app.css';
import { PHASES, lessonCode, lessonId } from './roadmap.js';
import { renderLesson, registerOutputs } from './lessonview.js';
import { esc } from './kit.js';
import { renderStory } from './storyview.js';
import { renderProject } from './projectview.js';
import { LOADERS, MANIFEST } from './phases/manifest.js';

{
  // ---------- lesson registry ----------
  // The manifest says what is published; each phase's content loads only when it is opened.
  const CONTENT = {};
  const READYSET = new Set(Object.values(MANIFEST).flatMap((m) => m.ready));
  const ORDER = [];
  for (const ph of PHASES) ph.titles.forEach((t, i) => {
    const id = lessonId(ph, i);
    ORDER.push({ id, title: t, code: lessonCode(ph, i), ph, ready: READYSET.has(id) });
  });
  const READY = ORDER.filter((x) => x.ready);
  // story scenes and projects, keyed by phase number
  const EXTRAS = {};
  for (const [key, m] of Object.entries(MANIFEST)) {
    const ph = PHASES.find((p) => p.key === key);
    for (const kind of ['story', 'project']) if (m[kind]) EXTRAS[m[kind].id] = { id: m[kind].id, kind, data: null, phaseN: ph.n, key, title: m[kind].title, short: kind === 'story' ? 'Story' : 'Project' };
  }
  const loaded = {};
  function loadPhase(key) {
    if (!loaded[key]) loaded[key] = LOADERS[key]().then(({ default: B }) => {
      const ph = PHASES.find((p) => p.key === key);
      for (const L of B.lessons) {
        const i = Number(L.id.split('-')[1]) - 1;
        CONTENT[L.id] = Object.assign(L, { ref: lessonCode(ph, i), phaseN: ph.n, phaseName: ph.name });
      }
      if (B.story) EXTRAS[B.story.id].data = B.story;
      if (B.project) EXTRAS[B.project.id].data = B.project;
      registerOutputs(B.outputs || {});
    });
    return loaded[key];
  }
  const keyOf = (id) => id.split('-')[0];
  // reading order: story, lessons, project, phase by phase
  const NAV = [];
  for (const ph of PHASES) {
    const st = Object.values(EXTRAS).find((e) => e.kind === 'story' && e.phaseN === ph.n);
    const pj = Object.values(EXTRAS).find((e) => e.kind === 'project' && e.phaseN === ph.n);
    if (st) NAV.push(st);
    NAV.push(...READY.filter((x) => x.ph === ph));
    if (pj) NAV.push(pj);
  }
  const neighbours = (id) => { const i = NAV.findIndex((x) => x.id === id); return { prev: NAV[i - 1], next: NAV[i + 1] }; };
  const $ = (s) => document.querySelector(s);

  // ---------- per-viewer conveniences ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem('qx:' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('qx:' + k, JSON.stringify(v)); } catch { /* unavailable */ } },
  };
  const done = new Set(store.get('done', []));
  let level = store.get('level', 'math');
  let view = { id: null, layer: 'concept', api: null };

  function setLevel(v) {
    level = v; store.set('level', v);
    document.querySelectorAll('.lvl button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.level === v)));
    if (view.id) route();
  }
  document.querySelectorAll('.lvl button').forEach((b) => b.addEventListener('click', () => setLevel(b.dataset.level)));

  // ---------- next-release ribbon ----------
  const rib = $('#ribbon');
  if (rib && NEXT?.text) {
    rib.innerHTML = `<span class="pulse" aria-hidden="true"></span><b>${esc(NEXT.text)}</b>${NEXT.url ? ` <a href="${esc(NEXT.url)}" target="_blank" rel="noopener">${esc(NEXT.cta || 'Open')} →</a>` : '<span class="rsoon">in the next release</span>'}`;
    rib.hidden = false;
  }

  // ---------- sidebar ----------
  const side = $('#side'), menu = $('#menu');
  const toggleMenu = (open) => { side.classList.toggle('open', open); menu.setAttribute('aria-expanded', String(open)); };
  menu.addEventListener('click', () => toggleMenu(!side.classList.contains('open')));
  function renderToc() {
    const q = $('#q').value.trim().toLowerCase();
    const cur = view.id && (ORDER.find((x) => x.id === view.id)?.ph.n ?? EXTRAS[view.id]?.phaseN);
    let html = '';
    for (const ph of PHASES) {
      if (!ORDER.some((x) => x.ph === ph && x.ready)) continue;          // unreleased phases live on the roadmap only
      const items = ORDER.filter((x) => x.ph === ph && (!q || x.title.toLowerCase().includes(q)));
      if (!items.length) continue;
      const ready = items.filter((x) => x.ready).length;
      const open = q || ph.n === cur || (cur === undefined && ph.n === 0);
      html += `<details ${open ? 'open' : ''}><summary><span class="pn ${ready ? '' : 'lock'}">${ph.n}</span><span>${esc(ph.name)}<small>${ph.titles.length} lessons · ${ready ? `${ready} ready` : `release ${ph.release}`}</small></span></summary><div class="ls">`;
      const st = !q && Object.values(EXTRAS).find((e) => e.kind === 'story' && e.phaseN === ph.n);
      const pj = !q && Object.values(EXTRAS).find((e) => e.kind === 'project' && e.phaseN === ph.n);
      const ex = (e) => `<a href="#${e.id}" class="extra" ${e.id === view.id ? 'aria-current="page"' : ''}><span class="n">${e.short}</span><span>${esc(e.title.replace(/^(Story|Project): /, ''))}</span></a>`;
      if (st) html += ex(st);
      for (const x of items) html += x.ready ? `<a href="#${x.id}" class="${done.has(x.id) ? 'done' : ''}" ${x.id === view.id ? 'aria-current="page"' : ''}><span class="n">${x.code}</span><span>${esc(x.title)}</span></a>` : `<span><span class="n">${x.code}</span><span>${esc(x.title)}</span></span>`;
      if (pj) html += ex(pj);
      if (ready < items.length && !q) html += `<p class="soon">Greyed lessons arrive in release ${ph.release}.</p>`;
      html += '</div></details>';
    }
    $('#toc').innerHTML = html || '<p class="soon">No lesson matches that search.</p>';
  }
  $('#q').addEventListener('input', renderToc);
  $('#toc').addEventListener('click', (e) => { if (e.target.closest('a')) toggleMenu(false); });

  // ---------- home ----------
  function leave() { view.api?.destroy?.(); }
  function extra(id) {
    const E = EXTRAS[id];
    if (view.id === id) return;
    leave();
    view = { id, layer: 'concept', api: null, kind: E.kind };
    store.set('last', id);
    document.title = `${E.title} · Quantix AI Labs`;
    const ctx = neighbours(id);
    view.api = (E.kind === 'story' ? renderStory : renderProject)($('#main'), E.data, ctx);
    renderToc();
    window.scrollTo(0, 0);
  }
  function home() {
    leave();
    view = { id: null, layer: 'concept', api: null };
    document.title = 'Quantix AI Labs';
    const MAIN = READY.filter((x) => x.ph.n !== 'W');
    const nextUp = MAIN.find((x) => !done.has(x.id)) || MAIN[0];
    $('#main').innerHTML = `
    <section class="hero"><div class="hero-in">
      <div><h1>Learn AI the way industry builds it</h1>
        <p>A roadmap from foundations to agent harnesses: 172 lessons in 9 phases. Every lesson gives you the concept, the maths, the code three ways, how industry uses it, and practice. Every phase ends with a real ShopSense project.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn primary" href="#${done.size ? nextUp.id : 'p0-story'}">${done.size ? 'Continue: ' + esc(nextUp.title) : 'Start Phase 0'}</a><a class="btn" href="#w-01">New to Python? Start the warm-up</a><a class="btn" href="#roadmap">See the roadmap</a></div></div>
      <div class="layers">${[['1', 'Concept', 'An animated, step-by-step explanation'], ['2', 'Maths', 'Formulas with a worked example'], ['3', 'Code', 'From scratch, with the library, production style'], ['4', 'Industry lens', 'Baselines, tools, trade-offs, failures, interviews'], ['5', 'Practice', 'Quiz with explanations, auto-checked exercise']].map(([n, h, p]) => `<div class="layer"><span class="n">${n}</span><div><h3>${h}</h3><p>${p}</p></div></div>`).join('')}</div>
    </div></section>
    <section class="sec" id="roadmap"><div class="sec-in">
      <p class="kicker">The roadmap</p><h2>Nine phases, one growing project</h2>
      <div class="intro"><p>Phases build on each other. Each one adds a feature to ShopSense, an AI-powered e-commerce platform, built to industry standards: make it work, make it robust, make it scale.</p>
      <div class="howto"><b>Available now</b>Phases 0 and 1 in full, each with its story scene, every lesson and its ShopSense project, plus an optional 10-lesson Python warm-up for anyone new to Python. Greyed phases are planned and arrive release by release.</div></div>
      <div class="roadmap">${PHASES.filter((p) => p.n !== 'W').map((p) => {
        const items = ORDER.filter((x) => x.ph === p), ready = items.filter((x) => x.ready), first = ready[0];
        const n = items.filter((x) => done.has(x.id)).length;
        const inner = `<span class="rel">${ready.length ? `${ready.length} of ${items.length} ready` : `release ${p.release}`}</span><div class="k">Phase ${p.n} · ${items.length} lessons</div><h3>${esc(p.name)}</h3><p>${esc(p.blurb)}</p>${ready.length ? `<div class="meter" aria-hidden="true"><i style="width:${(n / items.length) * 100}%"></i></div>` : ''}<div class="proj"><b>Project:</b> ShopSense ${esc(p.project)}</div>`;
        const st = Object.values(EXTRAS).find((e) => e.kind === 'story' && e.phaseN === p.n);
        const href = st ? st.id : first?.id;
        return first ? `<a class="phase" href="#${href}">${inner}</a>` : `<div class="phase lock">${inner}</div>`;
      }).join('')}</div>
    </div></section>
    <section class="sec"><div class="sec-in">
      <p class="kicker">Three depths</p><h2>Choose how deep each lesson goes</h2>
      <div class="five" style="grid-template-columns:repeat(3,minmax(0,1fr))">
        <div><b>Simple</b><p>Concept, industry lens and practice. For students, managers and anyone starting out.</p></div>
        <div><b>+ Code</b><p>Adds the code layer: from scratch, with the library, and production style.</p></div>
        <div><b>+ Math</b><p>All five layers, including the formulas and a worked example.</p></div>
      </div>
    </div></section>
    <footer>Quantix AI Labs by ProDev Quantix · Created by Gayathridevi M. Progress is kept in this browser only.</footer>`;
    renderToc();
    window.scrollTo(0, 0);
  }

  // ---------- lesson ----------
  function lesson(id) {
    const L = CONTENT[id];
    const sameLesson = view.id === id;
    if (!sameLesson) leave();
    view.kind = 'lesson';
    view.id = id;
    if (!sameLesson) view.layer = 'concept';
    store.set('last', id);
    document.title = `${L.title} · Quantix AI Labs`;
    const { next } = neighbours(id);
    view.api = renderLesson($('#main'), L, {
      level, layer: view.layer, next,
      onLayer: (k) => { view.layer = k; },
      onDone: () => { if (!done.has(id)) { done.add(id); store.set('done', [...done]); renderToc(); } },
    });
    renderToc();
    if (!sameLesson) window.scrollTo(0, 0);
  }

  document.addEventListener('keydown', (e) => {
    if (!view.id || e.target.closest('input, textarea') || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { if (view.kind === 'story' || (view.kind === 'lesson' && view.layer === 'concept')) { e.preventDefault(); view.api?.key(e.key === 'ArrowRight' ? 1 : -1); } }
  });

  async function route() {
    let id = decodeURIComponent(location.hash.slice(1));
    // clean addresses such as /phase-0 open that phase's first page
    const pm = !id && location.pathname.match(/^\/phase-(\w+)\/?$/i);
    if (pm) { const key = pm[1].toLowerCase() === 'w' ? 'w' : 'p' + pm[1]; const m = MANIFEST[key]; id = m ? (m.story?.id || m.ready[0]) : ''; }
    if (id === 'roadmap' && !view.id) return;
    const known = READYSET.has(id) || EXTRAS[id];
    if (known && LOADERS[keyOf(id)]) {
      if (!loaded[keyOf(id)]) $('#main').innerHTML = '<p class="loading" role="status">Loading this phase…</p>';
      try { await loadPhase(keyOf(id)); } catch { $('#main').innerHTML = '<p class="loading" role="alert">This phase could not load. Check your connection and refresh the page.</p>'; return; }
    }
    if (CONTENT[id]) lesson(id); else if (EXTRAS[id]?.data) extra(id); else home();
    if (id === 'roadmap') setTimeout(() => document.getElementById('roadmap')?.scrollIntoView(), 50);
  }
  window.addEventListener('hashchange', route);
  setLevel(level);
  route();
  window.__qx = { CONTENT, EXTRAS, NAV };
}
