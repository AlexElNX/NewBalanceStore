const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

export const AUTH_CHANGE_EVENT = "auth-change";

/**
 * Зберігає дані авторизованої сесії (JWT-токен та профіль користувача) у LocalStorage.
 * @param {Object} authData - Відповідь сервера при успішній автентифікації.
 * @param {string} authData.token - JWT токен доступу.
 * @param {string} authData.email - Адреса електронної пошти.
 * @param {string} authData.fullName - Повне ім'я користувача.
 * @param {string} authData.role - Роль користувача (Customer або Admin).
 */
export function saveAuth(authData) {
    localStorage.setItem(TOKEN_KEY, authData.token);

    localStorage.setItem(
        USER_KEY,
        JSON.stringify({
            email: authData.email,
            fullName: authData.fullName,
            role: authData.role
        })
    );

    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

/**
 * Отримує поточний збережений JWT токен із LocalStorage.
 * @returns {string | null} Рядок токена або null, якщо користувач не авторизований.
 */
export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Отримує десеріалізований об'єкт поточного авторизованого користувача.
 * @returns {{ email: string, fullName: string, role: string } | null}
 */
export function getCurrentUser() {
    const user = localStorage.getItem(USER_KEY);

    return user ? JSON.parse(user) : null;
}

/**
 * Очищує стан авторизації з локального сховища браузера (вихід із системи).
 */
export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}