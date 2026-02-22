/**
 * Command Bar - Global keyboard-driven command palette
 * Trigger with Cmd+K (Mac) or Ctrl+K (Windows/Linux)
 * 
 * Extensible architecture:
 * - Navigation commands (pages, blog posts)
 * - Future: theme toggle, search, custom actions
 */

class CommandBar {
	constructor() {
		this.isOpen = false;
		this.selectedIndex = 0;
		this.commands = [];
		this.filteredCommands = [];
		this.featuredPosts = [];
		this.featuredCaseStudies = [];
		this.corePages = [];
		this.inputElement = null;
		this.resultsContainer = null;
		this.modalElement = null;
		
		this.init();
	}

	init() {
		this.registerDefaultCommands();
		this.createModal();
		this.attachEventListeners();
	}

	/**
	 * Register commands from pre-indexed data (exhaustive index)
	 * Data is inlined at build time via base.njk: window.COMMAND_INDEX
	 * Includes all pages and blog posts, excluding drafts
	 */
	registerDefaultCommands() {
		// Get command index from global data inlined at build time
		const indexData = window.COMMAND_INDEX || { commands: [], featured: { posts: [], caseStudies: [], corePages: [] } };
		
		// Handle both old format (array) and new format (object with commands/featured)
		const commandsData = Array.isArray(indexData) ? indexData : (indexData.commands || []);
		const featuredData = Array.isArray(indexData) ? { posts: [], caseStudies: [], corePages: [] } : (indexData.featured || { posts: [], caseStudies: [], corePages: [] });

		// Convert data objects to commands with action methods
		this.commands = commandsData.map(cmd => ({
			name: cmd.name,
			description: cmd.description,
			action: () => this.navigate(cmd.url),
			thumbnail: cmd.thumbnail,
			thumbnailAlt: cmd.thumbnailAlt,
		}));

		// Store featured content
		this.featuredPosts = featuredData.posts.map(post => ({
			name: post.name,
			description: post.description,
			url: post.url,
			thumbnail: post.thumbnail,
			thumbnailAlt: post.thumbnailAlt,
			action: () => this.navigate(post.url),
		}));

		this.featuredCaseStudies = featuredData.caseStudies.map(cs => ({
			name: cs.name,
			description: cs.description,
			url: cs.url,
			thumbnail: cs.thumbnail,
			thumbnailAlt: cs.thumbnailAlt,
			action: () => this.navigate(cs.url),
		}));

		this.corePages = featuredData.corePages.map(page => ({
			name: page.name,
			description: page.description,
			url: page.url,
			action: () => this.navigate(page.url),
		}));

		this.filteredCommands = [...this.commands];
	}

	/**
	 * Smarter fuzzy search with word boundary awareness
	 * Prioritizes:
	 * 1. Exact substring matches
	 * 2. Matches at word starts (capital letters, after spaces)
	 * 3. Consecutive character matches
	 * 4. Scattered matches (lowest priority)
	 * 
	 * Examples:
	 * "book" → "Bookshelf" (score: 1000, substring)
	 * "a" → "About" (score: 90, word boundary)
	 * "a" → "Tags" (score: 10, scattered)
	 */
	fuzzySearch(query) {
		if (!query) {
			this.filteredCommands = [...this.commands];
			return;
		}

		const lowerQuery = query.toLowerCase();
		
		// Score each command and filter by minimum threshold
		const scored = this.commands.map(cmd => ({
			cmd,
			score: this.calculateFuzzyScore(cmd.name, lowerQuery)
		})).filter(item => item.score > 0);

		// Sort by score (highest first)
		scored.sort((a, b) => b.score - a.score);
		this.filteredCommands = scored.map(item => item.cmd);
		this.selectedIndex = 0;
	}

	/**
	 * Calculate fuzzy match score
	 * Higher score = better match
	 */
	calculateFuzzyScore(name, query) {
		const lowerName = name.toLowerCase();
		let queryIdx = 0;
		let score = 0;
		let consecutiveMatches = 0;

		// Check if query exists as a substring (highest priority)
		if (lowerName.includes(query)) {
			return 1000;
		}

		// Try to match characters in order with scoring
		for (let i = 0; i < lowerName.length && queryIdx < query.length; i++) {
			if (lowerName[i] === query[queryIdx]) {
				queryIdx++;
				consecutiveMatches++;

				// Bonus for matching at word boundaries (capitals or after space)
				const isWordBoundary = i === 0 || lowerName[i - 1] === ' ';
				if (isWordBoundary) {
					score += 100;
				} else if (consecutiveMatches > 1) {
					// Bonus for consecutive matches
					score += 50;
				} else {
					// Smaller bonus for scattered matches
					score += 10;
				}
			} else {
				consecutiveMatches = 0;
			}
		}

		// Only return a score if all query characters were matched
		return queryIdx === query.length ? score : 0;
	}

