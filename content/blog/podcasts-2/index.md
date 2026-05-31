---
title: Podcasts 2
description: post description
thumbnail: assets/images/thumb-fpo.png
thumbnailAlt: Just a placeholder image that says FPO which means for  
date: 2026-05-31
tags:
  - post
  - featured
draft: true
css: /assets/css/podcasts-2.css
templateEngineOverride: njk
resources:
  - title: But Why
    image: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/ad/e9/90/ade9900f-7bff-100b-c444-0687ac7f28ea/mza_4228241252633750087.png/600x600bb.webp"
    alt: 
    description: A bunch of kids asking questions of Vermont Public Radio. It’s a great science and bedtime listen to help kids go to sleep.
    link: "https://www.vermontpublic.org/podcast/but-why-a-podcast-for-curious-kids"
    tag: bedtime
    favoriteEpisodes:
      - title: Episode Title
        link: https://example.com 
  - title: Radiolab for Kids
    image: https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/56/8c/3a/568c3ac4-1c78-8139-e8b8-6bd0b0835617/mza_10174058825638805373.jpg/600x600bb.webp
    alt: Cover of radiolab presents terrestrials from WNYC illustrating plants
    description: Our second-favorite bedtime podcast. Great storytelling that can spark conversation about science and the natural world.
    link: "https://radiolab.org/podcast/terrestrials"
    tag: bedtime
    favoriteEpisodes:
      - title: It's Raining Cats and Cats
        link: https://podcasts.apple.com/gb/podcast/its-raining-cats-and-cats/id1504895463?i=1000689608161
      - title: Zoozve
        link: https://podcasts.apple.com/gb/podcast/zoozve/id1504895463?i=1000705585393
  - title: The Rest Is History
    image: https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/20/ed/c7/20edc799-fdb3-e608-a164-0cdaaee63c6b/mza_16701966284979673066.jpg/540x540bb.webp
    alt: Cover of the Rest is history presented by Lloyds including heads of Historical statues
    description: For history lovers and anyone who enjoys a good story. Just the right amount of nerdy history with a little humor.
    link: "https://www.therestishistory.com/"
    tag: history
    favoriteEpisodes:
      - title: "WWI: The Christmas Truce"
        link: https://podcasts.apple.com/us/podcast/wwi-the-christmas-truce/id1537788786?i=1000741833897
      - title: "Nelson: Slaughter in Naples (Part 1)"
        link: https://podcasts.apple.com/us/podcast/nelson-slaughter-in-naples-part-1/id1537788786?i=1000730798662
  - title: The Daily
    image: https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/ab/64/66/ab6466a9-9a7d-e20e-7a3d-bc5be37d29ce/mza_15084852813176276273.jpg/600x600bb.webp
    alt: A graphic cover including a gradient that looks like a sunrise. The NY Times logo is prominant
    description: A daily news podcast with deep reporting on the stories shaping the day.
    link: "https://www.nytimes.com/column/the-daily"
    favoriteEpisodes:
      - title: Unmasking the Creator of Bitcoin
        link: https://www.nytimes.com/2026/04/09/podcasts/the-daily/satoshi-nakamoto-bitcoin-creator.html
      - title: Where ‘The Daily’ Gets Its Music
        link: https://www.nytimes.com/2025/10/25/podcasts/the-daily/music-composers.html
    tag: news
  - title: Today, Explained
    image: https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/57/bc/e4/57bce477-b6e7-ba7d-5bca-6289f3f32e26/mza_17986217629149107841.jpeg/600x600bb.webp
    alt: Cover of Today explained podcast
    description: A daily explainer podcast that breaks down one big story in the news.
    link: "https://www.vox.com/today-explained-podcast"
    tag: news
    favoriteEpisodes:
      - title: The most underrated sites at our national parks — according to a guy who’s seen them all
        link: https://www.vox.com/podcasts/489283/national-park-service-sites-underrated-gems-mikah-meyer
      - title: Why Do So Many Songs Sound Familiar?
        link: https://www.vox.com/podcasts/2023/8/3/23817588/music-industry-business-strategy-nostalgia
  - title: Cautionary Tales
    image: https://is1-ssl.mzstatic.com/image/thumb/Podcasts122/v4/06/02/84/06028448-771b-33bc-aa09-6f8ff5403845/mza_10542795652437011877.jpg/600x600bb.webp
    alt: Cover of Cautionary Tales Podcast with Tim Hartford by Pushkin Studios
    description: A unique and creative show with a mix of history, economics, and lessons from past mistakes.
    link: "https://timharford.com/articles/cautionarytales/"
    tag: storytelling
  - title: Shop Talk Show
    image:
    alt:
    description: A preferred show about front-end web development and the industry around it.
    link: "https://shoptalkshow.com/"
    tag: webdev
