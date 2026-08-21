# andypbrowne verification map

This directory is the maintained source for verifying user-facing behavior of andypbrowne.com. Read this index before driving the app, then use the matching feature file as the recipe.

## Baseline preconditions

- Launch with `.cursor/skills/verify-andypbrowne/scripts/control-andypbrowne launch`.
- Base URL is `http://127.0.0.1:8091` unless a different `--port` was passed.
- Run `control-andypbrowne doctor` and require `ok http://127.0.0.1:8091`.
- Viewport is 1280×800. Bookshelf filter `details` is open at this width.
- Never drive an instance that was not started by this verification run. Port 8080 is the human's `npm start` session.

## Driving conventions

- Start every recipe from home (`goto /`) unless its preconditions say otherwise.
- Prefer ARIA roles and accessible names over CSS selectors. Use an id when that is the stable handle (`#bookshelf-find-input`, `#status-select`).
- Treat every command as literal. Keep quoted names and flags unchanged.
- Run browser and HTTP actions through `control-andypbrowne`.
- Do not remove proof artifacts during cleanup.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes an ARIA snapshot and a screenshot that shows the Andypbrowne home link or page heading.
- HTTP proof includes the path, status code, and a body excerpt.
- Record the feature ID and entry point used with every artifact.
- Report an unreachable path with the attempted command and the unmet precondition.
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with control-andypbrowne` starts with `Preconditions:` and uses labeled bullets that pair each user action with an exact command and observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

Keep implementation details out of the map. Name only user paths, stable handles, required state, commands, and observable proof.

## Features

- [Home and navigation](./home-and-nav.md) covers the home page, header nav, skip link, and archive/about destinations.
- [Command palette](./command-palette.md) covers ⌘K / the header search control, featured results, query, book mode, and close.
- [Bookshelf](./bookshelf.md) covers tag and status filters, find, group by year, covers-only, and readable query URLs.
- [Archive and post](./archive-and-post.md) covers the archive list and opening a post.
- [About](./about.md) covers Snappy / Chatty / Windy bio length.
