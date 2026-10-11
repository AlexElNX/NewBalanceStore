import styles from "./ProductGallery.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function ProductGallery({ images, alt }) {
    const trackRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [zoomIndex, setZoomIndex] = useState(null);

    const handleScroll = () => {
        const track = trackRef.current;
        if (!track || !track.clientWidth) return;

        const index = Math.round(track.scrollLeft / track.clientWidth);
        setActiveIndex(Math.min(Math.max(index, 0), images.length - 1));
    };

    const goTo = (index) => {
        const track = trackRef.current;
        if (!track) return;

        const target = Math.min(Math.max(index, 0), images.length - 1);
        track.scrollTo({ left: target * track.clientWidth, behavior: "smooth" });
    };

    if (!images.length) {
        return (
            <div className={styles.gallery}>
                <div className={styles.placeholder}>No image available</div>
            </div>
        );
    }

    return (
        <div className={styles.gallery}>
            <div
                ref={trackRef}
                className={styles.track}
                onScroll={handleScroll}
            >
                {images.map((src, index) => (
                    <button
                        type="button"
                        key={`${src}-${index}`}
                        className={styles.slide}
                        onClick={() => setZoomIndex(index)}
                        aria-label={`Open image ${index + 1} of ${images.length}`}
                    >
                        <img
                            src={src}
                            alt={`${alt} — view ${index + 1}`}
                            loading={index < 2 ? "eager" : "lazy"}
                            draggable={false}
                        />
                    </button>
                ))}
            </div>

            {images.length > 1 && (
                <>
                    {activeIndex > 0 && (
                        <button
                            type="button"
                            className={`${styles.arrow} ${styles.arrowPrev}`}
                            onClick={() => goTo(activeIndex - 1)}
                            aria-label="Previous image"
                        >
                            ‹
                        </button>
                    )}
                    {activeIndex < images.length - 1 && (
                        <button
                            type="button"
                            className={`${styles.arrow} ${styles.arrowNext}`}
                            onClick={() => goTo(activeIndex + 1)}
                            aria-label="Next image"
                        >
                            ›
                        </button>
                    )}

                    <div className={styles.bars}>
                        {images.map((_, index) => (
                            <button
                                type="button"
                                key={index}
                                className={`${styles.bar} ${index === activeIndex ? styles.barActive : ""}`}
                                onClick={() => goTo(index)}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>

                    <span className={styles.counter}>
                        {activeIndex + 1} / {images.length}
                    </span>
                </>
            )}

            {zoomIndex !== null && (
                <ImageViewer
                    images={images}
                    alt={alt}
                    startIndex={zoomIndex}
                    onClose={() => setZoomIndex(null)}
                />
            )}
        </div>
    );
}

function ImageViewer({ images, alt, startIndex, onClose }) {
    const [index, setIndex] = useState(startIndex);
    const touchStartX = useRef(null);
    const lastIndex = images.length - 1;
    const [closing, setClosing] = useState(false);

    const requestClose = useCallback(() => setClosing(true), []);

    const handleAnimationEnd = (event) => {
        if (closing && event.target === event.currentTarget) onClose();
    };

    const next = useCallback(() => setIndex(i => Math.min(i + 1, lastIndex)), [lastIndex]);
    const prev = useCallback(() => setIndex(i => Math.max(i - 1, 0)), []);

    useEffect(() => {
        const onKey = (event) => {
            if (event.key === "Escape") requestClose();
            if (event.key === "ArrowRight") next();
            if (event.key === "ArrowLeft") prev();
        };

        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [requestClose, next, prev]);

    const handleTouchStart = (event) => {
        touchStartX.current = event.touches[0].clientX;
    };

    const handleTouchEnd = (event) => {
        if (touchStartX.current === null) return;

        const distance = event.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;

        if (distance < -50) next();
        if (distance > 50) prev();
    };

    return createPortal(
        <div
            className={`${styles.viewer} ${closing ? styles.viewerClosing : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onAnimationEnd={handleAnimationEnd}
        >
            <button type="button" className={styles.viewerClose} onClick={requestClose} aria-label="Close">
                <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
                    <path d="M4 4l18 18M22 4 4 22" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
                </svg>
            </button>

            <div className={styles.viewerTrack} style={{ transform: `translateX(-${index * 100}%)` }}>
                {images.map((src, slideIndex) => (
                    <div key={`${src}-${slideIndex}`} className={styles.viewerSlide} aria-hidden={slideIndex !== index}>
                        <img
                            className={styles.viewerImage}
                            src={src}
                            alt={`${alt} — view ${slideIndex + 1}`}
                            draggable={false}
                        />
                    </div>
                ))}
            </div>

            {index > 0 && (
                <button type="button" className={`${styles.viewerArrow} ${styles.viewerPrev}`} onClick={prev} aria-label="Previous image">
                    <svg width="12" height="20" viewBox="0 0 12 20" aria-hidden="true"><path d="M10 2 2 10l8 8" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
                </button>
            )}

            {index < lastIndex && (
                <button type="button" className={`${styles.viewerArrow} ${styles.viewerNext}`} onClick={next} aria-label="Next image">
                    <svg width="12" height="20" viewBox="0 0 12 20" aria-hidden="true"><path d="m2 2 8 8-8 8" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
                </button>
            )}
        </div>,
        document.body
    );
}

export default ProductGallery;