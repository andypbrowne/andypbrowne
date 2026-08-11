/**
 * Command Bar - Global keyboard-driven command palette
 * Trigger with Cmd+K (Mac) or Ctrl+K (Windows/Linux)
 *
 * Extensible architecture:
 * - Navigation commands (pages, blog posts)
 * - Future: theme toggle, search, custom actions
 */

const CMD_REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const CMD_VT = {
	overlay: "cmd-overlay",
	panel: "cmd-panel",
};

class CommandBar {
	constructor() {
		this.isOpen = false;
		this.selectedIndex = 0;
		this.commands = [];
		this.filteredCommands = [];
		this.featuredPosts = [];
		this.featuredCaseStudies = [];
		this.corePages = [];
		this.lastFocusedElement = null;
		this.inputElement = null;
		this.resultsContainer = null;
		this.modalElement = null;
		this._vtBusy = false;
		/** Native <dialog> closed while palette is open; restored on close. */
		this._suspendedDialog = null;

		this.init();
	}

	/**
	 * Replace, don't stack: one modal at a time.
	 * Quiet-close any open top-layer dialog so the palette can own focus/overlay.
	 * Hash (if any) is left alone so the page dialog can resume cleanly.
	 */
	suspendOpenDialog() {
		const dialog = document.querySelector("dialog[open]");
		if (!dialog) {
			this._suspendedDialog = null;
			return;
		}
		this._suspendedDialog = dialog;
		dialog.close();
		// Drop page-dialog VT names so they don't collide with palette chrome
		[dialog, ...dialog.querySelectorAll("*")].forEach((el) => {
			if (el.style?.viewTransitionName) this.clearVtName(el);
		});
	}

	resumeSuspendedDialog() {
		const dialog = this._suspendedDialog;
		this._suspendedDialog = null;
		if (!dialog || dialog.open || !dialog.isConnected) return;
		if (typeof dialog.showModal === "function") {
			dialog.showModal();
		}
	}

	canUseViewTransitions() {
		return (
			typeof document.startViewTransition === "function" &&
			!window.matchMedia(CMD_REDUCED_MOTION).matches
		);
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
		const indexData =
			window.COMMAND_INDEX || {
				commands: [],
				featured: { posts: [], caseStudies: [], corePages: [] },
			};

		const commandsData = Array.isArray(indexData)
			? indexData
			: indexData.commands || [];
		const featuredData = Array.isArray(indexData)
			? { posts: [], caseStudies: [], corePages: [] }
			: indexData.featured || { posts: [], caseStudies: [], corePages: [] };

		this.commands = commandsData.map((cmd) => ({
			name: cmd.name,
			description: cmd.description,
			url: cmd.url,
			action: () => this.navigate(cmd.url),
			thumbnail: cmd.thumbnail,
			thumbnailAlt: cmd.thumbnailAlt,
		}));

		this.featuredPosts = featuredData.posts.map((post) => ({
			name: post.name,
			description: post.description,
			url: post.url,
			thumbnail: post.thumbnail,
			thumbnailAlt: post.thumbnailAlt,
			action: () => this.navigate(post.url),
		}));

		this.featuredCaseStudies = featuredData.caseStudies.map((cs) => ({
			name: cs.name,
			description: cs.description,
			url: cs.url,
			thumbnail: cs.thumbnail,
			thumbnailAlt: cs.thumbnailAlt,
			action: () => this.navigate(cs.url),
		}));

		this.corePages = featuredData.corePages.map((page) => ({
			name: page.name,
			description: page.description,
			url: page.url,
			action: () => this.navigate(page.url),
		}));

		this.filteredCommands = [...this.commands];
	}

	fuzzySearch(query) {
		if (!query) {
			this.filteredCommands = [...this.commands];
			return;
		}

		const lowerQuery = query.toLowerCase();
		const scored = this.commands
			.map((cmd) => ({
				cmd,
				score: this.calculateFuzzyScore(cmd.name, lowerQuery),
			}))
			.filter((item) => item.score > 0);

		scored.sort((a, b) => b.score - a.score);
		this.filteredCommands = scored.map((item) => item.cmd);
		this.selectedIndex = 0;
	}

