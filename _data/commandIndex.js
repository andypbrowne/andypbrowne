/**
 * Command index for Cmd+K command palette
 * Provides exhaustive search across all pages and blog posts
 * Built at compile time from filesystem
 */

const fs = require('fs');
const path = require('path');
const frontMatter = require('gray-matter');

module.exports = async function() {
	// Core navigation pages
	const corePages = [
		{ name: 'Home', description: 'Go to home page', url: '/' },
		{ name: 'Archive', description: 'View all blog posts', url: '/blog/' },
		{ name: 'Bookshelf', description: 'Browse your book collection', url: '/bookshelf/' },
		{ name: 'About', description: 'Learn more about Andy', url: '/about/' },
		{ name: 'Tags', description: 'Explore posts by tag', url: '/tags/' },
		{ name: 'Likes', description: 'Saved articles and links', url: '/likes/' },
		{ name: 'Book Tags', description: 'Browse books by category', url: '/book-tags/' },
		{ name: 'CV', description: 'View resume/CV', url: '/cv/' },
	];

	// Read blog posts from filesystem
	const blogDir = path.join(__dirname, '../content/blog');
	let blogPosts = [];

	try {
		const entries = fs.readdirSync(blogDir, { withFileTypes: true });
		
		for (const entry of entries) {
			if (!entry.isDirectory()) continue;

			// Look for index.md or [name].md
			const indexPath = path.join(blogDir, entry.name, 'index.md');
			const altPath = path.join(blogDir, entry.name, `${entry.name}.md`);
			
			let mdPath = null;
			if (fs.existsSync(indexPath)) {
				mdPath = indexPath;
			} else if (fs.existsSync(altPath)) {
				mdPath = altPath;
			}

			if (!mdPath) continue;

			try {
				const content = fs.readFileSync(mdPath, 'utf-8');
				const { data } = frontMatter(content);

				// Skip drafts
				if (data.draft) continue;

				// Convert post slug to URL
				const slug = entry.name;
				const url = `/blog/${slug}/`;

				blogPosts.push({
					name: data.title || slug,
					description: data.description || 'Blog post',
					url: url,
				});
			} catch (error) {
				console.warn(`Failed to parse blog post ${entry.name}:`, error.message);
			}
		}
	} catch (error) {
		console.warn('Failed to read blog directory:', error.message);
	}

	// Combine and return sorted
	return [...corePages, ...blogPosts.sort((a, b) => a.name.localeCompare(b.name))];
};

