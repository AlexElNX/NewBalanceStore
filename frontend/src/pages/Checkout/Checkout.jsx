import styles from './Checkout.module.css';
import { Link, useNavigate } from "react-router-dom";
import { clearCart, getCart } from "../../utils/cartStorage.js";
import { useEffect, useState } from "react";
import { getProducts } from "../../services/productsService.js";
import { Cart } from "../../entities/Cart.js";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay.jsx";
import { useLoadingAction } from "../../components/LoadingOverlay/useLoadingAction.js";
import { getCurrentUser, getToken, saveAuth } from "../../services/api/authService.js";
import { register, login } from "../../services/api/authApi.js";


import logoSvg from '../../assets/icons/footer/logo.svg';
import cartSvg from '../../assets/icons/header/cart.svg';
import { apiRequest } from "../../services/api/apiClient.js";

const STEPS = ["Shipping info", "Payment", "Review and buy"];

const GENDER_LABELS = {
    men: "Men's",
    women: "Women's",
    kids: "Kids'",
    unisex: "Unisex",
};

const PAYMENT_METHODS = ["Visa", "Mastercard", "American Express", "Discover"];

const SHIPPING_METHODS = [
    { id: "standard", name: "Standard", note: "3-6 business days", price: 0 },
    { id: "expedited", name: "Expedited", note: "2 business days", price: 19.95 },
    { id: "rush", name: "Rush", note: "1 business day", price: 25.95 },
];

const LEGAL_LINKS = [
    { label: "Terms & Conditions", to: "/terms" },
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "CA Supply Chains Act (SB 657) and Modern Slavery Act Statement", to: "/supply-chains-act" },
];

function Field({ label, name, error, required = true, className = "", disabled = false, ...props }) {
    return (
        <label className={`${styles.field} ${error ? styles.fieldError : ""} ${disabled ? styles.fieldDisabled : ""} ${className}`}>
            <input name={name} placeholder=" " disabled={disabled} {...props} />
            <span className={styles.fieldLabel}>
                {label}{required && <span className={styles.required}> *</span>}
            </span>
            {error && <span className={styles.errorText}>{error}</span>}
        </label>
    );
}

function InfoIcon() {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <span
            className={styles.infoIconWrapper}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <svg className={styles.infoIcon} viewBox="0 0 20 20" aria-hidden="true">
                <circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <path d="M10 9v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="10" cy="6.2" r="1" fill="currentColor" />
            </svg>
            {showTooltip && (
                <div className={styles.taxTooltip}>
                    <p>New Balance is required to collect tax on orders shipping to the following states: AL, AR, AZ, CA, CO, DC, FL, GA, HI, IA, ID, IL, IN, KS, KY, LA, MD, ME, MI, MO, MS, NC, ND, NE, NM, NV, OH, OK, RI, SC, SD, TN, TX, UT, VA, VT, WA, WI, WV, WY. We are also required to collect sales tax on orders shipping to CT, MA, MN, NJ, NY, and PA (in these states exemptions may apply). New Balance does not benefit in any way from the collection of sales tax. All collected tax is remitted directly to the appropriate taxing jurisdiction.</p>
                    <p style={{ marginTop: "8px" }}>eGifts and Gift Cards – No sales tax is charged when buying New Balance eGifts or Gift Cards. The appropriate sales tax will be charged on the purchase when the eGift or Gift Card is redeemed.</p>
                </div>
            )}
        </span>
    );
}

