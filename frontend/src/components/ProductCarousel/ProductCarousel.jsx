import styles from "./ProductCarousel.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import ProductCard from "../ProductCard/ProductCard.jsx";

function ProductCarousel({ title, products, wide = false }) {
    const trackRef = useRef(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);
    const [progress, setProgress] = useState({ width: 100, offset: 0 });

    const update = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;

        const { scrollLeft, scrollWidth, clientWidth } = track;
        const maxScroll = scrollWidth - clientWidth;

        setCanPrev(scrollLeft > 2);
        setCanNext(scrollLeft < maxScroll - 2);

        const width = scrollWidth > 0 ? Math.min(100, (clientWidth / scrollWidth) * 100) : 100;
        const offset = maxScroll > 0 ? (scrollLeft / maxScroll) * (100 - width) : 0;
        setProgress({ width, offset });
    }, []);

    useEffect(() => {
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [products, update]);

    const scroll = (direction) => {
        const track = trackRef.current;
        if (!track) return;

        track.scrollBy({
            left: direction * track.clientWidth * 0.8,
            behavior: "smooth"
        });
    };

    if (!products?.length) {
        return null;
    }

    return (
        <section className={`${styles.carousel} ${wide ? styles.wide : ""}`} aria-label={title}>
            <h2 className={styles.title}>{title}</h2>

            <div className={styles.viewport}>
                {canPrev && (
                    <button
                        type="button"
                        className={`${styles.arrow} ${styles.prev}`}
                        onClick={() => scroll(-1)}
                        aria-label={`Previous — ${title}`}
                    >
                        ‹
                    </button>
                )}

                <div ref={trackRef} className={styles.track} onScroll={update}>
                    {products.map(product => (
                        <div key={product.id} className={styles.item}>
                            <ProductCard product={product} page="cart" />
                        </div>
                    ))}
                </div>

                {canNext && (
                    <button
                        type="button"
                        className={`${styles.arrow} ${styles.next}`}
                        onClick={() => scroll(1)}
                        aria-label={`Next — ${title}`}
                    >
                        ›
                    </button>
                )}
            </div>

            {progress.width < 100 && (
                <div className={styles.progress} aria-hidden="true">
                    <span
                        className={styles.progressThumb}
                        style={{ width: `${progress.width}%`, left: `${progress.offset}%` }}
                    />
                </div>
            )}
        </section>
    );
}

export default ProductCarousel;