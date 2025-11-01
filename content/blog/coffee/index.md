---
title: Coffee
description: A list of local coffee for reference
thumbnail: assets/images/thumb-fpo.png
thumbnailAlt: for placeholder only
date: 2025-11-01
tags:
  - post
  - featured
  - coffee
draft: false
css: /assets/css/breathing.css
resources:
  - brand: Brooklyn Roasting Company
    name: Ethiopia Nura Korate
    origin: 
      - Ethiopia
    flavors: 
      - Lemon
      - Herb
      - Honey
    link: https://www.brooklynroasting.com/collections/coffees
    image: ./brooklyn-ethiopia-nura-korate.jpg
    alt: Can of coffee with a pic of a top down view of a coffee cup
  - brand: Stumptown
    name: Vivid Bloom
    origin: 
      - East Africa
      - Latin America
    flavors: 
      - orange blossom
      - cherry
      - chocolate
    link: https://www.stumptowncoffee.com/pages/vivid-bloom
    image: ./stumptown-vivid-bloom.jpg
    alt: 
---

<div class="grid"> {% for resource in resources %}
    <div class="card">
      <div class="card-body">
        {%- if (resource.image) -%}<a href="{{ resource.link }}" rel="norefer"><img class="square-image" src="{{ resource.image }}" alt="{{ resource.alt }}" width="800px"></a>{%- else -%}<div><img class="custom-size-images" src="https://placehold.co/600x400?text=Take+a+deep+breath"></div>{%- endif -%}
            <a href="{{ resource.link }}" rel="norefer"><h2> {{ resource.brand }} {{ resource.flavor }} </h2></a>
        </div>
        <div class="card-footer">
            <hr>
        </div>
    </div>{% endfor %}</div>