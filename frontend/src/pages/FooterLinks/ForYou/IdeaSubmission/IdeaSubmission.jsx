import { useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./IdeaSubmission.module.css";
import TopHeader from "../../../../components/TopHeader/TopHeader.jsx";
import MainHeader from "../../../../components/MainHeader/MainHeader.jsx";
import Footer from "../../../../components/Footer/Footer.jsx";

const CONDITIONS = [
    "We will only consider product designs and ideas. Please do not send us marketing ideas or trademarks.",
    "The design or idea must be novel and must be protected by a patent or patent application. If you need help filing a patent, please refer to the United States Patent and Trademark Office or contact your local state bar organization to seek opinion from a patent attorney or patent agent. The decision to apply for a patent rests entirely with you and you should be aware that there is no guarantee, either expressed or implied, that New Balance has an interest in your submission.",
    "The design or idea must be relevant to our core business (athletic footwear, apparel, and related accessories), must be economically viable from a manufacturing and marketing perspective and, in our opinion, must satisfy the needs of our customers.",
    "Any materials submitted for evaluation will not be returned.",
    "Any materials submitted for evaluation must be submitted on a non-confidential basis. New Balance does NOT execute Non-Disclosure Agreements related to unsolicited invention submissions and, as such, we will immediately discard without review any submission requiring a Non-Disclosure Agreement.",
    "All disclosures MUST be submitted directly to our Intellectual Property Department for review. Please do not attempt to submit your design or idea to any other New Balance employee as you will only be directed back to this procedure and any submissions that are not initially vetted by our Intellectual Property Department will be rejected.",
];

function PdfIcon() {
    return (
        <svg className={styles.pdfIcon} viewBox="0 0 48 48" aria-hidden="true">
            <circle cx="24" cy="24" r="22.75" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="M22 10h4v6h4.5L24 23l-6.5-7H22v-6Z" fill="currentColor" />
            <text x="24" y="34.5" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="Arial, Helvetica, sans-serif" fill="currentColor">PDF</text>
        </svg>
    );
}

const SUBMISSION_FORM = [
    "NEW BALANCE EXTERNAL SUBMISSION FORM",
    "",
    "Full name:",
    "Mailing address:",
    "Email:",
    "Phone:",
    "",
    "Patent or application number(s):",
    "Title of the idea or design:",
    "Short description:",
    "List of attached materials:",
    "",
    "I confirm that I have read and accept the submission conditions listed on the Idea Submission page.",
    "",
    "Signature: ______________________    Date: ____________",
    "",
    "Send the completed form and any materials through Customer Care on the Contact Us page.",
].join("\r\n");

function IdeaSubmission() {
    const pageRef = useRef(null);

    return (
        <>
            <TopHeader />
            <section ref={pageRef} className={`${styles.ideaPage} ${styles.hero}`}>
                <MainHeader theme={"light"} containerRef={pageRef} />
            </section>

            <main className={styles.container}>
                <h1 className={styles.title}>Idea Submission</h1>
                <span className={styles.titleLine} aria-hidden="true" />

                <h2 className={styles.subtitle}>Submit Your Patented Idea or Design</h2>

                <p>
                    The below information is available for those with patented product ideas, designs, or inventions. If you have a general suggestion for us regarding products you would like us to offer (for example, bringing back discontinued models, adding activity-specific shoes, etc.), improvements to our current products (for example, new colors, additional widths, etc.), or would like assistance with other issues such as orders or product recommendations, please email us <Link to="/help" onClick={() => window.scrollTo(0, 0)}>here</Link>. We look forward to hearing your suggestions and assisting you in any way we can!
                </p>

                <p>
                    Thank you for your interest in our evaluation procedures for externally submitted inventions and design ideas. As a company, we are, in principle, very happy to evaluate ideas against our specific business requirements, subject to the following conditions:
                </p>

                {CONDITIONS.map((text, index) => (
                    <p key={text}>{index + 1}. {text}</p>
                ))}

                <p>
                    General suggestions about the products we offer, improvements you would like to see, and other feedback or thoughts you would like to share with us should be submitted <Link to="/help" onClick={() => window.scrollTo(0, 0)}>here</Link>. If you feel your patented design or idea satisfies the above conditions, please download the External Submission Form provided below and submit it, with any related materials appended thereto, by email or mail to the appropriate address provided on the Form:
                </p>

                <a
                    href={`data:text/plain;charset=utf-8,${encodeURIComponent(SUBMISSION_FORM)}`}
                    download="external-submission-form.txt"
                    className={styles.pdfLink}
                >
                    <PdfIcon />
                    <span>External Submission Form</span>
                </a>

                <p>
                    Please note that decision time regarding evaluation of submissions can vary from as little as a few weeks to several months. Although we consider every submission that we receive which is sent according to the above conditions, due to the high volume of submissions we unfortunately cannot respond personally to each submission.
                </p>
            </main>

            <Footer />
        </>
    );
}

export default IdeaSubmission;