	calculateFuzzyScore(name, query) {
		const lowerName = name.toLowerCase();
		let queryIdx = 0;
		let score = 0;
		let consecutiveMatches = 0;

		if (lowerName.includes(query)) {
			return 1000;
		}

		for (let i = 0; i < lowerName.length && queryIdx < query.length; i++) {
			if (lowerName[i] === query[queryIdx]) {
				queryIdx++;
				consecutiveMatches++;

				const isWordBoundary = i === 0 || lowerName[i - 1] === " ";
				if (isWordBoundary) {
					score += 100;
				} else if (consecutiveMatches > 1) {
					score += 50;
				} else {
					score += 10;
				}
			} else {
				consecutiveMatches = 0;
			}
		}

		return queryIdx === query.length ? score : 0;
	}

	createModal() {
		this.modalElement = document.createElement("div");
		this.modalElement.className = "command-bar-modal";
		this.modalElement.innerHTML = `
			<div class="command-bar-overlay"></div>
			<div class="command-bar-container">
				<div class="command-bar-header">
					<span class="command-bar-icon search-icon">🔍</span>
					<div class="command-bar-input-wrapper">
						<input
							type="text"
							spellcheck="false"
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
				<div class="command-bar-live" aria-live="polite" aria-atomic="true"></div>
				<div class="command-bar-hints">
					<span><kbd>↑↓</kbd> Navigate</span>
					<span><kbd>↵</kbd> Select</span>
					<span><kbd>ESC</kbd> Close</span>
					<span><kbd>⌘</kbd>+ <kbd>K</kbd> Open/close </span>
				</div>
			</div>
		`;
		document.body.appendChild(this.modalElement);

		this.modalElement
			.querySelector(".command-bar-container")
			.setAttribute("role", "dialog");
		this.modalElement
			.querySelector(".command-bar-container")
			.setAttribute("aria-modal", "true");
		this.modalElement
			.querySelector(".command-bar-container")
			.setAttribute("aria-label", "Command palette");

		this.overlayElement = this.modalElement.querySelector(".command-bar-overlay");
		this.panelElement = this.modalElement.querySelector(".command-bar-container");
		this.inputElement = this.modalElement.querySelector(".command-bar-input");
		this.resultsContainer = this.modalElement.querySelector(".command-bar-results");
		this.liveRegion = this.modalElement.querySelector(".command-bar-live");
		this.clearButton = this.modalElement.querySelector(".command-bar-clear");
		this.clearButton.setAttribute("disabled", "true");
		this.closeButton = this.modalElement.querySelector(".command-bar-close");
	}

	clearVtName(el) {
		if (!el) return;
		el.style.viewTransitionName = "none";
		el.style.removeProperty("view-transition-name");
	}

	setChromeNames(on) {
		if (on) {
			if (this.overlayElement) {
				this.overlayElement.style.viewTransitionName = CMD_VT.overlay;
			}
			if (this.panelElement) {
				this.panelElement.style.viewTransitionName = CMD_VT.panel;
			}
		} else {
			this.clearVtName(this.overlayElement);
			this.clearVtName(this.panelElement);
		}
	}

	slugFromUrl(url) {
		try {
			const path = new URL(url, window.location.origin).pathname;
			const parts = path.split("/").filter(Boolean);
			if (parts[0] === "blog" && parts[1]) return parts[1];
		} catch {
			/* ignore */
		}
		return null;
	}

