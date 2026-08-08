---
title: Coffee
description: A list of favorite coffee for reference
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
      - Colombia
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
      - Guatemala
    process: Washed
    roast: Medium
    flavors: 
      - Caramel
      - Cherry
      - Grapefruit
    link: https://www.yafabrooklyn.com/shop/p/huehuetenango
    image: ./yafa.jpg
    alt: A coffee bag with large vertial lettering
  - brand: La Flower
    name: Tradicional
    origin:
      - Columbia
    process: Washed
    roast: Medium
    flavors: 
      - Chocolate
      - Almonds
      - Citrus
    link: https://www.facebook.com/profile.php?id=100071510420975&sk=about
    image: ./la-flower.jpg
    alt: A coffee bag with large vertial lettering
  - brand: Flying Bean
    name: Negus
    origin:
      - Ethiopia
    process: Washed
    roast: Light
    flavors: 
      - Figs
      - Black Tea
      - Lemon
      - Cardomon
    link: https://flyingbeancoffee.com/product/negus/
    image: ./flying-bean.webp
    alt: Close-up of a label that describes the characteristics of the coffee and the region which is Yirgacheffe
  - brand: Oslo
    name: Golden Tree Blend
    origin:
      - Sumatra
      - Ethiopia
    process: 
    roast: 
    flavors: 
      - Apricot
      - Chocolate
      - Honey
    link: https://oslocoffee.com/collections/coffee/products/golden-tree-blend?variant=28780367413296
    image: ./oslo.jpg
    alt: A very plain looking coffee bag made of craft paper
  - brand: Counter Culture
    name: Apollo
    origin: 
     - Ethiopia
    process:
    roast: Medium
    flavors:
     - Citrus
     - Floral
     - Silk
    link: https://counterculturecoffee.com/products/apollo
    image: ./apollo.jpg
    alt: a sunny gradient printing on coffee bag
  - brand: Ace Coffee Outpost
    name: Primer
    origin:
      - Multi-origin
    process: 
    roast: Medium
    flavors:
      - Pecan
      - Baker's Chocolate
      - Hazelnut
    link: https://acecoffeeoutpost.com/collections/coffees/products/breakfast-blend
    image: ./ace.jpg
    alt: Kraft paper bag with bold Ace Coffee lettering
---

<div class="grid"> {% for resource in resources %}
    <div class="card">
      <div class="card-body">
        {%- if (resource.image) -%}<a href="{{ resource.link }}" rel="norefer"><img class="square-image" src="{{ resource.image }}" alt="{{ resource.alt }}" width="800px"></a>{%- else -%}<div><img class="custom-size-images" src="https://placehold.co/600x400?text=Take+a+deep+breath"></div>{%- endif -%}
            <a href="{{ resource.link }}" rel="norefer"><h3> {{ resource.brand }} {{ resource.name }} </h3></a>
            {%- if resource.origin %}
              <i>{{ resource.origin | join(', ') }}</i>
            {%- endif %}
            {%- if resource.process %}
              <span class="vh">{{ resource.process }}, </span>
            {%- endif %}
            {%- if resource.roast %}
              <span class="vh">{{ resource.roast }}</span>
            {%- endif %}
        </div>
        <div class="card-footer">
            {%- if resource.flavors %}
            <span class="vh">Flavors:</span>
                {%- for f in resource.flavors %}
                  <span class="resource-tag">{{ f }}</span>
                {%- endfor %}
              {%- endif %}
        </div>
        <hr>
    </div>{% endfor %}</div>

## Try next

Based on what's already on this list — bright Ethiopias, light–medium roasts, and approachable Brooklyn roasters — these are the five I’ll reach for next:

1. [Ace Coffee Outpost — Ethiopia Natural Yirgacheffe](https://acecoffeeoutpost.com/products/ethiopia-natural-yirgacheffe) — same roaster as Primer; fruit-forward Yirgacheffe energy
2. [Onyx — Ethiopia Chelbessa](https://onyxcoffeelab.com/products/ethiopia-chelbessa) — in the Apollo / Negus lane: citrus, floral, clean
3. [La Cabra — current washed Ethiopia or Colombia](https://us.lacabra.com/collections/coffee) — a step up in curiosity
4. [Coffee Collective — Guatemala Finca Vista Hermosa](https://coffeecollective.dk/collections/filter-coffee) — sweet citrus structure, close to Yafa Huehuetenango
5. [Sey — current washed Ethiopia](https://www.seycoffee.com/collections/coffee) — local, tea-like florals; El Diviso Gesha is a splurge

<div class="vh">

## Coffee recommendations (detailed)

Suggestions based on favorites in this post. Light–medium roast, bright and sweet, rarely heavy or dark.

### Taste profile

- **Bright, clean cups** — citrus, cherry, floral, tea-like notes (Apollo, Negus, Nura Korate, Vivid Bloom)
- **Ethiopia as a through-line** — half the list is Ethiopian or East African
- **Sweet structure without heaviness** — honey, almond, caramel, cocoa (Jumpstart, Toro, Yafa, Primer)
- **NYC/Brooklyn roasters** — Brooklyn Roasting, Yafa, Devoción, Oslo, Ace, Partners, Superlost

### Strong matches

**Ethiopia, washed, bright**

- [Onyx — Ethiopia Chelbessa](https://onyxcoffeelab.com/products/ethiopia-chelbessa)
- [Sey — El Diviso Gesha](https://www.seycoffee.com/products/el-diviso-gesha) — more floral/tea, pricier
- [Ace Coffee Outpost — Ethiopia Natural Yirgacheffe](https://acecoffeeoutpost.com/products/ethiopia-natural-yirgacheffe)
- [Counter Culture — Idido](https://counterculturecoffee.com/products/idido) — natural-leaning Ethiopian counterpart to Apollo

**Guatemala / Central America, sweet + citrus**

- [Coffee Collective — Guatemala Finca Vista Hermosa](https://coffeecollective.dk/collections/filter-coffee)
- [Devoción — single origins](https://www.devocion.com/collections/all-coffee)

**Fruit + structure (Supernatural lane)**

- [JBC — Mengeche Derso Natural](https://jbccoffeeroasters.com/product/mengeche-derso-natural/)
- [La Cabra](https://us.lacabra.com/collections/coffee) — washed Ethiopias and light Colombias

### Brooklyn-adjacent

- [Sey](https://www.seycoffee.com/collections/coffee) — washed Ethiopia or Colombia
- [Partners — other blends and singles](https://www.partnerscoffee.com/collections/coffee)
- [Superlost — other light Colombias](https://www.superlost.com/collections/coffee)
- [Oslo — single origins](https://oslocoffee.com/collections/coffee)

### More to explore

- [JBC — Mengeche Derso Natural](https://jbccoffeeroasters.com/product/mengeche-derso-natural/)
- [Browny — Ethiopia Medium Roast](https://brownycoffee.com/products/ethiopia-medium-roast-coffee)
- [Tim Wendelboe — Finca Tamana Variedad Colombia](https://timwendelboe.no/product/finca-tamana-colombian-filter-coffe-2/)

### Probably skip

- Dark or classic breakfast blends beyond Primer's nutty/chocolate lane
- [Coffee Man — Honduras + Brazil Rise From the Ashes](https://drinkcoffeeman.com/products/honduras-brazil-rise-from-the-ashes-blend-copy) — too dark
- Heavy anaerobic naturals unless experimenting beyond Supernatural

</div>