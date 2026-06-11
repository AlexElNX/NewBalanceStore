async function loadComponent(selector, path) {
  const response = await fetch(path);
  const html = await response.text();

  document.querySelector(selector).innerHTML = html;
}

const basePath = window.location.pathname.includes("pages") ? "../components/" : "./components/";

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent(
    "#top-header-container",
    `${basePath}top-header.html`
  );

  await loadComponent(
    "#main-header-container",
    `${basePath}main-header.html`
  );

  await loadComponent(
    "#footer-container",
    `${basePath}footer.html`
  );

  document.dispatchEvent(new Event("componentsLoaded"));
});
