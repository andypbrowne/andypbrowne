---
title: Young Adult Author’s Website
description: A case study in sanity
thumbnail: assets/images/thumb-ya-author-16x9.avif
thumbnailAlt: Just a placeholder image that says FPO which means for  
date: 2025-02-08
tags:
  - case study
  - featured case study
  - post
draft: false
summary: Redesign of a website and improved editing experience for an author of Young Adult books.
responsibilities:
  - User Research
  - Interaction Design
  - Web Development
  - Project Management
key_outcomes:
  - Enhanced editor workflow
  - Engaged key audiences
  - Support future growth
project_link: https://rominagarber.com
---

{% include "_includes/components/case-study-metadata.njk" %}

Author Romina Garber needed a new website to support the launch of her new book series, *Wolves of No World*. Her existing WordPress site was outdated and made content updates difficult. Romina had a clear vision: she needed a more intuitive platform and a more professional website to promote her work effectively. 

The primary goal was to improve the website’s editing workflow. During the initial design discovery we also identified an opportunity to reach additional audiences like publicists, literary agents, bookstagrammers, and video bloggers. By focusing on these groups, we could refine the website’s content strategy to better align with their needs and Romina’s business goals. Measuring progress on these goals was essential. While finding perfect metrics isn’t always easy, taking the time to define them helped us clarify what truly mattered.

<figure>
  {% image "./hero-light.jpg", "A hero image of a female character with glowing star shaped eyes, detail of book information, and a grid of colors" %}
  <figcaption>Romina's website takes advantage of beautiful book cover illustrations. The book Lobizona features art by Daria Hlazatova.</figcaption>
</figure>

<aside>

<h2 style="font-size: var(--font-size-base);">Goals</h2>

- 10K+ add on Goodreads (5x increase)
- 7K+ instagram followers (2x increase)
- Lobizona top 10K on bn.com
- Starred review by major publication
- 500 total newsletter subscribers

</aside>

