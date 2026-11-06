import { Link } from "react-router-dom";
import shippingImage from "../../../../assets/images/account-page/photo1.jpg";
import offersImage from "../../../../assets/images/account-page/photo2.jpg";
import birthdayImage from "../../../../assets/images/account-page/photo3.jpg";
import footScanImage from "../../../../assets/images/new/launch-calendar.jpg";
import eventsImage from "../../../../assets/images/main-page/NB10165_SideBySide_Amine_1890_Mobile_1x1-1.jpg";
import earlyAccessImage from "../../../../assets/images/new/men-arrivals.jpg";

export const MEMBER_BENEFITS = [
    {
        id: "shipping",
        title: "Free shipping & returns",
        text: "Get free shipping and returns on all orders.",
        image: shippingImage
    },
    {
        id: "offers",
        title: "Special offers",
        text: "Receive members only offers and sales.",
        image: offersImage
    },
    {
        id: "birthday",
        title: "Birthday rewards",
        text: "Members receive a special offer on their birthday.",
        image: birthdayImage
    },
    {
        id: "foot-scan",
        title: "3D foot scan",
        text: "Always have access to your best fit. Members can save the 3D foot scan performed in-store to their New Balance account.",
        image: footScanImage
    },
    {
        id: "events",
        title: "Event invitations",
        text: "Members are invited to select New Balance events.",
        image: eventsImage
    },
    {
        id: "early-access",
        title: "Early access",
        text: "Members are offered the chance to purchase select product before the global release.",
        image: earlyAccessImage
    }
];

export const MEMBER_FAQ = [
    {
        id: "become",
        question: "How do I become a New Balance member?",
        answer: (
            <p>You can become a member by <Link to="/login">creating an account</Link> on newbalance.com or by signing up in store.</p>
        )
    },
    {
        id: "benefits",
        question: "What benefits do I get as a New Balance member?",
        answer: (
            <>
                <p>As a New Balance member, you can unlock a whole host of benefits:</p>
                <ul>
                    <li><strong>Always on free shipping</strong></li>
                    <li><strong>Free returns</strong></li>
                    <li><strong>Access your 3D foot scan from your account</strong></li>
                    <li><strong>Receive special offers and promos</strong></li>
                    <li><strong>Receive birthday offers</strong></li>
                    <li><strong>Get invited to select New Balance events</strong></li>
                    <li><strong>Get a chance to win early access on select product launches</strong></li>
                </ul>
            </>
        )
    },
    {
        id: "cost",
        question: "How much does it cost to be a member?",
        answer: (
            <p>There is no cost associated with becoming a member. It’s 100% free.</p>
        )
    },
    {
        id: "start",
        question: "When can I start using my benefits?",
        answer: (
            <p>You can enjoy benefits immediately after signing up in store or creating an account on newbalance.com. In order to access online member benefits, members must <Link to="/login">log in</Link>. Members that signed up in store need to create an online account and log in to access online member benefits.</p>
        )
    },
    {
        id: "emails",
        question: "How do I opt in to receive emails as a New Balance member?",
        answer: (
            <p>You can opt in when you create your account, or subscribe to our emails at any time.</p>
        )
    },
    {
        id: "scan",
        question: "How can I get a 3D foot scan?",
        answer: (
            <p>3D foot scans are an in-store service, performed at select New Balance retail locations. To find the location nearest you, navigate to our <Link to="/stores">find a store</Link> page.</p>
        )
    },
    {
        id: "scan-account",
        question: "How can I get my 3D foot scan added to my account?",
        answer: (
            <p>When you have your 3D foot scan performed at a participating New Balance retail location, make sure to provide the same email address that you used to create your account.</p>
        )
    },
    {
        id: "delete",
        question: "How do I delete my account?",
        answer: (
            <p>You can delete your account at any time by signing in and visiting My Account. From there, select Delete Account on the profile tab and follow the on‑screen instructions to confirm.</p>
        )
    }
];