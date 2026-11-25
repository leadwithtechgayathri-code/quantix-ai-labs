// Story player: six beats, each a timed sequence of frames across world, device close-up and split views.
import { Scene, buildStates, bounds, reduced } from './engine.js';
import { esc } from './kit.js';

function prepare(beat) {
  if (beat.shots) return;
  const shots = [];
  let steps = [];
  beat.frames.forEach((fr, k) => {
    if (fr.cut || k === 0) { steps = []; shots.push({ steps, frames: [] }); }
    const shot = shots.at(-1);
    steps.push({ clear: steps.length === 0, s: fr.s, l: fr.l });
    shot.frames.push(k);
    fr.shot = shots.length - 1;
    fr.si = steps.length - 1;
  });
  for (const sh of shots) {
    sh.states = buildStates(sh.steps);
    const extra = beat.lens ? buildStates([...sh.steps, { s: beat.lens.s, l: beat.lens.l }]).slice(-1) : [];
    sh.vb = bounds([...sh.states, ...extra]);
  }
  beat.shots = shots;
  beat.dur = beat.frames.at(-1).at + 3200;
  if (beat.before) { beat.beforeState = buildStates([{ clear: true, s: beat.before.s, l: beat.before.l }])[0]; beat.beforeVb = bounds([beat.beforeState]); }
}

