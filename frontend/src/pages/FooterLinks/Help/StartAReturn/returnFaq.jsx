import { Link } from "react-router-dom";

export function getReturnFaq() {
    return [
        {
            id: "return-policy",
            question: "What is your return policy?",
            answer: (
                <>
                    <p>
                        If you aren’t completely satisfied with your purchase, we accept returns in new condition within 45 days of the shipping date (for online purchases) or purchase date (for in-store purchases) for a refund to the original form of payment. A valid receipt, order confirmation email, or packing list is required. New Balance reserves the right to refuse worn or damaged merchandise. Items that are marked non-returnable or final sale cannot be returned.
                    </p>
                    <p>
                        Online orders may be returned online or in-store at a New Balance or New Balance Factory store. Items purchased in store or at New Balance-hosted events must be returned in store or at the event.
                    </p>
                    <p>
                        Online orders are subject to a $5 restocking fee for non-members that will be deducted from your refund. Members receive free returns, <Link to="/login">create an account or login</Link> to take advantage of this member benefit. All in-store returns are free.
                    </p>
                    <p>
                        <strong>New Balance Fit Promise™ for Sports Bras:</strong> New Balance Athletics, Inc. is proud to offer a Fit Promise for the following sports bras purchased after February 1, 2025 at a New Balance retail store or newbalance.com: the RC Bra (WB51052), NB Essential Run Bra (WB51032), NB Define Train Bra (WB51053), NB Essential Train Bra (WB51035), NB Harmony Yoga Bra (WB51037), NB Essential Yoga Bra (WB51039), Klutch X NB Racerback Bra (WB53612), and AC Train Bra (WB61Q0QK).
                    </p>
                </>
            )
        },
        {
            id: "refund-time",
            question: "When will I receive my refund?",
            answer: (
                <>
                    <p><strong>Shipped Returns</strong></p>
                    <p>Please allow up to 14 days after we receive your shipped return for your refund to process and post to your payment method.</p>
                    <p><strong>In-Store Returns</strong></p>
                    <p>Returns made in-store receive an immediate refund. Find your closest store <Link to="/stores">here</Link>. In-store returns are always free.</p>
                </>
            )
        },
        {
            id: "online-to-store",
            question: "Can I return my online order to a New Balance Store?",
            answer: (
                <>
                    <p>Yes, online orders can be returned to New Balance and New Balance Factory Stores within 45 days of the purchase date for an immediate refund.</p>
                    <p>To return to a store:</p>
                    <ol>
                        <li>Find your closest store <Link to="/stores">here</Link>.</li>
                        <li>Bring your items and packing slip or email order confirmation to the store. No need to repack your items.</li>
                        <li>Receive your refund immediately. Our store associates will take care of the rest.</li>
                    </ol>
                    <p>Please note: Items must be in new condition, in the state you received them. Items marked “non-returnable” or “final sale” cannot be returned.</p>
                </>
            )
        },
        {
            id: "make-return",
            question: "How do I make a return?",
            answer: (
                <>
                    <p>You can return your items to any New Balance or New Balance Factory Store or ship your items back to us within 45 days of the purchase date. Eligible items must be returned in new condition, in the state you received them.</p>
                    <p>To return to a store, simply bring your items (no need to repack) and packing slip or order confirmation email. Find your closest store <Link to="/stores">here</Link>.</p>
                    <p>To ship your return back to us, contact our <Link to="/help">Customer Care team</Link>.</p>
                </>
            )
        },
        {
            id: "exchange",
            question: "Can I exchange an item instead of returning?",
            answer: (
                <>
                    <p>We do not offer direct exchanges for online orders. Instead, return your item in a store or through our <Link to="/help">Customer Care team</Link> and place a new order for a replacement item.</p>
                    <p>Select styles are available at New Balance and New Balance Factory Stores. <Link to="/stores">Find your closest store</Link> to complete your return and quickly shop for a replacement item.</p>
                </>
            )
        },
        {
            id: "discount",
            question: "I had a discount on my return order. How do I get a discount on my new order?",
            answer: (
                <p>
                    If the discount you used for your original order has expired, simply contact our <Link to="/help">Customer Care team</Link> to have the discount applied to your new order. Some single-use coupons cannot be reissued or applied to additional orders. See coupon terms for details.
                </p>
            )
        },
        {
            id: "territories",
            question: "I live in Alaska, Hawaii, Guam, Puerto Rico or another U.S. Territory. How do I make a return?",
            answer: (
                <p>To get a prepaid USPS label for the above areas, contact our <Link to="/help">Customer Care team</Link>.</p>
            )
        },
        {
            id: "apo-fpo",
            question: "I have an APO/FPO address. How do I make a return?",
            answer: (
                <p>To get a prepaid USPS label for APO/FPO addresses, contact our <Link to="/help">Customer Care team</Link>.</p>
            )
        },
        {
            id: "gift",
            question: "How do I return a gift?",
            answer: (
                <>
                    <p>To receive an electronic Gift Card for the value of your return, contact our <Link to="/help">Customer Care team</Link>.</p>
                    <p>To receive a refund to the original payment, contact our <Link to="/help">Customer Care team</Link>.</p>
                    <p>Gifts can be returned in-store for a Gift Card.</p>
                </>
            )
        },
        {
            id: "store-purchase-online",
            question: "Can I return a New Balance Store purchase online?",
            answer: (
                <>
                    <p>No, return labels cannot be generated for in-store purchases. Instead, items purchased at our stores can be returned to any New Balance or New Balance Factory Store.</p>
                    <p>Find your closest store <Link to="/stores">here</Link>.</p>
                </>
            )
        },
        {
            id: "other-retailer",
            question: "Can I return a New Balance item purchased from another retailer to you?",
            answer: (
                <p>No, please return the item to the original purchase location.</p>
            )
        },
        {
            id: "closed-account",
            question: "How will refunds be received if the purchasing account or card is closed?",
            answer: (
                <p>If the bank account or credit card used for payment is no longer active, refunds will be credited to an eGift Card.</p>
            )
        },
        {
            id: "wrong-item",
            question: "What happens if I accidentally return the wrong item to New Balance?",
            answer: (
                <p>While we're very sorry the item returned to our warehouse was not what was intended, New Balance is not responsible for this error and does not have the ability to send the item back to you.</p>
            )
        },
        {
            id: "ndurance",
            question: "How does the NDurance rubber outsole limited warranty guarantee work?",
            answer: (
                <>
                    <p><strong>New Balance 6-Month NDurance Rubber Outsole Limited Warranty Guarantee</strong></p>
                    <p>Thank you for buying New Balance tennis shoes. The useful life of a tennis shoe will vary depending upon the frequency of its use, the surfaces upon which it is used and the wearer’s style of play. New Balance’s 6-month NDurance Rubber Outsole Limited Warranty Guarantee only applies to the hard court–specific NDurance rubber outsole of the following shoes:</p>
                    <ul>
                        <li>996</li>
                        <li>1007</li>
                        <li>CT-RALLY</li>
                        <li>WCHCOC</li>
                    </ul>
                    <p>To qualify:</p>
                    <ul>
                        <li>
                            The outsole must be completely worn through exposing the midsole of the shoe within 6 months of purchase.
                            <ul>
                                <li>The uppers of these models are not covered under this 6-Month NDurance Rubber Outsole Limited Warranty Guarantee.</li>
                            </ul>
                        </li>
                        <li>
                            This complete outsole wear must be the result of playing tennis.
                            <ul>
                                <li>Damage caused by misuse, abuse, improper or unauthorized repairs, “acts of God” or other events beyond New Balance’s control will not qualify for this guarantee.</li>
                            </ul>
                        </li>
                        <li>You must have purchased the covered shoe from a retail store within the 50 United States or the District of Columbia, or through www.newbalance.com or another online retailer and your delivery address was within the 50 United States or the District of Columbia.</li>
                    </ul>
                    <p><strong>Claims Process</strong></p>
                    <p>If your pair of tennis shoes meets the requirements for replacement as described in the points above, please visit our <Link to="/help">customer service page</Link> to contact our customer care team to start your claim.</p>
                    <ul>
                        <li>You must initiate your claim within six months of the date of purchase as recorded on your original receipt.</li>
                        <li>You will receive an email notification with instructions for the return. New Balance will handle all shipping and handling costs for the return of the shoe. Please include a copy of such email notification in the box with your shoes.</li>
                        <li>
                            After inspection and confirmation that the returned shoes qualify under the NDurance Rubber Outsole Limited Warranty Guarantee, New Balance will provide you with a promo code to be used for replacement shoes of the same model on newbalance.com.
                            <ul>
                                <li>Please note that this promo code cannot be redeemed in stores.</li>
                                <li>If a returned pair of shoes does not qualify for replacement as described above, New Balance will return the original pair of shoes directly to you.</li>
                            </ul>
                        </li>
                    </ul>
                    <p><strong>Additional Details</strong></p>
                    <ul>
                        <li>This limited guarantee program is for shoes purchased between January 1st, 2026 through December 31st, 2026.</li>
                        <li>Warranty claims should be made through newbalance.com.</li>
                        <li>The initial contact with New Balance Customer Care or the shipping date of the returned shoes must occur within 6 months of the date of purchase as recorded on your original receipt.</li>
                        <li>Any product submitted without a copy of the email notification sent by New Balance will be returned without inspection.</li>
                        <li>Some states do not allow limitations on how long an implied warranty lasts, so the above time limitation may not apply to you.</li>
                        <li>This is the entire warranty. No other warranty, express or implied, shall apply except as expressly stated above.</li>
                    </ul>
                </>
            )
        },
        {
            id: "multiple-boxes",
            question: "What if I have multiple items to returns that won't fit in one package?",
            answer: (
                <>
                    <p><strong>Multiple Box Returns</strong></p>
                    <p>If your return won’t fit in one box:</p>
                    <ul>
                        <li>Use one return label per box.</li>
                        <li>Create a separate return for each box by selecting only the items going into that box.</li>
                        <li>Do not combine items from different orders in the same box.</li>
                        <li>A $5 restocking fee applies to each return for non-members. No restock fees for members and membership is free.</li>
                    </ul>
                </>
            )
        },
        {
            id: "fit-promise",
            question: "What is the Fit Promise for Sports Bras?",
            answer: (
                <>
                    <p><strong>New Balance Fit Promise™ for Sports Bras</strong></p>
                    <p>If you run, if you play – however you move for fitness – we believe a properly fitting sports bra is transformative.</p>
                    <p>New Balance Athletics, Inc. is proud to offer a Fit Promise for the following sports bras purchased after February 1, 2025 at a New Balance retail store (excluding New Balance factory stores) or newbalance.com: the RC Bra (WB51052), NB Essential Run Bra (WB51032), NB Define Train Bra (WB51053), NB Essential Train Bra (WB51035), NB Harmony Yoga Bra (WB51037), NB Essential Yoga Bra (WB51039), Klutch X NB Racerback Bra (WB53612), and AC Train Bra (WB61Q0QK).</p>
                    <p>Even after you’ve removed the tags and taken it for a run, we’ll take eligible sports bras back within 45 days from date of purchase or shipment, for a refund to the original form of payment. Sports bras are made for motion, so we encourage you to test the fit by hitting the gym, court, or field and trying it out. If you would like a different size or color of the same style, you can return the original product and repurchase the desired item.</p>
                    <p>To take advantage of the Fit Promise for Sports Bras, you must process a return either through our <Link to="/help">Customer Care team</Link> or in-store with your order number or receipt at any New Balance retail store. If you purchased your sports bra in-store, you must process your return in-store. If you purchased your sports bra online, you may process your return in-store or online. This service is provided at no charge to you if returned in-store or if you are a newbalance.com account holder. However, a $5 restocking fee will apply to online returns if you do not have an account on newbalance.com.</p>
                    <p>This Fit Promise for Sports Bras does not cover:</p>
                    <ul>
                        <li>Damage resulting from improper care (e.g., using a hot iron on the fabric)</li>
                        <li>Damage from misuse or unreasonable use, abuse, or improper or unauthorized repairs</li>
                        <li>Replacement of lost items</li>
                    </ul>
                </>
            )
        }
    ];
}