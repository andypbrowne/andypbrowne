# Bookshelf

The bookshelf lists books by year, filters by tag and status, finds a title or author, and keeps those choices in a readable URL.

## Sub-features

- `shelf-load` shows the Bookshelf heading and year groups.
- `shelf-tag` filters to one tag (Fiction is the default proof tag).
- `shelf-status` filters Want to read and Read.
- `shelf-find` typeahead-finds a title or author and jumps to that card.
- `shelf-find-clears-filters` resets tag/status to all when a find result sits outside the current filter.
- `shelf-group` toggles Group by year.
- `shelf-covers` toggles Covers only.
- `shelf-url` writes `?tag=&status=&group=&covers=` the user can copy.
- `shelf-empty` shows the empty status when nothing matches.

## How to get to it (user POV)

- Open `/bookshelf/` from the footer Bookshelf link, a command-palette result, or a direct URL.
- Use Filters: tag radios, Status, Find a title or author, Group by year, Covers only.
- Paste a query URL such as `/bookshelf/?tag=fiction&status=all&group=1&covers=0`.

## Driving it with control-andypbrowne

Preconditions:

- Doctor reports `ok http://127.0.0.1:8091`.
- Viewport 1280×800 so Filters is open.
- Start at `goto /bookshelf/`.
- Proof book: title `Accessibility for Everyone`, author `Laura Kalbag`, 2026 card id `book-2026-accessibility-for-everyone`.

- **Load.** Run `control-andypbrowne visible --role heading --name "Bookshelf"` and `control-andypbrowne visible --role heading --name "2026"`.
- **Tag.** Run `control-andypbrowne click --role radio --name "Fiction"`. `control-andypbrowne url` includes `tag=fiction`. Fiction cards remain. A Design-only title is not visible.
- **Status.** Run `control-andypbrowne select --selector "#status-select" --value "want-to-read"`. `control-andypbrowne url` includes `status=want-to-read`.
- **Find.** Reset with `goto /bookshelf/?tag=all&status=all&group=1&covers=0`. Run `control-andypbrowne fill --selector "#bookshelf-find-input" --value "Kalbag"`. The listbox `Matching books` is visible and contains Accessibility for Everyone. Choose that option. The card `#book-2026-accessibility-for-everyone` is in view.
- **URL.** After tag Fiction and status all, `control-andypbrowne url` includes `tag=fiction`, `status=all`, `group=1` or `group=0`, and `covers=0` or `covers=1`. Do not treat a stripped query as success.
- **Group.** Run `control-andypbrowne uncheck --selector "#group-by-years"`. Year headings hide. `control-andypbrowne url` includes `group=0`.
- **Covers.** Run `control-andypbrowne check --selector "#covers-only"`. Book titles in `.info` are not shown as the default list. `control-andypbrowne url` includes `covers=1`.
- **Empty.** Combine a tag and status with no books if you can do so from the radios and select. `#empty-state` becomes visible with "No books match your filters".
- **Proof.** Leave Find showing Kalbag. Run `control-andypbrowne screenshot --path artifacts/bookshelf/find.png` and `control-andypbrowne snapshot --path artifacts/bookshelf/find.aria.txt`. Both show the Find field, the matching option, and the Bookshelf heading.

## Gotchas

- Find is global. Status and tag do not narrow the typeahead. If a chosen book is outside the current filter, the shelf resets to all. That is required behavior.
- `Group by year` defaults to on. Assert the URL, not the default checkbox alone.
- On viewports under 676px the Filters `details` is closed. The harness is 1280px. Do not test the closed summary path unless you change the viewport.
- Cover images are remote. A broken jacket is a real user bug, not a harness flake. Still prove the card and title, and note the broken image.
- localStorage key `bookshelfFilters` can restore a prior filter if you reuse a profile. This harness uses a fresh Chromium. If a run looks pre-filtered, check the URL and reload with explicit query params.
