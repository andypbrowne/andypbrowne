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
		{ name: 'Tags', description: 'Explore posts by tag', url: '/tags/' },
		{ name: 'Bookshelf', description: 'Browse book collection', url: '/bookshelf/' },
		{ name: 'About', description: 'Learn more about Andy', url: '/about/' },
		{ name: 'CV', description: 'View resume/CV', url: '/cv/' },
		{ name: 'Likes', description: 'Saved articles and links', url: '/likes/' },
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

				// Check if it's a case study
				const tags = Array.isArray(data.tags) ? data.tags : [];
				const isCaseStudy = tags.some(tag => {
					const lowercaseTag = String(tag).toLowerCase();
					return lowercaseTag === 'case-study' || 
					       lowercaseTag === 'case study' || 
					       lowercaseTag === 'featured-case-study' ||
					       lowercaseTag === 'featured case study';
				});

				// Convert relative thumbnail paths to absolute paths
				let thumbnailPath = data.thumbnail || null;
				if (thumbnailPath && !thumbnailPath.startsWith('/')) {
					thumbnailPath = '/' + thumbnailPath;
				}

				blogPosts.push({
					name: data.title || slug,
					description: data.description || 'Blog post',
					url: url,
					date: data.date ? new Date(data.date).toISOString() : null,
					thumbnail: thumbnailPath,
					thumbnailAlt: data.thumbnailAlt || data.title || '',
					tags: tags,
					isCaseStudy: isCaseStudy,
				});
			} catch (error) {
				console.warn(`Failed to parse blog post ${entry.name}:`, error.message);
			}
		}
	} catch (error) {
		console.warn('Failed to read blog directory:', error.message);
	}

	// Sort by date (newest first)
	blogPosts.sort((a, b) => {
		if (!a.date && !b.date) return 0;
		if (!a.date) return 1;
		if (!b.date) return -1;
		return new Date(b.date) - new Date(a.date);
	});

	// Get latest posts and case studies for featured content
	const latestPosts = blogPosts.filter(p => !p.isCaseStudy).slice(0, 3);
	const latestCaseStudies = blogPosts.filter(p => p.isCaseStudy).slice(0, 3);

	// Return both the full command list and featured content
	return {
		commands: [...corePages, ...blogPosts],
		featured: {
			posts: latestPosts,
			caseStudies: latestCaseStudies,
			corePages: corePages,
		}
	};
};

