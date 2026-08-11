/**
 * Just-in-time view-transition names for list ↔ post morphs.
 * Only the clicked card (and matching post header) are named — never the whole list.
 */
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const NAMES = {
	title: "post-title",
	description: "post-desc",
	image: "post-image",
};

function prefersReducedMotion() {
	return window.matchMedia(REDUCED_MOTION).matches;
}

function slugFromPath(pathname) {
	const parts = String(pathname || "")
		.split("/")
		.filter(Boolean);
	if (parts[0] === "blog" && parts[1]) return parts[1];
	return null;
}

function findCard(slug) {
	if (!slug) return null;
	const safe =
		typeof CSS !== "undefined" && CSS.escape ? CSS.escape(slug) : slug;
	return document.querySelector(`[data-vt-post="${safe}"]`);
}

function findPostHeader() {
	return document.querySelector("header.post-header[data-vt-post]");
}

function imageIn(root) {
	return (
		root.querySelector('[data-vt="image"]') ||
		root.querySelector(
			".featured-case-study-image img, picture img, img.thumbnail-nextprev",
		)
	);
}

function setNames(root, on) {
	if (!root) return [];

	const pairs = [
		[root.querySelector('[data-vt="title"]'), NAMES.title],
		[root.querySelector('[data-vt="description"]'), NAMES.description],
		[imageIn(root), NAMES.image],
	];

	const named = [];
	for (const [el, name] of pairs) {
		if (!el) continue;
		if (on) {
			el.style.viewTransitionName = name;
		} else {
			el.style.viewTransitionName = "none";
			el.style.removeProperty("view-transition-name");
		}
		named.push(el);
	}
	return named;
}

function clearNames(els) {
	els.forEach((el) => {
		el.style.viewTransitionName = "none";
		el.style.removeProperty("view-transition-name");
	});
}

function rootForOutbound(toSlug, fromSlug) {
	// List → post: name the card we're leaving toward
	if (toSlug) {
		const card = findCard(toSlug);
		if (card) return card;
	}
	// Post → anywhere: name the current post header
	if (fromSlug) {
		const header = findPostHeader();
		if (header) return header;
	}
	return null;
}

function rootForInbound(currentSlug, fromSlug) {
	// Arriving on a post: name the post header
	if (currentSlug) {
		const header = findPostHeader();
		if (header) return header;
		return findCard(currentSlug);
	}
	// Arriving on a list from a post: name the matching card
	if (fromSlug) return findCard(fromSlug);
	return null;
}

async function withNamedSnapshot(viewTransition, root) {
	const named = setNames(root, true);
	if (!named.length) return;
	try {
		await viewTransition.ready;
	} catch {
		// Transition skipped / timed out — still clear names for bfcache
	} finally {
		clearNames(named);
	}
}

window.addEventListener("pageswap", (e) => {
	if (!e.viewTransition || !e.activation?.entry) return;
	if (prefersReducedMotion()) return;

	const toSlug = slugFromPath(new URL(e.activation.entry.url).pathname);
	const fromSlug = slugFromPath(location.pathname);
	const root = rootForOutbound(toSlug, fromSlug);
	withNamedSnapshot(e.viewTransition, root);
});

window.addEventListener("pagereveal", (e) => {
	if (!e.viewTransition) return;
	if (prefersReducedMotion()) {
		e.viewTransition.skipTransition();
		return;
	}

	const activation = navigation?.activation;
	if (!activation?.entry) return;

	const currentSlug = slugFromPath(new URL(activation.entry.url).pathname);
	const fromSlug = activation.from
		? slugFromPath(new URL(activation.from.url).pathname)
		: null;
	const root = rootForInbound(currentSlug, fromSlug);
	withNamedSnapshot(e.viewTransition, root);
});