---

<div id="podcast-grid" class="podcast-grid">
  {% for resource in resources %}
    <a class="podcast-tile" href="#podcast-{{ loop.index0 }}" aria-label="Open details for {{ resource.title }}">
      {%- if (resource.image) -%}
        <img src="{{ resource.image }}" alt="{{ resource.alt or ('Cover art for ' + resource.title) }}" style="view-transition-name: podcast-cover-{{ loop.index0 }};">
      {%- else -%}
        <img src="https://placehold.co/600x600?text=Podcast+Cover" alt="Cover art placeholder for {{ resource.title }}" style="view-transition-name: podcast-cover-{{ loop.index0 }};">
      {%- endif -%}
      <h3 class="podcast-cover-title">{{ resource.title }}</h3>
    </a>
  {% endfor %}
</div>

{% for resource in resources %}
  {% set prevIndex = loop.index0 - 1 %}
  {% if prevIndex < 0 %}{% set prevIndex = resources.length - 1 %}{% endif %}
  {% set nextIndex = loop.index0 + 1 %}
  {% if nextIndex >= resources.length %}{% set nextIndex = 0 %}{% endif %}
  <section id="podcast-{{ loop.index0 }}" class="podcast-overlay" aria-labelledby="podcast-title-{{ loop.index0 }}">
    <a class="podcast-overlay-backdrop" href="#podcast-grid" aria-label="Close details"></a>
    <div class="podcast-panel">
      <div class="podcast-panel-media">
        {%- if (resource.image) -%}
          <img src="{{ resource.image }}" alt="{{ resource.alt or ('Cover art for ' + resource.title) }}" style="view-transition-name: podcast-cover-{{ loop.index0 }};">
        {%- else -%}
          <img src="https://placehold.co/600x600?text=Podcast+Cover" alt="Cover art placeholder for {{ resource.title }}" style="view-transition-name: podcast-cover-{{ loop.index0 }};">
        {%- endif -%}
      </div>
      <div class="podcast-panel-content">
        <p class="resource-tag">{{ resource.tag }}</p>
        <h3 id="podcast-title-{{ loop.index0 }}">{{ resource.title }}</h3>
        <p>{{ resource.description }}</p>
        <p><a href="{{ resource.link }}" rel="noreferrer noopener" target="_blank">Listen to this podcast</a></p>
        {% if resource.favoriteEpisodes %}
          <h4>Favorite episodes</h4>
          <ul>
            {% for episode in resource.favoriteEpisodes %}
              {% if episode.link %}
                <li><a href="{{ episode.link }}" rel="noreferrer noopener" target="_blank">{{ episode.title }}</a></li>
              {% else %}
                <li>{{ episode.title }}</li>
              {% endif %}
            {% endfor %}
          </ul>
        {% endif %}
        <div class="podcast-panel-nav">
          <a href="#podcast-{{ prevIndex }}">Previous</a>
          <a href="#podcast-grid">Close</a>
          <a href="#podcast-{{ nextIndex }}">Next</a>
        </div>
      </div>
    </div>
  </section>
{% endfor %}

