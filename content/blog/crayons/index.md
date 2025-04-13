---
title: Crayons
description: Using crayola crayon colors for creative projects
thumbnail: assets/images/thumb-crayons.png
thumbnailAlt: Just a placeholder image that says FPO which means for  
date: 2025-04-13
tags:
  - case study
  - post
  - featured
draft: false
summary: A design exploration focused on choosing color palettes using Crayola crayons as a creative foundation. Built a custom tool to display, sort, and filter 120 colors with the help of AI.
responsibilities:
  - Visual Discovery and Design Strategy
  - Front-End Development
  - AI-assisted Prototyping
key_outcomes:
  - Created a reusable color inspiration tool
  - Use of AI to support creative exploration
  - Developed original palettes with strong storytelling potential
project_link: https://crayons.andypbrowne.com/
---

{% include "_includes/components/case-study-metadata.njk" %}

Choosing a color palette for a design project can feel like a chaotic and unsystematic endeavor. Where do we even begin? Personally, I think visual discovery should be a quest – one that uncovers a good story. When a color palette has a narrative, it gives our design choices meaning, and that story becomes something we can share with clients when presenting our work. 

Let me give you a couple of examples. On this [author’s website](https://andypbrowne.com/blog/ya-author/) that I designed, we pulled colors from her book covers and named them after characters in her stories. In another project I created [a logo](https://www.dropbox.com/scl/fi/1bhopw3b1a0nhf89fyt2r/Logo-guide.pdf?rlkey=yk006d1knrbxl5ht640wtgdu1&st=1xkzqu3k&dl=0) for a friend’s business using a specific Austrian Red color to reflect the founder’s heritage. In both cases, the color choices weren’t just aesthetic – they had personal or narrative value.

## Exploring Colors

My own website does not have a good color story. So I went searching and found inspiration in Crayola crayons. Over 200 colors[1] have been produced by Crayola and they have great names.

But, how to explore them? Why not make [a little website](https://crayons.andypbrowne.com/) to automagically display, sort, and filter all the colors. I’ll try not to bore you with too many technical details – plus, full disclusure, I vibe coded most of it.

<figure>
  {% image "./crayons-website.png", "A screenshot of a website that shows user interface for filtering and sorting crayons" %}
  <figcaption>The crayons website provides a novel color discovery experience</figcaption>
</figure>

<aside>

<h2 style="font-size: var(--font-size-base);">Tools used</h2>

- **Graphics** - Vector SVGs drawn in Figma 
- **Data** - Borrowed from a github repository called Corpora[2]
- **Site** - Build with Eleventy and Nunjucks 
- **Vibes** - GitHub Copilot (because this was fun side-project and I’m not a javascript expert)

</aside>

Eleventy was a natural choice for me – I know it well, and it’s global data file support made it easy to display the crayons.  For the trickier parts, like filtering and sorting, I leaned on GitHub Copilot and the general vibe coding approach. 

<figure>
  {% image "./screenshot-github-copilot.png", "A screenshot of a chat with github copilot" %}
  <figcaption>What do you tell GitHub Copilot to get good responses</figcaption>
</figure>

I’ve used AI tools in the past for small things, but this is the first time I’ve used then this extensively. The filtering feature didn’t work right away, but Copilot helped me dubug the JavaScript.  It fixed some of the logic issues, and I handled a seperate bug involving an incorrect ID reference. One thing the AI did perfectly? Converting the hex codes to RGB and HSL color formats. This allows for better results when sorting by hue, brightness, or saturation.

Of course, AI tools have their quirks. I noticed a few classic hallucinations: like referencing a crayon color that didn’t exist in the dataset, or mislabeling IDs. But thats the nature of working with large language models – you still need to keep an eye out.

I also experimented with using multiple AI models. I turned to ChatGPT to help generate color palettes based on names and hex values. This is where things got fun. LLMs are suprisingly good at creative associations, and together we can up with names like *Mid-mod mood*, *Celestial haze*, and *Eldrich archives.*

In the end, the project was more than a color picker – it was a design exploration powered by crayons, curiosity, and a little help from AI.


## References
- [1] [List of Crayola crayon colors from Wikipedia](https://en.wikipedia.org/wiki/List_of_Crayola_crayon_colors)
- [2] [List of Crayola crayon standard colors from Patrick Rodriguez](https://github.com/dariusk/corpora/blob/master/data/colors/crayola.json) 


## To do
- Add color the wrappers of the crayons to better match the real thing.
- Design a feature that will allow visitors to create their own palettes.
- Figure out how to make the site perform better on mobile devices. A large number of SVGs are making things slow.
- Improve the sorting of the crayons based on Hue, saturation, or brightness. 