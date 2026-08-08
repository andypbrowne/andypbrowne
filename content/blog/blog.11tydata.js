module.exports = {
	tags: [
		"posts"
	],
	"layout": "layouts/post.njk",
	// Always preprocess with Nunjucks, then Markdown.
	// Do not use `templateEngineOverride: njk` alone — that skips Markdown.
	templateEngineOverride: "njk,md",
};
