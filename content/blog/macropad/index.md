---
title: Macropad
description: post description
thumbnail: assets/images/thumb-macropad.png
thumbnailAlt: alternative text 
date: 2024-06-08
tags:
  - post
  - tips
  - favorite-thing
  - keyboards
draft: true
---

<figure>
  {% image "./macropad.png", "Alternative text" %}
<figcaption></figcaption>
</figure>

I splurged and got the [Figma Creator Micro Keyboard](https://store.figma.com/products/figma-creator-micro-keyboard). It’s described as a device that will bring *joy* to your hardware. I believe it also brings a little enjoyment to my software and inspires me to make more things. 

Technically its a macropad. Thats sort of an enthusiast device that allows for quick actions like a single dedicated button for a keyboard shortcut or a rotary dial to adjust a UI element like a slider or volume setting.  Any one of the buttons can also be configured with a macro – where you can configure a long series of keystrokes with only one tap. 

So, how to decide what to do with the device. The first thing I did was configure the nob to be a volume control. This is honestly the best part of the device. I'm loosing this great tactile element when Spotify will [brick the Car Thing](../car-thing/) in December 2024. The rest of the buttons are a little harder decision. For Figma specifically, I alreay know a lot of keyboard shortcuts and the best ones are already very simple. For example comment is just the C key. Auto-layout is just SHIFT + A. P is the pen tool, but I use that one because the pen-tool icon looks so nice on the little keyboard. The keys I am interested in are often used less and have harder shortcuts to remember. I’m going to make a list of them and then I’ll explain how to use the web-based software [VIA](https://www.caniusevia.com/) to configure the keys. 

The Creator Micro Keyboard actually has 3 layers. That means you can have a whole new set of configurations. Most people use this feature to switch between software. My thought is to make the first layer for Figma, the second for Figjam, and the third for video editing in Davinci Resolve (I would like to get back into video editing).

## Layer 1: Figma Shortcuts 

| Key| Desired Action| QMK Keycode|
|----------|------------|-----------|
| Large nob| Volume Down| G(KC_VOLD)|
| Large nob| Volume Up  | G(KC_VOLU)|
| Large nob| Play/Pause | KC_MPLY   |
| Keycap   | Create Component | LAG(KC_K)   |
| Keycap   | Pen Tool (because the icon looks cool) | P   |
| Keycap   | Align Left | A(KC_A)   |
| Keycap   | Align Horizontal Centers | A(KC_H)   |
| Keycap   | Align Right | A(KC_D)   |
| Keycap   | Align Top | A(KC_W)   |
| Keycap   | Select Matching Layers | LCA(KC_H)   |
| Keycap   | Launch Figma | WIP   |

## To Do
- Figjam Shortcuts
- Slider control for font size or whatever
- Davinci Resolve Shortcuts
- item

