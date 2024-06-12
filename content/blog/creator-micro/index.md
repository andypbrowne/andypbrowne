---
title: Creator Micro
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

Technically its a macropad. Thats sort of an enthusiast device that allows for quick actions like a single dedicated button for a keyboard shortcut. You might adjust a rotary dial to control a UI element like a slider or volume setting.  Any one of the buttons can also be configured with a macro &mdash; where you can configure a long series of keystrokes with only one tap. 

<figure>
  {% image "./via-interface.jpg", "A screenshot of the VIA software interface that shows confuration for the Creator Macro" %}
<figcaption>VIA is a web-based app that allows you to configure a keyboard. You can remap keys, create shortcuts, and control lighting</figcation>
</figure>

So, how to decide what to do with the device? The first thing I did was configure the nob to be a volume control. This is honestly the best feature. I'm loosing this great tactile element when Spotify will [brick the Car Thing](../car-thing/) in December 2024 (and I’m not very happy about it). The rest of the buttons are a little harder decision. For Figma specifically, I alreay know a lot of keyboard shortcuts and the best ones are already very simple. For example comment is just the C key. Auto-layout is just <code>SHIFT + A</code>. <code>P</code> is the pen tool, but I use that one because the pen-tool icon looks so nice with the custom Figma keycaps. The keys I am interested in are often used less and have harder shortcuts to remember. I’m going to make a list of them and then I’ll explain how to use the web-based software [VIA](https://www.caniusevia.com/) to configure the keys. An easy way to figure out the Quantum Mechanical Keyboard Firmware (QMK) Keycodes that are needed is to use the [QMK Firmware Site](https://docs.qmk.fm/keycodes_basic).

The Creator Micro Keyboard actually has 3 layers. That means you can have a whole new set of configurations. Most people use this feature to switch between software. My thought is to make the first layer for Figma, the second for Figjam, and the third for video editing in Davinci Resolve (I would like to get back into video editing).

## Layer 1: Figma Shortcuts 

| Key| Desired Action | Keyboard Shortcut | QMK Keycode|
|----------|------------|-----------|-----------|
| Large nob| Volume Down| <code>F11</code>| G(KC_VOLD)|
| Large nob| Volume Up  | <code>F12</code>| G(KC_VOLU)|
| Large nob| Play/Pause | <code>F8</code> | KC_MPLY   |
| Keycap 1 | Create Component | <code>OPN + CMD + K</code> |LAG(KC_K)   |
| Keycap 2 | Pen Tool (because the icon looks cool) | <code>P</code> | P   |
| Keycap 3 | Align Left |<code> OPN + A</code> | A(KC_A)   |
| Keycap 4 | Align Horizontal Centers | <code>OPN + H</code> | A(KC_H)   |
| Keycap 5 | Align Right |  <code>OPN + D</code> | A(KC_D)   |
| Keycap 6 | Align Top |  <code>OPN + W</code> | A(KC_W)   |
| Keycap 9 | Select Matching Layers | <code>OPN + CMD + A</code> | LCA(KC_H)   |
| Keycap 10| Launch Figma | -   | WIP|

## To Do
- Figjam Shortcuts
- Slider control for font size or whatever
- Davinci Resolve Shortcuts
- item

