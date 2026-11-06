import { useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./BecomeAMember.module.css";
import TopHeader from "../../../../components/TopHeader/TopHeader.jsx";
import MainHeader from "../../../../components/MainHeader/MainHeader.jsx";
import Footer from "../../../../components/Footer/Footer.jsx";
import FaqList from "../../../../components/FaqAccordion/FaqList.jsx";
import { getCurrentUser } from "../../../../services/api/authService.js";
import heroImage from "../../../../assets/images/new/women-arrivals.jpg";
import { MEMBER_BENEFITS, MEMBER_FAQ } from "./memberData.jsx";

function ArrowIcon({ direction }) {
    return (
        <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.arrowIcon}>
            <path
                d={direction === "left" ? "M10 2.5 4.5 8l5.5 5.5" : "M6 2.5 11.5 8 6 13.5"}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function BecomeAMember() {
    const pageRef = useRef(null);
    const sliderRef = useRef(null);
    const isLoggedIn = Boolean(getCurrentUser());

    const scrollBenefits = (direction) => {
        const slider = sliderRef.current;
        if (!slider) return;
        const card = slider.querySelector("li");
        const step = card ? card.offsetWidth : slider.clientWidth;
        slider.scrollBy({ left: direction * step, behavior: "smooth" });
    };

    return (
        <>
            <TopHeader />
            <section ref={pageRef} className={`${styles.memberPage} ${styles.header}`}>
                <MainHeader theme={"light"} containerRef={pageRef} />
            </section>

            <main className={styles.main}>
                <section className={styles.hero}>
                    <img className={styles.heroImage} src={heroImage} alt="" />
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>Join us.</h1>
                        <p className={styles.heroText}>
                            Become a New Balance Member by creating an account. When you log in, you’ll get exclusive offers, free shipping and returns on all orders, and more. Sign up for free today.
                        </p>
                        <div className={styles.heroButtons}>
                            {isLoggedIn ? (
                                <Link to="/account" className={styles.primaryButton} onClick={() => window.scrollTo(0, 0)}>
                                    Go to my account
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className={styles.primaryButton} onClick={() => window.scrollTo(0, 0)}>
                                        Create an account
                                    </Link>
                                    <Link to="/login" className={styles.secondaryButton} onClick={() => window.scrollTo(0, 0)}>
                                        Log in
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                <section className={styles.benefits} aria-labelledby="benefits-title">
                    <h2 id="benefits-title" className={styles.benefitsTitle}>Membership benefits</h2>

                    <div className={styles.sliderWrap}>
                        <button
                            type="button"
                            className={`${styles.sliderButton} ${styles.sliderPrev}`}
                            onClick={() => scrollBenefits(-1)}
                            aria-label="Previous benefits"
                        >
                            <ArrowIcon direction="left" />
                        </button>

                        <ul ref={sliderRef} className={styles.slider}>
                            {MEMBER_BENEFITS.map((benefit) => (
                                <li key={benefit.id} className={styles.benefitCard}>
                                    <img className={styles.benefitImage} src={benefit.image} alt="" loading="lazy" />
                                    <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                                    <p className={styles.benefitText}>{benefit.text}</p>
                                </li>
                            ))}
                        </ul>

                        <button
                            type="button"
                            className={`${styles.sliderButton} ${styles.sliderNext}`}
                            onClick={() => scrollBenefits(1)}
                            aria-label="Next benefits"
                        >
                            <ArrowIcon direction="right" />
                        </button>
                    </div>
                </section>

                <section className={styles.faq} aria-labelledby="member-faq-title">
                    <h2 id="member-faq-title" className={styles.faqTitle}>Frequently asked questions</h2>

                    <FaqList items={MEMBER_FAQ} styles={styles} />

                </section>
            </main>

            <Footer />
        </>
    );
}

export default BecomeAMember;