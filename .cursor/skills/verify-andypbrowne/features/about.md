# About

About offers three lengths of the same bio: Snappy, Chatty, and Windy.

## Sub-features

- `about-load` shows About Me.
- `about-snappy` is the default short bio.
- `about-chatty` shows the medium bio.
- `about-windy` shows the long bio.

## How to get to it (user POV)

- Choose About in the header, or open `/about/`.
- Choose Snappy, Chatty, or Windy.

## Driving it with control-andypbrowne

Preconditions:

- Doctor reports `ok http://127.0.0.1:8091`.
- Start at `goto /about/`.

- **Load.** Run `control-andypbrowne visible --role heading --name "About Me"`.
- **Snappy.** Snappy is selected on load. Visible bio text includes "good order and discipline" and does not include "JPMorgan Chase".
- **Chatty.** Run `control-andypbrowne click --text "Chatty"`. Visible bio includes "JPMorgan Chase".
- **Windy.** Run `control-andypbrowne click --text "Windy"`. Visible bio is longer than Chatty (more than one short paragraph on screen).
- **Proof.** On Chatty, run `control-andypbrowne screenshot --path artifacts/about/chatty.png` and `control-andypbrowne snapshot --path artifacts/about/chatty.aria.txt`. Both show About Me and Chatty selected.

## Gotchas

- Length is CSS-filtered, not a separate page. Assert visible text, not the presence of all three sections in the DOM.
- The radios are visually hidden. Click the `Snappy` / `Chatty` / `Windy` labels.
- About is not in the command-palette featured core list as a special case. Header About is the user path.
