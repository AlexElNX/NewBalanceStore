import styles from "./ProductFilters.module.css";
import { useState } from "react";
import FilterButton from "./FilterButton.jsx";

function ProductFilters({filters, setFilters, initialFilters, sectionType, sectionGender}) {
    const [openedFilters, setOpenedFilters] = useState({
        productType: false,
        footwearSize: false,
        price: false,
        clothingSize: false,
        accessoryType: false,
        colors: false,
        gender: false,
        activity: false,
    });

    const toggleFilter = (name) => {
        setOpenedFilters(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    const hasActiveFilters = Object.values(filters).some(
        filter => filter.length > 0
    );

    const selectedCategories = filters.category;

    const hasFootwearFilter = filters.footwearSizes.length > 0;
    const hasClothingFilter = filters.clothingSizes.length > 0;
    const hasAccessoryFilter = filters.accessoryType.length > 0;

    const inSection = (type) => !sectionType || sectionType === type;

    const showGender = !sectionGender;

    const showProductType = !sectionType;

    const showFootwearSize = inSection("footwear") && !hasClothingFilter && !hasAccessoryFilter && (selectedCategories.length === 0 || selectedCategories.includes("footwear"));

    const showClothingSize = inSection("clothing") && !hasFootwearFilter && !hasAccessoryFilter && (selectedCategories.length === 0 || selectedCategories.includes("clothing"));

    const showAccessoryType = inSection("accessories") && !hasFootwearFilter && !hasClothingFilter && (selectedCategories.length === 0 || selectedCategories.includes("accessories"));


    const clearFilters = () => {
        setFilters(initialFilters);
    };

    const productTypes = [
        { value: "footwear", label: "Shoes" },
        { value: "clothing", label: "Clothing" },
        { value: "accessories", label: "Accessories" }
    ];

    const footwearSizes = [
        { value: 5, label: "5" },
        { value: 5.5, label: "5.5" },
        { value: 6, label: "6" },
        { value: 6.5, label: "6.5" },
        { value: 7, label: "7" },
        { value: 7.5, label: "7.5" },
        { value: 8, label: "8" },
        { value: 8.5, label: "8.5" },
        { value: 9, label: "9" },
        { value: 9.5, label: "9.5" },
        { value: 10, label: "10" },
        { value: 10.5, label: "10.5" },
        { value: 11, label: "11" },
        { value: 11.5, label: "11.5" },
        { value: 12, label: "12" },
        { value: 12.5, label: "12.5" }
    ];

    const price = [
        { value: "0-24.99", label: "under $25" },
        { value: "25-49.99", label: "$25 - $49.99" },
        { value: "50-74.99", label: "$50 - $74.99" },
        { value: "75-99.99", label: "$75 - $99.99" },
        { value: "100-124.99", label: "$100 - $124.99" },
        { value: "125-149.99", label: "$125 - $149.99" },
        { value: "150-174.99", label: "$150 - $174.99" },
        { value: "175-199.99", label: "$175 - $199.99" },
        { value: "200", label: "over $200" }
    ];

    const clothingSizes = [
        { value: "XS", label: "XS" },
        { value: "S", label: "S" },
        { value: "M", label: "M" },
        { value: "L", label: "L" },
        { value: "XL", label: "XL" },
        { value: "2XL", label: "2XL" }
    ];

    const accessoryType = [
        { value: "Hats & Gloves", label: "Hats & Gloves" },
        { value: "Socks", label: "Socks" },
        { value: "Bags", label: "Bags" }
    ];

    const gender = [
        { value: "Men", label: "Men" },
        { value: "Women", label: "Women" },
        { value: "Unisex", label: "Unisex" }
    ];

    const activity = [
        { value: "Running", label: "Running" },
        { value: "Lifestyle", label: "Lifestyle" },
        { value: "Basketball", label: "Basketball" },
        { value: "Training", label: "Training" },
        { value: "Walking", label: "Walking" },
        { value: "Tennis", label: "Tennis" },
        { value: "Golf", label: "Golf" },
        { value: "Baseball", label: "Baseball" },
        { value: "Skateboarding", label: "Skateboarding" },
        { value: "Soccer", label: "Soccer" },
        { value: "Lacrosse", label: "Lacrosse" },
        { value: "Pickleball", label: "Pickleball" },
    ];

    const colors = [
        { value: "black", color: "black" },
        { value: "white", color: "white" },
        { value: "green", color: "green" },
        { value: "blue", color: "blue" },
        { value: "grey", color: "gray" },
        { value: "red", color: "red" },
        { value: "pink", color: "pink" },
        { value: "tan", color: "tan" },
        { value: "brown", color: "brown" },
        { value: "yellow", color: "yellow" },
        { value: "purple", color: "purple" },
        { value: "orange", color: "orange" }
    ];


    return (
        <aside className={styles.filters}>

            { hasActiveFilters && (
                <button
                    className={styles.clearFiltersBtn}
                    onClick={clearFilters}
                >
                    Clear Filters
                </button>
            )}

            { showGender && (
                <div className={`${styles.filterGroup} ${openedFilters.gender ? styles.active : ""}`}>
                    <h4 onClick={() => toggleFilter("gender")}>Gender</h4>
                    <div className={
                             openedFilters.gender
                                 ? `${styles.filterContent} ${styles.filterContentOpen}`
                                 : styles.filterContent
                         }>
                        { gender.map(item => (
                            <FilterButton
                                key={item.value}
                                filterName="gender"
                                value={item.value}
                                label={item.label}
                                filters={filters}
                                setFilters={setFilters}
                            />
                        ))}
                    </div>
                </div>
            )}

            { showProductType && (
                <div className={`${styles.filterGroup} ${openedFilters.productType ? styles.active : ""}`}>
                    <h4 onClick={() => toggleFilter("productType")}>
                        Product Type
                    </h4>
                    <div className={
                             openedFilters.productType
                                 ? `${styles.filterContent} ${styles.filterContentOpen}`
                                 : styles.filterContent
                         }>
                        { productTypes.map(item => (
                            <FilterButton
                                key={item.value}
                                filterName="category"
                                value={item.value}
                                label={item.label}
                                filters={filters}
                                setFilters={setFilters}
                            />
                        ))}
                    </div>
                </div>
            )}

            { showFootwearSize && (
                <div className={`${styles.filterGroup} ${openedFilters.footwearSize ? styles.active : ""}`}>
                    <h4 onClick={() => toggleFilter("footwearSize")}>
                        Footwear Size
                    </h4>
                    <div className={
                             openedFilters.footwearSize
                                 ? `${styles.filterContent} ${styles.filterContentOpen}`
                                 : styles.filterContent
                         }>
                        { footwearSizes.map(item => (
                            <FilterButton
                                key={item.value}
                                filterName="footwearSizes"
                                value={item.value}
                                label={item.label}
                                filters={filters}
                                setFilters={setFilters}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className={`${styles.filterGroup} ${openedFilters.price ? styles.active : ""}`}>
                <h4 onClick={() => toggleFilter("price")}>
                    Price
                </h4>
                <div className={
                         openedFilters.price
                             ? `${styles.filterContent} ${styles.filterContentOpen}`
                             : styles.filterContent
                     }>
                    { price.map(item => (
                        <FilterButton
                            key={item.value}
                            filterName="price"
                            value={item.value}
                            label={item.label}
                            filters={filters}
                            setFilters={setFilters}
                        />
                    ))}
                </div>
            </div>

            { showClothingSize && (
                <div className={`${styles.filterGroup} ${openedFilters.clothingSize ? styles.active : ""}`}>
                    <h4 onClick={() => toggleFilter("clothingSize")}>
                        Clothing Size
                    </h4>
                    <div className={
                             openedFilters.clothingSize
                                 ? `${styles.filterContent} ${styles.filterContentOpen}`
                                 : styles.filterContent
                         }>
                        { clothingSizes.map(item => (
                            <FilterButton
                                key={item.value}
                                filterName="clothingSizes"
                                value={item.value}
                                label={item.label}
                                filters={filters}
                                setFilters={setFilters}
                            />
                        ))}
                    </div>
                </div>
            )}

            { showAccessoryType && (
                <div className={`${styles.filterGroup} ${openedFilters.accessoryType ? styles.active : ""}`}>
                    <h4 onClick={() => toggleFilter("accessoryType")}>
                        Accessory Type
                    </h4>
                    <div className={
                             openedFilters.accessoryType
                                 ? `${styles.filterContent} ${styles.filterContentOpen}`
                                 : styles.filterContent
                         }>
                        { accessoryType.map(item => (
                            <FilterButton
                                key={item.value}
                                filterName="accessoryType"
                                value={item.value}
                                label={item.label}
                                filters={filters}
                                setFilters={setFilters}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className={`${styles.filterGroup} ${openedFilters.colors ? styles.active : ""}`}>
                <h4 onClick={() => toggleFilter("colors")}>
                    Color
                </h4>
                <div className={
                         openedFilters.colors
                             ? `${styles.filterContent} ${styles.filterContentOpen}`
                             : styles.filterContent
                     }>
                    {colors.map(item => (
                        <FilterButton
                            key={item.value}
                            filterName="colors"
                            value={item.value}
                            color={item.color}
                            filters={filters}
                            setFilters={setFilters}
                        />
                    ))}
                </div>
            </div>

            <div className={`${styles.filterGroup} ${openedFilters.activity ? styles.active : ""}`}>
                <h4 onClick={() => toggleFilter("activity")}>Activity</h4>
                <div className={
                         openedFilters.activity
                             ? `${styles.filterContent} ${styles.filterContentOpen}`
                             : styles.filterContent
                     }>
                    { activity.map(item => (
                        <FilterButton
                            key={item.value}
                            filterName="activity"
                            value={item.value}
                            label={item.label}
                            filters={filters}
                            setFilters={setFilters}
                        />
                    ))}
                </div>
            </div>
        </aside>
    );
}

export default ProductFilters;