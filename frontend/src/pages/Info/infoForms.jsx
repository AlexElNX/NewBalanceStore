import { useState } from "react";
import styles from "./InfoPage.module.css";

const PRIVACY_KEY = "nb-privacy-opt-out";

function readOptOut() {
    try {
        return localStorage.getItem(PRIVACY_KEY) === "true";
    } catch {
        return false;
    }
}

function writeOptOut(value) {
    try {
        localStorage.setItem(PRIVACY_KEY, String(value));
    } catch {
        return;
    }
}

export function PrivacyChoicesForm() {
    const [optOut, setOptOut] = useState(readOptOut);
    const [saved, setSaved] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        writeOptOut(optOut);
        setSaved(true);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.toggle}>
                <input
                    type="checkbox"
                    checked={optOut}
                    onChange={(e) => { setOptOut(e.target.checked); setSaved(false); }}
                />
                Do not sell or share my personal information
            </label>
            <button type="submit" className={styles.submit}>Save my choice</button>
            {saved && (
                <p className={styles.notice}>
                    {optOut
                        ? "Your choice has been saved. We will not sell or share your personal information from this browser."
                        : "Your choice has been saved. Personalized offers are turned on for this browser."}
                </p>
            )}
        </form>
    );
}