	/**
	 * Create the modal, input field, and results container
	 */
	createModal() {
		// Modal backdrop
		this.modalElement = document.createElement('div');
		this.modalElement.className = 'command-bar-modal';
		this.modalElement.innerHTML = `
			<div class="command-bar-overlay"></div>
			<div class="command-bar-container">
				<div class="command-bar-header">
					<span class="command-bar-icon search-icon">🔍</span>
					<div class="command-bar-input-wrapper">
						<input
							type="text"
							class="command-bar-input"
							placeholder="Search pages and posts…"
							aria-label="Search command palette"
						/>
						<button class="command-bar-clear" aria-label="Clear search" title="Clear">
							<span>✕</span>
						</button>
					</div>
					<button class="command-bar-close" aria-label="Close command palette" title="Close">
						<span>Close</span>
					</button>
				</div>
				<div class="command-bar-results"></div>
				<div class="command-bar-hints">
					<span><kbd>↑↓</kbd> Navigate</span>
					<span><kbd>↵</kbd> Select</span>
					<span><kbd>ESC</kbd> Close</span>
				</div>
			</div>
		`;
		document.body.appendChild(this.modalElement);

		this.inputElement = this.modalElement.querySelector('.command-bar-input');
		this.resultsContainer = this.modalElement.querySelector('.command-bar-results');
		this.clearButton = this.modalElement.querySelector('.command-bar-clear');
		this.closeButton = this.modalElement.querySelector('.command-bar-close');
	}

	/**
	 * Render filtered results list or featured content
	 */
	renderResults() {
		this.resultsContainer.innerHTML = '';
		const query = this.inputElement.value.trim();

		// Show featured content when there's no search query
		if (!query) {
			this.renderFeaturedContent();
			return;
		}

		// Show search results
		if (this.filteredCommands.length === 0) {
			this.resultsContainer.innerHTML = '<div class="command-bar-empty">No results found</div>';
			return;
		}

		this.filteredCommands.forEach((cmd, idx) => {
			const item = document.createElement('div');
			item.className = `command-bar-item ${idx === this.selectedIndex ? 'selected' : ''}`;
			item.innerHTML = `
				<h3 class="command-bar-item-name">${this.escapeHtml(cmd.name)}</h3>
				<p class="command-bar-item-description">${this.escapeHtml(cmd.description)}</p>
			`;
			item.addEventListener('click', () => {
				this.selectedIndex = idx;
				this.selectCurrent();
			});
			this.resultsContainer.appendChild(item);
		});

		this.scrollSelectedIntoView();
	}

	/**
	 * Render featured posts and case studies
	 */
	renderFeaturedContent() {
		// Latest Posts Section
		if (this.featuredPosts.length > 0) {
			const postsSection = document.createElement('div');
			postsSection.className = 'command-bar-section';

			const postsHeader = document.createElement('h2');
			postsHeader.className = 'command-bar-section-header';
			postsHeader.textContent = 'Latest Posts';
			postsSection.appendChild(postsHeader);

			this.featuredPosts.forEach((post, idx) => {
				const item = this.createFeaturedItem(post, idx);
				postsSection.appendChild(item);
			});

			const postsLink = document.createElement('a');
			postsLink.className = 'command-bar-section-link';
			postsLink.href = '/blog/';
			postsLink.textContent = 'View all posts →';
			postsSection.appendChild(postsLink);

			this.resultsContainer.appendChild(postsSection);
		}

		// Latest Case Studies Section
		if (this.featuredCaseStudies.length > 0) {
			const csSection = document.createElement('div');
			csSection.className = 'command-bar-section';

			const csHeader = document.createElement('h2');
			csHeader.className = 'command-bar-section-header';
			csHeader.textContent = 'Latest Case Studies';
			csSection.appendChild(csHeader);

			const startIdx = this.featuredPosts.length;
			this.featuredCaseStudies.forEach((cs, idx) => {
				const item = this.createFeaturedItem(cs, startIdx + idx);
				csSection.appendChild(item);
			});

			const caseStudiesLink = document.createElement('a');
			caseStudiesLink.className = 'command-bar-section-link';
			caseStudiesLink.href = '/tags/case-study/';
			caseStudiesLink.textContent = 'View all case studies →';
			csSection.appendChild(caseStudiesLink);

			this.resultsContainer.appendChild(csSection);
		}

		// Useful Pages Section
		if (this.corePages.length > 0) {
			const pagesSection = document.createElement('div');
			pagesSection.className = 'command-bar-section';

			const pagesHeader = document.createElement('h2');
			pagesHeader.className = 'command-bar-section-header';
			pagesHeader.textContent = 'Useful Pages';
			pagesSection.appendChild(pagesHeader);

			const startIdx = this.featuredPosts.length + this.featuredCaseStudies.length;
			this.corePages.forEach((page, idx) => {
				const item = document.createElement('div');
				item.className = `command-bar-item ${(startIdx + idx) === this.selectedIndex ? 'selected' : ''}`;
				item.innerHTML = `
					<h3 class="command-bar-item-name">${this.escapeHtml(page.name)}</h3>
					<p class="command-bar-item-description">${this.escapeHtml(page.description)}</p>
				`;
				item.addEventListener('click', () => {
					this.selectedIndex = startIdx + idx;
					this.selectCurrent();
				});
				pagesSection.appendChild(item);
			});

			this.resultsContainer.appendChild(pagesSection);
		}

		// Update total selectable items for keyboard navigation
		this.filteredCommands = [...this.featuredPosts, ...this.featuredCaseStudies, ...this.corePages];
		this.scrollSelectedIntoView();
	}

