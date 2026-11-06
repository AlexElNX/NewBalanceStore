import FaqItem from "./FaqItem.jsx";
import { useOpenItems } from "./useOpenItems.js";

function FaqList({ items, styles }) {
    const { isOpen, toggle } = useOpenItems();

    return (
        <div className={styles.faqList}>
            {items.map((item) => (
                <FaqItem
                    key={item.id}
                    item={item}
                    isOpen={isOpen(item.id)}
                    onToggle={() => toggle(item.id)}
                    styles={styles}
                />
            ))}
        </div>
    );
}

export default FaqList;