import { useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./GiftCards.module.css";
import TopHeader from "../../../../components/TopHeader/TopHeader.jsx";
import MainHeader from "../../../../components/MainHeader/MainHeader.jsx";
import Footer from "../../../../components/Footer/Footer.jsx";
import giftCardImage from "../../../../assets/images/Gift card/NBGiftCardLogo.webp";

function GiftCards() {
    const pageRef = useRef(null);

    return (
        <>
            <TopHeader />
            <section ref={pageRef} className={`${styles.giftPage} ${styles.hero}`}>
                <MainHeader theme={"light"} containerRef={pageRef} />
            </section>

            <main className={styles.container}>
                <div className={styles.layout}>
                    <div className={styles.media}>
                        <img className={styles.cardImage} src={giftCardImage} alt="New Balance Gift Card" />
                    </div>

                    <section className={styles.panel}>
                        <h1 className={styles.title}>The Perfect Gift When You Don’t Know Their Size</h1>
                        <p className={styles.intro}>
                            New Balance Gift Cards are valid on footwear, apparel and accessories purchased at <Link to="/">newbalance.com</Link> and participating New Balance stores.
                        </p>

                        <p className={styles.balanceText}>
                            Gift cards are available in participating New Balance stores. Read our <Link to="/gift-card-terms">Gift Card Terms &amp; Conditions</Link>.
                        </p>
                        <Link to="/stores" className={styles.balanceButton}>Find a store</Link>
                    </section>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default GiftCards;