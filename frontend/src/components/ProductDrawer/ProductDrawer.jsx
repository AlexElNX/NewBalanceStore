import styles from './ProductDrawer.module.css';
import { useState } from "react";
import { flashLoading, withLoading } from "../LoadingOverlay/loadingStore.js";
import { useCart } from "../../context/useCart.js";
import { createPortal } from "react-dom";

const LOW_STOCK_LIMIT = 5;

function ProductDrawer({ product, activeColor, onClose, onAddedToCart }) {
    const { dispatch } = useCart();

    const [selectedColor, setSelectedColor] = useState(activeColor);
    const [selectedSize, setSelectedSize] = useState(null);
    const [imageIndex, setImageIndex] = useState(0);
    const [sizeError, setSizeError] = useState(false);

    if (!product) return null;

    const images = product.images[selectedColor] || [];

    const stock = selectedSize !== null ? product.getAvailableQuantity(selectedColor, selectedSize) : 0;
    const showLowStock = stock > 0 && stock <= LOW_STOCK_LIMIT;

    const allSizes = product.type === "Footwear"
        ? [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 12.5]
        : ["XS", "S", "M", "L", "XL", "2XL"];

    const handleAddToCart = () => {
        if (!selectedSize) {
            setSizeError(true);
            setTimeout(() => setSizeError(false), 2000);
            return;
        }

        withLoading(() => {
            dispatch({
                type: "ADD_PRODUCT",
                payload: {
                    product,
                    color: selectedColor,
                    size: selectedSize,
                }
            });

            onAddedToCart();
            onClose();
        });
    };

    const nextImage = () => {
        setImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return createPortal(
        <>
            <div onClick={onClose} className={styles.productDrawerOverlay} />

            <aside className={styles.productDrawer}>
                <button onClick={onClose} className={styles.drawerClose} aria-label="Close">
                    ✕
                </button>

                {/* Gallery: Mobile slider / Desktop feed */}
                <div className={styles.drawerGallery}>
                    <div className={styles.sliderContainer}>
                        <img src={images[imageIndex]} alt={product.name} className={styles.activeImage} />

                        {images.length > 1 && (
                            <>
                                <button className={`${styles.sliderArrow} ${styles.prevArrow}`} onClick={prevImage}>❮</button>
                                <button className={`${styles.sliderArrow} ${styles.nextArrow}`} onClick={nextImage}>❯</button>

                                <div className={styles.sliderBars}>
                                    {images.map((_, idx) => (
                                        <span
                                            key={idx}
                                            className={`${styles.bar} ${idx === imageIndex ? styles.activeBar : ""}`}
                                            onClick={() => setImageIndex(idx)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className={styles.desktopGalleryList}>
                        {images.map((img, idx) => (
                            <img key={idx} src={img} alt="" />
                        ))}
                    </div>
                </div>

                {/* Product information */}
                <div className={styles.drawerInfo}>
                    <h2 className={styles.drawerName}>{product.name}</h2>

                    <div className={styles.drawerPrice}>
                        <span className={styles.currentPrice}>${product.price}</span>
                        {product.oldPrice && (
                            <span className={styles.oldPrice}>${product.oldPrice}</span>
                        )}
                    </div>

                    <div className={styles.sectionLabel}>
                        Color: <span>{selectedColor}</span>
                    </div>
                    <div className={styles.drawerColors}>
                        {Object.keys(product.images).map(color => (
                            <button
                                key={color}
                                onClick={() => {
                                    if (color !== selectedColor) flashLoading();
                                    setSelectedColor(color);
                                    setImageIndex(0);
                                }}
                                className={`${styles.drawerColor} ${color === selectedColor ? styles.active : ""}`}
                            >
                                <img src={product.images[color][0]} alt={color} />
                            </button>
                        ))}
                    </div>

                    <div className={styles.sectionLabel}>
                        Size: <span>{selectedSize}</span>
                    </div>
                    <div className={styles.drawerSizes}>
                        {allSizes.map(size => {
                            const available = product.isAvailable(selectedColor, size);
                            return (
                                <button
                                    key={size}
                                    disabled={!available}
                                    onClick={() => {
                                        if (size !== selectedSize) flashLoading();
                                        setSelectedSize(size);
                                        setSizeError(false);
                                    }}
                                    className={`
                                        ${styles.drawerSize} 
                                        ${size === selectedSize ? styles.active : ""} 
                                        ${!available ? styles.unavailable : ""}
                                    `}
                                >
                                    {size}
                                </button>
                            );
                        })}
                    </div>

                    {sizeError && (
                        <div className={styles.sizeError}>
                            Please select a size
                        </div>
                    )}

                    {showLowStock && (
                        <p className={styles.lowStock}>Only {stock} left.</p>
                    )}

                    <button onClick={handleAddToCart} className={styles.drawerAddToCart}>
                        Add to Bag
                    </button>
                </div>
            </aside>
        </>,
        document.body
    );
}

export default ProductDrawer;