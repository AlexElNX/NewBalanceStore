import styles from "./Notice.module.css";

function Notice({ type = "error", children, onClose, className = "" }) {
    if (!children) return null;

    return (
        <div
            className={`${styles.notice} ${type === "success" ? styles.success : styles.error} ${className}`}
            role={type === "error" ? "alert" : "status"}
        >
            <span className={styles.text}>{children}</span>
            {onClose && (
                <button type="button" className={styles.close} onClick={onClose} aria-label="Dismiss message">
                    ×
                </button>
            )}
        </div>
    );
}

export default Notice;
