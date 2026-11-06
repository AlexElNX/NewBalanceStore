import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./AddProduct.module.css";
import TopHeader from "../../../components/TopHeader/TopHeader.jsx";
import MainHeader from "../../../components/MainHeader/MainHeader.jsx";
import Footer from "../../../components/Footer/Footer.jsx";
import { createProduct, fetchProduct, updateProduct } from "../../../services/api/productsApi.js";
import Notice from "../../../components/Notice/Notice.jsx";
import { getProductSubcategory } from "../../Products/productTaxonomy.js";

const TYPE_TO_CATEGORY = {
    Footwear: "Shoes",
    Clothing: "Clothing",
    Accessories: "Accessories"
};

const SUBCATEGORIES = {
    Shoes: [],
    Clothing: ["Shirts", "Shorts", "Pants", "Hoodies & Sweatshirts", "Jackets & Vests"],
    Accessories: ["Socks", "Bags", "Hats & Gloves"]
};

const KIDS_SUBCATEGORIES = {
    Shoes: ["Big Kids", "Little Kids", "Babies & Toddlers"],
    Clothing: ["Big Kids", "Little Kids", "Babies & Toddlers"],
    Accessories: SUBCATEGORIES.Accessories
};

const KIDS_SHOE_SIZES = {
    "Big Kids": [3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7],
    "Little Kids": [10.5, 11, 11.5, 12, 12.5, 13, 13.5, 1, 1.5, 2, 2.5, 3],
    "Babies & Toddlers": [2, 3, 4, 5, 6, 7, 8, 9, 10]
};

const SHOE_ACTIVITIES = ["Lifestyle", "Running", "Walking", "Cleats", "Training", "Hiking & Trail", "Tennis", "Basketball", "Skateboarding", "Sandals"];
const MEN_SHOE_ACTIVITIES = ["Lifestyle", "Running", "Walking", "Cleats", "Basketball", "Hiking & Trail", "Skateboarding", "Training", "Tennis", "Sandals"];
const SPORTS = ["Soccer", "Tennis", "Running", "Basketball", "Football", "Training", "Golf"];
const KIDS_SPORTS = ["Basketball", "Baseball", "Soccer", "Running", "Tennis", "Lacrosse", "Skateboarding", "Softball"];

function getSubcategoryOptions(category, gender) {
    const source = gender === "Kids" ? KIDS_SUBCATEGORIES : SUBCATEGORIES;
    return source[category] || [];
}

function getActivityOptions(category, gender) {
    const isKids = gender === "Kids";
    if (category === "Shoes")
        return isKids ? ["Lifestyle", ...KIDS_SPORTS] : (gender === "Men" ? MEN_SHOE_ACTIVITIES : SHOE_ACTIVITIES);
    return isKids ? KIDS_SPORTS : SPORTS;
}

function categoryToType(category) {
    if (category === "Shoes") return "Footwear";
    if (category === "Clothing") return "Clothing";
    return "Accessories";
}

