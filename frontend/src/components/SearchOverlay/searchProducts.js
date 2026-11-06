const normalize = (value) =>
    String(value ?? "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();

function getSearchText(product) {
    const gender = String(product.gender ?? "").toLowerCase();
    const parts = [
        product.name,
        product.type,
        product.category,
        product.activity,
        product.gender,
        gender === "unisex" ? "men women" : "",
        String(product.type ?? "").toLowerCase() === "footwear" ? "shoes sneakers" : "",
    ];
    return normalize(parts.join(" "));
}

function matchesWord(words, compact, token) {
    if (words.some(word => word.startsWith(token))) return true;
    if (token.length >= 4 && compact.includes(token)) return true;
    return false;
}

export function matchesSearch(product, query) {
    const tokens = normalize(query).split(" ").filter(Boolean);
    if (tokens.length === 0) return true;

    const words = getSearchText(product).split(" ");
    const compact = normalize(product.name).replace(/ /g, "");

    return tokens.every(token =>
        matchesWord(words, compact, token) ||
        (token.length > 3 && token.endsWith("s") && matchesWord(words, compact, token.slice(0, -1)))
    );
}

export function searchProducts(products, query) {
    if (!normalize(query)) return [];
    return products.filter(product => matchesSearch(product, query));
}