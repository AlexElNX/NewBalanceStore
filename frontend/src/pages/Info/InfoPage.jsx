import { useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./InfoPage.module.css";
import TopHeader from "../../components/TopHeader/TopHeader.jsx";
import MainHeader from "../../components/MainHeader/MainHeader.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import NotFound from "../NotFound/NotFound.jsx";
import { INFO_PAGES } from "./infoPages.jsx";

function InfoPage({ slug }) {
    const pageRef = useRef(null);
    const page = INFO_PAGES.find(item => item.slug === slug);

    if (!page) return <NotFound />;

    const Form = page.form;

    return (
        <>
            <TopHeader />
            <section ref={pageRef} className={`${styles.infoPage} ${styles.hero}`}>
                <MainHeader theme={"light"} containerRef={pageRef} />
            </section>

            <main className={styles.container}>
                <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
                    <Link to="/">Home</Link>
                    <span className={styles.separator} aria-hidden="true">/</span>
                    <span>{page.group}</span>
                </nav>

                <h1 className={styles.title}>{page.title}</h1>
                <span className={styles.titleLine} aria-hidden="true" />

                {page.intro && <p className={styles.intro}>{page.intro}</p>}

                {Form && <Form />}

                {page.sections?.map(section => (
                    <section key={section.heading} className={styles.section}>
                        <h2 className={styles.heading}>{section.heading}</h2>
                        {section.body}
                    </section>
                ))}

                {page.links?.length > 0 && (
                    <div className={styles.links}>
                        {page.links.map(link => (
                            <Link key={link.to} to={link.to} className={styles.button}>
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </>
    );
}

export default InfoPage;
