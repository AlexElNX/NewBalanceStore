import './Footer.css'
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../services/api/authService.js";
import { FOOTER_COLUMNS, SOCIAL_LINKS } from "./footerLinks.js";
import { useOpenItems } from "../FaqAccordion/useOpenItems.js";

// SVG
import logo from '../../assets/icons/footer/logo.svg';
import brineLogo from '../../assets/icons/footer/brine-logo.svg';
import warriorLogo from '../../assets/icons/footer/warror.svg';
import teamSportsLogo from '../../assets/icons/footer/teamsports-logo.svg';
import usFlag from '../../assets/icons/header/US.png';

const FAMILY_BRANDS = [
    { label: "Brine", href: "https://www.brine.com/", logo: brineLogo },
    { label: "Warrior", href: "https://www.warrior.com/en", logo: warriorLogo },
    { label: "New Balance Team Sports", href: "https://www.newbalanceteam.com/", logo: teamSportsLogo },
];

function Footer() {
    const navigate = useNavigate();
    const isLoggedIn = Boolean(getCurrentUser());
    const { isOpen, toggle } = useOpenItems();

    function handleSignup() {
        navigate("/login");
    }
    return (
        <>
            <footer className="footer">

                {!isLoggedIn && (
                    <div className="footer-signup">
                        <p>Be the first to know about new arrivals</p>
                        <button onClick={handleSignup}>Sign up</button>
                    </div>
                )}

                <div className="footer-content">

                    <div className="footer-links">

                        {FOOTER_COLUMNS.map((column) => (
                            <div key={column.title} className={`footer-column ${isOpen(column.title) ? "footer-column-open" : ""}`}>
                                <h3>
                                    <button
                                        type="button"
                                        className="footer-column-toggle"
                                        aria-expanded={isOpen(column.title)}
                                        onClick={() => toggle(column.title)}
                                    >
                                        {column.title}
                                        <svg className="footer-column-chevron" viewBox="0 0 16 16" aria-hidden="true">
                                            <path d="M2 5.5 8 11.5l6-6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </h3>

                                <div className="footer-column-links">
                                    {column.links.map((link) => (
                                        link.to ? (
                                            <Link key={link.label} to={link.to} onClick={() => window.scrollTo(0, 0)}>{link.label}</Link>
                                        ) : (
                                            <a key={link.label} href="#">{link.label}</a>
                                        )
                                    ))}
                                </div>
                            </div>
                        ))}

                    </div>

                    <div className="footer-brand">

                        <h2>Fearlessly Independent</h2>

                        <Link to="/" onClick={() => window.scrollTo(0, 0)} aria-label="New Balance home">
                            <img className="footer-logo" src={logo} alt="New Balance"/>
                        </Link>

                        <p>
                            Independent since 1906, we empower people
                            through sport and craftsmanship to create
                            positive change in communities around the
                            world.
                        </p>

                        <div className="social-icons">
                            {SOCIAL_LINKS.map((social) => (
                                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">
                                    <img src={social.icon} alt={social.label} />
                                </a>
                            ))}
                        </div>

                        <div className="footer-region">
                            <span>Change region:</span>
                            <img className="footer-region-flag" src={usFlag} alt="" />
                            <span>US</span>
                        </div>

                    </div>

                </div>

            </footer>

            <footer className="footer-secondary">

                <div className="footer-secondary-brands">
                    <span>New Balance family of brands</span>

                    {FAMILY_BRANDS.map((brand) => (
                        <a
                            key={brand.label}
                            href={brand.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={brand.label}
                        >
                            <img src={brand.logo} alt={brand.label} />
                        </a>
                    ))}
                </div>

                <div className="footer-secondary-top">
                    <img className="US-flag" src={usFlag} alt="US Flag" />

                    <Link to="/country-language" className="footer-locale">
                        <span>US</span>
                    </Link>

                    <Link to="/privacy-policy">Privacy Policy</Link>

                    <Link to="/responsible-disclosure">Responsible Disclosure</Link>

                    <Link to="/terms">Website Terms & Conditions</Link>

                    <Link to="/supply-chains-act">CA Supply Chains Act (SB 657) and Modern Slavery Act Statement</Link>

                    <Link to="/health-data-privacy">Health Data Privacy Policy</Link>

                    <Link to="/privacy-choices" className="footer-privacy-choices">
                        <span>Do Not Sell or Share My Personal Information</span>
                        <svg className="footer-privacy-icon" viewBox="0 0 60 28" aria-hidden="true">
                            <rect x="1" y="1" width="58" height="26" rx="13" fill="#fff" stroke="#0066ff" strokeWidth="2" />
                            <path d="M30 1h16a13 13 0 0 1 0 26H24Z" fill="#0066ff" />
                            <path d="M12 14.5l4.5 4.5 8-9" fill="none" stroke="#0066ff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M38 9l10 10M48 9 38 19" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
                        </svg>
                    </Link>

                    <p className="footer-copyright">Copyright 2026, New Balance</p>
                </div>

            </footer>

        </>
    )
}

export default Footer