	/**
	 * Tag the selected result so cross-document VT can morph into the post header.
	 * Leave the palette open so pageswap can snapshot these elements.
	 */
	prepareNavigationMorph(itemEl, url) {
		if (!itemEl || !url || !this.canUseViewTransitions()) return;
		const slug = this.slugFromUrl(url);
		if (!slug) return;

		// Drop open/close chrome names so only the result ↔ post morph runs
		this.setChromeNames(false);

		itemEl.setAttribute("data-vt-post", slug);
		itemEl
			.querySelector(".command-bar-item-name")
			?.setAttribute("data-vt", "title");
		itemEl
			.querySelector(".command-bar-item-description")
			?.setAttribute("data-vt", "description");
		itemEl
			.querySelector(".command-bar-thumbnail")
			?.setAttribute("data-vt", "image");
	}

	renderResults() {
		this.resultsContainer.innerHTML = "";
		const query = this.inputElement.value.trim();

		if (!query) {
			this.liveRegion.textContent =
				"Featured content: Latest posts, case studies, and quick links";
			this.renderFeaturedContent();
			return;
		}

		if (this.filteredCommands.length === 0) {
			this.resultsContainer.innerHTML =
				'<div class="command-bar-empty">No results found</div>';
			this.liveRegion.textContent = `No results found for "${query}"`;
			return;
		}

		this.liveRegion.textContent = `${this.filteredCommands.length} result${
			this.filteredCommands.length !== 1 ? "s" : ""
		} found for "${query}"`;

		this.filteredCommands.forEach((cmd, idx) => {
			const item = document.createElement("div");
			item.className = `command-bar-item ${
				cmd.thumbnail ? "command-bar-featured-item" : ""
			} ${idx === this.selectedIndex ? "selected" : ""}`;
			item.setAttribute("tabindex", "0");

			item.innerHTML = cmd.thumbnail
				? `<img src="${this.escapeHtml(cmd.thumbnail)}" alt="${this.escapeHtml(
						cmd.thumbnailAlt || "",
					)}" class="command-bar-thumbnail" />
					<div class="command-bar-item-content">
						<h3 class="command-bar-item-name">${this.escapeHtml(cmd.name)}</h3>
						<p class="command-bar-item-description">${this.escapeHtml(cmd.description)}</p>
					</div>`
				: `<h3 class="command-bar-item-name">${this.escapeHtml(cmd.name)}</h3>
					<p class="command-bar-item-description">${this.escapeHtml(cmd.description)}</p>`;

			item.addEventListener("click", () => {
				this.selectedIndex = idx;
				this.selectCurrent();
			});
			item.addEventListener("keydown", (e) => {
				if (e.key === "Enter") {
					e.preventDefault();
					this.selectedIndex = idx;
					this.selectCurrent();
				}
			});
			this.resultsContainer.appendChild(item);
		});

		this.scrollSelectedIntoView();
	}

