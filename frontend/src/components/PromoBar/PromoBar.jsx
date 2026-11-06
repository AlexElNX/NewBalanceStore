import styles from "./PromoBar.module.css";
import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PROMO_INTERVAL_MS, PROMO_MESSAGES } from "./promoMessages.js";
import { usePromoRotation } from "./usePromoRotation.js";

const IGNORED_TARGETS = "a, button, input, select, textarea, [role='dialog']";

function PromoText({ parts, onLinkClick }) {
    return parts.map((part, index) =>
        typeof part === "string" ? (
            part
        ) : (
            <Link key={index} to={part.to} className={styles.inlineLink} onClick={onLinkClick}>
                {part.label}
            </Link>
        )
    );
}

function PromoBar({ messages = PROMO_MESSAGES, intervalMs = PROMO_INTERVAL_MS }) {
    const [open, setOpen] = useState(false);
    const [hovered, setHovered] = useState(false);
    const { index, next } = usePromoRotation(messages.length);
    const paused = open || hovered;
    const rootRef = useRef(null);
    const closeRef = useRef(null);
    const panelId = useId();
    const current = messages[index];

    useEffect(() => {
        const header = rootRef.current?.parentElement;
        if (!header) return;

        function handleHeaderClick(event) {
            if (event.target.closest(IGNORED_TARGETS)) return;
            setOpen(true);
        }

        header.addEventListener("click", handleHeaderClick);
        return () => header.removeEventListener("click", handleHeaderClick);
    }, []);

    useEffect(() => {
        if (!open) return;

        function handleClickOutside(event) {
            const header = rootRef.current?.parentElement;
            if (header && !header.contains(event.target)) {
                setOpen(false);
            }
        }

        function handleEscape(event) {
            if (event.key === "Escape") {
                setOpen(false);
            }
        }

        closeRef.current?.focus();
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [open]);

    function handleLinkClick(event) {
        event.stopPropagation();
        setOpen(false);
        window.scrollTo(0, 0);
    }

    function handleBarKeyDown(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
        }
    }

    if (!current) return null;

    return (
        <div ref={rootRef} className={styles.root}>
            <div
                className={`${styles.bar} ${open ? styles.barHidden : ""}`}
                role="button"
                tabIndex={0}
                aria-expanded={open}
                aria-controls={panelId}
                onKeyDown={handleBarKeyDown}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <p key={current.id} className={styles.message} aria-live="polite">
                    <span>{current.title}</span>
                    {current.links.map((link) => (
                        <Link key={link.label} to={link.to} className={styles.barLink} onClick={handleLinkClick}>
                            {link.label}
                        </Link>
                    ))}
                </p>

                {messages.length > 1 && (
                    <div className={styles.progress} aria-hidden="true">
                        {messages.map((message, position) => (
                            <span
                                key={message.id}
                                className={`${styles.segment} ${position === index ? styles.segmentActive : ""}`}
                            >
                                {position === index && (
                                    <span
                                        key={current.id}
                                        className={styles.segmentFill}
                                        style={{
                                            animationDuration: `${intervalMs}ms`,
                                            animationPlayState: paused ? "paused" : "running",
                                        }}
                                        onAnimationEnd={next}
                                    />
                                )}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {open && (
                <div id={panelId} className={styles.panel} role="dialog" aria-label="Promotions">
                    <button
                        ref={closeRef}
                        type="button"
                        className={styles.close}
                        onClick={() => setOpen(false)}
                        aria-label="Close promotions"
                    >
                        <svg viewBox="0 0 20 20" aria-hidden="true">
                            <path d="M4 4l12 12M16 4 4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>

                    <ul className={styles.grid}>
                        {messages.map((message) => (
                            <li key={message.id} className={styles.item}>
                                <h3 className={styles.itemTitle}>{message.title}</h3>
                                <p className={styles.itemText}>
                                    <PromoText parts={message.text} onLinkClick={handleLinkClick} />
                                </p>
                                <div className={styles.actions}>
                                    {message.links.map((link) => (
                                        <Link key={link.label} to={link.to} className={styles.button} onClick={handleLinkClick}>
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default PromoBar;