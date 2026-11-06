const RUNNING_PATTERN = /running shoe|everyday miles|road work|long run|marathon/;

const SUBCATEGORY_PATTERNS = [
    { category: "hoodies & sweatshirts", label: "Hoodies & Sweatshirts", type: "clothing", pattern: /hood|sweatshirt|crew\b|pullover|fleece/ },
    { category: "jackets & vests", label: "Jackets & Vests", type: "clothing", pattern: /jacket|vest|anorak|windbreaker|parka/ },
    { category: "shirts", label: "Shirts", type: "clothing", pattern: /shirt|tee\b|top\b|tank|polo|jersey|sleeve/ },
    { category: "shorts", label: "Shorts", type: "clothing", pattern: /short/ },
    { category: "pants", label: "Pants", type: "clothing", pattern: /pant|jogger|legging|tight|trouser/ },
    { category: "socks", label: "Socks", type: "accessories", pattern: /sock/ },
    { category: "bags", label: "Bags", type: "accessories", pattern: /bag|backpack|tote|duffel/ },
    { category: "hats & gloves", label: "Hats & Gloves", type: "accessories", pattern: /hat\b|cap\b|beanie|glove|headband/ },
];

function getSearchText(product) {
    return `${product.name ?? ""} ${product.description ?? ""}`.toLowerCase();
}

function isFootwear(product) {
    return (product.type ?? "").toLowerCase() === "footwear";
}

export function getProductActivity(product) {
    const activity = (product.activity ?? "").trim();

    if (!isFootwear(product))
        return activity.toLowerCase() === "lifestyle" ? "" : activity;

    if (activity)
        return activity;

    const text = getSearchText(product);
    if (RUNNING_PATTERN.test(text) && !text.includes("inspired"))
        return "Running";

    return "Lifestyle";
}

export function matchesActivity(product, activity) {
    return getProductActivity(product).toLowerCase() === activity.toLowerCase();
}

const KIDS_AGE_GROUPS = ["Big Kids", "Little Kids", "Babies & Toddlers"];

export function getProductSubcategory(product) {
    const productCategory = (product.category ?? "").toLowerCase();
    const ageGroup = KIDS_AGE_GROUPS.find(item => item.toLowerCase() === productCategory);
    if (ageGroup)
        return { label: ageGroup, value: productCategory };

    const type = (product.type ?? "").toLowerCase();
    const rules = SUBCATEGORY_PATTERNS.filter(item => item.type === type);
    if (!rules.length)
        return null;

    const name = (product.name ?? "").toLowerCase();
    const rule = rules.find(item => item.category === productCategory)
        ?? rules.find(item => item.pattern.test(name));

    return rule ? { label: rule.label, value: rule.category } : null;
}

export function matchesCategory(product, category) {
    const wanted = category.toLowerCase();
    const productCategory = (product.category ?? "").toLowerCase();

    if (productCategory === wanted)
        return true;

    if (wanted === "shoes")
        return (product.type ?? "").toLowerCase() === "footwear";

    const rule = SUBCATEGORY_PATTERNS.find(item => item.category === wanted);
    if (!rule)
        return false;

    const name = (product.name ?? "").toLowerCase();
    const firstMatch = SUBCATEGORY_PATTERNS.find(item => item.pattern.test(name));
    return firstMatch?.category === wanted;
}
