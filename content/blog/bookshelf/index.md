---
title: Bookshelf
description: A simple webpage that helps form a reading habit
thumbnail: assets/images/thumb-fpo.png
thumbnailAlt: Just a placeholder image that says FPO which means for placeholder only 
date: 2024-05-04
tags:
  - post
  - books
draft: false
---

I finally made a [digital bookshelf](/bookshelf/). Its a simple page that keeps track of all the books I have finished. The best part of having one of these is the built-in motivation. If I were to have a goal of reading one book a month for a year &mdash; this helps a lot.

## Getting Into Reading

There are two other things that have helped me start reading more in the last few years. First, in 2014, I got a new sister-in-law who is an author of young-adult books. If you are wondering why both my digital and IRL bookshelf have numerous titles intended for teenagers &mdash; it’s because I read them and really enjoyed the fantacy and science fiction elements of her novels. I find that knowing the author really makes it easy to get into the books. Its a contageous process. 

The other thing that helped me get into reading even more, starting in 2023, was a book club we started at work. We have this culture and community initiative on the user experience team. Book Club has been one of our most successful activities. We choose a title, typically from our O’Reilly Reading account, and host a zoom call to discuss once-a-month. O’Reilly is all technology and business titles. Luckily it also has a lot of design books. So it has me re-reading some of the classics like: *Don't Make Me Think*, *The Design of Everyday Things*, and *Articulating Design Decisions*. 

## About the Bookshelf

I’ve really wanted a digital bookshelf for a while now. I just had a bunch of false starts because of the technology. Setting up a whole content management system was just overkill for what I wanted to do. I would be spending more time coding that I would be reading. Luckily the platform I use to make this blog, Eleventy, has a really handy feature called [Global Data Files](https://www.11ty.dev/docs/data-global/). You just drop some JSON into a folder and edit the content in plain text. 

{% raw %}
```js
[  
  {
    "cover": "https://learning.oreilly.com/covers/9781098168612/500h/",
    "coverAlt": "Apparently the 48th A Book Apart Book with forward by Cassidy Williams",
    "link": "https://abookapart.com/products/surviving-change-at-work",
    "title": "Surviving Change at Work",
    "subTitle": "Find clarity as you drive toward the next step in your tech career.",
    "author": "Vanessa Gennarelli",
    "tags": ["Business", "Technology", "Career Development"],      
    "description": "This book is great because it also has some practical exercises to complete. I frequently recommmend this title."
  }
]
```
{% endraw %}

To display that content on a webpage its an even simpler format. You write the template once and it will display all the books. These are some very simple web development patterns. But it makes be proud to make something like this work in one weekend. 

{% raw %}
```html
<ol class="bookshelf">  
{% for book in books.2024bookList -%}
<li>
  <a href="{{ book.link }}">
    <img loading="lazy" width="180" height="270" src="{{ book.cover }}" alt="{{ book.coverAlt }}" /></a>
  <div class="info">
    <h3>{{ book.title }}</h3>
    <p>{{ book.subTitle }}</p>
    <p>{{ book.author }}</p>
  </div>
</li>
{% endfor -%}
</ol>
```
{% endraw %}

## Next Steps

1. Read
1. Add some filtering to the bookshelf based on the tags I have already included
1. Read more
1. Experiment with the new popover (or maybe the dialog) html element to display the description data
1. Read even more