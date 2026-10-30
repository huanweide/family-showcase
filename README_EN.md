**中文** · [README.md](./README.md)

<p align="center">
  <img src="assets/banner.svg" alt="family-showcase · Engineering Health Family panorama dashboard" width="1280">
</p>

# family-showcase · Engineering Health Family panorama dashboard

![License](https://img.shields.io/github/license/huanweide/family-showcase)
![Stars](https://img.shields.io/github/stars/huanweide/family-showcase)
![Engineering Health Family](https://img.shields.io/badge/Engineering%20Health%20Family-18%20axes-22c55e)
![Self-contained](https://img.shields.io/badge/self--contained-21KB%20single%20file-4ecca3)
![CI](https://github.com/huanweide/family-showcase/actions/workflows/ci.yml/badge.svg)

> A zero-dependency, self-contained single-page HTML that visualizes the entire **Engineering Health Family**: all 18 checkup axes, each one's severity model, run command, and decision routing — filterable by governance layer. No CDN, no build, no network.

**One-liner**: a single offline page that lays out the **global relationships** of the Engineering Health Family (a collection of zero-dependency code-checkup tools) — which dimensions are covered, which are still empty, and who should handle a given class of problem.

**Any browser → open one HTML → automatically does "filter by governance layer → view an axis's dimension/severity/command → decision routing"**

[30-second overview](#30-second-overview) · [Axis list (18)](#axis-list-18) · [Features](#features) · [Quick start](#quick-start) · [Self-check](#self-check) · [Architecture](#architecture) · [Related projects](#related-projects)

## Who should use this

- You want a single offline page that maps all 18 family checkup axes, what each covers, its severity model, run command, and decision routing.
- You maintain or evaluate the family and need to see coverage density and gaps at a glance.

## Who should NOT use this

- You want to actually run a checkup — this is a visualization, not a checker. Use [doctors](https://github.com/huanweide/doctors) to run the axes.
- You need live data from your repos — the page is a static snapshot of the axis definitions in its `AXES` array.

## 30-second overview

```
Before: to find "which tool for duplicate code" you flipped through a dozen READMEs, unsure you missed any
      -> answers scattered across repos, all in human memory

Now: open index.html, click "source layer"
      -> 11 axes line up; dupscan's dimension / severity model / run command / decision routing are all on the card
      -> the axis count at the top is computed at runtime from AXES.length, so adding an axis and forgetting the copy fails CI
```

The difference in one line: **this is not another checkup tool — it visualizes the global relationships of an existing family of sibling tools.**

## Axis list (18)

- **Source layer (11)**: devdoctor / testlite / debtlens / a11ydoctor / awaitscan / cycscan / secscan / dupscan / debugdoctor / typedoctor / litdoctor
- **Git layer (4)**: repodoctor / commitdoctor / reldoctor / ghadoctor
- **Docs layer (1)**: docdoctor
- **Config layer (1)**: pkgdoctor
- **Orchestration layer (1)**: enghealth

> The git layer's fourth member `ghadoctor` (GitHub Actions config hygiene: unpinned-action / script-injection / broad-permissions / pr-target-checkout, 8 rule classes) is published at [huanweide/ghadoctor](https://github.com/huanweide/ghadoctor). This page previously missed it; this round fills it in — axis count corrected from 17 to 18.

## Features

- **18-axis panorama (zero-dep)** — a single `AXES` array inside one `<script>` is the entire dataset; cards / layer filter / decision routing / dimension matrix all re-render from it automatically.
- **Filter by governance layer** — source / git / docs / config / orchestration, see coverage density and gaps at a glance.
- **Decision routing** — who should handle each class of problem (auto-fix / manual refactor / swap tool) is written right on the card, no doc lookup needed.
- **Dimension × tool matrix** — cross view to find "which axes jointly cover a given dimension".
- **Truly self-contained** — no CDN, no external requests, no build step; the whole page (styles, scripts, data) is this one ~21KB HTML file. CI asserts this.
- **Axis-count anti-drift** — the count is computed at runtime from `AXES.length` and written back into the page; CI's `verify.js` asserts again that the page and README declarations match.
- **CI truly green** — `verify.js` checks script syntax, field completeness, layer validity, axis-name uniqueness, zero external-resource references, and single-page size < 100KB.

## Quick start

Just open `index.html` in any browser:

```bash
git clone https://github.com/huanweide/family-showcase.git
cd family-showcase
# double-click index.html, or:
python -m http.server 8000   # then visit http://localhost:8000
```

No external requests, no CDN, no network dependency, no build step.

## Self-check

```bash
node verify.js
```

Real output:

```text
  ok  script syntax passed (9854 chars)
  ok  parsed 18 axis records
  ok  all axes' fields complete (layer/tag/rules/sev/langs)
  ok  rules / langs / sev all non-empty
  ok  all axes' layer declared in LAYERS
  ok  axis names unique
  ok  README axis-count declaration matches computed (18 axes, 1 declaration matched)
  ok  page sub-copy axis count matches (18 axes, also computed by JS at runtime)

VERIFY OK · 18 axes · 18 named entries
```

The last item was forced by a real incident: after adding `ghadoctor`, this page and README still said 17 axes — a "panorama that missed one of its own family's axes" error that human eyes easily miss in a diff. So the axis count is now guaranteed in two places: **computed at runtime from `AXES.length`**, and **asserted by `verify.js` in CI**.

## Architecture

| Primitive | Meaning |
|---|---|
| **axis** | One zero-dependency checkup tool (the family currently has 18) |
| **layer** | An axis's scope: source / git / docs / config / orchestration |
| **severity model (sev)** | How the axis grades a problem (family standard: weighted health score 0–100) |
| **decision routing** | Who handles the problems an axis finds |
| **AXES** | The single data source embedded in `index.html`; adding an axis is just appending one entry |

```text
   index.html (single file, ~21KB)
        ├── <style>   embedded styles
        ├── <body>    layer filter + card container + dimension matrix
        └── <script>  AXES array (single data source)
                 ↓ renders
        card list / layer filter / decision routing / dimension×tool matrix
                 ↓ at runtime
        axis count computed from AXES.length → page and README never drift
```

| Module | File | Description |
|---|---|---|
| Page body | `index.html` | Styles, scripts, data all embedded, self-contained |
| Axis data source | `index.html` → `AXES` in `<script>` | 18 axis records; adding an axis is just appending one |
| Layer definitions | `index.html` → `LAYERS` | The only valid set of layer values |
| Self-check script | `verify.js` | syntax / fields / layer validity / axis-name uniqueness / axis-count consistency |
| CI | `.github/workflows/ci.yml` | run self-check + assert no external resources + size gate |

## Add your own axis

Adding an axis is just appending one entry to the `AXES` array; cards / filter / matrix re-render automatically:

```js
{
  name: "myaxis",
  layer: "source",            // must be declared in LAYERS, else verify.js errors
  tag: "custom dimension",
  rules: "RuleA / RuleB",
  sev: { high: "...", medium: "...", low: "..." },
  langs: ["Python"],
  cmd: "node myaxis.js .",
  routing: "auto-fix / manual refactor"
}
```

`verify.js` guards four gates for you: **fields complete / layer valid / axis name unique / page and README axis count consistent**.

## Family convention (shared)

- Zero-dependency single-file Node CLI
- Severity-weighted health score 0–100
- Built-in CI gate (`--fail-on-high` / `--min-score`, etc.; gate only reads the exit code)

> Install and run per each axis's own repo README. Most tools are not published to npm yet, so `npx <name>` is **unavailable**; the `npx -y github:huanweide/<name>` shown on the cards needs the machine to reach GitHub directly. When the environment is restricted, clone the repo and run `node <entry>.js`.

## Archive note (change on 2026-08-15)

`debugdoctor` and `litdoctor` are local archived axes, not published to GitHub — they exist only in the local archive directory (not publicly released); everything else is published at [github.com/huanweide/\*](https://github.com/huanweide?tab=repositories).

## Related projects

| Project | One-liner |
|---|---|
| [`doctors`](https://github.com/huanweide/doctors) | Family monorepo: a11y / commit / dev / doc / pkg / rel / repo / type eight-piece zero-dep single-file CLI |
| [`enghealth`](https://github.com/huanweide/enghealth) | Unified entry that runs the whole family in one command (merged into doctors) |
| [`codehealth-loop`](https://github.com/huanweide/codehealth-loop) | Python orchestration engine: wire multiple checkup axes into a CI gate, auto-block non-compliant commits |
| [`veriloop`](https://github.com/huanweide/veriloop) | Same-paradigm code-audit CLI: multiple pluggable analysis axes + multiple verification gates |
| [`maxloop-overlord`](https://github.com/huanweide/maxloop-overlord) | The gate-paradigm reference: set external-criteria gates in CI, eliminating "fake-green" idling |
| [`ghadoctor`](https://github.com/huanweide/ghadoctor) | Git layer's 4th axis: GitHub Actions config hygiene |

---

If this project helped you, please [give it a Star](https://github.com/huanweide/family-showcase).

## License

MIT · © huanweide — see [LICENSE](LICENSE).

---

<div align="center">
  <b>Maintained by huanweide</b> ·
  <a href="https://github.com/huanweide">GitHub</a> ·
  <a href="https://github.com/huanweide/doctors">Back to the code-health family overview</a>
</div>
