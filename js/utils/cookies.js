export function setCookie(name, value, days = 7) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${JSON.stringify(value)};expires=${date.toUTCString()};path=/`;
}

export function getCookie(name) {
  const cookies = document.cookie.split("; ");

  for (let i = 0; i < cookies.length; i++) {
    const [key, value] = cookies[i].split("=");

    if (key === name) {
      return JSON.parse(value);
    }
  }

  return [];
}