export function renderStory(root, story, ctx) {
  story.beats.forEach(prepare);
  const B = story.beats;
  root.innerHTML = `<article class="lesson story-page">
    <div class="crumbs"><b>Phase ${esc(story.phase)} · ${esc(story.phaseName)}</b> · Story scene</div>
    <h1>${esc(story.title)}</h1>
    <p class="sub">${esc(story.sub)}</p>
    <div class="start">
      <div><b class="h">What this story shows</b><ul>${story.shows.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <div><b class="h">How to use · about ${esc(story.time)}</b><ol><li>Each beat plays by itself. Pause, replay or change the speed any time.</li><li>Press Next or the arrow keys for the next beat.</li><li>Click a person, or a name in the panel, to hear them.</li><li>Turn on the data lens where it is offered, and compare ${esc(story.toggle[0])} and ${esc(story.toggle[1])} on beat 4.</li></ol></div>
    </div>
    <div class="player">
      <figure class="stage story-stage mode-world" id="s-stage">
        <span class="badge" id="s-badge"></span>
        <svg id="s-svg" role="img" aria-label="Story scene"></svg>
        <div class="phone" id="s-phone" aria-hidden="true">
          <div class="ph-notch"></div>
          <div class="ph-app">
            <div class="ph-bar"><b>${esc(story.device.brand)}</b><span>≡</span></div>
            <div class="ph-search"><span class="ph-icon">${esc(story.device.icon || '⌕')}</span><span id="ph-q"></span><span class="caret"></span></div>
            <div class="ph-meta" id="ph-meta"></div>
            <div class="ph-results" id="ph-results"></div>
            <div class="ph-toast" id="ph-toast"></div>
          </div>
        </div>
        <div class="cap" id="s-cap" aria-live="polite"></div>
      </figure>
      <div class="panel">
        <div class="dots" id="s-dots" role="group" aria-label="Story beats"></div>
        <div class="prog" aria-hidden="true"><i id="s-prog"></i></div>
        <p class="beatname" id="s-beat"></p>
        <h3 id="s-title"></h3>
        <div class="body" id="s-body"></div>
        <div class="sctl">
          <button class="btn small" type="button" id="s-play">Pause</button>
          <button class="btn small" type="button" id="s-replay">Replay beat</button>
          <button class="btn small" type="button" id="s-lens" aria-pressed="false">Data lens</button>
        </div>
        <div class="seg" id="s-speed" role="group" aria-label="Playback speed"><button type="button" data-v="1.4" aria-pressed="false">Slow</button><button type="button" data-v="1" aria-pressed="true">Normal</button><button type="button" data-v="0.65" aria-pressed="false">Fast</button></div>
        <div class="seg" id="s-toggle" role="group" aria-label="Compare before and after"><button type="button" data-v="before" aria-pressed="false">${esc(story.toggle[0])}</button><button type="button" data-v="after" aria-pressed="true">${esc(story.toggle[1])}</button></div>
        <p style="margin:14px 0 0;font-size:13px;color:var(--muted);font-weight:600">People in this story · click to hear them</p>
        <div class="people" id="s-people"></div>
        <div class="quote" id="s-quote" hidden></div>
        <div class="nav"><button class="btn" id="s-prev" type="button">← Back</button><button class="btn primary" id="s-next" type="button">Next →</button></div>
      </div>
    </div>
    <div class="cards" style="margin-top:22px">
      ${story.takeaways.map(([h, p]) => `<div class="card"><h3>${esc(h)}</h3><p>${p}</p></div>`).join('')}
    </div>
    <div class="pnav">${ctx.prev ? `<a class="btn" href="#${ctx.prev.id}">← ${esc(ctx.prev.title)}</a>` : ''}${ctx.next ? `<a class="btn primary" href="#${ctx.next.id}">Next: ${esc(ctx.next.title)} →</a>` : ''}</div>
  </article>`;

  const $ = (id) => root.querySelector('#' + id);
  const stage = $('s-stage'), sc = new Scene($('s-svg'));
  let i = 0, lens = false, who = null, paused = true, speed = 1, alive = true;
  let timers = [], startT = 0, elapsed = 0, curShot = -1, curFrame = 0, raf = 0, typeTimer = 0;
  const seen = new Set([0]);

  $('s-people').innerHTML = story.cast.map((p) => `<button type="button" data-p="${p.id}" aria-pressed="false"><span class="av" style="background:${p.color}">${esc(p.name[0])}</span>${esc(p.name)} · ${esc(p.role)}</button>`).join('');

  // ---------- device screen ----------
  const dev = { q: '', rows: null, meta: '', toast: null };
  function setDevice(st, instant) {
    if (!st) return;
    Object.assign(dev, st);
    clearInterval(typeTimer);
    const qEl = $('ph-q');
    if (st.typing && !instant && !reduced()) {
      let n = 0; qEl.textContent = '';
      typeTimer = setInterval(() => { n++; qEl.textContent = st.q.slice(0, n); if (n >= st.q.length) clearInterval(typeTimer); }, 55);
    } else qEl.textContent = dev.q;
    $('ph-meta').textContent = dev.meta || '';
    $('ph-results').innerHTML = dev.rows === 'loading' ? '<div class="ph-load"></div><div class="ph-load"></div><div class="ph-load"></div>'
      : Array.isArray(dev.rows) ? dev.rows.map(([n, m, c, kind], j) => `<div class="ph-card ${kind || ''}" style="animation-delay:${j * 0.12}s"><i style="background:${c}"></i><div><b>${esc(n)}</b><span>${esc(m)}</span></div></div>`).join('') : '';
    const t = $('ph-toast');
    t.className = 'ph-toast' + (dev.toast ? ` on ${dev.toast[1]}` : '');
    t.textContent = dev.toast ? dev.toast[0] : '';
  }

  function stateFor(beat, fr) {
    const sh = beat.shots[fr.shot];
    if (!(lens && beat.lens)) return sh.states[fr.si];
    return buildStates([...sh.steps.slice(0, fr.si + 1), { s: beat.lens.s, l: beat.lens.l }]).at(-1);
  }
  function applyFrame(k, instant) {
    if (!alive) return;
    const beat = B[i], fr = beat.frames[k];
    curFrame = k;
    if (fr.lensOn) { lens = true; syncLens(); }
    if (fr.shot !== curShot) { curShot = fr.shot; sc.reset(); sc.frame(beat.shots[fr.shot].vb); }
    if (fr.mode) stage.className = `stage story-stage mode-${fr.mode}`;
    sc.show(stateFor(beat, fr), { dur: instant ? 0 : 750 });
    if (fr.device) setDevice({ toast: null, ...fr.device }, instant);
    if (fr.cap !== undefined) $('s-cap').textContent = fr.cap;
  }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf); }
  function schedule() {
    clearTimers();
    const beat = B[i];
    startT = performance.now() - elapsed;
    beat.frames.forEach((fr, k) => { if (fr.at * speed > elapsed) timers.push(setTimeout(() => applyFrame(k), fr.at * speed - elapsed)); });
    const tick = () => {
      if (!alive) return;
      elapsed = performance.now() - startT;
      $('s-prog').style.width = Math.min(100, (elapsed / (beat.dur * speed)) * 100) + '%';
      if (elapsed < beat.dur * speed) raf = requestAnimationFrame(tick); else finish();
    };
    raf = requestAnimationFrame(tick);
  }
  function finish() { paused = true; $('s-play').textContent = 'Play'; $('s-prog').style.width = '100%'; }
  function enterBeat(j) {
    clearTimers();
    i = (j + B.length) % B.length; seen.add(i);
    const beat = B[i];
    lens = false; curShot = -1; elapsed = 0;
    setDevice({ q: '', rows: null, meta: '', toast: null }, true);
    renderPanel();
    if (reduced()) {
      beat.frames.forEach((fr) => { if (fr.device) setDevice({ toast: null, ...fr.device, typing: false }, true); if (fr.lensOn) lens = true; });
      const last = beat.frames.length - 1;
      applyFrame(last, true);
      beat.frames.forEach((fr) => { if (fr.shot === beat.frames[last].shot && fr.mode) stage.className = `stage story-stage mode-${fr.mode}`; });
      finish(); syncLens();
      return;
    }
    applyFrame(0, true);
    paused = false; $('s-play').textContent = 'Pause';
    schedule();
  }
  function togglePlay() {
    if (paused) {
      if (elapsed >= B[i].dur * speed) return enterBeat(i);
      paused = false; $('s-play').textContent = 'Pause'; schedule();
    } else { paused = true; elapsed = performance.now() - startT; clearTimers(); $('s-play').textContent = 'Play'; }
  }
  function syncLens() {
    const beat = B[i];
    $('s-lens').disabled = !beat.lens;
    $('s-lens').setAttribute('aria-pressed', String(!!(lens && beat.lens)));
  }
  function showBeforeAfter(v) {
    const beat = B[i];
    if (!beat.toggle) return;
    root.querySelectorAll('#s-toggle button').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.v === v)));
    clearTimers(); paused = true; $('s-play').textContent = 'Play'; elapsed = beat.dur * speed;
    $('s-prog').style.width = '100%';
    stage.className = 'stage story-stage mode-split';
    if (v === 'before') {
      curShot = -1; sc.reset(); sc.frame(beat.beforeVb); sc.show(beat.beforeState, { dur: 500 });
      setDevice({ ...beat.before.device, typing: false }, true);
      $('s-cap').textContent = beat.before.cap;
    } else {
      beat.frames.forEach((fr) => { if (fr.device) setDevice({ toast: null, ...fr.device, typing: false }, true); });
      curShot = -1; applyFrame(beat.frames.length - 1, false);
      $('s-cap').textContent = beat.afterCap;
    }
  }
  function renderPanel() {
    const b = B[i];
    $('s-badge').textContent = b.name.split(' · ')[1];
    $('s-dots').innerHTML = B.map((_, j) => `<button type="button" data-i="${j}" class="${seen.has(j) ? 'seen' : ''}" ${j === i ? 'aria-current="step"' : ''} aria-label="Beat ${j + 1}">${j + 1}</button>`).join('');
    $('s-beat').textContent = b.name;
    $('s-title').textContent = b.title;
    $('s-body').innerHTML = b.body.map((p) => `<p>${p}</p>`).join('') + `<div class="notice${b.warn ? ' warn' : ''}"><b>What to notice</b>${b.note}</div>`;
    $('s-toggle').hidden = !b.toggle;
    root.querySelectorAll('#s-toggle button').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.v === 'after')));
    $('s-prev').disabled = i === 0;
    $('s-next').textContent = i === B.length - 1 ? 'Start again ↺' : 'Next →';
    syncLens();
  }
  function showPerson(id) {
    who = who === id ? null : id;
    root.querySelectorAll('#s-people button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.p === who)));
    const p = story.cast.find((x) => x.id === who), q = $('s-quote');
    q.hidden = !p;
    if (p) q.innerHTML = `<b>${esc(p.name)}, ${esc(p.role)}</b>“${esc(p.quote)}”`;
  }

  $('s-prev').addEventListener('click', () => enterBeat(i - 1));
  $('s-next').addEventListener('click', () => enterBeat(i + 1));
  $('s-dots').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) enterBeat(+b.dataset.i); });
  $('s-play').addEventListener('click', togglePlay);
  $('s-replay').addEventListener('click', () => enterBeat(i));
  $('s-speed').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    speed = +b.dataset.v;
    root.querySelectorAll('#s-speed button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    enterBeat(i);
  });
  $('s-lens').addEventListener('click', () => {
    if (!B[i].lens) return;
    lens = !lens; syncLens();
    const fr = B[i].frames[curFrame];
    if (fr.shot === curShot) sc.show(stateFor(B[i], fr), { dur: 500 });
  });
  $('s-toggle').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) showBeforeAfter(b.dataset.v); });
  $('s-people').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) showPerson(b.dataset.p); });
  $('s-svg').addEventListener('click', (e) => { const g = e.target.closest('[data-pick]'); if (g) showPerson(g.dataset.pick); });

  renderPanel();
  applyFrame(0, true);
  clearTimers();
  $('s-play').textContent = 'Play';
  let started = false;
  const io = new IntersectionObserver((es) => { if (!started && es.some((e) => e.isIntersecting)) { started = true; enterBeat(0); io.disconnect(); } }, { threshold: 0.35 });
  io.observe(stage);
  return {
    key: (d) => enterBeat(i + d),
    goto: (j) => enterBeat(j),
    destroy: () => { alive = false; clearTimers(); clearInterval(typeTimer); io.disconnect(); },
  };
}
