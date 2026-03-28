---
title: Podcasts 2
description: post description
thumbnail: assets/images/thumb-fpo.png
thumbnailAlt: Just a placeholder image that says FPO which means for  
date: 2029-08-27
tags:
  - post
  - featured
draft: true
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
---

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

