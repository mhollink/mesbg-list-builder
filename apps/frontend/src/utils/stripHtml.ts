export function stripHtml(html: string): string {
  const document = new DOMParser().parseFromString(html, "text/html");

  // Preserve spacing between paragraphs and line breaks.
  document.body.querySelectorAll("br").forEach((element) => {
    element.replaceWith(" ");
  });

  document.body
    .querySelectorAll("p, div, li, h1, h2, h3, tr")
    .forEach((element) => {
      element.append(" ");
    });

  return (document.body.textContent ?? "").replace(/\s+/g, " ").trim();
}
