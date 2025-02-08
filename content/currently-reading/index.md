---
title: Currently Reading
layout: layouts/base.njk
description: Exactly what it sounds like
thumbnail: "{{ book.cover }}"
thumbnailAlt: "{{ book.coverAlt }}"
css: /assets/css/bookshelf.css
---

<h2>Currently Reading</h2>

<aside class="currently-reading">

{% set booksData = books.2025bookList -%}
    {% set bookList2024 = booksData %}
{% for book in books.2025bookList -%}
{% if book.currentlyReading == "true" %}
<div class="featured-book">
<div>
    <a href="{{ book.link }}"><img loading="lazy" width="180" height="270" src="{{ book.cover }}" alt="{{ book.coverAlt }}" /></a>
</div>
<div class="info">
  <h3>{{ book.title }} 
    {% if book.type == 'audio' %}
    🎧  
    {% endif %} 
  </h3>
  <p class="sub-title">{{ book.subTitle }}</p>
  <p class="author">{{ book.author }}</p>
  {% if book.description %}
  <p>{{ book.description }}</p>
  {# <details>
    <summary><strong>Notes</strong></summary>
    <div class="notes">
      <p>{{ book.description }}</p>
    </div>
  </details> #}
</div>
</div>
  {% endif %}

{% endif %}
{% endfor -%}

<p style="margin-top: 1em;">More reading on <a href="/bookshelf/">the bookshelf &rarr;</a></p>

</aside>