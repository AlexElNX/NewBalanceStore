import styles from "./SizeSelector.module.css";
import { forwardRef, useCallback, useState } from "react";
import { formatSizeLabel, getSizeGrid } from "../../../utils/productFormat.js";
import SizeGuide from "../SizeGuide/SizeGuide.jsx";

const SizeSelector = forwardRef(function SizeSelector(
    { product, color, selectedSize, onSelect, showError },
    ref
) {
    const [guideOpen, setGuideOpen] = useState(false);
    const closeGuide = useCallback(() => setGuideOpen(false), []);
    const sizes = getSizeGrid(product);
    const isFootwear = product.type === "Footwear";
    const isUnisexShoe = isFootwear && String(product.gender).toLowerCase() === "unisex";

    if (!sizes.length) {
        return null;
    }

    return (
        <div ref={ref} className={styles.sizeSelector}>
            <div className={styles.header}>
                <p className={styles.label}>Size</p>
                <button
                    type="button"
                    className={styles.guideLink}
                    onClick={() => setGuideOpen(true)}
                    aria-haspopup="dialog"
                >
                    Size Guide
                </button>
            </div>

            <div
                className={`${styles.grid} ${isUnisexShoe ? styles.gridWide : ""} ${showError ? styles.gridError : ""}`}
                role="radiogroup"
                aria-label="Size"
            >
                {sizes.map(size => {
                    const available = product.isAvailable(color, size);
                    const isActive = selectedSize !== null && String(size) === String(selectedSize);

                    return (
                        <button
                            type="button"
                            key={size}
                            role="radio"
                            aria-checked={isActive}
                            aria-label={available ? undefined : `${formatSizeLabel(product, size)}, out of stock`}
                            onClick={() => onSelect(size)}
                            className={`${styles.size} ${isActive ? styles.active : ""} ${!available ? styles.unavailable : ""}`}
                        >
                            {formatSizeLabel(product, size)}
                        </button>
                    );
                })}
            </div>

            {showError && (
                <p className={styles.error} role="alert">Please select a size</p>
            )}

            {guideOpen && (
                <SizeGuide
                    product={product}
                    onClose={closeGuide}
                />
            )}
        </div>
    );
});

export default SizeSelector;