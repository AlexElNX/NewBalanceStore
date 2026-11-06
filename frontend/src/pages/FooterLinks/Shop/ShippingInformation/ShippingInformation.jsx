import { useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./ShippingInformation.module.css";
import TopHeader from "../../../../components/TopHeader/TopHeader.jsx";
import MainHeader from "../../../../components/MainHeader/MainHeader.jsx";
import Footer from "../../../../components/Footer/Footer.jsx";
import FaqList from "../../../../components/FaqAccordion/FaqList.jsx";

const FAQ_LINKS = [
    { label: "Most Popular", to: "/faqs" },
    { label: "Discounts & Promotions", to: "/special-discounts" },
    { label: "Order Status", to: "/order-status" },
    { label: "Returns", to: "/returns" },
    { label: "Shipping & Delivery", to: "/shipping" },
    { label: "Product & Fit", to: "/size-guide" },
    { label: "Shoe Size & Width Guide", to: "/size-guide" },
    { label: "Apparel Size Guide", to: "/size-guide" },
    { label: "Sports Bra Size Guide", to: "/size-guide" },
    { label: "Care & Maintenance", to: "/care-and-maintenance" },
    { label: "Payments & Gift Cards", to: "/giftcards" },
    { label: "Membership & Log In", to: "/membership" },
    { label: "Stores", to: "/stores" },
];

const HELP_LINKS = [
    { label: "Contact Us", to: "/help" },
    { label: "Track Your Order", to: "/order-status" },
    { label: "Find A Store", to: "/stores" },
    { label: "Log In", to: "/login" },
];

function SideLink({ link }) {
    if (link.to.startsWith("/")) {
        return <Link to={link.to} onClick={() => window.scrollTo(0, 0)}>{link.label}</Link>;
    }
    return <a href={link.to}>{link.label}</a>;
}

const SHIPPING_METHODS = [
    { id: "standard", name: "Standard", carrier: "(UPS Ground)", delivery: "2-5 business days", cost: "$9.95", free: true },
    { id: "expedited", name: "Expedited", carrier: "(UPS 2-Day Air)", delivery: "2 business days", cost: "$19.95", free: false },
    { id: "rush", name: "Rush", carrier: "(UPS 1-Day Air)", delivery: "1 business day", cost: "$25.95", free: false },
    { id: "usps", name: "USPS", carrier: "", delivery: "2-7 business days", cost: "$11.95", free: true },
];

const SHIPPING_FAQ = [
    {
        id: "ship-time",
        question: "When can I expect my order to ship?",
        answer: (
            <>
                <p>All in-stock items ship within 2 business days. You will receive a shipping confirmation email with tracking when your order ships. If your order is split into more than one shipment, you will receive separate emails for each shipment.</p>
                <p>Carrier delivery times go into effect once your order has shipped.</p>
            </>
        )
    },
    {
        id: "know-ships",
        question: "How will I know when my order ships?",
        answer: (
            <p>You will receive a shipping confirmation email with tracking when your order ships. If your order is split into more than one shipment, you will receive separate emails for each shipment.</p>
        )
    },
    {
        id: "where",
        question: "Where do you ship to?",
        answer: (
            <p>This site is for orders shipping to addresses within the United States and U.S. territories. For orders outside the U.S., shop our international sites by selecting your region <Link to="/country-language">here</Link>.</p>
        )
    },
    {
        id: "cost",
        question: "How much does shipping cost?",
        answer: (
            <p>Shipping cost varies by order total and the shipping option selected at checkout. Please see the chart at the top of this page for rates.</p>
        )
    },
    {
        id: "weekends",
        question: "Do orders ship on weekends?",
        answer: (
            <p>No, our team works hard to process and ship orders Monday through Friday, excluding holidays. UPS does not deliver on weekends or holidays.</p>
        )
    },
    {
        id: "multiple",
        question: "Can I ship to multiple addresses?",
        answer: (
            <p>To ship to multiple addresses, please place a separate order for each shipping address.</p>
        )
    },
    {
        id: "partial",
        question: "Only part of my order was delivered. What should I do?",
        answer: (
            <>
                <p>Your order may arrive in multiple shipments. Check your shipping confirmation email to see which items should be included in your delivery. If your order is split into more than one shipment, you will receive separate emails for each shipment.</p>
                <p>If all the items included in your shipping confirmation email were not delivered, contact our <Link to="/help">Customer Care team</Link>.</p>
            </>
        )
    },
    {
        id: "late",
        question: "I did not receive my order or it is taking longer than expected. What should I do?",
        answer: (
            <>
                <p>Occasionally, weather, glitches, &amp; other unforeseen circumstances can cause shipping delays. To check the status of your shipment, use the tracking information in your shipping confirmation email.</p>
                <p>If your tracking information shows that your package was delivered, but you can&apos;t find it:</p>
                <ol>
                    <li>Verify the order was placed with the correct address by checking your order or shipping confirmation emails.</li>
                    <li>Wait for the full estimated shipping time frame to pass. Packages may show as delivered for up to 2 business days prior to actual arrival.</li>
                    <li>Contact our <Link to="/help">Customer Care team</Link> if you are still unable to locate your package.</li>
                </ol>
            </>
        )
    },
    {
        id: "held",
        question: "Why is my order being held?",
        answer: (
            <p>We reserve the right to hold any order suspected of fraud. Please check your order status by clicking <Link to="/order-status">here</Link>. If more than 2 business days have passed without receiving a shipping notification and you think your order is being held, contact our <Link to="/help">Customer Care team</Link>.</p>
        )
    }
];

function ShippingInformation() {
    const pageRef = useRef(null);

    return (
        <>
            <TopHeader />
            <section ref={pageRef} className={`${styles.shippingPage} ${styles.hero}`}>
                <MainHeader theme={"light"} containerRef={pageRef} />
            </section>

            <main className={styles.container}>
                <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
                    <Link to="/" onClick={() => window.scrollTo(0, 0)}>Home</Link>
                    <span className={styles.separator} aria-hidden="true">/</span>
                    <Link to="/help" onClick={() => window.scrollTo(0, 0)}>Customer Care</Link>
                </nav>

                <div className={styles.layout}>
                    <aside className={styles.sidebar}>
                        <h2 className={styles.sideTitle}>FAQs</h2>
                        <ul className={styles.sideList}>
                            {FAQ_LINKS.map((link) => (
                                <li key={link.label}><SideLink link={link} /></li>
                            ))}
                        </ul>

                        <h2 className={styles.sideTitle}>Help</h2>
                        <ul className={styles.sideList}>
                            {HELP_LINKS.map((link) => (
                                <li key={link.label}><SideLink link={link} /></li>
                            ))}
                        </ul>
                    </aside>

                    <div className={styles.content}>
                        <h1 className={styles.title}>Shipping Information</h1>
                        <span className={styles.titleLine} aria-hidden="true" />

                        <p className={styles.intro}>
                            We offer several shipping options at checkout to help you get your order when you need it. Please use the chart below to determine the best option for your order.
                        </p>
                        <p className={styles.intro}>
                            <strong>Carrier delivery times go into effect once your order has shipped.</strong> In-stock items ship within 2 business days. UPS does not deliver on weekends or holidays.
                        </p>

                        <div className={styles.tableWrap}>
                            <table className={styles.table}>
                                <thead>
                                <tr>
                                    <th scope="col">Shipping Method</th>
                                    <th scope="col">Estimated Delivery</th>
                                    <th scope="col">Cost</th>
                                </tr>
                                </thead>
                                <tbody>
                                {SHIPPING_METHODS.map((method) => (
                                    <tr key={method.id}>
                                        <th scope="row">
                                            <strong>{method.name}</strong> {method.carrier}
                                        </th>
                                        <td>
                                            {method.delivery}
                                            <br />
                                            once shipped
                                        </td>
                                        <td>
                                            {method.cost}
                                            {method.free && (
                                                <>
                                                    <br />
                                                    <strong>FREE on orders $75+</strong>
                                                    <br />
                                                    <strong>
                                                        FREE for members. <Link to="/login">Join</Link> or <Link to="/login">log in</Link>.
                                                    </strong>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>

                        <FaqList items={SHIPPING_FAQ} styles={styles} />

                        <p className={styles.more}>
                            View additional frequently asked questions <Link to="/faqs" onClick={() => window.scrollTo(0, 0)}>here</Link>.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default ShippingInformation;