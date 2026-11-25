# Quantix AI Labs

An interactive AI roadmap by **ProDev Quantix**, from data foundations to agent harnesses: 172 lessons in 9 phases, each with five layers (concept animation, maths, code three ways, industry lens, practice), a story scene per phase, and one growing ShopSense project.

Created by **Gayathridevi M** · [LinkedIn](https://www.linkedin.com/in/gayathridevi-manojkumar)

## Run it on your computer

Needs Node.js 20 or newer.

```bash
npm install
npm run dev        # opens a local site with live reload
npm run build      # checks content, then builds the site into dist/
npm run preview    # serves dist/ locally to test the production build
```

## Deploy on Vercel

1. Push this folder to a GitHub repository (see below).
2. In Vercel, choose **Add New → Project**, import the repository, and keep the detected settings (framework Vite, build `npm run build`, output `dist`). `vercel.json` already sets these.
3. Click **Deploy**. Every push to `main` then updates the live site, and every pull request gets its own preview link, so a release can be checked before it goes live.
4. Optional: add your domain under **Project → Settings → Domains**.

Addresses that work on the live site:

| Address | Opens |
| --- | --- |
| `/` | Home and roadmap |
| `/phase-0` | Phase 0, starting with its story scene |
| `/#p0-04` | A lesson (P0.04) |
| `/#p0-story`, `/#p0-project` | The Phase 0 story and project |

## Push to GitHub

```bash
git remote add origin https://github.com/<your-account>/quantix-ai-labs.git
git push -u origin main
```

Create the empty repository on GitHub first (no README), then run the two commands.

## How the code is organised

```
src/
  main.js            app shell: sidebar, home, routing, progress
  roadmap.js         all 9 phases and 172 lesson titles
  phases/
    manifest.js      what is published per phase (read without loading the phase)
    p0.js            Phase 0 bundle: lessons, story, project, checked outputs
    outputs-p0.json  checked output of every code block in Phase 0
  lessons/           lesson content (p0a.js … p0d.js)
  stories/           story scenes (p0.js)
  projects/          ShopSense project pages (p0.js)
  engine.js kit.js   isometric animation engine and helpers
  lessonview.js storyview.js projectview.js runner.js
tools/
  dump.mjs run.py    run every code block in Python and save its output
  check.mjs          pre-build check: manifest matches bundles, every code block has output
```

Each phase builds to its own JavaScript file and loads only when a learner opens it, so the site stays fast as phases are added. Shared code (engine, templates) exists once.

## Adding a phase (each release)

1. Add lesson files under `src/lessons/`, a story under `src/stories/`, a project under `src/projects/`.
2. Create `src/phases/p1.js` like `p0.js`.
3. Register it in `src/phases/manifest.js`: a loader and the list of ready lesson IDs.
4. Run `npm run outputs` (needs Python 3 with numpy, pandas, matplotlib, scipy, sympy, duckdb). It runs every code block and exercise solution and fails on any error.
5. `npm run build`. The build stops if the manifest and the content disagree or any output is missing.

`npm run build:single` makes one self-contained `dist-single/index.html` for hosts that accept a single file.

## Notes

- Progress (finished lessons, depth, checklists) is stored in the learner's browser only.
- "Run in browser" uses Pyodide from cdn.jsdelivr.net; the checked output is always shown, so lessons work without it.
