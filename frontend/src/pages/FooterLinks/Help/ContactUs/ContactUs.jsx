import { useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./ContactUs.module.css";
import TopHeader from "../../../../components/TopHeader/TopHeader.jsx";
import MainHeader from "../../../../components/MainHeader/MainHeader.jsx";
import Footer from "../../../../components/Footer/Footer.jsx";
import FaqList from "../../../../components/FaqAccordion/FaqList.jsx";
import { getCurrentUser } from "../../../../services/api/authService.js";
import { HELP_FAQ } from "./helpFaq.jsx";

function ChatIcon() {
    return (
        <svg className={styles.cardIcon} viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M3.5 4.5h21v15h-12l-6 4.5v-4.5h-3v-15Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M8 10h12M8 14h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

function PinIcon() {
    return (
        <svg className={styles.cardIcon} viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M14 25s8-7.6 8-13.5a8 8 0 0 0-16 0C6 17.4 14 25 14 25Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <circle cx="14" cy="11.5" r="3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

function BoxIcon() {
    return (
        <svg className={styles.cardIcon} viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M14 3.5 24 8.5v11L14 24.5 4 19.5v-11L14 3.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M4 8.5 14 13.5l10-5M14 13.5v11M9 6l10 5v4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
    );
}

function ContactUs() {
    const pageRef = useRef(null);
    const ordersLink = getCurrentUser() ? "/account" : "/login";

    return (
        <>
            <TopHeader />
            <section ref={pageRef} className={`${styles.helpPage} ${styles.hero}`}>
                <MainHeader theme={"light"} containerRef={pageRef} />
            </section>

            <main className={styles.container}>
                <h1 className={styles.title}>Find Help</h1>
                <span className={styles.titleLine} aria-hidden="true" />
                <p className={styles.subtitle}>Thank you for shopping with New Balance.</p>

                <div className={styles.cards}>
                    <section className={styles.card}>
                        <h2 className={styles.cardTitle}>
                            <ChatIcon />
                            Contact us
                        </h2>
                        <p className={styles.cardText}>
                            Customer service hours are Monday-Friday 9am-9pm EST, and Saturday-Sunday 9am-6pm EST. To speak with an agent, call <a href="tel:8005959138">800-595-9138</a>. Phone support is closed Sundays.
                        </p>
                    </section>

                    <section className={styles.card}>
                        <h2 className={styles.cardTitle}>
                            <PinIcon />
                            Track order status
                        </h2>
                        <p className={styles.cardText}>
                            Log in to your account to view your order history and the status of your orders. In-stock orders ship within 2 business days.
                        </p>
                        <Link to={ordersLink} className={styles.cardButton}>Track my order</Link>
                    </section>

                    <section className={styles.card}>
                        <h2 className={styles.cardTitle}>
                            <BoxIcon />
                            Return policy
                        </h2>
                        <p className={styles.cardText}>
                            We accept returns of merchandise in new condition within 45 days of purchase. Bring your items to any New Balance store for an immediate refund. Review our return policy for eligible items.
                        </p>
                        <Link to="/returns" className={styles.cardButton}>View return policy</Link>
                    </section>
                </div>

                <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>

                <FaqList items={HELP_FAQ} styles={styles} />
            </main>

            <Footer />
        </>
    );
}

export default ContactUs;