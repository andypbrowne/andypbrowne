# Home and navigation

Home introduces Andy, lists featured posts and case studies, and sends the user to Archive, About, and the command palette from the header.

## Sub-features

- `home-load` shows the Andypbrowne identity and the hero on `/`.
- `home-featured` shows featured post links in `.featured-post-grid`.
- `nav-archive` opens Archive from the header.
- `nav-about` opens About from the header.
- `nav-skip` moves to main content via the skip link.
- `nav-palette-trigger` is present in the header (opening it is covered in command-palette.md).

## How to get to it (user POV)

- Open `/` or choose the Andypbrowne home link.
- Choose `Archive` or `About` in the header.
- Tab to `Skip to main content` and activate it.
- Choose the header search control labeled `Open command palette`.

## Driving it with control-andypbrowne

Preconditions:

- Doctor reports `ok http://127.0.0.1:8091`.
- Start at `goto /`.

- **Home identity.** Run `control-andypbrowne visible --role link --name "Andypbrowne"`. The home link is visible. `control-andypbrowne text --selector "h2"` includes employee experience copy.
- **Featured posts.** Run `control-andypbrowne visible --selector ".featured-post-grid .postlist-link"`. At least one featured post link is visible.
- **Archive.** Choose Archive. Run `control-andypbrowne click --role link --name "Archive"`. `control-andypbrowne visible --role heading --name "Archive"` and the URL ends with `/blog/`.
- **About.** Return home, then choose About. Run `control-andypbrowne goto /` and `control-andypbrowne click --role link --name "About"`. `control-andypbrowne visible --role heading --name "About Me"` and the URL ends with `/about/`.
- **Skip link.** Run `control-andypbrowne goto /` and `control-andypbrowne click --role link --name "Skip to main content"`. Focus is in `main#skip`.
- **Palette trigger.** Run `control-andypbrowne visible --role link --name "Open command palette"`.
- **Proof.** Capture home. Run `control-andypbrowne goto /` then `control-andypbrowne screenshot --path artifacts/home-and-nav/home.png` and `control-andypbrowne snapshot --path artifacts/home-and-nav/home.aria.txt`. Both show Andypbrowne, Archive, About, and the command palette trigger.

## Gotchas

- `Archive` is `/blog/`. There is no header item named Blog.
- Bookshelf is in the footer, not the header nav.
- The skip link is visually hidden until focused. `visible` on that link can fail even when the control exists. Click it, then prove focus on `main#skip`.
- Local previews may show a Netlify deploy badge. That is expected off Netlify and is not a failure.
