import { useId } from "react";

function FaqItem({ item, isOpen, onToggle, styles }) {
    const baseId = useId();
    const panelId = `${baseId}-panel`;

    return (
        <section className={styles.faqItem}>
            <h3 className={styles.faqHeading}>
                <button
                    type="button"
                    className={styles.faqTrigger}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={onToggle}
                >
                    <span>{item.question}</span>
                    <svg className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`} viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M2.5 5.5 8 11l5.5-5.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </h3>

            <div id={panelId} className={styles.faqPanel} hidden={!isOpen}>
                {item.answer}
            </div>
        </section>
    );
}

export default FaqItem;