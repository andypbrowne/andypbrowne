---
name: verify-andypbrowne
description: >-
  Drive the andypbrowne Eleventy site in a real browser through
  control-andypbrowne. Don't use the harness unless I ask.
disable-model-invocation: true
---

# Verify andypbrowne

Don't use the harness unless I ask.

Primary surface is the public website. Users read posts, filter the bookshelf, and search with the command palette. Secondary surfaces are the Atom/JSON feeds, `/llms.txt`, and `/index.json`. Prove those with `http`, not the browser, unless the change is specifically about discovery files.

There is no Playwright or Cypress suite in the repo. Drive the live page through `control-andypbrowne`. Do not treat `_site` files, Eleventy logs, or `npm run build` as proof of interactive behavior.

## Launch

From the repo root. Never attach to the human's usual preview on port 8080.

```bash
.cursor/skills/verify-andypbrowne/scripts/control-andypbrowne launch
```

That starts Eleventy with `--serve --port=8091` and a headless Chromium. Ready means `GET http://127.0.0.1:8091/` returns 200. The command prints that base URL.

Override the port with `--port` or `VERIFY_PORT`. Port 8080 is refused unless `VERIFY_ALLOW_SHARED=1`.

First run installs Playwright Chromium under `.cursor/skills/verify-andypbrowne/scripts/`. That is verification scaffolding, not a site dependency.

Teardown:

```bash
.cursor/skills/verify-andypbrowne/scripts/control-andypbrowne cleanup
```

Cleanup kills only the Eleventy and browser pids recorded in `.cursor/skills/verify-andypbrowne/.run/state.json`. It does not kill by process name. It does not delete `artifacts/`.

Two verification instances can run on different ports. They share `_site` on disk. Do not run a second instance if an Eleventy watch in this checkout is mid-write and you need a stable build. Never drive the human's 8080 session.

## Doctor

Run this first whenever anything looks off.

```bash
.cursor/skills/verify-andypbrowne/scripts/control-andypbrowne doctor
```

Pass means: both recorded pids are alive, GET `/` is 200, the HTML contains `Andypbrowne` and `#command-bar-trigger`, and Chromium can open the home title. Fail means relaunch. Do not keep driving a failing instance.

## Drive

Prefix every command with `.cursor/skills/verify-andypbrowne/scripts/control-andypbrowne`.

Read `features/README.md`, then the matching feature file. Drive every entry point that file lists. Prefer the handles in those files.

```bash
control-andypbrowne goto /bookshelf/
control-andypbrowne click --role link --name "Open command palette"
control-andypbrowne fill --selector "#bookshelf-find-input" --value "Kalbag"
control-andypbrowne click --role radio --name "Fiction"
control-andypbrowne select --selector "#status-select" --value "want-to-read"
control-andypbrowne check --selector "#covers-only"
control-andypbrowne press --key Meta+k
control-andypbrowne visible --role heading --name "Bookshelf"
control-andypbrowne url
control-andypbrowne http /feed/feed.xml
```

Viewport is 1280×800 with reduced motion. Bookshelf filters are open at this width (`details.filtering-details[open]` at ≥676px).

Stable handles on this site:

- Header home link: role `link`, name `Andypbrowne`
- Archive: role `link`, name `Archive`
- About: role `link`, name `About`
- Command palette trigger: role `link`, name `Open command palette`
- Palette dialog: role `dialog`, name `Command palette`
- Palette search: role `textbox`, name `Search command palette` (becomes `Search books` in book mode)
- Palette close: role `button`, name `Close command palette`
- Bookshelf heading: role `heading`, name `Bookshelf`
- Find field: `#bookshelf-find-input` (role `combobox`, name `Find a title or author`)
- Find list: `#bookshelf-find-list` (role `listbox`, name `Matching books`)
- Status: `#status-select`
- Group by year: `#group-by-years`
- Covers only: `#covers-only`
- Tag radios: `input[name="filter"]` with labels `All`, `Fiction`, `Design`, and the other tags in `content/bookshelf.njk`
- Empty filters: `#empty-state`
- Skip link: role `link`, name `Skip to main content`

Command palette result rows are `div.command-bar-item`, not links. Click `--text` of the result name (the `h3.command-bar-item-name`).

## Evidence

Put proof in `.cursor/skills/verify-andypbrowne/artifacts/<feature>/`. That directory survives cleanup.

A proof is incomplete unless it includes:

1. The user action (the exact `control-andypbrowne` command).
2. The resulting state (screenshot plus ARIA snapshot, or HTTP status plus body excerpt for feeds).
3. The feature ID and entry point in the artifact names or a short `proof.txt` beside them.

```bash
control-andypbrowne screenshot --path artifacts/bookshelf/find.png
control-andypbrowne snapshot --path artifacts/bookshelf/find.aria.txt
```

Exercise the real page. Do not assert on `_data/books/*.json` or `window.COMMAND_INDEX` as a substitute for the UI. For bookshelf URL state, `control-andypbrowne url` must show the query string the user would copy.

Mocks are not used. If Instapaper is down, `/likes/` may be empty or the Eleventy start may be slow. That page is not in the starter feature map.

## Cleanup

```bash
.cursor/skills/verify-andypbrowne/scripts/control-andypbrowne cleanup
```

After cleanup, confirm the artifact files still exist. If they are gone, the run failed this skill's contract.

## Helpers

`scripts/control-andypbrowne` is executable. It installs Playwright into `scripts/node_modules` on first run, then forwards to `scripts/control-andypbrowne.mjs`.

| Command | What it does |
|---|---|
| `launch` | Start isolated Eleventy + Chromium |
| `doctor` | Read-only health check |
| `cleanup` | Kill recorded pids, keep artifacts |
| `goto <path>` | Open a path on the instance |
| `click` | `--role`/`--name`, `--selector`, or `--text` |
| `fill --value` | Same locator flags |
| `press --key` | Page or locator key |
| `check` / `uncheck` | Checkboxes |
| `select --value` | `<select>` |
| `visible` | Exit 1 if not visible |
| `count` | Locator count |
| `text` | Inner text |
| `url` | Current URL |
| `http <path>` | Status code for a GET |
| `screenshot --path` | PNG |
| `snapshot --path` | URL, title, ARIA snapshot |

State lives in `.cursor/skills/verify-andypbrowne/.run/state.json`. Logs: `.run/eleventy.log`, `.run/browser.log`.
