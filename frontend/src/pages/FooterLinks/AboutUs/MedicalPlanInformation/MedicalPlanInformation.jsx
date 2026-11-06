import { useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./MedicalPlanInformation.module.css";
import TopHeader from "../../../../components/TopHeader/TopHeader.jsx";
import MainHeader from "../../../../components/MainHeader/MainHeader.jsx";
import Footer from "../../../../components/Footer/Footer.jsx";

function MedicalPlanInformation() {
    const pageRef = useRef(null);

    return (
        <>
            <TopHeader />
            <section ref={pageRef} className={`${styles.medicalPage} ${styles.hero}`}>
                <MainHeader theme={"light"} containerRef={pageRef} />
            </section>

            <main className={styles.container}>
                <h1 className={styles.title}>Your Rights and Protections Against Surprise Medical Bills</h1>
                <span className={styles.titleLine} aria-hidden="true" />

                <h2 className={styles.lead}>
                    When you get emergency care or get treated by an out-of-network provider at an in-network hospital or ambulatory surgical center, you are protected from surprise billing or balance billing.
                </h2>
                <span className={styles.titleLine} aria-hidden="true" />

                <h3 className={styles.question}>What is “balance billing” (sometimes called “surprise billing”)?</h3>

                <p>
                    When you see a doctor or other health care provider, you may owe certain out-of-pocket costs, such as a copayment, coinsurance, and/or a deductible. You may have other costs or have to pay the entire bill if you see a provider or visit a health care facility that isn’t in your health plan’s network.
                </p>
                <p>
                    “Out-of-network” describes providers and facilities that haven’t signed a contract with your health plan. Out-of-network providers may be permitted to bill you for the difference between what your plan agreed to pay and the full amount charged for a service. This is called “<strong>balance billing</strong>.” This amount is likely more than in-network costs for the same service and might not count toward your annual out-of-pocket limit.
                </p>
                <p>
                    “Surprise billing” is an unexpected balance bill. This can happen when you can’t control who is involved in your care—like when you have an emergency or when you schedule a visit at an in-network facility but are unexpectedly treated by an out-of-network provider.
                </p>

                <h2 className={styles.blueTitle}>You are protected from balance billing for:</h2>

                <h3 className={styles.subTitle}>Emergency services</h3>
                <p>
                    If you have an emergency medical condition and get emergency services from an out-of-network provider or facility, the most the provider or facility may bill you is your plan’s in-network cost-sharing amount (such as copayments and coinsurance). You <strong>can’t</strong> be balance billed for these emergency services. This includes services you may get after you’re in stable condition, unless you give written consent and give up your protections not to be balanced billed for these post-stabilization services.
                </p>

                <h3 className={`${styles.subTitle} ${styles.spaced}`}>Certain services at an in-network hospital or ambulatory surgical center</h3>
                <p>
                    When you get services from an in-network hospital or ambulatory surgical center, certain providers there may be out-of-network. In these cases, the most those providers may bill you is your plan’s in-network cost-sharing amount. This applies to emergency medicine, anesthesia, pathology, radiology, laboratory, neonatology, assistant surgeon, hospitalist, or intensivist services. These providers <strong>can’t</strong> balance bill you and may <strong>not</strong> ask you to give up your protections not to be balance billed.
                </p>
                <p>
                    If you get other services at these in-network facilities, out-of-network providers <strong>can’t</strong> balance bill you, unless you give written consent and give up your protections.
                </p>

                <h2 className={styles.notice}>
                    You’re <u>never</u> required to give up your protections from balance billing. You also aren’t required to get care out-of-network. You can choose a provider or facility in your plan’s network.
                </h2>

                <h2 className={styles.blueTitle}>When balance billing isn’t allowed, you also have the following protections:</h2>

                <ul className={styles.list}>
                    <li>
                        You are only responsible for paying your share of the cost (like the copayments, coinsurance, and deductibles that you would pay if the provider or facility was in-network). Your health plan will pay out-of-network providers and facilities directly.
                    </li>
                    <li>
                        Your health plan generally must:
                        <ul className={styles.list}>
                            <li>Cover emergency services without requiring you to get approval for services in advance (prior authorization).</li>
                            <li>Cover emergency services by out-of-network providers.</li>
                            <li>Base what you owe the provider or facility (cost-sharing) on what it would pay an in‑network provider or facility and show that amount in your explanation of benefits.</li>
                            <li>Count any amount you pay for emergency services or out-of-network services toward your deductible and out-of-pocket limit.</li>
                        </ul>
                    </li>
                </ul>

                <p>
                    <strong>If you believe you’ve been wrongly billed</strong>, you may contact Glenn.Haskell@newbalance.com.
                </p>

                <p className={styles.transparency}>
                    The Transparency in Coverage Final Rules require certain group health plans to disclose on a public website information regarding in-network provider rates and historical out-of-network allowed amounts and billed charges for covered items and services in two separate machine-readable files (MRFs).The MRFs for the benefit package options under the New Balance Athletics Consolidated Welfare Benefits Plan are linked below:
                </p>

                <ul className={styles.list}>
                    <li><Link to="/help">Click here MRF link</Link> for negotiated in-network provider rates</li>
                    <li><Link to="/help">Click here</Link> to learn more about the new Zero Deductible Plan.</li>
                </ul>
            </main>

            <Footer />
        </>
    );
}

export default MedicalPlanInformation;