import { Link } from "react-router-dom";

export const HELP_FAQ = [
    {
        id: "return-policy",
        question: "What is your return policy?",
        answer: (
            <p>
                If you aren't completely happy with your purchase, we accept returns of merchandise in new condition within 45 days of purchase. Returns must be in new condition, in the state you received them. New Balance reserves the right to refuse worn or damaged merchandise. Unfortunately, we cannot accept returns on non-returnable items. <Link to="/returns">Learn more about returns</Link>.
            </p>
        )
    },
    {
        id: "ship-time",
        question: "When can I expect my order to ship?",
        answer: (
            <>
                <p>
                    All in-stock items ship within 2 business days. You will receive a shipping confirmation email with tracking when your order ships. If your order is split into more than one shipment, you will receive separate emails for each shipment.
                </p>
                <p>Carrier delivery times go into effect once your order has shipped.</p>
                <p>
                    You can track your order by <Link to="/login">logging into your account</Link> and opening your order history.
                </p>
            </>
        )
    },
    {
        id: "delivery-time",
        question: "When should I expect my order?",
        answer: (
            <>
                <p>
                    In-stock items ship within 2 business days. Carrier delivery times go into effect once your order has shipped. UPS does not deliver on weekends or holidays.
                </p>
                <ul>
                    <li>Standard (UPS Ground) - 2-5 business days once shipped</li>
                    <li>Expedited (UPS 2-Day Air) - 2 business days once shipped</li>
                    <li>Rush (UPS 1-Day Air) - 1 business day once shipped</li>
                    <li>USPS - 2-7 business days once shipped</li>
                </ul>
                <p>
                    You will receive a shipping confirmation email with tracking when your order ships. For more information about shipping rates and details, click here.
                </p>
            </>
        )
    },
    {
        id: "discount",
        question: "How do I get a discount?",
        answer: (
            <>
                <p>
                    Sign up for our email list to get a discount on your next order and to be notified about new promotions throughout the year. For early access to promotions and to receive exclusive offers, <Link to="/login">create an account</Link> with us.
                </p>
                <p>Additionally, we offer a special ongoing 15% off discount to the following groups:</p>
                <ul>
                    <li>Teachers</li>
                    <li>Hospital employees</li>
                    <li>Medical employees</li>
                    <li>Nurses</li>
                    <li>First responders</li>
                    <li>Military members</li>
                    <li>Government employees</li>
                    <li>Seniors 60+</li>
                </ul>
                <p>
                    If you’re in one of these groups, simply verify your affiliation using ID.me to receive your unique promo code. Exclusions apply.
                </p>
            </>
        )
    },
    {
        id: "clean-shoes",
        question: "How should I clean my shoes?",
        answer: (
            <>
                <p>
                    Clean your running shoes and other athletic shoes with a mild, dye-free detergent (either for dishwashing or laundry) and a bristle brush (such as a toothbrush) following the steps below.
                </p>
                <ol>
                    <li>Test a small amount of the detergent on an unnoticeable part of your shoes to make sure it won’t stain them.</li>
                    <li>Use your bristle brush to scrub the shoes with the detergent.</li>
                    <li>Wipe shoes clean with a damp cloth.</li>
                    <li>Allow your shoes to air dry for 24 hours before wearing.</li>
                </ol>
                <p>For shoes made of suede or leather, use a specialty leather or suede cleaner.</p>
                <p>
                    We do not suggest putting any of our shoes into the washing machine or dryer since many of our materials should not be fully submerged in water or exposed to heat.
                </p>
            </>
        )
    },
    {
        id: "shoe-type",
        question: "Should I buy a running shoe, a walking shoe or a training shoe?",
        answer: (
            <>
                <p>
                    We design our running, walking and training shoes to support the unique demands of each activity. To help you stay comfortable and perform your best, we suggest choosing shoes designed for your specific sport or workout. This may mean you wear a running shoe while training for your 10K but switch to a training shoe for gym days.
                </p>
                <p><strong>Benefits of Running Shoes</strong></p>
                <ul>
                    <li>Generally have more cushioning in the heel at the point of impact, plus support technology specific to a running stride</li>
                    <li>Made with more mesh to help keep feet cool during runs</li>
                </ul>
                <p><strong>Benefits of Walking Shoes</strong></p>
                <ul>
                    <li>Designed with the specific body mechanics and strike path of walking in mind</li>
                    <li>Constructed to be more flexible through the ball of the foot to allow for a greater range of motion through the roll of the forefoot</li>
                    <li>Have greater arch support to protect where the force is heaviest on the foot</li>
                </ul>
                <p><strong>Benefits of Training Shoes</strong></p>
                <ul>
                    <li>Provide additional support for both forward and lateral movements</li>
                    <li>Designed for a variety of cross-training workouts, including HIIT, strength training, step aerobics, boot camps and short treadmill jogs</li>
                    <li>While not intended for use in long races (i.e., half marathons and marathons), our training shoes can be used in shorter runs (i.e., mile races and treadmill warm-ups)</li>
                </ul>
            </>
        )
    },
    {
        id: "payments",
        question: "What payments do you accept?",
        answer: (
            <>
                <p>We accept the following payment options: Visa, MasterCard, American Express, Discover, PayPal, and Afterpay.</p>
                <p>
                    To save credit cards, debit cards, and gift cards for faster checkout, <Link to="/login">log in or create an account</Link>.
                </p>
            </>
        )
    },
    {
        id: "membership",
        question: "How do I become a member?",
        answer: (
            <>
                <p>
                    To become a member, create an account online by visiting our <Link to="/login">log in or create an account</Link> page and fill out the required information. Become a member for early access to promotions and to receive exclusive offers.
                </p>
                <p>
                    Creating an account and becoming a member lets you easily track orders, check out faster, hear about promotions and new releases first.
                </p>
            </>
        )
    },
    {
        id: "pickup",
        question: "Can I buy something online and pick it up at my local New Balance store?",
        answer: (
            <>
                <p>
                    Yes, a selection of products that are for sale on newbalance.com are also available in a New Balance store near you. To see pickup options during checkout, choose “Pick up in store” and use your zip code to select your local store.
                </p>
                <p>
                    You can also set your store while shopping by using the store selector in the upper left hand corner or in the mobile menu.
                </p>
            </>
        )
    }
];