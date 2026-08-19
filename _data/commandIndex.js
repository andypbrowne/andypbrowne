/**
 * Command index for Cmd+K command palette
 * Provides exhaustive search across all pages and blog posts
 * Built at compile time from filesystem
 */

const fs = require('fs');
const path = require('path');
const frontMatter = require('gray-matter');
const slugifyTitle = require('@11ty/eleventy/src/Filters/Slugify');

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

	const bookLists = [
		{ file: '2026bookList.json', section: '2026', label: '2026' },
		{ file: '2025bookList.json', section: '2025', label: '2025' },
		{ file: '2024bookList.json', section: '2024', label: '2024' },
		{ file: '2023bookList.json', section: '2023', label: '2023' },
		{ file: '2022bookList.json', section: '2022', label: '2022' },
		{ file: '2019bookList.json', section: '2019-2021', label: '2019 to 2021' },
		{ file: '2016bookList.json', section: '2016-2018', label: '2016 to 2018' },
		{ file: '0000bookList.json', section: 'older', label: 'Older Notable Reads' },
	];

	const booksDir = path.join(__dirname, 'books');
	const books = [];

	for (const list of bookLists) {
		const listPath = path.join(booksDir, list.file);
		if (!fs.existsSync(listPath)) continue;

		try {
			const entries = JSON.parse(fs.readFileSync(listPath, 'utf-8'));
			if (!Array.isArray(entries)) continue;

			for (const book of entries) {
				if (!book || !book.title) continue;
				const id = `book-${list.section}-${slugifyTitle(book.title)}`;
				books.push({
					name: book.title,
					author: book.author || '',
					description: book.author
						? `${book.author} · ${list.label}`
						: list.label,
					url: `/bookshelf/?tag=all&status=all&group=1#${id}`,
				});
			}
		} catch (error) {
			console.warn(`Failed to parse book list ${list.file}:`, error.message);
		}
	}

	// Return both the full command list and featured content
	return {
		commands: [...corePages, ...blogPosts],
		books,
		featured: {
			posts: latestPosts,
			caseStudies: latestCaseStudies,
			corePages: corePages,
		}
	};
};

