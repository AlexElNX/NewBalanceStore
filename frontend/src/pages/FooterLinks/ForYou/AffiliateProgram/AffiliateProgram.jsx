import { useRef } from "react";
import styles from "./AffiliateProgram.module.css";
import TopHeader from "../../../../components/TopHeader/TopHeader.jsx";
import MainHeader from "../../../../components/MainHeader/MainHeader.jsx";
import Footer from "../../../../components/Footer/Footer.jsx";
import FaqList from "../../../../components/FaqAccordion/FaqList.jsx";

const SECTIONS = [
    {
        title: "What is it?",
        text: "The New Balance Affiliate Program allows approved websites to link to newbalance.com and begin earning commissions on click-thru sales. New Balance handles order fulfillment and customer service for all transactions resulting from referred clicks – you simply send us the purchasing traffic. By linking to newbalance.com, you will have access to the internet's largest available inventory of New Balance sports & fitness products for men, women and kids.",
    },
    {
        title: "How it works",
        text: "It's a simple way to earn extra cash. As a New Balance affiliate, you can earn commissions on sales generated from New Balance affiliate links on your website shopping engine, email campaigns and search listings. New Balance handles all transactions and customer service once your visitor has clicked on the link to our site. We track all transactions from your links and pay you for business you refer to us through click-thru purchases.",
    },
    {
        title: "Get started",
        text: "Any family-friendly website operator is eligible to enroll in the New Balance Affiliate Program, subject to being an Impact member and the program terms and conditions. There is no fee to join or participate in the New Balance Affiliate Program. We will email you about the status of your application soon after receiving your registration form.",
    },
];

const AFFILIATE_FAQ = [
    {
        id: "become",
        question: "How do I become an affiliate of New Balance?",
        answer: (
            <>
                <p>To participate in the New Balance Affiliate Program, you must be an Impact member.</p>
                <p>
                    Not an Impact member? <a href="https://app.impact.com/signup/none/V3/create-new-mediapartner-account-flow.ihtml?execution=e2s1" target="_blank" rel="noreferrer">Sign up for Impact</a>
                </p>
                <p>
                    Already an Impact member? <a href="https://app.impact.com/campaign-promo-signup/New-Balance-Athletics-Inc.brand?execution=e1s1#/?viewkey=signUpPreStart" target="_blank" rel="noreferrer">Join the NB Affiliate Program</a>
                </p>
            </>
        ),
    },
    {
        id: "highlights",
        question: "Key Program Highlights",
        answer: (
            <ul>
                <li>Commission rates start at 2% with opportunity to increase based on performance</li>
                <li>Gift cards and select products are non-commissionable (0%)</li>
                <li>30 day cookie - You get credit for any orders within 30 days of the original click placed by the customer</li>
                <li>Average order size of $125+</li>
                <li>Product data feed so that you can feature New Balance products directly from your website</li>
                <li>Monthly newsletters with updates on promotions, content and sales opportunities are shared with affiliates</li>
            </ul>
        ),
    },
    {
        id: "creative",
        question: "How many New Balance links, banners, products and other creative should I place on my website?",
        answer: (
            <p>You can place as many as you like, and we encourage you to use as many as necessary and appropriate to improve click-thrus and conversion. We have found that a creative banner along with a text link or New Balance logo improves effectiveness.</p>
        ),
    },
    {
        id: "graphics",
        question: "Can I use graphics and content from the New Balance websites?",
        answer: (
            <p>The entire New Balance website and content are protected by copyright. You may use images and content from our websites in the promotion of our products on your own website; however, all images must be used in the sale of the product through the affiliate program and attributed to us. If you have a special circumstance that requires the use of any graphics, product images or content in a manner that is not consistent with the above, you must contact us for written approval prior to use of any such content.</p>
        ),
    },
    {
        id: "returns",
        question: "How do you handle product returns on affiliate sales?",
        answer: (
            <p>If a customer referred by your site returns or cancels an order for refund, or if credit card charges are reversed due to online credit card fraud, New Balance can debit your account at its discretion for any commission earned on that transaction.</p>
        ),
    },
];

function AffiliateProgram() {
    const pageRef = useRef(null);

    return (
        <>
            <TopHeader />
            <section ref={pageRef} className={`${styles.affiliatePage} ${styles.hero}`}>
                <MainHeader theme={"light"} containerRef={pageRef} />
            </section>

            <main className={styles.container}>
                <h1 className={styles.title}>New Balance Affiliate Program</h1>

                {SECTIONS.map((section) => (
                    <section key={section.title} className={styles.section}>
                        <h2 className={styles.sectionTitle}>{section.title}</h2>
                        <span className={styles.titleLine} aria-hidden="true" />
                        <p className={styles.sectionText}>{section.text}</p>
                    </section>
                ))}

                <h2 className={styles.faqTitle}>Frequently asked questions</h2>

                <FaqList items={AFFILIATE_FAQ} styles={styles} />

            </main>

            <Footer />
        </>
    );
}

export default AffiliateProgram;