function Checkout() {
    const [products, setProducts] = useState([]);
    const [step, setStep] = useState(0);
    const [showErrors, setShowErrors] = useState(false);
    const [selectedShipping, setSelectedShipping] = useState("standard");
    const { loading, run } = useLoadingAction();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const currentUser = getCurrentUser();

    const [form, setForm] = useState({
        email: currentUser?.email || "",
        phone: currentUser?.phone || "",
        firstName: currentUser?.fullName ? currentUser.fullName.split(" ")[0] : "",
        lastName: currentUser?.fullName ? currentUser.fullName.split(" ").slice(1).join(" ") : "",
        address: currentUser?.address || "",
        country: "United States",
        newsletter: false,
        cardNumber: "",
        cardName: "",
        cardExpiry: "",
        cardCvv: "",
        password: ""
    });

    useEffect(() => {
        async function loadProducts() {
            setProducts(await getProducts());
        }
        loadProducts();
    }, []);

    const colorMap = {
        white: "White", white1: "White", white2: "White",
        black_and_white: "Black & White", black: "Black", gray: "Gray",
        tan: "Tan", green: "Green", blue: "Blue", purple: "Purple",
        pink: "Pink", red: "Red", multi_color: "Multi Color"
    };

    if (!products.length) {
        return <LoadingOverlay />;
    }

    const cart = new Cart(getCart());
    const cartProducts = cart.getItems(products);

    const originalPrice = cart.getOriginalPrice(products);
    const savings = cart.getSavings(products);
    const subtotal = cart.getSubtotal(products);
    const hasDiscount = originalPrice > subtotal;
    const tax = cart.getTax(products);

    const currentShippingObj = SHIPPING_METHODS.find(m => m.id === selectedShipping) || SHIPPING_METHODS[0];
    const shippingCost = currentShippingObj.price;
    const total = subtotal + tax + shippingCost;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let formattedValue = value;

        if (name === "phone") {
            const digits = value.replace(/\D/g, "").slice(0, 10);
            if (digits.length > 6) {
                formattedValue = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
            } else if (digits.length > 3) {
                formattedValue = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
            } else if (digits.length > 0) {
                formattedValue = `(${digits}`;
            } else {
                formattedValue = "";
            }
        } else if (name === "email") {
            formattedValue = value.slice(0, 60);
        } else if (name === "address") {
            formattedValue = value.slice(0, 100);
        } else if (name === "cardNumber") {
            const digits = value.replace(/\D/g, "").slice(0, 16);
            formattedValue = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
        } else if (name === "cardName") {
            formattedValue = value.replace(/[^a-zA-Z\s-]/g, "").slice(0, 30);
        } else if (name === "cardExpiry") {
            const digits = value.replace(/\D/g, "").slice(0, 4);
            let formattedDigits = digits;

            if (digits.length === 1 && parseInt(digits, 10) > 1) {
                formattedDigits = `0${digits}`;
            }
            if (formattedDigits.length >= 2) {
                const month = parseInt(formattedDigits.slice(0, 2), 10);
                if (month < 1) formattedDigits = `01${formattedDigits.slice(2)}`;
                if (month > 12) formattedDigits = `12${formattedDigits.slice(2)}`;
            }

            if (formattedDigits.length === 4) {
                const year = parseInt(formattedDigits.slice(2, 4), 10);
                const currentShortYear = new Date().getFullYear() % 100;
                const maxYear = currentShortYear + 10;

                if (year > maxYear) {
                    formattedDigits = formattedDigits.slice(0, 2) + maxYear;
                }
            }

            if (formattedDigits.length >= 3) {
                formattedValue = `${formattedDigits.slice(0, 2)}/${formattedDigits.slice(2)}`;
            } else {
                formattedValue = formattedDigits;
            }
        } else if (name === "cardCvv") {
            formattedValue = value.replace(/\D/g, "").slice(0, 3);
        } else {
            formattedValue = type === "checkbox" ? checked : value;
        }

        setForm(prev => ({
            ...prev,
            [name]: formattedValue
        }));
    };

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    const phoneDigitsCount = form.phone.replace(/\D/g, "").length;
    const phoneValid = phoneDigitsCount === 10;
    const addressValid = Boolean(form.firstName.trim() && form.lastName.trim() && form.address.trim());

    const passwordValid = currentUser ? true : (
        form.password.length >= 8 &&
        /[A-Z]/.test(form.password) &&
        /[a-z]/.test(form.password) &&
        /\d/.test(form.password) &&
        /[!@#$%&*]/.test(form.password)
    );

    const formValid = emailValid && phoneValid && addressValid && passwordValid;

    const cardDigits = form.cardNumber.replace(/\s+/g, "");
    const cardValid = /^\d{15,16}$/.test(cardDigits);

    const expiryFormatValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(form.cardExpiry);
    let expiryValid = false;
    if (expiryFormatValid) {
        const [monthStr, yearStr] = form.cardExpiry.split("/");
        const expMonth = parseInt(monthStr, 10);
        const expYear = 2000 + parseInt(yearStr, 10);
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (
            expYear >= currentYear &&
            expYear <= currentYear + 10 &&
            !(expYear === currentYear && expMonth < currentMonth)
        ) {
            expiryValid = true;
        }
    }

    const cvvValid = /^\d{3,4}$/.test(form.cardCvv);
    const paymentValid = cardValid && expiryValid && cvvValid && form.cardName.trim();

    const shippingErrors = showErrors ? {
        email: !emailValid && "Please enter a valid email address.",
        phone: !phoneValid && "Please enter a valid 10-digit phone number.",
        firstName: !form.firstName.trim() && "Please enter your first name.",
        lastName: !form.lastName.trim() && "Please enter your last name.",
        address: !form.address.trim() && "Please enter your street address (max 100 chars).",
        password: !currentUser && !passwordValid && "Password must contain at least 8 chars, 1 uppercase, 1 lowercase, 1 number, and 1 special char (!@#$%&*).",
    } : {};

    const paymentErrors = showErrors ? {
        cardNumber: !cardValid && "Please enter a valid card number.",
        cardName: !form.cardName.trim() && "Please enter the name on the card.",
        cardExpiry: !expiryValid && (expiryFormatValid ? "The card has expired." : "Use the MM/YY format."),
        cardCvv: !cvvValid && "Please enter the security code.",
    } : {};

    function goToStep(nextStep, valid) {
        if (!valid) {
            setShowErrors(true);
            return;
        }
        setShowErrors(false);
        run(() => {
            setStep(nextStep);
            window.scrollTo(0, 0);
        });
    }

    async function handleSubmit() {
        try {
            let activeUser = getCurrentUser();

            if (!getToken()) {
                let authData;

                try {
                    authData = await register(
                        form.email,
                        form.password,
                        `${form.firstName} ${form.lastName}`.trim()
                    );
                } catch {
                    try {
                        authData = await login(form.email, form.password);
                    } catch (err) {
                        throw new Error(
                            "Could not create an account or sign in. Please check your email and password.",
                            { cause: err }
                        );
                    }
                }

                if (!authData?.token) {
                    throw new Error("Authentication did not return a valid token.");
                }

                saveAuth(authData);
                activeUser = getCurrentUser();
            }

            if (!getToken()) {
                throw new Error("You must be signed in to place an order.");
            }

            const orderPayload = {
                customerName: `${form.firstName} ${form.lastName}`.trim(),
                customerEmail: form.email,
                customerPhone: form.phone,
                shippingAddress: form.address,
                shippingMethod: currentShippingObj.name,
                items: cartProducts.map(item => ({
                    productId: Number(item.product.id),
                    color: item.color,
                    size: String(item.size),
                    quantity: item.quantity
                }))
            };

            const createdOrder = await apiRequest("/api/Orders", {
                method: "POST",
                body: JSON.stringify(orderPayload)
            });

            const orderId = createdOrder?.id;

            if (!orderId) {
                throw new Error("The order was not created successfully.");
            }

            try {
                await apiRequest(`/api/Orders/${orderId}/status`, {
                    method: "PATCH",
                    body: JSON.stringify("Paid")
                });
            } catch (statusErr) {
                console.warn("Status update endpoint skipped:", statusErr);
            }

            if (activeUser) {
                const updatedUser = {
                    ...activeUser,
                    phone: activeUser.phone || form.phone,
                    address: activeUser.address || form.address,
                    firstName: activeUser.firstName || form.firstName,
                    lastName: activeUser.lastName || form.lastName
                };

                localStorage.setItem("authUser", JSON.stringify(updatedUser));
            }

            const userEmailKey = form.email.trim().toLowerCase();
            const existingOrders = JSON.parse(localStorage.getItem(`orders_${userEmailKey}`) || "[]");

            const finalOrderToSave = {
                id: orderId,
                customerName: `${form.firstName} ${form.lastName}`.trim(),
                shippingAddress: form.address,
                totalAmount: total,
                status: "Paid",
                createdAt: createdOrder?.createdAt || new Date().toISOString(),
                items: cartProducts.map(item => ({
                    productName: item.product.name,
                    color: item.color,
                    size: item.size,
                    quantity: item.quantity,
                    price: item.product.price
                }))
            };

            localStorage.setItem(`orders_${userEmailKey}`, JSON.stringify([finalOrderToSave, ...existingOrders]));

            clearCart();
            window.dispatchEvent(new Event("storage"));

            navigate("/account", {
                replace: true,
                state: { placedOrderId: orderId }
            });

        } catch (err) {
            console.error("Failed to process order:", err);
            alert(err.message || "Something went wrong while placing your order.");
        }
    }

    const getGender = (gender) => GENDER_LABELS[String(gender ?? "").toLowerCase()] ?? gender;

    return (
        <>
            <header className={styles.checkoutHeader}>
                <div className={styles.headerInner}>
                    <div className={styles.brand}>
                        <Link to="/">
                            <img src={logoSvg} alt="NB Logo"/>
                        </Link>
                        <span>Secure checkout</span>
                    </div>
                    <div className={styles.cart}>
                        <Link to="/cart">
                            <img src={cartSvg} alt=""/>
                        </Link>
                    </div>
                </div>
            </header>

            <div className={styles.checkoutWrapper}>
                <nav className={styles.breadcrumbs} aria-label="Checkout steps">
                    {STEPS.map((label, index) => (
                        <button
                            key={label}
                            type="button"
                            className={index === step ? styles.stepActive : ""}
                            disabled={index >= step}
                            onClick={() => goToStep(index, true)}
                        >
                            {label}
                        </button>
                    ))}
                </nav>

                <div className={styles.checkoutGrid}>
                    <div className={styles.checkoutMain}>
                        {step === 0 && (
                            <>
                                <section className={`${styles.section} ${styles.contactSection}`}>
                                    <h2>Contact</h2>
                                    <div className={styles.row}>
                                        <Field
                                            label="Email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            maxLength={60}
                                            value={form.email}
                                            onChange={handleChange}
                                            error={shippingErrors.email}
                                        />
                                        <Field
                                            label="Phone number (US)"
                                            name="phone"
                                            type="tel"
                                            inputMode="numeric"
                                            autoComplete="tel"
                                            placeholder="(123) 456-7891"
                                            maxLength={14}
                                            value={form.phone}
                                            onChange={handleChange}
                                            error={shippingErrors.phone}
                                        />
                                    </div>

                                    {!currentUser && (
                                        <div style={{ marginTop: "12px", position: "relative" }}>
                                            <Field
                                                label="Create Password for Account"
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                autoComplete="new-password"
                                                value={form.password}
                                                onChange={handleChange}
                                                error={shippingErrors.password}
                                                style={{ paddingRight: "40px" }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(prev => !prev)}
                                                style={{
                                                    position: "absolute",
                                                    right: "12px",
                                                    top: "50%",
                                                    transform: "translateY(-50%)",
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    padding: "4px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: "#757575",
                                                    zIndex: 2
                                                }}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                                    </svg>
                                                ) : (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                        <circle cx="12" cy="12" r="3"></circle>
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    )}

                                    <label className={styles.newsletter}>
                                        <input name="newsletter" type="checkbox" checked={form.newsletter} onChange={handleChange}/>
                                        <span>
                                            Sign up for email to hear about product launches, exclusive offers and athlete news. By subscribing, I am agreeing to the New Balance <Link to="/privacy-policy">Privacy Policy</Link> and <Link to="/terms">Terms & Conditions</Link>.
                                        </span>
                                    </label>
                                </section>

                                <section className={`${styles.section} ${styles.shippingSection}`}>
                                    <h2>Shipping address</h2>
                                    <div className={styles.thumbs}>
                                        {cartProducts.map(item => (
                                            <img
                                                key={`${item.product.id}-${item.color}-${item.size}`}
                                                src={item.product.images?.[item.color]?.[0]}
                                                alt={item.product.name}
                                            />
                                        ))}
                                    </div>
                                    <div className={styles.row}>
                                        <Field
                                            label="First Name"
                                            name="firstName"
                                            type="text"
                                            autoComplete="given-name"
                                            value={form.firstName}
                                            onChange={handleChange}
                                            error={shippingErrors.firstName}
                                            disabled={Boolean(currentUser)}
                                        />
                                        <Field
                                            label="Last Name"
                                            name="lastName"
                                            type="text"
                                            autoComplete="family-name"
                                            value={form.lastName}
                                            onChange={handleChange}
                                            error={shippingErrors.lastName}
                                            disabled={Boolean(currentUser)}
                                        />
                                    </div>
                                    <Field
                                        label="Street Address"
                                        name="address"
                                        type="text"
                                        autoComplete="street-address"
                                        maxLength={45}
                                        value={form.address}
                                        onChange={handleChange}
                                        error={shippingErrors.address}
                                    />
                                </section>

                                <section className={styles.section}>
                                    <h2>Shipping method</h2>
                                    {addressValid ? (
                                        <div className={styles.methodsList}>
                                            {SHIPPING_METHODS.map(method => (
                                                <label
                                                    key={method.id}
                                                    className={`${styles.methodOption} ${selectedShipping === method.id ? styles.methodOptionActive : ""}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="shippingMethod"
                                                        checked={selectedShipping === method.id}
                                                        onChange={() => setSelectedShipping(method.id)}
                                                    />
                                                    <span>
                                                        <strong>{method.name}</strong>
                                                        <span className={styles.methodNote}>{method.note}</span>
                                                    </span>
                                                    <strong className={styles.methodPrice}>
                                                        {method.price === 0 ? "FREE" : `$${method.price.toFixed(2)}`}
                                                    </strong>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className={styles.methodHint}>Enter your shipping address to view available shipping methods.</p>
                                    )}
                                </section>

                                <button className={styles.continueBtn} onClick={() => goToStep(1, formValid)}>Continue to Payment</button>
                            </>
                        )}

                        {step === 1 && (
                            <section className={styles.section}>
                                <h2>Payment</h2>
                                <p className={styles.acceptLine}>We accept {PAYMENT_METHODS.join(", ")}.</p>
                                <Field
                                    label="Card number"
                                    name="cardNumber"
                                    inputMode="numeric"
                                    autoComplete="cc-number"
                                    maxLength={19}
                                    value={form.cardNumber}
                                    onChange={handleChange}
                                    error={paymentErrors.cardNumber}
                                />
                                <Field
                                    label="Name on card"
                                    name="cardName"
                                    type="text"
                                    autoComplete="cc-name"
                                    maxLength={50}
                                    value={form.cardName}
                                    onChange={handleChange}
                                    error={paymentErrors.cardName}
                                />

                                <div className={styles.row}>
                                    <Field
                                        label="Expiration (MM/YY)"
                                        name="cardExpiry"
                                        inputMode="numeric"
                                        autoComplete="cc-exp"
                                        maxLength={5}
                                        value={form.cardExpiry}
                                        onChange={handleChange}
                                        error={paymentErrors.cardExpiry}
                                    />
                                    <Field
                                        label="Security code"
                                        name="cardCvv"
                                        inputMode="numeric"
                                        autoComplete="cc-csc"
                                        maxLength={3}
                                        value={form.cardCvv}
                                        onChange={handleChange}
                                        error={paymentErrors.cardCvv}
                                    />
                                </div>
                                <button className={styles.continueBtn} onClick={() => goToStep(2, paymentValid)}>Review Order</button>
                            </section>
                        )}

                        {step === 2 && (
                            <section className={styles.section}>
                                <h2>Review and buy</h2>
                                <div className={styles.reviewGrid}>
                                    <div className={styles.reviewBlock}>
                                        <div className={styles.reviewHead}>
                                            <h3>Contact</h3>
                                            <button type="button" onClick={() => goToStep(0, true)}>Edit</button>
                                        </div>
                                        <p>{form.email}</p>
                                        <p>{form.phone}</p>
                                    </div>
                                    <div className={styles.reviewBlock}>
                                        <div className={styles.reviewHead}>
                                            <h3>Shipping address</h3>
                                            <button type="button" onClick={() => goToStep(0, true)}>Edit</button>
                                        </div>
                                        <p>{form.firstName} {form.lastName}</p>
                                        <p>{form.address}</p>
                                        <p>{form.country}</p>
                                    </div>
                                    <div className={styles.reviewBlock}>
                                        <div className={styles.reviewHead}>
                                            <h3>Payment</h3>
                                            <button type="button" onClick={() => goToStep(1, true)}>Edit</button>
                                        </div>
                                        <p>Card ending in {cardDigits.slice(-4)}</p>
                                        <p>{form.cardName}</p>
                                    </div>
                                </div>
                                <button disabled={!formValid || !paymentValid} className={styles.continueBtn} onClick={() => run(handleSubmit)}>Place Order</button>
                            </section>
                        )}
                    </div>

                    {/*Summary Section*/}
                    <aside className={styles.summary}>
                        <h2>Order Summary</h2>
                        {hasDiscount && (
                            <>
                                <p className={styles.summaryRow}>
                                    <span>Original Price</span>
                                    <span>${originalPrice.toFixed(2)}</span>
                                </p>
                                <p className={`${styles.summaryRow} ${styles.savingsRow}`}>
                                    <span>Your savings</span>
                                    <span>${savings.toFixed(2)}</span>
                                </p>
                            </>
                        )}
                        <p className={styles.summaryRow}>
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </p>
                        <p className={styles.summaryRow}>
                            <span>Shipping: {currentShippingObj.name}</span>
                            <span>{shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</span>
                        </p>
                        <div className={styles.summaryRow}>
                            <span className={styles.taxLabel}><InfoIcon />Total Tax</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <p className={`${styles.summaryRow} ${styles.orderTotal}`}>
                            <span>Order total</span>
                            <span>${total.toFixed(2)}</span>
                        </p>

                        <h3 className={styles.summaryShipping}>Shipping</h3>

                        <div className={styles.checkoutProducts}>
                            {cartProducts.map(item => (
                                <div key={`${item.product.id}-${item.color}-${item.size}`} className={styles.checkoutProduct}>
                                    <img className={styles.checkoutProductImage} src={item.product.images?.[item.color]?.[0]} alt={item.product.name} />
                                    <div className={styles.checkoutProductInfo}>
                                        <h4>{item.product.name}</h4>
                                        <p>{getGender(item.product.gender)}</p>
                                        <p>Color: {colorMap[item.color] || item.color}</p>
                                        <p>Size: {item.size}</p>
                                        <p>Qty: {item.quantity} @ ${item.product.price.toFixed(2)}</p>
                                        <p className={styles.checkoutProductPrice}>
                                            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                                            {item.product.oldPrice && (
                                                <span className={styles.oldPrice}>
                                                    ${(item.product.oldPrice * item.quantity).toFixed(2)}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>

            <footer className={styles.checkoutFooter}>
                <div className={styles.accepts}>
                    <span className={styles.acceptsTitle}>We accept:</span>
                    {PAYMENT_METHODS.map(method => (
                        <span key={method} className={styles.acceptBadge}>{method}</span>
                    ))}
                </div>
                <p className={styles.ssl}>SSL Certificate</p>
                <nav className={styles.footerLinks}>
                    {LEGAL_LINKS.map(link => (
                        <Link key={link.to} to={link.to}>{link.label}</Link>
                    ))}
                </nav>
            </footer>

            <LoadingOverlay visible={loading} />
        </>
    );
}

export default Checkout;