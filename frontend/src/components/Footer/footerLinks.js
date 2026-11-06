import instagramIcon from '../../assets/icons/footer/instagram.svg';
import facebookIcon from '../../assets/icons/footer/facebook.svg';
import twitterIcon from '../../assets/icons/footer/twitter.svg';
import youtubeIcon from '../../assets/icons/footer/youtube.svg';
import pinterestIcon from '../../assets/icons/footer/pinterest.svg';
import tiktokIcon from '../../assets/icons/footer/tiktok.svg';

export const FOOTER_COLUMNS = [
    {
        title: "Help",
        links: [
            { label: "Contact us", to: "/help" },
            { label: "Return policy", to: "/returns" },
            { label: "Track your order", to: "/order-status" },
            { label: "Become a member", to: "/membership" },
            { label: "Size guide", to: "/size-guide" },
            { label: "FAQ", to: "/faqs" },
        ],
    },
    {
        title: "Shop",
        links: [
            { label: "Find a store", to: "/stores" },
            { label: "Gift cards", to: "/giftcards" },
            { label: "Shipping information", to: "/shipping" },
            { label: "Sale exclusions", to: "/sale-exclusions" },
            { label: "Custom uniforms", to: "/custom-uniforms" },
        ],
    },
    {
        title: "About Us",
        links: [
            { label: "Our Purpose", to: "/our-purpose" },
            { label: "Responsible leadership", to: "/responsible-leadership" },
            { label: "New Balance Foundation", to: "/new-balance-foundation" },
            { label: "Careers", to: "/careers" },
            { label: "The TRACK at New Balance", to: "/the-track" },
            { label: "Press box", to: "/press-box" },
            { label: "Medical Plan Information", to: "/medical-plan-information" },
        ],
    },
    {
        title: "For You",
        links: [
            { label: "Special discounts", to: "/special-discounts" },
            { label: "Idea submission", to: "/idea-submission" },
            { label: "Affiliate program", to: "/affiliate" },
            { label: "Counterfeit products", to: "/counterfeit" },
            { label: "Accessibility statement", to: "/accessibility-statement" },
        ],
    },
];

export const SOCIAL_LINKS = [
    { label: "Instagram", href: "https://www.instagram.com/newbalance/", icon: instagramIcon },
    { label: "Facebook", href: "https://www.facebook.com/Newbalance/", icon: facebookIcon },
    { label: "X", href: "https://x.com/newbalance", icon: twitterIcon },
    { label: "YouTube", href: "https://www.youtube.com/user/newbalance", icon: youtubeIcon },
    { label: "Pinterest", href: "https://www.pinterest.com/newbalance/", icon: pinterestIcon },
    { label: "TikTok", href: "https://www.tiktok.com/@newbalance?lang=en", icon: tiktokIcon },
];