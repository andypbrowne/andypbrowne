---
title: Shortcuts
description: Keyboard shortcuts are a cheat code for your digital life
thumbnail: assets/images/thumb-fpo.png
thumbnailAlt: Just a placeholder image that says FPO which means for  
date: 2025-02-12
tags:
  - post
  - tips
  - keyboards
draft: false
resources:
  - category: Productivity
    result: ⌨️
    action: Move cursor one word to the left
    shortcut: '<kbd><kbd>Option</kbd> + <kbd>◀</kbd></kbd>'
  - category: Productivity
    result: ⌨️
    action: Move cursor one word to the right
    shortcut: '<kbd><kbd>Option</kbd> + <kbd>▶</kbd></kbd>'
  - category: Productivity
    result: ⌨️
    action: Move cursor to beginning of line
    shortcut: '<kbd><kbd>Command</kbd> + <kbd>◀</kbd></kbd>'
  - category: Productivity
    result: ⌨️
    action: Move cursor to end of line
    shortcut: '<kbd><kbd>Command</kbd> + <kbd>▶</kbd></kbd>'
  - category: Typography
    result: ‘
    action: Opening single quote 
    shortcut: '<kbd><kbd>Option</kbd> + <kbd>[</kbd></kbd>'  
  - category: Typography
    result: ’
    action: Closing single quote 
    shortcut: '<kbd><kbd>Shift</kbd> + <kbd>Option</kbd> + <kbd>[</kbd></kbd>'
  - category: Typography
    result: “
    action: Opening double quote 
    shortcut: '<kbd><kbd>Option</kbd> + <kbd>]</kbd></kbd>'
  - category: Typography
    result: ”
    action: Closing double quote 
    shortcut: '<kbd><kbd>Shift</kbd> + <kbd>Option</kbd> + <kbd>]</kbd></kbd>'
  - category: Typography
    result: —
    action: Em dash 
    shortcut: '<kbd><kbd>Option</kbd> + <kbd>-</kbd></kbd>'
  - category: Typography
    result: …
    action: Ellipsis
    shortcut: '<kbd><kbd>Option</kbd> + <kbd>;</kbd></kbd>'
  - category: Raycast
    result: '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 18.079V21L0 14L1.46 12.54L7 18.081V18.079ZM9.921 21H7L14 28L15.46 26.54L9.921 21ZM26.535 15.462L27.996 14L13.996 0L12.538 1.466L18.077 7.004H14.73L10.864 3.146L9.404 4.606L11.809 7.01H10.129V17.876H20.994V16.196L23.399 18.6L24.859 17.14L20.994 13.274V9.927L26.535 15.462ZM7.73 6.276L6.265 7.738L7.833 9.304L9.294 7.844L7.73 6.276ZM20.162 18.708L18.702 20.17L20.268 21.738L21.73 20.276L20.162 18.708ZM4.596 9.41L3.134 10.872L7 14.738V11.815L4.596 9.41ZM16.192 21.006H13.268L17.134 24.872L18.596 23.41L16.192 21.006Z" fill="#FF6363"/></svg>'
    action: Open Raycast
    shortcut: '<kbd><kbd>Command</kbd> + <kbd>Space</kbd></kbd>'
---

This post is inspired by my recent adoption of [Raycast](https://www.raycast.com/). It’s a productivity app. Think Mac Spotlight or Alfred but with more power and a community making every extension you can imagine. I've watched about a dozen videos on their [YouTube channel](https://www.youtube.com/@raycastapp) and I’m convinced everyone should be using a computer this way. 

You don’t need to be a power user. In fact the bese way to start using Raycast and other keyboard shortcuts is to just start small. I would suggest starting with some native shortucts to work with text. Try moving your cursor around without using the mouse by using combinations of <kbd>Option</kbd>, <kbd>Command</kbd>, and the arrow keys. Hold down <kbd>Shift</kbd> while you are doing it to select text as you move. Practice and you'll never go back. Try not to judge people too hard who still use their mouse to peck around for just the right spot.

I have listed below some of my favorite shortuts. I suggest giving them a try, but they are primarily here for me to practice. 

## Shortcuts

<div style="
display: grid;
grid-template-columns: min-content 1fr min-content 1fr;
gap: 1rem;
margin-block-end: 3rem;"> {% for resource in resources %}
  <div class="card" 
    style="
    grid-column: span 4;
    display: grid;
    grid-template-columns: subgrid;
    border-bottom: 1px solid var(--subtle-border);
    padding: 1rem 1rem 1.2rem;">
    <div><code>{{ resource.result | safe }}</code></div>
    <div>{{ resource.action }}</div> 
    <div>→</div> 
    <div>{{ resource.shortcut | safe }}</div>
  </div>{% endfor %}
</div>