	renderFeaturedContent() {
		if (this.featuredPosts.length > 0) {
			const postsSection = document.createElement("div");
			postsSection.className = "command-bar-section";

			const postsHeader = document.createElement("h2");
			postsHeader.className = "command-bar-section-header";
			postsHeader.textContent = "Latest Posts";
			postsSection.appendChild(postsHeader);

			this.featuredPosts.forEach((post, idx) => {
				postsSection.appendChild(this.createFeaturedItem(post, idx));
			});

			const postsLink = document.createElement("a");
			postsLink.className = "command-bar-section-link";
			postsLink.href = "/blog/";
			postsLink.textContent = "View all posts →";
			postsSection.appendChild(postsLink);

			this.resultsContainer.appendChild(postsSection);
		}

		if (this.featuredCaseStudies.length > 0) {
			const csSection = document.createElement("div");
			csSection.className = "command-bar-section";

			const csHeader = document.createElement("h2");
			csHeader.className = "command-bar-section-header";
			csHeader.textContent = "Latest Case Studies";
			csSection.appendChild(csHeader);

			const startIdx = this.featuredPosts.length;
			this.featuredCaseStudies.forEach((cs, idx) => {
				csSection.appendChild(this.createFeaturedItem(cs, startIdx + idx));
			});

			const caseStudiesLink = document.createElement("a");
			caseStudiesLink.className = "command-bar-section-link";
			caseStudiesLink.href = "/tags/case-study/";
			caseStudiesLink.textContent = "View all case studies →";
			csSection.appendChild(caseStudiesLink);

			this.resultsContainer.appendChild(csSection);
		}

		if (this.corePages.length > 0) {
			const pagesSection = document.createElement("div");
			pagesSection.className = "command-bar-section";

			const pagesHeader = document.createElement("h2");
			pagesHeader.className = "command-bar-section-header";
			pagesHeader.textContent = "Quick Links";
			pagesSection.appendChild(pagesHeader);

			const startIdx =
				this.featuredPosts.length + this.featuredCaseStudies.length;
			this.corePages.forEach((page, idx) => {
				const item = document.createElement("div");
				item.className = `command-bar-item ${
					startIdx + idx === this.selectedIndex ? "selected" : ""
				}`;
				item.setAttribute("tabindex", "0");
				item.innerHTML = `
					<h3 class="command-bar-item-name">${this.escapeHtml(page.name)}</h3>
					<p class="command-bar-item-description">${this.escapeHtml(page.description)}</p>
				`;
				item.addEventListener("click", () => {
					this.selectedIndex = startIdx + idx;
					this.selectCurrent();
				});
				item.addEventListener("keydown", (e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						this.selectedIndex = startIdx + idx;
						this.selectCurrent();
					}
				});
				pagesSection.appendChild(item);
			});

			this.resultsContainer.appendChild(pagesSection);
		}

