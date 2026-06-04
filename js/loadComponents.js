async function loadComponent(selector, path) {
  const response = await fetch(path);
  const html = await response.text();

  document.querySelector(selector).innerHTML = html;
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent(
    "#top-header-container",
    "components/top-header.html"
  );

  await loadComponent(
    "#main-header-container",
    "components/main-header.html"
  );

  await loadComponent(
    "#footer-container",
    "components/footer.html"
  );

  document.dispatchEvent(new Event("componentsLoaded"));
});