All of these goals have been achieved – though I can’t claim that the website deserves all of the credit. However, the website plays a key role in framing these objectives, serving as a vision and foundation. To see more about how I establish goals and start a new project you can read this post I wrote called [Kickoff](https://andypbrowne.com/blog/kickoff/). 

## Just enough research

With clear goals in in place, we needed to test our assumptions before jumping into design. We recognized the need for lightweight research. Romina and I collaborated to define research goals and a discussion guide. Having a structured guide made our user interviews more efficient. It kept notes organized and discussions productive in the interviews I conducted. The insights we gained were invaluable.

One particuarly surprising interview was with a vlogger. They described the specific info they look for about an author. To them it was a specific formula and they had a checklist. All this info needs to be gathered quickly when prepping for a video shoot and social media posts. I was impressed by the professionalism of this 16-year-old; they were running quite an operation.

By incorporating insights from this interview and other audiences, we approached the redesign with an emphasis on making key information about Romina and her books easily accessible. If you visit [the website](https://rominagarber.com/) today you will see prominent links to high-quality image downloads of the book covers, publisher information, and agency representation. Information that was once scattered– such as event details, exclusive content, or hidden extras, now has a dedicated home.


## A new platform

To support this content-first approach, we needed a platform to make updates effortless. This challenge turned out to be a great fit for [a platform called Sanity](https://www.sanity.io/). The relatively new tool allows us to manage content like structured data, making updates painless. It’s slick editing experience means we can add a book review or a profile link without worrying about layout or design. Romina commented herself on this new editing experience–


> #### *I understand why they call it Sanity, because using it gives me that, haha*.

<figure>
  {% image "./sanity-desk.jpg", "A content management system user interface showing a book entry being edited with a form" %}
  <figcaption>The Sanity content editing experience is very slick. It even works well on small mobile screens.</figcaption>
</figure>

I won’t dive too deep into the technical detail of Sanity. Its a specialized platform that isn’t for everyone. Our decision to use it was driven by the benefits of the editorial experience and a desire to try something new. 

<figure>
  {% image "./colors.jpg", "A screenshot of the Sanity desk that shows a color picking interface" %}
  <figcaption>A custom color picker component we built for the site.</figcaption>
</figure>

**Benefits of the platform**

1. **Separation of content and design** – The site’s content is managed independently from its look and feel. This makes updates as simple as filling out a form.
2. **Customizable features** – We can implement unique, editable elements. For example, Romina’s site automatically applies color themes sampled from her book covers, ensuring a cohesive visual identity across the site.
3. **Scalability** – The website hosts over 37 reviews and 89 press entries, all easily managed. Romina can control how many appear on the site and where they’re displayed, making the website a true content hub.
4. **Flexible content reuse** – Content only needs to be entered once but can appear in multiple places across the site. For example, a book’s description can show up on its individual page, in a press kit, and in a featured section without needing to be copied manually.
5. **Future-proof** – As Romina’s needs grow, the website can easily expand. Whether she wants to add new book series, integrate multimedia content, or build out an events calendar, Sanity provides a solid foundation for future updates without requiring major overhauls.

## Design decisions

The look and feel of Romina’s site was designed to be professional, highly usable, and accessible while reflecting her unique style. We aimed for a balance between simplicity, strong typography, and making the book covers the visual focus point.

<figure>
  {% image "./screenshot-moodboard.jpg", "A screenshot of a big grid of visual references" %}
  <figcaption>A graphics and typography moodboard. Also included are some marketing assets.</figcaption>
</figure>

### Moodboard and Competitive Analysis

To explore the visual direction, we created moodboards and conducted a competitive analysis. This helped us identify key elements like book blurbs, hero sections, and author events. Romina gravitated toward clean, easy-to-navigate layouts, which guided our design choices.

### Typography

We chose [Manuale](https://www.omnibus-type.com/fonts/manuale/), a typeface from Omnibus Type in Buenos Aires, designed for editorial use and long-form reading. It’s blend of contemporary and classic feel aligned with Romina’s sensibilities. The details of Manuale work great for body text and its distinctive elements add character to headlines. A fun coincidence—her *Wolves of No World* series features a main character named Manuela Azul, making this type choice even more fitting!

<figure>
  {% image "./colors-and-type.jpg", "A screenshot of color chips named and described along with examples of the fonts" %}
  <figcaption>Colors and typography represented as a style tile.</figcaption>
</figure>

To complement Manuale, we incorporated [IBM Plex Mono](https://www.ibm.com/plex/) for UI elements like navigation and downloads. Its monospaced structure provides contrast, improving clarity and usability. We used a variable version for faster load times, styled it with small-caps, and added the dynamic color schemes.  

### Color System

The site’s color palette is dynamic, automatically generating schemes based on book covers. These colors are named after thematic elements like moons, blood, earth, and zodiac signs, adding a rich, narrative-driven layer to the design. 

### Wireframes and Mockups

Following a structured design process, we first created grayscale wireframes to map out usability and content hierarchy before refining the visual details. This ensured a solid foundation before introducing full-color mockups.

<figure>
  {% image "./screenshot-block-wires.jpg", "A screenshot of many gray boxes and blue curvy lines connecting them" %}
  <figcaption>Block-level wireframes help work out usability and flows without being distracted by aesthetic choices.</figcaption>
</figure>

Figma played a crucial role in managing the color themes efficiently. By updating color codes in a few key places, we maintained the color system and accessible consistent contrast ratios throughout the site.

<figure>
  {% image "./screenshot-prototype.jpg", "A screenshot of many gray boxes and blue curvy lines connecting them" %}
  <figcaption>Block-level wireframes help work out usability and flows without being distracted by aesthetic choices.</figcaption>
</figure>

## Collaboration

As I mentioned earlier, Sanity is a technical platform, and I quickly realized that I didn’t have the skills to navigate all of its complexities on my own. Instead of seeing this as a setback, I embraced it as an opportunity to learn.

Sanity has a very active developer community on Slack. I posted a proposal for a project and quickly found a collaborator who was experienced with the platform and eager to teach. Together, we worked through content schemas, CMS customization, data structure integrations, web templates, and even carved out space for creative exploration.

My spirited collaborator, Peter, later landed a job at Sanity. I was even interviewed by one of it’s founders, Øyvind Rostad, as part of the hiring process. Recommending Peter for a developer relations role was easy – our project was well-organized, and his expertise was instrumentation to its success. A glimpse of that structure can be seen in the gantt chart project timeline you see pictured.

<figure>
{% image "./project-plan.png", "A project management timeline/gant chart. There is about 3 months of work schedule here." %}
  <figcaption>A project management timeline/gant chart. There is about 3 months of work schedule here.</figcaption>
</figure>

I don’t like to brag often, but when I do its about project management. We accomplished a lot in a short amount of time, finishing well ahead of our deadline – about two months before the book launch. 


## Some lessons learned

1. **Simplicity wins** - Early on, I put too much effort on creating a fancy hero element. The best solution was an illustration from one of the book covers. It fit the project at this stage.
2. **Balancing flexibility and reliability** – When we built this site, Sanity was still very young platform. While it’s great that the site still works after 5 years, but we had to go through a few updates and maintenance efforts. This a little less reliable than using a website building service like Squarespace. As with anything, there are tradeoffs.
3. **Bridging the gap between back-end and front-end** – I’m still refining my skills in data integration between the back and front end of structured websites like this. In the future, I’d like to find more efficient ways to handle this, making it easier to create highly customized yet simple-to-edit sites.
4. **The value of community and collaboration** – Reaching out to the Sanity developer community made a huge difference in the success of this project. Finding the right collaborator not only helped me learn but also accelerated our progress. It reinforced the idea that even in technical projects, building relationships and asking for help can be just as important as technical skills.
5. **Content strategy is just as important as design** – At the start, it was tempting to focus on visual elements and the technical build. However, what truly made this website effective was structuring content in a way that supported Romina’s goals helping her audiences quickly find what they needed. A well-thought-out content strategy is what gives a website long-term value. 

This project was an exciting mix of research, design, and technical problem-solving. The result is a flexible, scalable website that continues to serve Romina’s needs years later. Looking ahead, I’m excited to apply these lessons—especially around structured content and collaborative development to future projects.

## Notes:

- I didn’t get a chance to talk about some other cool features of the site like like the email template and the Netlify Forms integration that makes it easy for people to [subscribe to Romina’s newsletter.](https://rominagarber.com/newsletter/) I will save that for a future post. 
- [Sanity Community Digest](https://www.sanity.io/blog/community-digest-summer-edition-part-1#12074da22be1) - The site was a featured project in one of the first editions.
- [Research questions are not interview questions](https://www.muledesign.com/blog/research-questions-are-not-interview-questions) from Mule Design Blog. This is an article helps explain how to get the most benefit out of user research.

