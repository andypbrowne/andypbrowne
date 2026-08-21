# Archive and post

Archive lists posts. Opening a post shows its title, date, body, and related posts.

## Sub-features

- `archive-list` shows the Archive heading and a list of post links.
- `archive-open` opens Kickoff from the list.
- `post-heading` shows the post title as an `h1`.
- `post-related` shows a Related section or the archive fallback link.

## How to get to it (user POV)

- Choose Archive in the header, or open `/blog/`.
- Choose a post title in the archive list.
- Open a post URL directly, such as `/blog/kickoff/`.

## Driving it with control-andypbrowne

Preconditions:

- Doctor reports `ok http://127.0.0.1:8091`.
- Proof post: Kickoff at `/blog/kickoff/`.

- **List.** Run `control-andypbrowne goto /blog/`. `control-andypbrowne visible --role heading --name "Archive"`. `control-andypbrowne visible --text "Kickoff"`.
- **Open from list.** Run `control-andypbrowne click --role link --name "Kickoff"`. The URL ends with `/blog/kickoff/`.
- **Post heading.** Run `control-andypbrowne visible --role heading --name "Kickoff"`.
- **Related.** `control-andypbrowne visible --role heading --name "Related"` and `control-andypbrowne visible --role link --name "the archive →"`.
- **Direct URL.** Run `control-andypbrowne goto /blog/kickoff/` and repeat the heading check so the list path is not the only proof.
- **Proof.** On the post, run `control-andypbrowne screenshot --path artifacts/archive-and-post/kickoff.png` and `control-andypbrowne snapshot --path artifacts/archive-and-post/kickoff.aria.txt`. Both show the Kickoff `h1`.

## Gotchas

- Archive items use an `h2` inside a link. The accessible name is the post title. Click `--role link --name "Kickoff"`, not a heading role.
- Some posts are `rss_only` and do not appear in the archive. Absence from `/blog/` is not a failure for those.
- Post CSS and JS come from front matter. A post can look unstyled if its `css` path 404s. Screenshot is required.
