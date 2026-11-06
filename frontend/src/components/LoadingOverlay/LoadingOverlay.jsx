import { createPortal } from "react-dom";
import styles from "./LoadingOverlay.module.css";

function LoadingOverlay({ visible = true }) {
    if (!visible) return null;

    return createPortal(
        <div className={styles.overlay} role="status" aria-live="polite">
            <span className={styles.dots} aria-hidden="true">
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
            </span>
            <span className={styles.label}>Loading</span>
        </div>,
        document.body
    );
}

export default LoadingOverlay;
