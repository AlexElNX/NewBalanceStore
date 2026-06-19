function displayIcon() {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = '/NewBalanceShop/img/svg/header/logo.svg';
  document.head.appendChild(link);
}
displayIcon();


document.addEventListener("componentsLoaded", () => {
  const header = document.querySelector('.main-header');
  const hero = document.querySelector('.hero');

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll <= 70) {
      header.style.position = 'absolute';
      header.style.width = '100%';
      header.style.left = '0';

      header.classList.remove('fixed', 'hidden', 'scrolled');
      lastScroll = 0;
      return;
    }

    header.style.position = 'fixed';
    header.style.width = `${hero.offsetWidth}px`;
    header.style.left = `${hero.getBoundingClientRect().left}px`;

    header.classList.add('scrolled', 'fixed');

    if (currentScroll > lastScroll) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }

    lastScroll = currentScroll;
  });
});


async function init() {
  try {
    const response = await fetch("/NewBalanceShop/js/data/banner.json");

    if(!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();

    console.log(data);
  }
  catch (error) {
    console.error(error);
  }
}

init();



