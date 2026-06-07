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

  const openDialog = (dialog) => {
    if (!dialog || dialog.open) return;
    runWithTransition(() => dialog.showModal());
  };

  const closeDialog = (dialog) => {
    if (!dialog || !dialog.open) return;
    runWithTransition(() => dialog.close());
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
  });
})();
