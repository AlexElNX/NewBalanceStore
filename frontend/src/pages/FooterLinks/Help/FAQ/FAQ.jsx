import { Fragment, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./FAQ.module.css";
import TopHeader from "../../../../components/TopHeader/TopHeader.jsx";
import MainHeader from "../../../../components/MainHeader/MainHeader.jsx";
import Footer from "../../../../components/Footer/Footer.jsx";
import FaqList from "../../../../components/FaqAccordion/FaqList.jsx";
import { FAQ_CATEGORIES, POPULAR_FAQ } from "./faqData.jsx";

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

function FAQ() {
    const pageRef = useRef(null);

    return (
        <>
            <TopHeader />
            <section ref={pageRef} className={`${styles.faqPage} ${styles.hero}`}>
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
                        <h1 className={styles.title}>Frequently Asked Questions</h1>
                        <span className={styles.titleLine} aria-hidden="true" />

                        <p className={styles.categories}>
                            By category:{" "}
                            {FAQ_CATEGORIES.map((link, index) => (
                                <Fragment key={link.label}>
                                    {index > 0 && <span className={styles.divider} aria-hidden="true"> | </span>}
                                    <SideLink link={link} />
                                </Fragment>
                            ))}
                        </p>

                        <h2 className={styles.faqTitle}>Most Popular FAQs</h2>

                        <FaqList items={POPULAR_FAQ} styles={styles} />

                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default FAQ;