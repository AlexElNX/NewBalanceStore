import { useState, useRef, useEffect } from "react";
import styles from "./Login.module.css";
import TopHeader from "../../components/TopHeader/TopHeader.jsx";
import MainHeader from "../../components/MainHeader/MainHeader.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { Link, useNavigate } from "react-router-dom";
import { login, register } from "../../services/api/authApi.js";
import { getCurrentUser, saveAuth } from "../../services/api/authService.js";
import Notice from "../../components/Notice/Notice.jsx";

const PASSWORD_RULES = [
    {
        label: "Minimum of 8 characters",
        error: "Password must contain at least 8 characters",
        test: (password) => password.length >= 8,
    },
    {
        label: "At least 1 uppercase letter",
        error: "Password must contain at least 1 uppercase letter",
        test: (password) => /[A-Z]/.test(password),
    },
    {
        label: "At least 1 lowercase letter",
        error: "Password must contain at least 1 lowercase letter",
        test: (password) => /[a-z]/.test(password),
    },
    {
        label: "At least 1 special character (! @ # $ % & *)",
        error: "Password must contain at least 1 special character",
        test: (password) => /[!@#$%&*]/.test(password),
    },
    {
        label: "At least 1 number",
        error: "Password must contain at least 1 number",
        test: (password) => /\d/.test(password),
    },
    {
        label: "Cannot contain name or email",
        error: "Password cannot contain your name or email",
        test: (password, form) => {
            const value = password.toLowerCase();
            return [form.firstName, form.lastName, form.email.split("@")[0]]
                .map(part => part.trim().toLowerCase())
                .filter(part => part.length >= 3)
                .every(part => !value.includes(part));
        },
    },
];

function FloatingInput({ label, error, children, ...props }) {
    return (
        <div className={`${styles.floatingGroup} ${error ? styles.floatingError : ""}`}>
            <label className={styles.floatingField}>
                <input placeholder=" " {...props} />
                <span className={styles.floatingLabel}>{label}</span>
            </label>
            {children}
            {error && <p className={styles.fieldError}>{error}</p>}
        </div>
    );
}

function Login() {
    const pageRef = useRef(null);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("login");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRules, setShowPasswordRules] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [authError, setAuthError] = useState("");

    useEffect(() => {
        const user = getCurrentUser();
        if (user) {
            if (user.role === "Admin") {
                navigate("/admin", { replace: true });
            } else {
                navigate("/account", { replace: true });
            }
        }
    }, [navigate]);

    const [form, setForm] = useState({
        email: "",
        phone: "",
        firstName: "",
        lastName: "",
        password: "",
        rememberMe: true,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

    const phoneValid = /^\+?[0-9\s()-]{10,20}$/.test(form.phone);

    const loginFormValid =
        form.email === "admin" &&
        form.password.trim() !== "" ||
        emailValid &&
        form.password.trim() !== "";

    const passwordChecks = PASSWORD_RULES.map(rule => ({
        ...rule,
        passed: rule.test(form.password, form),
    }));

    const passwordValid = passwordChecks.every(rule => rule.passed);

    const passwordError = showPasswordRules && form.password
        ? passwordChecks.find(rule => !rule.passed)?.error
        : null;

    const createAccountFormValid =
        emailValid &&
        form.firstName.trim() !== "" &&
        form.lastName.trim() !== "" &&
        passwordValid &&
        (form.phone.trim() === "" || phoneValid) &&
        agreeTerms;

    async function handleLogin() {
        if(!loginFormValid) return;
        setAuthError("");
        try {
            const authData = await login(
                form.email,
                form.password
            );

            saveAuth(authData);

            if (authData.role === "Admin") {
                navigate("/admin");
            }
            else {
                navigate("/account");
            }
        }
        catch (error) {
            console.error("Login error:", error);
            setAuthError("Invalid email or password. Please try again.");
        }
    }

    async function handleCreateAccount() {
        if(!createAccountFormValid) return;
        setAuthError("");
        try {
            const fullName = `${form.firstName} ${form.lastName}`.trim();

            const authData = await register(
                form.email,
                form.password,
                fullName
            );

            saveAuth(authData);

            console.log("Saved token:", localStorage.getItem("authToken"));

            navigate("/account");
        }
        catch (error) {
            console.error("Registration error:", error);
            setAuthError("We couldn't create your account. This email may already be registered, or the server is unavailable. Please try again.");
        }
    }

    return (
        <>
            <TopHeader />
            <section ref={pageRef} className={`${styles.loginPage} ${styles.hero}`}>
                <MainHeader theme={"light"} containerRef={pageRef} />
            </section>

            <main className={styles.authContainer}>
                <div className={styles.authCard}>
                    <div className={styles.banner}>
                        Members get exclusive offers, free returns, & more.
                    </div>

                    <div className={styles.tabToggle}>
                        <button
                            type="button"
                            className={`${styles.tabBtn} ${activeTab === "login" ? styles.activeTab : ""}`}
                            onClick={() => { setActiveTab("login"); setAuthError(""); }}
                        >
                            Log in
                        </button>
                        <button
                            type="button"
                            className={`${styles.tabBtn} ${activeTab === "register" ? styles.activeTab : ""}`}
                            onClick={() => { setActiveTab("register"); setAuthError(""); }}
                        >
                            Create account
                        </button>
                    </div>

                    {activeTab === "login" ? (
                        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                            <div className={styles.inputGroup}>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email or username"
                                    value={form.email}
                                    onChange={handleChange}
                                    noValidate
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.eyeBtn}
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Toggle password visibility"
                                >
                                    <svg width="30px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                        <g id="SVGRepo_iconCarrier">
                                            <path d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z" stroke="#000000" strokeWidth="1.5"></path>
                                            <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="#000000" strokeWidth="1.5"></path>
                                        </g>
                                    </svg>
                                </button>
                            </div>

                            <div className={styles.rowBetween}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        name="rememberMe"
                                        type="checkbox"
                                        checked={form.rememberMe}
                                        onChange={handleChange}
                                    />
                                    Remember me
                                </label>
                            </div>

                            <Notice onClose={() => setAuthError("")}>{authError}</Notice>

                            <button type="submit" className={styles.submitBtn} onClick={handleLogin}>
                                Log in
                            </button>

                            <p className={styles.termsText}>
                                By logging into my account, I agree to New Balance's{" "}
                                <Link to="/terms" className={styles.link}>Terms & Conditions</Link> and{" "}
                                <Link to="/privacy-policy" className={styles.link}>Privacy Policy</Link>.
                            </p>
                        </form>
                    ) : (
                        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                            <FloatingInput
                                label="First name"
                                name="firstName"
                                type="text"
                                autoComplete="given-name"
                                value={form.firstName}
                                onChange={handleChange}
                            />

                            <FloatingInput
                                label="Last name"
                                name="lastName"
                                type="text"
                                autoComplete="family-name"
                                value={form.lastName}
                                onChange={handleChange}
                            />

                            <FloatingInput
                                label="Email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={form.email}
                                onChange={handleChange}
                            />

                            <FloatingInput
                                label="Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                value={form.password}
                                onChange={handleChange}
                                onFocus={() => setShowPasswordRules(true)}
                                error={passwordError}
                            >
                                <button
                                    type="button"
                                    className={styles.floatingEye}
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Toggle password visibility"
                                >
                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                </button>
                            </FloatingInput>

                            {showPasswordRules && (
                                <ul className={styles.passwordRules} aria-live="polite">
                                    {passwordChecks.map(rule => (
                                        <li
                                            key={rule.label}
                                            className={rule.passed ? styles.rulePassed : styles.ruleFailed}
                                        >
                                            <span aria-hidden="true">{rule.passed ? "✓" : "✕"}</span>
                                            {rule.label}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <FloatingInput
                                label="Mobile number (optional)"
                                name="phone"
                                type="tel"
                                autoComplete="tel"
                                value={form.phone}
                                onChange={handleChange}
                                error={form.phone.trim() && !phoneValid ? "Please enter a valid mobile number" : null}
                            />

                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" />
                                <p>
                                    Sign up for email to hear about product launches, exclusive offers and athlete news.
                                </p>
                            </label>

                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                />
                                <p>
                                    By checking the box, you are creating an account with New Balance and you agree to the{" "}
                                    <Link to="/terms" className={styles.link}>Terms & Conditions</Link> and{" "}
                                    <Link to="/privacy-policy" className={styles.link}>Privacy Policy</Link>.
                                </p>

                            </label>

                            <Notice onClose={() => setAuthError("")}>{authError}</Notice>

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                onClick={handleCreateAccount}
                                disabled={!createAccountFormValid}
                            >
                                Create account
                            </button>
                        </form>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}

export default Login;