function formatColorLabel(colorKey) {
    const text = colorKey.replace(/_/g, " ");
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function AddProduct() {
    const pageRef = useRef(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [loadedProduct, setLoadedProduct] = useState(null);
    const [loadError, setLoadError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [notice, setNotice] = useState(null);

    // Form fields
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Shoes");
    const [gender, setGender] = useState("Unisex");
    const [activity, setActivity] = useState("Lifestyle");
    const [subcategory, setSubcategory] = useState("");
    const [price, setPrice] = useState("");
    const [oldPrice, setOldPrice] = useState("");

    // Status Flags
    const [isNew, setIsNew] = useState(true);

    // Variants
    const [selectedColors, setSelectedColors] = useState([]);
    const [colorVariants, setColorVariants] = useState({});

    // Images stored per color
    const [colorImages, setColorImages] = useState({});

    const availableColors = [
        "Black", "White", "Red", "Grey", "Blue",
        "Green", "Pink", "Tan", "Orange", "Purple",
        "Brown", "Yellow"
    ];

    const footwearSizes = [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 12.5];
    const clothingSizes = ["XS", "S", "M", "L", "XL", "2XL"];

    const kidsShoeSizes = gender === "Kids" && category === "Shoes" ? KIDS_SHOE_SIZES[subcategory] : null;
    const activeSizesList = (category === "Clothing" || category === "Accessories") ? clothingSizes : (kidsShoeSizes || footwearSizes);

    const genderOptions = ["Unisex", "Men", "Women", "Kids"];
    const isShoes = category === "Shoes";
    const visibleActivityOptions = getActivityOptions(category, gender);
    const subcategoryOptions = getSubcategoryOptions(category, gender);

    const extraColors = selectedColors.filter((colorKey) =>
        !availableColors.some((color) => color.toLowerCase() === colorKey)
    );

    const getSizesForColor = (colorKey) => {
        const selected = Object.keys(colorVariants[colorKey] || {});
        const extra = selected.filter((size) => !activeSizesList.some((item) => String(item) === size));
        return [...activeSizesList, ...extra];
    };

    useEffect(() => {
        if (!isEdit) return;

        let cancelled = false;

        async function loadProduct() {
            try {
                const product = await fetchProduct(id);
                if (cancelled) return;

                const images = product.images || {};
                const variants = product.variants || [];

                const colors = [...new Set([
                    ...(product.colors || []),
                    ...Object.keys(images),
                    ...variants.map((variant) => variant.color)
                ])].filter(Boolean).map((color) => color.toLowerCase());

                const variantsByColor = {};
                variants.forEach((variant) => {
                    const colorKey = String(variant.color).toLowerCase();
                    variantsByColor[colorKey] = {
                        ...(variantsByColor[colorKey] || {}),
                        [String(variant.size)]: variant.quantity
                    };
                });

                const imagesByColor = {};
                Object.entries(images).forEach(([color, list]) => {
                    imagesByColor[color.toLowerCase()] = list || [];
                });

                setProductName(product.name || "");
                setDescription(product.description || "");
                const loadedCategory = TYPE_TO_CATEGORY[product.type] || "Accessories";
                setCategory(loadedCategory);
                const loadedSubcategory = getProductSubcategory(product)?.label;
                setSubcategory(getSubcategoryOptions(loadedCategory, product.gender).includes(loadedSubcategory) ? loadedSubcategory : "");
                setGender(product.gender || "Unisex");
                const loadedActivity = product.activity || "";
                if (product.type === "Footwear")
                    setActivity(loadedActivity || "Lifestyle");
                else
                    setActivity(loadedActivity === "Lifestyle" ? "" : loadedActivity);
                setPrice(product.price != null ? String(product.price) : "");
                setOldPrice(product.oldPrice != null ? String(product.oldPrice) : "");
                setIsNew(Boolean(product.isNew));
                setSelectedColors(colors);
                setColorVariants(variantsByColor);
                setColorImages(imagesByColor);
                setLoadedProduct(product);
            }
            catch (error) {
                console.error("Load product error:", error);
                if (!cancelled) setLoadError("Failed to load product.");
            }
        }

        loadProduct();

        return () => {
            cancelled = true;
        };
    }, [id, isEdit]);

    // Toggle Colors & manage image key cleanup
    const toggleColor = (color) => {
        const colorKey = color.toLowerCase();

        setSelectedColors((prev) => {
            if(prev.includes(colorKey)) {
                // Remove images
                setColorImages((prevImgs) => {
                    const newImgs = { ...prevImgs };
                    delete newImgs[colorKey];
                    return newImgs;
                });
                // Remove variants
                setColorVariants((prevVariants) => {
                    const newVariants = { ...prevVariants };
                    delete newVariants[colorKey];
                    return newVariants;
                });
                return prev.filter((c) => c !== colorKey);
            }
            return [...prev, colorKey];
        });
    };

    //  Toggle Size for a specific color
    const toggleSizeForColor = (colorKey, size) => {
        setColorVariants((prev) => {
            const currentColorData = prev[colorKey] || {};
            const newColorData = { ...currentColorData };

            if (size in newColorData) {
                // Deselect size
                delete newColorData[size];
            }
            else {
                // Select size with default quantity 1
                newColorData[size] = 1;
            }

            return {
                ...prev,
                [colorKey]: newColorData
            };
        });
    };

    // Update Quantity for specific color and size
    const handleQuantityChange = (colorKey, size, quantity) => {
        if (quantity === "") {
            setColorVariants((prev) => ({
                ...prev,
                [colorKey]: {
                    ...(prev[colorKey] || {}),
                    [size]: ""
                }
            }));
            return;
        }

        const parsedQty = Math.max(0, parseInt(quantity, 10) || 0);

        setColorVariants((prev) => ({
            ...prev,
            [colorKey]: {
                ...(prev[colorKey] || {}),
                [size]: parsedQty
            }
        }));
    };


    // Category change handler (resets variants if switching categories)
    const syncActivity = (newCategory, newGender) => {
        const options = getActivityOptions(newCategory, newGender);
        if (!options.includes(activity))
            setActivity(newCategory === "Shoes" ? "Lifestyle" : "");
    };

    const handleCategoryChange = (e) => {
        const newCategory = e.target.value;
        setCategory(newCategory);
        setSubcategory("");
        syncActivity(newCategory, gender);
        setColorVariants({});
    };

    const handleGenderChange = (e) => {
        const newGender = e.target.value;
        setGender(newGender);
        if (!getSubcategoryOptions(category, newGender).includes(subcategory)) {
            setSubcategory("");
            if (category === "Shoes")
                setColorVariants({});
        }
        syncActivity(category, newGender);
    };

    const handleSubcategoryChange = (e) => {
        setSubcategory(e.target.value);
        if (gender === "Kids" && category === "Shoes")
            setColorVariants({});
    };

    // Convert file to Base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    // Handle Image Upload for specific color
    const handleImageUpload = async (e, colorKey) => {
        const files = Array.from(e.target.files);
        if(!files.length) return;

        const base64Images = await Promise.all(files.map((file) => fileToBase64(file)));

        setColorImages((prev) => {
            const currentList = prev[colorKey] || [];
            return {
                ...prev,
                [colorKey]: [...currentList, ...base64Images].slice(0, 8), // Max 8 per color
            };
        });
    };

    // Remove Image for specific color
    const handleRemoveImage = (colorKey, indexToRemove) => {
        setColorImages((prev) => ({
            ...prev,
            [colorKey]: prev[colorKey].filter((_, index) => index !== indexToRemove),
        }));
    };

    // Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();

        const variants = [];

        // Build flat array of variants with exact quantity
        selectedColors.forEach((colorKey) => {
            const sizesData = colorVariants[colorKey] || {};

            Object.entries(sizesData).forEach(([size, quantity]) => {
                variants.push({
                    color: colorKey,
                    size: String(size),
                    quantity: Number(quantity)
                });
            });
        });


        const type = categoryToType(category);
        const isKnownSubcategory = [...Object.values(SUBCATEGORIES).flat(), ...KIDS_SUBCATEGORIES.Shoes].some((item) => item.toLowerCase() === String(loadedProduct?.category || "").toLowerCase());
        const keepCategory = isEdit && loadedProduct && loadedProduct.type === type && loadedProduct.category && !isKnownSubcategory;

        const productData = {
            name: productName,
            price: parseFloat(price) || 0,
            oldPrice: oldPrice ? parseFloat(oldPrice) : null,
            gender: gender,
            type: type,
            category: subcategory || (keepCategory ? loadedProduct.category : category),
            activity: isShoes || visibleActivityOptions.includes(activity) ? activity : "",
            description: description,
            images: colorImages,
            colors: selectedColors,
            isNew: isNew,
            variants
        };

        setNotice(null);

        if (isEdit) {
            setIsSaving(true);
            try {
                await updateProduct(id, productData);
                navigate("/manage-products", { state: { notice: "Product updated successfully!" } });
            }
            catch (error) {
                console.error("Update product error:", error);
                setNotice({ type: "error", text: "Failed to save product. Please log in again as admin and try once more." });
            }
            finally {
                setIsSaving(false);
            }
            return;
        }

        setIsSaving(true);
        try {
            await createProduct(productData);

            console.log("Created Product Data Object:", productData);
            setNotice({ type: "success", text: "Product added successfully!" });
        }
        catch (error) {
            console.error("Create product error:", error);
            setNotice({ type: "error", text: "Failed to add product. Please log in again as admin and try once more." });
        }
        finally {
            setIsSaving(false);
        }
    };

    const pageTitle = isEdit ? "Edit Product" : "Add Product";

    return (
        <>
            <TopHeader />
            <section ref={pageRef} className={`${styles.addProduct} ${styles.hero}`}>
                <MainHeader theme={"light"} containerRef={pageRef} />
            </section>

            <main className={styles.container}>
                <div className={styles.formWrapper}>
                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>{pageTitle}</h1>

                        <button
                            type="button"
                            className={styles.backBtn}
                            onClick={() => navigate(isEdit ? "/manage-products" : "/admin")}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                            {isEdit ? "Back to Products" : "Back to Dashboard"}
                        </button>
                    </div>

                    {isEdit && loadError && <p className={styles.statusText}>{loadError}</p>}
                    {isEdit && !loadError && !loadedProduct && <p className={styles.statusText}>Loading...</p>}

                    {(!isEdit || loadedProduct) && (
                        <form onSubmit={handleSubmit} className={styles.form}>
                            {/* Section 1: Product Information */}
                            <div className={styles.card}>
                                <h2 className={styles.cardTitle}>Product Information</h2>

                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>
                                        Product name <span className={styles.required}>*</span>
                                    </label>
                                    <div className={styles.inputWithCounter}>
                                        <input
                                            type="text"
                                            placeholder="e.g. 9060"
                                            maxLength={150}
                                            value={productName}
                                            onChange={(e) => setProductName(e.target.value)}
                                            required
                                        />
                                        <span className={styles.counter}>{productName.length}/150</span>
                                    </div>
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>
                                        Description <span className={styles.required}>*</span>
                                    </label>
                                    <textarea
                                        rows={4}
                                        placeholder="Write a detailed description of the product..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className={styles.rowTwoCols}>
                                    <div className={styles.fieldGroup}>
                                        <label className={styles.label}>
                                            Category <span className={styles.required}>*</span>
                                        </label>
                                        <select value={category} onChange={handleCategoryChange} required>
                                            <option value="Shoes">Shoes</option>
                                            <option value="Clothing">Clothing</option>
                                            <option value="Accessories">Accessories</option>
                                        </select>
                                    </div>

                                    <div className={styles.fieldGroup}>
                                        <label className={styles.label}>
                                            Gender <span className={styles.required}>*</span>
                                        </label>
                                        <select value={gender} onChange={handleGenderChange} required>
                                            <option value="Unisex">Unisex</option>
                                            <option value="Men">Men</option>
                                            <option value="Women">Women</option>
                                            <option value="Kids">Kids</option>
                                            {!genderOptions.includes(gender) && (
                                                <option value={gender}>{gender}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>

                                {subcategoryOptions.length > 0 && (
                                    <div className={styles.fieldGroup}>
                                        <label className={styles.label}>
                                            Subcategory <span className={styles.required}>*</span>
                                        </label>
                                        <select value={subcategory} onChange={handleSubcategoryChange} required>
                                            <option value="" disabled>Select subcategory</option>
                                            {subcategoryOptions.map((item) => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>
                                        {isShoes ? <>Activity <span className={styles.required}>*</span></> : "Sport"}
                                    </label>
                                    <select value={activity} onChange={(e) => setActivity(e.target.value)} required={isShoes}>
                                        {!isShoes && <option value="">None</option>}
                                        {visibleActivityOptions.map((item) => (
                                            <option key={item} value={item}>{item}</option>
                                        ))}
                                        {activity && !visibleActivityOptions.includes(activity) && (
                                            <option value={activity}>{activity}</option>
                                        )}
                                    </select>
                                </div>

                                <div className={styles.rowTwoCols}>
                                    <div className={styles.fieldGroup}>
                                        <label className={styles.label}>
                                            Price ($) <span className={styles.required}>*</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="159.99"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className={styles.fieldGroup}>
                                        <label className={styles.label}>Old price ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="199.99"
                                            value={oldPrice}
                                            onChange={(e) => setOldPrice(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Flags: isNew & inStock */}
                                <div className={styles.checkboxGroup}>
                                    <label className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={isNew}
                                            onChange={(e) => setIsNew(e.target.checked)}
                                        />
                                        <span>New Release</span>
                                    </label>
                                </div>
                            </div>

                            {/* Section 2: Colors Selection */}
                            <div className={styles.card}>
                                <h2 className={styles.cardTitle}>Select Colors</h2>
                                <div className={styles.fieldGroup}>
                                    <div className={styles.chipGroup}>
                                        {availableColors.map((color) => {
                                            const colorKey = color.toLowerCase();
                                            const isActive = selectedColors.includes(colorKey);
                                            return (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    className={`${styles.chip} ${isActive ? styles.chipActive : ""}`}
                                                    onClick={() => toggleColor(color)}
                                                >
                                                    {color}
                                                </button>
                                            );
                                        })}
                                        {extraColors.map((colorKey) => (
                                            <button
                                                key={colorKey}
                                                type="button"
                                                className={`${styles.chip} ${styles.chipActive}`}
                                                onClick={() => toggleColor(colorKey)}
                                            >
                                                {formatColorLabel(colorKey)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Sizes & Quantities per Color */}
                            {selectedColors.length > 0 && (
                                <div className={styles.card}>
                                    <h2 className={styles.cardTitle}>Sizes & Stock per Color</h2>
                                    <p className={styles.cardSubtitle}>
                                        Select available sizes and set stock quantity for each selected color.
                                    </p>

                                    {selectedColors.map((colorKey) => {
                                        const selectedSizesData = colorVariants[colorKey] || {};

                                        return (
                                            <div key={colorKey} className={styles.colorVariantsBlock}>
                                                <h3 className={styles.colorHeading}>
                                                    Color: {colorKey.toUpperCase()}
                                                </h3>

                                                {/* Size Chips */}
                                                <div className={styles.fieldGroup}>
                                                    <label className={styles.label}>Select Sizes:</label>
                                                    <div className={styles.chipGroup}>
                                                        {getSizesForColor(colorKey).map((size) => {
                                                            const isSelected = size in selectedSizesData;
                                                            return (
                                                                <button
                                                                    key={size}
                                                                    type="button"
                                                                    className={`${styles.chip} ${isSelected ? styles.chipActive : ""}`}
                                                                    onClick={() => toggleSizeForColor(colorKey, size)}
                                                                >
                                                                    {size}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Quantity Inputs for active sizes */}
                                                {Object.keys(selectedSizesData).length > 0 && (
                                                    <div className={styles.quantitiesGrid}>
                                                        {Object.entries(selectedSizesData).map(([size, qty]) => (
                                                            <div key={size} className={styles.quantityItem}>
                                                                <span className={styles.sizeLabel}>Size {size}:</span>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={qty}
                                                                    onChange={(e) => handleQuantityChange(colorKey, size, e.target.value)}
                                                                    placeholder="Qty"
                                                                    className={styles.qtyInput}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Section 4: Images per Color */}
                            {selectedColors.length > 0 && (
                                <div className={styles.card}>
                                    <h2 className={styles.cardTitle}>Images</h2>
                                    <p className={styles.cardSubtitle}>
                                        The first image will be the product cover for that color.
                                    </p>

                                    {selectedColors.map((colorKey) => {
                                        const imgs = colorImages[colorKey] || [];
                                        const emptySlots = Math.max(0, 4 - imgs.length);

                                        return (
                                            <div key={colorKey} className={styles.colorImagesSection}>
                                                <h3 className={styles.colorHeading}>
                                                    {colorKey.toUpperCase()}
                                                </h3>

                                                <div className={styles.imageGrid}>
                                                    <label className={styles.uploadBox}>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            onChange={(e) => handleImageUpload(e, colorKey)}
                                                            className={styles.fileInput}
                                                        />
                                                        <div className={styles.uploadContent}>
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                                                <polyline points="21 15 16 10 5 21"></polyline>
                                                            </svg>
                                                            <span>+ Add Photo</span>
                                                        </div>
                                                    </label>

                                                    {imgs.map((url, idx) => (
                                                        <div key={idx} className={styles.imagePreviewBox}>
                                                            <img src={url} alt={`${colorKey} ${idx}`} />
                                                            {idx === 0 && (
                                                                <span className={styles.coverBadge}>Cover</span>
                                                            )}
                                                            <button
                                                                type="button"
                                                                className={styles.removeImgBtn}
                                                                onClick={() => handleRemoveImage(colorKey, idx)}
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    ))}

                                                    {Array.from({ length: emptySlots }).map((_, i) => (
                                                        <div key={i} className={styles.emptyBox}>
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2">
                                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                                                <polyline points="21 15 16 10 5 21"></polyline>
                                                            </svg>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <Notice type={notice?.type} onClose={() => setNotice(null)}>{notice?.text}</Notice>

                            {/* Submit Button Container */}
                            <div className={styles.actionContainer}>
                                {isEdit && (
                                    <button
                                        type="button"
                                        className={styles.cancelBtn}
                                        onClick={() => navigate("/manage-products")}
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button type="submit" className={styles.submitBtn} disabled={isSaving}>
                                    {isSaving ? "Saving..." : (isEdit ? "Save Changes" : "Add Product")}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}

export default AddProduct;