	/**
	 * Ensure the selected item is visible in the scroll viewport
	 */
	scrollSelectedIntoView() {
		const selected = this.resultsContainer.querySelector('.command-bar-item.selected');
		if (selected) {
			selected.scrollIntoView({ block: 'nearest' });
		}
	}

	/**
	 * Create a featured item with thumbnail
	 */
	createFeaturedItem(item, idx) {
		const elem = document.createElement('div');
		elem.className = `command-bar-item command-bar-featured-item ${idx === this.selectedIndex ? 'selected' : ''}`;
		
		const thumbnailHtml = item.thumbnail 
			? `<img src="${this.escapeHtml(item.thumbnail)}" alt="${this.escapeHtml(item.thumbnailAlt)}" class="command-bar-thumbnail" />`
			: '<div class="command-bar-thumbnail-placeholder"></div>';

		elem.innerHTML = `
			${thumbnailHtml}
			<div class="command-bar-item-content">
				<h3 class="command-bar-item-name">${this.escapeHtml(item.name)}</h3>
				<p class="command-bar-item-description">${this.escapeHtml(item.description)}</p>
			</div>
		`;
		
		elem.addEventListener('click', () => {
			this.selectedIndex = idx;
			this.selectCurrent();
		});
		
		return elem;
	}

	/**
	 * Open the command palette
	 */
	open() {
		this.isOpen = true;
		this.modalElement.classList.add('open');
		this.inputElement.focus();
		this.selectedIndex = 0;
		this.renderResults();
	}

	/**
	 * Close the command palette
	 */
	close() {
		this.isOpen = false;
		this.modalElement.classList.remove('open');
		this.inputElement.value = '';
		this.filteredCommands = [...this.commands];
		this.clearButton.classList.remove('visible');
	}

	/**
	 * Execute the selected command
	 */
	selectCurrent() {
		if (this.filteredCommands[this.selectedIndex]) {
			const cmd = this.filteredCommands[this.selectedIndex];
			this.close();
			cmd.action();
		}
	}

	/**
	 * Navigate to a page/post
	 */
	navigate(url) {
		window.location.href = url;
	}

	/**
	 * HTML escape for safe rendering
	 */
	escapeHtml(text) {
		const div = document.createElement('div');
		div.textContent = text;
		return div.innerHTML;
	}

	/**
	 * Attach keyboard and UI event listeners
	 */
	attachEventListeners() {
		// Global keyboard shortcut: Cmd+K or Ctrl+K
		document.addEventListener('keydown', (e) => {
			if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
				e.preventDefault();
				if (this.isOpen) {
					this.close();
				} else {
					this.open();
				}
			}
		});

		// Nav trigger button
		const navTrigger = document.getElementById('command-bar-trigger');
		if (navTrigger) {
			navTrigger.addEventListener('click', (e) => {
				e.preventDefault();
				this.open();
			});
		}

		// Keyboard navigation within the modal
		this.inputElement.addEventListener('keydown', (e) => {
			switch (e.key) {
				case 'ArrowDown':
					e.preventDefault();
					this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredCommands.length - 1);
					this.renderResults();
					break;
				case 'ArrowUp':
					e.preventDefault();
					this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
					this.renderResults();
					break;
				case 'Enter':
					e.preventDefault();
					this.selectCurrent();
					break;
				case 'Escape':
					e.preventDefault();
					this.close();
					break;
			}
		});

		// Search/filter as user types
		this.inputElement.addEventListener('input', (e) => {
			this.fuzzySearch(e.target.value);
			this.renderResults();
			// Show/hide clear button based on input
			if (e.target.value.length > 0) {
				this.clearButton.classList.add('visible');
			} else {
				this.clearButton.classList.remove('visible');
			}
		});

		// Clear button
		this.clearButton.addEventListener('click', () => {
			this.inputElement.value = '';
			this.fuzzySearch('');
			this.renderResults();
			this.clearButton.classList.remove('visible');
			this.inputElement.focus();
		});

		// Close button
		this.closeButton.addEventListener('click', () => this.close());

		// Close when clicking backdrop
		const overlay = this.modalElement.querySelector('.command-bar-overlay');
		overlay.addEventListener('click', () => this.close());
	}
}

// Initialize command bar when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
	new CommandBar();
});
