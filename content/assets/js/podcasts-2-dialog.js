(() => {
  if (!("HTMLDialogElement" in window)) return;

  document.documentElement.classList.add("podcasts-enhanced");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  const canTransition =
    "startViewTransition" in document && !prefersReducedMotion.matches;

  /** One shared name: grid card ↔ dialog panel */
  const CARD = "podcast-card";

  const pageUrl = window.location.pathname + window.location.search;

  const syncHash = (dialog) => {
    history.replaceState(null, "", dialog ? `${pageUrl}#${dialog.id}` : pageUrl);
  };

  const getDialogFromHash = () => {
    const id = window.location.hash.slice(1);
    if (!id) return null;
    const dialog = document.getElementById(id);
    return dialog?.classList.contains("podcast-dialog") ? dialog : null;
  };

  const clearName = (el) => {
    if (!el) return;
    el.style.viewTransitionName = "none";
    el.style.removeProperty("view-transition-name");
  };

  const setCard = (el, on) => {
    if (!el) return;
    if (on) el.style.viewTransitionName = CARD;
    else clearName(el);
  };

  const tileForDialog = (dialog) => {
    if (!dialog?.id) return null;
    return document.querySelector(`[data-dialog-target="${dialog.id}"]`);
  };

  const panelForDialog = (dialog) => dialog?.querySelector(".podcast-panel");

  const clearAllCardNames = () => {
    document
      .querySelectorAll(".podcast-tile-trigger, .podcast-panel")
      .forEach(clearName);
  };

  /**
   * Open: tile card → panel
   * Close: panel → tile card
   * Switch: panel → panel
   */
  const runWithTransition = ({ before, update, after }) => {
    if (!canTransition) {
      before?.();
      update();
      after?.();
      return;
    }

    before?.();
    const transition = document.startViewTransition(() => {
      update();
    });

    transition.finished.finally(() => {
      after?.();
    });
  };

  const openDialog = (dialog) => {
    if (!dialog || dialog.open) return;
    const tile = tileForDialog(dialog);
    const panel = panelForDialog(dialog);

    runWithTransition({
      before: () => setCard(tile, true),
      update: () => {
        dialog.showModal();
        setCard(tile, false);
        setCard(panel, true);
      },
    });
    syncHash(dialog);
  };

  const closeDialog = (dialog) => {
    if (!dialog || !dialog.open) return;
    const tile = tileForDialog(dialog);
    const panel = panelForDialog(dialog);

    runWithTransition({
      before: () => setCard(panel, true),
      update: () => {
        dialog.close();
        setCard(panel, false);
        setCard(tile, true);
      },
      after: () => clearAllCardNames(),
    });
    syncHash(null);
  };

  const switchDialog = (currentDialog, targetDialog) => {
    if (!currentDialog || !targetDialog || currentDialog === targetDialog) return;
    const fromPanel = panelForDialog(currentDialog);
    const toPanel = panelForDialog(targetDialog);

    runWithTransition({
      before: () => setCard(fromPanel, true),
      update: () => {
        if (currentDialog.open) currentDialog.close();
        if (!targetDialog.open) targetDialog.showModal();
        setCard(fromPanel, false);
        setCard(toPanel, true);
      },
    });
    syncHash(targetDialog);
  };

  document.querySelectorAll("[data-dialog-target]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      const targetId = trigger.getAttribute("data-dialog-target");
      const dialog = targetId ? document.getElementById(targetId) : null;
      if (!dialog) return;
      event.preventDefault();
      openDialog(dialog);
    });
  });

  const navigateDialog = (dialog, direction) => {
    const navButtons = dialog.querySelectorAll(
      ".podcast-panel-nav-controls [data-dialog-nav]",
    );
    const button = direction === "prev" ? navButtons[0] : navButtons[1];
    if (!button) return;
    const targetId = button.getAttribute("data-dialog-nav");
    const targetDialog = targetId ? document.getElementById(targetId) : null;
    if (!targetDialog) return;
    switchDialog(dialog, targetDialog);
  };

  document.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    const dialog = document.querySelector(".podcast-dialog[open]");
    if (!dialog) return;

    const target = event.target;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      target?.isContentEditable
    ) {
      return;
    }

    event.preventDefault();
    navigateDialog(dialog, event.key === "ArrowLeft" ? "prev" : "next");
  });

  document.querySelectorAll(".podcast-dialog").forEach((dialog) => {
    dialog.querySelectorAll("[data-dialog-close]").forEach((button) => {
      button.addEventListener("click", () => closeDialog(dialog));
    });

    dialog.addEventListener("click", (event) => {
      const panel = dialog.querySelector(".podcast-panel");
      if (!panel) return;
      const rect = panel.getBoundingClientRect();
      const clickedInsidePanel =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!clickedInsidePanel) closeDialog(dialog);
    });

    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeDialog(dialog);
    });

    dialog
      .querySelectorAll(".podcast-panel-nav-controls [data-dialog-nav]")
      .forEach((button, index) => {
        button.addEventListener("click", () => {
          navigateDialog(dialog, index === 0 ? "prev" : "next");
        });
      });
  });

  const hashDialog = getDialogFromHash();
  if (hashDialog) openDialog(hashDialog);
})();

(() => {
  const filterRadios = document.querySelectorAll('input[name="podcast-filter"]');
  const tiles = document.querySelectorAll(".podcast-tile[data-tags]");
  if (!filterRadios.length || !tiles.length) return;

  filterRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const tag = radio.value;
      tiles.forEach((tile) => {
        if (tag === "all") {
          tile.hidden = false;
          return;
        }
        const tags = tile.dataset.tags ? tile.dataset.tags.split(",") : [];
        tile.hidden = !tags.includes(tag);
      });
    });
  });
})();
