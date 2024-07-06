---
title: Command Line Snippits
description: And look cool while you are doing it
thumbnail: assets/images/thumb-fpo.png
thumbnailAlt: Just a placeholder image that says FPO which means for 
date: 2024-06-30
tags:
  - post
  - tips
draft: false
css: /assets/css/breathing.css
js: /assets/js/clipboard.min.js, 
resources:
  - title: Duplicate a directory
    snippit: cp -r content/blog/_template content/blog/title-tk
  - title: "Error Fatal: Not possible to fast-forward, aborting"
    snippit: git pull --rebase
  - title: Create new branch
    snippit: git checkout -b NEW_BRANCH_NAME
  - title: open VS Code editor (w/ shell command installed)
    snippit: code .
  - title: review last commit
    snippit: git log [BRANCH NAME]
---

A list of helpful code snippits for us making this, my personal blog. This post assumes you are using the command line to work on a personal website. The primary reasons for doing this is to speed up workflow and to look cool while you are doing it.

## Snippits

<div class="grid"> {% for resource in resources %}
  <div class="card" 
    style="
    border: 1px solid var(--subtle-border);
    border-radius: var(--border-radius);
    padding: 1rem 1rem 1.2rem;">
    <div class="card-body">
      <h3 style="margin-top: 0px;">{{ resource.title }}</h3>
      <code>{{ resource.snippit }}</code>
    </div>
    <div class="card-footer">
      <button id="btn" data-clipboard-text="1"><span>Copy</span></button>
    </div>
  </div>{% endfor %}
</div>

## Resources

- [Git Guide, no deep shit ;)](https://rogerdudler.github.io/git-guide/)
- [Atlassian Git Commands Glossary](https://www.atlassian.com/git/glossary#commands)

## To Do

- Add a [Clipboard.js](https://clipboardjs.com/) feature to allow easy copy/paste




