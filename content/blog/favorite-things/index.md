---
eleventyImport:
  collections: ["favoriteThings"]
title: Favorite Things
description: This is a list of my favorite things
thumbnailAlt: alternative text 
date: 2024-01-23
tags: featured
draft: true
css: /assets/css/favorite-things.css
---


<ul>
{%- for post in collections.favoriteThings | reverse -%}  
  <li><a href="{{ post.url }}">{{ post.data.title }}</a></li>
{%- endfor -%}
</ul>