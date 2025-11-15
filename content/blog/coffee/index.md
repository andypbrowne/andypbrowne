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

<div class="vh">

Coffee to try based on these favorites (AI recomendations)

- [JBC](https://jbccoffeeroasters.com/product/mengeche-derso-natural/)
- [Browny Ethiopia Medium Roast](https://brownycoffee.com/products/ethiopia-medium-roast-coffee)
- [Coffee Man Honduras + Brasil Rise From the Ashes Blend](https://drinkcoffeeman.com/products/honduras-brazil-rise-from-the-ashes-blend-copy)  - This is too dark
- [La Cabra Coffee](https://us.lacabra.com/collections/coffee)
- [Sey El Diviso](https://www.seycoffee.com/products/el-diviso-gesha)
- [Onyx Coffee Lab Ethiopia Chelbessa](https://onyxcoffeelab.com/products/ethiopia-chelbessa)
- [Tim Wendelboe Finca Tamana Variedad Colombia](https://timwendelboe.no/product/finca-tamana-colombian-filter-coffe-2/)
- [Coffee Collective – Guatemala Finca Vista Hermosa](https://coffeecollective.dk/collections/filter-coffee)

</div>


￼