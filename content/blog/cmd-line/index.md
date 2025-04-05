---
title: Command Line Snippets
description: And look cool while you are doing it
thumbnail: assets/images/thumb-fpo.png
thumbnailAlt: Just a placeholder image that says FPO which means for 
date: 2024-06-30
tags:
  - post
  - tips
draft: false
css: /assets/css/breathing.css
js: /assets/js/copy-snippets.js
resources:
  - id: 1
    title: Duplicate a directory
    snippet: cp -r content/blog/_template content/blog/title-tk
  - id: 2
    title: "Error Fatal: Not possible to fast-forward, aborting"
    snippet: git pull --rebase
  - id: 3
    title: Create new branch
    snippet: git checkout -b NEW_BRANCH_NAME
  - id: 4
    title: Open VS Code editor (w/ shell command installed)
    snippet: code .
  - id: 5
    title: review last commit
    snippet: git log [BRANCH NAME]
---

A list of helpful code snippets for us making this, my personal blog. This post assumes you are using the command line to work on a personal website. The primary reasons for doing this is to speed up workflow and to look cool while you are doing it.

<h2 class="visually-hidden">Snippets</h2>

<div class="grid"> {% for resource in resources %}
  <div class="card" 
    style="
    border: 1px solid var(--subtle-border);
    border-radius: var(--border-radius);
    padding: 1rem 1rem 1.2rem;">
      <div class="card-body">
        <h3 style="margin-top: 0px;">{{ resource.id }}. {{ resource.title }}</h3>
        <pre><code id="snippet-{{ resource.id }}">{{ resource.snippet }}</code></pre>
      </div>
      <div class="card-footer">
        <button class="copy-btn" data-snippet-id="snippet-{{ resource.id }}">📋 Copy snippet</button>
      </div>
  </div>{% endfor %}
</div>

## Resources

- [Git Guide, no deep shit ;)](https://rogerdudler.github.io/git-guide/)
- [Atlassian Git Commands Glossary](https://www.atlassian.com/git/glossary#commands)

## To Do

- Add a [Clipboard.js](https://clipboardjs.com/) feature to allow easy copy/paste




