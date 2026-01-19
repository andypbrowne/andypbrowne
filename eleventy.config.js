const { DateTime } = require("luxon");
const markdownItAnchor = require("markdown-it-anchor");

const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const readingTime = require('eleventy-plugin-reading-time');

module.exports = function(eleventyConfig) {
	// Copy the contents of the `public` folder to the output folder
	// For example, `./public/css/` ends up in `_site/css/`
	eleventyConfig.addPassthroughCopy({
		"./public/": "/",
		"./node_modules/prismjs/themes/prism-okaidia.css": "/css/prism-okaidia.css",
	});
	eleventyConfig.addPassthroughCopy({ "content/blog/coffee": "blog/coffee" });
	eleventyConfig.addPassthroughCopy('./content/assets');
	eleventyConfig.addPassthroughCopy('./public/css/webfonts.css');
	eleventyConfig.addPassthroughCopy("public/fonts");
	eleventyConfig.addPassthroughCopy("assets/js");
	eleventyConfig.addPlugin(readingTime);
	eleventyConfig.addShortcode("youtube", (videoURL, title) => {
		const url = new URL(videoURL);
		const id = url.searchParams.get("v");
		return `
	<iframe class="yt-shortcode" src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video player${
		  title ? ` for ${title}` : ""
		}" frameborder="0" allowfullscreen></iframe>
	`;
	  });
	
	// Run Eleventy when these files change:
	// https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets
	eleventyConfig.addWatchTarget("./public/css/");

	// Watch content images for the image pipeline.
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");
	eleventyConfig.addWatchTarget("assets/images/*.{svg,webp,png,jpeg}");

	// App plugins
	eleventyConfig.addPlugin(require("./eleventy.config.drafts.js"));
	eleventyConfig.addPlugin(require("./eleventy.config.images.js"));

	// Official plugins
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 }
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

	// Filters
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "dd LLLL yyyy");
	});

	eleventyConfig.addFilter('htmlDateString', (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("head", (array, n) => {
		if(!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if( n < 0 ) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Return all the tags used in a collection
	eleventyConfig.addFilter("getAllTags", collection => {
		let tagSet = new Set();
		for(let item of collection) {
			(item.data.tags || []).forEach(tag => tagSet.add(tag));
		}
		return Array.from(tagSet);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
	});

	// Get related posts based on shared tags
	eleventyConfig.addFilter("getRelatedPosts", function(collection, currentUrl, currentTags, limit = 3) {
		// Filter out the current post and posts without tags
		const otherPosts = collection.filter(post => {
			return post.url !== currentUrl && post.data.tags && post.data.tags.length > 0;
		});

		// Calculate relevance score based on shared tags
		const postsWithScores = otherPosts.map(post => {
			const postTags = post.data.tags || [];
			const sharedTags = currentTags.filter(tag => postTags.includes(tag));
			return {
				post: post,
				score: sharedTags.length
			};
		});

		// Sort by score (highest first) and return limited number
		return postsWithScores
			.filter(item => item.score > 0)
			.sort((a, b) => b.score - a.score)
			.slice(0, limit)
			.map(item => item.post);
	});

	eleventyConfig.addCollection("favoriteThings", function(collectionApi) {
		return collectionApi.getFilteredByTags("favorite-thing");
	});

	// Customize Markdown library settings:
	eleventyConfig.amendLibrary("md", mdLib => {
		mdLib.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.ariaHidden({
				placement: "after",
				class: "header-anchor",
				symbol: "#",
				ariaHidden: false,
			}),
			level: [1,2,3,4],
			slugify: eleventyConfig.getFilter("slugify")
		});
	});

	// Merge all arrays found under the `books` data object into one array.
  eleventyConfig.addFilter("mergeBookLists", function(booksObj) {
    if (!booksObj || typeof booksObj !== 'object') return [];
    let all = [];
    Object.values(booksObj).forEach(v => {
      if (Array.isArray(v)) all = all.concat(v);
      else if (v && typeof v === 'object') {
        // handle nested objects that may contain arrays
        Object.values(v).forEach(inner => { if (Array.isArray(inner)) all = all.concat(inner); });
      }
    });
    return all;
  });

  eleventyConfig.addFilter("titlesForTag", function(bookArray, tag) {
    if (!Array.isArray(bookArray)) return [];
    const key = String(tag || '').trim().toLowerCase();
    return bookArray
      .filter(book => {
        const tags = Array.isArray(book.tags) ? book.tags.map(t => String(t).trim().toLowerCase()) : [];
        return tags.includes(key);
      })
      .map(book => book.title || '')
      .filter(Boolean);
  });

  // Return an array of { tag, count } sorted alphabetically by tag.
  eleventyConfig.addFilter("allTagsSorted", function(bookArray) {
    if (!Array.isArray(bookArray)) return [];
    const counts = new Map();
    bookArray.forEach(book => {
      const tags = Array.isArray(book.tags) ? book.tags : [];
      tags.forEach(t => {
        const tag = String(t).trim().toLowerCase();
        if (!tag) return;
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });
    const tagObjs = Array.from(counts.entries()).map(([tag, count]) => ({ tag, count }));
    tagObjs.sort((a, b) => a.tag.localeCompare(b.tag));
    return tagObjs;
  });

	// extract all the tags from the book data
	eleventyConfig.addFilter("allTagsSorted", function(collection) {
    let tags = collection
      .map(book => book.tags || [])
      .flat()
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag);

    let uniqueTags = Array.from(new Set(tags));

    // Build array of {tag, count}
    let tagObjs = uniqueTags.map(tag => ({
      tag,
      count: tags.filter(t => t === tag).length
    }));

    // Sort by count descending, then alphabetically
    tagObjs.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

    return tagObjs;

	
  });

	// Features to make your build faster (when you need them)

	// If your passthrough copy gets heavy and cumbersome, add this line
	// to emulate the file copy on the dev server. Learn more:
	// https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

	// eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

	return {
		// Control which files Eleventy will process
		// e.g.: *.md, *.njk, *.html, *.liquid
		templateFormats: [
			"md",
			"njk",
			"html",
			"liquid"
		],

		// Pre-process *.md files with: (default: `liquid`)
		markdownTemplateEngine: "njk",

		// Pre-process *.html files with: (default: `liquid`)
		htmlTemplateEngine: "njk",

		// These are all optional:
		dir: {
			input: "content",         // default: "."
			includes: "../_includes",  // default: "_includes"
			data: "../_data",          // default: "_data"
			output: "_site"
		},

		// -----------------------------------------------------------------
		// Optional items:
		// -----------------------------------------------------------------

		// If your site deploys to a subdirectory, change `pathPrefix`.
		// Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

		// When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
		// it will transform any absolute URLs in your HTML to include this
		// folder name and does **not** affect where things go in the output folder.
		pathPrefix: "/",
	};
};
