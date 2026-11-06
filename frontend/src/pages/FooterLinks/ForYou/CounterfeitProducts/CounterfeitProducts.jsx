import { useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./CounterfeitProducts.module.css";
import TopHeader from "../../../../components/TopHeader/TopHeader.jsx";
import MainHeader from "../../../../components/MainHeader/MainHeader.jsx";
import Footer from "../../../../components/Footer/Footer.jsx";
import counterfeitImage from "../../../../assets/images/Counterfeit products/13584_Comp_JK_Image_Counterfeit.webp";

function CounterfeitProducts() {
    const pageRef = useRef(null);

    return (
        <>
            <TopHeader />
            <section ref={pageRef} className={`${styles.counterfeitPage} ${styles.hero}`}>
                <MainHeader theme={"light"} containerRef={pageRef} />
            </section>

            <main className={styles.page}>
                <section className={styles.intro}>
                    <div className={styles.introText}>
                        <h1 className={styles.title}>Counterfeit Products</h1>
                        <span className={styles.titleLine} aria-hidden="true" />
                        <p className={styles.introParagraph}>
                            Counterfeit websites often use the words New Balance in the URL and have content and a layout similar to newbalance.com. Counterfeit products can also be found on discount e-commerce marketplace websites and commercial social media accounts. If a price seems too good to be true, it's probably a fake.
                        </p>
                    </div>

                    <div className={styles.introMedia}>
                        <img
                            className={styles.introImage}
                            src={counterfeitImage}
                            alt="Close-up of the outsole of a New Balance shoe with the NB logo"
                        />
                    </div>
                </section>

                <div className={styles.content}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Accept Only Official New Balance Gear</h2>
                        <span className={styles.sectionLine} aria-hidden="true" />

                        <p>
                            Part of our commitment to helping you get the best performing gear is ensuring the footwear and apparel you purchase is actually made by New Balance.
                        </p>
                        <p>
                            New Balance does not offer its products for sale through individuals, street vendors, flea markets, or house parties. Only New Balance gear purchased from <strong>newbalance.com</strong> and our <strong>authorized athletic footwear retailers</strong> is backed by our <strong>100% Satisfaction Guarantee</strong>.
                        </p>
                        <p>
                            Just because a site has the words "new balance" in the URL doesn't mean it's licensed to sell New Balance products or that the products are authentic. To find a New Balance store near you, use our <Link to="/stores" className={styles.boldLink} onClick={() => window.scrollTo(0, 0)}>Find a Store</Link> tool. To locate international retailers, click on the flag graphic at the top left of the page to select your country.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Report a Counterfeit</h2>
                        <span className={styles.sectionLine} aria-hidden="true" />

                        <p>
                            Report counterfeit New Balance products to <strong>counterfeits@newbalance.com.</strong> This email is for reporting purposes only and we cannot respond to requests to authenticate products.
                        </p>
                        <p>
                            Starting in May 2025, New Balance is replacing the data matrix on its shoe tongue labels with a QR code. This QR code will resolve to a microsite that enables you to self-authenticate their shoes. Simply scan the QR code, link to the microsite, and compare the sizing and other information provided on the microsite with the physical shoe. If the information on the microsite matches the physical characteristics of the shoe, then your shoe is authentic. If the information does not match the shoe you are comparing, then the shoe is not authentic. If the QR code resolves to an e-commerce site or other website, even if that site is a legitimate New Balance-owned website, then the shoe is not authentic. If the shoe does not have a tongue label, then the shoe is not authentic. Please note that on a few selected models, the “tongue” label is placed elsewhere on the shoe. New Balance cannot refund or replace shoes or provide documentation regarding the lack of authenticity if the shoes were not purchased from New Balance or one of our authorized retailers. If your shoe was manufactured prior to May 2025, then it will not have the QR code and cannot be self-authenticated.
                        </p>
                        <p>
                            We stand behind the quality of official New Balance products and appreciate your help in protecting our trusted American brand.
                        </p>
                    </section>

                    <p className={styles.back}>
                        &lt; <Link to="/responsible-leadership" className={styles.boldLink}>Return to Responsible Leadership</Link>
                    </p>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default CounterfeitProducts;