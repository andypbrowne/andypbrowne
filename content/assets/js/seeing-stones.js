document.addEventListener("DOMContentLoaded", () => {
  const symbols = window.SEEING_STONES;
  if (!symbols?.length) return;

  const cloth = document.getElementById("seeing-stones-cloth");
  const emptyState = document.getElementById("seeing-stones-cloth-empty");
  const spillButton = document.getElementById("seeing-stones-spill");

  if (!cloth || !spillButton) return;

  const STONE_COUNT = 5;
  const svgCache = new Map();
  const randomBetween = (min, max) => Math.random() * (max - min) + min;

  const getSymbolSvg = async (src) => {
    if (!svgCache.has(src)) {
      const response = await fetch(src);
      const text = await response.text();
      const doc = new DOMParser().parseFromString(text, "image/svg+xml");
      svgCache.set(src, doc.documentElement);
    }

    return svgCache.get(src).cloneNode(true);
  };

  const getStoneSizePx = () => {
    const probe = document.createElement("div");
    probe.className = "seeing-stone";
    probe.setAttribute("aria-hidden", "true");
    probe.style.visibility = "hidden";
    probe.style.pointerEvents = "none";
    cloth.appendChild(probe);
    const size = probe.getBoundingClientRect().width;
    probe.remove();
    return size || 96;
  };

  const fallbackPositions = () => {
    const layouts = [
      { x: 22, y: 28 },
      { x: 50, y: 22 },
      { x: 78, y: 32 },
      { x: 35, y: 68 },
      { x: 68, y: 72 },
    ];

    return layouts.map((position, index) => ({
      ...symbols[Math.floor(Math.random() * symbols.length)],
      x: position.x,
      y: position.y,
      rotation: randomBetween(-35, 35),
      index,
    }));
  };

  const pickStones = () => {
    const { width, height } = cloth.getBoundingClientRect();
    const stoneSize = getStoneSizePx();
    const radius = stoneSize / 2;
    const padding = 6;
    const minDistance = stoneSize + 10;
    const maxAttempts = 120;
    const picks = [];

    for (let i = 0; i < STONE_COUNT; i += 1) {
      let placed = false;

      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const xPx = randomBetween(radius + padding, width - radius - padding);
        const yPx = randomBetween(radius + padding, height - radius - padding);
        const tooClose = picks.some((stone) => {
          const dx = stone.xPx - xPx;
          const dy = stone.yPx - yPx;
          return Math.hypot(dx, dy) < minDistance;
        });

        if (!tooClose) {
          picks.push({
            ...symbols[Math.floor(Math.random() * symbols.length)],
            x: (xPx / width) * 100,
            y: (yPx / height) * 100,
            xPx,
            yPx,
            rotation: randomBetween(-35, 35),
          });
          placed = true;
          break;
        }
      }

      if (!placed) {
        return fallbackPositions();
      }
    }

    return picks;
  };

  const renderStones = async (stones) => {
    cloth.querySelectorAll(".seeing-stone").forEach((node) => node.remove());
    if (emptyState) emptyState.hidden = true;

    await Promise.all(
      stones.map(async (stone, index) => {
        const token = document.createElement("div");
        token.className = "seeing-stone";
        token.style.setProperty("--x", `${stone.x}%`);
        token.style.setProperty("--y", `${stone.y}%`);
        token.style.setProperty("--rotation", `${stone.rotation}deg`);
        token.style.animationDelay = `${index * 60}ms`;

        const svg = await getSymbolSvg(stone.svg);
        svg.setAttribute("focusable", "false");
        token.appendChild(svg);
        cloth.appendChild(token);
      })
    );

    cloth.classList.remove("is-shaking");
    cloth.classList.add("has-stones");
    cloth.setAttribute("aria-label", "Five stones spilled on the cloth.");
  };

  const spill = () => {
    cloth.classList.add("is-shaking");
    spillButton.disabled = true;

    window.setTimeout(async () => {
      await renderStones(pickStones());
      spillButton.disabled = false;
    }, 450);
  };

  spillButton.addEventListener("click", spill);
});
