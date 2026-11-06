import './TopHeader.css'
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SelectStoreModal from "../SelectStore/SelectStoreModal.jsx";
import { useSelectedStore } from "../SelectStore/selectedStore.js";
import PromoBar from "../PromoBar/PromoBar.jsx";

// SVG
import usFlag from '../../assets/icons/header/US.png';
import locationPin from '../../assets/icons/header/location-pin.svg';

const HELP_LINKS = [
    { label: "Order Status", to: "/order-status" },
    { label: "FAQ", to: "/faqs" },
    { label: "Help", to: "/help" },
];

function TopHeader() {
    const [helpPinned, setHelpPinned] = useState(false);
    const [helpHovered, setHelpHovered] = useState(false);
    const helpRef = useRef(null);
    const helpCloseTimer = useRef(null);
    const helpOpen = helpPinned || helpHovered;
    const [storeModalOpen, setStoreModalOpen] = useState(false);
    const closeStoreModal = useCallback(() => setStoreModalOpen(false), []);
    const selectedStore = useSelectedStore();

    useEffect(() => {
        if (!helpPinned) return;

        function handleClickOutside(event) {
            if (helpRef.current && !helpRef.current.contains(event.target)) {
                setHelpPinned(false);
            }
        }

        function handleEscape(event) {
            if (event.key === "Escape") {
                setHelpPinned(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [helpPinned]);

    useEffect(() => () => clearTimeout(helpCloseTimer.current), []);

    function handleHelpLinkClick() {
        clearTimeout(helpCloseTimer.current);
        setHelpPinned(false);
        setHelpHovered(false);
        window.scrollTo(0, 0);
    }

    return (
        <>
            <header className="top-header">
                <div className="left-menu">
                    <img className="US-flag" src={usFlag} alt=""/>

                    <Link to="/country-language">US</Link>
                    <span>|</span>

                    <img className="location-pin" src={locationPin} alt=""/>
                    <button type="button" className="store-toggle" onClick={() => setStoreModalOpen(true)}>
                        {selectedStore ? (
                            <span className="store-current">
                                <span className="store-current-label">You're Shopping:</span>
                                <span className="store-current-name">{selectedStore.name}</span>
                            </span>
                        ) : "Select a Store"}
                    </button>
                </div>

                <PromoBar />

                <div className="right-menu">
                    <div
                        className="help-menu"
                        ref={helpRef}
                        onMouseEnter={() => {
                            clearTimeout(helpCloseTimer.current);
                            setHelpHovered(true);
                        }}
                        onMouseLeave={() => {
                            helpCloseTimer.current = setTimeout(() => setHelpHovered(false), 80);
                        }}
                    >
                        <button
                            type="button"
                            className="help-toggle"
                            onClick={() => setHelpPinned((pinned) => !pinned)}
                            aria-expanded={helpOpen}
                            aria-haspopup="true"
                        >
                            Help
                            <svg className={`help-chevron ${helpOpen ? "help-chevron-open" : ""}`} viewBox="0 0 12 12" aria-hidden="true">
                                <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>

                        {helpOpen && (
                            <div className="help-dropdown">
                                {HELP_LINKS.map((link) => (
                                    <Link key={link.to} to={link.to} onClick={handleHelpLinkClick}>
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {storeModalOpen && <SelectStoreModal onClose={closeStoreModal} />}
        </>
    )
}

export default TopHeader