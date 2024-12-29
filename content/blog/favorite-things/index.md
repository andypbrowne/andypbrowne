---
eleventyImport:
  collections: ["favoriteThings"]
title: Favorite Things
description: This is a list of my favorite things
thumbnail: assets/images/thumb-favorite-things.jpg
thumbnailAlt: alternative text 
date: 2024-01-28
tags: 
  - post
  - featured
draft: false
css: /assets/css/favorite-things.css
---

{% block head %}
<link rel="stylesheet" href="/assets/css/breathing.css" />
{% endblock %}

<div class="grid"> {%- for post in collections.favoriteThings | reverse -%}  
  <div class="card">
    <div class="card-body">
		<a href="{{ post.url }}">
      <img class="custom-size-images" src="../../{{ post.data.thumbnail }}" alt=" {{ post.data.thumbnailAlt }}"></a>
    {% if post.data.title %}<h2><a href="{{ post.url }}">{{ post.data.number }}: {{ post.data.title }}</a></h2>
			{% else %}
			<code>{{ post.url }}</code>
			{% endif %}</a>
		{% if post.data.description %}{{ post.data.description }}{% endif %}
	  </div>
  <div class="card-footer">
            <div class="resource-tag">favorite thing</div>
            <hr>
        </div>
</div>
{% endfor %}
</div>