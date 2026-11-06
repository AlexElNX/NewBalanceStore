import { useRef } from "react";
import styles from "./SaleExclusions.module.css";
import TopHeader from "../../../../components/TopHeader/TopHeader.jsx";
import MainHeader from "../../../../components/MainHeader/MainHeader.jsx";
import Footer from "../../../../components/Footer/Footer.jsx";

const LEFT_COLUMN = [
    { title: "Running", items: ["680", "860", "880", "1080", "1240", "1540", "AC RUNNER", "ELLIPSE", "Flite-D*", "Flite-S*", "HIERRO", "LD-X*", "MD-X*", "MORE", "REBEL", "SC ELITE", "SC PACER", "SC TRAIL"] },
    { title: "Lifestyle", items: ["327", "471", "500", "509", "530", "574", "740", "750", "950", "983", "990", "991", "992", "993", "1300", "1890", "1954", "2010", "2811", "5030", "9060", "204L", "880R", "ALLERDALE", "GATOR RUN", "MSMB", "MSNB1", "MT2", "RC56", "TF100", "TL900"] },
    { title: "Lacrosse", items: ["BURN", "FREEZE"] },
    { title: "Baseball & Softball", items: ["3000", "4040", "COMP", "LINDOR", "OHTANI", "VELO"] },
    { title: "Basketball", items: ["FRS", "KAWHI", "MAXEY", "P350"] },
    { title: "Global Football", items: ["442", "TEKELA", "FURON"] }
];

const RIGHT_COLUMN = [
    { title: "American Football", items: ["REV IQ", "REV X"] },
    { title: "Skate", items: ["272", "306", "340", "408", "417", "430", "440", "442", "480", "508", "574", "600", "770", "808", "933", "993", "1010"] },
    { title: "Core Athletic", items: ["928"] },
    { title: "Tennis", items: ["696", "796", "806", "996", "1007", "COCO", "COCO DELRAY", "CT-RALLY"] },
    { title: "Golf", items: ["327", "480", "574", "506", "997", "1982", "202"] },
    { title: "Kids Lifestyle", items: ["327", "530", "574", "740", "990", "2000", "2010", "9060", "204L"] },
    { title: "Kids Performance", items: ["AC RUNNER"] },
    { title: "Apparel", items: ["COCO", "KAWHI", "SHOHEI OHTANI", "GLOBAL FOOTBALL", "KLUTCH ATHLETICS", "NEW YORK ROAD RUNNERS", "MADE IN USA", "SYDNEY MCLAUGHLIN", "GLOBAL FOOTBALL"] },
    { title: "Accessories", items: ["COCO", "'47 BRAND", "SHOHEI OHTANI", "KLUTCH ATHLETICS", "NEW YORK ROAD RUNNERS", "DISTRICT VISION", "INSOLES"] },
    { title: "eGift Card", items: ["Gift Card"], bigItems: true }
];

function ExclusionGroup({ group }) {
    return (
        <section className={styles.group}>
            <h2 className={styles.groupTitle}>{group.title}</h2>
            <ul className={group.bigItems ? styles.bigList : styles.list}>
                {group.items.map((item, index) => (
                    <li key={`${item}-${index}`}>{item}</li>
                ))}
            </ul>
        </section>
    );
}

function SaleExclusions() {
    const pageRef = useRef(null);

    return (
        <>
            <TopHeader />
            <section ref={pageRef} className={`${styles.salePage} ${styles.hero}`}>
                <MainHeader theme={"light"} containerRef={pageRef} />
            </section>

            <main className={styles.container}>
                <div className={styles.columns}>
                    <div className={styles.column}>
                        <h1 className={styles.title}>Sale Exclusions</h1>
                        <span className={styles.titleLine} aria-hidden="true" />
                        <p className={styles.intro}>
                            New Balance strives to offer you the best value for your money with special sales and discounts throughout the year. The following footwear/clothing styles, however, are currently excluded from all discounts, coupons and promotional codes.
                        </p>

                        {LEFT_COLUMN.map((group) => (
                            <ExclusionGroup key={group.title} group={group} />
                        ))}
                    </div>

                    <div className={styles.column}>
                        {RIGHT_COLUMN.map((group) => (
                            <ExclusionGroup key={group.title} group={group} />
                        ))}

                        <p className={styles.note}>*Select styles</p>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default SaleExclusions;