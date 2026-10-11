import styles from "./SizeGuide.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
    APPAREL_SIZES,
    formatMeasurement,
    getGuideTitle,
    getGuideType,
    getShoeSizeTable,
    getWidthTable
} from "./sizeGuideData.js";

function SizeGuide({ product, onClose }) {
    const guide = getGuideType(product);
    const isShoes = guide.kind === "shoes";
    const [view, setView] = useState("size");
    const [unit, setUnit] = useState("in");
    const closeRef = useRef(null);
    const tableWrapRef = useRef(null);
    const [closing, setClosing] = useState(false);

    const requestClose = useCallback(() => setClosing(true), []);

    const handleAnimationEnd = (event) => {
        if (closing && event.target === event.currentTarget) onClose();
    };

    useEffect(() => {
        const onKey = (event) => {
            if (event.key === "Escape") requestClose();
        };

        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        closeRef.current?.focus();

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [requestClose]);

    let table;
    if (isShoes) {
        table = view === "size" ? getShoeSizeTable(guide.gender) : getWidthTable(guide.gender);
    }
    else {
        const chart = APPAREL_SIZES[guide.gender];
        table = {
            columns: chart.columns.map(column => (column === "Size" ? column : `${column} (${unit})`)),
            rows: chart.rows.map(row => row.map(cell => (Array.isArray(cell) ? formatMeasurement(cell, unit) : cell)))
        };
    }

    const switchOptions = isShoes
        ? [["size", "Find your size"], ["width", "Find your width"]]
        : [["in", "Inches"], ["cm", "Centimeters"]];
    const switchValue = isShoes ? view : unit;
    const setSwitchValue = isShoes ? setView : setUnit;

    return createPortal(
        <>
            <div className={`${styles.overlay} ${closing ? styles.overlayClosing : ""}`} onClick={requestClose} />

            <aside
                className={`${styles.panel} ${closing ? styles.panelClosing : ""}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="size-guide-title"
                onAnimationEnd={handleAnimationEnd}
            >
                <div className={styles.header}>
                    <h2 id="size-guide-title" className={styles.title}>
                        {isShoes ? "Size and width guide" : "Size guide"}
                    </h2>
                    <button
                        ref={closeRef}
                        type="button"
                        className={styles.close}
                        onClick={requestClose}
                        aria-label="Close size guide"
                    >
                        ✕
                    </button>
                </div>

                <div className={styles.body}>
                    <p className={styles.intro}>
                        {isShoes
                            ? "The best way to get the most out of your shoes? Make sure they fit right. We're proud to offer one of the largest selections of sizes and widths. Let us help you find your best fit"
                            : "The right fit makes all the difference. Use the chart below to compare your measurements and find your best size."}
                    </p>

                    {isShoes && (
                        <button type="button" className={styles.download}>
                            Download Our {guide.gender === "women" ? "Women's" : "Men's"} Printable Measuring Tool
                        </button>
                    )}

                    <h3 className={styles.subtitle}>{getGuideTitle(guide)}</h3>

                    <div className={styles.switch} role="tablist" aria-label={isShoes ? "Guide" : "Units"}>
                        {switchOptions.map(([value, label]) => (
                            <button
                                key={value}
                                type="button"
                                role="tab"
                                aria-selected={switchValue === value}
                                className={`${styles.switchButton} ${switchValue === value ? styles.switchActive : ""}`}
                                onClick={() => setSwitchValue(value)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div ref={tableWrapRef} className={styles.tableWrap}>
                        <table className={`${styles.table} ${isShoes && view === "width" ? styles.tableNarrow : ""}`}>
                            <thead>
                            <tr>
                                {table.columns.map(column => (
                                    <th key={column} scope="col">{column}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {table.rows.map(row => (
                                <tr key={row[0]}>
                                    {row.map((cell, index) => (
                                        index === 0
                                            ? <th key={index} scope="row">{cell}</th>
                                            : <td key={index}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <TableScrollbar targetRef={tableWrapRef} />

                    <p className={styles.footer}>
                        Our dedication to craft means that we are committed to getting the right fit.{" "}
                        <button type="button" className={styles.inlineLink}>Contact us</button>
                        {" "}with questions on how to find the right size, or{" "}
                        <button type="button" className={styles.inlineLink}>Find a store</button>
                        {" "}to get fitted by a pro.
                    </p>
                </div>
            </aside>
        </>,
        document.body
    );
}

function TableScrollbar({ targetRef }) {
    const [thumb, setThumb] = useState({ visible: false, left: 0, width: 100 });
    const trackRef = useRef(null);
    const dragRef = useRef(null);

    useEffect(() => {
        const target = targetRef.current;
        if (!target) return;

        const update = () => {
            const { scrollLeft, scrollWidth, clientWidth } = target;
            const visible = scrollWidth > clientWidth + 1;
            const width = visible ? (clientWidth / scrollWidth) * 100 : 100;
            const left = visible ? (scrollLeft / (scrollWidth - clientWidth)) * (100 - width) : 0;
            setThumb({ visible, left, width });
        };

        const observer = new ResizeObserver(update);
        observer.observe(target);
        if (target.firstElementChild) observer.observe(target.firstElementChild);
        target.addEventListener("scroll", update, { passive: true });

        return () => {
            observer.disconnect();
            target.removeEventListener("scroll", update);
        };
    }, [targetRef]);

    const scrollByStep = (direction) => {
        const target = targetRef.current;
        target?.scrollBy({ left: direction * target.clientWidth * 0.5, behavior: "smooth" });
    };

    const onPointerDown = (event) => {
        const target = targetRef.current;
        if (!target) return;

        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = { x: event.clientX, scrollLeft: target.scrollLeft };
    };

    const onPointerMove = (event) => {
        const target = targetRef.current;
        const track = trackRef.current;
        if (!dragRef.current || !target || !track) return;

        const ratio = target.scrollWidth / track.clientWidth;
        target.scrollLeft = dragRef.current.scrollLeft + (event.clientX - dragRef.current.x) * ratio;
    };

    const onPointerUp = () => {
        dragRef.current = null;
    };

    const onTrackClick = (event) => {
        const target = targetRef.current;
        const track = trackRef.current;
        if (!target || !track || event.target !== track) return;

        const rect = track.getBoundingClientRect();
        const share = (event.clientX - rect.left) / rect.width;
        target.scrollTo({ left: share * target.scrollWidth - target.clientWidth / 2, behavior: "smooth" });
    };

    if (!thumb.visible) return null;

    return (
        <div className={styles.scrollbar}>
            <button type="button" className={styles.scrollArrow} onClick={() => scrollByStep(-1)} aria-label="Scroll table left">
                <svg width="9" height="12" viewBox="0 0 9 12" aria-hidden="true">
                    <path d="M8 1.5v9L1.5 6z" fill="currentColor" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
                </svg>
            </button>

            <div ref={trackRef} className={styles.scrollTrack} onClick={onTrackClick}>
                <div
                    className={styles.scrollThumb}
                    style={{ left: `${thumb.left}%`, width: `${thumb.width}%` }}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                />
            </div>

            <button type="button" className={styles.scrollArrow} onClick={() => scrollByStep(1)} aria-label="Scroll table right">
                <svg width="9" height="12" viewBox="0 0 9 12" aria-hidden="true">
                    <path d="M1 1.5v9L7.5 6z" fill="currentColor" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
}

export default SizeGuide;