import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Account.module.css";
import TopHeader from "../../components/TopHeader/TopHeader.jsx";
import MainHeader from "../../components/MainHeader/MainHeader.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { getCurrentUser, logout } from "../../services/api/authService.js";

// Images
import photo1 from '../../../src/assets/images/account-page/photo1.jpg';
import photo2 from '../../../src/assets/images/account-page/photo2.jpg';
import photo3 from '../../../src/assets/images/account-page/photo3.jpg';

function Account() {
    const pageRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [placedOrderId, setPlacedOrderId] = useState(location.state?.placedOrderId ?? null);
    const [activeTab, setActiveTab] = useState(placedOrderId ? "orders" : "overview");

    const user = getCurrentUser() || {};
    const firstName = user.firstName || user.fullName?.split(" ")[0] || "Alex";
    const email = user.email || "user@example.com";

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    useEffect(() => {
        async function loadOrders() {
            setLoadingOrders(true);
            const userEmailKey = email.trim().toLowerCase();
            const localOrders = JSON.parse(localStorage.getItem(`orders_${userEmailKey}`) || "[]");
            setOrders(localOrders);
            setLoadingOrders(false);
        }

        if (activeTab === "orders") {
            loadOrders();
        }
    }, [activeTab, email]);

    const closeOrderModal = () => {
        setPlacedOrderId(null);
        navigate(location.pathname, { replace: true, state: null });
    };

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <>
            <TopHeader />
            <section ref={pageRef} className={`${styles.accountPage} ${styles.hero}`}>
                <MainHeader theme={"light"} containerRef={pageRef} />
            </section>

            <main className={styles.accountContainer}>
                <div className={styles.wrapper}>
                    <nav className={styles.breadcrumbs}>
                        <span>Home</span> / <span>My Account</span> / <span className={styles.activeCrumb}>{activeTab}</span>
                    </nav>

                    <div className={styles.tabsNav}>
                        <button
                            className={`${styles.tabBtn} ${activeTab === "overview" ? styles.activeTab : ""}`}
                            onClick={() => setActiveTab("overview")}
                        >
                            Overview
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeTab === "orders" ? styles.activeTab : ""}`}
                            onClick={() => setActiveTab("orders")}
                        >
                            Orders
                        </button>
                    </div>

                    {/* OVERVIEW */}
                    {activeTab === "overview" && (
                        <div className={styles.tabSection}>
                            <h1 className={styles.greetingTitle}>Hi {firstName}</h1>
                            <p className={styles.memberSince}>Member since 2026</p>

                            <section className={styles.benefitsSection}>
                                <h2 className={styles.sectionTitle}>Member benefits</h2>
                                <div className={styles.benefitsGrid}>
                                    <div className={styles.benefitCard}>
                                        <div className={styles.benefitImgPlaceholder}><img src={photo1} alt=""/></div>
                                        <h4>Free shipping & returns</h4>
                                        <p>Get free shipping and returns on all orders.</p>
                                    </div>
                                    <div className={styles.benefitCard}>
                                        <div className={styles.benefitImgPlaceholder}><img src={photo2} alt=""/></div>
                                        <h4>Special offers</h4>
                                        <p>Receive members-only offers and sales.</p>
                                    </div>
                                    <div className={styles.benefitCard}>
                                        <div className={styles.benefitImgPlaceholder}><img src={photo3} alt=""/></div>
                                        <h4>Birthday rewards</h4>
                                        <p>Members receive a special gift on their birthday.</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* ORDERS */}
                    {activeTab === "orders" && (
                        <div className={styles.tabSection}>
                            <h1 className={styles.pageTitle}>Order History</h1>
                            {loadingOrders ? (
                                <p className={styles.emptyOrdersText}>Loading orders...</p>
                            ) : orders.length === 0 ? (
                                <p className={styles.emptyOrdersText}>You haven't placed any orders yet.</p>
                            ) : (
                                <div className={styles.ordersList}>
                                    {orders.map((ord, idx) => {
                                        const orderItems = ord.items || ord.products || [];

                                        return (
                                            <div key={ord.id || idx} className={styles.orderCard}>
                                                <div className={styles.orderHeader}>
                                                    <div>
                                                        <span className={styles.orderId}>Order #{ord.id || (idx + 1)}</span>
                                                        <span className={styles.orderDate}>
                                                            {ord.createdAt || ord.date ? new Date(ord.createdAt || ord.date).toLocaleDateString() : "Recent"}
                                                        </span>
                                                    </div>
                                                    <span className={`${styles.orderStatus} ${styles[ord.status?.toLowerCase() || 'paid']}`}>
                                                        {ord.status || "Paid"}
                                                    </span>
                                                </div>

                                                <div className={styles.orderProductsGrid}>
                                                    {orderItems.length > 0 ? (
                                                        orderItems.map((item, i) => {
                                                            const title = item.productName || item.name || item.product?.name || "New Balance Item";
                                                            const priceVal = Number(item.price || item.product?.price || 0);
                                                            const qtyVal = Number(item.quantity || 1);

                                                            return (
                                                                <div key={i} className={styles.orderItemRow}>
                                                                    <div className={styles.orderItemInfo}>
                                                                        <p className={styles.itemName}>{title}</p>
                                                                        <p className={styles.itemMeta}>
                                                                            Color: {item.color || "Standard"} | Size: {item.size || "M"} | Qty: {qtyVal}
                                                                        </p>
                                                                    </div>
                                                                    <span className={styles.itemPrice}>
                                                                        ${(priceVal * qtyVal).toFixed(2)}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <p className={styles.itemMeta}>No item details recorded for this order.</p>
                                                    )}
                                                </div>

                                                <div className={styles.orderFooter}>
                                                    <div className={styles.orderAddress}>
                                                        <span><strong>Shipping to:</strong> {ord.shippingAddress || ord.streetAddress || "Standard Shipping"}</span>
                                                    </div>
                                                    <div className={styles.orderTotal}>
                                                        <span>Total:</span>
                                                        <strong>${Number(ord.totalAmount || ord.total || 0).toFixed(2)}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    <div className={styles.logoutWrapper}>
                        <button className={styles.logoutBtn} onClick={handleLogout}>
                            Log out
                        </button>
                    </div>
                </div>
            </main>

            <Footer />

            {placedOrderId && (
                <div className={styles.modalOverlay} onClick={closeOrderModal}>
                    <div
                        className={`${styles.modalContent} ${styles.orderModal}`}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="order-success-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button type="button" className={styles.modalClose} onClick={closeOrderModal} aria-label="Close">
                            ×
                        </button>
                        <span className={styles.orderSuccessIcon} aria-hidden="true">✓</span>
                        <h3 id="order-success-title">Thank you for your order!</h3>
                        <p className={styles.orderModalText}>
                            Your order <strong>#{placedOrderId}</strong> has been placed. You can track it in your order history.
                        </p>
                        <div className={styles.modalActions}>
                            <Link to="/products" className={styles.cancelBtn} onClick={() => setPlacedOrderId(null)}>
                                Continue shopping
                            </Link>
                            <button type="button" className={styles.saveBtn} onClick={closeOrderModal}>
                                View order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Account;