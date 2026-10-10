import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Account.module.css";
import TopHeader from "../../components/TopHeader/TopHeader.jsx";
import MainHeader from "../../components/MainHeader/MainHeader.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { getCurrentUser, logout } from "../../services/api/authService.js";

function Account() {
    const pageRef = useRef(null);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");

    const user = getCurrentUser() || {};
    const userEmail = user.email || "user@example.com";
    const userFullName = user.fullName || "Alex";
    const firstName = userFullName.split(" ")[0];

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
                    {/* Хлебные крошки */}
                    <nav className={styles.breadcrumbs}>
                        <span>Home</span> / <span>My Account</span> / <span className={styles.activeCrumb}>{activeTab}</span>
                    </nav>

                    {/* Горизонтальные вкладки */}
                    <div className={styles.tabsNav}>
                        <button
                            className={`${styles.tabBtn} ${activeTab === "overview" ? styles.activeTab : ""}`}
                            onClick={() => setActiveTab("overview")}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                            Overview
                        </button>

                        <button
                            className={`${styles.tabBtn} ${activeTab === "orders" ? styles.activeTab : ""}`}
                            onClick={() => setActiveTab("orders")}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                <line x1="12" y1="22.08" x2="12" y2="12" />
                            </svg>
                            Orders
                        </button>

                        <button
                            className={`${styles.tabBtn} ${activeTab === "profile" ? styles.activeTab : ""}`}
                            onClick={() => setActiveTab("profile")}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            Profile
                        </button>
                    </div>

                    {/* ВКЛАДКА: OVERVIEW */}
                    {activeTab === "overview" && (
                        <div className={styles.tabSection}>
                            <h1 className={styles.greetingTitle}>Hi {firstName}</h1>
                            <p className={styles.memberSince}>Member since 2026</p>

                            <div className={styles.overviewCardsGrid}>
                                <div className={styles.overviewCard} onClick={() => setActiveTab("profile")}>
                                    <div className={styles.cardHeader}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        <h3>Profile</h3>
                                    </div>
                                    <p>Edit personal details, email and password</p>
                                </div>

                                <div className={styles.overviewCard} onClick={() => setActiveTab("profile")}>
                                    <div className={styles.cardHeader}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                            <line x1="1" y1="10" x2="23" y2="10" />
                                        </svg>
                                        <h3>Address & Payments</h3>
                                    </div>
                                    <p>Edit saved address & payments</p>
                                </div>
                            </div>

                            <section className={styles.benefitsSection}>
                                <h2 className={styles.sectionTitle}>Member benefits</h2>
                                <div className={styles.benefitsGrid}>
                                    <div className={styles.benefitCard}>
                                        <div className={styles.benefitImgPlaceholder}>
                                            <img src="../../../src/assets/images/account-page/photo1.jpg" alt=""/>
                                        </div>
                                        <h4>Free shipping & returns</h4>
                                        <p>Get free shipping and returns on all orders.</p>
                                    </div>

                                    <div className={styles.benefitCard}>
                                        <div className={styles.benefitImgPlaceholder}>
                                            <img src="../../../src/assets/images/account-page/photo2.jpg" alt=""/>
                                        </div>
                                        <h4>Special offers</h4>
                                        <p>Receive members-only offers and sales.</p>
                                    </div>

                                    <div className={styles.benefitCard}>
                                        <div className={styles.benefitImgPlaceholder}>
                                            <img src="../../../src/assets/images/account-page/photo3.jpg" alt=""/>
                                        </div>
                                        <h4>Birthday rewards</h4>
                                        <p>Members receive a special gift on their birthday.</p>
                                    </div>
                                </div>
                            </section>

                            <section className={styles.faqsSection}>
                                {/* Левая колонка: FAQs */}
                                <div className={styles.faqCard}>
                                    <h3 className={styles.cardTitle}>Your Membership FAQs</h3>

                                    <details className={styles.faqItem}>
                                        <summary className={styles.faqSummary}>
                                            <span>When can I start using my benefits?</span>
                                            <span className={styles.accordionIcon}></span>
                                        </summary>
                                        <p className={styles.faqContent}>
                                            You can enjoy benefits immediately after signing up in store or creating an account on newbalance.com. In order to access online member benefits, members must log in. Members that signed up in store need to create an online account and log in to access online member benefits.
                                        </p>
                                    </details>

                                    <details className={styles.faqItem}>
                                        <summary className={styles.faqSummary}>
                                            <span>How do I opt in to receive emails as a New Balance member?</span>
                                            <span className={styles.accordionIcon}></span>
                                        </summary>
                                        <p className={styles.faqContent}>
                                            You can opt in when you create your account, or subscribe to our emails at any time.
                                        </p>
                                    </details>

                                    <details className={styles.faqItem}>
                                        <summary className={styles.faqSummary}>
                                            <span>How do I delete my account?</span>
                                            <span className={styles.accordionIcon}></span>
                                        </summary>
                                        <p className={styles.faqContent}>
                                            You can delete your account at any time by signing in and visiting <strong>My Account</strong>. From there, select <strong>Delete Account</strong> on the profile tab and follow the on-screen instructions to confirm.
                                        </p>
                                    </details>
                                </div>

                                {/* Right Column: Need Help? */}
                                <div className={styles.helpCard}>
                                    <h3 className={styles.cardTitle}>Need Help?</h3>

                                    <div className={styles.helpContent}>
                                        <p>Customer service hours are Monday–Friday 9am–9pm EST, and Saturday–Sunday 9am–6pm EST.</p>
                                        <p>To live chat, use the chat bubble.</p>
                                        <p>
                                            To speak with an agent, call 800-595-9138. <strong>Phone support is closed Sundays.</strong>
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* ВКЛАДКА: ORDERS */}
                    {activeTab === "orders" && (
                        <div className={styles.tabSection}>
                            <h1 className={styles.pageTitle}>Orders</h1>
                            <p className={styles.emptyOrdersText}>You haven't placed any orders yet.</p>
                        </div>
                    )}

                    {/* ВКЛАДКА: PROFILE */}
                    {activeTab === "profile" && (
                        <div className={styles.tabSection}>
                            <h1 className={styles.pageTitle}>Profile</h1>
                            <button className={styles.deleteAccountLink}>Delete account</button>

                            <div className={styles.profileCardsGrid}>
                                <div className={styles.profileBox}>
                                    <div className={styles.boxHeader}>
                                        <span>Personal details</span>
                                        <button className={styles.actionBtn}>Edit</button>
                                    </div>
                                    <p className={styles.boxValue}>{userFullName}</p>
                                </div>

                                <div className={styles.profileBox}>
                                    <div className={styles.boxHeader}>
                                        <span>Login email</span>
                                        <button className={styles.actionBtn}>Change email</button>
                                    </div>
                                    <p className={styles.boxValue}>{userEmail}</p>
                                </div>

                                <div className={styles.profileBox}>
                                    <div className={styles.boxHeader}>
                                        <span>Password</span>
                                        <button className={styles.actionBtn}>Change password</button>
                                    </div>
                                    <p className={styles.boxValue}>••••••••••••</p>
                                </div>

                                <div className={styles.profileBox}>
                                    <div className={styles.boxHeader}>
                                        <span>Mobile number</span>
                                        <button className={styles.actionBtn}>Add mobile number</button>
                                    </div>
                                    <p className={styles.boxValue}>---</p>
                                </div>
                            </div>

                            <section className={styles.sectionBlock}>
                                <div className={styles.blockHeader}>
                                    <h2>Addresses</h2>
                                    <button className={styles.actionBtn}>Add new address</button>
                                </div>
                            </section>

                            <section className={styles.sectionBlock}>
                                <div className={styles.blockHeader}>
                                    <h2>Payments</h2>
                                    <button className={styles.actionBtn}>Add new payment</button>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Кнопка Log Out снизу, как на скриншотах */}
                    <div className={styles.logoutWrapper}>
                        <button className={styles.logoutBtn} onClick={handleLogout}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Log out
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default Account;