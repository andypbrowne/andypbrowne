---
title: Creator Micro
number: 7
description: Bringing joy to your hardware and software
thumbnail: assets/images/thumb-macropad.png
thumbnailAlt: A line drawing of keyboard keys 
date: 2024-06-08
tags:
  - post
  - tips
  - favorite-thing
  - keyboards
draft: false
eleventyExcludeFromCollection.posts: true
css: /assets/css/favorite-things.css
---

<figure class="sketch">
  {% image "./macropad.png", "A line drawing of keyboard keys" %}
<figcaption></figcaption>
</figure>

I splurged and got the [Figma Creator Micro Keyboard](https://store.figma.com/products/figma-creator-micro-keyboard). It’s described as a device that will bring *joy* to your hardware. I believe it also brings a little enjoyment to my software and inspires me to make more things. 

Technically its a macropad. These are often mechanical keyboards and an enthusiast device that allows for quick actions like a single dedicated button for a keyboard shortcut. You might adjust a rotary dial to control a UI element like a slider or volume setting. Any one of the buttons can also be configured with a macro &mdash; where you can set a long series of keystrokes with only one tap. 

<figure>
  {% image "./via-interface.jpg", "A screenshot of the VIA software interface that shows confuration for the Creator Macro" %}
<figcaption>VIA is a web-based app that allows you to configure a keyboard. You can remap keys, create shortcuts, and control lighting</figcation>
</figure>

So, how to decide what to do with the device? The first thing I did was configure the nob to be a volume control. This is honestly the best feature. I'm loosing this great tactile element when Spotify will, in December 2024, [brick the Car Thing](../car-thing/) (and I’m not very happy about it). The rest of the keys are harder to decide on. For Figma specifically, I alreay know a lot of keyboard shortcuts and the best ones are already very simple. For example comment is just the <kbd>C</kbd> key. Auto-layout is just <kbd><kbd>SHIFT</kbd> + <kbd>A</kbd></kbd>. And the <kbd>P</kbd> is the pen tool – I use that one because the pen-tool icon looks so nice with the custom Figma keycaps. The keys that I am interested adding to the macropad are used less and have harder shortcuts to remember. Below is a list of them including the keyboard shortcuts, desired acction, and the Quantum Mechanical Keyboard Firmware (QMK) shortcodes. The web-based software [VIA](https://www.caniusevia.com/) is one of the easiest ways to configure mechanical keybaords. I’m getting QMK Keycodes from the [QMK Firmware Site](https://docs.qmk.fm/keycodes_basic).

The Creator Micro Keyboard actually has 3 layers. That means you can have a whole new set of configurations. Most people use this feature to switch between software. My thought is to make the first layer for Figma, the second for Figjam, and the third for video editing in Davinci Resolve (I would like to get back into video editing).

## Layer 1: Figma Shortcuts 

| Key| Desired Action | Keyboard Shortcut | QMK Keycode|
|----------|------------|-----------|-----------|
| Large nob| Volume Down| <kbd>F11</kbd>| G(KC_VOLD)|
| Large nob| Volume Up  | <kbd>F12</kbd>| G(KC_VOLU)|
| Large nob| Play/Pause | <kbd>F8</kbd> | KC_MPLY   |
| Keycap 1 | Create Component | <kbd><kbd>OPN</kbd> + <kbd>CMD</kbd> + <kbd>K</kbd></kbd> |LAG(KC_K)   |
| Keycap 2 | Pen Tool (because the icon looks cool) | <kbd>P</kbd> | P   |
| Keycap 3 | Align Left |<kbd><kbd>OPN</kbd> + <kbd>A</kbd></kbd> | A(KC_A)   |
| Keycap 4 | Align Horizontal Centers | <kbd><kbd>OPN</kbd> + <kbd>H</kbd> | A(KC_H)   |
| Keycap 5 | Align Right |  <kbd><kbd>OPN</kbd> + <kbd>D</kbd></kbd> | A(KC_D)   |
| Keycap 6 | Align Top |  <kbd><kbd>OPN</kbd> + <kbd>W</kbd></kbd> | A(KC_W)   |
| Keycap 9 | Select Matching Layers | <kbd><kbd>OPN</kbd> + <kbd>CMD</kbd> + <kbd>A</kbd></kbd> | LCA(KC_H)   |
| Keycap 10| Launch Figma | -   | WIP*|

[*] This is a little harder to accomplish. I think I'm going to have to [configure a custom keyboard shortcut](https://support.apple.com/guide/mac-help/create-keyboard-shortcuts-for-apps-mchlp2271/mac) in the Mac settings and then map that to the macropad.

## To Do
- Figjam Shortcuts
- Slider control for font size or whatever
- Davinci Resolve Shortcuts
- item