		this.filteredCommands = [
			...this.featuredPosts,
			...this.featuredCaseStudies,
			...this.corePages,
		];
		this.scrollSelectedIntoView();
	}

	scrollSelectedIntoView() {
		const selected = this.resultsContainer.querySelector(
			".command-bar-item.selected",
		);
		if (selected) {
			selected.scrollIntoView({ block: "nearest" });
		}
	}

	createFeaturedItem(item, idx) {
		const elem = document.createElement("div");
		elem.className = `command-bar-item command-bar-featured-item ${
			idx === this.selectedIndex ? "selected" : ""
		}`;
		elem.setAttribute("tabindex", "0");

		const thumbnailHtml = item.thumbnail
			? `<img src="${this.escapeHtml(item.thumbnail)}" alt="${this.escapeHtml(
					item.thumbnailAlt,
				)}" class="command-bar-thumbnail" />`
			: '<div class="command-bar-thumbnail-placeholder"></div>';

		elem.innerHTML = `
			${thumbnailHtml}
			<div class="command-bar-item-content">
				<h3 class="command-bar-item-name">${this.escapeHtml(item.name)}</h3>
				<p class="command-bar-item-description">${this.escapeHtml(item.description)}</p>
			</div>
		`;

		elem.addEventListener("click", () => {
			this.selectedIndex = idx;
			this.selectCurrent();
		});
		elem.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				this.selectedIndex = idx;
				this.selectCurrent();
			}
		});

		return elem;
	}

	applyOpen() {
		this.isOpen = true;
		this.lastFocusedElement = document.activeElement;
		this.modalElement.classList.add("open");
		this.setChromeNames(true);
		this.inputElement.focus();
		this.selectedIndex = 0;
		this.renderResults();
		this.modalElement.addEventListener("keydown", this.handleFocusTrap);
	}

	applyClose() {
		this.isOpen = false;
		this.modalElement.classList.remove("open");
		this.setChromeNames(false);
		this.inputElement.value = "";
		this.filteredCommands = [...this.commands];
		this.clearButton.classList.remove("visible");
		this.clearButton.setAttribute("disabled", "true");
		this.modalElement.removeEventListener("keydown", this.handleFocusTrap);
		if (this.lastFocusedElement && this.lastFocusedElement.focus) {
			this.lastFocusedElement.focus();
		}
	}

	open() {
		if (this.isOpen || this._vtBusy) return;

		this.suspendOpenDialog();

		if (this.canUseViewTransitions()) {
			this.modalElement.classList.remove("use-css-anim");
			this._vtBusy = true;
			const transition = document.startViewTransition(() => {
				this.applyOpen();
			});
			transition.finished.finally(() => {
				this._vtBusy = false;
			});
			return;
		}

		this.modalElement.classList.add("use-css-anim");
		this.applyOpen();
	}

	close() {
		if (!this.isOpen || this._vtBusy) return;

		if (this.canUseViewTransitions()) {
			this.setChromeNames(true);
			this._vtBusy = true;
			const transition = document.startViewTransition(() => {
				this.applyClose();
			});
			transition.finished.finally(() => {
				this._vtBusy = false;
				this.setChromeNames(false);
				// After palette is fully gone — restore the page dialog
				this.resumeSuspendedDialog();
			});
			return;
		}

		this.applyClose();
		this.resumeSuspendedDialog();
	}

	handleFocusTrap = (e) => {
		if (e.key !== "Tab") return;

		const focusable = this.getFocusableElements();
		if (focusable.length === 0) return;

		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		const isShift = e.shiftKey;
		const active = document.activeElement;

		if (isShift && active === first) {
			e.preventDefault();
			last.focus();
			return;
		}

		if (!isShift && active === last) {
			e.preventDefault();
			first.focus();
		}
	};

	getFocusableElements() {
		const selectors = [
			"a[href]",
			"button:not([disabled])",
			"input:not([disabled])",
			'[tabindex]:not([tabindex="-1"])',
		];

		return Array.from(
			this.modalElement.querySelectorAll(selectors.join(",")),
		).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
	}

	selectCurrent() {
		if (!this.filteredCommands[this.selectedIndex]) return;
		const cmd = this.filteredCommands[this.selectedIndex];
		const selected = this.resultsContainer.querySelector(
			".command-bar-item.selected",
		);
		// Keep palette open so pageswap can snapshot the selected row
		this.prepareNavigationMorph(selected, cmd.url);
		cmd.action();
	}

	navigate(url) {
		// Leaving the page — don't resume a dialog on unload
		this._suspendedDialog = null;
		window.location.href = url;
	}

	escapeHtml(text) {
		const div = document.createElement("div");
		div.textContent = text;
		return div.innerHTML;
	}

	attachEventListeners() {
		document.addEventListener("keydown", (e) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				if (this.isOpen) {
					this.close();
				} else {
					this.open();
				}
			}
		});

		const navTrigger = document.getElementById("command-bar-trigger");
		if (navTrigger) {
			navTrigger.addEventListener("click", (e) => {
				e.preventDefault();
				this.open();
			});
		}

		this.inputElement.addEventListener("keydown", (e) => {
			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					this.selectedIndex = Math.min(
						this.selectedIndex + 1,
						this.filteredCommands.length - 1,
					);
					this.renderResults();
					break;
				case "ArrowUp":
					e.preventDefault();
					this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
					this.renderResults();
					break;
				case "Enter":
					e.preventDefault();
					this.selectCurrent();
					break;
				case "Escape":
					e.preventDefault();
					this.close();
					break;
			}
		});

		this.inputElement.addEventListener("input", (e) => {
			this.fuzzySearch(e.target.value);
			this.renderResults();
			if (e.target.value.length > 0) {
				this.clearButton.classList.add("visible");
				this.clearButton.removeAttribute("disabled");
			} else {
				this.clearButton.classList.remove("visible");
				this.clearButton.setAttribute("disabled", "true");
			}
		});

		this.clearButton.addEventListener("click", () => {
			this.inputElement.value = "";
			this.fuzzySearch("");
			this.renderResults();
			this.clearButton.classList.remove("visible");
			this.clearButton.setAttribute("disabled", "true");
			this.inputElement.focus();
		});

		this.closeButton.addEventListener("click", () => this.close());

		this.overlayElement.addEventListener("click", () => this.close());
	}
}

document.addEventListener("DOMContentLoaded", () => {
	new CommandBar();
});
