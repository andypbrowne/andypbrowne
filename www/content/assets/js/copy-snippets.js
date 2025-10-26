document.addEventListener("DOMContentLoaded", () => {

  const buttons = document.querySelectorAll(".copy-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const snippetId = button.getAttribute("data-snippet-id");
      console.log(`Button clicked for snippet ID: ${snippetId}`);

      const snippet = document.getElementById(snippetId);
      if (snippet) {
        const textToCopy = snippet.textContent;
        console.log(`Text to copy: ${textToCopy}`);

        navigator.clipboard.writeText(textToCopy).then(() => {
          // Show a temporary message near the button
          const message = document.createElement("span");
          message.textContent = "Copied!";
          message.style.marginLeft = "8px";
          message.style.color = "green";
          message.style.fontSize = "0.9rem";

          button.parentNode.appendChild(message);

          // Remove the message after 2 seconds
          setTimeout(() => {
            message.remove();
          }, 3000);
        }).catch((err) => {
          console.error("Failed to copy text: ", err);
        });
      } else {
        console.error(`Snippet with ID ${snippetId} not found`);
      }
    });
  });
});