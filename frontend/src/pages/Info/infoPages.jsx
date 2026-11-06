import { Link } from "react-router-dom";
import { PrivacyChoicesForm } from "./infoForms.jsx";

export const INFO_PAGES = [
    {
        slug: "privacy-policy",
        group: "Legal",
        title: "Privacy Policy",
        intro: "This policy explains what personal information we collect when you shop with us, how we use it and the choices you have.",
        sections: [
            {
                heading: "Information we collect",
                body: (
                    <ul>
                        <li>Account details you give us, such as your name, email address and password.</li>
                        <li>Order details, such as shipping address, phone number and the products you buy.</li>
                        <li>Information about how you use the site, such as pages viewed and items added to your bag.</li>
                    </ul>
                ),
            },
            {
                heading: "How we use it",
                body: <p>We use your information to process orders, provide customer care, keep your account secure, improve the site and, if you agree, send you news about products and offers.</p>,
            },
            {
                heading: "Your choices",
                body: <p>You can update your account details at any time, unsubscribe from emails using the link in any message, and manage how your information is shared on the <Link to="/privacy-choices">Your Privacy Choices</Link> page.</p>,
            },
            {
                heading: "Contact us",
                body: <p>Questions about this policy? <Link to="/help">Contact Customer Care</Link>.</p>,
            },
        ],
    },
    {
        slug: "terms",
        group: "Legal",
        title: "Website Terms & Conditions",
        intro: "By using this website you agree to the terms below. Please read them carefully.",
        sections: [
            {
                heading: "Orders and pricing",
                body: <p>All orders are subject to product availability. We may correct pricing errors and cancel orders placed at an incorrect price. Prices are shown in U.S. dollars.</p>,
            },
            {
                heading: "Your account",
                body: <p>You are responsible for keeping your password confidential and for all activity in your account. Let us know right away if you think your account has been used without permission.</p>,
            },
            {
                heading: "Content",
                body: <p>Text, images, logos and other content on this site belong to New Balance or its partners and may not be copied or used without permission.</p>,
            },
            {
                heading: "Returns",
                body: <p>Returns are handled according to our <Link to="/returns">return policy</Link>. Some items, such as final sale products, cannot be returned.</p>,
            },
        ],
    },
    {
        slug: "responsible-disclosure",
        group: "Legal",
        title: "Responsible Disclosure",
        intro: "We take the security of our customers seriously. If you believe you have found a security issue on our site, we want to hear from you.",
        sections: [
            {
                heading: "How to report",
                body: <p>Send a description of the issue, the steps to reproduce it and the pages affected through <Link to="/help">Customer Care</Link>. Please do not share the issue publicly until we have had a chance to fix it.</p>,
            },
            {
                heading: "Guidelines",
                body: (
                    <ul>
                        <li>Do not access, change or delete data that does not belong to you.</li>
                        <li>Do not run tests that could slow down or interrupt the site for other customers.</li>
                        <li>Give us reasonable time to investigate and respond.</li>
                    </ul>
                ),
            },
        ],
    },
    {
        slug: "supply-chains-act",
        group: "Legal",
        title: "CA Supply Chains Act (SB 657) and Modern Slavery Act Statement",
        intro: "We are committed to making products in a way that respects the people who make them.",
        sections: [
            {
                heading: "Our expectations",
                body: <p>Every factory that makes New Balance products must follow our supplier code of conduct, which prohibits forced, prison, bonded and child labor and requires safe working conditions and fair treatment of workers.</p>,
            },
            {
                heading: "How we check",
                body: <p>Factories are reviewed before production begins and audited regularly. When problems are found, we work with the factory on a plan to fix them and stop working with factories that do not improve.</p>,
            },
            {
                heading: "Training",
                body: <p>Employees who work with suppliers are trained to recognize and report risks of forced labor and human trafficking.</p>,
            },
        ],
    },
    {
        slug: "health-data-privacy",
        group: "Legal",
        title: "Health Data Privacy Policy",
        intro: "Some features, such as fit tools, may use information about your body or activity. This policy explains how we handle that information.",
        sections: [
            {
                heading: "What we collect",
                body: <p>Only the information you choose to give us, such as foot measurements for size recommendations.</p>,
            },
            {
                heading: "How we use it",
                body: <p>We use it only to provide the feature you asked for. We do not sell health data.</p>,
            },
            {
                heading: "Your rights",
                body: <p>You can ask us to delete your health data at any time through <Link to="/help">Customer Care</Link>.</p>,
            },
        ],
    },
    {
        slug: "privacy-choices",
        group: "Legal",
        title: "Your Privacy Choices",
        intro: "You can choose whether we may sell or share your personal information for personalized advertising. Your choice is saved for this browser.",
        form: PrivacyChoicesForm,
        sections: [
            {
                heading: "More information",
                body: <p>Read our <Link to="/privacy-policy">Privacy Policy</Link> to learn more about how we use your information.</p>,
            },
        ],
    },
    {
        slug: "gift-card-terms",
        group: "Legal",
        title: "Gift Card Terms & Conditions",
        sections: [
            {
                heading: "Using your gift card",
                body: <p>Gift cards can be used to buy products on this site and in participating New Balance stores. They cannot be used to buy other gift cards.</p>,
            },
            {
                heading: "Balance",
                body: <p>Gift cards do not expire and have no fees. You can check your balance in any participating New Balance store.</p>,
            },
            {
                heading: "Lost or stolen cards",
                body: <p>Treat your gift card like cash. We are not responsible for lost or stolen cards or for use without your permission.</p>,
            },
        ],
        links: [{ label: "Shop gift cards", to: "/giftcards" }],
    },
    {
        slug: "our-purpose",
        group: "About Us",
        title: "Our Purpose",
        intro: "We believe in the power of sport to move people forward.",
        sections: [
            {
                heading: "Independent since day one",
                body: <p>New Balance started as a small company making arch supports and has grown into a global brand while staying independent. That independence lets us make long-term decisions for our athletes, our communities and the planet.</p>,
            },
            {
                heading: "Made by people",
                body: <p>We are proud to make shoes in our own factories in the United States and the United Kingdom, alongside trusted partners around the world.</p>,
            },
        ],
        links: [
            { label: "Responsible leadership", to: "/responsible-leadership" },
            { label: "Shop new arrivals", to: "/products?new=true" },
        ],
    },
    {
        slug: "responsible-leadership",
        group: "About Us",
        title: "Responsible Leadership",
        intro: "Doing what is right for people and the planet is part of how we work.",
        sections: [
            {
                heading: "Environment",
                body: <p>We are working to use more recycled and preferred materials, reduce waste and lower the carbon footprint of our products.</p>,
            },
            {
                heading: "People",
                body: <p>We expect every supplier to treat workers fairly and safely. Read our <Link to="/supply-chains-act">supply chain statement</Link>.</p>,
            },
            {
                heading: "Product integrity",
                body: <p>Learn how to spot and report fake products on our <Link to="/counterfeit">counterfeit products</Link> page.</p>,
            },
        ],
    },
    {
        slug: "new-balance-foundation",
        group: "About Us",
        title: "New Balance Foundation",
        intro: "The New Balance Foundation supports organizations that help children and families live healthier lives.",
        sections: [
            {
                heading: "What we support",
                body: <p>Programs that promote physical activity, healthy eating and youth sports in the communities where we live and work.</p>,
            },
            {
                heading: "In our communities",
                body: <p>Our employees volunteer with local partners throughout the year, from youth sports clinics to community clean-ups.</p>,
            },
        ],
    },
    {
        slug: "careers",
        group: "About Us",
        title: "Careers",
        intro: "Join a team that is passionate about sport, product and people.",
        sections: [
            {
                heading: "Where we work",
                body: <p>Our teams work in our headquarters, factories, distribution centers and retail stores.</p>,
            },
            {
                heading: "Work in our stores",
                body: <p>Love helping people find the right fit? Visit one of our stores to learn about open positions near you.</p>,
            },
        ],
        links: [{ label: "Find a store", to: "/stores" }],
    },
    {
        slug: "the-track",
        group: "About Us",
        title: "The TRACK at New Balance",
        intro: "The TRACK at New Balance is a world-class indoor sports facility in Boston, built for athletes of every level.",
        sections: [
            {
                heading: "Events",
                body: <p>The facility hosts track meets, community events and concerts throughout the year.</p>,
            },
            {
                heading: "For the community",
                body: <p>Local schools and running clubs use The TRACK for training and competition.</p>,
            },
        ],
        links: [{ label: "Shop running", to: "/products?activity=running" }],
    },
    {
        slug: "press-box",
        group: "About Us",
        title: "Press Box",
        intro: "News and media resources from New Balance.",
        sections: [
            {
                heading: "Media inquiries",
                body: <p>Members of the media can reach our communications team through <Link to="/help">Customer Care</Link>.</p>,
            },
            {
                heading: "Latest releases",
                body: <p>See what is new on our <Link to="/products?new=true">new arrivals</Link> page.</p>,
            },
        ],
    },
    {
        slug: "custom-uniforms",
        group: "Shop",
        title: "Custom Uniforms",
        intro: "Outfit your whole team with custom New Balance uniforms and apparel.",
        sections: [
            {
                heading: "How it works",
                body: (
                    <ul>
                        <li>Choose your sport and styles.</li>
                        <li>Add your team colors, names, numbers and logos.</li>
                        <li>Review your design and place your order.</li>
                    </ul>
                ),
            },
            {
                heading: "Get started",
                body: <p>Tell us about your team through <Link to="/help">Customer Care</Link> and a specialist will help you with your order.</p>,
            },
        ],
        links: [{ label: "Shop team sports", to: "/products?activity=soccer" }],
    },
    {
        slug: "care-and-maintenance",
        group: "Customer Care",
        title: "Care & Maintenance",
        intro: "A little care keeps your shoes and apparel looking and performing their best.",
        sections: [
            {
                heading: "Shoes",
                body: (
                    <ul>
                        <li>Remove dirt with a soft brush and a damp cloth with mild soap.</li>
                        <li>Do not put shoes in the washer or dryer.</li>
                        <li>Let shoes air dry away from direct heat. Stuff them with paper to keep their shape.</li>
                    </ul>
                ),
            },
            {
                heading: "Apparel",
                body: <p>Wash in cold water with similar colors and follow the instructions on the care label. Avoid fabric softener on performance fabrics.</p>,
            },
        ],
        links: [{ label: "More FAQs", to: "/faqs" }],
    },
    {
        slug: "country-language",
        group: "Shop",
        title: "Country",
        intro: "You are shopping New Balance United States.",
        sections: [
            {
                heading: "Shipping",
                body: <p>This site ships to addresses in the United States and U.S. territories. See <Link to="/shipping">shipping information</Link> for details.</p>,
            },
        ],
        links: [{ label: "Continue shopping", to: "/products" }],
    },
];
