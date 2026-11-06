import { Link } from "react-router-dom";
import styles from './ProductCard.module.css';
import { useState } from "react";

import bagSvg from '../../assets/icons/header/bag.svg';

function ProductCard({ product, onQuickAdd, page }) {
    const hasImagesObject = product.images && typeof product.images === 'object';
    const colors = hasImagesObject ? Object.keys(product.images) : [];

    const [activeColor, setActiveColor] = useState(
        colors.length > 0 ? colors[0] : ""
    );
    const [startIndex, setStartIndex] = useState(0);



    const visibleColors = 8;
    const showSliderButtons = colors.length > visibleColors;

    const [hovered, setHovered] = useState(false);

    const isHome = page === "home";
    const isCart = page === "cart";

    let currentImages = [];
    if(hasImagesObject && activeColor) {
        currentImages = product.images[activeColor] || [];
    }

    let image = product.image;
    if(hasImagesObject && currentImages.length > 0) {
        image = (hovered && currentImages.length > 1 && !isCart)
            ? currentImages[1]
            : currentImages[0];
    }

    const hasDiscount = typeof product.hasDiscount === 'function'
        ? product.hasDiscount()
        : Boolean(product.oldPrice);

    return (
        <div className={`${styles.productCard} ${isHome ? styles.homeCard : ""}`}>
            {/* Image wrapper for positioning quickAddBtn */}
            <div className={styles.imageWrapper}>
                <Link to={`/product/${product.id}`}>
                    <img
                        src={isCart ? currentImages[0] : image}
                        onMouseEnter={!isCart ? () => setHovered(true) : undefined}
                        onMouseLeave={!isCart ? () => setHovered(false) : undefined}
                        alt={product.name}
                    />
                </Link>

                {!isHome && !isCart && (
                    <button
                        className={styles.quickAddBtn}
                        onClick={() => onQuickAdd(product, activeColor)}
                        aria-label="Quick Add"
                    >
                        <img src={bagSvg} alt="Bag" />
                    </button>
                )}
            </div>

            {!isHome && !isCart && hasImagesObject && (
                <div className={styles.colorSliderWrapper}>
                    {showSliderButtons && (
                        <button
                            onClick={() => setStartIndex(prev => prev - 1)}
                            className={styles.sliderBtn}
                        >
                            ❮
                        </button>
                    )}

                    <div className={styles.colorSlider}>
                        {colors
                            .slice(startIndex, startIndex + visibleColors)
                            .map(color => (
                                <img
                                    key={color}
                                    src={product.getMainImage(color)}
                                    onClick={() => setActiveColor(color)}
                                    className={color === activeColor ? styles.active : ""}
                                    alt={color}
                                />
                            ))}
                    </div>

                    {showSliderButtons && (
                        <button
                            onClick={() => setStartIndex(prev => prev + 1)}
                            className={styles.sliderBtn}
                        >
                            ❯
                        </button>
                    )}
                </div>
            )}

            {product.isNew && (
                <span className={styles.newBadge}>NEW</span>
            )}

            <Link to={`/product/${product.id}`} className={styles.productTitle}>
                {product.name}
            </Link>

            <p className={styles.productSubtitle}>
                {product.gender}
            </p>

            <div className={styles.productPrice}>
                ${product.price}
                {hasDiscount && (
                    <span className={styles.oldPrice}>
                        ${product.oldPrice}
                    </span>
                )}
            </div>
        </div>
    );
}

export default ProductCard;