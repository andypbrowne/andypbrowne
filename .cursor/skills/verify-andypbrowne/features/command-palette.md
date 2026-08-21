# Command palette

The command palette searches pages and posts, can lock to books with `b` then space, and never stacks on top of another dialog.

## Sub-features

- `palette-open-click` opens from the header search control.
- `palette-open-key` opens from Meta+K or Control+K.
- `palette-featured` shows Latest Posts when the query is empty.
- `palette-query` filters pages and posts.
- `palette-book-mode` locks to books after `b ` and shows the Books chip.
- `palette-close` closes from the Close button, Escape, or a second Meta+K.

## How to get to it (user POV)

- Choose the header control labeled `Open command palette`.
- Press ⌘K (Mac) or Ctrl+K.
- Type `b` then space to search books. Backspace on an empty book query returns to all.

## Driving it with control-andypbrowne

Preconditions:

- Doctor reports `ok http://127.0.0.1:8091`.
- Start at `goto /`.
- No other page dialog is required for the happy path.

- **Click open.** Run `control-andypbrowne click --role link --name "Open command palette"`. A dialog named `Command palette` is visible. Focus is in the textbox named `Search command palette`.
- **Featured.** With the query empty, `control-andypbrowne visible --text "Latest Posts"` and `control-andypbrowne visible --text "View all posts →"`.
- **Query.** Run `control-andypbrowne fill --role textbox --name "Search command palette" --value "Kickoff"`. A result named Kickoff is visible. No `No results found`.
- **Open result.** Run `control-andypbrowne click --text "Kickoff"`. The palette closes and the URL ends with `/blog/kickoff/`. `control-andypbrowne visible --role heading --name "Kickoff"`.
- **Keyboard open.** Run `control-andypbrowne goto /` and `control-andypbrowne press --key Meta+k`. The same dialog appears. If Meta+K does nothing in this Chromium, use Control+K, then still report which key worked. Do not skip the keyboard path without recording that.
- **Book mode.** Open the palette. Run `control-andypbrowne fill --role textbox --name "Search command palette" --value "b "`. The Books chip is visible and the textbox name becomes `Search books`. Type `Kalbag`. A book result for Accessibility for Everyone is visible.
- **Close.** Run `control-andypbrowne click --role button --name "Close command palette"`. The dialog is gone.
- **Proof.** Reopen on featured content. Run `control-andypbrowne screenshot --path artifacts/command-palette/open.png` and `control-andypbrowne snapshot --path artifacts/command-palette/open.aria.txt`. Both identify the Command palette dialog and Latest Posts.

## Gotchas

- Result rows are not links. Click the visible name text, not a `link` role.
- Filling `b ` consumes the prefix and switches the input to book search. The value may become empty after lock. Assert the Books chip and `Search books`, not the literal `b ` remaining in the field.
- Meta+K toggles. If the palette is already open, the same key closes it.
- Opening the palette closes any native `<dialog>` that was open so only one overlay exists. Restore is automatic on close. Prove that on a post that uses `<dialog>` (podcasts), not on home.
- Reduced motion is on in the harness. Do not treat missing view transitions as a failure.
