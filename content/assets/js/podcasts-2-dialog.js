(() => {
  if (!("HTMLDialogElement" in window)) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const runWithTransition = (callback) => {
    if (!prefersReducedMotion.matches && "startViewTransition" in document) {
      document.startViewTransition(callback);
      return;
    }
    callback();
  };

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

  const openDialog = (dialog) => {
    if (!dialog || dialog.open) return;
    runWithTransition(() => dialog.showModal());
    syncHash(dialog);
  };

  const closeDialog = (dialog) => {
    if (!dialog || !dialog.open) return;
    runWithTransition(() => dialog.close());
    syncHash(null);
  };

  const switchDialog = (currentDialog, targetDialog) => {
    if (!currentDialog || !targetDialog || currentDialog === targetDialog) return;
    runWithTransition(() => {
      if (currentDialog.open) currentDialog.close();
      if (!targetDialog.open) targetDialog.showModal();
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
    const navButtons = dialog.querySelectorAll(".podcast-panel-nav-controls [data-dialog-nav]");
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

    dialog.querySelectorAll(".podcast-panel-nav-controls [data-dialog-nav]").forEach((button, index) => {
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
