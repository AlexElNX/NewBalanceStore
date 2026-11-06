import { useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./SpecialDiscounts.module.css";
import TopHeader from "../../../../components/TopHeader/TopHeader.jsx";
import MainHeader from "../../../../components/MainHeader/MainHeader.jsx";
import Footer from "../../../../components/Footer/Footer.jsx";
import FaqList from "../../../../components/FaqAccordion/FaqList.jsx";
import verifyImage from "../../../../assets/images/Special discounts/NB3371_Comp_R_Image1.jpg";
import exploreImage from "../../../../assets/images/Special discounts/NB3371_Comp_R_Image2.jpg";
import checkoutImage from "../../../../assets/images/Special discounts/NB3371_Comp_R_Image3.jpg";

const STEPS = [
    {
        title: "Verify",
        text: "Verify your status with ID.me. We’ll confirm your eligibility and offer a unique discount code.",
        image: verifyImage,
        alt: "Grey New Balance sweatshirt fabric with an embroidered logo",
    },
    {
        title: "Explore",
        text: "Shop newbalance.com and add eligible items to your bag.",
        image: exploreImage,
        alt: "Grey New Balance apparel on a clothing rack",
    },
    {
        title: "Checkout",
        text: "Use the provided unique discount code at checkout to receive your discount.",
        image: checkoutImage,
        alt: "Dark grey New Balance box with a large logo",
    },
];

function ExclusionsLink() {
    return (
        <Link to="/sale-exclusions" className={styles.boldLink} onClick={() => window.scrollTo(0, 0)}>
            Exclusions apply.
        </Link>
    );
}

const DISCOUNT_FAQ = [
    {
        id: "what-is",
        question: "What is ID.me?",
        answer: (
            <>
                <p>Members of the military, healthcare professionals, first responders, seniors 60+, government employees, and teachers are all eligible for an exclusive discount from New Balance.</p>
                <p>ID.me can verify eligibility and provide customized discount code that can be used at checkout.</p>
            </>
        ),
    },
    {
        id: "excluded",
        question: "Which New Balance products are excluded from this discount?",
        answer: (
            <p>Discount valid only at newbalance.com for full price purchases. Limit one code per customer per 30 days. Cannot be combined with other offers. Each code valid for one-time use only. <ExclusionsLink /></p>
        ),
    },
    {
        id: "eligible",
        question: "Who is eligible?",
        answer: (
            <ul>
                <li><strong>Military:</strong> Active duty, veterans, retirees, spouses, dependents, and more.</li>
                <li><strong>First Responder (active or retired):</strong> Police, firefighters, EMT, 911 dispatchers, and more.</li>
                <li><strong>Teachers:</strong> Classroom teachers, principals, school employees, college professors, and more.</li>
                <li><strong>Nurses:</strong> Advanced Registered Nurse Practitioners (APNP), Registered Nurses (RN), Licensed Practical Nurses (PN/LPN), and more.</li>
                <li><strong>Medical Providers:</strong> Doctors, clinical technicians, dentists, pharmacists, physical or occupational therapists, and more.</li>
                <li><strong>Hospital Employees:</strong> Any individual employed by a hospital or health care system who can provide proof of employment via document or employee email address.</li>
                <li><strong>Seniors:</strong> Individuals 60 years or older, are eligible with proof via driver's license or other proof of identification.</li>
            </ul>
        ),
    },
    {
        id: "create-account",
        question: "How do I create an ID.me account?",
        answer: (
            <p>Click on the verification link and follow the instructions to create an account in order to get verified. After creating your account, confirm your email address, if asked. You’ll then be able to receive your unique discount code that can be used at checkout.</p>
        ),
    },
    {
        id: "other-questions",
        question: "What if I have other ID.me questions?",
        answer: (
            <p>For general ID.me questions please visit the ID.me Help Center.</p>
        ),
    },
    {
        id: "marketing",
        question: "Will creating an ID.me account trigger marketing communications?",
        answer: (
            <p>No, you will not receive communications from ID.me or New Balance unless you opt in to receive such communications.</p>
        ),
    },
];

function SpecialDiscounts() {
    const pageRef = useRef(null);

    return (
        <>
            <TopHeader />
            <section ref={pageRef} className={`${styles.discountsPage} ${styles.hero}`}>
                <MainHeader theme={"light"} containerRef={pageRef} />
            </section>

            <main className={styles.page}>
                <section className={styles.banner}>
                    <div className={styles.bannerText}>
                        <h1 className={styles.bannerTitle}>We appreciate your hard work.</h1>
                        <p>Thanks for being a valued member of our community. We're offering a 15% off online discount to show our gratitude.</p>
                        <p>
                            If you’re a teacher, hospital or medical employee, nurse, first responder, military member, government employee, or a senior 60+, simply verify your affiliation using ID.me. <ExclusionsLink />
                        </p>

                        <div className={styles.bannerButtons}>
                            <Link to="/products" className={styles.bannerButton} onClick={() => window.scrollTo(0, 0)}>
                                Shop now
                            </Link>
                        </div>
                    </div>

                    <p className={styles.finePrint}>
                        Discount valid only at newbalance.com for full price purchases. Limit one code per customer per 30 days. Cannot be combined with other offers. Each code valid for one-time use only. <ExclusionsLink />
                    </p>
                </section>

                <section className={styles.how}>
                    <h2 className={styles.howTitle}>How it works</h2>
                    <span className={styles.titleLine} aria-hidden="true" />

                    <div className={styles.steps}>
                        {STEPS.map((step) => (
                            <article key={step.title} className={styles.step}>
                                <img className={styles.stepImage} src={step.image} alt={step.alt} />
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepText}>{step.text}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className={styles.faq}>
                    <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>

                    <FaqList items={DISCOUNT_FAQ} styles={styles} />

                </section>
            </main>

            <Footer />
        </>
    );
}

export default SpecialDiscounts;