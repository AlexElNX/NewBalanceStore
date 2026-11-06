import { useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./TrackYourOrder.module.css";
import TopHeader from "../../../../components/TopHeader/TopHeader.jsx";
import MainHeader from "../../../../components/MainHeader/MainHeader.jsx";
import Footer from "../../../../components/Footer/Footer.jsx";
import FaqList from "../../../../components/FaqAccordion/FaqList.jsx";
import { getCurrentUser } from "../../../../services/api/authService.js";
import { getTrackFaq } from "./trackFaq.jsx";

function TrackYourOrder() {
    const pageRef = useRef(null);
    const isLoggedIn = Boolean(getCurrentUser());
    const accountLink = isLoggedIn ? "/account" : "/login";
    const faq = getTrackFaq(accountLink, styles.plainList);

    return (
        <>
            <TopHeader />
            <section ref={pageRef} className={`${styles.trackPage} ${styles.hero}`}>
                <MainHeader theme={"light"} containerRef={pageRef} />
            </section>

            <main className={styles.container}>
                <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
                    <Link to="/" onClick={() => window.scrollTo(0, 0)}>Home</Link>
                    <span className={styles.separator} aria-hidden="true">/</span>
                    <span aria-current="page">Order Status</span>
                </nav>

                <div className={styles.content}>
                    <h1 className={styles.title}>Order Status</h1>
                    <p className={styles.subtitle}>
                        {isLoggedIn
                            ? "View your order history and the status of your orders in your account."
                            : "Log in to your account to view your order history and the status of your orders."}
                    </p>

                    <Link to={accountLink} className={styles.accountButton}>
                        {isLoggedIn ? "View my orders" : "Log in"}
                    </Link>

                    <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>

                    <FaqList items={faq} styles={styles} />
                </div>
            </main>

            <Footer />
        </>
    );
}

export default TrackYourOrder;