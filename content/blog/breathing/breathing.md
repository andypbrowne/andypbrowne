---
title: Breathing
description: A group of resources to help form healthy habits
thumbnail: assets/images/thumb-breath.jpg
thumbnailAlt: a collage of image thumbnails and one says breath distinctly
date: 2024-01-01
tags:
  - post
  - featured
draft: false
css: /assets/css/breathing.css
resources:
  - title: Breath by James Nestor
    image: "https://m.media-amazon.com/images/I/71gxuHqAF-L._SY522_.jpg"
    alt: Book cover where the title "Breath is evaporating
    description: An exploration of the science, history, and cultural practices surrounding breathing, revealing its profound impact on our health, well-being, and overall quality of life.
    tag: book
  - title: Science of Breath by Swami Rama
    image: "https://m.media-amazon.com/images/I/41Rg9fnBo1L._SY445_SX342_.jpg"
    alt: An old-school book cover with an image of a nose
    description: Blends Eastern philosophy with Western scientific principles, providing a holistic understanding of the breath's influence on health, vitality, and connection to self.
    link: "https://shop.himalayaninstitute.org/products/science-of-breath"
    tag: book
  - title: Body Electric Series
    image: "https://media.npr.org/assets/img/2023/10/03/wide-crop_smaller-size_wide-3b69d8656a0df59c57282aecec17f1f05909124c.jpg"
    alt: The classic image of davinci but made with a texture of circuts
    description: From TED Radio Hour a 6-part investigation and interactive project to understand the impact of your tech on your body … and how to live better with your devices.
    link: "https://www.npr.org/series/1199526213/body-electric"
    tag: podcast
  - title: 4-7-8 Breathing Technique
    image: "https://i.ytimg.com/vi/p8fjYPC-k2k/maxresdefault.jpg"
    alt: A man with a beard sitting a relaxing
    description: Learn a powerful relaxation technique as demonstrated by Dr. Weil. A daily practice that can bring great calmness to the body.
    link: "https://www.youtube.com/watch?v=p8fjYPC-k2k"
    tag: video
  - title: 4-7-8 Breathing
    image: "https://s3-alpha.figma.com/hub/file/2844256729/4a84bb31-0cd4-4a21-aa85-555cfab8961f-cover.png"
    alt: a stylized graphic with vector waves
    description: A figma prototype that provides a guiding animation of a breathing technique
    link: "https://www.figma.com/community/file/1039811396080515722"
    tag: interactive
  - title: Revealing the Secrets of Tibetan Inner Fire Meditation
    image: "https://lirp.cdn-website.com/013c49cb/dms3rep/multi/opt/himalayas-g188aeff57_1280-1920w.jpg"
    alt: Snow capped mountains with a line of tibetan streamers in foreground
    description: A post about the meditation practice of Inner Fire Meditation (Tummo). It reveals instructions for this secret practice that are said to improve concentration, health, open the chakras, and cultivate bliss and confidence.
    link: "https://www.thewayofmeditation.com.au/revealing-the-secrets-of-tibetan-inner-fire-meditation"
    tag: article
  - title: Breathwork Bay Area
    image: "https://secure.meetupstatic.com/photos/event/3/3/7/d/clean_510373181.webp"
    alt: Mountains fire in an icy blue color
    description: Twice-weekly free breathwork sessions
    link: "https://www.meetup.com/Wim-Hof-Method-Bay-Area/"
    tag: webinar

---

There is this happy side-effect when you read a book about health and breathing. For 300+ pages you become very conscious of your breathing patterns and end up getting very focused practice along the way. When we might find it difficult to form good habits – we can just consume more material and get on with it. 

This is a growing list of resources I’m gathering to help me form some healthy habits. 

This post will be updated with more resources. Submit a [pull request](https://github.com/andypbrowne/andypbrowne/blob/main/content/blog/breathing/breathing.md?plain=1) or contact me if you want to add anything else on breathing and health. 

&nbsp;
<div class="grid"> {% for resource in resources %}
    <div class="card">
      <div class="card-body">
        {%- if (resource.image) -%}<a href="{{ resource.link }}" rel="norefer"><img class="custom-size-images" src="{{ resource.image }}" alt="{{ resource.alt }}" width="150px"></a>{%- else -%}<div><img class="custom-size-images" src="https://placehold.co/600x400?text=Take+a+deep+breath"></div>{%- endif -%}
            <a href="{{ resource.link }}" rel="norefer"><h2> {{ resource.title }} </h2></a>
            {{ resource.description }}
        </div>
        <div class="card-footer">
            <div class="resource-tag">{{ resource.tag }}</div>
            <hr>
        </div>
    </div>{% endfor %}</div>