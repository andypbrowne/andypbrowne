---
Title: Bookshelf
layout: layouts/base.njk
description: This is a list of books
css: /assets/css/bookshelf.css
books:
  - title: "Breath"
    subTitle: "The new science of a lost art"
    author: "James Nestor"
    image: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/71OfD29lJRL._AC_UF1000,1000_QL80_.jpg"
    alt: "an illustrated word breath where the text is evaporating"
  - title: "To Kill a Mockingbird"
    author: "Harper Lee"
---
# Bookshelf
<ul class="grid">
        {% for book in books %}
            <li>
            <img src="{{ book.image }}" alt=" {{ book.alt }} width="100" height="150">
            <h2>{{ book.title }}</h2> 
            {{ book.subTitle }}<br>
            {{ book.author }}</li>
        {% endfor %}
</ul>