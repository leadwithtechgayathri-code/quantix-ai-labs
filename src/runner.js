// Runs Python in the browser with Pyodide (loaded on first use).
// If the viewer blocks it, callers fall back to the checked output shown under each example.
const VER = '0.27.2';
const BASE = `https://cdn.jsdelivr.net/pyodide/v${VER}/full/`;
const PRELUDE = `
import io, base64, sys
def show(fig):
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=90, bbox_inches="tight")
    print("__IMG__" + base64.b64encode(buf.getvalue()).decode())
`;
let py = null, loading = null, failed = false;

function loadScript(src) {
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = () => rej(new Error('script blocked'));
    document.head.appendChild(s);
  });
}

async function boot(status) {
  status('Loading Python in your browser (about 10 MB, first time only)…');
  await loadScript(BASE + 'pyodide.js');
  const p = await window.loadPyodide({ indexURL: BASE });
  await p.runPythonAsync(PRELUDE);
  return p;
}

export async function runPython(code, status = () => {}) {
  if (failed) throw new Error('unavailable');
  try {
    if (!py) { loading = loading || boot(status); py = await loading; }
    const need = ['numpy', 'pandas', 'matplotlib', 'scipy', 'sympy', 'duckdb'].filter((m) => new RegExp(`\\b(import|from)\\s+${m}`).test(code));
    if (need.length) { status(`Loading ${need.join(', ')}…`); await py.loadPackage(need); }
    if (code.includes('matplotlib')) await py.runPythonAsync('import matplotlib\nmatplotlib.use("AGG")');
  } catch (e) {
    failed = true; loading = null;
    throw new Error('unavailable');
  }
  const out = [];
  py.setStdout({ batched: (s) => out.push(s) });
  py.setStderr({ batched: (s) => out.push(s) });
  status('Running…');
  try {
    await py.runPythonAsync(code);
    return { ok: true, text: out.join('\n') };
  } catch (e) {
    const msg = String(e.message || e).trim().split('\n');
    return { ok: false, text: out.join('\n') + (out.length ? '\n' : '') + msg.slice(-4).join('\n') };
  }
}

// Tiny Python highlighter (comments, strings, keywords, numbers, calls).
const KW = new Set('def return if elif else for while in not and or import from as class try except finally with lambda None True False is assert yield raise pass break continue global'.split(' '));
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
export function highlight(src) {
  const re = /(#[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?'''|f?"(?:\\.|[^"\\\n])*"|f?'(?:\\.|[^'\\\n])*')|\b(\d+(?:\.\d+)?(?:e-?\d+)?)\b|\b([A-Za-z_]\w*)(?=\s*\()|\b([A-Za-z_]\w*)\b/g;
  let out = '', last = 0, m;
  while ((m = re.exec(src))) {
    out += esc(src.slice(last, m.index));
    const [t, c, s, n, fn, w] = m;
    if (c) out += `<span class="tc">${esc(t)}</span>`;
    else if (s) out += `<span class="ts">${esc(t)}</span>`;
    else if (n) out += `<span class="tn">${t}</span>`;
    else if (fn) out += KW.has(fn) ? `<span class="tk">${fn}</span>` : `<span class="tf">${fn}</span>`;
    else out += KW.has(w) ? `<span class="tk">${w}</span>` : w;
    last = re.lastIndex;
  }
  return out + esc(src.slice(last));
}

// Render captured output: text, plus images printed as __IMG__<base64>.
export function renderOutput(text) {
  return String(text || '').split('\n').map((line) => (line.startsWith('__IMG__') ? `<img alt="Chart produced by the code" src="data:image/png;base64,${line.slice(7)}">` : esc(line))).join('\n')
    .replace(/\n?(<img[^>]+>)\n?/g, '</pre>$1<pre>');
}
