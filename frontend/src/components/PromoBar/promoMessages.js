export const PROMO_INTERVAL_MS = 5000;

const EXCLUSIONS_LINK = { label: "Exclusions apply", to: "/sale-exclusions" };

export const PROMO_MESSAGES = [
    {
        id: "id-me",
        title: "15% off select styles with ID.me code.",
        text: [
            "Must use ID.me code at checkout to receive offer. ",
            { ...EXCLUSIONS_LINK, label: "Exclusions apply." },
            " Can't be applied to previous purchases or purchase of gift cards and cannot be redeemed for cash or used in combination with any other offer.",
        ],
        links: [
            { label: "Verify", to: "/special-discounts" },
            { label: "Shop now", to: "/products" },
        ],
    },
    {
        id: "spend-125",
        title: "Get 25% off select styles when you spend $125+.",
        text: [
            "Valid on newbalance.com from October 14, 2026 through October 20, 2026. Offer applies to purchases of $125 or more before taxes are applied. ",
            EXCLUSIONS_LINK,
            ". Discount applied to individual items in cart. Can't be applied to previous purchases or purchase of gift cards and cannot be redeemed for cash or used in combination with any other offer.",
        ],
        links: [
            { label: "Shop now", to: "/products" },
        ],
    },
    {
        id: "fall-favorites",
        title: "Fall favorites for every look.",
        text: ["Explore this season's must-have new arrivals."],
        links: [
            { label: "Shop now", to: "/products" },
        ],
    },
    {
        id: "steady-miles",
        title: "New season, steady miles.",
        text: ["Keep up your pace in any climate with running best-sellers."],
        links: [
            { label: "Shop now", to: "/products" },
        ],
    },
    {
        id: "nyc-finisher",
        title: "Commemorate your 26.2 miles.",
        text: ["Celebrate every mile - NYC Marathon Finisher gear is here."],
        links: [
            { label: "Shop the TCS NYC Finisher Collection", to: "/products" },
        ],
    },
];