import { useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./StartAReturn.module.css";
import TopHeader from "../../../../components/TopHeader/TopHeader.jsx";
import MainHeader from "../../../../components/MainHeader/MainHeader.jsx";
import Footer from "../../../../components/Footer/Footer.jsx";
import FaqList from "../../../../components/FaqAccordion/FaqList.jsx";
import { getReturnFaq } from "./returnFaq.jsx";

function StoreIcon() {
    return (
        <svg className={styles.cardIcon} viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M4 5h20v5H4V5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M5.5 10v13h17V10M11 23v-7h6v7" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
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

function StartAReturn() {
    const pageRef = useRef(null);
    const faq = getReturnFaq();

    return (
        <>
            <TopHeader />
            <section ref={pageRef} className={`${styles.returnPage} ${styles.hero}`}>
                <MainHeader theme={"light"} containerRef={pageRef} />
            </section>

            <main className={styles.container}>
                <h1 className={styles.title}>Return Policy</h1>
                <span className={styles.titleLine} aria-hidden="true" />
                <p className={styles.intro}>
                    If you aren’t completely satisfied with your purchase, we accept returns in new condition within 45 days of shipment (for online purchases) or purchase (for in-store purchases) for a refund to the original form of payment. A valid receipt, order confirmation email, or packing list is required. New Balance reserves the right to refuse worn or damaged merchandise.
                </p>

                <div className={styles.cards}>
                    <section className={styles.card}>
                        <h2 className={styles.cardTitle}>
                            <StoreIcon />
                            Return to a store
                        </h2>
                        <p className={styles.cardText}>
                            Online, in-store and event purchases can be returned in store. Bring your items and a packing slip, order confirmation email or receipt to any New Balance or New Balance Factory store to immediately receive your refund. <strong>All in-store returns are free.</strong>
                        </p>
                        <Link to="/stores" className={styles.cardButton}>Find a store</Link>
                    </section>

                    <section className={styles.card}>
                        <h2 className={styles.cardTitle}>
                            <BoxIcon />
                            Ship your return
                        </h2>
                        <p className={styles.cardText}>
                            For online orders only: contact our Customer Care team and ship your items back to us. <strong>Online returns are free for members.</strong> Non-member returns are subject to a $5 restocking fee, which will be deducted from the total refund amount. Please allow up to 14 days after we receive your package for your refund to process.
                        </p>
                        <Link to="/help" className={styles.cardButton}>Contact us</Link>
                    </section>
                </div>

                <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>

                <FaqList items={faq} styles={styles} />

                <p className={styles.more}>
                    View additional frequently asked questions <Link to="/help" onClick={() => window.scrollTo(0, 0)}>here</Link>.
                </p>
            </main>

            <Footer />
        </>
    );
}

export default StartAReturn;