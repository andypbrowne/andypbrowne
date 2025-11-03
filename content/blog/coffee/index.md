---
title: Coffee
description: A list of local coffee for reference
thumbnail: assets/images/thumb-coffee.jpg
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
    process: 
    roast: 
    flavors: 
      - orange blossom
      - cherry
      - chocolate
    link: https://www.stumptowncoffee.com/pages/vivid-bloom
    image: ./stumptown-vivid-bloom.jpg
    alt: Coffee bag with blooming cherry blossom tree illustration
  - brand: Superlost
    name: Supernatural
    origin:
      - Columbia
    process: Carbonic Maceration Natural
    roast: Light
    flavors: 
      - red berries
      - cocoa
      - lemon
    link: https://www.superlost.com/products/supernatural
    image: ./superlost.jpg
    alt: A radical and fancifal illustration of a tiger
  - brand: Partners
    name: Jumpstart
    origin:
      - Honduras
      - Brazil
    process: Washed and Natural
    roast: medium light
    flavors: 
      - Almond
      - Caramel
      - Poached Pear
    link: https://www.partnerscoffee.com/products/jumpstart
    image: ./partners.jpg
    alt: A bright and simple bag of coffee
  - brand: Devoción
    name: Toro
    origin:
      - Columbia
    process: Washed
    roast:
    flavors: 
      - Cocoa
      - Vanilla
      - Cherry
      - Almond
    link: https://www.devocion.com/products/house-blend-coffee-toro
    image: ./toro.jpg
    alt: A earth toned and flat bag of coffee
  - brand: Yafa
    name: Huehuetenango
    origin:
      - Guatema
    process: Washed
    roast: Medium
    flavors: 
      - Caramel
      - Cherry
      - Grapefruit
    link: https://www.yafabrooklyn.com/shop/p/huehuetenango
    image: ./yafa.jpg
    alt: A coffee bag with large vertial lettering
---

<div class="grid"> {% for resource in resources %}
    <div class="card">
      <div class="card-body">
        {%- if (resource.image) -%}<a href="{{ resource.link }}" rel="norefer"><img class="square-image" src="{{ resource.image }}" alt="{{ resource.alt }}" width="800px"></a>{%- else -%}<div><img class="custom-size-images" src="https://placehold.co/600x400?text=Take+a+deep+breath"></div>{%- endif -%}
            <a href="{{ resource.link }}" rel="norefer"><h3> {{ resource.brand }} {{ resource.name }} </h3></a>
            {%- if resource.origin %}
              <i>{{ resource.origin | join(', ') }}</i>
            {%- endif %}
        </div>
        <div class="card-footer">
            {%- if resource.flavors %}
                {%- for f in resource.flavors %}
                  <span class="resource-tag">{{ f }}</span>
                {%- endfor %}
              {%- endif %}
        </div>
        <hr>
    </div>{% endfor %}</div>